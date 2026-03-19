import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Signal, Wifi, Battery, Check, X, 
  Dog as DogIcon, Calendar as CalendarIcon, 
  CreditCard, AlertCircle, Star, Info, Clock, ChevronDown, ChevronRight, MoreHorizontal, MapPin, FileText, Copy,
  Share, MessageCircle, HelpCircle
} from 'lucide-react';

// ==========================================
// 1. GLOBAL STYLES
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    :root {
      /* Palette */
      --primary: #111111; 
      --secondary: #6E6E73;
      --tertiary: #8E8E93;
      --accent: #FF6A3D; 
      --bg-app: #FFFFFF;
      --bg-subtle: #F7F7F8;
      --divider: #F1F1F1;
      --border-light: #EEEEEE;
      --glass: rgba(255, 255, 255, 0.95);
      --ease-spring: cubic-bezier(0.19, 1, 0.22, 1);
      --danger: #FF3B30;
    }

    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      background-color: #000; 
      color: var(--primary); 
      -webkit-font-smoothing: antialiased;
    } 
    
    .font-brand { font-family: 'Inter', sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .active-press { transition: transform 0.1s ease, opacity 0.2s ease; }
    .active-press:active { transform: scale(0.98); opacity: 0.7; }

    /* Custom Checkbox Animation */
    .checkbox-tick { transition: stroke-dashoffset 0.2s ease-in-out; }

    /* Animations */
    @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slideUpFade 0.3s var(--ease-spring) forwards; }

    @keyframes scaleFadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-scale-fade-in { animation: scaleFadeIn 0.15s ease-out forwards; }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }
    .animate-shake { animation: shake 0.3s ease-in-out; }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .animate-spin-slow { animation: spin 1s linear infinite; }
    
    /* Very slow spin for status ring (8s linear) */
    .animate-spin-very-slow { animation: spin 8s linear infinite; }

    /* Pulse for timeline current step */
    @keyframes orangePulse {
        0% { box-shadow: 0 0 0 0 rgba(255, 106, 61, 0.4); }
        70% { box-shadow: 0 0 0 6px rgba(255, 106, 61, 0); }
        100% { box-shadow: 0 0 0 0 rgba(255, 106, 61, 0); }
    }
    .animate-orange-pulse { animation: orangePulse 2s infinite; }
  `}</style>
);

// ==========================================
// 2. MOCK DATA
// ==========================================
const WALKER_IMAGE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80';

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const StatusBar = ({ lightMode = false }) => (
  <div className={`absolute top-0 left-0 w-full h-[54px] flex justify-between items-end px-7 pb-3 z-[150] text-[13px] font-semibold tracking-wide pointer-events-none ${lightMode ? 'text-white' : 'text-black'}`}>
    <span>9:41</span>
    <div className="flex items-center gap-1.5">
      <Signal size={16} strokeWidth={2.5} />
      <Wifi size={16} strokeWidth={2.5} />
      <Battery size={18} strokeWidth={2.5} />
    </div>
  </div>
);

// This component creates the gradient fade at the top
const HeaderFadeScrim = () => (
    <div 
        className="absolute top-0 left-0 w-full z-[40] pointer-events-none"
        style={{ 
            height: '120px',
            background: 'linear-gradient(to bottom, #FFFFFF 40%, rgba(255,255,255,0) 100%)' 
        }}
    />
);

const ToggleSwitch = ({ checked, onToggle }) => (
    <button 
        onClick={onToggle}
        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none ${checked ? 'bg-[#FF6A3D]' : 'bg-[#E5E5E5]'}`}
    >
        <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
);

const CancelRequestDialog = ({ onKeepWaiting, onCancelRequest }) => (
    <div className="absolute inset-0 z-[200] flex items-center justify-center px-8">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-fade-in" onClick={onKeepWaiting} />
        <div className="bg-white w-full max-w-[300px] rounded-[24px] pt-6 px-6 pb-6 shadow-2xl animate-scale-in relative z-10 flex flex-col items-center text-center">
            
            <div className="w-14 h-14 rounded-full border border-[#FF6A3D]/40 flex items-center justify-center text-[#FF6A3D] mb-4">
                <X size={20} strokeWidth={2} />
            </div>
            
            <h3 className="text-[18px] font-bold text-[#111111] mb-2 tracking-tight">Cancel request?</h3>
            
            <p className="text-[14px] text-[#6E6E73] mb-6 leading-relaxed">
                Your card will not be charged.
            </p>
            
            <div className="flex flex-col gap-3 w-full">
                <button 
                    onClick={onKeepWaiting}
                    className="w-full h-[48px] rounded-[16px] bg-[#111111] text-white text-[15px] font-semibold active:scale-[0.98] transition-transform shadow-md"
                >
                    Keep waiting
                </button>
                
                <button 
                    onClick={onCancelRequest}
                    className="w-full h-[48px] rounded-[16px] bg-transparent text-[#FF3B30] text-[15px] font-medium active:scale-[0.98] transition-transform hover:bg-zinc-50"
                >
                    Cancel request
                </button>
            </div>
        </div>
    </div>
);

const Toast = ({ message }) => (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md text-white px-4 py-2.5 rounded-[12px] text-[13px] font-medium shadow-lg animate-fade-in z-[100] flex items-center gap-2">
        <Check size={14} strokeWidth={3} />
        {message}
    </div>
);

// ==========================================
// 4. SCREENS
// ==========================================

// --- BOOKING DETAILS SCREEN ---
const BookingDetailsScreen = ({ onBack, onHome, onMessage }) => {
    const [copied, setCopied] = useState(false);
    const [isPolicyExpanded, setIsPolicyExpanded] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [showActionMenu, setShowActionMenu] = useState(false);
    const [showToast, setShowToast] = useState(false);
    
    // Notifications State
    const [notifications, setNotifications] = useState({
        sms: true,
        reminder: true,
        updates: true
    });

    // Countdown State
    const [countdown, setCountdown] = useState({ h: 18, m: 42 });

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev.m === 0) {
                    if (prev.h === 0) return prev;
                    return { h: prev.h - 1, m: 59 };
                }
                return { ...prev, m: prev.m - 1 };
            });
        }, 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const handleCopyId = () => {
        setCopied(true);
        setShowToast(true);
        setTimeout(() => {
            setCopied(false);
            setShowToast(false);
        }, 2000);
    };

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAddToCalendar = () => {
        // Create standard .ics content
        const title = "Walk with Lukas (Luna)";
        const location = "Bellevuestrasse 12, 8008 Zürich";
        const description = "Booking ID: #FY2024-00142";
        // Date format: YYYYMMDDTHHMMSS
        const start = "20260216T090000";
        const end = "20260216T103000";
    
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
END:VEVENT
END:VCALENDAR`;
    
        // Create a blob and trigger download
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'walk_booking.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="w-full h-full bg-white flex flex-col relative animate-fade-in font-sans">
            
            {/* Header - Transparent/Glassy */}
            <HeaderFadeScrim />
            <div className="absolute top-0 left-0 w-full z-[50] bg-transparent pt-[54px] pb-3 px-6 pointer-events-none">
                <div className="flex items-center justify-between pointer-events-auto">
                    <button onClick={onBack} className="w-9 h-9 flex items-center justify-center -ml-2 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-sm active:opacity-60 text-[#111111] transition-colors">
                        <ChevronLeft size={24} strokeWidth={2} />
                    </button>
                    
                    <span className="text-[17px] font-semibold text-[#111111] tracking-tight opacity-100">
                        Booking Details
                    </span>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setShowActionMenu(!showActionMenu)}
                            className="w-9 h-9 flex items-center justify-center -mr-2 rounded-full bg-white/80 backdrop-blur-md border border-white/50 shadow-sm active:opacity-60 text-[#111111] transition-colors"
                        >
                            <MoreHorizontal size={24} strokeWidth={2} className="text-[#111111]" />
                        </button>

                        {/* Popover Menu */}
                        {showActionMenu && (
                            <>
                                <div className="fixed inset-0 z-[100]" onClick={() => setShowActionMenu(false)} />
                                <div className="absolute top-[110%] right-[-8px] w-[220px] bg-white rounded-[12px] shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#F1F1F1] z-[101] py-1 animate-scale-fade-in origin-top-right flex flex-col">
                                    <button className="w-full px-4 py-3 flex items-center gap-3 active:bg-zinc-50 transition-colors text-left">
                                        <Share size={18} className="text-[#111111]" strokeWidth={2} />
                                        <span className="text-[14px] font-medium text-[#111111]">Share booking</span>
                                    </button>

                                    <div className="h-px bg-[#F1F1F1] w-full" />

                                    <button className="w-full px-4 py-3 flex items-center gap-3 active:bg-zinc-50 transition-colors text-left">
                                        <MessageCircle size={18} className="text-[#111111]" strokeWidth={2} />
                                        <span className="text-[14px] font-medium text-[#111111]">Contact Support</span>
                                    </button>

                                    <button className="w-full px-4 py-3 flex items-center gap-3 active:bg-zinc-50 transition-colors text-left">
                                        <HelpCircle size={18} className="text-[#111111]" strokeWidth={2} />
                                        <span className="text-[14px] font-medium text-[#111111]">Visit Help Center</span>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar pt-[120px] px-6 pb-32">
                
                {/* 1. STATUS BANNER */}
                <div className="mb-8 animate-scale-in">
                    <div className="bg-[#FFF5F0] border-l-[3px] border-l-[#FF6A3D] rounded-r-[16px] rounded-l-[4px] p-4 flex gap-4 items-center">
                        <div className="text-[#FF6A3D] flex-shrink-0">
                            <Clock size={24} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[12px] font-bold text-[#FF6A3D] uppercase tracking-wide">
                                Pending Acceptance
                            </span>
                            <span className="text-[14px] text-[#6E6E73] font-normal leading-tight">
                                {countdown.h}h {countdown.m}m remaining
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. BOOKING TIMELINE */}
                <div className="mb-8 animate-slide-up" style={{animationDelay: '0.05s'}}>
                    <h3 className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 ml-1">Booking Timeline</h3>
                    <div className="bg-[#F7F7F8] border border-[#EEEEEE] rounded-[16px] p-5">
                        <div className="flex flex-col gap-6 relative">
                            {/* Connecting Line (Orange part for completed) */}
                            <div className="absolute left-[5px] top-2.5 h-[36px] w-[1.5px] bg-[#FF6A3D] z-0"></div>
                            {/* Connecting Line (Grey part for future) */}
                            <div className="absolute left-[5px] top-[40px] bottom-3 w-[1.5px] bg-[#E5E5E5] z-0"></div>

                            {/* Step 1: Request Sent (Completed) */}
                            <div className="flex gap-4 relative z-10">
                                <div className="mt-1 w-3 h-3 rounded-full bg-[#FF6A3D] flex items-center justify-center flex-shrink-0 shadow-[0_0_0_4px_#F7F7F8]">
                                    <Check size={8} className="text-white" strokeWidth={4} />
                                </div>
                                <div className="flex flex-col -mt-1">
                                    <span className="text-[14px] font-medium text-[#8E8E93]">Request sent</span>
                                    <span className="text-[13px] text-[#8E8E93]">Mon, Feb 16 · 14:23</span>
                                </div>
                            </div>

                            {/* Step 2: Waiting (Current - Highlighted with Pulse) */}
                            <div className="flex gap-4 relative z-10">
                                <div className="mt-1 w-3 h-3 rounded-full bg-[#FF6A3D] flex-shrink-0 animate-orange-pulse" />
                                <div className="flex flex-col -mt-1">
                                    <span className="text-[14px] font-bold text-[#FF6A3D]">Waiting for walker</span>
                                    <span className="text-[13px] text-[#6E6E73]">Lukas has 24h to respond</span>
                                </div>
                            </div>

                            {/* Step 3: Walk Scheduled (Future) */}
                            <div className="flex gap-4 relative z-10">
                                <div className="mt-1 w-3 h-3 rounded-full bg-transparent border-[1.5px] border-[#C7C7CC] flex-shrink-0 shadow-[0_0_0_4px_#F7F7F8]" />
                                <div className="flex flex-col -mt-1">
                                    <span className="text-[14px] font-medium text-[#8E8E93]">Walk scheduled</span>
                                    <span className="text-[13px] text-[#8E8E93]">Mon, Feb 16 · 09:00</span>
                                </div>
                            </div>

                             {/* Step 4: Walk Completed (Future) */}
                            <div className="flex gap-4 relative z-10">
                                <div className="mt-1 w-3 h-3 rounded-full bg-transparent border-[1.5px] border-[#C7C7CC] flex-shrink-0 shadow-[0_0_0_4px_#F7F7F8]" />
                                <div className="flex flex-col -mt-1">
                                    <span className="text-[14px] font-medium text-[#8E8E93]">Walk completed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. WALKER CARD (Updated to match Request Screen) */}
                <div className="mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
                    <h3 className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 ml-1">Walker</h3>
                    <div className="bg-[#F7F7F8] border border-[#EEEEEE] rounded-[16px] p-5 flex flex-col gap-5">
                        {/* Profile Row */}
                        <div className="flex items-center gap-4">
                            <img 
                                src={WALKER_IMAGE} 
                                alt="Walker" 
                                className="w-10 h-10 rounded-full object-cover border border-white/50" 
                            />
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[14px] font-semibold text-[#111111]">Lukas F.</span>
                                    <div className="flex items-center gap-1">
                                        <Star size={12} className="fill-[#FF6A3D] text-[#FF6A3D]" />
                                        <span className="text-[13px] text-[#6E6E73]">4.9</span>
                                    </div>
                                </div>
                                <span className="text-[13px] text-[#8E8E93]">(124 reviews)</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <button onClick={onMessage} className="flex-1 h-[48px] rounded-[12px] bg-[#111111] text-white text-[14px] font-semibold active:scale-[0.98] transition-transform shadow-sm">
                                    Message Lukas
                                </button>
                                <button disabled className="flex-1 h-[48px] rounded-[12px] border border-[#E5E5E5] text-[#C7C7CC] text-[14px] font-semibold cursor-not-allowed">
                                    Call
                                </button>
                            </div>
                            <p className="text-[12px] text-[#8E8E93] text-center">
                                Response time: Usually under 1h
                            </p>
                        </div>
                    </div>
                </div>

                {/* 4. BOOKING DETAILS (Single Column) */}
                <div className="mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
                    <h3 className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 ml-1">Booking Details</h3>
                    <div className="bg-[#F7F7F8] border border-[#EEEEEE] rounded-[16px] p-4 flex flex-col gap-4">
                        
                        {/* Booking ID */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] text-[#6E6E73]">Booking ID</span>
                            <button 
                                onClick={handleCopyId}
                                className="flex items-center gap-2 active:opacity-60 transition-opacity w-fit"
                            >
                                <span className="text-[14px] font-medium text-[#111111]">#FY2024-00142</span>
                                {copied ? (
                                    <Check size={14} className="text-[#34C759]" strokeWidth={2.5} />
                                ) : (
                                    <Copy size={14} className="text-[#8E8E93]" strokeWidth={2} />
                                )}
                            </button>
                        </div>

                        <div className="h-px bg-[#EEEEEE] w-full" />

                        {/* Service */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] text-[#6E6E73]">Service</span>
                            <span className="text-[14px] font-medium text-[#111111]">90 min Walk</span>
                        </div>

                        <div className="h-px bg-[#EEEEEE] w-full" />

                        {/* Dog */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] text-[#6E6E73]">Dog</span>
                            <span className="text-[14px] font-medium text-[#111111]">Luna <span className="text-[#8E8E93] font-normal">(Golden Retriever, 3y)</span></span>
                        </div>

                        <div className="h-px bg-[#EEEEEE] w-full" />

                        {/* Date & Time */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] text-[#6E6E73]">Date & Time</span>
                            <span className="text-[15px] font-medium text-[#111111]">Monday, Feb 16, 2026 · 09:00–10:30</span>
                            <button 
                                onClick={handleAddToCalendar}
                                className="text-[13px] text-[#FF6A3D] font-medium mt-0.5 active:opacity-70 text-left w-fit flex items-center gap-1.5"
                            >
                                <CalendarIcon size={14} strokeWidth={2} />
                                Add to calendar
                            </button>
                        </div>

                        <div className="h-px bg-[#EEEEEE] w-full" />

                        {/* Pickup Location */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] text-[#6E6E73]">Pickup Location</span>
                            <span className="text-[14px] font-medium text-[#111111]">Bellevuestrasse 12, 8008 Zürich</span>
                            <button className="text-[13px] text-[#FF6A3D] font-medium mt-0.5 active:opacity-70 text-left w-fit">
                                View on map
                            </button>
                        </div>

                        <div className="h-px bg-[#EEEEEE] w-full" />

                        {/* Special Instructions */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] text-[#6E6E73]">Special Instructions</span>
                            <span className="text-[14px] text-[#111111] leading-relaxed">
                                Luna is nervous around bikes. Please avoid busy bike paths.
                            </span>
                        </div>

                        <div className="h-px bg-[#EEEEEE] w-full" />

                        {/* Created */}
                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] text-[#6E6E73]">Created</span>
                            <span className="text-[14px] text-[#111111]">Mon, Feb 16 · 14:23</span>
                        </div>

                    </div>
                </div>

                {/* 5. PAYMENT CARD */}
                <div className="mb-8 animate-slide-up" style={{animationDelay: '0.3s'}}>
                    <h3 className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 ml-1">Payment</h3>
                    <div className="bg-[#F7F7F8] border border-[#EEEEEE] rounded-[16px] p-4 flex flex-col gap-4">
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-[14px] text-[#111111]">
                                <span>90 min Walk</span>
                                <span className="font-medium">CHF 75.00</span>
                            </div>
                            <div className="flex justify-between text-[14px] text-[#6E6E73]">
                                <span>Service fee (10%)</span>
                                <span className="font-medium">CHF 7.50</span>
                            </div>
                            <div className="h-px bg-[#EEEEEE] w-full my-3"></div>
                            <div className="flex justify-between text-[15px] font-bold text-[#111111]">
                                <span>Total</span>
                                <span>CHF 82.50</span>
                            </div>
                        </div>

                        <div className="h-px bg-[#EEEEEE] w-full"></div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] text-[#6E6E73]">Payment method</span>
                            <div className="flex items-center gap-2">
                                <CreditCard size={15} className="text-[#111111]" />
                                <span className="text-[14px] font-medium text-[#111111]">Visa ••••1234</span>
                            </div>
                        </div>

                        <div className="h-px bg-[#EEEEEE] w-full"></div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[13px] text-[#6E6E73]">Payment status</span>
                            <div className="flex items-center gap-2">
                                <Clock size={14} className="text-[#FF6A3D]" strokeWidth={2} />
                                <span className="text-[14px] font-bold text-[#111111]">Authorized <span className="text-[#8E8E93] font-normal">— not charged yet</span></span>
                            </div>
                            <span className="text-[13px] text-[#8E8E93]">Will be charged when Lukas accepts.</span>
                        </div>

                    </div>
                </div>

                {/* 6. CANCELLATION POLICY */}
                <div className="mb-8 animate-slide-up" style={{animationDelay: '0.4s'}}>
                    <div className="bg-[#F7F7F8] border border-[#EEEEEE] rounded-[16px] overflow-hidden transition-all duration-300">
                        <button 
                            onClick={() => setIsPolicyExpanded(!isPolicyExpanded)}
                            className="w-full p-4 flex items-center justify-between active:bg-[#E5E5E5]/50 transition-colors"
                        >
                            <span className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider">Cancellation Policy</span>
                            <ChevronDown 
                                size={16} 
                                className={`text-[#8E8E93] transition-transform duration-300 ${isPolicyExpanded ? 'rotate-180' : ''}`} 
                            />
                        </button>
                        
                        {isPolicyExpanded && (
                            <div className="px-4 pb-4 animate-fade-in">
                                <div className="h-px bg-[#EEEEEE] w-full mb-4"></div>
                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[13px] font-medium text-[#111111]">Before walker accepts</span>
                                        <ul className="flex flex-col gap-1 pl-1">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-[#8E8E93] mt-2 flex-shrink-0" />
                                                <span className="text-[13px] text-[#6E6E73]">Free cancellation</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-[#8E8E93] mt-2 flex-shrink-0" />
                                                <span className="text-[13px] text-[#6E6E73]">Full refund</span>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[13px] font-medium text-[#111111]">After walker accepts</span>
                                        <ul className="flex flex-col gap-1 pl-1">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-[#8E8E93] mt-2 flex-shrink-0" />
                                                <span className="text-[13px] text-[#6E6E73]">Free cancellation up to 24h before walk</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-[#8E8E93] mt-2 flex-shrink-0" />
                                                <span className="text-[13px] text-[#6E6E73]">50% refund within 24h</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1 h-1 rounded-full bg-[#8E8E93] mt-2 flex-shrink-0" />
                                                <span className="text-[13px] text-[#6E6E73]">No refund for no-shows</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 7. NOTIFICATIONS (Interactive) */}
                <div className="mb-8 animate-slide-up" style={{animationDelay: '0.5s'}}>
                    <h3 className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-2 ml-1">Notifications</h3>
                    <div className="bg-[#F7F7F8] border border-[#EEEEEE] rounded-[16px] p-4 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[14px] text-[#111111]">SMS when walker responds</span>
                            <ToggleSwitch checked={notifications.sms} onToggle={() => toggleNotification('sms')} />
                        </div>
                        <div className="h-px bg-[#EEEEEE] w-full" />
                        <div className="flex justify-between items-center">
                            <span className="text-[14px] text-[#111111]">Reminder 1 day before walk</span>
                            <ToggleSwitch checked={notifications.reminder} onToggle={() => toggleNotification('reminder')} />
                        </div>
                        <div className="h-px bg-[#EEEEEE] w-full" />
                        <div className="flex justify-between items-center">
                            <span className="text-[14px] text-[#111111]">Updates during walk</span>
                            <ToggleSwitch checked={notifications.updates} onToggle={() => toggleNotification('updates')} />
                        </div>
                    </div>
                </div>

                {/* 8. ACTIONS */}
                <div className="flex flex-col gap-3 mt-4 mb-8">
                    <button onClick={onMessage} className="w-full h-[52px] rounded-[16px] bg-[#111111] text-white font-semibold text-[15px] active:scale-[0.98] transition-transform shadow-sm">
                        Message Lukas
                    </button>
                    
                    <button 
                        onClick={onHome}
                        className="w-full h-[52px] rounded-[16px] border border-[#EEEEEE] bg-white text-[#111111] font-semibold text-[15px] active:scale-[0.98] transition-transform hover:bg-zinc-50"
                    >
                        Browse other walkers
                    </button>

                    <button 
                        onClick={() => setShowCancelDialog(true)}
                        className="text-[#FF3B30] text-[14px] font-medium mt-2 py-2 hover:opacity-80 transition-opacity"
                    >
                        Cancel request
                    </button>
                </div>

            </div>

            {/* Toast Notification */}
            {showToast && <Toast message="Booking ID copied" />}

            {showCancelDialog && (
                <CancelRequestDialog 
                    onKeepWaiting={() => setShowCancelDialog(false)}
                    onCancelRequest={onHome}
                />
            )}
            
        </div>
    );
};

export { BookingDetailsScreen };

// ==========================================
// 5. APP ENTRY & ROUTING
// ==========================================
export default function App() {
  const [currentView, setCurrentView] = useState('details'); 

  return (
    <>
      <GlobalStyles />
      <div className="flex items-center justify-center min-h-screen bg-[#111] py-10 font-sans">
        <div className="relative w-[390px] h-[844px] rounded-[55px] shadow-[0_0_0_12px_#000000,0_0_0_14px_#333333] overflow-hidden bg-white">
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] bg-black rounded-[20px] z-[200] pointer-events-none"></div>
            <StatusBar lightMode={false} /> 
            <div className="w-full h-full relative flex flex-col">
                <BookingDetailsScreen 
                    onBack={() => {}} 
                    onHome={() => {}} 
                />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full z-[200] bg-black"></div>
        </div>
      </div>
    </>
  );
}