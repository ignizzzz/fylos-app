import React from 'react';

/* =========================================================================
   FYLOS · Felt Icon System — full icon family in felt/plush material
   12 hero icons · large, animated, on clean canvas
   ========================================================================= */

// -------------------------------------------------------------------------
// Shared SVG filters & defs (the felt DNA)
// -------------------------------------------------------------------------
export const FeltDefs = () => (
  <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden>
    <defs>
      {/* Felt fuzz: noise overlay simulating wool fibers */}
      <filter id="fl-fuzz" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="3" seed="7" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 0 0.04  0 0 0 0.45 0" result="darkNoise" />
        <feComposite in="darkNoise" in2="SourceGraphic" operator="in" result="texturedNoise" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="texturedNoise" />
        </feMerge>
      </filter>

      {/* Stronger fuzz for hero scale */}
      <filter id="fl-fuzz-strong" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="11" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.2  0 0 0 0 0.08  0 0 0 0 0.04  0 0 0 0.55 0" result="darkNoise" />
        <feComposite in="darkNoise" in2="SourceGraphic" operator="in" result="texturedNoise" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="texturedNoise" />
        </feMerge>
      </filter>

      {/* Soft warm shadow under each icon */}
      <filter id="fl-shadow" x="-25%" y="-25%" width="150%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#7A3014" floodOpacity="0.18" />
      </filter>

      {/* Subtle highlight (lightens top-left) */}
      <filter id="fl-soft-edge">
        <feGaussianBlur stdDeviation="0.4" />
      </filter>

      {/* Reusable yarn-stitch pattern — dashed warm-brown line */}
    </defs>
  </svg>
);

// Stitch helper — generates dashed outline that mimics hand-stitching
const Stitch = ({ d, color = '#7A3014', opacity = 0.45, dashArray = '3 2.5', strokeWidth = 1.2 }) => (
  <path d={d} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={dashArray} opacity={opacity} strokeLinecap="round" />
);

// -------------------------------------------------------------------------
// THE 12 ICONS
// Each: returns SVG content (no wrapper), inherits 200x200 viewBox
// -------------------------------------------------------------------------

// 01 · PAW
export const IconPaw = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)">
      <ellipse cx="100" cy="135" rx="48" ry="38" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
      <ellipse cx="100" cy="135" rx="48" ry="38" fill="none" stroke="#7A3014" strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.5" />
      <circle cx="56" cy="78" r="20" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
      <circle cx="56" cy="78" r="20" fill="none" stroke="#7A3014" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.5" />
      <circle cx="100" cy="62" r="22" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
      <circle cx="100" cy="62" r="22" fill="none" stroke="#7A3014" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.5" />
      <circle cx="144" cy="78" r="20" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
      <circle cx="144" cy="78" r="20" fill="none" stroke="#7A3014" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.5" />
    </g>
  </svg>
);

// 02 · HEART
export const IconHeart = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)">
      <path d="M100 168 C 38 118, 38 58, 70 58 C 85 58, 100 70, 100 86 C 100 70, 115 58, 130 58 C 162 58, 162 118, 100 168 Z"
        fill="#E85D2A" filter="url(#fl-fuzz-strong)" />
      <Stitch d="M100 168 C 38 118, 38 58, 70 58 C 85 58, 100 70, 100 86 C 100 70, 115 58, 130 58 C 162 58, 162 118, 100 168 Z" />
      {/* Center seam */}
      <path d="M100 86 L 100 158" stroke="#7A3014" strokeWidth="1" strokeDasharray="2 2" opacity="0.35" />
    </g>
  </svg>
);

// 03 · SYRINGE
export const IconSyringe = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)" transform="rotate(-15 100 100)">
      {/* Plunger handle */}
      <rect x="20" y="84" width="32" height="32" rx="8" fill="#E85D2A" filter="url(#fl-fuzz-strong)" />
      <rect x="20" y="84" width="32" height="32" rx="8" fill="none" stroke="#7A3014" strokeWidth="1.4" strokeDasharray="3 2" opacity="0.5" />
      {/* Plunger rod */}
      <rect x="52" y="94" width="14" height="12" rx="3" fill="#C77A4F" filter="url(#fl-fuzz-strong)" />
      {/* Body */}
      <rect x="66" y="78" width="86" height="44" rx="10" fill="#F4D9BC" filter="url(#fl-fuzz-strong)" />
      <rect x="66" y="78" width="86" height="44" rx="10" fill="none" stroke="#7A3014" strokeWidth="1.4" strokeDasharray="3 2.5" opacity="0.5" />
      {/* Marks */}
      <circle cx="86" cy="100" r="2" fill="#7A3014" opacity="0.7" />
      <circle cx="106" cy="100" r="2" fill="#7A3014" opacity="0.7" />
      <circle cx="126" cy="100" r="2" fill="#7A3014" opacity="0.7" />
      {/* Tip */}
      <rect x="152" y="92" width="18" height="16" rx="3" fill="#F4D9BC" filter="url(#fl-fuzz-strong)" />
      {/* Needle */}
      <rect x="170" y="98" width="22" height="4" rx="2" fill="#A89070" />
    </g>
  </svg>
);

// 04 · PILL
export const IconPill = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)" transform="rotate(-25 100 100)">
      {/* Top half (peach) */}
      <path d="M 50 70 L 130 70 A 30 30 0 0 1 130 130 L 50 130 Z" fill="#FF7A4D" filter="url(#fl-fuzz-strong)" />
      {/* Bottom half (cream) */}
      <path d="M 130 70 A 30 30 0 0 1 130 130 L 50 130 A 30 30 0 0 1 50 70 Z" transform="rotate(180 90 100)" fill="#F4D9BC" filter="url(#fl-fuzz-strong)" />
      {/* Capsule outline */}
      <rect x="20" y="70" width="160" height="60" rx="30" fill="none" stroke="#7A3014" strokeWidth="1.4" strokeDasharray="3 2.5" opacity="0.5" />
      {/* Center seam */}
      <line x1="100" y1="70" x2="100" y2="130" stroke="#7A3014" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
    </g>
  </svg>
);

// 05 · BONE
export const IconBone = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)" transform="rotate(-20 100 100)">
      {/* Left bulb cluster */}
      <circle cx="46" cy="78" r="22" fill="#FFE6D2" filter="url(#fl-fuzz-strong)" />
      <circle cx="46" cy="122" r="22" fill="#FFE6D2" filter="url(#fl-fuzz-strong)" />
      {/* Right bulb cluster */}
      <circle cx="154" cy="78" r="22" fill="#FFE6D2" filter="url(#fl-fuzz-strong)" />
      <circle cx="154" cy="122" r="22" fill="#FFE6D2" filter="url(#fl-fuzz-strong)" />
      {/* Shaft */}
      <rect x="46" y="80" width="108" height="40" fill="#FFE6D2" filter="url(#fl-fuzz-strong)" />
      {/* Stitch all together */}
      <path d="M 46 56 A 22 22 0 0 0 24 78 L 24 122 A 22 22 0 0 0 46 144 L 154 144 A 22 22 0 0 0 176 122 L 176 78 A 22 22 0 0 0 154 56 L 154 100 L 46 100 Z" fill="none" stroke="#7A3014" strokeWidth="1.4" strokeDasharray="3 2.5" opacity="0.45" />
      <path d="M 46 56 L 46 100 L 154 100 L 154 56" fill="none" stroke="#7A3014" strokeWidth="1.4" strokeDasharray="3 2.5" opacity="0.45" />
    </g>
  </svg>
);

// 06 · SCALE (weight)
export const IconScale = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)">
      {/* Base body */}
      <rect x="40" y="60" width="120" height="100" rx="18" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
      <rect x="40" y="60" width="120" height="100" rx="18" fill="none" stroke="#7A3014" strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.5" />
      {/* Display screen */}
      <rect x="60" y="80" width="80" height="42" rx="8" fill="#FFF7EE" filter="url(#fl-fuzz-strong)" />
      <rect x="60" y="80" width="80" height="42" rx="8" fill="none" stroke="#7A3014" strokeWidth="1.2" strokeDasharray="2.5 2" opacity="0.5" />
      <text x="100" y="108" textAnchor="middle" fontSize="20" fontWeight="700" fill="#E85D2A" fontFamily="Inter">8.4</text>
      <text x="100" y="120" textAnchor="middle" fontSize="6" fontWeight="600" fill="#7A3014" fontFamily="Inter" opacity="0.6">KG</text>
      {/* Foot pads */}
      <circle cx="68" cy="146" r="6" fill="#7A3014" opacity="0.7" />
      <circle cx="132" cy="146" r="6" fill="#7A3014" opacity="0.7" />
    </g>
  </svg>
);

// 07 · CALENDAR
export const IconCalendar = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)">
      {/* Binder back (orange) */}
      <rect x="34" y="56" width="132" height="120" rx="14" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
      <rect x="34" y="56" width="132" height="120" rx="14" fill="none" stroke="#7A3014" strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.5" />
      {/* Page (cream) */}
      <rect x="44" y="76" width="112" height="92" rx="8" fill="#FFF7EE" filter="url(#fl-fuzz-strong)" />
      <rect x="44" y="76" width="112" height="92" rx="8" fill="none" stroke="#7A3014" strokeWidth="1.2" strokeDasharray="2.5 2" opacity="0.45" />
      {/* Spirals */}
      <rect x="58" y="40" width="6" height="32" rx="3" fill="#5E3018" />
      <rect x="136" y="40" width="6" height="32" rx="3" fill="#5E3018" />
      {/* Number */}
      <text x="100" y="124" textAnchor="middle" fontSize="38" fontWeight="800" fill="#E85D2A" fontFamily="Inter">14</text>
      <text x="100" y="148" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7A3014" fontFamily="Inter" opacity="0.65">DAYS</text>
    </g>
  </svg>
);

// 08 · BELL
export const IconBell = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)" className="fl-bell-body">
      <path d="M 100 30 C 65 30, 55 60, 55 105 L 45 130 L 155 130 L 145 105 C 145 60, 135 30, 100 30 Z"
        fill="#E8B872" filter="url(#fl-fuzz-strong)" />
      <Stitch d="M 100 30 C 65 30, 55 60, 55 105 L 45 130 L 155 130 L 145 105 C 145 60, 135 30, 100 30 Z" />
      {/* Top knob */}
      <circle cx="100" cy="22" r="8" fill="#C68D44" filter="url(#fl-fuzz-strong)" />
    </g>
    {/* Clapper (animated separately in inline keyframe via parent) */}
    <ellipse cx="100" cy="148" rx="14" ry="10" fill="#94632A" filter="url(#fl-fuzz)" />
    <Stitch d="M 100 148 m -14 0 a 14 10 0 1 0 28 0 a 14 10 0 1 0 -28 0 Z" opacity={0.4} />
  </svg>
);

// 09 · MAP PIN
export const IconMapPin = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)">
      <path d="M 100 30 C 65 30, 40 55, 40 90 C 40 130, 100 175, 100 175 C 100 175, 160 130, 160 90 C 160 55, 135 30, 100 30 Z"
        fill="#E85D2A" filter="url(#fl-fuzz-strong)" />
      <Stitch d="M 100 30 C 65 30, 40 55, 40 90 C 40 130, 100 175, 100 175 C 100 175, 160 130, 160 90 C 160 55, 135 30, 100 30 Z" />
      {/* Inner circle (center) */}
      <circle cx="100" cy="86" r="22" fill="#FFE6D2" filter="url(#fl-fuzz-strong)" />
      <circle cx="100" cy="86" r="22" fill="none" stroke="#7A3014" strokeWidth="1.2" strokeDasharray="2.5 2" opacity="0.5" />
      {/* Tiny paw inside */}
      <ellipse cx="100" cy="92" rx="8" ry="6" fill="#7A3014" opacity="0.85" />
      <circle cx="92" cy="80" r="3" fill="#7A3014" opacity="0.85" />
      <circle cx="100" cy="76" r="3" fill="#7A3014" opacity="0.85" />
      <circle cx="108" cy="80" r="3" fill="#7A3014" opacity="0.85" />
    </g>
  </svg>
);

// 10 · HOUSE
export const IconHouse = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)">
      {/* Roof */}
      <polygon points="100,30 170,90 30,90" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
      <polygon points="100,30 170,90 30,90" fill="none" stroke="#7A3014" strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.5" />
      {/* Walls */}
      <rect x="46" y="90" width="108" height="80" rx="8" fill="#F4D9BC" filter="url(#fl-fuzz-strong)" />
      <rect x="46" y="90" width="108" height="80" rx="8" fill="none" stroke="#7A3014" strokeWidth="1.4" strokeDasharray="3 2.5" opacity="0.5" />
      {/* Door */}
      <rect x="84" y="120" width="32" height="50" rx="6" fill="#7A3014" filter="url(#fl-fuzz)" />
      <circle cx="108" cy="146" r="2.5" fill="#FFE6D2" />
      {/* Window */}
      <rect x="58" y="108" width="20" height="20" rx="4" fill="#FFF7EE" filter="url(#fl-fuzz)" />
      <line x1="68" y1="108" x2="68" y2="128" stroke="#7A3014" strokeWidth="1" opacity="0.4" />
      <line x1="58" y1="118" x2="78" y2="118" stroke="#7A3014" strokeWidth="1" opacity="0.4" />
      {/* Chimney smoke (cute) */}
      <ellipse cx="138" cy="56" rx="6" ry="5" fill="#FFE6D2" opacity="0.7" />
    </g>
  </svg>
);

// 11 · PACK (3 heads)
export const IconPack = () => {
  return (
    <svg viewBox="0 0 200 200" className="fl-icon">
      <g filter="url(#fl-shadow)">
        {/* Back-left dog */}
        <g transform="translate(40 78)">
          <ellipse cx="32" cy="32" rx="32" ry="30" fill="#A86A45" filter="url(#fl-fuzz-strong)" />
          <ellipse cx="10" cy="14" rx="9" ry="13" fill="#A86A45" filter="url(#fl-fuzz-strong)" />
          <ellipse cx="54" cy="14" rx="9" ry="13" fill="#A86A45" filter="url(#fl-fuzz-strong)" />
          <Stitch d="M 32 32 m -32 0 a 32 30 0 1 0 64 0 a 32 30 0 1 0 -64 0" opacity={0.4} />
          <circle cx="22" cy="30" r="2.5" fill="#3a1f10" />
          <circle cx="42" cy="30" r="2.5" fill="#3a1f10" />
          <ellipse cx="32" cy="42" rx="3.5" ry="2.5" fill="#3a1f10" />
        </g>
        {/* Center dog */}
        <g transform="translate(72 56)">
          <ellipse cx="34" cy="34" rx="34" ry="32" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
          <ellipse cx="10" cy="14" rx="10" ry="14" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
          <ellipse cx="58" cy="14" rx="10" ry="14" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
          <Stitch d="M 34 34 m -34 0 a 34 32 0 1 0 68 0 a 34 32 0 1 0 -68 0" opacity={0.45} />
          <circle cx="22" cy="32" r="3" fill="#3a1f10" />
          <circle cx="46" cy="32" r="3" fill="#3a1f10" />
          <ellipse cx="34" cy="46" rx="4" ry="3" fill="#3a1f10" />
        </g>
        {/* Right dog */}
        <g transform="translate(108 80)">
          <ellipse cx="32" cy="32" rx="32" ry="30" fill="#E89A75" filter="url(#fl-fuzz-strong)" />
          <ellipse cx="10" cy="14" rx="9" ry="13" fill="#E89A75" filter="url(#fl-fuzz-strong)" />
          <ellipse cx="54" cy="14" rx="9" ry="13" fill="#E89A75" filter="url(#fl-fuzz-strong)" />
          <Stitch d="M 32 32 m -32 0 a 32 30 0 1 0 64 0 a 32 30 0 1 0 -64 0" opacity={0.4} />
          <circle cx="22" cy="30" r="2.5" fill="#3a1f10" />
          <circle cx="42" cy="30" r="2.5" fill="#3a1f10" />
          <ellipse cx="32" cy="42" rx="3.5" ry="2.5" fill="#3a1f10" />
        </g>
      </g>
    </svg>
  );
};

// 12 · CAMERA (memory)
export const IconCamera = () => (
  <svg viewBox="0 0 200 200" className="fl-icon">
    <g filter="url(#fl-shadow)">
      {/* Body */}
      <rect x="30" y="62" width="140" height="100" rx="14" fill="#D4845C" filter="url(#fl-fuzz-strong)" />
      <rect x="30" y="62" width="140" height="100" rx="14" fill="none" stroke="#7A3014" strokeWidth="1.5" strokeDasharray="3 2.5" opacity="0.5" />
      {/* Top viewfinder hump */}
      <rect x="74" y="46" width="52" height="22" rx="6" fill="#A55E3F" filter="url(#fl-fuzz-strong)" />
      {/* Lens outer */}
      <circle cx="100" cy="112" r="34" fill="#FFE6D2" filter="url(#fl-fuzz-strong)" />
      <circle cx="100" cy="112" r="34" fill="none" stroke="#7A3014" strokeWidth="1.4" strokeDasharray="3 2.5" opacity="0.5" />
      {/* Lens inner */}
      <circle cx="100" cy="112" r="22" fill="#7A3014" filter="url(#fl-fuzz)" />
      <circle cx="100" cy="112" r="14" fill="#3a1f10" />
      {/* Lens highlight */}
      <ellipse cx="92" cy="104" rx="6" ry="4" fill="#FFE6D2" opacity="0.6" />
      {/* Flash dot */}
      <circle cx="148" cy="80" r="6" fill="#FFE6D2" filter="url(#fl-fuzz)" className="fl-flash" />
    </g>
  </svg>
);

// -------------------------------------------------------------------------
// ICON GRID DATA
// -------------------------------------------------------------------------
const ICONS = [
  { id: 'paw',      name: 'Paw',       hint: 'Pet identity',     anim: 'fl-press',     Comp: IconPaw },
  { id: 'heart',    name: 'Heart',     hint: 'Wellness · health',anim: 'fl-heartbeat', Comp: IconHeart },
  { id: 'syringe',  name: 'Syringe',   hint: 'Vaccine reminder', anim: 'fl-tilt',      Comp: IconSyringe },
  { id: 'pill',     name: 'Pill',      hint: 'Medication',       anim: 'fl-wobble',    Comp: IconPill },
  { id: 'bone',     name: 'Bone',      hint: 'Treats · food',    anim: 'fl-gnaw',      Comp: IconBone },
  { id: 'scale',    name: 'Scale',     hint: 'Weight tracking',  anim: 'fl-pendulum',  Comp: IconScale },
  { id: 'calendar', name: 'Calendar',  hint: 'Date · countdown', anim: 'fl-flip',      Comp: IconCalendar },
  { id: 'bell',     name: 'Bell',      hint: 'Notification',     anim: 'fl-ring',      Comp: IconBell },
  { id: 'pin',      name: 'Map pin',   hint: 'Place · location', anim: 'fl-drop',      Comp: IconMapPin },
  { id: 'house',    name: 'House',     hint: 'Home · base',      anim: 'fl-breathe',   Comp: IconHouse },
  { id: 'pack',     name: 'Pack',      hint: 'Friends · social', anim: 'fl-wave',      Comp: IconPack },
  { id: 'camera',   name: 'Camera',    hint: 'Memory · photo',   anim: 'fl-flash',     Comp: IconCamera },
];

// -------------------------------------------------------------------------
// ICON CARD
// -------------------------------------------------------------------------
const IconCard = ({ icon }) => {
  const { Comp, name, hint, anim } = icon;
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-[28px] bg-white/60 backdrop-blur-sm border border-[#E8C9A6]/40 hover:bg-white/90 transition-colors">
      <div className={`w-[160px] h-[160px] flex items-center justify-center ${anim}`}>
        <Comp />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-semibold text-[#7A3014]">{name}</p>
        <p className="text-[11px] text-[#A57050] mt-0.5">{hint}</p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// MAIN
// -------------------------------------------------------------------------
export default function FeltIconSystem() {
  return (
    <div className="min-h-screen w-full" style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'radial-gradient(ellipse at top, #FFF7EE 0%, #F7E9D6 100%)',
    }}>
      <FeltDefs />

      {/* Inline keyframes — felt-specific gentle animations */}
      <style>{`
        .fl-icon { width: 100%; height: 100%; }

        /* ----- Animations ----- */
        @keyframes flPress {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(0.96) translateY(2px); }
        }
        .fl-press { animation: flPress 2.6s cubic-bezier(0.4, 0, 0.2, 1) infinite; transform-origin: 50% 70%; }

        @keyframes flHeartbeat {
          0%, 70%, 100% { transform: scale(1); }
          10% { transform: scale(1.08); }
          20% { transform: scale(0.97); }
          30% { transform: scale(1.05); }
          40% { transform: scale(1); }
        }
        .fl-heartbeat { animation: flHeartbeat 1.8s ease-in-out infinite; transform-origin: 50% 60%; }

        @keyframes flTilt {
          0%, 100% { transform: rotate(0deg) translateY(0); }
          50% { transform: rotate(-3deg) translateY(-2px); }
        }
        .fl-tilt { animation: flTilt 3.4s ease-in-out infinite; transform-origin: 50% 50%; }

        @keyframes flWobble {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-4deg); }
          75% { transform: rotate(4deg); }
        }
        .fl-wobble { animation: flWobble 3.2s ease-in-out infinite; transform-origin: 50% 50%; }

        @keyframes flGnaw {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.04) rotate(-2deg); }
          75% { transform: scale(0.98) rotate(2deg); }
        }
        .fl-gnaw { animation: flGnaw 2.8s ease-in-out infinite; transform-origin: 50% 50%; }

        @keyframes flPendulum {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .fl-pendulum { animation: flPendulum 4s ease-in-out infinite; transform-origin: 50% 90%; }

        @keyframes flFlip {
          0%, 100% { transform: perspective(400px) rotateX(0deg); }
          50% { transform: perspective(400px) rotateX(-12deg); }
        }
        .fl-flip { animation: flFlip 4.5s ease-in-out infinite; transform-origin: 50% 30%; }

        @keyframes flRing {
          0%, 60%, 100% { transform: rotate(0deg); }
          5% { transform: rotate(-12deg); }
          15% { transform: rotate(10deg); }
          25% { transform: rotate(-8deg); }
          35% { transform: rotate(6deg); }
          45% { transform: rotate(-3deg); }
        }
        .fl-ring { animation: flRing 3.5s ease-in-out infinite; transform-origin: 50% 12%; }

        @keyframes flDrop {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-12px); }
          55% { transform: translateY(2px); }
          70% { transform: translateY(-4px); }
          85% { transform: translateY(0); }
        }
        .fl-drop { animation: flDrop 3.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite; transform-origin: 50% 100%; }

        @keyframes flBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        .fl-breathe { animation: flBreathe 4s ease-in-out infinite; transform-origin: 50% 60%; }

        @keyframes flWave {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-3px) rotate(-2deg); }
          50% { transform: translateY(0) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(2deg); }
        }
        .fl-wave { animation: flWave 3.8s ease-in-out infinite; transform-origin: 50% 50%; }

        @keyframes flFlashShake {
          0%, 100% { transform: scale(1) rotate(0deg); }
          15% { transform: scale(1.02) rotate(-1deg); }
          85% { transform: scale(1.02) rotate(1deg); }
        }
        .fl-flash { animation: flFlashShake 5s ease-in-out infinite; transform-origin: 50% 50%; }
        @keyframes flFlashBlink {
          0%, 95%, 100% { opacity: 1; }
          96% { opacity: 0.3; }
          97% { opacity: 1; }
          98% { opacity: 0.4; }
          99% { opacity: 1; }
        }
        .fl-flash circle.fl-flash, .fl-flash circle:last-of-type { animation: flFlashBlink 5s linear infinite; }
      `}</style>

      {/* Page header */}
      <header className="px-8 py-6 border-b border-[#E8C9A6]/50 bg-[#FFF7EE]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#7A3014] tracking-tight">Fylos · Felt Icon System</h1>
            <p className="text-[13px] text-[#A57050] mt-1">12 hero icons · hand-stitched DNA · gently animated</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A57050]">Material</p>
            <p className="text-[13px] font-semibold text-[#7A3014]">Felt / Plush · B</p>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 gap-5">
          {ICONS.map((icon) => (
            <IconCard key={icon.id} icon={icon} />
          ))}
        </div>

        {/* Hero showcase — 1 huge icon for inspection */}
        <section className="mt-16 pt-10 border-t border-[#E8C9A6]/50">
          <div className="text-center mb-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#A57050]">Hero scale · 360px</p>
            <h2 className="text-[18px] font-bold text-[#7A3014] mt-1">For empty states & onboarding</h2>
          </div>
          <div className="flex justify-center">
            <div className="w-[360px] h-[360px] flex items-center justify-center fl-press">
              <IconHeart />
            </div>
          </div>
          <p className="text-center text-[13px] text-[#A57050] mt-4 italic">"Bobby is doing great today."</p>
        </section>

        {/* Footer */}
        <div className="mt-16 max-w-2xl mx-auto text-center px-6 pb-10">
          <p className="text-[12px] text-[#A57050] leading-relaxed">
            <strong className="text-[#7A3014]">Direction, not final art.</strong> Production assets would be photographed real wool/felt or rendered in 3D with displacement-mapped fiber textures.
            The CSS animations here approximate the <em>gentle, alive</em> feel — final motion would use spring physics & per-icon hand-tuned curves.
          </p>
        </div>
      </main>
    </div>
  );
}
