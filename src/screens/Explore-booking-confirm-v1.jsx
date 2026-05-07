import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar, ChevronLeft, ChevronRight, Check, X, Clock, Bell,
  Info, Heart, MapPin, ChevronDown, Share, Copy, MessageCircle, Phone,
} from 'lucide-react';
import { T, SHADOWS, RADIUS } from '../styles/theme';
import { IconBtn, PrimaryBtn } from '../components/ui';

// --- LOCAL STYLES (animations only) ---
const LocalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes subtleCheckScale { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
    @keyframes cardLift { 0% { transform: translateY(8px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
    @keyframes subtleSlideUp { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes smoothFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes popClick { 0% { transform: scale(1); } 40% { transform: scale(0.96); } 100% { transform: scale(1.02); } }
    @keyframes slideUpSm { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-slide-in-right { animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-subtle-check { animation: subtleCheckScale 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-breathe { animation: breathe 3s ease-in-out infinite; }
    .animate-card-lift { animation: cardLift 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-subtle-slide { animation: subtleSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-smooth-fade { animation: smoothFadeIn 0.8s ease-out forwards; }
    .animate-pop-click { animation: popClick 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-slide-up-sm { animation: slideUpSm 0.4s ease-out forwards; }
    .animate-scale-in { animation: subtleCheckScale 0.2s ease-out forwards; }
    .active-press:active { transform: scale(0.97); transition: transform 0.1s; }
  `}</style>
);

// --- DATA MOCKS ---
const PROVIDER_DATA = {
  id: 1,
  name: 'Zürich Paws Grooming',
  price: 85,
  currency: 'CHF ',
  image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80',
  location: 'Seefeld, Zürich',
  fullAddress: 'Seefeldstrasse 123, 8008 Zürich',
  distance: '12 min drive',
  phone: '+41790000000',
};

// --- Status bar / device chrome ---
const StatusBar = () => (
  <div className="absolute top-0 left-0 w-full h-[54px] flex justify-between items-end px-7 pb-3 z-[60] text-[13px] font-semibold" style={{ color: T.txt }}>
    <span>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={T.txt}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={T.txt}/><rect x="9" y="2" width="3" height="10" rx="1" fill={T.txt}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={T.txt}/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={T.txt}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={T.txt} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={T.txt} strokeWidth="1.5" strokeLinecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={T.txt} strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill={T.txt}/></svg>
    </div>
  </div>
);

const Toast = ({ message }) => (
  <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[90] px-4 py-2.5 flex items-center gap-2.5 animate-fade-in whitespace-nowrap" style={{ backgroundColor: T.txt, color: '#fff', borderRadius: 9999, boxShadow: SHADOWS.floating }}>
    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: T.coral }}>
      <Check size={12} className="text-white" strokeWidth={3} />
    </div>
    <span className="text-[12px] font-semibold">{message}</span>
  </div>
);

// --- CONFIRMATION SCREEN ---
const ConfirmationScreen = ({
  status = 'confirmed',
  providerName,
  serviceName,
  selectedDate,
  currentStripMonth,
  selectedSlot,
  address,
  phone,
  petName,
  petImage,
  onDone,
  showToast,
}) => {
  const STATUS_CONFIG = {
    confirmed: {
      icon: <Check size={22} className="text-white" strokeWidth={4} />,
      iconBg: T.coral,
      glowBg: T.successBg,
      title: 'All set!',
      desc: <>Your <span className="font-bold" style={{ color: T.txt }}>{serviceName}</span> appointment is confirmed.</>,
      primaryAction: 'Done',
      showUtils: true,
      showWallet: true,
    },
    requested: {
      icon: <Clock size={22} className="text-white" strokeWidth={4} />,
      iconBg: '#3B82F6',
      glowBg: '#EFF6FF',
      title: 'Request Sent',
      desc: <>We sent your request for <span className="font-bold" style={{ color: T.txt }}>{serviceName}</span>. Waiting for {providerName} to confirm.</>,
      primaryAction: 'Got it',
      showUtils: true,
      showWallet: false,
    },
    rejected: {
      icon: <X size={22} className="text-white" strokeWidth={4} />,
      iconBg: T.danger,
      glowBg: T.dangerBg,
      title: 'Slot Unavailable',
      desc: <>Unfortunately, this slot for <span className="font-bold" style={{ color: T.txt }}>{serviceName}</span> is no longer available.</>,
      primaryAction: 'Find another time',
      showUtils: false,
      showWallet: false,
    },
  };

  const currentStatus = STATUS_CONFIG[status] || STATUS_CONFIG.confirmed;

  const handleShare = async () => {
    const text = `${petName} has an appointment at ${providerName} on ${selectedDate} ${currentStripMonth} at ${selectedSlot}.`;
    if (navigator.share) {
      try { await navigator.share({ title: 'Appointment Details', text }); } catch {}
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Copied to clipboard');
    }
  };

  const handleDirections = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank');
  };

  const handleCopyAddress = () => {
    const ta = document.createElement('textarea');
    ta.value = address;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Address copied');
  };

  return (
    <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center animate-fade-in p-5" style={{ backgroundColor: T.bg }}>
      <div
        className="w-full max-w-[300px] p-5 flex flex-col items-center text-center relative overflow-hidden"
        style={{
          backgroundColor: T.card,
          borderRadius: 28,
          border: `1px solid ${T.border}`,
          boxShadow: '0 20px 50px -10px rgba(0,0,0,0.12)',
        }}
      >
        {status !== 'rejected' && (
          <button
            onClick={handleShare}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full transition-colors z-20 animate-smooth-fade"
            style={{ animationDelay: '0.8s', backgroundColor: T.bg, color: T.muted }}
          >
            <Share size={13} strokeWidth={2.4} />
          </button>
        )}

        {/* Status icon */}
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4 opacity-0 animate-subtle-check"
          style={{
            backgroundColor: currentStatus.glowBg,
            border: `3px solid ${T.bg}`,
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center animate-breathe"
            style={{ backgroundColor: currentStatus.iconBg, boxShadow: '0 8px 20px rgba(232,93,42,0.3)' }}
          >
            {currentStatus.icon}
          </div>
        </div>

        {/* Title + desc */}
        <div className="opacity-0 animate-subtle-slide" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-[19px] font-bold mb-1.5 tracking-tight" style={{ color: T.txt }}>{currentStatus.title}</h2>
          <p className="text-[11.5px] font-medium mb-4 leading-relaxed px-1" style={{ color: T.mutedDark }}>
            {currentStatus.desc}
          </p>
        </div>

        {/* Details card */}
        <div className="w-full p-1 opacity-0 animate-card-lift" style={{ animationDelay: '0.4s', backgroundColor: T.bg, borderRadius: 18 }}>
          <div className="p-3 rounded-[16px]" style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, boxShadow: SHADOWS.card }}>
            <div className="flex items-center gap-2.5 mb-3 pb-3" style={{ borderBottom: `1px dashed ${T.divider}` }}>
              <span className="text-[9px] font-bold uppercase tracking-wider min-w-[20px]" style={{ color: T.muted }}>FOR</span>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full overflow-hidden" style={{ backgroundColor: T.tint, border: `1px solid ${T.card}`, boxShadow: SHADOWS.card }}>
                  <img src={petImage} alt={petName} className="w-full h-full object-cover" />
                </div>
                <span className="text-[13px] font-bold" style={{ color: T.txt }}>{petName}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: T.muted }}>
                <Calendar size={10} /> DATE
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: T.muted }}>
                <Clock size={10} /> TIME
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[13px] font-bold tracking-tight" style={{ color: status === 'rejected' ? T.muted : T.txt, textDecoration: status === 'rejected' ? 'line-through' : 'none' }}>
                {selectedDate} {currentStripMonth}
              </span>
              <span className="text-[13px] font-bold tracking-tight" style={{ color: status === 'rejected' ? T.muted : T.txt, textDecoration: status === 'rejected' ? 'line-through' : 'none' }}>
                {selectedSlot}
              </span>
            </div>
          </div>
        </div>

        {currentStatus.showUtils && (
          <>
            <div className="mt-3 mb-2 flex flex-col items-center gap-1.5 opacity-0 animate-subtle-slide" style={{ animationDelay: '0.45s' }}>
              <div className="flex items-center gap-3">
                <button className="text-[10px] font-bold flex items-center gap-1 active:opacity-70 transition-opacity p-1" style={{ color: T.coral }}>
                  <Calendar size={11} strokeWidth={2.4} />
                  Add to calendar
                </button>
                <div className="w-px h-2.5" style={{ backgroundColor: T.divider }} />
                <button onClick={handleDirections} className="text-[10px] font-bold flex items-center gap-1 active:opacity-70 transition-opacity p-1" style={{ color: T.coral }}>
                  <MapPin size={11} strokeWidth={2.4} />
                  Directions
                </button>
              </div>

              <button
                onClick={handleCopyAddress}
                className="text-[9px] font-medium flex items-center gap-1 px-2.5 py-1 rounded-full max-w-full transition-colors"
                style={{ color: T.muted, backgroundColor: T.bg }}
              >
                <span className="truncate max-w-[180px]">{address}</span>
                <Copy size={9} strokeWidth={2.4} className="opacity-50 shrink-0"/>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4 opacity-0 animate-subtle-slide" style={{ animationDelay: '0.5s' }}>
              <a href={`sms:${phone}`} className="flex items-center justify-center gap-1.5 w-[85px] py-2 rounded-[14px] text-[10px] font-bold transition-all active:scale-95" style={{ backgroundColor: T.bg, color: T.txt }}>
                <MessageCircle size={12} style={{ color: T.muted }}/>
                Message
              </a>
              <a href={`tel:${phone}`} className="flex items-center justify-center gap-1.5 w-[85px] py-2 rounded-[14px] text-[10px] font-bold transition-all active:scale-95" style={{ backgroundColor: T.bg, color: T.txt }}>
                <Phone size={12} style={{ color: T.muted }}/>
                Call
              </a>
            </div>

            <p className="text-[9px] font-medium mb-5 text-center leading-relaxed max-w-[220px] opacity-0 animate-subtle-slide" style={{ animationDelay: '0.6s', color: T.muted }}>
              {status === 'requested'
                ? "We'll notify you as soon as the provider confirms."
                : "We'll send a friendly reminder before the visit."}
            </p>
          </>
        )}

        {status === 'rejected' && <div className="h-8" />}

        <div className="w-full opacity-0 animate-smooth-fade" style={{ animationDelay: '0.7s' }}>
          <PrimaryBtn onClick={onDone}>{currentStatus.primaryAction}</PrimaryBtn>

          {currentStatus.showWallet && (
            <div className="flex justify-center mt-3">
              <button className="text-[10px] font-semibold transition-colors" style={{ color: T.muted }}>
                Add to Apple Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- BOOKING FLOW ---
const BookingFlow = ({ provider, showToast }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [petName] = useState('Baxter');
  const [petImage] = useState('https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=100');
  const [bookingStatus, setBookingStatus] = useState('confirmed');
  const [addToCalendar, setAddToCalendar] = useState(true);
  const [note, setNote] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const scrollRef = useRef(null);

  const [viewDate, setViewDate] = useState(new Date());
  const [calendarViewDate, setCalendarViewDate] = useState(new Date());
  const [dates, setDates] = useState([]);
  const [monthDates, setMonthDates] = useState([]);

  const serviceName = 'Bath & Tidy';
  const serviceDuration = '1h';
  const servicePrice = 'CHF 85';

  useEffect(() => {
    const nextDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(viewDate);
      d.setDate(viewDate.getDate() + i);
      return {
        fullDate: d,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthName: d.toLocaleDateString('en-US', { month: 'long' }),
        busy: (d.getDate() % 6 === 0) ? 'full' : (d.getDate() % 3 === 0) ? 'med' : 'low',
      };
    });
    setDates(nextDays);
  }, [viewDate]);

  useEffect(() => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const fullMonth = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const status = (dayNum % 6 === 0) ? 'full' : (dayNum % 3 === 0) ? 'med' : 'low';
      return { dayNum, busy: status, offset: i === 0 ? startOffset : 0 };
    });
    setMonthDates(fullMonth);
  }, [calendarViewDate]);

  useEffect(() => {
    const el = scrollRef.current;
    const handleScroll = () => { if (el) setIsScrolled(el.scrollTop > 100); };
    if (el) el.addEventListener('scroll', handleScroll);
    return () => { if (el) el.removeEventListener('scroll', handleScroll); };
  }, []);

  const handlePrevWeek = () => { const d = new Date(viewDate); d.setDate(viewDate.getDate() - 7); setViewDate(d); };
  const handleNextWeek = () => { const d = new Date(viewDate); d.setDate(viewDate.getDate() + 7); setViewDate(d); };
  const handlePrevMonth = () => { const d = new Date(calendarViewDate); d.setMonth(calendarViewDate.getMonth() - 1); setCalendarViewDate(d); };
  const handleNextMonth = () => { const d = new Date(calendarViewDate); d.setMonth(calendarViewDate.getMonth() + 1); setCalendarViewDate(d); };

  const handleSelectDateFromCalendar = (dayNum) => {
    setSelectedDate(dayNum);
    setSelectedSlot(null);
    const d = new Date(calendarViewDate);
    d.setDate(dayNum);
    setViewDate(d);
    setShowFullCalendar(false);
  };

  const handleSlotSelection = (time) => {
    setSelectedSlot(time);
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const slots = [
    { time: '09:00', available: true },
    { time: '10:30', available: true },
    { time: '11:00', available: false },
    { time: '13:00', available: true },
    { time: '14:30', available: true },
    { time: '16:00', available: false },
  ];

  const handleBook = () => {
    setBookingStatus('confirmed');
    setStep(2);
  };

  const isSelectedDayFull = (dates.find((d) => d.dayNum === selectedDate)?.busy === 'full') || (monthDates.find((d) => d.dayNum === selectedDate)?.busy === 'full');

  const getEndTime = (startTime) => {
    if (!startTime) return '';
    const [h, m] = startTime.split(':').map(Number);
    const endH = (h + 1) % 24;
    return `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const currentStripMonth = dates[0]?.monthName || '';
  const currentCalendarMonth = calendarViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  if (step === 2) {
    return (
      <ConfirmationScreen
        status={bookingStatus}
        providerName={provider.name}
        serviceName={serviceName}
        selectedDate={selectedDate}
        currentStripMonth={currentStripMonth}
        selectedSlot={selectedSlot}
        address={provider.fullAddress}
        phone={provider.phone}
        petName={petName}
        petImage={petImage}
        showToast={showToast}
        onDone={() => {
          if (bookingStatus === 'rejected') {
            setStep(1);
            setSelectedSlot(null);
          } else {
            showToast('Saved in your bookings');
            setStep(1);
            setSelectedSlot(null);
          }
        }}
      />
    );
  }

  return (
    <div className="absolute inset-0 z-[60] flex flex-col animate-slide-in-right h-full overflow-hidden" style={{ backgroundColor: T.bg }}>
      <div
        className="absolute top-0 w-full z-20 transition-all duration-300"
        style={{
          backgroundColor: isScrolled ? 'rgba(247,245,242,0.92)' : 'transparent',
          boxShadow: isScrolled ? SHADOWS.card : 'none',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="pt-[60px] pb-3 px-5 flex items-center justify-between relative">
          <IconBtn icon={ChevronLeft} ariaLabel="Back" onClick={() => window.history.back()} size={40} />
          <div className={`absolute left-0 w-full flex flex-col items-center justify-center pointer-events-none transition-all duration-500 transform ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <span className="text-[12px] font-bold" style={{ color: T.txt }}>{provider.name}</span>
            <span className="text-[10.5px] font-medium tracking-wide mt-0.5" style={{ color: T.muted }}>{serviceName}</span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {showFullCalendar && (
        <div
          className="absolute inset-0 z-[80] flex items-end sm:items-center justify-center animate-fade-in"
          style={{ backgroundColor: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowFullCalendar(false)}
        >
          <div
            className="w-full sm:w-[90%] sm:max-w-[340px] p-5 pb-8 animate-slide-up"
            style={{
              backgroundColor: T.card,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              boxShadow: SHADOWS.sheet,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-1">
                <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ backgroundColor: T.bg, color: T.muted }}><ChevronLeft size={15}/></button>
                <h4 className="font-bold text-[16px] min-w-[120px] text-center" style={{ color: T.txt }}>{currentCalendarMonth}</h4>
                <button onClick={handleNextMonth} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ backgroundColor: T.bg, color: T.muted }}><ChevronRight size={15}/></button>
              </div>
              <button onClick={() => setShowFullCalendar(false)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ backgroundColor: T.bg, color: T.muted }}><X size={16} /></button>
            </div>

            <div className="grid grid-cols-7 mb-3">
              {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((d) => (
                <div key={d} className="text-center text-[10px] font-bold uppercase" style={{ color: T.muted, opacity: 0.6 }}>{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-2.5 gap-x-1.5">
              {monthDates.map((item, idx) => (
                <button
                  key={item.dayNum}
                  style={{
                    ...(idx === 0 ? { gridColumnStart: item.offset + 1 } : {}),
                    backgroundColor: selectedDate === item.dayNum ? T.coral : 'transparent',
                    color: selectedDate === item.dayNum ? '#fff' : (item.busy === 'full' ? '#D1D5DB' : T.txt),
                    boxShadow: selectedDate === item.dayNum ? '0 2px 6px rgba(232,93,42,0.24)' : 'none',
                    textDecoration: item.busy === 'full' && selectedDate !== item.dayNum ? 'line-through' : 'none',
                  }}
                  disabled={item.busy === 'full'}
                  onClick={() => handleSelectDateFromCalendar(item.dayNum)}
                  className="h-9 w-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all relative active:scale-95"
                >
                  {item.dayNum}
                  {item.busy !== 'full' && selectedDate !== item.dayNum && (
                    <div className="w-1 h-1 rounded-full absolute bottom-1.5" style={{ backgroundColor: item.busy === 'low' ? T.success : T.warn }} />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-5 flex justify-center">
              <p className="text-[10px] font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1" style={{ backgroundColor: T.bg, color: T.muted }}>
                <Info size={10} strokeWidth={2.4} /> Some spots fill fast — booking early helps
              </p>
            </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-48 pt-[100px] no-scrollbar">
        <div className="px-5 mb-8 animate-slide-up">
          <div className="flex items-center gap-2 mb-2 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="w-5 h-5 rounded-full overflow-hidden" style={{ backgroundColor: T.tint, border: `1px solid ${T.card}` }}>
              <img src={petImage} alt={petName} className="w-full h-full object-cover"/>
            </div>
            <span className="text-[11px] font-bold tracking-wide uppercase" style={{ color: T.coral }}>Booking for {petName}</span>
          </div>
          <h3 className="text-[26px] font-bold leading-tight mb-2" style={{ color: T.txt, letterSpacing: '-0.6px' }}>{provider.name}</h3>
          <div className="flex flex-col gap-1.5 mb-3">
            <p className="text-[13.5px] font-bold" style={{ color: T.mutedDark }}>{serviceName} · {serviceDuration}</p>
            <div className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: T.muted }}>
              <MapPin size={12} strokeWidth={2.4}/>
              <span>{provider.location} · {provider.distance}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 animate-fade-in opacity-0" style={{ animationDelay: '0.2s' }}>
            <div className="flex -space-x-1.5">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100" className="w-5 h-5 rounded-full object-cover" style={{ border: `1px solid ${T.card}` }} alt="Sarah"/>
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" className="w-5 h-5 rounded-full object-cover" style={{ border: `1px solid ${T.card}` }} alt="Tom"/>
            </div>
            <span className="text-[12px] font-medium" style={{ color: T.muted }}>Handled by Sarah or Tom</span>
          </div>
        </div>

        <div className="px-5 mb-8">
          <div className="flex justify-between items-center mb-4">
            <button className="flex items-center gap-2 active:opacity-70" onClick={() => setShowFullCalendar(true)}>
              <h4 className="font-bold text-[16px]" style={{ color: T.txt }}>{currentStripMonth}</h4>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: T.coralSoft, color: T.coral }}>
                <ChevronDown size={13} strokeWidth={2.6} />
              </div>
            </button>
            <div className="flex gap-1">
              <button onClick={handlePrevWeek} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ color: T.muted }}><ChevronLeft size={16}/></button>
              <button onClick={handleNextWeek} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ color: T.muted }}><ChevronRight size={16}/></button>
            </div>
          </div>

          <div className="flex justify-between mb-3 overflow-hidden">
            {dates.map((item, i) => (
              <button
                key={i}
                onClick={() => { setSelectedDate(item.dayNum); setSelectedSlot(null); }}
                style={{
                  transitionDelay: `${i * 0.05}s`,
                  backgroundColor: selectedDate === item.dayNum
                    ? (item.busy === 'full' ? T.bg : T.coral)
                    : (item.busy === 'full' ? 'transparent' : T.card),
                  color: selectedDate === item.dayNum
                    ? (item.busy === 'full' ? T.muted : '#fff')
                    : (item.busy === 'full' ? '#D1D5DB' : T.mutedDark),
                  boxShadow: selectedDate === item.dayNum && item.busy !== 'full' ? '0 4px 14px rgba(232,93,42,0.25)' : SHADOWS.card,
                  border: selectedDate === item.dayNum || item.busy === 'full' ? 'none' : `1px solid ${T.border}`,
                  transform: selectedDate === item.dayNum ? 'scale(1.08)' : 'scale(1)',
                  opacity: item.busy === 'full' && selectedDate !== item.dayNum ? 0.5 : 1,
                  filter: item.busy === 'full' && selectedDate !== item.dayNum ? 'grayscale(1)' : 'none',
                }}
                className="flex flex-col items-center justify-center w-[44px] h-[76px] rounded-[20px] transition-all duration-300 animate-slide-up relative shrink-0"
              >
                <span className="text-[10px] font-bold mb-1" style={{ opacity: selectedDate === item.dayNum ? 0.9 : 0.6 }}>{item.dayName}</span>
                <span className="text-[18px] font-bold">{item.dayNum}</span>
                {selectedDate !== item.dayNum && item.busy !== 'full' && (
                  <div className="w-1 h-1 rounded-full mt-1.5" style={{ backgroundColor: item.busy === 'low' ? T.success : T.warn }} />
                )}
                {selectedDate === item.dayNum && item.busy !== 'full' && <div className="w-1 h-1 rounded-full mt-1.5" style={{ backgroundColor: '#fff' }} />}
                {item.busy === 'full' && <X size={10} strokeWidth={3} className="opacity-40 mt-1.5" />}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-5 mt-3 animate-fade-in" style={{ opacity: 0.85 }}>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: T.success }} /><span className="text-[10px] font-bold" style={{ color: T.muted }}>Available</span></div>
            <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: T.warn }} /><span className="text-[10px] font-bold" style={{ color: T.muted }}>Limited</span></div>
            <div className="flex items-center gap-1.5"><X size={10} strokeWidth={3} style={{ color: '#D1D5DB' }} /><span className="text-[10px] font-bold" style={{ color: T.muted }}>Full</span></div>
          </div>
        </div>

        <div className="px-5 mb-10 min-h-[140px]">
          {isSelectedDayFull ? (
            <div
              className="flex flex-col items-center justify-center py-8 animate-fade-in"
              style={{ backgroundColor: T.card, borderRadius: 28, border: `1px solid ${T.border}`, boxShadow: SHADOWS.card }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: T.bg, color: T.muted }}>
                <Calendar size={20} />
              </div>
              <p className="text-[14px] font-bold mb-1" style={{ color: T.txt }}>No slots available</p>
              <p className="text-[11px] font-medium mb-3 text-center" style={{ color: T.muted }}>We'll notify you if a slot opens up</p>
              <button className="text-[12px] font-bold flex items-center gap-1.5 active:opacity-70" style={{ color: T.coral }}>
                Join Waitlist <ChevronRight size={10} strokeWidth={3}/>
              </button>
            </div>
          ) : (
            <>
              <h4 className="font-bold text-[16px] mb-5 animate-fade-in" style={{ color: T.txt }}>Morning & Afternoon</h4>
              <div className="grid grid-cols-3 gap-2.5">
                {slots.map((slot, i) => (
                  <button
                    key={i}
                    disabled={!slot.available}
                    onClick={() => handleSlotSelection(slot.time)}
                    style={{
                      animationDelay: `${0.1 + (i * 0.05)}s`,
                      backgroundColor: selectedSlot === slot.time ? T.txt : (!slot.available ? T.bg : T.card),
                      color: selectedSlot === slot.time ? '#fff' : (!slot.available ? '#D1D5DB' : T.txt),
                      boxShadow: selectedSlot === slot.time ? '0 8px 20px rgba(0,0,0,0.12)' : SHADOWS.card,
                      border: selectedSlot === slot.time || !slot.available ? 'none' : `1px solid ${T.border}`,
                      cursor: slot.available ? 'pointer' : 'not-allowed',
                    }}
                    className={`relative py-3 rounded-[18px] text-[12px] font-bold transition-all duration-300 animate-slide-up flex flex-col items-center justify-center gap-0.5 ${selectedSlot === slot.time ? 'animate-pop-click z-10' : ''}`}
                  >
                    <span>{slot.time}</span>
                    {selectedSlot === slot.time && <div className="w-1.5 h-1.5 rounded-full absolute right-2.5 top-1/2 -translate-y-1/2 animate-scale-in" style={{ backgroundColor: T.coral }} />}
                    {!slot.available && <span className="text-[9px] font-bold" style={{ color: '#D1D5DB' }}>Full</span>}
                  </button>
                ))}
              </div>
              {selectedSlot && (
                <div className="mt-3 animate-slide-up-sm">
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-[16px]" style={{ backgroundColor: T.coralSoft, border: `1px solid rgba(232,93,42,0.15)` }}>
                    <div>
                      <span className="text-[12px] font-bold block" style={{ color: T.txt }}>{selectedDate} {currentStripMonth} · {selectedSlot}</span>
                      <span className="text-[10px] font-medium block" style={{ color: T.muted }}>Ends around {getEndTime(selectedSlot)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: T.coral }}>
                      <span>Selected</span>
                      <Check size={12} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h4 className="font-bold text-[16px] mb-3" style={{ color: T.txt }}>Preferences</h4>
          <div className="relative">
            <textarea
              placeholder="Any special requests or allergies?"
              className="w-full p-5 text-[13.5px] font-medium outline-none transition-all resize-none min-h-[110px]"
              style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, borderRadius: 24, boxShadow: SHADOWS.card, color: T.txt }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="absolute bottom-4 right-4 transition-colors" style={{ color: note ? T.coral : '#D1D5DB' }}>
              <Heart size={18} fill={note ? T.coral : 'none'} strokeWidth={2.2} />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: T.card, color: T.muted, boxShadow: SHADOWS.card }}>
                <Bell size={13} />
              </div>
              <span className="text-[12px] font-bold" style={{ color: T.mutedDark }}>Remind me 1h before</span>
            </div>
            <button onClick={() => setAddToCalendar(!addToCalendar)} className="cursor-pointer p-1">
              <div className="w-9 h-5 rounded-full p-0.5 transition-all duration-300" style={{ backgroundColor: addToCalendar ? T.coral : '#E5E7EB' }}>
                <div className="w-4 h-4 rounded-full transition-transform duration-300" style={{ backgroundColor: '#fff', boxShadow: SHADOWS.card, transform: `translateX(${addToCalendar ? 16 : 0}px)` }} />
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full px-5 pb-6 pt-3 z-50" style={{ background: `linear-gradient(to top, ${T.bg}, ${T.bg}, transparent)` }}>
        <div className={`flex justify-center overflow-hidden transition-all duration-500 ease-out ${selectedSlot ? 'max-h-10 opacity-100 mb-2.5' : 'max-h-0 opacity-0 mb-0'}`}>
          <p className="text-[10px] font-bold flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.5)', color: T.muted, border: `1px solid ${T.border}`, backdropFilter: 'blur(8px)' }}>
            <Info size={10} strokeWidth={2.4}/> Free cancellation up to 24h before
          </p>
        </div>

        <PrimaryBtn onClick={handleBook} disabled={!selectedSlot}>
          {selectedSlot ? `Confirm · ${servicePrice}` : 'Pick a time slot'}
        </PrimaryBtn>

        <div className={`overflow-hidden transition-all duration-500 ease-out ${selectedSlot ? 'max-h-10 opacity-100 mt-2.5' : 'max-h-0 opacity-0 mt-0'}`}>
          <p className="text-[10px] text-center font-medium leading-tight" style={{ color: T.muted }}>
            {addToCalendar ? "You'll receive a confirmation & reminder after you confirm" : "You'll receive a confirmation after you confirm"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [toast, setToast] = useState(null);
  const showToastFn = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  return (
    <>
      <LocalStyles />
      <div className="flex items-center justify-center min-h-screen py-10 font-sans" style={{ backgroundColor: '#E5E5E5' }}>
        <div
          className="relative w-[390px] h-[844px] overflow-hidden"
          style={{
            borderRadius: 55,
            boxShadow: '0 0 0 12px #1a1a1a, 0 0 0 14px #333, 0 40px 100px -20px rgba(0,0,0,0.5)',
            backgroundColor: T.bg,
          }}
        >
          <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] z-[100] pointer-events-none flex items-center justify-end pr-3" style={{ backgroundColor: '#000', borderRadius: 24 }}>
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(51,51,51,0.4)' }} />
          </div>

          <StatusBar />
          {toast && <Toast message={toast} />}

          <div className="w-full h-full relative">
            <BookingFlow provider={PROVIDER_DATA} showToast={showToastFn} />
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full z-[70]" style={{ backgroundColor: 'rgba(26,26,26,0.9)' }} />
        </div>
      </div>
    </>
  );
}
