import React, { useState } from 'react';
import {
  ChevronLeft,
  MapPin,
  Share2,
  Bell,
  Phone,
  Clock,
  AlertTriangle,
  Check,
  Heart,
  Navigation,
  Eye,
  ChevronRight,
  X,
  Circle
} from 'lucide-react';

/**
 * 45_LOST_PET_ALERT_v1.jsx
 * Lost Pet Alert screen — Fylos design system.
 * Report and manage a lost pet alert with calm, controlled emergency UX.
 */

const THEME = {
  colors: {
    accent: '#E85D2A', accentHover: '#D04A1C',
    primaryText: '#111111', secondaryText: '#6E6E73', tertiaryText: '#8E8E93',
    background: '#F9F9FB', surface: '#FFFFFF', surfaceAlt: '#F2F2F7',
    danger: '#FF3B30', success: '#00C060', warning: '#FF9500', info: '#007AFF', divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: { soft: '0 4px 20px rgba(0,0,0,0.03)', floating: '0 8px 24px rgba(0,0,0,0.08)' },
  motion: { tap: '120ms', fade: '200ms', tab: '240ms', spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@700;800;900&display=swap');
    .lpa-font-body { font-family: 'Inter', sans-serif; }
    .lpa-scroll::-webkit-scrollbar { display: none; }
    .lpa-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    .lpa-press { transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease; cursor: pointer; }
    .lpa-press:active { transform: scale(0.97); opacity: 0.85; }
  `}</style>
);

/* ── Mini map SVG ─────────────────────────────────────────────────────────── */
const MiniMap = () => (
  <svg width="100%" height="100" viewBox="0 0 310 100" fill="none" style={{ borderRadius: 12 }}>
    <rect width="310" height="100" fill="#EEF0F4" />
    {/* roads */}
    <line x1="0" y1="40" x2="310" y2="40" stroke="#D8DAE0" strokeWidth="2" />
    <line x1="0" y1="70" x2="310" y2="70" stroke="#D8DAE0" strokeWidth="1.5" />
    <line x1="80" y1="0" x2="80" y2="100" stroke="#D8DAE0" strokeWidth="1.5" />
    <line x1="200" y1="0" x2="200" y2="100" stroke="#D8DAE0" strokeWidth="2" />
    <line x1="140" y1="20" x2="260" y2="90" stroke="#D8DAE0" strokeWidth="1" />
    {/* park area */}
    <rect x="100" y="48" width="70" height="30" rx="6" fill="#D4EDDA" opacity="0.6" />
    {/* pin */}
    <circle cx="155" cy="42" r="8" fill={THEME.colors.danger} opacity="0.15" />
    <circle cx="155" cy="42" r="4" fill={THEME.colors.danger} />
  </svg>
);

/* ── Pet avatar ───────────────────────────────────────────────────────────── */
const PetAvatar = ({ size = 64 }) => (
  <div style={{
    width: size, height: size, borderRadius: '50%', flexShrink: 0,
    background: 'linear-gradient(135deg, #F5C97A 0%, #E8A44A 60%, #C97D2E 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '2.5px solid #FFFFFF',
    boxShadow: '0 2px 10px rgba(201,125,46,0.25)'
  }}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="26" rx="11" ry="8" fill="rgba(255,255,255,0.35)" />
      <circle cx="20" cy="15" r="7" fill="rgba(255,255,255,0.35)" />
      <ellipse cx="14" cy="11" rx="3.5" ry="5" fill="rgba(255,255,255,0.25)" transform="rotate(-15 14 11)" />
      <ellipse cx="26" cy="11" rx="3.5" ry="5" fill="rgba(255,255,255,0.25)" transform="rotate(15 26 11)" />
      <ellipse cx="20" cy="18" rx="2" ry="1.2" fill="rgba(255,255,255,0.6)" />
    </svg>
  </div>
);

/* ── Action row inside card ───────────────────────────────────────────────── */
const ActionRow = ({ icon: Icon, label, color = THEME.colors.accent, last = false }) => (
  <div className="lpa-press" style={{
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '14px 0',
    borderBottom: last ? 'none' : `1px solid ${THEME.colors.divider}`
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: `${color}10`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={18} color={color} strokeWidth={2} />
    </div>
    <span style={{ flex: 1, fontFamily: '"Inter", sans-serif', fontSize: '0.88rem', fontWeight: 500, color }}>{label}</span>
    <ChevronRight size={18} color={THEME.colors.tertiaryText} strokeWidth={2} />
  </div>
);

/* ── Sighting row ─────────────────────────────────────────────────────────── */
const SightingRow = ({ location, time, distance, last = false }) => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 12,
    padding: '14px 0',
    borderBottom: last ? 'none' : `1px solid ${THEME.colors.divider}`
  }}>
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: `${THEME.colors.warning}10`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2
    }}>
      <Eye size={16} color={THEME.colors.warning} strokeWidth={2} />
    </div>
    <div style={{ flex: 1 }}>
      <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.85rem', fontWeight: 500, color: THEME.colors.primaryText, lineHeight: 1.4, marginBottom: 4 }}>
        {location}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={12} color={THEME.colors.tertiaryText} strokeWidth={2} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: THEME.colors.tertiaryText }}>{time}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Navigation size={12} color={THEME.colors.tertiaryText} strokeWidth={2} />
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: THEME.colors.tertiaryText }}>{distance}</span>
        </div>
      </div>
    </div>
  </div>
);

/* ── Main Screen ──────────────────────────────────────────────────────────── */
const LostPetAlertScreen = () => {
  const sightings = [
    { location: 'Near ETH campus, heading toward the lake', time: '2:15 PM', distance: '0.8 km' },
    { location: 'Spotted crossing Zürichberg Park path', time: '1:42 PM', distance: '1.2 km' }
  ];

  return (
    <>
      <GlobalStyles />
      <div className="lpa-font-body" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#E5E5E5', padding: '20px'
      }}>
        {/* iPhone frame */}
        <div className="relative" style={{
          width: 390, height: 844,
          borderRadius: 50, border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F9F9FB',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect x="0" y="6" width="3" height="6" rx="1" fill="#111" />
                <rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111" />
                <rect x="9" y="2" width="3" height="10" rx="1" fill="#111" />
                <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111" />
                <path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
                <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35" />
                <rect x="2" y="2" width="16" height="9" rx="2" fill="#111" />
                <path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4" />
              </svg>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="absolute inset-0 overflow-y-auto lpa-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>

          {/* Spacer for floating header */}
          <div style={{ height: 52, flexShrink: 0 }} />

          {/* Content */}
          <div style={{
            padding: '0 20px 24px',
            display: 'flex', flexDirection: 'column', gap: 16
          }}>

            {/* Status card */}
            <div style={{
              background: 'rgba(255,59,48,0.04)',
              borderRadius: 20, padding: 20,
              display: 'flex', alignItems: 'center', gap: 14
            }}>
              <PetAvatar size={64} />
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '1.1rem', color: THEME.colors.primaryText, marginBottom: 2 }}>Luna</p>
                <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.82rem', color: THEME.colors.secondaryText, marginBottom: 6 }}>Golden Retriever</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <AlertTriangle size={13} color={THEME.colors.danger} strokeWidth={2.5} />
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', fontWeight: 600, color: THEME.colors.danger }}>Missing since Mar 15</span>
                </div>
              </div>
            </div>

            {/* Last seen location */}
            <div style={{
              background: THEME.colors.surface, borderRadius: 20, padding: 20,
              boxShadow: THEME.shadows.soft
            }}>
              <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.82rem', color: THEME.colors.tertiaryText, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 12 }}>
                Last Seen
              </p>
              <MiniMap />
              <div style={{ marginTop: 14, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <MapPin size={16} color={THEME.colors.accent} strokeWidth={2} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.88rem', fontWeight: 500, color: THEME.colors.primaryText, lineHeight: 1.4 }}>
                    Zurichberg Park, near the east entrance
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Clock size={12} color={THEME.colors.tertiaryText} strokeWidth={2} />
                    <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.75rem', color: THEME.colors.tertiaryText }}>Today at 11:30 AM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Alert actions card */}
            <div style={{
              background: THEME.colors.surface, borderRadius: 20, padding: '4px 20px',
              boxShadow: THEME.shadows.soft
            }}>
              <ActionRow icon={Share2} label="Share Alert" color={THEME.colors.accent} />
              <ActionRow icon={Bell} label="Notify Nearby Users" color={THEME.colors.accent} />
              <ActionRow icon={Phone} label="Contact Shelters" color={THEME.colors.accent} last />
            </div>

            {/* Sightings section */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, padding: '0 2px' }}>
                <p style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 700, fontSize: '0.82rem', color: THEME.colors.tertiaryText, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Sightings
                </p>
                <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '0.78rem', fontWeight: 600, color: THEME.colors.accent }}>
                  2 possible sightings
                </span>
              </div>
              <div style={{
                background: THEME.colors.surface, borderRadius: 20, padding: '0 20px',
                boxShadow: THEME.shadows.soft
              }}>
                {sightings.map((s, i) => (
                  <SightingRow key={i} {...s} last={i === sightings.length - 1} />
                ))}
              </div>
            </div>

            {/* Mark as Found button */}
            <div className="lpa-press" style={{
              background: 'rgba(0,192,96,0.10)',
              borderRadius: 16, padding: '16px 20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              marginTop: 4
            }}>
              <Check size={20} color={THEME.colors.success} strokeWidth={2.5} />
              <span style={{ fontFamily: '"Nunito", sans-serif', fontWeight: 800, fontSize: '0.95rem', color: THEME.colors.success }}>
                Mark as Found
              </span>
            </div>
          </div>
          </div>

          {/* Floating Header */}
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              {/* Left: Back button */}
              <button
                onClick={() => { window.history.back(); }}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              >
                <ChevronLeft size={22} color="#111111" />
              </button>
              {/* Center: Title */}
              <h2 className="text-[17px] font-semibold text-[#111111]">Lost Pet Alert</h2>
              {/* Right: invisible spacer */}
              <div className="w-[44px]" />
            </div>
          </header>
        </div>
      </div>
    </>
  );
};

export default LostPetAlertScreen;
