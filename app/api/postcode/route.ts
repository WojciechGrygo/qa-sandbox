import { NextResponse } from 'next/server'

// BUG: always returns 500 — server unavailable
export async function POST() {
  return NextResponse.json(
    { error: 'Service temporarily unavailable. Please try again later.' },
    { status: 500 }
  )
}
