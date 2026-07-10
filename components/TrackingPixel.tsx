'use client'

import { useEffect } from 'react'

/**
 * Singularity Tracking Pixel
 * Auto-tracks impressions and clicks on campaign elements
 * Place <TrackingPixel campaignId="xxx" channel="telegram" /> in campaign components
 */
export function TrackingPixel({
  campaignId,
  channel = 'web',
  network = null,
}: {
  campaignId: string
  channel?: string
  network?: string | null
}) {
  useEffect(() => {
    if (!campaignId) return

    // Track impression on mount
    fetch('/api/god-mode/track/impression', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId, channel, network }),
    }).catch(() => {})

    // Track click on any link with data-campaign attribute
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-campaign]')
      if (target) {
        const campId = target.getAttribute('data-campaign')
        if (campId === campaignId) {
          fetch('/api/god-mode/track/click', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ campaignId: campId, channel, url: window.location.href }),
          }).catch(() => {})
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [campaignId, channel, network])

  return null
}
