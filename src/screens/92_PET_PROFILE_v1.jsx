import React, { useState, useEffect, useRef } from 'react';
import { line, area, curveCatmullRom } from 'd3-shape';
import {
  ChevronLeft, Share2, Pencil, ChevronRight, Syringe, Pill, Stethoscope, Phone,
  FileText, ShieldAlert, Heart, AlertTriangle, Check, Bone, Bell,
  Footprints, Moon, Cookie, Star, Plus, QrCode, Users, MoreHorizontal, Scale,
  Copy, UserPlus, Trash2, X, UploadCloud, Info,
} from 'lucide-react';

/**
 * 92_PET_PROFILE_v1.jsx — Pet profile (Leo). Revolut-style + fully editable.
 * Collapsing header pins the quick-actions + tabs cleanly; content scrolls
 * behind. Detailed, explanatory add/edit forms for every health item & doc.
 * Personality chips only show ×/Add in Edit mode. No "energy level".
 */

const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const TINT = '#FBE7DD';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#9B9B9F';
const GREEN = '#3F8D63';
const AMBER = '#B07A3A';
const DANGER = '#E5484D';
const LINE = '#F1EDE8';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';
const LEO = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400&h=400';

const INIT = {
  name: 'Leo', breed: 'Golden Retriever', species: 'Dog', sex: 'Male', age: '3 yrs', dob: '12 May 2021',
  weight: '28', weightUnit: 'kg', color: 'Light Golden', microchip: '981 020 000 394 857', status: 'Healthy',
  temperament: ['Friendly', 'Playful', 'Affectionate'], triggers: ['Thunder', 'Fireworks'], goodWith: ['Dogs', 'Kids'],
  prefs: { food: 'Royal Canin Golden Retriever Adult · 2× daily', treats: 'Salmon bites, peanut butter', toys: 'Tennis ball, squeaky duck', sleeping: 'Foot of the bed', walking: 'Loves the forest, hates rain' },
  allergies: [{ name: 'Bee stings', sev: 'Severe', reaction: 'Swelling, difficulty breathing' }, { name: 'Chicken', sev: 'Moderate', reaction: 'Itchy skin, ear infections' }, { name: 'Dust mites', sev: 'Mild', reaction: 'Sneezing' }],
  conditions: [{ name: 'Mild arthritis', status: 'Monitored', since: '2023' }],
  meds: [{ name: 'Apoquel', dose: '16 mg', freq: 'Once daily', by: 'Dr. Meier' }, { name: 'NexGard', dose: '1 chew', freq: 'Monthly' }],
  vaccines: [{ name: 'Rabies', date: 'May 2023', next: 'May 2026', by: 'Dr. Meier', ok: true }, { name: 'DHPP', date: 'May 2023', next: 'May 2026', ok: true }, { name: 'Bordetella', date: 'Nov 2025', next: 'in 5 days', ok: false }],
  vet: { clinic: 'Zürich Animal Hospital', name: 'Dr. Meier', phone: '+41 44 123 45 67' },
  emergency: [{ name: 'Alex Mueller', rel: 'Owner', phone: '+41 79 123 45 67', primary: true }, { name: 'Maria Schmidt', rel: 'Partner', phone: '+41 79 987 65 43' }],
  documents: [{ cat: 'Medical records', n: 6 }, { cat: 'Insurance', n: 3 }, { cat: 'Adoption & pedigree', n: 3 }, { cat: 'Legal & passport', n: 2 }, { cat: 'Other', n: 4 }],
};
const TABS = ['About', 'Health', 'Documents', 'Emergency'];
const TEMP_OPTS = ['Friendly', 'Playful', 'Calm', 'Energetic', 'Shy', 'Affectionate', 'Independent', 'Protective', 'Gentle', 'Curious'];
const TRIG_OPTS = ['Thunder', 'Fireworks', 'Strangers', 'Other dogs', 'Loud noises', 'Being alone', 'Car rides', 'Vet visits'];
const GOOD_OPTS = ['Dogs', 'Cats', 'Kids', 'Strangers'];
const SEV = ['Mild', 'Moderate', 'Severe'];
const DOC_CATS = ['Medical records', 'Insurance', 'Adoption & pedigree', 'Legal & passport', 'Other'];
const sevTone = (s) => s === 'Severe' ? 'danger' : s === 'Moderate' ? 'warn' : 'default';

// Detailed, explanatory field configs per health item / document
const FORMS = {
  vaccines: { add: 'Add vaccination', edit: 'Vaccination', note: 'Record each shot your pet has had. Sitters and vets use it to see what’s up to date and what’s coming due.', icon: Syringe, fields: [
    { key: 'name', label: 'Vaccine', ph: 'e.g. Rabies' },
    { key: 'date', label: 'Date given', ph: 'e.g. May 2023' },
    { key: 'next', label: 'Next due', ph: 'e.g. May 2026', opt: true },
    { key: 'by', label: 'Administered by', ph: 'Vet or clinic', opt: true },
    { key: 'lot', label: 'Lot / batch no.', ph: 'Optional', opt: true },
    { key: 'notes', label: 'Notes', ph: 'Anything to remember', opt: true },
  ] },
  allergies: { add: 'Add allergy', edit: 'Allergy', note: 'Note what your pet reacts to, how serious it is and the symptoms, so carers can keep them safe.', icon: AlertTriangle, fields: [
    { key: 'name', label: 'Allergen', ph: 'e.g. Chicken' },
    { key: 'sev', label: 'Severity', options: SEV },
    { key: 'reaction', label: 'Reaction / symptoms', ph: 'e.g. Itchy skin, swelling', opt: true },
    { key: 'notes', label: 'Notes', ph: 'What to do if exposed', opt: true },
  ] },
  conditions: { add: 'Add condition', edit: 'Condition', note: 'Ongoing or past health conditions a carer or vet should be aware of.', icon: Heart, fields: [
    { key: 'name', label: 'Condition', ph: 'e.g. Arthritis' },
    { key: 'status', label: 'Status', options: ['Monitored', 'Treated', 'Resolved'] },
    { key: 'since', label: 'Diagnosed', ph: 'e.g. 2023', opt: true },
    { key: 'notes', label: 'Notes', ph: 'Care instructions', opt: true },
  ] },
  meds: { add: 'Add medication', edit: 'Medication', note: 'Current medications with the exact dose and timing, so a sitter gives the right amount at the right moment.', icon: Pill, fields: [
    { key: 'name', label: 'Medication', ph: 'e.g. Apoquel' },
    { key: 'dose', label: 'Dosage', ph: 'e.g. 16 mg' },
    { key: 'freq', label: 'Frequency', ph: 'e.g. Once daily' },
    { key: 'by', label: 'Prescribed by', ph: 'Optional', opt: true },
    { key: 'notes', label: 'Notes', ph: 'With food, time of day…', opt: true },
  ] },
  documents: { add: 'Add document', edit: 'Document', note: 'Upload certificates, insurance, passports and more. Everything in one safe place.', icon: FileText, upload: true, fields: [
    { key: 'cat', label: 'Category', options: DOC_CATS },
    { key: 'name', label: 'File name', ph: 'e.g. Rabies certificate' },
    { key: 'source', label: 'Source', ph: 'e.g. Vet clinic', opt: true },
    { key: 'date', label: 'Date', ph: 'Optional', opt: true },
  ] },
  emergency: { add: 'Add contact', edit: 'Contact', note: 'People we can reach if something happens to Leo while in someone else’s care.', icon: Users, fields: [
    { key: 'name', label: 'Name', ph: 'Full name' },
    { key: 'rel', label: 'Relationship', ph: 'e.g. Partner, neighbour' },
    { key: 'phone', label: 'Phone', ph: '+41 …' },
  ] },
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

const SectionLabel = ({ children, action, onAction, danger }) => (
  <div className="flex items-center justify-between mb-2 ml-1.5 mr-0.5 mt-6">
    <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A8A29C' }}>{children}</span>
    {action && <button onClick={onAction} className="text-[12px] font-bold active:opacity-60" style={{ color: danger ? DANGER : CORAL }}>{action}</button>}
  </div>
);
const Card = ({ children, className = '' }) => <div className={`bg-white rounded-[18px] overflow-hidden ${className}`} style={{ boxShadow: SHADOW }}>{children}</div>;

const InfoRow = ({ label, value, onClick, last }) => (
  <button onClick={onClick} className="relative w-full flex items-center justify-between px-4 py-3 text-left active:bg-black/[0.02]">
    <span className="text-[13.5px]" style={{ color: MUTED }}>{label}</span>
    <span className="flex items-center gap-1.5 min-w-0"><span className="text-[13.5px] font-semibold text-right truncate" style={{ color: INK }}>{value}</span><ChevronRight size={14} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" /></span>
    {!last && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: LINE }} />}
  </button>
);

const IconRow = ({ icon: Icon, title, sub, right, rightTone, trailing, onClick, last, danger }) => (
  <button onClick={onClick} className="relative w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02] transition-colors">
    <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: danger ? '#FEE8E7' : TINT }}><Icon size={16} color={danger ? DANGER : CORAL} strokeWidth={2} /></span>
    <div className="flex-1 min-w-0">
      <div className="text-[14px] font-semibold truncate" style={{ color: INK }}>{title}</div>
      {sub && <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{sub}</div>}
    </div>
    {right && <span className="text-[11px] font-bold px-2 py-[3px] rounded-full shrink-0" style={{ background: rightTone === 'good' ? '#EAF7EF' : rightTone === 'warn' ? '#FBF1E2' : rightTone === 'danger' ? '#FEE8E7' : PEACH, color: rightTone === 'good' ? GREEN : rightTone === 'warn' ? AMBER : rightTone === 'danger' ? DANGER : MUTED }}>{right}</span>}
    {trailing || <ChevronRight size={15} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />}
    {!last && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: LINE }} />}
  </button>
);

const DisplayChips = ({ items, tone }) => (
  <div className="flex flex-wrap gap-2">{items.map((t) => <span key={t} className="text-[12.5px] font-semibold px-3 py-1.5 rounded-full" style={{ background: tone === 'warn' ? '#FBF1E2' : PEACH, color: tone === 'warn' ? AMBER : MUTED }}>{t}</span>)}</div>
);
const EditChips = ({ items, tone, onRemove, onAdd }) => (
  <div className="flex flex-wrap gap-2">
    {items.map((t) => (
      <span key={t} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold pl-3 pr-1.5 py-1.5 rounded-full" style={{ background: tone === 'warn' ? '#FBF1E2' : PEACH, color: tone === 'warn' ? AMBER : MUTED }}>
        {t}<button onClick={() => onRemove(t)} className="w-4 h-4 rounded-full flex items-center justify-center active:scale-90" style={{ background: 'rgba(0,0,0,0.08)' }}><X size={10} color={tone === 'warn' ? AMBER : MUTED} strokeWidth={3} /></button>
      </span>
    ))}
    <button onClick={onAdd} className="inline-flex items-center gap-1 text-[12.5px] font-bold px-3 py-1.5 rounded-full active:scale-95" style={{ background: '#FFF', boxShadow: SHADOW, color: CORAL }}><Plus size={13} strokeWidth={2.4} /> Add</button>
  </div>
);

/* ── Overlays ───────────────────────────────────────────────────────── */
const Sheet = ({ title, onClose, children }) => (
  <>
    <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'apFade 0.2s ease both' }} onClick={onClose} />
    <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] flex flex-col" style={{ background: CREAM, maxHeight: '86%', boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'apSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
      <div className="flex justify-center pt-2.5 pb-1 shrink-0"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
      <div className="px-5 pt-1 pb-3 flex items-center gap-3 shrink-0">
        <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>{title}</h2>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
      </div>
      <div className="overflow-y-auto px-5 pb-8" style={{ scrollbarWidth: 'none' }}>{children}</div>
    </div>
  </>
);

const Input = ({ value, onChange, placeholder, suffix, autoFocus }) => (
  <div className="flex items-center bg-white rounded-[12px] px-4 h-[50px]" style={{ boxShadow: SHADOW }}>
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} autoFocus={autoFocus} className="flex-1 bg-transparent outline-none text-[15px] font-semibold text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" />
    {suffix && <span className="text-[13px] font-bold" style={{ color: TERT }}>{suffix}</span>}
  </div>
);
const FieldLabel = ({ children, opt }) => <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-1.5 ml-0.5 mt-4" style={{ color: TERT }}>{children}{opt && <span className="font-semibold lowercase tracking-normal" style={{ color: '#C4B8AC' }}> · optional</span>}</div>;
const Seg = ({ options, value, onChange }) => (
  <div className="flex gap-2">{options.map((o) => { const on = value === o; return <button key={o} onClick={() => onChange(o)} className="flex-1 h-[44px] rounded-[12px] text-[13px] font-bold active:scale-[0.97]" style={{ background: on ? '#FFF3EC' : '#FFF', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>{o}</button>; })}</div>
);
const PrimaryBtn = ({ children, onClick, disabled }) => <button onClick={onClick} disabled={disabled} className="w-full mt-6 py-3.5 rounded-[16px] active:scale-[0.98]" style={{ background: disabled ? '#EAE3DB' : CORAL, boxShadow: disabled ? 'none' : '0 6px 18px rgba(232,93,42,0.26)' }}><span className="text-[15px] font-bold" style={{ color: disabled ? TERT : '#fff' }}>{children}</span></button>;

const MultiSheet = ({ title, options, values, onApply, onClose }) => {
  const [sel, setSel] = useState([...values]);
  const [draft, setDraft] = useState('');
  const all = [...new Set([...options, ...sel])];
  const toggle = (o) => setSel((s) => s.includes(o) ? s.filter((x) => x !== o) : [...s, o]);
  return (
    <Sheet title={title} onClose={onClose}>
      <Card>
        {all.map((o, i) => { const on = sel.includes(o); return (
          <button key={o} onClick={() => toggle(o)} className="relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.02]">
            <span className="flex-1 text-[15px] font-semibold" style={{ color: INK }}>{o}</span>
            <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0" style={{ background: on ? CORAL : 'transparent', border: on ? 'none' : '1.6px solid #DDD4C9' }}>{on && <Check size={13} color="#FFF" strokeWidth={3} />}</span>
            {i < all.length - 1 && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: LINE }} />}
          </button>
        ); })}
      </Card>
      <div className="flex items-center gap-2 mt-3">
        <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add your own" className="flex-1 bg-white rounded-[12px] px-3.5 h-[46px] outline-none text-[14px] font-medium text-[#111] placeholder:text-[#C4B8AC]" style={{ boxShadow: SHADOW }} />
        <button onClick={() => { const v = draft.trim(); if (v && !sel.includes(v)) { setSel([...sel, v]); setDraft(''); } }} className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 active:scale-90" style={{ background: draft.trim() ? CORAL : '#EAE3DB' }}><Plus size={18} color={draft.trim() ? '#FFF' : TERT} strokeWidth={2.4} /></button>
      </div>
      <PrimaryBtn onClick={() => { onApply(sel); onClose(); }}>Done</PrimaryBtn>
    </Sheet>
  );
};

const FieldSheet = ({ title, value, placeholder, suffix, onSave, onClose }) => {
  const [v, setV] = useState(value || '');
  return <Sheet title={title} onClose={onClose}><div className="mt-1"><Input value={v} onChange={setV} placeholder={placeholder} suffix={suffix} autoFocus /></div><PrimaryBtn onClick={() => { onSave(v); onClose(); }}>Save</PrimaryBtn></Sheet>;
};

const ItemSheet = ({ form, item, onSave, onRemove, onClose, act }) => {
  const [v, setV] = useState(item ? { ...item } : form.fields.reduce((a, f) => ({ ...a, [f.key]: f.options ? f.options[0] : '' }), {}));
  const set = (k, val) => setV((s) => ({ ...s, [k]: val }));
  const valid = form.fields.filter((f) => !f.opt && !f.options).every((f) => (v[f.key] || '').toString().trim());
  return (
    <Sheet title={item ? form.edit : form.add} onClose={onClose}>
      <div className="flex items-start gap-2 rounded-[12px] px-3.5 py-3 mb-1" style={{ background: PEACH }}>
        <Info size={14} color={MUTED} strokeWidth={2} className="mt-0.5 shrink-0" />
        <p className="text-[11.5px] leading-[1.45]" style={{ color: MUTED }}>{form.note}</p>
      </div>
      {form.upload && (
        <button onClick={() => act('File picker (demo)')} className="w-full mt-4 flex flex-col items-center gap-2 py-6 rounded-[16px] active:scale-[0.99]" style={{ border: '1.5px dashed #D6CDC2', background: '#FFF' }}>
          <span className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: TINT }}><UploadCloud size={20} color={CORAL} strokeWidth={2} /></span>
          <span className="text-[13.5px] font-bold" style={{ color: INK }}>Upload a file</span>
          <span className="text-[11px]" style={{ color: TERT }}>PDF or photo · up to 20 MB</span>
        </button>
      )}
      {form.fields.map((f) => (
        <div key={f.key}>
          <FieldLabel opt={f.opt}>{f.label}</FieldLabel>
          {f.options ? <Seg options={f.options} value={v[f.key]} onChange={(val) => set(f.key, val)} /> : <Input value={v[f.key] || ''} onChange={(val) => set(f.key, val)} placeholder={f.ph} autoFocus={!form.upload && f === form.fields[0]} />}
        </div>
      ))}
      <PrimaryBtn disabled={!valid} onClick={() => { if (valid) { onSave(v); onClose(); } }}>{item ? 'Save changes' : form.add}</PrimaryBtn>
      {item && onRemove && <button onClick={() => { onRemove(); onClose(); }} className="w-full mt-2.5 py-3"><span className="text-[14px] font-bold" style={{ color: DANGER }}>Remove</span></button>}
    </Sheet>
  );
};

const ShareSheet = ({ onClose, act }) => (
  <Sheet title="Share Leo" onClose={onClose}>
    <div className="rounded-[18px] overflow-hidden p-5 text-center" style={{ background: 'linear-gradient(150deg,#EF6A3C,#E85D2A 52%,#D44D1B)' }}>
      <span className="inline-flex w-12 h-12 rounded-full items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.18)' }}><QrCode size={24} color="#fff" strokeWidth={2} /></span>
      <p className="text-[13px] leading-[1.45]" style={{ color: 'rgba(255,255,255,0.92)' }}>Let a sitter or vet see exactly how to care for Leo.</p>
      <button onClick={() => act('Link copied')} className="w-full mt-4 py-3 rounded-[16px] bg-white active:scale-[0.98] inline-flex items-center justify-center gap-2"><Copy size={15} color={CORAL} strokeWidth={2.2} /><span className="text-[14px] font-bold" style={{ color: CORAL }}>Copy share link</span></button>
    </div>
  </Sheet>
);

const MoreSheet = ({ onClose, act, onShare, onLost }) => {
  const items = [{ icon: Share2, t: 'Share profile', f: onShare }, { icon: ShieldAlert, t: 'Set as lost', f: onLost }, { icon: UserPlus, t: 'Transfer ownership', f: () => act('Transfer ownership') }, { icon: Trash2, t: 'Remove pet', f: () => act('Remove pet'), danger: true }];
  return (
    <Sheet title="Leo" onClose={onClose}>
      <Card>{items.map((it, i) => (
        <button key={it.t} onClick={() => { onClose(); setTimeout(it.f, 60); }} className="relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.02]">
          <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: it.danger ? '#FEE8E7' : TINT }}><it.icon size={16} color={it.danger ? DANGER : CORAL} strokeWidth={2} /></span>
          <span className="flex-1 text-[14.5px] font-semibold" style={{ color: it.danger ? DANGER : INK }}>{it.t}</span>
          {i < items.length - 1 && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: LINE }} />}
        </button>
      ))}</Card>
    </Sheet>
  );
};

const LostDialog = ({ onClose, onActivate }) => (
  <div className="absolute inset-0 z-[170] flex items-center justify-center px-8" style={{ background: 'rgba(20,12,8,0.45)', animation: 'apFade 0.2s ease both' }} onClick={onClose}>
    <div className="w-full rounded-[24px] bg-white p-6 text-center" style={{ animation: 'apPop 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }} onClick={(e) => e.stopPropagation()}>
      <span className="inline-flex w-14 h-14 rounded-full items-center justify-center mb-4" style={{ background: '#FEE8E7' }}><ShieldAlert size={26} color={DANGER} strokeWidth={2} /></span>
      <h2 className="text-[19px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Activate lost mode?</h2>
      <p className="text-[13px] mt-2 leading-[1.5]" style={{ color: MUTED }}>Nearby fylos members will be alerted and your contact details shown on Leo's public page.</p>
      <button onClick={onActivate} className="w-full mt-5 py-3.5 rounded-[16px] active:scale-[0.98]" style={{ background: DANGER }}><span className="text-[15px] font-bold text-white">Activate lost mode</span></button>
      <button onClick={onClose} className="w-full mt-2.5 py-2.5"><span className="text-[14px] font-bold" style={{ color: MUTED }}>Cancel</span></button>
    </div>
  </div>
);

// Weight trend — static six-month series powering the Health tab sparkline + expanded chart
const WEIGHTS = [27.1, 27.4, 27.8, 28.2, 28.0, 28.0];
const W_MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
const W_MIN = Math.min(...WEIGHTS);
const W_MAX = Math.max(...WEIGHTS);
const W_COLOR = Math.abs(WEIGHTS[WEIGHTS.length - 1] - WEIGHTS[0]) <= 0.5 ? GREEN : CORAL;

const WeightSection = ({ weight, unit }) => {
  const [open, setOpen] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const [scrub, setScrub] = useState(null);
  const chartRef = useRef(null);
  // Mounts fresh each time the Health tab opens, so the draw-on re-triggers every visit
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 60); return () => clearTimeout(t); }, []);

  // Sparkline (90×28)
  const SW = 90, SH = 28, SP = 4;
  const sx = (i) => SP + (i * (SW - SP * 2)) / (WEIGHTS.length - 1);
  const sy = (v) => SP + ((W_MAX - v) * (SH - SP * 2)) / (W_MAX - W_MIN);
  const sparkD = line().x((_, i) => sx(i)).y((v) => sy(v)).curve(curveCatmullRom)(WEIGHTS);

  // Expanded chart (full width × 110)
  const VW = 318, VH = 110, PX = 10, PT = 14, PB = 8;
  const cx = (i) => PX + (i * (VW - PX * 2)) / (WEIGHTS.length - 1);
  const cy = (v) => PT + ((W_MAX - v) * (VH - PT - PB)) / (W_MAX - W_MIN);
  const lineD = line().x((_, i) => cx(i)).y((v) => cy(v)).curve(curveCatmullRom)(WEIGHTS);
  const areaD = area().x((_, i) => cx(i)).y0(VH).y1((v) => cy(v)).curve(curveCatmullRom)(WEIGHTS);
  const toIdx = (e) => {
    const r = chartRef.current.getBoundingClientRect();
    const f = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    return Math.round(f * (WEIGHTS.length - 1));
  };

  return (
    <>
      <Card>
        <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left active:bg-black/[0.02]">
          <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: TINT }}><Scale size={18} color={CORAL} strokeWidth={2} /></span>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1"><span className="text-[22px] font-extrabold" style={{ color: INK }}>{weight}</span><span className="text-[13px] font-bold" style={{ color: TERT }}>{unit}</span></div>
            <div className="text-[11.5px] mt-0.5 font-semibold" style={{ color: GREEN }}>Healthy range</div>
          </div>
          <svg width={SW} height={SH} viewBox={`0 0 ${SW} ${SH}`} className="shrink-0">
            <path d={sparkD} fill="none" stroke={W_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" pathLength="100" strokeDasharray="100" strokeDashoffset={drawn ? 0 : 100} style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)' }} />
            <circle cx={sx(WEIGHTS.length - 1)} cy={sy(WEIGHTS[WEIGHTS.length - 1])} r={3} fill={W_COLOR} style={{ opacity: drawn ? 1 : 0, transition: 'opacity 0.2s ease 0.6s' }} />
          </svg>
        </button>
      </Card>
      <div style={{ maxHeight: open ? 220 : 0, opacity: open ? 1 : 0, overflow: 'hidden', transition: 'max-height 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s cubic-bezier(0.22,1,0.36,1)' }}>
        <div className="bg-white rounded-[16px] p-4 mt-2.5" style={{ boxShadow: SHADOW }}>
          <div ref={chartRef} className="relative" style={{ touchAction: 'none' }}
            onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); setScrub(toIdx(e)); }}
            onPointerMove={(e) => { if (e.buttons) setScrub(toIdx(e)); }}
            onPointerUp={() => setTimeout(() => setScrub(null), 120)}
            onPointerCancel={() => setScrub(null)}>
            <svg width="100%" height={VH} viewBox={`0 0 ${VW} ${VH}`} preserveAspectRatio="none" style={{ display: 'block' }}>
              <defs><linearGradient id="wTrendGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={CORAL} stopOpacity="0.3" /><stop offset="100%" stopColor={CORAL} stopOpacity="0" /></linearGradient></defs>
              <path d={areaD} fill="url(#wTrendGrad)" />
              <path d={lineD} fill="none" stroke={W_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              {scrub != null && <>
                <line x1={cx(scrub)} x2={cx(scrub)} y1={0} y2={VH} stroke="#E0D7CC" strokeWidth={1} vectorEffect="non-scaling-stroke" />
                <circle cx={cx(scrub)} cy={cy(WEIGHTS[scrub])} r={5} fill={CORAL} />
              </>}
            </svg>
            {scrub != null && (
              <div className="absolute bg-white rounded-full px-2 py-[3px] pointer-events-none whitespace-nowrap text-[10.5px] font-bold" style={{ color: INK, boxShadow: SHADOW, left: `${Math.min(Math.max((cx(scrub) / VW) * 100, 14), 86)}%`, top: cy(WEIGHTS[scrub]) - 12, transform: 'translate(-50%, -100%)' }}>
                {WEIGHTS[scrub].toFixed(1)} {unit} · {W_MONTHS[scrub]}
              </div>
            )}
          </div>
          <div className="flex justify-between mt-1.5 px-0.5">
            {W_MONTHS.map((m, i) => <span key={m} className={`text-[10px] ${i === W_MONTHS.length - 1 ? 'font-bold' : 'font-semibold'}`} style={{ color: i === W_MONTHS.length - 1 ? INK : TERT }}>{m}</span>)}
          </div>
        </div>
      </div>
    </>
  );
};

const PetProfile = ({ embedded = false, onBack, pet }) => {
  const [data, setData] = useState(() => ({
    ...INIT,
    name: pet?.name || INIT.name,
    breed: pet?.breed || INIT.breed,
    sex: pet?.sex || INIT.sex,
    age: pet?.age ? `${pet.age} yrs` : INIT.age,
    weight: pet?.weight ? String(pet.weight) : INIT.weight,
    temperament: [...INIT.temperament], triggers: [...INIT.triggers], goodWith: [...INIT.goodWith], prefs: { ...INIT.prefs }, allergies: [...INIT.allergies], conditions: [...INIT.conditions], meds: [...INIT.meds], vaccines: [...INIT.vaccines], documents: [...INIT.documents], emergency: [...INIT.emergency],
  }));
  const photo = pet?.photo || pet?.avatar || LEO;
  const [tab, setTab] = useState('About');
  const [scrolled, setScrolled] = useState(false);
  const [editP, setEditP] = useState(false);
  const [sheet, setSheet] = useState(null);
  const [lostOpen, setLostOpen] = useState(false);
  const [lostActive, setLostActive] = useState(false);
  const [toast, setToast] = useState('');
  const back = () => { if (onBack) return onBack(); if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };
  const act = (m) => { setToast(m); setTimeout(() => setToast(''), 1700); };
  const setField = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const setPref = (k, v) => setData((d) => ({ ...d, prefs: { ...d.prefs, [k]: v } }));
  const setList = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const openItem = (sec, item, idx) => setSheet({ k: 'item', sec, form: FORMS[sec], item, idx });
  const saveItem = (s, v) => s.idx != null ? setData((d) => ({ ...d, [s.sec]: d[s.sec].map((x, j) => j === s.idx ? { ...x, ...v } : x) })) : setData((d) => ({ ...d, [s.sec]: [...d[s.sec], s.sec === 'documents' ? { cat: v.cat, n: 1 } : v] }));

  const ACTIONS = [
    { icon: Share2, l: 'Share', f: () => setSheet({ k: 'share' }) },
    { icon: Pencil, l: 'Edit', f: () => { setTab('About'); setEditP(true); } },
    { icon: FileText, l: 'Records', f: () => setTab('Documents') },
    { icon: ShieldAlert, l: 'Lost', danger: true, f: () => setLostOpen(true) },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes apFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes apSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes apPop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes apToast { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
      <div style={embedded ? { position: 'absolute', inset: 0, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' } : { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="relative" style={embedded ? { position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: CREAM } : { width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
          {!embedded && <>
            <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
            <StatusBar />
          </>}

          {/* Top bar — transparent over hero, solid cream once collapsed */}
          <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none" style={{ paddingTop: 54, background: scrolled ? CREAM : 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 60%, rgba(247,245,242,0) 100%)', transition: 'background 0.18s' }}>
            <div className="flex items-center px-5 pointer-events-auto" style={{ height: 44 }}>
              <button onClick={back} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 bg-white shrink-0" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
              <span className="flex-1 text-center text-[16px] font-bold tracking-[-0.01em] transition-opacity duration-200" style={{ color: INK, opacity: scrolled ? 1 : 0 }}>{data.name}</span>
              <button onClick={() => setSheet({ k: 'more' })} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 bg-white shrink-0" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><MoreHorizontal size={18} color={INK} strokeWidth={2.2} /></button>
            </div>
          </div>

          <div onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 140)} className="absolute inset-0 overflow-y-auto" style={{ background: CREAM, scrollbarWidth: 'none' }}>
            {/* Hero (scrolls away cleanly behind the solid top bar) */}
            <div className="flex flex-col items-center px-6" style={{ paddingTop: 108 }}>
              <img src={photo} alt={data.name} className="w-[92px] h-[92px] rounded-full object-cover" style={{ boxShadow: '0 10px 26px rgba(60,30,15,0.14)' }} />
              <h1 className="text-[24px] font-extrabold tracking-[-0.02em] mt-3.5" style={{ color: INK }}>{data.name}</h1>
              <p className="text-[13px] mt-1" style={{ color: MUTED }}>{data.breed} · {data.sex} · {data.age}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full mt-2.5" style={{ background: '#EAF7EF', color: GREEN }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /> {data.status}</span>
            </div>

            {/* Pinned: quick actions + tabs */}
            <div className="sticky z-30 mt-6" style={{ top: 98, background: CREAM, boxShadow: scrolled ? '0 10px 16px -12px rgba(60,30,15,0.18)' : 'none', transition: 'box-shadow 0.2s' }}>
              <div className="flex justify-center gap-7 pb-4">
                {ACTIONS.map((a) => { const Icon = a.icon; return (
                  <button key={a.l} onClick={a.f} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                    <span className="w-[52px] h-[52px] rounded-full flex items-center justify-center" style={{ background: a.danger ? '#FEE8E7' : TINT }}><Icon size={20} color={a.danger ? DANGER : CORAL} strokeWidth={2} /></span>
                    <span className="text-[11.5px] font-semibold" style={{ color: INK }}>{a.l}</span>
                  </button>
                ); })}
              </div>
              <div className="flex gap-6 px-5 overflow-x-auto" style={{ scrollbarWidth: 'none', borderBottom: '1px solid ' + LINE }}>
                {TABS.map((t) => { const on = tab === t; return (
                  <button key={t} onClick={() => setTab(t)} className="relative shrink-0 pt-1 pb-3 text-[14px] font-bold transition-colors" style={{ color: on ? CORAL : TERT }}>{t}{on && <span className="absolute left-0 right-0 rounded-full" style={{ bottom: -1, height: 2.5, background: CORAL }} />}</button>
                ); })}
              </div>
            </div>

            <div className="px-5" style={{ paddingBottom: embedded ? 120 : 48 }}>
              {tab === 'About' && (
                <>
                  <SectionLabel action={editP ? 'Done' : 'Edit'} onAction={() => setEditP(!editP)}>Details</SectionLabel>
                  <Card>
                    <InfoRow label="Breed" value={data.breed} onClick={() => setSheet({ k: 'field', title: 'Breed', val: data.breed, save: (v) => setField('breed', v) })} />
                    <InfoRow label="Sex" value={data.sex} onClick={() => setSheet({ k: 'field', title: 'Sex', val: data.sex, save: (v) => setField('sex', v) })} />
                    <InfoRow label="Age" value={`${data.age} · ${data.dob}`} onClick={() => setSheet({ k: 'field', title: 'Date of birth', val: data.dob, save: (v) => setField('dob', v) })} />
                    <InfoRow label="Weight" value={`${data.weight} ${data.weightUnit}`} onClick={() => setSheet({ k: 'field', title: 'Weight', val: data.weight, suffix: data.weightUnit, save: (v) => setField('weight', v) })} />
                    <InfoRow label="Color" value={data.color} onClick={() => setSheet({ k: 'field', title: 'Color', val: data.color, save: (v) => setField('color', v) })} />
                    <InfoRow label="Microchip" value={data.microchip} onClick={() => setSheet({ k: 'field', title: 'Microchip', val: data.microchip, save: (v) => setField('microchip', v) })} last />
                  </Card>

                  <SectionLabel>Personality</SectionLabel>
                  <Card className="p-4">
                    <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2.5" style={{ color: TERT }}>Temperament</div>
                    {editP ? <EditChips items={data.temperament} onRemove={(t) => setList('temperament', data.temperament.filter((x) => x !== t))} onAdd={() => setSheet({ k: 'multi', title: 'Temperament', options: TEMP_OPTS, values: data.temperament, apply: (v) => setList('temperament', v) })} /> : <DisplayChips items={data.temperament} />}
                    <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2.5 mt-4" style={{ color: TERT }}>Anxiety triggers</div>
                    {editP ? <EditChips items={data.triggers} tone="warn" onRemove={(t) => setList('triggers', data.triggers.filter((x) => x !== t))} onAdd={() => setSheet({ k: 'multi', title: 'Anxiety triggers', options: TRIG_OPTS, values: data.triggers, apply: (v) => setList('triggers', v) })} /> : <DisplayChips items={data.triggers} tone="warn" />}
                    <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2.5 mt-4" style={{ color: TERT }}>Good with</div>
                    {editP ? <EditChips items={data.goodWith} onRemove={(t) => setList('goodWith', data.goodWith.filter((x) => x !== t))} onAdd={() => setSheet({ k: 'multi', title: 'Good with', options: GOOD_OPTS, values: data.goodWith, apply: (v) => setList('goodWith', v) })} /> : <DisplayChips items={data.goodWith} />}
                  </Card>

                  <SectionLabel action={editP ? 'Done' : 'Edit'} onAction={() => setEditP(!editP)}>Daily care</SectionLabel>
                  <Card>
                    <IconRow icon={Bone} title="Food" sub={data.prefs.food} onClick={() => setSheet({ k: 'field', title: 'Food', val: data.prefs.food, save: (v) => setPref('food', v) })} />
                    <IconRow icon={Cookie} title="Treats" sub={data.prefs.treats} onClick={() => setSheet({ k: 'field', title: 'Treats', val: data.prefs.treats, save: (v) => setPref('treats', v) })} />
                    <IconRow icon={Star} title="Toys" sub={data.prefs.toys} onClick={() => setSheet({ k: 'field', title: 'Toys', val: data.prefs.toys, save: (v) => setPref('toys', v) })} />
                    <IconRow icon={Moon} title="Sleeping spot" sub={data.prefs.sleeping} onClick={() => setSheet({ k: 'field', title: 'Sleeping spot', val: data.prefs.sleeping, save: (v) => setPref('sleeping', v) })} />
                    <IconRow icon={Footprints} title="Walking" sub={data.prefs.walking} onClick={() => setSheet({ k: 'field', title: 'Walking habits', val: data.prefs.walking, save: (v) => setPref('walking', v) })} last />
                  </Card>
                </>
              )}

              {tab === 'Health' && (
                <>
                  <SectionLabel action="Log" onAction={() => setSheet({ k: 'field', title: 'Weight', val: data.weight, suffix: data.weightUnit, save: (v) => setField('weight', v) })}>Weight</SectionLabel>
                  <WeightSection weight={data.weight} unit={data.weightUnit} />

                  <SectionLabel action="Add" onAction={() => openItem('vaccines')}>Vaccinations</SectionLabel>
                  <Card>
                    {data.vaccines.map((v, i) => <IconRow key={i} icon={Syringe} title={v.name} sub={`Given ${v.date}${v.next ? ` · Next ${v.next}` : ''}`} right={v.ok ? 'Up to date' : 'Due soon'} rightTone={v.ok ? 'good' : 'warn'} onClick={() => openItem('vaccines', v, i)}
                      trailing={!v.ok ? <button onClick={(e) => { e.stopPropagation(); setData((d) => ({ ...d, vaccines: d.vaccines.map((x, j) => j === i ? { ...x, reminded: !x.reminded } : x) })); act(v.reminded ? 'Reminder off' : 'Reminder on. It will show in Coming up'); }} className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 active:scale-90 transition-transform" style={{ background: v.reminded === false ? PEACH : TINT }}><Bell size={14} color={v.reminded === false ? MUTED : CORAL} strokeWidth={2.2} fill={v.reminded === false ? 'none' : CORAL} /></button> : undefined}
                      last={i === data.vaccines.length - 1} />)}
                    {!data.vaccines.length && <div className="px-4 py-4 text-[13px]" style={{ color: TERT }}>No vaccines yet. Tap Add.</div>}
                  </Card>

                  <SectionLabel action="Add" onAction={() => openItem('allergies')}>Allergies</SectionLabel>
                  <Card>
                    {data.allergies.map((a, i) => <IconRow key={i} icon={AlertTriangle} title={a.name} sub={a.reaction} right={a.sev} rightTone={sevTone(a.sev)} danger={a.sev === 'Severe'} onClick={() => openItem('allergies', a, i)} last={i === data.allergies.length - 1} />)}
                    {!data.allergies.length && <div className="px-4 py-4 text-[13px]" style={{ color: TERT }}>None recorded. Tap Add.</div>}
                  </Card>

                  <SectionLabel action="Add" onAction={() => openItem('conditions')}>Conditions</SectionLabel>
                  <Card>
                    {data.conditions.map((c, i) => <IconRow key={i} icon={Heart} title={c.name} sub={c.since ? `Since ${c.since}` : undefined} right={c.status} rightTone="warn" onClick={() => openItem('conditions', c, i)} last={i === data.conditions.length - 1} />)}
                    {!data.conditions.length && <div className="px-4 py-4 text-[13px]" style={{ color: TERT }}>None recorded. Tap Add.</div>}
                  </Card>

                  <SectionLabel action="Add" onAction={() => openItem('meds')}>Medications</SectionLabel>
                  <Card>
                    {data.meds.map((m, i) => <IconRow key={i} icon={Pill} title={m.name} sub={`${m.dose} · ${m.freq}`} right="Active" rightTone="good" onClick={() => openItem('meds', m, i)} last={i === data.meds.length - 1} />)}
                    {!data.meds.length && <div className="px-4 py-4 text-[13px]" style={{ color: TERT }}>None yet. Tap Add.</div>}
                  </Card>

                  <SectionLabel>Veterinarian</SectionLabel>
                  <Card><IconRow icon={Stethoscope} title={data.vet.clinic} sub={`${data.vet.name} · ${data.vet.phone}`} onClick={() => act('Vet details')} trailing={<button onClick={(e) => { e.stopPropagation(); act(`Calling ${data.vet.name}…`); }} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#EAF7EF' }}><Phone size={15} color={GREEN} strokeWidth={2.2} /></button>} last /></Card>
                </>
              )}

              {tab === 'Documents' && (
                <>
                  <SectionLabel action="+ Add" onAction={() => openItem('documents')}>Documents</SectionLabel>
                  <Card>{data.documents.map((d, i) => <IconRow key={i} icon={FileText} title={d.cat} sub={`${d.n} file${d.n > 1 ? 's' : ''}`} onClick={() => act(d.cat)} last={i === data.documents.length - 1} />)}</Card>
                  <button onClick={() => openItem('documents')} className="w-full mt-3 py-3.5 rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.99]" style={{ border: '1.5px dashed #D6CDC2' }}><Plus size={15} color={MUTED} strokeWidth={2.4} /><span className="text-[13.5px] font-semibold" style={{ color: MUTED }}>Add a document</span></button>
                </>
              )}

              {tab === 'Emergency' && (
                <>
                  <div className="rounded-[18px] overflow-hidden mt-6 p-4 flex items-center gap-3.5" style={{ background: lostActive ? '#EAF7EF' : '#FEE8E7' }}>
                    <span className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-white"><ShieldAlert size={20} color={lostActive ? GREEN : DANGER} strokeWidth={2} /></span>
                    <div className="flex-1"><div className="text-[14.5px] font-bold" style={{ color: INK }}>{lostActive ? 'Lost mode is on' : 'Lost pet mode'}</div><div className="text-[12px] mt-0.5" style={{ color: MUTED }}>{lostActive ? 'Members are being alerted' : 'Alert nearby members & share contact'}</div></div>
                    <button onClick={() => lostActive ? (setLostActive(false), act('Lost mode off')) : setLostOpen(true)} className="px-3.5 h-9 rounded-full text-[13px] font-bold text-white active:scale-95" style={{ background: lostActive ? GREEN : DANGER }}>{lostActive ? 'Turn off' : 'Activate'}</button>
                  </div>
                  <SectionLabel action="Add" onAction={() => openItem('emergency')}>Emergency contacts</SectionLabel>
                  <Card>{data.emergency.map((c, i) => <IconRow key={i} icon={c.primary ? Star : Users} title={c.name} sub={`${c.rel} · ${c.phone}`} right={c.primary ? 'Primary' : undefined} onClick={() => openItem('emergency', c, i)} trailing={<button onClick={(e) => { e.stopPropagation(); act(`Calling ${c.name}…`); }} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 ml-1" style={{ background: '#EAF7EF' }}><Phone size={15} color={GREEN} strokeWidth={2.2} /></button>} last={i === data.emergency.length - 1} />)}</Card>
                  <SectionLabel>Veterinarian</SectionLabel>
                  <Card><IconRow icon={Stethoscope} title={data.vet.clinic} sub={data.vet.phone} onClick={() => act('Vet details')} trailing={<button onClick={(e) => { e.stopPropagation(); act(`Calling ${data.vet.name}…`); }} className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#EAF7EF' }}><Phone size={15} color={GREEN} strokeWidth={2.2} /></button>} last /></Card>
                </>
              )}

              {tab === 'Share' && (
                <>
                  <div className="rounded-[20px] overflow-hidden mt-6 p-5 text-center" style={{ background: 'linear-gradient(150deg,#EF6A3C,#E85D2A 52%,#D44D1B)', boxShadow: '0 10px 28px rgba(232,93,42,0.22)' }}>
                    <span className="inline-flex w-12 h-12 rounded-full items-center justify-center mb-3" style={{ background: 'rgba(255,255,255,0.18)' }}><QrCode size={24} color="#fff" strokeWidth={2} /></span>
                    <div className="text-[16px] font-extrabold text-white">Share Leo's profile</div>
                    <p className="text-[12.5px] mt-1.5 leading-[1.45]" style={{ color: 'rgba(255,255,255,0.85)' }}>Let a sitter or vet see exactly how to care for Leo.</p>
                    <button onClick={() => setSheet({ k: 'share' })} className="w-full mt-4 py-3 rounded-[16px] bg-white active:scale-[0.98]"><span className="text-[14px] font-bold" style={{ color: CORAL }}>Create share link</span></button>
                  </div>
                  <SectionLabel>Who has access</SectionLabel>
                  <Card>
                    <IconRow icon={Users} title="Maria Schmidt" sub="Can view · expires in 22h" onClick={() => act('Manage Maria')} />
                    <IconRow icon={Stethoscope} title="Dr. Meier" sub="Full health access" onClick={() => act('Manage Dr. Meier')} last />
                  </Card>
                </>
              )}
            </div>
          </div>

          {/* Overlays */}
          {sheet?.k === 'field' && <FieldSheet title={sheet.title} value={sheet.val} suffix={sheet.suffix} onSave={sheet.save} onClose={() => setSheet(null)} />}
          {sheet?.k === 'multi' && <MultiSheet title={sheet.title} options={sheet.options} values={sheet.values} onApply={sheet.apply} onClose={() => setSheet(null)} />}
          {sheet?.k === 'item' && <ItemSheet form={sheet.form} item={sheet.item} act={act} onSave={(v) => saveItem(sheet, v)} onRemove={sheet.idx != null ? () => setData((d) => ({ ...d, [sheet.sec]: d[sheet.sec].filter((_, j) => j !== sheet.idx) })) : null} onClose={() => setSheet(null)} />}
          {sheet?.k === 'share' && <ShareSheet onClose={() => setSheet(null)} act={act} />}
          {sheet?.k === 'more' && <MoreSheet onClose={() => setSheet(null)} act={act} onShare={() => setSheet({ k: 'share' })} onLost={() => setLostOpen(true)} />}
          {lostOpen && <LostDialog onClose={() => setLostOpen(false)} onActivate={() => { setLostActive(true); setLostOpen(false); act('Lost mode activated'); }} />}
          {toast && <div className="absolute left-1/2 z-[200] px-4 py-2.5 rounded-full" style={{ bottom: embedded ? 108 : 38, transform: 'translateX(-50%)', background: INK, animation: 'apToast 0.2s ease both' }}><span className="text-[13px] font-semibold text-white whitespace-nowrap">{toast}</span></div>}
        </div>
      </div>
    </>
  );
};

export default PetProfile;
