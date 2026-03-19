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
  Check,
  Clock,
  Sparkles,
  Filter,
  Mail,
  ToggleRight,
  ToggleLeft
} from 'lucide-react';

/**
 * GLOBAL DESIGN TOKENS (CSS Variables)
 * Keeps the "FYLOS vibe" ultra-minimal and consistent.
 */
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    :root {
      /* Colors */
      --color-accent: #E85D2A;
      --color-accent-hover: #D04A1C;
      --color-primary-text: #111111;
      --color-secondary-text: #6E6E73;
      --color-tertiary-text: #8E8E93;
      --color-background: #F9F9FB;
      --color-surface: #FFFFFF;
      --color-surface-hover: #F2F2F7;
      --color-border: rgba(0, 0, 0, 0.04);
      
      /* Status Colors */
      --color-danger: #FF3B30;
      --color-danger-bg: #FFF0F0;
      --color-success: #34C759;
      --color-success-bg: #E5F9ED;
      --color-warning: #FF9500;
      --color-warning-bg: #FFF4E5;
      --color-info: #007AFF;
      --color-info-bg: #E5F0FF;

      /* Radii */
      --radius-sm: 8px;
      --radius-md: 16px;
      --radius-lg: 20px;
      --radius-full: 9999px;

      /* Shadows (Premium Depth) */
      --shadow-soft: 0 4px 20px rgba(0,0,0,0.03); /* Legacy fallback */
      --shadow-floating: 0 8px 30px rgba(0,0,0,0.08); /* Legacy fallback */
      --shadow-active: 0 4px 14px rgba(232,93,42,0.25); /* Legacy fallback */
      
      --shadow-level-1: 0 2px 8px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(0,0,0,0.03);
      --shadow-level-2: 0 10px 40px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.04);
      --shadow-active-glow: 0 0 0 1px rgba(232,93,42,0.15), 0 4px 12px rgba(232,93,42,0.1);

      /* Motion */
      --motion-fast: 120ms;
      --motion-normal: 200ms;
      --motion-slow: 300ms;
      --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }

    @keyframes springBump {
      0% { transform: scale(1); }
      40% { transform: scale(1.06); }
      100% { transform: scale(1); }
    }
    .animate-spring-bump {
      animation: springBump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up-fade {
      animation: slideUpFade 0.4s var(--ease-spring) forwards;
    }
    
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .animate-shimmer {
      background: linear-gradient(90deg, var(--color-surface-hover) 25%, #F9F9FB 50%, var(--color-surface-hover) 75%);
      background-size: 400% 100%;
      animation: shimmer 1.2s infinite linear;
    }
    
    /* Optional Grain Texture (Fixed to prevent overriding absolute containers) */
    .bg-grain::before {
      content: "";
      position: absolute;
      inset: 0;
      opacity: 0.02;
      pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
  `}} />
);

/**
 * FYLOS Logo Component
 */
const FylosLogo = ({ textColor = 'var(--color-primary-text)', dotColor = 'var(--color-accent)', fontSize = '2rem', className = '' }) => (
  <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `calc(${fontSize} * 0.15)`, fontFamily: '"Nunito", sans-serif' }}>
    <span style={{ fontSize, fontWeight: 800, color: textColor, letterSpacing: '-0.5px', lineHeight: 1 }}>FYLOS</span>
    <div style={{ width: `calc(${fontSize} * 0.25)`, height: `calc(${fontSize} * 0.25)`, borderRadius: '50%', backgroundColor: dotColor }} />
  </div>
);

// --- MOCK DATA ---
const MOCK_USER = { name: 'Alex', avatar: 'https://i.pravatar.cc/150?u=alex_fylos', notifications: 1 };
const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'vault', label: 'Vault', icon: Folder },
];

// --- DESIGN SYSTEM COMPONENTS (v2) ---

const Text = ({ variant = 'body', className = '', children, ...props }) => {
  const variants = {
    title: "text-[22px] font-semibold text-[var(--color-primary-text)] tracking-tight",
    subtitle: "text-[16px] font-medium text-[var(--color-primary-text)] tracking-tight",
    body: "text-[15px] text-[var(--color-primary-text)] leading-relaxed opacity-90",
    caption: "text-[13px] text-[var(--color-secondary-text)] opacity-80",
    label: "text-[12px] font-medium text-[var(--color-secondary-text)] uppercase tracking-widest opacity-70"
  };
  return <div className={`${variants[variant]} ${className}`} {...props}>{children}</div>;
};

const Spinner = ({ size = 'medium', color = 'primary', className = '' }) => {
  const sizes = { small: 16, medium: 24, large: 32 };
  const colorMap = { primary: 'var(--color-accent)', grey: 'var(--color-tertiary-text)', white: '#FFFFFF' };
  return <Loader2 className={`animate-spin ${className}`} size={sizes[size] || sizes.medium} color={colorMap[color] || color} />;
};

const Divider = ({ spacing = 'medium', className = '' }) => {
  const spacings = { small: 'my-2', medium: 'my-4', large: 'my-8' };
  return <div className={`w-full h-[1px] bg-[var(--color-border)] ${spacings[spacing]} ${className}`} />;
};

const IconWrapper = ({ icon: Icon, color = 'var(--color-primary-text)', size = 18, strokeWidth = 1.5, className = '' }) => (
  <div className={`flex items-center justify-center shrink-0 ${className}`}>
    <Icon color={color} size={size} strokeWidth={strokeWidth} />
  </div>
);

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-[var(--color-surface)] text-[var(--color-secondary-text)]",
    count: "bg-[var(--color-danger)] text-white px-1.5 py-0 min-w-[18px] justify-center text-[10px]",
    success: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
    warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
    error: "bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
    info: "bg-[var(--color-info-bg)] text-[var(--color-info)]"
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-bold rounded-full px-2.5 py-1 uppercase tracking-wide leading-none ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const FilterChip = ({ label, active, onClick, icon: Icon }) => (
  <button 
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium transition-all active:scale-[0.97] ${
      active 
        ? 'bg-[var(--color-primary-text)] text-white shadow-[var(--shadow-level-1)]' 
        : 'bg-[var(--color-surface)] text-[var(--color-secondary-text)] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)] hover:bg-[var(--color-surface-hover)]'
    }`}
  >
    {Icon && <Icon size={14} strokeWidth={active ? 2 : 1.5} />}
    {label}
  </button>
);

const Avatar = ({ src, initials, size = 48, badge, badgeColor = 'var(--color-danger)' }) => {
  return (
    <div className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} className="w-full h-full rounded-full object-cover border border-[var(--color-border)]" alt="Avatar" />
      ) : (
        <div className="w-full h-full rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary-text)] font-semibold" style={{ fontSize: size * 0.4 }}>
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
  const baseStyles = "relative flex items-center justify-center font-medium transition-all duration-[var(--motion-fast)] ease-[var(--ease-default)] active:scale-[0.97] overflow-hidden gap-2 outline-none";
  
  const variants = {
    primary: "bg-gradient-to-b from-[#FF7240] to-[var(--color-accent)] text-white shadow-[var(--shadow-level-1)] hover:opacity-95",
    secondary: "bg-[var(--color-surface)] text-[var(--color-primary-text)] shadow-[var(--shadow-level-1)] hover:bg-[var(--color-surface-hover)]",
    ghost: "bg-transparent text-[var(--color-primary-text)] hover:bg-[var(--color-surface-hover)]",
    destructive: "bg-[var(--color-danger-bg)] text-[var(--color-danger)] hover:bg-[#FFE5E5]",
    success: "bg-[var(--color-success)] text-white shadow-[0_2px_10px_rgba(52,199,89,0.2)]"
  };
  
  const sizes = {
    small: "px-3 py-2 text-[14px] rounded-[12px]",
    medium: "px-4 py-[14px] text-[16px] rounded-[16px]",
    large: "px-6 py-4 text-[18px] rounded-[20px]"
  };
  
  const isDisabled = disabled || isLoading;
  const disabledStyles = isDisabled ? "bg-[var(--color-surface-hover)] text-[var(--color-tertiary-text)] shadow-none cursor-not-allowed active:scale-100" : "";
  const widthClass = fullWidth ? "w-full" : "w-auto inline-flex";

  return (
    <button 
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Spinner size="small" color={variant === 'primary' || variant === 'success' ? 'white' : 'grey'} />
      ) : (
        <>
          {Icon && <Icon size={size === 'small' ? 16 : 18} strokeWidth={1.5} />}
          {children}
        </>
      )}
    </button>
  );
};

const Card = ({ variant = 'default', clickable, children, className = '', ...props }) => {
  const baseStyles = "transition-all duration-[150ms] ease-out";
  const variants = {
    default: "bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-level-1)]",
    compact: "bg-[var(--color-surface)] rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-level-1)]",
    highlighted: "bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-active-glow)] border-l-[3px] border-l-[var(--color-accent)]",
    grey: "bg-[var(--color-surface-hover)] rounded-[var(--radius-lg)] p-5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]",
    list: "bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-0 shadow-[var(--shadow-level-1)] overflow-hidden"
  };
  const interactive = clickable ? "cursor-pointer hover:shadow-[var(--shadow-level-2)] active:-translate-y-[1px] active:scale-[0.99]" : "";
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${interactive} ${className}`} {...props}>
      {children}
    </div>
  );
};

const TextInput = ({ label, error, helperText, disabled, icon: Icon, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className} ${disabled ? 'opacity-50' : ''}`}>
    {label && <label className="text-[13px] font-medium text-[var(--color-secondary-text)] ml-1">{label}</label>}
    <div className="relative flex items-center">
      {Icon && <div className="absolute left-4 text-[var(--color-tertiary-text)] pointer-events-none"><Icon size={18} strokeWidth={2} /></div>}
      <input 
        disabled={disabled}
        className={`w-full h-[52px] ${Icon ? 'pl-11' : 'px-4'} pr-4 bg-[var(--color-background)] border text-[16px] text-[var(--color-primary-text)] rounded-[var(--radius-md)] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[var(--color-accent)]/10 ${
          error 
            ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)]' 
            : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
        } placeholder:text-[var(--color-tertiary-text)]`}
        {...props}
      />
    </div>
    {error ? (
      <span className="text-[12px] text-[var(--color-danger)] ml-1 flex items-center gap-1"><AlertCircle size={12}/>{error}</span>
    ) : helperText ? (
      <span className="text-[12px] text-[var(--color-tertiary-text)] ml-1">{helperText}</span>
    ) : null}
  </div>
);

const SearchInput = ({ value, onChange, onClear, placeholder = 'Search...', className = '' }) => (
   <div className={`relative flex items-center w-full ${className}`}>
     <div className="absolute left-4 text-[var(--color-tertiary-text)] pointer-events-none">
       <Search size={18} strokeWidth={2.5} />
     </div>
     <input 
       type="text"
       value={value}
       onChange={onChange}
       placeholder={placeholder}
       className="w-full h-[48px] pl-11 pr-11 bg-[var(--color-surface)] text-[var(--color-primary-text)] rounded-[var(--radius-md)] text-[16px] placeholder:text-[var(--color-tertiary-text)] focus:outline-none focus:bg-[var(--color-background)] focus:border focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent)]/10 transition-all duration-200 border border-transparent"
     />
     {value && (
       <button onClick={onClear} className="absolute right-4 text-[var(--color-tertiary-text)] hover:text-[var(--color-primary-text)] transition-colors p-1 rounded-full active:bg-black/5">
         <X size={16} strokeWidth={2.5} />
       </button>
     )}
   </div>
);

const Select = ({ label, options = [], value, onChange, disabled, className = '' }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className} ${disabled ? 'opacity-50' : ''}`}>
    {label && <label className="text-[13px] font-medium text-[var(--color-secondary-text)] ml-1">{label}</label>}
    <div className="relative">
      <select 
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="w-full h-[52px] px-4 pr-10 bg-[var(--color-background)] border border-[var(--color-border)] text-[16px] text-[var(--color-primary-text)] rounded-[var(--radius-md)] appearance-none transition-all duration-200 focus:outline-none focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent)]/10"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-tertiary-text)]">
        <ChevronDown size={18} strokeWidth={1.5} />
      </div>
    </div>
  </div>
);

const Toggle = ({ active, onChange }) => (
  <button 
    role="switch"
    aria-checked={active}
    onClick={() => onChange(!active)}
    className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-[var(--motion-normal)] ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 ${
      active ? 'bg-[var(--color-success)]' : 'bg-[var(--color-surface-hover)]'
    }`}
  >
    <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-[var(--shadow-level-1)] transition-transform duration-[220ms] ease-[var(--ease-spring)] ${
      active ? 'translate-x-6' : 'translate-x-0'
    }`} />
  </button>
);

const SegmentedControl = ({ segments, activeIndex, onChange, className = '' }) => {
  return (
    <div className={`flex bg-[var(--color-surface-hover)] p-1 rounded-[14px] relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] ${className}`}>
      <div 
        className="absolute top-1 bottom-1 bg-[var(--color-surface)] rounded-[10px] shadow-[var(--shadow-level-1)] transition-all duration-[220ms] ease-[var(--ease-spring)]"
        style={{ width: `calc(${100 / segments.length}% - 4px)`, left: `calc(${(100 / segments.length) * activeIndex}% + 2px)` }}
      />
      {segments.map((seg, i) => (
        <button
          key={seg}
          onClick={() => onChange(i)}
          className={`relative z-10 flex-1 py-1.5 text-[13px] transition-colors duration-[var(--motion-normal)] ${activeIndex === i ? 'font-semibold text-[var(--color-primary-text)]' : 'font-medium text-[var(--color-secondary-text)] opacity-70'}`}
        >
          {seg}
        </button>
      ))}
    </div>
  );
};

const InlineNotice = ({ variant = 'info', title, description, className = '' }) => {
  const variants = {
    info: { bg: 'bg-[var(--color-info-bg)]', text: 'text-[var(--color-info)]', icon: Info },
    success: { bg: 'bg-[var(--color-success-bg)]', text: 'text-[var(--color-success)]', icon: CheckCircle2 },
    warning: { bg: 'bg-[var(--color-warning-bg)]', text: 'text-[var(--color-warning)]', icon: AlertTriangle },
    error: { bg: 'bg-[var(--color-danger-bg)]', text: 'text-[var(--color-danger)]', icon: AlertCircle }
  };
  const v = variants[variant];
  const Icon = v.icon;
  
  return (
    <div className={`flex items-start gap-3 p-4 rounded-[var(--radius-md)] ${v.bg} ${className}`}>
      <Icon className={`shrink-0 ${v.text}`} size={20} strokeWidth={1.5} />
      <div className="flex flex-col gap-0.5 pt-0.5">
        {title && <span className={`text-[14px] font-semibold ${v.text}`}>{title}</span>}
        {description && <span className={`text-[13px] ${v.text} opacity-90 leading-relaxed`}>{description}</span>}
      </div>
    </div>
  );
};

const Skeleton = ({ className = '', rounded = 'rounded-[var(--radius-md)]', ...props }) => (
  <div className={`animate-shimmer ${rounded} ${className}`} {...props} />
);

const ListRow = ({ icon: Icon, avatar, title, subtitle, rightAccessory, onClick, className = '' }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 py-3 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-all duration-[var(--motion-fast)] hover:bg-[var(--color-surface-hover)] px-2 -mx-2 rounded-[var(--radius-sm)]' : ''} ${className}`}
  >
    {avatar ? <Avatar {...avatar} size={40} /> : Icon && (
      <div className="w-10 h-10 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center shrink-0">
        <Icon size={18} color="var(--color-accent)" strokeWidth={1.5} />
      </div>
    )}
    <div className="flex-1 flex flex-col justify-center min-w-0">
      <span className="text-[16px] font-semibold text-[var(--color-primary-text)] truncate">{title}</span>
      {subtitle && <span className="text-[13px] text-[var(--color-secondary-text)] truncate">{subtitle}</span>}
    </div>
    {rightAccessory && <div className="shrink-0 ml-2 text-[var(--color-tertiary-text)]">{rightAccessory}</div>}
  </div>
);

const NotificationCard = ({ priority = 'normal', title, time, description, isUnread = false }) => {
  const priorityColors = {
    critical: 'bg-[var(--color-danger)]',
    high: 'bg-[var(--color-warning)]',
    normal: 'bg-[var(--color-accent)]'
  };

  return (
    <div className={`relative p-4 bg-[var(--color-surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-level-1)] flex gap-4 transition-colors duration-[var(--motion-normal)] ${isUnread ? 'bg-white' : ''}`}>
      {isUnread && <div className={`absolute top-5 left-3 w-2 h-2 rounded-full ${priorityColors[priority]}`} />}
      <div className="pl-4 flex-1">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-semibold text-[15px] text-[var(--color-primary-text)]">{title}</h4>
          <span className="text-[12px] text-[var(--color-tertiary-text)] font-medium">{time}</span>
        </div>
        <p className="text-[14px] text-[var(--color-secondary-text)] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

const ToastMock = ({ message, icon: Icon = CheckCircle2 }) => (
  <div className="inline-flex items-center gap-3 px-4 py-3 bg-[var(--color-surface)] text-[var(--color-primary-text)] rounded-[var(--radius-full)] shadow-[var(--shadow-level-2)] shadow-[0_4px_20px_rgba(52,199,89,0.15)] animate-slide-up-fade">
    <Icon size={18} className="text-[var(--color-success)]" strokeWidth={2} />
    <span className="text-[14px] font-medium">{message}</span>
  </div>
);

const WaitlistBanner = () => (
  <div className="relative overflow-hidden bg-gradient-to-br from-[#111111] to-[#2A2A2A] rounded-[var(--radius-lg)] p-6 text-center text-white shadow-xl">
    <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, var(--color-accent), transparent 50%)' }} />
    <Sparkles className="mx-auto mb-3 text-[var(--color-accent)]" size={28} />
    <h3 className="text-[20px] font-bold mb-2 tracking-tight">FYLOS Pro is coming</h3>
    <p className="text-[14px] text-gray-300 mb-5 leading-relaxed max-w-[240px] mx-auto">Get advanced health tracking and priority vet bookings.</p>
    <Button variant="primary" size="small" fullWidth={false} className="min-w-[140px] border border-[var(--color-accent)]">Join Waitlist</Button>
  </div>
);

const EmptyState = ({ icon: Icon, illustration, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] px-6 text-center">
    {illustration ? (
      <div className="mb-6">{illustration}</div>
    ) : (
      <div className="w-20 h-20 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-6">
        <Icon size={32} color="var(--color-tertiary-text)" strokeWidth={1.5} />
      </div>
    )}
    <h2 className="text-[20px] font-semibold text-[var(--color-primary-text)] mb-2">{title}</h2>
    <p className="text-[15px] text-[var(--color-secondary-text)] max-w-[260px] leading-relaxed mb-8">
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
const Header = ({ title, variant = 'default', user, isStaticMock = false }) => {
  const handleAction = (action) => !isStaticMock && alert(`${action} — Coming in future steps`);
  
  // For sandbox static display, remove absolute positioning
  const positioning = isStaticMock 
    ? "relative w-full z-10 py-2 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] mb-4" 
    : "absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none bg-gradient-to-b from-[var(--color-background)] to-transparent";

  return (
    <header className={positioning}>
      {variant === 'default' && (
        <div className={`flex justify-between items-center w-full pointer-events-auto ${isStaticMock ? 'px-3' : ''}`}>
          <h1 className="font-bold tracking-tight text-[var(--color-primary-text)] drop-shadow-sm ml-1 flex items-center">
            {title === 'FYLOS' || !title ? <FylosLogo fontSize="22px" textColor="var(--color-primary-text)" /> : title}
          </h1>
          <div className="flex items-center bg-[var(--color-surface)] shadow-[var(--shadow-level-1)] rounded-[var(--radius-full)] p-1 h-[52px]">
            <button onClick={() => handleAction('Search')} className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[var(--color-surface-hover)] active:scale-[0.97] transition-all duration-[var(--motion-fast)]">
              <Search size={18} color="var(--color-primary-text)" strokeWidth={1.5} />
            </button>
            <div className="w-[1px] h-[20px] bg-[var(--color-border)]" />
            <button onClick={() => handleAction('Inbox')} className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[var(--color-surface-hover)] active:scale-[0.97] transition-all duration-[var(--motion-fast)]">
              <Bell size={18} color="var(--color-primary-text)" strokeWidth={1.5} />
              {user?.notifications > 0 && <span className="absolute top-[12px] right-[12px] w-[8px] h-[8px] bg-[var(--color-accent)] rounded-full border-[1.5px] border-white" />}
            </button>
            <div className="w-[1px] h-[20px] bg-[var(--color-border)]" />
            <button onClick={() => handleAction('Profile')} className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all duration-[var(--motion-fast)]">
              <img src={user?.avatar} className="w-[32px] h-[32px] rounded-full object-cover border border-[var(--color-border)]" alt="Avatar" />
            </button>
          </div>
        </div>
      )}

      {variant === 'detail' && (
        <div className={`flex justify-between items-center w-full pointer-events-auto ${isStaticMock ? 'px-3' : ''}`}>
          <button onClick={() => handleAction('Back')} className="w-[44px] h-[44px] flex items-center justify-center bg-[var(--color-surface)] shadow-[var(--shadow-level-1)] rounded-[var(--radius-full)] active:scale-[0.97] transition-all duration-[var(--motion-fast)]">
            <ChevronLeft size={20} color="var(--color-primary-text)" strokeWidth={1.5} />
          </button>
          <h2 className="text-[17px] font-semibold text-[var(--color-primary-text)] tracking-tight">{title}</h2>
          <button onClick={() => handleAction('Menu')} className="w-[44px] h-[44px] flex items-center justify-center bg-[var(--color-surface)] shadow-[var(--shadow-level-1)] rounded-[var(--radius-full)] active:scale-[0.97] transition-all duration-[var(--motion-fast)]">
            <MoreHorizontal size={20} color="var(--color-primary-text)" strokeWidth={1.5} />
          </button>
        </div>
      )}

      {variant === 'modal' && (
        <div className={`flex justify-between items-center w-full pointer-events-auto ${isStaticMock ? 'px-3' : ''}`}>
           <button onClick={() => handleAction('Close')} className="w-[44px] h-[44px] flex items-center justify-center bg-[var(--color-surface)] shadow-[var(--shadow-level-1)] rounded-[var(--radius-full)] active:scale-[0.97] transition-all duration-[var(--motion-fast)]">
            <X size={20} color="var(--color-primary-text)" strokeWidth={1.5} />
          </button>
          <h2 className="text-[17px] font-semibold text-[var(--color-primary-text)] tracking-tight">{title}</h2>
          <div className="w-[44px] h-[44px]" /> {/* Spacer */}
        </div>
      )}
    </header>
  );
};

/**
 * TabBar Component
 */
const TabBar = ({ activeTab, onTabChange, isStaticMock = false }) => {
  const positioning = isStaticMock 
    ? "relative w-full z-10 my-4" 
    : "absolute bottom-[24px] left-0 w-full px-5 z-40 pointer-events-none";

  return (
    <nav className={positioning} role="tablist">
      <div className="pointer-events-auto bg-white/70 backdrop-blur-xl shadow-[var(--shadow-level-2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] rounded-[var(--radius-full)] h-[72px] flex justify-between items-center px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id} role="tab" aria-selected={isActive} onClick={() => onTabChange(tab.id)}
              className="relative flex-1 h-full flex flex-col items-center justify-center gap-[4px] group transition-all duration-[var(--motion-fast)] active:scale-[0.95]"
            >
              <div className={`relative z-10 flex items-center justify-center transition-all duration-[var(--motion-normal)] ease-[var(--ease-default)] ${isActive ? 'text-[var(--color-accent)] scale-110' : 'text-[var(--color-tertiary-text)] opacity-60'}`}>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
              </div>
              <span className={`text-[11px] font-medium leading-none transition-all duration-[var(--motion-normal)] ease-[var(--ease-default)] ${isActive ? 'text-[var(--color-accent)] opacity-100' : 'text-[var(--color-tertiary-text)] opacity-0'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

const useLockBodyScroll = (isOpen) => {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, [isOpen]);
};

const BottomSheet = ({ isOpen, onClose, title, size = 'expanded', children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [portalNode, setPortalNode] = useState(null);

  useLockBodyScroll(isOpen);

  useEffect(() => { setPortalNode(document.getElementById('modal-root')); }, []);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      setRender(true);
      window.addEventListener('keydown', handleEsc);
      const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
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
  const handleTouchEnd = () => {
    if (translateY > 80) onClose();
    else setTranslateY(0);
  };

  if (!render || !portalNode) return null;

  const heightClass = size === 'compact' ? 'max-h-[50vh]' : 'max-h-[90vh]';

  return createPortal(
    <div className="absolute inset-0 z-[100] overflow-hidden pointer-events-auto flex flex-col justify-end">
      <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-[var(--motion-normal)] ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div 
        className={`relative w-full bg-[var(--color-surface)] rounded-t-[var(--radius-lg)] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] ${heightClass}`}
        style={{ transform: `translateY(${!visible ? '100%' : `${translateY}px`})`, transition: translateY > 0 ? 'none' : 'transform var(--motion-slow) var(--ease-spring)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        <div className="w-full flex justify-center pt-4 pb-5 cursor-grab active:cursor-grabbing touch-none shrink-0" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="w-12 h-1.5 bg-[var(--color-border)] rounded-full" />
        </div>
        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 relative bg-grain">
          {title && <h3 className="text-[20px] font-bold text-[var(--color-primary-text)] mb-4">{title}</h3>}
          {children}
        </div>
      </div>
    </div>,
    portalNode
  );
};

const FullscreenOverlay = ({ isOpen, onClose, title, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const [portalNode, setPortalNode] = useState(null);

  useEffect(() => { setPortalNode(document.getElementById('modal-root')); }, []);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
    } else {
      setVisible(false);
      setTimeout(() => setRender(false), 200);
    }
  }, [isOpen]);

  if (!render || !portalNode) return null;

  return createPortal(
    <div className={`absolute inset-0 z-[110] bg-[var(--color-background)] flex flex-col transition-transform duration-[var(--motion-slow)] ease-[var(--ease-default)] ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <Header variant="modal" title={title} isStaticMock={false} />
      {/* Invisible overlay over header actions to hijack the close behavior for this specific demo */}
      <button onClick={onClose} className="absolute top-14 left-5 w-[44px] h-[44px] z-50 opacity-0 cursor-pointer" aria-label="Close Overlay" />
      
      <div className="flex-1 overflow-y-auto pt-[110px] px-5 pb-10 relative bg-grain">
        {children}
      </div>
    </div>,
    portalNode
  );
};

const ScreenContainer = ({ children }) => (
  <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[var(--color-background)] bg-grain custom-scrollbar">
    <div className="min-h-full pt-[110px] pb-[120px]">
      {children}
    </div>
  </div>
);

// --- DESIGN SYSTEM SANDBOX SCREEN (v2) ---

const DesignSystemScreen = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSize, setSheetSize] = useState('expanded');
  const [overlayOpen, setOverlayOpen] = useState(false);
  
  const [searchValue, setSearchValue] = useState('');
  const [selectValue, setSelectValue] = useState('opt1');
  const [segment, setSegment] = useState(0);
  const [toggleState, setToggleState] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  const openSheet = (size) => { setSheetSize(size); setSheetOpen(true); };

  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-12">
        
        {/* Intro */}
        <div className="pt-2">
          <Text variant="title" className="mb-2">Design System v2</Text>
          <Text variant="body" className="text-[var(--color-secondary-text)]">
            A comprehensive, token-driven primitive library enforcing the premium FYLOS aesthetic.
          </Text>
        </div>

        {/* 1. Tokens & Typography */}
        <section className="space-y-4">
          <Text variant="label">1. Typography Scale</Text>
          <div className="space-y-4 p-5 bg-[var(--color-surface)] rounded-[var(--radius-lg)]">
            <Text variant="title">Title / 24px Bold</Text>
            <Text variant="subtitle">Subtitle / 17px Semibold</Text>
            <Text variant="body">Body / 15px Regular leading-relaxed</Text>
            <Text variant="caption">Caption / 13px Regular</Text>
            <Text variant="label">Label / 12px Uppercase</Text>
          </div>
        </section>

        {/* 2. Colors, Badges & Chips */}
        <section className="space-y-4">
          <Text variant="label">2. Badges & Chips</Text>
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Default</Badge>
            <Badge variant="success">Active</Badge>
            <Badge variant="warning">Pending</Badge>
            <Badge variant="error">Critical</Badge>
            <Badge variant="info">New</Badge>
            <Badge variant="count">12</Badge>
          </div>
          <div className="flex gap-2 pt-2">
            {['All', 'Dogs', 'Cats'].map(f => (
              <FilterChip key={f} label={f} active={activeFilter === f} onClick={() => setActiveFilter(f)} />
            ))}
          </div>
        </section>

        {/* 3. Avatars & Identity */}
        <section className="space-y-4">
          <Text variant="label">3. Identity & Avatars</Text>
          <div className="flex items-center gap-4">
            <Avatar size={64} src="https://i.pravatar.cc/150?u=alex_fylos" badge="3" />
            <Avatar size={48} initials="JD" badgeColor="var(--color-success)" badge="" />
            <Avatar size={32} initials="MK" />
          </div>
        </section>

        {/* 4. Buttons */}
        <section className="space-y-4">
          <Text variant="label">4. Buttons & Actions</Text>
          <div className="flex flex-col gap-3">
            <Button variant="primary" icon={Star}>Primary Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="ghost" icon={Activity}>Ghost Action</Button>
            <Button variant="destructive">Destructive Action</Button>
            <div className="flex gap-3">
              <Button variant="success" className="flex-1">Success</Button>
              <Button variant="primary" isLoading className="flex-1">Load</Button>
              <Button variant="secondary" disabled className="flex-1">Disabled</Button>
            </div>
            <div className="flex gap-3 items-center pt-2">
              <Button variant="primary" size="small" fullWidth={false}>Small</Button>
              <Button variant="primary" size="medium" fullWidth={false}>Medium</Button>
              <Button variant="primary" size="large" fullWidth={false}>Large Button</Button>
            </div>
          </div>
        </section>

        {/* 5. Inputs & Forms */}
        <section className="space-y-4">
          <Text variant="label">5. Form Controls</Text>
          <SearchInput value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onClear={() => setSearchValue('')} />
          <TextInput label="Standard Input" placeholder="e.g. Max" icon={Mail} />
          <TextInput label="Error State" placeholder="Enter number" error="Invalid format" />
          <Select 
            label="Dropdown Select" value={selectValue} onChange={(e) => setSelectValue(e.target.value)}
            options={[{ value: 'opt1', label: 'Dog' }, { value: 'opt2', label: 'Cat' }]}
          />
          <div className="flex items-center justify-between p-4 bg-[var(--color-surface)] rounded-[var(--radius-md)]">
            <div className="flex flex-col">
              <span className="text-[15px] font-semibold text-[var(--color-primary-text)]">Push Notifications</span>
              <span className="text-[13px] text-[var(--color-secondary-text)]">Receive daily updates</span>
            </div>
            <Toggle active={toggleState} onChange={setToggleState} />
          </div>
          <SegmentedControl segments={['Upcoming', 'Past', 'Cancelled']} activeIndex={segment} onChange={setSegment} />
        </section>

        {/* 6. Cards & Surfaces */}
        <section className="space-y-4">
          <Text variant="label">6. Cards & Surfaces</Text>
          <Card>
            <Text variant="subtitle">Default Card</Text>
            <Text variant="caption" className="mt-1">Standard padding and soft shadow.</Text>
          </Card>
          <Card variant="highlighted">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[var(--color-primary-text)]">Highlighted Card</span>
              <Button variant="primary" size="small" fullWidth={false}>Action</Button>
            </div>
          </Card>
          <Card variant="compact">
            <Text variant="body" className="font-medium">Compact Card</Text>
            <Text variant="caption">Tighter padding for dense UI.</Text>
          </Card>
        </section>

        {/* 7. List Rows */}
        <section className="space-y-4">
          <Text variant="label">7. List Rows</Text>
          <Card variant="list">
            <ListRow 
              icon={Calendar} title="Vet Appointment" subtitle="Tomorrow, 10:00 AM" 
              rightAccessory={<ChevronRight size={20} />} className="px-5 hover:bg-[var(--color-surface)] !rounded-none"
            />
            <Divider spacing="small" className="!my-0 ml-16" />
            <ListRow 
              avatar={{ initials: 'Dr', size: 40 }} title="Dr. Smith" subtitle="General Checkup" 
              rightAccessory={<Button variant="secondary" size="small" fullWidth={false}>View</Button>}
              className="px-5 hover:bg-[var(--color-surface)] !rounded-none"
            />
          </Card>
        </section>

        {/* 8. Notifications & Toasts */}
        <section className="space-y-4">
          <Text variant="label">8. Notifications & Toasts</Text>
          <NotificationCard title="Vaccination Due" time="2h ago" description="Max needs his annual rabies shot scheduled this week." isUnread priority="critical" />
          <NotificationCard title="Activity Summary" time="Yesterday" description="You hit your daily walk goal with Bella!" priority="normal" />
          <div className="pt-2 flex justify-center">
            <ToastMock message="Profile updated successfully" />
          </div>
        </section>

        {/* 9. Headers & Tabs (Static Mocks) */}
        <section className="space-y-4 relative z-0">
          <Text variant="label">9. Headers & Navigation</Text>
          <Header title="Default Header" variant="default" user={MOCK_USER} isStaticMock />
          <Header title="Detail Header" variant="detail" isStaticMock />
          <TabBar activeTab="home" onTabChange={() => {}} isStaticMock />
        </section>

        {/* 10. Notices & Skeletons */}
        <section className="space-y-4">
          <Text variant="label">10. Notices & Loading</Text>
          <InlineNotice variant="info" title="System Update" description="A new version of FYLOS is ready to install." />
          <div className="flex gap-4 items-center p-4 border border-[var(--color-border)] rounded-[var(--radius-lg)]">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </section>

        {/* 11. Overlays & Modals */}
        <section className="space-y-4">
          <Text variant="label">11. Overlays & Modals</Text>
          <Button variant="secondary" onClick={() => openSheet('compact')}>Open Compact Sheet</Button>
          <Button variant="secondary" onClick={() => openSheet('expanded')}>Open Expanded Sheet</Button>
          <Button variant="primary" onClick={() => setOverlayOpen(true)}>Open Fullscreen Overlay</Button>
        </section>

        {/* 12. Coming Soon */}
        <section className="space-y-4">
          <Text variant="label">12. Coming Soon State</Text>
          <WaitlistBanner />
        </section>
      </div>

      {/* OVERLAYS ATTACHED TO THIS SCREEN */}
      <BottomSheet isOpen={sheetOpen} onClose={() => setSheetOpen(false)} title="Confirm Action" size={sheetSize}>
        <div className="space-y-5 pt-2">
          <Text variant="body" className="text-[var(--color-secondary-text)]">
            This bottom sheet uses a high z-index and portal to float above everything. The compact size limits height.
          </Text>
          {sheetSize === 'expanded' && (
            <TextInput label="Verify Password" type="password" placeholder="Enter to confirm..." />
          )}
          <div className="flex gap-3 pt-4 mt-auto">
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setSheetOpen(false)}>Confirm</Button>
          </div>
        </div>
      </BottomSheet>

      <FullscreenOverlay isOpen={overlayOpen} onClose={() => setOverlayOpen(false)} title="Search Context">
        <div className="space-y-6 pt-4">
          <SearchInput placeholder="Search pets, records, vets..." value="" onChange={()=>{}} onClear={()=>{}} />
          <div>
            <Text variant="label" className="mb-3">Recent Searches</Text>
            <div className="flex flex-wrap gap-2">
              <FilterChip label="Rabies Vaccine" />
              <FilterChip label="Dr. Smith" />
              <FilterChip label="Diet Plan" />
            </div>
          </div>
          <Card>
            <EmptyState icon={Search} title="No recent activity" description="Start typing to search your vault." />
          </Card>
        </div>
      </FullscreenOverlay>

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
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Smooth Tab Transitions
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
      case 'home': return <DesignSystemScreen />; // Replaced HomeScreen with Sandbox V2
      case 'pets': return <ScreenContainer><EmptyState icon={PawPrint} title="Pets" description="Profiles, health, and sharing" /></ScreenContainer>;
      case 'services': return <ScreenContainer><EmptyState icon={Calendar} title="Services" description="Book and manage appointments" /></ScreenContainer>;
      case 'activity': return <ScreenContainer><EmptyState icon={Activity} title="Activity" description="Journal and stats" /></ScreenContainer>;
      case 'vault': return <ScreenContainer><EmptyState icon={Folder} title="Vault" description="Documents and records" /></ScreenContainer>;
      default: return <DesignSystemScreen />;
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'home') return 'FYLOS';
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? tab.label : 'FYLOS';
  };

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      
      {/* 1. Inject Global Design Tokens */}
      <GlobalStyles />

      {/* 2. iPhone 14/15 Pro Frame Wrapper */}
      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[var(--color-background)] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
        
        {/* Dynamic Island */}
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {/* State 1: Splash / Loading App */}
        {isLoading ? (
          <div className="absolute inset-0 bg-[var(--color-background)] z-50 flex flex-col items-center justify-center">
            <FylosLogo fontSize="32px" textColor="var(--color-primary-text)" className="mb-3" />
            <p className="text-[14px] text-[var(--color-tertiary-text)] animate-pulse">Loading System v2...</p>
          </div>
        ) : (
          /* State 2: Main Application Shell */
          <>
            <main 
              className={`absolute inset-0 w-full h-full transition-opacity duration-[var(--transition-fade)] ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
              id={`panel-${displayTab}`} role="tabpanel" aria-labelledby={`tab-${displayTab}`}
            >
              {renderScreen()}
            </main>
            
            <Header title={getHeaderTitle()} variant="default" user={MOCK_USER} />
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          </>
        )}

        {/* Modal Root for Portals */}
        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>
    </div>
  );
}