import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ScenarioProvider } from '../state/ScenarioContext'
import { resetMockConfig, setMockConfig } from '../core/mockConfig'
import { resetStore } from '../core/service'
import CampaignList from './CampaignList'

function renderList() {
  return render(
    <MemoryRouter initialEntries={['/admin/campaigns']}>
      <ScenarioProvider>
        <CampaignList />
      </ScenarioProvider>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  resetStore()
  resetMockConfig()
  setMockConfig({ latencyMs: 0 })
})

describe('CampaignList', () => {
  it('lists seeded campaigns once loaded', async () => {
    renderList()
    expect(await screen.findByText(/june neighborhood roundup/i)).toBeInTheDocument()
    expect(screen.getByText(/shared albums are here/i)).toBeInTheDocument()
  })

  it('shows the empty state under the empty scenario', async () => {
    setMockConfig({ scenario: 'empty', latencyMs: 0 })
    renderList()
    expect(await screen.findByText(/no campaigns yet/i)).toBeInTheDocument()
  })
})
