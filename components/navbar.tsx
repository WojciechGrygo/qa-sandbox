'use client'

import Link from 'next/link'
import { useAuth } from './auth-context'
import { Button, buttonVariants } from './ui/button'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-primary-600 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-black">
              ProductApp
            </Link>
            <div className="hidden items-center space-x-6 md:flex">
              <Link
                href="/"
                className="text-black transition-colors hover:text-black/80"
              >
                Home
              </Link>
              {user && (
                <Link
                  href="/products"
                  className="text-black transition-colors hover:text-black/80"
                >
                  Products
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-black/80">
                Welcome, {user.name}
              </span>
            )}
            {user && (
              <Link href="/profile" className="text-black">
                Profile
              </Link>
            )}
            <Link href="/login">
              <div
                id="login-button"
                className={cn(
                  buttonVariants(),
                  'bg-black text-white hover:bg-black/90'
                )}
              >
                Login
              </div>
            </Link>
            {user && (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-black bg-transparent text-black hover:bg-black hover:text-black"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
