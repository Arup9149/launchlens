import { NextResponse } from "next/server"
import { selectBrainEngine } from "@/lib/brain/provider"
import {
  rateLimit,
  clientIp,
  rateLimitHeaders,
  RATE_LIMITS,
} from "@/lib/security"

/**
 * Public readiness probe for the Brain. Does not expose secrets or internal URLs.
 */
export async function GET(request: Request) {
  const ip = clientIp(request)
  const rl = rateLimit(
    `health:brain:${ip}`,
    RATE_LIMITS.api.limit,
    RATE_LIMITS.api.windowMs
  )
  if (!rl.allowed) {
    return NextResponse.json(
      { online: false, ok: false, message: "Too many requests" },
      { status: 429, headers: rateLimitHeaders(rl) }
    )
  }

  const hasOR = !!process.env.OPENROUTER_API_KEY?.trim()

  try {
    const selection = selectBrainEngine()

    if (selection.engine === "openrouter") {
      return NextResponse.json(
        {
          online: true,
          ok: true,
          engine: "openrouter",
          message: "Brain online · OpenRouter",
        },
        { headers: rateLimitHeaders(rl) }
      )
    }

    try {
      const res = await fetch("http://127.0.0.1:11434/api/tags", {
        signal: AbortSignal.timeout(2000),
      })
      if (!res.ok) {
        return NextResponse.json(
          {
            online: false,
            ok: false,
            engine: "none",
            message: "Ollama is offline. Run: ollama serve",
          },
          { headers: rateLimitHeaders(rl) }
        )
      }
      const data = (await res.json()) as { models?: { name?: string }[] }
      const hasQwen = (data.models || []).some((m) =>
        String(m.name || "").includes("qwen")
      )
      return NextResponse.json(
        {
          online: true,
          ok: true,
          engine: "ollama",
          message: hasQwen
            ? "Brain online · Ollama (qwen)"
            : "Brain online · Ollama",
        },
        { headers: rateLimitHeaders(rl) }
      )
    } catch {
      return NextResponse.json(
        {
          online: false,
          ok: false,
          engine: "none",
          message: "Ollama is offline. Run: ollama serve",
        },
        { headers: rateLimitHeaders(rl) }
      )
    }
  } catch {
    const online = hasOR
    return NextResponse.json(
      {
        online,
        ok: online,
        engine: hasOR ? "openrouter" : "none",
        message: hasOR ? "Brain online · OpenRouter" : "Brain offline",
      },
      { headers: rateLimitHeaders(rl) }
    )
  }
}
