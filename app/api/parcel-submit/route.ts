import { NextRequest, NextResponse } from 'next/server'

// Simulates a slow API that takes 3 seconds to respond.
// Clicking Submit before the response arrives triggers an error state.
// Candidate must use waitForResponse / toBeVisible patterns — not waitForTimeout.
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { parcelNumber } = body

  if (!parcelNumber || parcelNumber.trim() === '') {
    return NextResponse.json(
      { error: 'Parcel number is required' },
      { status: 400 }
    )
  }

  // Simulate API processing delay
  await new Promise((resolve) => setTimeout(resolve, 3000))

  // Simulate occasional server errors for race condition testing
  const requestId = req.headers.get('x-request-id')
  if (requestId === 'duplicate') {
    return NextResponse.json(
      { error: 'Duplicate request detected' },
      { status: 409 }
    )
  }

  return NextResponse.json({
    success: true,
    parcelNumber: parcelNumber.trim().toUpperCase(),
    status: 'IN_TRANSIT',
    estimatedDelivery: '2025-04-25',
    location: 'London Sorting Centre',
  })
}
