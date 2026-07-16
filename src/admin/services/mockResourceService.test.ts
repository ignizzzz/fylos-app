import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createMockResourceService } from './mockResourceService';
import { demoState } from './demoState';
import { eqField } from './query';
import { AdminServiceError } from '../types';
import type { QueryConfig } from './query';

interface Row { id: string; name: string; status: string }

function makeTable(): Row[] {
  return [
    { id: '1', name: 'Ada', status: 'new' },
    { id: '2', name: 'Bruno', status: 'done' },
    { id: '3', name: 'Cara', status: 'new' },
  ];
}

const config: QueryConfig<Row> = {
  searchFields: (r) => [r.name],
  filterMatchers: { status: eqField<Row>((r) => r.status) },
  defaultSort: { field: 'name', dir: 'asc' },
};

function makeService(table: Row[], guard?: () => void) {
  return createMockResourceService<Row>({
    key: 'testres',
    table,
    idOf: (r) => r.id,
    config,
    guard,
    latency: [0, 0],
    buildCreate: (i) => ({ id: i.id ?? 'new', name: i.name ?? 'Untitled', status: i.status ?? 'new' }),
  });
}

afterEach(() => demoState.reset());
beforeEach(() => demoState.reset());

describe('createMockResourceService list', () => {
  it('applies the query engine (search + filter)', async () => {
    const svc = makeService(makeTable());
    const filtered = await svc.list({ page: 1, pageSize: 10, filters: { status: 'new' } });
    expect(filtered.total).toBe(2);
    const searched = await svc.list({ page: 1, pageSize: 10, search: 'bru' });
    expect(searched.items.map((r) => r.id)).toEqual(['2']);
  });

  it('returns defensive clones (mutating a result does not change the store)', async () => {
    const table = makeTable();
    const svc = makeService(table);
    const res = await svc.list({ page: 1, pageSize: 10 });
    res.items[0].name = 'MUTATED';
    expect(table.find((r) => r.id === res.items[0].id)?.name).not.toBe('MUTATED');
  });
});

describe('demo-state injection', () => {
  it('forces an empty result', async () => {
    const svc = makeService(makeTable());
    demoState.set('testres', 'empty');
    const res = await svc.list({ page: 1, pageSize: 10 });
    expect(res.total).toBe(0);
    expect(res.items).toEqual([]);
  });

  it('forces an error', async () => {
    const svc = makeService(makeTable());
    demoState.set('testres', 'error');
    await expect(svc.list({ page: 1, pageSize: 10 })).rejects.toBeInstanceOf(AdminServiceError);
  });
});

describe('guard (session expiry)', () => {
  it('rejects list when the guard throws', async () => {
    const svc = makeService(makeTable(), () => { throw new AdminServiceError('session_expired', 'gone'); });
    await expect(svc.list({ page: 1, pageSize: 10 })).rejects.toMatchObject({ code: 'session_expired' });
  });
});

describe('CRUD', () => {
  it('creates, updates and removes, mutating the store', async () => {
    const table = makeTable();
    const svc = makeService(table);

    const created = await svc.create({ id: '9', name: 'Zed', status: 'new' });
    expect(created.id).toBe('9');
    expect(table).toHaveLength(4);

    const updated = await svc.update('9', { status: 'done' });
    expect(updated.status).toBe('done');
    expect(table.find((r) => r.id === '9')?.status).toBe('done');

    await svc.remove('9');
    expect(table.find((r) => r.id === '9')).toBeUndefined();
  });

  it('throws not_found on missing update/remove', async () => {
    const svc = makeService(makeTable());
    await expect(svc.update('nope', { name: 'x' })).rejects.toMatchObject({ code: 'not_found' });
    await expect(svc.remove('nope')).rejects.toMatchObject({ code: 'not_found' });
  });
});
