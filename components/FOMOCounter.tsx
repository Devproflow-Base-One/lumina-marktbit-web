'use client'

/**
 * FOMOCounter — "First 5,000 users get LIFETIME ad-free"
 * Creates urgency for signups
 */

import { useState, useEffect } from 'react'
import { Flame, Users } from 'lucide-react'

const TOTAL_SLOTS = 5000
const STORAGE_KEY = 'marktbit_fomo_count'

export function FOMOCounter() {
  const [slotsLeft, setSlotsLeft] = useState(TOTAL_SLOTS)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const count = parseInt(stored, 10)
      setSlotsLeft(TOTAL_SLOTS - count)
      setIsRegistered(localStorage.getItem('marktbit_user_registered') === 'true')
    } else {
      // Simulate initial count (in production, fetch from API)
      const initialCount = Math.floor(Math.random() * 500) + 1500
      localStorage.setItem(STORAGE_KEY, initialCount.toString())
      setSlotsLeft(TOTAL_SLOTS - initialCount)
    }
  }, [])

  const percentTaken = ((TOTAL_SLOTS - slotsLeft) / TOTAL_SLOTS) * 100

  return (
    <div className="rounded-xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 p-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Flame className="h-5 w-5 text-yellow-500 animate-pulse" />
        <h3 className="text-sm font-bold text-yellow-500">Lifetime Ad-Free Access</h3>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        First <span className="text-yellow-500 font-bold">5,000</span> users get{' '}
        <span className="text-foreground font-semibold">LIFETIME ad-free</span> + all premium features
      </p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground flex items-center gap-1">
            <Users className="h-4 w-4" />
            {TOTAL_SLOTS - slotsLeft} registered
          </span>
          <span className="text-yellow-500 font-bold">{slotsLeft} slots left</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
            style={{ width: `${percentTaken}%` }}
          />
        </div>
      </div>

      {isRegistered ? (
        <div className="rounded-lg bg-yellow-500/10 border border-yellow-500/20 px-3 py-2 text-xs text-yellow-500">
          ✅ You&apos;re registered! Your lifetime ad-free slot is secured.
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/60">
          Register now before slots run out
        </p>
      )}
    </div>
  )
}
