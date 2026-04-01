'use client'

import { useState, useRef, useEffect } from 'react'
import AuthLayout from '@/components/AuthLayout'

// ── Training Course Library ──
const courses = [
  { id: 'dt', title: 'Design Thinking Masterclass', duration: '6 hrs', modules: 5, level: 'Intermediate', icon: '🎨', status: 'published', enrolled: 47, completed: 31, category: 'Innovation', desc: 'Master the 5-stage Design Thinking framework with hands-on AI-guided simulations.' },
  { id: 'ps', title: 'Problem Solving & Root Cause Analysis', duration: '4 hrs', modules: 4, level: 'Beginner', icon: '🔍', status: 'published', enrolled: 62, completed: 45, category: 'Critical Thinking', desc: 'Learn structured problem-solving using 5 Whys, Fishbone, and Pareto analysis.' },
  { id: 'ai', title: 'AI for Business Innovation', duration: '5 hrs', modules: 6, level: 'Advanced', icon: '🤖', status: 'published', enrolled: 38, completed: 12, category: 'Technology', desc: 'Understand how AI transforms business processes and drives innovation strategy.' },
  { id: 'lm', title: 'Lean & Agile Innovation', duration: '3 hrs', modules: 4, level: 'Intermediate', icon: '⚡', status: 'published', enrolled: 29, completed: 18, category: 'Methodology', desc: 'Apply Lean Startup and Agile principles to rapidly validate business ideas.' },
  { id: 'cx', title: 'Customer Experience Design', duration: '4 hrs', modules: 5, level: 'Intermediate', icon: '👤', status: 'published', enrolled: 41, completed: 27, category: 'Customer', desc: 'Map customer journeys, identify pain points, and design delightful experiences.' },
  { id: 'dm', title: 'Data-Driven Decision Making', duration: '3.5 hrs', modules: 4, level: 'Beginner', icon: '📊', status: 'published', enrolled: 55, completed: 39, category: 'Analytics', desc: 'Use data analytics and dashboards to make evidence-based business decisions.' },
  { id: 'cl', title: 'Innovation Leadership', duration: '4 hrs', modules: 5, level: 'Advanced', icon: '🏆', status: 'draft', enrolled: 0, completed: 0, category: 'Leadership', desc: 'Lead innovation teams, manage creative tension, and build innovation culture.' },
  { id: 'st', title: 'Strategic Thinking & Foresight', duration: '3 hrs', modules: 3, level: 'Advanced', icon: '🔮', status: 'draft', enrolled: 0, completed: 0, category: 'Strategy', desc: 'Scenario planning, trend analysis, and strategic foresight methodologies.' },
]

// ── Employee Training Records ──
const employeeProgress = [
  { name: 'Aisha Rahman', dept: 'Product', courses_completed: 4, courses_in_progress: 1, avg_score: 92, last_active: '2 hrs ago', badge: '🏅 Innovation Champion' },
  { name: 'Mohammed Al-Rashid', dept: 'Engineering', courses_completed: 3, courses_in_progress: 2, avg_score: 88, last_active: '5 hrs ago', badge: '🎯 Problem Solver' },
  { name: 'Sarah Chen', dept: 'Marketing', courses_completed: 5, courses_in_progress: 0, avg_score: 95, last_active: '1 day ago', badge: '🏅 Innovation Champion' },
  { name: 'Omar Hassan', dept: 'Operations', courses_completed: 2, courses_in_progress: 1, avg_score: 78, last_active: '3 hrs ago', badge: '📚 Active Learner' },
  { name: 'Priya Kapoor', dept: 'HR', courses_completed: 3, courses_in_progress: 1, avg_score: 85, last_active: '1 hr ago', badge: '🎯 Problem Solver' },
  { name: 'James Wilson', dept: 'Finance', courses_completed: 1, courses_in_progress: 2, avg_score: 72, last_active: '2 days ago', badge: '🌱 Getting Started' },
  { name: 'Fatima Al-Sayed', dept: 'Sales', courses_completed: 4, courses_in_progress: 1, avg_score: 91, last_active: '4 hrs ago', badge: '🏅 Innovation Champion' },
  { name: 'David Kim', dept: 'Customer Success', courses_completed: 2, courses_in_progress: 0, avg_score: 81, last_active: '6 hrs ago', badge: '📚 Active Learner' },
]

// ── Simulation Assessments ──
const assessments = [
  { title: 'Design Thinking Challenge: Improve Onboarding', type: 'Simulation', participants: 24, avg_score: 84, completion_rate: 92, status: 'Active' },
  { title: 'Root Cause Analysis: Supply Chain Delay', type: 'Case Study', participants: 31, avg_score: 78, completion_rate: 88, status: 'Active' },
  { title: 'AI Innovation Sprint: Customer Retention', type: 'Team Simulation', participants: 18, avg_score: 91, completion_rate: 100, status: 'Completed' },
  { title: 'Lean Canvas Workshop: New Product Line', type: 'Simulation', participants: 22, avg_score: 86, completion_rate: 95, status: 'Active' },
  { title: 'Customer Journey Mapping: Post-Purchase', type: 'Hands-on Lab', participants: 35, avg_score: 82, completion_rate: 91, status: 'Completed' },
]

// ── Design Thinking Stages for the Live Facilitator ──
const STAGES = [
  { id: 'empathize', label: 'Empathize', icon: '1', description: 'Understand users and their needs' },
  { id: 'define', label: 'Define', icon: '2', description: 'Frame the core problem' },
  { id: 'ideate', label: 'Ideate', icon: '3', description: 'Generate creative solutions' },
  { id: 'prototype', label: 'Prototype', icon: '4', description: 'Build quick prototypes' },
  { id: 'test', label: 'Test', icon: '5', description: 'Validate with real users' },
]

type TabType = 'overview' | 'library' | 'employees' | 'assessments' | 'facilitator'

const levelColor: Record<string, string> = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-gold/20 text-gold border-gold/30',
  Advanced: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

function AcademyContent() {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [context, setContext] = useState('')
  const [started, setStarted] = useState(false)
  const [currentStageIdx, setCurrentStageIdx] = useState(0)
  const [stageOutputs, setStageOutputs] = useState<Record<string, string>>({})
  const [streaming, setStreaming] = useState(false)
  const [currentOutput, setCurrentOutput] = useState('')
  const outputRef = useRef<HTMLDivElement>(null)

  const currentStage = STAGES[currentStageIdx]

  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight
  }, [currentOutput])

  const startSession = () => { if (!context.trim()) return; setStarted(true); runStage(0) }

  const runStage = async (stageIdx: number) => {
    const stage = STAGES[stageIdx]
    setCurrentStageIdx(stageIdx); setStreaming(true); setCurrentOutput('')
    const previousStages: Record<string, string> = {}
    for (let i = 0; i < stageIdx; i++) { const s = STAGES[i]; if (stageOutputs[s.id]) previousStages[s.id] = stageOutputs[s.id] }
    try {
      const res = await fetch('/api/co-facilitator', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ stage: stage.id, context, previousStages }) })
      if (!res.ok) { const errData = await res.json(); setCurrentOutput(`Error: ${errData.error || 'Failed'}`); setStreaming(false); return }
      const reader = res.body?.getReader(); const decoder = new TextDecoder(); let fullText = ''
      if (reader) { while (true) { const { done, value } = await reader.read(); if (done) break; const chunk = decoder.decode(value); const lines = chunk.split('\n'); for (const line of lines) { if (line.startsWith('data: ')) { const data = line.slice(6); if (data === '[DONE]') continue; try { const parsed = JSON.parse(data); if (parsed.text) { fullText += parsed.text; setCurrentOutput(fullText) } } catch { /* skip */ } } } } }
      setStageOutputs((prev) => ({ ...prev, [stage.id]: fullText }))
    } catch { setCurrentOutput('Error: Could not connect to AI service.') } finally { setStreaming(false) }
  }

  const nextStage = () => { if (currentStageIdx < STAGES.length - 1) { setStageOutputs(prev => ({ ...prev, [currentStage.id]: currentOutput })); runStage(currentStageIdx + 1) } }
  const goToStage = (idx: number) => { if (idx <= currentStageIdx && !streaming) { setCurrentStageIdx(idx); setCurrentOutput(stageOutputs[STAGES[idx].id] || '') } }
  const resetSession = () => { setStarted(false); setContext(''); setCurrentStageIdx(0); setStageOutputs({}); setCurrentOutput('') }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'library', label: 'Training Library', icon: '📚' },
    { id: 'employees', label: 'Employee Progress', icon: '👥' },
    { id: 'assessments', label: 'Assessments', icon: '📝' },
    { id: 'facilitator', label: 'Live Facilitator', icon: '🎓' },
  ]

  const totalEnrolled = courses.reduce((s, c) => s + c.enrolled, 0)
  const totalCompleted = courses.reduce((s, c) => s + c.completed, 0)
  const avgScore = Math.round(employeeProgress.reduce((s, e) => s + e.avg_score, 0) / employeeProgress.length)

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-4">
          <span className="text-gold text-sm">🎓 AI Academy</span>
        </div>
        <h1 className="text-4xl font-serif font-bold mb-3">AI Academy — Micro LMS</h1>
        <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
          <h2 className="text-base font-serif font-bold text-gold mb-2">What is the AI Academy?</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            AInovate&apos;s AI Academy is a <span className="text-white font-medium">Micro Learning Management System</span> that empowers your employees with innovation and problem-solving capabilities. We deliver both AInovate&apos;s proprietary training content and your organisation&apos;s custom training materials — all managed from one platform. Employees learn through interactive courses, AI-guided Design Thinking simulations, and hands-on assessments that produce real business outputs.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: '📚', title: 'Course Library', desc: 'AInovate + client custom training content' },
              { icon: '🤖', title: 'AI Facilitator', desc: 'Live Design Thinking sessions with AI' },
              { icon: '📝', title: 'Assessments', desc: 'Simulations & case study evaluations' },
              { icon: '📊', title: 'Analytics', desc: 'Employee progress & skill intelligence' },
            ].map((item) => (
              <div key={item.title} className="p-3 rounded-xl bg-black border border-dark-border">
                <span className="text-lg">{item.icon}</span>
                <p className="text-xs font-semibold text-white mt-1">{item.title}</p>
                <p className="text-[10px] text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-gold/10 text-gold border border-gold/30' : 'text-gray-400 hover:text-white hover:bg-dark-hover'}`}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ OVERVIEW TAB ═══ */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Courses', value: courses.filter(c => c.status === 'published').length, color: 'text-gold' },
              { label: 'Total Enrolled', value: totalEnrolled, color: 'text-blue-400' },
              { label: 'Completions', value: totalCompleted, color: 'text-green-400' },
              { label: 'Avg Score', value: `${avgScore}%`, color: 'text-gold' },
              { label: 'Active Learners', value: employeeProgress.filter(e => e.courses_in_progress > 0).length, color: 'text-purple-400' },
            ].map((kpi) => (
              <div key={kpi.label} className="p-4 rounded-2xl bg-dark-card border border-dark-border">
                <p className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">{kpi.label}</p>
                <p className={`text-2xl font-serif font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Top Performers + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
              <h3 className="text-base font-serif font-bold mb-4">Top Performers</h3>
              <div className="space-y-3">
                {employeeProgress.sort((a, b) => b.avg_score - a.avg_score).slice(0, 5).map((emp, i) => (
                  <div key={emp.name} className="flex items-center justify-between p-3 rounded-xl bg-black border border-dark-border">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gold w-6">{i + 1}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{emp.name}</p>
                        <p className="text-[10px] text-gray-500">{emp.dept} • {emp.badge}</p>
                      </div>
                    </div>
                    <span className="text-lg font-serif font-bold text-gold">{emp.avg_score}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
              <h3 className="text-base font-serif font-bold mb-4">Popular Courses</h3>
              <div className="space-y-3">
                {courses.filter(c => c.status === 'published').sort((a, b) => b.enrolled - a.enrolled).slice(0, 5).map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 rounded-xl bg-black border border-dark-border">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{course.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-white">{course.title}</p>
                        <p className="text-[10px] text-gray-500">{course.enrolled} enrolled • {course.completed} completed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gold">{Math.round(course.completed / course.enrolled * 100)}%</p>
                      <p className="text-[10px] text-gray-500">completion</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills Heatmap */}
          <div className="p-5 rounded-2xl bg-dark-card border border-dark-border">
            <h3 className="text-base font-serif font-bold mb-4">Skills Intelligence</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { skill: 'Design Thinking', level: 78, trend: '+12%' },
                { skill: 'Problem Solving', level: 82, trend: '+8%' },
                { skill: 'AI Literacy', level: 45, trend: '+23%' },
                { skill: 'Data Analysis', level: 67, trend: '+5%' },
                { skill: 'Customer Empathy', level: 71, trend: '+15%' },
                { skill: 'Lean Methodology', level: 58, trend: '+10%' },
                { skill: 'Strategic Thinking', level: 39, trend: 'New' },
                { skill: 'Innovation Leadership', level: 33, trend: 'New' },
              ].map((skill) => (
                <div key={skill.skill} className="p-3 rounded-xl bg-black border border-dark-border">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-medium text-white">{skill.skill}</p>
                    <span className="text-[10px] text-green-400">{skill.trend}</span>
                  </div>
                  <div className="h-2 bg-dark-border rounded-full overflow-hidden mb-1">
                    <div className={`h-full rounded-full ${skill.level >= 70 ? 'bg-green-400' : skill.level >= 50 ? 'bg-gold' : 'bg-orange-400'}`} style={{ width: `${skill.level}%` }} />
                  </div>
                  <p className="text-[10px] text-gray-500">{skill.level}% org proficiency</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══ TRAINING LIBRARY TAB ═══ */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-serif font-bold">Training Library</h2>
            <span className="text-sm text-gray-500">{courses.length} courses ({courses.filter(c => c.status === 'published').length} published)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course.id} className={`p-5 rounded-2xl bg-dark-card border transition-all ${course.status === 'draft' ? 'border-dark-border opacity-60' : 'border-dark-border hover:border-gold/30'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{course.icon}</span>
                    <div>
                      <h3 className="text-base font-serif font-bold">{course.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${levelColor[course.level]}`}>{course.level}</span>
                        <span className="text-[10px] text-gray-500">{course.category}</span>
                        {course.status === 'draft' && <span className="px-2 py-0.5 rounded-md text-[10px] bg-gray-500/20 text-gray-400 border border-gray-500/30">Draft</span>}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed mb-3">{course.desc}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-500">
                  <div className="flex items-center gap-3">
                    <span>⏱ {course.duration}</span>
                    <span>📖 {course.modules} modules</span>
                  </div>
                  {course.status === 'published' && (
                    <div className="flex items-center gap-3">
                      <span>👥 {course.enrolled} enrolled</span>
                      <span className="text-green-400">✓ {course.completed} completed</span>
                    </div>
                  )}
                </div>
                {course.status === 'published' && (
                  <div className="mt-3 h-1.5 bg-dark-border rounded-full overflow-hidden">
                    <div className="h-full bg-gold rounded-full" style={{ width: `${Math.round(course.completed / course.enrolled * 100)}%` }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 text-center">
            <p className="text-gray-400 text-xs">📤 <span className="text-gold font-medium">Upload Custom Content</span> — Add your organisation&apos;s proprietary training materials, onboarding docs, SOPs, and compliance training to the library.</p>
          </div>
        </div>
      )}

      {/* ═══ EMPLOYEE PROGRESS TAB ═══ */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold mb-2">Employee Training Progress</h2>
          <div className="space-y-3">
            {employeeProgress.map((emp) => (
              <div key={emp.name} className="p-5 rounded-2xl bg-dark-card border border-dark-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{emp.name}</p>
                      <p className="text-[10px] text-gray-500">{emp.dept} • Last active: {emp.last_active}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs bg-gold/10 text-gold border border-gold/20">{emp.badge}</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="p-2.5 rounded-lg bg-black border border-dark-border text-center">
                    <p className="text-lg font-serif font-bold text-green-400">{emp.courses_completed}</p>
                    <p className="text-[10px] text-gray-500">Completed</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black border border-dark-border text-center">
                    <p className="text-lg font-serif font-bold text-blue-400">{emp.courses_in_progress}</p>
                    <p className="text-[10px] text-gray-500">In Progress</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black border border-dark-border text-center">
                    <p className="text-lg font-serif font-bold text-gold">{emp.avg_score}%</p>
                    <p className="text-[10px] text-gray-500">Avg Score</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ ASSESSMENTS TAB ═══ */}
      {activeTab === 'assessments' && (
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold mb-2">Simulation Assessments</h2>
          <p className="text-gray-500 text-sm mb-4">AI-driven simulations and case studies that test real-world problem-solving. Results feed into the Skills Intelligence dashboard.</p>
          <div className="space-y-3">
            {assessments.map((a) => (
              <div key={a.title} className="p-5 rounded-2xl bg-dark-card border border-dark-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{a.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30">{a.type}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] border ${a.status === 'Active' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>{a.status}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-black border border-dark-border text-center">
                    <p className="text-lg font-serif font-bold text-blue-400">{a.participants}</p>
                    <p className="text-[10px] text-gray-500">Participants</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black border border-dark-border text-center">
                    <p className="text-lg font-serif font-bold text-gold">{a.avg_score}%</p>
                    <p className="text-[10px] text-gray-500">Avg Score</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black border border-dark-border text-center">
                    <p className="text-lg font-serif font-bold text-green-400">{a.completion_rate}%</p>
                    <p className="text-[10px] text-gray-500">Completion</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ LIVE FACILITATOR TAB ═══ */}
      {activeTab === 'facilitator' && (
        <div>
          {!started ? (
            <div className="max-w-2xl mx-auto">
              <div className="p-8 rounded-2xl bg-dark-card border border-dark-border">
                <h2 className="text-2xl font-serif font-bold mb-2">Start a Live Design Thinking Session</h2>
                <p className="text-gray-400 mb-2 text-sm">Describe a real challenge from your organisation. The AI facilitator will guide you through all 5 stages — building problem-solving skills while producing actionable outputs.</p>
                <p className="text-xs text-gray-600 mb-6">💡 Session results are tracked in your training progress and feed into the Skills Intelligence dashboard.</p>
                <textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="e.g., We need to reduce customer churn by improving the post-purchase experience..." rows={5} className="w-full px-4 py-3 bg-black border border-dark-border rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all resize-none mb-4" />
                <div className="flex flex-wrap gap-2 mb-6">
                  {STAGES.map((stage, i) => (
                    <div key={stage.id} className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg text-xs bg-gold/10 text-gold border border-gold/20">{stage.icon}. {stage.label}</span>
                      {i < STAGES.length - 1 && <span className="text-gray-600">→</span>}
                    </div>
                  ))}
                </div>
                <button onClick={startSession} disabled={!context.trim()} className="w-full py-3 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-gold/20">Begin Session</button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <div className="p-4 rounded-2xl bg-dark-card border border-dark-border sticky top-24 space-y-2">
                  {STAGES.map((stage, i) => {
                    const isActive = i === currentStageIdx; const isComplete = stageOutputs[stage.id] && i < currentStageIdx; const isFuture = i > currentStageIdx
                    return (
                      <button key={stage.id} onClick={() => goToStage(i)} disabled={isFuture || streaming} className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${isActive ? 'bg-gold/10 border border-gold/30' : isComplete ? 'hover:bg-dark-hover' : 'opacity-40 cursor-not-allowed'}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isActive ? 'bg-gold text-black' : isComplete ? 'bg-green-500/20 text-green-400' : 'bg-dark-border text-gray-500'}`}>
                          {isComplete ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> : stage.icon}
                        </div>
                        <div><p className={`text-sm font-medium ${isActive ? 'text-gold' : 'text-gray-300'}`}>{stage.label}</p><p className="text-[11px] text-gray-500">{stage.description}</p></div>
                      </button>
                    )
                  })}
                  <div className="pt-3 border-t border-dark-border mt-3"><button onClick={resetSession} className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-dark-hover transition-colors">New Session</button></div>
                </div>
              </div>
              <div className="lg:col-span-3">
                <div className="rounded-2xl bg-dark-card border border-dark-border overflow-hidden">
                  <div className="p-6 border-b border-dark-border bg-gradient-to-r from-gold/5 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gold text-black flex items-center justify-center font-bold font-serif">{currentStage.icon}</div>
                        <div><h2 className="text-xl font-serif font-bold">{currentStage.label}</h2><p className="text-gray-400 text-sm">{currentStage.description}</p></div>
                      </div>
                      <span className="text-gray-500 text-sm">Stage {currentStageIdx + 1}/{STAGES.length}</span>
                    </div>
                  </div>
                  <div ref={outputRef} className="p-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                    {currentOutput ? (
                      <div className={`prose prose-invert max-w-none whitespace-pre-wrap text-gray-300 leading-relaxed ${streaming ? 'streaming-cursor' : ''}`}>{currentOutput}</div>
                    ) : (
                      <div className="flex items-center justify-center h-[400px]"><div className="text-center"><svg className="animate-spin h-8 w-8 text-gold mx-auto mb-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg><p className="text-gray-500 font-serif">AI is preparing the {currentStage.label} stage...</p></div></div>
                    )}
                  </div>
                  <div className="p-4 border-t border-dark-border flex items-center justify-between">
                    <span className="text-xs text-gray-500">{streaming ? 'AI is thinking...' : 'Stage complete'}</span>
                    {!streaming && currentStageIdx < STAGES.length - 1 && (
                      <button onClick={nextStage} className="px-6 py-2.5 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light transition-all flex items-center gap-2">Next: {STAGES[currentStageIdx + 1].label} <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                    )}
                    {!streaming && currentStageIdx === STAGES.length - 1 && (
                      <div className="flex items-center gap-2 text-green-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><span className="font-serif font-bold">Session Complete — Added to your training record</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default function CoFacilitatorPage() {
  return (
    <AuthLayout>
      <AcademyContent />
    </AuthLayout>
  )
}
