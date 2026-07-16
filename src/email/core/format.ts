// Small, dependency-free formatters. All copy avoids em/en dashes per the
// repo's permanent style rules (AGENTS.md).
import type { ISODate } from './types'

/** "Jul 15, 2026" */
export function formatDate(iso: ISODate | null): string {
  if (!iso) return 'Not set'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Not set'
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** "Jul 15, 2026 at 9:00 AM" */
export function formatDateTime(iso: ISODate | null): string {
  if (!iso) return 'Not set'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return 'Not set'
  const date = d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  return `${date} at ${time}`
}

/** Relative, coarse: "today", "3 days ago", "in 6 days". */
export function relativeDays(iso: ISODate | null, now: ISODate): string {
  if (!iso) return 'Not set'
  const then = Date.parse(iso)
  const base = Date.parse(now)
  if (Number.isNaN(then) || Number.isNaN(base)) return 'Not set'
  const diffDays = Math.round((then - base) / 86_400_000)
  if (diffDays === 0) return 'today'
  if (diffDays === -1) return 'yesterday'
  if (diffDays === 1) return 'tomorrow'
  if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
  return `in ${diffDays} days`
}

/** Whole-number count with thousands separators. */
export function formatCount(n: number): string {
  return n.toLocaleString('en-US')
}

/** Percentage of a whole, rounded, e.g. rate(11, 18) -> "61%". Guards divide-by-zero. */
export function rate(part: number, whole: number): string {
  if (whole <= 0) return '0%'
  return `${Math.round((part / whole) * 100)}%`
}

/** Mask an address for public display: "ad***@example.com". */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain || !local) return email
  const head = local.slice(0, 2)
  return `${head}${'*'.repeat(Math.max(1, local.length - 2))}@${domain}`
}
