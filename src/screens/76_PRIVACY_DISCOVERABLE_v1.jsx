import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Phone, Mail, UserX, Copy, Info } from 'lucide-react';

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

const Toggle = ({ value, onChange }) => (
  <div
    onClick={() => onChange(!value)}
    className="active:scale-[0.97] transition-all duration-[120ms] shrink-0"
    style={{ width: 46, height: 26, borderRadius: 9999, background: value ? THEME.coral : '#D5CEC7', position: 'relative', cursor: 'pointer' }}
  >
    <div style={{ position: 'absolute', top: 3, left: value ? 23 : 3, width: 20, height: 20, borderRadius: 9999, background: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.18)', transition: 'left 200ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
  </div>
);

const ToggleRow = ({ Icon, iconTint, iconColor, title, subtitle, value, onChange, last }) => (
  <div className="relative">
    <div className="flex items-center gap-3 px-3.5 py-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: iconTint || THEME.tint }}>
        <Icon size={15} color={iconColor || THEME.coral} strokeWidth={2} />
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

const PrivacyDiscoverableScreen = () => {
  const [byPhone, setByPhone] = useState(true);
  const [byEmail, setByEmail] = useState(true);
  const [byHandle, setByHandle] = useState(true);
  const [copied, setCopied] = useState(false);

  const inviteUrl = 'https://fylos.app/u/talita.k';
  const copy = async () => { try { await navigator.clipboard.writeText(inviteUrl); } catch(e) {} setCopied(true); setTimeout(() => setCopied(false), 1500); };

  const nothingOn = !byPhone && !byEmail && !byHandle;

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
          <AppHeader title="Discoverable by" onBack={back} />

          <div className="px-4">
            <p className="text-[12.5px] px-2 mt-1 mb-3 leading-snug" style={{ color: THEME.mutedDark }}>
              Choose how other people can find your profile to send a friend request.
            </p>

            <SectionLabel>People can find me by</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
              <ToggleRow
                Icon={Phone}
                title="Phone number"
                subtitle="+41 78 555 1234"
                value={byPhone}
                onChange={setByPhone}
              />
              <ToggleRow
                Icon={Mail}
                iconTint="rgba(0,122,255,0.10)"
                iconColor="#007AFF"
                title="Email address"
                subtitle="talita.k@email.com"
                value={byEmail}
                onChange={setByEmail}
              />
              <ToggleRow
                Icon={UserX}
                iconTint="rgba(52,199,89,0.12)"
                iconColor="#2EA849"
                title="Username"
                subtitle="@talita.k"
                value={byHandle}
                onChange={setByHandle}
                last
              />
            </div>

            <SectionLabel>Invite link</SectionLabel>
            <div className="bg-white rounded-[16px] border border-black/[0.04] p-3.5">
              <p className="text-[12px] mb-2" style={{ color: THEME.mutedDark }}>
                Anyone with this link can send you a friend request, even if all the above are off.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 h-9 bg-[#F7F5F2] rounded-[10px] flex items-center">
                  <span className="text-[12.5px] truncate" style={{ color: THEME.txt }}>{inviteUrl}</span>
                </div>
                <button onClick={copy} className="h-9 px-3 rounded-full text-[12px] font-semibold text-white active:scale-95" style={{ backgroundColor: THEME.coral }}>
                  <span className="flex items-center gap-1">
                    <Copy size={12} strokeWidth={2.2} />
                    {copied ? 'Copied' : 'Copy'}
                  </span>
                </button>
              </div>
            </div>

            {nothingOn && (
              <div className="flex items-start gap-2 mt-4 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(255,59,48,0.08)' }}>
                <Info size={13} color={THEME.danger} strokeWidth={2.2} className="shrink-0 mt-[2px]" />
                <span className="text-[12px] leading-snug" style={{ color: '#8B1A14' }}>
                  You can't be found by search. People can only add you via the invite link above.
                </span>
              </div>
            )}

            <div className="flex items-start gap-2 mt-4 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                Existing friends can always see you. This only affects new friend requests.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyDiscoverableScreen;
