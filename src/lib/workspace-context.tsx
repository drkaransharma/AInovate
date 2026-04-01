'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

interface Workspace {
  id: string
  name: string
  slug: string
  industry: string | null
}

interface WorkspaceContextValue {
  user: User | null
  profile: { full_name: string; avatar_url: string | null } | null
  workspace: Workspace | null
  workspaceId: string | null
  role: string | null
  loading: boolean
  logout: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  user: null,
  profile: null,
  workspace: null,
  workspaceId: null,
  role: null,
  loading: true,
  logout: async () => {},
})

export function useWorkspace() {
  return useContext(WorkspaceContext)
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<{ full_name: string; avatar_url: string | null } | null>(null)
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadUserAndWorkspace()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        loadWorkspace(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
        setWorkspace(null)
        setRole(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserAndWorkspace() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setLoading(false)
      return
    }

    setUser(user)
    await loadWorkspace(user.id)
    setLoading(false)
  }

  async function loadWorkspace(userId: string) {
    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .single()

    if (profileData) setProfile(profileData)

    // Load first workspace membership
    const { data: membership } = await supabase
      .from('workspace_members')
      .select('workspace_id, role')
      .eq('user_id', userId)
      .limit(1)
      .single()

    if (!membership) return

    setRole(membership.role)

    // Load workspace details
    const { data: ws } = await supabase
      .from('workspaces')
      .select('id, name, slug, industry')
      .eq('id', membership.workspace_id)
      .single()

    if (ws) setWorkspace(ws)
  }

  async function logout() {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setWorkspace(null)
    setRole(null)
    router.push('/login')
    router.refresh()
  }

  return (
    <WorkspaceContext.Provider value={{
      user,
      profile,
      workspace,
      workspaceId: workspace?.id || null,
      role,
      loading,
      logout,
    }}>
      {children}
    </WorkspaceContext.Provider>
  )
}
