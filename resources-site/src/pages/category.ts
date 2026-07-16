import { type Category } from '../content/types.ts'
import { type PageModel } from '../ui/layout.ts'
import { getArticlesByCategory } from '../content/index.ts'
import { articleCard } from '../ui/cards.ts'
import { esc } from '../lib/html.ts'
import { collectionPageNode } from '../lib/jsonld.ts'
import { articlePath, categoryPath, homePath, resourcesIndexPath } from '../lib/urls.ts'

export function renderCategory(category: Category): PageModel {
  const articles = getArticlesByCategory(category.slug)
  const intro = category.intro ?? category.description
  const count = articles.length
  const countLabel = count === 1 ? '1 guide' : `${count} guides`

  const main =
    `<section class="page-hero">` +
    `<div class="container">` +
    `<p class="eyebrow">Resources</p>` +
    `<h1 class="display">${esc(category.name)}</h1>` +
    `<p class="lede">${esc(intro)}</p>` +
    `<p class="lede-meta">${esc(countLabel)}</p>` +
    `</div>` +
    `</section>` +
    `<div class="container">` +
    `<h2 class="sr-only">Guides in ${esc(category.name)}</h2>` +
    (count > 0
      ? `<div class="card-grid">${articles.map(articleCard).join('')}</div>`
      : `<p class="empty-state">New guides are on the way. Check back soon.</p>`) +
    `</div>`

  return {
    activeNav: 'resources',
    seo: {
      title: category.title ?? category.name,
      description: category.description,
      path: categoryPath(category.slug),
      type: 'website',
    },
    breadcrumbs: [
      { name: 'Home', path: homePath() },
      { name: 'Resources', path: resourcesIndexPath() },
      { name: category.name, path: categoryPath(category.slug) },
    ],
    jsonLd: [
      collectionPageNode({
        name: category.title ?? category.name,
        description: category.description,
        path: categoryPath(category.slug),
        items: articles.map((a) => ({ name: a.title, path: articlePath(a) })),
      }),
    ],
    main,
  }
}
