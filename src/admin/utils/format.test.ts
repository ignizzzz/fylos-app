import { describe, it, expect } from 'vitest';
import {
  formatDate, formatRelative, formatCurrency, formatCompactCurrency, formatPercent, initialsOf, EMPTY, isOverdue,
} from './format';

const NO_DASH = /[‒–—―]/; // figure/en/em/horizontal-bar dashes

describe('formatting never emits em or en dashes (house rule)', () => {
  const samples = [
    formatDate('2026-07-15T00:00:00Z'),
    formatRelative('2026-07-10T00:00:00Z', Date.parse('2026-07-15T00:00:00Z')),
    formatRelative('2026-07-20T00:00:00Z', Date.parse('2026-07-15T00:00:00Z')),
    formatCurrency(12500),
    formatCompactCurrency(1250000),
    formatPercent(12),
    EMPTY,
  ];
  it('contains no dash characters', () => {
    for (const s of samples) expect(NO_DASH.test(s)).toBe(false);
  });
});

describe('formatRelative', () => {
  const now = Date.parse('2026-07-15T12:00:00Z');
  it('describes past and future without dashes', () => {
    expect(formatRelative('2026-07-10T12:00:00Z', now)).toBe('5 days ago');
    expect(formatRelative('2026-07-16T12:00:00Z', now)).toBe('in 1 day');
    expect(formatRelative('2026-07-15T11:59:30Z', now)).toBe('just now');
  });
});

describe('formatCurrency / compact', () => {
  it('prefixes CHF and omits decimals', () => {
    expect(formatCurrency(12500)).toMatch(/^CHF /);
    expect(formatCurrency(12500)).not.toMatch(/\./);
  });
  it('compacts thousands and millions', () => {
    expect(formatCompactCurrency(1500)).toBe('CHF 1.5k');
    expect(formatCompactCurrency(2400000)).toBe('CHF 2.4M');
  });
  it('returns the honest empty label for nullish', () => {
    expect(formatCurrency(null)).toBe(EMPTY);
    expect(formatDate(undefined)).toBe(EMPTY);
  });
});

describe('misc', () => {
  it('formatPercent adds a plus sign for positives', () => {
    expect(formatPercent(8)).toBe('+8%');
    expect(formatPercent(-3)).toBe('-3%');
  });
  it('initialsOf takes up to two letters', () => {
    expect(initialsOf('Mara Steiner')).toBe('MS');
    expect(initialsOf('Cher')).toBe('C');
  });
  it('isOverdue compares against now', () => {
    const now = Date.parse('2026-07-15T00:00:00Z');
    expect(isOverdue('2026-07-14T00:00:00Z', now)).toBe(true);
    expect(isOverdue('2026-07-16T00:00:00Z', now)).toBe(false);
  });
});
