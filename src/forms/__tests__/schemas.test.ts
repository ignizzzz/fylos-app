import { describe, expect, it } from 'vitest'
import { ALL_FORMS, FORMS, getFormSchema } from '../schemas'
import type { FormSchema } from '../core/types'

function userFacingStrings(schema: FormSchema): string[] {
  const out: string[] = [schema.title, schema.submitLabel, schema.success.title, schema.success.body]
  if (schema.intro) out.push(schema.intro)
  if (schema.submittingLabel) out.push(schema.submittingLabel)
  if (schema.success.cta) out.push(schema.success.cta.label)
  for (const field of schema.fields) {
    out.push(field.label)
    if (field.help) out.push(field.help)
    if (field.placeholder) out.push(field.placeholder)
    for (const option of field.options ?? []) out.push(option.label)
  }
  return out
}

// Scan code points against common emoji blocks (pictographs, symbols, flags,
// variation selectors). Done as a scan rather than a regex character class so
// the combined-character lint rule stays happy.
function hasEmoji(text: string): boolean {
  for (const ch of text) {
    const cp = ch.codePointAt(0)
    if (cp === undefined) continue
    if (
      (cp >= 0x1f000 && cp <= 0x1faff) ||
      (cp >= 0x2600 && cp <= 0x27bf) ||
      (cp >= 0x2b00 && cp <= 0x2bff) ||
      (cp >= 0xfe00 && cp <= 0xfe0f) ||
      (cp >= 0x1f1e6 && cp <= 0x1f1ff)
    ) {
      return true
    }
  }
  return false
}

describe('form registry', () => {
  it('exposes exactly the eight expected forms', () => {
    expect(ALL_FORMS).toHaveLength(8)
    expect(Object.keys(FORMS).sort()).toEqual(
      [
        'contact',
        'demo',
        'early-access',
        'newsletter',
        'partnership',
        'press',
        'support',
        'veterinary',
      ].sort(),
    )
  })

  it('keys each schema by its own id and resolves by id', () => {
    for (const [key, schema] of Object.entries(FORMS)) {
      expect(schema.id).toBe(key)
      expect(getFormSchema(schema.id)).toBe(schema)
    }
  })
})

describe.each(ALL_FORMS)('schema: $id', (schema) => {
  it('has a route, submit label and success copy', () => {
    expect(schema.route.startsWith('/')).toBe(true)
    expect(schema.submitLabel.length).toBeGreaterThan(0)
    expect(schema.success.title.length).toBeGreaterThan(0)
    expect(schema.success.body.length).toBeGreaterThan(0)
  })

  it('has unique field names', () => {
    const names = schema.fields.map((f) => f.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('gates on at least one required consent checkbox', () => {
    const consents = schema.fields.filter(
      (f) => f.type === 'checkbox' && f.required && f.consent,
    )
    expect(consents.length).toBeGreaterThanOrEqual(1)
  })

  it('gives every select real options', () => {
    for (const field of schema.fields) {
      if (field.type === 'select') {
        expect(field.options && field.options.length).toBeGreaterThan(0)
      }
    }
  })

  it('only reveals fields whose trigger field exists', () => {
    const names = new Set(schema.fields.map((f) => f.name))
    for (const field of schema.fields) {
      if (field.revealWhen) expect(names.has(field.revealWhen.field)).toBe(true)
    }
  })

  it('obeys the copy rules: no em or en dashes, no emoji', () => {
    for (const text of userFacingStrings(schema)) {
      expect(text.includes('—'), `em dash in: ${text}`).toBe(false)
      expect(text.includes('–'), `en dash in: ${text}`).toBe(false)
      expect(hasEmoji(text), `emoji in: ${text}`).toBe(false)
    }
  })
})
