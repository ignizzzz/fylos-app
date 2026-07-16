// ============================================================================
// Mock scenario configuration.
//
// The task requires every screen to be reachable in loading / empty / error /
// failed states without a backend. One place decides the active scenario, so a
// single control (or a URL like ?state=error&latency=1500) flips the whole UI.
//
// Scenarios:
//   ok       resolve with seed data (the happy path)
//   empty    resolve with empty datasets (empty states)
//   error    reject with a typed ServiceError (error states)
//   loading  never resolve (the loading skeletons stay up for review)
//
// "Failed delivery" is a data state, not a scenario: specific seeded campaigns
// carry status 'failed', and sendCampaign() can resolve to a failed campaign.
//
// Resolution order (last wins):
//   1. Hard defaults
//   2. URL query string (?state=…&latency=…) when a window exists
//   3. Runtime override set via setMockConfig() (the control + tests)
// ============================================================================

export type MockScenario = 'ok' | 'empty' | 'error' | 'loading'

export interface MockConfig {
  scenario: MockScenario
  /** Simulated round-trip latency in milliseconds. */
  latencyMs: number
}

/** Per-call override, used by tests for determinism and by internal helpers. */
export type MockOptions = Partial<MockConfig>

const VALID: readonly MockScenario[] = ['ok', 'empty', 'error', 'loading']

export function isMockScenario(value: unknown): value is MockScenario {
  return typeof value === 'string' && (VALID as readonly string[]).includes(value)
}

const DEFAULTS: MockConfig = { scenario: 'ok', latencyMs: 600 }

function readQuery(): MockOptions {
  if (typeof window === 'undefined' || !window.location) return {}
  const out: MockOptions = {}
  try {
    const params = new URLSearchParams(window.location.search)
    const scenario = params.get('state')
    if (isMockScenario(scenario)) out.scenario = scenario
    const latency = Number(params.get('latency'))
    if (Number.isFinite(latency) && latency >= 0) out.latencyMs = latency
  } catch {
    // Malformed URL: fall back to defaults.
  }
  return out
}

let override: MockOptions = {}

/** Resolve the effective config, layering an optional per-call override on top. */
export function getMockConfig(opts: MockOptions = {}): MockConfig {
  return { ...DEFAULTS, ...readQuery(), ...override, ...opts }
}

/** Merge a partial config into the runtime override (the control + tests). */
export function setMockConfig(patch: MockOptions): void {
  override = { ...override, ...patch }
}

/** Clear all runtime overrides. Tests call this in afterEach. */
export function resetMockConfig(): void {
  override = {}
}
