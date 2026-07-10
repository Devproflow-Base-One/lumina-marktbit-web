import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  return NextResponse.json({ status: 'ok', endpoint: 'auth', user: null })
}

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'auth', user: null })
}
