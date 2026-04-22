import { NextRequest, NextResponse } from 'next/server'
import {
  deleteParcel,
  getParcel,
  isAuthorized,
  updateParcel,
  type Address,
  type DeliveryType,
  type UpdateParcelInput,
} from '@/lib/parcel-store'

type Params = { params: Promise<{ id: string }> }

const VALID_DELIVERY_TYPES: DeliveryType[] = ['LOCKER', 'HOME']

function validateAddress(obj: unknown): { address?: Address; error?: string } {
  if (typeof obj !== 'object' || obj === null) return { error: 'address must be an object' }
  const a = obj as Record<string, unknown>
  if (!a.street || typeof a.street !== 'string') return { error: 'address.street is required' }
  if (!a.city || typeof a.city !== 'string') return { error: 'address.city is required' }
  if (!a.postcode || typeof a.postcode !== 'string') return { error: 'address.postcode is required' }
  if (!a.country || typeof a.country !== 'string') return { error: 'address.country is required' }
  return { address: { street: a.street, city: a.city, postcode: a.postcode, country: a.country } }
}

// GET /api/parcels/:id — fetch one parcel (no auth)
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const parcel = getParcel(id)
  if (!parcel) {
    return NextResponse.json({ error: 'Parcel not found' }, { status: 404 })
  }
  return NextResponse.json(parcel)
}

// PATCH /api/parcels/:id — update parcel fields (auth required)
// Updatable: deliveryType, address, lockerCode, phoneNumber, notes
// Not updatable via this endpoint: status (use /status), id, trackingNumber, size, recipientName, recipientEmail
export async function PATCH(req: NextRequest, { params }: Params) {
  if (!isAuthorized(req.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { deliveryType, address, lockerCode, phoneNumber, notes } = body
  const input: UpdateParcelInput = {}

  if (deliveryType !== undefined) {
    if (!VALID_DELIVERY_TYPES.includes(deliveryType as DeliveryType)) {
      return NextResponse.json(
        { error: `deliveryType must be one of: ${VALID_DELIVERY_TYPES.join(', ')}` },
        { status: 400 }
      )
    }
    input.deliveryType = deliveryType as DeliveryType
  }

  if (address !== undefined) {
    const { address: parsed, error } = validateAddress(address)
    if (error) return NextResponse.json({ error }, { status: 400 })
    input.address = parsed
  }

  if (lockerCode !== undefined) {
    if (typeof lockerCode !== 'string') {
      return NextResponse.json({ error: 'lockerCode must be a string' }, { status: 400 })
    }
    input.lockerCode = lockerCode
  }

  if (phoneNumber !== undefined) {
    if (typeof phoneNumber !== 'string') {
      return NextResponse.json({ error: 'phoneNumber must be a string' }, { status: 400 })
    }
    input.phoneNumber = phoneNumber
  }

  if (notes !== undefined) {
    if (typeof notes !== 'string') {
      return NextResponse.json({ error: 'notes must be a string' }, { status: 400 })
    }
    input.notes = notes
  }

  if (Object.keys(input).length === 0) {
    return NextResponse.json(
      { error: 'No updatable fields provided. Allowed: deliveryType, address, lockerCode, phoneNumber, notes' },
      { status: 400 }
    )
  }

  const { id } = await params
  const result = updateParcel(id, input)

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.code })
  }

  return NextResponse.json(result.parcel)
}

// DELETE /api/parcels/:id — delete one parcel (auth required)
export async function DELETE(req: NextRequest, { params }: Params) {
  if (!isAuthorized(req.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const deleted = deleteParcel(id)
  if (!deleted) {
    return NextResponse.json({ error: 'Parcel not found' }, { status: 404 })
  }
  return new NextResponse(null, { status: 204 })
}
