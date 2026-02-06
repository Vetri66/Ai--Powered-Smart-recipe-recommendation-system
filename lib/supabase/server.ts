import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

let _serverClient: ReturnType<typeof createServerClient> | undefined

export function getServerSupabase() {
  if (_serverClient) return _serverClient

  const cookieStore = cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

  _serverClient = createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (e) {
          // Ignore cookie errors during build
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (e) {
          // Ignore cookie errors during build
        }
      },
    },
  })

  return _serverClient
}
