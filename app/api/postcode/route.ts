import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'Service temporarily unavailable. Please try again later.' },
    { status: 500 }
  )
}
