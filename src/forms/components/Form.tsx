// The generic, reusable form. Give it a schema and it renders every state the
// task calls for: validation (inline + summary), loading, success, server /
// network / duplicate errors, and retry. It never talks to a backend directly:
// all submission goes through the centralized service via useFormSubmit.

import { type FormEvent, useEffect, useRef } from 'react'
import { isFieldVisible } from '../core/validation'
import { useFormSubmit, type UseFormSubmitOptions } from '../hooks/useFormSubmit'
import type { FormSchema, FormValues, SubmitSuccess } from '../core/types'
import { FormField } from './FormField'
import { StatusBanner } from './StatusBanner'
import { SubmitButton } from './SubmitButton'
import { SuccessPanel } from './SuccessPanel'

export interface FormProps {
  schema: FormSchema
  className?: string
  showHeader?: boolean
  initialValues?: FormValues
  metaSources?: UseFormSubmitOptions['metaSources']
  onSuccess?: (success: SubmitSuccess, values: FormValues) => void
  /** Test/transport seam; overrides the centralized service when provided. */
  submitOverride?: UseFormSubmitOptions['submit']
}

export function Form({
  schema,
  className,
  showHeader = true,
  initialValues,
  metaSources,
  onSuccess,
  submitOverride,
}: FormProps) {
  const form = useFormSubmit(schema, {
    initialValues,
    metaSources,
    onSuccess,
    submit: submitOverride,
  })
  const formRef = useRef<HTMLFormElement>(null)

  // Move focus to the first invalid control whenever validation flags fields.
  useEffect(() => {
    if (form.focusKey === 0) return
    const firstInvalid = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')
    firstInvalid?.focus()
  }, [form.focusKey])

  // On a submission-level failure (server/network/duplicate) there is no invalid
  // field to focus, so move focus to the alert banner instead of leaving it on
  // the now-disabled submit button (which drops focus to <body>).
  useEffect(() => {
    if (
      form.errorKind === 'server' ||
      form.errorKind === 'network' ||
      form.errorKind === 'duplicate'
    ) {
      formRef.current?.querySelector<HTMLElement>('[data-fyl-banner]')?.focus()
    }
    // Keyed on attempts so a repeated failure re-announces and re-focuses.
  }, [form.errorKind, form.attempts])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    form.submit()
  }

  if (form.isSuccess && form.success) {
    return (
      <section className={`fyl-form-wrap${className ? ` ${className}` : ''}`}>
        <SuccessPanel copy={schema.success} referenceId={form.success.id} onReset={form.reset} />
      </section>
    )
  }

  const idPrefix = `fyl-${schema.id}`

  return (
    <section className={`fyl-form-wrap${className ? ` ${className}` : ''}`}>
      <form
        ref={formRef}
        className="fyl-form"
        aria-label={schema.title}
        noValidate
        onSubmit={handleSubmit}
      >
        {showHeader ? (
          <header className="fyl-form-header">
            <h2 className="fyl-form-title">{schema.title}</h2>
            {schema.intro ? <p className="fyl-form-intro">{schema.intro}</p> : null}
          </header>
        ) : null}

        {form.isError && form.errorKind ? (
          <StatusBanner
            kind={form.errorKind}
            message={form.errorMessage ?? 'Something went wrong.'}
            canRetry={form.canRetry}
            attempts={form.attempts}
            onRetry={form.retry}
            onDismiss={form.reset}
          />
        ) : null}

        {/* Announces the loading state to assistive tech (the aria-busy button
            alone is not reliably spoken). */}
        <p className="fyl-visually-hidden" role="status" aria-live="polite">
          {form.isSubmitting ? `${schema.submittingLabel ?? 'Sending'}, please wait.` : ''}
        </p>

        <div className="fyl-fields">
          {schema.fields
            .filter((spec) => isFieldVisible(spec, form.values))
            .map((spec) => (
              <FormField
                key={spec.name}
                spec={spec}
                value={form.values[spec.name] ?? (spec.type === 'checkbox' ? false : '')}
                error={form.fieldErrors[spec.name]}
                idPrefix={idPrefix}
                disabled={form.isSubmitting}
                onChange={form.setValue}
              />
            ))}
        </div>

        <SubmitButton
          label={schema.submitLabel}
          submittingLabel={schema.submittingLabel}
          submitting={form.isSubmitting}
        />
      </form>
    </section>
  )
}
