import React, { useState } from 'react';
import {
  ChevronLeft, Check, PawPrint, Sparkles, Shield,
  MapPin, HeartPulse, Users, Cloud, Stethoscope,
  BarChart2, LifeBuoy, Gift,
} from 'lucide-react';

/**
 * 49_SUBSCRIPTION_v1.jsx — 2-tier plan: Free + Plus.
 * Monthly / annual billing toggle, compact feature lists.
 */

const THEME = {
  bg: '#F7F5F2', card: '#FFFFFF', divider: '#F1EDE8',
  coral: '#E85D2A', txt: '#111111', muted: '#9B9B9F',
  mutedDark: '#6E6E73', tint: '#FBE7DD', success: '#00C060',
};

const PRICING = {
  plus: {
    monthly: { amount: 7.90, period: '/month', total: null },
    annual:  { amount: 69,   period: '/year',  perMonth: 5.75, savePct: 27 },
  },
};

const FREE_FEATURES = [
  { Icon: PawPrint,   label: '1 pet profile' },
  { Icon: HeartPulse, label: 'Basic health records & vaccination reminders' },
  { Icon: Shield,     label: 'Emergency SOS (always free)' },
  { Icon: Users,      label: 'Community safety reports' },
  { Icon: LifeBuoy,   label: 'Standard support (48h)' },
];

const PLUS_FEATURES = [
  { Icon: PawPrint,   label: 'Up to 6 pet profiles + family co-owners' },
  { Icon: HeartPulse, label: 'Full health records + vet sharing' },
  { Icon: MapPin,     label: 'Live GPS tracking during walks' },
  { Icon: Sparkles,   label: 'Playdate matching & smart reminders' },
  { Icon: Cloud,      label: 'Unlimited photo vault & PDF export' },
  { Icon: Stethoscope,label: 'Telehealth consultations (2 / month)' },
  { Icon: BarChart2,  label: 'Analytics & insurance integration' },
  { Icon: Gift,       label: '10% off marketplace bookings' },
];

/* ────────── Header ────────── */
const AppHeader = ({ title, onBack }) => (
  <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none">
    <button
      onClick={onBack}
      className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
    >
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: THEME.txt }}>Subscription</h1>
  </div>
);

/* ────────── Feature row ────────── */
const FeatureRow = ({ Icon, label, active, last }) => (
  <div className="flex items-center gap-3 px-4 py-2.5">
    <div
      className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: active ? THEME.tint : '#F1EDE8' }}
    >
      {active
        ? <Icon size={14} color={THEME.coral} strokeWidth={2} />
        : <Icon size={14} color={THEME.muted} strokeWidth={2} />}
    </div>
    <span className="text-[13px] leading-snug" style={{ color: THEME.txt }}>{label}</span>
  </div>
);

const SubscriptionScreen = () => {
  const [period, setPeriod] = useState('monthly'); // 'monthly' | 'annual'
  const [selected, setSelected] = useState('plus');
  const plus = period === 'monthly' ? PRICING.plus.monthly : PRICING.plus.annual;

  const back = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .sub-scroll::-webkit-scrollbar { display: none; }
        .sub-scroll { scrollbar-width: none; }
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

        <div className="sub-scroll absolute inset-0 overflow-y-auto pb-[120px]" style={{ scrollbarWidth: 'none' }}>
          <AppHeader title="Subscription" onBack={back} />

          <div className="px-4">
            {/* Title */}
            <div className="text-center mt-1 mb-4 px-2">
              <h2 className="text-[22px] font-bold tracking-tight leading-tight mb-1" style={{ color: THEME.txt }}>
                Unlock the full Fylos
              </h2>
              <p className="text-[13px] leading-snug" style={{ color: THEME.mutedDark }}>
                Cancel anytime. Emergency SOS is always free.
              </p>
            </div>

            {/* Billing period toggle */}
            <div className="bg-white rounded-full border border-black/[0.04] p-1 flex mb-4 relative">
              <button
                onClick={() => setPeriod('monthly')}
                className="flex-1 py-2 rounded-full text-[13px] font-semibold transition-all"
                style={{
                  backgroundColor: period === 'monthly' ? THEME.coral : 'transparent',
                  color: period === 'monthly' ? '#FFFFFF' : THEME.txt,
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setPeriod('annual')}
                className="flex-1 py-2 rounded-full text-[13px] font-semibold transition-all relative"
                style={{
                  backgroundColor: period === 'annual' ? THEME.coral : 'transparent',
                  color: period === 'annual' ? '#FFFFFF' : THEME.txt,
                }}
              >
                Annual
                <span
                  className="ml-1 text-[9.5px] font-bold px-1.5 py-[1px] rounded-md align-middle"
                  style={{
                    color: period === 'annual' ? THEME.coral : '#FFFFFF',
                    backgroundColor: period === 'annual' ? '#FFFFFF' : THEME.success,
                  }}
                >
                  SAVE {PRICING.plus.annual.savePct}%
                </span>
              </button>
            </div>

            {/* PLUS — featured card */}
            <div
              onClick={() => setSelected('plus')}
              className="relative rounded-[20px] overflow-hidden cursor-pointer active:scale-[0.99] transition-all mb-3"
              style={{
                border: `1.5px solid ${selected === 'plus' ? THEME.coral : 'rgba(0,0,0,0.04)'}`,
                background: THEME.card,
              }}
            >
              {/* Coral ribbon */}
              <div className="absolute top-3 right-3">
                <span className="text-[9.5px] font-bold text-white px-2 py-[3px] rounded-[5px] tracking-[0.06em]" style={{ backgroundColor: THEME.coral }}>
                  RECOMMENDED
                </span>
              </div>

              <div className="p-4 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)' }}>
                    <Sparkles size={18} color="#FFFFFF" strokeWidth={2} />
                  </div>
                  <span className="text-[18px] font-bold" style={{ color: THEME.txt }}>Fylos Plus</span>
                </div>

                <div className="flex items-end gap-1 mb-0.5">
                  <span className="text-[30px] font-extrabold tracking-tight leading-none" style={{ color: THEME.coral, letterSpacing: '-0.5px' }}>
                    CHF {period === 'monthly' ? '7.90' : '69'}
                  </span>
                  <span className="text-[13px] font-medium mb-1" style={{ color: THEME.muted }}>{plus.period}</span>
                </div>
                {period === 'annual' && (
                  <p className="text-[11.5px] leading-snug" style={{ color: THEME.success }}>
                    Just CHF {PRICING.plus.annual.perMonth.toFixed(2)}/month — save CHF {Math.round((PRICING.plus.monthly.amount * 12) - PRICING.plus.annual.amount)} per year
                  </p>
                )}
                {period === 'monthly' && (
                  <p className="text-[11.5px] leading-snug" style={{ color: THEME.muted }}>
                    Switch to annual and save {PRICING.plus.annual.savePct}%
                  </p>
                )}
              </div>

              <div className="h-px" style={{ background: THEME.divider }} />
              <div className="py-1">
                {PLUS_FEATURES.map((f, i) => (
                  <FeatureRow key={i} Icon={f.Icon} label={f.label} active />
                ))}
              </div>
            </div>

            {/* FREE card */}
            <div
              onClick={() => setSelected('free')}
              className="relative rounded-[20px] overflow-hidden cursor-pointer active:scale-[0.99] transition-all"
              style={{
                border: `1.5px solid ${selected === 'free' ? THEME.coral : 'rgba(0,0,0,0.04)'}`,
                background: THEME.card,
              }}
            >
              <div className="p-4 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: THEME.tint }}>
                    <PawPrint size={18} color={THEME.coral} strokeWidth={2} />
                  </div>
                  <span className="text-[18px] font-bold" style={{ color: THEME.txt }}>Free</span>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md tracking-[0.06em]" style={{ color: THEME.success, backgroundColor: 'rgba(0,192,96,0.1)' }}>
                    <Check size={10} strokeWidth={3} /> CURRENT
                  </span>
                </div>

                <div className="flex items-end gap-1">
                  <span className="text-[24px] font-bold tracking-tight leading-none" style={{ color: THEME.txt }}>CHF 0</span>
                  <span className="text-[13px] font-medium mb-0.5" style={{ color: THEME.muted }}>/month</span>
                </div>
              </div>

              <div className="h-px" style={{ background: THEME.divider }} />
              <div className="py-1">
                {FREE_FEATURES.map((f, i) => (
                  <FeatureRow key={i} Icon={f.Icon} label={f.label} active />
                ))}
              </div>
            </div>

            {/* Footer fine print */}
            <div className="mt-5 space-y-2 text-center px-2">
              <p className="text-[11px] leading-snug" style={{ color: THEME.mutedDark }}>
                Subscription auto-renews. Cancel anytime in Settings &gt; Subscription.
              </p>
              <div className="flex justify-center items-center gap-4 text-[11px]" style={{ color: THEME.coral }}>
                <button className="font-semibold">Restore purchase</button>
                <span style={{ color: THEME.muted }}>·</span>
                <button className="font-semibold">Terms</button>
                <span style={{ color: THEME.muted }}>·</span>
                <button className="font-semibold">Privacy</button>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky bottom CTA */}
        <div
          className="absolute bottom-0 left-0 right-0 px-4 pt-3 pb-7"
          style={{
            background: 'linear-gradient(to top, rgba(247,245,242,1) 60%, rgba(247,245,242,0))',
          }}
        >
          <button
            className="w-full h-12 rounded-[14px] font-bold text-[15px] text-white active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            style={{
              background: selected === 'plus'
                ? 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)'
                : '#D5CEC7',
              boxShadow: selected === 'plus' ? '0 8px 20px rgba(232,93,42,0.25)' : 'none',
              cursor: selected === 'plus' ? 'pointer' : 'not-allowed',
            }}
            disabled={selected !== 'plus'}
          >
            {selected === 'plus'
              ? `Start with Plus · CHF ${period === 'monthly' ? '7.90/mo' : '69/yr'}`
              : "You're on Free"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;
