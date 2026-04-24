'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Package,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react'

type Status = 'idle' | 'loading' | 'success' | 'error'
type SystemStatus = 'initializing' | 'ready'

interface TrackingResult {
  parcelNumber: string
  status: string
  estimatedDelivery: string
  location: string
}

export default function AsyncChallengePage() {
  const [parcelNumber, setParcelNumber] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<TrackingResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [systemStatus, setSystemStatus] = useState<SystemStatus>('initializing')
  const systemReadyRef = useRef(false)
  const submitCountRef = useRef(0)

  useEffect(() => {
    const uiTimer = setTimeout(() => setSystemStatus('ready'), 3000)

    fetch('/api/parcel-ready')
      .then(() => {
        systemReadyRef.current = true
      })
      .catch(() => {
        systemReadyRef.current = true
      }) // fail open

    return () => clearTimeout(uiTimer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!systemReadyRef.current) {
      setStatus('error')
      setErrorMessage(
        'Tracking system is still initialising. Please wait a moment and try again.'
      )
      return
    }

    submitCountRef.current += 1
    const currentSubmit = submitCountRef.current

    setStatus('loading')
    setResult(null)
    setErrorMessage('')

    try {
      const res = await fetch('/api/parcel-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parcelNumber }),
      })

      if (currentSubmit !== submitCountRef.current) return

      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMessage(data.error || 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
      setResult(data)
    } catch {
      if (currentSubmit !== submitCountRef.current) return
      setStatus('error')
      setErrorMessage('Network error. Please check your connection.')
    }
  }

  const statusLabels: Record<string, string> = {
    IN_TRANSIT: 'In Transit',
    DELIVERED: 'Delivered',
    OUT_FOR_DELIVERY: 'Out for Delivery',
    READY_FOR_COLLECTION: 'Ready for Collection',
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* Hero */}
      <section className="bg-[#FFCC05] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1d1d1d]/60"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            QA Challenge · Async Wait
          </p>
          <h1
            className="mb-3 text-4xl font-black uppercase text-[#1d1d1d]"
            style={{ fontFamily: "'Saira', sans-serif" }}
          >
            Track Your Parcel
          </h1>
          <p
            className="max-w-xl text-base text-[#1d1d1d]/80"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            Enter a parcel number below and click Track Parcel. Write a stable test that handles the system&apos;s initialisation time correctly.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          {/* System status indicator */}
          <div
            data-testid="system-status"
            data-status={systemStatus}
            className={`mb-5 flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
              systemStatus === 'initializing'
                ? 'border-amber-200 bg-amber-50 text-amber-800'
                : 'border-green-200 bg-green-50 text-green-800'
            }`}
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            {systemStatus === 'initializing' ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                <span>Tracking system initialising&hellip;</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span data-testid="system-ready">System ready</span>
              </>
            )}
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="parcel-number"
                  className="mb-1.5 block text-sm font-semibold text-[#1d1d1d]"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                >
                  Parcel number
                </label>
                <input
                  id="parcel-number"
                  type="text"
                  value={parcelNumber}
                  onChange={e => setParcelNumber(e.target.value)}
                  placeholder="e.g. UK123456789GB"
                  className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-[#1d1d1d] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFCC05]"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded bg-[#FFCC05] px-6 py-3 font-bold text-[#1d1d1d] transition-colors hover:bg-[#e6b800]"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                {status === 'loading' ? (
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#1d1d1d] border-t-transparent" />
                ) : (
                  <>
                    <Package className="h-4 w-4" />
                    Track parcel
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Error state */}
            {status === 'error' && (
              <div className="mt-5 flex items-start gap-3 rounded border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                <p
                  className="text-sm text-red-700"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                >
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Success state */}
            {status === 'success' && result && (
              <div
                data-testid="tracking-result"
                className="mt-5 overflow-hidden rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2 bg-[#FFCC05] px-5 py-3">
                  <CheckCircle2 className="h-5 w-5 text-[#1d1d1d]" />
                  <span
                    className="text-sm font-bold uppercase tracking-wide text-[#1d1d1d]"
                    style={{ fontFamily: "'Archivo', sans-serif" }}
                  >
                    Parcel found
                  </span>
                </div>
                <div className="space-y-3 bg-white px-5 py-4">
                  <Row label="Parcel number" value={result.parcelNumber} />
                  <Row
                    label="Status"
                    value={statusLabels[result.status] ?? result.status}
                  />
                  <Row label="Location" value={result.location} />
                  <Row label="Est. delivery" value={result.estimatedDelivery} />
                </div>
              </div>
            )}
          </div>

          {/* Interview questions box */}
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5">
            <h2
              className="mb-2 text-sm font-bold uppercase tracking-wide text-[#1d1d1d]"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              Things to consider
            </h2>
            <ul
              className="space-y-1.5 text-sm text-[#4b4b4b]"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              <li>
                · How would you write a test for this flow that is stable and
                not flaky?
              </li>
              <li>· What is your general strategy for avoiding flaky tests?</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm last:border-0 last:pb-0">
      <span
        className="text-[#4b4b4b]"
        style={{ fontFamily: "'Archivo', sans-serif" }}
      >
        {label}
      </span>
      <span
        className="font-semibold text-[#1d1d1d]"
        style={{ fontFamily: "'Archivo', sans-serif" }}
      >
        {value}
      </span>
    </div>
  )
}
