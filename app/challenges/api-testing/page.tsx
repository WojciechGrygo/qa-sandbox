'use client'

import { useState, useCallback } from 'react'
import {
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type ParcelSize = 'A' | 'B' | 'C'
type DeliveryType = 'LOCKER' | 'HOME'
type ParcelStatus =
  | 'CREATED'
  | 'IN_TRANSIT'
  | 'IN_LOCKER'
  | 'DELIVERED'
  | 'FAILED'

interface Address {
  street: string
  city: string
  postcode: string
  country: string
}

interface Parcel {
  id: string
  trackingNumber: string
  status: ParcelStatus
  recipientName: string
  recipientEmail: string
  size: ParcelSize
  deliveryType: DeliveryType
  address?: Address
  lockerCode?: string
  phoneNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

const STATUS_COLOURS: Record<ParcelStatus, string> = {
  CREATED: 'bg-gray-100 text-gray-700',
  IN_TRANSIT: 'bg-blue-100 text-blue-700',
  IN_LOCKER: 'bg-amber-100 text-amber-700',
  DELIVERED: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
}

const SIZE_LABELS: Record<ParcelSize, string> = {
  A: 'A — up to 8×38×64 cm',
  B: 'B — up to 19×38×64 cm',
  C: 'C — up to 41×38×64 cm',
}

const SANDBOX_TOKEN = 'test-token-inpost-2026'

// ─── Shared UI ────────────────────────────────────────────────────────────────

function MethodBadge({ method }: { method: string }) {
  const colours: Record<string, string> = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PATCH: 'bg-amber-100 text-amber-800',
    DELETE: 'bg-red-100 text-red-800',
  }
  return (
    <span
      className={`rounded px-2 py-0.5 font-mono text-xs font-bold ${colours[method] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {method}
    </span>
  )
}

function StatusBadge({ code }: { code: number }) {
  const colour =
    code < 300
      ? 'bg-green-100 text-green-700'
      : code < 500
        ? 'bg-amber-100 text-amber-700'
        : 'bg-red-100 text-red-700'
  return (
    <span
      className={`rounded px-1.5 py-0.5 font-mono text-xs font-semibold ${colour}`}
    >
      {code}
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      onClick={copy}
      className="text-gray-400 transition-colors hover:text-gray-600"
      title="Copy"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="relative mt-2 overflow-auto rounded bg-[#1d1d1d] p-3">
      <div className="absolute right-2 top-2">
        <CopyButton text={children} />
      </div>
      <pre className="whitespace-pre pr-6 font-mono text-xs leading-relaxed text-[#00D46B]">
        {children}
      </pre>
    </div>
  )
}

function EndpointCard({
  method,
  path,
  auth,
  description,
  requestBody,
  responses,
  open,
  onToggle,
}: {
  method: string
  path: string
  auth: boolean
  description: string
  requestBody?: string
  responses: { code: number; description: string; example?: string }[]
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0 text-gray-400" />
        )}
        <MethodBadge method={method} />
        <code className="flex-1 font-mono text-sm text-[#1d1d1d]">
          /api/parcels{path}
        </code>
        {auth && (
          <span className="shrink-0 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
            Auth required
          </span>
        )}
      </button>
      {open && (
        <div className="space-y-4 border-t border-gray-100 px-4 py-4">
          <p
            className="whitespace-pre-line text-sm text-[#4b4b4b]"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            {description}
          </p>
          {requestBody && (
            <div>
              <p
                className="mb-1 text-xs font-semibold uppercase tracking-wider text-[#4b4b4b]"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                Request body
              </p>
              <CodeBlock>{requestBody}</CodeBlock>
            </div>
          )}
          <div>
            <p
              className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#4b4b4b]"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              Responses
            </p>
            <div className="space-y-2">
              {responses.map(r => (
                <div key={r.code}>
                  <div className="flex items-center gap-2">
                    <StatusBadge code={r.code} />
                    <span
                      className="text-xs text-[#4b4b4b]"
                      style={{ fontFamily: "'Archivo', sans-serif" }}
                    >
                      {r.description}
                    </span>
                  </div>
                  {r.example && <CodeBlock>{r.example}</CodeBlock>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Docs tab ─────────────────────────────────────────────────────────────────

const ENDPOINTS: {
  method: string
  path: string
  auth: boolean
  description: string
  requestBody?: string
  responses: { code: number; description: string; example?: string }[]
}[] = [
  {
    method: 'GET',
    path: '',
    auth: false,
    description: 'Returns all parcels in the sandbox, sorted newest first.',
    responses: [
      {
        code: 200,
        description: 'List of parcels with count',
        example: `{
  "parcels": [ { "id": "AB12CD34", "trackingNumber": "PL000001000PL", ... } ],
  "count": 1
}`,
      },
    ],
  },
  {
    method: 'POST',
    path: '',
    auth: true,
    description: `Creates a new parcel with status CREATED. Returns a unique tracking number.

Conditional validation:
  · deliveryType HOME  → address object is required
  · deliveryType LOCKER → lockerCode is required`,
    requestBody: `{
  "recipientName": "Jane Smith",         // required
  "recipientEmail": "jane@example.com",  // required
  "size": "B",                           // required — A | B | C
  "deliveryType": "HOME",                // required — HOME | LOCKER
  "address": {                           // required when deliveryType = HOME
    "street": "123 High Street",
    "city": "London",
    "postcode": "EC1A 1BB",
    "country": "GB"
  },
  "lockerCode": "KRK-001",              // required when deliveryType = LOCKER
  "phoneNumber": "+44 7911 123456",      // optional
  "notes": "Leave with neighbour"        // optional
}`,
    responses: [
      {
        code: 201,
        description: 'Parcel created',
        example: `{
  "id": "AB12CD34",
  "trackingNumber": "PL000001000PL",
  "status": "CREATED",
  "recipientName": "Jane Smith",
  "recipientEmail": "jane@example.com",
  "size": "B",
  "deliveryType": "HOME",
  "address": { "street": "123 High Street", "city": "London", "postcode": "EC1A 1BB", "country": "GB" },
  "phoneNumber": "+44 7911 123456",
  "notes": "Leave with neighbour",
  "createdAt": "2026-04-22T10:00:00.000Z",
  "updatedAt": "2026-04-22T10:00:00.000Z"
}`,
      },
      {
        code: 400,
        description: 'Missing or invalid field',
        example: '{ "error": "address is required when deliveryType is HOME" }',
      },
      {
        code: 401,
        description: 'Unauthorized',
        example: '{ "error": "Unauthorized" }',
      },
    ],
  },
  {
    method: 'GET',
    path: '/:id',
    auth: false,
    description: 'Returns a single parcel by its id.',
    responses: [
      {
        code: 200,
        description: 'Parcel found',
        example: '{ "id": "AB12CD34", "trackingNumber": "PL000001000PL", ... }',
      },
      {
        code: 404,
        description: 'Not found',
        example: '{ "error": "Parcel not found" }',
      },
    ],
  },
  {
    method: 'PATCH',
    path: '/:id',
    auth: true,
    description: `Partially updates parcel fields. At least one field must be provided.

Updatable fields: deliveryType, address, lockerCode, phoneNumber, notes
Not updatable here: status (use /status endpoint), id, trackingNumber, size, recipientName, recipientEmail

Changing deliveryType re-validates the conditional rules:
  · Switching to HOME without providing address → 400
  · Switching to LOCKER without providing lockerCode → 400

Cannot update a parcel in a terminal state (DELIVERED or FAILED) → 409`,
    requestBody: `{
  "deliveryType": "LOCKER",             // optional
  "lockerCode": "KRK-002",             // optional
  "address": { ... },                   // optional
  "phoneNumber": "+44 7911 999999",     // optional
  "notes": "Ring the bell"              // optional
}`,
    responses: [
      {
        code: 200,
        description: 'Updated parcel',
        example:
          '{ "id": "AB12CD34", "deliveryType": "LOCKER", "lockerCode": "KRK-002", ... }',
      },
      {
        code: 400,
        description: 'Validation error or no fields provided',
        example:
          '{ "error": "lockerCode is required when deliveryType is LOCKER" }',
      },
      {
        code: 401,
        description: 'Unauthorized',
        example: '{ "error": "Unauthorized" }',
      },
      {
        code: 404,
        description: 'Not found',
        example: '{ "error": "Parcel not found" }',
      },
      {
        code: 409,
        description: 'Parcel in terminal state',
        example: '{ "error": "Cannot update a parcel in a final state" }',
      },
    ],
  },
  {
    method: 'PATCH',
    path: '/:id/status',
    auth: true,
    description: `Updates parcel status. Only valid transitions are allowed.

Valid transitions:
  CREATED     → IN_TRANSIT
  IN_TRANSIT  → IN_LOCKER | DELIVERED | FAILED
  IN_LOCKER   → DELIVERED
  DELIVERED / FAILED → terminal, no further updates`,
    requestBody: `{
  "status": "IN_TRANSIT"   // required — CREATED | IN_TRANSIT | IN_LOCKER | DELIVERED | FAILED
}`,
    responses: [
      {
        code: 200,
        description: 'Status updated',
        example:
          '{ "id": "AB12CD34", "status": "IN_TRANSIT", "updatedAt": "...", ... }',
      },
      {
        code: 400,
        description: 'Invalid status value or invalid transition',
        example: '{ "error": "Invalid status transition" }',
      },
      {
        code: 401,
        description: 'Unauthorized',
        example: '{ "error": "Unauthorized" }',
      },
      {
        code: 404,
        description: 'Not found',
        example: '{ "error": "Parcel not found" }',
      },
      {
        code: 409,
        description: 'Parcel already in final state',
        example: '{ "error": "Parcel already in final state" }',
      },
    ],
  },
  {
    method: 'DELETE',
    path: '/:id',
    auth: true,
    description: 'Deletes a single parcel. Returns 204 No Content.',
    responses: [
      { code: 204, description: 'Deleted — no response body' },
      {
        code: 401,
        description: 'Unauthorized',
        example: '{ "error": "Unauthorized" }',
      },
      {
        code: 404,
        description: 'Not found',
        example: '{ "error": "Parcel not found" }',
      },
    ],
  },
  {
    method: 'DELETE',
    path: '',
    auth: false,
    description:
      'Resets the sandbox — deletes all parcels. No auth required. Use in beforeEach / afterAll for cleanup.',
    responses: [
      {
        code: 200,
        description: 'All deleted',
        example: '{ "message": "All parcels deleted" }',
      },
    ],
  },
]

function DocsTab() {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div style={{ fontFamily: "'Archivo', sans-serif" }}>
          <p className="mb-1 text-sm font-semibold text-amber-800">
            Sandbox authentication
          </p>
          <p className="text-sm text-amber-700">
            <code className="rounded bg-amber-100 px-1 font-mono">
              Authorization: Bearer test-token-inpost-2026
            </code>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {ENDPOINTS.map((ep, i) => (
          <EndpointCard
            key={i}
            {...ep}
            open={openIdx === i}
            onToggle={() => setOpenIdx(v => (v === i ? null : i))}
          />
        ))}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5">
        <h2
          className="mb-3 text-sm font-bold uppercase tracking-wide text-[#1d1d1d]"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          Things to consider
        </h2>
        <ul
          className="space-y-1.5 text-sm text-[#4b4b4b]"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          <li>
            · Start by reading the documentation — explore each endpoint before
            writing any tests.
          </li>
          <li>
            · How would you approach testing{' '}
            <code className="rounded bg-gray-100 px-1 font-mono text-xs">
              PATCH
            </code>{' '}
            and{' '}
            <code className="rounded bg-gray-100 px-1 font-mono text-xs">
              DELETE /api/parcels/:id
            </code>
            ?
          </li>
          <li>
            · PATCH vs PUT — what is the semantic difference and why does it
            matter for testing?
          </li>
          <li>· Where do you store the Bearer token in a real test project?</li>
        </ul>
      </div>
    </div>
  )
}

// ─── Live UI tab ──────────────────────────────────────────────────────────────

interface RequestLog {
  method: string
  url: string
  statusCode: number
  body: string
}

function LiveUITab() {
  const [token, setToken] = useState(SANDBOX_TOKEN)
  const [parcels, setParcels] = useState<Parcel[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [log, setLog] = useState<RequestLog | null>(null)

  // Create form state
  const [form, setForm] = useState({
    recipientName: '',
    recipientEmail: '',
    size: '' as ParcelSize | '',
    deliveryType: '' as DeliveryType | '',
    street: '',
    city: '',
    postcode: '',
    country: 'GB',
    lockerCode: '',
    phoneNumber: '',
    notes: '',
  })
  const [creating, setCreating] = useState(false)

  // Per-parcel patch state
  const [patchStatus, setPatchStatus] = useState<Record<string, ParcelStatus>>(
    {}
  )
  const [patching, setPatching] = useState<Record<string, boolean>>({})
  const [deleting, setDeleting] = useState<Record<string, boolean>>({})

  const authHeader = useCallback(
    () => ({ Authorization: `Bearer ${token}` }),
    [token]
  )

  const fetchParcels = useCallback(async () => {
    setLoadingList(true)
    const res = await fetch('/api/parcels')
    const json = await res.json()
    setLog({
      method: 'GET',
      url: '/api/parcels',
      statusCode: res.status,
      body: JSON.stringify(json, null, 2),
    })
    setParcels(json.parcels ?? [])
    setLoadingList(false)
  }, [])

  const createParcel = async () => {
    setCreating(true)
    const body: Record<string, unknown> = {
      recipientName: form.recipientName,
      recipientEmail: form.recipientEmail,
      size: form.size,
      deliveryType: form.deliveryType,
    }
    if (form.deliveryType === 'HOME') {
      body.address = {
        street: form.street,
        city: form.city,
        postcode: form.postcode,
        country: form.country,
      }
    }
    if (form.deliveryType === 'LOCKER' && form.lockerCode)
      body.lockerCode = form.lockerCode
    if (form.phoneNumber) body.phoneNumber = form.phoneNumber
    if (form.notes) body.notes = form.notes

    const res = await fetch('/api/parcels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    setLog({
      method: 'POST',
      url: '/api/parcels',
      statusCode: res.status,
      body: JSON.stringify(json, null, 2),
    })
    if (res.ok) {
      setForm({
        recipientName: '',
        recipientEmail: '',
        size: '',
        deliveryType: '',
        street: '',
        city: '',
        postcode: '',
        country: 'GB',
        lockerCode: '',
        phoneNumber: '',
        notes: '',
      })
      await fetchParcels()
    }
    setCreating(false)
  }

  const updateStatus = async (id: string) => {
    const newStatus = patchStatus[id]
    if (!newStatus) return
    setPatching(p => ({ ...p, [id]: true }))
    const res = await fetch(`/api/parcels/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ status: newStatus }),
    })
    const json = await res.json()
    setLog({
      method: 'PATCH',
      url: `/api/parcels/${id}/status`,
      statusCode: res.status,
      body: JSON.stringify(json, null, 2),
    })
    await fetchParcels()
    setPatching(p => ({ ...p, [id]: false }))
  }

  const deleteParcel = async (id: string) => {
    setDeleting(p => ({ ...p, [id]: true }))
    const res = await fetch(`/api/parcels/${id}`, {
      method: 'DELETE',
      headers: authHeader(),
    })
    const body = res.status === 204 ? '(no content)' : await res.text()
    setLog({
      method: 'DELETE',
      url: `/api/parcels/${id}`,
      statusCode: res.status,
      body,
    })
    await fetchParcels()
    setDeleting(p => ({ ...p, [id]: false }))
  }

  const resetAll = async () => {
    const res = await fetch('/api/parcels', { method: 'DELETE' })
    const json = await res.json()
    setLog({
      method: 'DELETE',
      url: '/api/parcels',
      statusCode: res.status,
      body: JSON.stringify(json, null, 2),
    })
    setParcels([])
  }

  const iCls =
    'border border-gray-300 rounded px-3 py-2 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-[#FFCC05] bg-white w-full'
  const fSet =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }))

  const canCreate =
    form.recipientName &&
    form.recipientEmail &&
    form.size &&
    form.deliveryType &&
    (form.deliveryType === 'HOME'
      ? form.street && form.city && form.postcode
      : form.lockerCode)

  return (
    <div className="space-y-5">
      {/* Token */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[#4b4b4b]"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          Bearer token
        </label>
        <div className="flex gap-2">
          <input
            value={token}
            onChange={e => setToken(e.target.value)}
            className={`${iCls} font-mono`}
            placeholder={SANDBOX_TOKEN}
          />
          <button
            onClick={() => setToken(SANDBOX_TOKEN)}
            className="shrink-0 px-2 text-xs text-[#065BD7] hover:underline"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Create form */}
      <div className="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
        <h3
          className="text-sm font-bold uppercase tracking-wide text-[#1d1d1d]"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          Create parcel{' '}
          <span className="text-xs font-normal normal-case tracking-normal text-[#4b4b4b]">
            POST /api/parcels
          </span>
        </h3>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            value={form.recipientName}
            onChange={fSet('recipientName')}
            placeholder="Recipient name *"
            className={iCls}
            style={{ fontFamily: "'Archivo', sans-serif" }}
          />
          <input
            value={form.recipientEmail}
            onChange={fSet('recipientEmail')}
            placeholder="Email *"
            type="email"
            className={iCls}
            style={{ fontFamily: "'Archivo', sans-serif" }}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <select
            value={form.size}
            onChange={fSet('size')}
            className={iCls}
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            <option value="">Size *</option>
            {(['A', 'B', 'C'] as ParcelSize[]).map(s => (
              <option key={s} value={s}>
                {SIZE_LABELS[s]}
              </option>
            ))}
          </select>
          <select
            value={form.deliveryType}
            onChange={fSet('deliveryType')}
            className={iCls}
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            <option value="">Delivery type *</option>
            <option value="HOME">HOME — home delivery</option>
            <option value="LOCKER">LOCKER — parcel locker</option>
          </select>
        </div>

        {form.deliveryType === 'HOME' && (
          <div className="space-y-2 border-l-2 border-[#FFCC05] pl-3">
            <p
              className="text-xs font-semibold uppercase tracking-wide text-[#4b4b4b]"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              Address (required for HOME)
            </p>
            <input
              value={form.street}
              onChange={fSet('street')}
              placeholder="Street *"
              className={iCls}
              style={{ fontFamily: "'Archivo', sans-serif" }}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.city}
                onChange={fSet('city')}
                placeholder="City *"
                className={iCls}
                style={{ fontFamily: "'Archivo', sans-serif" }}
              />
              <input
                value={form.postcode}
                onChange={fSet('postcode')}
                placeholder="Postcode *"
                className={iCls}
                style={{ fontFamily: "'Archivo', sans-serif" }}
              />
            </div>
            <input
              value={form.country}
              onChange={fSet('country')}
              placeholder="Country *"
              className={iCls}
              style={{ fontFamily: "'Archivo', sans-serif" }}
            />
          </div>
        )}

        {form.deliveryType === 'LOCKER' && (
          <div className="border-l-2 border-[#FFCC05] pl-3">
            <input
              value={form.lockerCode}
              onChange={fSet('lockerCode')}
              placeholder="Locker code * (e.g. KRK-001)"
              className={iCls}
              style={{ fontFamily: "'Archivo', sans-serif" }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <input
            value={form.phoneNumber}
            onChange={fSet('phoneNumber')}
            placeholder="Phone number (optional)"
            className={iCls}
            style={{ fontFamily: "'Archivo', sans-serif" }}
          />
          <input
            value={form.notes}
            onChange={fSet('notes')}
            placeholder="Notes (optional)"
            className={iCls}
            style={{ fontFamily: "'Archivo', sans-serif" }}
          />
        </div>

        <button
          onClick={createParcel}
          disabled={creating || !canCreate}
          className="rounded bg-[#FFCC05] px-4 py-2 text-sm font-bold text-[#1d1d1d] transition-colors hover:bg-[#e6b800] disabled:opacity-50"
          style={{ fontFamily: "'Archivo', sans-serif" }}
        >
          {creating ? 'Creating…' : 'Create parcel'}
        </button>
      </div>

      {/* Parcel list */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h3
            className="text-sm font-bold uppercase tracking-wide text-[#1d1d1d]"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            Parcels ({parcels.length})
          </h3>
          <div className="flex gap-2">
            <button
              onClick={fetchParcels}
              disabled={loadingList}
              className="flex items-center gap-1.5 rounded bg-[#FFCC05] px-3 py-1.5 text-sm font-semibold text-[#1d1d1d] transition-colors hover:bg-[#e6b800]"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${loadingList ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
            {parcels.length > 0 && (
              <button
                onClick={resetAll}
                className="px-2 text-sm font-semibold text-red-600 hover:underline"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                Reset all
              </button>
            )}
          </div>
        </div>

        {parcels.length === 0 ? (
          <div
            className="px-4 py-8 text-center text-sm text-[#4b4b4b]"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            No parcels yet. Create one above or click Refresh.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {parcels.map(p => (
              <div key={p.id} className="space-y-2 px-4 py-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="font-mono text-xs text-[#1d1d1d]">
                        {p.trackingNumber}
                      </code>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_COLOURS[p.status]}`}
                        style={{ fontFamily: "'Archivo', sans-serif" }}
                      >
                        {p.status}
                      </span>
                      <span className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-[#4b4b4b]">
                        {p.size}
                      </span>
                      <span
                        className="text-xs text-[#4b4b4b]"
                        style={{ fontFamily: "'Archivo', sans-serif" }}
                      >
                        {p.deliveryType}
                      </span>
                    </div>
                    <p
                      className="text-xs text-[#4b4b4b]"
                      style={{ fontFamily: "'Archivo', sans-serif" }}
                    >
                      {p.recipientName} · {p.recipientEmail}
                    </p>
                    {p.deliveryType === 'HOME' && p.address && (
                      <p
                        className="text-xs text-[#8e8e8e]"
                        style={{ fontFamily: "'Archivo', sans-serif" }}
                      >
                        {p.address.street}, {p.address.city}{' '}
                        {p.address.postcode}
                      </p>
                    )}
                    {p.deliveryType === 'LOCKER' && p.lockerCode && (
                      <p
                        className="text-xs text-[#8e8e8e]"
                        style={{ fontFamily: "'Archivo', sans-serif" }}
                      >
                        Locker: {p.lockerCode}
                      </p>
                    )}
                    {(p.phoneNumber || p.notes) && (
                      <p
                        className="text-xs text-[#8e8e8e]"
                        style={{ fontFamily: "'Archivo', sans-serif" }}
                      >
                        {[p.phoneNumber, p.notes].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="font-mono text-xs text-[#8e8e8e]">
                      id: {p.id}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <select
                      value={patchStatus[p.id] ?? ''}
                      onChange={e =>
                        setPatchStatus(s => ({
                          ...s,
                          [p.id]: e.target.value as ParcelStatus,
                        }))
                      }
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-[#1d1d1d] focus:outline-none focus:ring-1 focus:ring-[#FFCC05]"
                      style={{ fontFamily: "'Archivo', sans-serif" }}
                    >
                      <option value="">Set status…</option>
                      {(
                        [
                          'CREATED',
                          'IN_TRANSIT',
                          'IN_LOCKER',
                          'DELIVERED',
                          'FAILED',
                        ] as ParcelStatus[]
                      ).map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => updateStatus(p.id)}
                      disabled={!patchStatus[p.id] || patching[p.id]}
                      className="rounded bg-[#FFCC05] px-2.5 py-1 text-xs font-semibold text-[#1d1d1d] transition-colors hover:bg-[#e6b800] disabled:opacity-40"
                      style={{ fontFamily: "'Archivo', sans-serif" }}
                    >
                      {patching[p.id] ? '…' : 'Update'}
                    </button>
                    <button
                      onClick={() => deleteParcel(p.id)}
                      disabled={deleting[p.id]}
                      className="text-xs font-semibold text-red-600 hover:underline"
                      style={{ fontFamily: "'Archivo', sans-serif" }}
                    >
                      {deleting[p.id] ? '…' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request log */}
      {log && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex flex-wrap items-center gap-3 border-b border-gray-100 px-4 py-2.5">
            <span
              className="text-xs font-semibold uppercase tracking-wider text-[#4b4b4b]"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              Last request
            </span>
            <MethodBadge method={log.method} />
            <code className="font-mono text-xs text-[#1d1d1d]">{log.url}</code>
            <StatusBadge code={log.statusCode} />
          </div>
          <div className="max-h-56 overflow-auto bg-[#1d1d1d] p-4">
            <pre className="whitespace-pre font-mono text-xs leading-relaxed text-[#00D46B]">
              {log.body}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApiTestingPage() {
  const [tab, setTab] = useState<'docs' | 'ui'>('docs')

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      <section className="bg-[#FFCC05] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1d1d1d]/60"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            QA Challenge · API Testing
          </p>
          <h1
            className="mb-3 text-4xl font-black uppercase text-[#1d1d1d]"
            style={{ fontFamily: "'Saira', sans-serif" }}
          >
            Parcel API
          </h1>
          <p
            className="max-w-xl text-base text-[#1d1d1d]/80"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            A sandbox REST API for parcel management. Write tests covering auth,
            conditional validation, status transitions, and test data
            setup/cleanup.
          </p>
        </div>
      </section>

      <section className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex w-fit gap-1 rounded-lg border border-gray-200 bg-white p-1">
            {(['docs', 'ui'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded px-4 py-2 text-sm font-semibold transition-colors ${tab === t ? 'bg-[#FFCC05] text-[#1d1d1d]' : 'text-[#4b4b4b] hover:text-[#1d1d1d]'}`}
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                {t === 'docs' ? 'Documentation' : 'Live UI'}
              </button>
            ))}
          </div>

          {tab === 'docs' ? <DocsTab /> : <LiveUITab />}

          <div className="h-12" />
        </div>
      </section>
    </div>
  )
}
