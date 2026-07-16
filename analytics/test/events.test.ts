import { describe, it, expect } from 'vitest';
import { EVENT_NAMES, DEFAULT_EVENT_CATEGORY } from '../src/events';

describe('event catalogue', () => {
  it('defines exactly the eight required events', () => {
    expect([...EVENT_NAMES].sort()).toEqual(
      [
        'article_viewed',
        'cta_click',
        'download_clicked',
        'feature_viewed',
        'form_started',
        'form_submitted',
        'storytelling_completed',
        'storytelling_started',
      ].sort(),
    );
    expect(new Set(EVENT_NAMES).size).toBe(8);
  });

  it('defaults every product event to the nonessential analytics category', () => {
    for (const name of EVENT_NAMES) {
      expect(DEFAULT_EVENT_CATEGORY[name]).toBe('analytics');
    }
  });
});
