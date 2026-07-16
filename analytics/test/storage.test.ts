import { describe, it, expect } from 'vitest';
import { SafeStorage, MemoryStore, resolveStore, readJson, writeJson } from '../src/storage';

describe('MemoryStore', () => {
  it('gets, sets and removes', () => {
    const s = new MemoryStore();
    expect(s.get('k')).toBeNull();
    s.set('k', 'v');
    expect(s.get('k')).toBe('v');
    s.remove('k');
    expect(s.get('k')).toBeNull();
  });
});

describe('SafeStorage', () => {
  it('falls back to memory when the backing store throws on write', () => {
    const throwing: Storage = {
      length: 0,
      clear() {},
      key() {
        return null;
      },
      getItem() {
        return null;
      },
      setItem() {
        throw new Error('quota exceeded');
      },
      removeItem() {},
    };
    const s = new SafeStorage(throwing);
    // Write throws internally but the value is still readable from memory.
    s.set('k', 'v');
    expect(s.get('k')).toBe('v');
  });

  it('works with no backing store at all', () => {
    const s = new SafeStorage(null);
    s.set('a', '1');
    expect(s.get('a')).toBe('1');
  });

  it('returns the newest value even if a later backing write failed on quota', () => {
    let writes = 0;
    const map = new Map<string, string>();
    const backing: Storage = {
      length: 0,
      clear() {},
      key() {
        return null;
      },
      getItem(k) {
        return map.has(k) ? (map.get(k) as string) : null;
      },
      setItem(k, v) {
        writes += 1;
        if (writes > 1) throw new Error('quota exceeded');
        map.set(k, v);
      },
      removeItem(k) {
        map.delete(k);
      },
    };
    const s = new SafeStorage(backing);
    s.set('k', 'A'); // succeeds: backing=A, memory=A
    s.set('k', 'B'); // backing write throws: backing=A, memory=B
    // The mirror holds the newest value, so the stale backing 'A' must not win.
    expect(s.get('k')).toBe('B');
  });
});

describe('json helpers', () => {
  it('round-trips JSON and returns null on garbage', () => {
    const s = new MemoryStore();
    writeJson(s, 'x', { a: 1 });
    expect(readJson<{ a: number }>(s, 'x')).toEqual({ a: 1 });
    s.set('bad', '{not json');
    expect(readJson(s, 'bad')).toBeNull();
  });
});

describe('resolveStore', () => {
  it('returns a usable store (jsdom localStorage)', () => {
    const s = resolveStore();
    s.set('probe', '1');
    expect(s.get('probe')).toBe('1');
    s.remove('probe');
  });

  it('prefers an explicit store', () => {
    const explicit = new MemoryStore();
    expect(resolveStore(explicit)).toBe(explicit);
  });
});
