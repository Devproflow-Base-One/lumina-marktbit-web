import { NextResponse } from 'next/server'

const PLANS: Record<string, {
  name: string
  displayName: string
  description: string
  priceMonthly: number
  yearlyPrice: number
  lifetimePrice: number
  features: string[]
  limits: { signals_per_day: number; categories: string[]; lifetime?: boolean }
}> = {
  free: {
    name: 'free',
    displayName: 'Free',
    description: 'Mulai dengan sinyal dasar',
    priceMonthly: 0,
    yearlyPrice: 0,
    lifetimePrice: 0,
    features: ['1 sinyal/hari', 'BTC only', 'Dashboard access', 'Community comments', 'DEVFLO AI Consultant'],
    limits: { signals_per_day: 1, categories: ['crypto'] }
  },
  premium: {
    name: 'premium',
    displayName: 'Premium',
    description: 'Akses penuh ke semua sinyal',
    priceMonthly: 3,
    yearlyPrice: 30,
    lifetimePrice: 99,
    features: ['Unlimited sinyal', 'Semua coin & saham', 'Priority support', 'Ad-free', 'DEVFLO AI', 'Backtest', 'Advanced indicators'],
    limits: { signals_per_day: -1, categories: ['crypto', 'stocks-id', 'stocks-global'] }
  },
  lifetime: {
    name: 'lifetime',
    displayName: 'Lifetime',
    description: 'Akses selamanya',
    priceMonthly: 99,
    yearlyPrice: 99,
    lifetimePrice: 99,
    features: ['Semua fitur Premium', 'Akses selamanya', 'Lifetime updates', 'Priority support 24/7', 'Ad-free forever'],
    limits: { signals_per_day: -1, categories: ['crypto', 'stocks-id', 'stocks-global'], lifetime: true }
  }
}

export async function GET() {
  return NextResponse.json({ plans: Object.values(PLANS) })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { planName } = body

  if (!planName || !PLANS[planName]) {
    return NextResponse.json({ success: false, error: 'Invalid plan' }, { status: 400 })
  }

  return NextResponse.json({ success: true, plan: PLANS[planName] })
}
