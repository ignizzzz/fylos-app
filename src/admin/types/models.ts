// ─────────────────────────────────────────────────────────────────────────
// Growth Admin · domain model
// A small but coherent CRM: people (contacts, leads), organisations
// (companies), the money (deals in a pipeline), the inbound (form
// submissions), the work (tasks, follow-ups, notes), and the taxonomy
// (tags, lead sources, UTM attribution).
// ─────────────────────────────────────────────────────────────────────────

import type { ID, ISODateString } from './common';
import type { AdminRole } from './common';

// ── Cross-entity references ────────────────────────────────────────────────

export type EntityKind = 'lead' | 'contact' | 'company' | 'deal' | 'submission';

export const ENTITY_KIND_LABEL: Record<EntityKind, string> = {
  lead: 'Lead',
  contact: 'Contact',
  company: 'Company',
  deal: 'Deal',
  submission: 'Submission',
};

export interface EntityRef {
  kind: EntityKind;
  id: ID;
  label: string;
}

// ── Team members (owners / assignees) ──────────────────────────────────────

export interface TeamMember {
  id: ID;
  name: string;
  email: string;
  role: AdminRole;
  title: string;
  initials: string;
  avatarColor: string;
  active: boolean;
}

/** Mock auth session. No real tokens: this is a private, front-end-only tool. */
export interface AdminSession {
  user: TeamMember;
  token: string;
  issuedAt: ISODateString;
  expiresAt: ISODateString;
}

// ── Taxonomy: tags ─────────────────────────────────────────────────────────

export type TagColor =
  | 'coral'
  | 'sage'
  | 'amber'
  | 'blue'
  | 'violet'
  | 'slate'
  | 'rose'
  | 'teal';

export interface Tag {
  id: ID;
  label: string;
  color: TagColor;
  description?: string;
  appliesTo: EntityKind[];
  createdAt: ISODateString;
}

// ── Taxonomy: lead sources ─────────────────────────────────────────────────

export type SourceCategory =
  | 'organic'
  | 'paid'
  | 'social'
  | 'referral'
  | 'direct'
  | 'email'
  | 'event'
  | 'other';

export const SOURCE_CATEGORY_LABEL: Record<SourceCategory, string> = {
  organic: 'Organic search',
  paid: 'Paid ads',
  social: 'Social',
  referral: 'Referral',
  direct: 'Direct',
  email: 'Email',
  event: 'Event',
  other: 'Other',
};

export interface LeadSource {
  id: ID;
  name: string;
  category: SourceCategory;
  description?: string;
  isActive: boolean;
  createdAt: ISODateString;
}

// ── UTM attribution ────────────────────────────────────────────────────────

export interface UtmParams {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

/** First-touch attribution snapshot captured when a lead/submission arrives. */
export interface Attribution {
  utm: UtmParams;
  landingPage?: string;
  referrer?: string;
  gclid?: string;
  capturedAt: ISODateString;
}

// ── Companies ──────────────────────────────────────────────────────────────

export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '500+';

export type Industry =
  | 'Veterinary'
  | 'Pet retail'
  | 'Grooming'
  | 'Boarding'
  | 'Insurance'
  | 'SaaS'
  | 'Nonprofit'
  | 'Media'
  | 'Other';

export interface Company {
  id: ID;
  name: string;
  domain: string;
  website: string;
  industry: Industry;
  size: CompanySize;
  city: string;
  country: string;
  ownerId: ID;
  tagIds: ID[];
  annualRevenue?: number;
  contactCount: number;
  openDealValue: number;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ── Contacts (people) ──────────────────────────────────────────────────────

export type LifecycleStage =
  | 'subscriber'
  | 'lead'
  | 'marketing_qualified'
  | 'sales_qualified'
  | 'opportunity'
  | 'customer'
  | 'evangelist';

export const LIFECYCLE_LABEL: Record<LifecycleStage, string> = {
  subscriber: 'Subscriber',
  lead: 'Lead',
  marketing_qualified: 'MQL',
  sales_qualified: 'SQL',
  opportunity: 'Opportunity',
  customer: 'Customer',
  evangelist: 'Evangelist',
};

export interface Contact {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  title?: string;
  companyId?: ID;
  lifecycleStage: LifecycleStage;
  ownerId: ID;
  sourceId: ID;
  tagIds: ID[];
  city?: string;
  country?: string;
  avatarColor: string;
  createdAt: ISODateString;
  lastActivityAt: ISODateString;
}

// ── Leads (inbound interest, convertible to contact + deal) ────────────────

export type LeadStatus = 'new' | 'working' | 'qualified' | 'unqualified' | 'converted';

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: 'New',
  working: 'Working',
  qualified: 'Qualified',
  unqualified: 'Unqualified',
  converted: 'Converted',
};

export interface Lead {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  status: LeadStatus;
  score: number;
  ownerId: ID;
  sourceId: ID;
  tagIds: ID[];
  estimatedValue: number;
  attribution: Attribution;
  followUpAt?: ISODateString | null;
  convertedContactId?: ID | null;
  convertedDealId?: ID | null;
  createdAt: ISODateString;
  lastActivityAt: ISODateString;
}

// ── Sales pipeline (deals) ─────────────────────────────────────────────────

export type PipelineStageId =
  | 'new'
  | 'qualifying'
  | 'demo'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export interface PipelineStage {
  id: PipelineStageId;
  label: string;
  order: number;
  probability: number;
  isClosed: boolean;
  isWon: boolean;
}

export interface Deal {
  id: ID;
  title: string;
  value: number;
  currency: 'CHF';
  stageId: PipelineStageId;
  ownerId: ID;
  companyId?: ID;
  contactId?: ID;
  leadId?: ID;
  sourceId: ID;
  tagIds: ID[];
  expectedCloseAt: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  closedAt?: ISODateString | null;
}

// ── Form submissions (marketing site inbound) ──────────────────────────────

export type SubmissionStatus = 'new' | 'reviewed' | 'spam' | 'converted';

export type FormName =
  | 'Apply (Vet clinic)'
  | 'Join (Pro)'
  | 'Contact'
  | 'Newsletter'
  | 'Waitlist';

export interface SubmissionFields {
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
  city?: string;
  message?: string;
}

export interface FormSubmission {
  id: ID;
  formName: FormName;
  submittedAt: ISODateString;
  fields: SubmissionFields;
  pageUrl: string;
  utm: UtmParams;
  referrer?: string;
  ipCountry: string;
  status: SubmissionStatus;
  linkedLeadId?: ID | null;
}

// ── Notes ──────────────────────────────────────────────────────────────────

export interface Note {
  id: ID;
  body: string;
  authorId: ID;
  pinned: boolean;
  related: EntityRef;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ── Tasks ──────────────────────────────────────────────────────────────────

export type TaskStatus = 'open' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskKind = 'call' | 'email' | 'meeting' | 'todo';

export const TASK_STATUS_LABEL: Record<TaskStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  done: 'Done',
};

export const TASK_PRIORITY_LABEL: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export interface Task {
  id: ID;
  title: string;
  notes?: string;
  kind: TaskKind;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: ID;
  related?: EntityRef | null;
  dueAt: ISODateString;
  createdAt: ISODateString;
  completedAt?: ISODateString | null;
}

// ── Follow-up dates ────────────────────────────────────────────────────────

export type FollowUpChannel = 'call' | 'email' | 'meeting' | 'message';
export type FollowUpStatus = 'scheduled' | 'done' | 'missed';

export interface FollowUp {
  id: ID;
  related: EntityRef;
  channel: FollowUpChannel;
  dueAt: ISODateString;
  note?: string;
  ownerId: ID;
  status: FollowUpStatus;
  createdAt: ISODateString;
  completedAt?: ISODateString | null;
}
