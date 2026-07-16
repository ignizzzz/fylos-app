// ============================================================================
// Constant catalogs + label/tone maps. Pure data, no React. Screens read these
// so copy and colour stay consistent everywhere.
// ============================================================================
import type {
  CampaignStatus,
  FrequencyDef,
  SubscriberStatus,
  SuppressionReason,
  TopicDef,
} from './types'

/** Badge/pill tones. Mapped to concrete hexes in ui/Badge.tsx. */
export type Tone = 'coral' | 'green' | 'amber' | 'red' | 'slate' | 'blue'

export const TOPICS: readonly TopicDef[] = [
  {
    key: 'product',
    label: 'Product updates',
    description: 'New features and improvements in the Fylos app.',
  },
  {
    key: 'community',
    label: 'Neighborhood',
    description: 'Local pet community stories and meetups near you.',
  },
  {
    key: 'care',
    label: 'Pet care tips',
    description: 'Seasonal care, health reminders, and vet-reviewed advice.',
  },
  {
    key: 'offers',
    label: 'Offers and perks',
    description: 'Occasional partner offers. Never more than a couple a month.',
  },
]

export const FREQUENCIES: readonly FrequencyDef[] = [
  { key: 'weekly', label: 'Weekly', description: 'A short digest every week.' },
  { key: 'monthly', label: 'Monthly', description: 'One roundup a month.' },
  {
    key: 'important',
    label: 'Only important',
    description: 'Just the essentials, a few times a year.',
  },
]

// ── Status → label + tone ────────────────────────────────────────────────────

export const SUBSCRIBER_STATUS: Record<SubscriberStatus, { label: string; tone: Tone }> = {
  pending: { label: 'Pending', tone: 'amber' },
  subscribed: { label: 'Subscribed', tone: 'green' },
  unsubscribed: { label: 'Unsubscribed', tone: 'slate' },
  suppressed: { label: 'Suppressed', tone: 'red' },
}

export const CAMPAIGN_STATUS: Record<
  CampaignStatus,
  { label: string; tone: Tone; live?: boolean }
> = {
  draft: { label: 'Draft', tone: 'slate' },
  scheduled: { label: 'Scheduled', tone: 'blue' },
  sending: { label: 'Sending', tone: 'coral', live: true },
  sent: { label: 'Sent', tone: 'green' },
  failed: { label: 'Failed', tone: 'red' },
}

export const SUPPRESSION_REASON: Record<SuppressionReason, { label: string; tone: Tone }> = {
  bounced: { label: 'Bounced', tone: 'red' },
  complained: { label: 'Complaint', tone: 'red' },
  unsubscribed: { label: 'Unsubscribed', tone: 'slate' },
  manual: { label: 'Manual', tone: 'blue' },
}
