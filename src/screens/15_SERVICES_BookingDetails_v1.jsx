import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Clock, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Loader2, 
  Check, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Smartphone, 
  XCircle, 
  Bell,
  ChevronLeft,
  MoreVertical,
  MessageCircle,
  Phone,
  User,
  MapPin,
  Circle,
  Camera,
  Navigation2,
  ChevronRight,
  FileText,
  HelpCircle,
  Check as CheckIcon
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
    success: '#34C759', 
    successLight: '#E8F8EC',
    warning: '#FF9500',
    info: '#007AFF',
    divider: '#EAEAEA'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' }
};

// --- DESIGN SYSTEM COMPONENTS ---

const Spinner = ({ size = 'medium', color = 'primary', className = '' }) => {
  const sizes = { small: 16, medium: 24, large: 32 };
  const colors = { primary: THEME.colors.accent, grey: THEME.colors.tertiaryText, white: '#FFFFFF' };
  return <Loader2 className={`animate-spin ${className}`} size={sizes[size] || sizes.medium} color={colors[color] || color} />;
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
  const baseStyles = "relative flex items-center justify-center rounded-[16px] font-medium transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2";
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.25)] hover:bg-[#E85D2A]",
    secondary: "bg-[#FFFFFF] text-[#111111] border-[1px] border-[#E5E5E5] hover:bg-[#FAFAFA] shadow-[0_2px_8px_rgba(0,0,0,0.02)]",
    destructiveOutline: "bg-[#FFFFFF] text-[#FF3B30] border-[1px] border-[#FF3B30]/30 hover:bg-[#FFF5F5]"
  };
  const sizes = { 
    small: "px-3 py-[10px] text-[14px] h-[40px] rounded-[12px]",
    medium: "px-4 py-[14px] text-[16px] h-[52px]", 
    large: "px-4 py-[16px] text-[16px] h-[56px]" 
  };
  const isDisabled = disabled || isLoading;
  return (
    <button 
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : "w-auto"} ${isDisabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {isLoading ? <Spinner size="small" color={variant === 'primary' ? 'white' : 'primary'} /> : <>{Icon && <Icon size={size === 'small' ? 16 : 20} />}{children}</>}
    </button>
  );
};

const Toggle = ({ checked, onChange }) => (
  <div
    onClick={() => onChange(!checked)}
    className={`w-[50px] h-[30px] rounded-full p-[2px] transition-colors duration-300 cursor-pointer flex items-center ${
      checked ? 'bg-[#34C759]' : 'bg-[#EAEAEA]'
    }`}
  >
    <div 
      className={`w-[26px] h-[26px] bg-white rounded-full shadow-[0_2px_4px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ${
        checked ? 'translate-x-[20px]' : 'translate-x-0'
      }`} 
    />
  </div>
);

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    // FIXED: Changed from 'fixed' to 'absolute' to stay inside the iPhone frame container
    <div className="absolute inset-0 z-[120] flex items-end justify-center pointer-events-auto overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      <div className="w-full max-w-[390px] bg-[#FFFFFF] rounded-t-[20px] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-10 animate-in slide-in-from-bottom-full duration-300 max-h-[85vh] flex flex-col">
        {/* Grabber & Title */}
        <div className="flex-shrink-0 pt-3 pb-2 px-6 flex flex-col items-center">
          <div className="w-10 h-1.5 bg-[#EAEAEA] rounded-full mb-3" />
          {title && <h3 className="text-[17px] font-bold text-[#111111] w-full text-center">{title}</h3>}
        </div>
        {/* Scrollable Body */}
        <div className="overflow-y-auto custom-scrollbar px-6 pb-8 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * STEP 14: REQUEST SENT SCREEN
 */
const RequestSentScreen = ({ onClose, onViewBooking }) => {
  const mockRequestSentData = {
    providerName: 'Lukas F.',
    providerAvatar: 'https://i.pravatar.cc/150?img=12',
    providerRating: '4.9',
    total: 95.00,
    service: '90 min Walk',
    datetime: 'Mon, Feb 24 · 14:00–15:30',
    pet: 'Luna · Golden Retriever',
    addOns: ['Pick-up & Drop-off', 'Photo updates']
  };

  return (
    <div className="absolute inset-0 bg-[#F7F7F8] z-[90] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-400">
      
      {/* HEADER: Floating Close Button */}
      <div className="absolute top-[48px] right-[16px] z-50">
        <button 
          onClick={onClose} 
          className="w-11 h-11 flex items-center justify-center bg-[#FFFFFF] shadow-[0_4px_16px_rgba(0,0,0,0.08)] border border-black/[0.04] rounded-full active:scale-95 transition-transform"
          aria-label="Close"
        >
          <X size={22} color="#111111" />
        </button>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="absolute inset-0 overflow-y-auto custom-scrollbar pt-[110px] pb-[180px] px-4 flex flex-col items-center">
        
        {/* 1) HERO SUCCESS AREA */}
        <div className="flex flex-col items-center text-center w-full max-w-[280px] mb-8">
          <div className="relative w-[104px] h-[104px] bg-[#E8F8EC] rounded-full flex items-center justify-center mb-5 pop-animation">
            <Check size={48} color="#34C759" strokeWidth={3} className="check-animation" />
          </div>
          <h2 className="text-[24px] font-bold text-[#111111] tracking-tight mb-2.5">
            Request sent
          </h2>
          <p className="text-[15px] text-[#6E6E73] leading-relaxed">
            We sent your request to Lukas. You’ll get a notification when they respond (usually within 1h).
          </p>
        </div>

        {/* 2) BOOKING DETAILS CARD */}
        <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAEAEA] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <Avatar src={mockRequestSentData.providerAvatar} size={40} />
              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-[#111111] leading-tight">{mockRequestSentData.providerName}</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star size={12} className="text-[#111111] fill-[#111111]" />
                  <span className="text-[13px] font-medium text-[#6E6E73]">{mockRequestSentData.providerRating}</span>
                </div>
              </div>
            </div>
            <div className="text-[16px] font-bold text-[#111111]">
              CHF {mockRequestSentData.total.toFixed(2)}
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-[#EAEAEA] mb-4" />
          
          <div className="space-y-3 text-[14px]">
            <div className="flex gap-3">
              <span className="text-[#8E8E93] w-[60px] shrink-0">Service</span>
              <span className="font-medium text-[#111111]">{mockRequestSentData.service}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#8E8E93] w-[60px] shrink-0">Time</span>
              <span className="font-medium text-[#111111]">{mockRequestSentData.datetime}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[#8E8E93] w-[60px] shrink-0">Pet</span>
              <span className="font-medium text-[#111111]">{mockRequestSentData.pet}</span>
            </div>
            {mockRequestSentData.addOns.length > 0 && (
              <div className="flex gap-3">
                <span className="text-[#8E8E93] w-[60px] shrink-0">Extras</span>
                <span className="font-medium text-[#111111] leading-snug">
                  {mockRequestSentData.addOns.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 3) WHAT HAPPENS NEXT SECTION */}
        <div className="w-full mb-4">
          <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3 ml-1">
            What happens next
          </h3>
          <div className="w-full bg-[#FFFFFF] rounded-[16px] border border-[#EAEAEA] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-4 space-y-4">
            
            <div className="flex gap-3 items-start">
              <Clock size={20} className="text-[#8E8E93] shrink-0" strokeWidth={1.5} />
              <span className="text-[14px] text-[#111111] leading-snug pt-[1px]">Lukas has up to 24h to respond</span>
            </div>
            
            <div className="flex gap-3 items-start">
              <CreditCard size={20} className="text-[#8E8E93] shrink-0" strokeWidth={1.5} />
              <span className="text-[14px] text-[#111111] leading-snug pt-[1px]">CHF {mockRequestSentData.total.toFixed(2)} is on hold (not charged yet)</span>
            </div>
            
            <div className="flex gap-3 items-start">
              <Bell size={20} className="text-[#8E8E93] shrink-0" strokeWidth={1.5} />
              <span className="text-[14px] text-[#111111] leading-snug pt-[1px]">You’ll be notified when they respond</span>
            </div>
            
            <div className="flex gap-3 items-start">
              <CheckCircle2 size={20} className="text-[#34C759] shrink-0" strokeWidth={1.5} />
              <span className="text-[14px] text-[#111111] leading-snug pt-[1px]">If accepted → payment is processed</span>
            </div>
            
            <div className="flex gap-3 items-start">
              <XCircle size={20} className="text-[#8E8E93] shrink-0" strokeWidth={1.5} />
              <span className="text-[14px] text-[#111111] leading-snug pt-[1px]">If declined → hold is released automatically</span>
            </div>
            
          </div>
        </div>
      </div>

      {/* 4) BOTTOM ACTIONS (Fixed at bottom) */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-[32px] pt-8 bg-gradient-to-t from-[#F7F7F8] via-[#F7F7F8]/95 to-transparent z-40 flex flex-col gap-3 pointer-events-none">
        <div className="pointer-events-auto flex flex-col gap-3">
          <Button variant="secondary" size="medium" onClick={onViewBooking}>
            View booking
          </Button>
          <Button variant="primary" size="medium" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * STEP 15: BOOKING DETAILS SCREEN (Command Center)
 */
const BookingDetailsScreen = ({ onBack }) => {
  // state: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'declined'
  const [status, setStatus] = useState('pending');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [notifications, setNotifications] = useState({ sms: true, push: true });
  const [toastMessage, setToastMessage] = useState('');

  const STATUS_CONFIG = {
    'pending': { color: THEME.colors.warning, bg: '#FFF4E5', icon: Clock, label: 'Pending Acceptance', subtext: 'Lukas has until 10:00 AM to respond' },
    'confirmed': { color: THEME.colors.success, bg: '#E8F8EC', icon: CheckCircle2, label: 'Confirmed', subtext: 'Upcoming on Mon, Feb 24 at 14:00' },
    'in-progress': { color: THEME.colors.info, bg: '#E5F0FF', icon: Navigation2, label: 'In Progress', subtext: 'Lukas is currently walking Luna' },
    'completed': { color: THEME.colors.secondaryText, bg: '#F2F2F7', icon: CheckIcon, label: 'Completed', subtext: 'Walk finished on Mon, Feb 24 at 15:30' },
    'cancelled': { color: THEME.colors.danger, bg: '#FFEBEA', icon: XCircle, label: 'Cancelled', subtext: 'Request was cancelled by you' },
    'declined': { color: THEME.colors.danger, bg: '#FFEBEA', icon: AlertTriangle, label: 'Declined', subtext: 'Lukas was unavailable for this time' }
  };

  const currentConfig = STATUS_CONFIG[status];

  // Derive timeline steps based on status
  const getTimelineSteps = () => {
    const baseSteps = [
      { id: 'requested', label: 'Request sent', time: '09:15 AM' }
    ];

    if (status === 'pending') {
      return [
        { ...baseSteps[0], state: 'done' },
        { id: 'accept', label: 'Lukas confirms', time: 'Waiting', state: 'current' },
        { id: 'service', label: 'Service starts', time: '14:00', state: 'upcoming' }
      ];
    }
    if (status === 'confirmed') {
      return [
        { ...baseSteps[0], state: 'done' },
        { id: 'accept', label: 'Booking confirmed', time: '09:45 AM', state: 'done' },
        { id: 'service', label: 'Service starts', time: '14:00', state: 'upcoming' }
      ];
    }
    if (status === 'in-progress') {
      return [
        { ...baseSteps[0], state: 'done' },
        { id: 'accept', label: 'Booking confirmed', time: '09:45 AM', state: 'done' },
        { id: 'service', label: 'Service in progress', time: 'Started 14:05', state: 'current' },
        { id: 'finish', label: 'Service completes', time: '~15:30', state: 'upcoming' }
      ];
    }
    if (status === 'completed') {
      return [
        { ...baseSteps[0], state: 'done' },
        { id: 'accept', label: 'Booking confirmed', time: '09:45 AM', state: 'done' },
        { id: 'service', label: 'Service completed', time: '15:35', state: 'done' }
      ];
    }
    if (status === 'cancelled' || status === 'declined') {
      return [
        { ...baseSteps[0], state: 'done' },
        { id: 'fail', label: status === 'cancelled' ? 'Request cancelled' : 'Request declined', time: '10:05 AM', state: 'failed' }
      ];
    }
    return baseSteps;
  };

  const handleTogglePref = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setToastMessage('Preferences updated');
    setTimeout(() => setToastMessage(''), 2000);
  };

  return (
    <div className="absolute inset-0 bg-[#F7F7F8] z-[90] flex flex-col animate-in slide-in-from-right duration-300">

      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Left: Back button */}
          <button
            onClick={onBack}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          {/* Center: Title */}
          <h2 className="text-[17px] font-semibold text-[#111111]">Booking</h2>
          {/* Right: Menu button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <MoreVertical size={22} color="#111111" />
          </button>
        </div>
      </header>

      {/* SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pb-[140px] px-4 flex flex-col gap-4" style={{ paddingTop: 54 }}>
        
        {/* 2) STATUS BANNER */}
        <div className="w-full rounded-[20px] p-4 flex flex-col gap-2" style={{ backgroundColor: currentConfig.bg }}>
          <div className="flex items-center gap-2">
            <currentConfig.icon size={18} color={currentConfig.color} strokeWidth={2.5} />
            <span className="text-[13px] font-bold uppercase tracking-wide" style={{ color: currentConfig.color }}>
              {currentConfig.label}
            </span>
          </div>
          <p className="text-[15px] font-medium text-[#111111]">{currentConfig.subtext}</p>
        </div>

        {/* 3) TIMELINE */}
        <div className="w-full bg-[#FFFFFF] rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#EAEAEA]">
          <div className="flex flex-col gap-0 relative">
            {getTimelineSteps().map((step, idx, arr) => (
              <div key={step.id} className="flex gap-4 relative">
                {/* Connector Line */}
                {idx < arr.length - 1 && (
                  <div className={`absolute left-[7px] top-[24px] bottom-[-8px] w-[2px] ${step.state === 'done' ? 'bg-[#34C759]' : 'bg-[#EAEAEA] dashed-line'}`} />
                )}
                
                {/* Status Dot */}
                <div className="flex flex-col items-center pt-1 z-10">
                  {step.state === 'done' ? (
                    <div className="w-4 h-4 rounded-full bg-[#34C759] flex items-center justify-center border-2 border-white shadow-sm">
                      <CheckIcon size={10} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  ) : step.state === 'current' ? (
                    <div className="w-4 h-4 rounded-full bg-[#FF6B35] border-[4px] border-[#FFF0EA]" />
                  ) : step.state === 'failed' ? (
                    <div className="w-4 h-4 rounded-full bg-[#FF3B30] flex items-center justify-center border-2 border-white shadow-sm">
                      <X size={10} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-white border-2 border-[#EAEAEA]" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex flex-col pb-6 ${step.state === 'upcoming' ? 'opacity-50' : 'opacity-100'}`}>
                  <span className={`text-[15px] ${step.state === 'current' ? 'font-extrabold text-[#111111]' : 'font-medium text-[#111111]'}`}>
                    {step.label}
                  </span>
                  <span className="text-[13px] text-[#6E6E73] mt-0.5">{step.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4) WALKER CARD */}
        <div className="w-full bg-[#FFFFFF] rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#EAEAEA] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar src="https://i.pravatar.cc/150?img=12" size={56} badge={<ShieldCheck size={10} />} badgeColor="#007AFF" />
              <div className="flex flex-col">
                <span className="text-[17px] font-bold text-[#111111] leading-tight">Lukas F.</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star size={14} className="text-[#111111] fill-[#111111]" />
                  <span className="text-[14px] font-medium text-[#111111]">4.9</span>
                  <span className="text-[14px] text-[#8E8E93]">(128)</span>
                  <span className="text-[#EAEAEA]">•</span>
                  <span className="text-[13px] text-[#8E8E93]">Replies ~1h</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="small" 
              icon={status === 'pending' || status === 'cancelled' || status === 'declined' ? Lock : MessageCircle} 
              disabled={status === 'pending' || status === 'cancelled' || status === 'declined'}
              className="flex-1 bg-[#F7F7F8] border-none shadow-none text-[13px] font-bold"
            >
              Message
            </Button>
            <Button 
              variant="secondary" 
              size="small" 
              icon={status === 'pending' || status === 'cancelled' || status === 'declined' ? Lock : Phone} 
              disabled={status === 'pending' || status === 'cancelled' || status === 'declined'}
              className="flex-1 bg-[#F7F7F8] border-none shadow-none text-[13px] font-bold"
            >
              Call
            </Button>
            <Button 
              variant="secondary" 
              size="small" 
              icon={User} 
              className="flex-1 bg-[#F7F7F8] border-none shadow-none text-[13px] font-bold"
            >
              Profile
            </Button>
          </div>
          {status === 'pending' && (
            <p className="text-[12px] text-[#8E8E93] text-center w-full mt-[-4px]">
              Contact options available after acceptance
            </p>
          )}
        </div>

        {/* 5) SERVICE DETAILS */}
        <div className="w-full bg-[#FFFFFF] rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#EAEAEA]">
          <h3 className="text-[16px] font-bold text-[#111111] mb-4">Service Details</h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <Clock size={20} className="text-[#8E8E93] shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-[#111111]">Mon, Feb 24 · 14:00–15:30</span>
                <span className="text-[13px] text-[#6E6E73]">90 min Dog Walk</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <MapPin size={20} className="text-[#8E8E93] shrink-0" strokeWidth={1.5} />
              <div className="flex flex-col">
                <span className="text-[15px] font-medium text-[#111111]">Bahnhofstrasse 12, Zurich</span>
                <span className="text-[13px] text-[#6E6E73]">Pick-up & Drop-off</span>
              </div>
            </div>

            <div className="w-full h-[1px] bg-[#F0F0F2] my-1" />

            <div className="flex gap-3">
              <span className="text-[14px] text-[#8E8E93] w-[80px] shrink-0">Pet</span>
              <span className="text-[14px] font-medium text-[#111111]">Luna (Golden Retriever)</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[14px] text-[#8E8E93] w-[80px] shrink-0">Add-ons</span>
              <span className="text-[14px] font-medium text-[#111111]">Photo updates, Feed after walk</span>
            </div>
            <div className="flex gap-3">
              <span className="text-[14px] text-[#8E8E93] w-[80px] shrink-0">Instructions</span>
              <div className="flex flex-col items-start gap-1">
                <span className="text-[14px] text-[#111111] line-clamp-2">
                  Please make sure she doesn't eat anything from the ground. Keys are under the doormat.
                </span>
                <button onClick={() => setIsInstructionsOpen(true)} className="text-[13px] font-bold text-[#FF6B35]">
                  Read more
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 6) PAYMENT SECTION */}
        <div className="w-full bg-[#FFFFFF] rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#EAEAEA]">
          <h3 className="text-[16px] font-bold text-[#111111] mb-4">Payment</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#6E6E73]">Subtotal</span>
              <span className="text-[14px] text-[#111111]">CHF 85.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#6E6E73]">Add-ons</span>
              <span className="text-[14px] text-[#111111]">CHF 10.00</span>
            </div>
            <div className="w-full h-[1px] bg-[#F0F0F2] my-1" />
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-bold text-[#111111]">Total</span>
              <span className="text-[16px] font-bold text-[#111111]">CHF 95.00</span>
            </div>

            <div className="mt-2 p-3 bg-[#F7F7F8] rounded-[12px] flex items-center justify-between border border-[#EAEAEA]">
              <div className="flex items-center gap-2">
                <CreditCard size={18} className="text-[#111111]" />
                <span className="text-[14px] font-medium text-[#111111]">Visa •••• 4242</span>
              </div>
              
              {/* Status Chip */}
              {status === 'pending' || status === 'confirmed' || status === 'in-progress' ? (
                <span className="text-[12px] font-bold text-[#007AFF] bg-[#E5F0FF] px-2 py-1 rounded-md">Authorized</span>
              ) : status === 'completed' ? (
                <span className="text-[12px] font-bold text-[#34C759] bg-[#E8F8EC] px-2 py-1 rounded-md">Charged</span>
              ) : (
                <span className="text-[12px] font-bold text-[#8E8E93] bg-[#EAEAEA] px-2 py-1 rounded-md">Released</span>
              )}
            </div>
            
            {(status === 'pending' || status === 'confirmed' || status === 'in-progress') && (
              <p className="text-[12px] text-[#8E8E93] px-1">Hold active — not charged yet</p>
            )}
            {(status === 'cancelled' || status === 'declined') && (
              <p className="text-[12px] text-[#8E8E93] px-1">Hold released. Expected 3–5 business days.</p>
            )}
          </div>
        </div>

        {/* 7) UPDATES */}
        <div className="w-full bg-[#FFFFFF] rounded-[20px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#EAEAEA]">
          <h3 className="text-[16px] font-bold text-[#111111] mb-4">Updates</h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center h-[30px]">
              <span className="text-[15px] font-medium text-[#111111]">Push notifications</span>
              <Toggle checked={notifications.push} onChange={() => handleTogglePref('push')} />
            </div>
            <div className="flex justify-between items-center h-[30px]">
              <span className="text-[15px] font-medium text-[#111111]">SMS updates</span>
              <Toggle checked={notifications.sms} onChange={() => handleTogglePref('sms')} />
            </div>
          </div>
        </div>

        {/* 8) NEED HELP */}
        <div className="w-full bg-[#FFFFFF] rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#EAEAEA] mb-8">
          <div className="flex justify-between items-center p-4 border-b border-[#F0F0F2] active:bg-[#F7F7F8] cursor-pointer">
            <span className="text-[15px] font-medium text-[#111111]">Modify booking</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-[#8E8E93]">Unavailable &lt;24h</span>
              <ChevronRight size={18} className="text-[#8E8E93]" />
            </div>
          </div>
          {(status === 'pending' || status === 'confirmed') && (
            <div className="flex justify-between items-center p-4 border-b border-[#F0F0F2] active:bg-[#F7F7F8] cursor-pointer">
              <span className="text-[15px] font-medium text-[#FF3B30]">Cancel booking</span>
              <ChevronRight size={18} className="text-[#8E8E93]" />
            </div>
          )}
          <div className="flex justify-between items-center p-4 border-b border-[#F0F0F2] active:bg-[#F7F7F8] cursor-pointer">
            <span className="text-[15px] font-medium text-[#111111]">Report issue</span>
            <ChevronRight size={18} className="text-[#8E8E93]" />
          </div>
          <div className="flex justify-between items-center p-4 active:bg-[#F7F7F8] cursor-pointer">
            <span className="text-[15px] font-medium text-[#111111]">Contact support</span>
            <ChevronRight size={18} className="text-[#8E8E93]" />
          </div>
        </div>

      </div>

      {/* 9) STICKY BOTTOM ACTIONS (Floating Pills) */}
      <div className="absolute bottom-0 left-0 right-0 px-4 pb-[32px] pt-12 bg-gradient-to-t from-[#F7F7F8] via-[#F7F7F8]/90 to-transparent z-40 flex justify-center pointer-events-none">
        
        {status === 'pending' && (
          <div className="pointer-events-auto w-full max-w-[200px]">
            <Button variant="destructiveOutline" size="medium" onClick={() => setStatus('cancelled')}>
              Cancel request
            </Button>
          </div>
        )}

        {status === 'in-progress' && (
          <div className="pointer-events-auto flex gap-3 w-full bg-white/80 backdrop-blur-md p-2 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white">
            <Button variant="secondary" size="small" icon={Navigation2} className="flex-1 h-[48px] rounded-[16px] border-none shadow-none bg-[#F7F7F8]">
              Track live
            </Button>
            <Button variant="primary" size="small" icon={Camera} className="flex-1 h-[48px] rounded-[16px]">
              View photos
            </Button>
          </div>
        )}

        {status === 'completed' && (
          <div className="pointer-events-auto flex gap-3 w-full bg-white/80 backdrop-blur-md p-2 rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-white">
            <Button variant="secondary" size="small" icon={Star} className="flex-1 h-[48px] rounded-[16px] border-none shadow-none bg-[#F7F7F8]">
              Leave review
            </Button>
            <Button variant="primary" size="small" className="flex-1 h-[48px] rounded-[16px]">
              Book again
            </Button>
          </div>
        )}

      </div>

      {/* KEBAB MENU (Bottom Sheet) */}
      <BottomSheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Booking Options">
        <div className="flex flex-col gap-2">
          
          {/* Debug Area to show off states */}
          <div className="bg-[#F7F7F8] p-3 rounded-[12px] mb-4">
            <span className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2 block">Debug Status</span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(STATUS_CONFIG).map(s => (
                <button 
                  key={s} 
                  onClick={() => { setStatus(s); setIsMenuOpen(false); }}
                  className={`text-[12px] px-3 py-1.5 rounded-full font-bold ${status === s ? 'bg-[#FF6B35] text-white' : 'bg-[#EAEAEA] text-[#111111]'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full text-left px-4 py-4 text-[16px] font-medium text-[#111111] active:bg-[#F7F7F8] rounded-[12px] flex items-center gap-3">
            <FileText size={20} className="text-[#8E8E93]" /> Download Receipt
          </button>
          <button className="w-full text-left px-4 py-4 text-[16px] font-medium text-[#111111] active:bg-[#F7F7F8] rounded-[12px] flex items-center gap-3">
            <HelpCircle size={20} className="text-[#8E8E93]" /> Contact FYLOS Support
          </button>
          
          <div className="w-full h-[1px] bg-[#EAEAEA] my-2" />
          
          <button className="w-full text-left px-4 py-4 text-[16px] font-bold text-[#FF3B30] active:bg-[#FFF5F5] rounded-[12px] flex items-center gap-3">
            <AlertTriangle size={20} className="text-[#FF3B30]" /> Report Issue
          </button>
        </div>
      </BottomSheet>

      {/* INSTRUCTIONS BOTTOM SHEET */}
      <BottomSheet isOpen={isInstructionsOpen} onClose={() => setIsInstructionsOpen(false)} title="Special Instructions">
        <p className="text-[15px] text-[#111111] leading-relaxed pb-8">
          Please make sure she doesn't eat anything from the ground. Keys are under the doormat. She can be a bit shy with big dogs, so please keep her on a short leash when passing by them. Give her a treat after the walk (they are on the kitchen counter).
        </p>
        <Button variant="primary" onClick={() => setIsInstructionsOpen(false)}>Done</Button>
      </BottomSheet>

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed top-[100px] left-1/2 transform -translate-x-1/2 bg-[#111111] text-white px-4 py-2 rounded-full text-[13px] font-medium shadow-lg z-[150] animate-in slide-in-from-top fade-in">
          {toastMessage}
        </div>
      )}

      {/* STYLES */}
      <style dangerouslySetInnerHTML={{__html: `
        .dashed-line {
          background-image: linear-gradient(to bottom, #EAEAEA 50%, transparent 50%);
          background-size: 2px 8px;
          background-repeat: repeat-y;
          background-color: transparent !important;
        }
      `}} />
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [view, setView] = useState('request_sent'); // 'request_sent' | 'booking_details'

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased">
      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black">
        
        {/* Dynamic Island Notch Simulator for Mobile View */}
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-[100] hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />
        
        {view === 'request_sent' && (
          <RequestSentScreen 
            onClose={() => console.log('Navigating to Home...')}
            onViewBooking={() => setView('booking_details')}
          />
        )}

        {view === 'booking_details' && (
          <BookingDetailsScreen onBack={() => setView('request_sent')} />
        )}

        {/* Root for Modals if needed */}
        <div id="modal-root" className="absolute inset-0 z-[110] pointer-events-none" />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          0% { stroke-dasharray: 100; stroke-dashoffset: 100; }
          100% { stroke-dasharray: 100; stroke-dashoffset: 0; }
        }
        .pop-animation {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .check-animation {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: drawCheck 0.4s ease-out 0.2s forwards;
        }
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}