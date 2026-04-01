'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWorkspace } from '@/lib/workspace-context'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/idea-engine', label: 'AI Idea Engine' },
  { href: '/co-facilitator', label: 'AI Academy' },
  { href: '/sentiment', label: 'Sentiment Pulse' },
  { href: '/settings', label: 'Settings' },
]

export default function Navbar() {
  const pathname = usePathname()
  const { profile, workspace, logout, loading } = useWorkspace()

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <nav className="border-b border-dark-border bg-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Workspace */}
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                <span className="text-black font-bold text-sm font-serif">Ai</span>
              </div>
              <span className="text-xl font-serif font-bold text-gold group-hover:text-gold-light transition-colors">
                AInovate
              </span>
            </Link>
            {workspace && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-dark-card border border-dark-border">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-sm text-gray-300 max-w-[160px] truncate">{workspace.name}</span>
              </div>
            )}
          </div>

          {/* Nav links - desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-gold/10 text-gold border border-gold/30'
                      : 'text-gray-400 hover:text-white hover:bg-dark-hover'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>

          {/* User section */}
          <div className="flex items-center gap-3">
            {!loading && profile && (
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm text-gray-300 max-w-[120px] truncate hidden md:block">
                  {profile.full_name}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 text-xs text-gray-500 hover:text-red-400 rounded-lg hover:bg-dark-hover transition-colors"
                >
                  Logout
                </button>
              </div>
            )}

            {/* Mobile menu */}
            <div className="lg:hidden">
              <MobileMenu pathname={pathname} onLogout={logout} profile={profile} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

function MobileMenu({
  pathname,
  onLogout,
  profile,
}: {
  pathname: string
  onLogout: () => void
  profile: { full_name: string } | null
}) {
  return (
    <details className="relative">
      <summary className="list-none cursor-pointer p-2 text-gray-400 hover:text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </summary>
      <div className="absolute right-0 mt-2 w-56 bg-dark-card border border-dark-border rounded-xl shadow-2xl p-2 z-50">
        {profile && (
          <div className="px-4 py-2 mb-2 border-b border-dark-border">
            <p className="text-sm font-medium text-white truncate">{profile.full_name}</p>
          </div>
        )}
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-gold/10 text-gold'
                  : 'text-gray-400 hover:text-white hover:bg-dark-hover'
              }`}
            >
              {item.label}
            </Link>
          )
        })}
        <button
          onClick={onLogout}
          className="w-full text-left px-4 py-2.5 rounded-lg text-sm text-red-400 hover:bg-dark-hover transition-all mt-1 border-t border-dark-border pt-3"
        >
          Logout
        </button>
      </div>
    </details>
  )
}
