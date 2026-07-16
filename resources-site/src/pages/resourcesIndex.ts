import { type PageModel } from '../ui/layout.ts'
import {
  getAllCategories,
  getArticlesByCategory,
  getAllArticles,
  getFeaturedArticle,
} from '../content/index.ts'
import { articleCard, categoryCard, featuredCard } from '../ui/cards.ts'
import { collectionPageNode } from '../lib/jsonld.ts'
import { articlePath, homePath, resourcesIndexPath } from '../lib/urls.ts'

const LEDE =
  'Practical, honest guides to keeping your pet healthy, safe, and happy, from the team building Fylos.'

export function renderResourcesIndex(): PageModel {
  const featured = getFeaturedArticle()
  const categories = getAllCategories()
  const latest = getAllArticles().filter((a) => a.slug !== featured?.slug || a.categorySlug !== featured?.categorySlug)

  const categoryCards = categories
    .map((c) => categoryCard(c, getArticlesByCategory(c.slug).length))
    .join('')
  const latestCards = latest.map(articleCard).join('')

  const main =
    `<section class="page-hero">` +
    `<div class="container">` +
    `<p class="eyebrow">Fylos resources</p>` +
    `<h1 class="display">Guides for real, everyday pet care</h1>` +
    `<p class="lede">${LEDE}</p>` +
    `</div>` +
    `</section>` +
    `<div class="container stack">` +
    (featured ? `<section aria-label="Featured guide">${featuredCard(featured)}</section>` : '') +
    `<section aria-labelledby="topics-heading">` +
    `<h2 id="topics-heading" class="section-heading">Browse by topic</h2>` +
    `<div class="card-grid card-grid--cats">${categoryCards}</div>` +
    `</section>` +
    `<section aria-labelledby="latest-heading">` +
    `<h2 id="latest-heading" class="section-heading">Latest guides</h2>` +
    `<div class="card-grid">${latestCards}</div>` +
    `</section>` +
    `</div>`

  return {
    activeNav: 'resources',
    seo: {
      title: 'Resources',
      description: LEDE,
      path: resourcesIndexPath(),
      type: 'website',
    },
    breadcrumbs: [
      { name: 'Home', path: homePath() },
      { name: 'Resources', path: resourcesIndexPath() },
    ],
    jsonLd: [
      collectionPageNode({
        name: 'Fylos resources',
        description: LEDE,
        path: resourcesIndexPath(),
        items: getAllArticles().map((a) => ({ name: a.title, path: articlePath(a) })),
      }),
    ],
    main,
  }
}
