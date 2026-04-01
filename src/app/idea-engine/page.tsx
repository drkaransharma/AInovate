'use client'

import { useState } from 'react'
import AuthLayout from '@/components/AuthLayout'
import { useWorkspace } from '@/lib/workspace-context'

const departments = [
  'Engineering', 'Product', 'Marketing', 'Sales', 'Operations',
  'Finance', 'HR', 'Customer Success', 'Design', 'Research',
]

interface IdeaResult {
  id: string
  title: string
  description: string
  department: string
  category: string
  priority: string
  impact_score: number
  ai_summary: string
}

function IdeaEngineContent() {
  const { workspaceId } = useWorkspace()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<IdeaResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, department, workspace_id: workspaceId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit idea')
      }

      const data = await res.json()
      setResult(data)
      setTitle('')
      setDescription('')
      setDepartment('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const priorityColor: Record<string, string> = {
    Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    Medium: 'bg-gold/20 text-gold border-gold/30',
    Low: 'bg-green-500/20 text-green-400 border-green-500/30',
  }

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-4">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-gold text-sm">AI-Powered</span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-3">AI Idea Engine</h1>
          <p className="text-gray-400 text-lg">
            Describe your idea in plain language. Our AI will automatically analyze and tag it with
            category, priority, and impact score.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Idea Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., AI-Powered Customer Onboarding"
                required
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your idea in detail — what problem does it solve, who benefits, and how would it work?"
                required
                rows={6}
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
              >
                <option value="" className="text-gray-600">Select department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="bg-dark-card">{dept}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  AI is analyzing your idea...
                </span>
              ) : (
                'Submit & Analyze with AI'
              )}
            </button>
          </form>

          {/* Result */}
          <div>
            {!result && !loading && (
              <div className="h-full flex items-center justify-center p-8 rounded-2xl border border-dashed border-dark-border">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-serif text-lg">AI analysis will appear here</p>
                  <p className="text-gray-600 text-sm mt-1">Submit an idea to get started</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="p-8 rounded-2xl border border-gold/20 bg-gold/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-gold" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gold font-serif font-bold">Analyzing with AI</p>
                    <p className="text-gray-500 text-sm">Tagging category, priority & impact...</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 bg-dark-border rounded animate-pulse" style={{ width: `${90 - i * 15}%` }} />
                  ))}
                </div>
              </div>
            )}

            {result && (
              <div className="p-8 rounded-2xl border border-gold/30 bg-dark-card space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-serif font-bold text-green-400">Idea Submitted & Analyzed</p>
                    <p className="text-gray-500 text-sm">AI has tagged your idea</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-lg mb-1">{result.title}</h3>
                  <p className="text-gray-400 text-sm">{result.department}</p>
                </div>

                {/* AI Tags */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-black border border-dark-border">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Category</p>
                    <p className="text-gold font-semibold">{result.category}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-black border border-dark-border">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Priority</p>
                    <span className={`inline-flex px-2.5 py-0.5 rounded-lg text-sm font-medium border ${priorityColor[result.priority] || 'text-gray-400'}`}>
                      {result.priority}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-black border border-dark-border col-span-2">
                    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Impact Score</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-serif font-bold text-gold">{result.impact_score}</span>
                      <span className="text-gray-500">/100</span>
                      <div className="flex-1 h-2 bg-dark-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full transition-all duration-1000"
                          style={{ width: `${result.impact_score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">AI Summary</p>
                  <p className="text-gray-300 leading-relaxed">{result.ai_summary}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default function IdeaEnginePage() {
  return (
    <AuthLayout>
      <IdeaEngineContent />
    </AuthLayout>
  )
}
