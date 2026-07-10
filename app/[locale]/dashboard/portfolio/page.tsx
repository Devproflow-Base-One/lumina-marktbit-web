'use client'

import { usePortfolioStore } from '@/lib/stores'
import { formatCurrency, formatPercent } from '@/lib/i18n-config'
import { useUserStore } from '@/lib/stores'

export default function PortfolioPage() {
  const { holdings, totalValue, totalPnl, totalPnlPercent, removeHolding } = usePortfolioStore()
  const { locale } = useUserStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-400">Portfolio</h1>
        <button className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400">
          + Add Holding
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totalValue, locale)}</p>
        </div>
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-sm text-muted-foreground">Total P&L</p>
          <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(totalPnl, locale)}
          </p>
        </div>
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-sm text-muted-foreground">P&L %</p>
          <p className={`text-2xl font-bold ${totalPnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercent(totalPnlPercent, locale)}
          </p>
        </div>
      </div>

      {/* Holdings Table */}
      {holdings.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-yellow-500/20 py-20">
          <p className="text-muted-foreground">No holdings yet. Add your first position to start tracking.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-yellow-500/20">
          <table className="w-full text-sm">
            <thead className="bg-yellow-500/10 text-yellow-400">
              <tr>
                <th className="px-4 py-3 text-left">Asset</th>
                <th className="px-4 py-3 text-right">Quantity</th>
                <th className="px-4 py-3 text-right">Avg Buy</th>
                <th className="px-4 py-3 text-right">Current</th>
                <th className="px-4 py-3 text-right">Value</th>
                <th className="px-4 py-3 text-right">P&L</th>
                <th className="px-4 py-3 text-right">P&L %</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.id} className="border-t border-yellow-500/10 hover:bg-yellow-500/5">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{h.symbol}</div>
                    <div className="text-xs text-muted-foreground">{h.name}</div>
                  </td>
                  <td className="px-4 py-3 text-right">{h.quantity}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(h.avgBuyPrice, locale)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(h.currentPrice, locale)}</td>
                  <td className="px-4 py-3 text-right">{formatCurrency(h.totalValue, locale)}</td>
                  <td className={`px-4 py-3 text-right ${h.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(h.pnl, locale)}
                  </td>
                  <td className={`px-4 py-3 text-right ${h.pnlPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatPercent(h.pnlPercent, locale)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => removeHolding(h.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
