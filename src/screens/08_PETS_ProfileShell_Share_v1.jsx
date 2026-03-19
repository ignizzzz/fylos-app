import React, { useState, useEffect, useRef } from 'react';
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
  MapPin,
  Pencil,
  Copy,
  Trash2,
  Plus,
  Camera,
  HeartPulse,
  FileText,
  Share2,
  QrCode,
  Link as LinkIcon,
  Users,
  Shield,
  Check,
  Mail,
  UserPlus
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

const INITIAL_MOCK_PETS = [
  {
    id: 'p1',
    name: 'Luna',
    breed: 'Golden Retriever',
    age: 3,
    sex: 'Female',
    weight: '28',
    weightUnit: 'kg',
    location: 'Zurich, CH',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
    dob: '2021-04-12',
    microchip: '981020000394857',
    color: 'Light Golden',
    energyLevel: 65,
    temperament: ['Friendly', 'Playful', 'Affectionate'],
    anxietyTriggers: ['Thunder', 'Fireworks'],
    preferences: {
      treats: 'Salmon bites, Peanut butter',
      toys: 'Tennis ball, Squeaky duck',
      foodBrand: 'Royal Canin Golden Retriever Adult',
      sleepingSpot: 'At the foot of the bed',
      walking: 'Loves the forest, hates rain'
    },
    milestones: [
      { id: 'm1', date: '2023-10-15', title: 'First Beach Trip', note: 'Loved the ocean!', icon: '🌊' },
      { id: 'm2', date: '2021-06-20', title: 'Adopted', note: 'Brought Luna home', icon: '🏡' }
    ]
  },
  {
    id: 'p2',
    name: 'Max',
    breed: 'Domestic Shorthair',
    age: 5,
    sex: 'Male',
    weight: '5.2',
    weightUnit: 'kg',
    location: 'Zurich, CH',
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop',
    dob: '2019-08-05',
    microchip: '981020000777123',
    color: 'Orange Tabby',
    energyLevel: 30,
    temperament: ['Independent', 'Curious', 'Calm'],
    anxietyTriggers: ['Vacuum cleaner', 'Car rides'],
    preferences: {
      treats: 'Tuna flakes',
      toys: 'Laser pointer, Cardboard boxes',
      foodBrand: 'Purina Pro Plan Indoor',
      sleepingSpot: 'On the highest shelf',
      walking: 'Indoor only'
    },
    milestones: [
      { id: 'm3', date: '2020-01-10', title: 'Caught first mouse', note: 'A proud hunter', icon: '🐁' }
    ]
  }
];

const INITIAL_SHARES = [
  { id: 's1', name: 'Marcus Müller', role: 'Co-owner', permission: 'Full Access', added: 'Feb 1, 2026', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 's2', name: 'Sarah Johnson', role: 'Dog Sitter', permission: 'View Only', added: 'Jan 15, 2026', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 's3', name: 'Dr. Sarah Schmidt', role: 'Vet', permission: 'Medical Only', added: 'Dec 10, 2025', avatar: 'https://i.pravatar.cc/150?u=dr_schmidt' }
];

const TEMPERAMENT_OPTIONS = ['Friendly', 'Playful', 'Calm', 'Shy', 'Protective', 'Energetic', 'Independent', 'Affectionate', 'Curious', 'Stubborn'];
const COMMON_ANXIETY_TRIGGERS = ['Thunder', 'Fireworks', 'Vacuum cleaner', 'Car rides', 'Strangers', 'Other dogs', 'Loud noises', 'Vet visits'];
const PERMISSION_LEVELS = [
  { id: 'view', label: 'View Only', description: 'Can read profile, cannot edit' },
  { id: 'edit', label: 'Can Edit', description: 'Can update details and add milestones' },
  { id: 'full', label: 'Full Access (Co-owner)', description: 'Can manage sharing and all details' },
  { id: 'medical', label: 'Medical Records Only', description: 'Restricted view for vets & clinics' }
];
const EXPIRY_OPTIONS = [
  { value: '1h', label: '1 hour' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'never', label: 'Never' }
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
    subtitle: "text-[16px] font-semibold text-[#111111]",
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
  return <div className={`w-full h-[1px] bg-black/[0.04] ${spacings[spacing]} ${className}`} />;
};

const IconWrapper = ({ icon: Icon, color = THEME.colors.primaryText, size = 24, strokeWidth = 2, className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Icon color={color} size={size} strokeWidth={strokeWidth} />
  </div>
);

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-[#F7F7F8] text-[#6E6E73] border border-black/[0.04]",
    count: "bg-[#FF3B30] text-white px-1.5 py-0 min-w-[18px] justify-center text-[10px]",
    success: "bg-[#E5F9ED] text-[#00C060]",
    warning: "bg-[#FFF4E5] text-[#FF9500]",
    error: "bg-[#FFE5E5] text-[#FF3B30]",
    info: "bg-[#E5F0FF] text-[#007AFF]",
    outline: "bg-transparent border border-black/[0.08] text-[#6E6E73]"
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-bold rounded-full px-2 py-0.5 uppercase tracking-wide leading-none ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Avatar = ({ src, initials, size = 48, badge, badgeColor = THEME.colors.danger, onClick, className = '' }) => {
  const fontSize = size * 0.4;
  return (
    <div 
      className={`relative inline-flex flex-shrink-0 ${onClick ? 'cursor-pointer active:opacity-80 transition-opacity' : ''} ${className}`} 
      style={{ width: size, height: size }}
      onClick={onClick}
    >
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
  const baseStyles = "relative flex items-center justify-center rounded-[14px] font-semibold transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2";
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.25)] hover:bg-[#E85D2A]",
    secondary: "bg-transparent text-[#111111] border-[1.5px] border-black/[0.08] hover:bg-[#F7F7F8]",
    destructive: "bg-[#FFF0F0] text-[#FF3B30] hover:bg-[#FFE5E5]",
    ghost: "bg-transparent text-[#6E6E73] hover:bg-black/5",
    pill: "bg-[#F7F7F8] text-[#111111] border border-black/[0.04] hover:bg-[#EAEAEA] !rounded-[100px]"
  };
  const sizes = {
    small: "px-3 py-2 text-[14px]",
    medium: "px-4 py-[14px] text-[16px]",
    large: "px-6 py-4 text-[18px]"
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
  const baseStyles = "rounded-[16px] p-5 transition-all duration-200";
  const variants = {
    default: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]",
    highlighted: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] border-l-[4px] border-l-[#FF6B35]",
    grey: "bg-[#F7F7F8] border border-black/[0.04]"
  };
  const interactive = clickable ? "cursor-pointer hover:bg-[#FAFAFB] active:scale-[0.98] active:shadow-none" : "";
  
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
      className={`w-full h-[52px] px-4 bg-[#FFFFFF] border text-[16px] text-[#111111] rounded-[14px] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 ${
        error ? 'border-[#FF3B30] focus:border-[#FF3B30]' : 'border-black/[0.08] focus:border-[#FF6B35]'
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
        className="w-full h-[52px] px-4 pr-10 bg-[#FFFFFF] border border-black/[0.08] text-[16px] text-[#111111] rounded-[14px] appearance-none transition-all duration-200 focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10"
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

/**
 * REFINED BOTTOM SHEET SYSTEM
 * Higher default snap (75%), lighter backdrop (bg-black/30), increased spacing.
 */
const BottomSheet = ({ isOpen, onClose, title, footer, snap = 'default', children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setIsExpanded(false);
      setTranslateY(0);
      const t = setTimeout(() => setVisible(true), 50); 
      return () => clearTimeout(t);
    } else {
      setVisible(false);
      const t = setTimeout(() => {
        setRender(false);
        setIsExpanded(false);
        setTranslateY(0);
      }, 400); 
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  const handlePointerDown = (e) => {
    touchStartY.current = e.clientY || (e.touches && e.touches[0].clientY);
    setTranslateY(0);
  };
  
  const handlePointerMove = (e) => {
    if (touchStartY.current === 0) return;
    const currentY = e.clientY || (e.touches && e.touches[0].clientY);
    const delta = currentY - touchStartY.current;

    if (delta < 0) { 
      if (snap !== 'compact' && !isExpanded) {
        setTranslateY(delta);
        if (delta < -40) { 
          setIsExpanded(true);
          setTranslateY(0);
          touchStartY.current = currentY;
        }
      } else {
        setTranslateY(delta * 0.15); 
      }
    } else { 
      if (isExpanded) {
        setTranslateY(delta);
        if (delta > 60) { 
          setIsExpanded(false);
          setTranslateY(0);
          touchStartY.current = currentY;
        }
      } else {
        setTranslateY(delta);
      }
    }
  };
  
  const handlePointerUp = () => {
    if (touchStartY.current === 0) return;
    touchStartY.current = 0;
    
    if (!isExpanded && translateY > 50) {
       onClose();
    } else if (isExpanded && translateY > 80) {
       setIsExpanded(false);
       setTranslateY(0);
    } else {
       setTranslateY(0);
    }
  };

  const handleScroll = (e) => {
    if (snap !== 'compact' && !isExpanded && e.target.scrollTop > 5) {
       setIsExpanded(true);
    }
  };

  if (!render) return null;

  const isDragging = translateY !== 0;

  return (
    <div className="absolute inset-0 z-[100] overflow-hidden pointer-events-auto flex flex-col justify-end">
      {/* Lighter Dimmed Backdrop (30%) */}
      <div 
        className={`absolute inset-0 bg-black/30 transition-opacity duration-400 ease-out ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Sliding Sheet */}
      <div 
        className="relative w-full bg-[#FFFFFF] rounded-t-[32px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
        style={{ 
          // Default height increased to 75%
          height: snap === 'compact' ? 'auto' : (isExpanded ? '92%' : '75%'),
          maxHeight: snap === 'compact' ? '45%' : '92%',
          transform: `translateY(${!visible ? '100%' : `${translateY}px`})`,
          transition: isDragging ? 'none' : 'transform 400ms cubic-bezier(0.32, 0.72, 0, 1), height 400ms cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom))'
        }}
      >
        {/* Fixed Header with more padding and slightly larger drag handle */}
        <div 
          className="w-full flex flex-col items-center pt-5 pb-3 cursor-grab active:cursor-grabbing touch-none shrink-0 bg-[#FFFFFF] rounded-t-[32px] z-10"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="w-14 h-2 bg-black/[0.08] rounded-full mb-4 pointer-events-none" />
          {title && <h3 className="text-[20px] font-bold text-[#111111] px-6 w-full text-center pointer-events-none">{title}</h3>}
        </div>

        {/* Scrollable Body with increased top breathing room */}
        <div 
          className="px-6 pb-6 pt-5 overflow-y-auto custom-scrollbar min-h-0 flex-1 w-full"
          onScroll={handleScroll}
        >
          {children}
        </div>

        {/* Fixed Footer */}
        {footer && (
          <div className="px-6 pb-8 pt-4 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-black/[0.04] shrink-0 z-10">
            {footer}
          </div>
        )}
      </div>
    </div>
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

const ListRow = ({ icon: Icon, avatar, title, subtitle, rightAccessory, onClick, className = '' }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 py-3 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
  >
    {avatar ? <Avatar {...avatar} size={avatar.size || 40} /> : Icon && (
      <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0">
        <Icon size={20} color={THEME.colors.accent} />
      </div>
    )}
    <div className="flex-1 flex flex-col justify-center min-w-0">
      <span className="text-[16px] font-semibold text-[#111111] truncate">{title}</span>
      {subtitle && <span className="text-[13px] text-[#6E6E73] truncate">{subtitle}</span>}
    </div>
    {rightAccessory && <div className="shrink-0 ml-2 text-[#CFCFD4] flex items-center">{rightAccessory}</div>}
  </div>
);

const RadioList = ({ options, value, onChange }) => (
  <div className="space-y-2">
    {options.map(opt => (
      <button 
        key={opt.id} 
        onClick={() => onChange(opt.id)} 
        className={`flex items-center justify-between w-full p-4 rounded-[14px] transition-all duration-200 active:scale-[0.98] border ${
          value === opt.id ? 'bg-[#FF6B35]/5 border-[#FF6B35]/30' : 'bg-[#F7F7F8] border-transparent hover:bg-black/5'
        }`}
      >
        <div className="flex flex-col items-start text-left pr-4">
          <span className={`text-[15px] font-semibold ${value === opt.id ? 'text-[#FF6B35]' : 'text-[#111111]'}`}>{opt.label}</span>
          {opt.description && <span className="text-[13px] text-[#6E6E73] mt-0.5 leading-snug">{opt.description}</span>}
        </div>
        <div className={`shrink-0 w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${value === opt.id ? 'border-[#FF6B35]' : 'border-black/20'}`}>
          {value === opt.id && <div className="w-2.5 h-2.5 bg-[#FF6B35] rounded-full" />}
        </div>
      </button>
    ))}
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
 * Enhanced Header Component
 */
const Header = ({ title, variant = 'default', user, onBack, onRightAction, rightIcon: RightIcon }) => {
  const handleAction = (action) => alert(`${action} — Coming in future steps`);

  return (
    <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent">
      {variant === 'default' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <h1 className="font-bold tracking-tight text-[#111111] drop-shadow-sm ml-1 flex items-center">
            {title === 'FYLOS' || !title ? <FylosLogo fontSize="22px" textColor="#111111" /> : title}
          </h1>
          <div className="flex items-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] p-1 h-[52px]">
            <button onClick={() => handleAction('Search')} className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-[0.98] transition-all">
              <Search size={20} color="#111111" strokeWidth={2} />
            </button>
            <div className="w-[1px] h-[20px] bg-black/[0.06]" />
            <button onClick={() => handleAction('Inbox')} className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-[0.98] transition-all">
              <Bell size={20} color="#111111" strokeWidth={2} />
              {user?.notifications > 0 && <span className="absolute top-[12px] right-[12px] w-[8px] h-[8px] bg-[#FF6B35] rounded-full border-[1.5px] border-white" />}
            </button>
            <div className="w-[1px] h-[20px] bg-black/[0.06]" />
            <button onClick={() => handleAction('Profile')} className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.98] transition-all">
              <img src={user?.avatar} className="w-[32px] h-[32px] rounded-full object-cover border border-black/[0.04]" alt="Profile avatar" />
            </button>
          </div>
        </div>
      )}

      {variant === 'detail' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button onClick={onBack || (() => handleAction('Back'))} className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] transition-all">
            <ChevronLeft size={22} color="#111111" />
          </button>
          <h2 className="text-[17px] font-semibold text-[#111111]">{title}</h2>
          {RightIcon ? (
            <button onClick={onRightAction || (() => handleAction('Menu'))} className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] transition-all">
              <RightIcon size={22} color="#111111" />
            </button>
          ) : (
            <div className="w-[44px]" /> 
          )}
        </div>
      )}
    </header>
  );
};

const TabBar = ({ activeTab, onTabChange }) => (
  <nav className="absolute bottom-[24px] left-0 w-full px-5 z-40 pointer-events-none" role="tablist">
    <div className="pointer-events-auto bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-[9999px] h-[72px] flex justify-between items-center px-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button key={tab.id} role="tab" aria-selected={isActive} onClick={() => onTabChange(tab.id)} className="relative flex-1 h-full flex flex-col items-center justify-center gap-[4px] group">
            <div className={`absolute top-[12px] w-[32px] h-[32px] bg-[#FF6B35] rounded-full blur-[12px] transition-opacity duration-[240ms] pointer-events-none ${isActive ? 'opacity-25' : 'opacity-0'}`} />
            <div className={`relative z-10 flex items-center justify-center transition-colors duration-[240ms] ${isActive ? 'text-[#FF6B35] animate-spring-bump' : 'text-[#8E8E93]'}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] font-medium leading-none transition-colors duration-[240ms] ${isActive ? 'text-[#FF6B35]' : 'text-[#8E8E93]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

const ScreenContainer = ({ children, isLocked, hideTabsPadding }) => (
  <div className={`absolute inset-0 overflow-x-hidden bg-[#FFFFFF] custom-scrollbar ${isLocked ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
    <div className={`min-h-full pt-[110px] ${hideTabsPadding ? 'pb-[40px]' : 'pb-[120px]'}`}>
      {children}
    </div>
  </div>
);

const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#111111] text-white px-5 py-3 rounded-full shadow-lg text-[14px] font-medium flex items-center gap-2">
        <CheckCircle2 size={16} className="text-[#00C060]" />
        {message}
      </div>
    </div>
  );
};

// --- PETS MODULE COMPONENTS ---

const PetProfileHeader = ({ pet, showToast }) => (
  <div className="flex flex-col items-center pt-2 pb-6 px-5 border-b border-black/[0.04]">
    <div className="relative group">
      <Avatar size={128} src={pet.photo} onClick={() => showToast('Change photo — coming soon')} />
      <div className="absolute bottom-0 right-0 w-10 h-10 bg-white border border-black/10 rounded-full flex items-center justify-center shadow-sm pointer-events-none">
        <Camera size={20} className="text-[#111111]" />
      </div>
    </div>
    <Text variant="title" className="mt-5">{pet.name}</Text>
    <Text variant="caption" className="mt-1.5">{pet.breed} · {pet.age} yrs</Text>
    
    <div className="flex gap-4 mt-5 text-[#6E6E73] text-[13px] font-medium bg-[#F7F7F8] px-4 py-2.5 rounded-[16px]">
      <span className="flex items-center gap-1.5"><MapPin size={14}/> {pet.location}</span>
      <div className="w-[1px] h-4 bg-black/10" />
      <span className="flex items-center gap-1.5">{pet.sex}</span>
      <div className="w-[1px] h-4 bg-black/10" />
      <span className="flex items-center gap-1.5">
        <span className="font-semibold text-[#111111]">{pet.weight}</span> {pet.weightUnit}
      </span>
    </div>
  </div>
);

const PetProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = ['About', 'Health', 'Documents', 'Emergency', 'Share'];
  const [tabStyle, setTabStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef([]);

  useEffect(() => {
    const activeEl = tabsRef.current[tabs.indexOf(activeTab)];
    if (activeEl) {
      setTabStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
    }
  }, [activeTab]);

  return (
    <div className="sticky top-0 z-20 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-black/[0.08] overflow-x-auto custom-scrollbar">
      <div className="flex px-5 min-w-max relative">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              ref={el => tabsRef.current[idx] = el}
              onClick={() => onTabChange(tab)}
              className={`py-4 px-4 text-[15px] font-semibold transition-colors duration-200 ${isActive ? 'text-[#FF6B35]' : 'text-[#8E8E93] hover:text-[#111111]'}`}
            >
              {tab}
            </button>
          );
        })}
        {/* Sliding Underline */}
        <div 
          className="absolute bottom-0 h-[2px] bg-[#FF6B35] transition-all duration-300 ease-out"
          style={{ left: tabStyle.left, width: tabStyle.width }}
        />
      </div>
    </div>
  );
};

const InfoRow = ({ label, value, onEdit, isCopy }) => (
  <div className="flex items-center justify-between min-h-[52px] py-2">
    <span className="text-[13px] font-medium text-[#6E6E73]">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-[15px] font-semibold text-[#111111] text-right max-w-[180px] truncate">{value}</span>
      <button onClick={onEdit} className="p-1.5 rounded-full text-[#111111] opacity-60 hover:opacity-100 active:opacity-100 hover:bg-[#F7F7F8] active:scale-95 transition-all">
        {isCopy ? <Copy size={16} /> : <Pencil size={16} />}
      </button>
    </div>
  </div>
);

const EnergySlider = ({ value, onChange }) => {
  const getLabel = (v) => {
    if (v <= 25) return 'Low';
    if (v <= 50) return 'Medium';
    if (v <= 75) return 'High';
    return 'Very High';
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <h3 className="text-[16px] font-semibold text-[#111111]">Energy Level</h3>
        <span className={`text-[13px] font-semibold ${value > 50 ? 'text-[#FF6B35]' : 'text-[#6E6E73]'}`}>{getLabel(value)}</span>
      </div>
      <input 
        type="range" min="0" max="100" value={value} 
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="energy-slider"
        style={{ background: `linear-gradient(to right, #FF6B35 ${value}%, rgba(0,0,0,0.08) ${value}%)` }}
      />
    </div>
  );
};

const AboutTab = ({ 
  pet, onUpdate, showToast, 
  onOpenEdit, onOpenTrigger, onOpenMilestone, 
  onRemoveTrigger, onToggleChip, onDeleteMilestone 
}) => {
  const handleCopy = (text) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  return (
    <div className="px-5 py-6 space-y-6">
      <section>
        <h3 className="text-[16px] font-semibold text-[#111111] mb-3">Basic Info</h3>
        <Card className="!px-4 !py-1">
          <InfoRow label="Full Name" value={pet.name} onEdit={() => onOpenEdit('name', 'Name', pet.name)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Breed" value={pet.breed} onEdit={() => onOpenEdit('breed', 'Breed', pet.breed)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Date of Birth" value={pet.dob} onEdit={() => onOpenEdit('dob', 'Date of Birth', pet.dob, 'date')} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Sex" value={pet.sex} onEdit={() => onOpenEdit('sex', 'Sex', pet.sex)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Weight" value={`${pet.weight} ${pet.weightUnit}`} onEdit={() => onOpenEdit('weight', 'Weight', pet.weight, 'number')} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Color/Markings" value={pet.color} onEdit={() => onOpenEdit('color', 'Color', pet.color)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Microchip" value={pet.microchip} onEdit={() => handleCopy(pet.microchip)} isCopy />
        </Card>
      </section>

      <section className="space-y-6">
        <EnergySlider value={pet.energyLevel} onChange={(v) => onUpdate({ ...pet, energyLevel: v })} />
        <div>
          <h3 className="text-[16px] font-semibold text-[#111111] mb-3">Temperament</h3>
          <div className="flex flex-wrap gap-2">
            {TEMPERAMENT_OPTIONS.map(chip => {
              const isActive = pet.temperament.includes(chip);
              return (
                <button
                  key={chip} onClick={() => onToggleChip(chip)}
                  className={`px-3.5 py-1.5 rounded-full text-[14px] font-medium transition-all duration-120 active:scale-[0.98] ${
                    isActive ? 'bg-[#FF6B35]/12 border border-[#FF6B35]/30 text-[#FF6B35]' : 'bg-[#F7F7F8] border border-black/[0.08] text-[#6E6E73] hover:bg-black/5'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="text-[16px] font-semibold text-[#111111] mb-3">Anxiety Triggers</h3>
          <div className="flex flex-wrap gap-2">
            {pet.anxietyTriggers.map(trigger => (
              <div key={trigger} className="flex items-center gap-1 pl-3 pr-2 py-1.5 bg-[#FF3B30]/10 text-[#FF3B30] rounded-full text-[14px] font-medium">
                {trigger}
                <button onClick={() => onRemoveTrigger(trigger)} className="p-0.5 rounded-full opacity-85 hover:opacity-100 transition-opacity"><X size={14} /></button>
              </div>
            ))}
            <button onClick={onOpenTrigger} className="flex items-center gap-1 px-3 py-1.5 bg-[#F7F7F8] text-[#111111] border border-black/[0.08] rounded-full text-[14px] font-medium hover:bg-black/5 active:scale-[0.98] transition-all">
              <Plus size={16} /> Add trigger
            </button>
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-[16px] font-semibold text-[#111111] mb-3">Preferences</h3>
        <Card className="!px-4 !py-1">
          <InfoRow label="Favorite Treats" value={pet.preferences.treats} onEdit={() => onOpenEdit('treats', 'Treats', pet.preferences.treats, 'text', true)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Favorite Toys" value={pet.preferences.toys} onEdit={() => onOpenEdit('toys', 'Toys', pet.preferences.toys, 'text', true)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Food Brand" value={pet.preferences.foodBrand} onEdit={() => onOpenEdit('foodBrand', 'Food Brand', pet.preferences.foodBrand, 'text', true)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Sleeping Spot" value={pet.preferences.sleepingSpot} onEdit={() => onOpenEdit('sleepingSpot', 'Sleeping Spot', pet.preferences.sleepingSpot, 'text', true)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Walking" value={pet.preferences.walking} onEdit={() => onOpenEdit('walking', 'Walking Config', pet.preferences.walking, 'text', true)} />
        </Card>
      </section>

      <section className="pt-4">
        <h3 className="text-[16px] font-semibold text-[#111111] mb-4">Milestones</h3>
        <div className="relative pl-6 border-l-[2px] border-[#F0F0F2] space-y-6 pb-2">
          {pet.milestones.map(m => (
            <div key={m.id} className="relative group">
              <div className="absolute -left-[41px] top-0 w-8 h-8 bg-white border-2 border-[#F0F0F2] rounded-full flex items-center justify-center text-[14px] shadow-sm z-10">{m.icon}</div>
              <div className="flex justify-between items-start pt-1">
                <div>
                  <span className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider">{m.date}</span>
                  <h4 className="text-[16px] font-semibold text-[#111111] mt-1">{m.title}</h4>
                  {m.note && <p className="text-[14px] text-[#6E6E73] mt-1.5 leading-relaxed">{m.note}</p>}
                </div>
                <button onClick={() => onDeleteMilestone(m.id)} className="p-2 text-[#CFCFD4] hover:text-[#FF3B30] hover:bg-[#FFF0F0] rounded-full transition-colors active:scale-95"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="secondary" icon={Plus} onClick={onOpenMilestone} className="mt-4">Add milestone</Button>
      </section>
    </div>
  );
};

// --- SHARE MODULE (STEP 8) ---
const getPermissionBadgeVariant = (perm) => {
  if (!perm) return 'default';
  if (perm.includes('Full')) return 'info';
  if (perm.includes('Medical')) return 'warning';
  if (perm.includes('Edit')) return 'success';
  return 'default';
};

const ShareTab = ({ pet, shares, openSheet, onNavigateToFamily }) => {
  return (
    <div className="pb-8">
      {/* Sticky Top Panel for Quick Sharing */}
      <div className="sticky top-[56px] z-10 bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-black/[0.04] py-3 px-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex gap-3 mb-6">
        <button 
          onClick={() => openSheet('qr')}
          className="flex-1 h-[44px] flex items-center justify-center gap-2 bg-transparent border border-black/[0.08] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-black/5 active:scale-[0.98] transition-all"
        >
          <QrCode size={18} strokeWidth={2} />
          Share via QR
        </button>
        <button 
          onClick={() => openSheet('link')}
          className="flex-1 h-[44px] flex items-center justify-center gap-2 bg-transparent border border-black/[0.08] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-black/5 active:scale-[0.98] transition-all"
        >
          <LinkIcon size={18} strokeWidth={2} />
          Share via Link
        </button>
      </div>

      <div className="px-5 space-y-8">
        {/* A. Who has access */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[18px] font-bold text-[#111111]">Who has access</h3>
            <button onClick={() => openSheet('add')} className="w-8 h-8 flex items-center justify-center bg-[#F7F7F8] text-[#111111] rounded-full hover:bg-black/5 active:scale-[0.95] transition-all">
              <Plus size={18} strokeWidth={2.5} />
            </button>
          </div>
          
          <div className="space-y-3">
            {shares.map(share => (
              <div key={share.id} className="flex items-center gap-3 p-3 bg-[#FFFFFF] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] rounded-[16px]">
                <Avatar src={share.avatar} initials={share.name.charAt(0)} size={44} onClick={() => openSheet('details', share)} />
                <div className="flex-1 min-w-0" onClick={() => openSheet('details', share)}>
                  <div className="font-semibold text-[15px] text-[#111111] truncate">{share.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[13px] text-[#6E6E73]">{share.role}</span>
                    <span className="w-1 h-1 rounded-full bg-black/10" />
                    <Badge variant={getPermissionBadgeVariant(share.permission)} className="!text-[9px]">{share.permission}</Badge>
                  </div>
                  <div className="text-[#8E8E93] text-[12px] mt-1">Added {share.added}</div>
                </div>
                <button onClick={() => openSheet('miniMenu', share)} className="p-2 text-[#8E8E93] hover:text-[#111111] hover:bg-[#F7F7F8] rounded-full active:scale-95 transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* C. Family Sharing Summary */}
        <section>
          <h3 className="text-[18px] font-bold text-[#111111] mb-4">Family sharing</h3>
          <Card className="!p-0 overflow-hidden border border-black/[0.04]">
            <div className="p-4 bg-[#F7F7F8] border-b border-black/[0.04] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-[#6E6E73]" />
                <span className="text-[14px] font-semibold text-[#111111]">2 members</span>
              </div>
            </div>
            <div className="p-2 space-y-1">
              <div className="flex items-center gap-3 p-2">
                <Avatar src={INITIAL_SHARES[0].avatar} size={32} />
                <div className="flex-1 text-[14px]"><span className="font-semibold text-[#111111]">Marcus</span> <span className="text-[#6E6E73]">· Co-owner</span></div>
              </div>
              <div className="flex items-center gap-3 p-2">
                <Avatar src={INITIAL_SHARES[1].avatar} size={32} />
                <div className="flex-1 text-[14px]"><span className="font-semibold text-[#111111]">Sarah</span> <span className="text-[#6E6E73]">· Family</span></div>
              </div>
            </div>
            <button onClick={onNavigateToFamily} className="w-full p-4 text-[14px] font-semibold text-[#FF6B35] flex items-center justify-center gap-1.5 hover:bg-[#FF6B35]/5 transition-colors border-t border-black/[0.04]">
              Manage Family <ChevronRight size={16} />
            </button>
          </Card>
        </section>

        {/* D. Manage access subtle row */}
        <div className="pt-2 text-center">
          <p className="text-[13px] text-[#8E8E93] flex items-center justify-center gap-1.5"><Shield size={14}/> Review access & revoke anytime.</p>
        </div>
      </div>
    </div>
  );
};


// --- FAMILY SHARING SCREEN (STEP 8) ---
const FamilySharingScreen = ({ onBack, showToast }) => (
  <ScreenContainer hideTabsPadding>
    <div className="px-5 py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      <section>
        <h3 className="text-[16px] font-semibold text-[#111111] mb-3 uppercase tracking-wider text-[#8E8E93]">Co-owners (Full Access)</h3>
        <div className="bg-[#FFFFFF] rounded-[16px] border border-black/[0.04] shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
            <Avatar src={MOCK_USER.avatar} size={48} />
            <div className="flex-1">
              <div className="font-semibold text-[16px] text-[#111111]">Alex (You)</div>
              <div className="text-[13px] text-[#6E6E73]">Owner</div>
            </div>
            <Badge variant="default">Owner</Badge>
          </div>
          <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
            <Avatar src={INITIAL_SHARES[0].avatar} size={48} />
            <div className="flex-1">
              <div className="font-semibold text-[16px] text-[#111111]">{INITIAL_SHARES[0].name}</div>
              <div className="text-[13px] text-[#6E6E73]">{INITIAL_SHARES[0].role}</div>
            </div>
          </div>
          <button onClick={() => showToast('Add co-owner coming soon')} className="w-full p-4 flex items-center gap-3 text-[#FF6B35] font-semibold text-[15px] hover:bg-[#FF6B35]/5 transition-colors">
            <UserPlus size={18} /> Add co-owner
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-[16px] font-semibold text-[#111111] mb-3 uppercase tracking-wider text-[#8E8E93]">Family Members (Limited)</h3>
        <div className="bg-[#FFFFFF] rounded-[16px] border border-black/[0.04] shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
            <Avatar src={INITIAL_SHARES[1].avatar} size={48} />
            <div className="flex-1">
              <div className="font-semibold text-[16px] text-[#111111]">{INITIAL_SHARES[1].name}</div>
              <div className="text-[13px] text-[#6E6E73]">{INITIAL_SHARES[1].role}</div>
            </div>
          </div>
          <button onClick={() => showToast('Add family coming soon')} className="w-full p-4 flex items-center gap-3 text-[#FF6B35] font-semibold text-[15px] hover:bg-[#FF6B35]/5 transition-colors">
            <UserPlus size={18} /> Add family member
          </button>
        </div>
      </section>

      <Card variant="grey" className="!p-5">
        <h4 className="text-[15px] font-semibold text-[#111111] mb-2 flex items-center gap-2"><Info size={16} className="text-[#8E8E93]" /> About family sharing</h4>
        <p className="text-[13px] text-[#6E6E73] leading-relaxed">
          Co-owners have full administrative access. Family members can view the profile and add activity/health logs, but cannot change core settings or manage sharing.
        </p>
      </Card>
      
    </div>
  </ScreenContainer>
);


// --- MAIN SCREENS ---

const PetListScreen = ({ pets, onSelectPet }) => (
  <ScreenContainer>
    <div className="px-5 pt-4 pb-8 space-y-4">
      {pets.length === 0 ? (
        <EmptyState 
          icon={PawPrint} title="No Pets Yet" description="Add your first pet to start tracking their health, milestones, and more."
          actionLabel="Add Pet" onAction={() => alert('Add Pet — coming in Step 10')}
        />
      ) : (
        pets.map(pet => (
          <Card key={pet.id} clickable onClick={() => onSelectPet(pet.id)} className="!p-4">
            <ListRow 
              avatar={{ src: pet.photo, size: 80 }} 
              title={<span className="text-[18px]">{pet.name}</span>} 
              subtitle={`${pet.breed} · ${pet.age} yrs`} 
              rightAccessory={<ChevronRight size={24} color="#CFCFD4" strokeWidth={2} />}
            />
          </Card>
        ))
      )}
    </div>
  </ScreenContainer>
);

const PetProfileScreen = ({ pet, onUpdate, showToast, onNavigateToFamily }) => {
  const [activePetTab, setActivePetTab] = useState('Share'); // Defaulting to Share for Step 8 demo
  const [displayPetTab, setDisplayPetTab] = useState('Share');
  const [isFading, setIsFading] = useState(false);

  // LIFTED SHEET STATE for About Tab
  const [editSheet, setEditSheet] = useState(null); 
  const [triggerSheet, setTriggerSheet] = useState(false);
  const [milestoneSheet, setMilestoneSheet] = useState(false);
  const [newTrigger, setNewTrigger] = useState('');
  const [msTitle, setMsTitle] = useState('');
  const [msDate, setMsDate] = useState('');
  const [msNote, setMsNote] = useState('');

  // LIFTED SHEET STATE for Share Tab
  const [shares, setShares] = useState(INITIAL_SHARES);
  const [shareActiveSheet, setShareActiveSheet] = useState(null); // 'add' | 'qr' | 'link' | 'details' | 'change' | 'revoke' | 'miniMenu'
  const [selectedShare, setSelectedShare] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [shareConfig, setShareConfig] = useState({ permission: 'view', expiry: '24h' });

  const handleTabSwitch = (tab) => {
    if (tab === activePetTab) return;
    setActivePetTab(tab);
    setIsFading(true);
    setTimeout(() => {
      setDisplayPetTab(tab);
      setIsFading(false);
    }, 200);
  };

  // ABOUT TAB Actions
  const openEdit = (key, label, value, type = 'text', isPref = false) => {
    setEditSheet({ key, label, value: value || '', type, isPref });
  };
  const saveEdit = () => {
    const updatedPet = { ...pet };
    if (editSheet.isPref) {
      updatedPet.preferences = { ...updatedPet.preferences, [editSheet.key]: editSheet.value };
    } else {
      updatedPet[editSheet.key] = editSheet.value;
    }
    onUpdate(updatedPet);
    setEditSheet(null);
    showToast('Saved');
  };
  const toggleChip = (chip) => {
    let newTemps = [...pet.temperament];
    if (newTemps.includes(chip)) newTemps = newTemps.filter(c => c !== chip);
    else newTemps.push(chip);
    onUpdate({ ...pet, temperament: newTemps });
  };
  const removeTrigger = (trigger) => {
    onUpdate({ ...pet, anxietyTriggers: pet.anxietyTriggers.filter(t => t !== trigger) });
    showToast('Removed');
  };
  const addTrigger = (trigger) => {
    if (!trigger.trim() || pet.anxietyTriggers.includes(trigger)) return;
    onUpdate({ ...pet, anxietyTriggers: [...pet.anxietyTriggers, trigger.trim()] });
    setNewTrigger('');
    setTriggerSheet(false);
    showToast('Added');
  };
  const saveMilestone = () => {
    if (!msTitle || !msDate) return;
    const newMs = { id: Date.now().toString(), title: msTitle, date: msDate, note: msNote, icon: '🌟' };
    onUpdate({ ...pet, milestones: [newMs, ...pet.milestones] });
    setMsTitle(''); setMsDate(''); setMsNote('');
    setMilestoneSheet(false);
    showToast('Saved');
  };
  const deleteMilestone = (id) => {
    if (confirm('Delete this milestone?')) {
      onUpdate({ ...pet, milestones: pet.milestones.filter(m => m.id !== id) });
      showToast('Removed');
    }
  };

  // SHARE TAB Actions
  const openShareSheet = (sheet, share = null) => {
    if (share) setSelectedShare(share);
    setShareActiveSheet(sheet);
  };
  const closeShareSheet = () => {
    setShareActiveSheet(null);
    setTimeout(() => {
      setQrGenerated(false);
      setShareConfig({ permission: 'view', expiry: '24h' });
    }, 300);
  };
  const handleCopyLink = (text) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    showToast('Link copied to clipboard');
  };
  const handleRevokeShare = () => {
    setShares(shares.filter(s => s.id !== selectedShare.id));
    closeShareSheet();
    showToast('Access revoked');
  };
  const handleSavePermission = () => {
    const updated = shares.map(s => {
      if (s.id === selectedShare.id) {
        const permLabel = PERMISSION_LEVELS.find(p => p.id === shareConfig.permission)?.label || s.permission;
        return { ...s, permission: permLabel };
      }
      return s;
    });
    setShares(updated);
    closeShareSheet();
    showToast('Permissions updated');
  };

  if (!pet) return null;

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Scrollable Main Content
        Notice: Sheets are completely removed from inside this container 
      */}
      <ScreenContainer isLocked={false}>
        <PetProfileHeader pet={pet} showToast={showToast} />
        <PetProfileTabs activeTab={activePetTab} onTabChange={handleTabSwitch} />
        
        <div className={`transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          {displayPetTab === 'About' ? (
            <AboutTab 
              pet={pet} onUpdate={onUpdate} showToast={showToast}
              onOpenEdit={openEdit} onOpenTrigger={() => setTriggerSheet(true)}
              onOpenMilestone={() => setMilestoneSheet(true)}
              onRemoveTrigger={removeTrigger} onToggleChip={toggleChip}
              onDeleteMilestone={deleteMilestone}
            />
          ) : displayPetTab === 'Share' ? (
            <ShareTab 
              pet={pet} 
              shares={shares}
              openSheet={openShareSheet}
              onNavigateToFamily={onNavigateToFamily}
            />
          ) : (
            <div className="pt-10">
              <EmptyState icon={displayPetTab === 'Health' ? HeartPulse : displayPetTab === 'Documents' ? FileText : AlertCircle} title={displayPetTab} description={`Detailed ${displayPetTab.toLowerCase()} tracking coming in future steps.`} />
            </div>
          )}
        </div>
      </ScreenContainer>

      {/* ======================================================== */}
      {/* BOTTOM SHEETS RENDERED OUTSIDE SCROLLING CONTAINER */}
      {/* ======================================================== */}
      
      {/* ABOUT TAB SHEETS */}
      <BottomSheet 
        isOpen={!!editSheet} onClose={() => setEditSheet(null)} 
        title={`Edit ${editSheet?.label}`}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setEditSheet(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit}>Save</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <TextInput 
            type={editSheet?.type || 'text'}
            value={editSheet?.value || ''} 
            onChange={e => setEditSheet({ ...editSheet, value: e.target.value })}
            placeholder={`Enter ${editSheet?.label?.toLowerCase()}`}
          />
        </div>
      </BottomSheet>

      <BottomSheet 
        isOpen={triggerSheet} onClose={() => setTriggerSheet(false)} 
        title="Add Anxiety Trigger"
        footer={newTrigger && !COMMON_ANXIETY_TRIGGERS.includes(newTrigger) ? (
          <Button variant="secondary" onClick={() => addTrigger(newTrigger)}>Add "{newTrigger}"</Button>
        ) : null}
      >
        <div className="space-y-6">
          <SearchInput value={newTrigger} onChange={e => setNewTrigger(e.target.value)} onClear={() => setNewTrigger('')} placeholder="Search or type custom..." />
          <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar">
            {COMMON_ANXIETY_TRIGGERS.filter(t => t.toLowerCase().includes(newTrigger.toLowerCase()) && !pet.anxietyTriggers.includes(t)).map(t => (
              <button key={t} onClick={() => addTrigger(t)} className="w-full text-left px-4 py-3 bg-[#F7F7F8] rounded-[14px] text-[15px] font-medium text-[#111111] active:bg-[#E5E5E5]">
                {t}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      <BottomSheet 
        isOpen={milestoneSheet} onClose={() => setMilestoneSheet(false)} 
        title="Add Milestone"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setMilestoneSheet(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveMilestone} disabled={!msTitle || !msDate}>Save</Button>
          </div>
        }
      >
        <div className="space-y-5">
          <TextInput label="Title" placeholder="e.g., First trip to the vet" value={msTitle} onChange={e => setMsTitle(e.target.value)} />
          <TextInput label="Date" type="date" value={msDate} onChange={e => setMsDate(e.target.value)} />
          <TextInput label="Note (Optional)" placeholder="Add some details..." value={msNote} onChange={e => setMsNote(e.target.value)} />
        </div>
      </BottomSheet>

      {/* SHARE TAB SHEETS */}
      <BottomSheet 
        isOpen={shareActiveSheet === 'add'} onClose={closeShareSheet} 
        title={`Share ${pet.name}'s Profile`}
        snap="compact"
        footer={<Button variant="secondary" onClick={closeShareSheet}>Cancel</Button>}
      >
        <div className="space-y-3">
          <button onClick={() => openShareSheet('qr')} className="w-full flex items-center gap-4 p-4 bg-[#F7F7F8] rounded-[16px] hover:bg-black/5 active:scale-[0.98] transition-all text-left">
            <div className="w-12 h-12 bg-[#FFFFFF] rounded-full flex items-center justify-center shadow-sm"><QrCode size={24} className="text-[#FF6B35]" /></div>
            <div>
              <div className="text-[16px] font-semibold text-[#111111]">QR Code</div>
              <div className="text-[13px] text-[#6E6E73]">Let someone scan to access instantly</div>
            </div>
          </button>
          <button onClick={() => openShareSheet('link')} className="w-full flex items-center gap-4 p-4 bg-[#F7F7F8] rounded-[16px] hover:bg-black/5 active:scale-[0.98] transition-all text-left">
            <div className="w-12 h-12 bg-[#FFFFFF] rounded-full flex items-center justify-center shadow-sm"><LinkIcon size={24} className="text-[#007AFF]" /></div>
            <div>
              <div className="text-[16px] font-semibold text-[#111111]">Share Link</div>
              <div className="text-[13px] text-[#6E6E73]">Send a secure link via message</div>
            </div>
          </button>
          <button onClick={() => { showToast('Email invites coming soon'); closeShareSheet(); }} className="w-full flex items-center gap-4 p-4 bg-[#F7F7F8] rounded-[16px] hover:bg-black/5 active:scale-[0.98] transition-all text-left">
            <div className="w-12 h-12 bg-[#FFFFFF] rounded-full flex items-center justify-center shadow-sm"><Mail size={24} className="text-[#00C060]" /></div>
            <div>
              <div className="text-[16px] font-semibold text-[#111111]">Invite via Email</div>
              <div className="text-[13px] text-[#6E6E73]">Send a formal invitation to an inbox</div>
            </div>
          </button>
        </div>
      </BottomSheet>

      <BottomSheet 
        isOpen={shareActiveSheet === 'qr'} onClose={closeShareSheet} 
        title="Share via QR"
        footer={!qrGenerated ? (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={closeShareSheet}>Cancel</Button>
            <Button variant="primary" onClick={() => setQrGenerated(true)}>Generate QR</Button>
          </div>
        ) : (
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => { showToast('Saved to photos'); closeShareSheet(); }}>Save Image</Button>
            <Button variant="primary" onClick={() => { showToast('Opening share menu...'); closeShareSheet(); }}>Share QR</Button>
          </div>
        )}
      >
        <div className="space-y-6">
          {!qrGenerated ? (
            <>
              <div>
                <h4 className="text-[14px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-3">Permission Level</h4>
                <RadioList options={PERMISSION_LEVELS} value={shareConfig.permission} onChange={(v) => setShareConfig({ ...shareConfig, permission: v })} />
              </div>
              <Select label="Expires in" options={EXPIRY_OPTIONS} value={shareConfig.expiry} onChange={e => setShareConfig({ ...shareConfig, expiry: e.target.value })} />
            </>
          ) : (
            <div className="text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-[200px] h-[200px] mx-auto bg-white border border-black/10 rounded-2xl shadow-sm p-4 flex flex-col items-center justify-center relative mb-4 mt-2">
                <QrCode size={140} color="#111111" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/20 rounded-2xl pointer-events-none" />
                <FylosLogo fontSize="12px" className="absolute bg-white px-2 py-1 rounded-full bottom-[-10px] shadow-sm border border-black/[0.04]" />
              </div>
              <p className="text-[14px] font-medium text-[#FF6B35] mb-2 flex items-center justify-center gap-1.5"><Shield size={16}/> Active · Expires in {EXPIRY_OPTIONS.find(o => o.value === shareConfig.expiry)?.label}</p>
            </div>
          )}
        </div>
      </BottomSheet>

      <BottomSheet 
        isOpen={shareActiveSheet === 'link'} onClose={closeShareSheet} 
        title="Share via Link"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={closeShareSheet}>Cancel</Button>
            <Button variant="primary" onClick={() => { showToast('Opening share menu...'); closeShareSheet(); }}>Share Link</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div>
            <h4 className="text-[14px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-3">Permission Level</h4>
            <RadioList options={PERMISSION_LEVELS} value={shareConfig.permission} onChange={(v) => setShareConfig({ ...shareConfig, permission: v })} />
          </div>
          <Select label="Expires in" options={EXPIRY_OPTIONS} value={shareConfig.expiry} onChange={e => setShareConfig({ ...shareConfig, expiry: e.target.value })} />
          
          <div className="p-4 bg-[#FFF4E5] rounded-[14px] border border-[#FF9500]/20 flex items-start gap-3">
            <AlertTriangle size={20} className="text-[#FF9500] shrink-0 mt-0.5" />
            <p className="text-[13px] text-[#111111] leading-relaxed">Anyone with this generated link will be able to access {pet.name}'s profile until it expires.</p>
          </div>
          
          <div className="relative">
            <input type="text" readOnly value="fylos.app/s/lx89q2m" className="w-full h-[52px] pl-4 pr-12 bg-[#F7F7F8] border border-black/[0.08] rounded-[14px] text-[16px] text-[#111111] font-medium" />
            <button onClick={() => handleCopyLink('fylos.app/s/lx89q2m')} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-[#6E6E73] hover:text-[#111111] transition-colors bg-white rounded-md shadow-sm border border-black/5">
              <Copy size={16} />
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet 
        isOpen={shareActiveSheet === 'details' && !!selectedShare} onClose={closeShareSheet} 
        title="Access Details"
        footer={
          <div className="flex flex-col gap-3">
            <Button variant="secondary" onClick={() => {
              const mapPermId = PERMISSION_LEVELS.find(p => p.label === selectedShare.permission)?.id || 'view';
              setShareConfig({ ...shareConfig, permission: mapPermId });
              openShareSheet('change', selectedShare);
            }}>Change permissions</Button>
            <Button variant="destructive" onClick={() => openShareSheet('revoke', selectedShare)}>Revoke access</Button>
          </div>
        }
      >
        {selectedShare && (
          <div className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar src={selectedShare.avatar} initials={selectedShare.name.charAt(0)} size={72} className="mb-3" />
              <h3 className="text-[20px] font-bold text-[#111111]">{selectedShare.name}</h3>
              <p className="text-[14px] text-[#6E6E73] mt-1">{selectedShare.role}</p>
              <Badge variant={getPermissionBadgeVariant(selectedShare.permission)} className="mt-3">{selectedShare.permission}</Badge>
            </div>
            
            <Divider />

            <div className="grid grid-cols-2 gap-4 bg-[#F7F7F8] p-4 rounded-[16px]">
              <div>
                <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Added</p>
                <p className="text-[14px] font-medium text-[#111111]">{selectedShare.added}</p>
              </div>
              <div>
                <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Expires</p>
                <p className="text-[14px] font-medium text-[#111111]">Never</p>
              </div>
              <div className="col-span-2 pt-2 border-t border-black/[0.04]">
                <p className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Last Accessed</p>
                <p className="text-[14px] font-medium text-[#111111]">Today, 10:42 AM</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-[14px] font-semibold text-[#111111] mb-2 flex items-center gap-2"><Check size={16} className="text-[#00C060]"/> What they can do</h4>
                <ul className="space-y-1.5 text-[14px] text-[#6E6E73] pl-6">
                  {selectedShare.permission.includes('View') || selectedShare.permission.includes('Medical') ? (
                    <li>View basic info and health records</li>
                  ) : (
                    <><li>Edit profile details and preferences</li><li>Add new milestones and documents</li></>
                  )}
                  {selectedShare.permission.includes('Full') && <li>Manage sharing and family members</li>}
                </ul>
              </div>
              {selectedShare.permission.includes('View') && (
                <div>
                  <h4 className="text-[14px] font-semibold text-[#111111] mb-2 flex items-center gap-2"><X size={16} className="text-[#FF3B30]"/> What they cannot do</h4>
                  <ul className="space-y-1.5 text-[14px] text-[#6E6E73] pl-6">
                    <li>Edit any profile information</li>
                    <li>Delete records or milestones</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </BottomSheet>

      {/* iOS Style Action Menu */}
      <BottomSheet isOpen={shareActiveSheet === 'miniMenu' && !!selectedShare} onClose={closeShareSheet} snap="compact">
        <div className="space-y-3 pb-2 px-1">
          <div className="bg-[#F7F7F8] rounded-[16px] overflow-hidden flex flex-col">
            <button onClick={() => openShareSheet('details', selectedShare)} className="w-full p-4 text-[16px] font-semibold text-[#111111] border-b border-black/[0.04] hover:bg-black/5 active:bg-black/10 transition-colors">
              View details
            </button>
            <button onClick={() => {
                const mapPermId = PERMISSION_LEVELS.find(p => p.label === selectedShare.permission)?.id || 'view';
                setShareConfig({ ...shareConfig, permission: mapPermId });
                openShareSheet('change', selectedShare);
            }} className="w-full p-4 text-[16px] font-semibold text-[#111111] hover:bg-black/5 active:bg-black/10 transition-colors">
              Change permissions
            </button>
          </div>
          <div className="bg-[#FFFFFF] rounded-[16px] overflow-hidden border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex flex-col">
            <button onClick={() => openShareSheet('revoke', selectedShare)} className="w-full p-4 text-[16px] font-semibold text-[#FF3B30] hover:bg-[#FFF0F0] active:bg-[#FFE5E5] transition-colors">
              Revoke access
            </button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet 
        isOpen={shareActiveSheet === 'change' && !!selectedShare} onClose={closeShareSheet} 
        title="Change permissions"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => openShareSheet('details', selectedShare)}>Cancel</Button>
            <Button variant="primary" onClick={handleSavePermission}>Save changes</Button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 bg-[#F7F7F8] p-3 rounded-xl border border-black/[0.04]">
            <Avatar src={selectedShare?.avatar} size={40} />
            <div>
              <div className="text-[15px] font-semibold text-[#111111]">{selectedShare?.name}</div>
              <div className="text-[13px] text-[#6E6E73]">Current: {selectedShare?.permission}</div>
            </div>
          </div>
          <div>
            <h4 className="text-[14px] font-semibold text-[#6E6E73] uppercase tracking-wider mb-3">New Permission Level</h4>
            <RadioList options={PERMISSION_LEVELS} value={shareConfig.permission} onChange={(v) => setShareConfig({ ...shareConfig, permission: v })} />
          </div>
          <Select label="Expires in" options={EXPIRY_OPTIONS} value={shareConfig.expiry} onChange={e => setShareConfig({ ...shareConfig, expiry: e.target.value })} />
        </div>
      </BottomSheet>
      
      {/* Revoke confirmation - Compact */}
      <BottomSheet 
        isOpen={shareActiveSheet === 'revoke' && !!selectedShare} onClose={closeShareSheet} 
        snap="compact"
      >
        <div className="flex flex-col items-center text-center px-2 py-2">
          <div className="w-16 h-16 bg-[#FFF0F0] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <AlertTriangle size={32} className="text-[#FF3B30]" />
          </div>
          <h3 className="text-[20px] font-bold text-[#111111] mb-3">Revoke access?</h3>
          <p className="text-[15px] text-[#6E6E73] mb-8 leading-relaxed max-w-[280px]">
            {selectedShare?.name} will no longer be able to view {pet.name}'s profile. This action cannot be undone.
          </p>
          <div className="flex flex-col gap-3 w-full">
            <Button variant="destructive" onClick={handleRevokeShare}>Yes, revoke access</Button>
            <Button variant="secondary" onClick={() => openShareSheet('details', selectedShare)}>Cancel</Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};

// Placeholder Screens for Tab Dock
const HomeScreen = () => (
  <ScreenContainer>
    <div className="px-5 pt-4 pb-8"><Text variant="title">Home</Text><Text variant="caption">Dashboard overview placeholder</Text></div>
  </ScreenContainer>
);
const ServicesScreen = () => (
  <ScreenContainer><EmptyState icon={Calendar} title="Services" description="Book and manage appointments" /></ScreenContainer>
);
const ActivityScreen = () => (
  <ScreenContainer><EmptyState icon={Activity} title="Activity" description="Journal and stats" /></ScreenContainer>
);
const VaultScreen = () => (
  <ScreenContainer><EmptyState icon={Folder} title="Vault" description="Document storage and health records" /></ScreenContainer>
);

// --- APP SHELL (MAIN ENTRY POINT) ---

export default function App() {
  const [activeTab, setActiveTab] = useState('pets'); // Default to Pets for Step 4/8 Demo
  const [displayTab, setDisplayTab] = useState('pets');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // App-level state for Pets Module
  const [petsData, setPetsData] = useState(INITIAL_MOCK_PETS);
  const [petsRoute, setPetsRoute] = useState('profile'); // 'list' | 'profile' | 'family'
  const [selectedPetId, setSelectedPetId] = useState(INITIAL_MOCK_PETS[0].id);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Pets Routing Logic
  useEffect(() => {
    if (displayTab === 'pets') {
      if (petsData.length === 1 && petsRoute !== 'profile' && petsRoute !== 'family') {
        setPetsRoute('profile');
        setSelectedPetId(petsData[0].id);
      } else if (petsData.length > 1 && !selectedPetId && petsRoute !== 'list') {
        setPetsRoute('list');
      }
    }
  }, [displayTab, petsData.length, selectedPetId, petsRoute]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return; 
    setActiveTab(tabId);
    setIsFading(true);
    setTimeout(() => {
      setDisplayTab(tabId);
      setIsFading(false);
    }, 150);
  };

  const handlePetSelect = (id) => {
    setSelectedPetId(id);
    setPetsRoute('profile');
  };

  const handlePetBack = () => {
    if (petsRoute === 'family') {
      setPetsRoute('profile');
    } else if (petsData.length > 1) {
      setPetsRoute('list');
      setSelectedPetId(null);
    } else {
      handleTabChange('home');
    }
  };

  const handleUpdatePet = (updatedPet) => {
    setPetsData(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
  };

  const renderScreen = () => {
    if (displayTab === 'pets') {
      if (petsRoute === 'family') {
        return <FamilySharingScreen onBack={handlePetBack} showToast={showToast} />;
      }
      if (petsRoute === 'profile') {
        const pet = petsData.find(p => p.id === selectedPetId) || petsData[0];
        return <PetProfileScreen pet={pet} onUpdate={handleUpdatePet} showToast={showToast} onNavigateToFamily={() => setPetsRoute('family')} />;
      }
      return <PetListScreen pets={petsData} onSelectPet={handlePetSelect} />;
    }
    
    switch (displayTab) {
      case 'home': return <HomeScreen />;
      case 'services': return <ServicesScreen />;
      case 'activity': return <ActivityScreen />;
      case 'vault': return <VaultScreen />;
      default: return <HomeScreen />;
    }
  };

  const getHeaderConfig = () => {
    if (activeTab === 'pets') {
      if (petsRoute === 'family') {
        return { title: 'Family sharing', variant: 'detail', onBack: handlePetBack };
      }
      if (petsRoute === 'profile') {
        const pet = petsData.find(p => p.id === selectedPetId) || petsData[0];
        return { title: pet ? pet.name : 'Profile', variant: 'detail', onBack: handlePetBack, rightIcon: MoreHorizontal };
      }
      return { 
        title: 'Pets', variant: 'detail', 
        onBack: () => handleTabChange('home'), 
        rightIcon: Plus,
        onRightAction: () => showToast('Add Pet — coming in Step 10')
      };
    }
    const tab = TABS.find(t => t.id === activeTab);
    return { title: tab ? tab.label : 'FYLOS', variant: 'default' };
  };

  const headerConfig = getHeaderConfig();

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
        .animate-spring-bump { animation: springBump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        /* Step 4 Energy Slider Custom CSS */
        .energy-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          outline: none;
        }
        .energy-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #FFFFFF;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          cursor: pointer;
        }
        .energy-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #FFFFFF;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          cursor: pointer;
        }
      `}} />

      <div 
        className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200"
        style={{ transform: 'translateZ(0)' }}
      >
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {isLoading ? (
          <div className="absolute inset-0 bg-[#FFFFFF] z-50 flex flex-col items-center justify-center animate-out fade-out duration-500 fill-mode-forwards delay-700">
            <FylosLogo fontSize="32px" textColor="#111111" className="mb-3" />
            <p className="text-[14px] text-[#8E8E93] animate-pulse">Loading...</p>
          </div>
        ) : (
          <>
            <main className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              {renderScreen()}
            </main>
            
            <Header {...headerConfig} user={MOCK_USER} />
            {petsRoute !== 'family' && <TabBar activeTab={activeTab} onTabChange={handleTabChange} />}
            <Toast message={toastMessage} />
          </>
        )}
      </div>
    </div>
  );
}