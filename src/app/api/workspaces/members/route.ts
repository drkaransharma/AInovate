import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const workspace_id = new URL(req.url).searchParams.get('workspace_id')
    if (!workspace_id) return NextResponse.json({ error: 'workspace_id required' }, { status: 400 })

    // RLS ensures only workspace members can read
    const { data, error } = await supabase
      .from('workspace_members')
      .select('id, role, joined_at, user_id, profiles(full_name, avatar_url)')
      .eq('workspace_id', workspace_id)
      .order('joined_at', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const members = (data || []).map((m: any) => ({
      id: m.id,
      user_id: m.user_id,
      role: m.role,
      joined_at: m.joined_at,
      full_name: m.profiles?.full_name || 'Unknown',
      avatar_url: m.profiles?.avatar_url,
    }))

    return NextResponse.json(members)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
