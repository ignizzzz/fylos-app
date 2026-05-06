import React from 'react';
import {
  Search,
  ArrowRight,
  Users,
  ShieldCheck,
  ThumbsUp,
  Repeat,
} from 'lucide-react';

/**
 * Inline mini-components for the Pack tab.
 *
 * Components:
 *   - TwinFinderCard     → calm "we noticed" promo card
 *   - TribePacksRail     → row of pack groups (Athens Hounds, etc.)
 *   - MatchChips         → vouched / vaccinated / recurring chips group
 *
 * Notes:
 *   - No gamification surfaces (brand-law §8).
 *   - Voice is calm-friend: "we noticed", not "AI recommends".
 */

// ── Twin Finder promo card ─────────────────────────────────────

export function TwinFinderCard({ petName = 'your Fylos', twinName, onTap }) {
  const subtitle = twinName
    ? `We noticed ${twinName} shares ${petName}'s quiet streak. Worth a meet?`
    : `We noticed someone nearby shares ${petName}'s quiet streak. Worth a meet?`;
  return (
    <button
      onClick={onTap}
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '14px 16px',
        background: '#FBE7DD',
        border: '1px solid rgba(232,93,42,0.16)',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer',
        transition: 'transform 120ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: '#FFFFFF',
          color: '#E85D2A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 6px rgba(232,93,42,0.18)',
        }}
      >
        <Search size={18} strokeWidth={2.2} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: '#E85D2A', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 2 }}>
          Twin Finder
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#7A2F12', lineHeight: 1.15 }}>
          A possible twin nearby.
        </div>
        <div style={{ fontSize: 11, color: '#7A2F12', opacity: 0.78, marginTop: 3, lineHeight: 1.35 }}>
          {subtitle}
        </div>
      </div>
      <ArrowRight size={16} color="#E85D2A" strokeWidth={2.4} />
    </button>
  );
}

// ── Tribe pack groups ──────────────────────────────────────────

const DEFAULT_PACKS = [
  { id: 'athens-hounds', name: 'Athens Hounds', motto: 'Built for long city walks',     members: 312, accent: '#E85D2A' },
  { id: 'senior-cats',   name: 'Senior Cats',   motto: 'Slow days, sun-drenched naps',  members: 184, accent: '#B23A4A' },
  { id: 'hiking-pups',   name: 'Hiking Pups',   motto: 'Trails before tails',           members: 96,  accent: '#8B5A2B' },
];

export function TribePacksRail({ packs = DEFAULT_PACKS, onTap }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px 8px' }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#76767D', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          Packs near you
        </span>
        <span style={{ fontSize: 10, color: '#E85D2A', fontWeight: 700 }}>See all →</span>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          scrollbarWidth: 'none',
          paddingBottom: 2,
        }}
      >
        {packs.map((p) => (
          <button
            key={p.id}
            onClick={() => onTap?.(p)}
            style={{
              flexShrink: 0,
              width: 200,
              padding: 12,
              background: '#FFFFFF',
              border: '1px solid #EDE8E2',
              borderRadius: 14,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: `${p.accent}14`,
                color: p.accent,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${p.accent}33`,
              }}
            >
              <Users size={15} strokeWidth={2} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#111', lineHeight: 1.1 }}>
              {p.name}
            </div>
            <div style={{ fontSize: 11, color: '#76767D', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.motto}
            </div>
            <div style={{ fontSize: 9, color: p.accent, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              {p.members} members
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Match chips (Vouched / Vaccinated / Recurring) ─────────────

export function MatchChips({ vouchedBy = 0, vaccinated = false, recurring = false, fitScore = null, accent = '#E85D2A' }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {fitScore !== null && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '3px 8px',
            borderRadius: 9999,
            background: accent,
            color: '#FFFFFF',
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          {fitScore}% FIT
        </span>
      )}
      {vouchedBy > 0 && (
        <Chip Icon={ThumbsUp} label={`Vouched · ${vouchedBy}`} accent={accent} />
      )}
      {vaccinated && (
        <Chip Icon={ShieldCheck} label="Vaccinated" accent={accent} />
      )}
      {recurring && (
        <Chip Icon={Repeat} label="Weekly" accent={accent} />
      )}
    </div>
  );
}

function Chip({ Icon, label, accent }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 8px',
        borderRadius: 9999,
        background: '#FBE7DD',
        color: '#7A2F12',
        fontSize: 10,
        fontWeight: 600,
        border: '1px solid rgba(232,93,42,0.16)',
      }}
    >
      <Icon size={10} strokeWidth={2.4} color={accent} />
      {label}
    </span>
  );
}
