export type CoinCategory = 'top' | 'meme' | 'defi' | 'ai' | 'gaming' | 'new' | 'airdrop'

export interface CategoryConfig {
  id: CoinCategory
  label: string
  shortLabel: string
  description: string
  badgeColor: string
  badgeBg: string
  badgeBorder: string
  textColor: string
  maxSignalsPerDay: number
  minConfidence: number
  riskMultiplier: number
  coingeckoCategory: string | null
  topN: number
  isSignal: boolean
  isAlert: boolean
}

export const COIN_CATEGORIES: Record<CoinCategory, CategoryConfig> = {
  top: {
    id: 'top',
    label: 'Top Coins',
    shortLabel: 'TOP',
    description: 'BTC, ETH, SOL, BNB and other top market cap coins',
    badgeColor: 'text-yellow-400',
    badgeBg: 'bg-yellow-500/10',
    badgeBorder: 'border-yellow-500/20',
    textColor: 'text-yellow-400',
    maxSignalsPerDay: 10,
    minConfidence: 60,
    riskMultiplier: 1.0,
    coingeckoCategory: null,
    topN: 20,
    isSignal: true,
    isAlert: false,
  },
  meme: {
    id: 'meme',
    label: 'Meme Coins',
    shortLabel: 'MEME',
    description: 'DOGE, SHIB, PEPE, WIF and community-driven tokens',
    badgeColor: 'text-orange-400',
    badgeBg: 'bg-orange-500/10',
    badgeBorder: 'border-orange-500/20',
    textColor: 'text-orange-400',
    maxSignalsPerDay: 5,
    minConfidence: 55,
    riskMultiplier: 1.5,
    coingeckoCategory: 'meme-token',
    topN: 15,
    isSignal: true,
    isAlert: false,
  },
  defi: {
    id: 'defi',
    label: 'DeFi',
    shortLabel: 'DEFI',
    description: 'UNI, AAVE, CRV, LDO and decentralized finance tokens',
    badgeColor: 'text-blue-400',
    badgeBg: 'bg-blue-500/10',
    badgeBorder: 'border-blue-500/20',
    textColor: 'text-blue-400',
    maxSignalsPerDay: 5,
    minConfidence: 60,
    riskMultiplier: 1.2,
    coingeckoCategory: 'decentralized-finance-defi',
    topN: 15,
    isSignal: true,
    isAlert: false,
  },
  ai: {
    id: 'ai',
    label: 'AI Tokens',
    shortLabel: 'AI',
    description: 'FET, AGIX, RNDR, OCEAN and AI-related projects',
    badgeColor: 'text-purple-400',
    badgeBg: 'bg-purple-500/10',
    badgeBorder: 'border-purple-500/20',
    textColor: 'text-purple-400',
    maxSignalsPerDay: 3,
    minConfidence: 60,
    riskMultiplier: 1.3,
    coingeckoCategory: 'artificial-intelligence',
    topN: 10,
    isSignal: true,
    isAlert: false,
  },
  gaming: {
    id: 'gaming',
    label: 'Gaming',
    shortLabel: 'GAME',
    description: 'AXS, SAND, GALA, IMX and blockchain gaming tokens',
    badgeColor: 'text-green-400',
    badgeBg: 'bg-green-500/10',
    badgeBorder: 'border-green-500/20',
    textColor: 'text-green-400',
    maxSignalsPerDay: 3,
    minConfidence: 60,
    riskMultiplier: 1.3,
    coingeckoCategory: 'gaming',
    topN: 10,
    isSignal: true,
    isAlert: false,
  },
  new: {
    id: 'new',
    label: 'New Listings',
    shortLabel: 'NEW',
    description: 'Recently listed coins — alerts only, not trading signals',
    badgeColor: 'text-red-400',
    badgeBg: 'bg-red-500/10',
    badgeBorder: 'border-red-500/20',
    textColor: 'text-red-400',
    maxSignalsPerDay: 3,
    minConfidence: 0,
    riskMultiplier: 2.0,
    coingeckoCategory: null,
    topN: 10,
    isSignal: false,
    isAlert: true,
  },
  airdrop: {
    id: 'airdrop',
    label: 'Airdrop Tracker',
    shortLabel: 'DROP',
    description: 'Active and upcoming airdrop opportunities',
    badgeColor: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/10',
    badgeBorder: 'border-cyan-500/20',
    textColor: 'text-cyan-400',
    maxSignalsPerDay: 5,
    minConfidence: 0,
    riskMultiplier: 0,
    coingeckoCategory: null,
    topN: 5,
    isSignal: false,
    isAlert: true,
  },
}

export const SIGNAL_CATEGORIES: CoinCategory[] = ['top', 'meme', 'defi', 'ai', 'gaming']
export const ALERT_CATEGORIES: CoinCategory[] = ['new', 'airdrop']
export const ALL_CATEGORIES: CoinCategory[] = [...SIGNAL_CATEGORIES, ...ALERT_CATEGORIES]

export const MAX_CATEGORIES_SELECTED = 4

export function getCategoryConfig(category: string): CategoryConfig | null {
  return COIN_CATEGORIES[category as CoinCategory] || null
}

export function getCategoryBadgeClass(category: string): string {
  const config = getCategoryConfig(category)
  if (!config) return 'bg-muted text-muted-foreground border-border'
  return `${config.badgeBg} ${config.badgeColor} ${config.badgeBorder}`
}

export function isSignalCategory(category: string): boolean {
  const config = getCategoryConfig(category)
  return config?.isSignal ?? false
}

export function isAlertCategory(category: string): boolean {
  const config = getCategoryConfig(category)
  return config?.isAlert ?? false
}
