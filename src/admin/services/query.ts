// Pure, framework-free query engine. Every mock resource service runs its
// in-memory table through this: search, then filters, then sort, then
// pagination. Kept pure so it is trivially unit-testable.

import type { FilterValue, ListResult, ResourceQuery } from '../types';

export type SortValue = string | number | boolean | null | undefined;

export interface QueryConfig<T> {
  /** Strings a free-text search is matched against (case-insensitive). */
  searchFields?: (item: T) => Array<string | undefined | null>;
  /** Per-field accessor used when sorting; falls back to item[field]. */
  sortAccessors?: Record<string, (item: T) => SortValue>;
  /** Per-filter-key predicate. A filter is skipped when its value is empty. */
  filterMatchers?: Record<string, (item: T, value: FilterValue) => boolean>;
  /** Default sort applied when the query has none. */
  defaultSort?: { field: string; dir: 'asc' | 'desc' };
}

/** True when a filter value should be treated as "not set" (so we skip it). */
export function isEmptyFilter(value: FilterValue): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '' || value === 'all';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') {
    const from = 'from' in value ? value.from : undefined;
    const to = 'to' in value ? value.to : undefined;
    return !from && !to;
  }
  return false;
}

function compare(a: SortValue, b: SortValue): number {
  // Nullish always sorts last, regardless of direction handling below.
  const an = a === null || a === undefined;
  const bn = b === null || b === undefined;
  if (an && bn) return 0;
  if (an) return 1;
  if (bn) return -1;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
}

/** Case-insensitive "field contains value" for string filters. */
export function matchesText(value: string | undefined | null, needle: string): boolean {
  return (value ?? '').toLowerCase().includes(needle.toLowerCase());
}

export function applyQuery<T>(
  items: readonly T[],
  query: ResourceQuery,
  config: QueryConfig<T> = {},
): ListResult<T> {
  const { search, filters, sort, page, pageSize } = query;
  let rows = items.slice();

  // 1. Free-text search across configured fields.
  const needle = search?.trim().toLowerCase();
  if (needle && config.searchFields) {
    rows = rows.filter((item) =>
      config.searchFields!(item).some((f) => (f ?? '').toLowerCase().includes(needle)),
    );
  }

  // 2. Filters (each skipped when empty / "all").
  if (filters && config.filterMatchers) {
    for (const [key, value] of Object.entries(filters)) {
      if (isEmptyFilter(value)) continue;
      const matcher = config.filterMatchers[key];
      if (!matcher) continue;
      rows = rows.filter((item) => matcher(item, value));
    }
  }

  const total = rows.length;

  // 3. Sort (explicit query sort wins, else config default).
  const activeSort = sort ?? config.defaultSort ?? null;
  if (activeSort) {
    const accessor =
      config.sortAccessors?.[activeSort.field] ??
      ((item: T) => (item as Record<string, unknown>)[activeSort.field] as SortValue);
    const dir = activeSort.dir === 'desc' ? -1 : 1;
    rows = rows
      .map((item, index) => ({ item, index }))
      .sort((a, b) => {
        const av = accessor(a.item);
        const bv = accessor(b.item);
        const an = av === null || av === undefined;
        const bn = bv === null || bv === undefined;
        // Nullish always sinks to the bottom, independent of sort direction.
        if (an || bn) {
          if (an && bn) return a.index - b.index;
          return an ? 1 : -1;
        }
        const c = compare(av, bv);
        return c !== 0 ? c * dir : a.index - b.index; // stable
      })
      .map((r) => r.item);
  }

  // 4. Paginate (1-based page).
  const safeSize = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(total / safeSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * safeSize;
  const pageItems = rows.slice(start, start + safeSize);

  return { items: pageItems, total, page: safePage, pageSize: safeSize, pageCount };
}

// ── Reusable filter-matcher builders ───────────────────────────────────────

/** Exact match on a scalar field against a string value (or one of an array). */
export function eqField<T>(get: (item: T) => string | number | null | undefined) {
  return (item: T, value: FilterValue): boolean => {
    const actual = get(item);
    if (Array.isArray(value)) return value.map(String).includes(String(actual));
    return String(actual) === String(value);
  };
}

/** True when the item's id-list overlaps the selected ids (OR semantics). */
export function overlapsIds<T>(get: (item: T) => string[]) {
  return (item: T, value: FilterValue): boolean => {
    const selected = Array.isArray(value) ? value : [String(value)];
    const owned = new Set(get(item));
    return selected.some((id) => owned.has(id));
  };
}

/** Inclusive ISO date-range match against a timestamp field. */
export function dateRange<T>(get: (item: T) => string | null | undefined) {
  return (item: T, value: FilterValue): boolean => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return true;
    const ts = get(item);
    if (!ts) return false;
    const t = Date.parse(ts);
    if (value.from && t < Date.parse(value.from)) return false;
    if (value.to && t > Date.parse(value.to) + 86_400_000 - 1) return false;
    return true;
  };
}

/**
 * Quick due-window match relative to now: "overdue" (past and not done),
 * "today", or "upcoming" (now or later). Any other value matches everything.
 */
export function dueMatcher<T>(getDue: (item: T) => string, isDone: (item: T) => boolean) {
  return (item: T, value: FilterValue): boolean => {
    const t = Date.parse(getDue(item));
    if (Number.isNaN(t)) return false;
    const now = Date.now();
    if (value === 'overdue') return t < now && !isDone(item);
    if (value === 'today') {
      const d = new Date();
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
      return t >= start && t < start + 86_400_000;
    }
    if (value === 'upcoming') return t >= now;
    return true;
  };
}

/** Numeric range match (value is {from,to} as numeric strings). */
export function numberRange<T>(get: (item: T) => number | null | undefined) {
  return (item: T, value: FilterValue): boolean => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return true;
    const n = get(item);
    if (n === null || n === undefined) return false;
    if (value.from != null && value.from !== '' && n < Number(value.from)) return false;
    if (value.to != null && value.to !== '' && n > Number(value.to)) return false;
    return true;
  };
}
