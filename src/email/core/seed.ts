// ============================================================================
// Seed data for the mock. This is OBVIOUS demo data (all addresses @example.com)
// used to render a design viewer. It is not real, not public-facing, and makes
// no claim about actual subscribers or delivery. Deterministic: no Date.now, no
// Math.random, so the viewer and tests are stable.
// ============================================================================
import type {
  Audience,
  Campaign,
  DeliverySummary,
  Preferences,
  Subscriber,
  SuppressionEntry,
  TokenPurpose,
} from './types'

// Anchor "now" for the demo. Everything else is expressed relative to this.
export const NOW = '2026-07-15T09:00:00.000Z'

function daysAgo(n: number): string {
  const base = Date.parse(NOW)
  return new Date(base - n * 86_400_000).toISOString()
}

function daysAhead(n: number): string {
  const base = Date.parse(NOW)
  return new Date(base + n * 86_400_000).toISOString()
}

function prefs(
  topics: Partial<Preferences['topics']>,
  frequency: Preferences['frequency'] = 'monthly',
): Preferences {
  return {
    topics: {
      product: topics.product ?? false,
      community: topics.community ?? false,
      care: topics.care ?? false,
      offers: topics.offers ?? false,
    },
    frequency,
  }
}

// ── Subscribers ──────────────────────────────────────────────────────────────

interface SeedSub {
  id: string
  email: string
  name: string | null
  status: Subscriber['status']
  source: string
  createdDaysAgo: number
  prefs: Preferences
  engagement: Subscriber['engagement']
}

const SUB_SEED: SeedSub[] = [
  { id: 'sub_001', email: 'ada@example.com', name: 'Ada N.', status: 'subscribed', source: 'App onboarding', createdDaysAgo: 210, prefs: prefs({ product: true, care: true }, 'weekly'), engagement: { sends: 41, opens: 33, clicks: 12 } },
  { id: 'sub_002', email: 'bruno@example.com', name: 'Bruno K.', status: 'subscribed', source: 'Website footer', createdDaysAgo: 180, prefs: prefs({ community: true, care: true }), engagement: { sends: 36, opens: 20, clicks: 5 } },
  { id: 'sub_003', email: 'chiara@example.com', name: 'Chiara V.', status: 'pending', source: 'Website footer', createdDaysAgo: 1, prefs: prefs({ product: true, community: true, care: true }), engagement: { sends: 0, opens: 0, clicks: 0 } },
  { id: 'sub_004', email: 'deniz@example.com', name: 'Deniz A.', status: 'subscribed', source: 'Referral', createdDaysAgo: 95, prefs: prefs({ product: true, community: true, care: true, offers: true }, 'weekly'), engagement: { sends: 22, opens: 19, clicks: 9 } },
  { id: 'sub_005', email: 'eleni@example.com', name: 'Eleni P.', status: 'unsubscribed', source: 'App onboarding', createdDaysAgo: 260, prefs: prefs({ offers: true }), engagement: { sends: 50, opens: 8, clicks: 1 } },
  { id: 'sub_006', email: 'farid@example.com', name: 'Farid H.', status: 'subscribed', source: 'Website footer', createdDaysAgo: 44, prefs: prefs({ care: true }, 'important'), engagement: { sends: 10, opens: 7, clicks: 2 } },
  { id: 'sub_007', email: 'greta@example.com', name: 'Greta M.', status: 'suppressed', source: 'Website footer', createdDaysAgo: 300, prefs: prefs({ product: true }), engagement: { sends: 48, opens: 2, clicks: 0 } },
  { id: 'sub_008', email: 'hassan@example.com', name: 'Hassan D.', status: 'subscribed', source: 'Event booth', createdDaysAgo: 30, prefs: prefs({ community: true, offers: true }), engagement: { sends: 6, opens: 5, clicks: 3 } },
  { id: 'sub_009', email: 'ines@example.com', name: 'Ines R.', status: 'subscribed', source: 'App onboarding', createdDaysAgo: 150, prefs: prefs({ product: true, care: true }, 'weekly'), engagement: { sends: 30, opens: 24, clicks: 11 } },
  { id: 'sub_010', email: 'jonas@example.com', name: 'Jonas W.', status: 'pending', source: 'Referral', createdDaysAgo: 2, prefs: prefs({ community: true }), engagement: { sends: 0, opens: 0, clicks: 0 } },
  { id: 'sub_011', email: 'kaya@example.com', name: 'Kaya T.', status: 'subscribed', source: 'Website footer', createdDaysAgo: 120, prefs: prefs({ product: true, community: true }), engagement: { sends: 26, opens: 18, clicks: 6 } },
  { id: 'sub_012', email: 'liam@example.com', name: 'Liam O.', status: 'unsubscribed', source: 'Event booth', createdDaysAgo: 200, prefs: prefs({ offers: true }), engagement: { sends: 40, opens: 6, clicks: 0 } },
  { id: 'sub_013', email: 'mara@example.com', name: 'Mara S.', status: 'subscribed', source: 'App onboarding', createdDaysAgo: 66, prefs: prefs({ care: true, community: true }), engagement: { sends: 14, opens: 11, clicks: 4 } },
  { id: 'sub_014', email: 'noor@example.com', name: 'Noor F.', status: 'subscribed', source: 'Referral', createdDaysAgo: 88, prefs: prefs({ product: true }, 'important'), engagement: { sends: 18, opens: 9, clicks: 2 } },
  { id: 'sub_015', email: 'omar@example.com', name: 'Omar L.', status: 'suppressed', source: 'Website footer', createdDaysAgo: 240, prefs: prefs({ product: true, offers: true }), engagement: { sends: 44, opens: 1, clicks: 0 } },
  { id: 'sub_016', email: 'petra@example.com', name: 'Petra J.', status: 'subscribed', source: 'App onboarding', createdDaysAgo: 12, prefs: prefs({ product: true, community: true, care: true }, 'weekly'), engagement: { sends: 3, opens: 3, clicks: 1 } },
  { id: 'sub_017', email: 'quinn@example.com', name: null, status: 'pending', source: 'Website footer', createdDaysAgo: 0, prefs: prefs({ care: true }), engagement: { sends: 0, opens: 0, clicks: 0 } },
  { id: 'sub_018', email: 'rosa@example.com', name: 'Rosa B.', status: 'subscribed', source: 'Event booth', createdDaysAgo: 175, prefs: prefs({ community: true, offers: true }), engagement: { sends: 34, opens: 22, clicks: 7 } },
  { id: 'sub_019', email: 'sami@example.com', name: 'Sami C.', status: 'subscribed', source: 'Referral', createdDaysAgo: 58, prefs: prefs({ product: true, care: true }), engagement: { sends: 12, opens: 10, clicks: 5 } },
  { id: 'sub_020', email: 'tessa@example.com', name: 'Tessa G.', status: 'unsubscribed', source: 'App onboarding', createdDaysAgo: 220, prefs: prefs({ offers: true }), engagement: { sends: 38, opens: 4, clicks: 0 } },
  { id: 'sub_021', email: 'umar@example.com', name: 'Umar E.', status: 'subscribed', source: 'Website footer', createdDaysAgo: 27, prefs: prefs({ product: true, community: true }), engagement: { sends: 7, opens: 6, clicks: 2 } },
  { id: 'sub_022', email: 'vera@example.com', name: 'Vera Z.', status: 'subscribed', source: 'App onboarding', createdDaysAgo: 133, prefs: prefs({ care: true }, 'important'), engagement: { sends: 25, opens: 15, clicks: 3 } },
  { id: 'sub_023', email: 'will@example.com', name: 'Will Q.', status: 'subscribed', source: 'Referral', createdDaysAgo: 71, prefs: prefs({ product: true, community: true, care: true, offers: true }), engagement: { sends: 16, opens: 13, clicks: 8 } },
  { id: 'sub_024', email: 'yara@example.com', name: 'Yara I.', status: 'subscribed', source: 'Event booth', createdDaysAgo: 5, prefs: prefs({ community: true, care: true }, 'weekly'), engagement: { sends: 2, opens: 2, clicks: 1 } },
]

function buildSubscriber(s: SeedSub): Subscriber {
  const confirmed = s.status === 'subscribed' || s.status === 'unsubscribed' || s.status === 'suppressed'
  return {
    id: s.id,
    email: s.email,
    name: s.name,
    status: s.status,
    preferences: s.prefs,
    source: s.source,
    createdAt: daysAgo(s.createdDaysAgo),
    confirmedAt: confirmed ? daysAgo(Math.max(0, s.createdDaysAgo - 1)) : null,
    unsubscribedAt: s.status === 'unsubscribed' ? daysAgo(Math.floor(s.createdDaysAgo / 2)) : null,
    lastActivityAt: s.engagement.sends > 0 ? daysAgo(Math.min(s.createdDaysAgo, 9)) : null,
    engagement: s.engagement,
  }
}

export const SUBSCRIBERS: Subscriber[] = SUB_SEED.map(buildSubscriber)

/** A stable token → subscriber map for the public link flows. */
export const PUBLIC_TOKENS: Record<string, { purpose: TokenPurpose; subscriberId: string }> = {
  'tok-confirm': { purpose: 'confirm', subscriberId: 'sub_003' },
  'tok-manage': { purpose: 'manage', subscriberId: 'sub_001' },
  'tok-unsub': { purpose: 'unsubscribe', subscriberId: 'sub_002' },
  'tok-resub': { purpose: 'resubscribe', subscriberId: 'sub_005' },
}

// Tokens that resolve to a specific invalid reason (for the expired/invalid UI).
export const EXPIRED_TOKENS = new Set(['tok-expired'])
export const USED_TOKENS = new Set(['tok-used'])

// ── Audiences ────────────────────────────────────────────────────────────────

export const AUDIENCES: Audience[] = [
  { id: 'aud_all', name: 'All subscribers', description: 'Everyone confirmed and receiving mail.', rule: 'status is subscribed', size: 18, topic: 'all', updatedAt: daysAgo(1) },
  { id: 'aud_product', name: 'Product updates', description: 'Opted into product news.', rule: 'topic product is on', size: 11, topic: 'product', updatedAt: daysAgo(2) },
  { id: 'aud_care', name: 'Pet care tips', description: 'Opted into care tips.', rule: 'topic care is on', size: 12, topic: 'care', updatedAt: daysAgo(3) },
  { id: 'aud_community', name: 'Neighborhood', description: 'Opted into community stories.', rule: 'topic community is on', size: 13, topic: 'community', updatedAt: daysAgo(2) },
  { id: 'aud_offers', name: 'Offers and perks', description: 'Opted into occasional offers.', rule: 'topic offers is on', size: 6, topic: 'offers', updatedAt: daysAgo(6) },
  { id: 'aud_active', name: 'Recently active', description: 'Opened an email in the last 30 days.', rule: 'opened within 30 days', size: 9, topic: 'all', updatedAt: daysAgo(1) },
]

// ── Delivery summaries ───────────────────────────────────────────────────────

const DELIVERY_JUNE: DeliverySummary = {
  recipients: 18,
  delivered: 18,
  opened: 11,
  clicked: 4,
  bounced: 0,
  unsubscribed: 1,
  complained: 0,
  failed: 0,
}

const DELIVERY_FAILED_PARTIAL: DeliverySummary = {
  recipients: 12,
  delivered: 3,
  opened: 1,
  clicked: 0,
  bounced: 1,
  unsubscribed: 0,
  complained: 0,
  failed: 9,
}

// ── Campaigns (one of each status) ───────────────────────────────────────────

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_draft',
    name: 'July care tips',
    status: 'draft',
    audienceId: 'aud_care',
    content: {
      subject: 'Keeping paws cool this July',
      preheader: 'Three small things that help in the heat.',
      fromName: 'Fylos',
      fromEmail: 'hello@fylos.me',
      body: 'Hi there,\n\nSummer is here. A few gentle reminders to keep your dog comfortable when it warms up.\n\n1. Walk early or late, skip the midday sun.\n2. Test the pavement with the back of your hand.\n3. Fresh water, always.\n\nStay cool,\nThe Fylos neighborhood',
    },
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    id: 'cmp_scheduled',
    name: 'August neighborhood meetups',
    status: 'scheduled',
    audienceId: 'aud_community',
    scheduledFor: daysAhead(6),
    timezone: 'Europe/Zurich',
    content: {
      subject: 'Meetups near you in August',
      preheader: 'Walks, playdates, and one very good park day.',
      fromName: 'Fylos',
      fromEmail: 'hello@fylos.me',
      body: 'Your neighborhood is planning a few get-togethers in August. Here is what is coming up close to you.',
    },
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    id: 'cmp_sending',
    name: 'Shared albums are here',
    status: 'sending',
    audienceId: 'aud_product',
    startedAt: NOW,
    progress: 0.62,
    content: {
      subject: 'A new way to share your pet moments',
      preheader: 'Shared albums, now in the app.',
      fromName: 'Fylos',
      fromEmail: 'hello@fylos.me',
      body: 'You can now build a shared album with the people who love your pet too. Here is how it works.',
    },
    createdAt: daysAgo(2),
    updatedAt: NOW,
  },
  {
    id: 'cmp_sent',
    name: 'June neighborhood roundup',
    status: 'sent',
    audienceId: 'aud_all',
    sentAt: daysAgo(21),
    delivery: DELIVERY_JUNE,
    content: {
      subject: 'What happened in the neighborhood in June',
      preheader: 'New parks, new faces, and a few good walks.',
      fromName: 'Fylos',
      fromEmail: 'hello@fylos.me',
      body: 'June was a good month. Here is a short roundup of what your local pet community got up to.',
    },
    createdAt: daysAgo(24),
    updatedAt: daysAgo(21),
  },
  {
    id: 'cmp_failed',
    name: 'Spring offers',
    status: 'failed',
    audienceId: 'aud_offers',
    failedAt: daysAgo(40),
    failure: {
      reason: 'The send stopped part way through. The mock sending service reported a temporary outage.',
      code: 'SEND_INTERRUPTED',
      attempted: 12,
      partial: DELIVERY_FAILED_PARTIAL,
    },
    content: {
      subject: 'A few spring perks for you and your dog',
      preheader: 'Hand picked, only a couple.',
      fromName: 'Fylos',
      fromEmail: 'hello@fylos.me',
      body: 'A small set of seasonal offers from partners in your area. Only the ones we would use ourselves.',
    },
    createdAt: daysAgo(43),
    updatedAt: daysAgo(40),
  },
]

// ── Suppression list ─────────────────────────────────────────────────────────

export const SUPPRESSION: SuppressionEntry[] = [
  { id: 'sup_001', email: 'greta@example.com', reason: 'bounced', detail: 'Mailbox does not exist (hard bounce).', addedAt: daysAgo(35), source: 'Automatic' },
  { id: 'sup_002', email: 'omar@example.com', reason: 'complained', detail: 'Marked a message as spam.', addedAt: daysAgo(48), source: 'Automatic' },
  { id: 'sup_003', email: 'old-address@example.com', reason: 'bounced', detail: 'Domain not found (hard bounce).', addedAt: daysAgo(60), source: 'Automatic' },
  { id: 'sup_004', email: 'no-thanks@example.com', reason: 'unsubscribed', detail: 'Used the unsubscribe link.', addedAt: daysAgo(12), source: 'Subscriber' },
  { id: 'sup_005', email: 'blocked@example.com', reason: 'manual', detail: 'Added by the team on request.', addedAt: daysAgo(7), source: 'Team' },
  { id: 'sup_006', email: 'full-inbox@example.com', reason: 'bounced', detail: 'Mailbox full (repeated soft bounce).', addedAt: daysAgo(3), source: 'Automatic' },
]
