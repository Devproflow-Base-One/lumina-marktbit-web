'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { signalAPI, NewListingAlert, AirdropListing } from '@/lib/signal-api'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Rocket, Gift, AlertTriangle, ExternalLink, Clock, Calendar, CheckCircle2, Loader2 } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'
import { Disclaimer } from '@/components/Disclaimer'
import { StreakBadge } from '@/components/StreakBadge'
import { cn } from '@/lib/utils'

function DiscoveryContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || 'new'

  const [activeTab, setActiveTab] = useState<'new' | 'airdrop'>(initialTab as 'new' | 'airdrop')
  const [newListings, setNewListings] = useState<NewListingAlert[]>([])
  const [airdrops, setAirdrops] = useState<AirdropListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadDiscovery() {
      try {
        setLoading(true)
        if (activeTab === 'new') {
          const data = await signalAPI.getNewListings()
          setNewListings(data.listings || [])
        } else {
          const data = await signalAPI.getAirdrops()
          setAirdrops(data.airdrops || [])
        }
      } catch (e: any) {
        setError(e.message || 'Failed to load discovery data')
      } finally {
        setLoading(false)
      }
    }
    loadDiscovery()
  }, [activeTab])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">Market Discovery</h1>
          <p className="text-xl text-muted-foreground">
            New listings and airdrop opportunities — not trading signals
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StreakBadge />
        </div>
      </div>

      <Disclaimer />

      <AdSlot size="banner" dismissible />

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'new' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('new')}
          className={cn(
            'font-mono uppercase tracking-wider text-lg',
            activeTab === 'new'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'border-border text-muted-foreground hover:text-red-400'
          )}
        >
          <Rocket className="h-5 w-5 mr-1" />
          New Listings ({newListings.length})
        </Button>
        <Button
          variant={activeTab === 'airdrop' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('airdrop')}
          className={cn(
            'font-mono uppercase tracking-wider text-lg',
            activeTab === 'airdrop'
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'border-border text-muted-foreground hover:text-cyan-400'
          )}
        >
          <Gift className="h-5 w-5 mr-1" />
          Airdrop Tracker ({airdrops.length})
        </Button>
      </div>

      {error && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <p className="text-base text-red-500">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Discovery endpoints may not be available yet. Signal engine needs to implement{' '}
              <code className="text-yellow-500">/discover/new-listings</code> and{' '}
              <code className="text-yellow-500">/discover/airdrops</code>.
            </p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-pulse text-yellow-500" />
          <span className="ml-2 text-muted-foreground">Loading {activeTab === 'new' ? 'new listings' : 'airdrops'}...</span>
        </div>
      ) : activeTab === 'new' ? (
        <NewListingsView listings={newListings} />
      ) : (
        <AirdropView airdrops={airdrops} />
      )}

      {/* Video outstream ad — HilltopAds ($2.40 eCPM) */}
      <AdSlot size="banner" format="video-outstream" />

      <AdSlot size="sidebar" />
    </div>
  )
}

function NewListingsView({ listings }: { listings: NewListingAlert[] }) {
  if (listings.length === 0) {
    return (
      <Card className="border-border bg-card/90">
        <CardContent className="py-12 text-center text-muted-foreground">
          <Rocket className="h-14 w-14 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No new listings detected in the last 30 days.</p>
          <p className="text-base mt-2">New listings will appear here when detected by the signal engine.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="border-red-500/15 bg-red-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-medium text-red-400">New Listing Alerts — Not Trading Signals</p>
              <p className="text-sm text-muted-foreground mt-1">
                These coins were recently listed and may lack sufficient historical data for accurate technical analysis.
                Extreme volatility and rug-pull risk. Do your own research before considering any investment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((listing) => (
          <Card key={listing.id} className="border-border bg-card/90 hover:border-red-500/20 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{listing.symbol}</CardTitle>
                  <CardDescription className="text-sm">{listing.name}</CardDescription>
                </div>
                <span className="px-2 py-0.5 rounded text-sm border bg-red-500/10 text-red-400 border-red-500/20 font-mono">
                  NEW
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Price</span>
                  <p className="font-semibold text-foreground">
                    ${listing.price < 0.01 ? listing.price.toExponential(2) : listing.price.toFixed(4)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Age</span>
                  <p className="font-semibold text-foreground">{listing.ageDays} days</p>
                </div>
                <div>
                  <span className="text-muted-foreground">24h Change</span>
                  <p className={cn(
                    'font-semibold',
                    listing.change24h > 0 ? 'text-green-400' : listing.change24h < 0 ? 'text-red-400' : 'text-muted-foreground'
                  )}>
                    {listing.change24h > 0 ? '+' : ''}{listing.change24h?.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Volume 24h</span>
                  <p className="font-semibold text-foreground">
                    ${listing.volume24h > 1e6 ? `${(listing.volume24h / 1e6).toFixed(1)}M` : listing.volume24h > 1e3 ? `${(listing.volume24h / 1e3).toFixed(1)}K` : listing.volume24h?.toFixed(0)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Listed: {new Date(listing.listedDate).toLocaleDateString()}
              </div>
              <p className="text-sm text-red-400/80 italic">{listing.warning}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AirdropView({ airdrops }: { airdrops: AirdropListing[] }) {
  if (airdrops.length === 0) {
    return (
      <Card className="border-border bg-card/90">
        <CardContent className="py-12 text-center text-muted-foreground">
          <Gift className="h-14 w-14 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No active airdrops found.</p>
          <p className="text-base mt-2">Airdrop opportunities will appear here when available.</p>
        </CardContent>
      </Card>
    )
  }

  const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    active: 'bg-green-500/10 text-green-400 border-green-500/20',
    claimed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    ended: 'bg-muted text-muted-foreground border-border',
  }

  return (
    <div className="space-y-4">
      <Card className="border-cyan-500/15 bg-cyan-500/5">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <Gift className="h-6 w-6 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-base font-medium text-cyan-400">Airdrop Opportunities</p>
              <p className="text-sm text-muted-foreground mt-1">
                Free token distributions from crypto projects. Always verify requirements on official project channels.
                Never share private keys or send funds to claim airdrops.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {airdrops.map((airdrop) => (
          <Card key={airdrop.id} className="border-border bg-card/90 hover:border-cyan-500/20 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{airdrop.project}</CardTitle>
                  <CardDescription className="text-sm">
                    {airdrop.token} ({airdrop.symbol})
                  </CardDescription>
                </div>
                <span className={cn(
                  'px-2 py-0.5 rounded text-sm border font-mono uppercase',
                  statusColors[airdrop.status] || statusColors.ended
                )}>
                  {airdrop.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{airdrop.description}</p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Est. Value</span>
                  <p className="font-semibold text-foreground">{airdrop.estimatedValue}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Exchange</span>
                  <p className="font-semibold text-foreground">{airdrop.exchange}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {new Date(airdrop.startDate).toLocaleDateString()} — {new Date(airdrop.endDate).toLocaleDateString()}
              </div>

              {airdrop.requirements.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground">Requirements</p>
                  {airdrop.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{req}</span>
                    </div>
                  ))}
                </div>
              )}

              {airdrop.status === 'active' && (
                <Button
                  size="sm"
                  className="w-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20"
                >
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Learn More
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function DiscoveryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-pulse text-yellow-500" />
        <span className="ml-2 text-muted-foreground">Loading discovery...</span>
      </div>
    }>
      <DiscoveryContent />
    </Suspense>
  )
}
