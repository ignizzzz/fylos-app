import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, MailCheck } from 'lucide-react';
import AuthShell, { AuthCta, TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   VERIFY_EMAIL_v1.jsx
   Post-create handoff. Sits in the same shell so the user feels like
   they're still in the same flow, just waiting on one tap.
   ────────────────────────────────────────────────────────────────────── */

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your inbox';
  const [resentAt, setResentAt] = useState(null);

  const resend = () => {
    // Placeholder — Panagiotis wires re-send.
    setResentAt(Date.now());
  };

  return (
    <AuthShell
      onBack={() => navigate('/create-account')}
      tagline="A calmer way to care."
      title="One last tap."
      subtitle={`We sent a verify link to ${email}. Open it on this device and you're in.`}
      footer={
        <span>
          Wrong email?{' '}
          <span
            onClick={() => navigate('/create-account')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Edit it
          </span>
        </span>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
          {resentAt ? <Check size={16} strokeWidth={2.6} /> : <MailCheck size={16} strokeWidth={2.4} />}
          {resentAt ? 'Sent again.' : 'Check your inbox.'}
        </div>

        <AuthCta onClick={resend}>Resend the link</AuthCta>

        <button
          onClick={() => navigate('/add-pet')}
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
          I'll verify later
        </button>
      </div>
    </AuthShell>
  );
}
