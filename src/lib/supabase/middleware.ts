import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getSupabasePublicEnv } from "./env"

/** Product routes that require a signed-in session. */
function isProtectedPath(pathname: string): boolean {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/validate") ||
    pathname.startsWith("/workshop") ||
    pathname.startsWith("/guides")
  )
}

/** Auth pages where an already-signed-in user should skip. */
function isAuthEntryPath(pathname: string): boolean {
  return (
    pathname === "/auth/login" ||
    pathname === "/auth/signup" ||
    pathname.startsWith("/auth/login/") ||
    pathname.startsWith("/auth/signup/")
  )
}

/**
 * Refresh Supabase auth cookies when configured.
 * Gate protected product routes to login; send signed-in users away from login/signup.
 * If env is missing (misconfigured deploy), pass the request through so the
 * rest of the app still serves — data features will fail with clear errors.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const env = getSupabasePublicEnv()
  if (!env) {
    return supabaseResponse
  }

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        )
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname, search } = request.nextUrl

  if (isProtectedPath(pathname) && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    const next = `${pathname}${search || ""}`
    url.search = ""
    url.searchParams.set("next", next)
    return NextResponse.redirect(url)
  }

  if (isAuthEntryPath(pathname) && user) {
    const url = request.nextUrl.clone()
    const next = request.nextUrl.searchParams.get("next")
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      url.pathname = next.split("?")[0] || "/dashboard"
      url.search = next.includes("?") ? `?${next.split("?").slice(1).join("?")}` : ""
    } else {
      url.pathname = "/dashboard"
      url.search = ""
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
