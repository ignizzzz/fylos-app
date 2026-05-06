import React, { useState } from 'react';
import { ChevronLeft, HeartPulse, Activity, Moon, Scale, Footprints, ShieldCheck, Info, CheckCircle2 } from 'lucide-react';

const THEME = { bg: '#F7F5F2', coral: '#E85D2A', txt: '#111', muted: '#6E6E73', tint: '#FBE7DD', green: '#00C060' };

const AppHeader = ({ title, onBack }) => (
  <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30" style={{ backgroundColor: 'rgba(247,245,242,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
    <button onClick={onBack} className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all">
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: THEME.txt }}>{title}</h1>
  </div>
);

const Toggle = ({ on, onChange, disabled }) => (
  <button role="switch" aria-checked={on} onClick={() => !disabled && onChange(!on)} disabled={disabled}
    className="relative shrink-0 rounded-full transition-colors duration-200"
    style={{ width: 42, height: 25, padding: 2, backgroundColor: on ? THEME.coral : '#D4D4D8', opacity: disabled ? 0.5 : 1 }}>
    <div className="bg-white rounded-full shadow-sm transition-transform duration-200"
      style={{ width: 21, height: 21, transform: `translateX(${on ? 17 : 0}px)` }} />
  </button>
);

export default function HealthSyncScreen() {
  const [connected, setConnected] = useState(false);
  const [perms, setPerms] = useState({ steps: true, heart: true, sleep: false, weight: true, activity: true });
  const toggle = (k) => setPerms(p => ({ ...p, [k]: !p[k] }));
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;}.hs-scroll::-webkit-scrollbar{display:none;}.hs-scroll{scrollbar-width:none;}`}</style>
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

        <div className="hs-scroll absolute inset-0 overflow-y-auto pb-10">
          <AppHeader title="Health & Fitness" onBack={back} />

          <div className="px-4">
            {!connected ? (
              <>
                <div className="bg-white rounded-[22px] p-6 text-center border border-black/[0.04] mt-2 mb-4">
                  <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3" style={{ backgroundColor: THEME.tint }}>
                    <HeartPulse size={28} color={THEME.coral} strokeWidth={2} />
                  </div>
                  <h2 className="text-[18px] font-bold mb-1" style={{ color: THEME.txt }}>Connect Apple Health</h2>
                  <p className="text-[13px] mb-5 px-4 leading-snug" style={{ color: THEME.muted }}>
                    Sync your steps and activity so Fylos can match walks to your own fitness routine.
                  </p>
                  <button onClick={() => setConnected(true)} className="w-full py-3 rounded-[14px] font-semibold text-[14.5px] active:scale-[0.99] transition-all" style={{ backgroundColor: '#111', color: '#FFF' }}>
                    Connect Apple Health
                  </button>
                  <button className="w-full mt-2 py-3 rounded-[14px] font-semibold text-[14.5px] border border-black/[0.06] active:scale-[0.99] transition-all bg-white" style={{ color: THEME.txt }}>
                    Connect Google Fit
                  </button>
                </div>

                <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
                  <ShieldCheck size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
                  <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                    Fylos only reads data. We never write to your Health app and you can revoke access anytime from iOS Settings.
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-[18px] p-3.5 mb-4 border border-black/[0.04] flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                    <HeartPulse size={20} color={THEME.coral} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14.5px] font-semibold" style={{ color: THEME.txt }}>Apple Health</span>
                      <CheckCircle2 size={13} color={THEME.green} strokeWidth={2.4} />
                    </div>
                    <div className="text-[12px]" style={{ color: THEME.muted }}>Last sync · 4 min ago</div>
                  </div>
                  <button onClick={() => setConnected(false)} className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: '#FFE5E5', color: '#FF3B30' }}>
                    Disconnect
                  </button>
                </div>

                <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>Data we can read</div>
                <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden mb-4">
                  {[
                    { k: 'steps',    Icon: Footprints,  title: 'Steps',          desc: 'Match walks to your daily routine' },
                    { k: 'activity', Icon: Activity,    title: 'Active minutes', desc: 'Auto-suggest playdate intensity' },
                    { k: 'heart',    Icon: HeartPulse,  title: 'Heart rate',     desc: 'Only during tracked walks' },
                    { k: 'sleep',    Icon: Moon,        title: 'Sleep',          desc: 'Better morning walk reminders' },
                    { k: 'weight',   Icon: Scale,       title: 'Body weight',    desc: 'Not shared with walkers' },
                  ].map((p, i, arr) => (
                    <div key={p.k} className="flex items-center gap-3 px-3.5 py-3" style={{ borderBottom: i < arr.length - 1 ? '1px solid #F1EDE8' : 'none' }}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                        <p.Icon size={16} color={THEME.coral} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>{p.title}</div>
                        <div className="text-[11.5px]" style={{ color: THEME.muted }}>{p.desc}</div>
                      </div>
                      <Toggle on={perms[p.k]} onChange={() => toggle(p.k)} />
                    </div>
                  ))}
                </div>

                <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
                  <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
                  <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                    Your data stays on your device. Only anonymised summaries leave Fylos (and only if analytics is on).
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
