import { useSearchParams } from 'react-router-dom'
import { CheckCircle2, MailCheck } from 'lucide-react'
import { confirmSubscription } from '../core/service'
import { useToken } from '../hooks/data'
import { useAction } from '../hooks/useAction'
import { paths } from '../routes'
import { PublicShell, PublicCard, PublicLoading } from '../layout/PublicShell'
import { PublicResult, InvalidLink } from '../components/PublicResult'
import { Async, Button, ButtonLink, Notice, C } from '../ui'

export default function ConfirmSubscription() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? 'tok-confirm'
  const tokenState = useToken(token)
  const confirm = useAction(confirmSubscription)

  return (
    <PublicShell>
      <PublicCard>
        <Async state={tokenState} loading={<PublicLoading />}>
          {(resolution) => {
            if (!resolution.valid) return <InvalidLink reason={resolution.reason} />

            const subscriber = confirm.result ?? resolution.subscriber
            const confirmed = subscriber.status === 'subscribed'

            if (confirmed) {
              return (
                <PublicResult
                  icon={CheckCircle2}
                  tone="green"
                  eyebrow="Subscription confirmed"
                  title="You are all set"
                  actions={
                    <>
                      <ButtonLink to={paths.preferences(token)} variant="primary" full>
                        Manage your preferences
                      </ButtonLink>
                      <ButtonLink to={paths.home} variant="ghost" full>
                        Back to newsletter home
                      </ButtonLink>
                    </>
                  }
                >
                  <strong style={{ color: C.ink }}>{subscriber.email}</strong> is confirmed and will
                  start receiving Fylos emails. You can change what you get, or unsubscribe, at any
                  time.
                </PublicResult>
              )
            }

            return (
              <PublicResult
                icon={MailCheck}
                tone="coral"
                eyebrow="One last step"
                title="Confirm your subscription"
                actions={
                  <>
                    <Button
                      variant="primary"
                      full
                      disabled={confirm.pending}
                      onClick={() => confirm.run(token)}
                    >
                      {confirm.pending ? 'Confirming' : 'Confirm subscription'}
                    </Button>
                    {confirm.error && (
                      <Notice tone="red" title="That did not go through">
                        {confirm.error.message}
                      </Notice>
                    )}
                  </>
                }
              >
                Tap below to confirm <strong style={{ color: C.ink }}>{subscriber.email}</strong> and
                start receiving Fylos emails from your neighborhood.
              </PublicResult>
            )
          }}
        </Async>
      </PublicCard>
    </PublicShell>
  )
}
