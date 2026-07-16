import { type PageModel } from '../ui/layout.ts'
import { esc } from '../lib/html.ts'
import {
  announcementsIndexPath,
  homePath,
  productUpdatesIndexPath,
  resourcesIndexPath,
} from '../lib/urls.ts'

export function renderNotFound(): PageModel {
  const links = [
    { label: 'Resources', href: resourcesIndexPath() },
    { label: 'Product updates', href: productUpdatesIndexPath() },
    { label: 'Announcements', href: announcementsIndexPath() },
    { label: 'Home', href: homePath() },
  ]
    .map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)
    .join('')

  const main =
    `<section class="page-hero page-hero--center">` +
    `<div class="container container--narrow">` +
    `<p class="eyebrow">404</p>` +
    `<h1 class="display">We could not find that page</h1>` +
    `<p class="lede">The link may be old, or the page may have moved. Here is where to go next.</p>` +
    `<ul class="link-list">${links}</ul>` +
    `</div>` +
    `</section>`

  return {
    seo: {
      title: 'Page not found',
      description: 'The page you are looking for could not be found.',
      path: '/404.html',
      type: 'website',
      robots: 'noindex',
    },
    main,
  }
}
