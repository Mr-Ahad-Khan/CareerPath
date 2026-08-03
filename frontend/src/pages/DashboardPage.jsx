import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Star, TrendingUp, Target, Flame, Clock, ArrowRight, BarChart3 } from 'lucide-react';
import { api } from '@/lib/api.js';
import { useCurrency } from '@/lib/currency.jsx';
import { formatMoney, timeAgo, pct } from '@/lib/format.js';
import { LoadingOverlay } from '@/components/Spinner.jsx';
import { EmptyState } from '@/components/EmptyState.jsx';
import { useAuth } from '@/lib/auth.jsx';

export function DashboardPage() {
  const { user } = useAuth();
  const { currency } = useCurrency();
  const [sims, setSims] = useState(null);
  const [stats, setStats] = useState(null);
  const [milestones, setMilestones] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get('/simulations'),
      api.get('/journal/stats'),
      api.get('/milestones'),
    ]).then(([simRes, statRes, msRes]) => {
      setSims(simRes.simulations);
      setStats(statRes);
      setMilestones(msRes.milestones);
    }).catch(() => {
      setSims([]);
      setMilestones([]);
    });
  }, []);

  if (!sims) return <LoadingOverlay />;

  const completedMs = milestones?.filter((m) => m.status === 'complete').length || 0;
  const totalMs = milestones?.length || 0;
  const msPct = totalMs ? Math.round((completedMs / totalMs) * 100) : 0;

  const quickActions = [
    { to: '/simulate', icon: Compass, label: 'New simulation', desc: 'Run a fresh 5-year projection' },
    { to: '/mentors', icon: Target, label: 'Find a mentor', desc: 'Browse the mentor directory' },
    { to: '/resume-check', icon: TrendingUp, label: 'Resume reality-check', desc: 'Match your resume to skill gaps' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Welcome back, {user.name.split(' ')[0]}.
        </h1>
        <p className="mt-1 text-muted">{user.headline || 'Here is your career at a glance.'}</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 text-muted"><Compass className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">Simulations</span></div>
          <p className="stat-number mt-2">{sims.length}</p>
        </div>
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 text-muted"><Target className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">Milestones done</span></div>
          <p className="stat-number mt-2">{completedMs}<span className="text-lg text-muted">/{totalMs}</span></p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${msPct}%` }} />
          </div>
        </div>
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 text-muted"><Flame className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">Upk. streak</span></div>
          <p className="stat-number mt-2">{stats?.streak || 0}<span className="text-lg text-muted"> days</span></p>
        </div>
        <div className="surface-card p-5">
          <div className="flex items-center gap-2 text-muted"><Clock className="h-4 w-4" /><span className="text-xs uppercase tracking-wider">Practice hours</span></div>
          <p className="stat-number mt-2">{Math.round((stats?.totalMinutes || 0) / 60)}<span className="text-lg text-muted">h</span></p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-3">
        {quickActions.map((a) => (
          <Link key={a.to} to={a.to} className="group surface-card flex items-center gap-4 p-5 transition-all duration-300 hover:border-accent/40 hover:-translate-y-0.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform group-hover:scale-110">
              <a.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-display text-base font-semibold text-foreground">{a.label}</p>
              <p className="text-xs text-muted">{a.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Your simulations</h2>
          {sims.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No simulations yet"
              description="Run your first 5-year career simulation to see paths, salary projections, and milestones."
              action={<Link to="/simulate" className="btn-primary">Start a simulation <ArrowRight className="h-4 w-4" /></Link>}
            />
          ) : (
            <div className="space-y-3">
              {sims.map((s) => (
                <Link key={s.id} to={`/simulation/${s.id}`} className="group surface-card flex items-center justify-between p-5 transition-all hover:border-accent/40">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate font-display text-base font-semibold text-foreground">{s.name}</h3>
                      {s.isStarred && <Star className="h-4 w-4 shrink-0 text-accent" fill="currentColor" />}
                    </div>
                    <p className="mt-0.5 text-xs text-muted">
                      {s.pathCount} paths · {timeAgo(s.createdAt)} · Top salary: {formatMoney(s.topSalary, currency)}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.pathTitles?.slice(0, 3).map((t) => (
                        <span key={t} className="chip text-xs">{t}</span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="ml-4 h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Consistency</h2>
          <div className="surface-card p-5">
            <div className="flex items-center gap-3">
              <Flame className="h-8 w-8 text-accent" />
              <div>
                <p className="stat-number">{stats?.streak || 0}</p>
                <p className="text-xs text-muted">day streak</p>
              </div>
            </div>
            <div className="my-4 divider-fade" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted">Sessions logged</span><span className="tabular text-foreground">{stats?.totalSessions || 0}</span></div>
              <div className="flex justify-between"><span className="text-muted">Active days (last 7)</span><span className="tabular text-foreground">{stats?.activeDaysLast7 || 0}</span></div>
              <div className="flex justify-between"><span className="text-muted">Total practice time</span><span className="tabular text-foreground">{Math.round((stats?.totalMinutes || 0) / 60)}h</span></div>
            </div>
            <Link to="/milestones" className="btn-secondary mt-4 w-full">Log today's activity <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {user.role === 'admin' && (
            <Link to="/admin" className="group surface-card mt-4 flex items-center gap-4 p-5 transition-all hover:border-accent/40">
              <BarChart3 className="h-6 w-6 text-accent" />
              <div className="flex-1">
                <p className="font-display text-sm font-semibold text-foreground">Admin Analytics</p>
                <p className="text-xs text-muted">Aggregate trends across all users</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
