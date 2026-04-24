'use client'

import { useState } from 'react'

interface FormData {
  fullName: string
  addressLine1: string
  addressLine2: string
  postcode: string
  parcelNumber: string
  reason: string
}

type FieldError = Partial<Record<keyof FormData, string>>

export default function A11yChallengePage() {
  const [form, setForm] = useState<FormData>({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    postcode: '',
    parcelNumber: '',
    reason: '',
  })
  const [errors, setErrors] = useState<FieldError>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = (): FieldError => {
    const e: FieldError = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.addressLine1.trim()) e.addressLine1 = 'Address is required'
    if (!form.postcode.trim()) e.postcode = 'Postcode is required'
    if (!form.parcelNumber.trim()) e.parcelNumber = 'Parcel number is required'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) {
      setErrors(e2)
      return
    }
    setErrors({})
    setSubmitted(true)
  }

  const update =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* Hero */}
      <section className="bg-[#FFCC05] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p
            className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#1d1d1d]/60"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            QA Challenge · Accessibility
          </p>
          <h1
            className="mb-3 text-4xl font-black uppercase text-[#1d1d1d]"
            style={{ fontFamily: "'Saira', sans-serif" }}
          >
            Return a Parcel
          </h1>
          <p
            className="max-w-xl text-base text-[#1d1d1d]/80"
            style={{ fontFamily: "'Archivo', sans-serif" }}
          >
            Complete the return form below. There are accessibility issues on
            this page — find and report them.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl space-y-6">
          {submitted ? (
            <div className="rounded-lg border border-gray-100 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFCC05]">
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d1d1d"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2
                className="mb-2 text-xl font-bold text-[#1d1d1d]"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                Return submitted
              </h2>
              <p
                className="text-sm text-[#4b4b4b]"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                We&apos;ll send a confirmation to your email shortly.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-100 bg-white p-8 shadow-sm">
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div>
                  <input
                    type="text"
                    id="fullName"
                    value={form.fullName}
                    onChange={update('fullName')}
                    placeholder="Full name *"
                    className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-[#FFCC05]"
                    style={{ fontFamily: "'Archivo', sans-serif" }}
                    aria-required="true"
                  />
                  {errors.fullName && (
                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: '#f87171',
                        fontFamily: "'Archivo', sans-serif",
                      }}
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    id="addressLine1"
                    value={form.addressLine1}
                    onChange={update('addressLine1')}
                    placeholder="Address line 1 *"
                    className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-[#FFCC05]"
                    style={{ fontFamily: "'Archivo', sans-serif" }}
                  />
                  {errors.addressLine1 && (
                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: '#f87171',
                        fontFamily: "'Archivo', sans-serif",
                      }}
                    >
                      {errors.addressLine1}
                    </p>
                  )}
                </div>

                <input
                  type="text"
                  id="addressLine2"
                  value={form.addressLine2}
                  onChange={update('addressLine2')}
                  placeholder="Address line 2 (optional)"
                  className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-[#FFCC05]"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                />

                <div>
                  <input
                    type="text"
                    id="postcode"
                    value={form.postcode}
                    onChange={update('postcode')}
                    placeholder="Postcode *"
                    className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-[#FFCC05]"
                    style={{ fontFamily: "'Archivo', sans-serif" }}
                    aria-required="true"
                  />
                  {errors.postcode && (
                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: '#f87171',
                        fontFamily: "'Archivo', sans-serif",
                      }}
                    >
                      {errors.postcode}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    id="parcelNumber"
                    value={form.parcelNumber}
                    onChange={update('parcelNumber')}
                    placeholder="Parcel number *"
                    className="w-full rounded border border-gray-300 px-4 py-3 text-sm text-[#1d1d1d] focus:outline-none focus:ring-2 focus:ring-[#FFCC05]"
                    style={{ fontFamily: "'Archivo', sans-serif" }}
                    aria-required="true"
                  />
                  {errors.parcelNumber && (
                    <p
                      className="mt-1 text-xs"
                      style={{
                        color: '#f87171',
                        fontFamily: "'Archivo', sans-serif",
                      }}
                    >
                      {errors.parcelNumber}
                    </p>
                  )}
                </div>

                <select
                  id="reason"
                  value={form.reason}
                  onChange={update('reason')}
                  className="w-full rounded border border-gray-300 bg-white px-4 py-3 text-sm text-[#4b4b4b] focus:outline-none focus:ring-2 focus:ring-[#FFCC05]"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                >
                  <option value="">Reason for return</option>
                  <option value="wrong_item">Wrong item received</option>
                  <option value="damaged">Item arrived damaged</option>
                  <option value="changed_mind">Changed my mind</option>
                  <option value="not_as_described">Not as described</option>
                </select>

                <div
                  onClick={
                    handleSubmit as unknown as React.MouseEventHandler<HTMLDivElement>
                  }
                  className="flex w-full items-center justify-center rounded bg-[#FFCC05] px-6 py-3 font-bold text-[#1d1d1d] transition-colors hover:bg-[#e6b800]"
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    cursor: 'pointer',
                  }}
                >
                  Submit return
                </div>

              </form>
            </div>
          )}

          {/* Interview questions box */}
          <div className="rounded-lg border border-gray-200 bg-white p-5">
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
              <li>· What tools do you use to audit accessibility?</li>
              <li>
                · How would you classify the bugs you found — and what makes a
                bug High vs Medium?
              </li>
              <li>
                · How would you automate an accessibility test suite for this
                form?
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
