import React, { useState } from 'react';
import {
  ChevronLeft,
  Check,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Shield,
  Camera,
  ArrowRight,
  PawPrint,
  Heart,
} from 'lucide-react';

/**
 * 50_PRO_REGISTRATION_v1.jsx
 * Professional Registration flow for the Fylos pet care app.
 * 6-step wizard: Role -> Personal Info -> Experience -> Services & Pricing -> Verification -> Submitted.
 * Fylos Warm Minimal Design System.
 */

// ─── STATUS BAR ─────────────────────────────────────────────────────────────
const StatusBar = () => (
  <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
    <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
    </div>
  </div>
);

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .pro-reg * {
      margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pro-reg input, .pro-reg textarea {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      outline: none; border: none;
    }
    .pro-reg input::placeholder, .pro-reg textarea::placeholder {
      color: #A09A94;
    }

    .pro-reg-scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .pro-reg-scroll::-webkit-scrollbar { display: none; }

    .pro-tap {
      transition: transform 120ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease;
      cursor: pointer; user-select: none;
    }
    .pro-tap:active { transform: scale(0.97); opacity: 0.85; }

    @keyframes proRegFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .pro-reg-fade { animation: proRegFadeIn 280ms ease both; }

    @keyframes checkPop {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes ringPulse {
      0%   { transform: scale(0.5); opacity: 0; }
      50%  { opacity: 0.3; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    .pro-reg-input {
      width: 100%; height: 52px; padding: 0 16px;
      border-radius: 16px;
      background: #F3EFEB;
      border: 1px solid #EDE8E2;
      font-size: 15px; color: #111;
      transition: border-color 200ms ease, background 200ms ease;
    }
    .pro-reg-input:focus {
      border-color: #E85D2A;
      background: #FFFFFF;
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

// ─── STEP 1: ROLE SELECTION ──────────────────────────────────────────────────
const StepRole = ({ selected, onSelect }) => (
  <div className="pro-reg-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', letterSpacing: '-0.03em', marginBottom: 6 }}>
        What do you do?
      </h2>
      <p style={{ fontSize: 14, color: '#A09A94', lineHeight: 1.5 }}>
        Select the role that best describes your services.
      </p>
    </div>

    {ROLES.map((role) => {
      const active = selected === role.id;
      const Icon = role.icon;
      return (
        <div
          key={role.id}
          className="pro-tap"
          onClick={() => onSelect(role.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 16,
            background: active ? 'rgba(232,93,42,0.08)' : '#F3EFEB',
            borderRadius: 20, padding: 20,
            border: active ? '2px solid #E85D2A' : '2px solid #EDE8E2',
            transition: 'all 200ms ease',
          }}
        >
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: active ? '#E85D2A' : '#EDE8E2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 200ms ease',
          }}>
            <Icon size={22} color={active ? '#FFFFFF' : '#E85D2A'} strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#111' }}>{role.label}</div>
            <div style={{ fontSize: 13, color: '#A09A94', marginTop: 2 }}>{role.desc}</div>
          </div>
          <div style={{
            width: 24, height: 24, borderRadius: 12,
            border: `2px solid ${active ? '#E85D2A' : '#EDE8E2'}`,
            background: active ? '#E85D2A' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 200ms ease',
          }}>
            {active && <Check size={14} color="#FFFFFF" strokeWidth={2.5} />}
          </div>
        </div>
      );
    })}
  </div>
);

// ─── INPUT FIELD ─────────────────────────────────────────────────────────────
const InputField = ({ icon: Icon, label, value, onChange, placeholder, type = 'text' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <label style={{ fontSize: 13, fontWeight: 600, color: '#6E6058', paddingLeft: 2 }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      {Icon && (
        <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <Icon size={18} color="#A09A94" strokeWidth={1.8} />
        </div>
      )}
      <input
        className="pro-reg-input"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={Icon ? { paddingLeft: 44 } : {}}
      />
    </div>
  </div>
);

// ─── STEP 2: PERSONAL INFO ──────────────────────────────────────────────────
const StepPersonal = ({ data, onChange }) => (
  <div className="pro-reg-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', letterSpacing: '-0.03em', marginBottom: 6 }}>
        About you
      </h2>
      <p style={{ fontSize: 14, color: '#A09A94', lineHeight: 1.5 }}>
        We need a few details to set up your profile.
      </p>
    </div>
    <InputField icon={User} label="Full Name" value={data.name} onChange={(v) => onChange({ ...data, name: v })} placeholder="Anna Meier" />
    <InputField icon={Phone} label="Phone" value={data.phone} onChange={(v) => onChange({ ...data, phone: v })} placeholder="+41 79 123 45 67" type="tel" />
    <InputField icon={Mail} label="Email" value={data.email} onChange={(v) => onChange({ ...data, email: v })} placeholder="anna@example.ch" type="email" />
    <InputField icon={MapPin} label="Location" value={data.location} onChange={(v) => onChange({ ...data, location: v })} placeholder="Zurich, Switzerland" />
  </div>
);

// ─── STEP 3: EXPERIENCE ──────────────────────────────────────────────────────
const StepExperience = ({ data, onChange }) => (
  <div className="pro-reg-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', letterSpacing: '-0.03em', marginBottom: 6 }}>
        Your experience
      </h2>
      <p style={{ fontSize: 14, color: '#A09A94', lineHeight: 1.5 }}>
        Help pet owners understand your background.
      </p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#6E6058', paddingLeft: 2 }}>
        Years of experience
      </label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {EXPERIENCE_OPTIONS.map((opt) => {
          const active = data.experience === opt;
          return (
            <div
              key={opt}
              className="pro-tap"
              onClick={() => onChange({ ...data, experience: opt })}
              style={{
                padding: '10px 16px', borderRadius: 16, fontSize: 14, fontWeight: 500,
                background: active ? '#111' : '#F3EFEB',
                color: active ? '#FFFFFF' : '#A09A94',
                border: `1px solid ${active ? '#111' : '#EDE8E2'}`,
                transition: 'all 200ms ease',
              }}
            >
              {opt}
            </div>
          );
        })}
      </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: '#6E6058', paddingLeft: 2 }}>Bio</label>
      <textarea
        className="pro-reg-input"
        value={data.bio}
        onChange={(e) => onChange({ ...data, bio: e.target.value })}
        placeholder="Tell pet owners about yourself, your approach, and why you love working with animals..."
        rows={4}
        style={{ height: 'auto', padding: '14px 16px', resize: 'none', lineHeight: 1.5 }}
      />
    </div>

    <div style={{
      background: '#F3EFEB', borderRadius: 20, padding: 20,
      border: '1px solid #EDE8E2',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Certifications</div>
        <div style={{ fontSize: 13, color: '#A09A94', marginTop: 2 }}>I hold relevant certifications</div>
      </div>
      <div
        className="pro-tap"
        onClick={() => onChange({ ...data, hasCertifications: !data.hasCertifications })}
        style={{
          width: 52, height: 30, borderRadius: 15,
          background: data.hasCertifications ? '#E85D2A' : '#EDE8E2',
          padding: 3, flexShrink: 0,
          transition: 'background 200ms ease',
        }}
      >
        <div style={{
          width: 24, height: 24, borderRadius: 12, background: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          transform: data.hasCertifications ? 'translateX(22px)' : 'translateX(0)',
          transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>
    </div>
  </div>
);

// ─── STEP 4: SERVICES & PRICING ──────────────────────────────────────────────
const StepServices = ({ role, data, onChange }) => {
  const services = data.services || DEFAULT_SERVICES[role] || DEFAULT_SERVICES.walker;

  const updateServicePrice = (idx, price) => {
    const updated = services.map((s, i) => (i === idx ? { ...s, price } : s));
    onChange({ ...data, services: updated });
  };

  return (
    <div className="pro-reg-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ marginBottom: 4 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', letterSpacing: '-0.03em', marginBottom: 6 }}>
          Services & Pricing
        </h2>
        <p style={{ fontSize: 14, color: '#A09A94', lineHeight: 1.5 }}>
          Set your prices. You can adjust these any time.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {services.map((svc, idx) => (
          <div key={idx} style={{
            background: '#F3EFEB', borderRadius: 20, padding: 20,
            border: '1px solid #EDE8E2',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          }}>
            <div style={{ flex: 1, fontSize: 15, fontWeight: 500, color: '#111' }}>{svc.name}</div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#FFFFFF', borderRadius: 12, padding: '8px 12px', width: 110,
              border: '1px solid #EDE8E2',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#A09A94' }}>CHF</span>
              <input
                className="pro-reg-input"
                type="number"
                value={svc.price}
                onChange={(e) => updateServicePrice(idx, e.target.value)}
                placeholder="0"
                style={{
                  padding: 0, background: 'transparent', fontSize: 15, fontWeight: 600,
                  width: 50, height: 'auto', border: 'none', textAlign: 'right', borderRadius: 0,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#6E6058', paddingLeft: 2 }}>
          Available days
        </label>
        <div style={{ display: 'flex', gap: 6 }}>
          {DAYS.map((day) => {
            const active = (data.availableDays || []).includes(day);
            return (
              <div
                key={day}
                className="pro-tap"
                onClick={() => {
                  const current = data.availableDays || [];
                  const updated = active ? current.filter((d) => d !== day) : [...current, day];
                  onChange({ ...data, availableDays: updated });
                }}
                style={{
                  flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 16,
                  fontSize: 13, fontWeight: 600,
                  background: active ? '#111' : '#F3EFEB',
                  color: active ? '#FFFFFF' : '#A09A94',
                  border: `1px solid ${active ? '#111' : '#EDE8E2'}`,
                  transition: 'all 200ms ease',
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

// ─── STEP 5: VERIFICATION ────────────────────────────────────────────────────
const StepVerify = ({ data, onChange }) => (
  <div className="pro-reg-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <div style={{ marginBottom: 4 }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111', letterSpacing: '-0.03em', marginBottom: 6 }}>
        Verification
      </h2>
      <p style={{ fontSize: 14, color: '#A09A94', lineHeight: 1.5 }}>
        We verify all professionals to keep pets safe.
      </p>
    </div>

    {/* ID Upload */}
    <div style={{
      background: '#F3EFEB', borderRadius: 20, padding: 20,
      border: '1px solid #EDE8E2',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Shield size={20} color="#E85D2A" strokeWidth={1.8} />
        <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Identity Document</span>
      </div>
      <div
        className="pro-tap"
        onClick={() => onChange({ ...data, idUploaded: !data.idUploaded })}
        style={{
          border: `2px dashed ${data.idUploaded ? '#E85D2A' : '#EDE8E2'}`,
          borderRadius: 16, padding: '28px 20px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
          background: data.idUploaded ? 'rgba(232,93,42,0.08)' : '#FFFFFF',
          transition: 'all 200ms ease',
        }}
      >
        {data.idUploaded ? (
          <>
            <Check size={28} color="#E85D2A" strokeWidth={2} />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#E85D2A' }}>Document uploaded</span>
          </>
        ) : (
          <>
            <Camera size={28} color="#A09A94" strokeWidth={1.5} />
            <span style={{ fontSize: 14, fontWeight: 500, color: '#A09A94' }}>Tap to upload ID or passport</span>
          </>
        )}
      </div>
    </div>

    {/* Background Check */}
    <div style={{
      background: '#F3EFEB', borderRadius: 20, padding: 20,
      border: '1px solid #EDE8E2',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ flex: 1, paddingRight: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Background Check</div>
        <div style={{ fontSize: 13, color: '#A09A94', marginTop: 2, lineHeight: 1.4 }}>
          I consent to a background check
        </div>
      </div>
      <div
        className="pro-tap"
        onClick={() => onChange({ ...data, backgroundCheck: !data.backgroundCheck })}
        style={{
          width: 52, height: 30, borderRadius: 15,
          background: data.backgroundCheck ? '#E85D2A' : '#EDE8E2',
          padding: 3, flexShrink: 0,
          transition: 'background 200ms ease',
        }}
      >
        <div style={{
          width: 24, height: 24, borderRadius: 12, background: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
          transform: data.backgroundCheck ? 'translateX(22px)' : 'translateX(0)',
          transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)',
        }} />
      </div>
    </div>

    {/* Terms */}
    <div
      className="pro-tap"
      onClick={() => onChange({ ...data, termsAccepted: !data.termsAccepted })}
      style={{
        background: '#F3EFEB', borderRadius: 20, padding: 20,
        border: '1px solid #EDE8E2',
        display: 'flex', alignItems: 'center', gap: 14,
      }}
    >
      <div style={{
        width: 24, height: 24, borderRadius: 8,
        border: `2px solid ${data.termsAccepted ? '#E85D2A' : '#EDE8E2'}`,
        background: data.termsAccepted ? '#E85D2A' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'all 200ms ease',
      }}>
        {data.termsAccepted && <Check size={14} color="#FFFFFF" strokeWidth={2.5} />}
      </div>
      <div style={{ fontSize: 14, color: '#6E6058', lineHeight: 1.4 }}>
        I agree to the <span style={{ color: '#E85D2A', fontWeight: 600 }}>Terms of Service</span>{' '}
        and <span style={{ color: '#E85D2A', fontWeight: 600 }}>Privacy Policy</span>
      </div>
    </div>
  </div>
);

// ─── STEP 6: SUBMITTED ───────────────────────────────────────────────────────
const StepSubmitted = () => (
  <div className="pro-reg-fade" style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    textAlign: 'center', flex: 1, padding: '40px 20px', gap: 20,
  }}>
    {/* Animated check with ring pulse */}
    <div style={{ position: 'relative', width: 88, height: 88 }}>
      <div style={{
        position: 'absolute', inset: 0, borderRadius: '50%',
        border: '2px solid #E85D2A',
        animation: 'ringPulse 1.5s ease-out infinite',
      }} />
      <div style={{
        width: 88, height: 88, borderRadius: '50%',
        background: 'rgba(232,93,42,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: '#E85D2A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'checkPop 0.5s ease forwards',
          boxShadow: '0 6px 24px rgba(232,93,42,0.3)',
        }}>
          <Check size={30} color="#FFFFFF" strokeWidth={2.5} />
        </div>
      </div>
    </div>

    <div>
      <h2 style={{ fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 8 }}>
        Application Submitted
      </h2>
      <p style={{ fontSize: 15, color: '#A09A94', lineHeight: 1.6, maxWidth: 280 }}>
        We'll review your application and get back to you within 48 hours. You'll receive a notification once approved.
      </p>
    </div>

    <div style={{
      padding: '14px 20px', borderRadius: 16,
      background: 'rgba(232,93,42,0.08)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <Clock size={18} color="#E85D2A" strokeWidth={1.8} />
      <span style={{ fontSize: 14, fontWeight: 600, color: '#E85D2A' }}>Review time: ~48 hours</span>
    </div>

    <div
      className="pro-tap"
      onClick={() => { window.location.href = '/pro-dashboard'; }}
      style={{
        marginTop: 8, width: '100%', padding: '16px 0', borderRadius: 14,
        background: '#111',
        color: '#FFFFFF', fontSize: 16, fontWeight: 600, textAlign: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}
    >
      Go to Dashboard
      <ArrowRight size={18} color="#FFFFFF" strokeWidth={2} />
    </div>
  </div>
);

// ─── PROGRESS BAR ───────────────────────────────────────────────────────────
const ProgressBar = ({ step, total }) => {
  const pct = ((step + 1) / total) * 100;
  return (
    <div style={{
      width: '100%', height: 4, background: '#EDE8E2',
      borderRadius: 9999, overflow: 'hidden', position: 'relative',
    }}>
      <div style={{
        height: '100%', width: `${pct}%`,
        background: '#E85D2A',
        borderRadius: 9999,
        transition: 'width 300ms cubic-bezier(0.34,1.56,0.64,1)',
      }} />
    </div>
  );
};

// ─── STEP INDICATOR DOTS ────────────────────────────────────────────────────
const StepDots = ({ step, total }) => (
  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: i === step ? 22 : 6,
          height: 6, borderRadius: 3,
          background: i === step
            ? '#E85D2A'
            : i < step ? '#E85D2A' : '#EDE8E2',
          opacity: i < step && i !== step ? 0.4 : 1,
          transition: 'all 300ms cubic-bezier(0.34,1.56,0.64,1)',
        }}
      />
    ))}
  </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Screen_50_PRO_REGISTRATION_v1() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState(null);
  const [personal, setPersonal] = useState({ name: '', phone: '', email: '', location: '' });
  const [experience, setExperience] = useState({ experience: '', bio: '', hasCertifications: false });
  const [services, setServices] = useState({ services: null, availableDays: [] });
  const [verify, setVerify] = useState({ idUploaded: false, backgroundCheck: false, termsAccepted: false });

  const TOTAL_STEPS = 6;

  const canProceed = () => {
    switch (step) {
      case 0: return !!role;
      case 1: return personal.name && personal.email;
      case 2: return !!experience.experience;
      case 3: return (services.availableDays || []).length > 0;
      case 4: return verify.idUploaded && verify.backgroundCheck && verify.termsAccepted;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1 && canProceed()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0 && step < TOTAL_STEPS - 1) setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <StepRole selected={role} onSelect={setRole} />;
      case 1: return <StepPersonal data={personal} onChange={setPersonal} />;
      case 2: return <StepExperience data={experience} onChange={setExperience} />;
      case 3: return <StepServices role={role || 'walker'} data={services} onChange={setServices} />;
      case 4: return <StepVerify data={verify} onChange={setVerify} />;
      case 5: return <StepSubmitted />;
      default: return null;
    }
  };

  return (
    <div className="pro-reg" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#F7F5F2', padding: 20,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{
        width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
        overflow: 'hidden', backgroundColor: '#F7F5F2',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 9999 }} />

        {/* Status Bar */}
        <StatusBar />

        {/* Floating Header */}
        {step < TOTAL_STEPS - 1 && (
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <button
                onClick={step > 0 ? handleBack : () => { window.history.back(); }}
                className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all duration-[120ms]"
                style={{ background: '#F3EFEB', border: 'none' }}
              >
                <ChevronLeft size={22} color="#111" />
              </button>
              <h2 className="text-[17px] font-semibold" style={{ color: '#111' }}>Step {step + 1} of {TOTAL_STEPS - 1}</h2>
              <div className="w-[44px]" />
            </div>
          </header>
        )}

        {/* Spacer */}
        <div style={{ height: 100, flexShrink: 0 }} />

        {/* Progress bar */}
        <div style={{ padding: '0 20px', flexShrink: 0 }}>
          <ProgressBar step={step} total={TOTAL_STEPS} />
        </div>

        {/* Scrollable Content */}
        <div className="pro-reg-scroll" style={{
          flex: 1, overflowY: 'auto', padding: '12px 20px 20px',
          display: 'flex', flexDirection: 'column',
        }}>
          {renderStep()}
        </div>

        {/* Bottom navigation */}
        {step < TOTAL_STEPS - 1 && (
          <div style={{
            padding: '12px 20px 16px', flexShrink: 0,
            display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center',
          }}>
            <StepDots step={step} total={TOTAL_STEPS - 1} />
            <div
              className="pro-tap"
              onClick={handleNext}
              style={{
                width: '100%', padding: '16px 0', borderRadius: 14,
                background: canProceed() ? '#111' : '#EDE8E2',
                color: canProceed() ? '#FFFFFF' : '#A09A94',
                fontSize: 16, fontWeight: 600, textAlign: 'center',
                cursor: canProceed() ? 'pointer' : 'default',
                transition: 'all 200ms ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: canProceed() ? '0 4px 20px rgba(0,0,0,0.12)' : 'none',
              }}
            >
              {step === TOTAL_STEPS - 2 ? 'Submit Application' : 'Continue'}
              {step < TOTAL_STEPS - 2 && <ArrowRight size={18} color={canProceed() ? '#FFFFFF' : '#A09A94'} strokeWidth={2} />}
              {step === TOTAL_STEPS - 2 && <Check size={18} color={canProceed() ? '#FFFFFF' : '#A09A94'} strokeWidth={2} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
