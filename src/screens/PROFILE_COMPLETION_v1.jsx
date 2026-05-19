import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  Phone,
  MapPin,
  ArrowRight,
  ChevronLeft,
  X,
} from 'lucide-react';
import { TAuth } from '../components/AuthShell';

/* ──────────────────────────────────────────────────────────────────────
   PROFILE_COMPLETION_v1.jsx
   First-launch nudge that sits on top of the existing /home dashboard.
   We don't fake a dashboard here — the real one already exists. This
   file exports two pieces:

     · ProfilePrompt — the small floating card that nudges the user
     · ProfileSheet  — the multi-step bottom sheet that opens on tap

   They're designed to drop straight into the existing home screen
   (src/screens/Explore-home-v1.jsx) in the next iteration, gated by
   a "first launch" flag from the auth flow.

   The default export below (/welcome route) is a thin standalone
   harness — just the iPhone frame surface + the prompt — so the
   experience can be reviewed without touching the dashboard code yet.

   No FYLOS brand lockup. We're past auth; this is part of the app
   surface. Still cream + coral + Playfair so it feels of-a-piece.
   ────────────────────────────────────────────────────────────────────── */

export default function ProfileCompletion() {
  const navigate = useNavigate();
  const [promptOpen, setPromptOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openSheet = () => setSheetOpen(true);
  const closeSheet = () => setSheetOpen(false);
  const finishProfile = () => {
    setSheetOpen(false);
    setPromptOpen(false);
    // Once integrated, the dashboard stays put underneath. Here we
    // route to /add-pet to continue the new-user flow for demo.
    setTimeout(() => navigate('/add-pet'), 220);
  };

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased">
      <div
        className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200"
        style={{ background: TAuth.bg, display: 'flex', flexDirection: 'column' }}
      >
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-[300] pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {/* Surface intentionally left blank — the real dashboard
            (/home, src/screens/Explore-home-v1.jsx) takes this spot
            when wired up in the next iteration. */}
        <div style={{ flex: 1 }} />

        {/* Floating prompt at the bottom — small card nudging the
            user to finish their profile. Stays visible until they
            either tap it (opens the sheet) or finish the steps. */}
        {promptOpen && !sheetOpen && (
          <ProfilePrompt onTap={openSheet} />
        )}

        {/* Multi-step bottom sheet — opens on prompt tap, hosts the
            three optional steps inside the app. */}
        {sheetOpen && (
          <ProfileSheet onClose={closeSheet} onDone={finishProfile} />
        )}
      </div>
    </div>
  );
}

/* ─────────────  The floating popup  ──────────────────────────────── */
export function ProfilePrompt({ onTap }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 22,
        left: 16,
        right: 16,
        zIndex: 50,
        animation:
          'promptFadeIn 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
      }}
    >
      <style>{`
        @keyframes promptFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <button
        onClick={onTap}
        style={{
          width: '100%',
          background: TAuth.bg,
          border: '1px solid rgba(60,30,15,0.06)',
          borderRadius: 18,
          padding: '14px 16px 14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow:
            '0 1px 2px rgba(60,30,15,0.04), 0 14px 36px rgba(60,30,15,0.16)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'rgba(232,93,42,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: TAuth.coral,
            flexShrink: 0,
          }}
        >
          <ArrowRight size={18} strokeWidth={2.4} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 700,
              color: TAuth.text,
              fontFamily: 'Inter, -apple-system, sans-serif',
            }}
          >
            Finish your profile
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: TAuth.textMuted,
              marginTop: 2,
              fontFamily: 'Inter, -apple-system, sans-serif',
            }}
          >
            Three quick things and you're set.
          </div>
        </div>
      </button>
    </div>
  );
}

/* ─────────────  Multi-step bottom sheet  ─────────────────────────── */
const STEPS = 3;

export function ProfileSheet({ onClose, onDone }) {
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const fileInputRef = useRef(null);

  const next = () => {
    if (step < STEPS) setStep(step + 1);
    else onDone();
  };
  const back = () => {
    if (step > 1) setStep(step - 1);
  };
  const skip = () => next();

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(60,30,15,0.38)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        animation: 'pcFade 220ms ease both',
      }}
    >
      <style>{`
        @keyframes pcFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pcSlide { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes pcStep { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: TAuth.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '14px 24px 24px',
          boxShadow: '0 -8px 28px rgba(60,30,15,0.18)',
          animation:
            'pcSlide 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 44,
            height: 4,
            borderRadius: 2,
            background: 'rgba(60,30,15,0.16)',
            margin: '0 auto 16px',
          }}
        />

        {/* Header — step dots + close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          {step > 1 ? (
            <button
              onClick={back}
              aria-label="Back"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(232,93,42,0.08)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: TAuth.coralDark,
              }}
            >
              <ChevronLeft size={16} />
            </button>
          ) : (
            <div style={{ width: 32 }} />
          )}

          <StepDots step={step} />

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              color: TAuth.textTertiary,
              display: 'flex',
            }}
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Step content */}
        <div
          key={step}
          style={{
            animation:
              'pcStep 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
            minHeight: 280,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {step === 1 && (
            <StepAvatar
              avatar={avatar}
              onPick={() => fileInputRef.current?.click()}
              fileInputRef={fileInputRef}
              onAvatarChange={onAvatarChange}
            />
          )}
          {step === 2 && <StepPhone phone={phone} setPhone={setPhone} />}
          {step === 3 && <StepCity city={city} setCity={setCity} />}
        </div>

        {/* Footer — Skip + Next/Done */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 18,
          }}
        >
          <button
            onClick={skip}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 25,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: TAuth.textTertiary,
              fontFamily: 'inherit',
            }}
          >
            Skip
          </button>
          <button
            onClick={next}
            style={{
              flex: 2,
              height: 50,
              borderRadius: 25,
              background: TAuth.coral,
              color: '#FFFFFF',
              fontSize: 14.5,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(232,93,42,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
            }}
          >
            {step === STEPS ? 'Done' : 'Next'}
            <ArrowRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepDots({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {Array.from({ length: STEPS }).map((_, i) => {
        const active = i === step - 1;
        return (
          <div
            key={i}
            style={{
              width: active ? 6 : 14,
              height: active ? 6 : 2,
              borderRadius: active ? '50%' : 1,
              background: active ? TAuth.coral : 'rgba(60,30,15,0.22)',
              transition: 'all 280ms cubic-bezier(0.34, 1.4, 0.64, 1)',
            }}
          />
        );
      })}
    </div>
  );
}

function StepHeading({ title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 22 }}>
      <h2
        style={{
          fontFamily: '"Playfair Display", "Georgia", serif',
          fontSize: 24,
          fontWeight: 700,
          color: TAuth.text,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          margin: 0,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 13.5,
          color: TAuth.textMuted,
          lineHeight: 1.5,
          margin: '6px auto 0',
          maxWidth: 280,
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}
      >
        {sub}
      </p>
    </div>
  );
}

function StepAvatar({ avatar, onPick, fileInputRef, onAvatarChange }) {
  return (
    <>
      <StepHeading
        title="A photo?"
        sub="So you spot your account in a glance. Optional."
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
          onClick={onPick}
          aria-label={avatar ? 'Change photo' : 'Add a photo'}
          style={{
            width: 120,
            height: 120,
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
          {!avatar && <Camera size={30} strokeWidth={1.8} />}
        </button>
      </div>
    </>
  );
}

function StepPhone({ phone, setPhone }) {
  return (
    <>
      <StepHeading
        title="Your number?"
        sub="For vet alerts and reminders we don't want you to miss."
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 54,
          padding: '0 18px',
          background: '#FFFFFF',
          border: '1px solid rgba(60,30,15,0.04)',
          borderRadius: 16,
          boxShadow:
            '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.04)',
        }}
      >
        <Phone size={17} color="#9C8E84" strokeWidth={2.2} />
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+30 690 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoFocus
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 15,
            fontWeight: 500,
            color: TAuth.text,
            fontFamily: 'Inter, -apple-system, sans-serif',
          }}
        />
      </div>
    </>
  );
}

function StepCity({ city, setCity }) {
  return (
    <>
      <StepHeading
        title="Where are you based?"
        sub="So we can show vets and walkers near you."
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 54,
          padding: '0 18px',
          background: '#FFFFFF',
          border: '1px solid rgba(60,30,15,0.04)',
          borderRadius: 16,
          boxShadow:
            '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.04)',
        }}
      >
        <MapPin size={17} color="#9C8E84" strokeWidth={2.2} />
        <input
          type="text"
          autoComplete="address-level2"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          autoFocus
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: 15,
            fontWeight: 500,
            color: TAuth.text,
            fontFamily: 'Inter, -apple-system, sans-serif',
          }}
        />
      </div>
    </>
  );
}
