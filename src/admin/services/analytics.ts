// Mock analytics: derives dashboard KPIs and the UTM attribution report from
// the in-memory store. All aggregation is pure over MOCK_DB.

import { MOCK_DB } from '../mock';
import { demoState } from './demoState';
import { AdminServiceError } from '../types';
import type { AdminDataset } from '../mock';
import type { LeadStatus, ResourceQuery } from '../types';
import type {
  AnalyticsService,
} from './types';
import type {
  AttributionGroupRow, AttributionReport, AttributionTouch, DashboardSummary, MetricDelta,
} from './analytics-types';

const DAY = 86_400_000;

function delta(current: number, previous: number): MetricDelta {
  if (previous === 0) return { value: current, changePct: null };
  return { value: current, changePct: Math.round(((current - previous) / previous) * 100) };
}

function inWindow(iso: string, from: number, to: number): boolean {
  const t = Date.parse(iso);
  return t >= from && t < to;
}

function startOfMonth(now: number): number {
  const d = new Date(now);
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
}

/** Build the derived first-touch attribution rows from leads + submissions. */
export function buildAttributionTouches(db: AdminDataset = MOCK_DB): AttributionTouch[] {
  const fromLeads: AttributionTouch[] = db.leads.map((lead) => ({
    id: `touch_${lead.id}`,
    entity: { kind: 'lead', id: lead.id, label: lead.name },
    occurredAt: lead.attribution.capturedAt,
    source: lead.attribution.utm.source ?? '(none)',
    medium: lead.attribution.utm.medium ?? '(none)',
    campaign: lead.attribution.utm.campaign ?? '(none)',
    term: lead.attribution.utm.term,
    content: lead.attribution.utm.content,
    landingPage: lead.attribution.landingPage,
    referrer: lead.attribution.referrer,
    value: lead.estimatedValue,
    status: lead.status,
  }));
  const fromSubs: AttributionTouch[] = db.submissions.map((sub) => ({
    id: `touch_${sub.id}`,
    entity: { kind: 'submission', id: sub.id, label: sub.fields.name ?? sub.formName },
    occurredAt: sub.submittedAt,
    source: sub.utm.source ?? '(none)',
    medium: sub.utm.medium ?? '(none)',
    campaign: sub.utm.campaign ?? '(none)',
    term: sub.utm.term,
    content: sub.utm.content,
    landingPage: undefined,
    referrer: sub.referrer,
    value: 0,
    status: sub.status,
  }));
  return [...fromLeads, ...fromSubs].sort(
    (a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt),
  );
}

function groupTouches(
  touches: AttributionTouch[],
  keyFn: (t: AttributionTouch) => string,
): AttributionGroupRow[] {
  const map = new Map<string, AttributionGroupRow>();
  for (const t of touches) {
    const key = keyFn(t) || '(none)';
    const row = map.get(key) ?? { key, touches: 0, leads: 0, value: 0, conversions: 0 };
    row.touches += 1;
    if (t.entity.kind === 'lead') row.leads += 1;
    row.value += t.value;
    if (t.status === 'converted') row.conversions += 1;
    map.set(key, row);
  }
  return [...map.values()].sort((a, b) => b.touches - a.touches || b.value - a.value);
}

export function createMockAnalyticsService(guard?: () => void): AnalyticsService {
  const delay = (min = 260, max = 560): Promise<void> =>
    new Promise((r) => setTimeout(r, Math.round(min + Math.random() * (max - min))));

  return {
    async dashboard(): Promise<DashboardSummary> {
      guard?.();
      if (demoState.get('dashboard') === 'loading') await delay(10_000_000, 10_000_000);
      await delay();
      if (demoState.get('dashboard') === 'error') {
        throw new AdminServiceError('server', 'Could not load the dashboard.');
      }
      const now = Date.now();
      const win30 = now - 30 * DAY;
      const win60 = now - 60 * DAY;
      const monthStart = startOfMonth(now);

      const leads = MOCK_DB.leads;
      const deals = MOCK_DB.deals;
      const openStageIds = MOCK_DB.pipeline.filter((s) => !s.isClosed).map((s) => s.id);

      const newLeads = leads.filter((l) => inWindow(l.createdAt, win30, now)).length;
      const prevLeads = leads.filter((l) => inWindow(l.createdAt, win60, win30)).length;

      const openDeals = deals.filter((d) => openStageIds.includes(d.stageId));
      const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0);

      const nextMonthStart = new Date(new Date(monthStart).getFullYear(), new Date(monthStart).getMonth() + 1, 1).getTime();
      const wonThisMonth = deals
        .filter((d) => {
          if (d.stageId !== 'won' || !d.closedAt) return false;
          const t = Date.parse(d.closedAt);
          return t >= monthStart && t < nextMonthStart;
        })
        .reduce((s, d) => s + d.value, 0);
      const wonPrevMonth = deals
        .filter((d) => {
          if (d.stageId !== 'won' || !d.closedAt) return false;
          const t = Date.parse(d.closedAt);
          const prevStart = new Date(new Date(monthStart).getFullYear(), new Date(monthStart).getMonth() - 1, 1).getTime();
          return t >= prevStart && t < monthStart;
        })
        .reduce((s, d) => s + d.value, 0);

      const tasksDue = MOCK_DB.tasks.filter(
        (t) => t.status !== 'done' && Date.parse(t.dueAt) <= now + 7 * DAY,
      ).length;

      const newSubs = MOCK_DB.submissions.filter((s) => inWindow(s.submittedAt, win30, now)).length;
      const prevSubs = MOCK_DB.submissions.filter((s) => inWindow(s.submittedAt, win60, win30)).length;

      const statuses: LeadStatus[] = ['new', 'working', 'qualified', 'unqualified', 'converted'];
      const leadsByStatus = statuses.map((status) => ({
        status,
        count: leads.filter((l) => l.status === status).length,
      }));

      const pipelineByStage = MOCK_DB.pipeline
        .filter((s) => !s.isClosed)
        .map((stage) => {
          const stageDeals = deals.filter((d) => d.stageId === stage.id);
          return {
            stageId: stage.id,
            label: stage.label,
            count: stageDeals.length,
            value: stageDeals.reduce((s, d) => s + d.value, 0),
          };
        });

      // Weekly new-lead trend, oldest to newest, last 8 weeks.
      const newLeadsTrend = Array.from({ length: 8 }, (_, i) => {
        const weeksAgo = 7 - i;
        const from = now - (weeksAgo + 1) * 7 * DAY;
        const to = now - weeksAgo * 7 * DAY;
        return {
          label: `W-${weeksAgo}`,
          count: leads.filter((l) => inWindow(l.createdAt, from, to)).length,
        };
      });

      const sourceAgg = new Map<string, { leads: number; value: number }>();
      for (const l of leads) {
        const agg = sourceAgg.get(l.sourceId) ?? { leads: 0, value: 0 };
        agg.leads += 1;
        agg.value += l.estimatedValue;
        sourceAgg.set(l.sourceId, agg);
      }
      const topSources = [...sourceAgg.entries()]
        .map(([sourceId, agg]) => ({
          sourceId,
          name: MOCK_DB.sources.find((s) => s.id === sourceId)?.name ?? sourceId,
          leads: agg.leads,
          value: agg.value,
        }))
        .sort((a, b) => b.leads - a.leads)
        .slice(0, 5);

      const recentSubmissions = [...MOCK_DB.submissions]
        .sort((a, b) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt))
        .slice(0, 6)
        .map((s) => ({
          id: s.id,
          formName: s.formName,
          name: s.fields.name ?? 'Unknown',
          submittedAt: s.submittedAt,
        }));

      const upcomingFollowUps = MOCK_DB.followUps
        .filter((f) => f.status === 'scheduled' && Date.parse(f.dueAt) >= now)
        .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt))
        .slice(0, 6)
        .map((f) => ({ id: f.id, label: f.related.label, dueAt: f.dueAt, channel: f.channel }));

      return {
        generatedAt: new Date(now).toISOString(),
        kpis: {
          newLeads: delta(newLeads, prevLeads),
          openDeals: { value: openDeals.length, changePct: null },
          pipelineValue: { value: pipelineValue, changePct: null },
          wonThisMonth: delta(wonThisMonth, wonPrevMonth),
          tasksDue: { value: tasksDue, changePct: null },
          newSubmissions: delta(newSubs, prevSubs),
        },
        leadsByStatus,
        pipelineByStage,
        newLeadsTrend,
        topSources,
        recentSubmissions,
        upcomingFollowUps,
      };
    },

    async attribution(query: ResourceQuery): Promise<AttributionReport> {
      guard?.();
      if (demoState.get('attribution') === 'loading') await delay(10_000_000, 10_000_000);
      await delay();
      if (demoState.get('attribution') === 'error') {
        throw new AdminServiceError('server', 'Could not load attribution.');
      }
      let touches = buildAttributionTouches();
      const range = query.filters?.range;
      if (range && typeof range === 'object' && !Array.isArray(range)) {
        if (range.from) touches = touches.filter((t) => Date.parse(t.occurredAt) >= Date.parse(range.from!));
        if (range.to) touches = touches.filter((t) => Date.parse(t.occurredAt) <= Date.parse(range.to!) + DAY - 1);
      }
      return {
        totalTouches: touches.length,
        totalValue: touches.reduce((s, t) => s + t.value, 0),
        bySource: groupTouches(touches, (t) => t.source),
        byMedium: groupTouches(touches, (t) => t.medium),
        byCampaign: groupTouches(touches, (t) => t.campaign),
      };
    },
  };
}
