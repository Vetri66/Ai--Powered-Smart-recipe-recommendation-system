"use client"

import { createBrowserClient } from "@supabase/ssr"

declare global {
  // eslint-disable-next-line no-var
  var __supabase_browser__: ReturnType<typeof createBrowserClient> | undefined
}

export function getBrowserSupabase() {
  if (!globalThis.__supabase_browser__) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    if (!url || !anon) {
      throw new Error('Missing Supabase environment variables')
    }
    
    try {
      globalThis.__supabase_browser__ = createBrowserClient(url, anon, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    } catch (error) {
      console.error('Failed to create Supabase client:', error)
      // Create a minimal fallback client
      globalThis.__supabase_browser__ = createBrowserClient(url, anon)
    }
  }
  return globalThis.__supabase_browser__
}
