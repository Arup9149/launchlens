import { NextResponse } from "next/server"
import { selectBrainEngine } from "@/lib/brain/provider"

export async function GET() {
  const hasOR = !!process.env.OPENROUTER_API_KEY?.trim()
  const provider = (process.env.BRAIN_PROVIDER || "auto").toLowerCase()

  try {
    const selection = selectBrainEngine()

    if (selection.engine === "openrouter") {
      return NextResponse.json({
        online: true,
        ok: true, // legacy alias used by older clients
        engine: "openrouter",
        endpoint: selection.endpoint,
        reason: selection.reason,
        message: "Brain online · OpenRouter",
      })
    }

    try {
      const res = await fetch("http://127.0.0.1:11434/api/tags", {
        signal: AbortSignal.timeout(2000),
      })
      if (!res.ok) {
        return NextResponse.json({
          online: false,
          ok: false,
          engine: "none",
          message: "Ollama is offline. Run: ollama serve",
        })
      }
      const data = (await res.json()) as { models?: { name?: string }[] }
      const hasQwen = (data.models || []).some((m) =>
        String(m.name || "").includes("qwen")
      )
      return NextResponse.json({
        online: true,
        ok: true,
        engine: "ollama",
        message: hasQwen
          ? "Brain online · Ollama (qwen)"
          : "Brain online · Ollama",
      })
    } catch {
      return NextResponse.json({
        online: false,
        ok: false,
        engine: "none",
        message: "Ollama is offline. Run: ollama serve",
      })
    }
  } catch (err: any) {
    const online = hasOR
    return NextResponse.json({
      online,
      ok: online,
      engine: hasOR ? "openrouter" : "none",
      message: hasOR
        ? "Brain online · OpenRouter"
        : err?.message || "Brain offline",
      provider,
    })
  }
}
