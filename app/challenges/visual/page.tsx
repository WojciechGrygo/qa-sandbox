'use client'

import { useEffect, useState } from 'react'
import { Star, ExternalLink, Pencil } from 'lucide-react'

type AvailabilityLevel = 'NORMAL' | 'LOW' | 'VERY_LOW' | 'FULL'

interface LockerData {
  name: string
  locationName: string
  description: string
  address: { line1: string; line2: string }
  openingHours: string
  status: string
  image_url: string
  locker_availability: {
    status: string
    details: {
      S: AvailabilityLevel
      M: AvailabilityLevel
      L: AvailabilityLevel
    }
  }
  trustpilot_reviews: number
  trustpilot_score: number
}

// Figma: inactive bars are #E1E1E1, active green #00D46B, red #EC270A
function getBarColors(level: AvailabilityLevel): string[] {
  const G = '#00D46B',
    R = '#EC270A',
    E = '#E1E1E1'
  switch (level) {
    case 'NORMAL':
      return [G, G, G, G]
    case 'LOW':
      return [G, G, E, E]
    case 'VERY_LOW':
      return [R, E, E, E]
    case 'FULL':
      return [] // no bars — cross + white bg
  }
}

function CompartmentAvailability({
  size,
  level,
}: {
  size: 'S' | 'M' | 'L'
  level: AvailabilityLevel
}) {
  const isFull = level === 'FULL'
  const showCheck = level === 'NORMAL' || level === 'LOW'
  const barColors = getBarColors(level)

  const labelText = isFull ? 'Full' : 'Few left'
  const labelColor = isFull ? '#8E8E8E' : '#1D1D1D'
  const letterColor = isFull ? '#8E8E8E' : '#1D1D1D'

  return (
    <div
      className="flex min-w-0 flex-1 flex-col items-center"
      style={{ gap: isFull ? 3 : 2 }}
    >
      {/* 42 px locker-sizes box */}
      <div
        className="relative flex w-full shrink-0 flex-col items-center justify-center overflow-hidden"
        style={{ height: 42, backgroundColor: isFull ? '#FEFEFE' : undefined }}
      >
        {/* FULL: diagonal cross at opacity-50 (Figma exact) */}
        {isFull && (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{ opacity: 0.5 }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 64 42" className="absolute inset-0 h-full w-full">
              <line
                x1="3"
                y1="2"
                x2="61"
                y2="40"
                stroke="#1D1D1D"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <line
                x1="61"
                y1="2"
                x2="3"
                y2="40"
                stroke="#1D1D1D"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
        {/* Letter — white bg wrapper keeps cross behind text for FULL */}
        <div
          className="relative z-10 flex items-center justify-center"
          style={{
            padding: 2,
            backgroundColor: isFull ? '#FEFEFE' : undefined,
          }}
        >
          <span
            style={{
              fontFamily: "'Saira', sans-serif",
              fontWeight: 700,
              fontSize: 24,
              lineHeight: '32px',
              letterSpacing: '-1.44px',
              color: letterColor,
              textTransform: 'uppercase',
              fontVariationSettings: "'wdth' 125",
            }}
          >
            {size}
          </span>
        </div>
        {/* Status bars — absolute bottom, h-6px, gap-4px (Figma exact) */}
        {!isFull && (
          <div
            className="absolute bottom-0 left-0 right-0 isolate flex overflow-hidden"
            style={{ height: 6, gap: 4 }}
          >
            {barColors.map((color, i) => (
              <div
                key={i}
                className="min-w-px flex-1"
                style={{ backgroundColor: color, zIndex: 4 - i }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Status indicator below */}
      {showCheck ? (
        <div style={{ width: 18, height: 18, flexShrink: 0 }}>
          <svg
            viewBox="0 0 18 18"
            fill="none"
            width="18"
            height="18"
            aria-hidden="true"
          >
            <path
              d="M2.75 9.45L6.3 13.05L15.3 5.4"
              stroke="#00D46B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      ) : (
        <p
          style={{
            fontFamily: "'Archivo', sans-serif",
            fontWeight: 600,
            fontSize: 12,
            lineHeight: '16px',
            height: 17,
            color: labelColor,
            textAlign: 'center',
            width: '100%',
            flexShrink: 0,
            fontVariationSettings: "'wdth' 100",
          }}
        >
          {labelText}
        </p>
      )}
    </div>
  )
}

export default function VisualChallengePage() {
  const [locker, setLocker] = useState<LockerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/locker')
      .then(r => r.json())
      .then(data => {
        setLocker(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* Hero */}
      <section className="bg-[#FFCC05] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1d1d1d]/60"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            QA Challenge · Visual Testing
          </p>
          <h1
            className="mb-3 text-4xl font-black uppercase text-[#1d1d1d]"
            style={{ fontFamily: "'Saira', sans-serif" }}
          >
            Locker Details
          </h1>
          <p
            className="max-w-xl text-base text-[#1d1d1d]/80"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            This page contains dynamic data that changes on every load. Write a
            visual test — without it failing every time.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-6">
          {loading && (
            <div className="flex items-center justify-center bg-[#FEFEFE] p-8">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#FFCC05] border-t-transparent" />
            </div>
          )}

          {locker && (
            <>
              {/* ── Locker card — Figma: Top Info (Desktop), node 11620:21163 ── */}
              <div
                data-testid="locker-card"
                className="flex flex-wrap items-start bg-[#FEFEFE]"
              >
                {/* ── Left column ── */}
                <div
                  className="flex flex-1 flex-col"
                  style={{ minWidth: 'min(520px, 100%)' }}
                >
                  {/* Title & Address section */}
                  <div
                    className="flex w-full shrink-0 flex-col bg-[#FEFEFE]"
                    style={{
                      borderBottom: '1px solid #F2F2F2',
                      gap: 32,
                      paddingTop: 16,
                      paddingBottom: 24,
                      paddingLeft: 32,
                      paddingRight: 32,
                    }}
                  >
                    {/* Top line: OPEN status + LOCKER badge */}
                    <div
                      className="flex w-full shrink-0 items-center"
                      style={{ gap: 8 }}
                    >
                      {/* ApmStatus: "OPEN" bold + opening hours regular */}
                      <div className="flex min-w-0 flex-1 items-center">
                        <div
                          style={{
                            paddingRight: 8,
                            paddingTop: 4,
                            paddingBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "'Archivo', sans-serif",
                              fontWeight: 700,
                              fontSize: 12,
                              lineHeight: '16px',
                              color: '#1D1D1D',
                              textTransform: 'uppercase',
                              fontVariationSettings: "'wdth' 100",
                            }}
                          >
                            Open
                          </span>
                        </div>
                        <span
                          className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                          style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontWeight: 400,
                            fontSize: 12,
                            lineHeight: '16px',
                            color: '#515151',
                            textTransform: 'uppercase',
                            fontVariationSettings: "'wdth' 100",
                          }}
                        >
                          {locker.openingHours}
                        </span>
                      </div>
                      {/* Caption label: "LOCKER" bordered */}
                      <div
                        style={{
                          border: '1px solid #E1E1E1',
                          paddingLeft: 8,
                          paddingRight: 8,
                          paddingTop: 4,
                          paddingBottom: 4,
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Archivo', sans-serif",
                            fontWeight: 700,
                            fontSize: 12,
                            lineHeight: '16px',
                            letterSpacing: '0.048px',
                            color: '#1D1D1D',
                            textTransform: 'uppercase',
                            fontVariationSettings: "'wdth' 100",
                          }}
                        >
                          LOCKER
                        </span>
                      </div>
                    </div>

                    {/* Name, address, description */}
                    <div
                      className="flex w-full shrink-0 flex-col"
                      style={{ gap: 12 }}
                    >
                      <p
                        style={{
                          fontFamily: "'Archivo', sans-serif",
                          fontWeight: 700,
                          fontSize: 26,
                          lineHeight: '36px',
                          color: '#1D1D1D',
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        {locker.locationName}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Archivo', sans-serif",
                          fontWeight: 400,
                          fontSize: 16,
                          lineHeight: '24px',
                          color: '#1D1D1D',
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        {locker.address.line1}, {locker.address.line2}
                      </p>
                      <p
                        style={{
                          fontFamily: "'Archivo', sans-serif",
                          fontWeight: 400,
                          fontSize: 14,
                          lineHeight: '22px',
                          color: '#1D1D1D',
                          fontVariationSettings: "'wdth' 100",
                        }}
                      >
                        {locker.description}
                      </p>
                    </div>

                    {/* Compartment Availability box */}
                    <div
                      className="flex w-full shrink-0 flex-col bg-[#FEFEFE]"
                      style={{
                        border: '1px solid #F2F2F2',
                        gap: 16,
                        padding: 16,
                        maxWidth: 420,
                        minWidth: 320,
                      }}
                      data-testid="compartment-availability"
                    >
                      {/* Header: Live availability + About sizes */}
                      <div
                        className="flex w-full shrink-0 items-center"
                        style={{ gap: 10 }}
                      >
                        {/* Live availability with animated pulse */}
                        <div
                          className="flex shrink-0 items-center"
                          style={{ gap: 8 }}
                        >
                          {/* Pulse indicator (Figma: Pulse Live 24x24) */}
                          <div
                            className="relative flex items-center justify-center"
                            style={{ width: 24, height: 24 }}
                          >
                            <div
                              className="absolute animate-ping rounded-full"
                              style={{
                                width: 20,
                                height: 20,
                                backgroundColor: '#FD5F2E',
                                opacity: 0.25,
                              }}
                            />
                            <div
                              className="relative rounded-full"
                              style={{
                                width: 8,
                                height: 8,
                                backgroundColor: '#FD5F2E',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontFamily: "'Archivo', sans-serif",
                              fontWeight: 400,
                              fontSize: 16,
                              lineHeight: '24px',
                              color: '#1D1D1D',
                              fontVariationSettings: "'wdth' 100",
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Live availability
                          </span>
                        </div>
                        <div className="min-w-0 flex-1" />
                        {/* About sizes link */}
                        <div
                          className="flex shrink-0 items-center"
                          style={{ gap: 2 }}
                        >
                          <span
                            style={{
                              fontFamily: "'Archivo', sans-serif",
                              fontWeight: 700,
                              fontSize: 14,
                              lineHeight: '22px',
                              color: '#4B4B4B',
                              fontVariationSettings: "'wdth' 100",
                              whiteSpace: 'nowrap',
                            }}
                          >
                            About sizes
                          </span>
                          <Pencil
                            className="shrink-0"
                            style={{ width: 18, height: 18, color: '#4B4B4B' }}
                          />
                        </div>
                      </div>

                      {/* Compartments row — gap-24px, each flex-1 */}
                      <div
                        className="flex w-full shrink-0 items-start"
                        style={{ gap: 24 }}
                      >
                        <CompartmentAvailability
                          size="S"
                          level={locker.locker_availability.details.S}
                        />
                        <CompartmentAvailability
                          size="M"
                          level={locker.locker_availability.details.M}
                        />
                        <CompartmentAvailability
                          size="L"
                          level={locker.locker_availability.details.L}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Right column: locker image ── */}
                <div
                  className="flex flex-1 flex-col bg-[#FEFEFE]"
                  style={{ minWidth: 'min(420px, 100%)', minHeight: 320 }}
                >
                  {/* BUG: missing alt text on locker image */}
                  <img
                    src={locker.image_url}
                    className="h-full w-full object-cover"
                    style={{ minHeight: 320 }}
                  />
                </div>
              </div>

              {/* Trustpilot widget — DYNAMIC review count, requires masking in visual tests */}
              <div
                data-testid="trustpilot-widget"
                className="flex items-center justify-between border border-[#F2F2F2] bg-[#FEFEFE] p-5"
              >
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className="h-5 w-5"
                        fill={
                          star <= Math.round(locker.trustpilot_score)
                            ? '#00B67A'
                            : '#e5e7eb'
                        }
                        stroke="none"
                      />
                    ))}
                  </div>
                  <div>
                    <p
                      className="text-sm font-bold text-[#1d1d1d]"
                      style={{ fontFamily: "'Archivo', sans-serif" }}
                    >
                      {locker.trustpilot_score} out of 5
                    </p>
                    {/* BUG: off-brand green — should be #00D46B, is #00B67A (Trustpilot green) */}
                    <p
                      className="text-xs text-[#4b4b4b]"
                      style={{ fontFamily: "'Archivo', sans-serif" }}
                    >
                      Based on{' '}
                      <span
                        data-testid="review-count"
                        className="font-semibold"
                      >
                        {locker.trustpilot_reviews.toLocaleString()}
                      </span>{' '}
                      reviews on Trustpilot
                    </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="flex items-center gap-1 text-xs font-semibold text-[#065BD7] hover:underline"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                >
                  View all <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </>
          )}

          {/* Interview questions box */}
          <div className="border border-gray-200 bg-white p-5">
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
                · How would you automate a visual test for this page to make it
                stable across runs?
              </li>
              <li>
                · When would you use visual regression testing instead of
                functional assertions?
              </li>
              <li>
                · How do you handle minor rendering differences between local
                and CI environments?
              </li>
              <li>
                · What is your strategy for updating baseline screenshots when
                the design intentionally changes?
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
