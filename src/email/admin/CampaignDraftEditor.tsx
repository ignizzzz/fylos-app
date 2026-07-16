import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AlertTriangle, Check, Eye } from 'lucide-react'
import type { Audience, DraftCampaign } from '../core/types'
import { saveDraft } from '../core/service'
import { useAudiences, useCampaign } from '../hooks/data'
import { useAction } from '../hooks/useAction'
import { paths } from '../routes'
import { AdminShell } from '../layout/AdminShell'
import {
  Async,
  Button,
  ButtonLink,
  Card,
  Divider,
  FieldLabel,
  Notice,
  Select,
  TextArea,
  TextInput,
  C,
} from '../ui'

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
    </div>
  )
}

function EditorForm({
  campaign,
  audiences,
}: {
  campaign: DraftCampaign
  audiences: Audience[] | null
}) {
  const [name, setName] = useState(campaign.name)
  const [subject, setSubject] = useState(campaign.content.subject)
  const [preheader, setPreheader] = useState(campaign.content.preheader)
  const [fromName, setFromName] = useState(campaign.content.fromName)
  const [fromEmail, setFromEmail] = useState(campaign.content.fromEmail)
  const [body, setBody] = useState(campaign.content.body)
  const [audienceId, setAudienceId] = useState(campaign.audienceId)
  const save = useAction(saveDraft)

  // Editing after a save clears the stale "Draft saved" banner.
  const clearSaved = () => {
    if (save.result || save.error) save.reset()
  }
  const edited =
    <T,>(setter: (value: T) => void) =>
    (value: T) => {
      clearSaved()
      setter(value)
    }

  const options = audiences
    ? audiences.map((a) => ({ value: a.id, label: a.name }))
    : [{ value: campaign.audienceId, label: 'Current audience' }]

  return (
    <div className="max-w-[640px] flex flex-col gap-5">
      {save.result && (
        <Notice tone="green" title="Draft saved" icon={Check}>
          Your changes to this draft are saved.
        </Notice>
      )}
      {save.error && (
        <Notice tone="red" title="Draft not saved">
          {save.error.message}
        </Notice>
      )}

      <Card>
        <div className="flex flex-col gap-4">
          <Field label="Campaign name" htmlFor="cmp-name">
            <TextInput id="cmp-name" value={name} onChange={edited(setName)} placeholder="A short internal name" />
          </Field>
          <Field label="Subject" htmlFor="cmp-subject">
            <TextInput id="cmp-subject" value={subject} onChange={edited(setSubject)} placeholder="What lands in the inbox" />
          </Field>
          <Field label="Preheader" htmlFor="cmp-preheader">
            <TextInput
              id="cmp-preheader"
              value={preheader}
              onChange={edited(setPreheader)}
              placeholder="The preview line after the subject"
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="From name" htmlFor="cmp-fromname">
              <TextInput id="cmp-fromname" value={fromName} onChange={edited(setFromName)} />
            </Field>
            <Field label="From email" htmlFor="cmp-fromemail">
              <TextInput id="cmp-fromemail" value={fromEmail} onChange={edited(setFromEmail)} type="email" />
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <Field label="Body" htmlFor="cmp-body">
          <TextArea
            id="cmp-body"
            value={body}
            onChange={edited(setBody)}
            rows={8}
            placeholder="Write the newsletter in plain, warm text."
          />
        </Field>
      </Card>

      <Card>
        <Field label="Audience" htmlFor="cmp-audience">
          <Select id="cmp-audience" value={audienceId} onChange={edited(setAudienceId)} options={options} />
        </Field>
        <Link
          to={paths.campaignAudience(campaign.id)}
          className="inline-block mt-2.5 text-[13px] font-semibold"
          style={{ color: C.coral }}
        >
          Choose from audiences
        </Link>
      </Card>

      <Divider />

      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          leadIcon={<Check size={16} strokeWidth={2.4} />}
          disabled={save.pending}
          onClick={() =>
            save.run(campaign.id, {
              name,
              audienceId,
              content: { subject, preheader, fromName, fromEmail, body },
            })
          }
        >
          {save.pending ? 'Saving' : 'Save draft'}
        </Button>
        <ButtonLink
          to={paths.campaignPreview(campaign.id)}
          variant="ghost"
          leadIcon={<Eye size={16} strokeWidth={2.2} />}
        >
          Open preview
        </ButtonLink>
      </div>
    </div>
  )
}

export default function CampaignDraftEditor() {
  const { id } = useParams()
  const campaignId = id ?? ''
  const state = useCampaign(campaignId)
  const audiences = useAudiences()

  return (
    <AdminShell title="Edit draft" back={{ to: paths.campaign(campaignId), label: 'Campaign' }}>
      <Async state={state}>
        {(campaign) => {
          if (campaign.status !== 'draft') {
            return (
              <Notice tone="amber" title="Only drafts can be edited" icon={AlertTriangle}>
                This campaign is {campaign.status} now, so its content is locked.{' '}
                <Link
                  to={paths.campaign(campaignId)}
                  className="font-semibold"
                  style={{ color: C.coral }}
                >
                  Back to the campaign
                </Link>
              </Notice>
            )
          }
          return <EditorForm campaign={campaign} audiences={audiences.data} />
        }}
      </Async>
    </AdminShell>
  )
}
