import { NextResponse } from 'next/server'

// No server-side validation — accepts any input including empty strings.
// BUG: should validate email format and reject empty/invalid submissions.
export async function POST() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return NextResponse.json({ success: true })
}
