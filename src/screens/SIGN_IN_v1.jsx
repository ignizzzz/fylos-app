import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowRight, Check } from 'lucide-react';
import AuthShell, { AuthInput, AuthCta, TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   SIGN_IN_v1.jsx
   Magic-link first sign-in. Single email field → "Send me a link".
   On submit, swaps to a "Check your inbox" confirmation in the same
   shell so the transition feels calm, not a route hop.
   ────────────────────────────────────────────────────────────────────── */

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const valid = /\S+@\S+\.\S+/.test(email);

  const submit = () => {
    if (!valid) return;
    // Placeholder — Panagiotis wires this to Supabase / Resend.
    setSent(true);
  };

  if (sent) {
    return (
      <AuthShell
        onBack={() => setSent(false)}
        heroSrc="/onboarding/philos.png"
        heroAlt="φίλος watercolor"
        heroHeight={210}
        tagline="A calmer way to care."
        eyebrow="Almost in"
        title="Check your inbox"
        subtitle={`We sent a sign-in link to ${email}. Tap it and you're back with Luna.`}
        footer={
          <span>
            Didn't get it?{' '}
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
          Link on its way
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      onBack={() => navigate(-1)}
      heroSrc="/onboarding/philos.png"
      heroAlt="φίλος watercolor"
      heroHeight={220}
      tagline="A calmer way to care."
      eyebrow="Welcome back"
      title="Sign in to Fylos"
      subtitle="Type your email and we'll send a one-tap link. No passwords to remember."
      footer={
        <span>
          New to Fylos?{' '}
          <span
            onClick={() => navigate('/create-account')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Create account
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
          placeholder="you@somewhere.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <AuthCta onClick={submit} disabled={!valid}>
          Send me a link
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
          Use a password instead
        </button>
      </div>
    </AuthShell>
  );
}
