'use client'

import { useState, useEffect } from 'react'
import AuthLayout from '@/components/AuthLayout'
import { useWorkspace } from '@/lib/workspace-context'
import { createClient } from '@/lib/supabase'

interface Member {
  id: string
  user_id: string
  role: string
  joined_at: string
  full_name: string
  avatar_url: string | null
}

interface Invite {
  id: string
  email: string
  role: string
  token: string
  created_at: string
}

const roleColors: Record<string, string> = {
  owner: 'bg-gold/20 text-gold border-gold/30',
  admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  member: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  viewer: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

function SettingsContent() {
  const { workspace, workspaceId, role } = useWorkspace()
  const supabase = createClient()
  const [members, setMembers] = useState<Member[]>([])
  const [invites, setInvites] = useState<Invite[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('member')
  const [inviting, setInviting] = useState(false)
  const [wsName, setWsName] = useState('')
  const [wsIndustry, setWsIndustry] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const isAdmin = role === 'owner' || role === 'admin'

  const fetchMembers = async () => {
    const res = await fetch(`/api/workspaces/members?workspace_id=${workspaceId}`)
    const data = await res.json()
    if (Array.isArray(data)) setMembers(data)
  }

  const fetchInvites = async () => {
    const res = await fetch(`/api/workspaces/invite?workspace_id=${workspaceId}`)
    const data = await res.json()
    if (Array.isArray(data)) setInvites(data)
  }

  useEffect(() => {
    if (workspace) {
      setWsName(workspace.name)
      setWsIndustry(workspace.industry || '')
    }
    if (workspaceId) {
      fetchMembers()
      fetchInvites()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace, workspaceId])

  const handleSaveWorkspace = async () => {
    if (!isAdmin) return
    setSaving(true)
    setMessage('')

    const { error } = await supabase
      .from('workspaces')
      .update({ name: wsName, industry: wsIndustry || null })
      .eq('id', workspaceId)

    if (error) {
      setMessage('Failed to update: ' + error.message)
    } else {
      setMessage('Workspace updated successfully')
    }
    setSaving(false)
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return
    setInviting(true)
    setMessage('')

    const res = await fetch('/api/workspaces/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole, workspace_id: workspaceId }),
    })

    if (res.ok) {
      setInviteEmail('')
      setMessage('Invite sent successfully')
      fetchInvites()
    } else {
      const data = await res.json()
      setMessage('Failed: ' + data.error)
    }
    setInviting(false)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-serif font-bold mb-3">Workspace Settings</h1>
        <p className="text-gray-400 text-lg">Manage your workspace and team members.</p>
      </div>

      {message && (
        <div className={`p-3 rounded-xl mb-6 text-sm ${message.includes('Failed') ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-green-500/10 border border-green-500/30 text-green-400'}`}>
          {message}
        </div>
      )}

      {/* Workspace Details */}
      <section className="p-6 rounded-2xl bg-dark-card border border-dark-border mb-8">
        <h2 className="text-xl font-serif font-bold mb-4">Workspace Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Workspace Name</label>
            <input
              type="text"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              disabled={!isAdmin}
              className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
            <input
              type="text"
              value={wsIndustry}
              onChange={(e) => setWsIndustry(e.target.value)}
              disabled={!isAdmin}
              placeholder="e.g., Technology, Healthcare"
              className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all disabled:opacity-50"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500">
              Slug: <span className="text-gray-400">{workspace?.slug}</span>
            </div>
            <div className="text-xs text-gray-500">
              Your role: <span className={`inline-flex px-2 py-0.5 rounded-md text-xs border ${roleColors[role || 'member']}`}>{role}</span>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={handleSaveWorkspace}
              disabled={saving}
              className="px-6 py-2.5 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 transition-all"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          )}
        </div>
      </section>

      {/* Members */}
      <section className="p-6 rounded-2xl bg-dark-card border border-dark-border mb-8">
        <h2 className="text-xl font-serif font-bold mb-4">
          Team Members <span className="text-gray-500 text-base font-normal">({members.length})</span>
        </h2>
        <div className="space-y-3">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 rounded-xl bg-black border border-dark-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">
                  {member.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{member.full_name}</p>
                  <p className="text-xs text-gray-500">Joined {new Date(member.joined_at).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium border ${roleColors[member.role]}`}>
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring Configuration */}
      <section className="p-6 rounded-2xl bg-dark-card border border-dark-border mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-serif font-bold">Scoring Configuration</h2>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-gold/20 text-gold border border-gold/30">Configured at Onboarding</span>
        </div>
        <p className="text-gray-500 text-sm mb-5">
          Impact scoring weights are calibrated during client onboarding based on your organisation&apos;s strategic priorities, industry benchmarks, and scientific assessment frameworks. These weights determine how each factor contributes to the final idea score.
        </p>

        {/* Scoring Methodology */}
        <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 mb-5">
          <p className="text-gold text-xs uppercase tracking-wider font-semibold mb-2">Scoring Methodology</p>
          <p className="text-gray-400 text-xs leading-relaxed">
            AInovate uses a <span className="text-white font-medium">Weighted Multi-Factor Composite Score</span> based on established innovation assessment science. Weights are derived from your organisation&apos;s OKRs, industry-specific impact multipliers, and validated frameworks including the Innovation Ambition Matrix (Nagji &amp; Tuff, HBR), Real-Win-Worth-it (3M), and Stage-Gate methodology (Cooper). During onboarding, our consultants calibrate these weights through stakeholder interviews and strategic alignment workshops.
          </p>
        </div>

        {/* Weight Sliders */}
        <div className="space-y-4">
          {[
            { key: 'strategic_alignment', icon: '🎯', label: 'Strategic Alignment', weight: 25, source: 'Knowledge Bank + ERP', rationale: 'How closely this idea aligns with stated organisational strategy, OKRs, and long-term vision.' },
            { key: 'revenue_potential', icon: '💰', label: 'Revenue Potential', weight: 20, source: 'CRM + Financial Data', rationale: 'Estimated revenue impact based on market sizing, deal pipeline data, and historical conversion rates.' },
            { key: 'customer_impact', icon: '👤', label: 'Customer Impact', weight: 20, source: 'CRM + Feedback Data', rationale: 'Expected improvement to NPS, CSAT, and customer retention based on feedback analysis.' },
            { key: 'feasibility', icon: '⚙️', label: 'Feasibility', weight: 15, source: 'HR + Resource Data', rationale: 'Implementation likelihood based on available skills, team capacity, and technology readiness.' },
            { key: 'innovation_index', icon: '🚀', label: 'Innovation Index', weight: 10, source: 'Industry Benchmarks', rationale: 'Novelty and differentiation score benchmarked against industry competitors and market trends.' },
            { key: 'resource_efficiency', icon: '📊', label: 'Resource Efficiency', weight: 10, source: 'ERP + HR Data', rationale: 'Cost-to-impact ratio considering implementation effort, timeline, and ongoing maintenance.' },
          ].map((factor) => (
            <div key={factor.key} className="p-4 rounded-xl bg-black border border-dark-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{factor.icon}</span>
                  <span className="text-sm font-semibold text-white">{factor.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-600">{factor.source}</span>
                  <div className="flex items-center gap-1 bg-dark-card border border-dark-border rounded-lg px-3 py-1">
                    <span className="text-lg font-serif font-bold text-gold">{factor.weight}</span>
                    <span className="text-xs text-gray-500">%</span>
                  </div>
                </div>
              </div>
              <div className="h-2 bg-dark-border rounded-full overflow-hidden mb-2">
                <div className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full" style={{ width: `${factor.weight * 4}%` }} />
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">{factor.rationale}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 p-3 rounded-xl bg-dark-hover border border-dark-border flex items-center justify-between">
          <span className="text-sm text-gray-400">Total Weight</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-serif font-bold text-gold">100</span>
            <span className="text-sm text-gray-500">%</span>
            <svg className="w-5 h-5 text-green-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Calibration Info */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
            <p className="text-[10px] text-gray-500 uppercase">Last Calibrated</p>
            <p className="text-sm font-semibold text-white">March 15, 2026</p>
          </div>
          <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
            <p className="text-[10px] text-gray-500 uppercase">Calibration Method</p>
            <p className="text-sm font-semibold text-white">Stakeholder Workshop</p>
          </div>
          <div className="p-3 rounded-xl bg-black border border-dark-border text-center">
            <p className="text-[10px] text-gray-500 uppercase">Next Review</p>
            <p className="text-sm font-semibold text-white">September 2026</p>
          </div>
        </div>

        <p className="text-[10px] text-gray-600 mt-4 leading-relaxed">
          To recalibrate scoring weights, contact your AInovate innovation consultant or raise a calibration request through the platform. Weights are typically reviewed bi-annually or when strategic priorities shift.
        </p>
      </section>

      {/* Data Source Integrations */}
      <section className="p-6 rounded-2xl bg-dark-card border border-dark-border mb-8">
        <h2 className="text-xl font-serif font-bold mb-2">Data Source Integrations</h2>
        <p className="text-gray-500 text-sm mb-5">
          AInovate analyses ideas using multiple data sources. Configure which systems feed into the AI scoring engine.
        </p>
        <div className="space-y-3">
          {[
            { name: 'Claude AI Engine', icon: '🤖', desc: 'Natural language analysis, auto-categorisation, and impact scoring powered by Anthropic Claude.', status: 'Connected', statusColor: 'bg-green-500/20 text-green-400 border-green-500/30', config: 'Model: Claude Sonnet 4 | Max Tokens: 500' },
            { name: 'ERP System', icon: '🏢', desc: 'Financial data, operational metrics, budgets, and resource allocation from your enterprise resource planning system.', status: 'Connected', statusColor: 'bg-green-500/20 text-green-400 border-green-500/30', config: 'Sync: Real-time | Last sync: 2 min ago' },
            { name: 'Organisation Knowledge Bank', icon: '📚', desc: 'Internal policies, strategy documents, innovation playbooks, and historical outcomes that inform AI decisions.', status: 'Connected', statusColor: 'bg-green-500/20 text-green-400 border-green-500/30', config: 'Documents: 847 indexed | Updated daily' },
            { name: 'CRM & Sales Data', icon: '📊', desc: 'Customer feedback, NPS scores, deal pipeline data, and market intelligence for customer-facing idea scoring.', status: 'Connected', statusColor: 'bg-green-500/20 text-green-400 border-green-500/30', config: 'Records: 12,450 | Pipeline: AED 8.2M' },
            { name: 'HR & People Analytics', icon: '👥', desc: 'Team capacity, skill inventories, department priorities, and workforce analytics for feasibility assessment.', status: 'Connected', statusColor: 'bg-green-500/20 text-green-400 border-green-500/30', config: 'Employees: 342 | Departments: 10' },
            { name: 'Industry Benchmarks', icon: '🌐', desc: 'External market data, competitor analysis, sector trends, and global innovation indices for contextual scoring.', status: 'Synced', statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30', config: 'Source: CB Insights, Gartner | Updated weekly' },
          ].map((source) => (
            <div key={source.name} className="p-4 rounded-xl bg-black border border-dark-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5">{source.icon}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{source.name}</h3>
                      <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium border ${source.statusColor}`}>
                        {source.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-1.5">{source.desc}</p>
                    <p className="text-[10px] text-gray-600 font-mono">{source.config}</p>
                  </div>
                </div>
                <button className="shrink-0 px-3 py-1.5 text-xs text-gray-400 border border-dark-border rounded-lg hover:text-white hover:border-gray-500 transition-colors">
                  Configure
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Invite Members */}
      {isAdmin && (
        <section className="p-6 rounded-2xl bg-dark-card border border-dark-border mb-8">
          <h2 className="text-xl font-serif font-bold mb-4">Invite Members</h2>
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
              placeholder="colleague@company.com"
              className="flex-1 px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-4 py-3 bg-black border border-dark-border rounded-xl text-white focus:outline-none focus:border-gold/50"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <button
              type="submit"
              disabled={inviting}
              className="px-6 py-3 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 transition-all whitespace-nowrap"
            >
              {inviting ? 'Sending...' : 'Send Invite'}
            </button>
          </form>

          {/* Pending Invites */}
          {invites.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-400 mb-3">Pending Invites</h3>
              <div className="space-y-2">
                {invites.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between p-3 rounded-xl bg-black border border-dark-border">
                    <div>
                      <p className="text-sm text-white">{inv.email}</p>
                      <p className="text-xs text-gray-500">Sent {new Date(inv.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium border ${roleColors[inv.role]}`}>
                      {inv.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  )
}

export default function SettingsPage() {
  return (
    <AuthLayout>
      <SettingsContent />
    </AuthLayout>
  )
}
