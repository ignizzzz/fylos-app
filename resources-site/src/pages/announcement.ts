import { type Announcement } from '../content/types.ts'
import { type PageModel } from '../ui/layout.ts'
import { site } from '../site.config.ts'
import { getAuthor } from '../content/index.ts'
import { esc } from '../lib/html.ts'
import { renderBlocks } from '../lib/blocks.ts'
import { formatDate, isoDateTime } from '../lib/dates.ts'
import { newsArticleNode } from '../lib/jsonld.ts'
import { announcementPath, announcementsIndexPath, homePath } from '../lib/urls.ts'

export function renderAnnouncement(announcement: Announcement): PageModel {
  const author = getAuthor(announcement.authorId)
  const authorName = author?.name ?? site.name
  const dateline = announcement.location
    ? `${announcement.location}, ${formatDate(announcement.publishedAt)}`
    : formatDate(announcement.publishedAt)

  const main =
    `<article class="article">` +
    `<header class="article__header">` +
    `<div class="container container--narrow">` +
    `<p class="eyebrow"><a href="${esc(announcementsIndexPath())}">Announcements</a></p>` +
    `<h1 class="article__title">${esc(announcement.title)}</h1>` +
    `<p class="article__standfirst">${esc(announcement.description)}</p>` +
    `<p class="byline"><span class="byline__by">${esc(authorName)}</span> <span class="dot" aria-hidden="true"></span> ` +
    `<time datetime="${esc(announcement.publishedAt)}">${esc(dateline)}</time></p>` +
    `</div>` +
    `</header>` +
    `<div class="container container--narrow">` +
    `<div class="prose">${renderBlocks(announcement.body)}</div>` +
    `<p class="back-link"><a href="${esc(announcementsIndexPath())}">Back to all announcements</a></p>` +
    `</div>` +
    `</article>`

  return {
    activeNav: 'company',
    seo: {
      title: announcement.title,
      description: announcement.description,
      path: announcementPath(announcement),
      type: 'article',
      image: announcement.hero,
      article: {
        publishedTime: isoDateTime(announcement.publishedAt),
        modifiedTime: isoDateTime(announcement.updatedAt ?? announcement.publishedAt),
        authorName,
        section: 'Company',
      },
    },
    breadcrumbs: [
      { name: 'Home', path: homePath() },
      { name: 'Announcements', path: announcementsIndexPath() },
      { name: announcement.title, path: announcementPath(announcement) },
    ],
    jsonLd: author ? [newsArticleNode(announcement, author)] : [],
    main,
  }
}
