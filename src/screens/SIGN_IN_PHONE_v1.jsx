import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Check } from 'lucide-react';
import AuthShell, { AuthInput, AuthCta, TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   SIGN_IN_PHONE_v1.jsx
   Two-step phone auth. Step 1 = phone number → "Send code". Step 2 =
   6-digit OTP entered in box grid → "Sign in". State machine lives
   here so the user stays in one screen the whole time.

   NOTE for Panagiotis: SMS costs add up (~$0.05+ per text to Greek
   numbers via Twilio). Rate-limit the "Send code" endpoint server-side
   and consider captcha before first send.
   ────────────────────────────────────────────────────────────────────── */

const PHONE_RE = /^[+]?[\d\s()-]{8,}$/;

function OtpInput({ value, onChange }) {
  const inputsRef = useRef([]);
  const digits = (value + '      ').slice(0, 6).split('');

  const setDigit = (i, char) => {
    const next = value.split('');
    next[i] = char;
    const joined = next.join('').replace(/\s/g, '').slice(0, 6);
    onChange(joined);
  };

  const handleChange = (i, e) => {
    const char = (e.target.value || '').replace(/\D/g, '').slice(-1);
    if (!char) return;
    setDigit(i, char);
    if (i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[i]) {
        const next = value.slice(0, i) + value.slice(i + 1);
        onChange(next.padEnd(i, ''));
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        const next = value.slice(0, i - 1) + value.slice(i);
        onChange(next);
      }
    }
    if (e.key === 'ArrowLeft' && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      e.preventDefault();
      onChange(pasted);
      inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digits[i].trim()}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          style={{
            width: 44,
            height: 56,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            color: TAuth.text,
            background: TAuth.coralInput,
            border: '1px solid transparent',
            borderRadius: 12,
            outline: 'none',
            fontFamily: 'Inter, -apple-system, sans-serif',
          }}
        />
      ))}
    </div>
  );
}

export default function SignInPhone() {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // 'phone' | 'code'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const phoneValid = PHONE_RE.test(phone);
  const codeValid = code.length === 6;
  const phoneError = touched && !phoneValid ? 'Use a real number, please.' : '';

  const sendCode = () => {
    setTouched(true);
    if (!phoneValid) return;
    setLoading(true);
    // Placeholder — Panagiotis wires Twilio (or similar).
    setTimeout(() => {
      setLoading(false);
      setStep('code');
    }, 700);
  };

  const verify = () => {
    if (!codeValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/home');
    }, 500);
  };

  if (step === 'code') {
    return (
      <AuthShell
        onBack={() => setStep('phone')}
        tagline="A calmer way to care."
        title="Pop in the code."
        subtitle={`We just texted a six-digit code to ${phone}.`}
        footer={
          <span>
            Didn't land?{' '}
            <span
              onClick={sendCode}
              style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
            >
              Resend
            </span>
          </span>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <OtpInput value={code} onChange={setCode} />
          <AuthCta onClick={verify} disabled={!codeValid} loading={loading}>
            Sign in
            <ArrowRight size={17} strokeWidth={2.4} />
          </AuthCta>
          <button
            onClick={() => navigate('/sign-in')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              color: TAuth.textTertiary,
              padding: '4px 8px',
              margin: '0 auto',
              fontFamily: 'inherit',
            }}
          >
            Use email instead
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      onBack={() => navigate('/sign-in')}
      tagline="A calmer way to care."
      title="Got a phone?"
      subtitle="Drop your number and we'll text a six-digit code."
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AuthInput
          icon={<Phone size={17} strokeWidth={2.2} />}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+30 690 000 0000"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (touched) setTouched(false);
          }}
          error={phoneError}
        />
        <AuthCta onClick={sendCode} disabled={!phoneValid && touched} loading={loading}>
          Send code
          <ArrowRight size={17} strokeWidth={2.4} />
        </AuthCta>
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
          Use email instead
        </button>
      </div>
    </AuthShell>
  );
}
