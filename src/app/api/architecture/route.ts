import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { idea } = await request.json()

    if (!idea || idea.trim().length < 10) {
      return NextResponse.json({ error: "Idea is too short" }, { status: 400 })
    }

    const prompt = `You are LaunchLens Architecture Brain for indie founders.

Design a practical MVP architecture for this idea:

"""
${idea.trim()}
"""

Return ONLY valid JSON (no markdown):

{
  "potentialScore": <number 0-100>,
  "flowSteps": [
    { "title": "<step name>", "desc": "<short description>" }
  ],
  "modules": [
    {
      "name": "<module name>",
      "detail": "<what it does>",
      "tip": "<practical builder tip>"
    }
  ],
  "techStack": [
    {
      "name": "<tool or stack>",
      "type": "<category>",
      "why": "<why it fits this idea>",
      "url": "<official docs url if known, else empty string>"
    }
  ],
  "buildOrder": [
    "<step 1>",
    "<step 2>",
    "<step 3>",
    "<step 4>",
    "<step 5>",
    "<step 6>"
  ],
  "risks": [
    "<risk 1>",
    "<risk 2>",
    "<risk 3>",
    "<risk 4>"
  ],
  "metrics": [
    "<metric 1>",
    "<metric 2>",
    "<metric 3>",
    "<metric 4>"
  ],
  "thirtyDayPlan": [
    { "week": "Week 1 — Foundation", "focus": "<what to do>" },
    { "week": "Week 2 — Core Value", "focus": "<what to do>" },
    { "week": "Week 3 — Feedback", "focus": "<what to do>" },
    { "week": "Week 4 — Tighten", "focus": "<what to do>" }
  ]
}

Rules:
- Prefer simple indie-friendly stack (Next.js, Supabase, Razorpay when payments matter, Vercel).
- 5 flow steps.
- 6 to 8 modules.
- 5 to 7 tech stack items.
- Be specific to THIS idea, not generic.
- Keep language practical and founder-oriented.`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000)

    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5:7b",
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.35,
          num_predict: 2000,
        },
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!ollamaRes.ok) {
      return NextResponse.json(
        { error: "Brain is offline. Is Ollama running?" },
        { status: 500 }
      )
    }

    const data = await ollamaRes.json()
    let result: any

    try {
      result = JSON.parse(data.response)
    } catch {
      const match = String(data.response || "").match(/\{[\s\S]*\}/)
      if (match) result = JSON.parse(match[0])
      else throw new Error("Could not parse Brain response")
    }

    const clamp = (n: any, fb = 60) => {
      const v = Number(n)
      if (Number.isNaN(v)) return fb
      return Math.max(0, Math.min(100, Math.round(v)))
    }

    return NextResponse.json({
      potentialScore: clamp(result.potentialScore, 65),
      flowSteps: Array.isArray(result.flowSteps) ? result.flowSteps.slice(0, 5) : [],
      modules: Array.isArray(result.modules) ? result.modules.slice(0, 8) : [],
      techStack: Array.isArray(result.techStack) ? result.techStack.slice(0, 7) : [],
      buildOrder: Array.isArray(result.buildOrder) ? result.buildOrder.slice(0, 6) : [],
      risks: Array.isArray(result.risks) ? result.risks.slice(0, 4) : [],
      metrics: Array.isArray(result.metrics) ? result.metrics.slice(0, 4) : [],
      thirtyDayPlan: Array.isArray(result.thirtyDayPlan)
        ? result.thirtyDayPlan.slice(0, 4)
        : [],
    })
  } catch (err: any) {
    console.error(err)
    if (err?.name === "AbortError") {
      return NextResponse.json(
        { error: "Brain took too long. Try a shorter idea." },
        { status: 504 }
      )
    }
    return NextResponse.json(
      { error: err.message || "Architecture generation failed" },
      { status: 500 }
    )
  }
}