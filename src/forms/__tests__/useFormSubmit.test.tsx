import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, renderHook, waitFor } from '@testing-library/react'
import { useFormSubmit } from '../hooks/useFormSubmit'
import { resetMockConfig, setMockConfig } from '../core/mockConfig'
import { __resetMockStore } from '../core/mockClient'
import { FORMS } from '../schemas'
import type { MetaSources } from '../core/meta'

const metaSources: MetaSources = { url: 'https://fylos.me/newsletter', now: () => 0, storage: null }

function renderNewsletter(initial: Record<string, string | boolean>) {
  return renderHook(() =>
    useFormSubmit(FORMS.newsletter, { initialValues: initial, metaSources }),
  )
}

beforeEach(() => {
  __resetMockStore()
  setMockConfig({ delayMs: 0, detectDuplicates: true })
})

afterEach(() => {
  resetMockConfig()
  __resetMockStore()
})

describe('useFormSubmit state machine', () => {
  it('starts idle', () => {
    const { result } = renderNewsletter({ email: '', consent: false })
    expect(result.current.phase).toBe('idle')
    expect(result.current.isSubmitting).toBe(false)
  })

  it('blocks submission on client validation and never hits the network', async () => {
    setMockConfig({ scenario: 'success' })
    const { result } = renderNewsletter({ email: '', consent: false })

    await act(async () => {
      result.current.submit()
    })

    expect(result.current.phase).toBe('error')
    expect(result.current.errorKind).toBe('validation')
    expect(result.current.fieldErrors.email).toBeDefined()
    expect(result.current.fieldErrors.consent).toBeDefined()
    expect(result.current.attempts).toBe(0) // no network attempt happened
  })

  it('exposes the loading (submitting) state while a submit is in flight', async () => {
    setMockConfig({ scenario: 'success', delayMs: 40 })
    const { result } = renderNewsletter({ email: 'a@b.co', consent: true })

    act(() => {
      result.current.submit()
    })
    // Synchronously moved into the loading state before the mock resolves.
    expect(result.current.isSubmitting).toBe(true)
    expect(result.current.phase).toBe('submitting')

    await waitFor(() => expect(result.current.phase).toBe('success'))
    expect(result.current.isSubmitting).toBe(false)
  })

  it('goes idle -> submitting -> success on a valid submit', async () => {
    setMockConfig({ scenario: 'success' })
    const { result } = renderNewsletter({ email: 'a@b.co', consent: true })

    await act(async () => {
      result.current.submit()
    })
    await waitFor(() => expect(result.current.phase).toBe('success'))
    expect(result.current.success?.id).toBeDefined()
    expect(result.current.attempts).toBe(1)
  })

  it('surfaces a server error and allows retry to succeed', async () => {
    setMockConfig({ scenario: 'server' })
    const { result } = renderNewsletter({ email: 'a@b.co', consent: true })

    await act(async () => {
      result.current.submit()
    })
    await waitFor(() => expect(result.current.phase).toBe('error'))
    expect(result.current.errorKind).toBe('server')
    expect(result.current.canRetry).toBe(true)

    setMockConfig({ scenario: 'success' })
    await act(async () => {
      result.current.retry()
    })
    await waitFor(() => expect(result.current.phase).toBe('success'))
    expect(result.current.attempts).toBe(2)
  })

  it('surfaces a network error', async () => {
    setMockConfig({ scenario: 'network' })
    const { result } = renderNewsletter({ email: 'a@b.co', consent: true })
    await act(async () => {
      result.current.submit()
    })
    await waitFor(() => expect(result.current.phase).toBe('error'))
    expect(result.current.errorKind).toBe('network')
    expect(result.current.canRetry).toBe(true)
  })

  it('surfaces a duplicate as a non-retryable error', async () => {
    setMockConfig({ scenario: 'duplicate' })
    const { result } = renderNewsletter({ email: 'a@b.co', consent: true })
    await act(async () => {
      result.current.submit()
    })
    await waitFor(() => expect(result.current.phase).toBe('error'))
    expect(result.current.errorKind).toBe('duplicate')
    expect(result.current.canRetry).toBe(false)
  })

  it('ignores a second synchronous submit while one is in flight', async () => {
    setMockConfig({ scenario: 'success', delayMs: 20 })
    const { result } = renderNewsletter({ email: 'a@b.co', consent: true })

    await act(async () => {
      result.current.submit()
      result.current.submit() // should be ignored by the in-flight guard
      await new Promise((r) => setTimeout(r, 60))
    })

    await waitFor(() => expect(result.current.phase).toBe('success'))
    expect(result.current.attempts).toBe(1)
  })

  it('clears a transient error banner when the user edits a field', async () => {
    setMockConfig({ scenario: 'server' })
    const { result } = renderNewsletter({ email: 'a@b.co', consent: true })
    await act(async () => {
      result.current.submit()
    })
    await waitFor(() => expect(result.current.phase).toBe('error'))

    act(() => {
      result.current.setValue('email', 'b@c.co')
    })
    expect(result.current.phase).toBe('idle')
    expect(result.current.errorKind).toBeUndefined()
  })

  it('resets back to a clean idle form', async () => {
    setMockConfig({ scenario: 'success' })
    const { result } = renderNewsletter({ email: 'a@b.co', consent: true })
    await act(async () => {
      result.current.submit()
    })
    await waitFor(() => expect(result.current.phase).toBe('success'))

    act(() => {
      result.current.reset()
    })
    expect(result.current.phase).toBe('idle')
    expect(result.current.attempts).toBe(0)
    expect(result.current.values.email).toBe('a@b.co')
  })
})
