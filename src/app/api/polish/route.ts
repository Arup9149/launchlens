import { NextResponse } from "next/server"

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

    const prompt = `You are LaunchLens Brain — an expert at sharpening indie product ideas.

The founder is polishing this idea. Improve clarity and sharpness. Be practical.

Original idea:
"""
${original}
"""

Current fields:
- Problem: ${problem || "(empty)"}
- ICP: ${icp || "(empty)"}
- Wedge: ${wedge || "(empty)"}
- Pricing: ${pricing || "(empty)"}

Return ONLY valid JSON (no markdown):

{
  "polishedProblem": "<improved problem statement, 1-2 sentences>",
  "polishedIcp": "<sharper ideal customer profile>",
  "polishedWedge": "<clearer differentiation>",
  "polishedPricing": "<practical pricing direction>",
  "summary": "<one tight paragraph describing the refined idea>",
  "score": <number 0-100>,
  "confidence": <number 0-100>,
  "tips": [
    "<actionable tip 1>",
    "<actionable tip 2>",
    "<actionable tip 3>"
  ],
  "breakdown": {
    "marketDemand": <0-100>,
    "competitionGap": <0-100>,
    "feasibility": <0-100>,
    "timing": <0-100>,
    "monetization": <0-100>
  }
}

Be honest. If the idea is weak, say so through lower scores and direct tips.`

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 90000)

    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5:7b",
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.4,
          num_predict: 1000,
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

    const clamp = (n: any, fb = 50) => {
      const v = Number(n)
      if (Number.isNaN(v)) return fb
      return Math.max(0, Math.min(100, Math.round(v)))
    }

    return NextResponse.json({
      polishedProblem: result.polishedProblem || problem || "",
      polishedIcp: result.polishedIcp || icp || "",
      polishedWedge: result.polishedWedge || wedge || "",
      polishedPricing: result.polishedPricing || pricing || "",
      summary: result.summary || "",
      score: clamp(result.score, 62),
      confidence: clamp(result.confidence, 70),
      tips: Array.isArray(result.tips) ? result.tips.slice(0, 4) : [],
      breakdown: {
        marketDemand: clamp(result.breakdown?.marketDemand, 60),
        competitionGap: clamp(result.breakdown?.competitionGap, 55),
        feasibility: clamp(result.breakdown?.feasibility, 70),
        timing: clamp(result.breakdown?.timing, 60),
        monetization: clamp(result.breakdown?.monetization, 55),
      },
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
      { error: err.message || "Polish failed" },
      { status: 500 }
    )
  }
}