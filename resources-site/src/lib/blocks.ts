/**
 * Render a typed content body to semantic, accessible HTML. All text runs
 * through the inline formatter (which escapes), so no raw markup can leak in.
 */
import { type Block } from '../content/types.ts'
import { attrs, esc } from './html.ts'
import { formatInline } from './inline.ts'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

const COMING_SOON_LABEL: Record<string, string> = {
  'coming-soon': 'Coming soon',
}

function renderBlock(block: Block): string {
  switch (block.type) {
    case 'heading': {
      const id = block.id ?? slugify(block.text)
      const tag = `h${block.level}`
      return `<${tag} id="${esc(id)}">${formatInline(block.text)}</${tag}>`
    }
    case 'paragraph':
      return `<p>${formatInline(block.text)}</p>`
    case 'list': {
      const tag = block.ordered ? 'ol' : 'ul'
      const items = block.items.map((item) => `<li>${formatInline(item)}</li>`).join('')
      return `<${tag}>${items}</${tag}>`
    }
    case 'quote': {
      const cite = block.cite ? `<cite>${formatInline(block.cite)}</cite>` : ''
      return `<blockquote><p>${formatInline(block.text)}</p>${cite}</blockquote>`
    }
    case 'callout': {
      const tone = block.tone ?? 'note'
      const label = COMING_SOON_LABEL[tone]
      const kicker = label ? `<p class="callout__kicker">${esc(label)}</p>` : ''
      const title = block.title ? `<p class="callout__title">${formatInline(block.title)}</p>` : ''
      return (
        `<aside class="callout callout--${esc(tone)}">` +
        kicker +
        title +
        `<p class="callout__body">${formatInline(block.text)}</p>` +
        `</aside>`
      )
    }
    case 'image': {
      const img = `<img${attrs({
        src: block.image.src,
        alt: block.image.alt,
        width: block.image.width,
        height: block.image.height,
        loading: 'lazy',
        decoding: 'async',
      })}>`
      const caption = block.caption ? `<figcaption>${formatInline(block.caption)}</figcaption>` : ''
      return `<figure class="prose-figure">${img}${caption}</figure>`
    }
    case 'divider':
      return '<hr>'
  }
}

export function renderBlocks(body: Block[]): string {
  return body.map(renderBlock).join('\n')
}
