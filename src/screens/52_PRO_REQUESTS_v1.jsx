import React, { useState } from 'react';
import {
  ChevronLeft,
  Check,
  X,
  Star,
  Clock,
  MapPin,
  Calendar,
  User,
  PawPrint,
  ChevronRight,
  ArrowRight,
  Home,
  BarChart3,
  Search,
} from 'lucide-react';

/**
 * 52_PRO_REQUESTS_v1.jsx
 * Booking Requests management screen for Fylos PRO service providers.
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

    .pro-requests * {
      margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pro-requests-scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .pro-requests-scroll::-webkit-scrollbar { display: none; }

    .pro-tap {
      transition: transform 120ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease;
      cursor: pointer; user-select: none;
    }
    .pro-tap:active { transform: scale(0.97); opacity: 0.85; }

    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeModalIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideSheetUp {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.7); }
    }

    .req-card-enter { animation: slideInUp 360ms cubic-bezier(0.34,1.56,0.64,1) both; }
    .req-card-enter:nth-child(1) { animation-delay: 60ms; }
    .req-card-enter:nth-child(2) { animation-delay: 140ms; }
    .req-card-enter:nth-child(3) { animation-delay: 220ms; }

    .decline-opt { cursor: pointer; transition: background 120ms ease; user-select: none; }
    .decline-opt:hover { background: #F3EFEB; }
  `}</style>
);

// ─── AVATAR ──────────────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: 9999, background: color,
    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  }}>
    <span style={{ fontWeight: 600, fontSize: size * 0.36, color: '#FFFFFF', letterSpacing: '-0.3px' }}>
      {initials}
    </span>
  </div>
);

// ─── DATA ────────────────────────────────────────────────────────────────────
const NEW_REQUESTS = [
  {
    id: 'req-1', client: 'Emma L.', initials: 'EL', avatarColor: '#D97706',
    pet: 'Luna (Golden Retriever)', service: 'Dog Walking', duration: '60 min',
    date: 'Today, 3:30 PM', location: 'Zurichberg Park, 0.8 km', price: 'CHF 35',
  },
  {
    id: 'req-2', client: 'Tom K.', initials: 'TK', avatarColor: '#2563EB',
    pet: 'Buddy (Beagle)', service: 'Dog Walking', duration: '30 min',
    date: 'Tomorrow, 10:00 AM', location: 'Seefeld, 1.2 km', price: 'CHF 22',
  },
  {
    id: 'req-3', client: 'Lisa M.', initials: 'LM', avatarColor: '#7C3AED',
    pet: 'Milo (Cat)', service: 'Pet Sitting', duration: 'Overnight',
    date: 'March 20-21', location: "Client's home, Enge", price: 'CHF 85',
  },
];

const ACCEPTED_BOOKINGS = [
  { id: 'acc-1', client: 'Sarah B.', initials: 'SB', avatarColor: '#059669', pet: 'Rocky (Husky)', service: 'Dog Walking', date: 'Today, 5:00 PM', price: 'CHF 28' },
  { id: 'acc-2', client: 'Marco F.', initials: 'MF', avatarColor: '#DB2777', pet: 'Bella (Poodle)', service: 'Pet Sitting', date: 'Tomorrow, 2:00 PM', price: 'CHF 40' },
];

const COMPLETED_BOOKINGS = [
  { id: 'comp-1', client: 'Anna S.', initials: 'AS', avatarColor: '#0891B2', pet: 'Charlie (Dachshund)', service: 'Dog Walking', date: 'Mar 14, 2:00 PM', price: 'CHF 25', rating: 5 },
];

const DECLINE_REASONS = ['Schedule conflict', 'Too far away', 'Not available for this service', 'Other'];
const SEGMENT_TABS = ['New', 'Accepted', 'Completed'];

// ─── SEGMENTED CONTROL ──────────────────────────────────────────────────────
const SegmentedControl = ({ tabs, active, onChange, counts }) => (
  <div style={{
    display: 'flex', background: '#F3EFEB', borderRadius: 16, padding: 3,
    margin: '0 20px', flexShrink: 0,
    border: '1px solid #EDE8E2',
  }}>
    {tabs.map((tab) => {
      const isActive = tab === active;
      const count = counts?.[tab];
      return (
        <div
          key={tab}
          className="pro-tap"
          onClick={() => onChange(tab)}
          style={{
            flex: 1, textAlign: 'center', padding: '9px 0', position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            background: isActive ? '#111' : 'transparent',
            borderRadius: 14,
            transition: 'all 240ms cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <span style={{
            fontSize: 13, fontWeight: isActive ? 600 : 500,
            color: isActive ? '#FFFFFF' : '#A09A94',
            transition: 'color 200ms',
          }}>{tab}</span>
          {count > 0 && (
            <span style={{
              fontSize: 10, fontWeight: 700, color: '#FFFFFF',
              background: isActive ? '#E85D2A' : '#E85D2A',
              borderRadius: 9999,
              padding: '1px 6px', minWidth: 18, textAlign: 'center', lineHeight: '16px',
            }}>{count}</span>
          )}
        </div>
      );
    })}
  </div>
);

// ─── NEW REQUEST CARD ────────────────────────────────────────────────────────
const NewRequestCard = ({ request, onAccept, onDecline }) => (
  <div className="req-card-enter" style={{
    background: '#F3EFEB', borderRadius: 20, padding: 20,
    border: '1px solid #EDE8E2',
  }}>
    {/* Client header with pulsing new indicator */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <div style={{ position: 'relative' }}>
        <Avatar initials={request.initials} color={request.avatarColor} size={42} />
        {/* Pulsing new dot */}
        <div style={{
          position: 'absolute', top: -2, right: -2, width: 12, height: 12,
          borderRadius: 9999, background: '#E85D2A', border: '2px solid #F3EFEB',
          animation: 'pulseDot 1.4s ease-in-out infinite',
        }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: '#111', display: 'block' }}>{request.client}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <PawPrint size={12} color="#A09A94" strokeWidth={2} />
          <span style={{ fontSize: 13, color: '#6E6058' }}>{request.pet}</span>
        </div>
      </div>
    </div>

    {/* Details */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
      {[
        { icon: PawPrint, text: `${request.service} — ${request.duration}` },
        { icon: Calendar, text: request.date },
        { icon: MapPin, text: request.location },
      ].map(({ icon: Icon, text }, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'rgba(232,93,42,0.08)', border: '1px solid rgba(232,93,42,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Icon size={14} color="#E85D2A" strokeWidth={2} />
          </div>
          <span style={{ fontSize: 13, color: '#6E6058' }}>{text}</span>
        </div>
      ))}
    </div>

    {/* Price */}
    <div style={{
      background: '#FFFFFF', borderRadius: 14, padding: '10px 14px', marginBottom: 16,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      border: '1px solid #EDE8E2',
    }}>
      <span style={{ fontSize: 13, color: '#A09A94' }}>Earnings</span>
      <span style={{ fontSize: 16, fontWeight: 700, color: '#E85D2A' }}>{request.price}</span>
    </div>

    {/* Actions */}
    <div style={{ display: 'flex', gap: 10 }}>
      <button className="pro-tap" onClick={() => onAccept(request.id)} style={{
        flex: 1, background: '#111',
        border: 'none', borderRadius: 14, padding: '14px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}>
        <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
        <span style={{ fontWeight: 600, fontSize: 14, color: '#FFFFFF' }}>Accept</span>
      </button>
      <button className="pro-tap" onClick={() => onDecline(request.id)} style={{
        flex: 1, background: '#F3EFEB',
        border: '1px solid #EDE8E2',
        borderRadius: 14, padding: '14px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <X size={16} color="#6E6058" strokeWidth={2} />
        <span style={{ fontWeight: 600, fontSize: 14, color: '#6E6058' }}>Decline</span>
      </button>
    </div>
  </div>
);

// ─── ACCEPTED CARD ───────────────────────────────────────────────────────────
const AcceptedCard = ({ booking }) => (
  <div style={{
    background: '#F3EFEB', borderRadius: 20, padding: 20,
    border: '1px solid #EDE8E2',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
      <Avatar initials={booking.initials} color={booking.avatarColor} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: '#111' }}>{booking.client}</span>
          <span style={{
            fontSize: 11, fontWeight: 600, color: '#00B45A',
            background: 'rgba(0,180,90,0.08)', borderRadius: 9999, padding: '2px 8px',
          }}>Confirmed</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
          <PawPrint size={12} color="#A09A94" strokeWidth={2} />
          <span style={{ fontSize: 13, color: '#6E6058' }}>{booking.pet}</span>
        </div>
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <Calendar size={13} color="#A09A94" strokeWidth={2} />
        <span style={{ fontSize: 12, color: '#6E6058' }}>{booking.date}</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#E85D2A' }}>{booking.price}</span>
    </div>

    <div style={{ display: 'flex', gap: 10 }}>
      <button className="pro-tap" style={{
        flex: 1, background: '#111',
        border: 'none', borderRadius: 14, padding: '12px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}>
        <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.5} />
        <span style={{ fontWeight: 600, fontSize: 13, color: '#FFFFFF' }}>Start</span>
      </button>
      <button className="pro-tap" style={{
        width: 44, height: 44, background: '#F3EFEB',
        border: '1px solid #EDE8E2',
        borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Clock size={18} color="#E85D2A" strokeWidth={2} />
      </button>
    </div>
  </div>
);

// ─── COMPLETED CARD ──────────────────────────────────────────────────────────
const CompletedCard = ({ booking }) => (
  <div style={{
    background: '#F3EFEB', borderRadius: 20, padding: 20,
    border: '1px solid #EDE8E2',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
      <Avatar initials={booking.initials} color={booking.avatarColor} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontWeight: 600, fontSize: 15, color: '#111', display: 'block' }}>{booking.client}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
          <PawPrint size={12} color="#A09A94" strokeWidth={2} />
          <span style={{ fontSize: 13, color: '#6E6058' }}>{booking.pet}</span>
        </div>
      </div>
      <span style={{ fontSize: 14, fontWeight: 600, color: '#E85D2A' }}>{booking.price}</span>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <Calendar size={13} color="#A09A94" strokeWidth={2} />
        <span style={{ fontSize: 12, color: '#6E6058' }}>{booking.date}</span>
      </div>
      <span style={{ color: '#EDE8E2' }}>|</span>
      <span style={{ fontSize: 12, color: '#6E6058' }}>{booking.service}</span>
    </div>

    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: '#FFFFFF', borderRadius: 14, padding: '10px 14px',
      border: '1px solid #EDE8E2',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14}
            color={i < booking.rating ? '#F59E0B' : '#EDE8E2'}
            fill={i < booking.rating ? '#F59E0B' : 'none'}
            strokeWidth={i < booking.rating ? 0 : 1.5}
          />
        ))}
        <span style={{ fontSize: 12, fontWeight: 600, color: '#6E6058', marginLeft: 4 }}>{booking.rating}.0</span>
      </div>
      <div className="pro-tap" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#E85D2A' }}>View Details</span>
        <ChevronRight size={14} color="#E85D2A" strokeWidth={2} />
      </div>
    </div>
  </div>
);

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, subtitle }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    paddingTop: 64, paddingBottom: 64, gap: 12,
  }}>
    <div style={{
      width: 64, height: 64, borderRadius: 9999, background: '#F3EFEB',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid #EDE8E2',
    }}>
      <Icon size={28} color="#A09A94" strokeWidth={1.5} />
    </div>
    <span style={{ fontWeight: 600, fontSize: 16, color: '#111', textAlign: 'center' }}>{title}</span>
    <span style={{ fontSize: 13, color: '#A09A94', textAlign: 'center', maxWidth: 220, lineHeight: 1.5 }}>{subtitle}</span>
  </div>
);

// ─── DECLINE MODAL ───────────────────────────────────────────────────────────
const DeclineModal = ({ onConfirm, onCancel }) => {
  const [selected, setSelected] = useState(null);
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'flex-end', zIndex: 100, borderRadius: 50,
      animation: 'fadeModalIn 200ms ease both',
    }}>
      <div style={{
        background: '#F7F5F2', borderRadius: '24px 24px 0 0', padding: '20px 20px 36px',
        width: '100%', animation: 'slideSheetUp 300ms cubic-bezier(0.34,1.56,0.64,1) both',
        border: '1px solid #EDE8E2', borderBottom: 'none',
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 9999, background: '#EDE8E2', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <span style={{ fontWeight: 600, fontSize: 17, color: '#111' }}>Reason for declining?</span>
          <div className="pro-tap" onClick={onCancel} style={{
            width: 30, height: 30, borderRadius: 9999, background: '#F3EFEB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <X size={15} color="#6E6058" strokeWidth={2.5} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {DECLINE_REASONS.map((reason) => {
            const isSelected = selected === reason;
            return (
              <div key={reason} className="decline-opt" onClick={() => setSelected(reason)} style={{
                borderRadius: 16, padding: '14px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: isSelected ? 'rgba(232,93,42,0.08)' : 'transparent',
                border: isSelected ? '1.5px solid rgba(232,93,42,0.2)' : '1.5px solid transparent',
              }}>
                <span style={{ fontSize: 14, fontWeight: isSelected ? 600 : 400, color: isSelected ? '#E85D2A' : '#111' }}>{reason}</span>
                <div style={{
                  width: 20, height: 20, borderRadius: 9999,
                  border: `2px solid ${isSelected ? '#E85D2A' : '#EDE8E2'}`,
                  background: isSelected ? '#E85D2A' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isSelected && <div style={{ width: 8, height: 8, borderRadius: 9999, background: '#FFFFFF' }} />}
                </div>
              </div>
            );
          })}
        </div>

        <button className="pro-tap" onClick={() => selected && onConfirm(selected)} style={{
          width: '100%', background: selected ? '#111' : '#EDE8E2',
          border: 'none', borderRadius: 14, padding: '15px 0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 200ms ease',
          boxShadow: selected ? '0 4px 20px rgba(0,0,0,0.12)' : 'none',
        }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: selected ? '#FFFFFF' : '#A09A94' }}>Confirm</span>
        </button>
      </div>
    </div>
  );
};

// ─── BOTTOM TAB BAR ──────────────────────────────────────────────────────────
const BottomTabBar = () => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/pro-dashboard' },
    { id: 'requests', label: 'Requests', icon: Clock, active: true, badge: 3, href: null },
    { id: 'schedule', label: 'Schedule', icon: Calendar, href: null },
    { id: 'earnings', label: 'Earnings', icon: BarChart3, href: '/pro-earnings' },
    { id: 'profile', label: 'Profile', icon: User, href: '/pro-profile' },
  ];

  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 16, right: 16, height: 64,
      background: 'rgba(247,245,242,0.92)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderRadius: 22, boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
      border: '1px solid #EDE8E2',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 4px', zIndex: 20,
    }}>
      {tabs.map((tab) => {
        const isActive = tab.active;
        const Icon = tab.icon;
        return (
          <div key={tab.id} className="pro-tap" onClick={() => {
            if (tab.href) window.location.href = tab.href;
            else if (tab.id === 'schedule') alert('Schedule coming soon');
          }} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '6px 10px', borderRadius: 14,
            background: isActive ? 'rgba(232,93,42,0.08)' : 'transparent',
            transition: 'all 240ms cubic-bezier(0.34,1.56,0.64,1)', position: 'relative',
          }}>
            <div style={{ position: 'relative' }}>
              <Icon size={20} color={isActive ? '#E85D2A' : '#A09A94'} strokeWidth={isActive ? 2 : 1.6} />
              {tab.badge && (
                <div style={{
                  position: 'absolute', top: -4, right: -8, minWidth: 16, height: 16,
                  borderRadius: 9999, background: '#E85D2A', color: '#FFFFFF',
                  fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '0 4px', border: '2px solid #F7F5F2',
                }}>{tab.badge}</div>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500, color: isActive ? '#E85D2A' : '#A09A94' }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function ProRequestsScreen() {
  const [activeSegment, setActiveSegment] = useState('New');
  const [newRequests, setNewRequests] = useState(NEW_REQUESTS);
  const [declineModal, setDeclineModal] = useState(null);

  const handleAccept = (id) => setNewRequests(prev => prev.filter(r => r.id !== id));
  const handleDeclineStart = (id) => setDeclineModal(id);
  const handleDeclineConfirm = () => {
    setNewRequests(prev => prev.filter(r => r.id !== declineModal));
    setDeclineModal(null);
  };

  const segmentCounts = { New: newRequests.length > 0 ? newRequests.length : undefined };

  return (
    <div className="pro-requests" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#F7F5F2', padding: 20,
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
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 9999 }} />
        {/* Status Bar */}
        <StatusBar />

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all duration-[120ms]"
              style={{ background: '#F3EFEB', border: 'none' }}
            >
              <ChevronLeft size={22} color="#111" />
            </button>
            <h2 className="text-[17px] font-semibold" style={{ color: '#111' }}>Requests</h2>
            <button className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all duration-[120ms]"
              style={{ background: '#F3EFEB', border: 'none' }}
            >
              <Search size={20} color="#111" />
            </button>
          </div>
        </header>

        {/* Spacers */}
        <div style={{ height: 54, flexShrink: 0 }} />
        <div style={{ height: 50, flexShrink: 0 }} />

        {/* Segmented control */}
        <SegmentedControl tabs={SEGMENT_TABS} active={activeSegment} onChange={setActiveSegment} counts={segmentCounts} />

        {/* Scrollable content */}
        <div className="pro-requests-scroll" style={{
          flex: 1, overflowY: 'auto', padding: '16px 20px 100px',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          {activeSegment === 'New' && (
            newRequests.length === 0
              ? <EmptyState icon={Check} title="All caught up!" subtitle="New booking requests from clients will appear here." />
              : newRequests.map(req => <NewRequestCard key={req.id} request={req} onAccept={handleAccept} onDecline={handleDeclineStart} />)
          )}
          {activeSegment === 'Accepted' && (
            ACCEPTED_BOOKINGS.length === 0
              ? <EmptyState icon={Clock} title="No accepted bookings" subtitle="Bookings you accept will show up here." />
              : ACCEPTED_BOOKINGS.map(b => <AcceptedCard key={b.id} booking={b} />)
          )}
          {activeSegment === 'Completed' && (
            COMPLETED_BOOKINGS.length === 0
              ? <EmptyState icon={Star} title="No completed sessions" subtitle="Completed bookings with ratings will appear here." />
              : COMPLETED_BOOKINGS.map(b => <CompletedCard key={b.id} booking={b} />)
          )}
        </div>

        <BottomTabBar />

        {declineModal && <DeclineModal onConfirm={handleDeclineConfirm} onCancel={() => setDeclineModal(null)} />}
      </div>
    </div>
  );
}
