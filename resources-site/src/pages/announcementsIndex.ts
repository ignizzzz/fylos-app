import { type PageModel } from '../ui/layout.ts'
import { getAllAnnouncements } from '../content/index.ts'
import { announcementCard } from '../ui/cards.ts'
import { collectionPageNode } from '../lib/jsonld.ts'
import { announcementPath, announcementsIndexPath, homePath } from '../lib/urls.ts'

const LEDE = 'News and milestones from the team building Fylos.'

export function renderAnnouncementsIndex(): PageModel {
  const announcements = getAllAnnouncements()

  const main =
    `<section class="page-hero">` +
    `<div class="container">` +
    `<p class="eyebrow">Company</p>` +
    `<h1 class="display">Announcements</h1>` +
    `<p class="lede">${LEDE}</p>` +
    `</div>` +
    `</section>` +
    `<div class="container">` +
    `<h2 class="sr-only">All announcements</h2>` +
    `<div class="card-grid">${announcements.map(announcementCard).join('')}</div>` +
    `</div>`

  return {
    activeNav: 'company',
    seo: {
      title: 'Company announcements',
      description: LEDE,
      path: announcementsIndexPath(),
      type: 'website',
    },
    breadcrumbs: [
      { name: 'Home', path: homePath() },
      { name: 'Announcements', path: announcementsIndexPath() },
    ],
    jsonLd: [
      collectionPageNode({
        name: 'Company announcements',
        description: LEDE,
        path: announcementsIndexPath(),
        items: announcements.map((a) => ({ name: a.title, path: announcementPath(a) })),
      }),
    ],
    main,
  }
}
