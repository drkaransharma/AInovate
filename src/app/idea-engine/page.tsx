'use client'

import { useState, useEffect } from 'react'
import AuthLayout from '@/components/AuthLayout'
import { useWorkspace } from '@/lib/workspace-context'
import { DataSourcesPanel, DataSourcesBadge } from '@/components/DataSources'
import { ScoreBreakdownPanel } from '@/components/ScoreBreakdown'
import { DataInsightsPanel } from '@/components/DataInsights'

const departments = [
  'Engineering', 'Product', 'Marketing', 'Sales', 'Operations',
  'Finance', 'HR', 'Customer Success', 'Design', 'Research',
]

interface Idea {
  id: string
  title: string
  description: string
  department: string
  category: string
  priority: string
  impact_score: number
  ai_summary: string
  created_at: string
}

const priorityColor: Record<string, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  High: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Medium: 'bg-gold/20 text-gold border-gold/30',
  Low: 'bg-green-500/20 text-green-400 border-green-500/30',
}

const priorityExplanation: Record<string, string> = {
  Critical: 'Addresses an urgent business need with high revenue impact, competitive advantage, or risk mitigation. Requires immediate attention.',
  High: 'Strong strategic alignment with significant potential for growth, efficiency, or customer satisfaction improvement.',
  Medium: 'Valuable improvement that enhances operations or experience but is not time-sensitive. Good for quarterly planning.',
  Low: 'Nice-to-have enhancement with modest impact. Can be scheduled when resources allow.',
}

function getScoreBreakdown(score: number) {
  if (score >= 90) return { label: 'Exceptional', color: 'text-green-400', desc: 'Transformative potential — addresses critical business needs with clear ROI and broad organizational impact.' }
  if (score >= 75) return { label: 'Strong', color: 'text-green-300', desc: 'High strategic value — significant potential to improve operations, revenue, or competitive positioning.' }
  if (score >= 60) return { label: 'Promising', color: 'text-gold', desc: 'Solid business case — meaningful improvement with moderate implementation complexity.' }
  if (score >= 40) return { label: 'Moderate', color: 'text-orange-400', desc: 'Has merit but limited scope — may need further refinement to increase impact.' }
  return { label: 'Exploratory', color: 'text-gray-400', desc: 'Early-stage concept — needs validation and more detailed business case development.' }
}

function IdeaEngineContent() {
  const { workspaceId } = useWorkspace()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [department, setDepartment] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<Idea | null>(null)
  const [error, setError] = useState('')
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [ideasLoading, setIdeasLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  const fetchIdeas = async () => {
    if (!workspaceId) return
    try {
      const res = await fetch(`/api/ideas?workspace_id=${workspaceId}`)
      const data = await res.json()
      setIdeas(Array.isArray(data) ? data : [])
    } catch {
      setIdeas([])
    } finally {
      setIdeasLoading(false)
    }
  }

  useEffect(() => {
    if (workspaceId) fetchIdeas()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId])

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
      // Refresh ideas list
      fetchIdeas()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Module Definition */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-4">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="text-gold text-sm">AI-Powered</span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-3">AI Idea Engine</h1>
          <div className="p-6 rounded-2xl bg-dark-card border border-dark-border mb-6">
            <h2 className="text-lg font-serif font-bold text-gold mb-3">What is the AI Idea Engine?</h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              The AI Idea Engine is your organisation&apos;s innovation capture system. Anyone in your workspace can submit ideas in plain language — no templates, no forms, no bureaucracy. Our AI instantly analyzes each idea and provides:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { icon: '🏷️', title: 'Auto-Category', desc: 'Classifies into 8 innovation categories' },
                { icon: '🎯', title: 'Priority Score', desc: 'Rates urgency: Low to Critical' },
                { icon: '📊', title: 'Impact Score', desc: '0-100 business impact rating' },
                { icon: '💡', title: 'AI Summary', desc: 'Concise value proposition' },
              ].map((item) => (
                <div key={item.title} className="p-3 rounded-xl bg-black border border-dark-border">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm font-semibold text-white mt-1">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit New Idea Toggle */}
        <div className="mb-8">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-3 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light transition-all shadow-lg shadow-gold/20 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M5 15l7-7 7 7" : "M12 4v16m8-8H4"} />
            </svg>
            {showForm ? 'Hide Form' : 'Submit New Idea'}
          </button>
        </div>

        {/* Form + Result */}
        {showForm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 p-6 rounded-2xl bg-dark-card border border-dark-border">
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-serif font-bold text-lg">New Idea</h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Idea Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., AI-Powered Customer Onboarding" required className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your idea — what problem does it solve, who benefits, how would it work?" required rows={5} className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
                <select value={department} onChange={(e) => setDepartment(e.target.value)} required className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all">
                  <option value="">Select department</option>
                  {departments.map((d) => (<option key={d} value={d} className="bg-black">{d}</option>))}
                </select>
              </div>
              {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
              <button type="submit" disabled={loading} className="w-full py-3 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                {loading ? 'AI is analyzing...' : 'Submit & Analyze with AI'}
              </button>
            </form>

            <div>
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span className="font-serif font-bold">Idea Analyzed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-black border border-dark-border">
                      <p className="text-gray-500 text-xs uppercase mb-1">Category</p>
                      <p className="text-gold font-semibold text-sm">{result.category}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-black border border-dark-border">
                      <p className="text-gray-500 text-xs uppercase mb-1">Priority</p>
                      <span className={`inline-flex px-2 py-0.5 rounded-lg text-xs font-medium border ${priorityColor[result.priority]}`}>{result.priority}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-black border border-dark-border">
                    <p className="text-gray-500 text-xs uppercase mb-1">Impact Score</p>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-serif font-bold text-gold">{result.impact_score}</span>
                      <span className="text-gray-500 text-sm">/100</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-gold/5 border border-gold/20">
                    <p className="text-gray-300 text-sm leading-relaxed">{result.ai_summary}</p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-6 rounded-xl border border-dashed border-dark-border">
                  <div className="text-center">
                    <p className="text-gray-500 font-serif">AI analysis will appear here</p>
                    <p className="text-gray-600 text-sm mt-1">Submit an idea to get started</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* All Ideas List */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-serif font-bold">All Ideas ({ideas.length})</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="w-2 h-2 rounded-full bg-red-400" /> Critical
              <span className="w-2 h-2 rounded-full bg-orange-400 ml-2" /> High
              <span className="w-2 h-2 rounded-full bg-gold ml-2" /> Medium
              <span className="w-2 h-2 rounded-full bg-green-400 ml-2" /> Low
            </div>
          </div>

          {ideasLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 rounded-2xl bg-dark-card border border-dark-border animate-pulse">
                  <div className="h-5 bg-dark-border rounded w-1/3 mb-3" />
                  <div className="h-4 bg-dark-border rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : ideas.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-dark-border">
              <p className="text-gray-400 font-serif text-lg">No ideas yet</p>
              <p className="text-gray-600 text-sm mt-1">Submit your first idea above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {ideas.map((idea) => {
                const isExpanded = expandedId === idea.id
                const scoreInfo = getScoreBreakdown(idea.impact_score)
                return (
                  <div
                    key={idea.id}
                    className={`rounded-2xl bg-dark-card border transition-all cursor-pointer ${isExpanded ? 'border-gold/40' : 'border-dark-border hover:border-gold/20'}`}
                    onClick={() => setExpandedId(isExpanded ? null : idea.id)}
                  >
                    {/* Summary Row */}
                    <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="font-serif font-bold text-lg truncate">{idea.title}</h3>
                          <span className={`shrink-0 inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium border ${priorityColor[idea.priority] || 'text-gray-400 border-dark-border'}`}>
                            {idea.priority}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                          <span className="px-2 py-1 rounded-md bg-gold/10 text-gold border border-gold/20">{idea.category}</span>
                          <span>{idea.department}</span>
                          <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                          <DataSourcesBadge />
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <span className="text-2xl font-serif font-bold text-gold">{idea.impact_score}</span>
                          <p className={`text-xs font-medium ${scoreInfo.color}`}>{scoreInfo.label}</p>
                        </div>
                        <svg className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    {isExpanded && (
                      <div className="px-6 pb-6 border-t border-dark-border pt-5 space-y-5">
                        {/* AI Summary */}
                        <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
                          <p className="text-gold text-xs uppercase tracking-wider font-semibold mb-2">AI Summary</p>
                          <p className="text-gray-300 leading-relaxed">{idea.ai_summary}</p>
                        </div>

                        {/* ERP + Sentiment Insights */}
                        <DataInsightsPanel title={idea.title} category={idea.category} department={idea.department} score={idea.impact_score} />

                        {/* Data Sources */}
                        <DataSourcesPanel />

                        {/* Description */}
                        <div>
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Full Description</p>
                          <p className="text-gray-400 text-sm leading-relaxed">{idea.description}</p>
                        </div>

                        {/* Score Breakdown */}
                        <ScoreBreakdownPanel score={idea.impact_score} title={idea.title} />

                        {/* Priority + Classification */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-black border border-dark-border">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Why {idea.priority}?</p>
                            <span className={`inline-flex px-2.5 py-1 rounded-lg text-sm font-medium border mb-2 ${priorityColor[idea.priority]}`}>
                              {idea.priority} Priority
                            </span>
                            <p className="text-gray-500 text-xs leading-relaxed">{priorityExplanation[idea.priority]}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-black border border-dark-border">
                            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Classification</p>
                            <div className="space-y-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Category</p>
                                <span className="px-2.5 py-1 rounded-lg text-sm bg-gold/10 text-gold border border-gold/20">{idea.category}</span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Department</p>
                                <span className="text-sm text-white">{idea.department}</span>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Submitted</p>
                                <span className="text-sm text-white">{new Date(idea.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
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
