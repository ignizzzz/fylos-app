import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Check } from 'lucide-react';
import AuthShell, { AuthInput, AuthCta, TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   FORGOT_PASSWORD_v1.jsx
   Single email field. Submit swaps in place to a "Check your inbox"
   state — same pattern as the magic-link confirmation in /sign-in.
   ────────────────────────────────────────────────────────────────────── */

export default function ForgotPassword() {
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
    // Placeholder — Panagiotis wires reset email.
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
        title="Reset link sent."
        subtitle={`Tap the link we just sent to ${email} to set a new password.`}
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
      onBack={() => navigate('/sign-in-password')}
      tagline="A calmer way to care."
      title="Forgot it? No drama."
      subtitle="Drop your email and we'll send a reset link."
      footer={
        <span>
          Remembered it?{' '}
          <span
            onClick={() => navigate('/sign-in-password')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Sign in
          </span>
        </span>
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
          Send reset link
          <ArrowRight size={17} strokeWidth={2.4} />
        </AuthCta>
      </div>
    </AuthShell>
  );
}
