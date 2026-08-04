/**
 * Shared Supabase public env resolution.
 * Missing values must not crash the production build; they fail at the call site
 * with a clear message when a feature actually needs Supabase.
 */
export function getSupabasePublicEnv(): {
  url: string
  anonKey: string
} | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  if (!url || !anonKey) return null
  return { url, anonKey }
}

export function requireSupabasePublicEnv(): { url: string; anonKey: string } {
  const env = getSupabasePublicEnv()
  if (!env) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in the host environment (see .env.example)."
    )
  }
  return env
}
