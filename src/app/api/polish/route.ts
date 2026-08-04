import { NextResponse } from "next/server"
import { runBrainJson } from "@/lib/brain/provider"

function clamp(n: any, fb = 50) {
  const v = Number(n)
  if (Number.isNaN(v)) return fb
  return Math.max(0, Math.min(100, Math.round(v)))
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

function normalize(result: any) {
  return {
    polishedProblem: result.polishedProblem || "",
    polishedIcp: result.polishedIcp || "",
    polishedWedge: result.polishedWedge || "",
    polishedPricing: result.polishedPricing || "",
    summary: result.summary || "",
    score: clamp(result.score, 65),
    confidence: clamp(result.confidence, 60),
    tips: Array.isArray(result.tips) ? result.tips.slice(0, 6) : [],
    breakdown: {
      marketDemand: clamp(result.breakdown?.marketDemand, 60),
      competitionGap: clamp(result.breakdown?.competitionGap, 55),
      feasibility: clamp(result.breakdown?.feasibility, 70),
      timing: clamp(result.breakdown?.timing, 60),
      monetization: clamp(result.breakdown?.monetization, 55),
    },
  }
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

    const prompt = buildPrompt({ original, problem, icp, wedge, pricing })
    const { data, engine } = await runBrainJson(prompt, "/api/polish", {
      temperature: 0.4,
      ollamaNumPredict: 2200,
      ollamaTimeoutMs: 120000,
    })

    return NextResponse.json({
      result: normalize(data),
      engine,
    })
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return NextResponse.json(
        { error: "Brain took too long. Retry." },
        { status: 504 }
      )
    }
    return NextResponse.json(
      {
        error:
          err?.message?.includes("OPENROUTER") ||
          err?.message?.includes("Brain unavailable")
            ? "Brain is temporarily unavailable. Please try again shortly."
            : err?.message || "Polish failed",
      },
      { status: 500 }
    )
  }
}
