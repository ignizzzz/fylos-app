import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  Check,
  Star,
  Activity,
  Stethoscope,
  TrendingUp,
  Bell,
  PawPrint,
} from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────
   ONBOARDING_CONNECTED_v1.jsx
   The mascot lives inside each scene. Same character, different pose
   per slide — she looks at, peeks behind, follows, or stands among the
   actual UI elements of the Fylos MVP.

   Slides map to the MVP launch surfaces:
     1. meet      → welcome  + hero stats peek
     2. remember  → today's tasks (meds, walks, weight)
     3. connect   → provider rail (walkers, sitters)
     4. together  → community + playdate card
   ────────────────────────────────────────────────────────────────────── */

const T = {
  coral: '#E85D2A',
  coralDark: '#B85A26',
  coralSoft: '#FFEDE3',
  coralWarm: '#EB8A4C',
  peach: '#FBB07A',
  bg: '#F7F5F2',
  card: '#FFFFFF',
  text: '#111111',
  textMuted: '#6E6058',
  textTertiary: '#A09A94',
  divider: '#E5E5E5',
  green: '#4D8A62',
  purple: '#6D52C7',
  amber: '#D5A33A',
  taupe: '#A8836E',
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
   Pose-aware Mascot
   Same character, varies head rotation, gaze direction, ear angle,
   mouth shape, and optional sparkles. Designed so the mascot reads
   as the same dog from slide to slide.
   ════════════════════════════════════════════════════════════════════ */

const POSES = {
  // Slide 1 — front, looking gently down-left at hero card
  meet: {
    headTilt: -4,
    pupilDx: -1.2,
    pupilDy: 1.3,
    earLeft: 0,
    earRight: 0,
    mouth: 'smile',
    eyesClosed: false,
    sparkles: false,
  },
  // Slide 2 — looking straight down at the task list (the card is below the mascot)
  remember: {
    headTilt: 2,
    pupilDx: 0.2,
    pupilDy: 2.4,
    earLeft: -8, // ears slightly forward like she's leaning in
    earRight: 8,
    mouth: 'focused',
    eyesClosed: false,
    sparkles: false,
  },
  // Slide 3 — head turned right, eyes scanning to the right
  connect: {
    headTilt: -16,
    pupilDx: 2.6,
    pupilDy: 0.6,
    earLeft: -14, // right ear forward
    earRight: 6,
    mouth: 'small',
    eyesClosed: false,
    sparkles: false,
  },
  // Slide 4 — happy, eyes squinted, looking up among sparkles
  together: {
    headTilt: -3,
    pupilDx: 0,
    pupilDy: -1,
    earLeft: -6,
    earRight: 6,
    mouth: 'big',
    eyesClosed: true,
    sparkles: true,
  },
};

function Mascot({ pose = 'meet', size = 130 }) {
  const p = POSES[pose] || POSES.meet;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Halo glow */}
      <div
        style={{
          position: 'absolute',
          inset: -8,
          borderRadius: '50%',
          background: p.sparkles
            ? 'radial-gradient(circle, rgba(255,210,80,0.22) 0%, rgba(232,93,42,0.10) 50%, transparent 72%)'
            : 'radial-gradient(circle, rgba(232,93,42,0.14) 0%, rgba(232,93,42,0.04) 55%, transparent 75%)',
          transition: 'background 600ms ease',
        }}
      />

      <svg
        width={size * 0.86}
        height={size * 0.86}
        viewBox="0 0 100 100"
        style={{
          transform: `rotate(${p.headTilt}deg)`,
          transition: 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          filter: 'drop-shadow(0 6px 8px rgba(60,30,15,0.16))',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Ears — left */}
        <g
          style={{
            transformOrigin: '30px 24px',
            transform: `rotate(${p.earLeft}deg)`,
            transition: 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <path d="M22 32 L30 12 L40 32 Z" fill={T.coralDark} />
          <path d="M27 30 L31 19 L36 30 Z" fill={T.coralSoft} />
        </g>
        {/* Ears — right */}
        <g
          style={{
            transformOrigin: '70px 24px',
            transform: `rotate(${p.earRight}deg)`,
            transition: 'transform 700ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <path d="M78 32 L70 12 L60 32 Z" fill={T.coralDark} />
          <path d="M73 30 L69 19 L64 30 Z" fill={T.coralSoft} />
        </g>

        {/* Head — main fill (slightly oval to suggest mass) */}
        <ellipse cx="50" cy="52" rx="30" ry="29" fill={T.coralWarm} />

        {/* Head highlight (soft top) */}
        <ellipse cx="44" cy="38" rx="14" ry="6" fill="#FFFFFF" opacity="0.18" />

        {/* Muzzle */}
        <ellipse cx="50" cy="63" rx="16" ry="12" fill={T.peach} />

        {/* Cheek blush */}
        <ellipse cx="29" cy="62" rx="4" ry="2.5" fill="#FF9B8C" opacity="0.55" />
        <ellipse cx="71" cy="62" rx="4" ry="2.5" fill="#FF9B8C" opacity="0.55" />

        {/* Eyes */}
        {p.eyesClosed ? (
          <>
            <path
              d={`M37 49 Q42 ${44 + p.pupilDy * 0.4} 47 49`}
              stroke="#1A0F0A"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d={`M53 49 Q58 ${44 + p.pupilDy * 0.4} 63 49`}
              stroke="#1A0F0A"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* Whites */}
            <ellipse cx="42" cy="50" rx="4.4" ry="5" fill="#FFFFFF" />
            <ellipse cx="58" cy="50" rx="4.4" ry="5" fill="#FFFFFF" />
            {/* Pupils */}
            <circle
              cx={42 + p.pupilDx}
              cy={50 + p.pupilDy}
              r="3"
              fill="#1A0F0A"
            />
            <circle
              cx={58 + p.pupilDx}
              cy={50 + p.pupilDy}
              r="3"
              fill="#1A0F0A"
            />
            {/* Catchlights */}
            <circle
              cx={43 + p.pupilDx}
              cy={49 + p.pupilDy}
              r="0.9"
              fill="#FFFFFF"
            />
            <circle
              cx={59 + p.pupilDx}
              cy={49 + p.pupilDy}
              r="0.9"
              fill="#FFFFFF"
            />
          </>
        )}

        {/* Eyebrows — subtle */}
        <path
          d="M37 44 Q42 42 47 44"
          stroke="#2A1408"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />
        <path
          d="M53 44 Q58 42 63 44"
          stroke="#2A1408"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.6"
        />

        {/* Nose */}
        <ellipse cx="50" cy="60" rx="3" ry="2.4" fill="#1A0F0A" />
        <ellipse cx="49" cy="59.4" rx="0.9" ry="0.6" fill="#FFFFFF" opacity="0.7" />

        {/* Mouth */}
        {p.mouth === 'smile' && (
          <path
            d="M46 66 Q50 70 54 66"
            stroke="#1A0F0A"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {p.mouth === 'focused' && (
          <path
            d="M47 67 Q50 68 53 67"
            stroke="#1A0F0A"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {p.mouth === 'small' && (
          <path
            d="M46 66 Q50 69 54 66"
            stroke="#1A0F0A"
            strokeWidth="1.7"
            strokeLinecap="round"
            fill="none"
          />
        )}
        {p.mouth === 'big' && (
          <>
            <path
              d="M44 65 Q50 73 56 65"
              stroke="#1A0F0A"
              strokeWidth="2"
              strokeLinecap="round"
              fill="#2A1408"
            />
            {/* Little tongue */}
            <path
              d="M48 70 Q50 72 52 70 L52 71 Q50 73 48 71 Z"
              fill="#FF6B7A"
            />
          </>
        )}

        {/* Collar — only when not full body-rotated heavily, keep visible */}
        <rect x="32" y="80" width="36" height="5" rx="2.5" fill={T.coralDark} />
        <circle cx="50" cy="85" r="2.4" fill="#F1C84A" />

        {/* Sparkles when celebrating */}
        {p.sparkles && (
          <>
            <circle cx="14" cy="22" r="1.6" fill={T.coral} />
            <circle cx="86" cy="28" r="1.4" fill="#F1C84A" />
            <circle cx="8" cy="56" r="1.2" fill="#F1C84A" />
            <circle cx="90" cy="62" r="1.6" fill={T.coral} />
            <path d="M18 36 L20 38 L18 40 L16 38 Z" fill="#F1C84A" />
            <path d="M84 50 L86 52 L84 54 L82 52 Z" fill={T.coral} />
          </>
        )}
      </svg>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   UI element pieces — the actual MVP fragments
   ════════════════════════════════════════════════════════════════════ */

function HeroStatsCard({ compact = false }) {
  return (
    <div
      style={{
        width: compact ? 240 : 260,
        background: T.card,
        borderRadius: 16,
        padding: 14,
        boxShadow: '0 6px 20px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)',
        border: `1px solid ${T.divider}`,
      }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-[13px]"
          style={{ background: T.coral }}
        >
          A
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12.5px] font-bold" style={{ color: T.text }}>
            Evening, Anna.
          </div>
          <div className="text-[10.5px]" style={{ color: T.textTertiary }}>
            Bobby is napping
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { icon: Activity, value: '12', label: 'Walks' },
          { icon: Stethoscope, value: 'OK', label: 'Meds' },
          { icon: TrendingUp, value: '28kg', label: 'Weight' },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="rounded-xl p-2 text-center"
              style={{ background: T.coralSoft }}
            >
              <Icon size={12} style={{ color: T.coral }} className="mx-auto mb-0.5" />
              <div className="text-[12px] font-bold" style={{ color: T.text }}>
                {s.value}
              </div>
              <div className="text-[9px]" style={{ color: T.textTertiary }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TasksCard({ animate = true }) {
  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    if (!animate) return;
    setCheckedCount(0);
    const timers = [
      setTimeout(() => setCheckedCount(1), 500),
      setTimeout(() => setCheckedCount(2), 1100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [animate]);

  const items = [
    { label: 'Morning meds · Apoquel' },
    { label: 'Afternoon walk · 14:00' },
    { label: 'Weight check · weekly' },
  ];

  return (
    <div
      style={{
        width: 270,
        background: T.card,
        borderRadius: 18,
        padding: 16,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)',
        border: `1px solid ${T.divider}`,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10.5px] font-bold uppercase tracking-[0.08em]"
          style={{ color: T.textTertiary }}
        >
          Today · {Math.max(0, items.length - checkedCount)} left
        </span>
        <Bell size={14} style={{ color: T.coral }} />
      </div>
      <div className="space-y-2.5">
        {items.map((t, i) => {
          const done = i < checkedCount;
          return (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{
                  background: done ? T.coral : 'transparent',
                  border: done ? 'none' : `1.5px solid ${T.divider}`,
                  transition: 'background 280ms ease',
                }}
              >
                {done && <Check size={12} color="#FFF" strokeWidth={3} />}
              </div>
              <span
                className="text-[13px] font-medium"
                style={{
                  color: T.text,
                  textDecoration: done ? 'line-through' : 'none',
                  opacity: done ? 0.55 : 1,
                  transition: 'all 280ms ease',
                }}
              >
                {t.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProviderMiniCard({ p, delay = 0 }) {
  return (
    <div
      className="flex items-center gap-2.5"
      style={{
        background: T.card,
        borderRadius: 14,
        padding: '10px 12px',
        border: `1px solid ${T.divider}`,
        boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
        width: 200,
        animation: `octFloatIn 560ms cubic-bezier(0.2, 0.7, 0.2, 1) ${delay}ms both`,
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-[12px]"
        style={{ background: T.coral }}
      >
        {p.initial}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-0.5">
          <span className="text-[12px] font-semibold" style={{ color: T.text }}>
            {p.name}
          </span>
          <Star size={9} fill={T.coral} color={T.coral} />
          <span className="text-[10px] font-semibold" style={{ color: T.text }}>
            {p.rating}
          </span>
        </div>
        <span
          className="inline-flex items-center h-[15px] px-1.5 rounded-full text-[9px] font-semibold"
          style={{ background: T.coralSoft, color: T.coralDark }}
        >
          {p.role}
        </span>
      </div>
    </div>
  );
}

function PlaydateCard() {
  return (
    <div
      style={{
        width: 260,
        background: T.card,
        borderRadius: 18,
        padding: 14,
        boxShadow: '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.04)',
        border: `1px solid ${T.divider}`,
        textAlign: 'center',
      }}
    >
      <div className="flex items-center justify-center -space-x-2 mb-2">
        {[T.coral, T.green, T.purple, T.amber].map((c, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white"
            style={{ background: c }}
          >
            <PawPrint size={12} />
          </div>
        ))}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-[10px] font-semibold"
          style={{ background: '#F1EDE8', color: T.textMuted }}
        >
          +12
        </div>
      </div>
      <div className="text-[13px] font-bold" style={{ color: T.text }}>
        Playdate at Seefeld
      </div>
      <div className="text-[10.5px] mt-0.5" style={{ color: T.textTertiary }}>
        Sunday · 14:00 · 4 paws coming
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Scenes — mascot + UI in one composition
   ════════════════════════════════════════════════════════════════════ */

function MeetScene() {
  return (
    <div style={{ position: 'relative', width: 320, height: 340 }}>
      {/* Mascot top center */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          animation: 'octFloatGentleCentered 4s ease-in-out infinite',
        }}
      >
        <Mascot pose="meet" size={140} />
      </div>
      {/* Stats card peeking from below-right of mascot */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 30,
          animation: 'octRiseIn 700ms cubic-bezier(0.2, 0.7, 0.2, 1) 200ms both',
        }}
      >
        <HeroStatsCard />
      </div>
    </div>
  );
}

function RememberScene() {
  return (
    <div style={{ position: 'relative', width: 320, height: 340 }}>
      {/* Mascot peeks from behind the card — only head visible above */}
      <div
        style={{
          position: 'absolute',
          top: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
        }}
      >
        <Mascot pose="remember" size={130} />
      </div>
      {/* Tasks card in foreground, partially overlapping mascot's body */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          animation: 'octRiseInCentered 700ms cubic-bezier(0.2, 0.7, 0.2, 1) 200ms both',
        }}
      >
        <TasksCard />
      </div>
    </div>
  );
}

function ConnectScene() {
  const providers = [
    { initial: 'L', name: 'Lukas F.', role: 'Walker', rating: 4.9 },
    { initial: 'M', name: 'Maria S.', role: 'Sitter', rating: 4.8 },
    { initial: 'D', name: 'Dr. König', role: 'Vet', rating: 4.9 },
  ];

  return (
    <div style={{ position: 'relative', width: 340, height: 340 }}>
      {/* Mascot on the left, head turned right */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 100,
          zIndex: 2,
          animation: 'octFloatGentle 4s ease-in-out infinite',
        }}
      >
        <Mascot pose="connect" size={130} />
      </div>
      {/* Provider cards stacked on the right, sliding in */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          zIndex: 1,
        }}
      >
        {providers.map((p, i) => (
          <ProviderMiniCard key={p.initial} p={p} delay={300 + i * 200} />
        ))}
      </div>
    </div>
  );
}

function TogetherScene() {
  /* Orbit of paw circles around the mascot */
  const orbit = [
    { color: T.coral, top: -10, left: 90, size: 38, delay: 0 },
    { color: T.green, top: 70, left: 0, size: 32, delay: 200 },
    { color: T.purple, top: 200, left: 30, size: 34, delay: 400 },
    { color: T.amber, top: 200, left: 230, size: 30, delay: 600 },
    { color: T.taupe, top: 70, left: 260, size: 30, delay: 800 },
  ];

  return (
    <div style={{ position: 'relative', width: 320, height: 340 }}>
      {/* Orbit circles */}
      {orbit.map((o, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            top: o.top,
            left: o.left,
            width: o.size,
            height: o.size,
            borderRadius: '50%',
            background: o.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #FFFFFF',
            animation: `octPopIn 560ms cubic-bezier(0.34, 1.56, 0.64, 1) ${o.delay}ms both, octFloatGentle 5s ease-in-out ${o.delay}ms infinite`,
            zIndex: 1,
          }}
        >
          <PawPrint size={o.size * 0.45} />
        </div>
      ))}
      {/* Playdate card behind mascot */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          animation: 'octRiseInCentered 700ms cubic-bezier(0.2, 0.7, 0.2, 1) 300ms both',
        }}
      >
        <PlaydateCard />
      </div>
      {/* Mascot in the center */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3,
          animation: 'octFloatGentleCentered 4s ease-in-out infinite',
        }}
      >
        <Mascot pose="together" size={140} />
      </div>
    </div>
  );
}

const SCENES = {
  meet: MeetScene,
  remember: RememberScene,
  connect: ConnectScene,
  together: TogetherScene,
};

/* ════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════ */

export default function OnboardingConnected() {
  const [slideIndex, setSlideIndex] = useState(0);
  const slide = SLIDES[slideIndex];
  const SceneComponent = SCENES[slide.id];
  const isLast = slideIndex === SLIDES.length - 1;

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
        @keyframes octRiseInCentered {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes octRiseIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes octFloatIn {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes octFloatGentleCentered {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-6px); }
        }
        @keyframes octFloatGentle {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes octPopIn {
          from { opacity: 0; transform: scale(0.4); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes octFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Sticky header */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-2"
        style={{ position: 'relative', zIndex: 4 }}
      >
        {slideIndex > 0 ? (
          <button
            onClick={prev}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: T.card,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}
          >
            <ChevronLeft size={18} style={{ color: T.text }} />
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}
        <button
          className="text-[13.5px] font-medium"
          style={{ color: T.textTertiary }}
        >
          Skip
        </button>
      </div>

      {/* Scene + copy block */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6"
        style={{ minHeight: 0 }}
      >
        <div
          key={`scene-${slide.id}`}
          style={{
            animation: 'octFade 500ms cubic-bezier(0.2, 0.7, 0.2, 1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 28,
          }}
        >
          <SceneComponent />
        </div>

        <div
          key={`copy-${slide.id}`}
          className="text-center"
          style={{
            maxWidth: 320,
            animation: 'octFade 500ms cubic-bezier(0.2, 0.7, 0.2, 1) 120ms both',
          }}
        >
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
      <div className="px-4 pb-5 pt-2" style={{ position: 'relative', zIndex: 4 }}>
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === slideIndex ? 22 : 6,
                height: 6,
                borderRadius: 3,
                background: i === slideIndex ? T.coral : T.divider,
                transition: 'all 220ms ease',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
        <button
          onClick={next}
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
