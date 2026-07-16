import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, MailX } from 'lucide-react'
import type { Subscriber } from '../core/types'
import { unsubscribe } from '../core/service'
import { useToken } from '../hooks/data'
import { useAction } from '../hooks/useAction'
import { paths } from '../routes'
import { PublicShell, PublicCard, PublicLoading } from '../layout/PublicShell'
import { PublicResult, InvalidLink } from '../components/PublicResult'
import { Async, Button, ButtonLink, Notice, C } from '../ui'

/** Kept as its own component so its hooks stay at the top level. */
function UnsubscribeFlow({ token, initial }: { token: string; initial: Subscriber }) {
  const unsub = useAction(unsubscribe)
  const subscriber = unsub.result ?? initial
  const done = subscriber.status === 'unsubscribed'

  if (done) {
    return (
      <PublicResult
        icon={CheckCircle2}
        tone="slate"
        eyebrow="Unsubscribed"
        title="You are unsubscribed"
        actions={
          <>
            <ButtonLink to={paths.resubscribe(token)} variant="primary" full>
              Resubscribe
            </ButtonLink>
            <ButtonLink to={paths.home} variant="ghost" full>
              Back to newsletter home
            </ButtonLink>
          </>
        }
      >
        <strong style={{ color: C.ink }}>{subscriber.email}</strong> will no longer receive Fylos
        emails. Changed your mind?
      </PublicResult>
    )
  }

  return (
    <PublicResult
      icon={MailX}
      tone="coral"
      eyebrow="Before you go"
      title="Unsubscribe from Fylos emails?"
      actions={
        <>
          <Button variant="danger" full disabled={unsub.pending} onClick={() => unsub.run(token)}>
            {unsub.pending ? 'Unsubscribing' : 'Unsubscribe'}
          </Button>
          <ButtonLink to={paths.preferences(token)} variant="secondary" full>
            Keep a lighter version instead
          </ButtonLink>
          {unsub.error && (
            <Notice tone="red" title="That did not go through">
              {unsub.error.message}
            </Notice>
          )}
        </>
      }
    >
      We can stop sending emails to <strong style={{ color: C.ink }}>{subscriber.email}</strong>.
      Prefer fewer emails to none? You can keep a lighter version instead.
    </PublicResult>
  )
}

export default function Unsubscribe() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? 'tok-unsub'
  const state = useToken(token)

  return (
    <PublicShell>
      <PublicCard>
        <Async state={state} loading={<PublicLoading />}>
          {(resolution) => {
            if (!resolution.valid) return <InvalidLink reason={resolution.reason} />
            return <UnsubscribeFlow token={token} initial={resolution.subscriber} />
          }}
        </Async>
      </PublicCard>
    </PublicShell>
  )
}
