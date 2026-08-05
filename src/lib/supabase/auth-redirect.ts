/**
 * Auth redirect helpers for Supabase email confirmation / recovery.
 * Always land on LaunchLens (/auth/callback), never expose a hardcoded host
 * except the documented NEXT_PUBLIC_APP_URL fallback for non-browser contexts.
 */

/** Safe relative path for post-auth navigation (open-redirect guard). */
export function safeNextPath(
  next: string | null | undefined,
  fallback = "/dashboard"
): string {
  if (!next || typeof next !== "string") return fallback
  const trimmed = next.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback
  if (trimmed.includes("://")) return fallback
  return trimmed
}

/**
 * Public origin for auth redirects.
 * Browser: window.location.origin (production domain or localhost).
 * Server / SSR fallback: NEXT_PUBLIC_APP_URL.
 */
export function getAuthOrigin(): string {
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin.replace(/\/$/, "")
  }
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, "")
  if (fromEnv) return fromEnv
  return "http://localhost:3000"
}

/**
 * Full emailRedirectTo / redirectTo value for Supabase Auth emails.
 * Example: https://launchlens.in/auth/callback?next=%2Fdashboard
 */
export function getAuthCallbackUrl(nextPath = "/dashboard"): string {
  const origin = getAuthOrigin()
  const next = safeNextPath(nextPath)
  return `${origin}/auth/callback?next=${encodeURIComponent(next)}`
}
