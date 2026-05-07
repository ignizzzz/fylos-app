import React from 'react';
import {
  PawPrint, Droplets, Trees, User, Flame, AlertCircle, MapPin,
  UserCheck, Heart, Compass, Coffee, Stethoscope, Scissors, Store,
} from 'lucide-react';
import { AMENITY_META, PLACE_CATEGORIES } from '../../../data/social';

// ──────────────────────────────────────────────────────────────
// PLACES — amenity icon helper

const AMENITY_ICON_MAP = {
  PawPrint, Droplets, Trees, User, Flame, AlertCircle, MapPin,
  UserCheck, Heart, Compass,
};

export const AmenityTag = ({ amenityKey }) => {
  const meta = AMENITY_META[amenityKey];
  if (!meta) return null;
  const Icon = AMENITY_ICON_MAP[meta.icon] || MapPin;
  return (
    <div
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium text-[#6E6058]"
      style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
    >
      <Icon size={11} strokeWidth={2} />
      {meta.label}
    </div>
  );
};

const CATEGORY_ICON_MAP = {
  Trees, Coffee, Stethoscope, Scissors, Store, Compass,
};

export const CategoryBadge = ({ category }) => {
  const meta = PLACE_CATEGORIES.find((c) => c.id === category);
  if (!meta || meta.id === 'all') return null;
  const Icon = CATEGORY_ICON_MAP[meta.iconKey] || MapPin;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10.5px] font-semibold"
      style={{ background: '#FFF8F3', color: '#E85D2A', border: '1px solid #FFD4CC' }}
    >
      <Icon size={10} strokeWidth={2.25} /> {meta.label}
    </span>
  );
};

// Inline map preview — fills its container, pins are positioned using viewBox percentages.
export const PlacesMapPreview = ({ places = [], activeId = null, onPinClick, height = 150, fill = false }) => {
  if (!places.length) return null;
  const box = { w: 350, h: fill ? 600 : height };
  const lats = places.map((p) => p.coords.lat);
  const lngs = places.map((p) => p.coords.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const dLat = Math.max(0.001, maxLat - minLat);
  const dLng = Math.max(0.001, maxLng - minLng);
  const pad = 40;
  const project = (lat, lng) => ({
    xPct: (pad + ((lng - minLng) / dLng) * (box.w - pad * 2)) / box.w * 100,
    yPct: (pad + (1 - (lat - minLat) / dLat) * (box.h - pad * 2)) / box.h * 100,
  });
  const rootStyle = fill
    ? { width: '100%', height: '100%', background: 'linear-gradient(140deg, #E9EEF2 0%, #F0F2F5 100%)' }
    : { height, background: 'linear-gradient(140deg, #E9EEF2 0%, #F0F2F5 100%)', border: '1px solid #EDE8E2' };
  return (
    <div className={`relative w-full overflow-hidden ${fill ? '' : 'rounded-[16px]'}`} style={rootStyle}>
      {/* Grid + fake city geography */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox={`0 0 ${box.w} ${box.h}`}>
        <defs>
          <pattern id="grid-soft" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4DBE0" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-soft)" />
        {/* Roads */}
        <path d={`M 0 ${box.h * 0.55} Q ${box.w * 0.4} ${box.h * 0.35}, ${box.w} ${box.h * 0.6}`} fill="none" stroke="#C8D0D6" strokeWidth="8" strokeLinecap="round" />
        <path d={`M ${box.w * 0.3} 0 L ${box.w * 0.35} ${box.h}`} fill="none" stroke="#C8D0D6" strokeWidth="5" strokeLinecap="round" />
        <path d={`M 0 ${box.h * 0.75} L ${box.w * 0.7} ${box.h * 0.82} L ${box.w} ${box.h * 0.7}`} fill="none" stroke="#D8DEE3" strokeWidth="3" strokeLinecap="round" />
        {/* Water/lake accent */}
        <path d={`M ${box.w * 0.7} 0 Q ${box.w * 0.82} ${box.h * 0.5}, ${box.w} ${box.h}`} fill="rgba(159,196,225,0.45)" />
        {/* Green spots */}
        <circle cx={box.w * 0.15} cy={box.h * 0.25} r="35" fill="rgba(180,215,170,0.4)" />
        <circle cx={box.w * 0.55} cy={box.h * 0.2} r="28" fill="rgba(180,215,170,0.35)" />
      </svg>
      {/* Pins */}
      {places.map((p) => {
        const { xPct, yPct } = project(p.coords.lat, p.coords.lng);
        const active = p.id === activeId;
        return (
          <button
            key={p.id}
            onClick={(e) => { e.stopPropagation(); onPinClick && onPinClick(p); }}
            className="absolute active:scale-[0.9] transition-transform"
            style={{ left: `${xPct}%`, top: `${yPct}%`, transform: 'translate(-50%, -100%)' }}
          >
            <div
              className="flex items-center justify-center"
              style={{
                width: active ? 36 : 26,
                height: active ? 36 : 26,
                borderRadius: '50%',
                background: active ? '#E85D2A' : '#FFF',
                border: active ? '3px solid #FFF' : '2px solid #E85D2A',
                boxShadow: active ? '0 6px 14px rgba(232,93,42,0.45)' : '0 3px 8px rgba(0,0,0,0.2)',
              }}
            >
              <MapPin size={active ? 16 : 11} color={active ? '#FFF' : '#E85D2A'} strokeWidth={2.5} fill={active ? 'none' : 'rgba(232,93,42,0.15)'} />
            </div>
          </button>
        );
      })}
    </div>
  );
};
