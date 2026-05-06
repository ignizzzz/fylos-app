import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Eye, EyeOff, ArrowRight } from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   69 — CREATE ACCOUNT v1
   Sign-up with brand personality — warm, minimal, connected to onboarding
   ═══════════════════════════════════════════════════════ */

/* Reactive mascot — subtle responses to form state */
const MascotPeek = ({ focusedField, passwordStrength, showPassword }) => {
  const isPasswordFocused = focusedField === 'password';
  const isHidingPassword = isPasswordFocused && !showPassword;
  const isStrong = passwordStrength >= 3;
  const isNameFocused = focusedField === 'name';

  const pupilDx = isNameFocused ? -0.8 : focusedField === 'email' ? 0.8 : 0;
  const pupilDy = isPasswordFocused ? 1.2 : 0;

  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none"
         style={{ animation: 'ca-mascotPop 0.6s 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}>
      {/* Ears */}
      <ellipse cx="16" cy="15" rx="7" ry="11" fill="#C96A30"
               style={{ transform: `rotate(${isStrong ? '-20deg' : '-15deg'})`, transformOrigin: '16px 20px', transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
      <ellipse cx="40" cy="15" rx="7" ry="11" fill="#C96A30"
               style={{ transform: `rotate(${isStrong ? '20deg' : '15deg'})`, transformOrigin: '40px 20px', transition: 'transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
      <ellipse cx="16" cy="15" rx="4" ry="7" fill="#D4845A"
               style={{ transform: 'rotate(-15deg)', transformOrigin: '16px 20px' }} />
      <ellipse cx="40" cy="15" rx="4" ry="7" fill="#D4845A"
               style={{ transform: 'rotate(15deg)', transformOrigin: '40px 20px' }} />

      {/* Head */}
      <circle cx="28" cy="26" r="18" fill="#E8854A" />
      {/* Muzzle */}
      <ellipse cx="28" cy="30" rx="11" ry="9" fill="#F5C6A0" />

      {/* Eyes */}
      {isHidingPassword ? (
        <>
          <path d="M19.5 23 L22.5 25 L19.5 27" stroke="#3D2515" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M36.5 23 L33.5 25 L36.5 27" stroke="#3D2515" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : isStrong ? (
        <>
          <path d="M19 25 Q22 22 25 25" stroke="#3D2515" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <path d="M31 25 Q34 22 37 25" stroke="#3D2515" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <g style={{ animation: 'ca-sparkle 2s ease-in-out infinite' }}>
            <line x1="40" y1="17" x2="40" y2="14" stroke="#FFD700" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="38.2" y1="15.5" x2="41.8" y2="15.5" stroke="#FFD700" strokeWidth="1.3" strokeLinecap="round" />
          </g>
        </>
      ) : (
        <>
          <circle cx="22" cy="24" r="3.5" fill="#FFFFFF" />
          <circle cx="34" cy="24" r="3.5" fill="#FFFFFF" />
          <circle cx={22 + pupilDx} cy={24 + pupilDy} r="2.2" fill="#3D2515"
                  style={{ transition: 'all 250ms ease' }} />
          <circle cx={34 + pupilDx} cy={24 + pupilDy} r="2.2" fill="#3D2515"
                  style={{ transition: 'all 250ms ease' }} />
          <circle cx={23 + pupilDx * 0.5} cy={22.8} r="1" fill="#FFFFFF" />
          <circle cx={35 + pupilDx * 0.5} cy={22.8} r="1" fill="#FFFFFF" />
        </>
      )}

      {/* Nose */}
      <ellipse cx="28" cy="28.5" rx="2.8" ry="2" fill="#3D2515" />

      {/* Mouth */}
      {isStrong ? (
        <path d="M24 31 Q28 35.5 32 31" stroke="#C96A30" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      ) : isHidingPassword ? (
        <circle cx="28" cy="32" r="2" fill="none" stroke="#C96A30" strokeWidth="1" />
      ) : (
        <path d="M25.5 31 Q28 33.5 30.5 31" stroke="#C96A30" strokeWidth="1" fill="none" strokeLinecap="round" />
      )}

      {/* Tongue */}
      {!isHidingPassword && (
        <ellipse cx="28" cy={isStrong ? '34' : '33'} rx={isStrong ? '2' : '1.5'} ry="1.8" fill="#E87E7E" opacity="0.7"
                 style={{ transition: 'all 300ms ease' }} />
      )}

      {/* Blush */}
      <ellipse cx="17" cy="29" rx="3.5" ry="1.8" fill="#FFB088" opacity={isStrong ? 0.55 : isHidingPassword ? 0.5 : 0.35}
               style={{ transition: 'opacity 300ms ease' }} />
      <ellipse cx="39" cy="29" rx="3.5" ry="1.8" fill="#FFB088" opacity={isStrong ? 0.55 : isHidingPassword ? 0.5 : 0.35}
               style={{ transition: 'opacity 300ms ease' }} />

      {/* Collar */}
      <path d="M15 40 Q28 44 41 40" stroke="#E85D2A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="28" cy="42" r="2" fill="#FFD700" />
    </svg>
  );
};

/* Paw divider with breathing animation */
const PawDividerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
       style={{ flexShrink: 0, animation: 'ca-pawBreathe 3s ease-in-out infinite' }}>
    <ellipse cx="10" cy="13" rx="5.5" ry="4.5" fill="#E85D2A" opacity="0.18" />
    <circle cx="5.5" cy="7.5" r="2.5" fill="#E85D2A" opacity="0.15" />
    <circle cx="10" cy="5.5" r="2.8" fill="#E85D2A" opacity="0.15" />
    <circle cx="14.5" cy="7.5" r="2.5" fill="#E85D2A" opacity="0.15" />
  </svg>
);

const CreateAccountScreen = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return Math.min(s, 4);
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];
  const strengthColor = ['#D5CFC8', '#FF3B30', '#FF9500', '#34C759', '#34C759'][passwordStrength];

  const inputStyle = (field) => ({
    display: 'flex', alignItems: 'center', gap: 12,
    background: focusedField === field ? '#FFFFFF' : 'white',
    borderRadius: 12, padding: '0 16px', height: 50,
    border: `1.5px solid ${focusedField === field ? 'rgba(232,93,42,0.4)' : '#EDE8E2'}`,
    boxShadow: focusedField === field
      ? '0 0 0 3px rgba(232,93,42,0.06)'
      : 'none',
    transition: 'all 200ms ease',
  });

  const iconColor = (field) => focusedField === field ? '#E85D2A' : '#A09A94';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        .ca-scroll::-webkit-scrollbar { display: none; }
        .ca-scroll { scrollbar-width: none; }

        @keyframes ca-fadeUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes ca-scaleIn {
          0% { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ca-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes ca-mascotPop {
          0% { opacity: 0; transform: scale(0) rotate(-10deg); }
          60% { opacity: 1; transform: scale(1.15) rotate(3deg); }
          80% { transform: scale(0.95) rotate(-1deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        @keyframes ca-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes ca-sparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.7); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes ca-pawBreathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
        @keyframes ca-glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
      `}</style>

      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', backgroundColor: '#E5E5E5', padding: 20,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          className="relative"
          style={{
            width: 390, height: 844, borderRadius: 50,
            border: '8px solid #000', overflow: 'hidden',
            backgroundColor: '#F7F5F2',
          }}
        >
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]"
               style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
               style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Grain texture — slightly stronger */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }} />

          {/* Background atmosphere — stronger radials */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 240, height: 240, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,93,42,0.07) 0%, rgba(255,150,100,0.03) 40%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: 40, left: -50,
            width: 200, height: 200, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,180,130,0.06) 0%, rgba(232,93,42,0.02) 40%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          {/* Third accent — center-left warm wash */}
          <div style={{
            position: 'absolute', top: '40%', left: -80,
            width: 180, height: 180, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,200,160,0.04) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />

          {/* Back button */}
          <div style={{ position: 'absolute', top: 54, left: 20, zIndex: 10 }}>
            <button
              onClick={() => navigate(-1)}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.96] transition-all duration-[120ms]"
              style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
            >
              <ChevronLeft size={20} color="#111111" />
            </button>
          </div>

          {/* Centered content */}
          <div className="ca-scroll" style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', alignItems: 'center',
            padding: '100px 28px 50px',
            overflowY: 'auto',
          }}>
            <div style={{ width: '100%', maxWidth: 334 }}>

              {/* Mascot + Title */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                marginBottom: 28,
                animation: 'ca-fadeUp 0.5s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both',
              }}>
                {/* Mascot with warm glow halo */}
                <div style={{ position: 'relative', flexShrink: 0, alignSelf: 'center', marginTop: 2 }}>
                  <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(232,133,74,0.15) 0%, rgba(232,93,42,0.04) 50%, transparent 70%)',
                    animation: 'ca-glowPulse 3s ease-in-out infinite',
                    pointerEvents: 'none',
                  }} />
                  <div style={{ position: 'relative', animation: 'ca-float 3s 1s ease-in-out infinite' }}>
                    <MascotPeek focusedField={focusedField} passwordStrength={passwordStrength} showPassword={showPassword} />
                  </div>
                </div>
                <div>
                  <h1 style={{
                    fontFamily: '"Nunito", sans-serif',
                    fontSize: 22, fontWeight: 700, color: '#111111',
                    letterSpacing: '-0.3px', lineHeight: 1.2, marginBottom: 4,
                  }}>
                    Create your<br />account
                  </h1>
                  <p style={{
                    fontFamily: '"Nunito", sans-serif',
                    fontSize: 13, color: '#A09A94', lineHeight: 1.4, fontWeight: 600,
                    letterSpacing: '0.01em',
                  }}>
                    Join thousands of pet owners.
                  </p>
                </div>
              </div>

              {/* Form */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18, animation: 'ca-fadeUp 0.5s 0.2s cubic-bezier(0.22, 1, 0.36, 1) both' }}>

                {/* Name */}
                <div style={inputStyle('name')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor('name')} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transition: 'stroke 200ms' }}>
                    <circle cx="12" cy="8" r="4" /><path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                  </svg>
                  <input
                    type="text" placeholder="Full name"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, fontWeight: 500, color: '#111', fontFamily: 'Inter, -apple-system, sans-serif' }}
                  />
                </div>

                {/* Email */}
                <div style={inputStyle('email')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor('email')} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transition: 'stroke 200ms' }}>
                    <rect x="2" y="4" width="20" height="16" rx="3" /><path d="M22 7l-10 6L2 7" />
                  </svg>
                  <input
                    type="email" placeholder="Email address"
                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, fontWeight: 500, color: '#111', fontFamily: 'Inter, -apple-system, sans-serif' }}
                  />
                </div>

                {/* Password */}
                <div>
                  <div style={inputStyle('password')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={iconColor('password')} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, transition: 'stroke 200ms' }}>
                      <rect x="3" y="11" width="18" height="11" rx="3" /><path d="M7 11V7a5 5 0 0110 0v4" />
                    </svg>
                    <input
                      type={showPassword ? 'text' : 'password'} placeholder="Password"
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                      onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                      style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 15, fontWeight: 500, color: '#111', fontFamily: 'Inter, -apple-system, sans-serif' }}
                    />
                    <button onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0 }}>
                      {showPassword ? <EyeOff size={17} color="#A09A94" /> : <Eye size={17} color="#A09A94" />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {form.password && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, paddingLeft: 4, animation: 'ca-scaleIn 0.2s ease both' }}>
                      <div style={{ display: 'flex', gap: 3, flex: 1 }}>
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} style={{
                            flex: 1, height: 3, borderRadius: 2,
                            background: i <= passwordStrength ? strengthColor : 'rgba(0,0,0,0.06)',
                            transition: 'background 300ms ease',
                          }} />
                        ))}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 600, color: strengthColor, minWidth: 36, transition: 'color 300ms' }}>
                        {strengthLabel}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA — black primary */}
              <div style={{ animation: 'ca-fadeUp 0.5s 0.3s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
                <button
                  onClick={() => navigate('/add-pet')}
                  className="active:scale-[0.97] active:opacity-90"
                  style={{
                    width: '100%', height: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: '#111',
                    color: '#FFFFFF', borderRadius: 12, fontSize: 15, fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    letterSpacing: '-0.2px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    position: 'relative', overflow: 'hidden',
                    transition: 'transform 120ms ease, opacity 120ms ease',
                  }}
                >
                  <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    Create Account
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </span>
                </button>
              </div>

              {/* Paw divider */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 12,
                margin: '18px 0',
                animation: 'ca-fadeUp 0.5s 0.35s cubic-bezier(0.22, 1, 0.36, 1) both',
              }}>
                <div style={{ flex: 1, height: 0, borderTop: '1px dashed #CFCFD4' }} />
                <PawDividerIcon />
                <div style={{ flex: 1, height: 0, borderTop: '1px dashed #CFCFD4' }} />
              </div>

              {/* Social — side by side with depth */}
              <div style={{ display: 'flex', gap: 10, animation: 'ca-fadeUp 0.5s 0.4s cubic-bezier(0.22, 1, 0.36, 1) both' }}>
                <button
                  className="active:scale-[0.97] transition-all duration-[120ms]"
                  style={{
                    flex: 1, height: 48,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: '#111', color: '#FFFFFF',
                    borderRadius: 12, fontSize: 13, fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="currentColor">
                    <path d="M14.94 13.14c-.32.74-.69 1.42-1.12 2.04-.59.85-1.07 1.44-1.44 1.77-.57.54-1.19.82-1.85.83-.47 0-1.04-.13-1.7-.4-.66-.27-1.27-.4-1.83-.4-.59 0-1.22.13-1.89.4-.68.27-1.22.41-1.63.43-.63.03-1.27-.26-1.9-.87-.4-.36-.9-.97-1.5-1.85-.65-.93-1.18-2.01-1.6-3.24C-.04 10.5-.25 9.21-.25 7.96c0-1.42.31-2.65.92-3.67.48-.82 1.12-1.46 1.93-1.93.8-.47 1.67-.71 2.6-.72.5 0 1.16.15 1.98.45.82.3 1.34.45 1.57.45.17 0 .75-.18 1.72-.53.92-.33 1.7-.47 2.33-.42 1.72.14 3.01.82 3.87 2.05-1.54.93-2.3 2.24-2.28 3.92.02 1.31.49 2.4 1.4 3.27.42.39.88.7 1.39.91-.11.32-.23.63-.35.93zM11.44.37c0 1.03-.37 1.99-1.12 2.87-.9 1.06-2 1.67-3.18 1.57-.02-.13-.02-.26-.02-.4 0-.99.43-2.04 1.19-2.9.38-.44.87-.8 1.46-1.08.59-.28 1.14-.43 1.67-.44v.38z" />
                  </svg>
                  Apple
                </button>
                <button
                  className="active:scale-[0.97] transition-all duration-[120ms]"
                  style={{
                    flex: 1, height: 48,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: '#F3EFEB', color: '#6E6058',
                    borderRadius: 12, fontSize: 13, fontWeight: 600,
                    border: '1px solid #EDE8E2', cursor: 'pointer',
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    boxShadow: 'none',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 18 18">
                    <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92a8.78 8.78 0 002.68-6.62z" fill="#4285F4"/>
                    <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 009 18z" fill="#34A853"/>
                    <path d="M3.96 10.71A5.41 5.41 0 013.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 000 9c0 1.45.35 2.82.96 4.04l3-2.33z" fill="#FBBC05"/>
                    <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
              </div>

              {/* Terms */}
              <p style={{
                fontSize: 11.5, color: '#A09A94', textAlign: 'center',
                lineHeight: 1.6, marginTop: 16, marginBottom: 4,
                animation: 'ca-fadeUp 0.5s 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
              }}>
                By continuing, you agree to our{' '}
                <span style={{ color: '#E85D2A', fontWeight: 600, cursor: 'pointer' }}>Terms</span>
                {' '}&{' '}
                <span style={{ color: '#E85D2A', fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>
              </p>

              {/* Sign in — warm accent underline */}
              <div style={{
                textAlign: 'center', marginTop: 18,
                animation: 'ca-fadeUp 0.5s 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
              }}>
                <button
                  onClick={() => navigate('/')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 14, color: '#A09A94', fontWeight: 400,
                    fontFamily: 'Inter, -apple-system, sans-serif',
                  }}
                >
                  Already have an account?{' '}
                  <span style={{
                    fontWeight: 600, color: '#E85D2A',
                    textDecoration: 'underline',
                    textDecorationColor: 'rgba(232,93,42,0.3)',
                    textUnderlineOffset: 3,
                    textDecorationThickness: 1.5,
                  }}>Sign in</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateAccountScreen;
