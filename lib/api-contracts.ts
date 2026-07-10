/**
 * API Contract Table
 * F3c: Documented API contracts for all endpoints
 *
 * All endpoints follow RESTful conventions:
 * - GET: Read data
 * - POST: Create data
 * - PUT/PATCH: Update data
 * - DELETE: Remove data
 *
 * Auth: Bearer token (Supabase JWT) for protected routes
 * Rate limit: 100 req/min for free, 1000 req/min for premium
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type AuthLevel = 'public' | 'user' | 'premium' | 'admin'

export type ApiEndpoint = {
  method: HttpMethod
  path: string
  description: string
  auth: AuthLevel
  rateLimit: string
  requestParams?: Record<string, { type: string; required: boolean; description: string }>
  responseShape: string
}

export const API_CONTRACTS: ApiEndpoint[] = [
  // ── Signals ──
  {
    method: 'GET',
    path: '/api/signals',
    description: 'Get paginated signals with optional category filter',
    auth: 'public',
    rateLimit: '100/min',
    requestParams: {
      category: { type: 'string', required: false, description: 'crypto | stocks-id | stocks-global' },
      limit: { type: 'number', required: false, description: 'Default 50, max 100' },
      offset: { type: 'number', required: false, description: 'Pagination offset' },
      status: { type: 'string', required: false, description: 'active | hit_tp | hit_sl | expired' },
    },
    responseShape: '{ signals: Signal[], total: number, hasMore: boolean }',
  },
  {
    method: 'GET',
    path: '/api/signals/:id',
    description: 'Get single signal by ID with performance data',
    auth: 'public',
    rateLimit: '100/min',
    requestParams: { id: { type: 'uuid', required: true, description: 'Signal UUID' } },
    responseShape: '{ signal: Signal, performance?: SignalPerformance }',
  },
  {
    method: 'POST',
    path: '/api/signals',
    description: 'Create a new signal (admin only)',
    auth: 'admin',
    rateLimit: '10/min',
    responseShape: '{ signal: Signal }',
  },
  {
    method: 'GET',
    path: '/api/signals/stats',
    description: 'Get aggregate signal statistics by category',
    auth: 'public',
    rateLimit: '50/min',
    responseShape: '{ stats: { category, total, active, buy, sell, avgConfidence }[] }',
  },

  // ── Market Data ──
  {
    method: 'GET',
    path: '/api/market/:symbol',
    description: 'Get current market data for a symbol',
    auth: 'public',
    rateLimit: '100/min',
    requestParams: {
      symbol: { type: 'string', required: true, description: 'e.g. BTCUSDT, AAPL' },
      category: { type: 'string', required: false, description: 'crypto | stocks-id | stocks-global' },
    },
    responseShape: '{ symbol, price, change24h, volume, high24h, low24h }',
  },
  {
    method: 'GET',
    path: '/api/market/:symbol/history',
    description: 'Get historical OHLCV data',
    auth: 'public',
    rateLimit: '50/min',
    requestParams: {
      symbol: { type: 'string', required: true, description: 'Trading symbol' },
      timeframe: { type: 'string', required: false, description: '1h | 4h | 1d | 1w (default 1d)' },
      limit: { type: 'number', required: false, description: 'Candles count (default 100, max 1000)' },
    },
    responseShape: '{ candles: { timestamp, open, high, low, close, volume }[] }',
  },

  // ── Watchlists ──
  {
    method: 'GET',
    path: '/api/watchlists',
    description: 'Get user watchlists',
    auth: 'user',
    rateLimit: '100/min',
    responseShape: '{ watchlists: Watchlist[] }',
  },
  {
    method: 'POST',
    path: '/api/watchlists',
    description: 'Create a new watchlist',
    auth: 'user',
    rateLimit: '20/min',
    responseShape: '{ watchlist: Watchlist }',
  },
  {
    method: 'PUT',
    path: '/api/watchlists/:id',
    description: 'Update watchlist (rename, add/remove items)',
    auth: 'user',
    rateLimit: '50/min',
    responseShape: '{ watchlist: Watchlist }',
  },
  {
    method: 'DELETE',
    path: '/api/watchlists/:id',
    description: 'Delete a watchlist',
    auth: 'user',
    rateLimit: '20/min',
    responseShape: '{ success: boolean }',
  },

  // ── Alerts ──
  {
    method: 'GET',
    path: '/api/alerts',
    description: 'Get user alerts',
    auth: 'user',
    rateLimit: '100/min',
    responseShape: '{ alerts: Alert[] }',
  },
  {
    method: 'POST',
    path: '/api/alerts',
    description: 'Create a price/indicator alert',
    auth: 'user',
    rateLimit: '30/min',
    responseShape: '{ alert: Alert }',
  },
  {
    method: 'PUT',
    path: '/api/alerts/:id',
    description: 'Update alert (activate/deactivate, modify conditions)',
    auth: 'user',
    rateLimit: '50/min',
    responseShape: '{ alert: Alert }',
  },
  {
    method: 'DELETE',
    path: '/api/alerts/:id',
    description: 'Delete an alert',
    auth: 'user',
    rateLimit: '20/min',
    responseShape: '{ success: boolean }',
  },

  // ── Portfolios ──
  {
    method: 'GET',
    path: '/api/portfolios',
    description: 'Get user portfolios with current valuations',
    auth: 'user',
    rateLimit: '100/min',
    responseShape: '{ portfolios: Portfolio[] }',
  },
  {
    method: 'POST',
    path: '/api/portfolios',
    description: 'Create a new portfolio',
    auth: 'user',
    rateLimit: '20/min',
    responseShape: '{ portfolio: Portfolio }',
  },
  {
    method: 'PUT',
    path: '/api/portfolios/:id',
    description: 'Update portfolio holdings',
    auth: 'user',
    rateLimit: '50/min',
    responseShape: '{ portfolio: Portfolio }',
  },
  {
    method: 'DELETE',
    path: '/api/portfolios/:id',
    description: 'Delete a portfolio',
    auth: 'user',
    rateLimit: '20/min',
    responseShape: '{ success: boolean }',
  },

  // ── Notifications ──
  {
    method: 'GET',
    path: '/api/notifications',
    description: 'Get user notifications (paginated)',
    auth: 'user',
    rateLimit: '100/min',
    requestParams: {
      unread_only: { type: 'boolean', required: false, description: 'Filter unread only' },
      limit: { type: 'number', required: false, description: 'Default 20' },
    },
    responseShape: '{ notifications: Notification[], total: number, unreadCount: number }',
  },
  {
    method: 'PUT',
    path: '/api/notifications/:id/read',
    description: 'Mark notification as read',
    auth: 'user',
    rateLimit: '100/min',
    responseShape: '{ success: boolean }',
  },
  {
    method: 'PUT',
    path: '/api/notifications/read-all',
    description: 'Mark all notifications as read',
    auth: 'user',
    rateLimit: '10/min',
    responseShape: '{ updated: number }',
  },

  // ── Auth ──
  {
    method: 'POST',
    path: '/api/auth/register',
    description: 'Register a new user account',
    auth: 'public',
    rateLimit: '5/min',
    responseShape: '{ user: User, session: Session }',
  },
  {
    method: 'POST',
    path: '/api/auth/login',
    description: 'Login with email/password',
    auth: 'public',
    rateLimit: '10/min',
    responseShape: '{ user: User, session: Session }',
  },
  {
    method: 'POST',
    path: '/api/auth/logout',
    description: 'Logout current session',
    auth: 'user',
    rateLimit: '20/min',
    responseShape: '{ success: boolean }',
  },
  {
    method: 'GET',
    path: '/api/auth/me',
    description: 'Get current user profile',
    auth: 'user',
    rateLimit: '100/min',
    responseShape: '{ user: User }',
  },

  // ── Subscriptions ──
  {
    method: 'GET',
    path: '/api/subscriptions',
    description: 'Get user subscription history',
    auth: 'user',
    rateLimit: '50/min',
    responseShape: '{ subscriptions: Subscription[] }',
  },
  {
    method: 'POST',
    path: '/api/subscriptions/checkout',
    description: 'Create checkout session (Stripe or NowPayments)',
    auth: 'user',
    rateLimit: '10/min',
    requestParams: {
      plan: { type: 'string', required: true, description: 'premium | lifetime' },
      period: { type: 'string', required: true, description: 'monthly | yearly | lifetime' },
      method: { type: 'string', required: true, description: 'stripe | nowpayments' },
    },
    responseShape: '{ checkoutUrl: string, sessionId: string }',
  },
  {
    method: 'POST',
    path: '/api/subscriptions/cancel',
    description: 'Cancel active subscription',
    auth: 'user',
    rateLimit: '10/min',
    responseShape: '{ success: boolean }',
  },

  // ── Comments ──
  {
    method: 'GET',
    path: '/api/comments',
    description: 'Get comments for a signal or category',
    auth: 'public',
    rateLimit: '100/min',
    requestParams: {
      signal_id: { type: 'uuid', required: false, description: 'Filter by signal' },
      category: { type: 'string', required: false, description: 'Filter by category' },
    },
    responseShape: '{ comments: Comment[], total: number }',
  },
  {
    method: 'POST',
    path: '/api/comments',
    description: 'Post a comment (requires auth)',
    auth: 'user',
    rateLimit: '30/min',
    responseShape: '{ comment: Comment }',
  },
  {
    method: 'DELETE',
    path: '/api/comments/:id',
    description: 'Delete own comment',
    auth: 'user',
    rateLimit: '20/min',
    responseShape: '{ success: boolean }',
  },

  // ── God Mode (admin) ──
  {
    method: 'GET',
    path: '/api/god-mode/dashboard',
    description: 'Get God Mode dashboard data',
    auth: 'admin',
    rateLimit: '50/min',
    responseShape: '{ campaigns, leads, adPerformance, revenue, stats }',
  },
  {
    method: 'POST',
    path: '/api/god-mode/campaigns',
    description: 'Create a marketing campaign',
    auth: 'admin',
    rateLimit: '20/min',
    responseShape: '{ campaign: Campaign }',
  },
  {
    method: 'GET',
    path: '/api/god-mode/terminal-logs',
    description: 'Get terminal logs (WebSocket + REST)',
    auth: 'admin',
    rateLimit: '100/min',
    responseShape: '{ logs: TerminalLog[] }',
  },

  // ── Health ──
  {
    method: 'GET',
    path: '/api/health',
    description: 'Health check endpoint',
    auth: 'public',
    rateLimit: '1000/min',
    responseShape: '{ status: "ok", timestamp, version, uptime }',
  },
]

/**
 * Get endpoints by auth level
 */
export function getEndpointsByAuth(level: AuthLevel): ApiEndpoint[] {
  return API_CONTRACTS.filter((e) => e.auth === level)
}

/**
 * Get endpoints by HTTP method
 */
export function getEndpointsByMethod(method: HttpMethod): ApiEndpoint[] {
  return API_CONTRACTS.filter((e) => e.method === method)
}

/**
 * Find endpoint by path pattern
 */
export function findEndpoint(path: string): ApiEndpoint | undefined {
  return API_CONTRACTS.find((e) => e.path === path)
}
