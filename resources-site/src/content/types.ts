/**
 * Typed local content model.
 *
 * This is deliberately plain, serialisable data (no classes, no runtime deps),
 * so the whole layer can be swapped for a backend or a CMS later without
 * touching the templates: a loader just has to return these same shapes.
 *
 * Article bodies are a typed array of content blocks rather than a markdown
 * string. That keeps the "typed" promise end to end and avoids shipping a
 * fragile markdown parser. Inline emphasis inside text fields uses a tiny, safe
 * inline syntax (see lib/inline.ts).
 */

/** An ISO date, `YYYY-MM-DD`. Validated at build time. */
export type IsoDate = string

export interface ImageRef {
  /** Root-relative path (e.g. `/resources/assets/x.svg`) or absolute URL. */
  src: string
  /** Required alt text. Empty string is only allowed for decorative images. */
  alt: string
  width?: number
  height?: number
}

export interface Author {
  id: string
  name: string
  /** Job title / role, shown in the byline. */
  role: string
  bio?: string
  avatar?: ImageRef
}

export interface Category {
  slug: string
  /** Short human name, e.g. "Pet health". */
  name: string
  /** SEO title override for the category page. Falls back to `name`. */
  title?: string
  /** One-line summary, used on cards and as the meta description. */
  description: string
  /** Longer intro paragraph for the category hero. */
  intro?: string
}

/** A block of article/announcement/update body content. Discriminated union. */
export type Block =
  | { type: 'heading'; level: 2 | 3; text: string; id?: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; ordered?: boolean; items: string[] }
  | { type: 'quote'; text: string; cite?: string }
  | { type: 'callout'; tone?: 'note' | 'warm' | 'coming-soon'; title?: string; text: string }
  | { type: 'image'; image: ImageRef; caption?: string }
  | { type: 'divider' }

export interface Article {
  slug: string
  /** Must match an existing Category slug. Validated at build time. */
  categorySlug: string
  /** SEO title, used for the `<title>`, the visible h1, og:title, and JSON-LD. */
  title: string
  /** Meta description and card summary. Keep <= 160 chars. */
  description: string
  publishedAt: IsoDate
  updatedAt?: IsoDate
  /** Must match an existing Author id. Validated at build time. */
  authorId: string
  tags: string[]
  hero?: ImageRef
  /** At most one article should be featured on the hub. */
  featured?: boolean
  body: Block[]
}

export type UpdateKind = 'feature' | 'improvement' | 'fix'

export interface ProductUpdate {
  slug: string
  /** Optional version label, e.g. "1.4". */
  version?: string
  title: string
  description: string
  publishedAt: IsoDate
  /** Change categories, rendered as chips. */
  kinds: UpdateKind[]
  body: Block[]
}

export interface Announcement {
  slug: string
  title: string
  description: string
  publishedAt: IsoDate
  updatedAt?: IsoDate
  authorId: string
  /** Optional dateline location, e.g. "Zurich". */
  location?: string
  hero?: ImageRef
  body: Block[]
}
