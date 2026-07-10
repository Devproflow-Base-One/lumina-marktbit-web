/**
 * i18n Configuration — English, Indonesian, Arabic (RTL)
 * F4g: Internationalization with RTL support
 *
 * Integrates with next-intl for routing and message loading.
 */

export type Locale = 'en' | 'id' | 'ar'

export interface LocaleConfig {
  code: Locale
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
  flag: string
  dateFormat: string
  numberFormat: string
  currency: string
}

export const LOCALES: Record<Locale, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    flag: '🇬🇧',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: 'en-US',
    currency: 'USD',
  },
  id: {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    direction: 'ltr',
    flag: '🇮🇩',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'id-ID',
    currency: 'IDR',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    flag: '🇸🇦',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: 'ar-SA',
    currency: 'SAR',
  },
}

export const DEFAULT_LOCALE: Locale = 'en'
export const SUPPORTED_LOCALES: Locale[] = ['en', 'id', 'ar']

// ── Translation keys ──

export const TRANSLATION_KEYS = {
  // Navigation
  'nav.home': 'Home',
  'nav.signals': 'Signals',
  'nav.crypto': 'Crypto',
  'nav.stocks': 'Stocks',
  'nav.godMode': 'God Mode',
  'nav.portfolio': 'Portfolio',
  'nav.watchlist': 'Watchlist',
  'nav.alerts': 'Alerts',
  'nav.billing': 'Billing',
  'nav.community': 'Community',
  'nav.settings': 'Settings',

  // Signals
  'signal.buy': 'Buy',
  'signal.sell': 'Sell',
  'signal.hold': 'Hold',
  'signal.strongBuy': 'Strong Buy',
  'signal.strongSell': 'Strong Sell',
  'signal.neutral': 'Neutral',
  'signal.confidence': 'Confidence',
  'signal.riskLevel': 'Risk Level',
  'signal.entryPrice': 'Entry Price',
  'signal.targetPrice': 'Target Price',
  'signal.stopLoss': 'Stop Loss',
  'signal.riskReward': 'Risk/Reward Ratio',

  // Categories
  'category.top': 'Top Coins',
  'category.meme': 'Meme Coins',
  'category.defi': 'DeFi',
  'category.ai': 'AI Tokens',
  'category.gaming': 'Gaming',
  'category.new': 'New Listings',
  'category.airdrop': 'Airdrops',

  // Market
  'market.open': 'Market Open',
  'market.closed': 'Market Closed',
  'market.price': 'Price',
  'market.change24h': '24h Change',
  'market.volume24h': '24h Volume',
  'market.marketCap': 'Market Cap',
  'market.high52': '52-Week High',
  'market.low52': '52-Week Low',

  // Auth
  'auth.login': 'Login',
  'auth.register': 'Register',
  'auth.logout': 'Logout',
  'auth.email': 'Email',
  'auth.password': 'Password',
  'auth.forgotPassword': 'Forgot Password?',
  'auth.magicLink': 'Send Magic Link',
  'auth.google': 'Continue with Google',
  'auth.github': 'Continue with GitHub',

  // Billing
  'billing.free': 'Free',
  'billing.pro': 'Pro',
  'billing.premium': 'Premium',
  'billing.lifetime': 'Lifetime',
  'billing.upgrade': 'Upgrade',
  'billing.currentPlan': 'Current Plan',
  'billing.paymentMethod': 'Payment Method',
  'billing.payWithCard': 'Pay with Card',
  'billing.payWithCrypto': 'Pay with Crypto',
  'billing.subscriptionActive': 'Subscription Active',
  'billing.subscriptionExpired': 'Subscription Expired',

  // Common
  'common.loading': 'Loading...',
  'common.error': 'Something went wrong',
  'common.retry': 'Retry',
  'common.save': 'Save',
  'common.cancel': 'Cancel',
  'common.confirm': 'Confirm',
  'common.delete': 'Delete',
  'common.edit': 'Edit',
  'common.search': 'Search',
  'common.filter': 'Filter',
  'common.all': 'All',
  'common.none': 'None',
} as const

// ── Helper functions ──

export function isRTL(locale: Locale): boolean {
  return LOCALES[locale]?.direction === 'rtl'
}

export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return LOCALES[locale]?.direction || 'ltr'
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(LOCALES[locale]?.numberFormat || 'en-US').format(value)
}

export function formatCurrency(value: number, locale: Locale, currency?: string): string {
  const cur = currency || LOCALES[locale]?.currency || 'USD'
  return new Intl.NumberFormat(LOCALES[locale]?.numberFormat || 'en-US', {
    style: 'currency',
    currency: cur,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDate(date: Date | string, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(LOCALES[locale]?.numberFormat || 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

export function formatTime(date: Date | string, locale: Locale): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(LOCALES[locale]?.numberFormat || 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function formatPercent(value: number, locale: Locale): string {
  const formatted = new Intl.NumberFormat(LOCALES[locale]?.numberFormat || 'en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(value))
  return `${value >= 0 ? '+' : '-'}${formatted}%`
}
