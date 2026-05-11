import React from 'react';
import {
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Star,
  Activity,
  MessageCircle,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────
   NEXT_UP_VARIANTS — 5 distinct designs for the "Next up" booking card.
   Mounted at /next-up-variants for side-by-side comparison.
   ────────────────────────────────────────────────────────────────────── */

const BOOKING = {
  id: 'b1',
  status: 'confirmed',
  helper: 'In 2 days',
  service: { label: '90 min walk', duration: 90 },
  provider: {
    name: 'Lukas F.',
    photo: 'https://i.pravatar.cc/300?img=12',
    rating: 4.9,
    distance: '1.2 km',
  },
  pet: { name: 'Leo' },
  dateTime: {
    formatted: 'Mon, Feb 24 · 14:00–15:30',
    dayLabel: 'MON',
    dayNumber: '24',
    monthLabel: 'FEB',
    timeRange: '14:00 – 15:30',
  },
};

const STATUS = {
  confirmed: { bg: '#EEF7F1', dot: '#34C759', text: '#3F8D63', label: 'Confirmed' },
  pending:   { bg: '#FDF1EB', dot: '#E85D2A', text: '#B25030', label: 'Pending' },
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
          Next up
        </div>
        {children}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   01 — STACK (current shipped) · vertical hierarchy
   ──────────────────────────────────────────────────────────────────── */
function VariantStack() {
  const b = BOOKING;
  const s = STATUS[b.status];
  return (
    <Frame title="01 · Stack" subtitle="Vertical hierarchy · time strip + big time + walker row">
      <button
        style={{
          width: '100%',
          textAlign: 'left',
          background: '#FFFFFF',
          padding: 16,
          borderRadius: 18,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#E85D2A', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {b.helper}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 22, padding: '0 8px', borderRadius: 999, background: s.bg }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: s.dot }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: s.text }}>{s.label}</span>
          </span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#111', letterSpacing: '-0.015em', marginBottom: 4 }}>
          {b.dateTime.formatted}
        </div>
        <div style={{ fontSize: 13, color: '#6E6E73', marginBottom: 12 }}>
          {b.service.label} for <strong style={{ color: '#3A2E22' }}>{b.pet.name}</strong>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <img src={b.provider.photo} alt="" style={{ width: 28, height: 28, borderRadius: 14, objectFit: 'cover' }} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: '#111' }}>{b.provider.name}</span>
          <span style={{ fontSize: 11.5, color: '#A09A94' }}>· ★ {b.provider.rating}</span>
          <span style={{ marginLeft: 'auto', color: '#C4BBB3', fontSize: 16 }}>›</span>
        </div>
      </button>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   02 — CALENDAR TICKET · date stamp left + info right
   ──────────────────────────────────────────────────────────────────── */
function VariantCalendarTicket() {
  const b = BOOKING;
  const s = STATUS[b.status];
  return (
    <Frame title="02 · Calendar ticket" subtitle="Date stamp on left · feels like a calendar entry">
      <button
        style={{
          width: '100%',
          textAlign: 'left',
          background: '#FFFFFF',
          padding: 14,
          borderRadius: 18,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'stretch',
          gap: 14,
        }}
      >
        {/* Date stamp */}
        <div
          style={{
            width: 64,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 0',
            borderRadius: 12,
            background: 'linear-gradient(155deg, #FFF1E5 0%, #FBDDC8 100%)',
            border: '1px solid rgba(232,93,42,0.12)',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: '#B25030', letterSpacing: '0.08em' }}>
            {b.dateTime.dayLabel}
          </div>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#3A1F12', letterSpacing: '-0.04em', lineHeight: 1 }}>
            {b.dateTime.dayNumber}
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#B25030', letterSpacing: '0.08em' }}>
            {b.dateTime.monthLabel}
          </div>
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#9A9590' }}>{b.helper}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 600, color: s.text }}>
              <span style={{ width: 5, height: 5, borderRadius: 3, background: s.dot }} /> {s.label}
            </span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111', letterSpacing: '-0.015em', lineHeight: 1.15 }}>
            {b.service.label}
          </div>
          <div style={{ fontSize: 12.5, color: '#6E6E73', marginTop: 2 }}>
            {b.dateTime.timeRange} · for {b.pet.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 8 }}>
            <img src={b.provider.photo} alt="" style={{ width: 20, height: 20, borderRadius: 10, objectFit: 'cover' }} />
            <span style={{ fontSize: 11.5, color: '#6E6E73' }}>with {b.provider.name}</span>
          </div>
        </div>
      </button>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   03 — PHOTO-LED · big walker photo dominating left
   ──────────────────────────────────────────────────────────────────── */
function VariantPhotoLed() {
  const b = BOOKING;
  const s = STATUS[b.status];
  return (
    <Frame title="03 · Photo-led" subtitle="Walker photo prominent · feels human/social">
      <button
        style={{
          width: '100%',
          textAlign: 'left',
          background: '#FFFFFF',
          padding: 0,
          borderRadius: 18,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
          cursor: 'pointer',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={b.provider.photo}
            alt=""
            style={{ width: 92, height: 116, objectFit: 'cover', display: 'block' }}
          />
          <span
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '3px 7px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(4px)',
              color: '#3A2E22',
            }}
          >
            {b.helper.toUpperCase()}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#111', letterSpacing: '-0.015em', lineHeight: 1.1 }}>
              {b.service.label} with {b.provider.name}
            </div>
            <div style={{ fontSize: 12, color: '#6E6E73', marginTop: 4 }}>
              {b.dateTime.formatted}
            </div>
            <div style={{ fontSize: 11.5, color: '#8E8E93', marginTop: 2 }}>
              for {b.pet.name} · ★ {b.provider.rating} · {b.provider.distance}
            </div>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start', fontSize: 10.5, fontWeight: 600, color: s.text, marginTop: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: s.dot }} /> {s.label}
          </span>
        </div>
      </button>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   04 — STATUS BANNER · colored top stripe + dense info below
   ──────────────────────────────────────────────────────────────────── */
function VariantStatusBanner() {
  const b = BOOKING;
  const s = STATUS[b.status];
  return (
    <Frame title="04 · Status banner" subtitle="Colored top stripe carries timing/status · dense below">
      <button
        style={{
          width: '100%',
          textAlign: 'left',
          background: '#FFFFFF',
          padding: 0,
          borderRadius: 18,
          border: '1px solid rgba(0,0,0,0.04)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        {/* Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 14px',
            background: '#FFEDE3',
            borderBottom: '1px solid rgba(232,93,42,0.10)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={11} color="#E85D2A" strokeWidth={2.4} />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#B25030', letterSpacing: '0.04em' }}>
              {b.helper} · {b.dateTime.timeRange}
            </span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 600, color: s.text }}>
            <span style={{ width: 5, height: 5, borderRadius: 3, background: s.dot }} /> {s.label}
          </span>
        </div>
        {/* Body */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
          <img src={b.provider.photo} alt="" style={{ width: 44, height: 44, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#111', letterSpacing: '-0.015em', lineHeight: 1.1 }}>
              {b.service.label}
            </div>
            <div style={{ fontSize: 11.5, color: '#6E6E73', marginTop: 3 }}>
              with {b.provider.name} · for {b.pet.name}
            </div>
          </div>
          <ChevronRight size={16} color="#C4BBB3" strokeWidth={2.2} />
        </div>
      </button>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   05 — COUNTDOWN HERO · big urgency number + supporting info
   ──────────────────────────────────────────────────────────────────── */
function VariantCountdown() {
  const b = BOOKING;
  const s = STATUS[b.status];
  return (
    <Frame title="05 · Countdown hero" subtitle="Big '2 days' urgency number · live state lead">
      <button
        style={{
          width: '100%',
          textAlign: 'left',
          background:
            'linear-gradient(165deg, #FFF6EE 0%, #FFEDE3 100%)',
          padding: 16,
          borderRadius: 18,
          border: '1px solid rgba(232,93,42,0.10)',
          boxShadow: '0 1px 2px rgba(232,93,42,0.06)',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          {/* Big number */}
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                fontSize: 38,
                fontWeight: 800,
                color: '#E85D2A',
                letterSpacing: '-0.04em',
                lineHeight: 0.95,
              }}
            >
              2
            </div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#B25030',
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              days
            </div>
          </div>
          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: '#3A1F12', letterSpacing: '-0.015em', lineHeight: 1.15 }}>
              {b.service.label} for {b.pet.name}
            </div>
            <div style={{ fontSize: 12, color: '#6E4838', marginTop: 3 }}>
              {b.dateTime.formatted}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <img src={b.provider.photo} alt="" style={{ width: 22, height: 22, borderRadius: 11, objectFit: 'cover' }} />
              <span style={{ fontSize: 11.5, color: '#3A2E22', fontWeight: 600 }}>{b.provider.name}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 600, color: s.text, marginLeft: 'auto' }}>
                <span style={{ width: 5, height: 5, borderRadius: 3, background: s.dot }} /> {s.label}
              </span>
            </div>
          </div>
        </div>
      </button>
    </Frame>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Page wrapper
   ──────────────────────────────────────────────────────────────────── */
export default function NextUpVariants() {
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
          Next up — 5 booking card variants
        </h1>
        <p
          style={{
            fontSize: 13,
            color: '#6E6E73',
            marginTop: 6,
            lineHeight: 1.4,
          }}
        >
          Five takes on the upcoming booking preview. Different
          hierarchy, photo use, and urgency treatment. Pick one and
          we ship it.
        </p>
      </div>
      <VariantStack />
      <VariantCalendarTicket />
      <VariantPhotoLed />
      <VariantStatusBanner />
      <VariantCountdown />
    </div>
  );
}
