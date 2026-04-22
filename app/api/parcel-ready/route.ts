import { NextResponse } from 'next/server'

// Simulates a tracking system warm-up. Returns ready after 3 seconds.
// The async challenge page calls this on mount — submit before it resolves returns a 503.
export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 5000))

  return NextResponse.json({ ready: true })
}
