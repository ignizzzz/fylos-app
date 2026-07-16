// Success confirmation. Rendered in place of the form once a submission lands.
// It is a polite live region and moves focus to itself so keyboard and screen
// reader users are taken to the confirmation.

import { useEffect, useRef } from 'react'
import type { FormSuccessCopy } from '../core/types'

export interface SuccessPanelProps {
  copy: FormSuccessCopy
  /** Optional record id, shown small as a reference. */
  referenceId?: string
  onReset?: () => void
}

export function SuccessPanel({ copy, referenceId, onReset }: SuccessPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <div className="fyl-success" role="status" aria-live="polite">
      <div className="fyl-success-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="fyl-success-title" tabIndex={-1} ref={headingRef}>
        {copy.title}
      </h2>
      <p className="fyl-success-body">{copy.body}</p>
      {referenceId ? <p className="fyl-success-ref">Reference {referenceId}</p> : null}
      <div className="fyl-success-actions">
        {copy.cta ? (
          <a className="fyl-success-cta" href={copy.cta.href}>
            {copy.cta.label}
          </a>
        ) : null}
        {onReset ? (
          <button type="button" className="fyl-ghost-btn" onClick={onReset}>
            Send another
          </button>
        ) : null}
      </div>
    </div>
  )
}
