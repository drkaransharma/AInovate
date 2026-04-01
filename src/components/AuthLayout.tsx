'use client'

import { WorkspaceProvider, useWorkspace } from '@/lib/workspace-context'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import type { ReactNode } from 'react'

function InnerLayout({ children }: { children: ReactNode }) {
  const { loading, workspace, user } = useWorkspace()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center mx-auto mb-3">
            <svg className="animate-spin h-5 w-5 text-gold" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">Loading workspace...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Please sign in to continue</p>
          <Link href="/login" className="px-6 py-2.5 bg-gold text-black font-semibold rounded-xl">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">No workspace found. Create one to get started.</p>
          <Link href="/register" className="px-6 py-2.5 bg-gold text-black font-semibold rounded-xl">
            Create Workspace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <InnerLayout>{children}</InnerLayout>
    </WorkspaceProvider>
  )
}
