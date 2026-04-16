import React, { useState } from 'react';
import {
  ChevronLeft, Check, Calendar, Clock, MapPin, Star,
  Heart, ChevronRight, ArrowRight, CreditCard,
  MessageCircle, PawPrint,
} from 'lucide-react';

const PROVIDER = {
  name: 'Lukas F.',
  photo: 'https://i.pravatar.cc/150?img=12',
  rating: 4.9,
  reviews: 124,
  location: 'Zurich',
};

const SERVICES = [
  { id: 'walk30', label: '30 min Walk', price: 25, duration: '30 min', icon: 'walk-short' },
  { id: 'walk60', label: '60 min Walk', price: 40, duration: '60 min', icon: 'walk-long' },
  { id: 'daycare', label: 'Day Care', price: 65, duration: 'Full day', icon: 'daycare' },
  { id: 'overnight', label: 'Overnight', price: 85, duration: 'Overnight', icon: 'overnight' },
];

const PETS = [
  { id: 'pet1', name: 'Luna', breed: 'Golden Retriever', photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=80&h=80' },
  { id: 'pet2', name: 'Milo', breed: 'French Bulldog', photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=80&h=80' },
];

const MARCH_2026 = {
  year: 2026, month: 2, daysInMonth: 31, firstDayOfWeek: 0,
  available: [2, 3, 4, 5, 9, 10, 11, 12, 16, 17, 18, 19, 23, 24, 25, 26, 30, 31],
};

const TIME_SLOTS = {
  morning: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30'],
  afternoon: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
  evening: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
};

const PLATFORM_FEE = 3;
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const TOTAL_STEPS = 5;

const BookingFlowScreen = () => {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPets, setSelectedPets] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTogglePet = (petId) => {
    setSelectedPets(prev => prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]);
  };
  const goNext = () => setStep(s => Math.min(s + 1, TOTAL_STEPS - 1));
  const goBack = () => { if (step === 0) { window.history.back(); return; } setStep(s => Math.max(s - 1, 0)); };

  const stepTitles = ['Book Service', 'Select Pet', 'Date & Time', 'Review', 'Confirmed'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .bf-scroll::-webkit-scrollbar { display: none; }
        .bf-scroll { scrollbar-width: none; }
        @keyframes bf-slide-in { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes bf-check-pop { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes bf-confetti { 0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); } 100% { opacity: 0; transform: translateY(120px) rotate(360deg) scale(0.3); } }
      `}</style>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#F7F5F2', padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <div className="relative" style={{
          width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
          overflow: 'hidden', backgroundColor: '#F7F5F2',
        }}>
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Floating Header (hidden on success) */}
          {step < 4 && (
            <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
              <div className="flex justify-between items-center w-full pointer-events-auto">
                <button
                  onClick={goBack}
                  className="w-[44px] h-[44px] flex items-center justify-center bg-[#F3EFEB] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
                >
                  <ChevronLeft size={22} color="#111111" />
                </button>
                <h2 className="text-[17px] font-semibold text-[#111111]">{stepTitles[step]}</h2>
                <div className="w-[44px] flex justify-end">
                  <StepIndicator current={step} total={TOTAL_STEPS} />
                </div>
              </div>
            </header>
          )}

          {/* Progress Bar */}
          <div className="absolute top-0 left-0 right-0 z-30" style={{ paddingTop: 100 }}>
            <div style={{ height: 3, background: '#EDE8E2' }}>
              <div style={{
                height: '100%', width: `${((step + 1) / TOTAL_STEPS) * 100}%`,
                background: '#E85D2A',
                borderRadius: '0 2px 2px 0', transition: 'width 400ms ease',
              }} />
            </div>
          </div>

          {/* Screen content */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', paddingTop: 103, paddingBottom: 20 }}>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }} key={step}>
              {step === 0 && (
                <Step1
                  selectedService={selectedService}
                  onSelectService={setSelectedService}
                  onContinue={goNext}
                />
              )}
              {step === 1 && (
                <Step2
                  selectedPets={selectedPets}
                  onTogglePet={handleTogglePet}
                  specialInstructions={specialInstructions}
                  onChangeInstructions={setSpecialInstructions}
                  onContinue={goNext}
                />
              )}
              {step === 2 && (
                <Step3
                  selectedDay={selectedDay} onSelectDay={setSelectedDay}
                  selectedTime={selectedTime} onSelectTime={setSelectedTime}
                  selectedService={selectedService} onContinue={goNext}
                />
              )}
              {step === 3 && (
                <Step4
                  selectedService={selectedService} selectedPets={selectedPets}
                  selectedDay={selectedDay} selectedTime={selectedTime}
                  onConfirm={goNext}
                />
              )}
              {step === 4 && (
                <Step5
                  selectedService={selectedService}
                  selectedTime={selectedTime} selectedDay={selectedDay}
                  onHome={() => window.history.back()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingFlowScreen;

/* ── Step Indicator ── */
function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{
          width: i === current ? 20 : 6, height: 6, borderRadius: 9999,
          background: i === current ? '#E85D2A' : i < current ? '#E85D2A' : 'rgba(0,0,0,0.08)',
          opacity: i < current ? 0.4 : 1,
          transition: 'all 300ms ease',
        }} />
      ))}
    </div>
  );
}

/* ── Step 1: Select Service ── */
function Step1({ selectedService, onSelectService, onContinue }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', animation: 'bf-slide-in 240ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
      <div className="bf-scroll" style={{ flex: 1, padding: '0 20px 20px', overflowY: 'auto' }}>
        {/* Provider Mini */}
        <div className="bg-[#F3EFEB] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)] flex items-center gap-3">
          <img src={PROVIDER.photo} alt={PROVIDER.name} className="w-10 h-10 rounded-full object-cover" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="text-[15px] font-semibold text-[#111111]">{PROVIDER.name}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={12} fill="#E85D2A" stroke="#E85D2A" />
              <span className="text-[13px] font-medium text-[#6E6058]">{PROVIDER.rating}</span>
              <span className="text-[13px] text-[#A09A94]">({PROVIDER.reviews})</span>
            </div>
          </div>
          <ChevronRight size={16} className="text-[#A09A94]" />
        </div>

        <div className="mt-6">
          <span className="text-[22px] font-semibold text-[#111111]" style={{ letterSpacing: '-0.5px' }}>Select Service</span>
        </div>

        <div className="flex flex-col gap-3.5 mt-4">
          {SERVICES.map(service => {
            const selected = selectedService === service.id;
            return (
              <button
                key={service.id}
                onClick={() => onSelectService(service.id)}
                className="active:scale-[0.97] transition-all duration-[120ms]"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 20,
                  background: '#F3EFEB', borderRadius: 20,
                  border: selected ? '2px solid #E85D2A' : '1px solid rgba(0,0,0,0.03)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                <div className="w-[34px] h-[34px] rounded-full bg-[#F3EFEB] flex items-center justify-center shrink-0">
                  <PawPrint size={17} className="text-[#6E6058]" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-[15px] font-semibold text-[#111111]">{service.label}</div>
                  <div className="text-[13px] text-[#6E6058] mt-0.5">{service.duration}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[16px] font-semibold text-[#111111]">CHF {service.price}</span>
                  <div style={{
                    width: 22, height: 22, borderRadius: 9999,
                    border: selected ? 'none' : '2px solid rgba(0,0,0,0.08)',
                    background: selected ? '#E85D2A' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 200ms ease',
                  }}>
                    {selected && <div style={{ width: 8, height: 8, borderRadius: 9999, background: '#FFF' }} />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ padding: '12px 20px 20px', flexShrink: 0 }}>
        <PrimaryButton onClick={onContinue} disabled={!selectedService}>Continue</PrimaryButton>
      </div>
    </div>
  );
}

/* ── Step 2: Select Pet ── */
function Step2({ selectedPets, onTogglePet, specialInstructions, onChangeInstructions, onContinue }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', animation: 'bf-slide-in 240ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
      <div className="bf-scroll" style={{ flex: 1, padding: '0 20px 20px', overflowY: 'auto' }}>
        <div>
          <span className="text-[22px] font-semibold text-[#111111]" style={{ letterSpacing: '-0.5px' }}>Which pet?</span>
          <p className="text-[15px] text-[#6E6058] mt-1">Select one or more pets for this booking</p>
        </div>

        <div className="flex flex-col gap-3.5 mt-5">
          {PETS.map(pet => {
            const selected = selectedPets.includes(pet.id);
            return (
              <button
                key={pet.id}
                onClick={() => onTogglePet(pet.id)}
                className="active:scale-[0.97] transition-all duration-[120ms]"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: 20,
                  background: '#F3EFEB', borderRadius: 20,
                  border: selected ? '2px solid #E85D2A' : '1px solid rgba(0,0,0,0.03)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                }}
              >
                <img src={pet.photo} alt={pet.name} className="w-12 h-12 rounded-full object-cover" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="text-[15px] font-semibold text-[#111111]">{pet.name}</div>
                  <div className="text-[13px] text-[#6E6058] mt-0.5">{pet.breed}</div>
                </div>
                <div style={{
                  width: 22, height: 22, borderRadius: 6,
                  border: selected ? 'none' : '2px solid rgba(0,0,0,0.08)',
                  background: selected ? '#E85D2A' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 200ms ease',
                }}>
                  {selected && <Check size={14} color="#FFF" strokeWidth={3} />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6">
          <label className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest">
            Special Instructions (Optional)
          </label>
          <textarea
            value={specialInstructions}
            onChange={e => onChangeInstructions(e.target.value)}
            placeholder="Any special needs?"
            rows={3}
            className="focus:outline-none focus:border-[#E85D2A] focus:ring-4 focus:ring-[#E85D2A]/10 transition-all duration-200"
            style={{
              width: '100%', marginTop: 8, padding: 14,
              border: '1px solid rgba(0,0,0,0.04)', borderRadius: 16,
              fontSize: 15, color: '#111111', background: '#F7F5F2',
              resize: 'none', boxSizing: 'border-box',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          />
        </div>
      </div>
      <div style={{ padding: '12px 20px 20px', flexShrink: 0 }}>
        <PrimaryButton onClick={onContinue} disabled={selectedPets.length === 0}>Continue</PrimaryButton>
      </div>
    </div>
  );
}

/* ── Step 3: Date & Time ── */
function Step3({ selectedDay, onSelectDay, selectedTime, onSelectTime, selectedService, onContinue }) {
  const service = SERVICES.find(s => s.id === selectedService);
  const { daysInMonth, firstDayOfWeek, available } = MARCH_2026;
  const today = 17;
  const blanks = Array(firstDayOfWeek).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const cells = [...blanks, ...days];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', animation: 'bf-slide-in 240ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
      <div className="bf-scroll" style={{ flex: 1, padding: '0 20px 20px', overflowY: 'auto' }}>
        <div>
          <span className="text-[22px] font-semibold text-[#111111]" style={{ letterSpacing: '-0.5px' }}>When?</span>
          {service && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <Clock size={14} className="text-[#6E6058]" />
              <span className="text-[13px] text-[#6E6058]">Duration: {service.duration}</span>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="bg-[#F3EFEB] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)] mt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[16px] font-semibold text-[#111111]">March 2026</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {WEEKDAYS.map(d => (
              <div key={d} className="text-center text-[12px] font-medium text-[#A09A94]" style={{ padding: '4px 0' }}>{d}</div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={`b-${i}`} />;
              const isToday = day === today;
              const isAvailable = available.includes(day) && day >= today;
              const isSelected = day === selectedDay;
              const isPast = day < today;
              return (
                <button
                  key={day}
                  onClick={() => isAvailable && onSelectDay(day)}
                  disabled={!isAvailable}
                  className="active:scale-[0.97] transition-all duration-[120ms]"
                  style={{
                    width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: isToday && !isSelected ? '1.5px solid #E85D2A' : 'none',
                    borderRadius: 9999,
                    background: isSelected ? '#E85D2A' : 'transparent',
                    cursor: isAvailable ? 'pointer' : 'default',
                    fontSize: 14, fontWeight: isSelected || isToday ? 600 : 400,
                    color: isSelected ? '#FFFFFF' : isPast || !isAvailable ? '#A09A94' : '#111111',
                    opacity: isPast ? 0.35 : 1, padding: 0,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >{day}</button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDay && (
          <div className="mt-5">
            <span className="text-[16px] font-semibold text-[#111111]">Available Times</span>
            <TimeSection title="Morning (8:00 - 12:00)" slots={TIME_SLOTS.morning} selected={selectedTime} onSelect={onSelectTime} />
            <TimeSection title="Afternoon (12:00 - 17:00)" slots={TIME_SLOTS.afternoon} selected={selectedTime} onSelect={onSelectTime} />
            <TimeSection title="Evening (17:00 - 21:00)" slots={TIME_SLOTS.evening} selected={selectedTime} onSelect={onSelectTime} />
          </div>
        )}
      </div>
      <div style={{ padding: '12px 20px 20px', flexShrink: 0 }}>
        <PrimaryButton onClick={onContinue} disabled={!selectedDay || !selectedTime}>Continue</PrimaryButton>
      </div>
    </div>
  );
}

function TimeSection({ title, slots, selected, onSelect }) {
  return (
    <div className="mt-4">
      <span className="text-[13px] font-medium text-[#6E6058]">{title}</span>
      <div className="flex flex-wrap gap-2 mt-2">
        {slots.map(t => {
          const sel = t === selected;
          return (
            <button
              key={t}
              onClick={() => onSelect(t)}
              className="active:scale-[0.96] transition-all duration-[120ms]"
              style={{
                padding: '8px 16px', borderRadius: 9999,
                border: sel ? 'none' : '1px solid rgba(0,0,0,0.06)',
                background: sel ? '#E85D2A' : '#F3EFEB',
                color: sel ? '#FFFFFF' : '#111111',
                fontSize: 14, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >{t}</button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Step 4: Review & Confirm ── */
function Step4({ selectedService, selectedPets, selectedDay, selectedTime, onConfirm }) {
  const service = SERVICES.find(s => s.id === selectedService);
  const pets = PETS.filter(p => selectedPets.includes(p.id));
  const total = (service?.price || 0) + PLATFORM_FEE;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', animation: 'bf-slide-in 240ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
      <div className="bf-scroll" style={{ flex: 1, padding: '0 20px 20px', overflowY: 'auto' }}>
        <span className="text-[22px] font-semibold text-[#111111]" style={{ letterSpacing: '-0.5px' }}>Confirm Booking</span>

        <div className="bg-[#F3EFEB] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)] mt-5">
          {/* Provider */}
          <div className="flex items-center gap-3 pb-3.5">
            <img src={PROVIDER.photo} alt={PROVIDER.name} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <div className="text-[15px] font-semibold text-[#111111]">{PROVIDER.name}</div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} fill="#E85D2A" stroke="#E85D2A" />
                <span className="text-[12px] text-[#6E6058]">{PROVIDER.rating}</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-black/[0.04]" />

          <SummaryRow icon={<PawPrint size={16} color="#E85D2A" />} label="Service" value={`${service?.label} (${service?.duration})`} />
          <SummaryRow icon={<Heart size={16} color="#E85D2A" />} label="Pet(s)" value={pets.map(p => p.name).join(', ')} />
          <SummaryRow icon={<Calendar size={16} color="#E85D2A" />} label="Date" value={`March ${selectedDay}, 2026`} />
          <SummaryRow icon={<Clock size={16} color="#E85D2A" />} label="Time" value={selectedTime} />
          <SummaryRow icon={<MapPin size={16} color="#E85D2A" />} label="Location" value="Pickup from home" />

          <div className="h-px bg-black/[0.04] mt-1.5" />

          <div className="flex flex-col gap-2 mt-3.5">
            <div className="flex justify-between">
              <span className="text-[15px] text-[#6E6058]">{service?.label}</span>
              <span className="text-[15px] text-[#111111]">CHF {service?.price}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[15px] text-[#6E6058]">Platform fee</span>
              <span className="text-[15px] text-[#111111]">CHF {PLATFORM_FEE}</span>
            </div>
            <div className="h-px bg-black/[0.04]" />
            <div className="flex justify-between">
              <span className="text-[16px] font-semibold text-[#111111]">Total</span>
              <span className="text-[16px] font-semibold text-[#111111]">CHF {total}</span>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-[#F3EFEB] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)] mt-3.5 flex items-center gap-3">
          <div style={{
            width: 40, height: 28, borderRadius: 6, background: '#1A1F71',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CreditCard size={16} color="#FFFFFF" />
          </div>
          <div style={{ flex: 1 }}>
            <span className="text-[15px] font-medium text-[#111111]">Visa 4242</span>
          </div>
          <button className="active:scale-[0.97] transition-all duration-[120ms]" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            <span className="text-[13px] font-medium text-[#E85D2A]">Change</span>
          </button>
        </div>

        <p className="text-[13px] text-[#6E6058] mt-4" style={{ lineHeight: 1.5 }}>
          Free cancellation up to 24 hours before the booking. Late cancellations may incur a fee of up to 50% of the service price.
        </p>
      </div>
      <div style={{ padding: '12px 20px 20px', flexShrink: 0 }}>
        <PrimaryButton onClick={onConfirm}>Confirm & Pay CHF {(service?.price || 0) + PLATFORM_FEE}</PrimaryButton>
      </div>
    </div>
  );
}

function SummaryRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3" style={{ padding: '10px 0' }}>
      <div className="w-5 flex justify-center shrink-0 mt-0.5">{icon}</div>
      <div style={{ flex: 1 }}>
        <div className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest">{label}</div>
        <div className="text-[15px] text-[#111111] mt-0.5">{value}</div>
      </div>
    </div>
  );
}

/* ── Step 5: Confirmation ── */
function Step5({ selectedService, selectedTime, selectedDay, onHome }) {
  const service = SERVICES.find(s => s.id === selectedService);
  const confettiColors = ['#E85D2A', '#E85D2A', '#FFB800', '#34C759', '#007AFF', '#FF3B30'];
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i, left: `${10 + Math.random() * 80}%`, top: `${5 + Math.random() * 30}%`,
    color: confettiColors[i % confettiColors.length],
    delay: `${Math.random() * 0.6}s`, size: 4 + Math.random() * 5,
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden', animation: 'bf-slide-in 240ms cubic-bezier(0.34,1.56,0.64,1) both' }}>
      {/* Confetti */}
      {dots.map(d => (
        <div key={d.id} style={{
          position: 'absolute', width: d.size, height: d.size, borderRadius: '50%',
          left: d.left, top: d.top, background: d.color,
          animation: `bf-confetti 1.8s ease-out ${d.delay} both`,
        }} />
      ))}

      <div className="bf-scroll" style={{
        flex: 1, padding: '0 20px 20px', overflowY: 'auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', position: 'relative', zIndex: 1,
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: 9999,
          background: '#E85D2A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(232,93,42,0.3)',
          animation: 'bf-check-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) both',
        }}>
          <Check size={40} color="#FFFFFF" strokeWidth={3} />
        </div>

        <h2 className="text-[22px] font-semibold text-[#111111] mt-6" style={{ letterSpacing: '-0.5px' }}>Booking Confirmed!</h2>

        <div className="mt-2 px-3.5 py-1.5 bg-[#F3EFEB] rounded-full text-[13px] font-semibold text-[#6E6058]">#FYL-2847</div>

        <div className="bg-[#F3EFEB] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)] w-full text-left mt-6">
          <div className="flex items-center gap-2.5 mb-3">
            <PawPrint size={16} color="#E85D2A" />
            <span className="text-[15px] font-medium text-[#111111]">{service?.label}</span>
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <Star size={16} color="#E85D2A" />
            <span className="text-[15px] font-medium text-[#111111]">{PROVIDER.name}</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Calendar size={16} color="#E85D2A" />
            <span className="text-[15px] font-medium text-[#111111]">March {selectedDay}, 2026 at {selectedTime}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <button
          className="active:scale-[0.97] transition-all duration-[120ms]"
          style={{
            width: '100%', padding: 16, borderRadius: 14,
            border: '1px solid #EDE8E2', background: '#F3EFEB',
            color: '#111111', fontSize: 16, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          <MessageCircle size={18} color="#111111" />Message Provider
        </button>
        <PrimaryButton onClick={onHome}>
          <ArrowRight size={18} color="#FFFFFF" />Back to Home
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ── Primary Button ── */
function PrimaryButton({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="active:scale-[0.97] transition-all duration-[120ms]"
      style={{
        width: '100%', padding: 16, borderRadius: 14, border: 'none',
        background: disabled ? '#F3EFEB' : '#111',
        color: disabled ? '#A09A94' : '#FFFFFF',
        boxShadow: disabled ? 'none' : '0 4px 20px rgba(0,0,0,0.12)',
        fontSize: 16, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >{children}</button>
  );
}
