'use client'

import { Suspense } from 'react'
import UnauthorizedAlert from '@/components/UnauthorizedAlert'

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UnauthorizedAlert />
    </Suspense>
  )
}
