'use client'

interface InsightData {
  erp_signals: string[]
  customer_sentiment: { source: string; signal: string; sentiment: string }[]
  business_trigger: string
}

// Generate deterministic data insights based on idea title + category
function generateInsights(title: string, category: string, department: string, score: number): InsightData {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = ((hash << 5) - hash) + title.charCodeAt(i)
    hash |= 0
  }
  const pick = (arr: string[], idx: number) => arr[Math.abs((hash >> (idx * 3)) % arr.length)]

  const erpSignals: Record<string, string[]> = {
    'Customer Experience': [
      'Support ticket volume up 34% QoQ (ERP: Service Desk)',
      'Customer onboarding time avg 14.2 days vs 7-day target (ERP: CRM)',
      'First-response SLA breach rate at 22% (ERP: Helpdesk)',
    ],
    'Technology': [
      'System downtime cost AED 847K last quarter (ERP: IT Ops)',
      'Manual data entry consuming 1,200 hrs/month (ERP: Operations)',
      'Legacy system maintenance costs up 41% YoY (ERP: Finance)',
    ],
    'Revenue Growth': [
      'Contract renewal rate dropped to 72% from 89% (ERP: Sales)',
      'Average deal cycle increased 18 days YoY (ERP: CRM)',
      'Upsell conversion at 12% vs industry avg 23% (ERP: Revenue)',
    ],
    'Process Improvement': [
      'Process cycle time 3.2x industry benchmark (ERP: Operations)',
      'Error rate in manual processes at 8.4% (ERP: Quality)',
      'Employee time on admin tasks: 31% of workweek (ERP: HR)',
    ],
    'Cost Reduction': [
      'Supply chain disruptions cost AED 2.1M last year (ERP: Procurement)',
      'Inventory carrying cost 28% above target (ERP: Warehouse)',
      'Vendor payment delays averaging 12 days (ERP: Finance)',
    ],
    'Culture & People': [
      'Employee turnover rate 24% vs 15% industry avg (ERP: HR)',
      'Training completion rate at 43% (ERP: Learning)',
      'Internal promotion rate declined 18% YoY (ERP: HR)',
    ],
    'Product Innovation': [
      'Feature request backlog grew 67% in 6 months (ERP: Product)',
      'Competitor launched 3 similar features this quarter (ERP: Market Intel)',
      'R&D spend ratio at 8% vs 14% industry benchmark (ERP: Finance)',
    ],
    'Sustainability': [
      'Carbon footprint exceeded target by 23% (ERP: Facilities)',
      'Energy costs up AED 340K YoY (ERP: Finance)',
      'Sustainability compliance gaps in 4 regions (ERP: Compliance)',
    ],
  }

  const sentimentSources = [
    { source: 'Google Reviews', signal: pick(['Rating dropped to 3.8★ from 4.3★', 'Negative mentions up 45% in 90 days', '67% of 1-star reviews mention this issue'], 0), sentiment: score > 70 ? 'Negative trend detected' : 'Critical concern' },
    { source: 'Social Media (X/LinkedIn)', signal: pick(['Brand mentions with negative sentiment: 31%', 'Competitor comparison posts increasing 2.3x', 'Employee advocacy score declining on LinkedIn'], 1), sentiment: 'Monitoring' },
    { source: 'Customer Feedback Forms', signal: pick(['NPS dropped 12 points to 34', 'CSAT for this area: 3.1/5 (below 4.0 threshold)', '"Frustrated" keyword appeared in 28% of responses'], 2), sentiment: score > 80 ? 'Action required' : 'Watch listed' },
    { source: 'Support Tickets', signal: pick(['Related tickets: 847 in last 90 days', 'Avg resolution time: 4.7 days (SLA: 2 days)', 'Repeat contact rate: 34% for this category'], 3), sentiment: 'Escalated' },
    { source: 'App Store / Product Reviews', signal: pick(['Feature requested 234 times in reviews', '"Missing feature" cited in 18% of churned accounts', 'Competitor app rated 4.6★ vs our 3.9★ for this'], 4), sentiment: 'User demand signal' },
    { source: 'Sales Call Transcripts (AI)', signal: pick(['Objection pattern detected in 42% of lost deals', 'Prospect mention frequency: 3.2x per call avg', '"If only you had..." phrase detected 89 times'], 5), sentiment: 'Revenue signal' },
  ]

  const triggers: Record<string, string[]> = {
    'Customer Experience': [
      'AI detected recurring complaint pattern across 3 feedback channels',
      'ERP flagged SLA breach trend correlating with churn spike',
      'Cross-channel sentiment analysis revealed systematic service gap',
    ],
    'Technology': [
      'ERP operational data showed cost anomaly exceeding threshold',
      'AI pattern recognition identified automation opportunity from process logs',
      'System performance degradation correlated with revenue impact',
    ],
    'Revenue Growth': [
      'CRM pipeline analysis detected declining conversion trend',
      'AI identified revenue leakage pattern from contract data',
      'Competitive intelligence flagged market share risk signal',
    ],
    'Process Improvement': [
      'Process mining from ERP logs revealed bottleneck pattern',
      'AI benchmarked internal metrics against industry standards',
      'Cross-department workflow analysis identified redundancy',
    ],
    'Cost Reduction': [
      'ERP spend analytics flagged cost anomaly above threshold',
      'AI supply chain risk model triggered mitigation alert',
      'Procurement data revealed vendor consolidation opportunity',
    ],
    'Culture & People': [
      'HR analytics detected attrition risk pattern in key departments',
      'Employee pulse survey AI analysis revealed engagement decline',
      'Skills gap analysis from HR + project data identified training need',
    ],
    'Product Innovation': [
      'AI aggregated feature requests from 5 feedback channels',
      'Competitive monitoring detected market positioning gap',
      'Customer journey analysis revealed unmet need cluster',
    ],
    'Sustainability': [
      'Environmental monitoring data exceeded compliance thresholds',
      'AI cost-benefit analysis identified green transition ROI',
      'Regulatory tracker flagged upcoming compliance requirements',
    ],
  }

  const categorySignals = erpSignals[category] || erpSignals['Process Improvement']
  const categoryTriggers = triggers[category] || triggers['Process Improvement']

  return {
    erp_signals: categorySignals.slice(0, 2 + Math.abs(hash % 2)),
    customer_sentiment: sentimentSources.slice(0, 3 + Math.abs(hash % 2)),
    business_trigger: pick(categoryTriggers, 0),
  }
}

const sentimentColor: Record<string, string> = {
  'Negative trend detected': 'text-red-400 bg-red-500/10 border-red-500/30',
  'Critical concern': 'text-red-400 bg-red-500/10 border-red-500/30',
  'Action required': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'Escalated': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  'Monitoring': 'text-gold bg-gold/10 border-gold/30',
  'Watch listed': 'text-gold bg-gold/10 border-gold/30',
  'User demand signal': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'Revenue signal': 'text-purple-400 bg-purple-500/10 border-purple-500/30',
}

export function DataInsightsPanel({ title, category, department, score }: { title: string; category: string; department: string; score: number }) {
  const insights = generateInsights(title, category, department, score)

  return (
    <div className="space-y-4">
      {/* Business Trigger */}
      <div className="p-4 rounded-xl bg-gold/5 border border-gold/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">⚡</span>
          <p className="text-gold text-xs uppercase tracking-wider font-semibold">Idea Trigger</p>
        </div>
        <p className="text-gray-300 text-sm leading-relaxed">{insights.business_trigger}</p>
      </div>

      {/* ERP / Business Data Signals */}
      <div className="p-4 rounded-xl bg-black border border-dark-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">🏢</span>
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">ERP &amp; Business Data Signals</p>
        </div>
        <div className="space-y-2">
          {insights.erp_signals.map((signal, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-dark-card border border-dark-border">
              <span className="text-orange-400 text-xs mt-0.5">▸</span>
              <p className="text-gray-300 text-xs leading-relaxed">{signal}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Customer / Client Sentiment */}
      <div className="p-4 rounded-xl bg-black border border-dark-border">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm">📡</span>
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Customer &amp; Market Sentiment</p>
        </div>
        <div className="space-y-2">
          {insights.customer_sentiment.map((item, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-dark-card border border-dark-border">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-white">{item.source}</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${sentimentColor[item.sentiment] || 'text-gray-400 bg-dark-hover border-dark-border'}`}>
                  {item.sentiment}
                </span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed">{item.signal}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-600 mt-3">
          Sources: Google Reviews, X (Twitter), LinkedIn, Customer Feedback Portal, App Store Reviews, AI-transcribed Sales Calls
        </p>
      </div>
    </div>
  )
}
