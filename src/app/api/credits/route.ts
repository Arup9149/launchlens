import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

function supabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")?.trim().toLowerCase()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const { data, error } = await supabase()
      .from("founder_credits")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      email,
      credits: data?.credits ?? 0,
      plan: data?.plan ?? null,
    })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = String(body.email || "")
      .trim()
      .toLowerCase()
    const action = body.action as "grant" | "use"
    const amount = Number(body.amount || 0)
    const plan = body.plan || "early_bird"

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    }

    const db = supabase()
    const { data: existing } = await db
      .from("founder_credits")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (action === "grant") {
      const add = amount > 0 ? amount : 2
      if (!existing) {
        const { data, error } = await db
          .from("founder_credits")
          .insert([{ email, credits: add, plan }])
          .select()
          .single()
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
        return NextResponse.json({ credits: data.credits, plan: data.plan })
      }

      const { data, error } = await db
        .from("founder_credits")
        .update({
          credits: existing.credits + add,
          plan,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ credits: data.credits, plan: data.plan })
    }

    if (action === "use") {
      if (!existing || existing.credits < 1) {
        return NextResponse.json(
          { error: "No validations remaining", credits: existing?.credits ?? 0 },
          { status: 402 }
        )
      }

      const { data, error } = await db
        .from("founder_credits")
        .update({
          credits: existing.credits - 1,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      return NextResponse.json({ credits: data.credits, plan: data.plan })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}