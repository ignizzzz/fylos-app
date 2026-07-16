// ─────────────────────────────────────────────────────────────────────────
// Growth Admin · shared/common types
// Query, pagination, async-state, error, and access-control primitives that
// every resource and hook builds on. No React here, no data here.
// ─────────────────────────────────────────────────────────────────────────

export type ID = string;

/** ISO-8601 timestamp, e.g. "2026-07-15T09:30:00.000Z". */
export type ISODateString = string;

export type SortDir = 'asc' | 'desc';

export interface SortSpec {
  field: string;
  dir: SortDir;
}

/** A single value a list can be filtered by. */
export type FilterValue =
  | string
  | number
  | boolean
  | string[]
  | { from?: string | null; to?: string | null }
  | null
  | undefined;

export type FilterMap = Record<string, FilterValue>;

/** The full request shape a list view sends to a resource service. */
export interface ResourceQuery<F extends FilterMap = FilterMap> {
  search?: string;
  filters?: F;
  sort?: SortSpec | null;
  page: number;
  pageSize: number;
}

export interface ListResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

// ── Async state machine (drives loading / empty / error / data views) ──────

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: AdminError };

// ── Error model ────────────────────────────────────────────────────────────

export type AdminErrorCode =
  | 'network'
  | 'server'
  | 'forbidden'
  | 'session_expired'
  | 'not_found'
  | 'validation'
  | 'unknown';

export interface AdminError {
  code: AdminErrorCode;
  message: string;
  /** Optional field-level messages for validation errors. */
  fields?: Record<string, string>;
}

/** Thrown by services; carries a machine-readable code the UI can branch on. */
export class AdminServiceError extends Error implements AdminError {
  code: AdminErrorCode;
  fields?: Record<string, string>;
  constructor(code: AdminErrorCode, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'AdminServiceError';
    this.code = code;
    if (fields) this.fields = fields;
  }
}

export function toAdminError(err: unknown): AdminError {
  if (err instanceof AdminServiceError) {
    return { code: err.code, message: err.message, ...(err.fields ? { fields: err.fields } : {}) };
  }
  if (err instanceof Error) return { code: 'unknown', message: err.message };
  return { code: 'unknown', message: 'Something went wrong.' };
}

// ── Access control ─────────────────────────────────────────────────────────

export type AdminRole = 'owner' | 'admin' | 'manager' | 'viewer';

export const ROLE_RANK: Record<AdminRole, number> = {
  viewer: 1,
  manager: 2,
  admin: 3,
  owner: 4,
};

export const ROLE_LABEL: Record<AdminRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  manager: 'Manager',
  viewer: 'Viewer',
};

/** True when `role` meets or exceeds `required`. */
export function roleAllows(role: AdminRole, required: AdminRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[required];
}

// ── Demo state injection (makes every async state reachable on purpose) ─────

export type DemoStateMode = 'normal' | 'loading' | 'empty' | 'error';
