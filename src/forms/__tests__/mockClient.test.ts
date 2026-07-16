import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { mockSubmit, NetworkError, __resetMockStore } from '../core/mockClient'
import { resetMockConfig, setMockConfig } from '../core/mockConfig'
import type { SubmissionMeta, SubmissionPayload, FormId } from '../core/types'

const META: SubmissionMeta = {
  utm: {},
  clickIds: {},
  referrer: null,
  landingPath: '/',
  submittedFrom: '/',
  userAgent: null,
  submittedAt: '1970-01-01T00:00:00.000Z',
}

function payload(email = 'person@fylos.me', formId: FormId = 'newsletter'): SubmissionPayload {
  return { formId, values: { email }, meta: META }
}

beforeEach(() => {
  __resetMockStore()
  setMockConfig({ delayMs: 0, detectDuplicates: true })
})

afterEach(() => {
  resetMockConfig()
  __resetMockStore()
})

describe('mockSubmit scenarios', () => {
  it('success resolves with a record id', async () => {
    setMockConfig({ scenario: 'success' })
    const result = await mockSubmit(payload())
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.id).toMatch(/^newsletter_/)
  })

  it('validation resolves with field errors', async () => {
    setMockConfig({ scenario: 'validation' })
    const result = await mockSubmit(payload())
    expect(result.ok).toBe(false)
    if (!result.ok && result.kind === 'validation') {
      expect(result.fieldErrors?.email).toBeDefined()
    } else {
      throw new Error('expected a validation failure')
    }
  })

  it('server resolves with a retryable 5xx failure', async () => {
    setMockConfig({ scenario: 'server' })
    const result = await mockSubmit(payload())
    expect(result.ok).toBe(false)
    if (!result.ok && result.kind === 'server') {
      expect(result.status).toBe(503)
      expect(result.retryable).toBe(true)
    } else {
      throw new Error('expected a server failure')
    }
  })

  it('network THROWS a NetworkError', async () => {
    setMockConfig({ scenario: 'network' })
    await expect(mockSubmit(payload())).rejects.toBeInstanceOf(NetworkError)
  })

  it('duplicate resolves with a non-retryable duplicate result', async () => {
    setMockConfig({ scenario: 'duplicate' })
    const result = await mockSubmit(payload())
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.kind).toBe('duplicate')
      expect(result.retryable).toBe(false)
    }
  })
})

describe('real duplicate detection under the success scenario', () => {
  it('accepts the first submission and flags the identical second', async () => {
    setMockConfig({ scenario: 'success' })
    const first = await mockSubmit(payload('dup@fylos.me'))
    const second = await mockSubmit(payload('dup@fylos.me'))
    expect(first.ok).toBe(true)
    expect(second.ok).toBe(false)
    if (!second.ok) expect(second.kind).toBe('duplicate')
  })

  it('treats a different identity as new', async () => {
    setMockConfig({ scenario: 'success' })
    await mockSubmit(payload('a@fylos.me'))
    const other = await mockSubmit(payload('b@fylos.me'))
    expect(other.ok).toBe(true)
  })

  it('can be disabled', async () => {
    setMockConfig({ scenario: 'success', detectDuplicates: false })
    await mockSubmit(payload('c@fylos.me'))
    const again = await mockSubmit(payload('c@fylos.me'))
    expect(again.ok).toBe(true)
  })
})

describe('cancellation', () => {
  it('rejects with AbortError when the signal aborts during the delay', async () => {
    setMockConfig({ scenario: 'success', delayMs: 1000 })
    const controller = new AbortController()
    const promise = mockSubmit(payload(), { signal: controller.signal })
    controller.abort()
    await expect(promise).rejects.toMatchObject({ name: 'AbortError' })
  })
})
