'use client'

import { useState } from 'react'
import { PRICING_PLANS, payments, type PaymentProvider, type SubscriptionTier } from '@/lib/payments'
import { useUserStore } from '@/lib/stores'

export default function BillingPage() {
  const { user, setTier } = useUserStore()
  const currentTier = user?.tier || 'free'
  const [loading, setLoading] = useState<SubscriptionTier | null>(null)
  const [provider, setProvider] = useState<PaymentProvider>('stripe')

  async function handleUpgrade(tier: SubscriptionTier) {
    if (tier === currentTier || tier === 'free') return
    setLoading(tier)
    try {
      const result = await payments.createSubscription(tier, user?.id || 'guest', provider)
      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl
      }
    } catch (err) {
      console.error('Payment error:', err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-yellow-400">Billing & Subscription</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Current plan: <span className="font-semibold text-yellow-400 uppercase">{currentTier}</span>
        </p>
      </div>

      {/* Payment Method Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setProvider('stripe')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            provider === 'stripe' ? 'bg-yellow-500 text-black' : 'border border-yellow-500/20 text-yellow-400'
          }`}
        >
          💳 Credit Card
        </button>
        <button
          onClick={() => setProvider('nowpayments')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            provider === 'nowpayments' ? 'bg-yellow-500 text-black' : 'border border-yellow-500/20 text-yellow-400'
          }`}
        >
          ₿ Crypto
        </button>
      </div>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PRICING_PLANS.map((plan) => {
          const isCurrent = plan.tier === currentTier
          const isLoading = loading === plan.tier
          return (
            <div
              key={plan.id}
              className={`relative rounded-xl border p-6 ${
                plan.popular
                  ? 'border-yellow-500 bg-yellow-500/10'
                  : 'border-yellow-500/20 bg-yellow-500/5'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-yellow-500 px-3 py-0.5 text-xs font-bold text-black">
                  POPULAR
                </span>
              )}
              <h3 className="text-lg font-bold text-yellow-400">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.priceUSD}</span>
                {plan.interval !== 'lifetime' && <span className="text-sm text-muted-foreground">/{plan.interval}</span>}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">≈ Rp {plan.priceIDR.toLocaleString('id-ID')}</p>

              <ul className="mt-4 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-400">✓</span>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleUpgrade(plan.tier)}
                disabled={isCurrent || isLoading || plan.tier === 'free'}
                className={`mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition ${
                  isCurrent
                    ? 'cursor-default border border-yellow-500/20 text-yellow-400'
                    : plan.tier === 'free'
                    ? 'cursor-default border border-muted text-muted-foreground'
                    : 'bg-yellow-500 text-black hover:bg-yellow-400'
                }`}
              >
                {isCurrent ? 'Current Plan' : isLoading ? 'Processing...' : plan.tier === 'free' ? 'Free' : 'Upgrade'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
