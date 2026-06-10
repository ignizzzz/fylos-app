import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Mail, Check, Camera, MapPin, Bell } from 'lucide-react';

/**
 * FYLOS_AUTH_v1.jsx — the whole auth flow, rebuilt in the canonical system.
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

const SocialRow = ({ label, glyph, onClick }) => (
  <button onClick={onClick} className="w-full h-[52px] rounded-[16px] bg-white flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform" style={{ boxShadow: SHADOW }}>
    {glyph}
    <span className="text-[14.5px] font-bold" style={{ color: INK }}>{label}</span>
  </button>
);

const AppleGlyph = <svg width="16" height="18" viewBox="0 0 16 19" fill={INK}><path d="M13.3 10.1c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-0.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3.1 2.4 1.2-.1 1.7-.8 3.2-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.6-1-2.7-4zM10.9 2.9c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4z"/></svg>;
const GoogleGlyph = <svg width="17" height="17" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.6 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.8a4.1 4.1 0 0 1-1.8 2.7v2.3h2.9c1.7-1.6 2.7-3.9 2.7-6.6z"/><path fill="#34A853" d="M9 18c2.4 0 4.5-.8 6-2.2l-2.9-2.3c-.8.6-1.9.9-3.1.9-2.4 0-4.4-1.6-5.1-3.8H.9v2.3A9 9 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.9 10.6a5.4 5.4 0 0 1 0-3.4V4.9H.9a9 9 0 0 0 0 8.1l3-2.4z"/><path fill="#EA4335" d="M9 3.6c1.3 0 2.5.5 3.4 1.4l2.6-2.6A9 9 0 0 0 .9 4.9l3 2.3C4.6 5.1 6.6 3.6 9 3.6z"/></svg>;

/* ── Sign in (welcome) ── */
export const SignIn = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const ok = /.+@.+\..+/.test(email);
  return (
    <Frame>
      <div className="px-6 flex flex-col" style={{ minHeight: '100%', paddingTop: 96, paddingBottom: 44 }}>
        <div style={{ animation: 'auRise 0.5s ease both' }}>
          <span className="flex items-center" style={{ gap: 5, fontFamily: '"Nunito", Inter, sans-serif' }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: INK, letterSpacing: '-1px' }}>fylos</span>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: CORAL, marginTop: 14 }} />
          </span>
          <h1 className="text-[26px] font-extrabold tracking-[-0.02em] leading-[1.15] mt-5" style={{ color: INK }}>Pets, looked after.</h1>
          <p className="text-[14px] mt-2 leading-[1.5]" style={{ color: MUTED }}>Care, health and trusted people. All in one place.</p>
        </div>
        <div className="mt-9 flex flex-col gap-3" style={{ animation: 'auRise 0.5s 0.08s ease both' }}>
          <SocialRow label="Continue with Apple" glyph={AppleGlyph} onClick={() => { setAuthed(); nav('/welcome'); }} />
          <SocialRow label="Continue with Google" glyph={GoogleGlyph} onClick={() => { setAuthed(); nav('/welcome'); }} />
        </div>
        <div className="flex items-center gap-3 my-6" style={{ animation: 'auRise 0.5s 0.14s ease both' }}>
          <span className="flex-1 h-px" style={{ background: '#E8E2DA' }} />
          <span className="text-[11.5px] font-semibold" style={{ color: TERT }}>or with email</span>
          <span className="flex-1 h-px" style={{ background: '#E8E2DA' }} />
        </div>
        <div style={{ animation: 'auRise 0.5s 0.2s ease both' }}>
          <Field value={email} onChange={setEmail} placeholder="you@example.com" inputMode="email" />
          <CTA disabled={!ok} onClick={() => nav('/sign-in-password')}>Continue</CTA>
        </div>
        <div className="flex-1" />
        <p className="text-center text-[13px]" style={{ color: MUTED }}>New here? <button onClick={() => nav('/create-account')} className="font-bold" style={{ color: CORAL }}>Create account</button></p>
      </div>
    </Frame>
  );
};

/* ── Password step ── */
export const SignInPassword = () => {
  const nav = useNavigate();
  const [pw, setPw] = useState('');
  return (
    <Frame back={() => nav('/sign-in')}>
      <div className="px-6" style={{ paddingTop: 110 }}>
        <h1 className="text-[24px] font-extrabold tracking-[-0.02em]" style={{ color: INK }}>Welcome back</h1>
        <p className="text-[13.5px] mt-1.5" style={{ color: TERT }}>Signing in as <span className="font-bold" style={{ color: INK }}>alex@fylos.app</span></p>
        <div className="mt-7">
          <Field label="Password" type="password" value={pw} onChange={setPw} placeholder="Your password" autoFocus />
          <CTA disabled={pw.length < 6} onClick={() => { setAuthed(); nav('/'); }}>Sign in</CTA>
          <button onClick={() => nav('/forgot-password')} className="w-full mt-4 py-2"><span className="text-[13.5px] font-bold" style={{ color: MUTED }}>Forgot your password?</span></button>
          <button onClick={() => nav('/sign-in-phone')} className="w-full py-2"><span className="text-[13.5px] font-bold" style={{ color: CORAL }}>Use phone number instead</span></button>
        </div>
      </div>
    </Frame>
  );
};

/* ── Phone sign-in with inline code ── */
export const SignInPhone = () => {
  const nav = useNavigate();
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <Frame back={() => nav('/sign-in')}>
      <div className="px-6" style={{ paddingTop: 110 }}>
        <h1 className="text-[24px] font-extrabold tracking-[-0.02em]" style={{ color: INK }}>{sent ? 'Enter the code' : 'Sign in with phone'}</h1>
        <p className="text-[13.5px] mt-1.5" style={{ color: TERT }}>{sent ? 'We texted a 6-digit code to ' + (phone || '+41 79 123 45 67') : 'We send a one-time code. No password needed.'}</p>
        <div className="mt-7">
          {!sent ? (
            <>
              <div className="flex gap-2.5 mb-4">
                <span className="h-[52px] px-4 rounded-[12px] bg-white flex items-center text-[15px] font-bold" style={{ boxShadow: SHADOW, color: INK }}>+41</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="79 123 45 67" inputMode="tel" autoFocus
                  className="flex-1 bg-white rounded-[12px] px-4 h-[52px] outline-none text-[15px] font-semibold text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" style={{ boxShadow: SHADOW }} />
              </div>
              <CTA disabled={phone.replace(/\D/g, '').length < 8} onClick={() => setSent(true)}>Send code</CTA>
            </>
          ) : (
            <Otp onDone={() => { setAuthed(); nav('/'); }} />
          )}
        </div>
      </div>
    </Frame>
  );
};

/* ── OTP boxes (shared) ── */
const Otp = ({ onDone }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const refs = useRef([]);
  const setAt = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = code.map((c, j) => j === i ? d : c);
    setCode(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
    if (next.every((c) => c !== '')) setTimeout(onDone, 350);
  };
  return (
    <>
      <div className="flex gap-2.5 justify-between">
        {code.map((c, i) => (
          <input key={i} ref={(el) => { refs.current[i] = el; }} value={c} onChange={(e) => setAt(i, e.target.value)} inputMode="numeric" autoFocus={i === 0}
            className="w-[48px] h-[58px] bg-white rounded-[12px] text-center outline-none text-[22px] font-extrabold text-[#111]"
            style={{ boxShadow: c ? 'inset 0 0 0 1.6px ' + CORAL : SHADOW }} />
        ))}
      </div>
      <p className="text-[12.5px] text-center mt-5" style={{ color: TERT }}>Nothing yet? <button className="font-bold" style={{ color: CORAL }}>Resend code</button></p>
    </>
  );
};

/* ── Create account ── */
export const CreateAccountV2 = () => {
  const nav = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const strong = pw.length >= 10;
  const ok = name.trim().length > 1 && /.+@.+\..+/.test(email) && strong;
  return (
    <Frame back={() => nav('/sign-in')}>
      <div className="px-6 pb-12" style={{ paddingTop: 110 }}>
        <h1 className="text-[24px] font-extrabold tracking-[-0.02em]" style={{ color: INK }}>Create your account</h1>
        <p className="text-[13.5px] mt-1.5" style={{ color: TERT }}>Free for owners. Takes a minute.</p>
        <div className="mt-7">
          <Field label="Your name" value={name} onChange={setName} placeholder="First and last name" autoFocus />
          <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" inputMode="email" />
          <Field label="Password" type="password" value={pw} onChange={setPw} placeholder="At least 10 characters" />
          <div className="text-[11.5px] ml-0.5 -mt-2 mb-5" style={{ color: pw.length === 0 ? TERT : strong ? GREEN : '#B07A3A' }}>
            {pw.length === 0 ? 'Use 10 or more characters. A short sentence works best.' : strong ? 'Strong password' : String(10 - pw.length) + ' more characters'}
          </div>
          <CTA disabled={!ok} onClick={() => nav('/verify-email')}>Create account</CTA>
          <p className="text-[11px] text-center mt-4 leading-[1.5]" style={{ color: TERT }}>By continuing you agree to our Terms of service and Privacy policy.</p>
        </div>
      </div>
    </Frame>
  );
};

/* ── Forgot password ── */
export const ForgotPassword = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  return (
    <Frame back={() => nav('/sign-in-password')}>
      <div className="px-6" style={{ paddingTop: 110 }}>
        {!sent ? (
          <>
            <h1 className="text-[24px] font-extrabold tracking-[-0.02em]" style={{ color: INK }}>Reset your password</h1>
            <p className="text-[13.5px] mt-1.5 leading-[1.5]" style={{ color: TERT }}>Tell us your email and we send a reset link.</p>
            <div className="mt-7">
              <Field value={email} onChange={setEmail} placeholder="you@example.com" inputMode="email" autoFocus />
              <CTA disabled={!/.+@.+\..+/.test(email)} onClick={() => setSent(true)}>Send reset link</CTA>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-center" style={{ paddingTop: 60, animation: 'auRise 0.4s ease both' }}>
            <span className="w-[72px] h-[72px] rounded-full flex items-center justify-center" style={{ background: '#EAF7EF' }}><Mail size={28} color={GREEN} strokeWidth={1.8} /></span>
            <h2 className="text-[20px] font-extrabold mt-5" style={{ color: INK }}>Check your inbox</h2>
            <p className="text-[13.5px] mt-2 leading-[1.5] max-w-[260px]" style={{ color: MUTED }}>We sent a reset link to <span className="font-bold" style={{ color: INK }}>{email}</span>. It works for 30 minutes.</p>
            <button onClick={() => nav('/sign-in')} className="mt-7 px-6 py-3 rounded-[16px] bg-white active:scale-[0.97] transition-transform" style={{ boxShadow: SHADOW }}><span className="text-[14px] font-bold" style={{ color: INK }}>Back to sign in</span></button>
          </div>
        )}
      </div>
    </Frame>
  );
};

/* ── Verify email (OTP) ── */
export const VerifyEmail = () => {
  const nav = useNavigate();
  return (
    <Frame back={() => nav('/create-account')}>
      <div className="px-6" style={{ paddingTop: 110 }}>
        <h1 className="text-[24px] font-extrabold tracking-[-0.02em]" style={{ color: INK }}>Check your email</h1>
        <p className="text-[13.5px] mt-1.5 leading-[1.5]" style={{ color: TERT }}>We sent a 6-digit code to <span className="font-bold" style={{ color: INK }}>alex@fylos.app</span></p>
        <div className="mt-8"><Otp onDone={() => { setAuthed(); nav('/welcome'); }} /></div>
      </div>
    </Frame>
  );
};

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
