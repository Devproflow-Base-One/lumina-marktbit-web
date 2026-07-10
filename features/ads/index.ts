/**
 * Ads Feature Module
 * 
 * Components: AdSlot, StickyAdBar
 * Config: ad-networks, ad-config
 */

export { AdSlot, AffiliateCTA } from '@/components/AdSlot'
export { StickyAdBar } from '@/components/StickyAdBar'
export { adNetworks, affiliateLinks, adSizes, detectSubdomain, getNetworksForSubdomain, getNetworksByFormat, getAffiliatesByType, getActiveAdNetworks, getRandomAffiliate, getAffiliateByName } from '@/lib/ad-config'
export type { AdFormat, AdNetwork, AdSize, AdSubdomain, AdNetworkConfig, AffiliateConfig } from '@/lib/ad-config'
