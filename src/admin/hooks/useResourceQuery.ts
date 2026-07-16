// The workhorse list hook. Owns the query state (search, filters, sort, page,
// pageSize), talks to a ResourceService, and exposes a clean async-state
// machine plus setters. Every list view in the admin is built on this.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue';
import { demoState } from '../services';
import { toAdminError } from '../types';
import type {
  AsyncState, FilterMap, FilterValue, ListResult, SortDir, SortSpec,
} from '../types';
import type { ResourceService } from '../services';

export interface UseResourceQueryOptions {
  pageSize?: number;
  initialSort?: SortSpec | null;
  initialFilters?: FilterMap;
  initialSearch?: string;
  /** Debounce for the search box, ms. */
  searchDelay?: number;
}

export interface UseResourceQueryResult<T> {
  state: AsyncState<ListResult<T>>;
  items: T[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;

  search: string;
  setSearch: (value: string) => void;

  filters: FilterMap;
  setFilter: (key: string, value: FilterValue) => void;
  setFilters: (next: FilterMap) => void;
  clearFilters: () => void;
  activeFilterCount: number;

  sort: SortSpec | null;
  setSort: (field: string, dir?: SortDir) => void;
  toggleSort: (field: string) => void;

  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  refetch: () => void;

  /** No results and the user has NOT narrowed anything (a true empty table). */
  isEmpty: boolean;
  /** No results but search/filters are active (a "nothing matches" empty). */
  isFilteredEmpty: boolean;
}

function countActiveFilters(filters: FilterMap): number {
  return Object.values(filters).filter((v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === 'string') return v.trim() !== '' && v !== 'all';
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Boolean(v.from) || Boolean(v.to);
    return true;
  }).length;
}

export function useResourceQuery<T>(
  service: ResourceService<T>,
  options: UseResourceQueryOptions = {},
): UseResourceQueryResult<T> {
  const { pageSize: initialPageSize = 20, initialSort = null, initialFilters = {}, initialSearch = '' } = options;

  const [searchInput, setSearchInput] = useState(initialSearch);
  const search = useDebouncedValue(searchInput, options.searchDelay ?? 300);
  const [filters, setFiltersState] = useState<FilterMap>(initialFilters);
  const [sort, setSortState] = useState<SortSpec | null>(initialSort);
  const [page, setPageState] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [state, setState] = useState<AsyncState<ListResult<T>>>({ status: 'loading' });
  const [refetchNonce, setRefetchNonce] = useState(0);
  const [demoNonce, setDemoNonce] = useState(0);

  const requestId = useRef(0);

  // Refetch when this resource's demo state is toggled.
  useEffect(() => {
    return demoState.subscribe(() => setDemoNonce((n) => n + 1));
  }, []);

  // Reset to page 1 whenever the shape of the query (not the page) changes.
  useEffect(() => {
    setPageState(1);
  }, [search, filters, sort, pageSize]);

  useEffect(() => {
    const id = ++requestId.current;
    let alive = true;
    setState({ status: 'loading' });
    service
      .list({ search, filters, sort, page, pageSize })
      .then((result) => {
        if (!alive || id !== requestId.current) return;
        setState({ status: 'success', data: result });
      })
      .catch((err) => {
        if (!alive || id !== requestId.current) return;
        setState({ status: 'error', error: toAdminError(err) });
      });
    return () => {
      alive = false;
    };
  }, [service, search, filters, sort, page, pageSize, refetchNonce, demoNonce]);

  const setSearch = useCallback((value: string) => setSearchInput(value), []);

  const setFilter = useCallback((key: string, value: FilterValue) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setFilters = useCallback((next: FilterMap) => setFiltersState(next), []);
  const clearFilters = useCallback(() => setFiltersState({}), []);

  const setSort = useCallback((field: string, dir: SortDir = 'asc') => {
    setSortState({ field, dir });
  }, []);

  const toggleSort = useCallback((field: string) => {
    setSortState((prev) => {
      if (!prev || prev.field !== field) return { field, dir: 'asc' };
      if (prev.dir === 'asc') return { field, dir: 'desc' };
      return null; // third click clears back to the service default
    });
  }, []);

  const setPage = useCallback((next: number) => setPageState(next), []);
  const setPageSize = useCallback((size: number) => setPageSizeState(size), []);
  const refetch = useCallback(() => setRefetchNonce((n) => n + 1), []);

  const data = state.status === 'success' ? state.data : null;
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters]);
  const hasNarrowed = search.trim() !== '' || activeFilterCount > 0;

  return {
    state,
    items: data?.items ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? page,
    pageCount: data?.pageCount ?? 1,
    pageSize,

    search: searchInput,
    setSearch,

    filters,
    setFilter,
    setFilters,
    clearFilters,
    activeFilterCount,

    sort,
    setSort,
    toggleSort,

    setPage,
    setPageSize,

    refetch,

    isEmpty: state.status === 'success' && data!.total === 0 && !hasNarrowed,
    isFilteredEmpty: state.status === 'success' && data!.total === 0 && hasNarrowed,
  };
}
