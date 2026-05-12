import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  MapPin,
  Check,
  Star,
  Heart,
  PawPrint,
  Stethoscope,
  Bell,
  Activity,
  TrendingUp,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────
   36_ONBOARDING_v2.jsx — Mascot-led onboarding
   The Fylos mascot is the visual hero on every slide. State morphs
   as the user advances: curious → thoughtful → excited → celebrating.
   ────────────────────────────────────────────────────────────────────── */

const T = {
  coral: '#E85D2A',
  bg: '#F7F5F2',
  card: '#FFFFFF',
  text: '#111111',
  textMuted: '#6E6058',
  textTertiary: '#A09A94',
  divider: '#E5E5E5',
};

/* ────────────────────────────────────────────────────────────────────
   Fylos mascot v2 — dimensional, kawaii-cute
   Radial gradients for depth · big anime-style eyes with multi highlight
   Glossy nose · saturated cheeks · drop-shadow grounding
   ──────────────────────────────────────────────────────────────────── */
function OnboardingMascot({ state = 'curious', size = 140 }) {
  const isCurious = state === 'curious';
  const isThoughtful = state === 'thoughtful';
  const isExcited = state === 'excited';
  const isCelebrating = state === 'celebrating';

  const headTilt = isCurious ? 6 : isCelebrating ? -4 : isThoughtful ? 3 : 0;
  const earPerk = isExcited || isCelebrating;
  const pupilDx = isThoughtful ? -0.7 : isCurious ? 0.7 : 0;
  const pupilDy = isThoughtful ? 0.7 : 0;

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Soft halo glow behind mascot */}
      <div
        style={{
          position: 'absolute',
          inset: -10,
          borderRadius: '50%',
          background: isCelebrating
            ? 'radial-gradient(circle, rgba(255,215,0,0.20) 0%, rgba(232,93,42,0.10) 50%, transparent 72%)'
            : 'radial-gradient(circle, rgba(232,93,42,0.16) 0%, rgba(232,93,42,0.05) 50%, transparent 72%)',
          animation: 'onb2-glowPulse 3.2s ease-in-out infinite',
          transition: 'background 600ms ease',
        }}
      />

      <svg
        width={size * 0.78}
        height={size * 0.78}
        viewBox="0 0 80 80"
        fill="none"
        style={{
          position: 'relative',
          zIndex: 1,
          transform: `rotate(${headTilt}deg)`,
          transition: 'transform 500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: 'drop-shadow(0 4px 6px rgba(60,30,15,0.18))',
        }}
      >
        <defs>
          <radialGradient id="headG" cx="38%" cy="32%" r="60%">
            <stop offset="0%" stopColor="#FBB07A" />
            <stop offset="55%" stopColor="#EB8A4C" />
            <stop offset="100%" stopColor="#B85A26" />
          </radialGradient>
          <radialGradient id="earOuterG" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#D87B40" />
            <stop offset="100%" stopColor="#9A4A1E" />
          </radialGradient>
          <radialGradient id="earInnerG" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFC8A2" />
            <stop offset="100%" stopColor="#D88A60" />
          </radialGradient>
          <radialGradient id="muzzleG" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFE2C6" />
            <stop offset="100%" stopColor="#E0AC85" />
          </radialGradient>
          <radialGradient id="pupilG" cx="35%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#6E4528" />
            <stop offset="60%" stopColor="#3D2515" />
            <stop offset="100%" stopColor="#1F1009" />
          </radialGradient>
          <radialGradient id="noseG" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#5A3A22" />
            <stop offset="100%" stopColor="#1A0E07" />
          </radialGradient>
          <radialGradient id="cheekG" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FF9B8C" />
            <stop offset="100%" stopColor="#FF9B8C" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="collarG" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF7B45" />
            <stop offset="100%" stopColor="#C84818" />
          </linearGradient>
          <radialGradient id="tagG" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFEC86" />
            <stop offset="60%" stopColor="#F4C13D" />
            <stop offset="100%" stopColor="#B68A20" />
          </radialGradient>
        </defs>

        {/* Outer ears */}
        <ellipse
          cx="20"
          cy="22"
          rx="10.5"
          ry="15"
          fill="url(#earOuterG)"
          style={{
            transform: `rotate(${earPerk ? '-23deg' : '-14deg'})`,
            transformOrigin: '20px 30px',
            transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        <ellipse
          cx="60"
          cy="22"
          rx="10.5"
          ry="15"
          fill="url(#earOuterG)"
          style={{
            transform: `rotate(${earPerk ? '23deg' : '14deg'})`,
            transformOrigin: '60px 30px',
            transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
        {/* Inner ears */}
        <ellipse cx="20" cy="22" rx="5.5" ry="9.5" fill="url(#earInnerG)"
          style={{ transform: `rotate(${earPerk ? '-23deg' : '-14deg'})`, transformOrigin: '20px 30px', transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
        <ellipse cx="60" cy="22" rx="5.5" ry="9.5" fill="url(#earInnerG)"
          style={{ transform: `rotate(${earPerk ? '23deg' : '14deg'})`, transformOrigin: '60px 30px', transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />

        {/* Head (round) */}
        <circle cx="40" cy="38" r="25" fill="url(#headG)" />
        {/* Top highlight on head — gives sphere feel */}
        <ellipse cx="32" cy="22" rx="11" ry="6" fill="rgba(255,255,255,0.20)" />
        <ellipse cx="48" cy="20" rx="4" ry="2.5" fill="rgba(255,255,255,0.12)" />

        {/* Muzzle */}
        <ellipse cx="40" cy="44" rx="15" ry="12.5" fill="url(#muzzleG)" />
        {/* Muzzle subtle bottom shadow */}
        <ellipse cx="40" cy="50" rx="13" ry="4" fill="rgba(180,90,50,0.10)" />

        {/* Cheeks — saturated, peeking */}
        <ellipse
          cx="22"
          cy="43"
          rx="5.5"
          ry="3"
          fill="url(#cheekG)"
          opacity={isCelebrating ? 0.9 : isExcited ? 0.75 : isThoughtful ? 0.45 : 0.55}
          style={{ transition: 'opacity 400ms ease' }}
        />
        <ellipse
          cx="58"
          cy="43"
          rx="5.5"
          ry="3"
          fill="url(#cheekG)"
          opacity={isCelebrating ? 0.9 : isExcited ? 0.75 : isThoughtful ? 0.45 : 0.55}
          style={{ transition: 'opacity 400ms ease' }}
        />

        {/* Eyes — big kawaii style */}
        {isCelebrating ? (
          <>
            {/* Closed happy arcs */}
            <path d="M25 35 Q30 30 35 35" stroke="#2A1408" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M45 35 Q50 30 55 35" stroke="#2A1408" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            {/* Sparkles */}
            <g style={{ animation: 'onb2-sparkle 1.5s ease-in-out infinite' }}>
              <path d="M14 20 L16 22 L14 24 L12 22 Z" fill="#FFD700" />
            </g>
            <g style={{ animation: 'onb2-sparkle 1.5s 0.4s ease-in-out infinite' }}>
              <path d="M66 20 L68 22 L66 24 L64 22 Z" fill="#FFD700" />
            </g>
            <g style={{ animation: 'onb2-sparkle 1.5s 0.8s ease-in-out infinite' }}>
              <path d="M40 8 L42 10 L40 12 L38 10 Z" fill="#FFD700" />
            </g>
            {/* Confetti */}
            <circle cx="10" cy="32" r="1.8" fill="#FF7240" opacity="0.7" style={{ animation: 'onb2-confetti 2s ease-in-out infinite' }} />
            <circle cx="70" cy="28" r="1.8" fill="#34C759" opacity="0.7" style={{ animation: 'onb2-confetti 2s 0.3s ease-in-out infinite' }} />
            <circle cx="6" cy="42" r="1.4" fill="#FFD700" opacity="0.6" style={{ animation: 'onb2-confetti 2s 0.6s ease-in-out infinite' }} />
            <circle cx="74" cy="40" r="1.2" fill="#5AC8FA" opacity="0.6" style={{ animation: 'onb2-confetti 2s 0.9s ease-in-out infinite' }} />
          </>
        ) : (
          <>
            {/* Eye whites (large) */}
            <circle cx="30" cy="35" r="6" fill="#FFFFFF" />
            <circle cx="50" cy="35" r="6" fill="#FFFFFF" />
            {/* Pupils with radial gradient (round depth) */}
            <circle cx={30 + pupilDx} cy={35 + pupilDy} r="4" fill="url(#pupilG)" style={{ transition: 'all 300ms ease' }} />
            <circle cx={50 + pupilDx} cy={35 + pupilDy} r="4" fill="url(#pupilG)" style={{ transition: 'all 300ms ease' }} />
            {/* Big primary highlight (top-left) */}
            <circle cx={29 + pupilDx * 0.5} cy={33 + pupilDy * 0.5} r="1.6" fill="#FFFFFF" />
            <circle cx={49 + pupilDx * 0.5} cy={33 + pupilDy * 0.5} r="1.6" fill="#FFFFFF" />
            {/* Small secondary highlight (bottom-right) */}
            <circle cx={31.5 + pupilDx * 0.3} cy={37 + pupilDy * 0.3} r="0.7" fill="#FFFFFF" opacity="0.75" />
            <circle cx={51.5 + pupilDx * 0.3} cy={37 + pupilDy * 0.3} r="0.7" fill="#FFFFFF" opacity="0.75" />
            {/* Brows */}
            {isCurious && (
              <>
                <path d="M26 27.5 Q30 25.5 34 27.5" stroke="#2A1408" strokeWidth="1.4" fill="none" strokeLinecap="round"
                  style={{ animation: 'onb2-browRaise 3s ease-in-out infinite' }} />
                <path d="M46 27.5 Q50 25.5 54 27.5" stroke="#2A1408" strokeWidth="1.4" fill="none" strokeLinecap="round"
                  style={{ animation: 'onb2-browRaise 3s ease-in-out infinite' }} />
              </>
            )}
            {/* Thinking bubble dots */}
            {isThoughtful && (
              <g style={{ animation: 'onb2-thinkingDots 2s ease-in-out infinite' }}>
                <circle cx="60" cy="22" r="2.2" fill="#E8854A" opacity="0.5" />
                <circle cx="65" cy="16" r="2.6" fill="#E8854A" opacity="0.4" />
                <circle cx="69" cy="9" r="3" fill="#E8854A" opacity="0.3" />
              </g>
            )}
          </>
        )}

        {/* Nose with shine */}
        <ellipse cx="40" cy="42" rx="3.8" ry="2.8" fill="url(#noseG)" />
        <ellipse cx="38.7" cy="40.8" rx="1.3" ry="0.8" fill="#FFFFFF" opacity="0.55" />
        <ellipse cx="40" cy="43.2" rx="0.6" ry="0.35" fill="#FFFFFF" opacity="0.25" />

        {/* Mouth */}
        <path
          d={
            isCelebrating ? 'M33 47 Q40 54 47 47' :
            isExcited ? 'M34 47 Q40 51.5 46 47' :
            isThoughtful ? 'M36 48 Q40 49 44 48' :
            'M35 47 Q40 49.5 45 47'
          }
          stroke="#9A4A1E"
          strokeWidth={isCelebrating ? 1.6 : 1.3}
          fill="none"
          strokeLinecap="round"
          style={{ transition: 'all 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />

        {/* Tongue */}
        <ellipse
          cx="40"
          cy={isCelebrating ? 51 : isExcited ? 49.5 : 49}
          rx={isCelebrating ? 3 : isExcited ? 2.4 : 0}
          ry={(isExcited || isCelebrating) ? 2.6 : 0}
          fill="#F2768A"
          opacity={0.85}
          style={{ transition: 'all 350ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
        {/* Tongue highlight */}
        {(isExcited || isCelebrating) && (
          <ellipse
            cx="39"
            cy={isCelebrating ? 50 : 48.6}
            rx={isCelebrating ? 1 : 0.8}
            ry={isCelebrating ? 0.5 : 0.4}
            fill="#FFFFFF"
            opacity="0.4"
          />
        )}

        {/* Collar with gradient */}
        <path d="M19 58 Q40 64 61 58" stroke="url(#collarG)" strokeWidth="3.4" fill="none" strokeLinecap="round" />
        {/* Tag with gloss */}
        <circle cx="40" cy="61" r="3" fill="url(#tagG)" />
        <ellipse cx="39.2" cy="60" rx="1.3" ry="0.7" fill="#FFFFFF" opacity="0.55" />
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   LivePreview — mini app UI per slide with animated actions.
   The preview re-mounts on slide change (key={slideId}) so animations
   replay each time the user lands on a slide.
   ──────────────────────────────────────────────────────────────────── */
function LivePreview({ slideId }) {
  if (slideId === 'meet') {
    return (
      <div
        style={{
          width: 280,
          background: T.card,
          borderRadius: 18,
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 4px 18px rgba(60,40,25,0.06)',
          padding: 14,
          fontFamily: 'inherit',
        }}
      >
        {/* Greeting row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
            animation: 'onb2-fadeUp 380ms ease-out both',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD7BD 0%, #E85D2A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: 12,
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: T.text, lineHeight: 1.1 }}>
              Evening, Anna.
            </div>
            <div style={{ fontSize: 10.5, color: T.textTertiary }}>Bobby is napping</div>
          </div>
        </div>
        {/* Three stat tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {[
            { icon: Activity, label: 'Walks', value: '12', delay: 0.15 },
            { icon: Stethoscope, label: 'Meds', value: 'OK', delay: 0.30 },
            { icon: TrendingUp, label: 'Weight', value: '28kg', delay: 0.45 },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                style={{
                  background: '#FAF6F0',
                  borderRadius: 10,
                  padding: '8px 6px',
                  textAlign: 'center',
                  animation: `onb2-statPop 420ms ${s.delay}s cubic-bezier(0.34, 1.4, 0.64, 1) both`,
                }}
              >
                <Icon size={12} color={T.coral} strokeWidth={2.4} style={{ marginBottom: 4 }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: T.text, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 9, color: T.textTertiary, marginTop: 2 }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (slideId === 'remember') {
    return (
      <div
        style={{
          width: 280,
          background: T.card,
          borderRadius: 18,
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 4px 18px rgba(60,40,25,0.06)',
          padding: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 10.5, fontWeight: 700, color: T.textTertiary, letterSpacing: '0.08em' }}>
            TODAY · 2 LEFT
          </span>
          <Bell size={12} color={T.coral} strokeWidth={2.2} />
        </div>
        {[
          { label: 'Morning meds · Apoquel', delay: 0.1 },
          { label: 'Afternoon walk · 14:00', delay: 0.6 },
          { label: 'Weight check · weekly', delay: 1.1 },
        ].map((t, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 0',
              borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.05)',
              animation: `onb2-checkSlide 420ms ${t.delay}s cubic-bezier(0.34, 1.2, 0.64, 1) both`,
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                background: T.coral,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                animation: `onb2-checkPop 280ms ${t.delay + 0.25}s cubic-bezier(0.34, 1.6, 0.64, 1) both`,
              }}
            >
              <Check size={11} color="#FFFFFF" strokeWidth={3} />
            </span>
            <span style={{ fontSize: 12, color: T.text, fontWeight: 500 }}>{t.label}</span>
          </div>
        ))}
      </div>
    );
  }

  if (slideId === 'connect') {
    const walkers = [
      { name: 'Lukas F.', rating: '4.9', tag: 'Walker', delay: 0.1 },
      { name: 'Maria S.', rating: '4.8', tag: 'Sitter', delay: 0.45 },
    ];
    return (
      <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {walkers.map((w) => (
          <div
            key={w.name}
            style={{
              background: T.card,
              borderRadius: 14,
              border: '1px solid rgba(0,0,0,0.05)',
              boxShadow: '0 2px 10px rgba(60,40,25,0.05)',
              padding: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              animation: `onb2-slideInRight 420ms ${w.delay}s cubic-bezier(0.34, 1.2, 0.64, 1) both`,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FFD7BD 0%, #E85D2A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: 12,
                flexShrink: 0,
              }}
            >
              {w.name.charAt(0)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: T.text }}>{w.name}</span>
                <Star size={9} fill={T.coral} color={T.coral} />
                <span style={{ fontSize: 10.5, fontWeight: 600, color: T.text }}>{w.rating}</span>
              </div>
              <span
                style={{
                  display: 'inline-block',
                  marginTop: 3,
                  fontSize: 9.5,
                  fontWeight: 600,
                  padding: '1px 7px',
                  borderRadius: 999,
                  background: '#FFEDE3',
                  color: '#B25030',
                }}
              >
                {w.tag}
              </span>
            </div>
            <div
              style={{
                fontSize: 9.5,
                fontWeight: 700,
                padding: '3px 7px',
                borderRadius: 999,
                background: '#EEF7F1',
                color: '#3F8D63',
                animation: `onb2-fadeIn 320ms ${w.delay + 0.4}s ease-out both`,
              }}
            >
              ● Free today
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (slideId === 'together') {
    const friends = [
      { color: '#E85D2A', delay: 0.1 },
      { color: '#3F8D63', delay: 0.25 },
      { color: '#7C6AF7', delay: 0.4 },
      { color: '#FFB020', delay: 0.55 },
    ];
    return (
      <div
        style={{
          width: 280,
          background: T.card,
          borderRadius: 18,
          border: '1px solid rgba(0,0,0,0.05)',
          boxShadow: '0 4px 18px rgba(60,40,25,0.06)',
          padding: 14,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
            height: 36,
          }}
        >
          {friends.map((f, i) => (
            <div
              key={i}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: f.color,
                border: '2px solid #FFFFFF',
                marginLeft: i === 0 ? 0 : -12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: friends.length - i,
                animation: `onb2-stackIn 380ms ${f.delay}s cubic-bezier(0.34, 1.4, 0.64, 1) both`,
              }}
            >
              <PawPrint size={14} color="#FFFFFF" strokeWidth={2.4} />
            </div>
          ))}
          <div
            style={{
              marginLeft: -12,
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#F4EEE5',
              border: '2px solid #FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
              color: T.textMuted,
              animation: `onb2-stackIn 380ms 0.72s cubic-bezier(0.34, 1.4, 0.64, 1) both`,
            }}
          >
            +12
          </div>
        </div>
        <div
          style={{
            fontSize: 12.5,
            fontWeight: 700,
            color: T.text,
            animation: 'onb2-fadeUp 420ms 0.85s ease-out both',
          }}
        >
          Playdate at Seefeld
        </div>
        <div
          style={{
            fontSize: 10.5,
            color: T.textTertiary,
            marginTop: 3,
            animation: 'onb2-fadeUp 420ms 0.95s ease-out both',
          }}
        >
          Sunday · 14:00 · 4 paws coming
        </div>
      </div>
    );
  }

  return null;
}

/* ────────────────────────────────────────────────────────────────────
   Slide content — copy + mascot state per slide
   ──────────────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 'meet',
    mascot: 'curious',
    eyebrow: 'Meet Fylos',
    title: "Your pet's calm companion",
    body: 'A quiet helper that keeps your pet\'s life organized — without alarms, streaks, or pressure.',
  },
  {
    id: 'remember',
    mascot: 'thoughtful',
    eyebrow: 'Daily care',
    title: 'I\'ll remember the small things',
    body: 'Walks, meds, weight, vet visits — quietly tracked so nothing slips through the cracks.',
  },
  {
    id: 'connect',
    mascot: 'excited',
    eyebrow: 'When you need help',
    title: 'Find the right people nearby',
    body: 'Walkers, sitters, groomers and vets — trusted, reviewed, and matched to your Fylos.',
  },
  {
    id: 'together',
    mascot: 'celebrating',
    eyebrow: 'You\'re not alone',
    title: 'A pack of pet parents like you',
    body: 'Share moments, find friends for playdates — at your pace. No feeds shouting for attention.',
  },
];

/* ────────────────────────────────────────────────────────────────────
   Onboarding flow
   ──────────────────────────────────────────────────────────────────── */
export default function OnboardingV2() {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStart = useRef(null);

  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;

  const goTo = (next) => {
    if (next < 0 || next >= SLIDES.length || next === idx) return;
    setDirection(next > idx ? 1 : -1);
    setIdx(next);
  };

  const handleNext = () => {
    if (isLast) {
      window.location.href = '/create-account';
      return;
    }
    goTo(idx + 1);
  };

  const handleSkip = () => {
    window.location.href = '/create-account';
  };

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(idx + 1);
      else goTo(idx - 1);
    }
    touchStart.current = null;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <style>{`
        @keyframes onb2-glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.08); opacity: 1; }
        }
        @keyframes onb2-sparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes onb2-confetti {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-12px) translateX(4px); opacity: 0; }
        }
        @keyframes onb2-browRaise {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1px); }
        }
        @keyframes onb2-thinkingDots {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-2px); }
        }
        @keyframes onb2-slideInRight {
          from { transform: translateX(24px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes onb2-slideInLeft {
          from { transform: translateX(-24px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes onb2-fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes onb2-fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes onb2-statPop {
          0% { opacity: 0; transform: scale(0.85); }
          60% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes onb2-checkSlide {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes onb2-checkPop {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes onb2-stackIn {
          from { opacity: 0; transform: translateX(20px) scale(0.7); }
          to { opacity: 1; transform: translateX(0) scale(1); }
        }
      `}</style>

      {/* Top bar — back (when not first) + skip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px 8px',
        }}
      >
        {idx > 0 ? (
          <button
            onClick={() => goTo(idx - 1)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: T.card,
              border: '1px solid rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
            }}
            aria-label="Back"
          >
            <ChevronLeft size={18} color={T.text} strokeWidth={2.2} />
          </button>
        ) : (
          <div style={{ width: 36, height: 36 }} />
        )}
        {!isLast && (
          <button
            onClick={handleSkip}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '8px 4px',
              fontSize: 14,
              fontWeight: 500,
              color: T.textTertiary,
              cursor: 'pointer',
            }}
          >
            Skip
          </button>
        )}
      </div>

      {/* Content — mascot + copy */}
      <div
        key={slide.id}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px 32px 40px',
          animation: `${direction > 0 ? 'onb2-slideInRight' : 'onb2-slideInLeft'} 420ms cubic-bezier(0.34, 1.2, 0.64, 1) both`,
        }}
      >
        {/* Mascot — smaller to leave room for live preview */}
        <div style={{ marginBottom: 18 }}>
          <OnboardingMascot state={slide.mascot} size={110} />
        </div>

        {/* Live preview — mini app UI with animated actions */}
        <div style={{ marginBottom: 28 }}>
          <LivePreview slideId={slide.id} />
        </div>

        {/* Eyebrow */}
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: T.coral,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
            marginBottom: 10,
          }}
        >
          {slide.eyebrow}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: T.text,
            letterSpacing: '-0.025em',
            lineHeight: 1.15,
            textAlign: 'center',
            margin: 0,
            marginBottom: 14,
            maxWidth: 320,
          }}
        >
          {slide.title}
        </h1>

        {/* Body */}
        <p
          style={{
            fontSize: 15,
            color: T.textMuted,
            lineHeight: 1.55,
            textAlign: 'center',
            maxWidth: 320,
            margin: 0,
          }}
        >
          {slide.body}
        </p>
      </div>

      {/* Bottom — dots + CTA + sign in */}
      <div style={{ padding: '12px 24px 28px' }}>
        {/* Dots */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 24,
          }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                border: 'none',
                padding: 0,
                background: 'transparent',
                cursor: 'pointer',
                height: 8,
                width: i === idx ? 28 : 8,
                borderRadius: 999,
                backgroundColor: i === idx ? T.coral : 'rgba(0,0,0,0.10)',
                transition: 'all 320ms cubic-bezier(0.34, 1.2, 0.64, 1)',
              }}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            height: 54,
            background: T.text,
            color: '#FFFFFF',
            border: 'none',
            borderRadius: 16,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.10)',
            transition: 'transform 120ms ease',
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {isLast ? "Let's start" : 'Continue'}
          <ArrowRight size={18} strokeWidth={2.2} />
        </button>

        {/* Sign in */}
        {!isLast && (
          <div
            style={{
              textAlign: 'center',
              marginTop: 16,
              fontSize: 13,
              color: T.textTertiary,
            }}
          >
            Already have an account?{' '}
            <a
              href="/create-account"
              style={{
                color: T.coral,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Sign in
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
