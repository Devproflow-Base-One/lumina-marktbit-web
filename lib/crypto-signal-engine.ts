/**
 * Crypto Signal Engine — Technical Analysis & Signal Generation
 * F4a: 45+ coins across 5 categories (top, meme, defi, ai, gaming)
 *
 * Generates BUY/SELL/HOLD signals using:
 * - RSI (Relative Strength Index)
 * - MACD (Moving Average Convergence Divergence)
 * - Bollinger Bands
 * - Moving Averages (MA20, MA50, MA200)
 * - Stochastic Oscillator
 * - ATR (Average True Range) for risk
 * - Volume analysis
 *
 * Signal scoring: weighted composite of all indicators
 */

import { CoinCategory, COIN_CATEGORIES } from './coin-categories'

// ── Types ──

export type SignalType = 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL'
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'

export interface CandleData {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface TechnicalIndicators {
  rsi: number
  macd: { line: number; signal: number; histogram: number }
  ma: { ma20: number; ma50: number; ma200: number }
  bollinger: { upper: number; middle: number; lower: number }
  stochastic: { k: number; d: number }
  atr: number
  volume: { current: number; average: number; ratio: number }
  trend: { direction: 'up' | 'down' | 'sideways'; strength: number }
}

export interface CryptoSignal {
  id: string
  symbol: string
  name: string
  category: CoinCategory
  type: SignalType
  confidence: number
  price: number
  entryPrice: number
  targetPrice: number
  stopLoss: number
  riskRewardRatio: number
  riskLevel: RiskLevel
  indicators: TechnicalIndicators
  scoreBreakdown: Array<{ label: string; score: number; weight: number }>
  timestamp: string
  timeframe: string
  change24h: number
  volume24h: number
  marketCap: number
}

// ── Tracked Coins (45+) ──

export const TRACKED_COINS: Array<{ symbol: string; name: string; category: CoinCategory }> = [
  // Top (20)
  { symbol: 'BTC', name: 'Bitcoin', category: 'top' },
  { symbol: 'ETH', name: 'Ethereum', category: 'top' },
  { symbol: 'SOL', name: 'Solana', category: 'top' },
  { symbol: 'BNB', name: 'BNB', category: 'top' },
  { symbol: 'XRP', name: 'Ripple', category: 'top' },
  { symbol: 'ADA', name: 'Cardano', category: 'top' },
  { symbol: 'AVAX', name: 'Avalanche', category: 'top' },
  { symbol: 'DOT', name: 'Polkadot', category: 'top' },
  { symbol: 'LINK', name: 'Chainlink', category: 'top' },
  { symbol: 'MATIC', name: 'Polygon', category: 'top' },
  { symbol: 'TRX', name: 'TRON', category: 'top' },
  { symbol: 'LTC', name: 'Litecoin', category: 'top' },
  { symbol: 'BCH', name: 'Bitcoin Cash', category: 'top' },
  { symbol: 'NEAR', name: 'NEAR Protocol', category: 'top' },
  { symbol: 'UNI', name: 'Uniswap', category: 'top' },
  { symbol: 'ATOM', name: 'Cosmos', category: 'top' },
  { symbol: 'XLM', name: 'Stellar', category: 'top' },
  { symbol: 'ICP', name: 'Internet Computer', category: 'top' },
  { symbol: 'FIL', name: 'Filecoin', category: 'top' },
  { symbol: 'HBAR', name: 'Hedera', category: 'top' },

  // Meme (10)
  { symbol: 'DOGE', name: 'Dogecoin', category: 'meme' },
  { symbol: 'SHIB', name: 'Shiba Inu', category: 'meme' },
  { symbol: 'PEPE', name: 'Pepe', category: 'meme' },
  { symbol: 'WIF', name: 'dogwifhat', category: 'meme' },
  { symbol: 'BONK', name: 'Bonk', category: 'meme' },
  { symbol: 'FLOKI', name: 'Floki', category: 'meme' },
  { symbol: 'MEME', name: 'Memecoin', category: 'meme' },
  { symbol: 'BOME', name: 'Book of Meme', category: 'meme' },
  { symbol: 'SLERF', name: 'Slerf', category: 'meme' },
  { symbol: 'PNUT', name: 'Peanut the Squirrel', category: 'meme' },

  // DeFi (8)
  { symbol: 'AAVE', name: 'Aave', category: 'defi' },
  { symbol: 'CRV', name: 'Curve DAO', category: 'defi' },
  { symbol: 'LDO', name: 'Lido DAO', category: 'defi' },
  { symbol: 'MKR', name: 'Maker', category: 'defi' },
  { symbol: 'COMP', name: 'Compound', category: 'defi' },
  { symbol: 'SUSHI', name: 'SushiSwap', category: 'defi' },
  { symbol: 'CAKE', name: 'PancakeSwap', category: 'defi' },
  { symbol: 'DYDX', name: 'dYdX', category: 'defi' },

  // AI (5)
  { symbol: 'FET', name: 'Fetch.ai', category: 'ai' },
  { symbol: 'RENDER', name: 'Render', category: 'ai' },
  { symbol: 'OCEAN', name: 'Ocean Protocol', category: 'ai' },
  { symbol: 'TAO', name: 'Bittensor', category: 'ai' },
  { symbol: 'GRT', name: 'The Graph', category: 'ai' },

  // Gaming (5)
  { symbol: 'AXS', name: 'Axie Infinity', category: 'gaming' },
  { symbol: 'SAND', name: 'The Sandbox', category: 'gaming' },
  { symbol: 'GALA', name: 'Gala', category: 'gaming' },
  { symbol: 'IMX', name: 'Immutable X', category: 'gaming' },
  { symbol: 'BEAM', name: 'Beam', category: 'gaming' },
]

// ── Technical Indicator Calculations ──

export function calculateRSI(candles: CandleData[], period = 14): number {
  if (candles.length < period + 1) return 50
  let gains = 0
  let losses = 0
  for (let i = candles.length - period; i < candles.length; i++) {
    const change = candles[i].close - candles[i - 1].close
    if (change > 0) gains += change
    else losses -= change
  }
  const avgGain = gains / period
  const avgLoss = losses / period
  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return 100 - 100 / (1 + rs)
}

export function calculateEMA(values: number[], period: number): number {
  if (values.length < period) return values[values.length - 1] || 0
  const k = 2 / (period + 1)
  let ema = values[0]
  for (let i = 1; i < values.length; i++) {
    ema = values[i] * k + ema * (1 - k)
  }
  return ema
}

export function calculateSMA(values: number[], period: number): number {
  if (values.length < period) return values.reduce((a, b) => a + b, 0) / (values.length || 1)
  const slice = values.slice(-period)
  return slice.reduce((a, b) => a + b, 0) / period
}

export function calculateMACD(candles: CandleData[]): { line: number; signal: number; histogram: number } {
  const closes = candles.map((c) => c.close)
  const ema12 = calculateEMA(closes.slice(-26), 12)
  const ema26 = calculateEMA(closes.slice(-35), 26)
  const line = ema12 - ema26
  const signal = calculateEMA(closes.slice(-35), 9)
  const histogram = line - signal
  return { line, signal, histogram }
}

export function calculateBollingerBands(candles: CandleData[], period = 20, stdDev = 2): { upper: number; middle: number; lower: number } {
  const closes = candles.slice(-period).map((c) => c.close)
  const middle = closes.reduce((a, b) => a + b, 0) / (closes.length || 1)
  const variance = closes.reduce((sum, val) => sum + Math.pow(val - middle, 2), 0) / (closes.length || 1)
  const sd = Math.sqrt(variance)
  return { upper: middle + stdDev * sd, middle, lower: middle - stdDev * sd }
}

export function calculateStochastic(candles: CandleData[], period = 14): { k: number; d: number } {
  if (candles.length < period) return { k: 50, d: 50 }
  const slice = candles.slice(-period)
  const highestHigh = Math.max(...slice.map((c) => c.high))
  const lowestLow = Math.min(...slice.map((c) => c.low))
  const currentClose = slice[slice.length - 1].close
  const k = ((currentClose - lowestLow) / (highestHigh - lowestLow || 1)) * 100
  const d = calculateSMA(slice.slice(-3).map((c) => c.close), 3)
  return { k, d: (d / currentClose) * 100 }
}

export function calculateATR(candles: CandleData[], period = 14): number {
  if (candles.length < 2) return 0
  const trueRanges: number[] = []
  for (let i = 1; i < candles.length; i++) {
    const tr = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close)
    )
    trueRanges.push(tr)
  }
  return calculateSMA(trueRanges, Math.min(period, trueRanges.length))
}

export function calculateAllIndicators(candles: CandleData[]): TechnicalIndicators {
  const closes = candles.map((c) => c.close)
  const volumes = candles.map((c) => c.volume)
  const currentVolume = volumes[volumes.length - 1] || 0
  const avgVolume = calculateSMA(volumes.slice(-20), 20)

  const ma20 = calculateSMA(closes, 20)
  const ma50 = calculateSMA(closes, 50)
  const ma200 = calculateSMA(closes, 200)
  const currentPrice = closes[closes.length - 1] || 0

  let direction: 'up' | 'down' | 'sideways' = 'sideways'
  let strength = 0
  if (currentPrice > ma20 && ma20 > ma50) {
    direction = 'up'
    strength = Math.min(100, ((currentPrice - ma50) / ma50) * 1000)
  } else if (currentPrice < ma20 && ma20 < ma50) {
    direction = 'down'
    strength = Math.min(100, ((ma50 - currentPrice) / ma50) * 1000)
  }

  return {
    rsi: calculateRSI(candles),
    macd: calculateMACD(candles),
    ma: { ma20, ma50, ma200 },
    bollinger: calculateBollingerBands(candles),
    stochastic: calculateStochastic(candles),
    atr: calculateATR(candles),
    volume: { current: currentVolume, average: avgVolume, ratio: avgVolume > 0 ? currentVolume / avgVolume : 1 },
    trend: { direction, strength: Math.round(strength) },
  }
}

// ── Signal Generation ──

interface SignalScore {
  label: string
  score: number
  weight: number
}

function scoreRSI(rsi: number): number {
  if (rsi < 30) return 90
  if (rsi < 40) return 70
  if (rsi < 55) return 50
  if (rsi < 70) return 30
  return 10
}

function scoreMACD(macd: { line: number; signal: number; histogram: number }): number {
  if (macd.histogram > 0 && macd.line > macd.signal) return 85
  if (macd.histogram > 0) return 65
  if (macd.histogram < 0 && macd.line < macd.signal) return 15
  return 35
}

function scoreMA(currentPrice: number, ma: { ma20: number; ma50: number; ma200: number }): number {
  let score = 50
  if (currentPrice > ma.ma20) score += 15
  if (currentPrice > ma.ma50) score += 15
  if (currentPrice > ma.ma200) score += 10
  if (ma.ma20 > ma.ma50) score += 5
  if (ma.ma50 > ma.ma200) score += 5
  return Math.max(0, Math.min(100, score))
}

function scoreBollinger(currentPrice: number, bb: { upper: number; middle: number; lower: number }): number {
  if (currentPrice <= bb.lower) return 80
  if (currentPrice < bb.middle) return 60
  if (currentPrice < bb.upper) return 40
  return 20
}

function scoreStochastic(stoch: { k: number; d: number }): number {
  if (stoch.k < 20 && stoch.k > stoch.d) return 85
  if (stoch.k < 30) return 65
  if (stoch.k > 80 && stoch.k < stoch.d) return 15
  if (stoch.k > 70) return 30
  return 50
}

function scoreVolume(vol: { ratio: number }): number {
  if (vol.ratio > 2) return 75
  if (vol.ratio > 1.5) return 65
  if (vol.ratio > 1) return 55
  if (vol.ratio > 0.5) return 40
  return 30
}

function scoreTrend(trend: { direction: string; strength: number }): number {
  if (trend.direction === 'up') return 70 + Math.min(20, trend.strength / 5)
  if (trend.direction === 'down') return 30 - Math.min(20, trend.strength / 5)
  return 50
}

function scoreToSignalType(score: number): SignalType {
  if (score >= 75) return 'STRONG_BUY'
  if (score >= 60) return 'BUY'
  if (score >= 40) return 'NEUTRAL'
  if (score >= 25) return 'SELL'
  return 'STRONG_SELL'
}

function calculateRiskLevel(atr: number, price: number, category: CoinCategory): RiskLevel {
  const atrPercent = (atr / price) * 100
  const riskMultiplier = COIN_CATEGORIES[category]?.riskMultiplier || 1
  const adjustedRisk = atrPercent * riskMultiplier
  if (adjustedRisk < 3) return 'LOW'
  if (adjustedRisk < 7) return 'MEDIUM'
  return 'HIGH'
}

function calculateEntryTargets(signal: SignalType, price: number, atr: number, category: CoinCategory): { entry: number; target: number; stopLoss: number; rrRatio: number } {
  const riskMultiplier = COIN_CATEGORIES[category]?.riskMultiplier || 1
  const atrRisk = atr * riskMultiplier

  if (signal === 'STRONG_BUY' || signal === 'BUY') {
    const entry = price
    const stopLoss = price - atrRisk * 1.5
    const target = price + atrRisk * 3
    return { entry, target, stopLoss, rrRatio: 2 }
  } else if (signal === 'STRONG_SELL' || signal === 'SELL') {
    const entry = price
    const stopLoss = price + atrRisk * 1.5
    const target = price - atrRisk * 3
    return { entry, target, stopLoss, rrRatio: 2 }
  }
  return { entry: price, target: price, stopLoss: price, rrRatio: 0 }
}

export function generateSignal(
  coin: { symbol: string; name: string; category: CoinCategory },
  candles: CandleData[],
  marketData: { price: number; change24h: number; volume24h: number; marketCap: number }
): CryptoSignal {
  const indicators = calculateAllIndicators(candles)
  const currentPrice = marketData.price

  const scores: SignalScore[] = [
    { label: 'RSI', score: scoreRSI(indicators.rsi), weight: 0.2 },
    { label: 'MACD', score: scoreMACD(indicators.macd), weight: 0.2 },
    { label: 'Moving Averages', score: scoreMA(currentPrice, indicators.ma), weight: 0.15 },
    { label: 'Bollinger Bands', score: scoreBollinger(currentPrice, indicators.bollinger), weight: 0.1 },
    { label: 'Stochastic', score: scoreStochastic(indicators.stochastic), weight: 0.1 },
    { label: 'Volume', score: scoreVolume(indicators.volume), weight: 0.1 },
    { label: 'Trend', score: scoreTrend(indicators.trend), weight: 0.15 },
  ]

  const compositeScore = scores.reduce((sum, s) => sum + s.score * s.weight, 0)
  const confidence = Math.round(Math.max(0, Math.min(100, compositeScore)))
  const signalType = scoreToSignalType(compositeScore)
  const riskLevel = calculateRiskLevel(indicators.atr, currentPrice, coin.category)
  const targets = calculateEntryTargets(signalType, currentPrice, indicators.atr, coin.category)

  return {
    id: `${coin.symbol}-${Date.now()}`,
    symbol: coin.symbol,
    name: coin.name,
    category: coin.category,
    type: signalType,
    confidence,
    price: currentPrice,
    entryPrice: targets.entry,
    targetPrice: targets.target,
    stopLoss: targets.stopLoss,
    riskRewardRatio: targets.rrRatio,
    riskLevel,
    indicators,
    scoreBreakdown: scores,
    timestamp: new Date().toISOString(),
    timeframe: '15m',
    change24h: marketData.change24h,
    volume24h: marketData.volume24h,
    marketCap: marketData.marketCap,
  }
}

export function getTrackedCoinsByCategory(category: CoinCategory): Array<{ symbol: string; name: string; category: CoinCategory }> {
  return TRACKED_COINS.filter((c) => c.category === category)
}

export function getTotalTrackedCoins(): number {
  return TRACKED_COINS.length
}
