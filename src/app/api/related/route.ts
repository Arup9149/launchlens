import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { idea } = await request.json()

    if (!idea || idea.trim().length < 10) {
      return NextResponse.json({ error: "Idea is too short" }, { status: 400 })
    }

    const prompt = `You are LaunchLens Brain. Expand this product idea into adjacent and broader opportunities for an indie founder.

Idea:
"""
${idea.trim()}
"""

Return ONLY valid JSON (no markdown):

{
  "ideas": [
    {
      "title": "<short name>",
      "description": "<2-3 sentences explaining the opportunity>",
      "angle": "<why this angle is interesting>",
      "scope": "<who / how large the reachable segment is, without using the word money>",
      "upside": "<what improves if they pursue this>"
    }
  ]
}

Generate exactly 5 ideas. Make them practical and distinct from each other.
Prefer:
1. Vertical / niche version
2. Upstream problem
3. Downstream execution tool
4. Community or data layer
5. Done-with-you / premium service version

Be specific to the given idea. No generic filler.`

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
          temperature: 0.5,
          num_predict: 1400,
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

    const ideas = Array.isArray(result.ideas) ? result.ideas.slice(0, 5) : []

    return NextResponse.json({ ideas })
  } catch (err: any) {
    console.error(err)
    if (err?.name === "AbortError") {
      return NextResponse.json(
        { error: "Brain took too long. Try again." },
        { status: 504 }
      )
    }
    return NextResponse.json(
      { error: err.message || "Related ideas failed" },
      { status: 500 }
    )
  }
}