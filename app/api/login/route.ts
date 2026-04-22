// app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    )
  }

  // Email pattern validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format')
  }

  // Check credentials
  if (email === 'user@example.com' && password === 'password12345') {
    return NextResponse.json({ success: true })
  }

  return NextResponse.json(
    { success: false, error: 'Invalid credentials' },
    { status: 401 }
  )
}
