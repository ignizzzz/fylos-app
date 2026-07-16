import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, UserPlus } from 'lucide-react'
import type { Subscriber } from '../core/types'
import { resubscribe } from '../core/service'
import { useToken } from '../hooks/data'
import { useAction } from '../hooks/useAction'
import { paths } from '../routes'
import { PublicShell, PublicCard, PublicLoading } from '../layout/PublicShell'
import { PublicResult, InvalidLink } from '../components/PublicResult'
import { Async, Button, ButtonLink, Notice, C } from '../ui'

/** Primary "manage" + ghost "home" pair, shared by the settled success states. */
function ManageActions({ token }: { token: string }) {
  return (
    <>
      <ButtonLink to={paths.preferences(token)} variant="primary" full>
        Manage preferences
      </ButtonLink>
      <ButtonLink to={paths.home} variant="ghost" full>
        Back to newsletter home
      </ButtonLink>
    </>
  )
}

function ResubscribeValid({ token, subscriber }: { token: string; subscriber: Subscriber }) {
  const resub = useAction(resubscribe)
  const email = (resub.result ?? subscriber).email

  // Just resubscribed in this session.
  if (resub.result) {
    return (
      <PublicResult
        icon={CheckCircle2}
        tone="green"
        eyebrow="Welcome back"
        title="You are subscribed again"
        actions={<ManageActions token={token} />}
      >
        <strong style={{ color: C.ink }}>{email}</strong> is back on the list and will start
        receiving Fylos emails from your neighborhood again.
      </PublicResult>
    )
  }

  // Already subscribed, nothing to do.
  if (subscriber.status === 'subscribed') {
    return (
      <PublicResult
        icon={CheckCircle2}
        tone="green"
        eyebrow="Good news"
        title="You are already subscribed"
        actions={<ManageActions token={token} />}
      >
        <strong style={{ color: C.ink }}>{email}</strong> is already on the list and receiving Fylos
        emails. You can fine tune what you get, or step away, whenever you like.
      </PublicResult>
    )
  }

  // Unsubscribed: invite them back.
  return (
    <PublicResult
      icon={UserPlus}
      tone="coral"
      eyebrow="Welcome back"
      title="Resubscribe to Fylos emails"
      actions={
        <>
          <Button variant="primary" full disabled={resub.pending} onClick={() => resub.run(token)}>
            {resub.pending ? 'Resubscribing' : 'Resubscribe'}
          </Button>
          {resub.error && (
            <Notice tone="red" title="That did not go through">
              {resub.error.message}
            </Notice>
          )}
        </>
      }
    >
      We saved your spot. Tap below to start receiving Fylos emails at{' '}
      <strong style={{ color: C.ink }}>{email}</strong> again.
    </PublicResult>
  )
}

export default function Resubscribe() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? 'tok-resub'
  const state = useToken(token)

  return (
    <PublicShell>
      <PublicCard>
        <Async state={state} loading={<PublicLoading />}>
          {(resolution) =>
            resolution.valid ? (
              <ResubscribeValid token={token} subscriber={resolution.subscriber} />
            ) : (
              <InvalidLink reason={resolution.reason} />
            )
          }
        </Async>
      </PublicCard>
    </PublicShell>
  )
}
