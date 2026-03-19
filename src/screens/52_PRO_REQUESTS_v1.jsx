import React, { useState } from 'react';
import {
  ChevronLeft,
  Check,
  X,
  Star,
  Clock,
  MapPin,
  MessageCircle,
  Calendar,
  Phone,
  User,
  PawPrint,
  ChevronRight,
  Filter,
  Circle,
  ArrowRight,
  Home,
  Bell,
  Settings,
} from 'lucide-react';

/**
 * 52_PRO_REQUESTS_v1.jsx
 * Booking Requests management screen for Fylos PRO service providers.
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
    divider: 'rgba(255,255,255,0.08)',
    danger: '#FF4444',
    success: '#00D26A',
    warning: '#FF9500',
  },
  radius: {
    full: '9999px',
    large: '24px',
    card: '20px',
    medium: '16px',
    small: '8px',
  },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.2)',
    floating: '0 8px 24px rgba(0,0,0,0.3)',
    active: '0 8px 30px rgba(0,0,0,0.25)',
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

    .pro-requests * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pro-requests-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .pro-requests-scroll::-webkit-scrollbar {
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

    @keyframes proFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

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

    .req-card-enter {
      animation: slideInUp 360ms cubic-bezier(0.34,1.56,0.64,1) both;
    }
    .req-card-enter:nth-child(1) { animation-delay: 60ms; }
    .req-card-enter:nth-child(2) { animation-delay: 140ms; }
    .req-card-enter:nth-child(3) { animation-delay: 220ms; }

    .decline-option {
      cursor: pointer;
      transition: background 120ms ease;
      user-select: none;
    }
    .decline-option:hover { background: ${THEME.colors.surfaceAlt}; }
  `}</style>
);

// ─── STATUS BAR ───────────────────────────────────────────────────────────────
const StatusBar = () => {
  const C = THEME.colors;
  return (
    <div style={{
      height: 50,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 6,
      flexShrink: 0,
      zIndex: 10,
    }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: C.primaryText }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
          {[3, 5, 7, 9].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, borderRadius: 1, background: i < 3 ? C.primaryText : C.tertiaryText }} />
          ))}
        </div>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 2.5C9.4 2.5 11.1 3.3 12.3 4.6L13.8 3C12.2 1.1 9.97 0 7.5 0C5.03 0 2.8 1.1 1.2 3L2.7 4.6C3.9 3.3 5.6 2.5 7.5 2.5Z" fill="#FFFFFF" />
          <path d="M7.5 5.5C8.7 5.5 9.8 6 10.6 6.9L12.1 5.3C10.9 3.9 9.3 3 7.5 3C5.7 3 4.1 3.9 2.9 5.3L4.4 6.9C5.2 6 6.3 5.5 7.5 5.5Z" fill="#FFFFFF" />
          <circle cx="7.5" cy="9.5" r="1.5" fill="#FFFFFF" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#FFFFFF" strokeOpacity="0.35" />
          <rect x="2" y="2" width="16" height="8" rx="2" fill="#FFFFFF" />
          <path d="M23 4v4a2 2 0 000-4z" fill="#FFFFFF" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
};

// ─── AVATAR ───────────────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 40 }) => (
  <div style={{
    width: size,
    height: size,
    borderRadius: THEME.radius.full,
    background: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }}>
    <span style={{
      fontWeight: 600,
      fontSize: size * 0.36,
      color: '#FFFFFF',
      letterSpacing: '-0.3px',
    }}>
      {initials}
    </span>
  </div>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NEW_REQUESTS = [
  {
    id: 'req-1',
    client: 'Emma L.',
    initials: 'EL',
    avatarColor: '#D97706',
    pet: 'Luna (Golden Retriever)',
    service: 'Dog Walking',
    duration: '60 min',
    date: 'Today, 3:30 PM',
    location: 'Zurichberg Park, 0.8 km',
    price: 'CHF 35',
  },
  {
    id: 'req-2',
    client: 'Tom K.',
    initials: 'TK',
    avatarColor: '#2563EB',
    pet: 'Buddy (Beagle)',
    service: 'Dog Walking',
    duration: '30 min',
    date: 'Tomorrow, 10:00 AM',
    location: 'Seefeld, 1.2 km',
    price: 'CHF 22',
  },
  {
    id: 'req-3',
    client: 'Lisa M.',
    initials: 'LM',
    avatarColor: '#7C3AED',
    pet: 'Milo (Cat)',
    service: 'Pet Sitting',
    duration: 'Overnight',
    date: 'March 20-21',
    location: "Client's home, Enge",
    price: 'CHF 85',
  },
];

const ACCEPTED_BOOKINGS = [
  {
    id: 'acc-1',
    client: 'Sarah B.',
    initials: 'SB',
    avatarColor: '#059669',
    pet: 'Rocky (Husky)',
    service: 'Dog Walking',
    date: 'Today, 5:00 PM',
    price: 'CHF 28',
  },
  {
    id: 'acc-2',
    client: 'Marco F.',
    initials: 'MF',
    avatarColor: '#DB2777',
    pet: 'Bella (Poodle)',
    service: 'Pet Sitting',
    date: 'Tomorrow, 2:00 PM',
    price: 'CHF 40',
  },
];

const COMPLETED_BOOKINGS = [
  {
    id: 'comp-1',
    client: 'Anna S.',
    initials: 'AS',
    avatarColor: '#0891B2',
    pet: 'Charlie (Dachshund)',
    service: 'Dog Walking',
    date: 'Mar 14, 2:00 PM',
    price: 'CHF 25',
    rating: 5,
  },
];

const DECLINE_REASONS = [
  'Schedule conflict',
  'Too far away',
  'Not available for this service',
  'Other',
];

const SEGMENT_TABS = ['New', 'Accepted', 'Completed'];

// ─── SEGMENTED CONTROL ───────────────────────────────────────────────────────
const SegmentedControl = ({ tabs, active, onChange, counts }) => {
  const C = THEME.colors;
  const activeIndex = tabs.indexOf(active);

  return (
    <div style={{
      display: 'flex',
      background: C.surfaceAlt,
      borderRadius: 12,
      padding: 3,
      margin: '0 20px',
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* Sliding indicator */}
      <div style={{
        position: 'absolute',
        top: 3,
        bottom: 3,
        left: `calc(${activeIndex * (100 / tabs.length)}% + 3px)`,
        width: `calc(${100 / tabs.length}% - 6px)`,
        background: C.surface,
        borderRadius: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        transition: `left ${THEME.motion.tab} ${THEME.motion.spring}`,
      }} />
      {tabs.map((tab) => {
        const isActive = tab === active;
        const count = counts?.[tab];
        return (
          <div
            key={tab}
            className="pro-tap"
            onClick={() => onChange(tab)}
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '8px 0',
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 5,
            }}
          >
            <span style={{
              fontSize: 13,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? C.primaryText : C.tertiaryText,
              transition: `color ${THEME.motion.fade}`,
            }}>
              {tab}
            </span>
            {count > 0 && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                color: '#FFFFFF',
                background: C.accent,
                borderRadius: THEME.radius.full,
                padding: '1px 6px',
                minWidth: 18,
                textAlign: 'center',
                lineHeight: '16px',
              }}>
                {count}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── NEW REQUEST CARD ────────────────────────────────────────────────────────
const NewRequestCard = ({ request, onAccept, onDecline }) => {
  const C = THEME.colors;

  return (
    <div
      className="req-card-enter"
      style={{
        background: C.surface,
        borderRadius: THEME.radius.card,
        padding: 20,
        boxShadow: THEME.shadows.soft,
        border: `1px solid ${C.divider}`,
      }}
    >
      {/* Client header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <Avatar initials={request.initials} color={request.avatarColor} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{
            fontWeight: 600,
            fontSize: 15,
            color: C.primaryText,
            display: 'block',
          }}>
            {request.client}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <PawPrint size={12} color={C.tertiaryText} strokeWidth={2} />
            <span style={{ fontSize: 13, color: C.secondaryText }}>{request.pet}</span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: THEME.colors.accentGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <PawPrint size={14} color={C.accent} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 13, color: C.secondaryText }}>
            {request.service} — {request.duration}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: THEME.colors.accentGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Calendar size={14} color={C.accent} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 13, color: C.secondaryText }}>{request.date}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: THEME.colors.accentGlow,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <MapPin size={14} color={C.accent} strokeWidth={2} />
          </div>
          <span style={{ fontSize: 13, color: C.secondaryText }}>{request.location}</span>
        </div>
      </div>

      {/* Price */}
      <div style={{
        background: C.surfaceAlt,
        borderRadius: 12,
        padding: '10px 14px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 13, color: C.secondaryText }}>Earnings</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: C.accent }}>{request.price}</span>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="pro-tap"
          onClick={() => onAccept(request.id)}
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            border: 'none',
            borderRadius: 14,
            padding: '13px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
          <span style={{ fontWeight: 600, fontSize: 14, color: '#FFFFFF' }}>Accept</span>
        </button>
        <button
          className="pro-tap"
          onClick={() => onDecline(request.id)}
          style={{
            flex: 1,
            background: 'transparent',
            border: `1.5px solid ${C.divider}`,
            borderRadius: 14,
            padding: '13px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <X size={16} color={C.secondaryText} strokeWidth={2} />
          <span style={{ fontWeight: 600, fontSize: 14, color: C.primaryText }}>Decline</span>
        </button>
      </div>
    </div>
  );
};

// ─── ACCEPTED CARD ────────────────────────────────────────────────────────────
const AcceptedCard = ({ booking }) => {
  const C = THEME.colors;

  return (
    <div style={{
      background: C.surface,
      borderRadius: THEME.radius.card,
      padding: 20,
      boxShadow: THEME.shadows.soft,
      border: `1px solid ${C.divider}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <Avatar initials={booking.initials} color={booking.avatarColor} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15, color: C.primaryText }}>
              {booking.client}
            </span>
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: C.success,
              background: `${C.success}1A`,
              borderRadius: THEME.radius.full,
              padding: '2px 8px',
            }}>
              Confirmed
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
            <PawPrint size={12} color={C.tertiaryText} strokeWidth={2} />
            <span style={{ fontSize: 13, color: C.secondaryText }}>{booking.pet}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Calendar size={13} color={C.tertiaryText} strokeWidth={2} />
          <span style={{ fontSize: 12, color: C.secondaryText }}>{booking.date}</span>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>{booking.price}</span>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button
          className="pro-tap"
          style={{
            flex: 1,
            background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
            border: 'none',
            borderRadius: 14,
            padding: '12px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <ArrowRight size={15} color="#FFFFFF" strokeWidth={2.5} />
          <span style={{ fontWeight: 600, fontSize: 13, color: '#FFFFFF' }}>Start</span>
        </button>
        <button
          className="pro-tap"
          style={{
            width: 44,
            height: 44,
            background: C.surfaceAlt,
            border: `1px solid ${C.divider}`,
            borderRadius: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <MessageCircle size={18} color={C.accent} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};

// ─── COMPLETED CARD ──────────────────────────────────────────────────────────
const CompletedCard = ({ booking }) => {
  const C = THEME.colors;

  return (
    <div style={{
      background: C.surface,
      borderRadius: THEME.radius.card,
      padding: 20,
      boxShadow: THEME.shadows.soft,
      border: `1px solid ${C.divider}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <Avatar initials={booking.initials} color={booking.avatarColor} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: C.primaryText, display: 'block' }}>
            {booking.client}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <PawPrint size={12} color={C.tertiaryText} strokeWidth={2} />
            <span style={{ fontSize: 13, color: C.secondaryText }}>{booking.pet}</span>
          </div>
        </div>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.accent }}>{booking.price}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Calendar size={13} color={C.tertiaryText} strokeWidth={2} />
          <span style={{ fontSize: 12, color: C.secondaryText }}>{booking.date}</span>
        </div>
        <span style={{ color: C.divider }}>|</span>
        <span style={{ fontSize: 12, color: C.secondaryText }}>{booking.service}</span>
      </div>

      {/* Rating */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: C.surfaceAlt,
        borderRadius: 12,
        padding: '10px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              color={i < booking.rating ? '#F59E0B' : C.tertiaryText}
              fill={i < booking.rating ? '#F59E0B' : 'none'}
              strokeWidth={i < booking.rating ? 0 : 1.5}
            />
          ))}
          <span style={{ fontSize: 12, fontWeight: 600, color: C.secondaryText, marginLeft: 4 }}>
            {booking.rating}.0
          </span>
        </div>
        <div className="pro-tap" style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: C.accent }}>View Details</span>
          <ChevronRight size={14} color={C.accent} strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, subtitle }) => {
  const C = THEME.colors;
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 64,
      paddingBottom: 64,
      gap: 12,
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: THEME.radius.full,
        background: C.surfaceAlt,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={28} color={C.tertiaryText} strokeWidth={1.5} />
      </div>
      <span style={{
        fontWeight: 600,
        fontSize: 16,
        color: C.primaryText,
        textAlign: 'center',
      }}>
        {title}
      </span>
      <span style={{
        fontSize: 13,
        color: C.tertiaryText,
        textAlign: 'center',
        maxWidth: 220,
        lineHeight: 1.5,
      }}>
        {subtitle}
      </span>
    </div>
  );
};

// ─── DECLINE MODAL ────────────────────────────────────────────────────────────
const DeclineModal = ({ onConfirm, onCancel }) => {
  const C = THEME.colors;
  const [selected, setSelected] = useState(null);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'flex-end',
      zIndex: 100,
      borderRadius: 50,
      animation: 'fadeModalIn 200ms ease both',
    }}>
      <div style={{
        background: C.surface,
        borderRadius: '24px 24px 0 0',
        padding: '20px 20px 36px',
        width: '100%',
        animation: 'slideSheetUp 300ms cubic-bezier(0.34, 1.56, 0.64, 1) both',
        border: `1px solid ${C.divider}`,
        borderBottom: 'none',
      }}>
        {/* Handle */}
        <div style={{
          width: 36,
          height: 4,
          borderRadius: THEME.radius.full,
          background: C.tertiaryText,
          margin: '0 auto 20px',
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}>
          <span style={{ fontWeight: 600, fontSize: 17, color: C.primaryText }}>
            Reason for declining?
          </span>
          <div
            className="pro-tap"
            onClick={onCancel}
            style={{
              width: 30,
              height: 30,
              borderRadius: THEME.radius.full,
              background: C.surfaceAlt,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={15} color={C.secondaryText} strokeWidth={2.5} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 20 }}>
          {DECLINE_REASONS.map((reason) => {
            const isSelected = selected === reason;
            return (
              <div
                key={reason}
                className="decline-option"
                onClick={() => setSelected(reason)}
                style={{
                  borderRadius: 14,
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: isSelected ? THEME.colors.accentGlow : 'transparent',
                  border: isSelected ? `1.5px solid ${C.accent}40` : `1.5px solid transparent`,
                  transition: 'all 120ms ease',
                }}
              >
                <span style={{
                  fontSize: 14,
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? C.accent : C.primaryText,
                }}>
                  {reason}
                </span>
                {/* Radio circle */}
                <div style={{
                  width: 20,
                  height: 20,
                  borderRadius: THEME.radius.full,
                  border: `2px solid ${isSelected ? C.accent : C.tertiaryText}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isSelected ? C.accent : 'transparent',
                  transition: 'all 120ms ease',
                }}>
                  {isSelected && (
                    <Circle size={8} color="#FFFFFF" fill="#FFFFFF" strokeWidth={0} />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="pro-tap"
          onClick={() => selected && onConfirm(selected)}
          style={{
            width: '100%',
            background: selected ? C.danger : C.tertiaryText,
            border: 'none',
            borderRadius: 14,
            padding: '15px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 7,
            transition: 'background 200ms ease',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 15, color: '#FFFFFF' }}>
            Confirm
          </span>
        </button>
      </div>
    </div>
  );
};

// ─── BOTTOM TAB BAR ──────────────────────────────────────────────────────────
const BottomTabBar = () => {
  const C = THEME.colors;
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/pro-dashboard' },
    { id: 'requests', label: 'Requests', icon: Clock, active: true, badge: 3, href: null },
    { id: 'schedule', label: 'Schedule', icon: Calendar, href: null },
    { id: 'earnings', label: 'Earnings', icon: Star, href: '/pro-earnings' },
    { id: 'profile', label: 'Profile', icon: User, href: '/pro-profile' },
  ];

  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      left: 16,
      right: 16,
      height: 64,
      background: 'rgba(13,27,42,0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderRadius: 22,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      border: `1px solid ${C.divider}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 4px',
      zIndex: 20,
    }}>
      {tabs.map((tab) => {
        const isActive = tab.active;
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
              }
            }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              padding: '6px 10px',
              borderRadius: 14,
              background: isActive ? THEME.colors.accentGlow : 'transparent',
              transition: `all ${THEME.motion.tab} ${THEME.motion.spring}`,
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon
                size={20}
                color={isActive ? C.accent : C.tertiaryText}
                strokeWidth={isActive ? 2 : 1.6}
              />
              {tab.badge && (
                <div style={{
                  position: 'absolute',
                  top: -4,
                  right: -8,
                  minWidth: 16,
                  height: 16,
                  borderRadius: THEME.radius.full,
                  background: C.accent,
                  color: '#FFFFFF',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 4px',
                  border: `2px solid ${C.background}`,
                }}>
                  {tab.badge}
                </div>
              )}
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? C.accent : C.tertiaryText,
              letterSpacing: '0.01em',
            }}>
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function ProRequestsScreen() {
  const C = THEME.colors;

  const [activeSegment, setActiveSegment] = useState('New');
  const [newRequests, setNewRequests] = useState(NEW_REQUESTS);
  const [declineModal, setDeclineModal] = useState(null);

  const handleAccept = (id) => {
    setNewRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleDeclineStart = (id) => {
    setDeclineModal(id);
  };

  const handleDeclineConfirm = () => {
    const id = declineModal;
    setDeclineModal(null);
    setNewRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const segmentCounts = {
    New: newRequests.length > 0 ? newRequests.length : undefined,
  };

  return (
    <div
      className="pro-requests"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E5E5',
        padding: '20px',
      }}
    >
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#0D1B2A', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column' }}>
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
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20, background: 'linear-gradient(to bottom, rgba(13,27,42,0.95), rgba(13,27,42,0.7), transparent)' }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button
              onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              style={{ background: '#142232', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <ChevronLeft size={22} color="#FFFFFF" />
            </button>
            <h2 className="text-[17px] font-semibold" style={{ color: '#FFFFFF' }}>Requests</h2>
            <button
              className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              style={{ background: '#142232', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Filter size={22} color="#FFFFFF" />
            </button>
          </div>
        </header>

        {/* Status bar spacer */}
        <div style={{ height: 54, flexShrink: 0 }} />

        {/* Header spacer for floating header */}
        <div style={{ height: 50, flexShrink: 0 }} />

        {/* Segmented control */}
        <SegmentedControl
          tabs={SEGMENT_TABS}
          active={activeSegment}
          onChange={setActiveSegment}
          counts={segmentCounts}
        />

        {/* Scrollable content */}
        <div
          className="pro-requests-scroll"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 16px 100px',
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
          }}
        >
          {/* NEW TAB */}
          {activeSegment === 'New' && (
            <>
              {newRequests.length === 0 ? (
                <EmptyState
                  icon={Check}
                  title="All caught up!"
                  subtitle="New booking requests from clients will appear here."
                />
              ) : (
                newRequests.map((request) => (
                  <NewRequestCard
                    key={request.id}
                    request={request}
                    onAccept={handleAccept}
                    onDecline={handleDeclineStart}
                  />
                ))
              )}
            </>
          )}

          {/* ACCEPTED TAB */}
          {activeSegment === 'Accepted' && (
            <>
              {ACCEPTED_BOOKINGS.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="No accepted bookings"
                  subtitle="Bookings you accept will show up here."
                />
              ) : (
                ACCEPTED_BOOKINGS.map((booking) => (
                  <AcceptedCard key={booking.id} booking={booking} />
                ))
              )}
            </>
          )}

          {/* COMPLETED TAB */}
          {activeSegment === 'Completed' && (
            <>
              {COMPLETED_BOOKINGS.length === 0 ? (
                <EmptyState
                  icon={Star}
                  title="No completed sessions"
                  subtitle="Completed bookings with ratings will appear here."
                />
              ) : (
                COMPLETED_BOOKINGS.map((booking) => (
                  <CompletedCard key={booking.id} booking={booking} />
                ))
              )}
            </>
          )}
        </div>

        {/* Bottom tab bar */}
        <BottomTabBar />


        {/* Decline modal */}
        {declineModal && (
          <DeclineModal
            onConfirm={handleDeclineConfirm}
            onCancel={() => setDeclineModal(null)}
          />
        )}
      </div>
    </div>
  );
}
