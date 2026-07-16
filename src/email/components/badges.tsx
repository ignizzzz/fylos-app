import type { CampaignStatus, SubscriberStatus, SuppressionReason } from '../core/types'
import { CAMPAIGN_STATUS, SUBSCRIBER_STATUS, SUPPRESSION_REASON } from '../core/catalog'
import { Badge } from '../ui'

export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const m = CAMPAIGN_STATUS[status]
  return (
    <Badge tone={m.tone} live={m.live}>
      {m.label}
    </Badge>
  )
}

export function SubscriberStatusBadge({ status }: { status: SubscriberStatus }) {
  const m = SUBSCRIBER_STATUS[status]
  return <Badge tone={m.tone}>{m.label}</Badge>
}

export function SuppressionReasonBadge({ reason }: { reason: SuppressionReason }) {
  const m = SUPPRESSION_REASON[reason]
  return <Badge tone={m.tone}>{m.label}</Badge>
}
