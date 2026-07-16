// Generic, sortable data table. Keeps the toolbar/header stable while the body
// swaps between loading / error / empty / rows. Column config is fully typed.

import type { ReactNode } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { tokens } from '../../theme';
import type { AdminError, AsyncStatus, SortSpec } from '../../types';
import { TableSkeleton, ErrorState, EmptyState, FilteredEmptyState } from '../states';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  render: (row: T) => ReactNode;
  /** Hide this column on narrower screens. */
  hideBelow?: 'sm' | 'md' | 'lg';
}

export interface DataTableProps<T> {
  columns: Array<Column<T>>;
  rows: T[];
  rowKey: (row: T) => string;
  status: AsyncStatus;
  error?: AdminError | null;
  onRetry?: () => void;

  sort?: SortSpec | null;
  onToggleSort?: (field: string) => void;
  onRowClick?: (row: T) => void;

  isFilteredEmpty?: boolean;
  onClearFilters?: () => void;
  emptyTitle?: string;
  emptyMessage?: ReactNode;
  emptyAction?: ReactNode;

  density?: 'comfortable' | 'compact';
  loadingRows?: number;
}

const hideClass: Record<NonNullable<Column<unknown>['hideBelow']>, string> = {
  sm: 'hidden sm:table-cell',
  md: 'hidden md:table-cell',
  lg: 'hidden lg:table-cell',
};

export function DataTable<T>(props: DataTableProps<T>) {
  const {
    columns, rows, rowKey, status, error, onRetry, sort, onToggleSort, onRowClick,
    isFilteredEmpty, onClearFilters, emptyTitle = 'Nothing here yet', emptyMessage = 'Records will appear here once they exist.',
    emptyAction, density = 'comfortable', loadingRows = 8,
  } = props;

  const rowH = density === 'compact' ? 'h-11' : 'h-[52px]';
  const alignClass = (a?: Column<T>['align']) => (a === 'right' ? 'text-right' : a === 'center' ? 'text-center' : 'text-left');

  const body = (() => {
    if (status === 'loading' || status === 'idle') {
      return (
        <tr>
          <td colSpan={columns.length} className="p-0">
            <TableSkeleton rows={loadingRows} cols={Math.min(columns.length, 6)} />
          </td>
        </tr>
      );
    }
    if (status === 'error') {
      return (
        <tr>
          <td colSpan={columns.length}><ErrorState error={error} onRetry={onRetry} /></td>
        </tr>
      );
    }
    if (rows.length === 0) {
      return (
        <tr>
          <td colSpan={columns.length}>
            {isFilteredEmpty
              ? <FilteredEmptyState onClear={onClearFilters} />
              : <EmptyState title={emptyTitle} message={emptyMessage} action={emptyAction} />}
          </td>
        </tr>
      );
    }
    return rows.map((row) => (
      <tr
        key={rowKey(row)}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        role={onRowClick ? 'button' : undefined}
        tabIndex={onRowClick ? 0 : undefined}
        onKeyDown={
          onRowClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onRowClick(row);
                }
              }
            : undefined
        }
        className={`${rowH} border-b transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[#FAF7F2] outline-none focus-visible:bg-[#F3ECE3]' : ''}`}
        style={{ borderColor: tokens.divider }}
      >
        {columns.map((col) => (
          <td
            key={col.key}
            className={`px-4 text-[13px] align-middle ${alignClass(col.align)} ${col.hideBelow ? hideClass[col.hideBelow] : ''}`}
            style={{ color: tokens.ink }}
          >
            {col.render(row)}
          </td>
        ))}
      </tr>
    ));
  })();

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: 640 }}>
        <thead>
          <tr className="border-b" style={{ borderColor: tokens.border, background: tokens.surfaceAlt }}>
            {columns.map((col) => {
              const active = sort?.field === col.key;
              const sortable = col.sortable && onToggleSort;
              const ariaSort = active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : col.sortable ? 'none' : undefined;
              return (
                <th
                  key={col.key}
                  aria-sort={ariaSort}
                  style={{ width: col.width, color: tokens.ink3 }}
                  className={`px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.07em] whitespace-nowrap ${alignClass(col.align)} ${col.hideBelow ? hideClass[col.hideBelow] : ''}`}
                >
                  {sortable ? (
                    <button
                      onClick={() => onToggleSort!(col.key)}
                      aria-label={`Sort by ${col.header}${active ? (sort!.dir === 'asc' ? ', ascending' : ', descending') : ''}`}
                      className={`inline-flex items-center gap-1 hover:text-[color:${tokens.ink}] transition-colors ${col.align === 'right' ? 'flex-row-reverse' : ''}`}
                      style={{ color: active ? tokens.ink : tokens.ink3 }}
                    >
                      {col.header}
                      {active
                        ? (sort!.dir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />)
                        : <ChevronsUpDown size={13} className="opacity-50" />}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  );
}
