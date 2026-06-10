import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Camera, MapPin, Bell } from 'lucide-react';

/**
 * FYLOS_WELCOME_v1.jsx — the post-auth welcome (profile completion).
 * Seven screens, one visual language: cream, white cards with the warm
 * shadow, coral primary, calm copy. SignIn → password / phone, create
 * account, forgot, verify (OTP), and the welcome profile completion.
 */

const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const TINT = '#FBE7DD';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#9B9B9F';
const GREEN = '#3F8D63';
const LINE = '#F1EDE8';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';

const setAuthed = () => { try { window.localStorage.setItem('fylos.auth', '1'); } catch (e) {} };

const StatusBar = () => (
  <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
    <span style={{ fontSize: 15, fontWeight: 600, color: INK }}>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={INK}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={INK}/><rect x="9" y="2" width="3" height="10" rx="1" fill={INK}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={INK}/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={INK}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={INK} strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="9" rx="2" fill={INK}/><path d="M23 4.5v4a2 2 0 000-4z" fill={INK} fillOpacity="0.5"/></svg>
    </div>
  </div>
);

const Frame = ({ children, back, title }) => (
  <>
    <style>{'@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"); @keyframes auRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }'}</style>
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
        <StatusBar />
        <div className="absolute inset-0 overflow-y-auto" style={{ background: CREAM, scrollbarWidth: 'none' }}>
          {(back || title) && (
            <div className="pt-14 pb-4 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 56%, rgba(247,245,242,0) 100%)' }}>
              {back && <button onClick={back} className="absolute left-5 top-[52px] w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-all pointer-events-auto" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} strokeWidth={2.2} color="#111" /></button>}
              {title && <h1 className="text-[17px] font-bold" style={{ color: INK }}>{title}</h1>}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  </>
);

const Field = ({ label, value, onChange, placeholder, type = 'text', inputMode, autoFocus }) => (
  <div className="mb-4">
    {label && <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-1.5 ml-0.5" style={{ color: TERT }}>{label}</div>}
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode} autoFocus={autoFocus}
      className="w-full bg-white rounded-[12px] px-4 h-[52px] outline-none text-[15px] font-semibold text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" style={{ boxShadow: SHADOW }} />
  </div>
);

const CTA = ({ children, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} className="w-full py-4 rounded-[16px] transition-all active:scale-[0.98]" style={{ background: disabled ? '#EAE3DB' : CORAL, boxShadow: disabled ? 'none' : '0 8px 22px rgba(232,93,42,0.28)' }}>
    <span className="text-[15px] font-bold" style={{ color: disabled ? TERT : '#fff' }}>{children}</span>
  </button>
);



/* ── Welcome / profile completion ── */
export const ProfileCompletion = () => {
  const nav = useNavigate();
  const [area, setArea] = useState('');
  const [notif, setNotif] = useState(true);
  const [photo, setPhoto] = useState(false);
  return (
    <Frame>
      <div className="px-6 flex flex-col" style={{ minHeight: '100%', paddingTop: 92, paddingBottom: 44 }}>
        <div style={{ animation: 'auRise 0.5s ease both' }}>
          <h1 className="text-[26px] font-extrabold tracking-[-0.02em]" style={{ color: INK }}>Welcome, Alex</h1>
          <p className="text-[13.5px] mt-1.5" style={{ color: TERT }}>Two small things, then we meet your pet.</p>
        </div>
        <div className="flex justify-center mt-8" style={{ animation: 'auRise 0.5s 0.08s ease both' }}>
          <button onClick={() => setPhoto(!photo)} className="relative w-[96px] h-[96px] rounded-full flex items-center justify-center active:scale-95 transition-transform" style={{ background: photo ? TINT : PEACH, boxShadow: photo ? 'inset 0 0 0 2px ' + CORAL : 'none' }}>
            {photo ? <Check size={32} color={CORAL} strokeWidth={2.4} /> : <Camera size={30} color={TERT} strokeWidth={1.8} />}
            <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: CORAL, border: '3px solid ' + CREAM }}><Camera size={14} color="#fff" strokeWidth={2.2} /></span>
          </button>
        </div>
        <p className="text-center text-[11.5px] mt-2.5" style={{ color: TERT }}>{photo ? 'Looking good' : 'Add a photo. Sitters love a face'}</p>
        <div className="mt-7" style={{ animation: 'auRise 0.5s 0.14s ease both' }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-1.5 ml-0.5" style={{ color: TERT }}>Your area</div>
          <div className="flex items-center gap-2.5 bg-white rounded-[12px] px-4 h-[52px]" style={{ boxShadow: SHADOW }}>
            <MapPin size={16} color={CORAL} strokeWidth={2} />
            <input value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Zürich, Seefeld" className="flex-1 bg-transparent outline-none text-[15px] font-semibold text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" />
          </div>
          <div className="bg-white rounded-[16px] mt-4 px-4 py-3.5 flex items-center gap-3" style={{ boxShadow: SHADOW }}>
            <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: TINT }}><Bell size={16} color={CORAL} strokeWidth={2} /></span>
            <span className="flex-1"><span className="block text-[14px] font-semibold" style={{ color: INK }}>Notifications</span><span className="block text-[11.5px] mt-[2px]" style={{ color: TERT }}>Booking updates and care reminders</span></span>
            <span onClick={() => setNotif(!notif)} className="shrink-0 cursor-pointer" style={{ width: 38, height: 22, borderRadius: 9999, backgroundColor: notif ? CORAL : '#E5E1DC', transition: 'background-color 200ms ease', position: 'relative', display: 'inline-block' }}>
              <span style={{ position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transform: notif ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
            </span>
          </div>
        </div>
        <div className="flex-1" />
        <div style={{ animation: 'auRise 0.5s 0.2s ease both' }}>
          <CTA onClick={() => { setAuthed(); nav('/add-pet'); }}>Add your first pet</CTA>
          <button onClick={() => { setAuthed(); nav('/'); }} className="w-full mt-3 py-2.5"><span className="text-[13.5px] font-bold" style={{ color: MUTED }}>Later</span></button>
        </div>
      </div>
    </Frame>
  );
};
