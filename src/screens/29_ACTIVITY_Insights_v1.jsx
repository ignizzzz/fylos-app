import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  MoreVertical, 
  ChevronDown, 
  Plus, 
  Download, 
  Settings,
  ChevronRight,
  Lock,
  Heart,
  MessageCircle,
  MapPin,
  Calendar,
  ShieldAlert,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  Activity,
  Clock,
  Target,
  ChevronLeft,
  Share,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

// ==========================================
// THEME & UTILS
// ==========================================
const THEME = {
  colors: {
    accent: '#FF6A3D', // FYLOS Orange
    bg: '#F7F7F8',
    surface: '#FFFFFF',
    text: '#111111',
    textSecondary: '#6E6E73',
    border: 'rgba(0,0,0,0.06)',
    success: '#34C759',
    warning: '#FFCC00'
  },
  shadows: {
    soft: '0 2px 12px rgba(0, 0, 0, 0.03)',
    float: '0 8px 24px rgba(0, 0, 0, 0.06)'
  }
};

const now = new Date();
const daysAgo = (days) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

const formatRelativeTime = (date) => {
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// ==========================================
// MOCK DATA (Existing + Insights)
// ==========================================
const MOCK_PET = { id: 'p1', name: 'Luna', breed: 'Golden Retriever', avatar: '🐕' };

const MY_ACTIVITIES = [
  { id: '1', type: 'walk', timestamp: daysAgo(0).setHours(14, 30), duration: '90 min', provider: 'Lukas F.', location: 'Zurichhorn Park' },
  { id: '2', type: 'medication', timestamp: daysAgo(0).setHours(9, 0), medName: 'Apoquel (16mg)', notes: 'Daily medication' },
  { id: '3', type: 'photo', timestamp: daysAgo(1).setHours(16, 20), photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400&h=400', caption: 'Playing in the snow! ❄️' },
  { id: '4', type: 'weight', timestamp: daysAgo(2).setHours(10, 0), weight: 28, status: 'healthy', range: '26-29 kg' },
  { id: '5', type: 'vet-visit', timestamp: daysAgo(8).setHours(10, 0), reason: 'Annual Checkup', vetName: 'Dr. Sarah Keller' },
];

const FRIENDS_ACTIVITIES = [
  { id: 'f1', type: 'photo', friendName: 'Max', breed: 'French Bulldog', ownerAvatar: '👨‍🦱', timestamp: daysAgo(0).setHours(11, 20), photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=400', caption: 'Morning zoomies!' },
  { id: 'f2', type: 'check-in', friendName: 'Bella', breed: 'Labrador', ownerAvatar: '👩', timestamp: daysAgo(0).setHours(9, 15), placeName: 'Rieterpark', placeType: 'Dog Park' },
  { id: 'f3', type: 'playdate', friendName: 'Charlie', breed: 'Beagle', ownerAvatar: '👱‍♂️', timestamp: daysAgo(1).setHours(14, 0), dateStr: 'Saturday, 10:00 AM', placeName: 'Zurichhorn Park', attendees: 3 },
  { id: 'f4', type: 'milestone', friendName: 'Rocky', breed: 'Shiba Inu', ownerAvatar: '👩‍🦰', timestamp: daysAgo(2).setHours(16, 30), title: 'Graduated Puppy School 🎓' }
];

const INSIGHTS_DATA = {
  weeklySummary: {
    period: 'Feb 16 - Feb 22',
    walks: 5,
    totalMinutes: 450,
    trendPercent: 20,
    dailyWalks: [1, 0, 1, 2, 0, 1, 0], // Mon-Sun
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    highlights: [
      'Luna walked 5 times this week',
      'Most active day: Thursday (2 walks)',
      'New favorite: Rieterpark'
    ]
  },
  weightTrend: {
    current: 28,
    status: 'stable',
    idealMin: 26,
    idealMax: 29,
    history: [27, 27.5, 28, 27, 28.5, 28],
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb']
  },
  medication: {
    streak: 45,
    thisWeekTaken: 7,
    thisMonthTaken: 21,
    thisMonthTotal: 23,
    completedDays: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
  },
  favoritePlaces: [
    { name: 'Zurichhorn Park', visits: 12, last: 'Feb 20' },
    { name: 'Rieterpark', visits: 5, last: 'Feb 19' },
    { name: 'Lindenhof', visits: 2, last: 'Feb 10' }
  ],
  activeTimes: {
    peaks: [8, 17, 18], // 8am, 5pm, 6pm
    morningShare: 15,
    eveningShare: 35
  }
};

// ==========================================
// SHARED UI COMPONENTS (Layout, Modals)
// ==========================================
const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  return createPortal(
    <div className="absolute inset-0 z-[100] flex flex-col justify-end pointer-events-auto overflow-hidden">
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div 
        className="relative w-full bg-[#FFFFFF] rounded-t-[24px] flex flex-col shadow-2xl max-h-[90vh]"
        style={{ 
          transform: `translateY(${!visible ? '100%' : `${translateY}px`})`,
          transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)'
        }}
      >
        <div 
          className="w-full flex justify-center pt-4 pb-4 cursor-grab touch-none"
          onTouchStart={e => { touchStartY.current = e.touches[0].clientY; setTranslateY(0); }}
          onTouchMove={e => { const delta = e.touches[0].clientY - touchStartY.current; if (delta > 0) setTranslateY(delta); }}
          onTouchEnd={() => { if (translateY > 80) onClose(); else setTranslateY(0); }}
        >
          <div className="w-12 h-1.5 bg-black/[0.08] rounded-full" />
        </div>
        <div className="px-5 pb-6 overflow-y-auto custom-scrollbar">
          {title && <h3 className="text-[20px] font-bold text-[#111111] mb-5">{title}</h3>}
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('mockup-root') || document.body
  );
};

// Full Screen Slide-Over for Detailed Views
const SlideOver = ({ isOpen, onClose, title, children, rightAction }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!render) return null;

  return createPortal(
    <div className="absolute inset-0 z-[200] overflow-hidden pointer-events-auto">
      <div 
        className="absolute inset-0 bg-[#F7F7F8] flex flex-col"
        style={{ 
          transform: `translateX(${!visible ? '100%' : '0'})`,
          transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        <header className="px-4 pt-14 pb-3 bg-[#F7F7F8] border-b border-black/[0.04] flex items-center justify-between shrink-0">
          <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors">
            <ChevronLeft size={24} color="#111111" />
          </button>
          <h2 className="text-[17px] font-semibold text-[#111111]">{title}</h2>
          <div className="w-10 flex justify-end">
            {rightAction}
          </div>
        </header>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#F0F0F2]">
          {children}
        </div>
      </div>
    </div>,
    document.getElementById('mockup-root') || document.body
  );
};

const SegmentedModeControl = ({ modes, activeMode, onChange }) => {
  const activeIndex = modes.findIndex(m => m.id === activeMode);
  return (
    <div className="px-4 py-2 bg-[#F7F7F8] z-30 sticky top-0">
      <div className="bg-black/[0.04] p-1 rounded-[14px] flex relative">
        <div 
          className="absolute top-1 bottom-1 bg-[#FFFFFF] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out"
          style={{ width: `calc(${100 / modes.length}% - 4px)`, left: `calc(${(100 / modes.length) * activeIndex}% + 2px)` }}
        />
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onChange(mode.id)}
              className={`relative z-10 flex-1 py-1.5 text-[14px] font-semibold transition-colors duration-200 flex items-center justify-center gap-1.5 ${isActive ? 'text-[#111111]' : 'text-[#8E8E93]'}`}
            >
              {mode.label}
              {mode.badge && <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ==========================================
// CUSTOM CHARTS (SVG & CSS Based)
// ==========================================
const BarChart = ({ data, labels, color, height = 'h-32' }) => {
  const max = Math.max(...data, 1);
  return (
    <div className={`flex items-end justify-between w-full mt-4 ${height}`}>
      {data.map((val, i) => (
        <div key={i} className="flex flex-col items-center justify-end h-full gap-2 flex-1">
          <div className="w-full px-1 max-w-[28px] h-full flex items-end justify-center relative group">
            <div 
              style={{ height: `${Math.max((val / max) * 100, 4)}%`, backgroundColor: color }} 
              className={`w-full rounded-[4px] transition-all duration-500 ${val === 0 ? 'opacity-20' : 'opacity-100'}`}
            />
            {/* Tooltip on hover/active (mock) */}
            {val > 0 && (
              <div className="absolute -top-7 opacity-0 group-hover:opacity-100 bg-[#111111] text-white text-[11px] font-bold px-2 py-1 rounded shadow-sm transition-opacity">
                {val}
              </div>
            )}
          </div>
          <span className="text-[11px] font-medium text-[#8E8E93]">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
};

const LineChart = ({ data, labels, idealMin, idealMax, color }) => {
  const min = Math.min(...data, idealMin) - 1;
  const max = Math.max(...data, idealMax) + 1;
  const range = max - min;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  const idealYTop = 100 - ((idealMax - min) / range) * 100;
  const idealYBottom = 100 - ((idealMin - min) / range) * 100;

  return (
    <div className="w-full h-40 relative mt-4">
      <svg className="w-full h-[calc(100%-24px)] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Ideal Range Background */}
        <rect x="0" y={idealYTop} width="100" height={idealYBottom - idealYTop} fill="#34C759" opacity="0.1" rx="2" />
        
        {/* Connection Line */}
        <polyline points={points} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        
        {/* Data Points */}
        {data.map((val, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((val - min) / range) * 100;
          return <circle key={i} cx={x} cy={y} r="4" fill="#FFFFFF" stroke={color} strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
        })}
      </svg>
      {/* X-Axis Labels */}
      <div className="flex justify-between items-end h-6 mt-1">
        {labels.map((l, i) => <span key={i} className="text-[11px] font-medium text-[#8E8E93]">{l}</span>)}
      </div>
    </div>
  );
};

const HourChart = ({ peaks, color }) => {
  return (
    <div className="w-full mt-4">
      <div className="flex items-end h-16 w-full gap-[2px]">
        {Array.from({length: 24}).map((_, i) => {
          const isPeak = peaks.includes(i) || peaks.includes(i-1) || peaks.includes(i+1);
          const height = isPeak ? 60 + Math.random()*40 : 10 + Math.random()*20;
          return (
            <div 
              key={i} 
              className="flex-1 rounded-t-sm" 
              style={{ height: `${height}%`, backgroundColor: color, opacity: isPeak ? 1 : 0.3 }} 
            />
          )
        })}
      </div>
      <div className="flex justify-between items-center mt-2 px-1">
        <span className="text-[11px] font-medium text-[#8E8E93]">12am</span>
        <span className="text-[11px] font-medium text-[#8E8E93]">Noon</span>
        <span className="text-[11px] font-medium text-[#8E8E93]">12am</span>
      </div>
    </div>
  );
};

const CalendarHeatmap = ({ completedDays, totalDays = 28 }) => {
  return (
    <div className="w-full mt-4">
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['M','T','W','T','F','S','S'].map((day, i) => (
          <div key={i} className="text-center text-[11px] font-semibold text-[#8E8E93]">{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({length: totalDays}).map((_, i) => {
          const day = i + 1;
          const isCompleted = completedDays.includes(day);
          const isFuture = day > 22; // Mock current day
          return (
            <div 
              key={i} 
              className={`aspect-square rounded-full flex items-center justify-center text-[12px] font-medium transition-colors
                ${isCompleted ? 'bg-[#111111] text-[#FFFFFF]' : 
                  isFuture ? 'bg-transparent text-[#CFCFD4]' : 'bg-[#F7F7F8] text-[#8E8E93] border border-[#E5E5EA]'}`}
            >
              {isCompleted ? <CheckCircle2 size={14} /> : day}
            </div>
          )
        })}
      </div>
    </div>
  );
};

// ==========================================
// DETAILED INSIGHTS SCREENS
// ==========================================
const WeeklySummaryDetail = ({ isOpen, onClose }) => (
  <SlideOver isOpen={isOpen} onClose={onClose} title="Weekly Summary" rightAction={<Share size={20} color="#111111" />}>
    <div className="p-4 space-y-4">
      <div className="text-center py-2">
        <h3 className="text-[15px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Feb 16 - Feb 22, 2026</h3>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Overview</h4>
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div><p className="text-[24px] font-bold text-[#111111] leading-none mb-1">5</p><p className="text-[14px] text-[#6E6E73] flex items-center gap-1.5"><Activity size={14}/> Walks</p></div>
          <div><p className="text-[24px] font-bold text-[#111111] leading-none mb-1">7h 30m</p><p className="text-[14px] text-[#6E6E73] flex items-center gap-1.5"><Clock size={14}/> Total time</p></div>
          <div><p className="text-[24px] font-bold text-[#111111] leading-none mb-1">3</p><p className="text-[14px] text-[#6E6E73] flex items-center gap-1.5"><MapPin size={14}/> Places visited</p></div>
          <div><p className="text-[24px] font-bold text-[#111111] leading-none mb-1">2</p><p className="text-[14px] text-[#6E6E73] flex items-center gap-1.5"><Users size={14}/> Playdates</p></div>
        </div>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2">Daily Breakdown</h4>
        <BarChart data={INSIGHTS_DATA.weeklySummary.dailyWalks} labels={INSIGHTS_DATA.weeklySummary.labels} color="#FF6A3D" height="h-36" />
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Walk Details</h4>
        <div className="space-y-4">
          <div>
            <p className="text-[14px] font-semibold text-[#111111] mb-1">Thursday, Feb 20</p>
            <p className="text-[14px] text-[#6E6E73]">• 90 min · Zurichhorn Park</p>
            <p className="text-[14px] text-[#6E6E73]">• 60 min · Rieterpark</p>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[#111111] mb-1">Wednesday, Feb 19</p>
            <p className="text-[14px] text-[#6E6E73]">• 60 min · Zurichhorn Park</p>
          </div>
          <button className="text-[14px] font-semibold text-[#FF6A3D] mt-2">View All Walks →</button>
        </div>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Favorite Places</h4>
        <div className="space-y-2">
          <p className="text-[15px] font-medium text-[#111111]">🥇 Zurichhorn Park <span className="text-[13px] text-[#6E6E73] font-normal">(3 visits)</span></p>
          <p className="text-[15px] font-medium text-[#111111]">🥈 Rieterpark <span className="text-[13px] text-[#6E6E73] font-normal">(1 visit)</span></p>
          <p className="text-[15px] font-medium text-[#111111]">🥉 Lindenhof <span className="text-[13px] text-[#6E6E73] font-normal">(1 visit)</span></p>
        </div>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Photos from this week</h4>
        <div className="grid grid-cols-4 gap-2">
          {[1,2,3,4].map(i => (
             <div key={i} className="aspect-square bg-[#F7F7F8] rounded-[10px] overflow-hidden">
               <img src={`https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=200&h=200&sig=${i}`} alt="Activity" className="w-full h-full object-cover" />
             </div>
          ))}
        </div>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Compared to Last Week</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#111111] font-medium">Walks</span>
            <div className="flex items-center gap-2"><span className="text-[15px] font-bold text-[#34C759] flex items-center"><TrendingUp size={16} className="mr-1"/> +20%</span><span className="text-[13px] text-[#8E8E93] w-14 text-right">(5 vs 4)</span></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#111111] font-medium">Time</span>
            <div className="flex items-center gap-2"><span className="text-[15px] font-bold text-[#34C759] flex items-center"><TrendingUp size={16} className="mr-1"/> +15%</span><span className="text-[13px] text-[#8E8E93] w-14 text-right">(450m)</span></div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-[#111111] font-medium">Playdates</span>
            <div className="flex items-center gap-2"><span className="text-[15px] font-bold text-[#8E8E93] flex items-center">Same</span><span className="text-[13px] text-[#8E8E93] w-14 text-right">(2)</span></div>
          </div>
        </div>
      </div>

      <button className="w-full h-[56px] bg-[#111111] text-white font-semibold text-[16px] rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
        <Download size={18} /> Export PDF Report
      </button>
    </div>
  </SlideOver>
);

const WeightTrendDetail = ({ isOpen, onClose }) => (
  <SlideOver isOpen={isOpen} onClose={onClose} title="Weight Trend">
    <div className="p-4 space-y-4">
      <div className="bg-[#FFFFFF] p-6 rounded-[20px] shadow-sm border border-black/[0.04] text-center">
        <h3 className="text-[15px] font-medium text-[#6E6E73] mb-2">Current Weight</h3>
        <div className="text-[42px] font-bold text-[#111111] leading-none mb-3">28.0 <span className="text-[20px] text-[#8E8E93]">kg</span></div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#34C759]/10 rounded-full">
          <CheckCircle2 size={16} className="text-[#34C759]" />
          <span className="text-[13px] font-semibold text-[#34C759]">Within healthy range (26-29 kg)</span>
        </div>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2">6-Month Trend</h4>
        <LineChart data={INSIGHTS_DATA.weightTrend.history} labels={INSIGHTS_DATA.weightTrend.labels} idealMin={26} idealMax={29} color="#FF6A3D" />
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Weight History</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#6E6E73]">Feb 15, 2026</span>
            <span className="font-semibold text-[#111111]">28.0 kg</span>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#6E6E73]">Jan 15, 2026</span>
            <span className="font-semibold text-[#111111] flex items-center gap-1">28.5 kg <TrendingUp size={14} className="text-[#FF6A3D]"/></span>
          </div>
          <div className="flex justify-between items-center text-[15px]">
            <span className="text-[#6E6E73]">Dec 15, 2025</span>
            <span className="font-semibold text-[#111111] flex items-center gap-1">27.0 kg <TrendingUp size={14} className="text-[#34C759] rotate-180"/></span>
          </div>
          <button className="text-[14px] font-semibold text-[#FF6A3D] mt-2 pt-3 border-t border-black/[0.04] w-full text-left">View All Records (12) →</button>
        </div>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Insights</h4>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-[#34C759] shrink-0 mt-0.5" />
            <span className="text-[15px] text-[#111111]">Weight has been stable for the last 6 months.</span>
          </li>
          <li className="flex items-start gap-3">
            <CheckCircle2 size={18} className="text-[#34C759] shrink-0 mt-0.5" />
            <span className="text-[15px] text-[#111111]">Consistently within Golden Retriever ideal range.</span>
          </li>
          <li className="flex items-start gap-3">
            <Info size={18} className="text-[#8E8E93] shrink-0 mt-0.5" />
            <span className="text-[15px] text-[#6E6E73]">Average weight: 27.8 kg</span>
          </li>
        </ul>
      </div>
    </div>
  </SlideOver>
);

const MedicationDetail = ({ isOpen, onClose }) => (
  <SlideOver isOpen={isOpen} onClose={onClose} title="Medication Adherence">
    <div className="p-4 space-y-4">
      <div className="bg-gradient-to-br from-[#FFF4ED] to-[#FFFFFF] p-6 rounded-[20px] border border-[#FF6A3D]/20 text-center">
        <div className="w-16 h-16 bg-[#FFFFFF] rounded-full flex items-center justify-center text-[32px] shadow-sm mx-auto mb-3">🔥</div>
        <h3 className="text-[24px] font-bold text-[#111111] mb-1">45-day streak!</h3>
        <p className="text-[15px] text-[#FF6A3D] font-medium">100% adherence this month</p>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2">February 2026</h4>
        <CalendarHeatmap completedDays={INSIGHTS_DATA.medication.completedDays} />
        <div className="mt-5 pt-4 border-t border-black/[0.04] flex justify-between items-center">
          <span className="text-[14px] text-[#6E6E73]">Doses taken</span>
          <span className="text-[15px] font-bold text-[#111111]">21/23 (91%)</span>
        </div>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Active Medications</h4>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-[16px] bg-[#F7F7F8] flex items-center justify-center text-[24px] shrink-0">💊</div>
          <div className="flex-1">
            <h5 className="text-[16px] font-semibold text-[#111111]">Apoquel (16mg)</h5>
            <p className="text-[14px] text-[#6E6E73] mb-2">Daily · 9:00 AM</p>
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[#34C759]">
              <CheckCircle2 size={14} /> Last taken: Today, 9:05 AM
            </div>
          </div>
        </div>
      </div>
    </div>
  </SlideOver>
);

const FavoritePlacesDetail = ({ isOpen, onClose }) => (
  <SlideOver isOpen={isOpen} onClose={onClose} title="Favorite Places" rightAction={<Share size={20} color="#111111" />}>
    <div className="p-4 space-y-4">
      {/* Mock Heatmap */}
      <div className="w-full h-48 bg-[#E5E5EA] rounded-[20px] relative overflow-hidden flex items-center justify-center border border-black/[0.04]">
        {/* Simple visual representation of a map with a heatmap dot */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        <MapPin size={32} className="text-[#FF6A3D] absolute z-10" style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <div className="absolute w-32 h-32 bg-[#FF6A3D]/30 rounded-full blur-md" style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <div className="absolute w-16 h-16 bg-[#FF6A3D]/50 rounded-full blur-sm" style={{ top: '40%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        <span className="absolute bottom-4 bg-[#FFFFFF] px-4 py-1.5 rounded-full text-[13px] font-bold shadow-md text-[#111111]">
          🔥🔥🔥 Zurichhorn (12)
        </span>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Top Places</h4>
        <div className="space-y-4">
          {INSIGHTS_DATA.favoritePlaces.map((place, i) => (
            <div key={i} className="flex justify-between items-center pb-3 border-b border-black/[0.04] last:border-0 last:pb-0">
              <div>
                <h5 className="text-[16px] font-semibold text-[#111111]">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'} {place.name}</h5>
                <p className="text-[13px] text-[#6E6E73] ml-6 mt-0.5">{place.visits} visits · Last: {place.last}</p>
              </div>
              <button className="text-[13px] font-semibold text-[#FF6A3D] bg-[#FF6A3D]/10 px-3 py-1.5 rounded-full">Details</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SlideOver>
);

const ActivityPatternsDetail = ({ isOpen, onClose }) => (
  <SlideOver isOpen={isOpen} onClose={onClose} title="Activity Patterns" rightAction={<Share size={20} color="#111111" />}>
    <div className="p-4 space-y-4">
      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-2">Most Active Times</h4>
        <HourChart peaks={INSIGHTS_DATA.activeTimes.peaks} color="#111111" />
        <div className="mt-5 pt-4 border-t border-black/[0.04]">
          <p className="text-[14px] font-semibold text-[#111111] mb-2">Peak activity:</p>
          <p className="text-[14px] text-[#6E6E73] flex justify-between mb-1"><span>• Morning: 8-9 AM</span> <span className="font-medium text-[#111111]">15%</span></p>
          <p className="text-[14px] text-[#6E6E73] flex justify-between"><span>• Evening: 5-6 PM</span> <span className="font-medium text-[#111111]">35%</span></p>
        </div>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Weekday vs Weekend</h4>
        <div className="space-y-3 mb-4">
          <p className="text-[15px] flex justify-between items-center"><span className="text-[#6E6E73]">Weekdays:</span> <span className="font-semibold text-[#111111]">4.2 walks/week</span></p>
          <p className="text-[15px] flex justify-between items-center"><span className="text-[#6E6E73]">Weekends:</span> <span className="font-semibold text-[#111111] flex items-center gap-1.5">0.8 walks/week <AlertCircle size={16} className="text-[#FFCC00]"/></span></p>
        </div>
        <div className="bg-gradient-to-r from-[#FFF4ED] to-[#FFFFFF] border border-[#FF6A3D]/20 rounded-[12px] p-3.5 flex gap-2.5 items-start">
          <span className="text-[18px] mt-0.5">💡</span>
          <p className="text-[13px] text-[#111111] leading-relaxed">Luna is less active on weekends. Try scheduling morning walks to keep the routine!</p>
        </div>
      </div>

      <div className="bg-[#FFFFFF] p-5 rounded-[20px] shadow-sm border border-black/[0.04]">
        <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-4">Seasonal Trends</h4>
        <div className="space-y-3">
          <p className="text-[14px] flex justify-between"><span className="text-[#6E6E73]">Winter:</span> <span className="font-medium text-[#111111]">3.5 walks/week</span></p>
          <p className="text-[14px] flex justify-between"><span className="text-[#6E6E73]">Spring:</span> <span className="font-medium text-[#34C759] flex items-center gap-1">5.2 walks/week <TrendingUp size={14}/></span></p>
          <p className="text-[14px] flex justify-between"><span className="text-[#6E6E73]">Summer:</span> <span className="font-medium text-[#34C759] flex items-center gap-1">6.8 walks/week <TrendingUp size={14}/></span></p>
          <p className="text-[14px] flex justify-between"><span className="text-[#6E6E73]">Fall:</span> <span className="font-medium text-[#111111]">4.1 walks/week</span></p>
        </div>
      </div>
    </div>
  </SlideOver>
);

// ==========================================
// MAIN INSIGHTS DASHBOARD
// ==========================================
const ActivityInsightsScreen = ({ isOpen, onClose }) => {
  const [activeDetail, setActiveDetail] = useState(null); // 'weekly', 'weight', 'medication', 'places'

  return (
    <>
      <SlideOver isOpen={isOpen} onClose={onClose} title="Activity Insights" rightAction={<Settings size={22} color="#111111" />}>
        <div className="p-4 space-y-5 pb-24">
          
          {/* Pet Context Header */}
          <div className="flex items-center gap-3 justify-center mb-2">
            <span className="text-[20px]">{MOCK_PET.avatar}</span>
            <span className="text-[15px] font-semibold text-[#6E6E73]">{MOCK_PET.name} · {MOCK_PET.breed}</span>
          </div>

          {/* SECTION 1: WEEKLY SUMMARY */}
          <section>
            <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3 px-1">Weekly Summary</h3>
            <div 
              onClick={() => setActiveDetail('weekly')}
              className="bg-[#FFFFFF] rounded-[24px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.04] cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-[20px] font-bold text-[#111111] flex items-center gap-2">
                    🐕 {INSIGHTS_DATA.weeklySummary.walks} walks
                  </h4>
                  <p className="text-[14px] text-[#6E6E73] mt-1">{Math.floor(INSIGHTS_DATA.weeklySummary.totalMinutes/60)}h {INSIGHTS_DATA.weeklySummary.totalMinutes%60}min total</p>
                </div>
                <div className="bg-[#34C759]/10 px-2.5 py-1 rounded-[10px] flex items-center gap-1">
                  <TrendingUp size={14} className="text-[#34C759]" />
                  <span className="text-[13px] font-bold text-[#34C759]">+{INSIGHTS_DATA.weeklySummary.trendPercent}%</span>
                </div>
              </div>

              <BarChart data={INSIGHTS_DATA.weeklySummary.dailyWalks} labels={INSIGHTS_DATA.weeklySummary.labels} color="#111111" />

              <div className="mt-5 pt-4 border-t border-black/[0.04] space-y-2">
                {INSIGHTS_DATA.weeklySummary.highlights.slice(0, 2).map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-[14px] text-[#111111]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D]" /> {h}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-1 text-[14px] font-semibold text-[#FF6A3D]">
                View Full Report <ArrowRight size={16} />
              </div>
            </div>
          </section>

          {/* SECTION 2: HEALTH TRENDS */}
          <section>
            <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3 px-1 mt-2">Health Trends</h3>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Weight Card */}
              <div 
                onClick={() => setActiveDetail('weight')}
                className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-black/[0.04] cursor-pointer active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-1.5 text-[#6E6E73] mb-2">
                  <Target size={16} /> <span className="text-[13px] font-medium">Weight</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[24px] font-bold text-[#111111]">{INSIGHTS_DATA.weightTrend.current}</span>
                  <span className="text-[14px] text-[#8E8E93]">kg</span>
                </div>
                <div className="text-[12px] font-medium text-[#34C759] flex items-center gap-1">
                  <CheckCircle2 size={12} /> Stable
                </div>
                {/* Mini chart visual approximation */}
                <div className="mt-3 h-8 w-full flex items-end">
                  <svg viewBox="0 0 100 30" className="w-full h-full preserve-aspect-none" vectorEffect="non-scaling-stroke">
                    <polyline points="0,20 20,25 40,15 60,20 80,10 100,15" fill="none" stroke="#FF6A3D" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Medication Card */}
              <div 
                onClick={() => setActiveDetail('medication')}
                className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-black/[0.04] cursor-pointer active:scale-95 transition-transform"
              >
                <div className="flex items-center gap-1.5 text-[#6E6E73] mb-2">
                  <Activity size={16} /> <span className="text-[13px] font-medium">Medication</span>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[24px] font-bold text-[#111111]">{INSIGHTS_DATA.medication.thisWeekTaken}/7</span>
                </div>
                <div className="text-[12px] font-medium text-[#FF6A3D] flex items-center gap-1">
                  🔥 {INSIGHTS_DATA.medication.streak} day streak
                </div>
                {/* Mini dots visual */}
                <div className="mt-4 flex gap-1 w-full justify-between">
                  {[1,2,3,4,5,6,7].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#111111]" />
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* SECTION 3: PATTERNS & FAVORITES */}
          <section>
            <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3 px-1 mt-2">Patterns</h3>
            
            <div className="space-y-3">
              {/* Favorite Places Mini-List */}
              <div 
                onClick={() => setActiveDetail('places')}
                className="bg-[#FFFFFF] rounded-[20px] p-5 shadow-sm border border-black/[0.04] cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-2 mb-4">
                  <MapPin size={18} className="text-[#FF6A3D]" />
                  <h4 className="text-[16px] font-semibold text-[#111111]">Favorite Places</h4>
                </div>
                <div className="space-y-3">
                  {INSIGHTS_DATA.favoritePlaces.map((place, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[14px] font-bold text-[#8E8E93] w-4">{i+1}.</span>
                        <span className="text-[15px] text-[#111111]">{place.name}</span>
                      </div>
                      <span className="text-[13px] text-[#6E6E73] bg-[#F7F7F8] px-2 py-0.5 rounded-md">{place.visits} visits</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Times */}
              <div 
                onClick={() => setActiveDetail('patterns')}
                className="bg-[#FFFFFF] rounded-[20px] p-5 shadow-sm border border-black/[0.04] cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} className="text-[#FF6A3D]" />
                  <h4 className="text-[16px] font-semibold text-[#111111]">Most Active Times</h4>
                </div>
                <HourChart peaks={INSIGHTS_DATA.activeTimes.peaks} color="#111111" />
                <p className="text-[13px] text-[#6E6E73] mt-3 pt-3 border-t border-black/[0.04]">
                  Luna is <strong>most active at 5-6 PM</strong> (35% of walks).
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 4: RECOMMENDATIONS */}
          <section>
            <div className="bg-gradient-to-r from-[#111111] to-[#2C2C2E] rounded-[20px] p-5 text-white shadow-float relative overflow-hidden">
              <div className="absolute -right-4 -top-4 text-[80px] opacity-10">💡</div>
              <h4 className="text-[16px] font-bold mb-2 flex items-center gap-2">
                <AlertCircle size={18} className="text-[#FFCC00]" /> 
                Actionable Insight
              </h4>
              <p className="text-[14px] text-white/80 leading-relaxed mb-4">
                Luna's activity drops by 30% on weekends. Try scheduling a morning walk on Saturdays to keep her routine consistent!
              </p>
              <button className="bg-[#FFFFFF] text-[#111111] px-4 py-2 rounded-full text-[13px] font-bold active:scale-95 transition-transform">
                Schedule Weekend Walk
              </button>
            </div>
          </section>

        </div>
      </SlideOver>

      {/* Detail Modals */}
      <WeeklySummaryDetail isOpen={activeDetail === 'weekly'} onClose={() => setActiveDetail(null)} />
      <WeightTrendDetail isOpen={activeDetail === 'weight'} onClose={() => setActiveDetail(null)} />
      <MedicationDetail isOpen={activeDetail === 'medication'} onClose={() => setActiveDetail(null)} />
      <FavoritePlacesDetail isOpen={activeDetail === 'places'} onClose={() => setActiveDetail(null)} />
      <ActivityPatternsDetail isOpen={activeDetail === 'patterns'} onClose={() => setActiveDetail(null)} />
    </>
  );
};

// ==========================================
// MODE 1: MY ACTIVITY (Updated with Insights Entry)
// ==========================================
const MyActivityContainer = ({ isVisible, onOpenInsights }) => {
  const [activeTime, setActiveTime] = useState('all');
  const [activeTypes, setActiveTypes] = useState(['all']);

  return (
    <div className={`absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isVisible ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
      
      {/* Unified Filter Surface */}
      <div className="bg-[#FFFFFF] rounded-b-[24px] shadow-sm border-b border-[#E5E5E5]/50 px-4 pt-4 pb-5 mb-4 space-y-5">
        <div className="flex items-center justify-between">
          <button className="flex items-center gap-2 bg-[#F7F7F8] px-3 py-1.5 rounded-[12px] active:scale-95 transition-transform">
            <span className="text-[16px]">{MOCK_PET.avatar}</span>
            <span className="text-[14px] font-semibold text-[#111111]">{MOCK_PET.name}</span>
            <ChevronDown size={14} color="#6E6E73" />
          </button>
          <button className="text-[14px] font-semibold text-[#FF6A3D] flex items-center gap-1 bg-[#FF6A3D]/10 px-3 py-1.5 rounded-[12px]">
            <Plus size={16} /> Add
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto hide-scroll">
          {['All', 'Today', 'This Week', 'This Month'].map(t => (
            <button 
              key={t} onClick={() => setActiveTime(t.toLowerCase())}
              className={`pb-1 text-[14px] font-medium whitespace-nowrap border-b-2 transition-colors ${activeTime === t.toLowerCase() ? 'border-[#FF6A3D] text-[#111111]' : 'border-transparent text-[#8E8E93]'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scroll">
          {[
            { id: 'all', label: 'All' }, { id: 'health', label: 'Health' }, 
            { id: 'bookings', label: 'Bookings' }, { id: 'photos', label: 'Photos' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => setActiveTypes([type.id])}
              className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${
                activeTypes.includes(type.id) 
                  ? 'bg-[#111111] text-[#FFFFFF]' 
                  : 'bg-[#F7F7F8] text-[#6E6E73]'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* INSIGHTS ENTRY BANNER */}
      <div 
        onClick={onOpenInsights}
        className="mx-4 mb-4 bg-gradient-to-r from-[#FFF4ED] to-[#FFFFFF] border border-[#FF6A3D]/20 rounded-[16px] p-4 flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform shadow-sm"
      >
        <div>
          <h4 className="text-[15px] font-bold text-[#111111] flex items-center gap-2">
            <TrendingUp size={16} className="text-[#FF6A3D]" /> 
            Weekly Report Ready
          </h4>
          <p className="text-[13px] text-[#6E6E73] mt-0.5">Luna's activity is up 20% this week!</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#FFFFFF] shadow-sm flex items-center justify-center">
          <ChevronRight size={18} className="text-[#111111]" />
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 pb-24 space-y-3">
        {/* Date Divider */}
        <div className="sticky top-0 z-10 py-2 bg-[#F0F0F2]/95 backdrop-blur-sm -mx-4 px-4 mb-2">
          <span className="text-[12px] font-bold text-[#8E8E93] tracking-widest uppercase">This Week</span>
        </div>

        {MY_ACTIVITIES.map((act) => (
          <div key={act.id} className="bg-[#FFFFFF] p-4 rounded-[16px] border border-black/[0.04] flex gap-4 items-start shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[18px] shrink-0">
              {act.type === 'walk' ? '🐕' : act.type === 'medication' ? '💊' : act.type === 'photo' ? '📸' : act.type === 'weight' ? '⚖️' : '🏥'}
            </div>
            <div className="flex-1 pt-0.5">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-[15px] font-semibold text-[#111111] capitalize">{act.type.replace('-', ' ')}</h4>
                <span className="text-[12px] text-[#8E8E93]">{formatRelativeTime(new Date(act.timestamp))}</span>
              </div>
              {act.type === 'walk' && <p className="text-[14px] text-[#6E6E73]">{act.duration} με {act.provider}</p>}
              {act.type === 'medication' && <p className="text-[14px] text-[#6E6E73]">{act.medName}</p>}
              {act.type === 'weight' && <p className="text-[14px] text-[#6E6E73]">{act.weight} kg · {act.status}</p>}
              {act.type === 'photo' && (
                <div className="mt-2 w-full aspect-[4/3] rounded-[12px] overflow-hidden bg-[#F7F7F8]">
                  <img src={act.photoUrl} alt="Activity" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// MODE 2 & 3: FRIENDS & COMMUNITY (Unchanged functionality)
// ==========================================
const FriendsActivityContainer = ({ isVisible }) => {
  const handleFeatureLocked = (feature) => alert(`${feature} is coming soon! Utility first.`);

  return (
    <div className={`absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isVisible ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
      <div className="px-4 py-3 bg-[#E8F2FF] flex items-center justify-center gap-2 mb-2">
        <Lock size={14} className="text-[#007AFF]" />
        <span className="text-[13px] font-medium text-[#007AFF]">Health data is always private.</span>
      </div>
      <div className="px-4 py-2 flex items-center justify-between mb-4">
        <span className="text-[14px] font-semibold text-[#111111]">12 Friends</span>
        <button className="text-[14px] font-semibold text-[#FF6A3D]">Add Friend</button>
      </div>
      <div className="px-4 pb-24 space-y-4">
        {FRIENDS_ACTIVITIES.map((act) => (
          <div key={act.id} className="bg-[#FFFFFF] rounded-[20px] border border-black/[0.04] shadow-[0_4px_16px_rgba(0,0,0,0.03)] overflow-hidden">
            <div className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[18px]">
                {act.ownerAvatar}
              </div>
              <div className="flex-1">
                <h4 className="text-[15px] font-semibold text-[#111111]">{act.friendName} <span className="text-[#8E8E93] font-normal text-[13px]">· {act.breed}</span></h4>
                <p className="text-[12px] text-[#8E8E93]">{formatRelativeTime(new Date(act.timestamp))}</p>
              </div>
              <MoreVertical size={18} className="text-[#CFCFD4]" />
            </div>
            {act.type === 'photo' && (
              <>
                <div className="w-full aspect-square bg-[#F7F7F8]">
                  <img src={act.photoUrl} alt="Friend activity" className="w-full h-full object-cover" />
                </div>
                {act.caption && <p className="px-4 pt-3 text-[14px] text-[#111111]">{act.caption}</p>}
              </>
            )}
            {act.type === 'check-in' && (
              <div className="px-4 pb-2">
                <div className="bg-[#F7F7F8] rounded-[16px] p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#FFFFFF] flex items-center justify-center shadow-sm">
                    <MapPin size={20} className="text-[#FF6A3D]" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-[15px] font-semibold text-[#111111]">{act.placeName}</h5>
                    <p className="text-[13px] text-[#6E6E73]">{act.placeType}</p>
                  </div>
                  <button className="text-[13px] font-semibold text-[#FF6A3D] bg-[#FFFFFF] px-3 py-1.5 rounded-full shadow-sm">Save</button>
                </div>
              </div>
            )}
            {act.type === 'playdate' && (
              <div className="px-4 pb-2">
                <div className="bg-[#FFFFFF] border border-[#E5E5E5] rounded-[16px] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar size={16} className="text-[#FF6A3D]" />
                    <span className="text-[13px] font-semibold text-[#FF6A3D] uppercase tracking-wider">Playdate Created</span>
                  </div>
                  <h5 className="text-[16px] font-semibold text-[#111111] mb-1">{act.dateStr}</h5>
                  <p className="text-[14px] text-[#6E6E73] mb-4">📍 {act.placeName}</p>
                  <button className="w-full py-2.5 bg-[#F7F7F8] text-[#111111] text-[14px] font-semibold rounded-[12px] hover:bg-[#E5E5EA] transition-colors">
                    Request to Join
                  </button>
                </div>
              </div>
            )}
            {act.type === 'milestone' && (
              <div className="px-4 pb-2">
                <div className="bg-gradient-to-br from-[#FFF4ED] to-[#FFFFFF] border border-[#FF6A3D]/20 rounded-[16px] p-6 text-center">
                  <span className="text-[32px] mb-2 block">🎯</span>
                  <h5 className="text-[16px] font-bold text-[#111111]">{act.title}</h5>
                </div>
              </div>
            )}
            <div className="px-4 py-3 flex items-center gap-4 border-t border-black/[0.04] mt-2">
              <button className="flex items-center gap-1.5 text-[#111111] hover:text-[#FF6A3D] transition-colors">
                <Heart size={20} /> <span className="text-[14px] font-medium">12</span>
              </button>
              <button onClick={() => handleFeatureLocked('Comments')} className="flex items-center gap-1.5 text-[#8E8E93] hover:text-[#111111] transition-colors">
                <MessageCircle size={20} /> <span className="text-[14px] font-medium">Add</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CommunityPlaceholderContainer = ({ isVisible }) => (
  <div className={`absolute inset-0 flex flex-col overflow-y-auto custom-scrollbar bg-[#F7F7F8] transition-opacity duration-300 ${isVisible ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
    <div className="px-6 pt-8 pb-10 text-center">
      <div className="w-16 h-16 bg-[#FFFFFF] rounded-[20px] shadow-sm flex items-center justify-center mx-auto mb-6">
        <span className="text-[32px]">🌍</span>
      </div>
      <h2 className="text-[28px] font-bold text-[#111111] tracking-tight mb-3">Community</h2>
      <p className="text-[15px] text-[#6E6E73] leading-relaxed max-w-[280px] mx-auto mb-8">
        Public discovery, local meetups, and breed communities.
      </p>
      <div className="bg-[#FFFFFF] rounded-[24px] p-1.5 shadow-sm border border-black/[0.04] flex items-center mb-10 max-w-[320px] mx-auto">
        <input type="email" placeholder="Enter your email" className="flex-1 bg-transparent px-4 text-[15px] focus:outline-none placeholder:text-[#8E8E93]" />
        <button className="bg-[#111111] text-[#FFFFFF] px-5 py-2.5 rounded-[20px] text-[14px] font-semibold active:scale-95 transition-transform">
          Notify me
        </button>
      </div>
    </div>
  </div>
);

// ==========================================
// MAIN APP SCREEN
// ==========================================
export default function App() {
  const [activeMode, setActiveMode] = useState('my');
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacySheetOpen, setPrivacySheetOpen] = useState(false);
  
  // Controls the new full-screen Insights Dashboard
  const [insightsOpen, setInsightsOpen] = useState(false);

  const MODES = [
    { id: 'my', label: 'My' },
    { id: 'friends', label: 'Friends', badge: true },
    { id: 'community', label: 'Community' }
  ];

  const handleMenuClick = () => setMenuOpen(true);
  const handleOpenPrivacy = () => {
    setMenuOpen(false);
    setTimeout(() => setPrivacySheetOpen(true), 300);
  };

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased text-[#111111]">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* iPhone Wrapper */}
      <div id="mockup-root" className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#F7F7F8] sm:rounded-[50px] overflow-hidden sm:border-[8px] border-black sm:shadow-2xl flex flex-col">
        
        {/* HEADER */}
        <header className="px-5 pt-14 pb-2 bg-[#F7F7F8] z-30 flex items-center justify-between">
          <h1 className="text-[28px] font-bold tracking-tight text-[#111111]">Activity</h1>
          <button onClick={handleMenuClick} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
            <MoreVertical size={24} color="#111111" />
          </button>
        </header>

        {/* 3-MODE SEGMENTED CONTROL */}
        <SegmentedModeControl modes={MODES} activeMode={activeMode} onChange={setActiveMode} />

        {/* LAYERED CONTAINERS */}
        <div className="relative flex-1 w-full overflow-hidden mt-1 bg-[#F0F0F2]">
          <MyActivityContainer isVisible={activeMode === 'my'} onOpenInsights={() => setInsightsOpen(true)} />
          <FriendsActivityContainer isVisible={activeMode === 'friends'} />
          <CommunityPlaceholderContainer isVisible={activeMode === 'community'} />
        </div>

        {/* FULL SCREEN OVERLAYS */}
        <ActivityInsightsScreen isOpen={insightsOpen} onClose={() => setInsightsOpen(false)} />
        
      </div>

      {/* ================= BOTTOM SHEETS ================= */}

      {/* Main Menu Sheet */}
      <BottomSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
        <div className="flex flex-col gap-1">
          <button onClick={handleOpenPrivacy} className="flex items-center gap-3 w-full p-4 hover:bg-[#F7F7F8] rounded-[16px] transition-colors text-left active:bg-[#F0F0F2]">
            <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0"><Lock size={18} color="#111111" /></div>
            <span className="text-[16px] font-medium text-[#111111]">Privacy settings</span>
          </button>
          <div className="h-[1px] bg-black/[0.04] mx-4 my-1" />
          <button onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full p-4 hover:bg-[#F7F7F8] rounded-[16px] transition-colors text-left active:bg-[#F0F0F2]">
            <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0"><Download size={18} color="#111111" /></div>
            <span className="text-[16px] font-medium text-[#111111]">Export activity log</span>
          </button>
        </div>
      </BottomSheet>

      {/* Privacy Settings Sheet */}
      <BottomSheet isOpen={privacySheetOpen} onClose={() => setPrivacySheetOpen(false)} title="Activity Privacy">
        <div className="flex flex-col gap-6">
          <p className="text-[14px] text-[#6E6E73] mt(-2) leading-relaxed">
            Control who can see your pet's timeline. Health data is strictly private by design.
          </p>
          
          <div className="space-y-5">
            {[
              { label: 'Photos', default: 'Friends only' },
              { label: 'Check-ins', default: 'Friends only' },
              { label: 'Milestones', default: 'Friends only' },
              { label: 'Service Reviews', default: 'Public' },
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-2">
                <label className="text-[15px] font-semibold text-[#111111]">{item.label}</label>
                <div className="relative">
                  <select className="w-full h-[52px] px-4 bg-[#F7F7F8] border border-transparent text-[16px] text-[#111111] rounded-[16px] appearance-none focus:outline-none focus:border-[#FF6A3D] focus:bg-[#FFFFFF] transition-colors">
                    <option>{item.default}</option>
                    <option>Private</option>
                    <option>Public</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8E8E93]" size={18} />
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-2 opacity-60 pointer-events-none mt-2">
              <label className="text-[15px] font-semibold text-[#111111] flex items-center gap-1.5">
                Health Data <Lock size={14} />
              </label>
              <div className="w-full h-[52px] px-4 bg-[#F7F7F8] border border-transparent text-[16px] text-[#8E8E93] rounded-[16px] flex items-center">
                Always Private
              </div>
            </div>
          </div>

          <button onClick={() => setPrivacySheetOpen(false)} className="w-full h-[56px] bg-[#111111] text-white font-semibold text-[16px] rounded-[16px] mt-2 active:scale-[0.98] transition-transform">
            Save Changes
          </button>
        </div>
      </BottomSheet>

    </div>
  );
}