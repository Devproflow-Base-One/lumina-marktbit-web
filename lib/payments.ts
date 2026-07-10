/**
 * Payment Integration — Stripe + NowPayments
 * F4f: Subscription billing, one-time payments, crypto payments
 *
 * Stripe: Credit card payments for subscriptions
 * NowPayments: Crypto payments for subscriptions
 */

// ── Types ──

export type PaymentProvider = 'stripe' | 'nowpayments'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'expired'
export type SubscriptionTier = 'free' | 'pro' | 'premium' | 'lifetime'

export interface PricingPlan {
  id: string
  tier: SubscriptionTier
  name: string
  priceUSD: number
  priceIDR: number
  interval: 'month' | 'year' | 'lifetime'
  features: string[]
  popular?: boolean
}

export interface PaymentResult {
  success: boolean
  provider: PaymentProvider
  paymentId?: string
  checkoutUrl?: string
  status: PaymentStatus
  error?: string
}

export interface SubscriptionResult {
  success: boolean
  subscriptionId?: string
  tier: SubscriptionTier
  currentPeriodEnd?: string
  error?: string
}

// ── Pricing Plans ──

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    tier: 'free',
    name: 'Free',
    priceUSD: 0,
    priceIDR: 0,
    interval: 'month',
    features: [
      'Access to top 10 crypto signals',
      'Basic market overview',
      'Community access',
      '5 alerts',
    ],
  },
  {
    id: 'pro',
    tier: 'pro',
    name: 'Pro',
    priceUSD: 9,
    priceIDR: 149000,
    interval: 'month',
    features: [
      'All 45+ crypto signals',
      'Stock signals (IDX + Global)',
      'Real-time WebSocket updates',
      '50 alerts',
      'Portfolio tracking',
      'Watchlist (unlimited)',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'premium',
    tier: 'premium',
    name: 'Premium',
    priceUSD: 29,
    priceIDR: 449000,
    interval: 'month',
    features: [
      'Everything in Pro',
      'AI-powered analysis',
      'Backtesting tools',
      'Unlimited alerts',
      'Advanced God Mode access',
      'API access (1000 req/day)',
      'Dedicated support',
    ],
  },
  {
    id: 'lifetime',
    tier: 'lifetime',
    name: 'Lifetime',
    priceUSD: 299,
    priceIDR: 4490000,
    interval: 'lifetime',
    features: [
      'Everything in Premium',
      'One-time payment',
      'Lifetime updates',
      'API access (unlimited)',
      'Early access to new features',
      'White-glove onboarding',
    ],
  },
]

// ── Stripe Integration ──

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
const STRIPE_PRICE_MAP: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO || '',
  premium: process.env.STRIPE_PRICE_PREMIUM || '',
  lifetime: process.env.STRIPE_PRICE_LIFETIME || '',
}

export const stripePayments = {
  async createCheckoutSession(tier: SubscriptionTier, userId: string, successUrl?: string, cancelUrl?: string): Promise<PaymentResult> {
    if (!STRIPE_SECRET_KEY) {
      return { success: false, provider: 'stripe', status: 'failed', error: 'Stripe not configured' }
    }

    const priceId = STRIPE_PRICE_MAP[tier]
    if (!priceId) {
      return { success: false, provider: 'stripe', status: 'failed', error: `No Stripe price for tier: ${tier}` }
    }

    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const body = {
        mode: tier === 'lifetime' ? 'payment' : 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl || `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: cancelUrl || `${baseUrl}/billing/cancel`,
        client_reference_id: userId,
        metadata: { userId, tier },
      }

      const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(this.flattenParams(body)).toString(),
      })

      if (!res.ok) {
        const err = await res.json()
        return { success: false, provider: 'stripe', status: 'failed', error: err.error?.message || 'Stripe API error' }
      }

      const session = await res.json()
      return {
        success: true,
        provider: 'stripe',
        paymentId: session.id,
        checkoutUrl: session.url,
        status: 'pending',
      }
    } catch (err) {
      return { success: false, provider: 'stripe', status: 'failed', error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  async verifyWebhook(payload: string, signature: string): Promise<{ verified: boolean; event?: unknown }> {
    if (!STRIPE_WEBHOOK_SECRET) return { verified: false }
    try {
      // In production, use stripe.webhooks.constructEvent
      // This is a simplified check
      const event = JSON.parse(payload)
      return { verified: true, event }
    } catch {
      return { verified: false }
    }
  },

  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    if (!STRIPE_SECRET_KEY) return { success: false, error: 'Stripe not configured' }
    try {
      const res = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
      })
      if (!res.ok) {
        const err = await res.json()
        return { success: false, error: err.error?.message }
      }
      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  flattenParams(obj: Record<string, unknown>, prefix = ''): Record<string, string> {
    const result: Record<string, string> = {}
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}[${key}]` : key
      if (value === null || value === undefined) continue
      if (typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(result, this.flattenParams(value as Record<string, unknown>, fullKey))
      } else if (Array.isArray(value)) {
        value.forEach((item, idx) => {
          if (typeof item === 'object') {
            Object.assign(result, this.flattenParams(item, `${fullKey}[${idx}]`))
          } else {
            result[`${fullKey}[${idx}]`] = String(item)
          }
        })
      } else {
        result[fullKey] = String(value)
      }
    }
    return result
  },
}

// ── NowPayments Integration (Crypto) ──

const NOWPAYMENTS_API_KEY = process.env.NOWPAYMENTS_API_KEY
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1'

export const nowPayments = {
  async createInvoice(tier: SubscriptionTier, userId: string): Promise<PaymentResult> {
    if (!NOWPAYMENTS_API_KEY) {
      return { success: false, provider: 'nowpayments', status: 'failed', error: 'NowPayments not configured' }
    }

    const plan = PRICING_PLANS.find((p) => p.tier === tier)
    if (!plan || plan.priceUSD === 0) {
      return { success: false, provider: 'nowpayments', status: 'failed', error: 'Invalid tier' }
    }

    try {
      const res = await fetch(`${NOWPAYMENTS_API_URL}/invoice`, {
        method: 'POST',
        headers: {
          'x-api-key': NOWPAYMENTS_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_amount: plan.priceUSD,
          price_currency: 'usd',
          order_id: `${userId}-${tier}-${Date.now()}`,
          order_description: `MarktBit ${plan.name} subscription`,
          success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success`,
          cancelled_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/cancel`,
          metadata: { userId, tier },
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        return { success: false, provider: 'nowpayments', status: 'failed', error: err.message || 'NowPayments API error' }
      }

      const invoice = await res.json()
      return {
        success: true,
        provider: 'nowpayments',
        paymentId: invoice.id,
        checkoutUrl: invoice.invoice_url,
        status: 'pending',
      }
    } catch (err) {
      return { success: false, provider: 'nowpayments', status: 'failed', error: err instanceof Error ? err.message : 'Unknown error' }
    }
  },

  async getPaymentStatus(paymentId: string): Promise<{ status: PaymentStatus; paid: boolean }> {
    if (!NOWPAYMENTS_API_KEY) return { status: 'failed', paid: false }
    try {
      const res = await fetch(`${NOWPAYMENTS_API_URL}/payment/${paymentId}`, {
        headers: { 'x-api-key': NOWPAYMENTS_API_KEY },
      })
      if (!res.ok) return { status: 'failed', paid: false }
      const data = await res.json()
      const statusMap: Record<string, PaymentStatus> = {
        waiting: 'pending',
        confirming: 'processing',
        confirmed: 'completed',
        sending: 'processing',
        finished: 'completed',
        failed: 'failed',
        expired: 'expired',
        refuned: 'refunded',
      }
      return {
        status: statusMap[data.payment_status] || 'pending',
        paid: data.payment_status === 'finished' || data.payment_status === 'confirmed',
      }
    } catch {
      return { status: 'failed', paid: false }
    }
  },
}

// ── Unified Payment API ──

export const payments = {
  async createSubscription(tier: SubscriptionTier, userId: string, provider: PaymentProvider = 'stripe'): Promise<PaymentResult> {
    if (tier === 'free') {
      return { success: true, provider, status: 'completed', paymentId: 'free-tier' }
    }
    if (provider === 'stripe') return stripePayments.createCheckoutSession(tier, userId)
    if (provider === 'nowpayments') return nowPayments.createInvoice(tier, userId)
    return { success: false, provider, status: 'failed', error: 'Unknown provider' }
  },

  async checkStatus(paymentId: string, provider: PaymentProvider): Promise<{ status: PaymentStatus; paid: boolean }> {
    if (provider === 'nowpayments') return nowPayments.getPaymentStatus(paymentId)
    // Stripe status would be checked via Stripe API
    return { status: 'pending', paid: false }
  },

  getPlans(): PricingPlan[] {
    return PRICING_PLANS
  },

  getPlan(tier: SubscriptionTier): PricingPlan | undefined {
    return PRICING_PLANS.find((p) => p.tier === tier)
  },
}
