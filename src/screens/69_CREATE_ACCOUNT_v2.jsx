import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import AuthShell, {
  AuthInput,
  AuthCta,
  AuthSsoRow,
  AuthDocSheet,
  TAuth,
} from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   69_CREATE_ACCOUNT_v2.jsx
   Two-step manual signup. Designed to feel as light as Apple / Google
   sign-in for the user — just the essentials, then we drop them in the
   app and finish the profile from there.

   Step 1: First name + last name + SSO (so they can bail to a provider).
   Step 2: Email + password ×2 (the equivalent of what SSO already hands
           us).

   After step 2 → /verify-email → /add-pet (existing flow).
   ────────────────────────────────────────────────────────────────────── */

const STEP_COUNT = 2;

const TERMS_SECTIONS = [
  {
    heading: 'Welcome',
    paragraphs: [
      "By using Fylos, you agree to these terms. We've kept them short. Read them when you have a minute.",
    ],
  },
  {
    heading: 'Your account',
    paragraphs: [
      "You're responsible for the email and password (or the Apple/Google account) tied to your Fylos profile. Keep them safe.",
    ],
  },
  {
    heading: 'How you use Fylos',
    paragraphs: [
      "Fylos is for personal pet care. Don't use it for spam, abuse, or to harm others.",
      "If you're a service provider (walker, vet, etc.), there's a separate Pro account for that.",
    ],
  },
  {
    heading: 'Your content',
    paragraphs: [
      "You own everything you add: pet info, photos, notes. We protect it. See our Privacy Policy for the details.",
    ],
  },
  {
    heading: 'Ending your account',
    paragraphs: [
      "You can close your Fylos account anytime from Settings. Your data goes with it.",
    ],
  },
  {
    heading: 'Changes',
    paragraphs: [
      "We may update these terms occasionally. When something changes that affects you, we'll let you know.",
    ],
  },
  {
    heading: 'Questions',
    paragraphs: ['Reach us at hello@fylos.me.'],
  },
];

const PRIVACY_SECTIONS = [
  {
    heading: 'What we collect',
    paragraphs: [
      "Your name, email, and anything you add about your pets: names, health records, photos, notes.",
    ],
  },
  {
    heading: 'How we use it',
    paragraphs: [
      "To make the app work for you and your pets. We don't sell your data.",
    ],
  },
  {
    heading: 'Sharing',
    paragraphs: [
      "We only share what you choose to share. Vet visits with vets, walks with walkers. Nothing leaves Fylos without your tap.",
    ],
  },
  {
    heading: 'Where it lives',
    paragraphs: [
      "Encrypted on EU and US servers, protected by industry standards.",
    ],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      "You can see, edit, or delete your data anytime. Just ask, or do it yourself in Settings.",
    ],
  },
  {
    heading: 'Cookies',
    paragraphs: [
      "We use the bare minimum. Just enough to keep you signed in.",
    ],
  },
  {
    heading: 'Questions',
    paragraphs: ['Reach us at hello@fylos.me.'],
  },
];

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
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirm: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const errors = {
    firstName:
      form.firstName.trim().length < 2 ? 'Two letters at least.' : '',
    lastName:
      form.lastName.trim().length < 2 ? 'Two letters at least.' : '',
    email: !/\S+@\S+\.\S+/.test(form.email) ? 'That looks off. Try again?' : '',
    password: form.password.length < 6 ? 'Six characters minimum.' : '',
    confirm:
      form.confirm.length > 0 && form.confirm !== form.password
        ? "Passwords don't match yet."
        : '',
  };

  const step1Valid = !errors.firstName && !errors.lastName;
  const step2Valid =
    !errors.email &&
    !errors.password &&
    !errors.confirm &&
    form.confirm.length > 0;

  const onField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (touched[field]) setTouched({ ...touched, [field]: false });
  };

  const nextStep = () => {
    setTouched({ ...touched, firstName: true, lastName: true });
    if (!step1Valid) return;
    setStep(2);
  };

  const submit = () => {
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirm: true,
    });
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
            q: 'Why first and last name?',
            a: "It helps us address you properly and keeps things clean on your profile. Everything else (pet info, address) waits until you're inside the app.",
          },
          {
            q: 'Can I sign up with Apple or Google instead?',
            a: 'Yes. Tap one of the buttons below and skip the typing.',
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
            placeholder="First name"
            autoFocus
            value={form.firstName}
            onChange={onField('firstName')}
            error={touched.firstName ? errors.firstName : ''}
          />
          <AuthInput
            icon={<User size={17} strokeWidth={2.2} />}
            autoComplete="family-name"
            placeholder="Last name"
            value={form.lastName}
            onChange={onField('lastName')}
            error={touched.lastName ? errors.lastName : ''}
          />

          <div style={{ marginTop: 6 }}>
            <AuthCta
              onClick={nextStep}
              disabled={
                !step1Valid && (touched.firstName || touched.lastName)
              }
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
      overlays={
        <>
          <AuthDocSheet
            open={termsOpen}
            onClose={() => setTermsOpen(false)}
            title="Terms"
            sections={TERMS_SECTIONS}
            fullVersionUrl="https://fylos.me/terms"
          />
          <AuthDocSheet
            open={privacyOpen}
            onClose={() => setPrivacyOpen(false)}
            title="Privacy"
            sections={PRIVACY_SECTIONS}
            fullVersionUrl="https://fylos.me/privacy"
          />
        </>
      }
        helpTopics={[
          {
            q: 'Why do you need a password?',
            a: "Apple and Google handle this for you on their side. When you sign up manually, your password is what proves it's you next time.",
          },
          {
            q: 'What counts as strong?',
            a: 'Six characters minimum. A mix of letters and numbers makes it easier to remember and harder to guess.',
          },
          {
            q: 'Why type it twice?',
            a: 'Catches typos before they become a reset email later.',
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
            <span
              onClick={() => setTermsOpen(true)}
              style={{
                color: TAuth.coral,
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(232,93,42,0.4)',
                textUnderlineOffset: 2,
              }}
            >
              Terms
            </span>{' '}
            &{' '}
            <span
              onClick={() => setPrivacyOpen(true)}
              style={{
                color: TAuth.coral,
                fontWeight: 600,
                cursor: 'pointer',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(232,93,42,0.4)',
                textUnderlineOffset: 2,
              }}
            >
              Privacy
            </span>
            .
          </p>
        </div>
    </AuthShell>
  );
}
