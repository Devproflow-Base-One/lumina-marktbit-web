'use client'

import { useEffect } from 'react'
import { initPostHog } from '@/lib/posthog'

export function PostHogInit(): React.ReactElement | null {
  useEffect(() => {
    initPostHog()
  }, [])

  return null
}
