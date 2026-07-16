import { describe, it, expect } from 'vitest';
import { generateDataset } from './generate';

const FIXED_NOW = Date.parse('2026-07-15T12:00:00.000Z');

describe('generateDataset', () => {
  it('is deterministic for the same seed and now', () => {
    const a = generateDataset({ seed: 42, now: FIXED_NOW });
    const b = generateDataset({ seed: 42, now: FIXED_NOW });
    expect(a.leads.map((l) => l.id)).toEqual(b.leads.map((l) => l.id));
    expect(a.leads[0]).toEqual(b.leads[0]);
    expect(a.companies[10]?.name).toEqual(b.companies[10]?.name);
  });

  it('respects requested counts', () => {
    const ds = generateDataset({ seed: 1, now: FIXED_NOW, counts: { companies: 5, contacts: 12, leads: 8, deals: 4, submissions: 6, notes: 3, tasks: 3, followUps: 3 } });
    expect(ds.companies).toHaveLength(5);
    expect(ds.contacts).toHaveLength(12);
    expect(ds.leads).toHaveLength(8);
    expect(ds.deals).toHaveLength(4);
    expect(ds.submissions).toHaveLength(6);
  });

  it('keeps referential integrity: contact.companyId points at a real company', () => {
    const ds = generateDataset({ seed: 7, now: FIXED_NOW });
    const companyIds = new Set(ds.companies.map((c) => c.id));
    for (const c of ds.contacts) {
      if (c.companyId) expect(companyIds.has(c.companyId)).toBe(true);
    }
  });

  it('keeps referential integrity: owners and sources resolve', () => {
    const ds = generateDataset({ seed: 3, now: FIXED_NOW });
    const teamIds = new Set(ds.team.map((m) => m.id));
    const sourceIds = new Set(ds.sources.map((s) => s.id));
    for (const l of ds.leads) {
      expect(teamIds.has(l.ownerId)).toBe(true);
      expect(sourceIds.has(l.sourceId)).toBe(true);
    }
  });

  it('derives company rollups from real contacts and open deals', () => {
    const ds = generateDataset({ seed: 9, now: FIXED_NOW });
    const openStages = new Set(ds.pipeline.filter((s) => !s.isClosed).map((s) => s.id));
    for (const co of ds.companies) {
      const contactCount = ds.contacts.filter((c) => c.companyId === co.id).length;
      const openValue = ds.deals.filter((d) => d.companyId === co.id && openStages.has(d.stageId)).reduce((s, d) => s + d.value, 0);
      expect(co.contactCount).toBe(contactCount);
      expect(co.openDealValue).toBe(openValue);
    }
  });

  it('links every converted lead to a deal', () => {
    const ds = generateDataset({ seed: 11, now: FIXED_NOW });
    for (const l of ds.leads) {
      if (l.status === 'converted') expect(l.convertedDealId).toBeTruthy();
    }
  });

  it('produces some overdue and some upcoming tasks', () => {
    const ds = generateDataset({ seed: 5, now: FIXED_NOW });
    const overdue = ds.tasks.filter((t) => t.status !== 'done' && Date.parse(t.dueAt) < FIXED_NOW);
    const upcoming = ds.tasks.filter((t) => Date.parse(t.dueAt) >= FIXED_NOW);
    expect(overdue.length).toBeGreaterThan(0);
    expect(upcoming.length).toBeGreaterThan(0);
  });
});
