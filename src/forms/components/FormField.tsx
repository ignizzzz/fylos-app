// One field, fully wired for accessibility: every control has a real <label>,
// help and error text are linked via aria-describedby, and the invalid state is
// exposed with aria-invalid. Checkboxes (including consent gates) get the
// native "label wraps control" pattern.

import { type ChangeEvent } from 'react'
import type { FieldSpec, FieldValue } from '../core/types'

export interface FormFieldProps {
  spec: FieldSpec
  value: FieldValue
  error?: string
  idPrefix: string
  disabled?: boolean
  onChange: (name: string, value: FieldValue) => void
}

function describedBy(helpId: string | undefined, errorId: string | undefined): string | undefined {
  const ids = [helpId, errorId].filter(Boolean)
  return ids.length > 0 ? ids.join(' ') : undefined
}

function RequiredMark({ required }: { required?: boolean }) {
  return required ? (
    <span className="fyl-req" aria-hidden="true">
      *
    </span>
  ) : (
    <span className="fyl-opt">optional</span>
  )
}

export function FormField({ spec, value, error, idPrefix, disabled, onChange }: FormFieldProps) {
  const controlId = `${idPrefix}-${spec.name}`
  const helpId = spec.help ? `${controlId}-help` : undefined
  const errorId = error ? `${controlId}-error` : undefined
  const ariaDescribedBy = describedBy(helpId, errorId)
  const invalid = Boolean(error)

  const help = spec.help ? (
    <p className="fyl-help" id={helpId}>
      {spec.help}
    </p>
  ) : null

  const errorText = error ? (
    <p className="fyl-error" id={errorId}>
      {error}
    </p>
  ) : null

  // --- Consent / boolean checkbox -----------------------------------------
  if (spec.type === 'checkbox') {
    const checked = value === true
    return (
      <div className={`fyl-field fyl-field-check${invalid ? ' is-invalid' : ''}`}>
        <label className="fyl-check" htmlFor={controlId}>
          <input
            id={controlId}
            name={spec.name}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            required={spec.required}
            aria-invalid={invalid || undefined}
            aria-describedby={ariaDescribedBy}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChange(spec.name, event.target.checked)
            }
          />
          <span className="fyl-check-text">
            {spec.label}
            {spec.required ? (
              <span className="fyl-req" aria-hidden="true">
                {' '}
                *
              </span>
            ) : null}
          </span>
        </label>
        {help}
        {errorText}
      </div>
    )
  }

  const labelNode = (
    <label className="fyl-label" htmlFor={controlId}>
      {spec.label} <RequiredMark required={spec.required} />
    </label>
  )

  // --- Textarea ------------------------------------------------------------
  if (spec.type === 'textarea') {
    return (
      <div className={`fyl-field${invalid ? ' is-invalid' : ''}`}>
        {labelNode}
        <textarea
          id={controlId}
          name={spec.name}
          className="fyl-textarea"
          value={typeof value === 'string' ? value : ''}
          placeholder={spec.placeholder}
          disabled={disabled}
          required={spec.required}
          maxLength={spec.maxLength}
          aria-invalid={invalid || undefined}
          aria-describedby={ariaDescribedBy}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
            onChange(spec.name, event.target.value)
          }
        />
        {help}
        {errorText}
      </div>
    )
  }

  // --- Select --------------------------------------------------------------
  if (spec.type === 'select') {
    return (
      <div className={`fyl-field${invalid ? ' is-invalid' : ''}`}>
        {labelNode}
        <select
          id={controlId}
          name={spec.name}
          className="fyl-select"
          value={typeof value === 'string' ? value : ''}
          disabled={disabled}
          required={spec.required}
          aria-invalid={invalid || undefined}
          aria-describedby={ariaDescribedBy}
          onChange={(event: ChangeEvent<HTMLSelectElement>) =>
            onChange(spec.name, event.target.value)
          }
        >
          <option value="" disabled>
            {spec.placeholder ?? 'Choose one'}
          </option>
          {(spec.options ?? []).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {help}
        {errorText}
      </div>
    )
  }

  // --- Text-like inputs (text/email/tel/url) -------------------------------
  return (
    <div className={`fyl-field${invalid ? ' is-invalid' : ''}`}>
      {labelNode}
      <input
        id={controlId}
        name={spec.name}
        className="fyl-input"
        type={spec.type}
        value={typeof value === 'string' ? value : ''}
        placeholder={spec.placeholder}
        disabled={disabled}
        required={spec.required}
        maxLength={spec.maxLength}
        autoComplete={spec.autoComplete}
        inputMode={spec.type === 'tel' ? 'tel' : spec.type === 'email' ? 'email' : undefined}
        aria-invalid={invalid || undefined}
        aria-describedby={ariaDescribedBy}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(spec.name, event.target.value)}
      />
      {help}
      {errorText}
    </div>
  )
}
