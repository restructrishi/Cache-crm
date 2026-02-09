// Visual enrichment components for Landing Page ONLY

export function WorkflowGraphVisual() {
  return (
    <div className="relative h-32 w-full">
      <svg viewBox="0 0 400 120" className="h-full w-full">
        <defs>
          <linearGradient id="workflowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Connection path */}
        <path
          d="M 40 60 Q 120 30, 200 60 Q 280 90, 360 60"
          stroke="url(#workflowGrad)"
          strokeWidth="2.5"
          fill="none"
          opacity="0.7"
        />
        {/* Nodes */}
        <circle cx="40" cy="60" r="6" fill="#6366f1" opacity="0.8" />
        <circle cx="200" cy="60" r="8" fill="#6366f1" opacity="0.9">
          <animate attributeName="r" values="8;10;8" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;1;0.9" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="360" cy="60" r="6" fill="#10b981" opacity="0.8" />
        {/* Labels */}
        <text x="40" y="80" textAnchor="middle" className="fill-ink-primary text-[8px] font-medium dark:fill-ink-primary lg:fill-slate-800">
          Sales
        </text>
        <text x="200" y="80" textAnchor="middle" className="fill-ink-primary text-[8px] font-medium dark:fill-ink-primary lg:fill-slate-800">
          connect+
        </text>
        <text x="360" y="80" textAnchor="middle" className="fill-ink-primary text-[8px] font-medium dark:fill-ink-primary lg:fill-slate-800">
          Cloud
        </text>
      </svg>
    </div>
  )
}

export function ArchitectureDiagramVisual() {
  return (
    <div className="relative h-40 w-full">
      <svg viewBox="0 0 500 160" className="h-full w-full">
        <defs>
          <linearGradient id="archGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="archGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {/* Top layer modules */}
        <rect x="50" y="20" width="100" height="35" rx="6" fill="url(#archGrad1)" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
        <rect x="200" y="20" width="100" height="35" rx="6" fill="url(#archGrad2)" stroke="#10b981" strokeWidth="1.5" opacity="0.7" />
        <rect x="350" y="20" width="100" height="35" rx="6" fill="url(#archGrad1)" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.7" />
        {/* Central bus */}
        <rect x="50" y="80" width="400" height="30" rx="15" fill="url(#archGrad1)" stroke="#6366f1" strokeWidth="2" opacity="0.5" />
        {/* Bottom layer modules */}
        <rect x="50" y="130" width="100" height="35" rx="6" fill="url(#archGrad1)" stroke="#6366f1" strokeWidth="1.5" opacity="0.7" />
        <rect x="200" y="130" width="100" height="35" rx="6" fill="url(#archGrad2)" stroke="#10b981" strokeWidth="1.5" opacity="0.7" />
        <rect x="350" y="130" width="100" height="35" rx="6" fill="url(#archGrad1)" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.7" />
        {/* Connection lines */}
        <line x1="100" y1="55" x2="100" y2="80" stroke="#6366f1" strokeWidth="1.5" opacity="0.4" />
        <line x1="250" y1="55" x2="250" y2="80" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
        <line x1="400" y1="55" x2="400" y2="80" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.4" />
        <line x1="100" y1="110" x2="100" y2="130" stroke="#6366f1" strokeWidth="1.5" opacity="0.4" />
        <line x1="250" y1="110" x2="250" y2="130" stroke="#10b981" strokeWidth="1.5" opacity="0.4" />
        <line x1="400" y1="110" x2="400" y2="130" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.4" />
      </svg>
    </div>
  )
}

export function MetricsTelemetryVisual() {
  const metrics = [
    { label: 'Workflow Adherence', value: 98, color: '#10b981' },
    { label: 'SLA Performance', value: 95, color: '#6366f1' },
    { label: 'Control Utilisation', value: 92, color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-3">
      {metrics.map((metric, idx) => (
        <div key={idx} className="space-y-1.5">
          <div className="flex items-center justify-between text-[9px]">
            <span className="font-medium text-ink-primary/90 dark:text-ink-primary/90 lg:text-slate-800">
              {metric.label}
            </span>
            <span className="font-semibold" style={{ color: metric.color }}>
              {metric.value}%
            </span>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-surface-muted/60 dark:bg-surface-muted/60 lg:bg-slate-200/60">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${metric.value}%`,
                background: `linear-gradient(90deg, ${metric.color}80, ${metric.color})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export function EnterpriseStructureVisual() {
  return (
    <div className="relative h-28 w-full">
      <svg viewBox="0 0 300 100" className="h-full w-full">
        <defs>
          <linearGradient id="structGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        {/* Foundation layer */}
        <rect x="30" y="70" width="240" height="20" rx="4" fill="url(#structGrad)" stroke="#6366f1" strokeWidth="1.5" opacity="0.6" />
        {/* Governance layer */}
        <rect x="60" y="45" width="180" height="18" rx="4" fill="url(#structGrad)" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.7" />
        {/* Execution layer */}
        <rect x="90" y="25" width="120" height="16" rx="4" fill="url(#structGrad)" stroke="#10b981" strokeWidth="1.5" opacity="0.8" />
        {/* Connecting lines */}
        <line x1="150" y1="25" x2="150" y2="45" stroke="#10b981" strokeWidth="1.5" opacity="0.5" />
        <line x1="150" y1="45" x2="150" y2="70" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.5" />
        {/* Central indicator */}
        <circle cx="150" cy="33" r="3" fill="#10b981" opacity="0.8">
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  )
}
