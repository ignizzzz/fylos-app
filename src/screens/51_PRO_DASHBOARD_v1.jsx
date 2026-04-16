import React, { useState } from 'react';
import {
  Home,
  Bell,
  User,
  Star,
  Clock,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  PawPrint,
  DollarSign,
  BarChart3,
  TrendingUp,
  Navigation2,
} from 'lucide-react';

/**
 * 51_PRO_DASHBOARD_v1.jsx
 * Professional Dashboard — home screen for Fylos PRO service providers.
 * Fylos Warm Minimal Design System.
 */

// ─── STATUS BAR ─────────────────────────────────────────────────────────────
const StatusBar = () => (
  <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
    <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
    </div>
  </div>
);

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .pro-dash * {
      margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pro-dash-scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .pro-dash-scroll::-webkit-scrollbar { display: none; }

    .pro-tap {
      transition: transform 120ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease;
      cursor: pointer; user-select: none;
    }
    .pro-tap:active { transform: scale(0.97); opacity: 0.85; }

    @keyframes proFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .pro-fade { animation: proFadeIn 280ms ease both; }

    @keyframes barGrow {
      from { transform: scaleX(0); }
      to   { transform: scaleX(1); }
    }
    .bar-fill { animation: barGrow 600ms cubic-bezier(0.22,1,0.36,1) both; transform-origin: left; }

    @keyframes barGrowY {
      from { transform: scaleY(0); }
      to   { transform: scaleY(1); }
    }
    .bar-col { transform-origin: bottom; animation: barGrowY 500ms cubic-bezier(0.34,1.56,0.64,1) both; }
  `}</style>
);

// ─── GREETING ─────────────────────────────────────────────────────────────────
const Greeting = () => (
  <div className="pro-fade" style={{ padding: '4px 0 16px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.04em', color: '#111' }}>fylos</span>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: '#FFFFFF', background: '#E85D2A',
        padding: '3px 8px', borderRadius: 9999,
      }}>PRO</span>
    </div>
    <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', color: '#111', marginBottom: 6 }}>
      Good afternoon, Sarah
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <span style={{
        fontSize: 13, fontWeight: 500, color: '#E85D2A',
        background: 'rgba(232,93,42,0.08)', padding: '4px 10px', borderRadius: 9999,
      }}>Dog Walker</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Star size={13} color="#FFB800" fill="#FFB800" strokeWidth={0} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#6E6058' }}>4.9</span>
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
    <div className="pro-fade" style={{
      marginBottom: 14, background: '#F3EFEB', borderRadius: 20, padding: 20,
      border: '1px solid #EDE8E2',
    }}>
      <div style={{
        fontSize: 12, fontWeight: 500, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: '#A09A94', marginBottom: 14,
      }}>Today's Overview</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', flex: 1 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: 'rgba(232,93,42,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 8px',
              border: '1px solid rgba(232,93,42,0.1)',
            }}>
              <s.icon size={20} color="#E85D2A" strokeWidth={1.8} />
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#111', letterSpacing: '-0.02em' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#A09A94', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#A09A94' }}>Day completion</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#E85D2A' }}>{completion}%</span>
        </div>
        <div style={{ height: 6, borderRadius: 9999, background: '#EDE8E2', overflow: 'hidden' }}>
          <div className="bar-fill" style={{
            height: '100%', width: `${completion}%`, borderRadius: 9999,
            background: '#E85D2A',
          }} />
        </div>
      </div>
    </div>
  );
};

// ─── THIS WEEK EARNINGS ──────────────────────────────────────────────────────
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
    <div className="pro-fade" style={{
      marginBottom: 14, background: '#F3EFEB', borderRadius: 20, padding: 20,
      border: '1px solid #EDE8E2',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{
            fontSize: 12, fontWeight: 500, textTransform: 'uppercase',
            letterSpacing: '0.08em', color: '#A09A94', marginBottom: 4,
          }}>This Week</div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: '#111' }}>CHF 1,240</div>
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          background: 'rgba(0,180,90,0.08)', padding: '4px 10px', borderRadius: 9999,
        }}>
          <TrendingUp size={13} color="#00B45A" strokeWidth={2} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#00B45A' }}>+12%</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 64 }}>
        {days.map((d, i) => (
          <div key={i} style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end',
          }}>
            <div className="bar-col" style={{
              animationDelay: `${i * 60}ms`,
              width: '100%', maxWidth: 28,
              height: d.value > 0 ? `${(d.value / maxVal) * 44}px` : '4px',
              borderRadius: 6,
              background: i === 3 ? '#E85D2A' : '#EDE8E2',
            }} />
            <span style={{
              fontSize: 11, fontWeight: 500,
              color: i === 3 ? '#E85D2A' : '#A09A94',
            }}>{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── NEXT BOOKING CARD ───────────────────────────────────────────────────────
const NextBooking = () => (
  <div className="pro-fade" style={{
    marginBottom: 14, background: '#F3EFEB', borderRadius: 20, padding: 20,
    border: '1px solid #EDE8E2',
  }}>
    <div style={{
      fontSize: 12, fontWeight: 500, textTransform: 'uppercase',
      letterSpacing: '0.08em', color: '#A09A94', marginBottom: 14,
    }}>Next Booking</div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=96&h=96&fit=crop"
          alt="Pet"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#111', letterSpacing: '-0.02em' }}>
          Max — Golden Retriever
        </div>
        <div style={{ fontSize: 13, color: '#A09A94', marginTop: 2 }}>Client: Emma Fischer</div>
      </div>
    </div>

    <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Clock size={14} color="#A09A94" strokeWidth={1.8} />
        <span style={{ fontSize: 13, color: '#6E6058' }}>2:00 PM — 3:30 PM</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <MapPin size={14} color="#A09A94" strokeWidth={1.8} />
        <span style={{ fontSize: 13, color: '#6E6058' }}>Seefeld</span>
      </div>
    </div>

    <div style={{ display: 'flex', gap: 10 }}>
      <button className="pro-tap" style={{
        flex: 1, height: 48, borderRadius: 14, border: 'none',
        background: '#111',
        color: '#FFFFFF', fontSize: 15, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}>
        <Navigation2 size={16} strokeWidth={2} />
        Start Walk
      </button>
      <button className="pro-tap" style={{
        width: 48, height: 48, borderRadius: 14,
        border: '1px solid #EDE8E2', background: '#F3EFEB',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Bell size={18} color="#E85D2A" strokeWidth={1.8} />
      </button>
    </div>
  </div>
);

// ─── BOTTOM TAB BAR ──────────────────────────────────────────────────────────
const BottomTabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: null },
    { id: 'requests', label: 'Requests', icon: Clock, badge: 3, href: '/pro-requests' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, href: null },
    { id: 'earnings', label: 'Earnings', icon: BarChart3, href: '/pro-earnings' },
    { id: 'profile', label: 'Profile', icon: User, href: '/pro-profile' },
  ];

  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 16, right: 16,
      height: 64, background: 'rgba(247,245,242,0.92)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderRadius: 22, boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #EDE8E2',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 4px',
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <div
            key={tab.id}
            className="pro-tap"
            onClick={() => {
              if (tab.href) window.location.href = tab.href;
              else if (tab.id === 'schedule') alert('Schedule coming soon');
              else onTabChange(tab.id);
            }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '6px 10px', borderRadius: 14,
              background: isActive ? 'rgba(232,93,42,0.08)' : 'transparent',
              transition: 'all 240ms cubic-bezier(0.34,1.56,0.64,1)',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} color={isActive ? '#E85D2A' : '#A09A94'} strokeWidth={isActive ? 2 : 1.6} />
              {tab.badge && (
                <div style={{
                  position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16,
                  borderRadius: 9999, background: '#E85D2A', color: '#FFFFFF',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', border: '2px solid #F7F5F2',
                }}>{tab.badge}</div>
              )}
            </div>
            <span style={{
              fontSize: 10, fontWeight: isActive ? 600 : 500,
              color: isActive ? '#E85D2A' : '#A09A94',
            }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function ProDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="pro-dash" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#F7F5F2', padding: 20,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{
        width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
        overflow: 'hidden', backgroundColor: '#F7F5F2',
      }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 9999 }} />

        {/* Status Bar */}
        <StatusBar />

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button
              onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all duration-[120ms]"
              style={{ background: '#F3EFEB', border: 'none' }}
            >
              <ChevronLeft size={22} color="#111" />
            </button>
            <h2 className="text-[17px] font-semibold" style={{ color: '#111' }}>PRO Dashboard</h2>
            <button
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all duration-[120ms]"
              style={{ background: '#F3EFEB', border: 'none', position: 'relative' }}
            >
              <Bell size={22} color="#111" />
              <div style={{
                position: 'absolute', top: 8, right: 9, width: 8, height: 8,
                borderRadius: 9999, background: '#E85D2A', border: '2px solid #F3EFEB',
              }} />
            </button>
          </div>
        </header>

        {/* Screen Content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="pro-dash-scroll" style={{ flex: 1, paddingTop: 110, paddingBottom: 100, paddingLeft: 20, paddingRight: 20 }}>
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
