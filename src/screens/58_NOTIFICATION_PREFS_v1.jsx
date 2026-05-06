import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, Bell, Calendar, Heart, MessageCircle, MapPin,
  AlertTriangle, Star, Settings, Mail,
} from 'lucide-react';

/**
 * 58_NOTIFICATION_PREFS_v1.jsx
 * Simple notifications screen — master, categories, quiet hours, email.
 */

const THEME = {
  bg: '#F7F5F2', card: '#FFFFFF', divider: '#F1EDE8',
  coral: '#E85D2A', txt: '#111111', muted: '#9B9B9F', tint: '#FBE7DD',
};

const CATEGORIES = [
  { id: 'bookings',  label: 'Bookings',         caption: 'Confirmations & reminders', Icon: Calendar,      tint: 'rgba(0,122,255,0.10)',  color: '#007AFF', defaultOn: true  },
  { id: 'health',    label: 'Health Reminders', caption: 'Vaccinations & checkups',    Icon: Heart,         tint: 'rgba(255,59,48,0.10)',  color: '#FF3B30', defaultOn: true  },
  { id: 'social',    label: 'Social',           caption: 'Messages & friend requests', Icon: MessageCircle, tint: 'rgba(52,199,89,0.12)',  color: '#2EA849', defaultOn: true  },
  { id: 'walks',     label: 'Walk Updates',     caption: 'Real-time walk tracking',    Icon: MapPin,        tint: 'rgba(232,93,42,0.12)',  color: '#E85D2A', defaultOn: true  },
  { id: 'community', label: 'Community Alerts', caption: 'Safety reports nearby',      Icon: AlertTriangle, tint: 'rgba(245,158,11,0.14)', color: '#F59E0B', defaultOn: true  },
  { id: 'promos',    label: 'Promotions',       caption: 'Deals & special offers',     Icon: Star,          tint: 'rgba(245,158,11,0.14)', color: '#F59E0B', defaultOn: false },
  { id: 'system',    label: 'System',           caption: 'App updates & maintenance',  Icon: Settings,      tint: 'rgba(142,142,147,0.14)', color: '#8E8E93', defaultOn: true  },
];

/* ────────── Canonical transparent header ────────── */
const AppHeader = ({ title, onBack }) => (
  <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none">
    <button
      onClick={onBack}
      className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
    >
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: THEME.txt }}>{title}</h1>
  </div>
);

const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="active:scale-[0.97] transition-all duration-[120ms] shrink-0"
    style={{
      width: 46, height: 26, borderRadius: 9999,
      background: value ? THEME.coral : '#D5CEC7',
      position: 'relative', cursor: 'pointer', transition: 'background 200ms ease',
    }}
  >
    <div
      style={{
        position: 'absolute', top: 3, left: value ? 23 : 3,
        width: 20, height: 20, borderRadius: 9999, background: '#FFFFFF',
        boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
        transition: 'left 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    />
  </div>
);

const SectionLabel = ({ children }) => (
  <div className="text-[10.5px] font-semibold text-[#8E8E93] tracking-[0.1em] uppercase mb-1.5 ml-3 mt-5">{children}</div>
);

const ToggleRow = ({ Icon, iconTint, iconColor, title, subtitle, value, onChange, dimmed, last }) => (
  <div className="relative">
    <div
      className="flex items-center gap-3 px-3.5 py-3"
      style={{ opacity: dimmed ? 0.45 : 1, transition: 'opacity 200ms ease' }}
    >
      <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: iconTint }}>
        <Icon size={17} color={iconColor} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14.5px] font-semibold leading-tight" style={{ color: THEME.txt }}>{title}</div>
        {subtitle && <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>{subtitle}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
    {!last && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: THEME.divider }} />}
  </div>
);

const NotificationPrefsScreen = () => {
  const initToggles = useMemo(() => {
    const o = {}; CATEGORIES.forEach((c) => { o[c.id] = c.defaultOn; }); return o;
  }, []);

  const [pushOn, setPushOn] = useState(true);
  const [prefs, setPrefs] = useState(initToggles);
  const [emailOn, setEmailOn] = useState(true);

  const handleMaster = (val) => {
    setPushOn(val);
    if (!val) {
      const off = {}; CATEGORIES.forEach((c) => { off[c.id] = false; }); setPrefs(off);
    }
  };

  const handlePref = (id, val) => {
    const updated = { ...prefs, [id]: val };
    setPrefs(updated);
    const anyOn = Object.values(updated).some(Boolean);
    if (anyOn && !pushOn) setPushOn(true);
  };

  const back = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  };

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .notif-scroll::-webkit-scrollbar { display: none; }
        .notif-scroll { scrollbar-width: none; }
        @keyframes npFadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .np-fade-in { animation: npFadeIn 220ms ease forwards; }
      `}</style>

      <div
        className="relative"
        style={{
          width: 390, height: 844, borderRadius: 50,
          border: '8px solid #000', overflow: 'hidden',
          backgroundColor: THEME.bg,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        <div className="notif-scroll absolute inset-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <AppHeader title="Notifications" onBack={back} />

          <div className="px-4 pb-10">
            {/* Master toggle */}
            <div className="bg-white rounded-[18px] border border-black/[0.04] p-3.5 flex items-center gap-3 mt-2">
              <div
                className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center shrink-0"
                style={{ backgroundColor: pushOn ? THEME.tint : '#ECE8E3', transition: 'background 200ms ease' }}
              >
                <Bell size={20} color={pushOn ? THEME.coral : THEME.muted} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[15px] font-semibold leading-tight" style={{ color: THEME.txt }}>Push notifications</div>
                <div className="text-[12px] mt-[2px]" style={{ color: THEME.muted }}>
                  {pushOn ? 'Receiving alerts' : 'All notifications paused'}
                </div>
              </div>
              <Toggle value={pushOn} onChange={handleMaster} />
            </div>

            <SectionLabel>Categories</SectionLabel>
            <div className="bg-white rounded-[18px] border border-black/[0.04] overflow-hidden">
              {CATEGORIES.map((cat, idx) => (
                <ToggleRow
                  key={cat.id}
                  Icon={cat.Icon}
                  iconTint={cat.tint}
                  iconColor={cat.color}
                  title={cat.label}
                  subtitle={cat.caption}
                  value={prefs[cat.id]}
                  onChange={(v) => handlePref(cat.id, v)}
                  dimmed={!pushOn}
                  last={idx === CATEGORIES.length - 1}
                />
              ))}
            </div>

            <SectionLabel>Other</SectionLabel>
            <div className="bg-white rounded-[18px] border border-black/[0.04] overflow-hidden">
              <ToggleRow
                Icon={Mail}
                iconTint="rgba(0,122,255,0.10)"
                iconColor="#007AFF"
                title="Email notifications"
                subtitle="Weekly digest & account updates"
                value={emailOn}
                onChange={setEmailOn}
                last
              />
            </div>

            <div className="text-center mt-5 mb-2">
              <p className="text-[10.5px]" style={{ color: '#B8B0A8' }}>Emergency alerts always go through, regardless of settings.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrefsScreen;
