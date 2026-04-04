import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, ArrowRight, Check, X, Search } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   37 — ADD PET v1  ·  10/10 polish
   Warm, personality-rich pet onboarding with reactive mascot,
   rich illustrations, scroll-linked effects, micro-interactions
   ═══════════════════════════════════════════════════════ */

const PET_TYPES = [
  { id: 'dog', label: 'Dog', desc: 'Loyal companion' },
  { id: 'cat', label: 'Cat', desc: 'Independent spirit' },
  { id: 'other', label: 'Other', desc: 'Unique friend' },
];

const DOG_BREEDS = [
  'Golden Retriever', 'Labrador', 'German Shepherd', 'French Bulldog',
  'Poodle', 'Beagle', 'Husky', 'Border Collie', 'Dachshund',
  'Boxer', 'Cocker Spaniel', 'Shih Tzu', 'Mixed Breed',
];
const CAT_BREEDS = [
  'British Shorthair', 'Maine Coon', 'Persian', 'Ragdoll', 'Siamese',
  'Bengal', 'Scottish Fold', 'Sphynx', 'Russian Blue', 'Mixed Breed',
];

const PET_COLORS = {
  dog: ['Black', 'White', 'Brown', 'Golden', 'Cream', 'Grey', 'Red', 'Brindle', 'Merle', 'Spotted', 'Tricolor'],
  cat: ['Black', 'White', 'Orange', 'Grey', 'Cream', 'Brown', 'Calico', 'Tabby', 'Tortoiseshell', 'Tuxedo', 'Spotted'],
  other: ['Black', 'White', 'Brown', 'Grey', 'Mixed'],
};

const DEMO_PHOTO = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=300&fit=crop&crop=faces';

/* ── Rich Pet Type Illustrations for Step 1 cards ── */
const PetTypeIllustration = ({ type, selected }) => {
  const primary = selected ? '#E85D2A' : '#C4BBB3';
  const secondary = selected ? '#FF7240' : '#D5CEC7';
  const bg = selected ? 'rgba(232,93,42,0.06)' : 'rgba(0,0,0,0.02)';

  if (type === 'dog') return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      {/* Body warmth glow */}
      <circle cx="24" cy="26" r="18" fill={bg} />
      {/* Floppy ears */}
      <ellipse cx="12" cy="14" rx="6" ry="10" fill={primary} opacity="0.35"
               style={{ transform: 'rotate(-18deg)', transformOrigin: '12px 18px',
                        animation: selected ? 'ap-earWag 2s ease-in-out infinite' : 'none' }} />
      <ellipse cx="36" cy="14" rx="6" ry="10" fill={primary} opacity="0.35"
               style={{ transform: 'rotate(18deg)', transformOrigin: '36px 18px',
                        animation: selected ? 'ap-earWag 2s 0.15s ease-in-out infinite' : 'none' }} />
      {/* Inner ear */}
      <ellipse cx="12" cy="14" rx="3.5" ry="6.5" fill={secondary} opacity="0.35"
               style={{ transform: 'rotate(-18deg)', transformOrigin: '12px 18px' }} />
      <ellipse cx="36" cy="14" rx="3.5" ry="6.5" fill={secondary} opacity="0.35"
               style={{ transform: 'rotate(18deg)', transformOrigin: '36px 18px' }} />
      {/* Head */}
      <circle cx="24" cy="24" r="14" fill={primary} opacity="0.22" />
      {/* Muzzle */}
      <ellipse cx="24" cy="27" rx="8" ry="6.5" fill={primary} opacity="0.15" />
      {/* Eyes */}
      <circle cx="19" cy="22" r="2.5" fill={primary} opacity="0.75" />
      <circle cx="29" cy="22" r="2.5" fill={primary} opacity="0.75" />
      <circle cx="19.8" cy="21.3" r="0.9" fill="#FFF" opacity="0.8" />
      <circle cx="29.8" cy="21.3" r="0.9" fill="#FFF" opacity="0.8" />
      {/* Nose */}
      <ellipse cx="24" cy="26" rx="2.5" ry="1.8" fill={primary} opacity="0.85" />
      {/* Mouth */}
      <path d="M21 28.5 Q24 31.5 27 28.5" stroke={primary} strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.5" />
      {/* Tail wag */}
      {selected && (
        <path d="M38 30 Q42 24 40 18" stroke={primary} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.3"
              style={{ animation: 'ap-tailWag 0.6s ease-in-out infinite alternate' }} />
      )}
    </svg>
  );

  if (type === 'cat') return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="26" r="18" fill={bg} />
      {/* Pointy ears */}
      <path d="M10 20 L14 5 L20 16 Z" fill={primary} opacity="0.3" />
      <path d="M38 20 L34 5 L28 16 Z" fill={primary} opacity="0.3" />
      <path d="M12 18 L14.5 8 L18 15 Z" fill={secondary} opacity="0.25" />
      <path d="M36 18 L33.5 8 L30 15 Z" fill={secondary} opacity="0.25" />
      {/* Head */}
      <circle cx="24" cy="25" r="13" fill={primary} opacity="0.2" />
      {/* Eyes — almond shaped */}
      <ellipse cx="19" cy="23" rx="2.8" ry="2" fill={primary} opacity="0.7" style={{ transform: 'rotate(-5deg)', transformOrigin: '19px 23px' }} />
      <ellipse cx="29" cy="23" rx="2.8" ry="2" fill={primary} opacity="0.7" style={{ transform: 'rotate(5deg)', transformOrigin: '29px 23px' }} />
      <ellipse cx="19" cy="23" rx="1.2" ry="1.8" fill={selected ? '#2D1A0E' : '#8E8E93'} opacity="0.5" />
      <ellipse cx="29" cy="23" rx="1.2" ry="1.8" fill={selected ? '#2D1A0E' : '#8E8E93'} opacity="0.5" />
      {/* Nose */}
      <path d="M23 27 L24 28.5 L25 27 Z" fill={primary} opacity="0.75" />
      {/* Whiskers */}
      <line x1="13" y1="26" x2="19" y2="27" stroke={primary} strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
      <line x1="13" y1="28" x2="19" y2="28" stroke={primary} strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
      <line x1="35" y1="26" x2="29" y2="27" stroke={primary} strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
      <line x1="35" y1="28" x2="29" y2="28" stroke={primary} strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
      {/* Curled tail */}
      {selected && (
        <path d="M36 34 Q40 30 38 26 Q36 24 37 22" stroke={primary} strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.25"
              style={{ animation: 'ap-catTail 3s ease-in-out infinite' }} />
      )}
    </svg>
  );

  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <circle cx="24" cy="26" r="18" fill={bg} />
      {/* Paw print */}
      <ellipse cx="24" cy="28" rx="7" ry="6" fill={primary} opacity="0.2" />
      <circle cx="17" cy="20" r="3.5" fill={primary} opacity="0.2" />
      <circle cx="24" cy="16" r="3.5" fill={primary} opacity="0.2" />
      <circle cx="31" cy="20" r="3.5" fill={primary} opacity="0.2" />
      {/* Heart in center */}
      <path d="M22 26 C22 24 24 22.5 24 24.5 C24 22.5 26 24 26 26 Q24 28.5 24 28.5 Q24 28.5 22 26 Z"
            fill={primary} opacity="0.45" />
      {selected && (
        <circle cx="24" cy="25" r="10" fill="none" stroke={primary} strokeWidth="0.6" opacity="0.15"
                style={{ animation: 'ap-rippleOut 2s ease-out infinite' }} />
      )}
    </svg>
  );
};

/* Large review avatar illustration when no photo */
const ReviewPetAvatar = ({ petType }) => {
  const c = '#FFFFFF';
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {petType === 'dog' ? (
        <>
          <ellipse cx="14" cy="14" rx="7" ry="11" fill={c} opacity="0.4" style={{ transform: 'rotate(-15deg)', transformOrigin: '14px 20px' }} />
          <ellipse cx="42" cy="14" rx="7" ry="11" fill={c} opacity="0.4" style={{ transform: 'rotate(15deg)', transformOrigin: '42px 20px' }} />
          <circle cx="28" cy="28" r="18" fill={c} opacity="0.25" />
          <circle cx="28" cy="31" r="10" fill={c} opacity="0.3" />
          <ellipse cx="28" cy="30" rx="3" ry="2.2" fill={c} opacity="0.9" />
          <circle cx="22" cy="25" r="2.5" fill={c} opacity="0.85" />
          <circle cx="34" cy="25" r="2.5" fill={c} opacity="0.85" />
          <path d="M24 34 Q28 38 32 34" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        </>
      ) : petType === 'cat' ? (
        <>
          <path d="M11 20 L15 6 L22 17 Z" fill={c} opacity="0.35" />
          <path d="M45 20 L41 6 L34 17 Z" fill={c} opacity="0.35" />
          <circle cx="28" cy="30" r="17" fill={c} opacity="0.25" />
          <ellipse cx="28" cy="31" rx="3" ry="2" fill={c} opacity="0.9" />
          <circle cx="20" cy="26" r="2.5" fill={c} opacity="0.85" />
          <circle cx="36" cy="26" r="2.5" fill={c} opacity="0.85" />
        </>
      ) : (
        <>
          <ellipse cx="28" cy="34" rx="8" ry="7" fill={c} opacity="0.3" />
          <circle cx="20" cy="22" r="4" fill={c} opacity="0.3" />
          <circle cx="28" cy="17" r="4" fill={c} opacity="0.3" />
          <circle cx="36" cy="22" r="4" fill={c} opacity="0.3" />
        </>
      )}
    </svg>
  );
};

/* ── Reactive Mascot with smooth transitions ── */
export const AddPetMascot = ({ step, petType, petName, focusedField, scrollProgress }) => {
  const isCurious = step === 0;
  const isExcited = step === 1 && petName;
  const isThoughtful = step === 2;
  const isCelebrating = step === 3;
  const isNameFocused = focusedField === 'name';

  const headTilt = isCurious ? 8 : isCelebrating ? -5 : 0;
  const earPerk = isExcited || isCelebrating;
  const pupilDx = isNameFocused ? -0.8 : isCurious ? 0.6 : isThoughtful ? -0.4 : 0;
  const pupilDy = isThoughtful ? 0.6 : 0;

  // Scroll-linked: mascot shrinks slightly as user scrolls down
  const mascotScale = Math.max(0.75, 1 - scrollProgress * 0.25);
  const mascotOpacity = Math.max(0.6, 1 - scrollProgress * 0.3);

  return (
    <div style={{
      display: 'flex', justifyContent: 'center',
      transform: `scale(${mascotScale})`,
      opacity: mascotOpacity,
      transition: 'transform 150ms ease-out, opacity 150ms ease-out',
    }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 110, height: 110, borderRadius: 9999,
          background: isCelebrating
            ? 'radial-gradient(circle, rgba(255,215,0,0.12) 0%, rgba(232,93,42,0.06) 50%, transparent 70%)'
            : 'radial-gradient(circle, rgba(232,93,42,0.1) 0%, transparent 70%)',
          animation: 'ap-glowPulse 3s ease-in-out infinite',
          transition: 'background 600ms ease',
        }} />
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none"
             style={{
               position: 'relative', zIndex: 1,
               transform: `rotate(${headTilt}deg)`,
               transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
               animation: 'ap-mascotEntry 0.7s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both',
             }}>
          {/* Ears with smooth transition */}
          <ellipse cx="19" cy="17" rx="9" ry="14" fill="#C96A30"
                   style={{ transform: `rotate(${earPerk ? '-22deg' : '-15deg'})`, transformOrigin: '19px 24px', transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
          <ellipse cx="53" cy="17" rx="9" ry="14" fill="#C96A30"
                   style={{ transform: `rotate(${earPerk ? '22deg' : '15deg'})`, transformOrigin: '53px 24px', transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
          <ellipse cx="19" cy="17" rx="5.5" ry="9" fill="#D4845A"
                   style={{ transform: 'rotate(-15deg)', transformOrigin: '19px 24px' }} />
          <ellipse cx="53" cy="17" rx="5.5" ry="9" fill="#D4845A"
                   style={{ transform: 'rotate(15deg)', transformOrigin: '53px 24px' }} />

          {/* Head + muzzle */}
          <circle cx="36" cy="34" r="23" fill="#E8854A" />
          <ellipse cx="36" cy="39" rx="14" ry="11.5" fill="#F5C6A0" />

          {/* Eyes — all states use transitions for smooth morphing */}
          {isCelebrating ? (
            <>
              <path d="M24 31 Q28 27 32 31" stroke="#3D2515" strokeWidth="2.5" fill="none" strokeLinecap="round"
                    style={{ transition: 'all 400ms ease' }} />
              <path d="M40 31 Q44 27 48 31" stroke="#3D2515" strokeWidth="2.5" fill="none" strokeLinecap="round"
                    style={{ transition: 'all 400ms ease' }} />
              {/* Animated sparkles */}
              <g style={{ animation: 'ap-sparkle 1.5s ease-in-out infinite' }}>
                <line x1="14" y1="18" x2="14" y2="14" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="12" y1="16" x2="16" y2="16" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              <g style={{ animation: 'ap-sparkle 1.5s 0.4s ease-in-out infinite' }}>
                <line x1="58" y1="18" x2="58" y2="14" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="56" y1="16" x2="60" y2="16" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" />
              </g>
              <g style={{ animation: 'ap-sparkle 1.5s 0.8s ease-in-out infinite' }}>
                <line x1="36" y1="8" x2="36" y2="4" stroke="#FFD700" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="34" y1="6" x2="38" y2="6" stroke="#FFD700" strokeWidth="1.2" strokeLinecap="round" />
              </g>
              {/* Confetti */}
              <circle cx="10" cy="28" r="1.5" fill="#FF7240" opacity="0.6" style={{ animation: 'ap-confetti 2s ease-in-out infinite' }} />
              <circle cx="62" cy="25" r="1.5" fill="#34C759" opacity="0.6" style={{ animation: 'ap-confetti 2s 0.3s ease-in-out infinite' }} />
              <circle cx="8" cy="38" r="1.2" fill="#FFD700" opacity="0.5" style={{ animation: 'ap-confetti 2s 0.6s ease-in-out infinite' }} />
              <circle cx="64" cy="36" r="1" fill="#5AC8FA" opacity="0.5" style={{ animation: 'ap-confetti 2s 0.9s ease-in-out infinite' }} />
            </>
          ) : isThoughtful ? (
            <>
              <circle cx="28" cy="31" r="4.5" fill="#FFFFFF" style={{ transition: 'all 300ms ease' }} />
              <circle cx="44" cy="31" r="4.5" fill="#FFFFFF" style={{ transition: 'all 300ms ease' }} />
              <circle cx={28 + pupilDx} cy={31 + pupilDy} r="2.8" fill="#3D2515" style={{ transition: 'all 300ms ease' }} />
              <circle cx={44 + pupilDx} cy={31 + pupilDy} r="2.8" fill="#3D2515" style={{ transition: 'all 300ms ease' }} />
              <circle cx={29 + pupilDx * 0.5} cy={29.5} r="1.2" fill="#FFFFFF" />
              <circle cx={45 + pupilDx * 0.5} cy={29.5} r="1.2" fill="#FFFFFF" />
              <g style={{ animation: 'ap-thinkingDots 2s ease-in-out infinite' }}>
                <circle cx="56" cy="20" r="2" fill="#E8854A" opacity="0.4" />
                <circle cx="60" cy="15" r="2.5" fill="#E8854A" opacity="0.3" />
                <circle cx="63" cy="9" r="3" fill="#E8854A" opacity="0.2" />
              </g>
            </>
          ) : (
            <>
              <circle cx="28" cy="31" r="4.5" fill="#FFFFFF" style={{ transition: 'all 300ms ease' }} />
              <circle cx="44" cy="31" r="4.5" fill="#FFFFFF" style={{ transition: 'all 300ms ease' }} />
              <circle cx={28 + pupilDx} cy={31 + pupilDy} r="2.8" fill="#3D2515" style={{ transition: 'all 300ms ease' }} />
              <circle cx={44 + pupilDx} cy={31 + pupilDy} r="2.8" fill="#3D2515" style={{ transition: 'all 300ms ease' }} />
              <circle cx={29 + pupilDx * 0.5} cy={29.5} r="1.2" fill="#FFFFFF" />
              <circle cx={45 + pupilDx * 0.5} cy={29.5} r="1.2" fill="#FFFFFF" />
              {isCurious && (
                <path d="M25 25 Q28 23 31 25" stroke="#3D2515" strokeWidth="1.2" fill="none" strokeLinecap="round"
                      style={{ animation: 'ap-browRaise 3s ease-in-out infinite' }} />
              )}
            </>
          )}

          {/* Nose */}
          <ellipse cx="36" cy="37" rx="3.5" ry="2.5" fill="#3D2515" />
          {/* Nose shine */}
          <ellipse cx="35" cy="36.2" rx="1.2" ry="0.7" fill="#5A3A22" opacity="0.4" />

          {/* Mouth — transitions between states */}
          <path d={
            isCelebrating ? "M30 42 Q36 48 42 42" :
            isExcited ? "M31 42 Q36 46 41 42" :
            "M32 42 Q36 44.5 40 42"
          } stroke="#C96A30" strokeWidth={isCelebrating ? 1.5 : 1.1} fill="none" strokeLinecap="round"
                style={{ transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
          {isThoughtful && (
            <circle cx="36" cy="43" r="2.5" fill="none" stroke="#C96A30" strokeWidth="1.1"
                    style={{ transition: 'all 300ms ease' }} />
          )}

          {/* Tongue */}
          <ellipse cx="36" cy={isCelebrating ? '46' : isExcited ? '44.5' : '44'}
                   rx={isCelebrating ? '2.5' : isExcited ? '2' : '0'}
                   ry={(isExcited || isCelebrating) ? '2.2' : '0'}
                   fill="#E87E7E" opacity="0.7"
                   style={{ transition: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />

          {/* Blush — smooth transitions */}
          <ellipse cx="21" cy="38" rx="4.5" ry="2.2" fill="#FFB088"
                   opacity={isCelebrating ? 0.6 : isExcited ? 0.5 : 0.3}
                   style={{ transition: 'opacity 400ms ease' }} />
          <ellipse cx="51" cy="38" rx="4.5" ry="2.2" fill="#FFB088"
                   opacity={isCelebrating ? 0.6 : isExcited ? 0.5 : 0.3}
                   style={{ transition: 'opacity 400ms ease' }} />

          {/* Collar */}
          <path d="M18 53 Q36 58 54 53" stroke="#E85D2A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="36" cy="55.5" r="2.5" fill="#FFD700" />
          <circle cx="36" cy="55.5" r="1.2" fill="#DAA520" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
};

/* ── Paw divider ── */
const PawDivider = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0' }}>
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
         style={{ flexShrink: 0, animation: 'ap-pawBreathe 3s ease-in-out infinite' }}>
      <ellipse cx="10" cy="13" rx="4" ry="3.5" fill="#E85D2A" opacity="0.15" />
      <circle cx="6.5" cy="8" r="2" fill="#E85D2A" opacity="0.12" />
      <circle cx="10" cy="6" r="2" fill="#E85D2A" opacity="0.12" />
      <circle cx="13.5" cy="8" r="2" fill="#E85D2A" opacity="0.12" />
    </svg>
  </div>
);

/* ── Shared Components ── */
const GlassCTA = ({ children, onClick, disabled, icon: Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="active:scale-[0.97] active:opacity-90"
    style={{
      width: '100%', height: 52,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      background: disabled ? '#E8E4E0' : 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)',
      color: disabled ? '#B0A89E' : '#FFFFFF',
      borderRadius: 14, fontSize: 15, fontWeight: 700,
      border: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: '"Nunito", sans-serif',
      letterSpacing: '-0.2px',
      boxShadow: disabled ? 'none' : '0 4px 16px rgba(232, 93, 42, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)',
      position: 'relative', overflow: 'hidden',
      transition: 'transform 120ms ease, opacity 120ms ease, background 200ms ease, box-shadow 200ms ease',
    }}
  >
    {!disabled && (
      <>
        <div style={{
          position: 'absolute', top: 0, left: '10%', right: '10%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)',
          backgroundSize: '200% 100%', animation: 'ap-shimmer 3s ease-in-out infinite',
        }} />
      </>
    )}
    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
      {children}
      {Icon && <Icon size={16} strokeWidth={2.5} />}
    </span>
  </button>
);

const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className="active:scale-[0.95]"
    style={{
      width: 48, height: 28, borderRadius: 9999,
      background: value ? '#E85D2A' : '#DDD8D3',
      border: 'none', cursor: 'pointer', position: 'relative',
      padding: 2, display: 'flex', alignItems: 'center',
      transition: 'background 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      boxShadow: value ? '0 0 0 2px rgba(232,93,42,0.15)' : 'none',
    }}
  >
    <div style={{
      width: 24, height: 24, borderRadius: '50%', background: '#FFF',
      boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
      transform: value ? 'translateX(20px)' : 'translateX(0)',
      transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    }} />
  </button>
);

/* ── Chip with ripple micro-interaction ── */
const SelectChip = ({ label, selected, onClick, delay = 0 }) => {
  const [pressed, setPressed] = useState(false);
  const handleClick = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 180);
    onClick();
  };
  return (
    <button
      onClick={handleClick}
      style={{
        padding: '8px 16px', borderRadius: 9999,
        fontSize: 13, fontWeight: 600,
        fontFamily: '"Nunito", sans-serif',
        background: selected ? 'rgba(232,93,42,0.08)' : '#FFFFFF',
        border: selected ? '1.5px solid #E85D2A' : '1px solid rgba(0,0,0,0.06)',
        color: selected ? '#E85D2A' : '#6E6E73',
        cursor: 'pointer',
        whiteSpace: 'nowrap', flexShrink: 0,
        position: 'relative', overflow: 'hidden',
        transition: pressed
          ? 'all 100ms ease-out'
          : 'background 200ms ease, border 200ms ease, color 200ms ease, box-shadow 200ms ease',
        transform: pressed ? 'scale(0.95)' : 'scale(1)',
        boxShadow: selected ? '0 2px 8px rgba(232,93,42,0.1)' : 'none',
      }}
    >
      {label}
    </button>
  );
};

/* ── Step 1: Pet Type ── */
const StepType = ({ petType, onSelect }) => (
  <div style={{ padding: '0 24px' }}>
    <h1 style={{
      fontSize: 24, fontWeight: 800, color: '#111',
      fontFamily: '"Nunito", sans-serif', letterSpacing: '-0.5px',
      marginBottom: 6, animation: 'ap-fadeUp 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both',
    }}>What kind of pet?</h1>
    <p style={{
      fontSize: 15, color: '#8E8E93', marginBottom: 24, lineHeight: 1.5,
      fontFamily: '"Nunito", sans-serif', fontWeight: 400,
      animation: 'ap-fadeUp 0.5s 0.18s cubic-bezier(0.22,1,0.36,1) both',
    }}>Choose your companion type</p>

    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {PET_TYPES.map((type, i) => {
        const selected = petType === type.id;
        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className="active:scale-[0.98]"
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 20,
              background: selected ? 'rgba(232,93,42,0.03)' : '#FFFFFF',
              border: selected ? '2px solid #E85D2A' : '1px solid rgba(0,0,0,0.04)',
              boxShadow: selected
                ? '0 0 0 3px rgba(232,93,42,0.06), 0 6px 16px rgba(232,93,42,0.08)'
                : '0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.7)',
              cursor: 'pointer', textAlign: 'left',
              transition: 'background 200ms ease, border 200ms ease, box-shadow 250ms ease',
              animation: `ap-slideUp 0.5s ${0.25 + i * 0.1}s cubic-bezier(0.22,1,0.36,1) both`,
            }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: selected ? 'rgba(232,93,42,0.04)' : '#F8F6F4',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 200ms ease',
              flexShrink: 0,
            }}>
              <PetTypeIllustration type={type.id} selected={selected} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111', fontFamily: '"Nunito", sans-serif' }}>{type.label}</div>
              <div style={{ fontSize: 13, color: '#8E8E93', marginTop: 2, fontFamily: '"Nunito", sans-serif' }}>{type.desc}</div>
            </div>
            <div style={{
              width: 26, height: 26, borderRadius: 9999,
              background: selected ? 'linear-gradient(135deg, #FF7240, #E85D2A)' : 'rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: selected ? '0 2px 8px rgba(232,93,42,0.25)' : 'none',
              transition: 'all 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: selected ? 'scale(1)' : 'scale(0.85)',
              opacity: selected ? 1 : 0.3,
            }}>
              <Check size={14} color={selected ? '#FFF' : '#999'} strokeWidth={3} />
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

/* ── Step 2: Name & Photo ── */
const StepNamePhoto = ({ info, onChange, photo, onPhotoSelect, petType, onFocus, onBlur }) => (
  <div style={{ padding: '0 24px' }}>
    <h1 style={{
      fontSize: 24, fontWeight: 800, color: '#111',
      fontFamily: '"Nunito", sans-serif', letterSpacing: '-0.5px',
      marginBottom: 6, animation: 'ap-fadeUp 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both',
    }}>Name your {petType}</h1>
    <p style={{
      fontSize: 15, color: '#8E8E93', marginBottom: 28, lineHeight: 1.5,
      fontFamily: '"Nunito", sans-serif', fontWeight: 400,
      animation: 'ap-fadeUp 0.5s 0.18s cubic-bezier(0.22,1,0.36,1) both',
    }}>The most important part</p>

    {/* Photo circle */}
    <div style={{
      display: 'flex', justifyContent: 'center', marginBottom: 28,
      animation: 'ap-scaleIn 0.6s 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both',
    }}>
      <div style={{ position: 'relative' }}>
        {photo ? (
          <>
            <div style={{
              width: 120, height: 120, borderRadius: 9999, overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 0 0 3px rgba(232,93,42,0.08)',
              animation: 'ap-photoReveal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both',
            }}>
              <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button
              onClick={() => onPhotoSelect(null)}
              className="active:scale-[0.9]"
              style={{
                position: 'absolute', top: -2, right: -2,
                width: 28, height: 28, borderRadius: 9999,
                background: '#111', border: '2.5px solid #FBF9F7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                animation: 'ap-popIn 0.3s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both',
              }}
            >
              <X size={12} color="#FFF" strokeWidth={3} />
            </button>
          </>
        ) : (
          <button
            onClick={() => onPhotoSelect(DEMO_PHOTO)}
            className="active:scale-[0.95]"
            style={{
              width: 120, height: 120, borderRadius: 9999,
              border: '2px dashed rgba(232,93,42,0.25)',
              background: 'rgba(232,93,42,0.02)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer', transition: 'all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {/* Pulsing ring hint */}
            <div style={{
              position: 'absolute', inset: 4, borderRadius: 9999,
              border: '1px solid rgba(232,93,42,0.08)',
              animation: 'ap-pulseRing 2.5s ease-in-out infinite',
            }} />
            <Camera size={24} color="#E85D2A" strokeWidth={1.5} style={{ opacity: 0.6 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#E85D2A', opacity: 0.65, fontFamily: '"Nunito", sans-serif' }}>Add photo</span>
          </button>
        )}
      </div>
    </div>

    {/* Name input */}
    <div style={{ animation: 'ap-fadeUp 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
      <label style={{
        fontSize: 12, fontWeight: 700, color: '#8E8E93',
        textTransform: 'uppercase', letterSpacing: '0.08em',
        display: 'block', marginBottom: 8, paddingLeft: 2,
        fontFamily: '"Nunito", sans-serif',
      }}>Name</label>
      <input
        type="text"
        placeholder="What's their name?"
        value={info.name}
        onChange={(e) => onChange({ ...info, name: e.target.value })}
        onFocus={() => onFocus('name')}
        onBlur={() => onBlur()}
        style={{
          width: '100%', height: 50, padding: '0 16px',
          background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)',
          borderRadius: 14, fontSize: 16, color: '#111',
          fontFamily: '"Nunito", sans-serif', fontWeight: 600,
          outline: 'none', boxSizing: 'border-box',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02), 0 1px 0 rgba(255,255,255,0.7)',
          transition: 'border-color 200ms, box-shadow 200ms',
        }}
      />
    </div>

    {!photo && (
      <p style={{
        fontSize: 13, color: '#B0A89E', textAlign: 'center', marginTop: 20,
        fontFamily: '"Nunito", sans-serif',
        animation: 'ap-fadeUp 0.5s 0.38s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        You can add a photo later too
      </p>
    )}
  </div>
);

/* ── Picker Modal Overlay ── */
const PickerModal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        animation: 'ap-modalBgIn 0.2s ease-out both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 320,
          background: '#FFFFFF',
          borderRadius: 24,
          padding: '20px 20px 16px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.04)',
          animation: 'ap-modalIn 0.25s cubic-bezier(0.22,1,0.36,1) both',
        }}
      >
        <div style={{
          fontSize: 17, fontWeight: 800, color: '#111',
          fontFamily: '"Nunito", sans-serif', textAlign: 'center',
          marginBottom: 16,
        }}>{title}</div>
        {children}
      </div>
    </div>
  );
};

/* ── Date Picker with scroll columns ── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const ScrollColumn = ({ items, selected, onSelect, width }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (containerRef.current && selected !== null) {
      const idx = items.indexOf(selected);
      if (idx >= 0) {
        containerRef.current.scrollTop = idx * 40 - 60;
      }
    }
  }, []);
  return (
    <div
      ref={containerRef}
      className="ap-scroll"
      style={{
        height: 160, overflowY: 'auto', flex: width || 1,
        scrollSnapType: 'y mandatory',
        position: 'relative',
      }}
    >
      <div style={{ height: 60 }} />
      {items.map((item) => {
        const isSelected = item === selected;
        return (
          <div
            key={item}
            onClick={() => onSelect(item)}
            style={{
              height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              scrollSnapAlign: 'center',
              cursor: 'pointer',
              fontSize: isSelected ? 18 : 15,
              fontWeight: isSelected ? 800 : 500,
              color: isSelected ? '#E85D2A' : '#8E8E93',
              fontFamily: '"Nunito", sans-serif',
              transition: 'color 150ms ease, font-size 150ms ease, font-weight 150ms ease',
            }}
          >
            {item}
          </div>
        );
      })}
      <div style={{ height: 60 }} />
    </div>
  );
};

const DatePickerContent = ({ value, onConfirm, onClose }) => {
  const parsed = value ? new Date(value) : null;
  const [month, setMonth] = useState(parsed ? parsed.getMonth() : new Date().getMonth());
  const [day, setDay] = useState(parsed ? parsed.getDate() : 1);
  const [year, setYear] = useState(parsed ? parsed.getFullYear() : new Date().getFullYear() - 2);
  return (
    <>
      <div style={{
        display: 'flex', gap: 2, position: 'relative',
        borderRadius: 14, overflow: 'hidden',
        background: '#FAFAFA',
        border: '1px solid rgba(0,0,0,0.04)',
      }}>
        {/* Selection highlight bar */}
        <div style={{
          position: 'absolute', left: 8, right: 8, top: '50%', transform: 'translateY(-50%)',
          height: 40, borderRadius: 10,
          background: 'rgba(232,93,42,0.06)',
          border: '1px solid rgba(232,93,42,0.1)',
          pointerEvents: 'none', zIndex: 1,
        }} />
        <ScrollColumn items={MONTHS} selected={MONTHS[month]} onSelect={(m) => setMonth(MONTHS.indexOf(m))} width={1.2} />
        <ScrollColumn items={DAYS} selected={day} onSelect={setDay} width={0.8} />
        <ScrollColumn items={YEARS} selected={year} onSelect={setYear} width={1} />
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
        <button
          onClick={onClose}
          style={{
            flex: 1, height: 44, borderRadius: 12,
            background: '#F5F3F1', border: 'none',
            fontSize: 14, fontWeight: 700, color: '#6E6E73',
            fontFamily: '"Nunito", sans-serif', cursor: 'pointer',
          }}
        >Cancel</button>
        <button
          onClick={() => {
            const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            onConfirm(d);
          }}
          style={{
            flex: 1, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #FF7240, #E85D2A)', border: 'none',
            fontSize: 14, fontWeight: 700, color: '#FFF',
            fontFamily: '"Nunito", sans-serif', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(232,93,42,0.2)',
          }}
        >Confirm</button>
      </div>
    </>
  );
};

/* ── Weight Picker ── */
const WeightPickerContent = ({ value, onConfirm, onClose }) => {
  const [weight, setWeight] = useState(value ? parseFloat(value) : 10);
  const WEIGHTS = Array.from({ length: 80 }, (_, i) => i + 1);
  return (
    <>
      <div style={{
        position: 'relative',
        borderRadius: 14, overflow: 'hidden',
        background: '#FAFAFA',
        border: '1px solid rgba(0,0,0,0.04)',
      }}>
        <div style={{
          position: 'absolute', left: 8, right: 8, top: '50%', transform: 'translateY(-50%)',
          height: 40, borderRadius: 10,
          background: 'rgba(232,93,42,0.06)',
          border: '1px solid rgba(232,93,42,0.1)',
          pointerEvents: 'none', zIndex: 1,
        }} />
        <ScrollColumn items={WEIGHTS} selected={weight} onSelect={setWeight} />
      </div>
      <div style={{
        textAlign: 'center', marginTop: 8,
        fontSize: 13, color: '#8E8E93', fontFamily: '"Nunito", sans-serif',
      }}>kilograms</div>
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button
          onClick={onClose}
          style={{
            flex: 1, height: 44, borderRadius: 12,
            background: '#F5F3F1', border: 'none',
            fontSize: 14, fontWeight: 700, color: '#6E6E73',
            fontFamily: '"Nunito", sans-serif', cursor: 'pointer',
          }}
        >Cancel</button>
        <button
          onClick={() => onConfirm(String(weight))}
          style={{
            flex: 1, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #FF7240, #E85D2A)', border: 'none',
            fontSize: 14, fontWeight: 700, color: '#FFF',
            fontFamily: '"Nunito", sans-serif', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(232,93,42,0.2)',
          }}
        >Confirm</button>
      </div>
    </>
  );
};

/* ── Step 3: Details ── */
const StepDetails = ({ info, onChange, petType, onOpenDatePicker, onOpenWeightPicker }) => {
  const breeds = petType === 'dog' ? DOG_BREEDS : petType === 'cat' ? CAT_BREEDS : [];
  const colors = PET_COLORS[petType] || PET_COLORS.other;
  const [breedSearch, setBreedSearch] = useState('');
  const filteredBreeds = breedSearch
    ? breeds.filter(b => b.toLowerCase().includes(breedSearch.toLowerCase()))
    : breeds;

  return (
    <div style={{ padding: '0 24px' }}>
      <h1 style={{
        fontSize: 24, fontWeight: 800, color: '#111',
        fontFamily: '"Nunito", sans-serif', letterSpacing: '-0.5px',
        marginBottom: 6, animation: 'ap-fadeUp 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both',
      }}>Tell us more</h1>
      <p style={{
        fontSize: 15, color: '#8E8E93', marginBottom: 24, lineHeight: 1.5,
        fontFamily: '"Nunito", sans-serif', fontWeight: 400,
        animation: 'ap-fadeUp 0.5s 0.18s cubic-bezier(0.22,1,0.36,1) both',
      }}>All optional, add what you know</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Breed with search */}
        {breeds.length > 0 && (
          <div style={{ animation: 'ap-fadeUp 0.5s 0.22s cubic-bezier(0.22,1,0.36,1) both' }}>
            <label style={{
              fontSize: 12, fontWeight: 700, color: '#8E8E93',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', marginBottom: 8, paddingLeft: 2,
              fontFamily: '"Nunito", sans-serif',
            }}>Breed</label>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Search size={15} color="#8E8E93" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text" placeholder="Search breed..."
                value={breedSearch}
                onChange={(e) => setBreedSearch(e.target.value)}
                style={{
                  width: '100%', height: 40, padding: '0 12px 0 34px',
                  background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 12, fontSize: 14, color: '#111',
                  fontFamily: '"Nunito", sans-serif', fontWeight: 500,
                  outline: 'none', boxSizing: 'border-box',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                  transition: 'border-color 200ms, box-shadow 200ms',
                }}
              />
            </div>
            <div className="ap-hscroll" style={{
              display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
              marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24,
            }}>
              {filteredBreeds.map((breed) => (
                <SelectChip
                  key={breed} label={breed}
                  selected={info.breed === breed}
                  onClick={() => onChange({ ...info, breed: info.breed === breed ? '' : breed })}
                />
              ))}
              {filteredBreeds.length === 0 && (
                <span style={{ fontSize: 13, color: '#B0A89E', padding: '8px 0', fontFamily: '"Nunito", sans-serif' }}>
                  No breeds match "{breedSearch}"
                </span>
              )}
            </div>
          </div>
        )}

        {/* Color / Markings */}
        <div style={{ animation: 'ap-fadeUp 0.5s 0.28s cubic-bezier(0.22,1,0.36,1) both' }}>
          <label style={{
            fontSize: 12, fontWeight: 700, color: '#8E8E93',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            display: 'block', marginBottom: 8, paddingLeft: 2,
            fontFamily: '"Nunito", sans-serif',
          }}>Color / Markings</label>
          <div className="ap-hscroll" style={{
            display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4,
            marginLeft: -24, marginRight: -24, paddingLeft: 24, paddingRight: 24,
          }}>
            {colors.map((c) => (
              <SelectChip
                key={c} label={c}
                selected={info.color === c}
                onClick={() => onChange({ ...info, color: info.color === c ? '' : c })}
              />
            ))}
          </div>
        </div>

        {/* Gender — tactile buttons with bounce */}
        <div style={{ animation: 'ap-fadeUp 0.5s 0.34s cubic-bezier(0.22,1,0.36,1) both' }}>
          <label style={{
            fontSize: 12, fontWeight: 700, color: '#8E8E93',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            display: 'block', marginBottom: 8, paddingLeft: 2,
            fontFamily: '"Nunito", sans-serif',
          }}>Gender</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {['Male', 'Female'].map(g => {
              const selected = info.gender === g;
              return (
                <button
                  key={g}
                  onClick={() => onChange({ ...info, gender: selected ? '' : g })}
                  className="active:scale-[0.95]"
                  style={{
                    flex: 1, height: 48, borderRadius: 14,
                    fontSize: 14, fontWeight: 700,
                    fontFamily: '"Nunito", sans-serif',
                    background: selected ? '#111' : '#FFFFFF',
                    border: selected ? 'none' : '1px solid rgba(0,0,0,0.06)',
                    color: selected ? '#FFF' : '#111',
                    cursor: 'pointer',
                    transition: 'background 200ms ease, border 200ms ease, color 200ms ease, box-shadow 200ms ease',
                    boxShadow: selected
                      ? '0 4px 12px rgba(0,0,0,0.15)'
                      : 'inset 0 1px 3px rgba(0,0,0,0.01), 0 1px 0 rgba(255,255,255,0.7)',
                  }}
                >
                  {g === 'Male' ? '♂' : '♀'} {g}
                </button>
              );
            })}
          </div>
        </div>

        {/* Birthday & Weight side by side — tap to open pickers */}
        <div style={{
          display: 'flex', gap: 12,
          animation: 'ap-fadeUp 0.5s 0.4s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          <div style={{ flex: 1 }}>
            <label style={{
              fontSize: 12, fontWeight: 700, color: '#8E8E93',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', marginBottom: 8, paddingLeft: 2,
              fontFamily: '"Nunito", sans-serif',
            }}>Birthday</label>
            <button
              onClick={onOpenDatePicker}
              className="active:scale-[0.97]"
              style={{
                width: '100%', height: 46, padding: '0 12px',
                background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 14, fontSize: 14,
                color: info.birthday ? '#111' : '#8E8E93',
                fontFamily: '"Nunito", sans-serif', fontWeight: 500,
                cursor: 'pointer', textAlign: 'left',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02), 0 1px 0 rgba(255,255,255,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <span>{info.birthday
                ? new Date(info.birthday + 'T00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                : 'dd.mm.yyyy'}</span>
              <span style={{ fontSize: 16, opacity: 0.4 }}>&#x1F4C5;</span>
            </button>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{
              fontSize: 12, fontWeight: 700, color: '#8E8E93',
              textTransform: 'uppercase', letterSpacing: '0.08em',
              display: 'block', marginBottom: 8, paddingLeft: 2,
              fontFamily: '"Nunito", sans-serif',
            }}>Weight (kg)</label>
            <button
              onClick={onOpenWeightPicker}
              className="active:scale-[0.97]"
              style={{
                width: '100%', height: 46, padding: '0 12px',
                background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 14, fontSize: 14,
                color: info.weight ? '#111' : '#8E8E93',
                fontFamily: '"Nunito", sans-serif', fontWeight: 500,
                cursor: 'pointer', textAlign: 'left',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02), 0 1px 0 rgba(255,255,255,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              <span>{info.weight ? `${info.weight} kg` : 'e.g. 12'}</span>
              <span style={{ fontSize: 16, opacity: 0.4 }}>&#x2696;</span>
            </button>
          </div>
        </div>


        {/* Neutered */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', borderRadius: 16,
          background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.01)',
          animation: 'ap-fadeUp 0.5s 0.46s cubic-bezier(0.22,1,0.36,1) both',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#111', fontFamily: '"Nunito", sans-serif' }}>Neutered / Spayed</div>
            <div style={{ fontSize: 13, color: '#8E8E93', marginTop: 2, fontFamily: '"Nunito", sans-serif' }}>Has your pet been neutered?</div>
          </div>
          <Toggle value={info.neutered} onChange={(v) => onChange({ ...info, neutered: v })} />
        </div>
      </div>
    </div>
  );
};

/* ── Step 4: Review ── */
const StepReview = ({ info, petType, photo }) => {
  const rows = [
    { label: 'Type', value: petType ? petType.charAt(0).toUpperCase() + petType.slice(1) : '' },
    { label: 'Breed', value: info.breed },
    { label: 'Color', value: info.color },
    { label: 'Gender', value: info.gender },
    { label: 'Birthday', value: info.birthday },
    { label: 'Weight', value: info.weight ? `${info.weight} kg` : '' },
    { label: 'Neutered', value: info.neutered ? 'Yes' : '' },
  ].filter(r => r.value);

  return (
    <div style={{ padding: '0 24px' }}>
      <h1 style={{
        fontSize: 26, fontWeight: 900, color: '#111',
        fontFamily: '"Nunito", sans-serif', letterSpacing: '-0.5px',
        textAlign: 'center', marginBottom: 6,
        animation: 'ap-fadeUp 0.5s 0.1s cubic-bezier(0.22,1,0.36,1) both',
      }}>Meet {info.name || 'your pet'}!</h1>
      <p style={{
        fontSize: 15, color: '#8E8E93', textAlign: 'center', marginBottom: 24,
        fontFamily: '"Nunito", sans-serif', fontWeight: 400,
        animation: 'ap-fadeUp 0.5s 0.18s cubic-bezier(0.22,1,0.36,1) both',
      }}>Looking great. You can edit later.</p>

      {/* Avatar with layered glow */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginBottom: 24,
        animation: 'ap-scaleIn 0.6s 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      }}>
        <div style={{ position: 'relative' }}>
          {/* Outer glow ring */}
          <div style={{
            position: 'absolute', top: -12, left: -12, right: -12, bottom: -12,
            borderRadius: 9999,
            background: 'radial-gradient(circle, rgba(232,93,42,0.08) 0%, rgba(255,215,0,0.04) 50%, transparent 70%)',
            animation: 'ap-glowPulse 3s ease-in-out infinite',
          }} />
          {/* Inner ring */}
          <div style={{
            position: 'absolute', top: -4, left: -4, right: -4, bottom: -4,
            borderRadius: 9999,
            border: '1.5px solid rgba(232,93,42,0.1)',
            animation: 'ap-pulseRing 3s ease-in-out infinite',
          }} />
          <div style={{
            width: 96, height: 96, borderRadius: 9999, overflow: 'hidden',
            boxShadow: '0 8px 28px rgba(0,0,0,0.1), 0 0 0 3px rgba(232,93,42,0.08)',
            position: 'relative', zIndex: 1,
          }}>
            {photo ? (
              <img src={photo} alt={info.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, #FF7240 0%, #E85D2A 60%, #C94E1E 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontSize: 40, fontWeight: 800, color: '#FFFFFF',
                  fontFamily: '"Nunito", sans-serif',
                  textTransform: 'uppercase', lineHeight: 1,
                }}>{(info.name || '?').charAt(0)}</span>
              </div>
            )}
          </div>
          <div style={{
            position: 'absolute', bottom: -2, right: -2, zIndex: 2,
            width: 28, height: 28, borderRadius: 9999,
            background: '#34C759', border: '2.5px solid #FBF9F7',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(52,199,89,0.3)',
            animation: 'ap-popIn 0.4s 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}>
            <Check size={14} color="#FFF" strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* Summary card with staggered rows */}
      <div style={{
        background: '#FFFFFF', borderRadius: 18, padding: '4px 18px',
        border: '1px solid rgba(0,0,0,0.04)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.7)',
        animation: 'ap-slideUp 0.5s 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        {rows.map((row, i) => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '13px 0',
            borderBottom: i < rows.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
            animation: `ap-fadeUp 0.3s ${0.4 + i * 0.06}s cubic-bezier(0.22,1,0.36,1) both`,
          }}>
            <span style={{ fontSize: 13, color: '#8E8E93', fontFamily: '"Nunito", sans-serif', fontWeight: 500 }}>{row.label}</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#111', fontFamily: '"Nunito", sans-serif' }}>{row.value}</span>
          </div>
        ))}
      </div>

      <p style={{
        fontSize: 13, color: '#B0A89E', textAlign: 'center', marginTop: 16,
        fontFamily: '"Nunito", sans-serif',
        animation: 'ap-fadeUp 0.5s 0.55s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        You can always update this later
      </p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════ */
const TOTAL_STEPS = 4;

export default function AddPetFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [petType, setPetType] = useState(null);
  const [info, setInfo] = useState({
    name: '', breed: '', color: '', gender: '', birthday: '', weight: '', neutered: false,
  });
  const [photo, setPhoto] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mascotKey, setMascotKey] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showWeightPicker, setShowWeightPicker] = useState(false);
  const scrollRef = useRef(null);

  // Scroll-linked mascot effect
  const handleScroll = useCallback((e) => {
    const el = e.target;
    const progress = Math.min(1, el.scrollTop / 120);
    setScrollProgress(progress);
  }, []);

  const goNext = () => {
    if (transitioning) return;
    setTransitioning(true);
    setScrollProgress(0);
    setTimeout(() => {
      setStep(s => s + 1);
      setMascotKey(k => k + 1);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setTimeout(() => setTransitioning(false), 50);
    }, 180);
  };
  const goBack = () => {
    if (transitioning) return;
    if (step === 0) { navigate(-1); return; }
    setTransitioning(true);
    setScrollProgress(0);
    setTimeout(() => {
      setStep(s => s - 1);
      setMascotKey(k => k + 1);
      if (scrollRef.current) scrollRef.current.scrollTop = 0;
      setTimeout(() => setTransitioning(false), 50);
    }, 180);
  };

  const canProceed = () => {
    if (step === 0) return !!petType;
    if (step === 1) return info.name.trim().length > 0;
    return true;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        .ap-scroll::-webkit-scrollbar { display: none; }
        .ap-scroll { scrollbar-width: none; }
        .ap-hscroll::-webkit-scrollbar { display: none; }
        .ap-hscroll { scrollbar-width: none; }
        .ap-scroll input:focus {
          border-color: #E85D2A !important;
          box-shadow: 0 0 0 3px rgba(232,93,42,0.08) !important;
        }

        @keyframes ap-fadeUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ap-slideUp {
          0% { opacity: 0; transform: translateY(20px) scale(0.97); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes ap-scaleIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ap-popIn {
          0% { opacity: 0; transform: scale(0); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ap-photoReveal {
          0% { opacity: 0; transform: scale(0.85); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ap-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes ap-mascotEntry {
          0% { opacity: 0; transform: scale(0.6) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ap-glowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes ap-pawBreathe {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes ap-sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes ap-thinkingDots {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50% { opacity: 0.5; transform: translateY(-2px); }
        }
        @keyframes ap-browRaise {
          0%, 70%, 100% { transform: translateY(0); }
          35% { transform: translateY(-1.5px); }
        }
        @keyframes ap-confetti {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-5px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes ap-floatOrb {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(8px, -5px); }
          66% { transform: translate(-4px, 4px); }
        }
        @keyframes ap-pulseRing {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.08); opacity: 0.15; }
        }
        @keyframes ap-earWag {
          0%, 100% { transform: rotate(-18deg); }
          50% { transform: rotate(-24deg); }
        }
        @keyframes ap-tailWag {
          0% { d: path("M38 30 Q42 24 40 18"); }
          100% { d: path("M38 30 Q44 26 42 18"); }
        }
        @keyframes ap-catTail {
          0%, 100% { opacity: 0.25; transform: scaleX(1); }
          50% { opacity: 0.35; transform: scaleX(1.05); }
        }
        @keyframes ap-confettiFall {
          0% { opacity: 1; transform: translateY(0) rotate(0deg); }
          100% { opacity: 0; transform: translateY(800px) rotate(720deg); }
        }
        @keyframes ap-celebMascot {
          0% { opacity: 0; transform: scale(0.3) translateY(30px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ap-celebAvatar {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ap-celebDots {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes ap-modalBgIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes ap-modalIn {
          0% { opacity: 0; transform: scale(0.9) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ap-rippleOut {
          0% { transform: scale(0.8); opacity: 0.3; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#E5E5E5', padding: 20,
        fontFamily: '"Nunito", sans-serif',
      }}>
        <div className="relative" style={{
          width: 390, height: 844, borderRadius: 50,
          border: '8px solid #000', overflow: 'hidden',
          backgroundColor: '#FBF9F7',
        }}>
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]"
               style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
               style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Atmospheric background */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 60, right: -50, width: 220, height: 220, borderRadius: 9999,
              background: 'radial-gradient(circle, rgba(232,93,42,0.05) 0%, rgba(255,180,130,0.02) 50%, transparent 70%)',
            }} />
            <div style={{
              position: 'absolute', bottom: 100, left: -40, width: 180, height: 180, borderRadius: 9999,
              background: 'radial-gradient(circle, rgba(255,114,64,0.04) 0%, transparent 70%)',
            }} />
            <div style={{
              position: 'absolute', top: 300, right: 20, width: 100, height: 100, borderRadius: 9999,
              background: 'radial-gradient(circle, rgba(255,215,0,0.02) 0%, transparent 70%)',
            }} />
            {/* Floating orbs */}
            <div style={{ position: 'absolute', top: 180, left: 25, width: 6, height: 6, borderRadius: 9999, background: '#E85D2A', opacity: 0.06, animation: 'ap-floatOrb 8s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: 340, right: 45, width: 5, height: 5, borderRadius: 9999, background: '#FF7240', opacity: 0.05, animation: 'ap-floatOrb 10s 2s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: 500, left: 55, width: 4, height: 4, borderRadius: 9999, background: '#FFD700', opacity: 0.04, animation: 'ap-floatOrb 7s 4s ease-in-out infinite' }} />
            <div style={{ position: 'absolute', top: 240, right: 80, width: 3, height: 3, borderRadius: 9999, background: '#E85D2A', opacity: 0.04, animation: 'ap-floatOrb 12s 1s ease-in-out infinite' }} />
          </div>

          {/* Grain */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />

          {/* Header */}
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none" style={{
            paddingTop: 56, paddingBottom: 20, paddingLeft: 20, paddingRight: 20,
            background: 'linear-gradient(to bottom, rgba(251,249,247,0.98) 55%, transparent)',
          }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <button onClick={goBack} className="active:scale-[0.94]" style={{
                width: 40, height: 40,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 9999, cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                <ChevronLeft size={20} color="#111" />
              </button>
              <span style={{ fontSize: 16, fontWeight: 700, color: '#111', fontFamily: '"Nunito", sans-serif' }}>Add Pet</span>
              <button onClick={() => navigate(-1)} className="active:opacity-70" style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 14, fontWeight: 700, color: '#E85D2A',
                fontFamily: '"Nunito", sans-serif',
                transition: 'opacity 150ms ease',
              }}>
                Cancel
              </button>
            </div>

            {/* Progress bar */}
            <div style={{
              marginTop: 14, height: 3, borderRadius: 2,
              background: 'rgba(0,0,0,0.04)', overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: 2,
                width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
                background: 'linear-gradient(90deg, #FF7240, #E85D2A)',
                transition: 'width 400ms cubic-bezier(0.22, 1, 0.36, 1)',
                boxShadow: '0 0 6px rgba(232,93,42,0.3)',
              }} />
            </div>
          </header>

          {/* Content */}
          <div
            ref={scrollRef}
            className="ap-scroll"
            onScroll={handleScroll}
            style={{
              position: 'absolute', inset: 0,
              paddingTop: 125, paddingBottom: 100,
              overflowY: 'auto',
              opacity: transitioning ? 0 : 1,
              transform: transitioning ? 'translateY(6px) scale(0.98)' : 'translateY(0) scale(1)',
              filter: transitioning ? 'blur(4px)' : 'blur(0px)',
              transition: transitioning
                ? 'opacity 0.15s ease-out, transform 0.15s ease-out, filter 0.15s ease-out'
                : 'opacity 0.4s cubic-bezier(0.22,1,0.36,1), transform 0.4s cubic-bezier(0.22,1,0.36,1), filter 0.25s ease-out',
            }}
          >
            <div key={mascotKey} style={{ marginBottom: 6 }}>
              <AddPetMascot step={step} petType={petType} petName={info.name} focusedField={focusedField} scrollProgress={scrollProgress} />
            </div>

            <PawDivider />

            {step === 0 && <StepType petType={petType} onSelect={setPetType} />}
            {step === 1 && (
              <StepNamePhoto
                info={info} onChange={setInfo}
                photo={photo} onPhotoSelect={setPhoto}
                petType={petType}
                onFocus={(f) => setFocusedField(f)}
                onBlur={() => setFocusedField(null)}
              />
            )}
            {step === 2 && <StepDetails info={info} onChange={setInfo} petType={petType} onOpenDatePicker={() => setShowDatePicker(true)} onOpenWeightPicker={() => setShowWeightPicker(true)} />}
            {step === 3 && <StepReview info={info} petType={petType} photo={photo} />}
          </div>

          {/* Bottom CTA */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
            padding: '0 24px 44px',
            background: 'linear-gradient(transparent, rgba(251,249,247,0.95) 30%)',
          }}>
            <GlassCTA
              onClick={step === 3 ? () => {
                window.__fylosPetPending = { name: info.name || 'Pet', petType, photo };
                navigate('/');
              } : goNext}
              disabled={!canProceed()}
              icon={step === 3 ? Check : ArrowRight}
            >
              {step === 0 ? 'Continue' : step === 1 ? 'Continue' : step === 2 ? 'Review' : `Add ${info.name || 'Pet'}`}
            </GlassCTA>
          </div>

          {/* Picker Modals — rendered at iPhone frame level */}
          <PickerModal open={showDatePicker} onClose={() => setShowDatePicker(false)} title="Birthday">
            <DatePickerContent
              value={info.birthday}
              onConfirm={(d) => { setInfo(prev => ({ ...prev, birthday: d })); setShowDatePicker(false); }}
              onClose={() => setShowDatePicker(false)}
            />
          </PickerModal>
          <PickerModal open={showWeightPicker} onClose={() => setShowWeightPicker(false)} title="Weight">
            <WeightPickerContent
              value={info.weight}
              onConfirm={(w) => { setInfo(prev => ({ ...prev, weight: w })); setShowWeightPicker(false); }}
              onClose={() => setShowWeightPicker(false)}
            />
          </PickerModal>
        </div>
      </div>
    </>
  );
}
