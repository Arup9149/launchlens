import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { idea } = await request.json()

    if (!idea || idea.trim().length < 10) {
      return NextResponse.json({ error: "Idea is too short" }, { status: 400 })
    }

    const prompt = `You are LaunchLens Brain, an expert analyst for indie SaaS and mobile product ideas.

Analyze the idea below for a solo founder or small team. Be honest, specific, and practical. Avoid hype.

Return ONLY valid JSON with this exact shape (no markdown, no extra text):

{
  "score": <number 0-100>,
  "verdict": "Go" | "Pivot" | "Kill",
  "confidence": <number 0-100>,
  "verdictNote": "<one short sentence>",
  "demand": "<2-4 sentences on real demand signals, who wants this, and how strong the need is>",
  "competition": "<2-4 sentences on existing alternatives, how crowded it is, and where differentiation is possible>",
  "risks": "<2-4 sentences on the biggest risks, assumptions, and what could kill this>",
  "nextSteps": "<3-5 concrete next actions, each on a new line, numbered>",
  "breakdown": {
    "marketDemand": <number 0-100>,
    "competitionGap": <number 0-100>,
    "feasibility": <number 0-100>,
    "timing": <number 0-100>,
    "monetization": <number 0-100>
  }
}

Scoring guide:
- 80-100 = strong opportunity with clear path
- 60-79 = possible but needs a sharper wedge or pivot
- below 60 = weak demand, heavy competition, or hard to monetize as an indie

Idea:
"""
${idea.trim()}
"""`

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
          temperature: 0.35,
          num_predict: 1200,
        },
      }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!ollamaRes.ok) {
      const text = await ollamaRes.text()
      console.error("Ollama error:", text)
      return NextResponse.json(
        { error: "Brain is offline. Make sure Ollama is running with qwen2.5:7b." },
        { status: 500 }
      )
    }

    const data = await ollamaRes.json()
    let analysis: any

    try {
      analysis = JSON.parse(data.response)
    } catch {
      const match = String(data.response || "").match(/\{[\s\S]*\}/)
      if (match) {
        analysis = JSON.parse(match[0])
      } else {
        throw new Error("Could not parse Brain response")
      }
    }

    // Normalize + safety clamps
    const clamp = (n: any, fallback = 50) => {
      const v = Number(n)
      if (Number.isNaN(v)) return fallback
      return Math.max(0, Math.min(100, Math.round(v)))
    }

    const verdictRaw = String(analysis.verdict || "Pivot")
    const verdict =
      verdictRaw === "Go" || verdictRaw === "Kill" ? verdictRaw : "Pivot"

    const normalized = {
      score: clamp(analysis.score, 60),
      verdict,
      confidence: clamp(analysis.confidence, 65),
      verdictNote:
        analysis.verdictNote ||
        (verdict === "Go"
          ? "Promising signals with a workable path"
          : verdict === "Kill"
          ? "Weak opportunity for an indie team right now"
          : "Potential exists but needs a clearer wedge"),
      demand: analysis.demand || "Demand signals could not be fully assessed.",
      competition:
        analysis.competition || "Competitive landscape could not be fully assessed.",
      risks: analysis.risks || "Key risks could not be fully assessed.",
      nextSteps:
        analysis.nextSteps ||
        "1. Talk to 5 potential users\n2. Sharpen the core problem\n3. Test a thin landing page",
      breakdown: {
        marketDemand: clamp(analysis.breakdown?.marketDemand, 60),
        competitionGap: clamp(analysis.breakdown?.competitionGap, 55),
        feasibility: clamp(analysis.breakdown?.feasibility, 70),
        timing: clamp(analysis.breakdown?.timing, 60),
        monetization: clamp(analysis.breakdown?.monetization, 55),
      },
    }

    return NextResponse.json({ analysis: normalized })
  } catch (err: any) {
    console.error(err)

    if (err?.name === "AbortError") {
      return NextResponse.json(
        { error: "Brain took too long. Try a shorter idea or check Ollama." },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: err.message || "Analysis failed" },
      { status: 500 }
    )
  }
}