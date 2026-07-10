import { describe, it, expect } from 'vitest'
import {
  sanitizeString,
  sanitizeHtml,
  sanitizeEmail,
  sanitizeUrl,
  validatePassword,
  passwordStrength,
  decodeJwtPayload,
  isJwtExpired,
  buildCspHeader,
  validateApiKey,
  escapeSql,
  SECURITY_HEADERS,
} from '../security'

describe('security', () => {
  describe('sanitizeString', () => {
    it('should remove angle brackets', () => {
      expect(sanitizeString('<script>alert(1)</script>')).toBe('scriptalert(1)/script')
    })

    it('should remove javascript: protocol', () => {
      expect(sanitizeString('javascript:alert(1)')).toBe('alert(1)')
    })

    it('should remove onX event handlers', () => {
      expect(sanitizeString('onclick=alert(1)')).toBe('alert(1)')
    })

    it('should enforce max length', () => {
      expect(sanitizeString('a'.repeat(2000), 100).length).toBe(100)
    })

    it('should handle non-string input', () => {
      expect(sanitizeString(null as unknown as string)).toBe('')
    })
  })

  describe('sanitizeHtml', () => {
    it('should escape HTML entities', () => {
      const result = sanitizeHtml('<div>"test"\'s</div>')
      expect(result).toContain('&lt;')
      expect(result).toContain('&gt;')
      expect(result).toContain('&quot;')
      expect(result).toContain('&#x27;')
    })
  })

  describe('sanitizeEmail', () => {
    it('should accept valid email', () => {
      expect(sanitizeEmail('user@example.com')).toBe('user@example.com')
    })

    it('should lowercase email', () => {
      expect(sanitizeEmail('USER@EXAMPLE.COM')).toBe('user@example.com')
    })

    it('should reject invalid email', () => {
      expect(sanitizeEmail('not-an-email')).toBe('')
      expect(sanitizeEmail('user@')).toBe('')
      expect(sanitizeEmail('@example.com')).toBe('')
    })
  })

  describe('sanitizeUrl', () => {
    it('should accept http URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com')
    })

    it('should accept https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com')
    })

    it('should accept relative URLs', () => {
      expect(sanitizeUrl('/dashboard')).toBe('/dashboard')
    })

    it('should reject javascript: URLs', () => {
      expect(sanitizeUrl('javascript:alert(1)')).toBe('')
    })
  })

  describe('validatePassword', () => {
    it('should reject short password', () => {
      const result = validatePassword('Ab1!')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters')
    })

    it('should reject missing uppercase', () => {
      const result = validatePassword('abcdef1!')
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('uppercase'))).toBe(true)
    })

    it('should reject missing lowercase', () => {
      const result = validatePassword('ABCDEF1!')
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('lowercase'))).toBe(true)
    })

    it('should reject missing number', () => {
      const result = validatePassword('Abcdefgh!')
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('number'))).toBe(true)
    })

    it('should reject missing special char', () => {
      const result = validatePassword('Abcdefg1')
      expect(result.valid).toBe(false)
      expect(result.errors.some((e) => e.includes('special'))).toBe(true)
    })

    it('should accept valid password', () => {
      const result = validatePassword('SecurePass1!')
      expect(result.valid).toBe(true)
      expect(result.errors.length).toBe(0)
    })
  })

  describe('passwordStrength', () => {
    it('should return very weak for short password', () => {
      const result = passwordStrength('abc')
      expect(result.label).toBe('Very Weak')
    })

    it('should return very strong for strong password', () => {
      const result = passwordStrength('MyVerySecurePassword2024!')
      expect(result.score).toBeGreaterThanOrEqual(7)
    })
  })

  describe('decodeJwtPayload', () => {
    it('should decode valid JWT', () => {
      const payload = { sub: '123', exp: Date.now() / 1000 + 3600 }
      const encoded = btoa(JSON.stringify(payload))
      const token = `header.${encoded}.signature`
      const decoded = decodeJwtPayload(token)
      expect(decoded?.sub).toBe('123')
    })

    it('should return null for invalid JWT', () => {
      expect(decodeJwtPayload('invalid')).toBe(null)
      expect(decodeJwtPayload('a.b')).toBe(null)
    })
  })

  describe('isJwtExpired', () => {
    it('should return true for expired token', () => {
      const payload = btoa(JSON.stringify({ exp: 1 }))
      expect(isJwtExpired(`header.${payload}.sig`)).toBe(true)
    })

    it('should return false for valid token', () => {
      const payload = btoa(JSON.stringify({ exp: Date.now() / 1000 + 3600 }))
      expect(isJwtExpired(`header.${payload}.sig`)).toBe(false)
    })
  })

  describe('buildCspHeader', () => {
    it('should build valid CSP header string', () => {
      const csp = buildCspHeader()
      expect(csp).toContain('default-src')
      expect(csp).toContain('script-src')
      expect(csp).toContain('style-src')
    })
  })

  describe('validateApiKey', () => {
    it('should accept valid API key', () => {
      expect(validateApiKey('a'.repeat(32))).toBe(true)
    })

    it('should reject short key', () => {
      expect(validateApiKey('short')).toBe(false)
    })

    it('should reject key with special chars', () => {
      expect(validateApiKey('a'.repeat(30) + '!@')).toBe(false)
    })
  })

  describe('escapeSql', () => {
    it('should escape single quotes', () => {
      expect(escapeSql("O'Brien")).toBe("O''Brien")
    })

    it('should remove semicolons', () => {
      expect(escapeSql('DROP TABLE users;')).toBe('DROP TABLE users')
    })

    it('should remove SQL comments', () => {
      expect(escapeSql('admin--')).toBe('admin')
    })
  })

  describe('SECURITY_HEADERS', () => {
    it('should have X-Frame-Options DENY', () => {
      expect(SECURITY_HEADERS['X-Frame-Options']).toBe('DENY')
    })

    it('should have X-Content-Type-Options nosniff', () => {
      expect(SECURITY_HEADERS['X-Content-Type-Options']).toBe('nosniff')
    })
  })
})
