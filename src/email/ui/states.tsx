import type { ComponentType, ReactNode } from 'react'
import { AlertTriangle, Inbox, RefreshCw, WifiOff } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { AsyncState } from '../hooks/useAsync'
import { ServiceError } from '../core/types'
import { C, HAIRLINE, RADIUS, TONES } from './tokens'
import { Button } from './primitives'

type IconType = ComponentType<LucideProps>

// ── Skeleton primitives ──────────────────────────────────────────────────────

export function Skeleton({
  width = '100%',
  height = 14,
  radius = 8,
  className = '',
}: {
  width?: number | string
  height?: number
  radius?: number
  className?: string
}) {
  return (
    <span
      className={`block ${className}`}
      style={{
        width,
        height,
        borderRadius: radius,
        background: 'linear-gradient(90deg, #F3EFEB 25%, #ECE7E1 37%, #F3EFEB 63%)',
        backgroundSize: '400px 100%',
        animation: 'emailShimmer 1.3s ease-in-out infinite',
      }}
    />
  )
}

/** A few skeleton cards. Default loading view for lists. */
export function LoadingBlock({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="p-5"
          style={{ background: C.surface, borderRadius: RADIUS.grouped, border: `1px solid ${HAIRLINE}` }}
        >
          <Skeleton width="55%" height={15} />
          <div className="mt-3 flex flex-col gap-2">
            <Skeleton width="90%" height={12} />
            <Skeleton width="70%" height={12} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Empty ────────────────────────────────────────────────────────────────────

export function EmptyState({
  icon: Icon = Inbox,
  title,
  subtext,
  action,
}: {
  icon?: IconType
  title: string
  subtext?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <span
        className="w-[52px] h-[52px] rounded-full flex items-center justify-center mb-5"
        style={{ background: C.peachSelected, border: `1px solid ${TONES.coral.bd}` }}
      >
        <Icon size={20} style={{ color: C.coral }} strokeWidth={1.9} />
      </span>
      <h3 className="email-display text-[19px] leading-[1.2]" style={{ color: C.ink, fontWeight: 500 }}>
        {title}
      </h3>
      {subtext && (
        <p className="mt-2 text-[13px] leading-[1.55] max-w-[300px]" style={{ color: C.ink2 }}>
          {subtext}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

// ── Error ────────────────────────────────────────────────────────────────────

export function ErrorState({
  error,
  onRetry,
  title = 'Something went wrong',
}: {
  error: Error | null
  onRetry?: () => void
  title?: string
}) {
  const isNetwork = error instanceof ServiceError && error.kind === 'network'
  const Icon = isNetwork ? WifiOff : AlertTriangle
  const message =
    error?.message || 'We could not load this right now. Please try again in a moment.'
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <span
        className="w-[52px] h-[52px] rounded-full flex items-center justify-center mb-5"
        style={{ background: TONES.red.bg, border: `1px solid ${TONES.red.bd}` }}
      >
        <Icon size={20} style={{ color: TONES.red.fg }} strokeWidth={1.9} />
      </span>
      <h3 className="email-display text-[19px] leading-[1.2]" style={{ color: C.ink, fontWeight: 500 }}>
        {title}
      </h3>
      <p className="mt-2 text-[13px] leading-[1.55] max-w-[300px]" style={{ color: C.ink2 }}>
        {message}
      </p>
      {onRetry && (
        <div className="mt-6">
          <Button variant="secondary" size="sm" onClick={onRetry} leadIcon={<RefreshCw size={15} strokeWidth={2.2} />}>
            Try again
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Async boundary ───────────────────────────────────────────────────────────

/**
 * One place that turns an AsyncState into loading / error / empty / content.
 * Every screen uses this so the four states look identical everywhere.
 */
export function Async<T>({
  state,
  isEmpty,
  empty,
  loading,
  children,
}: {
  state: AsyncState<T>
  isEmpty?: (data: T) => boolean
  empty?: ReactNode
  loading?: ReactNode
  children: (data: T) => ReactNode
}) {
  // Error takes priority so the error scenario always shows, even over stale data.
  if (state.status === 'error') {
    return <ErrorState error={state.error} onRetry={state.reload} />
  }
  // First load, nothing to show yet: the loading placeholder.
  if (state.data === null) {
    return <>{loading ?? <LoadingBlock />}</>
  }
  // We have data. During a background refetch (pagination, filter, search) we keep
  // showing it (stale while revalidate) instead of blanking to skeletons.
  if (isEmpty && isEmpty(state.data)) {
    return <>{empty ?? <EmptyState title="Nothing here yet" />}</>
  }
  return <>{children(state.data)}</>
}
