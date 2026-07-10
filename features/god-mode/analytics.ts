/**
 * God Mode — Analytics Dashboard
 * F4e: Real-time metrics, KPIs, performance tracking
 */

export interface AnalyticsMetrics {
  revenue: {
    today: number
    thisWeek: number
    thisMonth: number
    trend: number[]
  }
  users: {
    active: number
    new: number
    total: number
    trend: number[]
  }
  signals: {
    generated: number
    accuracy: number
    avgConfidence: number
    byCategory: Record<string, number>
  }
  ads: {
    impressions: number
    clicks: number
    revenue: number
    ecpm: number
    ctr: number
    byNetwork: Array<{ network: string; revenue: number; impressions: number }>
  }
  system: {
    cpuUsage: number
    memoryUsage: number
    diskUsage: number
    apiLatency: number
    uptime: string
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const analyticsAPI = {
  async getMetrics(): Promise<AnalyticsMetrics> {
    const res = await fetch(`${API_BASE}/api/god-mode/analytics`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch analytics')
    return res.json()
  },

  async getRevenueChart(days = 30): Promise<{ data: Array<{ date: string; revenue: number }> }> {
    const res = await fetch(`${API_BASE}/api/god-mode/analytics/revenue?days=${days}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch revenue chart')
    return res.json()
  },

  async getUserGrowth(days = 30): Promise<{ data: Array<{ date: string; users: number }> }> {
    const res = await fetch(`${API_BASE}/api/god-mode/analytics/users?days=${days}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch user growth')
    return res.json()
  },

  async getSignalPerformance(days = 30): Promise<{ data: Array<{ date: string; generated: number; accurate: number }> }> {
    const res = await fetch(`${API_BASE}/api/god-mode/analytics/signals?days=${days}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch signal performance')
    return res.json()
  },
}
