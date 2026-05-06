import React from 'react';
import { ChevronLeft, Phone, Navigation, Stethoscope, Star, Clock, Info, PawPrint, ChevronRight } from 'lucide-react';

const THEME = { bg: '#F7F5F2', coral: '#E85D2A', txt: '#111', muted: '#6E6E73', tint: '#FBE7DD', green: '#00C060' };

const AppHeader = ({ title, onBack }) => (
  <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30" style={{ backgroundColor: 'rgba(247,245,242,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
    <button onClick={onBack} className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all">
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: THEME.txt }}>{title}</h1>
  </div>
);

const PETS = [
  { id: 'luna', name: 'Luna', breed: 'Golden Retriever', avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=80&h=80' },
  { id: 'milo', name: 'Milo', breed: 'Beagle',           avatar: 'https://images.unsplash.com/photo-1537151608804-ea2f1ea14a15?auto=format&fit=crop&q=80&w=80&h=80' },
];

export default function PrimaryVetScreen() {
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;}.vet-scroll::-webkit-scrollbar{display:none;}.vet-scroll{scrollbar-width:none;}`}</style>
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

        <div className="vet-scroll absolute inset-0 overflow-y-auto pb-10">
          <AppHeader title="Primary vet" onBack={back} />

          <div className="px-4">
            <div className="bg-white rounded-[22px] border border-black/[0.04] overflow-hidden mt-2 mb-4">
              <div className="p-4 flex items-start gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                  <Stethoscope size={24} color={THEME.coral} strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[16px] font-bold" style={{ color: THEME.txt }}>Dr. Schmidt Tierklinik</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5 mb-1">
                    <Star size={11} color="#FFB800" fill="#FFB800" />
                    <span className="text-[11.5px] font-semibold" style={{ color: THEME.txt }}>4.9</span>
                    <span className="text-[11.5px]" style={{ color: THEME.muted }}>· 248 reviews</span>
                  </div>
                  <div className="text-[12px] leading-snug" style={{ color: THEME.muted }}>
                    Seestrasse 42 · 8002 Zürich<br/>+41 44 123 4567
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 border-t border-[#F1EDE8]">
                <button className="py-3 flex flex-col items-center gap-1 active:bg-black/[0.03] border-r border-[#F1EDE8]">
                  <Phone size={16} color={THEME.coral} strokeWidth={2} />
                  <span className="text-[11.5px] font-semibold" style={{ color: THEME.txt }}>Call</span>
                </button>
                <button className="py-3 flex flex-col items-center gap-1 active:bg-black/[0.03] border-r border-[#F1EDE8]">
                  <Navigation size={16} color={THEME.coral} strokeWidth={2} />
                  <span className="text-[11.5px] font-semibold" style={{ color: THEME.txt }}>Directions</span>
                </button>
                <button className="py-3 flex flex-col items-center gap-1 active:bg-black/[0.03]">
                  <Clock size={16} color={THEME.coral} strokeWidth={2} />
                  <span className="text-[11.5px] font-semibold" style={{ color: THEME.txt }}>Book visit</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[16px] border border-black/[0.04] p-3.5 mb-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#E5F9ED' }}>
                <Clock size={15} color={THEME.green} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold" style={{ color: THEME.txt }}>Next appointment</div>
                <div className="text-[12px]" style={{ color: THEME.muted }}>Luna · Annual check-up · Mar 14, 10:30</div>
              </div>
              <ChevronRight size={16} color="#CFCFD4" />
            </div>

            <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>Specialties</div>
            <div className="flex flex-wrap gap-1.5 mb-4 px-1">
              {['General care','Dermatology','Dentistry','Surgery','Emergency'].map(t => (
                <span key={t} className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: THEME.tint, color: THEME.coral }}>{t}</span>
              ))}
            </div>

            <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>Linked pets</div>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden mb-4">
              {PETS.map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 px-3.5 py-3" style={{ borderBottom: i < PETS.length - 1 ? '1px solid #F1EDE8' : 'none' }}>
                  <img src={p.avatar} className="w-10 h-10 rounded-full object-cover" alt={p.name} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>{p.name}</div>
                    <div className="text-[11.5px]" style={{ color: THEME.muted }}>{p.breed}</div>
                  </div>
                  <PawPrint size={14} color={THEME.coral} />
                </div>
              ))}
            </div>

            <button className="w-full py-3 rounded-[14px] font-semibold text-[14px] active:scale-[0.99] transition-all mb-2" style={{ backgroundColor: '#111', color: '#FFF' }}>
              Find another clinic
            </button>
            <button className="w-full py-2.5 rounded-[14px] font-semibold text-[13.5px] border border-black/[0.06] bg-white active:scale-[0.99] transition-all" style={{ color: '#FF3B30' }}>
              Remove primary vet
            </button>

            <div className="flex items-start gap-2 mt-4 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                Emergency SOS always calls the nearest 24/7 clinic, not your primary vet.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
