import React, { useState } from 'react';
import { ChevronLeft, Check, AlertCircle, Info } from 'lucide-react';

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

/* SVG logos — no external assets */
const AppleLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#111">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const GoogleLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const FacebookLogo = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const SecurityAccountsScreen = () => {
  const [accounts, setAccounts] = useState({
    apple:    { connected: true,  email: 'talita.k@icloud.com', since: 'March 2024' },
    google:   { connected: false },
    facebook: { connected: false },
  });
  const [usesPassword, setUsesPassword] = useState(true);

  const toggle = (key) => setAccounts((prev) => {
    const wasConnected = prev[key].connected;
    // prevent disconnecting last sign-in method
    const otherConnected = Object.entries(prev).filter(([k]) => k !== key).some(([, v]) => v.connected);
    if (wasConnected && !otherConnected && !usesPassword) return prev;
    return { ...prev, [key]: { ...prev[key], connected: !wasConnected, email: !wasConnected ? 'talita@example.com' : prev[key].email, since: !wasConnected ? 'Just now' : prev[key].since } };
  });

  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  const providers = [
    { key: 'apple',    name: 'Apple',    Logo: AppleLogo },
    { key: 'google',   name: 'Google',   Logo: GoogleLogo },
    { key: 'facebook', name: 'Facebook', Logo: FacebookLogo },
  ];

  const totalConnected = providers.filter((p) => accounts[p.key].connected).length;

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
          <AppHeader title="Connected accounts" onBack={back} />

          <div className="px-4">
            <div className="pt-2 pb-3 px-2">
              <p className="text-[12.5px] leading-snug" style={{ color: THEME.mutedDark }}>
                Sign in to Fylos with one of these accounts as an alternative to your password.
              </p>
            </div>

            <SectionLabel>Sign-in methods · {totalConnected + (usesPassword ? 1 : 0)}</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              {providers.map((p, i) => {
                const a = accounts[p.key];
                const isLast = i === providers.length - 1;
                const onlyMethod = a.connected && totalConnected === 1 && !usesPassword;
                return (
                  <div key={p.key} className="relative">
                    <div className="flex items-center gap-3 px-3.5 py-3">
                      <div className="w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center shrink-0">
                        <p.Logo size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>{p.name}</span>
                          {a.connected && (
                            <span className="inline-flex items-center gap-[3px] text-[10px] font-bold px-1.5 py-[1px] rounded" style={{ color: THEME.success, backgroundColor: 'rgba(0,192,96,0.12)' }}>
                              <Check size={9} strokeWidth={3} /> LINKED
                            </span>
                          )}
                        </div>
                        <div className="text-[11.5px] mt-[2px] truncate" style={{ color: THEME.muted }}>
                          {a.connected ? `${a.email} · Since ${a.since}` : 'Not connected'}
                        </div>
                      </div>
                      <button
                        onClick={() => toggle(p.key)}
                        disabled={onlyMethod}
                        className="text-[12px] font-semibold px-3 py-1.5 rounded-full active:scale-95"
                        style={{
                          color: a.connected ? THEME.danger : '#FFFFFF',
                          backgroundColor: a.connected ? 'rgba(255,59,48,0.08)' : THEME.coral,
                          opacity: onlyMethod ? 0.4 : 1,
                          cursor: onlyMethod ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {a.connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                    {!isLast && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: THEME.divider }} />}
                  </div>
                );
              })}
            </div>

            <SectionLabel>Password</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 px-3.5 py-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                  <Check size={16} color={THEME.coral} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>Email + password</div>
                  <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>talita.k@email.com · Last used today</div>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 mt-4 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                You always need at least one sign-in method. The last one can't be removed.
              </span>
            </div>

            {totalConnected === 0 && !usesPassword && (
              <div className="flex items-start gap-2 mt-3 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(255,59,48,0.08)' }}>
                <AlertCircle size={13} color={THEME.danger} strokeWidth={2.2} className="shrink-0 mt-[2px]" />
                <span className="text-[12px] leading-snug" style={{ color: '#8B1A14' }}>
                  You have no sign-in method. Please set a password or link an account.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAccountsScreen;
