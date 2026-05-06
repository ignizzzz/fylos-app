import React, { useState } from 'react';
import { ChevronLeft, Check, User, PawPrint, Image as ImageIcon, FileText, HeartPulse, Calendar, MessageCircle, Info, Download, Mail, Clock } from 'lucide-react';

const THEME = { bg: '#F7F5F2', coral: '#E85D2A', txt: '#111', muted: '#6E6E73', tint: '#FBE7DD', green: '#00C060' };

const AppHeader = ({ title, onBack }) => (
  <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30" style={{ backgroundColor: 'rgba(247,245,242,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
    <button onClick={onBack} className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all">
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: THEME.txt }}>{title}</h1>
  </div>
);

const CATEGORIES = [
  { k: 'profile',   Icon: User,         title: 'Profile',       size: '2 KB'   },
  { k: 'pets',      Icon: PawPrint,     title: 'Pets',          size: '18 KB'  },
  { k: 'photos',    Icon: ImageIcon,    title: 'Photos',        size: '245 MB' },
  { k: 'docs',      Icon: FileText,     title: 'Documents',     size: '18 MB'  },
  { k: 'health',    Icon: HeartPulse,   title: 'Health records', size: '4 MB'  },
  { k: 'bookings',  Icon: Calendar,     title: 'Bookings',      size: '120 KB' },
  { k: 'messages',  Icon: MessageCircle,title: 'Messages',      size: '8 MB'   },
];

const PAST = [
  { date: 'Mar 02, 2026', size: '264 MB', status: 'ready',   expires: 'in 4 days' },
  { date: 'Jan 18, 2026', size: '210 MB', status: 'expired', expires: null },
];

export default function ExportDataScreen() {
  const [selected, setSelected] = useState({ profile: true, pets: true, photos: true, docs: true, health: true, bookings: true, messages: false });
  const [format, setFormat] = useState('both');
  const [delivery, setDelivery] = useState('email');
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };
  const toggle = (k) => setSelected(s => ({ ...s, [k]: !s[k] }));
  const anySelected = Object.values(selected).some(Boolean);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;}.ex-scroll::-webkit-scrollbar{display:none;}.ex-scroll{scrollbar-width:none;}`}</style>
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

        <div className="ex-scroll absolute inset-0 overflow-y-auto pb-10">
          <AppHeader title="Export my data" onBack={back} />

          <div className="px-4">
            <p className="text-[12.5px] px-2 mt-1 mb-3 leading-snug" style={{ color: THEME.muted }}>
              Request a copy of everything Fylos holds about you. GDPR-compliant. Typically ready within 48h.
            </p>

            <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>What to include</div>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden mb-4">
              {CATEGORIES.map((c, i) => {
                const on = selected[c.k];
                return (
                  <button key={c.k} onClick={() => toggle(c.k)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.03] transition-colors"
                    style={{ borderBottom: i < CATEGORIES.length - 1 ? '1px solid #F1EDE8' : 'none' }}>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                      <c.Icon size={16} color={THEME.coral} strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>{c.title}</div>
                      <div className="text-[11.5px]" style={{ color: THEME.muted }}>{c.size}</div>
                    </div>
                    <div className="w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0"
                      style={{ border: `1.5px solid ${on ? THEME.coral : '#D4D4D8'}`, backgroundColor: on ? THEME.coral : 'transparent' }}>
                      {on && <Check size={11} color="#FFF" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>Format</div>
            <div className="flex gap-2 mb-4">
              {[{k:'json',l:'JSON'},{k:'csv',l:'CSV'},{k:'both',l:'JSON + CSV'}].map(f => (
                <button key={f.k} onClick={() => setFormat(f.k)}
                  className="flex-1 py-2.5 rounded-[14px] font-semibold text-[13px] border transition-all active:scale-[0.98]"
                  style={{ backgroundColor: format === f.k ? THEME.coral : 'white', borderColor: format === f.k ? THEME.coral : 'rgba(0,0,0,0.06)', color: format === f.k ? '#FFF' : THEME.txt }}>
                  {f.l}
                </button>
              ))}
            </div>

            <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>Delivery</div>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden mb-4">
              {[
                { k: 'email',    Icon: Mail,     title: 'Email download link',     desc: 'alex@fylos.app · link valid for 7 days' },
                { k: 'download', Icon: Download, title: 'Direct download',         desc: 'Start download as soon as it\'s ready' },
              ].map((d, i, arr) => (
                <button key={d.k} onClick={() => setDelivery(d.k)}
                  className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.03]"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid #F1EDE8' : 'none' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                    <d.Icon size={15} color={THEME.coral} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>{d.title}</div>
                    <div className="text-[11.5px]" style={{ color: THEME.muted }}>{d.desc}</div>
                  </div>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ border: `1.5px solid ${delivery === d.k ? THEME.coral : '#D4D4D8'}`, backgroundColor: delivery === d.k ? THEME.coral : 'transparent' }}>
                    {delivery === d.k && <Check size={11} color="#FFF" strokeWidth={3} />}
                  </div>
                </button>
              ))}
            </div>

            <button disabled={!anySelected} className="w-full py-3 rounded-[14px] font-semibold text-[14.5px] active:scale-[0.99] transition-all" style={{ backgroundColor: anySelected ? '#111' : '#CFCFD4', color: '#FFF', opacity: anySelected ? 1 : 0.7 }}>
              Request export
            </button>

            <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mt-6 mb-1.5" style={{ color: THEME.muted }}>Past exports</div>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden mb-4">
              {PAST.map((p, i) => (
                <div key={i} className="flex items-center gap-3 px-3.5 py-3" style={{ borderBottom: i < PAST.length - 1 ? '1px solid #F1EDE8' : 'none' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: p.status === 'ready' ? '#E5F9ED' : '#F7F5F2' }}>
                    <Clock size={15} color={p.status === 'ready' ? THEME.green : THEME.muted} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold" style={{ color: THEME.txt }}>{p.date}</div>
                    <div className="text-[11.5px]" style={{ color: THEME.muted }}>
                      {p.size}{p.expires ? ` · Expires ${p.expires}` : ' · Expired'}
                    </div>
                  </div>
                  {p.status === 'ready' ? (
                    <button className="text-[12px] font-semibold px-3 py-1.5 rounded-full" style={{ backgroundColor: THEME.tint, color: THEME.coral }}>Download</button>
                  ) : (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F7F5F2', color: THEME.muted }}>Expired</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                Exports are encrypted at rest and auto-deleted after 7 days.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
