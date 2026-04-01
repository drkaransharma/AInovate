'use client'

import { useState, useRef, useEffect } from 'react'
import AuthLayout from '@/components/AuthLayout'

const STAGES = [
  { id: 'empathize', label: 'Empathize', icon: '1', description: 'Understand users and their needs' },
  { id: 'define', label: 'Define', icon: '2', description: 'Frame the core problem' },
  { id: 'ideate', label: 'Ideate', icon: '3', description: 'Generate creative solutions' },
  { id: 'prototype', label: 'Prototype', icon: '4', description: 'Build quick prototypes' },
  { id: 'test', label: 'Test', icon: '5', description: 'Validate with real users' },
]

function CoFacilitatorContent() {
  const [context, setContext] = useState('')
  const [started, setStarted] = useState(false)
  const [currentStageIdx, setCurrentStageIdx] = useState(0)
  const [stageOutputs, setStageOutputs] = useState<Record<string, string>>({})
  const [streaming, setStreaming] = useState(false)
  const [currentOutput, setCurrentOutput] = useState('')
  const outputRef = useRef<HTMLDivElement>(null)

  const currentStage = STAGES[currentStageIdx]

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [currentOutput])

  const startSession = () => {
    if (!context.trim()) return
    setStarted(true)
    runStage(0)
  }

  const runStage = async (stageIdx: number) => {
    const stage = STAGES[stageIdx]
    setCurrentStageIdx(stageIdx)
    setStreaming(true)
    setCurrentOutput('')

    // Build previous stages context
    const previousStages: Record<string, string> = {}
    for (let i = 0; i < stageIdx; i++) {
      const s = STAGES[i]
      if (stageOutputs[s.id]) {
        previousStages[s.id] = stageOutputs[s.id]
      }
    }

    try {
      const res = await fetch('/api/co-facilitator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: stage.id,
          context,
          previousStages,
        }),
      })

      if (!res.ok) {
        const errData = await res.json()
        setCurrentOutput(`Error: ${errData.error || 'Failed to run stage'}`)
        setStreaming(false)
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.text) {
                  fullText += parsed.text
                  setCurrentOutput(fullText)
                }
              } catch {
                // skip invalid JSON
              }
            }
          }
        }
      }

      // Save stage output
      setStageOutputs((prev) => ({ ...prev, [stage.id]: fullText }))
    } catch {
      setCurrentOutput('Error: Could not connect to AI service.')
    } finally {
      setStreaming(false)
    }
  }

  const nextStage = () => {
    if (currentStageIdx < STAGES.length - 1) {
      // Save current output before moving to next
      const updatedOutputs = { ...stageOutputs, [currentStage.id]: currentOutput }
      setStageOutputs(updatedOutputs)
      runStage(currentStageIdx + 1)
    }
  }

  const goToStage = (idx: number) => {
    if (idx <= currentStageIdx && !streaming) {
      setCurrentStageIdx(idx)
      setCurrentOutput(stageOutputs[STAGES[idx].id] || '')
    }
  }

  const resetSession = () => {
    setStarted(false)
    setContext('')
    setCurrentStageIdx(0)
    setStageOutputs({})
    setCurrentOutput('')
  }

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-4">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-gold text-sm">AI Academy</span>
          </div>
          <h1 className="text-4xl font-serif font-bold mb-3">AI Academy — Co-Facilitator</h1>
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border mt-4">
            <h2 className="text-base font-serif font-bold text-gold mb-2">What is the AI Academy Co-Facilitator?</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-3">
              The AI Academy is AInovate&apos;s flagship capability delivery — we empower your organisation&apos;s employees with hands-on innovation skills through AI-guided learning sessions. Rather than passive training, your teams actively solve real business challenges using structured Design Thinking methodology, guided step-by-step by our AI facilitator.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              {[
                { icon: '🎓', title: 'Upskill Teams', desc: 'Build problem-solving, critical thinking, and innovation capabilities across your workforce' },
                { icon: '🧠', title: 'Learn by Doing', desc: 'Employees solve real challenges from their own departments — not hypothetical case studies' },
                { icon: '📈', title: 'Measurable Impact', desc: 'Every session produces actionable prototypes and test plans that feed back into your idea pipeline' },
              ].map((item) => (
                <div key={item.title} className="p-3 rounded-xl bg-black border border-dark-border">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm font-semibold text-white mt-1">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-xs leading-relaxed">
              <span className="text-gold font-semibold">How it works:</span> Each session follows the 5-stage Design Thinking framework. The AI acts as an expert facilitator — asking the right questions, providing frameworks, generating ideas, and structuring outputs. Sessions can be run individually or as team workshops.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {['1. Empathize — Understand user needs', '2. Define — Frame the problem', '3. Ideate — Generate solutions', '4. Prototype — Plan builds', '5. Test — Validate ideas'].map((s) => (
                <span key={s} className="px-2.5 py-1 rounded-lg text-xs bg-gold/10 text-gold border border-gold/20">{s}</span>
              ))}
            </div>
          </div>
        </div>

        {!started ? (
          /* Context Input */
          <div className="max-w-2xl mx-auto">
            <div className="p-8 rounded-2xl bg-dark-card border border-dark-border">
              <h2 className="text-2xl font-serif font-bold mb-2">Start a Learning Session</h2>
              <p className="text-gray-400 mb-2">
                Describe a real challenge from your organisation. The AI will guide you through a complete Design Thinking session — building your problem-solving skills while producing actionable outputs.
              </p>
              <p className="text-xs text-gray-600 mb-6">
                💡 Tip: Use challenges from your own department for maximum learning impact. The AI adapts to your industry and context.
              </p>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="e.g., We need to redesign our mobile app onboarding to reduce drop-off rates. Currently 60% of users abandon the app during setup..."
                rows={6}
                className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all resize-none mb-6"
              />

              {/* Stage Preview */}
              <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                {STAGES.map((stage, i) => (
                  <div key={stage.id} className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/5 border border-gold/20">
                      <span className="text-gold text-xs font-bold">{stage.icon}</span>
                      <span className="text-gray-300 text-sm">{stage.label}</span>
                    </div>
                    {i < STAGES.length - 1 && (
                      <svg className="w-4 h-4 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={startSession}
                disabled={!context.trim()}
                className="w-full py-3 px-6 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold/20"
              >
                Begin Design Thinking Session
              </button>
            </div>
          </div>
        ) : (
          /* Active Session */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Stage Sidebar */}
            <div className="lg:col-span-1">
              <div className="p-4 rounded-2xl bg-dark-card border border-dark-border sticky top-24 space-y-2">
                {STAGES.map((stage, i) => {
                  const isActive = i === currentStageIdx
                  const isComplete = stageOutputs[stage.id] && i < currentStageIdx
                  const isFuture = i > currentStageIdx

                  return (
                    <button
                      key={stage.id}
                      onClick={() => goToStage(i)}
                      disabled={isFuture || streaming}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        isActive
                          ? 'bg-gold/10 border border-gold/30'
                          : isComplete
                          ? 'hover:bg-dark-hover cursor-pointer'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isActive
                          ? 'bg-gold text-black'
                          : isComplete
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-dark-border text-gray-500'
                      }`}>
                        {isComplete ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          stage.icon
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${isActive ? 'text-gold' : 'text-gray-300'}`}>
                          {stage.label}
                        </p>
                        <p className="text-[11px] text-gray-500">{stage.description}</p>
                      </div>
                    </button>
                  )
                })}

                <div className="pt-3 border-t border-dark-border mt-3">
                  <button
                    onClick={resetSession}
                    className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-dark-hover transition-colors"
                  >
                    Start New Session
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden">
                {/* Stage Header */}
                <div className="p-6 border-b border-dark-border bg-gradient-to-r from-gold/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gold text-black flex items-center justify-center font-bold font-serif">
                        {currentStage.icon}
                      </div>
                      <div>
                        <h2 className="text-xl font-serif font-bold">{currentStage.label}</h2>
                        <p className="text-gray-400 text-sm">{currentStage.description}</p>
                      </div>
                    </div>
                    <span className="text-gray-500 text-sm">
                      Stage {currentStageIdx + 1} of {STAGES.length}
                    </span>
                  </div>
                </div>

                {/* Output */}
                <div ref={outputRef} className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                  {currentOutput ? (
                    <div className={`prose prose-invert max-w-none whitespace-pre-wrap text-gray-300 leading-relaxed ${streaming ? 'streaming-cursor' : ''}`}>
                      {currentOutput}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[400px]">
                      <div className="text-center">
                        <svg className="animate-spin h-8 w-8 text-gold mx-auto mb-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <p className="text-gray-500 font-serif">AI is preparing the {currentStage.label} stage...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-dark-border flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {streaming ? 'AI is thinking...' : 'Stage complete'}
                  </span>
                  {!streaming && currentStageIdx < STAGES.length - 1 && (
                    <button
                      onClick={nextStage}
                      className="px-6 py-2.5 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light transition-all flex items-center gap-2"
                    >
                      Next: {STAGES[currentStageIdx + 1].label}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                  {!streaming && currentStageIdx === STAGES.length - 1 && (
                    <div className="flex items-center gap-2 text-green-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-serif font-bold">Session Complete</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

export default function CoFacilitatorPage() {
  return (
    <AuthLayout>
      <CoFacilitatorContent />
    </AuthLayout>
  )
}
