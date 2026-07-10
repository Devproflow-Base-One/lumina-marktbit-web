'use client'

/**
 * AdSlot Component — Multi-format, multi-network ad display + affiliate banners
 * 
 * Hybrid Model: Crypto + Global Stocks
 * 6 Formats: Display Premium, Display Standard, Social Bar, Native, Video Outstream, Popunder
 * 10+ Networks: HypeLab, Bitmedia, RichAds, Adsterra, Coinzilla, A-ADS, HilltopAds, PopAds, PropellerAds, 7SearchPPC
 * Affiliate: Binance, Bybit, KuCoin (crypto) + Robinhood, Webull, IDX Sekuritas (stock)
 * 
 * Subdomain routing: crypto.marktbit.com → crypto networks, stocks.marktbit.com → stock networks
 * Free tier: shows ads. Ultra Premium: ad-free.
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import { ExternalLink, TrendingUp, X, Play } from 'lucide-react'
import {
  adNetworks,
  affiliateLinks,
  getRandomAffiliate,
  detectSubdomain,
  getNetworksForSubdomain,
  type AdSize,
  type AdFormat,
  type AdSubdomain,
} from '@/lib/ad-config'

type AdSlotSize = AdSize | 'affiliate'

interface AdSlotProps {
  size?: AdSlotSize
  format?: AdFormat
  label?: string
  affiliateName?: string
  dismissible?: boolean
  subdomain?: AdSubdomain
  className?: string
}

const sizeClasses: Record<string, string> = {
  banner: 'min-h-[90px] w-full',
  sidebar: 'min-h-[250px] w-full flex-1',
  inline: 'min-h-[100px] w-full',
  native: 'min-h-[120px] w-full',
  affiliate: 'min-h-[90px] w-full',
}

const formatLabels: Record<AdFormat, string> = {
  'display-premium': 'Display Premium',
  'display-standard': 'Display Standard',
  'social-bar': 'Social Bar',
  'native': 'Native',
  'video-outstream': 'Video Outstream',
  'popunder': 'Popunder',
}

const sizeDimensions: Record<string, string> = {
  banner: '728×90',
  sidebar: '300×250',
  inline: '320×100',
  native: 'Responsive',
  affiliate: '728×90',
}

const networkByFormat: Record<AdFormat, { crypto: string; stocks: string; both: string }> = {
  'display-premium': { crypto: 'HypeLab', stocks: 'RichAds', both: 'HypeLab' },
  'display-standard': { crypto: 'A-ADS', stocks: '7SearchPPC', both: 'A-ADS' },
  'social-bar': { crypto: 'Adsterra', stocks: 'Adsterra', both: 'Adsterra' },
  'native': { crypto: 'Coinzilla', stocks: 'Coinzilla', both: 'Coinzilla' },
  'video-outstream': { crypto: 'HilltopAds', stocks: 'HilltopAds', both: 'HilltopAds' },
  'popunder': { crypto: 'PropellerAds', stocks: 'PopAds', both: 'PropellerAds' },
}

export function AdSlot({
  size = 'banner',
  format,
  label = 'Advertisement',
  affiliateName,
  dismissible = false,
  subdomain,
  className = '',
}: AdSlotProps) {
  const [dismissed, setDismissed] = useState(false)
  const detectedSubdomain = useMemo(() => subdomain ?? detectSubdomain(), [subdomain])
  const [currentAffiliate, setCurrentAffiliate] = useState(() => getRandomAffiliate(detectedSubdomain))
  const adContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (affiliateName) {
      const found = affiliateLinks.find(a => a.name === affiliateName)
      if (found) setCurrentAffiliate(found)
    }
  }, [affiliateName])

  useEffect(() => {
    if (size === 'affiliate' || dismissed) return

    const subdomainNetworks = getNetworksForSubdomain(detectedSubdomain)
    const eligible = format
      ? subdomainNetworks.filter(n => n.format === format && n.publisherId)
      : subdomainNetworks.filter(n => n.publisherId)

    if (eligible.length === 0) return

    const selected = eligible[Math.floor(Math.random() * eligible.length)]

    if (adContainerRef.current) {
      adContainerRef.current.setAttribute('data-ad-network', selected.network)
      adContainerRef.current.setAttribute('data-ad-format', selected.format)
      adContainerRef.current.setAttribute('data-ad-subdomain', detectedSubdomain)
    }
  }, [size, format, dismissed, detectedSubdomain])

  if (dismissed) return null

  // ─── Affiliate Banner ───
  if (size === 'affiliate') {
    return (
      <a
        href={currentAffiliate.referralUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`${sizeClasses.affiliate} rounded-lg border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-yellow-600/5 flex items-center justify-between px-5 py-4 transition-all hover:border-yellow-500/40 hover:from-yellow-500/15 group cursor-pointer`}
        data-affiliate={currentAffiliate.name}
        data-affiliate-type={currentAffiliate.type}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-14 h-14 rounded-lg font-bold text-base flex-shrink-0"
            style={{ backgroundColor: currentAffiliate.color + '20', color: currentAffiliate.color }}
          >
            {currentAffiliate.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-base font-medium text-foreground truncate text-lg">
              {currentAffiliate.type === 'stock' ? 'Trade stocks on' : 'Trade crypto on'} {currentAffiliate.name}
            </p>
            <p className="text-sm text-muted-foreground truncate text-base">
              {currentAffiliate.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-sm text-yellow-500 font-medium hidden sm:inline text-base">Open Account →</span>
          <ExternalLink className="h-5 w-5 text-yellow-500 group-hover:scale-110 transition-transform" />
        </div>
      </a>
    )
  }

  // ─── Video Outstream Format ───
  if (format === 'video-outstream') {
    const videoNetwork = networkByFormat['video-outstream'][detectedSubdomain] || 'HilltopAds'
    return (
      <div
        ref={adContainerRef}
        className={`${sizeClasses[size]} rounded-lg border border-dashed border-blue-500/20 bg-blue-500/5 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden`}
        data-ad-slot={size}
        data-ad-format="video-outstream"
      >
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-1 right-1 text-muted-foreground hover:text-foreground p-1"
            aria-label="Dismiss ad"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <div className="flex flex-col items-center gap-2 h-full justify-center">
          <div className="w-14 h-14 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Play className="h-7 w-7 text-blue-500/60" />
          </div>
          <p className="text-lg font-bold text-blue-500/80">{videoNetwork}</p>
          <p className="text-xs text-blue-500/50 uppercase tracking-wider">Video Outstream · 300×250</p>
          <p className="text-xs text-muted-foreground/50">eCPM $2.40 · payout mingguan (BTC/USDT)</p>
          <div className="mt-auto pt-2 text-[10px] text-muted-foreground/30">{label}</div>
        </div>
      </div>
    )
  }

  // ─── Social Bar Format ───
  if (format === 'social-bar') {
    const socialNetwork = networkByFormat['social-bar'][detectedSubdomain] || 'Adsterra'
    return (
      <div
        ref={adContainerRef}
        className={`${sizeClasses[size]} rounded-lg border border-dashed border-green-500/20 bg-green-500/5 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden`}
        data-ad-slot={size}
        data-ad-format="social-bar"
      >
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="absolute top-1 right-1 text-muted-foreground hover:text-foreground p-1"
            aria-label="Dismiss ad"
          >
            <X className="h-3 w-3" />
          </button>
        )}
        <div className="flex flex-col items-center gap-1 h-full justify-center">
          <p className="text-base font-bold text-green-500/80">{socialNetwork}</p>
          <p className="text-xs text-green-500/50 uppercase tracking-wider">Social Bar · 320×50</p>
          <p className="text-xs text-muted-foreground/50">eCPM up to $25 (video) · no min traffic</p>
          <div className="mt-auto pt-2 text-[10px] text-muted-foreground/30">{label}</div>
        </div>
      </div>
    )
  }

  // ─── Popunder Format (invisible trigger) ───
  if (format === 'popunder') {
    return (
      <div
        ref={adContainerRef}
        className="hidden"
        data-ad-slot="popunder"
        data-ad-format="popunder"
        data-ad-network={detectedSubdomain === 'stocks' ? 'popads' : 'propeller'}
      />
    )
  }

  // ─── Display (Premium/Standard) & Native ───
  const activeFormat = format || 'display-standard'
  const networkInfo = networkByFormat[activeFormat] || networkByFormat['display-standard']
  const primaryNetwork = networkInfo[detectedSubdomain] || networkInfo.both
  const dimensions = sizeDimensions[size] || 'Responsive'

  const ecpmMap: Record<AdFormat, string> = {
    'display-premium': detectedSubdomain === 'crypto' ? '$8-15+ eCPM' : '$2-8 eCPM',
    'display-standard': '$1-4 eCPM',
    'native': '$3-8 eCPM',
    'social-bar': 'up to $25 eCPM',
    'video-outstream': '$2.40 eCPM',
    'popunder': '$2-6 eCPM',
  }

  return (
    <div
      ref={adContainerRef}
      className={`${sizeClasses[size]} ${className} rounded-lg border border-dashed border-yellow-500/20 bg-yellow-500/5 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden`}
      data-ad-slot={size}
      data-ad-format={activeFormat}
    >
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-1 right-1 text-muted-foreground hover:text-foreground p-1"
          aria-label="Dismiss ad"
        >
          <X className="h-3 w-3" />
        </button>
      )}
      <div className="flex flex-col items-center gap-1.5 h-full justify-center">
        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-yellow-500/50" />
        </div>
        <p className="text-lg font-bold text-yellow-500/80">{primaryNetwork}</p>
        <p className="text-xs text-yellow-500/40 uppercase tracking-wider">
          {formatLabels[activeFormat]} · {dimensions}
        </p>
        <p className="text-xs text-muted-foreground/50">{ecpmMap[activeFormat]}</p>
        <div className="mt-auto pt-2 text-[10px] text-muted-foreground/30">
          {label} · {detectedSubdomain}.marktbit.com
        </div>
      </div>
    </div>
  )
}

/**
 * AffiliateCTA — Standalone affiliate call-to-action
 * Place near signal cards: "Open account on Binance"
 * Auto-detects crypto vs stock affiliate based on subdomain
 * NOTE: MarktBit is NOT a trading platform — this is just a referral link
 */
export function AffiliateCTA({
  exchange,
  signalType,
  coin,
  subdomain,
}: {
  exchange?: string
  signalType?: string
  coin?: string
  subdomain?: AdSubdomain
}) {
  const detectedSubdomain = subdomain ?? detectSubdomain()

  const affiliate = exchange
    ? affiliateLinks.find(a => a.name.toLowerCase() === exchange.toLowerCase())
    : getRandomAffiliate(detectedSubdomain)

  if (!affiliate) return null

  const ctaText = `${affiliate.name}`

  return (
    <a
      href={affiliate.referralUrl}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-yellow-500/10 text-yellow-500/80 border border-yellow-500/15 hover:bg-yellow-500/20 transition-colors"
      data-affiliate={affiliate.name}
      data-affiliate-type={affiliate.type}
    >
      <ExternalLink className="h-2.5 w-2.5" />
      {ctaText}
    </a>
  )
}
