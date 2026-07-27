import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { idea, score, verdict, confidence, analysis } = body

    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { data, error } = await supabase
      .from("validations")
      .insert([
        {
          idea,
          score: score ?? null,
          verdict: verdict ?? null,
          confidence: confidence ?? null,
          analysis: analysis ?? null,
        },
      ])
      .select("id")
      .single()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}