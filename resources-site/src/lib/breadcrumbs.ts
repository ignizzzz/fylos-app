/**
 * Visible breadcrumbs. The same crumb list feeds both this UI and the
 * BreadcrumbList JSON-LD (lib/jsonld.ts), so what a person sees and what a
 * crawler reads never disagree.
 */
import { esc } from './html.ts'
import { type LinkItem } from './urls.ts'

/** A breadcrumb is a named link to a route. */
export type Crumb = LinkItem

export function renderBreadcrumbs(crumbs: Crumb[]): string {
  const items = crumbs
    .map((crumb, i) => {
      const isLast = i === crumbs.length - 1
      if (isLast) {
        return `<li class="breadcrumbs__item"><span aria-current="page">${esc(crumb.name)}</span></li>`
      }
      return `<li class="breadcrumbs__item"><a href="${esc(crumb.path)}">${esc(crumb.name)}</a></li>`
    })
    .join('')
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol class="breadcrumbs__list">${items}</ol></nav>`
}
