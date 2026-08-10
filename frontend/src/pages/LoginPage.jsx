import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth.jsx';
import { useToast } from '@/lib/toast.jsx';
import { Logo } from '@/components/Logo.jsx';

const mentorDemoAccounts = [
  'ananya.iyer', 'rohan.mehta', 'sara.cherian', 'dev.patel',
  'meera.krishnan', 'arjun.nair', 'priya.saxena', 'kabir.anand',
].map((username) => ({
  label: username.split('.').map((part) => part[0].toUpperCase() + part.slice(1)).join(' '),
  email: `${username}@demo.careerpath.app`,
}));
const mentorDemoPassword = 'mentor1234';
const studentDemoAccount = {
  label: 'Student demo',
  email: 'ishaan.verma@demo.careerpath.app',
  password: 'demo1234',
};
const adminDemoAccount = {
  label: 'Faculty Reviewer (Admin)',
  email: 'admin@careerpath.app',
  password: 'admin1234',
};

export function LoginPage() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}.`);
      navigate(from);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async (account) => {
    setLoading(true);
    try {
      const user = await login(account.email, account.password);
      toast.success(`${user.role[0].toUpperCase() + user.role.slice(1)} demo loaded. Take a look around.`);
      navigate('/dashboard');
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
        <h1 className="font-display text-2xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted">Sign in to pick up where you left off.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                id="email"
                type="email"
                className="field-input pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                autoComplete="current-password"
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full py-3">
            {loading ? 'Signing in...' : 'Sign in'} <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <button onClick={() => loginDemo(studentDemoAccount)} disabled={loading} className="btn-secondary w-full py-3">
          <Zap className="h-4 w-4 text-accent" /> Open student demo
        </button>
        <p className="mt-3 text-center text-xs text-muted">
          Admin demo: <code>{adminDemoAccount.email}</code> · password: <code>{adminDemoAccount.password}</code>
        </p>
        <details className="mt-5 rounded-lg border border-border bg-surface/40 p-3">
          <summary className="cursor-pointer text-sm font-medium text-foreground">Demo accounts</summary>
          <p className="mt-2 text-xs text-muted">All mentor demos use password: <code>{mentorDemoPassword}</code></p>
          <div className="mt-3 space-y-1.5">
            {mentorDemoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                onClick={() => loginDemo({ ...account, password: mentorDemoPassword })}
                disabled={loading}
                className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left text-xs hover:bg-surface"
              >
                <span className="font-medium text-foreground">{account.label}</span>
                <span className="ml-3 truncate text-muted">{account.email}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => loginDemo(adminDemoAccount)}
            disabled={loading}
            className="mt-3 flex w-full items-center justify-between rounded border-t border-border px-2 pt-3 text-left text-xs hover:bg-surface"
          >
            <span className="font-medium text-foreground">Open {adminDemoAccount.label} demo</span>
            <span className="ml-3 truncate text-muted">{adminDemoAccount.email} · {adminDemoAccount.password}</span>
          </button>
        </details>
        <p className="mt-2 text-center text-xs text-muted">
          Jump straight into a pre-built simulation — no typing required.
        </p>
      </div>

      <p className="mt-6 text-sm text-muted">
        No account yet? <Link to="/register" className="text-accent hover:underline">Create one</Link>
      </p>
    </div>
  );
}

export default LoginPage;
