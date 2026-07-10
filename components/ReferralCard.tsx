'use client'

/**
 * ReferralCard — Shows referral link + progress
 * "Invite 3 friends = 3 months free when paid"
 */

import { useState } from 'react'
import { Gift, Copy, Check, Users } from 'lucide-react'
import { getReferralLink, getReferralProgress } from '@/lib/referral'

export function ReferralCard() {
  const [copied, setCopied] = useState(false)
  const link = getReferralLink()
  const progress = getReferralProgress()

  const copyLink = () => {
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">
      <div className="flex items-center gap-2 mb-2">
        <Gift className="h-4 w-4 text-yellow-500" />
        <h4 className="text-sm font-semibold text-foreground">Invite Friends</h4>
      </div>

      <p className="text-xs text-muted-foreground mb-2">
        Invite {progress.remaining} more friend{progress.remaining !== 1 ? 's' : ''} to get{' '}
        <span className="text-yellow-500 font-medium">{progress.rewardMonths} months free</span>{' '}
        when we launch paid plans
      </p>

      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={link}
          readOnly
          className="flex-1 px-2 py-1.5 text-xs rounded-lg bg-background border border-border text-muted-foreground"
        />
        <button
          onClick={copyLink}
          className="px-2 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 transition-colors"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1">
          <Users className="h-4 w-4" />
          {progress.count}/{progress.threshold} invited
        </span>
        {progress.isEligible ? (
          <span className="text-yellow-500 font-medium">✅ Eligible for free months</span>
        ) : (
          <span className="text-muted-foreground/60">{progress.remaining} to go</span>
        )}
      </div>
    </div>
  )
}
