import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Download,
  GitCompare,
  Target,
  AlertTriangle,
  Gauge,
  RotateCcw,
  FileCheck2,
  MapPin,
  Info,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  X,
} from "lucide-react";
import { api } from "@/lib/api.js";
import { useToast } from "@/lib/toast.jsx";
import { useCurrency } from "@/lib/currency.jsx";
import { formatMoney, pct } from "@/lib/format.js";
import { LoadingOverlay } from "@/components/Spinner.jsx";
import { EmptyState } from "@/components/EmptyState.jsx";
import { SalaryTrajectoryChart } from "@/components/charts/SalaryTrajectoryChart.jsx";
import { SkillGapRadar } from "@/components/charts/SkillGapRadar.jsx";
import { CITY_TIERS } from "@/lib/offline/data.js";

const RISK_LABELS = {
  1: "Low",
  2: "Low-Mid",
  3: "Moderate",
  4: "High",
  5: "Very High",
};

export function SimulationPage() {
  const { id } = useParams();
  const toast = useToast();
  const { currency } = useCurrency();
  const [sim, setSim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPath, setSelectedPath] = useState(0);
  const [confidenceModalPath, setConfidenceModalPath] = useState(null);
  const [whatIf, setWhatIf] = useState({
    extraLearningMonths: 0,
    upskillingHoursPerWeek: 10,
    cityTier: "metro",
    networkStrength: "moderate",
    extraExperienceMonths: 0,
  });
  const [previewPaths, setPreviewPaths] = useState(null);
  const [previewing, setPreviewing] = useState(false);

  // Fetch simulation data from backend
  const loadSim = useCallback(async () => {
    try {
      const data = await api.get(`/simulations/${id}`);
      setSim(data.simulation);
      if (data.simulation?.whatIf) setWhatIf(data.simulation.whatIf);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    loadSim();
  }, [loadSim]);

  // Recalculate simulation paths based on whatIf sliders
  const runPreview = useCallback(async () => {
    // Correctly reference profileId from the loaded simulation object
    const profileId = sim?.profileId?._id || sim?.profileId;
    if (!profileId) return;

    setPreviewing(true);
    try {
      const profileData = await api.get(`/profiles/${profileId}`);
      const data = await api.post("/simulations/preview", {
        profile: profileData.profile,
        whatIf,
      });
      setPreviewPaths(Array.isArray(data.paths) ? data.paths : []);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPreviewing(false);
    }
  }, [sim, whatIf, toast]);

  useEffect(() => {
    if (sim && !previewPaths) {
      const timer = setTimeout(() => {
        setPreviewPaths(Array.isArray(sim?.paths) ? sim.paths : []);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [sim, previewPaths]);

  // Debounced execution of recalculations on whatIf changes
  useEffect(() => {
    if (!sim) return;
    const timer = setTimeout(runPreview, 350);
    return () => clearTimeout(timer);
  }, [whatIf, sim, runPreview]);

  // Toggle star status using MongoDB _id
  const toggleStar = async () => {
    try {
      const data = await api.patch(`/simulations/${sim._id}/star`);
      setSim((prev) => ({ ...prev, isStarred: data.isStarred }));
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Export path summary and trajectory as PDF via print window
  const exportPath = () => {
    const currentPaths = previewPaths || sim?.paths || [];
    const path = currentPaths[selectedPath];
    if (!path) return;

    const win = window.open("", "_blank");
    const rows = (path.trajectory || [])
      .map(
        (t) =>
          `<tr><td>${t.year === 0 ? "Now" : "Year " + t.year}</td><td>${t.role}</td><td>${t.companyArchetype}</td><td>${formatMoney(t.salary, currency)}</td><td>${pct(t.skillMatch * 100)}</td></tr>`,
      )
      .join("");

    win.document.write(`
      <html><head><title>${path.title} — CareerPath Export</title>
      <style>
        body { font-family: Georgia, serif; max-width: 720px; margin: 40px auto; padding: 0 24px; color: #1a1a1a; }
        h1 { font-size: 28px; margin-bottom: 4px; } h2 { font-size: 18px; color: #666; font-weight: normal; }
        .stat { display: inline-block; margin-right: 24px; } .stat b { font-size: 24px; display: block; }
        table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #ddd; font-size: 14px; }
        th { font-size: 12px; text-transform: uppercase; color: #888; }
        .footer { margin-top: 40px; font-size: 12px; color: #999; }
      </style></head><body>
      <h1>${path.title}</h1>
      <h2>CareerPath 5-Year Simulation</h2>
      <p style="color:#444; line-height:1.6;">${path.description}</p>
      <div style="margin: 24px 0;">
        <div class="stat"><b>${formatMoney(path.startSalary, currency)}</b>starting salary</div>
        <div class="stat"><b>${formatMoney(path.finalSalary, currency)}</b>projected year-5 salary</div>
        <div class="stat"><b>${pct(path.confidenceScore * 100)}</b>confidence</div>
        <div class="stat"><b>${RISK_LABELS[path.riskLevel]}</b>risk level</div>
      </div>
      <table><thead><tr><th>Year</th><th>Role</th><th>Company type</th><th>Salary</th><th>Skill match</th></tr></thead>
      <tbody>${rows}</tbody></table>
      <div class="footer">Generated by CareerPath — The 5-Year Simulator. Projections are estimates, not guarantees.</div>
      </body></html>`);
    win.document.close();
    setTimeout(() => win.print(), 300);
    toast.success("Export ready. Use the print dialog to save as PDF.");
  };

  if (loading) return <LoadingOverlay />;
  if (!sim)
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={AlertTriangle}
          title="Simulation not found"
          description="This simulation may have been deleted."
          action={
            <Link to="/dashboard" className="btn-primary">
              Back to dashboard
            </Link>
          }
        />
      </div>
    );

  const currentPaths = Array.isArray(previewPaths)
    ? previewPaths
    : Array.isArray(sim?.paths)
      ? sim.paths
      : [];
  const path = currentPaths[selectedPath];

  return (
    <div className="w-full px-0 py-4 sm:px-4 sm:py-8 md:mx-auto md:max-w-7xl md:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 px-4 sm:px-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-semibold text-foreground">
              {sim.name}
            </h1>
            <button
              onClick={toggleStar}
              className={`transition-colors ${sim.isStarred ? "text-accent" : "text-muted hover:text-accent"}`}
            >
              <Star
                className="h-5 w-5"
                fill={sim.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>
          <p className="mt-1 text-sm text-muted">
            {currentPaths.length} paths simulated ·{" "}
            {new Date(sim.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/calculation-proof" className="btn-secondary">
            <FileCheck2 className="h-4 w-4" /> Calculation proof
          </Link>
          <button onClick={exportPath} className="btn-secondary">
            <Download className="h-4 w-4" /> Export
          </button>
          <Link to="/compare" className="btn-secondary">
            <GitCompare className="h-4 w-4" /> Compare
          </Link>
        </div>
      </div>

      {/* Continuous Field Work & City Compensation Calibration Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-border/80 bg-surface-2/40 px-4 py-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
          <span className="text-muted">
            5-year projections calibrated for <strong className="text-foreground">{CITY_TIERS[whatIf.cityTier]?.name || (whatIf.cityTier === 'tier2' ? 'Lucknow / Tier-2 IT Hub' : 'Bangalore / Bengaluru')}</strong> assuming a consistent upskilling schedule.
          </span>
        </div>
        <span className="shrink-0 self-start sm:self-auto rounded-md border border-accent/20 bg-accent/10 px-2.5 py-1 text-[11px] font-medium text-accent">
          Realistic Market Model
        </span>
      </div>

      <div className="mb-8 surface-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Salary trajectory across all paths
          </h2>
          {previewing && (
            <span className="text-xs text-accent animate-pulse-soft">
              recalculating...
            </span>
          )}
        </div>
        <SalaryTrajectoryChart paths={currentPaths} currency={currency} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {currentPaths.map((p, i) => (
          <button
            key={p.code || i}
            onClick={() => setSelectedPath(i)}
            className={`surface-card p-5 text-left transition-all duration-300 ${
              selectedPath === i
                ? "border-accent ring-2 ring-accent/20"
                : "hover:border-accent/30"
            }`}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground">
                {p.title}
              </h3>
              <span
                className={`chip text-xs ${p.riskLevel >= 4 ? "border-error/40 bg-error/10 text-error" : p.riskLevel <= 2 ? "border-success/40 bg-success/10 text-success" : "border-warning/40 bg-warning/10 text-warning"}`}
              >
                {RISK_LABELS[p.riskLevel]} risk
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-muted text-pretty">
              {p.description}
            </p>
            {p.primaryGrowthVector && (
              <div className="mt-2.5 flex flex-wrap gap-1">
                <span className="chip border-accent/30 bg-accent/5 text-accent text-[10px] py-0 px-2 font-medium">
                  {p.primaryGrowthVector}
                </span>
                {p.aiReadinessIndex && (
                  <span className="chip border-success/30 bg-success/5 text-success text-[10px] py-0 px-2 font-medium">
                    {Math.round(p.aiReadinessIndex * 100)}% AI-Resilient
                  </span>
                )}
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted">Year 5 projection</p>
                <p className="font-display text-lg font-semibold text-accent tabular">
                  {formatMoney(p.finalSalary, currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted flex items-center gap-1.5">
                  Confidence
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setConfidenceModalPath(p);
                    }}
                    title="Click to view full confidence score calculation & mathematical pillars"
                    aria-label="View Confidence calculation details"
                    className="inline-flex items-center justify-center p-0.5 rounded-full hover:bg-surface-2 text-accent/80 hover:text-accent transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </p>
                <p className="font-display text-lg font-semibold text-foreground tabular">
                  {pct(p.confidenceScore * 100)}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {path && (
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 surface-card p-6">
            <h2 className="mb-1 font-display text-xl font-semibold text-foreground">
              {path.title}
            </h2>
            <p className="mb-4 text-sm text-muted text-pretty">
              {path.description}
            </p>

            {/* Career Intelligence & AI Resilience Panel */}
            <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-border bg-surface-2/60 p-3.5 text-xs">
              <div>
                <span className="text-muted block text-[10px] uppercase font-semibold tracking-wider">Growth Vector</span>
                <span className="text-foreground font-medium mt-0.5 block">{path.primaryGrowthVector || 'Technical Systems Depth'}</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase font-semibold tracking-wider">AI Resilience Index</span>
                <span className="text-success font-semibold mt-0.5 block">{Math.round((path.aiReadinessIndex || 0.85) * 100)}% Protected</span>
              </div>
              <div>
                <span className="text-muted block text-[10px] uppercase font-semibold tracking-wider">Key Promotion Bottleneck</span>
                <span className="text-accent font-medium mt-0.5 block">{path.criticalSkillBottleneck || 'Distributed Systems Architecture'}</span>
              </div>
            </div>

            {/* Basis of Confidence Breakdown Panel */}
            <div className="mb-5 rounded-xl border border-border/80 bg-surface-2/40 p-3.5 sm:p-4">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-accent" />
                  Basis of Confidence: {pct(path.confidenceScore * 100)}
                </span>
                <span className="text-[11px] text-muted">
                  Grounded on 4 mathematical pillars
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="rounded-lg bg-surface-2 p-2.5 border border-border/50">
                  <span className="text-muted block text-[10px] uppercase font-semibold">Skill Match (40%)</span>
                  <span className="text-foreground font-semibold text-sm mt-0.5 block">
                    {path.confidenceBreakdown?.skillMatchPercentage ?? Math.round(path.confidenceScore * 100)}%
                  </span>
                  <span className="text-[10px] text-muted block mt-0.5">Role stack coverage</span>
                </div>
                <div className="rounded-lg bg-surface-2 p-2.5 border border-border/50">
                  <span className="text-muted block text-[10px] uppercase font-semibold">Experience (25%)</span>
                  <span className="text-foreground font-semibold text-sm mt-0.5 block">
                    {path.confidenceBreakdown?.experienceYears !== undefined
                      ? `${path.confidenceBreakdown.experienceYears} yrs`
                      : whatIf?.extraExperienceMonths
                      ? `${((whatIf.extraExperienceMonths) / 12).toFixed(1)} yrs`
                      : 'Baseline'}
                  </span>
                  <span className="text-[10px] text-muted block mt-0.5">Tenure grounding</span>
                </div>
                <div className="rounded-lg bg-surface-2 p-2.5 border border-border/50">
                  <span className="text-muted block text-[10px] uppercase font-semibold">Schedule (20%)</span>
                  <span className="text-foreground font-semibold text-sm mt-0.5 block">
                    {whatIf.upskillingHoursPerWeek || 10}h / wk
                  </span>
                  <span className="text-[10px] text-muted block mt-0.5">Weekly practice</span>
                </div>
                <div className="rounded-lg bg-surface-2 p-2.5 border border-border/50">
                  <span className="text-muted block text-[10px] uppercase font-semibold">Continuity (15%)</span>
                  <span className="text-foreground font-semibold text-sm mt-0.5 block">
                    Continuous
                  </span>
                  <span className="text-[10px] text-muted block mt-0.5">No career gaps</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {(path.trajectory || []).map((node, i) => (
                <div
                  key={i}
                  className="relative flex gap-4 rounded-xl border border-border bg-surface-2 p-4"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                      Y{node.year}
                    </div>
                    {i < (path.trajectory || []).length - 1 && (
                      <div className="mt-1 h-full w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-base font-semibold text-foreground">
                          {node.role}
                        </h4>
                        {node.experienceBracket && (
                          <span className="rounded bg-accent/10 px-2 py-0.5 text-[11px] font-semibold text-accent">
                            {node.experienceBracket}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-semibold tabular text-accent">
                        {formatMoney(node.salary, currency)}
                      </span>
                    </div>
                    <p className="text-xs text-muted mt-0.5">
                      {node.companyArchetype} ·{" "}
                      {formatMoney(node.salaryLow, currency)} –{" "}
                      {formatMoney(node.salaryHigh, currency)}
                    </p>
                    {(node.skillsToAcquire || []).length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(node.skillsToAcquire || []).map((s) => (
                          <span key={s} className="chip text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="surface-card p-6">
              <h3 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <Gauge className="h-5 w-5 text-accent" /> What-if sliders
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="field-label">
                    Extra learning time: {whatIf.extraLearningMonths} months
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={whatIf.extraLearningMonths}
                    onChange={(e) =>
                      setWhatIf({
                        ...whatIf,
                        extraLearningMonths: +e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="field-label">
                    Upskilling intensity: {whatIf.upskillingHoursPerWeek}{" "}
                    hrs/week
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={whatIf.upskillingHoursPerWeek}
                    onChange={(e) =>
                      setWhatIf({
                        ...whatIf,
                        upskillingHoursPerWeek: +e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="field-label mb-0">City & Tech Hub</label>
                    <span className="text-[11px] font-medium text-accent">Local bands</span>
                  </div>
                  <select
                    className="field-select"
                    value={whatIf.cityTier}
                    onChange={(e) =>
                      setWhatIf({ ...whatIf, cityTier: e.target.value })
                    }
                  >
                    {Object.values(CITY_TIERS).map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.name} — {c.tier} ({c.multiplier >= 1 ? `+${Math.round((c.multiplier - 1) * 100)}%` : `-${Math.round((1 - c.multiplier) * 100)}%`})
                      </option>
                    ))}
                    <option value="metro">Metro (General Tier-1 Benchmark)</option>
                    <option value="tier2">Tier-2 (Lucknow / Emerging IT)</option>
                  </select>
                </div>
                <div>
                  <label className="field-label">Network strength</label>
                  <select
                    className="field-select"
                    value={whatIf.networkStrength}
                    onChange={(e) =>
                      setWhatIf({ ...whatIf, networkStrength: e.target.value })
                    }
                  >
                    <option value="strong">Strong — active referrals</option>
                    <option value="moderate">Moderate — some contacts</option>
                    <option value="weak">Weak — building from scratch</option>
                  </select>
                </div>
                <button
                  onClick={() =>
                    setWhatIf({
                      extraLearningMonths: 0,
                      upskillingHoursPerWeek: 10,
                      cityTier: "metro",
                      networkStrength: "moderate",
                      extraExperienceMonths: 0,
                    })
                  }
                  className="btn-ghost w-full"
                >
                  <RotateCcw className="h-4 w-4" /> Reset sliders
                </button>
              </div>
            </div>

            <div className="surface-card p-6">
              <h3 className="mb-1 flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                <Target className="h-5 w-5 text-accent" /> Skill gap radar
              </h3>
              <p className="mb-3 text-xs text-muted">
                Your skills vs. what the final role requires.
              </p>
              <SkillGapRadar
                currentSkills={sim.profile?.skills || []}
                targetSkills={
                  path.trajectory?.[
                    path.trajectory.length - 1
                  ]?.skillsToAcquire?.map((s) => ({ name: s, weight: 1 })) || []
                }
              />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Confidence Calculation Dialog */}
      {confidenceModalPath && (
        <ConfidenceDetailsModal
          path={confidenceModalPath}
          whatIf={whatIf}
          onClose={() => setConfidenceModalPath(null)}
        />
      )}
    </div>
  );
}

function ConfidenceDetailsModal({ path, whatIf, onClose }) {
  if (!path) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-lift animate-scale-in"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confidence-title"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
          aria-label="Close confidence details"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 id="confidence-title" className="font-display text-lg font-semibold text-foreground">
              Confidence Score Breakdown
            </h3>
            <p className="text-xs text-muted">
              {path.title} — Conviction Score:{" "}
              <strong className="text-accent font-semibold">{pct(path.confidenceScore * 100)}</strong>
            </p>
          </div>
        </div>

        <p className="text-xs text-muted mb-4 leading-relaxed">
          Confidence is calculated mathematically through CareerPath's 4-pillar algorithmic rules engine, measuring realistic feasibility rather than empty optimism.
        </p>

        <div className="grid grid-cols-2 gap-2.5 mb-5 text-xs">
          <div className="rounded-xl border border-border/80 bg-surface-2/60 p-3">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
              Skill Match (40%)
            </span>
            <span className="font-display text-base font-semibold text-foreground mt-0.5 block">
              {path.confidenceBreakdown?.skillMatchPercentage ?? Math.round(path.confidenceScore * 100)}%
            </span>
            <span className="text-[10px] text-muted block mt-0.5">
              Coverage of target required tech stack
            </span>
          </div>

          <div className="rounded-xl border border-border/80 bg-surface-2/60 p-3">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
              Experience Baseline (25%)
            </span>
            <span className="font-display text-base font-semibold text-foreground mt-0.5 block">
              {path.confidenceBreakdown?.experienceScorePercentage
                ? `${path.confidenceBreakdown.experienceScorePercentage}%`
                : path.confidenceBreakdown?.experienceYears !== undefined
                ? `${path.confidenceBreakdown.experienceYears} yrs`
                : "Standard Baseline"}
            </span>
            <span className="text-[10px] text-muted block mt-0.5">
              {path.confidenceBreakdown?.experienceYears !== undefined
                ? `${path.confidenceBreakdown.experienceYears} yrs tenure grounding`
                : "Tenure grounding vs seniority demand"}
            </span>
          </div>

          <div className="rounded-xl border border-border/80 bg-surface-2/60 p-3">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
              Upskilling Schedule (20%)
            </span>
            <span className="font-display text-base font-semibold text-foreground mt-0.5 block">
              {path.confidenceBreakdown?.upskillingPercentage
                ? `${path.confidenceBreakdown.upskillingPercentage}%`
                : `${whatIf?.upskillingHoursPerWeek || 10}h / week`}
            </span>
            <span className="text-[10px] text-muted block mt-0.5">
              {path.confidenceBreakdown?.upskillingHoursPerWeek !== undefined
                ? `${path.confidenceBreakdown.upskillingHoursPerWeek}h/wk study schedule`
                : "Deliberate practice & study schedule"}
            </span>
          </div>

          <div className="rounded-xl border border-border/80 bg-surface-2/60 p-3">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider block">
              Career Continuity (15%)
            </span>
            <span className="font-display text-base font-semibold text-foreground mt-0.5 block">
              {path.confidenceBreakdown?.continuityPercentage
                ? `${path.confidenceBreakdown.continuityPercentage}%`
                : "Continuous"}
            </span>
            <span className="text-[10px] text-muted block mt-0.5">
              {`${RISK_LABELS[path.riskLevel] || 'Normal'} track risk stability`}
            </span>
          </div>
        </div>

        <div className="rounded-xl bg-surface-2/40 border border-border/60 p-3 mb-5 text-[11px] text-muted">
          <p className="font-mono text-foreground/90 mb-1">
            Confidence = (0.40 × SkillMatch) + (0.25 × Experience) + (0.20 × Schedule) + (0.15 × Continuity)
          </p>
          <p>
            No black-box hallucinations. All weights and parameters are deterministic and transparent.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Link
            to="/calculation-proof"
            className="text-xs text-accent hover:underline inline-flex items-center gap-1 font-medium"
          >
            Review calculation proof & formulas →
          </Link>
          <button onClick={onClose} className="btn-primary text-xs py-1.5 px-4">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default SimulationPage;
