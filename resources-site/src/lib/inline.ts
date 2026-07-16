/**
 * A tiny, safe inline formatter. It scans raw text left to right and escapes as
 * it emits, so markup characters are handled structurally and everything else
 * is HTML escaped. Supported syntax, deliberately small:
 *
 *   **bold**        -> <strong>
 *   _italic_        -> <em>
 *   `code`          -> <code>
 *   [label](href)   -> <a href> (href is scheme-checked; unsafe links become text)
 *
 * There is no raw HTML passthrough: content can never inject markup.
 */
import { esc } from './html.ts'

const CODE = /^`([^`]+)`/
// The href allows one level of balanced parentheses, so URLs like
// .../Cat_(animal) are captured whole instead of truncating at the first ")".
const LINK = /^\[([^\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)\)/
const BOLD = /^\*\*([^*]+)\*\*/
// Italic requires the closing "_" not to be followed by a word character, so
// snake_case identifiers and underscores inside URLs are left alone. The
// opening boundary is enforced by the scanner (prev char must be a non-word).
const ITALIC = /^_([^\s_](?:[^_]*[^\s_])?)_(?![A-Za-z0-9_])/
const WORD = /[A-Za-z0-9_]/

/** Allow only safe URL shapes. Returns the URL if safe, otherwise null. */
function safeUrl(url: string): string | null {
  const u = url.trim()
  return /^(?:https?:\/\/|mailto:|\/|#)/i.test(u) ? u : null
}

function renderLink(label: string, url: string): string {
  const safe = safeUrl(url)
  const text = esc(label)
  if (!safe) return text
  const external = /^https?:\/\//i.test(safe)
  const rel = external ? ' rel="noopener noreferrer"' : ''
  return `<a href="${esc(safe)}"${rel}>${text}</a>`
}

export function formatInline(text: string): string {
  let out = ''
  let i = 0
  while (i < text.length) {
    const rest = text.slice(i)

    const code = CODE.exec(rest)
    if (code) {
      out += `<code>${esc(code[1] as string)}</code>`
      i += code[0].length
      continue
    }

    const link = LINK.exec(rest)
    if (link) {
      out += renderLink(link[1] as string, link[2] as string)
      i += link[0].length
      continue
    }

    const bold = BOLD.exec(rest)
    if (bold) {
      out += `<strong>${formatInline(bold[1] as string)}</strong>`
      i += bold[0].length
      continue
    }

    // Only start italic at a left word boundary (start of string or a preceding
    // non-word character), so mid-word underscores never trigger emphasis.
    const prev = i > 0 ? (text[i - 1] as string) : ''
    if (prev === '' || !WORD.test(prev)) {
      const italic = ITALIC.exec(rest)
      if (italic) {
        out += `<em>${formatInline(italic[1] as string)}</em>`
        i += italic[0].length
        continue
      }
    }

    out += esc(text[i] as string)
    i += 1
  }
  return out
}

/** Plain-text version of inline content, for meta descriptions and JSON-LD. */
export function stripInline(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\(((?:[^\s()]|\([^\s()]*\))+)\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/(^|[^A-Za-z0-9_])_([^\s_](?:[^_]*[^\s_])?)_(?![A-Za-z0-9_])/g, '$1$2')
}
