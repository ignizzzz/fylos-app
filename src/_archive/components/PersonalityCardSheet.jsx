import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Lock, Footprints, Users, Award, Share2 } from 'lucide-react';

// Mounts inside the iPhone frame (id="fylos-phone-root") so the absolute-positioned
// overlay is bounded by the phone, not the document scroll area.
const getPortalMount = () =>
  typeof document !== 'undefined'
    ? document.getElementById('fylos-phone-root') || document.body
    : null;

/**
 * PersonalityCardSheet — bottom-sheet view of a pet's auto-generated archetype.
 * Read-only. Opened from any pet avatar / "View personality" trigger inside
 * the Pack tab (Network constellation, Feed posts, Playdates row).
 *
 * Aesthetic matches the existing Pack tab: white surface, peach chips, coral
 * accents, Inter sans-serif. No Greek watermark, no field-guide framing.
 */

const ARCHETYPES = {
  diplomat:    { name: 'The Diplomat',    traits: ['Calm', 'Social', 'Curious'],            flavor: 'Master of the calm intro and the polite sniff.',  family: 'Calm-tempered',     accent: '#E85D2A', tint: '#FBE7DD' },
  athlete:     { name: 'The Athlete',     traits: ['Energetic', 'Driven', 'Tireless'],      flavor: 'First to the ball. Last to nap.',                family: 'Boundless',         accent: '#D04A1C', tint: '#FFE2C9' },
  philosopher: { name: 'The Philosopher', traits: ['Observant', 'Patient', 'Wise'],         flavor: 'Watching the world from the windowsill, taking notes.', family: 'Reflective',  accent: '#5C5550', tint: '#E8E4DD' },
  comedian:    { name: 'The Comedian',    traits: ['Playful', 'Silly', 'Magnetic'],         flavor: 'Born to make you laugh. Specializes in zoomies.', family: 'Magnetic',         accent: '#C9881A', tint: '#FFE9C2' },
  guardian:    { name: 'The Guardian',    traits: ['Loyal', 'Watchful', 'Steady'],          flavor: 'On duty. Always.',                               family: 'Steadfast',         accent: '#A0421C', tint: '#F2DCD3' },
  adventurer:  { name: 'The Adventurer',  traits: ['Bold', 'Curious', 'Brave'],             flavor: 'Trails before tails. New smell? New friend.',    family: 'Roaming',           accent: '#8B5A2B', tint: '#E8D9C9' },
  cuddler:     { name: 'The Cuddler',     traits: ['Affectionate', 'Soft', 'Devoted'],      flavor: 'Will accept all the head scratches. All of them.', family: 'Devoted',         accent: '#B23A4A', tint: '#FDD9DC' },
  spark:       { name: 'The Spark',       traits: ['Chaotic', 'Fast', 'Mischievous'],       flavor: 'Tornado in fur. Fortunately, very photogenic.',   family: 'Untamed',           accent: '#E85D2A', tint: '#FFE2C9' },
};

// Map known pet names → archetype key. Falls back to 'diplomat' for unknown pets.
const PET_ARCHETYPE = {
  Leo: 'diplomat',
  Zyon: 'philosopher',
  Bella: 'comedian',
  Milo: 'adventurer',
  Luna: 'cuddler',
  Bruno: 'guardian',
  Max: 'cuddler',
  Tao: 'spark',
  Coco: 'philosopher',
  Buddy: 'athlete',
  Misha: 'philosopher',
  Rocco: 'athlete',
  Lola: 'comedian',
};

// Mock pet stats (walks / friends / milestones) — matches Pack tab counters.
const PET_STATS = {
  Leo:   { walks: 142, friends: 12, milestones: 8 },
  Zyon:  { walks: 0,   friends: 4,  milestones: 5 },
  Bella: { walks: 89,  friends: 18, milestones: 11 },
  Milo:  { walks: 203, friends: 7,  milestones: 14 },
  Luna:  { walks: 0,   friends: 3,  milestones: 9 },
  Bruno: { walks: 167, friends: 9,  milestones: 12 },
  Max:   { walks: 84,  friends: 11, milestones: 7 },
  Tao:   { walks: 198, friends: 14, milestones: 10 },
};

export default function PersonalityCardSheet({ open, onClose, pet }) {
  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const mount = getPortalMount();
  if (!open || !pet || !mount) return null;

  const name = pet.name || pet.petName || 'Pet';
  const archetypeKey = PET_ARCHETYPE[name] || 'diplomat';
  const archetype = ARCHETYPES[archetypeKey];
  const stats = PET_STATS[name] || { walks: 0, friends: 0, milestones: 0 };

  const markup = (
    <>
      <style>{`
        @keyframes pcardOverlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pcardSheetIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pcardItemIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pcard-overlay { animation: pcardOverlayIn 200ms ease forwards; }
        .pcard-sheet { animation: pcardSheetIn 360ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
        .pcard-item { opacity: 0; animation: pcardItemIn 360ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      <div
        className="pcard-overlay"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.42)',
          backdropFilter: 'blur(2px)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'flex-end',
          opacity: 0,
        }}
      >
        <div
          className="pcard-sheet"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxHeight: '88%',
            background: '#FFFFFF',
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            opacity: 0,
          }}
        >
          {/* Drag handle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '12px 0 6px',
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 9999, background: '#D1D1D6' }} />
          </div>

          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 20px 14px',
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#8E7A6B',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Personality
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                width: 32,
                height: 32,
                borderRadius: 9999,
                background: '#F7F5F2',
                border: '1px solid rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#111',
              }}
            >
              <X size={15} strokeWidth={2.2} />
            </button>
          </div>

          <div
            style={{
              padding: '0 20px 24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {/* Hero — pet info + archetype */}
            <div className="pcard-item" style={{ animationDelay: '40ms' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <img
                  src={pet.petPhoto || pet.avatar || pet.photo}
                  alt={name}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 9999,
                    objectFit: 'cover',
                    border: '2px solid #FFF',
                    boxShadow: `0 3px 10px ${archetype.accent}33`,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#111',
                      letterSpacing: '-0.018em',
                      lineHeight: 1.1,
                    }}
                  >
                    {name}
                  </div>
                  <div style={{ fontSize: 12, color: '#76767D', marginTop: 2 }}>
                    {pet.breed || pet.petBreed || 'Companion'}
                    {pet.age ? ` · ${pet.age} yrs` : ''}
                  </div>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '4px 8px',
                    borderRadius: 9999,
                    background: archetype.tint,
                    color: archetype.accent,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  <Lock size={9} strokeWidth={2.4} /> Auto
                </div>
              </div>

              {/* Archetype name */}
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#111',
                  letterSpacing: '-0.022em',
                  lineHeight: 1.05,
                  marginBottom: 4,
                }}
              >
                {archetype.name}
                <span style={{ color: archetype.accent }}>.</span>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: '#76767D',
                  fontWeight: 500,
                  marginBottom: 14,
                }}
              >
                Family of the {archetype.family}
              </div>

              {/* Trait pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                {archetype.traits.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: '5px 11px',
                      borderRadius: 9999,
                      background: archetype.tint,
                      color: archetype.accent,
                      fontSize: 12,
                      fontWeight: 600,
                      border: `1px solid ${archetype.accent}22`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Flavor */}
              <p
                style={{
                  fontSize: 14,
                  color: '#3A332C',
                  lineHeight: 1.45,
                  fontStyle: 'italic',
                }}
              >
                "{archetype.flavor}"
              </p>
            </div>

            {/* Stats */}
            <div
              className="pcard-item"
              style={{
                animationDelay: '120ms',
                background: '#F7F5F2',
                border: '1px solid #EDE8E2',
                borderRadius: 16,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stat Icon={Footprints} value={stats.walks || '—'} label={stats.walks === 0 ? 'indoor' : 'walks'} accent={archetype.accent} />
              <span style={{ width: 1, height: 32, background: 'rgba(0,0,0,0.06)' }} />
              <Stat Icon={Users}      value={stats.friends}   label="friends" accent={archetype.accent} />
              <span style={{ width: 1, height: 32, background: 'rgba(0,0,0,0.06)' }} />
              <Stat Icon={Award}      value={stats.milestones} label="milestones" accent={archetype.accent} />
            </div>

            {/* Locked hint */}
            <div
              className="pcard-item"
              style={{
                animationDelay: '180ms',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                background: '#FFF7F2',
                border: '1px dashed #F2D6C5',
                borderRadius: 12,
              }}
            >
              <Sparkles size={14} color={archetype.accent} strokeWidth={2.2} />
              <span style={{ fontSize: 12, color: '#7A2F12', fontWeight: 500, lineHeight: 1.4 }}>
                Auto-generated from {name}'s onboarding + playdate history. Not editable.
              </span>
            </div>

            {/* Share button — bottom CTA */}
            <button
              className="pcard-item active:scale-[0.97] transition-transform"
              style={{
                animationDelay: '220ms',
                width: '100%',
                height: 50,
                borderRadius: 14,
                background: archetype.accent,
                color: '#FFFFFF',
                border: 'none',
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                boxShadow: `0 6px 16px ${archetype.accent}40`,
              }}
            >
              <Share2 size={15} strokeWidth={2.4} />
              Share {name}'s card
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(markup, mount);
}

function Stat({ Icon, value, label, accent }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Icon size={13} color={accent} strokeWidth={2.2} />
      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#111',
          letterSpacing: '-0.018em',
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 9,
          color: '#76767D',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
    </div>
  );
}
