"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getBrowserSupabase } from "../../lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface ProtectedLayoutProps {
  children: React.ReactNode
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = getBrowserSupabase()

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Auth session error:', error)
          // Continue with null session instead of failing
        }
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (!session?.user && pathname !== '/auth') {
          router.push('/auth')
        }
      } catch (error) {
        console.error('Failed to get session:', error)
        setUser(null)
        setLoading(false)
        if (pathname !== '/auth') {
          router.push('/auth')
        }
      }
    }

    initAuth()

    let subscription: any
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (!session?.user && pathname !== '/auth') {
          router.push('/auth')
        }
      })
      subscription = data.subscription
    } catch (error) {
      console.error('Auth state change error:', error)
    }

    return () => {
      if (subscription) {
        try {
          subscription.unsubscribe()
        } catch (error) {
          console.error('Error unsubscribing:', error)
        }
      }
    }
  }, [supabase.auth, router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!user && pathname !== '/auth') {
    return null
  }

  return <>{children}</>
}