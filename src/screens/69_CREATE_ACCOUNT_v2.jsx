import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthShell, { AuthInput, AuthCta, TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   69_CREATE_ACCOUNT_v2.jsx
   Refresh of the original create-account screen. Shares AuthShell with
   the new sign-in, so onboarding → create flows in one consistent
   visual language (cream canvas, watercolor hero, coral pill CTA).
   ────────────────────────────────────────────────────────────────────── */

export default function CreateAccountV2() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const valid =
    form.name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.password.length >= 6;

  const submit = () => {
    if (!valid) return;
    navigate('/add-pet');
  };

  return (
    <AuthShell
      onBack={() => navigate(-1)}
      heroSrc="/onboarding/philos.png"
      heroAlt="φίλος watercolor"
      heroHeight={210}
      tagline="A calmer way to care."
      eyebrow="Welcome"
      title="Create your account"
      subtitle="One quick step and Luna is in."
      footer={
        <span>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/sign-in')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Sign in
          </span>
        </span>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AuthInput
          icon={<User size={17} strokeWidth={2.2} />}
          autoComplete="name"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <AuthInput
          icon={<Mail size={17} strokeWidth={2.2} />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@somewhere.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <AuthInput
          icon={<Lock size={17} strokeWidth={2.2} />}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          trailing={
            <button
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                color: TAuth.textTertiary,
                display: 'flex',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <div style={{ marginTop: 6 }}>
          <AuthCta onClick={submit} disabled={!valid}>
            Come in
            <ArrowRight size={17} strokeWidth={2.4} />
          </AuthCta>
        </div>

        <p
          style={{
            fontSize: 11.5,
            color: TAuth.textTertiary,
            textAlign: 'center',
            lineHeight: 1.55,
            margin: '6px auto 0',
            maxWidth: 280,
          }}
        >
          By continuing, you agree to our{' '}
          <span style={{ color: TAuth.coral, fontWeight: 600 }}>Terms</span> &{' '}
          <span style={{ color: TAuth.coral, fontWeight: 600 }}>Privacy Policy</span>.
        </p>
      </div>
    </AuthShell>
  );
}
