import { NextResponse } from "next/server"
import { runBrainJson, brainUserError } from "@/lib/brain/provider"
import { assertJsonObject } from "@/lib/brain/json"

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

    const { data, engine } = await runBrainJson(prompt, "/api/related", {
      temperature: 0.5,
      ollamaNumPredict: 1400,
      ollamaTimeoutMs: 90000,
    })

    const result = assertJsonObject(data, "related")
    const rawIdeas = Array.isArray(result.ideas) ? result.ideas : []
    const ideas = rawIdeas
      .filter((x): x is Record<string, unknown> => !!x && typeof x === "object")
      .slice(0, 5)
      .map((x) => ({
        title: String(x.title || "Untitled"),
        description: String(x.description || ""),
        angle: String(x.angle || ""),
        scope: String(x.scope || ""),
        upside: String(x.upside || ""),
      }))

    if (ideas.length === 0) {
      return NextResponse.json(
        {
          error:
            "We couldn't generate related ideas right now. Please try again.",
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ ideas, engine })
  } catch (err: any) {
    if (err?.name === "AbortError") {
      return NextResponse.json(
        { error: "Brain took too long. Try again." },
        { status: 504 }
      )
    }
    return NextResponse.json(
      { error: brainUserError(err, "We couldn't generate related ideas right now. Please try again.") },
      { status: 500 }
    )
  }
}
