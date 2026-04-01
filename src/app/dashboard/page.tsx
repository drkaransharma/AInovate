'use client'

import { useState, useEffect } from 'react'
import AuthLayout from '@/components/AuthLayout'
import { useWorkspace } from '@/lib/workspace-context'

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

function DashboardContent() {
  const { workspaceId } = useWorkspace()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)
  const [department, setDepartment] = useState('')
  const [priority, setPriority] = useState('')
  const [category, setCategory] = useState('')

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
    } catch {
      setIdeas([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (workspaceId) fetchIdeas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department, priority, category, workspaceId])

  const stats = {
    total: ideas.length,
    avgScore: ideas.length ? Math.round(ideas.reduce((sum, i) => sum + (i.impact_score || 0), 0) / ideas.length) : 0,
    critical: ideas.filter((i) => i.priority === 'Critical').length,
    high: ideas.filter((i) => i.priority === 'High').length,
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-3">Idea Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Browse and filter all submitted ideas with AI-generated insights.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Ideas', value: stats.total, color: 'text-gold' },
            { label: 'Avg Impact Score', value: stats.avgScore, color: 'text-gold' },
            { label: 'Critical Priority', value: stats.critical, color: 'text-red-400' },
            { label: 'High Priority', value: stats.high, color: 'text-orange-400' },
          ].map((stat) => (
            <div key={stat.label} className="p-5 rounded-2xl bg-dark-card border border-dark-border">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className={`text-3xl font-serif font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 p-4 rounded-2xl bg-dark-card border border-dark-border">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-4 py-2 bg-black border border-dark-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-gold/50"
          >
            <option value="">All Departments</option>
            {departments.filter(Boolean).map((d) => (
              <option key={d} value={d} className="bg-black">{d}</option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-2 bg-black border border-dark-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-gold/50"
          >
            <option value="">All Priorities</option>
            {priorities.filter(Boolean).map((p) => (
              <option key={p} value={p} className="bg-black">{p}</option>
            ))}
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 bg-black border border-dark-border rounded-lg text-sm text-gray-300 focus:outline-none focus:border-gold/50"
          >
            <option value="">All Categories</option>
            {categories.filter(Boolean).map((c) => (
              <option key={c} value={c} className="bg-black">{c}</option>
            ))}
          </select>

          {(department || priority || category) && (
            <button
              onClick={() => { setDepartment(''); setPriority(''); setCategory('') }}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Ideas List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-dark-card border border-dark-border animate-pulse">
                <div className="h-5 bg-dark-border rounded w-1/3 mb-3" />
                <div className="h-4 bg-dark-border rounded w-2/3 mb-2" />
                <div className="h-4 bg-dark-border rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : ideas.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border border-dashed border-dark-border">
            <div className="w-16 h-16 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-serif font-bold text-gray-400 mb-1">No ideas yet</h3>
            <p className="text-gray-600">Submit your first idea in the AI Idea Engine</p>
          </div>
        ) : (
          <div className="space-y-4">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="p-6 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/20 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-serif font-bold text-lg group-hover:text-gold transition-colors truncate">
                        {idea.title}
                      </h3>
                      <span className={`shrink-0 inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium border ${priorityColor[idea.priority] || 'text-gray-400 border-dark-border'}`}>
                        {idea.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">{idea.ai_summary || idea.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                      <span className="px-2 py-1 rounded-md bg-gold/10 text-gold border border-gold/20">
                        {idea.category}
                      </span>
                      <span>{idea.department}</span>
                      <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Impact Score */}
                  <div className="shrink-0 flex flex-col items-center p-3 rounded-xl bg-black border border-dark-border min-w-[80px]">
                    <span className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Impact</span>
                    <span className="text-2xl font-serif font-bold text-gold">{idea.impact_score}</span>
                    <div className="w-full h-1 bg-dark-border rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gold rounded-full"
                        style={{ width: `${idea.impact_score}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
