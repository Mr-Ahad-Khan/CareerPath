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
  ["Experience premium", "1 + min(experience years, 10) x 0.04"],
  ["Starting salary", "baseline x industry multiplier x location multiplier x experience premium"],
  ["Year-5 salary", "starting salary x branch growth factor x what-if adjustments"],
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

      <section className="mt-8 surface-card border-accent/30 bg-accent/5 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-foreground">Worked example</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Suppose a senior profile has 12 years of experience, a senior baseline of ₹20,00,000, and an AI industry multiplier of 1.15.
        </p>
        <pre className="mt-5 overflow-x-auto rounded-lg bg-surface-2 p-4 text-sm leading-relaxed text-foreground">{`experience premium = 1 + min(12, 14) x 0.025
                  = 1.30

starting salary = ₹20,00,000 x 1.15 x 1.30
                = ₹29,90,000

management year-5 growth factor = 1 + (0.075 x 5) + (0.007 x 5 x 5)
                                = 1.55

year-5 estimate = ₹29,90,000 x 1.55
                = ₹46,34,500`}</pre>
        <div className="mt-5 flex items-start gap-3 text-sm text-muted">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <p>The result is intentionally an estimate. Actual compensation depends on country, city, company, role scope, performance, equity, and market conditions.</p>
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
