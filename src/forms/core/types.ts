// Shared, framework-agnostic types for the Fylos form system.
// Everything downstream (services, hook, components, schemas) speaks these.

export type FormId =
  | 'early-access'
  | 'newsletter'
  | 'contact'
  | 'partnership'
  | 'veterinary'
  | 'demo'
  | 'support'
  | 'press'

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'url'
  | 'textarea'
  | 'select'
  | 'checkbox'

export interface SelectOption {
  value: string
  label: string
}

export type FieldValue = string | boolean
export type FormValues = Record<string, FieldValue>

/** Map of field name -> human error message. Sparse by design. */
export type FieldErrors = Record<string, string>

/** A pure, per-field validator. Returns an error string or undefined when valid. */
export type FieldValidator = (value: FieldValue, values: FormValues) => string | undefined

export interface FieldSpec {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  /** Assistive helper copy rendered under the control. */
  help?: string
  /** HTML autocomplete token for good browser/password-manager behavior. */
  autoComplete?: string
  /** Options for `select` fields. */
  options?: SelectOption[]
  minLength?: number
  maxLength?: number
  pattern?: { re: RegExp; message: string }
  /** Marks a checkbox as a consent gate (must be checked when required). */
  consent?: boolean
  /** Show this field only when another field equals a given value. */
  revealWhen?: { field: string; equals: string }
  /** Optional custom validation on top of the built-in rules. */
  validate?: FieldValidator
}

export interface FormSuccessCopy {
  title: string
  body: string
  cta?: { label: string; href: string }
}

export interface FormSchema {
  id: FormId
  /** The site route this form is intended for (documented in docs/ROUTES.md). */
  route: string
  title: string
  intro?: string
  fields: FieldSpec[]
  submitLabel: string
  submittingLabel?: string
  success: FormSuccessCopy
}

// --- Submission metadata (UTM + referrer capture) ---------------------------

export interface UtmParams {
  source?: string
  medium?: string
  campaign?: string
  term?: string
  content?: string
}

export interface ClickIds {
  gclid?: string
  fbclid?: string
  msclkid?: string
}

export interface SubmissionMeta {
  /** Attribution parameters, first-touch where available. */
  utm: UtmParams
  clickIds: ClickIds
  /** document.referrer at submit time, or null when unavailable. */
  referrer: string | null
  /** Path (+ search) the visitor first landed on in this session. */
  landingPath: string
  /** Path the form was actually submitted from. */
  submittedFrom: string
  userAgent: string | null
  /** ISO 8601 timestamp. */
  submittedAt: string
}

export interface SubmissionPayload {
  formId: FormId
  values: FormValues
  meta: SubmissionMeta
}

// --- Result of a submission (discriminated union) ---------------------------

export interface SubmitSuccess {
  ok: true
  /** Server-assigned identifier for the created record. */
  id: string
  message: string
}

export type SubmitErrorKind = 'validation' | 'server' | 'network' | 'duplicate'

interface SubmitFailureBase {
  ok: false
  message: string
  /** Whether a plain retry could plausibly succeed (server/network yes). */
  retryable?: boolean
}

/** Server-side field errors. Retrying as-is will not help. */
export interface ValidationFailure extends SubmitFailureBase {
  kind: 'validation'
  fieldErrors?: FieldErrors
}

/** A 5xx-style backend failure. Retryable. */
export interface ServerFailure extends SubmitFailureBase {
  kind: 'server'
  status?: number
}

/** A transport-level failure (offline, DNS, timeout). Retryable. */
export interface NetworkFailure extends SubmitFailureBase {
  kind: 'network'
}

/** The same identity was already submitted. Retrying as-is will not help. */
export interface DuplicateFailure extends SubmitFailureBase {
  kind: 'duplicate'
  /** The id of the existing record. */
  id?: string
}

/**
 * Discriminated over `kind`, so per-kind payload invariants are type-enforced:
 * only a validation failure carries fieldErrors, only a duplicate carries an id.
 */
export type SubmitFailure = ValidationFailure | ServerFailure | NetworkFailure | DuplicateFailure

export type SubmitResult = SubmitSuccess | SubmitFailure

// --- Mock behavior ----------------------------------------------------------

/** The four (plus duplicate) behaviors the mock backend can simulate. */
export type MockScenario =
  | 'success'
  | 'validation'
  | 'server'
  | 'network'
  | 'duplicate'
