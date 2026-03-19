import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  Check,
  HeartPulse,
  Megaphone,
  Archive,
  Users,
  Loader2,
  Clock,
  Bone,
  Syringe,
  XCircle,
  Activity,
  Star,
  PartyPopper,
  Stethoscope,
  Trash2
} from 'lucide-react';

// --- THEME & TOKENS ---
const THEME = {
  colors: {
    accent: '#FF6B35',
    danger: '#FF3B30',
  }
};

// --- MOCK INBOX DATA (Realistic & Diverse for Scroll Testing) ---
const INITIAL_NOTIFICATIONS = [
  // --- TODAY ---
  {
    id: 'inbox_001',
    category: 'social',
    type: 'friend-request',
    priority: 'normal',
    sender: { name: "Max's owner", petName: 'Max', photo: 'https://i.pravatar.cc/150?u=max_dog' },
    title: 'Friend request',
    body: 'Max wants to connect with Luna.',
    actions: [
      { id: 'accept', label: 'Accept', type: 'primary' },
      { id: 'decline', label: 'Ignore', type: 'secondary' }
    ],
    read: false,
    archived: false,
    timeGroup: 'Today',
    timeAgo: 'Just now'
  },
  {
    id: 'inbox_002',
    category: 'health',
    type: 'medication-reminder',
    priority: 'critical',
    sender: { name: 'FYLOS Health', icon: HeartPulse },
    title: 'Medication reminder',
    body: "Apoquel 16mg · Due now",
    actions: [
      { id: 'given', label: 'Mark as given', type: 'primary' },
      { id: 'snooze', label: 'Snooze 30m', type: 'secondary' }
    ],
    read: false,
    archived: false,
    timeGroup: 'Today',
    timeAgo: '5m'
  },
  {
    id: 'inbox_003',
    category: 'bookings',
    type: 'booking-reminder',
    priority: 'high',
    sender: { name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker' },
    title: 'Walk starting soon',
    body: 'Your scheduled walk with Lukas begins in exactly 1 hour.',
    actions: [
      { id: 'contact', label: 'Message walker', type: 'secondary' }
    ],
    read: false,
    archived: false,
    timeGroup: 'Today',
    timeAgo: '45m'
  },
  {
    id: 'inbox_004',
    category: 'health',
    type: 'health-alert',
    priority: 'high',
    sender: { name: 'FYLOS Health', icon: Syringe },
    title: 'Vaccination due soon',
    body: "Luna's annual Rabies booster is due in 3 days. Ensure she stays protected.",
    actions: [
      { id: 'book_vet', label: 'Book vet', type: 'primary' }
    ],
    read: false,
    archived: false,
    timeGroup: 'Today',
    timeAgo: '1h'
  },
  {
    id: 'inbox_005',
    category: 'system',
    type: 'activity-logged',
    priority: 'low',
    sender: { name: 'FYLOS Tracker', icon: Bone },
    title: 'Meal logged successfully',
    body: 'You logged 150g of Royal Canin for Luna.',
    actions: [],
    read: true,
    archived: false,
    timeGroup: 'Today',
    timeAgo: '2h'
  },
  {
    id: 'inbox_006',
    category: 'bookings',
    type: 'booking-confirmed',
    priority: 'high',
    sender: { name: 'Sarah T.', photo: 'https://i.pravatar.cc/150?u=sarah_walker' },
    title: 'Drop-in confirmed',
    body: 'Drop-in visit with Sarah T. · Tomorrow at 10:00 AM',
    actions: [
      { id: 'view', label: 'View booking', type: 'secondary' }
    ],
    read: false,
    archived: false,
    timeGroup: 'Today',
    timeAgo: '3h'
  },

  // --- YESTERDAY ---
  {
    id: 'inbox_007',
    category: 'social',
    type: 'playdate-invite',
    priority: 'normal',
    sender: { name: "Charlie's owner", photo: 'https://i.pravatar.cc/150?u=charlie_dog' },
    title: 'Playdate invitation',
    body: 'Charlie wants to play at Dog Park Enge this weekend. Are you free?',
    actions: [
      { id: 'accept', label: 'Accept', type: 'primary' },
      { id: 'decline', label: 'Decline', type: 'secondary' }
    ],
    read: false,
    archived: false,
    timeGroup: 'Yesterday',
    timeAgo: '14:30'
  },
  {
    id: 'inbox_008',
    category: 'bookings',
    type: 'booking-cancelled',
    priority: 'critical',
    sender: { name: 'FYLOS Bookings', icon: XCircle },
    title: 'Booking cancelled',
    body: 'Unfortunately Emma W. had to cancel your scheduled walk for Friday.',
    actions: [
      { id: 'find_new', label: 'Find new walker', type: 'primary' }
    ],
    read: true,
    archived: false,
    timeGroup: 'Yesterday',
    timeAgo: '11:15'
  },
  {
    id: 'inbox_009',
    category: 'bookings',
    type: 'booking-completed',
    priority: 'normal',
    sender: { name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker' },
    title: 'Walk completed',
    body: '90 min with Lukas F. · Zürichhorn Park',
    actions: [],
    read: true,
    archived: false,
    timeGroup: 'Yesterday',
    timeAgo: '09:00'
  },
  {
    id: 'inbox_010',
    category: 'system',
    type: 'new-feature',
    priority: 'low',
    sender: { name: 'FYLOS Team', icon: Megaphone },
    title: 'Activity insights',
    body: 'Your new dashboard is live.',
    actions: [
      { id: 'check', label: 'Explore', type: 'secondary' }
    ],
    read: true,
    archived: false,
    timeGroup: 'Yesterday',
    timeAgo: 'Yesterday'
  },

  // --- EARLIER THIS WEEK ---
  {
    id: 'inbox_011',
    category: 'health',
    type: 'weight-logged',
    priority: 'normal',
    sender: { name: 'FYLOS Health', icon: Activity },
    title: 'Weight milestone',
    body: 'Luna weighed in at 12.5kg. She is maintaining a perfect, healthy trend!',
    actions: [
      { id: 'view_chart', label: 'View chart', type: 'secondary' }
    ],
    read: true,
    archived: false,
    timeGroup: 'Earlier this week',
    timeAgo: 'Mon'
  },
  {
    id: 'inbox_012',
    category: 'social',
    type: 'milestone',
    priority: 'normal',
    sender: { name: 'FYLOS Community', icon: PartyPopper },
    title: "Luna's birthday!",
    body: 'Luna turned 3 years old! Share the celebration with your friends.',
    actions: [
      { id: 'share', label: 'Share profile', type: 'secondary' }
    ],
    read: true,
    archived: false,
    timeGroup: 'Earlier this week',
    timeAgo: 'Sun'
  },
  {
    id: 'inbox_013',
    category: 'bookings',
    type: 'review-left',
    priority: 'low',
    sender: { name: 'FYLOS Bookings', icon: Star },
    title: 'Review published',
    body: 'You left a 5-star review for Sarah T. Thanks for supporting the community.',
    actions: [],
    read: true,
    archived: false,
    timeGroup: 'Earlier this week',
    timeAgo: 'Sat'
  },

  // --- LAST WEEK (ARCHIVED EXAMPLES) ---
  {
    id: 'inbox_014',
    category: 'system',
    type: 'welcome',
    priority: 'normal',
    sender: { name: 'FYLOS Team', icon: Megaphone },
    title: 'Welcome to FYLOS',
    body: 'Your profile is all set up. Explore the features and find your first walker.',
    actions: [
      { id: 'tour', label: 'Take tour', type: 'primary' }
    ],
    read: true,
    archived: true, 
    timeGroup: 'Older',
    timeAgo: 'Feb 24'
  },
  {
    id: 'inbox_015',
    category: 'health',
    type: 'vet-visit',
    priority: 'normal',
    sender: { name: 'Dr. Smith', icon: Stethoscope },
    title: 'Checkup completed',
    body: 'General checkup notes have been uploaded to your vault.',
    actions: [
      { id: 'view_notes', label: 'View notes', type: 'secondary' }
    ],
    read: true,
    archived: true, 
    timeGroup: 'Older',
    timeAgo: 'Feb 22'
  },
  {
    id: 'inbox_016',
    category: 'social',
    type: 'friend-accepted',
    priority: 'low',
    sender: { name: "Rocky's owner", photo: 'https://i.pravatar.cc/150?u=rocky_dog' },
    title: 'Friend request accepted',
    body: 'Rocky is now friends with Luna.',
    actions: [
      { id: 'say_hi', label: 'Say hi', type: 'secondary' }
    ],
    read: true,
    archived: true, 
    timeGroup: 'Older',
    timeAgo: 'Feb 20'
  }
];

const INBOX_CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'health', label: 'Health', icon: HeartPulse },
  { id: 'system', label: 'Updates', icon: Megaphone }
];

// --- DESIGN SYSTEM COMPONENTS ---

const Text = ({ variant = 'body', className = '', children, ...props }) => {
  const variants = {
    title: "text-[24px] font-bold text-[#111111] tracking-tight",
    label: "text-[12px] font-medium text-[#8E8E93]"
  };
  return <div className={`${variants[variant] || variants.body} ${className}`} {...props}>{children}</div>;
};

const Spinner = ({ size = 'medium', color = 'primary', className = '' }) => {
  const sizes = { small: 16, medium: 24, large: 32 };
  const colors = { primary: THEME.colors.accent, white: '#FFFFFF' };
  return <Loader2 className={`animate-spin ${className}`} size={sizes[size] || sizes.medium} color={colors[color] || color} />;
};

const Avatar = ({ src, initials, icon: Icon, size = 36 }) => {
  const fontSize = size * 0.4;
  return (
    <div className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} className="w-full h-full rounded-full object-cover border border-black/[0.04]" alt="Avatar" />
      ) : Icon ? (
        <div className="w-full h-full rounded-full bg-[#F7F7F8] border border-black/[0.04] flex items-center justify-center text-[#FF6B35]">
          <Icon size={size * 0.5} strokeWidth={2.5} />
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-[#F7F7F8] border border-black/[0.04] flex items-center justify-center text-[#111111] font-medium" style={{ fontSize }}>
          {initials}
        </div>
      )}
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'small', fullWidth = false, icon: Icon, isLoading, disabled, className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center rounded-[10px] font-medium transition-all duration-[120ms] active:scale-[0.98] active:brightness-95 overflow-hidden gap-1.5";
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-[0_1px_4px_rgba(255,107,53,0.15)] hover:bg-[#E85D2A]",
    secondary: "bg-black/[0.03] text-[#111111] hover:bg-black/[0.05]"
  };
  const sizes = { small: "px-3 py-1.5 text-[12px]", medium: "px-4 py-2 text-[14px]" };
  const isDisabled = disabled || isLoading;
  const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed active:scale-100 shadow-none hover:bg-auto" : "";
  const widthClass = fullWidth ? "w-full" : "w-auto inline-flex";

  return (
    <button disabled={isDisabled} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledStyles} ${className}`} {...props}>
      {isLoading ? <Spinner size="small" color={variant === 'primary' ? 'white' : 'primary'} /> : <>{Icon && <Icon size={size === 'small' ? 14 : 18} />}{children}</>}
    </button>
  );
};

const SegmentedControl = ({ segments, activeIndex, onChange, className = '' }) => (
  <div className={`flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-black/[0.04] relative ${className}`}>
    <div 
      className="absolute top-1.5 bottom-1.5 bg-[#111111] rounded-full shadow-md transition-all duration-[300ms] cubic-bezier(0.32, 0.72, 0, 1)"
      style={{ width: `calc(${100 / segments.length}% - 12px)`, left: `calc(${(100 / segments.length) * activeIndex}% + 6px)` }}
    />
    {segments.map((seg, i) => (
      <button 
        key={seg} 
        onClick={() => onChange(i)} 
        className={`relative z-10 flex-1 py-1.5 text-[13px] font-semibold transition-colors duration-[200ms] ${activeIndex === i ? 'text-white' : 'text-[#8E8E93] hover:text-[#111111]'}`}
      >
        {seg}
      </button>
    ))}
  </div>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[40vh] px-6 text-center animate-list-refresh">
    <div className="w-16 h-16 rounded-full bg-[#F7F7F8] flex items-center justify-center mb-4">
      <Icon size={24} color="#CFCFD4" strokeWidth={2} />
    </div>
    <h2 className="text-[16px] font-semibold text-[#111111] mb-1">{title}</h2>
    <p className="text-[13px] text-[#6E6E73] max-w-[220px] leading-relaxed mb-8">{description}</p>
  </div>
);

// --- INBOX COMPONENTS ---

const NotificationCard = ({ 
  notification, 
  onAction, 
  onMarkRead, 
  onArchive, 
  onDelete, 
  isLast, 
  index, 
  isSelectionMode, 
  isSelected, 
  onToggleSelect 
}) => {
  const { id, read, sender, title, body, timeAgo, actions } = notification;

  // Swipe logic state
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const initialOffset = useRef(0);
  const isHorizontalSwipe = useRef(null);

  // Αλλαγή: Συμπαγή χρώματα (solid) αντί για διάφανα (transparent) για να μην "φεγγίζουν" τα κουμπιά από κάτω
  const bgClass = read 
    ? (index % 2 !== 0 ? 'bg-[#F4F4F6]' : 'bg-[#F9F9FB]') 
    : 'bg-[#FFFFFF]'; 

  // Handlers for Swipe Gestures (Touch & Mouse)
  const handleStart = (clientX, clientY) => {
    if (isSelectionMode) return; // Απενεργοποίηση swipe όταν είμαστε σε Selection Mode
    touchStartX.current = clientX;
    touchStartY.current = clientY;
    initialOffset.current = swipeOffset; // Κρατάμε το αρχικό σημείο για να μην κολλάει η επιστροφή
    setIsSwiping(true);
    isHorizontalSwipe.current = null;
  };

  const handleMove = (clientX, clientY) => {
    if (!isSwiping || isSelectionMode) return;
    const diffX = clientX - touchStartX.current;
    const diffY = clientY - touchStartY.current;

    // Determine if user is scrolling vertically or swiping horizontally
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 5) {
        isHorizontalSwipe.current = true;
      } else if (Math.abs(diffY) > 5) {
        isHorizontalSwipe.current = false;
      }
    }

    if (isHorizontalSwipe.current) {
      // Προσθήκη του diffX στο αρχικό offset της κίνησης
      const newOffset = initialOffset.current + diffX;
      setSwipeOffset(Math.max(-140, Math.min(0, newOffset))); 
    }
  };

  const handleEnd = () => {
    if (isSelectionMode) return;
    setIsSwiping(false);
    // Snap logic
    if (swipeOffset < -70) {
      setSwipeOffset(-140);
    } else {
      setSwipeOffset(0);
    }
  };

  return (
    <div className="relative overflow-hidden mb-[1px]">
      
      {/* Background Actions Layer (Revealed on swipe) - Κρυφό στο Selection Mode */}
      {!isSelectionMode && (
        <div className="absolute inset-y-0 right-0 flex w-[140px] bg-[#F9F9FB]">
          <button 
            onClick={() => { setSwipeOffset(0); onArchive(id); }}
            className="flex-1 flex flex-col items-center justify-center bg-[#FF9500] text-white active:brightness-95 transition-all"
          >
            <Archive size={20} className="mb-1" />
            <span className="text-[10px] font-semibold">Archive</span>
          </button>
          <button 
            onClick={() => { setSwipeOffset(0); onDelete(id); }}
            className="flex-1 flex flex-col items-center justify-center bg-[#FF3B30] text-white active:brightness-95 transition-all"
          >
            <Trash2 size={20} className="mb-1" />
            <span className="text-[10px] font-semibold">Delete</span>
          </button>
        </div>
      )}

      {/* Foreground Card Layer */}
      <div 
        className={`relative px-4 py-3.5 cursor-pointer ${bgClass}`}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)'
        }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={() => isSwiping && handleEnd()}
        onClick={(e) => {
          if (isSelectionMode) {
            onToggleSelect(id);
          } else if (swipeOffset !== 0) {
            e.preventDefault();
            setSwipeOffset(0);
          } else {
            if (!read) onMarkRead(id);
          }
        }}
      >
        {/* Unread Dot (Δυναμική αλλαγή θέσης αν υπάρχει checkbox) */}
        <div 
          className={`absolute ${isSelectionMode ? 'left-[42px]' : 'left-[10px]'} top-[25px] -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#FF7A4D] transition-all duration-[200ms] ${
            read ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
          }`} 
        />
        
        {/* Main Content Layout with optional Checkbox */}
        <div className="flex items-start">
          
          {/* Animated Checkbox Container for Edit Mode */}
          <div 
            className={`flex items-center justify-center pt-2 transition-all duration-[250ms] overflow-hidden ${
              isSelectionMode ? 'w-8 opacity-100 mr-2' : 'w-0 opacity-0 mr-0'
            }`}
          >
            <div className={`shrink-0 w-[20px] h-[20px] rounded-full border flex items-center justify-center transition-colors ${
              isSelected ? 'bg-[#FF3B30] border-[#FF3B30]' : 'border-[#CFCFD4] bg-transparent'
            }`}>
              {isSelected && <Check size={12} color="white" strokeWidth={3} />}
            </div>
          </div>

          {/* User Info & Content */}
          <div className="flex gap-3 items-start flex-1 min-w-0 pl-2">
            <Avatar src={sender.photo} icon={sender.icon} initials={sender.name.charAt(0)} size={36} />
            
            <div className="flex-1 min-w-0 flex flex-col gap-[2px] pointer-events-none">
              <div className="flex justify-between items-baseline gap-2">
                <span className={`text-[14px] truncate leading-tight ${read ? 'font-medium text-[#111111]' : 'font-semibold text-[#111111]'}`}>
                  {title}
                </span>
                <span className={`text-[11px] shrink-0 font-medium ${read ? 'text-[#A1A1A6]' : 'text-[#8E8E93]'}`}>
                  {timeAgo}
                </span>
              </div>
              
              <p className={`text-[13px] leading-[1.35] line-clamp-2 mt-0.5 ${read ? 'text-[#8E8E93]' : 'text-[#6E6E73]'}`}>
                {body}
              </p>
              
              {/* Compact Action Buttons - Κρυφά στο Selection Mode */}
              {!isSelectionMode && actions && actions.length > 0 && (
                <div className="flex gap-1.5 mt-2.5 pointer-events-auto">
                  {actions.map((act) => (
                    <Button 
                      key={act.id} 
                      variant={act.type} 
                      onClick={(e) => { e.stopPropagation(); onAction(id, act.id); }}
                    >
                      {act.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subtle Divider (Follows the swipe) */}
        {!isLast && (
          <div className={`absolute bottom-0 right-0 h-[1px] bg-black/[0.03] transition-all duration-[250ms] ${isSelectionMode ? 'left-[94px]' : 'left-[62px]'}`} />
        )}
      </div>
    </div>
  );
};


// --- MAIN APP (ISOLATED INBOX) ---

export default function App() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeView, setActiveView] = useState(0); // 0: All, 1: Unread, 2: Actionable
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Archive & Edit Mode States
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Reset Selection Mode whenever changing views
  useEffect(() => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }, [isArchiveView, activeCategory]);

  // Base logic for View
  let filtered = notifications;
  
  if (isArchiveView) {
    filtered = filtered.filter(n => n.archived);
    if (activeCategory !== 'all') filtered = filtered.filter(n => n.category === activeCategory);
  } else {
    filtered = filtered.filter(n => !n.archived);
    if (activeView === 1) filtered = filtered.filter(n => !n.read);
    if (activeView === 2) filtered = filtered.filter(n => n.actions && n.actions.length > 0 && !n.read);
    if (activeCategory !== 'all') filtered = filtered.filter(n => n.category === activeCategory);
  }

  // Group Logic
  const grouped = filtered.reduce((acc, notif) => {
    const group = notif.timeGroup;
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});

  const handleAction = (id, actionId) => {
    // Εξαφανίζει τα actions [] μόλις πατηθεί κάποιο κουμπί και το κάνει read
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true, actions: [] } : n));
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleArchive = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true } : n));
  };

  const handleDelete = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleToggleSelect = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const handleDeleteSelected = () => {
    setNotifications(prev => prev.filter(n => !selectedIds.has(n.id)));
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleBack = () => {
    if (isArchiveView) {
      setIsArchiveView(false);
    } else {
      console.log('Go back to App Home');
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes listRefresh {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-list-refresh {
          animation: listRefresh 0.25s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
      `}} />

      {/* iPhone Mockup Wrapper */}
      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200 flex flex-col">
        
        {/* Dynamic Island */}
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block" />

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 12, paddingLeft: 20, paddingRight: 20 }}>
          {/* Top Bar */}
          <div className="flex justify-between items-center w-full pointer-events-auto mb-4">
            {isArchiveView && isSelectionMode ? (
              // --- EDIT MODE HEADER ---
              <>
                <button
                  onClick={() => setIsSelectionMode(false)}
                  className="w-[44px] h-[44px] flex items-center justify-center text-[#111111] active:opacity-70 transition-all"
                >
                  <span className="text-[15px] font-medium">Cancel</span>
                </button>
                <h2 className="text-[17px] font-semibold text-[#111111]">
                  {selectedIds.size > 0 ? `${selectedIds.size} Selected` : 'Select items'}
                </h2>
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedIds.size === 0}
                  className={`w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] transition-all duration-200 ${
                    selectedIds.size > 0
                      ? 'bg-[#FFF0F0] text-[#FF3B30] active:scale-[0.96]'
                      : 'bg-transparent text-[#CFCFD4]'
                  }`}
                >
                  <Trash2 size={22} strokeWidth={2.5} />
                </button>
              </>
            ) : (
              // --- STANDARD HEADER ---
              <>
                <button
                  onClick={handleBack}
                  className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
                >
                  <ChevronLeft size={22} color="#111111" />
                </button>
                <h2 className="text-[17px] font-semibold text-[#111111]">
                  {isArchiveView ? 'Archive' : 'Inbox'}
                </h2>

                {!isArchiveView ? (
                  <button
                    onClick={() => setIsArchiveView(true)}
                    className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
                    title="View Archive"
                  >
                    <Archive size={22} color="#111111" />
                  </button>
                ) : (
                  <button
                    onClick={() => setIsSelectionMode(true)}
                    className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
                    title="Select to Delete"
                  >
                    <Trash2 size={22} color="#FF3B30" />
                  </button>
                )}
              </>
            )}
          </div>

          {/* Floating Pill: Segmented Control (Hidden in Archive View) */}
          {!isArchiveView && (
            <SegmentedControl
              segments={['All', 'Unread', 'Actionable']}
              activeIndex={activeView}
              onChange={setActiveView}
              className="pointer-events-auto shadow-lg"
            />
          )}

          {/* Floating Category Chips Row */}
          <div className={`relative ${isArchiveView ? 'mt-0' : 'mt-3'} -mx-5 pointer-events-auto transition-all duration-300 ${isSelectionMode ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="flex gap-2 overflow-x-auto custom-scrollbar px-5 pb-2 pt-1">
              {INBOX_CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap text-[12px] font-semibold active:scale-[0.96] transition-all duration-[180ms] shrink-0 border shadow-sm ${
                      isActive
                        ? 'bg-[#111111] text-white border-transparent'
                        : 'bg-white/90 backdrop-blur-md text-[#6E6E73] border-black/[0.05] hover:bg-white hover:text-[#111111]'
                    }`}
                  >
                    {Icon && <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />}
                    {cat.label}
                  </button>
                );
              })}
            </div>
            {/* Gradient right fade hint */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FFFFFF] to-transparent pointer-events-none" />
          </div>
        </header>

        {/* List Content */}
        <div className={`absolute inset-0 overflow-y-auto custom-scrollbar ${isArchiveView ? 'pt-[170px]' : 'pt-[220px]'} pb-12 px-5 bg-transparent scroll-smooth z-0 transition-all duration-300`}>
          {filtered.length === 0 ? (
            <EmptyState 
              icon={isArchiveView ? Archive : Check} 
              title={isArchiveView ? "Archive is empty" : (activeView === 2 ? "Nothing to do!" : "All caught up!")} 
              description={isArchiveView ? "Archived items will appear here." : (activeView === 2 ? "You have no pending action items." : "You have no new notifications right now.")} 
            />
          ) : (
            <div key={`${isArchiveView}-${activeView}-${activeCategory}`} className="animate-list-refresh pb-6">
              {Object.entries(grouped).map(([group, items]) => (
                <div key={group} className="mb-7">
                  
                  {/* Section Label */}
                  <Text variant="label" className={`mb-2 ml-1 transition-opacity ${isSelectionMode ? 'opacity-40' : 'opacity-100'}`}>{group}</Text>
                  
                  {/* Grouped Container */}
                  <div className="bg-[#F9F9FB] rounded-[22px] overflow-hidden border border-black/[0.03]">
                    {items.map((notif, index) => (
                      <NotificationCard 
                        key={notif.id} 
                        notification={notif} 
                        onAction={handleAction}
                        onMarkRead={handleMarkRead}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                        index={index}
                        isLast={index === items.length - 1}
                        isSelectionMode={isSelectionMode}
                        isSelected={selectedIds.has(notif.id)}
                        onToggleSelect={handleToggleSelect}
                      />
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}