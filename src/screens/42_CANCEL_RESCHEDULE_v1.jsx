import React, { useState } from 'react';
import {
  ChevronLeft,
  Calendar,
  X,
  Clock,
  AlertCircle,
  Check,
  ChevronRight,
  Info,
  MessageCircle,
  ArrowRight
} from 'lucide-react';

/**
 * 42_CANCEL_RESCHEDULE_v1.jsx
 * Cancel / Reschedule booking flow.
 */

// --- FYLOS LOGO ---
const FylosLogo = ({
  textColor = '#000000',
  dotColor = '#FF6B35',
  fontSize = '2rem',
  className = ''
}) => (
  <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `calc(${fontSize} * 0.15)`, fontFamily: '"Nunito", sans-serif' }}>
    <span style={{ fontSize, fontWeight: 800, color: textColor, letterSpacing: '-0.5px', lineHeight: 1 }}>FYLOS</span>
    <div style={{ width: `calc(${fontSize} * 0.25)`, height: `calc(${fontSize} * 0.25)`, borderRadius: '50%', backgroundColor: dotColor }} />
  </div>
);

// --- THEME ---
const THEME = {
  colors: {
    accent: '#E85D2A', accentHover: '#D04A1C',
    primaryText: '#111111', secondaryText: '#6E6E73', tertiaryText: '#8E8E93',
    background: '#F9F9FB', surface: '#FFFFFF', surfaceAlt: '#F2F2F7',
    danger: '#FF3B30', success: '#00C060', warning: '#FF9500', info: '#007AFF', divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: { soft: '0 4px 20px rgba(0,0,0,0.03)', floating: '0 8px 24px rgba(0,0,0,0.08)' },
  motion: { tap: '120ms', fade: '200ms', tab: '240ms', spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
};

// --- MOCK DATA ---
const BOOKING = {
  service: 'Dog Walking',
  provider: { name: 'Sarah M.', avatar: 'https://i.pravatar.cc/100?img=47', rating: 4.9 },
  date: 'Tue, Mar 24', time: '10:00 AM',
  pet: { name: 'Buddy', breed: 'Golden Retriever' },
  price: '$25.00'
};

const WEEK_DAYS = [
  { day: 'Mon', date: 23, available: true }, { day: 'Tue', date: 24, available: true },
  { day: 'Wed', date: 25, available: true }, { day: 'Thu', date: 26, available: true },
  { day: 'Fri', date: 27, available: true }, { day: 'Sat', date: 28, available: false },
  { day: 'Sun', date: 29, available: false }
];

const TIME_SLOTS = [
  { time: '9:00 AM', available: true }, { time: '10:00 AM', available: false },
  { time: '11:00 AM', available: true }, { time: '12:00 PM', available: true },
  { time: '1:00 PM', available: true }, { time: '2:00 PM', available: false },
  { time: '3:00 PM', available: true }, { time: '4:00 PM', available: true }
];

const CANCEL_REASONS = ['Change of plans', 'Found another provider', 'Pet is unwell', 'Other'];

// --- BOOKING SUMMARY CARD ---
const BookingSummaryCard = () => (
  <div style={{
    backgroundColor: THEME.colors.surface, borderRadius: 20, padding: 20,
    boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)', margin: '0 20px 16px'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <img src={BOOKING.provider.avatar} alt={BOOKING.provider.name} style={{ width: 52, height: 52, borderRadius: THEME.radius.full, objectFit: 'cover' }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: THEME.colors.primaryText, marginBottom: 2 }}>{BOOKING.provider.name}</div>
        <div style={{ fontSize: 13, color: THEME.colors.secondaryText }}>{BOOKING.service}</div>
      </div>
      <div style={{ backgroundColor: THEME.colors.surfaceAlt, borderRadius: THEME.radius.small, padding: '4px 10px', fontSize: 13, fontWeight: 600, color: THEME.colors.accent }}>{BOOKING.price}</div>
    </div>
    <div style={{ height: 1, backgroundColor: THEME.colors.divider, margin: '16px 0' }} />
    <div style={{ display: 'flex', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Calendar size={15} color={THEME.colors.tertiaryText} />
        <span style={{ fontSize: 13, color: THEME.colors.secondaryText }}>{BOOKING.date}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Clock size={15} color={THEME.colors.tertiaryText} />
        <span style={{ fontSize: 13, color: THEME.colors.secondaryText }}>{BOOKING.time}</span>
      </div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
      <div style={{
        width: 24, height: 24, borderRadius: THEME.radius.full,
        background: 'linear-gradient(135deg, #FF7240, #E85D2A)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#fff', fontWeight: 700
      }}>{BOOKING.pet.name[0]}</div>
      <span style={{ fontSize: 13, color: THEME.colors.secondaryText }}>{BOOKING.pet.name} &middot; {BOOKING.pet.breed}</span>
    </div>
  </div>
);

// --- ACTION OPTION CARD ---
const ActionCard = ({ icon: Icon, title, subtitle, onClick, variant = 'default' }) => (
  <button onClick={onClick} style={{
    width: '100%', backgroundColor: THEME.colors.surface, borderRadius: 20, padding: 20,
    boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 16, textAlign: 'left',
    transition: `transform ${THEME.motion.tap} ${THEME.motion.spring}`
  }}>
    <div style={{
      width: 44, height: 44, borderRadius: 14,
      backgroundColor: variant === 'danger' ? 'rgba(255,59,48,0.06)' : THEME.colors.surfaceAlt,
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={20} color={variant === 'danger' ? THEME.colors.danger : THEME.colors.accent} />
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 15, fontWeight: 650, color: variant === 'danger' ? THEME.colors.danger : THEME.colors.primaryText, marginBottom: 2 }}>{title}</div>
      <div style={{ fontSize: 13, color: THEME.colors.tertiaryText }}>{subtitle}</div>
    </div>
    <ChevronRight size={16} color={THEME.colors.tertiaryText} />
  </button>
);

const ChoiceView = ({ onReschedule, onCancel }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 20px' }}>
    <ActionCard icon={Calendar} title="Reschedule" subtitle="Pick a new date and time" onClick={onReschedule} />
    <ActionCard icon={X} title="Cancel Booking" subtitle="Cancel this upcoming booking" onClick={onCancel} variant="danger" />
  </div>
);

const RescheduleView = ({ onConfirm }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  return (
    <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: THEME.colors.primaryText }}>March 2026</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'space-between' }}>
        {WEEK_DAYS.map((d) => {
          const isSelected = selectedDay === d.date;
          return (
            <button key={d.date} disabled={!d.available} onClick={() => d.available && setSelectedDay(d.date)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              padding: '10px 0', borderRadius: 14, border: 'none', cursor: d.available ? 'pointer' : 'default',
              backgroundColor: isSelected ? THEME.colors.accent : THEME.colors.surface,
              boxShadow: isSelected ? THEME.shadows.floating : THEME.shadows.soft,
              opacity: d.available ? 1 : 0.35, transition: `all ${THEME.motion.tap} ${THEME.motion.spring}`
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: isSelected ? 'rgba(255,255,255,0.7)' : THEME.colors.tertiaryText, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d.day}</span>
              <span style={{ fontSize: 17, fontWeight: 700, color: isSelected ? '#fff' : THEME.colors.primaryText }}>{d.date}</span>
              {d.date === 24 && !isSelected && <div style={{ width: 4, height: 4, borderRadius: THEME.radius.full, backgroundColor: THEME.colors.accent }} />}
            </button>
          );
        })}
      </div>
      {selectedDay && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 650, color: THEME.colors.primaryText, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={15} color={THEME.colors.tertiaryText} />Available times
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TIME_SLOTS.map((slot) => {
              const isSelected = selectedTime === slot.time;
              return (
                <button key={slot.time} disabled={!slot.available} onClick={() => slot.available && setSelectedTime(slot.time)} style={{
                  padding: '10px 16px', borderRadius: THEME.radius.full, border: 'none', fontSize: 13, fontWeight: 600,
                  cursor: slot.available ? 'pointer' : 'default',
                  backgroundColor: isSelected ? THEME.colors.accent : THEME.colors.surface,
                  color: isSelected ? '#fff' : slot.available ? THEME.colors.primaryText : THEME.colors.tertiaryText,
                  boxShadow: isSelected ? THEME.shadows.floating : THEME.shadows.soft,
                  opacity: slot.available ? 1 : 0.4, transition: `all ${THEME.motion.tap} ${THEME.motion.spring}`
                }}>{slot.time}</button>
              );
            })}
          </div>
        </div>
      )}
      {selectedDay && selectedTime && (
        <button onClick={onConfirm} style={{
          width: '100%', padding: '16px 0', borderRadius: THEME.radius.medium, border: 'none',
          background: 'linear-gradient(135deg, #FF7240, #E85D2A)', color: '#fff', fontSize: 16, fontWeight: 700,
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(232,93,42,0.3)',
          transition: `transform ${THEME.motion.tap} ${THEME.motion.spring}`
        }}>Confirm New Time</button>
      )}
    </div>
  );
};

const CancelView = ({ onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState(null);
  const [note, setNote] = useState('');
  return (
    <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: THEME.colors.primaryText }}>Reason for cancellation</div>
      <div style={{ backgroundColor: THEME.colors.surface, borderRadius: 20, boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        {CANCEL_REASONS.map((reason, i) => {
          const isSelected = selectedReason === reason;
          return (
            <button key={reason} onClick={() => setSelectedReason(reason)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
              border: 'none', backgroundColor: 'transparent', cursor: 'pointer',
              borderBottom: i < CANCEL_REASONS.length - 1 ? `1px solid ${THEME.colors.divider}` : 'none', textAlign: 'left'
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: THEME.radius.full,
                border: isSelected ? 'none' : `2px solid ${THEME.colors.divider}`,
                backgroundColor: isSelected ? THEME.colors.danger : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                transition: `all ${THEME.motion.tap}`
              }}>{isSelected && <Check size={13} color="#fff" strokeWidth={3} />}</div>
              <span style={{ fontSize: 15, fontWeight: isSelected ? 600 : 400, color: THEME.colors.primaryText }}>{reason}</span>
            </button>
          );
        })}
      </div>
      {selectedReason && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.secondaryText, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MessageCircle size={13} color={THEME.colors.tertiaryText} />Additional notes (optional)
          </div>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tell us more..." rows={3} style={{
            width: '100%', padding: 16, borderRadius: THEME.radius.medium, border: 'none',
            backgroundColor: THEME.colors.surface, boxShadow: THEME.shadows.soft, fontSize: 14,
            color: THEME.colors.primaryText, resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box'
          }} />
        </div>
      )}
      {selectedReason && (
        <button onClick={onConfirm} style={{
          width: '100%', padding: '16px 0', borderRadius: THEME.radius.medium, border: 'none',
          backgroundColor: 'rgba(255,59,48,0.05)', color: THEME.colors.danger, fontSize: 16, fontWeight: 700,
          cursor: 'pointer', transition: `transform ${THEME.motion.tap} ${THEME.motion.spring}`
        }}>Cancel Booking</button>
      )}
    </div>
  );
};

const DoneView = ({ type, onBack }) => {
  const isReschedule = type === 'reschedule';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 40px', textAlign: 'center', gap: 16 }}>
      <div style={{
        width: 64, height: 64, borderRadius: THEME.radius.full,
        backgroundColor: isReschedule ? 'rgba(0,192,96,0.08)' : 'rgba(255,59,48,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {isReschedule ? <Check size={28} color={THEME.colors.success} strokeWidth={2.5} /> : <X size={28} color={THEME.colors.danger} strokeWidth={2.5} />}
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: THEME.colors.primaryText }}>{isReschedule ? 'Booking Rescheduled' : 'Booking Cancelled'}</div>
      <div style={{ fontSize: 14, color: THEME.colors.secondaryText, lineHeight: 1.5 }}>
        {isReschedule ? 'Your booking with Sarah M. has been moved to the new time. She has been notified.' : 'Your booking has been cancelled. A refund will be processed within 3-5 business days.'}
      </div>
      <button onClick={onBack} style={{
        marginTop: 12, padding: '14px 32px', borderRadius: THEME.radius.full, border: 'none',
        background: 'linear-gradient(135deg, #FF7240, #E85D2A)', color: '#fff', fontSize: 15, fontWeight: 700,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(232,93,42,0.25)'
      }}>Back to Bookings <ArrowRight size={16} /></button>
    </div>
  );
};

const RefundNote = () => (
  <div style={{
    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 20px', margin: '0 20px',
    borderRadius: 14, backgroundColor: 'rgba(0,122,255,0.04)'
  }}>
    <Info size={16} color={THEME.colors.info} style={{ marginTop: 1, flexShrink: 0 }} />
    <span style={{ fontSize: 12, color: THEME.colors.secondaryText, lineHeight: 1.5 }}>
      Free cancellation up to 24 hours before the booking. Late cancellations may incur a fee of up to 50% of the service cost.
    </span>
  </div>
);

// --- MAIN COMPONENT ---
export default function Screen_42_CancelReschedule() {
  const [view, setView] = useState('choice');

  const headerTitle = { choice: 'Manage Booking', reschedule: 'Reschedule', cancel: 'Cancel Booking', reschedule_done: 'Manage Booking', cancel_done: 'Manage Booking' }[view];

  const handleBack = () => {
    if (view === 'reschedule' || view === 'cancel') setView('choice');
    else { window.location.href = '/'; }
  };

  const isDone = view === 'reschedule_done' || view === 'cancel_done';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
      <div className="relative" style={{
        width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
        overflow: 'hidden', backgroundColor: '#F9F9FB',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif'
      }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="0.5" fill="#111"/><rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="0.5" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#111"/><path d="M4.93 7.83a4.38 4.38 0 016.14 0" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/><path d="M2.4 5.3a7.88 7.88 0 0111.2 0" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="2.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="19" height="9" rx="1.5" fill="#111"/><path d="M24 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="absolute inset-0 overflow-y-auto" style={{ paddingTop: 54, paddingBottom: 40, display: 'flex', flexDirection: 'column' }}>
          {/* Spacer for floating header */}
          <div style={{ height: 52, flexShrink: 0 }} />

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', paddingBottom: 8 }}>
            {isDone ? (
              <DoneView type={view === 'reschedule_done' ? 'reschedule' : 'cancel'} onBack={() => setView('choice')} />
            ) : (
              <>
                <div style={{ paddingTop: 4 }}><BookingSummaryCard /></div>
                {view === 'choice' && (
                  <>
                    <ChoiceView onReschedule={() => setView('reschedule')} onCancel={() => setView('cancel')} />
                    <div style={{ height: 16 }} />
                    <RefundNote />
                  </>
                )}
                {view === 'reschedule' && <RescheduleView onConfirm={() => setView('reschedule_done')} />}
                {view === 'cancel' && (
                  <>
                    <CancelView onConfirm={() => setView('cancel_done')} />
                    <div style={{ height: 16 }} />
                    <RefundNote />
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            {/* Left: Back button */}
            <button
              onClick={handleBack}
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <ChevronLeft size={22} color="#111111" />
            </button>
            {/* Center: Title */}
            <h2 className="text-[17px] font-semibold text-[#111111]">{headerTitle}</h2>
            {/* Right: invisible spacer */}
            <div className="w-[44px]" />
          </div>
        </header>
      </div>
    </div>
  );
}
