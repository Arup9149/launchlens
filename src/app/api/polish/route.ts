import { NextResponse } from "next/server"

function clamp(n: any, fb = 50) {
  const v = Number(n)
  if (Number.isNaN(v)) return fb
  return Math.max(0, Math.min(100, Math.round(v)))
}

function parseJson(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    const match = String(text || "").match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error("Could not parse Brain response")
  }
}

function buildPrompt(body: {
  original: string
  problem?: string
  icp?: string
  wedge?: string
  pricing?: string
}) {
  return `You are LaunchLens Brain in Polishing Garage mode.

Write like a sharp co-founder. Be specific to this idea. No short filler.

Original idea:
"""
${body.original}
"""

Current fields:
- Problem: ${body.problem || "(empty)"}
- ICP: ${body.icp || "(empty)"}
- Wedge: ${body.wedge || "(empty)"}
- Pricing: ${body.pricing || "(empty)"}

LENGTH RULES:
- polishedProblem, polishedIcp, polishedWedge, polishedPricing: each 2-4 rich sentences.
- summary: 8-10 sentences.
- tips: exactly 6 tips, each tip 2 sentences.

Return ONLY valid JSON:

{
  "polishedProblem": "<2-4 sentences>",
  "polishedIcp": "<2-4 sentences>",
  "polishedWedge": "<2-4 sentences>",
  "polishedPricing": "<2-4 sentences>",
  "summary": "<8-10 sentences>",
  "score": <0-100>,
  "confidence": <0-100>,
  "tips": [
    "<tip1 two sentences>",
    "<tip2 two sentences>",
    "<tip3 two sentences>",
    "<tip4 two sentences>",
    "<tip5 two sentences>",
    "<tip6 two sentences>"
  ],
  "breakdown": {
    "marketDemand": <0-100>,
    "competitionGap": <0-100>,
    "feasibility": <0-100>,
    "timing": <0-100>,
    "monetization": <0-100>
  }
}`
}

async function callOpenRouter(prompt: string) {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error("OPENROUTER_API_KEY missing")

  const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat"

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "LaunchLens",
    },
    body: JSON.stringify({
      model,
      temperature: 0.45,
      messages: [
        {
          role: "system",
          content:
            "You return only valid JSON. No markdown fences. No extra commentary.",
        },
        { role: "user", content: prompt },
      ],
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`OpenRouter error: ${errText.slice(0, 300)}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("Empty OpenRouter response")
  return parseJson(content)
}

async function callOllama(prompt: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 150000)

  try {
    const res = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5:7b",
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.45,
          num_predict: 2600,
        },
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Ollama error: ${text.slice(0, 200)}`)
    }

    const data = await res.json()
    return parseJson(data.response)
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}

async function runBrain(prompt: string) {
  const provider = (process.env.BRAIN_PROVIDER || "auto").toLowerCase()
  const hasOR = !!process.env.OPENROUTER_API_KEY

  if (provider === "openrouter") {
    return { result: await callOpenRouter(prompt), engine: "openrouter" }
  }
  if (provider === "ollama") {
    return { result: await callOllama(prompt), engine: "ollama" }
  }
  if (hasOR) {
    try {
      return { result: await callOpenRouter(prompt), engine: "openrouter" }
    } catch (err) {
      console.error("OpenRouter polish failed, Ollama fallback", err)
      return { result: await callOllama(prompt), engine: "ollama-fallback" }
    }
  }
  return { result: await callOllama(prompt), engine: "ollama" }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { original, problem, icp, wedge, pricing } = body

    if (!original || original.trim().length < 10) {
      return NextResponse.json(
        { error: "Original idea is required" },
        { status: 400 }
      )
    }

    const prompt = buildPrompt({
      original,
      problem,
      icp,
      wedge,
      pricing,
    })

    const { result, engine } = await runBrain(prompt)

    return NextResponse.json({
      polishedProblem: result.polishedProblem || problem || "",
      polishedIcp: result.polishedIcp || icp || "",
      polishedWedge: result.polishedWedge || wedge || "",
      polishedPricing: result.polishedPricing || pricing || "",
      summary: result.summary || "",
      score: clamp(result.score, 62),
      confidence: clamp(result.confidence, 70),
      tips: Array.isArray(result.tips) ? result.tips.slice(0, 6) : [],
      breakdown: {
        marketDemand: clamp(result.breakdown?.marketDemand, 60),
        competitionGap: clamp(result.breakdown?.competitionGap, 55),
        feasibility: clamp(result.breakdown?.feasibility, 70),
        timing: clamp(result.breakdown?.timing, 60),
        monetization: clamp(result.breakdown?.monetization, 55),
      },
      engine,
    })
  } catch (err: any) {
    console.error(err)
    if (err?.name === "AbortError") {
      return NextResponse.json(
        { error: "Brain took too long. Try again." },
        { status: 504 }
      )
    }
    return NextResponse.json(
      {
        error:
          err?.message?.includes("OPENROUTER") ||
          err?.message?.includes("Ollama")
            ? err.message
            : err.message || "Polish failed",
      },
      { status: 500 }
    )
  }
}