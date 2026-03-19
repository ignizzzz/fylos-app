import React, { useState, useEffect } from 'react';
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Plus,
  PawPrint,
  Heart,
  Calendar,
  Star,
  Info,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Circle
} from 'lucide-react';

/**
 * 37_ADD_PET_v1.jsx
 * Add Pet – multi-step form flow
 * Steps: Pet Type → Basic Info → Details → Photo → Confirmation
 * Follows Fylos Design System exactly
 */

// ── THEME ──────────────────────────────────────────────
const THEME = {
  colors: {
    accent: '#E85D2A',
    accentHover: '#D04A1C',
    primaryText: '#111111',
    secondaryText: '#6E6E73',
    tertiaryText: '#8E8E93',
    background: '#F9F9FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F2F7',
    danger: '#FF3B30',
    success: '#00C060',
    warning: '#FF9500',
    info: '#007AFF',
    divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)',
    active: '0 8px 30px rgba(0,0,0,0.06)'
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

// ── GLOBAL STYLES ──────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');

    .font-brand { font-family: 'Nunito', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }

    @keyframes ap-fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes ap-slideRight {
      from { transform: translateX(40px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes ap-slideUp {
      from { transform: translateY(16px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes ap-scaleIn {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes ap-checkPop {
      0% { transform: scale(0); }
      60% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    @keyframes ap-float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    .ap-fade { animation: ap-fadeIn 0.4s ease-out forwards; }
    .ap-slideRight { animation: ap-slideRight 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .ap-slideUp { animation: ap-slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .ap-scaleIn { animation: ap-scaleIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .ap-checkPop { animation: ap-checkPop 0.4s ${THEME.motion.spring} forwards; }
    .ap-float { animation: ap-float 2.5s ease-in-out infinite; }

    .ap-input {
      height: 52px;
      border-radius: 16px;
      border: 1px solid rgba(0,0,0,0.08);
      background: ${THEME.colors.surface};
      padding: 0 16px;
      font-size: 16px;
      font-family: 'Inter', sans-serif;
      color: ${THEME.colors.primaryText};
      transition: border-color 200ms, box-shadow 200ms;
      width: 100%;
      outline: none;
    }
    .ap-input::placeholder {
      color: ${THEME.colors.tertiaryText};
    }
    .ap-input:focus {
      border-color: ${THEME.colors.accent};
      box-shadow: 0 0 0 4px rgba(232,93,42,0.1);
    }

    .ap-btn:active {
      transform: scale(0.97);
    }

    .ap-card {
      background: ${THEME.colors.surface};
      border-radius: 20px;
      padding: 20px;
      box-shadow: ${THEME.shadows.soft};
      border: 1px solid rgba(0,0,0,0.03);
    }
  `}</style>
);

// ── FYLOS LOGO ─────────────────────────────────────────
const FylosLogo = ({ textColor = '#000', dotColor = '#E85D2A', fontSize = '2rem' }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `calc(${fontSize} * 0.15)`, fontFamily: '"Nunito", sans-serif' }}>
    <span style={{ fontSize, fontWeight: 800, color: textColor, letterSpacing: '-0.5px', lineHeight: 1 }}>FYLOS</span>
    <div style={{ width: `calc(${fontSize} * 0.25)`, height: `calc(${fontSize} * 0.25)`, borderRadius: '50%', backgroundColor: dotColor }} />
  </div>
);

// ── MOCK DATA ──────────────────────────────────────────
const PET_TYPES = [
  { id: 'dog', label: 'Dog', emoji: '\u{1F415}' },
  { id: 'cat', label: 'Cat', emoji: '\u{1F408}' },
  { id: 'other', label: 'Other', emoji: '\u{1F43E}' },
];

const DOG_BREEDS = [
  'Golden Retriever', 'Labrador', 'German Shepherd', 'French Bulldog',
  'Poodle', 'Beagle', 'Rottweiler', 'Husky', 'Border Collie',
  'Dachshund', 'Boxer', 'Cocker Spaniel', 'Shih Tzu', 'Mixed Breed'
];

const CAT_BREEDS = [
  'British Shorthair', 'Maine Coon', 'Persian', 'Ragdoll', 'Siamese',
  'Bengal', 'Scottish Fold', 'Sphynx', 'Russian Blue', 'Mixed Breed'
];

const PET_COLORS = ['Black', 'White', 'Brown', 'Golden', 'Gray', 'Cream', 'Spotted', 'Brindle'];

const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop&crop=faces',
  'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=300&h=300&fit=crop&crop=faces',
];

// ── PROGRESS BAR (thin accent line at top) ─────────────
const ProgressBar = ({ current, total }) => (
  <div style={{ width: '100%', height: 3, background: THEME.colors.surfaceAlt, borderRadius: 2 }}>
    <div
      style={{
        height: '100%',
        width: `${((current + 1) / total) * 100}%`,
        background: `linear-gradient(90deg, #FF7240, ${THEME.colors.accent})`,
        borderRadius: 2,
        transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    />
  </div>
);

// ── STEP INDICATOR DOTS ────────────────────────────────
const StepDots = ({ current, total }) => (
  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        style={{
          width: i === current ? 20 : 6,
          height: 6,
          borderRadius: 3,
          background: i === current ? THEME.colors.accent : THEME.colors.divider,
          transition: 'all 300ms ease'
        }}
      />
    ))}
  </div>
);

// ── HEADER ─────────────────────────────────────────────
const Header = ({ step, totalSteps, onBack, onCancel }) => (
  <div style={{ background: '#F9F9FB' }}>
    <ProgressBar current={step} total={totalSteps} />
    <div style={{ paddingTop: 12, paddingBottom: 12, paddingLeft: 20, paddingRight: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onBack}
          className="ap-btn"
          style={{
            width: 40, height: 40, borderRadius: THEME.radius.full,
            background: THEME.colors.surfaceAlt, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: step === 0 ? 0 : 1, pointerEvents: step === 0 ? 'none' : 'auto',
            transition: `opacity ${THEME.motion.fade}`
          }}
        >
          <ChevronLeft size={20} color={THEME.colors.primaryText} />
        </button>
        <StepDots current={step} total={totalSteps} />
        <button
          onClick={onCancel}
          className="ap-btn"
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 15, fontWeight: 500, color: THEME.colors.secondaryText,
            fontFamily: 'Inter, sans-serif'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

// ── PRIMARY BUTTON ─────────────────────────────────────
const PrimaryButton = ({ children, onClick, disabled, icon: Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="ap-btn"
    style={{
      width: '100%', height: 56, borderRadius: THEME.radius.medium,
      background: disabled ? THEME.colors.surfaceAlt : 'linear-gradient(135deg, #FF7240, #E85D2A)',
      color: disabled ? THEME.colors.tertiaryText : '#FFFFFF',
      border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 16, fontWeight: 600, fontFamily: 'Inter, sans-serif',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      transition: `all ${THEME.motion.fade}`,
      boxShadow: disabled ? 'none' : '0 8px 24px rgba(232,93,42,0.25)'
    }}
  >
    {children}
    {Icon && <Icon size={18} strokeWidth={2.5} />}
  </button>
);

// ── SECTION LABEL ──────────────────────────────────────
const SectionLabel = ({ children, optional }) => (
  <div style={{ marginBottom: 8 }}>
    <span style={{
      fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: THEME.colors.tertiaryText,
      fontFamily: 'Inter, sans-serif'
    }}>
      {children}
    </span>
    {optional && (
      <span style={{ fontSize: 11, fontWeight: 400, color: THEME.colors.tertiaryText, marginLeft: 6, textTransform: 'none', letterSpacing: 0 }}>
        (optional)
      </span>
    )}
  </div>
);

// ── TOGGLE ─────────────────────────────────────────────
const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className="ap-btn"
    style={{
      width: 50, height: 30, borderRadius: THEME.radius.full,
      background: value ? THEME.colors.accent : THEME.colors.surfaceAlt,
      border: 'none', cursor: 'pointer', position: 'relative',
      transition: `background ${THEME.motion.fade}`
    }}
  >
    <div style={{
      width: 24, height: 24, borderRadius: '50%', background: '#FFF',
      position: 'absolute', top: 3,
      left: value ? 23 : 3,
      transition: `left ${THEME.motion.fade}`,
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
    }} />
  </button>
);

// ══════════════════════════════════════════════════════════
// STEP 1 – Pet Type Selector
// ══════════════════════════════════════════════════════════
const StepPetType = ({ petType, onSelect, onNext }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ flex: 1, padding: '0 24px', paddingTop: 16, overflow: 'auto', paddingBottom: 120 }}>
      <div className="ap-slideUp" style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: THEME.colors.primaryText, margin: 0, fontFamily: 'Inter, sans-serif' }}>
          What kind of pet?
        </h1>
        <p style={{ fontSize: 15, color: THEME.colors.secondaryText, opacity: 0.9, marginTop: 6, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
          Choose your companion type
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PET_TYPES.map((type, i) => {
          const selected = petType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => onSelect(type.id)}
              className="ap-btn ap-slideRight"
              style={{
                animationDelay: `${i * 0.06}s`, opacity: 0,
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '20px 24px', borderRadius: 20,
                background: THEME.colors.surface,
                border: selected ? `2px solid ${THEME.colors.accent}` : '1px solid rgba(0,0,0,0.03)',
                boxShadow: selected ? THEME.shadows.active : THEME.shadows.soft,
                cursor: 'pointer', textAlign: 'left',
                transition: `all ${THEME.motion.fade}`, position: 'relative'
              }}
            >
              <span style={{ fontSize: 36 }}>{type.emoji}</span>
              <span style={{ fontSize: 16, fontWeight: 500, color: THEME.colors.primaryText, fontFamily: 'Inter, sans-serif', letterSpacing: '-0.01em' }}>
                {type.label}
              </span>
              {selected && (
                <div className="ap-checkPop" style={{
                  position: 'absolute', right: 20, width: 28, height: 28,
                  borderRadius: '50%', background: THEME.colors.accent,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Check size={14} color="#FFF" strokeWidth={3} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 40px', background: 'linear-gradient(transparent, #F9F9FB 20%)' }}>
      <PrimaryButton onClick={onNext} disabled={!petType} icon={ArrowRight}>
        Continue
      </PrimaryButton>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════
// STEP 2 – Basic Info
// ══════════════════════════════════════════════════════════
const StepBasicInfo = ({ petType, info, onChange, onNext }) => {
  const breeds = petType === 'dog' ? DOG_BREEDS : petType === 'cat' ? CAT_BREEDS : [];
  const isValid = info.name && info.name.trim().length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, padding: '0 24px', paddingTop: 16, overflow: 'auto', paddingBottom: 120 }}>
        <div className="ap-slideUp" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: THEME.colors.primaryText, margin: 0, fontFamily: 'Inter, sans-serif' }}>
            Basic information
          </h1>
          <p style={{ fontSize: 15, color: THEME.colors.secondaryText, opacity: 0.9, marginTop: 6, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
            Tell us about your {petType}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Name */}
          <div className="ap-slideUp" style={{ animationDelay: '0.05s', opacity: 0 }}>
            <SectionLabel>Name</SectionLabel>
            <input
              type="text"
              placeholder="What's their name?"
              value={info.name}
              onChange={(e) => onChange({ ...info, name: e.target.value })}
              className="ap-input"
            />
          </div>

          {/* Breed pills */}
          {breeds.length > 0 && (
            <div className="ap-slideUp" style={{ animationDelay: '0.1s', opacity: 0 }}>
              <SectionLabel>Breed</SectionLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {breeds.map(breed => {
                  const selected = info.breed === breed;
                  return (
                    <button
                      key={breed}
                      onClick={() => onChange({ ...info, breed })}
                      className="ap-btn"
                      style={{
                        padding: '8px 16px', borderRadius: THEME.radius.full,
                        fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                        border: selected ? `1.5px solid ${THEME.colors.accent}` : '1px solid rgba(0,0,0,0.06)',
                        background: selected ? 'rgba(232,93,42,0.08)' : THEME.colors.surface,
                        color: selected ? THEME.colors.accent : THEME.colors.secondaryText,
                        cursor: 'pointer', transition: `all ${THEME.motion.fade}`
                      }}
                    >
                      {breed}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Birthdate */}
          <div className="ap-slideUp" style={{ animationDelay: '0.15s', opacity: 0 }}>
            <SectionLabel optional>Birthdate or age</SectionLabel>
            <div style={{ position: 'relative' }}>
              <Calendar size={18} color={THEME.colors.tertiaryText} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              <input
                type="date"
                value={info.birthday}
                onChange={(e) => onChange({ ...info, birthday: e.target.value })}
                className="ap-input"
                style={{ paddingLeft: 44 }}
              />
            </div>
          </div>

          {/* Gender */}
          <div className="ap-slideUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <SectionLabel>Gender</SectionLabel>
            <div style={{ display: 'flex', gap: 12 }}>
              {['Male', 'Female'].map(g => {
                const selected = info.gender === g;
                return (
                  <button
                    key={g}
                    onClick={() => onChange({ ...info, gender: g })}
                    className="ap-btn"
                    style={{
                      flex: 1, height: 48, borderRadius: THEME.radius.medium,
                      background: selected ? THEME.colors.surface : THEME.colors.surface,
                      border: selected ? `1.5px solid ${THEME.colors.accent}` : '1px solid rgba(0,0,0,0.06)',
                      color: selected ? THEME.colors.accent : THEME.colors.primaryText,
                      fontSize: 15, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                      cursor: 'pointer', transition: `all ${THEME.motion.fade}`,
                      boxShadow: selected ? '0 2px 12px rgba(232,93,42,0.1)' : 'none'
                    }}
                  >
                    {g === 'Male' ? '\u2642' : '\u2640'} {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 40px', background: 'linear-gradient(transparent, #F9F9FB 20%)' }}>
        <PrimaryButton onClick={onNext} disabled={!isValid} icon={ArrowRight}>
          Continue
        </PrimaryButton>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// STEP 3 – Details (Weight, Color, Microchip, Neutered)
// ══════════════════════════════════════════════════════════
const StepDetails = ({ info, onChange, onNext }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ flex: 1, padding: '0 24px', paddingTop: 16, overflow: 'auto', paddingBottom: 120 }}>
      <div className="ap-slideUp" style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: THEME.colors.primaryText, margin: 0, fontFamily: 'Inter, sans-serif' }}>
          A few more details
        </h1>
        <p style={{ fontSize: 15, color: THEME.colors.secondaryText, opacity: 0.9, marginTop: 6, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
          All optional — add what you know
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Weight */}
        <div className="ap-slideUp" style={{ animationDelay: '0.05s', opacity: 0 }}>
          <SectionLabel optional>Weight (kg)</SectionLabel>
          <input
            type="number"
            placeholder="e.g. 12"
            value={info.weight}
            onChange={(e) => onChange({ ...info, weight: e.target.value })}
            className="ap-input"
          />
        </div>

        {/* Color */}
        <div className="ap-slideUp" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <SectionLabel optional>Color</SectionLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {PET_COLORS.map(color => {
              const selected = info.color === color;
              return (
                <button
                  key={color}
                  onClick={() => onChange({ ...info, color })}
                  className="ap-btn"
                  style={{
                    padding: '8px 16px', borderRadius: THEME.radius.full,
                    fontSize: 13, fontWeight: 500, fontFamily: 'Inter, sans-serif',
                    border: selected ? `1.5px solid ${THEME.colors.accent}` : '1px solid rgba(0,0,0,0.06)',
                    background: selected ? 'rgba(232,93,42,0.08)' : THEME.colors.surface,
                    color: selected ? THEME.colors.accent : THEME.colors.secondaryText,
                    cursor: 'pointer', transition: `all ${THEME.motion.fade}`
                  }}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>

        {/* Microchip */}
        <div className="ap-slideUp" style={{ animationDelay: '0.15s', opacity: 0 }}>
          <SectionLabel optional>Microchip number</SectionLabel>
          <input
            type="text"
            placeholder="e.g. 756 0000 0000 000"
            value={info.microchip}
            onChange={(e) => onChange({ ...info, microchip: e.target.value })}
            className="ap-input"
          />
          <p style={{ fontSize: 13, color: THEME.colors.tertiaryText, opacity: 0.8, marginTop: 6, fontFamily: 'Inter, sans-serif' }}>
            Stored securely in your Vault
          </p>
        </div>

        {/* Neutered toggle */}
        <div className="ap-slideUp" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="ap-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: 15, fontWeight: 500, color: THEME.colors.primaryText, fontFamily: 'Inter, sans-serif' }}>
                Neutered / Spayed
              </span>
              <p style={{ fontSize: 13, color: THEME.colors.tertiaryText, marginTop: 2, fontFamily: 'Inter, sans-serif' }}>
                Has your pet been neutered?
              </p>
            </div>
            <Toggle value={info.neutered} onChange={(v) => onChange({ ...info, neutered: v })} />
          </div>
        </div>
      </div>
    </div>

    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 40px', background: 'linear-gradient(transparent, #F9F9FB 20%)' }}>
      <PrimaryButton onClick={onNext} icon={ArrowRight}>
        Continue
      </PrimaryButton>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════
// STEP 4 – Photo
// ══════════════════════════════════════════════════════════
const StepPhoto = ({ petName, photo, onPhotoSelect, onNext }) => (
  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div style={{ flex: 1, padding: '0 24px', paddingTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingBottom: 120 }}>
      <div className="ap-slideUp" style={{ textAlign: 'center', marginBottom: 32 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: THEME.colors.primaryText, margin: 0, fontFamily: 'Inter, sans-serif' }}>
          Add a photo
        </h1>
        <p style={{ fontSize: 15, color: THEME.colors.secondaryText, opacity: 0.9, marginTop: 6, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
          Show off {petName}'s adorable face
        </p>
      </div>

      <div className="ap-scaleIn" style={{ position: 'relative', marginBottom: 24 }}>
        {photo ? (
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 160, height: 160, borderRadius: '50%', overflow: 'hidden',
              boxShadow: THEME.shadows.floating
            }}>
              <img src={photo} alt={petName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button
              onClick={() => onPhotoSelect(null)}
              className="ap-btn"
              style={{
                position: 'absolute', top: 0, right: 0,
                width: 32, height: 32, borderRadius: '50%',
                background: THEME.colors.primaryText, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: THEME.shadows.floating
              }}
            >
              <X size={14} color="#FFF" strokeWidth={3} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onPhotoSelect(SAMPLE_PHOTOS[0])}
            className="ap-btn"
            style={{
              width: 160, height: 160, borderRadius: '50%',
              border: `2px dashed ${THEME.colors.divider}`,
              background: THEME.colors.surfaceAlt,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, cursor: 'pointer', transition: `all ${THEME.motion.fade}`
            }}
          >
            <Camera size={28} color={THEME.colors.tertiaryText} strokeWidth={1.5} />
            <span style={{ fontSize: 13, color: THEME.colors.tertiaryText, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>
              Tap to add
            </span>
          </button>
        )}
      </div>

      {/* Sample picks for demo */}
      {!photo && (
        <div className="ap-fade" style={{ animationDelay: '0.3s', opacity: 0, textAlign: 'center' }}>
          <p style={{ fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: THEME.colors.tertiaryText, marginBottom: 12, fontFamily: 'Inter, sans-serif' }}>
            Or choose a sample
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {SAMPLE_PHOTOS.map((src, i) => (
              <button
                key={i}
                onClick={() => onPhotoSelect(src)}
                className="ap-btn"
                style={{
                  width: 56, height: 56, borderRadius: 16, overflow: 'hidden',
                  border: '2px solid transparent', cursor: 'pointer', padding: 0
                }}
              >
                <img src={src} alt="Sample" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>

    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 40px', background: 'linear-gradient(transparent, #F9F9FB 20%)' }}>
      <PrimaryButton onClick={onNext} icon={ArrowRight}>
        {photo ? 'Continue' : 'Skip for now'}
      </PrimaryButton>
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════
// STEP 5 – Confirmation Summary
// ══════════════════════════════════════════════════════════
const StepConfirmation = ({ info, petType, photo, onFinish }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); }, []);

  const SummaryRow = ({ label, value }) => {
    if (!value) return null;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${THEME.colors.surfaceAlt}` }}>
        <span style={{ fontSize: 13, color: THEME.colors.secondaryText, fontFamily: 'Inter, sans-serif' }}>{label}</span>
        <span style={{ fontSize: 15, fontWeight: 500, color: THEME.colors.primaryText, fontFamily: 'Inter, sans-serif' }}>{value}</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, padding: '0 24px', paddingTop: 16, overflow: 'auto', paddingBottom: 120 }}>
        <div className="ap-slideUp" style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', color: THEME.colors.primaryText, margin: 0, fontFamily: 'Inter, sans-serif' }}>
            Looking good!
          </h1>
          <p style={{ fontSize: 15, color: THEME.colors.secondaryText, opacity: 0.9, marginTop: 6, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
            Review {info.name}'s profile
          </p>
        </div>

        {/* Avatar */}
        <div className="ap-scaleIn" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 96, height: 96, borderRadius: '50%', overflow: 'hidden',
              boxShadow: THEME.shadows.floating
            }}>
              {photo ? (
                <img src={photo} alt={info.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, #FF7240, #E85D2A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <PawPrint size={36} color="#FFF" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="ap-checkPop" style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 32, height: 32, borderRadius: '50%',
              background: THEME.colors.surface, boxShadow: THEME.shadows.soft,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Heart size={16} fill={THEME.colors.accent} color={THEME.colors.accent} />
            </div>
          </div>
        </div>

        {/* Summary card */}
        <div
          className="ap-card ap-slideUp"
          style={{
            animationDelay: '0.1s', opacity: 0,
            transition: `all 500ms`,
            ...(show ? { opacity: 1 } : {})
          }}
        >
          <SummaryRow label="Type" value={petType ? petType.charAt(0).toUpperCase() + petType.slice(1) : ''} />
          <SummaryRow label="Name" value={info.name} />
          <SummaryRow label="Breed" value={info.breed} />
          <SummaryRow label="Gender" value={info.gender} />
          <SummaryRow label="Birthday" value={info.birthday} />
          <SummaryRow label="Weight" value={info.weight ? `${info.weight} kg` : ''} />
          <SummaryRow label="Color" value={info.color} />
          <SummaryRow label="Microchip" value={info.microchip} />
          <SummaryRow label="Neutered" value={info.neutered ? 'Yes' : info.neutered === false ? 'No' : ''} />
        </div>

        <p style={{
          fontSize: 13, color: THEME.colors.tertiaryText, textAlign: 'center',
          marginTop: 16, lineHeight: 1.5, fontFamily: 'Inter, sans-serif', opacity: 0.8
        }}>
          You can always update this later
        </p>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px 24px 40px', background: 'linear-gradient(transparent, #F9F9FB 20%)' }}>
        <PrimaryButton onClick={onFinish} icon={Check}>
          Add Pet
        </PrimaryButton>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════
// MAIN – Add Pet Flow
// ══════════════════════════════════════════════════════════
const AddPetFlow = () => {
  const [step, setStep] = useState(0);
  const [petType, setPetType] = useState(null);
  const [info, setInfo] = useState({
    name: '', breed: '', gender: '', birthday: '', weight: '',
    color: '', microchip: '', neutered: false
  });
  const [photo, setPhoto] = useState(null);
  const [slideKey, setSlideKey] = useState(0);

  const TOTAL_STEPS = 5;

  const goNext = (nextStep) => {
    setSlideKey(k => k + 1);
    setStep(nextStep);
  };

  const goBack = () => {
    if (step > 0) {
      setSlideKey(k => k + 1);
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepPetType petType={petType} onSelect={setPetType} onNext={() => goNext(1)} />;
      case 1:
        return <StepBasicInfo petType={petType} info={info} onChange={setInfo} onNext={() => goNext(2)} />;
      case 2:
        return <StepDetails info={info} onChange={setInfo} onNext={() => goNext(3)} />;
      case 3:
        return <StepPhoto petName={info.name || 'your pet'} photo={photo} onPhotoSelect={setPhoto} onNext={() => goNext(4)} />;
      case 4:
        return <StepConfirmation info={info} petType={petType} photo={photo} onFinish={() => { window.location.href = '/'; }} />;
      default:
        return null;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
        {/* iPhone Frame */}
        <div
          className="relative"
          style={{
            width: 390,
            height: 844,
            borderRadius: 50,
            border: '8px solid #000',
            overflow: 'hidden',
            backgroundColor: '#F9F9FB',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}
        >
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#111"/>
                <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#111"/>
                <rect x="9" y="2" width="3" height="10" rx="0.5" fill="#111"/>
                <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#111"/>
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#111"/>
                <path d="M4.93 7.83a4.38 4.38 0 016.14 0" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M2.4 5.3a7.88 7.88 0 0111.2 0" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
                <rect x="0.5" y="0.5" width="22" height="12" rx="2.5" stroke="#111" strokeOpacity="0.35"/>
                <rect x="2" y="2" width="19" height="9" rx="1.5" fill="#111"/>
                <path d="M24 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/>
              </svg>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="absolute inset-0 overflow-y-auto" style={{ paddingTop: 54, paddingBottom: 40 }}>
            {/* Progress bar + step dots (below floating header) */}
            <div style={{ paddingTop: 44 }}>
              <ProgressBar current={step} total={TOTAL_STEPS} />
              <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 8 }}>
                <StepDots current={step} total={TOTAL_STEPS} />
              </div>
            </div>

            {/* Step Content */}
            <div key={slideKey} style={{ width: '100%', height: 'calc(100vh - 200px)', position: 'relative' }}>
              {renderStep()}
            </div>
          </div>

          {/* Floating Header */}
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              {/* Left: Back button */}
              <button
                onClick={step === 0 ? () => { window.history.back(); } : goBack}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              >
                <ChevronLeft size={22} color="#111111" />
              </button>
              {/* Center: Title */}
              <h2 className="text-[17px] font-semibold text-[#111111]">Add Pet</h2>
              {/* Right: Cancel text button */}
              <button
                onClick={() => { window.history.back(); }}
                className="h-[44px] px-4 flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms] text-[15px] font-semibold text-[#E85D2A]"
              >
                Cancel
              </button>
            </div>
          </header>
        </div>
      </div>
    </>
  );
};

export default AddPetFlow;
