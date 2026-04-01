'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import { useWorkspace } from '@/lib/workspace-context'

interface Idea {
  id: string
  title: string
  department: string
  category: string
  priority: string
  impact_score: number
  ai_summary: string
  created_at: string
}

function DashboardContent() {
  const { workspaceId } = useWorkspace()
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (workspaceId) fetchIdeas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId])

  const fetchIdeas = async () => {
    try {
      const res = await fetch(`/api/ideas?workspace_id=${workspaceId}`)
      const data = await res.json()
      setIdeas(Array.isArray(data) ? data : [])
    } catch { setIdeas([]) } finally { setLoading(false) }
  }

  const stats = {
    total: ideas.length,
    avgScore: ideas.length ? Math.round(ideas.reduce((s, i) => s + (i.impact_score || 0), 0) / ideas.length) : 0,
    critical: ideas.filter(i => i.priority === 'Critical').length,
    high: ideas.filter(i => i.priority === 'High').length,
    above75: ideas.filter(i => i.impact_score >= 75).length,
    thisMonth: ideas.filter(i => new Date(i.created_at) > new Date(Date.now() - 30 * 86400000)).length,
  }

  // Category breakdown
  const categoryCount: Record<string, number> = {}
  ideas.forEach(i => { categoryCount[i.category] = (categoryCount[i.category] || 0) + 1 })
  const topCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Department breakdown
  const deptCount: Record<string, number> = {}
  ideas.forEach(i => { deptCount[i.department] = (deptCount[i.department] || 0) + 1 })
  const topDepts = Object.entries(deptCount).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Top ideas by score
  const topIdeas = [...ideas].sort((a, b) => b.impact_score - a.impact_score).slice(0, 5)

  // Pipeline stats (static demo)
  const pipelineStats = {
    business_case: 2,
    leadership_review: 2,
    approved: 1,
    in_development: 2,
    roi_tracking: 2,
    total_investment: 'AED 2.5M',
    avg_roi: '278%',
  }

  // Academy stats (static demo)
  const academyStats = {
    courses: 6,
    enrolled: 272,
    completed: 172,
    avg_score: 86,
    active_learners: 5,
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 rounded-2xl bg-dark-card border border-dark-border animate-pulse" />
          ))}
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400">Organisation-wide innovation metrics at a glance. Click any section to dive deeper.</p>
      </div>

      {/* ═══ IDEA & INSIGHT METRICS ═══ */}
      <Link href="/idea-engine" className="block group mb-6">
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">💡</span>
              <h2 className="text-base font-serif font-bold group-hover:text-gold transition-colors">Idea & Insight</h2>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gold transition-colors">View all →</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: 'Total Ideas', value: stats.total, color: 'text-gold' },
              { label: 'This Month', value: stats.thisMonth, color: 'text-blue-400' },
              { label: 'Avg Score', value: stats.avgScore, color: 'text-gold' },
              { label: 'Above 75', value: stats.above75, color: 'text-green-400' },
              { label: 'Critical', value: stats.critical, color: 'text-red-400' },
              { label: 'High', value: stats.high, color: 'text-orange-400' },
            ].map(kpi => (
              <div key={kpi.label} className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                <p className={`text-xl font-serif font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Link>

      {/* Two column: Top Ideas + Category/Dept breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Ideas */}
        <Link href="/idea-engine" className="block group">
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-serif font-bold group-hover:text-gold transition-colors">Top Scoring Ideas</h3>
              <span className="text-[10px] text-gray-500">by impact score</span>
            </div>
            <div className="space-y-2">
              {topIdeas.map((idea, i) => (
                <div key={idea.id} className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-dark-border">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-sm font-bold text-gold w-5">{i + 1}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">{idea.title}</p>
                      <p className="text-[10px] text-gray-500">{idea.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${idea.priority === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' : idea.priority === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-gold/20 text-gold border-gold/30'}`}>{idea.priority}</span>
                    <span className="text-sm font-serif font-bold text-gold">{idea.impact_score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* Category + Department */}
        <div className="grid grid-rows-2 gap-6">
          <Link href="/idea-engine" className="block group">
            <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all">
              <h3 className="text-sm font-serif font-bold mb-3 group-hover:text-gold transition-colors">Ideas by Category</h3>
              <div className="space-y-2">
                {topCategories.map(([cat, count]) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{cat}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-dark-border rounded-full overflow-hidden">
                        <div className="h-full bg-gold rounded-full" style={{ width: `${(count / stats.total) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-gold w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>

          <Link href="/idea-engine" className="block group">
            <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all">
              <h3 className="text-sm font-serif font-bold mb-3 group-hover:text-gold transition-colors">Ideas by Department</h3>
              <div className="space-y-2">
                {topDepts.map(([dept, count]) => (
                  <div key={dept} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{dept}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-dark-border rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(count / stats.total) * 100}%` }} />
                      </div>
                      <span className="text-xs font-bold text-blue-400 w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ═══ PIPELINE METRICS ═══ */}
      <Link href="/pipeline" className="block group mb-6">
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🚀</span>
              <h2 className="text-base font-serif font-bold group-hover:text-gold transition-colors">Innovation Pipeline</h2>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gold transition-colors">View pipeline →</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
            {[
              { label: 'Business Case', value: pipelineStats.business_case, color: 'text-gold' },
              { label: 'Leadership', value: pipelineStats.leadership_review, color: 'text-orange-400' },
              { label: 'Approved', value: pipelineStats.approved, color: 'text-green-400' },
              { label: 'In Dev', value: pipelineStats.in_development, color: 'text-cyan-400' },
              { label: 'ROI Tracking', value: pipelineStats.roi_tracking, color: 'text-emerald-400' },
              { label: 'Investment', value: pipelineStats.total_investment, color: 'text-gold' },
              { label: 'Avg ROI', value: pipelineStats.avg_roi, color: 'text-green-400' },
            ].map(kpi => (
              <div key={kpi.label} className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                <p className={`text-lg font-serif font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Link>

      {/* ═══ AI ACADEMY METRICS ═══ */}
      <Link href="/co-facilitator" className="block group mb-6">
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎓</span>
              <h2 className="text-base font-serif font-bold group-hover:text-gold transition-colors">AI Academy</h2>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gold transition-colors">View academy →</span>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: 'Courses', value: academyStats.courses, color: 'text-gold' },
              { label: 'Enrolled', value: academyStats.enrolled, color: 'text-blue-400' },
              { label: 'Completed', value: academyStats.completed, color: 'text-green-400' },
              { label: 'Avg Score', value: `${academyStats.avg_score}%`, color: 'text-gold' },
              { label: 'Active Learners', value: academyStats.active_learners, color: 'text-purple-400' },
            ].map(kpi => (
              <div key={kpi.label} className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                <p className={`text-lg font-serif font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>
        </div>
      </Link>

      {/* ═══ DATA SOURCES STATUS ═══ */}
      <Link href="/settings" className="block group">
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚙️</span>
              <h2 className="text-base font-serif font-bold group-hover:text-gold transition-colors">Data Sources & Configuration</h2>
            </div>
            <span className="text-xs text-gray-500 group-hover:text-gold transition-colors">Manage →</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: '🤖', name: 'Claude AI', status: 'Connected' },
              { icon: '🏢', name: 'ERP System', status: 'Connected' },
              { icon: '📚', name: 'Knowledge Bank', status: 'Connected' },
              { icon: '📊', name: 'CRM & Sales', status: 'Connected' },
              { icon: '👥', name: 'HR & People', status: 'Connected' },
              { icon: '🌐', name: 'Benchmarks', status: 'Synced' },
            ].map(src => (
              <div key={src.name} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black border border-dark-border">
                <span>{src.icon}</span>
                <span className="text-xs text-white">{src.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              </div>
            ))}
          </div>
        </div>
      </Link>
    </main>
  )
}

export default function DashboardPage() {
  return (
    <AuthLayout>
      <DashboardContent />
    </AuthLayout>
  )
}
