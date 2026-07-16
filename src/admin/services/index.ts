// Composition root. Wires the mock implementations behind the AdminServices
// interface. To go live, write an HTTP-backed createHttpServices() with the
// same shape and swap it in ServicesProvider; nothing else in the app changes.

import { MOCK_DB } from '../mock';
import { AdminServiceError } from '../types';
import { createMockResourceService } from './mockResourceService';
import { createMockAuthService } from './authService';
import { createMockAnalyticsService, buildAttributionTouches } from './analytics';
import { eqField, overlapsIds, dateRange, numberRange, dueMatcher } from './query';
import type { QueryConfig } from './query';
import type {
  Lead, Contact, Company, FormSubmission, Deal, Note, Task, FollowUp, Tag,
  LeadSource, TeamMember,
} from '../types';
import type { AttributionTouch } from './analytics-types';
import type { AdminServices, AuthService } from './types';

// Internal lookup maps for query configs (data layer only, never imported by UI).
const teamById = new Map(MOCK_DB.team.map((m) => [m.id, m]));
const sourceById = new Map(MOCK_DB.sources.map((s) => [s.id, s]));
const companyById = new Map(MOCK_DB.companies.map((c) => [c.id, c]));

const nowIso = (): string => new Date().toISOString();
const genId = (prefix: string): string => `${prefix}_${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;

function makeGuard(auth: AuthService): () => void {
  return () => {
    if (auth.isExpired()) {
      throw new AdminServiceError('session_expired', 'Your session has expired. Please sign in again.');
    }
  };
}

// ── Per-resource query configs ─────────────────────────────────────────────

const leadConfig: QueryConfig<Lead> = {
  searchFields: (l) => [l.name, l.email, l.companyName, l.phone],
  sortAccessors: {
    name: (l) => l.name,
    status: (l) => l.status,
    score: (l) => l.score,
    estimatedValue: (l) => l.estimatedValue,
    owner: (l) => teamById.get(l.ownerId)?.name,
    source: (l) => sourceById.get(l.sourceId)?.name,
    followUpAt: (l) => l.followUpAt ?? null,
    createdAt: (l) => l.createdAt,
    lastActivityAt: (l) => l.lastActivityAt,
  },
  filterMatchers: {
    status: eqField<Lead>((l) => l.status),
    ownerId: eqField<Lead>((l) => l.ownerId),
    sourceId: eqField<Lead>((l) => l.sourceId),
    tagIds: overlapsIds<Lead>((l) => l.tagIds),
    score: numberRange<Lead>((l) => l.score),
    range: dateRange<Lead>((l) => l.createdAt),
  },
  defaultSort: { field: 'createdAt', dir: 'desc' },
};

const contactConfig: QueryConfig<Contact> = {
  searchFields: (c) => [c.firstName, c.lastName, c.email, c.phone, c.title, companyById.get(c.companyId ?? '')?.name],
  sortAccessors: {
    name: (c) => `${c.firstName} ${c.lastName}`,
    email: (c) => c.email,
    lifecycleStage: (c) => c.lifecycleStage,
    company: (c) => companyById.get(c.companyId ?? '')?.name,
    owner: (c) => teamById.get(c.ownerId)?.name,
    createdAt: (c) => c.createdAt,
    lastActivityAt: (c) => c.lastActivityAt,
  },
  filterMatchers: {
    lifecycleStage: eqField<Contact>((c) => c.lifecycleStage),
    ownerId: eqField<Contact>((c) => c.ownerId),
    sourceId: eqField<Contact>((c) => c.sourceId),
    companyId: eqField<Contact>((c) => c.companyId ?? ''),
    tagIds: overlapsIds<Contact>((c) => c.tagIds),
    range: dateRange<Contact>((c) => c.createdAt),
  },
  defaultSort: { field: 'lastActivityAt', dir: 'desc' },
};

const companyConfig: QueryConfig<Company> = {
  searchFields: (c) => [c.name, c.domain, c.city, c.industry],
  sortAccessors: {
    name: (c) => c.name,
    industry: (c) => c.industry,
    size: (c) => c.size,
    city: (c) => c.city,
    contactCount: (c) => c.contactCount,
    openDealValue: (c) => c.openDealValue,
    owner: (c) => teamById.get(c.ownerId)?.name,
    createdAt: (c) => c.createdAt,
  },
  filterMatchers: {
    industry: eqField<Company>((c) => c.industry),
    size: eqField<Company>((c) => c.size),
    country: eqField<Company>((c) => c.country),
    ownerId: eqField<Company>((c) => c.ownerId),
    tagIds: overlapsIds<Company>((c) => c.tagIds),
    range: dateRange<Company>((c) => c.createdAt),
  },
  defaultSort: { field: 'createdAt', dir: 'desc' },
};

const submissionConfig: QueryConfig<FormSubmission> = {
  searchFields: (s) => [s.fields.name, s.fields.email, s.fields.company, s.fields.message, s.formName],
  sortAccessors: {
    name: (s) => s.fields.name,
    formName: (s) => s.formName,
    status: (s) => s.status,
    ipCountry: (s) => s.ipCountry,
    source: (s) => s.utm.source,
    submittedAt: (s) => s.submittedAt,
  },
  filterMatchers: {
    formName: eqField<FormSubmission>((s) => s.formName),
    status: eqField<FormSubmission>((s) => s.status),
    ipCountry: eqField<FormSubmission>((s) => s.ipCountry),
    source: eqField<FormSubmission>((s) => s.utm.source ?? ''),
    range: dateRange<FormSubmission>((s) => s.submittedAt),
  },
  defaultSort: { field: 'submittedAt', dir: 'desc' },
};

const dealConfig: QueryConfig<Deal> = {
  searchFields: (d) => [d.title, companyById.get(d.companyId ?? '')?.name],
  sortAccessors: {
    title: (d) => d.title,
    value: (d) => d.value,
    stage: (d) => MOCK_DB.pipeline.find((s) => s.id === d.stageId)?.order ?? 0,
    owner: (d) => teamById.get(d.ownerId)?.name,
    expectedCloseAt: (d) => d.expectedCloseAt,
    createdAt: (d) => d.createdAt,
  },
  filterMatchers: {
    stageId: eqField<Deal>((d) => d.stageId),
    ownerId: eqField<Deal>((d) => d.ownerId),
    sourceId: eqField<Deal>((d) => d.sourceId),
    companyId: eqField<Deal>((d) => d.companyId ?? ''),
    tagIds: overlapsIds<Deal>((d) => d.tagIds),
    value: numberRange<Deal>((d) => d.value),
    range: dateRange<Deal>((d) => d.expectedCloseAt),
  },
  defaultSort: { field: 'createdAt', dir: 'desc' },
};

const noteConfig: QueryConfig<Note> = {
  searchFields: (n) => [n.body, n.related.label],
  sortAccessors: {
    createdAt: (n) => n.createdAt,
    author: (n) => teamById.get(n.authorId)?.name,
    related: (n) => n.related.label,
    pinned: (n) => (n.pinned ? 1 : 0),
  },
  filterMatchers: {
    authorId: eqField<Note>((n) => n.authorId),
    kind: eqField<Note>((n) => n.related.kind),
    relatedId: eqField<Note>((n) => n.related.id),
    pinned: (n, v) => String(n.pinned) === String(v),
    range: dateRange<Note>((n) => n.createdAt),
  },
  defaultSort: { field: 'createdAt', dir: 'desc' },
};

const taskConfig: QueryConfig<Task> = {
  searchFields: (t) => [t.title, t.notes, t.related?.label],
  sortAccessors: {
    title: (t) => t.title,
    status: (t) => t.status,
    priority: (t) => ({ low: 0, medium: 1, high: 2 })[t.priority],
    kind: (t) => t.kind,
    assignee: (t) => teamById.get(t.assigneeId)?.name,
    dueAt: (t) => t.dueAt,
    createdAt: (t) => t.createdAt,
  },
  filterMatchers: {
    status: eqField<Task>((t) => t.status),
    priority: eqField<Task>((t) => t.priority),
    kind: eqField<Task>((t) => t.kind),
    assigneeId: eqField<Task>((t) => t.assigneeId),
    relatedId: eqField<Task>((t) => t.related?.id ?? ''),
    due: dueMatcher<Task>((t) => t.dueAt, (t) => t.status === 'done'),
    range: dateRange<Task>((t) => t.dueAt),
  },
  defaultSort: { field: 'dueAt', dir: 'asc' },
};

const followUpConfig: QueryConfig<FollowUp> = {
  searchFields: (f) => [f.related.label, f.note, f.channel],
  sortAccessors: {
    related: (f) => f.related.label,
    channel: (f) => f.channel,
    status: (f) => f.status,
    owner: (f) => teamById.get(f.ownerId)?.name,
    dueAt: (f) => f.dueAt,
  },
  filterMatchers: {
    status: eqField<FollowUp>((f) => f.status),
    channel: eqField<FollowUp>((f) => f.channel),
    ownerId: eqField<FollowUp>((f) => f.ownerId),
    kind: eqField<FollowUp>((f) => f.related.kind),
    relatedId: eqField<FollowUp>((f) => f.related.id),
    due: dueMatcher<FollowUp>((f) => f.dueAt, (f) => f.status === 'done'),
    range: dateRange<FollowUp>((f) => f.dueAt),
  },
  defaultSort: { field: 'dueAt', dir: 'asc' },
};

const tagConfig: QueryConfig<Tag> = {
  searchFields: (t) => [t.label, t.description],
  sortAccessors: {
    label: (t) => t.label,
    color: (t) => t.color,
    createdAt: (t) => t.createdAt,
  },
  filterMatchers: {
    color: eqField<Tag>((t) => t.color),
  },
  defaultSort: { field: 'label', dir: 'asc' },
};

const sourceConfig: QueryConfig<LeadSource> = {
  searchFields: (s) => [s.name, s.description],
  sortAccessors: {
    name: (s) => s.name,
    category: (s) => s.category,
    isActive: (s) => (s.isActive ? 1 : 0),
    createdAt: (s) => s.createdAt,
  },
  filterMatchers: {
    category: eqField<LeadSource>((s) => s.category),
    isActive: (s, v) => String(s.isActive) === String(v),
  },
  defaultSort: { field: 'name', dir: 'asc' },
};

const teamConfig: QueryConfig<TeamMember> = {
  searchFields: (m) => [m.name, m.email, m.title],
  sortAccessors: { name: (m) => m.name, role: (m) => m.role },
  filterMatchers: { role: eqField<TeamMember>((m) => m.role) },
  defaultSort: { field: 'name', dir: 'asc' },
};

const touchConfig: QueryConfig<AttributionTouch> = {
  searchFields: (t) => [t.entity.label, t.source, t.medium, t.campaign, t.term, t.content],
  sortAccessors: {
    entity: (t) => t.entity.label,
    source: (t) => t.source,
    medium: (t) => t.medium,
    campaign: (t) => t.campaign,
    value: (t) => t.value,
    occurredAt: (t) => t.occurredAt,
  },
  filterMatchers: {
    source: eqField<AttributionTouch>((t) => t.source),
    medium: eqField<AttributionTouch>((t) => t.medium),
    campaign: eqField<AttributionTouch>((t) => t.campaign),
    kind: eqField<AttributionTouch>((t) => t.entity.kind),
    range: dateRange<AttributionTouch>((t) => t.occurredAt),
  },
  defaultSort: { field: 'occurredAt', dir: 'desc' },
};

// ── The factory ────────────────────────────────────────────────────────────

export function createMockServices(): AdminServices {
  const auth = createMockAuthService();
  const guard = makeGuard(auth);
  const touchesTable = buildAttributionTouches();

  return {
    auth,
    analytics: createMockAnalyticsService(guard),
    pipeline: MOCK_DB.pipeline,

    leads: createMockResourceService<Lead>({
      key: 'leads', table: MOCK_DB.leads, idOf: (l) => l.id, config: leadConfig, guard,
      buildCreate: (i) => ({
        id: genId('ld'), name: i.name ?? 'Untitled lead', email: i.email ?? '', phone: i.phone,
        companyName: i.companyName, status: i.status ?? 'new', score: i.score ?? 0,
        ownerId: i.ownerId ?? MOCK_DB.team[0].id, sourceId: i.sourceId ?? MOCK_DB.sources[0].id,
        tagIds: i.tagIds ?? [], estimatedValue: i.estimatedValue ?? 0,
        attribution: i.attribution ?? { utm: {}, capturedAt: nowIso() },
        followUpAt: i.followUpAt ?? null, convertedContactId: null, convertedDealId: null,
        createdAt: nowIso(), lastActivityAt: nowIso(),
      }),
    }),

    contacts: createMockResourceService<Contact>({
      key: 'contacts', table: MOCK_DB.contacts, idOf: (c) => c.id, config: contactConfig, guard,
      buildCreate: (i) => ({
        id: genId('ct'), firstName: i.firstName ?? 'New', lastName: i.lastName ?? 'Contact',
        email: i.email ?? '', phone: i.phone, title: i.title, companyId: i.companyId,
        lifecycleStage: i.lifecycleStage ?? 'lead', ownerId: i.ownerId ?? MOCK_DB.team[0].id,
        sourceId: i.sourceId ?? MOCK_DB.sources[0].id, tagIds: i.tagIds ?? [],
        city: i.city, country: i.country, avatarColor: i.avatarColor ?? '#E85D2A',
        createdAt: nowIso(), lastActivityAt: nowIso(),
      }),
    }),

    companies: createMockResourceService<Company>({
      key: 'companies', table: MOCK_DB.companies, idOf: (c) => c.id, config: companyConfig, guard,
      buildCreate: (i) => ({
        id: genId('co'), name: i.name ?? 'New company', domain: i.domain ?? 'example.ch',
        website: i.website ?? 'https://example.ch', industry: i.industry ?? 'Other', size: i.size ?? '1-10',
        city: i.city ?? 'Zürich', country: i.country ?? 'CH', ownerId: i.ownerId ?? MOCK_DB.team[0].id,
        tagIds: i.tagIds ?? [], annualRevenue: i.annualRevenue, contactCount: 0, openDealValue: 0,
        createdAt: nowIso(), updatedAt: nowIso(),
      }),
    }),

    submissions: createMockResourceService<FormSubmission>({
      key: 'submissions', table: MOCK_DB.submissions, idOf: (s) => s.id, config: submissionConfig, guard,
    }),

    deals: createMockResourceService<Deal>({
      key: 'deals', table: MOCK_DB.deals, idOf: (d) => d.id, config: dealConfig, guard,
      buildCreate: (i) => ({
        id: genId('dl'), title: i.title ?? 'New deal', value: i.value ?? 0, currency: 'CHF',
        stageId: i.stageId ?? 'new', ownerId: i.ownerId ?? MOCK_DB.team[0].id, companyId: i.companyId,
        contactId: i.contactId, leadId: i.leadId, sourceId: i.sourceId ?? MOCK_DB.sources[0].id,
        tagIds: i.tagIds ?? [], expectedCloseAt: i.expectedCloseAt ?? nowIso(),
        createdAt: nowIso(), updatedAt: nowIso(), closedAt: null,
      }),
    }),

    notes: createMockResourceService<Note>({
      key: 'notes', table: MOCK_DB.notes, idOf: (n) => n.id, config: noteConfig, guard,
      buildCreate: (i) => ({
        id: genId('nt'), body: i.body ?? '', authorId: i.authorId ?? MOCK_DB.team[0].id,
        pinned: i.pinned ?? false,
        related: i.related ?? { kind: 'lead', id: MOCK_DB.leads[0].id, label: MOCK_DB.leads[0].name },
        createdAt: nowIso(), updatedAt: nowIso(),
      }),
    }),

    tasks: createMockResourceService<Task>({
      key: 'tasks', table: MOCK_DB.tasks, idOf: (t) => t.id, config: taskConfig, guard,
      buildCreate: (i) => ({
        id: genId('tk'), title: i.title ?? 'New task', notes: i.notes, kind: i.kind ?? 'todo',
        status: i.status ?? 'open', priority: i.priority ?? 'medium',
        assigneeId: i.assigneeId ?? MOCK_DB.team[0].id, related: i.related ?? null,
        dueAt: i.dueAt ?? nowIso(), createdAt: nowIso(), completedAt: null,
      }),
    }),

    followUps: createMockResourceService<FollowUp>({
      key: 'followUps', table: MOCK_DB.followUps, idOf: (f) => f.id, config: followUpConfig, guard,
      buildCreate: (i) => ({
        id: genId('fu'),
        related: i.related ?? { kind: 'lead', id: MOCK_DB.leads[0].id, label: MOCK_DB.leads[0].name },
        channel: i.channel ?? 'call', dueAt: i.dueAt ?? nowIso(), note: i.note,
        ownerId: i.ownerId ?? MOCK_DB.team[0].id, status: i.status ?? 'scheduled',
        createdAt: nowIso(), completedAt: null,
      }),
    }),

    tags: createMockResourceService<Tag>({
      key: 'tags', table: MOCK_DB.tags, idOf: (t) => t.id, config: tagConfig, guard,
      buildCreate: (i) => ({
        id: genId('tag'), label: i.label ?? 'New tag', color: i.color ?? 'slate',
        description: i.description, appliesTo: i.appliesTo ?? ['lead', 'contact'], createdAt: nowIso(),
      }),
    }),

    sources: createMockResourceService<LeadSource>({
      key: 'sources', table: MOCK_DB.sources, idOf: (s) => s.id, config: sourceConfig, guard,
      buildCreate: (i) => ({
        id: genId('src'), name: i.name ?? 'New source', category: i.category ?? 'other',
        description: i.description, isActive: i.isActive ?? true, createdAt: nowIso(),
      }),
    }),

    team: createMockResourceService<TeamMember>({
      key: 'team', table: MOCK_DB.team, idOf: (m) => m.id, config: teamConfig, guard,
    }),

    touches: createMockResourceService<AttributionTouch>({
      key: 'touches', table: touchesTable, idOf: (t) => t.id, config: touchConfig, guard,
    }),
  };
}

/** The default services used by the running app. */
export const services: AdminServices = createMockServices();

export * from './types';
export { demoState } from './demoState';
export { DEMO_PASSWORD } from './authService';
export { buildAttributionTouches } from './analytics';
