import { useState, useEffect } from 'react';
import { Users, TrendingUp, Target, Star, Award } from 'lucide-react';
import { api } from '@/lib/api.js';
import { LoadingOverlay } from '@/components/Spinner.jsx';
import { RoleDistributionChart, SkillDemandChart } from '@/components/charts/AdminCharts.jsx';
import { pct } from '@/lib/format.js';

export function AdminPage() {
  const [overview, setOverview] = useState(null);
  const [trends, setTrends] = useState(null);
  const [users, setUsers] = useState(null);
  const [tab, setTab] = useState('trends');

  useEffect(() => {
    Promise.all([
      api.get('/admin/overview'),
      api.get('/admin/trends'),
      api.get('/admin/users'),
    ]).then(([o, t, u]) => {
      setOverview(o);
      setTrends(t);
      setUsers(u.users);
    }).catch(() => {});
  }, []);

  if (!overview || !trends) return <LoadingOverlay label="Loading analytics..." />;

  const cards = [
    { label: 'Registered users', value: overview.userCount, icon: Users },
    { label: 'Skill profiles', value: overview.profileCount, icon: Target },
    { label: 'Simulations run', value: overview.simCount, icon: TrendingUp },
    { label: 'Avg salary growth', value: `${trends.avgSalaryGrowth}%`, icon: Award },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <span className="section-eyebrow">Admin / Faculty Analytics</span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">Institutional overview</h1>
        <p className="mt-1 text-muted">Anonymised aggregate trends across all CareerPath users.</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="surface-card p-5">
            <div className="flex items-center gap-2 text-muted"><c.icon className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">{c.label}</span></div>
            <p className="stat-number mt-2">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 flex gap-1 rounded-xl border border-border bg-surface-2 p-1">
        <button onClick={() => setTab('trends')} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === 'trends' ? 'bg-accent text-accent-contrast' : 'text-muted hover:text-foreground'}`}>Trends</button>
        <button onClick={() => setTab('users')} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all ${tab === 'users' ? 'bg-accent text-accent-contrast' : 'text-muted hover:text-foreground'}`}>Users</button>
      </div>

      {tab === 'trends' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="surface-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Most common target roles</h3>
            {trends.topRoles.length > 0 ? <RoleDistributionChart data={trends.topRoles} /> : <p className="py-12 text-center text-sm text-muted">No role data yet.</p>}
          </div>
          <div className="surface-card p-6">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Most requested skills (gap frequency)</h3>
            {trends.topSkills.length > 0 ? <SkillDemandChart data={trends.topSkills} /> : <p className="py-12 text-center text-sm text-muted">No skill data yet.</p>}
          </div>
          <div className="surface-card p-6 lg:col-span-2">
            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">Top declared interests</h3>
            {trends.topInterests.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {trends.topInterests.map((i, idx) => (
                  <div key={i.interest} className="flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-4 py-2.5">
                    <span className="font-display text-lg font-semibold text-accent tabular">#{idx + 1}</span>
                    <span className="capitalize text-sm font-medium text-foreground">{i.interest}</span>
                    <span className="text-xs text-muted">({i.count})</span>
                  </div>
                ))}
              </div>
            ) : <p className="py-8 text-center text-sm text-muted">No interest data yet.</p>}
          </div>
        </div>
      )}

      {tab === 'users' && (
        <div className="surface-card overflow-hidden p-0">
          <div className="grid grid-cols-4 border-b border-border bg-surface-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted">
            <span>Name</span><span>Email</span><span>Role</span><span>Joined</span>
          </div>
          {users.map((u, i) => (
            <div key={u.id} className={`grid grid-cols-4 px-6 py-3 text-sm ${i % 2 ? 'bg-surface/40' : ''}`}>
              <span className="font-medium text-foreground">{u.name}</span>
              <span className="text-muted truncate">{u.email}</span>
              <span className={`chip text-xs ${u.role === 'admin' ? 'border-accent/40 bg-accent/10 text-accent' : ''}`}>{u.role}</span>
              <span className="text-muted">{new Date(u.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminPage;
