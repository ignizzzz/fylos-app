import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ScenarioProvider } from '../state/ScenarioContext'
import { resetMockConfig, setMockConfig } from '../core/mockConfig'
import { resetStore } from '../core/service'
import ConfirmSubscription from './ConfirmSubscription'

function renderAt(entry: string) {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <ScenarioProvider>
        <ConfirmSubscription />
      </ScenarioProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  resetStore()
  resetMockConfig()
  setMockConfig({ latencyMs: 0 })
})

describe('ConfirmSubscription', () => {
  it('confirms a pending subscriber through to the all-set state', async () => {
    renderAt('/confirm?token=tok-confirm')
    const button = await screen.findByRole('button', { name: /confirm subscription/i })
    fireEvent.click(button)
    expect(await screen.findByText(/you are all set/i)).toBeInTheDocument()
  })

  it('shows the invalid-link state for a bad token', async () => {
    renderAt('/confirm?token=tok-expired')
    expect(await screen.findByText(/this link has expired/i)).toBeInTheDocument()
  })
})
