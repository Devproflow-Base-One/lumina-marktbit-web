import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    impressions: 0,
    clicks: 0,
    conversions: 0,
    revenue: 0,
    byCategory: {
      crypto: { impressions: 0, clicks: 0, revenue: 0 },
      'stocks-id': { impressions: 0, clicks: 0, revenue: 0 },
      'stocks-global': { impressions: 0, clicks: 0, revenue: 0 }
    }
  })
}
