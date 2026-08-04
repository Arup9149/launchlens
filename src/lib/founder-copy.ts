/** Presentation-only labels. Backend still uses "credits". */

export function founderValidationsLabel(count: number | null): string {
  if (count === null) return "—"
  if (count === 1) return "1 Founder Validation remaining"
  return `${count} Founder Validations remaining`
}

export function founderValidationsShort(count: number | null): string {
  if (count === null) return "—"
  if (count === 1) return "1 Founder Validation"
  return `${count} Founder Validations`
}
