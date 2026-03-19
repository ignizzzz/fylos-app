import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  Star,
  Calendar,
  ArrowRight,
  TrendingUp,
  Circle,
  Settings,
  Home,
  Bell,
  User,
  MapPin,
  PawPrint,
} from 'lucide-react';

/**
 * 54_PRO_EARNINGS_v1.jsx
 * Earnings & Payouts screen for Fylos PRO service providers.
 * Revolut-inspired dark premium design with Fylos accent colors.
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
    success: '#00D26A',
    danger: '#FF4444',
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
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34,1.56,0.64,1)',
  },
};

const C = THEME.colors;

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .pro-earnings * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pro-earnings-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .pro-earnings-scroll::-webkit-scrollbar {
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

    @keyframes barGrow {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }

    .bar-col {
      transform-origin: bottom;
      animation: barGrow 500ms ${THEME.motion.spring} both;
    }

    .pro-row:active {
      background: rgba(255,255,255,0.03);
    }
  `}</style>
);

// ─── STATUS BAR ───────────────────────────────────────────────────────────────
const StatusBar = () => (
  <div style={{
    height: '44px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: '0 28px 6px',
    flexShrink: 0,
  }}>
    <span style={{ fontSize: '13px', fontWeight: 700, color: C.primaryText }}>9:41</span>
    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
      <div style={{
        width: 16, height: 8,
        border: `1.5px solid ${C.primaryText}`,
        borderRadius: 2,
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', left: 1, top: 1, bottom: 1,
          width: '75%', background: C.primaryText, borderRadius: 1,
        }} />
      </div>
    </div>
  </div>
);

// ─── HEADER (now rendered inline as floating) ────────────────────────────────

// ─── CHART DATA ───────────────────────────────────────────────────────────────
const CHART_DATA = {
  week: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [55, 120, 35, 95, 145, 200, 85],
  },
  month: {
    labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'],
    values: [380, 520, 445, 500],
  },
  all: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    values: [920, 1050, 1245, 880, 1100, 960, 1140],
  },
};

// ─── TRANSACTIONS ─────────────────────────────────────────────────────────────
const TRANSACTIONS = [
  // Today
  { id: 1, service: 'Dog Walking', client: 'Emma L.', date: 'Today', amount: 'CHF 35', status: 'completed' },
  { id: 2, service: 'Pet Sitting', client: 'Tom K.', date: 'Today', amount: 'CHF 55', status: 'completed' },
  // Yesterday
  { id: 3, service: 'Dog Walking', client: 'Lisa M.', date: 'Yesterday', amount: 'CHF 28', status: 'completed' },
  { id: 4, service: 'Grooming', client: 'Anna K.', date: 'Yesterday', amount: 'CHF 45', status: 'pending' },
  // Earlier
  { id: 5, service: 'Overnight Sitting', client: 'Marc S.', date: 'Mar 14', amount: 'CHF 85', status: 'completed' },
  { id: 6, service: 'Dog Walking', client: 'Sarah B.', date: 'Mar 13', amount: 'CHF 32', status: 'completed' },
];

// ─── BALANCE CARD ─────────────────────────────────────────────────────────────
const BalanceCard = () => (
  <div className="pro-fade-in" style={{
    margin: '0 20px 14px',
    background: `linear-gradient(135deg, ${C.surface}, ${C.surfaceAlt})`,
    borderRadius: '20px',
    padding: '24px 20px',
    boxShadow: THEME.shadows.soft,
    border: `1px solid ${C.divider}`,
  }}>
    <div style={{
      fontSize: '12px',
      fontWeight: 500,
      color: C.secondaryText,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      marginBottom: '6px',
    }}>Available for payout</div>

    <div style={{
      fontSize: '38px',
      fontWeight: 700,
      color: C.primaryText,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      marginBottom: '20px',
    }}>CHF 1,240</div>

    <button className="pro-tap" style={{
      width: '100%',
      height: '48px',
      borderRadius: THEME.radius.full,
      border: 'none',
      background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
      color: '#FFFFFF',
      fontSize: '15px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    }}>
      <ArrowRight size={16} strokeWidth={2} />
      Request Payout
    </button>
  </div>
);

// ─── PERIOD SELECTOR ──────────────────────────────────────────────────────────
const PeriodSelector = ({ active, onChange }) => {
  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div style={{
      margin: '0 20px 14px',
      display: 'flex',
      background: C.surfaceAlt,
      borderRadius: THEME.radius.full,
      padding: '4px',
    }}>
      {periods.map(p => {
        const isActive = active === p.id;
        return (
          <div
            key={p.id}
            className="pro-tap"
            onClick={() => onChange(p.id)}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: THEME.radius.full,
              background: isActive ? C.surface : 'transparent',
              color: isActive ? C.primaryText : C.tertiaryText,
              fontSize: '13px',
              fontWeight: isActive ? 600 : 500,
              textAlign: 'center',
              boxShadow: isActive ? THEME.shadows.soft : 'none',
              transition: `all ${THEME.motion.tab} ${THEME.motion.spring}`,
            }}
          >
            {p.label}
          </div>
        );
      })}
    </div>
  );
};

// ─── EARNINGS CHART ───────────────────────────────────────────────────────────
const EarningsChart = ({ period }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const data = CHART_DATA[period];
  const maxVal = Math.max(...data.values);

  return (
    <div className="pro-fade-in" style={{
      margin: '0 20px 14px',
      background: C.surface,
      borderRadius: '20px',
      padding: '20px',
      boxShadow: THEME.shadows.soft,
      border: `1px solid ${C.divider}`,
    }}>
      {/* Chart bars */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: data.labels.length > 5 ? '6px' : '10px',
        height: '100px',
        marginBottom: '8px',
      }}>
        {data.labels.map((label, idx) => {
          const val = data.values[idx];
          const heightPct = Math.max((val / maxVal) * 100, 8);
          const isHovered = hoveredBar === idx;

          return (
            <div
              key={label}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                height: '100%',
                justifyContent: 'flex-end',
                position: 'relative',
              }}
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <div style={{
                  position: 'absolute',
                  bottom: `calc(${heightPct}% + 8px)`,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: C.accent,
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: 600,
                  borderRadius: THEME.radius.small,
                  padding: '3px 7px',
                  whiteSpace: 'nowrap',
                  zIndex: 10,
                  animation: `proFadeIn ${THEME.motion.fade} ease-out`,
                }}>
                  CHF {val}
                </div>
              )}

              {/* Bar */}
              <div
                className="bar-col"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  width: '100%',
                  maxWidth: '32px',
                  height: `${heightPct}%`,
                  borderRadius: '6px',
                  background: isHovered
                    ? C.accentLight
                    : `linear-gradient(180deg, ${C.accentLight}, ${C.accent})`,
                  cursor: 'pointer',
                  transition: 'background 160ms ease',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* X-axis labels */}
      <div style={{
        display: 'flex',
        gap: data.labels.length > 5 ? '6px' : '10px',
      }}>
        {data.labels.map(label => (
          <div key={label} style={{
            flex: 1,
            textAlign: 'center',
            fontSize: data.labels.length > 5 ? '10px' : '11px',
            color: C.tertiaryText,
            fontWeight: 500,
          }}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── TRANSACTION GROUP ────────────────────────────────────────────────────────
const TransactionGroup = ({ label, items }) => (
  <div style={{ marginBottom: '14px' }}>
    <div style={{
      fontSize: '12px',
      fontWeight: 500,
      color: C.tertiaryText,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      padding: '0 20px',
      marginBottom: '8px',
    }}>{label}</div>

    <div style={{
      margin: '0 20px',
      background: C.surface,
      borderRadius: '20px',
      boxShadow: THEME.shadows.soft,
      overflow: 'hidden',
      border: `1px solid ${C.divider}`,
    }}>
      {items.map((tx, idx) => (
        <div
          key={tx.id}
          className="pro-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 16px',
            borderBottom: idx < items.length - 1 ? `1px solid ${C.divider}` : 'none',
            cursor: 'pointer',
            transition: 'background 140ms ease',
          }}
        >
          {/* Icon */}
          <div style={{
            width: 40, height: 40,
            borderRadius: '12px',
            background: C.accentGlow,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <PawPrint size={18} color={C.accent} strokeWidth={1.8} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 600,
              color: C.primaryText,
              letterSpacing: '-0.01em',
            }}>{tx.service}</div>
            <div style={{
              fontSize: '12px',
              color: C.secondaryText,
              marginTop: '2px',
            }}>{tx.client}</div>
          </div>

          {/* Amount + status */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 700,
              color: C.primaryText,
              letterSpacing: '-0.01em',
            }}>{tx.amount}</div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              marginTop: '3px',
            }}>
              {tx.status === 'completed' ? (
                <Check size={11} color={C.success} strokeWidth={2.5} />
              ) : (
                <Clock size={11} color={C.tertiaryText} strokeWidth={2} />
              )}
              <span style={{
                fontSize: '11px',
                fontWeight: 500,
                color: tx.status === 'completed' ? C.success : C.tertiaryText,
              }}>
                {tx.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── PAYOUT SETTINGS LINK ─────────────────────────────────────────────────────
const PayoutSettingsLink = () => (
  <div className="pro-tap" style={{
    margin: '0 20px 14px',
    background: C.surface,
    borderRadius: '20px',
    padding: '16px',
    boxShadow: THEME.shadows.soft,
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: `1px solid ${C.divider}`,
  }}>
    <div style={{
      width: 40, height: 40,
      borderRadius: '12px',
      background: C.accentGlow,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Settings size={18} color={C.accent} strokeWidth={1.8} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{
        fontSize: '14px',
        fontWeight: 600,
        color: C.primaryText,
      }}>Payout Settings</div>
      <div style={{
        fontSize: '12px',
        color: C.secondaryText,
        marginTop: '2px',
      }}>Bank account, schedule, preferences</div>
    </div>
    <ChevronRight size={18} color={C.tertiaryText} strokeWidth={1.8} />
  </div>
);

// ─── BOTTOM TAB BAR ───────────────────────────────────────────────────────────
const BottomTabBar = () => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/pro-dashboard' },
    { id: 'requests', label: 'Requests', icon: Bell, href: '/pro-requests' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, href: null },
    { id: 'earnings', label: 'Earnings', icon: TrendingUp, href: null },
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
      border: `1px solid ${C.divider}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0 4px',
    }}>
      {tabs.map(tab => {
        const isActive = tab.id === 'earnings';
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
              gap: '3px',
              padding: '6px 10px',
              borderRadius: '14px',
              background: isActive ? C.accentGlow : 'transparent',
              transition: `all ${THEME.motion.tab} ${THEME.motion.spring}`,
            }}
          >
            <Icon
              size={20}
              color={isActive ? C.accent : C.tertiaryText}
              strokeWidth={isActive ? 2 : 1.6}
            />
            <span style={{
              fontSize: '10px',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? C.accent : C.tertiaryText,
              letterSpacing: '0.01em',
            }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── GROUP TRANSACTIONS BY DATE ───────────────────────────────────────────────
const groupTransactions = (txs) => {
  const groups = {};
  txs.forEach(tx => {
    if (!groups[tx.date]) groups[tx.date] = [];
    groups[tx.date].push(tx);
  });
  return Object.entries(groups);
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function ProEarningsScreen() {
  const [activePeriod, setActivePeriod] = useState('month');
  const groupedTx = groupTransactions(TRANSACTIONS);

  return (
    <div className="pro-earnings" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0A0A0A',
      padding: '20px',
    }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#0D1B2A', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
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
            {/* Left: Back button */}
            <button
              onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              style={{ background: C.surface, border: `1px solid ${C.divider}`, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
            >
              <ChevronLeft size={22} color="#FFFFFF" />
            </button>
            {/* Center: Title */}
            <h2 className="text-[17px] font-semibold" style={{ color: '#FFFFFF' }}>Earnings</h2>
            {/* Right: Invisible spacer */}
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Screen Content */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 54,
          zIndex: 0,
        }}>

          <div className="pro-earnings-scroll" style={{
            flex: 1,
            paddingTop: 54,
            paddingBottom: '100px',
          }}>
            <BalanceCard />
            <PeriodSelector active={activePeriod} onChange={setActivePeriod} />
            <EarningsChart period={activePeriod} />

            {/* Transactions list */}
            {groupedTx.map(([date, items]) => (
              <TransactionGroup key={date} label={date} items={items} />
            ))}

            <PayoutSettingsLink />
          </div>

          <BottomTabBar />
        </div>

      </div>
    </div>
  );
}
