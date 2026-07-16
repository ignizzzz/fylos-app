import { useSearchParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import type { TokenPurpose } from '../core/types'
import { useToken } from '../hooks/data'
import { paths } from '../routes'
import { PublicShell, PublicCard, PublicLoading } from '../layout/PublicShell'
import { PublicResult, InvalidLink } from '../components/PublicResult'
import { Async, ButtonLink } from '../ui'

// Where each still-valid link should carry the recipient next. The default demo
// token resolves to an expired link, so the invalid branch is the usual view.
const CONTINUE: Record<TokenPurpose, { to: (token: string) => string; label: string }> = {
  confirm: { to: paths.confirm, label: 'Confirm your subscription' },
  manage: { to: paths.preferences, label: 'Manage your preferences' },
  unsubscribe: { to: paths.unsubscribe, label: 'Go to unsubscribe' },
  resubscribe: { to: paths.resubscribe, label: 'Resubscribe' },
}

export default function InvalidExpired() {
  const [params] = useSearchParams()
  const token = params.get('token') ?? 'tok-expired'
  const state = useToken(token)

  return (
    <PublicShell>
      <PublicCard>
        <Async state={state} loading={<PublicLoading message="Checking this link" />}>
          {(resolution) => {
            if (!resolution.valid) return <InvalidLink reason={resolution.reason} />

            const next = CONTINUE[resolution.purpose]
            return (
              <PublicResult
                icon={CheckCircle2}
                tone="green"
                eyebrow="Link checked"
                title="This link is still active"
                actions={
                  <>
                    <ButtonLink to={next.to(resolution.token)} variant="primary" full>
                      {next.label}
                    </ButtonLink>
                    <ButtonLink to={paths.home} variant="ghost" full>
                      Back to newsletter home
                    </ButtonLink>
                  </>
                }
              >
                Good news, this one still works. You can continue where you left off.
              </PublicResult>
            )
          }}
        </Async>
      </PublicCard>
    </PublicShell>
  )
}
