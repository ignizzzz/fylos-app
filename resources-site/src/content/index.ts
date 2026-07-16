/**
 * The typed content API. Everything the templates need to read content goes
 * through here, so swapping the local data for a backend or CMS later means
 * reimplementing these functions, not touching the pages.
 */
import {
  type Announcement,
  type Article,
  type Author,
  type Block,
  type Category,
  type ProductUpdate,
} from './types.ts'
import { authors } from './authors.ts'
import { categories } from './categories.ts'
import { articles } from './articles/index.ts'
import { productUpdates } from './product-updates.ts'
import { announcements } from './announcements.ts'

// ---- sorting -------------------------------------------------------------

function byNewest<T extends { publishedAt: string }>(a: T, b: T): number {
  return a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0
}

// ---- categories ----------------------------------------------------------

export function getAllCategories(): Category[] {
  return [...categories]
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

// ---- authors -------------------------------------------------------------

export function getAuthor(id: string): Author | undefined {
  return authors.find((a) => a.id === id)
}

// ---- articles ------------------------------------------------------------

export function getAllArticles(): Article[] {
  return [...articles].sort(byNewest)
}

export function getArticle(categorySlug: string, slug: string): Article | undefined {
  return articles.find((a) => a.categorySlug === categorySlug && a.slug === slug)
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return getAllArticles().filter((a) => a.categorySlug === categorySlug)
}

export function getFeaturedArticle(): Article | undefined {
  return getAllArticles().find((a) => a.featured) ?? getAllArticles()[0]
}

/**
 * Related articles for a given article. Scored by shared category (strong) and
 * shared tags (each), newest as the tie breaker. Falls back to the newest other
 * articles so the slot is never empty.
 */
export function getRelatedArticles(article: Article, limit = 3): Article[] {
  const tagSet = new Set(article.tags)
  const scored = getAllArticles()
    .filter((a) => !(a.categorySlug === article.categorySlug && a.slug === article.slug))
    .map((a) => {
      let score = 0
      if (a.categorySlug === article.categorySlug) score += 3
      for (const tag of a.tags) if (tagSet.has(tag)) score += 1
      return { article: a, score }
    })
    .sort((x, y) => (y.score - x.score) || byNewest(x.article, y.article))
  return scored.slice(0, limit).map((s) => s.article)
}

// ---- product updates -----------------------------------------------------

export function getAllProductUpdates(): ProductUpdate[] {
  return [...productUpdates].sort(byNewest)
}

export function getProductUpdate(slug: string): ProductUpdate | undefined {
  return productUpdates.find((u) => u.slug === slug)
}

// ---- announcements -------------------------------------------------------

export function getAllAnnouncements(): Announcement[] {
  return [...announcements].sort(byNewest)
}

export function getAnnouncement(slug: string): Announcement | undefined {
  return announcements.find((a) => a.slug === slug)
}

// ---- validation ----------------------------------------------------------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
// Em dash, en dash, horizontal bar, figure dash: banned in user-facing copy.
const BANNED_DASHES = /[‒–—―]/
// Any emoji / pictographic character: banned in user-facing copy.
const EMOJI = /\p{Extended_Pictographic}/u
const RESERVED_SLUGS = new Set(['assets', 'sitemap.xml', 'robots.txt'])

export interface ContentIssues {
  errors: string[]
  warnings: string[]
}

function textOfBlocks(blocks: Block[]): string[] {
  const out: string[] = []
  for (const b of blocks) {
    switch (b.type) {
      case 'heading':
      case 'paragraph':
        out.push(b.text)
        break
      case 'list':
        out.push(...b.items)
        break
      case 'quote':
        out.push(b.text)
        if (b.cite) out.push(b.cite)
        break
      case 'callout':
        out.push(b.text)
        if (b.title) out.push(b.title)
        break
      case 'image':
        out.push(b.image.alt)
        if (b.caption) out.push(b.caption)
        break
      case 'divider':
        break
    }
  }
  return out
}

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false
  const [y, m, d] = value.split('-').map(Number)
  if (y === undefined || m === undefined || d === undefined) return false
  // Reject impossible calendar dates: Date normalizes overflow (e.g. 2026-13-40),
  // so round-trip and require the components to survive unchanged.
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
}

/**
 * Validate the whole content set. Called at the start of the build so a bad
 * entry fails loudly instead of producing broken pages. Errors block the build,
 * warnings are printed but allowed.
 */
export function validateContent(): ContentIssues {
  const errors: string[] = []
  const warnings: string[] = []

  const check = (label: string, strings: string[]): void => {
    for (const s of strings) {
      if (BANNED_DASHES.test(s)) {
        errors.push(`${label}: em/en dash is banned in copy. Use a comma. Text: "${s.slice(0, 80)}"`)
      }
      if (EMOJI.test(s)) {
        errors.push(`${label}: emoji is banned in copy. Text: "${s.slice(0, 80)}"`)
      }
    }
  }

  // Categories.
  const catSlugs = new Set<string>()
  for (const c of categories) {
    if (!SLUG.test(c.slug)) errors.push(`category "${c.slug}": invalid slug`)
    if (RESERVED_SLUGS.has(c.slug)) errors.push(`category "${c.slug}": reserved slug`)
    if (catSlugs.has(c.slug)) errors.push(`duplicate category slug "${c.slug}"`)
    catSlugs.add(c.slug)
    check(`category "${c.slug}"`, [c.name, c.description, c.title ?? '', c.intro ?? ''])
  }

  // Authors.
  const authorIds = new Set<string>()
  for (const a of authors) {
    if (authorIds.has(a.id)) errors.push(`duplicate author id "${a.id}"`)
    authorIds.add(a.id)
    check(`author "${a.id}"`, [a.name, a.role, a.bio ?? ''])
  }

  // Articles.
  const articleKeys = new Set<string>()
  for (const a of articles) {
    const label = `article "${a.slug}"`
    if (!SLUG.test(a.slug)) errors.push(`${label}: invalid slug`)
    if (RESERVED_SLUGS.has(a.slug)) errors.push(`${label}: reserved slug`)
    const key = `${a.categorySlug}/${a.slug}`
    if (articleKeys.has(key)) errors.push(`duplicate article path "${key}"`)
    articleKeys.add(key)
    if (!catSlugs.has(a.categorySlug)) errors.push(`${label}: unknown category "${a.categorySlug}"`)
    if (!authorIds.has(a.authorId)) errors.push(`${label}: unknown author "${a.authorId}"`)
    if (!isValidIsoDate(a.publishedAt)) errors.push(`${label}: bad publishedAt "${a.publishedAt}"`)
    if (a.updatedAt && !isValidIsoDate(a.updatedAt)) errors.push(`${label}: bad updatedAt "${a.updatedAt}"`)
    if (a.description.length > 160) {
      warnings.push(`${label}: description is ${a.description.length} chars (aim for <= 160)`)
    }
    if (a.hero && a.hero.alt.trim() === '') warnings.push(`${label}: hero image has empty alt`)
    check(label, [a.title, a.description, a.hero?.alt ?? '', ...a.tags, ...textOfBlocks(a.body)])
  }
  const featuredCount = articles.filter((a) => a.featured).length
  if (featuredCount > 1) warnings.push(`${featuredCount} articles are featured; only the newest is used on the hub`)

  // Product updates.
  const updateSlugs = new Set<string>()
  for (const u of productUpdates) {
    const label = `product-update "${u.slug}"`
    if (!SLUG.test(u.slug)) errors.push(`${label}: invalid slug`)
    if (updateSlugs.has(u.slug)) errors.push(`duplicate product-update slug "${u.slug}"`)
    updateSlugs.add(u.slug)
    if (!isValidIsoDate(u.publishedAt)) errors.push(`${label}: bad publishedAt "${u.publishedAt}"`)
    if (u.description.length > 160) warnings.push(`${label}: description is ${u.description.length} chars`)
    check(label, [u.title, u.description, u.version ?? '', ...textOfBlocks(u.body)])
  }

  // Announcements.
  const annSlugs = new Set<string>()
  for (const a of announcements) {
    const label = `announcement "${a.slug}"`
    if (!SLUG.test(a.slug)) errors.push(`${label}: invalid slug`)
    if (annSlugs.has(a.slug)) errors.push(`duplicate announcement slug "${a.slug}"`)
    annSlugs.add(a.slug)
    if (!authorIds.has(a.authorId)) errors.push(`${label}: unknown author "${a.authorId}"`)
    if (!isValidIsoDate(a.publishedAt)) errors.push(`${label}: bad publishedAt "${a.publishedAt}"`)
    if (a.updatedAt && !isValidIsoDate(a.updatedAt)) errors.push(`${label}: bad updatedAt "${a.updatedAt}"`)
    if (a.description.length > 160) warnings.push(`${label}: description is ${a.description.length} chars`)
    check(label, [a.title, a.description, a.location ?? '', a.hero?.alt ?? '', ...textOfBlocks(a.body)])
  }

  return { errors, warnings }
}
