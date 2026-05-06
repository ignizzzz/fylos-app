import React, { useState, useMemo } from 'react';
import { ChevronLeft, Eye, EyeOff, Check, X, Lock } from 'lucide-react';

const THEME = {
  bg: '#F7F5F2', card: '#FFFFFF', divider: '#F1EDE8',
  coral: '#E85D2A', txt: '#111111', muted: '#9B9B9F',
  mutedDark: '#6E6E73', tint: '#FBE7DD', success: '#00C060',
  danger: '#FF3B30',
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

const PasswordField = ({ label, value, onChange, placeholder }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="mb-3">
      <label className="block text-[11px] font-medium tracking-[0.04em] mb-1.5 ml-1" style={{ color: THEME.muted }}>{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-[46px] pl-3.5 pr-11 rounded-[12px] text-[14.5px] focus:outline-none"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', color: THEME.txt }}
        />
        <button
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center active:scale-95"
        >
          {show ? <EyeOff size={16} color={THEME.muted} /> : <Eye size={16} color={THEME.muted} />}
        </button>
      </div>
    </div>
  );
};

const SecurityPasswordScreen = () => {
  const [cur, setCur] = useState('');
  const [next, setNext] = useState('');
  const [conf, setConf] = useState('');

  const checks = useMemo(() => ([
    { ok: next.length >= 8,             label: 'At least 8 characters' },
    { ok: /[A-Z]/.test(next),           label: 'One uppercase letter' },
    { ok: /[a-z]/.test(next),           label: 'One lowercase letter' },
    { ok: /[0-9]/.test(next),           label: 'One number' },
    { ok: /[^A-Za-z0-9]/.test(next),    label: 'One symbol' },
    { ok: next === conf && conf.length > 0, label: 'Passwords match' },
  ]), [next, conf]);

  const strength = checks.slice(0, 5).filter((c) => c.ok).length; // 0..5
  const strengthColor = strength < 3 ? THEME.danger : strength < 5 ? '#F59E0B' : THEME.success;
  const strengthLabel = strength < 3 ? 'Weak' : strength < 5 ? 'Good' : 'Strong';

  const valid = cur.length > 0 && checks.every((c) => c.ok);

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

        <div className="sec-scroll absolute inset-0 overflow-y-auto pb-[140px]" style={{ scrollbarWidth: 'none' }}>
          <AppHeader title="Password" onBack={back} />
          <div className="px-4">
            <div className="flex flex-col items-center pt-2 pb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: THEME.tint }}>
                <Lock size={22} color={THEME.coral} strokeWidth={2} />
              </div>
              <h2 className="text-[17px] font-bold" style={{ color: THEME.txt }}>Change your password</h2>
              <p className="text-[12.5px] text-center mt-1 px-6 leading-snug" style={{ color: THEME.mutedDark }}>
                Last changed 2 months ago. You'll be signed out from other devices.
              </p>
            </div>

            <PasswordField label="Current password" value={cur} onChange={setCur} placeholder="Enter current password" />
            <PasswordField label="New password" value={next} onChange={setNext} placeholder="Enter a new password" />

            {next.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: THEME.divider }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(strength / 5) * 100}%`, backgroundColor: strengthColor }} />
                  </div>
                  <span className="text-[11px] font-semibold" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
                <div className="bg-white rounded-[12px] border border-black/[0.04] p-3 space-y-1.5">
                  {checks.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: c.ok ? 'rgba(0,192,96,0.15)' : '#F1EDE8' }}>
                        {c.ok ? <Check size={10} color={THEME.success} strokeWidth={3} /> : <X size={9} color={THEME.muted} strokeWidth={2.5} />}
                      </div>
                      <span className="text-[12px]" style={{ color: c.ok ? THEME.txt : THEME.mutedDark }}>{c.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <PasswordField label="Confirm new password" value={conf} onChange={setConf} placeholder="Retype new password" />

            <button className="text-[13px] font-semibold ml-1 active:opacity-60" style={{ color: THEME.coral }}>
              Forgot current password?
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 px-4 pt-3 pb-7" style={{ background: 'linear-gradient(to top, rgba(247,245,242,1) 60%, rgba(247,245,242,0))' }}>
          <button
            disabled={!valid}
            className="w-full h-12 rounded-[14px] font-bold text-[15px] text-white active:scale-[0.98] transition-all"
            style={{ background: valid ? 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)' : '#D5CEC7', boxShadow: valid ? '0 8px 20px rgba(232,93,42,0.25)' : 'none', cursor: valid ? 'pointer' : 'not-allowed' }}
          >
            Update password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityPasswordScreen;
