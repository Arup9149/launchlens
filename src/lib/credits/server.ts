import type { SupabaseClient } from "@supabase/supabase-js"

export type GrantCreditsInput = {
  userId: string
  email: string
  amount: number
  plan?: string
  /** Unique payment / event id for idempotency (e.g. Razorpay payment_id) */
  paymentId: string
  provider?: string
  orderId?: string
  rawEvent?: unknown
}

/**
 * Idempotent credit grant. Uses payment_events unique payment_id.
 * Must be called with a service-role (or otherwise trusted) Supabase client.
 */
export async function grantCreditsIdempotent(
  db: SupabaseClient,
  input: GrantCreditsInput
): Promise<{ credits: number; plan: string | null; alreadyProcessed: boolean }> {
  const email = input.email.trim().toLowerCase()
  const userId = input.userId
  const amount = Math.max(0, Math.floor(input.amount))
  const plan = input.plan || "early_bird"
  const provider = input.provider || "razorpay"

  // 1. Idempotency insert — unique on payment_id
  const { error: eventError } = await db.from("payment_events").insert([
    {
      payment_id: input.paymentId,
      provider,
      order_id: input.orderId ?? null,
      user_id: userId,
      email,
      product_id: plan,
      amount_credits: amount,
      status: "processed",
      raw: input.rawEvent ?? null,
    },
  ])

  if (eventError) {
    // Unique violation → already processed
    if (
      eventError.code === "23505" ||
      /duplicate|unique/i.test(eventError.message)
    ) {
      const { data: existing } = await db
        .from("founder_credits")
        .select("credits, plan")
        .eq("user_id", userId)
        .maybeSingle()
      return {
        credits: existing?.credits ?? 0,
        plan: existing?.plan ?? null,
        alreadyProcessed: true,
      }
    }
    throw new Error(eventError.message)
  }

  // 2. Upsert credits by user_id
  const { data: row } = await db
    .from("founder_credits")
    .select("credits, plan")
    .eq("user_id", userId)
    .maybeSingle()

  if (!row) {
    const { data, error } = await db
      .from("founder_credits")
      .insert([
        {
          user_id: userId,
          email,
          credits: amount,
          plan,
          updated_at: new Date().toISOString(),
        },
      ])
      .select("credits, plan")
      .single()
    if (error) throw new Error(error.message)
    return { credits: data.credits, plan: data.plan, alreadyProcessed: false }
  }

  const { data, error } = await db
    .from("founder_credits")
    .update({
      credits: row.credits + amount,
      plan,
      email,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select("credits, plan")
    .single()

  if (error) throw new Error(error.message)
  return { credits: data.credits, plan: data.plan, alreadyProcessed: false }
}

export async function useCreditForUser(
  db: SupabaseClient,
  userId: string
): Promise<{ credits: number; plan: string | null }> {
  const { data: existing, error: readError } = await db
    .from("founder_credits")
    .select("credits, plan")
    .eq("user_id", userId)
    .maybeSingle()

  if (readError) throw new Error(readError.message)
  if (!existing || existing.credits < 1) {
    const err = new Error("No validations remaining") as Error & {
      status?: number
      credits?: number
    }
    err.status = 402
    err.credits = existing?.credits ?? 0
    throw err
  }

  const { data, error } = await db
    .from("founder_credits")
    .update({
      credits: existing.credits - 1,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select("credits, plan")
    .single()

  if (error) throw new Error(error.message)
  return { credits: data.credits, plan: data.plan }
}
