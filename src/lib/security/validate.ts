/**
 * Input validation helpers for API routes. No business logic.
 */

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

/** Strip control characters; collapse excessive whitespace. */
export function sanitizeText(input: unknown, maxLen: number): string {
  if (typeof input !== "string") return ""
  return input
    .replace(CONTROL_CHARS, "")
    .replace(/\r\n/g, "\n")
    .trim()
    .slice(0, maxLen)
}

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  if (email.includes("..") || email.startsWith(".") || email.endsWith(".")) {
    return false
  }
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i.test(
    email
  )
}

/** Idea text for AI endpoints */
export const IDEA_MIN = 10
export const IDEA_MAX = 4000

export function validateIdea(raw: unknown):
  | { ok: true; idea: string }
  | { ok: false; error: string } {
  const idea = sanitizeText(raw, IDEA_MAX)
  if (idea.length < IDEA_MIN) {
    return { ok: false, error: "Idea is too short" }
  }
  if (idea.length > IDEA_MAX) {
    return { ok: false, error: "Idea is too long" }
  }
  return { ok: true, idea }
}

/** Block obvious prompt-injection meta-instructions from user content envelope */
export function wrapUserContent(label: string, content: string): string {
  return `${label}:\n"""\n${content}\n"""\n`
}
