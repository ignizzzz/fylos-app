import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, MapPin, Star, Camera, Settings,
  Shield, ShieldCheck, MessageCircle, Calendar, PawPrint,
  User, Heart, Edit3, Check, Users, Globe, MoreHorizontal,
  Clock, Zap, Syringe, Footprints, TreePine, GraduationCap,
  Coffee, X, Minus, Info, AlertCircle, Trash2, Flag,
  UserPlus, UserCheck, UserMinus, CalendarDays, Award,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   91 — NETWORK PROFILE v1
   Social identity layer · Network & Playdates system
   Zone: S+R hybrid — S for identity, R for trust/stats
   Two modes: isOwn (edit) vs others (connect/message/playdate)
   ═══════════════════════════════════════════════════════ */

/* ─────────────────── THEME ─────────────────── */
const T = {
  bg: '#F7F5F2',
  card: '#FFFFFF',
  border: 'rgba(0,0,0,0.04)',
  divider: '#F1EDE8',
  tint: '#FBE7DD',
  coral: '#E85D2A',
  txt: '#111111',
  muted: '#9B9B9F',
  mutedDark: '#6E6E73',
  success: '#34C759',
  successBg: '#EEF7F1',
  successBorder: '#D7EBDD',
  successText: '#3F8D63',
  warn: '#F59E0B',
  warnBg: '#F7F4EF',
  warnBorder: '#ECDDC8',
  warnText: '#B07A3A',
  danger: '#FF3B30',
  dangerBg: '#FEE8E7',
};

/* ─────────────────── MOCK DATA ─────────────────── */
const MOCK_PROFILE = {
  firstName: 'Talita',
  lastName: 'Kowalski',
  username: 'talita.k',
  initials: 'TK',
  avatar: null,
  bio: 'Dog mom to Leo & Luna — Zürich walks, playdates, always looking for new furry friends.',
  location: 'Zürich',
  memberSince: 'March 2024',
  plan: 'Free',

  // Trust
  idVerified: true,
  phoneVerified: true,
  allVaccinated: true,
  responseTime: '< 1 hour',
  responseRate: '96%',

  // Stats
  playdatesCompleted: 14,
  friendsCount: 47,
  rating: 4.9,
  ratingCount: 12,
  memberMonths: 14,

  // Pets
  pets: [
    {
      id: 'p1',
      name: 'Leo',
      breed: 'Golden Retriever',
      age: 3,
      weight: '28 kg',
      photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=120&h=120',
      vibeTags: ['Morning runner', 'Loves fetch'],
      energyLevel: 'High',
      vaccineStatus: 'Up to date',
      lastVet: 'Dr. Keller · Feb 2025',
    },
    {
      id: 'p2',
      name: 'Luna',
      breed: 'Mixed',
      age: 2,
      weight: '14 kg',
      photo: 'https://images.unsplash.com/photo-1537151608804-ea2f1ea14a15?auto=format&fit=crop&q=80&w=120&h=120',
      vibeTags: ['Calm hangouts', 'Loves small dogs'],
      energyLevel: 'Medium',
      vaccineStatus: 'Up to date',
      lastVet: 'Dr. Keller · Jan 2025',
    },
  ],

  // Preferences
  availability: 'Weekends · Mornings',
  preferredActivities: ['walks', 'park', 'calm'],
  preferredSizes: ['Medium', 'Large'],
  preferredRadius: '3 km',

  // Mutual (shown when isOwn=false)
  mutualCount: 3,
  mutualFriends: [
    { id: 'f1', name: 'Sophie M.', initials: 'SM', via: 'Pack', avatar: null },
    { id: 'f2', name: 'David & Roxy', initials: 'DR', via: 'Pack', avatar: null },
    { id: 'f3', name: 'Hana K.', initials: 'HK', via: 'Playdate', avatar: null },
  ],
  mutualPlaydates: [
    { id: 'pd1', date: 'Mar 12', location: 'Zurichhorn Park', pets: 'Leo + Bruno', rating: 5.0 },
    { id: 'pd2', date: 'Feb 3', location: 'Rieterpark', pets: 'Luna + Mochi', rating: 4.5 },
  ],
};

/* viewer's own preferences — used for compatibility strip */
const MY_PREFERENCES = {
  preferredActivities: ['walks', 'park', 'training'],
};

const ACTIVITY_MAP = {
  walks:    { label: 'Walks',         icon: Footprints },
  park:     { label: 'Park play',     icon: TreePine },
  training: { label: 'Training',      icon: GraduationCap },
  calm:     { label: 'Calm hangouts', icon: Coffee },
};

/* ─────────────────── PRIMITIVES ─────────────────── */
const SectionLabel = ({ children, className = '' }) => (
  <div className={`text-[10.5px] font-medium tracking-[0.04em] uppercase mb-1.5 ml-1 ${className}`}
       style={{ color: T.muted }}>
    {children}
  </div>
);

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[16px] border overflow-hidden ${className}`}
       style={{ borderColor: T.border }}>
    {children}
  </div>
);

const LargeCard = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[20px] border ${className}`}
       style={{ borderColor: T.border }}>
    {children}
  </div>
);

const PrefRow = ({ icon: Icon, label, value, last, onTap, isOwn }) => (
  <button
    onClick={onTap}
    disabled={!isOwn}
    className="w-full flex items-center gap-3 px-4 py-[11px] text-left active:bg-black/[0.02] transition-colors relative"
  >
    <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
         style={{ backgroundColor: T.tint }}>
      <Icon size={15} color={T.coral} strokeWidth={2} />
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-[14px] font-semibold block leading-tight truncate" style={{ color: T.txt }}>{label}</span>
    </div>
    <span className="text-[12.5px] font-medium shrink-0 max-w-[140px] truncate" style={{ color: T.mutedDark }}>{value}</span>
    {isOwn && <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} className="shrink-0 ml-1" />}
    {!last && (
      <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: T.divider }} />
    )}
  </button>
);

/* ─────────────────── BOTTOM SHEET ─────────────────── */
const BottomSheet = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative w-full rounded-t-[22px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[80%] overflow-y-auto"
        style={{ backgroundColor: T.bg }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col items-center pt-3 pb-1 sticky top-0 z-10"
             style={{ background: T.bg }}>
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#D5CEC7' }} />
        </div>
        <div className="px-5 pb-8">{children}</div>
      </div>
    </div>
  );
};

const SheetHeader = ({ title, subtitle, onClose }) => (
  <div className="flex items-start justify-between mb-4 mt-1">
    <div className="flex-1 pr-3">
      <h3 className="text-[17px] font-semibold mb-1" style={{ color: T.txt }}>{title}</h3>
      {subtitle && <p className="text-[12.5px] leading-snug" style={{ color: T.mutedDark }}>{subtitle}</p>}
    </div>
    <button onClick={onClose}
            className="w-7 h-7 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95">
      <X size={14} strokeWidth={2.2} color={T.txt} />
    </button>
  </div>
);

const PrimaryBtn = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full h-11 rounded-[14px] font-semibold text-[14.5px] text-white active:scale-[0.98] transition-all"
    style={{ background: disabled ? '#D4D4D8' : 'linear-gradient(180deg,#FF7240,#E85D2A)', cursor: disabled ? 'not-allowed' : 'pointer' }}
  >
    {children}
  </button>
);

const GhostBtn = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-full h-11 rounded-[14px] font-semibold text-[14.5px] active:scale-[0.98] transition-all mt-2"
    style={{ backgroundColor: '#FFFFFF', color: T.txt, border: '1px solid rgba(0,0,0,0.06)' }}
  >
    {children}
  </button>
);

/* ─────────────────── HEADER ─────────────────── */
const ProfileHeader = ({ isOwn, onBack, onSettings, onMore }) => (
  <div
    className="absolute top-0 left-0 w-full z-40 flex items-center justify-between px-5"
    style={{ paddingTop: 54, paddingBottom: 14, background: 'rgba(247,245,242,0.92)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
  >
    <button
      onClick={onBack}
      className="w-9 h-9 rounded-full bg-white border flex items-center justify-center active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
      style={{ borderColor: 'rgba(0,0,0,0.06)' }}
    >
      <ChevronLeft size={18} strokeWidth={2.2} color={T.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: T.txt }}>Social Profile</h1>
    {isOwn ? (
      <button
        onClick={onSettings}
        className="w-9 h-9 rounded-full bg-white border flex items-center justify-center active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        style={{ borderColor: 'rgba(0,0,0,0.06)' }}
      >
        <Settings size={16} strokeWidth={2} color={T.txt} />
      </button>
    ) : (
      <button
        onClick={onMore}
        className="w-9 h-9 rounded-full bg-white border flex items-center justify-center active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
        style={{ borderColor: 'rgba(0,0,0,0.06)' }}
      >
        <MoreHorizontal size={16} strokeWidth={2} color={T.txt} />
      </button>
    )}
  </div>
);

/* ─────────────────── IDENTITY HERO ─────────────────── */
const IdentityHero = ({ profile, isOwn, onEditPhoto }) => (
  <div className="flex flex-col items-center pt-6 pb-5 px-6">
    {/* Avatar */}
    <div className="relative mb-3">
      <div
        className="flex items-center justify-center"
        style={{
          width: 86, height: 86, borderRadius: 9999,
          background: 'linear-gradient(145deg,#FF7240 0%,#E85D2A 100%)',
          boxShadow: '0 10px 28px rgba(232,93,42,0.22)',
          border: profile.idVerified ? `2.5px solid ${T.success}` : 'none',
        }}
      >
        {profile.avatar
          ? <img src={profile.avatar} alt={profile.firstName} className="w-full h-full object-cover rounded-full" />
          : <span className="text-white font-semibold text-[30px] tracking-tight">{profile.initials}</span>
        }
      </div>
      {profile.idVerified && (
        <div
          className="absolute bottom-0 right-0 w-[22px] h-[22px] rounded-full flex items-center justify-center"
          style={{ background: T.success, border: `2.5px solid ${T.bg}`, boxShadow: '0 2px 6px rgba(52,199,89,0.3)' }}
        >
          <Check size={11} color="white" strokeWidth={3.5} />
        </div>
      )}
      {isOwn && (
        <button
          onClick={onEditPhoto}
          className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full flex items-center justify-center active:scale-95 transition-all"
          style={{ background: '#FFFFFF', border: `2px solid ${T.bg}`, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <Camera size={12} strokeWidth={2.2} color={T.txt} />
        </button>
      )}
    </div>

    {/* Name + plan badge */}
    <div className="flex items-center gap-2 mb-1">
      <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: T.txt }}>
        {profile.firstName} {profile.lastName}
      </h2>
      <span
        className="text-[9.5px] font-bold border px-1.5 py-[1px] rounded-[5px] tracking-[0.06em] leading-none"
        style={{ color: T.coral, borderColor: 'rgba(232,93,42,0.35)' }}
      >
        {profile.plan.toUpperCase()}
      </span>
    </div>

    {/* Meta line */}
    <p className="text-[12.5px] mb-2.5" style={{ color: T.muted }}>
      @{profile.username} · {profile.location} · Since {profile.memberSince}
    </p>

    {/* Bio */}
    <p className="text-[13px] text-center px-2 leading-snug max-w-[290px] mb-4" style={{ color: T.mutedDark }}>
      {profile.bio}
    </p>

    {/* Trust chips */}
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {profile.idVerified && (
        <TrustChip icon={ShieldCheck} iconColor={T.success} label="ID Verified" />
      )}
      {profile.allVaccinated && (
        <TrustChip icon={Syringe} iconColor={T.coral} label={`${profile.pets.length} Pets Vaccinated`} />
      )}
      <TrustChip icon={Star} iconColor={T.warn} label={`${profile.rating} · ${profile.ratingCount} reviews`} />
    </div>
  </div>
);

const TrustChip = ({ icon: Icon, iconColor, label }) => (
  <div
    className="h-[26px] px-2.5 rounded-full bg-white flex items-center gap-1.5"
    style={{ border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
  >
    <Icon size={11} color={iconColor} strokeWidth={2.5} />
    <span className="text-[11px] font-semibold" style={{ color: T.txt }}>{label}</span>
  </div>
);

/* ─────────────────── PET HIGHLIGHTS STRIP ─────────────────── */
const PetHighlightsStrip = ({ pets, isOwn }) => (
  <div className="px-5 mb-1">
    <SectionLabel>My Fylos</SectionLabel>
    <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
      {pets.map((pet) => (
        <div key={pet.id} className="shrink-0 flex flex-col items-center gap-1" style={{ width: 80 }}>
          {/* Photo */}
          <div className="relative">
            <div className="w-[56px] h-[56px] rounded-full overflow-hidden border-[1.5px]"
                 style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
              {pet.photo
                ? <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
                : (
                  <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: T.tint }}>
                    <PawPrint size={20} color={T.coral} strokeWidth={2} />
                  </div>
                )
              }
            </div>
            {isOwn && (
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center"
                   style={{ border: `1.5px solid ${T.bg}`, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <Edit3 size={9} color={T.muted} strokeWidth={2.2} />
              </div>
            )}
          </div>
          {/* Name + breed */}
          <p className="text-[12px] font-semibold text-center truncate w-full leading-tight" style={{ color: T.txt }}>{pet.name}</p>
          <p className="text-[10px] text-center truncate w-full leading-none" style={{ color: T.muted }}>{pet.breed}</p>
          {/* Vibe tag */}
          {pet.vibeTags[0] && (
            <div className="px-1.5 py-[2px] rounded-full whitespace-nowrap max-w-full overflow-hidden"
                 style={{ backgroundColor: T.tint }}>
              <span className="text-[9px] font-semibold block truncate" style={{ color: T.coral }}>{pet.vibeTags[0]}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────── COMPATIBILITY STRIP ─────────────────── */
const CompatibilityStrip = ({ profile, myPrefs }) => {
  const allActivities = ['walks', 'park', 'training', 'calm'];
  const theirSet = new Set(profile.preferredActivities);
  const mySet = new Set(myPrefs.preferredActivities);

  return (
    <div className="mx-5 mb-1">
      <LargeCard className="p-4">
        <div className="flex items-center gap-1.5 mb-3">
          <Award size={13} color={T.coral} strokeWidth={2.2} />
          <span className="text-[11px] font-bold uppercase tracking-[0.05em]" style={{ color: T.muted }}>
            Matches your style
          </span>
        </div>
        {/* Activity match chips */}
        <div className="flex gap-2 flex-wrap mb-3">
          {allActivities.map((act) => {
            const matched = theirSet.has(act) && mySet.has(act);
            const theyHave = theirSet.has(act);
            const info = ACTIVITY_MAP[act];
            const Icon = info.icon;
            if (!theyHave) return null;
            return (
              <div key={act}
                   className="h-[26px] px-2.5 rounded-full flex items-center gap-1.5 border"
                   style={
                     matched
                       ? { backgroundColor: T.successBg, borderColor: T.successBorder }
                       : { backgroundColor: '#F2F2F7', borderColor: 'transparent' }
                   }>
                <Icon size={11} color={matched ? T.successText : T.muted} strokeWidth={2} />
                <span className="text-[11px] font-semibold" style={{ color: matched ? T.successText : T.muted }}>
                  {info.label}
                </span>
                {matched
                  ? <Check size={10} color={T.successText} strokeWidth={3} />
                  : <Minus size={10} color={T.muted} strokeWidth={2.5} />
                }
              </div>
            );
          })}
        </div>
        {/* Availability + radius */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <CalendarDays size={12} color={T.mutedDark} strokeWidth={2} />
            <span className="text-[12px]" style={{ color: T.mutedDark }}>{profile.availability}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={12} color={T.mutedDark} strokeWidth={2} />
            <span className="text-[12px]" style={{ color: T.mutedDark }}>Within {profile.preferredRadius} · {profile.location}</span>
          </div>
        </div>
      </LargeCard>
    </div>
  );
};

/* ─────────────────── STATS STRIP ─────────────────── */
const StatsStrip = ({ profile }) => {
  const stats = [
    { val: profile.playdatesCompleted, label: 'playdates' },
    { val: profile.friendsCount,       label: 'friends' },
    { val: profile.rating,             label: 'rating' },
    { val: profile.memberMonths,       label: 'months' },
  ];
  return (
    <div className="px-5 mb-1">
      <div className="bg-white rounded-[16px] flex items-center py-3 border"
           style={{ borderColor: T.border }}>
        {stats.map((s, i) => (
          <div key={s.label}
               className="flex-1 flex flex-col items-center"
               style={{ borderRight: i < 3 ? `1px solid ${T.divider}` : 'none' }}>
            <span className="text-[17px] font-semibold leading-none" style={{ color: T.txt }}>{s.val}</span>
            <span className="text-[10.5px] mt-1 lowercase" style={{ color: T.muted }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────── ACTION ROW (others view) ─────────────────── */
const ActionRow = ({ connectionStatus, onConnect, onMessage, onPlaydate }) => {
  const connectStyle = () => {
    if (connectionStatus === 'connected') return { bg: T.successBg, color: T.successText, border: T.successBorder };
    if (connectionStatus === 'pending')   return { bg: T.warnBg,   color: T.warnText,    border: T.warnBorder };
    return null;
  };
  const cs = connectStyle();
  const connectLabel = connectionStatus === 'connected' ? '✓ Connected' : connectionStatus === 'pending' ? 'Pending…' : 'Connect';

  return (
    <div className="px-5 mb-2">
      {/* Primary connect button */}
      {connectionStatus === 'none' ? (
        <button
          onClick={onConnect}
          className="w-full h-[46px] rounded-[16px] font-semibold text-[15px] text-white active:scale-[0.98] transition-all mb-2.5 flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(180deg,#FF7240,#E85D2A)', boxShadow: '0 4px 14px rgba(232,93,42,0.3)' }}
        >
          <UserPlus size={16} strokeWidth={2.2} />
          Connect
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="w-full h-[46px] rounded-[16px] font-semibold text-[15px] active:scale-[0.98] transition-all mb-2.5 flex items-center justify-center gap-2 border"
          style={{ backgroundColor: cs?.bg, color: cs?.color, borderColor: cs?.border }}
        >
          {connectionStatus === 'connected' ? <UserCheck size={16} strokeWidth={2.2} /> : <UserMinus size={16} strokeWidth={2.2} />}
          {connectLabel}
        </button>
      )}
      {/* Secondary row: Message + Propose Playdate */}
      <div className="flex gap-2.5">
        <button
          onClick={onMessage}
          className="flex-1 h-[42px] rounded-[14px] font-semibold text-[13.5px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-white border shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          style={{ borderColor: 'rgba(0,0,0,0.07)', color: T.txt }}
        >
          <MessageCircle size={15} strokeWidth={2} />
          Message
        </button>
        <button
          onClick={onPlaydate}
          className="flex-1 h-[42px] rounded-[14px] font-semibold text-[13.5px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-white border shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          style={{ borderColor: 'rgba(0,0,0,0.07)', color: T.txt }}
        >
          <Calendar size={15} strokeWidth={2} />
          Playdate
        </button>
      </div>
    </div>
  );
};

/* ─────────────────── TAB BAR ─────────────────── */
const TabBar = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'about',  label: 'About' },
    { id: 'mutual', label: 'Mutual' },
  ];
  const activeIdx = tabs.findIndex((t) => t.id === activeTab);
  return (
    <div className="mx-5 mb-4">
      <div className="relative flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full border"
           style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
        {/* Sliding pill */}
        <div
          className="absolute top-1.5 bottom-1.5 bg-[#111111] rounded-full transition-all"
          style={{
            width: `calc(${100 / tabs.length}% - 12px)`,
            left: `calc(${(100 / tabs.length) * activeIdx}% + 6px)`,
            transitionDuration: '260ms',
            transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)',
          }}
        />
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative z-10 flex-1 py-1.5 text-[13px] font-semibold transition-colors duration-[200ms] text-center"
            style={{ color: activeTab === tab.id ? '#FFFFFF' : T.mutedDark }}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────── ABOUT TAB ─────────────────── */
const AboutTab = ({ profile, isOwn, onEditPref, onEditBio }) => (
  <div className="px-5 flex flex-col gap-3 pb-6">
    {/* Bio card */}
    <div>
      <SectionLabel>Bio</SectionLabel>
      <LargeCard className="p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[14px] leading-[1.55] flex-1" style={{ color: T.mutedDark }}>{profile.bio}</p>
          {isOwn && (
            <button onClick={onEditBio} className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{ backgroundColor: T.tint }}>
              <Edit3 size={13} color={T.coral} strokeWidth={2.2} />
            </button>
          )}
        </div>
      </LargeCard>
    </div>

    {/* Preferences */}
    <div>
      <SectionLabel>Playdate Preferences</SectionLabel>
      <Card>
        <PrefRow icon={Footprints} label="Preferred activities"
                 value={profile.preferredActivities.map((a) => ACTIVITY_MAP[a]?.label).join(', ')}
                 onTap={() => onEditPref('activities')} isOwn={isOwn} />
        <PrefRow icon={CalendarDays} label="Availability"
                 value={profile.availability}
                 onTap={() => onEditPref('availability')} isOwn={isOwn} />
        <PrefRow icon={MapPin} label="Play radius"
                 value={`Within ${profile.preferredRadius}`}
                 onTap={() => onEditPref('radius')} isOwn={isOwn} />
        <PrefRow icon={PawPrint} label="Dog size match"
                 value={profile.preferredSizes.join(', ')}
                 onTap={() => onEditPref('sizes')} isOwn={isOwn} />
        <PrefRow icon={Zap} label="Energy level"
                 value="High energy welcome"
                 onTap={() => onEditPref('energy')} isOwn={isOwn} last />
      </Card>
    </div>

    {/* Dog personality cards */}
    <div>
      <SectionLabel>Personality & Health</SectionLabel>
      <div className="flex flex-col gap-3">
        {profile.pets.map((pet) => (
          <LargeCard key={pet.id} className="p-4">
            {/* Pet header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-[48px] h-[48px] rounded-full overflow-hidden shrink-0 border-[1.5px]"
                   style={{ borderColor: 'rgba(0,0,0,0.05)' }}>
                {pet.photo
                  ? <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: T.tint }}>
                      <PawPrint size={18} color={T.coral} />
                    </div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold leading-tight truncate" style={{ color: T.txt }}>
                  {pet.name}
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: T.muted }}>
                  {pet.breed} · Age {pet.age} · {pet.weight}
                </p>
              </div>
            </div>
            {/* Vibe tags */}
            <div className="flex gap-1.5 flex-wrap mb-3">
              {pet.vibeTags.map((tag) => (
                <div key={tag} className="px-2 py-[3px] rounded-full" style={{ backgroundColor: T.tint }}>
                  <span className="text-[11px] font-semibold" style={{ color: T.coral }}>{tag}</span>
                </div>
              ))}
              <div className="px-2 py-[3px] rounded-full" style={{ backgroundColor: '#F0F0F5' }}>
                <span className="text-[11px] font-semibold" style={{ color: T.mutedDark }}>{pet.energyLevel} energy</span>
              </div>
            </div>
            {/* Health row */}
            <div className="pt-3 border-t" style={{ borderColor: T.divider }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: T.successBg }}>
                  <Check size={9} color={T.successText} strokeWidth={3} />
                </div>
                <span className="text-[12px] font-medium" style={{ color: T.successText }}>{pet.vaccineStatus}</span>
              </div>
              <p className="text-[11.5px] ml-6" style={{ color: T.muted }}>Last vet: {pet.lastVet}</p>
            </div>
          </LargeCard>
        ))}
      </div>
    </div>

    {/* Response strip */}
    <div className="flex items-center gap-2 px-1">
      <Clock size={13} color={T.mutedDark} strokeWidth={2} />
      <span className="text-[12px]" style={{ color: T.mutedDark }}>
        Replies within {profile.responseTime} · {profile.responseRate} response rate
      </span>
    </div>
  </div>
);

/* ─────────────────── MUTUAL TAB ─────────────────── */
const MutualTab = ({ profile, isOwn }) => {
  if (isOwn) {
    return (
      <div className="px-5 flex flex-col items-center py-12 gap-3">
        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#F0F0F5' }}>
          <Users size={24} color={T.muted} strokeWidth={1.5} />
        </div>
        <p className="text-[14px] font-semibold" style={{ color: T.muted }}>No mutual data here</p>
        <p className="text-[12.5px] text-center leading-snug max-w-[220px]" style={{ color: T.muted }}>
          Switch to another profile to see mutual connections and shared playdates.
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 flex flex-col gap-4 pb-6">
      {/* Mutual friends */}
      <div>
        <SectionLabel>{profile.mutualCount} mutual friends</SectionLabel>
        <Card>
          {profile.mutualFriends.map((friend, i) => (
            <div key={friend.id} className="relative flex items-center gap-3 px-4 py-3">
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                   style={{ background: 'linear-gradient(145deg,#FF7240,#E85D2A)' }}>
                <span className="text-white text-[12px] font-semibold">{friend.initials}</span>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold leading-tight truncate" style={{ color: T.txt }}>{friend.name}</p>
                <p className="text-[11.5px] mt-0.5" style={{ color: T.muted }}>via {friend.via}</p>
              </div>
              <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
              {i < profile.mutualFriends.length - 1 && (
                <div className="absolute bottom-0 left-[58px] right-4 h-px" style={{ background: T.divider }} />
              )}
            </div>
          ))}
        </Card>
      </div>

      {/* Shared playdates */}
      {profile.mutualPlaydates.length > 0 && (
        <div>
          <SectionLabel>Playdate history together</SectionLabel>
          <Card>
            {profile.mutualPlaydates.map((pd, i) => (
              <div key={pd.id} className="relative flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                     style={{ backgroundColor: T.tint }}>
                  <Calendar size={14} color={T.coral} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold leading-tight" style={{ color: T.txt }}>
                    {pd.date} · {pd.location}
                  </p>
                  <p className="text-[12px] mt-0.5 truncate" style={{ color: T.muted }}>{pd.pets}</p>
                </div>
                {/* Rating badge */}
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full border"
                     style={{ backgroundColor: T.warnBg, borderColor: T.warnBorder }}>
                  <Star size={11} color={T.warn} fill={T.warn} strokeWidth={0} />
                  <span className="text-[11.5px] font-semibold" style={{ color: T.warnText }}>{pd.rating.toFixed(1)}</span>
                </div>
                {i < profile.mutualPlaydates.length - 1 && (
                  <div className="absolute bottom-0 left-[58px] right-4 h-px" style={{ background: T.divider }} />
                )}
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};

/* ─────────────────── MORE SHEET (block/report) ─────────────────── */
const MoreSheet = ({ onClose }) => (
  <>
    <SheetHeader title="More options" onClose={onClose} />
    <div className="flex flex-col gap-2">
      {[
        { icon: UserMinus, label: 'Disconnect', color: T.txt, bg: '#F2F2F7' },
        { icon: Flag, label: 'Report profile', color: T.danger, bg: T.dangerBg },
      ].map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            onClick={onClose}
            className="w-full flex items-center gap-3 p-3 rounded-[12px] border border-black/[0.04] active:scale-[0.99] transition-all"
            style={{ backgroundColor: 'white' }}
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                 style={{ backgroundColor: item.bg }}>
              <Icon size={15} color={item.color} strokeWidth={2} />
            </div>
            <span className="text-[14px] font-semibold" style={{ color: item.color }}>{item.label}</span>
          </button>
        );
      })}
    </div>
    <GhostBtn onClick={onClose}>Cancel</GhostBtn>
  </>
);

/* ═══════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════ */
export default function NetworkProfileScreen() {
  const profile = MOCK_PROFILE;

  /* Toggle isOwn to preview both modes */
  const [isOwn, setIsOwn] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [connectionStatus, setConnectionStatus] = useState('none');
  const [sheet, setSheet] = useState(null);

  const cycleConnection = () => {
    setConnectionStatus((s) => {
      if (s === 'none')      return 'pending';
      if (s === 'pending')   return 'connected';
      return 'none';
    });
  };

  const back = () => {
    if (window.history.length > 1) window.history.back();
    else window.location.href = '/';
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .net-scroll::-webkit-scrollbar { display: none; }
        .net-scroll { scrollbar-width: none; }
      `}</style>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <div className="relative" style={{
          width: 390, height: 844, borderRadius: 50,
          border: '8px solid #000', overflow: 'hidden',
          backgroundColor: T.bg,
        }}>
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]"
               style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
               style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
               style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* ── Scrollable body ── */}
          <div className="absolute inset-0 overflow-y-auto net-scroll" style={{ paddingTop: 108 }}>

            {/* Mode toggle (dev helper — remove in production) */}
            <div className="mx-5 mb-3 flex items-center gap-2 bg-white rounded-[12px] p-2.5 border border-black/[0.04]">
              <span className="text-[11px] text-[#8E8E93] font-medium flex-1">Preview mode:</span>
              <button
                onClick={() => { setIsOwn(!isOwn); setSheet(null); }}
                className="text-[11px] font-semibold px-3 py-1 rounded-full active:scale-95 transition-all"
                style={{ backgroundColor: isOwn ? T.tint : '#F0F0F5', color: isOwn ? T.coral : T.mutedDark }}
              >
                {isOwn ? 'Own profile' : 'Others view'}
              </button>
            </div>

            {/* Identity hero */}
            <IdentityHero profile={profile} isOwn={isOwn} onEditPhoto={() => setSheet('photo')} />

            {/* Pet highlights */}
            <PetHighlightsStrip pets={profile.pets} isOwn={isOwn} />

            {/* Separator */}
            <div className="h-4" />

            {/* Compatibility strip — others view only */}
            {!isOwn && (
              <CompatibilityStrip profile={profile} myPrefs={MY_PREFERENCES} />
            )}

            {/* Spacer */}
            <div className="h-3" />

            {/* Stats strip */}
            <StatsStrip profile={profile} />

            <div className="h-3" />

            {/* Action row — others view only */}
            {!isOwn && (
              <ActionRow
                connectionStatus={connectionStatus}
                onConnect={cycleConnection}
                onMessage={() => {}}
                onPlaydate={() => {}}
              />
            )}

            <div className="h-2" />

            {/* Tabs */}
            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab content */}
            {activeTab === 'about' && (
              <AboutTab
                profile={profile}
                isOwn={isOwn}
                onEditPref={(field) => setSheet('pref:' + field)}
                onEditBio={() => setSheet('bio')}
              />
            )}
            {activeTab === 'mutual' && (
              <MutualTab profile={profile} isOwn={isOwn} />
            )}

            {/* Bottom safe area */}
            <div className="h-20" />
          </div>

          {/* Sticky header (rendered on top of scroll) */}
          <ProfileHeader
            isOwn={isOwn}
            onBack={back}
            onSettings={() => window.location.href = '/user-profile'}
            onMore={() => setSheet('more')}
          />

          {/* Bottom sheet */}
          <BottomSheet open={!!sheet} onClose={() => setSheet(null)}>
            {sheet === 'more' && <MoreSheet onClose={() => setSheet(null)} />}
            {sheet === 'photo' && (
              <>
                <SheetHeader title="Profile photo" subtitle="Upload a clear photo of yourself." onClose={() => setSheet(null)} />
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'Take a photo',         danger: false },
                    { label: 'Choose from library',  danger: false },
                    { label: 'Remove photo',          danger: true  },
                  ].map((item) => (
                    <button key={item.label} onClick={() => setSheet(null)}
                            className="w-full flex items-center gap-3 p-3 rounded-[12px] bg-white border border-black/[0.04] active:scale-[0.99] transition-all">
                      <span className="text-[14px] font-semibold"
                            style={{ color: item.danger ? T.danger : T.txt }}>{item.label}</span>
                    </button>
                  ))}
                </div>
                <GhostBtn onClick={() => setSheet(null)}>Cancel</GhostBtn>
              </>
            )}
            {sheet && sheet.startsWith('pref:') && (
              <>
                <SheetHeader
                  title={`Edit ${sheet.replace('pref:', '')}`}
                  subtitle="Update your playdate preferences."
                  onClose={() => setSheet(null)}
                />
                <PrimaryBtn onClick={() => setSheet(null)}>Save changes</PrimaryBtn>
                <GhostBtn onClick={() => setSheet(null)}>Cancel</GhostBtn>
              </>
            )}
            {sheet === 'bio' && (
              <>
                <SheetHeader title="Edit bio" subtitle="A short line shown on your public profile." onClose={() => setSheet(null)} />
                <div className="mb-3">
                  <textarea
                    defaultValue={profile.bio}
                    maxLength={160}
                    rows={3}
                    className="w-full px-3.5 py-3 rounded-[12px] text-[14px] focus:outline-none resize-none"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.06)', color: T.txt }}
                  />
                </div>
                <PrimaryBtn onClick={() => setSheet(null)}>Save</PrimaryBtn>
                <GhostBtn onClick={() => setSheet(null)}>Cancel</GhostBtn>
              </>
            )}
          </BottomSheet>
        </div>
      </div>
    </>
  );
}
