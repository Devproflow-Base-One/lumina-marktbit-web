import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'public', 'latest_signals.json')
    const raw = readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        engine_status: 'OFFLINE',
        total_signals: 0,
        signals: [],
        overmind_telemetry: { source: 'error', bridge_version: 'api-route' },
        minted_at: new Date().toISOString(),
        timestamp: Date.now(),
        error: 'Could not read latest_signals.json',
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    )
  }
}
