import React, { useState, useMemo, useRef, useCallback } from 'react';

// Directional scroll collapse — same as Activity tab pattern
function useDirectionalCollapse(maxProgress, opts = {}) {
  const { hideFactor = 1, showFactor = 2.2, topReset = 8 } = opts;
  const [progress, setProgress] = useState(0);
  const lastY = useRef(0);
  const handleScroll = useCallback((e) => {
    const y = e?.currentTarget?.scrollTop ?? 0;
    const rawDelta = y - lastY.current;
    const delta = Math.max(-36, Math.min(36, rawDelta));
    lastY.current = y;
    if (y <= topReset) { setProgress(0); return; }
    setProgress((prev) => {
      if (delta > 0) return Math.min(maxProgress, prev + delta * hideFactor);
      if (delta < 0) return Math.max(0, prev + delta * showFactor);
      return prev;
    });
  }, [maxProgress, hideFactor, showFactor, topReset]);
  return { progress, handleScroll };
}
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Filter,
  AlertTriangle,
  MapPin,
  Clock,
  Shield,
  Camera,
  Navigation,
  Check,
  CheckCheck,
  Loader2,
  Bell,
} from 'lucide-react';

/**
 * 56_DANGER_REPORTS_v1.jsx
 * Community Safety Reports — warm minimal redesign.
 * Map + Feed views, pin sheet, and a centered report popup.
 */

// ---------------- Category definitions ----------------
const CATEGORIES = {
  poison: {
    id: 'poison',
    label: 'Poison bait',
    short: 'Poison',
    color: '#FF3B30',
    bg: '#FFEBEA',
    ring: 'rgba(255,59,48,0.18)',
    severity: 'Critical',
  },
  glass: {
    id: 'glass',
    label: 'Broken glass',
    short: 'Glass',
    color: '#FF6B35',
    bg: '#FFF1EC',
    ring: 'rgba(255,107,53,0.16)',
    severity: 'High',
  },
  aggressive: {
    id: 'aggressive',
    label: 'Aggressive animal',
    short: 'Aggressive',
    color: '#FF6B35',
    bg: '#FFF1EC',
    ring: 'rgba(255,107,53,0.16)',
    severity: 'High',
  },
  icy: {
    id: 'icy',
    label: 'Icy path',
    short: 'Icy',
    color: '#FFB800',
    bg: '#FFF8E5',
    ring: 'rgba(255,184,0,0.18)',
    severity: 'Medium',
  },
  construction: {
    id: 'construction',
    label: 'Construction',
    short: 'Construction',
    color: '#6E6058',
    bg: '#F3EFEB',
    ring: 'rgba(110,96,88,0.18)',
    severity: 'Info',
  },
  other: {
    id: 'other',
    label: 'Other hazard',
    short: 'Other',
    color: '#6E6058',
    bg: '#F3EFEB',
    ring: 'rgba(110,96,88,0.18)',
    severity: 'Info',
  },
};

// ---------------- Mini SVG glyphs for categories ----------------
function CategoryGlyph({ id, size = 14, color = '#FFF' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  switch (id) {
    case 'poison':
      return (
        <svg {...common}>
          <path d="M12 3l9 16H3z" />
          <path d="M12 10v4" />
          <circle cx="12" cy="17" r="0.6" fill={color} stroke="none" />
        </svg>
      );
    case 'glass':
      return (
        <svg {...common}>
          <path d="M4 4l6 6-3 10 8-7 5 5" />
          <path d="M10 10l4-2" />
        </svg>
      );
    case 'aggressive':
      return (
        <svg {...common}>
          <circle cx="5.5" cy="9" r="1.6" />
          <circle cx="10" cy="5.5" r="1.6" />
          <circle cx="14" cy="5.5" r="1.6" />
          <circle cx="18.5" cy="9" r="1.6" />
          <path d="M7 16c0-2.5 2.2-4.5 5-4.5s5 2 5 4.5-2 3.5-5 3.5-5-1-5-3.5z" />
        </svg>
      );
    case 'icy':
      return (
        <svg {...common}>
          <path d="M12 2v20" />
          <path d="M4.5 6.5l15 11" />
          <path d="M4.5 17.5l15-11" />
        </svg>
      );
    case 'construction':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 005.4-5.4l-2.3 2.3-2.8-2.8 2.3-2.3z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4" />
          <circle cx="12" cy="16" r="0.6" fill={color} stroke="none" />
        </svg>
      );
  }
}

// ---------------- Custom pin ----------------
function DangerPin({ category, selected, onClick, style }) {
  const c = CATEGORIES[category] || CATEGORIES.other;
  return (
    <button
      onClick={onClick}
      className="absolute pointer-events-auto transition-transform"
      style={{
        ...style,
        transform: `translate(-50%, -100%) scale(${selected ? 1.08 : 1})`,
        filter: selected ? 'drop-shadow(0 6px 14px rgba(0,0,0,0.18))' : 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))',
        transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <div className="relative flex flex-col items-center">
        <div
          className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
          style={{
            background: c.color,
            border: '3px solid #FFF',
            boxShadow: `0 0 0 4px ${c.ring}`,
          }}
        >
          <CategoryGlyph id={category} size={16} color="#FFF" />
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `10px solid ${c.color}`,
            marginTop: -2,
          }}
        />
      </div>
    </button>
  );
}

// ---------------- Mock data ----------------
const MOCK_REPORTS = [
  {
    id: 'r1',
    category: 'poison',
    title: 'Poison bait sighting',
    location: 'Seefeld Park',
    distance: 320,
    time: '5m ago',
    description:
      'Found near the entrance, looks like rat poison in a small blue container. Stay alert with your dog.',
    confirmations: 3,
    resolved: 0,
    photo:
      'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?auto=format&fit=crop&w=600&q=60',
    posX: 62, posY: 34,
    author: 'Lena K.',
    status: 'active',
  },
  {
    id: 'r2',
    category: 'aggressive',
    title: 'Off-leash aggressive dog',
    location: 'Kreuzstrasse',
    distance: 540,
    time: '22m ago',
    description: 'Large dog off leash, owner not in sight. Growled at my terrier.',
    confirmations: 2,
    resolved: 0,
    posX: 34, posY: 58,
    author: 'Marco B.',
    status: 'active',
  },
  {
    id: 'r3',
    category: 'glass',
    title: 'Broken glass on path',
    location: 'Limmat riverside',
    distance: 780,
    time: '1h ago',
    description: 'Shattered bottle across the gravel walkway just past the bench cluster.',
    confirmations: 5,
    resolved: 0,
    posX: 74, posY: 68,
    author: 'Iris M.',
    status: 'active',
  },
  {
    id: 'r4',
    category: 'icy',
    title: 'Icy stretch along slope',
    location: 'Burghölzli hill',
    distance: 910,
    time: '2h ago',
    description: 'Frozen patch after the bend — slippery, paws and ankles at risk.',
    confirmations: 1,
    resolved: 0,
    posX: 22, posY: 22,
    author: 'Jonas T.',
    status: 'active',
  },
  {
    id: 'r5',
    category: 'construction',
    title: 'Sidewalk construction',
    location: 'Bahnhofstrasse',
    distance: 1120,
    time: '5h ago',
    description: 'Fenced-off work area, narrow detour. Noise and debris nearby.',
    confirmations: 0,
    resolved: 0,
    posX: 82, posY: 18,
    author: 'Ana R.',
    status: 'active',
  },
  {
    id: 'r6',
    category: 'glass',
    title: 'Glass shards in sandbox',
    location: 'Hottingen playground',
    distance: 640,
    time: '3h ago',
    description: 'Someone reported glass fragments mixed in the sand — avoid for pups.',
    confirmations: 2,
    resolved: 1,
    photo:
      'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?auto=format&fit=crop&w=600&q=60',
    posX: 48, posY: 80,
    author: 'Peter S.',
    status: 'active',
  },
  {
    id: 'r7',
    category: 'poison',
    title: 'Suspicious food scraps',
    location: 'Zürichhorn',
    distance: 1450,
    time: 'yesterday',
    description: 'Meat pieces scattered near fence line. Possibly tampered.',
    confirmations: 4,
    resolved: 1,
    posX: 12, posY: 72,
    author: 'Sofia L.',
    status: 'resolved',
  },
  {
    id: 'r8',
    category: 'aggressive',
    title: 'Territorial cat reports',
    location: 'Hirslanden backstreet',
    distance: 820,
    time: 'yesterday',
    description: 'Stray cat attacking smaller dogs passing through the alley.',
    confirmations: 1,
    resolved: 0,
    posX: 56, posY: 50,
    author: 'Nora F.',
    status: 'active',
  },
];

const FILTER_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'poison', label: 'Poison' },
  { id: 'glass', label: 'Glass' },
  { id: 'aggressive', label: 'Aggressive' },
  { id: 'icy', label: 'Icy' },
  { id: 'construction', label: 'Work' },
];

const CATEGORY_GRID = ['poison', 'glass', 'aggressive', 'icy', 'construction', 'other'];

// ---------------- Map background ----------------
function MapCanvas() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse at 50% 40%, #F3EFEB 0%, #ECE6DF 55%, #E4DDD4 100%)',
      }}
    >
      {/* subtle grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.35 }}>
        <defs>
          <pattern id="mapgrid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#D9D1C6" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapgrid)" />
      </svg>

      {/* faux roads */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <path d="M -20 280 Q 180 220 420 340" stroke="#E6DFD4" strokeWidth="26" fill="none" />
        <path d="M 60 -20 Q 120 240 260 500 Q 320 640 460 700"
          stroke="#E6DFD4" strokeWidth="20" fill="none" />
        <path d="M -20 540 Q 200 500 440 520" stroke="#E6DFD4" strokeWidth="18" fill="none" />
        <path d="M 320 -20 Q 360 160 260 320 Q 180 440 440 540"
          stroke="#E6DFD4" strokeWidth="14" fill="none" />
      </svg>

      {/* green blob (park) */}
      <div
        className="absolute rounded-[40%_55%_45%_60%]"
        style={{
          background: 'linear-gradient(135deg, rgba(196,210,176,0.55), rgba(214,224,197,0.35))',
          width: 200,
          height: 160,
          left: '52%',
          top: '22%',
          filter: 'blur(1px)',
        }}
      />
      {/* water blob */}
      <div
        className="absolute rounded-[55%_45%_60%_40%]"
        style={{
          background: 'linear-gradient(135deg, rgba(183,204,216,0.55), rgba(206,222,230,0.35))',
          width: 260,
          height: 140,
          left: '-10%',
          top: '60%',
          filter: 'blur(1px)',
        }}
      />
    </div>
  );
}

// ---------------- User location dot ----------------
function UserDot() {
  return (
    <div
      className="absolute"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      {/* radius ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: 260,
          height: 260,
          left: -130,
          top: -130,
          border: '1px dashed rgba(232,93,42,0.35)',
          background:
            'radial-gradient(circle, rgba(232,93,42,0.06) 0%, rgba(232,93,42,0) 70%)',
        }}
      />
      {/* pulse */}
      <div
        className="absolute rounded-full"
        style={{
          width: 44, height: 44, left: -22, top: -22,
          background: 'rgba(46,111,221,0.18)',
          animation: 'dangerPulse 2.2s ease-out infinite',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 16, height: 16, left: -8, top: -8,
          background: '#2E6FDD',
          border: '3px solid #FFF',
          boxShadow: '0 2px 6px rgba(46,111,221,0.45)',
        }}
      />
    </div>
  );
}

// ---------------- Feed card ----------------
function FeedCard({ report, onTap }) {
  const c = CATEGORIES[report.category];
  const distanceLabel =
    report.distance >= 1000 ? `${(report.distance / 1000).toFixed(1)}km` : `${report.distance}m`;

  return (
    <button
      onClick={onTap}
      className="w-full text-left rounded-[18px] overflow-hidden active:scale-[0.995] transition-all"
      style={{
        background: '#FFFFFF',
        border: '1px solid #EDE8E2',
        boxShadow: '0 1px 0 rgba(0,0,0,0.015)',
      }}
    >
      <div className="flex">
        <div style={{ width: 3, background: c.color }} />
        <div className="flex-1 p-4">
          <div className="flex items-start gap-3">
            <div
              className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0"
              style={{ background: c.bg }}
            >
              <CategoryGlyph id={report.category} size={16} color={c.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[15px] font-semibold text-[#111] tracking-tight truncate">
                  {report.title}
                </h3>
                <span className="text-[11px] text-[#A09A94] shrink-0 mt-[2px]">{report.time}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[12px] text-[#6E6058]">
                <MapPin size={11} strokeWidth={1.75} />
                <span className="truncate">{report.location}</span>
                <span className="text-[#A09A94]">·</span>
                <span>{distanceLabel} away</span>
              </div>
              <p
                className="mt-2 text-[13px] leading-snug text-[#3F3A35]"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {report.description}
              </p>

              {report.photo && (
                <div
                  className="mt-3 rounded-[12px] overflow-hidden"
                  style={{ border: '1px solid #EDE8E2', height: 110 }}
                >
                  <img
                    src={report.photo}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="mt-3 flex items-center gap-3 text-[12px]">
                <div className="flex items-center gap-1 text-[#6E6058]">
                  <CheckCheck size={13} strokeWidth={1.75} color={c.color} />
                  <span>
                    <span className="text-[#111] font-medium">{report.confirmations}</span>{' '}
                    confirmed
                  </span>
                </div>
                {report.resolved > 0 && (
                  <div className="flex items-center gap-1 text-[#6E6058]">
                    <Shield size={12} strokeWidth={1.75} />
                    <span>{report.resolved} resolved</span>
                  </div>
                )}
                <div
                  className="ml-auto text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    color: c.color,
                    background: c.bg,
                  }}
                >
                  {c.severity}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ---------------- Main component ----------------
export default function DangerReportsScreen() {
  const [viewMode, setViewMode] = useState('map'); // map | feed
  const { progress: collapseProgress, handleScroll: handleScrollCollapse } = useDirectionalCollapse(96, { showFactor: 2.5 });
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const tabsHidden = clamp01(collapseProgress / 48);
  const chipsHidden = clamp01((collapseProgress - 48) / 48);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportFormOpen, setReportFormOpen] = useState(false);
  const [reportFormStep, setReportFormStep] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formLocation, setFormLocation] = useState('Current location · Seefeld');
  const [formDescription, setFormDescription] = useState('');
  const [formSeverity, setFormSeverity] = useState('High');
  const [formPhoto, setFormPhoto] = useState(false);
  const [confirmedIds, setConfirmedIds] = useState(new Set());

  const filteredReports = useMemo(() => {
    if (activeFilter === 'all') return MOCK_REPORTS;
    return MOCK_REPORTS.filter((r) => r.category === activeFilter);
  }, [activeFilter]);

  const openReportForm = () => {
    setReportFormOpen(true);
    setReportFormStep('category');
    setSelectedCategory(null);
    setFormDescription('');
    setFormPhoto(false);
  };

  const closeReportForm = () => {
    setReportFormOpen(false);
    setTimeout(() => {
      setReportFormStep('category');
      setSelectedCategory(null);
    }, 220);
  };

  const toggleConfirm = (id) => {
    setConfirmedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isEmpty = filteredReports.length === 0;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E5E5',
        padding: '20px',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      }}
    >
    <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#F7F5F2', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
      <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: '#F7F5F2' }}
    >
      <style>{`
        @keyframes dangerPulse {
          0% { transform: scale(0.6); opacity: 0.6; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes quickLogPopIn {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes quickLogFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes sheetSlideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .ease-soft { transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1); }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { scrollbar-width: none; }
      `}</style>

      {/* TOP GRADIENT FADE — only covers header zone, tabs/chips float over content */}
      <div className="absolute top-0 left-0 w-full h-[100px] z-20 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/85 to-transparent" />

      {/* BOTTOM GRADIENT FADE — covers FAB zone */}
      <div className="absolute bottom-0 left-0 w-full h-[120px] z-20 pointer-events-none bg-gradient-to-t from-[#F7F5F2] via-[#F7F5F2]/85 to-transparent" />

      {/* HEADER — back / centered title / filter */}
      <header
        className="absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none"
      >
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button
            onClick={() => window.history.back()}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all"
            style={{ background: '#F3EFEB' }}
          >
            <ChevronLeft size={20} color="#111" strokeWidth={1.5} />
          </button>
          <h2 className="text-[17px] font-semibold text-[#111] tracking-tight">Safety</h2>
          <button
            className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all"
            style={{ background: '#F3EFEB' }}
          >
            <Filter size={18} color="#111" strokeWidth={1.75} />
          </button>
        </div>
      </header>

      {/* Segmented control — matches Activity tab pattern */}
      <div
        className="absolute top-[112px] left-0 w-full z-30 px-5 transition-all duration-150 ease-out"
        style={{
          transform: `translateY(${-tabsHidden * 48}px)`,
          opacity: 1 - tabsHidden,
          pointerEvents: tabsHidden > 0.9 ? 'none' : 'auto',
        }}
      >
        <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-black/[0.04] relative">
          <div
            className="absolute top-1.5 bottom-1.5 bg-[#111] rounded-full transition-all duration-[300ms]"
            style={{
              width: `calc(50% - 12px)`,
              left: `calc(${viewMode === 'map' ? 0 : 50}% + 6px)`,
              transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
            }}
          />
          {['map', 'feed'].map((mode) => {
            const active = viewMode === mode;
            return (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`relative z-10 flex-1 py-1.5 text-[13px] font-semibold capitalize transition-colors duration-[200ms] ${active ? 'text-white' : 'text-[#A09A94]'}`}
              >
                {mode}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating filter chips — shared between map and feed */}
      <div
        className="absolute top-[170px] left-0 right-0 px-5 z-30 pointer-events-none transition-all duration-150 ease-out"
        style={{
          transform: `translateY(${-collapseProgress}px)`,
          opacity: 1 - chipsHidden,
        }}
      >
        <div className="flex gap-2 overflow-x-auto hide-scroll pointer-events-auto">
          {FILTER_CHIPS.map((chip) => {
            const active = activeFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all backdrop-blur-md ${
                  active ? 'bg-[#111] text-white' : 'bg-white/85 text-[#6E6058] border border-[#EDE8E2]'
                }`}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENT */}
      <div className="absolute inset-0">
        {viewMode === 'map' ? (
          <MapView
            reports={filteredReports}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onSelect={(r) => setSelectedReport(r)}
            selectedId={selectedReport?.id}
            isEmpty={isEmpty}
            openReportForm={openReportForm}
          />
        ) : (
          <FeedView
            reports={filteredReports}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            onSelect={(r) => setSelectedReport(r)}
            isEmpty={isEmpty}
            openReportForm={openReportForm}
            onScroll={handleScrollCollapse}
          />
        )}
      </div>

      {/* FAB */}
      <button
        onClick={openReportForm}
        className="absolute bottom-6 right-5 z-30 w-[56px] h-[56px] rounded-full flex items-center justify-center active:scale-[0.92] transition-all ease-soft"
        style={{
          background: '#FF3B30',
          boxShadow: '0 4px 20px rgba(255,59,48,0.35)',
        }}
      >
        <Plus size={24} color="#FFF" strokeWidth={2.5} />
      </button>

      {/* Pin/Card detail sheet */}
      {selectedReport && (
        <ReportDetailSheet
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          confirmed={confirmedIds.has(selectedReport.id)}
          toggleConfirm={() => toggleConfirm(selectedReport.id)}
        />
      )}

      {/* Report form popup */}
      {reportFormOpen && (
        <ReportFormPopup
          step={reportFormStep}
          setStep={setReportFormStep}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          location={formLocation}
          setLocation={setFormLocation}
          description={formDescription}
          setDescription={setFormDescription}
          severity={formSeverity}
          setSeverity={setFormSeverity}
          photo={formPhoto}
          setPhoto={setFormPhoto}
          onClose={closeReportForm}
        />
      )}
    </div>
    </div>
    </div>
  );
}

// ---------------- Map View ----------------
function MapView({ reports, activeFilter, setActiveFilter, onSelect, selectedId, isEmpty, openReportForm }) {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 overflow-hidden">
        <MapCanvas />

        {/* Pins */}
        {reports.map((r) => (
          <DangerPin
            key={r.id}
            category={r.category}
            selected={selectedId === r.id}
            onClick={() => onSelect(r)}
            style={{ left: `${r.posX}%`, top: `${r.posY}%` }}
          />
        ))}

        <UserDot />

        {/* Empty map */}
        {isEmpty && (
          <div
            className="absolute left-1/2 top-[66%] -translate-x-1/2 px-4 py-3 rounded-[14px] text-center"
            style={{
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid #EDE8E2',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="text-[13px] font-medium text-[#111]">You're in a safe zone</div>
            <div className="text-[11px] text-[#6E6058] mt-0.5">No reports within 1km</div>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-7 left-3 right-[80px] z-40">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-full overflow-x-auto hide-scroll"
            style={{
              background: 'rgba(255,255,255,0.9)',
              border: '1px solid #EDE8E2',
              backdropFilter: 'blur(6px)',
            }}
          >
            {['poison', 'glass', 'aggressive', 'icy', 'construction'].map((k) => {
              const c = CATEGORIES[k];
              return (
                <div key={k} className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="w-[8px] h-[8px] rounded-full"
                    style={{ background: c.color }}
                  />
                  <span className="text-[11px] text-[#6E6058]">{c.short}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Feed View ----------------
function FeedView({ reports, activeFilter, setActiveFilter, onSelect, isEmpty, openReportForm, onScroll }) {
  return (
    <div
      className="w-full h-full overflow-y-auto hide-scroll"
      style={{ paddingTop: 210, paddingBottom: 100 }}
      onScroll={onScroll}
    >
      <div className="px-5">
        {/* Heading strip */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[12px] text-[#A09A94] tracking-wide uppercase">Nearby</div>
          <div className="text-[12px] text-[#6E6058]">
            {reports.length} report{reports.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Cards */}
        {isEmpty ? (
          <EmptyState onReport={() => {}} />
        ) : (
          <div className="flex flex-col gap-3 pb-6">
            {reports.map((r) => (
              <FeedCard key={r.id} report={r} onTap={() => onSelect(r)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Empty state ----------------
function EmptyState({ onReport }) {
  return (
    <div
      className="rounded-[20px] px-6 py-10 flex flex-col items-center text-center"
      style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
    >
      <div
        className="w-[64px] h-[64px] rounded-full flex items-center justify-center mb-4"
        style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}
      >
        <Shield size={28} color="#E85D2A" strokeWidth={1.5} />
      </div>
      <div className="text-[16px] font-semibold text-[#111] tracking-tight">
        You're in a safe zone
      </div>
      <div className="text-[13px] text-[#6E6058] mt-1">No reports within 1km</div>
      <button
        onClick={onReport}
        className="mt-5 px-5 h-[40px] rounded-full text-[13px] font-semibold text-[#FFF] active:scale-[0.97] transition-all"
        style={{ background: '#111' }}
      >
        Report a danger
      </button>
    </div>
  );
}

// ---------------- Report detail sheet ----------------
function ReportDetailSheet({ report, onClose, confirmed, toggleConfirm }) {
  const c = CATEGORIES[report.category];
  const distanceLabel =
    report.distance >= 1000 ? `${(report.distance / 1000).toFixed(1)}km` : `${report.distance}m`;

  return (
    <div className="absolute inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30"
        style={{ animation: 'quickLogFadeIn 220ms ease-out' }}
        onClick={onClose}
      />
      <div
        className="absolute left-0 right-0 bottom-0 rounded-t-[24px] p-5 pb-8"
        style={{
          background: '#F7F5F2',
          border: '1px solid #EDE8E2',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.08)',
          animation: 'sheetSlideUp 320ms cubic-bezier(0.22, 1, 0.36, 1)',
          maxHeight: '85%',
          overflowY: 'auto',
        }}
      >
        {/* grabber */}
        <div className="flex justify-center mb-3">
          <div
            className="w-[36px] h-[4px] rounded-full"
            style={{ background: '#D9D1C6' }}
          />
        </div>

        {/* header */}
        <div className="flex items-start gap-3">
          <div
            className="w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: c.bg }}
          >
            <CategoryGlyph id={report.category} size={22} color={c.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wide" style={{ color: c.color }}>
              {c.severity}
            </div>
            <div className="text-[18px] font-semibold text-[#111] tracking-tight">
              {report.title}
            </div>
            <div className="text-[12px] text-[#6E6058] mt-0.5">
              Posted by {report.author} · {report.time}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
            style={{ background: '#F3EFEB' }}
          >
            <X size={16} color="#111" strokeWidth={1.75} />
          </button>
        </div>

        {/* Photo */}
        {report.photo && (
          <div
            className="mt-4 rounded-[16px] overflow-hidden"
            style={{ border: '1px solid #EDE8E2', height: 170 }}
          >
            <img src={report.photo} alt="" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Location + directions */}
        <div
          className="mt-4 p-4 rounded-[16px] flex items-center gap-3"
          style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
        >
          <div
            className="w-[40px] h-[40px] rounded-full flex items-center justify-center"
            style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}
          >
            <MapPin size={16} color="#111" strokeWidth={1.75} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-medium text-[#111] truncate">{report.location}</div>
            <div className="text-[12px] text-[#6E6058]">{distanceLabel} from you</div>
          </div>
          <button
            className="h-[36px] px-3 rounded-full flex items-center gap-1 text-[12px] font-medium text-[#FFF]"
            style={{ background: '#111' }}
          >
            <Navigation size={13} strokeWidth={2} />
            Directions
          </button>
        </div>

        {/* Description */}
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-[#A09A94] mb-1">Details</div>
          <p className="text-[14px] leading-relaxed text-[#3F3A35]">{report.description}</p>
        </div>

        {/* Confirmations */}
        <div
          className="mt-4 p-4 rounded-[16px]"
          style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}
        >
          <div className="flex items-center gap-2">
            <CheckCheck size={16} color={c.color} strokeWidth={1.75} />
            <div className="text-[14px] text-[#111]">
              <span className="font-semibold">
                {report.confirmations + (confirmed ? 1 : 0)} people
              </span>{' '}
              confirmed this
            </div>
          </div>
          <button
            onClick={toggleConfirm}
            className="mt-3 w-full h-[42px] rounded-full text-[13px] font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: confirmed ? c.bg : '#111',
              color: confirmed ? c.color : '#FFF',
              border: confirmed ? `1px solid ${c.color}` : 'none',
            }}
          >
            {confirmed ? <Check size={15} strokeWidth={2.25} /> : null}
            {confirmed ? 'You confirmed' : 'I confirm too'}
          </button>
        </div>

        {/* Status / Actions */}
        <div className="mt-4 flex items-center gap-2">
          <div
            className="flex-1 h-[40px] rounded-full flex items-center justify-center gap-1.5 text-[12px] font-medium"
            style={{
              background: report.status === 'resolved' ? '#EEF7EC' : '#FFF',
              color: report.status === 'resolved' ? '#2E7D32' : '#6E6058',
              border: '1px solid #EDE8E2',
            }}
          >
            {report.status === 'resolved' ? (
              <CheckCheck size={13} strokeWidth={2} />
            ) : (
              <Loader2 size={13} strokeWidth={2} />
            )}
            {report.status === 'resolved' ? 'Resolved' : 'Active'}
          </div>
          <button
            className="h-[40px] px-4 rounded-full text-[12px] font-medium text-[#6E6058]"
            style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
          >
            Mark resolved
          </button>
        </div>

        <button
          className="mt-3 w-full text-[12px] text-[#A09A94] py-2"
          onClick={onClose}
        >
          Report inaccurate
        </button>
      </div>
    </div>
  );
}

// ---------------- Report form popup ----------------
function ReportFormPopup({
  step,
  setStep,
  selectedCategory,
  setSelectedCategory,
  location,
  setLocation,
  description,
  setDescription,
  severity,
  setSeverity,
  photo,
  setPhoto,
  onClose,
}) {
  const cat = selectedCategory ? CATEGORIES[selectedCategory] : null;

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center px-5">
      <div
        className="absolute inset-0 bg-black/40"
        style={{ animation: 'quickLogFadeIn 220ms ease-out' }}
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-[360px] rounded-[24px] p-5"
        style={{
          background: '#F7F5F2',
          border: '1px solid #EDE8E2',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          animation: 'quickLogPopIn 260ms cubic-bezier(0.22, 1, 0.36, 1)',
          maxHeight: '88%',
          overflowY: 'auto',
        }}
      >
        {/* header */}
        <div className="flex items-center justify-between">
          {step === 'details' ? (
            <button
              onClick={() => setStep('category')}
              className="w-[32px] h-[32px] rounded-full flex items-center justify-center"
              style={{ background: '#F3EFEB' }}
            >
              <ChevronLeft size={16} color="#111" strokeWidth={1.75} />
            </button>
          ) : (
            <div className="w-[32px]" />
          )}
          <div className="text-[15px] font-semibold text-[#111] tracking-tight">
            {step === 'category' ? 'Report a danger' : 'Add details'}
          </div>
          <button
            onClick={onClose}
            className="w-[32px] h-[32px] rounded-full flex items-center justify-center"
            style={{ background: '#F3EFEB' }}
          >
            <X size={14} color="#111" strokeWidth={1.75} />
          </button>
        </div>

        {step === 'category' ? (
          <>
            <div className="text-[12px] text-[#6E6058] text-center mt-1">
              What did you spot?
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {CATEGORY_GRID.map((id) => {
                const c = CATEGORIES[id];
                return (
                  <button
                    key={id}
                    onClick={() => {
                      setSelectedCategory(id);
                      setSeverity(c.severity);
                      setStep('details');
                    }}
                    className="aspect-square rounded-[16px] flex flex-col items-center justify-center gap-1.5 active:scale-[0.97] transition-all ease-soft"
                    style={{
                      background: c.bg,
                      border: `1px solid ${c.color}22`,
                    }}
                  >
                    <div
                      className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
                      style={{ background: c.color }}
                    >
                      <CategoryGlyph id={id} size={16} color="#FFF" />
                    </div>
                    <span
                      className="text-[11px] font-medium tracking-tight"
                      style={{ color: c.color }}
                    >
                      {c.short}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Category tag */}
            {cat && (
              <div className="flex items-center gap-2 mt-3">
                <div
                  className="w-[32px] h-[32px] rounded-full flex items-center justify-center"
                  style={{ background: cat.color }}
                >
                  <CategoryGlyph id={cat.id} size={14} color="#FFF" />
                </div>
                <div>
                  <div className="text-[14px] font-semibold text-[#111]">{cat.label}</div>
                  <div className="text-[11px]" style={{ color: cat.color }}>
                    {cat.severity} severity
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            <div className="mt-4">
              <div className="text-[11px] uppercase tracking-wide text-[#A09A94] mb-1.5">
                Location
              </div>
              <button
                className="w-full flex items-center gap-2 px-3 h-[44px] rounded-[12px] text-left"
                style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}
              >
                <MapPin size={15} color="#E85D2A" strokeWidth={1.75} />
                <span className="flex-1 text-[13px] text-[#111] truncate">{location}</span>
                <ChevronRight size={14} color="#A09A94" strokeWidth={1.75} />
              </button>
            </div>

            {/* Description */}
            <div className="mt-3">
              <div className="text-[11px] uppercase tracking-wide text-[#A09A94] mb-1.5">
                Description
              </div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What should others know?"
                rows={3}
                className="w-full px-3 py-2.5 rounded-[12px] text-[13px] text-[#111] placeholder-[#A09A94] resize-none focus:outline-none"
                style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}
              />
            </div>

            {/* Severity */}
            <div className="mt-3">
              <div className="text-[11px] uppercase tracking-wide text-[#A09A94] mb-1.5">
                Severity
              </div>
              <div className="flex gap-1.5">
                {['Critical', 'High', 'Medium', 'Info'].map((s) => {
                  const active = severity === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSeverity(s)}
                      className="flex-1 h-[34px] rounded-full text-[12px] font-medium tracking-tight"
                      style={{
                        background: active ? '#111' : '#FFFFFF',
                        color: active ? '#FFF' : '#6E6058',
                        border: '1px solid #EDE8E2',
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo */}
            <button
              onClick={() => setPhoto(!photo)}
              className="mt-3 w-full h-[44px] rounded-[12px] flex items-center gap-2 px-3 text-[13px] font-medium"
              style={{
                background: photo ? '#FFEBEA' : '#FFFFFF',
                color: photo ? '#FF3B30' : '#6E6058',
                border: `1px solid ${photo ? '#FF3B30' : '#EDE8E2'}`,
              }}
            >
              <Camera size={15} strokeWidth={1.75} />
              {photo ? 'Photo attached' : 'Add photo (optional)'}
              {photo && <Check size={14} className="ml-auto" strokeWidth={2.25} />}
            </button>

            {/* Submit */}
            <button
              onClick={onClose}
              className="mt-5 w-full h-[48px] rounded-full text-[14px] font-semibold text-[#FFF] flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              style={{
                background: '#FF3B30',
                boxShadow: '0 6px 20px rgba(255,59,48,0.3)',
              }}
            >
              <AlertTriangle size={15} strokeWidth={2.25} />
              Report danger
            </button>
            <div className="mt-2 text-center text-[11px] text-[#A09A94]">
              Your report helps keep the community safe
            </div>
          </>
        )}
      </div>
    </div>
  );
}
