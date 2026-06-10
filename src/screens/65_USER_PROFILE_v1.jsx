import React, { useState } from 'react';
import InviteFriends from './60_INVITE_FRIENDS_v1';
import {
  ChevronLeft, ChevronRight, MapPin, Star, Camera, Bell,
  CreditCard, Shield, Phone, Info, Calendar, PawPrint,
  MessageCircle, User, Trash2, Heart, AtSign, Edit3,
  Lock, KeyRound, Fingerprint, Smartphone, Users, Globe,
  Eye, FileText, Download, LogOut, Gift, Activity,
  HeartPulse, CalendarClock, Stethoscope, Check, MailCheck,
  ScanLine, Briefcase, Cake, CircleUserRound, X,
  ShieldCheck, LifeBuoy, Copy, Share2, QrCode, Plus,
  AlertCircle
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   65 — USER PROFILE v3
   Identity profile · per-field edit sheets · rate limits
   ═══════════════════════════════════════════════════════ */

const MOCK_USER = {
  // Identity
  firstName: 'Alex',
  lastName: 'Mueller',
  username: 'alex.m',
  initials: 'AM',
  avatar: 'https://i.pravatar.cc/240?u=alex_fylos',
  bio: 'Dog parent to Leo & Luna in Zürich.',
  dobDisplay: 'Mar 12, 1995',
  gender: 'Private',

  // Contact
  email: 'alex@example.com',
  emailVerified: true,
  phone: '+41 78 555 1234',
  phoneVerified: true,
  addressShort: 'Zürich',
  addressStreet: 'Bahnhofstrasse 12',
  addressPostal: '8001',
  addressCity: 'Zürich',
  addressCountry: 'Switzerland',
  location: 'Zürich, Switzerland',
  emergencyContact: { name: 'Tom K.', relation: 'Partner', phone: '+41 79 222 3344' },

  // Verification
  idVerified: true,
  idVerifiedOn: 'March 18, 2024',
  profileCompletePct: 92,
  profileChecklist: [
    { key: 'photo', label: 'Profile photo', done: true },
    { key: 'bio', label: 'Bio', done: true },
    { key: 'phone', label: 'Phone verified', done: true },
    { key: 'email', label: 'Email verified', done: true },
    { key: 'id', label: 'Identity verified', done: true },
    { key: 'emergency', label: 'Emergency contact', done: true },
    { key: 'address', label: 'Home address verified', done: false },
  ],

  // Memberships
  plan: 'Fylos Free',
  memberSinceDisplay: 'March 2024',

  // Rate limits & locks
  nameChangesRemaining: 3,
  nameChangesPerYear: 3,
  usernameChangesRemaining: 2,
  usernameChangesPerYear: 2,
  dobLocked: true,

  // Family & pets
  pets: [
    { id: 'p1', name: 'Leo',  breed: 'Golden Retriever', photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=120&h=120' },
    { id: 'p2', name: 'Luna', breed: 'Mixed',            photo: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&q=80&w=200&h=200' },
  ],
  coOwners: [{ id: 'co1', name: 'Tom K.', relation: 'Partner', avatar: null }],
  familyMembers: [
    { id: 'f1', name: 'Mum',      relation: 'Mother',   avatar: null },
    { id: 'f2', name: 'Elena',    relation: 'Sister',   avatar: null },
    { id: 'f3', name: 'Oma Hanna', relation: 'Grandma', avatar: null },
  ],
  inviteCode: 'TALITA2024',

  // Stats
  bookingsCount: 14,
  playdatesCount: 8,
  photosCount: 247,
  streakDays: 45,
};

/* ────────── Theme ────────── */
const THEME = {
  bg: '#F7F5F2',
  card: '#FFFFFF',
  border: 'rgba(0,0,0,0.04)',
  divider: '#F1EDE8',
  tint: '#FBE7DD',
  coral: '#E85D2A',
  txt: '#111111',
  muted: '#9B9B9F',
  mutedDark: '#6E6E73',
  danger: '#E5484D',
  dangerTint: '#FEE8E7',
  success: '#00C060',
  warn: '#F59E0B',
  warnTint: '#FFF3DF',
};

/* ────────── Primitives ────────── */
const SectionLabel = ({ children }) => (
  <div className="text-[10.5px] font-bold uppercase text-[#A8A29C] tracking-[0.12em] mb-2 ml-1.5 mt-6">{children}</div>
);

const Card = ({ children }) => (
  <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)' }}>{children}</div>
);

const Row = ({ icon: Icon, title, value, onClick, last, danger, verified, locked }) => (
  <div className="relative">
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3.5 py-[12px] active:bg-black/[0.02] transition-colors text-left"
    >
      <div
        className="w-9 h-9 rounded-[12px] shrink-0 flex items-center justify-center"
        style={{ backgroundColor: danger ? THEME.dangerTint : THEME.tint }}
      >
        <Icon size={16} color={danger ? THEME.danger : THEME.coral} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-[14px] font-semibold truncate leading-tight"
          style={{ color: danger ? THEME.danger : THEME.txt }}
        >
          {title}
        </div>
      </div>
      {verified ? (
        <span className="flex items-center gap-[3px] text-[10.5px] font-bold shrink-0 mr-1 px-2 py-[3px] rounded-full" style={{ color: '#2E8B57', background: '#E8F6EE' }}>
          <Check size={10} strokeWidth={3} /> Verified
        </span>
      ) : value ? (
        <span className="flex items-center gap-1 text-[11.5px] font-semibold mr-1 shrink-0 truncate max-w-[150px] px-2.5 py-[3px] rounded-full" style={{ color: '#9A8F84', background: '#F4EFE9' }}>
          {locked && <Lock size={9} strokeWidth={2.4} className="shrink-0" />}{value}
        </span>
      ) : null}
      {!danger && <ChevronRight size={14} className="text-[#D4D4D8] shrink-0" strokeWidth={2.2} />}
    </button>
    {!last && <div className="absolute bottom-0 left-[62px] right-0 h-px" style={{ background: THEME.divider }} />}
  </div>
);

/* ────────── Header (canonical transparent pattern) ────────── */
const ProfileHeader = ({ onBack }) => (
  <div className="pt-14 pb-5 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 56%, rgba(247,245,242,0) 100%)' }}>
    <button
      onClick={onBack}
      className="absolute left-5 top-[52px] w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
      style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}
    >
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-bold" style={{ color: THEME.txt }}>Profile</h1>
  </div>
);

/* ────────── Hero ────────── */
const ProfileHero = ({ user, onChangePhoto }) => (
  <div className="flex flex-col items-center pt-1 pb-5 px-6">
    <div className="relative mb-3">
      <div
        className="overflow-hidden flex items-center justify-center"
        style={{
          width: 88, height: 88, borderRadius: 9999,
          background: user.avatar ? '#EDE8E2' : 'linear-gradient(145deg, #FF7240 0%, #E85D2A 100%)',
          boxShadow: '0 10px 26px rgba(232,93,42,0.18)',
        }}
      >
        {user.avatar
          ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
          : <span className="text-white font-bold text-[30px] tracking-tight">{user.initials}</span>}
      </div>
      {user.idVerified && (
        <div
          className="absolute bottom-0 left-0 w-[23px] h-[23px] rounded-full flex items-center justify-center"
          style={{ background: THEME.coral, border: `2.5px solid ${THEME.bg}`, boxShadow: '0 2px 6px rgba(232,93,42,0.3)' }}
        >
          <Check size={12} color="white" strokeWidth={3.5} />
        </div>
      )}
      <button
        onClick={onChangePhoto}
        className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full flex items-center justify-center active:scale-95 transition-all"
        style={{ background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <Camera size={12} strokeWidth={2.2} color={THEME.txt} />
      </button>
    </div>

    <div className="flex items-center gap-2 mb-1">
      <h2 className="text-[22px] font-extrabold tracking-[-0.02em]" style={{ color: THEME.txt }}>
        {user.firstName} {user.lastName}
      </h2>
      <span
        className="text-[10px] font-extrabold text-[#E85D2A] px-1.5 py-[2px] rounded-full tracking-[0.08em] leading-none"
        style={{ background: '#FBE7DD' }}
      >
        FREE
      </span>
    </div>

    <p className="text-[12.5px]" style={{ color: THEME.muted }}>
      {user.addressShort} · Member since {user.memberSinceDisplay}
    </p>
  </div>
);

/* ────────── At-a-glance stats ────────── */
const StatsStrip = ({ user }) => (
  <div className="px-4 mb-2">
    <div className="bg-white rounded-[16px] border border-black/[0.04] flex items-center py-3">
      {[
        { val: user.pets.length,     label: 'pets' },
        { val: user.bookingsCount,   label: 'bookings' },
        { val: user.streakDays,      label: 'day streak' },
        { val: user.photosCount,     label: 'photos' },
      ].map((s, i) => (
        <div
          key={s.label}
          className="flex-1 flex flex-col items-center"
          style={{ borderRight: i < 3 ? `1px solid ${THEME.divider}` : 'none' }}
        >
          <span className="text-[16px] font-semibold leading-none" style={{ color: THEME.txt }}>{s.val}</span>
          <span className="text-[10.5px] mt-1 lowercase" style={{ color: THEME.muted }}>{s.label}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ────────── Pets strip ────────── */
const PetsStrip = ({ pets, onTapPet, onAddPet }) => (
  <div className="px-4 mb-1">
    <div className="bg-white rounded-[18px] p-3.5" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)' }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A8A29C' }}>My pets · {pets.length}</span>
        <button onClick={onAddPet} className="text-[11.5px] font-bold" style={{ color: THEME.coral }}>+ Add pet</button>
      </div>
      <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {pets.map((p) => (
          <button
            key={p.id}
            onClick={() => onTapPet(p.id)}
            className="shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-all"
            style={{ width: 56 }}
          >
            <div className="w-[48px] h-[48px] rounded-full overflow-hidden" style={{ border: '1.5px solid rgba(0,0,0,0.04)' }}>
              {p.photo ? (
                <img src={p.photo} alt={p.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: THEME.tint }}>
                  <PawPrint size={18} color={THEME.coral} strokeWidth={2} />
                </div>
              )}
            </div>
            <span className="text-[11px] font-medium text-center leading-tight truncate w-full" style={{ color: THEME.txt }}>{p.name}</span>
          </button>
        ))}
        <button
          onClick={onAddPet}
          className="shrink-0 flex flex-col items-center gap-1.5 active:scale-95 transition-all"
          style={{ width: 56 }}
        >
          <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center" style={{ backgroundColor: THEME.bg, border: `1.5px dashed ${THEME.muted}` }}>
            <Plus size={18} color={THEME.muted} strokeWidth={2.2} />
          </div>
          <span className="text-[11px] font-medium text-center leading-tight" style={{ color: THEME.muted }}>Add</span>
        </button>
      </div>
    </div>
  </div>
);

/* ────────── Bottom Sheet Shell ────────── */
const BottomSheet = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative w-full rounded-t-[22px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[80%] overflow-y-auto up-scroll"
        style={{ backgroundColor: THEME.bg }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col items-center pt-3 pb-1 sticky top-0 z-10" style={{ background: THEME.bg }}>
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#D5CEC7' }} />
        </div>
        <div className="px-5 pb-7">{children}</div>
      </div>
    </div>
  );
};

/* ────────── Field Sheet contents ────────── */
const SheetHeader = ({ title, subtitle, onClose }) => (
  <div className="flex items-start justify-between mb-4 mt-1">
    <div className="flex-1 pr-3">
      <h3 className="text-[17px] font-semibold mb-1" style={{ color: THEME.txt }}>{title}</h3>
      {subtitle && <p className="text-[12.5px] leading-snug" style={{ color: THEME.mutedDark }}>{subtitle}</p>}
    </div>
    <button onClick={onClose} className="w-7 h-7 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95">
      <X size={14} strokeWidth={2.2} />
    </button>
  </div>
);

const TextField = ({ label, value, onChange, prefix, maxLength, type = 'text', placeholder, suffix }) => (
  <div className="mb-3">
    {label && <label className="block text-[11px] font-medium tracking-[0.04em] mb-1 ml-1" style={{ color: THEME.muted }}>{label}</label>}
    <div className="relative">
      {prefix && (
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14.5px] font-medium" style={{ color: THEME.muted }}>{prefix}</span>
      )}
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full h-[44px] rounded-[12px] text-[14.5px] focus:outline-none"
        style={{
          backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', color: THEME.txt,
          paddingLeft: prefix ? 28 : 14, paddingRight: suffix ? 60 : 14,
        }}
      />
      {suffix && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-medium" style={{ color: THEME.muted }}>{suffix}</span>
      )}
    </div>
  </div>
);

const TextArea = ({ label, value, onChange, maxLength = 160, placeholder }) => (
  <div className="mb-3">
    {label && <label className="block text-[11px] font-medium tracking-[0.04em] mb-1 ml-1" style={{ color: THEME.muted }}>{label}</label>}
    <div className="relative">
      <textarea
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={3}
        className="w-full px-3.5 py-3 rounded-[12px] text-[14.5px] focus:outline-none resize-none"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', color: THEME.txt }}
      />
      <span className="absolute bottom-2 right-3 text-[10.5px]" style={{ color: THEME.muted }}>{(value ?? '').length}/{maxLength}</span>
    </div>
  </div>
);

const Banner = ({ tone = 'warn', icon: Icon = AlertCircle, children }) => {
  const tones = {
    warn: { bg: THEME.warnTint, color: '#8B5A00', iconColor: THEME.warn },
    info: { bg: '#E8F1FD', color: '#0B4C8F', iconColor: '#2E78D9' },
    danger: { bg: THEME.dangerTint, color: '#8B1A14', iconColor: THEME.danger },
    muted: { bg: '#F3EFEB', color: THEME.mutedDark, iconColor: THEME.muted },
    success: { bg: '#E4F9ED', color: '#0B6A34', iconColor: THEME.success },
  }[tone];
  return (
    <div className="flex items-start gap-2 px-3 py-2.5 rounded-[12px] mb-3" style={{ backgroundColor: tones.bg }}>
      <Icon size={14} color={tones.iconColor} strokeWidth={2.2} className="shrink-0 mt-[1px]" />
      <span className="text-[12px] leading-snug" style={{ color: tones.color }}>{children}</span>
    </div>
  );
};

const PrimaryBtn = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full h-11 rounded-[16px] font-semibold text-[14.5px] text-white active:scale-[0.98] transition-all"
    style={{ backgroundColor: disabled ? '#D4D4D8' : THEME.coral, cursor: disabled ? 'not-allowed' : 'pointer' }}
  >
    {children}
  </button>
);

const GhostBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-full h-11 rounded-[16px] font-semibold text-[14.5px] active:scale-[0.98] transition-all mt-2"
    style={{ backgroundColor: '#FFFFFF', color: THEME.txt, border: '1px solid rgba(0,0,0,0.06)' }}
  >
    {children}
  </button>
);

/* ────────── Per-field sheet content ────────── */
const NameSheet = ({ user, onSave, onClose }) => {
  const [fn, setFn] = useState(user.firstName);
  const [ln, setLn] = useState(user.lastName);
  const remaining = user.nameChangesRemaining;
  const blocked = remaining <= 0;
  return (
    <>
      <SheetHeader title="Full name" subtitle="We show this on your profile and in bookings." onClose={onClose} />
      <Banner tone={blocked ? 'danger' : 'warn'}>
        {blocked
          ? 'You\'ve used all name changes this year. Contact support to update.'
          : `${remaining} of ${user.nameChangesPerYear} changes remaining this year. Limits help our fraud team.`}
      </Banner>
      <TextField label="First name" value={fn} onChange={setFn} />
      <TextField label="Last name"  value={ln} onChange={setLn} />
      <PrimaryBtn disabled={blocked || !fn.trim() || !ln.trim()} onClick={() => onSave({ firstName: fn.trim(), lastName: ln.trim(), nameChangesRemaining: Math.max(0, remaining - 1) })}>
        Save changes
      </PrimaryBtn>
      <GhostBtn onClick={onClose}>Cancel</GhostBtn>
    </>
  );
};

const UsernameSheet = ({ user, onSave, onClose }) => {
  const [u, setU] = useState(user.username);
  const remaining = user.usernameChangesRemaining;
  const blocked = remaining <= 0;
  const taken = ['admin', 'fylos', 'leo'].includes(u.toLowerCase());
  const valid = /^[a-z0-9_.]{3,20}$/i.test(u) && !taken;
  const suffix = u ? (valid ? '✓ available' : (taken ? '× taken' : '× invalid')) : '';
  return (
    <>
      <SheetHeader title="Change username" subtitle="Letters, numbers, dots & underscores. 3–20 characters." onClose={onClose} />
      <Banner tone={blocked ? 'danger' : 'warn'}>
        {blocked
          ? 'No username changes left this year.'
          : `${remaining} of ${user.usernameChangesPerYear} changes remaining. Your old @${user.username} will be released after 30 days.`}
      </Banner>
      <TextField label="Username" value={u} onChange={(v) => setU(v.replace(/\s/g, '').toLowerCase())} prefix="@" suffix={suffix} />
      <PrimaryBtn disabled={blocked || !valid || u === user.username} onClick={() => onSave({ username: u, usernameChangesRemaining: Math.max(0, remaining - 1) })}>
        Save username
      </PrimaryBtn>
      <GhostBtn onClick={onClose}>Cancel</GhostBtn>
    </>
  );
};

const DobSheet = ({ user, onClose }) => (
  <>
    <SheetHeader title="Date of birth" subtitle="Your birthday is used for age verification." onClose={onClose} />
    <div className="flex flex-col items-center py-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: THEME.tint }}>
        <Lock size={18} color={THEME.coral} strokeWidth={2} />
      </div>
      <p className="text-[15px] font-semibold mb-1" style={{ color: THEME.txt }}>{user.dobDisplay}</p>
      <p className="text-[12px] text-center leading-snug px-2" style={{ color: THEME.mutedDark }}>
        This field is locked after verification. To correct it, please contact support with an ID photo.
      </p>
    </div>
    <Banner tone="info" icon={Info}>
      Identity-related fields can't be edited here for safety reasons. We'll verify any changes through support.
    </Banner>
    <PrimaryBtn onClick={onClose}>Contact support</PrimaryBtn>
    <GhostBtn onClick={onClose}>Close</GhostBtn>
  </>
);

const BioSheet = ({ user, onSave, onClose }) => {
  const [bio, setBio] = useState(user.bio);
  return (
    <>
      <SheetHeader title="Edit bio" subtitle="A short line shown on your public profile." onClose={onClose} />
      <TextArea label="Bio" value={bio} onChange={setBio} maxLength={160} placeholder="Tell the community about you and your pets…" />
      <PrimaryBtn onClick={() => onSave({ bio: bio.trim() })}>Save</PrimaryBtn>
      <GhostBtn onClick={onClose}>Cancel</GhostBtn>
    </>
  );
};

const EmailSheet = ({ user, onSave, onClose }) => {
  const [email, setEmail] = useState(user.email);
  const [step, setStep] = useState('enter'); // 'enter' | 'verify'
  const [code, setCode] = useState('');
  const changed = email.trim().toLowerCase() !== user.email.toLowerCase();

  if (step === 'verify') {
    return (
      <>
        <SheetHeader title="Verify email" subtitle={`We sent a 6-digit code to ${email}.`} onClose={onClose} />
        <TextField label="Verification code" value={code} onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))} placeholder="123456" />
        <PrimaryBtn disabled={code.length !== 6} onClick={() => onSave({ email: email.trim(), emailVerified: true })}>
          Confirm new email
        </PrimaryBtn>
        <GhostBtn onClick={() => setStep('enter')}>Back</GhostBtn>
      </>
    );
  }

  return (
    <>
      <SheetHeader title="Change email" subtitle="We'll send a 6-digit code to confirm your new address." onClose={onClose} />
      <TextField label="Email address" value={email} onChange={setEmail} type="email" placeholder="you@example.com" />
      {!changed && user.emailVerified && (
        <Banner tone="success" icon={Check}>Your current email is verified.</Banner>
      )}
      <PrimaryBtn disabled={!changed || !/.+@.+\..+/.test(email)} onClick={() => setStep('verify')}>
        Send verification code
      </PrimaryBtn>
      <GhostBtn onClick={onClose}>Cancel</GhostBtn>
    </>
  );
};

const PhoneSheet = ({ user, onSave, onClose }) => {
  const [phone, setPhone] = useState(user.phone);
  const [step, setStep] = useState('enter');
  const [code, setCode] = useState('');
  const changed = phone.replace(/\s/g, '') !== user.phone.replace(/\s/g, '');

  if (step === 'verify') {
    return (
      <>
        <SheetHeader title="Verify phone" subtitle={`We texted a 6-digit code to ${phone}.`} onClose={onClose} />
        <TextField label="SMS code" value={code} onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))} placeholder="123456" />
        <PrimaryBtn disabled={code.length !== 6} onClick={() => onSave({ phone, phoneVerified: true })}>
          Confirm new phone
        </PrimaryBtn>
        <GhostBtn onClick={() => setStep('enter')}>Back</GhostBtn>
      </>
    );
  }

  return (
    <>
      <SheetHeader title="Change phone" subtitle="We'll send an SMS with a 6-digit code." onClose={onClose} />
      <TextField label="Phone number" value={phone} onChange={setPhone} type="tel" placeholder="+41 79 555 1234" />
      {!changed && user.phoneVerified && (
        <Banner tone="success" icon={Check}>Your current phone is verified.</Banner>
      )}
      <PrimaryBtn disabled={!changed || phone.replace(/\D/g, '').length < 7} onClick={() => setStep('verify')}>
        Send SMS code
      </PrimaryBtn>
      <GhostBtn onClick={onClose}>Cancel</GhostBtn>
    </>
  );
};

const AddressSheet = ({ user, onSave, onClose }) => {
  const [form, setForm] = useState({
    street: user.addressStreet, postal: user.addressPostal,
    city: user.addressCity, country: user.addressCountry,
  });
  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <>
      <SheetHeader title="Home address" subtitle="Used for deliveries, invoices and emergency services." onClose={onClose} />
      <TextField label="Street & number" value={form.street} onChange={(v) => upd('street', v)} />
      <div className="flex gap-2">
        <div className="w-[90px]"><TextField label="Postal" value={form.postal} onChange={(v) => upd('postal', v)} /></div>
        <div className="flex-1"><TextField label="City" value={form.city} onChange={(v) => upd('city', v)} /></div>
      </div>
      <TextField label="Country" value={form.country} onChange={(v) => upd('country', v)} />
      <PrimaryBtn
        onClick={() => onSave({
          addressStreet: form.street, addressPostal: form.postal,
          addressCity: form.city, addressCountry: form.country,
          addressShort: form.city,
        })}
      >
        Save address
      </PrimaryBtn>
      <GhostBtn onClick={onClose}>Cancel</GhostBtn>
    </>
  );
};

const EmergencySheet = ({ user, onSave, onClose }) => {
  const [form, setForm] = useState({ ...user.emergencyContact });
  const upd = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  return (
    <>
      <SheetHeader title="Emergency contact" subtitle="We'll reach them if something happens to you or your pets." onClose={onClose} />
      <TextField label="Full name" value={form.name} onChange={(v) => upd('name', v)} />
      <TextField label="Relation" value={form.relation} onChange={(v) => upd('relation', v)} placeholder="Partner, parent, friend…" />
      <TextField label="Phone" value={form.phone} onChange={(v) => upd('phone', v)} type="tel" />
      <Banner tone="muted" icon={Info}>This contact will only be used in emergencies.</Banner>
      <PrimaryBtn disabled={!form.name || !form.phone} onClick={() => onSave({ emergencyContact: form })}>Save contact</PrimaryBtn>
      <GhostBtn onClick={onClose}>Cancel</GhostBtn>
    </>
  );
};

const IdVerifySheet = ({ user, onClose }) => (
  <>
    <SheetHeader title="Identity & ID" subtitle="Verified identity unlocks playdates, pro bookings and trust badges." onClose={onClose} />
    <div className="flex flex-col items-center py-4">
      <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: '#E4F9ED' }}>
        <ShieldCheck size={22} color={THEME.success} strokeWidth={2.2} />
      </div>
      <p className="text-[15px] font-semibold mb-0.5" style={{ color: THEME.txt }}>Verified</p>
      <p className="text-[12px]" style={{ color: THEME.mutedDark }}>on {user.idVerifiedOn}</p>
    </div>
    <Banner tone="info" icon={Info}>To re-verify or update your ID, contact support with your new document.</Banner>
    <PrimaryBtn onClick={onClose}>Got it</PrimaryBtn>
  </>
);

const CompleteSheet = ({ user, onClose }) => (
  <>
    <SheetHeader title="Profile completeness" subtitle={`Your profile is ${user.profileCompletePct}% complete.`} onClose={onClose} />
    <div className="h-2 rounded-full mb-4" style={{ backgroundColor: THEME.divider }}>
      <div className="h-full rounded-full" style={{ width: `${user.profileCompletePct}%`, background: 'linear-gradient(90deg, #FF7240, #E85D2A)' }} />
    </div>
    <Card>
      {user.profileChecklist.map((item, i) => (
        <div key={item.key} className="relative flex items-center gap-3 px-3.5 py-2.5">
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: item.done ? '#E4F9ED' : THEME.divider }}>
            {item.done ? <Check size={13} color={THEME.success} strokeWidth={3} /> : <Plus size={12} color={THEME.muted} strokeWidth={2.4} />}
          </div>
          <span className="flex-1 text-[14px]" style={{ color: item.done ? THEME.txt : THEME.mutedDark }}>{item.label}</span>
          {!item.done && <span className="text-[11.5px] font-medium" style={{ color: THEME.coral }}>Add</span>}
          {i < user.profileChecklist.length - 1 && (
            <div className="absolute bottom-0 left-[42px] right-3 h-px" style={{ background: THEME.divider }} />
          )}
        </div>
      ))}
    </Card>
    <div className="h-3" />
    <PrimaryBtn onClick={onClose}>Close</PrimaryBtn>
  </>
);

const ListManageSheet = ({ title, subtitle, items, primaryLabel, onAdd, onRemove, onClose }) => (
  <>
    <SheetHeader title={title} subtitle={subtitle} onClose={onClose} />
    <div className="space-y-2 mb-3">
      {items.map((m) => (
        <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-[12px] bg-white border border-black/[0.04]">
          <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
            <User size={15} color={THEME.coral} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold truncate" style={{ color: THEME.txt }}>{m.name}</p>
            {m.relation && <p className="text-[11.5px] truncate" style={{ color: THEME.muted }}>{m.relation}</p>}
          </div>
          <button onClick={() => onRemove(m.id)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: THEME.dangerTint }}>
            <Trash2 size={13} color={THEME.danger} strokeWidth={2} />
          </button>
        </div>
      ))}
      {items.length === 0 && (
        <div className="text-center py-6">
          <p className="text-[12.5px]" style={{ color: THEME.muted }}>No one added yet.</p>
        </div>
      )}
    </div>
    <PrimaryBtn onClick={onAdd}>{primaryLabel}</PrimaryBtn>
    <GhostBtn onClick={onClose}>Done</GhostBtn>
  </>
);

const InviteSheet = ({ user, onClose }) => {
  const [copied, setCopied] = useState(false);
  const url = `https://fylos.app/i/${user.inviteCode}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(url); } catch (e) {}
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  };
  return (
    <>
      <SheetHeader title="Invite friends" subtitle="Earn CHF 10 in fee credit for each friend you invite." onClose={onClose} />
      <div className="flex flex-col items-center py-2 mb-2">
        <div className="w-32 h-32 rounded-[16px] flex items-center justify-center mb-3" style={{ backgroundColor: THEME.tint }}>
          <QrCode size={82} color={THEME.coral} strokeWidth={1.8} />
        </div>
        <p className="text-[12.5px] mb-1" style={{ color: THEME.mutedDark }}>Your invite code</p>
        <p className="text-[20px] font-semibold tracking-[0.18em]" style={{ color: THEME.coral }}>{user.inviteCode}</p>
      </div>
      <div className="flex items-center gap-2 p-3 rounded-[12px] bg-white border border-black/[0.04] mb-3">
        <span className="flex-1 text-[12.5px] truncate" style={{ color: THEME.mutedDark }}>{url}</span>
        <button onClick={copy} className="flex items-center gap-1 px-3 h-8 rounded-full text-[12px] font-semibold active:scale-95" style={{ backgroundColor: THEME.coral, color: 'white' }}>
          <Copy size={12} strokeWidth={2.2} /> {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <PrimaryBtn onClick={onClose}><span className="flex items-center gap-2 justify-center"><Share2 size={14} strokeWidth={2.2} /> Share link</span></PrimaryBtn>
    </>
  );
};

const PhotoSheet = ({ onClose }) => (
  <>
    <SheetHeader title="Profile photo" subtitle="Upload a clear, well-lit photo of your face." onClose={onClose} />
    <div className="space-y-2">
      {[
        { icon: Camera, label: 'Take a photo' },
        { icon: Download, label: 'Choose from library' },
        { icon: Trash2, label: 'Remove photo', danger: true },
      ].map((item, i) => {
        const Icn = item.icon;
        return (
          <button
            key={i}
            onClick={onClose}
            className="w-full flex items-center gap-3 p-3 rounded-[12px] bg-white border border-black/[0.04] active:scale-[0.99] transition-all"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: item.danger ? THEME.dangerTint : THEME.tint }}>
              <Icn size={15} color={item.danger ? THEME.danger : THEME.coral} strokeWidth={2} />
            </div>
            <span className="text-[14px] font-semibold" style={{ color: item.danger ? THEME.danger : THEME.txt }}>{item.label}</span>
          </button>
        );
      })}
    </div>
    <div className="h-3" />
    <GhostBtn onClick={onClose}>Cancel</GhostBtn>
  </>
);

/* ────────── Field Sheet Router ────────── */
const FieldSheet = ({ field, user, onSave, onClose }) => {
  if (!field) return null;
  const save = (patch) => { onSave(patch); onClose(); };
  switch (field) {
    case 'name':      return <NameSheet      user={user} onSave={save} onClose={onClose} />;
    case 'username':  return <UsernameSheet  user={user} onSave={save} onClose={onClose} />;
    case 'dob':       return <DobSheet       user={user} onClose={onClose} />;
    case 'bio':       return <BioSheet       user={user} onSave={save} onClose={onClose} />;
    case 'email':     return <EmailSheet     user={user} onSave={save} onClose={onClose} />;
    case 'phone':     return <PhoneSheet     user={user} onSave={save} onClose={onClose} />;
    case 'address':   return <AddressSheet   user={user} onSave={save} onClose={onClose} />;
    case 'emergency': return <EmergencySheet user={user} onSave={save} onClose={onClose} />;
    case 'id-verify': return <IdVerifySheet  user={user} onClose={onClose} />;
    case 'complete':  return <CompleteSheet  user={user} onClose={onClose} />;
    case 'co-owners':
      return (
        <ListManageSheet
          title="Co-owners"
          subtitle="Co-owners can fully manage your pets and bookings."
          items={user.coOwners}
          primaryLabel="+ Add co-owner"
          onAdd={onClose}
          onRemove={(id) => save({ coOwners: user.coOwners.filter((c) => c.id !== id) })}
          onClose={onClose}
        />
      );
    case 'family':
      return (
        <ListManageSheet
          title="Family"
          subtitle="Family members can view and log activities."
          items={user.familyMembers}
          primaryLabel="+ Invite family member"
          onAdd={onClose}
          onRemove={(id) => save({ familyMembers: user.familyMembers.filter((m) => m.id !== id) })}
          onClose={onClose}
        />
      );
    case 'invite':    return <InviteSheet    user={user} onClose={onClose} />;
    case 'photo':     return <PhotoSheet     onClose={onClose} />;
    default:          return null;
  }
};

/* ────────── Profile overview ────────── */
const Ring = ({ pct, size = 44, stroke = 5 }) => {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  return (
    <svg width={size} height={size} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F1EAE2" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E85D2A" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
    </svg>
  );
};

const NEXT_STEP_LABEL = { address: 'Verify your home address', photo: 'Add a profile photo', bio: 'Write a short bio', phone: 'Verify your phone', email: 'Verify your email', id: 'Verify your identity', emergency: 'Add an emergency contact' };

const ProfileOverviewMix = ({ user, onRowTap, onInvite, onLogout, onDeleteAccount, onBack }) => {
  const softShadow = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';
  const stepsLeft = (user.profileChecklist || []).filter((i) => !i.done).length;
  const nextStep = (user.profileChecklist || []).find((i) => !i.done);
  const nextLabel = nextStep ? (NEXT_STEP_LABEL[nextStep.key] || nextStep.label) : '';
  const LineRow = ({ title, value, green, danger, onClick, last }) => (
    <div className="relative">
      <button onClick={onClick} className="w-full flex items-center justify-between gap-3 px-4 py-[13px] active:bg-black/[0.02] transition-colors text-left">
        <span className="text-[14.5px] font-semibold shrink-0" style={{ color: danger ? THEME.danger : THEME.txt }}>{title}</span>
        {!danger && (
          <span className="flex items-center gap-1.5 min-w-0">
            {value && <span className="text-[13px] font-medium truncate" style={{ color: green ? '#2E8B57' : THEME.muted }}>{value}</span>}
            <ChevronRight size={15} className="text-[#CFC7BD] shrink-0" strokeWidth={2.2} />
          </span>
        )}
      </button>
      {!last && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: THEME.divider }} />}
    </div>
  );
  return (
    <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: THEME.bg }}>
      <div className="flex-1 overflow-y-auto up-scroll pb-[32px]">
        <ProfileHeader onBack={onBack} />

        {/* ── Wallet card — stacked, fintech, no icons (ready for a future vet card) ── */}
        <div className="px-4 pt-1 pb-6">
          <div className="relative">
            {/* wallet stack — hints future cards (e.g. a vet card) */}
            <div className="absolute left-5 right-5 rounded-[18px]" style={{ bottom: -13, height: 44, background: '#EFCBB8' }} />
            <div className="absolute left-3 right-3 rounded-[20px]" style={{ bottom: -6, height: 44, background: '#F4D5C5' }} />
            <button onClick={() => onRowTap('photo')} className="relative block w-full text-left rounded-[20px] overflow-hidden p-5 active:scale-[0.99] transition-transform" style={{ background: 'linear-gradient(150deg, #EF6A3C 0%, #E85D2A 52%, #D44D1B 100%)', boxShadow: '0 18px 36px rgba(212,77,27,0.34)' }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 14% 0%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 46%)' }} />
              <div className="relative flex items-center" style={{ gap: 4, fontFamily: '"Nunito", system-ui, sans-serif' }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.4px', lineHeight: 1 }}>FYLOS</span>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#FFFFFF', opacity: 0.95 }} />
              </div>
              <div className="relative flex items-center gap-3.5 mt-6">
                <div className="w-[48px] h-[48px] rounded-full overflow-hidden shrink-0" style={{ boxShadow: '0 0 0 3px rgba(255,255,255,0.5)' }}>
                  {user.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white font-bold text-[18px]" style={{ background: 'rgba(255,255,255,0.2)' }}>{user.initials}</div>}
                </div>
                <div className="min-w-0">
                  <h2 className="text-[20px] font-extrabold text-white tracking-[-0.01em] truncate leading-tight">{user.firstName} {user.lastName}</h2>
                  <div className="text-[11.5px] text-white/80 mt-0.5">Fylos member · Free</div>
                </div>
              </div>
              <div className="relative flex items-end justify-between mt-6">
                <div>
                  <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/65">Member since</div>
                  <div className="text-[13px] font-bold text-white mt-1">{user.memberSinceDisplay}</div>
                </div>
                <div className="text-right">
                  <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-white/65">Member ID</div>
                  <div className="text-[13px] font-bold text-white mt-1 tabular-nums tracking-[0.12em]">#74621</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Card info — stats + verified together, attached under the card */}
        <div className="px-4 pb-4">
          <div className="flex items-center py-1">
            {[
              { n: user.bookingsCount, l: 'Bookings' },
              { n: user.pets.length, l: user.pets.length === 1 ? 'Pet' : 'Pets' },
              { n: user.streakDays, l: 'Day streak' },
            ].map((s, i) => (
              <div key={s.l} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? `1px solid ${THEME.divider}` : 'none' }}>
                <span className="text-[22px] font-extrabold leading-none tracking-[-0.01em]" style={{ color: THEME.coral }}>{s.n}</span>
                <span className="text-[10.5px] font-medium mt-1.5" style={{ color: THEME.muted }}>{s.l}</span>
              </div>
            ))}
          </div>
          <div className="h-px mx-1 my-3" style={{ background: THEME.divider }} />
          <div className="w-full flex items-center">
            {[
              { l: 'ID', icon: ShieldCheck, k: 'id-verify' },
              { l: 'Email', icon: MailCheck, k: 'email' },
              { l: 'Phone', icon: Phone, k: 'phone' },
            ].map(({ l, icon: Icon, k }) => (
              <button key={l} onClick={() => onRowTap(k)} className="flex-1 inline-flex items-center justify-center gap-1.5 py-0.5 active:opacity-60 transition-opacity">
                <Icon size={14} color="#2E8B57" strokeWidth={2.2} />
                <span className="text-[12px] font-semibold" style={{ color: THEME.mutedDark }}>{l}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Smart finish-profile nudge (ring + concrete next step) */}
        {stepsLeft > 0 && (
          <div className="px-4 pb-3">
            <button onClick={() => onRowTap(nextStep ? (nextStep.key === 'id' ? 'id-verify' : nextStep.key) : 'complete')} className="w-full flex items-center gap-3.5 p-3.5 rounded-[18px] text-left active:scale-[0.99] transition-all" style={{ background: '#FFFFFF', boxShadow: softShadow }}>
              <div className="relative flex items-center justify-center shrink-0">
                <Ring pct={user.profileCompletePct} />
                <span className="absolute text-[11px] font-extrabold" style={{ color: THEME.txt }}>{user.profileCompletePct}%</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold" style={{ color: THEME.txt }}>Finish your profile</div>
                <div className="text-[12px] mt-0.5 truncate" style={{ color: THEME.muted }}>Next: {nextLabel}</div>
              </div>
              <span className="text-[11.5px] font-bold px-3 py-1.5 rounded-full shrink-0" style={{ background: THEME.tint, color: THEME.coral }}>Continue</span>
            </button>
          </div>
        )}

        {/* My pets — rich cards */}
        <div className="pb-2">
          <div className="px-5 flex items-center justify-between mb-2">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A8A29C' }}>My pets</span>
            <button onClick={() => onRowTap('addpet')} className="text-[12px] font-bold active:opacity-70" style={{ color: THEME.coral }}>+ Add pet</button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: 'none' }}>
            {user.pets.map((p) => (
              <button key={p.id} onClick={() => onRowTap('pet:' + p.id)} className="shrink-0 w-[136px] rounded-[18px] overflow-hidden bg-white text-left active:scale-[0.98] transition-all" style={{ boxShadow: softShadow }}>
                <div className="h-[92px] w-full overflow-hidden" style={{ background: THEME.tint }}>
                  {p.photo ? <img src={p.photo} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="px-3 py-2.5">
                  <div className="text-[14px] font-bold truncate" style={{ color: THEME.txt }}>{p.name}</div>
                  <div className="text-[11.5px] truncate" style={{ color: THEME.muted }}>{p.breed}</div>
                </div>
              </button>
            ))}
          </div>
        </div>


        {/* Details */}
        <div className="px-4 pb-3">
          <SectionLabel>Details</SectionLabel>
          <Card>
            <LineRow title="Full name" value={`${user.firstName} ${user.lastName}`} onClick={() => onRowTap('name')} />
            <LineRow title="Date of birth" value={user.dobDisplay} onClick={() => onRowTap('dob')} />
            <LineRow title="Email" value={user.email} onClick={() => onRowTap('email')} />
            <LineRow title="Phone" value={user.phone} onClick={() => onRowTap('phone')} />
            <LineRow title="Home address" value={user.addressShort} onClick={() => onRowTap('address')} last />
          </Card>
        </div>

        {/* Invite friends — single line, count only; opens the homepage Invite */}
        <div className="px-4 pb-3">
          <button onClick={onInvite} className="w-full rounded-[18px] bg-white px-4 py-[15px] flex items-center justify-between gap-3 active:scale-[0.99] transition-all" style={{ boxShadow: softShadow }}>
            <span className="text-[14.5px] font-semibold" style={{ color: THEME.txt }}>Invite friends</span>
            <span className="flex items-center gap-1.5 shrink-0">
              <span className="text-[13px] font-medium" style={{ color: THEME.muted }}>3 invited</span>
              <ChevronRight size={15} color="#CFC7BD" strokeWidth={2.2} />
            </span>
          </button>
        </div>

        {/* Account */}
        <div className="px-4">
          <SectionLabel>Account</SectionLabel>
          <Card>
            <LineRow title="Log out" danger onClick={onLogout} />
            <LineRow title="Delete account" danger onClick={onDeleteAccount} last />
          </Card>
        </div>
      </div>
    </div>
  );
};


/* ═══════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════ */
/* ────────── Center pop-up (for confirmations) ────────── */
const CenterDialog = ({ open, onClose, title, message, confirmLabel, onConfirm, danger }) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center px-7">
      <div className="absolute inset-0 animate-in fade-in duration-200" style={{ background: 'rgba(20,12,8,0.42)' }} onClick={onClose} />
      <div className="relative w-full rounded-[24px] bg-white p-5 animate-in fade-in zoom-in-95 duration-200" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.28)' }}>
        <h3 className="text-[17px] font-bold text-center" style={{ color: THEME.txt }}>{title}</h3>
        <p className="text-[12.5px] mt-2 mb-5 text-center leading-relaxed" style={{ color: THEME.mutedDark }}>{message}</p>
        <button onClick={onConfirm} className="w-full flex items-center justify-center font-semibold text-[14.5px] mb-2.5 active:scale-[0.98] transition-all rounded-[16px] py-3" style={{ background: danger ? THEME.danger : THEME.coral, color: '#FFFFFF' }}>{confirmLabel}</button>
        <button onClick={onClose} className="w-full flex items-center justify-center font-semibold text-[14.5px] active:scale-[0.98] transition-all rounded-[16px] py-3" style={{ background: '#F4EFE9', color: THEME.txt }}>Cancel</button>
      </div>
    </div>
  );
};

/* ────────── Delete account — richer confirm with a gate ────────── */
const DeleteAccountDialog = ({ open, onClose, onConfirm }) => {
  const [ack, setAck] = useState(false);
  if (!open) return null;
  const close = () => { setAck(false); onClose(); };
  const confirm = () => { setAck(false); onConfirm(); };
  const items = [
    'Your pets and their records',
    'All bookings and history',
    'Saved cards and any fylos credit',
    'Your reviews and messages',
  ];
  return (
    <div className="absolute inset-0 z-[200] flex items-center justify-center px-6">
      <div className="absolute inset-0 animate-in fade-in duration-200" style={{ background: 'rgba(20,12,8,0.42)' }} onClick={close} />
      <div className="relative w-full rounded-[24px] bg-white p-5 animate-in fade-in zoom-in-95 duration-200" style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.28)' }}>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3" style={{ background: THEME.dangerTint }}>
            <Trash2 size={20} color={THEME.danger} strokeWidth={2} />
          </div>
          <h3 className="text-[17px] font-bold" style={{ color: THEME.txt }}>Delete account?</h3>
          <p className="text-[12.5px] mt-1.5 text-center" style={{ color: THEME.mutedDark }}>This permanently removes:</p>
        </div>
        <div className="mt-3 mb-3 rounded-[16px] p-3" style={{ background: '#FAF7F3' }}>
          {items.map((t) => (
            <div key={t} className="flex items-center gap-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: THEME.danger }} />
              <span className="text-[12.5px]" style={{ color: THEME.mutedDark }}>{t}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setAck(!ack)} className="w-full flex items-center gap-2.5 mb-4 text-left active:opacity-70">
          <span className="w-5 h-5 rounded-[6px] flex items-center justify-center shrink-0" style={{ background: ack ? THEME.danger : 'transparent', boxShadow: ack ? 'none' : 'inset 0 0 0 2px #D8D0C6' }}>{ack && <Check size={12} color="#FFFFFF" strokeWidth={3} />}</span>
          <span className="text-[12.5px] font-medium" style={{ color: THEME.txt }}>I understand this can't be undone.</span>
        </button>
        <button disabled={!ack} onClick={confirm} className="w-full flex items-center justify-center font-semibold text-[14.5px] mb-2.5 rounded-[16px] py-3 transition-all active:scale-[0.98]" style={{ background: ack ? THEME.danger : '#EDE8E2', color: ack ? '#FFFFFF' : THEME.muted }}>Delete account</button>
        <button onClick={close} className="w-full flex items-center justify-center font-semibold text-[14.5px] rounded-[16px] py-3" style={{ background: '#F4EFE9', color: THEME.txt }}>Cancel</button>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState({ ...MOCK_USER });
  const [editingField, setEditingField] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const handleSave = (patch) => setUser((p) => {
    const next = { ...p, ...patch };
    // Saving the home address marks that profile step complete.
    if (patch.addressStreet || patch.addressShort) {
      const checklist = (p.profileChecklist || []).map((i) => (i.key === 'address' ? { ...i, done: true } : i));
      next.profileChecklist = checklist;
      next.profileCompletePct = Math.round((checklist.filter((i) => i.done).length / checklist.length) * 100);
    }
    return next;
  });

  const back = () => {
    // Reopen Settings on the dashboard (this screen is opened from there).
    try { window.sessionStorage.setItem('fylos.settingsOpen', '1'); } catch (e) {}
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  };

  const handleRowTap = (row) => {
    if (row.startsWith('pet:')) return;
    if (row === 'addpet') { window.location.href = '/add-pet'; return; }
    setEditingField(row);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .up-scroll::-webkit-scrollbar { display: none; }
        .up-scroll { scrollbar-width: none; }
      `}</style>

      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          className="relative"
          style={{
            width: 390, height: 844, borderRadius: 50,
            border: '8px solid #000', overflow: 'hidden',
            backgroundColor: THEME.bg,
          }}
        >
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

          <div className="relative w-full h-full overflow-hidden">
            <ProfileOverviewMix
              user={user}
              onBack={back}
              onRowTap={handleRowTap}
              onInvite={() => setInviteOpen(true)}
              onLogout={() => setShowLogout(true)}
              onDeleteAccount={() => setShowDelete(true)}
            />
          </div>

          {inviteOpen && <InviteFriends embedded onExit={() => setInviteOpen(false)} />}

          <BottomSheet open={!!editingField} onClose={() => setEditingField(null)}>
            <FieldSheet field={editingField} user={user} onSave={handleSave} onClose={() => setEditingField(null)} />
          </BottomSheet>

          <BottomSheet open={showShare} onClose={() => setShowShare(false)}>
            <InviteSheet user={user} onClose={() => setShowShare(false)} />
          </BottomSheet>

          <CenterDialog
            open={showLogout}
            onClose={() => setShowLogout(false)}
            title="Log out?"
            message="You'll be logged out of your fylos account on this device."
            confirmLabel="Log out"
            danger
            onConfirm={() => setShowLogout(false)}
          />

          <DeleteAccountDialog
            open={showDelete}
            onClose={() => setShowDelete(false)}
            onConfirm={() => setShowDelete(false)}
          />
        </div>
      </div>
    </>
  );
}
