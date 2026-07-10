'use client'

import { useState, useEffect } from 'react'
import { EngineStats, fetchStaticSignals, deriveStatsFromStatic } from '@/lib/signal-api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, Activity, Target, Zap } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'
import { Disclaimer } from '@/components/Disclaimer'
import { StreakBadge } from '@/components/StreakBadge'

export default function PerformancePage() {
  const [stats, setStats] = useState<EngineStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function loadStats() {
      try {
        const result = await fetchStaticSignals()
        if (!mounted) return
        setStats(deriveStatsFromStatic(result.raw))
      } catch (e: any) {
        setError(e.message || 'Failed to load stats')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadStats()
    const interval = setInterval(loadStats, 3000)
    return () => { mounted = false; clearInterval(interval) }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Activity className="h-8 w-8 animate-pulse text-yellow-500" />
        <span className="ml-2 text-muted-foreground">Loading performance data...</span>
      </div>
    )
  }

  const winRateData = stats ? [
    { name: 'Wins', value: stats.winRate || 0, fill: '#22c55e' },
    { name: 'Losses', value: 100 - (stats.winRate || 0), fill: '#ef4444' },
  ] : []

  const signalsData = stats ? [
    { name: 'Today', value: stats.signalsToday || 0 },
    { name: 'Active', value: stats.activeSignals || 0 },
    { name: 'Total', value: stats.totalSignals || 0 },
  ] : []

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">Engine Performance</h1>
          <p className="text-xl text-muted-foreground">Transparent performance metrics — no hiding, no filtering</p>
        </div>
        <StreakBadge />
      </div>

      <Disclaimer />

      <AdSlot size="banner" dismissible />

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-base text-red-500">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Make sure signal engine is running: <code className="text-yellow-500">node src/index.js --mode=loop</code>
          </p>
        </div>
      )}

      {stats && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-muted-foreground">Win Rate</span>
                <Target className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold text-yellow-500">{stats.winRate?.toFixed(1)}%</div>
            </div>
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-muted-foreground">Total Signals</span>
                <Activity className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold">{stats.totalSignals}</div>
            </div>
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-muted-foreground">Avg Confidence</span>
                <TrendingUp className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold">{stats.avgConfidence?.toFixed(0)}%</div>
            </div>
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-muted-foreground">Signals Today</span>
                <Zap className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold">{stats.signalsToday}</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-4">Win / Loss Ratio</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={winRateData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {winRateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-4">Signal Activity</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={signalsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }} />
                  <Bar dataKey="value" fill="#eab308" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold mb-4">Engine Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-base">
              <div>
                <span className="text-muted-foreground">Tracked Coins:</span>
                <span className="ml-2 font-medium">{stats.trackedCoins}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Active Signals:</span>
                <span className="ml-2 font-medium">{stats.activeSignals}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Last Scan:</span>
                <span className="ml-2 font-medium">{stats.lastScanTime ? new Date(stats.lastScanTime).toLocaleString() : 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Uptime:</span>
                <span className="ml-2 font-medium">{stats.uptime || 'N/A'}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Native ad — Coinzilla */}
      <AdSlot size="native" format="native" />

      <AdSlot size="affiliate" />
    </div>
  )
}
