import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { submitForm } from '../core/service'
import { resetMockConfig, setMockConfig } from '../core/mockConfig'
import { __getLastPayload, __resetMockStore } from '../core/mockClient'
import type { MetaSources } from '../core/meta'

const metaSources: MetaSources = {
  url: 'https://fylos.me/newsletter',
  referrer: '',
  now: () => 0,
  storage: null,
}

beforeEach(() => {
  __resetMockStore()
  setMockConfig({ delayMs: 0, detectDuplicates: true })
})

afterEach(() => {
  resetMockConfig()
  __resetMockStore()
})

describe('submitForm', () => {
  it('returns a typed success result', async () => {
    setMockConfig({ scenario: 'success' })
    const result = await submitForm('newsletter', { email: 'a@b.co' }, { metaSources })
    expect(result.ok).toBe(true)
  })

  it('surfaces a server failure as a typed result (no throw)', async () => {
    setMockConfig({ scenario: 'server' })
    const result = await submitForm('newsletter', { email: 'a@b.co' }, { metaSources })
    expect(result).toMatchObject({ ok: false, kind: 'server' })
  })

  it('MAPS a thrown network error to a typed network result', async () => {
    setMockConfig({ scenario: 'network' })
    const result = await submitForm('newsletter', { email: 'a@b.co' }, { metaSources })
    expect(result).toMatchObject({ ok: false, kind: 'network', retryable: true })
  })

  it('surfaces server-side validation failures', async () => {
    setMockConfig({ scenario: 'validation' })
    const result = await submitForm('newsletter', { email: 'a@b.co' }, { metaSources })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.kind).toBe('validation')
  })

  it('attaches captured UTM + referrer metadata to the submitted payload', async () => {
    setMockConfig({ scenario: 'success' })
    await submitForm(
      'newsletter',
      { email: 'utm@fylos.me' },
      {
        metaSources: {
          url: 'https://fylos.me/newsletter?utm_source=news&utm_medium=email&utm_campaign=spring',
          referrer: 'https://www.google.com/',
          now: () => 0,
          storage: null,
        },
      },
    )
    const payload = __getLastPayload()
    expect(payload?.formId).toBe('newsletter')
    expect(payload?.meta.utm.source).toBe('news')
    expect(payload?.meta.utm.campaign).toBe('spring')
    expect(payload?.meta.referrer).toBe('https://www.google.com/')
    expect(payload?.meta.submittedFrom).toContain('/newsletter')
  })

  it('rethrows AbortError so callers can ignore cancelled submits', async () => {
    setMockConfig({ scenario: 'success', delayMs: 1000 })
    const controller = new AbortController()
    const promise = submitForm('newsletter', { email: 'a@b.co' }, { metaSources, signal: controller.signal })
    controller.abort()
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' })
  })
})
