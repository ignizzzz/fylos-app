// A tiny observable store that lets the UI deliberately force a resource into
// its loading / empty / error state, so those states are demonstrable on
// purpose (not only when the data happens to be missing). Dev/QA affordance,
// wired to a menu in the top bar.

import type { DemoStateMode } from '../types';

type Listener = () => void;

const modes = new Map<string, DemoStateMode>();
const listeners = new Set<Listener>();

function emit(): void {
  listeners.forEach((l) => l());
}

export const demoState = {
  get(key: string): DemoStateMode {
    return modes.get(key) ?? 'normal';
  },
  set(key: string, mode: DemoStateMode): void {
    if (mode === 'normal') modes.delete(key);
    else modes.set(key, mode);
    emit();
  },
  clear(key: string): void {
    modes.delete(key);
    emit();
  },
  reset(): void {
    modes.clear();
    emit();
  },
  active(): Array<{ key: string; mode: DemoStateMode }> {
    return [...modes.entries()].map(([key, mode]) => ({ key, mode }));
  },
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
