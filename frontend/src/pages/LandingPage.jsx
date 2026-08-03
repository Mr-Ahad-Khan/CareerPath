import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, GitBranch, Radar, Sliders, Target, Users, FileCheck, Download } from 'lucide-react';

const features = [
  { icon: GitBranch, title: 'Divergent path branches', text: 'Get three plausible five-year tracks — specialist, management, or a pivot — each with its own tradeoffs.' },
  { icon: TrendingUp, title: 'Salary trajectory', text: 'See year-by-year salary bands plotted against seniority, with honest confidence scores per path.' },
  { icon: Radar, title: 'Skill gap radar', text: 'A spider chart pinpoints exactly which skills separate you from your target role today.' },
  { icon: Sliders, title: 'What-if sliders', text: 'Drag a slider to add six months of learning or switch cities and watch the projection re-render instantly.' },
  { icon: Target, title: 'Milestone roadmap', text: 'Every path unfolds into quarterly milestones you can mark as in-progress or done.' },
  { icon: Users, title: 'Mentor matching', text: 'A directory of industry mentors filtered by specialty and experience, with a one-tap connection request.' },
  { icon: FileCheck, title: 'Resume reality-check', text: 'Paste your resume and see which skills you claim versus which ones your target path actually needs.' },
  { icon: Download, title: 'Export and share', text: 'Generate a clean summary card of any path — useful for a viva, a mentor call, or your own wall.' },
];

export function LandingPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg grid-bg-fade" />
        <div className="absolute -top-40 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 sm:px-6 sm:pt-28 lg:pt-36">
          <div className="mx-auto max-w-3xl text-center">
            <span className="section-eyebrow">The 5-Year Simulator</span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              See your career
              <span className="text-accent"> before you live it.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted text-pretty">
              Tell CareerPath where you stand today. It simulates your next five years
              across multiple paths — role progression, salary, skill gaps, and milestones —
              then lets you replay the what-ifs.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/register" className="btn-primary px-6 py-3 text-base">
                Start your simulation <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/how-it-works" className="btn-secondary px-6 py-3 text-base">
                How it works
              </Link>
            </div>
            <p className="mt-5 text-xs text-muted">
              No credit card. No email confirmation. Demo profile ready in one click.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {[
              { stat: '3', label: 'divergent career branches per simulation' },
              { stat: '5 yrs', label: 'year-by-year role and salary projection' },
              { stat: '20+', label: 'milestone templates across roles and industries' },
            ].map((s) => (
              <div key={s.label} className="surface-card p-6 text-center">
                <div className="stat-number text-accent">{s.stat}</div>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-12 max-w-2xl">
          <span className="section-eyebrow">What you get</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground text-balance">
            One tool, eight deliberate features.
          </h2>
          <p className="mt-3 text-muted text-pretty">
            Not a single demo screen. CareerPath is a complete environment for thinking
            about your career as a system you can model and tweak.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group surface-card p-6 transition-all duration-300 hover:border-accent/40 hover:-translate-y-1"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-transform duration-300 group-hover:scale-110">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm text-muted text-pretty">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-surface/30">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-foreground text-balance sm:text-4xl">
            The best career move is one you have already simulated.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted text-pretty">
            Whether you are a final-year student weighing specialisation versus management,
            or a professional wondering if a pivot is worth the pay cut, CareerPath gives
            you the numbers to decide with confidence.
          </p>
          <Link to="/register" className="btn-primary mt-8 px-6 py-3 text-base">
            Build your first path <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
