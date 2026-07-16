import { describe, it, expect, afterEach } from 'vitest';
import { createMockAnalyticsService, buildAttributionTouches } from './analytics';
import { demoState } from './demoState';
import { generateDataset } from '../mock/generate';

afterEach(() => demoState.reset());

describe('buildAttributionTouches', () => {
  it('produces one touch per lead and submission, newest first', () => {
    const ds = generateDataset({ seed: 2, now: Date.parse('2026-07-15T00:00:00Z'), counts: { leads: 10, submissions: 6, companies: 5, contacts: 8, deals: 3, notes: 2, tasks: 2, followUps: 2 } });
    const touches = buildAttributionTouches(ds);
    expect(touches).toHaveLength(16);
    for (let i = 1; i < touches.length; i++) {
      expect(Date.parse(touches[i - 1].occurredAt)).toBeGreaterThanOrEqual(Date.parse(touches[i].occurredAt));
    }
    // Every touch has a resolved source (never undefined).
    expect(touches.every((t) => typeof t.source === 'string' && t.source.length > 0)).toBe(true);
  });
});

describe('createMockAnalyticsService.dashboard', () => {
  it('returns a coherent summary shape', async () => {
    const analytics = createMockAnalyticsService();
    const summary = await analytics.dashboard();
    expect(summary.leadsByStatus).toHaveLength(5);
    expect(summary.newLeadsTrend).toHaveLength(8);
    expect(summary.pipelineByStage.length).toBeGreaterThan(0);
    expect(summary.kpis.pipelineValue.value).toBeGreaterThanOrEqual(0);
    expect(summary.topSources.length).toBeGreaterThan(0);
  });

  it('rejects when its demo-state is forced to error', async () => {
    const analytics = createMockAnalyticsService();
    demoState.set('dashboard', 'error');
    await expect(analytics.dashboard()).rejects.toMatchObject({ code: 'server' });
  });
});

describe('createMockAnalyticsService.attribution', () => {
  it('groups touches so counts add up to the total', async () => {
    const analytics = createMockAnalyticsService();
    const report = await analytics.attribution({ page: 1, pageSize: 0 });
    const sourceSum = report.bySource.reduce((s, r) => s + r.touches, 0);
    expect(sourceSum).toBe(report.totalTouches);
    const mediumSum = report.byMedium.reduce((s, r) => s + r.touches, 0);
    expect(mediumSum).toBe(report.totalTouches);
  });
});
