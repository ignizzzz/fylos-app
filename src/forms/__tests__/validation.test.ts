import { describe, expect, it } from 'vitest'
import { validateField, validateForm, isFieldVisible, isBlank } from '../core/validation'
import type { FieldSpec, FormSchema } from '../core/types'
import { FORMS } from '../schemas'

const emailField: FieldSpec = { name: 'email', label: 'Email', type: 'email', required: true }

describe('isBlank', () => {
  it('treats empty and whitespace strings as blank', () => {
    expect(isBlank('')).toBe(true)
    expect(isBlank('   ')).toBe(true)
    expect(isBlank('x')).toBe(false)
  })
  it('treats an unchecked checkbox as blank', () => {
    expect(isBlank(false)).toBe(true)
    expect(isBlank(true)).toBe(false)
  })
})

describe('validateField', () => {
  it('requires a value for required fields', () => {
    expect(validateField(emailField, { email: '' })).toMatch(/fill this in/i)
  })

  it('accepts a well formed email and rejects a malformed one', () => {
    expect(validateField(emailField, { email: 'person@fylos.me' })).toBeUndefined()
    expect(validateField(emailField, { email: 'not-an-email' })).toMatch(/does not look right/i)
  })

  it('does not validate format on optional empty fields', () => {
    const optional: FieldSpec = { name: 'website', label: 'Website', type: 'url' }
    expect(validateField(optional, { website: '' })).toBeUndefined()
  })

  it('accepts a domain or an @handle for url fields', () => {
    const url: FieldSpec = { name: 'website', label: 'Website', type: 'url' }
    expect(validateField(url, { website: 'clinic.ch' })).toBeUndefined()
    expect(validateField(url, { website: '@clinic' })).toBeUndefined()
    expect(validateField(url, { website: 'https://clinic.ch/team' })).toBeUndefined()
    expect(validateField(url, { website: 'not a url' })).toMatch(/web address/i)
  })

  it('enforces minLength', () => {
    const msg: FieldSpec = { name: 'm', label: 'Message', type: 'textarea', minLength: 10 }
    expect(validateField(msg, { m: 'short' })).toMatch(/at least 10/i)
    expect(validateField(msg, { m: 'this is long enough' })).toBeUndefined()
  })

  it('requires consent checkboxes to be ticked', () => {
    const consent: FieldSpec = {
      name: 'c',
      label: 'I agree',
      type: 'checkbox',
      required: true,
      consent: true,
    }
    expect(validateField(consent, { c: false })).toMatch(/tick this/i)
    expect(validateField(consent, { c: true })).toBeUndefined()
  })

  it('runs a custom validator last', () => {
    const field: FieldSpec = {
      name: 'x',
      label: 'X',
      type: 'text',
      validate: (v) => (v === 'bad' ? 'no good' : undefined),
    }
    expect(validateField(field, { x: 'bad' })).toBe('no good')
    expect(validateField(field, { x: 'fine' })).toBeUndefined()
  })
})

describe('conditional fields', () => {
  const hidden: FieldSpec = {
    name: 'other',
    label: 'Which',
    type: 'text',
    required: true,
    revealWhen: { field: 'kind', equals: 'Other' },
  }

  it('is invisible and never blocks when its trigger does not match', () => {
    expect(isFieldVisible(hidden, { kind: 'Vetera' })).toBe(false)
    expect(validateField(hidden, { kind: 'Vetera', other: '' })).toBeUndefined()
  })

  it('becomes visible and validates when the trigger matches', () => {
    expect(isFieldVisible(hidden, { kind: 'Other' })).toBe(true)
    expect(validateField(hidden, { kind: 'Other', other: '' })).toMatch(/fill this in/i)
  })
})

describe('validateForm across real schemas', () => {
  it('flags every required field on an empty submission', () => {
    const schema: FormSchema = FORMS.contact
    const errors = validateForm(schema, {})
    expect(errors.name).toBeDefined()
    expect(errors.email).toBeDefined()
    expect(errors.topic).toBeDefined()
    expect(errors.message).toBeDefined()
    expect(errors.consent).toBeDefined()
  })

  it('passes a fully valid submission', () => {
    const errors = validateForm(FORMS.newsletter, { email: 'a@b.co', consent: true })
    expect(Object.keys(errors)).toHaveLength(0)
  })
})
