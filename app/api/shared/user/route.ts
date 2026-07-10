import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'ok', endpoint: 'user', user: null })
}
