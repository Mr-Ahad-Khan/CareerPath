import { useState, useEffect } from 'react';
import { Target, Plus, Circle, Clock, CheckCircle2, Flame, X } from 'lucide-react';
import { api } from '@/lib/api.js';
import { useToast } from '@/lib/toast.jsx';
import { LoadingOverlay } from '@/components/Spinner.jsx';
import { EmptyState } from '@/components/EmptyState.jsx';
import { pct } from '@/lib/format.js';

const columns = [
  { key: 'todo', label: 'To do', icon: Circle, color: 'text-muted' },
  { key: 'in_progress', label: 'In progress', icon: Clock, color: 'text-accent' },
  { key: 'complete', label: 'Complete', icon: CheckCircle2, color: 'text-success' },
];

export function MilestonesPage() {
  const toast = useToast();
  const [milestones, setMilestones] = useState(null);
  const [stats, setStats] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newMs, setNewMs] = useState({ title: '', category: 'Learning', year: 1, quarter: 'Q1' });

  const load = () => {
    Promise.all([api.get('/milestones'), api.get('/journal/stats')]).then(([ms, st]) => {
      setMilestones(ms.milestones);
      setStats(st);
    }).catch(() => setMilestones([]));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    try {
      await api.patch(`/milestones/${id}`, { status });
      if (status === 'complete') toast.success('Milestone complete. Nice.');
    } catch {
      toast.error('Could not update milestone.');
      load();
    }
  };

  const addMilestone = async () => {
    if (!newMs.title.trim()) return;
    try {
      await api.post('/milestones', { ...newMs, description: '' });
      toast.success('Milestone added.');
      setNewMs({ title: '', category: 'Learning', year: 1, quarter: 'Q1' });
      setShowAdd(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const logActivity = async () => {
    try {
      await api.post('/journal', { activity: 'Upkilling session', skill: 'Self-directed', durationMinutes: 45 });
      toast.success('45-minute session logged. Streak updated.');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!milestones) return <LoadingOverlay />;

  const total = milestones.length;
  const done = milestones.filter((m) => m.status === 'complete').length;
  const inProg = milestones.filter((m) => m.status === 'in_progress').length;
  const completion = total ? Math.round((done / total) * 100) : 0;

  const byColumn = (key) => milestones.filter((m) => m.status === key).sort((a, b) => a.year - b.year || a.orderIndex - b.orderIndex);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="section-eyebrow">Milestone Roadmap</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">Your 5-year plan, quarter by quarter</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={logActivity} className="btn-secondary"><Flame className="h-4 w-4 text-accent" /> Log today's practice</button>
          <button onClick={() => setShowAdd(true)} className="btn-primary"><Plus className="h-4 w-4" /> Add milestone</button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Total milestones</p>
          <p className="stat-number mt-1">{total}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted">In progress</p>
          <p className="stat-number mt-1 text-accent">{inProg}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Complete</p>
          <p className="stat-number mt-1 text-success">{done}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs uppercase tracking-wider text-muted">Completion</p>
          <p className="stat-number mt-1">{pct(completion)}</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>

      {total === 0 ? (
        <EmptyState
          icon={Target}
          title="No milestones yet"
          description="Run a simulation to auto-generate quarterly milestones, or add your own manually."
          action={<button onClick={() => setShowAdd(true)} className="btn-primary">Add your first milestone</button>}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((col) => (
            <div key={col.key} className="surface-card p-4">
              <div className="mb-4 flex items-center gap-2">
                <col.icon className={`h-4 w-4 ${col.color}`} />
                <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-foreground">{col.label}</h2>
                <span className="ml-auto text-xs text-muted">{byColumn(col.key).length}</span>
              </div>
              <div className="space-y-2.5">
                {byColumn(col.key).map((m) => (
                  <div key={m.id} className="group rounded-xl border border-border bg-surface-2 p-3 transition-all hover:border-accent/30">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">{m.title}</p>
                      <span className="shrink-0 rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">Y{m.year} {m.quarter}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted line-clamp-2">{m.description}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="chip text-[10px]">{m.category}</span>
                      <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        {col.key !== 'todo' && <button onClick={() => updateStatus(m.id, 'todo')} className="rounded px-1.5 py-0.5 text-[10px] text-muted hover:bg-surface hover:text-foreground">Todo</button>}
                        {col.key !== 'in_progress' && <button onClick={() => updateStatus(m.id, 'in_progress')} className="rounded px-1.5 py-0.5 text-[10px] text-accent hover:bg-accent/10">Start</button>}
                        {col.key !== 'complete' && <button onClick={() => updateStatus(m.id, 'complete')} className="rounded px-1.5 py-0.5 text-[10px] text-success hover:bg-success/10">Done</button>}
                      </div>
                    </div>
                  </div>
                ))}
                {byColumn(col.key).length === 0 && (
                  <p className="py-8 text-center text-xs text-muted">Nothing here yet.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-fade-in-flat" onClick={() => setShowAdd(false)}>
          <div className="w-full max-w-md surface-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-foreground">Add milestone</h3>
              <button onClick={() => setShowAdd(false)} className="text-muted hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="field-label">Title</label>
                <input className="field-input" value={newMs.title} onChange={(e) => setNewMs({ ...newMs, title: e.target.value })} placeholder="e.g. Complete AWS certification" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="field-label">Year</label>
                  <select className="field-select" value={newMs.year} onChange={(e) => setNewMs({ ...newMs, year: +e.target.value })}>
                    {[0, 1, 2, 3, 4, 5].map((y) => <option key={y} value={y}>Year {y}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Quarter</label>
                  <select className="field-select" value={newMs.quarter} onChange={(e) => setNewMs({ ...newMs, quarter: e.target.value })}>
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Category</label>
                  <select className="field-select" value={newMs.category} onChange={(e) => setNewMs({ ...newMs, category: e.target.value })}>
                    {['Learning', 'Delivery', 'Visibility', 'Mentoring', 'Strategy', 'People', 'Career'].map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <button onClick={addMilestone} className="btn-primary w-full">Add milestone</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MilestonesPage;
