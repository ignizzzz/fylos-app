import React, { useState } from 'react';
import {
  ChevronLeft,
  Check,
  X,
  Star,
  Shield,
  Heart,
  PawPrint,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

/**
 * 49_SUBSCRIPTION_v1.jsx
 * Subscription plans screen for the Fylos pet care app.
 * Three tiers: Free, Premium, Family with feature comparison.
 */

// ─── FYLOS LOGO ───────────────────────────────────────────────────────────────
const FylosLogo = ({
  textColor = '#000000',
  dotColor = '#E85D2A',
  fontSize = '2rem',
  className = ''
}) => (
  <div
    className={className}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `calc(${fontSize} * 0.15)`,
      fontFamily: '"Nunito", sans-serif'
    }}
  >
    <span style={{ fontSize, fontWeight: 800, color: textColor, letterSpacing: '-0.5px', lineHeight: 1 }}>
      FYLOS
    </span>
    <div style={{
      width: `calc(${fontSize} * 0.25)`,
      height: `calc(${fontSize} * 0.25)`,
      borderRadius: '50%',
      backgroundColor: dotColor
    }} />
  </div>
);

// ─── THEME ────────────────────────────────────────────────────────────────────
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
    success: '#00C060',
    divider: '#E5E5E5'
  },
  radius: {
    full: '9999px',
    large: '24px',
    medium: '16px',
    small: '8px'
  },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)'
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');

    .sub-font-brand { font-family: 'Nunito', sans-serif; }
    .sub-font-body  { font-family: 'Inter', sans-serif; }

    .sub-scroll::-webkit-scrollbar { display: none; }
    .sub-scroll { -ms-overflow-style: none; scrollbar-width: none; }

    .sub-btn {
      transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease;
      cursor: pointer;
      border: none;
      background: none;
      padding: 0;
    }
    .sub-btn:active { transform: scale(0.88); }

    .sub-plan-card {
      transition: transform ${THEME.motion.tap} ${THEME.motion.spring}, box-shadow ${THEME.motion.tap} ease;
      cursor: pointer;
    }
    .sub-plan-card:active { transform: scale(0.98); }

    .sub-cta-btn {
      transition: transform ${THEME.motion.tap} ease, box-shadow ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease;
      cursor: pointer;
      border: none;
    }
    .sub-cta-btn:active { transform: scale(0.97); opacity: 0.9; }

    @keyframes sub-fade-up {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .sub-fade-up { animation: sub-fade-up ${THEME.motion.fade} ease forwards; }

    .sub-feature-item {
      opacity: 0;
      animation: sub-fade-up 240ms ease forwards;
    }

    .sub-link {
      cursor: pointer;
      transition: opacity ${THEME.motion.tap} ease;
    }
    .sub-link:active { opacity: 0.6; }
  `}</style>
);

// ─── PLAN DATA ────────────────────────────────────────────────────────────────
const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 'CHF 0',
    period: '/month',
    Icon: PawPrint,
    isCurrent: true,
    isPopular: false,
    features: [
      { label: '1 pet profile', included: true },
      { label: 'Basic health records', included: true },
      { label: 'Community access', included: true },
      { label: 'Vaccination reminders', included: true },
      { label: 'GPS tracking', included: false },
      { label: 'Priority support', included: false },
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'CHF 9.90',
    period: '/month',
    Icon: Star,
    isCurrent: false,
    isPopular: true,
    features: [
      { label: 'Up to 3 pet profiles', included: true },
      { label: 'Full health records', included: true },
      { label: 'Community + priority support', included: true },
      { label: 'Smart health reminders', included: true },
      { label: 'Live GPS tracking', included: true },
      { label: 'Advanced insights', included: true },
    ]
  },
  {
    id: 'family',
    name: 'Family',
    price: 'CHF 14.90',
    period: '/month',
    Icon: Heart,
    isCurrent: false,
    isPopular: false,
    features: [
      { label: 'Unlimited pet profiles', included: true },
      { label: 'Full health records', included: true },
      { label: 'Everything in Premium', included: true },
      { label: 'Family sharing (up to 5)', included: true },
      { label: 'Live GPS tracking', included: true },
      { label: 'Dedicated vet support', included: true },
    ]
  }
];

// ─── COMPARISON DATA ──────────────────────────────────────────────────────────
const COMPARISON_FEATURES = [
  { label: 'Pet profiles',        free: '1',     premium: 'Up to 3', family: 'Unlimited' },
  { label: 'Health records',      free: 'Basic', premium: 'Full',    family: 'Full' },
  { label: 'GPS tracking',        free: false,   premium: true,      family: true },
  { label: 'Smart reminders',     free: false,   premium: true,      family: true },
  { label: 'Advanced insights',   free: false,   premium: true,      family: true },
  { label: 'Family sharing',      free: false,   premium: false,     family: true },
  { label: 'Priority support',    free: false,   premium: true,      family: true },
  { label: 'Dedicated vet line',  free: false,   premium: false,     family: true },
];

// ─── PLAN CARD COMPONENT ─────────────────────────────────────────────────────
const PlanCard = ({ plan, index }) => {
  const PlanIcon = plan.Icon;
  const isRecommended = plan.isPopular;

  return (
    <div
      className="sub-plan-card sub-fade-up"
      style={{
        background: THEME.colors.surface,
        borderRadius: 20,
        border: isRecommended
          ? `2.5px solid ${THEME.colors.accent}`
          : `1.5px solid ${THEME.colors.divider}`,
        padding: 20,
        boxShadow: THEME.shadows.soft,
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${index * 60}ms`
      }}
    >
      {/* Most Popular badge */}
      {isRecommended && (
        <div style={{
          position: 'absolute',
          top: 14,
          right: 14,
          padding: '4px 10px',
          borderRadius: THEME.radius.full,
          background: THEME.colors.accent,
        }}>
          <span className="sub-font-body" style={{
            fontSize: '0.60rem',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            Most Popular
          </span>
        </div>
      )}

      {/* Plan header row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 6,
        paddingRight: isRecommended ? 90 : 0
      }}>
        <div style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: isRecommended
            ? `linear-gradient(135deg, #FF7240, ${THEME.colors.accent})`
            : THEME.colors.surfaceAlt,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <PlanIcon
            size={17}
            color={isRecommended ? '#FFFFFF' : THEME.colors.secondaryText}
            strokeWidth={2.2}
          />
        </div>
        <div>
          <span className="sub-font-brand" style={{
            fontSize: '1.05rem',
            fontWeight: 800,
            color: THEME.colors.primaryText,
            letterSpacing: '-0.3px'
          }}>
            {plan.name}
          </span>
        </div>
      </div>

      {/* Current plan badge */}
      {plan.isCurrent && (
        <div style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: THEME.radius.full,
          background: `${THEME.colors.success}15`,
          border: `1.5px solid ${THEME.colors.success}30`,
          marginBottom: 10
        }}>
          <span className="sub-font-body" style={{
            fontSize: '0.65rem',
            fontWeight: 700,
            color: THEME.colors.success,
            letterSpacing: '0.05em',
            textTransform: 'uppercase'
          }}>
            Current Plan
          </span>
        </div>
      )}

      {/* Price */}
      <div style={{ marginBottom: 14, marginTop: plan.isCurrent ? 0 : 4 }}>
        <span className="sub-font-brand" style={{
          fontSize: '1.55rem',
          fontWeight: 900,
          color: isRecommended ? THEME.colors.accent : THEME.colors.primaryText,
          letterSpacing: '-0.5px'
        }}>
          {plan.price}
        </span>
        <span className="sub-font-body" style={{
          fontSize: '0.78rem',
          color: THEME.colors.tertiaryText,
          fontWeight: 500,
          marginLeft: 3
        }}>
          {plan.period}
        </span>
      </div>

      {/* Feature checklist */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: plan.isCurrent ? 0 : 16 }}>
        {plan.features.map((feature, idx) => (
          <div
            key={feature.label}
            className="sub-feature-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animationDelay: `${index * 60 + idx * 30 + 100}ms`
            }}
          >
            <div style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: feature.included
                ? (isRecommended ? `${THEME.colors.accent}15` : `${THEME.colors.success}15`)
                : `${THEME.colors.tertiaryText}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {feature.included ? (
                <Check
                  size={11}
                  color={isRecommended ? THEME.colors.accent : THEME.colors.success}
                  strokeWidth={2.8}
                />
              ) : (
                <X size={11} color={THEME.colors.tertiaryText} strokeWidth={2.8} />
              )}
            </div>
            <span className="sub-font-body" style={{
              fontSize: '0.78rem',
              fontWeight: 500,
              color: feature.included ? THEME.colors.secondaryText : THEME.colors.tertiaryText,
              opacity: feature.included ? 1 : 0.6
            }}>
              {feature.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      {!plan.isCurrent && (
        <button
          className="sub-cta-btn"
          style={{
            width: '100%',
            padding: '13px 0',
            borderRadius: THEME.radius.medium,
            background: isRecommended
              ? 'linear-gradient(135deg, #FF7240, #E85D2A)'
              : THEME.colors.surfaceAlt,
            boxShadow: isRecommended ? `0 8px 24px ${THEME.colors.accent}35` : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}
        >
          <span className="sub-font-brand" style={{
            fontSize: '0.95rem',
            fontWeight: 800,
            color: isRecommended ? '#FFFFFF' : THEME.colors.primaryText,
            letterSpacing: '-0.2px'
          }}>
            {isRecommended ? 'Get Premium' : `Choose ${plan.name}`}
          </span>
          <ArrowRight
            size={15}
            color={isRecommended ? '#FFFFFF' : THEME.colors.primaryText}
            strokeWidth={2.5}
          />
        </button>
      )}
    </div>
  );
};

// ─── COMPARISON CELL ──────────────────────────────────────────────────────────
const ComparisonCell = ({ value }) => {
  if (value === true) {
    return (
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        background: `${THEME.colors.success}15`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Check size={10} color={THEME.colors.success} strokeWidth={3} />
      </div>
    );
  }
  if (value === false) {
    return (
      <div style={{
        width: 18, height: 18, borderRadius: '50%',
        background: `${THEME.colors.tertiaryText}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <X size={10} color={THEME.colors.tertiaryText} strokeWidth={3} />
      </div>
    );
  }
  return (
    <span className="sub-font-body" style={{
      fontSize: '0.68rem',
      fontWeight: 600,
      color: THEME.colors.primaryText
    }}>
      {value}
    </span>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
const SubscriptionScreen = () => {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E5E5E5',
      padding: '20px',
      fontFamily: '"Inter", sans-serif'
    }}>
      <GlobalStyles />

      {/* ── iPhone Frame ── */}
      <div className="relative" style={{
        width: 390,
        height: 844,
        borderRadius: 50,
        border: '8px solid #000',
        overflow: 'hidden',
        backgroundColor: '#F9F9FB',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      }}>

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
            <button
              onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <ChevronLeft size={22} color="#111111" />
            </button>
            <h2 className="text-[17px] font-semibold text-[#111111]">Subscription</h2>
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="absolute inset-0 overflow-y-auto sub-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>

          {/* ── PLAN CARDS ── */}
          <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PLANS.map((plan, idx) => (
              <PlanCard key={plan.id} plan={plan} index={idx} />
            ))}
          </div>

          {/* ── FEATURE COMPARISON TOGGLE ── */}
          <div style={{ padding: '0 16px 12px' }}>
            <button
              className="sub-btn"
              onClick={() => setShowComparison(!showComparison)}
              style={{
                width: '100%',
                background: THEME.colors.surface,
                borderRadius: 20,
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: THEME.shadows.soft
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Shield size={16} color={THEME.colors.accent} strokeWidth={2} />
                <span className="sub-font-body" style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: THEME.colors.primaryText
                }}>
                  Compare all features
                </span>
              </div>
              <ChevronRight
                size={16}
                color={THEME.colors.tertiaryText}
                strokeWidth={2}
                style={{
                  transform: showComparison ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: `transform ${THEME.motion.fade} ${THEME.motion.spring}`
                }}
              />
            </button>
          </div>

          {/* ── FEATURE COMPARISON TABLE ── */}
          {showComparison && (
            <div className="sub-fade-up" style={{ padding: '0 16px 16px' }}>
              <div style={{
                background: THEME.colors.surface,
                borderRadius: 20,
                boxShadow: THEME.shadows.soft,
                overflow: 'hidden'
              }}>
                {/* Table header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 56px 56px 56px',
                  alignItems: 'center',
                  padding: '12px 16px 10px',
                  borderBottom: `1px solid ${THEME.colors.divider}`
                }}>
                  <span className="sub-font-body" style={{
                    fontSize: '0.70rem',
                    fontWeight: 700,
                    color: THEME.colors.tertiaryText,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em'
                  }}>
                    Feature
                  </span>
                  {['Free', 'Pro', 'Family'].map(label => (
                    <span key={label} className="sub-font-body" style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: label === 'Pro' ? THEME.colors.accent : THEME.colors.tertiaryText,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      textAlign: 'center'
                    }}>
                      {label}
                    </span>
                  ))}
                </div>

                {/* Table rows */}
                {COMPARISON_FEATURES.map((row, idx) => (
                  <div
                    key={row.label}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 56px 56px 56px',
                      alignItems: 'center',
                      padding: '10px 16px',
                      borderBottom: idx < COMPARISON_FEATURES.length - 1
                        ? `1px solid ${THEME.colors.divider}`
                        : 'none'
                    }}
                  >
                    <span className="sub-font-body" style={{
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      color: THEME.colors.secondaryText
                    }}>
                      {row.label}
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <ComparisonCell value={row.free} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <ComparisonCell value={row.premium} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <ComparisonCell value={row.family} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BOTTOM LINKS ── */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 10,
            padding: '8px 24px 48px'
          }}>
            {/* Restore Purchases */}
            <button className="sub-link sub-font-body" style={{
              background: 'none',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 500,
              color: THEME.colors.tertiaryText,
              cursor: 'pointer',
              padding: '6px 0'
            }}>
              Restore Purchases
            </button>

            {/* Terms link */}
            <button className="sub-link sub-font-body" style={{
              background: 'none',
              border: 'none',
              fontSize: '0.70rem',
              fontWeight: 500,
              color: THEME.colors.tertiaryText,
              cursor: 'pointer',
              padding: 0,
              opacity: 0.7
            }}>
              Terms of Service &amp; Privacy Policy
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;
