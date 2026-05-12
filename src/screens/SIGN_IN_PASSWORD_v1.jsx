import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthShell, { AuthInput, AuthCta, TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   SIGN_IN_PASSWORD_v1.jsx
   The classic password path, for people who'd rather not wait on a
   magic-link email. Mirrors /sign-in's shell and language so the two
   feel like the same product, not two different vendors stitched in.
   ────────────────────────────────────────────────────────────────────── */

export default function SignInPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const valid =
    /\S+@\S+\.\S+/.test(form.email) && form.password.length >= 6;

  const submit = () => {
    if (!valid) return;
    // Placeholder — Panagiotis wires real auth here.
    navigate('/home');
  };

  return (
    <AuthShell
      onBack={() => navigate('/sign-in')}
      tagline="A calmer way to care."
      title="Welcome back."
      subtitle="Email and password. Old school but it works."
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
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AuthInput
          icon={<Mail size={17} strokeWidth={2.2} />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <AuthInput
          icon={<Lock size={17} strokeWidth={2.2} />}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
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

        {/* Forgot password — small, right-aligned under password */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
          <button
            onClick={() => navigate('/forgot-password')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              color: TAuth.coral,
              fontWeight: 600,
              padding: '4px 4px',
              fontFamily: 'inherit',
            }}
          >
            Forgot it?
          </button>
        </div>

        <div style={{ marginTop: 4 }}>
          <AuthCta onClick={submit} disabled={!valid}>
            Sign in
            <ArrowRight size={17} strokeWidth={2.4} />
          </AuthCta>
        </div>

        <button
          onClick={() => navigate('/sign-in')}
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
          Prefer a link?
        </button>
      </div>
    </AuthShell>
  );
}
