import * as pdfjsLib from "pdfjs-dist";
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export const MAX_RESUME_FILE_SIZE = 2 * 1024 * 1024; // 2 MB limit

// Configure PDF.js worker URL
try {
  if (pdfjsLib?.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  }
} catch (e) {
  console.warn("[ResumeReader] Could not set workerSrc:", e);
}

export function isPdf(file) {
  if (!file) return false;
  return (
    file.type === "application/pdf" ||
    file.name?.toLowerCase().endsWith(".pdf")
  );
}

export function isImage(file) {
  if (!file) return false;
  return (
    ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type) ||
    /\.(jpe?g|png|webp)$/i.test(file.name || "")
  );
}

export function isDocx(file) {
  if (!file) return false;
  return (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name?.toLowerCase().endsWith(".docx")
  );
}

export function isText(file) {
  if (!file) return false;
  return (
    file.type?.startsWith("text/") ||
    /\.(txt|text|md|markdown|rtf|csv)$/i.test(file.name || "")
  );
}

/**
 * Creates a Tesseract OCR worker safely
 */
async function createOcrWorker() {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  return worker;
}

/**
 * Preprocesses an image to improve OCR accuracy and reduce memory usage on mobile
 */
async function prepareImage(source) {
  const image = source instanceof ImageBitmap ? source : await createImageBitmap(source);
  const maxDim = Math.max(image.width, image.height);
  const scale = Math.min(2.0, 1800 / Math.max(1, maxDim));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  if (image.close) image.close();

  // Grayscale & contrast enhancement
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const gray = Math.round(d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
    // Simple binarization threshold to sharpen text against background
    const enhanced = gray > 180 ? 255 : gray < 70 ? 0 : gray;
    d[i] = enhanced;
    d[i + 1] = enhanced;
    d[i + 2] = enhanced;
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Fallback raw text extractor for uncompressed or raw streams in a PDF
 */
async function extractRawPdfText(arrayBuffer) {
  try {
    const bytes = new Uint8Array(arrayBuffer);
    const textDecoder = new TextDecoder("utf-8", { fatal: false, ignoreBOM: true });
    const rawString = textDecoder.decode(bytes);

    const extractedStrings = [];

    // 1. Look for uncompressed text in BT ... ET blocks
    const btRegex = /BT[\s\S]*?ET/g;
    let match;
    while ((match = btRegex.exec(rawString)) !== null) {
      const block = match[0];
      // Match text in parentheses (text) Tj or ' or "
      const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
      let tjMatch;
      while ((tjMatch = tjRegex.exec(block)) !== null) {
        if (tjMatch[1] && tjMatch[1].length > 1) {
          extractedStrings.push(tjMatch[1].replace(/\\([()\\])/g, "$1"));
        }
      }
      // Match bracket array text [(text) -10 (more)] TJ
      const arrayRegex = /\[(.*?)\]\s*TJ/g;
      let arrMatch;
      while ((arrMatch = arrayRegex.exec(block)) !== null) {
        const inner = arrMatch[1];
        const innerTj = /\(([^)]+)\)/g;
        let innerMatch;
        while ((innerMatch = innerTj.exec(inner)) !== null) {
          if (innerMatch[1]) {
            extractedStrings.push(innerMatch[1].replace(/\\([()\\])/g, "$1"));
          }
        }
      }
    }

    if (extractedStrings.length > 5) {
      return extractedStrings.join(" ").replace(/\s+/g, " ").trim();
    }

    // 2. Try decompressing FlateDecode streams using browser DecompressionStream if available
    if (typeof DecompressionStream !== "undefined") {
      const streamRegex = /<<[\s\S]*?\/FlateDecode[\s\S]*?>>\s*stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
      let streamMatch;
      const decompressedParts = [];

      while ((streamMatch = streamRegex.exec(rawString)) !== null) {
        const streamStartIndex = streamMatch.index + streamMatch[0].indexOf("stream") + 6;
        // Skip leading CRLF
        let dataStart = streamStartIndex;
        if (bytes[dataStart] === 0x0d) dataStart++;
        if (bytes[dataStart] === 0x0a) dataStart++;

        const streamEndIndex = rawString.indexOf("endstream", dataStart);
        if (streamEndIndex > dataStart) {
          const streamSlice = bytes.subarray(dataStart, streamEndIndex);
          try {
            const ds = new DecompressionStream("deflate");
            const writer = ds.writable.getWriter();
            writer.write(streamSlice).catch(() => {});
            writer.close().catch(() => {});
            const reader = ds.readable.getReader();
            const chunks = [];
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              if (value) chunks.push(value);
            }
            if (chunks.length > 0) {
              const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
              const combined = new Uint8Array(totalLen);
              let offset = 0;
              for (const c of chunks) {
                combined.set(c, offset);
                offset += c.length;
              }
              const decompressedStr = textDecoder.decode(combined);
              const tjInStream = /\(([^)]+)\)\s*(?:Tj|'|")/g;
              let sm;
              while ((sm = tjInStream.exec(decompressedStr)) !== null) {
                if (sm[1] && sm[1].trim().length > 1) {
                  decompressedParts.push(sm[1].replace(/\\([()\\])/g, "$1"));
                }
              }
            }
          } catch {
            // Ignore stream decompress error, proceed to next stream
          }
        }
      }

      if (decompressedParts.length > 5) {
        return decompressedParts.join(" ").replace(/\s+/g, " ").trim();
      }
    }
  } catch (err) {
    console.warn("[ResumeReader] Raw PDF extraction fallback error:", err);
  }
  return "";
}

/**
 * Extracts text from a PDF file using PDF.js with OCR and stream fallbacks
 */
export async function extractPdfText(file) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Data = new Uint8Array(arrayBuffer);

  let pdfDocument = null;
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Data,
      useSystemFonts: true,
      isEvalSupported: false,
      disableFontFace: false,
    });
    pdfDocument = await loadingTask.promise;
  } catch (err) {
    console.warn("[ResumeReader] PDF.js getDocument failed with primary worker, attempting fallback:", err);

    // Fallback attempt: try setting CDN worker if local worker failed in mobile WebView
    try {
      if (pdfjsLib?.GlobalWorkerOptions) {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
      }
      const loadingTaskFallback = pdfjsLib.getDocument({
        data: uint8Data,
        useSystemFonts: true,
        isEvalSupported: false,
      });
      pdfDocument = await loadingTaskFallback.promise;
    } catch (fallbackErr) {
      console.warn("[ResumeReader] PDF.js fallback getDocument also failed:", fallbackErr);
    }
  }

  // If PDF.js succeeded, extract text layer
  if (pdfDocument) {
    try {
      const pageCount = pdfDocument.numPages || 1;
      const pageTexts = [];

      for (let i = 1; i <= pageCount; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();
        const lineStrings = [];
        for (const item of textContent.items || []) {
          if (item && typeof item.str === "string") {
            lineStrings.push(item.str);
          }
        }
        pageTexts.push(lineStrings.join(" "));
      }

      const text = pageTexts
        .join("\n\n")
        .replace(/[ \t]+/g, " ")
        .replace(/\n\s*\n/g, "\n\n")
        .trim();

      // If we extracted a substantial amount of text, return it directly!
      if (text.length >= 25) {
        return text;
      }

      // If text layer is nearly empty, this is likely a scanned PDF.
      // Attempt OCR sequentially on the first 4 pages.
      try {
        const ocrWorker = await createOcrWorker();
        try {
          const maxOcrPages = Math.min(pageCount, 4);
          const ocrResults = [];

          for (let i = 1; i <= maxOcrPages; i++) {
            const page = await pdfDocument.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement("canvas");
            canvas.width = Math.ceil(viewport.width);
            canvas.height = Math.ceil(viewport.height);
            await page.render({
              canvasContext: canvas.getContext("2d"),
              viewport,
            }).promise;

            const { data } = await ocrWorker.recognize(canvas);
            if (data?.text?.trim()) {
              ocrResults.push(data.text.trim());
            }
          }

          const ocrText = ocrResults.join("\n\n").trim();
          if (ocrText.length >= 20) {
            return ocrText;
          }
        } finally {
          await ocrWorker.terminate();
        }
      } catch (ocrErr) {
        console.warn("[ResumeReader] Scanned PDF OCR failed or offline:", ocrErr);
        // If we had at least some text from the text layer, return it
        if (text.length > 0) return text;
      }

      if (text.length > 0) return text;
    } finally {
      try {
        await pdfDocument.destroy();
      } catch {}
    }
  }

  // Raw stream scan fallback if PDF.js failed or returned nothing
  const rawText = await extractRawPdfText(arrayBuffer);
  if (rawText && rawText.length >= 25) {
    return rawText;
  }

  throw new Error(
    "Could not extract readable text from this PDF. If this is a scanned document, please ensure a clear image or paste your resume text."
  );
}

/**
 * Extracts text from an image file using Tesseract OCR
 */
export async function extractImageText(file) {
  let worker = null;
  try {
    worker = await createOcrWorker();
    const canvas = await prepareImage(file);
    const { data } = await worker.recognize(canvas);
    const text = (data?.text || "").trim();
    if (!text || text.length < 10) {
      throw new Error("No readable text detected in this image.");
    }
    return text;
  } catch (err) {
    console.error("[ResumeReader] Image OCR error:", err);
    throw new Error(
      err.message?.includes("network") || err.message?.includes("fetch")
        ? "OCR language data could not be downloaded. Please verify your internet connection or paste your resume text."
        : "Could not read text from this image. Please try a clearer picture or paste your resume text directly."
    );
  } finally {
    if (worker) {
      try {
        await worker.terminate();
      } catch {}
    }
  }
}

/**
 * Extracts plain text from a Word .docx document using PKZip / DecompressionStream
 */
export async function extractDocxText(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // Look for word/document.xml in local file headers
    // PK\x03\x04 signature is [0x50, 0x4b, 0x03, 0x04]
    let pos = 0;
    while (pos < bytes.length - 30) {
      if (
        bytes[pos] === 0x50 &&
        bytes[pos + 1] === 0x4b &&
        bytes[pos + 2] === 0x03 &&
        bytes[pos + 3] === 0x04
      ) {
        const compressionMethod = bytes[pos + 8] | (bytes[pos + 9] << 8);
        const compressedSize =
          bytes[pos + 18] |
          (bytes[pos + 19] << 8) |
          (bytes[pos + 20] << 16) |
          (bytes[pos + 21] << 24);
        const fileNameLength = bytes[pos + 26] | (bytes[pos + 27] << 8);
        const extraFieldLength = bytes[pos + 28] | (bytes[pos + 29] << 8);

        const fileNameBytes = bytes.subarray(pos + 30, pos + 30 + fileNameLength);
        const fileName = new TextDecoder().decode(fileNameBytes);

        const fileDataStart = pos + 30 + fileNameLength + extraFieldLength;

        if (fileName === "word/document.xml") {
          let xmlContent = "";
          if (compressionMethod === 0) {
            // Uncompressed
            const xmlBytes = bytes.subarray(fileDataStart, fileDataStart + compressedSize);
            xmlContent = new TextDecoder().decode(xmlBytes);
          } else if (compressionMethod === 8 && typeof DecompressionStream !== "undefined") {
            // Deflate-raw compressed
            const slice = bytes.subarray(fileDataStart, fileDataStart + compressedSize);
            const ds = new DecompressionStream("deflate-raw");
            const writer = ds.writable.getWriter();
            writer.write(slice).catch(() => {});
            writer.close().catch(() => {});

            const reader = ds.readable.getReader();
            const chunks = [];
            while (true) {
              const { value, done } = await reader.read();
              if (done) break;
              if (value) chunks.push(value);
            }
            const totalLen = chunks.reduce((a, b) => a + b.length, 0);
            const combined = new Uint8Array(totalLen);
            let off = 0;
            for (const c of chunks) {
              combined.set(c, off);
              off += c.length;
            }
            xmlContent = new TextDecoder().decode(combined);
          }

          if (xmlContent) {
            // Parse XML and extract text
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlContent, "application/xml");
            const paragraphs = doc.querySelectorAll("p");
            const lines = [];
            paragraphs.forEach((p) => {
              const textNodes = p.querySelectorAll("t");
              let pText = "";
              textNodes.forEach((t) => {
                pText += t.textContent;
              });
              if (pText.trim()) lines.push(pText.trim());
            });
            const result = lines.join("\n\n");
            if (result.length >= 20) return result;
          }
        }
        pos = fileDataStart + Math.max(1, compressedSize);
      } else {
        pos++;
      }
    }
  } catch (err) {
    console.warn("[ResumeReader] DOCX extraction error:", err);
  }

  throw new Error("Could not parse Word document. Please save your resume as PDF or paste the text directly.");
}

/**
 * Universal resume reader that handles PDF, DOCX, TXT, and Images
 */
export async function readResumeFile(file) {
  if (!file) throw new Error("No file selected.");

  if (file.size > MAX_RESUME_FILE_SIZE) {
    throw new Error(
      `Resume file is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is 15 MB.`
    );
  }

  let text = "";

  if (isPdf(file)) {
    text = await extractPdfText(file);
  } else if (isDocx(file)) {
    text = await extractDocxText(file);
  } else if (isImage(file)) {
    text = await extractImageText(file);
  } else if (isText(file)) {
    text = await file.text();
    // Strip simple RTF formatting if applicable
    if (file.name?.toLowerCase().endsWith(".rtf")) {
      text = text.replace(/\{\\[^{}]*\}/g, "").replace(/\\[a-z0-9]+\b/gi, "").replace(/[{}\\]/g, "");
    }
  } else {
    // Attempt reading as text
    try {
      text = await file.text();
      // If it contains lots of null bytes, it's an unsupported binary file
      if (text.includes("\u0000")) {
        throw new Error("Unsupported binary format.");
      }
    } catch {
      throw new Error(
        "Unsupported file format. Please upload a PDF, Word (DOCX), plain text (TXT), or image (JPG/PNG)."
      );
    }
  }

  const cleanText = (text || "").trim();
  if (!cleanText || cleanText.length < 15) {
    throw new Error("No readable text found in that file. Please try another file or paste your resume text.");
  }

  return cleanText;
}
