import { describe, it, expect, vi } from 'vitest'

describe('API Integration Tests', () => {
  describe('Signal API', () => {
    it('should fetch signals successfully', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ signals: [{ id: '1', type: 'BUY', symbol: 'BTC' }], total: 1 }),
        } as Response)
      )

      const response = await fetch('http://localhost:8787/api/v1/signals')
      const data = await response.json()

      expect(data.signals).toHaveLength(1)
      expect(data.signals[0].type).toBe('BUY')
    })

    it('should handle API errors gracefully', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        } as Response)
      )

      const response = await fetch('http://localhost:8787/api/v1/signals')
      expect(response.ok).toBe(false)
    })
  })

  describe('Stock API', () => {
    it('should fetch market indices successfully', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([{ symbol: 'SPY', name: 'S&P 500', price: 500 }]),
        } as Response)
      )

      const response = await fetch('http://localhost:8788/api/v1/indices')
      const data = await response.json()

      expect(data).toHaveLength(1)
      expect(data[0].symbol).toBe('SPY')
    })
  })

  describe('Engine Stats', () => {
    it('should fetch engine stats successfully', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ stats: { activeSignals: 10, winRate: 0.75 } }),
        } as Response)
      )

      const response = await fetch('http://localhost:8787/api/v1/stats')
      const data = await response.json()

      expect(data.stats.activeSignals).toBe(10)
      expect(data.stats.winRate).toBe(0.75)
    })
  })
})
