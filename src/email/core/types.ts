// ============================================================================
// FYLOS · Email & Newsletter frontend · domain types
//
// Framework-agnostic. Everything downstream (mock service, hooks, screens)
// speaks these shapes. There is NO backend and NO email provider: these types
// describe what a real email platform would return, served here entirely by a
// typed in-memory mock (see core/service.ts).
// ============================================================================

/** ISO 8601 timestamp, e.g. "2026-07-15T09:00:00.000Z". */
export type ISODate = string

// ── Newsletter topics a subscriber can opt into ─────────────────────────────

export type TopicKey = 'product' | 'community' | 'care' | 'offers'

export interface TopicDef {
  key: TopicKey
  label: string
  description: string
}

export type EmailFrequency = 'weekly' | 'monthly' | 'important'

export interface FrequencyDef {
  key: EmailFrequency
  label: string
  description: string
}

export type Preferences = {
  topics: Record<TopicKey, boolean>
  frequency: EmailFrequency
}

// ── Subscriber ───────────────────────────────────────────────────────────────

export type SubscriberStatus =
  /** Signed up, not yet confirmed (double opt-in). */
  | 'pending'
  /** Confirmed and receiving mail. */
  | 'subscribed'
  /** Opted out; can resubscribe. */
  | 'unsubscribed'
  /** Hard-blocked (bounce/complaint); cannot be mailed. */
  | 'suppressed'

export interface Subscriber {
  id: string
  email: string
  name: string | null
  status: SubscriberStatus
  preferences: Preferences
  /** Where the sign-up came from, e.g. "Website footer". */
  source: string
  createdAt: ISODate
  confirmedAt: ISODate | null
  unsubscribedAt: ISODate | null
  lastActivityAt: ISODate | null
  /** Lightweight engagement counters. Obvious demo figures, never a public claim. */
  engagement: { sends: number; opens: number; clicks: number }
}

// ── Public link tokens ───────────────────────────────────────────────────────

export type TokenPurpose = 'confirm' | 'manage' | 'unsubscribe' | 'resubscribe'
export type TokenInvalidReason = 'expired' | 'invalid' | 'used'

export type TokenResolution =
  | { valid: true; token: string; purpose: TokenPurpose; subscriber: Subscriber }
  | { valid: false; reason: TokenInvalidReason }

// ── Audience ─────────────────────────────────────────────────────────────────

export interface Audience {
  id: string
  name: string
  description: string
  /** Human-readable rule summary. The mock does not run real segmentation. */
  rule: string
  size: number
  topic: TopicKey | 'all'
  updatedAt: ISODate
}

// ── Delivery ─────────────────────────────────────────────────────────────────

export interface DeliverySummary {
  recipients: number
  delivered: number
  opened: number
  clicked: number
  bounced: number
  unsubscribed: number
  complained: number
  failed: number
}

// ── Campaign (discriminated by status) ───────────────────────────────────────

export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'

export interface CampaignContent {
  subject: string
  preheader: string
  fromName: string
  fromEmail: string
  /** Plain, block-style body text. Intentionally NOT a rich HTML editor. */
  body: string
}

interface CampaignBase {
  id: string
  name: string
  audienceId: string
  content: CampaignContent
  createdAt: ISODate
  updatedAt: ISODate
}

export interface DraftCampaign extends CampaignBase {
  status: 'draft'
}

export interface ScheduledCampaign extends CampaignBase {
  status: 'scheduled'
  scheduledFor: ISODate
  timezone: string
}

export interface SendingCampaign extends CampaignBase {
  status: 'sending'
  startedAt: ISODate
  /** 0..1 progress of the in-flight send. */
  progress: number
}

export interface SentCampaign extends CampaignBase {
  status: 'sent'
  sentAt: ISODate
  delivery: DeliverySummary
}

export interface FailedCampaign extends CampaignBase {
  status: 'failed'
  failedAt: ISODate
  failure: {
    reason: string
    code: string
    attempted: number
    /** What actually went out before the send failed. */
    partial: DeliverySummary
  }
}

export type Campaign =
  | DraftCampaign
  | ScheduledCampaign
  | SendingCampaign
  | SentCampaign
  | FailedCampaign

// ── Suppression list ─────────────────────────────────────────────────────────

export type SuppressionReason = 'bounced' | 'complained' | 'unsubscribed' | 'manual'

export interface SuppressionEntry {
  id: string
  email: string
  reason: SuppressionReason
  detail: string
  addedAt: ISODate
  source: string
}

// ── Paging ───────────────────────────────────────────────────────────────────

export interface Page<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface SubscriberQuery {
  page?: number
  pageSize?: number
  status?: SubscriberStatus | 'all'
  search?: string
}

// ── Typed service error ──────────────────────────────────────────────────────

export type ServiceErrorKind = 'network' | 'server' | 'not-found' | 'validation'

export class ServiceError extends Error {
  readonly kind: ServiceErrorKind
  readonly retryable: boolean
  constructor(kind: ServiceErrorKind, message: string, retryable = false) {
    super(message)
    this.name = 'ServiceError'
    this.kind = kind
    this.retryable = retryable
  }
}
