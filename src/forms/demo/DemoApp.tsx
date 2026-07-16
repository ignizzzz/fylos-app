// A self-contained playground for the form system. It exists only to exercise
// and demonstrate every form and every state (success / validation / server /
// network / duplicate / delay). It does NOT touch any live page layout.

import { useEffect, useState } from 'react'
import { ALL_FORMS } from '../schemas'
import { getMockConfig, setMockConfig } from '../core/mockConfig'
import { __resetMockStore } from '../core/mockClient'
import { Form } from '../components/Form'
import type { FormId, MockScenario } from '../core/types'
import '../styles/forms.css'
import './demo.css'

const SCENARIOS: { value: MockScenario; label: string; hint: string }[] = [
  { value: 'success', label: 'Success', hint: 'Accepts the submission' },
  { value: 'validation', label: 'Validation', hint: 'Server rejects a field' },
  { value: 'server', label: 'Server error', hint: '5xx, retryable' },
  { value: 'network', label: 'Network error', hint: 'Request fails, retryable' },
  { value: 'duplicate', label: 'Duplicate', hint: 'Already on the list' },
]

export function DemoApp() {
  // Seed from the resolved config so the advertised ?mock=&delay= URL driving
  // actually takes effect on load instead of being overwritten to defaults.
  const initialConfig = getMockConfig()
  const [formId, setFormId] = useState<FormId>(ALL_FORMS[0]!.id)
  const [scenario, setScenario] = useState<MockScenario>(initialConfig.scenario)
  const [delayMs, setDelayMs] = useState(initialConfig.delayMs)

  useEffect(() => {
    setMockConfig({ scenario, delayMs })
  }, [scenario, delayMs])

  const activeForm = ALL_FORMS.find((f) => f.id === formId) ?? ALL_FORMS[0]!
  const activeScenario = SCENARIOS.find((s) => s.value === scenario) ?? SCENARIOS[0]!

  return (
    <div className="demo-root">
      <header className="demo-head">
        <p className="demo-eyebrow">
          <span className="demo-eyebrow-dot" aria-hidden="true" />
          Fylos form system
        </p>
        <h1 className="demo-h1">
          Reusable forms, <em>every state</em>, one mock service.
        </h1>
        <p className="demo-sub">
          Pick a form and a mock scenario, then submit. Nothing leaves the browser: every response
          is fabricated by the centralized typed mock service. You can also drive it from the URL,
          for example <code>?mock=server&amp;delay=1500</code>.
        </p>
      </header>

      <div className="demo-grid">
        <aside className="demo-controls" aria-label="Playground controls">
          <div className="demo-control-group">
            <p className="demo-control-label">The forms</p>
            <div className="demo-form-list" role="group" aria-label="Choose a form">
              {ALL_FORMS.map((form, index) => (
                <button
                  key={form.id}
                  type="button"
                  aria-pressed={form.id === formId}
                  className={`demo-chip${form.id === formId ? ' is-on' : ''}`}
                  onClick={() => setFormId(form.id)}
                >
                  <span className="demo-chip-num" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="demo-chip-id">{form.id}</span>
                  <span className="demo-chip-route">{form.route}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="demo-control-group">
            <p className="demo-control-label">Mock scenario</p>
            <div className="demo-scenarios">
              {SCENARIOS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  className={`demo-scenario${s.value === scenario ? ' is-on' : ''}`}
                  onClick={() => setScenario(s.value)}
                >
                  {s.label}
                </button>
              ))}
            </div>
            <p className="demo-scenario-hint" aria-live="polite">
              {activeScenario.hint}
            </p>
          </div>

          <div className="demo-control-group">
            <label className="demo-control-label" htmlFor="demo-delay">
              Simulated delay <span className="demo-delay-val">{delayMs} ms</span>
            </label>
            <input
              id="demo-delay"
              type="range"
              min={0}
              max={3000}
              step={100}
              value={delayMs}
              onChange={(e) => setDelayMs(Number(e.target.value))}
            />
            <button
              type="button"
              className="demo-reset"
              onClick={() => {
                __resetMockStore()
              }}
            >
              Clear duplicate memory
            </button>
          </div>
        </aside>

        <main className="demo-stage">
          <Form key={formId} schema={activeForm} />
        </main>
      </div>

      <footer className="demo-colophon">
        <span>Fylos</span>
        <span className="demo-colophon-sep" aria-hidden="true">/</span>
        <span>frontend form system</span>
        <span className="demo-colophon-sep" aria-hidden="true">/</span>
        <span>no backend, one typed mock</span>
      </footer>
    </div>
  )
}
