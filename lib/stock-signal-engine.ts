/**
 * Stock Signal Engine — Technical Analysis for Global Equities
 * F4b/F4c: IDX (Indonesia) + Global markets (US, Europe, Asia, Middle East)
 *
 * Uses Yahoo Finance data to generate BUY/SELL/HOLD signals for stocks.
 * Adapts crypto signal engine logic for equity markets with:
 * - P/E ratio analysis
 * - Dividend yield scoring
 * - Market cap weighting
 * - Sector-relative strength
 */

import { StockMarket, StockQuote, StockSignal } from './stock-api'
import { CandleData, TechnicalIndicators, calculateAllIndicators } from './crypto-signal-engine'

// ── Extended Stock Signal ──

export interface StockSignalExtended extends StockSignal {
  market: StockMarket
  sector: string
  currency: string
  indicators: TechnicalIndicators
  scoreBreakdown: Array<{ label: string; score: number; weight: number }>
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  riskRewardRatio: number
  marketCap?: number
  pe?: number
  dividend?: number
  high52?: number
  low52?: number
}

// ── IDX (Indonesia) Tracked Stocks ──

export const IDX_STOCKS: Array<{ symbol: string; name: string; sector: string }> = [
  { symbol: 'BBCA.JK', name: 'Bank Central Asia', sector: 'Banking' },
  { symbol: 'BBRI.JK', name: 'Bank Rakyat Indonesia', sector: 'Banking' },
  { symbol: 'BMRI.JK', name: 'Bank Mandiri', sector: 'Banking' },
  { symbol: 'TLKM.JK', name: 'Telkom Indonesia', sector: 'Telecom' },
  { symbol: 'ASII.JK', name: 'Astra International', sector: 'Automotive' },
  { symbol: 'GOTO.JK', name: 'GoTo Gojek Tokopedia', sector: 'Technology' },
  { symbol: 'BUMI.JK', name: 'Bumi Resources', sector: 'Mining' },
  { symbol: 'ANTM.JK', name: 'Aneka Tambang', sector: 'Mining' },
  { symbol: 'INDF.JK', name: 'Indofood', sector: 'Consumer' },
  { symbol: 'UNVR.JK', name: 'Unilever Indonesia', sector: 'Consumer' },
  { symbol: 'ICBP.JK', name: 'Indofood CBP', sector: 'Consumer' },
  { symbol: 'ADRO.JK', name: 'Adaro Energy', sector: 'Energy' },
  { symbol: 'CTRA.JK', name: 'Ciputra Development', sector: 'Real Estate' },
  { symbol: 'JPFA.JK', name: 'Japfa', sector: 'Agriculture' },
  { symbol: 'MDKA.JK', name: 'Merdeka Copper Gold', sector: 'Mining' },
  { symbol: 'BRPT.JK', name: 'Barito Pacific', sector: 'Petrochemical' },
  { symbol: 'KLBF.JK', name: 'Kalbe Farma', sector: 'Healthcare' },
  { symbol: 'TPIA.JK', name: 'Chandra Asri Pacific', sector: 'Petrochemical' },
  { symbol: 'DSSA.JK', name: 'Dian Swastatika Sentosa', sector: 'Energy' },
  { symbol: 'ESSA.JK', name: 'Elang Mahkota Teknologi', sector: 'Technology' },
]

// ── Global Market Sectors ──

export const SECTORS = [
  'Technology', 'Banking', 'Healthcare', 'Energy', 'Consumer',
  'Automotive', 'Mining', 'Telecom', 'Real Estate', 'Agriculture',
  'Petrochemical', 'Finance', 'Retail', 'Industrial', 'Utilities',
] as const

export type Sector = typeof SECTORS[number]

// ── Stock Signal Scoring ──

function scorePE(pe: number | undefined): number {
  if (!pe || pe <= 0) return 50
  if (pe < 10) return 80
  if (pe < 15) return 70
  if (pe < 20) return 60
  if (pe < 30) return 45
  if (pe < 50) return 30
  return 15
}

function scoreDividend(dividend: number | undefined): number {
  if (!dividend || dividend <= 0) return 40
  if (dividend > 5) return 85
  if (dividend > 3) return 75
  if (dividend > 2) return 65
  if (dividend > 1) return 55
  return 45
}

function score52WeekRange(currentPrice: number, high52?: number, low52?: number): number {
  if (!high52 || !low52 || high52 === low52) return 50
  const position = (currentPrice - low52) / (high52 - low52)
  if (position < 0.2) return 80
  if (position < 0.4) return 65
  if (position < 0.6) return 50
  if (position < 0.8) return 35
  return 20
}

function scoreChangePercent(changePercent: number): number {
  if (changePercent > 3) return 75
  if (changePercent > 1) return 65
  if (changePercent > 0) return 55
  if (changePercent > -1) return 45
  if (changePercent > -3) return 35
  return 25
}

// ── Generate Stock Signal ──

export function generateStockSignal(
  quote: StockQuote,
  candles: CandleData[],
  sector: string
): StockSignalExtended {
  const indicators = calculateAllIndicators(candles)
  const currentPrice = quote.price

  const scores = [
    { label: 'RSI', score: scoreRSIStock(indicators.rsi), weight: 0.15 },
    { label: 'MACD', score: scoreMACDStock(indicators.macd), weight: 0.15 },
    { label: 'Moving Averages', score: scoreMAStock(currentPrice, indicators.ma), weight: 0.12 },
    { label: 'Bollinger Bands', score: scoreBollingerStock(currentPrice, indicators.bollinger), weight: 0.08 },
    { label: 'Stochastic', score: scoreStochasticStock(indicators.stochastic), weight: 0.08 },
    { label: 'Volume', score: scoreVolumeStock(indicators.volume), weight: 0.07 },
    { label: 'Trend', score: scoreTrendStock(indicators.trend), weight: 0.1 },
    { label: 'P/E Ratio', score: scorePE(quote.pe), weight: 0.1 },
    { label: 'Dividend', score: scoreDividend(quote.dividend), weight: 0.08 },
    { label: '52-Week Range', score: score52WeekRange(currentPrice, quote.high52, quote.low52), weight: 0.04 },
    { label: 'Daily Change', score: scoreChangePercent(quote.changePercent), weight: 0.03 },
  ]

  const compositeScore = scores.reduce((sum, s) => sum + s.score * s.weight, 0)
  const confidence = Math.round(Math.max(0, Math.min(100, compositeScore)))

  let signalType: 'BUY' | 'SELL' | 'HOLD' = 'HOLD'
  if (compositeScore >= 65) signalType = 'BUY'
  else if (compositeScore < 40) signalType = 'SELL'

  const atrPercent = (indicators.atr / currentPrice) * 100
  const riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = atrPercent < 2 ? 'LOW' : atrPercent < 5 ? 'MEDIUM' : 'HIGH'

  const entry = currentPrice
  const stopLoss = signalType === 'BUY' ? currentPrice - indicators.atr * 1.5 : currentPrice + indicators.atr * 1.5
  const target = signalType === 'BUY' ? currentPrice + indicators.atr * 2.5 : currentPrice - indicators.atr * 2.5
  const rrRatio = 1.67

  const reasons: string[] = []
  if (indicators.rsi < 35) reasons.push('Oversold (RSI < 35)')
  if (indicators.rsi > 70) reasons.push('Overbought (RSI > 70)')
  if (indicators.macd.histogram > 0) reasons.push('MACD bullish crossover')
  if (indicators.macd.histogram < 0) reasons.push('MACD bearish crossover')
  if (currentPrice > indicators.ma.ma50) reasons.push('Above MA50 (uptrend)')
  if (currentPrice < indicators.ma.ma50) reasons.push('Below MA50 (downtrend)')
  if (indicators.volume.ratio > 1.5) reasons.push('High volume surge')
  if (quote.pe && quote.pe < 15) reasons.push('Attractive P/E ratio')
  if (quote.dividend && quote.dividend > 3) reasons.push('Strong dividend yield')

  return {
    id: `${quote.symbol}-${Date.now()}`,
    symbol: quote.symbol,
    name: quote.name,
    market: quote.market,
    signalType,
    price: currentPrice,
    confidence,
    reason: reasons.join('; ') || 'Mixed signals — neutral stance',
    timestamp: new Date().toISOString(),
    targetPrice: target,
    stopLoss,
    sector,
    currency: quote.currency,
    indicators,
    scoreBreakdown: scores,
    riskLevel,
    riskRewardRatio: rrRatio,
    marketCap: quote.marketCap,
    pe: quote.pe,
    dividend: quote.dividend,
    high52: quote.high52,
    low52: quote.low52,
  }
}

// ── Stock-specific scoring functions ──

function scoreRSIStock(rsi: number): number {
  if (rsi < 30) return 85
  if (rsi < 45) return 70
  if (rsi < 55) return 50
  if (rsi < 70) return 35
  return 15
}

function scoreMACDStock(macd: { line: number; signal: number; histogram: number }): number {
  if (macd.histogram > 0 && macd.line > macd.signal) return 80
  if (macd.histogram > 0) return 60
  if (macd.histogram < 0 && macd.line < macd.signal) return 20
  return 40
}

function scoreMAStock(price: number, ma: { ma20: number; ma50: number; ma200: number }): number {
  let score = 50
  if (price > ma.ma20) score += 12
  if (price > ma.ma50) score += 13
  if (price > ma.ma200) score += 10
  if (ma.ma20 > ma.ma50) score += 8
  if (ma.ma50 > ma.ma200) score += 7
  return Math.max(0, Math.min(100, score))
}

function scoreBollingerStock(price: number, bb: { upper: number; middle: number; lower: number }): number {
  if (price <= bb.lower) return 78
  if (price < bb.middle) return 58
  if (price < bb.upper) return 42
  return 22
}

function scoreStochasticStock(stoch: { k: number; d: number }): number {
  if (stoch.k < 20 && stoch.k > stoch.d) return 82
  if (stoch.k < 30) return 62
  if (stoch.k > 80 && stoch.k < stoch.d) return 18
  if (stoch.k > 70) return 32
  return 50
}

function scoreVolumeStock(vol: { ratio: number }): number {
  if (vol.ratio > 2) return 72
  if (vol.ratio > 1.5) return 62
  if (vol.ratio > 1) return 52
  if (vol.ratio > 0.5) return 38
  return 28
}

function scoreTrendStock(trend: { direction: string; strength: number }): number {
  if (trend.direction === 'up') return 68 + Math.min(20, trend.strength / 5)
  if (trend.direction === 'down') return 32 - Math.min(20, trend.strength / 5)
  return 50
}

// ── Market Status ──

export function getMarketStatus(market: StockMarket): { isOpen: boolean; nextOpen: string; nextClose: string } {
  const now = new Date()
  const utcHour = now.getUTCHours()
  const utcDay = now.getUTCDay()

  const marketHours: Record<string, { open: number; close: number; days: number[] }> = {
    US: { open: 14, close: 21, days: [1, 2, 3, 4, 5] },
    UK: { open: 8, close: 16, days: [1, 2, 3, 4, 5] },
    DE: { open: 8, close: 16, days: [1, 2, 3, 4, 5] },
    FR: { open: 8, close: 16, days: [1, 2, 3, 4, 5] },
    JP: { open: 0, close: 6, days: [1, 2, 3, 4, 5] },
    HK: { open: 1, close: 8, days: [1, 2, 3, 4, 5] },
    CN: { open: 1, close: 7, days: [1, 2, 3, 4, 5] },
    KR: { open: 0, close: 6, days: [1, 2, 3, 4, 5] },
    SG: { open: 1, close: 9, days: [1, 2, 3, 4, 5] },
    IN: { open: 3, close: 10, days: [1, 2, 3, 4, 5] },
    ID: { open: 2, close: 9, days: [1, 2, 3, 4, 5] },
    AU: { open: 0, close: 6, days: [1, 2, 3, 4, 5] },
    SA: { open: 10, close: 17, days: [0, 1, 2, 3, 4] },
  }

  const hours = marketHours[market]
  if (!hours) return { isOpen: false, nextOpen: 'Unknown', nextClose: 'Unknown' }

  const isOpen = hours.days.includes(utcDay) && utcHour >= hours.open && utcHour < hours.close

  return {
    isOpen,
    nextOpen: `${String(hours.open).padStart(2, '0')}:00 UTC`,
    nextClose: `${String(hours.close).padStart(2, '0')}:00 UTC`,
  }
}
