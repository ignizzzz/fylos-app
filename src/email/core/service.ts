// ============================================================================
// Typed mock service. No network, no email provider. Every method is async and
// honours the active MockScenario (ok / empty / error / loading) plus a
// simulated latency, so the UI can be reviewed in each state. A small in-memory
// store makes the write flows (confirm, unsubscribe, save draft, send, retry)
// behave for the length of a session. resetStore() restores the seed.
// ============================================================================
import type {
  Audience,
  Campaign,
  CampaignContent,
  DeliverySummary,
  EmailFrequency,
  Page,
  Preferences,
  Subscriber,
  SubscriberQuery,
  SuppressionEntry,
  TokenPurpose,
  TokenResolution,
} from './types'
import { ServiceError } from './types'
import type { MockOptions } from './mockConfig'
import { getMockConfig } from './mockConfig'
import {
  AUDIENCES,
  CAMPAIGNS,
  EXPIRED_TOKENS,
  PUBLIC_TOKENS,
  SUBSCRIBERS,
  SUPPRESSION,
  USED_TOKENS,
} from './seed'

// ── Store ────────────────────────────────────────────────────────────────────

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

interface Store {
  subscribers: Subscriber[]
  campaigns: Campaign[]
  audiences: Audience[]
  suppression: SuppressionEntry[]
}

function seedStore(): Store {
  return {
    subscribers: clone(SUBSCRIBERS),
    campaigns: clone(CAMPAIGNS),
    audiences: clone(AUDIENCES),
    suppression: clone(SUPPRESSION),
  }
}

let store: Store = seedStore()

/** Restore the store to the seed. Tests call this in beforeEach. */
export function resetStore(): void {
  store = seedStore()
}

// ── Scenario plumbing ────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

interface Producers<T> {
  ok: () => T
  /** Only used by the 'empty' scenario; falls back to ok when absent. */
  empty?: () => T
}

/**
 * Resolve/reject a call according to the active scenario:
 *   loading → never settles (skeletons stay up)
 *   error   → rejects with a retryable network ServiceError
 *   empty   → runs the empty producer (or ok if none)
 *   ok      → runs the ok producer
 * Domain errors (not-found, validation) are thrown inside the ok producer.
 */
async function settle<T>(opts: MockOptions, producers: Producers<T>): Promise<T> {
  const cfg = getMockConfig(opts)
  if (cfg.scenario === 'loading') {
    return new Promise<T>(() => {
      /* intentionally never resolves */
    })
  }
  await delay(cfg.latencyMs)
  if (cfg.scenario === 'error') {
    throw new ServiceError('network', 'Could not reach the mail service. Please try again.', true)
  }
  if (cfg.scenario === 'empty' && producers.empty) {
    return producers.empty()
  }
  return producers.ok()
}

// ── Internal helpers ─────────────────────────────────────────────────────────

const DEFAULT_PAGE_SIZE = 10

function requireSubscriber(id: string): Subscriber {
  const found = store.subscribers.find((s) => s.id === id)
  if (!found) throw new ServiceError('not-found', 'That subscriber could not be found.')
  return found
}

function requireCampaign(id: string): Campaign {
  const found = store.campaigns.find((c) => c.id === id)
  if (!found) throw new ServiceError('not-found', 'That campaign could not be found.')
  return found
}

function subscriberForToken(token: string): Subscriber {
  const entry = PUBLIC_TOKENS[token]
  if (!entry) throw new ServiceError('not-found', 'This link is not valid.')
  return requireSubscriber(entry.subscriberId)
}

// ── Public: link tokens + subscriber lifecycle ───────────────────────────────

export function resolveToken(token: string, opts: MockOptions = {}): Promise<TokenResolution> {
  return settle(opts, {
    ok: (): TokenResolution => {
      if (EXPIRED_TOKENS.has(token)) return { valid: false, reason: 'expired' }
      if (USED_TOKENS.has(token)) return { valid: false, reason: 'used' }
      const entry = PUBLIC_TOKENS[token]
      if (!entry) return { valid: false, reason: 'invalid' }
      const subscriber = store.subscribers.find((s) => s.id === entry.subscriberId)
      if (!subscriber) return { valid: false, reason: 'invalid' }
      return {
        valid: true,
        token,
        purpose: entry.purpose as TokenPurpose,
        subscriber: clone(subscriber),
      }
    },
  })
}

export function confirmSubscription(token: string, opts: MockOptions = {}): Promise<Subscriber> {
  return settle(opts, {
    ok: () => {
      const sub = subscriberForToken(token)
      if (sub.status === 'pending') {
        sub.status = 'subscribed'
        sub.confirmedAt = new Date().toISOString()
        sub.lastActivityAt = sub.confirmedAt
      }
      return clone(sub)
    },
  })
}

export function getSubscriberByToken(token: string, opts: MockOptions = {}): Promise<Subscriber> {
  return settle(opts, { ok: () => clone(subscriberForToken(token)) })
}

export function updatePreferences(
  token: string,
  next: Preferences,
  opts: MockOptions = {},
): Promise<Subscriber> {
  return settle(opts, {
    ok: () => {
      const sub = subscriberForToken(token)
      const anyTopic = Object.values(next.topics).some(Boolean)
      if (!anyTopic) {
        throw new ServiceError(
          'validation',
          'Choose at least one topic, or use unsubscribe to stop all emails.',
        )
      }
      sub.preferences = clone(next)
      sub.lastActivityAt = new Date().toISOString()
      return clone(sub)
    },
  })
}

export function unsubscribe(token: string, opts: MockOptions = {}): Promise<Subscriber> {
  return settle(opts, {
    ok: () => {
      const sub = subscriberForToken(token)
      sub.status = 'unsubscribed'
      sub.unsubscribedAt = new Date().toISOString()
      return clone(sub)
    },
  })
}

export function resubscribe(token: string, opts: MockOptions = {}): Promise<Subscriber> {
  return settle(opts, {
    ok: () => {
      const sub = subscriberForToken(token)
      if (sub.status === 'suppressed') {
        throw new ServiceError(
          'validation',
          'This address is on the suppression list and cannot be resubscribed here.',
        )
      }
      sub.status = 'subscribed'
      sub.unsubscribedAt = null
      sub.lastActivityAt = new Date().toISOString()
      return clone(sub)
    },
  })
}

// ── Admin: campaigns ─────────────────────────────────────────────────────────

export function listCampaigns(opts: MockOptions = {}): Promise<Campaign[]> {
  return settle(opts, {
    ok: () => clone(store.campaigns),
    empty: () => [],
  })
}

export function getCampaign(id: string, opts: MockOptions = {}): Promise<Campaign> {
  return settle(opts, { ok: () => clone(requireCampaign(id)) })
}

export function saveDraft(
  id: string,
  patch: Partial<Pick<Campaign, 'name' | 'audienceId'>> & { content?: Partial<CampaignContent> },
  opts: MockOptions = {},
): Promise<Campaign> {
  return settle(opts, {
    ok: () => {
      const campaign = requireCampaign(id)
      if (campaign.status !== 'draft') {
        throw new ServiceError('validation', 'Only a draft can be edited.')
      }
      if (patch.name !== undefined) campaign.name = patch.name
      if (patch.audienceId !== undefined) campaign.audienceId = patch.audienceId
      if (patch.content) campaign.content = { ...campaign.content, ...patch.content }
      campaign.updatedAt = new Date().toISOString()
      return clone(campaign)
    },
  })
}

export function scheduleCampaign(
  id: string,
  scheduledFor: string,
  timezone: string,
  opts: MockOptions = {},
): Promise<Campaign> {
  return settle(opts, {
    ok: () => {
      const current = requireCampaign(id)
      const next: Campaign = {
        id: current.id,
        name: current.name,
        audienceId: current.audienceId,
        content: current.content,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
        status: 'scheduled',
        scheduledFor,
        timezone,
      }
      replaceCampaign(next)
      return clone(next)
    },
  })
}

export function sendCampaign(id: string, opts: MockOptions = {}): Promise<Campaign> {
  return settle(opts, {
    ok: () => {
      const current = requireCampaign(id)
      const audience = store.audiences.find((a) => a.id === current.audienceId)
      const recipients = audience?.size ?? 0
      const delivery = buildDelivery(recipients)
      const next: Campaign = {
        id: current.id,
        name: current.name,
        audienceId: current.audienceId,
        content: current.content,
        createdAt: current.createdAt,
        updatedAt: new Date().toISOString(),
        status: 'sent',
        sentAt: new Date().toISOString(),
        delivery,
      }
      replaceCampaign(next)
      return clone(next)
    },
  })
}

export function retryCampaign(id: string, opts: MockOptions = {}): Promise<Campaign> {
  return settle(opts, {
    ok: () => {
      const current = requireCampaign(id)
      if (current.status !== 'failed') {
        throw new ServiceError('validation', 'Only a failed campaign can be retried.')
      }
      return sendNow(current)
    },
  })
}

function sendNow(current: Campaign): Campaign {
  const audience = store.audiences.find((a) => a.id === current.audienceId)
  const recipients = audience?.size ?? 0
  const next: Campaign = {
    id: current.id,
    name: current.name,
    audienceId: current.audienceId,
    content: current.content,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
    status: 'sent',
    sentAt: new Date().toISOString(),
    delivery: buildDelivery(recipients),
  }
  replaceCampaign(next)
  return clone(next)
}

function replaceCampaign(next: Campaign): void {
  const idx = store.campaigns.findIndex((c) => c.id === next.id)
  if (idx >= 0) store.campaigns[idx] = next
}

function buildDelivery(recipients: number): DeliverySummary {
  // Deterministic, plausible demo ratios. Never a real-world claim.
  const delivered = Math.max(0, recipients - 1)
  const opened = Math.round(delivered * 0.58)
  const clicked = Math.round(delivered * 0.16)
  return {
    recipients,
    delivered,
    opened,
    clicked,
    bounced: recipients - delivered,
    unsubscribed: recipients > 10 ? 1 : 0,
    complained: 0,
    failed: 0,
  }
}

export function getDeliverySummary(id: string, opts: MockOptions = {}): Promise<DeliverySummary> {
  return settle(opts, {
    ok: () => {
      const campaign = requireCampaign(id)
      if (campaign.status === 'sent') return clone(campaign.delivery)
      if (campaign.status === 'failed') return clone(campaign.failure.partial)
      throw new ServiceError('validation', 'This campaign has no delivery summary yet.')
    },
  })
}

// ── Admin: audiences ─────────────────────────────────────────────────────────

export function listAudiences(opts: MockOptions = {}): Promise<Audience[]> {
  return settle(opts, {
    ok: () => clone(store.audiences),
    empty: () => [],
  })
}

export function getAudience(id: string, opts: MockOptions = {}): Promise<Audience> {
  return settle(opts, {
    ok: () => {
      const found = store.audiences.find((a) => a.id === id)
      if (!found) throw new ServiceError('not-found', 'That audience could not be found.')
      return clone(found)
    },
  })
}

// ── Admin: subscribers ───────────────────────────────────────────────────────

function matchesQuery(sub: Subscriber, query: SubscriberQuery): boolean {
  const statusOk = !query.status || query.status === 'all' || sub.status === query.status
  const term = (query.search ?? '').trim().toLowerCase()
  const searchOk =
    term.length === 0 ||
    sub.email.toLowerCase().includes(term) ||
    (sub.name ?? '').toLowerCase().includes(term)
  return statusOk && searchOk
}

function paginate(items: Subscriber[], query: SubscriberQuery): Page<Subscriber> {
  const page = Math.max(1, query.page ?? 1)
  const pageSize = Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE)
  const start = (page - 1) * pageSize
  const slice = items.slice(start, start + pageSize)
  return {
    items: clone(slice),
    total: items.length,
    page,
    pageSize,
    hasMore: start + pageSize < items.length,
  }
}

export function listSubscribers(
  query: SubscriberQuery = {},
  opts: MockOptions = {},
): Promise<Page<Subscriber>> {
  return settle(opts, {
    ok: () => paginate(store.subscribers.filter((s) => matchesQuery(s, query)), query),
    empty: () => ({
      items: [],
      total: 0,
      page: Math.max(1, query.page ?? 1),
      pageSize: Math.max(1, query.pageSize ?? DEFAULT_PAGE_SIZE),
      hasMore: false,
    }),
  })
}

export function getSubscriber(id: string, opts: MockOptions = {}): Promise<Subscriber> {
  return settle(opts, { ok: () => clone(requireSubscriber(id)) })
}

// ── Admin: suppression ───────────────────────────────────────────────────────

export function listSuppression(opts: MockOptions = {}): Promise<SuppressionEntry[]> {
  return settle(opts, {
    ok: () => clone(store.suppression),
    empty: () => [],
  })
}

export function removeSuppression(id: string, opts: MockOptions = {}): Promise<{ removed: string }> {
  return settle(opts, {
    ok: () => {
      const idx = store.suppression.findIndex((s) => s.id === id)
      if (idx < 0) throw new ServiceError('not-found', 'That entry is not on the suppression list.')
      store.suppression.splice(idx, 1)
      return { removed: id }
    },
  })
}

// ── Convenience re-exports for callers that want an object ────────────────────

export const emailService = {
  resolveToken,
  confirmSubscription,
  getSubscriberByToken,
  updatePreferences,
  unsubscribe,
  resubscribe,
  listCampaigns,
  getCampaign,
  saveDraft,
  scheduleCampaign,
  sendCampaign,
  retryCampaign,
  getDeliverySummary,
  listAudiences,
  getAudience,
  listSubscribers,
  getSubscriber,
  listSuppression,
  removeSuppression,
  resetStore,
}

export type { EmailFrequency }
