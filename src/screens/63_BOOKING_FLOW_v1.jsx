import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Check,
  Calendar,
  Clock,
  MapPin,
  Star,
  Heart,
  ChevronRight,
  ArrowRight,
  Circle,
  X,
  CreditCard,
  MessageCircle,
  PawPrint,
  Plus,
  Home,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// THEME
// ---------------------------------------------------------------------------
const THEME = {
  colors: {
    accent: '#E85D2A',
    accentHover: '#D04A1C',
    primaryText: '#111111',
    secondaryText: '#6E6E73',
    tertiaryText: '#8E8E93',
    background: '#F9F9FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F2F7',
    danger: '#FF3B30',
    success: '#00C060',
    warning: '#FF9500',
    info: '#007AFF',
    divider: '#E5E5E5',
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)',
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34,1.56,0.64,1)',
  },
};

// ---------------------------------------------------------------------------
// GLOBAL STYLES
// ---------------------------------------------------------------------------
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .bf-screen {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: ${THEME.colors.background};
      color: ${THEME.colors.primaryText};
      overflow: hidden;
    }

    .bf-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .bf-scroll::-webkit-scrollbar { display: none; }

    .bf-tap {
      transition: opacity ${THEME.motion.tap} ease, transform ${THEME.motion.tap} ease;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
    }
    .bf-tap:active { opacity: 0.72; transform: scale(0.97); }

    .bf-primary-btn {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: ${THEME.radius.medium};
      background: linear-gradient(135deg, #FF7240 0%, ${THEME.colors.accent} 100%);
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: opacity ${THEME.motion.tap} ease, transform ${THEME.motion.tap} ease;
      user-select: none;
    }
    .bf-primary-btn:active { opacity: 0.85; transform: scale(0.98); }
    .bf-primary-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }

    .bf-secondary-btn {
      width: 100%;
      padding: 16px;
      border: 1.5px solid ${THEME.colors.divider};
      border-radius: ${THEME.radius.medium};
      background: ${THEME.colors.surface};
      color: ${THEME.colors.primaryText};
      font-size: 16px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: opacity ${THEME.motion.tap} ease, transform ${THEME.motion.tap} ease;
    }
    .bf-secondary-btn:active { opacity: 0.72; transform: scale(0.97); }

    /* Step slide animation */
    @keyframes bf-slide-in {
      from { opacity: 0; transform: translateX(40px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .bf-step-enter {
      animation: bf-slide-in ${THEME.motion.tab} ${THEME.motion.spring} both;
    }

    /* Success check animation */
    @keyframes bf-check-pop {
      0% { transform: scale(0); opacity: 0; }
      60% { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .bf-check-pop {
      animation: bf-check-pop 0.5s ${THEME.motion.spring} both;
    }

    /* Confetti dots */
    @keyframes bf-confetti-fall {
      0% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
      100% { opacity: 0; transform: translateY(120px) rotate(360deg) scale(0.3); }
    }
    .bf-confetti-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      animation: bf-confetti-fall 1.8s ease-out both;
    }
  `}</style>
);

// ---------------------------------------------------------------------------
// MOCK DATA
// ---------------------------------------------------------------------------
const PROVIDER = {
  name: 'Lukas F.',
  photo: 'https://i.pravatar.cc/150?img=12',
  rating: 4.9,
  reviews: 124,
  location: 'Zurich',
};

const SERVICES = [
  { id: 'walk30', label: '30 min Walk', price: 25, duration: '30 min', icon: '🐕' },
  { id: 'walk60', label: '60 min Walk', price: 40, duration: '60 min', icon: '🐕‍🦺' },
  { id: 'daycare', label: 'Day Care', price: 65, duration: 'Full day', icon: '🏠' },
  { id: 'overnight', label: 'Overnight', price: 85, duration: 'Overnight', icon: '🌙' },
];

const PETS = [
  { id: 'pet1', name: 'Luna', breed: 'Golden Retriever', photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=80&h=80' },
  { id: 'pet2', name: 'Milo', breed: 'French Bulldog', photo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=80&h=80' },
];

const MARCH_2026 = {
  year: 2026,
  month: 2, // March (0-indexed)
  daysInMonth: 31,
  firstDayOfWeek: 0, // Sunday
  available: [2, 3, 4, 5, 9, 10, 11, 12, 16, 17, 18, 19, 23, 24, 25, 26, 30, 31],
};

const TIME_SLOTS = {
  morning: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00', '11:30'],
  afternoon: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'],
  evening: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30'],
};

const PLATFORM_FEE = 3;

// ---------------------------------------------------------------------------
// STEP DOTS
// ---------------------------------------------------------------------------
const StepDots = ({ current, total }) => (
  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        style={{
          width: i === current ? 20 : 6,
          height: 6,
          borderRadius: THEME.radius.full,
          background: i === current ? THEME.colors.accent : THEME.colors.divider,
          transition: 'all 300ms ease',
        }}
      />
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// PROGRESS BAR (thin accent bar at top)
// ---------------------------------------------------------------------------
const ProgressBar = ({ step, total }) => (
  <div style={{ height: 3, background: THEME.colors.surfaceAlt, flexShrink: 0 }}>
    <div
      style={{
        height: '100%',
        width: `${((step + 1) / total) * 100}%`,
        background: `linear-gradient(90deg, #FF7240, ${THEME.colors.accent})`,
        borderRadius: '0 2px 2px 0',
        transition: 'width 400ms ease',
      }}
    />
  </div>
);

// ---------------------------------------------------------------------------
// HEADER
// ---------------------------------------------------------------------------
const Header = ({ title, step, total, onBack, showBack = true }) => (
  <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
    <div style={{ width: 40 }}>
      {showBack && (
        <button
          className="bf-tap"
          onClick={onBack}
          style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ChevronLeft size={24} color={THEME.colors.primaryText} strokeWidth={2} />
        </button>
      )}
    </div>
    <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.3px', color: THEME.colors.primaryText }}>{title}</span>
    <div style={{ width: 40, display: 'flex', justifyContent: 'flex-end' }}>
      <StepDots current={step} total={total} />
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// PROVIDER MINI CARD
// ---------------------------------------------------------------------------
const ProviderMiniCard = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: THEME.colors.surface,
    borderRadius: THEME.radius.medium,
    boxShadow: THEME.shadows.soft,
  }}>
    <img
      src={PROVIDER.photo}
      alt={PROVIDER.name}
      style={{ width: 40, height: 40, borderRadius: THEME.radius.full, objectFit: 'cover' }}
    />
    <div style={{ flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText }}>{PROVIDER.name}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
        <Star size={12} color="#FFB800" fill="#FFB800" />
        <span style={{ fontSize: 13, fontWeight: 500, color: THEME.colors.secondaryText }}>{PROVIDER.rating}</span>
        <span style={{ fontSize: 13, color: THEME.colors.tertiaryText }}>({PROVIDER.reviews})</span>
      </div>
    </div>
    <ChevronRight size={16} color={THEME.colors.tertiaryText} />
  </div>
);

// ---------------------------------------------------------------------------
// STEP 1: SELECT SERVICE
// ---------------------------------------------------------------------------
const Step1SelectService = ({ selectedService, onSelectService, onContinue }) => (
  <div className="bf-step-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div className="bf-scroll" style={{ flex: 1, padding: '0 20px 20px' }}>
      <ProviderMiniCard />

      <div style={{ marginTop: 24 }}>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', color: THEME.colors.primaryText }}>Select Service</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
        {SERVICES.map((service) => {
          const selected = selectedService === service.id;
          return (
            <button
              key={service.id}
              className="bf-tap"
              onClick={() => onSelectService(service.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: 16,
                background: THEME.colors.surface,
                borderRadius: THEME.radius.medium,
                border: selected ? `2px solid ${THEME.colors.accent}` : `2px solid transparent`,
                boxShadow: THEME.shadows.soft,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <span style={{ fontSize: 28 }}>{service.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText }}>{service.label}</div>
                <div style={{ fontSize: 13, color: THEME.colors.secondaryText, marginTop: 2 }}>{service.duration}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: THEME.colors.primaryText }}>CHF {service.price}</span>
                <div style={{
                  width: 22,
                  height: 22,
                  borderRadius: THEME.radius.full,
                  border: selected ? 'none' : `2px solid ${THEME.colors.divider}`,
                  background: selected ? THEME.colors.accent : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 200ms ease',
                }}>
                  {selected && <div style={{ width: 8, height: 8, borderRadius: THEME.radius.full, background: '#FFF' }} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>

    <div style={{ padding: '12px 20px 20px', flexShrink: 0 }}>
      <button className="bf-primary-btn" onClick={onContinue} disabled={!selectedService}>
        Continue
      </button>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// STEP 2: SELECT PET
// ---------------------------------------------------------------------------
const Step2SelectPet = ({ selectedPets, onTogglePet, specialInstructions, onChangeInstructions, onContinue }) => (
  <div className="bf-step-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <div className="bf-scroll" style={{ flex: 1, padding: '0 20px 20px' }}>
      <div>
        <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', color: THEME.colors.primaryText }}>Which pet?</span>
        <p style={{ fontSize: 15, color: THEME.colors.secondaryText, marginTop: 4 }}>Select one or more pets for this booking</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
        {PETS.map((pet) => {
          const selected = selectedPets.includes(pet.id);
          return (
            <button
              key={pet.id}
              className="bf-tap"
              onClick={() => onTogglePet(pet.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: 16,
                background: THEME.colors.surface,
                borderRadius: THEME.radius.medium,
                border: selected ? `2px solid ${THEME.colors.accent}` : `2px solid transparent`,
                boxShadow: THEME.shadows.soft,
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <img
                src={pet.photo}
                alt={pet.name}
                style={{ width: 48, height: 48, borderRadius: THEME.radius.full, objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText }}>{pet.name}</div>
                <div style={{ fontSize: 13, color: THEME.colors.secondaryText, marginTop: 2 }}>{pet.breed}</div>
              </div>
              <div style={{
                width: 22,
                height: 22,
                borderRadius: 6,
                border: selected ? 'none' : `2px solid ${THEME.colors.divider}`,
                background: selected ? THEME.colors.accent : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms ease',
              }}>
                {selected && <Check size={14} color="#FFF" strokeWidth={3} />}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 24 }}>
        <label style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: THEME.colors.secondaryText }}>
          Special Instructions (Optional)
        </label>
        <textarea
          value={specialInstructions}
          onChange={(e) => onChangeInstructions(e.target.value)}
          placeholder="Any special needs?"
          rows={3}
          style={{
            width: '100%',
            marginTop: 8,
            padding: 14,
            border: `1.5px solid ${THEME.colors.divider}`,
            borderRadius: 12,
            fontSize: 15,
            fontFamily: 'Inter, sans-serif',
            color: THEME.colors.primaryText,
            background: THEME.colors.surface,
            resize: 'none',
            outline: 'none',
          }}
        />
      </div>
    </div>

    <div style={{ padding: '12px 20px 20px', flexShrink: 0 }}>
      <button className="bf-primary-btn" onClick={onContinue} disabled={selectedPets.length === 0}>
        Continue
      </button>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// STEP 3: DATE & TIME
// ---------------------------------------------------------------------------
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MiniCalendar = ({ selectedDay, onSelectDay }) => {
  const { daysInMonth, firstDayOfWeek, available } = MARCH_2026;
  const today = 17;
  const blanks = Array(firstDayOfWeek).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const cells = [...blanks, ...days];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: THEME.colors.primaryText }}>March 2026</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {WEEKDAYS.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 500, color: THEME.colors.tertiaryText, padding: '4px 0' }}>
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`blank-${i}`} />;
          const isToday = day === today;
          const isAvailable = available.includes(day) && day >= today;
          const isSelected = day === selectedDay;
          const isPast = day < today;

          return (
            <button
              key={day}
              className="bf-tap"
              onClick={() => isAvailable && onSelectDay(day)}
              disabled={!isAvailable}
              style={{
                width: '100%',
                aspectRatio: '1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: isToday && !isSelected ? `1.5px solid ${THEME.colors.accent}` : 'none',
                borderRadius: THEME.radius.full,
                background: isSelected ? THEME.colors.accent : 'transparent',
                cursor: isAvailable ? 'pointer' : 'default',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
                fontWeight: isSelected || isToday ? 600 : 400,
                color: isSelected ? '#FFFFFF' : isPast || !isAvailable ? THEME.colors.tertiaryText : THEME.colors.primaryText,
                opacity: isPast ? 0.35 : 1,
                padding: 0,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const TimeSlotSection = ({ title, slots, selectedTime, onSelectTime }) => (
  <div style={{ marginTop: 16 }}>
    <span style={{ fontSize: 13, fontWeight: 500, color: THEME.colors.secondaryText }}>{title}</span>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
      {slots.map((t) => {
        const sel = t === selectedTime;
        return (
          <button
            key={t}
            className="bf-tap"
            onClick={() => onSelectTime(t)}
            style={{
              padding: '8px 16px',
              borderRadius: THEME.radius.full,
              border: sel ? 'none' : `1.5px solid ${THEME.colors.divider}`,
              background: sel ? THEME.colors.accent : THEME.colors.surface,
              color: sel ? '#FFFFFF' : THEME.colors.primaryText,
              fontSize: 14,
              fontWeight: 500,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  </div>
);

const Step3DateTime = ({ selectedDay, onSelectDay, selectedTime, onSelectTime, selectedService, onContinue }) => {
  const service = SERVICES.find((s) => s.id === selectedService);

  return (
    <div className="bf-step-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="bf-scroll" style={{ flex: 1, padding: '0 20px 20px' }}>
        <div>
          <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', color: THEME.colors.primaryText }}>When?</span>
          {service && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <Clock size={14} color={THEME.colors.secondaryText} />
              <span style={{ fontSize: 13, color: THEME.colors.secondaryText }}>Duration: {service.duration}</span>
            </div>
          )}
        </div>

        <div style={{
          marginTop: 20,
          padding: 16,
          background: THEME.colors.surface,
          borderRadius: 20,
          boxShadow: THEME.shadows.soft,
        }}>
          <MiniCalendar selectedDay={selectedDay} onSelectDay={onSelectDay} />
        </div>

        {selectedDay && (
          <div style={{ marginTop: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: THEME.colors.primaryText }}>
              Available Times
            </span>
            <TimeSlotSection title="Morning (8:00 - 12:00)" slots={TIME_SLOTS.morning} selectedTime={selectedTime} onSelectTime={onSelectTime} />
            <TimeSlotSection title="Afternoon (12:00 - 17:00)" slots={TIME_SLOTS.afternoon} selectedTime={selectedTime} onSelectTime={onSelectTime} />
            <TimeSlotSection title="Evening (17:00 - 21:00)" slots={TIME_SLOTS.evening} selectedTime={selectedTime} onSelectTime={onSelectTime} />
          </div>
        )}
      </div>

      <div style={{ padding: '12px 20px 20px', flexShrink: 0 }}>
        <button className="bf-primary-btn" onClick={onContinue} disabled={!selectedDay || !selectedTime}>
          Continue
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// STEP 4: REVIEW & CONFIRM
// ---------------------------------------------------------------------------
const SummaryRow = ({ icon, label, value, bold }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0' }}>
    <div style={{ width: 20, display: 'flex', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
      {icon}
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: THEME.colors.tertiaryText }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: bold ? 600 : 400, color: THEME.colors.primaryText, marginTop: 2 }}>{value}</div>
    </div>
  </div>
);

const Step4Review = ({ selectedService, selectedPets, selectedDay, selectedTime, onConfirm }) => {
  const service = SERVICES.find((s) => s.id === selectedService);
  const pets = PETS.filter((p) => selectedPets.includes(p.id));
  const total = (service?.price || 0) + PLATFORM_FEE;
  const dateStr = `March ${selectedDay}, 2026`;

  return (
    <div className="bf-step-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="bf-scroll" style={{ flex: 1, padding: '0 20px 20px' }}>
        <div>
          <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', color: THEME.colors.primaryText }}>Confirm Booking</span>
        </div>

        {/* Summary card */}
        <div style={{
          marginTop: 20,
          padding: 20,
          background: THEME.colors.surface,
          borderRadius: 20,
          boxShadow: THEME.shadows.soft,
        }}>
          {/* Provider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 14 }}>
            <img src={PROVIDER.photo} alt={PROVIDER.name} style={{ width: 40, height: 40, borderRadius: THEME.radius.full, objectFit: 'cover' }} />
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{PROVIDER.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 1 }}>
                <Star size={11} color="#FFB800" fill="#FFB800" />
                <span style={{ fontSize: 12, color: THEME.colors.secondaryText }}>{PROVIDER.rating}</span>
              </div>
            </div>
          </div>

          <div style={{ height: 1, background: THEME.colors.divider }} />

          <SummaryRow
            icon={<PawPrint size={16} color={THEME.colors.accent} />}
            label="Service"
            value={`${service?.label} (${service?.duration})`}
          />
          <SummaryRow
            icon={<Heart size={16} color={THEME.colors.accent} />}
            label="Pet(s)"
            value={pets.map((p) => p.name).join(', ')}
          />
          <SummaryRow
            icon={<Calendar size={16} color={THEME.colors.accent} />}
            label="Date"
            value={dateStr}
          />
          <SummaryRow
            icon={<Clock size={16} color={THEME.colors.accent} />}
            label="Time"
            value={selectedTime}
          />
          <SummaryRow
            icon={<MapPin size={16} color={THEME.colors.accent} />}
            label="Location"
            value="Pickup from home"
          />

          <div style={{ height: 1, background: THEME.colors.divider, marginTop: 6 }} />

          {/* Price breakdown */}
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: THEME.colors.secondaryText }}>{service?.label}</span>
              <span style={{ fontSize: 14, color: THEME.colors.primaryText }}>CHF {service?.price}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: THEME.colors.secondaryText }}>Platform fee</span>
              <span style={{ fontSize: 14, color: THEME.colors.primaryText }}>CHF {PLATFORM_FEE}</span>
            </div>
            <div style={{ height: 1, background: THEME.colors.divider }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: THEME.colors.primaryText }}>Total</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: THEME.colors.primaryText }}>CHF {total}</span>
            </div>
          </div>
        </div>

        {/* Payment method */}
        <div style={{
          marginTop: 16,
          padding: 16,
          background: THEME.colors.surface,
          borderRadius: THEME.radius.medium,
          boxShadow: THEME.shadows.soft,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <div style={{
            width: 40,
            height: 28,
            borderRadius: 6,
            background: '#1A1F71',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CreditCard size={16} color="#FFFFFF" />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 500, color: THEME.colors.primaryText }}>Visa •••• 4242</span>
          </div>
          <button className="bf-tap" style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            <span style={{ fontSize: 14, fontWeight: 500, color: THEME.colors.accent }}>Change</span>
          </button>
        </div>

        {/* Cancellation policy */}
        <p style={{ fontSize: 13, color: THEME.colors.secondaryText, marginTop: 16, lineHeight: 1.5 }}>
          Free cancellation up to 24 hours before the booking. Late cancellations may incur a fee of up to 50% of the service price.
        </p>
      </div>

      <div style={{ padding: '12px 20px 20px', flexShrink: 0 }}>
        <button className="bf-primary-btn" onClick={onConfirm}>
          Confirm & Pay CHF {(service?.price || 0) + PLATFORM_FEE}
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// STEP 5: CONFIRMATION (SUCCESS)
// ---------------------------------------------------------------------------
const ConfettiDots = () => {
  const colors = ['#FF7240', '#E85D2A', '#FFB800', '#00C060', '#007AFF', '#FF3B30'];
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    top: `${5 + Math.random() * 30}%`,
    color: colors[i % colors.length],
    delay: `${Math.random() * 0.6}s`,
    size: 4 + Math.random() * 5,
  }));

  return (
    <>
      {dots.map((d) => (
        <div
          key={d.id}
          className="bf-confetti-dot"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            background: d.color,
            animationDelay: d.delay,
          }}
        />
      ))}
    </>
  );
};

const Step5Confirmation = ({ selectedService, selectedTime, selectedDay, onMessage, onHome }) => {
  const service = SERVICES.find((s) => s.id === selectedService);
  const dateStr = `March ${selectedDay}, 2026`;

  return (
    <div className="bf-step-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <ConfettiDots />

      <div className="bf-scroll" style={{ flex: 1, padding: '0 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Check circle */}
        <div
          className="bf-check-pop"
          style={{
            width: 80,
            height: 80,
            borderRadius: THEME.radius.full,
            background: `linear-gradient(135deg, #FF7240 0%, ${THEME.colors.accent} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(232,93,42,0.3)',
          }}
        >
          <Check size={40} color="#FFFFFF" strokeWidth={3} />
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px', color: THEME.colors.primaryText, marginTop: 24 }}>
          Booking Confirmed!
        </h2>

        <div style={{
          marginTop: 8,
          padding: '6px 14px',
          background: THEME.colors.surfaceAlt,
          borderRadius: THEME.radius.full,
          fontSize: 14,
          fontWeight: 600,
          color: THEME.colors.secondaryText,
          letterSpacing: '0.02em',
        }}>
          #FYL-2847
        </div>

        {/* Summary mini */}
        <div style={{
          marginTop: 24,
          padding: 20,
          background: THEME.colors.surface,
          borderRadius: 20,
          boxShadow: THEME.shadows.soft,
          width: '100%',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <PawPrint size={16} color={THEME.colors.accent} />
            <span style={{ fontSize: 15, fontWeight: 500, color: THEME.colors.primaryText }}>{service?.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Star size={16} color={THEME.colors.accent} />
            <span style={{ fontSize: 15, fontWeight: 500, color: THEME.colors.primaryText }}>{PROVIDER.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calendar size={16} color={THEME.colors.accent} />
            <span style={{ fontSize: 15, fontWeight: 500, color: THEME.colors.primaryText }}>{dateStr} at {selectedTime}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0, position: 'relative', zIndex: 1 }}>
        <button className="bf-secondary-btn" onClick={onMessage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <MessageCircle size={18} color={THEME.colors.primaryText} />
          Message Provider
        </button>
        <button className="bf-primary-btn" onClick={onHome} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Home size={18} color="#FFFFFF" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// MAIN SCREEN
// ---------------------------------------------------------------------------
const BookingFlowScreen = () => {
  const [step, setStep] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedPets, setSelectedPets] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const TOTAL_STEPS = 5;

  const handleTogglePet = (petId) => {
    setSelectedPets((prev) =>
      prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]
    );
  };

  const goNext = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const goBack = () => {
    if (step === 0) {
      window.location.href = '/provider-detail';
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  };
  const goHome = () => {
    window.location.href = '/';
  };

  const stepTitles = ['Book Service', 'Select Pet', 'Date & Time', 'Review', 'Confirmed'];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#F9F9FB', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="7" width="3" height="5" rx="1" fill="#111"/><rect x="4.5" y="5" width="3" height="7" rx="1" fill="#111"/><rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#111"/><path d="M4.75 7.75a4.75 4.75 0 016.5 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 5a8 8 0 0112 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="12" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="#111"/><path d="M24 4v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Floating Header (hidden on success step) */}
        {step < 4 && (
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              {/* Left: Back button */}
              <button
                onClick={goBack}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              >
                <ChevronLeft size={22} color="#111111" />
              </button>
              {/* Center: Title */}
              <h2 className="text-[17px] font-semibold text-[#111111]">{stepTitles[step]}</h2>
              {/* Right: Step dots */}
              <div className="w-[44px] flex justify-end">
                <StepDots current={step} total={TOTAL_STEPS} />
              </div>
            </div>
          </header>
        )}

        {/* Screen content */}
        <div className="bf-screen" style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 54,
          paddingBottom: 20,
        }}>
          {/* Progress bar */}
          <ProgressBar step={step} total={TOTAL_STEPS} />

          {/* Spacer for floating header */}
          {step < 4 && <div style={{ height: 52, flexShrink: 0 }} />}

          {/* Step content */}
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }} key={step}>
            {step === 0 && (
              <Step1SelectService
                selectedService={selectedService}
                onSelectService={setSelectedService}
                onContinue={goNext}
              />
            )}
            {step === 1 && (
              <Step2SelectPet
                selectedPets={selectedPets}
                onTogglePet={handleTogglePet}
                specialInstructions={specialInstructions}
                onChangeInstructions={setSpecialInstructions}
                onContinue={goNext}
              />
            )}
            {step === 2 && (
              <Step3DateTime
                selectedDay={selectedDay}
                onSelectDay={setSelectedDay}
                selectedTime={selectedTime}
                onSelectTime={setSelectedTime}
                selectedService={selectedService}
                onContinue={goNext}
              />
            )}
            {step === 3 && (
              <Step4Review
                selectedService={selectedService}
                selectedPets={selectedPets}
                selectedDay={selectedDay}
                selectedTime={selectedTime}
                onConfirm={goNext}
              />
            )}
            {step === 4 && (
              <Step5Confirmation
                selectedService={selectedService}
                selectedTime={selectedTime}
                selectedDay={selectedDay}
                onMessage={() => window.location.href = '/chat'}
                onHome={goHome}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default BookingFlowScreen;