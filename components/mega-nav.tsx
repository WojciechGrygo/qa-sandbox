'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from './auth-context'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  Package,
  MapPin,
  HelpCircle,
  Building2,
  ArrowRight,
  LogOut,
  User,
  Bug,
  Clock,
  Eye,
  Accessibility,
  Code2,
} from 'lucide-react'

// ─── InPost Logo (yellow bg variant) ────────────────────────────────────────
function InPostLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 443 266"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="InPost"
      role="img"
    >
      <path
        fill="#1d1d1d"
        fillRule="evenodd"
        d="M264.73,138.08c3.71-3.68,5.57-8.63,5.57-14.72,0-6.39-1.85-11.43-5.48-15.07-3.71-3.63-9.01-5.47-15.92-5.47h-21.35v59.7h9.96v-18.88h12.08c6.34,0,11.43-1.84,15.14-5.56ZM249.76,112.5c6.94,0,10.44,3.63,10.44,10.86,0,3.37-.95,6-2.8,7.88-1.85,1.89-4.49,2.8-7.81,2.8h-12.12v-21.55h12.3ZM170.17,102.95h-9.97v59.7h9.97v-59.7ZM377.75,163.62c1.72,0,3.41-.22,5-.61h.05v-8.24c-.83.12-1.67.18-2.5.18-2.5,0-4.14-.57-4.92-1.62-.65-.83-.99-2.54-.99-5.17v-24.18h8.58v-8.01h-8.58v-12.92h-9.67v45.72c0,5.48.69,9.15,2.11,11.13,1.77,2.5,5.39,3.73,10.91,3.73ZM208.01,162.74h9.79v-30.31c0-5.08-1.42-9.03-4.18-11.83-2.76-2.85-6.47-4.51-11.13-4.51-10.74,0-22.65,2.67-22.65,2.67v43.97h9.79v-36.92c3.41-.75,8.11-1.45,11.04-1.23,4.75.4,7.33,3.64,7.33,9.64v28.51ZM316.45,139c0,7.18-1.98,12.97-5.95,17.35-3.97,4.38-9.11,6.57-15.4,6.57s-11.48-2.19-15.4-6.57c-3.97-4.38-5.95-10.16-5.95-17.34s1.98-12.96,5.95-17.3c3.97-4.33,9.1-6.53,15.4-6.53s11.52,2.19,15.49,6.53c3.88,4.38,5.86,10.12,5.86,17.3ZM306.36,139.04c0-4.51-1.03-8.06-3.06-10.69-2.07-2.63-4.79-3.94-8.2-3.94s-6.13,1.32-8.19,3.98c-2.07,2.67-3.06,6.22-3.06,10.65s1.03,8.06,3.06,10.69c2.07,2.63,4.79,3.94,8.19,3.94s6.13-1.32,8.2-3.94c2.03-2.63,3.06-6.18,3.06-10.69ZM353.77,158.41c3.45-2.89,5.18-6.61,5.18-11.12,0-7.01-4.27-11.3-12.86-12.92-3.62-.66-7.29-1.32-11-1.89-2.63-.7-3.92-2.01-3.92-3.9,0-3.28,2.85-4.9,8.58-4.9,4.48,0,8.5,1.58,11.99,4.73l5.82-6.22c-4.83-4.56-10.65-6.83-17.51-6.83-5.65,0-10.18,1.36-13.59,4.12-3.41,2.75-5.09,6.22-5.09,10.29s1.38,7.05,4.18,9.07c2.42,1.66,6.38,2.89,12,3.72,4.66.74,7.51,1.31,8.58,1.71,1.85.7,2.76,2.01,2.76,3.9,0,1.62-.82,3.02-2.42,4.12-1.6,1.1-3.75,1.66-6.51,1.66-4.92,0-9.24-1.84-12.95-5.52l-7.42,6.31c4.83,5.35,11.65,8.01,20.49,8.01,5.65,0,10.22-1.44,13.67-4.33h0Z"
      />
      <path
        fill="#fefefe"
        fillRule="evenodd"
        d="M95.37,133.3s-7.82,3.03-17.47,3.03-17.47-3.03-17.47-3.03c0,0,7.82-3.03,17.47-3.03s17.47,3.03,17.47,3.03Z"
      />
      <path
        fill="#fefefe"
        fillRule="evenodd"
        d="M119.52,88.77s-6.93-4.68-12.33-12.53c-5.39-7.86-7.21-15.92-7.21-15.92,0,0,6.93,4.67,12.33,12.53,5.4,7.86,7.21,15.92,7.21,15.92Z"
      />
      <path
        fill="#fefefe"
        fillRule="evenodd"
        d="M101.83,107.98s-8.35-.93-16.87-5.38c-8.52-4.45-13.98-10.73-13.98-10.73,0,0,8.35.93,16.87,5.38,8.52,4.45,13.98,10.73,13.98,10.73Z"
      />
      <path
        fill="#fefefe"
        fillRule="evenodd"
        d="M119.52,177.67s-6.93,4.68-12.33,12.53c-5.39,7.85-7.21,15.92-7.21,15.92,0,0,6.93-4.67,12.33-12.53,5.4-7.85,7.21-15.92,7.21-15.92Z"
      />
      <path
        fill="#fefefe"
        fillRule="evenodd"
        d="M101.83,158.46s-8.35.93-16.87,5.38c-8.52,4.45-13.98,10.73-13.98,10.73,0,0,8.35-.93,16.87-5.38s13.98-10.73,13.98-10.73Z"
      />
      <path
        fill="#fefefe"
        fillRule="evenodd"
        d="M122.11,147.89h0c6.29,16.11,16.4,27.66,34.46,30.4-2.06.28-4.15.45-6.29.46-25.59.11-46.44-20.17-46.55-45.3-.11-25.13,20.54-45.6,46.13-45.71,2.28-.01,4.52.15,6.72.45-20.69,2.58-34.49,18.64-37.22,39.08-.87,12.46,13.64,16.67,13.64,16.67,0,0-5.94,3.88-10.89,3.96t0,0h0Z"
      />
    </svg>
  )
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface DropdownItem {
  label: string
  href: string
  description?: string
  icon?: React.ReactNode
}

interface NavItem {
  label: string
  items: DropdownItem[]
}

// ─── Nav data ────────────────────────────────────────────────────────────────
const navItems: NavItem[] = [
  {
    label: 'Your parcels',
    items: [
      {
        label: 'Track a parcel',
        href: '#',
        description: 'Find out where your parcel is',
        icon: <Package className="h-6 w-6" />,
      },
      {
        label: 'Send a parcel',
        href: '#',
        description: 'Drop off at any locker',
        icon: <Package className="h-6 w-6" />,
      },
      {
        label: 'Returns',
        href: '#',
        description: 'Easy returns to top retailers',
        icon: <ArrowRight className="h-6 w-6" />,
      },
    ],
  },
  {
    label: 'Lockers & shops',
    items: [
      {
        label: 'Find a locker',
        href: '#',
        description: 'Thousands of locations near you',
        icon: <MapPin className="h-6 w-6" />,
      },
      {
        label: 'Open a locker',
        href: '#',
        description: 'Collect or drop off 24/7',
        icon: <MapPin className="h-6 w-6" />,
      },
    ],
  },
  {
    label: 'Help',
    items: [
      {
        label: 'FAQs',
        href: '#',
        description: 'Common questions answered',
        icon: <HelpCircle className="h-6 w-6" />,
      },
      {
        label: 'Contact us',
        href: '#',
        description: 'Get in touch with our team',
        icon: <HelpCircle className="h-6 w-6" />,
      },
    ],
  },
  // {
  //   label: 'Business',
  //   items: [
  //     {
  //       label: 'Business solutions',
  //       href: '#',
  //       description: 'Scale your deliveries',
  //       icon: <Building2 className="h-6 w-6" />,
  //     },
  //     {
  //       label: 'Delivery for Enterprise',
  //       href: '#',
  //       description: 'High-volume shipping',
  //       icon: <Building2 className="h-6 w-6" />,
  //     },
  //   ],
  // },
]

const challengeItems: DropdownItem[] = [
  {
    label: 'Async Wait',
    href: '/challenges/async',
    description: 'API state & timing',
    icon: <Clock className="h-6 w-6" />,
  },
  {
    label: 'Visual Testing',
    href: '/challenges/visual',
    description: 'Screenshots & data mocking',
    icon: <Eye className="h-6 w-6" />,
  },
  {
    label: 'Accessibility',
    href: '/challenges/a11y',
    description: 'WCAG & screen readers',
    icon: <Accessibility className="h-6 w-6" />,
  },
  {
    label: 'API Testing',
    href: '/challenges/api-testing',
    description: 'Response validation',
    icon: <Code2 className="h-6 w-6" />,
  },
]

// ─── Dropdown ────────────────────────────────────────────────────────────────
function NavDropdown({
  items,
  isOpen,
}: {
  items: DropdownItem[]
  isOpen: boolean
}) {
  return (
    <div
      className={`absolute left-1/2 top-full z-50 mt-0 w-64 -translate-x-1/2 border-t-2 border-[#1d1d1d] bg-white shadow-xl transition-all duration-150 ${
        isOpen
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-1 opacity-0'
      }`}
    >
      <div className="py-2">
        {items.map(item => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="group flex items-start gap-3 px-5 py-3 transition-colors hover:bg-[#F6F6F6]"
          >
            <span className="mt-0.5 shrink-0 text-[#1d1d1d]">{item.icon}</span>
            <div>
              <p
                className="text-sm font-semibold leading-tight text-[#1d1d1d]"
                style={{ fontFamily: "'Archivo', sans-serif" }}
              >
                {item.label}
              </p>
              {item.description && (
                <p
                  className="mt-0.5 text-xs leading-tight text-[#4b4b4b]"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                >
                  {item.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─── MegaNav ─────────────────────────────────────────────────────────────────
export function MegaNav() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-[#FFCC05]" ref={navRef}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="InPost Home"
          >
            <InPostLogo className="h-auto w-[108px]" />
          </Link>

          {/* Nav items */}
          <nav
            className="ml-8 hidden items-center gap-1 md:flex"
            aria-label="Main navigation"
          >
            {navItems.map(item => (
              <div key={item.label} className="relative">
                <button
                  className="flex items-center gap-1 rounded px-3 py-2 text-[18px] font-semibold text-[#1d1d1d] transition-colors hover:bg-black/10"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                  onClick={() =>
                    setOpenMenu(openMenu === item.label ? null : item.label)
                  }
                  aria-expanded={openMenu === item.label}
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown
                    className={`h-6 w-6 transition-transform ${openMenu === item.label ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  onMouseEnter={() => setOpenMenu(item.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <NavDropdown
                    items={item.items}
                    isOpen={openMenu === item.label}
                  />
                </div>
              </div>
            ))}

            {/* QA Challenges */}
            <div className="relative">
              <button
                className="flex items-center gap-1 rounded border border-black/20 bg-black/10 px-3 py-2 text-[18px] font-semibold text-[#1d1d1d] transition-colors hover:bg-black/20"
                style={{ fontFamily: "'Archivo', sans-serif" }}
                onMouseEnter={() => setOpenMenu('challenges')}
                onMouseLeave={() => setOpenMenu(null)}
                onClick={() =>
                  setOpenMenu(openMenu === 'challenges' ? null : 'challenges')
                }
                aria-expanded={openMenu === 'challenges'}
                aria-haspopup="true"
              >
                <Bug className="h-6 w-6" />
                QA Challenges
                <ChevronDown
                  className={`h-6 w-6 transition-transform ${openMenu === 'challenges' ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                onMouseEnter={() => setOpenMenu('challenges')}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <NavDropdown
                  items={challengeItems}
                  isOpen={openMenu === 'challenges'}
                />
              </div>
            </div>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="hidden items-center gap-1.5 rounded px-3 py-2 text-[18px] font-semibold text-[#1d1d1d] transition-colors hover:bg-black/10 sm:flex"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                >
                  <User className="h-6 w-6" />
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden items-center gap-1.5 rounded px-3 py-2 text-[18px] font-semibold text-[#1d1d1d] transition-colors hover:bg-black/10 sm:flex"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                >
                  <LogOut className="h-6 w-6" />
                  Log out
                </button>
              </>
            ) : (
              <Link href="/login">
                <div
                  id="login-button"
                  className="rounded px-3 py-2 text-[18px] font-semibold text-[#1d1d1d] transition-colors hover:bg-black/10"
                  style={{ fontFamily: "'Archivo', sans-serif" }}
                >
                  Log in
                </div>
              </Link>
            )}

            <Link
              href="/send-a-parcel"
              className="flex items-center gap-2 rounded border-2 border-[#1d1d1d] px-4 py-2 text-[18px] font-bold text-[#1d1d1d] transition-colors hover:bg-[#1d1d1d] hover:text-[#FFCC05]"
              style={{ fontFamily: "'Archivo', sans-serif" }}
            >
              Send a parcel
              <ArrowRight className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
