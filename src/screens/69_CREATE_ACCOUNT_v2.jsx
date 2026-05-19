import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthShell, { AuthInput, AuthCta, AuthSsoRow, TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   69_CREATE_ACCOUNT_v2.jsx
   Two-step manual signup. Designed to feel as light as Apple / Google
   sign-in for the user — just the essentials, then we drop them in the
   app and finish the profile from there.

   Step 1: First name + SSO (so they can bail to Apple/Google here).
   Step 2: Email + password ×2 (the equivalent of what SSO providers
           already hand us).

   After step 2 → /verify-email → /add-pet (the existing flow).
   ────────────────────────────────────────────────────────────────────── */

const STEP_COUNT = 2;

function StepDots({ step }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
        height: 8,
      }}
    >
      {Array.from({ length: STEP_COUNT }).map((_, i) => {
        const active = i === step - 1;
        return (
          <div
            key={i}
            style={{
              width: active ? 6 : 14,
              height: active ? 6 : 2,
              borderRadius: active ? '50%' : 1,
              background: active ? TAuth.coral : 'rgba(60,30,15,0.22)',
              transition: 'all 320ms cubic-bezier(0.34, 1.4, 0.64, 1)',
            }}
          />
        );
      })}
    </div>
  );
}

export default function CreateAccountV2() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirm: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = {
    name: form.name.trim().length < 2 ? 'Two letters at least.' : '',
    email: !/\S+@\S+\.\S+/.test(form.email) ? 'That looks off. Try again?' : '',
    password: form.password.length < 6 ? 'Six characters minimum.' : '',
    confirm:
      form.confirm.length > 0 && form.confirm !== form.password
        ? "Passwords don't match yet."
        : '',
  };

  const step1Valid = !errors.name;
  const step2Valid =
    !errors.email && !errors.password && !errors.confirm && form.confirm.length > 0;

  const onField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (touched[field]) setTouched({ ...touched, [field]: false });
  };

  const nextStep = () => {
    setTouched({ ...touched, name: true });
    if (!step1Valid) return;
    setStep(2);
  };

  const submit = () => {
    setTouched({ name: true, email: true, password: true, confirm: true });
    if (!step1Valid || !step2Valid) return;
    setLoading(true);
    // Placeholder. Panagiotis wires real signup.
    setTimeout(() => {
      setLoading(false);
      navigate('/verify-email', { state: { email: form.email } });
    }, 700);
  };

  /* ─────────────  Step 1 — name + SSO  ─────────────────────────────── */
  if (step === 1) {
    return (
      <AuthShell
        showHelp
        helpTopics={[
          {
            q: 'Why just your name?',
            a: "We keep it light up front. Email and password are next. Everything else (pet info, address) waits until you're inside.",
          },
          {
            q: 'Can I sign up with Apple or Google instead?',
            a: "Yes. Tap one of the buttons below and skip the typing entirely.",
          },
        ]}
        title="Hi, friend."
        subtitle="Let's start with your name."
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
            onApple={() => alert('Apple sign-in coming soon.')}
            onGoogle={() => alert('Google sign-in coming soon.')}
          />
        }
      >
        <StepDots step={1} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AuthInput
            icon={<User size={17} strokeWidth={2.2} />}
            autoComplete="given-name"
            placeholder="Name"
            autoFocus
            value={form.name}
            onChange={onField('name')}
            error={touched.name ? errors.name : ''}
          />

          <div style={{ marginTop: 6 }}>
            <AuthCta
              onClick={nextStep}
              disabled={!step1Valid && touched.name}
            >
              Continue
              <ArrowRight size={17} strokeWidth={2.4} />
            </AuthCta>
          </div>
        </div>
      </AuthShell>
    );
  }

  /* ─────────────  Step 2 — email + password ×2  ─────────────────── */
  return (
    <AuthShell
      onBack={() => setStep(1)}
      showHelp
      helpTopics={[
        {
          q: 'Why do you need a password?',
          a: "Apple and Google handle this for you on their side. When you sign up manually, your password is what proves it's you next time.",
        },
        {
          q: 'What counts as strong?',
          a: "Six characters minimum. A mix of letters and numbers makes it easier to remember and harder to guess.",
        },
        {
          q: 'Why type it twice?',
          a: "Catches typos before they become a reset email later.",
        },
      ]}
      title="Almost there."
      subtitle="Email and a password. That's it."
      footer={
        <span>
          Changed your mind?{' '}
          <span
            onClick={() => navigate('/sign-in')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Sign in
          </span>
        </span>
      }
    >
      <StepDots step={2} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AuthInput
          icon={<Mail size={17} strokeWidth={2.2} />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          autoFocus
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
        <AuthInput
          icon={<Lock size={17} strokeWidth={2.2} />}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Confirm password"
          value={form.confirm}
          onChange={onField('confirm')}
          error={touched.confirm ? errors.confirm : ''}
        />

        <div style={{ marginTop: 6 }}>
          <AuthCta
            onClick={submit}
            disabled={
              !step2Valid &&
              (touched.email || touched.password || touched.confirm)
            }
            loading={loading}
          >
            Create account
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
