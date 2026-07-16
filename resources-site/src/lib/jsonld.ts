/**
 * JSON-LD structured data builders. Each returns a plain node; `jsonLdScript`
 * combines nodes into a single `@graph` and serialises them safely for
 * embedding inside a <script type="application/ld+json"> tag.
 */
import { absoluteUrl, site } from '../site.config.ts'
import {
  type Announcement,
  type Article,
  type Author,
  type Category,
  type ProductUpdate,
} from '../content/types.ts'
import { type LinkItem, articlePath, announcementPath, productUpdatePath } from './urls.ts'
import { isoDateTime } from './dates.ts'

export type JsonLd = Record<string, unknown>

const ORG_ID = absoluteUrl('/#organization')
const WEBSITE_ID = absoluteUrl('/#website')
const HOME = `${site.siteUrl}/`

export function organizationNode(): JsonLd {
  const node: JsonLd = {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.organization.name,
    legalName: site.organization.legalName,
    url: HOME,
    logo: { '@type': 'ImageObject', url: absoluteUrl(site.organization.logo) },
  }
  if (site.organization.sameAs.length) node['sameAs'] = [...site.organization.sameAs]
  return node
}

export function websiteNode(): JsonLd {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: site.name,
    url: HOME,
    publisher: { '@id': ORG_ID },
    inLanguage: site.locale,
  }
}

export function breadcrumbNode(items: LinkItem[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  }
}

function authorNode(author: Author): JsonLd {
  // The bylines are collective (team, care desk), so Organization is the honest
  // type here rather than inventing a Person.
  return { '@type': 'Organization', name: author.name, url: HOME }
}

export function blogPostingNode(article: Article, author: Author, category: Category): JsonLd {
  const url = absoluteUrl(articlePath(article))
  const image = absoluteUrl(article.hero?.src ?? site.defaultShareImage.src)
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: url,
    headline: article.title,
    description: article.description,
    image: [image],
    datePublished: isoDateTime(article.publishedAt),
    dateModified: isoDateTime(article.updatedAt ?? article.publishedAt),
    author: authorNode(author),
    publisher: { '@id': ORG_ID },
    articleSection: category.name,
    keywords: article.tags.join(', '),
    inLanguage: site.locale,
  }
}

export function newsArticleNode(announcement: Announcement, author: Author): JsonLd {
  const url = absoluteUrl(announcementPath(announcement))
  const image = absoluteUrl(announcement.hero?.src ?? site.defaultShareImage.src)
  return {
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: url,
    headline: announcement.title,
    description: announcement.description,
    image: [image],
    datePublished: isoDateTime(announcement.publishedAt),
    dateModified: isoDateTime(announcement.updatedAt ?? announcement.publishedAt),
    author: authorNode(author),
    publisher: { '@id': ORG_ID },
    inLanguage: site.locale,
  }
}

export function techArticleNode(update: ProductUpdate): JsonLd {
  const url = absoluteUrl(productUpdatePath(update))
  const node: JsonLd = {
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: url,
    headline: update.title,
    description: update.description,
    image: [absoluteUrl(site.defaultShareImage.src)],
    datePublished: isoDateTime(update.publishedAt),
    dateModified: isoDateTime(update.publishedAt),
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    inLanguage: site.locale,
  }
  if (update.version) node['version'] = update.version
  return node
}

export function collectionPageNode(input: {
  name: string
  description: string
  path: string
  items: LinkItem[]
}): JsonLd {
  const url = absoluteUrl(input.path)
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    url,
    name: input.name,
    description: input.description,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: site.locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: input.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(it.path),
        name: it.name,
      })),
    },
  }
}

/** Serialise safely for embedding in a <script> tag. Escapes the characters
 * that could break out of the script element or a JSON string. */
function serialize(data: unknown): string {
  return JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, (ch) =>
    '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'),
  )
}

export function jsonLdScript(nodes: JsonLd[]): string {
  const graph = { '@context': 'https://schema.org', '@graph': nodes }
  return `<script type="application/ld+json">${serialize(graph)}</script>`
}
