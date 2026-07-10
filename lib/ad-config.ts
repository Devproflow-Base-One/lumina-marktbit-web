/**
 * Ad Network Configuration — MarktBit
 * 
 * Hybrid Model: Crypto + Global Stocks
 * 12+ Networks across 6 Ad Formats
 * Subdomain routing: crypto.marktbit.com vs stocks.marktbit.com
 * 
 * === HIGHEST eCPM NETWORKS 2026 ===
 * 1. HypeLab      — $8-15+ display, $20-30+ video (crypto, #1 dunia)
 *    Daftar: https://www.hypelab.com/for-publishers
 * 2. Adsterra     — up to $25 CPM video, no min traffic
 *    Daftar: https://adsterra.com/publishers/
 * 3. A-ADS        — $1-4, NO verification, langsung aktif
 *    Daftar: https://a-ads.com/
 * 4. Bitmedia     — $4-8 crypto display premium
 *    Daftar: https://bitmedia.io/
 * 5. Coinzilla    — $3-8 native crypto
 *    Daftar: https://coinzilla.com/
 * 6. PropellerAds — $2-6 popunder, auto-approve
 *    Daftar: https://propellerads.com/publishers/
 * 7. HilltopAds   — $2.40 video outstream, payout MINGGUAN
 *    Daftar: https://hilltopads.com/publishers
 * 8. PopAds       — $2-5 popunder, instant approve
 *    Daftar: https://www.popads.net/
 * 9. Coin.Network — $5-10 crypto premium (by BuySellAds)
 *    Daftar: https://coin.network/publishers
 * 10. AdMaven     — popunder & push, aggressive monetization
 *     Daftar: https://ad-maven.com/
 * 11. RichAds     — $2-8 stocks display premium
 *     Daftar: https://richads.com/
 * 12. RITS Ads    — $2-5, 300+ DSP, easy approve
 *     Daftar: https://ritsads.com/
 * 
 * Crypto Affiliate: Binance, Bybit, KuCoin
 * Stock Affiliate: Robinhood, Webull, IDX Sekuritas
 * 
 * Free tier sees ads. Ultra Premium = ad-free.
 * During 12-month free period, all users see ads.
 */

// ─── Ad Formats ───
export type AdFormat =
  | 'display-premium'
  | 'display-standard'
  | 'social-bar'
  | 'native'
  | 'video-outstream'
  | 'popunder'

export type AdNetwork =
  | 'hypelab'
  | 'bitmedia'
  | 'richads'
  | 'adsterra'
  | 'coinzilla'
  | 'a-ads'
  | 'hilltopads'
  | 'popads'
  | 'propeller'
  | 'coinnetwork'
  | 'admaven'
  | 'ritsads'
  | '7searchppc'
  | 'affiliate'

export type AdSize = 'banner' | 'sidebar' | 'inline' | 'native'
export type AdSubdomain = 'crypto' | 'stocks'

export interface AdNetworkConfig {
  network: AdNetwork
  enabled: boolean
  format: AdFormat
  subdomain: AdSubdomain | 'both'
  publisherId?: string
  zoneId?: string
  scriptUrl?: string
  ecpm: string
  signupUrl?: string
  priority?: number
}

export interface AffiliateConfig {
  name: string
  referralUrl: string
  cpa: number
  color: string
  logo: string
  description: string
  type: 'crypto' | 'stock'
}

// ─── Ad Networks (10+ networks, 6 formats) ───
export const adNetworks: Record<AdNetwork, AdNetworkConfig> = {
  // ── Crypto Subdomain Networks ──
  hypelab: {
    network: 'hypelab',
    enabled: true,
    format: 'display-premium',
    subdomain: 'crypto',
    publisherId: process.env.NEXT_PUBLIC_HYPELAB_PUB_ID || '',
    scriptUrl: '//cdn.hypelab.com/js/ads.js',
    ecpm: '$8-15+ display, $20-30+ video',
    signupUrl: 'https://www.hypelab.com/for-publishers',
    priority: 1,
  },
  bitmedia: {
    network: 'bitmedia',
    enabled: true,
    format: 'display-premium',
    subdomain: 'crypto',
    publisherId: process.env.NEXT_PUBLIC_BITMEDIA_PUB_ID || '',
    zoneId: process.env.NEXT_PUBLIC_BITMEDIA_ZONE_ID || '',
    scriptUrl: '//cdn.bitmedia.io/js/ads.js',
    ecpm: '$4-8',
    signupUrl: 'https://bitmedia.io/',
    priority: 2,
  },
  coinzilla: {
    network: 'coinzilla',
    enabled: true,
    format: 'native',
    subdomain: 'crypto',
    publisherId: process.env.NEXT_PUBLIC_COINZILLA_PUB_ID || '',
    zoneId: process.env.NEXT_PUBLIC_COINZILLA_ZONE_ID || '',
    scriptUrl: '//coinzilla.com/cj/?',
    ecpm: '$3-8',
    signupUrl: 'https://coinzilla.com/',
    priority: 4,
  },
  'a-ads': {
    network: 'a-ads',
    enabled: true,
    format: 'display-standard',
    subdomain: 'crypto',
    publisherId: process.env.NEXT_PUBLIC_AADS_PUB_ID || '',
    zoneId: process.env.NEXT_PUBLIC_AADS_ZONE_ID || '',
    ecpm: '$1-4',
    signupUrl: 'https://a-ads.com/',
    priority: 5,
  },
  // ── Stocks Subdomain Networks ──
  richads: {
    network: 'richads',
    enabled: true,
    format: 'display-premium',
    subdomain: 'stocks',
    publisherId: process.env.NEXT_PUBLIC_RICHADS_PUB_ID || '',
    zoneId: process.env.NEXT_PUBLIC_RICHADS_ZONE_ID || '',
    ecpm: '$2-8',
    signupUrl: 'https://richads.com/',
    priority: 3,
  },
  adsterra: {
    network: 'adsterra',
    enabled: true,
    format: 'social-bar',
    subdomain: 'both',
    publisherId: process.env.NEXT_PUBLIC_ADSTERRA_PUB_ID || '',
    zoneId: process.env.NEXT_PUBLIC_ADSTERRA_ZONE_ID || '',
    ecpm: 'up to $25 (video), $1.50-2.80 (social)',
    signupUrl: 'https://adsterra.com/publishers/',
    priority: 2,
  },
  hilltopads: {
    network: 'hilltopads',
    enabled: true,
    format: 'video-outstream',
    subdomain: 'both',
    publisherId: process.env.NEXT_PUBLIC_HILLTOPADS_PUB_ID || '',
    zoneId: process.env.NEXT_PUBLIC_HILLTOPADS_ZONE_ID || '',
    ecpm: '$2.40 (payout MINGGUAN, crypto: BTC/USDT)',
    signupUrl: 'https://hilltopads.com/publishers',
    priority: 6,
  },
  popads: {
    network: 'popads',
    enabled: true,
    format: 'popunder',
    subdomain: 'both',
    publisherId: process.env.NEXT_PUBLIC_POPADS_PUB_ID || '',
    zoneId: process.env.NEXT_PUBLIC_POPADS_ZONE_ID || '',
    ecpm: '$2-5 (instant approve)',
    signupUrl: 'https://www.popads.net/',
    priority: 7,
  },
  propeller: {
    network: 'propeller',
    enabled: true,
    format: 'popunder',
    subdomain: 'both',
    publisherId: process.env.NEXT_PUBLIC_PROPELLER_PUB_ID || '',
    zoneId: process.env.NEXT_PUBLIC_PROPELLER_ZONE_ID || '',
    ecpm: '$2-6 (auto-approve, no min traffic)',
    signupUrl: 'https://propellerads.com/publishers/',
    priority: 6,
  },
  '7searchppc': {
    network: '7searchppc',
    enabled: true,
    format: 'display-standard',
    subdomain: 'stocks',
    publisherId: process.env.NEXT_PUBLIC_7SEARCHPPC_PUB_ID || '',
    zoneId: process.env.NEXT_PUBLIC_7SEARCHPPC_ZONE_ID || '',
    ecpm: '$0.5-3',
    signupUrl: 'https://www.7searchppc.com/',
    priority: 10,
  },
  // ── NEW: Premium Networks 2026 ──
  coinnetwork: {
    network: 'coinnetwork',
    enabled: true,
    format: 'display-premium',
    subdomain: 'crypto',
    publisherId: process.env.NEXT_PUBLIC_COINNETWORK_PUB_ID || '',
    ecpm: '$5-10 (by BuySellAds, 20+ tier-1 demand)',
    signupUrl: 'https://coin.network/publishers',
    priority: 3,
  },
  admaven: {
    network: 'admaven',
    enabled: true,
    format: 'popunder',
    subdomain: 'both',
    publisherId: process.env.NEXT_PUBLIC_ADMAVEN_PUB_ID || '',
    zoneId: process.env.NEXT_PUBLIC_ADMAVEN_ZONE_ID || '',
    ecpm: '$3-8 (aggressive monetization, push+pop)',
    signupUrl: 'https://ad-maven.com/',
    priority: 5,
  },
  ritsads: {
    network: 'ritsads',
    enabled: true,
    format: 'display-standard',
    subdomain: 'both',
    publisherId: process.env.NEXT_PUBLIC_RITSADS_PUB_ID || '',
    ecpm: '$2-5 (300+ DSP, easy approve)',
    signupUrl: 'https://ritsads.com/',
    priority: 8,
  },
  affiliate: {
    network: 'affiliate',
    enabled: true,
    format: 'native',
    subdomain: 'both',
    ecpm: 'CPA',
  },
}

// ─── Affiliate Links (Crypto + Stock Brokers) ───
export const affiliateLinks: AffiliateConfig[] = [
  // ── Crypto Exchanges ──
  {
    name: 'Binance',
    referralUrl: process.env.NEXT_PUBLIC_BINANCE_REF || 'https://www.binance.com/en/register',
    cpa: 30,
    color: '#F0B90B',
    logo: 'Binance',
    description: 'Trade BTC, ETH & 300+ coins. Lowest fees, highest liquidity.',
    type: 'crypto',
  },
  {
    name: 'Bybit',
    referralUrl: process.env.NEXT_PUBLIC_BYBIT_REF || 'https://www.bybit.com/register',
    cpa: 25,
    color: '#F7A600',
    logo: 'Bybit',
    description: 'Derivatives trading with up to 100x leverage. Fast execution.',
    type: 'crypto',
  },
  {
    name: 'KuCoin',
    referralUrl: process.env.NEXT_PUBLIC_KUCOIN_REF || 'https://www.kucoin.com/register',
    cpa: 20,
    color: '#24AE8F',
    logo: 'KuCoin',
    description: 'Discover new gems early. 700+ trading pairs available.',
    type: 'crypto',
  },
  // ── Stock Brokers (US) ──
  {
    name: 'Robinhood',
    referralUrl: process.env.NEXT_PUBLIC_ROBINHOOD_REF || 'https://robinhood.com/us/en/support/getting-started/',
    cpa: 15,
    color: '#00C805',
    logo: 'Robinhood',
    description: 'Commission-free stock, ETF & options trading. Get a free stock.',
    type: 'stock',
  },
  {
    name: 'Webull',
    referralUrl: process.env.NEXT_PUBLIC_WEBULL_REF || 'https://www.webull.com/introduction',
    cpa: 100,
    color: '#0078FF',
    logo: 'Webull',
    description: 'Zero-commission US stocks, options & ETFs. Advanced charts.',
    type: 'stock',
  },
  // ── Stock Brokers (Indonesia/IDX) ──
  {
    name: 'IDX Sekuritas',
    referralUrl: process.env.NEXT_PUBLIC_IDX_SEKURITAS_REF || 'https://www.idx.co.id',
    cpa: 12,
    color: '#E63946',
    logo: 'IDX',
    description: 'Trade saham Indonesia (IDX). RDN integration, low fees.',
    type: 'stock',
  },
]

// ─── Ad Sizes ───
export const adSizes: Record<AdSize, { width: number; height: number; label: string }> = {
  banner: { width: 728, height: 90, label: 'Leaderboard 728×90' },
  sidebar: { width: 300, height: 250, label: 'Medium Rectangle 300×250' },
  inline: { width: 320, height: 100, label: 'Mobile Banner 320×100' },
  native: { width: 0, height: 0, label: 'Native / Responsive' },
}

// ─── Subdomain Detection ───
export function detectSubdomain(): AdSubdomain {
  if (typeof window === 'undefined') return 'crypto'
  const host = window.location.hostname
  if (host.startsWith('stocks.')) return 'stocks'
  return 'crypto'
}

// ─── Get networks for current subdomain ───
export function getNetworksForSubdomain(subdomain: AdSubdomain): AdNetworkConfig[] {
  return Object.values(adNetworks).filter(
    n => n.enabled && (n.subdomain === subdomain || n.subdomain === 'both')
  )
}

// ─── Get networks by format ───
export function getNetworksByFormat(format: AdFormat, subdomain?: AdSubdomain): AdNetworkConfig[] {
  const networks = subdomain
    ? getNetworksForSubdomain(subdomain)
    : Object.values(adNetworks).filter(n => n.enabled)
  return networks.filter(n => n.format === format)
}

// ─── Get affiliates by type ───
export function getAffiliatesByType(type: 'crypto' | 'stock'): AffiliateConfig[] {
  return affiliateLinks.filter(a => a.type === type)
}

// ─── Helpers ───
export function getActiveAdNetworks(): AdNetworkConfig[] {
  return Object.values(adNetworks).filter(n => n.enabled)
}

export function getRandomAffiliate(subdomain?: AdSubdomain): AffiliateConfig {
  const filtered = subdomain
    ? affiliateLinks.filter(a => a.type === subdomain || a.type === (subdomain === 'crypto' ? 'crypto' : 'stock'))
    : affiliateLinks
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export function getAffiliateByName(name: string): AffiliateConfig | undefined {
  return affiliateLinks.find(a => a.name === name)
}
