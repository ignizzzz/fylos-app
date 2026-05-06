import React, { useState } from 'react';
import { ChevronLeft, Camera, MapPin, Award, Star, HeartPulse, Lock, Info } from 'lucide-react';

const THEME = {
  bg: '#F7F5F2', card: '#FFFFFF', divider: '#F1EDE8',
  coral: '#E85D2A', txt: '#111111', muted: '#9B9B9F',
  mutedDark: '#6E6E73', tint: '#FBE7DD',
};

const AppHeader = ({ title, onBack }) => (
  <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none">
    <button
      onClick={onBack}
      className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
    >
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: THEME.txt }}>{title}</h1>
  </div>
);

const SectionLabel = ({ children }) => (
  <div className="text-[10.5px] font-semibold text-[#8E8E93] tracking-[0.1em] uppercase mb-1.5 ml-3 mt-5">{children}</div>
);

const SCOPES = [
  { id: 'public',  label: 'Public'  },
  { id: 'friends', label: 'Friends' },
  { id: 'private', label: 'Private' },
];

const CATEGORIES = [
  { id: 'photos',     Icon: Camera,    title: 'Photos',          desc: 'Photos you post from walks, playdates & home' },
  { id: 'checkins',   Icon: MapPin,    title: 'Check-ins',       desc: 'Places you visit with your pet' },
  { id: 'milestones', Icon: Award,     title: 'Milestones',      desc: 'Birthdays, streaks & achievements' },
  { id: 'reviews',    Icon: Star,      title: 'Service reviews', desc: 'Ratings for walkers, groomers, vets' },
];

const Picker = ({ value, onChange }) => (
  <div className="flex gap-1 bg-[#F7F5F2] rounded-full p-0.5">
    {SCOPES.map((s) => {
      const active = value === s.id;
      return (
        <button
          key={s.id}
          onClick={(e) => { e.stopPropagation(); onChange(s.id); }}
          className="px-2.5 h-7 rounded-full text-[11px] font-semibold transition-all active:scale-95"
          style={{ backgroundColor: active ? THEME.coral : 'transparent', color: active ? '#FFFFFF' : THEME.mutedDark }}
        >
          {s.label}
        </button>
      );
    })}
  </div>
);

const PrivacyActivityScreen = () => {
  const [scopes, setScopes] = useState({
    photos: 'friends',
    checkins: 'friends',
    milestones: 'public',
    reviews: 'public',
  });

  const update = (id, val) => setScopes((p) => ({ ...p, [id]: val }));

  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .priv-scroll::-webkit-scrollbar { display: none; }
        .priv-scroll { scrollbar-width: none; }
      `}</style>

      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: THEME.bg, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        <div className="priv-scroll absolute inset-0 overflow-y-auto pb-10" style={{ scrollbarWidth: 'none' }}>
          <AppHeader title="Activity sharing" onBack={back} />

          <div className="px-4">
            <p className="text-[12.5px] px-2 mt-1 mb-3 leading-snug" style={{ color: THEME.mutedDark }}>
              Choose who sees each type of activity. You can set different defaults for each category.
            </p>

            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              {CATEGORIES.map((c, i) => (
                <div key={c.id} className="relative">
                  <div className="flex items-center gap-3 px-3.5 py-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                      <c.Icon size={15} color={THEME.coral} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>{c.title}</div>
                      <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>{c.desc}</div>
                    </div>
                  </div>
                  <div className="px-3.5 pb-3">
                    <Picker value={scopes[c.id]} onChange={(v) => update(c.id, v)} />
                  </div>
                  {i < CATEGORIES.length - 1 && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: THEME.divider }} />}
                </div>
              ))}
            </div>

            <SectionLabel>Always private</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 px-3.5 py-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,59,48,0.10)' }}>
                  <HeartPulse size={15} color="#FF3B30" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>Health records</div>
                  <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>Vaccinations, vet visits, medications</div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full shrink-0" style={{ color: THEME.muted, backgroundColor: '#F7F5F2' }}>
                  <Lock size={10} strokeWidth={2.4} /> locked
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-5 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                When you post, you can override these defaults per item.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyActivityScreen;
