/**
 * Lumina MarktBit — Signal Engine API Client
 * Connects dashboard to the crypto signal engine REST API (default: localhost:8787)
 */

import { CoinCategory } from './coin-categories'

const API_BASE_URL = process.env.NEXT_PUBLIC_SIGNAL_API_URL || 'http://localhost:8787/api/v1';

export interface Signal {
  id: string;
  coin: string;
  symbol: string;
  type: 'BUY' | 'SELL' | 'HOLD' | 'STRONG BUY' | 'STRONG SELL' | 'NEUTRAL';
  confidence: number;
  price: number;
  entryPrice?: number;
  targetPrice?: number;
  stopLoss?: number;
  indicators: Record<string, any>;
  timestamp: string;
  timeframe: string;
  status: 'active' | 'completed' | 'expired';
  outcome?: 'win' | 'loss' | 'pending';
  pnlPercent?: number;
  category?: CoinCategory;
  riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
  riskRewardRatio?: number;
  aiAnalysis?: {
    summary: string;
    keyRisk: string;
    catalyst: string;
    timeframe: string;
    confidenceAdjustment: number;
  } | null;
}

export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  category?: CoinCategory;
  categories?: string[];
  listedDate?: string;
  ageDays?: number;
}

export interface NewListingAlert {
  id: string;
  symbol: string;
  name: string;
  price: number;
  listedDate: string;
  ageDays: number;
  exchange: string;
  volume24h: number;
  change24h: number;
  category: 'new';
  warning: string;
}

export interface AirdropListing {
  id: string;
  project: string;
  token: string;
  symbol: string;
  status: 'upcoming' | 'active' | 'claimed' | 'ended';
  startDate: string;
  endDate: string;
  requirements: string[];
  estimatedValue: string;
  exchange: string;
  category: 'airdrop';
  description: string;
}

export interface EngineStats {
  totalSignals: number;
  activeSignals: number;
  winRate: number;
  avgConfidence: number;
  signalsToday: number;
  lastScanTime: string;
  trackedCoins: number;
  uptime: string;
}

export interface BacktestResult {
  coin: string;
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  maxDrawdown: number;
  totalReturn: number;
  avgWin: number;
  avgLoss: number;
  trades: Array<{
    entryDate: string;
    exitDate: string;
    entryPrice: number;
    exitPrice: number;
    pnl: number;
    type: string;
  }>;
}

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export const signalAPI = {
  getSignals: (limit = 50, category?: CoinCategory): Promise<{ signals: Signal[]; total: number }> => {
    const params = new URLSearchParams({ limit: String(limit) });
    if (category) params.append('category', category);
    return fetchAPI(`/signals?${params}`);
  },

  getSignalsByCoin: (coin: string): Promise<{ signals: Signal[] }> =>
    fetchAPI(`/signals/${coin}`),

  getSignalsByCategory: (category: CoinCategory, limit = 10): Promise<{ signals: Signal[] }> =>
    fetchAPI(`/signals?category=${category}&limit=${limit}`),

  getCoins: (category?: CoinCategory): Promise<{ coins: CoinInfo[] }> => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    const query = params.toString();
    return fetchAPI(`/coins${query ? `?${query}` : ''}`);
  },

  getCoinsByCategory: (category: CoinCategory): Promise<{ coins: CoinInfo[] }> =>
    fetchAPI(`/coins?category=${category}`),

  getStats: (): Promise<{ stats: EngineStats }> =>
    fetchAPI(`/stats`),

  getBacktest: (coin: string, days = 90): Promise<{ result: BacktestResult }> =>
    fetchAPI(`/backtest/${coin}?days=${days}`),

  getGlobal: (): Promise<{ data: any }> =>
    fetchAPI(`/global`),

  getNewListings: (): Promise<{ listings: NewListingAlert[] }> =>
    fetchAPI(`/discover/new-listings`),

  getAirdrops: (): Promise<{ airdrops: AirdropListing[] }> =>
    fetchAPI(`/discover/airdrops`),

  getTrendingCategories: (): Promise<{ categories: Array<{ name: string; coins: number; change24h: number }> }> =>
    fetchAPI(`/discover/trending-categories`),
};

// ── STATIC JSON FEED ────────────────────────────────────────────────
// Fetches from /data/latest_signals.json (written by Lumina Overmind exporter bridge)
// Uses cache-busting timestamp to bypass Next.js static caching.

export interface StaticSignalFeed {
  minted_at: string;
  timestamp: number;
  engine_status: string;
  total_signals: number;
  signals: StaticSignal[];
  overmind_telemetry?: {
    node?: string;
    architecture?: string;
    edge_ttl?: string;
    bridge_version?: string;
    source?: string;
  };
}

export interface StaticSignal {
  id: string;
  coinId: string;
  symbol: string;
  name: string;
  timestamp: string;
  type: string;
  confidence: number;
  currentPrice: number;
  category: string;
  riskLevel: string;
  riskMultiplier?: number;
  indicators: {
    rsi: number;
    macd: { histogram: number; signal: number; line: number };
    ma: { ma20: number; ma50: number; ma200: number };
    bollinger: { upper: number; middle: number; lower: number };
    stochastic: { k: number; d: number };
    atr: number;
    volume: { current: number; average: number };
    trend: { direction: string; strength: number };
  };
  scoreBreakdown?: Array<{ label: string; score: number; weight: number }>;
  risk?: { level: string; recommendation: string };
  entry?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskRewardRatio?: number;
  aiAnalysis?: { summary: string; keyRisk: string; catalyst: string; timeframe: string; confidenceAdjustment: number } | null;
  change24h?: number;
  change7d?: number;
  volume24h?: number;
  source?: string;
}

function mapStaticToSignal(s: StaticSignal): Signal {
  return {
    id: s.id,
    coin: s.symbol,
    symbol: s.symbol,
    type: (s.type || 'NEUTRAL') as Signal['type'],
    confidence: s.confidence,
    price: s.currentPrice,
    entryPrice: s.entry,
    targetPrice: s.takeProfit,
    stopLoss: s.stopLoss,
    indicators: s.indicators || {},
    timestamp: s.timestamp,
    timeframe: '15m',
    status: 'active',
    category: (s.category as CoinCategory) || 'top',
    riskLevel: (s.riskLevel as Signal['riskLevel']) || 'MEDIUM',
    riskRewardRatio: s.riskRewardRatio,
    aiAnalysis: s.aiAnalysis || null,
  };
}

export async function fetchStaticSignals(): Promise<{ signals: Signal[]; total: number; raw: StaticSignalFeed }> {
  const url = `/api/signals?t=${Date.now()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Signal API error: ${res.status}`);
  const text = await res.text();
  try {
    const json: StaticSignalFeed = JSON.parse(text);
    const signals = (json.signals || []).map(mapStaticToSignal);
    return { signals, total: json.total_signals || signals.length, raw: json };
  } catch (parseErr) {
    console.warn('⚠️ /api/signals returned non-JSON. First 80 chars:', text.slice(0, 80));
    throw new Error('Invalid JSON response from /api/signals');
  }
}

export function deriveStatsFromStatic(feed: StaticSignalFeed): EngineStats {
  const signals = feed.signals || [];
  const total = signals.length;
  const avgConf = total > 0 ? Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / total) : 0;
  const buyCount = signals.filter(s => s.type.includes('BUY')).length;
  const winRate = total > 0 ? Math.round((buyCount / total) * 100) : 0;

  return {
    totalSignals: total,
    activeSignals: total,
    winRate,
    avgConfidence: avgConf,
    signalsToday: total,
    lastScanTime: feed.minted_at || new Date().toISOString(),
    trackedCoins: total,
    uptime: feed.engine_status || 'ONLINE',
  };
}
