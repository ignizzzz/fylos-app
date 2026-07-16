// DTOs returned by the AnalyticsService. Pure types (no imports from the
// service layer) so they can be shared without creating an import cycle.

import type { ID, ISODateString } from '../types';
import type { EntityRef, LeadStatus, PipelineStageId } from '../types';

export interface MetricDelta {
  value: number;
  /** Percentage change vs the prior period; null when there is no baseline. */
  changePct: number | null;
}

export interface DashboardSummary {
  generatedAt: ISODateString;
  kpis: {
    newLeads: MetricDelta;
    openDeals: MetricDelta;
    pipelineValue: MetricDelta;
    wonThisMonth: MetricDelta;
    tasksDue: MetricDelta;
    newSubmissions: MetricDelta;
  };
  leadsByStatus: Array<{ status: LeadStatus; count: number }>;
  pipelineByStage: Array<{ stageId: PipelineStageId; label: string; count: number; value: number }>;
  newLeadsTrend: Array<{ label: string; count: number }>;
  topSources: Array<{ sourceId: ID; name: string; leads: number; value: number }>;
  recentSubmissions: Array<{ id: ID; formName: string; name: string; submittedAt: ISODateString }>;
  upcomingFollowUps: Array<{ id: ID; label: string; dueAt: ISODateString; channel: string }>;
}

// ── UTM attribution ────────────────────────────────────────────────────────

export interface AttributionTouch {
  id: ID;
  entity: EntityRef;
  occurredAt: ISODateString;
  source: string;
  medium: string;
  campaign: string;
  term?: string;
  content?: string;
  landingPage?: string;
  referrer?: string;
  value: number;
  status: string;
}

export interface AttributionGroupRow {
  key: string;
  touches: number;
  leads: number;
  value: number;
  conversions: number;
}

export interface AttributionReport {
  totalTouches: number;
  totalValue: number;
  bySource: AttributionGroupRow[];
  byMedium: AttributionGroupRow[];
  byCampaign: AttributionGroupRow[];
}
