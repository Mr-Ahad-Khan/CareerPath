import { useState, useEffect, useRef } from "react";
import {
  FileCheck,
  FileCheck2,
  Upload,
  ClipboardPaste,
  Check,
  X,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Sparkles,
  Award,
  Zap,
  Layers,
  Lightbulb,
  Target,
} from "lucide-react";
import { api } from "@/lib/api.js";
import { useToast } from "@/lib/toast.jsx";
import { LoadingOverlay, Spinner } from "@/components/Spinner.jsx";
import { EmptyState } from "@/components/EmptyState.jsx";
import { pct } from "@/lib/format.js";
import { readResumeFile, MAX_RESUME_FILE_SIZE } from "@/lib/resumeReader.js";

export function ResumeCheckPage() {
  const toast = useToast();
  const fileInputRef = useRef(null);
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
    } else {
      setSimDetail(null);
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
      const text = await readResumeFile(file);
      setResumeText(text);
      setResult(null);
      const sizeKb = (file.size / 1024).toFixed(0);
      toast.success(`Loaded ${file.name} (${sizeKb} KB).`);
    } catch (err) {
      console.error("[ResumeCheck] File extraction error:", err);
      toast.error(
        err.message ||
          "Could not read that file. Try a clearer image, PDF, or paste your text directly."
      );
    } finally {
      setExtracting(false);
      if (e.target) e.target.value = "";
    }
  };

  const analyze = async () => {
    if (!resumeText || resumeText.length < 20) {
      toast.error("Paste your resume text or upload a file first.");
      return;
    }
    const path = simDetail
      ? (simDetail.paths || [])[selectedPath] || (simDetail.paths || [])[0] || null
      : null;

    setAnalyzing(true);
    try {
      const data = await api.post("/resume/analyze", {
        resumeText,
        skillGaps: path?.skillGaps || [],
        simulationId: selectedSim || null,
      });
      setResult(data);
      toast.success("Resume analysed.");
    } catch (err) {
      toast.error(err.message || "Failed to analyze resume.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (!sims && !simError) return <LoadingOverlay />;

  const path = (simDetail?.paths || [])[selectedPath] || (simDetail?.paths || [])[0] || null;

  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <span className="section-eyebrow">Resume Reality-Check</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Does your resume match your target path?
          </h1>
          <p className="mt-1 text-muted">
            Paste your resume or upload a PDF, DOCX, TXT, or image file (up to 15
            MB). We’ll parse the skills you mention and cross-reference them
            against the gaps identified in your simulation.
          </p>
        </div>

        {/* User Input & Outcome Responsibility Advisory */}
        <div className="mb-6 rounded-xl border border-accent/30 bg-accent/5 p-4 text-xs leading-relaxed text-muted flex items-start gap-3 shadow-xs">
          <FileCheck2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-foreground">User Responsibility & Input Quality Notice:</span>{' '}
            Resume match scores and skill gap diagnoses are calculated directly from your entered resume text against your simulation model. It is your responsibility to upload an accurate, up-to-date resume to produce reliable and actionable skill gap results.
          </div>
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
                <label className="field-label" htmlFor="resume-target-sim">
                  Compare against simulation
                </label>
                <select
                  id="resume-target-sim"
                  name="selectedSim"
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
                <label className="field-label" htmlFor="resume-target-path">Path</label>
                <select
                  id="resume-target-path"
                  name="selectedPath"
                  className="field-select"
                  value={selectedPath}
                  onChange={(e) => {
                    setSelectedPath(+e.target.value);
                    setResult(null);
                  }}
                >
                  {(simDetail?.paths || []).map((p, i) => (
                    <option key={p.code || i} value={i}>
                      {p.title}
                    </option>
                  ))}
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
              <label className="field-label mb-0" htmlFor="resume-raw-text">Your resume</label>
              <div className="flex w-full gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary cursor-pointer text-xs"
                  disabled={extracting}
                  id="resume-upload-btn"
                >
                  <Upload className="h-3.5 w-3.5" />{" "}
                  {extracting ? "Reading file..." : "Upload resume"}
                </button>
                <input
                  ref={fileInputRef}
                  id="resume-upload-file"
                  name="resumeFile"
                  type="file"
                  accept=".pdf,.txt,.text,.md,.rtf,.doc,.docx,.png,.jpg,.jpeg,.webp,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,image/*"
                  onChange={handleFile}
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden="true"
                />
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
              id="resume-raw-text"
              name="resumeText"
              aria-label="Your resume content"
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

              {/* Intelligent Resume Assessment & Candidate Profile */}
              <div className="surface-card p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div>
                    <h3 className="font-display text-base font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" /> Intelligent Resume Analysis
                    </h3>
                    <p className="text-xs text-muted">
                      Semantic skill extraction, seniority profiling, and metric quantification
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {result.parsed.seniority?.level && (
                      <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-semibold text-accent flex items-center gap-1">
                        <Award className="h-3 w-3" /> {result.parsed.seniority.level}
                      </span>
                    )}
                    {result.parsed.yearsExperience !== null && (
                      <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-muted">
                        {result.parsed.yearsExperience} yrs exp
                      </span>
                    )}
                    {result.parsed.detectedDegree && (
                      <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-muted uppercase">
                        {result.parsed.detectedDegree}
                      </span>
                    )}
                  </div>
                </div>

                {/* Intelligent Skill Categories */}
                {result.parsed.skillCategories && Object.keys(result.parsed.skillCategories).length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-accent" /> Skills by Domain ({result.parsed.skills.length} detected)
                    </p>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      {Object.entries(result.parsed.skillCategories).map(([cat, skills]) => (
                        <div key={cat} className="rounded-lg border border-border/70 bg-surface-2/40 p-2.5">
                          <span className="text-[11px] font-semibold text-muted block mb-1.5">{cat}</span>
                          <div className="flex flex-wrap gap-1">
                            {skills.map((skill) => (
                              <span key={skill} className="chip text-[11px] py-0.5 px-2">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
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
                )}

                {/* Roles & Impact Metrics */}
                <div className="grid gap-3 sm:grid-cols-2 pt-2 border-t border-border/60 text-xs">
                  <div>
                    <p className="font-semibold text-muted mb-1 flex items-center gap-1">
                      <Target className="h-3.5 w-3.5 text-accent" /> Roles Detected
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {(result.parsed.roles || []).length > 0 ? (
                        result.parsed.roles.map((role) => (
                          <span key={role} className="chip border-info/40 bg-info/10 text-info text-xs">
                            {role}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">No explicit role titles found in headings.</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-muted mb-1 flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-accent" /> Impact & Metrics Rigor:{" "}
                      <span className="text-foreground font-medium">
                        {result.parsed.impactMetrics?.score || "Evaluated"}
                      </span>
                    </p>
                    {result.parsed.impactMetrics?.metrics?.length > 0 ? (
                      <ul className="space-y-1 mt-1 text-[11px] text-muted list-disc list-inside">
                        {result.parsed.impactMetrics.metrics.slice(0, 2).map((m, i) => (
                          <li key={i} className="truncate">"{m}"</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted text-[11px]">Consider adding quantifiable metrics (%, $, latency, scale) to your resume bullets.</span>
                    )}
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

              {/* Actionable Smart Gap Suggestions */}
              {result.realityCheck.smartSuggestions?.length > 0 && (
                <div className="surface-card p-5 border border-accent/25 bg-accent/5">
                  <h3 className="mb-2 flex items-center gap-2 font-display text-base font-semibold text-accent">
                    <Lightbulb className="h-5 w-5" /> Smart Suggestions to Close Gaps
                  </h3>
                  <div className="space-y-2 text-xs">
                    {result.realityCheck.smartSuggestions.map((item) => (
                      <div key={item.skill} className="rounded-lg bg-surface/80 p-2.5 border border-border/60">
                        <span className="font-semibold text-foreground">{item.skill}:</span>{" "}
                        <span className="text-muted">{item.advice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
              Please choose a file smaller than 15 MB, or paste your resume
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
