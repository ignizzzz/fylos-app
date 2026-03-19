import React, { useState } from 'react';
import {
  ChevronLeft,
  MapPin,
  AlertTriangle,
  Eye,
  Navigation,
  ThumbsUp,
  Share2,
  Plus,
  X,
  Clock,
  Shield,
  Check,
  AlertCircle,
  ChevronRight,
  MessageCircle,
  Info
} from 'lucide-react';

/**
 * 56_DANGER_REPORTS_v1.jsx
 * Community Safety Reports — report and view hazardous areas
 * (poison baits, broken glass, aggressive dogs, icy paths).
 * Fylos Design System compliant.
 */

// ─── THEME ────────────────────────────────────────────────────────────────────
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
    divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)',
    active: '0 8px 30px rgba(0,0,0,0.06)'
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

// ─── DANGER TYPES ─────────────────────────────────────────────────────────────
const DANGER_TYPES = [
  { id: 'poison', label: 'Poison Bait', icon: AlertTriangle, color: THEME.colors.danger },
  { id: 'glass', label: 'Broken Glass', icon: AlertCircle, color: THEME.colors.warning },
  { id: 'dog', label: 'Aggressive Dog', icon: Shield, color: '#FFCC00' },
  { id: 'ice', label: 'Icy Path', icon: Info, color: THEME.colors.info }
];

// ─── MOCK REPORTS ─────────────────────────────────────────────────────────────
const MOCK_REPORTS = [
  {
    id: 1,
    type: 'poison',
    location: 'Lindenhof Park',
    timeAgo: '25 min ago',
    description: 'Suspicious meat pieces found near the fountain area. Multiple colored pellets visible inside.',
    confirms: 12,
    confirmed: false,
    coords: { x: 38, y: 42 }
  },
  {
    id: 2,
    type: 'glass',
    location: 'Seefeld Promenade',
    timeAgo: '1 hr ago',
    description: 'Broken bottle shards scattered across the walking path near the lake shore.',
    confirms: 7,
    confirmed: true,
    coords: { x: 65, y: 55 }
  },
  {
    id: 3,
    type: 'dog',
    location: 'Rieterpark',
    timeAgo: '2 hrs ago',
    description: 'Unleashed large dog showing aggressive behavior towards smaller dogs and people.',
    confirms: 4,
    confirmed: false,
    coords: { x: 45, y: 68 }
  },
  {
    id: 4,
    type: 'ice',
    location: 'Uetliberg Trail',
    timeAgo: '3 hrs ago',
    description: 'Steep section of the trail is completely frozen. Very slippery, no salt applied.',
    confirms: 9,
    confirmed: false,
    coords: { x: 22, y: 35 }
  },
  {
    id: 5,
    type: 'poison',
    location: 'Josefwiese',
    timeAgo: '4 hrs ago',
    description: 'Small white pellets found along the fence line near the dog park entrance.',
    confirms: 15,
    confirmed: true,
    coords: { x: 50, y: 28 }
  }
];

// ─── HELPER ───────────────────────────────────────────────────────────────────
const getDangerType = (typeId) => DANGER_TYPES.find(t => t.id === typeId) || DANGER_TYPES[0];

// ─── MAP PIN COMPONENT ────────────────────────────────────────────────────────
const MapPin2 = ({ report, onClick }) => {
  const type = getDangerType(report.type);
  const Icon = type.icon;
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${report.coords.x}%`,
        top: `${report.coords.y}%`,
        transform: 'translate(-50%, -100%)',
        cursor: 'pointer',
        transition: `transform ${THEME.motion.tap} ${THEME.motion.spring}`
      }}
    >
      <div style={{
        width: 32,
        height: 32,
        borderRadius: '50% 50% 50% 0',
        backgroundColor: type.color,
        transform: 'rotate(-45deg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: THEME.shadows.floating
      }}>
        <Icon size={14} color="white" style={{ transform: 'rotate(45deg)' }} />
      </div>
    </div>
  );
};

// ─── MAP LEGEND ───────────────────────────────────────────────────────────────
const MapLegend = () => (
  <div style={{
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.small,
    padding: '8px 12px',
    boxShadow: THEME.shadows.floating,
    display: 'flex',
    gap: 12,
    border: '1px solid rgba(0,0,0,0.03)'
  }}>
    {DANGER_TYPES.map(type => (
      <div key={type.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{
          width: 8,
          height: 8,
          borderRadius: THEME.radius.full,
          backgroundColor: type.color
        }} />
        <span style={{
          fontSize: 11,
          color: THEME.colors.secondaryText,
          fontWeight: 500
        }}>
          {type.label.split(' ')[0]}
        </span>
      </div>
    ))}
  </div>
);

// ─── MAP VIEW ─────────────────────────────────────────────────────────────────
const MapView = ({ reports, onSelectReport }) => (
  <div style={{
    position: 'relative',
    flex: 1,
    backgroundColor: THEME.colors.surfaceAlt,
    overflow: 'hidden'
  }}>
    {/* Simplified Zürich map SVG */}
    <svg
      viewBox="0 0 400 500"
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    >
      {/* Water / Lake */}
      <ellipse cx="280" cy="350" rx="120" ry="180" fill="#E8F0FE" opacity={0.6} />
      <path d="M160 250 Q200 230 240 250 Q280 270 320 250 L320 500 L160 500 Z" fill="#E8F0FE" opacity={0.4} />

      {/* Streets grid */}
      <g stroke="#DDDDE1" strokeWidth="1.5" fill="none" opacity={0.5}>
        <line x1="50" y1="100" x2="350" y2="100" />
        <line x1="50" y1="180" x2="350" y2="180" />
        <line x1="50" y1="260" x2="300" y2="260" />
        <line x1="80" y1="340" x2="250" y2="340" />
        <line x1="100" y1="50" x2="100" y2="400" />
        <line x1="200" y1="50" x2="200" y2="350" />
        <line x1="300" y1="50" x2="300" y2="300" />
        <path d="M50 150 Q150 120 250 150 Q300 165 350 140" />
        <path d="M80 50 Q120 200 100 350" />
      </g>

      {/* Parks */}
      <rect x="120" y="130" width="50" height="40" rx="8" fill="#D4EDDA" opacity={0.5} />
      <rect x="220" y="200" width="40" height="50" rx="8" fill="#D4EDDA" opacity={0.5} />
      <rect x="60" y="280" width="60" height="45" rx="8" fill="#D4EDDA" opacity={0.5} />

      {/* River Limmat */}
      <path
        d="M180 50 Q190 100 185 150 Q180 200 190 250 Q200 300 195 350"
        fill="none"
        stroke="#C5D9F0"
        strokeWidth="4"
        opacity={0.6}
      />
    </svg>

    {/* Map pins */}
    {reports.map(report => (
      <MapPin2 key={report.id} report={report} onClick={() => onSelectReport(report)} />
    ))}

    {/* Location button */}
    <div style={{
      position: 'absolute',
      top: 16,
      right: 16,
      width: 40,
      height: 40,
      borderRadius: THEME.radius.small,
      backgroundColor: THEME.colors.surface,
      boxShadow: THEME.shadows.floating,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: '1px solid rgba(0,0,0,0.03)'
    }}>
      <Navigation size={18} color={THEME.colors.primaryText} />
    </div>

    {/* Eye toggle */}
    <div style={{
      position: 'absolute',
      top: 64,
      right: 16,
      width: 40,
      height: 40,
      borderRadius: THEME.radius.small,
      backgroundColor: THEME.colors.surface,
      boxShadow: THEME.shadows.floating,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: '1px solid rgba(0,0,0,0.03)'
    }}>
      <Eye size={18} color={THEME.colors.primaryText} />
    </div>

    <MapLegend />
  </div>
);

// ─── REPORT CARD ──────────────────────────────────────────────────────────────
const ReportCard = ({ report }) => {
  const [confirmed, setConfirmed] = useState(report.confirmed);
  const [confirms, setConfirms] = useState(report.confirms);
  const type = getDangerType(report.type);
  const Icon = type.icon;

  const handleConfirm = () => {
    if (!confirmed) {
      setConfirms(c => c + 1);
      setConfirmed(true);
    }
  };

  return (
    <div style={{
      backgroundColor: THEME.colors.surface,
      borderRadius: '20px',
      padding: 20,
      boxShadow: THEME.shadows.soft,
      border: '1px solid rgba(0,0,0,0.03)'
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: THEME.radius.small,
            backgroundColor: `${type.color}14`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon size={18} color={type.color} />
          </div>
          <div>
            <span style={{
              fontSize: 13,
              fontWeight: 600,
              color: type.color,
              display: 'block',
              lineHeight: 1
            }}>
              {type.label}
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 4
            }}>
              <MapPin size={12} color={THEME.colors.secondaryText} />
              <span style={{ fontSize: 13, color: THEME.colors.secondaryText }}>{report.location}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={12} color={THEME.colors.tertiaryText} />
          <span style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>{report.timeAgo}</span>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 15,
        lineHeight: 1.5,
        color: THEME.colors.primaryText,
        opacity: 0.9,
        margin: 0,
        marginBottom: 14,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {report.description}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          onClick={handleConfirm}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: THEME.radius.full,
            backgroundColor: confirmed ? `${THEME.colors.accent}10` : THEME.colors.surfaceAlt,
            cursor: 'pointer',
            transition: `all ${THEME.motion.tap} ease`
          }}
        >
          <ThumbsUp
            size={14}
            color={confirmed ? THEME.colors.accent : THEME.colors.secondaryText}
            fill={confirmed ? THEME.colors.accent : 'none'}
          />
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: confirmed ? THEME.colors.accent : THEME.colors.secondaryText
          }}>
            {confirms}
          </span>
        </div>
        <div style={{
          width: 32,
          height: 32,
          borderRadius: THEME.radius.full,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <Share2 size={16} color={THEME.colors.tertiaryText} />
        </div>
      </div>
    </div>
  );
};

// ─── FEED VIEW ────────────────────────────────────────────────────────────────
const FeedView = ({ reports }) => (
  <div style={{
    flex: 1,
    overflowY: 'auto',
    padding: '0 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  }}>
    {reports.map(report => (
      <ReportCard key={report.id} report={report} />
    ))}
  </div>
);

// ─── REPORT MODAL (BOTTOM SHEET) ──────────────────────────────────────────────
const ReportModal = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState('poison');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.3)',
          zIndex: 50,
          transition: `opacity ${THEME.motion.fade} ease`
        }}
      />

      {/* Sheet */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: THEME.colors.surface,
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        zIndex: 51,
        padding: '12px 24px 34px',
        maxHeight: '75%',
        overflowY: 'auto'
      }}>
        {/* Drag handle */}
        <div style={{
          width: 36,
          height: 4,
          borderRadius: THEME.radius.full,
          backgroundColor: THEME.colors.divider,
          margin: '0 auto 20px'
        }} />

        {/* Title */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20
        }}>
          <h2 style={{
            fontSize: 22,
            fontWeight: 600,
            color: THEME.colors.primaryText,
            letterSpacing: '-0.3px',
            margin: 0
          }}>
            New Report
          </h2>
          <div
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: THEME.radius.full,
              backgroundColor: THEME.colors.surfaceAlt,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={16} color={THEME.colors.secondaryText} />
          </div>
        </div>

        {/* Type selector - horizontal pills */}
        <div style={{ marginBottom: 20 }}>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: THEME.colors.secondaryText,
            opacity: 0.8,
            display: 'block',
            marginBottom: 10
          }}>
            Type
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {DANGER_TYPES.map(type => {
              const isActive = selectedType === type.id;
              const Icon = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '8px 14px',
                    borderRadius: THEME.radius.full,
                    backgroundColor: isActive ? `${type.color}14` : THEME.colors.surfaceAlt,
                    border: isActive ? `1.5px solid ${type.color}` : '1.5px solid transparent',
                    cursor: 'pointer',
                    transition: `all ${THEME.motion.tap} ease`
                  }}
                >
                  <Icon size={14} color={isActive ? type.color : THEME.colors.tertiaryText} />
                  <span style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: isActive ? type.color : THEME.colors.secondaryText
                  }}>
                    {type.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location input */}
        <div style={{ marginBottom: 16 }}>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: THEME.colors.secondaryText,
            opacity: 0.8,
            display: 'block',
            marginBottom: 8
          }}>
            Location
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '12px 14px',
            borderRadius: THEME.radius.medium,
            backgroundColor: THEME.colors.surfaceAlt,
            border: '1px solid rgba(0,0,0,0.06)'
          }}>
            <MapPin size={16} color={THEME.colors.tertiaryText} />
            <input
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="Enter location or use current"
              style={{
                border: 'none',
                outline: 'none',
                flex: 1,
                fontSize: 15,
                color: THEME.colors.primaryText,
                backgroundColor: 'transparent',
                fontFamily: 'inherit'
              }}
            />
            <Navigation size={16} color={THEME.colors.accent} style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Description textarea */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: THEME.colors.secondaryText,
            opacity: 0.8,
            display: 'block',
            marginBottom: 8
          }}>
            Description
          </span>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what you found..."
            rows={3}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: THEME.radius.medium,
              backgroundColor: THEME.colors.surfaceAlt,
              border: '1px solid rgba(0,0,0,0.06)',
              fontSize: 15,
              color: THEME.colors.primaryText,
              fontFamily: 'inherit',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Submit button */}
        <div
          style={{
            width: '100%',
            padding: '15px 0',
            borderRadius: THEME.radius.medium,
            background: 'linear-gradient(135deg, #FF7240, #E85D2A)',
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: 600,
            textAlign: 'center',
            cursor: 'pointer',
            transition: `transform ${THEME.motion.tap} ${THEME.motion.spring}`,
            letterSpacing: '-0.2px'
          }}
        >
          Submit Report
        </div>
      </div>
    </>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function Screen_56_DANGER_REPORTS_v1() {
  const [activeTab, setActiveTab] = useState('map');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const activeCount = MOCK_REPORTS.length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
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
            <h2 className="text-[17px] font-semibold text-[#111111]">Safety Reports</h2>
            {/* Right: Danger count badge */}
            <button
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <AlertTriangle size={22} color="#111111" />
            </button>
          </div>
        </header>

        {/* Scrollable content wrapper */}
        <div className="absolute inset-0 overflow-y-auto" style={{ paddingTop: 54, paddingBottom: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(844px - 54px - 40px)', paddingTop: 54 }}>

        {/* Toggle: Map / Feed */}
        <div style={{
          margin: '0 20px 16px',
          padding: 3,
          borderRadius: 10,
          backgroundColor: THEME.colors.surfaceAlt,
          display: 'flex',
          flexShrink: 0
        }}>
          {['map', 'feed'].map(tab => {
            const isActive = activeTab === tab;
            return (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  textAlign: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  borderRadius: 8,
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#000000' : 'transparent',
                  color: isActive ? '#FFFFFF' : THEME.colors.secondaryText,
                  transition: `all ${THEME.motion.tab} ${THEME.motion.spring}`,
                  letterSpacing: '-0.1px'
                }}
              >
                {tab === 'map' ? 'Map' : 'Feed'}
              </div>
            );
          })}
        </div>

        {/* Content */}
        {activeTab === 'map' ? (
          <MapView reports={MOCK_REPORTS} onSelectReport={setSelectedReport} />
        ) : (
          <FeedView reports={MOCK_REPORTS} />
        )}

        {/* FAB - Add Report */}
        <div
          onClick={() => setModalOpen(true)}
          style={{
            position: 'absolute',
            bottom: 34,
            right: 20,
            width: 52,
            height: 52,
            borderRadius: THEME.radius.full,
            background: 'linear-gradient(135deg, #FF7240, #E85D2A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(232,93,42,0.35)',
            zIndex: 30,
            transition: `transform ${THEME.motion.tap} ${THEME.motion.spring}`
          }}
        >
          <Plus size={24} color="#FFFFFF" />
        </div>

        {/* Report Modal */}
        <ReportModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
        </div>
      </div>
    </div>
  );
}
