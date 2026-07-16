/**
 * Date helpers. Formatting is manual (no locale, no timezone surprises) and
 * intentionally dash free in the human output, per the copy rules.
 */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function parts(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.split('-').map(Number)
  return { y: y ?? 0, m: m ?? 0, d: d ?? 0 }
}

/** "2026-06-18" -> "18 June 2026". */
export function formatDate(iso: string): string {
  const { y, m, d } = parts(iso)
  const month = MONTHS[m - 1] ?? ''
  return `${d} ${month} ${y}`.trim()
}

/** ISO 8601 datetime for OG article tags and JSON-LD. */
export function isoDateTime(iso: string): string {
  return `${iso}T00:00:00Z`
}
