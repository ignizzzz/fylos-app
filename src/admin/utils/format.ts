// Formatting helpers. House copy rule (founder): no em or en dashes anywhere
// in user-facing text, no emoji. Ranges use a plain hyphen, empty values are
// honest ("Not set").

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const EMPTY = 'Not set';

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return EMPTY;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return EMPTY;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return EMPTY;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return EMPTY;
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
}

/** "today", "in 3 days", "5 days ago". Coarse but dash-free. */
export function formatRelative(iso: string | null | undefined, now = Date.now()): string {
  if (!iso) return EMPTY;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return EMPTY;
  const diffMs = t - now;
  const abs = Math.abs(diffMs);
  const day = 86_400_000;
  const future = diffMs > 0;
  const units: Array<[number, string]> = [
    [365 * day, 'year'],
    [30 * day, 'month'],
    [7 * day, 'week'],
    [day, 'day'],
    [3_600_000, 'hour'],
    [60_000, 'minute'],
  ];
  if (abs < 60_000) return 'just now';
  for (const [size, name] of units) {
    if (abs >= size) {
      const n = Math.round(abs / size);
      const label = `${n} ${name}${n === 1 ? '' : 's'}`;
      return future ? `in ${label}` : `${label} ago`;
    }
  }
  return 'just now';
}

/** True when a due date is in the past (used for overdue styling). */
export function isOverdue(iso: string | null | undefined, now = Date.now()): boolean {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  return !Number.isNaN(t) && t < now;
}

export function formatCurrency(value: number | null | undefined, currency = 'CHF'): string {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY;
  const formatted = new Intl.NumberFormat('de-CH', { maximumFractionDigits: 0 }).format(value);
  return `${currency} ${formatted}`;
}

/** Compact currency for tight spaces: "CHF 12.5k", "CHF 1.2M". */
export function formatCompactCurrency(value: number | null | undefined, currency = 'CHF'): string {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY;
  if (value >= 1_000_000) return `${currency} ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${currency} ${(value / 1_000).toFixed(1)}k`;
  return `${currency} ${value}`;
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY;
  return new Intl.NumberFormat('de-CH').format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return EMPTY;
  return `${value > 0 ? '+' : ''}${value}%`;
}

export function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function titleCase(s: string): string {
  return s.replace(/(^|[\s_-])(\w)/g, (_, sep, ch) => `${sep === '_' ? ' ' : sep}${ch.toUpperCase()}`).trim();
}
