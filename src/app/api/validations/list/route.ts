import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("validations")
      .select("id, idea, score, verdict, confidence, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json({ error: "Could not load validations" }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
