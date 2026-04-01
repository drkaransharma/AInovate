'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

export default function InvitePage() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()
  const supabase = createClient()
  const [invite, setInvite] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState('')
  const [needsAuth, setNeedsAuth] = useState(false)

  useEffect(() => {
    if (token) loadInvite()
    else setLoading(false)
  }, [token])

  const loadInvite = async () => {
    const { data } = await supabase
      .from('workspace_invites')
      .select('*, workspaces(name)')
      .eq('token', token)
      .is('accepted_at', null)
      .single()

    if (data) {
      setInvite(data)
      // Check if user is logged in
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) setNeedsAuth(true)
    }
    setLoading(false)
  }

  const handleAccept = async () => {
    setAccepting(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setNeedsAuth(true)
      setAccepting(false)
      return
    }

    // Add as workspace member
    const { error: memberErr } = await supabase
      .from('workspace_members')
      .insert({
        user_id: user.id,
        workspace_id: invite.workspace_id,
        role: invite.role,
      })

    if (memberErr) {
      setError(memberErr.message)
      setAccepting(false)
      return
    }

    // Mark invite as accepted
    await supabase
      .from('workspace_invites')
      .update({ accepted_at: new Date().toISOString() })
      .eq('id', invite.id)

    router.push('/dashboard')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading invite...</p>
      </div>
    )
  }

  if (!token || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Invalid or expired invite link.</p>
          <Link href="/login" className="text-gold hover:text-gold-light">Go to login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center mx-auto">
            <span className="text-black font-bold font-serif">Ai</span>
          </div>
        </div>

        <div className="p-8 rounded-2xl bg-dark-card border border-dark-border text-center">
          <h2 className="text-2xl font-serif font-bold mb-2">You&apos;re Invited</h2>
          <p className="text-gray-400 mb-6">
            You&apos;ve been invited to join <span className="text-gold font-semibold">{(invite as any).workspaces?.name}</span> as a <span className="text-white font-medium">{invite.role}</span>.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-4">
              {error}
            </div>
          )}

          {needsAuth ? (
            <div className="space-y-3">
              <p className="text-gray-500 text-sm">Sign in or create an account to accept this invite.</p>
              <Link
                href={`/login?redirect=/invite?token=${token}`}
                className="block w-full py-3 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light transition-all"
              >
                Sign In to Accept
              </Link>
              <Link
                href={`/register?redirect=/invite?token=${token}`}
                className="block w-full py-3 border border-dark-border text-gray-300 rounded-xl hover:bg-dark-hover transition-all"
              >
                Create Account
              </Link>
            </div>
          ) : (
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="w-full py-3 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 transition-all"
            >
              {accepting ? 'Joining...' : 'Accept Invite'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
