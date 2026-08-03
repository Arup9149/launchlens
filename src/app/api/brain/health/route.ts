import { NextResponse } from "next/server"

export async function GET() {
  const hasOR = !!process.env.OPENROUTER_API_KEY
  const provider = (process.env.BRAIN_PROVIDER || "auto").toLowerCase()

  // OpenRouter configured → treat Brain as online for product use
  if (provider === "openrouter" && hasOR) {
    return NextResponse.json({
      ok: true,
      engine: "openrouter",
      message: "Brain online · OpenRouter",
    })
  }

  if (provider === "auto" && hasOR) {
    return NextResponse.json({
      ok: true,
      engine: "openrouter",
      message: "Brain online · OpenRouter (auto)",
    })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    const res = await fetch("http://127.0.0.1:11434/api/tags", {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    })
    clearTimeout(timeout)

    if (!res.ok) {
      return NextResponse.json({
        ok: hasOR,
        engine: hasOR ? "openrouter" : "none",
        message: hasOR
          ? "OpenRouter ready (Ollama down)"
          : "Ollama error. Add OPENROUTER_API_KEY or fix Ollama.",
      })
    }

    const data = await res.json()
    const models: string[] = (data.models || []).map((m: any) => m.name || "")
    const hasQwen = models.some((n) => n.includes("qwen2.5"))

    return NextResponse.json({
      ok: hasQwen || hasOR,
      engine: hasQwen ? "ollama" : hasOR ? "openrouter" : "none",
      hasQwen,
      message: hasQwen
        ? "Brain online · Ollama qwen2.5"
        : hasOR
        ? "OpenRouter ready"
        : "No Brain available",
    })
  } catch {
    return NextResponse.json({
      ok: hasOR,
      engine: hasOR ? "openrouter" : "none",
      message: hasOR
        ? "Brain online · OpenRouter"
        : "Ollama offline. Add OPENROUTER_API_KEY for cloud Brain.",
    })
  }
}