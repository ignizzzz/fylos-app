// Auth/session state for the admin. Wraps the AuthService, tracks the current
// session, and derives a status the shell branches on:
//   unauthenticated -> sign-in screen
//   expired         -> session-expired screen
//   authenticated   -> the app
// It also polls expiry so an idle session flips to "expired" on its own.

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useServices } from './ServicesContext';
import { roleAllows } from '../types';
import type { AdminSession, AdminRole } from '../types';
import type { Credentials } from '../services';

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'expired';

interface AuthContextValue {
  session: AdminSession | null;
  status: AuthStatus;
  role: AdminRole | null;
  signIn: (creds: Credentials) => Promise<void>;
  signOut: () => Promise<void>;
  expireNow: () => void;
  setRole: (role: AdminRole) => void;
  can: (required: AdminRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { auth } = useServices();
  const [session, setSession] = useState<AdminSession | null>(() => auth.getSession());
  const [expired, setExpired] = useState<boolean>(() => auth.isExpired());

  useEffect(() => {
    const sync = () => {
      setSession(auth.getSession());
      setExpired(auth.isExpired());
    };
    const unsub = auth.subscribe(sync);
    // Poll so an idle session expires on its own without user action.
    const timer = window.setInterval(sync, 15_000);
    sync();
    return () => {
      unsub();
      window.clearInterval(timer);
    };
  }, [auth]);

  const signIn = useCallback(
    async (creds: Credentials) => {
      await auth.signIn(creds);
    },
    [auth],
  );

  const signOut = useCallback(async () => {
    await auth.signOut();
  }, [auth]);

  const expireNow = useCallback(() => auth.expireNow(), [auth]);
  const setRole = useCallback((role: AdminRole) => auth.setRole(role), [auth]);

  const value = useMemo<AuthContextValue>(() => {
    const status: AuthStatus = !session ? 'unauthenticated' : expired ? 'expired' : 'authenticated';
    const role = session?.user.role ?? null;
    return {
      session,
      status,
      role,
      signIn,
      signOut,
      expireNow,
      setRole,
      can: (required: AdminRole) => (role ? roleAllows(role, required) : false),
    };
  }, [session, expired, signIn, signOut, expireNow, setRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
