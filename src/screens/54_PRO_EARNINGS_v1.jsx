import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  Calendar,
  ArrowRight,
  TrendingUp,
  Settings,
  Home,
  User,
  PawPrint,
  BarChart3,
  Wallet,
} from 'lucide-react';

/**
 * 54_PRO_EARNINGS_v1.jsx
 * Earnings & Payouts screen for Fylos PRO service providers.
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

    .pro-earnings * {
      margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .pro-earnings-scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .pro-earnings-scroll::-webkit-scrollbar { display: none; }

    .pro-tap {
      transition: transform 120ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease;
      cursor: pointer; user-select: none;
    }
    .pro-tap:active { transform: scale(0.97); opacity: 0.85; }

    @keyframes proFadeIn {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .pro-fade { animation: proFadeIn 280ms ease both; }

    @keyframes barGrowY {
      from { transform: scaleY(0); }
      to   { transform: scaleY(1); }
    }
    .bar-col { transform-origin: bottom; animation: barGrowY 500ms cubic-bezier(0.34,1.56,0.64,1) both; }

    .tx-row { transition: background 140ms ease; cursor: pointer; }
    .tx-row:active { background: rgba(0,0,0,0.02); }
  `}</style>
);

// ─── CHART DATA ──────────────────────────────────────────────────────────────
const CHART_DATA = {
  week: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [55, 120, 35, 95, 145, 200, 85] },
  month: { labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'], values: [380, 520, 445, 500] },
  all: { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], values: [920, 1050, 1245, 880, 1100, 960, 1140] },
};

// ─── TRANSACTIONS ────────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { id: 1, service: 'Dog Walking', client: 'Emma L.', date: 'Today', amount: 'CHF 35', status: 'completed' },
  { id: 2, service: 'Pet Sitting', client: 'Tom K.', date: 'Today', amount: 'CHF 55', status: 'completed' },
  { id: 3, service: 'Dog Walking', client: 'Lisa M.', date: 'Yesterday', amount: 'CHF 28', status: 'completed' },
  { id: 4, service: 'Grooming', client: 'Anna K.', date: 'Yesterday', amount: 'CHF 45', status: 'pending' },
  { id: 5, service: 'Overnight Sitting', client: 'Marc S.', date: 'Mar 14', amount: 'CHF 85', status: 'completed' },
  { id: 6, service: 'Dog Walking', client: 'Sarah B.', date: 'Mar 13', amount: 'CHF 32', status: 'completed' },
];

// ─── BALANCE CARD ────────────────────────────────────────────────────────────
const BalanceCard = () => (
  <div className="pro-fade" style={{
    margin: '0 20px 14px',
    background: '#F3EFEB',
    borderRadius: 20, padding: '24px 20px',
    border: '1px solid #EDE8E2',
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{
      fontSize: 12, fontWeight: 500, color: '#A09A94',
      letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6,
    }}>Available for payout</div>

    <div style={{
      fontSize: 40, fontWeight: 700, color: '#111',
      letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 20,
    }}>CHF 1,240</div>

    <button className="pro-tap" style={{
      width: '100%', height: 48, borderRadius: 14, border: 'none',
      background: '#111',
      color: '#FFFFFF', fontSize: 15, fontWeight: 600,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    }}>
      <Wallet size={16} strokeWidth={2} />
      Request Payout
    </button>
  </div>
);

// ─── PERIOD SELECTOR PILLS ───────────────────────────────────────────────────
const PeriodSelector = ({ active, onChange }) => {
  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'all', label: 'All Time' },
  ];

  return (
    <div style={{
      margin: '0 20px 14px', display: 'flex',
      background: '#F3EFEB', borderRadius: 9999, padding: 4,
      border: '1px solid #EDE8E2',
    }}>
      {periods.map(p => {
        const isActive = active === p.id;
        return (
          <div key={p.id} className="pro-tap" onClick={() => onChange(p.id)} style={{
            flex: 1, padding: '9px 0', borderRadius: 9999,
            background: isActive ? '#FFFFFF' : 'transparent',
            color: isActive ? '#111' : '#A09A94',
            fontSize: 13, fontWeight: isActive ? 600 : 500, textAlign: 'center',
            boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
            transition: 'all 240ms cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            {p.label}
          </div>
        );
      })}
    </div>
  );
};

// ─── EARNINGS CHART (accent bars) ───────────────────────────────────────────
const EarningsChart = ({ period }) => {
  const [hoveredBar, setHoveredBar] = useState(null);
  const data = CHART_DATA[period];
  const maxVal = Math.max(...data.values);

  return (
    <div className="pro-fade" style={{
      margin: '0 20px 14px', background: '#F3EFEB', borderRadius: 20, padding: 20,
      border: '1px solid #EDE8E2',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: data.labels.length > 5 ? 6 : 10, height: 100, marginBottom: 8 }}>
        {data.labels.map((label, idx) => {
          const val = data.values[idx];
          const heightPct = Math.max((val / maxVal) * 100, 8);
          const isHovered = hoveredBar === idx;

          return (
            <div key={label} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 4, height: '100%', justifyContent: 'flex-end', position: 'relative',
            }}
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
            >
              {isHovered && (
                <div style={{
                  position: 'absolute', bottom: `calc(${heightPct}% + 8px)`, left: '50%',
                  transform: 'translateX(-50%)', background: '#E85D2A',
                  color: '#fff', fontSize: 10, fontWeight: 600, borderRadius: 8,
                  padding: '3px 7px', whiteSpace: 'nowrap', zIndex: 10,
                  animation: 'proFadeIn 150ms ease',
                }}>CHF {val}</div>
              )}
              <div className="bar-col" style={{
                animationDelay: `${idx * 50}ms`,
                width: '100%', maxWidth: 32, height: `${heightPct}%`,
                borderRadius: 6,
                background: isHovered ? '#E85D2A' : '#E85D2A',
                cursor: 'pointer', transition: 'opacity 160ms ease',
                opacity: isHovered ? 1 : 0.75,
              }} />
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: data.labels.length > 5 ? 6 : 10 }}>
        {data.labels.map(label => (
          <div key={label} style={{
            flex: 1, textAlign: 'center',
            fontSize: data.labels.length > 5 ? 10 : 11,
            color: '#A09A94', fontWeight: 500,
          }}>{label}</div>
        ))}
      </div>
    </div>
  );
};

// ─── TRANSACTION GROUP ───────────────────────────────────────────────────────
const TransactionGroup = ({ label, items }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{
      fontSize: 12, fontWeight: 500, color: '#A09A94',
      textTransform: 'uppercase', letterSpacing: '0.06em',
      padding: '0 20px', marginBottom: 8,
    }}>{label}</div>

    <div style={{
      margin: '0 20px', background: '#F3EFEB', borderRadius: 20,
      border: '1px solid #EDE8E2',
      overflow: 'hidden',
    }}>
      {items.map((tx, idx) => (
        <div key={tx.id} className="tx-row" style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 16px',
          borderBottom: idx < items.length - 1 ? '1px solid #EDE8E2' : 'none',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(232,93,42,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <PawPrint size={18} color="#E85D2A" strokeWidth={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111', letterSpacing: '-0.01em' }}>{tx.service}</div>
            <div style={{ fontSize: 12, color: '#6E6058', marginTop: 2 }}>{tx.client}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111', letterSpacing: '-0.01em' }}>
              +{tx.amount.replace('CHF ', '')}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
              {tx.status === 'completed'
                ? <Check size={11} color="#3F8D63" strokeWidth={2.5} />
                : <Clock size={11} color="#A09A94" strokeWidth={2} />}
              <span style={{
                fontSize: 11, fontWeight: 500,
                color: tx.status === 'completed' ? '#3F8D63' : '#A09A94',
              }}>{tx.status === 'completed' ? 'Completed' : 'Pending'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── PAYOUT SETTINGS LINK ────────────────────────────────────────────────────
const PayoutSettingsLink = () => (
  <div className="pro-tap" style={{
    margin: '0 20px 14px', background: '#F3EFEB', borderRadius: 20, padding: 16,
    border: '1px solid #EDE8E2',
    display: 'flex', alignItems: 'center', gap: 12,
  }}>
    <div style={{
      width: 40, height: 40, borderRadius: 12,
      background: 'rgba(232,93,42,0.08)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
    }}>
      <Settings size={18} color="#E85D2A" strokeWidth={1.8} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#111' }}>Payout Settings</div>
      <div style={{ fontSize: 12, color: '#6E6058', marginTop: 2 }}>Bank account, schedule, preferences</div>
    </div>
    <ChevronRight size={18} color="#A09A94" strokeWidth={1.8} />
  </div>
);

// ─── BOTTOM TAB BAR ──────────────────────────────────────────────────────────
const BottomTabBar = () => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/pro-dashboard' },
    { id: 'requests', label: 'Requests', icon: Clock, href: '/pro-requests' },
    { id: 'schedule', label: 'Schedule', icon: Calendar, href: null },
    { id: 'earnings', label: 'Earnings', icon: BarChart3, active: true, href: null },
    { id: 'profile', label: 'Profile', icon: User, href: '/pro-profile' },
  ];

  return (
    <div style={{
      position: 'absolute', bottom: 24, left: 16, right: 16, height: 64,
      background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderRadius: 22, boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
      border: '1px solid #EDE8E2',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 4px',
    }}>
      {tabs.map(tab => {
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
            transition: 'all 240ms cubic-bezier(0.34,1.56,0.64,1)',
          }}>
            <Icon size={20} color={isActive ? '#E85D2A' : '#A09A94'} strokeWidth={isActive ? 2 : 1.6} />
            <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 500, color: isActive ? '#E85D2A' : '#A09A94' }}>{tab.label}</span>
          </div>
        );
      })}
    </div>
  );
};

// ─── GROUP TRANSACTIONS ──────────────────────────────────────────────────────
const groupTransactions = (txs) => {
  const groups = {};
  txs.forEach(tx => { if (!groups[tx.date]) groups[tx.date] = []; groups[tx.date].push(tx); });
  return Object.entries(groups);
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function ProEarningsScreen() {
  const [activePeriod, setActivePeriod] = useState('month');
  const groupedTx = groupTransactions(TRANSACTIONS);

  return (
    <div className="pro-earnings" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#E5E5E5', padding: 20,
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
            <h2 className="text-[17px] font-semibold text-[#111]">Earnings</h2>
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Screen Content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', zIndex: 0 }}>
          <div className="pro-earnings-scroll" style={{ flex: 1, paddingTop: 100, paddingBottom: 100 }}>
            <BalanceCard />
            <PeriodSelector active={activePeriod} onChange={setActivePeriod} />
            <EarningsChart period={activePeriod} />
            {groupedTx.map(([date, items]) => <TransactionGroup key={date} label={date} items={items} />)}
            <PayoutSettingsLink />
          </div>
          <BottomTabBar />
        </div>
      </div>
    </div>
  );
}
