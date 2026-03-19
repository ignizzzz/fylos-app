import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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
  ChevronLeft
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
    secondary: "bg-[#FFFFFF] text-[#111111] border-[1px] border-[#E5E5E5] hover:bg-[#FAFAFA] shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
  };
  const sizes = { 
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
      {isLoading ? <Spinner size="small" color={variant === 'primary' ? 'white' : 'primary'} /> : <>{Icon && <Icon size={20} />}{children}</>}
    </button>
  );
};

// STEP 14: REQUEST SENT
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

      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Left: Back button */}
          <button
            onClick={onClose}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          {/* Center: Title */}
          <h2 className="text-[17px] font-semibold text-[#111111]">Request Sent</h2>
          {/* Right: Invisible spacer */}
          <div className="w-[44px]" />
        </div>
      </header>

      {/* SCROLLABLE BODY */}
      <div className="absolute inset-0 overflow-y-auto custom-scrollbar pb-[180px] px-4 flex flex-col items-center" style={{ paddingTop: 54, zIndex: 0 }}>
        
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

      {/* 4) BOTTOM ACTIONS (Fixed, Stacked & Clean) */}
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

      {/* CUSTOM ANIMATIONS */}
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
      `}} />
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black">
        {/* Dynamic Island Notch Simulator */}
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-[100] hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />
        
        <RequestSentScreen 
          onClose={() => console.log('Navigating to Home/Bookings...')}
          onViewBooking={() => console.log('Navigating to Booking Details...')}
        />

        <div id="modal-root" className="absolute inset-0 z-[110] pointer-events-none" />
      </div>
    </div>
  );
}