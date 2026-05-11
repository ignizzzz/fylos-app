import React, { useState } from 'react';
import {
  PawPrint,
  Home,
  Scissors,
  Stethoscope,
  Sun,
  BedDouble,
  Target,
  Navigation,
  Lock,
  ChevronRight,
  Sunrise,
  Moon,
  Star,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────
   SERVICES_CATEGORIES_VARIANTS — 5 fresh layouts I haven't tried yet.
   Each variant is a fundamentally different design idea, not a tweak.
   Mounted at /services-variants.
   ────────────────────────────────────────────────────────────────────── */

const ACTIVE = [
  { id: 'walking',  label: 'Walking',  icon: PawPrint,    blurb: 'Solo & group walks',  count: 28, fromPrice: 35 },
  { id: 'sitting',  label: 'Sitting',  icon: Home,        blurb: 'In your home',         count: 14, fromPrice: 28 },
  { id: 'grooming', label: 'Grooming', icon: Scissors,    blurb: 'Wash · trim · nails',  count:  9, fromPrice: 45 },
  { id: 'vet',      label: 'Vet',      icon: Stethoscope, blurb: 'Clinics & telehealth', count: 11, fromPrice: 60 },
];

const SOON = [
  { id: 'daycare',  label: 'Daycare',  icon: Sun },
  { id: 'boarding', label: 'Boarding', icon: BedDouble },
  { id: 'training', label: 'Training', icon: Target },
  { id: 'taxi',     label: 'Pet Taxi', icon: Navigation },
];

const PET = {
  name: 'Leo',
  avatar:
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
};

function Frame({ title, subtitle, children }) {
  return (
    <div
      style={{
        width: 375,
        margin: '0 auto 36px',
        borderRadius: 24,
        background: '#F9F9FB',
        boxShadow:
          '0 0 0 1px rgba(0,0,0,0.05), 0 12px 40px rgba(60,40,25,0.06)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '14px 20px 6px',
          background: '#FCFAF7',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.10em',
            color: '#9A9590',
            textTransform: 'uppercase',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 11.5, color: '#A09A94', marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      <div style={{ padding: '16px 20px 18px' }}>{children}</div>
    </div>
  );
}

function H({ children, action }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 600,
          color: '#111111',
          letterSpacing: '-0.01em',
        }}
      >
        {children}
      </div>
      {action}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   01 — PET-ORBITAL  (pet avatar centered, services arranged around)
   ──────────────────────────────────────────────────────────────────── */
function VariantOrbital() {
  return (
    <Frame
      title="01 · Pet-orbital"
      subtitle="Leo at center · services radiate around · pet-centric"
    >
      <H>What does Leo need?</H>
      <div
        style={{
          position: 'relative',
          height: 240,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Center: pet avatar with subtle peach halo */}
        <div
          style={{
            width: 92,
            height: 92,
            borderRadius: '50%',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: -10,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(232,93,42,0.10) 0%, rgba(232,93,42,0) 70%)',
            }}
          />
          <img
            src={PET.avatar}
            alt={PET.name}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #FFFFFF',
              boxShadow:
                '0 4px 12px rgba(60,40,25,0.10), 0 0 0 1px rgba(232,93,42,0.10)',
              position: 'relative',
              zIndex: 1,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '100%',
              transform: 'translate(-50%, 6px)',
              fontSize: 11,
              fontWeight: 600,
              color: '#1A1715',
              whiteSpace: 'nowrap',
            }}
          >
            {PET.name}
          </div>
        </div>

        {/* Orbital service chips at 4 positions */}
        {[
          { pos: { top: 12, left: 24 } },
          { pos: { top: 12, right: 24 } },
          { pos: { bottom: 12, left: 24 } },
          { pos: { bottom: 12, right: 24 } },
        ].map((pos, i) => {
          const c = ACTIVE[i];
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              style={{
                position: 'absolute',
                ...pos.pos,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 11px 7px 7px',
                borderRadius: 12,
                background: '#FFFFFF',
                border: '1px solid rgba(0,0,0,0.05)',
                boxShadow:
                  '0 2px 8px rgba(60,40,25,0.06), 0 1px 2px rgba(0,0,0,0.03)',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 7,
                  background: '#FFEDE3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={12} color="#E85D2A" strokeWidth={2.4} />
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#111' }}>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 8,
          fontSize: 11,
          color: '#A09A94',
          textAlign: 'center',
        }}
      >
        {SOON.map((c) => c.label).join(' · ')} coming later
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   02 — TIME-OF-DAY GROUPED  (categorize by when service is needed)
   ──────────────────────────────────────────────────────────────────── */
function VariantTimeGrouped() {
  const groups = [
    { label: 'Morning',  icon: Sunrise, items: [ACTIVE[0]] }, // walking
    { label: 'Day',      icon: Sun,     items: [ACTIVE[2], ACTIVE[3]] }, // grooming, vet
    { label: 'Anytime',  icon: Home,    items: [ACTIVE[1]] }, // sitting
  ];
  return (
    <Frame
      title="02 · Time-of-day grouped"
      subtitle="Categories nested under time slots · narrative grouping"
    >
      <H>What does Leo need?</H>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {groups.map((g) => {
          const GroupIcon = g.icon;
          return (
            <div
              key={g.label}
              style={{
                background: '#FFFFFF',
                borderRadius: 14,
                border: '1px solid rgba(0,0,0,0.05)',
                padding: '10px 12px 12px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 8,
                }}
              >
                <GroupIcon size={12} color="#9A9590" strokeWidth={2.2} />
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#9A9590',
                    textTransform: 'uppercase',
                  }}
                >
                  {g.label}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {g.items.map((c) => {
                  const Icon = c.icon;
                  return (
                    <button
                      key={c.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '7px 12px 7px 7px',
                        borderRadius: 10,
                        background: '#FFEDE3',
                        border: '1px solid rgba(232,93,42,0.10)',
                        cursor: 'pointer',
                      }}
                    >
                      <Icon size={14} color="#E85D2A" strokeWidth={2.2} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#1A1715' }}>
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: '#A09A94' }}>
        {SOON.map((c) => c.label).join(' · ')} soon
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   03 — SPEC ROWS  (info-rich rows: name + count + price · Revolut-y)
   ──────────────────────────────────────────────────────────────────── */
function VariantSpecRows() {
  return (
    <Frame
      title="03 · Spec rows"
      subtitle="Data-dense · count + price + rating · Revolut DNA"
    >
      <H>What does Leo need?</H>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        {ACTIVE.map((c, i, arr) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              style={{
                position: 'relative',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '32px 1fr auto auto',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                background: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Icon size={16} color="#E85D2A" strokeWidth={2.2} />
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#111111',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.1,
                  }}
                >
                  {c.label}
                </div>
                <div style={{ fontSize: 11, color: '#9A9590', marginTop: 2 }}>
                  {c.count} nearby
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#1A1715',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  CHF {c.fromPrice}
                </div>
                <div style={{ fontSize: 10, color: '#9A9590' }}>from</div>
              </div>
              <ChevronRight size={14} color="#C4BBB3" strokeWidth={2.2} />
              {i < arr.length - 1 && (
                <span
                  style={{
                    position: 'absolute',
                    left: 56,
                    right: 14,
                    bottom: 0,
                    height: 1,
                    background: 'rgba(0,0,0,0.05)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 10, fontSize: 11, color: '#A09A94' }}>
        {SOON.map((c) => c.label).join(' · ')} coming later
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   04 — FOLDER TABS  (categories ARE tabs at top, content shows below)
   ──────────────────────────────────────────────────────────────────── */
function VariantFolderTabs() {
  const [active, setActive] = useState(ACTIVE[0].id);
  const cur = ACTIVE.find((c) => c.id === active) || ACTIVE[0];
  return (
    <Frame
      title="04 · Folder tabs"
      subtitle="Categories are tabs · content (top providers) shows below · merged section"
    >
      <H>What does Leo need?</H>
      <div
        style={{
          display: 'flex',
          gap: 0,
          marginBottom: -1,
          position: 'relative',
          zIndex: 2,
        }}
      >
        {ACTIVE.map((c) => {
          const Icon = c.icon;
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                padding: '8px 4px 10px',
                background: isActive ? '#FFFFFF' : 'transparent',
                border: 'none',
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                borderBottom: isActive ? '1px solid #FFFFFF' : '1px solid rgba(0,0,0,0.06)',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#111111' : '#9A9590',
                letterSpacing: '-0.01em',
                position: 'relative',
                boxShadow: isActive
                  ? 'inset 1px 1px 0 rgba(0,0,0,0.05), inset -1px 0 0 rgba(0,0,0,0.05)'
                  : 'none',
              }}
            >
              <Icon size={12} color={isActive ? '#E85D2A' : '#A09A94'} strokeWidth={2.2} />
              {c.label}
            </button>
          );
        })}
      </div>
      <div
        style={{
          background: '#FFFFFF',
          borderTopRightRadius: 16,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          border: '1px solid rgba(0,0,0,0.05)',
          padding: '14px 14px 16px',
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            color: '#8E8E93',
            marginBottom: 10,
          }}
        >
          {cur.count} {cur.label.toLowerCase()} · from CHF {cur.fromPrice}
        </div>
        {/* Mini provider preview */}
        <div style={{ display: 'flex', gap: 8 }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                flex: 1,
                height: 56,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #F4EEE5 0%, #FFEDE3 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                color: '#A09A94',
              }}
            >
              top {n}
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: '#A09A94' }}>
        {SOON.map((c) => c.label).join(' · ')} soon
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   05 — TICKET / STAMP CARDS  (notched edges · paper-stub feel)
   ──────────────────────────────────────────────────────────────────── */
function VariantTickets() {
  return (
    <Frame
      title="05 · Ticket cards"
      subtitle="Notched paper-stub shape · distinctive silhouette"
    >
      <H>What does Leo need?</H>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ACTIVE.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px 12px 18px',
                background: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                /* Notched left edge — masked via radial-gradients */
                WebkitMaskImage:
                  'radial-gradient(circle 8px at 0 50%, transparent 8px, black 8px)',
                maskImage:
                  'radial-gradient(circle 8px at 0 50%, transparent 8px, black 8px)',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.04))',
                borderRadius: 14,
              }}
            >
              {/* Coral left band */}
              <span
                style={{
                  position: 'absolute',
                  top: 8,
                  bottom: 8,
                  left: 6,
                  width: 4,
                  borderRadius: 2,
                  background: '#E85D2A',
                }}
              />
              <span
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#FFEDE3',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginLeft: 6,
                }}
              >
                <Icon size={16} color="#E85D2A" strokeWidth={2.2} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#111111',
                    letterSpacing: '-0.015em',
                    lineHeight: 1.1,
                  }}
                >
                  {c.label}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: '#8E8E93',
                    marginTop: 2,
                    lineHeight: 1.2,
                  }}
                >
                  {c.count} · from CHF {c.fromPrice}
                </div>
              </div>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#A09A94',
                  letterSpacing: '0.08em',
                  alignSelf: 'flex-end',
                  paddingBottom: 2,
                }}
              >
                BOOK ›
              </span>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 12, fontSize: 11, color: '#A09A94' }}>
        {SOON.map((c) => c.label).join(' · ')} soon
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Page wrapper
   ──────────────────────────────────────────────────────────────────── */
export default function ServicesCategoriesVariants() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#EDE9E2',
        padding: '32px 16px 64px',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
      }}
    >
      <div style={{ maxWidth: 460, margin: '0 auto 32px', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#1A1715',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Services categories — 5 fresh layouts
        </h1>
        <p
          style={{
            fontSize: 13,
            color: '#6E6E73',
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          Five genuinely different design ideas for the "What does Leo
          need?" section. Pick the one that calls — we iterate from there.
        </p>
      </div>
      <VariantOrbital />
      <VariantTimeGrouped />
      <VariantSpecRows />
      <VariantFolderTabs />
      <VariantTickets />
    </div>
  );
}
