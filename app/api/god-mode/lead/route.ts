import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const LEADS_FILE = path.join(process.cwd(), '..', '..', '..', 'data', 'godmode-leads-scored.json')

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
    const { email, phone, name, channel, source, interests, tags } = body

    if (!email && !phone) {
      return NextResponse.json({ error: 'email or phone required' }, { status: 400 })
    }

    const leadsData = loadLeads()

    // Check for duplicate
    const existing = leadsData.leads.find((l: any) =>
      (email && l.email === email) || (phone && l.phone === phone)
    )

    if (existing) {
      // Update engagement
      existing.engagementScore = (existing.engagementScore || 0) + 5
      existing.lastActiveAt = new Date().toISOString()
      existing.engagementHistory = existing.engagementHistory || []
      existing.engagementHistory.push({ action: 'signup', points: 5, timestamp: new Date().toISOString() })
      existing.status = existing.conversionScore > 0 ? 'converted' :
        existing.engagementScore >= 50 ? 'hot' :
        existing.engagementScore >= 25 ? 'warm' : 'lukewarm'
      saveLeads(leadsData)
      return NextResponse.json({ success: true, leadId: existing.id, duplicate: true })
    }

    // Create new lead
    const id = `lead_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const lead = {
      id,
      email: email || null,
      phone: phone || null,
      name: name || null,
      channel: channel || 'web',
      source: source || 'landing_page',
      interests: interests || ['crypto signals'],
      engagementScore: 5,
      conversionScore: 0,
      lifetimeValue: 0,
      status: 'new',
      firstSeenAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      lastNurturedAt: null,
      engagementHistory: [{ action: 'signup', points: 5, timestamp: new Date().toISOString() }],
      nurtured: false,
      tags: tags || []
    }

    leadsData.leads.push(lead)
    saveLeads(leadsData)

    console.log(`[LeadCapture] New lead: ${id} (${email || phone})`)

    return NextResponse.json({ success: true, leadId: id, lead })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET() {
  const leadsData = loadLeads()
  return NextResponse.json({
    total: leadsData.leads.length,
    hot: leadsData.leads.filter((l: any) => l.status === 'hot').length,
    warm: leadsData.leads.filter((l: any) => l.status === 'warm').length,
    converted: leadsData.leads.filter((l: any) => l.status === 'converted').length,
    leads: leadsData.leads.slice(-20)
  })
}
