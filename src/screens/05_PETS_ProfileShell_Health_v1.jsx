import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
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
  Syringe,
  Stethoscope,
  Pill,
  Scale,
  Clock,
  CalendarDays,
  Wind
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

const TEMPERAMENT_OPTIONS = ['Friendly', 'Playful', 'Calm', 'Shy', 'Protective', 'Energetic', 'Independent', 'Affectionate', 'Curious', 'Stubborn'];
const COMMON_ANXIETY_TRIGGERS = ['Thunder', 'Fireworks', 'Vacuum cleaner', 'Car rides', 'Strangers', 'Other dogs', 'Loud noises', 'Vet visits'];

const MOCK_HEALTH_DATA = {
  vaccinations: [
    { id: 'v1', name: 'Rabies', lastDate: '2023-05-10', nextDate: '2026-05-10' }, 
    { id: 'v2', name: 'DHPP', lastDate: '2025-03-01', nextDate: '2026-03-01' }, 
    { id: 'v3', name: 'Bordetella', lastDate: '2024-01-15', nextDate: '2025-01-15' }, 
    { id: 'v4', name: 'Leptospirosis', lastDate: '2025-05-20', nextDate: '2026-05-20' } 
  ],
  vetVisits: [
    { id: 'vv1', date: '2026-01-10', reason: 'Annual Checkup', vet: 'Dr. Smith', clinic: 'Zurich Vet Center', notes: 'Everything looks great. Weight is stable.', prescriptions: 'None', followUp: 'Next year', cost: '$120' },
    { id: 'vv2', date: '2025-08-22', reason: 'Limping front right leg', vet: 'Dr. Meier', clinic: 'Zurich Vet Center', notes: 'Mild sprain. Prescribed rest and anti-inflammatories for 5 days.', prescriptions: 'Rimadyl', followUp: 'If not improved in a week', cost: '$85' }
  ],
  medications: [
    { id: 'med1', name: 'NexGard Spectra', purpose: 'Flea & Tick', dosage: '1 chewable', startDate: '2026-02-01', endDate: '2026-02-01', frequency: 'Monthly', nextDoseTime: 'Today', takenToday: false, isActive: true },
    { id: 'med2', name: 'Rimadyl', purpose: 'Pain relief', dosage: '25mg', startDate: '2025-08-22', endDate: '2025-08-27', frequency: 'Twice daily', nextDoseTime: null, takenToday: false, isActive: false }
  ],
  allergies: [
    { id: 'al1', allergen: 'Chicken', severity: 'moderate', reaction: 'Itchy skin, ear infections' },
    { id: 'al2', allergen: 'Dust Mites', severity: 'mild', reaction: 'Occasional sneezing' },
    { id: 'al3', allergen: 'Bee Sting', severity: 'severe', reaction: 'Facial swelling, requires vet immediately' }
  ],
  weightHistory: [
    { id: 'w1', date: '2025-01-10', weight: 26.5 },
    { id: 'w2', date: '2025-05-15', weight: 27.2 },
    { id: 'w3', date: '2025-08-22', weight: 27.8 },
    { id: 'w4', date: '2025-11-05', weight: 28.1 },
    { id: 'w5', date: '2026-01-10', weight: 28.0 },
    { id: 'w6', date: '2026-02-20', weight: 28.0 }
  ],
  idealWeightRange: '26 - 29'
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
  const baseStyles = "relative flex items-center justify-center rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2";
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.25)] hover:bg-[#E85D2A]",
    secondary: "bg-transparent text-[#111111] border-[1.5px] border-black/[0.08] hover:bg-[#F7F7F8]",
    destructive: "bg-[#FFF0F0] text-[#FF3B30] hover:bg-[#FFE5E5]",
    ghost: "bg-transparent text-[#6E6E73] hover:bg-black/5"
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
    default: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)]",
    highlighted: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border-l-[3px] border-l-[#FF6B35]",
    grey: "bg-[#F7F7F8]"
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
      className={`w-full h-[52px] px-4 bg-[#FFFFFF] border text-[16px] text-[#111111] rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 ${
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
        className="w-full h-[52px] px-4 pr-10 bg-[#FFFFFF] border border-black/[0.08] text-[16px] text-[#111111] rounded-xl appearance-none transition-all duration-200 focus:outline-none focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10"
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
 * FIXED BottomSheet Component - Now with Half-to-Full expansion (Detents)
 */
const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false); // Ελέγχει αν είναι στο 55% ή στο 85%
  const [portalTarget, setPortalTarget] = useState(null);
  const touchStartY = useRef(0);
  const contentRef = useRef(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('app-mockup') || document.body);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      setExpanded(false); // Πάντα ξεκινάει από τη μέση όταν ανοίγει
      document.body.style.overflow = 'hidden';
      const raf = requestAnimationFrame(() => {
        setTimeout(() => setVisible(true), 10);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Χειρισμός αφής στη μπάρα (Drag Handle)
  const handleHandleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleHandleTouchEnd = (e) => {
    const touchY = e.changedTouches ? e.changedTouches[0].clientY : e.touches[0].clientY;
    const delta = touchY - touchStartY.current;
    
    if (delta < -30) {
      setExpanded(true); // Σύρσιμο πάνω -> Επέκταση
    } else if (delta > 30) {
      if (expanded) setExpanded(false); // Σύρσιμο κάτω -> Επιστροφή στη μέση
      else onClose(); // Σύρσιμο κάτω ενώ είναι στη μέση -> Κλείσιμο
    }
  };

  // Όταν ο χρήστης σκρολάρει το περιεχόμενο, το sheet μεγαλώνει αυτόματα!
  const handleContentScroll = () => {
    if (!expanded && contentRef.current && contentRef.current.scrollTop > 5) {
      setExpanded(true);
    }
  };

  // Αν είναι στην κορυφή του περιεχομένου και κάνει swipe down, να μικραίνει ή να κλείνει
  const handleContentTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleContentTouchEnd = (e) => {
    if (contentRef.current && contentRef.current.scrollTop <= 0) {
      const touchY = e.changedTouches ? e.changedTouches[0].clientY : e.touches[0].clientY;
      const delta = touchY - touchStartY.current;
      if (delta > 40) {
        if (expanded) setExpanded(false);
        else onClose();
      }
    }
  };

  if (!render || !portalTarget) return null;

  const sheetContent = (
    <div className="absolute inset-0 z-[9999] overflow-hidden pointer-events-auto flex flex-col justify-end">
      <div 
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={`relative w-full sm:w-[390px] sm:mx-auto bg-[#FFFFFF] rounded-t-[32px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out ${expanded ? 'h-[85%]' : 'h-[55%]'}`}
        style={{ 
          transform: `translateY(${!visible ? '100%' : '0px'})`,
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)'
        }}
      >
        {/* Drag Handle Area */}
        <div 
          className="w-full flex justify-center pt-4 pb-5 cursor-grab active:cursor-grabbing touch-none shrink-0"
          onTouchStart={handleHandleTouchStart}
          onTouchEnd={handleHandleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-black/[0.08] rounded-full" />
        </div>
        
        {/* Scrollable Content Area */}
        <div 
          ref={contentRef}
          className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 overscroll-y-contain"
          onScroll={handleContentScroll}
          onTouchStart={handleContentTouchStart}
          onTouchEnd={handleContentTouchEnd}
        >
          {title && <h3 className="text-[20px] font-bold text-[#111111] mb-6">{title}</h3>}
          {children}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(sheetContent, portalTarget);
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

const ScreenContainer = ({ children }) => (
  // Removed custom locking here as BottomSheet handles document.body scroll now
  <div className="absolute inset-0 overflow-x-hidden overflow-y-auto bg-[#FFFFFF] custom-scrollbar">
    <div className="min-h-full pt-[110px] pb-[120px]">
      {children}
    </div>
  </div>
);

const Toast = ({ message }) => {
  const [portalTarget, setPortalTarget] = useState(null);
  
  useEffect(() => {
    setPortalTarget(document.getElementById('app-mockup') || document.body);
  }, []);

  if (!message || !portalTarget) return null;

  const toastContent = (
    <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 z-[10000] pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#111111] text-white px-5 py-3 rounded-full shadow-lg text-[14px] font-medium flex items-center gap-2">
        <CheckCircle2 size={16} className="text-[#00C060]" />
        {message}
      </div>
    </div>
  );

  return ReactDOM.createPortal(toastContent, portalTarget);
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

// Sub-components for About Tab
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
        <div className="bg-[#FFFFFF] border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[16px] px-4">
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
        </div>
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
                    isActive 
                      ? 'bg-[#FF6B35]/12 border border-[#FF6B35]/30 text-[#FF6B35]' 
                      : 'bg-[#F7F7F8] border border-black/[0.08] text-[#6E6E73] hover:bg-black/5'
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
                <button onClick={() => onRemoveTrigger(trigger)} className="p-0.5 rounded-full opacity-85 hover:opacity-100 transition-opacity">
                  <X size={14} />
                </button>
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
        <div className="bg-[#FFFFFF] border border-black/[0.08] shadow-[0_2px_8_rgba(0,0,0,0.02)] rounded-[16px] px-4">
          <InfoRow label="Favorite Treats" value={pet.preferences.treats} onEdit={() => onOpenEdit('treats', 'Treats', pet.preferences.treats, 'text', true)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Favorite Toys" value={pet.preferences.toys} onEdit={() => onOpenEdit('toys', 'Toys', pet.preferences.toys, 'text', true)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Food Brand" value={pet.preferences.foodBrand} onEdit={() => onOpenEdit('foodBrand', 'Food Brand', pet.preferences.foodBrand, 'text', true)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Sleeping Spot" value={pet.preferences.sleepingSpot} onEdit={() => onOpenEdit('sleepingSpot', 'Sleeping Spot', pet.preferences.sleepingSpot, 'text', true)} />
          <div className="w-full h-[1px] bg-black/[0.06]" />
          <InfoRow label="Walking" value={pet.preferences.walking} onEdit={() => onOpenEdit('walking', 'Walking Config', pet.preferences.walking, 'text', true)} />
        </div>
      </section>

      <section className="pt-4">
        <h3 className="text-[16px] font-semibold text-[#111111] mb-4">Milestones</h3>
        <div className="relative pl-6 border-l-[2px] border-[#F0F0F2] space-y-6 pb-2">
          {pet.milestones.map(m => (
            <div key={m.id} className="relative group">
              <div className="absolute -left-[41px] top-0 w-8 h-8 bg-white border-2 border-[#F0F0F2] rounded-full flex items-center justify-center text-[14px] shadow-sm z-10">
                {m.icon}
              </div>
              <div className="flex justify-between items-start pt-1">
                <div>
                  <span className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider">{m.date}</span>
                  <h4 className="text-[16px] font-semibold text-[#111111] mt-1">{m.title}</h4>
                  {m.note && <p className="text-[14px] text-[#6E6E73] mt-1.5 leading-relaxed">{m.note}</p>}
                </div>
                <button onClick={() => onDeleteMilestone(m.id)} className="p-2 text-[#CFCFD4] hover:text-[#FF3B30] hover:bg-[#FFF0F0] rounded-full transition-colors active:scale-95">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <Button variant="secondary" icon={Plus} onClick={onOpenMilestone} className="mt-4">
          Add milestone
        </Button>
      </section>
    </div>
  );
};

// --- HEALTH TAB (NEW DASHBOARD LAYOUT) ---

const calculateExpiryDays = (nextDateStr) => {
  const nextDate = new Date(nextDateStr);
  const today = new Date('2026-02-21'); // Mock current date based on context
  const diffTime = nextDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatExpiryLabel = (days) => {
  if (days < 0) return `Overdue by ${Math.abs(days)} days`;
  if (days === 0) return 'Expires today';
  if (days <= 30) return `Expires in ${days} days`;
  if (days < 365) return `Expires in ${Math.floor(days/30)} months`;
  return `Expires in ${Math.floor(days/365)} years`;
};

// Reusable Sub-Components for Sheets

const VaccinationCard = ({ item, onOpenSheet }) => {
  const days = calculateExpiryDays(item.nextDate);
  let statusColor = '#00C060';
  let badgeLabel = 'Valid';
  let badgeType = 'success';

  if (days < 0) {
    statusColor = '#FF3B30';
    badgeLabel = 'Overdue';
    badgeType = 'error';
  } else if (days <= 30) {
    statusColor = '#FF9500';
    badgeLabel = 'Expiring';
    badgeType = 'warning';
  }

  return (
    <Card clickable onClick={() => onOpenSheet('VACCINE_DETAILS', item)} className="!p-4 bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3">
         <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F7F7F8] shrink-0">
            <Syringe size={20} color={statusColor} />
         </div>
         <div className="flex-1">
           <h4 className="text-[16px] font-bold text-[#111111]">{item.name}</h4>
           <span className="text-[13px] text-[#6E6E73]">Given: {item.lastDate}</span>
         </div>
         <Badge variant={badgeType}>{badgeLabel}</Badge>
      </div>
    </Card>
  )
};

const VaccinationsSection = ({ data, onOpenSheet }) => (
  <section className="space-y-4 px-2 pb-6">
    <div className="flex justify-between items-center px-1">
      <p className="text-[14px] text-[#6E6E73]">Track your pet's vaccination schedule.</p>
      <button onClick={() => onOpenSheet('ADD_VACCINE')} className="text-[#FF6B35] p-1 active:opacity-70"><Plus size={20} /></button>
    </div>
    <div className="space-y-3">
      {data.map(vac => <VaccinationCard key={vac.id} item={vac} onOpenSheet={onOpenSheet} />)}
    </div>
  </section>
);

const VetVisitsSection = ({ data, onOpenSheet }) => (
  <section className="space-y-4 px-2 pb-6">
    <div className="flex justify-between items-center px-1">
      <p className="text-[14px] text-[#6E6E73]">History of veterinary consultations.</p>
      <button onClick={() => onOpenSheet('ADD_VET')} className="text-[#FF6B35] p-1 active:opacity-70"><Plus size={20} /></button>
    </div>
    <div className="relative pl-4 border-l-[1.5px] border-[#E5E5E5] space-y-5 ml-2 mt-2">
      {data.map((visit, idx) => (
        <div key={visit.id} className="relative">
          <div className={`absolute -left-[21.5px] top-1.5 w-[11px] h-[11px] rounded-full border-2 ${idx === 0 ? 'bg-[#FF6B35] border-[#FF6B35]' : 'bg-[#FFFFFF] border-[#CFCFD4]'}`} />
          <Card className="!p-4 bg-[#FFFFFF] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
             <div className="flex justify-between items-start mb-1">
               <span className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider">{visit.date}</span>
             </div>
             <h4 className="text-[16px] font-bold text-[#111111] mb-1">{visit.reason}</h4>
             <p className="text-[14px] text-[#6E6E73] mb-2">{visit.vet} • {visit.clinic}</p>
             <p className="text-[14px] text-[#111111] line-clamp-2 mb-3 leading-relaxed">{visit.notes}</p>
             <button onClick={() => onOpenSheet('VET_DETAILS', visit)} className="text-[14px] font-semibold text-[#FF6B35] flex items-center gap-1 active:opacity-70">
               View details <ChevronRight size={14} />
             </button>
          </Card>
        </div>
      ))}
    </div>
  </section>
);

const VetVisitsSummaryCard = ({ onOpenSheet }) => {
  const visits = [...MOCK_HEALTH_DATA.vetVisits].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestVisit = visits[0];

  if (!latestVisit) {
    return (
      <Card className="!p-5 mb-8 bg-[#FFFFFF] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.03)] rounded-[20px]">
         <div className="flex flex-col items-center justify-center py-2">
           <p className="text-[14px] text-[#6E6E73] mb-3">No vet visits yet</p>
           <Button variant="secondary" size="small" onClick={() => onOpenSheet('ADD_VET')}>Add first visit</Button>
         </div>
      </Card>
    );
  }

  const needsFollowUp = latestVisit.followUp && latestVisit.followUp !== 'None' && latestVisit.followUp !== 'Next year';
  
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <button 
      onClick={() => onOpenSheet('VET_VISITS_SECTION')}
      className="w-full mb-8 bg-[#FFFFFF] p-4 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.04] flex flex-col text-left active:scale-[0.96] transition-transform duration-200"
    >
      <div className="flex justify-between items-center w-full mb-3">
         <div className="flex items-center gap-1.5">
           <span className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider">Vet Visits</span>
         </div>
         {needsFollowUp ? (
           <Badge variant="warning">Follow-up</Badge>
         ) : (
           <Badge variant="default">Recent</Badge>
         )}
      </div>
      
      <div className="flex justify-between items-end w-full">
        <div className="flex-1 pr-3 min-w-0">
          <p className="text-[18px] font-bold text-[#111111] leading-tight mb-1 truncate">{latestVisit.reason}</p>
          <p className="text-[14px] text-[#6E6E73] truncate">{latestVisit.vet} • {latestVisit.clinic}</p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0 mb-0.5">
          <span className="text-[14px] font-medium text-[#8E8E93]">{formatDate(latestVisit.date)}</span>
          <ChevronRight size={18} color="#CFCFD4" strokeWidth={2.5} />
        </div>
      </div>
    </button>
  );
};

const MedicationCard = ({ item, onMarkTaken, onOpenSheet }) => {
  const [localTaken, setLocalTaken] = useState(item.takenToday);

  const handleTake = (e) => {
    e.stopPropagation();
    setLocalTaken(true);
    setTimeout(() => onMarkTaken(item.id), 200); 
  };

  return (
    <Card clickable onClick={() => onOpenSheet('MED_DETAILS', item)} className={`!p-4 bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${!item.isActive ? 'opacity-60 bg-[#F7F7F8]' : ''}`}>
       <div className="flex items-start justify-between mb-2">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E5F0FF] flex items-center justify-center shrink-0">
              <Pill size={18} className="text-[#007AFF]" />
            </div>
            <div>
              <h4 className="text-[16px] font-bold text-[#111111]">{item.name}</h4>
              <p className="text-[13px] text-[#6E6E73]">{item.purpose} • {item.dosage}</p>
            </div>
         </div>
       </div>
       
       <div className="flex justify-between items-center mt-3">
         <div className="text-[13px] text-[#6E6E73]">
           {item.isActive ? (
             <span className="flex items-center gap-1.5 font-medium"><Clock size={14} className="text-[#111111]" /> Next: {item.nextDoseTime}</span>
           ) : (
             <span>{item.startDate} - {item.endDate}</span>
           )}
         </div>
       </div>

       {item.isActive && (
         <div className="mt-4 pt-3 border-t border-black/[0.04]">
            {localTaken || item.takenToday ? (
              <div className="flex items-center justify-center gap-2 text-[#00C060] text-[14px] font-semibold py-1 animate-in fade-in zoom-in duration-200">
                <CheckCircle2 size={16} /> Taken today
              </div>
            ) : (
              <Button variant="secondary" size="small" fullWidth onClick={handleTake} className="!h-[36px]">
                Mark as taken
              </Button>
            )}
         </div>
       )}
    </Card>
  );
};

const MedicationsSection = ({ data, onMarkTaken, onOpenSheet }) => {
  const activeMeds = data.filter(m => m.isActive);
  const pastMeds = data.filter(m => !m.isActive);

  return (
    <section className="space-y-6 px-2 pb-6">
      <div className="flex justify-between items-center px-1">
        <p className="text-[14px] text-[#6E6E73]">Manage active and past prescriptions.</p>
        <button onClick={() => onOpenSheet('ADD_MED')} className="text-[#FF6B35] p-1 active:opacity-70"><Plus size={20} /></button>
      </div>
      
      {activeMeds.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider ml-1">Active</h4>
          {activeMeds.map(m => <MedicationCard key={m.id} item={m} onMarkTaken={onMarkTaken} onOpenSheet={onOpenSheet} />)}
        </div>
      )}
      {pastMeds.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider ml-1">Past</h4>
          {pastMeds.map(m => <MedicationCard key={m.id} item={m} onMarkTaken={onMarkTaken} onOpenSheet={onOpenSheet} />)}
        </div>
      )}
    </section>
  )
};

const AllergiesSection = ({ data, onOpenSheet }) => (
  <section className="space-y-4 px-2 pb-6">
    <div className="flex justify-between items-center px-1">
      <p className="text-[14px] text-[#6E6E73]">Logged allergies and severe reactions.</p>
      <button onClick={() => onOpenSheet('ADD_ALLERGY')} className="text-[#FF6B35] p-1 active:opacity-70"><Plus size={20} /></button>
    </div>
    <div className="space-y-3">
      {data.map(allergy => {
        let badgeVariant = 'default';
        if(allergy.severity === 'mild') badgeVariant = 'success';
        if(allergy.severity === 'moderate') badgeVariant = 'warning';
        if(allergy.severity === 'severe') badgeVariant = 'error';
        
        return (
          <Card key={allergy.id} clickable onClick={() => onOpenSheet('ALLERGY_DETAILS', allergy)} className="!p-4 bg-white shadow-sm border border-black/[0.04]">
             <div className="flex justify-between items-center mb-2">
               <h4 className="text-[16px] font-bold text-[#111111]">{allergy.allergen}</h4>
               <Badge variant={badgeVariant}>{allergy.severity}</Badge>
             </div>
             <p className="text-[14px] text-[#6E6E73]">{allergy.reaction}</p>
          </Card>
        )
      })}
    </div>
  </section>
);

const WeightTrackerSection = ({ data, idealRange, currentWeight, weightUnit, onOpenSheet }) => {
  const maxW = Math.max(...data.map(d => d.weight)) + 1;
  const minW = Math.min(...data.map(d => d.weight)) - 1;
  const range = maxW - minW;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 40 - ((d.weight - minW) / range) * 40;
    return `${x},${y}`;
  }).join(' ');

  const currentWNum = parseFloat(currentWeight);
  const rangeParts = idealRange.split('-').map(p => parseFloat(p.trim()));
  const isHealthy = currentWNum >= rangeParts[0] && currentWNum <= rangeParts[1];

  return (
    <section className="space-y-4 px-2 pb-6">
      <div className="flex justify-between items-center px-1">
        <p className="text-[14px] text-[#6E6E73]">Monitor growth and ideal weight.</p>
        <button onClick={() => onOpenSheet('ADD_WEIGHT')} className="text-[#FF6B35] p-1 active:opacity-70"><Plus size={20} /></button>
      </div>
      
      <div className="bg-white border border-black/[0.04] rounded-2xl p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] mb-4">
         <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[32px] font-bold tracking-tight text-[#111111]">{currentWeight} <span className="text-[20px] text-[#8E8E93]">{weightUnit}</span></span>
              </div>
              <p className="text-[13px] text-[#6E6E73]">Ideal: {idealRange} {weightUnit}</p>
            </div>
            <Badge variant={isHealthy ? 'success' : 'warning'}>{isHealthy ? 'Healthy' : 'Monitor'}</Badge>
         </div>

         <div className="w-full h-[80px] mt-2 relative">
           <svg viewBox="-5 -5 110 50" className="w-full h-full overflow-visible" preserveAspectRatio="none">
             <polyline points={points} fill="none" stroke="#FF6B35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
             {data.map((d, i) => {
               const x = (i / (data.length - 1)) * 100;
               const y = 40 - ((d.weight - minW) / range) * 40;
               return <circle key={i} cx={x} cy={y} r="4" fill="#FFFFFF" stroke="#FF6B35" strokeWidth="2.5" />
             })}
           </svg>
         </div>
      </div>

      <div className="bg-[#FFFFFF] border border-black/[0.04] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {data.slice().reverse().map((entry, i) => (
          <div key={entry.id}>
            <div className="flex items-center justify-between p-4">
              <span className="text-[15px] font-semibold text-[#111111]">{entry.weight} {weightUnit}</span>
              <div className="flex items-center gap-3">
                <span className="text-[14px] text-[#6E6E73]">{entry.date}</span>
                <button onClick={() => onOpenSheet('WEIGHT_DETAILS', entry)} className="text-[#CFCFD4] hover:text-[#111111] active:scale-95 transition-all"><Pencil size={16} /></button>
              </div>
            </div>
            {i < data.length - 1 && <div className="w-full h-[1px] bg-black/[0.04] ml-4" />}
          </div>
        ))}
      </div>
    </section>
  )
};

// --- HEALTH DASHBOARD (TILES & FEED) ---

const HealthTile = ({ title, icon: Icon, iconColor, badge, primaryValue, secondaryValue, onClick, sparkline }) => (
  <button 
    onClick={onClick} 
    className="bg-[#FFFFFF] p-4 rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.04] flex flex-col gap-3 text-left active:scale-[0.96] transition-transform duration-200 h-full w-full"
  >
    <div className="flex justify-between items-start w-full">
      <div className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0">
        <Icon size={18} color={iconColor} strokeWidth={2.5} />
      </div>
      {badge && (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md leading-tight shrink-0 ml-2 ${badge.type === 'error' ? 'bg-[#FFE5E5] text-[#FF3B30]' : badge.type === 'warning' ? 'bg-[#FFF4E5] text-[#FF9500]' : 'bg-[#E5F9ED] text-[#00C060]'}`}>
          {badge.label}
        </span>
      )}
    </div>
    <div className="mt-1 flex-1 flex flex-col justify-end w-full min-w-0">
      <h4 className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1 truncate">{title}</h4>
      <p className="text-[18px] font-bold text-[#111111] leading-tight mb-0.5 truncate">{primaryValue}</p>
      
      {sparkline ? (
         <div className="w-full h-[20px] mt-1 relative">
           <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible" preserveAspectRatio="none">
             <polyline points={sparkline} fill="none" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
           </svg>
         </div>
      ) : (
        <p className="text-[13px] text-[#6E6E73] truncate">{secondaryValue}</p>
      )}
    </div>
  </button>
);

const HealthSummaryTiles = ({ pet, meds, onOpenSheet }) => {
  // 1. Vaccinations Summary
  const sortedVacs = [...MOCK_HEALTH_DATA.vaccinations].sort((a,b) => new Date(a.nextDate) - new Date(b.nextDate));
  const nextVac = sortedVacs[0];
  const daysToVac = calculateExpiryDays(nextVac.nextDate);
  let vacBadge = { label: 'Valid', type: 'success' };
  if (daysToVac < 0) vacBadge = { label: 'Overdue', type: 'error' };
  else if (daysToVac <= 30) vacBadge = { label: 'Expiring', type: 'warning' };

  // 2. Medications Summary
  const activeMeds = meds.filter(m => m.isActive);
  const activeCount = activeMeds.length;
  // Simplification for mock: assume if there's an active med, it's due today if not taken
  let medsBadge = null;
  if (activeCount > 0) {
    const anyDue = activeMeds.some(m => !m.takenToday);
    medsBadge = anyDue ? { label: 'Due', type: 'warning' } : { label: 'Up to date', type: 'success' };
  }

  // 3. Allergies Summary
  const allergiesCount = MOCK_HEALTH_DATA.allergies.length;
  const severities = MOCK_HEALTH_DATA.allergies.map(a => a.severity);
  let highestSeverity = 'Mild';
  let algBadge = { label: 'Mild', type: 'success' };
  if (severities.includes('severe')) { highestSeverity = 'Severe'; algBadge = { label: 'Severe', type: 'error' }; }
  else if (severities.includes('moderate')) { highestSeverity = 'Moderate'; algBadge = { label: 'Moderate', type: 'warning' }; }

  // 4. Weight Summary
  const history = MOCK_HEALTH_DATA.weightHistory;
  const currentWeight = history[history.length - 1].weight;
  const prevWeight = history.length > 1 ? history[history.length - 2].weight : currentWeight;
  const weightDelta = (currentWeight - prevWeight).toFixed(1);
  const trendLabel = weightDelta > 0 ? `+${weightDelta} ${pet.weightUnit}` : weightDelta < 0 ? `${weightDelta} ${pet.weightUnit}` : `Maintained`;
  
  const currentWNum = parseFloat(currentWeight);
  const rangeParts = MOCK_HEALTH_DATA.idealWeightRange.split('-').map(p => parseFloat(p.trim()));
  const isHealthy = currentWNum >= rangeParts[0] && currentWNum <= rangeParts[1];
  const weightBadge = { label: isHealthy ? 'Healthy' : 'Monitor', type: isHealthy ? 'success' : 'warning' };

  // Sparkline points
  const maxW = Math.max(...history.map(d => d.weight)) + 1;
  const minW = Math.min(...history.map(d => d.weight)) - 1;
  const range = maxW - minW;
  const sparklinePoints = history.map((d, i) => {
    const x = (i / (history.length - 1)) * 100;
    const y = 20 - ((d.weight - minW) / range) * 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      <HealthTile 
        title="Vaccines" icon={Syringe} iconColor="#00C060" badge={vacBadge}
        primaryValue={nextVac.name} secondaryValue={`Due ${nextVac.nextDate}`}
        onClick={() => onOpenSheet('VACCINATIONS_SECTION')}
      />
      <HealthTile 
        title="Medications" icon={Pill} iconColor="#007AFF" badge={medsBadge}
        primaryValue={activeCount > 0 ? "Today" : 'None Active'} 
        secondaryValue={activeCount > 0 ? `${activeCount} active, next at ${activeMeds[0].nextDoseTime}` : 'No upcoming doses'}
        onClick={() => onOpenSheet('MEDICATIONS_SECTION')}
      />
      <HealthTile 
        title="Allergies" icon={AlertTriangle} iconColor="#FF9500" badge={allergiesCount > 0 ? algBadge : null}
        primaryValue={`${allergiesCount} logged`} secondaryValue="Tap to view"
        onClick={() => onOpenSheet('ALLERGIES_SECTION')}
      />
      <HealthTile 
        title="Weight" icon={Scale} iconColor="#FF6B35" badge={weightBadge}
        primaryValue={`${currentWeight} ${pet.weightUnit}`} secondaryValue={`${trendLabel} since last`}
        sparkline={sparklinePoints}
        onClick={() => onOpenSheet('WEIGHT_SECTION')}
      />
    </div>
  );
};

const FeedItem = ({ data, isLast, onOpenSheet }) => {
  const openDetails = () => {
    if (data.type === 'vaccine') onOpenSheet('VACCINE_DETAILS', data.item);
    if (data.type === 'vet') onOpenSheet('VET_DETAILS', data.item);
    if (data.type === 'med') onOpenSheet('MED_DETAILS', data.item);
    if (data.type === 'weight') onOpenSheet('WEIGHT_DETAILS', data.item);
  };

  return (
    <div onClick={openDetails} className="relative flex gap-4 cursor-pointer group px-2 py-1">
      {/* Timeline line */}
      {!isLast && <div className="absolute left-[27px] top-[40px] bottom-[-10px] w-[2px] bg-[#F0F0F2] z-0" />}
      
      {/* Icon */}
      <div className="relative z-10 w-10 h-10 rounded-full bg-[#FFFFFF] border border-[#E5E5E5] shadow-sm flex items-center justify-center shrink-0 group-active:scale-95 transition-transform">
        <data.Icon size={18} color={data.color} />
      </div>

      {/* Content */}
      <div className="flex-1 flex justify-between items-start pb-6 group-active:opacity-70 transition-opacity">
        <div>
          <h4 className="text-[16px] font-bold text-[#111111] leading-tight mb-1">{data.title}</h4>
          <p className="text-[14px] text-[#6E6E73] line-clamp-1">{data.subtitle}</p>
        </div>
        <span className="text-[13px] font-medium text-[#8E8E93] ml-2 shrink-0">{data.displayDate}</span>
      </div>
    </div>
  );
};

const RecentMedicalFeed = ({ pet, meds, onOpenSheet }) => {
  // Aggregate and sort feed data
  const feed = [
    ...MOCK_HEALTH_DATA.vaccinations.map(v => ({ type: 'vaccine', date: new Date(v.lastDate), displayDate: '10 May', title: v.name, subtitle: 'Vaccination given', item: v, Icon: Syringe, color: '#00C060' })),
    ...MOCK_HEALTH_DATA.vetVisits.map(v => ({ type: 'vet', date: new Date(v.date), displayDate: '22 Aug', title: v.reason, subtitle: v.vet, item: v, Icon: Stethoscope, color: '#111111' })),
    ...meds.map(m => ({ type: 'med', date: new Date(m.startDate), displayDate: '1 Feb', title: m.name, subtitle: m.isActive ? 'Started medication' : 'Medication cycle', item: m, Icon: Pill, color: '#007AFF' })),
    ...MOCK_HEALTH_DATA.weightHistory.map(w => ({ type: 'weight', date: new Date(w.date), displayDate: '10 Jan', title: `${w.weight} ${pet.weightUnit}`, subtitle: 'Weight logged', item: w, Icon: Scale, color: '#FF6B35' }))
  ].sort((a, b) => b.date - a.date);

  const PAGE_SIZE = 5;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  
  const visibleItems = feed.slice(0, visibleCount);
  const isAllShown = visibleCount >= feed.length;
  
  const handleToggle = () => {
    if (isAllShown) {
      setVisibleCount(PAGE_SIZE);
    } else {
      setVisibleCount(v => Math.min(v + PAGE_SIZE, feed.length));
    }
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-5 px-1">
        <h3 className="text-[18px] font-bold text-[#111111]">
          Recent Medical <span className="text-[14px] font-medium text-[#8E8E93] ml-1">· {Math.min(visibleCount, feed.length)}/{feed.length}</span>
        </h3>
      </div>
      <div className="space-y-0 pl-1">
        {visibleItems.map((item, i) => (
          <FeedItem key={`${item.type}_${i}`} data={item} isLast={i === visibleItems.length - 1} onOpenSheet={onOpenSheet} />
        ))}
      </div>
      
      {feed.length > PAGE_SIZE && (
        <div className="mt-4 mb-2 flex justify-center">
          <button 
            onClick={handleToggle}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#FFFFFF] border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-full text-[13px] font-semibold text-[#111111] active:scale-95 transition-all duration-200"
          >
            {isAllShown ? (
              <>Show less <ChevronDown size={16} className="rotate-180" /></>
            ) : (
              <>Show {Math.min(PAGE_SIZE, feed.length - visibleCount)} more <ChevronDown size={16} /></>
            )}
          </button>
        </div>
      )}
    </section>
  );
};

const HealthTab = ({ pet, meds, onMarkTaken, onOpenSheet }) => {
  return (
    <div className="px-5 py-6">
      <HealthSummaryTiles pet={pet} meds={meds} onOpenSheet={onOpenSheet} />
      <VetVisitsSummaryCard onOpenSheet={onOpenSheet} />
      <RecentMedicalFeed pet={pet} meds={meds} onOpenSheet={onOpenSheet} />
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
          <Card key={pet.id} clickable onClick={() => onSelectPet(pet.id)} className="!p-4 bg-white">
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

const PetProfileScreen = ({ pet, onUpdate, showToast }) => {
  const [activePetTab, setActivePetTab] = useState('Health'); // Set to Health by default to see changes
  const [displayPetTab, setDisplayPetTab] = useState('Health');
  const [isFading, setIsFading] = useState(false);

  // LIFTED SHEET STATE
  const [editSheet, setEditSheet] = useState(null); 
  const [triggerSheet, setTriggerSheet] = useState(false);
  const [milestoneSheet, setMilestoneSheet] = useState(false);
  const [newTrigger, setNewTrigger] = useState('');
  const [msTitle, setMsTitle] = useState('');
  const [msDate, setMsDate] = useState('');
  const [msNote, setMsNote] = useState('');

  // HEALTH LIFTED STATE
  const [healthSheet, setHealthSheet] = useState({ type: null, data: null });
  const [meds, setMeds] = useState(MOCK_HEALTH_DATA.medications);

  const handleTabSwitch = (tab) => {
    if (tab === activePetTab) return;
    setActivePetTab(tab);
    setIsFading(true);
    setTimeout(() => {
      setDisplayPetTab(tab);
      setIsFading(false);
    }, 200);
  };

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

  const handleMarkTaken = (id) => {
    setMeds(meds.map(m => m.id === id ? { ...m, takenToday: true } : m));
  };

  const openHealthSheet = (type, data = null) => setHealthSheet({ type, data });
  const closeHealthSheet = () => setHealthSheet({ type: null, data: null });

  if (!pet) return null;

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Scrollable Main Content */}
      <ScreenContainer>
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
          ) : displayPetTab === 'Health' ? (
            <HealthTab pet={pet} meds={meds} onMarkTaken={handleMarkTaken} onOpenSheet={openHealthSheet} />
          ) : (
            <div className="pt-10">
              <EmptyState icon={displayPetTab === 'Documents' ? FileText : displayPetTab === 'Share' ? Share2 : AlertCircle} title={displayPetTab} description={`Detailed ${displayPetTab.toLowerCase()} tracking coming in future steps.`} />
            </div>
          )}
        </div>
      </ScreenContainer>

      {/* Basic Sheets */}
      <BottomSheet isOpen={!!editSheet} onClose={() => setEditSheet(null)} title={`Edit ${editSheet?.label}`}>
        <div className="space-y-6 pt-2">
          <TextInput 
            type={editSheet?.type || 'text'}
            value={editSheet?.value || ''} 
            onChange={e => setEditSheet({ ...editSheet, value: e.target.value })}
            placeholder={`Enter ${editSheet?.label?.toLowerCase()}`}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditSheet(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit}>Save</Button>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={triggerSheet} onClose={() => setTriggerSheet(false)} title="Add Anxiety Trigger">
        <div className="space-y-6 pt-2">
          <SearchInput value={newTrigger} onChange={e => setNewTrigger(e.target.value)} onClear={() => setNewTrigger('')} placeholder="Search or type custom..." />
          <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar">
            {COMMON_ANXIETY_TRIGGERS.filter(t => t.toLowerCase().includes(newTrigger.toLowerCase()) && !pet.anxietyTriggers.includes(t)).map(t => (
              <button key={t} onClick={() => addTrigger(t)} className="w-full text-left px-4 py-3 bg-[#F7F7F8] rounded-[14px] text-[15px] font-medium text-[#111111] active:bg-[#E5E5E5]">
                {t}
              </button>
            ))}
          </div>
          {newTrigger && !COMMON_ANXIETY_TRIGGERS.includes(newTrigger) && (
            <Button variant="secondary" onClick={() => addTrigger(newTrigger)}>Add "{newTrigger}"</Button>
          )}
        </div>
      </BottomSheet>

      <BottomSheet isOpen={milestoneSheet} onClose={() => setMilestoneSheet(false)} title="Add Milestone">
        <div className="space-y-5 pt-2">
          <TextInput label="Title" placeholder="e.g., First trip to the vet" value={msTitle} onChange={e => setMsTitle(e.target.value)} />
          <TextInput label="Date" type="date" value={msDate} onChange={e => setMsDate(e.target.value)} />
          <TextInput label="Note (Optional)" placeholder="Add some details..." value={msNote} onChange={e => setMsNote(e.target.value)} />
          <div className="flex gap-3 pt-4">
            <Button variant="secondary" onClick={() => setMilestoneSheet(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveMilestone} disabled={!msTitle || !msDate}>Save</Button>
          </div>
        </div>
      </BottomSheet>

      {/* HEALTH SECTION SHEETS (Triggered from Tiles) */}
      <BottomSheet isOpen={healthSheet.type === 'VACCINATIONS_SECTION'} onClose={closeHealthSheet} title="Vaccinations">
         <div className="pt-2">
           <VaccinationsSection data={MOCK_HEALTH_DATA.vaccinations} onOpenSheet={openHealthSheet} />
         </div>
      </BottomSheet>

      <BottomSheet isOpen={healthSheet.type === 'VET_VISITS_SECTION'} onClose={closeHealthSheet} title="Vet Visits">
         <div className="pt-2">
           <VetVisitsSection data={MOCK_HEALTH_DATA.vetVisits} onOpenSheet={openHealthSheet} />
         </div>
      </BottomSheet>

      <BottomSheet isOpen={healthSheet.type === 'MEDICATIONS_SECTION'} onClose={closeHealthSheet} title="Medications">
         <div className="pt-2">
           <MedicationsSection data={meds} onMarkTaken={handleMarkTaken} onOpenSheet={openHealthSheet} />
         </div>
      </BottomSheet>

      <BottomSheet isOpen={healthSheet.type === 'ALLERGIES_SECTION'} onClose={closeHealthSheet} title="Allergies">
         <div className="pt-2">
           <AllergiesSection data={MOCK_HEALTH_DATA.allergies} onOpenSheet={openHealthSheet} />
         </div>
      </BottomSheet>

      <BottomSheet isOpen={healthSheet.type === 'WEIGHT_SECTION'} onClose={closeHealthSheet} title="Weight Tracker">
         <div className="pt-2">
           <WeightTrackerSection data={MOCK_HEALTH_DATA.weightHistory} idealRange={MOCK_HEALTH_DATA.idealWeightRange} currentWeight={pet.weight} weightUnit={pet.weightUnit} onOpenSheet={openHealthSheet} />
         </div>
      </BottomSheet>

      {/* HEALTH DETAILS SHEETS (Triggered from Feed or Section Sheets) */}
      <BottomSheet isOpen={healthSheet.type === 'VACCINE_DETAILS'} onClose={closeHealthSheet} title="Vaccination Details">
        {healthSheet.data && (
          <div className="space-y-5 pt-2">
            <InfoRow label="Vaccine" value={healthSheet.data.name} />
            <Divider spacing="small" className="!my-0" />
            <InfoRow label="Given Date" value={healthSheet.data.lastDate} />
            <Divider spacing="small" className="!my-0" />
            <InfoRow label="Next Due" value={healthSheet.data.nextDate} />
            <div className="pt-4 flex gap-3">
               <Button variant="secondary" onClick={closeHealthSheet}>Close</Button>
               <Button variant="primary" onClick={() => { showToast('Edit coming soon'); closeHealthSheet(); }}>Edit</Button>
            </div>
          </div>
        )}
      </BottomSheet>

      <BottomSheet isOpen={healthSheet.type === 'VET_DETAILS'} onClose={closeHealthSheet} title="Vet Visit Details">
        {healthSheet.data && (
          <div className="space-y-5 pt-2">
             <h4 className="text-[18px] font-bold text-[#111111] mb-1">{healthSheet.data.reason}</h4>
             <p className="text-[15px] text-[#6E6E73] mb-4">{healthSheet.data.date} • {healthSheet.data.vet}</p>
             
             <div className="bg-[#F7F7F8] p-4 rounded-xl space-y-3">
               <div><span className="text-[13px] font-semibold text-[#8E8E93] uppercase block mb-1">Notes</span><span className="text-[15px] text-[#111111]">{healthSheet.data.notes}</span></div>
               <Divider spacing="small" className="!bg-black/5 !my-3" />
               <div><span className="text-[13px] font-semibold text-[#8E8E93] uppercase block mb-1">Prescriptions</span><span className="text-[15px] text-[#111111]">{healthSheet.data.prescriptions}</span></div>
               <Divider spacing="small" className="!bg-black/5 !my-3" />
               <div><span className="text-[13px] font-semibold text-[#8E8E93] uppercase block mb-1">Cost</span><span className="text-[15px] text-[#111111]">{healthSheet.data.cost}</span></div>
             </div>

             <div className="pt-4 flex flex-col gap-3">
               <Button variant="secondary" onClick={() => { showToast('Edit coming soon'); closeHealthSheet(); }}>Edit Visit</Button>
               <Button variant="destructive" onClick={() => { showToast('Visit deleted (mock)'); closeHealthSheet(); }}>Delete Visit</Button>
             </div>
          </div>
        )}
      </BottomSheet>

      <BottomSheet isOpen={healthSheet.type === 'MED_DETAILS'} onClose={closeHealthSheet} title="Medication Details">
        {healthSheet.data && (
          <div className="space-y-5 pt-2">
            <InfoRow label="Medication" value={healthSheet.data.name} />
            <Divider spacing="small" className="!my-0" />
            <InfoRow label="Purpose" value={healthSheet.data.purpose} />
            <Divider spacing="small" className="!my-0" />
            <InfoRow label="Dosage" value={healthSheet.data.dosage} />
            <Divider spacing="small" className="!my-0" />
            <InfoRow label="Frequency" value={healthSheet.data.frequency} />
            <div className="pt-4 flex flex-col gap-3">
               <Button variant="secondary" onClick={() => { showToast('Edit coming soon'); closeHealthSheet(); }}>Edit Medication</Button>
               <Button variant="destructive" onClick={() => { showToast('Medication stopped (mock)'); closeHealthSheet(); }}>Stop Medication</Button>
            </div>
          </div>
        )}
      </BottomSheet>

      <BottomSheet isOpen={healthSheet.type === 'ALLERGY_DETAILS'} onClose={closeHealthSheet} title="Edit Allergy">
        {healthSheet.data && (
          <div className="space-y-5 pt-2">
            <TextInput label="Allergen" value={healthSheet.data.allergen} readOnly />
            <Select label="Severity" value={healthSheet.data.severity} options={[{value:'mild', label:'Mild'}, {value:'moderate', label:'Moderate'}, {value:'severe', label:'Severe'}]} onChange={()=>{}} />
            <TextInput label="Reaction Details" value={healthSheet.data.reaction} readOnly />
            <div className="pt-4 flex flex-col gap-3">
               <Button variant="primary" onClick={() => { showToast('Saved'); closeHealthSheet(); }}>Save</Button>
               <Button variant="destructive" onClick={() => { showToast('Deleted (mock)'); closeHealthSheet(); }}>Delete</Button>
            </div>
          </div>
        )}
      </BottomSheet>
      
      <BottomSheet isOpen={healthSheet.type === 'WEIGHT_DETAILS'} onClose={closeHealthSheet} title="Edit Weight">
        {healthSheet.data && (
          <div className="space-y-5 pt-2">
            <TextInput label="Date" type="date" value={healthSheet.data.date} readOnly />
            <TextInput label={`Weight (${pet.weightUnit})`} type="number" value={healthSheet.data.weight} readOnly />
            <div className="pt-4 flex flex-col gap-3">
               <Button variant="primary" onClick={() => { showToast('Saved'); closeHealthSheet(); }}>Save</Button>
               <Button variant="destructive" onClick={() => { showToast('Deleted (mock)'); closeHealthSheet(); }}>Delete</Button>
            </div>
          </div>
        )}
      </BottomSheet>

      <BottomSheet isOpen={['ADD_VACCINE', 'ADD_VET', 'ADD_MED', 'ADD_ALLERGY', 'ADD_WEIGHT'].includes(healthSheet.type)} onClose={closeHealthSheet} title="Add Entry">
         <div className="space-y-6 pt-4 pb-2 text-center">
           <div className="w-16 h-16 rounded-full bg-[#F7F7F8] flex items-center justify-center mx-auto mb-2">
             <AlertCircle size={24} className="text-[#8E8E93]" />
           </div>
           <h3 className="text-[18px] font-semibold text-[#111111]">Feature Coming Soon</h3>
           <p className="text-[15px] text-[#6E6E73] px-4">Adding new health records will be fully functional in the next step.</p>
           <Button variant="primary" onClick={closeHealthSheet}>Got it</Button>
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
  const [activeTab, setActiveTab] = useState('pets'); // Default to Pets for Step 4 Demo
  const [displayTab, setDisplayTab] = useState('pets');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // App-level state for Pets Module
  const [petsData, setPetsData] = useState(INITIAL_MOCK_PETS);
  const [petsRoute, setPetsRoute] = useState('list'); // 'list' | 'profile'
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // Pets Routing Logic
  useEffect(() => {
    if (displayTab === 'pets') {
      if (petsData.length === 1 && petsRoute !== 'profile') {
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
        return <PetProfileScreen pet={pet} onUpdate={handleUpdatePet} showToast={showToast} />;
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

      <div id="app-mockup" className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
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
          </>
        )}
      </div>
    </div>
  );
}