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
  ArrowRight,
  ArrowLeft,
  UserPlus,
  UserCheck,
  UserMinus,
  Check,
  X,
  Clock,
  Inbox,
  CalendarDays,
  Map,
  Navigation,
  CheckCircle2,
  XCircle
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

const mockFriendData = {
  currentUser: { id: 'user_001', activePetId: 'pet_001' },
  pet: { id: 'pet_001', name: 'Luna', breed: 'Golden Retriever', age: 3, weight: 28 },
  friends: [
    {
      id: 'friendship_001', userId: 'user_002', petId: 'pet_002',
      petName: 'Max', petBreed: 'French Bulldog',
      petPhoto: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150',
      ownerName: "Max's owner",
      distance: 1.2, friendsSince: 'Feb 2026', lastActive: '2 hours ago', age: 2
    },
    {
      id: 'friendship_002', userId: 'user_003', petId: 'pet_003',
      petName: 'Bella', petBreed: 'Labrador',
      petPhoto: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150',
      ownerName: "Bella's owner",
      distance: 2.3, friendsSince: 'Jan 2026', lastActive: '1 day ago', age: 4
    }
  ],
  receivedRequests: [
    {
      id: 'request_001', fromUserId: 'user_004', fromPetId: 'pet_004',
      fromPetName: 'Charlie', fromPetBreed: 'Beagle', ownerName: "Charlie's owner",
      fromPetPhoto: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=150&h=150',
      message: null, createdAt: new Date().toISOString(), timeAgo: '2 hours ago'
    }
  ],
  sentRequests: [
    {
      id: 'request_002', toUserId: 'user_005', toPetId: 'pet_005',
      toPetName: 'Rocky', toPetBreed: 'Shiba Inu', ownerName: "Rocky's owner",
      toPetPhoto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150&h=150',
      createdAt: daysAgo(3).toISOString(), timeAgo: '3 days ago'
    }
  ],
  suggestions: [
    {
      id: 'suggestion_001', userId: 'user_006', petId: 'pet_006',
      petName: 'Daisy', petBreed: 'Golden Retriever', ownerName: "Daisy's owner",
      petPhoto: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150',
      distance: 1.8, matchScore: 92,
      reasons: [
        { type: 'breed', value: 'Both Golden Retrievers' },
        { type: 'age', value: 'Similar age (3 years)' },
        { type: 'location', value: '1.8 km away' }
      ]
    },
    {
      id: 'suggestion_002', userId: 'user_007', petId: 'pet_007',
        petName: 'Milo', petBreed: 'Labrador', ownerName: "Milo's owner",
        petPhoto: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=150&h=150',
        distance: 2.5, matchScore: 78,
        reasons: [
          { type: 'size', value: 'Similar size (Large)' },
          { type: 'location', value: '2.5 km away' },
          { type: 'places', value: 'Both love Zurichhorn Park' }
        ]
      }
    ]
  };

  const mockPlaydateData = {
    upcomingPlaydates: [
      {
        id: 'playdate_001',
        hostId: 'user_001',
        hostPetName: 'Luna',
        date: '2026-03-02',
        startTime: '10:00 AM',
        duration: 60,
        endTime: '11:00 AM',
        place: {
          id: 'place_001',
          name: 'Zurichhorn Park',
          address: 'Seestrasse, 8008 Zürich',
          location: { lat: 47.3547, lng: 8.5496 }
        },
        invitees: [
          {
            userId: 'user_002',
            petName: 'Max',
            petBreed: 'French Bulldog',
            petPhoto: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150',
            status: 'accepted'
          },
          {
            userId: 'user_003',
            petName: 'Bella',
            petBreed: 'Labrador',
            petPhoto: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150',
            status: 'pending'
          }
        ],
        status: 'upcoming',
        notes: 'Meet by the lake entrance!',
        messages: [
          { userId: 'user_001', message: "Can't wait!", timestamp: '2026-02-22T10:05:00Z' },
          { userId: 'user_002', message: 'See you there!', timestamp: '2026-02-22T14:00:00Z' }
        ]
      },
      {
        id: 'playdate_live',
        hostId: 'user_002',
        hostPetName: 'Max',
        date: '2026-03-02',
        startTime: '09:00 AM',
        duration: 60,
        endTime: '10:00 AM',
        place: {
          id: 'place_002',
          name: 'Lindenhof',
          address: 'Lindenhof, 8001 Zürich'
        },
        invitees: [
          {
            userId: 'user_001',
            petName: 'Luna',
            petBreed: 'Golden Retriever',
            petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150',
            status: 'accepted'
          }
        ],
        status: 'in-progress',
        notes: '',
        messages: []
      }
    ],
    pendingInvitations: [
      {
        id: 'playdate_002',
        hostId: 'user_004',
        hostPetName: 'Charlie',
        date: '2026-03-01',
        startTime: '4:00 PM',
        duration: 90,
        place: {
          name: 'Rieterpark',
          address: 'Seestrasse 59, 8002 Zürich'
        },
        invitees: [
          { userId: 'user_001', petId: 'pet_001', status: 'pending' }
        ],
        status: 'upcoming'
      }
    ],
    completedPlaydates: [
      {
        id: 'playdate_003',
        date: '2026-02-15',
        place: { name: 'Zurichhorn Park' },
        participants: ['Max', 'Bella'],
        status: 'completed'
      }
    ]
  };

  const formatDateStr = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

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

const SubScreenPortal = ({ isOpen, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

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
    <div 
      className={`absolute inset-0 bg-[#F7F7F8] z-[60] flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}
    >
      {children}
    </div>,
    document.getElementById('mockup-root') || document.body
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

      <div className="px-4 pb-24 space-y-3">
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
// MODE 2: FRIENDS (STEP 26: FULL SYSTEM)
// ==========================================
const FriendsActivityContainer = ({ isVisible, setGlobalBadge }) => {
  // State for Sub-navigation within Friends Tab
  const [currentView, setCurrentView] = useState('list'); // 'list', 'search', 'requests', 'profile', 'suggestions', 'playdatesList', 'playdateDetails'
  const [activeProfile, setActiveProfile] = useState(null);
  const [activePlaydate, setActivePlaydate] = useState(null);
  const [createPlaydateOpen, setCreatePlaydateOpen] = useState(false);

  // Social Data State (To make interactions visually work)
  const [friends, setFriends] = useState(mockFriendData.friends);
  const [receivedReqs, setReceivedReqs] = useState(mockFriendData.receivedRequests);
  const [sentReqs, setSentReqs] = useState(mockFriendData.sentRequests);
  const [suggestions, setSuggestions] = useState(mockFriendData.suggestions);
  
  // Playdate Data State
  const [upcomingPlaydates, setUpcomingPlaydates] = useState(mockPlaydateData.upcomingPlaydates);
  const [pendingPlaydates, setPendingPlaydates] = useState(mockPlaydateData.pendingInvitations);
  const [completedPlaydates, setCompletedPlaydates] = useState(mockPlaydateData.completedPlaydates);

  // Update global badge on the Tab
  useEffect(() => {
    setGlobalBadge(receivedReqs.length > 0 || pendingPlaydates.length > 0);
  }, [receivedReqs, pendingPlaydates, setGlobalBadge]);

  // Actions
  const handleAcceptRequest = (req) => {
    setReceivedReqs(prev => prev.filter(r => r.id !== req.id));
    setFriends(prev => [{
      id: `friendship_new_${Date.now()}`,
      userId: req.fromUserId, petId: req.fromPetId, petName: req.fromPetName,
      petBreed: req.fromPetBreed, petPhoto: req.fromPetPhoto, ownerName: req.ownerName,
      distance: 1.5, friendsSince: 'Just now', lastActive: 'Just now'
    }, ...prev]);
  };

  const handleDeclineRequest = (reqId) => {
    setReceivedReqs(prev => prev.filter(r => r.id !== reqId));
  };

  const handleSendRequest = (sugg) => {
    setSuggestions(prev => prev.filter(s => s.id !== sugg.id));
    setSentReqs(prev => [{
      id: `req_new_${Date.now()}`, toUserId: sugg.userId, toPetId: sugg.petId,
      toPetName: sugg.petName, toPetBreed: sugg.petBreed, ownerName: sugg.ownerName,
      toPetPhoto: sugg.petPhoto, createdAt: new Date().toISOString(), timeAgo: 'Just now'
    }, ...prev]);
  };

  const handleDismissSuggestion = (id) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleRemoveFriend = (id) => {
    setFriends(prev => prev.filter(f => f.id !== id));
    setCurrentView('list');
  };

  const handleAcceptPlaydate = (id) => {
    const pd = pendingPlaydates.find(p => p.id === id);
    if (pd) {
      setPendingPlaydates(prev => prev.filter(p => p.id !== id));
      setUpcomingPlaydates(prev => [...prev, { ...pd, invitees: pd.invitees.map(i => i.userId === 'user_001' ? { ...i, status: 'accepted' } : i) }]);
    }
  };

  const handleDeclinePlaydate = (id) => {
    setPendingPlaydates(prev => prev.filter(p => p.id !== id));
  };

  // 1. MAIN LIST VIEW
  const MainListView = () => (
    <div className="absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar pt-2 pb-24 space-y-6">
      {/* Header Context */}
      <div className="px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FFFFFF] rounded-[12px] flex items-center justify-center text-[20px] shadow-sm border border-black/[0.04]">
            {MOCK_PET.avatar}
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-[#111111]">{MOCK_PET.name}'s Friends</h2>
            <p className="text-[13px] text-[#6E6E73]">{MOCK_PET.breed}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setCurrentView('playdatesList')} className="w-10 h-10 rounded-full bg-[#FFFFFF] shadow-sm border border-black/[0.04] flex items-center justify-center text-[#111111] active:scale-95 transition-transform relative">
            <CalendarDays size={18} />
            {pendingPlaydates.length > 0 && <span className="absolute top-[8px] right-[8px] w-2.5 h-2.5 bg-[#FF3B30] border-2 border-[#FFFFFF] rounded-full" />}
          </button>
          <button onClick={() => setCurrentView('search')} className="w-10 h-10 rounded-full bg-[#FFFFFF] shadow-sm border border-black/[0.04] flex items-center justify-center text-[#111111] active:scale-95 transition-transform">
            <Search size={18} />
          </button>
          <button onClick={() => setCurrentView('search')} className="w-10 h-10 rounded-full bg-[#111111] shadow-sm flex items-center justify-center text-[#FFFFFF] active:scale-95 transition-transform">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Received Requests (If any) */}
      {receivedReqs.length > 0 && (
        <div className="px-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest flex items-center gap-2">
              Friend Requests <span className="bg-[#FF3B30] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{receivedReqs.length}</span>
            </h3>
            <button onClick={() => setCurrentView('requests')} className="text-[13px] font-semibold text-[#FF6A3D]">View All</button>
          </div>
          <div className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-black/[0.04]">
            <div className="flex gap-4">
              <img src={receivedReqs[0].fromPetPhoto} alt="pet" className="w-[52px] h-[52px] rounded-full object-cover bg-[#F7F7F8]" />
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-[#111111] leading-tight mb-1">{receivedReqs[0].fromPetName} <span className="font-normal text-[#6E6E73]">({receivedReqs[0].fromPetBreed})</span></p>
                <p className="text-[13px] text-[#8E8E93] mb-3">{receivedReqs[0].ownerName} sent a request</p>
                <div className="flex gap-2">
                  <button onClick={() => handleDeclineRequest(receivedReqs[0].id)} className="flex-1 py-1.5 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[10px] active:bg-[#E5E5EA]">Decline</button>
                  <button onClick={() => handleAcceptRequest(receivedReqs[0])} className="flex-1 py-1.5 bg-[#FF6A3D] text-[#FFFFFF] text-[13px] font-semibold rounded-[10px] active:opacity-80">Accept</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <div className="px-5 flex items-center justify-between mb-3">
            <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest">Suggestions</h3>
            <button onClick={() => setCurrentView('suggestions')} className="text-[13px] font-semibold text-[#FF6A3D]">See All</button>
          </div>
          <div className="flex gap-4 overflow-x-auto custom-scrollbar px-5 pb-2">
            {suggestions.map(sugg => (
              <div key={sugg.id} className="min-w-[220px] w-[220px] bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-black/[0.04] flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <img src={sugg.petPhoto} alt={sugg.petName} className="w-[56px] h-[56px] rounded-full object-cover bg-[#F7F7F8]" />
                  <button onClick={() => handleDismissSuggestion(sugg.id)} className="p-1 text-[#CFCFD4] hover:text-[#8E8E93]"><X size={16} /></button>
                </div>
                <h4 className="text-[16px] font-bold text-[#111111] leading-tight">{sugg.petName}</h4>
                <p className="text-[13px] text-[#6E6E73] mb-1 truncate">{sugg.petBreed}</p>
                <div className="text-[12px] font-medium text-[#34C759] flex items-center gap-1 mb-3">
                  <Heart size={12} fill="currentColor" /> {sugg.matchScore}% Match
                </div>
                <div className="mt-auto pt-2 border-t border-black/[0.04]">
                  <button onClick={() => handleSendRequest(sugg)} className="w-full py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px] flex items-center justify-center gap-1.5 active:bg-[#E5E5EA]">
                    <UserPlus size={16} /> Add Friend
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* My Friends */}
      <div className="px-5 pb-6">
        <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">My Friends ({friends.length})</h3>
        {friends.length === 0 ? (
          <div className="bg-[#FFFFFF] rounded-[20px] p-6 text-center shadow-sm border border-black/[0.04]">
            <div className="w-12 h-12 bg-[#F7F7F8] rounded-full flex items-center justify-center mx-auto mb-3"><Users size={24} className="text-[#8E8E93]" /></div>
            <p className="text-[15px] font-semibold text-[#111111] mb-1">No friends yet</p>
            <p className="text-[13px] text-[#6E6E73] mb-4">Connect with other pets to share activities and schedule playdates.</p>
            <button onClick={() => setCurrentView('search')} className="px-5 py-2 bg-[#111111] text-white text-[14px] font-semibold rounded-full">Find Friends</button>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map(friend => (
              <div 
                key={friend.id} 
                onClick={() => { setActiveProfile(friend); setCurrentView('profile'); }}
                className="bg-[#FFFFFF] p-3 rounded-[16px] flex items-center gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-black/[0.04] active:scale-[0.98] transition-transform cursor-pointer"
              >
                <img src={friend.petPhoto} alt="friend" className="w-[52px] h-[52px] rounded-full object-cover bg-[#F7F7F8]" />
                <div className="flex-1">
                  <h4 className="text-[15px] font-semibold text-[#111111]">{friend.petName}</h4>
                  <p className="text-[13px] text-[#6E6E73]">{friend.petBreed} · {friend.distance} km</p>
                </div>
                <ChevronRight size={20} className="text-[#CFCFD4]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // 2. SEARCH SCREEN (Add Friend)
  const SearchScreen = () => {
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);

    // Mock search logic
    const results = query.length > 1 ? suggestions : [];

    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
        <div className="px-4 pt-14 pb-3 flex items-center gap-3 bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
          <button onClick={() => setCurrentView('list')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input 
              autoFocus
              value={query} onChange={(e) => { setQuery(e.target.value); setSearching(true); setTimeout(() => setSearching(false), 300); }}
              placeholder="Search by pet name, breed..." 
              className="w-full h-10 pl-10 pr-4 bg-[#F0F0F2] rounded-[12px] text-[15px] focus:outline-none placeholder:text-[#8E8E93]" 
            />
            {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]"><X size={16} /></button>}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {searching ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#8E8E93]" size={24} /></div>
          ) : query.length > 1 && results.length === 0 ? (
            <div className="text-center py-10 px-6">
              <Search size={32} className="text-[#CFCFD4] mx-auto mb-3" />
              <p className="text-[15px] font-medium text-[#111111]">No pets found for "{query}"</p>
              <p className="text-[14px] text-[#6E6E73] mt-2">Try a different spelling or invite friends to FYLOS.</p>
            </div>
          ) : query.length > 1 ? (
            <div className="space-y-3">
              <h4 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2">Search Results</h4>
              {results.map(res => (
                <div key={res.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04] flex items-center gap-4">
                  <img src={res.petPhoto} alt="" className="w-12 h-12 rounded-full object-cover bg-[#F7F7F8]" />
                  <div className="flex-1">
                    <h5 className="text-[15px] font-semibold text-[#111111]">{res.petName}</h5>
                    <p className="text-[13px] text-[#6E6E73]">{res.petBreed} · {res.ownerName}</p>
                  </div>
                  <button onClick={() => { handleSendRequest(res); setQuery(''); }} className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#111111] hover:bg-[#E5E5EA]">
                    <UserPlus size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-10 px-6">
               <p className="text-[14px] text-[#8E8E93]">Type to find friends nearby</p>
             </div>
          )}
        </div>
      </div>
    );
  };

  // 3. FRIEND REQUESTS SCREEN
  const RequestsScreen = () => (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
      <div className="px-4 pt-14 pb-3 flex items-center gap-3 bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
        <button onClick={() => setCurrentView('list')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
        <h2 className="text-[18px] font-bold text-[#111111]">Friend Requests</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-10">
        
        <div>
          <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Received ({receivedReqs.length})</h3>
          {receivedReqs.length === 0 ? (
            <div className="bg-transparent border border-dashed border-[#CFCFD4] rounded-[16px] p-6 text-center">
              <Inbox size={24} className="text-[#8E8E93] mx-auto mb-2" />
              <p className="text-[14px] text-[#6E6E73]">No pending requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {receivedReqs.map(req => (
                <div key={req.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04]">
                  <div className="flex gap-4">
                    <img src={req.fromPetPhoto} alt="" className="w-14 h-14 rounded-full object-cover bg-[#F7F7F8]" />
                    <div className="flex-1">
                      <h5 className="text-[15px] font-semibold text-[#111111] leading-tight mb-1">{req.fromPetName}</h5>
                      <p className="text-[13px] text-[#6E6E73] mb-1">{req.fromPetBreed}</p>
                      <p className="text-[12px] text-[#8E8E93] mb-3 flex items-center gap-1"><Clock size={12}/> {req.timeAgo}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDeclineRequest(req.id)} className="flex-1 py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px] active:bg-[#E5E5EA]">Decline</button>
                        <button onClick={() => handleAcceptRequest(req)} className="flex-1 py-2 bg-[#FF6A3D] text-[#FFFFFF] text-[13px] font-semibold rounded-[12px] active:opacity-80">Accept</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Sent ({sentReqs.length})</h3>
          <div className="space-y-3">
            {sentReqs.map(req => (
              <div key={req.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04] flex items-center gap-4">
                <img src={req.toPetPhoto} alt="" className="w-12 h-12 rounded-full object-cover bg-[#F7F7F8] opacity-70" />
                <div className="flex-1">
                  <h5 className="text-[15px] font-semibold text-[#111111]">{req.toPetName}</h5>
                  <p className="text-[13px] text-[#6E6E73]">Sent {req.timeAgo}</p>
                </div>
                <button onClick={() => setSentReqs(prev => prev.filter(r=>r.id !== req.id))} className="px-3 py-1.5 bg-[#F7F7F8] text-[#FF3B30] text-[12px] font-semibold rounded-[8px]">Cancel</button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  // 4. FRIEND PROFILE SCREEN
  const ProfileScreen = () => {
    if (!activeProfile) return null;
    const [menuOpen, setMenuOpen] = useState(false);
    
    return (
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#F0F0F2]">
        <div className="absolute top-14 left-4 right-4 flex justify-between z-10">
          <button onClick={() => setCurrentView('list')} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
          <button onClick={() => setMenuOpen(!menuOpen)} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white relative">
            < MoreVertical size={20} />
            {menuOpen && (
              <div className="absolute top-12 right-0 w-48 bg-[#FFFFFF] rounded-[16px] shadow-xl border border-black/[0.04] overflow-hidden py-1">
                <button className="w-full px-4 py-3 text-left text-[15px] font-medium text-[#111111] hover:bg-[#F7F7F8]">Mute notifications</button>
                <div className="h-[1px] bg-black/[0.04]" />
                <button onClick={() => handleRemoveFriend(activeProfile.id)} className="w-full px-4 py-3 text-left text-[15px] font-medium text-[#FF3B30] hover:bg-[#FFF0F0]">Remove friend</button>
              </div>
            )}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 relative">
          <div className="h-[280px] w-full bg-[#E5E5EA] relative shrink-0">
            <img src={activeProfile.petPhoto} alt="profile" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 text-white">
              <h1 className="text-[32px] font-bold leading-tight drop-shadow-md">{activeProfile.petName}</h1>
              <p className="text-[15px] font-medium opacity-90">{activeProfile.petBreed} · {activeProfile.age} years</p>
            </div>
          </div>
          
          <div className="px-5 py-5 space-y-6">
            <div className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F2FF] flex items-center justify-center text-[#007AFF]"><MapPin size={24} /></div>
              <div>
                <p className="text-[15px] font-semibold text-[#111111]">{activeProfile.distance} km away</p>
                <p className="text-[13px] text-[#6E6E73]">Friends since {activeProfile.friendsSince}</p>
              </div>
            </div>

            <div>
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Recent Activity</h3>
              <div className="space-y-3">
                <div className="bg-[#FFFFFF] p-4 rounded-[16px] border border-black/[0.04] shadow-sm flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[18px]">📸</div>
                  <div>
                    <p className="text-[14px] font-medium text-[#111111]">Photo at Zurichhorn Park</p>
                    <p className="text-[12px] text-[#8E8E93]">2 hours ago</p>
                  </div>
                </div>
                <div className="bg-[#FFFFFF] p-4 rounded-[16px] border border-black/[0.04] shadow-sm flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[18px]">🐕</div>
                  <div>
                    <p className="text-[14px] font-medium text-[#111111]">Walk completed (45 min)</p>
                    <p className="text-[12px] text-[#8E8E93]">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
               <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Shared Favorites</h3>
               <div className="flex gap-2">
                 <span className="px-3 py-1.5 bg-[#FFFFFF] text-[#111111] text-[13px] font-medium rounded-full border border-black/[0.04] shadow-sm">🌳 Zurichhorn Park</span>
                 <span className="px-3 py-1.5 bg-[#FFFFFF] text-[#111111] text-[13px] font-medium rounded-full border border-black/[0.04] shadow-sm">✂️ Paws Grooming</span>
               </div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-[#F0F0F2]/90 backdrop-blur-md border-t border-black/[0.04] z-20">
          <div className="flex gap-3">
            <button className="flex-1 py-3.5 bg-[#FFFFFF] text-[#111111] text-[15px] font-semibold rounded-[16px] shadow-sm flex items-center justify-center gap-2 border border-black/[0.04]">
              <MessageCircle size={18} /> Message
            </button>
            <button className="flex-1 py-3.5 bg-[#FF6A3D] text-[#FFFFFF] text-[15px] font-semibold rounded-[16px] shadow-sm flex items-center justify-center gap-2">
              <Calendar size={18} /> Playdate
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 5. SUGGESTIONS SCREEN
  const SuggestionsScreen = () => (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
      <div className="px-4 pt-14 pb-3 flex items-center gap-3 bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
        <button onClick={() => setCurrentView('list')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
        <h2 className="text-[18px] font-bold text-[#111111]">Suggested Friends</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {suggestions.length === 0 ? (
          <div className="text-center py-10"><p className="text-[15px] text-[#6E6E73]">No more suggestions right now.</p></div>
        ) : (
          suggestions.map(sugg => (
             <div key={sugg.id} className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-black/[0.04]">
                <div className="flex gap-4 mb-3">
                  <img src={sugg.petPhoto} alt="" className="w-16 h-16 rounded-full object-cover bg-[#F7F7F8]" />
                  <div className="flex-1">
                    <h5 className="text-[16px] font-bold text-[#111111] leading-tight flex items-center gap-2">
                      {sugg.petName} <span className="text-[12px] font-semibold text-[#34C759] bg-[#E8F8EE] px-2 py-0.5 rounded-full">{sugg.matchScore}% match</span>
                    </h5>
                    <p className="text-[14px] text-[#6E6E73]">{sugg.petBreed} · {sugg.distance} km</p>
                  </div>
                </div>
                <div className="bg-[#F7F7F8] rounded-[12px] p-3 mb-4 space-y-1.5">
                  {sugg.reasons.map((r, i) => (
                    <p key={i} className="text-[13px] text-[#111111] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D]" /> {r.value}
                    </p>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleDismissSuggestion(sugg.id)} className="w-12 h-10 bg-[#F7F7F8] text-[#111111] rounded-[12px] flex items-center justify-center hover:bg-[#E5E5EA]">
                    <X size={20} />
                  </button>
                  <button onClick={() => handleSendRequest(sugg)} className="flex-1 h-10 bg-[#111111] text-[#FFFFFF] text-[14px] font-semibold rounded-[12px] flex items-center justify-center gap-2">
                    <UserPlus size={18} /> Add Friend
                  </button>
                </div>
             </div>
          ))
        )}
      </div>
    </div>
  );

  // 6. PLAYDATES LIST SCREEN
  const PlaydatesListScreen = () => (
    <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
      <div className="px-4 pt-14 pb-3 flex items-center justify-between bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentView('list')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
          <h2 className="text-[18px] font-bold text-[#111111]">Playdates</h2>
        </div>
        <button onClick={() => setCreatePlaydateOpen(true)} className="p-2 -mr-2 text-[#FF6A3D] active:opacity-50"><Plus size={24} /></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-10">
        {/* Pending Invitations */}
        {pendingPlaydates.length > 0 && (
          <div>
            <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3 flex items-center gap-2">
              Invitations <span className="bg-[#FF3B30] text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingPlaydates.length}</span>
            </h3>
            <div className="space-y-3">
              {pendingPlaydates.map(pd => (
                <div key={pd.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-[14px] font-semibold text-[#111111]">{formatDateStr(pd.date)} · {pd.startTime}</p>
                      <p className="text-[13px] text-[#6E6E73] flex items-center gap-1 mt-0.5"><MapPin size={12}/> {pd.place.name}</p>
                    </div>
                  </div>
                  <p className="text-[14px] text-[#111111] mb-4">Hosted by <strong>{pd.hostPetName}'s owner</strong></p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDeclinePlaydate(pd.id)} className="flex-1 py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px] active:bg-[#E5E5EA]">Decline</button>
                    <button onClick={() => handleAcceptPlaydate(pd.id)} className="flex-1 py-2 bg-[#FF6A3D] text-[#FFFFFF] text-[13px] font-semibold rounded-[12px] active:opacity-80">Accept</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming */}
        <div>
           <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Upcoming ({upcomingPlaydates.length})</h3>
           {upcomingPlaydates.length === 0 ? (
             <div className="bg-[#FFFFFF] rounded-[20px] p-6 text-center shadow-sm border border-black/[0.04]">
                <div className="w-12 h-12 bg-[#F7F7F8] rounded-full flex items-center justify-center mx-auto mb-3"><CalendarDays size={24} className="text-[#8E8E93]" /></div>
                <p className="text-[15px] font-semibold text-[#111111] mb-1">No upcoming playdates</p>
                <p className="text-[13px] text-[#6E6E73] mb-4">Schedule a playdate with your friends to get {MOCK_PET.name} out!</p>
                <button onClick={() => setCreatePlaydateOpen(true)} className="px-5 py-2 bg-[#111111] text-white text-[14px] font-semibold rounded-full">Create Playdate</button>
             </div>
           ) : (
             <div className="space-y-3">
               {upcomingPlaydates.map(pd => (
                 <div key={pd.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04]">
                   <div className="flex justify-between items-start mb-3">
                     <div>
                       <p className="text-[15px] font-bold text-[#111111]">{formatDateStr(pd.date)} · {pd.startTime}</p>
                       <p className="text-[13px] text-[#6E6E73] flex items-center gap-1 mt-0.5"><MapPin size={12}/> {pd.place.name}</p>
                     </div>
                     <div className={`text-[11px] font-bold px-2 py-1 rounded-[6px] uppercase tracking-wide ${pd.status === 'in-progress' ? 'bg-[#E8F8EE] text-[#34C759]' : 'bg-[#FFF0ED] text-[#FF6A3D]'}`}>
                       {pd.status === 'in-progress' ? 'Live Now' : 'Upcoming'}
                     </div>
                   </div>
                   <div className="flex items-center gap-2 mb-4">
                     <div className="flex -space-x-2">
                       {pd.invitees.slice(0, 3).map((inv, i) => (
                         <img key={i} src={inv.petPhoto || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=100&h=100'} className="w-8 h-8 rounded-full border-[2px] border-white object-cover bg-[#F7F7F8]" alt="pet"/>
                       ))}
                     </div>
                     <span className="text-[13px] text-[#6E6E73] font-medium">{pd.invitees.length} attendees</span>
                   </div>
                   <button onClick={() => { setActivePlaydate(pd); setCurrentView('playdateDetails'); }} className="w-full py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px] active:bg-[#E5E5EA]">View Details</button>
                 </div>
               ))}
             </div>
           )}
        </div>

        {/* Completed */}
        {completedPlaydates.length > 0 && (
          <div>
            <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Completed ({completedPlaydates.length})</h3>
            <div className="space-y-3">
              {completedPlaydates.map(pd => (
                <div key={pd.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04] flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111111]">{formatDateStr(pd.date)}</p>
                    <p className="text-[13px] text-[#6E6E73] mt-0.5">{pd.place.name}</p>
                  </div>
                  <button className="text-[13px] font-semibold text-[#FF6A3D]">Photos</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 7. PLAYDATE DETAILS SCREEN
  const PlaydateDetailsScreen = () => {
    if (!activePlaydate) return null;
    return (
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F0F0F2] relative">
        <div className="px-4 pt-14 pb-3 flex items-center justify-between bg-[#FFFFFF] border-b border-black/[0.04] shrink-0 z-10">
          <button onClick={() => setCurrentView('playdatesList')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
          <h2 className="text-[16px] font-bold text-[#111111]">Playdate Details</h2>
          <button className="p-2 -mr-2 text-[#111111]"><MoreVertical size={20} /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0 pb-24">
          {/* Header Info */}
          <div className="bg-[#FFFFFF] p-5 pb-6 shadow-sm mb-2">
            <div className="flex items-center gap-2 mb-3">
              {activePlaydate.status === 'in-progress' ? (
                 <span className="flex items-center gap-1.5 text-[#34C759] text-[13px] font-bold tracking-wide uppercase"><span className="w-2 h-2 rounded-full bg-[#34C759] animate-pulse"/> Happening Now</span>
              ) : activePlaydate.status === 'completed' ? (
                 <span className="flex items-center gap-1.5 text-[#8E8E93] text-[13px] font-bold tracking-wide uppercase"><CheckCircle2 size={14}/> Completed</span>
              ) : (
                 <span className="flex items-center gap-1.5 text-[#FF6A3D] text-[13px] font-bold tracking-wide uppercase"><Clock size={14}/> Upcoming</span>
              )}
            </div>
            <h1 className="text-[24px] font-bold text-[#111111] leading-tight mb-1">{formatDateStr(activePlaydate.date)}</h1>
            <p className="text-[15px] font-medium text-[#6E6E73]">{activePlaydate.startTime} - {activePlaydate.endTime}</p>
          </div>

          {/* Location */}
          <div className="bg-[#FFFFFF] p-5 shadow-sm mb-2">
            <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-4">Location</h3>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full bg-[#FFF0ED] flex items-center justify-center text-[#FF6A3D] shrink-0"><MapPin size={20} /></div>
              <div className="flex-1">
                <p className="text-[16px] font-bold text-[#111111] mb-0.5">{activePlaydate.place.name}</p>
                <p className="text-[14px] text-[#6E6E73] mb-4">{activePlaydate.place.address}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px] flex items-center justify-center gap-1.5 active:bg-[#E5E5EA]"><Navigation size={16}/> Directions</button>
                  <button className="flex-1 py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px] flex items-center justify-center gap-1.5 active:bg-[#E5E5EA]"><Map size={16}/> Map</button>
                </div>
              </div>
            </div>
          </div>

          {/* Attending */}
          <div className="bg-[#FFFFFF] p-5 shadow-sm mb-2">
            <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-4">Attending ({activePlaydate.invitees.filter(i => i.status === 'accepted').length + 1}/{activePlaydate.invitees.length + 1})</h3>
            <div className="space-y-5">
              {/* Host */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  {activePlaydate.hostId === 'user_001' ? (
                     <img src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&h=150" className="w-12 h-12 rounded-full object-cover bg-[#F7F7F8]" alt="Host" />
                  ) : (
                     <div className="w-12 h-12 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[20px]">🐕</div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#34C759] border-2 border-white rounded-full flex items-center justify-center text-white"><Check size={10} strokeWidth={4}/></div>
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-bold text-[#111111]">{activePlaydate.hostPetName} {activePlaydate.hostId === 'user_001' ? '(You)' : ''}</p>
                  <p className="text-[13px] font-medium text-[#FF6A3D]">Host</p>
                </div>
              </div>
              {/* Invitees */}
              {activePlaydate.invitees.map((inv, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={inv.petPhoto || 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=150&h=150'} className={`w-12 h-12 rounded-full object-cover bg-[#F7F7F8] ${inv.status !== 'accepted' ? 'opacity-60 grayscale-[50%]' : ''}`} alt={inv.petName} />
                    {inv.status === 'accepted' ? (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#34C759] border-2 border-white rounded-full flex items-center justify-center text-white"><Check size={10} strokeWidth={4}/></div>
                    ) : inv.status === 'pending' ? (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FF9F0A] border-2 border-white rounded-full flex items-center justify-center text-white"><Clock size={10} strokeWidth={3}/></div>
                    ) : (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#FF3B30] border-2 border-white rounded-full flex items-center justify-center text-white"><X size={10} strokeWidth={4}/></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[#111111]">{inv.petName}</p>
                    <p className="text-[13px] text-[#6E6E73] capitalize">{inv.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {activePlaydate.notes && (
            <div className="bg-[#FFFFFF] p-5 shadow-sm mb-2">
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">From Host</h3>
              <div className="bg-[#F7F7F8] p-4 rounded-[16px] border border-black/[0.04]">
                 <p className="text-[14px] text-[#111111] leading-relaxed">"{activePlaydate.notes}"</p>
              </div>
            </div>
          )}

          {/* Chat */}
          <div className="bg-[#FFFFFF] p-5 shadow-sm mb-6">
            <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-4">Chat</h3>
            <div className="space-y-4 mb-4">
              {activePlaydate.messages && activePlaydate.messages.length > 0 ? activePlaydate.messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2 ${msg.userId === 'user_001' ? 'justify-end' : ''}`}>
                  {msg.userId !== 'user_001' && <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=150&h=150" className="w-8 h-8 rounded-full mt-1 object-cover" alt="sender"/>}
                  <div className={`p-3 rounded-[16px] max-w-[80%] ${msg.userId === 'user_001' ? 'bg-[#FF6A3D] text-white rounded-tr-[4px]' : 'bg-[#F7F7F8] text-[#111111] rounded-tl-[4px]'}`}>
                    <p className="text-[14px]">{msg.message}</p>
                  </div>
                </div>
              )) : (
                <p className="text-center text-[#8E8E93] text-[14px] py-4">No messages yet. Say hi!</p>
              )}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Type a message..." className="flex-1 bg-[#F0F0F2] rounded-full px-4 text-[14px] focus:outline-none" />
              <button className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center text-white active:scale-95"><ArrowRight size={18}/></button>
            </div>
          </div>
        </div>
        
        {/* Action Bar based on Status */}
        {activePlaydate.status === 'in-progress' && (
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-[#FFFFFF]/90 backdrop-blur-md border-t border-black/[0.04] z-20">
            <button className="w-full py-4 bg-[#34C759] text-[#FFFFFF] text-[16px] font-bold rounded-[16px] shadow-[0_4px_12px_rgba(52,199,89,0.3)] flex items-center justify-center gap-2 active:scale-95 transition-transform">
              <MapPin size={20} /> Check In Now
            </button>
          </div>
        )}
      </div>
    );
  };

  // 8. CREATE PLAYDATE SHEET
  const CreatePlaydateSheet = () => (
    <BottomSheet isOpen={createPlaydateOpen} onClose={() => setCreatePlaydateOpen(false)} title="Create Playdate">
      <div className="space-y-8">
         {/* Invite Friends */}
         <div>
           <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Invite Friends</h3>
           <div className="space-y-2">
             {friends.map(friend => (
               <label key={friend.id} className="flex items-center justify-between p-3 bg-[#F7F7F8] rounded-[16px] border border-transparent cursor-pointer hover:border-black/[0.04]">
                 <div className="flex items-center gap-3">
                   <img src={friend.petPhoto} className="w-12 h-12 rounded-full object-cover bg-[#FFFFFF]" alt={friend.petName}/>
                   <div>
                     <p className="text-[15px] font-bold text-[#111111]">{friend.petName}</p>
                     <p className="text-[13px] text-[#6E6E73]">{friend.distance} km away</p>
                   </div>
                 </div>
                 <input type="checkbox" className="w-6 h-6 accent-[#FF6A3D] rounded-full border-gray-300" defaultChecked={friend.petName==='Max' || friend.petName==='Bella'} />
               </label>
             ))}
           </div>
           <button className="w-full mt-3 py-3 text-[#FF6A3D] text-[14px] font-bold flex items-center justify-center gap-2 rounded-[12px] active:bg-[#FF6A3D]/10"><Plus size={18}/> Invite More Friends</button>
         </div>

         {/* When */}
         <div>
           <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">When</h3>
           <div className="space-y-3">
             <div className="flex gap-3">
               <div className="flex-1 bg-[#F7F7F8] rounded-[16px] p-3 border border-black/[0.04]">
                 <label className="text-[12px] text-[#8E8E93] font-bold uppercase tracking-wide block mb-1">Date</label>
                 <input type="date" className="w-full bg-transparent text-[16px] font-bold text-[#111111] focus:outline-none" defaultValue="2026-03-02" />
               </div>
               <div className="flex-1 bg-[#F7F7F8] rounded-[16px] p-3 border border-black/[0.04]">
                 <label className="text-[12px] text-[#8E8E93] font-bold uppercase tracking-wide block mb-1">Time</label>
                 <input type="time" className="w-full bg-transparent text-[16px] font-bold text-[#111111] focus:outline-none" defaultValue="10:00" />
               </div>
             </div>
             <div className="bg-[#F7F7F8] rounded-[16px] p-3 border border-black/[0.04] relative">
               <label className="text-[12px] text-[#8E8E93] font-bold uppercase tracking-wide block mb-1">Duration</label>
               <select className="w-full bg-transparent text-[16px] font-bold text-[#111111] focus:outline-none appearance-none" defaultValue="1 hour">
                 <option>30 minutes</option>
                 <option>1 hour</option>
                 <option>1.5 hours</option>
                 <option>2 hours</option>
               </select>
               <ChevronDown size={20} className="absolute right-3 top-1/2 translate-y-[-10%] text-[#8E8E93] pointer-events-none"/>
             </div>
           </div>
         </div>

         {/* Where */}
         <div>
           <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Where</h3>
           <div className="bg-[#F7F7F8] rounded-[16px] p-4 border border-black/[0.04] flex items-center justify-between">
             <div>
               <p className="text-[16px] font-bold text-[#111111] flex items-center gap-1.5"><MapPin size={16} className="text-[#FF6A3D]"/> Zurichhorn Park</p>
               <p className="text-[13px] text-[#6E6E73] mt-1 ml-5">Seestrasse, 8008 Zürich</p>
             </div>
             <button className="text-[14px] font-bold text-[#FF6A3D] px-3 py-1.5 bg-[#FFFFFF] shadow-sm rounded-full">Change</button>
           </div>
         </div>

         {/* Notes */}
         <div>
           <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Notes (Optional)</h3>
           <textarea className="w-full bg-[#F7F7F8] rounded-[16px] p-4 text-[15px] font-medium text-[#111111] focus:outline-none placeholder:text-[#8E8E93] resize-none border border-black/[0.04]" rows="2" placeholder="Meet by the lake entrance!"></textarea>
         </div>

         {/* Create Button */}
         <button onClick={() => { setCreatePlaydateOpen(false); setCurrentView('playdatesList'); }} className="w-full h-[56px] bg-[#FF6A3D] text-white font-bold text-[16px] rounded-[16px] shadow-[0_4px_14px_rgba(255,106,61,0.3)] active:scale-[0.98] transition-transform flex justify-center items-center gap-2 mt-4">
           Create Playdate
         </button>
      </div>
    </BottomSheet>
  );

  return (
    <div className={`absolute inset-0 transition-opacity duration-300 ${isVisible ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
      <MainListView />
      
      <SubScreenPortal isOpen={currentView === 'search'}>
         <SearchScreen />
      </SubScreenPortal>

      <SubScreenPortal isOpen={currentView === 'requests'}>
         <RequestsScreen />
      </SubScreenPortal>

      <SubScreenPortal isOpen={currentView === 'suggestions'}>
         <SuggestionsScreen />
      </SubScreenPortal>

      <SubScreenPortal isOpen={currentView === 'profile'}>
         <ProfileScreen />
      </SubScreenPortal>

      <SubScreenPortal isOpen={currentView === 'playdatesList'}>
         <PlaydatesListScreen />
      </SubScreenPortal>

      <SubScreenPortal isOpen={currentView === 'playdateDetails'}>
         <PlaydateDetailsScreen />
      </SubScreenPortal>

      <CreatePlaydateSheet />
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

const Globe = ({size, className, color}) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color||"currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
)

// ==========================================
// MAIN APP SCREEN (ActivityHubScreen)
// ==========================================
export default function App() {
  const [activeMode, setActiveMode] = useState('friends'); // Ξεκινάμε στο friends mode για την προεπισκόπηση
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacySheetOpen, setPrivacySheetOpen] = useState(false);
  
  // Lifted state to handle dynamic notification badge
  const [hasNewRequests, setHasNewRequests] = useState(true);

  const MODES = [
    { id: 'my', label: 'My' },
    { id: 'friends', label: 'Friends', badge: hasNewRequests }, 
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
        <div className="relative flex-1 w-full overflow-hidden mt-1 bg-[#F7F7F8]">
          <MyActivityContainer isVisible={activeMode === 'my'} />
          <FriendsActivityContainer isVisible={activeMode === 'friends'} setGlobalBadge={setHasNewRequests} />
          <CommunityPlaceholderContainer isVisible={activeMode === 'community'} />
        </div>
        
      </div>

      {/* ================= BOTTOM SHEETS ================= */}

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