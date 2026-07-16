/**
 * Card components. Warm white cards on cream, a soft chip with a coral line
 * icon, a serif title, and a quiet meta line, matching the marketing site's
 * card language. The whole card is clickable via a stretched link on the title.
 */
import {
  type Announcement,
  type Article,
  type Category,
  type ProductUpdate,
  type UpdateKind,
} from '../content/types.ts'
import { getCategory } from '../content/index.ts'
import { esc } from '../lib/html.ts'
import { formatDate } from '../lib/dates.ts'
import { readingLabel } from '../lib/reading-time.ts'
import { categoryIcon, icon } from './icons.ts'
import {
  announcementPath,
  articlePath,
  categoryPath,
  productUpdatePath,
} from '../lib/urls.ts'

export const KIND_LABEL: Record<UpdateKind, string> = {
  feature: 'New',
  improvement: 'Improved',
  fix: 'Fixed',
}

function dateMeta(iso: string, extra?: string): string {
  const time = `<time datetime="${esc(iso)}">${esc(formatDate(iso))}</time>`
  return extra ? `${time} <span class="sep" aria-hidden="true">&middot;</span> ${esc(extra)}` : time
}

/** Version tag + change-kind tags for a product update. */
export function updateBadges(update: ProductUpdate): string {
  const version = update.version
    ? `<span class="tag tag--version">v${esc(update.version)}</span>`
    : ''
  const chips = update.kinds
    .map((k) => `<span class="tag tag--${esc(k)}">${esc(KIND_LABEL[k])}</span>`)
    .join('')
  return version + chips
}

/** The lead story on the hub: a wide card with a soft icon panel. */
export function featuredCard(article: Article): string {
  const category = getCategory(article.categorySlug)
  const cat = category ? ` <span class="card__eyebrow-cat">${esc(category.name)}</span>` : ''
  return (
    `<article class="card card--featured">` +
    `<div class="card--featured__panel">${categoryIcon(article.categorySlug)}</div>` +
    `<div class="card--featured__body">` +
    `<p class="card__eyebrow">Featured read${cat}</p>` +
    `<h2 class="card__title card__title--lg"><a class="stretch" href="${esc(articlePath(article))}">${esc(article.title)}</a></h2>` +
    `<p class="card__desc">${esc(article.description)}</p>` +
    `<p class="card__meta">${dateMeta(article.publishedAt, readingLabel(article.body))}</p>` +
    `<span class="card__cue" aria-hidden="true">Read the guide</span>` +
    `</div>` +
    `</article>`
  )
}

/** An article card in a grid. */
export function articleCard(article: Article): string {
  const category = getCategory(article.categorySlug)
  const kicker = category ? `<p class="card__kicker">${esc(category.name)}</p>` : ''
  return (
    `<article class="card">` +
    `<div class="card__top">${categoryIcon(article.categorySlug)}${kicker}</div>` +
    `<h3 class="card__title"><a class="stretch" href="${esc(articlePath(article))}">${esc(article.title)}</a></h3>` +
    `<p class="card__desc">${esc(article.description)}</p>` +
    `<p class="card__meta">${dateMeta(article.publishedAt, readingLabel(article.body))}</p>` +
    `</article>`
  )
}

/** A category card in a grid. */
export function categoryCard(category: Category, count: number): string {
  const label = count === 1 ? '1 guide' : `${count} guides`
  return (
    `<article class="card card--topic">` +
    `<div class="card__top">${categoryIcon(category.slug)}<span class="card__count">${esc(label)}</span></div>` +
    `<h3 class="card__title"><a class="stretch" href="${esc(categoryPath(category.slug))}">${esc(category.name)}</a></h3>` +
    `<p class="card__desc">${esc(category.description)}</p>` +
    `</article>`
  )
}

export function updateRow(update: ProductUpdate): string {
  return (
    `<article class="card card--update">` +
    `<div class="card__top">${icon('spark')}<div class="card__tags">${updateBadges(update)}</div></div>` +
    `<h3 class="card__title"><a class="stretch" href="${esc(productUpdatePath(update))}">${esc(update.title)}</a></h3>` +
    `<p class="card__desc">${esc(update.description)}</p>` +
    `<p class="card__meta">${dateMeta(update.publishedAt)}</p>` +
    `</article>`
  )
}

export function announcementCard(announcement: Announcement): string {
  const dateline = announcement.location
    ? `${announcement.location}, ${formatDate(announcement.publishedAt)}`
    : formatDate(announcement.publishedAt)
  return (
    `<article class="card">` +
    `<div class="card__top">${icon('flag')}<p class="card__kicker">Announcement</p></div>` +
    `<h3 class="card__title"><a class="stretch" href="${esc(announcementPath(announcement))}">${esc(announcement.title)}</a></h3>` +
    `<p class="card__desc">${esc(announcement.description)}</p>` +
    `<p class="card__meta"><time datetime="${esc(announcement.publishedAt)}">${esc(dateline)}</time></p>` +
    `</article>`
  )
}

export function relatedArticles(articles: Article[]): string {
  if (articles.length === 0) return ''
  const cards = articles.map(articleCard).join('')
  return (
    `<aside class="related" aria-labelledby="related-heading">` +
    `<h2 id="related-heading" class="section-heading">Keep reading</h2>` +
    `<div class="card-grid">${cards}</div>` +
    `</aside>`
  )
}

/** The article byline. */
export function byline(authorName: string, iso: string, updatedIso: string | undefined, readLabel: string): string {
  const updated = updatedIso && updatedIso !== iso
    ? ` <span class="sep" aria-hidden="true">&middot;</span> Updated <time datetime="${esc(updatedIso)}">${esc(formatDate(updatedIso))}</time>`
    : ''
  return (
    `<p class="byline">` +
    `<span class="byline__by">By ${esc(authorName)}</span> <span class="sep" aria-hidden="true">&middot;</span> ` +
    `<time datetime="${esc(iso)}">${esc(formatDate(iso))}</time>` +
    updated +
    ` <span class="sep" aria-hidden="true">&middot;</span> ${esc(readLabel)}` +
    `</p>`
  )
}
