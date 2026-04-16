import React, { useState } from 'react';
import {
  ChevronLeft,
  Star,
  Shield,
  MapPin,
  Calendar,
  Clock,
  Check,
  User,
  Settings,
  ArrowRight,
  Camera,
  PawPrint,
  Home,
  BarChart3,
} from 'lucide-react';

/**
 * 55_PRO_PROFILE_v1.jsx
 * Professional Profile Management screen for Fylos PRO.
 * Warm minimal FYLOS design system.
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

    .pro-profile * {
      margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pro-profile-scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .pro-profile-scroll::-webkit-scrollbar { display: none; }

    .pro-tap {
      transition: transform 120ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease;
      cursor: pointer; user-select: none;
    }
    .pro-tap:active { transform: scale(0.97); opacity: 0.85; }

    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .slide-in { animation: slideInUp 280ms ease both; }

    .row-press { transition: background 140ms ease; cursor: pointer; }
    .row-press:active { background: rgba(0,0,0,0.02) !important; }

    .day-chip { transition: background 160ms ease, color 160ms ease; cursor: pointer; user-select: none; }
    .day-chip:active { transform: scale(0.93); }

    textarea { resize: none; font-family: inherit; }
    textarea:focus { outline: none; }
  `}</style>
);

// ─── CARD ────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#F3EFEB', borderRadius: 20, padding: 20,
    border: '1px solid #EDE8E2',
    ...style,
  }}>{children}</div>
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
  { icon: Clock, label: 'Requests', href: '/pro-requests' },
  { icon: Calendar, label: 'Schedule', href: null },
  { icon: BarChart3, label: 'Earnings', href: '/pro-earnings' },
  { icon: User, label: 'Profile', href: null },
];

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const ProProfileScreen = () => {
  const [activeDays, setActiveDays] = useState(INITIAL_DAYS);
  const [bioText, setBioText] = useState(
    'Passionate dog walker with 3 years experience. I treat every dog like my own! Based in Zurich, available weekdays and Saturdays.'
  );
  const [editingBio, setEditingBio] = useState(false);

  const toggleDay = (day) => setActiveDays(prev => ({ ...prev, [day]: !prev[day] }));

  return (
    <div className="pro-profile" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#E5E5E5', padding: 20,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{
        width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
        overflow: 'hidden', backgroundColor: '#F7F5F2',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
        {/* Status Bar */}
        <StatusBar />

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all duration-[120ms]"
              style={{ background: '#F3EFEB', border: '1px solid #EDE8E2', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
            >
              <ChevronLeft size={22} color="#111" />
            </button>
            <h2 className="text-[17px] font-semibold text-[#111]">Profile</h2>
            <button className="pro-tap"
              style={{
                width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#F3EFEB', border: '1px solid #EDE8E2',
                boxShadow: '0 8px 24px rgba(0,0,0,0.06)', borderRadius: 9999,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 600, color: '#E85D2A' }}>Edit</span>
            </button>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="pro-profile-scroll" style={{
          flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
          gap: 12, padding: '0 16px 16px', paddingTop: 100,
        }}>

          {/* Profile Header */}
          <div className="slide-in" style={{ animationDelay: '0ms' }}>
            <Card style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, position: 'relative' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: '#E85D2A',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(232,93,42,0.2)',
                  }}>
                    <User size={34} color="rgba(255,255,255,0.9)" />
                  </div>
                  <button className="pro-tap" style={{
                    position: 'absolute', bottom: -2, right: -2,
                    width: 26, height: 26, borderRadius: '50%',
                    background: '#E85D2A', border: '2px solid #F3EFEB',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(232,93,42,0.3)',
                  }}>
                    <Camera size={12} color="#fff" />
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 4 }}>Sarah Lehmann</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    background: 'rgba(232,93,42,0.08)', borderRadius: 9999, padding: '3px 10px', marginBottom: 8,
                  }}>
                    <PawPrint size={11} color="#E85D2A" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#E85D2A' }}>Dog Walker</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <Star size={13} color="#E85D2A" fill="#E85D2A" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111' }}>4.9</span>
                    <span style={{ fontSize: 11, color: '#A09A94' }}>(47 reviews)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} color="#A09A94" />
                    <span style={{ fontSize: 11, color: '#A09A94' }}>Member since March 2025</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'Walks completed', value: '234' },
                  { label: 'Repeat clients', value: '78%' },
                  { label: 'Avg rating', value: '4.9' },
                ].map(stat => (
                  <div key={stat.label} style={{
                    flex: 1, background: '#F7F5F2', borderRadius: 14, padding: '10px 8px',
                    textAlign: 'center', border: '1px solid #EDE8E2',
                  }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#E85D2A', lineHeight: 1.1 }}>{stat.value}</div>
                    <div style={{ fontSize: 9, color: '#A09A94', marginTop: 3, fontWeight: 500, lineHeight: 1.2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* About */}
          <div className="slide-in" style={{ animationDelay: '40ms' }}>
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 10 }}>About</div>
              {editingBio ? (
                <div>
                  <textarea
                    value={bioText}
                    onChange={e => setBioText(e.target.value)}
                    style={{
                      width: '100%', minHeight: 72,
                      border: '1.5px solid #E85D2A', borderRadius: 16,
                      padding: '10px 12px', fontSize: 13,
                      color: '#111', background: '#F7F5F2', lineHeight: 1.55,
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                    <button className="pro-tap" onClick={() => setEditingBio(false)} style={{
                      background: '#F7F5F2', border: '1px solid #EDE8E2',
                      borderRadius: 9999, padding: '7px 16px',
                      fontSize: 12, fontWeight: 600, color: '#6E6058',
                    }}>Cancel</button>
                    <button className="pro-tap" onClick={() => setEditingBio(false)} style={{
                      background: '#E85D2A', border: 'none',
                      borderRadius: 9999, padding: '7px 18px',
                      fontSize: 12, fontWeight: 700, color: '#fff',
                    }}>Save</button>
                  </div>
                </div>
              ) : (
                <div className="row-press" onClick={() => setEditingBio(true)} style={{ borderRadius: 8, margin: -4, padding: 4 }}>
                  <p style={{ fontSize: 13, color: '#6E6058', lineHeight: 1.55 }}>{bioText}</p>
                </div>
              )}
            </Card>
          </div>

          {/* Services & Pricing */}
          <div className="slide-in" style={{ animationDelay: '80ms' }}>
            <Card style={{ padding: 0 }}>
              <div style={{ padding: '20px 20px 0' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 4 }}>Services & Pricing</div>
              </div>
              <div>
                {INITIAL_SERVICES.map((svc, idx) => (
                  <div key={svc.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 20px',
                    borderBottom: idx < INITIAL_SERVICES.length - 1 ? '1px solid #EDE8E2' : 'none',
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: '#111' }}>{svc.name}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#E85D2A' }}>{svc.price}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Availability */}
          <div className="slide-in" style={{ animationDelay: '120ms' }}>
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 14 }}>Availability</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {DAYS.map(day => {
                  const active = activeDays[day];
                  return (
                    <div key={day} className="day-chip" onClick={() => toggleDay(day)} style={{
                      flex: 1, padding: '10px 0', borderRadius: 16, textAlign: 'center',
                      background: active ? '#E85D2A' : '#F7F5F2',
                      fontSize: 11, fontWeight: 700,
                      color: active ? '#fff' : '#6E6058',
                      border: `1px solid ${active ? '#E85D2A' : '#EDE8E2'}`,
                    }}>{day}</div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Certifications */}
          <div className="slide-in" style={{ animationDelay: '160ms' }}>
            <Card style={{ padding: 0 }}>
              <div style={{ padding: '20px 20px 0' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 4 }}>Certifications</div>
              </div>
              <div>
                {CERTIFICATIONS.map((cert, idx) => (
                  <div key={cert.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 20px',
                    borderBottom: idx < CERTIFICATIONS.length - 1 ? '1px solid #EDE8E2' : 'none',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(232,93,42,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Shield size={16} color="#E85D2A" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{cert.title}</div>
                      <div style={{ fontSize: 11, color: '#A09A94', marginTop: 2 }}>{cert.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Service Area */}
          <div className="slide-in" style={{ animationDelay: '200ms' }}>
            <Card>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 12 }}>Service Area</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(232,93,42,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <MapPin size={16} color="#E85D2A" />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Zurich, 5km radius</div>
                  <div style={{ fontSize: 11, color: '#A09A94', marginTop: 2 }}>Covers central Zurich area</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Switch to Client Mode */}
          <div className="slide-in" style={{ animationDelay: '240ms' }}>
            <div className="row-press" onClick={() => { window.location.href = '/'; }} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: '#F3EFEB', borderRadius: 20, padding: '16px 20px',
              border: '1px solid #EDE8E2',
            }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#E85D2A' }}>Switch to Client Mode</span>
              <ArrowRight size={18} color="#E85D2A" />
            </div>
          </div>

          {/* Log Out */}
          <div className="slide-in" style={{ animationDelay: '280ms' }}>
            <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
              <button className="pro-tap" style={{
                background: 'none', border: 'none',
                fontSize: 14, fontWeight: 600, color: '#D96852', padding: '8px 16px',
              }}>Log Out</button>
            </div>
          </div>

          {/* Bottom spacer for tab bar */}
          <div style={{ height: 100 }} />
        </div>

        {/* Bottom Tab Bar */}
        <div style={{
          position: 'absolute', bottom: 24, left: 16, right: 16, height: 64,
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 22, boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
          border: '1px solid #EDE8E2',
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 4px',
        }}>
          {PRO_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.label === 'Profile';
            return (
              <div key={tab.label} className="pro-tap" onClick={() => {
                if (tab.href) window.location.href = tab.href;
                else if (tab.label === 'Schedule') alert('Schedule coming soon');
              }} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                padding: '6px 10px', borderRadius: 14,
                background: isActive ? 'rgba(232,93,42,0.08)' : 'transparent',
              }}>
                <Icon size={20} color={isActive ? '#E85D2A' : '#A09A94'} strokeWidth={isActive ? 2.2 : 1.8} />
                <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, color: isActive ? '#E85D2A' : '#A09A94' }}>{tab.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProProfileScreen;
