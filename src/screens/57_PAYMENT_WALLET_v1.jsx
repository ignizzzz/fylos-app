import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, Shield, Check,
  TrendingUp, ArrowUpRight, ArrowDownLeft, CalendarClock,
  Gift, Download, Fingerprint, Ticket, Users, Info,
} from 'lucide-react';

/**
 * 57_PAYMENT_WALLET_v1.jsx
 * Wallet — balance, quick actions, upcoming, spending,
 * per-pet breakdown, methods, history, wallet settings.
 */

const THEME = {
  bg: '#F7F5F2', card: '#FFFFFF', divider: '#F1EDE8',
  coral: '#E85D2A', txt: '#111111', muted: '#9B9B9F',
  mutedDark: '#6E6E73', tint: '#FBE7DD',
};

const PAYMENT_METHODS = [
  { id: 'visa',     label: 'Visa',       last4: '4242', isDefault: true  },
  { id: 'mc',       label: 'Mastercard', last4: '8523', isDefault: false },
  { id: 'applepay', label: 'Apple Pay',  last4: null,   isDefault: false },
];

const TRANSACTIONS = [
  { id: 'tx1', title: 'Dog Walking', subtitle: 'Sarah M.',        date: 'Today',     amount: -35,   source: 'Visa ·· 4242' },
  { id: 'tx2', title: 'Refund',      subtitle: 'Cancelled booking', date: 'Yesterday', amount: 32,    source: 'Credit',       isCredit: true },
  { id: 'tx3', title: 'Grooming',    subtitle: 'Pet Salon Zuri',   date: 'Mar 12',    amount: -65,   source: 'Visa ·· 4242 · CHF 10 credit', mixed: true },
  { id: 'tx4', title: 'Subscription',subtitle: null,                date: 'Mar 10',    amount: -9.9,  source: 'Visa ·· 4242' },
];

const CREDIT_BREAKDOWN = [
  { id: 'ref',   label: 'Referrals', amount: 20, source: '2 friends joined' },
  { id: 'refn',  label: 'Refunds',   amount: 25, source: '1 cancelled booking' },
];
const CREDIT_TOTAL = CREDIT_BREAKDOWN.reduce((s, x) => s + x.amount, 0);

const UPCOMING = [
  { id: 'u1', title: 'Spring Grooming', subtitle: 'Paws & Claws', date: 'Apr 25', amount: 95,  pet: 'Luna' },
  { id: 'u2', title: 'Evening walk',    subtitle: 'Tom K.',       date: 'Apr 23', amount: 30,  pet: 'Leo'  },
];

const SPENDING_CATEGORIES = [
  { label: 'Walking',  amount: 182, color: '#E85D2A' },
  { label: 'Grooming', amount: 120, color: '#F59E0B' },
  { label: 'Vet',      amount: 85,  color: '#EF4444' },
  { label: 'Other',    amount: 23,  color: '#8E8E93' },
];
const SPENDING_TOTAL = SPENDING_CATEGORIES.reduce((s, c) => s + c.amount, 0);

const SPENDING_BY_PET = [
  { id: 'leo',  name: 'Leo',  amount: 215, photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=120&h=120' },
  { id: 'luna', name: 'Luna', amount: 148, photo: 'https://images.unsplash.com/photo-1537151608804-ea2f1ea14a15?auto=format&fit=crop&q=80&w=120&h=120' },
  { id: 'max',  name: 'Max',  amount: 47,  photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=120&h=120' },
];

const formatAmount = (n) => {
  const abs = Math.abs(n);
  const f = abs % 1 === 0 ? abs.toString() : abs.toFixed(2);
  return n > 0 ? `+CHF ${f}` : `−CHF ${f}`;
};

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

/* ────────── Toggle ────────── */
const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="active:scale-[0.97] transition-all duration-[120ms] shrink-0"
    style={{
      width: 46, height: 26, borderRadius: 9999,
      background: value ? THEME.coral : '#D5CEC7',
      position: 'relative', cursor: 'pointer',
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

const SectionLabel = ({ children, right }) => (
  <div className="flex items-center justify-between mb-1.5 ml-3 mr-1 mt-5">
    <div className="text-[10.5px] font-semibold text-[#8E8E93] tracking-[0.1em] uppercase">{children}</div>
    {right}
  </div>
);

/* ────────── Card brand tile ────────── */
const CardBrandTile = ({ brand }) => {
  if (brand === 'Visa') {
    return (
      <div className="w-[32px] h-[22px] rounded-[5px] bg-[#1A1F71] flex items-center justify-center shrink-0">
        <span className="text-[8.5px] font-extrabold text-white tracking-wide italic">VISA</span>
      </div>
    );
  }
  if (brand === 'Mastercard') {
    return (
      <div className="w-[32px] h-[22px] rounded-[5px] bg-[#111] flex items-center justify-center relative overflow-hidden shrink-0">
        <div className="absolute left-[4px] w-[11px] h-[11px] rounded-full bg-[#EB001B] opacity-90" />
        <div className="absolute right-[4px] w-[11px] h-[11px] rounded-full bg-[#F79E1B] opacity-90" />
      </div>
    );
  }
  return (
    <div className="w-[32px] h-[22px] rounded-[5px] bg-[#111] flex items-center justify-center shrink-0">
      <span className="text-[8px] font-bold text-white"></span>
    </div>
  );
};

/* ────────── Generic Row ────────── */
const Row = ({ icon: Icon, iconTint, iconColor, title, subtitle, right, onClick, last }) => (
  <div className="relative">
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3.5 py-[11px] active:bg-black/[0.02] transition-colors text-left"
    >
      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center" style={{ backgroundColor: iconTint || THEME.tint }}>
        <Icon size={15} color={iconColor || THEME.coral} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold truncate leading-tight" style={{ color: THEME.txt }}>{title}</div>
        {subtitle && <div className="text-[11.5px] truncate mt-[2px]" style={{ color: THEME.muted }}>{subtitle}</div>}
      </div>
      {right}
    </button>
    {!last && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: THEME.divider }} />}
  </div>
);

const PaymentWalletScreen = () => {
  const [biometricPay, setBiometricPay] = useState(true);

  const back = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center font-sans antialiased" style={{ padding: 20 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .w-scroll::-webkit-scrollbar { display: none; }
        .w-scroll { scrollbar-width: none; }
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

        <div className="w-scroll absolute inset-0 overflow-y-auto pb-10" style={{ scrollbarWidth: 'none' }}>
          <AppHeader title="Wallet" onBack={back} />

          <div className="px-4 flex flex-col gap-3">

            {/* Credit balance card */}
            <div
              className="rounded-[20px] p-5 relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)' }}
            >
              <div className="absolute -top-[30px] -right-[30px] w-[120px] h-[120px] rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <div className="absolute -bottom-[20px] right-[40px] w-[80px] h-[80px] rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />

              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-2">
                  <Gift size={13} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'rgba(255,255,255,0.85)' }}>
                    Credit balance
                  </span>
                </div>
                <div className="text-[34px] font-extrabold text-white tracking-tight leading-none mb-3" style={{ letterSpacing: '-0.5px' }}>
                  CHF {CREDIT_TOTAL}.00
                </div>
                <div className="flex items-center gap-2 text-[12.5px]" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  {CREDIT_BREAKDOWN.map((b, i) => (
                    <React.Fragment key={b.id}>
                      <span>CHF {b.amount} {b.label.toLowerCase()}</span>
                      {i < CREDIT_BREAKDOWN.length - 1 && <span style={{ color: 'rgba(255,255,255,0.4)' }}>·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>

            {/* Credit how-it-works banner */}
            <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-[12px] -mt-1" style={{ backgroundColor: '#FBE7DD' }}>
              <Info size={13} color={THEME.coral} strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#8B4016' }}>
                Credit is applied automatically at checkout before your card is charged.
              </span>
            </div>

            {/* Quick actions — 3-up */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { Icon: Users,    label: 'Invite',   sub: 'Earn CHF 10' },
                { Icon: Ticket,   label: 'Redeem',   sub: 'Promo code' },
                { Icon: Download, label: 'Statement', sub: 'PDF' },
              ].map((a) => (
                <button
                  key={a.label}
                  className="bg-white rounded-[14px] border border-black/[0.04] py-3 px-2 flex flex-col items-center gap-1.5 active:scale-[0.98] transition-all"
                >
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: THEME.tint }}>
                    <a.Icon size={17} color={THEME.coral} strokeWidth={2} />
                  </div>
                  <span className="text-[12px] font-semibold leading-tight" style={{ color: THEME.txt }}>{a.label}</span>
                  <span className="text-[10px] leading-tight" style={{ color: THEME.muted }}>{a.sub}</span>
                </button>
              ))}
            </div>

            {/* Upcoming charges */}
            <SectionLabel right={<span className="text-[11px] font-semibold" style={{ color: THEME.coral }}>See all</span>}>
              Upcoming
            </SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              {UPCOMING.map((u, i) => (
                <div key={u.id} className="relative">
                  <div className="flex items-center gap-3 px-3.5 py-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(88,86,214,0.12)' }}>
                      <CalendarClock size={15} color="#5856D6" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold truncate leading-tight" style={{ color: THEME.txt }}>{u.title}</div>
                      <div className="text-[11.5px] truncate mt-[2px]" style={{ color: THEME.muted }}>
                        {u.subtitle} · {u.pet} · {u.date}
                      </div>
                    </div>
                    <span className="text-[13.5px] font-semibold shrink-0" style={{ color: THEME.txt, fontVariantNumeric: 'tabular-nums' }}>
                      CHF {u.amount}
                    </span>
                  </div>
                  {i < UPCOMING.length - 1 && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: THEME.divider }} />}
                </div>
              ))}
            </div>

            {/* Spending this month */}
            <SectionLabel right={<span className="text-[11px] font-medium" style={{ color: THEME.muted }}>This month</span>}>
              Spending
            </SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] p-4">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-[11px] font-medium" style={{ color: THEME.muted }}>Total</div>
                  <div className="text-[22px] font-bold tracking-tight leading-none mt-1" style={{ color: THEME.txt }}>CHF {SPENDING_TOTAL}</div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,59,48,0.08)' }}>
                  <TrendingUp size={11} color="#FF3B30" strokeWidth={2.5} />
                  <span className="text-[11px] font-semibold" style={{ color: '#FF3B30' }}>+12%</span>
                </div>
              </div>
              {/* Stacked bar */}
              <div className="flex h-2 rounded-full overflow-hidden mb-3" style={{ backgroundColor: '#F1EDE8' }}>
                {SPENDING_CATEGORIES.map((c) => (
                  <div key={c.label} style={{ width: `${(c.amount / SPENDING_TOTAL) * 100}%`, backgroundColor: c.color }} />
                ))}
              </div>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
                {SPENDING_CATEGORIES.map((c) => (
                  <div key={c.label} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                    <span className="text-[12px]" style={{ color: THEME.mutedDark }}>{c.label}</span>
                    <span className="ml-auto text-[12px] font-semibold" style={{ color: THEME.txt }}>CHF {c.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Spending per pet */}
            <SectionLabel>By pet</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] p-3 flex gap-2">
              {SPENDING_BY_PET.map((p) => {
                const maxAmount = Math.max(...SPENDING_BY_PET.map((x) => x.amount));
                const pct = Math.round((p.amount / maxAmount) * 100);
                return (
                  <div key={p.id} className="flex-1 flex flex-col items-center gap-2 py-1">
                    <div className="w-[44px] h-[44px] rounded-full overflow-hidden" style={{ border: '1.5px solid rgba(0,0,0,0.04)' }}>
                      <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-[11.5px] font-semibold" style={{ color: THEME.txt }}>{p.name}</div>
                    <div className="text-[12.5px] font-bold" style={{ color: THEME.txt, fontVariantNumeric: 'tabular-nums' }}>CHF {p.amount}</div>
                    <div className="w-full h-[3px] rounded-full" style={{ backgroundColor: '#F1EDE8' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: THEME.coral }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment methods */}
            <SectionLabel>Payment methods</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              {PAYMENT_METHODS.map((m, i) => (
                <div key={m.id} className="relative">
                  <div className="flex items-center gap-3 px-3.5 py-3 cursor-pointer active:bg-black/[0.02] transition-colors">
                    <CardBrandTile brand={m.label} />
                    <div className="flex-1 min-w-0 flex items-center gap-2">
                      <span className="text-[14px] font-semibold" style={{ color: THEME.txt }}>
                        {m.label}
                        {m.last4 && <span className="font-normal" style={{ color: THEME.muted }}>{' '}{m.last4}</span>}
                      </span>
                      {m.isDefault && (
                        <span className="text-[10px] font-bold tracking-wide px-1.5 py-[1px] rounded" style={{ color: THEME.coral, border: '1px solid rgba(232,93,42,0.35)' }}>
                          DEFAULT
                        </span>
                      )}
                    </div>
                    <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                  </div>
                  {i < PAYMENT_METHODS.length - 1 && <div className="absolute bottom-0 left-[56px] right-0 h-px" style={{ background: THEME.divider }} />}
                </div>
              ))}
              <div className="h-px" style={{ background: THEME.divider, marginLeft: 56 }} />
              <button className="w-full flex items-center gap-3 px-3.5 py-3 cursor-pointer active:bg-black/[0.02] transition-colors">
                <div className="w-[32px] h-[22px] rounded-[5px] flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                  <Plus size={13} color={THEME.coral} strokeWidth={2.5} />
                </div>
                <span className="flex-1 text-[14px] font-semibold text-left" style={{ color: THEME.coral }}>Add payment method</span>
                <ChevronRight size={14} color={THEME.coral} strokeWidth={2.2} />
              </button>
            </div>

            {/* Transaction history */}
            <SectionLabel right={<span className="text-[11px] font-medium" style={{ color: THEME.muted }}>This month</span>}>
              Transactions
            </SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              {TRANSACTIONS.map((tx, i) => {
                const pos = tx.amount > 0;
                return (
                  <div key={tx.id} className="relative">
                    <div className="flex items-center gap-3 px-3.5 py-3 cursor-pointer active:bg-black/[0.02] transition-colors">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: tx.isCredit ? 'rgba(232,93,42,0.12)' : (pos ? 'rgba(52,199,89,0.12)' : '#F1EDE8') }}
                      >
                        {tx.isCredit
                          ? <Gift size={14} color={THEME.coral} strokeWidth={2.4} />
                          : pos
                            ? <ArrowDownLeft size={14} color="#2EA849" strokeWidth={2.4} />
                            : <ArrowUpRight  size={14} color={THEME.mutedDark} strokeWidth={2.4} />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-semibold truncate leading-tight" style={{ color: THEME.txt }}>
                          {tx.title}
                        </div>
                        <div className="text-[11.5px] truncate mt-[2px]" style={{ color: THEME.muted }}>
                          {tx.subtitle ? `${tx.subtitle} · ${tx.date}` : tx.date}
                          {tx.source && <span> · {tx.source}</span>}
                        </div>
                      </div>
                      <span className="text-[13.5px] font-semibold shrink-0" style={{ color: pos ? (tx.isCredit ? THEME.coral : '#2EA849') : THEME.txt, fontVariantNumeric: 'tabular-nums' }}>
                        {formatAmount(tx.amount)}
                      </span>
                    </div>
                    {i < TRANSACTIONS.length - 1 && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: THEME.divider }} />}
                  </div>
                );
              })}
            </div>

            {/* Wallet settings */}
            <SectionLabel>Wallet settings</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <Row
                icon={Fingerprint}
                title="Require Face ID"
                subtitle="For payments over CHF 50"
                right={<Toggle value={biometricPay} onChange={setBiometricPay} />}
              />
              <Row
                icon={Download}
                title="Export statement"
                subtitle="Download monthly PDF"
                right={<ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />}
                last
              />
            </div>

            <div className="text-center mt-4 mb-2">
              <p className="text-[10.5px]" style={{ color: '#B8B0A8' }}>
                All transactions are encrypted and processed by Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentWalletScreen;
