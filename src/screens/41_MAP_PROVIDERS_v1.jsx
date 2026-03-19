import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  MapPin,
  Star,
  Check,
  PawPrint,
  Navigation,
  Filter,
  X,
  ChevronRight,
  Clock,
  Heart,
  Phone,
  Calendar,
  User
} from 'lucide-react';

/**
 * 41_MAP_PROVIDERS_v1.jsx
 * Map View screen showing nearby pet service providers (walkers, groomers,
 * vets, trainers) on a simulated Zürich city map. Users browse pins and tap
 * to see provider details in a bottom card.
 */

// --- FYLOS LOGO ---
const FylosLogo = ({
  textColor = '#000000',
  dotColor = '#E85D2A',
  fontSize = '2rem',
  className = ''
}) => (
  <div
    className={className}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `calc(${fontSize} * 0.15)`,
      fontFamily: '"Nunito", sans-serif'
    }}
  >
    <span style={{ fontSize, fontWeight: 800, color: textColor, letterSpacing: '-0.5px', lineHeight: 1 }}>
      FYLOS
    </span>
    <div style={{ width: `calc(${fontSize} * 0.25)`, height: `calc(${fontSize} * 0.25)`, borderRadius: '50%', backgroundColor: dotColor }} />
  </div>
);

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
  radius: {
    full: '9999px',
    large: '24px',
    medium: '16px',
    small: '8px'
  },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)'
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

// --- MOCK PROVIDERS DATA ---
const PROVIDERS = [
  { id: 1, name: 'Sarah M.',      service: 'Dog Walking',   rating: 4.9, reviews: 47,  distance: '0.3 km', price: 'CHF 25/hr', verified: true,  type: 'walker' },
  { id: 2, name: 'Bella Studio',  service: 'Pet Grooming',  rating: 4.7, reviews: 89,  distance: '0.8 km', price: 'CHF 65',    verified: true,  type: 'groomer' },
  { id: 3, name: 'Dr. Weber',     service: 'Veterinary',    rating: 4.8, reviews: 124, distance: '1.2 km', price: 'CHF 80',    verified: true,  type: 'vet' },
  { id: 4, name: 'Anna K.',       service: 'Dog Training',  rating: 4.6, reviews: 31,  distance: '0.5 km', price: 'CHF 45/hr', verified: false, type: 'trainer' },
  { id: 5, name: 'Marco B.',      service: 'Dog Walking',   rating: 4.5, reviews: 22,  distance: '1.0 km', price: 'CHF 22/hr', verified: true,  type: 'walker' },
  { id: 6, name: 'Züri Pets Spa', service: 'Pet Grooming',  rating: 4.9, reviews: 156, distance: '1.5 km', price: 'CHF 75',    verified: true,  type: 'groomer' }
];

// Provider pin positions on the map (x, y within the 390x550 map area)
const PIN_POSITIONS = {
  1: { x: 130, y: 220 },
  2: { x: 260, y: 155 },
  3: { x: 310, y: 310 },
  4: { x: 170, y: 370 },
  5: { x: 80,  y: 300 },
  6: { x: 330, y: 215 }
};

// Pin colors by type
const PIN_COLOR = {
  walker:  '#E85D2A',
  groomer: '#C048B8',
  vet:     '#00C060',
  trainer: '#007AFF'
};

// Pin icon by type — only verified lucide icons
const PinIcon = ({ type, size = 12 }) => {
  const props = { size, strokeWidth: 2.5, color: '#FFFFFF' };
  switch (type) {
    case 'walker':  return <PawPrint {...props} />;
    case 'groomer': return <Star {...props} />;
    case 'vet':     return <Heart {...props} />;
    case 'trainer': return <User {...props} />;
    default:        return <MapPin {...props} />;
  }
};

// Avatar gradient by type
const avatarGradient = (type) => {
  switch (type) {
    case 'walker':  return 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)';
    case 'groomer': return 'linear-gradient(135deg, #E066CC 0%, #C048B8 100%)';
    case 'vet':     return 'linear-gradient(135deg, #33D680 0%, #00C060 100%)';
    case 'trainer': return 'linear-gradient(135deg, #33A8FF 0%, #007AFF 100%)';
    default:        return 'linear-gradient(135deg, #ccc 0%, #999 100%)';
  }
};

const getInitial = (name) => name.charAt(0).toUpperCase();

// Filter categories
const FILTERS = [
  { label: 'All',      value: 'all' },
  { label: 'Walkers',  value: 'walker' },
  { label: 'Groomers', value: 'groomer' },
  { label: 'Vets',     value: 'vet' },
  { label: 'Trainers', value: 'trainer' }
];

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');

    .map-font-brand { font-family: 'Nunito', sans-serif; }
    .map-font-body  { font-family: 'Inter', sans-serif; }

    @keyframes map-userPulse {
      0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(0,122,255,0.5); }
      50%       { transform: scale(1.15); box-shadow: 0 0 0 8px rgba(0,122,255,0); }
    }
    @keyframes map-userRipple {
      0%   { transform: scale(1);   opacity: 0.6; }
      100% { transform: scale(3);   opacity: 0; }
    }
    @keyframes map-userRipple2 {
      0%   { transform: scale(1);   opacity: 0.4; }
      100% { transform: scale(3);   opacity: 0; }
    }

    @keyframes map-pinDrop {
      0%   { transform: translateY(-12px) scale(0.7); opacity: 0; }
      70%  { transform: translateY(3px) scale(1.08); opacity: 1; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    @keyframes map-pinBounce {
      0%, 100% { transform: translateY(0) scale(1.25); }
      40%       { transform: translateY(-6px) scale(1.3); }
    }

    @keyframes map-cardSlide {
      from { transform: translateY(20px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }

    @keyframes map-breathe {
      0%, 100% { box-shadow: 0 -4px 24px rgba(0,0,0,0.06); }
      50%       { box-shadow: 0 -4px 32px rgba(0,0,0,0.10); }
    }

    .map-user-dot {
      animation: map-userPulse 2s ease-in-out infinite;
    }
    .map-user-ripple {
      animation: map-userRipple 2.2s ease-out infinite;
    }
    .map-user-ripple-2 {
      animation: map-userRipple2 2.2s ease-out 0.8s infinite;
    }
    .map-pin-drop {
      animation: map-pinDrop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    .map-pin-selected {
      animation: map-pinBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
    }
    .map-card-slide {
      animation: map-cardSlide 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
    }
    .map-bottom-sheet {
      animation: map-breathe 4s ease-in-out infinite;
    }

    .map-btn {
      transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease;
      cursor: pointer;
      border: none;
      background: none;
      padding: 0;
    }
    .map-btn:active { transform: scale(0.92); }

    .map-chip {
      transition: all ${THEME.motion.tab} ease;
      cursor: pointer;
    }

    .map-scroll::-webkit-scrollbar { display: none; }
    .map-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// --- SIMULATED MAP ---
const SimulatedMap = ({ selectedId, activeFilter, onPinTap }) => {
  const W = 390;
  const H = 550;

  const visibleProviders = PROVIDERS.filter(p =>
    activeFilter === 'all' || p.type === activeFilter
  );

  return (
    <div style={{ position: 'relative', width: `${W}px`, height: `${H}px`, overflow: 'hidden' }}>
      {/* SVG base map — Zürich light pastels */}
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: 'absolute', inset: 0 }}
      >
        {/* Background */}
        <rect width={W} height={H} fill="#EEF0E8" />

        {/* Zürich Lake */}
        <path
          d={`M 0 ${H - 90} Q 100 ${H - 110} 200 ${H - 95} Q 300 ${H - 80} ${W} ${H - 100} L ${W} ${H} L 0 ${H} Z`}
          fill="#AED6F1"
          opacity="0.75"
        />
        <line x1="30"  y1={H - 55} x2="110" y2={H - 60} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <line x1="140" y1={H - 48} x2="240" y2={H - 52} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <line x1="270" y1={H - 42} x2="360" y2={H - 46} stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />

        {/* Parks */}
        <rect x="250" y="60"  width="130" height="160" rx="22" fill="#C8DBA0" opacity="0.82" />
        <rect x="268" y="78"  width="90"  height="120" rx="14" fill="#B4D088" opacity="0.6" />
        <ellipse cx="85" cy="195" rx="18" ry="42" fill="#C8DBA0" opacity="0.78" />
        <rect x="40"  y="310" width="55" height="40"  rx="10" fill="#C8DBA0" opacity="0.65" />

        {/* Building blocks */}
        <rect x="18"  y="55"  width="55" height="48" rx="6" fill="#D8D8D0" opacity="0.8" />
        <rect x="85"  y="40"  width="48" height="42" rx="6" fill="#DADAD2" opacity="0.75" />
        <rect x="145" y="52"  width="42" height="44" rx="6" fill="#D5D5CC" opacity="0.8" />
        <rect x="200" y="45"  width="38" height="46" rx="6" fill="#D8D8D0" opacity="0.75" />
        <rect x="18"  y="125" width="38" height="50" rx="6" fill="#DEDEDD" opacity="0.75" />
        <rect x="20"  y="200" width="28" height="38" rx="5" fill="#D8D8D0" opacity="0.7" />
        <rect x="18"  y="260" width="25" height="38" rx="4" fill="#DADAD2" opacity="0.7" />
        <rect x="145" y="125" width="50" height="50" rx="6" fill="#D8D8D0" opacity="0.75" />
        <rect x="140" y="195" width="55" height="42" rx="6" fill="#DADAD2" opacity="0.8" />
        <rect x="150" y="260" width="48" height="45" rx="6" fill="#D5D5CC" opacity="0.75" />
        <rect x="250" y="245" width="55" height="48" rx="6" fill="#DEDEDD" opacity="0.8" />
        <rect x="320" y="240" width="50" height="55" rx="6" fill="#D8D8D0" opacity="0.75" />
        <rect x="320" y="130" width="52" height="60" rx="6" fill="#DADAD2" opacity="0.8" />
        <rect x="325" y="52"  width="48" height="50" rx="6" fill="#D5D5CC" opacity="0.75" />
        <rect x="55"  y="395" width="50" height="48" rx="6" fill="#D8D8D0" opacity="0.8" />
        <rect x="120" y="390" width="58" height="50" rx="6" fill="#DADAD2" opacity="0.75" />
        <rect x="190" y="385" width="52" height="52" rx="6" fill="#D5D5CC" opacity="0.8" />
        <rect x="260" y="375" width="60" height="58" rx="6" fill="#DEDEDD" opacity="0.75" />
        <rect x="335" y="370" width="48" height="55" rx="6" fill="#D8D8D0" opacity="0.8" />

        {/* Major roads */}
        <line x1="0" y1="100" x2={W} y2="100" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="0" y1="185" x2={W} y2="185" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="0" y1="255" x2={W} y2="255" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="0" y1="340" x2={W} y2="340" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="0" y1="430" x2={W} y2="430" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="65"  y1="0" x2="65"  y2={H} stroke="#FFFFFF" strokeWidth="7" />
        <line x1="155" y1="0" x2="155" y2={H} stroke="#FFFFFF" strokeWidth="7" />
        <line x1="248" y1="0" x2="248" y2={H} stroke="#FFFFFF" strokeWidth="7" />
        <line x1="330" y1="0" x2="330" y2={H} stroke="#FFFFFF" strokeWidth="7" />

        {/* Road centre dashes */}
        {[100, 185, 255, 340, 430].map(y => (
          <line key={`dh-${y}`} x1="0" y1={y} x2={W} y2={y} stroke="#F0EDDE" strokeWidth="1" strokeDasharray="8,8" />
        ))}
        {[65, 155, 248, 330].map(x => (
          <line key={`dv-${x}`} x1={x} y1="0" x2={x} y2={H} stroke="#F0EDDE" strokeWidth="1" strokeDasharray="8,8" />
        ))}

        {/* Minor roads */}
        <line x1="0"   y1="142" x2={W}   y2="142" stroke="#F5F5EF" strokeWidth="4" />
        <line x1="0"   y1="220" x2={W}   y2="220" stroke="#F5F5EF" strokeWidth="4" />
        <line x1="0"   y1="300" x2={W}   y2="300" stroke="#F5F5EF" strokeWidth="4" />
        <line x1="0"   y1="390" x2={W}   y2="390" stroke="#F5F5EF" strokeWidth="4" />
        <line x1="110" y1="0"   x2="110" y2={H}   stroke="#F5F5EF" strokeWidth="4" />
        <line x1="200" y1="0"   x2="200" y2={H}   stroke="#F5F5EF" strokeWidth="4" />
        <line x1="290" y1="0"   x2="290" y2={H}   stroke="#F5F5EF" strokeWidth="4" />

        {/* Diagonal road */}
        <line x1="40" y1="145" x2="155" y2="255" stroke="#FFFFFF" strokeWidth="5" />
        <line x1="40" y1="145" x2="155" y2="255" stroke="#F0EDDE" strokeWidth="1" strokeDasharray="6,8" />

        {/* Area labels */}
        <g>
          <rect x="64" y="162" width="62" height="17" rx="5" fill="rgba(255,255,255,0.82)" />
          <text x="95" y="174" textAnchor="middle" fontSize="9" fontFamily="Inter,sans-serif" fontWeight="700" fill="#444">
            Zürich HB
          </text>
        </g>
        <g>
          <rect x="186" y="108" width="34" height="15" rx="4" fill="rgba(255,255,255,0.82)" />
          <text x="203" y="119" textAnchor="middle" fontSize="8.5" fontFamily="Inter,sans-serif" fontWeight="700" fill="#444">
            ETH
          </text>
        </g>
        <text x="315" y="130" textAnchor="middle" fontSize="9" fontFamily="Inter,sans-serif" fontWeight="600" fill="#5A7A3A" opacity="0.9">
          Zürichberg
        </text>
        <text x="85" y="242" textAnchor="middle" fontSize="7.5" fontFamily="Inter,sans-serif" fontWeight="600" fill="#5A7A3A" opacity="0.85">
          Platzspitz
        </text>
        <text x="195" y={H - 32} textAnchor="middle" fontSize="11" fontFamily="Inter,sans-serif" fontWeight="600" fill="#4A8AAA" opacity="0.85">
          Zürichsee
        </text>
      </svg>

      {/* User "You are here" dot */}
      <div style={{
        position: 'absolute',
        left: '195px',
        top: '290px',
        transform: 'translate(-50%, -50%)',
        zIndex: 10
      }}>
        <div className="map-user-ripple" style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '26px', height: '26px',
          borderRadius: '50%',
          border: '2px solid rgba(0,122,255,0.45)',
          pointerEvents: 'none'
        }} />
        <div className="map-user-ripple-2" style={{
          position: 'absolute',
          left: '50%', top: '50%',
          transform: 'translate(-50%, -50%)',
          width: '26px', height: '26px',
          borderRadius: '50%',
          border: '2px solid rgba(0,122,255,0.28)',
          pointerEvents: 'none'
        }} />
        <div className="map-user-dot" style={{
          position: 'relative',
          width: '18px', height: '18px',
          borderRadius: '50%',
          background: THEME.colors.info,
          border: '3px solid #FFFFFF',
          boxShadow: '0 2px 8px rgba(0,122,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFFFFF' }} />
        </div>
        <div style={{
          position: 'absolute',
          top: '22px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          background: 'rgba(0,122,255,0.9)',
          color: '#FFFFFF',
          fontFamily: "'Inter', sans-serif",
          fontSize: '8px',
          fontWeight: 700,
          borderRadius: '4px',
          padding: '2px 5px',
          pointerEvents: 'none'
        }}>
          You are here
        </div>
      </div>

      {/* Provider pins */}
      {visibleProviders.map((provider, idx) => {
        const pos = PIN_POSITIONS[provider.id];
        const color = PIN_COLOR[provider.type];
        const isSelected = selectedId === provider.id;
        const pinSize = isSelected ? 38 : 30;
        const iconSize = isSelected ? 14 : 11;

        return (
          <div
            key={provider.id}
            className={isSelected ? 'map-pin-selected' : 'map-pin-drop'}
            onClick={() => onPinTap(provider.id)}
            style={{
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: 'translate(-50%, -100%)',
              zIndex: isSelected ? 25 : 15 + idx,
              cursor: 'pointer',
              animationDelay: `${idx * 0.07}s`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <div style={{
              width: `${pinSize}px`,
              height: `${pinSize}px`,
              borderRadius: `${pinSize * 0.38}px ${pinSize * 0.38}px ${pinSize * 0.38}px 0`,
              transform: 'rotate(-45deg)',
              background: isSelected
                ? `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`
                : color,
              border: isSelected ? '2.5px solid #FFFFFF' : '2px solid rgba(255,255,255,0.8)',
              boxShadow: isSelected
                ? `0 4px 16px ${color}55`
                : `0 2px 8px ${color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <div style={{ transform: 'rotate(45deg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PinIcon type={provider.type} size={iconSize} />
              </div>
            </div>
            <div style={{
              width: isSelected ? '6px' : '5px',
              height: isSelected ? '6px' : '5px',
              borderRadius: '50%',
              background: color,
              marginTop: '-1px',
              boxShadow: `0 1px 4px ${color}50`
            }} />
          </div>
        );
      })}

      {/* Bottom gradient fade */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '70px',
        background: 'linear-gradient(to bottom, transparent, rgba(249,249,251,0.55))',
        pointerEvents: 'none',
        zIndex: 5
      }} />
    </div>
  );
};

// --- PROVIDER CARD (selected provider in bottom sheet) ---
const ProviderCard = ({ provider }) => {
  if (!provider) return null;

  const color = PIN_COLOR[provider.type];

  return (
    <div className="map-card-slide">
      {/* Top row: avatar + info + rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
        {/* Photo / Avatar */}
        <div style={{
          width: '48px', height: '48px',
          borderRadius: '50%',
          background: avatarGradient(provider.type),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
          border: '2.5px solid #FFFFFF',
          boxShadow: `0 2px 8px ${color}30`,
          fontFamily: "'Nunito', sans-serif",
          fontSize: '19px', fontWeight: 800,
          color: '#FFFFFF'
        }}>
          {getInitial(provider.name)}
        </div>

        {/* Name + service type + distance */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '3px' }}>
            <span style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '15px', fontWeight: 800,
              color: THEME.colors.primaryText,
              letterSpacing: '-0.2px',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
            }}>
              {provider.name}
            </span>
            {provider.verified && (
              <div style={{
                width: '14px', height: '14px',
                borderRadius: '50%',
                background: THEME.colors.info,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <Check size={9} color="#FFFFFF" strokeWidth={3} />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px', fontWeight: 600,
              color: color,
              background: `${color}12`,
              borderRadius: THEME.radius.full,
              padding: '3px 8px'
            }}>
              {provider.service}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={10} color={THEME.colors.tertiaryText} strokeWidth={2.5} />
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '11px', fontWeight: 500,
                color: THEME.colors.tertiaryText
              }}>
                {provider.distance}
              </span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Star size={13} color={THEME.colors.warning} strokeWidth={0} style={{ fill: THEME.colors.warning }} />
            <span style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: '15px', fontWeight: 800,
              color: THEME.colors.primaryText,
              letterSpacing: '-0.3px'
            }}>
              {provider.rating}
            </span>
          </div>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px', fontWeight: 500,
            color: THEME.colors.tertiaryText
          }}>
            {provider.reviews} reviews
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* View Profile — secondary */}
        <button className="map-btn" onClick={() => window.location.href = '/provider-detail'} style={{
          flex: 1,
          padding: '12px 0',
          borderRadius: '20px',
          background: 'transparent',
          border: `1.5px solid ${THEME.colors.divider}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px'
        }}>
          <ChevronRight size={14} color={THEME.colors.primaryText} strokeWidth={2.5} />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px', fontWeight: 600,
            color: THEME.colors.primaryText
          }}>
            View Profile
          </span>
        </button>

        {/* Book — primary gradient */}
        <button className="map-btn" onClick={() => window.location.href = '/booking-flow'} style={{
          flex: 1,
          padding: '12px 0',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)',
          border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px',
          boxShadow: '0 4px 14px rgba(232,93,42,0.35)'
        }}>
          <Calendar size={14} color="#FFFFFF" strokeWidth={2.5} />
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px', fontWeight: 700,
            color: '#FFFFFF'
          }}>
            Book
          </span>
        </button>
      </div>
    </div>
  );
};

// --- NEARBY PROVIDER LIST ITEM (when no pin selected) ---
const ProviderListItem = ({ provider, onSelect }) => {
  const color = PIN_COLOR[provider.type];

  return (
    <button
      className="map-btn"
      onClick={() => onSelect(provider.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        padding: '12px',
        background: THEME.colors.surface,
        borderRadius: '20px',
        boxShadow: THEME.shadows.soft,
        marginBottom: '8px',
        textAlign: 'left'
      }}
    >
      {/* Avatar */}
      <div style={{
        width: '40px', height: '40px',
        borderRadius: '50%',
        background: avatarGradient(provider.type),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
        fontFamily: "'Nunito', sans-serif",
        fontSize: '16px', fontWeight: 800,
        color: '#FFFFFF'
      }}>
        {getInitial(provider.name)}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '13px', fontWeight: 800,
            color: THEME.colors.primaryText,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
          }}>
            {provider.name}
          </span>
          {provider.verified && (
            <div style={{
              width: '12px', height: '12px',
              borderRadius: '50%',
              background: THEME.colors.info,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Check size={7} color="#FFFFFF" strokeWidth={3} />
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px', fontWeight: 600,
            color: color
          }}>
            {provider.service}
          </span>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '10px', fontWeight: 500,
            color: THEME.colors.tertiaryText
          }}>
            {provider.distance}
          </span>
        </div>
      </div>

      {/* Rating + arrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
          <Star size={11} color={THEME.colors.warning} strokeWidth={0} style={{ fill: THEME.colors.warning }} />
          <span style={{
            fontFamily: "'Nunito', sans-serif",
            fontSize: '12px', fontWeight: 800,
            color: THEME.colors.primaryText
          }}>
            {provider.rating}
          </span>
        </div>
        <ChevronRight size={14} color={THEME.colors.tertiaryText} strokeWidth={2} />
      </div>
    </button>
  );
};

// ============================
// --- MAIN SCREEN COMPONENT ---
// ============================
const MapProvidersScreen = () => {
  const [selectedId, setSelectedId] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchText, setSearchText] = useState('');

  const selectedProvider = PROVIDERS.find(p => p.id === selectedId) || null;

  const visibleProviders = PROVIDERS.filter(p =>
    activeFilter === 'all' || p.type === activeFilter
  );

  const handlePinTap = (id) => {
    setSelectedId(prev => (prev === id ? null : id));
  };

  const handleFilterChange = (value) => {
    setActiveFilter(value);
    if (value !== 'all' && selectedProvider && selectedProvider.type !== value) {
      setSelectedId(null);
    }
  };

  return (
    <>
      <GlobalStyles />
      <div
        className="map-font-body"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#E5E5E5',
          padding: '20px'
        }}
      >
        {/* iPhone Frame */}
        <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#F9F9FB', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>

          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54, pointerEvents: 'none' }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="7" width="3" height="5" rx="1" fill="#111"/><rect x="4.5" y="5" width="3" height="7" rx="1" fill="#111"/><rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#111"/><path d="M4.75 7.75a4.75 4.75 0 016.5 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 5a8 8 0 0112 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="12" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="#111"/><path d="M24 4v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Full-screen MAP AREA */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '550px', overflow: 'hidden' }}>
            <SimulatedMap
              selectedId={selectedId}
              activeFilter={activeFilter}
              onPinTap={handlePinTap}
            />

            {/* MAP HEADER OVERLAY (search + filter pills only) */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              paddingTop: '110px',
              paddingBottom: '12px',
              paddingLeft: '16px', paddingRight: '16px',
              background: 'linear-gradient(to bottom, rgba(249,249,251,0.95) 0%, rgba(249,249,251,0.0) 100%)',
              zIndex: 20,
              pointerEvents: 'none'
            }}>
              {/* Search input overlay — frosted glass, rounded-[16px], 48px height */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                height: '48px',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderRadius: THEME.radius.medium,
                paddingLeft: '14px', paddingRight: '14px',
                boxShadow: THEME.shadows.floating,
                marginBottom: '10px',
                pointerEvents: 'auto'
              }}>
                <Search size={17} color={THEME.colors.tertiaryText} strokeWidth={2} />
                <span style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '14px', fontWeight: 400,
                  color: searchText ? THEME.colors.primaryText : THEME.colors.tertiaryText,
                  flex: 1
                }}>
                  {searchText || 'Search providers...'}
                </span>
                {searchText && (
                  <button className="map-btn" onClick={() => setSearchText('')}>
                    <X size={15} color={THEME.colors.secondaryText} strokeWidth={2} />
                  </button>
                )}
              </div>

              {/* Filter pills — horizontal scroll */}
              <div
                className="map-scroll"
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '2px',
                  pointerEvents: 'auto'
                }}
              >
                {FILTERS.map(f => {
                  const isActive = activeFilter === f.value;
                  return (
                    <button
                      key={f.value}
                      className="map-chip map-btn"
                      onClick={() => handleFilterChange(f.value)}
                      style={{
                        flexShrink: 0,
                        padding: '7px 14px',
                        borderRadius: THEME.radius.full,
                        background: isActive ? '#111111' : THEME.colors.surfaceAlt,
                        border: 'none',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '12px', fontWeight: 600,
                        color: isActive ? '#FFFFFF' : THEME.colors.primaryText,
                        cursor: 'pointer'
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigate fab — bottom right of map */}
            <button className="map-btn" style={{
              position: 'absolute',
              bottom: '80px', right: '16px',
              width: '40px', height: '40px',
              borderRadius: '50%',
              background: THEME.colors.surface,
              boxShadow: THEME.shadows.floating,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              zIndex: 20
            }}>
              <Navigation size={16} color={THEME.colors.accent} strokeWidth={2.5} />
            </button>
          </div>

          {/* BOTTOM SHEET (draggable sheet) */}
          <div
            className="map-bottom-sheet"
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: '294px',
              background: THEME.colors.surface,
              borderTopLeftRadius: '28px',
              borderTopRightRadius: '28px',
              zIndex: 30,
              overflow: 'hidden'
            }}
          >
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '10px', paddingBottom: '6px' }}>
              <div style={{
                width: '36px', height: '4px',
                borderRadius: '2px',
                background: THEME.colors.divider
              }} />
            </div>

            {/* Sheet header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: '20px', paddingRight: '20px',
              marginBottom: '10px'
            }}>
              <span style={{
                fontFamily: "'Nunito', sans-serif",
                fontSize: '15px', fontWeight: 800,
                color: THEME.colors.primaryText,
                letterSpacing: '-0.2px'
              }}>
                {selectedProvider ? selectedProvider.name : 'Nearby Providers'}
              </span>
              {selectedProvider && (
                <button
                  className="map-btn"
                  onClick={() => setSelectedId(null)}
                  style={{
                    width: '28px', height: '28px',
                    borderRadius: '50%',
                    background: THEME.colors.surfaceAlt,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <X size={14} color={THEME.colors.secondaryText} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: THEME.colors.divider, marginLeft: '20px', marginRight: '20px', marginBottom: '12px' }} />

            {/* Content area */}
            <div
              className="map-scroll"
              style={{
                paddingLeft: '20px', paddingRight: '20px',
                paddingBottom: '28px',
                height: 'calc(100% - 80px)',
                overflowY: 'auto'
              }}
            >
              {selectedProvider ? (
                <ProviderCard provider={selectedProvider} />
              ) : (
                /* List of nearby providers (scrollable) */
                visibleProviders.map(provider => (
                  <ProviderListItem
                    key={provider.id}
                    provider={provider}
                    onSelect={handlePinTap}
                  />
                ))
              )}
            </div>
          </div>

          {/* Floating Header */}
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              {/* Left: Back button */}
              <button
                onClick={() => { window.history.back(); }}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              >
                <ChevronLeft size={22} color="#111111" />
              </button>
              {/* Center: Title */}
              <h2 className="text-[17px] font-semibold text-[#111111]">Nearby Providers</h2>
              {/* Right: Filter button */}
              <button
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              >
                <Filter size={22} color="#111111" />
              </button>
            </div>
          </header>

          {/* Provider count badge */}
          <div style={{
            position: 'absolute',
            bottom: '302px',
            left: '16px',
            zIndex: 28,
            background: THEME.colors.surface,
            borderRadius: THEME.radius.full,
            padding: '6px 12px 6px 10px',
            display: 'flex', alignItems: 'center', gap: '5px',
            boxShadow: THEME.shadows.floating
          }}>
            <div style={{
              width: '7px', height: '7px',
              borderRadius: '50%',
              background: THEME.colors.accent
            }} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '11px', fontWeight: 700,
              color: THEME.colors.primaryText
            }}>
              {visibleProviders.length} providers nearby
            </span>
          </div>

        </div>
      </div>
    </>
  );
};

export default MapProvidersScreen;
