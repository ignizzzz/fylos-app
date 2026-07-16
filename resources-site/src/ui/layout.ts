/**
 * The full HTML document shell. Pages return a PageModel (SEO + main content +
 * optional breadcrumbs and extra JSON-LD); this composes the document, always
 * including the Organization and WebSite nodes and keeping the visible
 * breadcrumbs in sync with the BreadcrumbList structured data.
 */
import { site } from '../site.config.ts'
import { esc } from '../lib/html.ts'
import { type SeoInput, renderHead } from '../lib/seo.ts'
import {
  type JsonLd,
  breadcrumbNode,
  jsonLdScript,
  organizationNode,
  websiteNode,
} from '../lib/jsonld.ts'
import { type Crumb, renderBreadcrumbs } from '../lib/breadcrumbs.ts'
import { type NavKey, renderFooter, renderHeader } from './chrome.ts'

export interface PageModel {
  seo: SeoInput
  main: string
  jsonLd?: JsonLd[]
  breadcrumbs?: Crumb[]
  activeNav?: NavKey
}

export interface RenderContext {
  /** Hashed stylesheet path, e.g. "/resources/assets/styles.abcd1234.css". */
  cssHref: string
  buildYear: number
}

const ICONS_HEAD =
  '<link rel="icon" href="/resources/assets/favicon.svg" type="image/svg+xml">' +
  '<link rel="apple-touch-icon" href="/resources/assets/apple-touch-icon.png">'

const FONTS_HEAD =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?' +
  'family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500' +
  '&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">'

export function renderDocument(model: PageModel, ctx: RenderContext): string {
  const graph: JsonLd[] = [organizationNode(), websiteNode()]
  if (model.breadcrumbs && model.breadcrumbs.length > 1) {
    graph.push(breadcrumbNode(model.breadcrumbs))
  }
  if (model.jsonLd) graph.push(...model.jsonLd)

  const breadcrumbsHtml =
    model.breadcrumbs && model.breadcrumbs.length > 1
      ? `<div class="container breadcrumbs-wrap">${renderBreadcrumbs(model.breadcrumbs)}</div>`
      : ''

  const head =
    `<meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<meta name="theme-color" content="#FBF7F2">` +
    renderHead(model.seo) +
    ICONS_HEAD +
    FONTS_HEAD +
    `<link rel="stylesheet" href="${esc(ctx.cssHref)}">` +
    jsonLdScript(graph)

  const body =
    `<a class="skip-link" href="#main">Skip to content</a>` +
    renderHeader(model.activeNav) +
    `<main id="main" class="site-main">` +
    breadcrumbsHtml +
    model.main +
    `</main>` +
    renderFooter(ctx.buildYear)

  return (
    `<!doctype html>\n` +
    `<html lang="${esc(site.locale)}">\n` +
    `<head>\n${head}\n</head>\n` +
    `<body>\n${body}\n</body>\n` +
    `</html>\n`
  )
}
