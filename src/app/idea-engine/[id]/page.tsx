'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import { ScoreBreakdownPanel } from '@/components/ScoreBreakdown'
import { DataInsightsPanel } from '@/components/DataInsights'
import { DataSourcesPanel } from '@/components/DataSources'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis } from 'recharts'

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

const priorityColor: Record<string, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-gold/20 text-gold border-gold/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const priorityExplanation: Record<string, string> = {
  Critical: 'Addresses an urgent business need with high revenue impact, competitive advantage, or risk mitigation.',
  High: 'Strong strategic alignment with significant potential for growth or efficiency gains.',
  Medium: 'Valuable improvement that enhances operations but is not time-sensitive.',
  Low: 'Nice-to-have enhancement with modest impact.',
}

function getEmployee(title: string, department: string) {
  const employees: Record<string, { name: string; empId: string; role: string }> = {
    Product: { name: 'Aisha Rahman', empId: 'EMP-1042', role: 'Product Manager' },
    Operations: { name: 'Omar Hassan', empId: 'EMP-2015', role: 'Operations Lead' },
    HR: { name: 'Priya Kapoor', empId: 'EMP-3007', role: 'HR Business Partner' },
    Sales: { name: 'Fatima Al-Sayed', empId: 'EMP-4003', role: 'Sales Director' },
    Engineering: { name: 'Mohammed Al-Rashid', empId: 'EMP-5002', role: 'Engineering Manager' },
    'Customer Success': { name: 'Emily Zhang', empId: 'EMP-6008', role: 'CS Team Lead' },
    Finance: { name: 'Nadia Hussain', empId: 'EMP-7004', role: 'Financial Analyst' },
    Marketing: { name: 'Sophie Laurent', empId: 'EMP-8006', role: 'Marketing Manager' },
  }
  return employees[department] || employees['Product']
}

function getBizCase(score: number) {
  const investment = Math.round((score * 5500) + 50000)
  const roi = Math.round(score * 3.8)
  const payback = Math.max(3, Math.round(12 - (score / 12)))
  return {
    investment: `AED ${(investment / 1000).toFixed(0)}K`,
    roi: `${roi}%`,
    payback: `${payback} months`,
    risk: score >= 85 ? 'Low' : score >= 70 ? 'Medium' : 'High',
    npv: `AED ${Math.round(investment * (roi / 100) - investment).toLocaleString()}`,
    breakeven: `Month ${payback}`,
  }
}

function IdeaDetailContent() {
  const { id } = useParams()
  const [idea, setIdea] = useState<Idea | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchIdea()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const fetchIdea = async () => {
    try {
      const res = await fetch(`/api/ideas/${id}`)
      if (res.ok) setIdea(await res.json())
    } catch { /* */ } finally { setLoading(false) }
  }

  if (loading) return (
    <main className="max-w-5xl mx-auto px-4 py-12">
      <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-dark-card border border-dark-border animate-pulse" />)}</div>
    </main>
  )

  if (!idea) return (
    <main className="max-w-5xl mx-auto px-4 py-12 text-center">
      <p className="text-gray-400 mb-4">Idea not found</p>
      <Link href="/idea-engine" className="text-gold hover:text-gold-light">Back to Idea &amp; Insight</Link>
    </main>
  )

  const emp = getEmployee(idea.title, idea.department)
  const biz = getBizCase(idea.impact_score)
  const trendData = [0, 15, 35, 55, 72, idea.impact_score].map((v, i) => ({ m: `W${i + 1}`, score: v }))

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/idea-engine" className="hover:text-gold">Idea &amp; Insight</Link>
        <span>/</span>
        <span className="text-gray-300">{idea.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-serif font-bold">{idea.title}</h1>
            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${priorityColor[idea.priority]}`}>{idea.priority}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="px-2 py-0.5 rounded-md bg-gold/10 text-gold border border-gold/20 text-xs">{idea.category}</span>
            <span>{idea.department}</span>
            <span>{new Date(idea.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex flex-col items-center p-4 rounded-2xl bg-gold/5 border border-gold/20 min-w-[100px]">
          <span className="text-3xl font-serif font-bold text-gold">{idea.impact_score}</span>
          <span className="text-[10px] text-gray-500">Impact Score</span>
        </div>
      </div>

      {/* Submitter */}
      <div className="p-4 rounded-2xl bg-dark-card border border-dark-border mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gold/20 text-gold flex items-center justify-center font-bold">
          {emp.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <p className="font-medium text-white">{emp.name}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-gold font-mono bg-gold/10 px-2 py-0.5 rounded border border-gold/20">{emp.empId}</span>
            <span>{emp.role}</span>
            <span>•</span>
            <span>{idea.department}</span>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <div className="p-5 rounded-2xl bg-gold/5 border border-gold/20 mb-6">
        <p className="text-gold text-xs uppercase tracking-wider font-semibold mb-2">AI Summary</p>
        <p className="text-gray-300 leading-relaxed">{idea.ai_summary}</p>
      </div>

      {/* Description */}
      <div className="p-5 rounded-2xl bg-dark-card border border-dark-border mb-6">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Full Description</p>
        <p className="text-gray-400 text-sm leading-relaxed">{idea.description}</p>
      </div>

      {/* Business Case */}
      <div className="p-5 rounded-2xl bg-dark-card border border-dark-border mb-6">
        <h2 className="text-lg font-serif font-bold mb-4">📋 Business Case</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Investment Required', value: biz.investment, color: 'text-gold' },
            { label: 'Expected ROI', value: biz.roi, color: 'text-green-400' },
            { label: 'Payback Period', value: biz.payback, color: 'text-white' },
            { label: 'Risk Level', value: biz.risk, color: biz.risk === 'Low' ? 'text-green-400' : biz.risk === 'Medium' ? 'text-gold' : 'text-red-400' },
            { label: 'Net Present Value', value: biz.npv, color: 'text-emerald-400' },
            { label: 'Breakeven', value: biz.breakeven, color: 'text-white' },
          ].map(k => (
            <div key={k.label} className="p-3 rounded-xl bg-black border border-dark-border">
              <p className="text-[10px] text-gray-500 mb-1">{k.label}</p>
              <p className={`text-lg font-serif font-bold ${k.color}`}>{k.value}</p>
            </div>
          ))}
        </div>

        {/* Score Trend */}
        <div className="p-3 rounded-xl bg-black border border-dark-border">
          <p className="text-[10px] text-gray-500 uppercase mb-2">Impact Score Progression</p>
          <ResponsiveContainer width="100%" height={80}>
            <AreaChart data={trendData} margin={{ left: 0, right: 5, top: 5, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFD246" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FFD246" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="m" tick={{ fontSize: 9, fill: '#555' }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Area type="monotone" dataKey="score" stroke="#FFD246" fill="url(#scoreGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Priority Explanation */}
      <div className="p-5 rounded-2xl bg-dark-card border border-dark-border mb-6">
        <h2 className="text-lg font-serif font-bold mb-3">Why {idea.priority} Priority?</h2>
        <span className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium border mb-3 ${priorityColor[idea.priority]}`}>{idea.priority}</span>
        <p className="text-gray-400 text-sm leading-relaxed">{priorityExplanation[idea.priority]}</p>
      </div>

      {/* Score Breakdown */}
      <div className="mb-6">
        <ScoreBreakdownPanel score={idea.impact_score} title={idea.title} />
      </div>

      {/* ERP + Sentiment */}
      <div className="mb-6">
        <DataInsightsPanel title={idea.title} category={idea.category} department={idea.department} score={idea.impact_score} />
      </div>

      {/* Data Sources */}
      <div className="mb-6">
        <DataSourcesPanel />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-dark-card border border-dark-border">
        <Link href="/pipeline" className="px-5 py-2.5 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light transition-all text-sm">
          View in Pipeline
        </Link>
        <Link href="/idea-engine" className="px-5 py-2.5 border border-dark-border text-gray-400 rounded-xl hover:text-white hover:bg-dark-hover transition-all text-sm">
          Back to All Ideas
        </Link>
      </div>
    </main>
  )
}

export default function IdeaDetailPage() {
  return (
    <AuthLayout>
      <IdeaDetailContent />
    </AuthLayout>
  )
}
