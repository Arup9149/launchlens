/**
 * Shared AI response JSON layer.
 * One parser · one repair path · safe for all Brain routes.
 * Never throw raw JSON.parse messages to clients.
 */

export class BrainJsonError extends Error {
  readonly code = "BRAIN_JSON_INVALID" as const
  readonly rawPreview: string

  constructor(message: string, rawPreview = "") {
    super(message)
    this.name = "BrainJsonError"
    this.rawPreview = rawPreview.slice(0, 500)
  }
}

/** Strip markdown fences and common model chatter around JSON. */
export function stripModelJson(raw: string): string {
  let s = String(raw ?? "").trim()
  if (!s) return s

  // Remove ```json ... ``` or ``` ... ```
  s = s.replace(/^```(?:json|JSON)?\s*/i, "").replace(/\s*```$/i, "")
  s = s.replace(/```json/gi, "").replace(/```/g, "")

  // Drop leading prose before first { or [
  const obj = s.indexOf("{")
  const arr = s.indexOf("[")
  let start = -1
  if (obj >= 0 && arr >= 0) start = Math.min(obj, arr)
  else start = Math.max(obj, arr)
  if (start > 0) s = s.slice(start)

  // Drop trailing prose after last } or ]
  const lastObj = s.lastIndexOf("}")
  const lastArr = s.lastIndexOf("]")
  const end = Math.max(lastObj, lastArr)
  if (end >= 0 && end < s.length - 1) s = s.slice(0, end + 1)

  return s.trim()
}

/** Cheap structural repairs for common LLM JSON mistakes. */
export function repairModelJson(text: string): string {
  let s = text.trim()

  // Smart quotes → ASCII
  s = s.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
  s = s.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")

  // Trailing commas before } or ]
  s = s.replace(/,\s*([}\]])/g, "$1")

  // Replace common JS-style single-quoted keys: 'key': → "key":
  s = s.replace(/'([A-Za-z0-9_]+)'\s*:/g, '"$1":')

  // Bare keys without quotes: { key: → { "key":
  s = s.replace(/([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:/g, '$1"$2":')

  // Python-ish booleans / null
  s = s.replace(/\bTrue\b/g, "true").replace(/\bFalse\b/g, "false")
  s = s.replace(/\bNone\b/g, "null")

  // Balance braces if truncated (append closers only when opens dominate)
  const opens = (s.match(/\{/g) || []).length
  const closes = (s.match(/\}/g) || []).length
  if (opens > closes) s = s + "}".repeat(opens - closes)

  const openArr = (s.match(/\[/g) || []).length
  const closeArr = (s.match(/\]/g) || []).length
  if (openArr > closeArr) s = s + "]".repeat(openArr - closeArr)

  return s
}

function tryParse(text: string): unknown | undefined {
  try {
    return JSON.parse(text)
  } catch {
    return undefined
  }
}

/**
 * Parse model output into JSON.
 * 1) strip fences / prose
 * 2) JSON.parse
 * 3) one safe repair + JSON.parse
 * Throws BrainJsonError (stable message) — never raw parser exceptions.
 */
export function parseAiJson(raw: string): unknown {
  const cleaned = stripModelJson(raw)
  if (!cleaned) {
    throw new BrainJsonError("Empty model response", raw)
  }

  const first = tryParse(cleaned)
  if (first !== undefined) return first

  // Extract largest object/array substring once more
  const match = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
  if (match) {
    const second = tryParse(match[0])
    if (second !== undefined) return second

    const repaired = repairModelJson(match[0])
    const third = tryParse(repaired)
    if (third !== undefined) return third
  }

  const repairedAll = repairModelJson(cleaned)
  const fourth = tryParse(repairedAll)
  if (fourth !== undefined) return fourth

  console.error(
    JSON.stringify({
      level: "error",
      msg: "brain.json_parse_failed",
      preview: cleaned.slice(0, 400),
    })
  )

  throw new BrainJsonError(
    "We couldn't process the Brain response. Please try again.",
    cleaned
  )
}

/** Ensure value is a plain object (not array/null). */
export function assertJsonObject(
  data: unknown,
  label = "response"
): Record<string, unknown> {
  if (data === null || typeof data !== "object" || Array.isArray(data)) {
    throw new BrainJsonError(`Expected JSON object for ${label}`)
  }
  return data as Record<string, unknown>
}

export function isBrainJsonError(err: unknown): err is BrainJsonError {
  return err instanceof BrainJsonError || (err as any)?.code === "BRAIN_JSON_INVALID"
}

/** User-facing message for any Brain failure (no raw parser leaks). */
export function brainUserError(err: unknown, fallback: string): string {
  if (isBrainJsonError(err)) {
    return "We couldn't generate results right now. Please try again."
  }
  const msg = err instanceof Error ? err.message : String(err || "")
  if (
    msg.includes("OPENROUTER") ||
    msg.includes("Brain unavailable") ||
    msg.includes("OPENROUTER_API_KEY")
  ) {
    return "Brain is temporarily unavailable. Please try again shortly."
  }
  if ((err as any)?.name === "AbortError" || msg.includes("took too long")) {
    return "Brain took too long. Please try again."
  }
  // Never leak JSON.parse / position errors
  if (/JSON|position \d+|Unexpected token|Expected property/i.test(msg)) {
    return "We couldn't generate results right now. Please try again."
  }
  if (msg && msg.length < 160 && !/at position|stack|Error:/i.test(msg)) {
    return msg
  }
  return fallback
}
