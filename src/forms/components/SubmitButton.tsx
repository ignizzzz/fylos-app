// Submit button with an explicit loading state. While submitting it is
// disabled (a second line of defense against double submission) and announces
// busy state to assistive tech.

export interface SubmitButtonProps {
  label: string
  submittingLabel?: string
  submitting: boolean
  disabled?: boolean
}

export function SubmitButton({
  label,
  submittingLabel = 'Sending',
  submitting,
  disabled,
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="fyl-submit"
      disabled={submitting || disabled}
      aria-busy={submitting || undefined}
    >
      {submitting ? (
        <>
          <span className="fyl-spinner" aria-hidden="true" />
          {submittingLabel}
        </>
      ) : (
        <>
          {label}
          <svg viewBox="0 0 24 24" aria-hidden="true" className="fyl-submit-arrow">
            <path d="M5 12h14m0 0-6-6m6 6-6 6" />
          </svg>
        </>
      )}
    </button>
  )
}
