/**
 * Security Hardening Utilities
 * F4i: Input sanitization, XSS prevention, CSRF, content security policy
 */

// ── Input Sanitization ──

export function sanitizeString(input: string, maxLength = 1000): string {
  if (typeof input !== 'string') return ''
  return input
    .slice(0, maxLength)
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
}

export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function sanitizeEmail(email: string): string {
  const cleaned = email.trim().toLowerCase()
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(cleaned)) return ''
  return cleaned.slice(0, 255)
}

export function sanitizeUrl(url: string): string {
  const trimmed = url.trim()
  if (/^https?:\/\//i.test(trimmed)) return trimmed.slice(0, 2048)
  if (/^\//.test(trimmed)) return trimmed.slice(0, 2048)
  return ''
}

// ── Password Validation ──

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (password.length < 8) errors.push('Password must be at least 8 characters')
  if (password.length > 128) errors.push('Password must be at most 128 characters')
  if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter')
  if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter')
  if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number')
  if (!/[^A-Za-z0-9]/.test(password)) errors.push('Password must contain at least one special character')
  return { valid: errors.length === 0, errors }
}

export function passwordStrength(password: string): { score: number; label: string } {
  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (password.length >= 20) score++

  if (score <= 2) return { score, label: 'Very Weak' }
  if (score <= 4) return { score, label: 'Weak' }
  if (score <= 5) return { score, label: 'Fair' }
  if (score <= 6) return { score, label: 'Good' }
  if (score <= 7) return { score, label: 'Strong' }
  return { score, label: 'Very Strong' }
}

// ── Rate Limit Helpers ──

export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

// ── JWT Helpers ──

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(payload)
  } catch {
    return null
  }
}

export function isJwtExpired(token: string): boolean {
  const payload = decodeJwtPayload(token)
  if (!payload || !payload.exp) return true
  return Date.now() >= (payload.exp as number) * 1000
}

// ── Content Security Policy ──

export const CSP_DIRECTIVES = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'https://cdn.jsdelivr.net',
    'https://unpkg.com',
    'https://us.i.posthog.com',
    'https://eu.i.posthog.com',
  ],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': [
    "'self'",
    'https://api.coingecko.com',
    'https://query1.finance.yahoo.com',
    'https://query2.finance.yahoo.com',
    'https://us.i.posthog.com',
    'https://eu.i.posthog.com',
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    process.env.NEXT_PUBLIC_SIGNAL_API_URL || 'http://localhost:8787',
    process.env.NEXT_PUBLIC_STOCK_API_URL || 'http://localhost:8788',
  ].filter(Boolean),
  'frame-ancestors': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
}

export function buildCspHeader(): string {
  return Object.entries(CSP_DIRECTIVES)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}

// ── Security Headers ──

export const SECURITY_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-DNS-Prefetch-Control': 'on',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
}

// ── API Key Validation ──

export function validateApiKey(key: string): boolean {
  if (!key || key.length < 32) return false
  return /^[a-zA-Z0-9_-]+$/.test(key)
}

// ── SQL Injection Prevention (for raw queries) ──

export function escapeSql(input: string): string {
  return input.replace(/'/g, "''").replace(/;/g, '').replace(/--/g, '')
}
