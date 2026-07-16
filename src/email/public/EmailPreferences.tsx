import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { AlertTriangle, Check, CheckCircle2, SlidersHorizontal } from 'lucide-react'
import type { EmailFrequency, Subscriber, TopicKey } from '../core/types'
import { TOPICS, FREQUENCIES } from '../core/catalog'
import { updatePreferences } from '../core/service'
import { useToken } from '../hooks/data'
import { useAction } from '../hooks/useAction'
import { paths } from '../routes'
import { PublicShell, PublicCard, PublicLoading } from '../layout/PublicShell'
import { InvalidLink } from '../components/PublicResult'
import { Async, Button, Notice, Toggle, Divider, SectionLabel, C, RADIUS, TONES } from '../ui'

function PreferencesForm({ token, subscriber }: { token: string; subscriber: Subscriber }) {
  const [topics, setTopics] = useState<Record<TopicKey, boolean>>({ ...subscriber.preferences.topics })
  const [frequency, setFrequency] = useState<EmailFrequency>(subscriber.preferences.frequency)
  const save = useAction(updatePreferences)

  // Editing after a save clears the previous save feedback so the banner never
  // asserts unsaved on-screen choices are already saved.
  const clearSaved = () => {
    if (save.result || save.error) save.reset()
  }
  const toggleTopic = (key: TopicKey, next: boolean) => {
    clearSaved()
    setTopics((prev) => ({ ...prev, [key]: next }))
  }
  const pickFrequency = (key: EmailFrequency) => {
    clearSaved()
    setFrequency(key)
  }

  return (
    <div>
      <div className="mb-8">
        <span
          className="inline-flex w-11 h-11 rounded-full items-center justify-center mb-6"
          style={{ background: C.peachSelected, border: `1px solid ${TONES.coral.bd}` }}
        >
          <SlidersHorizontal size={20} strokeWidth={1.9} style={{ color: C.coral }} />
        </span>
        <h1 className="email-display text-[32px] sm:text-[36px] leading-[1.06]" style={{ color: C.ink, fontWeight: 500 }}>
          Your email preferences
        </h1>
        <p className="mt-3 text-[14px] leading-[1.6]" style={{ color: C.ink2 }}>
          Choose what you hear about at <strong style={{ color: C.ink }}>{subscriber.email}</strong>.
        </p>
      </div>

      <SectionLabel>Topics</SectionLabel>
      <div className="mt-1 mb-7">
        {TOPICS.map((topic, i) => (
          <div key={topic.key}>
            <div className="flex items-start justify-between gap-4 py-3.5">
              <div className="min-w-0">
                <div className="text-[14px] font-semibold" style={{ color: C.ink }}>
                  {topic.label}
                </div>
                <div className="text-[12.5px] mt-0.5 leading-[1.5]" style={{ color: C.ink2 }}>
                  {topic.description}
                </div>
              </div>
              <Toggle
                checked={topics[topic.key]}
                onChange={(next) => toggleTopic(topic.key, next)}
                ariaLabel={topic.label}
              />
            </div>
            {i < TOPICS.length - 1 && <Divider />}
          </div>
        ))}
      </div>

      <SectionLabel>How often</SectionLabel>
      <div role="radiogroup" aria-label="How often" className="mt-2 mb-7 flex flex-col gap-2.5">
        {FREQUENCIES.map((f) => {
          const selected = frequency === f.key
          return (
            <button
              key={f.key}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => pickFrequency(f.key)}
              className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors"
              style={{
                background: selected ? C.peachSelected : C.chip,
                borderRadius: RADIUS.chip,
                border: `1px solid ${selected ? TONES.coral.bd : C.hair}`,
              }}
            >
              <div>
                <div className="text-[14px] font-semibold" style={{ color: selected ? C.coral : C.ink }}>
                  {f.label}
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: C.ink2 }}>
                  {f.description}
                </div>
              </div>
              {selected && <Check size={17} strokeWidth={2.4} style={{ color: C.coral }} className="shrink-0" />}
            </button>
          )
        })}
      </div>

      {save.result && (
        <div className="mb-4">
          <Notice tone="green" title="Preferences saved" icon={CheckCircle2}>
            Your choices are in. You will only hear from us about what you picked.
          </Notice>
        </div>
      )}
      {save.error && (
        <div className="mb-4">
          <Notice tone="red" title="We could not save that" icon={AlertTriangle}>
            {save.error.message}
          </Notice>
        </div>
      )}

      <Button
        variant="primary"
        full
        disabled={save.pending}
        onClick={() => save.run(token, { topics, frequency })}
      >
        {save.pending ? 'Saving' : 'Save preferences'}
      </Button>

      <div className="mt-4 text-center">
        <Link to={paths.unsubscribe(token)} className="text-[13px] font-semibold" style={{ color: C.ink2 }}>
          Unsubscribe from all emails
        </Link>
      </div>
    </div>
  )
}

export default function EmailPreferences() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? 'tok-manage'
  const state = useToken(token)

  return (
    <PublicShell>
      <PublicCard>
        <Async state={state} loading={<PublicLoading />}>
          {(resolution) =>
            resolution.valid ? (
              <PreferencesForm token={token} subscriber={resolution.subscriber} />
            ) : (
              <InvalidLink reason={resolution.reason} />
            )
          }
        </Async>
      </PublicCard>
    </PublicShell>
  )
}
