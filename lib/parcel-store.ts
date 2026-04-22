export type ParcelSize = 'A' | 'B' | 'C'
export type DeliveryType = 'LOCKER' | 'HOME'
export type ParcelStatus = 'CREATED' | 'IN_TRANSIT' | 'IN_LOCKER' | 'DELIVERED' | 'FAILED'

export interface Address {
  street: string
  city: string
  postcode: string
  country: string
}

export interface Parcel {
  id: string
  trackingNumber: string
  status: ParcelStatus
  recipientName: string
  recipientEmail: string
  size: ParcelSize
  deliveryType: DeliveryType
  address?: Address      // required when deliveryType === 'HOME'
  lockerCode?: string    // required when deliveryType === 'LOCKER'
  phoneNumber?: string   // optional — for delivery notifications
  notes?: string         // optional — special delivery instructions
  createdAt: string
  updatedAt: string
}

export const SIZE_DIMENSIONS: Record<ParcelSize, string> = {
  A: 'up to 8×38×64 cm',
  B: 'up to 19×38×64 cm',
  C: 'up to 41×38×64 cm',
}

const TERMINAL_STATES: ParcelStatus[] = ['DELIVERED', 'FAILED']

const VALID_TRANSITIONS: Record<ParcelStatus, ParcelStatus[]> = {
  CREATED: ['IN_TRANSIT'],
  IN_TRANSIT: ['IN_LOCKER', 'DELIVERED', 'FAILED'],
  IN_LOCKER: ['DELIVERED'],
  DELIVERED: [],
  FAILED: [],
}

// Persist across Next.js hot reloads in development (module-level state resets on each reload)
const g = globalThis as Record<string, unknown>
if (!g.__parcelStore) g.__parcelStore = new Map<string, Parcel>()
if (!g.__parcelCounter) g.__parcelCounter = 1000

const store = g.__parcelStore as Map<string, Parcel>

function getCounter(): number { return g.__parcelCounter as number }
function incCounter(): void { g.__parcelCounter = (g.__parcelCounter as number) + 1 }

function generateTrackingNumber(): string {
  const n = String(getCounter()).padStart(9, '0')
  incCounter()
  return `PL${n}PL`
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase()
}

// ─── Create ───────────────────────────────────────────────────────────────────

export interface CreateParcelInput {
  recipientName: string
  recipientEmail: string
  size: ParcelSize
  deliveryType: DeliveryType
  address?: Address
  lockerCode?: string
  phoneNumber?: string
  notes?: string
}

export function createParcel(data: CreateParcelInput): Parcel {
  const now = new Date().toISOString()
  const parcel: Parcel = {
    id: generateId(),
    trackingNumber: generateTrackingNumber(),
    status: 'CREATED',
    recipientName: data.recipientName,
    recipientEmail: data.recipientEmail,
    size: data.size,
    deliveryType: data.deliveryType,
    ...(data.address && { address: data.address }),
    ...(data.lockerCode && { lockerCode: data.lockerCode }),
    ...(data.phoneNumber && { phoneNumber: data.phoneNumber }),
    ...(data.notes && { notes: data.notes }),
    createdAt: now,
    updatedAt: now,
  }
  store.set(parcel.id, parcel)
  return parcel
}

// ─── Read ─────────────────────────────────────────────────────────────────────

export function getAllParcels(): Parcel[] {
  return Array.from(store.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getParcel(id: string): Parcel | undefined {
  return store.get(id)
}

// ─── Update fields ────────────────────────────────────────────────────────────

export interface UpdateParcelInput {
  deliveryType?: DeliveryType
  address?: Address
  lockerCode?: string
  phoneNumber?: string
  notes?: string
}

export function updateParcel(
  id: string,
  data: UpdateParcelInput
): { parcel?: Parcel; error?: string; code?: number } {
  const parcel = store.get(id)
  if (!parcel) return { error: 'Parcel not found', code: 404 }

  if (TERMINAL_STATES.includes(parcel.status)) {
    return { error: 'Cannot update a parcel in a final state', code: 409 }
  }

  const updated: Parcel = { ...parcel, updatedAt: new Date().toISOString() }

  if (data.deliveryType !== undefined) updated.deliveryType = data.deliveryType
  if (data.address !== undefined) updated.address = data.address
  if (data.lockerCode !== undefined) updated.lockerCode = data.lockerCode
  if (data.phoneNumber !== undefined) updated.phoneNumber = data.phoneNumber
  if (data.notes !== undefined) updated.notes = data.notes

  // Re-validate: HOME parcels must have address
  if (updated.deliveryType === 'HOME' && !updated.address) {
    return { error: 'address is required when deliveryType is HOME', code: 400 }
  }
  // Re-validate: LOCKER parcels must have lockerCode
  if (updated.deliveryType === 'LOCKER' && !updated.lockerCode) {
    return { error: 'lockerCode is required when deliveryType is LOCKER', code: 400 }
  }

  store.set(id, updated)
  return { parcel: updated }
}

// ─── Update status ────────────────────────────────────────────────────────────

export function updateParcelStatus(
  id: string,
  newStatus: ParcelStatus
): { parcel?: Parcel; error?: string; code?: number } {
  const parcel = store.get(id)
  if (!parcel) return { error: 'Parcel not found', code: 404 }

  if (TERMINAL_STATES.includes(parcel.status)) {
    return { error: 'Parcel already in final state', code: 409 }
  }

  const allowed = VALID_TRANSITIONS[parcel.status]
  if (!allowed.includes(newStatus)) {
    return { error: 'Invalid status transition', code: 400 }
  }

  const updated: Parcel = {
    ...parcel,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  }
  store.set(id, updated)
  return { parcel: updated }
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export function deleteParcel(id: string): boolean {
  return store.delete(id)
}

export function resetAll(): void {
  store.clear()
  g.__parcelCounter = 1000
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const SANDBOX_TOKEN = 'test-token-inpost-2026'

export function isAuthorized(authHeader: string | null): boolean {
  return authHeader === `Bearer ${SANDBOX_TOKEN}`
}
