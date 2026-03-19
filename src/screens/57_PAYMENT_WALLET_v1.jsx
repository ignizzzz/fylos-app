import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Plus,
  Clock,
  TrendingUp,
  TrendingDown,
  Shield,
  Smartphone,
  Circle,
  Check,
  Star,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// THEME — Fylos Design System
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
    danger: '#FF3B30',
    success: '#00C060',
    warning: '#FF9500',
    info: '#007AFF',
    divider: '#E5E5E5',
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)',
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// ---------------------------------------------------------------------------
// GLOBAL STYLES
// ---------------------------------------------------------------------------
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .wallet-screen {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: ${THEME.colors.background};
      color: ${THEME.colors.primaryText};
      overflow: hidden;
    }

    .wallet-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .wallet-scroll::-webkit-scrollbar { display: none; }

    .wallet-tap {
      transition: opacity ${THEME.motion.tap} ease, transform ${THEME.motion.tap} ease;
      cursor: pointer;
    }
    .wallet-tap:active { opacity: 0.7; transform: scale(0.97); }
  `}</style>
);

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------
const PAYMENT_METHODS = [
  { id: 'visa', label: 'Visa', last4: '4242', isDefault: true },
  { id: 'mc', label: 'Mastercard', last4: '8523', isDefault: false },
  { id: 'applepay', label: 'Apple Pay', last4: null, isDefault: false },
];

const TRANSACTIONS = [
  {
    id: 'tx1',
    title: 'Dog Walking',
    subtitle: 'Sarah M.',
    date: 'Today',
    amount: -35,
  },
  {
    id: 'tx2',
    title: 'Refund',
    subtitle: 'Cancelled booking',
    date: 'Yesterday',
    amount: 32,
  },
  {
    id: 'tx3',
    title: 'Grooming',
    subtitle: 'Pet Salon Züri',
    date: 'Mar 12',
    amount: -65,
  },
  {
    id: 'tx4',
    title: 'Subscription',
    subtitle: null,
    date: 'Mar 10',
    amount: -9.90,
  },
];

// ---------------------------------------------------------------------------
// BALANCE CARD
// ---------------------------------------------------------------------------
const BalanceCard = () => (
  <div
    style={{
      background: 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)',
      borderRadius: 20,
      padding: 20,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: THEME.shadows.soft,
      border: '1px solid rgba(0,0,0,0.03)',
    }}
  >
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.75)',
          marginBottom: 8,
          opacity: 0.8,
        }}
      >
        Available Balance
      </div>
      <div
        style={{
          fontSize: 34,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '-1px',
          lineHeight: 1.1,
          marginBottom: 4,
        }}
      >
        CHF 45.00
      </div>
      <div
        style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.65)',
          marginBottom: 20,
          opacity: 0.8,
        }}
      >
        From credits & refunds
      </div>
      <button
        className="wallet-tap"
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: 9999,
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: 600,
          padding: '8px 20px',
          fontFamily: 'Inter, sans-serif',
          backdropFilter: 'blur(4px)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Plus size={14} color="#FFFFFF" strokeWidth={2.5} />
        Top Up
      </button>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// PAYMENT METHODS
// ---------------------------------------------------------------------------
const PaymentMethodIcon = ({ method }) => {
  if (method.id === 'applepay') {
    return <Smartphone size={18} color={THEME.colors.secondaryText} />;
  }
  return <CreditCard size={18} color={THEME.colors.secondaryText} />;
};

const PaymentMethods = () => (
  <div>
    <div
      style={{
        fontSize: 16,
        fontWeight: 500,
        color: THEME.colors.primaryText,
        letterSpacing: '-0.3px',
        marginBottom: 12,
      }}
    >
      Payment Methods
    </div>
    <div
      style={{
        background: THEME.colors.surface,
        borderRadius: 20,
        boxShadow: THEME.shadows.soft,
        border: '1px solid rgba(0,0,0,0.03)',
        overflow: 'hidden',
      }}
    >
      {PAYMENT_METHODS.map((method, i) => (
        <div
          key={method.id}
          className="wallet-tap"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '14px 20px',
            borderBottom:
              i < PAYMENT_METHODS.length
                ? `1px solid ${THEME.colors.divider}`
                : 'none',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: THEME.colors.surfaceAlt,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PaymentMethodIcon method={method} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: THEME.colors.primaryText,
                }}
              >
                {method.label}
                {method.last4 && (
                  <span
                    style={{
                      fontWeight: 400,
                      color: THEME.colors.secondaryText,
                    }}
                  >
                    {' '}
                    •••• {method.last4}
                  </span>
                )}
              </span>
              {method.isDefault && (
                <span
                  style={{
                    background: THEME.colors.accent,
                    color: '#FFFFFF',
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: 9999,
                  }}
                >
                  Default
                </span>
              )}
            </div>
          </div>
          <ChevronRight size={16} color={THEME.colors.tertiaryText} />
        </div>
      ))}
      {/* Add Payment Method */}
      <div
        className="wallet-tap"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 20px',
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            background: 'rgba(232,93,42,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Plus size={18} color={THEME.colors.accent} />
        </div>
        <span
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: THEME.colors.accent,
            flex: 1,
          }}
        >
          Add Payment Method
        </span>
        <ChevronRight size={16} color={THEME.colors.accent} />
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// TRANSACTION HISTORY
// ---------------------------------------------------------------------------
const TransactionIcon = ({ amount }) => {
  const isPositive = amount > 0;
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: isPositive
          ? 'rgba(0,192,96,0.08)'
          : THEME.colors.surfaceAlt,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {isPositive ? (
        <TrendingUp size={17} color={THEME.colors.success} />
      ) : (
        <TrendingDown size={17} color={THEME.colors.secondaryText} />
      )}
    </div>
  );
};

const formatAmount = (amount) => {
  const abs = Math.abs(amount);
  const formatted = abs % 1 === 0 ? abs.toString() : abs.toFixed(2);
  return amount > 0 ? `+CHF ${formatted}` : `-CHF ${formatted}`;
};

const TransactionList = () => (
  <div>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
      }}
    >
      <span
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: THEME.colors.primaryText,
          letterSpacing: '-0.3px',
        }}
      >
        Transaction History
      </span>
      <span
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: THEME.colors.secondaryText,
          opacity: 0.8,
        }}
      >
        This Month
      </span>
    </div>
    <div
      style={{
        background: THEME.colors.surface,
        borderRadius: 20,
        boxShadow: THEME.shadows.soft,
        border: '1px solid rgba(0,0,0,0.03)',
        overflow: 'hidden',
      }}
    >
      {TRANSACTIONS.map((tx, i) => {
        const isPositive = tx.amount > 0;
        return (
          <div
            key={tx.id}
            className="wallet-tap"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px 20px',
              borderBottom:
                i < TRANSACTIONS.length - 1
                  ? `1px solid ${THEME.colors.divider}`
                  : 'none',
            }}
          >
            <TransactionIcon amount={tx.amount} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: THEME.colors.primaryText,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  opacity: 0.9,
                }}
              >
                {tx.title}
                {tx.subtitle && (
                  <span style={{ color: THEME.colors.secondaryText, fontWeight: 400 }}>
                    {' — '}
                    {tx.subtitle}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: THEME.colors.tertiaryText,
                  marginTop: 2,
                  opacity: 0.8,
                }}
              >
                {tx.date}
              </div>
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: isPositive
                  ? THEME.colors.success
                  : THEME.colors.primaryText,
                fontVariantNumeric: 'tabular-nums',
                flexShrink: 0,
              }}
            >
              {formatAmount(tx.amount)}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// MAIN SCREEN
// ---------------------------------------------------------------------------
const PaymentWalletScreen = () => (
  <>
    <GlobalStyles />
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#E5E5E5',
        padding: '20px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      {/* iPhone Frame */}
      <div
        className="relative"
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F9F9FB',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
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
            <h2 className="text-[17px] font-semibold text-[#111111]">Wallet</h2>
            {/* Right: Invisible spacer */}
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Scrollable Content */}
        <div
          className="absolute inset-0 overflow-y-auto wallet-scroll"
          style={{ paddingTop: 54, paddingBottom: 40 }}
        >
        {/* Header spacer */}
        <div style={{ height: 54 }} />

        <div style={{ padding: '0 20px 32px' }}>
          <div style={{ marginBottom: 24 }}>
            <BalanceCard />
          </div>
          <div style={{ marginBottom: 24 }}>
            <PaymentMethods />
          </div>
          <div style={{ marginBottom: 24 }}>
            <TransactionList />
          </div>
        </div>
        </div>
      </div>
    </div>
  </>
);

export default PaymentWalletScreen;
