import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const TRACKING_FILE = path.join(process.cwd(), '..', '..', '..', 'data', 'godmode-tracking.json')
const LEADS_FILE = path.join(process.cwd(), '..', '..', '..', 'data', 'godmode-leads-scored.json')

function loadTracking() {
  try {
    if (fs.existsSync(TRACKING_FILE)) {
      return JSON.parse(fs.readFileSync(TRACKING_FILE, 'utf-8'))
    }
  } catch {}
  return { events: [], campaignStats: {} }
}

function saveTracking(data: any) {
  try {
    const dir = path.dirname(TRACKING_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(TRACKING_FILE, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('[Track] Save failed:', e)
  }
}

function loadLeads() {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      return JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8'))
    }
  } catch {}
  return { leads: [] }
}

function saveLeads(data: any) {
  try {
    const dir = path.dirname(LEADS_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(LEADS_FILE, JSON.stringify(data, null, 2))
  } catch (e) {
    console.error('[Leads] Save failed:', e)
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { campaignId, channel, leadId, revenue, eventType } = body

    if (!campaignId) {
      return NextResponse.json({ error: 'campaignId required' }, { status: 400 })
    }

    // Track conversion
    const tracking = loadTracking()
    if (!tracking.campaignStats[campaignId]) {
      tracking.campaignStats[campaignId] = {
        impressions: 0, clicks: 0, conversions: 0, revenue: 0, cost: 0,
        ctr: 0, cvr: 0, roas: 0, createdAt: new Date().toISOString(),
        lastEventAt: null, history: []
      }
    }

    const stats = tracking.campaignStats[campaignId]
    stats.conversions++
    stats.revenue += revenue || 0
    stats.cvr = stats.clicks > 0 ? (stats.conversions / stats.clicks * 100) : 0
    stats.roas = stats.cost > 0 ? (stats.revenue / stats.cost) : 0
    stats.lastEventAt = new Date().toISOString()
    stats.history.push({ event: eventType || 'signup', revenue: revenue || 0, timestamp: new Date().toISOString() })

    tracking.events.push({
      type: 'conversion', campaignId, channel: channel || 'unknown',
      leadId: leadId || null, revenue: revenue || 0,
      eventType: eventType || 'signup',
      timestamp: new Date().toISOString()
    })
    if (tracking.events.length > 500) tracking.events = tracking.events.slice(-500)

    saveTracking(tracking)

    // Update lead score
    if (leadId) {
      const leadsData = loadLeads()
      const lead = leadsData.leads.find((l: any) => l.id === leadId)
      if (lead) {
        lead.conversionScore = (lead.conversionScore || 0) + 50
        lead.lifetimeValue = (lead.lifetimeValue || 0) + (revenue || 0)
        lead.status = 'converted'
        lead.lastActiveAt = new Date().toISOString()
        saveLeads(leadsData)
      }
    }

    return NextResponse.json({
      success: true, campaignId,
      conversions: stats.conversions,
      revenue: stats.revenue,
      roas: stats.roas.toFixed(2)
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/god-mode/track/conversion',
    method: 'POST',
    params: { campaignId: 'string', channel: 'string', leadId: 'string (optional)', revenue: 'number (optional)', eventType: 'signup|purchase (optional)' }
  })
}
