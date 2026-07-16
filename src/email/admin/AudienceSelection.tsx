import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, Users } from 'lucide-react'
import type { Audience, Campaign } from '../core/types'
import { formatCount } from '../core/format'
import { saveDraft } from '../core/service'
import { useAudiences, useCampaign } from '../hooks/data'
import { useAction } from '../hooks/useAction'
import { paths } from '../routes'
import { AdminShell } from '../layout/AdminShell'
import { Async, Button, EmptyState, Notice, SectionLabel, C, RADIUS, SHADOW } from '../ui'

// ── One selectable audience, with radio semantics ────────────────────────────

function AudienceRow({
  audience,
  selected,
  disabled,
  onSelect,
}: {
  audience: Audience
  selected: boolean
  disabled: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={audience.name}
      disabled={disabled}
      onClick={onSelect}
      className="w-full text-left p-5 flex items-start gap-4 transition-transform active:scale-[0.995] disabled:cursor-default"
      style={{
        background: selected ? C.peachSelected : C.surface,
        borderRadius: RADIUS.grouped,
        border: `1.5px solid ${selected ? C.coral : C.hair}`,
        boxShadow: SHADOW.card,
      }}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 mb-1">
          <h3 className="text-[15px] font-semibold truncate" style={{ color: C.ink }}>
            {audience.name}
          </h3>
          <span className="text-[12px] font-semibold shrink-0" style={{ color: C.ink3 }}>
            {formatCount(audience.size)} people
          </span>
        </div>
        <p className="text-[13px]" style={{ color: C.ink2 }}>
          {audience.description}
        </p>
        <p className="text-[12px] mt-1" style={{ color: C.ink3 }}>
          Rule: {audience.rule}
        </p>
      </div>
      <span className="shrink-0 mt-0.5" style={{ width: 22 }}>
        {selected && <CheckCircle2 size={20} strokeWidth={2.2} style={{ color: C.coral }} />}
      </span>
    </button>
  )
}

// ── The interactive selector (owns the pending selection) ────────────────────

function AudienceSelector({
  campaignId,
  campaign,
  audiences,
}: {
  campaignId: string
  campaign: Campaign
  audiences: Audience[]
}) {
  const isDraft = campaign.status === 'draft'
  const [selectedId, setSelectedId] = useState(campaign.audienceId)
  const save = useAction(saveDraft)

  const saved = save.result
  const savedName = saved
    ? audiences.find((a) => a.id === saved.audienceId)?.name ?? 'the selected audience'
    : null

  return (
    <div className="flex flex-col gap-4">
      {!isDraft && (
        <Notice tone="amber" title="This campaign is read only">
          Only a draft can change its audience. This one is {campaign.status}, so the audience stays
          locked to keep the record honest.
        </Notice>
      )}

      <SectionLabel>Available audiences</SectionLabel>

      <div role="radiogroup" aria-label="Campaign audience" className="flex flex-col gap-3">
        {audiences.map((a) => (
          <AudienceRow
            key={a.id}
            audience={a}
            selected={selectedId === a.id}
            disabled={!isDraft}
            onSelect={() => setSelectedId(a.id)}
          />
        ))}
      </div>

      {savedName && (
        <Notice tone="green" title="Audience saved">
          This newsletter will go to {savedName}.
        </Notice>
      )}
      {save.error && (
        <Notice tone="red" title="That did not save">
          {save.error.message}
        </Notice>
      )}

      <div className="flex justify-end pt-1">
        <Button
          variant="primary"
          disabled={!isDraft || save.pending}
          onClick={() => save.run(campaignId, { audienceId: selectedId })}
        >
          {save.pending ? 'Saving' : 'Save selection'}
        </Button>
      </div>
    </div>
  )
}

// ── Screen ───────────────────────────────────────────────────────────────────

export default function AudienceSelection() {
  const { id } = useParams()
  const campaignId = id ?? ''
  const campaignState = useCampaign(campaignId)
  const audiencesState = useAudiences()

  return (
    <AdminShell
      title="Choose an audience"
      subtitle="Pick who receives this newsletter."
      back={{ to: paths.campaign(campaignId), label: 'Campaign' }}
    >
      <Async
        state={audiencesState}
        isEmpty={(a) => a.length === 0}
        empty={
          <EmptyState
            icon={Users}
            title="No audiences yet"
            subtext="When audiences are set up, they will show here for you to choose from."
          />
        }
      >
        {(audiences) => (
          <Async state={campaignState}>
            {(campaign) => (
              <AudienceSelector
                campaignId={campaignId}
                campaign={campaign}
                audiences={audiences}
              />
            )}
          </Async>
        )}
      </Async>
    </AdminShell>
  )
}
