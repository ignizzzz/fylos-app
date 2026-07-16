# Fylos resources / SEO frontend

A self-contained, typed static site generator for the Fylos **resources and SEO**
surface: articles, categories, product updates, and company announcements. It emits
crawlable static HTML (one directory per route, each with its own `index.html`) plus
`sitemap.xml` and `robots.txt`.

This zone owns only these routes. It does **not** touch the homepage, product pages,
or the locked storytelling film. It mirrors the `analytics/` zone convention: its own
`package.json`, `node_modules`, `tsconfig.json`, and `eslint.config.js`.

## Routes (source of truth)

| Route | Page | Output |
|---|---|---|
| `/resources/` | Resources hub | `dist/resources/index.html` |
| `/resources/<category>/` | Category | `dist/resources/<category>/index.html` |
| `/resources/<category>/<slug>/` | Article | `dist/resources/<category>/<slug>/index.html` |
| `/product-updates/` | Product updates index | `dist/product-updates/index.html` |
| `/product-updates/<slug>/` | Product update | `dist/product-updates/<slug>/index.html` |
| `/company/announcements/` | Announcements index | `dist/company/announcements/index.html` |
| `/company/announcements/<slug>/` | Announcement | `dist/company/announcements/<slug>/index.html` |
| `/sitemap.xml` | Sitemap (this frontend's routes) | `dist/sitemap.xml` |
| `/robots.txt` | Robots (disallows `/admin/`, links sitemap) | `dist/robots.txt` |
| `/404.html` | Not found (noindex, excluded from sitemap) | `dist/404.html` |

Private `/admin/*` routes are not built here; they are excluded from indexing via
`Disallow: /admin/` in robots, and any page rendered with `robots: 'noindex'` also emits
`<meta name="robots" content="noindex, nofollow">` and is omitted from the sitemap.

## Commands

```bash
npm run build       # generate ./dist
npm run typecheck   # tsc --noEmit (strict)
npm run lint        # eslint .
npm run check       # lint + typecheck + build
npm run preview     # serve ./dist on http://localhost:4655
npm run dev         # build then preview
```

The production origin is one env var. Everything (canonical, og:url, sitemap) derives
from it:

```bash
SITE_URL=https://www.fylos.me npm run build   # default: https://fylos.me
```

## SEO applied to every page

Page title + meta description, `rel=canonical`, Open Graph, Twitter card, JSON-LD
(`Organization` + `WebSite` sitewide; `BlogPosting` / `NewsArticle` / `TechArticle` on
entries; `CollectionPage` + `ItemList` on indexes; `BreadcrumbList` on deep pages),
visible breadcrumbs that match the `BreadcrumbList`, related articles, and responsive
article typography. Share/hero images are generated as real **PNG** (social crawlers do
not reliably render SVG for `og:image`).

## Content model (swappable for a backend or CMS)

Content is plain typed data under `src/content/`:

```
src/content/
  types.ts            Article, Category, ProductUpdate, Announcement, Author, Block
  authors.ts          bylines
  categories.ts       topics
  articles/*.ts       one file per article (body is a typed Block[])
  product-updates.ts  release notes
  announcements.ts    company news
  index.ts            the query API (getArticle, getRelatedArticles, ...) + validateContent()
```

Article bodies are a typed `Block[]` (heading / paragraph / list / quote / callout /
image / divider) rather than a markdown string, so the "typed" guarantee holds end to
end and there is no fragile parser. Text fields support a small, safe inline syntax
(`**bold**`, `_italic_`, `` `code` ``, `[label](/href)`); see `src/lib/inline.ts`.

To move to a backend or CMS later, reimplement the functions in `src/content/index.ts`
to fetch and return these same shapes. The templates in `src/ui` and `src/pages` do not
change.

`validateContent()` runs at the start of every build and fails on: broken category or
author references, duplicate or malformed slugs, bad dates, and any em/en dash or emoji
in user-facing copy (the founder copy rules, enforced programmatically).

## Deploying

The `dist/` output is plain static files. Deploy it at the site root (so `/resources/`,
`/product-updates/`, `/company/announcements/` resolve), or copy it alongside the existing
`website-live/` pages. `sitemap.xml` and `robots.txt` cover this frontend's routes; if a
site-wide sitemap already exists, reference this one from a `<sitemapindex>` and merge the
robots rules.
