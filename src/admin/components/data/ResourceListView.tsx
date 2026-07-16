// The reusable list scaffold: search + filters + demo-state injector on top,
// the sortable DataTable in the middle, pagination at the bottom, all wired to
// a useResourceQuery result. Every entity list is a thin config over this.

import type { ReactNode } from 'react';
import { tokens, radii, shadows } from '../../theme';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';
import { Toolbar, SearchInput, ClearFiltersButton, DemoStateMenu } from './Toolbar';
import { Pagination } from './Pagination';
import type { UseResourceQueryResult } from '../../hooks';

export interface ResourceListViewProps<T> {
  query: UseResourceQueryResult<T>;
  columns: Array<Column<T>>;
  rowKey: (row: T) => string;
  resourceKey: string;
  searchPlaceholder?: string;
  filters?: ReactNode;
  actions?: ReactNode;
  onRowClick?: (row: T) => void;
  emptyTitle?: string;
  emptyMessage?: ReactNode;
  emptyAction?: ReactNode;
  density?: 'comfortable' | 'compact';
}

export function ResourceListView<T>(props: ResourceListViewProps<T>) {
  const { query, columns, rowKey, resourceKey, searchPlaceholder, filters, actions, onRowClick } = props;

  return (
    <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: radii.lg, boxShadow: shadows.card, animation: 'fylosFadeUp 0.35s ease both' }}>
      <div className="p-3 border-b" style={{ borderColor: tokens.border }}>
        <Toolbar
          left={
            <>
              <SearchInput value={query.search} onChange={query.setSearch} placeholder={searchPlaceholder ?? 'Search'} />
              {filters}
              <ClearFiltersButton count={query.activeFilterCount} onClear={query.clearFilters} />
            </>
          }
          right={
            <>
              {actions}
              <DemoStateMenu resourceKey={resourceKey} />
            </>
          }
        />
      </div>

      <DataTable
        columns={columns}
        rows={query.items}
        rowKey={rowKey}
        status={query.state.status}
        error={query.state.status === 'error' ? query.state.error : null}
        onRetry={query.refetch}
        sort={query.sort}
        onToggleSort={query.toggleSort}
        onRowClick={onRowClick}
        isFilteredEmpty={query.isFilteredEmpty}
        onClearFilters={query.clearFilters}
        emptyTitle={props.emptyTitle}
        emptyMessage={props.emptyMessage}
        emptyAction={props.emptyAction}
        density={props.density}
      />

      <div className="p-3 border-t" style={{ borderColor: tokens.border }}>
        <Pagination
          page={query.page}
          pageCount={query.pageCount}
          pageSize={query.pageSize}
          total={query.total}
          onPage={query.setPage}
          onPageSize={query.setPageSize}
        />
      </div>
    </div>
  );
}
