import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  Settings,
  PawPrint,
  Calendar,
  Check,
  ChevronRight,
  ArrowRight,
  Clock,
  Star,
  Heart,
  Plus,
  MapPin,
  Circle,
  X,
  Camera,
  Info,
  AlertCircle,
  Shield
} from 'lucide-react';

/* ─── THEME ─── */
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

/* ─── MOCK DATA ─── */
const PET = {
  name: 'Luna',
  breed: 'Golden Retriever',
  age: '3 years',
  gender: 'Female',
  weight: '28.5 kg',
  birthday: 'March 15, 2023',
  microchip: '756 0934 2817 4',
  neutered: true,
};

const MEDICATIONS = [
  { name: 'Apoquel 16mg', schedule: 'Daily' },
  { name: 'Joint Supplement', schedule: 'Twice daily' },
];

const ACTIVITIES = [
  { title: 'Walk with Sofia L.', date: 'Today, 10:00', detail: '60 min · 3.2 km' },
  { title: 'Grooming at PetStyle', date: 'March 14', detail: 'Bath & trim' },
  { title: 'Vet Visit', date: 'March 10', detail: 'Vaccination booster' },
];

const PHOTO_COLORS = ['#FDEBD0', '#FCE4EC', '#E8F5E9', '#E3F2FD', '#FFF3E0'];

const BOOKINGS = [
  { provider: 'Sofia L.', service: 'Dog Walking', date: 'March 20, 10:00', status: 'Confirmed', avatar: '#FDEBD0' },
  { provider: 'PetStyle Salon', service: 'Full Grooming', date: 'March 25, 14:00', status: 'Confirmed', avatar: '#E3F2FD' },
];

/* ─── COMPONENTS ─── */

// StatusBar and HomeIndicator are now rendered inline in the main component

const SectionLabel = ({ children, action, onAction }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
    <span style={{ fontSize: 16, fontWeight: 600, color: THEME.colors.primaryText }}>{children}</span>
    {action && (
      <button onClick={onAction} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 4,
        fontSize: 13, fontWeight: 500, color: THEME.colors.accent, padding: 0
      }}>
        {action} <ArrowRight size={14} />
      </button>
    )}
  </div>
);

const Pill = ({ children }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    padding: '4px 12px', borderRadius: THEME.radius.full,
    background: THEME.colors.surfaceAlt, fontSize: 12, fontWeight: 500,
    color: THEME.colors.secondaryText, letterSpacing: 0.2
  }}>
    {children}
  </span>
);

const Card = ({ children, style = {} }) => (
  <div style={{
    background: THEME.colors.surface, borderRadius: 20, padding: 20,
    boxShadow: THEME.shadows.soft, ...style
  }}>
    {children}
  </div>
);

/* ─── MAIN SCREEN ─── */
const PetProfileDetailScreen = () => {
  const scrollRef = useRef(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
    <div className="relative" style={{
      width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
      overflow: 'hidden', backgroundColor: '#F9F9FB',
      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif'
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
          <h2 className="text-[17px] font-semibold text-[#111111]">Pet Profile</h2>
          {/* Right: Settings button */}
          <button
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <Settings size={22} color="#111111" />
          </button>
        </div>
      </header>

      {/* Scrollable content */}
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto" style={{
        paddingTop: 54, paddingBottom: 40
      }}>
        {/* ─ Pet photo ─ */}
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <div style={{
            width: '100%', height: 220, borderRadius: THEME.radius.large,
            background: 'linear-gradient(135deg, #FDEBD0, #FCE4EC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden'
          }}>
            <PawPrint size={64} color="rgba(232,93,42,0.3)" strokeWidth={1.5} />
          </div>
        </div>

        {/* ─ Name / breed / badges ─ */}
        <div style={{ padding: '0 20px', marginBottom: 20, textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: THEME.colors.primaryText, margin: '0 0 2px' }}>
            {PET.name}
          </h1>
          <p style={{ fontSize: 15, color: THEME.colors.secondaryText, margin: '0 0 10px' }}>
            {PET.breed}
          </p>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Pill>{PET.age}</Pill>
            <Pill>{'\u2640'} {PET.gender}</Pill>
          </div>
        </div>

        {/* ─ Quick info grid 2×2 ─ */}
        <div style={{ padding: '0 20px', marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { label: 'Weight', value: PET.weight, sub: '↗ trending' },
              { label: 'Birthday', value: PET.birthday, sub: null },
              { label: 'Microchip', value: '756 0934 ...', sub: null },
              { label: 'Neutered', value: 'Yes ✓', sub: null },
            ].map((item, i) => (
              <div key={i} style={{
                background: THEME.colors.surfaceAlt, borderRadius: THEME.radius.medium,
                padding: 14
              }}>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: THEME.colors.tertiaryText,
                  textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 4
                }}>{item.label}</span>
                <span style={{ fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText }}>
                  {item.value}
                </span>
                {item.sub && (
                  <span style={{ fontSize: 12, color: THEME.colors.success, display: 'block', marginTop: 2 }}>
                    {item.sub}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ─ Health Overview ─ */}
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <Card>
            <SectionLabel>Health</SectionLabel>

            {/* Next vet visit */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: THEME.colors.surfaceAlt,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Calendar size={18} color={THEME.colors.accent} />
              </div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 500, color: THEME.colors.primaryText, display: 'block' }}>
                  Annual Checkup
                </span>
                <span style={{ fontSize: 12, color: THEME.colors.secondaryText }}>April 12</span>
              </div>
            </div>

            {/* Vaccinations */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: THEME.colors.surfaceAlt,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Shield size={18} color={THEME.colors.accent} />
              </div>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 14, fontWeight: 500, color: THEME.colors.primaryText, display: 'block', marginBottom: 4 }}>
                  Vaccinations · 5/6 up to date
                </span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5,6].map(n => (
                    <div key={n} style={{
                      width: 8, height: 8, borderRadius: THEME.radius.full,
                      background: n <= 5 ? THEME.colors.accent : THEME.colors.divider
                    }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Allergies */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: THEME.colors.surfaceAlt,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <AlertCircle size={18} color={THEME.colors.warning} />
              </div>
              <div>
                <span style={{ fontSize: 14, fontWeight: 500, color: THEME.colors.primaryText, display: 'block' }}>Allergies</span>
                <span style={{ fontSize: 12, color: THEME.colors.secondaryText }}>Chicken, Pollen</span>
              </div>
            </div>

            {/* Last weight */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: THEME.colors.surfaceAlt,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
              }}>
                <Check size={18} color={THEME.colors.success} />
              </div>
              <span style={{ fontSize: 14, fontWeight: 500, color: THEME.colors.primaryText }}>
                28.5 kg · stable
              </span>
            </div>
          </Card>
        </div>

        {/* ─ Medications ─ */}
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <Card>
            <SectionLabel>Medications</SectionLabel>

            {MEDICATIONS.map((med, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: i < MEDICATIONS.length - 1 ? 12 : 14
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: THEME.colors.surfaceAlt,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Clock size={18} color={THEME.colors.accent} />
                </div>
                <div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: THEME.colors.primaryText, display: 'block' }}>
                    {med.name}
                  </span>
                  <span style={{ fontSize: 12, color: THEME.colors.secondaryText }}>{med.schedule}</span>
                </div>
              </div>
            ))}

            <button style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 14, fontWeight: 500, color: THEME.colors.accent
            }}>
              <Plus size={16} /> Add Medication
            </button>
          </Card>
        </div>

        {/* ─ Recent Activity ─ */}
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <Card>
            <SectionLabel action="See all" onAction={() => window.location.href = '/'}>Activity</SectionLabel>

            {ACTIVITIES.map((act, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12,
                marginBottom: i < ACTIVITIES.length - 1 ? 14 : 0,
                position: 'relative', paddingLeft: 20
              }}>
                {/* Timeline dot + line */}
                <div style={{
                  position: 'absolute', left: 0, top: 6,
                  width: 10, height: 10, borderRadius: THEME.radius.full,
                  background: THEME.colors.accent
                }} />
                {i < ACTIVITIES.length - 1 && (
                  <div style={{
                    position: 'absolute', left: 4, top: 18,
                    width: 2, height: 'calc(100% - 4px)',
                    background: THEME.colors.divider
                  }} />
                )}

                <div>
                  <span style={{ fontSize: 14, fontWeight: 500, color: THEME.colors.primaryText, display: 'block' }}>
                    {act.title}
                  </span>
                  <span style={{ fontSize: 12, color: THEME.colors.tertiaryText, display: 'block', marginTop: 1 }}>
                    {act.date}
                  </span>
                  <span style={{ fontSize: 12, color: THEME.colors.secondaryText, display: 'block', marginTop: 1 }}>
                    {act.detail}
                  </span>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* ─ Photo Gallery ─ */}
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <SectionLabel action="See all" onAction={() => window.location.href = '/photo-gallery'}>Photos</SectionLabel>
          <div style={{
            display: 'flex', gap: 10, overflowX: 'auto',
            WebkitOverflowScrolling: 'touch', paddingBottom: 4
          }}>
            {PHOTO_COLORS.map((color, i) => (
              <div key={i} style={{
                width: 80, height: 80, borderRadius: 12, flexShrink: 0,
                background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Camera size={20} color="rgba(0,0,0,0.15)" />
              </div>
            ))}
          </div>
        </div>

        {/* ─ Upcoming Bookings ─ */}
        <div style={{ padding: '0 20px', marginBottom: 16 }}>
          <SectionLabel>Upcoming</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BOOKINGS.map((b, i) => (
              <Card key={i} style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Provider avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: THEME.radius.full, flexShrink: 0,
                    background: `linear-gradient(135deg, ${b.avatar}, ${b.avatar}dd)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Star size={18} color="rgba(0,0,0,0.15)" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText, display: 'block' }}>
                      {b.provider}
                    </span>
                    <span style={{ fontSize: 13, color: THEME.colors.secondaryText, display: 'block', marginTop: 1 }}>
                      {b.service} · {b.date}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: THEME.colors.success,
                    background: `${THEME.colors.success}14`, padding: '4px 10px',
                    borderRadius: THEME.radius.full
                  }}>
                    {b.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom spacer for sticky button */}
        <div style={{ height: 80 }} />
      </div>

      {/* ─ Sticky bottom action ─ */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '12px 20px 34px',
        background: 'linear-gradient(transparent, rgba(249,249,251,0.95) 20%)',
        zIndex: 10
      }}>
        <button onClick={() => window.location.href = '/booking-flow'} style={{
          width: '100%', height: 52, borderRadius: THEME.radius.medium,
          background: 'linear-gradient(135deg, #FF7240, #E85D2A)',
          border: 'none', cursor: 'pointer',
          fontSize: 16, fontWeight: 600, color: '#FFFFFF',
          boxShadow: `0 4px 16px ${THEME.colors.accent}40`,
          transition: `transform ${THEME.motion.tap}`
        }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          Book Service
        </button>
      </div>
    </div>
    </div>
  );
};

export default PetProfileDetailScreen;
