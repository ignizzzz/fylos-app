import React, { useState } from 'react';
import { ChevronLeft, Check, Crosshair, MapPin, EyeOff, Plane, Users, Info } from 'lucide-react';

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

const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="active:scale-[0.97] transition-all shrink-0"
    style={{ width: 46, height: 26, borderRadius: 9999, background: value ? THEME.coral : '#D5CEC7', position: 'relative', cursor: 'pointer' }}
  >
    <div style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 20, height: 20, borderRadius: 9999, background: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.18)', transition: 'left 200ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
  </div>
);

const PRECISION = [
  { id: 'exact',       Icon: Crosshair, title: 'Exact',       desc: 'Precise coordinates. Needed for live GPS tracking during walks.' },
  { id: 'approximate', Icon: MapPin,    title: 'Approximate', desc: 'Neighborhood-level only. Safer for public check-ins.' },
  { id: 'off',         Icon: EyeOff,    title: 'Off',         desc: 'Never share your location. Some features like playdate matching will stop working.' },
];

const PrivacyLocationScreen = () => {
  const [precision, setPrecision] = useState('approximate');
  const [communityFeed, setCommunityFeed] = useState(false);
  const [travelMode, setTravelMode] = useState(false);

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
          <AppHeader title="Location sharing" onBack={back} />

          <div className="px-4">
            <p className="text-[12.5px] px-2 mt-1 mb-3 leading-snug" style={{ color: THEME.mutedDark }}>
              How precisely your location is shared with friends and the community.
            </p>

            <SectionLabel>Precision</SectionLabel>
            <div className="space-y-2">
              {PRECISION.map((o) => {
                const selected = precision === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setPrecision(o.id)}
                    className="w-full flex items-start gap-3 px-3.5 py-3 rounded-[16px] bg-white text-left active:scale-[0.99] transition-all"
                    style={{ border: `1.5px solid ${selected ? THEME.coral : 'rgba(0,0,0,0.04)'}` }}
                  >
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                      <o.Icon size={16} color={THEME.coral} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0 pt-[2px]">
                      <div className="text-[14.5px] font-semibold leading-tight" style={{ color: THEME.txt }}>{o.title}</div>
                      <div className="text-[12px] mt-1 leading-snug" style={{ color: THEME.mutedDark }}>{o.desc}</div>
                    </div>
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-[2px]"
                      style={{ border: `1.5px solid ${selected ? THEME.coral : '#D4D4D8'}`, backgroundColor: selected ? THEME.coral : 'transparent' }}
                    >
                      {selected && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <SectionLabel>Community</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <div className="relative">
                <div className="flex items-center gap-3 px-3.5 py-3" style={{ opacity: precision === 'off' ? 0.45 : 1 }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(52,199,89,0.12)' }}>
                    <Users size={15} color="#2EA849" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>Show me in community feed</div>
                    <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>Nearby pet owners can discover you for playdates</div>
                  </div>
                  <Toggle value={communityFeed && precision !== 'off'} onChange={setCommunityFeed} />
                </div>
                <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: THEME.divider }} />
              </div>
              <div className="flex items-center gap-3 px-3.5 py-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(245,158,11,0.14)' }}>
                  <Plane size={15} color="#F59E0B" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>Travel mode</div>
                  <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>Pause location sharing while away from home</div>
                </div>
                <Toggle value={travelMode} onChange={setTravelMode} />
              </div>
            </div>

            <div className="flex items-start gap-2 mt-5 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                Emergency SOS always uses your exact location, regardless of this setting.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyLocationScreen;
