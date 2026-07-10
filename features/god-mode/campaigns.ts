/**
 * God Mode — Campaign Orchestration
 * F4e: Manage ad campaigns, lead generation, sales pipelines
 */

export interface Campaign {
  id: string
  name: string
  type: 'lead_generation' | 'sales' | 'brand_awareness' | 'retargeting'
  status: 'draft' | 'active' | 'paused' | 'completed'
  budget: number
  spent: number
  impressions: number
  clicks: number
  conversions: number
  ctr: number
  cpc: number
  cpa: number
  roas: number
  startDate: string
  endDate?: string
  channels: string[]
  targetSegment: string
  createdAt: string
}

export interface LeadPipeline {
  totalLeads: number
  qualified: number
  contacted: number
  responded: number
  closed: number
  conversionRate: number
  avgDealSize: number
  totalRevenue: number
  stages: Array<{
    stage: string
    count: number
    percentage: number
  }>
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const campaignAPI = {
  async getCampaigns(): Promise<{ campaigns: Campaign[] }> {
    const res = await fetch(`${API_BASE}/api/god-mode/campaigns`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch campaigns')
    return res.json()
  },

  async createCampaign(data: Partial<Campaign>): Promise<Campaign> {
    const res = await fetch(`${API_BASE}/api/god-mode/campaigns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create campaign')
    return res.json()
  },

  async updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign> {
    const res = await fetch(`${API_BASE}/api/god-mode/campaigns/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to update campaign')
    return res.json()
  },

  async getPipeline(): Promise<LeadPipeline> {
    const res = await fetch(`${API_BASE}/api/god-mode/pipeline`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to fetch pipeline')
    return res.json()
  },
}
