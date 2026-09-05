import { useState, useEffect } from "react";
import {
  FileCheck,
  Upload,
  ClipboardPaste,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api.js";
import { useToast } from "@/lib/toast.jsx";
import { LoadingOverlay, Spinner } from "@/components/Spinner.jsx";
import { EmptyState } from "@/components/EmptyState.jsx";
import { pct } from "@/lib/format.js";

const MAX_RESUME_FILE_SIZE = 100 * 1024;

function isPdf(file) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

function isImage(file) {
  return (
    ["image/jpeg", "image/png"].includes(file.type) ||
    /\.(jpe?g|png)$/i.test(file.name)
  );
}

async function extractPdfText(file) {
  const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
  GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url,
  ).toString();

  const pdfDocument = await getDocument({ data: await file.arrayBuffer() })
    .promise;
  try {
    const pages = await Promise.all(
      Array.from({ length: pdfDocument.numPages }, async (_, index) => {
        const page = await pdfDocument.getPage(index + 1);
        const content = await page.getTextContent();
        return content.items.map((item) => item.str).join(" ");
      }),
    );
    const text = pages
      .join("\n\n")
      .replace(/[ \t]+\n/g, "\n")
      .trim();
    if (text.length >= 40) return text;

    // Scanned PDFs have no text layer, so render their pages for OCR.
    const worker = await createOcrWorker();
    try {
      const ocrPages = await Promise.all(
        Array.from({ length: pdfDocument.numPages }, async (_, index) => {
          const page = await pdfDocument.getPage(index + 1);
          const viewport = page.getViewport({ scale: 2 });
          const canvas = document.createElement("canvas");
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          await page.render({
            canvasContext: canvas.getContext("2d"),
            viewport,
          }).promise;
          return (await worker.recognize(canvas)).data.text;
        }),
      );
      return ocrPages.join("\n\n").trim();
    } finally {
      await worker.terminate();
    }
  } finally {
    await pdfDocument.destroy();
  }
}

async function createOcrWorker() {
  const { createWorker } = await import("tesseract.js");
  return createWorker("eng");
}

async function prepareImage(file) {
  const image = await createImageBitmap(file);
  const scale = Math.min(2.5, 2400 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const gray = Math.round(
      pixels.data[index] * 0.299 +
        pixels.data[index + 1] * 0.587 +
        pixels.data[index + 2] * 0.114,
    );
    pixels.data[index] = gray;
    pixels.data[index + 1] = gray;
    pixels.data[index + 2] = gray;
  }
  context.putImageData(pixels, 0, 0);
  return canvas;
}

async function extractImageText(file) {
  const worker = await createOcrWorker();
  try {
    const { data } = await worker.recognize(await prepareImage(file));
    return data.text;
  } finally {
    await worker.terminate();
  }
}

export function ResumeCheckPage() {
  const toast = useToast();
  const [sims, setSims] = useState(null);
  const [simError, setSimError] = useState(null);
  const [selectedSim, setSelectedSim] = useState(null);
  const [selectedPath, setSelectedPath] = useState(0);
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [showFileSizeDialog, setShowFileSizeDialog] = useState(false);

  const loadSimulations = async () => {
    setSimError(null);
    try {
      const data = await api.get("/simulations");
      setSims(data.simulations);
      if (data.simulations.length > 0) setSelectedSim(data.simulations[0].id);
    } catch (err) {
      setSims(null);
      setSimError(err.message);
    }
  };

  useEffect(() => {
    loadSimulations();
  }, []);

  const [simDetail, setSimDetail] = useState(null);

  useEffect(() => {
    if (selectedSim) {
      api
        .get(`/simulations/${selectedSim}`)
        .then((d) => {
          setSimDetail(d.simulation);
          setSelectedPath(0);
        })
        .catch(() => setSimDetail(null));
    }
  }, [selectedSim]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_RESUME_FILE_SIZE) {
      setShowFileSizeDialog(true);
      return;
    }
    setExtracting(true);
    try {
      const text = isPdf(file)
        ? await extractPdfText(file)
        : isImage(file)
          ? await extractImageText(file)
          : await file.text();
      if (!text.trim()) {
        toast.error("No readable text was found in that file.");
        return;
      }
      setResumeText(text.trim());
      setResult(null);
      toast.success(`Loaded ${file.name}.`);
    } catch {
      toast.error(
        "Could not read that file. Try a clearer image or a text-based PDF.",
      );
    } finally {
      setExtracting(false);
      e.target.value = "";
    }
  };

  const analyze = async () => {
    if (!resumeText || resumeText.length < 20) {
      toast.error("Paste your resume text or upload a file first.");
      return;
    }
    if (!simDetail) {
      toast.error("Select a simulation to compare against.");
      return;
    }
    const path = (simDetail.paths || [])[selectedPath];
    if (!path) {
      toast.error("Select a valid simulation path first.");
      return;
    }
    setAnalyzing(true);
    try {
      const data = await api.post("/resume/analyze", {
        resumeText,
        skillGaps: path.skillGaps,
      });
      setResult(data);
      toast.success("Resume analysed.");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!sims && !simError) return <LoadingOverlay />;

  const path = simDetail?.paths[selectedPath];

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <span className="section-eyebrow">Resume Reality-Check</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Does your resume match your target path?
          </h1>
          <p className="mt-1 text-muted">
            Paste your resume or upload a TXT, PDF, JPG, or PNG file (up to 100
            KB). We’ll parse the skills you mention and cross-reference them
            against the gaps identified in your simulation.
          </p>
        </div>

        {simError && (
          <EmptyState
            icon={AlertTriangle}
            title="Could not load simulations"
            description={`${simError} Check the API deployment, then try again.`}
            action={
              <button onClick={loadSimulations} className="btn-primary">
                <RefreshCw className="h-4 w-4" /> Retry
              </button>
            }
          />
        )}

        <>
          {sims?.length > 0 ? (
            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="field-label">
                  Compare against simulation
                </label>
                <select
                  className="field-select"
                  value={selectedSim || ""}
                  onChange={(e) => {
                    setSelectedSim(e.target.value);
                    setResult(null);
                  }}
                >
                  {sims.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label">Path</label>
                <select
                  className="field-select"
                  value={selectedPath}
                  onChange={(e) => {
                    setSelectedPath(+e.target.value);
                    setResult(null);
                  }}
                >
                  {simDetail?.paths.map((p, i) => (
                    <option key={p.code} value={i}>
                      {p.title}
                    </option>
                  )) || []}
                </select>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={FileCheck}
              title="Run a simulation to compare results"
              description="You can paste or upload your resume now. Create a simulation before running the reality-check."
            />
          )}

          <div className="mb-4 surface-card p-5">
            <div className="mb-3 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="field-label mb-0">Your resume</label>
              <div className="flex w-full gap-2 sm:w-auto">
                <label className="btn-secondary cursor-pointer text-xs">
                  <Upload className="h-3.5 w-3.5" />{" "}
                  {extracting ? "Reading file..." : "Upload resume"}
                  <input
                    type="file"
                    accept=".txt,.text,.md,.pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                    onChange={handleFile}
                    className="hidden"
                    disabled={extracting}
                  />
                </label>
                <button
                  onClick={() => {
                    setResumeText("");
                    setResult(null);
                  }}
                  className="btn-secondary text-xs"
                >
                  <X className="h-3.5 w-3.5" /> Clear
                </button>
              </div>
            </div>
            <textarea
              className="field-input min-h-[160px] resize-y font-mono text-xs"
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted">
                {resumeText.length} characters
              </span>
              <button
                onClick={analyze}
                disabled={analyzing}
                className="btn-primary"
              >
                {analyzing ? (
                  "Analysing..."
                ) : (
                  <>
                    Run reality-check <ClipboardPaste className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {analyzing && (
            <LoadingOverlay label="Parsing skills and cross-referencing gaps..." />
          )}

          {result && (
            <div className="animate-fade-in space-y-4">
              <div className="surface-card border-accent/30 p-5">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                    <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="rgb(var(--border))"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="rgb(var(--accent))"
                        strokeWidth="8"
                        strokeDasharray={`${result.realityCheck.coverageScore * 2.64} 264`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute font-display text-xl font-semibold text-foreground">
                      {pct(result.realityCheck.coverageScore)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Coverage score
                    </h3>
                    <p className="text-sm text-muted">
                      Your resume covers {result.realityCheck.matched.length} of{" "}
                      {result.realityCheck.matched.length +
                        result.realityCheck.missing.length}{" "}
                      skills your target path needs.
                      {result.realityCheck.coverageScore >= 75
                        ? " Strong alignment."
                        : result.realityCheck.coverageScore >= 50
                          ? " Decent, with clear gaps."
                          : " Significant gaps to address."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="surface-card p-5">
                <h3 className="mb-3 font-display text-base font-semibold text-foreground">
                  Resume profile
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      Skills found ({result.parsed.skills.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.parsed.skills.map((skill) => (
                        <span key={skill} className="chip text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
                      Roles detected
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(result.parsed.roles || []).length > 0 ? (
                        result.parsed.roles.map((role) => (
                          <span
                            key={role}
                            className="chip border-info/40 bg-info/10 text-info text-xs"
                          >
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted">
                          No clear role title found.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="surface-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-success">
                    <Check className="h-5 w-5" /> Covered (
                    {result.realityCheck.matched.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.realityCheck.matched.length === 0 && (
                      <p className="text-sm text-muted">None yet.</p>
                    )}
                    {result.realityCheck.matched.map((s) => (
                      <span
                        key={s.skill}
                        className="chip border-success/40 bg-success/10 text-success text-xs"
                      >
                        {s.skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="surface-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-error">
                    <AlertTriangle className="h-5 w-5" /> Missing (
                    {result.realityCheck.missing.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.realityCheck.missing.length === 0 && (
                      <p className="text-sm text-muted">No gaps — well done.</p>
                    )}
                    {result.realityCheck.missing.map((s) => (
                      <span
                        key={s.skill}
                        className="chip border-error/40 bg-error/10 text-error text-xs"
                      >
                        {s.skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {result.realityCheck.surplus.length > 0 && (
                <div className="surface-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-info">
                    <TrendingUp className="h-5 w-5" /> On your resume but not
                    needed for this path ({result.realityCheck.surplus.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.realityCheck.surplus.map((s) => (
                      <span key={s.skill} className="chip text-xs">
                        {s.skill}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted">
                    These are not wasted — they may matter for a different
                    branch or make you a stronger cross-functional candidate.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      </div>

      {extracting && <ResumeReadingDialog />}

      {showFileSizeDialog && (
        <FileSizeDialog onClose={() => setShowFileSizeDialog(false)} />
      )}
    </>
  );
}

function ResumeReadingDialog() {
  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-sm"
      role="presentation"
    >
      <div
        className="flex min-h-[280px] w-full max-w-xl flex-col items-center justify-center rounded-3xl border border-accent/30 bg-surface px-8 py-10 text-center shadow-lift animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="resume-reading-title"
        aria-describedby="resume-reading-description"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
          <Spinner size={56} />
        </div>
        <h2
          id="resume-reading-title"
          className="mt-6 font-display text-2xl font-semibold text-foreground"
        >
          Reading your resume
        </h2>
        <p
          id="resume-reading-description"
          className="mt-3 max-w-sm text-sm leading-6 text-muted"
        >
          We are extracting the text from your file. This can take a little
          longer for scanned PDFs and images.
        </p>
      </div>
    </div>
  );
}

function FileSizeDialog({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 px-4 py-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-lift animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-size-dialog-title"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="file-size-dialog-title"
              className="font-display text-lg font-semibold text-foreground"
            >
              Resume file is too large
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Please choose a file smaller than 100 KB, or paste your resume
              text directly into the editor.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost -mr-2 -mt-2 h-9 w-9 shrink-0 p-0"
            aria-label="Close file size dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="btn-primary">
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResumeCheckPage;
