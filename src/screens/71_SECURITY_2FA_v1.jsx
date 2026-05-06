import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Check, Copy, KeyRound,
  Smartphone, MessageSquare, Shield, Download, RefreshCw,
} from 'lucide-react';

const THEME = {
  bg: '#F7F5F2', card: '#FFFFFF', divider: '#F1EDE8',
  coral: '#E85D2A', txt: '#111111', muted: '#9B9B9F',
  mutedDark: '#6E6E73', tint: '#FBE7DD', success: '#00C060',
};

const AppHeader = ({ title, onBack, subtitle }) => (
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

const BACKUP_CODES = [
  'A4G2-9KQP', 'M7Z3-4BHT', 'X1LF-8CRN', 'J9Q5-2VWD', 'P6KS-7NMY',
  'B3UD-4XHJ', 'F8RT-5YEC', 'H2LV-9QAG', 'N5WP-1KDZ', 'C7BF-6JMX',
];

const SecurityTwoFactorScreen = () => {
  const [step, setStep] = useState('choose'); // 'choose' | 'setup' | 'verify' | 'codes' | 'done'
  const [method, setMethod] = useState(null); // 'authenticator' | 'sms'
  const [code, setCode] = useState('');
  const [copied, setCopied] = useState(false);

  const back = () => {
    if (step === 'setup' || step === 'choose') {
      if (window.history.length > 1) window.history.back();
      else window.location.href = '/';
    } else if (step === 'verify') setStep('setup');
    else if (step === 'codes') setStep('verify');
    else if (step === 'done') { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; }
  };

  const copyCodes = async () => {
    try { await navigator.clipboard.writeText(BACKUP_CODES.join('\n')); } catch (e) {}
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };

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
          <AppHeader title="Two-factor auth" onBack={back} />
          <div className="px-4">

            <div className="flex flex-col items-center pt-2 pb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: THEME.tint }}>
                <Shield size={22} color={THEME.coral} strokeWidth={2} />
              </div>
              <h2 className="text-[17px] font-bold" style={{ color: THEME.txt }}>
                {step === 'choose' && 'Add an extra layer'}
                {step === 'setup' && (method === 'authenticator' ? 'Scan the QR code' : 'Enter your phone')}
                {step === 'verify' && 'Enter the 6-digit code'}
                {step === 'codes' && 'Save your backup codes'}
                {step === 'done' && 'Two-factor is on'}
              </h2>
              <p className="text-[12.5px] text-center mt-1 px-6 leading-snug" style={{ color: THEME.mutedDark }}>
                {step === 'choose' && 'A code from your phone is needed each time you sign in on a new device.'}
                {step === 'setup' && method === 'authenticator' && 'Open Google Authenticator, Authy or 1Password and scan the image below.'}
                {step === 'setup' && method === 'sms' && 'We\'ll send a 6-digit code by SMS each time you sign in.'}
                {step === 'verify' && 'Enter the current code from your authenticator app to finish setup.'}
                {step === 'codes' && 'Keep these codes somewhere safe. You can use them to sign in if you lose your phone.'}
                {step === 'done' && 'Great — your account is now protected with two-factor authentication.'}
              </p>
            </div>

            {step === 'choose' && (
              <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
                <button
                  onClick={() => { setMethod('authenticator'); setStep('setup'); }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 active:bg-black/[0.02] transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                    <Smartphone size={15} color={THEME.coral} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>Authenticator app</div>
                    <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>Recommended · Works offline</div>
                  </div>
                  <span className="text-[10px] font-bold tracking-wide px-1.5 py-[1px] rounded mr-2" style={{ color: THEME.coral, border: '1px solid rgba(232,93,42,0.35)' }}>BEST</span>
                  <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                </button>
                <div className="h-px" style={{ background: THEME.divider, marginLeft: 54 }} />
                <button
                  onClick={() => { setMethod('sms'); setStep('setup'); }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 active:bg-black/[0.02] transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(52,199,89,0.12)' }}>
                    <MessageSquare size={15} color="#2EA849" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>Text message (SMS)</div>
                    <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>Needs mobile signal</div>
                  </div>
                  <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                </button>
              </div>
            )}

            {step === 'setup' && method === 'authenticator' && (
              <div className="flex flex-col items-center">
                <div className="w-56 h-56 rounded-[16px] bg-white border border-black/[0.04] flex items-center justify-center mb-3" style={{ padding: 12 }}>
                  <svg viewBox="0 0 200 200" width="100%" height="100%">
                    {Array.from({ length: 20 }).map((_, y) =>
                      Array.from({ length: 20 }).map((_, x) => {
                        const on = ((x * 7 + y * 13 + x * y) % 3) === 0 ||
                                   (x < 4 && y < 4) || (x > 15 && y < 4) || (x < 4 && y > 15);
                        return on ? <rect key={x + '-' + y} x={x * 10} y={y * 10} width="10" height="10" fill="#111" /> : null;
                      })
                    )}
                  </svg>
                </div>
                <p className="text-[11px] mb-1" style={{ color: THEME.muted }}>Can't scan? Enter this key manually:</p>
                <div className="bg-white rounded-[10px] border border-black/[0.04] px-3 py-2 flex items-center gap-2 mb-4">
                  <span className="text-[13px] font-mono tracking-wider" style={{ color: THEME.txt }}>JBSWY3DPEHPK3PXP</span>
                  <button onClick={copyCodes} className="active:scale-95"><Copy size={12} color={THEME.coral} /></button>
                </div>
              </div>
            )}

            {step === 'setup' && method === 'sms' && (
              <div className="mb-4">
                <label className="block text-[11px] font-medium tracking-[0.04em] mb-1.5 ml-1" style={{ color: THEME.muted }}>Phone number</label>
                <input
                  type="tel"
                  defaultValue="+41 78 555 1234"
                  className="w-full h-[46px] px-3.5 rounded-[12px] text-[14.5px] focus:outline-none"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', color: THEME.txt }}
                />
              </div>
            )}

            {step === 'verify' && (
              <div className="mb-4">
                <label className="block text-[11px] font-medium tracking-[0.04em] mb-1.5 ml-1" style={{ color: THEME.muted }}>6-digit code</label>
                <input
                  type="tel"
                  value={code}
                  maxLength={6}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full h-[52px] px-3.5 rounded-[12px] text-[22px] font-semibold tracking-[0.5em] text-center focus:outline-none"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', color: THEME.txt }}
                />
              </div>
            )}

            {step === 'codes' && (
              <>
                <div className="bg-white rounded-[16px] border border-black/[0.04] p-4 grid grid-cols-2 gap-y-2 gap-x-3 mb-3">
                  {BACKUP_CODES.map((c, i) => (
                    <div key={c} className="flex items-center gap-2">
                      <span className="text-[10px] w-4 text-right" style={{ color: THEME.muted }}>{i + 1}</span>
                      <span className="text-[13px] font-mono tracking-wide" style={{ color: THEME.txt }}>{c}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={copyCodes} className="flex-1 h-10 rounded-[12px] bg-white border border-black/[0.06] flex items-center justify-center gap-1.5 text-[13px] font-semibold active:scale-[0.98]" style={{ color: THEME.txt }}>
                    <Copy size={13} /> {copied ? 'Copied' : 'Copy codes'}
                  </button>
                  <button className="flex-1 h-10 rounded-[12px] bg-white border border-black/[0.06] flex items-center justify-center gap-1.5 text-[13px] font-semibold active:scale-[0.98]" style={{ color: THEME.txt }}>
                    <Download size={13} /> Download
                  </button>
                </div>
              </>
            )}

            {step === 'done' && (
              <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
                <div className="relative">
                  <div className="flex items-center gap-3 px-3.5 py-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(0,192,96,0.15)' }}>
                      <Check size={15} color={THEME.success} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>2FA is enabled</div>
                      <div className="text-[11.5px] mt-[2px]" style={{ color: THEME.muted }}>via authenticator app</div>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: THEME.divider }} />
                </div>
                <button className="w-full flex items-center gap-3 px-3.5 py-3 active:bg-black/[0.02] text-left">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                    <KeyRound size={15} color={THEME.coral} strokeWidth={2} />
                  </div>
                  <span className="flex-1 text-[14px] font-semibold" style={{ color: THEME.txt }}>View backup codes</span>
                  <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                </button>
                <div className="h-px" style={{ background: THEME.divider, marginLeft: 58 }} />
                <button className="w-full flex items-center gap-3 px-3.5 py-3 active:bg-black/[0.02] text-left">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                    <RefreshCw size={15} color={THEME.coral} strokeWidth={2} />
                  </div>
                  <span className="flex-1 text-[14px] font-semibold" style={{ color: THEME.txt }}>Change method</span>
                  <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                </button>
                <div className="h-px" style={{ background: THEME.divider, marginLeft: 58 }} />
                <button className="w-full flex items-center gap-3 px-3.5 py-3 active:bg-black/[0.02] text-left">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,59,48,0.12)' }}>
                    <Shield size={15} color="#FF3B30" strokeWidth={2} />
                  </div>
                  <span className="flex-1 text-[14px] font-semibold" style={{ color: '#FF3B30' }}>Turn off 2FA</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {step !== 'done' && (
          <div className="absolute bottom-0 left-0 right-0 px-4 pt-3 pb-7" style={{ background: 'linear-gradient(to top, rgba(247,245,242,1) 60%, rgba(247,245,242,0))' }}>
            <button
              onClick={() => {
                if (step === 'setup') setStep('verify');
                else if (step === 'verify') setStep('codes');
                else if (step === 'codes') setStep('done');
              }}
              disabled={step === 'choose' || (step === 'verify' && code.length !== 6)}
              className="w-full h-12 rounded-[14px] font-bold text-[15px] text-white active:scale-[0.98] transition-all"
              style={{
                background: (step === 'choose' || (step === 'verify' && code.length !== 6)) ? '#D5CEC7' : 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)',
                boxShadow: (step === 'choose' || (step === 'verify' && code.length !== 6)) ? 'none' : '0 8px 20px rgba(232,93,42,0.25)',
                cursor: (step === 'choose' || (step === 'verify' && code.length !== 6)) ? 'not-allowed' : 'pointer',
              }}
            >
              {step === 'setup' && "I've scanned it"}
              {step === 'verify' && 'Verify & continue'}
              {step === 'codes' && "I've saved them"}
              {step === 'choose' && 'Select a method'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityTwoFactorScreen;
