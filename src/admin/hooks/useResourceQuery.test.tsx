// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useResourceQuery } from './useResourceQuery';
import { applyQuery, eqField } from '../services/query';
import { demoState } from '../services';
import type { QueryConfig } from '../services/query';
import type { ResourceService } from '../services';
import type { ListResult, ResourceQuery } from '../types';

interface Row { id: string; name: string; status: string }

const TABLE: Row[] = Array.from({ length: 25 }, (_, i) => ({
  id: String(i + 1),
  name: `Row ${String(i + 1).padStart(2, '0')}`,
  status: i % 2 === 0 ? 'new' : 'done',
}));

const config: QueryConfig<Row> = {
  searchFields: (r) => [r.name],
  sortAccessors: { name: (r) => r.name },
  filterMatchers: { status: eqField<Row>((r) => r.status) },
  defaultSort: { field: 'name', dir: 'asc' },
};

function stubService(): ResourceService<Row> {
  return {
    key: 'rows',
    list: (query: ResourceQuery): Promise<ListResult<Row>> => Promise.resolve(applyQuery(TABLE, query, config)),
    get: (id) => Promise.resolve(TABLE.find((r) => r.id === id) ?? null),
    create: (i) => Promise.resolve({ id: 'x', name: '', status: 'new', ...i } as Row),
    update: (id, patch) => Promise.resolve({ ...TABLE[0], id, ...patch }),
    remove: () => Promise.resolve(),
  };
}

// One stable instance: the hook keys its fetch effect on service identity, so
// a fresh service per render (as in real usage it never is) would loop.
const SVC = stubService();

afterEach(() => demoState.reset());

describe('useResourceQuery', () => {
  it('loads the first page and reports totals', async () => {
    const { result } = renderHook(() => useResourceQuery(SVC, { pageSize: 10 }));
    await waitFor(() => expect(result.current.state.status).toBe('success'));
    expect(result.current.total).toBe(25);
    expect(result.current.items).toHaveLength(10);
    expect(result.current.pageCount).toBe(3);
  });

  it('debounced search narrows results and resets to page 1', async () => {
    const { result } = renderHook(() => useResourceQuery(SVC, { pageSize: 5 }));
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    act(() => result.current.setPage(2));
    await waitFor(() => expect(result.current.page).toBe(2));

    act(() => result.current.setSearch('Row 01'));
    await waitFor(() => expect(result.current.total).toBe(1));
    expect(result.current.page).toBe(1);
    expect(result.current.items[0]?.name).toBe('Row 01');
  });

  it('toggleSort cycles asc, desc, then clears', async () => {
    const { result } = renderHook(() => useResourceQuery(SVC, { pageSize: 5 }));
    await waitFor(() => expect(result.current.state.status).toBe('success'));

    act(() => result.current.toggleSort('name'));
    await waitFor(() => expect(result.current.sort).toEqual({ field: 'name', dir: 'asc' }));
    act(() => result.current.toggleSort('name'));
    await waitFor(() => expect(result.current.sort).toEqual({ field: 'name', dir: 'desc' }));
    act(() => result.current.toggleSort('name'));
    await waitFor(() => expect(result.current.sort).toBeNull());
  });

  it('reports a filtered-empty state distinct from a true-empty one', async () => {
    const { result } = renderHook(() => useResourceQuery(SVC, { pageSize: 5 }));
    await waitFor(() => expect(result.current.state.status).toBe('success'));
    act(() => result.current.setSearch('zzzzz'));
    await waitFor(() => expect(result.current.total).toBe(0));
    expect(result.current.isFilteredEmpty).toBe(true);
    expect(result.current.isEmpty).toBe(false);
  });
});
