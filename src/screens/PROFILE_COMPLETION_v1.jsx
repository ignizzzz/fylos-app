import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Phone, MapPin, ArrowRight } from 'lucide-react';
import AuthShell, { AuthInput, AuthCta, TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   PROFILE_COMPLETION_v1.jsx
   The "finish your profile" moment that bridges every auth path into
   the dashboard. Drops in front of the app on first run after sign-up
   (manual, Apple, or Google), asking for three optional things:

   · Avatar
   · Phone
   · City

   All skippable. The point is to give the user a fast on-ramp; the
   rest of the profile lives in Settings.

   On submit → /add-pet (then the dashboard once a pet exists).
   ────────────────────────────────────────────────────────────────────── */

export default function ProfileCompletion() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [avatar, setAvatar] = useState(null);
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  };

  const submit = () => {
    setLoading(true);
    // Placeholder. Panagiotis wires the actual profile-save call.
    setTimeout(() => {
      setLoading(false);
      navigate('/add-pet');
    }, 700);
  };

  const skip = () => navigate('/add-pet');

  return (
    <AuthShell
      showHelp
      helpTopics={[
        {
          q: 'Why ask for these now?',
          a: 'Photo helps you spot your account in a glance. Phone is for vet alerts and reminders. City helps us find nearby walkers and clinics. All three are optional.',
        },
        {
          q: 'Can I do it later?',
          a: "Yes. Everything here lives in Settings. Edit or add anytime.",
        },
        {
          q: 'What if I skip?',
          a: "No problem. We'll take you straight to adding your first pet.",
        },
      ]}
      title="Almost set."
      subtitle="Three quick things. All optional."
      footer={
        <span
          onClick={skip}
          style={{
            color: TAuth.coral,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Skip for now
        </span>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Avatar picker — coral-soft circle, camera glyph when empty,
            uploaded image filling the circle when set. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: 2,
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onAvatarChange}
            style={{ display: 'none' }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            aria-label={avatar ? 'Change photo' : 'Add a photo'}
            style={{
              width: 92,
              height: 92,
              borderRadius: '50%',
              background: avatar
                ? `center / cover no-repeat url(${avatar})`
                : 'rgba(232,93,42,0.06)',
              border: avatar
                ? '2px solid rgba(232,93,42,0.18)'
                : '2px dashed rgba(60,30,15,0.18)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: TAuth.coral,
              padding: 0,
              transition: 'background 180ms ease, border-color 180ms ease',
            }}
          >
            {!avatar && <Camera size={26} strokeWidth={1.8} />}
          </button>
          <span
            style={{
              marginTop: 8,
              fontSize: 12.5,
              color: TAuth.textTertiary,
              fontWeight: 500,
              fontFamily: 'Inter, -apple-system, sans-serif',
            }}
          >
            {avatar ? 'Tap to change' : 'Add a photo'}
          </span>
        </div>

        <AuthInput
          icon={<Phone size={17} strokeWidth={2.2} />}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <AuthInput
          icon={<MapPin size={17} strokeWidth={2.2} />}
          autoComplete="address-level2"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <div style={{ marginTop: 6 }}>
          <AuthCta onClick={submit} loading={loading}>
            Let's go
            <ArrowRight size={17} strokeWidth={2.4} />
          </AuthCta>
        </div>
      </div>
    </AuthShell>
  );
}
