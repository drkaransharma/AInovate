'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import { useWorkspace } from '@/lib/workspace-context'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts'

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

const COLORS = {
  gold: '#FFD246', red: '#f87171', orange: '#fb923c', green: '#4ade80',
  cyan: '#22d3ee', purple: '#a78bfa', blue: '#60a5fa', emerald: '#34d399',
}
const PIE_COLORS = [COLORS.red, COLORS.orange, COLORS.gold, COLORS.green]

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

  // Stats
  const total = ideas.length
  const avgScore = total ? Math.round(ideas.reduce((s, i) => s + (i.impact_score || 0), 0) / total) : 0
  const above75 = ideas.filter(i => i.impact_score >= 75).length

  // Priority data for donut
  const priorityData = [
    { name: 'Critical', value: ideas.filter(i => i.priority === 'Critical').length },
    { name: 'High', value: ideas.filter(i => i.priority === 'High').length },
    { name: 'Medium', value: ideas.filter(i => i.priority === 'Medium').length },
    { name: 'Low', value: ideas.filter(i => i.priority === 'Low').length },
  ].filter(d => d.value > 0)

  // Department data for bar chart
  const deptCount: Record<string, number> = {}
  ideas.forEach(i => { deptCount[i.department] = (deptCount[i.department] || 0) + 1 })
  const deptData = Object.entries(deptCount).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, value]) => ({ name: name.slice(0, 10), value }))

  // Top ideas
  const topIdeas = [...ideas].sort((a, b) => b.impact_score - a.impact_score).slice(0, 5)

  // Pipeline funnel data
  const funnelData = [
    { name: 'Submitted', value: 84, fill: COLORS.blue },
    { name: 'Threshold', value: 12, fill: COLORS.purple },
    { name: 'Biz Case', value: 7, fill: COLORS.gold },
    { name: 'Approved', value: 5, fill: COLORS.green },
    { name: 'In Dev', value: 3, fill: COLORS.cyan },
    { name: 'Live', value: 2, fill: COLORS.emerald },
  ]

  // Academy skills radar
  const skillsData = [
    { skill: 'Design Think', score: 78 },
    { skill: 'Problem Solv', score: 82 },
    { skill: 'AI Literacy', score: 45 },
    { skill: 'Data Analysis', score: 67 },
    { skill: 'CX Design', score: 71 },
    { skill: 'Lean Method', score: 58 },
  ]

  // Academy completion donut
  const academyDonut = [
    { name: 'Completed', value: 172 },
    { name: 'In Progress', value: 100 },
  ]

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">{[1, 2, 3].map(i => (<div key={i} className="h-48 rounded-2xl bg-dark-card border border-dark-border animate-pulse" />))}</div>
      </main>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
        <p className="text-gray-500 text-sm">Click any section to explore</p>
      </div>

      {/* ═══ ROW 1: KPI Cards ═══ */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Ideas', value: total, color: 'text-gold', sub: `${above75} above threshold` },
          { label: 'Avg Impact', value: avgScore, color: 'text-gold', sub: '/100 score' },
          { label: 'Investment', value: 'AED 2.5M', color: 'text-emerald-400', sub: 'in pipeline' },
          { label: 'Portfolio ROI', value: '278%', color: 'text-green-400', sub: 'avg return' },
        ].map(kpi => (
          <div key={kpi.label} className="p-4 rounded-2xl bg-dark-card border border-dark-border">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{kpi.label}</p>
            <p className={`text-2xl font-serif font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="text-[10px] text-gray-600">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* ═══ ROW 2: Priority Donut + Department Bar + Top Ideas ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Priority Donut */}
        <Link href="/idea-engine" className="block group">
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all h-full">
            <h3 className="text-sm font-serif font-bold mb-2 group-hover:text-gold">Ideas by Priority</h3>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={priorityData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value" stroke="none">
                    {priorityData.map((_, i) => (<Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-3 mt-1">
              {priorityData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1 text-[10px] text-gray-400">
                  <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />{d.name} ({d.value})
                </span>
              ))}
            </div>
          </div>
        </Link>

        {/* Department Bar */}
        <Link href="/idea-engine" className="block group">
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all h-full">
            <h3 className="text-sm font-serif font-bold mb-2 group-hover:text-gold">Ideas by Department</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={deptData} layout="vertical" margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="value" fill={COLORS.gold} radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Link>

        {/* Top Ideas */}
        <Link href="/idea-engine" className="block group">
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all h-full">
            <h3 className="text-sm font-serif font-bold mb-3 group-hover:text-gold">Top Scoring Ideas</h3>
            <div className="space-y-2">
              {topIdeas.map((idea, i) => (
                <Link key={idea.id} href={`/idea-engine/${idea.id}`} className="flex items-center gap-2 hover:bg-dark-hover rounded-lg p-1 -m-1 transition-all" onClick={e => e.stopPropagation()}>
                  <span className="text-xs font-bold text-gold w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] text-white truncate">{idea.title}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="w-16 h-1.5 bg-dark-border rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${idea.impact_score}%` }} />
                    </div>
                    <span className="text-xs font-bold text-gold w-6 text-right">{idea.impact_score}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Link>
      </div>

      {/* ═══ ROW 3: Pipeline Funnel + ROI Trend ═══ */}
      <Link href="/pipeline" className="block group mb-6">
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-serif font-bold group-hover:text-gold">🚀 Innovation Pulse — Pipeline Funnel</h3>
            <span className="text-[10px] text-gray-500 group-hover:text-gold">View details →</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Funnel bars */}
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={funnelData} layout="vertical" margin={{ left: 0, right: 20, top: 5, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={65} tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={18}>
                  {funnelData.map((entry, i) => (<Cell key={i} fill={entry.fill} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            {/* ROI Trend area */}
            <div>
              <p className="text-[10px] text-gray-500 mb-2">Portfolio ROI Trend (Monthly %)</p>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={[
                  { month: 'Oct', roi: 0 }, { month: 'Nov', roi: 65 }, { month: 'Dec', roi: 120 },
                  { month: 'Jan', roi: 180 }, { month: 'Feb', roi: 230 }, { month: 'Mar', roi: 278 },
                ]} margin={{ left: 0, right: 10, top: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', fontSize: '12px', color: '#fff' }} formatter={(v) => `${v}%`} />
                  <Area type="monotone" dataKey="roi" stroke={COLORS.emerald} fill="url(#roiGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </Link>

      {/* ═══ ROW 4: Academy Skills Radar + Completion Donut ═══ */}
      <Link href="/co-facilitator" className="block group mb-6">
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-serif font-bold group-hover:text-gold">🎓 AI Academy — Skills & Completion</h3>
            <span className="text-[10px] text-gray-500 group-hover:text-gold">View academy →</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Skills Radar */}
            <div className="lg:col-span-2">
              <p className="text-[10px] text-gray-500 mb-1">Organisation Skills Proficiency</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="#222" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9, fill: '#999' }} />
                  <Radar dataKey="score" stroke={COLORS.gold} fill={COLORS.gold} fillOpacity={0.15} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Completion Donut */}
            <div className="flex flex-col items-center justify-center">
              <p className="text-[10px] text-gray-500 mb-2">Training Completion</p>
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={academyDonut} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" stroke="none">
                    <Cell fill={COLORS.green} />
                    <Cell fill="#222" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <p className="text-xl font-serif font-bold text-green-400 -mt-2">63%</p>
              <p className="text-[10px] text-gray-500">172 of 272 enrolled</p>
              <div className="flex gap-3 mt-2">
                <span className="text-[10px] text-gray-400">6 courses</span>
                <span className="text-[10px] text-gray-400">5 active</span>
                <span className="text-[10px] text-gray-400">86% avg</span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* ═══ ROW 5: Data Sources ═══ */}
      <Link href="/settings" className="block group">
        <div className="p-4 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-serif font-bold group-hover:text-gold">⚙️ Data Sources</h3>
              <div className="flex gap-1.5">
                {['🤖', '🏢', '📚', '📊', '👥', '🌐'].map(icon => (
                  <span key={icon} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black border border-dark-border text-sm">{icon}<span className="w-1.5 h-1.5 rounded-full bg-green-400" /></span>
                ))}
              </div>
            </div>
            <span className="text-[10px] text-green-400">All 6 connected</span>
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
