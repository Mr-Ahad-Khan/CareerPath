import { useState, useEffect } from 'react';
import { GitCompare, ArrowRight, TrendingUp, AlertTriangle, Smile, Clock } from 'lucide-react';
import { api } from '@/lib/api.js';
import { useCurrency } from '@/lib/currency.jsx';
import { formatMoney, pct } from '@/lib/format.js';
import { LoadingOverlay } from '@/components/Spinner.jsx';
import { EmptyState } from '@/components/EmptyState.jsx';
import { SalaryTrajectoryChart } from '@/components/charts/SalaryTrajectoryChart.jsx';
import { Link } from 'react-router-dom';

const RISK_LABELS = { 1: 'Low', 2: 'Low-Mid', 3: 'Moderate', 4: 'High', 5: 'Very High' };

export function ComparatorPage() {
  const { currency } = useCurrency();
  const [sims, setSims] = useState(null);
  const [selected, setSelected] = useState({ left: null, right: null });

  useEffect(() => {
    api.get('/simulations').then((data) => {
      setSims(data.simulations);
      if (data.simulations.length >= 2) {
        loadPaths(data.simulations[0].id, data.simulations[1].id);
      }
    }).catch(() => setSims([]));
  }, []);

  const loadPaths = async (leftId, rightId) => {
    try {
      const [l, r] = await Promise.all([
        api.get(`/simulations/${leftId}`),
        api.get(`/simulations/${rightId}`),
      ]);
      setSelected({
        left: { sim: l.simulation, pathIdx: 0 },
        right: { sim: r.simulation, pathIdx: 0 },
      });
    } catch {
      /* ignore */
    }
  };

  const pickPath = (side, pathIdx) => setSelected({ ...selected, [side]: { ...selected[side], pathIdx } });

  if (!sims) return <LoadingOverlay />;

  if (sims.length < 2) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={GitCompare}
          title="Not enough simulations to compare"
          description="You need at least two saved simulations to use the fork-the-path comparator. Run another simulation first."
          action={<Link to="/simulate" className="btn-primary">New simulation <ArrowRight className="h-4 w-4" /></Link>}
        />
      </div>
    );
  }

  const leftPath = (selected.left?.sim?.paths || [])[selected.left?.pathIdx];
  const rightPath = (selected.right?.sim?.paths || [])[selected.right?.pathIdx];

  const salaryDiff = leftPath && rightPath ? leftPath.finalSalary - rightPath.finalSalary : 0;
  const satisfactionDiff = leftPath && rightPath ? leftPath.satisfactionScore - rightPath.satisfactionScore : 0;

  const metrics = [
    { label: 'Year-5 salary', left: formatMoney(leftPath?.finalSalary, currency), right: formatMoney(rightPath?.finalSalary, currency), diff: formatMoney(Math.abs(salaryDiff), currency), diffLabel: salaryDiff > 0 ? 'left higher' : salaryDiff < 0 ? 'right higher' : 'equal' },
    { label: 'Risk level', left: RISK_LABELS[leftPath?.riskLevel], right: RISK_LABELS[rightPath?.riskLevel], diff: '', diffLabel: '' },
    { label: 'Confidence', left: pct(leftPath?.confidenceScore * 100), right: pct(rightPath?.confidenceScore * 100), diff: '', diffLabel: '' },
    { label: 'Satisfaction', left: pct(leftPath?.satisfactionScore * 100), right: pct(rightPath?.satisfactionScore * 100), diff: Math.abs(satisfactionDiff * 100).toFixed(0) + '%', diffLabel: satisfactionDiff > 0 ? 'left higher' : satisfactionDiff < 0 ? 'right higher' : 'equal' },
    { label: 'Starting salary', left: formatMoney(leftPath?.startSalary, currency), right: formatMoney(rightPath?.startSalary, currency), diff: '', diffLabel: '' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <span className="section-eyebrow">Fork the Path</span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">Side-by-side comparison</h1>
        <p className="mt-1 text-muted">Pick two simulations and compare them like two products.</p>
      </div>

      {selected.left && selected.right && (
        <>
          <div className="mb-8 surface-card p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-foreground">Salary trajectory comparison</h2>
            <SalaryTrajectoryChart paths={[leftPath, rightPath]} currency={currency} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {[['left', selected.left], ['right', selected.right]].map(([side, data]) => {
              const paths = data.sim?.paths || [];
              const current = paths[data.pathIdx];
              return (
                <div key={side} className="surface-card p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground">{data.sim.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {paths.map((p, i) => (
                      <button
                        key={p.code}
                        onClick={() => pickPath(side, i)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                          data.pathIdx === i ? 'border-accent bg-accent/10 text-accent' : 'border-border bg-surface-2 text-muted hover:border-accent/30'
                        }`}
                      >
                        {p.title}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 space-y-3">
                    {(current?.trajectory || []).map((node, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border border-border bg-surface-2 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{node.role}</p>
                          <p className="text-xs text-muted">Year {node.year} · {node.companyArchetype}</p>
                        </div>
                        <span className="text-sm font-semibold tabular text-accent">{formatMoney(node.salary, currency)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 surface-card overflow-hidden p-0">
            <div className="grid grid-cols-3 border-b border-border bg-surface-2 px-6 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Metric</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Left path</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">Right path</span>
            </div>
            {metrics.map((m, i) => (
              <div key={i} className={`grid grid-cols-3 px-6 py-3 ${i % 2 ? 'bg-surface/40' : ''}`}>
                <span className="text-sm text-muted">{m.label}</span>
                <span className="text-sm font-medium tabular text-foreground">{m.left}</span>
                <span className="text-sm font-medium tabular text-foreground">
                  {m.right}
                  {m.diff && (
                    <span className={`ml-2 text-xs ${m.diffLabel === 'left higher' ? 'text-success' : m.diffLabel === 'right higher' ? 'text-info' : 'text-muted'}`}>
                      ({m.diff} {m.diffLabel})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ComparatorPage;
