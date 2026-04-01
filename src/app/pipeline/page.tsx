'use client'

import { useState } from 'react'
import AuthLayout from '@/components/AuthLayout'

// ── Pipeline Stages ──
const stages = [
  { id: 'submitted', label: 'Submitted', icon: '📥', color: 'border-blue-500/30 bg-blue-500/5', dot: 'bg-blue-400' },
  { id: 'analyzed', label: 'AI Analyzed', icon: '🤖', color: 'border-purple-500/30 bg-purple-500/5', dot: 'bg-purple-400' },
  { id: 'business_case', label: 'Business Case', icon: '📋', color: 'border-gold/30 bg-gold/5', dot: 'bg-gold' },
  { id: 'leadership', label: 'Leadership Review', icon: '👔', color: 'border-orange-500/30 bg-orange-500/5', dot: 'bg-orange-400' },
  { id: 'approved', label: 'Approved', icon: '✅', color: 'border-green-500/30 bg-green-500/5', dot: 'bg-green-400' },
  { id: 'development', label: 'In Development', icon: '🔧', color: 'border-cyan-500/30 bg-cyan-500/5', dot: 'bg-cyan-400' },
  { id: 'roi_tracking', label: 'ROI Tracking', icon: '📊', color: 'border-emerald-500/30 bg-emerald-500/5', dot: 'bg-emerald-400' },
]

interface PipelineIdea {
  id: string
  title: string
  department: string
  category: string
  priority: string
  impact_score: number
  stage: string
  submitter: { name: string; empId: string; role: string }
  business_case?: {
    investment_required: string
    expected_roi: string
    payback_period: string
    risk_level: string
  }
  leadership?: {
    decision: string
    decided_by: string
    decided_date: string
    notes: string
  }
  devops?: {
    sprint: string
    progress: number
    team_size: number
    start_date: string
    target_date: string
    status: string
  }
  roi?: {
    revenue_impact: string
    cost_savings: string
    efficiency_gain: string
    customer_impact: string
    actual_roi: number
    target_roi: number
    months_tracked: number
    metrics: { label: string; target: string; actual: string; status: string }[]
  }
}

// ── Demo Pipeline Data ──
const pipelineIdeas: PipelineIdea[] = [
  // ROI Tracking (completed & measuring)
  {
    id: '1', title: 'AI-Powered Customer Onboarding', department: 'Product', category: 'Customer Experience', priority: 'Critical', impact_score: 92, stage: 'roi_tracking',
    submitter: { name: 'Aisha Rahman', empId: 'EMP-1042', role: 'Product Manager' },
    business_case: { investment_required: 'AED 485,000', expected_roi: '340%', payback_period: '6 months', risk_level: 'Low' },
    leadership: { decision: 'Approved', decided_by: 'CEO — Dr. Karan Sharma', decided_date: 'Jan 15, 2026', notes: 'Strategic priority. Fast-track implementation.' },
    devops: { sprint: 'Sprint 12', progress: 100, team_size: 6, start_date: 'Jan 22, 2026', target_date: 'Mar 15, 2026', status: 'Deployed' },
    roi: {
      revenue_impact: '+AED 1.2M ARR', cost_savings: 'AED 340K/year', efficiency_gain: '42% faster onboarding', customer_impact: 'NPS +18 points',
      actual_roi: 312, target_roi: 340, months_tracked: 3,
      metrics: [
        { label: 'Support Tickets Reduced', target: '40%', actual: '37%', status: 'on_track' },
        { label: 'Onboarding Time', target: '7 days', actual: '6.2 days', status: 'exceeded' },
        { label: 'Customer Satisfaction', target: '4.5/5', actual: '4.7/5', status: 'exceeded' },
        { label: 'Revenue per Customer', target: '+15%', actual: '+12%', status: 'on_track' },
        { label: 'Churn Rate', target: '-25%', actual: '-31%', status: 'exceeded' },
      ],
    },
  },
  {
    id: '2', title: 'Dynamic Pricing Engine', department: 'Finance', category: 'Revenue Growth', priority: 'Critical', impact_score: 91, stage: 'roi_tracking',
    submitter: { name: 'Nadia Hussain', empId: 'EMP-7004', role: 'Financial Analyst' },
    business_case: { investment_required: 'AED 620,000', expected_roi: '280%', payback_period: '8 months', risk_level: 'Medium' },
    leadership: { decision: 'Approved', decided_by: 'CFO — Mark Thompson', decided_date: 'Dec 8, 2025', notes: 'High revenue potential. Monitor competitor response.' },
    devops: { sprint: 'Sprint 14', progress: 100, team_size: 4, start_date: 'Dec 15, 2025', target_date: 'Feb 28, 2026', status: 'Deployed' },
    roi: {
      revenue_impact: '+AED 2.8M ARR', cost_savings: 'AED 180K/year', efficiency_gain: '3.2x pricing iterations', customer_impact: 'Win rate +8%',
      actual_roi: 245, target_roi: 280, months_tracked: 4,
      metrics: [
        { label: 'Revenue Uplift', target: '+18%', actual: '+14%', status: 'on_track' },
        { label: 'Price Optimization Speed', target: 'Real-time', actual: 'Real-time', status: 'exceeded' },
        { label: 'Deal Win Rate', target: '+10%', actual: '+8%', status: 'on_track' },
        { label: 'Margin Improvement', target: '+5%', actual: '+6.2%', status: 'exceeded' },
      ],
    },
  },
  // In Development
  {
    id: '3', title: 'CRM Bot for Contract Renewals', department: 'Sales', category: 'Revenue Growth', priority: 'Critical', impact_score: 95, stage: 'development',
    submitter: { name: 'Fatima Al-Sayed', empId: 'EMP-4003', role: 'Sales Director' },
    business_case: { investment_required: 'AED 350,000', expected_roi: '420%', payback_period: '4 months', risk_level: 'Low' },
    leadership: { decision: 'Approved', decided_by: 'CEO — Dr. Karan Sharma', decided_date: 'Feb 20, 2026', notes: 'Immediate revenue impact. Top priority.' },
    devops: { sprint: 'Sprint 8', progress: 68, team_size: 5, start_date: 'Mar 1, 2026', target_date: 'Apr 30, 2026', status: 'On Track' },
  },
  {
    id: '4', title: 'Supply Chain Risk Monitor', department: 'Operations', category: 'Cost Reduction', priority: 'High', impact_score: 85, stage: 'development',
    submitter: { name: 'Omar Hassan', empId: 'EMP-2015', role: 'Operations Lead' },
    business_case: { investment_required: 'AED 280,000', expected_roi: '210%', payback_period: '9 months', risk_level: 'Medium' },
    leadership: { decision: 'Approved', decided_by: 'COO — Lisa Chen', decided_date: 'Feb 5, 2026', notes: 'Critical for supply chain resilience.' },
    devops: { sprint: 'Sprint 6', progress: 42, team_size: 3, start_date: 'Feb 15, 2026', target_date: 'May 15, 2026', status: 'On Track' },
  },
  // Approved (awaiting dev)
  {
    id: '5', title: 'Automated Code Review Pipeline', department: 'Engineering', category: 'Process Improvement', priority: 'High', impact_score: 83, stage: 'approved',
    submitter: { name: 'Mohammed Al-Rashid', empId: 'EMP-5002', role: 'Engineering Manager' },
    business_case: { investment_required: 'AED 195,000', expected_roi: '180%', payback_period: '7 months', risk_level: 'Low' },
    leadership: { decision: 'Approved', decided_by: 'CTO — Sarah Kim', decided_date: 'Mar 10, 2026', notes: 'Schedule for Q2. Assign DevOps team.' },
  },
  // Leadership Review
  {
    id: '6', title: 'Predictive Inventory Management', department: 'Operations', category: 'Technology', priority: 'High', impact_score: 87, stage: 'leadership',
    submitter: { name: 'Lisa Chen', empId: 'EMP-2031', role: 'Supply Chain Manager' },
    business_case: { investment_required: 'AED 410,000', expected_roi: '260%', payback_period: '10 months', risk_level: 'Medium' },
  },
  {
    id: '7', title: 'Customer Feedback Loop Automation', department: 'Customer Success', category: 'Product Innovation', priority: 'High', impact_score: 80, stage: 'leadership',
    submitter: { name: 'Emily Zhang', empId: 'EMP-6008', role: 'CS Team Lead' },
    business_case: { investment_required: 'AED 165,000', expected_roi: '190%', payback_period: '6 months', risk_level: 'Low' },
  },
  // Business Case
  {
    id: '8', title: 'Employee Wellness Dashboard', department: 'HR', category: 'Culture & People', priority: 'High', impact_score: 78, stage: 'business_case',
    submitter: { name: 'Priya Kapoor', empId: 'EMP-3007', role: 'HR Business Partner' },
  },
  {
    id: '9', title: 'Internal Knowledge Base AI', department: 'HR', category: 'Process Improvement', priority: 'Medium', impact_score: 74, stage: 'business_case',
    submitter: { name: 'David Okonkwo', empId: 'EMP-3019', role: 'L&D Specialist' },
  },
  // Analyzed
  {
    id: '10', title: 'Green Energy Transition Plan', department: 'Operations', category: 'Sustainability', priority: 'Medium', impact_score: 71, stage: 'analyzed',
    submitter: { name: 'Omar Hassan', empId: 'EMP-2015', role: 'Operations Lead' },
  },
  {
    id: '11', title: 'Personalised Learning Pathways', department: 'HR', category: 'Culture & People', priority: 'Medium', impact_score: 72, stage: 'analyzed',
    submitter: { name: 'Priya Kapoor', empId: 'EMP-3007', role: 'HR Business Partner' },
  },
  // Submitted
  {
    id: '12', title: 'AR Product Demos', department: 'Marketing', category: 'Product Innovation', priority: 'Medium', impact_score: 68, stage: 'submitted',
    submitter: { name: 'Sophie Laurent', empId: 'EMP-8006', role: 'Marketing Manager' },
  },
]

const priorityColor: Record<string, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-gold/20 text-gold border-gold/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const metricStatusColor: Record<string, string> = {
  exceeded: 'text-green-400',
  on_track: 'text-gold',
  at_risk: 'text-orange-400',
  behind: 'text-red-400',
}

function PipelineContent() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedStage, setSelectedStage] = useState<string | null>(null)

  const filteredIdeas = selectedStage ? pipelineIdeas.filter(i => i.stage === selectedStage) : pipelineIdeas

  const totalInvestment = pipelineIdeas.filter(i => i.business_case).reduce((sum, i) => {
    const val = i.business_case!.investment_required.replace(/[^0-9]/g, '')
    return sum + (parseInt(val) || 0)
  }, 0)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-4">
          <span className="text-gold text-sm">🚀 Innovation Pipeline</span>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-3">Innovation Pipeline</h1>
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
          <h2 className="text-base font-serif font-bold text-gold mb-2">What is the Innovation Pipeline?</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            The Innovation Pipeline tracks every idea from submission to measurable ROI. Ideas flow through 7 stages — from AI analysis to business case creation, leadership approval, development, and finally ROI tracking with live metrics. This is where ideas become investments and investments become measurable outcomes.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stages.map((s, i) => (
              <div key={s.id} className="flex items-center gap-1">
                <span className={`px-2.5 py-1 rounded-lg text-xs border ${s.color}`}>{s.icon} {s.label}</span>
                {i < stages.length - 1 && <span className="text-gray-600 text-xs">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: 'In Pipeline', value: pipelineIdeas.length, color: 'text-gold' },
          { label: 'Approved', value: pipelineIdeas.filter(i => ['approved', 'development', 'roi_tracking'].includes(i.stage)).length, color: 'text-green-400' },
          { label: 'In Development', value: pipelineIdeas.filter(i => i.stage === 'development').length, color: 'text-cyan-400' },
          { label: 'Tracking ROI', value: pipelineIdeas.filter(i => i.stage === 'roi_tracking').length, color: 'text-emerald-400' },
          { label: 'Total Investment', value: `AED ${(totalInvestment / 1000).toFixed(0)}K`, color: 'text-gold' },
        ].map((kpi) => (
          <div key={kpi.label} className="p-4 rounded-2xl bg-dark-card border border-dark-border">
            <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className={`text-2xl font-serif font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Stage Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button onClick={() => setSelectedStage(null)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${!selectedStage ? 'bg-gold/10 text-gold border border-gold/30' : 'text-gray-400 hover:text-white hover:bg-dark-hover'}`}>
          All Stages ({pipelineIdeas.length})
        </button>
        {stages.map((s) => {
          const count = pipelineIdeas.filter(i => i.stage === s.id).length
          if (count === 0) return null
          return (
            <button key={s.id} onClick={() => setSelectedStage(selectedStage === s.id ? null : s.id)} className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${selectedStage === s.id ? `border ${s.color}` : 'text-gray-400 hover:text-white hover:bg-dark-hover'}`}>
              {s.icon} {s.label} ({count})
            </button>
          )
        })}
      </div>

      {/* Pipeline Items */}
      <div className="space-y-4">
        {filteredIdeas.map((idea) => {
          const isExpanded = expandedId === idea.id
          const stageInfo = stages.find(s => s.id === idea.stage)!
          return (
            <div key={idea.id} className={`rounded-2xl bg-dark-card border transition-all cursor-pointer ${isExpanded ? 'border-gold/40' : 'border-dark-border hover:border-gold/20'}`} onClick={() => setExpandedId(isExpanded ? null : idea.id)}>
              {/* Summary */}
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${stageInfo.color}`}>{stageInfo.icon} {stageInfo.label}</span>
                      <h3 className="font-serif font-bold truncate">{idea.title}</h3>
                      <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-medium border ${priorityColor[idea.priority]}`}>{idea.priority}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-dark-hover border border-dark-border">
                        <span className="text-white font-medium">{idea.submitter.name}</span>
                        <span className="text-gold font-mono">{idea.submitter.empId}</span>
                      </div>
                      <span>{idea.department}</span>
                      <span>{idea.category}</span>
                      {idea.business_case && <span className="text-gold">💰 {idea.business_case.investment_required}</span>}
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    {idea.devops && idea.stage === 'development' && (
                      <div className="text-center min-w-[70px]">
                        <p className="text-lg font-serif font-bold text-cyan-400">{idea.devops.progress}%</p>
                        <p className="text-[10px] text-gray-500">Progress</p>
                      </div>
                    )}
                    {idea.roi && (
                      <div className="text-center min-w-[70px]">
                        <p className="text-lg font-serif font-bold text-emerald-400">{idea.roi.actual_roi}%</p>
                        <p className="text-[10px] text-gray-500">ROI</p>
                      </div>
                    )}
                    <div className="text-center min-w-[50px]">
                      <p className="text-lg font-serif font-bold text-gold">{idea.impact_score}</p>
                      <p className="text-[10px] text-gray-500">Score</p>
                    </div>
                    <svg className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Expanded */}
              {isExpanded && (
                <div className="px-5 pb-5 border-t border-dark-border pt-5 space-y-5">
                  {/* Progress through stages */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-2">
                    {stages.map((s, i) => {
                      const stageIdx = stages.findIndex(st => st.id === idea.stage)
                      const isPast = i < stageIdx
                      const isCurrent = i === stageIdx
                      return (
                        <div key={s.id} className="flex items-center gap-1 shrink-0">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs ${isCurrent ? `border font-semibold ${s.color}` : isPast ? 'bg-green-500/10 text-green-400' : 'bg-dark-hover text-gray-600'}`}>
                            {isPast && <span>✓</span>}
                            <span>{s.icon}</span>
                            <span className="hidden sm:inline">{s.label}</span>
                          </div>
                          {i < stages.length - 1 && <span className={`text-xs ${isPast ? 'text-green-400' : 'text-gray-700'}`}>→</span>}
                        </div>
                      )
                    })}
                  </div>

                  {/* Business Case */}
                  {idea.business_case && (
                    <div className="p-4 rounded-xl bg-black border border-dark-border">
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">📋 Business Case</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div><p className="text-[10px] text-gray-500 mb-1">Investment Required</p><p className="text-sm font-bold text-gold">{idea.business_case.investment_required}</p></div>
                        <div><p className="text-[10px] text-gray-500 mb-1">Expected ROI</p><p className="text-sm font-bold text-green-400">{idea.business_case.expected_roi}</p></div>
                        <div><p className="text-[10px] text-gray-500 mb-1">Payback Period</p><p className="text-sm font-bold text-white">{idea.business_case.payback_period}</p></div>
                        <div><p className="text-[10px] text-gray-500 mb-1">Risk Level</p><p className={`text-sm font-bold ${idea.business_case.risk_level === 'Low' ? 'text-green-400' : idea.business_case.risk_level === 'Medium' ? 'text-gold' : 'text-red-400'}`}>{idea.business_case.risk_level}</p></div>
                      </div>
                    </div>
                  )}

                  {/* Leadership Decision */}
                  {idea.leadership && (
                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">👔 Leadership Decision</p>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-lg text-sm font-bold bg-green-500/20 text-green-400 border border-green-500/30">{idea.leadership.decision}</span>
                        <span className="text-sm text-white">{idea.leadership.decided_by}</span>
                        <span className="text-xs text-gray-500">{idea.leadership.decided_date}</span>
                      </div>
                      <p className="text-gray-400 text-xs italic">&ldquo;{idea.leadership.notes}&rdquo;</p>
                    </div>
                  )}

                  {/* DevOps Progress */}
                  {idea.devops && (
                    <div className="p-4 rounded-xl bg-black border border-dark-border">
                      <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-3">🔧 Development Progress</p>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
                        <div><p className="text-[10px] text-gray-500 mb-1">Sprint</p><p className="text-sm font-bold text-white">{idea.devops.sprint}</p></div>
                        <div><p className="text-[10px] text-gray-500 mb-1">Team Size</p><p className="text-sm font-bold text-white">{idea.devops.team_size} members</p></div>
                        <div><p className="text-[10px] text-gray-500 mb-1">Start Date</p><p className="text-sm font-bold text-white">{idea.devops.start_date}</p></div>
                        <div><p className="text-[10px] text-gray-500 mb-1">Target Date</p><p className="text-sm font-bold text-white">{idea.devops.target_date}</p></div>
                        <div><p className="text-[10px] text-gray-500 mb-1">Status</p><p className={`text-sm font-bold ${idea.devops.status === 'Deployed' ? 'text-green-400' : idea.devops.status === 'On Track' ? 'text-cyan-400' : 'text-orange-400'}`}>{idea.devops.status}</p></div>
                      </div>
                      <div className="h-3 bg-dark-border rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${idea.devops.progress === 100 ? 'bg-green-400' : 'bg-cyan-400'}`} style={{ width: `${idea.devops.progress}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{idea.devops.progress}% complete</p>
                    </div>
                  )}

                  {/* ROI Tracking */}
                  {idea.roi && (
                    <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">📊 ROI & Value Tracking</p>
                        <span className="text-[10px] text-gray-500">{idea.roi.months_tracked} months tracked</span>
                      </div>

                      {/* ROI Summary */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                        <div className="p-3 rounded-lg bg-black border border-dark-border text-center">
                          <p className="text-[10px] text-gray-500 mb-1">Revenue Impact</p>
                          <p className="text-sm font-bold text-green-400">{idea.roi.revenue_impact}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-black border border-dark-border text-center">
                          <p className="text-[10px] text-gray-500 mb-1">Cost Savings</p>
                          <p className="text-sm font-bold text-gold">{idea.roi.cost_savings}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-black border border-dark-border text-center">
                          <p className="text-[10px] text-gray-500 mb-1">Efficiency Gain</p>
                          <p className="text-sm font-bold text-cyan-400">{idea.roi.efficiency_gain}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-black border border-dark-border text-center">
                          <p className="text-[10px] text-gray-500 mb-1">Customer Impact</p>
                          <p className="text-sm font-bold text-purple-400">{idea.roi.customer_impact}</p>
                        </div>
                      </div>

                      {/* ROI Gauge */}
                      <div className="p-4 rounded-lg bg-black border border-dark-border mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">Actual ROI vs Target</span>
                          <span className="text-xs text-gray-500">Target: {idea.roi.target_roi}%</span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-4xl font-serif font-bold text-emerald-400">{idea.roi.actual_roi}%</span>
                          <span className="text-sm text-gray-500">ROI achieved</span>
                        </div>
                        <div className="h-3 bg-dark-border rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${Math.min((idea.roi.actual_roi / idea.roi.target_roi) * 100, 100)}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1">{Math.round((idea.roi.actual_roi / idea.roi.target_roi) * 100)}% of target achieved</p>
                      </div>

                      {/* Metric Cards */}
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Performance Metrics</p>
                      <div className="space-y-2">
                        {idea.roi.metrics.map((m) => (
                          <div key={m.label} className="flex items-center justify-between p-3 rounded-lg bg-black border border-dark-border">
                            <span className="text-xs text-white font-medium">{m.label}</span>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <span className="text-[10px] text-gray-500">Target: </span>
                                <span className="text-xs text-gray-400">{m.target}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-gray-500">Actual: </span>
                                <span className={`text-xs font-bold ${metricStatusColor[m.status]}`}>{m.actual}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${m.status === 'exceeded' ? 'bg-green-500/20 text-green-400' : m.status === 'on_track' ? 'bg-gold/20 text-gold' : 'bg-red-500/20 text-red-400'}`}>
                                {m.status === 'exceeded' ? '▲ Exceeded' : m.status === 'on_track' ? '● On Track' : '▼ At Risk'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
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
