import React, { useState } from 'react';
import {
  ChevronLeft,
  Bell,
  Calendar,
  Heart,
  MessageCircle,
  MapPin,
  AlertTriangle,
  Star,
  Settings,
  Clock,
  Moon,
  Mail,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// THEME – Fylos Design System
// ---------------------------------------------------------------------------
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
    divider: '#E5E5E5',
  },
  radius: { large: '24px', medium: '16px', small: '8px' },
  shadows: { soft: '0 4px 20px rgba(0,0,0,0.03)' },
};

// ---------------------------------------------------------------------------
// GLOBAL STYLES
// ---------------------------------------------------------------------------
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .notif-prefs-screen {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: ${THEME.colors.background};
      color: ${THEME.colors.primaryText};
      overflow: hidden;
    }

    .notif-prefs-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .notif-prefs-scroll::-webkit-scrollbar { display: none; }

    .np-tap {
      transition: opacity 120ms ease, transform 120ms ease;
      cursor: pointer;
    }
    .np-tap:active { opacity: 0.7; transform: scale(0.97); }

    /* Toggle switch – 48x28 per spec */
    .np-toggle-track {
      width: 48px;
      height: 28px;
      border-radius: 999px;
      position: relative;
      transition: background 200ms ease;
      flex-shrink: 0;
      cursor: pointer;
    }
    .np-toggle-thumb {
      position: absolute;
      top: 3px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #FFFFFF;
      box-shadow: 0 2px 6px rgba(0,0,0,0.18);
      transition: left 200ms cubic-bezier(0.34,1.56,0.64,1);
    }

    .np-card {
      background: ${THEME.colors.surface};
      border-radius: 20px;
      padding: 20px;
      box-shadow: ${THEME.shadows.soft};
      border: 1px solid rgba(0,0,0,0.03);
    }

    .np-row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px 0;
    }
    .np-row-divider {
      border-bottom: 1px solid ${THEME.colors.divider};
    }

    .np-icon-bubble {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .np-section-label {
      font-size: 13px;
      font-weight: 600;
      color: ${THEME.colors.tertiaryText};
      letter-spacing: 0.4px;
      text-transform: uppercase;
      margin-bottom: 10px;
      padding-left: 4px;
    }

    @keyframes npFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .np-fade-in {
      animation: npFadeIn 200ms ease forwards;
    }
  `}</style>
);

// ---------------------------------------------------------------------------
// TOGGLE COMPONENT
// ---------------------------------------------------------------------------
const Toggle = ({ value, onChange }) => (
  <div
    className="np-toggle-track np-tap"
    onClick={() => onChange(!value)}
    style={{ background: value ? THEME.colors.accent : THEME.colors.surfaceAlt }}
  >
    <div
      className="np-toggle-thumb"
      style={{ left: value ? '23px' : '3px' }}
    />
  </div>
);

// ---------------------------------------------------------------------------
// CATEGORY DATA
// ---------------------------------------------------------------------------
const CATEGORIES = [
  { id: 'bookings', label: 'Bookings', caption: 'Confirmations & reminders', Icon: Calendar, iconBg: 'rgba(0,122,255,0.10)', iconColor: '#007AFF', defaultOn: true },
  { id: 'health', label: 'Health Reminders', caption: 'Vaccinations & checkups', Icon: Heart, iconBg: 'rgba(255,59,48,0.10)', iconColor: '#FF3B30', defaultOn: true },
  { id: 'social', label: 'Social', caption: 'Messages & friend requests', Icon: MessageCircle, iconBg: 'rgba(0,192,96,0.10)', iconColor: '#00C060', defaultOn: true },
  { id: 'walks', label: 'Walk Updates', caption: 'Real-time walk tracking', Icon: MapPin, iconBg: 'rgba(232,93,42,0.10)', iconColor: THEME.colors.accent, defaultOn: true },
  { id: 'community', label: 'Community Alerts', caption: 'Safety reports nearby', Icon: AlertTriangle, iconBg: 'rgba(255,149,0,0.10)', iconColor: '#FF9500', defaultOn: true },
  { id: 'promos', label: 'Promotions', caption: 'Deals & special offers', Icon: Star, iconBg: 'rgba(255,204,0,0.12)', iconColor: '#FFB800', defaultOn: false },
  { id: 'system', label: 'System', caption: 'App updates & maintenance', Icon: Settings, iconBg: 'rgba(142,142,147,0.12)', iconColor: THEME.colors.tertiaryText, defaultOn: true },
];

// StatusBar and HomeIndicator are now inline in the frame

// ---------------------------------------------------------------------------
// MAIN SCREEN
// ---------------------------------------------------------------------------
const NotificationPrefsScreen = () => {
  const initToggles = {};
  CATEGORIES.forEach(c => { initToggles[c.id] = c.defaultOn; });

  const [pushOn, setPushOn] = useState(true);
  const [prefs, setPrefs] = useState(initToggles);
  const [quietHours, setQuietHours] = useState(true);
  const [emailOn, setEmailOn] = useState(true);

  const handleMaster = (val) => {
    setPushOn(val);
    if (!val) {
      const off = {};
      CATEGORIES.forEach(c => { off[c.id] = false; });
      setPrefs(off);
    }
  };

  const handlePref = (id, val) => {
    const updated = { ...prefs, [id]: val };
    setPrefs(updated);
    const anyOn = Object.values(updated).some(Boolean);
    if (anyOn && !pushOn) setPushOn(true);
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#E5E5E5', padding: '20px', fontFamily: 'Inter, sans-serif' }}>

        {/* iPhone Frame */}
        <div className="relative" style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F9F9FB',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
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
              <h2 className="text-[17px] font-semibold text-[#111111]">Notifications</h2>
              {/* Right: Invisible spacer */}
              <div className="w-[44px]" />
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="absolute inset-0 overflow-y-auto notif-prefs-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>

          {/* Header spacer */}
          <div style={{ height: 54 }} />

          <div style={{ padding: '0 20px 24px' }}>

            {/* ── Master Toggle Card ── */}
            <div className="np-card" style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 14,
                background: pushOn ? 'rgba(232,93,42,0.10)' : THEME.colors.surfaceAlt,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 200ms ease',
              }}>
                <Bell size={22} color={pushOn ? THEME.colors.accent : THEME.colors.tertiaryText} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: THEME.colors.primaryText, marginBottom: 2 }}>Push Notifications</div>
                <div style={{ fontSize: 13, color: THEME.colors.secondaryText, fontWeight: 400 }}>
                  {pushOn ? 'Receiving alerts' : 'All notifications paused'}
                </div>
              </div>
              <Toggle value={pushOn} onChange={handleMaster} />
            </div>

            {/* ── Category Section ── */}
            <div className="np-section-label">Categories</div>
            <div className="np-card" style={{ padding: 0, marginBottom: 24 }}>
              {CATEGORIES.map((cat, idx) => {
                const { Icon } = cat;
                const isLast = idx === CATEGORIES.length - 1;
                return (
                  <div
                    key={cat.id}
                    className={!isLast ? 'np-row np-row-divider' : 'np-row'}
                    style={{ paddingLeft: 20, paddingRight: 20, opacity: pushOn ? 1 : 0.4, transition: 'opacity 200ms ease' }}
                  >
                    <div className="np-icon-bubble" style={{ background: cat.iconBg }}>
                      <Icon size={18} color={cat.iconColor} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText, marginBottom: 2 }}>{cat.label}</div>
                      <div style={{ fontSize: 12, color: THEME.colors.tertiaryText, fontWeight: 400 }}>{cat.caption}</div>
                    </div>
                    <Toggle value={prefs[cat.id]} onChange={(v) => handlePref(cat.id, v)} />
                  </div>
                );
              })}
            </div>

            {/* ── Quiet Hours ── */}
            <div className="np-section-label">Quiet Hours</div>
            <div className="np-card" style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className="np-icon-bubble" style={{ background: 'rgba(88,86,214,0.10)' }}>
                  <Moon size={18} color="#5856D6" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText, marginBottom: 2 }}>Do Not Disturb</div>
                  <div style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>Silence notifications</div>
                </div>
                <Toggle value={quietHours} onChange={setQuietHours} />
              </div>

              {quietHours && (
                <div className="np-fade-in" style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0,
                  background: THEME.colors.surfaceAlt,
                  borderRadius: THEME.radius.small,
                  padding: '14px 16px',
                  marginTop: 16,
                }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: THEME.colors.tertiaryText, fontWeight: 600, marginBottom: 4, letterSpacing: '0.3px' }}>FROM</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Clock size={14} color={THEME.colors.secondaryText} />
                      <span style={{ fontSize: 18, fontWeight: 700, color: THEME.colors.primaryText, letterSpacing: '-0.5px' }}>22:00</span>
                    </div>
                  </div>
                  <div style={{ width: 1, height: 36, background: THEME.colors.divider }} />
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: THEME.colors.tertiaryText, fontWeight: 600, marginBottom: 4, letterSpacing: '0.3px' }}>TO</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <Clock size={14} color={THEME.colors.secondaryText} />
                      <span style={{ fontSize: 18, fontWeight: 700, color: THEME.colors.primaryText, letterSpacing: '-0.5px' }}>07:00</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── Email Notifications ── */}
            <div className="np-section-label">Other</div>
            <div className="np-card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="np-icon-bubble" style={{ background: 'rgba(0,122,255,0.10)' }}>
                <Mail size={18} color="#007AFF" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText, marginBottom: 2 }}>Email Notifications</div>
                <div style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>Weekly digest & updates</div>
              </div>
              <Toggle value={emailOn} onChange={setEmailOn} />
            </div>

            {/* Bottom spacer */}
            <div style={{ height: 20 }} />
          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPrefsScreen;
