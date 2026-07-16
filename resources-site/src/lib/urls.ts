/**
 * Route path builders. These return root-relative, directory-style paths with a
 * trailing slash, which is what the generator writes to disk (one folder per
 * route with an index.html) and what canonical URLs are built from. Keeping all
 * paths in one place means the route shape is defined once.
 */
import { type Announcement, type Article, type ProductUpdate } from '../content/types.ts'

/** A named link to a route. Shared by breadcrumbs and structured-data lists. */
export interface LinkItem {
  name: string
  path: string
}

export function homePath(): string {
  return '/'
}

export function resourcesIndexPath(): string {
  return '/resources/'
}

export function categoryPath(categorySlug: string): string {
  return `/resources/${categorySlug}/`
}

export function articlePath(article: Pick<Article, 'categorySlug' | 'slug'>): string {
  return `/resources/${article.categorySlug}/${article.slug}/`
}

export function productUpdatesIndexPath(): string {
  return '/product-updates/'
}

export function productUpdatePath(update: Pick<ProductUpdate, 'slug'>): string {
  return `/product-updates/${update.slug}/`
}

export function announcementsIndexPath(): string {
  return '/company/announcements/'
}

export function announcementPath(a: Pick<Announcement, 'slug'>): string {
  return `/company/announcements/${a.slug}/`
}

/** Map a route path to the file it is written to under the output directory. */
export function outputFileForPath(path: string): string {
  const clean = path.replace(/^\/+/, '').replace(/\/+$/, '')
  return clean === '' ? 'index.html' : `${clean}/index.html`
}
