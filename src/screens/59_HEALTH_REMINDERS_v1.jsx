import React, { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  Heart,
  Shield,
  Clock,
  Check,
  Calendar,
  Bell,
  AlertTriangle,
  X,
  ChevronRight,
  Star,
  Circle,
  ArrowRight,
  PawPrint,
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
    divider: '#E5E5E5',
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
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

    .hr-screen {
      font-family: 'Inter', 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: ${THEME.colors.background};
      color: ${THEME.colors.primaryText};
      overflow: hidden;
    }

    .hr-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .hr-scroll::-webkit-scrollbar { display: none; }

    .hr-tap {
      transition: opacity ${THEME.motion.tap} ease, transform ${THEME.motion.tap} ease;
      cursor: pointer;
    }
    .hr-tap:active { opacity: 0.7; transform: scale(0.97); }

    .hr-fade {
      animation: hrFadeIn ${THEME.motion.fade} ease forwards;
    }
    @keyframes hrFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .hr-card {
      background: ${THEME.colors.surface};
      border-radius: 20px;
      padding: 20px;
      box-shadow: ${THEME.shadows.soft};
      margin-bottom: 12px;
    }

    .hr-section-title {
      font-size: 13px;
      font-weight: 600;
      color: ${THEME.colors.tertiaryText};
      letter-spacing: 0.5px;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .hr-type-pill {
      padding: 8px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1.5px solid ${THEME.colors.divider};
      background: ${THEME.colors.surface};
      font-family: 'Inter', sans-serif;
      transition: all ${THEME.motion.tap} ${THEME.motion.spring};
    }
    .hr-type-pill.active {
      background: ${THEME.colors.accent};
      border-color: ${THEME.colors.accent};
      color: #fff;
    }

    .hr-form-input {
      width: 100%;
      background: ${THEME.colors.surfaceAlt};
      border: 1.5px solid transparent;
      border-radius: 12px;
      padding: 12px 14px;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      color: ${THEME.colors.primaryText};
      outline: none;
      transition: border-color ${THEME.motion.fade};
    }
    .hr-form-input:focus { border-color: ${THEME.colors.accent}; }

    .hr-toggle-track {
      width: 50px;
      height: 28px;
      border-radius: 999px;
      position: relative;
      transition: background ${THEME.motion.fade} ease;
      flex-shrink: 0;
      cursor: pointer;
    }
    .hr-toggle-thumb {
      position: absolute;
      top: 3px;
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 2px 6px rgba(0,0,0,0.22);
      transition: left ${THEME.motion.fade} ${THEME.motion.spring};
    }

    .cal-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      margin: 2px auto 0;
    }

    /* Bottom sheet overlay */
    .hr-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.35);
      z-index: 10;
      animation: hrOverlayIn ${THEME.motion.fade} ease forwards;
    }
    @keyframes hrOverlayIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .hr-sheet {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: ${THEME.colors.surface};
      border-radius: 24px 24px 0 0;
      z-index: 11;
      max-height: 85%;
      overflow-y: auto;
      scrollbar-width: none;
      animation: hrSheetUp 300ms ${THEME.motion.spring} forwards;
    }
    .hr-sheet::-webkit-scrollbar { display: none; }
    @keyframes hrSheetUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `}</style>
);

// StatusBar and HomeIndicator are now inline in the frame

// ---------------------------------------------------------------------------
// TOGGLE
// ---------------------------------------------------------------------------
const Toggle = ({ value, onChange }) => (
  <div
    className="hr-toggle-track hr-tap"
    onClick={() => onChange(!value)}
    style={{ background: value ? THEME.colors.accent : THEME.colors.divider }}
  >
    <div className="hr-toggle-thumb" style={{ left: value ? '25px' : '3px' }} />
  </div>
);

// ---------------------------------------------------------------------------
// DATA
// ---------------------------------------------------------------------------
const REMINDERS = [
  {
    id: 'r1',
    title: 'Flea Treatment',
    pet: 'Luna',
    due: 'March 14, 2026',
    daysLeft: -3,
    urgency: 'overdue',
    type: 'medication',
    Icon: Heart,
  },
  {
    id: 'r2',
    title: 'Rabies Vaccination',
    pet: 'Luna',
    due: 'March 20, 2026',
    daysLeft: 3,
    urgency: 'due-soon',
    type: 'vaccine',
    Icon: Shield,
  },
  {
    id: 'r3',
    title: 'Annual Checkup',
    pet: 'Max',
    due: 'March 28, 2026',
    daysLeft: 11,
    urgency: 'upcoming',
    type: 'checkup',
    Icon: Calendar,
  },
  {
    id: 'r4',
    title: 'Joint Supplement Refill',
    pet: 'Luna',
    due: 'April 5, 2026',
    daysLeft: 19,
    urgency: 'upcoming',
    type: 'medication',
    Icon: Heart,
  },
];

const REMINDER_TYPES = ['Vaccine', 'Checkup', 'Medication', 'Grooming'];
const PET_OPTIONS = ['Luna', 'Max'];

// Mini calendar config - March 2026
const MARCH_DAYS = 31;
const MARCH_START_DOW = 0; // Sunday
const REMINDER_DATES_MARCH = [14, 20, 28];

// ---------------------------------------------------------------------------
// URGENCY HELPERS
// ---------------------------------------------------------------------------
const getUrgencyStyle = (urgency) => {
  switch (urgency) {
    case 'overdue':
      return {
        cardBg: 'rgba(255,59,48,0.05)',
        border: '1.5px solid rgba(255,59,48,0.15)',
        badgeBg: 'rgba(255,59,48,0.12)',
        badgeColor: THEME.colors.danger,
        badgeLabel: 'Overdue',
        iconBg: 'rgba(255,59,48,0.12)',
        iconColor: THEME.colors.danger,
      };
    case 'due-soon':
      return {
        cardBg: 'rgba(255,149,0,0.04)',
        border: '1.5px solid rgba(255,149,0,0.15)',
        badgeBg: 'rgba(255,149,0,0.12)',
        badgeColor: THEME.colors.warning,
        badgeLabel: 'Due in 3 days',
        iconBg: 'rgba(255,149,0,0.12)',
        iconColor: THEME.colors.warning,
      };
    default:
      return {
        cardBg: THEME.colors.surface,
        border: 'none',
        badgeBg: 'rgba(142,142,147,0.10)',
        badgeColor: THEME.colors.tertiaryText,
        badgeLabel: 'Upcoming',
        iconBg: 'rgba(232,93,42,0.10)',
        iconColor: THEME.colors.accent,
      };
  }
};

// ---------------------------------------------------------------------------
// REMINDER CARD
// ---------------------------------------------------------------------------
const ReminderCard = ({ reminder, onSnooze, onComplete }) => {
  const style = getUrgencyStyle(reminder.urgency);
  const { Icon } = reminder;

  return (
    <div
      className="hr-card hr-fade"
      style={{
        background: style.cardBg,
        border: style.border,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 14,
          background: style.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon size={20} color={style.iconColor} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: THEME.colors.primaryText }}>{reminder.title}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999,
              background: style.badgeBg, color: style.badgeColor,
            }}>
              {style.badgeLabel}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <PawPrint size={12} color={THEME.colors.tertiaryText} />
            <span style={{ fontSize: 13, color: THEME.colors.secondaryText, fontWeight: 500 }}>{reminder.pet}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={12} color={THEME.colors.tertiaryText} />
            <span style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>{reminder.due}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button
          className="hr-tap"
          onClick={onSnooze}
          style={{
            flex: 1,
            background: THEME.colors.surfaceAlt,
            border: 'none',
            borderRadius: 12,
            padding: '10px',
            fontSize: 13,
            fontWeight: 600,
            color: THEME.colors.secondaryText,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Bell size={14} color={THEME.colors.secondaryText} />
          Snooze
        </button>
        <button
          className="hr-tap"
          onClick={onComplete}
          style={{
            flex: 1,
            background: 'rgba(0,192,96,0.10)',
            border: 'none',
            borderRadius: 12,
            padding: '10px',
            fontSize: 13,
            fontWeight: 600,
            color: THEME.colors.success,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Check size={14} color={THEME.colors.success} />
          Complete
        </button>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// MINI CALENDAR
// ---------------------------------------------------------------------------
const MiniCalendar = () => {
  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const cells = [];
  for (let i = 0; i < MARCH_START_DOW; i++) cells.push(null);
  for (let d = 1; d <= MARCH_DAYS; d++) cells.push(d);

  const today = 17;

  return (
    <div className="hr-card" style={{ marginBottom: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} color={THEME.colors.accent} />
          <span style={{ fontSize: 15, fontWeight: 700, color: THEME.colors.primaryText }}>March 2026</span>
        </div>
        <span style={{ fontSize: 12, color: THEME.colors.tertiaryText, fontWeight: 500 }}>3 reminders</span>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {dayHeaders.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: THEME.colors.tertiaryText, paddingBottom: 6 }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px 0' }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const hasReminder = REMINDER_DATES_MARCH.includes(d);
          const isToday = d === today;
          const isOverdue = d === 14;
          return (
            <div key={d} style={{ textAlign: 'center', padding: '2px 0' }}>
              <div style={{
                width: 28, height: 28, margin: '0 auto', borderRadius: '50%',
                background: isToday ? THEME.colors.accent : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontSize: 12,
                  fontWeight: isToday || hasReminder ? 700 : 400,
                  color: isToday ? '#fff' : THEME.colors.primaryText,
                }}>
                  {d}
                </span>
              </div>
              {hasReminder && (
                <div className="cal-dot" style={{
                  background: isOverdue ? THEME.colors.danger : d === 20 ? THEME.colors.warning : THEME.colors.accent,
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// ADD REMINDER BOTTOM SHEET
// ---------------------------------------------------------------------------
const AddReminderSheet = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState('Vaccine');
  const [selectedPet, setSelectedPet] = useState('Luna');
  const [repeatOn, setRepeatOn] = useState(false);
  const [notes, setNotes] = useState('');

  return (
    <>
      <div className="hr-overlay" onClick={onClose} />
      <div className="hr-sheet">
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 4 }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: THEME.colors.divider }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 16px' }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: THEME.colors.primaryText }}>Add Reminder</span>
          <button className="hr-tap" onClick={onClose} style={{
            width: 32, height: 32, borderRadius: 999,
            background: THEME.colors.surfaceAlt,
            border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}>
            <X size={16} color={THEME.colors.secondaryText} />
          </button>
        </div>

        <div style={{ padding: '0 20px 24px' }}>
          {/* Type selector pills */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: THEME.colors.tertiaryText, marginBottom: 10, letterSpacing: 0.3 }}>TYPE</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {REMINDER_TYPES.map(t => (
                <button
                  key={t}
                  className={`hr-type-pill hr-tap ${selectedType === t ? 'active' : ''}`}
                  onClick={() => setSelectedType(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Pet selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: THEME.colors.tertiaryText, marginBottom: 10, letterSpacing: 0.3 }}>PET</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {PET_OPTIONS.map(p => (
                <button
                  key={p}
                  className="hr-tap"
                  onClick={() => setSelectedPet(p)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    border: `1.5px solid ${selectedPet === p ? THEME.colors.accent : THEME.colors.divider}`,
                    background: selectedPet === p ? 'rgba(232,93,42,0.08)' : THEME.colors.surface,
                    color: selectedPet === p ? THEME.colors.accent : THEME.colors.secondaryText,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: `all ${THEME.motion.tap} ${THEME.motion.spring}`,
                  }}
                >
                  <PawPrint size={14} color={selectedPet === p ? THEME.colors.accent : THEME.colors.tertiaryText} />
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Date picker */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: THEME.colors.tertiaryText, marginBottom: 10, letterSpacing: 0.3 }}>DUE DATE</div>
            <input type="date" className="hr-form-input" defaultValue="2026-04-01" />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: THEME.colors.tertiaryText, marginBottom: 10, letterSpacing: 0.3 }}>NOTES</div>
            <textarea
              className="hr-form-input"
              rows={2}
              placeholder="Optional notes..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ resize: 'none' }}
            />
          </div>

          {/* Repeat toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: THEME.colors.surfaceAlt, borderRadius: 12, padding: '14px 16px',
            marginBottom: 24,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText, marginBottom: 2 }}>Repeat Reminder</div>
              <div style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>Automatically reschedule</div>
            </div>
            <Toggle value={repeatOn} onChange={setRepeatOn} />
          </div>

          {/* Add button */}
          <button
            className="hr-tap"
            style={{
              width: '100%',
              background: `linear-gradient(135deg, #FF7240 0%, ${THEME.colors.accent} 100%)`,
              color: '#fff',
              border: 'none',
              borderRadius: THEME.radius.medium,
              padding: '16px',
              fontSize: 16,
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              cursor: 'pointer',
              letterSpacing: '-0.2px',
            }}
          >
            Add Reminder
          </button>
        </div>
      </div>
    </>
  );
};

// ---------------------------------------------------------------------------
// MAIN SCREEN
// ---------------------------------------------------------------------------
const HealthRemindersScreen = () => {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [doneIds, setDoneIds] = useState([]);
  const [snoozedIds, setSnoozedIds] = useState([]);

  const activeReminders = REMINDERS.filter(r => !doneIds.includes(r.id));
  const overdueReminders = activeReminders.filter(r => r.urgency === 'overdue');
  const dueSoonReminders = activeReminders.filter(r => r.urgency === 'due-soon');
  const upcomingReminders = activeReminders.filter(r => r.urgency === 'upcoming');

  const handleComplete = (id) => setDoneIds(prev => [...prev, id]);
  const handleSnooze = (id) => setSnoozedIds(prev => [...prev, id]);

  return (
    <>
      <GlobalStyles />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#E5E5E5', padding: '20px',
        fontFamily: 'Inter, sans-serif',
      }}>
        {/* iPhone Frame */}
        <div className="relative" style={{
          width: 390, height: 844,
          borderRadius: 50,
          border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F9F9FB',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        }}>
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                <rect x="0" y="6" width="3" height="6" rx="1" fill="#111" />
                <rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111" />
                <rect x="9" y="2" width="3" height="10" rx="1" fill="#111" />
                <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111" />
                <path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
                <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35" />
                <rect x="2" y="2" width="16" height="9" rx="2" fill="#111" />
                <path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4" />
              </svg>
            </div>
          </div>

          {/* Floating Header */}
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              {/* Left: Back button */}
              <button
                onClick={() => { window.history.back(); }}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              >
                <ChevronLeft size={22} color="#111111" />
              </button>
              {/* Center: Title */}
              <h2 className="text-[17px] font-semibold text-[#111111]">Health Reminders</h2>
              {/* Right: Add button */}
              <button
                onClick={() => setSheetOpen(true)}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              >
                <Plus size={22} color="#111111" />
              </button>
            </div>
          </header>

          {/* Scrollable body */}
          <div className="absolute inset-0 overflow-y-auto hr-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>

          <div style={{ padding: '0 20px 24px' }}>

            {/* Overdue */}
            {overdueReminders.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <AlertTriangle size={14} color={THEME.colors.danger} />
                  <span className="hr-section-title" style={{ marginBottom: 0, color: THEME.colors.danger }}>Overdue</span>
                </div>
                {overdueReminders.map(r => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onSnooze={() => handleSnooze(r.id)}
                    onComplete={() => handleComplete(r.id)}
                  />
                ))}
              </div>
            )}

            {/* Due Soon */}
            {dueSoonReminders.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <Clock size={14} color={THEME.colors.warning} />
                  <span className="hr-section-title" style={{ marginBottom: 0, color: THEME.colors.warning }}>Due Soon</span>
                </div>
                {dueSoonReminders.map(r => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onSnooze={() => handleSnooze(r.id)}
                    onComplete={() => handleComplete(r.id)}
                  />
                ))}
              </div>
            )}

            {/* Upcoming */}
            {upcomingReminders.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div className="hr-section-title">Upcoming</div>
                {upcomingReminders.map(r => (
                  <ReminderCard
                    key={r.id}
                    reminder={r}
                    onSnooze={() => handleSnooze(r.id)}
                    onComplete={() => handleComplete(r.id)}
                  />
                ))}
              </div>
            )}

            {/* Completed feedback */}
            {doneIds.length > 0 && (
              <div className="hr-card hr-fade" style={{
                background: 'rgba(0,192,96,0.06)',
                display: 'flex', alignItems: 'center', gap: 12,
                marginBottom: 20,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 999,
                  background: 'rgba(0,192,96,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check size={18} color={THEME.colors.success} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText }}>
                    {doneIds.length} completed
                  </div>
                  <div style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>Great job keeping up!</div>
                </div>
              </div>
            )}

            {/* Mini Calendar */}
            <div style={{ marginBottom: 16 }}>
              <div className="hr-section-title">Calendar</div>
              <MiniCalendar />
            </div>

          </div>
          </div>

          {/* Bottom Sheet */}
          {sheetOpen && <AddReminderSheet onClose={() => setSheetOpen(false)} />}
        </div>
      </div>
    </>
  );
};

export default HealthRemindersScreen;
