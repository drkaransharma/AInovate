'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AuthLayout from '@/components/AuthLayout'
import { useWorkspace } from '@/lib/workspace-context'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar, Tooltip } from 'recharts'

// ── Pipeline Stages ──
const STAGES = [
  { id: 'all', label: 'All', icon: '📋', color: 'text-gold border-gold/30 bg-gold/10' },
  { id: 'idea', label: 'Idea', icon: '💡', color: 'text-blue-400 border-blue-500/30 bg-blue-500/10' },
  { id: 'business_case', label: 'Business Case', icon: '📊', color: 'text-purple-400 border-purple-500/30 bg-purple-500/10' },
  { id: 'approval', label: 'Approval', icon: '👔', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  { id: 'project', label: 'Project', icon: '🔧', color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' },
  { id: 'deployed', label: 'Deployed', icon: '🚀', color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' },
]

interface PipelineItem {
  id: string
  title: string
  department: string
  priority: string
  impact_score: number
  stage: string
  submitter: { name: string; empId: string; role: string }
  // Business Case
  investment?: string
  expected_roi?: string
  payback?: string
  risk?: string
  // Approval
  approved_by?: string
  approved_date?: string
  approval_notes?: string
  // Project
  sprint?: string
  progress?: number
  team_size?: number
  start_date?: string
  target_date?: string
  cost_spent?: string
  cost_total?: string
  milestones?: { name: string; done: boolean }[]
  // Deployed / ROI
  deployed_date?: string
  months_live?: number
  actual_roi?: number
  target_roi?: number
  revenue_impact?: string
  cost_savings?: string
  efficiency_gain?: string
  customer_impact?: string
  roi_trend?: number[]
  metrics?: { label: string; target: string; actual: string; status: string }[]
}

// ── All 15 ideas mapped to pipeline stages ──
const pipelineData: PipelineItem[] = [
  // DEPLOYED (2) — with full ROI tracking
  {
    id: 'p1', title: 'AI-Powered Customer Onboarding', department: 'Product', priority: 'Critical', impact_score: 92, stage: 'deployed',
    submitter: { name: 'Aisha Rahman', empId: 'EMP-1042', role: 'Product Manager' },
    investment: 'AED 485,000', expected_roi: '340%', payback: '6 months', risk: 'Low',
    approved_by: 'CEO — Dr. Karan Sharma', approved_date: 'Jan 15, 2026', approval_notes: 'Strategic priority. Fast-track.',
    sprint: 'Sprint 12', progress: 100, team_size: 6, start_date: 'Jan 22, 2026', target_date: 'Mar 15, 2026', cost_spent: 'AED 485,000', cost_total: 'AED 485,000',
    milestones: [{ name: 'Design', done: true }, { name: 'Build', done: true }, { name: 'Test', done: true }, { name: 'Deploy', done: true }],
    deployed_date: 'Mar 15, 2026', months_live: 3, actual_roi: 312, target_roi: 340,
    revenue_impact: '+AED 1.2M ARR', cost_savings: 'AED 340K/yr', efficiency_gain: '42% faster onboarding', customer_impact: 'NPS +18',
    roi_trend: [65, 120, 180, 245, 290, 312],
    metrics: [
      { label: 'Support Tickets Reduced', target: '40%', actual: '37%', status: 'on_track' },
      { label: 'Onboarding Time', target: '7 days', actual: '6.2 days', status: 'exceeded' },
      { label: 'Customer Satisfaction', target: '4.5/5', actual: '4.7/5', status: 'exceeded' },
      { label: 'Churn Rate', target: '-25%', actual: '-31%', status: 'exceeded' },
    ],
  },
  {
    id: 'p2', title: 'Dynamic Pricing Engine', department: 'Finance', priority: 'Critical', impact_score: 91, stage: 'deployed',
    submitter: { name: 'Nadia Hussain', empId: 'EMP-7004', role: 'Financial Analyst' },
    investment: 'AED 620,000', expected_roi: '280%', payback: '8 months', risk: 'Medium',
    approved_by: 'CFO — Mark Thompson', approved_date: 'Dec 8, 2025', approval_notes: 'High revenue potential.',
    sprint: 'Sprint 14', progress: 100, team_size: 4, start_date: 'Dec 15, 2025', target_date: 'Feb 28, 2026', cost_spent: 'AED 620,000', cost_total: 'AED 620,000',
    milestones: [{ name: 'Design', done: true }, { name: 'Build', done: true }, { name: 'Test', done: true }, { name: 'Deploy', done: true }],
    deployed_date: 'Feb 28, 2026', months_live: 4, actual_roi: 245, target_roi: 280,
    revenue_impact: '+AED 2.8M ARR', cost_savings: 'AED 180K/yr', efficiency_gain: '3.2x pricing speed', customer_impact: 'Win rate +8%',
    roi_trend: [30, 85, 140, 190, 225, 245],
    metrics: [
      { label: 'Revenue Uplift', target: '+18%', actual: '+14%', status: 'on_track' },
      { label: 'Deal Win Rate', target: '+10%', actual: '+8%', status: 'on_track' },
      { label: 'Margin Improvement', target: '+5%', actual: '+6.2%', status: 'exceeded' },
    ],
  },
  // PROJECT (1) — in development
  {
    id: 'p3', title: 'CRM Bot for Contract Renewals', department: 'Sales', priority: 'Critical', impact_score: 95, stage: 'project',
    submitter: { name: 'Fatima Al-Sayed', empId: 'EMP-4003', role: 'Sales Director' },
    investment: 'AED 350,000', expected_roi: '420%', payback: '4 months', risk: 'Low',
    approved_by: 'CEO — Dr. Karan Sharma', approved_date: 'Feb 20, 2026', approval_notes: 'Top priority for Q1.',
    sprint: 'Sprint 8', progress: 68, team_size: 5, start_date: 'Mar 1, 2026', target_date: 'Apr 30, 2026', cost_spent: 'AED 238,000', cost_total: 'AED 350,000',
    milestones: [{ name: 'Architecture', done: true }, { name: 'Core Engine', done: true }, { name: 'CRM Integration', done: false }, { name: 'UAT & Deploy', done: false }],
  },
  // APPROVAL (2) — awaiting leadership
  {
    id: 'p4', title: 'Predictive Inventory Management', department: 'Operations', priority: 'High', impact_score: 87, stage: 'approval',
    submitter: { name: 'Lisa Chen', empId: 'EMP-2031', role: 'Supply Chain Manager' },
    investment: 'AED 410,000', expected_roi: '260%', payback: '10 months', risk: 'Medium',
    approval_notes: 'Pending COO review — scheduled Mar 28 leadership meeting.',
  },
  {
    id: 'p5', title: 'Customer Feedback Loop Automation', department: 'Customer Success', priority: 'High', impact_score: 80, stage: 'approval',
    submitter: { name: 'Emily Zhang', empId: 'EMP-6008', role: 'CS Team Lead' },
    investment: 'AED 165,000', expected_roi: '190%', payback: '6 months', risk: 'Low',
    approval_notes: 'Strong business case. Awaiting VP sign-off.',
  },
  // BUSINESS CASE (3) — case prepared
  {
    id: 'p6', title: 'Supply Chain Risk Monitor', department: 'Operations', priority: 'High', impact_score: 85, stage: 'business_case',
    submitter: { name: 'Omar Hassan', empId: 'EMP-2015', role: 'Operations Lead' },
    investment: 'AED 280,000', expected_roi: '210%', payback: '9 months', risk: 'Medium',
  },
  {
    id: 'p7', title: 'Automated Code Review Pipeline', department: 'Engineering', priority: 'High', impact_score: 83, stage: 'business_case',
    submitter: { name: 'Mohammed Al-Rashid', empId: 'EMP-5002', role: 'Engineering Manager' },
    investment: 'AED 195,000', expected_roi: '180%', payback: '7 months', risk: 'Low',
  },
  {
    id: 'p8', title: 'Employee Wellness Dashboard', department: 'HR', priority: 'High', impact_score: 78, stage: 'business_case',
    submitter: { name: 'Priya Kapoor', empId: 'EMP-3007', role: 'HR Business Partner' },
    investment: 'AED 220,000', expected_roi: '150%', payback: '11 months', risk: 'Medium',
  },
  // IDEA (7) — scored but not yet business case
  {
    id: 'p9', title: 'Internal Knowledge Base AI', department: 'HR', priority: 'Medium', impact_score: 74, stage: 'idea',
    submitter: { name: 'David Okonkwo', empId: 'EMP-3019', role: 'L&D Specialist' },
  },
  {
    id: 'p10', title: 'Personalised Learning Pathways', department: 'HR', priority: 'Medium', impact_score: 72, stage: 'idea',
    submitter: { name: 'Priya Kapoor', empId: 'EMP-3007', role: 'HR Business Partner' },
  },
  {
    id: 'p11', title: 'Green Energy Transition Plan', department: 'Operations', priority: 'Medium', impact_score: 71, stage: 'idea',
    submitter: { name: 'Omar Hassan', empId: 'EMP-2015', role: 'Operations Lead' },
  },
  {
    id: 'p12', title: 'AR Product Demos', department: 'Marketing', priority: 'Medium', impact_score: 68, stage: 'idea',
    submitter: { name: 'Sophie Laurent', empId: 'EMP-8006', role: 'Marketing Manager' },
  },
  {
    id: 'p13', title: 'Meeting Intelligence Assistant', department: 'Engineering', priority: 'Medium', impact_score: 65, stage: 'idea',
    submitter: { name: 'Sarah Kim', empId: 'EMP-5014', role: 'Senior Developer' },
  },
  {
    id: 'p14', title: 'Office Space Utilization Tracker', department: 'Operations', priority: 'Low', impact_score: 52, stage: 'idea',
    submitter: { name: 'Omar Hassan', empId: 'EMP-2015', role: 'Operations Lead' },
  },
  {
    id: 'p15', title: 'Internal Social Innovation Feed', department: 'HR', priority: 'Low', impact_score: 44, stage: 'idea',
    submitter: { name: 'David Okonkwo', empId: 'EMP-3019', role: 'L&D Specialist' },
  },
]

const priorityColor: Record<string, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-gold/20 text-gold border-gold/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
}

function PipelineContent() {
  const { workspaceId } = useWorkspace()
  const [selectedStage, setSelectedStage] = useState('all')
  const [ideaMap, setIdeaMap] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!workspaceId) return
    fetch(`/api/ideas?workspace_id=${workspaceId}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map: Record<string, string> = {}
          data.forEach((idea: { id: string; title: string }) => { map[idea.title] = idea.id })
          setIdeaMap(map)
        }
      })
      .catch(() => {})
  }, [workspaceId])

  const getLink = (title: string) => ideaMap[title] ? `/idea-engine/${ideaMap[title]}` : '/idea-engine'
  const filtered = selectedStage === 'all' ? pipelineData : pipelineData.filter(i => i.stage === selectedStage)

  const stageCounts = STAGES.slice(1).map(s => ({ ...s, count: pipelineData.filter(i => i.stage === s.id).length }))
  const totalInvested = pipelineData.filter(i => i.investment).reduce((s, i) => s + parseInt(i.investment!.replace(/[^0-9]/g, '') || '0'), 0)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold">Innovation Pulse</h1>
          <p className="text-gray-500 text-sm">Track every idea from concept to deployed ROI</p>
        </div>
        <div className="flex gap-3 text-center">
          <div className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border">
            <p className="text-lg font-serif font-bold text-gold">{pipelineData.length}</p>
            <p className="text-[10px] text-gray-500">In Pipeline</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border">
            <p className="text-lg font-serif font-bold text-emerald-400">AED {(totalInvested / 1000000).toFixed(1)}M</p>
            <p className="text-[10px] text-gray-500">Invested</p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-dark-card border border-dark-border">
            <p className="text-lg font-serif font-bold text-green-400">278%</p>
            <p className="text-[10px] text-gray-500">Avg ROI</p>
          </div>
        </div>
      </div>

      {/* Stage Flow Filter */}
      <div className="flex items-center gap-1 mb-6 p-3 rounded-2xl bg-dark-card border border-dark-border overflow-x-auto">
        {STAGES.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => setSelectedStage(stage.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedStage === stage.id ? `border ${stage.color}` : 'text-gray-500 hover:text-white hover:bg-dark-hover'}`}
            >
              <span>{stage.icon}</span>
              <span>{stage.label}</span>
              {stage.id !== 'all' && (
                <span className="px-1.5 py-0.5 rounded-md bg-dark-border text-[10px] text-gray-400">
                  {pipelineData.filter(p => p.stage === stage.id).length}
                </span>
              )}
            </button>
            {i > 0 && i < STAGES.length - 1 && <span className="text-gray-700">→</span>}
          </div>
        ))}
      </div>

      {/* Visual Funnel (only on "All") */}
      {selectedStage === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
            <h3 className="text-sm font-serif font-bold mb-3">Pipeline Funnel</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={stageCounts} layout="vertical" margin={{ left: 5, right: 20, top: 5, bottom: 5 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="label" width={80} tick={{ fontSize: 10, fill: '#999' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', fontSize: '12px', color: '#fff' }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
                  {stageCounts.map((_, i) => (<Cell key={i} fill={['#60a5fa', '#a78bfa', '#fb923c', '#22d3ee', '#34d399'][i]} />))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
            <h3 className="text-sm font-serif font-bold mb-1">Portfolio ROI Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={[{ m: 'Oct', v: 0 }, { m: 'Nov', v: 65 }, { m: 'Dec', v: 120 }, { m: 'Jan', v: 180 }, { m: 'Feb', v: 230 }, { m: 'Mar', v: 278 }]} margin={{ left: 0, right: 10, top: 10, bottom: 5 }}>
                <defs><linearGradient id="roiG" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.3} /><stop offset="95%" stopColor="#34d399" stopOpacity={0} /></linearGradient></defs>
                <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#666' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#444' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: '8px', fontSize: '12px', color: '#fff' }} formatter={(v) => `${v}%`} />
                <Area type="monotone" dataKey="v" stroke="#34d399" fill="url(#roiG)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4">
        {filtered.map(item => {
          const stageInfo = STAGES.find(s => s.id === item.stage)!
          return (
            <div key={item.id} className="p-5 rounded-2xl bg-dark-card border border-dark-border hover:border-gold/20 transition-all">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${stageInfo.color}`}>{stageInfo.icon} {stageInfo.label}</span>
                    <Link href={getLink(item.title)} className="font-serif font-bold hover:text-gold transition-colors">{item.title} →</Link>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${priorityColor[item.priority]}`}>{item.priority}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-white">{item.submitter.name}</span>
                    <span className="text-gold font-mono">{item.submitter.empId}</span>
                    <span>{item.department}</span>
                    <span>Score: <span className="text-gold font-bold">{item.impact_score}</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {item.progress !== undefined && item.stage === 'project' && (
                    <div className="text-center"><p className="text-lg font-serif font-bold text-cyan-400">{item.progress}%</p><p className="text-[10px] text-gray-500">Progress</p></div>
                  )}
                  {item.actual_roi !== undefined && (
                    <div className="text-center"><p className="text-lg font-serif font-bold text-emerald-400">{item.actual_roi}%</p><p className="text-[10px] text-gray-500">ROI</p></div>
                  )}
                </div>
              </div>

              {/* Business Case Data (shown for business_case, approval, project, deployed) */}
              {item.investment && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-black border border-dark-border"><p className="text-[10px] text-gray-500">Investment</p><p className="text-sm font-bold text-gold">{item.investment}</p></div>
                  <div className="p-2 rounded-lg bg-black border border-dark-border"><p className="text-[10px] text-gray-500">Expected ROI</p><p className="text-sm font-bold text-green-400">{item.expected_roi}</p></div>
                  <div className="p-2 rounded-lg bg-black border border-dark-border"><p className="text-[10px] text-gray-500">Payback</p><p className="text-sm font-bold text-white">{item.payback}</p></div>
                  <div className="p-2 rounded-lg bg-black border border-dark-border"><p className="text-[10px] text-gray-500">Risk</p><p className={`text-sm font-bold ${item.risk === 'Low' ? 'text-green-400' : 'text-gold'}`}>{item.risk}</p></div>
                </div>
              )}

              {/* Approval (shown for approval, project, deployed) */}
              {item.approved_by && (
                <div className="p-2.5 rounded-lg bg-green-500/5 border border-green-500/20 mb-3 flex items-center gap-2 text-xs">
                  <span className="text-green-400">✓ {item.approved_by}</span>
                  <span className="text-gray-500">{item.approved_date}</span>
                  <span className="text-gray-500 italic">&ldquo;{item.approval_notes}&rdquo;</span>
                </div>
              )}
              {item.approval_notes && !item.approved_by && (
                <div className="p-2.5 rounded-lg bg-gold/5 border border-gold/20 mb-3 text-xs text-gray-400 italic">⏳ {item.approval_notes}</div>
              )}

              {/* Project Progress (shown for project, deployed) */}
              {item.milestones && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-gray-500">{item.sprint} • Team: {item.team_size} • {item.start_date} → {item.target_date}</span>
                    <span className="text-xs font-bold text-gold">{item.progress}%</span>
                  </div>
                  <div className="h-2 bg-dark-border rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${item.progress === 100 ? 'bg-green-400' : 'bg-gold'}`} style={{ width: `${item.progress}%` }} />
                  </div>
                  <div className="flex gap-2">
                    {item.milestones.map(m => (
                      <span key={m.name} className={`text-[10px] px-2 py-0.5 rounded ${m.done ? 'bg-green-500/20 text-green-400 line-through' : 'bg-dark-border text-gray-500'}`}>{m.name}</span>
                    ))}
                  </div>
                  {item.cost_spent && (
                    <div className="flex gap-3 mt-2 text-[10px] text-gray-500">
                      <span>Budget: <span className="text-white">{item.cost_total}</span></span>
                      <span>Spent: <span className="text-gold">{item.cost_spent}</span></span>
                    </div>
                  )}
                </div>
              )}

              {/* Deployed ROI (shown for deployed) */}
              {item.actual_roi !== undefined && item.roi_trend && (
                <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    <div className="p-2 rounded-lg bg-black border border-dark-border text-center"><p className="text-[10px] text-gray-500">Revenue</p><p className="text-xs font-bold text-green-400">{item.revenue_impact}</p></div>
                    <div className="p-2 rounded-lg bg-black border border-dark-border text-center"><p className="text-[10px] text-gray-500">Savings</p><p className="text-xs font-bold text-gold">{item.cost_savings}</p></div>
                    <div className="p-2 rounded-lg bg-black border border-dark-border text-center"><p className="text-[10px] text-gray-500">Efficiency</p><p className="text-xs font-bold text-cyan-400">{item.efficiency_gain}</p></div>
                    <div className="p-2 rounded-lg bg-black border border-dark-border text-center"><p className="text-[10px] text-gray-500">Customer</p><p className="text-xs font-bold text-purple-400">{item.customer_impact}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>ROI: {item.actual_roi}% of {item.target_roi}% target</span>
                        <span>{Math.round((item.actual_roi / item.target_roi!) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-dark-border rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min((item.actual_roi / item.target_roi!) * 100, 100)}%` }} />
                      </div>
                    </div>
                    <ResponsiveContainer width={120} height={40}>
                      <AreaChart data={item.roi_trend.map((v, i) => ({ m: i, v }))} margin={{ left: 0, right: 0, top: 2, bottom: 2 }}>
                        <Area type="monotone" dataKey="v" stroke="#34d399" fill="#34d399" fillOpacity={0.1} strokeWidth={1.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  {item.metrics && (
                    <div className="mt-3 space-y-1">
                      {item.metrics.map(m => (
                        <div key={m.label} className="flex items-center justify-between text-[10px]">
                          <span className="text-gray-400">{m.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Target: {m.target}</span>
                            <span className={m.status === 'exceeded' ? 'text-green-400 font-bold' : 'text-gold font-bold'}>Actual: {m.actual}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] ${m.status === 'exceeded' ? 'bg-green-500/20 text-green-400' : 'bg-gold/20 text-gold'}`}>{m.status === 'exceeded' ? '▲' : '●'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </main>
  )
}

export default function PipelinePage() {
  return (
    <AuthLayout>
      <PipelineContent />
    </AuthLayout>
  )
}
