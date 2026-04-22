'use client'

import { useAuth } from '@/components/auth-context'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mail, User, Calendar, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (!user) return null

  const joinDate = new Date(Number.parseInt(user.id)).toLocaleDateString(
    'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-6 text-center">
            <div className="mb-4 flex justify-center">
              <Avatar className="bg-primary-600 h-24 w-24 text-2xl font-bold text-white">
                <AvatarFallback className="bg-primary-600 text-2xl text-white">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl text-gray-900">
              {user.name}
            </CardTitle>
            <CardDescription className="text-gray-600">
              Welcome to your profile
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                <User className="text-primary-600 h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="capitalize text-gray-900">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                <Mail className="text-primary-600 h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email Address
                  </p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">
                <Calendar className="text-primary-600 h-5 w-5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Member Since
                  </p>
                  <p className="text-gray-900">
                    {new Date('asdasd').toString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex w-full items-center gap-2 bg-transparent hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
