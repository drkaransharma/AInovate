'use client'

import { useState } from 'react'
import AuthLayout from '@/components/AuthLayout'

type TabType = 'overview' | 'business_case' | 'development' | 'impact'

// ── Business Case Ideas (filtered from ideas that passed threshold) ──
const businessCases = [
  {
    id: '1', title: 'CRM Bot for Contract Renewals', department: 'Sales', priority: 'Critical', impact_score: 95,
    submitter: { name: 'Fatima Al-Sayed', empId: 'EMP-4003', role: 'Sales Director' },
    status: 'Approved',
    investment: 'AED 350,000', expected_roi: '420%', payback: '4 months', risk: 'Low',
    approved_by: 'CEO — Dr. Karan Sharma', approved_date: 'Feb 20, 2026',
    notes: 'Immediate revenue impact. Top priority for Q1.',
  },
  {
    id: '2', title: 'AI-Powered Customer Onboarding', department: 'Product', priority: 'Critical', impact_score: 92,
    submitter: { name: 'Aisha Rahman', empId: 'EMP-1042', role: 'Product Manager' },
    status: 'Approved',
    investment: 'AED 485,000', expected_roi: '340%', payback: '6 months', risk: 'Low',
    approved_by: 'CEO — Dr. Karan Sharma', approved_date: 'Jan 15, 2026',
    notes: 'Strategic priority. Fast-track implementation.',
  },
  {
    id: '3', title: 'Dynamic Pricing Engine', department: 'Finance', priority: 'Critical', impact_score: 91,
    submitter: { name: 'Nadia Hussain', empId: 'EMP-7004', role: 'Financial Analyst' },
    status: 'Approved',
    investment: 'AED 620,000', expected_roi: '280%', payback: '8 months', risk: 'Medium',
    approved_by: 'CFO — Mark Thompson', approved_date: 'Dec 8, 2025',
    notes: 'High revenue potential. Monitor competitor response.',
  },
  {
    id: '4', title: 'Predictive Inventory Management', department: 'Operations', priority: 'High', impact_score: 87,
    submitter: { name: 'Lisa Chen', empId: 'EMP-2031', role: 'Supply Chain Manager' },
    status: 'Under Review',
    investment: 'AED 410,000', expected_roi: '260%', payback: '10 months', risk: 'Medium',
    approved_by: '', approved_date: '',
    notes: 'Pending COO review. Scheduled for Mar 28 leadership meeting.',
  },
  {
    id: '5', title: 'Supply Chain Risk Monitor', department: 'Operations', priority: 'High', impact_score: 85,
    submitter: { name: 'Omar Hassan', empId: 'EMP-2015', role: 'Operations Lead' },
    status: 'Approved',
    investment: 'AED 280,000', expected_roi: '210%', payback: '9 months', risk: 'Medium',
    approved_by: 'COO — Lisa Chen', approved_date: 'Feb 5, 2026',
    notes: 'Critical for supply chain resilience.',
  },
  {
    id: '6', title: 'Automated Code Review Pipeline', department: 'Engineering', priority: 'High', impact_score: 83,
    submitter: { name: 'Mohammed Al-Rashid', empId: 'EMP-5002', role: 'Engineering Manager' },
    status: 'Approved',
    investment: 'AED 195,000', expected_roi: '180%', payback: '7 months', risk: 'Low',
    approved_by: 'CTO — Sarah Kim', approved_date: 'Mar 10, 2026',
    notes: 'Schedule for Q2. Assign DevOps team.',
  },
  {
    id: '7', title: 'Customer Feedback Loop Automation', department: 'Customer Success', priority: 'High', impact_score: 80,
    submitter: { name: 'Emily Zhang', empId: 'EMP-6008', role: 'CS Team Lead' },
    status: 'Under Review',
    investment: 'AED 165,000', expected_roi: '190%', payback: '6 months', risk: 'Low',
    approved_by: '', approved_date: '',
    notes: 'Strong business case. Awaiting VP Customer Success sign-off.',
  },
]

// ── Development Projects ──
const devProjects = [
  {
    id: 'd1', title: 'CRM Bot for Contract Renewals', department: 'Sales', investment: 'AED 350,000',
    sprint: 'Sprint 8', progress: 68, team_size: 5, start: 'Mar 1, 2026', target: 'Apr 30, 2026', status: 'On Track',
    milestones: [
      { name: 'Architecture & Design', progress: 100, date: 'Mar 8' },
      { name: 'Core Bot Engine', progress: 100, date: 'Mar 22' },
      { name: 'CRM Integration', progress: 85, date: 'Apr 5' },
      { name: 'Dynamic Pricing Logic', progress: 40, date: 'Apr 18' },
      { name: 'UAT & Deployment', progress: 0, date: 'Apr 30' },
    ],
    cost_spent: 'AED 238,000', cost_remaining: 'AED 112,000', budget_status: 'On Budget',
  },
  {
    id: 'd2', title: 'Supply Chain Risk Monitor', department: 'Operations', investment: 'AED 280,000',
    sprint: 'Sprint 6', progress: 42, team_size: 3, start: 'Feb 15, 2026', target: 'May 15, 2026', status: 'On Track',
    milestones: [
      { name: 'Data Pipeline Setup', progress: 100, date: 'Mar 1' },
      { name: 'Risk Scoring Model', progress: 75, date: 'Mar 20' },
      { name: 'Alert Engine', progress: 20, date: 'Apr 10' },
      { name: 'Dashboard & Reporting', progress: 0, date: 'Apr 28' },
      { name: 'Testing & Go-Live', progress: 0, date: 'May 15' },
    ],
    cost_spent: 'AED 117,600', cost_remaining: 'AED 162,400', budget_status: 'On Budget',
  },
  {
    id: 'd3', title: 'Automated Code Review Pipeline', department: 'Engineering', investment: 'AED 195,000',
    sprint: 'Sprint 2', progress: 15, team_size: 4, start: 'Mar 18, 2026', target: 'Jun 1, 2026', status: 'Just Started',
    milestones: [
      { name: 'Tool Selection & Setup', progress: 60, date: 'Mar 28' },
      { name: 'Rule Engine Configuration', progress: 0, date: 'Apr 15' },
      { name: 'CI/CD Integration', progress: 0, date: 'May 5' },
      { name: 'Team Training & Rollout', progress: 0, date: 'May 25' },
      { name: 'Monitoring & Optimization', progress: 0, date: 'Jun 1' },
    ],
    cost_spent: 'AED 29,250', cost_remaining: 'AED 165,750', budget_status: 'On Budget',
  },
]

// ── ROI / Impact Meter Projects ──
const roiProjects = [
  {
    id: 'r1', title: 'AI-Powered Customer Onboarding', department: 'Product', investment: 'AED 485,000',
    deployed_date: 'Mar 15, 2026', months_live: 3,
    actual_roi: 312, target_roi: 340,
    revenue_impact: '+AED 1.2M ARR', cost_savings: 'AED 340K/year', efficiency_gain: '42% faster onboarding', customer_impact: 'NPS +18 points',
    metrics: [
      { label: 'Support Tickets Reduced', target: '40%', actual: '37%', progress: 92, status: 'on_track' },
      { label: 'Onboarding Time', target: '7 days', actual: '6.2 days', progress: 112, status: 'exceeded' },
      { label: 'Customer Satisfaction', target: '4.5/5', actual: '4.7/5', progress: 104, status: 'exceeded' },
      { label: 'Revenue per Customer', target: '+15%', actual: '+12%', progress: 80, status: 'on_track' },
      { label: 'Churn Rate Reduction', target: '-25%', actual: '-31%', progress: 124, status: 'exceeded' },
    ],
    trend: [65, 120, 180, 245, 290, 312],
  },
  {
    id: 'r2', title: 'Dynamic Pricing Engine', department: 'Finance', investment: 'AED 620,000',
    deployed_date: 'Feb 28, 2026', months_live: 4,
    actual_roi: 245, target_roi: 280,
    revenue_impact: '+AED 2.8M ARR', cost_savings: 'AED 180K/year', efficiency_gain: '3.2x pricing iterations', customer_impact: 'Win rate +8%',
    metrics: [
      { label: 'Revenue Uplift', target: '+18%', actual: '+14%', progress: 78, status: 'on_track' },
      { label: 'Price Optimization Speed', target: 'Real-time', actual: 'Real-time', progress: 100, status: 'exceeded' },
      { label: 'Deal Win Rate', target: '+10%', actual: '+8%', progress: 80, status: 'on_track' },
      { label: 'Margin Improvement', target: '+5%', actual: '+6.2%', progress: 124, status: 'exceeded' },
    ],
    trend: [30, 85, 140, 190, 225, 245],
  },
]

const statusColor: Record<string, string> = {
  exceeded: 'bg-green-500/20 text-green-400 border-green-500/30',
  on_track: 'bg-gold/20 text-gold border-gold/30',
  at_risk: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  behind: 'bg-red-500/20 text-red-400 border-red-500/30',
}

function PipelineContent() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'business_case', label: 'Business Cases', icon: '📋' },
    { id: 'development', label: 'Development', icon: '🔧' },
    { id: 'impact', label: 'ROI / Impact Meter', icon: '🎯' },
  ]

  const totalInvested = 485000 + 620000 + 350000 + 280000 + 195000
  const totalReturns = 1200000 + 2800000 + 340000 + 180000

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-4">
          <span className="text-gold text-sm">🎯 Impact Meter</span>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-3">Innovation Pipeline &amp; Impact Meter</h1>
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
          <h2 className="text-base font-serif font-bold text-gold mb-2">What is the Impact Meter?</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            The Impact Meter tracks every idea that passed the scoring threshold through its full lifecycle — from business case and leadership approval, through development with cost tracking and project timelines, to live ROI measurement with real performance metrics. This is where innovation investment becomes measurable business value.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/30' : 'text-gray-400 hover:text-white hover:bg-dark-hover'}`}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW ═══ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { label: 'Business Cases', value: businessCases.length, color: 'text-gold' },
              { label: 'Approved', value: businessCases.filter(b => b.status === 'Approved').length, color: 'text-green-400' },
              { label: 'In Development', value: devProjects.length, color: 'text-cyan-400' },
              { label: 'Live & Tracking', value: roiProjects.length, color: 'text-emerald-400' },
              { label: 'Total Invested', value: `AED ${(totalInvested / 1000000).toFixed(1)}M`, color: 'text-gold' },
              { label: 'Total Returns', value: `AED ${(totalReturns / 1000000).toFixed(1)}M`, color: 'text-green-400' },
            ].map(kpi => (
              <div key={kpi.label} className="p-4 rounded-2xl bg-dark-card border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{kpi.label}</p>
                <p className={`text-xl font-serif font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Funnel */}
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
            <h3 className="text-sm font-serif font-bold mb-4">Innovation Funnel</h3>
            <div className="space-y-3">
              {[
                { label: 'Ideas Submitted', count: 84, width: '100%', color: 'bg-blue-400' },
                { label: 'Passed Threshold (75+)', count: 12, width: '14%', color: 'bg-purple-400' },
                { label: 'Business Case Created', count: 7, width: '8%', color: 'bg-gold' },
                { label: 'Leadership Approved', count: 5, width: '6%', color: 'bg-green-400' },
                { label: 'In Development', count: 3, width: '4%', color: 'bg-cyan-400' },
                { label: 'Live & Measuring ROI', count: 2, width: '2.5%', color: 'bg-emerald-400' },
              ].map(step => (
                <div key={step.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{step.label}</span>
                    <span className="text-xs font-bold text-white">{step.count}</span>
                  </div>
                  <div className="h-6 bg-dark-border rounded-lg overflow-hidden">
                    <div className={`h-full ${step.color} rounded-lg flex items-center px-2 transition-all`} style={{ width: step.width, minWidth: '40px' }}>
                      <span className="text-[10px] font-bold text-black">{step.count}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ROI Summary */}
          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-sm font-serif font-bold mb-4 text-emerald-400">Portfolio Impact Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 mb-1">Total Revenue Impact</p>
                <p className="text-lg font-serif font-bold text-green-400">+AED 4.0M</p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 mb-1">Cost Savings</p>
                <p className="text-lg font-serif font-bold text-gold">AED 520K/yr</p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 mb-1">Avg ROI Achieved</p>
                <p className="text-lg font-serif font-bold text-emerald-400">278%</p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 mb-1">Avg Payback</p>
                <p className="text-lg font-serif font-bold text-white">5.8 months</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BUSINESS CASES ═══ */}
      {activeTab === 'business_case' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-serif font-bold">Business Cases ({businessCases.length})</h2>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30">✓ {businessCases.filter(b => b.status === 'Approved').length} Approved</span>
              <span className="px-2 py-1 rounded-lg bg-gold/20 text-gold border border-gold/30">⏳ {businessCases.filter(b => b.status === 'Under Review').length} Under Review</span>
            </div>
          </div>
          {businessCases.map(bc => (
            <div key={bc.id} className="p-5 rounded-2xl bg-dark-card border border-dark-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif font-bold">{bc.title}</h3>
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border ${bc.status === 'Approved' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gold/20 text-gold border-gold/30'}`}>{bc.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="text-white font-medium">{bc.submitter.name}</span>
                    <span className="text-gold font-mono">{bc.submitter.empId}</span>
                    <span>{bc.department}</span>
                    <span>Score: <span className="text-gold font-bold">{bc.impact_score}</span></span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                <div className="p-3 rounded-xl bg-black border border-dark-border">
                  <p className="text-[10px] text-gray-500 mb-1">Investment</p>
                  <p className="text-sm font-bold text-gold">{bc.investment}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-dark-border">
                  <p className="text-[10px] text-gray-500 mb-1">Expected ROI</p>
                  <p className="text-sm font-bold text-green-400">{bc.expected_roi}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-dark-border">
                  <p className="text-[10px] text-gray-500 mb-1">Payback</p>
                  <p className="text-sm font-bold text-white">{bc.payback}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-dark-border">
                  <p className="text-[10px] text-gray-500 mb-1">Risk</p>
                  <p className={`text-sm font-bold ${bc.risk === 'Low' ? 'text-green-400' : 'text-gold'}`}>{bc.risk}</p>
                </div>
              </div>

              {bc.status === 'Approved' && (
                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-400 font-medium">✓ Approved by {bc.approved_by}</span>
                    <span className="text-gray-500">on {bc.approved_date}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 italic">&ldquo;{bc.notes}&rdquo;</p>
                </div>
              )}
              {bc.status === 'Under Review' && (
                <div className="p-3 rounded-xl bg-gold/5 border border-gold/20">
                  <p className="text-[11px] text-gray-400 italic">⏳ {bc.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ═══ DEVELOPMENT ═══ */}
      {activeTab === 'development' && (
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-bold">In Development ({devProjects.length})</h2>
          {devProjects.map(proj => (
            <div key={proj.id} className="p-5 rounded-2xl bg-dark-card border border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg">{proj.title}</h3>
                  <p className="text-xs text-gray-500">{proj.department} • {proj.sprint} • Team: {proj.team_size} members</p>
                </div>
                <span className={`px-3 py-1 rounded-xl text-sm font-bold ${proj.status === 'On Track' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>{proj.status}</span>
              </div>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400">Overall Progress</span>
                  <span className="text-sm font-bold text-gold">{proj.progress}%</span>
                </div>
                <div className="h-4 bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full transition-all flex items-center justify-end pr-2" style={{ width: `${proj.progress}%`, minWidth: '30px' }}>
                    <span className="text-[9px] font-bold text-black">{proj.progress}%</span>
                  </div>
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-5">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Milestones</p>
                <div className="space-y-2">
                  {proj.milestones.map(m => (
                    <div key={m.name} className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${m.progress === 100 ? 'bg-green-500/20 text-green-400' : m.progress > 0 ? 'bg-gold/20 text-gold' : 'bg-dark-border text-gray-600'}`}>
                        {m.progress === 100 ? '✓' : m.progress > 0 ? '◐' : '○'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-xs ${m.progress === 100 ? 'text-gray-500 line-through' : 'text-white'}`}>{m.name}</span>
                          <span className="text-[10px] text-gray-500">{m.date}</span>
                        </div>
                        <div className="h-1 bg-dark-border rounded-full overflow-hidden mt-1">
                          <div className={`h-full rounded-full ${m.progress === 100 ? 'bg-green-400' : 'bg-gold'}`} style={{ width: `${m.progress}%` }} />
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 w-8 text-right shrink-0">{m.progress}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost & Timeline */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-black border border-dark-border">
                  <p className="text-[10px] text-gray-500 mb-1">Budget</p>
                  <p className="text-sm font-bold text-gold">{proj.investment}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-dark-border">
                  <p className="text-[10px] text-gray-500 mb-1">Spent</p>
                  <p className="text-sm font-bold text-white">{proj.cost_spent}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-dark-border">
                  <p className="text-[10px] text-gray-500 mb-1">Timeline</p>
                  <p className="text-xs font-medium text-white">{proj.start} → {proj.target}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-dark-border">
                  <p className="text-[10px] text-gray-500 mb-1">Budget Status</p>
                  <p className="text-sm font-bold text-green-400">{proj.budget_status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ ROI / IMPACT METER ═══ */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          <h2 className="text-xl font-serif font-bold">ROI / Impact Meter</h2>
          <p className="text-gray-500 text-sm -mt-4">Live performance tracking for deployed innovations. All metrics are measured against pre-defined targets from the business case.</p>

          {/* Portfolio Summary */}
          <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
            <h3 className="text-sm font-serif font-bold text-emerald-400 mb-3">Portfolio Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 mb-1">Revenue Impact</p>
                <p className="text-xl font-serif font-bold text-green-400">+AED 4.0M</p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 mb-1">Cost Savings</p>
                <p className="text-xl font-serif font-bold text-gold">AED 520K/yr</p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 mb-1">Total Invested</p>
                <p className="text-xl font-serif font-bold text-white">AED 1.1M</p>
              </div>
              <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                <p className="text-[10px] text-gray-500 mb-1">Avg ROI</p>
                <p className="text-xl font-serif font-bold text-emerald-400">278%</p>
              </div>
            </div>
          </div>

          {/* Individual Project ROI */}
          {roiProjects.map(proj => (
            <div key={proj.id} className="p-5 rounded-2xl bg-dark-card border border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg">{proj.title}</h3>
                  <p className="text-xs text-gray-500">{proj.department} • Deployed {proj.deployed_date} • {proj.months_live} months live</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-serif font-bold text-emerald-400">{proj.actual_roi}%</p>
                  <p className="text-[10px] text-gray-500">ROI achieved</p>
                </div>
              </div>

              {/* ROI Gauge */}
              <div className="mb-5">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-400">ROI: {proj.actual_roi}% of {proj.target_roi}% target</span>
                  <span className="text-xs text-gray-500">{Math.round((proj.actual_roi / proj.target_roi) * 100)}% to target</span>
                </div>
                <div className="h-4 bg-dark-border rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full" style={{ width: `${Math.min((proj.actual_roi / proj.target_roi) * 100, 100)}%` }} />
                </div>
              </div>

              {/* Impact KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                  <p className="text-[10px] text-gray-500 mb-1">Revenue</p>
                  <p className="text-sm font-bold text-green-400">{proj.revenue_impact}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                  <p className="text-[10px] text-gray-500 mb-1">Cost Savings</p>
                  <p className="text-sm font-bold text-gold">{proj.cost_savings}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                  <p className="text-[10px] text-gray-500 mb-1">Efficiency</p>
                  <p className="text-sm font-bold text-cyan-400">{proj.efficiency_gain}</p>
                </div>
                <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
                  <p className="text-[10px] text-gray-500 mb-1">Customer</p>
                  <p className="text-sm font-bold text-purple-400">{proj.customer_impact}</p>
                </div>
              </div>

              {/* ROI Trend */}
              <div className="p-3 rounded-xl bg-black border border-dark-border mb-5">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">ROI Trend (Monthly %)</p>
                <div className="flex items-end gap-2 h-16">
                  {proj.trend.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[9px] text-gray-500">{val}%</span>
                      <div className="w-full bg-emerald-400/80 rounded-t" style={{ height: `${(val / Math.max(...proj.trend)) * 48}px` }} />
                      <span className="text-[9px] text-gray-600">M{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Individual Metrics */}
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Performance Metrics</p>
              <div className="space-y-2">
                {proj.metrics.map(m => (
                  <div key={m.label} className="flex items-center justify-between p-3 rounded-xl bg-black border border-dark-border">
                    <span className="text-xs text-white font-medium">{m.label}</span>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500">Target: </span>
                        <span className="text-xs text-gray-400">{m.target}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500">Actual: </span>
                        <span className={`text-xs font-bold ${m.status === 'exceeded' ? 'text-green-400' : 'text-gold'}`}>{m.actual}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${statusColor[m.status]}`}>
                        {m.status === 'exceeded' ? '▲ Exceeded' : '● On Track'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
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
