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
  XCircle,
  Bell,
  Settings2
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
// MOCK DATA (Updated for Step 28)
// ==========================================
const MOCK_PET = { id: 'p1', name: 'Luna', breed: 'Golden Retriever', avatar: '🐕' };

const MY_ACTIVITIES = [
  { id: '1', type: 'walk', timestamp: daysAgo(0).setHours(14, 30), duration: '90 min', provider: 'Lukas F.', location: 'Zurichhorn Park' },
  { id: '2', type: 'medication', timestamp: daysAgo(0).setHours(9, 0), medName: 'Apoquel (16mg)', notes: 'Daily medication' },
  { id: '3', type: 'photo', timestamp: daysAgo(1).setHours(16, 20), photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400&h=400', caption: 'Playing in the snow! ❄️' },
];

const mockFriendData = {
  friends: [
    { id: 'friendship_001', userId: 'user_002', petId: 'pet_002', petName: 'Max', petBreed: 'French Bulldog', petPhoto: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150', distance: 1.2 },
    { id: 'friendship_002', userId: 'user_003', petId: 'pet_003', petName: 'Bella', petBreed: 'Labrador', petPhoto: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150', distance: 2.3 }
  ],
  receivedRequests: [],
  suggestions: []
};

// --- NEW DATA: FEED POSTS FOR LIKES ---
const MOCK_FEED = [
  {
    id: 'activity_001',
    ownerId: 'user_002', ownerName: "Max's owner", petName: 'Max',
    avatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '2 hours ago',
    location: 'Zurichhorn Park',
    type: 'photo',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600&h=600',
    likesCount: 3,
    likedByMe: false,
    likersPreview: 'Luna, Bella, +1',
    likers: [
      { id: 'l1', petName: 'Bella', breed: 'Labrador', timeAgo: '30m ago', avatar: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'l2', petName: 'Rocky', breed: 'Shiba Inu', timeAgo: '1h ago', avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'l3', petName: 'Daisy', breed: 'Golden Retriever', timeAgo: '1.5h ago', avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150' }
    ]
  },
  {
    id: 'activity_002',
    ownerId: 'user_003', ownerName: "Bella's owner", petName: 'Bella',
    avatar: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '5 hours ago',
    location: 'Lindenhof',
    type: 'check-in',
    photoUrl: null,
    likesCount: 5,
    likedByMe: true,
    likersPreview: 'You, Max, +3',
    likers: [
      { id: 'l_me', petName: 'Luna (You)', breed: 'Golden Retriever', timeAgo: 'Just now', avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'l4', petName: 'Max', breed: 'French Bulldog', timeAgo: '2h ago', avatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'l5', petName: 'Charlie', breed: 'Beagle', timeAgo: '3h ago', avatar: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'l6', petName: 'Rocky', breed: 'Shiba Inu', timeAgo: '4h ago', avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'l7', petName: 'Daisy', breed: 'Golden Retriever', timeAgo: '4.5h ago', avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150' }
    ]
  }
];

// --- NEW DATA: NOTIFICATIONS ---
const MOCK_NOTIFICATIONS = [
  {
    group: 'TODAY',
    items: [
      { id: 'n1', type: 'like', petName: 'Max', petAvatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150', text: 'liked your photo', time: '2 hours ago', read: false, preview: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'n2', type: 'friend-accepted', petName: 'Bella', petAvatar: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150', text: 'accepted your friend request', time: '5 hours ago', read: true }
    ]
  },
  {
    group: 'YESTERDAY',
    items: [
      { id: 'n3', type: 'check-in', petName: 'Max', petAvatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150', text: 'checked in at Zurichhorn Park', time: 'Yesterday', read: true },
      { id: 'n4', type: 'playdate', petName: 'Charlie', petAvatar: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=150&h=150', text: 'invited you to a playdate', time: 'Yesterday', read: true }
    ]
  },
  {
    group: 'THIS WEEK',
    items: [
      { id: 'n5', type: 'friend-request', petName: 'Rocky', petAvatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150&h=150', text: 'sent you a friend request', time: '3 days ago', read: true }
    ]
  }
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
        <div className="px-5 pb-6 overflow-y-auto custom-scrollbar flex-1 relative">
          {title && (
            <div className="flex items-center justify-between mb-5 sticky top-0 bg-white z-10 py-2 border-b border-black/[0.04]">
              <h3 className="text-[20px] font-bold text-[#111111]">{title}</h3>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-[#F7F7F8] rounded-full text-[#6E6E73] active:scale-95"><X size={18} /></button>
            </div>
          )}
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

// Toggle UI Component (iOS style)
const Toggle = ({ active, onChange }) => (
  <button
    onClick={() => onChange(!active)}
    className={`w-12 h-7 rounded-full p-[2px] transition-colors duration-300 ${active ? 'bg-[#34C759]' : 'bg-[#E5E5EA]'}`}
  >
    <div className={`w-6 h-6 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${active ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

// ==========================================
// NOTIFICATIONS SYSTEM (Step 28)
// ==========================================
const NotificationsScreen = ({ isOpen, onClose, notifications, markAsRead }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SubScreenPortal isOpen={isOpen}>
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
        {/* Header */}
        <div className="px-4 pt-14 pb-3 flex items-center justify-between bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
            <h2 className="text-[18px] font-bold text-[#111111]">Notifications</h2>
          </div>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 -mr-2 text-[#111111] active:opacity-50"><MoreVertical size={24} /></button>
            {menuOpen && (
              <div className="absolute top-12 right-0 w-56 bg-[#FFFFFF] rounded-[16px] shadow-xl border border-black/[0.04] overflow-hidden py-1 z-50">
                <button className="w-full px-4 py-3 text-left text-[15px] font-medium text-[#111111] hover:bg-[#F7F7F8]">Mark all as read</button>
                <div className="h-[1px] bg-black/[0.04]" />
                <button onClick={() => { setMenuOpen(false); setSettingsOpen(true); }} className="w-full px-4 py-3 text-left text-[15px] font-medium text-[#111111] hover:bg-[#F7F7F8] flex items-center gap-2">
                  <Settings2 size={16} /> Notification Settings
                </button>
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
          {notifications.map((group, idx) => (
            <div key={idx} className="mb-2">
              <div className="px-5 py-3 sticky top-0 bg-[#F7F7F8]/95 backdrop-blur-sm z-10 border-b border-black/[0.02]">
                <span className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest">{group.group}</span>
              </div>
              <div className="bg-[#FFFFFF] border-y border-black/[0.04]">
                {group.items.map((item, i) => (
                  <div 
                    key={item.id} 
                    onClick={() => markAsRead(item.id)}
                    className={`flex items-start gap-4 p-4 active:bg-[#F0F0F2] transition-colors cursor-pointer relative ${i !== group.items.length - 1 ? 'border-b border-black/[0.04]' : ''} ${!item.read ? 'bg-[#FF6A3D]/5' : ''}`}
                  >
                    {!item.read && <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#007AFF] rounded-full" />}
                    
                    <div className="relative pl-1">
                      <img src={item.petAvatar} className="w-12 h-12 rounded-full object-cover bg-[#F7F7F8]" alt="avatar" />
                      {item.type === 'like' && <div className="absolute -bottom-1 -right-1 bg-[#FF3B4A] w-5 h-5 rounded-full flex items-center justify-center border-[2px] border-white"><Heart size={10} fill="white" color="white" /></div>}
                      {item.type === 'friend-accepted' && <div className="absolute -bottom-1 -right-1 bg-[#34C759] w-5 h-5 rounded-full flex items-center justify-center border-[2px] border-white"><UserCheck size={10} color="white" /></div>}
                      {item.type === 'playdate' && <div className="absolute -bottom-1 -right-1 bg-[#FF9F0A] w-5 h-5 rounded-full flex items-center justify-center border-[2px] border-white"><Calendar size={10} color="white" /></div>}
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <p className="text-[15px] text-[#111111] leading-snug">
                        <span className="font-bold">{item.petName}</span> {item.text}
                      </p>
                      <p className="text-[13px] text-[#8E8E93] mt-1">{item.time}</p>
                    </div>

                    {item.preview && (
                      <img src={item.preview} className="w-12 h-12 rounded-[8px] object-cover bg-[#F7F7F8]" alt="preview" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Sub-screen */}
      <SubScreenPortal isOpen={settingsOpen}>
        <div className="flex-1 flex flex-col bg-[#F7F7F8]">
          <div className="px-4 pt-14 pb-3 flex items-center gap-3 bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
            <button onClick={() => setSettingsOpen(false)} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
            <h2 className="text-[18px] font-bold text-[#111111]">Notification Settings</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-5 space-y-8 custom-scrollbar">
            <div>
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Push Notifications</h3>
              <div className="bg-[#FFFFFF] rounded-[20px] overflow-hidden shadow-sm border border-black/[0.04]">
                {[
                  { id: 'likes', label: 'Likes' },
                  { id: 'requests', label: 'Friend Requests' },
                  { id: 'playdates', label: 'Playdate Invitations' },
                  { id: 'activity', label: 'Friend Activity' }
                ].map((item, i) => (
                  <div key={item.id} className={`flex items-center justify-between p-4 ${i !== 3 ? 'border-b border-black/[0.04]' : ''}`}>
                    <span className="text-[16px] font-medium text-[#111111]">{item.label}</span>
                    <Toggle active={true} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">In-App Notifications</h3>
              <div className="bg-[#FFFFFF] rounded-[20px] overflow-hidden shadow-sm border border-black/[0.04]">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <span className="text-[16px] font-medium text-[#111111] block mb-0.5">Badge on Activity Tab</span>
                    <span className="text-[13px] text-[#6E6E73]">Show unread count indicator</span>
                  </div>
                  <Toggle active={true} onChange={() => {}} />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Quiet Hours</h3>
              <div className="bg-[#FFFFFF] rounded-[20px] overflow-hidden shadow-sm border border-black/[0.04] p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[16px] font-medium text-[#111111]">Enable quiet hours</span>
                  <Toggle active={true} onChange={() => {}} />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-[#F7F7F8] rounded-[12px] p-3 border border-black/[0.04]">
                    <label className="text-[11px] text-[#8E8E93] font-bold uppercase block mb-1">From</label>
                    <input type="time" className="w-full bg-transparent text-[15px] font-bold focus:outline-none" defaultValue="22:00" />
                  </div>
                  <div className="flex-1 bg-[#F7F7F8] rounded-[12px] p-3 border border-black/[0.04]">
                    <label className="text-[11px] text-[#8E8E93] font-bold uppercase block mb-1">To</label>
                    <input type="time" className="w-full bg-transparent text-[15px] font-bold focus:outline-none" defaultValue="08:00" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SubScreenPortal>
    </SubScreenPortal>
  );
};

// ==========================================
// FEED & LIKES COMPONENTS (Step 28)
// ==========================================
const FeedPostCard = ({ post, onLike, onViewLikes }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLikeClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // match CSS animation duration
    onLike(post.id);
  };

  return (
    <div className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-black/[0.04] mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src={post.avatar} alt={post.petName} className="w-10 h-10 rounded-full object-cover bg-[#F7F7F8]" />
          <div>
            <h4 className="text-[15px] font-bold text-[#111111]">{post.ownerName}</h4>
            <p className="text-[13px] text-[#6E6E73]">{post.timeAgo}</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#8E8E93] active:bg-[#E5E5EA]"><MoreVertical size={16} /></button>
      </div>

      {/* Content */}
      <div className="mb-4">
        {post.photoUrl && (
          <img src={post.photoUrl} alt="activity" className="w-full aspect-square object-cover rounded-[16px] mb-2 bg-[#F7F7F8]" />
        )}
        {post.text && <p className="text-[15px] text-[#111111] mb-2">{post.text}</p>}
        {post.location && (
          <p className="text-[14px] font-medium text-[#111111] flex items-center gap-1.5"><MapPin size={14} className="text-[#FF6A3D]" /> {post.location}</p>
        )}
      </div>

      {/* Social Bar (The focus of Step 28) */}
      <div className="flex items-center justify-between pt-3 border-t border-black/[0.04]">
        {/* Likes Info */}
        <div onClick={() => post.likesCount > 0 && onViewLikes(post)} className={`flex flex-col ${post.likesCount > 0 ? 'cursor-pointer active:opacity-70' : ''}`}>
          <span className="text-[15px] font-bold text-[#111111]">{post.likesCount > 0 ? `❤️ ${post.likesCount} likes` : '♡ No likes yet'}</span>
          {post.likesCount > 0 && (
            <span className="text-[13px] text-[#6E6E73] mt-0.5">Liked by {post.likersPreview}</span>
          )}
        </div>
        
        {/* Like Button */}
        <button 
          onClick={handleLikeClick}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 active:scale-95
            ${post.likedByMe ? 'bg-[#FF3B4A]/10 text-[#FF3B4A]' : 'bg-[#F7F7F8] text-[#8E8E93] hover:bg-[#E5E5EA]'}`}
        >
          <Heart 
            size={20} 
            fill={post.likedByMe ? 'currentColor' : 'none'} 
            className={`transition-all duration-300 ${isAnimating ? 'animate-like-bounce' : ''}`} 
          />
        </button>
      </div>
    </div>
  );
};

const LikesBottomSheet = ({ isOpen, onClose, post }) => {
  if (!post) return null;
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Likes">
      {post.likers.length === 0 ? (
        <div className="text-center py-10">
          <Heart size={32} className="text-[#CFCFD4] mx-auto mb-3" />
          <p className="text-[15px] font-medium text-[#111111]">No likes yet</p>
          <p className="text-[14px] text-[#6E6E73] mt-2">Be the first to like this!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {post.likers.map((liker) => (
            <div key={liker.id} className="flex items-center justify-between group cursor-pointer active:opacity-70">
              <div className="flex items-center gap-3">
                <img src={liker.avatar} alt={liker.petName} className="w-[44px] h-[44px] rounded-full object-cover bg-[#F7F7F8]" />
                <div>
                  <h4 className="text-[15px] font-semibold text-[#111111] leading-tight mb-0.5">{liker.petName}</h4>
                  <p className="text-[13px] text-[#6E6E73]">{liker.breed} · {liker.timeAgo}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#CFCFD4] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </BottomSheet>
  );
};

// ==========================================
// MODE 2: FRIENDS ACTIVITY (Updated Step 28)
// ==========================================
const FriendsActivityContainer = ({ isVisible, setGlobalBadge }) => {
  const [currentView, setCurrentView] = useState('list');
  const [feedPosts, setFeedPosts] = useState(MOCK_FEED);
  const [likesSheetOpen, setLikesSheetOpen] = useState(false);
  const [activePostLikes, setActivePostLikes] = useState(null);

  // Toggle Like Action (Optimistic Update)
  const handleToggleLike = (postId) => {
    setFeedPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isCurrentlyLiked = post.likedByMe;
        return {
          ...post,
          likedByMe: !isCurrentlyLiked,
          likesCount: isCurrentlyLiked ? post.likesCount - 1 : post.likesCount + 1,
          likersPreview: isCurrentlyLiked ? 'Bella, Charlie' : 'You, Bella, Charlie',
        };
      }
      return post;
    }));
  };

  const handleViewLikes = (post) => {
    setActivePostLikes(post);
    setLikesSheetOpen(true);
  };

  return (
    <div className={`absolute inset-0 transition-opacity duration-300 ${isVisible ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
      
      {/* MAIN VIEW: Feed + Horizontal Friends */}
      <div className="absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar pt-2 pb-24 space-y-6">
        
        {/* Header Summary */}
        <div className="px-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFFFFF] rounded-[12px] flex items-center justify-center text-[20px] shadow-sm border border-black/[0.04]">
              {MOCK_PET.avatar}
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#111111]">{MOCK_PET.name}'s Network</h2>
              <p className="text-[13px] text-[#6E6E73]">12 connections</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-[#FFFFFF] shadow-sm border border-black/[0.04] flex items-center justify-center text-[#111111] active:scale-95 transition-transform">
              <CalendarDays size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#111111] shadow-sm flex items-center justify-center text-[#FFFFFF] active:scale-95 transition-transform">
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll: Friends Quick Access (Like Stories) */}
        <div className="px-5">
          <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3 flex items-center justify-between">
            Friends <span className="text-[#FF6A3D] text-[13px] normal-case cursor-pointer">Find new</span>
          </h3>
          <div className="flex gap-4 overflow-x-auto custom-scrollbar -mx-5 px-5 pb-2">
            {/* Add Friend Button */}
            <div className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
              <div className="w-[60px] h-[60px] rounded-full border-2 border-dashed border-[#CFCFD4] flex items-center justify-center text-[#8E8E93] bg-[#F7F7F8]">
                <Plus size={24} />
              </div>
              <span className="text-[12px] font-medium text-[#111111]">Add</span>
            </div>
            {/* Friend Avatars */}
            {mockFriendData.friends.map(friend => (
              <div key={friend.id} className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
                <div className="w-[60px] h-[60px] rounded-full border-[2.5px] border-[#FF6A3D] p-[2px] bg-[#F7F7F8]">
                  <img src={friend.petPhoto} alt={friend.petName} className="w-full h-full rounded-full object-cover" />
                </div>
                <span className="text-[12px] font-medium text-[#111111]">{friend.petName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Vertical Feed: Friend Activity (Step 28 Focus) */}
        <div className="px-4">
          <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-4 px-1">Recent Activity</h3>
          <div className="space-y-4">
            {feedPosts.map(post => (
              <FeedPostCard 
                key={post.id} 
                post={post} 
                onLike={handleToggleLike} 
                onViewLikes={handleViewLikes} 
              />
            ))}
            
            <div className="text-center py-6">
              <div className="w-10 h-10 bg-[#FFFFFF] rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-black/[0.04]">
                <Check size={18} className="text-[#8E8E93]" />
              </div>
              <p className="text-[14px] text-[#6E6E73]">You're all caught up!</p>
            </div>
          </div>
        </div>

      </div>

      {/* Sheets */}
      <LikesBottomSheet 
        isOpen={likesSheetOpen} 
        onClose={() => setLikesSheetOpen(false)} 
        post={activePostLikes} 
      />

    </div>
  );
};

// ==========================================
// MAIN APP SCREEN (ActivityHubScreen)
// ==========================================
export default function App() {
  const [activeMode, setActiveMode] = useState('friends');
  
  // System State for Step 28
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  
  // Calculate total unread dynamically
  const totalUnread = useMemo(() => {
    return notifications.reduce((acc, group) => {
      return acc + group.items.filter(item => !item.read).length;
    }, 0);
  }, [notifications]);

  const handleMarkAsRead = (notifId) => {
    setNotifications(prev => prev.map(group => ({
      ...group,
      items: group.items.map(item => item.id === notifId ? { ...item, read: true } : item)
    })));
  };

  const MODES = [
    { id: 'my', label: 'My' },
    { id: 'friends', label: 'Friends', badge: totalUnread > 0 }, 
    { id: 'community', label: 'Community' }
  ];

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased text-[#111111]">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes likeBounce {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-like-bounce { 
          animation: likeBounce 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
        }
      `}} />

      {/* iPhone Wrapper */}
      <div id="mockup-root" className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#F7F7F8] sm:rounded-[50px] overflow-hidden sm:border-[8px] border-black sm:shadow-2xl flex flex-col">
        
        {/* HEADER (Updated with Notification Bell) */}
        <header className="px-5 pt-14 pb-2 bg-[#F7F7F8] z-30 flex items-center justify-between">
          <h1 className="text-[28px] font-bold tracking-tight text-[#111111]">Activity</h1>
          
          <div className="flex items-center gap-1">
            {/* Notifications Trigger */}
            <button 
              onClick={() => setNotificationsOpen(true)} 
              className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
            >
              <Bell size={22} color="#111111" />
              {totalUnread > 0 && (
                <span className="absolute top-[8px] right-[8px] w-[10px] h-[10px] bg-[#FF3B4A] rounded-full border-[2px] border-[#F7F7F8] z-10 animate-pulse" />
              )}
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
              <MoreVertical size={24} color="#111111" />
            </button>
          </div>
        </header>

        {/* 3-MODE SEGMENTED CONTROL */}
        <SegmentedModeControl modes={MODES} activeMode={activeMode} onChange={setActiveMode} />

        {/* LAYERED CONTAINERS */}
        <div className="relative flex-1 w-full overflow-hidden mt-1 bg-[#F7F7F8]">
          <MyActivityContainer isVisible={activeMode === 'my'} />
          <FriendsActivityContainer isVisible={activeMode === 'friends'} setGlobalBadge={() => {}} />
          {/* <CommunityPlaceholderContainer isVisible={activeMode === 'community'} /> */}
        </div>
        
        {/* OVERLAYS */}
        <NotificationsScreen 
          isOpen={notificationsOpen} 
          onClose={() => setNotificationsOpen(false)} 
          notifications={notifications}
          markAsRead={handleMarkAsRead}
        />

      </div>
    </div>
  );
}

// Keeping MyActivityContainer structure generic for completeness
const MyActivityContainer = ({ isVisible }) => (
  <div className={`absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isVisible ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
      <div className="px-4 pb-24 space-y-3 pt-4">
        <h3 className="text-[12px] font-bold text-[#8E8E93] tracking-widest uppercase mb-2">My Activity</h3>
        {MY_ACTIVITIES.map((act) => (
          <div key={act.id} className="bg-[#FFFFFF] p-4 rounded-[16px] border border-black/[0.04] flex gap-4 items-start shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[18px] shrink-0">
              {act.type === 'walk' ? '🐕' : act.type === 'medication' ? '💊' : '📸'}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[15px] font-semibold text-[#111111] capitalize">{act.type}</h4>
                <span className="text-[12px] text-[#8E8E93]">{formatRelativeTime(new Date(act.timestamp))}</span>
              </div>
              {act.photoUrl && (
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