import { NextRequest, NextResponse } from 'next/server'
import {
  createParcel,
  getAllParcels,
  isAuthorized,
  resetAll,
  type Address,
  type CreateParcelInput,
  type DeliveryType,
  type ParcelSize,
} from '@/lib/parcel-store'

const VALID_SIZES: ParcelSize[] = ['A', 'B', 'C']
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

// GET /api/parcels — list all parcels (no auth)
export async function GET() {
  const parcels = getAllParcels()
  return NextResponse.json({ parcels, count: parcels.length })
}

// POST /api/parcels — create parcel (auth required)
export async function POST(req: NextRequest) {
  if (!isAuthorized(req.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { recipientName, recipientEmail, size, deliveryType, address, lockerCode, phoneNumber, notes } = body

  if (!recipientName || typeof recipientName !== 'string') {
    return NextResponse.json({ error: 'recipientName is required' }, { status: 400 })
  }
  if (!recipientEmail || typeof recipientEmail !== 'string') {
    return NextResponse.json({ error: 'recipientEmail is required' }, { status: 400 })
  }
  const atIdx = (recipientEmail as string).indexOf('@')
  if (atIdx < 1 || atIdx === (recipientEmail as string).length - 1) {
    return NextResponse.json({ error: 'recipientEmail must be a valid email address' }, { status: 400 })
  }
  if (!size || !VALID_SIZES.includes(size as ParcelSize)) {
    return NextResponse.json({ error: `size must be one of: ${VALID_SIZES.join(', ')}` }, { status: 400 })
  }
  if (!deliveryType || !VALID_DELIVERY_TYPES.includes(deliveryType as DeliveryType)) {
    return NextResponse.json({ error: `deliveryType must be one of: ${VALID_DELIVERY_TYPES.join(', ')}` }, { status: 400 })
  }

  const input: CreateParcelInput = {
    recipientName,
    recipientEmail,
    size: size as ParcelSize,
    deliveryType: deliveryType as DeliveryType,
  }

  if (deliveryType === 'HOME') {
    if (!address) {
      return NextResponse.json({ error: 'address is required when deliveryType is HOME' }, { status: 400 })
    }
    const { address: parsedAddress, error } = validateAddress(address)
    if (error) return NextResponse.json({ error }, { status: 400 })
    input.address = parsedAddress
  }

  if (deliveryType === 'LOCKER') {
    if (!lockerCode || typeof lockerCode !== 'string') {
      return NextResponse.json({ error: 'lockerCode is required when deliveryType is LOCKER' }, { status: 400 })
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

  const parcel = createParcel(input)
  return NextResponse.json(parcel, { status: 201 })
}

// DELETE /api/parcels — reset all (no auth required)
export async function DELETE() {
  resetAll()
  return NextResponse.json({ message: 'All parcels deleted' })
}
