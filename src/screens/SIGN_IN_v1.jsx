import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Check } from 'lucide-react';
import AuthShell, { AuthInput, AuthCta, AuthSsoRow, TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   SIGN_IN_v1.jsx
   Magic-link first sign-in. Single email field → "Send me a link".
   On submit, swaps to a "Check your inbox" confirmation in the same
   shell so the transition feels calm, not a route hop.
   ────────────────────────────────────────────────────────────────────── */

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const valid = /\S+@\S+\.\S+/.test(email);
  const error = touched && !valid ? 'That looks off. Try again?' : '';

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    setLoading(true);
    // Placeholder — Panagiotis wires this to Supabase / Resend.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  if (sent) {
    return (
      <AuthShell
        onBack={() => setSent(false)}
        tagline="A calmer way to care."
        title="Link sent."
        subtitle={`Tap the link we just sent to ${email} and you're in.`}
        footer={
          <span>
            Didn't land?{' '}
            <span
              onClick={submit}
              style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
            >
              Resend
            </span>
          </span>
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '14px 16px',
            background: TAuth.coralSoft,
            borderRadius: 14,
            color: TAuth.coralDark,
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          <Check size={16} strokeWidth={2.6} />
          On its way.
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      onBack={() => navigate(-1)}
      tagline="A calmer way to care."
      title="Welcome back."
      subtitle="Drop your email. We'll send a one-tap link."
      footer={
        <span>
          First time here?{' '}
          <span
            onClick={() => navigate('/create-account')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Create account
          </span>
        </span>
      }
      secondaryActions={
        <AuthSsoRow
          onApple={() => alert('Apple SSO — wire me up')}
          onGoogle={() => alert('Google SSO — wire me up')}
        />
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AuthInput
          icon={<Mail size={17} strokeWidth={2.2} />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (touched) setTouched(false);
          }}
          error={error}
        />

        <AuthCta onClick={submit} disabled={!valid && touched} loading={loading}>
          Ping me a link
          <ArrowRight size={17} strokeWidth={2.4} />
        </AuthCta>

        <button
          onClick={() => navigate('/sign-in-password')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12.5,
            color: TAuth.textTertiary,
            padding: '4px 8px',
            margin: '2px auto 0',
            fontFamily: 'inherit',
          }}
        >
          Prefer a password?
        </button>
      </div>
    </AuthShell>
  );
}
