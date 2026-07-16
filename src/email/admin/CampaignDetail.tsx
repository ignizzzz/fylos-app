import type { ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { Eye, Pencil, RefreshCw, Send, Users } from 'lucide-react'
import type { Audience, Campaign } from '../core/types'
import { retryCampaign, sendCampaign } from '../core/service'
import { NOW } from '../core/seed'
import { formatCount, formatDateTime, relativeDays } from '../core/format'
import { useAudiences, useCampaign } from '../hooks/data'
import { useAction } from '../hooks/useAction'
import { paths } from '../routes'
import { AdminShell } from '../layout/AdminShell'
import { CampaignStatusBadge } from '../components/badges'
import { DeliverySummaryPanel } from '../components/DeliverySummaryPanel'
import {
  Async,
  Button,
  ButtonLink,
  Card,
  Divider,
  KeyValue,
  LoadingBlock,
  Notice,
  SectionLabel,
  C,
} from '../ui'

/** First couple of body lines, flattened for a calm one paragraph preview. */
function bodyPreview(body: string): string {
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(' ')
}

/** Header buttons that change with the campaign's status. */
function headerActions(campaign: Campaign, onSend: () => void, sendPending: boolean): ReactNode {
  if (campaign.status === 'draft') {
    return (
      <>
        <ButtonLink
          to={paths.campaignPreview(campaign.id)}
          variant="ghost"
          size="sm"
          leadIcon={<Eye size={15} strokeWidth={2.2} />}
        >
          Preview
        </ButtonLink>
        <ButtonLink
          to={paths.campaignEdit(campaign.id)}
          variant="secondary"
          size="sm"
          leadIcon={<Pencil size={15} strokeWidth={2.2} />}
        >
          Edit
        </ButtonLink>
        <Button
          variant="primary"
          size="sm"
          disabled={sendPending}
          onClick={onSend}
          leadIcon={<Send size={15} strokeWidth={2.2} />}
        >
          {sendPending ? 'Sending' : 'Send now'}
        </Button>
      </>
    )
  }
  if (campaign.status === 'scheduled') {
    return (
      <ButtonLink
        to={paths.campaignPreview(campaign.id)}
        variant="ghost"
        size="sm"
        leadIcon={<Eye size={15} strokeWidth={2.2} />}
      >
        Preview
      </ButtonLink>
    )
  }
  return null
}

/** The status specific body. The union narrows on campaign.status here. */
function StatusSection({
  campaign,
  sendError,
  onRetry,
  retryPending,
  retryError,
}: {
  campaign: Campaign
  sendError: Error | null
  onRetry: () => void
  retryPending: boolean
  retryError: Error | null
}) {
  switch (campaign.status) {
    case 'draft':
      return (
        <div className="flex flex-col gap-4">
          <Notice tone="slate" title="This is a draft">
            Nothing has gone out yet. Edit the content or audience, preview it, then send when you are
            happy with it.
          </Notice>
          {sendError && (
            <Notice tone="red" title="That send did not go through">
              {sendError.message}
            </Notice>
          )}
        </div>
      )
    case 'scheduled':
      return (
        <Card radius="grouped">
          <SectionLabel>Scheduled</SectionLabel>
          <div className="mt-2">
            <KeyValue label="Goes out">{formatDateTime(campaign.scheduledFor)}</KeyValue>
            <Divider />
            <KeyValue label="That is">{relativeDays(campaign.scheduledFor, NOW)}</KeyValue>
            <Divider />
            <KeyValue label="Timezone">{campaign.timezone}</KeyValue>
          </div>
        </Card>
      )
    case 'sending':
      return (
        <Card radius="grouped">
          <div className="flex items-center justify-between gap-3 mb-3">
            <SectionLabel>Sending now</SectionLabel>
            <CampaignStatusBadge status="sending" />
          </div>
          <div className="h-2.5 w-full rounded-full overflow-hidden" style={{ background: C.chip }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.round(campaign.progress * 100)}%`, background: C.coral }}
            />
          </div>
          <p className="mt-2 text-[13px]" style={{ color: C.ink2 }}>
            {Math.round(campaign.progress * 100)}% delivered so far. This page does not refresh on its
            own.
          </p>
        </Card>
      )
    case 'sent':
      return (
        <div className="flex flex-col gap-4">
          <Card radius="grouped">
            <SectionLabel>Sent</SectionLabel>
            <div className="mt-2">
              <KeyValue label="Sent on">{formatDateTime(campaign.sentAt)}</KeyValue>
              <Divider />
              <KeyValue label="That was">{relativeDays(campaign.sentAt, NOW)}</KeyValue>
            </div>
          </Card>
          <DeliverySummaryPanel delivery={campaign.delivery} />
        </div>
      )
    case 'failed':
      return (
        <div className="flex flex-col gap-4">
          <Notice tone="red" title="This send failed">
            {campaign.failure.reason} Code: {campaign.failure.code}.
          </Notice>
          <DeliverySummaryPanel delivery={campaign.failure.partial} title="Partial delivery" />
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              disabled={retryPending}
              onClick={onRetry}
              leadIcon={<RefreshCw size={16} strokeWidth={2.2} />}
            >
              {retryPending ? 'Retrying' : 'Retry send'}
            </Button>
            <span className="text-[12.5px]" style={{ color: C.ink3 }}>
              Failed {relativeDays(campaign.failedAt, NOW)}
            </span>
          </div>
          {retryError && (
            <Notice tone="red" title="Retry did not go through">
              {retryError.message}
            </Notice>
          )}
        </div>
      )
  }
}

/** Shared content card shown for every status. */
function ContentSummary({ campaign, audience }: { campaign: Campaign; audience: Audience | undefined }) {
  const { subject, preheader, fromName, fromEmail, body } = campaign.content
  const isDraft = campaign.status === 'draft'
  const audienceLabel = audience
    ? `${audience.name}, ${formatCount(audience.size)} people`
    : campaign.audienceId

  return (
    <Card radius="grouped">
      <SectionLabel>Content summary</SectionLabel>
      <div className="mt-2">
        <KeyValue label="Subject">{subject}</KeyValue>
        <Divider />
        <KeyValue label="Preheader">{preheader}</KeyValue>
        <Divider />
        <KeyValue label="From">{`${fromName}, ${fromEmail}`}</KeyValue>
        <Divider />
        <KeyValue label="Audience">{audienceLabel}</KeyValue>
      </div>
      <div className="mt-4">
        <SectionLabel>Body preview</SectionLabel>
        <p className="mt-2 text-[13.5px] leading-[1.6]" style={{ color: C.ink2 }}>
          {bodyPreview(body)}
        </p>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <ButtonLink
          to={paths.campaignPreview(campaign.id)}
          variant="ghost"
          size="sm"
          leadIcon={<Eye size={15} strokeWidth={2.2} />}
        >
          Open preview
        </ButtonLink>
        {isDraft && (
          <>
            <ButtonLink
              to={paths.campaignEdit(campaign.id)}
              variant="secondary"
              size="sm"
              leadIcon={<Pencil size={15} strokeWidth={2.2} />}
            >
              Edit content
            </ButtonLink>
            <ButtonLink
              to={paths.campaignAudience(campaign.id)}
              variant="secondary"
              size="sm"
              leadIcon={<Users size={15} strokeWidth={2.2} />}
            >
              Choose audience
            </ButtonLink>
          </>
        )}
      </div>
    </Card>
  )
}

export default function CampaignDetail() {
  const { id } = useParams()
  const state = useCampaign(id ?? '')
  const audiences = useAudiences()
  const send = useAction(sendCampaign)
  const retry = useAction(retryCampaign)

  return (
    <Async
      state={state}
      loading={
        <AdminShell title="Campaign" back={{ to: paths.campaigns, label: 'Campaigns' }}>
          <LoadingBlock rows={3} />
        </AdminShell>
      }
    >
      {(campaign) => {
        const audience = audiences.data?.find((a) => a.id === campaign.audienceId)
        const onSend = async () => {
          const result = await send.run(campaign.id)
          if (result) state.reload()
        }
        const onRetry = async () => {
          const result = await retry.run(campaign.id)
          if (result) state.reload()
        }
        return (
          <AdminShell
            title={campaign.name}
            back={{ to: paths.campaigns, label: 'Campaigns' }}
            subtitle={<CampaignStatusBadge status={campaign.status} />}
            actions={headerActions(campaign, onSend, send.pending)}
          >
            <div className="flex flex-col gap-4 max-w-[720px]">
              <StatusSection
                campaign={campaign}
                sendError={send.error}
                onRetry={onRetry}
                retryPending={retry.pending}
                retryError={retry.error}
              />
              <ContentSummary campaign={campaign} audience={audience} />
            </div>
          </AdminShell>
        )
      }}
    </Async>
  )
}
