// Centralized mock configuration.
//
// The whole point of the task: no backend. Every submission flows through a
// typed mock service whose behavior is driven from ONE place, so we can
// exercise success / validation failure / server failure / network failure /
// duplicate and an artificial delay without editing call sites.
//
// Resolution order for the active scenario/delay:
//   1. An explicit runtime override set via setMockConfig() (used by the demo
//      controls and by tests for determinism).
//   2. The URL query string (?mock=server&delay=1500) when a window exists.
//   3. Build-time env (VITE_FORMS_MOCK / VITE_FORMS_MOCK_DELAY).
//   4. Hard defaults (success, 700ms).

import type { MockScenario } from './types'

export interface MockConfig {
  scenario: MockScenario
  /** Simulated round-trip latency in milliseconds. */
  delayMs: number
  /**
   * When true the mock also detects genuine duplicates (same form + identity
   * submitted twice in a session) regardless of the active scenario.
   */
  detectDuplicates: boolean
}

const VALID_SCENARIOS: readonly MockScenario[] = [
  'success',
  'validation',
  'server',
  'network',
  'duplicate',
]

export function isMockScenario(value: unknown): value is MockScenario {
  return typeof value === 'string' && (VALID_SCENARIOS as readonly string[]).includes(value)
}

const DEFAULTS: MockConfig = {
  scenario: 'success',
  delayMs: 700,
  detectDuplicates: true,
}

function readEnv(): Partial<MockConfig> {
  // import.meta.env is provided by Vite/Vitest; guard for other runtimes.
  const env: Record<string, string | undefined> =
    (typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string | undefined> }).env) || {}
  const out: Partial<MockConfig> = {}
  if (isMockScenario(env.VITE_FORMS_MOCK)) out.scenario = env.VITE_FORMS_MOCK
  const delay = Number(env.VITE_FORMS_MOCK_DELAY)
  if (Number.isFinite(delay) && delay >= 0) out.delayMs = delay
  return out
}

function readQuery(): Partial<MockConfig> {
  if (typeof window === 'undefined' || !window.location) return {}
  const out: Partial<MockConfig> = {}
  try {
    const params = new URLSearchParams(window.location.search)
    const scenario = params.get('mock')
    if (isMockScenario(scenario)) out.scenario = scenario
    // Read the raw value first: Number(null) === 0 would otherwise force a 0ms
    // delay on every call when ?delay is absent, defeating env/default latency.
    const rawDelay = params.get('delay')
    if (rawDelay !== null && rawDelay.trim() !== '') {
      const delay = Number(rawDelay)
      if (Number.isFinite(delay) && delay >= 0) out.delayMs = delay
    }
  } catch {
    // Malformed URL: fall back to other sources.
  }
  return out
}

// Runtime override wins over env/query and is what tests and demo controls set.
let override: Partial<MockConfig> = {}

export function getMockConfig(): MockConfig {
  return {
    ...DEFAULTS,
    ...readEnv(),
    ...readQuery(),
    ...override,
  }
}

/** Merge a partial config into the runtime override (demo controls, tests). */
export function setMockConfig(patch: Partial<MockConfig>): void {
  override = { ...override, ...patch }
}

/** Clear all runtime overrides. Tests call this in afterEach. */
export function resetMockConfig(): void {
  override = {}
}
