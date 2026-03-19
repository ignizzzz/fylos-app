import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Check, X, Clock, Bell, 
  Signal, Wifi, Battery, Info, AlertCircle, Heart, MapPin, ChevronDown
} from 'lucide-react';

// --- STYLES & ANIMATIONS ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: #F9FAFB; color: #1A1A1A; }
    .font-brand { font-family: 'Nunito', sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Animations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes fill-dot { 0% { transform: scale(0); } 100% { transform: scale(1); } }
    
    /* New Interactions */
    @keyframes popClick { 
        0% { transform: scale(1); } 
        40% { transform: scale(0.96); } 
        100% { transform: scale(1.02); } /* Slight pop at the end */
    }
    @keyframes slideUpSm { 
        from { transform: translateY(8px); opacity: 0; } 
        to { transform: translateY(0); opacity: 1; } 
    }
    
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-slide-in-right { animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
    .animate-fill-dot { animation: fill-dot 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    
    .animate-pop-click { animation: popClick 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-slide-up-sm { animation: slideUpSm 0.4s ease-out forwards; }
    
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
    distance: '12 min drive'
};

// --- REUSABLE COMPONENTS ---

const StatusBar = () => (
  <div className="absolute top-0 left-0 w-full h-[54px] flex justify-between items-end px-7 pb-3 z-[60] text-[13px] font-semibold tracking-wide text-[#1A1A1A]">
    <span>9:41</span>
    <div className="flex items-center gap-1.5">
      <Signal size={16} strokeWidth={2.5} />
      <Wifi size={16} strokeWidth={2.5} />
      <Battery size={18} strokeWidth={2.5} />
    </div>
  </div>
);

const Toast = ({ message }) => (
  <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[90] bg-[#1A1A1A] text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3 animate-fade-in whitespace-nowrap">
    <div className="w-5 h-5 rounded-full bg-[#FF5500] flex items-center justify-center">
      <Check size={12} className="text-white" strokeWidth={3} />
    </div>
    <span className="text-xs font-bold tracking-wide font-brand">{message}</span>
  </div>
);

// --- BOOKING FLOW (MAIN FOCUS) ---

const BookingFlow = ({ provider, showToast }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [addToCalendar, setAddToCalendar] = useState(true);
  const [note, setNote] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFullCalendar, setShowFullCalendar] = useState(false);
  const scrollRef = useRef(null);
  
  // Date Navigation States
  const [viewDate, setViewDate] = useState(new Date()); // Controls the horizontal strip
  const [calendarViewDate, setCalendarViewDate] = useState(new Date()); // Controls the full calendar month

  // Dynamic Dates State (Horizontal Strip)
  const [dates, setDates] = useState([]);
  
  // Full Month Mock Data
  const [monthDates, setMonthDates] = useState([]);

  // Mock Service Details
  const serviceName = "Bath & Tidy";
  const serviceDuration = "1h";
  const servicePrice = "CHF 85";

  // --- LOGIC: Date Generation ---
  useEffect(() => {
      // Generate 7 days starting from viewDate for the horizontal strip
      const nextDays = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(viewDate);
          d.setDate(viewDate.getDate() + i);
          return {
              fullDate: d,
              dayName: d.toLocaleDateString('en-US', { weekday: 'short' }), 
              dayNum: d.getDate(), 
              monthName: d.toLocaleDateString('en-US', { month: 'long' }),
              busy: (d.getDate() % 6 === 0) ? 'full' : (d.getDate() % 3 === 0) ? 'med' : 'low' // Mock logic
          };
      });
      setDates(nextDays);
  }, [viewDate]);

  useEffect(() => {
      // Generate days for the Full Calendar View based on calendarViewDate
      const year = calendarViewDate.getFullYear();
      const month = calendarViewDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
      
      // Adjust for Monday start (optional, standard is usually Sun or Mon)
      const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

      const fullMonth = Array.from({ length: daysInMonth }, (_, i) => {
          const dayNum = i + 1;
          const status = (dayNum % 6 === 0) ? 'full' : (dayNum % 3 === 0) ? 'med' : 'low';
          return {
              dayNum: dayNum,
              busy: status,
              offset: i === 0 ? startOffset : 0
          };
      });
      setMonthDates(fullMonth);
  }, [calendarViewDate]);

  // Scroll Listener & Force Scroll Enable
  useEffect(() => {
      const scrollElement = scrollRef.current;
      const handleScroll = () => {
          if (scrollElement) {
              setIsScrolled(scrollElement.scrollTop > 100);
          }
      };
      if (scrollElement) scrollElement.addEventListener('scroll', handleScroll);
      return () => { if (scrollElement) scrollElement.removeEventListener('scroll', handleScroll); };
  }, []);

  // Force scroll to be enabled when slot is selected
  useEffect(() => {
      if (selectedSlot && scrollRef.current) {
          // Wait for DOM update and then scroll to bottom button
          setTimeout(() => {
              if (scrollRef.current) {
                  const element = scrollRef.current;
                  // Scroll to bottom to show the button
                  const maxScroll = element.scrollHeight - element.clientHeight;
                  if (maxScroll > 0) {
                      element.scrollTop = maxScroll;
                  }
              }
          }, 400);
      }
  }, [selectedSlot]);
  
  // --- HANDLERS: Navigation ---
  const handlePrevWeek = () => {
      const newDate = new Date(viewDate);
      newDate.setDate(viewDate.getDate() - 7);
      setViewDate(newDate);
  };

  const handleNextWeek = () => {
      const newDate = new Date(viewDate);
      newDate.setDate(viewDate.getDate() + 7);
      setViewDate(newDate);
  };

  const handlePrevMonth = () => {
      const newDate = new Date(calendarViewDate);
      newDate.setMonth(calendarViewDate.getMonth() - 1);
      setCalendarViewDate(newDate);
  };

  const handleNextMonth = () => {
      const newDate = new Date(calendarViewDate);
      newDate.setMonth(calendarViewDate.getMonth() + 1);
      setCalendarViewDate(newDate);
  };

  const handleSelectDateFromCalendar = (dayNum) => {
      setSelectedDate(dayNum);
      setSelectedSlot(null);
      
      // Sync horizontal strip to show the selected date
      const newViewDate = new Date(calendarViewDate);
      newViewDate.setDate(dayNum);
      setViewDate(newViewDate);
      
      setShowFullCalendar(false);
  };

  const handleSlotSelection = (time) => {
      setSelectedSlot(time);
      if (navigator.vibrate) navigator.vibrate(10); // Haptic feedback
  };

  // Mock Slots 
  const slots = [
      { time: '09:00', available: true },
      { time: '10:30', available: true },
      { time: '11:00', available: false }, 
      { time: '13:00', available: true },
      { time: '14:30', available: true },
      { time: '16:00', available: false } 
  ];

  const handleBook = () => { setStep(2); };

  // Logic to find availability for the currently selected date number
  const isSelectedDayFull = (dates.find(d => d.dayNum === selectedDate)?.busy === 'full') || (monthDates.find(d => d.dayNum === selectedDate)?.busy === 'full');

  // Helper for end time
  const getEndTime = (startTime) => {
      if (!startTime) return '';
      const [h, m] = startTime.split(':').map(Number);
      const endH = (h + 1) % 24;
      return `${endH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  // Get current month label for display
  const currentStripMonth = dates[0]?.monthName || '';
  const currentCalendarMonth = calendarViewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // --- STEP 2: CONFIRMATION SCREEN ---
  if (step === 2) return (
      <div className="absolute inset-0 bg-[#FAFAF9] z-[60] flex flex-col items-center justify-center animate-fade-in">
          <div className="w-[320px] bg-white p-8 rounded-[40px] shadow-2xl border border-gray-50 flex flex-col items-center text-center animate-slide-up relative overflow-hidden">
              <div className="w-24 h-24 rounded-full border-[4px] border-[#FAFAF9] shadow-inner flex items-center justify-center mb-8 bg-green-50">
                  <div className="w-20 h-20 bg-[#FF5500] rounded-full animate-fill-dot origin-center shadow-lg shadow-orange-500/30 flex items-center justify-center">
                      <Check size={40} className="text-white animate-scale-in" strokeWidth={4} />
                  </div>
              </div>
              <h2 className="text-2xl font-black font-brand text-[#1A1A1A] mb-3">All set!</h2>
              <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                  Your appointment for <br/><span className="text-[#1A1A1A] font-bold">{serviceName}</span> is confirmed.
              </p>
              
              <div className="w-full bg-[#FAFAF9] rounded-[24px] p-5 mb-8 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DATE</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TIME</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-base font-black text-[#1A1A1A]">
                          {selectedDate} {currentStripMonth}
                      </span>
                      <span className="text-base font-black text-[#1A1A1A]">{selectedSlot}</span>
                  </div>
              </div>

              <button onClick={() => { showToast('Saved to Wallet'); setStep(1); setSelectedSlot(null); }} className="text-white font-extrabold text-sm bg-[#1A1A1A] px-10 py-5 rounded-full shadow-lg active-press hover:bg-black transition-colors w-full">Done</button>
              <button className="mt-6 text-[11px] font-bold text-gray-400 hover:text-[#FF5500] transition-colors">Add to Apple Wallet</button>
          </div>
      </div>
  );

  // --- STEP 1: SELECTION SCREEN ---
  return (
    <div className="absolute inset-0 bg-[#FAFAF9] z-[60] flex flex-col animate-slide-in-right h-full overflow-hidden" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- SMART STICKY HEADER --- */}
      <div className={`absolute top-0 w-full z-20 transition-all duration-300 ${isScrolled ? 'bg-white/90 shadow-sm backdrop-blur-md' : 'bg-[#FAFAF9]/0'}`}>
        <div className="pt-[60px] pb-3 px-6 flex items-center justify-between relative">
           <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center active-press shadow-sm hover:bg-gray-50 transition-colors z-30"><ChevronLeft size={20} className="text-[#1A1A1A]"/></button>
           
           <div className={`absolute left-0 w-full flex flex-col items-center justify-center pointer-events-none transition-all duration-500 transform ${isScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
               <span className="text-xs font-bold text-[#1A1A1A]">{provider.name}</span>
               <span className="text-[10px] font-medium text-gray-400 tracking-wide mt-0.5">{serviceName}</span>
           </div>

           <div className="w-10"></div>
        </div>
      </div>

      {/* --- FULL CALENDAR MODAL --- */}
      {showFullCalendar && (
          <div className="absolute inset-0 z-[80] bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in" onClick={() => setShowFullCalendar(false)}>
              <div className="bg-white w-full sm:w-[90%] sm:max-w-[340px] rounded-t-[40px] sm:rounded-[40px] p-6 pb-10 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-1">
                          <button onClick={handlePrevMonth} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 active-press"><ChevronLeft size={16}/></button>
                          <h4 className="font-extrabold text-[#1A1A1A] text-lg font-brand min-w-[120px] text-center">{currentCalendarMonth}</h4>
                          <button onClick={handleNextMonth} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 active-press"><ChevronRight size={16}/></button>
                      </div>
                      <button onClick={() => setShowFullCalendar(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 active-press">
                          <X size={18} />
                      </button>
                  </div>
                  
                  <div className="grid grid-cols-7 mb-4">
                      {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(d => (
                          <div key={d} className="text-center text-[10px] font-bold text-gray-300 uppercase">{d}</div>
                      ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-3 gap-x-2">
                      {monthDates.map((item, idx) => (
                          <button 
                              key={item.dayNum}
                              style={idx === 0 ? { gridColumnStart: item.offset + 1 } : {}}
                              disabled={item.busy === 'full'}
                              onClick={() => handleSelectDateFromCalendar(item.dayNum)}
                              className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-all relative ${
                                  selectedDate === item.dayNum 
                                  ? 'bg-[#FF5500] text-white shadow-md' 
                                  : item.busy === 'full' 
                                      ? 'text-gray-300 line-through decoration-gray-300' 
                                      : 'text-[#1A1A1A] hover:bg-gray-50'
                              }`}
                          >
                              {item.dayNum}
                              {item.busy !== 'full' && selectedDate !== item.dayNum && (
                                  <div className={`w-1 h-1 rounded-full absolute bottom-1.5 ${item.busy === 'low' ? 'bg-green-400' : 'bg-orange-300'}`}></div>
                              )}
                          </button>
                      ))}
                  </div>

                  {/* Gentle Booking Hint */}
                  <div className="mt-6 flex justify-center">
                      <p className="text-[10px] font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <Info size={10} strokeWidth={2.5} />
                          Some spots fill fast — booking early helps
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* --- SCROLLABLE CONTENT --- */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-[180px] pt-[110px] no-scrollbar" style={{ minHeight: 0, height: 0 }}>
         
         <div className="px-6 mb-10 animate-slide-up">
             <div className="flex items-center gap-2 mb-2 opacity-0 animate-fade-in" style={{animationDelay: '0.1s'}}>
                 <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden ring-1 ring-white shadow-sm">
                     <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=100" alt="Baxter" className="w-full h-full object-cover"/>
                 </div>
                 <span className="text-xs font-bold text-[#FF5500] tracking-wide uppercase">Booking for Baxter</span>
             </div>

             <h3 className="text-3xl font-black text-[#1A1A1A] font-brand leading-tight mb-2">
                 {provider.name}
             </h3>
             
             <div className="flex flex-col gap-2 mb-4">
                 <p className="text-gray-800 font-extrabold text-sm">{serviceName} · {serviceDuration}</p>
                 <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
                    <MapPin size={12} strokeWidth={2.5}/>
                    <span>Seefeld, Zürich · 12 min drive</span>
                 </div>
             </div>
             
             <div className="flex items-center gap-2 animate-fade-in opacity-0" style={{animationDelay: '0.2s'}}>
                <div className="flex -space-x-1.5">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100" className="w-5 h-5 rounded-full border border-white object-cover" alt="Sarah"/>
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100" className="w-5 h-5 rounded-full border border-white object-cover" alt="Tom"/>
                </div>
                <span className="text-xs font-medium text-gray-400">Handled by Sarah or Tom</span>
             </div>
         </div>

         {/* Date Selection Strip */}
         <div className="px-6 mb-10">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setShowFullCalendar(true)}>
                    <h4 className="font-extrabold text-[#1A1A1A] text-lg font-brand group-hover:text-[#FF5500] transition-colors">{currentStripMonth}</h4>
                    <div className="w-6 h-6 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#FF5500] group-hover:text-white transition-all">
                        <ChevronDown size={14} strokeWidth={3} />
                    </div>
                </div>
                
                {/* Functional Navigation Arrows */}
                <div className="flex gap-2">
                    <button onClick={handlePrevWeek} className="w-8 h-8 rounded-full bg-transparent hover:bg-white flex items-center justify-center text-gray-400 hover:text-black transition-colors active-press"><ChevronLeft size={18}/></button>
                    <button onClick={handleNextWeek} className="w-8 h-8 rounded-full bg-transparent hover:bg-white flex items-center justify-center text-gray-400 hover:text-black transition-colors active-press"><ChevronRight size={18}/></button>
                </div>
            </div>
            
            <div className="flex justify-between mb-4 overflow-hidden">
                {dates.map((item, i) => (
                    <button 
                        key={i} 
                        onClick={() => { setSelectedDate(item.dayNum); setSelectedSlot(null); }}
                        style={{ transitionDelay: `${i * 0.05}s` }}
                        className={`flex flex-col items-center justify-center w-[44px] h-[76px] rounded-[22px] transition-all duration-300 animate-slide-up relative group shrink-0 ${
                            selectedDate === item.dayNum 
                            ? item.busy === 'full' 
                                ? 'bg-gray-100 text-gray-400 scale-100' 
                                : 'bg-[#FF5500] text-white shadow-xl shadow-orange-500/20 scale-110 z-10' 
                            : item.busy === 'full' 
                                ? 'bg-transparent text-gray-300 opacity-50 grayscale' 
                                : 'bg-white text-gray-500 shadow-[0_2px_15px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-0.5' 
                        }`}
                    >
                        <span className={`text-[10px] font-bold mb-1 ${selectedDate === item.dayNum ? 'opacity-90' : 'opacity-60'}`}>{item.dayName}</span>
                        <span className="text-xl font-black font-brand">{item.dayNum}</span>
                        
                        {selectedDate !== item.dayNum && item.busy !== 'full' && (
                            <div className={`w-1 h-1 rounded-full mt-2 transition-colors ${
                                item.busy === 'low' ? 'bg-green-400' : 'bg-orange-300'
                            }`}></div>
                        )}
                        {selectedDate === item.dayNum && item.busy !== 'full' && <div className="w-1 h-1 bg-white rounded-full mt-2"></div>}
                        
                        {item.busy === 'full' && (
                           <div className="mt-2"><X size={10} strokeWidth={3} className="opacity-40"/></div>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-center gap-6 mt-4 animate-fade-in opacity-80">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                    <span className="text-[10px] font-bold text-gray-400">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-300"></div>
                    <span className="text-[10px] font-bold text-gray-400">Limited</span>
                </div>
                <div className="flex items-center gap-2">
                    <X size={10} className="text-gray-300" strokeWidth={3} />
                    <span className="text-[10px] font-bold text-gray-400">Full</span>
                </div>
            </div>
         </div>

         {/* Time Slot Selection - Smaller UI */}
         <div className="px-6 mb-12 min-h-[140px]">
            {isSelectedDayFull ? (
                <div className="flex flex-col items-center justify-center py-8 animate-fade-in bg-white rounded-[32px] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-3">
                        <Calendar size={20} />
                    </div>
                    <p className="text-[#1A1A1A] font-bold text-sm mb-1">No slots available</p>
                    <p className="text-[11px] text-gray-400 font-medium mb-3 text-center">We’ll notify you if a slot opens up</p>
                    <button className="text-[#FF5500] text-xs font-extrabold flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                        Join Waitlist <ChevronRight size={10} strokeWidth={3}/>
                    </button>
                </div>
            ) : (
                <>
                    <h4 className="font-extrabold text-[#1A1A1A] text-lg font-brand mb-6 animate-fade-in">Morning & Afternoon</h4>
                    
                    {/* Compact Grid */}
                    <div className="grid grid-cols-3 gap-3"> 
                        {slots.map((slot, i) => (
                            <button 
                                key={i}
                                disabled={!slot.available}
                                onClick={() => handleSlotSelection(slot.time)}
                                style={{ animationDelay: `${0.1 + (i * 0.05)}s` }}
                                className={`relative py-3 rounded-[20px] text-xs font-bold transition-all duration-300 animate-slide-up flex flex-col items-center justify-center gap-0.5 ${
                                    selectedSlot === slot.time
                                    ? 'bg-[#1A1A1A] text-white shadow-xl shadow-black/10 animate-pop-click z-10' 
                                    : !slot.available
                                        ? 'bg-gray-50/50 text-gray-300 border border-transparent cursor-not-allowed' 
                                        : 'bg-white text-[#1A1A1A] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-md hover:scale-[1.01]' 
                                }`}
                            >
                                <span>{slot.time}</span>
                                {selectedSlot === slot.time && <div className="w-1.5 h-1.5 bg-[#FF5500] rounded-full absolute right-2.5 top-1/2 -translate-y-1/2 animate-scale-in"></div>}
                                
                                {!slot.available && (
                                    <span className="text-[9px] font-bold text-gray-300">Full</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* CONFIRMATION ROW - More Discreet */}
                    {selectedSlot && (
                        <div className="mt-4 animate-slide-up-sm">
                            <div className="flex items-center justify-between px-4 py-2.5 bg-[#FF5500]/5 border border-[#FF5500]/10 rounded-[18px]">
                                <div>
                                    <span className="text-xs font-extrabold text-[#1A1A1A] font-brand block">
                                        {selectedDate} {currentStripMonth} · {selectedSlot}
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-400 mt-0 block">
                                        Ends around {getEndTime(selectedSlot)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[#FF5500] text-[10px] font-bold uppercase tracking-wider">
                                    <span>Selected</span>
                                    <Check size={12} strokeWidth={4} />
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
         </div>

         {/* Preferences */}
         <div className="px-6 animate-slide-up" style={{animationDelay: '0.4s'}}>
             <div className="mb-4">
                 <h4 className="font-extrabold text-[#1A1A1A] text-lg font-brand">Preferences</h4>
             </div>
             
             <div className="relative group">
                 <textarea 
                   placeholder="Any special requests or allergies?" 
                   className="w-full bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] rounded-[28px] p-6 text-sm font-medium focus:outline-none focus:ring-0 focus:shadow-md transition-all placeholder:text-gray-300 resize-none min-h-[110px]"
                   value={note}
                   onChange={(e) => setNote(e.target.value)}
                 />
                 <div className="absolute bottom-5 right-5 text-gray-200 group-focus-within:text-[#FF5500] transition-colors"><Heart size={18} fill={note ? "#FF5500" : "none"} strokeWidth={2.5} className={note ? "text-[#FF5500]" : ""}/></div>
             </div>

             <div className="mt-4 flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400">
                         <Bell size={14} />
                     </div>
                     <span className="text-xs font-bold text-gray-500">Remind me 1h before</span>
                 </div>
                 
                 <div className="cursor-pointer p-2" onClick={() => setAddToCalendar(!addToCalendar)}>
                     <div className={`w-8 h-4.5 rounded-full p-0.5 transition-all duration-300 ${addToCalendar ? 'bg-[#FF5500]' : 'bg-gray-200'}`}>
                         <div className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm transition-transform duration-300 ${addToCalendar ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="absolute bottom-0 w-full px-6 pb-8 pt-4 bg-gradient-to-t from-[#FAFAF9] via-[#FAFAF9] to-transparent z-50">
         
         {/* Cancellation Policy Hint - Only visible when a slot is selected */}
         {/* TEST: Always visible for scroll test */}
         <div className="flex justify-center overflow-hidden transition-all duration-500 ease-out max-h-10 opacity-100 mb-2.5">
            <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm border border-gray-100/50 shadow-sm">
                <Info size={11} strokeWidth={2.5}/>
                Free cancellation up to 24h before
            </p>
         </div>

         <button 
           onClick={handleBook}
           // TEST: Always visible for scroll test - removed disabled attribute completely
           className="relative w-full py-5 rounded-[30px] font-black text-base transition-all duration-500 cubic-bezier(0.2, 0.8, 0.2, 1) flex items-center justify-center overflow-hidden bg-[#1A1A1A] text-white shadow-2xl shadow-black/20 scale-100 hover:scale-[1.02]"
         >
            {/* TEST: Always show "Continue" text for scroll test */}
            <span className="flex items-center gap-2 animate-slide-up">
               <span>TEST-CONTINUE-BUTTON</span>
            </span>
         </button>

         {/* Reassurance Text - Updated Logic */}
         {/* TEST: Always visible for scroll test */}
         <div className="overflow-hidden transition-all duration-500 ease-out max-h-10 opacity-100 mt-3">
             <p className="text-[10px] text-center text-gray-400 font-medium leading-tight">
                 {addToCalendar 
                     ? "You'll receive a confirmation & reminder after you confirm" 
                     : "You'll receive a confirmation after you confirm"}
             </p>
         </div>
      </div>
    </div>
  );
};

export default function FylosApp() {
  const [toast, setToast] = useState(null);
  const showToastFn = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  return (
    <>
      <GlobalStyles />
      <div className="flex items-center justify-center min-h-screen bg-[#E5E5E5] py-10 font-sans">
        <div className={`relative w-[390px] h-[844px] rounded-[55px] shadow-[0_0_0_12px_#1a1a1a,0_0_0_14px_#333,0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-500 bg-[#FAFAF9]`}>
            
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[126px] h-[37px] bg-black rounded-[24px] z-[100] pointer-events-none flex items-center justify-end pr-4 shadow-sm">
                <div className="w-full h-full absolute inset-0 bg-black rounded-[24px]"></div>
                <div className="relative w-3 h-3 rounded-full bg-[#1a1a1a] shadow-[inset_0_0_3px_rgba(255,255,255,0.2)] border border-[#333]/40"></div>
            </div>

            <StatusBar />
            {toast && <Toast message={toast} />}

            <div className="w-full h-full relative">
                <BookingFlow 
                    provider={PROVIDER_DATA} 
                    showToast={showToastFn} 
                />
            </div>
            
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full z-[70] bg-[#1A1A1A]/90`}></div>
        </div>
      </div>
    </>
  );
}
