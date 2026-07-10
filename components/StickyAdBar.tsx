'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'

export function StickyAdBar() {
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (dismissed || !show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 xl:hidden">
      <div className="relative bg-card/95 backdrop-blur border-t border-border p-2">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-1 right-1 text-muted-foreground hover:text-foreground p-1 z-10"
          aria-label="Close ad"
        >
          <X className="h-4 w-4" />
        </button>
        <AdSlot size="banner" format="social-bar" className="!min-h-[60px]" />
      </div>
    </div>
  )
}
