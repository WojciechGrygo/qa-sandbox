import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized, updateParcelStatus, type ParcelStatus } from '@/lib/parcel-store'

type Params = { params: Promise<{ id: string }> }

const VALID_STATUSES: ParcelStatus[] = ['CREATED', 'IN_TRANSIT', 'IN_LOCKER', 'DELIVERED', 'FAILED']

// PATCH /api/parcels/:id/status — update parcel status (auth required)
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

  const { status } = body

  if (!status || !VALID_STATUSES.includes(status as ParcelStatus)) {
    return NextResponse.json(
      { error: `status must be one of: ${VALID_STATUSES.join(', ')}` },
      { status: 400 }
    )
  }

  const { id } = await params
  const result = updateParcelStatus(id, status as ParcelStatus)

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.code })
  }

  return NextResponse.json(result.parcel)
}
