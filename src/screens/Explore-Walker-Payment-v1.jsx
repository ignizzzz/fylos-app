import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ChevronLeft, Signal, Wifi, Battery, Check, Clock, Plus, X, ChevronRight, 
  Dog as DogIcon, Calendar as CalendarIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
  CreditCard, ShieldCheck, FileText, AlertCircle, Star, Info, ChevronDown, CheckCircle
} from 'lucide-react';

// ==========================================
// 1. GLOBAL STYLES
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    :root {
      /* Updated Palette based on Swiss-clean specs */
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
    .checkbox-tick {
        transition: stroke-dashoffset 0.2s ease-in-out;
    }

    /* Animations */
    @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slideUpFade 0.3s var(--ease-spring) forwards; }
    
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

    /* Calendar Grid Animations */
    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 8px;
    }
  `}</style>
);

// ==========================================
// 2. DATA
// ==========================================

const SERVICES_DATA = [
    { id: '30min', name: '30 min Walk', price: 35 },
    { id: '60min', name: '60 min Walk', price: 55 },
    { id: '90min', name: '90 min Walk', price: 75 },
];

const MY_DOGS = [
    { id: 'd1', name: 'Luna', breed: 'Golden Retriever', age: '3y', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&q=80' },
    { id: 'd2', name: 'Max', breed: 'French Bulldog', age: '5y', image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150&q=80' }
];

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

const HeaderFadeScrim = () => (
    <div 
        className="absolute top-0 left-0 w-full z-[40] pointer-events-none"
        style={{ 
            height: '120px',
            background: 'linear-gradient(to bottom, #FFFFFF 40%, rgba(255,255,255,0) 100%)' 
        }}
    />
);

// --- CALENDAR MODAL COMPONENT ---
const CalendarModal = ({ isOpen, onClose, selectedDate, onSelectDate }) => {
    const [viewDate, setViewDate] = useState(selectedDate ? new Date(selectedDate) : new Date());

    useEffect(() => {
        if (isOpen && selectedDate) {
            setViewDate(new Date(selectedDate));
        } else if (isOpen) {
            setViewDate(new Date());
        }
    }, [isOpen, selectedDate]);

    if (!isOpen) return null;

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(viewDate);
    const monthName = viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setViewDate(newDate);
    };

    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    };

    const today = new Date();
    today.setHours(0,0,0,0);

    const renderDays = () => {
        const dayElements = [];
        for (let i = 0; i < firstDay; i++) {
            dayElements.push(<div key={`empty-${i}`} className="h-9 w-9" />);
        }
        
        for (let d = 1; d <= days; d++) {
            const currentDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
            const isSelected = selectedDate && isSameDay(new Date(selectedDate), currentDay);
            const isTodayDate = isSameDay(today, currentDay);
            const isPast = currentDay < today;

            dayElements.push(
                <div key={d} className="flex items-center justify-center">
                    <button
                        disabled={isPast}
                        onClick={() => {
                            onSelectDate(currentDay.toDateString());
                            onClose();
                        }}
                        className={`
                            h-9 w-9 rounded-full flex items-center justify-center text-[14px] font-medium transition-all border
                            ${isSelected 
                                ? 'bg-[#FFF5F0] border-[#FF6A3D] text-[#FF6A3D] shadow-sm' 
                                : isPast
                                    ? 'border-transparent text-zinc-300 cursor-not-allowed'
                                    : 'border-transparent text-zinc-900 hover:bg-zinc-100'
                            }
                            ${!isSelected && isTodayDate ? 'text-[#FF6A3D] font-bold' : ''}
                        `}
                    >
                        {d}
                    </button>
                </div>
            );
        }
        return dayElements;
    };

    return (
        <div className="absolute inset-0 z-[200] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300" onClick={onClose} />
            <div className="bg-white rounded-[24px] z-10 animate-scale-in shadow-2xl w-full max-w-[320px] overflow-hidden flex flex-col pb-6 relative">
                <div className="px-5 pt-6 pb-4 flex items-center justify-between">
                    <button onClick={handlePrevMonth} className="p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-[16px] font-bold text-zinc-900">{monthName}</span>
                    <button onClick={handleNextMonth} className="p-2 -mr-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors">
                        <ChevronRightIcon size={20} />
                    </button>
                </div>
                <div className="px-4">
                    <div className="grid grid-cols-7 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} className="flex items-center justify-center h-8">
                                <span className="text-[12px] font-medium text-zinc-400 uppercase tracking-wide">{d}</span>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-y-1">
                        {renderDays()}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- EXIT CONFIRM DIALOG ---
const ExitConfirmDialog = ({ onKeepBooking, onCancel }) => (
    <div className="absolute inset-0 z-[200] flex items-center justify-center px-8">
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] animate-fade-in" onClick={onKeepBooking} />
        <div className="bg-white w-full max-w-[300px] rounded-[24px] p-6 shadow-2xl animate-scale-in relative z-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                <AlertCircle size={24} strokeWidth={2} />
            </div>
            <h3 className="text-[18px] font-bold text-zinc-900 mb-2">Cancel booking?</h3>
            <p className="text-[13px] text-zinc-500 mb-6 leading-relaxed">
                You will lose your selected slot and walk details.
            </p>
            <div className="flex flex-col gap-3 w-full">
                <button 
                    onClick={onKeepBooking}
                    className="w-full h-11 rounded-full bg-zinc-900 text-white text-[14px] font-semibold active:scale-[0.98] transition-transform"
                >
                    Keep booking
                </button>
                <button 
                    onClick={onCancel}
                    className="w-full h-11 rounded-full bg-transparent text-zinc-500 text-[14px] font-medium active:scale-[0.98] transition-transform hover:bg-zinc-50"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

// ==========================================
// 4. SCREENS
// ==========================================

// --- REQUEST SENT SCREEN (UPDATED: CENTERED BLOCK) ---
const RequestSentScreen = ({ onHome, state }) => {
    return (
        <div className="w-full h-full bg-white flex flex-col relative animate-fade-in font-sans">
            {/* Header with Fade Scrim */}
            <HeaderFadeScrim />
            <div className="absolute top-0 left-0 w-full z-[50] bg-white border-b border-[#F1F1F1] pt-[54px] pb-3 px-6 pointer-events-auto">
                <div className="flex items-center justify-between">
                    <button onClick={onHome} className="w-9 h-9 flex items-center justify-center -ml-2 rounded-full bg-white active:opacity-60 text-[#111111]">
                        <ChevronLeft size={20} strokeWidth={2} />
                    </button>
                    
                    <span className="text-[17px] font-semibold text-[#111111] tracking-tight">
                        Booking Request
                    </span>
                    
                    {/* Empty placeholder for alignment */}
                    <div className="w-9" />
                </div>
            </div>

            {/* Body - Centered Status Block */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 pb-20 pt-20">
                {/* Icon */}
                <div className="mb-6 animate-scale-in">
                    <Clock size={56} className="text-[#FF6A3D]" strokeWidth={1.5} />
                </div>
                
                {/* Title */}
                <h2 className="text-[22px] font-bold text-[#111111] mb-3 text-center tracking-tight leading-tight">
                    Request sent to Lukas
                </h2>
                
                {/* Subtitle */}
                <p className="text-[16px] text-[#6E6E73] text-center leading-relaxed max-w-[280px]">
                    Lukas has up to 24 hours to respond.
                    You’ll be notified as soon as he does.
                </p>
            </div>

            {/* FLOATING DONE BUTTON */}
            <div className="absolute bottom-6 left-0 right-0 px-6 z-50">
                <div className="bg-white p-2 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                    <button 
                        onClick={onHome}
                        className="w-full h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-300 bg-[#111111] text-white active:scale-[0.98]"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- PAYMENT SCREEN ---
const PaymentScreen = ({ state, onBack, onExit, onSuccess }) => {
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [showFeeInfo, setShowFeeInfo] = useState(false);
    const [showCvcInfo, setShowCvcInfo] = useState(false);
    const [isCardExpanded, setIsCardExpanded] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTermsError, setShowTermsError] = useState(false);

    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: '',
        saveCard: false
    });
    
    const isApplePayAvailable = true;

    // Data
    const service = SERVICES_DATA.find(s => s.id === state.selectedService);
    const dog = MY_DOGS.find(d => d.id === state.selectedDog);
    
    const basePrice = service ? service.price : 0;
    const serviceFee = basePrice * 0.10;
    const total = basePrice + serviceFee;
    const formatCHF = (val) => `CHF ${val.toFixed(2)}`;
    
    const getTimeLabel = (id) => {
        const slots = { 't1': '09:00', 't2': '10:30', 't3': '14:00', 't4': '16:00' };
        return slots[id] || '';
    };

    const formattedDate = state.selectedDate 
        ? new Date(state.selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        : '';
    const formattedTime = getTimeLabel(state.selectedTime);

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === 'number') {
            const digits = value.replace(/\D/g, '').slice(0, 16);
            formattedValue = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
        } else if (name === 'expiry') {
            const digits = value.replace(/\D/g, '').slice(0, 4);
            formattedValue = digits.length >= 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits;
        } else if (name === 'cvc') {
            formattedValue = value.replace(/\D/g, '').slice(0, 4);
        }
        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    };

    // Validation
    const isCardValid = cardDetails.number.length >= 15 && cardDetails.expiry.length >= 4 && cardDetails.cvc.length >= 3 && cardDetails.name.length > 0;
    const isPaymentMethodValid = !isCardExpanded || isCardValid; 
    const isFormValid = termsAccepted && isPaymentMethodValid;

    const handlePay = () => {
        if (!termsAccepted) {
            setShowTermsError(true);
            return;
        }
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 2500);
    };

    return (
        <div className="w-full h-full bg-white flex flex-col relative animate-fade-in font-sans">
            
            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-[50] bg-white border-b border-[#F1F1F1] pt-[54px] pb-3 px-6 pointer-events-auto">
                <div className="flex items-center justify-between">
                    <button onClick={onBack} disabled={isProcessing} className="w-9 h-9 flex items-center justify-center -ml-2 rounded-full bg-white active:opacity-60 text-[#111111] disabled:opacity-50">
                        <ChevronLeft size={20} strokeWidth={2} />
                    </button>
                    
                    <span className="text-[17px] font-semibold text-[#111111] tracking-tight">
                        Payment
                    </span>
                    
                    <button onClick={() => setShowExitDialog(true)} disabled={isProcessing} className="w-9 h-9 flex items-center justify-center -mr-2 rounded-full bg-white active:opacity-60 text-[#111111] disabled:opacity-50">
                        <X size={20} strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="flex-1 bg-white overflow-y-auto no-scrollbar pt-[120px] px-6 pb-40 relative z-[10] flex flex-col gap-8">
                
                {/* 1. BOOKING SUMMARY CARD */}
                <div className="bg-[#F7F7F8] border border-[#EEEEEE] rounded-[16px] p-4 flex gap-4 items-start">
                    {/* Walker Photo */}
                    <img 
                        src={WALKER_IMAGE} 
                        alt="Walker" 
                        className="w-10 h-10 rounded-full object-cover border border-white/50 flex-shrink-0" 
                    />
                    
                    <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                            <span className="text-[15px] font-semibold text-[#111111]">Lukas F.</span>
                            <div className="flex items-center gap-1">
                                <Star size={14} className="fill-[#FF6A3D] text-[#FF6A3D]" />
                                <span className="text-[13px] text-[#6E6E73]">4.9</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 mt-0.5">
                            <span className="text-[15px] font-medium text-[#111111]">{service?.name}</span>
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2 text-[14px] text-[#6E6E73]">
                                    <DogIcon size={16} strokeWidth={1.5} className="text-[#8E8E93]" />
                                    <span>{dog?.name}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[14px] text-[#6E6E73]">
                                    <CalendarIcon size={16} strokeWidth={1.5} className="text-[#8E8E93]" />
                                    <span>{formattedDate} · {formattedTime}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. PRICE BREAKDOWN */}
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[15px] text-[#111111]">{service?.name}</span>
                        <span className="text-[15px] font-medium text-[#111111]">{formatCHF(basePrice)}</span>
                    </div>

                    <div className="flex justify-between items-center relative">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[14px] text-[#6E6E73]">Service fee (10%)</span>
                            <button 
                                onClick={() => setShowFeeInfo(!showFeeInfo)}
                                className="text-[#8E8E93] hover:text-[#6E6E73] transition-colors focus:outline-none"
                            >
                                <Info size={16} strokeWidth={1.5} />
                            </button>
                            {/* Popover */}
                            {showFeeInfo && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowFeeInfo(false)} />
                                    <div className="absolute left-0 bottom-6 w-[200px] bg-[#111111] text-white text-[12px] p-3 rounded-xl shadow-xl z-20 animate-scale-in leading-relaxed">
                                        Platform fee to maintain quality & insurance.
                                    </div>
                                </>
                            )}
                        </div>
                        <span className="text-[14px] font-medium text-[#6E6E73]">{formatCHF(serviceFee)}</span>
                    </div>

                    <div className="h-px bg-[#F0F0F0] w-full my-1"></div>

                    <div className="flex justify-between items-center">
                        <span className="text-[15px] font-bold text-[#111111]">Total</span>
                        <span className="text-[18px] font-bold text-[#111111]">{formatCHF(total)}</span>
                    </div>
                </div>

                {/* 3. PAYMENT METHOD */}
                <div>
                    <h3 className="text-[13px] font-medium text-[#6E6E73] uppercase tracking-wider mb-3 ml-1">Payment Method</h3>
                    
                    {isApplePayAvailable && (
                        <>
                            <button className="w-full h-12 bg-black rounded-[12px] text-white font-medium text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
                                <span className="font-semibold -tracking-tight">Pay with Apple Pay</span>
                            </button>
                            
                            <div className="flex items-center gap-3 my-4">
                                <div className="h-px bg-[#F0F0F0] flex-1"></div>
                                <span className="text-[12px] font-medium text-[#8E8E93]">OR</span>
                                <div className="h-px bg-[#F0F0F0] flex-1"></div>
                            </div>
                        </>
                    )}

                    {/* Card Section Container */}
                    <div className={`rounded-[16px] border bg-[#F7F7F8] border-[#EEEEEE] overflow-hidden transition-all duration-300`}>
                        <button 
                            onClick={() => setIsCardExpanded(!isCardExpanded)}
                            className="w-full flex items-center justify-between p-4 active:bg-[#F2F2F3] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-6 rounded bg-white border border-[#E5E5E7] flex items-center justify-center text-[#8E8E93]">
                                    <CreditCard size={14} strokeWidth={1.5} />
                                </div>
                                <span className="text-[14px] font-medium text-[#111111]">Pay with card</span>
                            </div>
                            <div className={`text-[#6E6E73] transition-transform duration-200 ${isCardExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown size={20} strokeWidth={1.5} />
                            </div>
                        </button>
                        
                        {/* Form Expanded */}
                        {(isCardExpanded || !isApplePayAvailable) && (
                            <div className="p-4 pt-0 border-t border-[#EEEEEE] animate-slide-up flex flex-col gap-4 mt-2">
                                {/* Card Number */}
                                <div className="space-y-1.5">
                                    <div className="relative">
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93]">
                                            <CreditCard size={18} strokeWidth={1.5} />
                                        </div>
                                        <input 
                                            type="text" 
                                            name="number"
                                            value={cardDetails.number}
                                            onChange={handleCardChange}
                                            placeholder="0000 0000 0000 0000"
                                            className="w-full h-11 pl-10 pr-4 rounded-[12px] border border-[#E5E5E7] bg-white text-[14px] text-[#111111] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#FF6A3D] focus:ring-1 focus:ring-[#FF6A3D] transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Row: Expiry & CVC */}
                                <div className="flex gap-3">
                                    <div className="flex-1 space-y-1.5">
                                        <input 
                                            type="text" 
                                            name="expiry"
                                            value={cardDetails.expiry}
                                            onChange={handleCardChange}
                                            placeholder="MM / YY"
                                            className="w-full h-11 px-4 rounded-[12px] border border-[#E5E5E7] bg-white text-[14px] text-[#111111] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#FF6A3D] focus:ring-1 focus:ring-[#FF6A3D] transition-all"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-1.5">
                                        <div className="relative">
                                            <input 
                                                type="password" 
                                                name="cvc"
                                                value={cardDetails.cvc}
                                                onChange={handleCardChange}
                                                placeholder="123"
                                                maxLength={4}
                                                className="w-full h-11 px-4 rounded-[12px] border border-[#E5E5E7] bg-white text-[14px] text-[#111111] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#FF6A3D] focus:ring-1 focus:ring-[#FF6A3D] transition-all"
                                            />
                                            {/* UPDATED: Info Icon */}
                                            <button 
                                                onClick={() => setShowCvcInfo(!showCvcInfo)}
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93] focus:outline-none"
                                            >
                                                <Info size={16} strokeWidth={1.5} />
                                            </button>
                                            
                                            {/* CVV Tooltip */}
                                            {showCvcInfo && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setShowCvcInfo(false)} />
                                                    <div className="absolute right-0 bottom-full mb-2 w-[180px] bg-[#111111] text-white text-[11px] p-2.5 rounded-xl shadow-xl z-20 animate-scale-in leading-relaxed text-center">
                                                        3-digit code on the back of your card.
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Cardholder Name */}
                                <div className="space-y-1.5">
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={cardDetails.name}
                                        onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                                        placeholder="Cardholder Name"
                                        className="w-full h-11 px-4 rounded-[12px] border border-[#E5E5E7] bg-white text-[14px] text-[#111111] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#FF6A3D] focus:ring-1 focus:ring-[#FF6A3D] transition-all"
                                    />
                                </div>

                                {/* Save Card Checkbox */}
                                <button 
                                    onClick={() => setCardDetails({...cardDetails, saveCard: !cardDetails.saveCard})}
                                    className="flex items-center gap-3 mt-1 active:opacity-70 transition-opacity"
                                >
                                    <div className={`w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center transition-colors ${cardDetails.saveCard ? 'bg-[#FF6A3D] border-[#FF6A3D]' : 'border-[#E5E5E7] bg-white'}`}>
                                        {cardDetails.saveCard && <Check size={12} className="text-white stroke-[3px]" />}
                                    </div>
                                    <span className="text-[13px] text-[#6E6E73]">Save card for future bookings</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Authorization Notice (Clean) */}
                <div className="bg-[#F2F2F3] rounded-[14px] p-[14px] flex gap-3 items-start">
                    <Info size={16} className="text-[#8E8E93] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <p className="text-[14px] text-[#6E6E73] leading-snug">
                        Authorization hold only — charged when walker accepts (max 24h).
                    </p>
                </div>

                {/* 5. Cancellation & Terms */}
                <div className="space-y-4 pt-1 pb-4">
                    <button className="text-[13px] text-[#8E8E93] w-full text-center hover:text-[#6E6E73] transition-colors underline-offset-2 hover:underline">
                        Free cancellation up to 24h before the walk.
                    </button>
                    
                    <div className={`flex items-start gap-3 p-3 -mx-3 rounded-xl transition-all duration-300 ${showTermsError ? 'bg-red-50 animate-shake' : 'bg-transparent'}`}>
                        <button 
                            onClick={() => { setTermsAccepted(!termsAccepted); setShowTermsError(false); }}
                            className={`mt-0.5 w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center flex-shrink-0 transition-colors ${termsAccepted ? 'bg-[#FF6A3D] border-[#FF6A3D]' : showTermsError ? 'border-red-400 bg-white' : 'border-[#C7C7CC] bg-white'}`}
                        >
                            {termsAccepted && <Check size={12} className="text-white stroke-[3px]" />}
                        </button>
                        <p className="text-[14px] text-[#111111] leading-snug">
                            I agree to FYLOS <span className="text-[#FF6A3D] cursor-pointer hover:underline">Terms & Conditions</span> and <span className="text-[#FF6A3D] cursor-pointer hover:underline">Privacy Policy</span>.
                        </p>
                    </div>
                </div>

            </div>

            {/* FLOATING CONFIRM BUTTON (Corrected) */}
            <div className="absolute bottom-6 left-0 right-0 px-6 z-50">
                <div className="bg-white p-2 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                    <button 
                        onClick={handlePay}
                        disabled={!isFormValid || isProcessing}
                        className={`
                            w-full h-[52px] rounded-[16px] font-semibold text-[16px] flex items-center justify-center gap-2 transition-all duration-300
                            ${(!isFormValid || isProcessing) 
                                ? 'bg-[#EAEAEA] text-[#9E9E9E] cursor-not-allowed' 
                                : 'bg-[#FF6A3D] text-white active:scale-[0.98]'
                            }
                        `}
                    >
                        {isProcessing ? (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin-slow" />
                                <span>Processing...</span>
                            </div>
                        ) : (
                            <span>Confirm & Pay · {formatCHF(total)}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Exit Dialog */}
            {showExitDialog && (
                <ExitConfirmDialog 
                    onKeepBooking={() => setShowExitDialog(false)}
                    onCancel={onExit}
                />
            )}
        </div>
    );
};

// --- BOOK WALK SCREEN ---
const BookWalkScreen = ({ 
    state, 
    setState, 
    onConfirm,
    onBack 
}) => {
    // Unpack state from props
    const { selectedService, selectedDog, selectedDate, selectedTime, note } = state;
    
    // Setters helper
    const updateState = (key, value) => {
        setState(prev => ({ ...prev, [key]: value }));
    };

    // Derived states logic (moved from local to using props)
    const [horizontalStartDate, setHorizontalStartDate] = useState(new Date()); 
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const noteRef = useRef(null);
    const [shake, setShake] = useState(false);
    const [highlightedSection, setHighlightedSection] = useState(null);

    // Refs for scrolling
    const serviceRef = useRef(null);
    const dateRef = useRef(null);
    const timeRef = useRef(null);

    const handleNoteChange = (e) => {
        const val = e.target.value;
        if (val.length <= 200) {
            updateState('note', val);
            if (noteRef.current) {
                noteRef.current.style.height = 'auto';
                noteRef.current.style.height = noteRef.current.scrollHeight + 'px';
            }
        }
    };

    // Dates Logic
    const dates = useMemo(() => {
        const arr = [];
        const start = new Date(horizontalStartDate);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (start < today) start.setTime(today.getTime());

        for (let i = 0; i < 14; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            arr.push(d);
        }
        return arr;
    }, [horizontalStartDate]);

    const currentMonthLabel = useMemo(() => {
        const d = dates[0];
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }, [dates]);

    const getWeekday = (date) => date.toLocaleDateString('en-US', { weekday: 'short' });
    const getDay = (date) => date.getDate();
    const getMonthShort = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
    }

    const currentSlots = useMemo(() => {
        if (!selectedDate) return [];
        const date = new Date(selectedDate);
        const thirdDate = new Date();
        thirdDate.setDate(new Date().getDate() + 2);
        
        if (date.toDateString() === thirdDate.toDateString()) return [];

        return [
            { id: 't1', label: '09:00', available: true },
            { id: 't2', label: '10:30', available: true },
            { id: 't3', label: '14:00', available: true },
            { id: 't4', label: '16:00', available: true },
        ];
    }, [selectedDate]);

    const getTimeLabel = (id) => {
        const slot = currentSlots.find(s => s.id === id);
        return slot ? slot.label : '';
    };

    const getServiceDetails = (id) => SERVICES_DATA.find(s => s.id === id);
    const getDogDetails = (id) => MY_DOGS.find(d => d.id === id);

    const isReady = selectedService && selectedDog && selectedDate && selectedTime;

    const summaryTextLine1 = useMemo(() => {
        const service = getServiceDetails(selectedService);
        if (service) return service.name;
        return "Select a service";
    }, [selectedService]);

    const summaryTextLine2 = useMemo(() => {
        if (selectedDate && selectedTime) {
            const dateStr = getMonthShort(selectedDate);
            const timeStr = getTimeLabel(selectedTime);
            return `${getWeekday(new Date(selectedDate))}, ${dateStr} · ${timeStr}`;
        }
        if (selectedDate) return `${getWeekday(new Date(selectedDate))}, ${getMonthShort(selectedDate)}`;
        return "Select date & time";
    }, [selectedDate, selectedTime]);

    const totalPrice = useMemo(() => {
        const service = getServiceDetails(selectedService);
        return service ? `CHF ${service.price}` : '';
    }, [selectedService]);

    const handleDateSelect = (dateStr) => {
        updateState('selectedDate', dateStr);
        updateState('selectedTime', null);
    };
    
    const handleCalendarSelect = (dateStr) => {
        handleDateSelect(dateStr);
        const newStart = new Date(dateStr);
        const today = new Date();
        today.setHours(0,0,0,0);
        newStart.setDate(newStart.getDate() - 1);
        if (newStart < today) {
            setHorizontalStartDate(today);
        } else {
            setHorizontalStartDate(newStart);
        }
    };

    const handleBookingAttempt = () => {
        if (isReady) {
            onConfirm(); // Navigate to payment
        } else {
            let missing = null;
            if (!selectedService) missing = 'service';
            else if (!selectedDate) missing = 'date';
            else if (!selectedTime) missing = 'time';
            
            if (missing) {
                setShake(true);
                setHighlightedSection(missing);
                setTimeout(() => setShake(false), 500);
                setTimeout(() => setHighlightedSection(null), 1500);
                
                const refMap = { service: serviceRef, date: dateRef, time: timeRef };
                refMap[missing].current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    };

    const selectedDogObj = getDogDetails(selectedDog);
    const notePlaceholder = selectedDogObj 
        ? `e.g., ${selectedDogObj.name} is nervous around bikes...`
        : "e.g., Luna is nervous around bikes...";

    return (
        <div className="w-full h-full bg-white flex flex-col relative animate-fade-in font-sans">
            <HeaderFadeScrim />
            <div className="absolute top-0 left-0 w-full z-[50] bg-transparent pt-[54px] pb-3 px-6 pointer-events-none">
                <div className="flex items-center justify-between">
                    <button onClick={onBack} className="w-9 h-9 flex items-center justify-center -ml-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm active-press text-zinc-900 pointer-events-auto border border-zinc-100">
                        <ChevronLeft size={22} strokeWidth={2} />
                    </button>
                    
                    <div className="flex flex-col items-center pointer-events-auto opacity-0 animate-fade-in" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
                        <span className="text-[15px] font-bold text-zinc-900 leading-none">Book with Lukas F.</span>
                        {selectedDogObj && (
                            <div className="mt-1 flex items-center gap-1.5 bg-[#F5F5F5] rounded-full pl-1 pr-3 py-1">
                                <img src={selectedDogObj.image} className="w-5 h-5 rounded-full object-cover" alt={selectedDogObj.name} />
                                <span className="text-[11px] font-medium text-zinc-600">{selectedDogObj.name}</span>
                            </div>
                        )}
                    </div>
                    
                    <button onClick={onBack} className="w-9 h-9 flex items-center justify-center -mr-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm active-press text-zinc-900 pointer-events-auto border border-zinc-100">
                        <X size={18} strokeWidth={2} />
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white overflow-y-auto no-scrollbar pt-[120px] px-6 pb-32 relative z-[10]">
                {/* 1. SERVICE */}
                <div className="mb-6" ref={serviceRef}>
                    <div className="mb-5">
                        <div className={`w-6 h-[2px] bg-[#FF6A3D] mb-3 rounded-full transition-opacity duration-300 ${highlightedSection === 'service' ? 'opacity-100' : 'opacity-100'}`} />
                        <h3 className={`text-[13px] font-semibold text-zinc-500 uppercase tracking-widest transition-colors duration-300 ${highlightedSection === 'service' ? 'text-[#FF6A3D]' : ''}`}>Select service</h3>
                    </div>
                    <div className="flex flex-col gap-3">
                        {SERVICES_DATA.map((service) => {
                            const isSelected = selectedService === service.id;
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => updateState('selectedService', service.id)}
                                    className={`
                                        w-full p-4 rounded-xl border text-left flex items-center justify-between
                                        transition-all duration-200 ease-[cubic-bezier(0.19,1,0.22,1)]
                                        active:scale-[0.98]
                                        ${isSelected 
                                            ? 'border-[#FF6A3D] bg-white shadow-[0_0_0_1px_#FF6A3D] z-10' 
                                            : 'border-zinc-100 bg-white shadow-sm hover:border-zinc-200'
                                        }
                                    `}
                                >
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-[15px] font-semibold text-zinc-900">{service.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[15px] font-medium text-zinc-900">CHF {service.price}</span>
                                        {isSelected && (
                                            <div className="w-5 h-5 rounded-full bg-[#FF6A3D] flex items-center justify-center animate-scale-in">
                                                <Check size={12} className="text-white stroke-[3px]" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="h-px bg-zinc-50 w-full mb-6" />

                {/* 3. DATE */}
                <div className="mb-6" ref={dateRef}>
                    <div className="mb-5">
                        <div className={`w-6 h-[2px] bg-[#FF6A3D] mb-3 rounded-full`} />
                        <div className="flex items-end justify-between">
                            <h3 className={`text-[13px] font-semibold text-zinc-500 uppercase tracking-widest transition-colors duration-300 ${highlightedSection === 'date' ? 'text-[#FF6A3D]' : ''}`}>Select date</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[13px] font-medium text-zinc-400">{currentMonthLabel}</span>
                                <button onClick={() => setIsCalendarOpen(true)} className="w-7 h-7 flex items-center justify-center rounded-full bg-zinc-50 text-zinc-500 hover:bg-zinc-100 active:scale-95 transition-all">
                                    <CalendarIcon size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
                        {dates.map((date, index) => {
                            const isSelected = selectedDate === date.toDateString();
                            const today = isToday(date);
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDateSelect(date.toDateString())}
                                    className={`
                                        min-w-[64px] h-[80px] rounded-xl border flex flex-col items-center justify-center gap-1
                                        transition-all duration-200 ease-[cubic-bezier(0.19,1,0.22,1)]
                                        active:scale-[0.95]
                                        ${isSelected 
                                            ? 'border-[#FF6A3D] bg-[#FFF5F0] shadow-[0_0_0_1px_#FF6A3D]' 
                                            : 'border-zinc-100 bg-white shadow-sm'
                                        }
                                    `}
                                >
                                    <span className={`text-[11px] font-medium uppercase ${isSelected ? 'text-[#FF6A3D]' : 'text-zinc-400'}`}>
                                        {getWeekday(date)}
                                    </span>
                                    <span className={`text-[18px] font-bold ${isSelected ? 'text-[#FF6A3D]' : 'text-zinc-900'}`}>
                                        {getDay(date)}
                                    </span>
                                    {today && (
                                        <div className="w-1 h-1 rounded-full bg-[#FF6A3D] mt-1"></div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* 4. TIME */}
                {selectedDate && (
                    <div className="mb-6 animate-fade-in" ref={timeRef}>
                        <div className="mb-5">
                            <div className={`w-6 h-[2px] bg-[#FF6A3D] mb-3 rounded-full`} />
                            <h3 className={`text-[13px] font-semibold text-zinc-500 uppercase tracking-widest transition-colors duration-300 ${highlightedSection === 'time' ? 'text-[#FF6A3D]' : ''}`}>Select time</h3>
                        </div>
                        {currentSlots.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {currentSlots.map((slot) => {
                                    const isSelected = selectedTime === slot.id;
                                    const isUnavailable = !slot.available;
                                    return (
                                        <button
                                            key={slot.id}
                                            disabled={isUnavailable}
                                            onClick={() => updateState('selectedTime', slot.id)}
                                            className={`
                                                relative h-[50px] rounded-xl border flex items-center justify-center
                                                transition-all duration-200 ease-[cubic-bezier(0.19,1,0.22,1)]
                                                ${isUnavailable 
                                                    ? 'bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed' 
                                                    : isSelected
                                                        ? 'border-[#FF6A3D] bg-[#FFF5F0] shadow-[0_0_0_1px_#FF6A3D] text-[#FF6A3D] active:scale-[0.98]'
                                                        : 'border-zinc-100 bg-white shadow-sm text-zinc-900 active:scale-[0.98]'
                                                }
                                            `}
                                        >
                                            <span className="text-[14px] font-medium">{slot.label}</span>
                                            {isSelected && (
                                                <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#FF6A3D] flex items-center justify-center animate-scale-in">
                                                    <Check size={8} className="text-white stroke-[3px]" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 text-center flex items-center justify-center gap-2">
                                <Clock size={16} className="text-zinc-400" />
                                <span className="text-[13px] text-zinc-500 font-medium">No slots available — try another date.</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="h-px bg-zinc-50 w-full mb-6" />

                {/* 5. NOTE */}
                {selectedDate && (
                    <div className="mb-32 animate-fade-in">
                        <div className="mb-5">
                            <div className={`w-6 h-[2px] bg-[#FF6A3D] mb-3 rounded-full`} />
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-[13px] font-semibold text-zinc-500 uppercase tracking-widest">Add a note</h3>
                                <span className="text-[11px] text-zinc-400 font-medium">{note.length}/200</span>
                            </div>
                        </div>
                        <textarea
                            ref={noteRef}
                            value={note}
                            onChange={handleNoteChange}
                            placeholder={notePlaceholder}
                            className="w-full p-4 rounded-xl border border-zinc-200 bg-white text-[15px] text-zinc-900 placeholder:text-zinc-400 focus:border-[#FF6A3D] focus:outline-none focus:ring-1 focus:ring-[#FF6A3D] transition-all resize-none overflow-hidden shadow-sm"
                            rows={1}
                            style={{ minHeight: '52px' }}
                        />
                    </div>
                )}
            </div>

            {/* STICKY SUMMARY */}
            <div className="absolute bottom-6 left-4 right-4 z-50 flex flex-col items-center gap-3">
                <p className="text-[13px] text-zinc-500 text-center">Free cancellation up to 24h before the walk.</p>
                <div 
                    className={`
                        w-full rounded-full bg-white/90 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2 pl-6 flex items-center justify-between
                        transition-transform duration-100 ease-in-out
                        ${shake ? 'animate-shake' : ''}
                    `}
                >
                    <div className="flex flex-col justify-center py-1">
                        <span className={`text-[13px] font-semibold leading-tight transition-colors duration-300 ${(!selectedService && !selectedDog) ? 'text-zinc-400' : 'text-zinc-900'}`}>
                            {summaryTextLine1}
                        </span>
                        <span className={`text-[11px] font-medium leading-tight transition-colors duration-300 ${(!selectedDate && !selectedTime) ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            {summaryTextLine2}
                        </span>
                    </div>

                    <button
                        onClick={handleBookingAttempt}
                        disabled={!isReady}
                        className={`
                            h-10 px-5 rounded-full text-[13px] font-bold transition-all duration-300 flex items-center gap-2
                            ${isReady 
                                ? 'bg-[#FF6A3D] text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]' 
                                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            }
                        `}
                    >
                        {isReady ? (
                            <>
                                <span>Confirm</span>
                                {totalPrice && <span className="opacity-90 font-normal pl-1 ml-1">· {totalPrice}</span>}
                            </>
                        ) : 'Complete selections'}
                    </button>
                </div>
            </div>

            <CalendarModal 
                isOpen={isCalendarOpen} 
                onClose={() => setIsCalendarOpen(false)}
                selectedDate={selectedDate}
                onSelectDate={handleCalendarSelect}
            />
        </div>
    );
};

// Export for use in Explore Home flow
import { BookingDetailsScreen } from './Explore-Walker-booking-details';
import { WalkerChatView } from './Explore-walker-chat.v1';

export function WalkerBookingFlow({ onClose }) {
    const [currentView, setCurrentView] = useState('booking');
    const [bookingState, setBookingState] = useState({
        selectedService: null,
        selectedDog: MY_DOGS[0].id,
        selectedDate: null,
        selectedTime: null,
        note: ''
    });

    return (
        <div className="absolute inset-0 z-[60] bg-white">
            {currentView === 'booking' && (
                <BookWalkScreen 
                    state={bookingState} 
                    setState={setBookingState} 
                    onConfirm={() => setCurrentView('payment')} 
                    onBack={onClose}
                />
            )}
            {currentView === 'payment' && (
                <PaymentScreen 
                    state={bookingState}
                    onBack={() => setCurrentView('booking')} 
                    onExit={onClose}
                    onSuccess={() => setCurrentView('success')}
                />
            )}
            {currentView === 'success' && (
                <RequestSentScreen 
                    state={bookingState}
                    onHome={() => setCurrentView('details')}
                />
            )}
            {currentView === 'details' && (
                <BookingDetailsScreen 
                    onBack={() => setCurrentView('success')}
                    onHome={onClose}
                    onMessage={() => setCurrentView('chat')}
                />
            )}
            {currentView === 'chat' && (
                <WalkerChatView 
                    onBack={() => setCurrentView('details')}
                    onViewBooking={() => setCurrentView('details')}
                />
            )}
        </div>
    );
}

// ==========================================
// 5. APP ENTRY & ROUTING
// ==========================================
export default function App() {
  const [currentView, setCurrentView] = useState('booking'); // 'booking' | 'payment' | 'success'
  const [bookingState, setBookingState] = useState({
      selectedService: null,
      selectedDog: MY_DOGS[0].id,
      selectedDate: null,
      selectedTime: null,
      note: ''
  });

  const handleBookingConfirm = () => {
      setCurrentView('payment');
  };

  const handlePaymentBack = () => {
      setCurrentView('booking');
  };

  const handlePaymentSuccess = () => {
      setCurrentView('success');
  };

  const handleExitFlow = () => {
      // Reset state and view (simulating exit)
      setBookingState({
          selectedService: null,
          selectedDog: MY_DOGS[0].id,
          selectedDate: null,
          selectedTime: null,
          note: ''
      });
      setCurrentView('booking');
  };

  return (
    <>
      <GlobalStyles />
      <div className="flex items-center justify-center min-h-screen bg-[#111] py-10 font-sans">
        <div className="relative w-[390px] h-[844px] rounded-[55px] shadow-[0_0_0_12px_#000000,0_0_0_14px_#333333] overflow-hidden bg-white">
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] bg-black rounded-[20px] z-[200] pointer-events-none"></div>
            
            {/* Dark mode Status Bar */}
            <StatusBar lightMode={false} /> 
            
            <div className="w-full h-full relative flex flex-col">
                {currentView === 'booking' && (
                    <BookWalkScreen 
                        state={bookingState} 
                        setState={setBookingState} 
                        onConfirm={handleBookingConfirm} 
                    />
                )}
                {currentView === 'payment' && (
                    <PaymentScreen 
                        state={bookingState} // PASSING STATE HERE
                        onBack={handlePaymentBack} 
                        onExit={handleExitFlow}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
                {currentView === 'success' && (
                    <RequestSentScreen 
                        state={bookingState} // Needed for summary
                        onHome={handleExitFlow} 
                    />
                )}
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full z-[200] bg-black"></div>
        </div>
      </div>
    </>
  );
}