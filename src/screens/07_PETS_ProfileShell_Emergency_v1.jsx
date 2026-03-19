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
  Phone,
  ShieldAlert,
  QrCode,
  ExternalLink,
  ChevronUp,
  Heart,
  Stethoscope,
  Syringe,
  AlertOctagon,
  Link,
  PhoneCall
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
    address: 'Bahnhofstrasse 1, 8001 Zurich',
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
    ],
    emergencyContacts: [
      { id: 'ec1', name: 'Alex (Owner)', relationship: 'Owner', phone: '+41 79 123 45 67', isPrimary: true },
      { id: 'ec2', name: 'Maria Schmidt', relationship: 'Partner', phone: '+41 79 987 65 43', isPrimary: false },
      { id: 'ec3', name: 'John Doe', relationship: 'Neighbor', phone: '+41 78 111 22 33', isPrimary: false },
      { id: 'ec4', name: 'Jane Smith', relationship: 'Friend', phone: '+41 76 555 44 33', isPrimary: false },
    ],
    vets: [
      { id: 'v1', clinic: 'Zurich Animal Hospital', name: 'Dr. Meier', type: 'Primary', phone: '+41 44 123 45 67', address: 'Dog Street 1, Zurich' },
      { id: 'v2', clinic: 'Tierspital Zurich (24/7)', name: '', type: 'Emergency', phone: '+41 44 999 99 99', address: 'Cat Avenue 99, Zurich' },
      { id: 'v3', clinic: 'OrthoPet Specialists', name: 'Dr. Weber', type: 'Specialist', phone: '+41 44 555 66 77', address: 'Bone Lane 5, Zurich' },
    ],
    medical: {
      allergies: [
        { id: 'a1', name: 'Bee Stings', severity: 'Severe' },
        { id: 'a2', name: 'Chicken', severity: 'Moderate' },
        { id: 'a3', name: 'Dust Mites', severity: 'Mild' },
      ],
      medications: [
        { id: 'med1', name: 'Apoquel', dosage: '16mg daily', status: 'Active' },
        { id: 'med2', name: 'NexGard', dosage: 'Monthly', status: 'Active' },
      ],
      conditions: [
        { id: 'c1', name: 'Mild Arthritis', status: 'Monitored' },
      ]
    }
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
    address: 'Bahnhofstrasse 1, 8001 Zurich',
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
    ],
    emergencyContacts: [
      { id: 'ec1', name: 'Alex (Owner)', relationship: 'Owner', phone: '+41 79 123 45 67', isPrimary: true }
    ],
    vets: [
      { id: 'v1', clinic: 'City Cat Clinic', name: 'Dr. Rossi', type: 'Primary', phone: '+41 44 222 33 44', address: 'Meow Str 2, Zurich' }
    ],
    medical: { allergies: [], medications: [], conditions: [] }
  }
];

const TEMPERAMENT_OPTIONS = ['Friendly', 'Playful', 'Calm', 'Shy', 'Protective', 'Energetic', 'Independent', 'Affectionate', 'Curious', 'Stubborn'];
const COMMON_ANXIETY_TRIGGERS = ['Thunder', 'Fireworks', 'Vacuum cleaner', 'Car rides', 'Strangers', 'Other dogs', 'Loud noises', 'Vet visits'];
const RELATIONSHIP_OPTIONS = [{label: 'Owner', value: 'Owner'}, {label: 'Partner', value: 'Partner'}, {label: 'Family', value: 'Family'}, {label: 'Friend', value: 'Friend'}, {label: 'Neighbor', value: 'Neighbor'}, {label: 'Other', value: 'Other'}];
const VET_TYPE_OPTIONS = [{label: 'Primary Vet', value: 'Primary'}, {label: 'Emergency 24/7', value: 'Emergency'}, {label: 'Specialist', value: 'Specialist'}];

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
  return <div className={`w-full h-[1px] bg-[${THEME.colors.divider}] ${spacings[spacing]} ${className}`} />;
};

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-[#F7F7F8] text-[#6E6E73] border border-black/[0.04]",
    primary: "bg-[#111111] text-white border border-[#111111]",
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
  const baseStyles = "relative flex items-center justify-center font-semibold transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2";
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.25)] hover:bg-[#E85D2A]",
    secondary: "bg-[#FFFFFF] text-[#111111] border-[1.5px] border-black/[0.08] shadow-sm hover:bg-[#F7F7F8]",
    destructive: "bg-[#FFF0F0] text-[#FF3B30] hover:bg-[#FFE5E5]",
    ghost: "bg-transparent text-[#6E6E73] hover:bg-black/5"
  };
  const sizes = {
    small: "h-[36px] px-3 text-[14px]",
    medium: "h-[44px] px-4 text-[16px]",
    large: "h-[52px] px-6 text-[18px]"
  };
  const isDisabled = disabled || isLoading;
  const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed active:scale-100 shadow-none hover:bg-auto" : "";
  const widthClass = fullWidth ? "w-full" : "w-auto inline-flex";
  
  // Default radius if none is passed in className
  const radiusClass = className.includes('rounded-') ? '' : 'rounded-[14px]';

  return (
    <button 
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${radiusClass} ${disabledStyles} ${className}`}
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
    default: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
    highlighted: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-[4px] border-l-[#FF6B35]",
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
      className={`w-full h-[48px] px-4 bg-[#FFFFFF] border text-[16px] text-[#111111] rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 ${
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
        className="w-full h-[48px] px-4 pr-10 bg-[#FFFFFF] border border-black/[0.08] text-[16px] text-[#111111] rounded-xl appearance-none transition-all duration-200 focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10"
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
 * Fixed BottomSheet: 65vh max height, internal scroll, fixed header/footer
 */
const BottomSheet = ({ isOpen, onClose, title, children, footer }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);

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

  const handleTouchStart = (e) => { 
    touchStartY.current = e.touches[0].clientY; 
    setTranslateY(0);
  };
  
  const handleTouchMove = (e) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setTranslateY(delta);
  };
  
  const handleTouchEnd = () => {
    if (translateY > 80) onClose();
    else setTranslateY(0);
  };

  if (!render) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-auto flex flex-col justify-end">
      <div 
        className={`absolute inset-0 bg-black/35 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="relative w-full bg-[#FFFFFF] rounded-t-[32px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[65vh]"
        style={{ 
          transform: `translateY(${!visible ? '100%' : `${translateY}px`})`,
          transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)'
        }}
      >
        {/* Drag Handle */}
        <div 
          className="w-full flex justify-center pt-4 pb-4 cursor-grab active:cursor-grabbing touch-none shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-black/[0.12] rounded-full" />
        </div>
        
        {/* Fixed Header */}
        {title && (
          <div className="px-6 pb-4 shrink-0">
            <h3 className="text-[20px] font-bold text-[#111111]">{title}</h3>
          </div>
        )}
        
        {/* Scrollable Body */}
        <div className="px-6 overflow-y-auto custom-scrollbar flex-1 pb-2">
          {children}
        </div>

        {/* Fixed Footer */}
        {footer && (
          <div className="px-6 pt-4 pb-[calc(max(env(safe-area-inset-bottom),24px))] bg-white border-t border-black/[0.04] shrink-0">
            {footer}
          </div>
        )}
        {!footer && <div className="h-[calc(max(env(safe-area-inset-bottom),24px))] shrink-0" />}
      </div>
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
          <button onClick={onRightAction || (() => handleAction('Menu'))} className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] transition-all">
            {RightIcon ? <RightIcon size={22} color="#111111" /> : <MoreHorizontal size={22} color="#111111" />}
          </button>
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

const ScreenContainer = ({ children, isLocked }) => (
  <div className={`absolute inset-0 overflow-x-hidden bg-[#FFFFFF] custom-scrollbar ${isLocked ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
    <div className="min-h-full pt-[110px] pb-[120px]">
      {children}
    </div>
  </div>
);

const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#111111] text-white px-5 py-3 rounded-full shadow-lg text-[14px] font-medium flex items-center gap-2 whitespace-nowrap">
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

// --- SUB-TABS ---

// ABOUT TAB (Step 4)
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
    if (v <= 25) return 'Low'; if (v <= 50) return 'Medium'; if (v <= 75) return 'High'; return 'Very High';
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
    <div className="px-5 py-6 space-y-6 pb-24">
      <section>
        <h3 className="text-[16px] font-semibold text-[#111111] mb-3">Basic Info</h3>
        <div className="bg-[#FFFFFF] border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[16px] px-4">
          <InfoRow label="Full Name" value={pet.name} onEdit={() => onOpenEdit('name', 'Name', pet.name)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Breed" value={pet.breed} onEdit={() => onOpenEdit('breed', 'Breed', pet.breed)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Date of Birth" value={pet.dob} onEdit={() => onOpenEdit('dob', 'Date of Birth', pet.dob, 'date')} />
        </div>
      </section>
      {/* Reduced About tab contents for brevity in this step, focusing on Emergency */}
    </div>
  );
};

// EMERGENCY TAB (Step 7)
const SectionHeader = ({ title, actionIcon: ActionIcon, onAction }) => (
  <div className="flex justify-between items-center mb-3">
    <h3 className="text-[16px] font-semibold text-[#111111]">{title}</h3>
    {ActionIcon && onAction && (
      <button onClick={onAction} className="p-1.5 text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded-full transition-colors">
        <ActionIcon size={18} strokeWidth={2.5} />
      </button>
    )}
  </div>
);

const ExpandableList = ({ items, renderItem, limit = 2 }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, limit);
  const hasMore = items.length > limit;

  return (
    <div className="bg-[#FFFFFF] border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[16px] overflow-hidden flex flex-col">
      <div className={`flex flex-col ${expanded ? 'max-h-[430px] overflow-y-auto custom-scrollbar' : ''}`}>
        {visibleItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderItem(item)}
            {index < visibleItems.length - 1 && <div className="mx-4 h-[1px] bg-black/[0.06] shrink-0" />}
          </React.Fragment>
        ))}
      </div>
      {hasMore && (
        <>
          <div className="mx-4 h-[1px] bg-black/[0.06] shrink-0" />
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full h-[44px] flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#6E6E73] hover:text-[#111111] hover:bg-[#F7F7F8] transition-colors shrink-0"
          >
            {expanded ? 'Show less' : `View all (${items.length})`}
            <ChevronDown size={16} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </>
      )}
      {items.length === 0 && (
        <div className="p-4 text-center text-[14px] text-[#8E8E93]">No records found.</div>
      )}
    </div>
  );
};

const MedicalSubsection = ({ title, icon: Icon, items, type, showAll = false }) => {
  const [expanded, setExpanded] = useState(showAll);
  const visible = expanded ? items : items.slice(0, 2);
  const hasMore = !showAll && items.length > 2;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-[#8E8E93] mb-2">
        <Icon size={14} /> <span className="text-[12px] font-semibold uppercase tracking-wider">{title}</span>
      </div>
      {items.length > 0 ? (
        <div className="space-y-1">
          {visible.map(item => {
            const isSev = item.severity === 'Severe';
            const isMod = item.severity === 'Moderate';
            const bgClass = isSev ? 'bg-[#FFF0F0]' : isMod ? 'bg-[#FFF4E5]' : 'bg-transparent';
            
            return (
              <div key={item.id} className={`flex justify-between items-center py-2 px-3 -mx-3 rounded-[10px] ${bgClass}`}>
                <span className="text-[15px] font-medium text-[#111111]">{item.name}</span>
                {type === 'allergies' ? (
                  <Badge variant={isSev ? 'error' : isMod ? 'warning' : 'default'}>{item.severity}</Badge>
                ) : (
                  <span className="text-[13px] text-[#6E6E73]">{item.dosage || item.status}</span>
                )}
              </div>
            );
          })}
          {hasMore && (
             <button onClick={() => setExpanded(!expanded)} className="text-[13px] font-semibold text-[#6E6E73] hover:text-[#111111] py-1.5 flex items-center gap-1 transition-colors mt-1">
               {expanded ? 'Show less' : `View all (${items.length})`}
               <ChevronDown size={14} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
             </button>
          )}
        </div>
      ) : <span className="text-[14px] text-[#6E6E73]">None recorded</span>}
    </div>
  );
};

const EmergencyTab = ({ pet, showToast, navigateToTab, onUpdate, onOpenPublicView }) => {
  // Local Sheet States
  const [contactSheet, setContactSheet] = useState(null); 
  const [vetSheet, setVetSheet] = useState(null); 
  const [shareSheet, setShareSheet] = useState(false);
  const [moreSheet, setMoreSheet] = useState(false);

  // Checks for primary badge conflicts
  const hasOtherPrimary = pet.emergencyContacts.some(c => c.isPrimary && c.id !== contactSheet?.id);

  // Handlers
  const handleCall = (e, phone, name) => {
    e.stopPropagation();
    showToast(`Calling ${name}...`);
    setTimeout(() => { window.location.href = `tel:${phone.replace(/\s/g, '')}`; }, 500);
  };

  const handleCopy = (text, label) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    showToast(`${label} copied`);
  };

  const saveContact = (contact) => {
    const isNew = !contact.id;
    let newContacts = [...pet.emergencyContacts];
    
    // Ensure only 1 primary contact
    if (contact.isPrimary) {
      newContacts = newContacts.map(c => ({ ...c, isPrimary: false }));
    }

    if (isNew) {
      newContacts.push({ ...contact, id: `ec${Date.now()}` });
    } else {
      const idx = newContacts.findIndex(c => c.id === contact.id);
      if (idx >= 0) newContacts[idx] = contact;
    }

    // Sort: primary first
    newContacts.sort((a,b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
    onUpdate({ ...pet, emergencyContacts: newContacts });
    setContactSheet(null);
    showToast('Contact saved');
  };

  const saveVet = (vet) => {
    const isNew = !vet.id;
    let newVets = [...pet.vets];
    if (isNew) {
      newVets.push({ ...vet, id: `v${Date.now()}` });
    } else {
      newVets = newVets.map(v => v.id === vet.id ? vet : v);
    }
    onUpdate({ ...pet, vets: newVets });
    setVetSheet(null);
    showToast('Vet saved');
  };

  return (
    <div className="relative min-h-full flex flex-col">
      {/* Top Sticky Mini Actions */}
      <div className="sticky top-[53px] z-10 bg-[#FFFFFF]/90 backdrop-blur-xl border-b border-black/[0.04] px-5 py-3 flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
        <button 
          onClick={() => handleCall({stopPropagation:()=>{}}, pet.vets.find(v=>v.type==='Emergency')?.phone || '112', 'Emergency Vet')}
          className="flex-1 flex items-center justify-center gap-1.5 h-[36px] bg-[#F7F7F8] hover:bg-[#F0F0F2] active:bg-[#E5E5E5] text-[#111111] text-[13px] font-semibold rounded-full transition-colors"
        >
          <Phone size={14}/> Call Vet
        </button>
        <button 
          onClick={() => setShareSheet(true)}
          className="flex-1 flex items-center justify-center gap-1.5 h-[36px] bg-[#FF6B35]/10 hover:bg-[#FF6B35]/15 active:bg-[#FF6B35]/20 text-[#FF6B35] text-[13px] font-semibold rounded-full transition-colors"
        >
          <Share2 size={14}/> Share
        </button>
        <button 
          onClick={() => setMoreSheet(true)}
          className="w-[36px] h-[36px] flex items-center justify-center bg-[#F7F7F8] hover:bg-[#F0F0F2] active:bg-[#E5E5E5] text-[#111111] rounded-full shrink-0 transition-colors"
        >
          <MoreHorizontal size={16}/>
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="px-5 py-4 space-y-8 flex-1 pb-[24px]">
        
        {/* 1. Top Banner */}
        <div className="bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-[16px] p-4 flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-[#FF6B35]/20 flex items-center justify-center shrink-0">
            <ShieldAlert size={18} className="text-[#FF6B35]" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-[#FF6B35]">In case of emergency</h3>
            <p className="text-[13px] text-[#FF6B35]/80 mt-1 leading-relaxed">
              Call a vet fast, share critical info, and access your pet's ID securely.
            </p>
          </div>
        </div>

        {/* 2. Emergency Contacts */}
        <section>
          <SectionHeader title="Emergency Contacts" actionIcon={Plus} onAction={() => setContactSheet({})} />
          <ExpandableList 
            items={pet.emergencyContacts}
            limit={2}
            renderItem={(contact) => (
              <div 
                key={contact.id}
                onClick={() => setContactSheet(contact)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F7F7F8] active:bg-[#F0F0F2] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[15px] font-semibold text-[#111111]">{contact.name}</span>
                    {contact.isPrimary ? <Badge variant="primary">Primary</Badge> : <Badge variant="default">Secondary</Badge>}
                  </div>
                  <span className="text-[13px] text-[#6E6E73] block">{contact.relationship}</span>
                </div>
                <button 
                  onClick={(e) => handleCall(e, contact.phone, contact.name)}
                  className="w-10 h-10 rounded-full bg-[#E5F9ED] text-[#00C060] flex items-center justify-center active:scale-95 transition-transform"
                >
                  <Phone size={18} fill="currentColor" />
                </button>
              </div>
            )}
          />
        </section>

        {/* 3. Veterinary Contacts */}
        <section>
          <SectionHeader title="Vets" actionIcon={Plus} onAction={() => setVetSheet({})} />
          <ExpandableList 
            items={pet.vets}
            limit={2}
            renderItem={(vet) => (
              <div 
                key={vet.id}
                onClick={() => setVetSheet(vet)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#F7F7F8] active:bg-[#F0F0F2] transition-colors"
              >
                <div>
                  <span className="text-[15px] font-semibold text-[#111111] block mb-0.5">{vet.clinic}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={vet.type === 'Emergency' ? 'error' : 'default'}>{vet.type}</Badge>
                    {vet.name && <span className="text-[13px] text-[#6E6E73]">{vet.name}</span>}
                  </div>
                </div>
                <button 
                  onClick={(e) => handleCall(e, vet.phone, vet.clinic)}
                  className="w-10 h-10 rounded-full bg-[#E5F9ED] text-[#00C060] flex items-center justify-center active:scale-95 transition-transform shrink-0 ml-3"
                >
                  <Phone size={18} fill="currentColor" />
                </button>
              </div>
            )}
          />
        </section>

        {/* 4. Critical Medical Info */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[16px] font-semibold text-[#111111]">Critical Medical Info</h3>
          </div>
          <div className="bg-[#FFFFFF] border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[16px] p-4 space-y-5">
            <MedicalSubsection title="Allergies" icon={AlertOctagon} items={pet.medical.allergies} type="allergies" showAll={true} />
            <div className="h-[1px] bg-black/[0.06] w-full" />
            <MedicalSubsection title="Active Meds" icon={Syringe} items={pet.medical.medications} type="meds" />
            
            <div 
              onClick={() => { showToast('Navigating to Health'); navigateToTab('Health'); }}
              className="mt-2 pt-3 border-t border-black/[0.06] flex items-center justify-center text-[13px] font-semibold text-[#FF6B35] cursor-pointer hover:opacity-80 active:scale-95 transition-all"
            >
              Tap to view full Health record
            </div>
          </div>
        </section>

        {/* 5. Identification */}
        <section>
          <h3 className="text-[16px] font-semibold text-[#111111] mb-3">Identification</h3>
          <div className="bg-[#FFFFFF] border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[16px] px-4">
            <div className="flex items-center justify-between py-4">
              <div>
                <span className="text-[13px] font-medium text-[#6E6E73] block mb-0.5">Microchip ID</span>
                <span className="text-[15px] font-semibold text-[#111111] font-mono tracking-wide">{pet.microchip}</span>
              </div>
              <button onClick={() => handleCopy(pet.microchip, 'Microchip')} className="p-2 text-[#CFCFD4] hover:text-[#111111] active:bg-[#F7F7F8] rounded-full transition-all">
                <Copy size={18} />
              </button>
            </div>
            <div className="w-full h-[1px] bg-black/[0.06]" />
            <div className="flex items-center justify-between py-4">
              <div>
                <span className="text-[13px] font-medium text-[#6E6E73] block mb-0.5">Home Address</span>
                <span className="text-[15px] font-semibold text-[#111111]">{pet.address}</span>
              </div>
              <button onClick={() => handleCopy(pet.address, 'Address')} className="p-2 text-[#CFCFD4] hover:text-[#111111] active:bg-[#F7F7F8] rounded-full transition-all">
                <Copy size={18} />
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* BOTTOM SHEETS */}
      {/* A) Edit/Add Contact */}
      <BottomSheet 
        isOpen={!!contactSheet} 
        onClose={() => setContactSheet(null)} 
        title={contactSheet?.id ? 'Edit Contact' : 'Add Contact'}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setContactSheet(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => saveContact(contactSheet)} disabled={!contactSheet?.name || !contactSheet?.phone}>Save</Button>
          </div>
        }
      >
        {contactSheet && (
          <div className="space-y-4 pt-2">
            <TextInput label="Name" value={contactSheet.name || ''} onChange={e => setContactSheet({...contactSheet, name: e.target.value})} />
            <Select label="Relationship" options={RELATIONSHIP_OPTIONS} value={contactSheet.relationship || 'Owner'} onChange={e => setContactSheet({...contactSheet, relationship: e.target.value})} />
            <TextInput label="Phone Number" type="tel" value={contactSheet.phone || ''} onChange={e => setContactSheet({...contactSheet, phone: e.target.value})} />
            
            <div className="flex items-center justify-between p-4 bg-[#F7F7F8] rounded-xl mt-2 cursor-pointer" onClick={() => setContactSheet({...contactSheet, isPrimary: !contactSheet.isPrimary})}>
              <div>
                <span className="text-[15px] font-medium text-[#111111] block">Primary Contact</span>
                {contactSheet.isPrimary && hasOtherPrimary && (
                  <span className="text-[12px] text-[#FF9500] block mt-0.5">This will replace the current primary contact.</span>
                )}
              </div>
              <div className={`w-[50px] h-[30px] rounded-full transition-colors relative shrink-0 ${contactSheet.isPrimary ? 'bg-[#00C060]' : 'bg-[#D1D1D6]'}`}>
                <div className={`absolute top-[2px] w-[26px] h-[26px] bg-white rounded-full shadow-sm transition-transform ${contactSheet.isPrimary ? 'left-[22px]' : 'left-[2px]'}`} />
              </div>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* B) Edit/Add Vet */}
      <BottomSheet 
        isOpen={!!vetSheet} 
        onClose={() => setVetSheet(null)} 
        title={vetSheet?.id ? 'Edit Vet' : 'Add Vet'}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setVetSheet(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => saveVet(vetSheet)} disabled={!vetSheet?.clinic || !vetSheet?.phone}>Save</Button>
          </div>
        }
      >
        {vetSheet && (
          <div className="space-y-4 pt-2">
            <TextInput label="Clinic Name" value={vetSheet.clinic || ''} onChange={e => setVetSheet({...vetSheet, clinic: e.target.value})} />
            <TextInput label="Vet Name (Optional)" value={vetSheet.name || ''} onChange={e => setVetSheet({...vetSheet, name: e.target.value})} />
            <Select label="Type" options={VET_TYPE_OPTIONS} value={vetSheet.type || 'Primary'} onChange={e => setVetSheet({...vetSheet, type: e.target.value})} />
            <TextInput label="Phone Number" type="tel" value={vetSheet.phone || ''} onChange={e => setVetSheet({...vetSheet, phone: e.target.value})} />
          </div>
        )}
      </BottomSheet>

      {/* C) Share Sheet */}
      <BottomSheet 
        isOpen={shareSheet} 
        onClose={() => setShareSheet(false)} 
        title="Share Emergency Info"
        footer={
          <div className="space-y-3">
            <Button variant="primary" icon={Share2} onClick={() => { setShareSheet(false); showToast('Opening share options...'); }}>Share Link</Button>
            <Button variant="secondary" icon={ExternalLink} onClick={() => onOpenPublicView()}>Preview Public Page</Button>
          </div>
        }
      >
        <div className="flex flex-col items-center pt-2">
          <div className="w-[160px] h-[160px] bg-white border-2 border-black/[0.04] rounded-[24px] shadow-sm flex items-center justify-center mb-6">
             <QrCode size={100} color="#111111" strokeWidth={1} />
          </div>
          <p className="text-[15px] text-[#6E6E73] text-center max-w-[280px] mb-6">
            Scanners will see a temporary read-only page with {pet.name}'s critical info.
          </p>
          
          <div className="w-full bg-[#F7F7F8] rounded-[16px] p-4 mb-6">
            <span className="text-[12px] font-semibold uppercase text-[#8E8E93] block mb-3">What's included</span>
            <ul className="space-y-2 text-[14px] font-medium text-[#111111]">
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#00C060]"/> Contacts & Vets</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#00C060]"/> Medical Conditions & Allergies</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#00C060]"/> Microchip ID</li>
            </ul>
          </div>

          <div className="w-full flex items-center bg-[#FFFFFF] border border-black/[0.08] rounded-xl p-2 mb-4">
            <div className="flex-1 px-3 text-[14px] text-[#111111] truncate font-medium">fylos.com/e/luna-89x2</div>
            <button onClick={() => handleCopy('fylos.com/e/luna-89x2', 'Link')} className="px-4 py-2 bg-[#F7F7F8] rounded-lg text-[13px] font-semibold active:bg-[#E5E5E5] transition-colors">
              Copy
            </button>
          </div>
          
          <span className="text-[12px] text-[#8E8E93] text-center block">Link expires automatically in 24 hours.</span>
        </div>
      </BottomSheet>

      {/* D) More Actions Sheet */}
      <BottomSheet isOpen={moreSheet} onClose={() => setMoreSheet(false)} title="Quick Actions">
        <div className="space-y-2 pt-2">
          <button onClick={() => { setMoreSheet(false); handleCall({stopPropagation:()=>{}}, pet.vets.find(v=>v.type==='Primary')?.phone || '', 'Primary Vet'); }} className="w-full flex items-center gap-3 p-4 bg-[#F7F7F8] hover:bg-[#F0F0F2] active:scale-[0.98] rounded-xl transition-all text-left">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0"><Stethoscope size={18} className="text-[#FF6B35]"/></div>
            <span className="text-[16px] font-medium text-[#111111]">Call Primary Vet</span>
          </button>
          <button onClick={() => { setMoreSheet(false); handleCall({stopPropagation:()=>{}}, pet.emergencyContacts.find(c=>c.isPrimary)?.phone || '', 'Primary Contact'); }} className="w-full flex items-center gap-3 p-4 bg-[#F7F7F8] hover:bg-[#F0F0F2] active:scale-[0.98] rounded-xl transition-all text-left">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0"><PhoneCall size={18} className="text-[#111111]"/></div>
            <span className="text-[16px] font-medium text-[#111111]">Call Primary Contact</span>
          </button>
          <button onClick={() => { setMoreSheet(false); handleCopy(pet.microchip, 'Microchip'); }} className="w-full flex items-center gap-3 p-4 bg-[#F7F7F8] hover:bg-[#F0F0F2] active:scale-[0.98] rounded-xl transition-all text-left">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0"><Copy size={18} className="text-[#111111]"/></div>
            <span className="text-[16px] font-medium text-[#111111]">Copy Microchip ID</span>
          </button>
          <button onClick={() => { setMoreSheet(false); handleCopy(pet.address, 'Address'); }} className="w-full flex items-center gap-3 p-4 bg-[#F7F7F8] hover:bg-[#F0F0F2] active:scale-[0.98] rounded-xl transition-all text-left">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0"><MapPin size={18} className="text-[#111111]"/></div>
            <span className="text-[16px] font-medium text-[#111111]">Copy Home Address</span>
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};

// --- PUBLIC VIEWER SCREEN ---
const PublicEmergencyViewer = ({ pet, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#F7F7F8] z-[100] flex flex-col animate-in fade-in zoom-in-95 duration-300">
      <header className="bg-white border-b border-black/[0.04] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <FylosLogo fontSize="18px" textColor="#111111" />
        <button onClick={onClose} className="text-[15px] font-semibold text-[#FF6B35] active:opacity-70">Close</button>
      </header>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 pb-12">
        <div className="text-center">
          <Avatar src={pet.photo} size={100} className="mx-auto mb-4 border-4 border-white shadow-sm" />
          <h1 className="text-[28px] font-bold text-[#111111]">{pet.name}</h1>
          <p className="text-[15px] text-[#6E6E73] mt-1">{pet.breed} · {pet.sex}</p>
        </div>

        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/[0.04] space-y-4">
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Primary Contact</h2>
          {pet.emergencyContacts.filter(c=>c.isPrimary).map(contact => (
            <div key={contact.id} className="flex items-center justify-between">
              <div>
                <span className="text-[16px] font-bold text-[#111111] block">{contact.name}</span>
                <span className="text-[14px] text-[#6E6E73]">{contact.relationship}</span>
              </div>
              <a href={`tel:${contact.phone}`} className="w-12 h-12 bg-[#FF6B35] text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
                <Phone fill="currentColor" size={20} />
              </a>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/[0.04] space-y-4">
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Veterinarian</h2>
          {pet.vets.slice(0,1).map(vet => (
            <div key={vet.id} className="flex items-center justify-between">
              <div>
                <span className="text-[16px] font-bold text-[#111111] block">{vet.clinic}</span>
                <span className="text-[14px] text-[#6E6E73]">{vet.phone}</span>
              </div>
              <a href={`tel:${vet.phone}`} className="w-12 h-12 bg-[#E5F9ED] text-[#00C060] rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                <Phone fill="currentColor" size={20} />
              </a>
            </div>
          ))}
        </div>

        {pet.medical.allergies.length > 0 && (
          <div className="bg-[#FFF4E5] rounded-[20px] p-5 border border-[#FF9500]/20">
            <h2 className="flex items-center gap-2 text-[14px] font-bold text-[#FF9500] uppercase tracking-wider mb-3">
              <AlertTriangle size={18} /> Allergies
            </h2>
            <div className="space-y-2">
              {pet.medical.allergies.map(a => (
                <div key={a.id} className="flex justify-between text-[15px] font-medium text-[#111111]">
                  <span>{a.name}</span>
                  <span className={a.severity === 'Severe' ? 'text-[#FF3B30]' : 'text-[#FF9500]'}>{a.severity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/[0.04]">
           <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-3">Identification</h2>
           <div className="flex justify-between items-center py-2">
             <span className="text-[15px] text-[#6E6E73]">Microchip</span>
             <span className="text-[15px] font-mono font-semibold text-[#111111]">{pet.microchip}</span>
           </div>
        </div>
      </div>
      
      <div className="py-4 text-center text-[12px] font-semibold text-[#CFCFD4] tracking-wide uppercase bg-[#F7F7F8]">
        Powered by FYLOS
      </div>
    </div>
  );
};


// --- SCREENS ---

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

const PetProfileScreen = ({ pet, onUpdate, showToast, onOpenPublicView }) => {
  const [activePetTab, setActivePetTab] = useState('Emergency'); // Default to Emergency for Step 7 demo
  const [displayPetTab, setDisplayPetTab] = useState('Emergency');
  const [isFading, setIsFading] = useState(false);

  // LIFTED SHEET STATE for About Tab
  const [editSheet, setEditSheet] = useState(null); 
  const [triggerSheet, setTriggerSheet] = useState(false);
  const [milestoneSheet, setMilestoneSheet] = useState(false);

  const handleTabSwitch = (tab) => {
    if (tab === activePetTab) return;
    setActivePetTab(tab);
    setIsFading(true);
    setTimeout(() => {
      setDisplayPetTab(tab);
      setIsFading(false);
    }, 200);
  };

  // Re-used About Tab logic
  const openEdit = (key, label, value, type = 'text', isPref = false) => setEditSheet({ key, label, value: value || '', type, isPref });
  const saveEdit = () => {
    const updatedPet = { ...pet };
    if (editSheet.isPref) updatedPet.preferences = { ...updatedPet.preferences, [editSheet.key]: editSheet.value };
    else updatedPet[editSheet.key] = editSheet.value;
    onUpdate(updatedPet); setEditSheet(null); showToast('Saved');
  };

  if (!pet) return null;

  return (
    <div className="absolute inset-0 w-full h-full">
      <ScreenContainer>
        <PetProfileHeader pet={pet} showToast={showToast} />
        <PetProfileTabs activeTab={activePetTab} onTabChange={handleTabSwitch} />
        
        <div className={`transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'} h-full`}>
          {displayPetTab === 'About' ? (
             <AboutTab 
               pet={pet} onUpdate={onUpdate} showToast={showToast}
               onOpenEdit={openEdit} onOpenTrigger={() => setTriggerSheet(true)} onOpenMilestone={() => setMilestoneSheet(true)}
               onRemoveTrigger={()=>{}} onToggleChip={()=>{}} onDeleteMilestone={()=>{}}
             />
          ) : displayPetTab === 'Emergency' ? (
             <EmergencyTab 
               pet={pet} onUpdate={onUpdate} showToast={showToast} navigateToTab={handleTabSwitch} onOpenPublicView={() => onOpenPublicView(pet.id)}
             />
          ) : (
            <div className="pt-10">
              <EmptyState icon={displayPetTab === 'Health' ? HeartPulse : displayPetTab === 'Documents' ? FileText : displayPetTab === 'Share' ? Share2 : AlertCircle} title={displayPetTab} description={`Detailed ${displayPetTab.toLowerCase()} tracking coming in future steps.`} />
            </div>
          )}
        </div>
      </ScreenContainer>

      {/* Sheets for About Tab */}
      <BottomSheet 
        isOpen={!!editSheet} 
        onClose={() => setEditSheet(null)} 
        title={`Edit ${editSheet?.label}`}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setEditSheet(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit}>Save</Button>
          </div>
        }
      >
        <div className="pt-2">
          <TextInput type={editSheet?.type || 'text'} value={editSheet?.value || ''} onChange={e => setEditSheet({ ...editSheet, value: e.target.value })} />
        </div>
      </BottomSheet>
    </div>
  );
};

// Placeholder Screens
const HomeScreen = () => (
  <ScreenContainer><div className="px-5 pt-4 pb-8"><Text variant="title">Home</Text><Text variant="caption">Dashboard overview placeholder</Text></div></ScreenContainer>
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

// --- APP SHELL ---

export default function App() {
  const [activeTab, setActiveTab] = useState('pets'); 
  const [displayTab, setDisplayTab] = useState('pets');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [petsData, setPetsData] = useState(INITIAL_MOCK_PETS);
  const [petsRoute, setPetsRoute] = useState('profile'); 
  const [selectedPetId, setSelectedPetId] = useState(INITIAL_MOCK_PETS[0].id);
  const [toastMessage, setToastMessage] = useState(null);

  // New state for Public Viewer
  const [publicViewPetId, setPublicViewPetId] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

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
    if (petsData.length > 1) {
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
      if (petsRoute === 'profile') {
        const pet = petsData.find(p => p.id === selectedPetId) || petsData[0];
        return <PetProfileScreen pet={pet} onUpdate={handleUpdatePet} showToast={showToast} onOpenPublicView={setPublicViewPetId} />;
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
      if (petsRoute === 'profile') {
        const pet = petsData.find(p => p.id === selectedPetId) || petsData[0];
        return { title: pet ? pet.name : 'Profile', variant: 'detail', onBack: handlePetBack, rightIcon: MoreHorizontal };
      }
      return { title: 'Pets', variant: 'detail', onBack: () => handleTabChange('home'), rightIcon: Plus, onRightAction: () => showToast('Add Pet') };
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
        @keyframes springBump { 0% { transform: scale(1); } 40% { transform: scale(1.06); } 100% { transform: scale(1); } }
        .animate-spring-bump { animation: springBump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .energy-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 6px; border-radius: 9999px; outline: none; }
        .energy-slider::-webkit-slider-thumb, .energy-slider::-moz-range-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #FFFFFF; border: 1px solid rgba(0,0,0,0.08); border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.12); cursor: pointer; }
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
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
            <Toast message={toastMessage} />

            {/* Public Emergency Viewer Overlay */}
            {publicViewPetId && (
              <PublicEmergencyViewer 
                pet={petsData.find(p => p.id === publicViewPetId)} 
                onClose={() => setPublicViewPetId(null)} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}