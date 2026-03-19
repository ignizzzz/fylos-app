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
  MessageCircle,
  Navigation,
  RotateCcw,
  List,
  Check,
  XCircle,
  Clock3,
  PersonStanding
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
  { id: 'bookings', label: 'Bookings', icon: List },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'vault', label: 'Vault', icon: Folder },
];

// Updated Mock Data based on spec
const MOCK_BOOKINGS = [
  {
    id: 'booking_123',
    status: 'confirmed',
    provider: { id: 'provider_001', name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas', rating: 4.9 },
    service: { id: 'service_90min', label: '90 min Walk', duration: 90 },
    dateTime: { date: '2026-02-24', time: '14:00', endTime: '15:30', start: '2026-02-24T14:00:00+01:00', formatted: 'Mon, Feb 24 · 14:00-15:30' },
    pet: { id: 'pet_001', name: 'Luna' },
    total: 95.00,
    helper: 'In 2 days',
    confirmedAt: '2026-02-22T14:35:00Z'
  },
  {
    id: 'booking_124',
    status: 'pending',
    provider: { id: 'provider_002', name: 'Maria S.', photo: 'https://i.pravatar.cc/150?u=maria', rating: 4.8 },
    service: { id: 'service_60min', label: '60 min Walk', duration: 60 },
    dateTime: { date: '2026-02-26', time: '10:00', endTime: '11:00', start: '2026-02-26T10:00:00+01:00', formatted: 'Wed, Feb 26 · 10:00-11:00' },
    pet: { id: 'pet_001', name: 'Luna' },
    total: 65.00,
    helper: 'Waiting for response... Expires in 18h',
    requestedAt: '2026-02-22T16:00:00Z'
  },
  {
    id: 'booking_125',
    status: 'in-progress',
    provider: { id: 'provider_004', name: 'Elena R.', photo: 'https://i.pravatar.cc/150?u=elena', rating: 5.0 },
    service: { id: 'service_60min', label: '60 min Walk', duration: 60 },
    dateTime: { date: '2026-02-23', time: '19:00', endTime: '20:00', start: '2026-02-23T19:00:00+01:00', formatted: 'Today · 19:00-20:00' },
    pet: { id: 'pet_001', name: 'Luna' },
    total: 60.00,
    helper: 'Started 15 minutes ago',
    requestedAt: '2026-02-21T16:00:00Z'
  },
  {
    id: 'booking_120',
    status: 'completed',
    provider: { id: 'provider_001', name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas', rating: 4.9 },
    service: { id: 'service_90min', label: '90 min Walk', duration: 90 },
    dateTime: { date: '2026-02-17', time: '14:00', endTime: '15:30', start: '2026-02-17T14:00:00+01:00', formatted: 'Feb 17 · 14:00-15:30' },
    pet: { id: 'pet_001', name: 'Luna' },
    total: 75.00,
    helper: '⭐⭐⭐⭐⭐ Reviewed',
    reviewed: true,
    completedAt: '2026-02-17T15:35:00Z'
  },
  {
    id: 'booking_119',
    status: 'completed',
    provider: { id: 'provider_003', name: 'Thomas K.', photo: 'https://i.pravatar.cc/150?u=thomas', rating: 4.9 },
    service: { id: 'service_60min', label: '60 min Walk', duration: 60 },
    dateTime: { date: '2026-02-10', time: '16:00', endTime: '17:00', start: '2026-02-10T16:00:00+01:00', formatted: 'Feb 10 · 16:00-17:00' },
    pet: { id: 'pet_002', name: 'Max' },
    total: 60.00,
    helper: 'Review pending',
    reviewed: false,
    completedAt: '2026-02-10T17:05:00Z'
  },
  {
    id: 'booking_118',
    status: 'cancelled',
    provider: { id: 'provider_002', name: 'Maria S.', photo: 'https://i.pravatar.cc/150?u=maria', rating: 4.8 },
    service: { id: 'service_90min', label: '90 min Walk', duration: 90 },
    dateTime: { date: '2026-02-15', start: '2026-02-15T10:00:00+01:00', formatted: 'Feb 15 · 10:00-11:30' },
    pet: { id: 'pet_001', name: 'Luna' },
    total: 75.00,
    helper: 'Cancelled by you',
    cancelledAt: '2026-02-14T18:00:00Z'
  },
  {
    id: 'booking_117',
    status: 'declined',
    provider: { id: 'provider_001', name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas', rating: 4.9 },
    service: { id: 'service_90min', label: '90 min Walk', duration: 90 },
    dateTime: { date: '2026-02-12', start: '2026-02-12T14:00:00+01:00', formatted: 'Feb 12 · 14:00-15:30' },
    pet: { id: 'pet_001', name: 'Luna' },
    total: 75.00,
    helper: 'Declined: Fully booked',
    cancelledAt: '2026-02-10T10:00:00Z'
  }
];

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
  }
};

// --- DESIGN SYSTEM COMPONENTS ---

const Text = ({ variant = 'body', className = '', children, ...props }) => {
  const variants = {
    title: "text-[24px] font-bold text-[#111111] tracking-tight",
    subtitle: "text-[17px] font-semibold text-[#111111]",
    body: "text-[15px] text-[#111111] leading-relaxed",
    caption: "text-[13px] text-[#6E6E73]",
    label: "text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider",
    sectionHeader: "text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider"
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
    default: "bg-[#F7F7F8] text-[#6E6E73]",
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
    secondary: "bg-[#F7F7F8] text-[#111111] hover:bg-[#F0F0F2]",
    outline: "bg-transparent text-[#111111] border-[1.5px] border-black/[0.08] hover:bg-[#F7F7F8]",
    destructive: "bg-[#FFF0F0] text-[#FF3B30] hover:bg-[#FFE5E5]",
    ghost: "bg-transparent text-[#111111] hover:bg-black/5"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-[13px] rounded-[10px] h-[36px]",
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
          {Icon && <Icon size={size === 'small' ? 14 : 20} />}
          {children}
        </>
      )}
    </button>
  );
};

const Card = ({ variant = 'default', clickable, children, className = '', ...props }) => {
  const baseStyles = "rounded-[24px] p-4 transition-all duration-200";
  const variants = {
    default: "bg-[#FFFFFF] border border-black/[0.04] shadow-sm",
    highlighted: "bg-[#FFFFFF] border border-black/[0.04] shadow-sm border-l-[4px] border-l-[#FF6B35]",
    grey: "bg-[#F7F7F8]"
  };
  const interactive = clickable ? "cursor-pointer hover:shadow-md active:scale-[0.98]" : "";
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${interactive} ${className}`} {...props}>
      {children}
    </div>
  );
};

const TextInput = ({ label, error, helperText, disabled, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className} ${disabled ? 'opacity-50' : ''}`}>
    {label && <label className="text-[13px] font-medium text-[#6E6E73] ml-1">{label}</label>}
    <input 
      disabled={disabled}
      className={`w-full h-[52px] px-4 bg-[#FFFFFF] border text-[16px] text-[#111111] rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 ${
        error 
          ? 'border-[#FF3B30] focus:border-[#FF3B30]' 
          : 'border-black/[0.08] focus:border-[#FF6B35]'
      } placeholder:text-[#8E8E93]`}
      {...props}
    />
    {error ? (
      <span className="text-[12px] text-[#FF3B30] ml-1 flex items-center gap-1"><AlertCircle size={12}/>{error}</span>
    ) : helperText ? (
      <span className="text-[12px] text-[#8E8E93] ml-1">{helperText}</span>
    ) : null}
  </div>
);

const SearchInput = ({ value, onChange, onClear, placeholder = 'Search...', className = '' }) => (
   <div className={`relative flex items-center w-full ${className}`}>
     <div className="absolute left-4 text-[#8E8E93] pointer-events-none">
       <Search size={18} strokeWidth={2.5} />
     </div>
     <input 
       type="text"
       value={value}
       onChange={onChange}
       placeholder={placeholder}
       className="w-full h-[48px] pl-11 pr-11 bg-[#F7F7F8] text-[#111111] rounded-[16px] text-[16px] placeholder:text-[#8E8E93] focus:outline-none focus:bg-[#FFFFFF] focus:border focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 transition-all duration-200 border border-transparent"
     />
     {value && (
       <button onClick={onClear} className="absolute right-4 text-[#8E8E93] hover:text-[#111111] transition-colors p-1 rounded-full active:bg-black/5">
         <X size={16} strokeWidth={2.5} />
       </button>
     )}
   </div>
);

const Select = ({ label, options = [], value, onChange, disabled, className = '' }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className} ${disabled ? 'opacity-50' : ''}`}>
    {label && <label className="text-[13px] font-medium text-[#6E6E73] ml-1">{label}</label>}
    <div className="relative">
      <select 
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="w-full h-[52px] px-4 pr-10 bg-[#FFFFFF] border border-black/[0.08] text-[16px] text-[#111111] rounded-2xl appearance-none transition-all duration-200 focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8E8E93]">
        <ChevronDown size={18} />
      </div>
    </div>
  </div>
);

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

const SegmentedControl = ({ segments, activeIndex, onChange, className = '' }) => {
  return (
    <div className={`flex bg-[#F7F7F8] p-1 rounded-[14px] relative ${className}`}>
      <div 
        className="absolute top-1 bottom-1 bg-[#FFFFFF] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out"
        style={{ width: `calc(${100 / segments.length}% - 4px)`, left: `calc(${(100 / segments.length) * activeIndex}% + 2px)` }}
      />
      {segments.map((seg, i) => (
        <button
          key={seg}
          onClick={() => onChange(i)}
          className={`relative z-10 flex-1 py-1.5 text-[13px] font-semibold transition-colors duration-200 ${activeIndex === i ? 'text-[#111111]' : 'text-[#8E8E93]'}`}
        >
          {seg}
        </button>
      ))}
    </div>
  );
};

const InlineNotice = ({ variant = 'info', title, description, className = '' }) => {
  const variants = {
    info: { bg: 'bg-[#E5F0FF]', text: 'text-[#007AFF]', icon: Info },
    success: { bg: 'bg-[#E5F9ED]', text: 'text-[#00C060]', icon: CheckCircle2 },
    warning: { bg: 'bg-[#FFF4E5]', text: 'text-[#FF9500]', icon: AlertTriangle },
    error: { bg: 'bg-[#FFE5E5]', text: 'text-[#FF3B30]', icon: AlertCircle }
  };
  const v = variants[variant];
  const Icon = v.icon;
  
  return (
    <div className={`flex items-start gap-3 p-4 rounded-[16px] ${v.bg} ${className}`}>
      <Icon className={`shrink-0 ${v.text}`} size={20} strokeWidth={2.5} />
      <div className="flex flex-col gap-0.5 pt-0.5">
        {title && <span className={`text-[14px] font-bold ${v.text}`}>{title}</span>}
        {description && <span className={`text-[13px] ${v.text} opacity-90 leading-relaxed`}>{description}</span>}
      </div>
    </div>
  );
};

const Skeleton = ({ className = '', rounded = 'rounded-[16px]', ...props }) => (
  <div className={`animate-pulse bg-black/[0.04] ${rounded} ${className}`} {...props} />
);

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
 * Header Component (Floating Pills System)
 */
const Header = ({ title, variant = 'default', user, onAction }) => {
  const handleAction = (action) => {
    if (onAction) onAction(action);
    else console.log(`${action} — Action triggered`);
  };

  return (
    <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent">
      
      {variant === 'default' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <h1 className="font-bold tracking-tight text-[#111111] drop-shadow-sm ml-1 flex items-center text-[22px]">
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

      {variant === 'bookings' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <h1 className="font-bold tracking-tight text-[#111111] drop-shadow-sm ml-1 flex items-center text-[24px]">
            {title}
          </h1>
          <button 
            onClick={() => handleAction('Add')}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <span className="text-[24px] font-light leading-none mb-0.5">+</span>
          </button>
        </div>
      )}

      {variant === 'detail' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button 
            onClick={() => handleAction('Back')}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          <h2 className="text-[17px] font-semibold text-[#111111]">{title}</h2>
          <button 
            onClick={() => handleAction('Menu')}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <MoreHorizontal size={22} color="#111111" />
          </button>
        </div>
      )}
    </header>
  );
};

/**
 * TabBar Component (Floating Dock)
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

// --- SCREENS ---

// ==========================================
// STEP 19: BOOKINGS SCREEN (HUB)
// ==========================================

const FilterTabs = ({ filters, activeFilter, onChange }) => {
  return (
    <div className="relative flex gap-6 overflow-x-auto custom-scrollbar -mx-5 px-5 pb-3 pt-2 mb-2 sticky top-0 bg-[#FFFFFF]/90 backdrop-blur-md z-10 border-b border-[#E5E5E5]">
      {filters.map(f => {
        const isActive = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`relative flex items-center pb-2 text-[15px] font-semibold whitespace-nowrap transition-colors duration-200 ${
              isActive ? 'text-[#FF6B35]' : 'text-[#8E8E93] hover:text-[#111111]'
            }`}
          >
            {f.label}
            <span className={`ml-1.5 text-[13px] ${isActive ? 'text-[#FF6B35]' : 'text-[#8E8E93]'}`}>
              ({f.count})
            </span>
            
            {/* Animated Bottom Line */}
            {isActive && (
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#FF6B35] rounded-t-full" />
            )}
          </button>
        )
      })}
    </div>
  );
};

const BookingStatusBadge = ({ status }) => {
  const configs = {
    'pending': { bg: 'bg-[#FFF5F0]', text: 'text-[#FF6B35]', icon: Clock3, label: 'PENDING' },
    'confirmed': { bg: 'bg-[#E8F8EC]', text: 'text-[#00C060]', icon: Check, label: 'CONFIRMED' },
    'in-progress': { bg: 'bg-[#E8F4FF]', text: 'text-[#007AFF]', icon: PersonStanding, label: 'IN PROGRESS' },
    'completed': { bg: 'bg-[#F7F7F8]', text: 'text-[#6E6E73]', icon: Check, label: 'COMPLETED' },
    'cancelled': { bg: 'bg-[#FFE5E5]', text: 'text-[#FF3B30]', icon: XCircle, label: 'CANCELLED' },
    'declined': { bg: 'bg-[#FFE5E5]', text: 'text-[#FF3B30]', icon: XCircle, label: 'DECLINED' }
  };
  
  const config = configs[status] || configs['completed'];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] ${config.bg}`}>
      <Icon size={12} strokeWidth={3} className={config.text} />
      <span className={`text-[11px] font-bold tracking-wide ${config.text}`}>
        {config.label}
      </span>
    </div>
  );
};

const BookingCard = ({ booking, onCancel }) => {
  const renderActions = () => {
    switch (booking.status) {
      case 'confirmed':
        return (
          <>
            <Button variant="secondary" size="small" fullWidth={false} icon={MessageCircle}>Message</Button>
            <button className="text-[14px] font-semibold text-[#111111] hover:underline active:opacity-70 px-2">View Details</button>
          </>
        );
      case 'pending':
        return (
          <>
            <Button variant="destructive" size="small" fullWidth={false} onClick={() => onCancel(booking.id)}>Cancel Request</Button>
            <button className="text-[14px] font-semibold text-[#111111] hover:underline active:opacity-70 px-2">Details</button>
          </>
        );
      case 'in-progress':
        return (
          <>
            <Button variant="secondary" size="small" fullWidth={false} icon={MessageCircle}>Message</Button>
            <Button variant="primary" size="small" fullWidth={false} icon={Navigation} className="!h-[36px] !rounded-[10px]">Track Live</Button>
          </>
        );
      case 'completed':
        if (booking.reviewed) {
          return (
            <>
              <Button variant="secondary" size="small" fullWidth={false} icon={RotateCcw}>Book Again</Button>
              <button className="text-[14px] font-semibold text-[#111111] hover:underline active:opacity-70 px-2">View</button>
            </>
          );
        } else {
          return (
            <>
              <Button variant="primary" size="small" fullWidth={false} className="!h-[36px] !rounded-[10px]">Leave Review</Button>
              <Button variant="secondary" size="small" fullWidth={false} icon={RotateCcw}>Book Again</Button>
              <button className="text-[14px] font-semibold text-[#111111] hover:underline active:opacity-70 px-2">View</button>
            </>
          );
        }
      case 'cancelled':
      case 'declined':
        return (
          <>
            <Button variant="secondary" size="small" fullWidth={false} icon={RotateCcw}>Book Again</Button>
            <button className="text-[14px] font-semibold text-[#111111] hover:underline active:opacity-70 px-2">View</button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Card clickable className="!p-4 shadow-sm border border-[#E5E5E5]/50">
      <div className="flex flex-col gap-3">
        {/* Top: Status Badge */}
        <div>
          <BookingStatusBadge status={booking.status} />
        </div>

        {/* Body: Walker Info */}
        <div className="flex gap-3 items-center">
          <Avatar src={booking.provider.photo} size={48} />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-[15px] text-[#111111] truncate flex items-center gap-1.5">
              {booking.provider.name}
              <span className="text-[#CFCFD4]">·</span>
              <span className="flex items-center gap-0.5">
                <span className="text-[14px] font-semibold">{booking.provider.rating}</span>
                <Star size={12} className="fill-[#FF9500] text-[#FF9500]" />
              </span>
            </h4>
          </div>
        </div>

        {/* Service Details */}
        <div className="flex flex-col">
          <p className="text-[14px] text-[#111111]">{booking.service.label} · {booking.pet.name}</p>
          <p className="text-[14px] text-[#6E6E73]">{booking.dateTime.formatted}</p>
        </div>

        {/* Helper Line */}
        {booking.helper && (
          <p className="text-[14px] text-[#6E6E73] flex items-center gap-1.5 pt-1">
             {booking.status === 'in-progress' && <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse" />}
             {booking.helper}
          </p>
        )}

        {/* Bottom Actions */}
        <div className="flex items-center gap-3 pt-2">
          {renderActions()}
        </div>
      </div>
    </Card>
  );
};

const SectionHeader = ({ title, count }) => (
  <div className="mt-6 mb-3 px-1">
    <Text variant="sectionHeader">{title} ({count})</Text>
  </div>
);

const BookingsScreen = () => {
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [cancelSheetOpen, setCancelSheetOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Sorting logics based on spec
  const sortBookings = (bookings, section) => {
    return [...bookings].sort((a, b) => {
      switch(section) {
        case 'upcoming': return new Date(a.dateTime.start) - new Date(b.dateTime.start);
        case 'pending': return new Date(b.requestedAt) - new Date(a.requestedAt);
        case 'completed': return new Date(b.completedAt) - new Date(a.completedAt);
        case 'cancelled': return new Date(b.cancelledAt || b.declinedAt) - new Date(a.cancelledAt || a.declinedAt);
        default: return 0;
      }
    });
  };

  const upcomingBookings = MOCK_BOOKINGS.filter(b => ['confirmed', 'pending'].includes(b.status));
  const pendingBookings = MOCK_BOOKINGS.filter(b => b.status === 'pending');
  const inProgressBookings = MOCK_BOOKINGS.filter(b => b.status === 'in-progress');
  const completedBookings = MOCK_BOOKINGS.filter(b => b.status === 'completed');
  const cancelledBookings = MOCK_BOOKINGS.filter(b => ['cancelled', 'declined'].includes(b.status));

  const filters = [
    { id: 'all', label: 'All', count: MOCK_BOOKINGS.length },
    { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
    { id: 'pending', label: 'Pending', count: pendingBookings.length },
    { id: 'in-progress', label: 'In Progress', count: inProgressBookings.length },
    { id: 'completed', label: 'Past', count: completedBookings.length },
    { id: 'cancelled', label: 'Cancelled', count: cancelledBookings.length }
  ];

  const handleCancelRequest = (id) => {
    setSelectedBookingId(id);
    setCancelSheetOpen(true);
  };

  const executeCancel = () => {
    console.log('Cancelled booking:', selectedBookingId);
    setCancelSheetOpen(false);
    setTimeout(() => setSelectedBookingId(null), 300);
  };

  const renderBookings = () => {
    let bookingsToRender = [];
    let sectionType = activeFilter;

    if (activeFilter === 'upcoming') bookingsToRender = sortBookings(upcomingBookings, 'upcoming');
    else if (activeFilter === 'pending') bookingsToRender = sortBookings(pendingBookings, 'pending');
    else if (activeFilter === 'in-progress') bookingsToRender = inProgressBookings;
    else if (activeFilter === 'completed') bookingsToRender = sortBookings(completedBookings, 'completed');
    else if (activeFilter === 'cancelled') bookingsToRender = sortBookings(cancelledBookings, 'cancelled');

    // Handle Empty States
    if (activeFilter !== 'all' && bookingsToRender.length === 0) {
      const messages = {
        'upcoming': { title: "No upcoming bookings", desc: "You have no scheduled services.", action: "Book a Walk" },
        'pending': { title: "No pending requests", desc: "Your requests have been answered.", action: null },
        'in-progress': { title: "No walks in progress", desc: "", action: null },
        'completed': { title: "No completed bookings yet", desc: "Your history will appear here.", action: null },
        'cancelled': { title: "No cancelled bookings", desc: "", action: null }
      };
      const emptyState = messages[activeFilter];
      return (
        <EmptyState 
          icon={Calendar} 
          title={emptyState.title} 
          description={emptyState.desc} 
          actionLabel={emptyState.action}
          onAction={() => console.log('Book a Walk triggered')}
        />
      );
    }

    if (activeFilter === 'all' && MOCK_BOOKINGS.length === 0) {
       return (
        <EmptyState 
          icon={PawPrint} 
          title="No bookings yet" 
          description="Book your first dog walk and give your pup an adventure!" 
          actionLabel="Book a Walk"
          onAction={() => console.log('Book a Walk triggered')}
        />
      );
    }

    // "All" Tab grouping logic
    if (activeFilter === 'all') {
      const u = sortBookings([...upcomingBookings, ...inProgressBookings], 'upcoming');
      const c = sortBookings(completedBookings, 'completed');
      const x = sortBookings(cancelledBookings, 'cancelled');

      return (
        <div className="space-y-2">
          {u.length > 0 && (
            <section>
              <SectionHeader title="UPCOMING" count={u.length} />
              <div className="space-y-4">
                {u.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancelRequest} />)}
              </div>
            </section>
          )}
          {c.length > 0 && (
            <section>
              <SectionHeader title="COMPLETED" count={c.length} />
              <div className="space-y-4">
                {c.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancelRequest} />)}
              </div>
              {c.length > 2 && (
                <div className="pt-6 flex justify-center pb-2">
                  <button onClick={() => setActiveFilter('completed')} className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111111] active:opacity-70 transition-opacity">
                    View All Completed →
                  </button>
                </div>
              )}
            </section>
          )}
          {x.length > 0 && (
            <section>
              <SectionHeader title="CANCELLED" count={x.length} />
              <div className="space-y-4">
                {x.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancelRequest} />)}
              </div>
            </section>
          )}
        </div>
      );
    }

    // Default simple list for specific filters
    return (
      <div className="space-y-4 pt-2">
        {bookingsToRender.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancelRequest} />)}
        
        {activeFilter === 'completed' && bookingsToRender.length > 5 && (
          <div className="pt-4 flex justify-center pb-4">
            <button className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111111] active:opacity-70 transition-opacity">
              View All Completed →
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <ScreenContainer>
      <div className="px-5 pb-8 flex flex-col h-full">
        
        <FilterTabs 
          filters={filters} 
          activeFilter={activeFilter} 
          onChange={setActiveFilter} 
        />

        {/* Content Area */}
        {renderBookings()}
      </div>

      {/* Cancel Request Sheet */}
      <BottomSheet isOpen={cancelSheetOpen} onClose={() => setCancelSheetOpen(false)} title="Cancel request?">
        <div className="space-y-6 pt-2">
          <Text variant="body" className="text-[#6E6E73]">
            The walker will be notified. No charge will be made. Your hold will be released.
          </Text>
          <div className="flex flex-col gap-3 pt-2">
            <Button variant="destructive" size="large" onClick={executeCancel}>
              Cancel Request
            </Button>
            <Button variant="ghost" size="large" onClick={() => setCancelSheetOpen(false)}>
              Keep Request
            </Button>
          </div>
        </div>
      </BottomSheet>
    </ScreenContainer>
  );
};


// 2. HOME SCREEN (Design Sandbox)
const HomeScreen = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState('opt1');

  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-8">
        <div className="pt-2">
          <h2 className="text-[24px] font-bold text-[#111111] mb-1">Design System</h2>
          <p className="text-[15px] text-[#6E6E73]">Step 2: Component Library Sandbox</p>
        </div>

        <SearchInput 
          value={searchValue} 
          onChange={(e) => setSearchValue(e.target.value)}
          onClear={() => setSearchValue('')}
        />

        <section className="space-y-4">
          <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Identity & Status</h3>
          <div className="flex items-center gap-4">
            <Avatar src="https://i.pravatar.cc/150?u=alex_fylos" badge="3" />
            <Avatar initials="JD" badge="" badgeColor="#00C060" />
            <Avatar initials="MK" />
            <div className="flex flex-col gap-2 ml-auto items-end">
              <Badge variant="success">Active</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="error">Alert</Badge>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Forms</h3>
          <TextInput label="Pet Name" placeholder="e.g. Max" />
          <TextInput label="Microchip Number" placeholder="Enter number" error="Invalid format" />
          <Select 
            label="Species"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            options={[
              { value: 'opt1', label: 'Dog' },
              { value: 'opt2', label: 'Cat' },
              { value: 'opt3', label: 'Bird' }
            ]}
          />
        </section>

        <section className="space-y-4">
          <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Cards</h3>
          <Card clickable>
            <div className="flex items-center gap-3">
              <IconWrapper icon={Calendar} color="#FF6B35" />
              <div>
                <h4 className="font-semibold text-[#111111]">Vet Appointment</h4>
                <p className="text-[13px] text-[#6E6E73]">Tomorrow, 10:00 AM</p>
              </div>
              <ChevronLeft className="ml-auto rotate-180 text-[#CFCFD4]" size={20} />
            </div>
          </Card>
          <Card variant="highlighted">
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#111111]">Vaccination Due</span>
              <Button variant="primary" className="!w-auto !py-2 !px-4 !rounded-xl text-[14px]">Book</Button>
            </div>
          </Card>
        </section>

        <section className="space-y-4">
          <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Actions</h3>
          <div className="flex flex-col gap-3">
            <Button variant="primary">Save Changes</Button>
            <Button variant="secondary" onClick={() => setSheetOpen(true)}>Open Bottom Sheet</Button>
            <div className="flex gap-3">
              <Button variant="primary" isLoading className="flex-1">Load</Button>
              <Button variant="destructive" className="flex-1">Delete</Button>
            </div>
          </div>
        </section>
      </div>

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Quick Action">
        <div className="space-y-5 pt-2">
          <p className="text-[15px] text-[#6E6E73] leading-relaxed">
            This bottom sheet slides up above the floating header and tab dock, respecting the z-index philosophy. You can drag it down to close.
          </p>
          <TextInput placeholder="Confirm action..." />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setSheetOpen(false)}>Confirm</Button>
          </div>
        </div>
      </BottomSheet>
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

// --- SERVICES MODULE DATA ---
const MOCK_UPCOMING_BOOKINGS = [
  { id: 1, title: 'Dog Walking', provider: 'Sarah M.', date: 'Today, 14:00', status: 'confirmed' },
  { id: 2, title: 'Pet Sitting', provider: 'Mike T.', date: 'Tomorrow, 09:00', status: 'pending' },
];

const MOCK_CATEGORIES = [
  { id: 'walking', label: 'Walking', icon: Activity, active: true },
  { id: 'sitting', label: 'Sitting', icon: Home, active: true },
  { id: 'grooming', label: 'Grooming', icon: Scissors, active: true },
  { id: 'vet', label: 'Vet Visits', icon: Stethoscope, active: false, badge: 'Soon' },
];

const MOCK_PROVIDERS = [
  { id: 1, name: 'Sarah Miller', type: 'Dog Walker & Sitter', rating: '4.9', reviews: 124, price: 'CHF 25/hr', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 2, name: 'Michael Chen', type: 'Certified Pet Sitter', rating: '4.8', reviews: 89, price: 'CHF 30/hr', avatar: 'https://i.pravatar.cc/150?u=mike' },
  { id: 3, name: 'Elena Rossi', type: 'Dog Walker', rating: '5.0', reviews: 42, price: 'CHF 22/hr', avatar: 'https://i.pravatar.cc/150?u=elena' },
];

const ServicesScreen = ({ navigateTo }) => {
  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-8 pt-2">
        
        {/* 1. UPCOMING BOOKINGS (Dynamic) */}
        {MOCK_UPCOMING_BOOKINGS.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Text variant="subtitle">Upcoming</Text>
              <button 
                onClick={() => navigateTo('bookings')}
                className="text-[13px] font-semibold text-[#8E8E93] flex items-center gap-1 active:opacity-70 transition-opacity"
              >
                My Bookings <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {MOCK_UPCOMING_BOOKINGS.slice(0, 2).map(booking => (
                <Card key={booking.id} clickable className="!p-4 border border-[#E5E5E5]/50 shadow-sm">
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

        {/* 2. CATEGORIES (Horizontal Scroll) */}
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

        {/* 3. FEATURED PROVIDERS */}
        <section className="space-y-4">
          <Text variant="subtitle">Featured Providers</Text>
          <div className="space-y-3">
            {MOCK_PROVIDERS.map(provider => (
              <Card key={provider.id} clickable className="!p-4 border border-[#E5E5E5]/50 shadow-sm">
                <div className="flex items-center gap-4">
                  <Avatar src={provider.avatar} size={64} />
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-semibold text-[#111111] text-[16px] truncate">{provider.name}</h4>
                      <div className="flex items-center gap-0.5 bg-[#F7F7F8] px-1.5 py-0.5 rounded-md shrink-0">
                        <Star size={10} className="fill-[#111111] text-[#111111]" />
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

          {/* 4. BROWSE ALL PROVIDERS */}
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


const VaultScreen = () => {
  return (
    <ScreenContainer>
       <EmptyState 
         icon={Folder} 
         title="Vault" 
         description="Documents, medical records, and files" 
       />
    </ScreenContainer>
  );
};

// --- APP SHELL (MAIN ENTRY POINT) ---

export default function App() {
  // SET BOOKINGS AS DEFAULT TAB FOR PREVIEW
  const [activeTab, setActiveTab] = useState('bookings');
  const [displayTab, setDisplayTab] = useState('bookings');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
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
      case 'bookings': return <BookingsScreen />;
      case 'services': return <ServicesScreen navigateTo={handleTabChange} />;
      case 'pets': return <PetsScreen />;
      case 'vault': return <VaultScreen />;
      default: return <HomeScreen />;
    }
  };

  const getHeaderVariant = () => {
    if (activeTab === 'bookings') return 'bookings';
    return 'default';
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

        @keyframes springBump {
          0% { transform: scale(1); }
          40% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-spring-bump {
          animation: springBump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
        
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

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
              role="tabpanel"
              aria-labelledby={`tab-${displayTab}`}
            >
              {renderScreen()}
            </main>
            
            <Header 
              title={getHeaderTitle()} 
              variant={getHeaderVariant()}
              user={MOCK_USER} 
              onAction={(action) => {
                if (action === 'Add' && displayTab === 'bookings') {
                  handleTabChange('services');
                }
              }}
            />
            
            <TabBar 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          </>
        )}

        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>
    </div>
  );
}