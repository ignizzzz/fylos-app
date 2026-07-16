import { type PageModel } from '../ui/layout.ts'
import { getAllProductUpdates } from '../content/index.ts'
import { updateRow } from '../ui/cards.ts'
import { collectionPageNode } from '../lib/jsonld.ts'
import { homePath, productUpdatePath, productUpdatesIndexPath } from '../lib/urls.ts'

const LEDE = 'What is new in Fylos. Features, improvements, and fixes, newest first.'

export function renderProductUpdatesIndex(): PageModel {
  const updates = getAllProductUpdates()

  const main =
    `<section class="page-hero">` +
    `<div class="container">` +
    `<p class="eyebrow">Product</p>` +
    `<h1 class="display">Product updates</h1>` +
    `<p class="lede">${LEDE}</p>` +
    `</div>` +
    `</section>` +
    `<div class="container">` +
    `<h2 class="sr-only">All product updates</h2>` +
    `<div class="card-grid">${updates.map(updateRow).join('')}</div>` +
    `</div>`

  return {
    activeNav: 'product-updates',
    seo: {
      title: 'Product updates',
      description: LEDE,
      path: productUpdatesIndexPath(),
      type: 'website',
    },
    breadcrumbs: [
      { name: 'Home', path: homePath() },
      { name: 'Product updates', path: productUpdatesIndexPath() },
    ],
    jsonLd: [
      collectionPageNode({
        name: 'Product updates',
        description: LEDE,
        path: productUpdatesIndexPath(),
        items: updates.map((u) => ({ name: u.title, path: productUpdatePath(u) })),
      }),
    ],
    main,
  }
}
