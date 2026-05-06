import React, { useState } from 'react';
import {
  ChevronLeft, Fingerprint, Lock, CreditCard, HeartPulse,
  Download, Smartphone, Check,
} from 'lucide-react';

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

const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="active:scale-[0.97] transition-all duration-[120ms] shrink-0"
    style={{ width: 46, height: 26, borderRadius: 9999, background: value ? THEME.coral : '#D5CEC7', position: 'relative', cursor: 'pointer', transition: 'background 200ms ease' }}
  >
    <div style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 20, height: 20, borderRadius: 9999, background: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.18)', transition: 'left 200ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
  </div>
);

const SectionLabel = ({ children }) => (
  <div className="text-[10.5px] font-semibold text-[#8E8E93] tracking-[0.1em] uppercase mb-1.5 ml-3 mt-5">{children}</div>
);

const ToggleRow = ({ Icon, title, subtitle, value, onChange, last, dimmed }) => (
  <div className="relative">
    <div className="flex items-center gap-3 px-3.5 py-3" style={{ opacity: dimmed ? 0.45 : 1, transition: 'opacity 200ms ease' }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
        <Icon size={15} color={THEME.coral} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>{title}</div>
        {subtitle && <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>{subtitle}</div>}
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
    {!last && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: THEME.divider }} />}
  </div>
);

const SecurityBiometricScreen = () => {
  const [master, setMaster] = useState(true);
  const [unlock, setUnlock] = useState(true);
  const [payments, setPayments] = useState(true);
  const [health, setHealth] = useState(false);
  const [exportD, setExportD] = useState(true);
  const [lockAfter, setLockAfter] = useState('1 minute');

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
          <AppHeader title="Biometric unlock" onBack={back} />

          <div className="px-4">
            <div className="flex flex-col items-center pt-2 pb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: THEME.tint }}>
                <Fingerprint size={24} color={THEME.coral} strokeWidth={2} />
              </div>
              <h2 className="text-[17px] font-bold" style={{ color: THEME.txt }}>Face ID on this iPhone</h2>
              <p className="text-[12.5px] text-center mt-1 px-6 leading-snug" style={{ color: THEME.mutedDark }}>
                Use your face to quickly unlock Fylos and confirm sensitive actions.
              </p>
            </div>

            {/* Master toggle */}
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <ToggleRow
                Icon={Fingerprint}
                title="Face ID"
                subtitle={master ? 'Enabled on iPhone 15' : 'Disabled'}
                value={master}
                onChange={setMaster}
                last
              />
            </div>

            <SectionLabel>Use Face ID for</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <ToggleRow Icon={Lock}        title="Unlock the app"               subtitle="Every time you open Fylos"          value={unlock}   onChange={setUnlock}   dimmed={!master} />
              <ToggleRow Icon={CreditCard}  title="Confirm payments > CHF 50"    subtitle="Replaces entering your password"    value={payments} onChange={setPayments} dimmed={!master} />
              <ToggleRow Icon={HeartPulse}  title="View vet records"             subtitle="Protects sensitive health data"     value={health}   onChange={setHealth}   dimmed={!master} />
              <ToggleRow Icon={Download}    title="Export data"                  subtitle="When downloading a statement"       value={exportD}  onChange={setExportD}  dimmed={!master} last />
            </div>

            <SectionLabel>Fallback</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <button className="w-full relative flex items-center gap-3 px-3.5 py-3 active:bg-black/[0.02] text-left">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                  <Lock size={15} color={THEME.coral} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>Require password after</div>
                  <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>If Face ID fails or times out</div>
                </div>
                <span className="text-[12.5px] font-medium" style={{ color: THEME.muted }}>{lockAfter}</span>
              </button>
            </div>

            <SectionLabel>Device</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <div className="flex items-center gap-3 px-3.5 py-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,192,96,0.15)' }}>
                  <Check size={15} color={THEME.success} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="text-[14px] font-semibold leading-tight" style={{ color: THEME.txt }}>iPhone 15 · Face ID</div>
                  <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>Enrolled March 2024 · Secure Enclave</div>
                </div>
              </div>
              <div className="h-px" style={{ background: THEME.divider, marginLeft: 58 }} />
              <button className="w-full flex items-center gap-3 px-3.5 py-3 active:bg-black/[0.02] text-left">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                  <Smartphone size={15} color={THEME.coral} strokeWidth={2} />
                </div>
                <span className="flex-1 text-[14px] font-semibold" style={{ color: THEME.txt }}>Re-enroll my face</span>
              </button>
            </div>

            <div className="text-center mt-5 mb-2">
              <p className="text-[10.5px]" style={{ color: '#B8B0A8' }}>Face data never leaves this device — we only see a yes/no match.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityBiometricScreen;
