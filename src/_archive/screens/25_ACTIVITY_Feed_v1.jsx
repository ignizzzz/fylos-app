import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  MoreVertical, 
  ChevronDown, 
  Plus, 
  Download, 
  LineChart, 
  Settings,
  ChevronRight,
  Loader2,
  Lock,
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  ShieldAlert,
  Users,
  Search,
  ArrowRight
} from 'lucide-react';

// ==========================================
// THEME & UTILS
// ==========================================
const THEME = {
  colors: {
    accent: '#FF6A3D', // FYLOS Orange
    bg: '#F7F7F8',
    surface: '#FFFFFF',
    text: '#111111',
    textSecondary: '#6E6E73',
    border: 'rgba(0,0,0,0.06)'
  },
  shadows: {
    soft: '0 2px 12px rgba(0, 0, 0, 0.03)',
    float: '0 8px 24px rgba(0, 0, 0, 0.06)'
  }
};

const now = new Date();
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

const formatRelativeTime = (date) => {
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_PET = { id: 'p1', name: 'Luna', breed: 'Golden Retriever', avatar: '🐕' };

const MY_ACTIVITIES = [
  { id: '1', type: 'walk', timestamp: daysAgo(0).setHours(14, 30), duration: '90 min', provider: 'Lukas F.', location: 'Zurichhorn Park' },
  { id: '2', type: 'medication', timestamp: daysAgo(0).setHours(9, 0), medName: 'Apoquel (16mg)', notes: 'Daily medication' },
  { id: '3', type: 'photo', timestamp: daysAgo(1).setHours(16, 20), photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400&h=400', caption: 'Playing in the snow! ❄️' },
  { id: '4', type: 'weight', timestamp: daysAgo(2).setHours(10, 0), weight: 28, status: 'healthy', range: '26-29 kg' },
  { id: '5', type: 'vet-visit', timestamp: daysAgo(8).setHours(10, 0), reason: 'Annual Checkup', vetName: 'Dr. Sarah Keller' },
];

const FRIENDS_ACTIVITIES = [
  { id: 'f1', type: 'photo', friendName: 'Max', breed: 'French Bulldog', ownerAvatar: '👨‍🦱', timestamp: daysAgo(0).setHours(11, 20), photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=400', caption: 'Morning zoomies!' },
  { id: 'f2', type: 'check-in', friendName: 'Bella', breed: 'Labrador', ownerAvatar: '👩', timestamp: daysAgo(0).setHours(9, 15), placeName: 'Rieterpark', placeType: 'Dog Park' },
  { id: 'f3', type: 'playdate', friendName: 'Charlie', breed: 'Beagle', ownerAvatar: '👱‍♂️', timestamp: daysAgo(1).setHours(14, 0), dateStr: 'Saturday, 10:00 AM', placeName: 'Zurichhorn Park', attendees: 3 },
  { id: 'f4', type: 'milestone', friendName: 'Rocky', breed: 'Shiba Inu', ownerAvatar: '👩‍🦰', timestamp: daysAgo(2).setHours(16, 30), title: 'Graduated Puppy School 🎓' }
];

// ==========================================
// SHARED UI COMPONENTS
// ==========================================
const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  return createPortal(
    <div className="absolute inset-0 z-[100] flex flex-col justify-end pointer-events-auto overflow-hidden">
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div 
        className="relative w-full bg-[#FFFFFF] rounded-t-[24px] flex flex-col shadow-2xl max-h-[90vh]"
        style={{ 
          transform: `translateY(${!visible ? '100%' : `${translateY}px`})`,
          transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)'
        }}
      >
        <div 
          className="w-full flex justify-center pt-4 pb-4 cursor-grab touch-none"
          onTouchStart={e => { touchStartY.current = e.touches[0].clientY; setTranslateY(0); }}
          onTouchMove={e => { const delta = e.touches[0].clientY - touchStartY.current; if (delta > 0) setTranslateY(delta); }}
          onTouchEnd={() => { if (translateY > 80) onClose(); else setTranslateY(0); }}
        >
          <div className="w-12 h-1.5 bg-black/[0.08] rounded-full" />
        </div>
        <div className="px-5 pb-6 overflow-y-auto custom-scrollbar">
          {title && <h3 className="text-[20px] font-bold text-[#111111] mb-5">{title}</h3>}
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('mockup-root') || document.body
  );
};

const SegmentedModeControl = ({ modes, activeMode, onChange }) => {
  const activeIndex = modes.findIndex(m => m.id === activeMode);
  
  return (
    <div className="px-4 py-2 bg-[#F7F7F8] z-30 sticky top-0">
      <div className="bg-black/[0.04] p-1 rounded-[14px] flex relative">
        <div 
          className="absolute top-1 bottom-1 bg-[#FFFFFF] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out"
          style={{ width: `calc(${100 / modes.length}% - 4px)`, left: `calc(${(100 / modes.length) * activeIndex}% + 2px)` }}
        />
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onChange(mode.id)}
              className={`relative z-10 flex-1 py-1.5 text-[14px] font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5 ${isActive ? 'text-[#111111]' : 'text-[#8E8E93]'}`}
            >
              {mode.label}
              {mode.badge && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// MODE 1: MY ACTIVITY (Polished)
// ==========================================
const MyActivityContainer = ({ isVisible }) => {
  const [activeTime, setActiveTime] = useState('all');
  const [activeTypes, setActiveTypes] = useState(['all']);

  return (
    <div className={`absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isVisible ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
      
      {/* Unified Filter Surface */}
      <div className="bg-[#FFFFFF] rounded-b-[24px] shadow-sm border-b border-[#E5E5E5]/50 px-4 pt-4 pb-5 mb-4 space-y-5">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 bg-[#F7F7F8] px-3 py-1.5 rounded-[12px] active:scale-95 transition-transform">
            <span className="text-[16px]">{MOCK_PET.avatar}</span>
            <span className="text-[14px] font-semibold text-[#111111]">{MOCK_PET.name}</span>
            <ChevronDown size={14} color="#6E6E73" />
          </button>
          <button className="text-[14px] font-semibold text-[#FF6A3D] flex items-center gap-1 bg-[#FF6A3D]/10 px-3 py-1.5 rounded-[12px]">
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto hide-scroll">
          {['All', 'Today', 'This Week', 'This Month'].map(t => (
            <button 
              key={t} onClick={() => setActiveTime(t.toLowerCase())}
              className={`pb-1 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${activeTime === t.toLowerCase() ? 'border-[#FF6A3D] text-[#111111]' : 'border-transparent text-[#8E8E93]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scroll">
          {[
            { id: 'all', label: 'All' }, { id: 'health', label: 'Health' }, 
            { id: 'bookings', label: 'Bookings' }, { id: 'photos', label: 'Photos' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setActiveTypes([type.id])}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                activeTypes.includes(type.id) 
                  ? 'bg-[#111111] text-[#FFFFFF]' 
                  : 'bg-[#F7F7F8] text-[#6E6E73]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 pb-24 space-y-3">
        {/* Date Divider */}
        <div className="sticky top-0 z-10 py-2 bg-[#F7F7F8]/95 backdrop-blur-sm -mx-4 px-4 mb-2">
          <span className="text-[12px] font-bold text-[#8E8E93] tracking-widest uppercase">This Week</span>
        </div>

        {MY_ACTIVITIES.map((act) => (
          <div key={act.id} className="bg-[#FFFFFF] p-4 rounded-[16px] border border-black/[0.04] flex gap-4 items-start shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[18px] shrink-0">
              {act.type === 'walk' ? '🐕' : act.type === 'medication' ? '💊' : act.type === 'photo' ? '📸' : act.type === 'weight' ? '⚖️' : '🏥'}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[15px] font-semibold text-[#111111] capitalize">{act.type.replace('-', ' ')}</h4>
                <span className="text-[12px] text-[#8E8E93]">{formatRelativeTime(new Date(act.timestamp))}</span>
              </div>
              {act.type === 'walk' && <p className="text-[14px] text-[#6E6E73]">{act.duration} με {act.provider}</p>}
              {act.type === 'medication' && <p className="text-[14px] text-[#6E6E73]">{act.medName}</p>}
              {act.type === 'photo' && (
                <div className="mt-2 w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-[#F7F7F8]">
                  <img src={act.photoUrl} alt="Activity" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MODE 2: FRIENDS (MVP)
// ==========================================
const FriendsActivityContainer = ({ isVisible }) => {
  const handleFeatureLocked = (feature) => alert(`${feature} is coming soon! Utility first.`);

  return (
    <div className={`absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isVisible ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
      
      {/* Privacy Posture Note */}
      <div className="px-4 py-3 bg-[#E8F2FF] flex items-center justify-center gap-2 mb-2">
        <Lock size={14} className="text-[#007AFF]" />
        <span className="text-[13px] font-medium text-[#007AFF]">Health data is always private.</span>
      </div>

      <div className="px-4 py-2 flex items-center justify-between mb-4">
        <span className="text-[14px] font-semibold text-[#111111]">12 Friends</span>
        <button className="text-[14px] font-semibold text-[#FF6A3D]">Add Friend</button>
      </div>

      {/* Friends Feed */}
      <div className="px-4 pb-24 space-y-4">
        {FRIENDS_ACTIVITIES.map((act) => (
          <div key={act.id} className="bg-[#FFFFFF] rounded-[20px] border border-black/[0.04] shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Header */}
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[18px]">
                {act.ownerAvatar}
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-[#111111]">{act.friendName} <span className="text-[#8E8E93] font-normal text-[13px]">· {act.breed}</span></h4>
                <p className="text-[12px] text-[#8E8E93]">{formatRelativeTime(new Date(act.timestamp))}</p>
              </div>
              <MoreVertical size={18} className="text-[#CFCFD4]" />
            </div>

            {/* Content Body */}
            {act.type === 'photo' && (
              <>
                <div className="w-full aspect-square bg-[#F7F7F8]">
                  <img src={act.photoUrl} alt="Friend activity" className="w-full h-full object-cover" />
                </div>
                {act.caption && <p className="px-4 pt-3 text-[14px] text-[#111111]">{act.caption}</p>}
              </>
            )}

            {act.type === 'check-in' && (
              <div className="px-4 pb-2">
                <div className="bg-[#F7F7F8] rounded-[16px] p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFFFFF] flex items-center justify-center shadow-sm">
                    <MapPin size={20} className="text-[#FF6A3D]" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[15px] font-semibold text-[#111111]">{act.placeName}</h5>
                    <p className="text-[13px] text-[#6E6E73]">{act.placeType}</p>
                  </div>
                  <button className="text-[13px] font-semibold text-[#FF6A3D] bg-[#FFFFFF] px-3 py-1.5 rounded-full shadow-sm">Save</button>
                </div>
              </div>
            )}

            {act.type === 'playdate' && (
              <div className="px-4 pb-2">
                <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[16px] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-[#FF6A3D]" />
                    <span className="text-[13px] font-semibold text-[#FF6A3D] uppercase tracking-wider">Playdate Created</span>
                  </div>
                  <h5 className="text-[16px] font-semibold text-[#111111] mb-1">{act.dateStr}</h5>
                  <p className="text-[14px] text-[#6E6E73] mb-4">📍 {act.placeName}</p>
                  <button className="w-full py-2.5 bg-[#F7F7F8] text-[#111111] text-[14px] font-semibold rounded-[12px] hover:bg-[#E5E5EA] transition-colors">
                    Request to Join
                  </button>
                </div>
              </div>
            )}

            {act.type === 'milestone' && (
              <div className="px-4 pb-2">
                <div className="bg-gradient-to-br from-[#FFF4ED] to-[#FFFFFF] border border-[#FF6A3D]/20 rounded-[16px] p-6 text-center">
                  <span className="text-[32px] mb-2 block">🎯</span>
                  <h5 className="text-[16px] font-bold text-[#111111]">{act.title}</h5>
                </div>
              </div>
            )}

            {/* Social Actions MVP */}
            <div className="px-4 py-3 flex items-center gap-4 border-t border-black/[0.04] mt-2">
              <button className="flex items-center gap-1.5 text-[#111111] hover:text-[#FF6A3D] transition-colors">
                <Heart size={20} /> <span className="text-[14px] font-medium">12</span>
              </button>
              <button onClick={() => handleFeatureLocked('Comments')} className="flex items-center gap-1.5 text-[#8E8E93] hover:text-[#111111] transition-colors">
                <MessageCircle size={20} /> <span className="text-[14px] font-medium">Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MODE 3: COMMUNITY (Premium Placeholder)
// ==========================================
const CommunityPlaceholderContainer = ({ isVisible }) => {
  return (
    <div className={`absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar bg-[#F7F7F8] transition-opacity duration-300 ${isVisible ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
      
      <div className="px-6 pt-8 pb-10 text-center">
        <div className="w-16 h-16 bg-[#FFFFFF] rounded-[20px] shadow-sm flex items-center justify-center mx-auto mb-6">
          <Globe size={32} className="text-[#111111]" />
        </div>
        <h2 className="text-[28px] font-bold text-[#111111] tracking-tight mb-3">Community</h2>
        <p className="text-[15px] text-[#6E6E73] leading-relaxed max-w-[280px] mx-auto mb-8">
          Public discovery, local meetups, and breed communities — built for real-world utility.
        </p>

        <div className="bg-[#FFFFFF] rounded-[24px] p-1.5 shadow-sm border border-black/[0.04] flex items-center mb-10 max-w-[320px] mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 bg-transparent px-4 text-[15px] focus:outline-none placeholder:text-[#8E8E93]" />
          <button className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 rounded-[20px] text-[14px] font-semibold active:scale-95 transition-transform">
            Notify me
          </button>
        </div>
      </div>

      {/* Preview Cards (Locked / Blurred) */}
      <div className="px-4 pb-24 space-y-4 opacity-70 pointer-events-none select-none">
        <h4 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest px-2 mb-2">Coming Soon</h4>
        
        <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F7F7F8] rounded-[16px] flex items-center justify-center"><MapPin size={24} color="#FF6A3D" /></div>
          <div>
            <h5 className="text-[16px] font-semibold text-[#111111]">Local Neighborhoods</h5>
            <p className="text-[14px] text-[#6E6E73]">Connect with dogs in your area.</p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F7F7F8] rounded-[16px] flex items-center justify-center"><Users size={24} color="#FF6A3D" /></div>
          <div>
            <h5 className="text-[16px] font-semibold text-[#111111]">Breed Communities</h5>
            <p className="text-[14px] text-[#6E6E73]">Expert-moderated breed advice.</p>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04] flex items-center gap-4">
          <div className="w-12 h-12 bg-[#F7F7F8] rounded-[16px] flex items-center justify-center"><ShieldAlert size={24} color="#FF6A3D" /></div>
          <div>
            <h5 className="text-[16px] font-semibold text-[#111111]">Lost Pet Network</h5>
            <p className="text-[14px] text-[#6E6E73]">Real-time local alerts.</p>
          </div>
        </div>
      </div>

    </div>
  );
};

// Temp component for missing Globe icon
const Globe = ({size, className, color}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
)

// ==========================================
// MAIN APP SCREEN (ActivityHubScreen)
// ==========================================
export default function App() {
  const [activeMode, setActiveMode] = useState('my');
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacySheetOpen, setPrivacySheetOpen] = useState(false);

  const MODES = [
    { id: 'my', label: 'My' },
    { id: 'friends', label: 'Friends', badge: true }, // Notification dot mockup
    { id: 'community', label: 'Community' }
  ];

  const handleMenuClick = () => setMenuOpen(true);
  const handleOpenPrivacy = () => {
    setMenuOpen(false);
    setTimeout(() => setPrivacySheetOpen(true), 300);
  };

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased text-[#111111]">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* iPhone Wrapper */}
      <div id="mockup-root" className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#F7F7F8] sm:rounded-[50px] overflow-hidden sm:border-[8px] border-black sm:shadow-2xl flex flex-col">
        
        {/* HEADER */}
        <header className="px-5 pt-14 pb-2 bg-[#F7F7F8] z-30 flex items-center justify-between">
          <h1 className="text-[28px] font-bold tracking-tight text-[#111111]">Activity</h1>
          <button onClick={handleMenuClick} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
            <MoreVertical size={24} color="#111111" />
          </button>
        </header>

        {/* 3-MODE SEGMENTED CONTROL */}
        <SegmentedModeControl modes={MODES} activeMode={activeMode} onChange={setActiveMode} />

        {/* LAYERED CONTAINERS (Preserves Scroll & Smooth Fade) */}
        <div className="relative flex-1 w-full overflow-hidden mt-1">
          <MyActivityContainer isVisible={activeMode === 'my'} />
          <FriendsActivityContainer isVisible={activeMode === 'friends'} />
          <CommunityPlaceholderContainer isVisible={activeMode === 'community'} />
        </div>
        
      </div>

      {/* ================= BOTTOM SHEETS ================= */}

      {/* Main Menu Sheet */}
      <BottomSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="flex flex-col gap-1">
          <button onClick={handleOpenPrivacy} className="flex items-center gap-3 w-full p-4 hover:bg-[#F7F7F8] rounded-[16px] transition-colors text-left active:bg-[#F0F0F2]">
            <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0"><Lock size={18} color="#111111" /></div>
            <span className="text-[16px] font-medium text-[#111111]">Privacy settings</span>
          </button>
          <div className="h-[1px] bg-black/[0.04] mx-4 my-1" />
          <button onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full p-4 hover:bg-[#F7F7F8] rounded-[16px] transition-colors text-left active:bg-[#F0F0F2]">
            <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0"><Download size={18} color="#111111" /></div>
            <span className="text-[16px] font-medium text-[#111111]">Export activity log</span>
          </button>
        </div>
      </BottomSheet>

      {/* Privacy Settings Sheet */}
      <BottomSheet isOpen={privacySheetOpen} onClose={() => setPrivacySheetOpen(false)} title="Activity Privacy">
        <div className="flex flex-col gap-6">
          <p className="text-[14px] text-[#6E6E73] mt(-2) leading-relaxed">
            Control who can see your pet's timeline. Health data is strictly private by design.
          </p>
          
          <div className="space-y-5">
            {[
              { label: 'Photos', default: 'Friends only' },
              { label: 'Check-ins', default: 'Friends only' },
              { label: 'Milestones', default: 'Friends only' },
              { label: 'Service Reviews', default: 'Public' },
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-2">
                <label className="text-[15px] font-semibold text-[#111111]">{item.label}</label>
                <div className="relative">
                  <select className="w-full h-[52px] px-4 bg-[#F7F7F8] border border-transparent text-[16px] text-[#111111] rounded-[16px] appearance-none focus:outline-none focus:border-[#FF6A3D] focus:bg-[#FFFFFF] transition-colors">
                    <option>{item.default}</option>
                    <option>Private</option>
                    <option>Public</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8E8E93]" size={18} />
                </div>
              </div>
            ))}

            {/* Locked Health Row */}
            <div className="flex flex-col gap-2 opacity-60 pointer-events-none mt-2">
              <label className="text-[15px] font-semibold text-[#111111] flex items-center gap-1.5">
                Health Data <Lock size={14} />
              </label>
              <div className="w-full h-[52px] px-4 bg-[#F7F7F8] border border-transparent text-[16px] text-[#8E8E93] rounded-[16px] flex items-center">
                Always Private
              </div>
            </div>
          </div>

          <button onClick={() => setPrivacySheetOpen(false)} className="w-full h-[56px] bg-[#111111] text-white font-semibold text-[16px] rounded-[16px] mt-2 active:scale-[0.98] transition-transform">
            Save Changes
          </button>
        </div>
      </BottomSheet>

    </div>
  );
}