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
  Camera,
  Pill,
  ArrowRight
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
  name: 'Anna',
  avatar: 'https://i.pravatar.cc/150?u=anna_fylos',
  notifications: 1,
};

const MOCK_PETS = [
  { id: 'p1', name: 'Luna', type: 'Dog', avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150&h=150&fit=crop&crop=faces' },
  { id: 'p2', name: 'Max', type: 'Cat', avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop&crop=faces' }
];

const MOCK_BOOKINGS = [
  { id: 'b1', petId: 'p1', walkerName: 'Lukas F.', walkerRating: '4.9', walkerAvatar: 'https://i.pravatar.cc/150?u=lukas', service: '90 min Walk', date: '2026-02-16T09:00:00Z', status: 'Confirmed' },
  { id: 'b2', petId: 'p2', walkerName: 'Sarah M.', walkerRating: '4.8', walkerAvatar: 'https://i.pravatar.cc/150?u=sarah', service: 'Cat Sitting', date: '2026-02-18T14:00:00Z', status: 'Pending' }
];

const MOCK_REMINDERS = [
  { id: 'r1', petId: 'p1', title: 'Morning Medication', time: '08:00', icon: '💊' },
  { id: 'r2', petId: 'p1', title: 'Afternoon Walk', time: '14:00', icon: '🦮' },
  { id: 'r3', petId: 'p2', title: 'Refill Water Bowl', time: '09:00', icon: '💧' }
];

const MOCK_SUGGESTIONS = [
  { id: 's1', petId: 'p1', title: 'Spring Grooming', context: 'Luna is due for a trim', icon: '✂️' },
  { id: 's2', petId: 'p2', title: 'Annual Checkup', context: 'Max is due next month', icon: '🏥' }
];

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'vault', label: 'Vault', icon: Folder },
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
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.02)',
    floating: '0 8px 24px rgba(0,0,0,0.06)',
    active: '0 8px 30px rgba(0,0,0,0.04)'
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

// --- DESIGN SYSTEM COMPONENTS (STEP 2) ---

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
  return <div className={`w-full h-[1px] bg-[${THEME.colors.divider}] ${spacings[spacing]} ${className}`} />;
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
    info: "bg-[#E5F0FF] text-[#007AFF]",
    softSuccess: "bg-[rgba(52,199,89,0.1)] text-[#34C759]",
    softWarning: "bg-[rgba(255,149,0,0.1)] text-[#FF9500]",
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
    destructive: "bg-[#FFF0F0] text-[#FF3B30] hover:bg-[#FFE5E5]",
    ghost: "bg-transparent text-[#111111] hover:bg-black/[0.02]"
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
    default: "bg-[#FFFFFF] border border-black/[0.03] shadow-[0_4px_24px_rgba(0,0,0,0.015)]",
    highlighted: "bg-[#FFFFFF] border border-black/[0.03] shadow-[0_4px_24px_rgba(0,0,0,0.015)] border-l-[4px] border-l-[#FF6B35]",
    grey: "bg-[#F7F7F8]",
    warm: "bg-[#FCFCFA] border border-black/[0.02] shadow-[0_2px_12px_rgba(0,0,0,0.01)]"
  };
  const interactive = clickable ? "cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] active:scale-[0.97] active:bg-[#F9F9F9]" : "";
  
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

// B) Tiny helper hook
const useLockBodyScroll = (isOpen) => {
  useEffect(() => {
    if (!isOpen) return;
    const body = document.body;
    
    const originalOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = originalOverflow;
    };
  }, [isOpen]);
};

// A) Updated BottomSheet component code
const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [portalNode, setPortalNode] = useState(null);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    // Βρίσκουμε το εσωτερικό root του mockup αντί για το document.body
    setPortalNode(document.getElementById('fylos-portal-root') || document.body);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const raf = requestAnimationFrame(() => {
        setTimeout(() => setVisible(true), 10);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
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

  if (!render) return null;

  const content = (
    <div className="absolute inset-0 z-[100] flex flex-col justify-end pointer-events-auto">
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
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
    </div>
  );

  return portalNode ? createPortal(content, portalNode) : null;
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

const ListRow = ({ icon: Icon, avatar, title, subtitle, rightAccessory, onClick, className = '' }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 py-3 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
  >
    {avatar ? <Avatar {...avatar} size={40} /> : Icon && (
      <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0">
        <Icon size={20} color={THEME.colors.accent} />
      </div>
    )}
    <div className="flex-1 flex flex-col justify-center min-w-0">
      <span className="text-[16px] font-semibold text-[#111111] truncate">{title}</span>
      {subtitle && <span className="text-[13px] text-[#6E6E73] truncate">{subtitle}</span>}
    </div>
    {rightAccessory && <div className="shrink-0 ml-2 text-[#CFCFD4]">{rightAccessory}</div>}
  </div>
);

/**
 * Reusable Empty State Component
 */
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
const Header = ({ title, variant = 'default', user }) => {
  const handleAction = (action) => alert(`${action} — Coming in future steps`);

  return (
    <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent">
      
      {/* VARIANT 1: DEFAULT (App Shell Main) */}
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

      {/* VARIANT 2: DETAIL */}
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

      {/* VARIANT 3: MODAL */}
      {variant === 'modal' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button 
            onClick={() => handleAction('Back')}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          <h2 className="text-[17px] font-semibold text-[#111111]">{title}</h2>
          <button 
            onClick={() => handleAction('Close')}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <X size={22} color="#111111" />
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
              {/* Radial Glow for Active Tab (Kept Identical) */}
              <div 
                className={`absolute top-[12px] w-[32px] h-[32px] bg-[#FF6B35] rounded-full blur-[12px] transition-opacity duration-[240ms] pointer-events-none ${isActive ? 'opacity-25' : 'opacity-0'}`} 
              />
              
              {/* Icon Container with Custom Spring Bump */}
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

// --- UTILS ---
const useTimeBasedGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const formatDateTime = (iso) => {
  const d = new Date(iso);
  const datePart = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timePart = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  return `${datePart} · ${timePart}`;
};

const HomeScreen = ({ onNavigate }) => {
  const [selectedPetId, setSelectedPetId] = useState(MOCK_PETS[0].id);
  const [medSheetOpen, setMedSheetOpen] = useState(false);
  const [medName, setMedName] = useState('');
  const [completedReminders, setCompletedReminders] = useState(new Set());
  const [isFading, setIsFading] = useState(false);
  const [displayPetId, setDisplayPetId] = useState(MOCK_PETS[0].id);

  const greeting = useTimeBasedGreeting();
  const selectedPet = MOCK_PETS.find(p => p.id === displayPetId) || MOCK_PETS[0];

  const handlePetSelect = (id) => {
    if (id === selectedPetId) return;
    setSelectedPetId(id);
    setIsFading(true);
    setTimeout(() => {
      setDisplayPetId(id);
      setIsFading(false);
    }, 200);
  };

  const handleMedSave = () => {
    alert("Saved (mock)");
    setMedSheetOpen(false);
    setMedName('');
  };

  const handleCompleteReminder = (id) => {
    setCompletedReminders(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const filteredBookings = MOCK_BOOKINGS.filter(b => b.petId === displayPetId);
  const filteredReminders = MOCK_REMINDERS.filter(r => r.petId === displayPetId);
  const filteredSuggestions = MOCK_SUGGESTIONS.filter(s => s.petId === displayPetId);

  const getBadgeVariant = (status) => {
    switch(status) {
      case 'Confirmed': return 'softSuccess';
      case 'Pending': return 'softWarning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-12">
        {/* A) GreetingSection */}
        <div className="pt-2">
          <h2 className="text-[24px] font-bold text-[#111111] mb-2">{greeting}, <span className="font-extrabold">{MOCK_USER.name}</span></h2>
          <p className="text-[15px] text-[#6E6E73]">
            {MOCK_PETS.length === 1 ? `What's on ${MOCK_PETS[0].name}'s schedule?` : "What's on the schedule today?"}
          </p>
        </div>

        {/* B) PetSelector (ONLY if 2+ pets) */}
        {MOCK_PETS.length > 1 && (
          <div className="flex overflow-x-auto hide-scrollbar -mx-5 px-5 gap-4 pb-2">
            {MOCK_PETS.map((pet) => {
              const isSelected = selectedPetId === pet.id;
              return (
                <button 
                  key={pet.id} 
                  onClick={() => handlePetSelect(pet.id)}
                  className="flex flex-col items-center gap-2 flex-shrink-0 transition-transform active:scale-[0.98]"
                >
                  <div className={`relative rounded-full p-[2px] transition-all duration-200 ${isSelected ? 'border-[2px] border-[#FF6B35]/85' : 'border border-black/[0.03] opacity-80'}`}>
                    <img src={pet.avatar} alt={pet.name} className="w-[68px] h-[68px] rounded-full object-cover border-[1.5px] border-white" />
                    {isSelected && (
                      <div className="absolute -bottom-0 -right-0 w-[18px] h-[18px] bg-white rounded-full border border-black/[0.03] shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex items-center justify-center">
                        <CheckCircle2 size={10} color="#FF6B35" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span className={`text-[13px] font-semibold transition-colors duration-200 ${isSelected ? 'text-[#111111]' : 'text-[#6E6E73]'}`}>
                    {pet.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Fading Content Wrapper */}
        <div className={`space-y-12 transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          
          {/* C) UpcomingBookings */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[17px] font-semibold text-[#111111]">Upcoming</h3>
              <button onClick={() => alert("My Bookings - Coming in Step 19")} className="flex items-center text-[14px] font-medium text-[#6E6E73] active:opacity-70">
                View all <ChevronRight size={16} className="ml-0.5" />
              </button>
            </div>
            
            {filteredBookings.length > 0 ? (
              <div className="space-y-3">
                {filteredBookings.slice(0, 2).map((booking) => (
                  <Card key={booking.id} clickable onClick={() => alert(`Booking Details - Coming in Step 18 (id: ${booking.id})`)} className="!p-5 shadow-[0_4px_24px_rgba(0,0,0,0.015)] border-black/[0.03]">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={booking.walkerAvatar} size={40} />
                        <div className="flex flex-col">
                          <span className="text-[15px] font-bold text-[#111111] leading-tight">{booking.walkerName} · {booking.walkerRating} <Star size={12} className="inline text-[#FF9500] fill-[#FF9500] mb-0.5" /></span>
                          <span className="text-[13px] text-[#6E6E73]">{booking.service} · {selectedPet.name}</span>
                        </div>
                      </div>
                      <Badge variant={getBadgeVariant(booking.status)}>{booking.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] font-medium text-[#8E8E93] opacity-90">
                      <Calendar size={14} className="text-[#8E8E93]" />
                      {formatDateTime(booking.date)}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="!p-0 overflow-hidden">
                <EmptyState 
                  icon={Calendar} 
                  title="No upcoming bookings" 
                  description="Book your first walk to get started." 
                  actionLabel="Book a walk"
                  onAction={() => { onNavigate('services'); alert("Services - Opening"); }}
                />
              </Card>
            )}
          </section>

          {/* D) QuickActions */}
          <section className="grid grid-cols-3 gap-3">
            <Card variant="warm" clickable onClick={() => { onNavigate('services'); alert("Services > Walking - Coming soon"); }} className="!p-2.5 flex flex-col items-center justify-center gap-2 text-center aspect-square !rounded-[24px]">
              <div className="w-[40px] h-[40px] rounded-full bg-transparent flex items-center justify-center text-[#FF6B35] opacity-90">
                <PawPrint size={22} strokeWidth={2} />
              </div>
              <span className="text-[13px] font-medium text-[#111111]">Book Walk</span>
            </Card>
            <Card variant="warm" clickable onClick={() => alert("Photo picker - Coming soon")} className="!p-2.5 flex flex-col items-center justify-center gap-2 text-center aspect-square !rounded-[24px]">
              <div className="w-[40px] h-[40px] rounded-full bg-transparent flex items-center justify-center text-[#8E8E93] opacity-90">
                <Camera size={22} strokeWidth={2} />
              </div>
              <span className="text-[13px] font-medium text-[#111111]">Add Photo</span>
            </Card>
            <Card variant="warm" clickable onClick={() => setMedSheetOpen(true)} className="!p-2.5 flex flex-col items-center justify-center gap-2 text-center aspect-square !rounded-[24px]">
              <div className="w-[40px] h-[40px] rounded-full bg-transparent flex items-center justify-center text-[#8E8E93] opacity-90">
                <Pill size={22} strokeWidth={2} />
              </div>
              <span className="text-[13px] font-medium text-[#111111]">Log Med</span>
            </Card>
          </section>

          {/* E) Today's Reminders */}
          {filteredReminders.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[17px] font-semibold text-[#111111]">Today</h3>
                <button onClick={() => alert("Vault > Routines - Coming in Step 25")} className="flex items-center text-[14px] font-medium text-[#6E6E73] active:opacity-70">
                  View all <ChevronRight size={16} className="ml-0.5" />
                </button>
              </div>
              <div className="space-y-4">
                {filteredReminders.map(r => {
                  const isDone = completedReminders.has(r.id);
                  return (
                    <Card key={r.id} className="!p-4 flex items-center gap-3">
                      <div className={`w-[40px] h-[40px] rounded-full flex items-center justify-center text-[20px] shrink-0 transition-colors ${isDone ? 'bg-transparent grayscale opacity-50' : 'bg-[#F7F7F8]'}`}>
                        {r.icon}
                      </div>
                      <div className={`flex flex-col flex-1 min-w-0 transition-opacity duration-200 ${isDone ? 'opacity-60' : 'opacity-100'}`}>
                        <span className={`text-[15px] font-semibold truncate transition-colors duration-200 ${isDone ? 'text-[#8E8E93]' : 'text-[#111111]'}`}>{r.title}</span>
                        <span className="text-[13px] text-[#6E6E73]">{r.time}</span>
                      </div>
                      {isDone ? (
                        <div className="text-[13px] font-medium text-[#8E8E93] animate-in fade-in duration-200 flex items-center gap-1 opacity-80">
                          <CheckCircle2 size={14} /> Done
                        </div>
                      ) : (
                        <Button variant="ghost" size="small" fullWidth={false} onClick={() => handleCompleteReminder(r.id)} className="!py-1 !px-2.5 text-[12px] !rounded-[10px] text-[#8E8E93] font-medium border border-black/[0.06] hover:bg-black/[0.02]">
                          Done
                        </Button>
                      )}
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          {/* F) SuggestedServices */}
          {filteredSuggestions.length > 0 && (
            <section className="mt-6">
              <h3 className="text-[17px] font-semibold text-[#111111] mb-4">
                {MOCK_PETS.length === 1 ? `Suggested for ${selectedPet.name}` : 'Suggested'}
              </h3>
              <div className="space-y-4">
                {filteredSuggestions.slice(0, 2).map(s => (
                  <Card key={s.id} className="!p-4 flex items-center gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.015)] border-black/[0.03]">
                    <div className="w-[48px] h-[48px] rounded-full bg-[#F7F7F8] flex items-center justify-center text-[24px] shrink-0">
                      {s.icon}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[15px] font-semibold text-[#111111] truncate">{s.title}</span>
                      <span className="text-[13px] text-[#6E6E73] truncate">{s.context}</span>
                    </div>
                    <button 
                      onClick={() => { onNavigate('services'); alert(`Suggested Service - ${s.title}`); }}
                      className="text-[14px] font-medium text-[#FF6B35]/85 flex items-center gap-1 active:opacity-70 transition-opacity"
                    >
                      Book now <ArrowRight size={14} strokeWidth={2} />
                    </button>
                  </Card>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>

      {/* Med Sheet Form */}
      <BottomSheet isOpen={medSheetOpen} onClose={() => setMedSheetOpen(false)} title="Quick med log">
        <div className="space-y-6 pt-2">
          <TextInput 
            label="Medication Name" 
            placeholder="e.g. Heartworm chew" 
            value={medName}
            onChange={(e) => setMedName(e.target.value)}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setMedSheetOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleMedSave} disabled={!medName.trim()}>Save</Button>
          </div>
        </div>
      </BottomSheet>
      
      {/* Style for hiding scrollbar in PetSelector */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
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
      onAction={() => alert('Add Pet Action Triggered')}
    />
  </ScreenContainer>
);

const ServicesScreen = () => (
  <ScreenContainer>
    <EmptyState 
      icon={Calendar} 
      title="Services" 
      description="Book and manage appointments" 
    />
  </ScreenContainer>
);

const ActivityScreen = () => (
  <ScreenContainer>
    <EmptyState 
      icon={Activity} 
      title="Activity" 
      description="Journal and stats" 
    />
  </ScreenContainer>
);

const VaultScreen = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState('opt1');
  const [segment, setSegment] = useState(0);

  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-8">
        
        {/* Header Area */}
        <div className="pt-2">
          <Text variant="title" className="mb-1">Design System</Text>
          <Text variant="caption">Step 2: Component Library Sandbox</Text>
        </div>

        {/* Inputs */}
        <section className="space-y-4">
          <Text variant="label">Inputs & Forms</Text>
          <SearchInput 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue('')}
          />
          <TextInput label="Standard Input" placeholder="Enter text..." />
          <TextInput label="Error State" placeholder="Enter text..." error="This field is required" />
          <Select 
            label="Dropdown Select"
            value={selectValue}
            onChange={(e) => setSelectValue(e.target.value)}
            options={[
              { value: 'opt1', label: 'Option 1' },
              { value: 'opt2', label: 'Option 2' },
              { value: 'opt3', label: 'Option 3' }
            ]}
          />
        </section>

        {/* Buttons */}
        <section className="space-y-4">
          <Text variant="label">Buttons</Text>
          <Button variant="primary" icon={Star}>Primary Action</Button>
          <Button variant="secondary">Secondary Action</Button>
          <Button variant="destructive">Destructive Action</Button>
          <div className="flex gap-3">
            <Button variant="primary" isLoading>Loading</Button>
            <Button variant="secondary" disabled>Disabled</Button>
          </div>
          <Button variant="primary" onClick={() => setSheetOpen(true)}>Open Bottom Sheet</Button>
        </section>

        {/* Segmented Control */}
        <section className="space-y-4">
          <Text variant="label">Segmented Control</Text>
          <SegmentedControl 
            segments={['Upcoming', 'Past', 'Cancelled']} 
            activeIndex={segment}
            onChange={setSegment}
          />
        </section>

        {/* Avatars & Badges */}
        <section className="space-y-4">
          <Text variant="label">Identity & Badges</Text>
          <div className="flex items-center gap-4 flex-wrap">
            <Avatar size={64} src="https://i.pravatar.cc/150?u=alex_fylos" badge="3" />
            <Avatar size={48} initials="JD" badgeColor={THEME.colors.success} badge="" />
            <Avatar size={32} initials="MK" />
            
            <div className="flex flex-col gap-2 ml-auto items-end">
              <Badge variant="count">12</Badge>
              <Badge variant="success">Active</Badge>
              <Badge variant="warning">Pending</Badge>
              <Badge variant="error">Alert</Badge>
            </div>
          </div>
        </section>

        {/* List Rows & Cards */}
        <section className="space-y-4">
          <Text variant="label">Lists & Cards</Text>
          <Card clickable className="!p-0 overflow-hidden">
            <ListRow 
              icon={Calendar} 
              title="Vet Appointment" 
              subtitle="Tomorrow, 10:00 AM" 
              rightAccessory={<ChevronRight size={20} />}
              className="px-5 py-4 hover:bg-[#F7F7F8]"
            />
            <Divider spacing="small" className="!my-0 ml-16" />
            <ListRow 
              avatar={{ initials: 'Dr', size: 40 }} 
              title="Dr. Smith" 
              subtitle="General Checkup" 
              rightAccessory={<Button variant="secondary" size="small" fullWidth={false}>View</Button>}
              className="px-5 py-4 hover:bg-[#F7F7F8]"
            />
          </Card>
          
          <Card variant="highlighted">
            <Text variant="subtitle" className="mb-1">Vaccination Due</Text>
            <Text variant="body" className="text-[#6E6E73] mb-4">Max needs his annual rabies shot.</Text>
            <Button variant="primary" size="small" fullWidth={false}>Book Now</Button>
          </Card>
        </section>

        {/* Notices & Skeletons */}
        <section className="space-y-4">
          <Text variant="label">Notices & Loading</Text>
          <InlineNotice variant="info" title="Update Available" description="A new version of the app is ready." />
          <InlineNotice variant="error" description="Network connection lost." />
          
          <div className="flex gap-4 items-center p-4 border border-black/[0.04] rounded-[20px]">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </section>

      </div>

      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Quick Actions">
        <div className="space-y-6 pt-2">
          <Text variant="body" className="text-[#6E6E73]">
            This bottom sheet slides up above the floating header and tab dock, respecting the z-index philosophy. You can drag it down to close.
          </Text>
          <TextInput placeholder="Confirm your password..." type="password" />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setSheetOpen(false)}>Confirm</Button>
          </div>
        </div>
      </BottomSheet>
    </ScreenContainer>
  );
};

// --- APP SHELL (MAIN ENTRY POINT) ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [displayTab, setDisplayTab] = useState('home');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial App Load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Smooth Tab Transitions
  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return; // Prevent re-render flash
    
    setActiveTab(tabId);
    setIsFading(true);
    
    setTimeout(() => {
      setDisplayTab(tabId);
      setIsFading(false);
    }, 150);
  };

  const renderScreen = () => {
    switch (displayTab) {
      case 'home': return <HomeScreen onNavigate={handleTabChange} />;
      case 'pets': return <PetsScreen />;
      case 'services': return <ServicesScreen />;
      case 'activity': return <ActivityScreen />;
      case 'vault': return <VaultScreen />;
      default: return <HomeScreen onNavigate={handleTabChange} />;
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'home') return 'FYLOS';
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? tab.label : 'FYLOS';
  };

  return (
    // Outer Wrapper: Simulates the desktop testing environment
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

      {/* iPhone 14/15 Pro Frame Wrapper (390x844) */}
      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
        
        {/* Dynamic Island Hardware Mock */}
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {/* State 1: Splash / Loading App */}
        {isLoading ? (
          <div className="absolute inset-0 bg-[#FFFFFF] z-50 flex flex-col items-center justify-center animate-out fade-out duration-500 fill-mode-forwards delay-700">
            <FylosLogo fontSize="32px" textColor="#111111" className="mb-3" />
            <p className="text-[14px] text-[#8E8E93] animate-pulse">Loading...</p>
          </div>
        ) : (
          
          /* State 2: Main Application Shell */
          <>
            {/* Screen Content Wrapper (with fade transition) */}
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
              variant="default"
              user={MOCK_USER} 
            />
            
            <TabBar 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
            
            {/* Inner Portal Root for Overlays (κρατάει το BottomSheet μέσα στο iPhone) */}
            <div id="fylos-portal-root" className="absolute inset-0 z-[100] pointer-events-none" />
          </>
        )}
      </div>
    </div>
  );
}