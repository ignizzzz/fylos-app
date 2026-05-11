import React from 'react';
import {
  Star,
  Bookmark,
  ShieldCheck,
  ChevronRight,
  MapPin,
  Heart,
  Crown,
  Sparkles,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────
   PROVIDER_CARD_VARIANTS — 5 layouts του provider rail card.
   Ίδιες πληροφορίες, διαφορετικό style, για επιλογή.
   Route: /provider-card-variants
   ────────────────────────────────────────────────────────────────────── */

const PROVIDER = {
  displayName: 'Lukas F.',
  photo: 'https://i.pravatar.cc/300?img=12',
  type: 'Dog walker',
  role: 'Walker',
  rating: 4.9,
  reviews: 124,
  cornerBadge: 'Trusted',
  priceFrom: 45,
  currency: 'CHF',
  priceUnit: 'hr',
  distanceKm: 1.2,
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
      <div style={{ padding: '16px 20px 18px' }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#111111',
            letterSpacing: '-0.01em',
            marginBottom: 12,
          }}
        >
          We think Leo would like
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            overflowX: 'auto',
            margin: '0 -20px',
            padding: '4px 20px 8px',
            scrollbarWidth: 'none',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function RoleChip({ label }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 18,
        padding: '0 8px',
        borderRadius: 999,
        backgroundColor: '#FFEDE3',
        color: '#B25030',
        fontSize: 10.5,
        fontWeight: 600,
        letterSpacing: '-0.005em',
      }}
    >
      {label}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────
   01 · HORIZONTAL CURRENT (baseline reference)
   ──────────────────────────────────────────────────────────────────── */
function VariantHorizontal() {
  const p = PROVIDER;
  return (
    <Frame
      title="01 · Horizontal (current)"
      subtitle="Avatar circle left · stacked info right · save top, chevron bottom"
    >
      <div
        style={{
          flexShrink: 0,
          width: 240,
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
          padding: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
        }}
      >
        <img
          src={p.photo}
          alt=""
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            border: '1px solid rgba(0,0,0,0.04)',
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#111', letterSpacing: '-0.01em', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.displayName}
            </span>
            <ShieldCheck size={12} color="#5F7387" strokeWidth={2.2} style={{ flexShrink: 0 }} />
            <Bookmark size={14} color="#C4BBB3" strokeWidth={2.2} style={{ marginLeft: 6, flexShrink: 0 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <RoleChip label={p.role} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, marginLeft: 'auto', flexShrink: 0 }}>
              <Star size={10} fill="#E85D2A" color="#E85D2A" />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#111' }}>{p.rating}</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12 }}>
              <span style={{ color: '#111', fontWeight: 700 }}>from {p.currency} {p.priceFrom}</span>
              <span style={{ opacity: 0.6 }}>/{p.priceUnit}</span>
            </span>
            <ChevronRight size={14} color="#C4BBB3" strokeWidth={2.2} />
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   02 · PHOTO-TOP CARD (Airbnb-style)
   ──────────────────────────────────────────────────────────────────── */
function VariantPhotoTop() {
  const p = PROVIDER;
  return (
    <Frame
      title="02 · Photo-top card"
      subtitle="Photo dominates · info compact below · save overlay on photo"
    >
      <div
        style={{
          flexShrink: 0,
          width: 200,
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
          padding: 10,
          cursor: 'pointer',
        }}
      >
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <img
            src={p.photo}
            alt=""
            style={{ width: '100%', aspectRatio: '4/3', borderRadius: 12, objectFit: 'cover' }}
          />
          <button
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Bookmark size={13} color="#111" strokeWidth={2.2} />
          </button>
          <span
            style={{
              position: 'absolute',
              bottom: 6,
              left: 6,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '3px 8px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(4px)',
              fontSize: 10,
              fontWeight: 700,
              color: '#1A1715',
            }}
          >
            <Star size={9} fill="#E85D2A" color="#E85D2A" />
            {p.rating}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#111', letterSpacing: '-0.01em', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.displayName}
          </span>
          <ShieldCheck size={12} color="#5F7387" strokeWidth={2.2} style={{ flexShrink: 0 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <RoleChip label={p.role} />
          <span style={{ fontSize: 12, color: '#111', fontWeight: 700 }}>
            CHF {p.priceFrom}<span style={{ opacity: 0.6, fontWeight: 500 }}>/{p.priceUnit}</span>
          </span>
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   03 · TICKET CARD (left coral band, distinctive shape)
   ──────────────────────────────────────────────────────────────────── */
function VariantTicket() {
  const p = PROVIDER;
  return (
    <Frame
      title="03 · Ticket card"
      subtitle="Coral left band · distinctive silhouette · ticket-stub feel"
    >
      <div
        style={{
          flexShrink: 0,
          width: 240,
          background: '#FFFFFF',
          borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
          padding: '12px 12px 12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        {/* Coral left band */}
        <span
          style={{
            position: 'absolute',
            left: 6,
            top: 10,
            bottom: 10,
            width: 3,
            borderRadius: 2,
            background: '#E85D2A',
          }}
        />
        <img
          src={p.photo}
          alt=""
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            objectFit: 'cover',
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#111', letterSpacing: '-0.01em' }}>
              {p.displayName}
            </span>
            <ShieldCheck size={12} color="#5F7387" strokeWidth={2.2} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8E8E93', marginBottom: 4 }}>
            <span style={{ fontWeight: 600, color: '#B25030' }}>{p.role}</span>
            <span>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
              <Star size={9} fill="#E85D2A" color="#E85D2A" />
              <span style={{ color: '#111', fontWeight: 600 }}>{p.rating}</span>
            </span>
          </div>
          <div style={{ fontSize: 12 }}>
            <span style={{ color: '#111', fontWeight: 700 }}>from {p.currency} {p.priceFrom}</span>
            <span style={{ opacity: 0.6 }}>/{p.priceUnit}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <Bookmark size={14} color="#C4BBB3" strokeWidth={2.2} />
          <ChevronRight size={14} color="#C4BBB3" strokeWidth={2.2} />
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   04 · CENTERED EMBLEM (avatar centered top, info stacked below)
   ──────────────────────────────────────────────────────────────────── */
function VariantCenteredEmblem() {
  const p = PROVIDER;
  return (
    <Frame
      title="04 · Centered emblem"
      subtitle="Avatar centered on top · info stacked below · symmetric"
    >
      <div
        style={{
          flexShrink: 0,
          width: 168,
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
          padding: '14px 12px 12px',
          textAlign: 'center',
          position: 'relative',
          cursor: 'pointer',
        }}
      >
        <button
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
          }}
        >
          <Bookmark size={14} color="#C4BBB3" strokeWidth={2.2} />
        </button>
        <img
          src={p.photo}
          alt=""
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            objectFit: 'cover',
            margin: '0 auto 8px',
            border: '1px solid rgba(0,0,0,0.04)',
            display: 'block',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 4 }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#111', letterSpacing: '-0.01em' }}>
            {p.displayName}
          </span>
          <ShieldCheck size={11} color="#5F7387" strokeWidth={2.2} />
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#8E8E93', marginBottom: 8 }}>
          <RoleChip label={p.role} />
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <Star size={9} fill="#E85D2A" color="#E85D2A" />
            <span style={{ color: '#111', fontWeight: 600 }}>{p.rating}</span>
          </span>
        </div>
        <div
          style={{
            paddingTop: 8,
            borderTop: '1px solid rgba(0,0,0,0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 12 }}>
            <span style={{ color: '#111', fontWeight: 700 }}>from {p.currency} {p.priceFrom}</span>
            <span style={{ opacity: 0.6 }}>/{p.priceUnit}</span>
          </span>
          <ChevronRight size={14} color="#C4BBB3" strokeWidth={2.2} />
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   05 · SPLIT (info left, photo right, magazine spread)
   ──────────────────────────────────────────────────────────────────── */
function VariantSplit() {
  const p = PROVIDER;
  return (
    <Frame
      title="05 · Split (info left, photo right)"
      subtitle="Info dominates left · photo as side accent · magazine spread"
    >
      <div
        style={{
          flexShrink: 0,
          width: 240,
          background: '#FFFFFF',
          borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
          padding: 0,
          display: 'flex',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <div style={{ flex: 1, minWidth: 0, padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: '#111', letterSpacing: '-0.01em', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.displayName}
            </span>
            <ShieldCheck size={12} color="#5F7387" strokeWidth={2.2} />
          </div>
          <RoleChip label={p.role} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
            <Star size={10} fill="#E85D2A" color="#E85D2A" />
            <span style={{ fontSize: 11.5, color: '#111', fontWeight: 600 }}>{p.rating}</span>
            <span style={{ fontSize: 11, color: '#A09A94' }}> · {p.reviews} reviews</span>
          </div>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
            <span style={{ fontSize: 12 }}>
              <span style={{ color: '#111', fontWeight: 700 }}>from {p.currency} {p.priceFrom}</span>
              <span style={{ opacity: 0.6 }}>/{p.priceUnit}</span>
            </span>
            <ChevronRight size={14} color="#C4BBB3" strokeWidth={2.2} />
          </div>
        </div>
        <div style={{ position: 'relative', width: 84, flexShrink: 0 }}>
          <img
            src={p.photo}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <button
            style={{
              position: 'absolute',
              top: 6,
              right: 6,
              width: 26,
              height: 26,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(4px)',
              border: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Bookmark size={12} color="#111" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Page wrapper
   ──────────────────────────────────────────────────────────────────── */
export default function ProviderCardVariants() {
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
          Provider rail card — 5 layouts
        </h1>
        <p
          style={{
            fontSize: 13,
            color: '#6E6E73',
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          Same info every time (name, trust badge, role, rating, price,
          save, chevron). Different shape, hierarchy, photo treatment.
          Pick one.
        </p>
      </div>
      <VariantHorizontal />
      <VariantPhotoTop />
      <VariantTicket />
      <VariantCenteredEmblem />
      <VariantSplit />
    </div>
  );
}
