import { useNavigate } from 'react-router-dom'
import { ChevronRight, Pencil, Send } from 'lucide-react'
import type { Campaign } from '../core/types'
import { NOW } from '../core/seed'
import { formatCount, formatDateTime, relativeDays } from '../core/format'
import { useCampaigns } from '../hooks/data'
import { paths } from '../routes'
import { AdminShell } from '../layout/AdminShell'
import { CampaignStatusBadge } from '../components/badges'
import { Async, ButtonLink, EmptyState, C, HAIRLINE, RADIUS, SHADOW } from '../ui'

function metaLine(c: Campaign): string {
  switch (c.status) {
    case 'draft':
      return `Draft, edited ${relativeDays(c.updatedAt, NOW)}`
    case 'scheduled':
      return `Scheduled for ${formatDateTime(c.scheduledFor)}`
    case 'sending':
      return `Sending now, ${Math.round(c.progress * 100)}%`
    case 'sent':
      return `Sent ${relativeDays(c.sentAt, NOW)}, ${formatCount(c.delivery.delivered)} delivered`
    case 'failed':
      return `Failed ${relativeDays(c.failedAt, NOW)}`
  }
}

function CampaignRow({ campaign }: { campaign: Campaign }) {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(paths.campaign(campaign.id))}
      className="w-full text-left p-5 flex items-center gap-4 active:scale-[0.995] transition-transform"
      style={{ background: C.surface, borderRadius: RADIUS.grouped, border: `1px solid ${HAIRLINE}`, boxShadow: SHADOW.card }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 mb-1">
          <h3 className="text-[15.5px] font-semibold truncate" style={{ color: C.ink }}>
            {campaign.name}
          </h3>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        <p className="text-[13px] truncate" style={{ color: C.ink2 }}>
          {campaign.content.subject}
        </p>
        <p className="text-[12px] mt-1" style={{ color: C.ink3 }}>
          {metaLine(campaign)}
        </p>
      </div>
      <ChevronRight size={18} strokeWidth={2} style={{ color: C.chevron }} className="shrink-0" />
    </button>
  )
}

export default function CampaignList() {
  const state = useCampaigns()
  return (
    <AdminShell
      title="Campaigns"
      subtitle="Every newsletter, from draft to delivered."
      actions={
        <ButtonLink
          to={paths.campaignEdit('cmp_draft')}
          variant="secondary"
          size="sm"
          leadIcon={<Pencil size={15} strokeWidth={2.2} />}
        >
          Open draft
        </ButtonLink>
      }
    >
      <Async
        state={state}
        isEmpty={(list) => list.length === 0}
        empty={
          <EmptyState
            icon={Send}
            title="No campaigns yet"
            subtext="When you draft or send a newsletter, it will show up here."
          />
        }
      >
        {(campaigns) => (
          <div className="flex flex-col gap-3">
            {campaigns.map((c) => (
              <CampaignRow key={c.id} campaign={c} />
            ))}
          </div>
        )}
      </Async>
    </AdminShell>
  )
}
