'use client'

import { useAuth } from '@/components/auth-context'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useState } from 'react'

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterState, setNewsletterState] = useState<'idle' | 'loading' | 'success'>('idle')
  const [newsletterError, setNewsletterError] = useState('')
  const [postcode, setPostcode] = useState('')
  const [postcodeError, setPostcodeError] = useState('')
  const [postcodeLoading, setPostcodeLoading] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F6F6F6]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFCC05] border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F6F6]">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#FFCC05] overflow-hidden px-4 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">

          {/* "YOUR DOOR TO MORE" — Figma asset, transparent SVG on yellow bg */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/your-door-to-more.svg"
            alt="Your door to more"
            className="w-full"
            style={{ maxWidth: 821 }}
          />

          {/* Subtitle + postcode form */}
          <div className="flex w-full max-w-[820px] flex-col gap-4">
            {/* BUG: "avalible" should be "available" */}
            <p
              className="text-center font-bold text-[#1d1d1d]"
              style={{ fontFamily: "'Archivo', sans-serif", fontSize: 20, lineHeight: '28px' }}
            >
              Over 4,000 parcel lockers avalible across the UK, 24/7
            </p>

            {/* Postcode search — BUG: /api/postcode always returns 500 */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex w-full items-center overflow-hidden border-4 border-[#1d1d1d] bg-[#FEFEFE]">
                <input
                  type="text"
                  placeholder="Enter postcode..."
                  value={postcode}
                  onChange={(e) => { setPostcode(e.target.value); setPostcodeError('') }}
                  data-testid="postcode-input"
                  className="h-[60px] min-w-0 flex-1 bg-transparent px-6 outline-none text-[#1d1d1d]"
                  style={{ fontFamily: "'Archivo', sans-serif", fontSize: 26, lineHeight: '36px' }}
                />
                <button
                  type="button"
                  data-testid="postcode-submit"
                  disabled={postcodeLoading}
                  onClick={async () => {
                    if (!postcode.trim()) return
                    setPostcodeLoading(true)
                    setPostcodeError('')
                    try {
                      const res = await fetch('/api/postcode', {
                        method: 'POST',
                        body: JSON.stringify({ postcode: postcode.trim() }),
                      })
                      if (!res.ok) {
                        const json = await res.json()
                        setPostcodeError(json.error ?? 'Something went wrong. Please try again.')
                      }
                    } catch {
                      setPostcodeError('Something went wrong. Please try again.')
                    } finally {
                      setPostcodeLoading(false)
                    }
                  }}
                  className="flex h-[68px] w-[120px] shrink-0 items-center justify-center bg-[#1d1d1d] hover:bg-[#333] transition-colors disabled:opacity-60"
                  aria-label="Find lockers"
                >
                  {postcodeLoading
                    ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    : <ArrowRight className="h-8 w-8 text-white" />
                  }
                </button>
              </div>
              {/* BUG: error has no role="alert" */}
              {postcodeError && (
                <p
                  data-testid="postcode-error"
                  className="text-sm font-semibold text-[#1d1d1d]"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                >
                  {postcodeError}
                </p>
              )}
            </div>
          </div>

          {/* After login: Browse Products → /products (BUG: 404 route) */}
          {user && (
            <div className="flex flex-col items-center gap-3">
              <p
                className="text-sm font-semibold text-[#1d1d1d]"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                Welcome back, {user.name}!
              </p>
              <Link
                href="/products"
                className="flex items-center gap-2 border-2 border-[#1d1d1d] bg-[#1d1d1d] px-6 py-3 font-bold text-[#FFCC05] transition-colors hover:bg-transparent hover:text-[#1d1d1d]"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA Cards ─────────────────────────────────────────────────────── */}
      {/* Figma: CTA Card Group — 3 white cards, gap-24px, Archivo Bold 30px titles */}
      <section className="bg-[#F6F6F6] px-4 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-3">
          {[
            {
              title: 'Track a parcel',
              description: 'Follow your parcel every step of the way, from sender to your nearest locker.',
            },
            {
              title: 'Return in seconds',
              description: 'Drop off your return at any InPost locker — no printer, no hassle, no queues.',
            },
            {
              title: 'Send a parcel',
              description: 'Send to any locker in the UK. Print a label at the locker or in the app.',
            },
          ].map((card) => (
            // BUG: cursor-pointer but no onClick — visually interactive, does nothing
            <div
              key={card.title}
              className="flex cursor-pointer flex-col justify-end gap-4 bg-[#FEFEFE] p-6"
            >
              <h3
                className="font-bold text-[#1d1d1d]"
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontSize: 30,
                  lineHeight: '40px',
                  fontVariationSettings: "'wdth' 100",
                }}
              >
                {card.title}
              </h3>
              <div className="flex items-end justify-between gap-4">
                <p
                  className="min-w-0 flex-1 text-[#1d1d1d]"
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: 20,
                    lineHeight: '28px',
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  {card.description}
                </p>
                {/* Figma: 40x40 chevron/arrow */}
                <div className="flex shrink-0 items-center justify-center" style={{ width: 40, height: 40 }}>
                  <ArrowRight className="h-6 w-6 text-[#1d1d1d]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      {/* Figma: blue #1773F9, title off-white #F2F2F2, email input, letter icon */}
      <section className="px-4 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div
            className="flex flex-col gap-16 overflow-hidden"
            style={{ backgroundColor: '#1773F9', padding: 64 }}
          >
            {/* Title row */}
            <div className="flex w-full items-center justify-between gap-8">
              <div className="flex flex-col gap-2">
                <h2
                  className="font-bold text-[#F2F2F2]"
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: 48,
                    lineHeight: '64px',
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  Sign up to our newsletter
                </h2>
                <p
                  className="font-bold text-[#F2F2F2]"
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: 30,
                    lineHeight: '40px',
                    fontVariationSettings: "'wdth' 100",
                  }}
                >
                  Stay in the know, every step of the way
                </p>
              </div>
              {/* Letter / envelope icon — Figma: pixel-art letter 120×120 */}
              <div
                className="shrink-0 text-[#F2F2F2] select-none"
                style={{ fontSize: 96, lineHeight: 1 }}
                aria-hidden="true"
              >
                ✉
              </div>
            </div>

            {/* Input + disclaimer */}
            <div className="flex flex-col gap-4">
              {newsletterState === 'success' ? (
                <div
                  data-testid="newsletter-success"
                  className="flex h-[68px] w-full items-center justify-center bg-[#FEFEFE]"
                >
                  <p
                    className="font-bold text-[#1d1d1d]"
                    style={{ fontFamily: "'Archivo', sans-serif", fontSize: 20 }}
                  >
                    You&apos;re signed up!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex w-full items-center overflow-hidden border-4 border-[#1d1d1d] bg-[#FEFEFE]">
                    <input
                      type="text"
                      placeholder="Email address..."
                      value={newsletterEmail}
                      onChange={(e) => { setNewsletterEmail(e.target.value); setNewsletterError('') }}
                      data-testid="newsletter-input"
                      className="h-[60px] min-w-0 flex-1 bg-transparent px-6 text-[#1d1d1d] outline-none"
                      style={{ fontFamily: "'Archivo', sans-serif", fontSize: 26, lineHeight: '36px' }}
                    />
                    <button
                      type="button"
                      data-testid="newsletter-submit"
                      onClick={async () => {
                        const val = newsletterEmail.trim()
                        if (!val) { setNewsletterError('Please enter your email address'); return }
                        // BUG: only checks for "@" — "wojtek@mail" passes, no TLD validation
                        const atIndex = val.indexOf('@')
                        if (atIndex < 1 || atIndex === val.length - 1) {
                          setNewsletterError('Please enter a valid email address')
                          return
                        }
                        setNewsletterState('loading')
                        await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email: val }) })
                        setNewsletterState('success')
                      }}
                      className="flex h-[68px] w-[120px] shrink-0 items-center justify-center bg-[#1d1d1d] hover:bg-[#333] transition-colors"
                      aria-label="Subscribe"
                    >
                      {newsletterState === 'loading'
                        ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        : <ArrowRight className="h-8 w-8 text-white" />
                      }
                    </button>
                  </div>
                  {/* BUG: error has no role="alert" — not announced to screen readers */}
                  {newsletterError && (
                    <p
                      data-testid="newsletter-error"
                      style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, color: '#FEFEFE' }}
                    >
                      {newsletterError}
                    </p>
                  )}
                </div>
              )}

              {/* BUG: text should be #FEFEFE (white) on blue bg — hardcoded #1d1d1d (black) */}
              <p
                style={{
                  fontFamily: "'Archivo', sans-serif",
                  fontWeight: 700,
                  fontSize: 20,
                  lineHeight: '28px',
                  color: '#1d1d1d',
                  maxWidth: 653,
                  fontVariationSettings: "'wdth' 100",
                }}
              >
                By giving us your email address, you are agreeing to hear about InPost promotions, offers and other services we think will interest you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ───────────────────────────────────────────────────────── */}
      <section className="pb-16 px-4 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl text-center">
          {/* BUG: plain text, not <a href="mailto:..."> */}
          <p
            className="text-[#4b4b4b] text-sm"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            Questions? Contact us: support@inpost-sandbox.example.com
          </p>
        </div>
      </section>

    </div>
  )
}
