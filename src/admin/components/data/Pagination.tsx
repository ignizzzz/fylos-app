// Pagination bar: range summary, page-size selector, prev/next + page numbers.

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { tokens, radii } from '../../theme';
import { Select } from '../ui/primitives';

const PAGE_SIZES = [10, 20, 50, 100];

function pageWindow(page: number, pageCount: number): Array<number | '...'> {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  const out: Array<number | '...'> = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  if (start > 2) out.push('...');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < pageCount - 1) out.push('...');
  out.push(pageCount);
  return out;
}

export function Pagination({ page, pageCount, pageSize, total, onPage, onPageSize }: {
  page: number; pageCount: number; pageSize: number; total: number;
  onPage: (p: number) => void; onPageSize: (n: number) => void;
}) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  const pillStyle = (active: boolean, disabled?: boolean) => ({
    minWidth: 32,
    height: 32,
    borderRadius: radii.sm,
    border: `1px solid ${active ? tokens.coralBorder : tokens.border}`,
    background: active ? tokens.coralSoft : tokens.surface,
    color: active ? tokens.coral : disabled ? tokens.ink3 : tokens.ink2,
    opacity: disabled ? 0.5 : 1,
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-3 px-1">
      <div className="flex items-center gap-3">
        <span className="text-[12.5px] tabular-nums" style={{ color: tokens.ink3 }}>
          {from} to {to} of {total.toLocaleString('de-CH')}
        </span>
        <Select
          value={String(pageSize)}
          onChange={(e) => onPageSize(Number(e.target.value))}
          aria-label="Rows per page"
          style={{ width: 120 }}
        >
          {PAGE_SIZES.map((n) => <option key={n} value={n}>{n} per page</option>)}
        </Select>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page <= 1}
          aria-label="Previous page"
          className="inline-flex items-center justify-center disabled:cursor-not-allowed"
          style={pillStyle(false, page <= 1)}
        >
          <ChevronLeft size={16} />
        </button>
        {pageWindow(page, pageCount).map((p, i) =>
          p === '...' ? (
            <span key={`gap-${i}`} className="px-1 text-[13px]" style={{ color: tokens.ink3 }}>...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
              className="inline-flex items-center justify-center text-[13px] font-semibold tabular-nums"
              style={pillStyle(p === page)}
            >
              {p}
            </button>
          ),
        )}
        <button
          onClick={() => onPage(Math.min(pageCount, page + 1))}
          disabled={page >= pageCount}
          aria-label="Next page"
          className="inline-flex items-center justify-center disabled:cursor-not-allowed"
          style={pillStyle(false, page >= pageCount)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
