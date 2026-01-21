import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const PROTECTED_ROUTES = ["/", "/planner", "/shopping", "/profile", "/assistant"]

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

  const supabase = createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return req.cookies.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        res.cookies.set({ name, value, ...options })
      },
      remove(name: string, options: any) {
        res.cookies.set({ name, value: "", ...options })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // If user is not logged in and trying to access a protected route -> go to /auth
  if (!user && PROTECTED_ROUTES.includes(pathname)) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/auth"
    redirectUrl.searchParams.set("redirectedFrom", pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is logged in and goes to auth pages -> send them to profile dashboard
  if (user && (pathname === "/auth" || pathname === "/login")) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/profile"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    "/",
    "/planner",
    "/shopping",
    "/profile",
    "/assistant",
    "/auth",
    "/login",
    // Ensure we don't match static assets or API routes
    "/((?!_next|api|.*\\..*).*)",
  ],
}
