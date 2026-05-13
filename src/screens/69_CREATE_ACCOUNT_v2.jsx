import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthShell, { AuthInput, AuthCta, AuthSsoRow, TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   69_CREATE_ACCOUNT_v2.jsx
   Refresh of the original create-account screen. Shares AuthShell with
   the new sign-in, so onboarding → create flows in one consistent
   visual language (cream canvas, watercolor hero, coral pill CTA).
   ────────────────────────────────────────────────────────────────────── */

export default function CreateAccountV2() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = {
    name: form.name.trim().length < 2 ? 'Need at least two letters.' : '',
    email: !/\S+@\S+\.\S+/.test(form.email) ? 'That looks off. Try again?' : '',
    password: form.password.length < 6 ? 'Six characters minimum.' : '',
  };
  const valid = !errors.name && !errors.email && !errors.password;

  const submit = () => {
    setTouched({ name: true, email: true, password: true });
    if (!valid) return;
    setLoading(true);
    // Placeholder — Panagiotis wires real signup.
    setTimeout(() => {
      setLoading(false);
      navigate('/verify-email', { state: { email: form.email } });
    }, 700);
  };

  const onField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (touched[field]) setTouched({ ...touched, [field]: false });
  };

  return (
    <AuthShell
      onBack={() => navigate(-1)}
      tagline="A calmer way to care."
      title="Hi, friend."
      subtitle="Three quick things and you're set."
      footer={
        <span>
          Already with us?{' '}
          <span
            onClick={() => navigate('/sign-in')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Sign in
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AuthInput
          icon={<User size={17} strokeWidth={2.2} />}
          autoComplete="name"
          placeholder="Name"
          value={form.name}
          onChange={onField('name')}
          error={touched.name ? errors.name : ''}
        />
        <AuthInput
          icon={<Mail size={17} strokeWidth={2.2} />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          value={form.email}
          onChange={onField('email')}
          error={touched.email ? errors.email : ''}
        />
        <AuthInput
          icon={<Lock size={17} strokeWidth={2.2} />}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Password"
          value={form.password}
          onChange={onField('password')}
          error={touched.password ? errors.password : ''}
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
          <AuthCta
            onClick={submit}
            disabled={!valid && (touched.name || touched.email || touched.password)}
            loading={loading}
          >
            Let's go
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
          By tapping above, you're cool with our{' '}
          <span style={{ color: TAuth.coral, fontWeight: 600 }}>Terms</span> &{' '}
          <span style={{ color: TAuth.coral, fontWeight: 600 }}>Privacy</span>.
        </p>
      </div>
    </AuthShell>
  );
}
