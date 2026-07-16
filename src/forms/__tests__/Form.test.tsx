import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Form } from '../components/Form'
import { FORMS } from '../schemas'
import { resetMockConfig, setMockConfig } from '../core/mockConfig'
import { __resetMockStore } from '../core/mockClient'

beforeEach(() => {
  __resetMockStore()
  setMockConfig({ delayMs: 0, scenario: 'success', detectDuplicates: true })
})

afterEach(() => {
  resetMockConfig()
  __resetMockStore()
})

describe('Form accessibility and wiring', () => {
  it('gives every control a real, programmatic label', () => {
    render(<Form schema={FORMS.newsletter} />)
    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    expect(screen.getByRole('checkbox', { name: /fylos letter/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('shows inline errors and marks fields invalid on an empty submit', async () => {
    const user = userEvent.setup()
    render(<Form schema={FORMS.newsletter} />)

    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    const email = screen.getByRole('textbox', { name: /email/i })
    expect(email).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText(/fill this in/i)).toBeInTheDocument()
    expect(screen.getByText(/tick this to continue/i)).toBeInTheDocument()
  })

  it('will not submit until a required consent box is ticked', async () => {
    const user = userEvent.setup()
    render(<Form schema={FORMS.newsletter} />)

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'person@fylos.me')
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    expect(screen.getByText(/tick this to continue/i)).toBeInTheDocument()
    expect(screen.queryByText(FORMS.newsletter.success.title)).not.toBeInTheDocument()
  })

  it('reaches the success state on a valid submission', async () => {
    const user = userEvent.setup()
    render(<Form schema={FORMS.newsletter} />)

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'person@fylos.me')
    await user.click(screen.getByRole('checkbox', { name: /fylos letter/i }))
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    expect(await screen.findByText(FORMS.newsletter.success.title)).toBeInTheDocument()
  })

  it('shows a retryable banner on a server error', async () => {
    setMockConfig({ scenario: 'server' })
    const user = userEvent.setup()
    render(<Form schema={FORMS.newsletter} />)

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'person@fylos.me')
    await user.click(screen.getByRole('checkbox', { name: /fylos letter/i }))
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    const alert = await screen.findByRole('alert')
    expect(within(alert).getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('moves focus to the alert banner on a submission-level error', async () => {
    setMockConfig({ scenario: 'server' })
    const user = userEvent.setup()
    render(<Form schema={FORMS.newsletter} />)

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'person@fylos.me')
    await user.click(screen.getByRole('checkbox', { name: /fylos letter/i }))
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    const alert = await screen.findByRole('alert')
    await waitFor(() => expect(alert).toHaveFocus())
  })

  it('gives every rendered control an accessible name', () => {
    render(<Form schema={FORMS.contact} showHeader={false} />)
    const controls = [
      ...screen.getAllByRole('textbox'),
      ...screen.getAllByRole('combobox'),
      ...screen.getAllByRole('checkbox'),
    ]
    expect(controls.length).toBeGreaterThan(0)
    for (const el of controls) {
      expect(el).toHaveAccessibleName()
    }
  })

  it('links each field error to its control via aria-describedby', async () => {
    const user = userEvent.setup()
    render(<Form schema={FORMS.newsletter} />)

    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    const email = screen.getByRole('textbox', { name: /email/i })
    const describedby = email.getAttribute('aria-describedby')
    expect(describedby).toBeTruthy()
    const linkedText = describedby!
      .split(' ')
      .map((id) => document.getElementById(id)?.textContent ?? '')
      .join(' ')
    expect(linkedText).toMatch(/fill this in/i)
  })

  it('shows a duplicate state with a Send another action that resets the form', async () => {
    setMockConfig({ scenario: 'duplicate' })
    const user = userEvent.setup()
    render(<Form schema={FORMS.newsletter} />)

    await user.type(screen.getByRole('textbox', { name: /email/i }), 'dup@fylos.me')
    await user.click(screen.getByRole('checkbox', { name: /fylos letter/i }))
    await user.click(screen.getByRole('button', { name: /subscribe/i }))

    const alert = await screen.findByRole('alert')
    const sendAnother = within(alert).getByRole('button', { name: /send another/i })
    await user.click(sendAnother)

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('')
  })

  it('reveals a conditional field only when its trigger is chosen', async () => {
    const user = userEvent.setup()
    render(<Form schema={FORMS.veterinary} showHeader={false} />)

    expect(screen.queryByRole('textbox', { name: /which system/i })).not.toBeInTheDocument()

    await user.selectOptions(
      screen.getByRole('combobox', { name: /practice management software/i }),
      'Other',
    )

    expect(screen.getByRole('textbox', { name: /which system/i })).toBeInTheDocument()
  })
})
