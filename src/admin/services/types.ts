// The service contracts the UI depends on. The whole admin talks to these
// interfaces, never to the mock store directly, so a real HTTP backend can be
// dropped in later by providing a different implementation of AdminServices.

import type { ID, ListResult, ResourceQuery } from '../types';
import type {
  Lead, Contact, Company, FormSubmission, Deal, Note, Task, FollowUp, Tag,
  LeadSource, TeamMember, PipelineStage, AdminSession,
} from '../types';
import type { AttributionTouch, AttributionReport, DashboardSummary } from './analytics-types';

export interface ResourceService<T> {
  /** Stable key, used by the demo-state injector and for logging. */
  readonly key: string;
  list(query: ResourceQuery): Promise<ListResult<T>>;
  get(id: ID): Promise<T | null>;
  create(input: Partial<T>): Promise<T>;
  update(id: ID, patch: Partial<T>): Promise<T>;
  remove(id: ID): Promise<void>;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface AuthService {
  signIn(creds: Credentials): Promise<AdminSession>;
  signOut(): Promise<void>;
  getSession(): AdminSession | null;
  isExpired(): boolean;
  /** Demo-only: force the current session to be expired immediately. */
  expireNow(): void;
  /** Demo-only: switch the signed-in user's role to exercise access control. */
  setRole(role: TeamMember['role']): void;
  refresh(): Promise<AdminSession>;
  subscribe(listener: () => void): () => void;
}

export interface AnalyticsService {
  dashboard(): Promise<DashboardSummary>;
  attribution(query: ResourceQuery): Promise<AttributionReport>;
}

export interface AdminServices {
  auth: AuthService;
  analytics: AnalyticsService;
  leads: ResourceService<Lead>;
  contacts: ResourceService<Contact>;
  companies: ResourceService<Company>;
  submissions: ResourceService<FormSubmission>;
  deals: ResourceService<Deal>;
  notes: ResourceService<Note>;
  tasks: ResourceService<Task>;
  followUps: ResourceService<FollowUp>;
  tags: ResourceService<Tag>;
  sources: ResourceService<LeadSource>;
  team: ResourceService<TeamMember>;
  touches: ResourceService<AttributionTouch>;
  pipeline: PipelineStage[];
}
