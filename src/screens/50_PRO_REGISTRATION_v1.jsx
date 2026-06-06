import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  Check,
  ArrowRight,
  PawPrint,
  Home,
  Camera,
  Shield,
  MapPin,
  Plus,
  Calendar,
  Heart,
  Sparkles,
  Car,
  Pill,
  Scissors,
  GraduationCap,
  Info,
  ScanFace,
  FileText,
  Clock,
  Coins,
  Upload,
  Phone,
  Trees,
  Building2,
  Users,
  Cigarette,
  Dog,
  Cat,
  Pencil,
  Zap,
  Minus,
  Syringe,
  CrossIcon,
  Lock,
  Sun,
  Baby,
  Star,
} from 'lucide-react';

/**
 * 50_PRO_REGISTRATION_v1.jsx
 * "Earn with fylos" — professional provider onboarding.
 *
 * Every field maps to a downstream need:
 *   · Search / booking filters → service, pet type/size/age, special
 *     needs, one-family-only, availability, rate, languages, radius,
 *     home & supervision details, cancellation policy, meet & greet
 *   · Booking process          → instant-vs-request, meet & greet,
 *     cancellation policy, response expectations
 *   · Capabilities declared     → services, add-ons, meds (oral/injected),
 *     first aid, experience, certifications
 *   · Trust / profile           → photos, headline, bio, references-ready
 *   · Legal / KYC               → DOB (18+), phone (OTP), full address,
 *     photo ID, selfie, background-check consent, provider terms,
 *     safety acknowledgments. Payout (IBAN) is collected AFTER approval.
 *
 * Adaptive flow — the "Your place" step appears only for providers who
 * board pets at their home (day care / overnight). Banking is shown as
 * a post-approval next step, not bundled with identity verification.
 */

// ─── Brand tokens ───────────────────────────────────────────────────
const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const INK = '#111111';
const MUTED = '#6E6058';
const TERTIARY = '#A09A94';

// ─── Option data ────────────────────────────────────────────────────
const ROLES = [
  { id: 'walker', label: 'Walker', desc: 'Daily walks and outdoor exercise', icon: PawPrint },
  { id: 'sitter', label: 'Sitter', desc: 'Drop-ins, day care, and overnights', icon: Home },
  { id: 'both', label: 'Both', desc: 'Walking and sitting', icon: Heart },
];
const WALKER_SERVICES = [
  { id: 'solo', label: 'Solo walks', desc: 'One household at a time' },
  { id: 'group', label: 'Group walks', desc: 'A few dogs together' },
];
const SITTER_SERVICES = [
  { id: 'dropin', label: 'Drop-in visits', desc: 'Short check-ins at their home' },
  { id: 'daycare', label: 'Day care', desc: 'They stay at your place for the day' },
  { id: 'overnight', label: 'Overnight', desc: 'You stay over or they board with you' },
];
const ADD_ONS = [
  { id: 'medication', label: 'Give medication', icon: Pill },
  { id: 'transport', label: 'Pet transport', icon: Car },
  { id: 'grooming', label: 'Basic grooming', icon: Scissors },
  { id: 'training', label: 'Light training', icon: GraduationCap },
];

const LANGUAGES = [
  { id: 'de', label: 'German' }, { id: 'fr', label: 'French' }, { id: 'it', label: 'Italian' },
  { id: 'en', label: 'English' }, { id: 'es', label: 'Spanish' }, { id: 'pt', label: 'Portuguese' },
];

const EXPERIENCE = [
  { id: '<1', label: 'Under a year' }, { id: '1-3', label: '1–3 years' },
  { id: '3-5', label: '3–5 years' }, { id: '5+', label: '5+ years' },
];

const PET_TYPES = [
  { id: 'dogs', label: 'Dogs', icon: Dog },
  { id: 'cats', label: 'Cats', icon: Cat },
];
const PET_SIZES = [
  { id: 's', label: 'Small', sub: '0–10 kg' },
  { id: 'm', label: 'Medium', sub: '10–25 kg' },
  { id: 'l', label: 'Large', sub: '25–45 kg' },
  { id: 'xl', label: 'Giant', sub: '45 kg+' },
];
const PET_AGES = [
  { id: 'puppy', label: 'Puppies', sub: 'Under 1 yr' },
  { id: 'adult', label: 'Adults', sub: '1–8 yrs' },
  { id: 'senior', label: 'Seniors', sub: '8 yrs+' },
];
const SPECIAL_NEEDS = [
  { id: 'medication', label: 'Needs medication' },
  { id: 'reactive', label: 'Reactive / anxious' },
  { id: 'diet', label: 'Special diet' },
  { id: 'mobility', label: 'Limited mobility' },
  { id: 'postop', label: 'Post-surgery' },
];

const DAYS = [
  { id: 'mon', label: 'M' }, { id: 'tue', label: 'T' }, { id: 'wed', label: 'W' },
  { id: 'thu', label: 'T' }, { id: 'fri', label: 'F' }, { id: 'sat', label: 'S' }, { id: 'sun', label: 'S' },
];
const TIME_SLOTS = [
  { id: 'morning', label: 'Morning', sub: '6–12' }, { id: 'afternoon', label: 'Afternoon', sub: '12–17' },
  { id: 'evening', label: 'Evening', sub: '17–22' }, { id: 'overnight', label: 'Overnight', sub: '22–6' },
];

const SERVICE_RATE_DEFAULTS = {
  solo: { label: '30-min solo walk', suggested: 25 },
  group: { label: '60-min group walk', suggested: 30 },
  dropin: { label: '30-min drop-in', suggested: 28 },
  daycare: { label: 'Day care (per day)', suggested: 55 },
  overnight: { label: 'Overnight (per night)', suggested: 75 },
};

const HOME_TYPES = [
  { id: 'apartment', label: 'Apartment', icon: Building2 },
  { id: 'house', label: 'House', icon: Home },
];
const OUTDOOR_OPTIONS = [
  { id: 'none', label: 'No outdoor space' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'garden', label: 'Garden / yard' },
];
const HOME_PETS = [
  { id: 'none', label: 'No other pets' },
  { id: 'dog', label: 'A dog', icon: Dog },
  { id: 'cat', label: 'A cat', icon: Cat },
  { id: 'other', label: 'Other pets' },
];
const SUPERVISION = [
  { id: 'most', label: 'Most of the day', desc: 'Someone is usually home' },
  { id: 'part', label: 'Part of the day', desc: 'Out for a few hours at a time' },
  { id: 'work', label: 'Work hours out', desc: 'Pets alone during the workday' },
];
const CRATE_OPTIONS = [
  { id: 'never', label: 'Never crated' },
  { id: 'choice', label: 'Crate if they prefer' },
  { id: 'night', label: 'Crated at night' },
];

const BOOKING_STYLES = [
  { id: 'instant', label: 'Instant book', desc: 'Owners can book you directly', icon: Zap },
  { id: 'request', label: 'Review requests', desc: 'You approve each booking first', icon: Check },
];
const CANCELLATION = [
  { id: 'flexible', label: 'Flexible', desc: 'Full refund up to 24h before' },
  { id: 'moderate', label: 'Moderate', desc: 'Full refund up to 3 days before' },
  { id: 'strict', label: 'Strict', desc: '50% refund up to 1 week before' },
];

// Safety acknowledgments — all required. Sets a baseline of care and
// covers liability, the way Rover's onboarding quiz does.
const SAFETY_ITEMS = [
  { id: 'leash', text: 'I keep dogs leashed unless the owner approves off-leash.' },
  { id: 'heat', text: 'I never leave a pet alone in a vehicle.' },
  { id: 'emergency', text: 'In an emergency I contact the owner and the nearest vet right away.' },
  { id: 'meds', text: 'I only give medication exactly as the owner instructs.' },
  { id: 'honest', text: 'I only accept bookings I can genuinely handle safely.' },
];

// ─── Shared primitives ──────────────────────────────────────────────
const StatusBar = ({ light = false }) => {
  const c = light ? '#FFFFFF' : INK;
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: c }}>9:41</span>
      <div className="flex items-center gap-1">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={c}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={c}/><rect x="9" y="2" width="3" height="10" rx="1" fill={c}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={c}/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={c}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={c} strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="9" rx="2" fill={c}/><path d="M23 4.5v4a2 2 0 000-4z" fill={c} fillOpacity="0.5"/></svg>
      </div>
    </div>
  );
};

const Chip = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all active:scale-[0.97]"
    style={{ background: active ? '#FFEDE3' : PEACH, color: active ? CORAL : INK, boxShadow: active ? `inset 0 0 0 1.5px ${CORAL}` : 'none' }}
  >
    {Icon && <Icon size={14} className={active ? 'text-[#E85D2A]' : 'text-[#6E6058]'} strokeWidth={2} />}
    {children}
  </button>
);

const FieldLabel = ({ children, optional }) => (
  <div className="flex items-baseline gap-2 mb-2 mt-1">
    <h3 className="text-[13px] font-bold text-[#111]">{children}</h3>
    {optional && <span className="text-[11px] text-[#A09A94] font-medium">Optional</span>}
  </div>
);

const OptionRow = ({ active, onClick, icon: Icon, title, desc, multi }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3.5 p-4 rounded-[16px] transition-all active:scale-[0.99] text-left"
    style={{ background: active ? '#FFF3EC' : PEACH, boxShadow: active ? `inset 0 0 0 1.5px ${CORAL}` : `inset 0 0 0 1px #EDE8E2` }}
  >
    {Icon && (
      <span className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0 transition-colors" style={{ background: active ? CORAL : '#EDE8E2' }}>
        <Icon size={20} color={active ? '#FFFFFF' : CORAL} strokeWidth={1.9} />
      </span>
    )}
    <div className="flex-1 min-w-0">
      <div className="text-[15px] font-bold text-[#111]">{title}</div>
      {desc && <div className="text-[12.5px] text-[#A09A94] mt-0.5">{desc}</div>}
    </div>
    <span
      className={`shrink-0 flex items-center justify-center transition-all ${multi ? 'w-6 h-6 rounded-[7px]' : 'w-6 h-6 rounded-full'}`}
      style={{ background: active ? CORAL : 'transparent', boxShadow: active ? 'none' : `inset 0 0 0 2px #D8D0C6` }}
    >
      {active && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
    </span>
  </button>
);

const TextField = ({ label, value, onChange, placeholder, type = 'text', icon: Icon, optional }) => (
  <div>
    {label && <FieldLabel optional={optional}>{label}</FieldLabel>}
    <div className="relative">
      {Icon && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Icon size={17} className="text-[#A09A94]" strokeWidth={1.9} />
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-[50px] rounded-[14px] text-[15px] text-[#111] outline-none transition-all"
        style={{ background: PEACH, border: '1px solid #EDE8E2', paddingLeft: Icon ? 44 : 16, paddingRight: 16 }}
        onFocus={(e) => { e.target.style.background = '#FFFFFF'; e.target.style.borderColor = CORAL; }}
        onBlur={(e) => { e.target.style.background = PEACH; e.target.style.borderColor = '#EDE8E2'; }}
      />
    </div>
  </div>
);

const UploadCard = ({ done, onUpload, icon: Icon, title, desc }) => (
  <button
    onClick={onUpload}
    className="w-full flex items-center gap-3.5 p-4 rounded-[16px] transition-all active:scale-[0.99] text-left"
    style={{ background: done ? '#EEF7F1' : '#FFFFFF', border: done ? '1px solid #CFE9D8' : '1px dashed #D8D0C6' }}
  >
    <span className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: done ? '#3F8D63' : PEACH }}>
      {done ? <Check size={20} color="#FFFFFF" strokeWidth={2.6} /> : <Icon size={20} color={CORAL} strokeWidth={1.9} />}
    </span>
    <div className="flex-1 min-w-0">
      <div className="text-[14.5px] font-bold text-[#111]">{title}</div>
      <div className="text-[12px] text-[#A09A94] mt-0.5">{done ? 'Uploaded' : desc}</div>
    </div>
    {!done && <Upload size={17} className="text-[#A09A94] shrink-0" strokeWidth={1.9} />}
  </button>
);

// Toggle row (switch)
const ToggleRow = ({ on, onToggle, icon: Icon, label, sub }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center gap-3 p-3.5 rounded-[14px] text-left active:scale-[0.99] transition-transform"
    style={{ background: PEACH, border: '1px solid #EDE8E2' }}
  >
    {Icon && <Icon size={18} className="text-[#6E6058] shrink-0" strokeWidth={1.9} />}
    <div className="flex-1 min-w-0">
      <div className="text-[14px] font-semibold text-[#111]">{label}</div>
      {sub && <div className="text-[11px] text-[#A09A94] mt-0.5">{sub}</div>}
    </div>
    <span className="w-11 h-[26px] rounded-full p-[3px] shrink-0 transition-colors" style={{ background: on ? CORAL : '#D8D0C6' }}>
      <span className="block w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: on ? 'translateX(18px)' : 'translateX(0)' }} />
    </span>
  </button>
);

// Compact segmented multi/single tile
const TileGrid = ({ items, selected, onToggle, cols = 3, multi = true }) => (
  <div className={`grid gap-2.5`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
    {items.map((it) => {
      const active = multi ? (selected || []).includes(it.id) : selected === it.id;
      return (
        <button
          key={it.id}
          onClick={() => onToggle(it.id)}
          className="py-3 rounded-[13px] flex flex-col items-center gap-0.5 transition-all active:scale-[0.97]"
          style={{ background: active ? '#FFEDE3' : PEACH, boxShadow: active ? `inset 0 0 0 1.5px ${CORAL}` : 'none' }}
        >
          <span className="text-[13.5px] font-bold" style={{ color: active ? CORAL : INK }}>{it.label}</span>
          {it.sub && <span className="text-[10.5px] text-[#A09A94]">{it.sub}</span>}
        </button>
      );
    })}
  </div>
);

// ════════════════════════════════════════════════════════════════════
const StepHeader = ({ title, subtitle }) => (
  <div className="mb-5">
    <h2 className="text-[23px] font-extrabold text-[#111] tracking-[-0.02em] leading-[1.12]">{title}</h2>
    {subtitle && <p className="text-[13.5px] text-[#6E6058] mt-1.5 leading-[1.45]">{subtitle}</p>}
  </div>
);

const toggleIn = (set, data, key, id, exclusive) => {
  let arr = data[key] || [];
  if (exclusive && id === exclusive) { set(key, [exclusive]); return; }
  if (exclusive) arr = arr.filter((x) => x !== exclusive);
  set(key, arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);
};

// ── Step: Services ──
const StepOffer = ({ data, set }) => {
  const showWalker = data.role === 'walker' || data.role === 'both';
  const showSitter = data.role === 'sitter' || data.role === 'both';
  const toggle = (key, id) => toggleIn(set, data, key, id);
  return (
    <div className="pro-fade">
      <StepHeader title="What do you offer?" subtitle="This decides where you show up when owners search." />
      <div className="flex flex-col gap-2.5 mb-6">
        {ROLES.map((r) => (
          <OptionRow key={r.id} active={data.role === r.id} onClick={() => set('role', r.id)} icon={r.icon} title={r.label} desc={r.desc} />
        ))}
      </div>

      {showWalker && (
        <div className="mb-5">
          <FieldLabel>Walking</FieldLabel>
          <div className="flex flex-col gap-2.5">
            {WALKER_SERVICES.map((s) => (
              <OptionRow key={s.id} multi active={(data.walkerServices || []).includes(s.id)} onClick={() => toggle('walkerServices', s.id)} title={s.label} desc={s.desc} />
            ))}
          </div>
          {(data.walkerServices || []).includes('group') && (
            <div className="flex items-center justify-between mt-2.5 p-3.5 rounded-[14px]" style={{ background: PEACH, border: '1px solid #EDE8E2' }}>
              <div>
                <div className="text-[13.5px] font-semibold text-[#111]">Max dogs per group walk</div>
                <div className="text-[11px] text-[#A09A94] mt-0.5">Including dogs from different homes</div>
              </div>
              <div className="flex items-center gap-2.5 shrink-0">
                <button onClick={() => set('groupMax', Math.max(2, (data.groupMax || 3) - 1))} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }} aria-label="Fewer"><Minus size={15} className="text-[#111]" strokeWidth={2.4} /></button>
                <span className="text-[16px] font-bold text-[#111] tabular-nums w-4 text-center">{data.groupMax || 3}</span>
                <button onClick={() => set('groupMax', Math.min(6, (data.groupMax || 3) + 1))} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }} aria-label="More"><Plus size={15} className="text-[#111]" strokeWidth={2.4} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {showSitter && (
        <div className="mb-5">
          <FieldLabel>Sitting</FieldLabel>
          <div className="flex flex-col gap-2.5">
            {SITTER_SERVICES.map((s) => (
              <OptionRow key={s.id} multi active={(data.sitterServices || []).includes(s.id)} onClick={() => toggle('sitterServices', s.id)} title={s.label} desc={s.desc} />
            ))}
          </div>
        </div>
      )}

      {data.role && (
        <div>
          <FieldLabel optional>Add-ons you're comfortable with</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {ADD_ONS.map((a) => (
              <Chip key={a.id} icon={a.icon} active={(data.addOns || []).includes(a.id)} onClick={() => toggle('addOns', a.id)}>{a.label}</Chip>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ── Step: Pets you'll care for ──
const StepPets = ({ data, set }) => {
  const toggle = (key, id) => toggleIn(set, data, key, id);
  return (
    <div className="pro-fade">
      <StepHeader title="Pets you'll care for" subtitle="Exactly what owners filter by. Be honest — it means better matches." />

      <div className="mb-5">
        <FieldLabel>Which pets?</FieldLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {PET_TYPES.map((t) => {
            const active = (data.petTypes || []).includes(t.id);
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => toggle('petTypes', t.id)} className="py-3.5 rounded-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.97]" style={{ background: active ? '#FFEDE3' : PEACH, boxShadow: active ? `inset 0 0 0 1.5px ${CORAL}` : 'none' }}>
                <Icon size={17} color={active ? CORAL : MUTED} strokeWidth={1.9} />
                <span className="text-[14px] font-bold" style={{ color: active ? CORAL : INK }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel>Sizes you're happy with</FieldLabel>
        <TileGrid items={PET_SIZES} selected={data.petSizes} onToggle={(id) => toggle('petSizes', id)} cols={4} />
      </div>

      <div className="mb-5">
        <FieldLabel>Ages</FieldLabel>
        <TileGrid items={PET_AGES} selected={data.petAges} onToggle={(id) => toggle('petAges', id)} cols={3} />
      </div>

      <div className="mb-5">
        <FieldLabel optional>Special needs you can handle</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {SPECIAL_NEEDS.map((n) => (
            <Chip key={n.id} active={(data.specialNeeds || []).includes(n.id)} onClick={() => toggle('specialNeeds', n.id)}>{n.label}</Chip>
          ))}
        </div>
      </div>

      {/* Exclusivity — a top owner filter */}
      <ToggleRow on={data.oneFamilyOnly} onToggle={() => set('oneFamilyOnly', !data.oneFamilyOnly)} icon={Lock} label="One family at a time" sub="No other clients' pets during a booking" />
    </div>
  );
};

// ── Step: Experience & skills ──
const StepExperience = ({ data, set }) => (
  <div className="pro-fade">
    <StepHeader title="Experience & skills" subtitle="Owners with special cases search for exactly these." />

    <div className="mb-5">
      <FieldLabel>How long have you cared for pets?</FieldLabel>
      <div className="grid grid-cols-2 gap-2.5">
        {EXPERIENCE.map((e) => {
          const active = data.experience === e.id;
          return (
            <button key={e.id} onClick={() => set('experience', e.id)} className="py-3 rounded-[13px] text-[13.5px] font-semibold transition-all active:scale-[0.97]" style={{ background: active ? '#FFEDE3' : PEACH, color: active ? CORAL : INK, boxShadow: active ? `inset 0 0 0 1.5px ${CORAL}` : 'none' }}>
              {e.label}
            </button>
          );
        })}
      </div>
    </div>

    <div className="mb-5">
      <FieldLabel>Can you give medication?</FieldLabel>
      <div className="flex flex-col gap-2.5">
        <ToggleRow on={data.medsOral} onToggle={() => set('medsOral', !data.medsOral)} icon={Pill} label="Oral medication" sub="Pills, drops, food-mixed" />
        <ToggleRow on={data.medsInjected} onToggle={() => set('medsInjected', !data.medsInjected)} icon={Syringe} label="Injections" sub="Insulin and similar" />
      </div>
    </div>

    <div className="mb-5">
      <ToggleRow on={data.firstAid} onToggle={() => set('firstAid', !data.firstAid)} icon={CrossIcon} label="Pet first-aid trained" sub="You know basic emergency steps" />
    </div>

    <div>
      <FieldLabel optional>Certifications</FieldLabel>
      <UploadCard done={data.certUploaded} onUpload={() => set('certUploaded', !data.certUploaded)} icon={GraduationCap} title="Add a certificate" desc="First aid, training, vet tech…" />
      <p className="text-[11px] text-[#A09A94] mt-2 pl-1 leading-[1.4]">A verified certificate earns a badge owners can see.</p>
    </div>
  </div>
);

// ── Step: Your place (boarders only) ──
const StepPlace = ({ data, set }) => {
  const toggleHomePet = (id) => toggleIn(set, data, 'homePets', id, 'none');
  return (
    <div className="pro-fade">
      <StepHeader title="Your place" subtitle="When pets stay over, owners want to picture exactly where." />

      <div className="mb-5">
        <FieldLabel>Home type</FieldLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {HOME_TYPES.map((h) => {
            const active = data.homeType === h.id;
            const Icon = h.icon;
            return (
              <button key={h.id} onClick={() => set('homeType', h.id)} className="py-3.5 rounded-[13px] flex items-center justify-center gap-2 transition-all active:scale-[0.97]" style={{ background: active ? '#FFEDE3' : PEACH, boxShadow: active ? `inset 0 0 0 1.5px ${CORAL}` : 'none' }}>
                <Icon size={17} color={active ? CORAL : MUTED} strokeWidth={1.9} />
                <span className="text-[14px] font-bold" style={{ color: active ? CORAL : INK }}>{h.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel>Outdoor space</FieldLabel>
        <div className="flex flex-col gap-2.5">
          {OUTDOOR_OPTIONS.map((o) => (
            <OptionRow key={o.id} active={data.outdoor === o.id} onClick={() => set('outdoor', o.id)} icon={o.id === 'garden' ? Trees : MapPin} title={o.label} />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel>How often is someone home?</FieldLabel>
        <div className="flex flex-col gap-2.5">
          {SUPERVISION.map((s) => (
            <OptionRow key={s.id} active={data.supervision === s.id} onClick={() => set('supervision', s.id)} icon={Sun} title={s.label} desc={s.desc} />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel>Sleeping setup</FieldLabel>
        <div className="grid grid-cols-3 gap-2.5">
          {CRATE_OPTIONS.map((c) => {
            const active = data.crate === c.id;
            return (
              <button key={c.id} onClick={() => set('crate', c.id)} className="py-3 px-1 rounded-[13px] text-[12px] font-semibold leading-tight transition-all active:scale-[0.97]" style={{ background: active ? '#FFEDE3' : PEACH, color: active ? CORAL : INK, boxShadow: active ? `inset 0 0 0 1.5px ${CORAL}` : 'none' }}>
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel>Other pets at home</FieldLabel>
        <div className="flex flex-wrap gap-2">
          {HOME_PETS.map((p) => (
            <Chip key={p.id} icon={p.icon} active={(data.homePets || []).includes(p.id)} onClick={() => toggleHomePet(p.id)}>{p.label}</Chip>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <ToggleRow on={data.furnitureOk} onToggle={() => set('furnitureOk', !data.furnitureOk)} icon={Home} label="Pets allowed on furniture" sub="Sofa, bed, etc." />
        <ToggleRow on={data.hasKids} onToggle={() => set('hasKids', !data.hasKids)} icon={Baby} label="Children at home" />
        <ToggleRow on={data.smokeFree} onToggle={() => set('smokeFree', !data.smokeFree)} icon={Cigarette} label="Smoke-free home" />
      </div>
    </div>
  );
};

// ── Step: Your profile ──
const StepProfile = ({ data, set }) => {
  const toggleLang = (id) => toggleIn(set, data, 'languages', id);
  const photos = data.photos || [];
  const addPhoto = (i) => {
    const next = [...photos];
    if (next[i]) next.splice(i, 1); else next.push('mock');
    set('photos', next);
  };
  return (
    <div className="pro-fade">
      <StepHeader title="Your profile" subtitle="This is what owners see first. Make it warm and real." />

      {/* Photo grid — main + extras */}
      <FieldLabel>Photos</FieldLabel>
      <div className="grid grid-cols-4 gap-2 mb-1.5">
        {[0, 1, 2, 3].map((i) => {
          const filled = !!photos[i];
          const isMain = i === 0;
          return (
            <button key={i} onClick={() => addPhoto(i)} className="aspect-square rounded-[12px] flex items-center justify-center overflow-hidden active:scale-[0.97] transition-transform relative" style={{ background: PEACH, border: filled ? 'none' : '1px dashed #D8D0C6' }}>
              {filled ? (
                <img src={`https://i.pravatar.cc/200?u=fylospro${i}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <Plus size={18} className="text-[#A09A94]" strokeWidth={2} />
              )}
              {isMain && !filled && <span className="absolute bottom-1 text-[8px] font-bold text-[#A09A94] uppercase tracking-wide">Main</span>}
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-[#A09A94] mb-4 pl-1 leading-[1.4]">A clear face photo first, then you with pets or your space.</p>

      <div className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-2.5">
          <TextField label="First name" value={data.firstName || ''} onChange={(v) => set('firstName', v)} placeholder="Alex" />
          <TextField label="Last name" value={data.lastName || ''} onChange={(v) => set('lastName', v)} placeholder="Berger" />
        </div>

        <div>
          <FieldLabel>Headline</FieldLabel>
          <TextField value={data.headline || ''} onChange={(v) => set('headline', v)} placeholder="Calm, reliable walks in Seefeld" />
          <p className="text-[11px] text-[#A09A94] mt-1.5 pl-1 leading-[1.4]">One line shown under your name in search.</p>
        </div>

        <TextField label="City" value={data.city || ''} onChange={(v) => set('city', v)} placeholder="Zürich" icon={MapPin} />

        <div>
          <FieldLabel>Languages</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <Chip key={l.id} active={(data.languages || []).includes(l.id)} onClick={() => toggleLang(l.id)}>{l.label}</Chip>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>About you</FieldLabel>
          <textarea
            value={data.bio || ''}
            onChange={(e) => set('bio', e.target.value)}
            placeholder="A few lines about you and why pets love you…"
            rows={4}
            maxLength={300}
            className="w-full rounded-[14px] text-[14px] text-[#111] outline-none p-3.5 resize-none transition-all"
            style={{ background: PEACH, border: '1px solid #EDE8E2' }}
            onFocus={(e) => { e.target.style.background = '#FFFFFF'; e.target.style.borderColor = CORAL; }}
            onBlur={(e) => { e.target.style.background = PEACH; e.target.style.borderColor = '#EDE8E2'; }}
          />
          <div className="text-[11px] text-[#A09A94] text-right mt-1">{(data.bio || '').length}/300</div>
        </div>
      </div>
    </div>
  );
};

// ── Step: Availability, pricing & policies ──
const StepAvailability = ({ data, set }) => {
  const toggle = (key, id) => toggleIn(set, data, key, id);
  const offered = [...(data.walkerServices || []), ...(data.sitterServices || [])];
  const rates = data.rates || {};
  const setRate = (id, v) => set('rates', { ...rates, [id]: v.replace(/[^\d]/g, '') });
  return (
    <div className="pro-fade">
      <StepHeader title="When, how much, and the rules" subtitle="Owners filter by availability and see your terms up front." />

      <div className="mb-5">
        <FieldLabel>Days you're around</FieldLabel>
        <div className="flex gap-1.5 justify-between">
          {DAYS.map((d, i) => {
            const active = (data.days || []).includes(d.id);
            return (
              <button key={`${d.id}-${i}`} onClick={() => toggle('days', d.id)} className="flex-1 aspect-square rounded-full text-[13px] font-bold transition-all active:scale-[0.94]" style={{ background: active ? CORAL : PEACH, color: active ? '#FFFFFF' : MUTED }}>{d.label}</button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel>Times that work</FieldLabel>
        <div className="grid grid-cols-2 gap-2.5">
          {TIME_SLOTS.map((t) => {
            const active = (data.timeSlots || []).includes(t.id);
            return (
              <button key={t.id} onClick={() => toggle('timeSlots', t.id)} className="py-3 rounded-[13px] flex flex-col items-center gap-0.5 transition-all active:scale-[0.97]" style={{ background: active ? '#FFEDE3' : PEACH, boxShadow: active ? `inset 0 0 0 1.5px ${CORAL}` : 'none' }}>
                <span className="text-[13.5px] font-bold" style={{ color: active ? CORAL : INK }}>{t.label}</span>
                <span className="text-[10.5px] text-[#A09A94] tabular-nums">{t.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel>How far will you travel?</FieldLabel>
        <div className="rounded-[14px] p-4" style={{ background: PEACH, border: '1px solid #EDE8E2' }}>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[12.5px] text-[#6E6058]">Travel radius</span>
            <span className="text-[14px] font-bold text-[#111] tabular-nums">{data.travelRadius || 5} km</span>
          </div>
          <input type="range" min="1" max="20" value={data.travelRadius || 5} onChange={(e) => set('travelRadius', Number(e.target.value))} className="w-full fylos-range" />
        </div>
      </div>

      {offered.length > 0 && (
        <div className="mb-5">
          <FieldLabel>Your rates</FieldLabel>
          <div className="flex flex-col gap-2.5">
            {offered.map((id) => {
              const meta = SERVICE_RATE_DEFAULTS[id];
              if (!meta) return null;
              const val = rates[id] ?? '';
              return (
                <div key={id} className="flex items-center gap-3 p-3 rounded-[14px]" style={{ background: PEACH, border: '1px solid #EDE8E2' }}>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold text-[#111]">{meta.label}</div>
                    <div className="text-[11px] text-[#A09A94]">Most charge around {meta.suggested} CHF</div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[12px] font-semibold text-[#A09A94]">CHF</span>
                    <input type="text" inputMode="numeric" value={val} onChange={(e) => setRate(id, e.target.value)} placeholder={String(meta.suggested)} className="w-14 h-9 rounded-[10px] text-center text-[14px] font-bold text-[#111] outline-none" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-5">
        <FieldLabel>How owners book you</FieldLabel>
        <div className="flex flex-col gap-2.5">
          {BOOKING_STYLES.map((b) => (
            <OptionRow key={b.id} active={data.bookingStyle === b.id} onClick={() => set('bookingStyle', b.id)} icon={b.icon} title={b.label} desc={b.desc} />
          ))}
        </div>
      </div>

      <div className="mb-5">
        <FieldLabel>Cancellation policy</FieldLabel>
        <div className="flex flex-col gap-2.5">
          {CANCELLATION.map((c) => (
            <OptionRow key={c.id} active={data.cancellation === c.id} onClick={() => set('cancellation', c.id)} title={c.label} desc={c.desc} />
          ))}
        </div>
      </div>

      <ToggleRow on={data.meetGreet} onToggle={() => set('meetGreet', !data.meetGreet)} icon={Heart} label="Free meet & greet first" sub="Meet the pet before the first booking" />
    </div>
  );
};

// ── Step: Safety basics ──
const StepSafety = ({ data, set }) => {
  const acked = data.safetyAck || [];
  const toggle = (id) => set('safetyAck', acked.includes(id) ? acked.filter((x) => x !== id) : [...acked, id]);
  const allAcked = SAFETY_ITEMS.every((s) => acked.includes(s.id));
  return (
    <div className="pro-fade">
      <StepHeader title="The basics of safe care" subtitle="Quick promises every fylos pro makes. Tap each to agree." />

      <div className="flex flex-col gap-2.5">
        {SAFETY_ITEMS.map((s) => {
          const on = acked.includes(s.id);
          return (
            <button key={s.id} onClick={() => toggle(s.id)} className="w-full flex items-start gap-3 p-3.5 rounded-[14px] text-left transition-all active:scale-[0.99]" style={{ background: on ? '#EEF7F1' : PEACH, border: on ? '1px solid #CFE9D8' : '1px solid #EDE8E2' }}>
              <span className="w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 transition-all" style={{ background: on ? '#3F8D63' : 'transparent', boxShadow: on ? 'none' : 'inset 0 0 0 2px #D8D0C6' }}>
                {on && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </span>
              <span className="text-[13px] leading-[1.5] text-[#3A3530]">{s.text}</span>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-4">
        <span className="text-[11.5px] text-[#A09A94]">{acked.length}/{SAFETY_ITEMS.length} agreed</span>
        {allAcked && <Check size={13} className="text-[#3F8D63]" strokeWidth={2.6} />}
      </div>
    </div>
  );
};

// ── Step: Verify you ──
const StepVerify = ({ data, set }) => (
  <div className="pro-fade">
    <StepHeader title="Let's verify you" subtitle="Owners are trusting you with family. This keeps everyone safe." />

    {/* Age + phone (KYC) */}
    <div className="mb-5 flex flex-col gap-3.5">
      <div>
        <TextField label="Date of birth" value={data.dob || ''} onChange={(v) => set('dob', v)} placeholder="DD / MM / YYYY" icon={Calendar} />
        <p className="text-[11px] text-[#A09A94] mt-1.5 pl-1 leading-[1.4]">You must be 18 or older to offer services.</p>
      </div>
      <div>
        <TextField label="Phone number" value={data.phone || ''} onChange={(v) => set('phone', v)} placeholder="+41 79 123 4567" type="tel" icon={Phone} />
        <p className="text-[11px] text-[#A09A94] mt-1.5 pl-1 leading-[1.4]">We'll text a code to verify it.</p>
      </div>
    </div>

    {/* Home address */}
    <div className="mb-5">
      <FieldLabel>Home address</FieldLabel>
      <div className="flex flex-col gap-2.5">
        <TextField value={data.street || ''} onChange={(v) => set('street', v)} placeholder="Street and number" icon={MapPin} />
        <div className="grid grid-cols-[1fr_1.4fr] gap-2.5">
          <TextField value={data.postcode || ''} onChange={(v) => set('postcode', v)} placeholder="Postcode" />
          <TextField value={data.addressCity || data.city || ''} onChange={(v) => set('addressCity', v)} placeholder="City" />
        </div>
      </div>
    </div>

    {/* Identity */}
    <FieldLabel>Identity</FieldLabel>
    <div className="flex flex-col gap-2.5 mb-5">
      <UploadCard done={data.idUploaded} onUpload={() => set('idUploaded', !data.idUploaded)} icon={FileText} title="Photo ID" desc="Passport or ID card" />
      <UploadCard done={data.selfieUploaded} onUpload={() => set('selfieUploaded', !data.selfieUploaded)} icon={ScanFace} title="Quick selfie" desc="To match your ID" />
    </div>

    {/* Consents */}
    <button onClick={() => set('backgroundConsent', !data.backgroundConsent)} className="w-full flex items-start gap-3 p-3.5 rounded-[14px] text-left transition-all active:scale-[0.99]" style={{ background: PEACH, border: '1px solid #EDE8E2' }}>
      <span className="w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 transition-all" style={{ background: data.backgroundConsent ? CORAL : 'transparent', boxShadow: data.backgroundConsent ? 'none' : 'inset 0 0 0 2px #D8D0C6' }}>
        {data.backgroundConsent && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </span>
      <span className="text-[12px] leading-[1.5] text-[#3A3530]">I agree to a background check and confirm I'm legally allowed to work. <span className="font-semibold text-[#E85D2A]">Learn more</span></span>
    </button>

    <button onClick={() => set('termsAccepted', !data.termsAccepted)} className="w-full flex items-start gap-3 p-3.5 rounded-[14px] text-left transition-all active:scale-[0.99] mt-2.5" style={{ background: PEACH, border: '1px solid #EDE8E2' }}>
      <span className="w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0 mt-0.5 transition-all" style={{ background: data.termsAccepted ? CORAL : 'transparent', boxShadow: data.termsAccepted ? 'none' : 'inset 0 0 0 2px #D8D0C6' }}>
        {data.termsAccepted && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
      </span>
      <span className="text-[12px] leading-[1.5] text-[#3A3530]">I accept the <span className="font-semibold text-[#E85D2A]">Provider Agreement</span> and <span className="font-semibold text-[#E85D2A]">Community Guidelines</span>.</span>
    </button>

    <div className="flex items-start gap-2 mt-4 px-1">
      <Shield size={13} className="text-[#A09A94] shrink-0 mt-[1px]" strokeWidth={2} />
      <p className="text-[11px] leading-[1.5] text-[#A09A94]">Your documents are encrypted and only used for verification. They're never shown on your profile. You'll add payout details after you're approved.</p>
    </div>
  </div>
);

// ── Step: Review & submit ──
const StepReview = ({ data, goTo }) => {
  const labelFor = (list, id) => (list.find((x) => x.id === id) || {}).label || id;
  const names = (list, ids = []) => ids.map((id) => labelFor(list, id)).join(', ') || '—';
  const roleLabel = labelFor(ROLES, data.role);
  const serviceIds = [...(data.walkerServices || []), ...(data.sitterServices || [])];
  const serviceLabels = serviceIds.map((id) => (SERVICE_RATE_DEFAULTS[id] || {}).label || id).join(', ');
  const rates = data.rates || {};
  const Row = ({ label, value, step }) => (
    <div className="flex items-start justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A09A94]">{label}</div>
        <div className="text-[13px] text-[#111] mt-0.5 leading-[1.4]">{value}</div>
      </div>
      <button onClick={() => goTo(step)} className="shrink-0 flex items-center gap-1 text-[12px] font-semibold text-[#E85D2A] active:opacity-70 mt-0.5"><Pencil size={11} strokeWidth={2.2} /> Edit</button>
    </div>
  );
  return (
    <div className="pro-fade">
      <StepHeader title="Looks good?" subtitle="A quick check before we send it for review." />

      <div className="rounded-[16px] p-4 mb-3" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}>
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center shrink-0" style={{ background: PEACH }}>
            {(data.photos || []).length ? <img src="https://i.pravatar.cc/200?u=fylospro0" alt="" className="w-full h-full object-cover" /> : <Camera size={18} className="text-[#A09A94]" />}
          </span>
          <div className="min-w-0">
            <div className="text-[16px] font-bold text-[#111]">{data.firstName} {data.lastName}</div>
            <div className="text-[12px] text-[#A09A94] truncate">{data.headline || `${roleLabel} · ${data.city || ''}`}</div>
          </div>
        </div>
      </div>

      <div className="rounded-[16px] px-4 divide-y divide-[#F0EAE2] mb-3" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}>
        <Row label="Services" value={serviceLabels || '—'} step="offer" />
        <Row label="Pets" value={`${names(PET_TYPES, data.petTypes)} · ${names(PET_SIZES, data.petSizes)} · ${names(PET_AGES, data.petAges)}`} step="pets" />
        <Row label="Experience" value={labelFor(EXPERIENCE, data.experience)} step="experience" />
        <Row label="Days" value={(data.days || []).length ? `${(data.days || []).length} days/week` : '—'} step="availability" />
        <Row label="Booking" value={`${data.bookingStyle === 'instant' ? 'Instant book' : data.bookingStyle === 'request' ? 'Review requests' : '—'} · ${labelFor(CANCELLATION, data.cancellation)} cancellation`} step="availability" />
      </div>

      {serviceIds.length > 0 && (
        <div className="rounded-[16px] p-4 mb-3" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}>
          <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#A09A94] mb-2">Your rates</div>
          <div className="flex flex-col gap-1.5">
            {serviceIds.map((id) => {
              const meta = SERVICE_RATE_DEFAULTS[id];
              if (!meta) return null;
              return (
                <div key={id} className="flex items-center justify-between">
                  <span className="text-[12.5px] text-[#3A3530]">{meta.label}</span>
                  <span className="text-[13px] font-bold text-[#111] tabular-nums">CHF {rates[id] || meta.suggested}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rounded-[16px] p-4" style={{ background: '#EEF7F1', border: '1px solid #CFE9D8' }}>
        <div className="flex items-center gap-2">
          <Shield size={15} className="text-[#3F8D63] shrink-0" strokeWidth={2.2} />
          <span className="text-[13px] font-semibold text-[#1F5A3A]">ID, consent and safety checks ready</span>
        </div>
        <p className="text-[11.5px] text-[#3F8D63] mt-1 leading-[1.4]">We'll verify your documents after you submit. Payout setup comes once you're approved.</p>
      </div>
    </div>
  );
};

// ── Intro ──
const StepIntro = ({ onStart, onSignIn, embedded }) => (
  <div className="absolute inset-0 flex flex-col">
    {!embedded && <StatusBar light />}
    <div className="px-6 pt-20 pb-8" style={{ background: CORAL }}>
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-4" style={{ background: 'rgba(255,255,255,0.18)' }}>
        <Sparkles size={12} color="#FFFFFF" strokeWidth={2.2} />
        <span className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-white">Earn with fylos</span>
      </span>
      <h1 className="text-[30px] font-extrabold text-white leading-[1.08] tracking-[-0.02em]">Love dogs?<br />Get paid for it.</h1>
      <p className="text-[14px] text-white/90 mt-3 leading-[1.5]">Join the people near you walking and sitting on their own schedule.</p>
    </div>

    <div className="flex-1 overflow-y-auto px-6 pt-6 pb-4" style={{ background: CREAM, scrollbarWidth: 'none' }}>
      <div className="flex flex-col gap-3">
        {[
          { icon: Clock, title: 'Your own pace', desc: 'Pick the days, times, and pets that suit you.' },
          { icon: Coins, title: 'Fair pay, fast', desc: 'Set your rates. Get paid after every booking.' },
          { icon: Shield, title: 'Backed and insured', desc: 'Every booking is covered and verified.' },
        ].map((r, i) => (
          <div key={i} className="flex items-center gap-3.5 p-4 rounded-[16px]" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}>
            <span className="w-11 h-11 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: '#FFEDE3' }}>
              <r.icon size={20} color={CORAL} strokeWidth={1.9} />
            </span>
            <div className="flex-1">
              <div className="text-[15px] font-bold text-[#111]">{r.title}</div>
              <div className="text-[12.5px] text-[#A09A94] mt-0.5">{r.desc}</div>
            </div>
          </div>
        ))}
        <div className="flex items-center justify-center gap-2 mt-1">
          <Clock size={13} className="text-[#A09A94]" strokeWidth={2} />
          <span className="text-[12px] text-[#A09A94]">Takes about 5 minutes</span>
        </div>
      </div>
    </div>

    <div className="px-6 pt-3 pb-8" style={{ background: CREAM }}>
      <button onClick={onStart} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[16px] active:scale-[0.98] transition-transform" style={{ background: CORAL, boxShadow: '0 4px 16px rgba(232,93,42,0.28)' }}>
        <span className="text-[15.5px] font-bold text-white">Get started</span>
        <ArrowRight size={17} color="#FFFFFF" strokeWidth={2.4} />
      </button>
      <button onClick={onSignIn} className="w-full text-center mt-3 active:opacity-70">
        <span className="text-[13px] text-[#6E6058]">Already a pro? </span>
        <span className="text-[13px] font-bold text-[#E85D2A]">Sign in</span>
      </button>
    </div>
  </div>
);

// ── Submitted ──
const StepDone = ({ onHome, embedded }) => (
  <div className="absolute inset-0 flex flex-col" style={{ background: CREAM }}>
    {!embedded && <StatusBar />}
    <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-8 text-center pt-16" style={{ scrollbarWidth: 'none' }}>
      <div className="relative mb-6">
        <span className="absolute inset-0 rounded-full" style={{ background: 'rgba(63,141,99,0.18)', animation: 'proRing 2s ease-out infinite' }} />
        <span className="relative w-20 h-20 rounded-full flex items-center justify-center" style={{ background: '#3F8D63' }}>
          <Check size={36} color="#FFFFFF" strokeWidth={2.6} />
        </span>
      </div>
      <h1 className="text-[24px] font-extrabold text-[#111] tracking-[-0.02em]">You're in the queue</h1>
      <p className="text-[14px] text-[#6E6058] mt-2 leading-[1.5] max-w-[280px]">We'll review your application and get back to you within 24–48 hours.</p>

      <div className="w-full mt-7 flex flex-col gap-2.5">
        {[
          { n: 1, t: 'We verify your ID', d: 'Usually within a day', done: false },
          { n: 2, t: 'You get the green light', d: 'By email and in-app', done: false },
          { n: 3, t: 'Add your payout details', d: 'So you get paid', done: false },
          { n: 4, t: 'Your profile goes live', d: 'Owners can book you', done: false },
        ].map((s) => (
          <div key={s.n} className="flex items-center gap-3 p-3.5 rounded-[14px] text-left" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}>
            <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[12px] font-bold text-white" style={{ background: CORAL }}>{s.n}</span>
            <div className="flex-1">
              <div className="text-[13.5px] font-bold text-[#111]">{s.t}</div>
              <div className="text-[11.5px] text-[#A09A94]">{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="px-6 pt-3 pb-8">
      <button onClick={onHome} className="w-full py-3.5 rounded-[16px] active:scale-[0.98] transition-transform" style={{ background: INK }}>
        <span className="text-[15px] font-bold text-white">Back to dashboard</span>
      </button>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════════
// MAIN WIZARD
// ════════════════════════════════════════════════════════════════════

const ProRegistration = ({ embedded = false, onExit }) => {
  const [phase, setPhase] = useState('intro');
  const [data, setData] = useState({ travelRadius: 5, groupMax: 3 });
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  // Adaptive — "Your place" only for home boarders (day care / overnight).
  const steps = useMemo(() => {
    const boards = (data.sitterServices || []).includes('daycare') || (data.sitterServices || []).includes('overnight');
    return [
      'offer', 'pets', 'experience',
      ...(boards ? ['place'] : []),
      'profile', 'availability', 'safety', 'verify', 'review',
    ];
  }, [data.sitterServices]);

  const exit = () => { if (onExit) { onExit(); return; } window.history.back(); };
  const exitHome = () => { if (onExit) { onExit(); return; } window.location.href = '/'; };

  const goBack = () => {
    if (phase === 'intro') { exit(); return; }
    if (phase === 0) { setPhase('intro'); return; }
    setPhase((p) => p - 1);
  };
  const goNext = () => {
    if (phase === steps.length - 1) { setPhase('done'); return; }
    setPhase((p) => p + 1);
  };
  const goTo = (name) => { const idx = steps.indexOf(name); if (idx >= 0) setPhase(idx); };

  const canContinue = () => {
    const s = steps[phase];
    if (s === 'offer') {
      if (!data.role) return false;
      if ((data.role === 'walker' || data.role === 'both') && !(data.walkerServices || []).length) return false;
      if ((data.role === 'sitter' || data.role === 'both') && !(data.sitterServices || []).length) return false;
      return true;
    }
    if (s === 'pets') return (data.petTypes || []).length && (data.petSizes || []).length && (data.petAges || []).length;
    if (s === 'experience') return !!data.experience;
    if (s === 'place') return data.homeType && data.outdoor && data.supervision && data.crate && (data.homePets || []).length;
    if (s === 'profile') return (data.photos || []).length && data.firstName && data.lastName && data.headline && data.city && (data.languages || []).length;
    if (s === 'availability') return (data.days || []).length && (data.timeSlots || []).length && data.bookingStyle && data.cancellation;
    if (s === 'safety') return SAFETY_ITEMS.every((x) => (data.safetyAck || []).includes(x.id));
    if (s === 'verify') return data.dob && data.phone && data.street && data.postcode && data.idUploaded && data.selfieUploaded && data.backgroundConsent && data.termsAccepted;
    return true; // review
  };

  const renderStep = () => {
    const s = steps[phase];
    if (s === 'offer') return <StepOffer data={data} set={set} />;
    if (s === 'pets') return <StepPets data={data} set={set} />;
    if (s === 'experience') return <StepExperience data={data} set={set} />;
    if (s === 'place') return <StepPlace data={data} set={set} />;
    if (s === 'profile') return <StepProfile data={data} set={set} />;
    if (s === 'availability') return <StepAvailability data={data} set={set} />;
    if (s === 'safety') return <StepSafety data={data} set={set} />;
    if (s === 'verify') return <StepVerify data={data} set={set} />;
    if (s === 'review') return <StepReview data={data} goTo={goTo} />;
    return null;
  };

  const progress = (phase + 1) / steps.length;
  const isLast = phase === steps.length - 1;

  const styleBlock = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes proFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      .pro-fade { animation: proFade 0.32s cubic-bezier(0.22,1,0.36,1) both; }
      @keyframes proRing { 0% { transform: scale(0.6); opacity: 0.5; } 100% { transform: scale(2.1); opacity: 0; } }
      .fylos-range { -webkit-appearance: none; appearance: none; height: 5px; border-radius: 999px; background: #E0D8CF; outline: none; }
      .fylos-range::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #E85D2A; cursor: pointer; box-shadow: 0 2px 6px rgba(232,93,42,0.3); }
      .fylos-range::-moz-range-thumb { width: 22px; height: 22px; border: none; border-radius: 50%; background: #E85D2A; cursor: pointer; box-shadow: 0 2px 6px rgba(232,93,42,0.3); }
    `}</style>
  );

  const inner = (
    <>
      {phase === 'intro' && <StepIntro onStart={() => setPhase(0)} onSignIn={exit} embedded={embedded} />}
      {phase === 'done' && <StepDone onHome={exitHome} embedded={embedded} />}

      {typeof phase === 'number' && (
        <>
          {!embedded && <StatusBar />}

          {/* Sticky header */}
          <div className="absolute top-0 left-0 right-0 z-40 pt-14 px-5 pb-3" style={{ background: CREAM }}>
            <div className="flex items-center gap-3">
              <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0" style={{ background: PEACH }} aria-label="Back">
                <ChevronLeft size={18} color={INK} strokeWidth={2.2} />
              </button>
              <div className="flex-1 h-[6px] rounded-full overflow-hidden" style={{ background: '#EDE8E2' }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress * 100}%`, background: CORAL }} />
              </div>
              <span className="text-[12px] font-bold text-[#A09A94] tabular-nums shrink-0">{phase + 1}/{steps.length}</span>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="absolute left-0 right-0 overflow-y-auto px-5" style={{ top: 108, bottom: 96, scrollbarWidth: 'none' }}>
            {renderStep()}
          </div>

          {/* Sticky footer */}
          <div className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-8 z-40" style={{ background: `linear-gradient(to top, ${CREAM} 72%, rgba(247,245,242,0))` }}>
            <button onClick={goNext} disabled={!canContinue()} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[16px] transition-all active:scale-[0.98]" style={{ background: canContinue() ? CORAL : '#EDE8E2', boxShadow: canContinue() ? '0 4px 16px rgba(232,93,42,0.26)' : 'none' }}>
              <span className="text-[15.5px] font-bold" style={{ color: canContinue() ? '#FFFFFF' : TERTIARY }}>{isLast ? 'Submit application' : 'Continue'}</span>
              {!isLast && <ArrowRight size={17} color={canContinue() ? '#FFFFFF' : TERTIARY} strokeWidth={2.4} />}
            </button>
          </div>
        </>
      )}
    </>
  );

  if (embedded) {
    return (
      <>
        {styleBlock}
        <div className="absolute inset-0 z-[150] overflow-hidden" style={{ background: CREAM }}>{inner}</div>
      </>
    );
  }

  return (
    <>
      {styleBlock}
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
