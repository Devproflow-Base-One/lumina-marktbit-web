import { describe, it, expect } from 'vitest'
import {
  LOCALES,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isRTL,
  getLocaleDirection,
  formatNumber,
  formatCurrency,
  formatDate,
  formatPercent,
  type Locale,
} from '../i18n-config'

describe('i18n-config', () => {
  describe('LOCALES', () => {
    it('should have 3 locales', () => {
      expect(Object.keys(LOCALES).length).toBe(3)
    })

    it('should have en, id, ar', () => {
      expect(LOCALES.en).toBeDefined()
      expect(LOCALES.id).toBeDefined()
      expect(LOCALES.ar).toBeDefined()
    })

    it('should have correct directions', () => {
      expect(LOCALES.en.direction).toBe('ltr')
      expect(LOCALES.id.direction).toBe('ltr')
      expect(LOCALES.ar.direction).toBe('rtl')
    })
  })

  describe('DEFAULT_LOCALE', () => {
    it('should be en', () => {
      expect(DEFAULT_LOCALE).toBe('en')
    })
  })

  describe('SUPPORTED_LOCALES', () => {
    it('should include all 3 locales', () => {
      expect(SUPPORTED_LOCALES.length).toBe(3)
      expect(SUPPORTED_LOCALES).toContain('en')
      expect(SUPPORTED_LOCALES).toContain('id')
      expect(SUPPORTED_LOCALES).toContain('ar')
    })
  })

  describe('isRTL', () => {
    it('should return true for Arabic', () => {
      expect(isRTL('ar')).toBe(true)
    })

    it('should return false for English', () => {
      expect(isRTL('en')).toBe(false)
    })

    it('should return false for Indonesian', () => {
      expect(isRTL('id')).toBe(false)
    })
  })

  describe('getLocaleDirection', () => {
    it('should return rtl for Arabic', () => {
      expect(getLocaleDirection('ar')).toBe('rtl')
    })

    it('should return ltr for English', () => {
      expect(getLocaleDirection('en')).toBe('ltr')
    })
  })

  describe('formatNumber', () => {
    it('should format numbers with locale', () => {
      const result = formatNumber(1234567, 'en')
      expect(result).toContain('1')
      expect(result).toContain('234')
    })
  })

  describe('formatCurrency', () => {
    it('should format USD for English', () => {
      const result = formatCurrency(100, 'en')
      expect(result).toContain('$')
      expect(result).toContain('100')
    })

    it('should format IDR for Indonesian', () => {
      const result = formatCurrency(100000, 'id')
      expect(result).toContain('100')
    })
  })

  describe('formatDate', () => {
    it('should format date string', () => {
      const result = formatDate('2024-01-15', 'en')
      expect(result).toContain('2024')
      expect(result).toContain('Jan')
    })

    it('should format Date object', () => {
      const result = formatDate(new Date('2024-06-15'), 'en')
      expect(result).toContain('2024')
      expect(result).toContain('Jun')
    })
  })

  describe('formatPercent', () => {
    it('should format positive percentage with +', () => {
      const result = formatPercent(5.5, 'en')
      expect(result).toContain('+')
      expect(result).toContain('5')
      expect(result).toContain('%')
    })

    it('should format negative percentage with -', () => {
      const result = formatPercent(-3.2, 'en')
      expect(result).toContain('-')
      expect(result).toContain('3')
      expect(result).toContain('%')
    })

    it('should handle zero', () => {
      const result = formatPercent(0, 'en')
      expect(result).toContain('+')
      expect(result).toContain('0')
    })
  })
})
