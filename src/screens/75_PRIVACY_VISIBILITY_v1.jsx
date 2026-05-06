import React, { useState } from 'react';
import { ChevronLeft, Check, Globe, Users, Lock, Info } from 'lucide-react';

const THEME = {
  bg: '#F7F5F2', card: '#FFFFFF', divider: '#F1EDE8',
  coral: '#E85D2A', txt: '#111111', muted: '#9B9B9F',
  mutedDark: '#6E6E73', tint: '#FBE7DD', success: '#00C060',
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

const OPTIONS = [
  { id: 'public',  Icon: Globe, title: 'Public',  desc: 'Anyone on Fylos can find and view your profile and public activity.' },
  { id: 'friends', Icon: Users, title: 'Friends', desc: 'Only people you\'ve added as friends can see your profile and activity.' },
  { id: 'private', Icon: Lock,  title: 'Private', desc: 'Only you can see your profile. Your pets won\'t appear in searches.' },
];

const PrivacyVisibilityScreen = () => {
  const [value, setValue] = useState('friends');

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
          <AppHeader title="Profile visibility" onBack={back} />
          <div className="px-4">
            <p className="text-[12.5px] px-2 mt-1 mb-4 leading-snug" style={{ color: THEME.mutedDark }}>
              Choose who can see your profile, your pets, and your public activity. Health data is always private.
            </p>

            <div className="space-y-2">
              {OPTIONS.map((o) => {
                const selected = value === o.id;
                return (
                  <button
                    key={o.id}
                    onClick={() => setValue(o.id)}
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
                      style={{
                        border: `1.5px solid ${selected ? THEME.coral : '#D4D4D8'}`,
                        backgroundColor: selected ? THEME.coral : 'transparent',
                      }}
                    >
                      {selected && <Check size={11} color="#FFFFFF" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-start gap-2 mt-5 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                Emergency contacts can always reach you regardless of this setting.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyVisibilityScreen;
