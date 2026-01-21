"use client"

import { useEffect, useState } from "react"
import { getBrowserSupabase } from "../../lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface AuthWrapperProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

export default function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getBrowserSupabase()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return user ? <>{children}</> : <>{fallback}</>
}