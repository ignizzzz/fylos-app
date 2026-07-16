/**
 * Builds the per-page SEO head: title, description, canonical, robots, Open
 * Graph, and Twitter card. Everything is derived from the route path and the
 * site config, so canonical and og:url can never drift apart.
 */
import { absoluteUrl, site } from '../site.config.ts'
import { attrs, esc } from './html.ts'

export interface SeoImage {
  src: string
  alt: string
  width?: number
  height?: number
}

export interface SeoArticleMeta {
  publishedTime?: string
  modifiedTime?: string
  authorName?: string
  section?: string
  tags?: string[]
}

export interface SeoInput {
  /** Page title, without the brand suffix (added here). */
  title: string
  description: string
  /** Canonical route path, root-relative (e.g. "/resources/"). */
  path: string
  type?: 'website' | 'article'
  image?: SeoImage
  robots?: 'index' | 'noindex'
  article?: SeoArticleMeta
}

function composedTitle(title: string): string {
  return title === site.name ? site.name : `${title} · ${site.name}`
}

function metaTag(nameOrProp: 'name' | 'property', key: string, content: string): string {
  return `<meta${attrs({ [nameOrProp]: key, content })}>`
}

export function renderHead(input: SeoInput): string {
  const canonical = absoluteUrl(input.path)
  const image = input.image ?? site.defaultShareImage
  const imageUrl = absoluteUrl(image.src)
  const type = input.type ?? 'website'
  const indexable = (input.robots ?? 'index') === 'index'

  const robotsContent = indexable
    ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    : 'noindex, nofollow'

  const lines: string[] = [
    `<title>${esc(composedTitle(input.title))}</title>`,
    metaTag('name', 'description', input.description),
    metaTag('name', 'robots', robotsContent),
  ]

  // A canonical on a noindex page (e.g. 404) is a mixed signal, so only
  // indexable pages get one.
  if (indexable) {
    lines.push(`<link rel="canonical" href="${esc(canonical)}">`)
  }

  lines.push(
    // Open Graph
    metaTag('property', 'og:type', type),
    metaTag('property', 'og:site_name', site.name),
    metaTag('property', 'og:locale', site.locale === 'en' ? 'en_US' : site.locale),
    metaTag('property', 'og:title', input.title),
    metaTag('property', 'og:description', input.description),
    metaTag('property', 'og:url', canonical),
    metaTag('property', 'og:image', imageUrl),
    metaTag('property', 'og:image:alt', image.alt),
  )

  if (image.width) lines.push(metaTag('property', 'og:image:width', String(image.width)))
  if (image.height) lines.push(metaTag('property', 'og:image:height', String(image.height)))

  // Article specifics
  if (type === 'article' && input.article) {
    const a = input.article
    if (a.publishedTime) lines.push(metaTag('property', 'article:published_time', a.publishedTime))
    if (a.modifiedTime) lines.push(metaTag('property', 'article:modified_time', a.modifiedTime))
    if (a.authorName) lines.push(metaTag('property', 'article:author', a.authorName))
    if (a.section) lines.push(metaTag('property', 'article:section', a.section))
    for (const tag of a.tags ?? []) lines.push(metaTag('property', 'article:tag', tag))
  }

  // Twitter
  lines.push(
    metaTag('name', 'twitter:card', 'summary_large_image'),
    metaTag('name', 'twitter:title', input.title),
    metaTag('name', 'twitter:description', input.description),
    metaTag('name', 'twitter:image', imageUrl),
    metaTag('name', 'twitter:image:alt', image.alt),
  )
  if (site.twitterHandle) {
    lines.push(metaTag('name', 'twitter:site', site.twitterHandle))
  }

  return lines.join('\n')
}
