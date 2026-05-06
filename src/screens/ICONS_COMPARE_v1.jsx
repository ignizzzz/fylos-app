import React from 'react';
import {
  PawPrint, Heart, Syringe, Pill, Bone, Scale,
  Calendar, Bell, MapPin, Home, Users, Camera,
} from 'lucide-react';

import {
  FeltDefs,
  IconPaw, IconHeart, IconSyringe, IconPill, IconBone, IconScale,
  IconCalendar, IconBell, IconMapPin, IconHouse, IconPack, IconCamera,
} from './FELT_ICON_SYSTEM_v1';

/* =========================================================================
   FYLOS · Icons Compare — current (lucide line) vs felt (proposed)
   Same 12 anchors · side-by-side for the eye to judge
   ========================================================================= */

// -------------------------------------------------------------------------
// Pairs: each row matches a current lucide icon to its felt counterpart
// -------------------------------------------------------------------------
const PAIRS = [
  { id: 'paw',      name: 'Paw',       hint: 'Pet identity',      Lucide: PawPrint, Felt: IconPaw,      anim: 'fl-press' },
  { id: 'heart',    name: 'Heart',     hint: 'Wellness · health', Lucide: Heart,    Felt: IconHeart,    anim: 'fl-heartbeat' },
  { id: 'syringe',  name: 'Syringe',   hint: 'Vaccine reminder',  Lucide: Syringe,  Felt: IconSyringe,  anim: 'fl-tilt' },
  { id: 'pill',     name: 'Pill',      hint: 'Medication',        Lucide: Pill,     Felt: IconPill,     anim: 'fl-wobble' },
  { id: 'bone',     name: 'Bone',      hint: 'Treats · food',     Lucide: Bone,     Felt: IconBone,     anim: 'fl-gnaw' },
  { id: 'scale',    name: 'Scale',     hint: 'Weight tracking',   Lucide: Scale,    Felt: IconScale,    anim: 'fl-pendulum' },
  { id: 'calendar', name: 'Calendar',  hint: 'Date · countdown',  Lucide: Calendar, Felt: IconCalendar, anim: 'fl-flip' },
  { id: 'bell',     name: 'Bell',      hint: 'Notification',      Lucide: Bell,     Felt: IconBell,     anim: 'fl-ring' },
  { id: 'pin',      name: 'Map pin',   hint: 'Place · location',  Lucide: MapPin,   Felt: IconMapPin,   anim: 'fl-drop' },
  { id: 'house',    name: 'House',     hint: 'Home · base',       Lucide: Home,     Felt: IconHouse,    anim: 'fl-breathe' },
  { id: 'pack',     name: 'Pack',      hint: 'Friends · social',  Lucide: Users,    Felt: IconPack,     anim: 'fl-wave' },
  { id: 'camera',   name: 'Camera',    hint: 'Memory · photo',    Lucide: Camera,   Felt: IconCamera,   anim: 'fl-flash' },
];

// -------------------------------------------------------------------------
// COMPARISON CARD — 1 icon, current on left, felt on right
// -------------------------------------------------------------------------
const CompareCard = ({ pair }) => {
  const { Lucide, Felt, name, hint, anim } = pair;
  return (
    <div className="flex flex-col items-stretch rounded-[28px] bg-white/60 backdrop-blur-sm border border-[#E8C9A6]/40 overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-[#E8C9A6]/40">
        {/* Current — lucide line icon */}
        <div className="flex flex-col items-center justify-center py-8 px-2 bg-white/40 relative">
          <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest text-[#9A9AA0]">Now</span>
          <div className="w-[140px] h-[140px] flex items-center justify-center">
            <Lucide size={88} strokeWidth={1.6} color="#E85D2A" />
          </div>
        </div>
        {/* Felt — proposed */}
        <div className="flex flex-col items-center justify-center py-8 px-2 bg-[#FFF7EE]/50 relative">
          <span className="absolute top-3 left-3 text-[9px] font-bold uppercase tracking-widest text-[#A55E3F]">Felt</span>
          <div className={`w-[140px] h-[140px] flex items-center justify-center ${anim}`}>
            <Felt />
          </div>
        </div>
      </div>
      {/* Label */}
      <div className="text-center px-3 py-3 border-t border-[#E8C9A6]/40 bg-white/30">
        <p className="text-[14px] font-semibold text-[#7A3014]">{name}</p>
        <p className="text-[11px] text-[#A57050] mt-0.5">{hint}</p>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// MAIN
// -------------------------------------------------------------------------
export default function IconsCompare() {
  return (
    <div className="min-h-screen w-full" style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'radial-gradient(ellipse at top, #FFF7EE 0%, #F7E9D6 100%)',
    }}>
      <FeltDefs />

      {/* Inline keyframes — copied from FELT_ICON_SYSTEM_v1 (same animations) */}
      <style>{`
        .fl-icon { width: 100%; height: 100%; }

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
      `}</style>

      {/* Page header */}
      <header className="px-8 py-6 border-b border-[#E8C9A6]/50 bg-[#FFF7EE]/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-[#7A3014] tracking-tight">Fylos · Icons · Now vs Felt</h1>
            <p className="text-[13px] text-[#A57050] mt-1">Same 12 anchors · current lucide line on left · proposed felt on right</p>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#9A9AA0]">Now</p>
              <p className="text-[12px] font-semibold text-[#7A3014]">Lucide line · 88px</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#A55E3F]">Felt</p>
              <p className="text-[12px] font-semibold text-[#7A3014]">Plush · animated</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {PAIRS.map((pair) => (
            <CompareCard key={pair.id} pair={pair} />
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 max-w-2xl mx-auto text-center px-6 pb-10">
          <p className="text-[12px] text-[#A57050] leading-relaxed">
            <strong className="text-[#7A3014]">Side by side</strong> at hero scale. Lucide line icons (current) are crisp & functional but generic — they could live in any app.
            Felt versions carry Fylos identity but cost more to produce. The judgment call: <em>does the warmth premium justify the production cost?</em>
          </p>
        </div>
      </main>
    </div>
  );
}
