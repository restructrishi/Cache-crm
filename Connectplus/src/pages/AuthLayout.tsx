import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="h-screen overflow-hidden bg-surface-dark text-ink-primary">
      <div className="mx-auto flex h-full max-w-6xl flex-col md:flex-row">
        {/* Form side */}
        <div className="flex flex-1 flex-col justify-between border-b border-white/5 bg-surface-dark/95 px-6 py-5 md:border-b-0 md:border-r">
          <div className="flex flex-1 flex-col justify-center space-y-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-indigo via-accent-violet to-accent-emerald shadow-soft-lg shadow-accent-indigo/40">
                <span className="text-xs font-semibold text-ink-primary">+</span>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-xs font-semibold tracking-[0.18em] uppercase text-ink-muted">
                  connect+
                </span>
                <span className="text-[10px] text-ink-muted/80">
                  Unified Enterprise Operating Platform
                </span>
              </div>
            </Link>

            <div className="space-y-2">
              <h1 className="text-xl font-semibold tracking-tight text-ink-primary sm:text-2xl">
                {title}
              </h1>
              <p className="text-sm text-ink-muted">{subtitle}</p>
            </div>

            <div className="elevated-panel bg-surface-elevated/95 p-4">
              <div className="space-y-4">{children}</div>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-ink-muted/70">
            By continuing, you acknowledge that connect+ is designed for governed, auditable enterprise workflows.
          </p>
        </div>

        {/* Info side - Clean, minimal, text-only (no visuals) */}
        <div className="relative hidden flex-1 items-stretch overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900 md:flex">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.24),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.22),_transparent_60%)]" />
          <div className="relative flex w-full flex-col justify-between px-6 py-6">
            <div className="flex justify-end">
              <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[10px] font-medium text-slate-600 shadow-md shadow-slate-300/70 backdrop-blur">
                Enterprise-grade, boardroom-ready
              </span>
            </div>
            <div className="flex flex-1 flex-col justify-center space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-700 shadow-sm shadow-slate-300/60 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Secure by design</span>
              </div>
              <h2 className="max-w-sm text-balance text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
                Quietly powerful. Deliberately governed.
              </h2>
              <p className="max-w-md text-xs leading-relaxed text-slate-700 sm:text-sm">
                connect+ operates as the connective tissue between sales motions, commercial structures, deployments,
                and AI delivery—so your organisation moves as a single, accountable system.
              </p>

              <div className="grid gap-2.5 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/70 bg-white/80 p-3 text-[10px] text-slate-700 shadow-md shadow-slate-300/70 backdrop-blur sm:text-xs">
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Security & integrity
                  </h3>
                  <ul className="space-y-1 text-[10px]">
                    <li>Role-based workflows with clear separation of duties.</li>
                    <li>Immutable event history for every critical transition.</li>
                    <li>Policy-aware approvals and thresholds.</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 p-3 text-[10px] text-slate-700 shadow-md shadow-slate-300/70 backdrop-blur sm:text-xs">
                  <h3 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                    Performance & scale
                  </h3>
                  <ul className="space-y-1 text-[10px]">
                    <li>Designed for multi-entity, multi-region enterprises.</li>
                    <li>Optimised for long-lived, complex programs.</li>
                    <li>Consistent operating model across product lines.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="rounded-2xl border border-white/70 bg-white/80 p-3 text-[10px] text-slate-700 shadow-md shadow-slate-300/70 backdrop-blur sm:text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">Execution telemetry</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-medium text-emerald-700">
                    Healthy · 99.9%
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[9px] text-slate-600">
                  <span className="inline-flex h-1.5 w-16 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
                  <span>Workflow adherence, SLA performance, and control utilisation.</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-600">
                No vanity metrics. connect+ surfaces the operational signals that matter to boards, regulators, and
                long-term operators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
