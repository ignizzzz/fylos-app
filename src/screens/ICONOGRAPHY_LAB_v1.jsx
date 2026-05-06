import React from 'react';

/* =========================================================================
   FYLOS · Iconography Lab — 4 material directions side-by-side
   A · Ceramic        (matte glazed, warm pottery)
   B · Felt / Plush   (fuzzy, pet-coded textile)
   C · Watercolor     (hand-painted, artisan washes)
   D · Origami        (folded paper, geometric facets)
   ========================================================================= */

// -------------------------------------------------------------------------
// Shared SVG filters (defined once, referenced from multiple SVGs)
// -------------------------------------------------------------------------
const SharedFilters = () => (
  <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none' }} aria-hidden>
    <defs>
      {/* Felt fuzz: noise overlay + soft edge */}
      <filter id="felt-fuzz" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="2" seed="7" result="noise" />
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0" result="darkNoise" />
        <feComposite in="darkNoise" in2="SourceGraphic" operator="in" result="texturedNoise" />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="texturedNoise" />
        </feMerge>
      </filter>

      {/* Watercolor: painterly soft edges via displacement */}
      <filter id="watercolor" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.025" numOctaves="3" seed="3" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="4" xChannelSelector="R" yChannelSelector="G" />
      </filter>

      {/* Watercolor wash: irregular alpha edge */}
      <filter id="watercolor-wash" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" seed="11" result="turb" />
        <feDisplacementMap in="SourceGraphic" in2="turb" scale="6" />
        <feGaussianBlur stdDeviation="0.4" />
      </filter>

      {/* Soft drop shadow for ceramic */}
      <filter id="ceramic-shadow" x="-25%" y="-25%" width="150%" height="160%">
        <feDropShadow dx="2" dy="6" stdDeviation="5" floodColor="#7a4a2c" floodOpacity="0.18" />
      </filter>

      {/* Hard angular shadow for origami */}
      <filter id="origami-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="3" dy="5" stdDeviation="0" floodColor="#3a1f10" floodOpacity="0.28" />
      </filter>

      {/* Felt soft edge */}
      <filter id="felt-soft-edge" x="-10%" y="-10%" width="120%" height="120%">
        <feGaussianBlur stdDeviation="0.7" />
      </filter>
    </defs>
  </svg>
);

// -------------------------------------------------------------------------
// VARIANT A · CERAMIC
// -------------------------------------------------------------------------
const CeramicTabBar = () => {
  const tabs = [
    { id: 'home', active: true, render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <defs>
          <radialGradient id="cer-roof" cx="40%" cy="30%"><stop offset="0%" stopColor="#FFE0CD" /><stop offset="60%" stopColor="#E89A75" /><stop offset="100%" stopColor="#A55E3F" /></radialGradient>
          <radialGradient id="cer-wall" cx="35%" cy="35%"><stop offset="0%" stopColor="#FFFAF5" /><stop offset="60%" stopColor="#F2DECB" /><stop offset="100%" stopColor="#B89579" /></radialGradient>
        </defs>
        <polygon points="20,6 33,18 7,18" fill="url(#cer-roof)" filter="url(#ceramic-shadow)" />
        <rect x="9" y="18" width="22" height="14" rx="2" fill="url(#cer-wall)" filter="url(#ceramic-shadow)" />
        <rect x="17" y="22" width="6" height="10" rx="1.5" fill="#A55E3F" opacity="0.85" />
      </svg>
    )},
    { id: 'health', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <defs><radialGradient id="cer-heart" cx="40%" cy="30%"><stop offset="0%" stopColor="#FFD9C7" /><stop offset="60%" stopColor="#E85D2A" /><stop offset="100%" stopColor="#7A3014" /></radialGradient></defs>
        <path d="M20 32 C 8 22, 8 11, 14 11 C 17 11, 20 14, 20 17 C 20 14, 23 11, 26 11 C 32 11, 32 22, 20 32 Z" fill="url(#cer-heart)" filter="url(#ceramic-shadow)" />
        <ellipse cx="16" cy="15" rx="2" ry="1.5" fill="white" opacity="0.5" />
      </svg>
    )},
    { id: 'pack', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <defs><radialGradient id="cer-paw" cx="40%" cy="30%"><stop offset="0%" stopColor="#FFE6D2" /><stop offset="60%" stopColor="#E0A574" /><stop offset="100%" stopColor="#8E5631" /></radialGradient></defs>
        <ellipse cx="20" cy="26" rx="9" ry="7" fill="url(#cer-paw)" filter="url(#ceramic-shadow)" />
        <circle cx="11" cy="16" r="3.5" fill="url(#cer-paw)" filter="url(#ceramic-shadow)" />
        <circle cx="20" cy="11" r="3.5" fill="url(#cer-paw)" filter="url(#ceramic-shadow)" />
        <circle cx="29" cy="16" r="3.5" fill="url(#cer-paw)" filter="url(#ceramic-shadow)" />
      </svg>
    )},
    { id: 'bell', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <defs><radialGradient id="cer-bell" cx="40%" cy="30%"><stop offset="0%" stopColor="#FFEFD8" /><stop offset="60%" stopColor="#E8B872" /><stop offset="100%" stopColor="#94632A" /></radialGradient></defs>
        <path d="M20 8 C 13 8, 11 14, 11 22 L 9 26 L 31 26 L 29 22 C 29 14, 27 8, 20 8 Z" fill="url(#cer-bell)" filter="url(#ceramic-shadow)" />
        <ellipse cx="20" cy="30" rx="3" ry="2" fill="url(#cer-bell)" filter="url(#ceramic-shadow)" />
        <ellipse cx="16" cy="14" rx="2" ry="1.5" fill="white" opacity="0.5" />
      </svg>
    )},
  ];
  return (
    <div className="flex justify-around items-center bg-white rounded-full px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-black/[0.04]">
      {tabs.map((t) => (
        <div key={t.id} className="flex flex-col items-center gap-1">
          {t.render()}
          <span className={`text-[9px] font-semibold ${t.active ? 'text-[#E85D2A]' : 'text-[#9A9AA0]'}`}>
            {t.id === 'home' ? 'Home' : t.id === 'health' ? 'Health' : t.id === 'pack' ? 'Pack' : 'Reminders'}
          </span>
        </div>
      ))}
    </div>
  );
};

const CeramicEmptyState = () => (
  <div className="flex flex-col items-center text-center pt-6 pb-4">
    <svg viewBox="0 0 200 160" width="180" height="144">
      <defs>
        <radialGradient id="cer-syr-body" cx="30%" cy="40%"><stop offset="0%" stopColor="#FFFAF5" /><stop offset="60%" stopColor="#FFD9BC" /><stop offset="100%" stopColor="#B07A5A" /></radialGradient>
        <radialGradient id="cer-syr-cap" cx="40%" cy="35%"><stop offset="0%" stopColor="#FFE0CD" /><stop offset="60%" stopColor="#E85D2A" /><stop offset="100%" stopColor="#7A3014" /></radialGradient>
        <radialGradient id="cer-ground" cx="50%" cy="50%"><stop offset="0%" stopColor="#F2E5D6" stopOpacity="0.7" /><stop offset="100%" stopColor="#F2E5D6" stopOpacity="0" /></radialGradient>
      </defs>
      <ellipse cx="100" cy="135" rx="75" ry="10" fill="url(#cer-ground)" />
      {/* Syringe body */}
      <rect x="60" y="50" width="80" height="40" rx="6" fill="url(#cer-syr-body)" filter="url(#ceramic-shadow)" />
      {/* Syringe plunger */}
      <rect x="40" y="58" width="22" height="24" rx="4" fill="url(#cer-syr-cap)" filter="url(#ceramic-shadow)" />
      {/* Syringe needle base */}
      <rect x="140" y="64" width="14" height="12" rx="2" fill="url(#cer-syr-body)" filter="url(#ceramic-shadow)" />
      {/* Needle */}
      <rect x="154" y="68" width="28" height="4" rx="2" fill="#9A9AA0" />
      {/* Highlight stripe */}
      <rect x="68" y="58" width="60" height="6" rx="3" fill="white" opacity="0.4" />
      {/* Marks */}
      <rect x="80" y="78" width="2" height="6" fill="#7A4A2C" opacity="0.5" />
      <rect x="100" y="78" width="2" height="6" fill="#7A4A2C" opacity="0.5" />
      <rect x="120" y="78" width="2" height="6" fill="#7A4A2C" opacity="0.5" />
    </svg>
    <h4 className="text-[15px] font-semibold text-[#111] mt-4">No vaccines yet</h4>
    <p className="text-[12px] text-[#6E6E73] mt-1 px-4 leading-snug">Add Bobby's first one — we'll remind you when the next is due.</p>
  </div>
);

const CeramicReminderCard = () => (
  <div className="flex items-center bg-white rounded-[20px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_0_0_1px_rgba(0,0,0,0.03)] gap-3">
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-[#111] leading-tight">Bobby's rabies booster</p>
      <p className="text-[11px] text-[#6E6E73] mt-1">in 14 days · Dr Müller</p>
    </div>
    <svg viewBox="0 0 80 80" width="56" height="56">
      <defs>
        <radialGradient id="cer-cal-page" cx="35%" cy="30%"><stop offset="0%" stopColor="#FFFAF5" /><stop offset="60%" stopColor="#F2E5D2" /><stop offset="100%" stopColor="#A8825F" /></radialGradient>
        <radialGradient id="cer-cal-binder" cx="40%" cy="35%"><stop offset="0%" stopColor="#E89A75" /><stop offset="60%" stopColor="#A55E3F" /><stop offset="100%" stopColor="#5E3018" /></radialGradient>
      </defs>
      <rect x="14" y="20" width="52" height="52" rx="6" fill="url(#cer-cal-binder)" filter="url(#ceramic-shadow)" />
      <rect x="18" y="28" width="44" height="40" rx="3" fill="url(#cer-cal-page)" />
      {/* Spirals */}
      <rect x="22" y="14" width="3" height="14" rx="1.5" fill="#5E3018" />
      <rect x="55" y="14" width="3" height="14" rx="1.5" fill="#5E3018" />
      <text x="40" y="50" textAnchor="middle" fontSize="16" fontWeight="700" fill="#E85D2A" fontFamily="Inter">14</text>
      <text x="40" y="62" textAnchor="middle" fontSize="6" fontWeight="600" fill="#6E6E73" fontFamily="Inter">DAYS</text>
    </svg>
  </div>
);

const CeramicPackCluster = () => {
  const heads = [
    { dx: 0, c1: '#FFE0CD', c2: '#E89A75', c3: '#A55E3F' },
    { dx: 30, c1: '#FFEFD8', c2: '#D4B07A', c3: '#7A5230' },
    { dx: 60, c1: '#FFE6D2', c2: '#E0A574', c3: '#8E5631' },
  ];
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-[100px] h-[44px]">
        {heads.map((h, i) => (
          <svg key={i} viewBox="0 0 50 50" width="44" height="44" style={{ position: 'absolute', left: h.dx, top: 0 }}>
            <defs>
              <radialGradient id={`cer-head-${i}`} cx="35%" cy="30%">
                <stop offset="0%" stopColor={h.c1} />
                <stop offset="60%" stopColor={h.c2} />
                <stop offset="100%" stopColor={h.c3} />
              </radialGradient>
            </defs>
            <circle cx="25" cy="25" r="20" fill="white" />
            <circle cx="25" cy="26" r="18" fill={`url(#cer-head-${i})`} filter="url(#ceramic-shadow)" />
            <ellipse cx="11" cy="18" rx="5" ry="7" fill={`url(#cer-head-${i})`} filter="url(#ceramic-shadow)" />
            <ellipse cx="39" cy="18" rx="5" ry="7" fill={`url(#cer-head-${i})`} filter="url(#ceramic-shadow)" />
            <circle cx="20" cy="25" r="1.5" fill="#3a1f10" />
            <circle cx="30" cy="25" r="1.5" fill="#3a1f10" />
            <ellipse cx="25" cy="32" rx="2" ry="1.2" fill="#3a1f10" />
          </svg>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#111] leading-tight">Your Fylos pack</p>
        <p className="text-[11px] text-[#6E6E73] mt-1">3 friends nearby</p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// VARIANT B · FELT / PLUSH
// -------------------------------------------------------------------------
const FeltTabBar = () => {
  const tabs = [
    { id: 'home', active: true, render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <polygon points="20,6 33,18 7,18" fill="#D4845C" filter="url(#felt-fuzz)" />
        <rect x="9" y="18" width="22" height="14" rx="2" fill="#E8C9A6" filter="url(#felt-fuzz)" />
        <rect x="17" y="22" width="6" height="10" rx="1.5" fill="#7A3014" filter="url(#felt-fuzz)" />
        {/* Stitch lines */}
        <path d="M9 18 L 31 18" stroke="#7A3014" strokeWidth="0.8" strokeDasharray="1.5 1.2" opacity="0.7" />
      </svg>
    )},
    { id: 'health', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <path d="M20 32 C 8 22, 8 11, 14 11 C 17 11, 20 14, 20 17 C 20 14, 23 11, 26 11 C 32 11, 32 22, 20 32 Z" fill="#E85D2A" filter="url(#felt-fuzz)" />
        <path d="M20 32 C 8 22, 8 11, 14 11 C 17 11, 20 14, 20 17 C 20 14, 23 11, 26 11 C 32 11, 32 22, 20 32 Z" fill="none" stroke="#7A3014" strokeWidth="0.8" strokeDasharray="1.5 1.2" opacity="0.6" />
      </svg>
    )},
    { id: 'pack', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <ellipse cx="20" cy="26" rx="9" ry="7" fill="#C77A4F" filter="url(#felt-fuzz)" />
        <circle cx="11" cy="16" r="3.5" fill="#C77A4F" filter="url(#felt-fuzz)" />
        <circle cx="20" cy="11" r="3.5" fill="#C77A4F" filter="url(#felt-fuzz)" />
        <circle cx="29" cy="16" r="3.5" fill="#C77A4F" filter="url(#felt-fuzz)" />
      </svg>
    )},
    { id: 'bell', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <path d="M20 8 C 13 8, 11 14, 11 22 L 9 26 L 31 26 L 29 22 C 29 14, 27 8, 20 8 Z" fill="#D4A04F" filter="url(#felt-fuzz)" />
        <ellipse cx="20" cy="30" rx="3" ry="2" fill="#D4A04F" filter="url(#felt-fuzz)" />
      </svg>
    )},
  ];
  return (
    <div className="flex justify-around items-center bg-[#FFF7EE] rounded-full px-4 py-2 shadow-[0_4px_20px_rgba(122,48,20,0.08)] border border-[#E8C9A6]/40">
      {tabs.map((t) => (
        <div key={t.id} className="flex flex-col items-center gap-1">
          {t.render()}
          <span className={`text-[9px] font-semibold ${t.active ? 'text-[#7A3014]' : 'text-[#A89070]'}`}>
            {t.id === 'home' ? 'Home' : t.id === 'health' ? 'Health' : t.id === 'pack' ? 'Pack' : 'Reminders'}
          </span>
        </div>
      ))}
    </div>
  );
};

const FeltEmptyState = () => (
  <div className="flex flex-col items-center text-center pt-6 pb-4">
    <svg viewBox="0 0 200 160" width="180" height="144">
      <ellipse cx="100" cy="138" rx="70" ry="8" fill="#7A5230" opacity="0.12" />
      {/* Felt syringe — fluffy, hand-stitched feel */}
      <rect x="60" y="48" width="80" height="44" rx="8" fill="#F4D9BC" filter="url(#felt-fuzz)" />
      <rect x="38" y="56" width="24" height="28" rx="6" fill="#E85D2A" filter="url(#felt-fuzz)" />
      <rect x="140" y="62" width="14" height="16" rx="3" fill="#F4D9BC" filter="url(#felt-fuzz)" />
      <rect x="154" y="68" width="28" height="4" rx="2" fill="#A89070" />
      {/* Stitch outline */}
      <rect x="60" y="48" width="80" height="44" rx="8" fill="none" stroke="#7A3014" strokeWidth="1.2" strokeDasharray="2 2" opacity="0.5" />
      <rect x="38" y="56" width="24" height="28" rx="6" fill="none" stroke="#7A3014" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      {/* Marks */}
      <circle cx="80" cy="70" r="1.5" fill="#7A3014" opacity="0.7" />
      <circle cx="100" cy="70" r="1.5" fill="#7A3014" opacity="0.7" />
      <circle cx="120" cy="70" r="1.5" fill="#7A3014" opacity="0.7" />
    </svg>
    <h4 className="text-[15px] font-semibold text-[#7A3014] mt-4">No vaccines yet</h4>
    <p className="text-[12px] text-[#A57050] mt-1 px-4 leading-snug">Add Bobby's first one — we'll remind you when the next is due.</p>
  </div>
);

const FeltReminderCard = () => (
  <div className="flex items-center bg-[#FFF7EE] rounded-[20px] p-4 gap-3 border border-[#E8C9A6]/50 shadow-[0_2px_8px_rgba(122,48,20,0.06)]">
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-[#7A3014] leading-tight">Bobby's rabies booster</p>
      <p className="text-[11px] text-[#A57050] mt-1">in 14 days · Dr Müller</p>
    </div>
    <svg viewBox="0 0 80 80" width="56" height="56">
      <rect x="14" y="20" width="52" height="52" rx="8" fill="#D4845C" filter="url(#felt-fuzz)" />
      <rect x="18" y="28" width="44" height="40" rx="4" fill="#FFF1DD" filter="url(#felt-fuzz)" />
      <rect x="14" y="20" width="52" height="52" rx="8" fill="none" stroke="#7A3014" strokeWidth="1" strokeDasharray="2 2" opacity="0.5" />
      <rect x="22" y="14" width="3" height="14" rx="1.5" fill="#5E3018" />
      <rect x="55" y="14" width="3" height="14" rx="1.5" fill="#5E3018" />
      <text x="40" y="52" textAnchor="middle" fontSize="18" fontWeight="700" fill="#E85D2A" fontFamily="Inter">14</text>
      <text x="40" y="63" textAnchor="middle" fontSize="6" fontWeight="600" fill="#A57050" fontFamily="Inter">DAYS</text>
    </svg>
  </div>
);

const FeltPackCluster = () => {
  const heads = [
    { dx: 0, body: '#D4845C' },
    { dx: 30, body: '#C9956C' },
    { dx: 60, body: '#A86A45' },
  ];
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-[100px] h-[44px]">
        {heads.map((h, i) => (
          <svg key={i} viewBox="0 0 50 50" width="44" height="44" style={{ position: 'absolute', left: h.dx, top: 0 }}>
            <circle cx="25" cy="25" r="20" fill="#FFF7EE" />
            <circle cx="25" cy="26" r="18" fill={h.body} filter="url(#felt-fuzz)" />
            <ellipse cx="11" cy="18" rx="5" ry="7" fill={h.body} filter="url(#felt-fuzz)" />
            <ellipse cx="39" cy="18" rx="5" ry="7" fill={h.body} filter="url(#felt-fuzz)" />
            <circle cx="25" cy="26" r="18" fill="none" stroke="#7A3014" strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.5" />
            <circle cx="20" cy="25" r="1.5" fill="#3a1f10" />
            <circle cx="30" cy="25" r="1.5" fill="#3a1f10" />
            <ellipse cx="25" cy="32" rx="2" ry="1.2" fill="#3a1f10" />
          </svg>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#7A3014] leading-tight">Your Fylos pack</p>
        <p className="text-[11px] text-[#A57050] mt-1">3 friends nearby</p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// VARIANT C · WATERCOLOR
// -------------------------------------------------------------------------
const WatercolorTabBar = () => {
  const tabs = [
    { id: 'home', active: true, render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <polygon points="20,6 33,18 7,18" fill="#E89A75" opacity="0.85" filter="url(#watercolor-wash)" />
        <rect x="9" y="18" width="22" height="14" rx="2" fill="#F4D9BC" opacity="0.85" filter="url(#watercolor-wash)" />
        <rect x="17" y="22" width="6" height="10" rx="1.5" fill="#A55E3F" opacity="0.8" filter="url(#watercolor-wash)" />
      </svg>
    )},
    { id: 'health', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <path d="M20 32 C 8 22, 8 11, 14 11 C 17 11, 20 14, 20 17 C 20 14, 23 11, 26 11 C 32 11, 32 22, 20 32 Z" fill="#E85D2A" opacity="0.78" filter="url(#watercolor-wash)" />
        <path d="M20 32 C 8 22, 8 11, 14 11 C 17 11, 20 14, 20 17 C 20 14, 23 11, 26 11 C 32 11, 32 22, 20 32 Z" fill="#FF7A4D" opacity="0.45" filter="url(#watercolor-wash)" transform="translate(1.5 1.5)" />
      </svg>
    )},
    { id: 'pack', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <ellipse cx="20" cy="26" rx="9" ry="7" fill="#C77A4F" opacity="0.8" filter="url(#watercolor-wash)" />
        <circle cx="11" cy="16" r="3.5" fill="#C77A4F" opacity="0.8" filter="url(#watercolor-wash)" />
        <circle cx="20" cy="11" r="3.5" fill="#C77A4F" opacity="0.8" filter="url(#watercolor-wash)" />
        <circle cx="29" cy="16" r="3.5" fill="#C77A4F" opacity="0.8" filter="url(#watercolor-wash)" />
      </svg>
    )},
    { id: 'bell', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <path d="M20 8 C 13 8, 11 14, 11 22 L 9 26 L 31 26 L 29 22 C 29 14, 27 8, 20 8 Z" fill="#E8B872" opacity="0.85" filter="url(#watercolor-wash)" />
        <ellipse cx="20" cy="30" rx="3" ry="2" fill="#E8B872" opacity="0.85" filter="url(#watercolor-wash)" />
      </svg>
    )},
  ];
  return (
    <div className="flex justify-around items-center bg-[#FCF8F2] rounded-full px-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-black/[0.04]">
      {tabs.map((t) => (
        <div key={t.id} className="flex flex-col items-center gap-1">
          {t.render()}
          <span className={`text-[9px] font-semibold ${t.active ? 'text-[#A55E3F]' : 'text-[#A89886]'}`}>
            {t.id === 'home' ? 'Home' : t.id === 'health' ? 'Health' : t.id === 'pack' ? 'Pack' : 'Reminders'}
          </span>
        </div>
      ))}
    </div>
  );
};

const WatercolorEmptyState = () => (
  <div className="flex flex-col items-center text-center pt-6 pb-4">
    <svg viewBox="0 0 200 160" width="180" height="144">
      <ellipse cx="100" cy="138" rx="70" ry="8" fill="#A55E3F" opacity="0.12" filter="url(#watercolor-wash)" />
      {/* Watercolor washes — multiple layers with different opacities */}
      <rect x="60" y="48" width="80" height="44" rx="8" fill="#F4D9BC" opacity="0.85" filter="url(#watercolor-wash)" />
      <rect x="60" y="48" width="80" height="44" rx="8" fill="#FFE6D2" opacity="0.4" filter="url(#watercolor-wash)" transform="translate(2 -1)" />
      <rect x="38" y="56" width="24" height="28" rx="6" fill="#E85D2A" opacity="0.75" filter="url(#watercolor-wash)" />
      <rect x="38" y="56" width="24" height="28" rx="6" fill="#FF7A4D" opacity="0.4" filter="url(#watercolor-wash)" transform="translate(1.5 1)" />
      <rect x="140" y="62" width="14" height="16" rx="3" fill="#F4D9BC" opacity="0.8" filter="url(#watercolor-wash)" />
      <rect x="154" y="68" width="28" height="4" rx="2" fill="#A89886" opacity="0.85" />
      {/* Soft brush splatter */}
      <circle cx="50" cy="40" r="3" fill="#E85D2A" opacity="0.2" filter="url(#watercolor-wash)" />
      <circle cx="160" cy="100" r="4" fill="#E89A75" opacity="0.25" filter="url(#watercolor-wash)" />
      <circle cx="170" cy="50" r="2" fill="#E85D2A" opacity="0.15" filter="url(#watercolor-wash)" />
    </svg>
    <h4 className="text-[15px] font-semibold text-[#A55E3F] mt-4">No vaccines yet</h4>
    <p className="text-[12px] text-[#A89886] mt-1 px-4 leading-snug">Add Bobby's first one — we'll remind you when the next is due.</p>
  </div>
);

const WatercolorReminderCard = () => (
  <div className="flex items-center bg-[#FCF8F2] rounded-[20px] p-4 gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.03]">
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-[#A55E3F] leading-tight">Bobby's rabies booster</p>
      <p className="text-[11px] text-[#A89886] mt-1">in 14 days · Dr Müller</p>
    </div>
    <svg viewBox="0 0 80 80" width="56" height="56">
      <rect x="14" y="20" width="52" height="52" rx="6" fill="#D4845C" opacity="0.78" filter="url(#watercolor-wash)" />
      <rect x="14" y="20" width="52" height="52" rx="6" fill="#E89A75" opacity="0.4" filter="url(#watercolor-wash)" transform="translate(2 -1)" />
      <rect x="18" y="28" width="44" height="40" rx="3" fill="#FFFAF5" opacity="0.92" filter="url(#watercolor-wash)" />
      <rect x="22" y="14" width="3" height="14" rx="1.5" fill="#7A3014" opacity="0.8" />
      <rect x="55" y="14" width="3" height="14" rx="1.5" fill="#7A3014" opacity="0.8" />
      <text x="40" y="52" textAnchor="middle" fontSize="18" fontWeight="700" fill="#E85D2A" fontFamily="Inter" opacity="0.92">14</text>
      <text x="40" y="63" textAnchor="middle" fontSize="6" fontWeight="600" fill="#A89886" fontFamily="Inter">DAYS</text>
    </svg>
  </div>
);

const WatercolorPackCluster = () => {
  const heads = [
    { dx: 0, body: '#E89A75' },
    { dx: 30, body: '#D4B07A' },
    { dx: 60, body: '#C77A4F' },
  ];
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-[100px] h-[44px]">
        {heads.map((h, i) => (
          <svg key={i} viewBox="0 0 50 50" width="44" height="44" style={{ position: 'absolute', left: h.dx, top: 0 }}>
            <circle cx="25" cy="25" r="20" fill="#FCF8F2" />
            <circle cx="25" cy="26" r="18" fill={h.body} opacity="0.78" filter="url(#watercolor-wash)" />
            <circle cx="25" cy="26" r="18" fill={h.body} opacity="0.35" filter="url(#watercolor-wash)" transform="translate(1.5 -1)" />
            <ellipse cx="11" cy="18" rx="5" ry="7" fill={h.body} opacity="0.8" filter="url(#watercolor-wash)" />
            <ellipse cx="39" cy="18" rx="5" ry="7" fill={h.body} opacity="0.8" filter="url(#watercolor-wash)" />
            <circle cx="20" cy="25" r="1.5" fill="#3a1f10" opacity="0.85" />
            <circle cx="30" cy="25" r="1.5" fill="#3a1f10" opacity="0.85" />
            <ellipse cx="25" cy="32" rx="2" ry="1.2" fill="#3a1f10" opacity="0.85" />
          </svg>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#A55E3F] leading-tight">Your Fylos pack</p>
        <p className="text-[11px] text-[#A89886] mt-1">3 friends nearby</p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// VARIANT D · ORIGAMI
// -------------------------------------------------------------------------
const OrigamiTabBar = () => {
  const tabs = [
    { id: 'home', active: true, render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        {/* Roof — two facets */}
        <polygon points="20,6 33,18 20,18" fill="#E85D2A" filter="url(#origami-shadow)" />
        <polygon points="20,6 7,18 20,18" fill="#FF7A4D" filter="url(#origami-shadow)" />
        {/* Wall — two facets */}
        <polygon points="9,18 20,18 20,32 9,32" fill="#F4D9BC" filter="url(#origami-shadow)" />
        <polygon points="20,18 31,18 31,32 20,32" fill="#E8C9A6" filter="url(#origami-shadow)" />
        {/* Door */}
        <polygon points="17,22 23,22 23,32 17,32" fill="#7A3014" />
      </svg>
    )},
    { id: 'health', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        {/* Heart as folded facets */}
        <polygon points="20,32 8,18 14,11 20,17" fill="#FF7A4D" filter="url(#origami-shadow)" />
        <polygon points="20,32 32,18 26,11 20,17" fill="#E85D2A" filter="url(#origami-shadow)" />
      </svg>
    )},
    { id: 'pack', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <polygon points="20,20 11,29 29,29" fill="#E89A75" filter="url(#origami-shadow)" />
        <polygon points="20,20 29,29 29,20" fill="#C77A4F" filter="url(#origami-shadow)" />
        <polygon points="11,16 8,12 14,12" fill="#E89A75" filter="url(#origami-shadow)" />
        <polygon points="20,11 17,7 23,7" fill="#E89A75" filter="url(#origami-shadow)" />
        <polygon points="29,16 26,12 32,12" fill="#E89A75" filter="url(#origami-shadow)" />
      </svg>
    )},
    { id: 'bell', render: () => (
      <svg viewBox="0 0 40 40" width="32" height="32">
        <polygon points="20,8 11,26 20,26" fill="#E8B872" filter="url(#origami-shadow)" />
        <polygon points="20,8 29,26 20,26" fill="#C68D44" filter="url(#origami-shadow)" />
        <polygon points="9,26 31,26 28,30 12,30" fill="#94632A" filter="url(#origami-shadow)" />
      </svg>
    )},
  ];
  return (
    <div className="flex justify-around items-center bg-white rounded-[16px] px-4 py-2 shadow-[3px_5px_0_rgba(58,31,16,0.12)] border border-black/[0.06]">
      {tabs.map((t) => (
        <div key={t.id} className="flex flex-col items-center gap-1">
          {t.render()}
          <span className={`text-[9px] font-semibold ${t.active ? 'text-[#E85D2A]' : 'text-[#9A9AA0]'}`}>
            {t.id === 'home' ? 'Home' : t.id === 'health' ? 'Health' : t.id === 'pack' ? 'Pack' : 'Reminders'}
          </span>
        </div>
      ))}
    </div>
  );
};

const OrigamiEmptyState = () => (
  <div className="flex flex-col items-center text-center pt-6 pb-4">
    <svg viewBox="0 0 200 160" width="180" height="144">
      <polygon points="40,138 160,138 150,144 50,144" fill="#3a1f10" opacity="0.1" />
      {/* Origami syringe — faceted */}
      <polygon points="60,48 140,48 140,68 60,68" fill="#FFE6D2" filter="url(#origami-shadow)" />
      <polygon points="60,68 140,68 140,92 60,92" fill="#E8C9A6" filter="url(#origami-shadow)" />
      <polygon points="38,56 62,56 62,82 38,82" fill="#FF7A4D" filter="url(#origami-shadow)" />
      <polygon points="38,56 62,56 62,68 38,68" fill="#E85D2A" filter="url(#origami-shadow)" />
      <polygon points="140,62 154,62 154,78 140,78" fill="#F4D9BC" filter="url(#origami-shadow)" />
      <polygon points="154,68 182,68 182,72 154,72" fill="#9A9AA0" />
      {/* Marks */}
      <polygon points="78,76 82,76 82,82 78,82" fill="#7A3014" />
      <polygon points="98,76 102,76 102,82 98,82" fill="#7A3014" />
      <polygon points="118,76 122,76 122,82 118,82" fill="#7A3014" />
    </svg>
    <h4 className="text-[15px] font-semibold text-[#111] mt-4">No vaccines yet</h4>
    <p className="text-[12px] text-[#6E6E73] mt-1 px-4 leading-snug">Add Bobby's first one — we'll remind you when the next is due.</p>
  </div>
);

const OrigamiReminderCard = () => (
  <div className="flex items-center bg-white rounded-[16px] p-4 gap-3 border border-black/[0.06] shadow-[3px_5px_0_rgba(58,31,16,0.08)]">
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-[#111] leading-tight">Bobby's rabies booster</p>
      <p className="text-[11px] text-[#6E6E73] mt-1">in 14 days · Dr Müller</p>
    </div>
    <svg viewBox="0 0 80 80" width="56" height="56">
      <polygon points="14,20 66,20 66,46 14,46" fill="#FF7A4D" filter="url(#origami-shadow)" />
      <polygon points="14,46 66,46 66,72 14,72" fill="#E85D2A" filter="url(#origami-shadow)" />
      <polygon points="18,28 62,28 62,68 18,68" fill="#FFFAF5" />
      <polygon points="22,14 25,14 25,28 22,28" fill="#7A3014" />
      <polygon points="55,14 58,14 58,28 55,28" fill="#7A3014" />
      <text x="40" y="52" textAnchor="middle" fontSize="18" fontWeight="700" fill="#E85D2A" fontFamily="Inter">14</text>
      <text x="40" y="63" textAnchor="middle" fontSize="6" fontWeight="600" fill="#6E6E73" fontFamily="Inter">DAYS</text>
    </svg>
  </div>
);

const OrigamiPackCluster = () => {
  const heads = [
    { dx: 0, c1: '#FF7A4D', c2: '#E85D2A' },
    { dx: 30, c1: '#E8B872', c2: '#C68D44' },
    { dx: 60, c1: '#E89A75', c2: '#A55E3F' },
  ];
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-[100px] h-[44px]">
        {heads.map((h, i) => (
          <svg key={i} viewBox="0 0 50 50" width="44" height="44" style={{ position: 'absolute', left: h.dx, top: 0 }}>
            <circle cx="25" cy="25" r="20" fill="white" />
            <polygon points="25,8 43,25 25,42 7,25" fill={h.c1} filter="url(#origami-shadow)" />
            <polygon points="25,8 43,25 25,25" fill={h.c2} filter="url(#origami-shadow)" />
            <polygon points="7,12 14,12 11,18" fill={h.c1} filter="url(#origami-shadow)" />
            <polygon points="36,12 43,12 39,18" fill={h.c1} filter="url(#origami-shadow)" />
            <polygon points="22,24 28,24 28,28 22,28" fill="#3a1f10" />
            <polygon points="22,32 28,32 26,35 24,35" fill="#3a1f10" />
          </svg>
        ))}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-[#111] leading-tight">Your Fylos pack</p>
        <p className="text-[11px] text-[#6E6E73] mt-1">3 friends nearby</p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// COLUMN WRAPPER
// -------------------------------------------------------------------------
const VariantColumn = ({ letter, name, vibe, accent, bg, children }) => (
  <div className="flex flex-col rounded-[24px] overflow-hidden border border-black/[0.06]" style={{ background: bg }}>
    <div className="px-5 py-4 border-b border-black/[0.04] flex items-center gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold text-white" style={{ background: accent }}>
        {letter}
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold text-[#111] leading-tight">{name}</h3>
        <p className="text-[11px] text-[#6E6E73] leading-tight mt-0.5">{vibe}</p>
      </div>
    </div>
    <div className="flex flex-col gap-5 p-5">
      {children}
    </div>
  </div>
);

const Section = ({ label, children }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-[#9A9AA0] mb-2">{label}</p>
    {children}
  </div>
);

// -------------------------------------------------------------------------
// MAIN
// -------------------------------------------------------------------------
export default function IconographyLab() {
  return (
    <div className="min-h-screen w-full bg-[#FAF7F2]" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <SharedFilters />

      {/* Page header */}
      <header className="px-8 py-6 border-b border-black/[0.05] bg-white/60 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto">
          <h1 className="text-[22px] font-bold text-[#111] tracking-tight">Fylos · Iconography Lab</h1>
          <p className="text-[13px] text-[#6E6E73] mt-1">Same content · 4 material directions · pick the DNA, then we go custom.</p>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* A · CERAMIC */}
          <VariantColumn letter="A" name="Ceramic" vibe="Matte glazed pottery · warm + premium" accent="#A55E3F" bg="#FFFCF8">
            <Section label="Tab bar"><CeramicTabBar /></Section>
            <Section label="Empty state"><CeramicEmptyState /></Section>
            <Section label="Reminder card"><CeramicReminderCard /></Section>
            <Section label="Pack cluster"><CeramicPackCluster /></Section>
          </VariantColumn>

          {/* B · FELT/PLUSH */}
          <VariantColumn letter="B" name="Felt / Plush" vibe="Hand-stitched textile · pet-coded warmth" accent="#7A3014" bg="#FFF7EE">
            <Section label="Tab bar"><FeltTabBar /></Section>
            <Section label="Empty state"><FeltEmptyState /></Section>
            <Section label="Reminder card"><FeltReminderCard /></Section>
            <Section label="Pack cluster"><FeltPackCluster /></Section>
          </VariantColumn>

          {/* C · WATERCOLOR */}
          <VariantColumn letter="C" name="Watercolor" vibe="Hand-painted washes · artisan + European" accent="#A55E3F" bg="#FCF9F4">
            <Section label="Tab bar"><WatercolorTabBar /></Section>
            <Section label="Empty state"><WatercolorEmptyState /></Section>
            <Section label="Reminder card"><WatercolorReminderCard /></Section>
            <Section label="Pack cluster"><WatercolorPackCluster /></Section>
          </VariantColumn>

          {/* D · ORIGAMI */}
          <VariantColumn letter="D" name="Origami" vibe="Folded paper facets · graphic + scalable" accent="#E85D2A" bg="#FFFFFF">
            <Section label="Tab bar"><OrigamiTabBar /></Section>
            <Section label="Empty state"><OrigamiEmptyState /></Section>
            <Section label="Reminder card"><OrigamiReminderCard /></Section>
            <Section label="Pack cluster"><OrigamiPackCluster /></Section>
          </VariantColumn>

        </div>

        {/* Footer note */}
        <div className="mt-10 max-w-3xl mx-auto text-center px-6">
          <p className="text-[12px] text-[#6E6E73] leading-relaxed">
            <strong className="text-[#111]">These are gestures, not final art.</strong> Real production assets would be 3D-rendered (Cinema4D / Blender) for A/B,
            painted assets for C, vector for D. The point here is to feel which <em>material language</em> resonates with Fylos before we invest in 50+ unique illustrations.
          </p>
        </div>
      </main>
    </div>
  );
}
