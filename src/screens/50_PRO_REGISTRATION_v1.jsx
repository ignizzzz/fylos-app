import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Camera, Plus, Check, X, Footprints, Home, Star,
  BadgeCheck, ShieldCheck, CreditCard, ScanFace, Banknote, Repeat, Lock,
} from 'lucide-react';

/**
 * 50_PRO_REGISTRATION_v1.jsx — "Become a Pro" (walker / sitter onboarding).
 * Revolut-style grouped steps, mirroring the Add-Pet flow the product uses.
 * Collects exactly the fields that power the Services marketplace (services
 * & prices with optional descriptions, availability, perks, cancellation
 * policy, verification) and ends with a live preview of the provider
 * profile as owners will see it. Supports { embedded, onExit }.
 */

const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const TINT = '#FBE7DD';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#A09A94';
const GREEN = '#3F8D63';
const LINE = '#F1EDE8';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.05)';
const USER_AVATAR = 'https://i.pravatar.cc/150?u=alex_fylos';

const ROLES = [
  { id: 'walking', label: 'Dog walking', sub: 'Earn CHF 15–35 per walk', icon: Footprints },
  { id: 'sitting', label: 'Pet sitting', sub: 'Earn CHF 25–60 per stay', icon: Home },
];
const COMFORT = ['Small dogs', 'Medium dogs', 'Large dogs', 'Puppies', 'Reactive dogs', 'Cats'];
const EXP = ['< 1 yr', '1–3 yrs', '3–5 yrs', '5+ yrs'];
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAYPARTS = ['Morning', 'Afternoon', 'Evening'];
const FEE = 0.15; // fylos commission — pros keep 85%
const SCHED_PRESETS = [
  { label: 'Weekdays', make: () => WEEKDAYS.map((_, i) => i < 5 ? [true, true, false] : [false, false, false]) },
  { label: 'Evenings & weekends', make: () => WEEKDAYS.map((_, i) => i < 5 ? [false, false, true] : [true, true, true]) },
  { label: 'Anytime', make: () => WEEKDAYS.map(() => [true, true, true]) },
];
const DEFAULT_SERVICES = {
  walking: [{ n: '30 min walk', p: '14', d: '' }, { n: '60 min walk', p: '22', d: '' }, { n: '90 min walk', p: '33', d: '' }],
  sitting: [{ n: 'Day sitting', p: '25', d: '' }, { n: 'Overnight', p: '38', d: '' }],
};
const STEPS = [
  { id: 'role', title: 'What would you like to offer?', sub: 'Pick one or both. You can change this later.' },
  { id: 'about', title: 'Tell owners about you', sub: 'This is the first thing they read.' },
  { id: 'experience', title: 'Your experience', sub: 'Helps us match you with the right pets.', skip: true },
  { id: 'services', title: 'Services & prices', sub: 'Suggested prices for your area. Make them yours.' },
  { id: 'availability', title: 'When can you work?', sub: 'Owners only see slots inside these hours.' },
  { id: 'perks', title: 'Perks & policies', sub: 'Small promises that win bookings.', skip: true },
  { id: 'verify', title: 'Verification', sub: 'Required for the “Verified by fylos” badge.' },
  { id: 'payout', title: 'Getting paid', sub: 'Weekly payouts, straight to your bank.' },
  { id: 'preview', title: 'How owners will see you', sub: 'One last look before you submit.' },
];
const CONFETTI = [
  { dx: -64, dy: -78, c: CORAL, d: 0 }, { dx: 66, dy: -76, c: '#E8B04A', d: 60 }, { dx: -98, dy: -12, c: GREEN, d: 30 },
  { dx: 98, dy: -14, c: '#F0A878', d: 90 }, { dx: -56, dy: 58, c: '#E8B04A', d: 120 }, { dx: 58, dy: 60, c: CORAL, d: 50 },
  { dx: 4, dy: -108, c: GREEN, d: 150 }, { dx: -28, dy: -94, c: '#F0A878', d: 100 }, { dx: 34, dy: -92, c: CORAL, d: 180 }, { dx: 88, dy: 40, c: '#E8B04A', d: 140 },
];

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

const Label = ({ children }) => <div className="text-[12px] font-bold uppercase tracking-[0.1em] mb-2.5" style={{ color: TERT }}>{children}</div>;
const RowInput = ({ value, onChange, placeholder, inputMode }) => (
  <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode}
    className="w-full bg-white rounded-[13px] px-4 h-[50px] outline-none text-[15px] font-semibold text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" style={{ boxShadow: SHADOW }} />
);
const Toggle = ({ value, onChange }) => (
  <div onClick={() => onChange(!value)} className="shrink-0 cursor-pointer" style={{ width: 38, height: 22, borderRadius: 9999, backgroundColor: value ? CORAL : '#E5E1DC', transition: 'background-color 200ms ease', position: 'relative' }}>
    <div style={{ position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transform: value ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 200ms cubic-bezier(0.34,1.56,0.64,1)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
  </div>
);

const ProRegistration = ({ embedded = false, onExit }) => {
  const [phase, setPhase] = useState('welcome'); // 'welcome' | 0..N | 'done'
  const [sheet, setSheet] = useState(null);
  const [d, setD] = useState({
    roles: ['walking'], photo: true, name: 'Alex Mueller', area: 'Zürich · Seefeld', bio: '',
    exp: 1, ownDog: true, comfort: ['Small dogs', 'Medium dogs'],
    services: JSON.parse(JSON.stringify(DEFAULT_SERVICES)),
    sched: WEEKDAYS.map((_, i) => i < 5 ? [true, true, false] : [false, false, false]),
    gps: true, photos: true, policy: '24 h',
    idDone: false, selfieDone: false, refs: '',
    iban: '',
  });
  const set = (k, v) => setD((s) => ({ ...s, [k]: v }));
  const toggleIn = (k, v) => setD((s) => ({ ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] }));
  const setSvc = (role, i, field, v) => setD((s) => ({ ...s, services: { ...s.services, [role]: s.services[role].map((x, j) => j === i ? { ...x, [field]: v } : x) } }));
  const exit = () => { if (onExit) return onExit(); if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  const cfg = typeof phase === 'number' ? STEPS[phase] : null;
  const TOTAL = STEPS.length;
  const back = () => { if (phase === 0) return setPhase('welcome'); setPhase((p) => p - 1); };
  const next = () => { if (phase === TOTAL - 1) return setPhase('done'); setPhase((p) => p + 1); };
  const valid = !cfg ? true :
    cfg.id === 'role' ? d.roles.length > 0 :
    cfg.id === 'about' ? !!(d.name.trim() && d.area.trim() && d.bio.trim().length >= 20) :
    cfg.id === 'services' ? d.roles.every((r) => d.services[r].every((s) => parseFloat(s.p) > 0)) :
    cfg.id === 'availability' ? d.sched.some((row) => row.some(Boolean)) :
    cfg.id === 'verify' ? d.idDone && d.selfieDone :
    cfg.id === 'payout' ? d.iban.trim().length >= 8 : true;

  const minPrice = Math.min(...d.roles.flatMap((r) => d.services[r].map((s) => parseFloat(s.p) || 999)));
  const roleLabel = d.roles.length === 2 ? 'Dog walker & sitter' : d.roles[0] === 'sitting' ? 'Pet sitter' : 'Dog walker';
  const perksList = [d.gps && 'GPS tracking', d.photos && 'Photo updates'].filter(Boolean);

  const styleBlock = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes prStep { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
      .pr-step { animation: prStep 0.3s cubic-bezier(0.22,1,0.36,1) both; }
      @keyframes prSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
      @keyframes prFade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes prAvatar { 0% { opacity: 0; transform: scale(0.3); } 62% { transform: scale(1.09); } 100% { opacity: 1; transform: scale(1); } }
      @keyframes prRingOut { 0% { transform: scale(0.55); opacity: 0.55; } 100% { transform: scale(2.5); opacity: 0; } }
      @keyframes prConfetti { 0% { opacity: 0; transform: translate(0,0) scale(0.2); } 22% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1); } }
      @keyframes prPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
      @keyframes prRise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .pr-rise { animation: prRise 0.5s 0.35s cubic-bezier(0.22,1,0.36,1) both; }
    `}</style>
  );

  const frame = (child) => embedded ? (
    <div className="absolute inset-0 z-[150]" style={{ background: CREAM, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>{child}</div>
  ) : (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
        <StatusBar />
        {child}
      </div>
    </div>
  );

  /* ── WELCOME ── */
  if (phase === 'welcome') {
    return (<>{styleBlock}{frame(
      <div className="absolute inset-0 flex flex-col" style={{ background: CREAM }}>
        <div className="px-5 flex items-center shrink-0" style={{ paddingTop: 58 }}>
          <button onClick={exit} className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><X size={16} color={INK} strokeWidth={2.2} /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-7" style={{ scrollbarWidth: 'none' }}>
          <div className="flex flex-col items-center text-center pt-6">
            <div className="relative">
              <span className="w-[96px] h-[96px] rounded-full flex items-center justify-center" style={{ background: TINT }}><Footprints size={38} color={CORAL} strokeWidth={1.8} /></span>
              <span className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center border-[3px]" style={{ background: CORAL, borderColor: CREAM }}><Banknote size={16} color="#fff" strokeWidth={2.2} /></span>
            </div>
            <h1 className="text-[27px] font-extrabold tracking-[-0.025em] leading-[1.12] mt-6" style={{ color: INK }}>Earn with fylos</h1>
            <p className="text-[14px] leading-[1.5] mt-2.5 max-w-[280px]" style={{ color: MUTED }}>Walk or sit for pets near you. Most pros in Zürich earn <span style={{ color: INK, fontWeight: 700 }}>CHF 400–900 a month</span> on their own schedule.</p>
          </div>
          <div className="mt-8 flex flex-col gap-2.5">
            {[[Banknote, 'You set the prices', 'Keep 85% of every booking'], [Repeat, 'You choose the hours', 'Work as little or as much as you like'], [ShieldCheck, 'Insured through fylos', 'Every booking is covered']].map(([Icon, t, s], i) => (
              <div key={i} className="bg-white rounded-[16px] px-4 py-3.5 flex items-center gap-3" style={{ boxShadow: SHADOW }}>
                <span className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: TINT }}><Icon size={17} color={CORAL} strokeWidth={2} /></span>
                <div><div className="text-[14px] font-bold" style={{ color: INK }}>{t}</div><div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{s}</div></div>
              </div>
            ))}
          </div>
          <p className="text-[11.5px] text-center mt-5" style={{ color: TERT }}>Takes about 3 minutes. You go live after a quick review.</p>
        </div>
        <div className="px-6 pt-3 shrink-0" style={{ paddingBottom: embedded ? 100 : 34, background: `linear-gradient(to top, ${CREAM} 72%, rgba(247,245,242,0))` }}>
          <button onClick={() => setPhase(0)} className="w-full py-4 rounded-[18px] active:scale-[0.98] transition-transform" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.3)' }}><span className="text-[15.5px] font-bold text-white">Get started</span></button>
        </div>
      </div>
    )}</>);
  }

  /* ── DONE ── */
  if (phase === 'done') {
    return (<>{styleBlock}{frame(
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8" style={{ background: CREAM }}>
        <div className="relative mb-7" style={{ width: 124, height: 124 }}>
          <span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${CORAL}`, animation: 'prRingOut 1.4s 0.15s ease-out both' }} />
          <span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${CORAL}`, animation: 'prRingOut 1.4s 0.45s ease-out both' }} />
          {CONFETTI.map((p, i) => (
            <span key={i} className="absolute top-1/2 left-1/2 rounded-full" style={{ width: 8, height: 8, marginLeft: -4, marginTop: -4, background: p.c, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animation: `prConfetti 0.9s ${p.d + 200}ms cubic-bezier(0.22,1,0.36,1) both` }} />
          ))}
          <span className="absolute inset-0 rounded-full overflow-hidden" style={{ boxShadow: '0 12px 30px rgba(232,93,42,0.3)', animation: 'prAvatar 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            <img src={USER_AVATAR} alt="" className="w-full h-full object-cover" />
          </span>
          <span className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center border-[3px]" style={{ background: GREEN, borderColor: CREAM }}><Check size={20} color="#fff" strokeWidth={3} /></span>
        </div>
        <h1 className="pr-rise text-[26px] font-extrabold tracking-[-0.02em]" style={{ color: INK }}>Application sent</h1>
        <p className="pr-rise text-[13.5px] mt-2 leading-[1.5] max-w-[280px]" style={{ color: MUTED }}>We review every pro by hand. You’ll hear from us within 48 hours.</p>
        <div className="pr-rise flex items-start justify-between mt-7 w-full px-3">
          {[{ l: 'Application sent', done: true }, { l: 'Review & checks', now: true }, { l: 'You go live' }].map((s, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className="flex-1 h-[2px] rounded-full mt-[11px] mx-1" style={{ background: s.now || s.done ? '#F6C9B4' : LINE }} />}
              <span className="flex flex-col items-center" style={{ width: 84 }}>
                <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: s.done ? GREEN : s.now ? TINT : PEACH, animation: s.now ? 'prPulse 1.6s ease-in-out infinite' : 'none' }}>
                  {s.done ? <Check size={12} color="#fff" strokeWidth={3.2} /> : <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.now ? CORAL : '#C9BBAE' }} />}
                </span>
                <span className="text-[10px] font-semibold mt-1.5 leading-tight" style={{ color: s.done ? GREEN : s.now ? CORAL : TERT }}>{s.l}</span>
              </span>
            </React.Fragment>
          ))}
        </div>
        <button onClick={exit} className="pr-rise w-full mt-8 py-4 rounded-[18px] active:scale-[0.98] transition-transform" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.3)' }}><span className="text-[15px] font-bold text-white">Done</span></button>
      </div>
    )}</>);
  }

  /* ── STEPS ── */
  return (<>{styleBlock}{frame(
    <div className="absolute inset-0" style={{ background: CREAM }}>
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden px-6" style={{ scrollbarWidth: 'none', paddingTop: 104, paddingBottom: embedded ? 180 : 110 }}>
        <div key={phase} className="pr-step">
          <h1 className="text-[25px] font-extrabold tracking-[-0.03em] leading-[1.12]" style={{ color: INK }}>{cfg.title}</h1>
          <p className="text-[13.5px] mt-2 leading-[1.45]" style={{ color: TERT }}>{cfg.sub}</p>

          {cfg.id === 'role' && (
            <div className="mt-7 flex flex-col gap-3">
              {ROLES.map((r) => {
                const on = d.roles.includes(r.id);
                const Icon = r.icon;
                return (
                  <button key={r.id} onClick={() => toggleIn('roles', r.id)} className="flex items-center gap-3.5 px-4 py-4 rounded-[18px] text-left transition-all active:scale-[0.98]" style={{ background: on ? '#FFF3EC' : '#fff', boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>
                    <span className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: on ? CORAL : TINT }}><Icon size={22} color={on ? '#fff' : CORAL} strokeWidth={1.9} /></span>
                    <div className="flex-1"><div className="text-[16px] font-bold" style={{ color: on ? CORAL : INK }}>{r.label}</div><div className="text-[12px] mt-0.5" style={{ color: TERT }}>{r.sub}</div></div>
                    <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0" style={{ background: on ? CORAL : 'transparent', border: on ? 'none' : '1.6px solid #DDD4C9' }}>{on && <Check size={13} color="#fff" strokeWidth={3} />}</span>
                  </button>
                );
              })}
              <p className="text-[11.5px] ml-1 mt-1" style={{ color: TERT }}>Grooming & vet services are coming later this year.</p>
            </div>
          )}

          {cfg.id === 'about' && (
            <div className="mt-7">
              <div className="flex flex-col items-center">
                <button onClick={() => set('photo', !d.photo)} className="relative active:scale-[0.97] transition-transform">
                  <span className="w-[96px] h-[96px] rounded-full flex items-center justify-center overflow-hidden" style={{ background: '#fff', boxShadow: SHADOW }}>
                    {d.photo ? <img src={USER_AVATAR} alt="" className="w-full h-full object-cover" /> : <Camera size={28} color={TERT} strokeWidth={1.7} />}
                  </span>
                  <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-[3px]" style={{ background: CORAL, borderColor: CREAM }}><Plus size={15} color="#fff" strokeWidth={2.8} /></span>
                </button>
                <p className="text-[11px] mt-2.5" style={{ color: TERT }}>A clear, friendly photo doubles your bookings.</p>
              </div>
              <div className="mt-6"><Label>Name</Label><RowInput value={d.name} onChange={(v) => set('name', v)} placeholder="Your full name" /></div>
              <div className="mt-5"><Label>Area</Label><RowInput value={d.area} onChange={(v) => set('area', v)} placeholder="e.g. Zürich · Seefeld" /></div>
              <div className="mt-5">
                <Label>Bio</Label>
                <textarea value={d.bio} onChange={(e) => set('bio', e.target.value)} rows={4} placeholder="Who are you, why pets, what makes your walks special? Owners read this before anything else."
                  className="w-full bg-white rounded-[14px] px-4 py-3 outline-none text-[14px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal resize-none" style={{ boxShadow: SHADOW }} />
                <div className="text-[10.5px] mt-1.5 text-right" style={{ color: d.bio.trim().length >= 20 ? GREEN : TERT }}>{d.bio.trim().length >= 20 ? 'Looks good' : `${Math.max(0, 20 - d.bio.trim().length)} more characters`}</div>
              </div>
            </div>
          )}

          {cfg.id === 'experience' && (
            <div className="mt-7 flex flex-col gap-6">
              <div>
                <Label>Years with animals</Label>
                <div className="flex gap-2">{EXP.map((e, i) => { const on = d.exp === i; return <button key={e} onClick={() => set('exp', i)} className="flex-1 h-[44px] rounded-[12px] text-[13px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>{e}</button>; })}</div>
              </div>
              <div className="bg-white rounded-[16px] px-4 py-3.5 flex items-center gap-3" style={{ boxShadow: SHADOW }}>
                <div className="flex-1"><div className="text-[14px] font-semibold" style={{ color: INK }}>I have a pet of my own</div><div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>Owners love this</div></div>
                <Toggle value={d.ownDog} onChange={(v) => set('ownDog', v)} />
              </div>
              <div>
                <Label>Comfortable with</Label>
                <button onClick={() => setSheet('comfort')} className="w-full flex items-center gap-3 bg-white rounded-[13px] px-4 h-[52px] active:scale-[0.99] transition-transform text-left" style={{ boxShadow: SHADOW }}>
                  <span className="flex-1 text-[14.5px] font-semibold truncate" style={{ color: d.comfort.length ? INK : '#C4B8AC' }}>{d.comfort.length ? d.comfort.join(', ') : 'Select'}</span>
                  <ChevronRight size={17} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />
                </button>
              </div>
            </div>
          )}

          {cfg.id === 'services' && (
            <div className="mt-6 flex flex-col gap-6">
              {d.roles.map((role) => (
                <div key={role}>
                  <Label>{role === 'walking' ? 'Walking' : 'Sitting'}</Label>
                  <div className="flex flex-col gap-2.5">
                    {d.services[role].map((s, i) => (
                      <div key={s.n} className="bg-white rounded-[16px] px-4 py-3" style={{ boxShadow: SHADOW }}>
                        <div className="flex items-center gap-3">
                          <span className="flex-1 text-[14.5px] font-bold" style={{ color: INK }}>{s.n}</span>
                          <span className="text-[13px] font-bold" style={{ color: TERT }}>CHF</span>
                          <input value={s.p} onChange={(e) => setSvc(role, i, 'p', e.target.value.replace(/[^\d.]/g, ''))} inputMode="decimal" className="w-14 bg-transparent outline-none text-right text-[17px] font-extrabold" style={{ color: CORAL }} />
                        </div>
                        <div className="text-right text-[10.5px] font-semibold mt-0.5" style={{ color: parseFloat(s.p) > 0 ? GREEN : TERT }}>
                          {parseFloat(s.p) > 0 ? `You receive CHF ${(parseFloat(s.p) * (1 - FEE)).toFixed(2)}` : 'Set a price'}
                        </div>
                        <input value={s.d} onChange={(e) => setSvc(role, i, 'd', e.target.value)} placeholder="What’s included? Optional, owners see this."
                          className="w-full mt-1.5 pt-2 bg-transparent outline-none text-[12.5px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" style={{ borderTop: '1px solid ' + LINE }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <p className="text-[11.5px] -mt-2 ml-1" style={{ color: TERT }}>You keep 85% of every booking. The prices owners see are yours.</p>
            </div>
          )}

          {cfg.id === 'availability' && (
            <div className="mt-6">
              {/* quick presets */}
              <div className="flex gap-2 mb-4">
                {SCHED_PRESETS.map((p) => {
                  const on = JSON.stringify(d.sched) === JSON.stringify(p.make());
                  return <button key={p.label} onClick={() => set('sched', p.make())} className="px-3 h-[34px] rounded-full text-[12px] font-bold active:scale-95 transition-all" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.5px ${CORAL}` : SHADOW }}>{p.label}</button>;
                })}
              </div>
              {/* weekly grid — every day × daypart is its own switch */}
              <div className="bg-white rounded-[18px] p-3" style={{ boxShadow: SHADOW }}>
                <div className="flex items-center gap-2 pb-2" style={{ borderBottom: '1px solid ' + LINE }}>
                  <span className="w-[44px]" />
                  {DAYPARTS.map((p) => <span key={p} className="flex-1 text-center text-[9.5px] font-bold uppercase tracking-[0.06em]" style={{ color: TERT }}>{p}</span>)}
                </div>
                {WEEKDAYS.map((w, di) => (
                  <div key={w} className="flex items-center gap-2 py-[5px]">
                    <span className="w-[44px] text-[12.5px] font-bold" style={{ color: d.sched[di].some(Boolean) ? INK : '#C4BBB0' }}>{w}</span>
                    {DAYPARTS.map((_, pi) => {
                      const on = d.sched[di][pi];
                      return (
                        <button key={pi} onClick={() => set('sched', d.sched.map((row, i) => i === di ? row.map((c, j) => j === pi ? !c : c) : row))}
                          className="flex-1 h-[34px] rounded-[10px] flex items-center justify-center transition-all active:scale-95"
                          style={{ background: on ? '#FFF3EC' : '#F7F4F0', boxShadow: on ? `inset 0 0 0 1.5px ${CORAL}` : 'none' }}>
                          {on ? <Check size={13} color={CORAL} strokeWidth={3} /> : <span className="w-1 h-1 rounded-full" style={{ background: '#D8CFC4' }} />}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className="text-[11.5px] ml-1 mt-3" style={{ color: TERT }}>Tap any slot, e.g. switch off Monday afternoons. Block single dates later from your dashboard.</p>
            </div>
          )}

          {cfg.id === 'perks' && (
            <div className="mt-7 flex flex-col gap-5">
              <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                {[['gps', 'Live GPS tracking', 'Owners follow the walk in real time'], ['photos', 'Photo updates', 'A picture from every booking']].map(([k, t, s], i) => (
                  <div key={k} className="relative flex items-center gap-3 px-4 py-3.5">
                    <div className="flex-1"><div className="text-[14px] font-semibold" style={{ color: INK }}>{t}</div><div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{s}</div></div>
                    <Toggle value={d[k]} onChange={(v) => set(k, v)} />
                    {i === 0 && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: LINE }} />}
                  </div>
                ))}
              </div>
              <div>
                <Label>Free cancellation for owners</Label>
                <div className="flex gap-2">{['24 h', '12 h', 'None'].map((c) => { const on = d.policy === c; return <button key={c} onClick={() => set('policy', c)} className="flex-1 h-[44px] rounded-[12px] text-[13px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>{c === 'None' ? 'None' : `Up to ${c}`}</button>; })}</div>
                <p className="text-[11.5px] mt-2 ml-1" style={{ color: TERT }}>A flexible policy ranks you higher in search.</p>
              </div>
            </div>
          )}

          {cfg.id === 'verify' && (
            <div className="mt-7 flex flex-col gap-3">
              {[['idDone', CreditCard, 'Government ID', 'Passport or Swiss ID. Checked once, stored encrypted'], ['selfieDone', ScanFace, 'Selfie check', 'Quick match against your ID']].map(([k, Icon, t, s]) => {
                const done = d[k];
                return (
                  <button key={k} onClick={() => set(k, !done)} className="flex items-center gap-3.5 px-4 py-4 rounded-[18px] text-left transition-all active:scale-[0.98]" style={{ background: done ? '#EAF7EF' : '#fff', boxShadow: done ? 'inset 0 0 0 1.5px #BBDFC8' : SHADOW }}>
                    <span className="w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0" style={{ background: done ? '#fff' : TINT }}><Icon size={19} color={done ? GREEN : CORAL} strokeWidth={2} /></span>
                    <div className="flex-1"><div className="text-[14.5px] font-bold" style={{ color: INK }}>{t}</div><div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{s}</div></div>
                    <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0" style={{ background: done ? GREEN : 'transparent', border: done ? 'none' : '1.6px solid #DDD4C9' }}>{done && <Check size={13} color="#fff" strokeWidth={3} />}</span>
                  </button>
                );
              })}
              <div className="mt-2"><Label>Reference <span className="lowercase tracking-normal" style={{ color: '#C4BBB0' }}>· optional</span></Label>
                <RowInput value={d.refs} onChange={(v) => set('refs', v)} placeholder="Name & phone of someone who vouches for you" />
              </div>
              <div className="flex items-center gap-2 mt-1 ml-1">
                <BadgeCheck size={14} color={CORAL} strokeWidth={2.2} />
                <span className="text-[11.5px] font-medium" style={{ color: TERT }}>Completing this earns the “Verified by fylos” badge.</span>
              </div>
            </div>
          )}

          {cfg.id === 'payout' && (
            <div className="mt-7 flex flex-col gap-5">
              <div><Label>IBAN</Label><RowInput value={d.iban} onChange={(v) => set('iban', v.toUpperCase())} placeholder="CH00 0000 0000 0000 0000 0" /></div>
              <div className="bg-white rounded-[16px] px-4 py-3.5 flex items-center gap-3" style={{ boxShadow: SHADOW }}>
                <span className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: '#EAF7EF' }}><Lock size={16} color={GREEN} strokeWidth={2} /></span>
                <p className="text-[12px] leading-[1.45]" style={{ color: MUTED }}>Payouts every Monday via <span style={{ color: INK, fontWeight: 600 }}>Stripe</span>. fylos never holds your money.</p>
              </div>
            </div>
          )}

          {cfg.id === 'preview' && (
            <div className="mt-6">
              <Label>Your card in search</Label>
              <div className="bg-white rounded-[18px] p-3 flex gap-3.5" style={{ boxShadow: SHADOW }}>
                <img src={USER_AVATAR} alt="" className="w-[76px] h-[76px] rounded-[15px] object-cover shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-[14.5px] font-bold truncate" style={{ color: INK }}>{d.name || 'Your name'}</span>
                    <BadgeCheck size={13} color={CORAL} strokeWidth={2.2} className="shrink-0" />
                    <span className="flex-1" />
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase px-1.5 py-[2px] rounded-full shrink-0" style={{ background: '#EAF7EF', color: GREEN }}>New</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-[3px]">
                    <Star size={10} color="#E8B04A" strokeWidth={1.6} />
                    <span className="text-[11px]" style={{ color: TERT }}>No reviews yet · {d.area.split('·')[1]?.trim() || d.area}</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid ' + LINE }}>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: GREEN }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /> Available today</span>
                    <span className="text-[12.5px] font-extrabold" style={{ color: INK }}><span className="text-[10.5px] font-semibold" style={{ color: TERT }}>from </span>CHF {isFinite(minPrice) ? minPrice : '—'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6"><Label>Your profile</Label></div>
              <div className="bg-white rounded-[18px] p-4" style={{ boxShadow: SHADOW }}>
                <div className="flex items-center gap-3">
                  <img src={USER_AVATAR} alt="" className="w-12 h-12 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1"><span className="text-[15px] font-extrabold truncate" style={{ color: INK }}>{d.name}</span><BadgeCheck size={14} color={CORAL} strokeWidth={2.2} /></div>
                    <div className="text-[11.5px]" style={{ color: TERT }}>{roleLabel} · {d.area}</div>
                  </div>
                </div>
                {d.bio.trim() && <p className="text-[12.5px] leading-[1.5] mt-3" style={{ color: MUTED }}>{d.bio}</p>}
                <div className="h-px my-3" style={{ background: LINE }} />
                {d.roles.flatMap((r) => d.services[r]).map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 gap-3">
                    <div className="min-w-0"><span className="text-[13px] font-semibold" style={{ color: INK }}>{s.n}</span>{s.d && <span className="block text-[11px] truncate" style={{ color: TERT }}>{s.d}</span>}</div>
                    <span className="text-[13px] font-bold shrink-0" style={{ color: MUTED }}>CHF {s.p}</span>
                  </div>
                ))}
                {(perksList.length > 0 || d.policy !== 'None') && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 pt-2.5" style={{ borderTop: '1px solid ' + LINE }}>
                    {perksList.length > 0 && <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: TERT }}><Check size={11} color={GREEN} strokeWidth={3} /> {perksList.join(' & ')} included</span>}
                    {d.policy !== 'None' && <span className="text-[11px] font-medium" style={{ color: TERT }}>· free cancellation up to {d.policy}</span>}
                  </div>
                )}
              </div>
              <p className="text-[11.5px] text-center mt-4" style={{ color: TERT }}>Everything can be edited later from your pro dashboard.</p>
            </div>
          )}
        </div>
      </div>

      {/* gradient header */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 62%, rgba(247,245,242,0) 100%)', paddingTop: 56, paddingBottom: 16 }}>
        <div className="px-5 flex items-center gap-3 pointer-events-auto">
          <button onClick={back} className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform shrink-0" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
          <div className="flex-1 flex gap-1">{STEPS.map((_, i) => (<div key={i} className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: '#EAE3DB' }}><div className="h-full rounded-full transition-all duration-[400ms]" style={{ width: i <= phase ? '100%' : '0%', background: CORAL }} /></div>))}</div>
          {cfg.skip ? <button onClick={next} className="text-[13px] font-bold shrink-0 w-10 text-right" style={{ color: TERT }}>Skip</button> : <span className="shrink-0 w-10 text-right text-[12px] font-bold" style={{ color: TERT }}>{phase + 1}/{TOTAL}</span>}
        </div>
      </div>

      {/* footer CTA */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pointer-events-none" style={{ background: 'linear-gradient(to top, #F7F5F2 0%, #F7F5F2 55%, rgba(247,245,242,0) 100%)', paddingTop: 28, paddingBottom: embedded ? 100 : 32 }}>
        <button onClick={() => valid && next()} disabled={!valid} className="w-full py-4 rounded-[18px] transition-all active:scale-[0.98] pointer-events-auto" style={{ background: valid ? CORAL : '#EAE3DB', boxShadow: valid ? '0 8px 22px rgba(232,93,42,0.28)' : 'none' }}>
          <span className="text-[15.5px] font-bold" style={{ color: valid ? '#fff' : TERT }}>{phase === TOTAL - 1 ? 'Submit for review' : 'Continue'}</span>
        </button>
      </div>

      {/* comfort multi-select sheet */}
      {sheet === 'comfort' && (
        <>
          <div className="absolute inset-0 z-[160]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'prFade 0.2s ease both' }} onClick={() => setSheet(null)} />
          <div className="absolute left-0 right-0 bottom-0 z-[165] rounded-t-[26px]" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'prSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
            <div className="px-5 pt-1 pb-3 flex items-center gap-3">
              <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Comfortable with</h2>
              <button onClick={() => setSheet(null)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
            </div>
            <div className="px-5">
              <div className="rounded-[14px] bg-white overflow-hidden" style={{ boxShadow: SHADOW }}>
                {COMFORT.map((o, i) => {
                  const on = d.comfort.includes(o);
                  return (
                    <button key={o} onClick={() => toggleIn('comfort', o)} className="relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.02]">
                      <span className="flex-1 text-[15px] font-semibold" style={{ color: INK }}>{o}</span>
                      <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0" style={{ background: on ? CORAL : 'transparent', border: on ? 'none' : '1.6px solid #DDD4C9' }}>{on && <Check size={13} color="#fff" strokeWidth={3} />}</span>
                      {i < COMFORT.length - 1 && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: LINE }} />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="px-5 pt-4" style={{ paddingBottom: embedded ? 100 : 30 }}>
              <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-[16px] active:scale-[0.98]" style={{ background: CORAL, boxShadow: '0 6px 18px rgba(232,93,42,0.26)' }}><span className="text-[15px] font-bold text-white">Done</span></button>
            </div>
          </div>
        </>
      )}
    </div>
  )}</>);
};

export default ProRegistration;
