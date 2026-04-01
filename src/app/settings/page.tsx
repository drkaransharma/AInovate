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
