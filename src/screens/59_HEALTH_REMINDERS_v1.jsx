import React, { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  Shield,
  Clock,
  Check,
  Calendar,
  Bell,
  AlertTriangle,
  X,
  PawPrint,
  Pill,
  Stethoscope,
  Syringe,
} from 'lucide-react';

/**
 * 59_HEALTH_REMINDERS_v1.jsx
 * Health Reminders screen for the Fylos pet care app.
 */

/* Toggle Switch */
const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="active:scale-[0.97] transition-all duration-[120ms]"
    style={{
      width: 50, height: 28, borderRadius: 9999, position: 'relative', cursor: 'pointer',
      background: value ? '#E85D2A' : '#D5CEC7',
      transition: 'background 200ms ease',
    }}
  >
    <div style={{
      position: 'absolute', top: 3,
      left: value ? 25 : 3,
      width: 22, height: 22, borderRadius: 9999, background: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.22)',
      transition: 'left 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
    }} />
  </div>
);

/* Data */
const REMINDERS = [
  { id: 'r1', title: 'Flea Treatment', pet: 'Luna', due: 'March 14, 2026', daysLeft: -3, urgency: 'overdue', type: 'medication' },
  { id: 'r2', title: 'Rabies Vaccination', pet: 'Luna', due: 'March 20, 2026', daysLeft: 3, urgency: 'due-soon', type: 'vaccine' },
  { id: 'r3', title: 'Annual Checkup', pet: 'Max', due: 'March 28, 2026', daysLeft: 11, urgency: 'upcoming', type: 'checkup' },
  { id: 'r4', title: 'Joint Supplement Refill', pet: 'Luna', due: 'April 5, 2026', daysLeft: 19, urgency: 'upcoming', type: 'medication' },
];

const REMINDER_TYPES = ['Vaccine', 'Checkup', 'Medication', 'Grooming'];
const PET_OPTIONS = ['Luna', 'Max'];

const MARCH_DAYS = 31;
const MARCH_START_DOW = 0;
const REMINDER_DATES_MARCH = [14, 20, 28];

/* Type config: color-coded by type */
const TYPE_CONFIG = {
  vaccine: { color: '#007AFF', bg: 'rgba(0,122,255,0.08)', Icon: Syringe },
  medication: { color: '#34C759', bg: 'rgba(52,199,89,0.08)', Icon: Pill },
  checkup: { color: '#9B59B6', bg: 'rgba(155,89,182,0.08)', Icon: Stethoscope },
  grooming: { color: '#FF9500', bg: 'rgba(255,149,0,0.08)', Icon: PawPrint },
};

const getUrgencyStyle = (urgency) => {
  switch (urgency) {
    case 'overdue': return {
      cardBorder: '1px solid rgba(255,59,48,0.12)', cardBg: 'rgba(255,59,48,0.03)',
      badgeBg: 'rgba(255,59,48,0.10)', badgeColor: '#FF3B30', badgeLabel: 'Overdue',
    };
    case 'due-soon': return {
      cardBorder: '1px solid rgba(255,149,0,0.12)', cardBg: 'rgba(255,149,0,0.03)',
      badgeBg: 'rgba(255,149,0,0.10)', badgeColor: '#FF9500', badgeLabel: 'Due in 3 days',
    };
    default: return {
      cardBorder: '1px solid #EDE8E2', cardBg: '#F3EFEB',
      badgeBg: 'rgba(160,154,148,0.12)', badgeColor: '#A09A94', badgeLabel: 'Upcoming',
    };
  }
};

/* Reminder Card */
const ReminderCard = ({ reminder, onSnooze, onComplete }) => {
  const urgStyle = getUrgencyStyle(reminder.urgency);
  const typeConf = TYPE_CONFIG[reminder.type] || TYPE_CONFIG.medication;
  const TypeIcon = typeConf.Icon;

  return (
    <div
      className="rounded-[20px] p-5"
      style={{ background: urgStyle.cardBg, border: urgStyle.cardBorder, marginBottom: 14 }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        {/* Type-colored icon */}
        <div style={{
          width: 44, height: 44, borderRadius: 14, background: typeConf.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <TypeIcon size={20} color={typeConf.color} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span className="text-[15px] font-semibold text-[#111111]">{reminder.title}</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 9999,
              background: urgStyle.badgeBg, color: urgStyle.badgeColor,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            }}>
              {urgStyle.badgeLabel}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <PawPrint size={12} color="#A09A94" />
            <span className="text-[13px] font-medium text-[#6E6058]">{reminder.pet}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Clock size={12} color="#A09A94" />
            <span className="text-[12px] text-[#A09A94]">{reminder.due}</span>
          </div>
        </div>
      </div>

      {/* Left color bar */}
      <div style={{
        position: 'absolute', left: 0, top: 12, bottom: 12, width: 3,
        borderRadius: '0 3px 3px 0', background: typeConf.color,
      }} />

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button
          onClick={onSnooze}
          className="active:scale-[0.97] transition-all duration-[120ms]"
          style={{
            flex: 1, background: '#F7F5F2', border: '1px solid #EDE8E2', borderRadius: 16,
            padding: 10, fontSize: 13, fontWeight: 600, color: '#6E6058', cursor: 'pointer',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Bell size={14} color="#6E6058" /> Snooze
        </button>
        <button
          onClick={onComplete}
          className="active:scale-[0.97] transition-all duration-[120ms]"
          style={{
            flex: 1, background: 'rgba(52,199,89,0.08)', border: 'none', borderRadius: 16,
            padding: 10, fontSize: 13, fontWeight: 600, color: '#34C759', cursor: 'pointer',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Check size={14} color="#34C759" /> Complete
        </button>
      </div>
    </div>
  );
};

/* Mini Calendar */
const MiniCalendar = () => {
  const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const cells = [];
  for (let i = 0; i < MARCH_START_DOW; i++) cells.push(null);
  for (let d = 1; d <= MARCH_DAYS; d++) cells.push(d);
  const today = 17;

  return (
    <div className="rounded-[20px] p-5"
      style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={16} color="#E85D2A" />
          <span className="text-[15px] font-semibold text-[#111111]">March 2026</span>
        </div>
        <span className="text-[12px] font-medium text-[#A09A94]">3 reminders</span>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
        {dayHeaders.map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#A09A94', paddingBottom: 6, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px 0' }}>
        {cells.map((d, i) => {
          if (!d) return <div key={`e-${i}`} />;
          const hasReminder = REMINDER_DATES_MARCH.includes(d);
          const isToday = d === today;
          const isOverdue = d === 14;
          const dotColor = isOverdue ? '#FF3B30' : d === 20 ? '#FF9500' : '#E85D2A';

          return (
            <div key={d} style={{ textAlign: 'center', padding: '2px 0' }}>
              <div style={{
                width: 28, height: 28, margin: '0 auto', borderRadius: 9999,
                background: isToday ? '#E85D2A' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{
                  fontSize: 12, fontWeight: isToday || hasReminder ? 600 : 400,
                  color: isToday ? '#fff' : '#111111',
                  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                }}>{d}</span>
              </div>
              {hasReminder && (
                <div style={{ width: 5, height: 5, borderRadius: 9999, background: dotColor, margin: '2px auto 0' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* Add Reminder Sheet */
const AddReminderSheet = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState('Vaccine');
  const [selectedPet, setSelectedPet] = useState('Luna');
  const [repeatOn, setRepeatOn] = useState(false);
  const [notes, setNotes] = useState('');

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.40)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', zIndex: 50 }}
      />
      <div className="wallet-scroll" style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 51,
        background: '#F7F5F2', borderRadius: '20px 20px 0 0',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.12)', maxHeight: '85%', overflowY: 'auto',
      }}>
        {/* Drag handle */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20, paddingBottom: 12 }}>
          <div style={{ width: 40, height: 4, borderRadius: 9999, background: '#D5CEC7' }} />
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#111111', marginTop: 12, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>Add Reminder</h3>
        </div>

        <div style={{ padding: '0 24px 32px' }}>
          {/* Type */}
          <div style={{ marginBottom: 20 }}>
            <span className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest" style={{ display: 'block', marginBottom: 10 }}>Type</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {REMINDER_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className="active:scale-[0.96] transition-all duration-[180ms]"
                  style={{
                    padding: '8px 16px', borderRadius: 9999, cursor: 'pointer',
                    background: selectedType === t ? 'linear-gradient(180deg, #FF7240, #E85D2A)' : '#F3EFEB',
                    color: selectedType === t ? '#FFFFFF' : '#111111',
                    border: selectedType === t ? 'none' : '1.5px solid #EDE8E2',
                    fontSize: 13, fontWeight: 600,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Pet */}
          <div style={{ marginBottom: 20 }}>
            <span className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest" style={{ display: 'block', marginBottom: 10 }}>Pet</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {PET_OPTIONS.map(p => (
                <button
                  key={p}
                  onClick={() => setSelectedPet(p)}
                  className="active:scale-[0.97] transition-all duration-[120ms]"
                  style={{
                    flex: 1, padding: '10px 16px', borderRadius: 16, cursor: 'pointer',
                    border: `1.5px solid ${selectedPet === p ? '#E85D2A' : '#EDE8E2'}`,
                    background: selectedPet === p ? 'rgba(232,93,42,0.06)' : '#F3EFEB',
                    color: selectedPet === p ? '#E85D2A' : '#6E6058',
                    fontSize: 15, fontWeight: 600,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}
                >
                  <PawPrint size={14} color={selectedPet === p ? '#E85D2A' : '#A09A94'} />
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div style={{ marginBottom: 20 }}>
            <span className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest" style={{ display: 'block', marginBottom: 10 }}>Due Date</span>
            <input
              type="date"
              defaultValue="2026-04-01"
              style={{
                width: '100%', height: 52, padding: '0 16px',
                background: '#F3EFEB', border: '1px solid #EDE8E2', borderRadius: 16,
                fontSize: 16, color: '#111111', outline: 'none',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 20 }}>
            <span className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest" style={{ display: 'block', marginBottom: 10 }}>Notes</span>
            <textarea
              rows={2}
              placeholder="Optional notes..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{
                width: '100%', padding: '12px 16px',
                background: '#F3EFEB', border: '1px solid #EDE8E2', borderRadius: 16,
                fontSize: 16, color: '#111111', outline: 'none', resize: 'none',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            />
          </div>

          {/* Repeat toggle */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#F3EFEB', borderRadius: 16, padding: '14px 16px', marginBottom: 24,
          }}>
            <div>
              <div className="text-[15px] font-semibold text-[#111111]" style={{ marginBottom: 2 }}>Repeat Reminder</div>
              <div className="text-[13px] text-[#A09A94]">Automatically reschedule</div>
            </div>
            <Toggle value={repeatOn} onChange={setRepeatOn} />
          </div>

          {/* Submit */}
          <button
            className="active:scale-[0.97] transition-all duration-[120ms]"
            style={{
              width: '100%', padding: '16px 0', borderRadius: 14,
              background: '#111', color: '#FFFFFF',
              fontSize: 16, fontWeight: 600, border: 'none', cursor: 'pointer',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            }}
          >
            Add Reminder
          </button>
        </div>
      </div>
    </>
  );
};

/* Main Screen */
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
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        .wallet-scroll::-webkit-scrollbar { display: none; }
        .wallet-scroll { scrollbar-width: none; }
      `}</style>

      {/* iPhone Frame */}
      <div className="relative" style={{
        width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
        overflow: 'hidden', backgroundColor: '#F7F5F2',
      }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Scroll Content with canonical transparent header */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
          <div className="wallet-scroll absolute inset-0 overflow-y-auto pb-[140px]" style={{ scrollbarWidth: 'none' }}>
            <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none">
              <button
                onClick={() => window.history.back()}
                className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
              >
                <ChevronLeft size={18} strokeWidth={2.2} color="#111" />
              </button>
              <h1 className="text-[17px] font-semibold text-[#111]">Health Reminders</h1>
              <button
                onClick={() => setSheetOpen(true)}
                className="absolute right-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
              >
                <Plus size={16} strokeWidth={2.2} color="#111" />
              </button>
            </div>
            <div className="px-5" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>

              {/* Overdue */}
              {overdueReminders.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <AlertTriangle size={14} color="#FF3B30" />
                    <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: '#FF3B30' }}>Overdue</span>
                  </div>
                  {overdueReminders.map(r => (
                    <div key={r.id} style={{ position: 'relative' }}>
                      <ReminderCard reminder={r} onSnooze={() => handleSnooze(r.id)} onComplete={() => handleComplete(r.id)} />
                    </div>
                  ))}
                </div>
              )}

              {/* Due Soon */}
              {dueSoonReminders.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Clock size={14} color="#FF9500" />
                    <span className="text-[12px] font-bold uppercase tracking-widest" style={{ color: '#FF9500' }}>Due Soon</span>
                  </div>
                  {dueSoonReminders.map(r => (
                    <div key={r.id} style={{ position: 'relative' }}>
                      <ReminderCard reminder={r} onSnooze={() => handleSnooze(r.id)} onComplete={() => handleComplete(r.id)} />
                    </div>
                  ))}
                </div>
              )}

              {/* Upcoming */}
              {upcomingReminders.length > 0 && (
                <div>
                  <span className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest" style={{ display: 'block', marginBottom: 12 }}>Upcoming</span>
                  {upcomingReminders.map(r => (
                    <div key={r.id} style={{ position: 'relative' }}>
                      <ReminderCard reminder={r} onSnooze={() => handleSnooze(r.id)} onComplete={() => handleComplete(r.id)} />
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Feedback */}
              {doneIds.length > 0 && (
                <div className="rounded-[20px] p-5"
                  style={{ background: 'rgba(52,199,89,0.06)', border: '1px solid #EDE8E2', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center" style={{ background: 'rgba(52,199,89,0.10)' }}>
                    <Check size={18} color="#34C759" />
                  </div>
                  <div>
                    <div className="text-[15px] font-semibold text-[#111111]">{doneIds.length} completed</div>
                    <div className="text-[13px] text-[#A09A94]">Great job keeping up!</div>
                  </div>
                </div>
              )}

              {/* Mini Calendar */}
              <div>
                <span className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest" style={{ display: 'block', marginBottom: 12 }}>Calendar</span>
                <MiniCalendar />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sheet */}
        {sheetOpen && <AddReminderSheet onClose={() => setSheetOpen(false)} />}
      </div>
    </div>
  );
};

export default HealthRemindersScreen;
