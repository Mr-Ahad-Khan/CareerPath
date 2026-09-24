import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  Database,
  Scale,
} from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "1. Profile inputs",
    body: "The engine reads your experience, skills, interests, education level, industry signals, location setting, and what-if options. Graduation year is stored as profile context; the salary projection uses the years-of-experience value.",
  },
  {
    icon: Scale,
    title: "2. Starting salary",
    body: "The starting estimate combines an experience-level baseline, industry multiplier, location multiplier, and a bounded experience premium. The experience premium is capped at 10 years so entering a long career history cannot inflate the result without limit.",
  },
  {
    icon: Calculator,
    title: "3. Five-year projection",
    body: "Each career branch applies its own moderate compounded growth curve. Mid-career users begin at the middle role in a branch, while senior users begin at the final role instead of being promoted from entry level.",
  },
];

const formulas = [
  ["Experience brackets", "calibrated bands (0-1y, 1-3y, 3-5y, 5-8y, 8-11y, 11-15y, 15+y) preventing runaway senior inflation"],
  ["City multiplier", "Bangalore (1.15), Delhi NCR (1.08), Mumbai (1.06), Pune (0.90), Chennai (0.88), Lucknow (0.62), etc."],
  ["Starting salary", "bracket base (or reported CTC) x city multiplier x market tier"],
  ["Continuous field progression", "effective experience = startExp + y; annual rate constrained by bracket growth ceiling"],
  ["Skill match", "average of each required skill's proficiency divided by 5"],
];

export default function CalculationProofPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <Link to="/dashboard" className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <span className="section-eyebrow">Calculation proof</span>
      <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold text-foreground text-balance sm:text-5xl">
        See exactly how a projection is built.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
        CareerPath uses a transparent rules engine. These are the actual calculation stages behind the salary, role, confidence, and skill-gap results. They are estimates, not live salary-market quotes.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, body }) => (
          <section key={title} className="surface-card p-5">
            <Icon className="h-6 w-6 text-accent" />
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
          </section>
        ))}
      </div>

      <section className="mt-8 surface-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Calculator className="h-5 w-5 text-accent" />
          <h2 className="font-display text-2xl font-semibold text-foreground">Formulas used</h2>
        </div>
        <div className="mt-6 space-y-3">
          {formulas.map(([label, formula]) => (
            <div key={label} className="grid gap-2 border-b border-border pb-3 last:border-0 last:pb-0 sm:grid-cols-[180px_1fr] sm:items-center">
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <code className="overflow-x-auto rounded-lg bg-surface-2 px-3 py-2 text-xs text-accent">{formula}</code>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 surface-card p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 text-accent" />
          <h2 className="font-display text-2xl font-semibold text-foreground">Skill Weightage & AI Scoring Basis</h2>
        </div>
        <p className="mt-2 text-sm text-muted">
          Every skill input is mapped through a weighted matrix that determines skill match, AI readiness, and trajectory pacing.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface-2 p-4">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">1. Core Anchor (1.3x – 1.5x)</span>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">
              Non-negotiable foundational skills that dictate role viability (e.g., <strong>System Design (1.4)</strong>, <strong>Security (1.5)</strong>, <strong>Machine Learning (1.5)</strong>, <strong>Leadership (1.4)</strong>). Missing these introduces steep gap penalties.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface-2 p-4">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">2. Production Stack (1.0x – 1.2x)</span>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">
              Primary implementation tech stacks (e.g., <strong>TypeScript (1.2)</strong>, <strong>React (1.1)</strong>, <strong>AWS (1.2)</strong>, <strong>Next.js (1.2)</strong>). Dictates day-to-day execution efficiency and immediate job readiness.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-surface-2 p-4">
            <span className="text-xs font-bold text-accent uppercase tracking-wider">3. Auxiliary / Tools (0.8x – 0.9x)</span>
            <p className="mt-1.5 text-xs text-muted leading-relaxed">
              Supporting developer tools and protocols (e.g., <strong>Git (0.84)</strong>, <strong>SQL (0.82)</strong>, <strong>REST API (0.8)</strong>). Fast to bridge via short onboarding upskilling.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border bg-surface-2 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Proficiency Scale & AI Metrics Formula</h3>
          <div className="grid gap-2 text-xs text-muted sm:grid-cols-2">
            <div className="rounded-lg bg-surface p-2.5 border border-border/60">
              <strong className="text-foreground">Proficiency Scale (1 to 5):</strong>
              <div className="mt-1">1 = Novice (20%), 2 = Advanced Beginner (40%), 3 = Competent (60%), 4 = Proficient Lead (80%), 5 = Domain Master (100%).</div>
            </div>
            <div className="rounded-lg bg-surface p-2.5 border border-border/60">
              <strong className="text-foreground">AI Readiness Index (50% – 98%):</strong>
              <div className="mt-1">Base 68% + Architectural/Leadership agency bonus (+20%) − Critical foundational gaps penalty (-8%).</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 surface-card border-accent/30 bg-accent/5 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Worked example</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Suppose an experienced tech lead profile has 12 years of experience in Bangalore, anchoring to the Staff / Principal bracket (₹33,00,000 baseline) with Bangalore's 1.15 multiplier.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-lg bg-surface-2 p-4 text-sm leading-relaxed text-foreground">{`bracket baseline (11-15 yrs) = ₹33,00,000
Bangalore city multiplier = 1.15
market tier (growth product) = 1.05

Year 0 starting anchor = ₹33,00,000 x 1.15 x 1.05
                       = ₹39,84,750 (bounded within ₹24L - ₹46L city band)

Annual bracket growth ceiling = 6.0% / year (calibrated to avoid runaway inflation)
Year 5 realistic estimate   = ₹39,84,750 x (1 + 0.06)^5 ≈ ₹53,32,000 (grounded for staff architect)`}</pre>
        <div className="mt-5 flex items-start gap-3 text-sm text-muted">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <p>Assumes continuous, active employment and progression in this field. Results are calibrated with market brackets to reflect authentic senior compensation curves.</p>
        </div>
      </section>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/simulate" className="btn-primary">
          Run another simulation <ArrowLeft className="h-4 w-4 rotate-180" />
        </Link>
        <Link to="/how-it-works" className="btn-secondary">
          Read the wider methodology
        </Link>
      </div>
    </div>
  );
}
