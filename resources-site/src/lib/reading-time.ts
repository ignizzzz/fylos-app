import { type Block } from '../content/types.ts'
import { stripInline } from './inline.ts'

const WORDS_PER_MINUTE = 200

function blockWords(block: Block): number {
  const count = (s: string): number => {
    const words = stripInline(s).trim().split(/\s+/).filter(Boolean)
    return words.length
  }
  switch (block.type) {
    case 'heading':
    case 'paragraph':
      return count(block.text)
    case 'list':
      return block.items.reduce((n, item) => n + count(item), 0)
    case 'quote':
      return count(block.text)
    case 'callout':
      return count(block.text) + (block.title ? count(block.title) : 0)
    case 'image':
      return block.caption ? count(block.caption) : 0
    case 'divider':
      return 0
  }
}

/** Estimated read time in whole minutes, at least 1. */
export function readingMinutes(body: Block[]): number {
  const words = body.reduce((n, b) => n + blockWords(b), 0)
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

export function readingLabel(body: Block[]): string {
  return `${readingMinutes(body)} min read`
}
