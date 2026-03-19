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
  CreditCard
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

const Button = ({ children, variant = 'primary', size = 'medium', fullWidth = true, icon: Icon, isLoading, disabled, className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2";
  
  const variants = {
    // Overridden shadow for primary as per feedback (0 4px 12px rgba(0,0,0,0.08))
    primary: "bg-[#FF6B35] text-white shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:bg-[#E85D2A]",
    secondary: "bg-[#FFFFFF] text-[#111111] border border-[#E5E5E5] hover:bg-[#F7F7F8] shadow-sm",
    tertiary: "bg-transparent text-[#6E6E73] hover:bg-[#F7F7F8] hover:text-[#111111]",
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
    grey: "bg-[#F9F9F9] border border-[#E5E5E5]"
  };
  const interactive = clickable ? "cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] active:scale-[0.98]" : "";
  
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
    return () => { document.body.style.overflow = originalOverflow; };
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
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      setRender(true);
      window.addEventListener('keydown', handleEsc);
      const raf = requestAnimationFrame(() => { setTimeout(() => setVisible(true), 10); });
      return () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', handleEsc); };
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => { clearTimeout(timer); window.removeEventListener('keydown', handleEsc); };
    }
  }, [isOpen, onClose]);

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; setTranslateY(0); };
  const handleTouchMove = (e) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setTranslateY(delta);
  };
  const handleTouchEnd = () => { if (translateY > 80) onClose(); else setTranslateY(0); };

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
const ScreenContainer = ({ children, hidePadding = false }) => {
  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#FFFFFF] custom-scrollbar">
      <div className={`min-h-full ${hidePadding ? '' : 'pt-[110px] pb-[120px]'}`}>
        {children}
      </div>
    </div>
  );
};

// --- SCREENS ---

const HomeScreen = () => {
  // Demo screen content
  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-8 pt-2">
        <Text variant="title" className="mb-1">Home</Text>
        <p className="text-[15px] text-[#6E6E73]">Welcome to FYLOS.</p>
        <EmptyState icon={Home} title="Dashboard" description="Your pet's daily summary will appear here." />
      </div>
    </ScreenContainer>
  );
};

const PetsScreen = () => (
  <ScreenContainer>
    <EmptyState icon={PawPrint} title="Pets" description="Profiles, health, and sharing" actionLabel="Add Pet" />
  </ScreenContainer>
);

const ServicesScreen = () => (
  <ScreenContainer>
    <div className="px-5 pb-8 space-y-8 pt-2">
      <Text variant="title" className="mb-1">Services</Text>
      <EmptyState icon={Calendar} title="No Bookings" description="Find a dog walker or sitter nearby." />
    </div>
  </ScreenContainer>
);

const ActivityScreen = () => (
  <ScreenContainer>
    <EmptyState icon={Activity} title="Activity" description="Journal and stats" />
  </ScreenContainer>
);

const VaultScreen = ({ setDisplayTab }) => {
  // Sandbox entry to trigger the new screen
  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-8 pt-2">
        <div>
          <Text variant="title" className="mb-1">Vault Sandbox</Text>
          <Text variant="caption">Screen Prototypes</Text>
        </div>
        
        <Card clickable onClick={() => setDisplayTab('booking-confirmed')} className="border-l-[4px] border-l-[#00C060]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#EAF7EF] text-[#00C060] rounded-full flex items-center justify-center">
                <CheckCircle2 size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="font-semibold text-[#111111]">Step 17: Booking Accepted</h4>
                <p className="text-[13px] text-[#6E6E73]">View Celebration Screen</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-[#CFCFD4]" />
          </div>
        </Card>
      </div>
    </ScreenContainer>
  );
};

// --- STEP 17: BOOKING CONFIRMED SCREEN ---
const BookingConfirmedScreen = ({ onClose, showToast }) => {
  
  const handleMessage = () => {
    // Navigate to chat
    showToast("Opening chat with Lukas...");
  };

  const handleCalendar = () => {
    // Add to calendar action
    showToast("✓ Added to calendar");
  };

  const handleDone = () => {
    // Navigate back to home or details
    showToast("🎉 Walk confirmed for Feb 24!");
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-[#FFFFFF] z-50 overflow-y-auto overflow-x-hidden custom-scrollbar">
      
      {/* Subtle Confetti Animation via CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatDown {
          0% { transform: translateY(-20px) rotate(0deg) scale(0.8); opacity: 0; }
          15% { opacity: 1; transform: translateY(10px) rotate(45deg) scale(1); }
          80% { opacity: 1; }
          100% { transform: translateY(120px) rotate(180deg) scale(0.5); opacity: 0; }
        }
        .confetti-piece { animation: floatDown 3s ease-out forwards; }
        
        @keyframes subtleScaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-subtle-scale { animation: subtleScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}} />

      {/* Confetti Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center z-0">
        {[...Array(8)].map((_, i) => (
          <div key={`confetti-${i}`} className="confetti-piece absolute w-2 h-2 rounded-[2px]"
               style={{
                 backgroundColor: ['#FF6B35', '#00C060', '#007AFF', '#FF9500'][i % 4],
                 left: `${20 + (i * 8)}%`,
                 animationDelay: `${i * 0.1}s`,
                 top: `${5 + (i % 3) * 2}%`
               }}
          />
        ))}
      </div>

      {/* Minimal Header (Top Right X) */}
      <div className="sticky top-0 right-0 w-full flex justify-end px-5 pt-14 pb-4 z-50 bg-gradient-to-b from-white via-white/90 to-transparent">
        <button 
          onClick={onClose}
          className="w-[40px] h-[40px] flex items-center justify-center bg-[#F7F7F8] hover:bg-[#F0F0F2] rounded-full transition-colors active:scale-95"
          aria-label="Close"
        >
          <X size={20} color="#111111" strokeWidth={2.5} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="px-5 pt-4 flex flex-col items-center relative z-10 min-h-full pb-4">
        
        {/* Celebration Zone (Refined Premium FinTech style) */}
        <div className="relative w-[80px] h-[80px] mb-6 animate-subtle-scale">
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 bg-[#00C060] opacity-10 blur-xl rounded-full" />
          {/* Soft Circle with inner shadow */}
          <div className="relative w-full h-full bg-[#EAF7EF] rounded-full flex items-center justify-center text-[#00C060] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-white">
            <CheckCircle2 size={36} strokeWidth={3} />
          </div>
        </div>
        
        <Text variant="title" className="mb-2 text-center tracking-tight">Booking Confirmed!</Text>
        <p className="text-[16px] text-[#777777] text-center max-w-[280px] mb-8 leading-relaxed">
          Lukas accepted your booking for Monday, Feb 24.
        </p>

        {/* Booking Confirmed Card */}
        <Card variant="grey" className="w-full mb-10 !p-4 !rounded-[16px]">
          {/* Walker Row */}
          <div className="flex items-center gap-3 mb-4">
            <Avatar src="https://i.pravatar.cc/150?u=lukas" size={48} />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#111111] text-[16px] truncate">Lukas M.</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} className="fill-[#111111] text-[#111111]" />
                <span className="text-[13px] font-bold text-[#111111]">4.9</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              {/* Reduced visual weight for price */}
              <span className="text-[15px] font-semibold text-[#111111]">CHF 95.00</span>
            </div>
          </div>
          
          {/* Softened Divider */}
          <div className="w-full h-[1px] bg-[#EEEEEE] my-4" />
          
          {/* Details Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center shrink-0 border border-black/[0.04]">
                <Activity size={16} color="#FF6B35" />
              </div>
              <span className="text-[14px] font-medium text-[#111111]">Dog Walking</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">60 min</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center shrink-0 border border-black/[0.04]">
                <Calendar size={16} className="text-[#111111]" />
              </div>
              <span className="text-[14px] font-medium text-[#111111]">Mon, Feb 24</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">14:00 - 15:00</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center shrink-0 border border-black/[0.04]">
                <PawPrint size={16} className="text-[#111111]" />
              </div>
              <span className="text-[14px] font-medium text-[#111111]">Max</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">Golden Retriever</span>
            </div>
          </div>
        </Card>

        {/* What's Next Section */}
        <div className="w-full mb-0">
          <Text variant="label" className="mb-3 ml-1 text-[#8E8E93]">What's Next</Text>
          <div className="space-y-2">
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[12px] p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0">
                <CreditCard size={16} className="text-[#111111]" />
              </div>
              <span className="text-[14px] font-medium text-[#111111]">Payment processing</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">CHF 95.00</span>
            </div>
            
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[12px] p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0">
                <Calendar size={16} className="text-[#111111]" />
              </div>
              <span className="text-[14px] font-medium text-[#111111]">Walk confirmed</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">Mon, 14:00</span>
            </div>
            
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[12px] p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0">
                <MessageCircle size={16} className="text-[#111111]" />
              </div>
              <span className="text-[14px] font-medium text-[#111111]">You can now message Lukas</span>
            </div>
            
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[12px] p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0">
                <Bell size={16} className="text-[#111111]" />
              </div>
              <span className="text-[14px] font-medium text-[#111111]">Reminders enabled</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">1 day before</span>
            </div>
          </div>
        </div>

        {/* Action Buttons with Bottom Fade Grounding (Sticky) */}
        <div className="sticky bottom-0 w-[calc(100%+40px)] -mx-5 mt-auto pt-12 pb-8 px-5 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
          <div className="flex flex-col gap-3">
            <Button variant="primary" onClick={handleMessage}>Message Lukas</Button>
            <Button variant="secondary" onClick={handleCalendar}>Add to Calendar</Button>
          </div>
          <div className="mt-4 flex justify-center w-full">
            <Button variant="tertiary" onClick={handleDone} className="opacity-70 !w-auto">Done</Button>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- APP SHELL (MAIN ENTRY POINT) ---

export default function App() {
  // Start on the new booking-confirmed screen for demo purposes
  const [activeTab, setActiveTab] = useState('vault');
  const [displayTab, setDisplayTab] = useState('booking-confirmed'); 
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const renderScreen = () => {
    switch (displayTab) {
      case 'home': return <HomeScreen />;
      case 'pets': return <PetsScreen />;
      case 'services': return <ServicesScreen />;
      case 'activity': return <ActivityScreen />;
      case 'vault': return <VaultScreen setDisplayTab={setDisplayTab} />;
      case 'booking-confirmed': return <BookingConfirmedScreen onClose={() => setDisplayTab('vault')} showToast={showToast} />;
      default: return <HomeScreen />;
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'home') return 'FYLOS';
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? tab.label : 'FYLOS';
  };

  // Condition to hide global nav for full-screen immersive flows
  const isFullScreenMode = displayTab === 'booking-confirmed';

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

        {/* Toast Notification Layer */}
        {toastMessage && (
          <div className="absolute top-[64px] left-1/2 transform -translate-x-1/2 bg-[#222222] text-[#FFFFFF] px-4 py-2.5 rounded-full text-[14px] font-medium shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[200] flex items-center gap-2 animate-in slide-in-from-top-4 fade-in duration-300">
            <CheckCircle2 size={16} className="text-[#00C060]" />
            {toastMessage}
          </div>
        )}

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
            
            {!isFullScreenMode && (
              <>
                <Header 
                  title={getHeaderTitle()} 
                  variant="default"
                  user={MOCK_USER} 
                />
                
                <TabBar 
                  activeTab={activeTab} 
                  onTabChange={handleTabChange} 
                />
              </>
            )}
          </>
        )}

        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>
    </div>
  );
}