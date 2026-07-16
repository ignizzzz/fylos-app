import { describe, it, expect } from 'vitest'
import { formatCount, formatDate, maskEmail, rate, relativeDays } from './format'

describe('formatters', () => {
  it('formats counts with separators', () => {
    expect(formatCount(1240)).toBe('1,240')
  })

  it('guards divide-by-zero in rate()', () => {
    expect(rate(0, 0)).toBe('0%')
    expect(rate(11, 18)).toBe('61%')
  })

  it('renders "Not set" for null dates', () => {
    expect(formatDate(null)).toBe('Not set')
  })

  it('gives coarse relative days', () => {
    const now = '2026-07-15T09:00:00.000Z'
    expect(relativeDays(now, now)).toBe('today')
    expect(relativeDays('2026-07-12T09:00:00.000Z', now)).toBe('3 days ago')
    expect(relativeDays('2026-07-21T09:00:00.000Z', now)).toBe('in 6 days')
  })

  it('masks an email address', () => {
    expect(maskEmail('ada@example.com')).toBe('ad*@example.com')
    expect(maskEmail('bruno@example.com')).toBe('br***@example.com')
  })

  it('uses no em or en dashes in output', () => {
    const samples = [formatDate('2026-07-15T00:00:00.000Z'), formatCount(1000000), maskEmail('x@y.com')]
    for (const s of samples) {
      expect(s.includes('—')).toBe(false)
      expect(s.includes('–')).toBe(false)
    }
  })
})
