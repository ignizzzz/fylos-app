// List toolbar: search box, filter controls, active-filter chips, right-side
// actions, and the demo-state injector (force loading/empty/error on purpose).

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Search, X, FlaskConical } from 'lucide-react';
import { tokens, toneStyles } from '../../theme';
import { Input, Select, Badge, IconButton } from '../ui/primitives';
import { Menu } from '../ui/overlays';
import { demoState } from '../../services';
import type { DemoStateMode } from '../../types';

export function Toolbar({ left, right, children }: { left?: ReactNode; right?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-between mb-3">
      <div className="flex flex-wrap items-center gap-2 min-w-0">{left ?? children}</div>
      {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search', width = 260 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; width?: number;
}) {
  return (
    <div className="relative" style={{ width }}>
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: tokens.ink3 }} />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pl-9"
        aria-label={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded"
          style={{ color: tokens.ink3 }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export interface FilterOption {
  value: string;
  label: string;
}

export function FilterSelect({ label, value, onChange, options, allLabel = 'All', width = 150 }: {
  label: string; value: string | undefined; onChange: (v: string) => void; options: FilterOption[]; allLabel?: string; width?: number;
}) {
  return (
    <Select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      style={{ width }}
    >
      <option value="">{label}: {allLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{label}: {o.label}</option>
      ))}
    </Select>
  );
}

/** Two date inputs producing a {from,to} range filter value. */
export function DateRangeFilter({ value, onChange }: {
  value: { from?: string | null; to?: string | null } | undefined;
  onChange: (v: { from?: string | null; to?: string | null }) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      <Input
        type="date"
        aria-label="From date"
        value={value?.from ?? ''}
        onChange={(e) => onChange({ from: e.target.value || null, to: value?.to ?? null })}
        style={{ width: 140 }}
      />
      <span className="text-[12px]" style={{ color: tokens.ink3 }}>to</span>
      <Input
        type="date"
        aria-label="To date"
        value={value?.to ?? ''}
        onChange={(e) => onChange({ from: value?.from ?? null, to: e.target.value || null })}
        style={{ width: 140 }}
      />
    </div>
  );
}

export function ClearFiltersButton({ count, onClear }: { count: number; onClear: () => void }) {
  if (count === 0) return null;
  return (
    <button
      onClick={onClear}
      className="inline-flex items-center gap-1.5 h-9 px-2.5 text-[12.5px] font-semibold rounded-[10px]"
      style={{ color: toneStyles.coral.fg, background: toneStyles.coral.bg, border: `1px solid ${toneStyles.coral.border}` }}
    >
      <X size={13} /> Clear {count} filter{count === 1 ? '' : 's'}
    </button>
  );
}

// ── Demo-state injector ─────────────────────────────────────────────────────

const MODES: Array<{ mode: DemoStateMode; label: string }> = [
  { mode: 'normal', label: 'Normal (real data)' },
  { mode: 'loading', label: 'Force loading' },
  { mode: 'empty', label: 'Force empty' },
  { mode: 'error', label: 'Force error' },
];

export function DemoStateMenu({ resourceKey }: { resourceKey: string }) {
  const [mode, setMode] = useState<DemoStateMode>(() => demoState.get(resourceKey));
  useEffect(() => demoState.subscribe(() => setMode(demoState.get(resourceKey))), [resourceKey]);

  return (
    <Menu
      width={200}
      items={MODES.map((m) => ({
        label: m.label,
        checked: mode === m.mode,
        onClick: () => demoState.set(resourceKey, m.mode),
      }))}
      trigger={({ toggle, open }) => (
        <div className="inline-flex items-center gap-1.5">
          {mode !== 'normal' && <Badge tone="amber">Demo: {mode}</Badge>}
          <IconButton label="Demo states" onClick={toggle} active={open || mode !== 'normal'}>
            <FlaskConical size={16} />
          </IconButton>
        </div>
      )}
    />
  );
}
