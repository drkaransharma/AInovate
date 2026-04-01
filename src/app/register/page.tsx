'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
  'Education', 'Energy', 'Media', 'Consulting', 'Other',
]

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [workspaceName, setWorkspaceName] = useState('')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    })

    if (authError || !authData.user) {
      setError(authError?.message || 'Failed to create account')
      setLoading(false)
      return
    }

    const userId = authData.user.id
    const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // 2. Create workspace
    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .insert({ name: workspaceName, slug: slug + '-' + Date.now().toString(36), industry })
      .select()
      .single()

    if (wsError || !workspace) {
      setError(wsError?.message || 'Failed to create workspace')
      setLoading(false)
      return
    }

    // 3. Add user as owner
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({ user_id: userId, workspace_id: workspace.id, role: 'owner' })

    if (memberError) {
      setError(memberError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
              <span className="text-black font-bold font-serif">Ai</span>
            </div>
            <span className="text-2xl font-serif font-bold text-gold">AInovate</span>
          </Link>
          <p className="text-gray-500 mt-2">Create your workspace</p>
        </div>

        <form onSubmit={handleRegister} className="p-8 rounded-2xl bg-dark-card border border-dark-border space-y-5">
          <h2 className="text-lg font-serif font-bold text-center mb-2">Your Account</h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Jane Doe"
              className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
              className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Min 6 characters"
              className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>

          <div className="pt-4 border-t border-dark-border">
            <h2 className="text-lg font-serif font-bold text-center mb-4">Your Workspace</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Organisation Name</label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
              placeholder="Acme Innovation Lab"
              className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
            >
              <option value="" className="text-gray-600">Select industry (optional)</option>
              {industries.map((ind) => (
                <option key={ind} value={ind} className="bg-black">{ind}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold/20"
          >
            {loading ? 'Creating workspace...' : 'Create Workspace & Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-gold hover:text-gold-light transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
