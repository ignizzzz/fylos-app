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
  MapPin,
  SlidersHorizontal,
  Check,
  Zap,
  ShieldCheck,
  Award
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

const MOCK_PETS = [
  { id: 1, name: 'Luna', breed: 'Golden Retriever', avatar: 'https://i.pravatar.cc/150?u=luna_dog' },
  { id: 2, name: 'Max', breed: 'German Shepherd', avatar: 'https://i.pravatar.cc/150?u=max_dog' }
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

const Button = ({ children, variant = 'primary', size = 'medium', fullWidth = true, icon: Icon, isLoading, disabled, className = '', onClick, ...props }) => {
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
      onClick={onClick}
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

const Card = ({ variant = 'default', clickable, children, className = '', onClick, ...props }) => {
  const baseStyles = "rounded-[20px] p-5 transition-all duration-200";
  const variants = {
    default: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
    highlighted: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-[4px] border-l-[#FF6B35]",
    grey: "bg-[#F7F7F8]"
  };
  const interactive = clickable ? "cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] active:scale-[0.98]" : "";
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${interactive} ${className}`} onClick={onClick} {...props}>
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

// --- TRUE NATIVE BOTTOM SHEET ---
const BottomSheet = ({ isOpen, onClose, title, children, footer }) => {
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
    if (translateY > 100) onClose();
    else setTranslateY(0);
  };

  if (!render || !portalNode) return null;

  return createPortal(
    <div className="absolute inset-0 z-[100] overflow-hidden pointer-events-auto flex flex-col justify-end">
      {/* Dim overlay that doesn't completely black out the background */}
      <div 
        className={`absolute inset-0 bg-black/15 transition-opacity duration-300 backdrop-blur-[2px] ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
        style={{ touchAction: 'none' }}
      />
      
      {/* The Sheet Container */}
      <div 
        className="relative w-full bg-[#FFFFFF] rounded-t-[28px] flex flex-col shadow-[0_-16px_40px_rgba(0,0,0,0.12)] max-h-[90vh] mt-auto"
        style={{ 
          transform: `translateY(${!visible ? '100%' : `${translateY}px`})`,
          transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)'
        }}
      >
        {/* Subtle top edge highlight */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/60 rounded-t-[28px] pointer-events-none" />
        
        {/* Drag Handle Area */}
        <div 
          className="w-full flex justify-center pt-3 pb-3 cursor-grab active:cursor-grabbing touch-none shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-9 h-1 bg-[#D4D4D4] rounded-full" />
        </div>
        
        {/* Sticky Title */}
        {title && (
          <div className="px-6 pb-4 shrink-0">
            <h3 className="text-[20px] font-bold text-[#111111]">{title}</h3>
          </div>
        )}

        {/* Scrollable Inner Content */}
        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 relative">
          {children}
        </div>

        {/* Fixed Footer Row */}
        {footer && (
          <div className="px-6 py-4 bg-[#FFFFFF] border-t border-black/[0.06] shrink-0 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {footer}
          </div>
        )}
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

const EmptyState = ({ icon: Icon, illustration, title, description, actionLabel, onAction, secondaryActionLabel, onSecondaryAction }) => (
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
    <div className="flex flex-col w-full gap-3 items-center">
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction} fullWidth={false} className="min-w-[160px]">
          {actionLabel}
        </Button>
      )}
      {secondaryActionLabel && onSecondaryAction && (
        <Button variant="secondary" onClick={onSecondaryAction} fullWidth={false} className="min-w-[160px] border-none shadow-none">
          {secondaryActionLabel}
        </Button>
      )}
    </div>
  </div>
);

/**
 * Header Component (Floating Pills System)
 */
const Header = ({ title, variant = 'default', user, onBack, rightActions }) => {
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

      {variant === 'detail' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button 
            onClick={onBack || (() => handleAction('Back'))}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          <h2 className="text-[17px] font-semibold text-[#111111]">{title}</h2>
          
          {rightActions ? (
            <div className="flex items-center bg-[#FFFFFF] border border-black/[0.06] rounded-full p-1 h-[36px]">
              {rightActions}
            </div>
          ) : (
            <button 
              onClick={() => handleAction('Menu')}
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <MoreHorizontal size={22} color="#111111" />
            </button>
          )}
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
const ScreenContainer = ({ children, padding = "pt-[110px] pb-[120px]" }) => {
  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#FFFFFF] custom-scrollbar">
      <div className={`min-h-full ${padding}`}>
        {children}
      </div>
    </div>
  );
};

// --- SCREENS ---

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

const ServicesScreen = ({ onNavigate }) => {
  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-8 pt-2">
        
        {/* 1. UPCOMING BOOKINGS (Dynamic) */}
        {MOCK_UPCOMING_BOOKINGS.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <Text variant="subtitle">Upcoming</Text>
              <button className="text-[13px] font-semibold text-[#8E8E93] flex items-center gap-1 active:opacity-70 transition-opacity">
                My Bookings <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {MOCK_UPCOMING_BOOKINGS.slice(0, 2).map(booking => (
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

        {/* 2. CATEGORIES (Horizontal Scroll) */}
        <section className="space-y-4">
           <Text variant="subtitle">Categories</Text>
           <div className="flex gap-3 overflow-x-auto custom-scrollbar -mx-5 px-5 pb-2">
             {MOCK_CATEGORIES.map(cat => {
               const Icon = cat.icon;
               return (
                 <button
                   key={cat.id}
                   onClick={() => cat.id === 'walking' && onNavigate('services/walking')}
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
              <Card key={provider.id} clickable className="!p-4">
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

// --- STEP 10: WALKING CATEGORY SCREEN ---

const MOCK_WALKERS = [
  { id: 101, name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?u=sarah', rating: 4.9, reviews: 124, price: 45, walks: 312, availability: 'today', bio: 'Experienced walker in the heart of Zurich. I love all dog sizes and energy levels.', badges: ['Verified', 'Insured', 'First Aid'], location: 'Zürich', experience: 5, certs: ['Insurance Verified', 'First Aid Certified'] },
  { id: 102, name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=mike', rating: 4.8, reviews: 89, price: 55, walks: 240, availability: 'tomorrow', bio: 'Specialist in energetic breeds. Regular routes around the lake and forest trails.', badges: ['Verified', 'Training'], location: 'Zürich', experience: 3, certs: ['Background Check', 'Professional Training'] },
  { id: 103, name: 'Elena Rossi', avatar: 'https://i.pravatar.cc/150?u=elena', rating: 5.0, reviews: 42, price: 40, walks: 95, availability: 'today', bio: 'Calm and patient. Perfect for senior dogs or puppies needing gentle walks.', badges: ['Verified'], location: 'Basel', experience: 1, certs: ['Background Check'] },
  { id: 104, name: 'David Schmidt', avatar: 'https://i.pravatar.cc/150?u=david', rating: 4.6, reviews: 210, price: 35, walks: 540, availability: 'booked', bio: 'Full-time dog walker with a pack-walking approach for maximum socialization.', badges: ['Insured', 'First Aid'], location: 'Zürich', experience: 8, certs: ['Insurance Verified', 'First Aid Certified'] },
  { id: 105, name: 'Anna Weber', avatar: 'https://i.pravatar.cc/150?u=anna', rating: 4.9, reviews: 18, price: 60, walks: 45, availability: 'this-week', bio: 'Premium one-on-one attention. Photography included with every walk!', badges: ['Verified', 'Insured'], location: 'Geneva', experience: 2, certs: ['Insurance Verified'] },
  { id: 106, name: 'Lukas Meyer', avatar: 'https://i.pravatar.cc/150?u=lukas', rating: 4.7, reviews: 156, price: 50, walks: 420, availability: 'today', bio: 'Reliable and punctual. I treat your pets like my own family.', badges: ['Verified', 'Background Check'], location: 'Lausanne', experience: 4, certs: ['Background Check'] },
  { id: 107, name: 'Julia Keller', avatar: 'https://i.pravatar.cc/150?u=julia', rating: 4.5, reviews: 67, price: 30, walks: 150, availability: 'tomorrow', bio: 'Affordable and flexible walks focused on basic obedience.', badges: ['Training'], location: 'Zürich', experience: 1, certs: ['Professional Training'] },
  { id: 108, name: 'Tom Huber', avatar: 'https://i.pravatar.cc/150?u=tom', rating: 4.8, reviews: 310, price: 70, walks: 890, availability: 'booked', bio: 'Expert in large and reactive dogs. Safety is my number one priority.', badges: ['Verified', 'Insured', 'Training'], location: 'Basel', experience: 10, certs: ['Insurance Verified', 'Professional Training', 'Background Check'] },
  { id: 109, name: 'Sophie Martin', avatar: 'https://i.pravatar.cc/150?u=sophie', rating: 4.9, reviews: 92, price: 48, walks: 210, availability: 'today', bio: 'Veterinary assistant turned full-time walker. Your pet is in safe hands.', badges: ['First Aid', 'Verified'], location: 'Geneva', experience: 3, certs: ['First Aid Certified', 'Background Check'] },
  { id: 110, name: 'Marco Bianchi', avatar: 'https://i.pravatar.cc/150?u=marco', rating: 4.4, reviews: 25, price: 35, walks: 80, availability: 'this-week', bio: 'Active runner looking for energetic dogs to accompany me on trail runs.', badges: ['Insured'], location: 'Lausanne', experience: 1, certs: ['Insurance Verified'] },
  { id: 111, name: 'Nina Fischer', avatar: 'https://i.pravatar.cc/150?u=nina', rating: 5.0, reviews: 11, price: 42, walks: 30, availability: 'today', bio: 'New to FYLOS but grew up with dogs all my life. Eager to meet your furry friend!', badges: ['Verified'], location: 'Zürich', experience: 1, certs: ['Background Check'] },
  { id: 112, name: 'Stefan Wolf', avatar: 'https://i.pravatar.cc/150?u=stefan', rating: 4.7, reviews: 180, price: 65, walks: 500, availability: 'tomorrow', bio: 'Professional dog trainer offering structured walks to reinforce good behavior.', badges: ['Training', 'Verified', 'Insured'], location: 'Zürich', experience: 6, certs: ['Professional Training', 'Insurance Verified', 'Background Check'] },
];

const SORTS = ['Recommended', 'Price: Low', 'Price: High', 'Top Rated', 'Available Now'];

const WalkingScreen = ({ onBack }) => {
  const [activeSort, setActiveSort] = useState('Recommended');
  const [activePetId, setActivePetId] = useState(MOCK_PETS[0].id);
  const [isPetSheetOpen, setIsPetSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    availability: 'Anytime',
    minRating: 0,
    certs: [],
    experience: 'Any'
  });
  
  const [appliedFilters, setAppliedFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    availability: 'Anytime',
    minRating: 0,
    certs: [],
    experience: 'Any'
  });
  
  const [visibleCount, setVisibleCount] = useState(10);
  const loaderRef = useRef(null);

  // Apply infinite scroll logic
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisibleCount(prev => prev + 5);
      }
    }, { threshold: 0.1 });
    
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setIsFilterSheetOpen(false);
    setVisibleCount(10);
  };

  const handleClearFilters = () => {
    const cleared = { location: '', minPrice: '', maxPrice: '', availability: 'Anytime', minRating: 0, certs: [], experience: 'Any' };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setIsFilterSheetOpen(false);
    setVisibleCount(10);
  };

  const removeFilter = (key) => {
    const newFilters = { ...appliedFilters };
    if (key === 'certs') newFilters.certs = [];
    else if (key === 'availability') newFilters.availability = 'Anytime';
    else if (key === 'experience') newFilters.experience = 'Any';
    else if (key === 'minRating') newFilters.minRating = 0;
    else newFilters[key] = '';
    
    if (!newFilters.certs) newFilters.certs = []; // Safeguard
    
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const activePet = MOCK_PETS.find(p => p.id === activePetId);

  // Derive active filter chips
  const filterChips = [];
  if (appliedFilters.location) filterChips.push({ key: 'location', label: `📍 ${appliedFilters.location}` });
  if (appliedFilters.availability && appliedFilters.availability !== 'Anytime') filterChips.push({ key: 'availability', label: appliedFilters.availability });
  if (appliedFilters.minRating > 0) filterChips.push({ key: 'minRating', label: `⭐ ${appliedFilters.minRating}+` });
  if (appliedFilters.minPrice || appliedFilters.maxPrice) {
    const min = appliedFilters.minPrice || '0';
    const max = appliedFilters.maxPrice || '∞';
    filterChips.push({ key: 'price', label: `CHF ${min}-${max}` });
  }
  if (appliedFilters.experience && appliedFilters.experience !== 'Any') filterChips.push({ key: 'experience', label: `Exp: ${appliedFilters.experience}` });
  if (appliedFilters.certs) {
    appliedFilters.certs.forEach(cert => {
      filterChips.push({ key: 'certs', label: cert }); // simplified removal
    });
  }

  // Filter & Sort Data
  let processedWalkers = MOCK_WALKERS.filter(w => {
    if (appliedFilters.location && !w.location.toLowerCase().includes(appliedFilters.location.toLowerCase())) return false;
    if (appliedFilters.minPrice && w.price < parseInt(appliedFilters.minPrice)) return false;
    if (appliedFilters.maxPrice && w.price > parseInt(appliedFilters.maxPrice)) return false;
    if (appliedFilters.minRating && w.rating < appliedFilters.minRating) return false;
    if (appliedFilters.availability && appliedFilters.availability !== 'Anytime' && appliedFilters.availability !== 'This Week') {
      if (appliedFilters.availability === 'Today' && w.availability !== 'today') return false;
    }
    if (appliedFilters.experience === '1+ years' && w.experience < 1) return false;
    if (appliedFilters.experience === '3+ years' && w.experience < 3) return false;
    if (appliedFilters.experience === '5+ years' && w.experience < 5) return false;
    if (appliedFilters.certs && appliedFilters.certs.length > 0) {
      const hasAllCerts = appliedFilters.certs.every(c => w.certs.includes(c));
      if (!hasAllCerts) return false;
    }
    return true;
  });

  processedWalkers.sort((a, b) => {
    if (activeSort === 'Price: Low') return a.price - b.price;
    if (activeSort === 'Price: High') return b.price - a.price;
    if (activeSort === 'Top Rated') return b.rating - a.rating;
    if (activeSort === 'Available Now') {
      const getVal = avail => avail === 'today' ? 1 : avail === 'tomorrow' ? 2 : 3;
      return getVal(a.availability) - getVal(b.availability);
    }
    // Recommended (Rating & Popularity proxy)
    const scoreA = (a.rating * 0.5) + (a.walks * 0.01);
    const scoreB = (b.rating * 0.5) + (b.walks * 0.01);
    return scoreB - scoreA;
  });

  const activeFilterCount = filterChips.length;

  return (
    <>
      <Header 
        title="Walking" 
        variant="detail" 
        onBack={onBack}
        rightActions={
          <>
            <button className="w-7 h-7 flex items-center justify-center rounded-full active:bg-black/[0.04] transition-colors">
              <Search size={15} color="#111111" strokeWidth={1.5} />
            </button>
            <div className="w-[1px] h-3 bg-black/[0.08] mx-1.5" />
            <button 
              onClick={() => setIsFilterSheetOpen(true)}
              className="relative w-7 h-7 flex items-center justify-center rounded-full active:bg-black/[0.04] transition-colors"
            >
              <SlidersHorizontal size={15} color="#111111" strokeWidth={1.5} />
              {activeFilterCount > 0 && (
                <span className="absolute top-[0px] right-[0px] min-w-[12px] h-[12px] flex items-center justify-center bg-[#FF6B35] text-white text-[8px] font-bold rounded-full border border-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </>
        }
      />

      <ScreenContainer>
        
        {/* Active Pet Indicator (Conditional) */}
        {MOCK_PETS.length > 1 && (
          <div className="px-5 mb-4">
            <button 
              onClick={() => setIsPetSheetOpen(true)}
              className="flex items-center gap-2 bg-[#F7F7F8] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors rounded-full px-3 py-1.5 border border-black/[0.04] w-fit"
            >
              <img src={activePet.avatar} alt={activePet.name} className="w-5 h-5 rounded-full object-cover" />
              <span className="text-[13px] font-semibold text-[#111111]">{activePet.name}</span>
              <span className="text-[13px] text-[#8E8E93]">· {activePet.breed}</span>
              <ChevronDown size={14} className="text-[#8E8E93] ml-1" />
            </button>
          </div>
        )}

        {/* Sort Tabs */}
        <div className="flex gap-2.5 overflow-x-auto custom-scrollbar px-5 pb-4">
          {SORTS.map(s => (
            <button 
              key={s}
              onClick={() => setActiveSort(s)}
              className={`px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${activeSort === s ? 'bg-[#FF825C] text-white shadow-none' : 'bg-[#FFFFFF] text-[#6E6E73] border border-black/[0.06] hover:bg-[#F7F7F8]'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Active Filter Chips */}
        {filterChips.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 pb-4">
            {filterChips.map((chip, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-[#FFF4F0] border border-[#FF6B35]/20 text-[#FF6B35] px-3 py-1.5 rounded-full text-[13px] font-semibold">
                {chip.label}
                <button onClick={() => removeFilter(chip.key)} className="p-0.5 rounded-full hover:bg-black/5 active:bg-black/10">
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Provider List */}
        <div className="px-5 space-y-5 pb-24">
          {processedWalkers.length === 0 ? (
            <EmptyState 
              icon={Search} 
              title="No walkers found" 
              description="Try adjusting your filters or search in a different area."
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
            />
          ) : (
            processedWalkers.slice(0, visibleCount).map((provider) => {
              const availabilityStyles = {
                'today': { bg: 'bg-[#F2FCF5]', text: 'text-[#2E8B47]', icon: CheckCircle2, label: 'Available today' },
                'tomorrow': { bg: 'bg-[#FFF8F0]', text: 'text-[#C27300]', icon: Clock, label: 'Next: Tomorrow' },
                'this-week': { bg: 'bg-[#F4F4F5]', text: 'text-[#6E6E73]', icon: Calendar, label: 'Available this week' },
                'booked': { bg: 'bg-[#FFF2F2]', text: 'text-[#C93636]', icon: AlertCircle, label: 'Fully booked' }
              };
              const avail = availabilityStyles[provider.availability];
              const AvailIcon = avail.icon;

              return (
              <Card key={provider.id} clickable className="!p-4 border border-black/[0.04] shadow-none hover:border-black/[0.08] rounded-[20px]">
                {/* Header Row */}
                <div className="flex items-start gap-4 mb-3">
                  <Avatar src={provider.avatar} size={56} />
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h4 className="font-semibold text-[#111111] text-[17px] truncate leading-tight">{provider.name}</h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star size={12} className="fill-[#FF6B35] text-[#FF6B35]" />
                      <span className="text-[13px] font-bold text-[#111111]">{provider.rating}</span>
                      <span className="text-[13px] text-[#8E8E93]">({provider.reviews} reviews)</span>
                    </div>
                  </div>
                </div>

                {/* Stats & Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[14px] font-medium text-[#111111]">{provider.walks} walks</span>
                  <span className="text-[#E5E5E5]">•</span>
                  <span className="text-[14px] font-medium text-[#111111]">CHF {provider.price} · 90 min</span>
                </div>

                {/* Availability Row */}
                <div className={`flex items-center gap-1 mb-3 w-fit h-[22px] px-2 rounded-md ${avail.bg}`}>
                  <AvailIcon size={10} className={avail.text} strokeWidth={2.5} />
                  <span className={`text-[11px] font-medium leading-none ${avail.text}`}>{avail.label}</span>
                </div>

                {/* Bio Preview */}
                <p className="text-[14px] text-[#6E6E73] leading-relaxed line-clamp-2 mb-4">
                  {provider.bio}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {provider.badges.slice(0, 3).map((badge, idx) => (
                    <span key={idx} className="flex items-center gap-1 h-[20px] px-1.5 bg-black/[0.03] text-[#6E6E73] text-[11px] font-medium rounded tracking-normal">
                      {badge === 'Verified' && <ShieldCheck size={10} />}
                      {badge === 'Training' && <Award size={10} />}
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Action */}
                <Button variant="secondary" fullWidth className="!py-3 border-black/[0.08]">
                  Book Now
                </Button>
              </Card>
            );
          })
        )}
          
          {/* Infinite Scroll Anchor */}
          {visibleCount < processedWalkers.length && (
            <div ref={loaderRef} className="py-6 flex justify-center">
              <Spinner size="small" color="grey" />
            </div>
          )}
        </div>
      </ScreenContainer>

      {/* Quick Book FAB (Elevated 16px above 72px tab bar = bottom-[116px]) */}
      <div className="absolute bottom-[116px] left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <button className="bg-[#1C1C1E]/95 backdrop-blur-md border border-white/10 text-white h-[44px] px-6 min-w-[140px] rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] font-medium flex items-center justify-center gap-2 active:scale-95 transition-all duration-200">
          <Zap size={15} className="fill-white" />
          <span className="text-[14px] whitespace-nowrap">Quick Book</span>
        </button>
      </div>

      {/* Select Pet Bottom Sheet */}
      <BottomSheet isOpen={isPetSheetOpen} onClose={() => setIsPetSheetOpen(false)} title="Select Pet">
        <div className="space-y-3 pt-2">
          {MOCK_PETS.map(pet => (
            <div 
              key={pet.id} 
              onClick={() => { setActivePetId(pet.id); setIsPetSheetOpen(false); }}
              className={`flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-all duration-200 active:scale-95 border-[1.5px] ${activePetId === pet.id ? 'border-[#FF6B35] bg-[#FFF4F0]' : 'border-transparent bg-[#F7F7F8]'}`}
            >
              <Avatar src={pet.avatar} size={48} />
              <div className="flex-1">
                <h4 className="text-[16px] font-semibold text-[#111111]">{pet.name}</h4>
                <p className="text-[13px] text-[#6E6E73]">{pet.breed}</p>
              </div>
              {activePetId === pet.id && <CheckCircle2 className="text-[#FF6B35]" size={24} />}
            </div>
          ))}
        </div>
      </BottomSheet>

      {/* Filter Bottom Sheet */}
      <BottomSheet 
        isOpen={isFilterSheetOpen} 
        onClose={() => setIsFilterSheetOpen(false)} 
        title="Filters"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClearFilters} className="flex-none w-[100px] !py-[12px] bg-[#F7F7F8] border-none text-[15px]">Clear</Button>
            <Button variant="primary" onClick={handleApplyFilters} className="flex-1 !py-[12px] shadow-none bg-[#FF6B35] hover:bg-[#E85D2A] text-[15px]">Show Results</Button>
          </div>
        }
      >
        <div className="space-y-10 pt-2">
          
          {/* Location */}
          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Location</h4>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" size={18} />
              <input 
                type="text" 
                placeholder="City or zip code" 
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full h-[52px] pl-11 pr-4 bg-[#F7F7F8] border border-transparent focus:bg-[#FFFFFF] focus:border-[#FF6B35] rounded-2xl text-[16px] outline-none transition-all"
              />
            </div>
          </section>

          {/* Price Range */}
          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Price Range (CHF)</h4>
            <div className="flex gap-4 items-center">
              <TextInput 
                placeholder="Min" 
                type="number" 
                value={filters.minPrice} 
                onChange={e => setFilters({...filters, minPrice: e.target.value})}
              />
              <div className="w-4 h-[1px] bg-[#CFCFD4] shrink-0" />
              <TextInput 
                placeholder="Max" 
                type="number" 
                value={filters.maxPrice} 
                onChange={e => setFilters({...filters, maxPrice: e.target.value})}
              />
            </div>
          </section>

          {/* Availability */}
          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Availability</h4>
            <div className="flex flex-col gap-2">
              {['Anytime', 'Today', 'This Week'].map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F7F8] active:bg-[#F0F0F2] cursor-pointer transition-colors">
                  <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center ${filters.availability === opt ? 'border-[#FF6B35]' : 'border-[#CFCFD4]'}`}>
                    {filters.availability === opt && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />}
                  </div>
                  <span className="text-[15px] text-[#111111]">{opt}</span>
                </label>
              ))}
            </div>
          </section>

          {/* Minimum Rating */}
          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Minimum Rating</h4>
            <div className="flex gap-2">
              {[3.0, 3.5, 4.0, 4.5, 5.0].map(rating => (
                <button 
                  key={rating}
                  onClick={() => setFilters({...filters, minRating: filters.minRating === rating ? 0 : rating})}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border-[1.5px] transition-all font-semibold text-[14px] ${filters.minRating === rating ? 'border-[#FF6B35] bg-[#FFF4F0] text-[#FF6B35]' : 'border-black/[0.08] bg-[#FFFFFF] text-[#111111]'}`}
                >
                  <Star size={14} className={filters.minRating === rating ? "fill-[#FF6B35]" : "fill-transparent"} />
                  {rating === 5.0 ? '5.0' : `${rating}+`}
                </button>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Experience</h4>
            <SegmentedControl 
              segments={['Any', '1+ years', '3+ years', '5+ years']} 
              activeIndex={['Any', '1+ years', '3+ years', '5+ years'].indexOf(filters.experience)}
              onChange={(idx) => setFilters({...filters, experience: ['Any', '1+ years', '3+ years', '5+ years'][idx]})}
            />
          </section>

          {/* Certifications */}
          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Certifications</h4>
            <div className="flex flex-col gap-2">
              {['Insurance Verified', 'Background Check', 'First Aid Certified', 'Professional Training'].map(cert => {
                const isChecked = filters.certs?.includes(cert) || false;
                return (
                  <label 
                    key={cert} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F7F8] active:bg-[#F0F0F2] cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      const currentCerts = filters.certs || [];
                      const newCerts = isChecked ? currentCerts.filter(c => c !== cert) : [...currentCerts, cert];
                      setFilters({...filters, certs: newCerts});
                    }}
                  >
                    <div className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-colors ${isChecked ? 'bg-[#FF6B35] border-[#FF6B35]' : 'border-[#CFCFD4] bg-white'}`}>
                      {isChecked && <Check size={14} color="white" strokeWidth={3} />}
                    </div>
                    <span className="text-[15px] text-[#111111]">{cert}</span>
                  </label>
                )
              })}
            </div>
          </section>
        </div>
      </BottomSheet>
    </>
  );
};


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
        <div className="pt-2">
          <Text variant="title" className="mb-1">Design System</Text>
          <Text variant="caption">Step 2: Component Library Sandbox</Text>
        </div>

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

        <section className="space-y-4">
          <Text variant="label">Segmented Control</Text>
          <SegmentedControl 
            segments={['Upcoming', 'Past', 'Cancelled']} 
            activeIndex={segment}
            onChange={setSegment}
          />
        </section>

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
  // activeTab controls the Bottom Dock Nav highlight
  const [activeTab, setActiveTab] = useState('home');
  // displayTab controls what screen is literally shown (allows sub-routing)
  const [displayTab, setDisplayTab] = useState('home');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // For sub-screen navigation within the same Tab logic
  const navigateTo = (routeId) => {
    setIsFading(true);
    setTimeout(() => {
      setDisplayTab(routeId);
      setIsFading(false);
    }, 150);
  };

  const handleTabChange = (tabId) => {
    if (tabId === activeTab && displayTab === tabId) return;
    setActiveTab(tabId);
    navigateTo(tabId);
  };

  const renderScreen = () => {
    switch (displayTab) {
      case 'home': return <HomeScreen />;
      case 'pets': return <PetsScreen />;
      case 'services': return <ServicesScreen onNavigate={navigateTo} />;
      case 'services/walking': return <WalkingScreen onBack={() => navigateTo('services')} />;
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

  // Hide the Global App Header if the screen provides its own custom header (e.g. WalkingScreen)
  const hideGlobalHeader = displayTab === 'services/walking';

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
            
            {!hideGlobalHeader && (
              <Header 
                title={getHeaderTitle()} 
                variant="default"
                user={MOCK_USER} 
              />
            )}
            
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