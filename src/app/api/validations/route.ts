import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import {
  rateLimit,
  rateLimitHeaders,
  RATE_LIMITS,
  sanitizeText,
  IDEA_MAX,
  safeLog,
} from "@/lib/security"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }

    const rl = rateLimit(
      `api:validations:${user.id}`,
      RATE_LIMITS.api.limit,
      RATE_LIMITS.api.windowMs
    )
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429, headers: rateLimitHeaders(rl) }
      )
    }

    const body = await request.json().catch(() => ({}))
    const idea = sanitizeText(body.idea, IDEA_MAX)

    if (!idea || idea.length < 3) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("validations")
      .insert([
        {
          idea,
          score: body.score ?? null,
          verdict: body.verdict ?? null,
          confidence: body.confidence ?? null,
          analysis: body.analysis ?? null,
          user_id: user.id,
        },
      ])
      .select("id")
      .single()

    if (error) {
      safeLog("error", "validations.insert_failed", { code: error.code })
      return NextResponse.json(
        { error: "Could not save validation" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, id: data?.id },
      { headers: rateLimitHeaders(rl) }
    )
  } catch {
    safeLog("error", "validations.unhandled")
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
