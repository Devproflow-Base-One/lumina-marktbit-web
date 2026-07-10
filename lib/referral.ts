/**
 * Referral System — "Invite 3 friends = 3 months free when paid"
 * Generates unique referral links and tracks invites
 */

const REFERRAL_STORAGE_KEY = 'marktbit_referral_code'
const REFERRAL_COUNT_KEY = 'marktbit_referral_count'
const REFERRAL_REWARD_THRESHOLD = 3
const REFERRAL_REWARD_MONTHS = 3

export function generateReferralCode(): string {
  if (typeof window === 'undefined') return 'CBSSR000'
  const stored = localStorage.getItem(REFERRAL_STORAGE_KEY)
  if (stored) return stored

  const code = 'CB' + Math.random().toString(36).substring(2, 8).toUpperCase()
  localStorage.setItem(REFERRAL_STORAGE_KEY, code)
  localStorage.setItem(REFERRAL_COUNT_KEY, '0')
  return code
}

export function getReferralLink(): string {
  const code = generateReferralCode()
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://marktbit.app'
  return `${baseUrl}/?ref=${code}`
}

export function getReferralCount(): number {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem(REFERRAL_COUNT_KEY) || '0', 10)
}

export function incrementReferralCount(): void {
  const count = getReferralCount() + 1
  localStorage.setItem(REFERRAL_COUNT_KEY, count.toString())
}

export function getReferralProgress(): {
  count: number
  threshold: number
  rewardMonths: number
  isEligible: boolean
  remaining: number
} {
  const count = getReferralCount()
  return {
    count,
    threshold: REFERRAL_REWARD_THRESHOLD,
    rewardMonths: REFERRAL_REWARD_MONTHS,
    isEligible: count >= REFERRAL_REWARD_THRESHOLD,
    remaining: Math.max(0, REFERRAL_REWARD_THRESHOLD - count),
  }
}

export function checkReferralSignup(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const refCode = params.get('ref')
  return refCode
}
