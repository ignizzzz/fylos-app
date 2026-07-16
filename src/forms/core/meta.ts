// UTM + referrer capture.
//
// Attribution is captured FIRST-TOUCH: the first page a visitor lands on in a
// session wins, so a later click-through to /contact still reports the campaign
// that actually brought them in. We also record where the form was ultimately
// submitted from. All inputs are injectable so this is trivially testable
// without touching the real window.

import type { ClickIds, SubmissionMeta, UtmParams } from './types'

const STORAGE_KEY = 'fyl.forms.firstTouch'

export interface MetaSources {
  url?: string
  referrer?: string
  userAgent?: string
  now?: () => number
  /** Pass null to disable persistence; defaults to window.sessionStorage. */
  storage?: Storage | null
}

interface FirstTouch {
  utm: UtmParams
  clickIds: ClickIds
  referrer: string | null
  landingPath: string
}

function defaultUrl(): string {
  if (typeof window !== 'undefined' && window.location) return window.location.href
  return 'http://localhost/'
}

function defaultReferrer(): string {
  if (typeof document !== 'undefined') return document.referrer || ''
  return ''
}

function defaultUserAgent(): string | null {
  if (typeof navigator !== 'undefined') return navigator.userAgent || null
  return null
}

function defaultStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) return window.sessionStorage
  } catch {
    // Access to storage can throw in locked-down browsers.
  }
  return null
}

function cleanValue(value: string | null): string | undefined {
  const trimmed = (value ?? '').trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function parseUtm(params: URLSearchParams): UtmParams {
  const utm: UtmParams = {}
  const source = cleanValue(params.get('utm_source'))
  const medium = cleanValue(params.get('utm_medium'))
  const campaign = cleanValue(params.get('utm_campaign'))
  const term = cleanValue(params.get('utm_term'))
  const content = cleanValue(params.get('utm_content'))
  if (source) utm.source = source
  if (medium) utm.medium = medium
  if (campaign) utm.campaign = campaign
  if (term) utm.term = term
  if (content) utm.content = content
  return utm
}

function parseClickIds(params: URLSearchParams): ClickIds {
  const clickIds: ClickIds = {}
  const gclid = cleanValue(params.get('gclid'))
  const fbclid = cleanValue(params.get('fbclid'))
  const msclkid = cleanValue(params.get('msclkid'))
  if (gclid) clickIds.gclid = gclid
  if (fbclid) clickIds.fbclid = fbclid
  if (msclkid) clickIds.msclkid = msclkid
  return clickIds
}

function readFirstTouch(storage: Storage | null): FirstTouch | null {
  if (!storage) return null
  try {
    const raw = storage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<FirstTouch>
    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof parsed.landingPath === 'string' &&
      typeof parsed.utm === 'object' &&
      parsed.utm !== null &&
      typeof parsed.clickIds === 'object' &&
      parsed.clickIds !== null &&
      (parsed.referrer === null || typeof parsed.referrer === 'string')
    ) {
      return parsed as FirstTouch
    }
  } catch {
    // Corrupt or unreadable: treat as no first-touch.
  }
  return null
}

function writeFirstTouch(storage: Storage | null, value: FirstTouch): void {
  if (!storage) return
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // Quota or privacy mode: attribution simply is not persisted.
  }
}

/**
 * Build submission metadata. On the first call in a session the current page's
 * UTM/referrer become the persisted first-touch; later calls reuse it.
 */
export function captureSubmissionMeta(sources: MetaSources = {}): SubmissionMeta {
  const href = sources.url ?? defaultUrl()
  const referrerRaw = sources.referrer ?? defaultReferrer()
  const userAgent = sources.userAgent ?? defaultUserAgent()
  const nowMs = (sources.now ?? Date.now)()
  const storage = sources.storage === undefined ? defaultStorage() : sources.storage

  let currentPath = '/'
  let params = new URLSearchParams()
  try {
    const parsedUrl = new URL(href)
    currentPath = `${parsedUrl.pathname}${parsedUrl.search}`
    params = parsedUrl.searchParams
  } catch {
    // Non-URL input (rare): keep defaults.
  }

  const currentUtm = parseUtm(params)
  const currentClickIds = parseClickIds(params)
  const currentReferrer = cleanValue(referrerRaw) ?? null

  let firstTouch = readFirstTouch(storage)
  if (!firstTouch) {
    firstTouch = {
      utm: currentUtm,
      clickIds: currentClickIds,
      referrer: currentReferrer,
      landingPath: currentPath,
    }
    writeFirstTouch(storage, firstTouch)
  }

  return {
    utm: firstTouch.utm,
    clickIds: firstTouch.clickIds,
    referrer: firstTouch.referrer,
    landingPath: firstTouch.landingPath,
    submittedFrom: currentPath,
    userAgent,
    submittedAt: new Date(nowMs).toISOString(),
  }
}

/**
 * Persist the current page's UTM/referrer as the session first-touch, without
 * building a full submission. Call this once on initial page load from the host
 * site so attribution reflects the landing page, not the first page a form
 * happens to be submitted from. Safe to call repeatedly (only the first write
 * in a session wins).
 */
export function recordFirstTouch(sources: MetaSources = {}): void {
  captureSubmissionMeta(sources)
}
