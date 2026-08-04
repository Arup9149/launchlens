import type { SupabaseClient } from "@supabase/supabase-js"
import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin"

/** Early Founder allocation for new accounts (env-overridable). */
export function founderStarterCredits(): number {
  const n = Number(process.env.FOUNDER_STARTER_CREDITS || "3")
  if (!Number.isFinite(n) || n < 0) return 3
  return Math.floor(n)
}

/**
 * Ensure the authenticated user has a founder_credits row.
 * New founders receive the configured starter allocation (default 3).
 * Idempotent — never overwrites an existing balance.
 */
export async function ensureFounderCreditsRow(
  userClient: SupabaseClient,
  user: { id: string; email?: string | null }
): Promise<{ credits: number; plan: string | null; email: string | null; bootstrapped: boolean }> {
  const { data: existing, error: readError } = await userClient
    .from("founder_credits")
    .select("credits, plan, email")
    .eq("user_id", user.id)
    .maybeSingle()

  if (readError) throw new Error(readError.message)

  if (existing) {
    return {
      credits: existing.credits ?? 0,
      plan: existing.plan ?? null,
      email: existing.email ?? user.email ?? null,
      bootstrapped: false,
    }
  }

  const amount = founderStarterCredits()
  const email = (user.email || "").trim().toLowerCase() || null
  const plan = "early_founder"

  // Insert needs service role (RLS has no insert policy for clients — by design)
  if (!isAdminConfigured()) {
    console.warn(
      JSON.stringify({
        level: "warn",
        msg: "credits.bootstrap_skipped_no_admin",
        userId: user.id,
        hint: "Set SUPABASE_SERVICE_ROLE_KEY so new founders receive starter validations",
      })
    )
    return { credits: 0, plan: null, email, bootstrapped: false }
  }

  const admin = createAdminClient()
  const { data: inserted, error: insertError } = await admin
    .from("founder_credits")
    .insert([
      {
        user_id: user.id,
        email,
        credits: amount,
        plan,
        updated_at: new Date().toISOString(),
      },
    ])
    .select("credits, plan, email")
    .maybeSingle()

  if (insertError) {
    // Race: another request created the row
    if (
      insertError.code === "23505" ||
      /duplicate|unique/i.test(insertError.message)
    ) {
      const { data: again } = await userClient
        .from("founder_credits")
        .select("credits, plan, email")
        .eq("user_id", user.id)
        .maybeSingle()
      return {
        credits: again?.credits ?? 0,
        plan: again?.plan ?? null,
        email: again?.email ?? email,
        bootstrapped: false,
      }
    }
    throw new Error(insertError.message)
  }

  console.info(
    JSON.stringify({
      level: "info",
      msg: "credits.founder_bootstrapped",
      userId: user.id,
      credits: inserted?.credits ?? amount,
      plan,
    })
  )

  return {
    credits: inserted?.credits ?? amount,
    plan: inserted?.plan ?? plan,
    email: inserted?.email ?? email,
    bootstrapped: true,
  }
}
