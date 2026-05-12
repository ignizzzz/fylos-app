import React, { useState } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  MapPin,
  Check,
  Star,
  Activity,
  Stethoscope,
  TrendingUp,
  Bell,
  PawPrint,
  Users,
  Heart,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────
   ONBOARDING_DIRECTIONS_v1.jsx
   Compare 3 directions for the onboarding hero visual.
   Copy stays the same — only the hero changes.

     A · Mascot-balanced  → flat modern mascot, only slides 1 & 4
     B · Editorial        → line-art illustration per slide, no mascot
     C · App-as-hero      → clean UI mockup per slide, no mascot

   ────────────────────────────────────────────────────────────────────── */

const T = {
  coral: '#E85D2A',
  coralDark: '#B85A26',
  coralSoft: '#FFEDE3',
  bg: '#F7F5F2',
  card: '#FFFFFF',
  text: '#111111',
  textMuted: '#6E6058',
  textTertiary: '#A09A94',
  divider: '#E5E5E5',
  peach: '#FBB07A',
  warm: '#EB8A4C',
};

const SLIDES = [
  {
    id: 'meet',
    eyebrow: 'Meet Fylos',
    title: "Your pet's calm companion",
    body: "A quiet helper that keeps your pet's life organized — without alarms, streaks, or pressure.",
  },
  {
    id: 'remember',
    eyebrow: 'Daily care',
    title: "I'll remember the small things",
    body: 'Walks, meds, weight, vet visits — quietly tracked so nothing slips through the cracks.',
  },
  {
    id: 'connect',
    eyebrow: 'When you need help',
    title: 'Find the right people nearby',
    body: 'Walkers, sitters, groomers and vets — trusted, reviewed, and matched to your Fylos.',
  },
  {
    id: 'together',
    eyebrow: "You're not alone",
    title: 'A pack of pet parents like you',
    body: 'Share moments, find friends for playdates — at your pace. No feeds shouting for attention.',
  },
];

/* ════════════════════════════════════════════════════════════════════
   VARIANT A — Flat modern mascot (only slides 1 & 4)
   ════════════════════════════════════════════════════════════════════ */

function FlatMascotA({ celebrating = false }) {
  return (
    <div
      style={{
        position: 'relative',
        width: 160,
        height: 160,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Soft single-tone halo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,93,42,0.10) 0%, transparent 70%)',
        }}
      />
      <svg width="130" height="130" viewBox="0 0 100 100" fill="none">
        {/* Ears — flat triangles, no gradient */}
        <path d="M22 32 L30 14 L40 32 Z" fill={T.coralDark} />
        <path d="M78 32 L70 14 L60 32 Z" fill={T.coralDark} />
        <path d="M27 30 L31 20 L36 30 Z" fill={T.coralSoft} />
        <path d="M73 30 L69 20 L64 30 Z" fill={T.coralSoft} />

        {/* Head — single flat fill */}
        <circle cx="50" cy="52" r="30" fill={T.warm} />

        {/* Muzzle — slightly lighter flat ellipse */}
        <ellipse cx="50" cy="62" rx="16" ry="13" fill={T.peach} />

        {/* Eyes — when celebrating, arc/closed; otherwise simple dots */}
        {celebrating ? (
          <>
            <path
              d="M38 50 Q42 46 46 50"
              stroke="#1A0F0A"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M54 50 Q58 46 62 50"
              stroke="#1A0F0A"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            <circle cx="42" cy="50" r="2.6" fill="#1A0F0A" />
            <circle cx="58" cy="50" r="2.6" fill="#1A0F0A" />
          </>
        )}

        {/* Nose — small flat triangle */}
        <ellipse cx="50" cy="60" rx="2.8" ry="2.2" fill="#1A0F0A" />

        {/* Mouth — single curve */}
        <path
          d="M46 66 Q50 70 54 66"
          stroke="#1A0F0A"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Sparkles only when celebrating */}
        {celebrating && (
          <>
            <circle cx="20" cy="28" r="1.6" fill={T.coral} />
            <circle cx="84" cy="36" r="1.4" fill={T.coral} />
            <circle cx="12" cy="56" r="1.2" fill={T.coral} />
            <circle cx="88" cy="62" r="1.6" fill={T.coral} />
          </>
        )}
      </svg>
    </div>
  );
}

function MockupTasksA() {
  return (
    <div
      style={{
        width: 280,
        background: T.card,
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        border: `1px solid ${T.divider}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10.5px] font-bold uppercase tracking-[0.08em]"
          style={{ color: T.textTertiary }}
        >
          Today · 2 left
        </span>
        <Bell size={14} style={{ color: T.coral }} />
      </div>
      <div className="space-y-2.5">
        {[
          { label: 'Morning meds · Apoquel', done: true },
          { label: 'Afternoon walk · 14:00', done: true },
          { label: 'Weight check · weekly', done: false },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{ background: t.done ? T.coral : 'transparent', border: t.done ? 'none' : `1.5px solid ${T.divider}` }}
            >
              {t.done && <Check size={12} color="#FFF" strokeWidth={3} />}
            </div>
            <span className="text-[13px] font-medium" style={{ color: T.text }}>
              {t.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupProvidersA() {
  return (
    <div className="space-y-2" style={{ width: 280 }}>
      {[
        { initial: 'L', name: 'Lukas F.', role: 'Walker', rating: 4.9 },
        { initial: 'M', name: 'Maria S.', role: 'Sitter', rating: 4.8 },
      ].map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-3"
          style={{
            background: T.card,
            borderRadius: 16,
            padding: '12px 14px',
            border: `1px solid ${T.divider}`,
            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[14px]"
            style={{ background: T.coral }}
          >
            {p.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[13px] font-semibold" style={{ color: T.text }}>
                {p.name}
              </span>
              <Star size={10} fill={T.coral} color={T.coral} />
              <span className="text-[11px] font-semibold" style={{ color: T.text }}>
                {p.rating}
              </span>
            </div>
            <span
              className="inline-flex items-center h-[16px] px-1.5 rounded-full text-[9.5px] font-semibold"
              style={{ background: T.coralSoft, color: T.coralDark }}
            >
              {p.role}
            </span>
          </div>
          <span
            className="text-[10.5px] font-semibold inline-flex items-center gap-1"
            style={{ color: '#4D8A62' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4D8A62' }} />
            Free today
          </span>
        </div>
      ))}
    </div>
  );
}

function HeroA({ slideIndex }) {
  if (slideIndex === 0) return <FlatMascotA celebrating={false} />;
  if (slideIndex === 1) return <MockupTasksA />;
  if (slideIndex === 2) return <MockupProvidersA />;
  return <FlatMascotA celebrating />;
}

/* ════════════════════════════════════════════════════════════════════
   VARIANT B — Editorial line-art illustrations
   ════════════════════════════════════════════════════════════════════ */

function HandPawB() {
  return (
    <svg width="190" height="190" viewBox="0 0 190 190" fill="none">
      <defs>
        <radialGradient id="hpGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(232,93,42,0.14)" />
          <stop offset="100%" stopColor="rgba(232,93,42,0)" />
        </radialGradient>
      </defs>
      <circle cx="95" cy="95" r="88" fill="url(#hpGlow)" />

      {/* Big bold paw print */}
      <g transform="translate(95,108)">
        {/* main pad */}
        <ellipse cx="0" cy="14" rx="34" ry="26" fill={T.coral} />
        {/* toe pads */}
        <ellipse cx="-26" cy="-14" rx="11" ry="14" fill={T.coral} transform="rotate(-22 -26 -14)" />
        <ellipse cx="-8" cy="-28" rx="10" ry="14" fill={T.coral} />
        <ellipse cx="10" cy="-28" rx="10" ry="14" fill={T.coral} />
        <ellipse cx="26" cy="-14" rx="11" ry="14" fill={T.coral} transform="rotate(22 26 -14)" />
      </g>

      {/* Heart floating above paw */}
      <g transform="translate(95,52)">
        <path
          d="M0 8 C-6 -4, -18 -4, -18 6 C-18 16, -8 22, 0 28 C8 22, 18 16, 18 6 C18 -4, 6 -4, 0 8 Z"
          fill={T.coralDark}
        />
        {/* heart highlight */}
        <ellipse cx="-8" cy="2" rx="3.5" ry="2" fill="#FFFFFF" opacity="0.55" />
      </g>

      {/* Tiny sparkles */}
      <circle cx="40" cy="50" r="2" fill={T.coral} />
      <circle cx="150" cy="60" r="1.5" fill={T.coral} />
      <circle cx="155" cy="135" r="2" fill={T.coral} opacity="0.6" />
      <circle cx="30" cy="125" r="1.5" fill={T.coral} opacity="0.6" />
    </svg>
  );
}

function CalendarPawB() {
  return (
    <svg width="190" height="190" viewBox="0 0 190 190" fill="none">
      <defs>
        <radialGradient id="cpGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(232,93,42,0.12)" />
          <stop offset="100%" stopColor="rgba(232,93,42,0)" />
        </radialGradient>
      </defs>
      <circle cx="95" cy="95" r="88" fill="url(#cpGlow)" />

      {/* Calendar body — filled with header */}
      <rect x="42" y="44" width="106" height="106" rx="12" fill={T.card} stroke={T.coralDark} strokeWidth="2.4" />
      <rect x="42" y="44" width="106" height="22" rx="12" fill={T.coral} />
      <rect x="42" y="54" width="106" height="12" fill={T.coral} />
      {/* Rings */}
      <rect x="62" y="32" width="5" height="22" rx="2.5" fill={T.coralDark} />
      <rect x="123" y="32" width="5" height="22" rx="2.5" fill={T.coralDark} />

      {/* Date grid — 4x3 */}
      {[0, 1, 2, 3].map((c) =>
        [0, 1, 2].map((r) => {
          const isToday = c === 2 && r === 1;
          return (
            <circle
              key={`${c}-${r}`}
              cx={62 + c * 22}
              cy={84 + r * 20}
              r={isToday ? 3 : 2.4}
              fill={isToday ? T.coral : T.textTertiary}
              opacity={isToday ? 1 : 0.45}
            />
          );
        })
      )}

      {/* Highlight today with paw, bigger */}
      <circle cx="106" cy="104" r="16" fill={T.coralSoft} stroke={T.coral} strokeWidth="2.4" />
      <g transform="translate(106,106) scale(0.7)">
        <ellipse cx="0" cy="6" rx="9" ry="7" fill={T.coral} />
        <circle cx="-8" cy="-4" r="3.2" fill={T.coral} />
        <circle cx="-3" cy="-9" r="3.2" fill={T.coral} />
        <circle cx="3" cy="-9" r="3.2" fill={T.coral} />
        <circle cx="8" cy="-4" r="3.2" fill={T.coral} />
      </g>
    </svg>
  );
}

function MapPinsB() {
  return (
    <svg width="200" height="180" viewBox="0 0 200 180" fill="none">
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(232,93,42,0.12)" />
          <stop offset="100%" stopColor="rgba(232,93,42,0)" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="90" r="88" fill="url(#mapGlow)" />

      {/* Map base — solid soft fill, no opacity tricks */}
      <path
        d="M28 70 Q56 36, 100 50 Q150 38, 172 84 Q176 124, 130 134 Q86 142, 56 128 Q22 110, 28 70 Z"
        fill={T.coralSoft}
        stroke={T.coralDark}
        strokeWidth="2"
      />
      {/* Dotted travel path */}
      <path
        d="M58 92 Q88 78, 116 78 Q140 80, 150 102"
        stroke={T.coralDark}
        strokeWidth="2"
        strokeDasharray="4 4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Pins — saturated, bigger */}
      {[
        { x: 60, y: 84, primary: false },
        { x: 105, y: 64, primary: true },
        { x: 148, y: 96, primary: false },
      ].map((p, i) => (
        <g key={i} transform={`translate(${p.x},${p.y})`}>
          <path
            d="M0 0 C-10 0, -14 8, -14 16 C-14 26, -6 34, 0 44 C6 34, 14 26, 14 16 C14 8, 10 0, 0 0 Z"
            fill={p.primary ? T.coral : T.card}
            stroke={T.coralDark}
            strokeWidth="2.4"
          />
          <circle cx="0" cy="14" r="5" fill={p.primary ? T.card : T.coral} />
        </g>
      ))}
    </svg>
  );
}

function CommunityCirclesB() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
      <defs>
        <radialGradient id="ccGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(232,93,42,0.14)" />
          <stop offset="100%" stopColor="rgba(232,93,42,0)" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#ccGlow)" />

      {/* Overlapping circles — solid colors, bigger, white border separation */}
      {[
        { cx: 72, cy: 78, fill: T.coral, scale: 1.0, z: 5 },
        { cx: 118, cy: 66, fill: '#4D8A62', scale: 0.92, z: 4 },
        { cx: 138, cy: 110, fill: '#6D52C7', scale: 0.98, z: 3 },
        { cx: 100, cy: 138, fill: '#D5A33A', scale: 0.95, z: 2 },
        { cx: 60, cy: 122, fill: '#A8836E', scale: 0.88, z: 1 },
      ]
        .sort((a, b) => a.z - b.z)
        .map((c, i) => (
          <g key={i}>
            <circle
              cx={c.cx}
              cy={c.cy}
              r={32 * c.scale}
              fill="#FFFFFF"
            />
            <circle
              cx={c.cx}
              cy={c.cy}
              r={30 * c.scale}
              fill={c.fill}
            />
            <g transform={`translate(${c.cx},${c.cy + 2}) scale(${0.7 * c.scale})`}>
              <ellipse cx="0" cy="6" rx="9" ry="7" fill="#FFFFFF" />
              <circle cx="-8" cy="-4" r="3" fill="#FFFFFF" />
              <circle cx="-3" cy="-9" r="3" fill="#FFFFFF" />
              <circle cx="3" cy="-9" r="3" fill="#FFFFFF" />
              <circle cx="8" cy="-4" r="3" fill="#FFFFFF" />
            </g>
          </g>
        ))}
    </svg>
  );
}

function HeroB({ slideIndex }) {
  if (slideIndex === 0) return <HandPawB />;
  if (slideIndex === 1) return <CalendarPawB />;
  if (slideIndex === 2) return <MapPinsB />;
  return <CommunityCirclesB />;
}

/* ════════════════════════════════════════════════════════════════════
   VARIANT C — App mockup as hero
   ════════════════════════════════════════════════════════════════════ */

function HeroStatsC() {
  return (
    <div
      style={{
        width: 280,
        background: T.card,
        borderRadius: 18,
        padding: 18,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        border: `1px solid ${T.divider}`,
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[15px]"
          style={{ background: T.coral }}
        >
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold" style={{ color: T.text }}>
            Evening, Anna.
          </div>
          <div className="text-[11.5px]" style={{ color: T.textTertiary }}>
            Bobby is napping
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Activity, value: '12', label: 'Walks' },
          { icon: Stethoscope, value: 'OK', label: 'Meds' },
          { icon: TrendingUp, value: '28kg', label: 'Weight' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="rounded-xl p-2.5 text-center"
              style={{ background: T.coralSoft }}
            >
              <Icon size={14} style={{ color: T.coral }} className="mx-auto mb-1" />
              <div className="text-[14px] font-bold" style={{ color: T.text }}>
                {s.value}
              </div>
              <div className="text-[9.5px]" style={{ color: T.textTertiary }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MockupTasksC() {
  return (
    <div
      style={{
        width: 280,
        background: T.card,
        borderRadius: 18,
        padding: 16,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        border: `1px solid ${T.divider}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10.5px] font-bold uppercase tracking-[0.08em]"
          style={{ color: T.textTertiary }}
        >
          Today · 2 left
        </span>
        <Bell size={14} style={{ color: T.coral }} />
      </div>
      <div className="space-y-2.5">
        {[
          { label: 'Morning meds · Apoquel', done: true },
          { label: 'Afternoon walk · 14:00', done: true },
          { label: 'Weight check · weekly', done: false },
        ].map((t, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: t.done ? T.coral : 'transparent',
                border: t.done ? 'none' : `1.5px solid ${T.divider}`,
              }}
            >
              {t.done && <Check size={12} color="#FFF" strokeWidth={3} />}
            </div>
            <span className="text-[13px] font-medium" style={{ color: T.text }}>
              {t.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MockupProvidersC() {
  return (
    <div className="space-y-2" style={{ width: 280 }}>
      {[
        { initial: 'L', name: 'Lukas F.', role: 'Walker', rating: 4.9 },
        { initial: 'M', name: 'Maria S.', role: 'Sitter', rating: 4.8 },
      ].map((p, i) => (
        <div
          key={i}
          className="flex items-center gap-3"
          style={{
            background: T.card,
            borderRadius: 16,
            padding: '12px 14px',
            border: `1px solid ${T.divider}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-[14px]"
            style={{ background: T.coral }}
          >
            {p.initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[13px] font-semibold" style={{ color: T.text }}>
                {p.name}
              </span>
              <Star size={10} fill={T.coral} color={T.coral} />
              <span className="text-[11px] font-semibold" style={{ color: T.text }}>
                {p.rating}
              </span>
            </div>
            <span
              className="inline-flex items-center h-[16px] px-1.5 rounded-full text-[9.5px] font-semibold"
              style={{ background: T.coralSoft, color: T.coralDark }}
            >
              {p.role}
            </span>
          </div>
          <span
            className="text-[10.5px] font-semibold inline-flex items-center gap-1"
            style={{ color: '#4D8A62' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4D8A62' }} />
            Free today
          </span>
        </div>
      ))}
    </div>
  );
}

function MockupCommunityC() {
  return (
    <div
      style={{
        width: 280,
        background: T.card,
        borderRadius: 18,
        padding: 18,
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        border: `1px solid ${T.divider}`,
        textAlign: 'center',
      }}
    >
      <div className="flex items-center justify-center -space-x-2 mb-3">
        {['#E85D2A', '#4D8A62', '#6D52C7', '#D5A33A'].map((c, i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white border-2 border-white"
            style={{ background: c }}
          >
            <PawPrint size={14} />
          </div>
        ))}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-white text-[11px] font-semibold"
          style={{ background: '#F1EDE8', color: T.textMuted }}
        >
          +12
        </div>
      </div>
      <div className="text-[14px] font-bold mb-0.5" style={{ color: T.text }}>
        Playdate at Seefeld
      </div>
      <div className="text-[11.5px]" style={{ color: T.textTertiary }}>
        Sunday · 14:00 · 4 paws coming
      </div>
    </div>
  );
}

function HeroC({ slideIndex }) {
  if (slideIndex === 0) return <HeroStatsC />;
  if (slideIndex === 1) return <MockupTasksC />;
  if (slideIndex === 2) return <MockupProvidersC />;
  return <MockupCommunityC />;
}

/* ════════════════════════════════════════════════════════════════════
   Phone shell — renders one variant + slide
   ════════════════════════════════════════════════════════════════════ */

function PhonePreview({ variant, slideIndex, onPrev, onNext, canPrev }) {
  const slide = SLIDES[slideIndex];
  const isLast = slideIndex === SLIDES.length - 1;

  return (
    <div
      style={{
        width: 375,
        height: 720,
        background: T.bg,
        borderRadius: 32,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 16px 48px rgba(0,0,0,0.10), 0 4px 16px rgba(0,0,0,0.06)',
        border: `1px solid ${T.divider}`,
      }}
    >
      {/* Sticky header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-2"
        style={{ position: 'relative', zIndex: 2 }}
      >
        {canPrev ? (
          <button
            onClick={onPrev}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: T.card, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
          >
            <ChevronLeft size={18} style={{ color: T.text }} />
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}
        <span
          className="text-[13.5px] font-medium"
          style={{ color: T.textTertiary }}
        >
          Skip
        </span>
      </div>

      {/* Hero area — centered */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6"
        style={{ minHeight: 0 }}
      >
        <div
          key={`hero-${variant}-${slideIndex}`}
          style={{
            animation: 'odirFadeUp 380ms cubic-bezier(0.2, 0.7, 0.2, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {variant === 'A' && <HeroA slideIndex={slideIndex} />}
          {variant === 'B' && <HeroB slideIndex={slideIndex} />}
          {variant === 'C' && <HeroC slideIndex={slideIndex} />}
        </div>

        {/* Copy block */}
        <div className="mt-8 text-center" style={{ maxWidth: 320 }}>
          <div
            className="text-[10.5px] font-bold uppercase mb-2"
            style={{ color: T.coral, letterSpacing: '0.10em' }}
          >
            {slide.eyebrow}
          </div>
          <h1
            className="text-[24px] font-extrabold mb-3"
            style={{ color: T.text, lineHeight: 1.15, letterSpacing: '-0.01em' }}
          >
            {slide.title}
          </h1>
          <p
            className="text-[14px]"
            style={{ color: T.textMuted, lineHeight: 1.5 }}
          >
            {slide.body}
          </p>
        </div>
      </div>

      {/* Dots + CTA */}
      <div className="px-4 pb-5 pt-2">
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === slideIndex ? 22 : 6,
                height: 6,
                borderRadius: 3,
                background: i === slideIndex ? T.coral : T.divider,
                transition: 'all 220ms ease',
              }}
            />
          ))}
        </div>
        <button
          onClick={onNext}
          className="w-full h-12 rounded-full flex items-center justify-center gap-2 text-white font-semibold text-[14.5px]"
          style={{ background: T.text }}
        >
          {isLast ? "Let's start" : 'Continue'}
          <ArrowRight size={16} />
        </button>
        <div
          className="text-center mt-3 text-[12px]"
          style={{ color: T.textTertiary }}
        >
          Already have an account?{' '}
          <span style={{ color: T.coral, fontWeight: 600 }}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Page — variant tabs + phone preview + slide controls
   ════════════════════════════════════════════════════════════════════ */

const VARIANT_META = {
  A: {
    label: 'Mascot-balanced',
    note: 'Flat modern mascot. Appears only on slide 1 (hello) and slide 4 (sign-off). Middle slides show app mockups.',
  },
  B: {
    label: 'Editorial',
    note: 'Line-art illustration per slide. Sophisticated, no character. Hand+paw, calendar, map, community circles.',
  },
  C: {
    label: 'App-as-hero',
    note: 'Clean UI mockup is the hero on every slide. Apple Health vibe — the product is the visual.',
  },
};

export default function OnboardingDirections() {
  const [variant, setVariant] = useState('A');
  const [slideIndex, setSlideIndex] = useState(0);

  const prev = () => setSlideIndex((i) => Math.max(0, i - 1));
  const next = () =>
    setSlideIndex((i) => (i < SLIDES.length - 1 ? i + 1 : 0));

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#EFEDE8',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px 48px',
      }}
    >
      <style>{`
        @keyframes odirFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 18, maxWidth: 460 }}>
        <div
          className="text-[10.5px] font-bold uppercase mb-1.5"
          style={{ color: T.coral, letterSpacing: '0.10em' }}
        >
          Onboarding · Directions
        </div>
        <h1
          className="text-[20px] font-bold"
          style={{ color: T.text, letterSpacing: '-0.01em' }}
        >
          Three takes on the onboarding hero
        </h1>
        <p
          className="text-[13px] mt-1"
          style={{ color: T.textMuted, lineHeight: 1.45 }}
        >
          Same copy, three different visual treatments. Switch tabs to compare.
        </p>
      </div>

      {/* Variant tabs */}
      <div
        className="flex items-center gap-1 p-1 mb-3"
        style={{
          background: T.card,
          borderRadius: 999,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          border: `1px solid ${T.divider}`,
        }}
      >
        {Object.keys(VARIANT_META).map((k) => {
          const isActive = variant === k;
          return (
            <button
              key={k}
              onClick={() => setVariant(k)}
              className="h-9 px-4 rounded-full text-[13px] font-semibold transition-all"
              style={{
                background: isActive ? T.text : 'transparent',
                color: isActive ? '#FFF' : T.textMuted,
              }}
            >
              {k} · {VARIANT_META[k].label}
            </button>
          );
        })}
      </div>

      {/* Variant note */}
      <div
        style={{
          maxWidth: 420,
          textAlign: 'center',
          fontSize: 12.5,
          color: T.textMuted,
          marginBottom: 18,
          lineHeight: 1.45,
        }}
      >
        {VARIANT_META[variant].note}
      </div>

      {/* Phone preview */}
      <PhonePreview
        variant={variant}
        slideIndex={slideIndex}
        onPrev={prev}
        onNext={next}
        canPrev={slideIndex > 0}
      />

      {/* Slide jumper */}
      <div className="mt-5 flex items-center gap-2">
        {SLIDES.map((s, i) => {
          const isActive = i === slideIndex;
          return (
            <button
              key={s.id}
              onClick={() => setSlideIndex(i)}
              className="h-8 px-3 rounded-full text-[12px] font-semibold transition-all"
              style={{
                background: isActive ? T.coral : T.card,
                color: isActive ? '#FFF' : T.textMuted,
                border: isActive ? `1px solid ${T.coral}` : `1px solid ${T.divider}`,
              }}
            >
              {i + 1} · {s.eyebrow}
            </button>
          );
        })}
      </div>
    </div>
  );
}
