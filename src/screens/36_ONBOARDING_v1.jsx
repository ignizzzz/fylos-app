import React, { useState, useEffect, useRef } from 'react';
import {
  PawPrint,
  Heart,
  MapPin,
  Users,
  ArrowRight,
  Activity,
  Shield,
  Calendar,
  Star,
  Check,
  ChevronLeft
} from 'lucide-react';

/**
 * 36_ONBOARDING_v1.jsx
 * Premium 4-step onboarding for Fylos pet care app
 * Follows the Fylos Design System exactly
 */

// --- THEME ---
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
    divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)',
    active: '0 8px 30px rgba(0,0,0,0.06)'
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');

    .font-brand { font-family: 'Nunito', sans-serif; }
    .font-body { font-family: 'Inter', sans-serif; }

    @keyframes onb-fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes onb-slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes onb-scaleIn {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes onb-float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
    @keyframes onb-breathe {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.12); opacity: 0.25; }
    }
    @keyframes onb-slideInRight {
      from { transform: translateX(40px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes onb-slideInLeft {
      from { transform: translateX(-40px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .onb-fade { animation: onb-fadeIn 0.5s ease-out forwards; }
    .onb-slide { animation: onb-slideUp 0.5s ${THEME.motion.spring} forwards; }
    .onb-scale { animation: onb-scaleIn 0.4s ${THEME.motion.spring} forwards; }
    .onb-float { animation: onb-float 3s ease-in-out infinite; }
    .onb-slide-right { animation: onb-slideInRight 0.45s ${THEME.motion.spring} forwards; }
    .onb-slide-left { animation: onb-slideInLeft 0.45s ${THEME.motion.spring} forwards; }

    .onb-btn-primary:active { transform: scale(0.97); }
    .onb-btn-secondary:active { transform: scale(0.97); }
  `}</style>
);

// --- FYLOS LOGO ---
const FylosLogo = ({ fontSize = '2rem' }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `calc(${fontSize} * 0.15)`,
      fontFamily: '"Nunito", sans-serif'
    }}
  >
    <span style={{ fontSize, fontWeight: 800, color: THEME.colors.primaryText, letterSpacing: '-0.5px', lineHeight: 1 }}>
      FYLOS
    </span>
    <div style={{ width: `calc(${fontSize} * 0.25)`, height: `calc(${fontSize} * 0.25)`, borderRadius: '50%', backgroundColor: THEME.colors.accent }} />
  </div>
);

// --- ONBOARDING SLIDES DATA ---
const SLIDES = [
  {
    id: 'welcome',
    type: 'welcome'
  },
  {
    id: 'track',
    icon: Activity,
    accentIcon: Heart,
    title: 'Track & Care',
    description: "Track your pet's health, meals, and daily activities",
    shapes: [
      { type: 'circle', size: 80, color: '#E85D2A', opacity: 0.08, top: 20, left: 30 },
      { type: 'circle', size: 48, color: '#00C060', opacity: 0.1, top: 90, left: 180 },
      { type: 'roundedRect', w: 60, h: 36, color: '#007AFF', opacity: 0.07, top: 60, left: 100, radius: 12 },
      { type: 'circle', size: 24, color: '#FF9500', opacity: 0.12, top: 10, left: 200 },
    ]
  },
  {
    id: 'connect',
    icon: MapPin,
    accentIcon: Shield,
    title: 'Connect',
    description: 'Find trusted walkers, groomers, and vets nearby',
    shapes: [
      { type: 'circle', size: 64, color: '#007AFF', opacity: 0.08, top: 30, left: 160 },
      { type: 'roundedRect', w: 50, h: 50, color: '#E85D2A', opacity: 0.06, top: 80, left: 40, radius: 16 },
      { type: 'circle', size: 32, color: '#00C060', opacity: 0.1, top: 5, left: 80 },
      { type: 'circle', size: 20, color: '#FF9500', opacity: 0.12, top: 100, left: 200 },
    ]
  },
  {
    id: 'community',
    icon: Users,
    accentIcon: Star,
    title: 'Community',
    description: 'Join a community of pet lovers in your neighborhood',
    shapes: [
      { type: 'circle', size: 72, color: '#00C060', opacity: 0.08, top: 15, left: 150 },
      { type: 'circle', size: 40, color: '#E85D2A', opacity: 0.08, top: 90, left: 60 },
      { type: 'roundedRect', w: 44, h: 28, color: '#007AFF', opacity: 0.07, top: 50, left: 20, radius: 10 },
      { type: 'circle', size: 18, color: '#FF9500', opacity: 0.12, top: 70, left: 200 },
    ]
  }
];

// --- ABSTRACT SHAPES ILLUSTRATION ---
const AbstractIllustration = ({ shapes, mainIcon: MainIcon, accentIcon: AccentIcon }) => (
  <div className="relative w-[260px] h-[180px]">
    {/* Abstract minimal shapes */}
    {shapes.map((shape, i) => (
      <div
        key={i}
        className="absolute onb-float"
        style={{
          top: shape.top,
          left: shape.left,
          width: shape.type === 'circle' ? shape.size : shape.w,
          height: shape.type === 'circle' ? shape.size : shape.h,
          borderRadius: shape.type === 'circle' ? '50%' : (shape.radius || 8),
          backgroundColor: shape.color,
          opacity: shape.opacity,
          animationDelay: `${i * 0.4}s`,
          animationDuration: `${3 + i * 0.5}s`
        }}
      />
    ))}
    {/* Center icon cluster */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
      <div
        className="w-[88px] h-[88px] rounded-[24px] flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, #FF7240, ${THEME.colors.accent})`, boxShadow: THEME.shadows.floating }}
      >
        <MainIcon size={40} className="text-white" strokeWidth={1.8} />
      </div>
      {/* Floating accent badge */}
      <div
        className="absolute -bottom-3 -right-3 w-11 h-11 rounded-[14px] bg-white flex items-center justify-center onb-float"
        style={{ boxShadow: THEME.shadows.floating, animationDelay: '0.5s' }}
      >
        <AccentIcon size={20} style={{ color: THEME.colors.accent }} strokeWidth={2} />
      </div>
    </div>
  </div>
);

// --- WELCOME SLIDE ---
const WelcomeSlide = ({ visible }) => (
  <div className={`flex flex-col items-center justify-center flex-1 px-8 transition-all duration-600 ${visible ? 'opacity-100' : 'opacity-0'}`}>
    {/* Logo icon */}
    <div className="relative mb-7">
      <div
        className="w-[96px] h-[96px] rounded-[20px] flex items-center justify-center"
        style={{ background: `linear-gradient(135deg, #FF7240, ${THEME.colors.accent})`, boxShadow: THEME.shadows.floating }}
      >
        <PawPrint size={44} className="text-white" strokeWidth={2.2} />
      </div>
      {/* Subtle glow */}
      <div
        className="absolute inset-0 rounded-[20px]"
        style={{ animation: 'onb-breathe 3s ease-in-out infinite', background: THEME.colors.accent, filter: 'blur(24px)', zIndex: -1 }}
      />
    </div>

    {/* Brand name */}
    <FylosLogo fontSize="2.5rem" />

    {/* Tagline */}
    <p
      className="mt-4 text-center leading-relaxed"
      style={{ fontSize: 15, color: THEME.colors.secondaryText, opacity: 0.9, maxWidth: 250 }}
    >
      Your pet's life, beautifully organized.
    </p>

    {/* Made for Switzerland badge */}
    <div
      className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full"
      style={{ background: THEME.colors.surfaceAlt }}
    >
      <MapPin size={13} style={{ color: THEME.colors.tertiaryText }} />
      <span
        className="font-medium uppercase"
        style={{ fontSize: 12, letterSpacing: '0.08em', color: THEME.colors.tertiaryText, opacity: 0.8 }}
      >
        Made for Switzerland
      </span>
    </div>
  </div>
);

// --- FEATURE SLIDE ---
const FeatureSlide = ({ slide, direction, animKey }) => (
  <div
    key={animKey}
    className={`flex flex-col items-center justify-center flex-1 px-8 ${direction >= 0 ? 'onb-slide-right' : 'onb-slide-left'}`}
    style={{ opacity: 0 }}
  >
    {/* Illustration area */}
    <div className="mb-10">
      <AbstractIllustration
        shapes={slide.shapes}
        mainIcon={slide.icon}
        accentIcon={slide.accentIcon}
      />
    </div>

    {/* Title */}
    <h2
      className="font-brand tracking-tight text-center mb-3"
      style={{ fontSize: 22, fontWeight: 600, color: THEME.colors.primaryText }}
    >
      {slide.title}
    </h2>

    {/* Description */}
    <p
      className="text-center leading-relaxed"
      style={{ fontSize: 15, color: THEME.colors.primaryText, opacity: 0.9, maxWidth: 280, lineHeight: 1.65 }}
    >
      {slide.description}
    </p>
  </div>
);

// --- MAIN ONBOARDING ---
const OnboardingFlow = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [animKey, setAnimKey] = useState(0);
  const [show, setShow] = useState(false);
  const touchStart = useRef(null);

  useEffect(() => { setShow(true); }, []);

  const slide = SLIDES[current];
  const isLast = current === SLIDES.length - 1;
  const isFirst = current === 0;

  const goTo = (idx) => {
    if (idx === current || idx < 0 || idx >= SLIDES.length) return;
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    setAnimKey(k => k + 1);
  };

  const handleNext = () => {
    if (isLast) {
      window.location.href = '/add-pet';
      return;
    }
    goTo(current + 1);
  };

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && current < SLIDES.length - 1) goTo(current + 1);
      if (diff < 0 && current > 0) goTo(current - 1);
    }
    touchStart.current = null;
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
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
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}
        >
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect x="0" y="8" width="3" height="4" rx="0.5" fill="#111"/>
                <rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#111"/>
                <rect x="9" y="2" width="3" height="10" rx="0.5" fill="#111"/>
                <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#111"/>
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#111"/>
                <path d="M4.93 7.83a4.38 4.38 0 016.14 0" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M2.4 5.3a7.88 7.88 0 0111.2 0" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
                <rect x="0.5" y="0.5" width="22" height="12" rx="2.5" stroke="#111" strokeOpacity="0.35"/>
                <rect x="2" y="2" width="19" height="9" rx="1.5" fill="#111"/>
                <path d="M24 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/>
              </svg>
            </div>
          </div>

          {/* Scrollable content area */}
          <div
            className="absolute inset-0 overflow-y-auto"
            style={{ paddingTop: 54, paddingBottom: 40, WebkitOverflowScrolling: 'touch' }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="w-full relative flex flex-col" style={{ minHeight: '100%' }}>
              {/* Top spacer for floating header */}
              <div style={{ height: 56, flexShrink: 0 }} />

              {/* Main slide area */}
              {slide.type === 'welcome' ? (
                <WelcomeSlide visible={show} />
              ) : (
                <FeatureSlide slide={slide} direction={direction} animKey={animKey} />
              )}

              {/* Bottom section */}
              <div className="px-8 pb-10 flex-shrink-0">
                {/* Dots */}
                <div className="flex justify-center gap-2 mb-7">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="transition-all"
                      style={{
                        width: i === current ? 24 : 8,
                        height: 8,
                        borderRadius: 4,
                        background: i === current ? THEME.colors.accent : THEME.colors.divider,
                        transitionDuration: THEME.motion.tab,
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    />
                  ))}
                </div>

                {/* Primary button */}
                {isLast ? (
                  <button
                    onClick={handleNext}
                    className="onb-btn-primary w-full flex items-center justify-center gap-2 transition-transform"
                    style={{
                      background: 'linear-gradient(135deg, #FF7240, #E85D2A)',
                      color: 'white',
                      fontSize: 15,
                      fontWeight: 700,
                      borderRadius: THEME.radius.medium,
                      padding: '16px 0',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: `0 8px 24px ${THEME.colors.accent}30`,
                      transitionDuration: THEME.motion.tap
                    }}
                  >
                    Get Started
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="onb-btn-primary w-full flex items-center justify-center gap-2 transition-transform"
                    style={{
                      background: 'linear-gradient(135deg, #FF7240, #E85D2A)',
                      color: 'white',
                      fontSize: 15,
                      fontWeight: 700,
                      borderRadius: THEME.radius.medium,
                      padding: '16px 0',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: `0 8px 24px ${THEME.colors.accent}30`,
                      transitionDuration: THEME.motion.tap
                    }}
                  >
                    {isFirst ? 'Get Started' : 'Next'}
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </button>
                )}

                {/* Sign in link on first slide */}
                {isFirst && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => { window.location.href = '/'; }}
                      className="transition-colors"
                      style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.secondaryText, background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      Already have an account?{' '}
                      <span style={{ color: THEME.colors.accent }}>Sign in</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Floating Header */}
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              {/* Left: Back button (hidden on first slide) */}
              <button
                onClick={() => { if (current > 0) goTo(current - 1); }}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
                style={{ opacity: isFirst ? 0 : 1, pointerEvents: isFirst ? 'none' : 'auto' }}
              >
                <ChevronLeft size={22} color="#111111" />
              </button>
              {/* Center: Title */}
              <h2 className="text-[17px] font-semibold text-[#111111]">Welcome</h2>
              {/* Right: Skip button (visible on slides 1-3, not first or last) */}
              {!isFirst && !isLast ? (
                <button
                  onClick={() => { window.history.back(); }}
                  className="h-[44px] px-4 flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms] text-[15px] font-semibold text-[#E85D2A]"
                >
                  Skip
                </button>
              ) : (
                <div className="w-[44px]" />
              )}
            </div>
          </header>
        </div>
      </div>
    </>
  );
};

export default OnboardingFlow;
