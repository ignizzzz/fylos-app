import React, { useState, useMemo } from 'react';
import { ChevronLeft, Check, Search, Info, MapPin } from 'lucide-react';

const THEME = { bg: '#F7F5F2', coral: '#E85D2A', txt: '#111', muted: '#6E6E73', tint: '#FBE7DD' };

const COUNTRIES = [
  { code: 'CH', name: 'Switzerland', dial: '+41', tz: 'Europe/Zurich (UTC+1)', flag: '🇨🇭', group: 'Suggested' },
  { code: 'DE', name: 'Germany',     dial: '+49', tz: 'Europe/Berlin (UTC+1)', flag: '🇩🇪', group: 'Suggested' },
  { code: 'AT', name: 'Austria',     dial: '+43', tz: 'Europe/Vienna (UTC+1)', flag: '🇦🇹', group: 'Suggested' },
  { code: 'FR', name: 'France',      dial: '+33', tz: 'Europe/Paris (UTC+1)',  flag: '🇫🇷', group: 'Europe' },
  { code: 'IT', name: 'Italy',       dial: '+39', tz: 'Europe/Rome (UTC+1)',   flag: '🇮🇹', group: 'Europe' },
  { code: 'NL', name: 'Netherlands', dial: '+31', tz: 'Europe/Amsterdam (UTC+1)', flag: '🇳🇱', group: 'Europe' },
  { code: 'GB', name: 'United Kingdom', dial: '+44', tz: 'Europe/London (UTC+0)', flag: '🇬🇧', group: 'Europe' },
  { code: 'ES', name: 'Spain',       dial: '+34', tz: 'Europe/Madrid (UTC+1)', flag: '🇪🇸', group: 'Europe' },
  { code: 'US', name: 'United States', dial: '+1', tz: 'America/New_York (UTC-5)', flag: '🇺🇸', group: 'Americas' },
  { code: 'CA', name: 'Canada',      dial: '+1',  tz: 'America/Toronto (UTC-5)', flag: '🇨🇦', group: 'Americas' },
];

const AppHeader = ({ title, onBack }) => (
  <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30" style={{ backgroundColor: 'rgba(247,245,242,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
    <button onClick={onBack} className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all">
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: THEME.txt }}>{title}</h1>
  </div>
);

export default function RegionScreen() {
  const [value, setValue] = useState('CH');
  const [query, setQuery] = useState('');
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  const filtered = useMemo(() => {
    if (!query) return COUNTRIES;
    const q = query.toLowerCase();
    return COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.dial.includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(c => { (map[c.group] ||= []).push(c); });
    return map;
  }, [filtered]);

  const selected = COUNTRIES.find(c => c.code === value);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;}.region-scroll::-webkit-scrollbar{display:none;}.region-scroll{scrollbar-width:none;}`}</style>
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: THEME.bg, WebkitFontSmoothing: 'antialiased' }}>
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

        <div className="region-scroll absolute inset-0 overflow-y-auto pb-10">
          <AppHeader title="Region" onBack={back} />

          <div className="px-4">
            <p className="text-[12.5px] px-2 mt-1 mb-3 leading-snug" style={{ color: THEME.muted }}>
              Your region affects date formats, default currency, timezone and which vet partners appear nearby.
            </p>

            {selected && (
              <div className="bg-white rounded-[18px] p-3.5 mb-4 border border-black/[0.04] flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint, fontSize: 22 }}>{selected.flag}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14.5px] font-semibold" style={{ color: THEME.txt }}>Current · {selected.name}</div>
                  <div className="text-[12px]" style={{ color: THEME.muted }}>{selected.tz} · Dial {selected.dial}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ backgroundColor: THEME.tint, color: THEME.coral }}>Active</span>
              </div>
            )}

            <div className="flex items-center gap-2 mb-3 px-3.5 py-2.5 rounded-[14px] bg-white border border-black/[0.04]">
              <Search size={15} color={THEME.muted} strokeWidth={2.2} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search country or dial code"
                className="flex-1 text-[13.5px] outline-none bg-transparent" style={{ color: THEME.txt }} />
            </div>

            {Object.keys(grouped).map(group => (
              <div key={group} className="mb-4">
                <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>{group}</div>
                <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
                  {grouped[group].map((c, i) => {
                    const isSelected = value === c.code;
                    return (
                      <button key={c.code} onClick={() => setValue(c.code)}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 text-left active:bg-black/[0.03] transition-colors"
                        style={{ borderBottom: i < grouped[group].length - 1 ? '1px solid #F1EDE8' : 'none' }}>
                        <span style={{ fontSize: 20 }}>{c.flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-[14px] font-semibold truncate" style={{ color: THEME.txt }}>{c.name}</div>
                          <div className="text-[11.5px] truncate" style={{ color: THEME.muted }}>{c.tz} · {c.dial}</div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.coral }}>
                            <Check size={11} color="#FFF" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                Changing your region won't convert existing bookings or health records.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
