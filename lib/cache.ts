/**
 * Caching Layer — Upstash Redis + In-memory fallback
 * F4h: Server-side caching with TTL, tag-based invalidation
 *
 * Uses Upstash Redis REST API (no persistent connection needed).
 * Falls back to in-memory Map cache when Redis is unavailable.
 */

// ── Types ──

export type CacheTTL = 'short' | 'medium' | 'long' | 'very_long'

const TTL_SECONDS: Record<CacheTTL, number> = {
  short: 30,
  medium: 300,
  long: 3600,
  very_long: 86400,
}

interface CacheEntry<T> {
  value: T
  expiresAt: number
  tags: string[]
}

// ── In-memory cache (fallback) ──

const memoryCache = new Map<string, CacheEntry<unknown>>()
const tagIndex = new Map<string, Set<string>>()

function memoryGet<T>(key: string): T | null {
  const entry = memoryCache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key)
    entry.tags.forEach((tag) => tagIndex.get(tag)?.delete(key))
    return null
  }
  return entry.value as T
}

function memorySet<T>(key: string, value: T, ttlSeconds: number, tags: string[] = []): void {
  const entry: CacheEntry<T> = {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
    tags,
  }
  memoryCache.set(key, entry)
  tags.forEach((tag) => {
    if (!tagIndex.has(tag)) tagIndex.set(tag, new Set())
    tagIndex.get(tag)!.add(key)
  })
}

function memoryDelete(key: string): void {
  const entry = memoryCache.get(key)
  if (entry) {
    entry.tags.forEach((tag) => tagIndex.get(tag)?.delete(key))
  }
  memoryCache.delete(key)
}

function memoryInvalidateTag(tag: string): number {
  const keys = tagIndex.get(tag)
  if (!keys) return 0
  const count = keys.size
  keys.forEach((key) => memoryCache.delete(key))
  tagIndex.delete(tag)
  return count
}

function memoryClear(): void {
  memoryCache.clear()
  tagIndex.clear()
}

// ── Upstash Redis REST client ──

const UPSTASH_URL = process.env.UPSTASH_REDIS_URL
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_TOKEN

async function redisGet<T>(key: string): Promise<T | null> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return null
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.result) return null
    return JSON.parse(data.result) as T
  } catch {
    return null
  }
}

async function redisSet<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return
  try {
    const body = JSON.stringify(value)
    await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value: body, ex: ttlSeconds }),
    })
  } catch {
    // Silent fail — memory cache is the fallback
  }
}

async function redisDel(key: string): Promise<void> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) return
  try {
    await fetch(`${UPSTASH_URL}/del/${encodeURIComponent(key)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    })
  } catch {
    // Silent fail
  }
}

// ── Cache API ──

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    // Try Redis first
    const redisResult = await redisGet<T>(key)
    if (redisResult !== null) return redisResult
    // Fall back to memory
    return memoryGet<T>(key)
  },

  async set<T>(key: string, value: T, ttl: CacheTTL = 'medium', tags: string[] = []): Promise<void> {
    const ttlSeconds = TTL_SECONDS[ttl]
    // Set in both Redis and memory
    await redisSet(key, value, ttlSeconds)
    memorySet(key, value, ttlSeconds, tags)
  },

  async delete(key: string): Promise<void> {
    await redisDel(key)
    memoryDelete(key)
  },

  invalidateTag(tag: string): number {
    return memoryInvalidateTag(tag)
  },

  clear(): void {
    memoryClear()
  },

  // ── Convenience methods ──

  async getOrSet<T>(key: string, factory: () => Promise<T>, ttl: CacheTTL = 'medium', tags: string[] = []): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) return cached
    const fresh = await factory()
    await this.set(key, fresh, ttl, tags)
    return fresh
  },
}

// ── Cache key builders ──

export const cacheKeys = {
  signals: (category?: string, limit?: number) => `signals:${category || 'all'}:${limit || 50}`,
  signalById: (id: string) => `signal:${id}`,
  signalStats: () => 'signals:stats',
  stockQuote: (symbol: string) => `stock:quote:${symbol}`,
  stockSignals: (market?: string) => `stock:signals:${market || 'all'}`,
  marketIndices: () => 'market:indices',
  marketStatus: (market: string) => `market:status:${market}`,
  coinsByCategory: (category: string) => `coins:category:${category}`,
  globalMetrics: () => 'crypto:global',
  newListings: () => 'discover:new-listings',
  airdrops: () => 'discover:airdrops',
  userSubscription: (userId: string) => `user:sub:${userId}`,
  userWatchlist: (userId: string) => `user:watchlist:${userId}`,
  userPortfolio: (userId: string) => `user:portfolio:${userId}`,
}

// ── Cache tags for invalidation ──

export const cacheTags = {
  signals: 'signals',
  stocks: 'stocks',
  market: 'market',
  discover: 'discover',
  user: 'user',
}
