import { describe, it, expect } from 'vitest';
import {
  applyQuery, isEmptyFilter, eqField, overlapsIds, dateRange, numberRange, dueMatcher,
} from './query';
import type { QueryConfig } from './query';
import type { ResourceQuery } from '../types';

interface Row {
  id: string;
  name: string;
  score: number;
  tagIds: string[];
  createdAt: string;
  status: string;
}

const rows: Row[] = [
  { id: '1', name: 'Alpha', score: 10, tagIds: ['a'], createdAt: '2026-01-01T00:00:00.000Z', status: 'new' },
  { id: '2', name: 'Bravo', score: 90, tagIds: ['a', 'b'], createdAt: '2026-03-01T00:00:00.000Z', status: 'won' },
  { id: '3', name: 'Charlie', score: 50, tagIds: ['c'], createdAt: '2026-02-01T00:00:00.000Z', status: 'new' },
  { id: '4', name: 'Delta', score: 30, tagIds: [], createdAt: '2026-04-01T00:00:00.000Z', status: 'lost' },
];

const config: QueryConfig<Row> = {
  searchFields: (r) => [r.name],
  sortAccessors: { name: (r) => r.name, score: (r) => r.score, createdAt: (r) => r.createdAt },
  filterMatchers: {
    status: eqField<Row>((r) => r.status),
    tagIds: overlapsIds<Row>((r) => r.tagIds),
    score: numberRange<Row>((r) => r.score),
    range: dateRange<Row>((r) => r.createdAt),
  },
  defaultSort: { field: 'name', dir: 'asc' },
};

function q(partial: Partial<ResourceQuery>): ResourceQuery {
  return { page: 1, pageSize: 10, ...partial };
}

describe('isEmptyFilter', () => {
  it('treats null, empty string, "all", and empty array as empty', () => {
    expect(isEmptyFilter(null)).toBe(true);
    expect(isEmptyFilter('')).toBe(true);
    expect(isEmptyFilter('all')).toBe(true);
    expect(isEmptyFilter([])).toBe(true);
    expect(isEmptyFilter({ from: null, to: null })).toBe(true);
  });
  it('treats real values as non-empty', () => {
    expect(isEmptyFilter('new')).toBe(false);
    expect(isEmptyFilter(['a'])).toBe(false);
    expect(isEmptyFilter({ from: '2026-01-01' })).toBe(false);
  });
});

describe('applyQuery search', () => {
  it('matches case-insensitively across search fields', () => {
    const r = applyQuery(rows, q({ search: 'brav' }), config);
    expect(r.items.map((x) => x.id)).toEqual(['2']);
    expect(r.total).toBe(1);
  });
  it('returns all when search is blank', () => {
    expect(applyQuery(rows, q({ search: '  ' }), config).total).toBe(4);
  });
});

describe('applyQuery filters', () => {
  it('filters by equality', () => {
    expect(applyQuery(rows, q({ filters: { status: 'new' } }), config).total).toBe(2);
  });
  it('skips filters set to "all"', () => {
    expect(applyQuery(rows, q({ filters: { status: 'all' } }), config).total).toBe(4);
  });
  it('filters by tag overlap (OR)', () => {
    expect(applyQuery(rows, q({ filters: { tagIds: ['a'] } }), config).total).toBe(2);
    expect(applyQuery(rows, q({ filters: { tagIds: ['b', 'c'] } }), config).total).toBe(2);
  });
  it('filters by numeric range', () => {
    const r = applyQuery(rows, q({ filters: { score: { from: '40', to: '95' } } }), config);
    expect(r.items.map((x) => x.id).sort()).toEqual(['2', '3']);
  });
  it('filters by inclusive date range', () => {
    const r = applyQuery(rows, q({ filters: { range: { from: '2026-02-01', to: '2026-03-01' } } }), config);
    expect(r.items.map((x) => x.id).sort()).toEqual(['2', '3']);
  });
});

describe('applyQuery sort', () => {
  it('uses the default sort when none is given', () => {
    expect(applyQuery(rows, q({}), config).items.map((x) => x.name)).toEqual(['Alpha', 'Bravo', 'Charlie', 'Delta']);
  });
  it('sorts numbers descending', () => {
    expect(applyQuery(rows, q({ sort: { field: 'score', dir: 'desc' } }), config).items.map((x) => x.score)).toEqual([90, 50, 30, 10]);
  });
  it('is stable for equal keys', () => {
    const dupes: Row[] = [
      { ...rows[0], id: 'x', score: 5 },
      { ...rows[0], id: 'y', score: 5 },
    ];
    const r = applyQuery(dupes, q({ sort: { field: 'score', dir: 'asc' } }), config);
    expect(r.items.map((x) => x.id)).toEqual(['x', 'y']);
  });

  it('sinks nullish values to the bottom in BOTH directions', () => {
    interface NRow { id: string; group: string | null }
    const nrows: NRow[] = [
      { id: 'a', group: 'Beta' },
      { id: 'b', group: null },
      { id: 'c', group: 'Alpha' },
      { id: 'd', group: null },
    ];
    const nconfig = { sortAccessors: { group: (r: NRow) => r.group } };
    const asc = applyQuery(nrows, q({ sort: { field: 'group', dir: 'asc' } }), nconfig);
    const desc = applyQuery(nrows, q({ sort: { field: 'group', dir: 'desc' } }), nconfig);
    // Non-null ordered by direction, nulls always last (stable among themselves).
    expect(asc.items.map((x) => x.id)).toEqual(['c', 'a', 'b', 'd']);
    expect(desc.items.map((x) => x.id)).toEqual(['a', 'c', 'b', 'd']);
  });
});

describe('applyQuery pagination', () => {
  it('paginates and clamps the page into range', () => {
    const r = applyQuery(rows, q({ pageSize: 2, page: 2, sort: { field: 'name', dir: 'asc' } }), config);
    expect(r.items.map((x) => x.name)).toEqual(['Charlie', 'Delta']);
    expect(r.pageCount).toBe(2);
    expect(r.total).toBe(4);
  });
  it('clamps an out-of-range page to the last page', () => {
    const r = applyQuery(rows, q({ pageSize: 2, page: 99 }), config);
    expect(r.page).toBe(2);
    expect(r.items).toHaveLength(2);
  });
});

describe('dueMatcher', () => {
  const now = Date.now();
  const item = (offsetDays: number, done: boolean) => ({ dueAt: new Date(now + offsetDays * 86400000).toISOString(), done });
  const matcher = dueMatcher<{ dueAt: string; done: boolean }>((i) => i.dueAt, (i) => i.done);
  it('flags overdue only when not done', () => {
    expect(matcher(item(-2, false), 'overdue')).toBe(true);
    expect(matcher(item(-2, true), 'overdue')).toBe(false);
  });
  it('flags upcoming for future dates', () => {
    expect(matcher(item(5, false), 'upcoming')).toBe(true);
    expect(matcher(item(-5, false), 'upcoming')).toBe(false);
  });
});
