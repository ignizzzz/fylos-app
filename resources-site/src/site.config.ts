/**
 * Single source of truth for site-wide constants. Every canonical URL, Open
 * Graph URL, and sitemap entry is derived from `siteUrl`.
 *
 * The production origin is overridable at build time with the SITE_URL env var,
 * so nothing else has to change if the resources frontend moves to a different
 * domain:
 *
 *   SITE_URL=https://www.fylos.me npm run build
 */

function readSiteUrl(): string {
  const raw = (process.env.SITE_URL ?? 'https://fylos.me').trim()
  // Normalise: no trailing slash, so path joins are predictable.
  return raw.replace(/\/+$/, '')
}

export interface SiteConfig {
  /** Absolute production origin, no trailing slash. */
  readonly siteUrl: string
  /** Brand name used in titles and og:site_name. */
  readonly name: string
  /** Short tagline for the default meta description / og fallback. */
  readonly tagline: string
  /** Default social share image (absolute path under the site root). */
  readonly defaultShareImage: {
    readonly src: string
    readonly alt: string
    readonly width: number
    readonly height: number
  }
  /** Two-letter language of the resources frontend. */
  readonly locale: string
  /** Organization details for JSON-LD. */
  readonly organization: {
    readonly name: string
    readonly legalName: string
    readonly logo: string
    /** Where the pet app lives, used for the primary call to action. */
    readonly appUrl: string
    /** Public, real social/profile links. Keep this honest: only real ones. */
    readonly sameAs: readonly string[]
  }
  /** Twitter/X handle for twitter:site, or null if none is live yet. */
  readonly twitterHandle: string | null
}

export const site: SiteConfig = {
  siteUrl: readSiteUrl(),
  name: 'Fylos',
  tagline: 'Your whole pet neighborhood, in one app.',
  defaultShareImage: {
    src: '/resources/assets/og-default.png',
    alt: 'Fylos, your whole pet neighborhood.',
    width: 1200,
    height: 630,
  },
  locale: 'en',
  organization: {
    name: 'Fylos',
    legalName: 'Fylos',
    logo: '/resources/assets/logo.png',
    appUrl: 'https://app.fylos.me',
    // Keep empty until real, verified profiles exist. Do not invent links.
    sameAs: [],
  },
  twitterHandle: null,
}

/** Convenience: turn a root-relative path into an absolute URL. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const clean = path.startsWith('/') ? path : `/${path}`
  return `${site.siteUrl}${clean}`
}
