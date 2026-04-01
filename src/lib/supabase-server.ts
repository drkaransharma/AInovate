import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from Server Component — ignore
          }
        },
      },
    }
  )
}

export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null
  return user
}

export async function getWorkspaceForUser(userId: string) {
  const supabase = await createServerSupabaseClient()

  const { data: membership } = await supabase
    .from('workspace_members')
    .select('workspace_id, role, workspaces(id, name, slug, industry)')
    .eq('user_id', userId)
    .limit(1)
    .single()

  if (!membership) return null

  return {
    workspace_id: membership.workspace_id,
    role: membership.role,
    workspace: (membership as any).workspaces,
  }
}
