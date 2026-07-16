// Mock sign-in screen. No real auth: any of the team emails plus the shown
// demo password signs you in. Exercises field validation, an error banner,
// and a loading state.

import { useState } from 'react';
import type { FormEvent } from 'react';
import { AlertTriangle } from 'lucide-react';
import { tokens, radii, shadows, toneStyles } from '../../theme';
import { Button, Field, Input, Spinner } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { DEMO_PASSWORD } from '../../services';
import { toAdminError } from '../../types';

const DEMO_EMAIL = 'iakovos@fylos.me';

export function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setFieldErrors({});
    setFormError(null);
    try {
      await signIn({ email, password });
      // On success the app re-renders into the shell automatically.
    } catch (err) {
      const admin = toAdminError(err);
      if (admin.fields) setFieldErrors(admin.fields);
      if (!admin.fields || Object.keys(admin.fields).length === 0) setFormError(admin.message);
      setBusy(false);
    }
  };

  const useDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setFieldErrors({});
    setFormError(null);
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4" style={{ background: tokens.appBg }}>
      <div className="w-full max-w-[400px]">
        <div className="flex items-center gap-2 justify-center mb-6">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-[10px] font-extrabold text-white text-[19px]" style={{ background: tokens.coral }}>F</span>
          <div className="leading-tight">
            <div className="text-[16px] font-bold" style={{ color: tokens.ink }}>Fylos</div>
            <div className="text-[11px] font-semibold tracking-wide" style={{ color: tokens.ink3 }}>GROWTH ADMIN</div>
          </div>
        </div>

        <div className="px-7 py-7" style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: radii.xl, boxShadow: shadows.card }}>
          <h1 className="text-[19px] font-bold mb-1" style={{ color: tokens.ink }}>Sign in</h1>
          <p className="text-[13px] mb-5" style={{ color: tokens.ink2 }}>Private tool for the Fylos growth team.</p>

          {formError && (
            <div className="flex items-start gap-2 mb-4 px-3 py-2.5 rounded-[10px] text-[12.5px]" style={{ background: toneStyles.red.bg, color: toneStyles.red.fg, border: `1px solid ${toneStyles.red.border}` }}>
              <AlertTriangle size={15} className="mt-px shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={submit} noValidate>
            <Field label="Email" htmlFor="admin-email" error={fieldErrors.email} className="mb-3.5">
              <Input
                id="admin-email"
                type="email"
                autoComplete="username"
                placeholder="you@fylos.me"
                value={email}
                invalid={Boolean(fieldErrors.email)}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
            <Field label="Password" htmlFor="admin-password" error={fieldErrors.password} className="mb-5">
              <Input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                value={password}
                invalid={Boolean(fieldErrors.password)}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button type="submit" variant="primary" block disabled={busy}>
              {busy ? <><Spinner size={14} color="#fff" /> Signing in</> : 'Sign in'}
            </Button>
          </form>

          <div className="mt-5 pt-4 text-[12px]" style={{ borderTop: `1px solid ${tokens.divider}`, color: tokens.ink3 }}>
            <div className="flex items-center justify-between gap-2">
              <span>Demo access: <span className="font-semibold" style={{ color: tokens.ink2 }}>{DEMO_EMAIL}</span> / <span className="font-semibold" style={{ color: tokens.ink2 }}>{DEMO_PASSWORD}</span></span>
              <button type="button" onClick={useDemo} className="font-semibold shrink-0" style={{ color: tokens.coral }}>Use</button>
            </div>
          </div>
        </div>

        <p className="text-center text-[11.5px] mt-4" style={{ color: tokens.ink3 }}>
          Mock authentication. No credentials leave your browser.
        </p>
      </div>
    </div>
  );
}
