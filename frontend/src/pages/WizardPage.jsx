import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Zap, Plus, X, GraduationCap, Code2, Heart, Settings2, Check, Terminal, Sparkles } from 'lucide-react';
import { api } from '@/lib/api.js';
import { useToast } from '@/lib/toast.jsx';
import { useCurrency } from '@/lib/currency.jsx';
import { LoadingOverlay } from '@/components/Spinner.jsx';
import { CITY_TIERS, EXPERIENCE_BRACKETS } from '@/lib/offline/data.js';
import { formatMoney } from '@/lib/format.js';

const SKILL_SUGGESTIONS = [
  'TypeScript', 'Python', 'Go', 'React', 'Node.js', 'System Design',
  'AWS', 'Kubernetes', 'Docker', 'SQL', 'Machine Learning', 'GraphQL',
  'Microservices', 'Engineering Leadership', 'Security', 'CI/CD',
];

const INTEREST_OPTIONS = [
  'backend architecture', 'distributed systems', 'full-stack engineering',
  'ai & ml modeling', 'cloud & platform sre', 'engineering management',
  'product development', 'developer tools', 'system security', 'high-scale data',
];

const steps = [
  { id: 0, label: 'Profile & CTC', icon: GraduationCap },
  { id: 1, label: 'Skills', icon: Code2 },
  { id: 2, label: 'Interests', icon: Heart },
  { id: 3, label: 'Constraints', icon: Settings2 },
];

const DEMO = {
  educationLevel: 'Postgraduate',
  educationField: 'Computer Applications & Software Systems',
  graduationYear: 2026,
  currentRole: 'Backend Developer',
  experienceYears: 3,
  currentSalary: 1100000,
  marketTier: 'growth-product',
  location: 'Bengaluru',
  targetRole: 'Staff Software Architect or Engineering Lead',
  skills: [
    { name: 'JavaScript', proficiency: 4 },
    { name: 'TypeScript', proficiency: 3 },
    { name: 'Node.js', proficiency: 4 },
    { name: 'Python', proficiency: 3 },
    { name: 'SQL', proficiency: 4 },
    { name: 'System Design', proficiency: 3 },
  ],
  interests: ['backend architecture', 'distributed systems', 'cloud & platform sre'],
  constraints: {
    upskillingBudget: 15000,
    timeAvailability: '15 hours/week',
    locationFlexibility: 'open to relocate',
  },
};

export function WizardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { currency } = useCurrency();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    educationLevel: 'Undergraduate',
    educationField: '',
    graduationYear: '',
    currentRole: '',
    experienceYears: 0,
    currentSalary: '',
    marketTier: 'growth-product',
    location: 'bangalore',
    targetRole: '',
    skills: [],
    interests: [],
    constraints: {
      upskillingBudget: 10000,
      timeAvailability: '10 hours/week',
      locationFlexibility: 'open to relocate',
    },
  });
  const [skillInput, setSkillInput] = useState('');

  const currentExp = Number(form.experienceYears) || 0;
  const matchedBracket =
    EXPERIENCE_BRACKETS.find(
      (b) => currentExp >= b.minYears && currentExp < b.maxYears
    ) || EXPERIENCE_BRACKETS[EXPERIENCE_BRACKETS.length - 1];
  const selectedCity = CITY_TIERS[form.location] || CITY_TIERS.bangalore;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const setConstraint = (k) => (e) =>
    setForm({ ...form, constraints: { ...form.constraints, [k]: e.target.value } });

  const addSkill = (name) => {
    const clean = name.trim();
    if (!clean) return;
    if (form.skills.some((s) => s.name.toLowerCase() === clean.toLowerCase())) return;
    setForm({
      ...form,
      skills: [...form.skills, { name: clean, proficiency: 3 }],
    });
    setSkillInput('');
  };

  const removeSkill = (name) =>
    setForm({ ...form, skills: form.skills.filter((s) => s.name !== name) });

  const setProficiency = (name, val) =>
    setForm({
      ...form,
      skills: form.skills.map((s) =>
        s.name === name ? { ...s, proficiency: parseInt(val, 10) } : s
      ),
    });

  const toggleInterest = (i) =>
    setForm({
      ...form,
      interests: form.interests.includes(i)
        ? form.interests.filter((x) => x !== i)
        : [...form.interests, i],
    });

  const loadDemo = () => {
    setForm(DEMO);
    toast.info('Demo profile loaded. Hit simulate to see it in action.');
  };

  const canProceed = () => {
    if (step === 0) return form.educationField.trim().length > 0;
    if (step === 1) return form.skills.length >= 2;
    if (step === 2) return form.interests.length >= 1;
    return true;
  };

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const profileRes = await api.post('/profiles', { ...form, currency });
      const simRes = await api.post('/simulations', {
        profileId: profileRes.profile.id,
        name: `${form.educationField} — 5-year plan`,
      });
      toast.success('Simulation generated. Multiple paths are ready.');
      navigate(`/simulation/${simRes.simulation.id}`);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  if (loading) return <LoadingOverlay label="Simulating your next five years..." />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <span className="section-eyebrow">Skill Intake Wizard</span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">
            Tell us where you stand.
          </h1>
        </div>
        <button onClick={loadDemo} className="btn-secondary shrink-0">
          <Zap className="h-4 w-4 text-accent" /> Demo
        </button>
      </div>

      <div className="mb-8 flex items-center gap-1.5">
        {steps.map((s, i) => (
          <div key={s.id} className="flex flex-1 items-center gap-1.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold transition-all duration-300 ${
                i < step
                  ? 'border-accent bg-accent text-accent-contrast'
                  : i === step
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-surface-2 text-muted'
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-px flex-1 transition-colors duration-300 ${
                  i < step ? 'bg-accent' : 'bg-border'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="surface-card p-6 sm:p-8 animate-fade-in" key={step}>
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="field-label">Education level</label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {['Undergraduate', 'Postgraduate', 'Diploma'].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setForm({ ...form, educationLevel: l })}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                      form.educationLevel === l
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-border bg-surface-2 text-muted hover:border-accent/30'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="field-label">Field of study / Degree</label>
              <input className="field-input" value={form.educationField} onChange={set('educationField')} placeholder="e.g. Computer Science, MCA, Software Engineering" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="field-label">Graduation year</label>
                <input type="number" className="field-input" value={form.graduationYear} onChange={set('graduationYear')} placeholder="2026" />
              </div>
              <div>
                <label className="field-label">Total years of tech experience</label>
                <input type="number" step="0.5" min="0" max="25" className="field-input" value={form.experienceYears} onChange={set('experienceYears')} placeholder="0" />
              </div>
            </div>

            {/* City & Tech Hub Selector */}
            <div>
              <label className="field-label">City / Tech Hub Location</label>
              <select
                className="field-select font-medium"
                value={form.location || 'bangalore'}
                onChange={set('location')}
              >
                {Object.values(CITY_TIERS).map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name} — {c.tier} ({c.multiplier >= 1 ? `+${Math.round((c.multiplier - 1) * 100)}%` : `-${Math.round((1 - c.multiplier) * 100)}%`} pay band)
                  </option>
                ))}
              </select>
            </div>

            {/* Realistic Salary & Market Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="field-label">Current annual CTC / Salary (optional)</label>
                <input
                  type="number"
                  className="field-input"
                  value={form.currentSalary}
                  onChange={set('currentSalary')}
                  placeholder={Number(form.experienceYears) >= 4 ? 'e.g. 1100000 (auto-calculated if blank)' : 'e.g. 450000 (auto-calculated if blank)'}
                />
              </div>

              <div>
                <label className="field-label">Target software market tier</label>
                <select
                  className="field-select"
                  value={form.marketTier}
                  onChange={set('marketTier')}
                >
                  <option value="growth-product">Growth-stage Product / SaaS (Market Baseline)</option>
                  <option value="tier1-faang">Top-Tier Tech / FAANG / Unicorn (+20% Premium)</option>
                  <option value="standard-tech">Early-Stage / Standard Tech Firm</option>
                </select>
              </div>
            </div>

            {/* Clean Market Benchmark Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 bg-surface-2/60 px-3.5 py-2.5 text-xs">
              <span className="text-muted">
                Benchmark for <span className="font-semibold text-foreground">{matchedBracket.label}</span> in <span className="font-semibold text-foreground">{selectedCity.name}</span>:
              </span>
              <span className="font-semibold text-accent tabular">
                {formatMoney(Math.round(matchedBracket.minRealistic * selectedCity.multiplier), currency)} – {formatMoney(Math.round(matchedBracket.maxRealistic * selectedCity.multiplier), currency)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="field-label">Current title or role (optional)</label>
                <input className="field-input" value={form.currentRole} onChange={set('currentRole')} placeholder="e.g. Senior Backend Engineer, Tech Lead" />
              </div>
              <div>
                <label className="field-label">Target 5-year role (optional)</label>
                <input className="field-input" value={form.targetRole} onChange={set('targetRole')} placeholder="e.g. Staff Architect, VP of Engineering, CTO" />
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="field-label">Add a skill</label>
              <div className="flex gap-2">
                <input
                  className="field-input"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                  placeholder="Type a skill and press Enter"
                />
                <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary px-4">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SKILL_SUGGESTIONS.filter((s) => !form.skills.some((fs) => fs.name === s)).slice(0, 10).map((s) => (
                  <button key={s} type="button" onClick={() => addSkill(s)} className="chip hover:chip-accent">
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {form.skills.length > 0 && (
              <div className="space-y-3 pt-2">
                <p className="field-label">Rate your proficiency (1 = beginner, 5 = expert)</p>
                {form.skills.map((s) => (
                  <div key={s.name} className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 p-3">
                    <span className="w-28 shrink-0 text-sm font-medium text-foreground truncate">{s.name}</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={s.proficiency}
                      onChange={(e) => setProficiency(s.name, e.target.value)}
                      className="flex-1"
                    />
                    <span className="w-8 shrink-0 text-center text-sm font-semibold tabular text-accent">{s.proficiency}</span>
                    <button type="button" onClick={() => removeSkill(s.name)} className="text-muted hover:text-error">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {form.skills.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">Add at least two skills to continue.</p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-muted">Pick the areas that genuinely excite you. These shape which career branches the engine prioritises.</p>
            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleInterest(i)}
                  className={`rounded-xl border px-4 py-2 text-sm font-medium capitalize transition-all duration-200 ${
                    form.interests.includes(i)
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-surface-2 text-muted hover:border-accent/30'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            {form.interests.length > 0 && (
              <p className="text-xs text-muted">{form.interests.length} selected</p>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="field-label">Monthly upskilling budget (INR)</label>
              <input type="number" className="field-input" value={form.constraints.upskillingBudget} onChange={setConstraint('upskillingBudget')} placeholder="10000" />
            </div>
            <div>
              <label className="field-label">Time availability</label>
              <select className="field-select" value={form.constraints.timeAvailability} onChange={setConstraint('timeAvailability')}>
                {['5 hours/week', '10 hours/week', '15 hours/week', '20+ hours/week'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label">Location flexibility</label>
              <select className="field-select" value={form.constraints.locationFlexibility} onChange={setConstraint('locationFlexibility')}>
                {['open to relocate', 'remote only', 'city-bound'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
              <p className="text-sm text-foreground">Ready to simulate.</p>
              <p className="mt-1 text-xs text-muted">
                We will generate multiple divergent five-year paths based on your inputs. You can tweak them with what-if sliders afterwards.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button onClick={back} disabled={step === 0} className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          {step < 3 ? (
            <button onClick={next} disabled={!canProceed()} className="btn-primary">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={handleSubmit} className="btn-primary">
              Simulate my career <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default WizardPage;
