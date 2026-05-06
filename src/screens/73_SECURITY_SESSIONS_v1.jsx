import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Smartphone, Laptop, Tablet,
  Check, LogOut, AlertTriangle, History,
} from 'lucide-react';

const THEME = {
  bg: '#F7F5F2', card: '#FFFFFF', divider: '#F1EDE8',
  coral: '#E85D2A', txt: '#111111', muted: '#9B9B9F',
  mutedDark: '#6E6E73', tint: '#FBE7DD', success: '#00C060', danger: '#FF3B30',
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

const SESSIONS = [
  { id: 's2', device: 'MacBook Pro',   Icon: Laptop,     app: 'Chrome 121',  location: 'Zürich, CH',  time: '2 hours ago',  ip: '85.1.234.·' },
  { id: 's3', device: 'iPad Air',       Icon: Tablet,     app: 'Safari',      location: 'Bern, CH',    time: 'Yesterday',    ip: '46.140.12.·' },
  { id: 's4', device: 'iPhone 13',      Icon: Smartphone, app: 'Fylos app',   location: 'Berlin, DE',  time: '4 days ago',   ip: '91.64.42.·', suspicious: true },
];

const SecuritySessionsScreen = () => {
  const [sessions, setSessions] = useState(SESSIONS);
  const [showConfirmAll, setShowConfirmAll] = useState(false);

  const signOut = (id) => setSessions((s) => s.filter((x) => x.id !== id));
  const signOutAll = () => setSessions([]);

  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .sec-scroll::-webkit-scrollbar { display: none; }
        .sec-scroll { scrollbar-width: none; }
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

        <div className="sec-scroll absolute inset-0 overflow-y-auto pb-10" style={{ scrollbarWidth: 'none' }}>
          <AppHeader title="Active sessions" onBack={back} />

          <div className="px-4">
            <div className="pt-2 pb-3 px-2">
              <p className="text-[12.5px] leading-snug" style={{ color: THEME.mutedDark }}>
                These are all the places your Fylos account is currently signed in. Remove any you don't recognize.
              </p>
            </div>

            <SectionLabel>This device</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 px-3.5 py-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 relative" style={{ backgroundColor: THEME.tint }}>
                  <Smartphone size={17} color={THEME.coral} strokeWidth={2} />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ backgroundColor: THEME.success, border: `2px solid ${THEME.card}` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>iPhone 15</span>
                    <span className="text-[9.5px] font-bold px-1.5 py-[1px] rounded text-white" style={{ backgroundColor: THEME.success }}>CURRENT</span>
                  </div>
                  <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>Fylos app · Zürich, CH · Now</div>
                </div>
              </div>
            </div>

            <SectionLabel>Other sessions · {sessions.length}</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              {sessions.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <p className="text-[13px]" style={{ color: THEME.muted }}>No other sessions.</p>
                </div>
              ) : (
                sessions.map((s, i) => (
                  <div key={s.id} className="relative">
                    <div className="flex items-center gap-3 px-3.5 py-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: s.suspicious ? 'rgba(255,59,48,0.10)' : '#F1EDE8' }}>
                        <s.Icon size={17} color={s.suspicious ? THEME.danger : THEME.mutedDark} strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>{s.device}</span>
                          {s.suspicious && (
                            <span className="inline-flex items-center gap-0.5 text-[9.5px] font-bold px-1.5 py-[1px] rounded" style={{ color: THEME.danger, backgroundColor: 'rgba(255,59,48,0.10)' }}>
                              <AlertTriangle size={9} strokeWidth={2.4} /> NEW
                            </span>
                          )}
                        </div>
                        <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>{s.app} · {s.location} · {s.time}</div>
                      </div>
                      <button
                        onClick={() => signOut(s.id)}
                        className="text-[12px] font-semibold px-2.5 py-1.5 rounded-full active:scale-95"
                        style={{ color: THEME.danger, backgroundColor: 'rgba(255,59,48,0.08)' }}
                      >
                        Sign out
                      </button>
                    </div>
                    {i < sessions.length - 1 && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: THEME.divider }} />}
                  </div>
                ))
              )}
            </div>

            {!showConfirmAll && sessions.length > 0 && (
              <button
                onClick={() => setShowConfirmAll(true)}
                className="w-full mt-4 h-11 rounded-[14px] bg-white border border-black/[0.06] flex items-center justify-center gap-2 text-[14px] font-semibold active:scale-[0.98]"
                style={{ color: THEME.danger }}
              >
                <LogOut size={15} strokeWidth={2.2} /> Sign out of all other sessions
              </button>
            )}

            {showConfirmAll && (
              <div className="mt-4 p-4 rounded-[14px]" style={{ backgroundColor: 'rgba(255,59,48,0.08)' }}>
                <div className="flex items-start gap-2 mb-3">
                  <AlertTriangle size={14} color={THEME.danger} strokeWidth={2.2} className="shrink-0 mt-[2px]" />
                  <span className="text-[12.5px] leading-snug" style={{ color: '#8B1A14' }}>
                    This will sign you out of {sessions.length} {sessions.length === 1 ? 'device' : 'devices'}. You'll need to sign in again on each.
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowConfirmAll(false)} className="flex-1 h-10 rounded-[12px] bg-white text-[13px] font-semibold" style={{ color: THEME.txt, border: '1px solid rgba(0,0,0,0.06)' }}>
                    Cancel
                  </button>
                  <button
                    onClick={() => { signOutAll(); setShowConfirmAll(false); }}
                    className="flex-1 h-10 rounded-[12px] text-white text-[13px] font-semibold"
                    style={{ backgroundColor: THEME.danger }}
                  >
                    Sign out all
                  </button>
                </div>
              </div>
            )}

            <SectionLabel>More</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <button className="w-full flex items-center gap-3 px-3.5 py-3 active:bg-black/[0.02] text-left">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                  <History size={15} color={THEME.coral} strokeWidth={2} />
                </div>
                <span className="flex-1 text-[14px] font-semibold" style={{ color: THEME.txt }}>View login activity</span>
                <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
              </button>
            </div>

            <div className="text-center mt-5 mb-2">
              <p className="text-[10.5px]" style={{ color: '#B8B0A8' }}>Don't recognise a session? Change your password immediately.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySessionsScreen;
