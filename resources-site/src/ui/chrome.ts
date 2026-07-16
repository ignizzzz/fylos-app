/**
 * Site chrome: the header nav and the footer. Matches the marketing site
 * language (FYLOS wordmark, coral CTA, warm palette) without touching any of
 * the locked storytelling files.
 */
import { site } from '../site.config.ts'
import { getAllCategories } from '../content/index.ts'
import { attrs, esc } from '../lib/html.ts'
import {
  announcementsIndexPath,
  categoryPath,
  homePath,
  productUpdatesIndexPath,
  resourcesIndexPath,
} from '../lib/urls.ts'

export type NavKey = 'resources' | 'product-updates' | 'company'

function navLink(href: string, label: string, active: boolean): string {
  return `<a${attrs({ href, 'aria-current': active ? 'page' : undefined })}>${esc(label)}</a>`
}

export function renderHeader(active?: NavKey): string {
  return (
    `<header class="site-header">` +
    `<div class="container site-header__inner">` +
    `<a class="brand" href="${esc(homePath())}" aria-label="${esc(site.name)} home">${esc('FYLOS')}</a>` +
    `<nav class="site-nav" aria-label="Primary">` +
    navLink(resourcesIndexPath(), 'Resources', active === 'resources') +
    navLink(productUpdatesIndexPath(), 'Product updates', active === 'product-updates') +
    navLink(announcementsIndexPath(), 'Company', active === 'company') +
    `</nav>` +
    `<a class="btn btn--primary site-header__cta" href="${esc(site.organization.appUrl)}">Get the app</a>` +
    `</div>` +
    `</header>`
  )
}

export function renderFooter(buildYear: number): string {
  const categories = getAllCategories()
  const categoryLinks = categories
    .map((c) => `<li><a href="${esc(categoryPath(c.slug))}">${esc(c.name)}</a></li>`)
    .join('')

  return (
    `<footer class="site-footer">` +
    `<div class="container site-footer__inner">` +
    `<div class="site-footer__brand">` +
    `<p class="brand">FYLOS</p>` +
    `<p class="site-footer__tag">${esc(site.tagline)}</p>` +
    `</div>` +
    `<nav class="site-footer__col" aria-label="Resources">` +
    `<p class="site-footer__label">Resources</p>` +
    `<ul>` +
    `<li><a href="${esc(resourcesIndexPath())}">All resources</a></li>` +
    categoryLinks +
    `</ul>` +
    `</nav>` +
    `<nav class="site-footer__col" aria-label="Company">` +
    `<p class="site-footer__label">Company</p>` +
    `<ul>` +
    `<li><a href="${esc(productUpdatesIndexPath())}">Product updates</a></li>` +
    `<li><a href="${esc(announcementsIndexPath())}">Announcements</a></li>` +
    `</ul>` +
    `</nav>` +
    `<div class="site-footer__col">` +
    `<p class="site-footer__label">Get started</p>` +
    `<a class="btn btn--primary" href="${esc(site.organization.appUrl)}">Get the app</a>` +
    `</div>` +
    `</div>` +
    `<div class="container site-footer__legal">` +
    `<p>&copy; ${buildYear} ${esc(site.name)}. All rights reserved.</p>` +
    `</div>` +
    `</footer>`
  )
}
