import { type Article } from '../content/types.ts'
import { type PageModel } from '../ui/layout.ts'
import { site } from '../site.config.ts'
import { getAuthor, getCategory, getRelatedArticles } from '../content/index.ts'
import { esc } from '../lib/html.ts'
import { renderBlocks } from '../lib/blocks.ts'
import { readingLabel } from '../lib/reading-time.ts'
import { isoDateTime } from '../lib/dates.ts'
import { blogPostingNode } from '../lib/jsonld.ts'
import { byline, relatedArticles } from '../ui/cards.ts'
import { articlePath, categoryPath, homePath, resourcesIndexPath } from '../lib/urls.ts'

export function renderArticle(article: Article): PageModel {
  const category = getCategory(article.categorySlug)
  const author = getAuthor(article.authorId)
  const authorName = author?.name ?? site.name
  const related = getRelatedArticles(article, 3)

  const eyebrow = category
    ? `<p class="eyebrow"><a href="${esc(categoryPath(category.slug))}">${esc(category.name)}</a></p>`
    : ''

  const main =
    `<article class="article">` +
    `<header class="article__header">` +
    `<div class="container container--narrow">` +
    eyebrow +
    `<h1 class="article__title">${esc(article.title)}</h1>` +
    `<p class="article__standfirst">${esc(article.description)}</p>` +
    byline(authorName, article.publishedAt, article.updatedAt, readingLabel(article.body)) +
    `</div>` +
    `</header>` +
    `<div class="container container--narrow">` +
    `<div class="prose">${renderBlocks(article.body)}</div>` +
    `</div>` +
    `</article>` +
    `<div class="container">${relatedArticles(related)}</div>`

  return {
    activeNav: 'resources',
    seo: {
      title: article.title,
      description: article.description,
      path: articlePath(article),
      type: 'article',
      image: article.hero,
      article: {
        publishedTime: isoDateTime(article.publishedAt),
        modifiedTime: isoDateTime(article.updatedAt ?? article.publishedAt),
        authorName,
        section: category?.name,
        tags: article.tags,
      },
    },
    breadcrumbs: [
      { name: 'Home', path: homePath() },
      { name: 'Resources', path: resourcesIndexPath() },
      ...(category ? [{ name: category.name, path: categoryPath(category.slug) }] : []),
      { name: article.title, path: articlePath(article) },
    ],
    jsonLd: category && author ? [blogPostingNode(article, author, category)] : [],
    main,
  }
}
