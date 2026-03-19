import React, { useState } from 'react';
import {
  ChevronLeft,
  Heart,
  X,
  Star,
  MapPin,
  Filter,
  MessageCircle,
  PawPrint,
  Clock,
  Check,
  ChevronRight,
  ArrowRight,
  Circle,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// THEME — Fylos Design System
// ---------------------------------------------------------------------------
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
    success: '#00C060',
    danger: '#FF3B30',
    divider: '#E5E5E5',
  },
  radius: { full: '9999px', large: '24px', medium: '16px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)',
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34,1.56,0.64,1)',
  },
};

// ---------------------------------------------------------------------------
// GLOBAL STYLES
// ---------------------------------------------------------------------------
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .pd-screen {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: ${THEME.colors.background};
      color: ${THEME.colors.primaryText};
      overflow: hidden;
    }

    .pd-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .pd-scroll::-webkit-scrollbar { display: none; }

    .pd-tap {
      transition: opacity ${THEME.motion.tap} ease, transform ${THEME.motion.tap} ease;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }
    .pd-tap:active { opacity: 0.72; transform: scale(0.96); }

    /* Tab bar */
    .pd-tab-bar {
      display: flex;
      background: ${THEME.colors.surfaceAlt};
      border-radius: ${THEME.radius.full};
      padding: 3px;
      gap: 2px;
    }
    .pd-tab {
      flex: 1;
      border: none;
      border-radius: ${THEME.radius.full};
      padding: 8px 0;
      font-size: 13px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: background ${THEME.motion.tab}, color ${THEME.motion.tab}, box-shadow ${THEME.motion.tab};
    }
    .pd-tab.active {
      background: ${THEME.colors.surface};
      color: ${THEME.colors.primaryText};
      box-shadow: ${THEME.shadows.soft};
    }
    .pd-tab.inactive {
      background: transparent;
      color: ${THEME.colors.tertiaryText};
    }

    /* Action buttons */
    .pd-action-btn {
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease;
      user-select: none;
      -webkit-user-select: none;
    }
    .pd-action-btn:active { transform: scale(0.88); opacity: 0.82; }

    .pd-action-btn.skip {
      width: 60px; height: 60px;
      background: ${THEME.colors.surface};
      box-shadow: ${THEME.shadows.floating};
    }
    .pd-action-btn.like {
      width: 68px; height: 68px;
      background: linear-gradient(135deg, #FF7240 0%, ${THEME.colors.accent} 100%);
      box-shadow: 0 6px 24px rgba(232,93,42,0.35);
    }

    /* Match popup overlay */
    .pd-overlay {
      position: absolute;
      inset: 0;
      z-index: 50;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(160deg, rgba(255,114,64,0.96) 0%, rgba(232,93,42,0.96) 100%);
      backdrop-filter: blur(8px);
    }
    .pd-overlay.hidden { display: none; }

    /* Match grid card */
    .pd-match-card {
      background: ${THEME.colors.surface};
      border-radius: 20px;
      overflow: hidden;
      box-shadow: ${THEME.shadows.soft};
      cursor: pointer;
      transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease;
    }
    .pd-match-card:active { transform: scale(0.97); opacity: 0.85; }

    /* Filter modal */
    .pd-filter-modal {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 40;
      background: ${THEME.colors.surface};
      border-radius: 24px 24px 0 0;
      padding: 24px 20px 40px;
      box-shadow: 0 -8px 40px rgba(0,0,0,0.12);
      transition: transform 260ms ${THEME.motion.spring};
    }
    .pd-filter-modal.hidden { transform: translateY(100%); }
    .pd-filter-modal.visible { transform: translateY(0); }

    .pd-filter-backdrop {
      position: absolute;
      inset: 0;
      z-index: 39;
      background: rgba(0,0,0,0.35);
      transition: opacity ${THEME.motion.fade};
    }
    .pd-filter-backdrop.hidden { display: none; }

    /* Chips */
    .pd-chip {
      border: 1.5px solid ${THEME.colors.divider};
      border-radius: ${THEME.radius.full};
      padding: 7px 14px;
      font-size: 13px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: background ${THEME.motion.tap}, border-color ${THEME.motion.tap}, color ${THEME.motion.tap};
      background: transparent;
      color: ${THEME.colors.secondaryText};
    }
    .pd-chip.selected {
      background: ${THEME.colors.accent};
      border-color: ${THEME.colors.accent};
      color: #fff;
    }

    /* Range slider */
    .pd-range {
      -webkit-appearance: none;
      width: 100%;
      height: 4px;
      border-radius: 4px;
      background: ${THEME.colors.divider};
      outline: none;
    }
    .pd-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 20px; height: 20px;
      border-radius: 50%;
      background: ${THEME.colors.accent};
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(232,93,42,0.35);
    }

    /* Primary button */
    .pd-btn-primary {
      width: 100%;
      background: linear-gradient(135deg, #FF7240 0%, ${THEME.colors.accent} 100%);
      color: #fff;
      border: none;
      border-radius: ${THEME.radius.medium};
      padding: 15px;
      font-size: 15px;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: opacity ${THEME.motion.tap};
    }
    .pd-btn-primary:active { opacity: 0.82; }

    .pd-btn-ghost {
      width: 100%;
      background: transparent;
      color: ${THEME.colors.secondaryText};
      border: 1.5px solid ${THEME.colors.divider};
      border-radius: ${THEME.radius.medium};
      padding: 14px;
      font-size: 15px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: opacity ${THEME.motion.tap};
    }
    .pd-btn-ghost:active { opacity: 0.7; }

    @keyframes pd-pop-in {
      0%   { transform: scale(0.70); opacity: 0; }
      70%  { transform: scale(1.06); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .pd-pop-in { animation: pd-pop-in 380ms ${THEME.motion.spring} both; }

    @keyframes pd-pulse-heart {
      0%, 100% { transform: scale(1); }
      50%       { transform: scale(1.18); }
    }
    .pd-pulse-heart { animation: pd-pulse-heart 1.1s ease-in-out infinite; }
  `}</style>
);

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------
const PETS = [
  {
    id: 1,
    name: 'Buddy',
    breed: 'Beagle',
    age: '2 yrs',
    owner: 'Tom K.',
    distance: '0.5 km',
    energy: 'High Energy',
    size: 'Medium',
    bio: 'Loves running, fetching, and meeting new friends at the park!',
    color: '#E8C4A0',
  },
  {
    id: 2,
    name: 'Rex',
    breed: 'German Shepherd',
    age: '3 yrs',
    owner: 'Sara M.',
    distance: '1.2 km',
    energy: 'Medium',
    size: 'Large',
    bio: 'Gentle giant who enjoys long walks and calm playtime.',
    color: '#A0C4D8',
  },
  {
    id: 3,
    name: 'Coco',
    breed: 'Poodle',
    age: '4 yrs',
    owner: 'Li W.',
    distance: '2.0 km',
    energy: 'Calm',
    size: 'Small',
    bio: 'Sweet and sociable, great with dogs of all sizes.',
    color: '#D4B0D8',
  },
];

const MATCHES_DATA = [
  { id: 1, name: 'Buddy', owner: 'Tom K.', color: '#E8C4A0' },
  { id: 2, name: 'Milo', owner: 'Anna K.', color: '#B8D8B0' },
  { id: 3, name: 'Rocky', owner: 'Marco B.', color: '#D0B8A0' },
  { id: 4, name: 'Daisy', owner: 'Erin L.', color: '#F0C8D0' },
];

// ---------------------------------------------------------------------------
// FILTER MODAL
// ---------------------------------------------------------------------------
const FilterModal = ({ visible, onClose }) => {
  const [distance, setDistance] = useState(5);
  const [sizes, setSizes] = useState(['Medium']);
  const [energies, setEnergies] = useState(['High']);

  const toggleChip = (list, setList, val) => {
    setList(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]);
  };

  return (
    <>
      <div
        className={`pd-filter-backdrop${visible ? '' : ' hidden'}`}
        onClick={onClose}
      />
      <div className={`pd-filter-modal${visible ? ' visible' : ' hidden'}`}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: THEME.colors.divider, margin: '0 auto 20px' }} />

        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: THEME.colors.primaryText }}>Filter Matches</span>
          <button
            className="pd-tap"
            onClick={onClose}
            style={{ background: THEME.colors.surfaceAlt, border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <X size={16} color={THEME.colors.secondaryText} strokeWidth={2.5} />
          </button>
        </div>

        {/* Distance */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText }}>Distance</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: THEME.colors.accent }}>{distance} km</span>
          </div>
          <input
            type="range"
            className="pd-range"
            min={1}
            max={10}
            value={distance}
            onChange={e => setDistance(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontSize: 11, color: THEME.colors.tertiaryText }}>1 km</span>
            <span style={{ fontSize: 11, color: THEME.colors.tertiaryText }}>10 km</span>
          </div>
        </div>

        {/* Pet Size */}
        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText, display: 'block', marginBottom: 10 }}>Pet Size</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Small', 'Medium', 'Large'].map(s => (
              <button key={s} className={`pd-chip${sizes.includes(s) ? ' selected' : ''}`} onClick={() => toggleChip(sizes, setSizes, s)}>{s}</button>
            ))}
          </div>
        </div>

        {/* Energy Level */}
        <div style={{ marginBottom: 28 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText, display: 'block', marginBottom: 10 }}>Energy Level</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Calm', 'Medium', 'High'].map(e => (
              <button key={e} className={`pd-chip${energies.includes(e) ? ' selected' : ''}`} onClick={() => toggleChip(energies, setEnergies, e)}>{e}</button>
            ))}
          </div>
        </div>

        <button className="pd-btn-primary" onClick={onClose}>Apply Filters</button>
        <div style={{ height: 10 }} />
        <button className="pd-btn-ghost" onClick={onClose}>Reset</button>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// MATCH POPUP
// ---------------------------------------------------------------------------
const MatchPopup = ({ visible, petName, onMessage, onBrowse }) => {
  if (!visible) return null;
  return (
    <div className="pd-overlay pd-pop-in">
      <span style={{ fontSize: 34, fontWeight: 900, color: '#fff', fontFamily: '"Nunito", sans-serif', letterSpacing: '-0.5px', marginBottom: 6 }}>
        It's a Match!
      </span>
      <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.88)', fontWeight: 500, marginBottom: 36 }}>
        Both owners want a playdate!
      </span>

      {/* Pet photos side by side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 24 }}>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.9)',
          background: '#E8C4A0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.20)',
          flexShrink: 0, zIndex: 2,
        }}>
          <PawPrint size={32} color="#fff" strokeWidth={2} />
        </div>
        <div style={{ zIndex: 3, margin: '0 -10px', background: '#fff', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.18)', flexShrink: 0 }}>
          <Heart size={18} color={THEME.colors.accent} fill={THEME.colors.accent} className="pd-pulse-heart" />
        </div>
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          border: '4px solid rgba(255,255,255,0.9)',
          background: '#A0C4D8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.20)',
          flexShrink: 0, zIndex: 2,
        }}>
          <PawPrint size={32} color="#fff" strokeWidth={2} />
        </div>
      </div>

      <span style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 36, textAlign: 'center' }}>
        Luna and {petName} want to play!
      </span>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', padding: '0 32px' }}>
        <button
          className="pd-tap"
          onClick={onMessage}
          style={{ background: '#fff', color: THEME.colors.accent, border: 'none', borderRadius: THEME.radius.medium, padding: '15px 24px', fontSize: 15, fontWeight: 700, fontFamily: '"Inter", sans-serif', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
        >
          <MessageCircle size={18} color={THEME.colors.accent} strokeWidth={2.5} />
          Send Message
        </button>
        <button
          className="pd-tap"
          onClick={onBrowse}
          style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.50)', borderRadius: THEME.radius.medium, padding: '14px 24px', fontSize: 15, fontWeight: 600, fontFamily: '"Inter", sans-serif', cursor: 'pointer' }}
        >
          Keep Browsing
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// DISCOVER VIEW — card stack + action buttons
// ---------------------------------------------------------------------------
const DiscoverView = ({ onMatch }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pressed, setPressed] = useState(null);

  const current = PETS[currentIndex % PETS.length];
  const next = PETS[(currentIndex + 1) % PETS.length];

  const handleAction = (type) => {
    setPressed(type);
    setTimeout(() => {
      setPressed(null);
      if (type === 'like') {
        onMatch(current.name);
      } else {
        setCurrentIndex(i => i + 1);
      }
    }, 220);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Card Stack */}
      <div style={{ position: 'relative', width: '100%', height: 380, marginBottom: 24 }}>

        {/* Back card (peek) */}
        <div style={{
          position: 'absolute',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%) scale(0.94)',
          width: 'calc(100% - 32px)',
          height: 340,
          borderRadius: 20,
          background: next.color,
          boxShadow: THEME.shadows.soft,
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <PawPrint size={48} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
        </div>

        {/* Front card */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: `translateX(-50%) ${pressed === 'like' ? 'rotate(6deg) translateX(20px)' : pressed === 'skip' ? 'rotate(-6deg) translateX(-20px)' : 'rotate(0deg)'}`,
            transition: `transform ${THEME.motion.fade} ease`,
            width: 'calc(100% - 16px)',
            borderRadius: 20,
            overflow: 'hidden',
            background: THEME.colors.surface,
            boxShadow: THEME.shadows.floating,
            zIndex: 2,
          }}
        >
          {/* Pet photo area (colored placeholder) */}
          <div style={{
            width: '100%',
            height: 220,
            background: current.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            <PawPrint size={56} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          </div>

          {/* Card info */}
          <div style={{ padding: '16px 18px 18px' }}>
            {/* Name + age + breed */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: THEME.colors.primaryText, fontFamily: '"Nunito", sans-serif', lineHeight: 1 }}>{current.name}</span>
              <span style={{ fontSize: 14, color: THEME.colors.secondaryText, fontWeight: 500 }}>{current.age}</span>
              <span style={{ fontSize: 13, color: THEME.colors.tertiaryText }}>·</span>
              <span style={{ fontSize: 14, color: THEME.colors.secondaryText, fontWeight: 500 }}>{current.breed}</span>
            </div>

            {/* Owner + distance */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: THEME.colors.tertiaryText, fontWeight: 500 }}>Owner: {current.owner}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <MapPin size={13} color={THEME.colors.tertiaryText} strokeWidth={2} />
                <span style={{ fontSize: 13, color: THEME.colors.tertiaryText, fontWeight: 500 }}>{current.distance}</span>
              </div>
            </div>

            {/* Energy + Size badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: `rgba(232,93,42,0.08)`,
                borderRadius: THEME.radius.full,
                padding: '4px 10px',
                fontSize: 12, fontWeight: 600, color: THEME.colors.accent,
              }}>
                <Star size={12} color={THEME.colors.accent} strokeWidth={2.5} />
                {current.energy}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                background: THEME.colors.surfaceAlt,
                borderRadius: THEME.radius.full,
                padding: '4px 10px',
                fontSize: 12, fontWeight: 600, color: THEME.colors.secondaryText,
              }}>
                {current.size}
              </div>
            </div>

            {/* Bio */}
            <p style={{ fontSize: 13, color: THEME.colors.secondaryText, lineHeight: 1.5, margin: 0 }}>
              {current.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        {/* Pass */}
        <button
          className="pd-action-btn skip"
          onClick={() => handleAction('skip')}
          aria-label="Pass"
          style={{ transform: pressed === 'skip' ? 'scale(0.88)' : 'scale(1)', transition: `transform ${THEME.motion.tap}` }}
        >
          <X size={26} color={THEME.colors.danger} strokeWidth={2.5} />
        </button>

        {/* Like */}
        <button
          className="pd-action-btn like"
          onClick={() => handleAction('like')}
          aria-label="Like"
          style={{ transform: pressed === 'like' ? 'scale(0.88)' : 'scale(1)', transition: `transform ${THEME.motion.tap}` }}
        >
          <Heart size={30} color="#fff" fill="#fff" />
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// MATCHES VIEW — 2-column grid
// ---------------------------------------------------------------------------
const MatchesView = () => (
  <div>
    {/* Summary */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
      <div style={{ background: `rgba(232,93,42,0.08)`, borderRadius: THEME.radius.full, padding: '6px 14px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Heart size={14} color={THEME.colors.accent} fill={THEME.colors.accent} />
        <span style={{ fontSize: 13, fontWeight: 700, color: THEME.colors.accent }}>{MATCHES_DATA.length} matches</span>
      </div>
    </div>

    {/* 2-column grid */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
      {MATCHES_DATA.map(m => (
        <div key={m.id} className="pd-match-card">
          {/* Photo placeholder */}
          <div style={{
            width: '100%',
            height: 130,
            background: m.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <PawPrint size={32} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          </div>
          {/* Info */}
          <div style={{ padding: '10px 12px 12px' }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: THEME.colors.primaryText, marginBottom: 2 }}>{m.name}</div>
            <div style={{ fontSize: 12, color: THEME.colors.tertiaryText, marginBottom: 8 }}>{m.owner}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: THEME.colors.accent, fontSize: 12, fontWeight: 600 }}>
              <MessageCircle size={13} color={THEME.colors.accent} strokeWidth={2} />
              Tap to message
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// MAIN SCREEN
// ---------------------------------------------------------------------------
const PlaydateMatchingScreen = () => {
  const [activeTab, setActiveTab] = useState('discover');
  const [showFilter, setShowFilter] = useState(false);
  const [matchPopup, setMatchPopup] = useState({ visible: false, petName: '' });

  const handleMatch = (petName) => {
    setMatchPopup({ visible: true, petName });
  };

  const closeMatch = () => {
    setMatchPopup({ visible: false, petName: '' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div
        className="pd-screen relative"
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F9F9FB',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}
      >
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="7" width="3" height="5" rx="1" fill="#111"/><rect x="4.5" y="5" width="3" height="7" rx="1" fill="#111"/><rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#111"/><path d="M4.75 7.75a4.75 4.75 0 016.5 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 5a8 8 0 0112 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="12" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="#111"/><path d="M24 4v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
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
            <h2 className="text-[17px] font-semibold text-[#111111]">Playdates</h2>
            {/* Right: Filter button */}
            <button
              onClick={() => setShowFilter(true)}
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <Filter size={22} color="#111111" />
            </button>
          </div>
        </header>

        {/* Scrollable content wrapper */}
        <div className="absolute inset-0 overflow-y-auto" style={{ paddingTop: 54, paddingBottom: 40 }}>

        {/* Scrollable body */}
        <div className="pd-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Tab Toggle */}
            <div className="pd-tab-bar">
              <button
                className={`pd-tab ${activeTab === 'discover' ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab('discover')}
              >
                Discover
              </button>
              <button
                className={`pd-tab ${activeTab === 'matches' ? 'active' : 'inactive'}`}
                onClick={() => setActiveTab('matches')}
              >
                Matches
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div style={{ padding: '18px 20px 40px' }}>
            {activeTab === 'discover' ? (
              <DiscoverView onMatch={handleMatch} />
            ) : (
              <MatchesView />
            )}
          </div>
        </div>

        {/* Filter Modal */}
        <FilterModal visible={showFilter} onClose={() => setShowFilter(false)} />

        {/* Match Popup */}
        <MatchPopup
          visible={matchPopup.visible}
          petName={matchPopup.petName}
          onMessage={() => window.location.href = '/chat'}
          onBrowse={closeMatch}
        />
        </div>
      </div>
    </div>
  );
};

export default PlaydateMatchingScreen;
