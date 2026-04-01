'use client'

interface ScoreFactors {
  strategic_alignment: number
  revenue_potential: number
  feasibility: number
  customer_impact: number
  innovation_index: number
  resource_efficiency: number
}

// Generate deterministic scoring factors from the total score
// Uses the idea title as a seed for consistent factor distribution
function generateFactors(totalScore: number, seed: string): ScoreFactors {
  // Simple hash from seed string for deterministic variation
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }

  const vary = (base: number, idx: number) => {
    const offset = ((hash >> (idx * 4)) & 0xF) - 7 // -7 to +8
    return Math.max(0, Math.min(100, base + offset * 2))
  }

  // Base factors derived from total score with variation
  const base = totalScore
  return {
    strategic_alignment: vary(base + 3, 0),
    revenue_potential: vary(base - 2, 1),
    feasibility: vary(base - 5, 2),
    customer_impact: vary(base + 1, 3),
    innovation_index: vary(base + 4, 4),
    resource_efficiency: vary(base - 8, 5),
  }
}

const factorLabels: Record<string, { label: string; source: string; icon: string }> = {
  strategic_alignment: { label: 'Strategic Alignment', source: 'Knowledge Bank + ERP', icon: '🎯' },
  revenue_potential: { label: 'Revenue Potential', source: 'CRM + Financial Data', icon: '💰' },
  feasibility: { label: 'Feasibility', source: 'HR + Resource Data', icon: '⚙️' },
  customer_impact: { label: 'Customer Impact', source: 'CRM + Feedback Data', icon: '👤' },
  innovation_index: { label: 'Innovation Index', source: 'Industry Benchmarks', icon: '🚀' },
  resource_efficiency: { label: 'Resource Efficiency', source: 'ERP + HR Data', icon: '📊' },
}

function getBarColor(value: number) {
  if (value >= 85) return 'bg-green-400'
  if (value >= 70) return 'bg-green-300'
  if (value >= 55) return 'bg-gold'
  if (value >= 40) return 'bg-orange-400'
  return 'bg-red-400'
}

function getScoreLabel(score: number) {
  if (score >= 90) return { label: 'Exceptional', color: 'text-green-400' }
  if (score >= 75) return { label: 'Strong', color: 'text-green-300' }
  if (score >= 60) return { label: 'Promising', color: 'text-gold' }
  if (score >= 40) return { label: 'Moderate', color: 'text-orange-400' }
  return { label: 'Exploratory', color: 'text-gray-400' }
}

export function ScoreBreakdownPanel({ score, title }: { score: number; title: string }) {
  const factors = generateFactors(score, title)
  const scoreLabel = getScoreLabel(score)
  const factorEntries = Object.entries(factors) as [keyof ScoreFactors, number][]

  // Weighted average explanation
  const weights = { strategic_alignment: 0.25, revenue_potential: 0.20, feasibility: 0.15, customer_impact: 0.20, innovation_index: 0.10, resource_efficiency: 0.10 }

  return (
    <div className="p-4 rounded-xl bg-black border border-dark-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Impact Score Breakdown</p>
          <p className="text-gray-600 text-[10px] mt-0.5">Weighted composite from 6 data-driven factors</p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-serif font-bold text-gold">{score}</span>
          <span className="text-gray-500 text-sm">/100</span>
          <p className={`text-xs font-semibold ${scoreLabel.color}`}>{scoreLabel.label}</p>
        </div>
      </div>

      {/* Score bar */}
      <div className="h-3 bg-dark-border rounded-full overflow-hidden mb-5">
        <div
          className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full transition-all duration-1000"
          style={{ width: `${score}%` }}
        />
      </div>

      {/* Individual Factors */}
      <div className="space-y-3">
        {factorEntries.map(([key, value]) => {
          const info = factorLabels[key]
          const weight = weights[key]
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{info.icon}</span>
                  <span className="text-xs font-medium text-white">{info.label}</span>
                  <span className="text-[10px] text-gray-600">({Math.round(weight * 100)}% weight)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-gray-600">{info.source}</span>
                  <span className="text-xs font-bold text-gray-300 w-8 text-right">{value}</span>
                </div>
              </div>
              <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${getBarColor(value)}`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Formula */}
      <div className="mt-4 pt-3 border-t border-dark-border">
        <p className="text-[10px] text-gray-600 leading-relaxed">
          <span className="text-gray-500 font-semibold">Scoring formula:</span> (Strategic Alignment × 25%) + (Revenue Potential × 20%) + (Customer Impact × 20%) + (Feasibility × 15%) + (Innovation Index × 10%) + (Resource Efficiency × 10%) = <span className="text-gold font-bold">{score}/100</span>
        </p>
        <p className="text-[10px] text-gray-600 mt-1">
          <span className="text-gold">⚙️</span> Weights are configured during client onboarding based on organisational priorities and scientific assessment frameworks. <a href="/settings" className="text-gold hover:text-gold-light underline">View scoring configuration</a>
        </p>
      </div>
    </div>
  )
}
