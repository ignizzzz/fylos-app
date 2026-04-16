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
  Mail,
} from 'lucide-react';

/**
 * 58_NOTIFICATION_PREFS_v1.jsx
 * Notification preferences screen for the Fylos pet care app.
 * Master toggle, category toggles, quiet hours, email notifications.
 */

const CATEGORIES = [
  { id: 'bookings', label: 'Bookings', caption: 'Confirmations & reminders', Icon: Calendar, iconBg: 'rgba(0,122,255,0.10)', iconColor: '#007AFF', defaultOn: true },
  { id: 'health', label: 'Health Reminders', caption: 'Vaccinations & checkups', Icon: Heart, iconBg: 'rgba(255,59,48,0.10)', iconColor: '#FF3B30', defaultOn: true },
  { id: 'social', label: 'Social', caption: 'Messages & friend requests', Icon: MessageCircle, iconBg: 'rgba(52,199,89,0.10)', iconColor: '#34C759', defaultOn: true },
  { id: 'walks', label: 'Walk Updates', caption: 'Real-time walk tracking', Icon: MapPin, iconBg: 'rgba(232,93,42,0.10)', iconColor: '#E85D2A', defaultOn: true },
  { id: 'community', label: 'Community Alerts', caption: 'Safety reports nearby', Icon: AlertTriangle, iconBg: 'rgba(255,149,0,0.10)', iconColor: '#FF9500', defaultOn: true },
  { id: 'promos', label: 'Promotions', caption: 'Deals & special offers', Icon: Star, iconBg: 'rgba(255,204,0,0.12)', iconColor: '#FFB800', defaultOn: false },
  { id: 'system', label: 'System', caption: 'App updates & maintenance', Icon: Settings, iconBg: 'rgba(160,154,148,0.12)', iconColor: '#A09A94', defaultOn: true },
];

const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="active:scale-[0.97] transition-all duration-[120ms]"
    style={{
      width: 48,
      height: 28,
      borderRadius: 9999,
      background: value ? '#E85D2A' : '#D5CEC7',
      position: 'relative',
      flexShrink: 0,
      cursor: 'pointer',
      transition: 'background 200ms ease',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 3,
        left: value ? 23 : 3,
        width: 22,
        height: 22,
        borderRadius: 9999,
        background: '#FFFFFF',
        boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
        transition: 'left 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    />
  </div>
);

const NotificationPrefsScreen = () => {
  const initToggles = {};
  CATEGORIES.forEach((c) => { initToggles[c.id] = c.defaultOn; });

  const [pushOn, setPushOn] = useState(true);
  const [prefs, setPrefs] = useState(initToggles);
  const [quietHours, setQuietHours] = useState(true);
  const [emailOn, setEmailOn] = useState(true);

  const handleMaster = (val) => {
    setPushOn(val);
    if (!val) {
      const off = {};
      CATEGORIES.forEach((c) => { off[c.id] = false; });
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#EDE8E2',
        padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .notif-scroll::-webkit-scrollbar { display: none; }
        .notif-scroll { scrollbar-width: none; }
        @keyframes npFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .np-fade-in { animation: npFadeIn 200ms ease forwards; }
      `}</style>

      {/* iPhone Frame */}
      <div
        className="relative"
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F7F5F2',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[100]"
          style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }}
        />

        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
          style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }}
        />

        {/* Status bar */}
        <div
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
          style={{ height: 54 }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Floating Header */}
        <header
          className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent"
          style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}
        >
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button
              onClick={() => window.history.back()}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
            >
              <ChevronLeft size={22} color="#111111" />
            </button>
            <h2 className="text-[17px] font-semibold text-[#111111]">Notifications</h2>
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Scroll Content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            className="notif-scroll absolute inset-0 overflow-y-auto pt-[110px] pb-[140px] px-5"
            style={{ scrollbarWidth: 'none' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>

              {/* Master Toggle Card */}
              <div
                className="rounded-[20px] p-5"
                style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: pushOn ? 'rgba(232,93,42,0.10)' : '#EDE8E2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'background 200ms ease',
                    }}
                  >
                    <Bell size={22} color={pushOn ? '#E85D2A' : '#A09A94'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#111111', marginBottom: 2 }}>
                      Push Notifications
                    </div>
                    <div style={{ fontSize: 13, color: '#6E6058', fontWeight: 400 }}>
                      {pushOn ? 'Receiving alerts' : 'All notifications paused'}
                    </div>
                  </div>
                  <Toggle value={pushOn} onChange={handleMaster} />
                </div>
              </div>

              {/* Category Section */}
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#A09A94',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 10,
                    paddingLeft: 4,
                  }}
                >
                  Categories
                </span>

                <div
                  className="rounded-[20px]"
                  style={{ overflow: 'hidden', background: '#F3EFEB', border: '1px solid #EDE8E2' }}
                >
                  {CATEGORIES.map((cat, idx) => {
                    const { Icon } = cat;
                    const isLast = idx === CATEGORIES.length - 1;
                    return (
                      <div
                        key={cat.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 14,
                          padding: '14px 20px',
                          borderBottom: !isLast ? '1px dashed #CFCFD4' : 'none',
                          opacity: pushOn ? 1 : 0.4,
                          transition: 'opacity 200ms ease',
                        }}
                      >
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 12,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            background: cat.iconBg,
                          }}
                        >
                          <Icon size={18} color={cat.iconColor} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 15, fontWeight: 600, color: '#111111', marginBottom: 2 }}>
                            {cat.label}
                          </div>
                          <div style={{ fontSize: 12, color: '#A09A94', fontWeight: 400 }}>
                            {cat.caption}
                          </div>
                        </div>
                        <Toggle value={prefs[cat.id]} onChange={(v) => handlePref(cat.id, v)} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quiet Hours */}
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#A09A94',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 10,
                    paddingLeft: 4,
                  }}
                >
                  Quiet Hours
                </span>

                <div
                  className="rounded-[20px] p-5"
                style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: 'rgba(88,86,214,0.10)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Clock size={18} color="#5856D6" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#111111', marginBottom: 2 }}>
                        Do Not Disturb
                      </div>
                      <div style={{ fontSize: 12, color: '#A09A94' }}>Silence notifications</div>
                    </div>
                    <Toggle value={quietHours} onChange={setQuietHours} />
                  </div>

                  {quietHours && (
                    <div
                      className="np-fade-in"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        background: '#EDE8E2',
                        borderRadius: 12,
                        padding: '14px 16px',
                        marginTop: 16,
                      }}
                    >
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: 11,
                            color: '#A09A94',
                            fontWeight: 600,
                            marginBottom: 4,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          From
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                          }}
                        >
                          <Clock size={14} color="#6E6058" />
                          <span
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: '#111111',
                              letterSpacing: '-0.5px',
                            }}
                          >
                            22:00
                          </span>
                        </div>
                      </div>
                      <div style={{ width: 1, height: 36, background: '#CFCFD4' }} />
                      <div style={{ flex: 1, textAlign: 'center' }}>
                        <div
                          style={{
                            fontSize: 11,
                            color: '#A09A94',
                            fontWeight: 600,
                            marginBottom: 4,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          }}
                        >
                          To
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                          }}
                        >
                          <Clock size={14} color="#6E6058" />
                          <span
                            style={{
                              fontSize: 18,
                              fontWeight: 700,
                              color: '#111111',
                              letterSpacing: '-0.5px',
                            }}
                          >
                            07:00
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Other Section */}
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#A09A94',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 10,
                    paddingLeft: 4,
                  }}
                >
                  Other
                </span>

                <div
                  className="rounded-[20px] p-5"
                style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: 'rgba(0,122,255,0.10)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={18} color="#007AFF" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 600, color: '#111111', marginBottom: 2 }}>
                        Email Notifications
                      </div>
                      <div style={{ fontSize: 12, color: '#A09A94' }}>Weekly digest & updates</div>
                    </div>
                    <Toggle value={emailOn} onChange={setEmailOn} />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPrefsScreen;
