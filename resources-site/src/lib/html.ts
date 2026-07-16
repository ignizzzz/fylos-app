/**
 * HTML safety primitives. Every piece of dynamic text rendered into a page must
 * pass through `esc` (element text / attribute values) or the inline formatter
 * (which escapes first, then adds a small, fixed set of markup). Nothing else
 * writes user content into the HTML.
 */

const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Escape a string for use as element text or a quoted attribute value. */
export function esc(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch] as string)
}

/**
 * Build an attribute list from a map. Undefined/null/false values are dropped;
 * `true` renders a bare boolean attribute. Values are escaped.
 */
export function attrs(map: Record<string, string | number | boolean | undefined | null>): string {
  const parts: string[] = []
  for (const [key, value] of Object.entries(map)) {
    if (value === undefined || value === null || value === false) continue
    if (value === true) {
      parts.push(key)
      continue
    }
    parts.push(`${key}="${esc(String(value))}"`)
  }
  return parts.length ? ` ${parts.join(' ')}` : ''
}
