import type { ComponentType, ReactNode } from 'react'
import { LinkIcon, Clock, Ban } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { Tone } from '../core/catalog'
import type { TokenInvalidReason } from '../core/types'
import { paths } from '../routes'
import { C, TONES, ButtonLink } from '../ui'

/**
 * Canonical result layout for public pages: a centred icon medallion, title,
 * body copy, and stacked actions. Every recipient-facing state uses this so the
 * confirm / unsubscribe / resubscribe / invalid pages feel like one family.
 */
export function PublicResult({
  icon: Icon,
  tone = 'coral',
  eyebrow,
  title,
  children,
  actions,
}: {
  icon: ComponentType<LucideProps>
  tone?: Tone
  eyebrow?: ReactNode
  title: ReactNode
  children?: ReactNode
  actions?: ReactNode
}) {
  const t = TONES[tone]
  return (
    <div className="email-rise">
      <span
        className="inline-flex w-11 h-11 rounded-full items-center justify-center mb-6"
        style={{ background: t.bg, border: `1px solid ${t.bd}` }}
      >
        <Icon size={20} strokeWidth={1.9} style={{ color: t.fg }} />
      </span>
      {eyebrow && (
        <div className="text-[11px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: t.fg }}>
          {eyebrow}
        </div>
      )}
      <h1 className="email-display text-[34px] sm:text-[38px] leading-[1.05]" style={{ color: C.ink, fontWeight: 500 }}>
        {title}
      </h1>
      {children && (
        <div className="mt-4 text-[14.5px] leading-[1.65]" style={{ color: C.ink2 }}>
          {children}
        </div>
      )}
      {actions && <div className="mt-8 flex flex-col gap-2.5">{actions}</div>}
    </div>
  )
}

const INVALID: Record<
  TokenInvalidReason,
  { icon: ComponentType<LucideProps>; title: string; body: string }
> = {
  expired: {
    icon: Clock,
    title: 'This link has expired',
    body:
      'For your security, email links stop working after a while. You can request a fresh one from the Fylos app settings.',
  },
  invalid: {
    icon: LinkIcon,
    title: 'This link is not valid',
    body:
      'The link may be incomplete or was copied only in part. Please open it again from the original email.',
  },
  used: {
    icon: Ban,
    title: 'This link was already used',
    body:
      'It looks like this link has already done its job. If you still need to make a change, request a new link from the app.',
  },
}

/** The invalid / expired / used link state, reused by several public pages. */
export function InvalidLink({ reason }: { reason: TokenInvalidReason }) {
  const copy = INVALID[reason]
  return (
    <PublicResult icon={copy.icon} tone="slate" eyebrow="Link problem" title={copy.title}>
      {copy.body}
      <div className="mt-6">
        <ButtonLink to={paths.home} variant="secondary" full>
          Back to newsletter home
        </ButtonLink>
      </div>
    </PublicResult>
  )
}
