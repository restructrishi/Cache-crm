import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'

export function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back to connect+"
      subtitle="Sign in to continue orchestrating governed workflows across your enterprise."
    >
      <form className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-xs font-medium text-ink-muted">
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
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
          <button
            type="button"
            className="text-[11px] font-medium text-accent-indigo/80 hover:text-accent-indigo"
          >
            Forgot password?
          </button>
        </div>
        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-emerald px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-primary shadow-soft-lg shadow-accent-indigo/40 transition hover:brightness-110"
        >
          Sign in
        </button>
      </form>

      <div className="border-t border-white/5 pt-4 text-[11px] text-ink-muted/80">
        <div className="flex items-center justify-between gap-2">
          <span>First time here?</span>
          <Link to="/register" className="text-[11px] font-medium text-accent-emerald/80 hover:text-accent-emerald">
            Create a connect+ workspace
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

