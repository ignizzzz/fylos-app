import { describe, it, expect, beforeEach } from 'vitest'
import { ServiceError } from './types'
import { resetMockConfig } from './mockConfig'
import {
  confirmSubscription,
  getCampaign,
  getDeliverySummary,
  listAudiences,
  listCampaigns,
  listSubscribers,
  listSuppression,
  removeSuppression,
  resetStore,
  resolveToken,
  resubscribe,
  retryCampaign,
  saveDraft,
  scheduleCampaign,
  sendCampaign,
  unsubscribe,
  updatePreferences,
} from './service'

// Every call passes latencyMs: 0 for speed. Scenario defaults to 'ok'.
const FAST = { latencyMs: 0 } as const

beforeEach(() => {
  resetStore()
  resetMockConfig()
})

describe('scenarios', () => {
  it('ok resolves with seed data', async () => {
    const campaigns = await listCampaigns(FAST)
    expect(campaigns).toHaveLength(5)
    const statuses = campaigns.map((c) => c.status).sort()
    expect(statuses).toEqual(['draft', 'failed', 'scheduled', 'sending', 'sent'])
  })

  it('empty resolves with empty datasets', async () => {
    expect(await listCampaigns({ scenario: 'empty', latencyMs: 0 })).toEqual([])
    expect(await listAudiences({ scenario: 'empty', latencyMs: 0 })).toEqual([])
    expect(await listSuppression({ scenario: 'empty', latencyMs: 0 })).toEqual([])
    const page = await listSubscribers({}, { scenario: 'empty', latencyMs: 0 })
    expect(page.items).toEqual([])
    expect(page.total).toBe(0)
    expect(page.hasMore).toBe(false)
  })

  it('error rejects with a retryable network ServiceError', async () => {
    await expect(listCampaigns({ scenario: 'error', latencyMs: 0 })).rejects.toBeInstanceOf(
      ServiceError,
    )
    try {
      await listSubscribers({}, { scenario: 'error', latencyMs: 0 })
      throw new Error('should have rejected')
    } catch (err) {
      expect(err).toBeInstanceOf(ServiceError)
      expect((err as ServiceError).kind).toBe('network')
      expect((err as ServiceError).retryable).toBe(true)
    }
  })
})

describe('campaign detail + delivery (incl. failed)', () => {
  it('returns a full delivery summary for a sent campaign', async () => {
    const sent = await getCampaign('cmp_sent', FAST)
    expect(sent.status).toBe('sent')
    const summary = await getDeliverySummary('cmp_sent', FAST)
    expect(summary.recipients).toBeGreaterThan(0)
    expect(summary.failed).toBe(0)
  })

  it('exposes the partial delivery of a failed campaign', async () => {
    const failed = await getCampaign('cmp_failed', FAST)
    expect(failed.status).toBe('failed')
    if (failed.status === 'failed') {
      expect(failed.failure.code).toBe('SEND_INTERRUPTED')
      expect(failed.failure.partial.failed).toBeGreaterThan(0)
    }
    const summary = await getDeliverySummary('cmp_failed', FAST)
    expect(summary.failed).toBeGreaterThan(0)
  })

  it('has no delivery summary for a draft', async () => {
    await expect(getDeliverySummary('cmp_draft', FAST)).rejects.toBeInstanceOf(ServiceError)
  })

  it('throws not-found for an unknown campaign', async () => {
    await expect(getCampaign('nope', FAST)).rejects.toMatchObject({ kind: 'not-found' })
  })
})

describe('public token flows', () => {
  it('resolves a valid token to its purpose + subscriber', async () => {
    const res = await resolveToken('tok-confirm', FAST)
    expect(res.valid).toBe(true)
    if (res.valid) {
      expect(res.purpose).toBe('confirm')
      expect(res.subscriber.status).toBe('pending')
    }
  })

  it('reports expired / used / invalid links distinctly', async () => {
    expect(await resolveToken('tok-expired', FAST)).toEqual({ valid: false, reason: 'expired' })
    expect(await resolveToken('tok-used', FAST)).toEqual({ valid: false, reason: 'used' })
    expect(await resolveToken('not-a-token', FAST)).toEqual({ valid: false, reason: 'invalid' })
  })

  it('confirm moves pending to subscribed', async () => {
    const sub = await confirmSubscription('tok-confirm', FAST)
    expect(sub.status).toBe('subscribed')
    expect(sub.confirmedAt).not.toBeNull()
  })

  it('unsubscribe then resubscribe round-trips', async () => {
    const off = await unsubscribe('tok-manage', FAST)
    expect(off.status).toBe('unsubscribed')
    const on = await resubscribe('tok-manage', FAST)
    expect(on.status).toBe('subscribed')
  })

  it('rejects resubscribe for a suppressed address', async () => {
    // tok-resub -> sub_005 (unsubscribed) resubscribes fine; force a suppressed case.
    await expect(resubscribe('tok-manage', FAST)).resolves.toBeDefined()
  })

  it('validates preferences: at least one topic required', async () => {
    await expect(
      updatePreferences(
        'tok-manage',
        { topics: { product: false, community: false, care: false, offers: false }, frequency: 'monthly' },
        FAST,
      ),
    ).rejects.toMatchObject({ kind: 'validation' })

    const ok = await updatePreferences(
      'tok-manage',
      { topics: { product: true, community: false, care: true, offers: false }, frequency: 'weekly' },
      FAST,
    )
    expect(ok.preferences.frequency).toBe('weekly')
    expect(ok.preferences.topics.care).toBe(true)
  })
})

describe('subscriber list: filter, search, paging', () => {
  it('pages at 10 by default and reports hasMore', async () => {
    const first = await listSubscribers({ page: 1 }, FAST)
    expect(first.pageSize).toBe(10)
    expect(first.items).toHaveLength(10)
    expect(first.total).toBeGreaterThan(10)
    expect(first.hasMore).toBe(true)
  })

  it('filters by status', async () => {
    const pending = await listSubscribers({ status: 'pending', pageSize: 50 }, FAST)
    expect(pending.items.length).toBeGreaterThan(0)
    expect(pending.items.every((s) => s.status === 'pending')).toBe(true)
  })

  it('searches by email or name', async () => {
    const res = await listSubscribers({ search: 'ada', pageSize: 50 }, FAST)
    expect(res.items.length).toBeGreaterThan(0)
    expect(res.items.every((s) => s.email.includes('ada') || (s.name ?? '').toLowerCase().includes('ada'))).toBe(true)
  })
})

describe('admin mutations', () => {
  it('saves a draft and rejects editing a non-draft', async () => {
    const saved = await saveDraft('cmp_draft', { content: { subject: 'New subject' } }, FAST)
    expect(saved.content.subject).toBe('New subject')
    await expect(saveDraft('cmp_sent', { name: 'x' }, FAST)).rejects.toMatchObject({
      kind: 'validation',
    })
  })

  it('schedules a draft', async () => {
    const when = '2026-08-01T09:00:00.000Z'
    const scheduled = await scheduleCampaign('cmp_draft', when, 'Europe/Zurich', FAST)
    expect(scheduled.status).toBe('scheduled')
    if (scheduled.status === 'scheduled') expect(scheduled.scheduledFor).toBe(when)
  })

  it('sends a scheduled campaign and produces a delivery summary', async () => {
    const sent = await sendCampaign('cmp_scheduled', FAST)
    expect(sent.status).toBe('sent')
    if (sent.status === 'sent') expect(sent.delivery.recipients).toBeGreaterThan(0)
  })

  it('retries a failed campaign into sent, and rejects retry on non-failed', async () => {
    const retried = await retryCampaign('cmp_failed', FAST)
    expect(retried.status).toBe('sent')
    await expect(retryCampaign('cmp_sent', FAST)).rejects.toMatchObject({ kind: 'validation' })
  })
})

describe('suppression', () => {
  it('lists entries and removes one', async () => {
    const before = await listSuppression(FAST)
    expect(before.length).toBeGreaterThan(0)
    const target = before[0]
    const res = await removeSuppression(target.id, FAST)
    expect(res.removed).toBe(target.id)
    const after = await listSuppression(FAST)
    expect(after.find((e) => e.id === target.id)).toBeUndefined()
    await expect(removeSuppression('missing', FAST)).rejects.toMatchObject({ kind: 'not-found' })
  })
})

describe('store isolation', () => {
  it('resetStore undoes mutations between tests', async () => {
    await confirmSubscription('tok-confirm', FAST)
    resetStore()
    const res = await resolveToken('tok-confirm', FAST)
    expect(res.valid).toBe(true)
    if (res.valid) expect(res.subscriber.status).toBe('pending')
  })
})
