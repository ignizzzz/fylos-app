// Pure, framework-free validation. No React, no DOM: easy to unit test and
// reused verbatim by the hook (client side) and conceptually by the mock
// "server" scenario.

import type { FieldSpec, FieldValue, FieldErrors, FormSchema, FormValues } from './types'

// Deliberately pragmatic patterns. We favor low friction (this is a marketing
// site) over RFC-perfect matching.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const TEL_RE = /^[+]?[\d\s().-]{6,}$/
// A domain like "clinic.ch", a full URL, or an "@handle" are all acceptable.
const URLISH_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$|^@[\w.]{2,}$/

function asString(value: FieldValue | undefined): string {
  return typeof value === 'string' ? value : ''
}

/** A string field is blank when it trims to empty; a checkbox is blank when false. */
export function isBlank(value: FieldValue | undefined): boolean {
  if (typeof value === 'boolean') return value === false
  return asString(value).trim().length === 0
}

/** Conditional fields (revealWhen) are only live when their trigger matches. */
export function isFieldVisible(spec: FieldSpec, values: FormValues): boolean {
  if (!spec.revealWhen) return true
  return asString(values[spec.revealWhen.field]) === spec.revealWhen.equals
}

/** Validate a single field against its spec. Returns an error message or undefined. */
export function validateField(spec: FieldSpec, values: FormValues): string | undefined {
  // Hidden conditional fields never block submission.
  if (!isFieldVisible(spec, values)) return undefined

  const value = values[spec.name]
  const blank = isBlank(value)

  if (spec.required && blank) {
    if (spec.type === 'checkbox') {
      return spec.consent ? 'Please tick this to continue.' : 'Please confirm this to continue.'
    }
    return 'Please fill this in.'
  }

  // Optional and empty: nothing more to check.
  if (blank) return undefined

  const text = asString(value).trim()

  switch (spec.type) {
    case 'email':
      if (!EMAIL_RE.test(text)) return 'That email does not look right.'
      break
    case 'tel':
      if (!TEL_RE.test(text)) return 'That phone number does not look right.'
      break
    case 'url':
      if (!URLISH_RE.test(text)) return 'Please use a web address or an @handle.'
      break
    default:
      break
  }

  if (spec.minLength !== undefined && text.length < spec.minLength) {
    return `Please use at least ${spec.minLength} characters.`
  }
  if (spec.maxLength !== undefined && text.length > spec.maxLength) {
    return `Please keep this under ${spec.maxLength} characters.`
  }
  if (spec.pattern && !spec.pattern.re.test(text)) {
    return spec.pattern.message
  }

  return spec.validate?.(value as FieldValue, values)
}

/** Validate a whole form. Returns a sparse map of field name -> message. */
export function validateForm(schema: FormSchema, values: FormValues): FieldErrors {
  const errors: FieldErrors = {}
  for (const spec of schema.fields) {
    const message = validateField(spec, values)
    if (message) errors[spec.name] = message
  }
  return errors
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0
}
