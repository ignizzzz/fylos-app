import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Clock,
  MapPin,
  Camera,
  Check,
  Square,
  Play,
  PawPrint,
  Droplets,
  Navigation,
  MessageCircle,
  Star,
  X,
  ChevronRight,
  StopCircle,
} from 'lucide-react';

/**
 * 53_PRO_WALK_CHECKIN_v1.jsx
 * Walk Check-in / Check-out screen for Fylos PRO service providers.
 * Three states: Pre-walk checklist, Active walk tracking, Walk complete report.
 * Revolut-inspired dark premium design with Fylos accent colors.
 */

// ─── THEME ────────────────────────────────────────────────────────────────────
const THEME = {
  colors: {
    accent: '#E85D2A',
    accentLight: '#FF7240',
    accentGlow: 'rgba(232,93,42,0.15)',
    primaryText: '#FFFFFF',
    secondaryText: 'rgba(255,255,255,0.55)',
    tertiaryText: 'rgba(255,255,255,0.35)',
    background: '#0D1B2A',
    surface: '#142232',
    surfaceAlt: '#1B2D3E',
    success: '#00D26A',
    danger: '#FF4444',
    divider: 'rgba(255,255,255,0.08)',
  },
  radius: {
    full: '9999px',
    xl: '20px',
    large: '24px',
    medium: '16px',
    small: '8px',
  },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.2)',
    floating: '0 8px 24px rgba(0,0,0,0.3)',
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

const C = THEME.colors;

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    .walk-checkin-screen {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .phone-scroll::-webkit-scrollbar { display: none; }
    .phone-scroll { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes slideInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
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
      50% { opacity: 0.6; }
    }

    .slide-in { animation: slideInUp 280ms ease both; }
    .fade-in  { animation: fadeIn 200ms ease both; }
    .pulse-dot { animation: pulseDot 1.4s ease-in-out infinite; }
    .success-pop { animation: successPop 480ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
    .timer-pulse { animation: timerPulse 2s ease-in-out infinite; }

    .btn-press {
      transition: transform 120ms ease, opacity 120ms ease;
    }
    .btn-press:active {
      transform: scale(0.96);
      opacity: 0.85;
    }

    .toggle-row {
      transition: background 160ms ease;
    }
    .toggle-row:active {
      background: rgba(255,255,255,0.03);
    }

    .pill-btn {
      transition: transform 120ms cubic-bezier(0.34,1.56,0.64,1);
    }
    .pill-btn:active {
      transform: scale(0.93);
    }

    textarea {
      resize: none;
      font-family: inherit;
    }
    textarea:focus {
      outline: none;
    }
  `}</style>
);

// ─── FYLOS LOGO ───────────────────────────────────────────────────────────────
const FylosLogo = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill={C.accent} />
    <path d="M10 22 C10 22 8 18 10 14 C12 10 16 9 16 9 C16 9 20 10 22 14 C24 18 22 22 22 22" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
    <circle cx="13" cy="13" r="1.5" fill="white" />
    <circle cx="19" cy="13" r="1.5" fill="white" />
    <path d="M13 18 C13 18 14.5 19.5 16 19.5 C17.5 19.5 19 18 19 18" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
  </svg>
);

// ─── CARD ─────────────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    background: C.surface,
    borderRadius: THEME.radius.xl,
    boxShadow: THEME.shadows.soft,
    border: `1px solid ${C.divider}`,
    padding: 20,
    ...style,
  }}>
    {children}
  </div>
);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatTime = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
  const s = (secs % 60).toString().padStart(2, '0');
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
};

// ─── CHECKLIST DATA ───────────────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { id: 1, label: 'Leash attached', checked: false },
  { id: 2, label: 'Water bottle', checked: false },
  { id: 3, label: 'Waste bags', checked: false },
  { id: 4, label: 'Treats', checked: false },
];

// ─── STATE 1: PRE-WALK ────────────────────────────────────────────────────────
const PreWalkState = ({ onStartWalk }) => {
  const [checklist, setChecklist] = useState(CHECKLIST_ITEMS);

  const toggle = (id) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const allChecked = checklist.every(i => i.checked);

  return (
    <div className="phone-scroll" style={{
      flex: 1, overflowY: 'auto', padding: 16,
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {/* Booking Info Card */}
      <div className="slide-in" style={{ animationDelay: '0ms' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: C.accentGlow,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <PawPrint size={20} color={C.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.primaryText }}>Sarah Mitchell</div>
              <div style={{ fontSize: 13, color: C.secondaryText, marginTop: 1 }}>Luna (Golden Retriever)</div>
            </div>
            <div style={{
              background: `${C.success}20`, borderRadius: THEME.radius.full, padding: '4px 10px',
            }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.success }}>Confirmed</span>
            </div>
          </div>

          <div style={{ height: 1, background: C.divider, marginBottom: 14 }} />

          {/* Time */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Clock size={15} color={C.accent} />
            <span style={{ fontSize: 13, color: C.secondaryText }}>3:30 PM — 4:30 PM (60 min)</span>
          </div>

          {/* Location */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <MapPin size={15} color={C.accent} />
            <span style={{ fontSize: 13, color: C.secondaryText }}>Riverside Park, 42 Oak Street</span>
          </div>
        </Card>
      </div>

      {/* Checklist */}
      <div className="slide-in" style={{ animationDelay: '60ms' }}>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px 12px' }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.primaryText }}>Pre-Walk Checklist</div>
            <div style={{ fontSize: 12, color: C.tertiaryText, marginTop: 2 }}>Complete all items to start</div>
          </div>
          <div style={{ height: 1, background: C.divider }} />

          {checklist.map((item, idx) => (
            <div
              key={item.id}
              className="toggle-row"
              onClick={() => toggle(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 20px',
                borderBottom: idx < checklist.length - 1 ? `1px solid ${C.divider}` : 'none',
                cursor: 'pointer',
              }}
            >
              <div style={{
                width: 24, height: 24, borderRadius: 8,
                background: item.checked ? C.accent : 'transparent',
                border: item.checked ? 'none' : `2px solid rgba(255,255,255,0.2)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 200ms ease',
                flexShrink: 0,
              }}>
                {item.checked && <Check size={14} color="#fff" strokeWidth={3} />}
              </div>
              <span style={{
                fontSize: 14, flex: 1,
                color: item.checked ? C.primaryText : C.secondaryText,
                fontWeight: item.checked ? 600 : 400,
              }}>
                {item.label}
              </span>
              {item.checked && (
                <span style={{ fontSize: 11, fontWeight: 600, color: C.success }}>Done</span>
              )}
            </div>
          ))}
        </Card>
      </div>

      {/* Start Walk Button */}
      <div className="slide-in" style={{ animationDelay: '120ms', paddingBottom: 8 }}>
        <button
          className="btn-press"
          onClick={allChecked ? onStartWalk : undefined}
          disabled={!allChecked}
          style={{
            width: '100%', padding: 17, border: 'none',
            borderRadius: THEME.radius.xl,
            background: allChecked
              ? `linear-gradient(135deg, ${C.accent} 0%, ${C.accentLight} 100%)`
              : `rgba(232,93,42,0.25)`,
            color: '#fff', fontSize: 16, fontWeight: 700,
            cursor: allChecked ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: allChecked ? `0 6px 24px rgba(232,93,42,0.35)` : 'none',
            opacity: allChecked ? 1 : 0.6,
          }}
        >
          <Play size={18} fill="#fff" />
          Start Walk
        </button>
        {!allChecked && (
          <p style={{ textAlign: 'center', fontSize: 11, color: C.tertiaryText, marginTop: 6 }}>
            Complete all checklist items to begin
          </p>
        )}
      </div>
    </div>
  );
};

// ─── STATE 2: ACTIVE WALK ─────────────────────────────────────────────────────
const ActiveWalkState = ({ elapsedSecs, onEndWalk }) => {
  const distKm = (elapsedSecs * 0.0014).toFixed(2);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div className="phone-scroll" style={{
        flex: 1, overflowY: 'auto', padding: 16,
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>
        {/* Timer Card */}
        <div className="slide-in">
          <Card style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <div className="pulse-dot" style={{
                width: 10, height: 10, borderRadius: '50%', background: C.success,
                boxShadow: `0 0 0 4px ${C.success}30`,
              }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: C.success, letterSpacing: 0.5, textTransform: 'uppercase' }}>
                Walk in Progress
              </span>
            </div>
            <div className="timer-pulse" style={{
              fontSize: 48, fontWeight: 800, color: C.primaryText,
              letterSpacing: 2, lineHeight: 1.1, marginBottom: 6,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {formatTime(elapsedSecs)}
            </div>
            <div style={{ fontSize: 13, color: C.tertiaryText }}>elapsed</div>
          </Card>
        </div>

        {/* Distance Counter */}
        <div className="slide-in" style={{ animationDelay: '40ms' }}>
          <Card style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14,
              background: C.accentGlow,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Navigation size={20} color={C.accent} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.tertiaryText, textTransform: 'uppercase', letterSpacing: 0.4 }}>Distance</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: C.primaryText }}>{distKm} km</div>
            </div>
          </Card>
        </div>

        {/* Mini Map Placeholder */}
        <div className="slide-in" style={{ animationDelay: '80ms' }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              height: 140,
              background: `linear-gradient(145deg, ${C.surfaceAlt} 0%, ${C.surface} 100%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 8,
            }}>
              <MapPin size={28} color={C.tertiaryText} />
              <span style={{ fontSize: 12, color: C.tertiaryText, fontWeight: 500 }}>Route tracking active</span>
            </div>
          </Card>
        </div>

        {/* Update Buttons */}
        <div className="slide-in" style={{ animationDelay: '120ms' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { icon: Camera, label: 'Photo Update', color: C.accent },
              { icon: PawPrint, label: 'Bathroom Break', color: C.secondaryText },
              { icon: Droplets, label: 'Water Break', color: C.accentLight },
            ].map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                className="pill-btn"
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  background: C.surface, border: `1.5px solid ${C.divider}`,
                  borderRadius: THEME.radius.full, padding: '10px 8px',
                  cursor: 'pointer', fontSize: 11, fontWeight: 600, color,
                }}
              >
                <Icon size={14} color={color} />
                <span style={{ whiteSpace: 'nowrap' }}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* End Walk Button */}
        <div className="slide-in" style={{ animationDelay: '160ms', paddingBottom: 8 }}>
          <button
            className="btn-press"
            onClick={onEndWalk}
            style={{
              width: '100%', padding: 17, border: 'none',
              borderRadius: THEME.radius.xl,
              background: C.danger, color: '#fff',
              fontSize: 16, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: `0 6px 24px rgba(255,68,68,0.3)`,
            }}
          >
            <StopCircle size={18} />
            End Walk
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── STATE 3: WALK COMPLETE ───────────────────────────────────────────────────
const WalkCompleteState = ({ elapsedSecs }) => {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const durationMin = Math.floor(elapsedSecs / 60);
  const distKm = (elapsedSecs * 0.0014 + 0.3).toFixed(2);

  if (submitted) {
    return (
      <div className="fade-in" style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', gap: 16,
      }}>
        <div className="success-pop" style={{
          width: 72, height: 72, borderRadius: '50%',
          background: `${C.success}20`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Check size={36} color={C.success} strokeWidth={3} />
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: C.primaryText }}>Report Submitted</div>
        <div style={{ fontSize: 14, color: C.secondaryText, textAlign: 'center', lineHeight: 1.5 }}>
          Sarah has been notified. Great walk today!
        </div>
      </div>
    );
  }

  return (
    <div className="phone-scroll" style={{
      flex: 1, overflowY: 'auto', padding: 16,
      display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      {/* Summary Card */}
      <div className="slide-in">
        <Card>
          <div style={{ fontWeight: 700, fontSize: 15, color: C.primaryText, marginBottom: 16 }}>Walk Summary</div>

          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {[
              { icon: Clock, label: 'Duration', value: `${durationMin} min`, color: C.accent },
              { icon: Navigation, label: 'Distance', value: `${distKm} km`, color: C.accentLight },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} style={{
                flex: 1, background: C.surfaceAlt, borderRadius: 14, padding: '14px 12px',
                display: 'flex', alignItems: 'center', gap: 10,
                border: `1px solid ${C.divider}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: C.primaryText }}>{value}</div>
                  <div style={{ fontSize: 11, color: C.tertiaryText }}>{label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Route placeholder */}
          <div style={{
            height: 80,
            background: `linear-gradient(135deg, ${C.surfaceAlt} 0%, ${C.surface} 100%)`,
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: `1px solid ${C.divider}`,
          }}>
            <MapPin size={18} color={C.tertiaryText} />
            <span style={{ fontSize: 12, color: C.tertiaryText, fontWeight: 500 }}>Route completed</span>
          </div>
        </Card>
      </div>

      {/* Photo Thumbnails */}
      <div className="slide-in" style={{ animationDelay: '50ms' }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.primaryText, marginBottom: 12 }}>Photos</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                flex: 1, height: 72, borderRadius: 12,
                background: `linear-gradient(135deg, ${C.surfaceAlt} 0%, ${C.surface} 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${C.divider}`,
              }}>
                <Camera size={18} color={C.tertiaryText} />
              </div>
            ))}
            <div style={{
              width: 72, height: 72, borderRadius: 12,
              border: `2px dashed rgba(255,255,255,0.15)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}>
              <Camera size={18} color={C.tertiaryText} />
            </div>
          </div>
        </Card>
      </div>

      {/* Notes */}
      <div className="slide-in" style={{ animationDelay: '100ms' }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.primaryText, marginBottom: 10 }}>Walk Notes</div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="How did the walk go? Any notes for the owner..."
            rows={3}
            style={{
              width: '100%', background: C.surfaceAlt,
              border: `1.5px solid ${C.divider}`, borderRadius: 12,
              padding: '12px 14px', fontSize: 13, color: C.primaryText,
              lineHeight: 1.55,
            }}
          />
        </Card>
      </div>

      {/* Rating */}
      <div className="slide-in" style={{ animationDelay: '140ms' }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.primaryText, marginBottom: 4 }}>Rate this walk</div>
          <div style={{ fontSize: 12, color: C.tertiaryText, marginBottom: 12 }}>How was your experience?</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                onClick={() => setRating(i)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: 4, display: 'flex',
                  transition: 'transform 120ms ease',
                }}
              >
                <Star
                  size={28}
                  color={i <= rating ? '#F5A623' : 'rgba(255,255,255,0.15)'}
                  fill={i <= rating ? '#F5A623' : 'none'}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Submit Button */}
      <div className="slide-in" style={{ animationDelay: '180ms', paddingBottom: 8 }}>
        <button
          className="btn-press"
          onClick={() => setSubmitted(true)}
          style={{
            width: '100%', padding: 17, border: 'none',
            borderRadius: THEME.radius.xl,
            background: `linear-gradient(135deg, ${C.accent} 0%, ${C.accentLight} 100%)`,
            color: '#fff',
            fontSize: 16, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: `0 6px 24px rgba(232,93,42,0.35)`,
          }}
        >
          <Check size={18} strokeWidth={3} />
          Submit Report
        </button>
      </div>
    </div>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
const ProWalkCheckinScreen = () => {
  const [screen, setScreen] = useState('pre');
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (screen === 'active') {
      timerRef.current = setInterval(() => {
        setElapsedSecs(s => s + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const handleStartWalk = () => {
    setElapsedSecs(0);
    setScreen('active');
  };

  const handleEndWalk = () => {
    setScreen('complete');
  };

  const headerTitle = {
    pre: 'Walk Details',
    active: 'Walk in Progress',
    complete: 'Walk Report',
  }[screen];

  return (
    <div className="walk-checkin-screen" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E5E5E5',
      padding: '20px',
    }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#0D1B2A', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column' }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 9999 }} />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#FFFFFF' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="7" width="3" height="5" rx="1" fill="#FFFFFF"/><rect x="4.5" y="5" width="3" height="7" rx="1" fill="#FFFFFF"/><rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#FFFFFF"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#FFFFFF"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#FFFFFF"/><path d="M4.75 7.75a4.75 4.75 0 016.5 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 5a8 8 0 0112 0" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="12" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="#FFFFFF" strokeOpacity="0.35"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="#FFFFFF"/><path d="M24 4v4a2 2 0 000-4z" fill="#FFFFFF" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20, background: 'linear-gradient(to bottom, rgba(13,27,42,0.95) 0%, rgba(13,27,42,0.7) 60%, transparent 100%)' }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            {/* Left: Back button */}
            <button
              onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              style={{ background: C.surface, border: `1px solid ${C.divider}`, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
            >
              <ChevronLeft size={22} color="#FFFFFF" />
            </button>
            {/* Center: Title */}
            {screen === 'active' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div className="pulse-dot" style={{
                  width: 8, height: 8, borderRadius: '50%', background: C.success,
                  boxShadow: `0 0 0 3px ${C.success}30`,
                }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.success }}>LIVE</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.primaryText, marginLeft: 4 }}>
                  {formatTime(elapsedSecs)}
                </span>
              </div>
            ) : (
              <h2 style={{ fontSize: 17, fontWeight: 600, color: '#FFFFFF' }}>{headerTitle}</h2>
            )}
            {/* Right: Spacer */}
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Status bar spacer + header content spacer */}
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
        background: 'rgba(13,27,42,0.9)', borderRadius: THEME.radius.full,
        padding: '8px 16px',
        border: `1px solid rgba(255,255,255,0.1)`,
        backdropFilter: 'blur(12px)',
      }}>
        {['pre', 'active', 'complete'].map(s => (
          <button key={s} onClick={() => { setScreen(s); if (s === 'active') setElapsedSecs(923); if (s === 'complete') setElapsedSecs(3600); }} style={{
            background: screen === s ? C.accent : 'transparent',
            border: `1.5px solid ${screen === s ? C.accent : 'rgba(255,255,255,0.2)'}`,
            borderRadius: THEME.radius.full,
            padding: '5px 14px',
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
