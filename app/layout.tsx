import type React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/auth-context'
import { MegaNav } from '@/components/mega-nav'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'InPost – Send & Collect Parcels',
  description: 'Send, collect and return parcels at thousands of InPost Lockers across the UK.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Saira:wght@900&family=Archivo:wght@400;500;600;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Archivo', 'Segoe UI', Arial, sans-serif" }}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <MegaNav />
            <main className="min-h-screen">{children}</main>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  )
}
