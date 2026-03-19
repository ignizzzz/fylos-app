import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Shield,
  MapPin,
  Calendar,
  Clock,
  Check,
  User,
  Settings,
  ArrowRight,
  Phone,
  Mail,
  Camera,
  PawPrint,
  Home,
  Bell,
  Circle,
  X,
} from 'lucide-react';

/**
 * 55_PRO_PROFILE_v1.jsx
 * Professional Profile Management screen for Fylos PRO.
 * Revolut-inspired dark premium design with Fylos accent colors.
 */

// ─── PRO THEME ───────────────────────────────────────────────────────────────
const THEME = {
  colors: {
    accent: '#E85D2A',
    accentLight: '#FF7240',
    accentGlow: 'rgba(232,93,42,0.15)',
    primaryText: '#FFFFFF',
    secondaryText: 'rgba(255,255,255,0.55)',
    tertiaryText: 'rgba(255,255,255,0.35)',
    background: '#0D1B2A',
    surface: '#142232',
    surfaceAlt: '#1B2D3E',
    danger: '#FF4444',
    divider: 'rgba(255,255,255,0.08)',
  },
  radius: {
    full: '9999px',
    card: '20px',
    medium: '16px',
    small: '8px',
  },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.2)',
    floating: '0 8px 24px rgba(0,0,0,0.3)',
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

const C = THEME.colors;

// ─── GLOBAL STYLES ───────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .pro-profile-screen {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .phone-scroll::-webkit-scrollbar { display: none; }
    .phone-scroll { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .slide-in { animation: slideInUp 280ms ease both; }
    .fade-in  { animation: fadeIn 200ms ease both; }

    .btn-press {
      transition: transform 120ms ease, opacity 120ms ease;
    }
    .btn-press:active {
      transform: scale(0.96);
      opacity: 0.85;
    }

    .row-press {
      transition: background 140ms ease;
      cursor: pointer;
    }
    .row-press:active {
      background: rgba(255,255,255,0.04) !important;
    }

    .day-chip {
      transition: background 160ms ease, color 160ms ease;
      cursor: pointer;
      user-select: none;
    }
    .day-chip:active {
      transform: scale(0.93);
    }
  `}</style>
);

// ─── CARD ────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.surface,
    borderRadius: THEME.radius.card,
    padding: '20px',
    boxShadow: THEME.shadows.soft,
    ...style,
  }}>
    {children}
  </div>
);

// ─── DATA ────────────────────────────────────────────────────────────────────
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const INITIAL_SERVICES = [
  { id: 1, name: '30 min walk', price: 'CHF 22' },
  { id: 2, name: '60 min walk', price: 'CHF 35' },
  { id: 3, name: 'Group walk (2+ dogs)', price: 'CHF 28/dog' },
  { id: 4, name: 'Puppy walk', price: 'CHF 30' },
];

const INITIAL_DAYS = { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: true, Sun: false };

const CERTIFICATIONS = [
  { id: 1, title: 'Pet First Aid', subtitle: 'Certified 2024' },
  { id: 2, title: 'Dog Behavior Specialist', subtitle: 'Zurich Academy' },
  { id: 3, title: 'Animal CPR', subtitle: 'Certified 2023' },
];

const PRO_TABS = [
  { icon: Home, label: 'Dashboard', href: '/pro-dashboard' },
  { icon: Bell, label: 'Requests', href: '/pro-requests' },
  { icon: Calendar, label: 'Schedule', href: null },
  { icon: Circle, label: 'Earnings', href: '/pro-earnings' },
  { icon: User, label: 'Profile', href: null },
];

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const ProProfileScreen = () => {
  const [activeDays, setActiveDays] = useState(INITIAL_DAYS);
  const [bioText, setBioText] = useState(
    'Passionate dog walker with 3 years experience. I treat every dog like my own! Based in Zurich, available weekdays and Saturdays.'
  );
  const [editingBio, setEditingBio] = useState(false);

  const toggleDay = (day) =>
    setActiveDays(prev => ({ ...prev, [day]: !prev[day] }));

  return (
    <div className="pro-profile-screen" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A1220',
      padding: '20px',
    }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#0D1B2A', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column' }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 9999 }} />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="6" width="3" height="6" rx="1" fill="#FFFFFF" />
              <rect x="4.5" y="4" width="3" height="8" rx="1" fill="#FFFFFF" />
              <rect x="9" y="2" width="3" height="10" rx="1" fill="#FFFFFF" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#FFFFFF" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#FFFFFF" />
              <path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
              <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#FFFFFF" strokeOpacity="0.35" />
              <rect x="2" y="2" width="16" height="9" rx="2" fill="#FFFFFF" />
              <path d="M23 4.5v4a2 2 0 000-4z" fill="#FFFFFF" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(13,27,42,0.95) 0%, rgba(13,27,42,0.7) 60%, transparent 100%)', paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            {/* Left: Back button */}
            <button
              onClick={() => { window.history.back(); }}
              className="btn-press"
              style={{
                width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: C.surface,
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                borderRadius: 9999,
                cursor: 'pointer',
              }}
            >
              <ChevronLeft size={22} color="#FFFFFF" />
            </button>
            {/* Center: Title */}
            <h2 style={{ fontSize: 17, fontWeight: 600, color: '#FFFFFF', margin: 0 }}>Profile</h2>
            {/* Right: Edit button */}
            <button
              onClick={() => {}}
              className="btn-press"
              style={{
                width: 44, height: 44,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: C.surface,
                border: '1px solid rgba(255,255,255,0.06)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                borderRadius: 9999,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: C.accent }}>Edit</span>
            </button>
          </div>
        </header>

        {/* Status bar spacer */}
        <div style={{ height: 54, flexShrink: 0 }} />

          {/* Scrollable Body */}
          <div
            className="phone-scroll"
            style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px 16px', paddingTop: 54 }}
          >

            {/* Profile Header */}
            <div className="slide-in" style={{ animationDelay: '0ms' }}>
              <Card>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                  {/* Photo */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{
                      width: 80, height: 80,
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentLight} 100%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: `0 4px 20px ${C.accentGlow}`,
                    }}>
                      <User size={34} color="rgba(255,255,255,0.9)" />
                    </div>
                    <button className="btn-press" style={{
                      position: 'absolute', bottom: -2, right: -2,
                      width: 26, height: 26,
                      borderRadius: '50%',
                      background: C.accent,
                      border: `2px solid ${C.surface}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(232,93,42,0.4)',
                    }}>
                      <Camera size={12} color="#fff" />
                    </button>
                  </div>

                  {/* Name, role, rating, member since */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.primaryText, marginBottom: 4 }}>
                      Sarah Lehmann
                    </div>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      background: C.accentGlow,
                      borderRadius: THEME.radius.full,
                      padding: '3px 10px',
                      marginBottom: 8,
                    }}>
                      <PawPrint size={11} color={C.accent} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: C.accent }}>Dog Walker</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                      <Star size={13} color="#FFB800" fill="#FFB800" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: C.primaryText }}>4.9</span>
                      <span style={{ fontSize: 11, color: C.tertiaryText }}>(47 reviews)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} color={C.tertiaryText} />
                      <span style={{ fontSize: 11, color: C.tertiaryText }}>Member since March 2025</span>
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { label: 'Walks completed', value: '234' },
                    { label: 'Repeat clients', value: '78%' },
                    { label: 'Avg rating', value: '4.9' },
                  ].map((stat) => (
                    <div key={stat.label} style={{
                      flex: 1,
                      background: C.surfaceAlt,
                      borderRadius: THEME.radius.full,
                      padding: '10px 8px',
                      textAlign: 'center',
                    }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.accent, lineHeight: 1.1 }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: 9, color: C.tertiaryText, marginTop: 3, fontWeight: 500, lineHeight: 1.2 }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* About */}
            <div className="slide-in" style={{ animationDelay: '40ms' }}>
              <Card>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.primaryText, marginBottom: 10 }}>About</div>
                {editingBio ? (
                  <div>
                    <textarea
                      value={bioText}
                      onChange={e => setBioText(e.target.value)}
                      style={{
                        width: '100%',
                        minHeight: 72,
                        border: `1.5px solid ${C.accent}`,
                        borderRadius: THEME.radius.small,
                        padding: '10px 12px',
                        fontSize: 13,
                        fontFamily: 'Inter, sans-serif',
                        color: C.primaryText,
                        resize: 'none',
                        outline: 'none',
                        lineHeight: 1.55,
                        background: C.surfaceAlt,
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                      <button
                        className="btn-press"
                        onClick={() => setEditingBio(false)}
                        style={{
                          background: C.surfaceAlt, border: 'none',
                          borderRadius: THEME.radius.full,
                          padding: '7px 16px',
                          fontSize: 12, fontWeight: 600, color: C.secondaryText,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn-press"
                        onClick={() => setEditingBio(false)}
                        style={{
                          background: C.accent, border: 'none',
                          borderRadius: THEME.radius.full,
                          padding: '7px 18px',
                          fontSize: 12, fontWeight: 700, color: '#fff',
                          cursor: 'pointer',
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="row-press"
                    onClick={() => setEditingBio(true)}
                    style={{ borderRadius: THEME.radius.small, margin: '-4px', padding: '4px' }}
                  >
                    <p style={{ fontSize: 13, color: C.secondaryText, lineHeight: 1.55 }}>
                      {bioText}
                    </p>
                  </div>
                )}
              </Card>
            </div>

            {/* Services & Pricing */}
            <div className="slide-in" style={{ animationDelay: '80ms' }}>
              <Card style={{ padding: 0 }}>
                <div style={{ padding: '20px 20px 0' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.primaryText, marginBottom: 4 }}>Services & Pricing</div>
                </div>
                <div>
                  {INITIAL_SERVICES.map((svc, idx) => (
                    <div
                      key={svc.id}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 20px',
                        borderBottom: idx < INITIAL_SERVICES.length - 1 ? `1px solid ${C.divider}` : 'none',
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 500, color: C.primaryText }}>{svc.name}</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: C.accent }}>{svc.price}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Availability */}
            <div className="slide-in" style={{ animationDelay: '120ms' }}>
              <Card>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.primaryText, marginBottom: 14 }}>Availability</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {DAYS.map(day => {
                    const active = activeDays[day];
                    return (
                      <div
                        key={day}
                        className="day-chip"
                        onClick={() => toggleDay(day)}
                        style={{
                          flex: 1,
                          padding: '10px 0',
                          borderRadius: THEME.radius.small,
                          textAlign: 'center',
                          background: active ? C.accent : C.surfaceAlt,
                          fontSize: 11,
                          fontWeight: 700,
                          color: active ? '#fff' : C.tertiaryText,
                        }}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Certifications */}
            <div className="slide-in" style={{ animationDelay: '160ms' }}>
              <Card style={{ padding: 0 }}>
                <div style={{ padding: '20px 20px 0' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.primaryText, marginBottom: 4 }}>Certifications</div>
                </div>
                <div>
                  {CERTIFICATIONS.map((cert, idx) => (
                    <div
                      key={cert.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '14px 20px',
                        borderBottom: idx < CERTIFICATIONS.length - 1 ? `1px solid ${C.divider}` : 'none',
                      }}
                    >
                      <div style={{
                        width: 36, height: 36,
                        borderRadius: THEME.radius.small,
                        background: C.accentGlow,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Shield size={16} color={C.accent} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.primaryText }}>{cert.title}</div>
                        <div style={{ fontSize: 11, color: C.tertiaryText, marginTop: 2 }}>{cert.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Service Area */}
            <div className="slide-in" style={{ animationDelay: '200ms' }}>
              <Card>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.primaryText, marginBottom: 12 }}>Service Area</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: THEME.radius.small,
                    background: C.accentGlow,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <MapPin size={16} color={C.accent} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.primaryText }}>Zurich, 5km radius</div>
                    <div style={{ fontSize: 11, color: C.tertiaryText, marginTop: 2 }}>Covers central Zurich area</div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Switch to Client Mode */}
            <div className="slide-in" style={{ animationDelay: '240ms' }}>
              <div
                className="row-press"
                onClick={() => { window.location.href = '/'; }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: C.surface,
                  borderRadius: THEME.radius.card,
                  padding: '16px 20px',
                  boxShadow: THEME.shadows.soft,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>Switch to Client Mode</span>
                <ArrowRight size={18} color={C.accent} />
              </div>
            </div>

            {/* Log Out */}
            <div className="slide-in" style={{ animationDelay: '280ms' }}>
              <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
                <button
                  className="btn-press"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 14, fontWeight: 600, color: C.danger,
                    padding: '8px 16px',
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>

            {/* Bottom spacer for tab bar */}
            <div style={{ height: 4 }} />
          </div>

          {/* Bottom Tab Bar (PRO) */}
          <div style={{
            flexShrink: 0,
            background: C.surface,
            borderTop: `1px solid ${C.divider}`,
            display: 'flex',
            padding: '8px 0 0',
          }}>
            {PRO_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.label === 'Profile';
              return (
                <div
                  key={tab.label}
                  className="btn-press"
                  onClick={() => {
                    if (tab.href) {
                      window.location.href = tab.href;
                    } else if (tab.label === 'Schedule') {
                      alert('Schedule coming soon');
                    }
                  }}
                  style={{
                    flex: 1,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                    padding: '4px 0 2px',
                    cursor: 'pointer',
                  }}
                >
                  <Icon
                    size={20}
                    color={isActive ? C.accent : C.tertiaryText}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span style={{
                    fontSize: 10,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? C.accent : C.tertiaryText,
                  }}>
                    {tab.label}
                  </span>
                </div>
              );
            })}
          </div>

      </div>
    </div>
  );
};

export default ProProfileScreen;
