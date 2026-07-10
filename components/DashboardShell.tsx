'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardWorkspace from '@/components/DashboardWorkspace'
import UnauthorizedAlert from '@/components/UnauthorizedAlert'
import { DashboardLoadingSkeleton } from '@/components/LoadingSkeleton'

function DashboardContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  if (error) {
    return <UnauthorizedAlert />
  }

  return <DashboardWorkspace />
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  if (children) {
    return <>{children}</>
  }
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
