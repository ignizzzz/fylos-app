import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Clock,
  MapPin,
  Camera,
  Check,
  PawPrint,
  Navigation2,
  Star,
  X,
  AlertCircle,
} from 'lucide-react';

/**
 * 53_PRO_WALK_CHECKIN_v1.jsx
 * Walk Check-in / Check-out screen for Fylos PRO service providers.
 * Three states: Pre-walk checklist, Active walk tracking, Walk complete report.
 * Warm minimal FYLOS design system.
 */

// ─── STATUS BAR ─────────────────────────────────────────────────────────────
const StatusBar = () => (
  <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
    <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
    </div>
  </div>
);

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    .walk-checkin * {
      margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .walk-scroll { overflow-y: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
    .walk-scroll::-webkit-scrollbar { display: none; }

    .pro-tap {
      transition: transform 120ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease;
      cursor: pointer; user-select: none;
    }
    .pro-tap:active { transform: scale(0.97); opacity: 0.85; }

    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.5; transform: scale(0.8); }
    }
    @keyframes successPop {
      0%   { transform: scale(0.6); opacity: 0; }
      60%  { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes timerPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.65; }
    }

    .slide-in { animation: slideInUp 280ms ease both; }
    .pulse-dot { animation: pulseDot 1.4s ease-in-out infinite; }
    .timer-pulse { animation: timerPulse 2s ease-in-out infinite; }
    .success-pop { animation: successPop 480ms cubic-bezier(0.34,1.56,0.64,1) both; }

    textarea { resize: none; font-family: inherit; }
    textarea:focus { outline: none; }
  `}</style>
);

// ─── CARD ────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: '#F3EFEB', borderRadius: 20, padding: 20,
    border: '1px solid #EDE8E2',
    ...style,
  }}>{children}</div>
);

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const formatTime = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

// ─── CHECKLIST DATA ──────────────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { id: 1, label: 'Leash attached', checked: false },
  { id: 2, label: 'Water bottle', checked: false },
  { id: 3, label: 'Waste bags', checked: false },
  { id: 4, label: 'Treats', checked: false },
];

// ─── STATE 1: PRE-WALK ──────────────────────────────────────────────────────
const PreWalkState = ({ onStartWalk }) => {
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);
  const toggle = (id) => setChecklist(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  const allChecked = checklist.every(i => i.checked);

  return (
    <div className="walk-scroll" style={{
      flex: 1, overflowY: 'auto', padding: 16,
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {/* Booking Info */}
      <div className="slide-in">
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(232,93,42,0.10)', border: '1px solid rgba(232,93,42,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <PawPrint size={20} color="#E85D2A" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#111' }}>Sarah Mitchell</div>
              <div style={{ fontSize: 13, color: '#A09A94', marginTop: 1 }}>Luna (Golden Retriever)</div>
            </div>
            <div style={{ background: '#EEF7F1', borderRadius: 9999, padding: '4px 10px', border: '1px solid #D7EBDD' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#3F8D63' }}>Confirmed</span>
            </div>
          </div>

          <div className="border-t border-dashed border-[#CFCFD4]" style={{ marginBottom: 14 }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Clock size={15} color="#E85D2A" />
            <span style={{ fontSize: 13, color: '#6E6058' }}>3:30 PM — 4:30 PM (60 min)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={15} color="#E85D2A" />
            <span style={{ fontSize: 13, color: '#6E6058' }}>Riverside Park, 42 Oak Street</span>
          </div>
        </Card>
      </div>

      {/* Checklist */}
      <div className="slide-in" style={{ animationDelay: '60ms' }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Pre-Walk Checklist</div>
            <div style={{ fontSize: 12, color: '#A09A94', marginTop: 2 }}>Complete all items to start</div>
          </div>
          <div className="border-t border-dashed border-[#CFCFD4]" />

          {checklist.map((item, idx) => (
            <div
              key={item.id}
              className="pro-tap"
              onClick={() => toggle(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px',
                borderBottom: idx < checklist.length - 1 ? '1px solid #EDE8E2' : 'none',
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: 8,
                background: item.checked ? '#E85D2A' : 'transparent',
                border: item.checked ? 'none' : '2px solid #D5CEC7',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms ease', flexShrink: 0,
              }}>
                {item.checked && <Check size={14} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{
                fontSize: 14, flex: 1,
                color: item.checked ? '#111' : '#6E6058',
                fontWeight: item.checked ? 600 : 400,
              }}>{item.label}</span>
              {item.checked && <span style={{ fontSize: 11, fontWeight: 600, color: '#3F8D63' }}>Done</span>}
            </div>
          ))}
        </Card>
      </div>

      {/* Start Walk Button */}
      <div className="slide-in" style={{ animationDelay: '120ms', paddingBottom: 8 }}>
        <button
          className="pro-tap"
          onClick={allChecked ? onStartWalk : undefined}
          disabled={!allChecked}
          style={{
            width: '100%', padding: '14px 0', border: 'none', borderRadius: 14,
            background: allChecked ? '#111' : '#D5CEC7',
            color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: allChecked ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: allChecked ? '0 4px 20px rgba(0,0,0,0.12)' : 'none',
            opacity: allChecked ? 1 : 0.6,
          }}
        >
          <Navigation2 size={18} fill="#fff" />
          Start Walk
        </button>
        {!allChecked && (
          <p style={{ textAlign: 'center', fontSize: 11, color: '#A09A94', marginTop: 6 }}>
            Complete all checklist items to begin
          </p>
        )}
      </div>
    </div>
  );
};

// ─── STATE 2: ACTIVE WALK ────────────────────────────────────────────────────
const ActiveWalkState = ({ elapsedSecs, onEndWalk }) => {
  const distKm = (elapsedSecs * 0.0014).toFixed(2);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="walk-scroll" style={{
        flex: 1, overflowY: 'auto', padding: 16,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {/* Timer Card */}
        <div className="slide-in">
          <Card style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <div className="pulse-dot" style={{
                width: 10, height: 10, borderRadius: '50%', background: '#3F8D63',
                boxShadow: '0 0 0 4px rgba(63,141,99,0.15)',
              }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#3F8D63', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Walk in Progress
              </span>
            </div>
            <div className="timer-pulse" style={{
              fontSize: 52, fontWeight: 800, color: '#111',
              letterSpacing: 2, lineHeight: 1.1, marginBottom: 6,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {formatTime(elapsedSecs)}
            </div>
            <div style={{ fontSize: 13, color: '#A09A94' }}>elapsed</div>
          </Card>
        </div>

        {/* Route stats row */}
        <div className="slide-in" style={{ animationDelay: '40ms', display: 'flex', gap: 10 }}>
          {[
            { icon: Navigation2, label: 'Distance', value: `${distKm} km`, color: '#E85D2A' },
            { icon: Clock, label: 'Pace', value: distKm > 0 ? `${(elapsedSecs / 60 / parseFloat(distKm)).toFixed(1)} min/km` : '--', color: '#E85D2A' },
          ].map(({ icon: Icon, label, value, color }) => (
            <Card key={label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'rgba(232,93,42,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={18} color={color} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#A09A94', textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: '#111' }}>{value}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="slide-in" style={{ animationDelay: '80ms' }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              height: 140,
              background: '#F3EFEB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 8, position: 'relative',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(#D5CEC7 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />
              <MapPin size={28} color="#A09A94" />
              <span style={{ fontSize: 12, color: '#A09A94', fontWeight: 500 }}>Route tracking active</span>
            </div>
          </Card>
        </div>

        {/* Quick Action Buttons */}
        <div className="slide-in" style={{ animationDelay: '120ms' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { icon: Camera, label: 'Photo', color: '#E85D2A' },
              { icon: PawPrint, label: 'Break', color: '#6E6058' },
              { icon: AlertCircle, label: 'Alert', color: '#E85D2A' },
            ].map(({ icon: Icon, label, color }) => (
              <button key={label} className="pro-tap" style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: '#F3EFEB', border: '1px solid #EDE8E2',
                borderRadius: 9999, padding: '10px 8px',
                fontSize: 11, fontWeight: 600, color,
              }}>
                <Icon size={14} color={color} />
                <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* End Walk Button */}
        <div className="slide-in" style={{ animationDelay: '160ms', paddingBottom: 8 }}>
          <button className="pro-tap" onClick={onEndWalk} style={{
            width: '100%', padding: '14px 0', border: 'none', borderRadius: 14,
            background: '#D96852', color: '#fff',
            fontSize: 16, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: '0 4px 20px rgba(217,104,82,0.25)',
          }}>
            <X size={18} strokeWidth={3} />
            End Walk
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── STATE 3: WALK COMPLETE ──────────────────────────────────────────────────
const WalkCompleteState = ({ elapsedSecs }) => {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const durationMin = Math.floor(elapsedSecs / 60);
  const distKm = (elapsedSecs * 0.0014 + 0.3).toFixed(2);

  if (submitted) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', gap: 16,
      }}>
        <div className="success-pop" style={{
          width: 72, height: 72, borderRadius: '50%',
          background: '#EEF7F1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={36} color="#3F8D63" strokeWidth={3} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#111' }}>Report Submitted</div>
        <div style={{ fontSize: 14, color: '#6E6058', textAlign: 'center', lineHeight: 1.5 }}>
          Sarah has been notified. Great walk today!
        </div>
      </div>
    );
  }

  return (
    <div className="walk-scroll" style={{
      flex: 1, overflowY: 'auto', padding: 16,
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {/* Summary Card */}
      <div className="slide-in">
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111', marginBottom: 16 }}>Walk Summary</div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {[
              { icon: Clock, label: 'Duration', value: `${durationMin} min`, color: '#E85D2A' },
              { icon: Navigation2, label: 'Distance', value: `${distKm} km`, color: '#E85D2A' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{
                flex: 1, background: '#F7F5F2', borderRadius: 16, padding: '14px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                border: '1px solid #EDE8E2',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: 'rgba(232,93,42,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#111' }}>{value}</div>
                  <div style={{ fontSize: 11, color: '#A09A94' }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Route placeholder */}
          <div style={{
            height: 80, background: '#F7F5F2',
            borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: '1px solid #EDE8E2',
          }}>
            <MapPin size={18} color="#A09A94" />
            <span style={{ fontSize: 12, color: '#A09A94', fontWeight: 500 }}>Route completed</span>
          </div>
        </Card>
      </div>

      {/* Photos */}
      <div className="slide-in" style={{ animationDelay: '50ms' }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 12 }}>Photos</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                flex: 1, height: 72, borderRadius: 14,
                background: '#F7F5F2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid #EDE8E2',
              }}>
                <Camera size={18} color="#A09A94" />
              </div>
            ))}
            <div style={{
              width: 72, height: 72, borderRadius: 14,
              border: '2px dashed #D5CEC7',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <Camera size={18} color="#A09A94" />
            </div>
          </div>
        </Card>
      </div>

      {/* Notes */}
      <div className="slide-in" style={{ animationDelay: '100ms' }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 10 }}>Walk Notes</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How did the walk go? Any notes for the owner..."
            rows={3}
            style={{
              width: '100%', background: '#F7F5F2',
              border: '1px solid #EDE8E2', borderRadius: 16,
              padding: '12px 14px', fontSize: 13, color: '#111', lineHeight: 1.55,
            }}
          />
        </Card>
      </div>

      {/* Rating */}
      <div className="slide-in" style={{ animationDelay: '140ms' }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111', marginBottom: 4 }}>Rate this walk</div>
          <div style={{ fontSize: 12, color: '#A09A94', marginBottom: 12 }}>How was your experience?</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} onClick={() => setRating(i)} style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex',
                transition: 'transform 120ms ease',
              }}>
                <Star size={28}
                  color={i <= rating ? '#E85D2A' : '#D5CEC7'}
                  fill={i <= rating ? '#E85D2A' : 'none'}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Submit */}
      <div className="slide-in" style={{ animationDelay: '180ms', paddingBottom: 8 }}>
        <button className="pro-tap" onClick={() => setSubmitted(true)} style={{
          width: '100%', padding: '14px 0', border: 'none', borderRadius: 14,
          background: '#111',
          color: '#fff', fontSize: 16, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
        }}>
          <Check size={18} strokeWidth={3} />
          Submit Report
        </button>
      </div>
    </div>
  );
};

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
const ProWalkCheckinScreen = () => {
  const [screen, setScreen] = useState('pre');
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (screen === 'active') {
      timerRef.current = setInterval(() => setElapsedSecs(s => s + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const handleStartWalk = () => { setElapsedSecs(0); setScreen('active'); };
  const handleEndWalk = () => setScreen('complete');

  const headerTitle = { pre: 'Walk Details', active: 'Walk in Progress', complete: 'Walk Report' }[screen];

  return (
    <div className="walk-checkin" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#E5E5E5', padding: 20,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{
        width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
        overflow: 'hidden', backgroundColor: '#F7F5F2',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
        {/* Status Bar */}
        <StatusBar />

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all duration-[120ms]"
              style={{ background: '#F3EFEB', border: '1px solid #EDE8E2', boxShadow: '0 8px 24px rgba(0,0,0,0.06)' }}
            >
              <ChevronLeft size={22} color="#111" />
            </button>
            {screen === 'active' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div className="pulse-dot" style={{
                  width: 8, height: 8, borderRadius: '50%', background: '#3F8D63',
                  boxShadow: '0 0 0 3px rgba(63,141,99,0.15)',
                }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#3F8D63' }}>LIVE</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111', marginLeft: 4 }}>{formatTime(elapsedSecs)}</span>
              </div>
            ) : (
              <h2 className="text-[17px] font-semibold text-[#111]">{headerTitle}</h2>
            )}
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Spacers */}
        <div style={{ height: 54, flexShrink: 0 }} />
        <div style={{ height: 54, flexShrink: 0 }} />

        {/* Body */}
        {screen === 'pre' && <PreWalkState onStartWalk={handleStartWalk} />}
        {screen === 'active' && <ActiveWalkState elapsedSecs={elapsedSecs} onEndWalk={handleEndWalk} />}
        {screen === 'complete' && <WalkCompleteState elapsedSecs={elapsedSecs} />}
      </div>

      {/* Dev state switcher */}
      <div style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 8,
        background: 'rgba(17,17,17,0.9)', borderRadius: 9999,
        padding: '8px 16px', border: '1px solid rgba(0,0,0,0.1)',
        backdropFilter: 'blur(12px)',
      }}>
        {['pre', 'active', 'complete'].map(s => (
          <button key={s} onClick={() => { setScreen(s); if (s === 'active') setElapsedSecs(923); if (s === 'complete') setElapsedSecs(3600); }} style={{
            background: screen === s ? '#E85D2A' : 'transparent',
            border: `1.5px solid ${screen === s ? '#E85D2A' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 9999, padding: '5px 14px',
            color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            {s === 'pre' ? 'Pre-Walk' : s === 'active' ? 'Active' : 'Complete'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProWalkCheckinScreen;
