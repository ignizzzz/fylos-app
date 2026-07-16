// Deterministic pseudo-random generator so the mock dataset is identical on
// every load and every test run. No Math.random anywhere in the data layer.

export type Rng = ReturnType<typeof makeRng>;

/** mulberry32 — small, fast, seedable 32-bit PRNG. */
export function makeRng(seed: number) {
  let a = seed >>> 0;
  const next = (): number => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    /** Integer in [min, max] inclusive. */
    int(min: number, max: number): number {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    /** Float in [min, max). */
    float(min: number, max: number): number {
      return next() * (max - min) + min;
    },
    /** True with probability p. */
    chance(p: number): boolean {
      return next() < p;
    },
    /** One random element. */
    pick<T>(arr: readonly T[]): T {
      return arr[Math.floor(next() * arr.length)];
    },
    /** Weighted pick from [value, weight] pairs. */
    weighted<T>(pairs: ReadonlyArray<readonly [T, number]>): T {
      const total = pairs.reduce((s, [, w]) => s + w, 0);
      let r = next() * total;
      for (const [value, w] of pairs) {
        r -= w;
        if (r <= 0) return value;
      }
      return pairs[pairs.length - 1][0];
    },
    /** n distinct elements (or fewer if arr is shorter), order randomised. */
    sample<T>(arr: readonly T[], n: number): T[] {
      const pool = arr.slice();
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
      }
      return pool.slice(0, Math.max(0, Math.min(n, pool.length)));
    },
  };
}
