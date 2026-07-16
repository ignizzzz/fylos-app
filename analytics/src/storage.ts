/**
 * SSR-safe, quota-safe, private-mode-safe key/value storage.
 *
 * Everything the library persists (consent choice, first-touch attribution) is
 * first-party and non-personal. If localStorage is unavailable (server render,
 * Safari private mode throwing on write, disabled storage), we fall back to an
 * in-memory map so the app never crashes and analytics simply behaves as a
 * fresh session.
 */

import type { KeyValueStore } from './types';

/** In-memory fallback used when the real Storage is unavailable. */
export class MemoryStore implements KeyValueStore {
  private readonly map = new Map<string, string>();

  get(key: string): string | null {
    return this.map.has(key) ? (this.map.get(key) as string) : null;
  }

  set(key: string, value: string): void {
    this.map.set(key, value);
  }

  remove(key: string): void {
    this.map.delete(key);
  }
}

/** Wraps a Storage (localStorage) and degrades gracefully on any failure. */
export class SafeStorage implements KeyValueStore {
  private readonly memory = new MemoryStore();
  private readonly backing: Storage | null;

  constructor(backing?: Storage | null) {
    this.backing = backing ?? null;
  }

  get(key: string): string | null {
    // The in-memory mirror always holds the most recent value written through
    // THIS instance, so it wins: this keeps reads correct even when a backing
    // write silently failed on quota (the mirror has the new value, the backing
    // store still has the stale one). On a fresh instance the mirror is empty,
    // so we fall through to the backing store and reloads still work.
    const mirrored = this.memory.get(key);
    if (mirrored !== null) return mirrored;
    if (this.backing) {
      try {
        return this.backing.getItem(key);
      } catch {
        /* fall through */
      }
    }
    return null;
  }

  set(key: string, value: string): void {
    // Always mirror to memory so reads work even if the write below throws.
    this.memory.set(key, value);
    if (this.backing) {
      try {
        this.backing.setItem(key, value);
      } catch {
        /* quota / private mode — memory copy still holds it */
      }
    }
  }

  remove(key: string): void {
    this.memory.remove(key);
    if (this.backing) {
      try {
        this.backing.removeItem(key);
      } catch {
        /* ignore */
      }
    }
  }
}

/** Resolve the best available store for the current environment. */
export function resolveStore(explicit?: KeyValueStore): KeyValueStore {
  if (explicit) return explicit;
  let backing: Storage | null = null;
  try {
    backing = typeof localStorage !== 'undefined' ? localStorage : null;
  } catch {
    backing = null;
  }
  return new SafeStorage(backing);
}

/** Read + parse JSON, returning null on any failure. */
export function readJson<T>(store: KeyValueStore, key: string): T | null {
  const raw = store.get(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Serialize + write JSON, swallowing failures (storage is best-effort). */
export function writeJson(store: KeyValueStore, key: string, value: unknown): void {
  try {
    store.set(key, JSON.stringify(value));
  } catch {
    /* ignore serialization/storage errors */
  }
}
