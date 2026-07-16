// Factory that turns an in-memory array (a slice of MOCK_DB) into a
// ResourceService: simulated latency, deliberate loading/empty/error
// injection, a session guard, and full search/filter/sort/pagination via the
// pure query engine. Swap this for an HTTP client to go live.

import { applyQuery } from './query';
import type { QueryConfig } from './query';
import { demoState } from './demoState';
import { AdminServiceError } from '../types';
import type { ID, ListResult, ResourceQuery } from '../types';
import type { ResourceService } from './types';

const HANG_MS = 10_000_000; // "loading" injection: effectively never resolves

function delay(min: number, max: number): Promise<void> {
  const ms = Math.round(min + Math.random() * (max - min));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function defaultClone<T>(item: T): T {
  return typeof structuredClone === 'function'
    ? structuredClone(item)
    : (JSON.parse(JSON.stringify(item)) as T);
}

export interface MockResourceOptions<T> {
  key: string;
  /** The live array inside MOCK_DB. Mutated in place by create/update/remove. */
  table: T[];
  idOf: (item: T) => ID;
  config?: QueryConfig<T>;
  clone?: (item: T) => T;
  /** Builds a full record from a partial create payload. Required for create(). */
  buildCreate?: (input: Partial<T>) => T;
  onChange?: () => void;
  /** Throws (e.g. session_expired) before any operation runs. */
  guard?: () => void;
  latency?: [number, number];
  /** Prepend new records (true) or append (false). Default: prepend. */
  prepend?: boolean;
}

export function createMockResourceService<T>(opts: MockResourceOptions<T>): ResourceService<T> {
  const clone = opts.clone ?? defaultClone;
  const [lo, hi] = opts.latency ?? [220, 520];

  const run = async (): Promise<void> => {
    opts.guard?.();
    await delay(lo, hi);
  };

  return {
    key: opts.key,

    async list(query: ResourceQuery): Promise<ListResult<T>> {
      opts.guard?.();
      const mode = demoState.get(opts.key);
      if (mode === 'loading') {
        await delay(HANG_MS, HANG_MS);
      }
      await delay(lo, hi);
      if (mode === 'error') {
        throw new AdminServiceError('server', `Could not load ${opts.key}. The request failed.`);
      }
      if (mode === 'empty') {
        return { items: [], total: 0, page: 1, pageSize: query.pageSize, pageCount: 1 };
      }
      const result = applyQuery(opts.table, query, opts.config);
      return { ...result, items: result.items.map(clone) };
    },

    async get(id: ID): Promise<T | null> {
      await run();
      const found = opts.table.find((item) => opts.idOf(item) === id);
      return found ? clone(found) : null;
    },

    async create(input: Partial<T>): Promise<T> {
      await run();
      if (!opts.buildCreate) {
        throw new AdminServiceError('validation', `Creating ${opts.key} is not supported.`);
      }
      const record = opts.buildCreate(input);
      if (opts.prepend === false) opts.table.push(record);
      else opts.table.unshift(record);
      opts.onChange?.();
      return clone(record);
    },

    async update(id: ID, patch: Partial<T>): Promise<T> {
      await run();
      const idx = opts.table.findIndex((item) => opts.idOf(item) === id);
      if (idx === -1) throw new AdminServiceError('not_found', `${opts.key} ${id} was not found.`);
      const updated = { ...opts.table[idx], ...patch } as T;
      opts.table[idx] = updated;
      opts.onChange?.();
      return clone(updated);
    },

    async remove(id: ID): Promise<void> {
      await run();
      const idx = opts.table.findIndex((item) => opts.idOf(item) === id);
      if (idx === -1) throw new AdminServiceError('not_found', `${opts.key} ${id} was not found.`);
      opts.table.splice(idx, 1);
      opts.onChange?.();
    },
  };
}
