import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Home, 
  PawPrint, 
  Calendar, 
  Activity, 
  Folder, 
  Search, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal, 
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  ChevronDown,
  Settings,
  Star,
  Clock,
  Scissors,
  Stethoscope,
  ArrowRight,
  Share
} from 'lucide-react';

/**
 * FYLOS Logo Component
 */
const FylosLogo = ({ 
  textColor = '#000000', 
  dotColor = '#FF6B35',  
  fontSize = '2rem',     
  className = ''         
}) => {
  return (
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
      <span 
        style={{ 
          fontSize: fontSize, 
          fontWeight: 800, 
          color: textColor, 
          letterSpacing: '-0.5px',
          lineHeight: 1
        }}
      >
        FYLOS
      </span>
      
      <div 
        style={{ 
          width: `calc(${fontSize} * 0.25)`, 
          height: `calc(${fontSize} * 0.25)`, 
          borderRadius: '50%', 
          backgroundColor: dotColor 
        }}
      />
    </div>
  );
};

// --- MOCK DATA ---
const MOCK_USER = {
  name: 'Alex',
  avatar: 'https://i.pravatar.cc/150?u=alex_fylos',
  notifications: 1,
};

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'vault', label: 'Vault', icon: Folder },
];

const mockProviderProfile = {
  id: 'provider_001',
  name: 'Lukas F.',
  photo: 'https://i.pravatar.cc/150?img=12',
  rating: 4.9,
  reviewCount: 124,
  totalWalks: 124,
  responseTime: '<1h',
  distance: 1.2,
  location: 'Zürich',
  bio: 'Experienced dog walker with 5 years caring for all breeds. I love energetic Golden Retrievers and enjoy long park walks. Certified in pet first aid and positive reinforcement training methods. I believe every dog deserves individual attention and plenty of exercise.',
  languages: ['English', 'German'],
  yearsExperience: 5,
  services: [
    { id: 'service_30min', type: 'walk', duration: 30, label: '30 min Walk', price: 45, currency: 'CHF', icon: '🐕', popular: false, description: 'Quick neighborhood walk' },
    { id: 'service_60min', type: 'walk', duration: 60, label: '60 min Walk', price: 60, currency: 'CHF', icon: '🐕', popular: false, description: 'Extended walk with park time' },
    { id: 'service_90min', type: 'walk', duration: 90, label: '90 min Walk', price: 75, currency: 'CHF', icon: '🐕', popular: true, description: 'Full adventure with off-leash time' }
  ],
  reviews: [
    { id: 'review_001', author: 'Sarah M.', authorPhoto: 'https://i.pravatar.cc/150?img=5', rating: 5, date: 'Feb 20, 2026', text: 'Lukas is amazing with Luna! Very punctual and sends great photos during walks. Luna is always so happy when she sees him. Highly recommend!' },
    { id: 'review_002', author: 'Tom K.', authorPhoto: 'https://i.pravatar.cc/150?img=14', rating: 5, date: 'Feb 15, 2026', text: 'Highly recommend! Great with energetic dogs. Our German Shepherd loves his walks with Lukas. Very professional and reliable.' }
  ],
  availability: {
    '2026-02-22': { available: true, slots: ['09:00', '14:00', '16:00'] },
    '2026-02-23': { available: true, slots: ['10:00', '15:00'] },
    '2026-02-24': { available: false, slots: [] },
    '2026-02-25': { available: true, slots: ['09:00', '11:00', '14:00'] },
    '2026-02-26': { available: true, slots: ['10:00', '16:00'] },
    '2026-02-27': { available: false, slots: [] },
    '2026-02-28': { available: false, slots: [] }
  },
  gallery: [
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=300&h=300'
  ],
  certifications: [
    { type: 'identity', label: 'Identity Verified', verified: true, verifiedDate: '2024-02-15', expiryDate: null },
    { type: 'insurance', label: 'Insurance', verified: true, verifiedDate: '2024-01-10', expiryDate: '2027-01-10', provider: 'Helvetia Pet Care Insurance' },
    { type: 'background-check', label: 'Background Check', verified: true, verifiedDate: '2025-01-20', expiryDate: null },
    { type: 'first-aid', label: 'Pet First Aid Certified', verified: true, verifiedDate: '2023-05-15', expiryDate: '2026-05-15', provider: 'Swiss Pet First Aid Association' }
  ],
  badges: ['Verified', 'Insured', 'BG Check', 'First Aid']
};

// --- THEME & TOKENS ---
const THEME = {
  colors: {
    accent: '#FF6B35',
    primaryText: '#111111',
    secondaryText: '#6E6E73',
    tertiaryText: '#8E8E93',
    background: '#FFFFFF',
    surface: '#F7F7F8',
    surfaceAlt: '#F0F0F2',
    danger: '#FF3B30',
    success: '#00C060',
    warning: '#FF9500',
    info: '#007AFF',
    divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)',
    active: '0 8px 30px rgba(0,0,0,0.06)'
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

// --- DESIGN SYSTEM COMPONENTS ---

const Text = ({ variant = 'body', className = '', children, ...props }) => {
  const variants = {
    title: "text-[24px] font-bold text-[#111111] tracking-tight",
    subtitle: "text-[17px] font-semibold text-[#111111]",
    body: "text-[15px] text-[#111111] leading-relaxed",
    caption: "text-[13px] text-[#6E6E73]",
    label: "text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider"
  };
  return <div className={`${variants[variant]} ${className}`} {...props}>{children}</div>;
};

const Spinner = ({ size = 'medium', color = 'primary', className = '' }) => {
  const sizes = { small: 16, medium: 24, large: 32 };
  const colors = { primary: THEME.colors.accent, grey: THEME.colors.tertiaryText, white: '#FFFFFF' };
  return <Loader2 className={`animate-spin ${className}`} size={sizes[size] || sizes.medium} color={colors[color] || color} />;
};

const Divider = ({ spacing = 'medium', className = '' }) => {
  const spacings = { small: 'my-2', medium: 'my-4', large: 'my-8' };
  return <div className={`w-full h-[1px] bg-[#E5E5E5] ${spacings[spacing]} ${className}`} />;
};

const IconWrapper = ({ icon: Icon, color = THEME.colors.primaryText, size = 24, strokeWidth = 2, className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Icon color={color} size={size} strokeWidth={strokeWidth} />
  </div>
);

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-[#F7F7F8] text-[#111111]",
    count: "bg-[#FF3B30] text-white px-1.5 py-0 min-w-[18px] justify-center text-[10px]",
    success: "bg-[#E5F9ED] text-[#00C060]",
    warning: "bg-[#FFF4E5] text-[#FF9500]",
    error: "bg-[#FFE5E5] text-[#FF3B30]",
    info: "bg-[#E5F0FF] text-[#007AFF]"
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-bold rounded-full px-2.5 py-1 uppercase tracking-wide leading-none ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Avatar = ({ src, initials, size = 48, badge, badgeColor = THEME.colors.danger }) => {
  const fontSize = size * 0.4;
  return (
    <div className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} className="w-full h-full rounded-full object-cover border border-black/[0.04]" alt="Avatar" />
      ) : (
        <div className="w-full h-full rounded-full bg-[#F7F7F8] border border-black/[0.04] flex items-center justify-center text-[#111111] font-semibold" style={{ fontSize }}>
          {initials}
        </div>
      )}
      {badge && (
        <div 
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center px-1 text-[10px] font-bold text-white z-10"
          style={{ backgroundColor: badgeColor }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'medium', fullWidth = true, icon: Icon, isLoading, disabled, className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2";
  
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.25)] hover:bg-[#E85D2A]",
    secondary: "bg-transparent text-[#111111] border-[1.5px] border-black/[0.08] hover:bg-[#F7F7F8]",
    destructive: "bg-[#FFF0F0] text-[#FF3B30] hover:bg-[#FFE5E5]"
  };
  
  const sizes = {
    small: "px-3 py-2 text-[14px] rounded-xl",
    medium: "px-4 py-[14px] text-[16px]",
    large: "px-6 py-4 text-[18px] rounded-[20px]"
  };
  
  const isDisabled = disabled || isLoading;
  const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed active:scale-100 shadow-none hover:bg-auto" : "";
  const widthClass = fullWidth ? "w-full" : "w-auto inline-flex";

  return (
    <button 
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Spinner size="small" color={variant === 'primary' ? 'white' : 'primary'} />
      ) : (
        <>
          {Icon && <Icon size={size === 'small' ? 16 : 20} />}
          {children}
        </>
      )}
    </button>
  );
};

const Card = ({ variant = 'default', clickable, children, className = '', ...props }) => {
  const baseStyles = "rounded-[20px] p-5 transition-all duration-200";
  const variants = {
    default: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
    highlighted: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-[4px] border-l-[#FF6B35]",
    grey: "bg-[#F7F7F8]"
  };
  const interactive = clickable ? "cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] active:scale-[0.98]" : "";
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${interactive} ${className}`} {...props}>
      {children}
    </div>
  );
};

const useLockBodyScroll = (isOpen) => {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);
};

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [portalNode, setPortalNode] = useState(null);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    setPortalNode(document.getElementById('modal-root'));
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      setRender(true);
      window.addEventListener('keydown', handleEsc);
      const raf = requestAnimationFrame(() => {
        setTimeout(() => setVisible(true), 10);
      });
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('keydown', handleEsc);
      };
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  const handleTouchStart = (e) => { 
    touchStartY.current = e.touches[0].clientY; 
    setTranslateY(0);
  };
  
  const handleTouchMove = (e) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      setTranslateY(delta);
    }
  };
  
  const handleTouchEnd = () => {
    if (translateY > 80) onClose();
    else setTranslateY(0);
  };

  if (!render || !portalNode) return null;

  return createPortal(
    <div className="absolute inset-0 z-[100] overflow-hidden pointer-events-auto flex flex-col justify-end">
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
        style={{ touchAction: 'none' }}
      />
      <div 
        className="relative w-full bg-[#FFFFFF] rounded-t-[24px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[90vh]"
        style={{ 
          transform: `translateY(${!visible ? '100%' : `${translateY}px`})`,
          transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)'
        }}
      >
        <div 
          className="w-full flex justify-center pt-4 pb-5 cursor-grab active:cursor-grabbing touch-none shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-black/[0.08] rounded-full" />
        </div>
        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1">
          {title && <h3 className="text-[20px] font-bold text-[#111111] mb-4">{title}</h3>}
          {children}
        </div>
      </div>
    </div>,
    portalNode
  );
};

const EmptyState = ({ icon: Icon, illustration, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] px-6 text-center">
    {illustration ? (
      <div className="mb-6">{illustration}</div>
    ) : (
      <div className="w-20 h-20 rounded-full bg-[#F7F7F8] flex items-center justify-center mb-6">
        <Icon size={32} color="#CFCFD4" strokeWidth={1.5} />
      </div>
    )}
    <h2 className="text-[20px] font-semibold text-[#111111] mb-2">{title}</h2>
    <p className="text-[15px] text-[#6E6E73] max-w-[260px] leading-relaxed mb-8">
      {description}
    </p>
    {actionLabel && onAction && (
      <Button variant="primary" onClick={onAction} fullWidth={false} className="min-w-[160px]">
        {actionLabel}
      </Button>
    )}
  </div>
);

/**
 * Header Component (Floating Pills System - Global App Shell)
 */
const Header = ({ title, variant = 'default', user }) => {
  const handleAction = (action) => console.log(`${action} — Action triggered`);

  return (
    <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent">
      {variant === 'default' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <h1 className="font-bold tracking-tight text-[#111111] drop-shadow-sm ml-1 flex items-center">
            {title === 'FYLOS' || !title ? <FylosLogo fontSize="22px" textColor="#111111" /> : title}
          </h1>

          <div className="flex items-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] p-1 h-[52px]">
            <button 
              onClick={() => handleAction('Search')}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              aria-label="Search"
            >
              <Search size={20} color="#111111" strokeWidth={2} />
            </button>
            <div className="w-[1px] h-[20px] bg-black/[0.06]" />
            <button 
              onClick={() => handleAction('Inbox')}
              className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              aria-label="Notifications"
            >
              <Bell size={20} color="#111111" strokeWidth={2} />
              {user?.notifications > 0 && (
                <span className="absolute top-[12px] right-[12px] w-[8px] h-[8px] bg-[#FF6B35] rounded-full border-[1.5px] border-white" aria-hidden="true" />
              )}
            </button>
            <div className="w-[1px] h-[20px] bg-black/[0.06]" />
            <button 
              onClick={() => handleAction('Profile')}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              aria-label="Profile"
            >
              <img src={user?.avatar} className="w-[32px] h-[32px] rounded-full object-cover border border-black/[0.04]" alt="Profile avatar" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

/**
 * TabBar Component (Floating Dock - Global App Shell)
 */
const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <nav 
      className="absolute bottom-[24px] left-0 w-full px-5 z-40 pointer-events-none"
      role="tablist" 
      aria-label="Main navigation"
    >
      <div className="pointer-events-auto bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-[9999px] h-[72px] flex justify-between items-center px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              id={`tab-${tab.id}`}
              onClick={() => onTabChange(tab.id)}
              className="relative flex-1 h-full flex flex-col items-center justify-center gap-[4px] group"
              aria-label={tab.label}
            >
              <div 
                className={`absolute top-[12px] w-[32px] h-[32px] bg-[#FF6B35] rounded-full blur-[12px] transition-opacity duration-[240ms] pointer-events-none ${isActive ? 'opacity-25' : 'opacity-0'}`} 
              />
              
              <div className={`relative z-10 flex items-center justify-center transition-colors duration-[240ms] ${isActive ? 'text-[#FF6B35] animate-spring-bump' : 'text-[#8E8E93]'}`}>
                <Icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              
              <span 
                className={`text-[11px] font-medium leading-none transition-colors duration-[240ms] ${
                  isActive ? 'text-[#FF6B35]' : 'text-[#8E8E93]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

/**
 * ScreenContainer Component
 */
const ScreenContainer = ({ children }) => {
  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#FFFFFF] custom-scrollbar">
      <div className="min-h-full pt-[110px] pb-[120px]">
        {children}
      </div>
    </div>
  );
};


// --- MODULE SCREENS ---

const ProviderProfileScreen = ({ provider, onBack, onNavigate }) => {
  const [menuSheet, setMenuSheet] = useState(false);
  const [calendarSheet, setCalendarSheet] = useState(false);
  const [certSheet, setCertSheet] = useState(null);
  const [galleryViewer, setGalleryViewer] = useState(null);

  const OptionRow = ({ icon: Icon, label, danger, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-[16px] active:scale-[0.98] transition-all ${danger ? 'text-[#FF3B30] hover:bg-[#FFE5E5]' : 'text-[#111111] hover:bg-[#F7F7F8]'}`}>
       <Icon size={20} className={danger ? "text-[#FF3B30]" : "text-[#111111]"} />
       <span className="text-[16px] font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="absolute inset-0 bg-[#FFFFFF] z-50 overflow-hidden">
       
       {/* FLOATING HEADER (Overlays content, gradient fade for legibility) */}
       <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-10 px-5 pointer-events-none bg-gradient-to-b from-white/95 via-white/80 to-transparent flex justify-between items-start">
          <button onClick={onBack} className="pointer-events-auto w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]">
             <ChevronLeft size={22} color="#111111" />
          </button>
          
          <div className="pointer-events-auto flex items-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] p-1 h-[44px]">
             <button className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-[0.98] transition-all">
                <Share size={18} color="#111111"/>
             </button>
             <div className="w-[1px] h-[16px] bg-black/[0.06] mx-1" />
             <button onClick={() => setMenuSheet(true)} className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-[0.98] transition-all">
                <MoreHorizontal size={18} color="#111111"/>
             </button>
          </div>
       </header>

       {/* SCROLLABLE CONTENT */}
       <div className="absolute inset-0 overflow-y-auto custom-scrollbar pt-[110px] pb-[140px]">
            
            {/* HERO SECTION (Calm, minimal) */}
            <div className="flex flex-col items-center px-5 pt-2 text-center">
               <div className="mb-4">
                 <Avatar src={provider.photo} size={104} />
               </div>
               <h1 className="text-[24px] font-bold text-[#111111] mb-1.5">{provider.name}</h1>
               <div className="flex items-center gap-1.5 mb-5">
                  <Star size={16} fill={THEME.colors.accent} color={THEME.colors.accent} />
                  <span className="text-[16px] font-bold text-[#111111]">{provider.rating}</span>
                  <span className="text-[13px] text-[#6E6E73]">({provider.reviewCount} reviews)</span>
               </div>
               
               <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {provider.badges.slice(0, 3).map(b => (
                     <Badge key={b} variant="default" className="!px-3 !py-1 font-semibold text-[10px] uppercase tracking-wider bg-[#F7F7F8] text-[#6E6E73] border-none shadow-none">
                        {b}
                     </Badge>
                  ))}
               </div>
            </div>

            {/* QUICK INFO BAR (Light neutral, calm) */}
            <div className="px-5 mb-10">
               <div className="bg-[#F7F7F8] rounded-[20px] p-4 flex justify-between items-center divide-x divide-black/[0.06]">
                  <div className="flex-1 flex flex-col items-center gap-1">
                     <span className="text-[16px] font-bold text-[#111111]">CHF 75</span>
                     <span className="text-[12px] text-[#8E8E93]">per 90min</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                     <span className="text-[16px] font-bold text-[#111111]">{provider.responseTime}</span>
                     <span className="text-[12px] text-[#8E8E93]">response</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                     <span className="text-[16px] font-bold text-[#111111]">{provider.distance}km</span>
                     <span className="text-[12px] text-[#8E8E93]">distance</span>
                  </div>
               </div>
            </div>

            {/* ABOUT */}
            <section className="px-5 mb-10 space-y-4">
               <Text variant="subtitle">About</Text>
               <p className="text-[16px] text-[#111111] leading-relaxed opacity-95">{provider.bio}</p>
               <div className="bg-[#F7F7F8] rounded-[20px] p-5 space-y-3 mt-4">
                  <div className="flex items-center gap-3">
                     <IconWrapper icon={Info} size={18} color="#6E6E73" />
                     <span className="text-[14px] text-[#6E6E73] w-[80px]">Languages</span>
                     <span className="text-[14px] text-[#111111] font-semibold">{provider.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <IconWrapper icon={Clock} size={18} color="#6E6E73" />
                     <span className="text-[14px] text-[#6E6E73] w-[80px]">Experience</span>
                     <span className="text-[14px] text-[#111111] font-semibold">{provider.yearsExperience} years</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <IconWrapper icon={Activity} size={18} color="#6E6E73" />
                     <span className="text-[14px] text-[#6E6E73] w-[80px]">Total Walks</span>
                     <span className="text-[14px] text-[#111111] font-semibold">{provider.totalWalks}</span>
                  </div>
               </div>
            </section>

            {/* SERVICES & PRICING */}
            <section className="px-5 mb-10 space-y-4">
               <Text variant="subtitle">Services & Pricing</Text>
               <div className="space-y-3">
                  {provider.services.map(svc => (
                     <Card 
                        key={svc.id} 
                        clickable 
                        className="relative overflow-hidden !p-4"
                        onClick={() => console.log('Navigate to booking', svc.id)}
                     >
                        {svc.popular && (
                           <div className="absolute top-0 right-0 bg-[#FF6B35] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-[12px]">
                              Most Popular
                           </div>
                        )}
                        <div className="flex justify-between items-center gap-4">
                           <div className="flex-1 min-w-0 flex items-start gap-3">
                              <div className="text-[24px] leading-none pt-0.5">{svc.icon}</div>
                              <div className="flex flex-col gap-0.5 pt-0.5">
                                 <span className="text-[15px] font-semibold text-[#111111]">{svc.label}</span>
                                 <span className="text-[13px] text-[#6E6E73] leading-snug pr-4">{svc.description}</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 shrink-0 pt-1">
                              <span className="text-[15px] font-bold text-[#111111]">{svc.currency} {svc.price}</span>
                              <ChevronRight size={18} color="#CFCFD4" />
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            </section>

            {/* REVIEWS PREVIEW */}
            <section className="px-5 mb-10 space-y-4">
               <div className="flex justify-between items-center">
                  <Text variant="subtitle">Reviews ({provider.reviewCount})</Text>
                  <button onClick={() => onNavigate('reviews')} className="text-[#FF6B35] text-[14px] font-semibold flex items-center gap-1 active:opacity-70">
                    View all <ChevronRight size={16}/>
                  </button>
               </div>
               <div className="space-y-3">
                  {provider.reviews.map(r => (
                     <Card key={r.id} clickable className="!p-4">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(r.rating) ? "#FF6B35" : "transparent"} color={i < Math.floor(r.rating) ? "#FF6B35" : "#E5E5E5"} />)}
                           </div>
                           <span className="text-[13px] font-semibold text-[#8E8E93]">{r.rating.toFixed(1)}</span>
                        </div>
                        <div className="text-[14px] text-[#111111] font-semibold mb-1">{r.author} <span className="text-[13px] text-[#8E8E93] font-normal mx-1">·</span> <span className="text-[13px] text-[#8E8E93] font-normal">{r.date}</span></div>
                        <p className="text-[14px] text-[#6E6E73] line-clamp-2 leading-relaxed">{r.text}</p>
                     </Card>
                  ))}
               </div>
            </section>

            {/* AVAILABILITY WIDGET */}
            <section className="px-5 mb-10 space-y-4">
               <Text variant="subtitle">Availability</Text>
               <Card className="!p-5">
                  <div className="flex justify-between items-center mb-5">
                     <span className="text-[14px] font-bold text-[#111111]">February 2026</span>
                     <div className="flex gap-3">
                        <ChevronLeft size={16} color="#CFCFD4" className="cursor-not-allowed"/>
                        <ChevronRight size={16} color="#111111" />
                     </div>
                  </div>
                  <div className="flex justify-between text-center mb-3">
                     {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="text-[11px] font-semibold text-[#8E8E93] w-8">{d}</span>)}
                  </div>
                  <div className="flex justify-between text-center">
                     {[22, 23, 24, 25, 26, 27, 28].map(day => {
                        const dateStr = `2026-02-${day}`;
                        const isAvailable = provider.availability[dateStr]?.available;
                        const isPast = day < 22;
                        return (
                           <div key={day} className="flex flex-col items-center gap-1.5 w-8">
                              <span className={`text-[15px] font-medium ${isPast ? 'text-[#CFCFD4]' : 'text-[#111111]'}`}>{day}</span>
                              <div className={`w-1.5 h-1.5 rounded-full ${isPast ? 'bg-transparent' : isAvailable ? 'bg-[#00C060]' : 'bg-[#E5E5E5]'}`} />
                           </div>
                        )
                     })}
                  </div>
                  <Divider spacing="medium" className="my-5" />
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#00C060]"/><span className="text-[12px] font-semibold text-[#6E6E73]">Available</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5]"/><span className="text-[12px] font-semibold text-[#6E6E73]">Booked</span></div>
                     </div>
                     <button onClick={() => setCalendarSheet(true)} className="text-[#FF6B35] text-[13px] font-semibold active:opacity-70">Check full schedule →</button>
                  </div>
               </Card>
            </section>

            {/* GALLERY */}
            <section className="space-y-4 mb-10">
               <Text variant="subtitle" className="px-5">Photos</Text>
               <div className="flex gap-3 overflow-x-auto custom-scrollbar px-5 pb-2">
                  {provider.gallery.map((img, i) => (
                     <button key={i} onClick={() => setGalleryViewer(i)} className="shrink-0 active:scale-[0.98] transition-transform">
                        <img src={img} className="w-[140px] h-[140px] rounded-[16px] object-cover border border-black/[0.04]" alt={`Gallery image ${i+1}`}/>
                     </button>
                  ))}
               </div>
            </section>

            {/* CERTIFICATIONS */}
            <section className="px-5 space-y-4">
               <Text variant="subtitle">Verified Information</Text>
               <div className="bg-[#F7F7F8] rounded-[20px] p-2">
                  {provider.certifications.map((cert, i) => (
                     <div key={i} onClick={() => setCertSheet(cert)} className="flex items-center gap-3 px-3 py-3 active:bg-black/[0.04] cursor-pointer rounded-[14px] transition-colors">
                        <CheckCircle2 size={20} color="#00C060" className="shrink-0" />
                        <span className="text-[15px] font-medium text-[#111111] flex-1">{cert.label}</span>
                        <span className="text-[12px] text-[#8E8E93] shrink-0 font-medium">{cert.verifiedDate ? new Date(cert.verifiedDate).toLocaleDateString('en-US', {month:'short', year:'numeric'}) : ''}</span>
                     </div>
                  ))}
               </div>
            </section>

       </div>

       {/* STICKY BOTTOM CTA (Floating Pill Style, Above Tab Area) */}
       <div className="absolute bottom-8 left-5 right-5 z-40 pointer-events-none">
           <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-black/[0.06] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.15)] rounded-[24px] p-2 pl-6 flex justify-between items-center">
               <div className="flex flex-col justify-center">
                  <span className="text-[12px] text-[#8E8E93] font-medium leading-tight mb-0.5">Book from</span>
                  <span className="text-[16px] font-bold text-[#111111] leading-tight">CHF 45</span>
               </div>
               <Button 
                 variant="primary" 
                 className="!w-auto !py-3.5 !px-6 !rounded-[18px] shadow-[0_4px_14px_rgba(255,107,53,0.3)]" 
                 onClick={() => console.log('Init booking')}
               >
                 Book Lukas
               </Button>
           </div>
       </div>

       {/* BOTTOM SHEETS & OVERLAYS */}
       <BottomSheet isOpen={menuSheet} onClose={() => setMenuSheet(false)} title="Options">
          <div className="space-y-1 pb-4 pt-2">
             <OptionRow icon={Share} label="Share Profile" onClick={() => setMenuSheet(false)} />
             <OptionRow icon={Star} label="Save for later" onClick={() => setMenuSheet(false)} />
             <OptionRow icon={AlertTriangle} label="Report Issue" danger onClick={() => setMenuSheet(false)} />
          </div>
       </BottomSheet>

       <BottomSheet isOpen={calendarSheet} onClose={() => setCalendarSheet(false)} title="Full Availability">
          <div className="py-4 space-y-6">
             <div className="bg-[#F7F7F8] w-full rounded-[20px] h-[300px] flex items-center justify-center border border-black/[0.04]">
                <span className="text-[#8E8E93] text-[14px] font-medium">Full month calendar grid</span>
             </div>
             <Button variant="primary" onClick={() => setCalendarSheet(false)}>Close</Button>
          </div>
       </BottomSheet>

       <BottomSheet isOpen={!!certSheet} onClose={() => setCertSheet(null)} title="Certification">
          {certSheet && (
             <div className="py-4 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-[#E5F9ED] rounded-[16px] flex items-center justify-center shrink-0">
                      <CheckCircle2 size={26} color="#00C060" />
                   </div>
                   <div>
                      <h3 className="text-[18px] font-bold text-[#111111]">{certSheet.label}</h3>
                      <p className="text-[14px] text-[#00C060] font-semibold flex items-center gap-1 mt-0.5"><CheckCircle2 size={14}/> Verified via FYLOS</p>
                   </div>
                </div>
                <div className="space-y-4 bg-[#F7F7F8] p-5 rounded-[20px] border border-black/[0.04]">
                   <div className="flex justify-between items-center">
                      <span className="text-[14px] text-[#6E6E73]">Date Verified</span>
                      <span className="text-[14px] font-semibold text-[#111111]">{new Date(certSheet.verifiedDate).toLocaleDateString('en-US', {month:'long', year:'numeric'})}</span>
                   </div>
                   {certSheet.expiryDate && (
                      <div className="flex justify-between items-center">
                         <span className="text-[14px] text-[#6E6E73]">Valid Until</span>
                         <span className="text-[14px] font-semibold text-[#111111]">{new Date(certSheet.expiryDate).toLocaleDateString('en-US', {month:'long', year:'numeric'})}</span>
                      </div>
                   )}
                   {certSheet.provider && (
                      <div className="flex justify-between items-center">
                         <span className="text-[14px] text-[#6E6E73]">Issuer</span>
                         <span className="text-[14px] font-semibold text-[#111111] truncate max-w-[180px] text-right">{certSheet.provider}</span>
                      </div>
                   )}
                </div>
                <Button variant="primary" onClick={() => setCertSheet(null)}>Done</Button>
             </div>
          )}
       </BottomSheet>

       {galleryViewer !== null && (
         <div className="absolute inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-5 pt-14 text-white">
               <button onClick={() => setGalleryViewer(null)} className="p-2 -ml-2 active:opacity-70"><X size={24} color="white"/></button>
               <span className="text-[15px] font-semibold">{galleryViewer + 1} / {provider.gallery.length}</span>
               <div className="w-10"></div>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-hidden pb-10">
               <img src={provider.gallery[galleryViewer]} className="w-full h-auto max-h-full object-contain" alt="Fullscreen View" />
            </div>
         </div>
       )}

    </div>
  );
};

const ReviewsScreen = ({ provider, onBack }) => {
  return (
    <div className="absolute inset-0 bg-[#F0F0F2] z-50 overflow-hidden flex flex-col">
       <header className="flex-none pt-14 pb-4 px-5 flex items-center bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] z-10 sticky top-0 border-b border-black/[0.04]">
          <button onClick={onBack} className="w-11 h-11 flex items-center justify-center bg-[#F7F7F8] rounded-full active:scale-95 transition-all mr-4"><ChevronLeft size={22}/></button>
          <h2 className="text-[17px] font-semibold text-[#111111]">All Reviews</h2>
       </header>
       <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          <Card className="!p-6">
             <div className="flex items-center gap-5">
                <div className="text-[48px] font-bold text-[#111111] leading-none">{provider.rating}</div>
                <div className="flex flex-col gap-1.5">
                   <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FF6B35" color="#FF6B35" />)}
                   </div>
                   <span className="text-[14px] font-medium text-[#6E6E73]">Based on {provider.reviewCount} reviews</span>
                </div>
             </div>
          </Card>
          
          <div className="space-y-3">
             {provider.reviews.map((r, i) => (
                <Card key={i} className="!p-5">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <Avatar src={r.authorPhoto} size={40} />
                         <div className="flex flex-col">
                            <span className="text-[15px] font-bold text-[#111111]">{r.author}</span>
                            <span className="text-[12px] font-medium text-[#8E8E93]">{r.date}</span>
                         </div>
                      </div>
                      <div className="flex gap-0.5">
                         {[...Array(5)].map((_, idx) => <Star key={idx} size={12} fill={idx < Math.floor(r.rating) ? "#FF6B35" : "transparent"} color={idx < Math.floor(r.rating) ? "#FF6B35" : "#E5E5E5"} />)}
                      </div>
                   </div>
                   <p className="text-[15px] text-[#111111] leading-relaxed opacity-95">{r.text}</p>
                </Card>
             ))}
          </div>
       </div>
    </div>
  )
}

// --- TAB SCREENS ---

const HomeScreen = () => {
  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-8">
        <div className="pt-2">
          <h2 className="text-[24px] font-bold text-[#111111] mb-1">FYLOS Platform</h2>
          <p className="text-[15px] text-[#6E6E73]">Step 11: Provider Profile View</p>
        </div>
        <EmptyState 
          icon={Activity} 
          title="Home Dashboard" 
          description="Navigate to the Services tab to view the new Provider Profile flow." 
        />
      </div>
    </ScreenContainer>
  );
};

const PetsScreen = () => (
  <ScreenContainer>
    <EmptyState 
      icon={PawPrint} 
      title="Pets" 
      description="Profiles, health, and sharing" 
      actionLabel="Add Pet"
      onAction={() => console.log('Add Pet Triggered')}
    />
  </ScreenContainer>
);

const MOCK_UPCOMING_BOOKINGS = [
  { id: 1, title: 'Dog Walking', provider: 'Lukas F.', date: 'Today, 14:00', status: 'confirmed' },
];

const MOCK_CATEGORIES = [
  { id: 'walking', label: 'Walking', icon: Activity, active: true },
  { id: 'sitting', label: 'Sitting', icon: Home, active: true },
  { id: 'grooming', label: 'Grooming', icon: Scissors, active: true },
  { id: 'vet', label: 'Vet Visits', icon: Stethoscope, active: false, badge: 'Soon' },
];

const MOCK_PROVIDERS = [
  { id: 'provider_001', name: 'Lukas F.', type: 'Dog Walker & Sitter', rating: '4.9', reviews: 124, price: 'CHF 45/hr', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 2, name: 'Michael Chen', type: 'Certified Pet Sitter', rating: '4.8', reviews: 89, price: 'CHF 30/hr', avatar: 'https://i.pravatar.cc/150?u=mike' },
  { id: 3, name: 'Elena Rossi', type: 'Dog Walker', rating: '5.0', reviews: 42, price: 'CHF 22/hr', avatar: 'https://i.pravatar.cc/150?u=elena' },
];

const ServicesScreen = ({ onNavigate }) => {
  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-8 pt-2">
        {MOCK_UPCOMING_BOOKINGS.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Text variant="subtitle">Upcoming</Text>
              <button className="text-[13px] font-semibold text-[#8E8E93] flex items-center gap-1 active:opacity-70 transition-opacity">
                My Bookings <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {MOCK_UPCOMING_BOOKINGS.map(booking => (
                <Card key={booking.id} clickable className="!p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0">
                      <Calendar size={20} color={THEME.colors.accent} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-[#111111] text-[15px] truncate">
                        {booking.title} <span className="text-[#6E6E73] font-normal">with {booking.provider}</span>
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={12} className="text-[#8E8E93]" />
                        <p className="text-[13px] text-[#6E6E73] truncate">{booking.date}</p>
                      </div>
                    </div>
                    <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'} className="!text-[10px]">
                      {booking.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
           <Text variant="subtitle">Categories</Text>
           <div className="flex gap-3 overflow-x-auto custom-scrollbar -mx-5 px-5 pb-2">
             {MOCK_CATEGORIES.map(cat => {
               const Icon = cat.icon;
               return (
                 <button
                   key={cat.id}
                   className={`flex items-center gap-2.5 px-4 h-[56px] rounded-[16px] border border-black/[0.06] bg-[#FFFFFF] whitespace-nowrap shrink-0 transition-all active:scale-[0.98] ${cat.active ? 'hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)]' : 'opacity-50 cursor-not-allowed'}`}
                   disabled={!cat.active}
                 >
                   <Icon size={20} color={THEME.colors.primaryText} strokeWidth={2} />
                   <span className="text-[15px] font-semibold text-[#111111]">{cat.label}</span>
                   {cat.badge && (
                     <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#8E8E93] bg-[#F7F7F8] px-1.5 py-0.5 rounded-md">{cat.badge}</span>
                   )}
                 </button>
               )
             })}
           </div>
        </section>

        <section className="space-y-4">
          <Text variant="subtitle">Featured Providers</Text>
          <div className="space-y-3">
            {MOCK_PROVIDERS.map(provider => (
              <Card 
                key={provider.id} 
                clickable 
                className="!p-4"
                onClick={() => provider.id === 'provider_001' ? onNavigate('provider_profile') : null}
              >
                <div className="flex items-center gap-4">
                  <Avatar src={provider.avatar} size={64} />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-[#111111] text-[16px] truncate">{provider.name}</h4>
                      <div className="flex items-center gap-0.5 bg-[#F7F7F8] px-1.5 py-0.5 rounded-md shrink-0 border border-black/[0.04]">
                        <Star size={10} className="fill-[#FF6B35] text-[#FF6B35]" />
                        <span className="text-[11px] font-bold text-[#111111]">{provider.rating}</span>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#6E6E73] truncate mb-1">{provider.type}</p>
                    <p className="text-[13px] font-medium text-[#111111]">{provider.price}</p>
                  </div>
                  <ChevronRight size={20} className="text-[#CFCFD4] shrink-0" />
                </div>
              </Card>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <button className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111111] active:opacity-70 transition-opacity">
              Browse all providers <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </div>
    </ScreenContainer>
  );
};

const ActivityScreen = () => (
  <ScreenContainer>
    <EmptyState icon={Activity} title="Activity" description="Journal and stats" />
  </ScreenContainer>
);

const VaultScreen = () => (
  <ScreenContainer>
    <EmptyState icon={Folder} title="Vault" description="Documents and records" />
  </ScreenContainer>
);

// --- APP SHELL (MAIN ENTRY POINT) ---

export default function App() {
  const [activeTab, setActiveTab] = useState('services');
  const [displayTab, setDisplayTab] = useState('services');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // App Navigation State (used to overlay deep screens over tabs)
  const [pushedScreen, setPushedScreen] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => { setIsLoading(false); }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    setIsFading(true);
    setTimeout(() => {
      setDisplayTab(tabId);
      setIsFading(false);
    }, 150);
  };

  const renderScreen = () => {
    switch (displayTab) {
      case 'home': return <HomeScreen />;
      case 'pets': return <PetsScreen />;
      case 'services': return <ServicesScreen onNavigate={setPushedScreen} />;
      case 'activity': return <ActivityScreen />;
      case 'vault': return <VaultScreen />;
      default: return <HomeScreen />;
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'home') return 'FYLOS';
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? tab.label : 'FYLOS';
  };

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes springBump { 0% { transform: scale(1); } 40% { transform: scale(1.06); } 100% { transform: scale(1); } }
        .animate-spring-bump { animation: springBump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
        
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-[100] pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {isLoading ? (
          <div className="absolute inset-0 bg-[#FFFFFF] z-50 flex flex-col items-center justify-center animate-out fade-out duration-500 fill-mode-forwards delay-700">
            <FylosLogo fontSize="32px" textColor="#111111" className="mb-3" />
            <p className="text-[14px] text-[#8E8E93] animate-pulse">Loading...</p>
          </div>
        ) : (
          <>
            <main 
              className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
              id={`panel-${displayTab}`}
            >
              {renderScreen()}
            </main>
            
            {/* Global UI (Hidden when a deep screen is pushed) */}
            <div className={`transition-opacity duration-300 ${pushedScreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
               <Header title={getHeaderTitle()} variant="default" user={MOCK_USER} />
               <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
            </div>

            {/* PUSHED SCREENS STACK */}
            {pushedScreen === 'provider_profile' && (
               <ProviderProfileScreen 
                 provider={mockProviderProfile} 
                 onBack={() => setPushedScreen(null)} 
                 onNavigate={(screen) => setPushedScreen(screen)}
               />
            )}

            {pushedScreen === 'reviews' && (
               <ReviewsScreen 
                 provider={mockProviderProfile} 
                 onBack={() => setPushedScreen('provider_profile')} 
               />
            )}
          </>
        )}

        <div id="modal-root" className="absolute inset-0 z-[110] pointer-events-none" />
      </div>
    </div>
  );
}