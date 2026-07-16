// Mock authentication. This is a private, front-end-only tool: there is no
// real backend and no real credential check. Sessions live in localStorage and
// carry an expiry so the "session expired" state is exercisable, plus a
// role-switch affordance so "access denied" is exercisable.

import { MOCK_DB } from '../mock';
import { AdminServiceError } from '../types';
import type { AdminSession, AdminRole, TeamMember } from '../types';
import type { AuthService, Credentials } from './types';

const STORAGE_KEY = 'fylos.admin.session';
const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours
/** Shared demo password, shown on the sign-in screen. Not a real secret. */
export const DEMO_PASSWORD = 'fylos';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readStored(): AdminSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

function writeStored(session: AdminSession | null): void {
  try {
    if (session) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage unavailable (private mode); session stays in memory only
  }
}

function makeToken(): string {
  return `mock.${Date.now().toString(36)}.${Math.random().toString(36).slice(2, 10)}`;
}

export function createMockAuthService(): AuthService {
  let session: AdminSession | null = readStored();
  const listeners = new Set<() => void>();

  const emit = (): void => listeners.forEach((l) => l());

  const persist = (next: AdminSession | null): void => {
    session = next;
    writeStored(next);
    emit();
  };

  return {
    async signIn({ email, password }: Credentials): Promise<AdminSession> {
      await new Promise((r) => setTimeout(r, 420));
      const fields: Record<string, string> = {};
      const cleanEmail = email.trim().toLowerCase();
      if (!EMAIL_RE.test(cleanEmail)) fields.email = 'Enter a valid email address.';
      if (password.length < 4) fields.password = 'Enter your password.';
      if (Object.keys(fields).length > 0) {
        throw new AdminServiceError('validation', 'Please check the highlighted fields.', fields);
      }
      const member = MOCK_DB.team.find((m) => m.email.toLowerCase() === cleanEmail);
      if (!member) {
        throw new AdminServiceError('validation', 'We could not find an account for that email.', {
          email: 'No account matches that email.',
        });
      }
      const now = Date.now();
      const next: AdminSession = {
        user: { ...member },
        token: makeToken(),
        issuedAt: new Date(now).toISOString(),
        expiresAt: new Date(now + DEFAULT_TTL_MS).toISOString(),
      };
      persist(next);
      return next;
    },

    async signOut(): Promise<void> {
      persist(null);
    },

    getSession(): AdminSession | null {
      return session;
    },

    isExpired(): boolean {
      if (!session) return false;
      return Date.now() >= Date.parse(session.expiresAt);
    },

    expireNow(): void {
      if (!session) return;
      persist({ ...session, expiresAt: new Date(Date.now() - 1000).toISOString() });
    },

    setRole(role: AdminRole): void {
      if (!session) return;
      const user: TeamMember = { ...session.user, role };
      persist({ ...session, user });
    },

    async refresh(): Promise<AdminSession> {
      if (!session) throw new AdminServiceError('session_expired', 'Your session has ended.');
      const next: AdminSession = {
        ...session,
        token: makeToken(),
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + DEFAULT_TTL_MS).toISOString(),
      };
      persist(next);
      return next;
    },

    subscribe(listener: () => void): () => void {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}
