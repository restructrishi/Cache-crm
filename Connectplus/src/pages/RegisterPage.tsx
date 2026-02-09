import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'

export function RegisterPage() {
  return (
    <AuthLayout
      title="Create your connect+ workspace"
      subtitle="Establish a governed operating surface that connects sales, delivery, cloud, and compliance."
    >
      <form className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-xs font-medium text-ink-muted">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="w-full rounded-2xl border border-white/8 bg-surface-muted/80 px-3 py-2.5 text-sm text-ink-primary shadow-soft-inner outline-none ring-0 transition placeholder:text-ink-muted/50 focus:border-accent-emerald/60 focus:bg-surface-muted focus:ring-2 focus:ring-accent-emerald/40"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="company" className="block text-xs font-medium text-ink-muted">
              Organisation
            </label>
            <input
              id="company"
              type="text"
              autoComplete="organization"
              className="w-full rounded-2xl border border-white/8 bg-surface-muted/80 px-3 py-2.5 text-sm text-ink-primary shadow-soft-inner outline-none ring-0 transition placeholder:text-ink-muted/50 focus:border-accent-emerald/60 focus:bg-surface-muted focus:ring-2 focus:ring-accent-emerald/40"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="work-email" className="block text-xs font-medium text-ink-muted">
            Work email
          </label>
          <input
            id="work-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            className="w-full rounded-2xl border border-white/8 bg-surface-muted/80 px-3 py-2.5 text-sm text-ink-primary shadow-soft-inner outline-none ring-0 transition placeholder:text-ink-muted/50 focus:border-accent-emerald/60 focus:bg-surface-muted focus:ring-2 focus:ring-accent-emerald/40"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-xs font-medium text-ink-muted">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            className="w-full rounded-2xl border border-white/8 bg-surface-muted/80 px-3 py-2.5 text-sm text-ink-primary shadow-soft-inner outline-none ring-0 transition placeholder:text-ink-muted/50 focus:border-accent-emerald/60 focus:bg-surface-muted focus:ring-2 focus:ring-accent-emerald/40"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="domain" className="block text-xs font-medium text-ink-muted">
            Primary operating region
          </label>
          <select
            id="domain"
            className="w-full rounded-2xl border border-white/8 bg-surface-muted/80 px-3 py-2.5 text-xs text-ink-primary shadow-soft-inner outline-none ring-0 transition focus:border-accent-emerald/60 focus:bg-surface-muted focus:ring-2 focus:ring-accent-emerald/40"
          >
            <option value="">Select a region</option>
            <option>North America</option>
            <option>Europe, Middle East & Africa</option>
            <option>Asia Pacific</option>
            <option>Latin America</option>
          </select>
        </div>
        <div className="space-y-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-3 text-[11px] text-emerald-100">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="font-medium">Governed evaluation tier</span>
          </div>
          <p>
            Your initial workspace is provisioned with guardrails and sample workflows suitable for internal evaluation
            and architecture reviews.
          </p>
        </div>
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-accent-emerald via-accent-indigo to-accent-violet px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-primary shadow-soft-lg shadow-accent-emerald/40 transition hover:brightness-110"
        >
          Create workspace
        </button>
      </form>

      <div className="border-t border-white/5 pt-4 text-[11px] text-ink-muted/80">
        <div className="flex items-center justify-between gap-2">
          <span>Already operating on connect+?</span>
          <Link to="/login" className="text-[11px] font-medium text-accent-indigo/80 hover:text-accent-indigo">
            Sign in to your workspace
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}

