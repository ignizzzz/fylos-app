import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Star,
  Clock,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Activity,
  Share,
  Loader2,
  CalendarDays,
  Check
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

const mockBookingData = {
  provider: {
    id: 'provider_001',
    name: 'Lukas F.',
    services: [
      { id: 'service_30min', duration: 30, label: '30 min Walk', price: 45, popular: false },
      { id: 'service_60min', duration: 60, label: '60 min Walk', price: 60, popular: false },
      { id: 'service_90min', duration: 90, label: '90 min Walk', price: 75, popular: true }
    ],
    addOns: [
      { id: 'pickup-dropoff', label: 'Pick-up & Drop-off', description: "We'll collect your pet from your home", price: 15 },
      { id: 'photo-updates', label: 'Photo updates', description: 'Get 3-5 photos during the walk', price: 5 },
      { id: 'offleash', label: 'Off-leash park time', description: 'Extra playtime at the park', price: 10 }
    ]
  },
  availability: {
    '2026-02-24': { available: true, slots: [
      { time: '09:00', available: true },
      { time: '14:00', available: true },
      { time: '16:00', available: true }
    ]},
    '2026-02-25': { available: true, slots: [
      { time: '10:00', available: true },
      { time: '15:00', available: false }
    ]},
    '2026-02-26': { available: false, slots: [] }
  },
  userPets: [
    { id: 'pet_001', name: 'Luna', breed: 'Golden Retriever' },
    { id: 'pet_002', name: 'Max', breed: 'French Bulldog' }
  ]
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

// --- UTILS (/src/utils) ---
const addMinutesToTime = (timeStr, minutes) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + minutes, 0);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatTimeRange = (startTime, duration) => {
  if (!startTime) return '';
  const endTime = addMinutesToTime(startTime, duration);
  return `${startTime} - ${endTime}`;
};

const calculateBookingTotal = (serviceId, addOnIds) => {
  const service = mockBookingData.provider.services.find(s => s.id === serviceId);
  const base = service ? service.price : 0;
  const addons = addOnIds.reduce((sum, id) => {
    const addon = mockBookingData.provider.addOns.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);
  return base + addons;
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
        <div className="w-full h-full rounded-full bg-[#F7F7F8] border border-black/[0.04] flex items-center justify-center text-[#111111] font-medium" style={{ fontSize }}>
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
  const baseStyles = "relative flex items-center justify-center rounded-2xl font-medium transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2";
  
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

// Fixed BottomSheet to match iOS standard (70% max height)
const BottomSheet = ({ isOpen, onClose, title, children, maxH = "max-h-[70vh]" }) => {
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
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
        style={{ touchAction: 'none' }}
      />
      <div 
        className={`relative w-full bg-[#FFFFFF] rounded-t-[24px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] ${maxH}`}
        style={{ 
          transform: `translateY(${!visible ? '100%' : `${translateY}px`})`,
          transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 0px)'
        }}
      >
        <div 
          className="w-full flex justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing touch-none shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-[5px] bg-black/[0.08] rounded-full" />
        </div>
        
        {title && (
          <div className="px-6 pb-4 shrink-0">
            <h3 className="text-[20px] font-bold text-[#111111]">{title}</h3>
          </div>
        )}

        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 relative">
          {children}
        </div>
      </div>
    </div>,
    portalNode
  );
};


// --- MODULE SCREENS ---

// --------------------------------------------------------
// STEP 12: BOOKING FLOW SCREEN (/src/screens/BookingScreen.jsx)
// --------------------------------------------------------
const BookingScreen = ({ provider, preselectedServiceId, onBack, onClose, onContinue }) => {
  // --- Form State ---
  const [selectedServiceId, setSelectedServiceId] = useState(
    preselectedServiceId || mockBookingData.provider.services.find(s => s.popular)?.id
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const showPetSelection = mockBookingData.userPets.length > 1;
  const [selectedPetId, setSelectedPetId] = useState(
    mockBookingData.userPets.length === 1 ? mockBookingData.userPets[0].id : null
  );
  
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [instructions, setInstructions] = useState('');
  
  // --- UI State ---
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [errors, setErrors] = useState({ service: false, date: false, pet: false });
  const [showValidation, setShowValidation] = useState(false);
  const [tempDate, setTempDate] = useState(null); 
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  // --- Derived Data ---
  const selectedService = mockBookingData.provider.services.find(s => s.id === selectedServiceId);
  const availableSlots = selectedDate ? (mockBookingData.availability[selectedDate]?.slots || []) : [];
  
  const isValid = selectedServiceId && selectedDate && selectedTime && (mockBookingData.userPets.length === 1 || selectedPetId);

  // --- Handlers ---
  const handleContinue = () => {
    if (!isValid) {
      setShowValidation(true);
      setErrors({
        service: !selectedServiceId,
        date: !selectedDate || !selectedTime,
        pet: showPetSelection && !selectedPetId
      });
      return;
    }
    setShowValidation(false);
    setErrors({ service: false, date: false, pet: false });
    onContinue(); // Navigate to Step 13 (Placeholder)
  };

  const openCalendar = () => {
    setTempDate(selectedDate);
    setIsCalendarOpen(true);
  };

  const confirmDate = () => {
    if (tempDate !== selectedDate) {
      setSelectedTime(null); 
    }
    setSelectedDate(tempDate);
    setIsCalendarOpen(false);
    if (errors.date) setErrors(prev => ({ ...prev, date: false }));
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return 'Select Date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="absolute inset-0 bg-[#FFFFFF] z-[70] overflow-hidden flex flex-col">
      
      {/* 1. FLOATING HEADER PILL WITH FADE */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF]/90 to-transparent pointer-events-none z-30" />
      
      <header className="absolute top-12 left-0 w-full z-40 px-5 flex flex-col gap-4 pointer-events-none">
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Back Pill */}
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] rounded-full active:scale-[0.96] transition-transform">
            <ChevronLeft size={22} color="#111111" />
          </button>
          
          {/* Center Text */}
          <div className="flex flex-col items-center justify-center -mt-0.5">
            <span className="text-[16px] font-bold text-[#111111] leading-tight tracking-tight">New Booking</span>
            <span className="text-[11px] font-medium text-[#8E8E93] leading-tight mt-0.5">Step 1 of 2</span>
          </div>
          
          {/* Close Pill */}
          <button onClick={() => setShowCloseDialog(true)} className="w-10 h-10 flex items-center justify-center bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] rounded-full active:scale-[0.96] transition-transform">
            <X size={20} color="#111111" />
          </button>
        </div>
        
        {/* Minimal Progress Bar */}
        <div className="pointer-events-auto w-[calc(100%-40px)] mx-5 h-[3px] bg-black/[0.04] rounded-full overflow-hidden">
          <div className="h-full bg-[#FF6B35] rounded-full w-1/2 transition-all duration-300" />
        </div>
      </header>

      {/* 2. CONTENT SCROLL */}
      <div className="absolute inset-0 overflow-y-auto custom-scrollbar pt-[130px] pb-[200px] px-5 bg-[#FFFFFF]">
        
        {/* Validation Global Hint */}
        {showValidation && !isValid && (
          <div className="mb-5 text-center">
            <span className="text-[13px] font-medium text-[#FF3B30] bg-[#FFF0F0] px-3 py-1.5 rounded-full">
              Please complete all required fields
            </span>
          </div>
        )}

        {/* 3. SERVICE SELECTION */}
        <section className="mb-7 mt-2">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Select Service</h3>
            {errors.service && <span className="text-[12px] text-[#FF3B30] font-medium">Required</span>}
          </div>
          <div className="bg-[#FFFFFF] rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            {mockBookingData.provider.services.map((svc, idx) => {
              const isSelected = selectedServiceId === svc.id;
              return (
                <div key={svc.id}>
                  <div 
                    onClick={() => { setSelectedServiceId(svc.id); setSelectedTime(null); if(errors.service) setErrors(prev => ({...prev, service: false})); }} 
                    className={`flex items-center justify-between py-3 pl-5 pr-4 cursor-pointer transition-colors ${isSelected ? 'bg-[#FF6B35]/[0.02]' : 'bg-[#FFFFFF] hover:bg-[#FAFAFA]'}`}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[15px] ${isSelected ? 'font-semibold text-[#111111]' : 'font-medium text-[#111111]'}`}>{svc.label}</span>
                        {svc.popular && <span className="text-[9px] font-bold text-[#FF6B35] bg-[#FF6B35]/[0.08] px-2.5 py-0.5 rounded-full uppercase tracking-wider">Popular</span>}
                      </div>
                      <span className="text-[13px] text-[#8E8E93]">{svc.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[15px] font-medium text-[#111111]">CHF {svc.price}</span>
                      <div className={`w-[20px] h-[20px] rounded-full border-[1px] flex items-center justify-center transition-colors ${isSelected ? 'border-[#FF6B35] bg-transparent' : 'border-[#CFCFD4]'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-[#FF6B35] rounded-full" />}
                      </div>
                    </div>
                  </div>
                  {idx < mockBookingData.provider.services.length - 1 && <div className="mx-5 h-[1px] bg-black/[0.03]" />}
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. DATE & TIME */}
        <section className="mb-7">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Date & Time</h3>
            {errors.date && <span className="text-[12px] text-[#FF3B30] font-medium">Required</span>}
          </div>
          
          <div className={`bg-[#FFFFFF] rounded-[20px] border transition-colors ${errors.date ? 'border-[#FF3B30]/30 shadow-sm' : 'border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]'}`}>
            
            {/* Date Row */}
            <button onClick={openCalendar} className="w-full flex justify-between items-center py-4 px-4 hover:bg-[#FAFAFA] rounded-[20px] transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-full bg-[#FAFAFA] border border-black/[0.02] flex items-center justify-center shrink-0">
                  <CalendarDays size={18} color="#111111" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[12px] text-[#8E8E93] font-medium leading-tight">Date</span>
                  <span className={`text-[15px] font-medium leading-tight mt-0.5 ${selectedDate ? 'text-[#111111]' : 'text-[#FF6B35]'}`}>
                    {formatDateLabel(selectedDate)}
                  </span>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#CFCFD4] opacity-70" />
            </button>

            {/* Time Slots (Compact chips below date) */}
            {selectedDate && (
              <>
                <div className="mx-4 h-[1px] bg-black/[0.03]" />
                <div className="p-4">
                  <span className="text-[12px] text-[#8E8E93] font-medium mb-3 block">Available Times</span>
                  {availableSlots.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {availableSlots.map((slot, idx) => {
                        const isSelected = selectedTime === slot.time;
                        return (
                          <button 
                            key={idx}
                            disabled={!slot.available}
                            onClick={() => { setSelectedTime(slot.time); if(errors.date) setErrors(prev => ({...prev, date: false})); }}
                            className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all border-[0.5px]
                              ${!slot.available ? 'bg-[#FAFAFA] text-[#CFCFD4] border-transparent cursor-not-allowed' : 
                                isSelected ? 'bg-[#FF6B35]/[0.06] text-[#FF6B35] border-transparent' : 'bg-[#FFFFFF] text-[#111111] border-black/[0.06] hover:border-black/20'}
                            `}
                          >
                            {slot.time}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-[14px] text-[#8E8E93] bg-[#FAFAFA] p-3 rounded-[12px] text-center">
                      No available slots for this date.
                    </div>
                  )}
                  
                  {selectedTime && selectedService && (
                    <div className="mt-4 flex items-center gap-2 text-[13px] font-medium text-[#8E8E93] bg-[#FAFAFA] p-3 rounded-[12px]">
                      <Clock size={15} />
                      <span>Scheduled for {formatTimeRange(selectedTime, selectedService.duration)}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </section>

        {/* 5. PET SELECTION (Radio rows if 2+ pets) */}
        {showPetSelection && (
          <section className="mb-7">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Which pet is going?</h3>
              {errors.pet && <span className="text-[12px] text-[#FF3B30] font-medium">Required</span>}
            </div>
            <div className={`bg-[#FFFFFF] rounded-[20px] overflow-hidden border transition-colors ${errors.pet ? 'border-[#FF3B30]/30 shadow-sm' : 'border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]'}`}>
              {mockBookingData.userPets.map((pet, idx) => {
                const isSelected = selectedPetId === pet.id;
                return (
                  <div key={pet.id}>
                    <button 
                      onClick={() => { setSelectedPetId(pet.id); if(errors.pet) setErrors(prev => ({...prev, pet: false})); }}
                      className={`w-full flex justify-between items-center py-4 px-4 transition-colors ${isSelected ? 'bg-[#FF6B35]/[0.02]' : 'bg-[#FFFFFF] hover:bg-[#FAFAFA]'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar initials={pet.name.charAt(0)} size={40} />
                        <div className="flex flex-col items-start">
                          <span className={`text-[15px] ${isSelected ? 'font-semibold' : 'font-medium'} text-[#111111]`}>{pet.name}</span>
                          <span className="text-[13px] text-[#8E8E93]">{pet.breed}</span>
                        </div>
                      </div>
                      <div className={`w-[20px] h-[20px] rounded-full border-[1px] flex items-center justify-center transition-colors ${isSelected ? 'border-[#FF6B35] bg-transparent' : 'border-[#CFCFD4]'}`}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-[#FF6B35] rounded-full" />}
                      </div>
                    </button>
                    {idx < mockBookingData.userPets.length - 1 && <div className="mx-4 h-[1px] bg-black/[0.03]" />}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* 6. ADD-ONS */}
        <section className="mb-7">
          <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-4">Extras (Optional)</h3>
          <div className="bg-[#FFFFFF] rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            {mockBookingData.provider.addOns.map((addon, idx) => {
              const isSelected = selectedAddOns.includes(addon.id);
              return (
                <div key={addon.id}>
                  <div 
                    onClick={() => {
                      if (isSelected) setSelectedAddOns(prev => prev.filter(id => id !== addon.id));
                      else setSelectedAddOns(prev => [...prev, addon.id]);
                    }} 
                    className="flex items-center justify-between py-3.5 px-4 cursor-pointer bg-[#FFFFFF] hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="flex-1 flex flex-col pr-4 justify-center">
                      <span className="text-[15px] font-medium text-[#111111]">{addon.label}</span>
                      <span className="text-[13px] text-[#A1A1A6] mt-0.5 leading-snug">{addon.description}</span>
                      <span className="text-[13px] font-medium text-[#111111] mt-1.5">+CHF {addon.price}</span>
                    </div>
                    {/* FYLOS iOS-style Checkbox */}
                    <div className={`w-[18px] h-[18px] rounded-[5px] border-[1px] flex shrink-0 items-center justify-center transition-colors ${isSelected ? 'bg-[#111111] border-[#111111]' : 'border-[#CFCFD4] bg-transparent'}`}>
                      {isSelected && <Check size={12} color="#FFF" strokeWidth={4} />}
                    </div>
                  </div>
                  {idx < mockBookingData.provider.addOns.length - 1 && <div className="mx-4 h-[1px] bg-black/[0.03]" />}
                </div>
              )
            })}
          </div>
        </section>

        {/* 7. SPECIAL INSTRUCTIONS */}
        <section className="mb-7">
          <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-4">Special Instructions</h3>
          <div className="relative">
            <textarea 
              className="w-full bg-[#FAFAFA] rounded-[20px] p-4 text-[15px] text-[#111111] placeholder:text-[#A1A1A6] border border-black/[0.03] focus:bg-[#FFFFFF] focus:border-[#FF6B35]/50 focus:ring-1 focus:ring-[#FF6B35]/30 focus:shadow-[0_2px_12px_rgba(0,0,0,0.02)] outline-none resize-none transition-all pb-8"
              rows={3}
              maxLength={500}
              placeholder="e.g. Please make sure to lock the bottom gate..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
            <span className="absolute bottom-3 right-4 text-[10px] text-[#CFCFD4] font-medium text-right">{instructions.length}/500</span>
          </div>
        </section>

        {/* 8. SUMMARY */}
        <section className="mb-4">
          <div className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-black/[0.04]">
            <div className="space-y-3">
              <div className="flex justify-between text-[14px]">
                <span className="text-[#6E6E73]">{selectedService?.label || 'Service'}</span>
                <span className="font-medium text-[#111111]">CHF {selectedService?.price || 0}</span>
              </div>
              {selectedAddOns.map(id => {
                const addon = mockBookingData.provider.addOns.find(a => a.id === id);
                return addon ? (
                  <div key={id} className="flex justify-between text-[14px]">
                    <span className="text-[#6E6E73]">{addon.label}</span>
                    <span className="font-medium text-[#111111]">+CHF {addon.price}</span>
                  </div>
                ) : null;
              })}
            </div>
            <div className="w-full h-[1px] bg-black/[0.03] mt-5 mb-4" />
            <div className="flex justify-between items-center pt-1">
              <span className="text-[15px] font-medium text-[#111111]">Total</span>
              <span className="text-[18px] font-bold text-[#111111]">CHF {calculateBookingTotal(selectedServiceId, selectedAddOns)}</span>
            </div>
          </div>
        </section>

      </div>

      {/* 9. STICKY CONTINUE BAR (FLOATING PILL) */}
      <div className="absolute bottom-[56px] left-[12px] right-[12px] z-40 pointer-events-none">
        <div className="pointer-events-auto bg-[#FFFFFF]/95 backdrop-blur-2xl border border-black/[0.03] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] rounded-full p-1 pl-5 flex justify-between items-center">
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-[#8E8E93] font-medium leading-tight mb-0.5 uppercase tracking-wider">Total</span>
            <span className="text-[15px] font-bold text-[#111111] leading-tight">
              CHF {calculateBookingTotal(selectedServiceId, selectedAddOns)}
            </span>
          </div>
          <button 
            className={`!w-auto py-3 px-6 rounded-full text-[14px] font-medium transition-all ${!isValid ? 'bg-[#F0F0F2] text-[#A1A1A6]' : 'bg-[#FF6B35] text-white shadow-[0_4px_12px_rgba(255,107,53,0.25)] active:scale-[0.96]'}`}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>

      {/* 10. CALENDAR BOTTOM SHEET */}
      <BottomSheet isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} title="" maxH="max-h-[70vh]">
        <div className="flex flex-col h-full relative">
          
          <div className="flex justify-between items-center text-center mb-6">
            <span className="text-[18px] font-bold text-[#111111]">Select Date</span>
            <span className="text-[15px] font-medium text-[#111111]">February 2026</span>
          </div>
          
          <div className="grid grid-cols-7 gap-y-4 text-center mb-6">
            {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="text-[13px] font-medium text-[#8E8E93]">{d}</span>)}
            
            {/* Feb 2026 calendar days */}
            {[...Array(28)].map((_, i) => {
              const day = i + 1;
              const dateStr = `2026-02-${day.toString().padStart(2, '0')}`;
              
              const isPast = day < 22;
              const hasAvailability = mockBookingData.availability[dateStr] !== undefined;
              const isAvailable = mockBookingData.availability[dateStr]?.available;
              
              const isSelectable = !isPast && hasAvailability && isAvailable;
              const isSelected = tempDate === dateStr;

              return (
                <button 
                  key={day}
                  disabled={!isSelectable}
                  onClick={() => setTempDate(dateStr)}
                  className="flex flex-col items-center justify-center gap-1.5"
                >
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full text-[15px] font-medium transition-all
                    ${isSelected ? 'bg-[#FF6B35] text-white shadow-md' : 
                      isSelectable ? 'bg-transparent text-[#111111] hover:bg-[#F0F0F2]' : 'text-[#CFCFD4] cursor-not-allowed'}
                  `}>
                    {day}
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${!isSelectable ? 'bg-transparent' : isAvailable ? 'bg-[#00C060]' : 'bg-transparent'}`} />
                </button>
              )
            })}
          </div>

          {/* Sticky Confirm inside Sheet */}
          <div className="sticky bottom-0 bg-[#FFFFFF]/95 backdrop-blur-md pt-4 pb-4 border-t border-black/[0.04] -mx-6 px-6 mt-auto">
             <Button 
               variant="primary" 
               disabled={!tempDate}
               onClick={confirmDate}
               className="!rounded-full !py-4 w-full shadow-[0_4px_12px_rgba(255,107,53,0.25)] font-medium"
             >
               Confirm Date
             </Button>
          </div>
        </div>
      </BottomSheet>

      {/* 11. ABANDON DIALOG OVERLAY */}
      {showCloseDialog && (
        <div className="absolute inset-0 z-[120] bg-black/30 flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-[24px] p-6 w-full max-w-[320px] shadow-2xl border border-black/[0.04]">
            <h3 className="text-[18px] font-bold text-[#111111] mb-2">Abandon Booking?</h3>
            <p className="text-[14px] text-[#6E6E73] mb-6 leading-relaxed">Your progress will be lost. Are you sure you want to leave?</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setShowCloseDialog(false); onClose(); }} 
                className="w-full py-3.5 rounded-[16px] font-medium bg-[#FFF0F0] text-[#FF3B30] active:scale-[0.98] transition-transform"
              >
                Yes, discard
              </button>
              <button 
                onClick={() => setShowCloseDialog(false)} 
                className="w-full py-3.5 rounded-[16px] font-medium bg-[#FAFAFA] text-[#111111] active:scale-[0.98] transition-transform"
              >
                Keep editing
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// --------------------------------------------------------
// STEP 13: PAYMENT PLACEHOLDER
// --------------------------------------------------------
const PaymentPlaceholderScreen = ({ onBack }) => (
  <div className="absolute inset-0 bg-[#FFFFFF] flex flex-col items-center justify-center z-[80] animate-in slide-in-from-right-full duration-300">
     <div className="w-16 h-16 bg-[#E5F9ED] rounded-full flex items-center justify-center mb-4">
        <CheckCircle2 size={32} color="#00C060" />
     </div>
     <h2 className="text-[20px] font-bold text-[#111111] mb-2">Booking Reserved!</h2>
     <p className="text-[#6E6E73] text-[15px] mb-8 text-center px-8">Proceeding to secure checkout (Step 13).</p>
     <button onClick={onBack} className="bg-[#F7F7F8] text-[#111111] px-6 py-3.5 rounded-full font-semibold active:scale-95 transition-transform">Go Back to Profile</button>
  </div>
);

// --------------------------------------------------------
// STEP 11: PROVIDER PROFILE SCREEN (UNCHANGED UI)
// --------------------------------------------------------
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
       
       {/* FLOATING HEADER */}
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
           
            {/* HERO SECTION */}
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

            {/* QUICK INFO BAR */}
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
                        className="relative overflow-hidden !p-4 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]"
                        onClick={() => onNavigate('booking', { preselectedServiceId: svc.id })}
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
                     <Card key={r.id} clickable className="!p-4 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
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
               <Card className="!p-5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
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

       {/* STICKY BOTTOM CTA */}
       <div className="absolute bottom-8 left-5 right-5 z-40 pointer-events-none">
           <div className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-black/[0.06] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.15)] rounded-[24px] p-2 pl-6 flex justify-between items-center">
               <div className="flex flex-col justify-center">
                  <span className="text-[12px] text-[#8E8E93] font-medium leading-tight mb-0.5">Book from</span>
                  <span className="text-[16px] font-bold text-[#111111] leading-tight">CHF 45</span>
               </div>
               <button 
                 className="!w-auto !py-3.5 !px-6 !rounded-[18px] bg-[#FF6B35] text-white font-semibold shadow-[0_4px_14px_rgba(255,107,53,0.3)] active:scale-95 transition-all"
                 onClick={() => onNavigate('booking', { providerId: provider.id, source: 'provider_profile' })}
               >
                 Book Lukas
               </button>
           </div>
       </div>

       {/* BOTTOM SHEETS & OVERLAYS */}
       <BottomSheet isOpen={menuSheet} onClose={() => setMenuSheet(false)} title="Options" maxH="max-h-[50vh]">
          <div className="space-y-1 pb-4 pt-2">
             <OptionRow icon={Share} label="Share Profile" onClick={() => setMenuSheet(false)} />
             <OptionRow icon={Star} label="Save for later" onClick={() => setMenuSheet(false)} />
             <OptionRow icon={AlertTriangle} label="Report Issue" danger onClick={() => setMenuSheet(false)} />
          </div>
       </BottomSheet>

       <BottomSheet isOpen={calendarSheet} onClose={() => setCalendarSheet(false)} title="Full Availability" maxH="max-h-[60vh]">
          <div className="py-4 space-y-6">
             <div className="bg-[#F7F7F8] w-full rounded-[20px] h-[300px] flex items-center justify-center border border-black/[0.04]">
                <span className="text-[#8E8E93] text-[14px] font-medium">Full month calendar grid (Ready for Booking Flow)</span>
             </div>
             <Button variant="primary" onClick={() => setCalendarSheet(false)}>Close</Button>
          </div>
       </BottomSheet>

       <BottomSheet isOpen={!!certSheet} onClose={() => setCertSheet(null)} title="Certification" maxH="max-h-[60vh]">
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
    <div className="absolute inset-0 bg-[#F0F0F2] z-[60] overflow-hidden flex flex-col">
       <header className="flex-none pt-14 pb-4 px-5 flex items-center bg-[#FFFFFF] shadow-[0_4px_20px_rgba(0,0,0,0.03)] z-10 sticky top-0 border-b border-black/[0.04]">
          <button onClick={onBack} className="w-11 h-11 flex items-center justify-center bg-[#F7F7F8] rounded-full active:scale-95 transition-all mr-4"><ChevronLeft size={22}/></button>
          <h2 className="text-[17px] font-semibold text-[#111111]">All Reviews</h2>
       </header>
       <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          <Card className="!p-6 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
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
                <Card key={i} className="!p-5 border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
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

// --- APP SHELL ---

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('provider_profile');
  const [screenParams, setScreenParams] = useState({});

  const handleNavigate = (screen, params = {}) => {
    setCurrentScreen(screen);
    setScreenParams(params);
  };

  const handleBackToRoot = () => {
    console.log('Would go back to search/services listing');
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

        {/* Root Profiles */}
        <ProviderProfileScreen 
          provider={mockProviderProfile} 
          onBack={handleBackToRoot} 
          onNavigate={handleNavigate}
        />

        {/* Overlays */}
        {currentScreen === 'reviews' && (
          <ReviewsScreen 
            provider={mockProviderProfile} 
            onBack={() => setCurrentScreen('provider_profile')} 
          />
        )}

        {currentScreen === 'booking' && (
          <BookingScreen 
            provider={mockBookingData.provider}
            preselectedServiceId={screenParams.preselectedServiceId}
            onBack={() => setCurrentScreen('provider_profile')}
            onClose={() => setCurrentScreen('provider_profile')}
            onContinue={() => setCurrentScreen('payment_placeholder')}
          />
        )}
        
        {currentScreen === 'payment_placeholder' && (
          <PaymentPlaceholderScreen 
             onBack={() => setCurrentScreen('provider_profile')} 
          />
        )}

        {/* This modal root is required for BottomSheet portals to mount */}
        <div id="modal-root" className="absolute inset-0 z-[110] pointer-events-none" />
      </div>
    </div>
  );
}