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
  History,
  Megaphone,
  ThumbsUp,
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
    minutesAgo: 5,
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
    minutesAgo: 22,
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
    author: 'You',
    byMe: true,
    status: 'active',
    minutesAgo: 60,
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
    minutesAgo: 120,
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
    minutesAgo: 300,
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
    author: 'You',
    byMe: true,
    status: 'active',
    minutesAgo: 180,
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
    minutesAgo: 1440,
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
    minutesAgo: 1620,
  },
];

// Time bucketing helper
const TIME_BUCKETS = [
  { id: 'recent', label: 'Last hour', max: 60 },
  { id: 'today', label: 'Today', max: 1440 },
  { id: 'earlier', label: 'Earlier', max: Infinity },
];
function getTimeBucket(min) {
  return TIME_BUCKETS.find((b) => min <= b.max)?.id || 'earlier';
}

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
function UserDot({ radius = 1000 }) {
  // Map 250m -> 130px diameter, 2000m -> 360px diameter
  const ringPx = 130 + Math.round(((radius - 250) / 1750) * 230);
  const half = ringPx / 2;
  return (
    <div
      className="absolute"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
    >
      {/* radius ring */}
      <div
        className="absolute rounded-full transition-all duration-500 ease-out"
        style={{
          width: ringPx,
          height: ringPx,
          left: -half,
          top: -half,
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
      className="w-full text-left rounded-[20px] overflow-hidden active:scale-[0.99] transition-all bg-white"
      style={{
        border: '1px solid #EDE8E2',
        boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
      }}
    >
      {/* HERO PHOTO + SEVERITY BADGE OVERLAY */}
      {report.photo && (
        <div className="relative w-full h-[140px] overflow-hidden">
          <img src={report.photo} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          <div
            className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,0.92)' }}
          >
            <span
              className="w-[6px] h-[6px] rounded-full"
              style={{ background: c.color }}
            />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: c.color }}>
              {c.severity}
            </span>
          </div>
          <span className="absolute top-3 right-3 text-[11px] font-medium text-white/95 backdrop-blur-md bg-black/30 px-2 py-0.5 rounded-full">
            {report.time}
          </span>
        </div>
      )}

      {/* CONTENT */}
      <div className="px-4 pt-4 pb-3.5">
        {/* Title + severity (if no photo) */}
        <div className="flex items-start justify-between gap-3 mb-1">
          <h3 className="text-[16px] font-bold text-[#111] tracking-[-0.2px] leading-tight flex-1">
            {report.title}
          </h3>
          {!report.photo && (
            <div
              className="flex items-center gap-1 px-2 py-0.5 rounded-full shrink-0 mt-0.5"
              style={{ background: c.bg }}
            >
              <span className="w-[5px] h-[5px] rounded-full" style={{ background: c.color }} />
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: c.color }}>
                {c.severity}
              </span>
            </div>
          )}
        </div>

        {/* Location strip */}
        <div className="flex items-center gap-1.5 text-[12px] text-[#A09A94]">
          <MapPin size={11} strokeWidth={1.75} className="text-[#A09A94]" />
          <span className="truncate">{report.location}</span>
          <span className="text-[#CFCAC3]">·</span>
          <span className="font-semibold text-[#6E6058]">{distanceLabel}</span>
          {!report.photo && (
            <>
              <span className="text-[#CFCAC3]">·</span>
              <span>{report.time}</span>
            </>
          )}
        </div>

        {/* Description */}
        <p
          className="mt-2.5 text-[13px] leading-[1.5] text-[#6E6058]"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {report.description}
        </p>

        {/* Footer — confirmations + action */}
        <div className="mt-3.5 pt-3 flex items-center justify-between border-t border-dashed border-[#EDE8E2]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div
                className="w-[20px] h-[20px] rounded-full flex items-center justify-center"
                style={{ background: c.bg }}
              >
                <CheckCheck size={11} strokeWidth={2.5} color={c.color} />
              </div>
              <span className="text-[12px] font-semibold text-[#111]">
                {report.confirmations}
              </span>
              <span className="text-[12px] text-[#A09A94]">confirmed</span>
            </div>
            {report.resolved > 0 && (
              <div className="flex items-center gap-1 text-[12px] text-[#A09A94]">
                <Shield size={11} strokeWidth={2} />
                <span>{report.resolved}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-[12px] font-semibold" style={{ color: c.color }}>
            <span>Details</span>
            <ChevronRight size={12} strokeWidth={2.5} />
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
  // Chips collapse first (0-48), then tabs collapse (48-96)
  const chipsHidden = clamp01(collapseProgress / 48);
  const tabsHidden = clamp01((collapseProgress - 48) / 48);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportFormOpen, setReportFormOpen] = useState(false);
  const [reportFormStep, setReportFormStep] = useState('category');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formLocation, setFormLocation] = useState('Current location · Seefeld');
  const [formDescription, setFormDescription] = useState('');
  const [formSeverity, setFormSeverity] = useState('High');
  const [formPhoto, setFormPhoto] = useState(null); // data URL string or null
  const [confirmedIds, setConfirmedIds] = useState(new Set(['r2', 'r4']));
  const [resolvedOverrides, setResolvedOverrides] = useState({}); // id -> 'active' | 'resolved'
  const [historyOpen, setHistoryOpen] = useState(false);
  const [previewedReport, setPreviewedReport] = useState(null);
  const [radius, setRadius] = useState(1000); // meters

  const getReportStatus = (report) =>
    resolvedOverrides[report.id] ?? report.status;

  const setReportStatus = (id, nextStatus) => {
    setResolvedOverrides((prev) => ({ ...prev, [id]: nextStatus }));
  };

  const filteredReports = useMemo(() => {
    return MOCK_REPORTS
      .filter((r) => r.distance <= radius)
      .filter((r) => activeFilter === 'all' || r.category === activeFilter);
  }, [activeFilter, radius]);

  const activeFilterChip = FILTER_CHIPS.find((c) => c.id === activeFilter);

  const openReportForm = () => {
    setReportFormOpen(true);
    setReportFormStep('category');
    setSelectedCategory(null);
    setFormDescription('');
    setFormPhoto(null);
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
            onClick={() => setHistoryOpen(true)}
            className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.97] transition-all"
            style={{ background: '#F3EFEB' }}
            aria-label="My activity"
          >
            <History size={18} color="#111" strokeWidth={1.75} />
            {(() => {
              const resolvedByMe = Object.values(resolvedOverrides).filter((v) => v === 'resolved').length;
              const total = MOCK_REPORTS.filter((r) => r.byMe).length + confirmedIds.size + resolvedByMe;
              if (total === 0) return null;
              return (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                  style={{ background: '#E85D2A', border: '2px solid #F7F5F2' }}
                >
                  {total}
                </span>
              );
            })()}
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
            onPreview={(r) => setPreviewedReport(r)}
            previewedReport={previewedReport}
            onClearPreview={() => setPreviewedReport(null)}
            onOpenDetails={(r) => { setPreviewedReport(null); setSelectedReport(r); }}
            onViewInFeed={(r) => { setPreviewedReport(null); setViewMode('feed'); }}
            selectedId={previewedReport?.id || selectedReport?.id}
            isEmpty={isEmpty}
            openReportForm={openReportForm}
            radius={radius}
            setRadius={setRadius}
            activeFilterChip={activeFilterChip}
            resetFilter={() => setActiveFilter('all')}
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
            activeFilterChip={activeFilterChip}
            resetFilter={() => setActiveFilter('all')}
            radius={radius}
          />
        )}
      </div>

      {/* FAB */}
      <button
        onClick={openReportForm}
        className="absolute bottom-[72px] right-3 z-40 w-[56px] h-[56px] rounded-full flex items-center justify-center active:scale-[0.92] transition-all ease-soft"
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
          status={getReportStatus(selectedReport)}
          onChangeStatus={(s) => setReportStatus(selectedReport.id, s)}
          onClose={() => setSelectedReport(null)}
          confirmed={confirmedIds.has(selectedReport.id)}
          toggleConfirm={() => toggleConfirm(selectedReport.id)}
        />
      )}

      {/* History sheet */}
      {historyOpen && (
        <HistorySheet
          allReports={MOCK_REPORTS}
          confirmedIds={confirmedIds}
          resolvedOverrides={resolvedOverrides}
          getReportStatus={getReportStatus}
          onClose={() => setHistoryOpen(false)}
          onSelect={(report) => {
            setHistoryOpen(false);
            setSelectedReport(report);
          }}
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
const RADIUS_OPTIONS = [
  { value: 250, label: '250m' },
  { value: 500, label: '500m' },
  { value: 1000, label: '1km' },
  { value: 2000, label: '2km' },
];

function MapView({
  reports,
  activeFilter,
  setActiveFilter,
  onPreview,
  previewedReport,
  onClearPreview,
  onOpenDetails,
  onViewInFeed,
  selectedId,
  isEmpty,
  openReportForm,
  radius,
  setRadius,
  activeFilterChip,
  resetFilter,
}) {
  const isFiltered = activeFilterChip && activeFilterChip.id !== 'all';
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
            onClick={() => onPreview(r)}
            style={{ left: `${r.posX}%`, top: `${r.posY}%` }}
          />
        ))}

        <UserDot radius={radius} />

        {/* Empty map */}
        {isEmpty && (
          <div
            className="absolute left-1/2 top-[58%] -translate-x-1/2 px-4 py-3 rounded-[14px] text-center max-w-[260px]"
            style={{
              background: 'rgba(255,255,255,0.95)',
              border: '1px solid #EDE8E2',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div className="text-[13px] font-semibold text-[#111]">
              {isFiltered ? `No ${activeFilterChip.label.toLowerCase()} reports` : 'You\u2019re in a safe zone'}
            </div>
            <div className="text-[11px] text-[#6E6058] mt-0.5">
              {isFiltered
                ? `Within ${radius >= 1000 ? `${radius / 1000}km` : `${radius}m`} \u00b7 no matches`
                : `No reports within ${radius >= 1000 ? `${radius / 1000}km` : `${radius}m`}`}
            </div>
            {isFiltered && (
              <button
                onClick={resetFilter}
                className="mt-2 px-3 h-[28px] rounded-full text-[11px] font-semibold text-white"
                style={{ background: '#111' }}
              >
                Show all
              </button>
            )}
          </div>
        )}

        {/* Radius selector — bottom-left, above legend, beside FAB */}
        <div className="absolute bottom-[64px] left-3 z-40">
          <div
            className="flex items-center gap-1 p-1 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid #EDE8E2',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
            }}
          >
            {RADIUS_OPTIONS.map((opt) => {
              const active = radius === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setRadius(opt.value)}
                  className="h-[26px] px-2.5 rounded-full text-[11px] font-semibold transition-all"
                  style={{
                    background: active ? '#111' : 'transparent',
                    color: active ? '#FFF' : '#6E6058',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend — full width, all categories visible */}
        <div className="absolute bottom-6 left-3 right-3 z-30">
          <div
            className="flex items-center justify-between gap-1 px-3 py-2 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.92)',
              border: '1px solid #EDE8E2',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
            }}
          >
            {['poison', 'glass', 'aggressive', 'icy', 'construction'].map((k) => {
              const c = CATEGORIES[k];
              return (
                <div key={k} className="flex items-center gap-1.5 shrink-0 min-w-0">
                  <span
                    className="w-[8px] h-[8px] rounded-full shrink-0"
                    style={{ background: c.color }}
                  />
                  <span className="text-[11px] text-[#6E6058] truncate">{c.short}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preview pill */}
        {previewedReport && (
          <MapPreviewPill
            report={previewedReport}
            onClose={onClearPreview}
            onOpenDetails={() => onOpenDetails(previewedReport)}
            onViewInFeed={() => onViewInFeed(previewedReport)}
          />
        )}
      </div>
    </div>
  );
}

// ---------------- Map preview pill ----------------
function MapPreviewPill({ report, onClose, onOpenDetails, onViewInFeed }) {
  const c = CATEGORIES[report.category];
  const distLabel = report.distance >= 1000 ? `${(report.distance / 1000).toFixed(1)}km` : `${report.distance}m`;
  return (
    <div
      className="absolute left-3 right-3 bottom-[150px] z-50"
      style={{ animation: 'sheetSlideUp 280ms cubic-bezier(0.22, 1, 0.36, 1)' }}
    >
      <div
        className="rounded-[18px] overflow-hidden"
        style={{
          background: '#FFFFFF',
          border: '1px solid #EDE8E2',
          boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
        }}
      >
        <div className="p-3 flex items-center gap-3">
          <div
            className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: c.bg }}
          >
            <CategoryGlyph id={report.category} size={20} color={c.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-px rounded-full"
                style={{ background: c.bg, color: c.color }}
              >
                {c.severity}
              </span>
              <span className="text-[11px] text-[#A09A94]">{report.time}</span>
            </div>
            <div className="text-[14px] font-bold text-[#111] tracking-tight truncate mt-0.5">
              {report.title}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-[#6E6058] mt-0.5">
              <MapPin size={10} strokeWidth={1.75} />
              <span className="truncate">{report.location}</span>
              <span className="text-[#CFCAC3]">·</span>
              <span className="font-semibold">{distLabel}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-[28px] h-[28px] rounded-full flex items-center justify-center shrink-0"
            style={{ background: '#F3EFEB' }}
            aria-label="Dismiss preview"
          >
            <X size={13} color="#6E6058" strokeWidth={2} />
          </button>
        </div>
        <div className="px-3 pb-3 flex items-center gap-2">
          <button
            onClick={onOpenDetails}
            className="flex-1 h-[36px] rounded-full text-[12px] font-semibold text-white flex items-center justify-center gap-1"
            style={{ background: '#111' }}
          >
            View details
            <ChevronRight size={13} strokeWidth={2.5} />
          </button>
          <button
            onClick={onViewInFeed}
            className="h-[36px] px-3 rounded-full text-[12px] font-semibold flex items-center gap-1"
            style={{ background: '#F3EFEB', color: '#6E6058', border: '1px solid #EDE8E2' }}
          >
            In feed
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Feed View ----------------
function FeedView({ reports, activeFilter, setActiveFilter, onSelect, isEmpty, openReportForm, onScroll, activeFilterChip, resetFilter, radius }) {
  // Group by time bucket, preserving the original ordering inside each group
  const grouped = TIME_BUCKETS.map((b) => ({
    ...b,
    items: reports.filter((r) => getTimeBucket(r.minutesAgo ?? 0) === b.id),
  })).filter((g) => g.items.length > 0);

  const isFiltered = activeFilterChip && activeFilterChip.id !== 'all';
  const radiusLabel = radius >= 1000 ? `${radius / 1000}km` : `${radius}m`;

  return (
    <div
      className="w-full h-full overflow-y-auto hide-scroll"
      style={{ paddingTop: 210, paddingBottom: 100 }}
      onScroll={onScroll}
    >
      <div className="px-5">
        {/* Heading strip */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[12px] text-[#A09A94] tracking-wide uppercase">
            {isFiltered ? activeFilterChip.label : 'Nearby'}
          </div>
          <div className="text-[12px] text-[#6E6058]">
            {reports.length} report{reports.length !== 1 ? 's' : ''} · {radiusLabel}
          </div>
        </div>

        {/* Cards */}
        {isEmpty ? (
          <EmptyState
            filtered={isFiltered}
            filterLabel={activeFilterChip?.label}
            radiusLabel={radiusLabel}
            onClearFilter={resetFilter}
            onReport={openReportForm}
          />
        ) : (
          <div className="flex flex-col gap-5 pb-6">
            {grouped.map((group) => (
              <section key={group.id}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#A09A94]">
                    {group.label}
                  </h3>
                  <span className="text-[11px] text-[#A09A94]">
                    {group.items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {group.items.map((r) => (
                    <FeedCard key={r.id} report={r} onTap={() => onSelect(r)} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------- Empty state ----------------
function EmptyState({ onReport, filtered, filterLabel, radiusLabel = '1km', onClearFilter }) {
  return (
    <div
      className="rounded-[20px] px-6 py-10 flex flex-col items-center text-center"
      style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
    >
      <div
        className="w-[64px] h-[64px] rounded-full flex items-center justify-center mb-4"
        style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}
      >
        {filtered ? (
          <Filter size={26} color="#6E6058" strokeWidth={1.5} />
        ) : (
          <Shield size={28} color="#E85D2A" strokeWidth={1.5} />
        )}
      </div>
      <div className="text-[16px] font-semibold text-[#111] tracking-tight">
        {filtered
          ? `No ${(filterLabel || '').toLowerCase()} reports nearby`
          : 'You\u2019re in a safe zone'}
      </div>
      <div className="text-[13px] text-[#6E6058] mt-1">
        {filtered
          ? `Nothing matches inside ${radiusLabel}. Try a wider radius or clear the filter.`
          : `No reports within ${radiusLabel}`}
      </div>
      {filtered && onClearFilter && (
        <button
          onClick={onClearFilter}
          className="mt-4 px-4 h-[36px] rounded-full text-[12px] font-semibold flex items-center gap-1.5 active:scale-[0.97] transition-all"
          style={{ background: '#FFF', color: '#111', border: '1px solid #EDE8E2' }}
        >
          <X size={12} strokeWidth={2.25} />
          Clear filter
        </button>
      )}
      <button
        onClick={onReport}
        className="mt-3 px-5 h-[40px] rounded-full text-[13px] font-semibold text-[#FFF] active:scale-[0.97] transition-all"
        style={{ background: '#111' }}
      >
        Report a danger
      </button>
    </div>
  );
}

// ---------------- Report detail sheet ----------------
function ReportDetailSheet({ report, onClose, confirmed, toggleConfirm, status, onChangeStatus }) {
  const c = CATEGORIES[report.category];
  const distanceLabel =
    report.distance >= 1000 ? `${(report.distance / 1000).toFixed(1)}km` : `${report.distance}m`;
  const currentStatus = status ?? report.status;
  const isResolved = currentStatus === 'resolved';

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

        {/* Status toggle (sliding pill) */}
        <div className="mt-4">
          <div className="text-[11px] uppercase tracking-wide text-[#A09A94] mb-2">Status</div>
          <div
            className="relative grid grid-cols-2 p-1 rounded-full h-[44px]"
            style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
          >
            {/* sliding indicator */}
            <div
              className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-out"
              style={{
                left: isResolved ? '50%' : '4px',
                width: 'calc(50% - 4px)',
                background: isResolved ? '#2E7D32' : '#111',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              }}
            />
            <button
              onClick={() => onChangeStatus && onChangeStatus('active')}
              className="relative z-10 flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-colors duration-200"
              style={{ color: !isResolved ? '#FFF' : '#6E6058' }}
            >
              <Loader2 size={13} strokeWidth={2.25} />
              Active
            </button>
            <button
              onClick={() => onChangeStatus && onChangeStatus('resolved')}
              className="relative z-10 flex items-center justify-center gap-1.5 text-[12px] font-semibold transition-colors duration-200"
              style={{ color: isResolved ? '#FFF' : '#6E6058' }}
            >
              <CheckCheck size={13} strokeWidth={2.25} />
              Resolved
            </button>
          </div>
          <div className="mt-2 text-[11px] text-[#A09A94] text-center">
            {isResolved
              ? 'Marked as resolved — thanks for the update.'
              : 'Still active. Mark resolved once it\u2019s handled.'}
          </div>
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

// ---------------- History sheet ----------------
function HistorySheet({ allReports, confirmedIds, resolvedOverrides, getReportStatus, onClose, onSelect }) {
  const [tab, setTab] = useState('reports'); // 'reports' | 'confirmed' | 'resolved'
  const myReports = allReports.filter((r) => r.byMe);
  const myConfirmations = allReports.filter((r) => confirmedIds.has(r.id));
  const myResolved = allReports.filter((r) => resolvedOverrides && resolvedOverrides[r.id] === 'resolved');
  const TABS = [
    { id: 'reports', label: 'Reported', icon: Megaphone, count: myReports.length },
    { id: 'confirmed', label: 'Confirmed', icon: ThumbsUp, count: myConfirmations.length },
    { id: 'resolved', label: 'Resolved', icon: CheckCheck, count: myResolved.length },
  ];
  const tabIndex = TABS.findIndex((t) => t.id === tab);
  const list = tab === 'reports' ? myReports : tab === 'confirmed' ? myConfirmations : myResolved;

  return (
    <div className="absolute inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/30"
        style={{ animation: 'quickLogFadeIn 220ms ease-out' }}
        onClick={onClose}
      />
      <div
        className="absolute left-0 right-0 bottom-0 rounded-t-[24px] flex flex-col"
        style={{
          background: '#F7F5F2',
          border: '1px solid #EDE8E2',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.08)',
          animation: 'sheetSlideUp 320ms cubic-bezier(0.22, 1, 0.36, 1)',
          maxHeight: '85%',
          height: '78%',
        }}
      >
        {/* grabber */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-[36px] h-[4px] rounded-full" style={{ background: '#D9D1C6' }} />
        </div>

        {/* header */}
        <div className="px-5 pt-2 pb-4 flex items-start justify-between shrink-0">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-[#A09A94]">My activity</div>
            <h3 className="text-[20px] font-bold text-[#111] tracking-tight mt-0.5">Safety history</h3>
          </div>
          <button
            onClick={onClose}
            className="w-[36px] h-[36px] rounded-full flex items-center justify-center"
            style={{ background: '#F3EFEB' }}
          >
            <X size={16} color="#111" strokeWidth={1.75} />
          </button>
        </div>

        {/* tab toggle (3-way sliding pill) */}
        <div className="px-5 shrink-0">
          <div
            className="relative grid grid-cols-3 p-1 rounded-full h-[44px]"
            style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
          >
            <div
              className="absolute top-1 bottom-1 rounded-full transition-all duration-300 ease-out"
              style={{
                left: `calc(${(tabIndex * 100) / 3}% + 4px)`,
                width: `calc(${100 / 3}% - 8px)`,
                background: '#111',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            />
            {TABS.map((t) => {
              const active = tab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="relative z-10 flex items-center justify-center gap-1 text-[11.5px] font-semibold transition-colors duration-200 px-1"
                  style={{ color: active ? '#FFF' : '#6E6058' }}
                >
                  <Icon size={12} strokeWidth={2.25} />
                  <span>{t.label}</span>
                  <span
                    className="text-[9.5px] font-bold px-1.5 py-px rounded-full"
                    style={{
                      background: active ? 'rgba(255,255,255,0.25)' : '#E6E1DA',
                      color: active ? '#FFF' : '#6E6058',
                    }}
                  >
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* list */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-8">
          {tab === 'resolved' && myResolved.length > 0 && (
            <div
              className="mb-3 rounded-[16px] p-3.5 flex items-center gap-3 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #EEF7EC 0%, #DCEDD7 100%)',
                border: '1px solid #C5DEC2',
              }}
            >
              <div
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0"
                style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(46,125,50,0.18)' }}
              >
                <CheckCheck size={20} color="#2E7D32" strokeWidth={2.25} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-[#1B5E20] tracking-tight">
                  Nice work — {myResolved.length} resolved this month
                </div>
                <div className="text-[11px] text-[#3F6F3F] mt-0.5">
                  You’re making the neighborhood safer for everyone’s pup.
                </div>
              </div>
              <div
                className="text-[11px] font-bold px-2 py-1 rounded-full shrink-0"
                style={{ background: '#FFFFFF', color: '#2E7D32' }}
              >
                +{myResolved.length}
              </div>
            </div>
          )}
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className="w-[56px] h-[56px] rounded-full flex items-center justify-center mb-3"
                style={{ background: '#F3EFEB' }}
              >
                {tab === 'reports' ? (
                  <Megaphone size={22} color="#A09A94" strokeWidth={1.75} />
                ) : tab === 'confirmed' ? (
                  <ThumbsUp size={22} color="#A09A94" strokeWidth={1.75} />
                ) : (
                  <CheckCheck size={22} color="#A09A94" strokeWidth={1.75} />
                )}
              </div>
              <div className="text-[14px] font-semibold text-[#111]">
                {tab === 'reports'
                  ? 'No reports yet'
                  : tab === 'confirmed'
                  ? 'No confirmations yet'
                  : 'Nothing resolved yet'}
              </div>
              <div className="text-[12px] text-[#6E6058] mt-1 max-w-[260px]">
                {tab === 'reports'
                  ? 'When you submit a report, it shows up here so you can track its status.'
                  : tab === 'confirmed'
                  ? 'Confirming someone else\u2019s report helps neighbors. Your confirmations land here.'
                  : 'Cleaned up the glass? Picked up a poison bait? Mark a report as resolved and it lives here as a thank-you log.'}
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {list.map((report) => {
                const c = CATEGORIES[report.category];
                const status = getReportStatus(report);
                const resolved = status === 'resolved';
                const distLabel =
                  report.distance >= 1000
                    ? `${(report.distance / 1000).toFixed(1)}km`
                    : `${report.distance}m`;
                return (
                  <li key={report.id}>
                    <button
                      onClick={() => onSelect(report)}
                      className="w-full text-left rounded-[16px] p-3 flex items-center gap-3 active:scale-[0.99] transition-all"
                      style={{ background: '#FFF', border: '1px solid #EDE8E2' }}
                    >
                      <div
                        className="w-[44px] h-[44px] rounded-full flex items-center justify-center shrink-0 relative"
                        style={{ background: c.bg }}
                      >
                        <CategoryGlyph id={report.category} size={20} color={c.color} />
                        {resolved && (
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center"
                            style={{ background: '#2E7D32', border: '2px solid #FFF' }}
                          >
                            <Check size={10} color="#FFF" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-semibold text-[#111] truncate">
                            {report.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-[#A09A94] mt-0.5">
                          <MapPin size={10} strokeWidth={1.75} />
                          <span className="truncate">{report.location}</span>
                          <span className="text-[#CFCAC3]">·</span>
                          <span>{report.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <span
                            className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-px rounded-full"
                            style={{
                              background: resolved ? '#EEF7EC' : c.bg,
                              color: resolved ? '#2E7D32' : c.color,
                            }}
                          >
                            {resolved ? 'Resolved' : 'Active'}
                          </span>
                          <span className="text-[11px] text-[#6E6058]">
                            {tab === 'reports' && (
                              <>
                                <span className="font-semibold text-[#111]">
                                  {report.confirmations}
                                </span>{' '}
                                confirmed
                              </>
                            )}
                            {tab === 'confirmed' && (
                              <>by {report.author} · {distLabel}</>
                            )}
                            {tab === 'resolved' && (
                              <>marked by you · {distLabel}</>
                            )}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} color="#A09A94" strokeWidth={2} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
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
            {photo ? (
              <div
                className="mt-3 rounded-[12px] overflow-hidden relative"
                style={{ border: '1px solid #EDE8E2' }}
              >
                <img src={photo} alt="Attached" className="w-full h-[120px] object-cover" />
                <div className="absolute inset-x-0 bottom-0 px-3 py-2 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-1.5 text-white text-[11px] font-semibold">
                    <Check size={12} strokeWidth={2.5} />
                    Photo attached
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      className="h-[26px] px-2.5 rounded-full text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.92)', color: '#111' }}
                    >
                      <Camera size={11} strokeWidth={2.25} />
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => setPhoto(reader.result);
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <button
                      onClick={() => setPhoto(null)}
                      className="w-[26px] h-[26px] rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(0,0,0,0.55)' }}
                      aria-label="Remove photo"
                    >
                      <X size={12} color="#FFF" strokeWidth={2.25} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <label
                className="mt-3 w-full h-[44px] rounded-[12px] flex items-center gap-2 px-3 text-[13px] font-medium cursor-pointer"
                style={{
                  background: '#FFFFFF',
                  color: '#6E6058',
                  border: '1px solid #EDE8E2',
                }}
              >
                <Camera size={15} strokeWidth={1.75} />
                Add photo (optional)
                <span className="ml-auto text-[11px] text-[#A09A94]">JPG/PNG</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setPhoto(reader.result);
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            )}

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
