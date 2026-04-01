import Link from 'next/link'

const modules = [
  {
    title: 'Idea & Insight',
    description: 'Capture ideas from employees, analyze against ERP data and customer sentiment from social media and feedback channels. AI scores every idea using 6 integrated data sources.',
    href: '/idea-engine',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: 'Innovation Pulse',
    description: 'Track ideas from business case to leadership approval, development, and ROI measurement. Full lifecycle management with value metrics.',
    href: '/pipeline',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'AI Academy',
    description: 'Micro LMS that empowers employees with innovation and problem-solving skills. AI-guided Design Thinking sessions, training courses, and simulation assessments.',
    href: '/co-facilitator',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Dashboard & Analytics',
    description: 'Central command centre with KPI tracking, threshold filtering, employee identification, and data-driven insights across all innovation activity.',
    href: '/dashboard',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <>
      {/* Public nav */}
      <nav className="border-b border-dark-border bg-black/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center">
              <img src="/logo-nav.svg" alt="AInovate" className="h-8" />
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="px-4 py-2 text-sm bg-gold text-black font-semibold rounded-xl hover:bg-gold-light transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/5 via-transparent to-transparent" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 mb-8">
                <span className="w-2 h-2 rounded-full bg-gold animate-shimmer" />
                <span className="text-gold text-sm">Innovation as a Service</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
                Transform Ideas into{' '}
                <span className="text-gold">Impact</span>
              </h1>
              <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                AInovate is an AI-native platform that helps any organisation capture ideas,
                build business cases, track ROI, and upskill teams — all powered by AI and your organisation&apos;s own data.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="px-6 py-3 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light transition-all shadow-lg shadow-gold/20 hover:shadow-gold/30"
                >
                  Create Your Workspace
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 border border-dark-border text-gray-300 rounded-xl hover:bg-dark-hover hover:border-gray-600 transition-all"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                className="group relative p-8 rounded-2xl border border-dark-border bg-dark-card hover:border-gold/30 hover:bg-dark-hover transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    {mod.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2 group-hover:text-gold transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
