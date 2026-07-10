/**
 * TELEMETRY HEARTBEAT — LUMINA MARKTBIT
 * =====================================
 * Background interval that POSTs to the Overmind orchestrator every 60 seconds.
 * Run this as a Next.js server-side utility or standalone Node script.
 *
 * Usage in Next.js (e.g., in instrumentation.ts or a server component):
 *   import { startTelemetryHeartbeat } from './lib/overmind-telemetry'
 *   startTelemetryHeartbeat()
 *
 * Usage standalone:
 *   npx tsx lib/overmind-telemetry.ts
 */

const OVERMIND_API_URL = process.env.NEXT_PUBLIC_OVERMIND_API_URL || 'http://localhost:8000'
const TELEMETRY_ENDPOINT = `${OVERMIND_API_URL}/api/v1/telemetry/ingest`
const HEARTBEAT_INTERVAL_MS = 60_000
const PRODUCT_ID = 'lumina-marktbit'

let heartbeatTimer: ReturnType<typeof setInterval> | null = null

interface TelemetryPayload {
  source: string
  event_type: string
  status: string
  timestamp: string
  version?: string
  uptime?: number
}

async function sendHeartbeat(): Promise<void> {
  const payload: TelemetryPayload = {
    source: PRODUCT_ID,
    event_type: 'heartbeat',
    status: 'online',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    uptime: process.uptime ? Math.floor(process.uptime()) : undefined,
  }

  try {
    const response = await fetch(TELEMETRY_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.LUMINA_LICENSE_KEY
          ? { Authorization: `Bearer ${process.env.LUMINA_LICENSE_KEY}` }
          : {}),
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.warn(`[TELEMETRY] Overmind returned ${response.status}`)
    }
  } catch (error) {
    console.warn(`[TELEMETRY] Heartbeat failed (Overmind may be offline):`, error)
  }
}

export function startTelemetryHeartbeat(): void {
  if (heartbeatTimer) {
    console.log('[TELEMETRY] Heartbeat already running')
    return
  }

  console.log(`[TELEMETRY] Starting heartbeat → ${TELEMETRY_ENDPOINT} every ${HEARTBEAT_INTERVAL_MS / 1000}s`)

  // Send immediately on start
  sendHeartbeat()

  heartbeatTimer = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL_MS)
}

export function stopTelemetryHeartbeat(): void {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
    console.log('[TELEMETRY] Heartbeat stopped')
  }
}
