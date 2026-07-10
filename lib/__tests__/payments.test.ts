import { describe, it, expect } from 'vitest'
import {
  PRICING_PLANS,
  payments,
  stripePayments,
  nowPayments,
  type SubscriptionTier,
  type PaymentProvider,
} from '../payments'

describe('payments', () => {
  describe('PRICING_PLANS', () => {
    it('should have 4 plans', () => {
      expect(PRICING_PLANS.length).toBe(4)
    })

    it('should have free, pro, premium, lifetime tiers', () => {
      const tiers = PRICING_PLANS.map((p) => p.tier)
      expect(tiers).toContain('free')
      expect(tiers).toContain('pro')
      expect(tiers).toContain('premium')
      expect(tiers).toContain('lifetime')
    })

    it('should have pro as popular', () => {
      const pro = PRICING_PLANS.find((p) => p.tier === 'pro')
      expect(pro?.popular).toBe(true)
    })

    it('free plan should have price 0', () => {
      const free = PRICING_PLANS.find((p) => p.tier === 'free')
      expect(free?.priceUSD).toBe(0)
    })

    it('lifetime should have one-time interval', () => {
      const lifetime = PRICING_PLANS.find((p) => p.tier === 'lifetime')
      expect(lifetime?.interval).toBe('lifetime')
    })

    it('all plans should have features array', () => {
      PRICING_PLANS.forEach((plan) => {
        expect(Array.isArray(plan.features)).toBe(true)
        expect(plan.features.length).toBeGreaterThan(0)
      })
    })
  })

  describe('payments.getPlans', () => {
    it('should return all plans', () => {
      expect(payments.getPlans().length).toBe(4)
    })
  })

  describe('payments.getPlan', () => {
    it('should return specific plan', () => {
      const plan = payments.getPlan('pro')
      expect(plan?.tier).toBe('pro')
    })

    it('should return undefined for invalid tier', () => {
      expect(payments.getPlan('invalid' as SubscriptionTier)).toBeUndefined()
    })
  })

  describe('payments.createSubscription', () => {
    it('should return completed for free tier', async () => {
      const result = await payments.createSubscription('free', 'user-123')
      expect(result.success).toBe(true)
      expect(result.status).toBe('completed')
    })

    it('should fail for stripe without config', async () => {
      const result = await stripePayments.createCheckoutSession('pro', 'user-123')
      expect(result.success).toBe(false)
      expect(result.error).toContain('not configured')
    })

    it('should fail for nowpayments without config', async () => {
      const result = await nowPayments.createInvoice('pro', 'user-123')
      expect(result.success).toBe(false)
      expect(result.error).toContain('not configured')
    })
  })

  describe('payments.checkStatus', () => {
    it('should return pending for stripe', async () => {
      const result = await payments.checkStatus('test-id', 'stripe')
      expect(result.status).toBe('pending')
    })
  })

  describe('stripePayments.flattenParams', () => {
    it('should flatten nested objects', () => {
      const result = stripePayments.flattenParams({
        a: 1,
        b: { c: 2, d: 3 },
      })
      expect(result['a']).toBe('1')
      expect(result['b[c]']).toBe('2')
      expect(result['b[d]']).toBe('3')
    })

    it('should flatten arrays', () => {
      const result = stripePayments.flattenParams({
        items: [{ price: 'p1', quantity: 1 }],
      })
      expect(result['items[0][price]']).toBe('p1')
      expect(result['items[0][quantity]']).toBe('1')
    })
  })
})
