'use client'

import { useState } from 'react'
import AuthLayout from '@/components/AuthLayout'
import { useWorkspace } from '@/lib/workspace-context'

interface SentimentResult {
  sentiment_score: number
  sentiment_label: string
  inclusion_risk: string
  inclusion_details: string
  recommendation: string
  key_themes: string[]
  emotional_tone: string
}

function SentimentContent() {
  const { workspaceId } = useWorkspace()
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SentimentResult | null>(null)
  const [error, setError] = useState('')

  const handleAnalyze = async () => {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, workspace_id: workspaceId }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to analyze')
      }

      const data = await res.json()
      setResult(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (score: number) => {
    if (score >= 0.5) return 'text-green-400'
    if (score >= 0.1) return 'text-green-300'
    if (score > -0.1) return 'text-gray-400'
    if (score > -0.5) return 'text-orange-400'
    return 'text-red-400'
  }

  const getSentimentBarPosition = (score: number) => {
    return ((score + 1) / 2) * 100
  }

  const riskColor: Record<string, string> = {
    None: 'bg-green-500/20 text-green-400 border-green-500/30',
    Low: 'bg-gold/20 text-gold border-gold/30',
    Medium: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    High: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  return (
    <>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-4">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-gold text-sm">AI Analysis</span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-3">Sentiment Pulse</h1>
          <p className="text-gray-400 text-lg">
            Analyze any text for sentiment, inclusion risk, and get AI-powered recommendations.
          </p>
        </div>

        {/* Input */}
        <div className="mb-8">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste any text here — meeting notes, survey responses, feedback, communications, policy drafts..."
            rows={8}
            className="w-full px-4 py-3 bg-dark-card border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-gray-600 text-sm">{text.length} characters</span>
            <button
              onClick={handleAnalyze}
              disabled={loading || !text.trim()}
              className="px-6 py-2.5 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Sentiment'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm mb-8">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Sentiment Score */}
            <div className="p-8 rounded-2xl bg-dark-card border border-dark-border">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="text-center sm:text-left">
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Sentiment Score</p>
                  <p className={`text-5xl font-serif font-bold ${getSentimentColor(result.sentiment_score)}`}>
                    {result.sentiment_score > 0 ? '+' : ''}{result.sentiment_score.toFixed(2)}
                  </p>
                  <p className="text-gray-400 mt-1">{result.sentiment_label}</p>
                </div>
                <div className="flex-1">
                  <div className="relative h-4 bg-gradient-to-r from-red-500 via-gray-500 to-green-500 rounded-full">
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg border-2 border-dark-card transition-all duration-500"
                      style={{ left: `calc(${getSentimentBarPosition(result.sentiment_score)}% - 12px)` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>-1.0 Negative</span>
                    <span>0 Neutral</span>
                    <span>+1.0 Positive</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid: Inclusion Risk + Emotional Tone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Inclusion Risk</p>
                <span className={`inline-flex px-3 py-1.5 rounded-xl text-sm font-semibold border ${riskColor[result.inclusion_risk] || 'text-gray-400'}`}>
                  {result.inclusion_risk}
                </span>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  {result.inclusion_details}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-dark-card border border-dark-border">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-3">Emotional Tone</p>
                <p className="text-2xl font-serif font-bold text-gold mb-3">{result.emotional_tone}</p>
                <div className="flex flex-wrap gap-2">
                  {result.key_themes?.map((theme, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-gold/10 text-gold text-xs border border-gold/20">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-6 rounded-2xl bg-gold/5 border border-gold/20">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-gold text-xs uppercase tracking-wider font-semibold">AI Recommendation</p>
              </div>
              <p className="text-gray-300 leading-relaxed">{result.recommendation}</p>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default function SentimentPage() {
  return (
    <AuthLayout>
      <SentimentContent />
    </AuthLayout>
  )
}
