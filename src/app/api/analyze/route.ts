import { NextResponse } from "next/server"

function clamp(n: any, fallback = 50) {
  const v = Number(n)
  if (Number.isNaN(v)) return fallback
  return Math.max(0, Math.min(100, Math.round(v)))
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

function parseJson(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    const match = String(text || "").match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error("Could not parse Brain response")
  }
}

async function callOpenRouter(prompt: string) {
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error("OPENROUTER_API_KEY missing")

  const model =
    process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat"

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
      temperature: 0.4,
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
          temperature: 0.4,
          num_predict: 2800,
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
    return { analysis: await callOpenRouter(prompt), engine: "openrouter" }
  }

  if (provider === "ollama") {
    return { analysis: await callOllama(prompt), engine: "ollama" }
  }

  // auto
  if (hasOR) {
    try {
      return { analysis: await callOpenRouter(prompt), engine: "openrouter" }
    } catch (err) {
      console.error("OpenRouter failed, trying Ollama", err)
      return { analysis: await callOllama(prompt), engine: "ollama-fallback" }
    }
  }

  return { analysis: await callOllama(prompt), engine: "ollama" }
}

export async function POST(request: Request) {
  try {
    const { idea } = await request.json()

    if (!idea || idea.trim().length < 10) {
      return NextResponse.json({ error: "Idea is too short" }, { status: 400 })
    }

    const prompt = buildPrompt(idea)
    const { analysis, engine } = await runBrain(prompt)

    return NextResponse.json({
      analysis: normalize(analysis),
      engine,
    })
  } catch (err: any) {
    console.error(err)

    if (err?.name === "AbortError") {
      return NextResponse.json(
        { error: "Brain took too long. Retry." },
        { status: 504 }
      )
    }

    return NextResponse.json(
      {
        error:
          err?.message?.includes("ECONNREFUSED") ||
          err?.message?.includes("fetch failed")
            ? "Brain offline. Set OPENROUTER_API_KEY or start Ollama."
            : err.message || "Analysis failed",
      },
      { status: 500 }
    )
  }
}