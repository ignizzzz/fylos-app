import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Star,
  Shield,
  Camera,
  ArrowRight,
  X,
  Circle,
  Heart,
  PawPrint,
  Settings,
  Plus,
} from 'lucide-react';

/**
 * 50_PRO_REGISTRATION_v1.jsx
 * Professional Registration flow for the Fylos pet care app.
 * 6-step wizard: Role -> Personal Info -> Experience -> Services & Pricing -> Verification -> Submitted.
 * Revolut-inspired dark premium design with Fylos orange accent.
 */

// ─── THEME ────────────────────────────────────────────────────────────────────
const THEME = {
  colors: {
    accent: '#E85D2A',
    accentLight: '#FF7240',
    accentGlow: 'rgba(232,93,42,0.15)',
    primaryText: '#FFFFFF',
    secondaryText: 'rgba(255,255,255,0.55)',
    tertiaryText: 'rgba(255,255,255,0.35)',
    background: '#0D1B2A',
    surface: '#142232',
    surfaceAlt: '#1B2D3E',
    danger: '#FF4444',
    success: '#00D26A',
    warning: '#FF9500',
    info: '#007AFF',
    divider: 'rgba(255,255,255,0.08)',
  },
  radius: {
    full: '9999px',
    large: '24px',
    medium: '16px',
    small: '8px',
    card: '20px',
  },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.2)',
    floating: '0 8px 24px rgba(0,0,0,0.3)',
    active: '0 8px 30px rgba(0,0,0,0.25)',
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

const C = THEME.colors;

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .pro-reg * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pro-reg input,
    .pro-reg textarea {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      outline: none;
      border: none;
    }

    .pro-reg input::placeholder,
    .pro-reg textarea::placeholder {
      color: ${C.tertiaryText};
    }

    .pro-reg-btn {
      transition: transform ${THEME.motion.tap} ${THEME.motion.spring},
                  opacity ${THEME.motion.fade} ease;
      cursor: pointer;
      user-select: none;
    }
    .pro-reg-btn:active {
      transform: scale(0.97);
    }

    .pro-reg-card {
      background: ${C.surface};
      border-radius: 20px;
      padding: 20px;
      box-shadow: ${THEME.shadows.soft};
    }

    .pro-reg-fade-in {
      animation: proRegFadeIn ${THEME.motion.fade} ease forwards;
    }

    @keyframes proRegFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes proRegCheckPop {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }

    @keyframes proRegRing {
      0%   { transform: scale(0.5); opacity: 0; }
      50%  { opacity: 0.3; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    .pro-reg-input {
      width: 100%;
      padding: 14px 16px;
      border-radius: 14px;
      background: ${C.surfaceAlt};
      font-size: 15px;
      color: ${C.primaryText};
      border: 2px solid transparent;
      transition: border-color ${THEME.motion.fade} ease, background ${THEME.motion.fade} ease;
    }
    .pro-reg-input:focus {
      border-color: ${C.accent};
      background: ${C.surface};
    }
  `}</style>
);

// ─── STEP DATA ────────────────────────────────────────────────────────────────
const STEPS = [
  { label: 'Role', icon: PawPrint },
  { label: 'Personal', icon: User },
  { label: 'Experience', icon: Star },
  { label: 'Services', icon: Clock },
  { label: 'Verify', icon: Shield },
  { label: 'Done', icon: Check },
];

const ROLES = [
  { id: 'walker', label: 'Dog Walker', desc: 'Daily walks & exercise', icon: PawPrint },
  { id: 'sitter', label: 'Pet Sitter', desc: 'Home visits & overnight care', icon: Heart },
  { id: 'groomer', label: 'Groomer', desc: 'Bathing, trimming & styling', icon: Star },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EXPERIENCE_OPTIONS = ['< 1 year', '1-2 years', '3-5 years', '5+ years'];

const DEFAULT_SERVICES = {
  walker: [
    { name: '30-min Walk', price: '' },
    { name: '60-min Walk', price: '' },
    { name: 'Group Walk', price: '' },
  ],
  sitter: [
    { name: 'Drop-in Visit (30 min)', price: '' },
    { name: 'Day Care', price: '' },
    { name: 'Overnight Stay', price: '' },
  ],
  groomer: [
    { name: 'Bath & Brush', price: '' },
    { name: 'Full Groom', price: '' },
    { name: 'Nail Trim', price: '' },
  ],
};

// ─── STEP 1: ROLE SELECTION ───────────────────────────────────────────────────
const StepRole = ({ selected, onSelect }) => (
  <div className="pro-reg-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.primaryText, marginBottom: 6 }}>
        What do you do?
      </h2>
      <p style={{ fontSize: 14, color: C.secondaryText, lineHeight: 1.5 }}>
        Select the role that best describes your services.
      </p>
    </div>

    {ROLES.map((role) => {
      const active = selected === role.id;
      const Icon = role.icon;
      return (
        <div
          key={role.id}
          className="pro-reg-btn pro-reg-card"
          onClick={() => onSelect(role.id)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            border: `2px solid ${active ? C.accent : 'transparent'}`,
            background: active ? C.accentGlow : C.surface,
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: active ? C.accent : C.surfaceAlt,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: `background ${THEME.motion.fade} ease`,
            }}
          >
            <Icon size={22} color={active ? '#FFFFFF' : C.accentLight} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: C.primaryText }}>{role.label}</div>
            <div style={{ fontSize: 13, color: C.secondaryText, marginTop: 2 }}>{role.desc}</div>
          </div>
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: 12,
              border: `2px solid ${active ? C.accent : C.divider}`,
              background: active ? C.accent : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: `all ${THEME.motion.fade} ease`,
            }}
          >
            {active && <Check size={14} color="#FFFFFF" strokeWidth={2.5} />}
          </div>
        </div>
      );
    })}
  </div>
);

// ─── STEP 2: PERSONAL INFO ────────────────────────────────────────────────────
const InputField = ({ icon: Icon, label, value, onChange, placeholder, type = 'text' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: C.secondaryText, paddingLeft: 2 }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      {Icon && (
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        >
          <Icon size={18} color={C.tertiaryText} strokeWidth={1.8} />
        </div>
      )}
      <input
        className="pro-reg-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={Icon ? { paddingLeft: 42 } : {}}
      />
    </div>
  </div>
);

const StepPersonal = ({ data, onChange }) => (
  <div className="pro-reg-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.primaryText, marginBottom: 6 }}>
        About you
      </h2>
      <p style={{ fontSize: 14, color: C.secondaryText, lineHeight: 1.5 }}>
        We need a few details to set up your profile.
      </p>
    </div>

    <InputField
      icon={User}
      label="Full Name"
      value={data.name}
      onChange={(v) => onChange({ ...data, name: v })}
      placeholder="Anna Meier"
    />
    <InputField
      icon={Phone}
      label="Phone"
      value={data.phone}
      onChange={(v) => onChange({ ...data, phone: v })}
      placeholder="+41 79 123 45 67"
      type="tel"
    />
    <InputField
      icon={Mail}
      label="Email"
      value={data.email}
      onChange={(v) => onChange({ ...data, email: v })}
      placeholder="anna@example.ch"
      type="email"
    />
    <InputField
      icon={MapPin}
      label="Location"
      value={data.location}
      onChange={(v) => onChange({ ...data, location: v })}
      placeholder="Zürich, Switzerland"
    />
  </div>
);

// ─── STEP 3: EXPERIENCE ───────────────────────────────────────────────────────
const StepExperience = ({ data, onChange }) => (
  <div className="pro-reg-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.primaryText, marginBottom: 6 }}>
        Your experience
      </h2>
      <p style={{ fontSize: 14, color: C.secondaryText, lineHeight: 1.5 }}>
        Help pet owners understand your background.
      </p>
    </div>

    {/* Experience level */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.secondaryText, paddingLeft: 2 }}>
        Years of experience
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {EXPERIENCE_OPTIONS.map((opt) => {
          const active = data.experience === opt;
          return (
            <div
              key={opt}
              className="pro-reg-btn"
              onClick={() => onChange({ ...data, experience: opt })}
              style={{
                padding: '10px 16px',
                borderRadius: 12,
                fontSize: 14,
                fontWeight: 500,
                background: active ? C.accent : C.surfaceAlt,
                color: active ? '#FFFFFF' : C.primaryText,
                border: `1.5px solid ${active ? C.accent : 'transparent'}`,
                cursor: 'pointer',
                transition: `all ${THEME.motion.fade} ease`,
              }}
            >
              {opt}
            </div>
          );
        })}
      </div>
    </div>

    {/* Bio */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: C.secondaryText, paddingLeft: 2 }}>
        Bio
      </label>
      <textarea
        className="pro-reg-input"
        value={data.bio}
        onChange={(e) => onChange({ ...data, bio: e.target.value })}
        placeholder="Tell pet owners about yourself, your approach, and why you love working with animals..."
        rows={4}
        style={{ resize: 'none', lineHeight: 1.5 }}
      />
    </div>

    {/* Certifications toggle */}
    <div
      className="pro-reg-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.primaryText }}>
          Certifications
        </div>
        <div style={{ fontSize: 13, color: C.secondaryText, marginTop: 2 }}>
          I hold relevant certifications
        </div>
      </div>
      <div
        className="pro-reg-btn"
        onClick={() => onChange({ ...data, hasCertifications: !data.hasCertifications })}
        style={{
          width: 52,
          height: 30,
          borderRadius: 15,
          background: data.hasCertifications ? C.accent : C.divider,
          padding: 3,
          cursor: 'pointer',
          transition: `background ${THEME.motion.fade} ease`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            background: '#FFFFFF',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            transform: data.hasCertifications ? 'translateX(22px)' : 'translateX(0)',
            transition: `transform ${THEME.motion.fade} ${THEME.motion.spring}`,
          }}
        />
      </div>
    </div>
  </div>
);

// ─── STEP 4: SERVICES & PRICING ───────────────────────────────────────────────
const StepServices = ({ role, data, onChange }) => {
  const services = data.services || DEFAULT_SERVICES[role] || DEFAULT_SERVICES.walker;

  const updateServicePrice = (idx, price) => {
    const updated = services.map((s, i) => (i === idx ? { ...s, price } : s));
    onChange({ ...data, services: updated });
  };

  return (
    <div className="pro-reg-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: C.primaryText, marginBottom: 6 }}>
          Services & Pricing
        </h2>
        <p style={{ fontSize: 14, color: C.secondaryText, lineHeight: 1.5 }}>
          Set your prices. You can adjust these any time.
        </p>
      </div>

      {/* Service list with price inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {services.map((svc, idx) => (
          <div
            key={idx}
            className="pro-reg-card"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ flex: 1, fontSize: 15, fontWeight: 500, color: C.primaryText }}>
              {svc.name}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: C.surfaceAlt,
                borderRadius: 12,
                padding: '8px 12px',
                width: 110,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: C.secondaryText }}>CHF</span>
              <input
                className="pro-reg-input"
                type="number"
                value={svc.price}
                onChange={(e) => updateServicePrice(idx, e.target.value)}
                placeholder="0"
                style={{
                  padding: 0,
                  background: 'transparent',
                  fontSize: 15,
                  fontWeight: 600,
                  width: 50,
                  textAlign: 'right',
                  borderRadius: 0,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Availability days */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.secondaryText, paddingLeft: 2 }}>
          Available days
        </label>
        <div style={{ display: 'flex', gap: 6 }}>
          {DAYS.map((day) => {
            const active = (data.availableDays || []).includes(day);
            return (
              <div
                key={day}
                className="pro-reg-btn"
                onClick={() => {
                  const current = data.availableDays || [];
                  const updated = active
                    ? current.filter((d) => d !== day)
                    : [...current, day];
                  onChange({ ...data, availableDays: updated });
                }}
                style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: '10px 0',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  background: active ? C.accent : C.surfaceAlt,
                  color: active ? '#FFFFFF' : C.secondaryText,
                  cursor: 'pointer',
                  transition: `all ${THEME.motion.fade} ease`,
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── STEP 5: VERIFICATION ─────────────────────────────────────────────────────
const StepVerify = ({ data, onChange }) => (
  <div className="pro-reg-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: C.primaryText, marginBottom: 6 }}>
        Verification
      </h2>
      <p style={{ fontSize: 14, color: C.secondaryText, lineHeight: 1.5 }}>
        We verify all professionals to keep pets safe.
      </p>
    </div>

    {/* ID Upload */}
    <div className="pro-reg-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Shield size={20} color={C.accent} strokeWidth={1.8} />
        <span style={{ fontSize: 15, fontWeight: 600, color: C.primaryText }}>
          Identity Document
        </span>
      </div>
      <div
        className="pro-reg-btn"
        onClick={() => onChange({ ...data, idUploaded: !data.idUploaded })}
        style={{
          border: `2px dashed ${data.idUploaded ? C.accent : C.divider}`,
          borderRadius: 14,
          padding: '28px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          background: data.idUploaded ? C.accentGlow : C.surfaceAlt,
          cursor: 'pointer',
          transition: `all ${THEME.motion.fade} ease`,
        }}
      >
        {data.idUploaded ? (
          <>
            <Check size={28} color={C.accent} strokeWidth={2} />
            <span style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>
              Document uploaded
            </span>
          </>
        ) : (
          <>
            <Camera size={28} color={C.tertiaryText} strokeWidth={1.5} />
            <span style={{ fontSize: 14, fontWeight: 500, color: C.secondaryText }}>
              Tap to upload ID or passport
            </span>
          </>
        )}
      </div>
    </div>

    {/* Background Check */}
    <div
      className="pro-reg-card"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
    >
      <div style={{ flex: 1, paddingRight: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.primaryText }}>Background Check</div>
        <div style={{ fontSize: 13, color: C.secondaryText, marginTop: 2, lineHeight: 1.4 }}>
          I consent to a background check
        </div>
      </div>
      <div
        className="pro-reg-btn"
        onClick={() => onChange({ ...data, backgroundCheck: !data.backgroundCheck })}
        style={{
          width: 52,
          height: 30,
          borderRadius: 15,
          background: data.backgroundCheck ? C.accent : C.divider,
          padding: 3,
          cursor: 'pointer',
          transition: `background ${THEME.motion.fade} ease`,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            background: '#FFFFFF',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            transform: data.backgroundCheck ? 'translateX(22px)' : 'translateX(0)',
            transition: `transform ${THEME.motion.fade} ${THEME.motion.spring}`,
          }}
        />
      </div>
    </div>

    {/* Terms */}
    <div
      className="pro-reg-btn pro-reg-card"
      onClick={() => onChange({ ...data, termsAccepted: !data.termsAccepted })}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: 24,
          height: 24,
          borderRadius: 8,
          border: `2px solid ${data.termsAccepted ? C.accent : C.divider}`,
          background: data.termsAccepted ? C.accent : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: `all ${THEME.motion.fade} ease`,
        }}
      >
        {data.termsAccepted && <Check size={14} color="#FFFFFF" strokeWidth={2.5} />}
      </div>
      <div style={{ fontSize: 14, color: C.secondaryText, lineHeight: 1.4 }}>
        I agree to the <span style={{ color: C.accent, fontWeight: 600 }}>Terms of Service</span>{' '}
        and <span style={{ color: C.accent, fontWeight: 600 }}>Privacy Policy</span>
      </div>
    </div>
  </div>
);

// ─── STEP 6: SUBMITTED ────────────────────────────────────────────────────────
const StepSubmitted = () => (
  <div
    className="pro-reg-fade-in"
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      flex: 1,
      padding: '40px 20px',
      gap: 20,
    }}
  >
    {/* Animated check */}
    <div style={{ position: 'relative', width: 88, height: 88 }}>
      {/* Ring pulse */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `2px solid ${C.accent}`,
          animation: 'proRegRing 1.5s ease-out infinite',
        }}
      />
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          background: C.accentGlow,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: C.accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'proRegCheckPop 0.5s ease forwards',
          }}
        >
          <Check size={30} color="#FFFFFF" strokeWidth={2.5} />
        </div>
      </div>
    </div>

    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: C.primaryText, marginBottom: 8 }}>
        Application Submitted
      </h2>
      <p style={{ fontSize: 15, color: C.secondaryText, lineHeight: 1.6, maxWidth: 280 }}>
        We'll review your application and get back to you within 48 hours. You'll receive a
        notification once approved.
      </p>
    </div>

    <div
      style={{
        padding: '14px 20px',
        borderRadius: 14,
        background: C.accentGlow,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <Clock size={18} color={C.accent} strokeWidth={1.8} />
      <span style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>
        Review time: ~48 hours
      </span>
    </div>

    <div
      className="pro-reg-btn"
      onClick={() => { window.location.href = '/pro-dashboard'; }}
      style={{
        marginTop: 8,
        width: '100%',
        padding: '16px 0',
        borderRadius: 16,
        background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 600,
        textAlign: 'center',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      }}
    >
      Go to Dashboard
      <ArrowRight size={18} color="#FFFFFF" strokeWidth={2} />
    </div>
  </div>
);

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
const ProgressBar = ({ step, total }) => (
  <div
    style={{
      width: '100%',
      height: 3,
      background: C.surfaceAlt,
      borderRadius: 2,
    }}
  >
    <div
      style={{
        height: '100%',
        width: `${((step + 1) / total) * 100}%`,
        background: `linear-gradient(90deg, ${C.accent}, ${C.accentLight})`,
        borderRadius: 2,
        transition: `width 300ms ${THEME.motion.spring}`,
      }}
    />
  </div>
);

// ─── STEP DOTS ────────────────────────────────────────────────────────────────
const StepDots = ({ step, total }) => (
  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i === step ? 20 : 6,
          height: 6,
          borderRadius: 3,
          background: i === step ? C.accent : i < step ? C.accentLight : C.surfaceAlt,
          transition: `all 300ms ${THEME.motion.spring}`,
        }}
      />
    ))}
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function Screen_50_PRO_REGISTRATION_v1() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [personal, setPersonal] = useState({ name: '', phone: '', email: '', location: '' });
  const [experience, setExperience] = useState({
    experience: '',
    bio: '',
    hasCertifications: false,
  });
  const [services, setServices] = useState({
    services: null,
    availableDays: [],
  });
  const [verify, setVerify] = useState({
    idUploaded: false,
    backgroundCheck: false,
    termsAccepted: false,
  });

  const TOTAL_STEPS = 6;

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!role;
      case 1:
        return personal.name && personal.email;
      case 2:
        return !!experience.experience;
      case 3:
        return (services.availableDays || []).length > 0;
      case 4:
        return verify.idUploaded && verify.backgroundCheck && verify.termsAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1 && canProceed()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0 && step < TOTAL_STEPS - 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepRole selected={role} onSelect={setRole} />;
      case 1:
        return <StepPersonal data={personal} onChange={setPersonal} />;
      case 2:
        return <StepExperience data={experience} onChange={setExperience} />;
      case 3:
        return <StepServices role={role || 'walker'} data={services} onChange={setServices} />;
      case 4:
        return <StepVerify data={verify} onChange={setVerify} />;
      case 5:
        return <StepSubmitted />;
      default:
        return null;
    }
  };

  return (
    <div
      className="pro-reg"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E5E5',
        padding: '20px',
      }}
    >
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#0D1B2A', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column' }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 9999 }} />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="7" width="3" height="5" rx="1" fill="#FFFFFF"/><rect x="4.5" y="5" width="3" height="7" rx="1" fill="#FFFFFF"/><rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#FFFFFF"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#FFFFFF"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#FFFFFF"/><path d="M4.75 7.75a4.75 4.75 0 016.5 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 5a8 8 0 0112 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="12" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="#FFFFFF" strokeOpacity="0.35"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="#FFFFFF"/><path d="M24 4v4a2 2 0 000-4z" fill="#FFFFFF" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Status bar spacer */}
        <div style={{ height: 54, flexShrink: 0 }} />

        {/* Progress bar */}
        <div style={{ padding: '0 20px', flexShrink: 0 }}>
          <ProgressBar step={step} total={TOTAL_STEPS} />
        </div>

        {/* Floating Header */}
        {step < TOTAL_STEPS - 1 && (
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20, background: 'linear-gradient(to bottom, rgba(13,27,42,0.95) 0%, rgba(13,27,42,0.7) 60%, transparent 100%)' }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <button
                onClick={step > 0 ? handleBack : () => { window.history.back(); }}
                className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
                style={{ background: '#142232', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
              >
                <ChevronLeft size={22} color="#FFFFFF" />
              </button>
              <h2 className="text-[17px] font-semibold" style={{ color: '#FFFFFF' }}>Step {step + 1} of {TOTAL_STEPS - 1}</h2>
              <div className="w-[44px]" />
            </div>
          </header>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 20px 20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {renderStep()}
        </div>

        {/* Bottom navigation */}
        {step < TOTAL_STEPS - 1 && (
          <div
            style={{
              padding: '12px 20px 16px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              alignItems: 'center',
            }}
          >
            <StepDots step={step} total={TOTAL_STEPS - 1} />

            <div
              className="pro-reg-btn"
              onClick={handleNext}
              style={{
                width: '100%',
                padding: '16px 0',
                borderRadius: 16,
                background: canProceed() ? `linear-gradient(135deg, ${C.accent}, ${C.accentLight})` : C.divider,
                color: canProceed() ? '#FFFFFF' : C.tertiaryText,
                fontSize: 16,
                fontWeight: 600,
                textAlign: 'center',
                cursor: canProceed() ? 'pointer' : 'default',
                transition: `all ${THEME.motion.fade} ease`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {step === TOTAL_STEPS - 2 ? 'Submit Application' : 'Continue'}
              {step < TOTAL_STEPS - 2 && (
                <ArrowRight size={18} color={canProceed() ? '#FFFFFF' : C.tertiaryText} strokeWidth={2} />
              )}
              {step === TOTAL_STEPS - 2 && (
                <Check size={18} color={canProceed() ? '#FFFFFF' : C.tertiaryText} strokeWidth={2} />
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
