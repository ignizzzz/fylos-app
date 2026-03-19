import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  MapPin,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  Activity,
  Check,
  Circle,
  ArrowRight,
  PawPrint
} from 'lucide-react';

/**
 * 40_GPS_TRACKING_v1.jsx
 * Live GPS Tracking screen — real-time walk tracking with map,
 * walker info, live stats, and route timeline.
 * Fylos Design System compliant.
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

    .gps-font-brand { font-family: 'Nunito', sans-serif; }
    .gps-font-body  { font-family: 'Inter', sans-serif; }

    @keyframes gps-ripple {
      0%   { transform: scale(1);   opacity: 0.6; }
      100% { transform: scale(3.5); opacity: 0; }
    }
    @keyframes gps-walkerPulse {
      0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(232,93,42,0.45); }
      50%       { transform: scale(1.08); box-shadow: 0 0 0 10px rgba(232,93,42,0); }
    }
    @keyframes gps-liveGlow {
      0%, 100% { box-shadow: 0 0 0 0 rgba(0,192,96,0.5); }
      50%       { box-shadow: 0 0 0 6px rgba(0,192,96,0); }
    }
    @keyframes gps-liveDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.4; transform: scale(0.7); }
    }
    @keyframes gps-routeDraw {
      from { stroke-dashoffset: 600; }
      to   { stroke-dashoffset: 0; }
    }
    @keyframes gps-timelinePulse {
      0%, 100% { transform: scale(1);   opacity: 1; }
      50%       { transform: scale(1.35); opacity: 0.65; }
    }
    @keyframes gps-slideUp {
      from { transform: translateY(30px); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }

    .gps-live-badge { animation: gps-liveGlow 1.6s ease-in-out infinite; }
    .gps-live-dot   { animation: gps-liveDot 1.2s ease-in-out infinite; }
    .gps-walker-dot { animation: gps-walkerPulse 2s ease-in-out infinite; }
    .gps-ripple     { animation: gps-ripple 2s ease-out infinite; }
    .gps-ripple-2   { animation: gps-ripple 2s ease-out 0.7s infinite; }
    .gps-timeline-current { animation: gps-timelinePulse 1.6s ease-in-out infinite; }
    .gps-slide-up   { animation: gps-slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

    .gps-btn {
      transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease;
      cursor: pointer;
      border: none;
      background: none;
      padding: 0;
    }
    .gps-btn:active { transform: scale(0.92); }

    .gps-scroll::-webkit-scrollbar { display: none; }
    .gps-scroll { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

/* ── Simplified Zurich Map (SVG) ── */
const ZurichMap = () => {
  const W = 390;
  const H = 500;

  const routePoints = [
    [80, 400], [82, 360], [100, 320], [130, 290],
    [158, 268], [192, 250], [225, 238], [260, 228],
    [290, 218], [310, 200], [318, 178], [315, 155], [300, 140]
  ];

  const routePath = routePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`)
    .join(' ');

  const walkerPos = routePoints[routePoints.length - 1];
  const startPos = routePoints[0];

  return (
    <div style={{ position: 'relative', width: `${W}px`, height: `${H}px`, overflow: 'hidden' }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
        <rect width={W} height={H} fill="#EDF0E8" />
        <rect x="215" y="105" width="135" height="175" rx="22" fill="#C6DAA0" opacity="0.8" />
        <rect x="232" y="215" width="85" height="55" rx="14" fill="#B5CF8C" opacity="0.65" />
        <rect x="45" y="340" width="65" height="80" rx="14" fill="#C6DAA0" opacity="0.6" />
        <rect x="50" y="195" width="60" height="45" rx="10" fill="#C6DAA0" opacity="0.55" />
        <ellipse cx="195" cy="470" rx="130" ry="30" fill="#B0D4EE" opacity="0.5" />
        <ellipse cx="305" cy="320" rx="28" ry="16" fill="#AED6F1" opacity="0.6" />
        <rect x="18" y="55" width="55" height="48" rx="6" fill="#D6D6CE" opacity="0.75" />
        <rect x="88" y="38" width="48" height="38" rx="6" fill="#DADAD2" opacity="0.7" />
        <rect x="152" y="50" width="42" height="42" rx="6" fill="#D3D3CB" opacity="0.75" />
        <rect x="18" y="125" width="38" height="52" rx="6" fill="#DBDBD3" opacity="0.7" />
        <rect x="18" y="252" width="28" height="35" rx="4" fill="#D6D6CE" opacity="0.65" />
        <rect x="120" y="415" width="50" height="42" rx="6" fill="#D6D6CE" opacity="0.7" />
        <rect x="185" y="385" width="48" height="50" rx="6" fill="#DADAD2" opacity="0.7" />
        <rect x="248" y="355" width="55" height="60" rx="6" fill="#D3D3CB" opacity="0.75" />
        <rect x="318" y="335" width="50" height="55" rx="6" fill="#DBDBD3" opacity="0.7" />
        <rect x="340" y="190" width="38" height="50" rx="6" fill="#D6D6CE" opacity="0.75" />
        <rect x="342" y="95" width="40" height="60" rx="6" fill="#DADAD2" opacity="0.7" />
        <rect x="338" y="35" width="38" height="48" rx="6" fill="#D3D3CB" opacity="0.75" />
        <line x1="0" y1="92" x2={W} y2="92" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="0" y1="196" x2={W} y2="196" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="0" y1="300" x2={W} y2="300" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="0" y1="398" x2={W} y2="398" stroke="#FFFFFF" strokeWidth="7" />
        <line x1="58" y1="0" x2="58" y2={H} stroke="#FFFFFF" strokeWidth="7" />
        <line x1="156" y1="0" x2="156" y2={H} stroke="#FFFFFF" strokeWidth="7" />
        <line x1="252" y1="0" x2="252" y2={H} stroke="#FFFFFF" strokeWidth="7" />
        <line x1="332" y1="0" x2="332" y2={H} stroke="#FFFFFF" strokeWidth="7" />
        <line x1="0" y1="92" x2={W} y2="92" stroke="#EBE8DA" strokeWidth="1" strokeDasharray="8,8" />
        <line x1="0" y1="196" x2={W} y2="196" stroke="#EBE8DA" strokeWidth="1" strokeDasharray="8,8" />
        <line x1="0" y1="300" x2={W} y2="300" stroke="#EBE8DA" strokeWidth="1" strokeDasharray="8,8" />
        <line x1="0" y1="398" x2={W} y2="398" stroke="#EBE8DA" strokeWidth="1" strokeDasharray="8,8" />
        <line x1="58" y1="0" x2="58" y2={H} stroke="#EBE8DA" strokeWidth="1" strokeDasharray="8,8" />
        <line x1="156" y1="0" x2="156" y2={H} stroke="#EBE8DA" strokeWidth="1" strokeDasharray="8,8" />
        <line x1="0" y1="145" x2={W} y2="145" stroke="#F3F3ED" strokeWidth="4" />
        <line x1="0" y1="248" x2={W} y2="248" stroke="#F3F3ED" strokeWidth="4" />
        <line x1="0" y1="350" x2={W} y2="350" stroke="#F3F3ED" strokeWidth="4" />
        <line x1="106" y1="0" x2="106" y2={H} stroke="#F3F3ED" strokeWidth="4" />
        <line x1="202" y1="0" x2="202" y2={H} stroke="#F3F3ED" strokeWidth="4" />
        <line x1="292" y1="0" x2="292" y2={H} stroke="#F3F3ED" strokeWidth="4" />
        <text x="282" y="170" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600" fill="#5A7A3A" opacity="0.85">Zurichberg</text>
        <text x="78" y="385" textAnchor="middle" fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600" fill="#5A7A3A" opacity="0.75">Seefeld Park</text>
        <path d={routePath} fill="none" stroke="rgba(232,93,42,0.15)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={routePath} fill="none" stroke={THEME.colors.accent} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="10,6" style={{ animation: 'gps-routeDraw 2.4s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both' }} />
        <g transform={`translate(${startPos[0]}, ${startPos[1]})`}>
          <circle cx="0" cy="0" r="12" fill={THEME.colors.surface} />
          <circle cx="0" cy="0" r="10" fill={THEME.colors.surfaceAlt} />
        </g>
      </svg>

      <div style={{ position: 'absolute', left: `${startPos[0]}px`, top: `${startPos[1]}px`, transform: 'translate(-50%, -50%)', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <PawPrint size={12} color={THEME.colors.accent} strokeWidth={2.5} />
      </div>

      <div style={{ position: 'absolute', left: `${walkerPos[0]}px`, top: `${walkerPos[1]}px`, transform: 'translate(-50%, -50%)' }}>
        <div className="gps-ripple" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(232,93,42,0.4)', pointerEvents: 'none' }} />
        <div className="gps-ripple-2" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: 30, height: 30, borderRadius: '50%', border: '2px solid rgba(232,93,42,0.25)', pointerEvents: 'none' }} />
        <div className="gps-walker-dot" style={{ position: 'relative', width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #FFB347 0%, #E85D2A 100%)', border: '3px solid #FFFFFF', boxShadow: '0 2px 10px rgba(232,93,42,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito', sans-serif", fontSize: 14, fontWeight: 800, color: '#FFFFFF' }}>
          S
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, transparent, rgba(249,249,251,0.7))', pointerEvents: 'none' }} />
    </div>
  );
};

const formatTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const TimelineItem = ({ label, time, done, isCurrent, isLast }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 22, flexShrink: 0 }}>
      <div className={isCurrent ? 'gps-timeline-current' : undefined} style={{
        width: 22, height: 22, borderRadius: '50%',
        background: isCurrent ? `${THEME.colors.accent}18` : done ? `${THEME.colors.success}15` : THEME.colors.surfaceAlt,
        border: isCurrent ? `2.5px solid ${THEME.colors.accent}` : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        {isCurrent ? <div style={{ width: 8, height: 8, borderRadius: '50%', background: THEME.colors.accent }} />
          : done ? <Check size={11} color={THEME.colors.success} strokeWidth={2.5} />
          : <Circle size={8} color={THEME.colors.tertiaryText} strokeWidth={2} />}
      </div>
      {!isLast && <div style={{ width: 2, flex: 1, minHeight: 18, background: THEME.colors.divider, marginTop: 4, marginBottom: 4, borderRadius: 1 }} />}
    </div>
    <div style={{ flex: 1, paddingBottom: isLast ? 0 : 14 }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600, color: THEME.colors.primaryText, marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: THEME.colors.tertiaryText }}>{time}</div>
    </div>
  </div>
);

const GPSTrackingScreen = () => {
  const [elapsed, setElapsed] = useState(1935);
  useEffect(() => { const id = setInterval(() => setElapsed(p => p + 1), 1000); return () => clearInterval(id); }, []);

  const duration = formatTime(elapsed);
  const distance = '1.8';
  const pace = "5'24\"";

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
        <div className="relative gps-font-body" style={{
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

          {/* Full-screen Map */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 500, overflow: 'hidden' }}>
            <ZurichMap />
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
              {/* Center: Live Tracking badge */}
              <div className="gps-live-badge" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderRadius: THEME.radius.full, padding: '7px 14px 7px 11px', boxShadow: THEME.shadows.floating
              }}>
                <div className="gps-live-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: THEME.colors.success, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: THEME.colors.primaryText, letterSpacing: '-0.1px' }}>Live Tracking</span>
              </div>
              {/* Right: Invisible spacer */}
              <div className="w-[44px]" />
            </div>
          </header>

          {/* Bottom Sheet */}
          <div className="gps-slide-up" style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 380,
            background: THEME.colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
            boxShadow: '0 -4px 24px rgba(0,0,0,0.06)', overflow: 'hidden', zIndex: 30
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10, paddingBottom: 6 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: THEME.colors.divider }} />
            </div>
            <div className="gps-scroll" style={{ height: 'calc(100% - 20px)', overflowY: 'auto', paddingLeft: 20, paddingRight: 20, paddingBottom: 34 }}>
              {/* Walker info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FFB347 0%, #E85D2A 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  border: '2.5px solid #FFFFFF', boxShadow: '0 2px 8px rgba(232,93,42,0.25)',
                  fontFamily: "'Nunito', sans-serif", fontSize: 18, fontWeight: 800, color: '#FFFFFF'
                }}>S</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 16, fontWeight: 800, color: THEME.colors.primaryText, letterSpacing: '-0.3px', marginBottom: 2 }}>Sarah M.</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: THEME.colors.success, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: THEME.colors.secondaryText, fontWeight: 500 }}>Walking Luna</span>
                  </div>
                </div>
              </div>

              {/* Live stats */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <div style={{ flex: 1, background: THEME.colors.surfaceAlt, borderRadius: THEME.radius.medium, padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Clock size={16} color={THEME.colors.secondaryText} strokeWidth={2} />
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, fontWeight: 800, color: THEME.colors.primaryText, letterSpacing: '-0.5px', fontVariantNumeric: 'tabular-nums' }}>{duration}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: THEME.colors.tertiaryText }}>Duration</div>
                </div>
                <div style={{ flex: 1, background: THEME.colors.surfaceAlt, borderRadius: THEME.radius.medium, padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <MapPin size={16} color={THEME.colors.secondaryText} strokeWidth={2} />
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, fontWeight: 800, color: THEME.colors.primaryText, letterSpacing: '-0.5px' }}>{distance} <span style={{ fontSize: 12, fontWeight: 600, color: THEME.colors.secondaryText }}>km</span></div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: THEME.colors.tertiaryText }}>Distance</div>
                </div>
                <div style={{ flex: 1, background: THEME.colors.surfaceAlt, borderRadius: THEME.radius.medium, padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <Activity size={16} color={THEME.colors.secondaryText} strokeWidth={2} />
                  <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 18, fontWeight: 800, color: THEME.colors.primaryText, letterSpacing: '-0.5px' }}>{pace}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 500, color: THEME.colors.tertiaryText }}>Pace</div>
                </div>
              </div>

              {/* Timeline */}
              <div style={{ background: THEME.colors.surfaceAlt, borderRadius: 20, padding: 16, marginBottom: 16 }}>
                <div style={{ fontFamily: "'Nunito', sans-serif", fontSize: 13, fontWeight: 800, color: THEME.colors.primaryText, letterSpacing: '-0.2px', marginBottom: 12 }}>Route Timeline</div>
                <TimelineItem label="Started at Seefeld Park" time="2:00 PM" done />
                <TimelineItem label="Passed Zurichberg" time="2:18 PM" done />
                <TimelineItem label="Currently walking" time="Now" isCurrent isLast />
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="gps-btn" onClick={() => { window.location.href = '/chat'; }} style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '14px 0', borderRadius: THEME.radius.medium,
                  background: THEME.colors.surfaceAlt, border: `1.5px solid ${THEME.colors.divider}`
                }}>
                  <MessageCircle size={16} color={THEME.colors.accent} strokeWidth={2.5} />
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText }}>Message Walker</span>
                </button>
                <button className="gps-btn" style={{
                  width: 50, height: 50, flexShrink: 0, borderRadius: THEME.radius.medium,
                  background: 'transparent', border: `1.5px solid ${THEME.colors.divider}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Phone size={20} color={THEME.colors.success} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GPSTrackingScreen;
