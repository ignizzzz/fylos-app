import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  Star,
  Stethoscope,
  Calendar,
  PawPrint,
  Heart,
  Scissors,
  Pill,
  Sparkles as SparklesIcon,
} from 'lucide-react';
import { AddPetMascot } from './37_ADD_PET_v1';

/* ──────────────────────────────────────────────────────────────────────
   ONBOARDING_v4.jsx — Clean rebuild
   Uses canonical assets only:
     • FylosLogo (from 03_HOME_Dashboard_v1)
     • AddPetMascot (from 37_ADD_PET_v1) — same character, varying state per slide
     • Real data: Luna (Dog), Max (Cat), real MOCK_HEALTH_DATA, ROLES
     • Coral pill CTA + coral Sign in link
   ────────────────────────────────────────────────────────────────────── */

const T = {
  coral: '#E85D2A',
  coralDark: '#B85A26',
  coralSoft: '#FFEDE3',
  coralSofter: '#FFF6EF',
  bg: '#F2EFE6',
  card: '#FFFFFF',
  text: '#111111',
  textMuted: '#6E6058',
  textTertiary: '#A09A94',
  divider: '#ECE6DE',
  green: '#4D8A62',
  greenSoft: '#EEF6F0',
  blue: '#7AA9D9',
  blueSoft: '#EAF1F8',
};

/* ────────────────────────────────────────────────────────────────────
   Canonical FylosLogo (copied verbatim from 03_HOME_Dashboard_v1:31-70)
   ──────────────────────────────────────────────────────────────────── */
const FylosLogo = ({
  textColor = '#111111',
  dotColor = '#E85D2A',
  fontSize = '2rem',
  className = '',
}) => (
  <div
    className={className}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `calc(${fontSize} * 0.15)`,
      fontFamily: '"Nunito", sans-serif',
    }}
  >
    <span
      style={{
        fontSize: fontSize,
        fontWeight: 800,
        color: textColor,
        letterSpacing: '-0.5px',
        lineHeight: 1,
      }}
    >
      FYLOS
    </span>
    <div
      style={{
        width: `calc(${fontSize} * 0.25)`,
        height: `calc(${fontSize} * 0.25)`,
        borderRadius: '50%',
        backgroundColor: dotColor,
      }}
    />
  </div>
);

/* ────────────────────────────────────────────────────────────────────
   Slides — content + mascot state mapping
   ──────────────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 'welcome',
    mascotStep: 3, // celebrating
    mascotPetName: 'Luna',
    cta: 'Come in',
  },
  {
    id: 'pets',
    eyebrow: null,
    title: 'Every pet, kept together.',
    body: 'From their breed to their last vet visit, all their details live in your pocket and stay ready whenever you need them.',
    cta: 'Go on',
  },
  {
    id: 'health',
    eyebrow: null,
    title: 'The little things, remembered.',
    body: 'From morning meds to weekend walks, vet check-ins to weight changes. We hold the little things, so you can stay present with them.',
    cta: 'Go on',
  },
  {
    id: 'services',
    eyebrow: null,
    title: 'Help, when life happens.',
    body: 'Walkers, sitters, vets, groomers and more. Vetted pros around you, just a tap away whenever a busy week or an emergency calls.',
    cta: 'Go on',
  },
  {
    id: 'pro',
    eyebrow: null,
    title: 'Become a Pro.',
    body: 'Run your pet business on Fylos. Built for every pet pro, with bookings, payments and the tools to grow, all in one place.',
    cta: 'Earn with Fylos',
  },
];

/* ────────────────────────────────────────────────────────────────────
   Scaled mascot wrapper — uses canonical AddPetMascot with sizing
   ──────────────────────────────────────────────────────────────────── */
function MascotAt({ step, petName, scale = 1 }) {
  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'center',
        display: 'inline-block',
      }}
    >
      <AddPetMascot
        step={step}
        petType="dog"
        petName={petName}
        scrollProgress={0}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SCENES
   ════════════════════════════════════════════════════════════════════ */

/* Tiny decorative paw print used in the welcome scene halo */
function FloatingPaw({ x, y, size = 14, delay = 0, color = T.coral }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        color,
        opacity: 0.3,
        transform: 'translate(-50%, -50%)',
        animation: `welcomePawDrift 6s ease-in-out ${delay}ms infinite`,
        pointerEvents: 'none',
      }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor">
        <ellipse cx="12" cy="16" rx="6" ry="5" />
        <circle cx="5" cy="9" r="2.4" />
        <circle cx="10" cy="5" r="2.4" />
        <circle cx="14" cy="5" r="2.4" />
        <circle cx="19" cy="9" r="2.4" />
      </svg>
    </div>
  );
}

function WelcomeScene() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        position: 'relative',
      }}
    >
      {/* Watercolor 'φίλος.' — Greek etymology of the brand name */}
      <img
        src="/onboarding/philos.png"
        alt=""
        style={{
          width: 'min(290px, 88%)',
          height: 'auto',
          objectFit: 'contain',
          marginBottom: 4,
        }}
      />

      {/* Etymology line — italic editorial whisper */}
      <div
        style={{
          fontSize: 12,
          fontStyle: 'italic',
          color: T.textMuted,
          letterSpacing: '0.04em',
          textAlign: 'center',
          marginTop: -12,
        }}
      >
        from the Greek for <em>friend</em>
      </div>

      {/* Hairline divider — subtle separator between Greek root and brand */}
      <div
        style={{
          width: 32,
          height: 1,
          background: 'rgba(60,30,15,0.18)',
          marginTop: 4,
        }}
      />

      {/* FylosLogo — Latin brand wordmark */}
      <FylosLogo fontSize="34px" textColor={T.text} dotColor={T.coral} />

      {/* Tagline */}
      <p
        style={{
          fontSize: 14.5,
          color: T.textMuted,
          textAlign: 'center',
          maxWidth: 280,
          lineHeight: 1.5,
          marginTop: 2,
        }}
      >
        Your pet's life, beautifully organized.
      </p>
    </div>
  );
}

/* Stylized pet avatar (no photos, distinctive per pet) */
function PetAvatar({ kind, color, bg, size = 44 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.32,
        background: `linear-gradient(135deg, ${bg} 0%, ${bg} 60%, rgba(255,255,255,0.6) 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `inset 0 -2px 0 rgba(0,0,0,0.04)`,
      }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill="none">
        {kind === 'dog' ? (
          /* Dog silhouette */
          <g fill={color}>
            <ellipse cx="12" cy="14" rx="7" ry="5.5" />
            <ellipse cx="6.5" cy="9" rx="2.2" ry="3.2" transform="rotate(-25 6.5 9)" />
            <ellipse cx="17.5" cy="9" rx="2.2" ry="3.2" transform="rotate(25 17.5 9)" />
            <circle cx="9.5" cy="13" r="1" fill="#FFFFFF" />
            <circle cx="14.5" cy="13" r="1" fill="#FFFFFF" />
            <ellipse cx="12" cy="16" rx="1.2" ry="0.9" fill="#1A0F0A" />
          </g>
        ) : (
          /* Cat silhouette */
          <g fill={color}>
            <ellipse cx="12" cy="14" rx="7" ry="5.5" />
            <path d="M5 8 L7 4 L9 8 Z" />
            <path d="M19 8 L17 4 L15 8 Z" />
            <circle cx="9.5" cy="13" r="1" fill="#FFFFFF" />
            <circle cx="14.5" cy="13" r="1" fill="#FFFFFF" />
            <path d="M11 16 L12 17 L13 16" stroke="#1A0F0A" strokeWidth="1" strokeLinecap="round" fill="none" />
          </g>
        )}
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Vita / Quiet Pages style — hand-drawn pet portrait in line art
   over a soft coral watercolor wash. Used on slide 2 (Your Pets).
   ──────────────────────────────────────────────────────────────────── */
function SketchedPet({ kind, size = 56, wash = '#FFE0CB', accent = '#E85D2A' }) {
  const ink = '#3D2515';
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Watercolor wash background (organic blob shape) */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        style={{ position: 'absolute', inset: 0 }}
      >
        <path
          d="M30 8 C44 8, 54 16, 52 32 C56 44, 44 54, 30 52 C16 54, 6 44, 8 30 C6 18, 16 8, 30 8 Z"
          fill={wash}
          opacity="0.65"
        />
        {/* Second darker wash spot for that 'paint bled' look */}
        <ellipse cx="22" cy="22" rx="8" ry="6" fill={accent} opacity="0.10" />
      </svg>

      {/* Line art portrait */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 60 60"
        style={{ position: 'absolute', inset: 0 }}
      >
        {kind === 'dog' ? (
          <g
            stroke={ink}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Head shape (slightly imperfect) */}
            <path d="M18 28 Q18 16 30 14 Q42 16 42 28 Q43 44 30 48 Q17 44 18 28 Z" />
            {/* Left floppy ear */}
            <path d="M19 22 Q12 19 11 28 Q12 36 21 32" />
            {/* Right floppy ear */}
            <path d="M41 22 Q48 19 49 28 Q48 36 39 32" />
            {/* Eyes */}
            <ellipse cx="25" cy="29" rx="1.6" ry="1.8" fill={ink} />
            <ellipse cx="35" cy="29" rx="1.6" ry="1.8" fill={ink} />
            {/* Cheek blush (watercolor dots) */}
            <circle cx="22" cy="36" r="1.5" fill={accent} opacity="0.35" />
            <circle cx="38" cy="36" r="1.5" fill={accent} opacity="0.35" />
            {/* Nose */}
            <ellipse cx="30" cy="35" rx="1.8" ry="1.4" fill={ink} />
            {/* Smile */}
            <path d="M26 40 Q30 43 34 40" />
            {/* Tongue */}
            <path
              d="M28 41 Q30 44 32 41"
              stroke="none"
              fill={accent}
              opacity="0.7"
            />
          </g>
        ) : (
          <g
            stroke={ink}
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Head with pointy ears */}
            <path d="M14 30 L17 14 L24 24 Q30 22 36 24 L43 14 L46 30 Q46 44 30 48 Q14 44 14 30 Z" />
            {/* Inner ear hints */}
            <path d="M18 19 L20 24" />
            <path d="M42 19 L40 24" />
            {/* Eyes (almond) */}
            <path d="M22 30 Q24 28 26 30 Q24 31 22 30 Z" fill={ink} />
            <path d="M34 30 Q36 28 38 30 Q36 31 34 30 Z" fill={ink} />
            {/* Cheek blush */}
            <circle cx="20" cy="36" r="1.5" fill={accent} opacity="0.35" />
            <circle cx="40" cy="36" r="1.5" fill={accent} opacity="0.35" />
            {/* Triangle nose */}
            <path d="M28 35 L30 38 L32 35 Z" fill={ink} />
            {/* W mouth */}
            <path d="M27 40 Q30 42 30 40 Q30 42 33 40" />
            {/* Whiskers */}
            <path
              d="M18 36 L22 36 M18 38 L22 37 M38 36 L42 36 M38 37 L42 38"
              strokeWidth="0.9"
              opacity="0.55"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

/* Tape decoration for the notebook page */
function WashiTape({ color = T.coral, width = 64, rotate = -4, top = -6, left = '50%' }) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        transform: `translateX(-50%) rotate(${rotate}deg)`,
        width,
        height: 16,
        background: color,
        opacity: 0.62,
        boxShadow: '0 1px 2px rgba(80,40,15,0.10)',
      }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────
   Slide 2 — Calm
   Hand-drawn illustration, no frames, no app preview.
   Style: single line-art subject + watercolor wash. Pure brand feeling.
   This SVG is a placeholder. Swap in Midjourney-generated artwork later.
   ──────────────────────────────────────────────────────────────────── */
function CalmIllustration({ size = 260 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 260 260"
      style={{
        animation: 'fy4CalmFloat 6s ease-in-out infinite',
      }}
    >
      <defs>
        <radialGradient id="fy4CalmWash" cx="48%" cy="55%" r="48%">
          <stop offset="0%" stopColor="#FFC59A" stopOpacity="0.75" />
          <stop offset="55%" stopColor="#FFE0CB" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFEDE3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="fy4CalmAccent" cx="35%" cy="40%" r="35%">
          <stop offset="0%" stopColor="#E85D2A" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#E85D2A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Watercolor blob — slightly irregular to feel hand-painted */}
      <path
        d="M50 110 C55 55, 130 38, 180 65 C225 88, 230 160, 195 200 C155 235, 70 220, 45 180 C25 150, 30 125, 50 110 Z"
        fill="url(#fy4CalmWash)"
      />
      {/* Accent wash for paint-bled feel */}
      <ellipse cx="90" cy="110" rx="50" ry="32" fill="url(#fy4CalmAccent)" />

      {/* Curled sleeping pet — hand-drawn line art */}
      <g
        stroke="#3D2515"
        strokeWidth="2.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Body curl */}
        <path d="M78 158 C72 195, 105 218, 145 218 C190 213, 210 175, 198 142 C188 115, 152 105, 122 122 C100 134, 85 145, 78 158 Z" />
        {/* Head tucked in */}
        <path d="M148 152 C162 138, 160 115, 142 110 C124 110, 117 128, 126 146" />
        {/* Ear */}
        <path d="M146 110 C141 96, 154 90, 158 104" />
        {/* Closed eye (sleeping) */}
        <path d="M134 134 Q138 130 142 134" strokeWidth="2.2" />
        {/* Nose */}
        <circle cx="128" cy="142" r="2.2" fill="#3D2515" />
        {/* Subtle smile */}
        <path d="M122 148 Q127 151 132 148" strokeWidth="2" />
      </g>

      {/* Floating "Z" sleep indicators (coral, hand-drawn feel) */}
      <g
        stroke="#E85D2A"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M58 70 L70 70 L58 84 L70 84" opacity="0.75" />
        <path d="M42 102 L51 102 L42 112 L51 112" opacity="0.55" strokeWidth="2" />
        <path d="M195 50 L202 50 L195 58 L202 58" opacity="0.45" strokeWidth="1.8" />
      </g>

      {/* Tiny decorative dots scattered (hand-painted feel) */}
      <g fill="#E85D2A" opacity="0.35">
        <circle cx="220" cy="160" r="2.4" />
        <circle cx="38" cy="170" r="2" />
        <circle cx="210" cy="100" r="1.5" />
      </g>
    </svg>
  );
}

/* SlideImage — fixed-height container so every illustration occupies the
   same vertical space. Text below always lands at the same y-position
   regardless of each image's aspect ratio. Use `imageScale` to shrink
   a specific image within the shared container (e.g. dog+cat that feels
   visually heavier than the others). */
function SlideImage({ src, imageScale = 1 }) {
  return (
    <div
      style={{
        width: 'calc(100% + 32px)',
        height: 290,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation:
          'fy4CardIn 800ms cubic-bezier(0.34, 1.4, 0.64, 1) 100ms both',
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          maxWidth: `${imageScale * 100}%`,
          maxHeight: `${imageScale * 100}%`,
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

function PetsScene() {
  // Dog+cat fills the container more heavily than other illustrations
  // (square subject vs. wide still lifes), so shrink slightly for balance.
  return <SlideImage src="/onboarding/pets.png" imageScale={0.85} />;
}

/* Mini line chart for weight tile */
function MiniLineChart({ color = T.coral, width = 120, height = 32 }) {
  // 6 weight points: 26.5, 27.2, 27.8, 28.1, 28.0, 28.0
  const points = [26.5, 27.2, 27.8, 28.1, 28.0, 28.0];
  const min = 26;
  const max = 29;
  const xStep = width / (points.length - 1);
  const path = points
    .map((v, i) => {
      const x = i * xStep;
      const y = height - ((v - min) / (max - min)) * height;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
  // Area fill path
  const areaPath = `${path} L ${width} ${height} L 0 ${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id="weightArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#weightArea)" />
      <path d={path} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* End point dot */}
      <circle
        cx={(points.length - 1) * xStep}
        cy={height - ((points[points.length - 1] - min) / (max - min)) * height}
        r="3"
        fill={color}
      />
      <circle
        cx={(points.length - 1) * xStep}
        cy={height - ((points[points.length - 1] - min) / (max - min)) * height}
        r="1.4"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/* Mini circular progress ring for health score */
function ScoreRing({ value = 98, color = T.green, size = 52 }) {
  const radius = (size - 6) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={T.divider}
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function HealthTile({ children, accent, delay, span = 1 }) {
  return (
    <div
      style={{
        gridColumn: span === 2 ? 'span 2' : 'span 1',
        background: T.card,
        borderRadius: 16,
        padding: 12,
        boxShadow: '0 6px 18px rgba(60,30,15,0.08), 0 2px 4px rgba(60,30,15,0.03)',
        border: `1px solid ${T.divider}`,
        position: 'relative',
        overflow: 'hidden',
        animation: `fy4CardIn 700ms cubic-bezier(0.34, 1.4, 0.64, 1) ${delay}ms both`,
      }}
    >
      {/* Subtle corner accent */}
      <div
        style={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 60,
          height: 60,
          borderRadius: '50%',
          background: accent,
          opacity: 0.4,
        }}
      />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

function HealthScene() {
  return <SlideImage src="/onboarding/health.png" />;
}

/* Legacy HealthScene grid (kept as reference, not rendered) */
function HealthSceneLegacy() {
  return (
    <div
      style={{
        position: 'relative',
        width: 320,
        height: 300,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: 'auto auto',
        gap: 10,
      }}
    >
      {/* Tile 1 — Weight chart (full width) */}
      <HealthTile accent={T.coralSoft} delay={120} span={2}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: T.textTertiary,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              Weight · 6 mo
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
              28.0 <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>kg</span>
            </div>
          </div>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 3,
              fontSize: 10,
              fontWeight: 700,
              color: T.green,
              background: T.greenSoft,
              padding: '3px 8px',
              borderRadius: 999,
            }}
          >
            Stable
          </span>
        </div>
        <MiniLineChart color={T.coral} width={264} height={36} />
      </HealthTile>

      {/* Tile 2 — Next vaccine */}
      <HealthTile accent={T.coralSoft} delay={260}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              background: T.coralSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stethoscope size={14} color={T.coral} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: T.textTertiary,
              textTransform: 'uppercase',
            }}
          >
            Next vaccine
          </span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          Rabies
        </div>
        <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3 }}>May 2026</div>
      </HealthTile>

      {/* Tile 3 — Health score */}
      <HealthTile accent={T.greenSoft} delay={380}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: T.textTertiary,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              Health score
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: T.text, letterSpacing: '-0.02em', lineHeight: 1 }}>
              98<span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>%</span>
            </div>
            <div style={{ fontSize: 10.5, color: T.green, fontWeight: 700, marginTop: 3 }}>
              Excellent
            </div>
          </div>
          <ScoreRing value={98} color={T.green} size={50} />
        </div>
      </HealthTile>

      {/* Tile 4 — Today's meds */}
      <HealthTile accent={T.blueSoft} delay={500}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 9,
              background: T.blueSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Pill size={14} color={T.blue} strokeWidth={2.4} />
          </div>
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: T.textTertiary,
              textTransform: 'uppercase',
            }}
          >
            Today
          </span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 800, color: T.text, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          NexGard
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 4,
            fontSize: 10.5,
            fontWeight: 700,
            color: T.green,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12 L10 17 L19 7"
              stroke={T.green}
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Done
        </div>
      </HealthTile>

      {/* Tile 5 — Next vet visit (full width strip) */}
      <HealthTile accent={T.bg} delay={620} span={2}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              background: T.greenSoft,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Calendar size={17} color={T.green} strokeWidth={2.2} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 800, color: T.text, letterSpacing: '-0.01em' }}>
              Annual checkup with Dr. Smith
            </div>
            <div style={{ fontSize: 10.5, color: T.textTertiary, marginTop: 2 }}>
              Zurich Vet Center · Mar 15 · 14:00
            </div>
          </div>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: T.coral,
              background: T.coralSoft,
              padding: '3px 8px',
              borderRadius: 999,
              flexShrink: 0,
            }}
          >
            in 3 days
          </span>
        </div>
      </HealthTile>
    </div>
  );
}

function ServicesScene() {
  return <SlideImage src="/onboarding/services.png" />;
}

/* Legacy ServicesScene grid (kept as reference, not rendered) */
function ServicesSceneLegacy() {
  // Service categories arranged in a 2x2 grid with floating "available now" marker
  const services = [
    {
      icon: PawPrint,
      label: 'Walkers',
      count: '32 nearby',
      from: 'from CHF 25',
      color: T.coral,
      bg: T.coralSoft,
      pulse: true, // shows "live" indicator
    },
    {
      icon: Heart,
      label: 'Sitters',
      count: '18 nearby',
      from: 'from CHF 55',
      color: T.blue,
      bg: T.blueSoft,
      pulse: false,
    },
    {
      icon: Scissors,
      label: 'Groomers',
      count: '12 nearby',
      from: 'from CHF 60',
      color: T.green,
      bg: T.greenSoft,
      pulse: false,
    },
    {
      icon: Stethoscope,
      label: 'Vets',
      count: '8 nearby',
      from: '24h care',
      color: '#B0792E',
      bg: '#FFF6E0',
      pulse: true,
    },
  ];

  return (
    <div style={{ position: 'relative', width: 320, height: 300 }}>
      {/* Soft map-like background gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 22,
          background:
            'radial-gradient(ellipse at 30% 20%, rgba(255,237,227,0.6) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(234,241,248,0.5) 0%, transparent 60%)',
          zIndex: 0,
        }}
      />

      {/* Header strip */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 6px',
          marginBottom: 10,
          animation: 'fy4CardIn 600ms cubic-bezier(0.34, 1.4, 0.64, 1) 100ms both',
        }}
      >
        <span
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: '0.10em',
            color: T.textTertiary,
            textTransform: 'uppercase',
          }}
        >
          Around you · Zurich
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 10,
            fontWeight: 700,
            color: T.green,
            background: T.greenSoft,
            padding: '3px 8px',
            borderRadius: 999,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: T.green,
            }}
          />
          70 active
        </span>
      </div>

      {/* 2x2 service grid */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
        }}
      >
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              style={{
                background: T.card,
                borderRadius: 18,
                padding: 14,
                boxShadow:
                  '0 8px 22px rgba(60,30,15,0.08), 0 2px 4px rgba(60,30,15,0.03)',
                border: `1px solid ${T.divider}`,
                position: 'relative',
                overflow: 'hidden',
                animation: `fy4CardIn 700ms cubic-bezier(0.34, 1.4, 0.64, 1) ${
                  220 + i * 100
                }ms both`,
              }}
            >
              {/* Decorative corner blob */}
              <div
                style={{
                  position: 'absolute',
                  top: -16,
                  right: -16,
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: s.bg,
                  opacity: 0.65,
                }}
              />
              {/* Icon */}
              <div
                style={{
                  position: 'relative',
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: s.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                  boxShadow: `inset 0 -2px 0 rgba(0,0,0,0.04)`,
                }}
              >
                <Icon size={18} color={s.color} strokeWidth={2.4} />
                {s.pulse && (
                  <span
                    style={{
                      position: 'absolute',
                      top: -3,
                      right: -3,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: T.green,
                      border: '2px solid #FFFFFF',
                    }}
                  />
                )}
              </div>
              {/* Label */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: T.text,
                  letterSpacing: '-0.01em',
                  position: 'relative',
                }}
              >
                {s.label}
              </div>
              {/* Stats */}
              <div
                style={{
                  fontSize: 10.5,
                  color: T.textTertiary,
                  marginTop: 3,
                  position: 'relative',
                }}
              >
                {s.count}
              </div>
              <div
                style={{
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: s.color,
                  marginTop: 5,
                  position: 'relative',
                }}
              >
                {s.from}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating trust pill at bottom */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          marginTop: 10,
          display: 'flex',
          justifyContent: 'center',
          animation: 'fy4CardIn 700ms cubic-bezier(0.34, 1.4, 0.64, 1) 720ms both',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            background: T.card,
            borderRadius: 999,
            boxShadow: '0 4px 14px rgba(60,30,15,0.08)',
            border: `1px solid ${T.divider}`,
          }}
        >
          <Star size={11} fill={T.coral} color={T.coral} />
          <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>
            4.9 average
          </span>
          <span style={{ fontSize: 10, color: T.textTertiary }}>
            from 2,400+ reviews
          </span>
        </div>
      </div>
    </div>
  );
}

/* Mini bar chart for earnings */
function EarningsBars({ width = 260, height = 56 }) {
  // 7 weekly bars showing growth
  const data = [220, 180, 260, 320, 280, 340, 380];
  const max = Math.max(...data);
  const barW = (width - (data.length - 1) * 6) / data.length;
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <svg width={width} height={height + 14} viewBox={`0 0 ${width} ${height + 14}`}>
      <defs>
        <linearGradient id="proBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={T.coral} />
          <stop offset="100%" stopColor="#F4995A" />
        </linearGradient>
      </defs>
      {data.map((v, i) => {
        const h = (v / max) * height;
        const x = i * (barW + 6);
        const y = height - h;
        const isLast = i === data.length - 1;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={barW}
              height={h}
              rx="4"
              fill={isLast ? 'url(#proBar)' : T.coralSoft}
            />
            <text
              x={x + barW / 2}
              y={height + 10}
              textAnchor="middle"
              fontSize="8"
              fontWeight="600"
              fill={isLast ? T.coral : T.textTertiary}
              fontFamily="Inter, sans-serif"
            >
              {days[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function ProScene() {
  return <SlideImage src="/onboarding/pro.png" />;
}

/* Legacy ProScene grid (kept as reference, not rendered) */
function ProSceneLegacy() {
  return (
    <div style={{ position: 'relative', width: 320, height: 300 }}>
      {/* Earnings hero card */}
      <div
        style={{
          background: T.card,
          borderRadius: 20,
          padding: 16,
          boxShadow:
            '0 14px 36px rgba(60,30,15,0.10), 0 2px 8px rgba(60,30,15,0.04)',
          border: `1px solid ${T.divider}`,
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 10,
          animation: 'fy4CardIn 700ms cubic-bezier(0.34, 1.4, 0.64, 1) 100ms both',
        }}
      >
        {/* Decorative corner accent */}
        <div
          style={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 100,
            height: 100,
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(232,93,42,0.12) 0%, transparent 70%)',
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.10em',
              color: T.textTertiary,
              textTransform: 'uppercase',
            }}
          >
            This week
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 10,
              fontWeight: 700,
              color: T.green,
              background: T.greenSoft,
              padding: '3px 8px',
              borderRadius: 999,
            }}
          >
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 15 L12 8 L19 15"
                stroke={T.green}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            +24%
          </span>
        </div>

        {/* Big earnings number */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 6,
            marginBottom: 12,
            position: 'relative',
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: T.textMuted,
            }}
          >
            CHF
          </span>
          <span
            style={{
              fontSize: 30,
              fontWeight: 800,
              color: T.text,
              letterSpacing: '-0.025em',
              lineHeight: 1,
            }}
          >
            850
          </span>
          <span
            style={{
              fontSize: 12,
              color: T.textTertiary,
              fontWeight: 600,
            }}
          >
            / week avg
          </span>
        </div>

        {/* Bars */}
        <div style={{ position: 'relative' }}>
          <EarningsBars width={264} height={48} />
        </div>
      </div>

      {/* Bottom: 3 role chips in a horizontal scroll-style row */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          animation: 'fy4CardIn 700ms cubic-bezier(0.34, 1.4, 0.64, 1) 360ms both',
        }}
      >
        {[
          { label: 'Walker', icon: PawPrint, color: T.coral, bg: T.coralSoft, count: '+12' },
          { label: 'Sitter', icon: Heart, color: T.blue, bg: T.blueSoft, count: '+8' },
          { label: 'Groomer', icon: Scissors, color: T.green, bg: T.greenSoft, count: '+5' },
        ].map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={r.label}
              style={{
                flex: 1,
                background: T.card,
                borderRadius: 14,
                padding: '10px 8px',
                border: `1px solid ${T.divider}`,
                boxShadow: '0 4px 12px rgba(60,30,15,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 9,
                  background: r.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={14} color={r.color} strokeWidth={2.4} />
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: T.text,
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  fontSize: 9.5,
                  fontWeight: 700,
                  color: r.color,
                }}
              >
                {r.count} jobs
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust line */}
      <div
        style={{
          marginTop: 10,
          textAlign: 'center',
          fontSize: 10.5,
          color: T.textTertiary,
          fontWeight: 600,
          animation: 'fy4CardIn 700ms cubic-bezier(0.34, 1.4, 0.64, 1) 540ms both',
        }}
      >
        Join 2,400+ pros already earning with Fylos
      </div>
    </div>
  );
}

const SCENES = {
  welcome: WelcomeScene,
  pets: PetsScene,
  health: HealthScene,
  services: ServicesScene,
  pro: ProScene,
};

/* ════════════════════════════════════════════════════════════════════
   Splash intro — plays once on mount, then fades to reveal slide 1
   Same animation as /splash-variants Variant A (dot expands to coral fill)
   ════════════════════════════════════════════════════════════════════ */

function SplashIntroOverlay() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: T.bg,
        zIndex: 100,
        overflow: 'hidden',
        animation: 'fy4SplashOverlay 2.6s ease-out forwards',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          fontFamily: '"Nunito", sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 56 * 0.15,
          }}
        >
          <span
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: T.text,
              letterSpacing: '-0.5px',
              lineHeight: 1,
              animation: 'fy4SplashTextFade 2.6s ease-out forwards',
            }}
          >
            FYLOS
          </span>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: T.coral,
              transformOrigin: 'center',
              animation:
                'fy4SplashDotGrow 2.6s cubic-bezier(0.65, 0, 0.35, 1) forwards',
            }}
          />
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: T.coral,
            letterSpacing: '0.02em',
            fontFamily: 'Inter, -apple-system, sans-serif',
            animation: 'fy4SplashTextFade 2.6s ease-out forwards',
          }}
        >
          A calmer way to care.
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════ */

export default function OnboardingV4() {
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSplashDone(true), 2700);
    return () => clearTimeout(t);
  }, []);

  const slide = SLIDES[slideIndex];
  const SceneComponent = SCENES[slide.id];
  const isLast = slideIndex === SLIDES.length - 1;
  const isFirst = slideIndex === 0;

  const next = () => {
    if (isLast) {
      navigate('/create-account');
      return;
    }
    setSlideIndex((i) => i + 1);
  };
  const prev = () => setSlideIndex((i) => Math.max(0, i - 1));

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased">
      {/* iPhone 14/15 Pro frame — matches the rest of the app */}
      <div
        className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200"
        style={{
          background: T.bg,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

      <style>{`
        /* Mascot animation keyframes — reused from AddPetMascot canonical set
           (copied from 06_PETS_ProfileShell_Documents_v1:9256-9271) */
        @keyframes ap-mascotEntry {
          0% { opacity: 0; transform: scale(0.6) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ap-glowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes ap-sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes ap-confetti {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-5px) rotate(180deg); opacity: 0.8; }
        }
        @keyframes ap-thinkingDots {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
        @keyframes ap-browRaise {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        /* v4-specific */
        @keyframes fy4CardIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fy4MascotPeek {
          0%   { opacity: 0; transform: scale(0.6) translateY(-8px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fy4SceneFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        /* Welcome mascot — layered idle animations */
        @keyframes welcomeMascotBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }
        @keyframes welcomeMascotWiggle {
          0%, 38%, 58%, 100% { transform: rotate(0deg); }
          44% { transform: rotate(-4deg); }
          52% { transform: rotate(4deg); }
        }
        @keyframes welcomeMascotTap {
          0%   { transform: scale(1) rotate(0deg); }
          30%  { transform: scale(1.12) rotate(-8deg); }
          60%  { transform: scale(1.08) rotate(8deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        /* Calm illustration — gentle float for the sleeping pet scene */
        @keyframes fy4CalmFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        /* Quiet Pages — pet entry stamps onto the page */
        @keyframes fy4QuietPetIn {
          0%   { opacity: 0; transform: translateY(8px) rotate(-2deg) scale(0.94); }
          60%  { opacity: 1; transform: translateY(0) rotate(0.5deg) scale(1.02); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
        @keyframes welcomePawDrift {
          0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(-8deg); opacity: 0.18; }
          50%      { transform: translate(-50%, -50%) translateY(-8px) rotate(8deg); opacity: 0.42; }
        }
        /* Splash intro — overlay fade timing */
        @keyframes fy4SplashOverlay {
          0%, 72% { opacity: 1; }
          95%, 100% { opacity: 0; }
        }
        @keyframes fy4SplashTextFade {
          0%, 18% { opacity: 1; }
          38%, 100% { opacity: 0; }
        }
        @keyframes fy4SplashDotGrow {
          0%, 20% { transform: scale(1); }
          55%, 100% { transform: scale(80); }
        }
      `}</style>

      {/* Splash intro overlay (plays once on mount) */}
      {!splashDone && <SplashIntroOverlay />}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 16px 8px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {!isFirst ? (
          <button
            onClick={prev}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: T.coralSoft,
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Back"
          >
            <ChevronLeft size={18} color={T.coralDark} />
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}
        {!isFirst && (
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13.5,
              fontWeight: 500,
              color: T.textTertiary,
              padding: '8px 4px',
            }}
          >
            Skip
          </button>
        )}
      </div>

      {/* Scene */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 24px 4px',
          minHeight: 0,
        }}
      >
        <div
          key={`scene-${slide.id}`}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: slide.id === 'welcome' ? 0 : 12,
            minHeight: slide.id === 'welcome' ? 320 : 320,
            animation: 'fy4SceneFade 500ms cubic-bezier(0.2, 0.7, 0.2, 1)',
          }}
        >
          <SceneComponent />
        </div>

        {/* Copy block (welcome handled inside scene; others below) */}
        {slide.id !== 'welcome' && (
          <div
            key={`copy-${slide.id}`}
            style={{
              textAlign: 'center',
              maxWidth: 320,
              transform: 'translateY(-20px)',
              animation: 'fy4SceneFade 520ms cubic-bezier(0.2, 0.7, 0.2, 1) 260ms both',
            }}
          >
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
          </div>
        )}
      </div>

      {/* Dots + CTA */}
      <div
        style={{
          padding: '12px 24px 24px',
          position: 'relative',
          zIndex: 5,
        }}
      >
        {/* Progress — active slide shows as a dot, others as short dashes */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 22,
            height: 8,
          }}
        >
          {SLIDES.map((_, i) => {
            const isActive = i === slideIndex;
            return (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: isActive ? 6 : 14,
                  height: isActive ? 6 : 2,
                  borderRadius: isActive ? '50%' : 1,
                  background: isActive ? T.coral : 'rgba(60,30,15,0.22)',
                  transition: 'all 380ms cubic-bezier(0.34, 1.4, 0.64, 1)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </div>

        {/* CTA — coral pill. Final slide navigates to account creation. */}
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
            fontSize: 15.5,
            background: T.coral,
            boxShadow: '0 6px 18px rgba(232,93,42,0.30)',
            fontFamily: 'inherit',
          }}
        >
          {slide.cta}
          <ArrowRight size={17} strokeWidth={2.4} />
        </button>

        {/* Sign in — only visible on first slide (welcome). After that the
            user has committed to onboarding, so we hide it. */}
        {isFirst && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              fontSize: 12.5,
              color: T.textTertiary,
            }}
          >
            Already have an account?{' '}
            <span
              onClick={() => navigate('/sign-in')}
              style={{ color: T.coral, fontWeight: 700, cursor: 'pointer' }}
            >
              Sign in
            </span>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
