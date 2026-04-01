'use client'

const dataSources = [
  {
    name: 'Claude AI Engine',
    status: 'active',
    icon: '🤖',
    desc: 'NLP analysis, categorisation, and impact scoring',
    color: 'border-green-500/30 bg-green-500/5',
    dot: 'bg-green-400',
  },
  {
    name: 'ERP System',
    status: 'active',
    icon: '🏢',
    desc: 'Financial data, operational metrics, resource allocation',
    color: 'border-green-500/30 bg-green-500/5',
    dot: 'bg-green-400',
  },
  {
    name: 'Knowledge Bank',
    status: 'active',
    icon: '📚',
    desc: 'Org policies, strategy docs, past innovation outcomes',
    color: 'border-green-500/30 bg-green-500/5',
    dot: 'bg-green-400',
  },
  {
    name: 'CRM & Sales Data',
    status: 'active',
    icon: '📊',
    desc: 'Customer feedback, deal pipeline, market intelligence',
    color: 'border-green-500/30 bg-green-500/5',
    dot: 'bg-green-400',
  },
  {
    name: 'HR & People Data',
    status: 'active',
    icon: '👥',
    desc: 'Team capacity, skill gaps, department priorities',
    color: 'border-green-500/30 bg-green-500/5',
    dot: 'bg-green-400',
  },
  {
    name: 'Industry Benchmarks',
    status: 'synced',
    icon: '🌐',
    desc: 'Sector trends, competitor analysis, market sizing',
    color: 'border-blue-500/30 bg-blue-500/5',
    dot: 'bg-blue-400',
  },
]

export function DataSourcesBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-card border border-dark-border text-xs text-gray-400">
      <span className="text-[10px]">Powered by</span>
      {['🤖', '🏢', '📚', '📊', '👥', '🌐'].map((icon, i) => (
        <span key={i} className="text-sm" title={dataSources[i].name}>{icon}</span>
      ))}
      <span className="text-[10px] text-gold ml-1">6 sources</span>
    </div>
  )
}

export function DataSourcesPanel() {
  return (
    <div className="p-4 rounded-xl bg-black border border-dark-border">
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Analysis Data Sources</p>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">All Connected</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {dataSources.map((src) => (
          <div key={src.name} className={`p-2.5 rounded-lg border ${src.color} flex items-start gap-2`}>
            <span className="text-base shrink-0">{src.icon}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-medium text-white truncate">{src.name}</p>
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${src.dot}`} />
              </div>
              <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{src.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
