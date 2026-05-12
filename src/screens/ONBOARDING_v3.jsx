import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  Check,
  Star,
  Stethoscope,
  Calendar,
  Heart,
  Sparkles as SparklesIcon,
  Bone,
  Activity,
  Scissors,
  PawPrint,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────
   ONBOARDING_v3.jsx — Assembled onboarding
   Inspired by an earlier design: peach circle BG with sparkles,
   illustrated elements that "assemble" together with motion, and
   real data peeks (pet names, real tasks, real provider chips).

   Slides match the MVP launch surfaces:
     1. welcome        → Mascot + brand
     2. your-pets      → Multi-pet vault
     3. pet-health     → Daily tracking (meds, walks, weight)
     4. care-companion → Services + booking
   ────────────────────────────────────────────────────────────────────── */

const T = {
  coral: '#E85D2A',
  coralLight: '#F47C4F',
  coralDark: '#B85A26',
  coralSoft: '#FFEDE3',
  coralSofter: '#FFF6EF',
  peach: '#FBB07A',
  peachLight: '#FCC59A',
  bellyLight: '#FBD3A6',

  bg: '#F8F4EE',
  card: '#FFFFFF',
  text: '#1A1410',
  textMuted: '#6E6058',
  textTertiary: '#A09A94',
  divider: '#ECE6DE',

  // Profile accents for pet cards
  petBlue: '#7AA9D9',
  petGreen: '#86B98E',
};

const SLIDES = [
  {
    id: 'welcome',
    eyebrow: null,
    title: null, // Welcome uses brand wordmark instead
    body: "Your pet's life, beautifully organized.",
    cta: 'Get Started',
  },
  {
    id: 'your-pets',
    eyebrow: 'Your pets',
    title: 'All in one place',
    body: 'Profiles, breed, photos and milestones — every Fylos in their own beautifully kept vault.',
    cta: 'Continue',
  },
  {
    id: 'pet-health',
    eyebrow: 'Pet health',
    title: 'Never miss a thing',
    body: 'Walks, meds, weight and vet visits — quietly tracked so nothing slips through the cracks.',
    cta: 'Continue',
  },
  {
    id: 'care-companion',
    eyebrow: 'Care companion',
    title: 'Find trusted help',
    body: 'Walkers, sitters, groomers, vets — matched to your Fylos. Book and pay in seconds.',
    cta: "Let's start",
  },
];

/* ════════════════════════════════════════════════════════════════════
   Peach-circle BG + sparkles (shared backdrop for every scene)
   ════════════════════════════════════════════════════════════════════ */

function Backdrop({ children, accentColor = T.peach, sparkleSeed = 0 }) {
  // Deterministic sparkle positions per slide so they don't reshuffle
  const sparkles = [
    { x: 6, y: 12, type: 'paw', size: 14, delay: 80 },
    { x: 88, y: 8, type: 'plus', size: 10, delay: 180 },
    { x: 4, y: 70, type: 'dot', size: 5, delay: 260 },
    { x: 92, y: 60, type: 'paw', size: 10, delay: 340 },
    { x: 18, y: 92, type: 'plus', size: 8, delay: 420 },
    { x: 76, y: 96, type: 'dot', size: 4, delay: 500 },
    { x: 50, y: 4, type: 'dot', size: 4, delay: 560 },
    { x: 38, y: 8, type: 'plus', size: 7, delay: 640 },
  ];

  return (
    <div
      style={{
        position: 'relative',
        width: 280,
        height: 280,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Peach circle */}
      <div
        style={{
          position: 'absolute',
          inset: '8% 8%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${T.coralSoft} 0%, ${T.coralSofter} 60%, transparent 78%)`,
          animation: 'fy3CircleIn 700ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
        }}
      />

      {/* Sparkles */}
      {sparkles.map((s, i) => (
        <div
          key={`${sparkleSeed}-${i}`}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: 'translate(-50%, -50%)',
            color: accentColor,
            opacity: 0,
            animation: `fy3SparkleIn 600ms cubic-bezier(0.34, 1.56, 0.64, 1) ${s.delay}ms both, fy3SparkleFloat 3.6s ease-in-out ${s.delay + 600}ms infinite`,
          }}
        >
          {s.type === 'paw' && (
            <svg width={s.size} height={s.size} viewBox="0 0 24 24" fill="none">
              <ellipse cx="12" cy="16" rx="6" ry="5" fill="currentColor" opacity="0.6" />
              <circle cx="5" cy="9" r="2.4" fill="currentColor" opacity="0.6" />
              <circle cx="10" cy="5" r="2.4" fill="currentColor" opacity="0.6" />
              <circle cx="14" cy="5" r="2.4" fill="currentColor" opacity="0.6" />
              <circle cx="19" cy="9" r="2.4" fill="currentColor" opacity="0.6" />
            </svg>
          )}
          {s.type === 'plus' && (
            <svg width={s.size} height={s.size} viewBox="0 0 12 12" fill="none">
              <path
                d="M6 1 V11 M1 6 H11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.55"
              />
            </svg>
          )}
          {s.type === 'dot' && (
            <div
              style={{
                width: s.size,
                height: s.size,
                borderRadius: '50%',
                background: 'currentColor',
                opacity: 0.5,
              }}
            />
          )}
        </div>
      ))}

      {/* Hero content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FylosMascot — full-body sitting illustration
   Big anime eyes, pink tongue, red collar with gold tag, sitting pose
   ════════════════════════════════════════════════════════════════════ */

function FylosMascot({ size = 200 }) {
  return (
    <svg
      width={size}
      height={size * 1.05}
      viewBox="0 0 100 105"
      style={{
        filter: 'drop-shadow(0 8px 12px rgba(80,40,15,0.16))',
        animation: 'fy3MascotIn 800ms cubic-bezier(0.34, 1.56, 0.64, 1) both, fy3MascotBob 4s ease-in-out 800ms infinite',
      }}
    >
      <defs>
        <radialGradient id="fy3Head" cx="38%" cy="32%" r="62%">
          <stop offset="0%" stopColor={T.peachLight} />
          <stop offset="55%" stopColor="#EB8A4C" />
          <stop offset="100%" stopColor="#B85A26" />
        </radialGradient>
        <radialGradient id="fy3Body" cx="40%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#F4995A" />
          <stop offset="100%" stopColor="#A14E1F" />
        </radialGradient>
        <radialGradient id="fy3Belly" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FDD9B0" />
          <stop offset="100%" stopColor="#F1B07E" />
        </radialGradient>
        <radialGradient id="fy3Muzzle" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FDD9B0" />
          <stop offset="100%" stopColor="#EFB386" />
        </radialGradient>
        <radialGradient id="fy3Tag" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="#FFE89A" />
          <stop offset="100%" stopColor="#D4A22A" />
        </radialGradient>
        <linearGradient id="fy3Collar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E54A3B" />
          <stop offset="100%" stopColor="#B0271C" />
        </linearGradient>
      </defs>

      {/* Tail behind body */}
      <path
        d="M72 76 Q92 66 90 86 Q86 94 78 90 Q75 85 72 76 Z"
        fill="url(#fy3Body)"
      />

      {/* Body */}
      <ellipse cx="50" cy="78" rx="28" ry="22" fill="url(#fy3Body)" />

      {/* Belly */}
      <ellipse cx="50" cy="82" rx="18" ry="15" fill="url(#fy3Belly)" />

      {/* Left arm (closer to viewer's left, sitting pose) */}
      <ellipse cx="30" cy="78" rx="7" ry="11" fill="url(#fy3Body)" />
      <ellipse cx="30" cy="86" rx="5.5" ry="4" fill={T.peach} />
      <circle cx="28" cy="86" r="0.7" fill="#5C2810" opacity="0.5" />
      <circle cx="30" cy="87" r="0.7" fill="#5C2810" opacity="0.5" />
      <circle cx="32" cy="86" r="0.7" fill="#5C2810" opacity="0.5" />

      {/* Right arm */}
      <ellipse cx="70" cy="78" rx="7" ry="11" fill="url(#fy3Body)" />
      <ellipse cx="70" cy="86" rx="5.5" ry="4" fill={T.peach} />
      <circle cx="68" cy="86" r="0.7" fill="#5C2810" opacity="0.5" />
      <circle cx="70" cy="87" r="0.7" fill="#5C2810" opacity="0.5" />
      <circle cx="72" cy="86" r="0.7" fill="#5C2810" opacity="0.5" />

      {/* Legs (small visible feet at bottom) */}
      <ellipse cx="40" cy="98" rx="9" ry="5" fill="url(#fy3Body)" />
      <ellipse cx="60" cy="98" rx="9" ry="5" fill="url(#fy3Body)" />
      <ellipse cx="40" cy="99" rx="6" ry="3" fill={T.peach} />
      <ellipse cx="60" cy="99" rx="6" ry="3" fill={T.peach} />
      {/* Paw pads */}
      <circle cx="37" cy="99" r="0.8" fill="#5C2810" opacity="0.6" />
      <circle cx="40" cy="100" r="0.8" fill="#5C2810" opacity="0.6" />
      <circle cx="43" cy="99" r="0.8" fill="#5C2810" opacity="0.6" />
      <circle cx="57" cy="99" r="0.8" fill="#5C2810" opacity="0.6" />
      <circle cx="60" cy="100" r="0.8" fill="#5C2810" opacity="0.6" />
      <circle cx="63" cy="99" r="0.8" fill="#5C2810" opacity="0.6" />

      {/* Collar — sits at the neck under the head */}
      <rect x="33" y="55" width="34" height="6" rx="3" fill="url(#fy3Collar)" />
      {/* Tag */}
      <circle cx="50" cy="63" r="4.2" fill="url(#fy3Tag)" />
      <circle cx="48.5" cy="61.5" r="1.2" fill="#FFF7D6" opacity="0.85" />
      <circle cx="50" cy="63" r="0.7" fill="#9C7619" opacity="0.6" />

      {/* Ears */}
      <g
        style={{
          transformOrigin: '30px 22px',
          animation: 'fy3EarWiggleL 6s ease-in-out 1.6s infinite',
        }}
      >
        <path d="M22 30 L30 9 L40 30 Z" fill="#B85A26" />
        <path d="M27 28 L31 17 L37 28 Z" fill={T.peach} />
      </g>
      <g
        style={{
          transformOrigin: '70px 22px',
          animation: 'fy3EarWiggleR 6s ease-in-out 2.2s infinite',
        }}
      >
        <path d="M78 30 L70 9 L60 30 Z" fill="#B85A26" />
        <path d="M73 28 L69 17 L63 28 Z" fill={T.peach} />
      </g>

      {/* Head */}
      <ellipse cx="50" cy="34" rx="26" ry="24" fill="url(#fy3Head)" />

      {/* Forehead highlight (sphere shading) */}
      <ellipse
        cx="42"
        cy="20"
        rx="11"
        ry="5"
        fill="#FFFFFF"
        opacity="0.22"
      />

      {/* Muzzle (lighter snout area) */}
      <ellipse cx="50" cy="44" rx="13" ry="9" fill="url(#fy3Muzzle)" />

      {/* Cheeks blush */}
      <ellipse cx="30" cy="40" rx="5" ry="3" fill="#FF8E7A" opacity="0.55" />
      <ellipse cx="70" cy="40" rx="5" ry="3" fill="#FF8E7A" opacity="0.55" />

      {/* Eyes — big anime style with sparkle highlights */}
      <g
        style={{
          animation: 'fy3Blink 5s ease-in-out 2s infinite',
          transformOrigin: '50px 32px',
        }}
      >
        {/* Whites */}
        <ellipse cx="40" cy="32" rx="5.6" ry="6.6" fill="#FFFFFF" />
        <ellipse cx="60" cy="32" rx="5.6" ry="6.6" fill="#FFFFFF" />
        {/* Pupils */}
        <ellipse cx="40" cy="33" rx="4.2" ry="5.2" fill="#1A0F0A" />
        <ellipse cx="60" cy="33" rx="4.2" ry="5.2" fill="#1A0F0A" />
        {/* Main highlights */}
        <circle cx="41.6" cy="30.5" r="1.6" fill="#FFFFFF" />
        <circle cx="61.6" cy="30.5" r="1.6" fill="#FFFFFF" />
        {/* Secondary highlights */}
        <circle cx="38.8" cy="34.5" r="0.9" fill="#FFFFFF" opacity="0.75" />
        <circle cx="58.8" cy="34.5" r="0.9" fill="#FFFFFF" opacity="0.75" />
      </g>

      {/* Eyebrows */}
      <path
        d="M34.5 21 Q40 19 45 22"
        stroke="#2A1408"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      <path
        d="M55 22 Q60 19 65.5 21"
        stroke="#2A1408"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />

      {/* Nose */}
      <ellipse cx="50" cy="40" rx="3" ry="2.4" fill="#1A0F0A" />
      <ellipse cx="49" cy="39.4" rx="1" ry="0.6" fill="#FFFFFF" opacity="0.8" />

      {/* Mouth — open with tongue */}
      <path
        d="M44 47 Q47 49 50 48 Q53 49 56 47"
        stroke="#1A0F0A"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Tongue */}
      <path
        d="M48 49 Q50 53 52 49 Q52 51 50 52 Q48 51 48 49 Z"
        fill="#FF6B7A"
      />
      <path
        d="M49.6 50 L49.6 52"
        stroke="#D14C5C"
        strokeWidth="0.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Slide 1 — Welcome (Meet Fylos)
   ════════════════════════════════════════════════════════════════════ */

function WelcomeScene() {
  return (
    <Backdrop sparkleSeed={1}>
      <FylosMascot size={200} />
    </Backdrop>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Slide 2 — Your Pets (multi-pet vault)
   Stack of 3 pet profile cards that fan out.
   ════════════════════════════════════════════════════════════════════ */

function PetCard({ pet, offsetX, offsetY, rotation, delay, zIndex }) {
  // Outer wrapper handles positioning (no animation conflicts)
  // Inner wrapper handles the assemble-in animation
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) translateX(${offsetX}px) translateY(${offsetY}px) rotate(${rotation}deg)`,
        zIndex,
      }}
    >
      <div
        style={{
          width: 168,
          background: T.card,
          borderRadius: 16,
          padding: '12px 12px 14px',
          boxShadow: '0 6px 20px rgba(80,40,15,0.10), 0 2px 6px rgba(80,40,15,0.05)',
          border: `1px solid ${T.divider}`,
          animation: `fy3PetCardIn 700ms cubic-bezier(0.34, 1.4, 0.64, 1) ${delay}ms both`,
        }}
      >
        {/* Avatar circle */}
        <div className="flex items-center gap-2 mb-2">
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: pet.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            {pet.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: T.text,
                letterSpacing: '-0.005em',
              }}
            >
              {pet.name}
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: T.textTertiary,
                fontWeight: 500,
              }}
            >
              {pet.breed}
            </div>
          </div>
        </div>
        {/* Mini stats row */}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-flex items-center gap-1"
            style={{
              padding: '3px 7px',
              borderRadius: 999,
              background: T.coralSoft,
              fontSize: 9.5,
              color: T.coralDark,
              fontWeight: 600,
            }}
          >
            {pet.age}
          </span>
          <span
            className="inline-flex items-center gap-1"
            style={{
              padding: '3px 7px',
              borderRadius: 999,
              background: '#EEF6F0',
              fontSize: 9.5,
              color: '#4D8A62',
              fontWeight: 600,
            }}
          >
            {pet.weight}
          </span>
        </div>
      </div>
    </div>
  );
}

function YourPetsScene() {
  const pets = [
    {
      name: 'Bobby',
      breed: 'Golden Retriever',
      age: '4 yrs',
      weight: '28 kg',
      emoji: '🦮',
      color: '#FFE3D0',
      offsetX: -52,
      offsetY: -8,
      rotation: -8,
      delay: 220,
      zIndex: 1,
    },
    {
      name: 'Luna',
      breed: 'Maine Coon',
      age: '2 yrs',
      weight: '5.2 kg',
      emoji: '🐱',
      color: '#E0EAF4',
      offsetX: 52,
      offsetY: 12,
      rotation: 7,
      delay: 360,
      zIndex: 2,
    },
    {
      name: 'Milo',
      breed: 'French Bulldog',
      age: '1 yr',
      weight: '9 kg',
      emoji: '🐶',
      color: '#FBE5D4',
      offsetX: 0,
      offsetY: -50,
      rotation: 2,
      delay: 500,
      zIndex: 3,
    },
  ];

  return (
    <Backdrop sparkleSeed={2}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {pets.map((p) => (
          <PetCard key={p.name} pet={p} {...p} />
        ))}
      </div>
    </Backdrop>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Slide 3 — Pet Health (Track everything with real tasks)
   Illustrated card-list with real items checking off
   ════════════════════════════════════════════════════════════════════ */

function HealthScene() {
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    setCheckedCount(0);
    const t1 = setTimeout(() => setCheckedCount(1), 1000);
    const t2 = setTimeout(() => setCheckedCount(2), 1700);
    const t3 = setTimeout(() => setCheckedCount(3), 2400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const items = [
    { icon: Stethoscope, label: 'Morning meds', sub: 'Apoquel · 1 tab', accent: T.coral },
    { icon: PawPrint, label: 'Afternoon walk', sub: 'Park · 30 min', accent: T.coralLight },
    { icon: Activity, label: 'Weight check', sub: '28 kg · ↓ 0.3', accent: '#4D8A62' },
  ];

  return (
    <Backdrop sparkleSeed={3}>
      <div
        style={{
          width: 220,
          background: T.coralSofter,
          borderRadius: 22,
          padding: 16,
          boxShadow:
            '0 10px 28px rgba(80,40,15,0.12), 0 2px 6px rgba(80,40,15,0.05)',
          border: `1px solid ${T.coralSoft}`,
          animation: 'fy3CardSettle 700ms cubic-bezier(0.34, 1.4, 0.64, 1) 200ms both',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: T.coralDark,
              textTransform: 'uppercase',
            }}
          >
            Today · {Math.max(0, items.length - checkedCount)} left
          </span>
          <Heart size={11} fill={T.coral} color={T.coral} />
        </div>
        <div style={{ position: 'relative' }}>
          {/* Timeline line */}
          <div
            style={{
              position: 'absolute',
              left: 9,
              top: 10,
              bottom: 10,
              width: 2,
              background: T.coralSoft,
              borderRadius: 1,
            }}
          />
          {items.map((it, i) => {
            const done = i < checkedCount;
            const Icon = it.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-2.5 relative"
                style={{
                  marginBottom: i < items.length - 1 ? 12 : 0,
                  animation: `fy3CardSettle 600ms cubic-bezier(0.34, 1.4, 0.64, 1) ${350 + i * 120}ms both`,
                }}
              >
                {/* Marker dot */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: done ? it.accent : T.card,
                    border: done ? 'none' : `2px solid ${it.accent}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 300ms ease',
                    zIndex: 1,
                  }}
                >
                  {done ? (
                    <Check size={11} color="#FFF" strokeWidth={3.5} />
                  ) : (
                    <Icon size={9} color={it.accent} strokeWidth={2.4} />
                  )}
                </div>
                {/* Pill */}
                <div
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: T.card,
                    borderRadius: 9,
                    padding: '5px 9px',
                    boxShadow: '0 1px 2px rgba(80,40,15,0.04)',
                    border: `1px solid ${T.coralSoft}`,
                    transition: 'all 300ms ease',
                    opacity: done ? 0.7 : 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: T.text,
                      lineHeight: 1.2,
                      textDecoration: done ? 'line-through' : 'none',
                      textDecorationColor: T.textTertiary,
                    }}
                  >
                    {it.label}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: T.textTertiary,
                      lineHeight: 1.2,
                      marginTop: 1,
                    }}
                  >
                    {it.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Backdrop>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Slide 4 — Care Companion (Services + booking)
   Connected circles: walker · groomer · vet around a center paw
   With a real provider snippet below
   ════════════════════════════════════════════════════════════════════ */

function CareCompanionScene() {
  const providers = [
    {
      icon: PawPrint,
      label: 'Walker',
      color: T.coral,
      x: 22,
      y: 22,
      delay: 320,
    },
    {
      icon: Scissors,
      label: 'Groomer',
      color: '#7AA9D9',
      x: 78,
      y: 22,
      delay: 460,
    },
    {
      icon: Stethoscope,
      label: 'Vet',
      color: '#86B98E',
      x: 78,
      y: 78,
      delay: 600,
    },
    {
      icon: Bone,
      label: 'Sitter',
      color: '#C7884D',
      x: 22,
      y: 78,
      delay: 740,
    },
  ];

  return (
    <Backdrop sparkleSeed={4}>
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {/* Connecting lines (SVG behind everything) */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: 'absolute', inset: 0, zIndex: 0 }}
        >
          {providers.map((p, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={p.x}
              y2={p.y}
              stroke={T.coral}
              strokeWidth="0.5"
              strokeDasharray="1.5 1.5"
              opacity="0.45"
              style={{
                animation: `fy3LineDraw 600ms ease ${p.delay - 100}ms both`,
              }}
            />
          ))}
        </svg>

        {/* Center paw */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 58,
            height: 58,
            borderRadius: '50%',
            background: T.coral,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 6px 16px rgba(232,93,42,0.30)',
            border: '3px solid #FFFFFF',
            zIndex: 3,
            animation: 'fy3CenterPop 600ms cubic-bezier(0.34, 1.56, 0.64, 1) 180ms both',
          }}
        >
          <PawPrint size={28} strokeWidth={2.2} />
        </div>

        {/* Surrounding provider circles */}
        {providers.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: `${p.y}%`,
                left: `${p.x}%`,
                transform: 'translate(-50%, -50%)',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: T.card,
                border: `2px solid ${p.color}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: p.color,
                boxShadow: '0 4px 12px rgba(80,40,15,0.10)',
                zIndex: 2,
                animation: `fy3CircleAppear 560ms cubic-bezier(0.34, 1.56, 0.64, 1) ${p.delay}ms both`,
              }}
            >
              <Icon size={18} strokeWidth={2.2} />
            </div>
          );
        })}

        {/* Provider snippet pill (real data) — wrapper handles positioning */}
        <div
          style={{
            position: 'absolute',
            bottom: '-2%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 4,
          }}
        >
          <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px 6px 6px',
            background: T.card,
            borderRadius: 999,
            boxShadow: '0 6px 16px rgba(80,40,15,0.12), 0 2px 4px rgba(80,40,15,0.04)',
            border: `1px solid ${T.divider}`,
            animation:
              'fy3PillIn 700ms cubic-bezier(0.34, 1.4, 0.64, 1) 900ms both',
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: T.coral,
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            L
          </div>
          <div className="flex items-center gap-1">
            <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>
              Lukas
            </span>
            <Star size={9} fill={T.coral} color={T.coral} />
            <span style={{ fontSize: 10, fontWeight: 600, color: T.text }}>
              4.9
            </span>
          </div>
          <span
            style={{
              fontSize: 9,
              fontWeight: 600,
              color: '#4D8A62',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: '#4D8A62',
              }}
            />
            Free
          </span>
          </div>
        </div>
      </div>
    </Backdrop>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Scene routing
   ════════════════════════════════════════════════════════════════════ */

const SCENES = {
  welcome: WelcomeScene,
  'your-pets': YourPetsScene,
  'pet-health': HealthScene,
  'care-companion': CareCompanionScene,
};

/* ════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════ */

export default function OnboardingV3() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = SLIDES[slideIndex];
  const SceneComponent = SCENES[slide.id];
  const isLast = slideIndex === SLIDES.length - 1;
  const isFirst = slideIndex === 0;

  const next = () => {
    if (isLast) return;
    setSlideIndex((i) => i + 1);
  };
  const prev = () => setSlideIndex((i) => Math.max(0, i - 1));

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes fy3CircleIn {
          from { opacity: 0; transform: scale(0.72); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fy3SparkleIn {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fy3SparkleFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50%      { transform: translate(-50%, -50%) translateY(-4px); }
        }
        @keyframes fy3MascotIn {
          0%   { opacity: 0; transform: translateY(28px) scale(0.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fy3MascotBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-5px); }
        }
        @keyframes fy3Blink {
          0%, 92%, 100% { transform: scaleY(1); }
          95%, 96%      { transform: scaleY(0.1); }
        }
        @keyframes fy3EarWiggleL {
          0%, 88%, 100% { transform: rotate(0deg); }
          92%           { transform: rotate(-8deg); }
        }
        @keyframes fy3EarWiggleR {
          0%, 88%, 100% { transform: rotate(0deg); }
          92%           { transform: rotate(8deg); }
        }
        @keyframes fy3CardSettle {
          0%   { opacity: 0; transform: translateY(24px) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fy3PetCardIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fy3PillIn {
          0%   { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fy3CenterPop {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fy3CircleAppear {
          0%   { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes fy3LineDraw {
          from { opacity: 0; }
          to   { opacity: 0.45; }
        }
        @keyframes fy3SectionFade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-1"
        style={{ position: 'relative', zIndex: 5 }}
      >
        {!isFirst ? (
          <button
            onClick={prev}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: T.coralSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Back"
          >
            <ChevronLeft size={18} style={{ color: T.coralDark }} />
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13.5,
            fontWeight: 500,
            color: T.textTertiary,
          }}
        >
          {isFirst ? '' : 'Skip'}
        </button>
      </div>

      {/* Scene */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6"
        style={{ minHeight: 0 }}
      >
        <div
          key={`scene-${slide.id}`}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 30,
            minHeight: 280,
          }}
        >
          <SceneComponent />
        </div>

        {/* Copy */}
        <div
          key={`copy-${slide.id}`}
          className="text-center"
          style={{
            maxWidth: 320,
            animation: 'fy3SectionFade 520ms cubic-bezier(0.2, 0.7, 0.2, 1) 260ms both',
          }}
        >
          {slide.id === 'welcome' ? (
            <>
              <h1
                style={{
                  fontSize: 38,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: T.text,
                  marginBottom: 10,
                }}
              >
                FYLOS<span style={{ color: T.coral }}>.</span>
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: T.textMuted,
                  lineHeight: 1.5,
                }}
              >
                {slide.body}
              </p>
            </>
          ) : (
            <>
              {slide.eyebrow && (
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '0.10em',
                    color: T.coral,
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  {slide.eyebrow}
                </div>
              )}
              <h1
                style={{
                  fontSize: 26,
                  fontWeight: 800,
                  color: T.text,
                  lineHeight: 1.15,
                  letterSpacing: '-0.015em',
                  marginBottom: 10,
                }}
              >
                {slide.title}
              </h1>
              <p
                style={{
                  fontSize: 14,
                  color: T.textMuted,
                  lineHeight: 1.5,
                }}
              >
                {slide.body}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Dots + CTA */}
      <div className="px-6 pb-6 pt-2" style={{ position: 'relative', zIndex: 5 }}>
        <div className="flex items-center justify-center gap-1.5 mb-5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === slideIndex ? 24 : 6,
                height: 6,
                borderRadius: 3,
                background: i === slideIndex ? T.coral : T.coralSoft,
                transition: 'all 280ms ease',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
        <button
          onClick={next}
          style={{
            width: '100%',
            height: 54,
            borderRadius: 27,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: 15,
            background: `linear-gradient(180deg, ${T.coralLight} 0%, ${T.coral} 100%)`,
            boxShadow: '0 6px 16px rgba(232,93,42,0.30), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
        >
          {slide.cta}
          <ArrowRight size={17} strokeWidth={2.4} />
        </button>
        <div
          className="text-center mt-3"
          style={{ fontSize: 12, color: T.textTertiary }}
        >
          Already have an account?{' '}
          <span style={{ color: T.text, fontWeight: 700 }}>Sign in</span>
        </div>
      </div>
    </div>
  );
}
