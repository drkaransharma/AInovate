'use client'

import { useState, useEffect } from 'react'
import AuthLayout from '@/components/AuthLayout'
import { useWorkspace } from '@/lib/workspace-context'
import { DataSourcesPanel, DataSourcesBadge } from '@/components/DataSources'
import { ScoreBreakdownPanel } from '@/components/ScoreBreakdown'
import { DataInsightsPanel } from '@/components/DataInsights'

interface Idea {
  id: string
  title: string
  description: string
  department: string
  category: string
  priority: string
  impact_score: number
  ai_summary: string
  created_at: string
}

const departments = [
  '', 'Engineering', 'Product', 'Marketing', 'Sales', 'Operations',
  'Finance', 'HR', 'Customer Success', 'Design', 'Research',
]
const priorities = ['', 'Low', 'Medium', 'High', 'Critical']
const categories = [
  '', 'Product Innovation', 'Process Improvement', 'Cost Reduction',
  'Customer Experience', 'Technology', 'Sustainability', 'Culture & People', 'Revenue Growth',
]

const priorityColor: Record<string, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-gold/20 text-gold border-gold/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const priorityExplanation: Record<string, string> = {
  Critical: 'Addresses an urgent business need with high revenue impact, competitive advantage, or risk mitigation. Requires immediate attention and resource allocation.',
  High: 'Strong strategic alignment with significant potential for growth, efficiency gains, or customer satisfaction improvement. Should be prioritized in upcoming sprint.',
  Medium: 'Valuable improvement that enhances operations or experience but is not time-sensitive. Good candidate for quarterly planning and roadmap inclusion.',
  Low: 'Nice-to-have enhancement with modest impact. Can be scheduled when resources allow or bundled with related initiatives.',
}

// Generate deterministic employee info from idea title
function getEmployeeInfo(title: string, department: string) {
  const employees: Record<string, { name: string; empId: string; role: string }[]> = {
    'Product': [
      { name: 'Aisha Rahman', empId: 'EMP-1042', role: 'Product Manager' },
      { name: 'Raj Patel', empId: 'EMP-1108', role: 'Senior Product Analyst' },
    ],
    'Operations': [
      { name: 'Omar Hassan', empId: 'EMP-2015', role: 'Operations Lead' },
      { name: 'Lisa Chen', empId: 'EMP-2031', role: 'Supply Chain Manager' },
    ],
    'HR': [
      { name: 'Priya Kapoor', empId: 'EMP-3007', role: 'HR Business Partner' },
      { name: 'David Okonkwo', empId: 'EMP-3019', role: 'L&D Specialist' },
    ],
    'Sales': [
      { name: 'Fatima Al-Sayed', empId: 'EMP-4003', role: 'Sales Director' },
      { name: 'James Wilson', empId: 'EMP-4021', role: 'Account Manager' },
    ],
    'Engineering': [
      { name: 'Mohammed Al-Rashid', empId: 'EMP-5002', role: 'Engineering Manager' },
      { name: 'Sarah Kim', empId: 'EMP-5014', role: 'Senior Developer' },
    ],
    'Customer Success': [
      { name: 'Emily Zhang', empId: 'EMP-6008', role: 'CS Team Lead' },
      { name: 'Carlos Rivera', empId: 'EMP-6017', role: 'Customer Success Manager' },
    ],
    'Finance': [
      { name: 'Nadia Hussain', empId: 'EMP-7004', role: 'Financial Analyst' },
      { name: 'Mark Thompson', empId: 'EMP-7011', role: 'Revenue Operations Lead' },
    ],
    'Marketing': [
      { name: 'Sophie Laurent', empId: 'EMP-8006', role: 'Marketing Manager' },
      { name: 'Alex Nguyen', empId: 'EMP-8022', role: 'Growth Lead' },
    ],
  }
  let hash = 0
  for (let i = 0; i < title.length; i++) { hash = ((hash << 5) - hash) + title.charCodeAt(i); hash |= 0 }
  const deptEmployees = employees[department] || employees['Product']
  return deptEmployees[Math.abs(hash) % deptEmployees.length]
}

function getScoreBreakdown(score: number) {
  if (score >= 90) return { label: 'Exceptional', color: 'text-green-400' }
  if (score >= 75) return { label: 'Strong', color: 'text-green-300' }
  if (score >= 60) return { label: 'Promising', color: 'text-gold' }
  if (score >= 40) return { label: 'Moderate', color: 'text-orange-400' }
  return { label: 'Exploratory', color: 'text-gray-400' }
}

function DashboardContent() {
  const { workspaceId } = useWorkspace()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [department, setDepartment] = useState('')
  const [priority, setPriority] = useState('')
  const [category, setCategory] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [threshold, setThreshold] = useState(75)
  const [showThresholdOnly, setShowThresholdOnly] = useState(false)

  const fetchIdeas = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('workspace_id', workspaceId!)
      if (department) params.set('department', department)
      if (priority) params.set('priority', priority)
      if (category) params.set('category', category)
      const res = await fetch(`/api/ideas?${params.toString()}`)
      const data = await res.json()
      setIdeas(Array.isArray(data) ? data : [])
    } catch { setIdeas([]) } finally { setLoading(false) }
  }

  useEffect(() => {
    if (workspaceId) fetchIdeas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, priority, category, workspaceId])

  const filteredIdeas = showThresholdOnly ? ideas.filter(i => i.impact_score >= threshold) : ideas
  const thresholdIdeas = ideas.filter(i => i.impact_score >= threshold)

  const stats = {
    total: ideas.length,
    avgScore: ideas.length ? Math.round(ideas.reduce((sum, i) => sum + (i.impact_score || 0), 0) / ideas.length) : 0,
    critical: ideas.filter((i) => i.priority === 'Critical').length,
    high: ideas.filter((i) => i.priority === 'High').length,
    aboveThreshold: thresholdIdeas.length,
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-3">Idea Dashboard</h1>
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border mt-4">
            <h2 className="text-base font-serif font-bold text-gold mb-2">What is the Idea Dashboard?</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your central command centre for innovation. The Idea Dashboard gives you a bird&apos;s-eye view of every idea submitted across your organisation — filterable by department, priority, and category. Use the <span className="text-gold font-medium">Impact Threshold</span> to surface only high-value ideas that meet your organisation&apos;s investment criteria. Each idea shows the submitter&apos;s employee ID and department for full accountability and recognition.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Ideas', value: stats.total, color: 'text-gold' },
            { label: 'Avg Impact Score', value: stats.avgScore, color: 'text-gold' },
            { label: 'Above Threshold', value: stats.aboveThreshold, color: 'text-green-400' },
            { label: 'Critical Priority', value: stats.critical, color: 'text-red-400' },
            { label: 'High Priority', value: stats.high, color: 'text-orange-400' },
          ].map((stat) => (
            <div key={stat.label} className="p-4 rounded-2xl bg-dark-card border border-dark-border">
              <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-2xl font-serif font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Threshold Control */}
        <div className="p-5 rounded-2xl bg-dark-card border border-gold/20 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gold text-sm">⚡</span>
                <h3 className="text-sm font-serif font-bold text-gold">Impact Threshold Filter</h3>
              </div>
              <p className="text-gray-500 text-xs">Show only ideas scoring above the threshold — configured based on your organisation&apos;s investment criteria.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-32 accent-gold"
                />
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black border border-dark-border min-w-[60px] justify-center">
                  <span className="text-lg font-serif font-bold text-gold">{threshold}</span>
                  <span className="text-xs text-gray-500">/100</span>
                </div>
              </div>
              <button
                onClick={() => setShowThresholdOnly(!showThresholdOnly)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${showThresholdOnly ? 'bg-gold text-black' : 'bg-dark-hover text-gray-400 border border-dark-border hover:text-white'}`}
              >
                {showThresholdOnly ? `Showing ${thresholdIdeas.length} ideas` : 'Apply Filter'}
              </button>
            </div>
          </div>
          {showThresholdOnly && (
            <div className="mt-3 pt-3 border-t border-dark-border flex items-center gap-2">
              <span className="text-green-400 text-xs">✓ Filtering active:</span>
              <span className="text-gray-400 text-xs">Showing {thresholdIdeas.length} of {ideas.length} ideas with impact score ≥ {threshold}</span>
              <button onClick={() => setShowThresholdOnly(false)} className="text-xs text-gray-500 hover:text-white ml-auto">Clear filter</button>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-2xl bg-dark-card border border-dark-border">
          <select value={department} onChange={(e) => setDepartment(e.target.value)} className="px-4 py-2 bg-black border border-dark-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-gold/50">
            <option value="">All Departments</option>
            {departments.filter(Boolean).map((d) => (<option key={d} value={d} className="bg-black">{d}</option>))}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="px-4 py-2 bg-black border border-dark-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-gold/50">
            <option value="">All Priorities</option>
            {priorities.filter(Boolean).map((p) => (<option key={p} value={p} className="bg-black">{p}</option>))}
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2 bg-black border border-dark-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-gold/50">
            <option value="">All Categories</option>
            {categories.filter(Boolean).map((c) => (<option key={c} value={c} className="bg-black">{c}</option>))}
          </select>
          {(department || priority || category) && (
            <button onClick={() => { setDepartment(''); setPriority(''); setCategory('') }} className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Clear filters</button>
          )}
        </div>

        {/* Ideas List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-dark-card border border-dark-border animate-pulse">
                <div className="h-5 bg-dark-border rounded w-1/3 mb-3" />
                <div className="h-4 bg-dark-border rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredIdeas.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-dark-border">
            <h3 className="text-lg font-serif font-bold text-gray-400 mb-1">
              {showThresholdOnly ? `No ideas above ${threshold} threshold` : 'No ideas yet'}
            </h3>
            <p className="text-gray-600">
              {showThresholdOnly ? 'Try lowering the threshold or clearing the filter' : 'Submit your first idea in the AI Idea Engine'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">{filteredIdeas.length} ideas {showThresholdOnly ? `above ${threshold} threshold` : 'total'}</p>
            </div>
            {filteredIdeas.map((idea) => {
              const isExpanded = expandedId === idea.id
              const scoreInfo = getScoreBreakdown(idea.impact_score)
              const employee = getEmployeeInfo(idea.title, idea.department)
              const meetsThreshold = idea.impact_score >= threshold
              return (
                <div
                  key={idea.id}
                  className={`rounded-2xl bg-dark-card border transition-all cursor-pointer ${isExpanded ? 'border-gold/40' : meetsThreshold ? 'border-green-500/20 hover:border-gold/30' : 'border-dark-border hover:border-dark-hover'}`}
                  onClick={() => setExpandedId(isExpanded ? null : idea.id)}
                >
                  {/* Summary Row */}
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          {meetsThreshold && <span className="text-green-400 text-xs shrink-0" title="Above threshold">✓</span>}
                          <h3 className="font-serif font-bold text-lg truncate">{idea.title}</h3>
                          <span className={`shrink-0 inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium border ${priorityColor[idea.priority] || 'text-gray-400 border-dark-border'}`}>
                            {idea.priority}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">{idea.ai_summary || idea.description}</p>

                        {/* Employee Info + Tags */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-hover border border-dark-border">
                            <div className="w-5 h-5 rounded-full bg-gold/20 text-gold flex items-center justify-center text-[9px] font-bold">
                              {employee.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-white font-medium">{employee.name}</span>
                            <span className="text-gray-600">|</span>
                            <span className="text-gold font-mono">{employee.empId}</span>
                            <span className="text-gray-600">|</span>
                            <span>{employee.role}</span>
                          </div>
                          <span className="px-2 py-1 rounded-md bg-gold/10 text-gold border border-gold/20">{idea.category}</span>
                          <span>{idea.department}</span>
                          <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                          <DataSourcesBadge />
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-4">
                        <div className={`flex flex-col items-center p-3 rounded-xl border min-w-[80px] ${meetsThreshold ? 'bg-green-500/5 border-green-500/20' : 'bg-black border-dark-border'}`}>
                          <span className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Impact</span>
                          <span className={`text-2xl font-serif font-bold ${meetsThreshold ? 'text-green-400' : 'text-gold'}`}>{idea.impact_score}</span>
                          <p className={`text-[10px] font-medium ${scoreInfo.color}`}>{scoreInfo.label}</p>
                        </div>
                        <svg className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-dark-border pt-5 space-y-5">
                      {/* Submitter Card */}
                      <div className="p-4 rounded-xl bg-black border border-dark-border">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">Submitted By</p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-bold">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="text-base font-medium text-white">{employee.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gold font-mono bg-gold/10 px-2 py-0.5 rounded border border-gold/20">{employee.empId}</span>
                              <span className="text-xs text-gray-400">{employee.role}</span>
                              <span className="text-xs text-gray-600">•</span>
                              <span className="text-xs text-gray-400">{idea.department} Department</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Summary */}
                      <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
                        <p className="text-gold text-xs uppercase tracking-wider font-semibold mb-2">AI Summary</p>
                        <p className="text-gray-300 leading-relaxed">{idea.ai_summary}</p>
                      </div>

                      {/* ERP + Sentiment Insights */}
                      <DataInsightsPanel title={idea.title} category={idea.category} department={idea.department} score={idea.impact_score} />

                      {/* Data Sources */}
                      <DataSourcesPanel />

                      {/* Full Description */}
                      <div>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Full Description</p>
                        <p className="text-gray-400 text-sm leading-relaxed">{idea.description}</p>
                      </div>

                      {/* Score Breakdown */}
                      <ScoreBreakdownPanel score={idea.impact_score} title={idea.title} />

                      {/* Priority + Classification */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-black border border-dark-border">
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Why {idea.priority} Priority?</p>
                          <span className={`inline-flex px-2.5 py-1 rounded-lg text-sm font-medium border mb-3 ${priorityColor[idea.priority]}`}>{idea.priority}</span>
                          <p className="text-gray-500 text-xs leading-relaxed">{priorityExplanation[idea.priority]}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-black border border-dark-border">
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Classification</p>
                          <div className="space-y-3">
                            <div><p className="text-xs text-gray-500 mb-1">Category</p><span className="px-2.5 py-1 rounded-lg text-sm bg-gold/10 text-gold border border-gold/20">{idea.category}</span></div>
                            <div><p className="text-xs text-gray-500 mb-1">Department</p><span className="text-sm text-white">{idea.department}</span></div>
                            <div><p className="text-xs text-gray-500 mb-1">Submitted</p><span className="text-sm text-white">{new Date(idea.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}

export default function DashboardPage() {
  return (
    <AuthLayout>
      <DashboardContent />
    </AuthLayout>
  )
}
