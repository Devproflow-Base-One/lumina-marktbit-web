/**
 * Subscription tier system for MarktBit
 * Controls AI Assistant access and ad visibility
 */

export type SubscriptionTier = 'free' | 'basic' | 'pro' | 'enterprise'

export interface SubscriptionInfo {
  tier: SubscriptionTier
  isActive: boolean
  hasSignalBot: boolean
  hasAIAssistant: boolean
  adFree: boolean
  maxBacktestDays: number
  maxSignalsPerDay: number
  expiresAt: string | null
}

const TIER_FEATURES: Record<SubscriptionTier, Omit<SubscriptionInfo, 'isActive' | 'expiresAt'>> = {
  free: {
    tier: 'free',
    hasSignalBot: false,
    hasAIAssistant: false,
    adFree: false,
    maxBacktestDays: 30,
    maxSignalsPerDay: 10,
  },
  basic: {
    tier: 'basic',
    hasSignalBot: true,
    hasAIAssistant: true,
    adFree: false,
    maxBacktestDays: 90,
    maxSignalsPerDay: 50,
  },
  pro: {
    tier: 'pro',
    hasSignalBot: true,
    hasAIAssistant: true,
    adFree: true,
    maxBacktestDays: 180,
    maxSignalsPerDay: 200,
  },
  enterprise: {
    tier: 'enterprise',
    hasSignalBot: true,
    hasAIAssistant: true,
    adFree: true,
    maxBacktestDays: 365,
    maxSignalsPerDay: -1,
  },
}

const TIER_PRICES: Record<SubscriptionTier, { monthly: number; yearly: number; label: string }> = {
  free: { monthly: 0, yearly: 0, label: 'Free' },
  basic: { monthly: 29, yearly: 290, label: 'Basic' },
  pro: { monthly: 99, yearly: 990, label: 'Pro' },
  enterprise: { monthly: 299, yearly: 2990, label: 'Enterprise' },
}

export function getTierFeatures(tier: SubscriptionTier): Omit<SubscriptionInfo, 'isActive' | 'expiresAt'> {
  return TIER_FEATURES[tier] || TIER_FEATURES.free
}

export function getTierPrice(tier: SubscriptionTier) {
  return TIER_PRICES[tier] || TIER_PRICES.free
}

export function getAllTiers() {
  return Object.entries(TIER_PRICES).map(([key, val]) => ({
    tier: key as SubscriptionTier,
    ...val,
    features: TIER_FEATURES[key as SubscriptionTier],
  }))
}

/**
 * Fetch current user's subscription from API
 * Falls back to 'free' if not authenticated or API unavailable
 */
export async function fetchSubscription(): Promise<SubscriptionInfo> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_SIGNAL_API_URL || 'http://localhost:8787/api/v1'
    const res = await fetch(`${apiUrl}/user/subscription`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Failed to fetch subscription')
    const data = await res.json()
    return {
      ...getTierFeatures(data.tier || 'free'),
      isActive: data.is_active ?? false,
      expiresAt: data.expires_at ?? null,
    }
  } catch {
    return {
      ...getTierFeatures('free'),
      isActive: false,
      expiresAt: null,
    }
  }
}

/**
 * Check if AI Assistant should be visible
 * Only show if user has an active signal bot subscription
 */
export function shouldShowAIAssistant(sub: SubscriptionInfo): boolean {
  return sub.hasSignalBot && sub.hasAIAssistant && sub.isActive
}

/**
 * Check if ads should be shown
 * Free and Basic tiers see ads; Pro and Enterprise are ad-free
 */
export function shouldShowAds(sub: SubscriptionInfo): boolean {
  return !sub.adFree
}
