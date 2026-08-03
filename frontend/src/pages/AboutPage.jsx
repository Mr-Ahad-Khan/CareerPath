import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Scale, TrendingUp, Layers, Lightbulb, ShieldCheck } from 'lucide-react';

const pillars = [
  {
    icon: Scale,
    title: 'Weighted skill matching',
    body: 'Each target role defines a set of required skills with importance weights. Your self-rated proficiency is compared against these, producing a 0-to-1 match score that drives confidence and salary projections. A skill rated weight 1.3 matters more than one at 0.8.',
  },
  {
    icon: TrendingUp,
    title: 'Market demand signals',
    body: 'Every skill in the knowledge base carries a demand coefficient drawn from industry hiring patterns. High-demand skills like machine learning (0.95) accelerate salary growth more than commoditised ones. Industry multipliers (AI at 1.35x, fintech at 1.22x) layer on top.',
  },
  {
    icon: Cpu,
    title: 'Salary progression curves',
    body: 'Each path branch uses its own non-linear growth function. The deep specialist curve accelerates after year two — slower starts, steeper ceilings. The pivot track starts lower but compounds faster once the domain switch lands. These are models, not promises.',
  },
  {
    icon: Layers,
    title: 'Branch divergence logic',
    body: 'The engine scores every available branch against your interests and current skills, then selects a primary (best fit), a secondary (strong alternative), and a divergent path (adjacent field, higher risk). This guarantees three meaningfully different tracks, not three flavours of the same one.',
  },
  {
    icon: Lightbulb,
    title: 'What-if sensitivity',
    body: 'The what-if sliders do not re-run a black box. They adjust context variables — location multiplier, upskilling intensity, time penalty, network strength — that feed directly into the growth functions. Move a slider and the curves recompute live, so you can feel the tradeoffs.',
  },
  {
    icon: ShieldCheck,
    title: 'The AI layer (optional)',
    body: 'The simulation route is structured so an OpenAI-compatible LLM call can replace the rule-based engine for richer, narrative roadmaps. When no API key is configured — as in this deployment — the weighted-scoring engine runs entirely offline with zero cost and zero latency.',
  },
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <span className="section-eyebrow">How it works</span>
      <h1 className="mt-4 font-display text-4xl font-semibold text-foreground text-balance sm:text-5xl">
        The simulation logic, explained plainly.
      </h1>
      <p className="mt-5 text-lg text-muted text-pretty">
        People ask whether an AI is deciding your career here. The honest answer: a
        deterministic, transparent scoring engine does the heavy lifting, and an optional
        LLM layer can enrich it when available. Here is exactly what happens when you hit
        simulate.
      </p>

      <div className="mt-12 space-y-6">
        {pillars.map((p, i) => (
          <div key={p.title} className="surface-card flex gap-5 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <p.icon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xs font-semibold text-accent">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-display text-xl font-semibold text-foreground">{p.title}</h2>
              </div>
              <p className="mt-2 text-sm text-muted text-pretty leading-relaxed">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 surface-card border-accent/30 bg-accent/5 p-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          A note on honesty
        </h3>
        <p className="mt-2 text-sm text-muted text-pretty">
          CareerPath is a decision-support tool, not a crystal ball. The projections are
          estimates built from models of how careers typically progress. Your actual
          trajectory depends on factors no engine can fully capture — market timing, the
          people you meet, and the bets you are willing to take. Use these simulations to
          compare options and surface blind spots, not to outsource the decision.
        </p>
      </div>

      <div className="mt-10 text-center">
        <Link to="/register" className="btn-primary px-6 py-3 text-base">
          Try it now <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}

export default AboutPage;
