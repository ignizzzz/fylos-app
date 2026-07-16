import { type ProductUpdate } from '../content/types.ts'
import { type PageModel } from '../ui/layout.ts'
import { site } from '../site.config.ts'
import { esc } from '../lib/html.ts'
import { renderBlocks } from '../lib/blocks.ts'
import { formatDate, isoDateTime } from '../lib/dates.ts'
import { techArticleNode } from '../lib/jsonld.ts'
import { updateBadges } from '../ui/cards.ts'
import { homePath, productUpdatePath, productUpdatesIndexPath } from '../lib/urls.ts'

export function renderProductUpdate(update: ProductUpdate): PageModel {
  const main =
    `<article class="article">` +
    `<header class="article__header">` +
    `<div class="container container--narrow">` +
    `<p class="eyebrow"><a href="${esc(productUpdatesIndexPath())}">Product updates</a></p>` +
    `<div class="update-row__head">${updateBadges(update)}` +
    `<span class="update-row__date"><time datetime="${esc(update.publishedAt)}">${esc(formatDate(update.publishedAt))}</time></span>` +
    `</div>` +
    `<h1 class="article__title">${esc(update.title)}</h1>` +
    `<p class="article__standfirst">${esc(update.description)}</p>` +
    `</div>` +
    `</header>` +
    `<div class="container container--narrow">` +
    `<div class="prose">${renderBlocks(update.body)}</div>` +
    `<p class="back-link"><a href="${esc(productUpdatesIndexPath())}">Back to all updates</a></p>` +
    `</div>` +
    `</article>`

  return {
    activeNav: 'product-updates',
    seo: {
      title: update.title,
      description: update.description,
      path: productUpdatePath(update),
      type: 'article',
      article: {
        publishedTime: isoDateTime(update.publishedAt),
        modifiedTime: isoDateTime(update.publishedAt),
        authorName: site.name,
        section: 'Product updates',
      },
    },
    breadcrumbs: [
      { name: 'Home', path: homePath() },
      { name: 'Product updates', path: productUpdatesIndexPath() },
      { name: update.title, path: productUpdatePath(update) },
    ],
    jsonLd: [techArticleNode(update)],
    main,
  }
}
