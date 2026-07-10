/**
 * API Middleware Stack
 * F3d: CORS, rate limiting, request validation, structured logging
 *
 * Usage in Next.js API routes:
 *   import { withMiddleware } from '@/lib/middleware'
 *   export default withMiddleware(handler, { auth: 'user', rateLimit: '100/min' })
 */

import { NextRequest, NextResponse } from 'next/server'

// ── Types ──

export type AuthLevel = 'public' | 'user' | 'premium' | 'admin'

export type MiddlewareConfig = {
  auth?: AuthLevel
  rateLimit?: string
  allowedMethods?: string[]
  cors?: boolean
}

type RateLimitStore = Map<string, { count: number; resetAt: number }>

// ── In-memory rate limit store (use Redis in production) ──

const rateLimitStore: RateLimitStore = new Map()

// ── CORS ──

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID, X-Client-Version',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400',
}

function handleCors(req: NextRequest): NextResponse | null {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
  }
  return null
}

// ── Rate Limiting ──

export function parseRateLimit(limit: string): { max: number; windowMs: number } {
  const match = limit.match(/^(\d+)\/(min|hour|sec)$/)
  if (!match) return { max: 100, windowMs: 60000 }
  const count = parseInt(match[1], 10)
  const unit = match[2]
  const windowMs = unit === 'sec' ? 1000 : unit === 'min' ? 60000 : 3600000
  return { max: count, windowMs }
}

export function checkRateLimit(identifier: string, config: string): { allowed: boolean; remaining: number; resetAt: number } {
  const { max, windowMs } = parseRateLimit(config)
  const now = Date.now()
  const key = `${identifier}:${Math.floor(now / windowMs)}`
  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs }
  }

  if (existing.count >= max) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt }
  }

  existing.count++
  return { allowed: true, remaining: max - existing.count, resetAt: existing.resetAt }
}

// ── Request Validation ──

function validateMethod(req: NextRequest, allowedMethods?: string[]): NextResponse | null {
  if (!allowedMethods || allowedMethods.length === 0) return null
  if (!allowedMethods.includes(req.method)) {
    return NextResponse.json(
      { error: 'Method not allowed', allowed: allowedMethods },
      { status: 405, headers: { Allow: allowedMethods.join(', ') } }
    )
  }
  return null
}

// ── Auth Check ──

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

function getAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7)
  return null
}

async function checkAuth(req: NextRequest, level: AuthLevel): Promise<{ authenticated: boolean; userId?: string; tier?: string }> {
  if (level === 'public') return { authenticated: true }

  const token = getAuthToken(req)
  if (!token) return { authenticated: false }

  try {
    const { supabaseAuth } = await import('@/lib/supabase-auth')
    const user = await supabaseAuth.verifyToken(token)
    if (!user) return { authenticated: false }

    if (level === 'admin' && user.tier !== 'admin') return { authenticated: false }
    if (level === 'premium' && !['premium', 'lifetime', 'admin'].includes(user.tier)) {
      return { authenticated: false }
    }

    return { authenticated: true, userId: user.id, tier: user.tier }
  } catch {
    return { authenticated: false }
  }
}

// ── Structured Logging ──

type LogEntry = {
  timestamp: string
  method: string
  path: string
  status: number
  durationMs: number
  ip: string
  userId?: string
  userAgent?: string
}

export function logRequest(entry: LogEntry): void {
  const logLine = JSON.stringify(entry)
  if (entry.status >= 500) {
    console.error(logLine)
  } else if (entry.status >= 400) {
    console.warn(logLine)
  } else {
    console.log(logLine)
  }
}

// ── Main Middleware Wrapper ──

export function withMiddleware(
  handler: (req: NextRequest, ctx: { userId?: string; tier?: string; ip: string }) => Promise<NextResponse> | NextResponse,
  config: MiddlewareConfig = {}
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now()
    const ip = getClientIp(req)
    const path = req.nextUrl.pathname

    // CORS
    if (config.cors !== false) {
      const corsResponse = handleCors(req)
      if (corsResponse) return corsResponse
    }

    // Method validation
    const methodError = validateMethod(req, config.allowedMethods)
    if (methodError) return methodError

    // Auth
    const authLevel = config.auth || 'public'
    const authResult = await checkAuth(req, authLevel)
    if (!authResult.authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Valid authentication required' },
        { status: 401 }
      )
    }

    // Rate limiting
    if (config.rateLimit) {
      const identifier = authResult.userId || ip
      const rateResult = checkRateLimit(identifier, config.rateLimit)
      if (!rateResult.allowed) {
        const retryAfter = Math.ceil((rateResult.resetAt - Date.now()) / 1000)
        return NextResponse.json(
          { error: 'Rate limit exceeded', retryAfter },
          {
            status: 429,
            headers: {
              'Retry-After': String(retryAfter),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': String(rateResult.resetAt),
            },
          }
        )
      }
    }

    // Call handler
    try {
      const response = await handler(req, {
        userId: authResult.userId,
        tier: authResult.tier,
        ip,
      })

      // Add CORS headers to response
      if (config.cors !== false) {
        Object.entries(CORS_HEADERS).forEach(([key, value]) => {
          response.headers.set(key, value)
        })
      }

      // Log
      logRequest({
        timestamp: new Date().toISOString(),
        method: req.method,
        path,
        status: response.status,
        durationMs: Date.now() - startTime,
        ip,
        userId: authResult.userId,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return response
    } catch (error) {
      console.error(`[API Error] ${req.method} ${path}:`, error)
      const errorResponse = NextResponse.json(
        { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
        { status: 500 }
      )

      logRequest({
        timestamp: new Date().toISOString(),
        method: req.method,
        path,
        status: 500,
        durationMs: Date.now() - startTime,
        ip,
        userId: authResult.userId,
        userAgent: req.headers.get('user-agent') || undefined,
      })

      return errorResponse
    }
  }
}

// ── Rate limit cleanup (prevent memory leak) ──

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of rateLimitStore.entries()) {
      if (now > value.resetAt) {
        rateLimitStore.delete(key)
      }
    }
  }, 60000).unref?.()
}
