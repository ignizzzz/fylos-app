import { describe, expect, it } from 'vitest'
import { captureSubmissionMeta } from '../core/meta'

function makeStorage(): Storage {
  const map = new Map<string, string>()
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, String(value))
    },
    removeItem: (key) => {
      map.delete(key)
    },
    clear: () => map.clear(),
    key: (index) => Array.from(map.keys())[index] ?? null,
    get length() {
      return map.size
    },
  } as Storage
}

describe('captureSubmissionMeta', () => {
  it('parses UTM params, click ids and referrer', () => {
    const meta = captureSubmissionMeta({
      url: 'https://fylos.me/apply?utm_source=news&utm_medium=email&utm_campaign=spring&gclid=abc123',
      referrer: 'https://www.google.com/',
      userAgent: 'test-agent',
      now: () => 0,
      storage: makeStorage(),
    })

    expect(meta.utm.source).toBe('news')
    expect(meta.utm.medium).toBe('email')
    expect(meta.utm.campaign).toBe('spring')
    expect(meta.clickIds.gclid).toBe('abc123')
    expect(meta.referrer).toBe('https://www.google.com/')
    expect(meta.landingPath).toContain('/apply')
    expect(meta.submittedFrom).toContain('/apply')
    expect(meta.userAgent).toBe('test-agent')
    expect(meta.submittedAt).toBe('1970-01-01T00:00:00.000Z')
  })

  it('keeps FIRST-touch attribution across a session but updates submittedFrom', () => {
    const storage = makeStorage()
    captureSubmissionMeta({
      url: 'https://fylos.me/?utm_source=news&utm_medium=email',
      referrer: 'https://twitter.com/',
      now: () => 0,
      storage,
    })

    const second = captureSubmissionMeta({
      url: 'https://fylos.me/contact',
      referrer: '',
      now: () => 1000,
      storage,
    })

    // First-touch UTM + referrer are preserved...
    expect(second.utm.source).toBe('news')
    expect(second.referrer).toBe('https://twitter.com/')
    expect(second.landingPath).toBe('/?utm_source=news&utm_medium=email')
    // ...but the submission location reflects where it was actually sent.
    expect(second.submittedFrom).toBe('/contact')
  })

  it('produces empty attribution when no UTM is present', () => {
    const meta = captureSubmissionMeta({
      url: 'https://fylos.me/press',
      referrer: '',
      now: () => 0,
      storage: makeStorage(),
    })
    expect(meta.utm).toEqual({})
    expect(meta.clickIds).toEqual({})
    expect(meta.referrer).toBeNull()
  })

  it('does not throw when storage is disabled', () => {
    expect(() =>
      captureSubmissionMeta({ url: 'https://fylos.me/', now: () => 0, storage: null }),
    ).not.toThrow()
  })
})
