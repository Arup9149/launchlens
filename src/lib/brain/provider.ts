/**
 * Brain provider selection for LaunchLens.
 * Production (Vercel): OpenRouter only when OPENROUTER_API_KEY is set.
 * Ollama is local-dev only — never contacted as a fallback after OpenRouter.
 */

import { parseAiJson } from "./json"

export type BrainEngine = "openrouter" | "ollama"

export type BrainSelection = {
  engine: BrainEngine
  endpoint: string
  reason: string
}

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
const OLLAMA_GENERATE_URL = "http://127.0.0.1:11434/api/generate"

function isServerlessHost(): boolean {
  return (
    process.env.VERCEL === "1" ||
    !!process.env.VERCEL_ENV ||
    process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined ||
    process.env.NODE_ENV === "production"
  )
}

/** Resolve which engine to use. Never falls back OpenRouter → Ollama. */
export function selectBrainEngine(): BrainSelection {
  const raw = (process.env.BRAIN_PROVIDER || "auto").toLowerCase().trim()
  const hasOR = !!process.env.OPENROUTER_API_KEY?.trim()

  if (raw === "openrouter") {
    if (!hasOR) {
      throw new Error(
        "BRAIN_PROVIDER=openrouter but OPENROUTER_API_KEY is not set"
      )
    }
    return {
      engine: "openrouter",
      endpoint: OPENROUTER_URL,
      reason: "BRAIN_PROVIDER=openrouter",
    }
  }

  if (raw === "ollama") {
    return {
      engine: "ollama",
      endpoint: OLLAMA_GENERATE_URL,
      reason: "BRAIN_PROVIDER=ollama (explicit local)",
    }
  }

  // auto
  if (hasOR) {
    return {
      engine: "openrouter",
      endpoint: OPENROUTER_URL,
      reason: "auto + OPENROUTER_API_KEY present",
    }
  }

  if (isServerlessHost()) {
    throw new Error(
      "Brain unavailable on this host: set OPENROUTER_API_KEY (Ollama is local-only)"
    )
  }

  return {
    engine: "ollama",
    endpoint: OLLAMA_GENERATE_URL,
    reason: "auto + no OpenRouter key + local host",
  }
}

export function logBrainStart(selection: BrainSelection, route: string) {
  console.info(
    JSON.stringify({
      level: "info",
      msg: "brain.request_start",
      route,
      engine: selection.engine,
      endpoint: selection.endpoint,
      reason: selection.reason,
      brainProvider: process.env.BRAIN_PROVIDER || "auto",
      hasOpenRouterKey: !!process.env.OPENROUTER_API_KEY?.trim(),
    })
  )
}

export function logBrainSuccess(
  selection: BrainSelection,
  route: string,
  extra?: Record<string, unknown>
) {
  console.info(
    JSON.stringify({
      level: "info",
      msg: "brain.request_ok",
      route,
      engine: selection.engine,
      endpoint: selection.endpoint,
      ...extra,
    })
  )
}

export function logBrainError(
  selection: BrainSelection | null,
  route: string,
  err: unknown,
  extra?: Record<string, unknown>
) {
  const e = err as Error & { cause?: unknown; status?: number }
  const cause =
    e?.cause instanceof Error
      ? { name: e.cause.name, message: e.cause.message }
      : e?.cause
        ? String(e.cause).slice(0, 300)
        : undefined

  console.error(
    JSON.stringify({
      level: "error",
      msg: "brain.request_failed",
      route,
      engine: selection?.engine,
      endpoint: selection?.endpoint,
      errorName: e?.name,
      errorMessage: (e?.message || String(err)).slice(0, 500),
      cause,
      ...extra,
    })
  )
}

export async function callOpenRouterJson(
  prompt: string,
  opts?: { system?: string; temperature?: number }
): Promise<unknown> {
  const key = process.env.OPENROUTER_API_KEY?.trim()
  if (!key) throw new Error("OPENROUTER_API_KEY missing")

  const model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat"
  const endpoint = OPENROUTER_URL

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "LaunchLens",
    },
    body: JSON.stringify({
      model,
      temperature: opts?.temperature ?? 0.4,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            opts?.system ||
            "You return only valid JSON objects. No markdown fences. No commentary before or after the JSON.",
        },
        { role: "user", content: prompt },
      ],
    }),
  })

  const bodyText = await res.text()
  if (!res.ok) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "brain.openrouter_http_error",
        endpoint,
        status: res.status,
        body: bodyText.slice(0, 400),
        model,
      })
    )
    throw new Error(
      `OpenRouter HTTP ${res.status}: ${bodyText.slice(0, 300)}`
    )
  }

  let data: { choices?: { message?: { content?: string } }[] }
  try {
    data = JSON.parse(bodyText)
  } catch {
    throw new Error(
      `OpenRouter returned non-JSON (${bodyText.slice(0, 120)})`
    )
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error("Empty OpenRouter response")
  return content
}

export async function callOllamaJson(
  prompt: string,
  opts?: { temperature?: number; numPredict?: number; timeoutMs?: number }
): Promise<string> {
  const endpoint = OLLAMA_GENERATE_URL
  const controller = new AbortController()
  const timeout = setTimeout(
    () => controller.abort(),
    opts?.timeoutMs ?? 150000
  )

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "qwen2.5:7b",
        prompt,
        stream: false,
        format: "json",
        options: {
          temperature: opts?.temperature ?? 0.4,
          num_predict: opts?.numPredict ?? 2800,
        },
      }),
      signal: controller.signal,
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Ollama error: ${text.slice(0, 200)}`)
    }

    const data = (await res.json()) as { response?: string }
    return String(data.response || "")
  } catch (err) {
    clearTimeout(timeout)
    throw err
  }
}

export { parseAiJson as parseModelJson, brainUserError, isBrainJsonError, BrainJsonError } from "./json"

/**
 * Run a JSON brain prompt with correct provider selection.
 * OpenRouter path never touches Ollama.
 */
export async function runBrainJson(
  prompt: string,
  route: string,
  opts?: {
    system?: string
    temperature?: number
    ollamaNumPredict?: number
    ollamaTimeoutMs?: number
  }
): Promise<{ data: unknown; engine: BrainEngine }> {
  const selection = selectBrainEngine()
  logBrainStart(selection, route)
  const t0 = Date.now()

  try {
    if (selection.engine === "openrouter") {
      const tAi = Date.now()
      const content = await callOpenRouterJson(prompt, {
        system: opts?.system,
        temperature: opts?.temperature,
      })
      const aiMs = Date.now() - tAi
      const tParse = Date.now()
      const data = parseAiJson(String(content))
      const parseMs = Date.now() - tParse
      logBrainSuccess(selection, route, {
        aiMs,
        parseMs,
        totalMs: Date.now() - t0,
        promptChars: prompt.length,
      })
      return { data, engine: "openrouter" }
    }

    const tAi = Date.now()
    const raw = await callOllamaJson(prompt, {
      temperature: opts?.temperature,
      numPredict: opts?.ollamaNumPredict,
      timeoutMs: opts?.ollamaTimeoutMs,
    })
    const aiMs = Date.now() - tAi
    const tParse = Date.now()
    const data = parseAiJson(raw)
    const parseMs = Date.now() - tParse
    logBrainSuccess(selection, route, {
      aiMs,
      parseMs,
      totalMs: Date.now() - t0,
      promptChars: prompt.length,
    })
    return { data, engine: "ollama" }
  } catch (err) {
    logBrainError(selection, route, err)
    throw err
  }
}
