import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Plus,
  Clock,
  Check,
  Droplets,
  Circle,
  ArrowRight,
  Calendar,
  Activity,
  Star,
  Info,
  X,
  ChevronRight
} from 'lucide-react';

/**
 * 44_FEEDING_TRACKER_v1.jsx
 * Feeding Tracker screen for the Fylos pet care app.
 */

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

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');
    .fd-font-brand { font-family: 'Nunito', sans-serif; }
    .fd-font-body  { font-family: 'Inter', sans-serif; }
    .fd-scroll::-webkit-scrollbar { display: none; }
    .fd-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    .fd-btn { transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease; cursor: pointer; border: none; background: none; padding: 0; }
    .fd-btn:active { transform: scale(0.92); }
    .fd-card { transition: transform ${THEME.motion.tap} ease; cursor: pointer; }
    .fd-card:active { transform: scale(0.97); }
    .fd-pill { transition: all 150ms ease; cursor: pointer; border: none; }
    .fd-pill:active { transform: scale(0.94); }
    .fd-ring-anim { transition: stroke-dashoffset 800ms ${THEME.motion.spring}; }
    .fd-ring-enter { animation: fd-ring-in 800ms ${THEME.motion.spring} forwards; }
    @keyframes fd-ring-in { from { stroke-dashoffset: 201; } }
    .fd-backdrop { animation: fd-fade-in ${THEME.motion.fade} ease forwards; }
    @keyframes fd-fade-in { from { opacity: 0; } to { opacity: 1; } }
    .fd-sheet { animation: fd-slide-up 280ms ${THEME.motion.spring} forwards; }
    @keyframes fd-slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .fd-bar-anim { animation: fd-bar-grow 600ms ${THEME.motion.spring} forwards; }
    @keyframes fd-bar-grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  `}</style>
);

const FOOD_TYPES = ['Dry', 'Wet', 'Raw', 'Treats'];
const FOOD_TYPE_COLORS = {
  Dry: { color: '#E85D2A', bg: 'rgba(232,93,42,0.10)' },
  Wet: { color: '#007AFF', bg: 'rgba(0,122,255,0.10)' },
  Raw: { color: '#00C060', bg: 'rgba(0,192,96,0.10)' },
  Treats: { color: '#FF9500', bg: 'rgba(255,149,0,0.10)' }
};

const TODAYS_LOG = [
  { id: 1, time: '7:30 AM', type: 'Dry', amount: '120g', label: 'Morning kibble', icon: 'meal' },
  { id: 2, time: '8:00 AM', type: 'water', amount: '200ml', label: 'Fresh water', icon: 'water' },
  { id: 3, time: '12:30 PM', type: 'Wet', amount: '85g', label: 'Lunch pate', icon: 'meal' },
  { id: 4, time: '1:00 PM', type: 'water', amount: '150ml', label: 'Water refill', icon: 'water' },
  { id: 5, time: '6:00 PM', type: 'Treats', amount: '15g', label: 'Training treats', icon: 'meal' }
];

const WEEKLY_DATA = [
  { day: 'Mon', value: 420, target: 500 }, { day: 'Tue', value: 480, target: 500 },
  { day: 'Wed', value: 510, target: 500 }, { day: 'Thu', value: 390, target: 500 },
  { day: 'Fri', value: 500, target: 500 }, { day: 'Sat', value: 460, target: 500 },
  { day: 'Sun', value: 220, target: 500 }
];

const WaterRing = ({ current, goal }) => {
  const r = 32;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(current / goal, 1);
  const offset = circumference * (1 - pct);
  return (
    <div style={{ position: 'relative', width: 80, height: 80 }}>
      <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke={THEME.colors.surfaceAlt} strokeWidth="6" />
        <circle className="fd-ring-anim fd-ring-enter" cx="40" cy="40" r={r} fill="none" stroke={THEME.colors.info} strokeWidth="6" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Droplets size={14} color={THEME.colors.info} strokeWidth={2} />
        <span className="fd-font-body" style={{ fontSize: 11, fontWeight: 700, color: THEME.colors.info, marginTop: 2 }}>{current}ml</span>
      </div>
    </div>
  );
};

const LogMealSheet = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState('Dry');
  const [amount, setAmount] = useState('100');
  const [time, setTime] = useState('Now');
  return (
    <div className="fd-backdrop" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(6px)', zIndex: 50, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }} onClick={onClose}>
      <div className="fd-sheet" style={{ width: '100%', background: THEME.colors.surface, borderRadius: '24px 24px 0 0', padding: '20px 20px 40px', boxShadow: THEME.shadows.floating }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: THEME.radius.full, background: THEME.colors.divider, margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span className="fd-font-brand" style={{ fontSize: 18, fontWeight: 800, color: THEME.colors.primaryText }}>Log Meal</span>
          <button className="fd-btn" onClick={onClose}><X size={20} color={THEME.colors.secondaryText} strokeWidth={2} /></button>
        </div>
        <div style={{ marginBottom: 20 }}>
          <span className="fd-font-body" style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.secondaryText, marginBottom: 10, display: 'block' }}>Food Type</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {FOOD_TYPES.map(type => {
              const active = selectedType === type;
              return (
                <button key={type} className="fd-pill" onClick={() => setSelectedType(type)} style={{
                  padding: '8px 16px', borderRadius: THEME.radius.full,
                  background: active ? THEME.colors.accent : THEME.colors.surfaceAlt,
                  color: active ? '#FFFFFF' : THEME.colors.primaryText,
                  fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif', cursor: 'pointer'
                }}>{type}</button>
              );
            })}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <span className="fd-font-body" style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.secondaryText, marginBottom: 8, display: 'block' }}>Amount (grams)</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: THEME.colors.surfaceAlt, borderRadius: THEME.radius.small, padding: '12px 14px' }}>
            <input type="text" value={amount} onChange={e => setAmount(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText, fontFamily: 'Inter, sans-serif', width: '100%' }} />
            <span className="fd-font-body" style={{ fontSize: 13, color: THEME.colors.tertiaryText, flexShrink: 0 }}>g</span>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <span className="fd-font-body" style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.secondaryText, marginBottom: 8, display: 'block' }}>Time</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: THEME.colors.surfaceAlt, borderRadius: THEME.radius.small, padding: '12px 14px' }}>
            <Clock size={16} color={THEME.colors.tertiaryText} strokeWidth={2} />
            <span className="fd-font-body" style={{ fontSize: 14, fontWeight: 500, color: THEME.colors.primaryText, flex: 1 }}>{time}</span>
            <ChevronRight size={16} color={THEME.colors.tertiaryText} strokeWidth={2} />
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <span className="fd-font-body" style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.secondaryText, marginBottom: 8, display: 'block' }}>Notes (optional)</span>
          <div style={{ background: THEME.colors.surfaceAlt, borderRadius: THEME.radius.small, padding: '12px 14px' }}>
            <input type="text" placeholder="Add a note..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: THEME.colors.primaryText, fontFamily: 'Inter, sans-serif', width: '100%' }} />
          </div>
        </div>
        <button className="fd-btn" onClick={onClose} style={{
          width: '100%', padding: '15px 0', borderRadius: THEME.radius.medium,
          background: 'linear-gradient(135deg, #FF7240, #E85D2A)', color: '#FFFFFF',
          fontSize: 16, fontWeight: 700, fontFamily: 'Inter, sans-serif',
          boxShadow: '0 4px 16px rgba(232,93,42,0.3)', cursor: 'pointer', border: 'none'
        }}>Log Meal</button>
      </div>
    </div>
  );
};

const TimelineEntry = ({ entry, isLast }) => {
  const isWater = entry.icon === 'water';
  const typeColor = isWater ? THEME.colors.info : (FOOD_TYPE_COLORS[entry.type]?.color || THEME.colors.accent);
  const typeBg = isWater ? 'rgba(0,122,255,0.10)' : (FOOD_TYPE_COLORS[entry.type]?.bg || 'rgba(232,93,42,0.10)');
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: typeColor, flexShrink: 0, marginTop: 6 }} />
        {!isLast && <div style={{ width: 1.5, flex: 1, background: THEME.colors.divider, marginTop: 4 }} />}
      </div>
      <div style={{ flex: 1, background: THEME.colors.surface, borderRadius: 20, padding: '14px 16px', boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)', marginBottom: isLast ? 0 : 8, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: THEME.radius.small, background: typeBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          {isWater ? <Droplets size={18} color={THEME.colors.info} strokeWidth={2} /> : <Activity size={18} color={typeColor} strokeWidth={2} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="fd-font-body" style={{ fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText, margin: 0, lineHeight: 1.3 }}>{entry.label}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
            {!isWater && <span className="fd-font-body" style={{ fontSize: 11, fontWeight: 600, color: typeColor, background: typeBg, padding: '2px 8px', borderRadius: THEME.radius.full }}>{entry.type}</span>}
            <span className="fd-font-body" style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>{entry.amount}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          <Clock size={12} color={THEME.colors.tertiaryText} strokeWidth={2} />
          <span className="fd-font-body" style={{ fontSize: 11, fontWeight: 500, color: THEME.colors.tertiaryText }}>{entry.time}</span>
        </div>
      </div>
    </div>
  );
};

const WeeklyChart = () => {
  const maxVal = Math.max(...WEEKLY_DATA.map(d => d.target));
  const barMaxH = 60;
  return (
    <div style={{ background: THEME.colors.surface, borderRadius: 20, padding: '18px 16px', boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <span className="fd-font-brand" style={{ fontSize: 15, fontWeight: 800, color: THEME.colors.primaryText }}>Weekly Overview</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={13} color={THEME.colors.tertiaryText} strokeWidth={2} />
          <span className="fd-font-body" style={{ fontSize: 11, color: THEME.colors.tertiaryText }}>This Week</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6 }}>
        {WEEKLY_DATA.map((d, i) => {
          const h = (d.value / maxVal) * barMaxH;
          const isToday = i === WEEKLY_DATA.length - 1;
          return (
            <div key={d.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
              <div style={{ width: '100%', maxWidth: 28, height: barMaxH, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: (d.target / maxVal) * barMaxH, left: 0, right: 0, height: 1, background: THEME.colors.divider, borderRadius: 1 }} />
                <div className="fd-bar-anim" style={{
                  width: '100%', height: h, borderRadius: '6px 6px 3px 3px',
                  background: isToday ? 'linear-gradient(180deg, #FF7240, #E85D2A)' : d.value >= d.target ? THEME.colors.accent : THEME.colors.surfaceAlt,
                  transformOrigin: 'bottom', animationDelay: `${i * 60}ms`
                }} />
              </div>
              <span className="fd-font-body" style={{ fontSize: 10, fontWeight: isToday ? 700 : 500, color: isToday ? THEME.colors.accent : THEME.colors.tertiaryText }}>{d.day}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: THEME.colors.accent }} />
          <span className="fd-font-body" style={{ fontSize: 10, color: THEME.colors.tertiaryText }}>Met goal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: THEME.colors.surfaceAlt }} />
          <span className="fd-font-body" style={{ fontSize: 10, color: THEME.colors.tertiaryText }}>Below goal</span>
        </div>
      </div>
    </div>
  );
};

export default function FeedingTrackerScreen() {
  const [showLogMeal, setShowLogMeal] = useState(false);

  const mealsLogged = 2;
  const mealsGoal = 3;
  const waterCurrent = 350;
  const waterGoal = 500;
  const calories = 285;

  return (
    <div className="fd-font-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
      <GlobalStyles />

      <div className="relative" style={{
        width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
        overflow: 'hidden', backgroundColor: '#F9F9FB',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
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
        <div className="absolute inset-0 overflow-y-auto fd-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>
          {/* Spacer for floating header */}
          <div style={{ height: 52, flexShrink: 0 }} />

          {/* Today's Summary Card */}
          <div style={{ margin: '0 20px 20px', background: THEME.colors.surface, borderRadius: 20, padding: 20, boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span className="fd-font-brand" style={{ fontSize: 15, fontWeight: 800, color: THEME.colors.primaryText }}>Today's Summary</span>
              <span className="fd-font-body" style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>Luna</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <WaterRing current={waterCurrent} goal={waterGoal} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: THEME.radius.small, background: 'rgba(232,93,42,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={16} color={THEME.colors.accent} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="fd-font-body" style={{ fontSize: 12, color: THEME.colors.tertiaryText, margin: 0 }}>Meals Logged</p>
                    <p className="fd-font-body" style={{ fontSize: 16, fontWeight: 700, color: THEME.colors.primaryText, margin: 0 }}>{mealsLogged} <span style={{ fontWeight: 400, color: THEME.colors.tertiaryText, fontSize: 13 }}>of {mealsGoal}</span></p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: THEME.radius.small, background: 'rgba(0,192,96,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={16} color={THEME.colors.success} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="fd-font-body" style={{ fontSize: 12, color: THEME.colors.tertiaryText, margin: 0 }}>Calories</p>
                    <p className="fd-font-body" style={{ fontSize: 16, fontWeight: 700, color: THEME.colors.primaryText, margin: 0 }}>{calories} <span style={{ fontWeight: 400, color: THEME.colors.tertiaryText, fontSize: 13 }}>kcal</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Log Section */}
          <div style={{ display: 'flex', gap: 12, padding: '0 20px 20px' }}>
            <button className="fd-card" onClick={() => setShowLogMeal(true)} style={{
              flex: 1, background: THEME.colors.surface, borderRadius: 20, padding: '18px 16px',
              boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer'
            }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #FF7240, #E85D2A)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(232,93,42,0.25)' }}>
                <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <span className="fd-font-body" style={{ fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText }}>Log Meal</span>
              <span className="fd-font-body" style={{ fontSize: 11, color: THEME.colors.tertiaryText }}>Add food entry</span>
            </button>
            <button className="fd-card" style={{
              flex: 1, background: THEME.colors.surface, borderRadius: 20, padding: '18px 16px',
              boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, cursor: 'pointer'
            }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #4DABFF, #007AFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,122,255,0.25)' }}>
                <Droplets size={20} color="#FFFFFF" strokeWidth={2.5} />
              </div>
              <span className="fd-font-body" style={{ fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText }}>Log Water</span>
              <span className="fd-font-body" style={{ fontSize: 11, color: THEME.colors.tertiaryText }}>Track hydration</span>
            </button>
          </div>

          {/* Today's Log Timeline */}
          <div style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span className="fd-font-brand" style={{ fontSize: 15, fontWeight: 800, color: THEME.colors.primaryText }}>Today's Log</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span className="fd-font-body" style={{ fontSize: 12, color: THEME.colors.accent, fontWeight: 600 }}>See all</span>
                <ArrowRight size={14} color={THEME.colors.accent} strokeWidth={2} />
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              {TODAYS_LOG.map((entry, i) => <TimelineEntry key={entry.id} entry={entry} isLast={i === TODAYS_LOG.length - 1} />)}
            </div>
          </div>

          {/* Weekly Overview */}
          <div style={{ padding: '0 20px 100px' }}>
            <WeeklyChart />
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
            <h2 className="text-[17px] font-semibold text-[#111111]">Feeding</h2>
            {/* Right: Calendar button */}
            <button
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <Calendar size={22} color="#111111" />
            </button>
          </div>
        </header>

        {/* Log Meal Bottom Sheet */}
        {showLogMeal && <LogMealSheet onClose={() => setShowLogMeal(false)} />}
      </div>
    </div>
  );
}
