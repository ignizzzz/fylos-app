import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Camera, Plus, Minus, Check, Calendar, Search, X } from 'lucide-react';

/**
 * 71_ADD_PET_v1.jsx — comprehensive "Add a pet" flow (Revolut-style).
 * Content scrolls behind a gradient-fade header & footer (app-canonical).
 * Multi/single selects use clean SelectRows that open a bottom-sheet picker
 * (no pill clouds). 7 grouped steps (last four skippable) → success.
 */

const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#9B9B9F';
const GREEN = '#3F8D63';
const FIELD = '#E0D8CF';
const CARD_SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.05)';
const DOG_PHOTO = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300&h=300';

const SPECIES = [
  { id: 'dog', label: 'Dog' }, { id: 'cat', label: 'Cat' }, { id: 'rabbit', label: 'Rabbit' },
  { id: 'bird', label: 'Bird' }, { id: 'fish', label: 'Fish' }, { id: 'reptile', label: 'Reptile' },
  { id: 'small', label: 'Small pet' }, { id: 'horse', label: 'Horse' }, { id: 'other', label: 'Other' },
];
const OTHER_SUGGEST = ['Ferret', 'Hedgehog', 'Chinchilla', 'Guinea pig', 'Hamster', 'Tortoise', 'Parrot', 'Snake', 'Lizard', 'Gerbil'];
const BREEDS = {
  dog: ['Labrador Retriever', 'Golden Retriever', 'German Shepherd', 'French Bulldog', 'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'Dachshund', 'Border Collie', 'Chihuahua', 'Boxer', 'Siberian Husky', 'Shih Tzu', 'Cocker Spaniel', 'Pomeranian', 'Australian Shepherd', 'Cavalier King Charles'],
  cat: ['Domestic Shorthair', 'Domestic Longhair', 'Maine Coon', 'Persian', 'Siamese', 'British Shorthair', 'Bengal', 'Ragdoll', 'Sphynx', 'Scottish Fold', 'Abyssinian', 'Russian Blue', 'Norwegian Forest'],
  rabbit: ['Holland Lop', 'Netherland Dwarf', 'Mini Rex', 'Lionhead', 'Flemish Giant', 'Dutch'],
};
const COLORS = ['Black', 'White', 'Brown', 'Golden', 'Cream', 'Grey', 'Tabby', 'Spotted', 'Brindle', 'Tricolor', 'Mixed'];
const TEMPERAMENT = ['Friendly', 'Playful', 'Calm', 'Energetic', 'Shy', 'Affectionate', 'Independent', 'Protective'];
const TRIGGERS = ['Thunder', 'Fireworks', 'Strangers', 'Other dogs', 'Loud noises', 'Being alone'];
const GOODWITH = ['Dogs', 'Cats', 'Kids', 'Strangers'];
const ALLERGIES = ['Chicken', 'Beef', 'Dairy', 'Grain', 'Pollen', 'Dust mites', 'Fleas', 'Grass', 'Bee stings'];
const VACCINES = { dog: ['Rabies', 'DHPP', 'Bordetella', 'Leptospirosis', 'Lyme'], cat: ['Rabies', 'FVRCP', 'FeLV'], _: ['Rabies'] };
const MEDS = ['Apoquel', 'NexGard', 'Frontline', 'Bravecto', 'Heartgard', 'Galliprant'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CURRENT_YEAR = 2026;
const YEARS = Array.from({ length: 26 }, (_, i) => CURRENT_YEAR - i);
const CONFETTI = [
  { dx: -64, dy: -78, c: CORAL, d: 0 }, { dx: 66, dy: -76, c: '#E8B04A', d: 60 }, { dx: -98, dy: -12, c: GREEN, d: 30 },
  { dx: 98, dy: -14, c: '#F0A878', d: 90 }, { dx: -56, dy: 58, c: '#E8B04A', d: 120 }, { dx: 58, dy: 60, c: CORAL, d: 50 },
  { dx: 4, dy: -108, c: GREEN, d: 150 }, { dx: -28, dy: -94, c: '#F0A878', d: 100 }, { dx: 34, dy: -92, c: CORAL, d: 180 }, { dx: 88, dy: 40, c: '#E8B04A', d: 140 },
];

const STEPS = [
  { id: 'identity', title: "Let's meet your pet", sub: 'A photo and a name to start.' },
  { id: 'breed', title: (n) => `What breed is ${n}?`, sub: 'Search the list, or mark them as mixed.', skip: true },
  { id: 'about', title: (n) => `About ${n}`, sub: 'Sex, age, weight and a few basics.' },
  { id: 'personality', title: 'Personality', sub: 'Helps sitters understand them.', skip: true },
  { id: 'care', title: 'Daily care', sub: 'What a sitter needs to look after them.', skip: true },
  { id: 'health', title: 'Health', sub: 'Allergies, vaccines and medications.', skip: true },
  { id: 'team', title: 'Care team & notes', sub: 'Vet, emergency contact, anything else.', skip: true },
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

const BigInput = ({ value, onChange, placeholder, inputMode, autoFocus }) => (
  <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode} autoFocus={autoFocus}
    className="w-full bg-transparent outline-none text-[19px] font-bold text-[#111] placeholder:text-[#CBC0B4] placeholder:font-medium pb-2 border-b-2 transition-colors"
    style={{ borderColor: value ? CORAL : FIELD }} />
);

const RowInput = ({ value, onChange, placeholder, inputMode }) => (
  <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode}
    className="w-full bg-white rounded-[12px] px-4 h-[50px] outline-none text-[15px] font-semibold text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" style={{ boxShadow: CARD_SHADOW }} />
);

const Segmented = ({ options, value, onChange, small }) => (
  <div className="flex gap-2">
    {options.map((o) => {
      const on = value === o.id;
      return (
        <button key={String(o.id)} onClick={() => onChange(o.id)} className={`flex-1 ${small ? 'h-[44px] text-[14px]' : 'h-[50px] text-[15px]'} rounded-[16px] font-bold transition-all active:scale-[0.97]`}
          style={{ background: on ? '#FFF3EC' : '#FFFFFF', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : CARD_SHADOW }}>{o.label}</button>
      );
    })}
  </div>
);

const Stepper = ({ value, onChange, min = 0, max = 99, unit }) => (
  <div className="flex items-center justify-between rounded-[15px] bg-white px-3 py-2.5" style={{ boxShadow: CARD_SHADOW }}>
    <button onClick={() => onChange(Math.max(min, value - 1))} className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: PEACH }}><Minus size={18} color={INK} strokeWidth={2.4} /></button>
    <div className="flex items-baseline gap-1.5"><span className="text-[26px] font-extrabold text-[#111] tabular-nums">{value}</span><span className="text-[14px] font-medium" style={{ color: TERT }}>{unit}</span></div>
    <button onClick={() => onChange(Math.min(max, value + 1))} className="w-11 h-11 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: PEACH }}><Plus size={18} color={INK} strokeWidth={2.4} /></button>
  </div>
);

// Clean select row that opens a picker sheet (replaces pill clouds)
const SelectRow = ({ value, placeholder, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 bg-white rounded-[12px] px-4 h-[52px] active:scale-[0.99] transition-transform text-left" style={{ boxShadow: CARD_SHADOW }}>
    <span className="flex-1 text-[15px] font-semibold truncate" style={{ color: value ? INK : '#C4B8AC' }}>{value || placeholder}</span>
    <ChevronRight size={17} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />
  </button>
);

// ── Bottom-sheet pickers ──────────────────────────────────────────────
const Sheet = ({ title, onClose, children, footer }) => (
  <>
    <div className="absolute inset-0 z-[110]" style={{ background: 'rgba(20,12,8,0.38)', animation: 'apFade 0.22s ease both' }} onClick={onClose} />
    <div className="absolute left-0 right-0 bottom-0 z-[120] rounded-t-[26px] flex flex-col" style={{ background: CREAM, maxHeight: '80%', animation: 'apSheet 0.3s cubic-bezier(0.22,1,0.36,1) both', boxShadow: '0 -12px 40px rgba(0,0,0,0.2)' }}>
      <div className="flex justify-center pt-2.5 pb-1 shrink-0"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
      <div className="px-5 pt-1 pb-3 flex items-center gap-3 shrink-0">
        <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>{title}</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
      </div>
      {children}
      {footer}
    </div>
  </>
);

const BreedPicker = ({ species, onPick, onClose }) => {
  const [q, setQ] = useState('');
  const all = BREEDS[species] || [];
  const ql = q.toLowerCase().trim();
  const list = ql ? all.filter((b) => b.toLowerCase().includes(ql)) : all;
  const exact = all.some((b) => b.toLowerCase() === ql);
  return (
    <Sheet title="Choose a breed" onClose={onClose}>
      <div className="px-5 pb-3 shrink-0">
        <div className="flex items-center gap-2.5 bg-white rounded-[16px] px-3.5 h-[46px]" style={{ boxShadow: CARD_SHADOW }}>
          <Search size={17} color={TERT} strokeWidth={2} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search breeds" className="flex-1 bg-transparent outline-none text-[15px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 pb-8" style={{ scrollbarWidth: 'none' }}>
        {ql && !exact && (
          <button onClick={() => onPick(q.trim())} className="w-full flex items-center gap-2 px-4 py-3.5 mb-2 rounded-[12px] bg-white text-left active:scale-[0.99]" style={{ boxShadow: CARD_SHADOW }}>
            <Plus size={16} color={CORAL} strokeWidth={2.4} /><span className="text-[15px] font-semibold" style={{ color: CORAL }}>Add "{q.trim()}"</span>
          </button>
        )}
        <div className="rounded-[16px] bg-white overflow-hidden" style={{ boxShadow: CARD_SHADOW }}>
          {list.map((b, i) => (
            <button key={b} onClick={() => onPick(b)} className="relative w-full flex items-center px-4 py-3.5 text-left active:bg-black/[0.02]">
              <span className="text-[15px] font-semibold" style={{ color: INK }}>{b}</span>
              {i < list.length - 1 && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: '#F1EDE8' }} />}
            </button>
          ))}
        </div>
      </div>
    </Sheet>
  );
};

const OptionSheet = ({ title, options, values = [], single, custom, onToggle, onPick, onAddCustom, onClose }) => {
  const [draft, setDraft] = useState('');
  const extra = custom ? values.filter((v) => !options.includes(v)) : [];
  const all = [...options, ...extra];
  return (
    <Sheet title={title} onClose={onClose}
      footer={!single && (
        <div className="px-5 pt-2 pb-7 shrink-0">
          {custom && (
            <div className="flex items-center gap-2 mb-3">
              <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add your own" className="flex-1 bg-white rounded-[12px] px-3.5 h-[46px] outline-none text-[14px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" style={{ boxShadow: CARD_SHADOW }} />
              <button onClick={() => { const v = draft.trim(); if (v) { onAddCustom(v); setDraft(''); } }} className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-90" style={{ background: draft.trim() ? CORAL : '#EAE3DB' }}><Plus size={18} color={draft.trim() ? '#FFF' : TERT} strokeWidth={2.4} /></button>
            </div>
          )}
          <button onClick={onClose} className="w-full py-3.5 rounded-[16px] active:scale-[0.98]" style={{ background: CORAL, boxShadow: '0 6px 18px rgba(232,93,42,0.26)' }}><span className="text-[15px] font-bold text-white">Done</span></button>
        </div>
      )}>
      <div className="overflow-y-auto px-5 pb-4" style={{ scrollbarWidth: 'none' }}>
        <div className="rounded-[16px] bg-white overflow-hidden" style={{ boxShadow: CARD_SHADOW }}>
          {all.map((o, i) => {
            const on = values.includes(o);
            return (
              <button key={o} onClick={() => single ? onPick(o) : onToggle(o)} className="relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.02]">
                <span className="flex-1 text-[15px] font-semibold" style={{ color: INK }}>{o}</span>
                <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0" style={{ background: on ? CORAL : 'transparent', border: on ? 'none' : '1.6px solid #DDD4C9' }}>{on && <Check size={13} color="#FFF" strokeWidth={3} />}</span>
                {i < all.length - 1 && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: '#F1EDE8' }} />}
              </button>
            );
          })}
        </div>
      </div>
    </Sheet>
  );
};

const AddPet = () => {
  const [step, setStep] = useState(0);
  const [sheet, setSheet] = useState(null);
  const [data, setData] = useState({
    species: 'dog', sex: 'male', neutered: 'yes', ageUnit: 'years', ageValue: 2, dobKnown: false,
    weightUnit: 'kg', weightApprox: false, isMix: false, temperament: [], triggers: [], goodWith: [], allergies: [], vaccines: [], meds: [], mealsPerDay: 2,
  });
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const toggle = (k, v) => setData((d) => ({ ...d, [k]: d[k].includes(v) ? d[k].filter((x) => x !== v) : [...d[k], v] }));
  const addCustom = (k, v) => setData((d) => ({ ...d, [k]: d[k].includes(v) ? d[k] : [...d[k], v] }));
  const exit = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };
  const name = (data.name || '').trim();

  const TOTAL = STEPS.length;
  const cfg = STEPS[step];
  const back = () => { if (step === 0) return exit(); setStep((s) => s - 1); };
  const next = () => { if (step === TOTAL - 1) return setStep('done'); setStep((s) => s + 1); };
  const valid = step === 0 ? !!(name && data.species && (data.species !== 'other' || (data.otherType || '').trim())) : true;
  const isLast = step === TOTAL - 1;
  const headline = typeof cfg?.title === 'function' ? cfg.title(name || 'your pet') : cfg?.title;
  const hasChip = step > 0 && !!name;
  const vaccineOpts = VACCINES[data.species] || VACCINES._;
  const summary = (arr) => arr && arr.length ? arr.join(', ') : '';
  const openSelect = (key, title, options, opts = {}) => setSheet({ kind: 'select', key, title, options, ...opts });

  const styleBlock = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes apStep { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: translateX(0); } }
      .ap-step { animation: apStep 0.3s cubic-bezier(0.22,1,0.36,1) both; }
      @keyframes apSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
      @keyframes apFade { from { opacity: 0; } to { opacity: 1; } }
      @keyframes apAvatar { 0% { opacity: 0; transform: scale(0.3); } 62% { transform: scale(1.09); } 100% { opacity: 1; transform: scale(1); } }
      @keyframes apRingOut { 0% { transform: scale(0.55); opacity: 0.55; } 100% { transform: scale(2.5); opacity: 0; } }
      @keyframes apConfetti { 0% { opacity: 0; transform: translate(0,0) scale(0.2); } 22% { opacity: 1; } 100% { opacity: 0; transform: translate(var(--dx), var(--dy)) scale(1); } }
      @keyframes apBadge { 0% { opacity: 0; transform: scale(0); } 70% { transform: scale(1.25); } 100% { opacity: 1; transform: scale(1); } }
      @keyframes apRise { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      .ap-rise { animation: apRise 0.5s 0.35s cubic-bezier(0.22,1,0.36,1) both; }
    `}</style>
  );

  const frame = (child) => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
        <StatusBar />
        {child}
      </div>
    </div>
  );

  if (step === 'done') {
    return (<>{styleBlock}{frame(
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8" style={{ background: CREAM }}>
        <div className="relative mb-7" style={{ width: 132, height: 132 }}>
          <span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${CORAL}`, animation: 'apRingOut 1.4s 0.15s ease-out both' }} />
          <span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${CORAL}`, animation: 'apRingOut 1.4s 0.45s ease-out both' }} />
          {CONFETTI.map((p, i) => (
            <span key={i} className="absolute top-1/2 left-1/2 rounded-full" style={{ width: 8, height: 8, marginLeft: -4, marginTop: -4, background: p.c, '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, animation: `apConfetti 0.9s ${p.d + 200}ms cubic-bezier(0.22,1,0.36,1) both` }} />
          ))}
          <span className="absolute inset-0 rounded-full overflow-hidden flex items-center justify-center" style={{ background: data.photo ? 'transparent' : CORAL, boxShadow: '0 12px 30px rgba(232,93,42,0.3)', animation: 'apAvatar 0.6s cubic-bezier(0.34,1.56,0.64,1) both' }}>
            {data.photo ? <img src={DOG_PHOTO} alt="" className="w-full h-full object-cover" /> : <span className="text-[44px] font-extrabold text-white">{(name[0] || 'P').toUpperCase()}</span>}
          </span>
          <span className="absolute -bottom-1 -right-1 w-11 h-11 rounded-full flex items-center justify-center border-[3px] border-[#F7F5F2]" style={{ background: GREEN, animation: 'apBadge 0.45s 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}><Check size={22} color="#FFFFFF" strokeWidth={3} /></span>
        </div>
        <h1 className="ap-rise text-[27px] font-extrabold text-[#111] tracking-[-0.02em]">Welcome, {name || 'little one'}!</h1>
        <p className="ap-rise text-[14px] text-[#6E6058] mt-2.5 leading-[1.5] max-w-[280px]">{name || 'Your pet'}'s profile is ready. Your walkers, sitters and vet can now see everything they need.</p>
        <button onClick={exit} className="ap-rise w-full mt-8 py-4 rounded-[18px] active:scale-[0.98] transition-transform" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.3)' }}><span className="text-[15px] font-bold text-white">See {name || 'their'} profile</span></button>
      </div>
    )}</>);
  }

  return (<>{styleBlock}{frame(
    <div className="absolute inset-0" style={{ background: CREAM }}>
      {/* Scrolling content — runs behind header & footer */}
      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden px-6" style={{ scrollbarWidth: 'none', paddingTop: hasChip ? 132 : 100, paddingBottom: 104 }}>
        <div key={step} className="ap-step">
          <h1 className="text-[26px] font-extrabold text-[#111] tracking-[-0.03em] leading-[1.1]">{headline}</h1>
          <p className="text-[14px] mt-2 leading-[1.45]" style={{ color: TERT }}>{cfg.sub}</p>

          {/* STEP 0 — IDENTITY */}
          {cfg.id === 'identity' && (
            <div className="mt-7 flex flex-col items-center">
              <button onClick={() => set('photo', data.photo ? null : 'mock')} className="relative active:scale-[0.97] transition-transform">
                <span className="w-[100px] h-[100px] rounded-full flex items-center justify-center overflow-hidden" style={{ background: '#FFFFFF', boxShadow: CARD_SHADOW }}>
                  {data.photo ? <img src={DOG_PHOTO} alt="" className="w-full h-full object-cover" /> : <Camera size={28} color={TERT} strokeWidth={1.8} />}
                </span>
                <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-[#F7F5F2]" style={{ background: CORAL }}><Plus size={15} color="#FFFFFF" strokeWidth={2.8} /></span>
              </button>
              <input value={data.name || ''} onChange={(e) => set('name', e.target.value)} placeholder="Pet's name" autoFocus
                className="mt-4 w-full text-center bg-transparent outline-none text-[24px] font-extrabold text-[#111] tracking-[-0.02em] placeholder:text-[#CBC0B4] placeholder:font-bold" />
              <div className="grid grid-cols-3 gap-2 w-full mt-6">
                {SPECIES.map((s) => {
                  const on = data.species === s.id;
                  return (
                    <button key={s.id} onClick={() => { set('species', s.id); set('breed', ''); set('breedMix1', ''); set('breedMix2', ''); }} className="h-[46px] rounded-[12px] text-[14px] font-bold transition-all active:scale-[0.97]"
                      style={{ background: on ? '#FFF3EC' : '#FFFFFF', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : CARD_SHADOW }}>{s.label}</button>
                  );
                })}
              </div>
              {data.species === 'other' && (
                <div className="w-full mt-3"><RowInput value={data.otherType} onChange={(v) => set('otherType', v)} placeholder="What kind of pet?" /></div>
              )}
            </div>
          )}

          {/* STEP 1 — BREED */}
          {cfg.id === 'breed' && (
            <div className="mt-7 flex flex-col gap-5">
              <Segmented options={[{ id: false, label: 'Purebred' }, { id: true, label: 'Mixed' }]} value={data.isMix} onChange={(v) => set('isMix', v)} />
              {!data.isMix ? (
                <div><Label>Breed</Label><SelectRow value={data.breed} placeholder="Select breed" onClick={() => setSheet({ kind: 'breed', slot: 'single' })} /></div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div><Label>Breed 1</Label><SelectRow value={data.breedMix1} placeholder="Select first breed" onClick={() => setSheet({ kind: 'breed', slot: 'mix1' })} /></div>
                  <div><Label>Breed 2</Label><SelectRow value={data.breedMix2} placeholder="Select second breed" onClick={() => setSheet({ kind: 'breed', slot: 'mix2' })} /></div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2 — ABOUT */}
          {cfg.id === 'about' && (
            <div className="mt-7 flex flex-col gap-6">
              <div><Label>Sex</Label><Segmented options={[{ id: 'male', label: 'Male' }, { id: 'female', label: 'Female' }]} value={data.sex} onChange={(v) => set('sex', v)} /></div>
              <div>
                <Label>Age</Label>
                {!data.dobKnown ? (
                  <>
                    <div className="mb-2.5"><Segmented small options={[{ id: 'months', label: 'Months' }, { id: 'years', label: 'Years' }]} value={data.ageUnit} onChange={(v) => set('ageUnit', v)} /></div>
                    <Stepper value={data.ageValue} onChange={(v) => set('ageValue', v)} min={0} max={data.ageUnit === 'months' ? 23 : 30} unit={data.ageUnit === 'months' ? 'months' : (data.ageValue === 1 ? 'year' : 'years')} />
                    <button onClick={() => set('dobKnown', true)} className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-bold active:opacity-70" style={{ color: CORAL }}><Calendar size={14} strokeWidth={2.2} /> I know the exact date of birth</button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div className="rounded-[12px] bg-white px-3 h-[48px] flex items-center" style={{ boxShadow: CARD_SHADOW }}><select value={data.dobMonth ?? ''} onChange={(e) => set('dobMonth', e.target.value)} className="w-full bg-transparent outline-none text-[14px] font-semibold text-[#111]" style={{ appearance: 'none' }}><option value="" disabled>Month</option>{MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}</select></div>
                      <div className="rounded-[12px] bg-white px-3 h-[48px] flex items-center" style={{ boxShadow: CARD_SHADOW }}><select value={data.dobYear ?? ''} onChange={(e) => set('dobYear', e.target.value)} className="w-full bg-transparent outline-none text-[14px] font-semibold text-[#111]" style={{ appearance: 'none' }}><option value="" disabled>Year</option>{YEARS.map((y) => <option key={y} value={y}>{y}</option>)}</select></div>
                    </div>
                    <button onClick={() => set('dobKnown', false)} className="text-[12.5px] font-bold shrink-0" style={{ color: TERT }}>Use age</button>
                  </div>
                )}
              </div>
              <div>
                <Label>Weight</Label>
                <div className="flex items-center gap-1 bg-white rounded-[12px] px-4 h-[52px]" style={{ boxShadow: CARD_SHADOW }}>
                  <span className="text-[18px] font-bold shrink-0 w-3 text-center" style={{ color: TERT, opacity: data.weightApprox ? 1 : 0 }}>~</span>
                  <input value={data.weight || ''} onChange={(e) => set('weight', e.target.value.replace(/[^\d.]/g, ''))} placeholder="0" inputMode="decimal" className="flex-1 min-w-0 bg-transparent outline-none text-[18px] font-bold text-[#111] placeholder:text-[#CBC0B4] placeholder:font-medium" />
                  <span className="text-[14px] font-bold shrink-0" style={{ color: MUTED }}>{data.weightUnit}</span>
                </div>
                <div className="mt-2.5"><Segmented small options={[{ id: 'kg', label: 'kg' }, { id: 'lb', label: 'lb' }]} value={data.weightUnit} onChange={(v) => set('weightUnit', v)} /></div>
                <button onClick={() => set('weightApprox', !data.weightApprox)} className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-bold active:opacity-70" style={{ color: data.weightApprox ? CORAL : TERT }}>
                  <span className="w-4 h-4 rounded-[5px] flex items-center justify-center" style={{ background: data.weightApprox ? CORAL : '#FFF', boxShadow: data.weightApprox ? 'none' : CARD_SHADOW }}>{data.weightApprox && <Check size={11} color="#FFF" strokeWidth={3.5} />}</span>
                  Approximate weight (±)
                </button>
              </div>
              <div><Label>Color</Label><SelectRow value={data.color} placeholder="Choose a color" onClick={() => openSelect('color', 'Color', COLORS, { single: true })} /></div>
              <div>
                <Label>Microchip</Label>
                {!data.noChip ? <BigInput value={data.microchip} onChange={(v) => set('microchip', v)} placeholder="15-digit number" inputMode="numeric" /> : <div className="text-[14px] font-medium px-1 py-2" style={{ color: TERT }}>Not microchipped</div>}
                <p className="text-[11.5px] leading-[1.4] mt-2" style={{ color: TERT }}>The unique 15-digit ID from your pet's implanted chip. Ask your vet if unsure.</p>
                <button onClick={() => set('noChip', !data.noChip)} className="mt-1.5 text-[12.5px] font-bold active:opacity-70" style={{ color: data.noChip ? CORAL : TERT }}>{data.noChip ? 'Add a microchip number' : "My pet isn't microchipped"}</button>
              </div>
            </div>
          )}

          {/* STEP 3 — PERSONALITY */}
          {cfg.id === 'personality' && (
            <div className="mt-7 flex flex-col gap-5">
              <div><Label>Temperament</Label><SelectRow value={summary(data.temperament)} placeholder="Add traits" onClick={() => openSelect('temperament', 'Temperament', TEMPERAMENT, { custom: true })} /></div>
              <div><Label>Anxiety triggers</Label><SelectRow value={summary(data.triggers)} placeholder="Add triggers" onClick={() => openSelect('triggers', 'Anxiety triggers', TRIGGERS, { custom: true })} /></div>
              <div><Label>Good with</Label><SelectRow value={summary(data.goodWith)} placeholder="Select" onClick={() => openSelect('goodWith', 'Good with', GOODWITH)} /></div>
            </div>
          )}

          {/* STEP 4 — DAILY CARE */}
          {cfg.id === 'care' && (
            <div className="mt-7 flex flex-col gap-5">
              <div><Label>Food brand</Label><RowInput value={data.foodBrand} onChange={(v) => set('foodBrand', v)} placeholder="e.g. Royal Canin Adult" /></div>
              <div><Label>Meals per day</Label><Stepper value={data.mealsPerDay} onChange={(v) => set('mealsPerDay', v)} min={1} max={6} unit={data.mealsPerDay === 1 ? 'meal' : 'meals'} /></div>
              <div><Label>Favorite treats</Label><RowInput value={data.treats} onChange={(v) => set('treats', v)} placeholder="e.g. Salmon bites, peanut butter" /></div>
              <div><Label>Favorite toys</Label><RowInput value={data.toys} onChange={(v) => set('toys', v)} placeholder="e.g. Tennis ball, squeaky duck" /></div>
              <div><Label>Sleeping spot</Label><RowInput value={data.sleeping} onChange={(v) => set('sleeping', v)} placeholder="e.g. Crate, foot of the bed" /></div>
              <div><Label>Walking habits</Label><RowInput value={data.walking} onChange={(v) => set('walking', v)} placeholder="e.g. 2× daily, loves the forest" /></div>
            </div>
          )}

          {/* STEP 5 — HEALTH */}
          {cfg.id === 'health' && (
            <div className="mt-7 flex flex-col gap-5">
              <div><Label>Allergies</Label><SelectRow value={summary(data.allergies)} placeholder="Add allergies" onClick={() => openSelect('allergies', 'Allergies', ALLERGIES, { custom: true })} /></div>
              <div><Label>Vaccines</Label><SelectRow value={summary(data.vaccines)} placeholder="Add vaccines" onClick={() => openSelect('vaccines', 'Vaccines', vaccineOpts, { custom: true })} /></div>
              <div><Label>Medications</Label><SelectRow value={summary(data.meds)} placeholder="Add medications" onClick={() => openSelect('meds', 'Medications', MEDS, { custom: true })} /></div>
              <p className="text-[11.5px] leading-[1.4]" style={{ color: TERT }}>Dosages, dates & severity can be set on the profile after adding {name || 'your pet'}.</p>
            </div>
          )}

          {/* STEP 6 — CARE TEAM & NOTES */}
          {cfg.id === 'team' && (
            <div className="mt-7 flex flex-col gap-5">
              <div><Label>Primary vet</Label><div className="flex flex-col gap-2"><RowInput value={data.vetClinic} onChange={(v) => set('vetClinic', v)} placeholder="Clinic / vet name" /><RowInput value={data.vetPhone} onChange={(v) => set('vetPhone', v)} placeholder="Phone" inputMode="tel" /></div></div>
              <div><Label>Emergency contact</Label><div className="flex flex-col gap-2"><RowInput value={data.ecName} onChange={(v) => set('ecName', v)} placeholder="Name" /><RowInput value={data.ecPhone} onChange={(v) => set('ecPhone', v)} placeholder="Phone" inputMode="tel" /></div></div>
              <div><Label>Notes for a sitter</Label><textarea value={data.notes || ''} onChange={(e) => set('notes', e.target.value)} placeholder="Anything a walker or sitter should know…" rows={4} className="w-full bg-white rounded-[12px] px-4 py-3 outline-none text-[15px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal resize-none" style={{ boxShadow: CARD_SHADOW }} /></div>
            </div>
          )}
        </div>
      </div>

      {/* Header — gradient-fade, content scrolls behind */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 62%, rgba(247,245,242,0) 100%)', paddingTop: 56, paddingBottom: 16 }}>
        <div className="px-5 flex items-center gap-3 pointer-events-auto">
          <button onClick={back} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0 bg-white" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
          <div className="flex-1 flex gap-1">{STEPS.map((_, i) => (<div key={i} className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: '#EAE3DB' }}><div className="h-full rounded-full transition-all duration-[400ms]" style={{ width: i <= step ? '100%' : '0%', background: CORAL }} /></div>))}</div>
          {cfg.skip ? <button onClick={next} className="text-[13px] font-bold shrink-0 w-10 text-right" style={{ color: TERT }}>Skip</button> : <span className="shrink-0 w-10 text-right text-[12px] font-bold" style={{ color: TERT }}>{step + 1}/{TOTAL}</span>}
        </div>
        {hasChip && (
          <div className="px-5 pt-2.5 flex justify-center pointer-events-auto">
            <div className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full bg-white" style={{ boxShadow: CARD_SHADOW }}>
              <span className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center shrink-0" style={{ background: data.photo ? 'transparent' : PEACH }}>{data.photo ? <img src={DOG_PHOTO} alt="" className="w-full h-full object-cover" /> : <span className="text-[11px] font-extrabold" style={{ color: CORAL }}>{name[0].toUpperCase()}</span>}</span>
              <span className="text-[13px] font-bold" style={{ color: INK }}>{name}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA — gradient-fade, content scrolls behind */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 pb-8 pointer-events-none" style={{ background: 'linear-gradient(to top, #F7F5F2 0%, #F7F5F2 55%, rgba(247,245,242,0) 100%)', paddingTop: 28 }}>
        <button onClick={() => valid && next()} disabled={!valid} className="w-full py-4 rounded-[18px] transition-all active:scale-[0.98] pointer-events-auto" style={{ background: valid ? CORAL : '#EAE3DB', boxShadow: valid ? '0 8px 22px rgba(232,93,42,0.28)' : 'none' }}>
          <span className="text-[15.5px] font-bold" style={{ color: valid ? '#FFFFFF' : TERT }}>{isLast ? `Add ${name || 'pet'}` : 'Continue'}</span>
        </button>
      </div>

      {/* Sheets */}
      {sheet?.kind === 'breed' && <BreedPicker species={data.species} onClose={() => setSheet(null)} onPick={(b) => { set(sheet.slot === 'single' ? 'breed' : sheet.slot === 'mix1' ? 'breedMix1' : 'breedMix2', b); setSheet(null); }} />}
      {sheet?.kind === 'select' && <OptionSheet title={sheet.title} options={sheet.options} single={sheet.single} custom={sheet.custom} values={sheet.single ? (data[sheet.key] ? [data[sheet.key]] : []) : data[sheet.key]} onToggle={(v) => toggle(sheet.key, v)} onPick={(v) => { set(sheet.key, v); setSheet(null); }} onAddCustom={(v) => addCustom(sheet.key, v)} onClose={() => setSheet(null)} />}
    </div>
  )}</>);
};

export default AddPet;
