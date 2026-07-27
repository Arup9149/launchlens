import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("http://localhost:11434/api/tags", {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    })

    if (!res.ok) {
      return NextResponse.json({ ok: false, message: "Ollama not responding" })
    }

    const data = await res.json()
    const models = (data.models || []).map((m: any) => m.name)
    const hasQwen = models.some((n: string) => n.includes("qwen2.5:7b") || n.includes("qwen2.5"))

    return NextResponse.json({
      ok: true,
      hasQwen,
      models,
      message: hasQwen ? "Brain online" : "Ollama online, but qwen2.5:7b not found",
    })
  } catch {
    return NextResponse.json({
      ok: false,
      message: "Ollama is offline. Run: ollama serve",
    })
  }
}