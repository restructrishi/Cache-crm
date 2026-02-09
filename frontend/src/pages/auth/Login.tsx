import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/landing/AuthLayout';

const API_BASE = 'http://localhost:3000/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || `Login failed (${response.status})`);
      }

      const token = data.access_token ?? data.token;
      const user = data.user ?? {};
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      const roles = ((user as { roles?: string[] }).roles ?? []).map((r: string) => r.toUpperCase());

      if (roles.includes('SUPER_ADMIN')) {
        navigate('/super-admin');
      } else if (roles.includes('ORG_ADMIN')) {
        navigate('/admin');
      } else {
        navigate('/app');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back to connect+"
      subtitle="Sign in to continue orchestrating governed workflows across your enterprise."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs font-medium text-ink-muted">
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full rounded-2xl border border-white/8 bg-surface-muted/80 px-3 py-2.5 text-sm text-ink-primary shadow-soft-inner outline-none ring-0 transition placeholder:text-ink-muted/50 focus:border-accent-indigo/60 focus:bg-surface-muted focus:ring-2 focus:ring-accent-indigo/50"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-xs font-medium text-ink-muted">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-2xl border border-white/8 bg-surface-muted/80 px-3 py-2.5 text-sm text-ink-primary shadow-soft-inner outline-none ring-0 transition placeholder:text-ink-muted/50 focus:border-accent-indigo/60 focus:bg-surface-muted focus:ring-2 focus:ring-accent-indigo/50"
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-ink-muted/80">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border border-white/20 bg-surface-muted text-accent-indigo outline-none ring-0 focus:ring-1 focus:ring-accent-indigo/60"
            />
            <span>Keep me signed in on this device</span>
          </label>
          <button type="button" className="text-[11px] font-medium text-accent-indigo/80 hover:text-accent-indigo">
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-emerald px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-primary shadow-soft-lg shadow-accent-indigo/40 transition hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="border-t border-white/5 pt-4 text-[11px] text-ink-muted/80">
        <div className="flex items-center justify-between gap-2">
          <span>First time here?</span>
          <Link to="/signup" className="text-[11px] font-medium text-accent-emerald/80 hover:text-accent-emerald">
            Create a connect+ workspace
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
