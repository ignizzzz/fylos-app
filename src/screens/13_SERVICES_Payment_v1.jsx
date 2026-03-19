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
  Check,
  ChevronDown,
  CreditCard,
  Lock,
  ShieldCheck
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

// --- MOCK DATA FOR BOOKING ---
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

// --- UTILS ---
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

// STEP 1: BOOKING FLOW (PRIMARY)
const BookingScreen = ({ provider, preselectedServiceId, onBack, onClose, onContinue }) => {
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
  
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [errors, setErrors] = useState({ service: false, date: false, pet: false });
  const [showValidation, setShowValidation] = useState(false);
  const [tempDate, setTempDate] = useState(null); 
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const selectedService = mockBookingData.provider.services.find(s => s.id === selectedServiceId);
  const availableSlots = selectedDate ? (mockBookingData.availability[selectedDate]?.slots || []) : [];
  
  const isValid = selectedServiceId && selectedDate && selectedTime && (mockBookingData.userPets.length === 1 || selectedPetId);

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
    onContinue(); 
  };

  const confirmDate = () => {
    if (tempDate !== selectedDate) setSelectedTime(null); 
    setSelectedDate(tempDate);
    setIsCalendarOpen(false);
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return 'Select Date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="absolute inset-0 bg-[#FFFFFF] z-[70] overflow-hidden flex flex-col">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF]/90 to-transparent pointer-events-none z-30" />
      
      <header className="absolute top-12 left-0 w-full z-40 px-5 flex flex-col gap-4 pointer-events-none">
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] rounded-full active:scale-[0.96] transition-transform">
            <ChevronLeft size={22} color="#111111" />
          </button>
          
          <div className="flex flex-col items-center justify-center -mt-0.5">
            <span className="text-[16px] font-bold text-[#111111] leading-tight tracking-tight">New Booking</span>
            <span className="text-[11px] font-medium text-[#8E8E93] leading-tight mt-0.5">Step 1 of 2</span>
          </div>
          
          <button onClick={() => setShowCloseDialog(true)} className="w-10 h-10 flex items-center justify-center bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] rounded-full active:scale-[0.96] transition-transform">
            <X size={20} color="#111111" />
          </button>
        </div>
        
        <div className="pointer-events-auto w-[calc(100%-40px)] mx-5 h-[3px] bg-black/[0.04] rounded-full overflow-hidden">
          <div className="h-full bg-[#FF6B35] rounded-full w-1/2 transition-all duration-300" />
        </div>
      </header>

      <div className="absolute inset-0 overflow-y-auto custom-scrollbar pt-[130px] pb-[200px] px-5 bg-[#FFFFFF]">
        {showValidation && !isValid && (
          <div className="mb-5 text-center">
            <span className="text-[13px] font-medium text-[#FF3B30] bg-[#FFF0F0] px-3 py-1.5 rounded-full">
              Please complete all required fields
            </span>
          </div>
        )}

        {/* SERVICE SELECTION */}
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
                    onClick={() => { setSelectedServiceId(svc.id); setSelectedTime(null); setErrors(p => ({...p, service: false})); }} 
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

        {/* DATE & TIME */}
        <section className="mb-7">
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Date & Time</h3>
            {errors.date && <span className="text-[12px] text-[#FF3B30] font-medium">Required</span>}
          </div>
          <div className={`bg-[#FFFFFF] rounded-[20px] border transition-colors ${errors.date ? 'border-[#FF3B30]/30 shadow-sm' : 'border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]'}`}>
            <button onClick={() => { setTempDate(selectedDate); setIsCalendarOpen(true); }} className="w-full flex justify-between items-center py-4 px-4 hover:bg-[#FAFAFA] rounded-[20px] transition-colors">
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

            {selectedDate && (
              <>
                <div className="mx-4 h-[1px] bg-black/[0.03]" />
                <div className="p-4">
                  <span className="text-[12px] text-[#8E8E93] font-medium mb-3 block">Available Times</span>
                  <div className="flex flex-wrap gap-3">
                    {availableSlots.map((slot, idx) => (
                      <button 
                        key={idx}
                        disabled={!slot.available}
                        onClick={() => { setSelectedTime(slot.time); setErrors(p => ({...p, date: false})); }}
                        className={`px-4 py-2 rounded-full text-[14px] font-medium transition-all border-[0.5px]
                          ${!slot.available ? 'bg-[#FAFAFA] text-[#CFCFD4] border-transparent cursor-not-allowed' : 
                            selectedTime === slot.time ? 'bg-[#FF6B35]/[0.06] text-[#FF6B35] border-transparent' : 'bg-[#FFFFFF] text-[#111111] border-black/[0.06] hover:border-black/20'}
                        `}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
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

        {/* PET SELECTION */}
        {showPetSelection && (
          <section className="mb-7">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Which pet?</h3>
              {errors.pet && <span className="text-[12px] text-[#FF3B30] font-medium">Required</span>}
            </div>
            <div className={`bg-[#FFFFFF] rounded-[20px] overflow-hidden border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)]`}>
              {mockBookingData.userPets.map((pet, idx) => {
                const isSelected = selectedPetId === pet.id;
                return (
                  <div key={pet.id}>
                    <button 
                      onClick={() => { setSelectedPetId(pet.id); setErrors(p => ({...p, pet: false})); }}
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

        {/* ADD-ONS */}
        <section className="mb-7">
          <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-4">Extras (Optional)</h3>
          <div className="bg-[#FFFFFF] rounded-[20px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            {mockBookingData.provider.addOns.map((addon, idx) => {
              const isSelected = selectedAddOns.includes(addon.id);
              return (
                <div key={addon.id}>
                  <div 
                    onClick={() => isSelected ? setSelectedAddOns(p => p.filter(id => id !== addon.id)) : setSelectedAddOns(p => [...p, addon.id])} 
                    className="flex items-center justify-between py-3.5 px-4 cursor-pointer bg-[#FFFFFF] hover:bg-[#FAFAFA] transition-colors"
                  >
                    <div className="flex-1 flex flex-col pr-4">
                      <span className="text-[15px] font-medium text-[#111111]">{addon.label}</span>
                      <span className="text-[13px] text-[#A1A1A6] mt-0.5 leading-snug">{addon.description}</span>
                      <span className="text-[13px] font-medium text-[#111111] mt-1.5">+CHF {addon.price}</span>
                    </div>
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

        {/* SPECIAL INSTRUCTIONS */}
        <section className="mb-7">
          <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-4">Special Instructions</h3>
          <textarea 
            className="w-full bg-[#FAFAFA] rounded-[20px] p-4 text-[15px] text-[#111111] placeholder:text-[#A1A1A6] border border-black/[0.03] outline-none resize-none transition-all"
            rows={3}
            placeholder="e.g. Please make sure to lock the bottom gate..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </section>

        {/* SUMMARY BOX */}
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
            <div className="flex justify-between items-center">
              <span className="text-[15px] font-medium text-[#111111]">Total</span>
              <span className="text-[18px] font-bold text-[#111111]">CHF {calculateBookingTotal(selectedServiceId, selectedAddOns)}</span>
            </div>
          </div>
        </section>
      </div>

      {/* FLOATING CONTINUE BAR */}
      <div className="absolute bottom-[56px] left-[12px] right-[12px] z-40">
        <div className="bg-[#FFFFFF]/95 backdrop-blur-2xl border border-black/[0.03] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] rounded-full p-1 pl-5 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8E8E93] font-medium leading-tight mb-0.5 uppercase">Total</span>
            <span className="text-[15px] font-bold text-[#111111]">CHF {calculateBookingTotal(selectedServiceId, selectedAddOns)}</span>
          </div>
          <button 
            className={`py-3 px-6 rounded-full text-[14px] font-medium transition-all ${!isValid ? 'bg-[#F0F0F2] text-[#A1A1A6]' : 'bg-[#FF6B35] text-white shadow-[0_4px_12px_rgba(255,107,53,0.25)]'}`}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>

      {/* CALENDAR SHEET */}
      <BottomSheet isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)}>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center"><span className="text-[18px] font-bold">Select Date</span><span className="text-[15px] font-medium">Feb 2026</span></div>
          <div className="grid grid-cols-7 gap-y-4 text-center">
            {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="text-[13px] font-medium text-[#8E8E93]">{d}</span>)}
            {[...Array(28)].map((_, i) => {
              const day = i + 1;
              const ds = `2026-02-${day.toString().padStart(2, '0')}`;
              const isAvailable = mockBookingData.availability[ds]?.available;
              return (
                <button key={day} disabled={!isAvailable} onClick={() => setTempDate(ds)} className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-[15px] ${tempDate === ds ? 'bg-[#FF6B35] text-white' : isAvailable ? 'text-[#111111]' : 'text-[#CFCFD4] opacity-40'}`}>
                  {day}
                </button>
              );
            })}
          </div>
          <Button variant="primary" disabled={!tempDate} onClick={confirmDate}>Confirm Date</Button>
        </div>
      </BottomSheet>

      {/* ABANDON DIALOG */}
      {showCloseDialog && (
        <div className="absolute inset-0 z-[120] bg-black/40 flex items-center justify-center p-5">
          <div className="bg-[#FFFFFF] rounded-[24px] p-6 w-full max-w-[320px] shadow-2xl">
            <h3 className="text-[18px] font-bold mb-2">Abandon Booking?</h3>
            <p className="text-[14px] text-[#6E6E73] mb-6">Your progress will be lost. Are you sure?</p>
            <div className="flex flex-col gap-2">
              <button onClick={onClose} className="py-3.5 rounded-[16px] font-medium bg-[#FFF0F0] text-[#FF3B30]">Yes, discard</button>
              <button onClick={() => setShowCloseDialog(false)} className="py-3.5 rounded-[16px] font-medium bg-[#FAFAFA]">Keep editing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// STEP 2: PAYMENT PLACEHOLDER
const PaymentScreen = ({ onBack, onComplete }) => {
  // --- MOCK DATA FOR PAYMENT ---
  const paymentData = {
    total: 99.50, // Updated to include platform fee
    platformFee: 4.50,
    providerName: 'Lukas F.',
    providerAvatar: 'https://i.pravatar.cc/150?img=12',
    service: '90 min Walk',
    servicePrice: 75.00,
    datetime: 'Mon, Feb 24, 2026 · 14:00–15:30',
    pet: 'Luna · Golden Retriever',
    addOns: [
      { label: 'Pick-up & Drop-off', price: 15.00 },
      { label: 'Photo updates', price: 5.00 }
    ],
    savedCards: [
      { id: 'card_1', brand: 'Visa', last4: '4242', exp: '12/27', isDefault: true },
      { id: 'card_2', brand: 'Mastercard', last4: '8888', exp: '03/26', isDefault: false }
    ]
  };

  // --- STATE ---
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(paymentData.savedCards[0].id);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  
  // Sheet States
  const [activeSheet, setActiveSheet] = useState(null); // 'add_card', 'terms', 'card_menu', null
  const [menuCardId, setMenuCardId] = useState(null);
  const [sameAsHome, setSameAsHome] = useState(true);

  // Add Card Form State (Simple)
  const [cardNumber, setCardNumber] = useState('');

  // --- HANDLERS ---
  const handleAuthorize = () => {
    setIsAuthorizing(true);
    // Simulate network delay
    setTimeout(() => {
      setIsAuthorizing(false);
      onComplete(); // Navigate to Step 14 (Success)
    }, 2000);
  };

  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted.substring(0, 19));
  };

  const canSubmit = selectedCardId && termsAccepted && !isAuthorizing;

  return (
    <div className="absolute inset-0 bg-[#FFFFFF] z-[80] overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* 1. FLOATING HEADER PILL WITH FADE (Match Step 1) */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#FFFFFF] via-[#FFFFFF]/90 to-transparent pointer-events-none z-30" />
      
      <header className="absolute top-12 left-0 w-full z-40 px-5 flex flex-col gap-4 pointer-events-none">
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Back Pill */}
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] rounded-full active:scale-[0.96] transition-transform">
            <ChevronLeft size={22} color="#111111" />
          </button>
          
          {/* Center Text */}
          <div className="flex flex-col items-center justify-center -mt-0.5">
            <span className="text-[16px] font-bold text-[#111111] leading-tight tracking-tight">Payment</span>
            <span className="text-[10px] font-medium text-[#A1A1A6] leading-tight mt-0.5">Step 2 of 2</span>
          </div>
          
          {/* Close Pill */}
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-[#FFFFFF] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.04] rounded-full active:scale-[0.96] transition-transform">
            <X size={20} color="#111111" />
          </button>
        </div>
        
        {/* Full Progress Bar - Thinner & Inked */}
        <div className="pointer-events-auto w-[calc(100%-40px)] mx-5 h-[3px] bg-[#F0F0F2] rounded-full overflow-hidden">
          <div className="h-full bg-[#FF6B35] rounded-full w-full transition-all duration-300" />
        </div>
      </header>

      {/* 2. BODY LAYOUT (SCROLLABLE) */}
      <div className="absolute inset-0 overflow-y-auto custom-scrollbar pt-[130px] pb-[160px] px-5 bg-[#FFFFFF]">
        
        {/* SECTION A — BOOKING SUMMARY */}
        <section className="mb-5">
          <div className="bg-[#FFFFFF] rounded-[16px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden transition-all duration-300">
            {/* Collapsed Header (Always visible, acts as toggle) */}
            <button 
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              className="w-full flex justify-between items-center py-3.5 px-4 hover:bg-[#FAFAFA] transition-colors active:scale-[0.99]"
            >
              <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider">Booking summary</span>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold text-[#111111]">CHF {paymentData.total.toFixed(2)}</span>
                <ChevronDown size={16} className={`text-[#8E8E93] transition-transform duration-300 ${isSummaryExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Expanded Content */}
            <div className={`overflow-hidden transition-all duration-300 ${isSummaryExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="p-4 pt-0 border-t border-black/[0.03]">
                {/* Provider Info */}
                <div className="flex items-center gap-3 mt-3 mb-3">
                  <Avatar src={paymentData.providerAvatar} size={28} />
                  <span className="text-[14px] font-bold text-[#111111]">{paymentData.providerName}</span>
                </div>
                
                {/* Details list */}
                <div className="space-y-1.5 mb-3">
                  <div className="text-[13px] text-[#111111] font-medium">{paymentData.service}</div>
                  <div className="text-[12px] text-[#8E8E93]">{paymentData.datetime}</div>
                  <div className="text-[12px] text-[#8E8E93]">{paymentData.pet}</div>
                </div>

                {/* Add-ons */}
                {paymentData.addOns.length > 0 && (
                  <div className="space-y-1.5 mb-3">
                    {paymentData.addOns.map((addon, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-[#CFCFD4] rounded-full" />
                          <span className="text-[12px] text-[#8E8E93]">{addon.label}</span>
                        </div>
                        <span className="text-[12px] text-[#8E8E93]">+CHF {addon.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="w-full h-[1px] bg-black/[0.03] my-3" />

                {/* Breakdown */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#6E6E73]">Service</span>
                    <span className="text-[13px] font-medium text-[#111111]">CHF {paymentData.servicePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-[#6E6E73]">Add-ons</span>
                    <span className="text-[13px] font-medium text-[#111111]">
                      CHF {paymentData.addOns.reduce((sum, a) => sum + a.price, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div 
                      className="flex items-center gap-1.5 cursor-pointer active:opacity-70" 
                      onClick={(e) => { e.stopPropagation(); setActiveSheet('service_fee'); }}
                    >
                      <span className="text-[13px] text-[#6E6E73]">Service fee</span>
                      <Info size={14} className="text-[#8E8E93]" />
                    </div>
                    <span className="text-[13px] font-medium text-[#111111]">CHF {paymentData.platformFee.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-black/[0.03]">
                  <span className="text-[14px] font-bold text-[#111111]">Total</span>
                  <span className="text-[15px] font-bold text-[#111111]">CHF {paymentData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION B — PAYMENT METHOD */}
        <section className="mb-5">
          <h3 className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2.5">Payment method</h3>
          
          <div className="bg-[#FFFFFF] rounded-[16px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            {/* B1) Saved Cards List */}
            {paymentData.savedCards.map((card, idx) => {
              const isSelected = selectedCardId === card.id;
              return (
                <div key={card.id}>
                  <div 
                    onClick={() => setSelectedCardId(card.id)}
                    className={`flex items-center justify-between py-3 px-4 cursor-pointer transition-all duration-200
                      ${isSelected ? 'bg-[#FF6B35]/[0.02]' : 'bg-[#FFFFFF] hover:bg-[#FAFAFA]'}
                    `}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {/* Icon Placeholder */}
                      <div className={`w-10 h-7 rounded-[4px] border border-black/[0.06] flex items-center justify-center shrink-0 ${card.brand === 'Visa' ? 'bg-[#1A1F71]' : 'bg-[#222222]'}`}>
                        <span className="text-white text-[10px] font-bold italic leading-none">{card.brand}</span>
                      </div>
                      
                      <div className="flex flex-col justify-center pt-0.5">
                        <span className="text-[14px] font-semibold text-[#111111] leading-tight">{card.brand} •••• {card.last4}</span>
                        <span className="text-[12px] text-[#8E8E93] leading-tight mt-0.5">Expires {card.exp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* B2) Card Row Menu */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); setMenuCardId(card.id); setActiveSheet('card_menu'); }}
                        className="p-1 text-[#CFCFD4] hover:text-[#111111] transition-colors"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {/* Radio Selection */}
                      <div className={`w-[20px] h-[20px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200 shrink-0
                        ${isSelected ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/10 bg-transparent' : 'border-[#CFCFD4]'}
                      `}>
                        {isSelected && <div className="w-2 h-2 bg-[#FF6B35] rounded-full" />}
                      </div>
                    </div>
                  </div>
                  {idx < paymentData.savedCards.length - 1 && <div className="mx-4 h-[1px] bg-black/[0.03]" />}
                </div>
              )
            })}
            
            <div className="mx-4 h-[1px] bg-black/[0.03]" />

            {/* B3) Add New Card Row */}
            <button 
              onClick={() => setActiveSheet('add_card')}
              className="w-full flex items-center gap-3 py-3 px-4 bg-[#FFFFFF] hover:bg-[#FAFAFA] transition-colors text-[#FF6B35] active:scale-[0.99]"
            >
              <div className="w-10 h-7 rounded-[4px] border border-[#FF6B35]/20 bg-[#FF6B35]/[0.04] flex items-center justify-center shrink-0">
                <span className="text-[15px] font-medium leading-none mb-0.5">+</span>
              </div>
              <span className="text-[14px] font-medium">Add new card</span>
            </button>
          </div>
        </section>

        {/* SECTION C — AUTHORIZATION HOLD INFO CARD */}
        <section className="mb-5">
          <div className="bg-[#F7F7F8] rounded-[16px] p-3.5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[3px] h-full bg-[#FF6B35] opacity-70" />
            <div className="flex gap-3 items-start pl-1.5">
              <ShieldCheck size={18} className="text-[#FF6B35] shrink-0 mt-[2px]" />
              <div className="flex flex-col gap-0.5">
                <h4 className="text-[13px] font-semibold text-[#111111]">Authorization hold</h4>
                <p className="text-[12px] text-[#6E6E73] leading-relaxed pr-2">
                  We’ll place a temporary hold for CHF {paymentData.total.toFixed(2)} on your card. 
                  You’ll only be charged if Lukas accepts your booking request. 
                  If declined or not accepted within 24 hours, the hold is released automatically.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION D — TERMS CHECKBOX */}
        <section className="mb-4">
          <div className="bg-[#FFFFFF] rounded-[16px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-4 flex gap-3 items-start cursor-pointer transition-colors hover:bg-[#FAFAFA]"
               onClick={() => setTermsAccepted(!termsAccepted)}>
            
            <div className={`mt-[2px] w-[20px] h-[20px] rounded-[6px] border-[1.5px] shrink-0 flex items-center justify-center transition-colors 
              ${termsAccepted ? 'bg-[#FF6B35] border-[#FF6B35]' : 'border-[#CFCFD4] bg-[#FFFFFF]'}
            `}>
              {termsAccepted && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
            </div>

            <div className="text-[13px] text-[#111111] leading-relaxed">
              I agree to the{' '}
              <span onClick={(e) => { e.stopPropagation(); setActiveSheet('terms'); }} className="text-[#FF6B35] font-semibold active:opacity-70">Terms of Service</span>
              {' '}and{' '}
              <span onClick={(e) => { e.stopPropagation(); setActiveSheet('terms'); }} className="text-[#FF6B35] font-semibold active:opacity-70">Cancellation Policy</span>.
            </div>
          </div>
        </section>

      </div>

      {/* 3. STICKY BOTTOM CTA (FLOATING PILL) */}
      <div className="absolute bottom-[44px] left-[12px] right-[12px] z-40 pointer-events-none flex flex-col items-center gap-3">
        {/* Floating Helper Text */}
        <span className="text-[12px] text-[#8E8E93] font-medium tracking-wide">Hold only, not charged yet</span>
        
        {/* Pill Container (Identical to Step 1) */}
        <div className="pointer-events-auto w-full bg-[#FFFFFF]/95 backdrop-blur-2xl border border-black/[0.03] shadow-[0_8px_32px_-8px_rgba(0,0,0,0.12)] rounded-full p-1 pl-5 flex justify-between items-center transition-all">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8E8E93] font-medium leading-tight mb-0.5 uppercase">Total</span>
            <span className="text-[15px] font-bold text-[#111111]">CHF {paymentData.total.toFixed(2)}</span>
          </div>
          
          <button 
            disabled={!canSubmit}
            onClick={handleAuthorize}
            className={`relative flex items-center justify-center py-3 px-6 rounded-full text-[14px] font-medium transition-all duration-300 min-w-[140px] shrink-0 overflow-hidden ml-4
              ${!canSubmit 
                ? 'bg-[#F0F0F2] text-[#A1A1A6]' 
                : 'bg-[#FF6B35] text-white shadow-[0_4px_12px_rgba(255,107,53,0.25)] hover:bg-[#E85D2A] active:scale-[0.97]'
              }
            `}
          >
            {isAuthorizing ? (
              <Loader2 size={18} className="animate-spin text-white" />
            ) : (
              <span>Authorize payment</span>
            )}
          </button>
        </div>
      </div>

      {/* 4. ADD NEW CARD BOTTOM SHEET */}
      <BottomSheet isOpen={activeSheet === 'add_card'} onClose={() => setActiveSheet(null)} title="Add card" maxH="max-h-[80vh]">
        <div className="flex flex-col gap-4 pb-6">
          
          {/* Card Number */}
          <div>
            <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 block">Card Information</label>
            <div className="bg-[#FAFAFA] rounded-[16px] border border-black/[0.04] focus-within:border-[#FF6B35]/50 focus-within:ring-2 focus-within:ring-[#FF6B35]/10 transition-all overflow-hidden flex items-center px-4">
              <CreditCard size={18} className="text-[#CFCFD4] mr-3" />
              <input 
                type="text" 
                placeholder="Card number" 
                value={cardNumber}
                onChange={handleCardNumberChange}
                maxLength="19"
                className="w-full bg-transparent py-3.5 text-[15px] text-[#111111] placeholder:text-[#A1A1A6] outline-none"
              />
            </div>
          </div>

          {/* Expiry & CVV */}
          <div className="flex gap-3">
            <div className="flex-1 bg-[#FAFAFA] rounded-[16px] border border-black/[0.04] focus-within:border-[#FF6B35]/50 transition-all px-4">
              <input type="text" placeholder="MM / YY" maxLength="5" className="w-full bg-transparent py-3.5 text-[15px] text-[#111111] placeholder:text-[#A1A1A6] outline-none" />
            </div>
            <div className="flex-1 bg-[#FAFAFA] rounded-[16px] border border-black/[0.04] focus-within:border-[#FF6B35]/50 transition-all px-4">
              <input type="text" placeholder="CVV" maxLength="4" className="w-full bg-transparent py-3.5 text-[15px] text-[#111111] placeholder:text-[#A1A1A6] outline-none" />
            </div>
          </div>

          {/* Name */}
          <div className="bg-[#FAFAFA] rounded-[16px] border border-black/[0.04] focus-within:border-[#FF6B35]/50 transition-all px-4">
            <input type="text" placeholder="Cardholder name" className="w-full bg-transparent py-3.5 text-[15px] text-[#111111] placeholder:text-[#A1A1A6] outline-none" />
          </div>

          {/* Billing Address Toggle */}
          <div className="mt-1">
            <label className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 block">Billing Address</label>
            <div 
              onClick={() => setSameAsHome(!sameAsHome)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-colors 
                ${sameAsHome ? 'bg-[#111111] border-[#111111]' : 'border-[#CFCFD4]'}
              `}>
                {sameAsHome && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </div>
              <span className="text-[14px] text-[#111111]">Same as home address</span>
            </div>
          </div>

          {/* Default Toggle */}
          <div className="flex justify-between items-center py-1 mt-1">
            <span className="text-[14px] font-medium text-[#111111]">Set as default payment method</span>
            {/* iOS style toggle mock */}
            <div className="w-[44px] h-[24px] bg-[#00C060] rounded-full p-[2px] cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
              <div className="w-[20px] h-[20px] bg-white rounded-full shadow-sm transform translate-x-[20px] transition-transform" />
            </div>
          </div>
          
          <button 
            onClick={() => setActiveSheet(null)}
            className="w-full mt-2 py-3.5 rounded-[20px] text-[15px] font-semibold bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.25)] active:scale-[0.98] transition-transform"
          >
            Save card
          </button>

          {/* Trust Badge */}
          <div className="flex justify-center items-center gap-1.5 mt-1">
            <Lock size={12} className="text-[#CFCFD4]" />
            <span className="text-[11px] text-[#A1A1A6] font-medium tracking-wide">Secured by Stripe</span>
          </div>
        </div>
      </BottomSheet>

      {/* 5. TERMS BOTTOM SHEET */}
      <BottomSheet isOpen={activeSheet === 'terms'} onClose={() => setActiveSheet(null)} title="Legal" maxH="max-h-[70vh]">
        <div className="flex flex-col gap-4 pb-20">
          <h4 className="font-bold text-[16px]">Terms of Service</h4>
          <p className="text-[14px] text-[#6E6E73] leading-relaxed">
            By accepting these terms, you agree to FYLOS's core platform policies. We facilitate connections between pet owners and care providers. Payment authorization holds are placed 24 hours prior to booking confirmation and are automatically released if the provider declines or fails to respond.
          </p>
          <h4 className="font-bold text-[16px] mt-2">Cancellation Policy</h4>
          <p className="text-[14px] text-[#6E6E73] leading-relaxed">
            Bookings can be cancelled free of charge up to 24 hours before the scheduled start time. Cancellations within 24 hours may be subject to a 50% fee. If the provider cancels, a full refund (and release of any holds) will be processed immediately.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent">
          <button 
            onClick={() => { setTermsAccepted(true); setActiveSheet(null); }}
            className="w-full py-4 rounded-[20px] text-[16px] font-semibold bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.25)] active:scale-[0.98] transition-transform"
          >
            I Agree
          </button>
        </div>
      </BottomSheet>

      {/* 6. CARD MENU SHEET */}
      <BottomSheet isOpen={activeSheet === 'card_menu'} onClose={() => setActiveSheet(null)} title="Card Options" maxH="max-h-[40vh]">
        <div className="flex flex-col gap-2 pb-6">
          <button 
            onClick={() => { setActiveSheet(null); setSelectedCardId(menuCardId); }}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-[16px] hover:bg-[#FAFAFA] active:scale-[0.98] transition-all"
          >
            <CheckCircle2 size={20} className="text-[#111111]" />
            <span className="text-[16px] font-semibold text-[#111111]">Set as default</span>
          </button>
          
          <button 
            onClick={() => setActiveSheet(null)}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-[16px] hover:bg-[#FFE5E5] active:scale-[0.98] transition-all"
          >
            <AlertTriangle size={20} className="text-[#FF3B30]" />
            <span className="text-[16px] font-semibold text-[#FF3B30]">Remove card</span>
          </button>
        </div>
      </BottomSheet>

      {/* 7. SERVICE FEE SHEET */}
      <BottomSheet isOpen={activeSheet === 'service_fee'} onClose={() => setActiveSheet(null)} title="Service fee" maxH="max-h-[40vh]">
        <div className="flex flex-col gap-6 pb-6">
          <p className="text-[15px] text-[#6E6E73] leading-relaxed">
            This fee covers secure payments, customer support, and platform protection.
          </p>
          <button 
            onClick={() => setActiveSheet(null)}
            className="w-full py-4 rounded-[20px] text-[16px] font-semibold bg-[#FAFAFA] text-[#111111] hover:bg-[#F0F0F2] active:scale-[0.98] transition-all"
          >
            Got it
          </button>
        </div>
      </BottomSheet>

    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('payment');

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black">
        
        {/* Dynamic Notch for Web View */}
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-[100] hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {/* Step 1: Booking */}
        {currentScreen === 'booking' && (
          <BookingScreen 
            provider={mockBookingData.provider}
            onBack={() => console.log('Back to profile')}
            onClose={() => console.log('Dismiss')}
            onContinue={() => setCurrentScreen('payment')}
          />
        )}

        {/* Step 2: Payment (Authorization) */}
        {currentScreen === 'payment' && (
          <PaymentScreen 
            onBack={() => setCurrentScreen('booking')} 
            onComplete={() => { alert("Success! Navigating to Step 14: Request Sent."); }}
          />
        )}

        <div id="modal-root" className="absolute inset-0 z-[110] pointer-events-none" />
      </div>
    </div>
  );
}