'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { signalAPI, Signal, EngineStats } from '@/lib/signal-api'
import { Activity, TrendingUp, TrendingDown, Zap, Target, Clock, Globe, Landmark, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AdSlot, AffiliateCTA } from '@/components/AdSlot'

const CATEGORY_TABS = [
  { id: 'crypto', label: 'Crypto', icon: Zap, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  { id: 'saham', label: 'Saham ID', icon: Landmark, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
  { id: 'us', label: 'US Stocks', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/30' },
  { id: 'europe', label: 'Europe', icon: Building2, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { id: 'asia', label: 'Asia', icon: Globe, color: 'text-cyan-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
] as const

export default function DashboardWorkspace() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const validTabs = ['crypto', 'saham', 'us', 'europe', 'asia']
  const initialTab = tabParam && validTabs.includes(tabParam) ? tabParam : 'crypto'

  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const [signals, setSignals] = useState<Signal[]>([])
  const [stats, setStats] = useState<EngineStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [signalsRes, statsRes] = await Promise.all([
          signalAPI.getSignals(20).catch(() => ({ signals: [], total: 0 })),
          signalAPI.getStats().catch(() => ({ stats: null })),
        ])
        setSignals(signalsRes.signals || [])
        setStats(statsRes.stats || null)
      } catch {
        // silent fail
      } finally {
        setLoading(false)
      }
    }
    loadData()
    const interval = setInterval(loadData, 60000)
    return () => clearInterval(interval)
  }, [])

  const filteredSignals = signals.filter(s => {
    const cat = String(s.category || 'crypto')
    if (activeTab === 'crypto') return cat === 'crypto' || !s.category
    if (activeTab === 'saham') return cat === 'stocks-id'
    if (activeTab === 'us') return cat === 'stocks-us'
    if (activeTab === 'europe') return cat === 'stocks-eu'
    if (activeTab === 'asia') return cat === 'stocks-asia'
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hybrid signal intelligence — Crypto, Saham ID, US, Europe, Asia
          </p>
        </div>
        {stats && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Engine Online</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Signals"
          value={stats?.totalSignals?.toString() || '—'}
          icon={Zap}
        />
        <StatCard
          label="Active"
          value={stats?.activeSignals?.toString() || '—'}
          icon={Activity}
        />
        <StatCard
          label="Win Rate"
          value={stats?.winRate ? `${stats.winRate}%` : '—'}
          icon={Target}
        />
        <StatCard
          label="Tracked Coins"
          value={stats?.trackedCoins?.toString() || '—'}
          icon={TrendingUp}
        />
      </div>

      {/* Market Selector — Pill Buttons */}
      <div className="flex flex-wrap gap-2">
        {CATEGORY_TABS.map(tab => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border',
                isActive
                  ? cn(tab.bg, tab.color, tab.border, 'scale-105 shadow-sm')
                  : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground hover:scale-105'
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {isActive && (
                <span className={cn('ml-1 text-xs px-1.5 py-0.5 rounded-full', tab.bg, tab.color)}>
                  {filteredSignals.length}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Premium Display Ad — HypeLab/Bitmedia ($5-15 eCPM) */}
      <AdSlot size="banner" format="display-premium" dismissible />

      {/* Signal List with native ads inserted */}
      <SignalList signals={filteredSignals} loading={loading} />

      {/* Affiliate CTA — Binance/Bybit/KuCoin CPA */}
      <AdSlot size="affiliate" />

      {/* Popunder trigger — Propeller/PopAds ($2-6 eCPM, passive) */}
      <AdSlot format="popunder" />
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
      </CardContent>
    </Card>
  )
}

function SignalList({ signals, loading }: { signals: Signal[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (signals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Activity className="h-8 w-8 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No signals yet. Engine is scanning...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {signals.map((signal, i) => (
        <div key={signal.id} className="space-y-3">
          <SignalRow signal={signal} />
          {/* Native ad every 3 signals — Coinzilla ($0.85-3 eCPM) */}
          {(i + 1) % 3 === 0 && i < signals.length - 1 && (
            <AdSlot size="native" format="native" />
          )}
        </div>
      ))}
    </div>
  )
}

function SignalRow({ signal }: { signal: Signal }) {
  const isBuy = signal.type.includes('BUY')
  const isSell = signal.type.includes('SELL')

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
            isBuy ? 'bg-green-500/10' : isSell ? 'bg-red-500/10' : 'bg-yellow-500/10'
          }`}>
            {isBuy ? (
              <TrendingUp className="h-5 w-5 text-green-500" />
            ) : isSell ? (
              <TrendingDown className="h-5 w-5 text-red-500" />
            ) : (
              <Activity className="h-5 w-5 text-yellow-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                {signal.symbol || signal.coin}
              </span>
              <Badge variant={isBuy ? 'default' : isSell ? 'destructive' : 'secondary'}>
                {signal.type}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground mt-0.5">
              ${signal.price?.toLocaleString() || '—'}
              {signal.confidence && (
                <span className="ml-3">Confidence: {signal.confidence}%</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(signal.timestamp).toLocaleTimeString()}
            </div>
            {signal.timeframe && (
              <div className="text-xs text-muted-foreground mt-0.5">{signal.timeframe}</div>
            )}
          </div>
          {/* Affiliate CTA per signal — CPA $20-100 */}
          <AffiliateCTA signalType={signal.type} coin={signal.symbol || signal.coin} />
        </div>
      </CardContent>
    </Card>
  )
}
