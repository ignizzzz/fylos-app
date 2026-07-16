// The error surface for submission-level problems (server, network, duplicate)
// and the client validation summary. It is an assertive live region so screen
// readers hear the problem immediately, and it owns the retry affordance.

import type { SubmitErrorKind } from '../core/types'

export interface StatusBannerProps {
  kind: SubmitErrorKind
  message: string
  canRetry: boolean
  attempts: number
  onRetry: () => void
  /** Offered for the duplicate case so people can start a fresh entry. */
  onDismiss?: () => void
}

const TITLES: Record<SubmitErrorKind, string> = {
  validation: 'Please check a few things',
  server: 'That did not go through',
  network: 'Connection trouble',
  duplicate: 'You are already in',
}

export function StatusBanner({
  kind,
  message,
  canRetry,
  attempts,
  onRetry,
  onDismiss,
}: StatusBannerProps) {
  return (
    <div
      className={`fyl-banner fyl-banner-${kind}`}
      role="alert"
      aria-live="assertive"
      tabIndex={-1}
      data-fyl-banner
    >
      <div className="fyl-banner-body">
        <p className="fyl-banner-title">{TITLES[kind]}</p>
        <p className="fyl-banner-message">{message}</p>
        {attempts > 1 && canRetry ? (
          <p className="fyl-banner-note">
            That is attempt {attempts}. If it keeps failing, give it a minute and try again.
          </p>
        ) : null}
      </div>
      <div className="fyl-banner-actions">
        {canRetry ? (
          <button type="button" className="fyl-retry" onClick={onRetry}>
            Try again
          </button>
        ) : null}
        {kind === 'duplicate' && onDismiss ? (
          <button type="button" className="fyl-ghost-btn" onClick={onDismiss}>
            Send another
          </button>
        ) : null}
      </div>
    </div>
  )
}
