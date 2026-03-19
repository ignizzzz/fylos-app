import React, { useState } from 'react';
import {
  Home,
  Bell,
  User,
  Star,
  Clock,
  MapPin,
  MessageCircle,
  Calendar,
  Activity,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  PawPrint,
  DollarSign,
  BarChart3,
  TrendingUp,
  Check,
  Plus,
  Navigation,
  Phone,
  Settings,
} from 'lucide-react';

/**
 * 51_PRO_DASHBOARD_v1.jsx
 * Professional Dashboard — home screen for Fylos PRO service providers.
 * Revolut-inspired dark premium design with Fylos orange accent.
 */

// ─── THEME ────────────────────────────────────────────────────────────────────
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
    success: '#00D26A',
    warning: '#FF9500',
    info: '#007AFF',
    divider: 'rgba(255,255,255,0.08)',
  },
  radius: {
    full: '9999px',
    large: '24px',
    medium: '16px',
    small: '8px',
  },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.2)',
    floating: '0 8px 24px rgba(0,0,0,0.35)',
    active: '0 8px 30px rgba(0,0,0,0.3)',
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .pro-dash * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pro-dash-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .pro-dash-scroll::-webkit-scrollbar {
      display: none;
    }

    .pro-tap {
      transition: transform ${THEME.motion.tap} ${THEME.motion.spring},
                  opacity ${THEME.motion.fade} ease;
      cursor: pointer;
      user-select: none;
    }
    .pro-tap:active {
      transform: scale(0.97);
      opacity: 0.85;
    }

    .pro-fade-in {
      animation: proFadeIn ${THEME.motion.fade} ease-out both;
    }
    @keyframes proFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .pro-bar-fill {
      animation: proBarGrow 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    @keyframes proBarGrow {
      from { transform: scaleX(0); }
      to { transform: scaleX(1); }
    }
  `}</style>
);

// ─── STATUS BAR ───────────────────────────────────────────────────────────────
const StatusBar = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 28px 0',
    height: '48px',
  }}>
    <span style={{
      fontSize: '15px',
      fontWeight: 600,
      letterSpacing: '0.02em',
      color: THEME.colors.primaryText,
    }}>9:41</span>
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
        <rect x="0" y="3" width="3" height="9" rx="1" fill={THEME.colors.primaryText}/>
        <rect x="4.5" y="2" width="3" height="10" rx="1" fill={THEME.colors.primaryText}/>
        <rect x="9" y="0.5" width="3" height="11.5" rx="1" fill={THEME.colors.primaryText}/>
        <rect x="13.5" y="0" width="3" height="12" rx="1" fill={THEME.colors.primaryText}/>
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <path d="M8 3.6C9.8 3.6 11.4 4.3 12.6 5.4L14 4C12.4 2.5 10.3 1.6 8 1.6C5.7 1.6 3.6 2.5 2 4L3.4 5.4C4.6 4.3 6.2 3.6 8 3.6Z" fill={THEME.colors.primaryText}/>
        <path d="M8 7.2C9 7.2 9.9 7.6 10.6 8.2L12 6.8C10.9 5.8 9.5 5.2 8 5.2C6.5 5.2 5.1 5.8 4 6.8L5.4 8.2C6.1 7.6 7 7.2 8 7.2Z" fill={THEME.colors.primaryText}/>
        <circle cx="8" cy="10.4" r="1.4" fill={THEME.colors.primaryText}/>
      </svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
        <rect x="0.5" y="0.5" width="22" height="12" rx="3.5" stroke={THEME.colors.primaryText} strokeOpacity="0.35"/>
        <rect x="2" y="2" width="19" height="9" rx="2" fill={THEME.colors.primaryText}/>
        <path d="M24 4.5V8.5C24.8 8.2 25.5 7.2 25.5 6.5C25.5 5.8 24.8 4.8 24 4.5Z" fill={THEME.colors.primaryText} fillOpacity="0.4"/>
      </svg>
    </div>
  </div>
);

// ─── HEADER ───────────────────────────────────────────────────────────────────
const Header = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 20px 12px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{
        fontSize: '22px',
        fontWeight: 700,
        letterSpacing: '-0.04em',
        color: THEME.colors.primaryText,
      }}>fylos</span>
      <span style={{
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: '#FFFFFF',
        background: `linear-gradient(135deg, ${THEME.colors.accent}, ${THEME.colors.accentLight})`,
        padding: '3px 8px',
        borderRadius: THEME.radius.full,
      }}>PRO</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <div className="pro-tap" style={{
        width: '40px',
        height: '40px',
        borderRadius: THEME.radius.full,
        background: THEME.colors.surface,
        border: `1px solid ${THEME.colors.divider}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: THEME.shadows.soft,
      }}>
        <Bell size={18} color={THEME.colors.primaryText} strokeWidth={1.8} />
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '9px',
          width: '8px',
          height: '8px',
          borderRadius: THEME.radius.full,
          background: THEME.colors.danger,
          border: `2px solid ${THEME.colors.surface}`,
        }} />
      </div>
      <div className="pro-tap" onClick={() => { window.location.href = '/'; }} style={{
        fontSize: '11px',
        fontWeight: 600,
        color: THEME.colors.accent,
        background: THEME.colors.accentGlow,
        padding: '6px 10px',
        borderRadius: THEME.radius.full,
        cursor: 'pointer',
      }}>
        Client Mode
      </div>
      <div className="pro-tap" style={{
        width: '40px',
        height: '40px',
        borderRadius: THEME.radius.full,
        overflow: 'hidden',
        border: `2px solid rgba(232,93,42,0.3)`,
      }}>
        <img
          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
          alt="Profile"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    </div>
  </div>
);

// ─── GREETING ─────────────────────────────────────────────────────────────────
const Greeting = () => (
  <div className="pro-fade-in" style={{ padding: '4px 20px 16px' }}>
    <div style={{
      fontSize: '22px',
      fontWeight: 600,
      letterSpacing: '-0.03em',
      color: THEME.colors.primaryText,
      marginBottom: '6px',
    }}>
      Good afternoon, Sarah
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{
        fontSize: '13px',
        fontWeight: 500,
        color: THEME.colors.accent,
        background: THEME.colors.accentGlow,
        padding: '4px 10px',
        borderRadius: THEME.radius.full,
      }}>Dog Walker</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <Star size={13} color="#FFB800" fill="#FFB800" strokeWidth={0} />
        <span style={{
          fontSize: '13px',
          fontWeight: 600,
          color: THEME.colors.primaryText,
          opacity: 0.8,
        }}>4.9</span>
      </div>
    </div>
  </div>
);

// ─── TODAY'S OVERVIEW CARD ────────────────────────────────────────────────────
const TodayOverview = () => {
  const stats = [
    { label: 'Walks', value: '4', icon: PawPrint },
    { label: 'Hours', value: '5.2', icon: Clock },
    { label: 'Earned', value: 'CHF 260', icon: DollarSign },
  ];
  const completion = 75;

  return (
    <div className="pro-fade-in" style={{
      margin: '0 20px 14px',
      background: THEME.colors.surface,
      borderRadius: '20px',
      padding: '20px',
      boxShadow: THEME.shadows.soft,
      border: `1px solid rgba(255,255,255,0.06)`,
    }}>
      <div style={{
        fontSize: '12px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: THEME.colors.secondaryText,
        marginBottom: '14px',
      }}>Today's Overview</div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '18px',
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: THEME.colors.accentGlow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 8px',
            }}>
              <s.icon size={18} color={THEME.colors.accent} strokeWidth={1.8} />
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 600,
              color: THEME.colors.primaryText,
              letterSpacing: '-0.02em',
            }}>{s.value}</div>
            <div style={{
              fontSize: '12px',
              color: THEME.colors.secondaryText,
              marginTop: '2px',
            }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
        }}>
          <span style={{
            fontSize: '13px',
            fontWeight: 500,
            color: THEME.colors.secondaryText,
          }}>Day completion</span>
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: THEME.colors.accent,
          }}>{completion}%</span>
        </div>
        <div style={{
          height: '6px',
          borderRadius: THEME.radius.full,
          background: THEME.colors.surfaceAlt,
          overflow: 'hidden',
        }}>
          <div className="pro-bar-fill" style={{
            height: '100%',
            width: `${completion}%`,
            borderRadius: THEME.radius.full,
            background: `linear-gradient(90deg, ${THEME.colors.accent}, ${THEME.colors.accentLight})`,
            transformOrigin: 'left',
          }} />
        </div>
      </div>
    </div>
  );
};

// ─── THIS WEEK EARNINGS ───────────────────────────────────────────────────────
const WeekEarnings = () => {
  const days = [
    { label: 'M', value: 65 },
    { label: 'T', value: 85 },
    { label: 'W', value: 50 },
    { label: 'T', value: 90 },
    { label: 'F', value: 70 },
    { label: 'S', value: 40 },
    { label: 'S', value: 0 },
  ];
  const maxVal = Math.max(...days.map(d => d.value));

  return (
    <div className="pro-fade-in" style={{
      margin: '0 20px 14px',
      background: THEME.colors.surface,
      borderRadius: '20px',
      padding: '20px',
      boxShadow: THEME.shadows.soft,
      border: `1px solid rgba(255,255,255,0.06)`,
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px',
      }}>
        <div>
          <div style={{
            fontSize: '12px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: THEME.colors.secondaryText,
            marginBottom: '4px',
          }}>This Week</div>
          <div style={{
            fontSize: '26px',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: THEME.colors.primaryText,
          }}>CHF 1,240</div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(0,210,106,0.12)',
          padding: '4px 10px',
          borderRadius: THEME.radius.full,
        }}>
          <TrendingUp size={13} color={THEME.colors.success} strokeWidth={2} />
          <span style={{
            fontSize: '13px',
            fontWeight: 600,
            color: THEME.colors.success,
          }}>+12%</span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        height: '64px',
      }}>
        {days.map((d, i) => (
          <div key={i} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            height: '100%',
            justifyContent: 'flex-end',
          }}>
            <div style={{
              width: '100%',
              maxWidth: '28px',
              height: d.value > 0 ? `${(d.value / maxVal) * 44}px` : '4px',
              borderRadius: '6px',
              background: i === 3
                ? `linear-gradient(180deg, ${THEME.colors.accentLight}, ${THEME.colors.accent})`
                : THEME.colors.surfaceAlt,
              transition: 'height 400ms cubic-bezier(0.22, 1, 0.36, 1)',
            }} />
            <span style={{
              fontSize: '11px',
              fontWeight: 500,
              color: i === 3 ? THEME.colors.accent : THEME.colors.tertiaryText,
            }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── NEXT BOOKING CARD ────────────────────────────────────────────────────────
const NextBooking = () => (
  <div className="pro-fade-in" style={{
    margin: '0 20px 14px',
    background: THEME.colors.surface,
    borderRadius: '20px',
    padding: '20px',
    boxShadow: THEME.shadows.soft,
    border: `1px solid rgba(255,255,255,0.06)`,
  }}>
    <div style={{
      fontSize: '12px',
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: THEME.colors.secondaryText,
      marginBottom: '14px',
    }}>Next Booking</div>

    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '14px',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '14px',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        <img
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=96&h=96&fit=crop"
          alt="Pet"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '16px',
          fontWeight: 600,
          color: THEME.colors.primaryText,
          letterSpacing: '-0.02em',
        }}>Max — Golden Retriever</div>
        <div style={{
          fontSize: '13px',
          color: THEME.colors.secondaryText,
          marginTop: '2px',
        }}>Client: Emma Fischer</div>
      </div>
    </div>

    <div style={{
      display: 'flex',
      gap: '16px',
      marginBottom: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Clock size={14} color={THEME.colors.tertiaryText} strokeWidth={1.8} />
        <span style={{
          fontSize: '13px',
          color: THEME.colors.secondaryText,
        }}>2:00 PM — 3:30 PM</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <MapPin size={14} color={THEME.colors.tertiaryText} strokeWidth={1.8} />
        <span style={{
          fontSize: '13px',
          color: THEME.colors.secondaryText,
        }}>Seefeld</span>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '10px' }}>
      <button className="pro-tap" style={{
        flex: 1,
        height: '46px',
        borderRadius: THEME.radius.medium,
        border: 'none',
        background: `linear-gradient(135deg, ${THEME.colors.accent}, ${THEME.colors.accentLight})`,
        color: '#FFFFFF',
        fontSize: '15px',
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
      }}>
        <Navigation size={16} strokeWidth={2} />
        Start Walk
      </button>
      <button className="pro-tap" style={{
        width: '46px',
        height: '46px',
        borderRadius: THEME.radius.medium,
        border: `1px solid ${THEME.colors.divider}`,
        background: THEME.colors.surfaceAlt,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: THEME.shadows.soft,
      }}>
        <MessageCircle size={18} color={THEME.colors.accent} strokeWidth={1.8} />
      </button>
    </div>
  </div>
);

// ─── BOTTOM TAB BAR ───────────────────────────────────────────────────────────
const BottomTabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: null },
    { id: 'requests', label: 'Requests', icon: Activity, badge: 3, href: '/pro-requests' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, href: null },
    { id: 'earnings', label: 'Earnings', icon: BarChart3, href: '/pro-earnings' },
    { id: 'profile', label: 'Profile', icon: User, href: '/pro-profile' },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: '24px',
      left: '16px',
      right: '16px',
      height: '64px',
      background: 'rgba(13,27,42,0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRadius: '22px',
      boxShadow: THEME.shadows.floating,
      border: `1px solid ${THEME.colors.divider}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 4px',
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <div
            key={tab.id}
            className="pro-tap"
            onClick={() => {
              if (tab.href) {
                window.location.href = tab.href;
              } else if (tab.id === 'schedule') {
                alert('Schedule coming soon');
              } else {
                onTabChange(tab.id);
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              padding: '6px 10px',
              borderRadius: '14px',
              background: isActive ? THEME.colors.accentGlow : 'transparent',
              transition: `all ${THEME.motion.tab} ${THEME.motion.spring}`,
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                size={20}
                color={isActive ? THEME.colors.accent : THEME.colors.tertiaryText}
                strokeWidth={isActive ? 2 : 1.6}
              />
              {tab.badge && (
                <div style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-8px',
                  minWidth: '16px',
                  height: '16px',
                  borderRadius: THEME.radius.full,
                  background: THEME.colors.danger,
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  border: `2px solid ${THEME.colors.surface}`,
                }}>
                  {tab.badge}
                </div>
              )}
            </div>
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? THEME.colors.accent : THEME.colors.tertiaryText,
              letterSpacing: '0.01em',
            }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function ProDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="pro-dash" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E5E5E5',
      padding: '20px',
    }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#0D1B2A', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 9999 }} />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="7" width="3" height="5" rx="1" fill="#FFFFFF"/><rect x="4.5" y="5" width="3" height="7" rx="1" fill="#FFFFFF"/><rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#FFFFFF"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#FFFFFF"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#FFFFFF"/><path d="M4.75 7.75a4.75 4.75 0 016.5 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 5a8 8 0 0112 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="12" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="#FFFFFF" strokeOpacity="0.35"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="#FFFFFF"/><path d="M24 4v4a2 2 0 000-4z" fill="#FFFFFF" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#0D1B2A]/95 via-[#0D1B2A]/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button
              onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              style={{ background: '#142232', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
            >
              <ChevronLeft size={22} color="#FFFFFF" />
            </button>
            <h2 className="text-[17px] font-semibold" style={{ color: '#FFFFFF' }}>PRO Dashboard</h2>
            <button
              className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              style={{ background: '#142232', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)', position: 'relative' }}
            >
              <Bell size={22} color="#FFFFFF" />
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '9px',
                width: '8px',
                height: '8px',
                borderRadius: THEME.radius.full,
                background: THEME.colors.danger,
                border: '2px solid #142232',
              }} />
            </button>
          </div>
        </header>

        {/* Screen Content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 54,
        }}>
          <div className="pro-dash-scroll" style={{
            flex: 1,
            paddingBottom: '100px',
          }}>
            <Greeting />
            <TodayOverview />
            <WeekEarnings />
            <NextBooking />
          </div>

          <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

      </div>
    </div>
  );
}
