import React, { useState } from 'react';
import {
  ChevronLeft,
  Check,
  X,
  Star,
  Heart,
  PawPrint,
  ChevronRight,
  ArrowRight,
  Shield,
  Zap,
  Award,
} from 'lucide-react';

/**
 * 49_SUBSCRIPTION_v1.jsx
 * Subscription plans screen for the Fylos pet care app.
 * Warm minimal design system.
 */

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
    ],
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
    ],
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
    ],
  },
];

const COMPARISON_FEATURES = [
  { label: 'Pet profiles', free: '1', premium: 'Up to 3', family: 'Unlimited' },
  { label: 'Health records', free: 'Basic', premium: 'Full', family: 'Full' },
  { label: 'GPS tracking', free: false, premium: true, family: true },
  { label: 'Smart reminders', free: false, premium: true, family: true },
  { label: 'Advanced insights', free: false, premium: true, family: true },
  { label: 'Family sharing', free: false, premium: false, family: true },
  { label: 'Priority support', free: false, premium: true, family: true },
  { label: 'Dedicated vet line', free: false, premium: false, family: true },
];

const ComparisonCell = ({ value }) => {
  if (value === true) {
    return (
      <div
        style={{
          width: 20, height: 20, borderRadius: 9999,
          background: 'rgba(74,155,110,0.10)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Check size={11} color="#4A9B6E" strokeWidth={3} />
      </div>
    );
  }
  if (value === false) {
    return (
      <div
        style={{
          width: 20, height: 20, borderRadius: 9999,
          background: 'rgba(160,154,148,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <X size={11} color="#A09A94" strokeWidth={3} />
      </div>
    );
  }
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: '#111' }}>{value}</span>
  );
};

const SubscriptionScreen = () => {
  const [showComparison, setShowComparison] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('free');

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#E5E5E5',
        padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .sub-scroll::-webkit-scrollbar { display: none; }
        .sub-scroll { scrollbar-width: none; }
        @keyframes subFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sub-fade-up { animation: subFadeUp 200ms ease forwards; }
      `}</style>

      {/* iPhone Frame */}
      <div
        className="relative"
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F7F5F2',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[100]"
          style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }}
        />

        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
          style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }}
        />

        {/* Status bar */}
        <div
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
          style={{ height: 54 }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Floating Header */}
        <header
          className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent"
          style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}
        >
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button
              onClick={() => window.history.back()}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
            >
              <ChevronLeft size={22} color="#111" />
            </button>
            <h2 className="text-[17px] font-semibold text-[#111]">Subscription</h2>
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Scroll Content */}
        <div className="absolute inset-0 overflow-y-auto pt-[110px] pb-[140px] px-5 sub-scroll">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Section Label */}
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#A09A94',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                paddingLeft: 4,
              }}
            >
              Choose your plan
            </span>

            {/* Plan Cards */}
            {PLANS.map((plan) => {
              const PlanIcon = plan.Icon;
              const isRecommended = plan.isPopular;
              const isSelected = selectedPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className="active:scale-[0.97] transition-all duration-[120ms]"
                  style={{
                    background: '#F3EFEB',
                    borderRadius: 20,
                    padding: 20,
                    border: isSelected
                      ? '2px solid #E85D2A'
                      : '1px solid #EDE8E2',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                >
                  {/* Most Popular badge */}
                  {isRecommended && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 14,
                        right: 14,
                        padding: '4px 10px',
                        borderRadius: 9999,
                        background: '#E85D2A',
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#FFFFFF',
                          letterSpacing: '0.06em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan header row */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 6,
                      paddingRight: isRecommended ? 100 : 0,
                    }}
                  >
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: 9999,
                        background: isSelected ? '#E85D2A' : '#EDE8E2',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        transition: 'background 200ms ease',
                      }}
                    >
                      <PlanIcon
                        size={17}
                        color={isSelected ? '#FFFFFF' : '#6E6058'}
                        strokeWidth={2.2}
                      />
                    </div>
                    <span style={{ fontSize: 17, fontWeight: 700, color: '#111' }}>
                      {plan.name}
                    </span>
                  </div>

                  {/* Current plan badge */}
                  {plan.isCurrent && (
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '3px 10px',
                        borderRadius: 9999,
                        background: 'rgba(74,155,110,0.08)',
                        border: '1px solid rgba(74,155,110,0.15)',
                        marginBottom: 10,
                      }}
                    >
                      <Check size={10} color="#4A9B6E" strokeWidth={3} />
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: '#4A9B6E',
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                        }}
                      >
                        Current Plan
                      </span>
                    </div>
                  )}

                  {/* Price */}
                  <div style={{ marginBottom: 14, marginTop: plan.isCurrent ? 0 : 4 }}>
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color: isSelected ? '#E85D2A' : '#111',
                        letterSpacing: '-0.5px',
                      }}
                    >
                      {plan.price}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: '#A09A94',
                        fontWeight: 500,
                        marginLeft: 3,
                      }}
                    >
                      {plan.period}
                    </span>
                  </div>

                  {/* Dotted divider */}
                  <div className="border-t border-dashed border-[#CFCFD4]" style={{ marginBottom: 14 }} />

                  {/* Feature checklist */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                    }}
                  >
                    {plan.features.map((feature) => (
                      <div
                        key={feature.label}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                        }}
                      >
                        <div
                          style={{
                            width: 20, height: 20, borderRadius: 9999,
                            background: feature.included
                              ? isSelected
                                ? 'rgba(232,93,42,0.10)'
                                : 'rgba(74,155,110,0.10)'
                              : 'rgba(160,154,148,0.08)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}
                        >
                          {feature.included ? (
                            <Check
                              size={11}
                              color={isSelected ? '#E85D2A' : '#4A9B6E'}
                              strokeWidth={2.8}
                            />
                          ) : (
                            <X size={11} color="#A09A94" strokeWidth={2.8} />
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: feature.included ? '#6E6058' : '#A09A94',
                            opacity: feature.included ? 1 : 0.6,
                          }}
                        >
                          {feature.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Dotted perforation divider */}
            <div className="border-t border-dashed border-[#CFCFD4]" style={{ marginTop: 4 }} />

            {/* Feature Comparison Toggle */}
            <div
              onClick={() => setShowComparison(!showComparison)}
              className="active:scale-[0.97] transition-all duration-[120ms]"
              style={{
                background: '#F3EFEB',
                borderRadius: 20,
                padding: 20,
                border: '1px solid #EDE8E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{ width: 34, height: 34, borderRadius: 9999, background: '#EDE8E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Shield size={16} color="#E85D2A" strokeWidth={2} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>
                  Compare all features
                </span>
              </div>
              <ChevronRight
                size={16}
                color="#A09A94"
                strokeWidth={2}
                style={{
                  transform: showComparison ? 'rotate(90deg)' : 'rotate(0deg)',
                  transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              />
            </div>

            {/* Feature Comparison Table */}
            {showComparison && (
              <div
                className="sub-fade-up"
                style={{
                  background: '#F3EFEB',
                  borderRadius: 20,
                  border: '1px solid #EDE8E2',
                  overflow: 'hidden',
                  marginTop: -4,
                }}
              >
                {/* Table header */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 56px 56px 56px',
                    alignItems: 'center',
                    padding: '14px 20px 12px',
                    borderBottom: '1px dashed #CFCFD4',
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#A09A94',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Feature
                  </span>
                  {['Free', 'Pro', 'Family'].map((label) => (
                    <span
                      key={label}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: label === 'Pro' ? '#E85D2A' : '#A09A94',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        textAlign: 'center',
                      }}
                    >
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
                      padding: '10px 20px',
                      borderBottom:
                        idx < COMPARISON_FEATURES.length - 1
                          ? '1px solid #EDE8E2'
                          : 'none',
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#6E6058' }}>
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
            )}

            {/* Bottom Links */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                paddingTop: 4,
              }}
            >
              <button
                className="active:scale-[0.97] transition-all duration-[120ms]"
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 500,
                  color: '#A09A94',
                  cursor: 'pointer',
                  padding: '6px 0',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Restore Purchases
              </button>
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#A09A94',
                  cursor: 'pointer',
                  padding: 0,
                  opacity: 0.7,
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                Terms of Service &amp; Privacy Policy
              </button>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="absolute bottom-6 left-5 right-5 z-30">
          <button
            className="active:scale-[0.97] transition-all duration-[120ms]"
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 14,
              background: selectedPlan === 'free' ? '#F3EFEB' : '#111',
              border: 'none',
              color: selectedPlan === 'free' ? '#6E6058' : '#FFFFFF',
              fontSize: 16,
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: selectedPlan === 'free' ? 'none' : '0 4px 20px rgba(0,0,0,0.12)',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            {selectedPlan === 'free' ? 'Current Plan' : `Get ${PLANS.find(p => p.id === selectedPlan)?.name}`}
            {selectedPlan !== 'free' && <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;
