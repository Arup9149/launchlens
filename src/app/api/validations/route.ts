import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const body = await request.json()
    const { idea, score, verdict, confidence, analysis } = body

    if (!idea || typeof idea !== "string" || idea.trim().length < 3) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("validations")
      .insert([
        {
          idea: idea.trim(),
          score: score ?? null,
          verdict: verdict ?? null,
          confidence: confidence ?? null,
          analysis: analysis ?? null,
          user_id: user.id,
        },
      ])
      .select("id")
      .single()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
