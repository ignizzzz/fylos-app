import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { MockScenario } from '../core/mockConfig'
import { getMockConfig, setMockConfig } from '../core/mockConfig'

interface ScenarioValue {
  scenario: MockScenario
  latencyMs: number
  setScenario: (scenario: MockScenario) => void
  setLatency: (latencyMs: number) => void
}

const ScenarioCtx = createContext<ScenarioValue | null>(null)

function syncUrl(scenario: MockScenario, latencyMs: number): void {
  if (typeof window === 'undefined' || !window.history) return
  try {
    const url = new URL(window.location.href)
    if (scenario === 'ok') url.searchParams.delete('state')
    else url.searchParams.set('state', scenario)
    url.searchParams.set('latency', String(latencyMs))
    window.history.replaceState(null, '', url.toString())
  } catch {
    // Non-URL environments: skip syncing.
  }
}

/**
 * Holds the active mock scenario for the whole email surface. Changing it flips
 * every data hook (they include `scenario` in their deps) and updates the URL
 * so a state is shareable/bookmarkable.
 */
export function ScenarioProvider({ children }: { children: ReactNode }) {
  const initial = getMockConfig()
  const [scenario, setScenarioState] = useState<MockScenario>(initial.scenario)
  const [latencyMs, setLatencyState] = useState<number>(initial.latencyMs)

  const setScenario = useCallback(
    (next: MockScenario) => {
      setScenarioState(next)
      setMockConfig({ scenario: next })
      syncUrl(next, latencyMs)
    },
    [latencyMs],
  )

  const setLatency = useCallback(
    (next: number) => {
      setLatencyState(next)
      setMockConfig({ latencyMs: next })
      syncUrl(scenario, next)
    },
    [scenario],
  )

  const value = useMemo<ScenarioValue>(
    () => ({ scenario, latencyMs, setScenario, setLatency }),
    [scenario, latencyMs, setScenario, setLatency],
  )

  return <ScenarioCtx.Provider value={value}>{children}</ScenarioCtx.Provider>
}

export function useScenario(): ScenarioValue {
  const ctx = useContext(ScenarioCtx)
  if (!ctx) throw new Error('useScenario must be used within a ScenarioProvider')
  return ctx
}
