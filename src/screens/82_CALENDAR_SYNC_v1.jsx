import React, { useState } from 'react';
import { ChevronLeft, CalendarClock, Stethoscope, Users, PawPrint, Pill, ChevronRight, Info, CheckCircle2 } from 'lucide-react';

const THEME = { bg: '#F7F5F2', coral: '#E85D2A', txt: '#111', muted: '#6E6E73', tint: '#FBE7DD', green: '#00C060' };

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

export default function CalendarSyncScreen() {
  const [sync, setSync] = useState({ vet: true, playdates: true, walks: false, meds: true });
  const toggle = (k) => setSync(p => ({ ...p, [k]: !p[k] }));
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;}.cs-scroll::-webkit-scrollbar{display:none;}.cs-scroll{scrollbar-width:none;}`}</style>
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

        <div className="cs-scroll absolute inset-0 overflow-y-auto pb-10">
          <AppHeader title="Calendar sync" onBack={back} />

          <div className="px-4">
            <p className="text-[12.5px] px-2 mt-1 mb-3 leading-snug" style={{ color: THEME.muted }}>
              Events you create in Fylos appear in your calendar, and edits sync both ways.
            </p>

            <div className="bg-white rounded-[18px] p-3.5 mb-4 border border-black/[0.04] flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#E5F0FF' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2.5" fill="#FFF" stroke="#4285F4" strokeWidth="1.5"/><path d="M3 8h18" stroke="#4285F4" strokeWidth="1.5"/><path d="M8 2v4M16 2v4" stroke="#4285F4" strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="13" r="1" fill="#EA4335"/><circle cx="12" cy="13" r="1" fill="#FBBC04"/><circle cx="16" cy="13" r="1" fill="#34A853"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14.5px] font-semibold" style={{ color: THEME.txt }}>Google Calendar</span>
                  <CheckCircle2 size={13} color={THEME.green} strokeWidth={2.4} />
                </div>
                <div className="text-[12px] truncate" style={{ color: THEME.muted }}>alex@gmail.com · Two-way sync</div>
              </div>
              <button className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#F3EFEB', color: THEME.txt }}>Change</button>
            </div>

            <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>Sync events</div>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden mb-4">
              {[
                { k: 'vet',       Icon: Stethoscope,   title: 'Vet appointments',     desc: 'Check-ups, vaccinations, surgery' },
                { k: 'playdates', Icon: Users,         title: 'Playdates',            desc: 'Meetups with friends' },
                { k: 'walks',     Icon: PawPrint,      title: 'Walks & bookings',     desc: 'Scheduled walker & sitter sessions' },
                { k: 'meds',      Icon: Pill,          title: 'Medication reminders', desc: 'As recurring events with alerts' },
              ].map((r, i, arr) => (
                <div key={r.k} className="flex items-center gap-3 px-3.5 py-3" style={{ borderBottom: i < arr.length - 1 ? '1px solid #F1EDE8' : 'none' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                    <r.Icon size={16} color={THEME.coral} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>{r.title}</div>
                    <div className="text-[11.5px]" style={{ color: THEME.muted }}>{r.desc}</div>
                  </div>
                  <Toggle on={sync[r.k]} onChange={() => toggle(r.k)} />
                </div>
              ))}
            </div>

            <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>Destination</div>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden mb-4">
              <button className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.03]" style={{ borderBottom: '1px solid #F1EDE8' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#E85D2A' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>Fylos · Pets</div>
                  <div className="text-[11.5px]" style={{ color: THEME.muted }}>Fylos created this calendar</div>
                </div>
                <ChevronRight size={16} color="#CFCFD4" />
              </button>
              <button className="w-full flex items-center justify-between px-3.5 py-3 text-left active:bg-black/[0.03]">
                <span className="text-[13.5px] font-medium" style={{ color: THEME.coral }}>Use a different calendar…</span>
                <ChevronRight size={16} color="#CFCFD4" />
              </button>
            </div>

            <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-[12px] mb-2" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                Private details (vet notes, medication dose) are never sent to your calendar — only the title and time.
              </span>
            </div>

            <button className="w-full mt-2 py-2.5 rounded-[14px] font-semibold text-[13.5px] border border-black/[0.06] bg-white active:scale-[0.99] transition-all" style={{ color: '#FF3B30' }}>
              Disconnect calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
