import { describe, it, expect, beforeEach } from 'vitest'
import { cache, cacheKeys, cacheTags } from '../cache'

describe('cache', () => {
  beforeEach(() => {
    cache.clear()
  })

  describe('set and get', () => {
    it('should store and retrieve values', async () => {
      await cache.set('test-key', { data: 'hello' }, 'short')
      const result = await cache.get<{ data: string }>('test-key')
      expect(result).toEqual({ data: 'hello' })
    })

    it('should return null for missing key', async () => {
      const result = await cache.get('nonexistent')
      expect(result).toBeNull()
    })

    it('should handle different value types', async () => {
      await cache.set('string-val', 'test', 'short')
      await cache.set('number-val', 42, 'short')
      await cache.set('array-val', [1, 2, 3], 'short')

      expect(await cache.get<string>('string-val')).toBe('test')
      expect(await cache.get<number>('number-val')).toBe(42)
      expect(await cache.get<number[]>('array-val')).toEqual([1, 2, 3])
    })
  })

  describe('delete', () => {
    it('should delete stored value', async () => {
      await cache.set('del-key', 'value', 'short')
      await cache.delete('del-key')
      expect(await cache.get('del-key')).toBeNull()
    })
  })

  describe('getOrSet', () => {
    it('should return cached value if exists', async () => {
      await cache.set('cached', 'cached-value', 'short')
      const result = await cache.getOrSet('cached', () => Promise.resolve('fresh-value'), 'short')
      expect(result).toBe('cached-value')
    })

    it('should call factory and store if not cached', async () => {
      let factoryCalled = false
      const result = await cache.getOrSet(
        'fresh',
        () => {
          factoryCalled = true
          return Promise.resolve('factory-result')
        },
        'short'
      )
      expect(result).toBe('factory-result')
      expect(factoryCalled).toBe(true)

      // Second call should not invoke factory
      factoryCalled = false
      const cached = await cache.getOrSet(
        'fresh',
        () => {
          factoryCalled = true
          return Promise.resolve('should-not-be-called')
        },
        'short'
      )
      expect(cached).toBe('factory-result')
      expect(factoryCalled).toBe(false)
    })
  })

  describe('invalidateTag', () => {
    it('should invalidate keys by tag', async () => {
      await cache.set('key1', 'val1', 'short', ['tag-a'])
      await cache.set('key2', 'val2', 'short', ['tag-a'])
      await cache.set('key3', 'val3', 'short', ['tag-b'])

      const invalidated = cache.invalidateTag('tag-a')
      expect(invalidated).toBe(2)

      expect(await cache.get('key1')).toBeNull()
      expect(await cache.get('key2')).toBeNull()
      expect(await cache.get('key3')).not.toBeNull()
    })
  })

  describe('cacheKeys', () => {
    it('should generate signal cache key', () => {
      expect(cacheKeys.signals('top', 50)).toBe('signals:top:50')
      expect(cacheKeys.signals()).toBe('signals:all:50')
    })

    it('should generate stock cache keys', () => {
      expect(cacheKeys.stockQuote('AAPL')).toBe('stock:quote:AAPL')
      expect(cacheKeys.stockSignals('US')).toBe('stock:signals:US')
    })

    it('should generate user cache keys', () => {
      expect(cacheKeys.userWatchlist('user123')).toBe('user:watchlist:user123')
      expect(cacheKeys.userPortfolio('user123')).toBe('user:portfolio:user123')
    })
  })

  describe('cacheTags', () => {
    it('should have standard tags', () => {
      expect(cacheTags.signals).toBe('signals')
      expect(cacheTags.stocks).toBe('stocks')
      expect(cacheTags.market).toBe('market')
    })
  })
})
