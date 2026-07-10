import { describe, it, expect } from 'vitest'
import {
  IDX_STOCKS,
  SECTORS,
  generateStockSignal,
  getMarketStatus,
  type StockMarket,
} from '../stock-signal-engine'
import type { StockQuote } from '../stock-api'
import type { CandleData } from '../crypto-signal-engine'

// ── Helper ──

function generateCandles(count: number, basePrice = 100, volatility = 2): CandleData[] {
  const candles: CandleData[] = []
  let price = basePrice
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.5) * volatility
    const open = price
    const close = price + change
    const high = Math.max(open, close) + Math.random() * volatility * 0.5
    const low = Math.min(open, close) - Math.random() * volatility * 0.5
    candles.push({
      timestamp: now - (count - i) * 900000,
      open,
      high,
      low,
      close,
      volume: 1000000 + Math.random() * 500000,
    })
    price = close
  }
  return candles
}

function mockQuote(overrides: Partial<StockQuote> = {}): StockQuote {
  return {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    market: 'US',
    price: 180,
    change: 2.5,
    changePercent: 1.4,
    volume: 50000000,
    currency: 'USD',
    pe: 28,
    dividend: 0.5,
    high52: 200,
    low52: 150,
    ...overrides,
  }
}

describe('stock-signal-engine', () => {
  describe('IDX_STOCKS', () => {
    it('should have 20 IDX stocks', () => {
      expect(IDX_STOCKS.length).toBe(20)
    })

    it('should include BBCA and BBRI', () => {
      expect(IDX_STOCKS.some((s) => s.symbol === 'BBCA.JK')).toBe(true)
      expect(IDX_STOCKS.some((s) => s.symbol === 'BBRI.JK')).toBe(true)
    })

    it('should all have sector', () => {
      IDX_STOCKS.forEach((stock) => {
        expect(stock.sector).toBeTruthy()
      })
    })
  })

  describe('SECTORS', () => {
    it('should have 15 sectors', () => {
      expect(SECTORS.length).toBe(15)
    })

    it('should include Technology and Banking', () => {
      expect(SECTORS).toContain('Technology')
      expect(SECTORS).toContain('Banking')
    })
  })

  describe('generateStockSignal', () => {
    it('should generate valid stock signal', () => {
      const candles = generateCandles(50)
      const quote = mockQuote()
      const signal = generateStockSignal(quote, candles, 'Technology')

      expect(signal.id).toBeTruthy()
      expect(signal.symbol).toBe('AAPL')
      expect(signal.name).toBe('Apple Inc.')
      expect(signal.market).toBe('US')
      expect(['BUY', 'SELL', 'HOLD']).toContain(signal.signalType)
      expect(signal.confidence).toBeGreaterThanOrEqual(0)
      expect(signal.confidence).toBeLessThanOrEqual(100)
      expect(signal.sector).toBe('Technology')
      expect(signal.currency).toBe('USD')
      expect(signal.indicators).toBeDefined()
      expect(signal.scoreBreakdown.length).toBe(11)
    })

    it('should have risk level', () => {
      const candles = generateCandles(50)
      const signal = generateStockSignal(mockQuote(), candles, 'Banking')
      expect(['LOW', 'MEDIUM', 'HIGH']).toContain(signal.riskLevel)
    })

    it('should include reason string', () => {
      const candles = generateCandles(50)
      const signal = generateStockSignal(mockQuote(), candles, 'Technology')
      expect(signal.reason).toBeTruthy()
      expect(typeof signal.reason).toBe('string')
    })

    it('should have target and stop loss for BUY', () => {
      const uptrendCandles: CandleData[] = []
      let price = 100
      for (let i = 0; i < 50; i++) {
        uptrendCandles.push({
          timestamp: Date.now() - (50 - i) * 900000,
          open: price,
          high: price + 2,
          low: price - 0.5,
          close: price + 1.5,
          volume: 2000000,
        })
        price += 1.5
      }
      const signal = generateStockSignal(mockQuote({ price: 180 }), uptrendCandles, 'Technology')
      if (signal.signalType === 'BUY') {
        expect(signal.targetPrice).toBeGreaterThan(signal.price)
        expect(signal.stopLoss).toBeLessThan(signal.price)
        expect(signal.riskRewardRatio).toBeGreaterThan(0)
      }
    })

    it('should handle IDX stocks', () => {
      const candles = generateCandles(50, 8000, 100)
      const quote = mockQuote({
        symbol: 'BBCA.JK',
        name: 'Bank Central Asia',
        market: 'ID' as StockMarket,
        price: 8500,
        currency: 'IDR',
        pe: 18,
        dividend: 2.5,
      })
      const signal = generateStockSignal(quote, candles, 'Banking')
      expect(signal.symbol).toBe('BBCA.JK')
      expect(signal.market).toBe('ID')
      expect(signal.currency).toBe('IDR')
    })
  })

  describe('getMarketStatus', () => {
    it('should return isOpen boolean', () => {
      const status = getMarketStatus('US')
      expect(typeof status.isOpen).toBe('boolean')
      expect(status.nextOpen).toBeTruthy()
      expect(status.nextClose).toBeTruthy()
    })

    it('should handle all major markets', () => {
      const markets: StockMarket[] = ['US', 'UK', 'DE', 'JP', 'HK', 'ID', 'AU']
      markets.forEach((market) => {
        const status = getMarketStatus(market)
        expect(status).toBeDefined()
        expect(typeof status.isOpen).toBe('boolean')
      })
    })

    it('should return Unknown for unsupported market', () => {
      const status = getMarketStatus('AFRICA' as StockMarket)
      expect(status.nextOpen).toBe('Unknown')
    })
  })
})
