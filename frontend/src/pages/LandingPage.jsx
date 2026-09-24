import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, GitBranch, Radar, Sliders, Target, Users, FileCheck, Download } from 'lucide-react';

const features = [
  { icon: GitBranch, title: 'Multi-path branch engine', text: 'Simulate up to 5 concurrent engineering tracks — IC specialist, cloud architect, AI lead, founder, or engineering manager.' },
  { icon: TrendingUp, title: 'Realistic tech salary bands', text: 'Market-anchored compensation bands for junior, senior, staff, and principal engineers with realistic tech tier multipliers.' },
  { icon: Radar, title: 'Skill gap radar', text: 'A spider chart pinpoints exactly which technologies and system design concepts separate you from your target role.' },
  { icon: Sliders, title: 'What-if intelligence', text: 'Model the impact of AI adoption, upskilling hours, or remote vs top-tier tech hubs with immediate trajectory re-renders.' },
  { icon: Target, title: 'Milestone roadmap', text: 'Every path unfolds into quarterly technical milestones you can mark as in-progress or completed.' },
  { icon: Users, title: 'Mentor chat & matching', text: 'Direct 1-on-1 messaging with verified tech leads, staff engineers, and engineering managers.' },
  { icon: FileCheck, title: 'Resume reality-check', text: 'Audit your tech stack and experience against industry expectations for your target senior role.' },
  { icon: Download, title: 'Export and share', text: 'Generate a clean summary card of any path — useful for promotion discussions, 1-on-1s, or mentor reviews.' },
];

export function LandingPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 grid-bg grid-bg-fade" />
        <div className="absolute -top-40 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28 lg:pt-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Specialized for Software Engineers & Tech Professionals
            </div>
            <h1 className="mt-2 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl text-balance">
              See your tech career
              <span className="text-accent"> before you live it.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-muted text-pretty">
              Whether you are an aspiring developer or an experienced staff engineer, simulate your next five years
              across IC, Cloud Architecture, AI Leadership, and Tech Management with realistic salary models and live mentor chat.
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
              Built for developers • Grounded salary baselines • Compounding growth for consistent schedules • Free & instant
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {[
              { stat: 'Up to 8', label: 'concurrent software career branches' },
              { stat: '5 yrs', label: 'realistic seniority & compensation progression' },
              { stat: '100% Tech', label: 'tailored for software, cloud, data & engineering management' },
            ].map((s) => (
              <div key={s.label} className="surface-card p-6 text-center">
                <div className="stat-number text-accent">{s.stat}</div>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consistency & Schedule Compounding Section */}
      <section className="border-b border-border/80 bg-surface-2/20 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/10 via-surface-2/60 to-surface-2/30 p-8 sm:p-12 shadow-lg">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></span>
                  Compounding Career Progression
                </span>
                <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl text-balance">
                  If you keep continuing & consistently follow your schedule, growth compounds.
                </h2>
                <p className="mt-4 text-base text-muted leading-relaxed text-pretty">
                  Top engineering careers don’t leap forward overnight—they compound through disciplined, continuous execution. When you consistently follow your weekly upskilling schedule and hit quarterly roadmap milestones, your skill coverage, market value, and trajectory confidence rise together predictably without multi-year career gaps.
                </p>
                <div className="mt-6 flex flex-wrap gap-4 text-xs sm:text-sm text-foreground/90 font-medium">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">✓</span>
                    <span>10–15h / week deliberate practice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">✓</span>
                    <span>Structured quarterly milestone delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">✓</span>
                    <span>Continuous domain progression</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:w-96 shrink-0">
                <div className="rounded-xl border border-border/70 bg-surface/80 p-4 backdrop-blur-sm">
                  <span className="text-xs text-muted block">Adherence Velocity</span>
                  <span className="font-display text-2xl font-bold text-accent mt-1 block">+25% to +40%</span>
                  <p className="text-[11px] text-muted mt-1">Faster promotion velocity for consistent weekly schedules</p>
                </div>
                <div className="rounded-xl border border-border/70 bg-surface/80 p-4 backdrop-blur-sm">
                  <span className="text-xs text-muted block">Trajectory Confidence</span>
                  <span className="font-display text-2xl font-bold text-success mt-1 block">85% – 95%</span>
                  <p className="text-[11px] text-muted mt-1">High-conviction trajectory backed by structured milestones</p>
                </div>
                <div className="sm:col-span-2 rounded-xl border border-border/70 bg-surface/80 p-4 backdrop-blur-sm">
                  <span className="text-xs text-muted block">Compounding Principle</span>
                  <p className="text-xs text-foreground font-medium mt-1">
                    "Consistent daily progress in a specialized tech domain outperforms occasional bursts of frantic effort every time."
                  </p>
                </div>
              </div>
            </div>
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
