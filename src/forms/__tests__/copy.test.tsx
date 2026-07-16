import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../components/Form'
import { ALL_FORMS, FORMS } from '../schemas'
import { resetMockConfig, setMockConfig } from '../core/mockConfig'
import { __resetMockStore } from '../core/mockClient'

// Enforce the founder's hard copy rules on ACTUALLY RENDERED text, so component
// literals (banner titles, button labels, success copy) are covered, not only
// the schema strings.
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

function assertClean(text: string) {
  expect(text.includes('—'), `em dash in rendered copy: ${text}`).toBe(false)
  expect(text.includes('–'), `en dash in rendered copy: ${text}`).toBe(false)
  expect(hasEmoji(text), 'emoji in rendered copy').toBe(false)
}

beforeEach(() => {
  __resetMockStore()
  setMockConfig({ delayMs: 0, scenario: 'success', detectDuplicates: true })
})

afterEach(() => {
  resetMockConfig()
  __resetMockStore()
})

describe('rendered copy obeys the no-dash, no-emoji rules', () => {
  it.each(ALL_FORMS)('renders form $id without dashes or emoji', (schema) => {
    const { container } = render(<Form schema={schema} />)
    assertClean(container.textContent ?? '')
  })

  it('keeps the validation summary banner clean', async () => {
    const user = userEvent.setup()
    render(<Form schema={FORMS.contact} />)
    await user.click(screen.getByRole('button', { name: /send message/i }))
    assertClean((await screen.findByRole('alert')).textContent ?? '')
  })

  it('keeps the server error banner clean', async () => {
    setMockConfig({ scenario: 'server' })
    const user = userEvent.setup()
    render(<Form schema={FORMS.newsletter} />)
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'person@fylos.me')
    await user.click(screen.getByRole('checkbox', { name: /fylos letter/i }))
    await user.click(screen.getByRole('button', { name: /subscribe/i }))
    const alert = await screen.findByRole('alert')
    assertClean(alert.textContent ?? '')
    // The retry affordance copy too.
    assertClean(within(alert).getByRole('button', { name: /try again/i }).textContent ?? '')
  })

  it('keeps the success panel clean', async () => {
    const user = userEvent.setup()
    render(<Form schema={FORMS.newsletter} />)
    await user.type(screen.getByRole('textbox', { name: /email/i }), 'person@fylos.me')
    await user.click(screen.getByRole('checkbox', { name: /fylos letter/i }))
    await user.click(screen.getByRole('button', { name: /subscribe/i }))
    const status = await screen.findByRole('status')
    assertClean(status.textContent ?? '')
  })
})
