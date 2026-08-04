import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { getSupabasePublicEnv } from "./env"

/**
 * Service-role client for trusted server paths only (webhooks, fulfillment).
 * Never import this into client components or expose the key.
 */
export function createAdminClient(): SupabaseClient {
  const publicEnv = getSupabasePublicEnv()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!publicEnv || !serviceKey) {
    throw new Error(
      "Missing Supabase admin env (NEXT_PUBLIC_SUPABASE_URL / ANON_KEY / SUPABASE_SERVICE_ROLE_KEY)."
    )
  }

  return createClient(publicEnv.url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

export function isAdminConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  )
}
