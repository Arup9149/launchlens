import { NextResponse } from "next/server"
import { runBrainJson } from "@/lib/brain/provider"

function clamp(n: any, fallback = 50) {
  const v = Number(n)
  if (Number.isNaN(v)) return fallback
  return Math.max(0, Math.min(100, Math.round(v))
}

function normalize(analysis: any) {
  const verdictRaw = String(analysis.verdict || "Pivot")
  const verdict =
    verdictRaw === "Go" || verdictRaw === "Kill" ? verdictRaw : "Pivot"

  return {
    score: clamp(analysis.score, 60),
    verdict,
    confidence: clamp(analysis.confidence, 65),
    verdictNote:
      analysis.verdictNote ||
      "You need a clearer proof path before treating this as a full build.",
    demand:
      analysis.demand ||
      "Demand depth was incomplete. Retry with a clearer problem and ICP.",
    competition:
      analysis.competition ||
      "Competition depth was incomplete. List 5 alternatives manually.",
    risks:
      analysis.risks ||
      "Risk depth was incomplete. Write your top 5 assumptions and test one this week.",
    nextSteps:
      analysis.nextSteps ||
      "1. Clarify the core problem in one sentence.\n2. Name 10 ideal users.\n3. Message 5 of them.\n4. Document current workarounds.\n5. Test willingness to pay.\n6. Decide Go or Pivot in 7 days.",
    builderTips: Array.isArray(analysis.builderTips)
      ? analysis.builderTips.slice(0, 4)
      : [],
    breakdown: {
      marketDemand: clamp(analysis.breakdown?.marketDemand, 60),
      competitionGap: clamp(analysis.breakdown?.competitionGap, 55),
      feasibility: clamp(analysis.breakdown?.feasibility, 70),
      timing: clamp(analysis.breakdown?.timing, 60),
      monetization: clamp(analysis.breakdown?.monetization, 55),
    },
  }
}

function buildPrompt(idea: string) {
  return `You are LaunchLens Brain — a senior product co-founder speaking directly to an indie builder.

CRITICAL LENGTH RULES:
- demand, competition, risks: each MUST be 8 to 12 full sentences.
- nextSteps: exactly 6 numbered steps, each step 2 sentences.
- Do NOT write short 2-3 line answers. Be specific to THIS idea.
- Use "you / your idea" voice.
- Include 2 pointing lines per long section.

Idea:
"""
${idea.trim()}
"""

Return ONLY valid JSON:

{
  "score": <0-100>,
  "verdict": "Go" | "Pivot" | "Kill",
  "confidence": <0-100>,
  "verdictNote": "<2 sentences to the founder>",
  "demand": "<8-12 sentences>",
  "competition": "<8-12 sentences>",
  "risks": "<8-12 sentences>",
  "nextSteps": "1. ...\\n2. ...\\n3. ...\\n4. ...\\n5. ...\\n6. ...",
  "builderTips": ["<tip1>", "<tip2>", "<tip3>", "<tip4>"],
  "breakdown": {
    "marketDemand": <0-100>,
    "competitionGap": <0-100>,
    "feasibility": <0-100>,
    "timing": <0-100>,
    "monetization": <0-100>
  }
}`
}

export async function POST(request: Request) {
  try {
    const { idea } = await request.json()

    if (!idea || idea.trim().length < 10) {
      return NextResponse.json({ error: "Idea is too short" }, { status: 400 })
    }

    const prompt = buildPrompt(idea)
    const { data, engine } = await runBrainJson(prompt, "/api/analyze", {
      temperature: 0.4,
      ollamaNumPredict: 2800,
      ollamaTimeoutMs: 150000,
    })

    return NextResponse.json({
      analysis: normalize(data),
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
            : err?.message || "Analysis failed",
      },
      { status: 500 }
    )
  }
}
