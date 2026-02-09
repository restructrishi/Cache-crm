import { Link } from 'react-router-dom'
import { WorkflowGraphVisual, ArchitectureDiagramVisual, MetricsTelemetryVisual, EnterpriseStructureVisual } from '../components/LandingVisuals'

const problemPoints = [
  {
    title: 'Static records, no execution',
    body: 'Traditional CRMs were built to track contacts and opportunities, not the real workflows that move an enterprise forward.',
  },
  {
    title: 'Fragmented ownership',
    body: 'Sales, SCM, Cloud, Legal, and Delivery all run in disconnected tools, email threads, and local spreadsheets.',
  },
  {
    title: 'Compliance as an afterthought',
    body: 'Policies, approvals, and agreements live outside the system of record, making every audit a reconstruction exercise.',
  },
  {
    title: 'No end-to-end visibility',
    body: 'Leaders see pipeline and revenue, but not how deals become governed, deployed, and operated in production.',
  },
]

const modules = [
  {
    name: 'Sales & Pre-Sales',
    description:
      'Deal orchestration, solutioning, and approvals connected to the downstream work that must happen after signature.',
  },
  {
    name: 'SCM / Procurement',
    description:
      'Vendor onboarding, commercials, and sourcing workflows that stay linked to the opportunities and contracts they serve.',
  },
  {
    name: 'Deployment',
    description:
      'Structured project initiation, cutover plans, and deployment runbooks with accountable owners and gated milestones.',
  },
  {
    name: 'Cloud',
    description:
      'Landing zones, environments, migrations, and change windows tracked as first-class, governed workflows.',
  },
  {
    name: 'Data / AI',
    description:
      'Data products, AI use cases, and model lifecycle steps aligned to the contracts and policies that govern them.',
  },
  {
    name: 'Legal & Compliance',
    description:
      'Clauses, agreements, and policy controls wired directly into how work is initiated, approved, and executed.',
  },
]

const pillars = [
  {
    title: 'Platform',
    subtitle: 'Execution-native CRM',
    bullets: [
      'Model real workflows with roles, SLAs, and states.',
      'Route work across departments with structured handoffs.',
      'Design once, govern centrally, execute everywhere.',
    ],
  },
  {
    title: 'Governance',
    subtitle: 'Embedded policy layer',
    bullets: [
      'Codify approvals, thresholds, and guardrails inside workflows.',
      'Attach contracts, risks, and controls to operational steps.',
      'Make every action explainable, reviewable, and repeatable.',
    ],
  },
  {
    title: 'Operations',
    subtitle: 'From deal to day-two',
    bullets: [
      'Connect sales, deployment, cloud, and AI delivery.',
      'Standardise how environments, tenants, and workloads are stood up.',
      'Maintain an operating history that survives org and tool changes.',
    ],
  },
]

export function LandingPage() {
  return (
    <div className="relative overflow-hidden bg-hero-orbit">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.22),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(15,118,110,0.18),_transparent_55%)] opacity-70" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-24 px-6 pb-24 pt-16">
        {/* Hero */}
        <section className="grid gap-12 md:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] md:items-center">
          <div className="space-y-8">
            <div className="pill bg-black/40 ring-1 ring-white/10 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" />
              <span>Enterprise operating layer for CRM-native organisations</span>
            </div>
            <div className="space-y-5">
              <h1 className="max-w-xl text-balance text-4xl font-semibold tracking-tight text-ink-primary sm:text-5xl lg:text-6xl">
                CRM, redefined as your{' '}
                <span className="bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-emerald bg-clip-text text-transparent">
                  enterprise operating system
                </span>
                .
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-ink-muted">
                connect+ unifies Sales, Pre-Sales, SCM & Procurement, Deployment, Cloud, Data/AI, and Legal & Compliance
                into a single governed workflow platform. From first conversation to day-two operations, every step is
                designed, accountable, and auditable.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-indigo via-accent-violet to-accent-emerald px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-primary shadow-soft-lg shadow-accent-indigo/40 transition hover:brightness-110"
              >
                Get Started
              </Link>
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-surface-elevated/60 px-4 py-2 text-xs font-medium text-ink-muted/90 backdrop-blur transition hover:border-white/30 hover:text-ink-primary"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent-indigo/70" />
                View architecture
              </a>
            </div>
            <div className="flex flex-wrap gap-6 text-[10px] text-ink-muted/70">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                <span>Security-first, audit-ready workflows</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400/80" />
                <span>Designed for multi-year enterprise programs</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="elevated-panel relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent-indigo/40 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-24 h-64 w-64 rounded-full bg-accent-emerald/35 blur-3xl" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between text-[10px] text-ink-muted/80">
                  <span className="uppercase tracking-[0.22em]">Enterprise View</span>
                  <span>Workflow Graph · Live</span>
                </div>
                {/* Visual enrichment: Workflow graph */}
                <div className="rounded-2xl border border-white/5 bg-surface-muted/40 p-3">
                  <WorkflowGraphVisual />
                </div>
                <div className="grid gap-3 rounded-3xl border border-white/5 bg-surface-muted/60 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] font-medium text-ink-primary/90">Go-to-market to Cloud</p>
                      <p className="mt-1 text-[10px] text-ink-muted">
                        One governed lane from opportunity to deployed, monitored workload.
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-medium text-emerald-300">
                      In control
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div className="rounded-2xl bg-surface-elevated/80 p-2.5">
                      <p className="text-[10px] font-semibold text-ink-primary/90">Sales</p>
                      <p className="mt-1 text-[10px] text-ink-muted">Structured intake, solutioning, and sign-off.</p>
                    </div>
                    <div className="rounded-2xl bg-surface-elevated/80 p-2.5">
                      <p className="text-[10px] font-semibold text-ink-primary/90">SCM</p>
                      <p className="mt-1 text-[10px] text-ink-muted">Commercials and sourcing tied to the deal.</p>
                    </div>
                    <div className="rounded-2xl bg-surface-elevated/80 p-2.5">
                      <p className="text-[10px] font-semibold text-ink-primary/90">Cloud & AI</p>
                      <p className="mt-1 text-[10px] text-ink-muted">Environments, data, and models governed.</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-ink-muted/80">
                    <span>Every state, owner, and approval is recorded.</span>
                    <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] text-ink-primary/80">
                      Audit trail · Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="space-y-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="pill bg-transparent px-0 py-0 text-[10px] text-ink-muted">
                Why traditional CRMs break at enterprise scale
              </p>
              <h2 className="mt-3 text-xl font-semibold tracking-tight text-ink-primary sm:text-2xl">
                CRMs were built for records. Enterprises run on workflows.
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {problemPoints.map((item) => (
              <div
                key={item.title}
                className="group rounded-3xl border border-white/5 bg-surface-elevated/60 p-4 text-xs text-ink-muted/90 shadow-soft-inner transition hover:-translate-y-0.5 hover:border-accent-indigo/40 hover:bg-surface-elevated/90"
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-accent-indigo/40 to-accent-emerald/20 opacity-70 transition group-hover:opacity-100" />
                  <h3 className="text-[11px] font-semibold text-ink-primary/90">{item.title}</h3>
                </div>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vision & Philosophy */}
        <section id="vision" className="space-y-8">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-ink-primary sm:text-2xl">
              connect+ treats CRM as the execution backbone of the enterprise.
            </h2>
            <p className="text-sm leading-relaxed text-ink-muted">
              The next generation of enterprise CRM does not stop at the signed contract. It understands how work
              actually flows across teams, systems, and environments—and makes that flow governable. connect+ turns your
              CRM into the single place where intent, obligation, and execution stay in lockstep.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/5 bg-surface-elevated/70 p-4 text-sm text-ink-muted">
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                CRM as workflow engine
              </h3>
              <p>
                Model connected workflows that span sales, procurement, deployment, cloud, data, and legal. Every state
                is explicit, every owner is known, every dependency is visible.
              </p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-surface-elevated/70 p-4 text-sm text-ink-muted">
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                CRM as governance layer
              </h3>
              <p>
                Approvals, controls, and policies are encoded into the same workflows your teams already use—making
                compliance a natural outcome of how work is done, not a separate process.
              </p>
            </div>
            <div className="rounded-3xl border border-white/5 bg-surface-elevated/70 p-4 text-sm text-ink-muted">
              <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                CRM as execution backbone
              </h3>
              <p>
                From first opportunity to live workload, connect+ maintains a single, governed thread—so leadership sees
                not just bookings, but how resiliently the enterprise is operating.
              </p>
            </div>
          </div>
        </section>

        {/* Architecture Overview */}
        <section id="architecture" className="space-y-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-ink-primary sm:text-2xl">
                One platform. Many disciplines. A single governed graph.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-muted">
                connect+ connects specialist domains into a shared execution architecture—each module stays expert, while
                contributing to one enterprise view.
              </p>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.1fr)] md:items-start">
            <div className="elevated-panel relative overflow-hidden p-5">
              <div className="pointer-events-none absolute -top-10 left-16 h-40 w-40 rounded-full bg-accent-indigo/35 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-10 right-4 h-40 w-40 rounded-full bg-accent-emerald/30 blur-3xl" />
              <div className="relative space-y-4">
                <div className="flex items-center justify-between text-[10px] text-ink-muted/80">
                  <span className="uppercase tracking-[0.22em]">Architecture · Conceptual</span>
                  <span>Modules · Connected</span>
                </div>
                {/* Visual enrichment: Architecture diagram */}
                <div className="rounded-2xl border border-white/5 bg-surface-muted/40 p-3">
                  <ArchitectureDiagramVisual />
                </div>
                <div className="grid gap-3 rounded-3xl border border-white/5 bg-surface-muted/70 p-4">
                  <div className="grid grid-cols-3 gap-3 text-[11px]">
                    <div className="rounded-2xl border border-accent-indigo/40 bg-surface-elevated/80 p-3">
                      <p className="font-semibold text-ink-primary/90">Go-to-market</p>
                      <p className="mt-1 text-[10px] text-ink-muted">Sales & Pre-Sales</p>
                    </div>
                    <div className="rounded-2xl border border-accent-emerald/40 bg-surface-elevated/80 p-3">
                      <p className="font-semibold text-ink-primary/90">Supply</p>
                      <p className="mt-1 text-[10px] text-ink-muted">SCM / Procurement</p>
                    </div>
                    <div className="rounded-2xl border border-accent-violet/40 bg-surface-elevated/80 p-3">
                      <p className="font-semibold text-ink-primary/90">Assurance</p>
                      <p className="mt-1 text-[10px] text-ink-muted">Legal & Compliance</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-ink-muted">
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-accent-indigo/60 to-transparent" />
                    <span>Unified workflow bus</span>
                    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-accent-emerald/60 to-transparent" />
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-[11px]">
                    <div className="rounded-2xl border border-white/5 bg-surface-elevated/80 p-3">
                      <p className="font-semibold text-ink-primary/90">Deployment</p>
                      <p className="mt-1 text-[10px] text-ink-muted">Projects & cutovers</p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-surface-elevated/80 p-3">
                      <p className="font-semibold text-ink-primary/90">Cloud</p>
                      <p className="mt-1 text-[10px] text-ink-muted">Environments & changes</p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-surface-elevated/80 p-3">
                      <p className="font-semibold text-ink-primary/90">Data / AI</p>
                      <p className="mt-1 text-[10px] text-ink-muted">Models & products</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-ink-muted/80">
                    <span>Cross-domain SLAs, risk, and controls live in one graph.</span>
                    <span className="rounded-full border border-white/10 bg-black/25 px-2 py-1 text-[10px] text-ink-primary/80">
                      Single operating surface
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {modules.map((mod) => (
                <div
                  key={mod.name}
                  className="group rounded-3xl border border-white/5 bg-surface-elevated/70 p-4 text-xs text-ink-muted/90 transition hover:-translate-y-0.5 hover:border-accent-indigo/40 hover:bg-surface-elevated/95"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-[11px] font-semibold text-ink-primary/90">{mod.name}</h3>
                    <span className="h-6 w-6 rounded-full border border-white/10 bg-black/40 text-[10px] text-ink-muted/70 group-hover:border-accent-indigo/50">
                      <span className="flex h-full w-full items-center justify-center">●</span>
                    </span>
                  </div>
                  <p>{mod.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What connect+ Provides */}
        <section className="space-y-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-ink-primary sm:text-2xl">
                What connect+ provides out of the box.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-muted">
                A platform to design governed workflows, a governance layer to keep them safe, and an operational fabric
                that keeps them running at enterprise scale.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-3xl border border-white/5 bg-surface-elevated/70 p-4 text-sm text-ink-muted transition hover:-translate-y-0.5 hover:border-accent-emerald/40 hover:bg-surface-elevated/95"
              >
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  {pillar.title}
                </h3>
                <p className="mt-1 text-xs font-medium text-ink-primary/90">{pillar.subtitle}</p>
                <ul className="mt-3 space-y-2 text-xs">
                  {pillar.bullets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[6px] h-1 w-1 rounded-full bg-accent-emerald" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Enterprise Trust & Scale */}
        <section id="trust" className="space-y-8">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-ink-primary sm:text-2xl">
                Built for enterprise trust, longevity, and scale.
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-ink-muted">
                connect+ is designed for organisations that carry regulated workloads, complex commercial structures, and
                multi-year transformation programs.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
            <div className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-900/40 via-surface-elevated to-surface-elevated/90 p-5 text-sm text-ink-muted">
              <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-200">
                Security-first
              </h3>
              {/* Visual enrichment: Enterprise structure */}
              <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-surface-muted/30 p-3">
                <EnterpriseStructureVisual />
              </div>
              <ul className="space-y-2 text-xs">
                <li>Role-based execution paths with principle-of-least-privilege by design.</li>
                <li>Explicit separation of duties between requestors, approvers, and operators.</li>
                <li>Versioned configuration for workflows, approvals, and policies.</li>
                <li>Immutable event history for every material change in state.</li>
              </ul>
            </div>
            <div className="space-y-4 text-sm text-ink-muted">
              <div className="rounded-3xl border border-white/5 bg-surface-elevated/80 p-4">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  Scalable by design
                </h3>
                {/* Visual enrichment: Metrics telemetry */}
                <div className="mb-3 rounded-2xl border border-white/5 bg-surface-muted/40 p-3">
                  <MetricsTelemetryVisual />
                </div>
                <p className="text-xs">
                  Multi-entity, multi-region, and multi-line-of-business structures are first-class concepts—so your
                  operating model can evolve without rebuilding your CRM foundations.
                </p>
              </div>
              <div className="rounded-3xl border border-white/5 bg-surface-elevated/80 p-4">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  Audit-ready workflows
                </h3>
                <p className="text-xs">
                  Every approval, override, and exception is captured with context—making internal and external reviews a
                  matter of inspecting the system, not hunting for evidence.
                </p>
              </div>
              <div className="rounded-3xl border border-white/5 bg-surface-elevated/80 p-4">
                <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                  Built for long-term operations
                </h3>
                <p className="text-xs">
                  connect+ is architected for the decade-scale programs that define modern enterprises—stable,
                  governable, and resilient to organisational and tooling change.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-white/5 pt-10">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gradient-to-r from-surface-elevated via-surface-muted to-surface-elevated p-5 shadow-soft-lg shadow-black/50 md:flex-row md:items-center">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold tracking-tight text-ink-primary sm:text-xl">
                Start with connect+ and make your CRM the backbone of how work gets done.
              </h2>
              <p className="max-w-xl text-xs text-ink-muted">
                Design governed workflows, connect specialist teams, and operate critical workloads from a single,
                accountable platform.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/login"
                className="rounded-full bg-gradient-to-r from-accent-indigo to-accent-violet px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-primary shadow-soft-lg shadow-accent-indigo/40"
              >
                Start with connect+
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-white/15 bg-surface-elevated/70 px-4 py-2 text-xs font-medium text-ink-muted/90 backdrop-blur transition hover:border-white/30 hover:text-ink-primary"
              >
                Create an enterprise workspace
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

