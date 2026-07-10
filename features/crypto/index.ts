/**
 * Crypto Feature Module
 * 
 * Components: CryptoAssistant, CryptoSignals
 * Utils: coin-categories, crypto API
 */

export { default as CryptoAssistant } from '@/components/CryptoAssistant'
export { COIN_CATEGORIES, SIGNAL_CATEGORIES, ALERT_CATEGORIES, ALL_CATEGORIES, getCategoryConfig, getCategoryBadgeClass, isSignalCategory, isAlertCategory } from '@/lib/coin-categories'
export type { CoinCategory, CategoryConfig } from '@/lib/coin-categories'
