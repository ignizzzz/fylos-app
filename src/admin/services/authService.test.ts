// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { createMockAuthService, DEMO_PASSWORD } from './authService';
import { MOCK_DB } from '../mock';

const KNOWN_EMAIL = MOCK_DB.team[0].email;

beforeEach(() => {
  window.localStorage.clear();
});

describe('createMockAuthService.signIn', () => {
  it('rejects an invalid email with a field error', async () => {
    const auth = createMockAuthService();
    await expect(auth.signIn({ email: 'not-an-email', password: DEMO_PASSWORD })).rejects.toMatchObject({
      code: 'validation',
      fields: { email: expect.any(String) },
    });
  });

  it('rejects an unknown but well-formed email', async () => {
    const auth = createMockAuthService();
    await expect(auth.signIn({ email: 'nobody@fylos.me', password: DEMO_PASSWORD })).rejects.toMatchObject({ code: 'validation' });
  });

  it('rejects a too-short password on the password field', async () => {
    const auth = createMockAuthService();
    await expect(auth.signIn({ email: KNOWN_EMAIL, password: 'x' })).rejects.toMatchObject({
      fields: { password: expect.any(String) },
    });
  });

  it('signs in a known team member and persists the session', async () => {
    const auth = createMockAuthService();
    const session = await auth.signIn({ email: KNOWN_EMAIL, password: DEMO_PASSWORD });
    expect(session.user.email).toBe(KNOWN_EMAIL);
    expect(auth.getSession()?.token).toBe(session.token);
    expect(window.localStorage.getItem('fylos.admin.session')).toContain(session.token);
    expect(auth.isExpired()).toBe(false);
  });
});

describe('session lifecycle', () => {
  it('expireNow marks the session expired', async () => {
    const auth = createMockAuthService();
    await auth.signIn({ email: KNOWN_EMAIL, password: DEMO_PASSWORD });
    expect(auth.isExpired()).toBe(false);
    auth.expireNow();
    expect(auth.isExpired()).toBe(true);
  });

  it('setRole changes the session role and notifies subscribers', async () => {
    const auth = createMockAuthService();
    await auth.signIn({ email: KNOWN_EMAIL, password: DEMO_PASSWORD });
    let notified = 0;
    const unsub = auth.subscribe(() => { notified += 1; });
    auth.setRole('viewer');
    expect(auth.getSession()?.user.role).toBe('viewer');
    expect(notified).toBeGreaterThan(0);
    unsub();
  });

  it('signOut clears the session and storage', async () => {
    const auth = createMockAuthService();
    await auth.signIn({ email: KNOWN_EMAIL, password: DEMO_PASSWORD });
    await auth.signOut();
    expect(auth.getSession()).toBeNull();
    expect(window.localStorage.getItem('fylos.admin.session')).toBeNull();
  });
});
