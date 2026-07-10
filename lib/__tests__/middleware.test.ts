import { describe, it, expect } from 'vitest'
import { parseRateLimit, checkRateLimit, logRequest, type AuthLevel } from '../middleware'

describe('middleware', () => {
  describe('parseRateLimit', () => {
    it('should parse 100/min', () => {
      const result = parseRateLimit('100/min')
      expect(result.max).toBe(100)
      expect(result.windowMs).toBe(60000)
    })

    it('should parse 10/sec', () => {
      const result = parseRateLimit('10/sec')
      expect(result.max).toBe(10)
      expect(result.windowMs).toBe(1000)
    })

    it('should parse 1000/hour', () => {
      const result = parseRateLimit('1000/hour')
      expect(result.max).toBe(1000)
      expect(result.windowMs).toBe(3600000)
    })

    it('should return default for invalid format', () => {
      const result = parseRateLimit('invalid')
      expect(result.max).toBe(100)
      expect(result.windowMs).toBe(60000)
    })
  })

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('test-ip', '10/min')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(9)
    })

    it('should block after max requests', () => {
      const identifier = 'test-block-' + Date.now()
      for (let i = 0; i < 5; i++) {
        checkRateLimit(identifier, '5/min')
      }
      const result = checkRateLimit(identifier, '5/min')
      expect(result.allowed).toBe(false)
      expect(result.remaining).toBe(0)
    })

    it('should track remaining count', () => {
      const identifier = 'test-remaining-' + Date.now()
      checkRateLimit(identifier, '10/min')
      checkRateLimit(identifier, '10/min')
      const result = checkRateLimit(identifier, '10/min')
      expect(result.allowed).toBe(true)
      expect(result.remaining).toBe(7)
    })
  })

  describe('logRequest', () => {
    it('should not throw on valid input', () => {
      expect(() =>
        logRequest({
          timestamp: new Date().toISOString(),
          method: 'GET',
          path: '/api/test',
          status: 200,
          durationMs: 50,
          ip: '127.0.0.1',
        })
      ).not.toThrow()
    })

    it('should not throw on error status', () => {
      expect(() =>
        logRequest({
          timestamp: new Date().toISOString(),
          method: 'POST',
          path: '/api/error',
          status: 500,
          durationMs: 100,
          ip: '127.0.0.1',
        })
      ).not.toThrow()
    })
  })
})
