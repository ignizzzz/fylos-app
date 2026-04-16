import React, { useState } from 'react';
import {
  ChevronLeft,
  Heart,
  X,
  Star,
  MapPin,
  Search,
  MessageCircle,
  PawPrint,
  Clock,
  Check,
  ChevronRight,
  Smile,
} from 'lucide-react';

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
    compatibility: 92,
    bio: 'Loves running, fetching, and meeting new friends at the park!',
    color: '#E8C4A0',
    interests: ['Fetch', 'Running', 'Swimming'],
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
    compatibility: 78,
    bio: 'Gentle giant who enjoys long walks and calm playtime.',
    color: '#A0C4D8',
    interests: ['Walks', 'Tug-of-war', 'Naps'],
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
    compatibility: 85,
    bio: 'Sweet and sociable, great with dogs of all sizes.',
    color: '#D4B0D8',
    interests: ['Socializing', 'Tricks', 'Cuddles'],
  },
];

const MATCHES_DATA = [
  { id: 1, name: 'Buddy', owner: 'Tom K.', color: '#E8C4A0', time: '2h ago' },
  { id: 2, name: 'Milo', owner: 'Anna K.', color: '#B8D8B0', time: '1d ago' },
  { id: 3, name: 'Rocky', owner: 'Marco B.', color: '#D0B8A0', time: '2d ago' },
  { id: 4, name: 'Daisy', owner: 'Erin L.', color: '#F0C8D0', time: '3d ago' },
];

// ---------------------------------------------------------------------------
// FILTER BOTTOM SHEET
// ---------------------------------------------------------------------------
const FilterSheet = ({ visible, onClose }) => {
  const [distance, setDistance] = useState(5);
  const [sizes, setSizes] = useState(['Medium']);
  const [energies, setEnergies] = useState(['High']);

  const toggleChip = (list, setList, val) => {
    setList((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  return (
    <>
      {/* Backdrop */}
      {visible && (
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-[200ms] z-[39]"
          onClick={onClose}
        />
      )}

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 z-40 bg-[#F7F5F2] rounded-t-[20px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
        style={{
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 260ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Drag handle */}
        <div className="w-full flex flex-col items-center pt-5 pb-3">
          <div className="w-10 h-1 rounded-full bg-[#D5CEC7]" />
          <h3 className="text-[18px] font-semibold text-[#111111] mt-3">Filter Matches</h3>
        </div>

        <div className="px-6 pb-8 overflow-y-auto">
          {/* Distance */}
          <div className="mb-6">
            <div className="flex justify-between mb-2.5">
              <span className="text-[15px] font-semibold text-[#111111]">Distance</span>
              <span className="text-[15px] font-semibold text-[#E85D2A]">{distance} km</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              className="w-full h-1 rounded-full bg-[#EDE8E2] appearance-none outline-none"
              style={{ accentColor: '#E85D2A' }}
            />
            <div className="flex justify-between mt-1">
              <span className="text-[12px] text-[#A09A94]">1 km</span>
              <span className="text-[12px] text-[#A09A94]">10 km</span>
            </div>
          </div>

          {/* Pet Size */}
          <div className="mb-6">
            <span className="text-[15px] font-semibold text-[#111111] block mb-2.5">Pet Size</span>
            <div className="flex gap-2 flex-wrap">
              {['Small', 'Medium', 'Large'].map((s) => (
                <button
                  key={s}
                  onClick={() => toggleChip(sizes, setSizes, s)}
                  className={`px-4 py-[7px] rounded-full text-[12px] font-semibold border transition-all duration-[180ms] active:scale-[0.96] ${
                    sizes.includes(s)
                      ? 'bg-[#111111] text-white border-transparent'
                      : 'bg-[#F3EFEB]/90 text-[#6E6058] border-black/[0.05]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Level */}
          <div className="mb-7">
            <span className="text-[15px] font-semibold text-[#111111] block mb-2.5">Energy Level</span>
            <div className="flex gap-2 flex-wrap">
              {['Calm', 'Medium', 'High'].map((e) => (
                <button
                  key={e}
                  onClick={() => toggleChip(energies, setEnergies, e)}
                  className={`px-4 py-[7px] rounded-full text-[12px] font-semibold border transition-all duration-[180ms] active:scale-[0.96] ${
                    energies.includes(e)
                      ? 'bg-[#111111] text-white border-transparent'
                      : 'bg-[#F3EFEB]/90 text-[#6E6058] border-black/[0.05]'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Apply */}
          <button
            onClick={onClose}
            className="w-full bg-[#111] text-white rounded-[14px] py-3.5 text-[16px] font-semibold active:scale-[0.97] transition-all duration-[120ms] shadow-[0_4px_20px_rgba(0,0,0,0.12)]"
          >
            Apply Filters
          </button>
          <button
            onClick={onClose}
            className="w-full mt-2.5 bg-[#F3EFEB] text-[#6E6058] border border-[#EDE8E2] rounded-[14px] py-3.5 text-[16px] font-semibold active:scale-[0.97] transition-all duration-[120ms]"
          >
            Reset
          </button>
        </div>
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
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-[8px]"
      style={{ background: 'linear-gradient(160deg, rgba(255,114,64,0.96) 0%, rgba(232,93,42,0.96) 100%)' }}
    >
      <style>{`
        @keyframes pdPopIn {
          0% { transform: scale(0.70); opacity: 0; }
          70% { transform: scale(1.06); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes pdPulseHeart {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.18); }
        }
        .pd-pop-in { animation: pdPopIn 380ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .pd-pulse-heart { animation: pdPulseHeart 1.1s ease-in-out infinite; }
      `}</style>

      <div className="pd-pop-in flex flex-col items-center">
        <span className="text-[34px] font-bold text-white tracking-[-0.5px] mb-1.5" style={{ fontFamily: 'Inter, -apple-system, sans-serif' }}>
          It's a Match!
        </span>
        <span className="text-[15px] font-medium text-white/[0.88] mb-9">
          Both owners want a playdate!
        </span>

        {/* Pet photos side by side */}
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-full border-4 border-white/90 flex items-center justify-center shrink-0 z-[2]"
            style={{ background: '#E8C4A0', boxShadow: '0 4px 20px rgba(0,0,0,0.20)' }}>
            <PawPrint size={32} color="#fff" strokeWidth={2} />
          </div>
          <div className="w-9 h-9 rounded-full bg-[#F3EFEB] flex items-center justify-center z-[3] -mx-2.5"
            style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
            <Heart size={18} color="#E85D2A" fill="#E85D2A" className="pd-pulse-heart" />
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-white/90 flex items-center justify-center shrink-0 z-[2]"
            style={{ background: '#A0C4D8', boxShadow: '0 4px 20px rgba(0,0,0,0.20)' }}>
            <PawPrint size={32} color="#fff" strokeWidth={2} />
          </div>
        </div>

        <span className="text-[16px] font-semibold text-white mb-9 text-center">
          Luna and {petName} want to play!
        </span>

        {/* Buttons */}
        <div className="flex flex-col gap-3 w-full px-8">
          <button
            onClick={onMessage}
            className="flex items-center justify-center gap-2 bg-white text-[#E85D2A] rounded-[16px] py-[15px] text-[15px] font-semibold active:scale-[0.97] transition-all duration-[120ms]"
          >
            <MessageCircle size={18} color="#E85D2A" strokeWidth={2.5} />
            Send Message
          </button>
          <button
            onClick={onBrowse}
            className="bg-transparent text-white border-[1.5px] border-white/50 rounded-[16px] py-[14px] text-[15px] font-semibold active:scale-[0.97] transition-all duration-[120ms]"
          >
            Keep Browsing
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// DISCOVER VIEW (Tinder-style swipeable cards)
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
        setCurrentIndex((i) => i + 1);
      }
    }, 220);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Card Stack */}
      <div className="relative w-full" style={{ height: 400, marginBottom: 20 }}>
        {/* Back card (peek) */}
        <div
          className="absolute rounded-[20px] flex items-center justify-center"
          style={{
            top: 14,
            left: '50%',
            transform: 'translateX(-50%) scale(0.94)',
            width: 'calc(100% - 32px)',
            height: 360,
            background: next.color,
            boxShadow: '0 2px 8px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(0,0,0,0.03)',
            zIndex: 1,
          }}
        >
          <PawPrint size={48} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
        </div>

        {/* Front card */}
        <div
          className="absolute rounded-[20px] overflow-hidden bg-[#F3EFEB] border border-[#EDE8E2]"
          style={{
            top: 0,
            left: '50%',
            transform: `translateX(-50%) ${
              pressed === 'like'
                ? 'rotate(6deg) translateX(20px)'
                : pressed === 'skip'
                ? 'rotate(-6deg) translateX(-20px)'
                : 'rotate(0deg)'
            }`,
            transition: 'transform 200ms ease',
            width: 'calc(100% - 16px)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.04)',
            zIndex: 2,
          }}
        >
          {/* Pet photo area */}
          <div
            className="w-full flex items-center justify-center relative"
            style={{ height: 210, background: current.color }}
          >
            <PawPrint size={56} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />

            {/* Compatibility badge */}
            <div className="absolute top-3 right-3 bg-[#F3EFEB]/90 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <Heart size={12} color="#E85D2A" fill="#E85D2A" />
              <span className="text-[13px] font-semibold text-[#E85D2A]">{current.compatibility}%</span>
            </div>
          </div>

          {/* Card info */}
          <div className="p-4 pb-5">
            {/* Name + age + breed */}
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-[22px] font-semibold text-[#111111] tracking-[-0.5px] leading-none">
                {current.name}
              </span>
              <span className="text-[15px] text-[#6E6058] font-medium">{current.age}</span>
              <span className="text-[13px] text-[#A09A94]">&middot;</span>
              <span className="text-[15px] text-[#6E6058] font-medium">{current.breed}</span>
            </div>

            {/* Owner + distance */}
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-[13px] text-[#A09A94] font-medium">Owner: {current.owner}</span>
              <div className="flex items-center gap-1">
                <MapPin size={13} color="#A09A94" strokeWidth={2} />
                <span className="text-[13px] text-[#A09A94] font-medium">{current.distance}</span>
              </div>
            </div>

            {/* Energy + Size badges */}
            <div className="flex gap-2 mb-2.5">
              <div className="inline-flex items-center gap-1 bg-[#E85D2A]/[0.06] rounded-full px-2.5 py-1">
                <Star size={12} color="#E85D2A" strokeWidth={2.5} />
                <span className="text-[12px] font-semibold text-[#E85D2A]">{current.energy}</span>
              </div>
              <div className="inline-flex items-center gap-1 bg-[#F3EFEB] rounded-full px-2.5 py-1">
                <span className="text-[12px] font-semibold text-[#6E6058]">{current.size}</span>
              </div>
            </div>

            {/* Shared interests tags */}
            <div className="flex gap-1.5 flex-wrap mb-2.5">
              {current.interests.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#F3EFEB] rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#6E6058] border border-[#EDE8E2]"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Bio */}
            <p className="text-[13px] text-[#6E6058] leading-[1.5] m-0">{current.bio}</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-8">
        <button
          onClick={() => handleAction('skip')}
          className="w-[60px] h-[60px] rounded-full bg-[#F3EFEB] flex items-center justify-center border border-[#EDE8E2] active:scale-[0.88] transition-all duration-[120ms]"
          style={{
            boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
            transform: pressed === 'skip' ? 'scale(0.88)' : 'scale(1)',
          }}
        >
          <X size={26} color="#FF3B30" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => handleAction('like')}
          className="w-[68px] h-[68px] rounded-full flex items-center justify-center active:scale-[0.88] transition-all duration-[120ms]"
          style={{
            background: 'linear-gradient(135deg, #E85D2A 0%, #E85D2A 100%)',
            boxShadow: '0 6px 24px rgba(232,93,42,0.35)',
            transform: pressed === 'like' ? 'scale(0.88)' : 'scale(1)',
          }}
        >
          <Heart size={30} color="#fff" fill="#fff" />
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// MATCHES VIEW
// ---------------------------------------------------------------------------
const MatchesView = () => (
  <div>
    {/* Summary */}
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-[#E85D2A]/[0.06] rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
        <Heart size={14} color="#E85D2A" fill="#E85D2A" />
        <span className="text-[13px] font-semibold text-[#E85D2A]">{MATCHES_DATA.length} matches</span>
      </div>
    </div>

    {/* 2-column grid */}
    <div className="grid grid-cols-2 gap-3">
      {MATCHES_DATA.map((m) => (
        <div
          key={m.id}
          className="bg-[#F3EFEB] rounded-[20px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)] active:scale-[0.97] transition-all duration-[120ms] cursor-pointer"
        >
          <div
            className="w-full flex items-center justify-center"
            style={{ height: 130, background: m.color }}
          >
            <PawPrint size={32} color="rgba(255,255,255,0.5)" strokeWidth={1.5} />
          </div>
          <div className="p-3">
            <div className="text-[15px] font-semibold text-[#111111] mb-0.5">{m.name}</div>
            <div className="text-[12px] text-[#A09A94] mb-0.5">{m.owner}</div>
            <div className="text-[11px] text-[#A09A94] mb-2">{m.time}</div>
            <div className="flex items-center gap-1 text-[#E85D2A] text-[12px] font-semibold">
              <MessageCircle size={13} color="#E85D2A" strokeWidth={2} />
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#F7F5F2',
        padding: '20px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .wallet-scroll::-webkit-scrollbar { display: none; }
        .wallet-scroll { scrollbar-width: none; }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px; height: 20px;
          border-radius: 50%;
          background: #E85D2A;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(232,93,42,0.35);
        }
      `}</style>

      {/* iPhone Frame */}
      <div
        className="relative"
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F7F5F2',
        }}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[100]"
          style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }}
        />

        {/* Home Indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
          style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }}
        />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Floating Header */}
        <header
          className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent"
          style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}
        >
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button
              onClick={() => window.history.back()}
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#F3EFEB] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <ChevronLeft size={22} color="#111111" />
            </button>
            <h2 className="text-[17px] font-semibold text-[#111111]">Playdates</h2>
            <button
              onClick={() => setShowFilter(true)}
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#F3EFEB] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <Search size={22} color="#111111" />
            </button>
          </div>
        </header>

        {/* Scroll content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="wallet-scroll" style={{ flex: 1, paddingTop: 100, paddingBottom: 40, overflowY: 'auto' }}>
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Tab Toggle - Segmented Control */}
              <div className="flex bg-[#F3EFEB]/80 backdrop-blur-xl p-1.5 rounded-full border border-black/[0.04] relative">
                {/* Sliding pill */}
                <div
                  className="absolute top-1.5 bottom-1.5 bg-[#111111] rounded-full transition-all duration-[300ms]"
                  style={{
                    width: 'calc(50% - 12px)',
                    left: activeTab === 'discover' ? 'calc(0% + 6px)' : 'calc(50% + 6px)',
                    transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
                  }}
                />
                <button
                  onClick={() => setActiveTab('discover')}
                  className={`relative z-10 flex-1 py-1.5 text-[13px] font-semibold transition-colors duration-[200ms] flex items-center justify-center gap-1.5 ${
                    activeTab === 'discover' ? 'text-white' : 'text-[#A09A94]'
                  }`}
                >
                  Discover
                </button>
                <button
                  onClick={() => setActiveTab('matches')}
                  className={`relative z-10 flex-1 py-1.5 text-[13px] font-semibold transition-colors duration-[200ms] flex items-center justify-center gap-1.5 ${
                    activeTab === 'matches' ? 'text-white' : 'text-[#A09A94]'
                  }`}
                >
                  Matches
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      activeTab === 'matches' ? 'bg-[#F3EFEB]/80' : 'bg-[#E85D2A]'
                    }`}
                  />
                </button>
              </div>

              {/* Tab Content */}
              <div className="pt-1">
                {activeTab === 'discover' ? (
                  <DiscoverView onMatch={handleMatch} />
                ) : (
                  <MatchesView />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filter Sheet */}
        <FilterSheet visible={showFilter} onClose={() => setShowFilter(false)} />

        {/* Match Popup */}
        <MatchPopup
          visible={matchPopup.visible}
          petName={matchPopup.petName}
          onMessage={() => (window.location.href = '/chat')}
          onBrowse={closeMatch}
        />
      </div>
    </div>
  );
};

export default PlaydateMatchingScreen;
