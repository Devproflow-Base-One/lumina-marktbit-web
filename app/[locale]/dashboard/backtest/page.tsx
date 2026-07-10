'use client'

import { useState, useEffect } from 'react'
import { signalAPI, BacktestResult } from '@/lib/signal-api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { History, TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { AdSlot } from '@/components/AdSlot'
import { Disclaimer } from '@/components/Disclaimer'
import { StreakBadge } from '@/components/StreakBadge'

export default function BacktestPage() {
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [coin, setCoin] = useState('bitcoin')
  const [days, setDays] = useState(90)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function runBacktest() {
    setLoading(true)
    setError(null)
    try {
      const data = await signalAPI.getBacktest(coin, days)
      setResult(data.result)
    } catch (e: any) {
      setError(e.message || 'Failed to run backtest')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runBacktest()
  }, [])

  const equityCurve = result?.trades?.map((t, i) => ({
    trade: i + 1,
    pnl: t.pnl,
    cumulative: result.trades.slice(0, i + 1).reduce((sum, tr) => sum + tr.pnl, 0),
  })) || []

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-bold">Backtest Results</h1>
          <p className="text-xl text-muted-foreground">Historical strategy performance — full transparency, no cherry-picking</p>
        </div>
        <StreakBadge />
      </div>

      <Disclaimer />

      <AdSlot size="banner" dismissible />

      <div className="flex gap-4 items-end">
        <div>
          <label className="text-base text-muted-foreground block mb-1">Coin</label>
          <select
            value={coin}
            onChange={(e) => setCoin(e.target.value)}
            className="border rounded px-3 py-2 bg-background text-foreground text-base"
          >
            <option value="bitcoin">Bitcoin (BTC)</option>
            <option value="ethereum">Ethereum (ETH)</option>
            <option value="solana">Solana (SOL)</option>
            <option value="binancecoin">BNB</option>
            <option value="cardano">Cardano (ADA)</option>
            <option value="dogecoin">Dogecoin (DOGE)</option>
          </select>
        </div>
        <div>
          <label className="text-base text-muted-foreground block mb-1">Days</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="border rounded px-3 py-2 bg-background text-foreground text-base"
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
            <option value={180}>180 days</option>
          </select>
        </div>
        <button
          onClick={runBacktest}
          disabled={loading}
          className="px-4 py-2 bg-yellow-500 text-black rounded font-medium hover:bg-yellow-400 disabled:opacity-50 text-base"
        >
          {loading ? 'Running...' : 'Run Backtest'}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-base text-red-500">{error}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Make sure signal engine is running: <code className="text-yellow-500">node src/index.js --mode=backtest</code>
          </p>
        </div>
      )}

      {result && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-muted-foreground">Total Return</span>
                {result.totalReturn >= 0 ? <TrendingUp className="h-5 w-5 text-green-500" /> : <TrendingDown className="h-5 w-5 text-red-500" />}
              </div>
              <div className={`text-4xl font-bold ${result.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {result.totalReturn >= 0 ? '+' : ''}{result.totalReturn?.toFixed(2)}%
              </div>
            </div>
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-muted-foreground">Win Rate</span>
                <Activity className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold text-yellow-500">{result.winRate?.toFixed(1)}%</div>
            </div>
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-muted-foreground">Profit Factor</span>
                <History className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="text-4xl font-bold">{result.profitFactor?.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base text-muted-foreground">Max Drawdown</span>
                <TrendingDown className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-4xl font-bold text-red-500">{result.maxDrawdown?.toFixed(2)}%</div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-4">Equity Curve</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="trade" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }} />
                  <Line type="monotone" dataKey="cumulative" stroke="#eab308" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="text-xl font-semibold mb-4">Trade P&L Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={equityCurve}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="trade" stroke="#888" fontSize={12} />
                  <YAxis stroke="#888" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333' }} />
                  <Bar dataKey="pnl" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="text-xl font-semibold mb-4">Trade History ({result.totalTrades} trades)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-lg">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 text-base uppercase tracking-wider">#</th>
                    <th className="text-left py-2 px-2 text-base uppercase tracking-wider">Type</th>
                    <th className="text-left py-2 px-2 text-base uppercase tracking-wider">Entry Date</th>
                    <th className="text-left py-2 px-2 text-base uppercase tracking-wider">Exit Date</th>
                    <th className="text-right py-2 px-2 text-base uppercase tracking-wider">Entry Price</th>
                    <th className="text-right py-2 px-2 text-base uppercase tracking-wider">Exit Price</th>
                    <th className="text-right py-2 px-2 text-base uppercase tracking-wider">P&L</th>
                  </tr>
                </thead>
                <tbody>
                  {result.trades?.map((t, i) => (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-2 text-muted-foreground text-base">{i + 1}</td>
                      <td className="py-2 px-2">
                        <span className={t.type === 'BUY' ? 'text-green-500' : 'text-red-500'}>{t.type}</span>
                      </td>
                      <td className="py-2 px-2 text-muted-foreground text-sm">{new Date(t.entryDate).toLocaleDateString()}</td>
                      <td className="py-2 px-2 text-muted-foreground text-sm">{new Date(t.exitDate).toLocaleDateString()}</td>
                      <td className="py-2 px-2 text-right">${t.entryPrice?.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right">${t.exitPrice?.toFixed(2)}</td>
                      <td className={`py-2 px-2 text-right font-medium ${t.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {t.pnl >= 0 ? '+' : ''}{t.pnl?.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Affiliate CTA — broker signup */}
      <AdSlot size="affiliate" />

      <AdSlot size="sidebar" />
    </div>
  )
}
