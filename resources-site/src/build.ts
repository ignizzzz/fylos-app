/**
 * The static site generator. Validates content, then renders every route
 * (listed in this project's README.md, and catalogued repo-wide in
 * ../docs/ROUTES.md) to a crawlable HTML file, generates the brand assets, and
 * writes sitemap.xml and robots.txt.
 *
 *   npm run build            # writes ./dist
 *   SITE_URL=https://x npm run build
 */
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { absoluteUrl, site } from './site.config.ts'
import {
  getAllAnnouncements,
  getAllArticles,
  getAllCategories,
  getAllProductUpdates,
  getArticlesByCategory,
  validateContent,
} from './content/index.ts'
import { type PageModel, type RenderContext, renderDocument } from './ui/layout.ts'
import {
  announcementPath,
  announcementsIndexPath,
  articlePath,
  categoryPath,
  outputFileForPath,
  productUpdatePath,
  productUpdatesIndexPath,
  resourcesIndexPath,
} from './lib/urls.ts'
import { brandCard, logoPng } from './lib/ogimage.ts'
import { renderResourcesIndex } from './pages/resourcesIndex.ts'
import { renderCategory } from './pages/category.ts'
import { renderArticle } from './pages/article.ts'
import { renderProductUpdatesIndex } from './pages/productUpdatesIndex.ts'
import { renderProductUpdate } from './pages/productUpdate.ts'
import { renderAnnouncementsIndex } from './pages/announcementsIndex.ts'
import { renderAnnouncement } from './pages/announcement.ts'
import { renderNotFound } from './pages/notFound.ts'

const here = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(here, '..')
const distDir = join(projectRoot, 'dist')
const assetsDir = join(distDir, 'resources', 'assets')

const FAVICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
  '<rect width="32" height="32" rx="7" fill="#E85D2A"/>' +
  '<g fill="#FBF7F2"><rect x="11" y="8" width="4" height="16"/>' +
  '<rect x="11" y="8" width="11" height="4"/><rect x="11" y="14.2" width="8" height="3.6"/></g></svg>\n'

function write(relPath: string, contents: string | Buffer): void {
  const full = join(distDir, relPath)
  mkdirSync(dirname(full), { recursive: true })
  writeFileSync(full, contents)
}

function latestDate(dates: Array<string | undefined>): string | undefined {
  const valid = dates.filter((d): d is string => Boolean(d)).sort()
  return valid[valid.length - 1]
}

interface SitemapEntry {
  path: string
  lastmod?: string
  changefreq: string
  priority: string
}

function buildSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => {
      const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : ''
      return (
        `  <url>\n` +
        `    <loc>${absoluteUrl(e.path)}</loc>${lastmod}\n` +
        `    <changefreq>${e.changefreq}</changefreq>\n` +
        `    <priority>${e.priority}</priority>\n` +
        `  </url>`
      )
    })
    .join('\n')
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n</urlset>\n`
  )
}

function buildRobotsTxt(): string {
  return (
    `# Fylos resources / SEO frontend\n` +
    `User-agent: *\n` +
    `Allow: /\n` +
    `Disallow: /admin/\n\n` +
    `Sitemap: ${absoluteUrl('/sitemap.xml')}\n`
  )
}

function main(): void {
  console.log('Building Fylos resources site...')
  console.log(`  SITE_URL = ${site.siteUrl}`)

  // 1. Validate content up front.
  const { errors, warnings } = validateContent()
  for (const w of warnings) console.warn(`  warning: ${w}`)
  if (errors.length) {
    console.error(`\nContent validation failed with ${errors.length} error(s):`)
    for (const e of errors) console.error(`  - ${e}`)
    process.exit(1)
  }

  // 2. Clean output.
  rmSync(distDir, { recursive: true, force: true })
  mkdirSync(assetsDir, { recursive: true })

  // 3. Assets. Hash the stylesheet for cache-busting.
  const css = readFileSync(join(here, 'styles', 'resources.css'))
  const cssHash = createHash('sha256').update(css).digest('hex').slice(0, 10)
  const cssHref = `/resources/assets/styles.${cssHash}.css`
  write(join('resources', 'assets', `styles.${cssHash}.css`), css)

  write(join('resources', 'assets', 'favicon.svg'), FAVICON_SVG)
  write(join('resources', 'assets', 'og-default.png'), brandCard('default'))
  write(join('resources', 'assets', 'hero-health-book.png'), brandCard('health'))
  write(join('resources', 'assets', 'hero-safety.png'), brandCard('safety'))
  write(join('resources', 'assets', 'hero-neighborhood.png'), brandCard('neighborhood'))
  write(join('resources', 'assets', 'logo.png'), logoPng(512))
  write(join('resources', 'assets', 'apple-touch-icon.png'), logoPng(180))

  const ctx: RenderContext = { cssHref, buildYear: new Date().getUTCFullYear() }

  // 4. Collect pages (path -> model). 404 is handled separately (a file, not a
  //    directory route, and excluded from the sitemap).
  const articles = getAllArticles()
  const categories = getAllCategories()
  const updates = getAllProductUpdates()
  const announcements = getAllAnnouncements()

  const pages: Array<{ path: string; model: PageModel; sitemap?: SitemapEntry }> = []

  pages.push({
    path: resourcesIndexPath(),
    model: renderResourcesIndex(),
    sitemap: {
      path: resourcesIndexPath(),
      lastmod: latestDate(articles.map((a) => a.updatedAt ?? a.publishedAt)),
      changefreq: 'weekly',
      priority: '0.9',
    },
  })

  for (const category of categories) {
    const catArticles = getArticlesByCategory(category.slug)
    pages.push({
      path: categoryPath(category.slug),
      model: renderCategory(category),
      sitemap: {
        path: categoryPath(category.slug),
        lastmod: latestDate(catArticles.map((a) => a.updatedAt ?? a.publishedAt)),
        changefreq: 'weekly',
        priority: '0.7',
      },
    })
  }

  for (const article of articles) {
    pages.push({
      path: articlePath(article),
      model: renderArticle(article),
      sitemap: {
        path: articlePath(article),
        lastmod: article.updatedAt ?? article.publishedAt,
        changefreq: 'monthly',
        priority: '0.8',
      },
    })
  }

  pages.push({
    path: productUpdatesIndexPath(),
    model: renderProductUpdatesIndex(),
    sitemap: {
      path: productUpdatesIndexPath(),
      lastmod: latestDate(updates.map((u) => u.publishedAt)),
      changefreq: 'weekly',
      priority: '0.7',
    },
  })

  for (const update of updates) {
    pages.push({
      path: productUpdatePath(update),
      model: renderProductUpdate(update),
      sitemap: {
        path: productUpdatePath(update),
        lastmod: update.publishedAt,
        changefreq: 'yearly',
        priority: '0.5',
      },
    })
  }

  pages.push({
    path: announcementsIndexPath(),
    model: renderAnnouncementsIndex(),
    sitemap: {
      path: announcementsIndexPath(),
      lastmod: latestDate(announcements.map((a) => a.updatedAt ?? a.publishedAt)),
      changefreq: 'weekly',
      priority: '0.7',
    },
  })

  for (const announcement of announcements) {
    pages.push({
      path: announcementPath(announcement),
      model: renderAnnouncement(announcement),
      sitemap: {
        path: announcementPath(announcement),
        lastmod: announcement.updatedAt ?? announcement.publishedAt,
        changefreq: 'yearly',
        priority: '0.6',
      },
    })
  }

  // 5. Render + write HTML.
  for (const page of pages) {
    write(outputFileForPath(page.path), renderDocument(page.model, ctx))
  }

  // 404 (noindex, written as a root file).
  write('404.html', renderDocument(renderNotFound(), ctx))

  // 6. Sitemap + robots.
  const sitemap = pages
    .map((p) => p.sitemap)
    .filter((s): s is SitemapEntry => Boolean(s))
  write('sitemap.xml', buildSitemapXml(sitemap))
  write('robots.txt', buildRobotsTxt())

  console.log(`\nDone.`)
  console.log(`  ${pages.length} pages + 404`)
  console.log(`  ${sitemap.length} sitemap entries`)
  console.log(`  output: ${distDir}`)
}

main()
