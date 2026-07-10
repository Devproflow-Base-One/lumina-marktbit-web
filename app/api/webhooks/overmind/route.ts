import { NextRequest, NextResponse } from 'next/server'
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'

const WEBHOOK_LOG_DIR = join(process.cwd(), 'data')
const WEBHOOK_LOG_FILE = join(WEBHOOK_LOG_DIR, 'overmind_webhooks.json')

interface WebhookEntry {
  id: string
  received_at: string
  event_type: string
  payload: Record<string, unknown>
}

function loadLog(): WebhookEntry[] {
  try {
    if (existsSync(WEBHOOK_LOG_FILE)) {
      return JSON.parse(readFileSync(WEBHOOK_LOG_FILE, 'utf-8'))
    }
  } catch {
    // Corrupt or empty — start fresh
  }
  return []
}

function saveLog(entries: WebhookEntry[]): void {
  if (!existsSync(WEBHOOK_LOG_DIR)) {
    mkdirSync(WEBHOOK_LOG_DIR, { recursive: true })
  }
  // Keep last 500 entries
  const trimmed = entries.slice(-500)
  writeFileSync(WEBHOOK_LOG_FILE, JSON.stringify(trimmed, null, 2), 'utf-8')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const entry: WebhookEntry = {
      id: `wh_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      received_at: new Date().toISOString(),
      event_type: body.event_type || body.type || 'unknown',
      payload: body,
    }

    const log = loadLog()
    log.push(entry)
    saveLog(log)

    console.log(`[OVERMIND WEBHOOK] Received: ${entry.event_type}`)

    return NextResponse.json({
      received: true,
      webhook_id: entry.id,
      timestamp: entry.received_at,
    })
  } catch (error) {
    console.error('[OVERMIND WEBHOOK] Error:', error)
    return NextResponse.json(
      { received: false, error: 'Invalid payload' },
      { status: 400 }
    )
  }
}

export async function GET() {
  const log = loadLog()
  return NextResponse.json({
    total: log.length,
    recent: log.slice(-20),
  })
}
