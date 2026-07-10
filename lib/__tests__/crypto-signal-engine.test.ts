import { describe, it, expect } from 'vitest'
import {
  calculateRSI,
  calculateSMA,
  calculateEMA,
  calculateMACD,
  calculateBollingerBands,
  calculateStochastic,
  calculateATR,
  calculateAllIndicators,
  generateSignal,
  TRACKED_COINS,
  getTrackedCoinsByCategory,
  getTotalTrackedCoins,
  type CandleData,
} from '../crypto-signal-engine'

// ── Helper: Generate mock candle data ──

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
    const volume = 1000000 + Math.random() * 500000
    candles.push({
      timestamp: now - (count - i) * 900000,
      open,
      high,
      low,
      close,
      volume,
    })
    price = close
  }
  return candles
}

// ── Tracked Coins ──

describe('TRACKED_COINS', () => {
  it('should have 45+ tracked coins', () => {
    expect(getTotalTrackedCoins()).toBeGreaterThanOrEqual(45)
  })

  it('should have 5 categories', () => {
    const categories = new Set(TRACKED_COINS.map((c) => c.category))
    expect(categories.size).toBe(5)
    expect(categories.has('top')).toBe(true)
    expect(categories.has('meme')).toBe(true)
    expect(categories.has('defi')).toBe(true)
    expect(categories.has('ai')).toBe(true)
    expect(categories.has('gaming')).toBe(true)
  })

  it('should have 20 top coins', () => {
    expect(getTrackedCoinsByCategory('top').length).toBe(20)
  })

  it('should have BTC and ETH in top category', () => {
    const top = getTrackedCoinsByCategory('top')
    expect(top.some((c) => c.symbol === 'BTC')).toBe(true)
    expect(top.some((c) => c.symbol === 'ETH')).toBe(true)
  })
})

// ── RSI ──

describe('calculateRSI', () => {
  it('should return 50 for insufficient data', () => {
    expect(calculateRSI([], 14)).toBe(50)
    expect(calculateRSI(generateCandles(5), 14)).toBe(50)
  })

  it('should return value between 0 and 100', () => {
    const candles = generateCandles(30)
    const rsi = calculateRSI(candles, 14)
    expect(rsi).toBeGreaterThanOrEqual(0)
    expect(rsi).toBeLessThanOrEqual(100)
  })

  it('should return 100 when no losses', () => {
    const candles: CandleData[] = []
    let price = 100
    for (let i = 0; i < 20; i++) {
      candles.push({
        timestamp: Date.now() - (20 - i) * 900000,
        open: price,
        high: price + 1,
        low: price,
        close: price + 1,
        volume: 1000000,
      })
      price += 1
    }
    expect(calculateRSI(candles, 14)).toBe(100)
  })
})

// ── SMA ──

describe('calculateSMA', () => {
  it('should calculate simple moving average', () => {
    const values = [1, 2, 3, 4, 5]
    expect(calculateSMA(values, 5)).toBe(3)
  })

  it('should handle period larger than data', () => {
    const values = [1, 2, 3]
    const sma = calculateSMA(values, 5)
    expect(sma).toBeCloseTo(2, 5)
  })
})

// ── EMA ──

describe('calculateEMA', () => {
  it('should calculate exponential moving average', () => {
    const values = [10, 20, 30, 40, 50]
    const ema = calculateEMA(values, 5)
    expect(ema).toBeGreaterThan(0)
    expect(ema).toBeLessThan(50)
  })

  it('should return last value for insufficient data', () => {
    const values = [42]
    expect(calculateEMA(values, 12)).toBe(42)
  })
})

// ── MACD ──

describe('calculateMACD', () => {
  it('should return line, signal, and histogram', () => {
    const candles = generateCandles(40)
    const macd = calculateMACD(candles)
    expect(macd).toHaveProperty('line')
    expect(macd).toHaveProperty('signal')
    expect(macd).toHaveProperty('histogram')
    expect(typeof macd.line).toBe('number')
  })
})

// ── Bollinger Bands ──

describe('calculateBollingerBands', () => {
  it('should return upper, middle, and lower bands', () => {
    const candles = generateCandles(25)
    const bb = calculateBollingerBands(candles)
    expect(bb).toHaveProperty('upper')
    expect(bb).toHaveProperty('middle')
    expect(bb).toHaveProperty('lower')
    expect(bb.upper).toBeGreaterThan(bb.middle)
    expect(bb.middle).toBeGreaterThan(bb.lower)
  })
})

// ── Stochastic ──

describe('calculateStochastic', () => {
  it('should return k and d values between 0 and 100', () => {
    const candles = generateCandles(20)
    const stoch = calculateStochastic(candles)
    expect(stoch.k).toBeGreaterThanOrEqual(0)
    expect(stoch.k).toBeLessThanOrEqual(100)
  })

  it('should return default 50 for insufficient data', () => {
    expect(calculateStochastic([])).toEqual({ k: 50, d: 50 })
  })
})

// ── ATR ──

describe('calculateATR', () => {
  it('should return positive value for volatile data', () => {
    const candles = generateCandles(20, 100, 5)
    const atr = calculateATR(candles)
    expect(atr).toBeGreaterThan(0)
  })

  it('should return 0 for insufficient data', () => {
    expect(calculateATR([])).toBe(0)
    expect(calculateATR([generateCandles(1)[0]])).toBe(0)
  })
})

// ── All Indicators ──

describe('calculateAllIndicators', () => {
  it('should return all indicator values', () => {
    const candles = generateCandles(50)
    const indicators = calculateAllIndicators(candles)
    expect(indicators).toHaveProperty('rsi')
    expect(indicators).toHaveProperty('macd')
    expect(indicators).toHaveProperty('ma')
    expect(indicators).toHaveProperty('bollinger')
    expect(indicators).toHaveProperty('stochastic')
    expect(indicators).toHaveProperty('atr')
    expect(indicators).toHaveProperty('volume')
    expect(indicators).toHaveProperty('trend')
  })

  it('should detect trend direction', () => {
    const uptrendCandles: CandleData[] = []
    let price = 100
    for (let i = 0; i < 50; i++) {
      uptrendCandles.push({
        timestamp: Date.now() - (50 - i) * 900000,
        open: price,
        high: price + 2,
        low: price - 0.5,
        close: price + 1,
        volume: 1000000,
      })
      price += 1
    }
    const indicators = calculateAllIndicators(uptrendCandles)
    expect(indicators.trend.direction).toBe('up')
  })
})

// ── Signal Generation ──

describe('generateSignal', () => {
  it('should generate a valid signal', () => {
    const candles = generateCandles(50)
    const coin = { symbol: 'BTC', name: 'Bitcoin', category: 'top' as const }
    const marketData = { price: 50000, change24h: 2.5, volume24h: 30000000, marketCap: 1000000000 }
    const signal = generateSignal(coin, candles, marketData)

    expect(signal).toHaveProperty('id')
    expect(signal).toHaveProperty('symbol', 'BTC')
    expect(signal).toHaveProperty('name', 'Bitcoin')
    expect(signal).toHaveProperty('type')
    expect(signal).toHaveProperty('confidence')
    expect(signal.confidence).toBeGreaterThanOrEqual(0)
    expect(signal.confidence).toBeLessThanOrEqual(100)
    expect(signal).toHaveProperty('indicators')
    expect(signal).toHaveProperty('scoreBreakdown')
    expect(signal.scoreBreakdown.length).toBe(7)
  })

  it('should have valid signal type', () => {
    const candles = generateCandles(50)
    const signal = generateSignal(
      { symbol: 'ETH', name: 'Ethereum', category: 'top' as const },
      candles,
      { price: 3000, change24h: 1, volume24h: 20000000, marketCap: 500000000 }
    )
    expect(['STRONG_BUY', 'BUY', 'NEUTRAL', 'SELL', 'STRONG_SELL']).toContain(signal.type)
  })

  it('should have risk level', () => {
    const candles = generateCandles(50)
    const signal = generateSignal(
      { symbol: 'DOGE', name: 'Dogecoin', category: 'meme' as const },
      candles,
      { price: 0.1, change24h: 5, volume24h: 5000000, marketCap: 50000000 }
    )
    expect(['LOW', 'MEDIUM', 'HIGH']).toContain(signal.riskLevel)
  })

  it('should have entry, target, and stop loss for BUY signals', () => {
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
    const signal = generateSignal(
      { symbol: 'SOL', name: 'Solana', category: 'top' as const },
      uptrendCandles,
      { price: 150, change24h: 8, volume24h: 5000000, marketCap: 50000000000 }
    )
    if (signal.type === 'BUY' || signal.type === 'STRONG_BUY') {
      expect(signal.entryPrice).toBeGreaterThan(0)
      expect(signal.targetPrice).toBeGreaterThan(signal.entryPrice)
      expect(signal.stopLoss).toBeLessThan(signal.entryPrice)
      expect(signal.riskRewardRatio).toBeGreaterThan(0)
    }
  })
})
