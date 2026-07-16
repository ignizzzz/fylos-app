import { FlaskConical } from 'lucide-react'
import type { MockScenario } from '../core/mockConfig'
import { useScenario } from '../state/ScenarioContext'
import { C, SHADOW } from './tokens'

const OPTIONS: { key: MockScenario; label: string }[] = [
  { key: 'ok', label: 'Data' },
  { key: 'empty', label: 'Empty' },
  { key: 'error', label: 'Error' },
  { key: 'loading', label: 'Loading' },
]

/**
 * Floating control to preview every screen in each mock state. This is a design
 * viewer aid; it exists because there is no backend to produce these states.
 */
export function ScenarioSwitcher() {
  const { scenario, setScenario } = useScenario()
  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1.5 px-2 py-1.5"
      style={{
        bottom: 18,
        background: 'rgba(17,17,17,0.9)',
        borderRadius: 999,
        boxShadow: SHADOW.card,
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="flex items-center gap-1 pl-2 pr-1 text-[11px] font-semibold" style={{ color: '#EDE8E2' }}>
        <FlaskConical size={13} strokeWidth={2.2} />
        <span className="hidden sm:inline">Preview state</span>
      </span>
      {OPTIONS.map((o) => {
        const active = scenario === o.key
        return (
          <button
            key={o.key}
            type="button"
            onClick={() => setScenario(o.key)}
            className="h-7 px-3 rounded-full text-[12px] font-semibold transition-colors"
            style={{
              background: active ? C.coral : 'transparent',
              color: active ? '#FFFFFF' : '#C9C3BC',
            }}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
