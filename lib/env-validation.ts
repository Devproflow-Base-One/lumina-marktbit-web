/**
 * Environment Variable Validation
 * 
 * Validates required env vars at startup and provides typed access.
 * F2d: Environment variable validation + .env templates
 */

type EnvVar = {
  key: string
  required: boolean
  public: boolean
  description: string
  defaultValue?: string
}

const ENV_VARS: EnvVar[] = [
  // ── Public (exposed to client) ──
  { key: 'NEXT_PUBLIC_API_URL', required: false, public: true, description: 'Backend API URL', defaultValue: 'http://localhost:8000' },
  { key: 'NEXT_PUBLIC_SIGNAL_API_URL', required: false, public: true, description: 'Signal Engine API URL', defaultValue: 'http://localhost:8787/api/v1' },
  { key: 'NEXT_PUBLIC_STOCK_API_URL', required: false, public: true, description: 'Stock API URL', defaultValue: 'http://localhost:8788/api/v1' },
  { key: 'NEXT_PUBLIC_POSTHOG_KEY', required: false, public: true, description: 'PostHog analytics project key' },
  { key: 'NEXT_PUBLIC_POSTHOG_HOST', required: false, public: true, description: 'PostHog host URL', defaultValue: 'https://us.i.posthog.com' },
  { key: 'NEXT_PUBLIC_GOD_MODE_URL', required: false, public: true, description: 'God Mode API URL', defaultValue: 'http://localhost:8789' },
  { key: 'NEXT_PUBLIC_TELEGRAM_BOT_URL', required: false, public: true, description: 'Telegram bot URL' },
  { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', required: false, public: true, description: 'Stripe publishable key' },
  { key: 'NEXT_PUBLIC_NOWPAYMENTS_API_KEY', required: false, public: true, description: 'NowPayments API key' },
  { key: 'NEXT_PUBLIC_NOWPAYMENTS_API_URL', required: false, public: true, description: 'NowPayments API URL', defaultValue: 'https://api.nowpayments.io/v1' },

  // ── Server-only ──
  { key: 'STRIPE_SECRET_KEY', required: false, public: false, description: 'Stripe secret key for payments' },
  { key: 'STRIPE_WEBHOOK_SECRET', required: false, public: false, description: 'Stripe webhook signing secret' },
  { key: 'NOWPAYMENTS_API_KEY', required: false, public: false, description: 'NowPayments server API key' },
  { key: 'RESEND_API_KEY', required: false, public: false, description: 'Resend email API key' },
  { key: 'TELEGRAM_BOT_TOKEN', required: false, public: false, description: 'Telegram bot token' },
  { key: 'SENTRY_DSN', required: false, public: false, description: 'Sentry DSN for error tracking' },
  { key: 'LUMINA_API_KEY', required: false, public: false, description: 'Lumina Overmind API key' },
  { key: 'UPSTASH_REDIS_URL', required: false, public: false, description: 'Upstash Redis REST URL' },
  { key: 'UPSTASH_REDIS_TOKEN', required: false, public: false, description: 'Upstash Redis REST token' },
  { key: 'SUPABASE_URL', required: false, public: false, description: 'Supabase project URL' },
  { key: 'SUPABASE_ANON_KEY', required: false, public: false, description: 'Supabase anon key' },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', required: false, public: false, description: 'Supabase service role key' },
]

export type EnvStatus = {
  key: string
  status: 'set' | 'missing' | 'default'
  value: string | undefined
  required: boolean
  public: boolean
  description: string
}

/**
 * Validate all environment variables and return status report.
 * Call this at startup or in health checks.
 */
export function validateEnv(): EnvStatus[] {
  return ENV_VARS.map((v) => {
    const value = process.env[v.key]
    if (value) {
      return { key: v.key, status: 'set' as const, value, required: v.required, public: v.public, description: v.description }
    }
    if (v.defaultValue) {
      return { key: v.key, status: 'default' as const, value: v.defaultValue, required: v.required, public: v.public, description: v.description }
    }
    return { key: v.key, status: 'missing' as const, value: undefined, required: v.required, public: v.public, description: v.description }
  })
}

/**
 * Get missing required env vars.
 */
export function getMissingRequiredEnv(): string[] {
  return ENV_VARS
    .filter((v) => v.required && !process.env[v.key])
    .map((v) => v.key)
}

/**
 * Get a typed env var with fallback.
 */
export function getEnv(key: string, fallback?: string): string {
  return process.env[key] || fallback || ''
}

/**
 * Check if an env var is set.
 */
export function hasEnv(key: string): boolean {
  return !!process.env[key]
}

/**
 * Log env status summary (for dev/debug only).
 */
export function logEnvStatus(): void {
  const statuses = validateEnv()
  const set = statuses.filter((s) => s.status === 'set').length
  const missing = statuses.filter((s) => s.status === 'missing').length
  const defaults = statuses.filter((s) => s.status === 'default').length
  console.log(`[Env] ${set} set, ${defaults} using defaults, ${missing} missing`)
  if (missing > 0) {
    const missingRequired = statuses.filter((s) => s.status === 'missing' && s.required)
    if (missingRequired.length > 0) {
      console.warn(`[Env] Missing required: ${missingRequired.map((m) => m.key).join(', ')}`)
    }
  }
}
