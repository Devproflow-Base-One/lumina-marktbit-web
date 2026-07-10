import { CoinCategory, MAX_CATEGORIES_SELECTED, SIGNAL_CATEGORIES } from './coin-categories'

export type RiskTolerance = 'conservative' | 'balanced' | 'aggressive'

export interface UserPreferences {
  selectedCategories: CoinCategory[]
  maxSignalsPerDay: number
  minConfidence: number
  riskTolerance: RiskTolerance
  newListingAlerts: boolean
  airdropNotifications: boolean
}

const STORAGE_KEY = 'lumina-marktbit-preferences'

const DEFAULT_PREFERENCES: UserPreferences = {
  selectedCategories: ['top', 'meme'],
  maxSignalsPerDay: 10,
  minConfidence: 60,
  riskTolerance: 'balanced',
  newListingAlerts: true,
  airdropNotifications: true,
}

const RISK_PROFILES: Record<RiskTolerance, Partial<UserPreferences>> = {
  conservative: {
    selectedCategories: ['top'],
    minConfidence: 70,
    maxSignalsPerDay: 5,
  },
  balanced: {
    selectedCategories: ['top', 'meme', 'defi'],
    minConfidence: 60,
    maxSignalsPerDay: 10,
  },
  aggressive: {
    selectedCategories: ['top', 'meme', 'defi', 'ai'],
    minConfidence: 40,
    maxSignalsPerDay: 20,
  },
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return DEFAULT_PREFERENCES

    const parsed = JSON.parse(stored) as Partial<UserPreferences>
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed,
      selectedCategories: validateCategories(parsed.selectedCategories || DEFAULT_PREFERENCES.selectedCategories),
    }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function saveUserPreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch (e) {
    console.warn('Failed to save user preferences:', e)
  }
}

export function updatePreferences(partial: Partial<UserPreferences>): UserPreferences {
  const current = getUserPreferences()
  const updated = { ...current, ...partial }

  if (partial.selectedCategories) {
    updated.selectedCategories = validateCategories(partial.selectedCategories)
  }

  saveUserPreferences(updated)
  return updated
}

export function toggleCategory(category: CoinCategory): UserPreferences {
  const current = getUserPreferences()
  let newCategories: CoinCategory[]

  if (current.selectedCategories.includes(category)) {
    newCategories = current.selectedCategories.filter(c => c !== category)
    if (newCategories.length === 0) newCategories = ['top']
  } else {
    if (current.selectedCategories.length >= MAX_CATEGORIES_SELECTED) {
      newCategories = [...current.selectedCategories.slice(1), category]
    } else {
      newCategories = [...current.selectedCategories, category]
    }
  }

  return updatePreferences({ selectedCategories: newCategories })
}

export function setRiskTolerance(tolerance: RiskTolerance): UserPreferences {
  const profile = RISK_PROFILES[tolerance]
  return updatePreferences({
    riskTolerance: tolerance,
    ...profile,
  })
}

function validateCategories(categories: CoinCategory[]): CoinCategory[] {
  const valid = categories.filter(c => SIGNAL_CATEGORIES.includes(c) || c === 'new' || c === 'airdrop')
  if (valid.length === 0) return ['top']
  if (valid.length > MAX_CATEGORIES_SELECTED) return valid.slice(0, MAX_CATEGORIES_SELECTED)
  return valid
}

export function shouldShowSignal(signal: { category?: string; confidence: number }, prefs: UserPreferences): boolean {
  if (!signal.category) return true
  if (!prefs.selectedCategories.includes(signal.category as CoinCategory)) return false
  if (signal.confidence < prefs.minConfidence) return false
  return true
}

export function filterSignalsByPreferences<T extends { category?: string; confidence: number; timestamp: string }>(
  signals: T[],
  prefs: UserPreferences
): T[] {
  const filtered = signals.filter(s => shouldShowSignal(s, prefs))

  const perCategoryLimit: Record<string, number> = {}
  const result: T[] = []

  for (const signal of filtered) {
    const cat = signal.category || 'top'
    perCategoryLimit[cat] = (perCategoryLimit[cat] || 0) + 1

    const maxPerCategory = getCategoryMaxSignals(cat, prefs)
    if (perCategoryLimit[cat] <= maxPerCategory) {
      result.push(signal)
    }
  }

  return result.slice(0, prefs.maxSignalsPerDay)
}

function getCategoryMaxSignals(category: string, prefs: UserPreferences): number {
  const limits: Record<string, number> = {
    top: 10,
    meme: 5,
    defi: 5,
    ai: 3,
    gaming: 3,
    new: 3,
    airdrop: 5,
  }

  if (prefs.riskTolerance === 'aggressive') {
    return (limits[category] || 5) * 2
  }
  if (prefs.riskTolerance === 'conservative') {
    return Math.max(1, Math.floor((limits[category] || 5) / 2))
  }

  return limits[category] || 5
}
