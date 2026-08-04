/**
 * Greeting name priority:
 * 1. display name
 * 2. signup name
 * 3. email local-part
 * 4. "there"
 */
export function resolveUserGreetingName(input: {
  displayName?: string | null
  signupName?: string | null
  email?: string | null
}): string {
  const display = input.displayName?.trim()
  if (display) return display

  const signup = input.signupName?.trim()
  if (signup) return signup

  const email = input.email?.trim()
  if (email && email.includes("@")) {
    const local = email.split("@")[0]?.trim()
    if (local) {
      const token = local.split(/[._+-]/)[0] || local
      return token.charAt(0).toUpperCase() + token.slice(1)
    }
  }

  return "there"
}
