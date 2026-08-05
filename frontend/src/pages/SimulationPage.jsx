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
} from "lucide-react";
import { api } from "@/lib/api.js";
import { useToast } from "@/lib/toast.jsx";
import { useCurrency } from "@/lib/currency.jsx";
import { formatMoney, pct } from "@/lib/format.js";
import { LoadingOverlay } from "@/components/Spinner.jsx";
import { EmptyState } from "@/components/EmptyState.jsx";
import { SalaryTrajectoryChart } from "@/components/charts/SalaryTrajectoryChart.jsx";
import { SkillGapRadar } from "@/components/charts/SkillGapRadar.jsx";

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
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
          <button onClick={exportPath} className="btn-secondary">
            <Download className="h-4 w-4" /> Export
          </button>
          <Link to="/compare" className="btn-secondary">
            <GitCompare className="h-4 w-4" /> Compare
          </Link>
        </div>
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

      <div className="grid gap-4 lg:grid-cols-3">
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
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted">Year 5 salary</p>
                <p className="font-display text-lg font-semibold text-accent tabular">
                  {formatMoney(p.finalSalary, currency)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted">Confidence</p>
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
            <p className="mb-5 text-sm text-muted text-pretty">
              {path.description}
            </p>

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
                      <h4 className="font-display text-base font-semibold text-foreground">
                        {node.role}
                      </h4>
                      <span className="text-sm font-semibold tabular text-accent">
                        {formatMoney(node.salary, currency)}
                      </span>
                    </div>
                    <p className="text-xs text-muted">
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
                  <label className="field-label">City tier</label>
                  <select
                    className="field-select"
                    value={whatIf.cityTier}
                    onChange={(e) =>
                      setWhatIf({ ...whatIf, cityTier: e.target.value })
                    }
                  >
                    <option value="metro">
                      Metro (higher pay, higher cost)
                    </option>
                    <option value="tier2">
                      Tier-2 (lower cost, lower pay)
                    </option>
                    <option value="remote">Remote / flexible</option>
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
    </div>
  );
}

export default SimulationPage;
