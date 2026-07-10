'use client'

import { useState, useEffect, useMemo } from 'react'
import { Signal, fetchStaticSignals } from '@/lib/signal-api'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Minus, Activity, AlertTriangle, Filter } from 'lucide-react'
import { AdSlot, AffiliateCTA } from '@/components/AdSlot'
import { Disclaimer } from '@/components/Disclaimer'
import { StreakBadge } from '@/components/StreakBadge'
import { COIN_CATEGORIES, SIGNAL_CATEGORIES, CoinCategory, getCategoryBadgeClass, getCategoryConfig } from '@/lib/coin-categories'
import { getUserPreferences, toggleCategory, filterSignalsByPreferences, UserPreferences } from '@/lib/user-preferences'
import { cn } from '@/lib/utils'

export default function SignalsPage() {
  const [signals, setSignals] = useState<Signal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prefs, setPrefs] = useState<UserPreferences | null>(null)
  const [activeFilter, setActiveFilter] = useState<CoinCategory | 'all'>('all')
  const [showPrefsPanel, setShowPrefsPanel] = useState(false)

  useEffect(() => {
    setPrefs(getUserPreferences())
  }, [])

  useEffect(() => {
    let mounted = true
    async function loadSignals() {
      try {
        const data = await fetchStaticSignals()
        if (!mounted) return
        setSignals(data.signals || [])
      } catch (e: any) {
        setError(e.message || 'Failed to load signals')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadSignals()
    const interval = setInterval(loadSignals, 3000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  const handleToggleCategory = (cat: CoinCategory) => {
    const updated = toggleCategory(cat)
    setPrefs(updated)
  }

  const filteredSignals = useMemo(() => {
    if (!prefs) return signals
    let result = filterSignalsByPreferences(signals, prefs)
    if (activeFilter !== 'all') {
      result = result.filter(s => (s.category || 'top') === activeFilter)
    }
    return result
  }, [signals, prefs, activeFilter])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    signals.forEach(s => {
      const cat = s.category || 'top'
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [signals])

  const getSignalIcon = (type: string) => {
    if (type.includes('BUY')) return <TrendingUp className="h-5 w-5 text-green-500" />
    if (type.includes('SELL')) return <TrendingDown className="h-5 w-5 text-red-500" />
    return <Minus className="h-5 w-5 text-yellow-500" />
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 75) return 'bg-green-500/10 text-green-500 border-green-500/20'
    if (conf >= 50) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    return 'bg-red-500/10 text-red-500 border-red-500/20'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 animate-pulse text-yellow-500" />
        <span className="ml-2 text-muted-foreground">Loading signals...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">Signal History</h1>
          <p className="text-xl text-muted-foreground">Transparent record of all generated signals</p>
        </div>
        <div className="flex items-center gap-2">
          <StreakBadge />
          <Badge variant="outline" className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
            <Activity className="mr-1 h-4 w-4" />
            Live
          </Badge>
        </div>
      </div>

      <Disclaimer />

      <AdSlot size="banner" dismissible />

      {error && (
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="pt-6">
            <p className="text-base text-red-500">{error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure signal engine is running: <code className="text-yellow-500">node src/index.js --mode=loop</code>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={activeFilter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveFilter('all')}
          className={cn(
            'font-mono uppercase tracking-wider text-lg',
            activeFilter === 'all'
              ? 'bg-yellow-500 text-black hover:bg-yellow-400'
              : 'border-border text-muted-foreground hover:text-yellow-500'
          )}
        >
          All ({signals.length})
        </Button>
        {SIGNAL_CATEGORIES.map(cat => {
          const config = COIN_CATEGORIES[cat]
          const isActive = activeFilter === cat
          const isSelected = prefs?.selectedCategories.includes(cat)
          const count = categoryCounts[cat] || 0

          return (
            <Button
              key={cat}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(isActive ? 'all' : cat)}
              className={cn(
                'font-mono uppercase tracking-wider text-lg',
                isActive
                  ? `${config.badgeBg} ${config.badgeColor} ${config.badgeBorder} border`
                  : 'border-border text-muted-foreground hover:text-foreground',
                !isSelected && 'opacity-50'
              )}
            >
              {config.shortLabel} ({count})
            </Button>
          )
        })}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPrefsPanel(!showPrefsPanel)}
          className="ml-auto font-mono uppercase tracking-wider text-lg text-muted-foreground hover:text-yellow-500"
        >
          <Filter className="h-4 w-4 mr-1" />
          Preferences
        </Button>
      </div>

      {/* Preferences Panel */}
      {showPrefsPanel && prefs && (
        <Card className="border-yellow-500/15 bg-card/90">
          <CardHeader>
            <CardTitle className="text-2xl font-mono uppercase tracking-wider">Signal Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-lg text-muted-foreground mb-2">
                Select up to 4 categories (max {4 - prefs.selectedCategories.length} remaining)
              </p>
              <div className="flex flex-wrap gap-2">
                {SIGNAL_CATEGORIES.map(cat => {
                  const config = COIN_CATEGORIES[cat]
                  const isSelected = prefs.selectedCategories.includes(cat)
                  return (
                    <button
                      key={cat}
                      onClick={() => handleToggleCategory(cat)}
                      className={cn(
                        'px-3 py-2 rounded-lg text-lg font-mono uppercase tracking-wider border transition-all',
                        isSelected
                          ? `${config.badgeBg} ${config.badgeColor} ${config.badgeBorder}`
                          : 'border-border text-muted-foreground hover:bg-accent'
                      )}
                    >
                      {isSelected ? '✓ ' : ''}{config.label}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <label className="text-lg text-muted-foreground font-mono uppercase tracking-wider">Max signals/day</label>
                <p className="text-xl font-semibold text-foreground">{prefs.maxSignalsPerDay}</p>
              </div>
              <div>
                <label className="text-lg text-muted-foreground font-mono uppercase tracking-wider">Min confidence</label>
                <p className="text-xl font-semibold text-foreground">{prefs.minConfidence}%</p>
              </div>
              <div>
                <label className="text-lg text-muted-foreground font-mono uppercase tracking-wider">Risk tolerance</label>
                <p className="text-xl font-semibold text-foreground capitalize">{prefs.riskTolerance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <AdSlot size="affiliate" />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl">
              Recent Signals ({filteredSignals.length})
              {activeFilter !== 'all' && (
                <span className={cn('ml-2 text-sm px-2 py-0.5 rounded border', getCategoryBadgeClass(activeFilter))}>
                  {getCategoryConfig(activeFilter)?.label}
                </span>
              )}
            </CardTitle>
            <AffiliateCTA signalType="BUY" coin="BTC" />
          </div>
        </CardHeader>
        <CardContent>
          {filteredSignals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Activity className="h-14 w-14 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No signals match your current filters.</p>
              <p className="text-base mt-2">Try adjusting your category preferences or confidence threshold.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xl">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 text-lg uppercase tracking-wider">Type</th>
                    <th className="text-left py-3 px-2 text-lg uppercase tracking-wider">Coin</th>
                    <th className="text-left py-3 px-2 text-lg uppercase tracking-wider">Category</th>
                    <th className="text-right py-3 px-2 text-lg uppercase tracking-wider">Price</th>
                    <th className="text-right py-3 px-2 text-lg uppercase tracking-wider">Confidence</th>
                    <th className="text-left py-3 px-2 text-lg uppercase tracking-wider">Risk</th>
                    <th className="text-left py-3 px-2 text-lg uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-2 text-lg uppercase tracking-wider">Outcome</th>
                    <th className="text-left py-3 px-2 text-lg uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSignals.map((s, i) => {
                    const cat = s.category || 'top'
                    const catConfig = getCategoryConfig(cat)
                    return (
                      <tr key={i} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-2">
                            {getSignalIcon(s.type)}
                            <span className={s.type.includes('BUY') ? 'text-green-500 font-medium' : s.type.includes('SELL') ? 'text-red-500 font-medium' : 'text-yellow-500 font-medium'}>
                              {s.type}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 font-medium text-xl">{s.symbol || s.coin}</td>
                        <td className="py-3 px-2">
                          {catConfig && (
                            <span className={cn('px-2 py-0.5 rounded text-lg border font-mono', getCategoryBadgeClass(cat))}>
                              {catConfig.shortLabel}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right">${s.price?.toFixed(2)}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`px-2 py-1 rounded text-lg border ${getConfidenceColor(s.confidence)}`}>
                            {s.confidence}%
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          {s.riskLevel && (
                            <span className={cn(
                              'text-sm font-medium',
                              s.riskLevel === 'HIGH' ? 'text-red-400' : s.riskLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'
                            )}>
                              {s.riskLevel === 'HIGH' && <AlertTriangle className="inline h-4 w-4 mr-1" />}
                              {s.riskLevel}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className="text-lg">{s.status}</Badge>
                        </td>
                        <td className="py-3 px-2 text-right">
                          {s.outcome === 'win' && <span className="text-green-500">+{s.pnlPercent?.toFixed(1)}%</span>}
                          {s.outcome === 'loss' && <span className="text-red-500">{s.pnlPercent?.toFixed(1)}%</span>}
                          {s.outcome === 'pending' && <span className="text-muted-foreground">Pending</span>}
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-lg">
                          {new Date(s.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Native ad — Coinzilla */}
      <AdSlot size="native" format="native" />

      <AdSlot size="sidebar" />
    </div>
  )
}
