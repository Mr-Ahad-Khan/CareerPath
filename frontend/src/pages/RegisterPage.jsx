import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, GraduationCap, Briefcase, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth.jsx';
import { useToast } from '@/lib/toast.jsx';
import { Logo } from '@/components/Logo.jsx';

const roles = [
  { value: 'student', label: 'Student', icon: GraduationCap, desc: 'Simulate paths and track milestones' },
  { value: 'mentor', label: 'Mentor', icon: Briefcase, desc: 'Receive connection requests from students' },
  { value: 'admin', label: 'Admin / Faculty', icon: Shield, desc: 'View aggregate analytics across users' },
];

export function RegisterPage() {
  const { signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await signup(form);
      toast.success(`Account created. Welcome, ${user.name.split(' ')[0]}.`);
      navigate('/simulate');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 sm:px-6">
      <Logo className="mb-8" />
      <div className="w-full surface-card p-8">
        <h1 className="font-display text-2xl font-semibold text-foreground">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted">Free, instant, no email confirmation needed.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="field-label" htmlFor="name">Full name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="name"
                className="field-input pl-9"
                value={form.name}
                onChange={set('name')}
                placeholder="Your name"
                required
                autoComplete="name"
              />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="email"
                type="email"
                className="field-input pl-9"
                value={form.email}
                onChange={set('email')}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label className="field-label" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="password"
                type="password"
                className="field-input pl-9"
                value={form.password}
                onChange={set('password')}
                placeholder="At least 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div>
            <label className="field-label">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-200 ${
                    form.role === r.value
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border bg-surface-2 text-muted hover:border-accent/30'
                  }`}
                >
                  <r.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{r.label}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Creating account...' : 'Create account'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>

      <p className="mt-6 text-sm text-muted">
        Already have an account? <Link to="/login" className="text-accent hover:underline">Sign in</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
