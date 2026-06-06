import React, { useState, useMemo } from 'react';
import {
  ChevronLeft, ArrowRight, Check, Plus, Minus, X, Camera, Home, MapPin,
  Shield, ScanFace, FileText, Sparkles, Star, PawPrint, Dog, Cat, Pill,
  Zap, Building2, Globe, BadgeCheck,
} from 'lucide-react';

/**
 * 50_PRO_REGISTRATION_v1.jsx — "Earn with fylos"
 * LIVE PROFILE BUILDER. The top of the screen is a real provider profile
 * card that fills in as you answer the questions in the sheet below — you
 * watch your profile come alive. The card replaces a separate review step.
 *
 * `embedded` renders an in-dashboard overlay; `onExit` closes it.
 */

// ─── Tokens ─────────────────────────────────────────────────────────
const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#A09A94';
const GREEN = '#3F8D63';
const SEL_BG = '#FFF3EC';
const SEL_RING = `inset 0 0 0 1.5px ${CORAL}`;
const CARD = 'inset 0 0 0 1px #EDE8E2, 0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.04)';

// ─── Option data ────────────────────────────────────────────────────
const ROLES = [
  { id: 'walker', label: 'Walker', desc: 'Walks & exercise', icon: PawPrint },
  { id: 'sitter', label: 'Sitter', desc: 'Drop-ins, day care, overnights', icon: Home },
  { id: 'both', label: 'Both', desc: 'Walking and sitting', icon: Star },
];
const SERVICES_ALL = [
  { id: 'solo', label: 'Solo walks', desc: 'One household at a time', kind: 'walk' },
  { id: 'group', label: 'Group walks', desc: 'A few dogs together', kind: 'walk' },
  { id: 'dropin', label: 'Drop-in visits', desc: 'Short check-ins', kind: 'sit' },
  { id: 'daycare', label: 'Day care', desc: 'They stay at your place', kind: 'sit' },
  { id: 'overnight', label: 'Overnight', desc: 'They board with you', kind: 'sit' },
];
const RATE_META = {
  solo: { label: '30-min solo walk', suggested: 25 },
  group: { label: '60-min group walk', suggested: 30 },
  dropin: { label: '30-min drop-in', suggested: 28 },
  daycare: { label: 'Day care / day', suggested: 55 },
  overnight: { label: 'Overnight / night', suggested: 75 },
};
const PET_TYPES = [{ id: 'dogs', label: 'Dogs', desc: 'All good boys & girls', icon: Dog }, { id: 'cats', label: 'Cats', desc: 'The independent type', icon: Cat }];
const PET_SIZES = [{ id: 's', label: 'Small', sub: '0–10 kg' }, { id: 'm', label: 'Medium', sub: '10–25 kg' }, { id: 'l', label: 'Large', sub: '25–45 kg' }, { id: 'xl', label: 'Giant', sub: '45 kg+' }];
const PET_AGES = [{ id: 'puppy', label: 'Puppies', sub: '< 1 yr' }, { id: 'adult', label: 'Adults', sub: '1–8 yrs' }, { id: 'senior', label: 'Seniors', sub: '8 yrs+' }];
const SPECIAL_NEEDS = [{ id: 'meds', label: 'Needs meds' }, { id: 'reactive', label: 'Reactive / anxious' }, { id: 'diet', label: 'Special diet' }, { id: 'mobility', label: 'Limited mobility' }, { id: 'postop', label: 'Post-surgery' }];
const EXPERIENCE = [{ id: '<1', label: 'Just starting out', desc: 'Under a year' }, { id: '1-3', label: 'A few years in', desc: '1–3 years' }, { id: '3-5', label: 'Pretty seasoned', desc: '3–5 years' }, { id: '5+', label: 'A true pro', desc: '5+ years' }];
const HOME_TYPES = [{ id: 'apartment', label: 'Apartment', icon: Building2 }, { id: 'house', label: 'House', icon: Home }];
const PLACE_FEATURES = [{ id: 'garden', label: 'Garden / yard' }, { id: 'furniture', label: 'Pets on furniture' }, { id: 'otherpets', label: 'Other pets' }, { id: 'kids', label: 'Kids at home' }, { id: 'smokefree', label: 'Smoke-free' }];
const LANGUAGES = [{ id: 'de', label: 'German' }, { id: 'fr', label: 'French' }, { id: 'it', label: 'Italian' }, { id: 'en', label: 'English' }, { id: 'es', label: 'Spanish' }, { id: 'pt', label: 'Portuguese' }];
const DAYS = [{ id: 'mon', label: 'M' }, { id: 'tue', label: 'T' }, { id: 'wed', label: 'W' }, { id: 'thu', label: 'T' }, { id: 'fri', label: 'F' }, { id: 'sat', label: 'S' }, { id: 'sun', label: 'S' }];
const TIME_SLOTS = [{ id: 'morning', label: 'Morning', sub: '6–12' }, { id: 'afternoon', label: 'Afternoon', sub: '12–17' }, { id: 'evening', label: 'Evening', sub: '17–22' }, { id: 'overnight', label: 'Overnight', sub: '22–6' }];
const BOOKING_STYLES = [{ id: 'instant', label: 'Instant book', desc: 'Owners book directly', icon: Zap }, { id: 'request', label: 'Review requests', desc: 'You approve each one', icon: Check }];
const CANCELLATION = [{ id: 'flexible', label: 'Flexible', desc: 'Full refund up to 24h before' }, { id: 'moderate', label: 'Moderate', desc: 'Full refund up to 3 days' }, { id: 'strict', label: 'Strict', desc: '50% up to 1 week before' }];
const MEDS = [{ id: 'oral', label: 'Oral meds', desc: 'Pills, drops, food-mixed' }, { id: 'injected', label: 'Injections', desc: 'Insulin and similar' }];
const SAFETY_ITEMS = [
  { id: 'leash', text: 'I keep dogs leashed unless the owner approves off-leash.' },
  { id: 'heat', text: 'I never leave a pet alone in a vehicle.' },
  { id: 'emergency', text: 'In an emergency I call the owner and nearest vet right away.' },
  { id: 'meds', text: 'I only give medication exactly as instructed.' },
  { id: 'honest', text: 'I only accept bookings I can handle safely.' },
];

// `focus` tells the live card which region to highlight for this question.
const QUESTIONS = [
  { id: 'role', kind: 'single', key: 'role', section: 'Services', focus: 'tags', q: 'What do you offer?', help: 'Decides where you show up in search.', options: ROLES },
  { id: 'services', kind: 'multi', key: 'services', section: 'Services', focus: 'price', q: 'Which services?', help: 'Pick all you want to offer.', options: (d) => SERVICES_ALL.filter((s) => d.role === 'both' || (d.role === 'walker' && s.kind === 'walk') || (d.role === 'sitter' && s.kind === 'sit')) },
  { id: 'petTypes', kind: 'tiles', multi: true, key: 'petTypes', section: 'Pets', focus: 'tags', q: 'Which pets?', help: 'Owners filter by this first.', options: PET_TYPES },
  { id: 'petSizes', kind: 'grid', key: 'petSizes', section: 'Pets', focus: 'tags', q: 'What sizes?', help: 'Be honest. It means better matches.', options: PET_SIZES, cols: 2 },
  { id: 'petAges', kind: 'grid', key: 'petAges', section: 'Pets', focus: 'tags', q: 'And which ages?', options: PET_AGES, cols: 3 },
  { id: 'special', kind: 'chips', key: 'specialNeeds', section: 'Pets', focus: 'tags', q: 'Any special needs you handle?', help: 'Optional, but it sets you apart.', options: SPECIAL_NEEDS, optional: true },
  { id: 'experience', kind: 'single', key: 'experience', section: 'Experience', focus: 'rating', q: 'How long with pets?', options: EXPERIENCE },
  { id: 'meds', kind: 'multi', key: 'medsCaps', section: 'Experience', focus: 'tags', q: 'Comfortable giving meds?', help: 'Optional. Medical-needs owners search for this.', options: MEDS, optional: true },
  { id: 'homeType', kind: 'tiles', key: 'homeType', section: 'Your place', focus: 'tags', q: "What's your home like?", options: HOME_TYPES, condition: (d) => (d.services || []).some((s) => s === 'daycare' || s === 'overnight') },
  { id: 'place', kind: 'chips', key: 'placeFeatures', section: 'Your place', focus: 'tags', q: 'A few things about your place', help: 'Optional.', options: PLACE_FEATURES, optional: true, condition: (d) => (d.services || []).some((s) => s === 'daycare' || s === 'overnight') },
  { id: 'name', kind: 'twoText', keys: ['firstName', 'lastName'], section: 'Profile', focus: 'name', q: "What's your name?", help: 'As it appears on your ID.', placeholders: ['First name', 'Last name'] },
  { id: 'photo', kind: 'photo', key: 'photo', section: 'Profile', focus: 'photo', q: 'Add a profile photo', help: 'A clear, friendly face works best.' },
  { id: 'headline', kind: 'text', key: 'headline', section: 'Profile', focus: 'headline', q: 'Write a short headline', help: 'One line owners see under your name.', placeholder: 'Calm, reliable walks in Seefeld' },
  { id: 'city', kind: 'text', key: 'city', section: 'Profile', focus: 'location', q: 'Which city?', placeholder: 'Zürich', icon: MapPin },
  { id: 'languages', kind: 'chips', key: 'languages', section: 'Profile', focus: 'location', q: 'Languages you speak?', options: LANGUAGES },
  { id: 'bio', kind: 'textarea', key: 'bio', section: 'Profile', focus: 'headline', q: 'Tell owners about you', help: 'A few warm lines.', placeholder: 'I grew up with dogs and…', max: 300 },
  { id: 'days', kind: 'days', key: 'days', section: 'Availability', focus: null, q: 'Which days are you free?' },
  { id: 'times', kind: 'grid', key: 'timeSlots', section: 'Availability', focus: null, q: 'What times work?', options: TIME_SLOTS, cols: 2 },
  { id: 'radius', kind: 'radius', key: 'travelRadius', section: 'Availability', focus: 'location', q: 'How far will you travel?' },
  { id: 'rates', kind: 'rates', key: 'rates', section: 'Pricing', focus: 'price', q: 'Set your rates', help: 'Change these any time.' },
  { id: 'booking', kind: 'tiles', key: 'bookingStyle', section: 'Pricing', focus: null, q: 'How do owners book you?', options: BOOKING_STYLES },
  { id: 'cancellation', kind: 'single', key: 'cancellation', section: 'Pricing', focus: null, q: 'Cancellation policy?', options: CANCELLATION },
  { id: 'safety', kind: 'safety', key: 'safetyAck', section: 'Safety', focus: null, q: 'A few safety promises', help: 'Every fylos pro agrees to these.' },
  { id: 'verify', kind: 'twoText', keys: ['dob', 'phone'], section: 'Verify', focus: 'verified', q: "Let's verify you", help: 'You must be 18+. We text a code.', placeholders: ['Date of birth', 'Phone number'] },
  { id: 'address', kind: 'twoText', keys: ['street', 'postcode'], section: 'Verify', focus: 'verified', q: 'Your home address', help: 'Private — only for verification.', placeholders: ['Street and number', 'Postcode'] },
  { id: 'uploads', kind: 'uploads', section: 'Verify', focus: 'verified', q: 'Upload ID & a selfie', help: 'Encrypted, never on your profile.' },
  { id: 'consents', kind: 'consents', section: 'Verify', focus: 'verified', q: 'One last step' },
];

const letterFor = (i) => String.fromCharCode(65 + i);

// ─── Live profile card (the hero that builds as you answer) ──────────
const Skel = ({ w = '60%', h = 12 }) => (
  <span className="inline-block rounded-full align-middle" style={{ width: w, height: h, background: 'linear-gradient(90deg,#ECE6DE,#F3EEE8,#ECE6DE)' }} />
);

const LiveProfileCard = ({ data, focus }) => {
  const ids = data.services || [];
  const prices = ids.map((id) => Number((data.rates || {})[id] || (RATE_META[id] || {}).suggested || 0)).filter(Boolean);
  const from = prices.length ? Math.min(...prices) : null;
  const langs = (data.languages || []).map((id) => (LANGUAGES.find((l) => l.id === id) || {}).label);
  const tags = [];
  if (data.role && data.role !== 'sitter') tags.push('Walks');
  if (data.role && data.role !== 'walker') tags.push('Sitting');
  (data.petTypes || []).forEach((t) => tags.push(t === 'dogs' ? 'Dogs' : 'Cats'));
  const verified = data.idUploaded && data.selfieUploaded;
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ');
  const ring = (k) => (focus === k ? { boxShadow: '0 0 0 2.5px rgba(232,93,42,0.5)', borderRadius: 12 } : undefined);

  return (
    <div className="rounded-[22px] overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 10px 26px rgba(60,30,15,0.10), inset 0 0 0 1px #EDE8E2' }}>
      {/* Photo banner */}
      <div className="relative" style={{ height: 120, background: PEACH, ...(focus === 'photo' ? { boxShadow: 'inset 0 0 0 2.5px rgba(232,93,42,0.5)' } : {}) }}>
        {data.photo
          ? <img src="https://i.pravatar.cc/420?u=fylospro" alt="" className="w-full h-full object-cover fy-pop" />
          : <div className="w-full h-full flex flex-col items-center justify-center gap-1"><Camera size={24} className="text-[#C4B8AC]" strokeWidth={1.8} /></div>}
        {from != null && <span className="fy-pop absolute bottom-2.5 right-2.5 text-[12px] font-extrabold text-[#111] bg-white px-2.5 py-1 rounded-full" style={{ boxShadow: '0 2px 8px rgba(60,30,15,0.14)', ...ring('price') }}>from CHF {from}</span>}
      </div>
      {/* Info */}
      <div className="px-4 py-3.5">
        <div className="flex items-center gap-1.5" style={ring('name')}>
          {name ? <h3 className="fy-pop text-[17px] font-extrabold text-[#111] leading-tight">{name}</h3> : <Skel w="120px" h={16} />}
          {verified && <BadgeCheck className="fy-pop" size={17} style={{ color: CORAL }} strokeWidth={2.4} />}
        </div>
        <div className="mt-1.5" style={ring('headline')}>
          {data.headline
            ? <p className="fy-pop text-[12.5px] text-[#6E6058] leading-snug">{data.headline}</p>
            : (data.role ? <p className="text-[12.5px] text-[#A09A94] leading-snug">{data.role === 'both' ? 'Walker & sitter' : data.role === 'sitter' ? 'Pet sitter' : 'Dog walker'}{data.city ? ` · ${data.city}` : ''}</p> : <Skel w="80%" h={11} />)}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-[11.5px] text-[#A09A94]" style={ring(focus === 'rating' ? 'rating' : focus === 'location' ? 'location' : null)}>
          <span className="inline-flex items-center gap-1"><Star size={12} className="fill-[#E85D2A] text-[#E85D2A]" /><span className="font-bold text-[#111]">New</span></span>
          <span>·</span>
          <span className="inline-flex items-center gap-1"><MapPin size={11} strokeWidth={2} />{data.city || 'Your area'}</span>
          {langs.length > 0 && <><span>·</span><span className="fy-pop truncate">{langs.slice(0, 2).join(' / ')}</span></>}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2.5 min-h-[24px]" style={ring('tags')}>
          {tags.length > 0
            ? tags.map((t) => <span key={t} className="fy-pop text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: '#FFEDE3', color: '#B85A26' }}>{t}</span>)
            : <><Skel w="54px" h={20} /><Skel w="44px" h={20} /></>}
        </div>
      </div>
    </div>
  );
};

// ─── Compact answer renderer (lives in the bottom sheet) ────────────
const Row = ({ letter, active, onClick, title, desc, single, check }) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[15px] text-left transition-all active:scale-[0.99]"
    style={{ background: active ? SEL_BG : '#FFFFFF', boxShadow: active ? SEL_RING : CARD }}>
    <span className="w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 text-[12.5px] font-extrabold" style={{ background: active ? CORAL : '#FBEEE6', color: active ? '#FFFFFF' : CORAL }}>
      {(check && active) ? <Check size={15} color="#FFFFFF" strokeWidth={3} /> : letter}
    </span>
    <div className="flex-1 min-w-0">
      <div className="text-[15px] font-bold text-[#111] leading-tight">{title}</div>
      {desc && <div className="text-[12px] text-[#A09A94] mt-0.5 truncate">{desc}</div>}
    </div>
    {single && <ArrowRight size={15} className="shrink-0" color={active ? CORAL : '#D2C7BA'} strokeWidth={2.4} />}
  </button>
);

const BigInput = ({ value, onChange, placeholder, icon: Icon, autoFocus }) => (
  <div className="flex items-center gap-2.5 border-b-2 pb-2" style={{ borderColor: '#E0D8CF' }}>
    {Icon && <Icon size={18} className="text-[#A09A94] shrink-0" strokeWidth={2} />}
    <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus}
      className="flex-1 bg-transparent outline-none text-[18px] font-semibold text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" />
  </div>
);

const QuestionBody = ({ q, data, set, advance }) => {
  const toggle = (key, id) => { const arr = data[key] || []; set(key, arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]); };
  switch (q.kind) {
    case 'single': {
      const opts = typeof q.options === 'function' ? q.options(data) : q.options;
      return <div className="flex flex-col gap-2">{opts.map((o, i) => <Row key={o.id} single letter={letterFor(i)} active={data[q.key] === o.id} title={o.label} desc={o.desc} onClick={() => { set(q.key, o.id); advance(); }} />)}</div>;
    }
    case 'multi': {
      const opts = typeof q.options === 'function' ? q.options(data) : q.options;
      return <div className="flex flex-col gap-2">{opts.map((o, i) => <Row key={o.id} check letter={letterFor(i)} active={(data[q.key] || []).includes(o.id)} title={o.label} desc={o.desc} onClick={() => toggle(q.key, o.id)} />)}</div>;
    }
    case 'tiles':
      return (
        <div className="grid grid-cols-2 gap-2.5">
          {q.options.map((o) => {
            const active = q.multi ? (data[q.key] || []).includes(o.id) : data[q.key] === o.id;
            const Icon = o.icon || PawPrint;
            return (
              <button key={o.id} onClick={() => (q.multi ? toggle(q.key, o.id) : (set(q.key, o.id), advance()))}
                className="relative rounded-[16px] flex flex-col items-center justify-center gap-2 py-5 px-3 transition-all active:scale-[0.97]"
                style={{ background: active ? SEL_BG : '#FFFFFF', boxShadow: active ? SEL_RING : CARD }}>
                {q.multi && active && <span className="absolute top-2 right-2 w-4.5 h-4.5 rounded-full bg-[#E85D2A] flex items-center justify-center" style={{ width: 18, height: 18 }}><Check size={11} color="#FFFFFF" strokeWidth={3} /></span>}
                <span className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: active ? CORAL : '#FBEEE6' }}><Icon size={21} color={active ? '#FFFFFF' : CORAL} strokeWidth={1.9} /></span>
                <span className="text-[14.5px] font-bold" style={{ color: active ? CORAL : INK }}>{o.label}</span>
                {o.desc && <span className="text-[10.5px] text-[#A09A94] text-center leading-tight -mt-1">{o.desc}</span>}
              </button>
            );
          })}
        </div>
      );
    case 'grid':
      return (
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${q.cols || 3}, minmax(0,1fr))` }}>
          {q.options.map((o) => {
            const active = (data[q.key] || []).includes(o.id);
            return (
              <button key={o.id} onClick={() => toggle(q.key, o.id)} className="py-3.5 rounded-[13px] flex flex-col items-center justify-center gap-0.5 transition-all active:scale-[0.97]" style={{ background: active ? SEL_BG : '#FFFFFF', boxShadow: active ? SEL_RING : CARD }}>
                <span className="text-[14px] font-bold" style={{ color: active ? CORAL : INK }}>{o.label}</span>
                {o.sub && <span className="text-[10.5px] text-[#A09A94]">{o.sub}</span>}
              </button>
            );
          })}
        </div>
      );
    case 'chips':
      return (
        <div className="flex flex-wrap gap-2">
          {q.options.map((o) => {
            const active = (data[q.key] || []).includes(o.id);
            return <button key={o.id} onClick={() => toggle(q.key, o.id)} className="px-3.5 py-2.5 rounded-full text-[13.5px] font-semibold transition-all active:scale-[0.97]" style={{ background: active ? SEL_BG : '#FFFFFF', color: active ? CORAL : INK, boxShadow: active ? SEL_RING : CARD }}>{o.label}</button>;
          })}
        </div>
      );
    case 'stepper': {
      const v = data[q.key] || q.min || 1;
      return (
        <div className="flex items-center justify-center gap-6 py-1">
          <button onClick={() => set(q.key, Math.max(q.min, v - 1))} className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: '#FFFFFF', boxShadow: CARD }}><Minus size={20} className="text-[#111]" strokeWidth={2.4} /></button>
          <span className="text-[44px] font-extrabold text-[#111] tabular-nums w-14 text-center">{v}</span>
          <button onClick={() => set(q.key, Math.min(q.max, v + 1))} className="w-12 h-12 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: '#FFFFFF', boxShadow: CARD }}><Plus size={20} className="text-[#111]" strokeWidth={2.4} /></button>
        </div>
      );
    }
    case 'days':
      return (
        <div className="flex gap-1.5 justify-between">
          {DAYS.map((d, i) => {
            const active = (data.days || []).includes(d.id);
            return <button key={`${d.id}-${i}`} onClick={() => toggle('days', d.id)} className="flex-1 aspect-square rounded-xl text-[14px] font-bold transition-all active:scale-[0.94]" style={{ background: active ? CORAL : '#FFFFFF', color: active ? '#FFFFFF' : MUTED, boxShadow: active ? SEL_RING : CARD }}>{d.label}</button>;
          })}
        </div>
      );
    case 'radius': {
      const r = data.travelRadius || 5;
      return (
        <div className="flex flex-col gap-3 pt-1">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#6E6058]"><MapPin size={16} color={CORAL} strokeWidth={2.2} /> Travel radius</span>
            <span className="text-[18px] font-extrabold text-[#111] tabular-nums">{r} km</span>
          </div>
          <input type="range" min="1" max="20" value={r} onChange={(e) => set('travelRadius', Number(e.target.value))} className="w-full fy-range" />
          <div className="flex justify-between text-[11px] text-[#A09A94]"><span>1 km</span><span>20 km</span></div>
        </div>
      );
    }
    case 'rates': {
      const ids = data.services || []; const rates = data.rates || {};
      return (
        <div className="flex flex-col gap-2">
          {ids.map((id) => {
            const m = RATE_META[id]; if (!m) return null;
            return (
              <div key={id} className="flex items-center gap-3 p-3 rounded-[14px]" style={{ background: '#FFFFFF', boxShadow: CARD }}>
                <div className="flex-1 min-w-0"><div className="text-[13.5px] font-bold text-[#111]">{m.label}</div><div className="text-[11px] text-[#A09A94]">~{m.suggested} CHF typical</div></div>
                <div className="flex items-center gap-1 shrink-0"><span className="text-[11px] font-bold text-[#A09A94]">CHF</span>
                  <input inputMode="numeric" value={rates[id] ?? ''} placeholder={String(m.suggested)} onChange={(e) => set('rates', { ...rates, [id]: e.target.value.replace(/[^\d]/g, '') })} className="w-14 h-9 rounded-[9px] text-center text-[14px] font-extrabold text-[#111] outline-none" style={{ background: PEACH }} /></div>
              </div>
            );
          })}
        </div>
      );
    }
    case 'text': return <div className="pt-1"><BigInput value={data[q.key]} onChange={(v) => set(q.key, v)} placeholder={q.placeholder} icon={q.icon} autoFocus /></div>;
    case 'textarea':
      return (
        <div className="pt-1">
          <textarea value={data[q.key] || ''} onChange={(e) => set(q.key, e.target.value)} placeholder={q.placeholder} rows={3} maxLength={q.max} className="w-full bg-transparent outline-none text-[16px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal resize-none border-b-2 pb-2" style={{ borderColor: '#E0D8CF' }} />
          <div className="text-[11px] text-[#A09A94] text-right mt-1">{(data[q.key] || '').length}/{q.max}</div>
        </div>
      );
    case 'twoText':
      return <div className="flex flex-col gap-4 pt-1">{q.keys.map((k, i) => <BigInput key={k} value={data[k]} onChange={(v) => set(k, v)} placeholder={q.placeholders[i]} autoFocus={i === 0} />)}</div>;
    case 'photo': {
      const has = !!data.photo;
      return (
        <button onClick={() => set('photo', has ? null : 'mock')} className="w-full flex items-center gap-3.5 p-3.5 rounded-[15px] text-left transition-all active:scale-[0.99]" style={{ background: has ? '#EEF7F1' : '#FFFFFF', boxShadow: has ? 'inset 0 0 0 1.5px #CFE9D8' : CARD }}>
          <span className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ background: has ? GREEN : '#FBEEE6' }}>{has ? <Check size={22} color="#FFFFFF" strokeWidth={2.6} /> : <Camera size={20} color={CORAL} strokeWidth={1.9} />}</span>
          <div className="flex-1"><div className="text-[15px] font-bold text-[#111]">{has ? 'Photo added' : 'Tap to add a photo'}</div><div className="text-[12px] text-[#A09A94] mt-0.5">{has ? 'Looking good — see it above' : 'Shows at the top of your card'}</div></div>
        </button>
      );
    }
    case 'safety': {
      const acked = data.safetyAck || [];
      return (
        <div className="flex flex-col gap-2">
          {SAFETY_ITEMS.map((s) => {
            const on = acked.includes(s.id);
            return (
              <button key={s.id} onClick={() => set('safetyAck', on ? acked.filter((x) => x !== s.id) : [...acked, s.id])} className="w-full flex items-center gap-3 p-3 rounded-[14px] text-left transition-all active:scale-[0.99]" style={{ background: on ? '#EEF7F1' : '#FFFFFF', boxShadow: on ? 'inset 0 0 0 1.5px #CFE9D8' : CARD }}>
                <span className="w-5.5 h-5.5 rounded-[6px] flex items-center justify-center shrink-0" style={{ width: 22, height: 22, background: on ? GREEN : 'transparent', boxShadow: on ? 'none' : 'inset 0 0 0 2px #D8D0C6' }}>{on && <Check size={13} color="#FFFFFF" strokeWidth={3} />}</span>
                <span className="text-[12.5px] leading-[1.45] text-[#3A3530]">{s.text}</span>
              </button>
            );
          })}
        </div>
      );
    }
    case 'uploads':
      return (
        <div className="flex flex-col gap-2">
          {[{ k: 'idUploaded', icon: FileText, t: 'Photo ID', d: 'Passport or ID card' }, { k: 'selfieUploaded', icon: ScanFace, t: 'Quick selfie', d: 'To match your ID' }].map((u) => {
            const done = !!data[u.k]; const Icon = u.icon;
            return (
              <button key={u.k} onClick={() => set(u.k, !done)} className="w-full flex items-center gap-3.5 p-3.5 rounded-[15px] text-left transition-all active:scale-[0.99]" style={{ background: done ? '#EEF7F1' : '#FFFFFF', boxShadow: done ? 'inset 0 0 0 1.5px #CFE9D8' : CARD }}>
                <span className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: done ? GREEN : '#FBEEE6' }}>{done ? <Check size={19} color="#FFFFFF" strokeWidth={2.6} /> : <Icon size={19} color={CORAL} strokeWidth={1.9} />}</span>
                <div className="flex-1"><div className="text-[14.5px] font-bold text-[#111]">{u.t}</div><div className="text-[12px] text-[#A09A94] mt-0.5">{done ? 'Uploaded' : u.d}</div></div>
              </button>
            );
          })}
        </div>
      );
    case 'consents':
      return (
        <div className="flex flex-col gap-2">
          {[{ k: 'backgroundConsent', t: <>I agree to a background check and confirm I'm legally allowed to work.</> }, { k: 'termsAccepted', t: <>I accept the <span className="font-bold text-[#E85D2A]">Provider Agreement</span> & <span className="font-bold text-[#E85D2A]">Community Guidelines</span>.</> }].map((c) => {
            const on = !!data[c.k];
            return (
              <button key={c.k} onClick={() => set(c.k, !on)} className="w-full flex items-start gap-3 p-3.5 rounded-[15px] text-left transition-all active:scale-[0.99]" style={{ background: on ? SEL_BG : '#FFFFFF', boxShadow: on ? SEL_RING : CARD }}>
                <span className="w-5.5 h-5.5 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5" style={{ width: 22, height: 22, background: on ? CORAL : 'transparent', boxShadow: on ? 'none' : 'inset 0 0 0 2px #D8D0C6' }}>{on && <Check size={13} color="#FFFFFF" strokeWidth={3} />}</span>
                <span className="text-[12.5px] leading-[1.45] text-[#3A3530]">{c.t}</span>
              </button>
            );
          })}
          <div className="flex items-start gap-2 mt-0.5 px-1"><Shield size={12} className="text-[#A09A94] shrink-0 mt-0.5" strokeWidth={2} /><p className="text-[11px] leading-[1.45] text-[#A09A94]">Encrypted, used only for verification. Payout details come after approval.</p></div>
        </div>
      );
    default: return null;
  }
};

const isAnswered = (q, data) => {
  if (q.optional) return true;
  switch (q.kind) {
    case 'single': return !!data[q.key];
    case 'tiles': return q.multi ? (data[q.key] || []).length > 0 : !!data[q.key];
    case 'multi': case 'grid': case 'chips': case 'days': return (data[q.key] || []).length > 0;
    case 'stepper': case 'radius': case 'rates': case 'photo': return true;
    case 'text': case 'textarea': return !!(data[q.key] || '').trim();
    case 'twoText': return q.keys.every((k) => !!(data[k] || '').trim());
    case 'safety': return SAFETY_ITEMS.every((s) => (data.safetyAck || []).includes(s.id));
    case 'uploads': return data.idUploaded && data.selfieUploaded;
    case 'consents': return data.backgroundConsent && data.termsAccepted;
    default: return true;
  }
};

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

// ─── Welcome & Done ─────────────────────────────────────────────────
const Welcome = ({ onStart, onClose }) => (
  <div className="absolute inset-0 flex flex-col" style={{ background: CREAM }}>
    <StatusBar />
    <button onClick={onClose} className="absolute top-14 right-5 z-10 w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-transform" style={{ background: PEACH }} aria-label="Close"><X size={17} color={MUTED} strokeWidth={2.2} /></button>
    <div className="flex-1 flex flex-col justify-center px-7">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5 self-start" style={{ background: '#FFEDE3' }}><Sparkles size={12} color={CORAL} strokeWidth={2.2} /><span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#B85A26]">Earn with fylos</span></span>
      <h1 className="text-[38px] font-extrabold text-[#111] leading-[1.02] tracking-[-0.03em]">Build your<br />pro profile<br />in minutes.</h1>
      <p className="text-[15px] text-[#6E6058] mt-4 leading-[1.5] max-w-[300px]">Answer a few questions and watch your profile come to life. Most pros earn CHF 25–75 per booking.</p>
    </div>
    <div className="px-7 pb-9">
      <button onClick={onStart} className="w-full flex items-center justify-center gap-2 py-4 rounded-[18px] active:scale-[0.98] transition-transform" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.3)' }}><span className="text-[16px] font-bold text-white">Start building</span><ArrowRight size={18} color="#FFFFFF" strokeWidth={2.4} /></button>
      <button onClick={onClose} className="w-full text-center mt-3.5 active:opacity-70"><span className="text-[13px] text-[#6E6058]">Already a pro? </span><span className="text-[13px] font-bold text-[#E85D2A]">Sign in</span></button>
    </div>
  </div>
);

const Done = ({ data, onHome }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center px-7" style={{ background: CREAM }}>
    <StatusBar />
    <div className="relative mb-6"><span className="absolute inset-0 rounded-full" style={{ background: 'rgba(63,141,99,0.18)', animation: 'fyRing 2s ease-out infinite' }} /><span className="relative w-[80px] h-[80px] rounded-full flex items-center justify-center" style={{ background: GREEN, boxShadow: '0 10px 28px rgba(63,141,99,0.3)' }}><Check size={38} color="#FFFFFF" strokeWidth={2.8} /></span></div>
    <h1 className="text-[27px] font-extrabold text-[#111] tracking-[-0.02em]">Profile submitted</h1>
    <p className="text-[14px] text-[#6E6058] mt-2.5 leading-[1.5] text-center max-w-[290px]">{data.firstName ? `Nice work, ${data.firstName}. ` : ''}We'll review and get back within 24–48 hours. You'll add payout details once approved.</p>
    <button onClick={onHome} className="w-full mt-8 py-4 rounded-[18px] active:scale-[0.98] transition-transform" style={{ background: INK }}><span className="text-[15px] font-bold text-white">Back to dashboard</span></button>
  </div>
);

// ════════════════════════════════════════════════════════════════════
const ProRegistration = ({ embedded = false, onExit }) => {
  const [phase, setPhase] = useState('welcome');
  const [data, setData] = useState({ travelRadius: 5, groupMax: 3 });
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const exit = () => { if (onExit) return onExit(); window.history.back(); };
  const exitHome = () => { if (onExit) return onExit(); window.location.href = '/'; };

  const questions = useMemo(() => QUESTIONS.filter((q) => !q.condition || q.condition(data)), [data]);
  const goBack = () => { if (phase === 'welcome') return exit(); if (phase === 0) return setPhase('welcome'); setPhase((p) => p - 1); };
  const goNext = () => { if (phase === questions.length - 1) return setPhase('done'); setPhase((p) => p + 1); };
  const autoAdvance = () => { setTimeout(goNext, 220); };

  const q = typeof phase === 'number' ? questions[Math.min(phase, questions.length - 1)] : null;
  const answered = q ? isAnswered(q, data) : false;
  const isLast = phase === questions.length - 1;
  const progress = q ? (phase + 1) / questions.length : 0;
  const showFooter = q && q.kind !== 'single' && !(q.kind === 'tiles' && !q.multi);
  const skipLabel = q && q.optional && !isAnswered({ ...q, optional: false }, data);

  const styleBlock = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes fyQ { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .fy-q { animation: fyQ 0.28s cubic-bezier(0.22,1,0.36,1) both; }
      @keyframes fyPop { from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: scale(1); } }
      .fy-pop { animation: fyPop 0.34s cubic-bezier(0.34,1.56,0.64,1) both; }
      @keyframes fyRing { 0% { transform: scale(0.6); opacity: 0.5; } 100% { transform: scale(2.1); opacity: 0; } }
      .fy-range { -webkit-appearance: none; appearance: none; height: 5px; border-radius: 999px; background: #E0D8CF; outline: none; }
      .fy-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #E85D2A; cursor: pointer; box-shadow: 0 2px 6px rgba(232,93,42,0.35); }
      .fy-range::-moz-range-thumb { width: 24px; height: 24px; border: none; border-radius: 50%; background: #E85D2A; box-shadow: 0 2px 6px rgba(232,93,42,0.35); }
    `}</style>
  );

  const inner = (
    <>
      {phase === 'welcome' && <Welcome onStart={() => setPhase(0)} onClose={exit} />}
      {phase === 'done' && <Done data={data} onHome={exitHome} />}

      {typeof phase === 'number' && q && (
        <div className="absolute inset-0 flex flex-col" style={{ background: CREAM }}>
          {!embedded && <StatusBar />}

          {/* Top bar */}
          <div className="px-5 pt-14 pb-2 flex items-center gap-3 shrink-0">
            <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0" style={{ background: PEACH }} aria-label="Back"><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
            <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: '#EAE3DB' }}><div className="h-full rounded-full transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)]" style={{ width: `${progress * 100}%`, background: CORAL }} /></div>
            <button onClick={exit} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0" style={{ background: PEACH }} aria-label="Exit"><X size={17} color={MUTED} strokeWidth={2.2} /></button>
          </div>

          {/* Live profile card */}
          <div className="px-5 pt-1.5 pb-3 shrink-0">
            <LiveProfileCard data={data} focus={q.focus} />
          </div>

          {/* Question sheet */}
          <div className="flex-1 rounded-t-[26px] flex flex-col overflow-hidden" style={{ background: '#FFFFFF', boxShadow: '0 -8px 24px rgba(60,30,15,0.07)' }}>
            <div key={q.id} className="fy-q flex-1 overflow-y-auto px-5 pt-5 pb-4" style={{ scrollbarWidth: 'none' }}>
              <div className="text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-[#E85D2A] mb-1.5">{q.section} · {String(phase + 1).padStart(2, '0')}</div>
              <h2 className="text-[22px] font-extrabold text-[#111] tracking-[-0.02em] leading-[1.12] mb-1">{q.q}</h2>
              {q.help && <p className="text-[12.5px] text-[#A09A94] leading-[1.4] mb-4">{q.help}</p>}
              {!q.help && <div className="mb-4" />}
              <QuestionBody q={q} data={data} set={set} advance={autoAdvance} />
            </div>
            {showFooter && (
              <div className="px-5 pt-2 pb-7" style={{ background: `linear-gradient(to top, #FFFFFF 74%, rgba(255,255,255,0))` }}>
                <button onClick={goNext} disabled={!answered} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[15px] transition-all active:scale-[0.98]" style={{ background: answered ? CORAL : '#EDE8E2', boxShadow: answered ? '0 6px 18px rgba(232,93,42,0.26)' : 'none' }}>
                  <span className="text-[15px] font-bold" style={{ color: answered ? '#FFFFFF' : TERT }}>{isLast ? 'Submit application' : skipLabel ? 'Skip' : 'Continue'}</span>
                  {!isLast && <ArrowRight size={16} color={answered ? '#FFFFFF' : TERT} strokeWidth={2.4} />}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  if (embedded) return (<>{styleBlock}<div className="absolute inset-0 z-[150] overflow-hidden" style={{ background: CREAM, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>{inner}</div></>);

  return (
    <>{styleBlock}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          {inner}
        </div>
      </div>
    </>
  );
};

export default ProRegistration;
