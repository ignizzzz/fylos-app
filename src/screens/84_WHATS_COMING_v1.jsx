import React, { useState } from 'react';
import { ChevronLeft, Rocket, Users, HeartPulse, MapPin, Watch, Beaker, Sparkles, ThumbsUp, Bell } from 'lucide-react';

const THEME = { bg: '#F7F5F2', coral: '#E85D2A', txt: '#111', muted: '#6E6E73', tint: '#FBE7DD', green: '#00C060' };

const STATUS = {
  testing:  { label: 'In testing',   bg: '#E5F9ED', color: '#00C060' },
  soon:     { label: 'Coming soon',  bg: '#FFF4E5', color: '#B66B00' },
  exploring:{ label: 'Exploring',    bg: '#E5F0FF', color: '#0B4C8F' },
};

const ITEMS = [
  { id: 'family',   Icon: Users,      title: 'Multi-pet family accounts', desc: 'Share care between family members with individual roles.', status: 'testing', votes: 412, eta: 'Late April' },
  { id: 'ai',       Icon: Sparkles,   title: 'AI health coach',           desc: 'Personalised weekly tips based on your pet\'s activity and diet.',   status: 'testing', votes: 301, eta: 'May' },
  { id: 'lost',     Icon: MapPin,     title: 'Lost pet alerts v2',        desc: 'Broadcast to verified neighbours in a 2km radius with heat-map.', status: 'soon',    votes: 688, eta: 'Q2' },
  { id: 'boarding', Icon: Beaker,     title: 'Boarding marketplace',      desc: 'Multi-night stays with vetted sitters and live webcam.',           status: 'soon',    votes: 520, eta: 'Q2' },
  { id: 'wear',     Icon: Watch,      title: 'Wearable integrations',     desc: 'Live GPS and heart rate from FitBark, Tractive and Garmin.',       status: 'exploring', votes: 277, eta: 'Q3' },
  { id: 'health2',  Icon: HeartPulse, title: 'Vet record auto-import',    desc: 'Scan paper records — we digitise, categorise and schedule follow-ups.', status: 'exploring', votes: 189, eta: 'Q3' },
];

const AppHeader = ({ title, onBack }) => (
  <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30" style={{ backgroundColor: 'rgba(247,245,242,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
    <button onClick={onBack} className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all">
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: THEME.txt }}>{title}</h1>
  </div>
);

const Toggle = ({ on, onChange }) => (
  <button role="switch" aria-checked={on} onClick={() => onChange(!on)}
    className="relative shrink-0 rounded-full transition-colors duration-200"
    style={{ width: 42, height: 25, padding: 2, backgroundColor: on ? THEME.coral : '#D4D4D8' }}>
    <div className="bg-white rounded-full shadow-sm transition-transform duration-200"
      style={{ width: 21, height: 21, transform: `translateX(${on ? 17 : 0}px)` }} />
  </button>
);

export default function WhatsComingScreen() {
  const [earlyAccess, setEarlyAccess] = useState(false);
  const [voted, setVoted] = useState({});
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;}.wc-scroll::-webkit-scrollbar{display:none;}.wc-scroll{scrollbar-width:none;}`}</style>
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

        <div className="wc-scroll absolute inset-0 overflow-y-auto pb-10">
          <AppHeader title="What's coming" onBack={back} />

          <div className="px-4">
            <div className="bg-white rounded-[18px] p-3.5 mb-4 border border-black/[0.04] flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                <Rocket size={20} color={THEME.coral} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>Early access program</div>
                <div className="text-[11.5px]" style={{ color: THEME.muted }}>Try new features first · expect rough edges</div>
              </div>
              <Toggle on={earlyAccess} onChange={setEarlyAccess} />
            </div>

            {Object.keys(STATUS).map(sKey => {
              const items = ITEMS.filter(i => i.status === sKey);
              if (!items.length) return null;
              return (
                <div key={sKey} className="mb-4">
                  <div className="flex items-center gap-2 px-2 mb-2">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: STATUS[sKey].bg, color: STATUS[sKey].color }}>{STATUS[sKey].label}</span>
                    <span className="text-[11.5px]" style={{ color: THEME.muted }}>{items.length} item{items.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map(it => {
                      const isVoted = voted[it.id];
                      return (
                        <div key={it.id} className="bg-white rounded-[16px] border border-black/[0.04] p-3.5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                              <it.Icon size={18} color={THEME.coral} strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[14.5px] font-semibold leading-tight" style={{ color: THEME.txt }}>{it.title}</div>
                              <div className="text-[12px] mt-1 leading-snug" style={{ color: THEME.muted }}>{it.desc}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F1EDE8]">
                            <span className="text-[11.5px] flex items-center gap-1" style={{ color: THEME.muted }}>
                              <Bell size={11} strokeWidth={2}/> ETA {it.eta}
                            </span>
                            <button onClick={() => setVoted(v => ({ ...v, [it.id]: !v[it.id] }))}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-semibold active:scale-95 transition-all"
                              style={{ backgroundColor: isVoted ? THEME.tint : '#F7F5F2', color: isVoted ? THEME.coral : THEME.muted }}>
                              <ThumbsUp size={11} strokeWidth={2.4} />
                              {it.votes + (isVoted ? 1 : 0)}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <p className="text-[11.5px] text-center mt-4 px-4 leading-snug" style={{ color: THEME.muted }}>
              Your votes help us prioritise. Not all explorations will ship.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
