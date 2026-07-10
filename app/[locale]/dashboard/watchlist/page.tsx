'use client'

import { useWatchlistStore } from '@/lib/stores'

export default function WatchlistPage() {
  const { items, removeFromWatchlist } = useWatchlistStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-yellow-400">Watchlist</h1>
        <span className="text-sm text-muted-foreground">{items.length} items</span>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-yellow-500/20 py-20">
          <p className="text-muted-foreground">Your watchlist is empty. Add assets from the signals page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.symbol}
              className="flex items-center justify-between rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4 hover:bg-yellow-500/10"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-yellow-400">{item.symbol}</span>
                  {item.category && (
                    <span className="rounded bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-400">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.type}</p>
              </div>
              <button
                onClick={() => removeFromWatchlist(item.symbol)}
                className="rounded-lg border border-red-500/20 px-3 py-1 text-xs text-red-400 hover:bg-red-500/10"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
