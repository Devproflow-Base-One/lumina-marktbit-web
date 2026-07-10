/**
 * Disclaimer Component — Crypto signal disclaimer
 * Shows on all pages to remind users this is NOT financial advice
 */

import { AlertTriangle } from 'lucide-react'

export function Disclaimer() {
  return (
    <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-5 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div className="text-base">
          <p className="font-medium text-yellow-500 mb-1 text-lg">Disclaimer — Not Financial Advice</p>
          <p className="text-muted-foreground">
            All signals shown on this dashboard are for informational and educational purposes only.
            We do not facilitate transactions or take responsibility for trading outcomes.
            Always do your own research (DYOR) before making any investment decisions.
          </p>
        </div>
      </div>
    </div>
  )
}
