import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronRight,
  Camera,
  Plus,
  Share2,
  Sparkles,
  Footprints,
  Trees,
  Waves,
  Heart,
  Clock,
  Search,
  X,
  MapPin,
  ShieldCheck,
  Syringe,
  Star,
  Check,
  Calendar,
  Zap,
  Users,
  TreePine,
  GraduationCap,
  Coffee,
  Edit3,
  Award,
  CalendarDays,
  Minus,
} from 'lucide-react';
import TwinFinderSheet from '../../../components/TwinFinderSheet';
import PersonalityCardSheet from '../../../components/PersonalityCardSheet';

/* ═══════════════════════════════════════════════════════
   ProfileMode — Social tab · Profile sub-mode
   Zone S+R hybrid: identity warmth + trust density.
   (was src/components/ProfileTabContainer.jsx)
   ═══════════════════════════════════════════════════════ */

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
};

const ACTIVITY_MAP = {
  walks:    { label: 'Walks',         Icon: Footprints },
  park:     { label: 'Park play',     Icon: TreePine },
  training: { label: 'Training',      Icon: GraduationCap },
  calm:     { label: 'Calm hangouts', Icon: Coffee },
};

const SEED_MILESTONES = [
  { id: 'first-walk',  label: 'First walk',         dateStr: 'Jun 12, 2024', dateMs: Date.parse('2024-06-12'), Icon: Footprints },
  { id: 'first-park',  label: 'First park visit',   dateStr: 'Jun 28, 2024', dateMs: Date.parse('2024-06-28'), Icon: Trees },
  { id: 'first-fylos', label: 'First Fylos friend', dateStr: 'Jul 8, 2024',  dateMs: Date.parse('2024-07-08'), Icon: Heart },
  { id: 'first-swim',  label: 'First swim',         dateStr: 'Sep 4, 2024',  dateMs: Date.parse('2024-09-04'), Icon: Waves },
];

/* ─────────── primitives ─────────── */
const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 10.5, fontWeight: 600, color: T.muted, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
    {children}
  </div>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: T.card, borderRadius: 16, border: `1px solid ${T.border}`, overflow: 'hidden', ...style }}>
    {children}
  </div>
);

const LargeCard = ({ children, style = {} }) => (
  <div style={{ background: T.card, borderRadius: 20, border: `1px solid ${T.border}`, ...style }}>
    {children}
  </div>
);

/* ─────────── IDENTITY HERO ─────────── */
function IdentityHero({ petName, petBreed, petAge, petAvatar, archetype, sinceLabel, walkCount, friendCount, photosCount, lastWalkAgo, onShare, onTapPersonality, shareToast }) {
  const initials = petName ? petName[0].toUpperCase() : '?';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, paddingBottom: 16 }}>
      {/* Avatar */}
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 9999,
          overflow: 'hidden',
          border: `2.5px solid ${T.success}`,
          boxShadow: '0 8px 24px rgba(232,93,42,0.18)',
        }}>
          {petAvatar
            ? <img src={petAvatar} alt={petName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : (
              <div style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(145deg,#FF7240 0%,#E85D2A 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 700, color: '#FFF',
              }}>
                {initials}
              </div>
            )
          }
        </div>
        {/* verified dot */}
        <div style={{
          position: 'absolute', bottom: 1, right: 1,
          width: 22, height: 22, borderRadius: 9999,
          background: T.success, border: `2.5px solid ${T.bg}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(52,199,89,0.3)',
        }}>
          <Check size={11} color="#FFF" strokeWidth={3.5} />
        </div>
        {/* share */}
        <button onClick={onShare} style={{
          position: 'absolute', top: 0, right: -32,
          width: 28, height: 28, borderRadius: 9999,
          background: '#FFF', border: `1px solid rgba(0,0,0,0.07)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          <Share2 size={13} strokeWidth={2} color={T.muted} />
        </button>
      </div>

      {/* Name */}
      <div style={{ fontSize: 20, fontWeight: 700, color: T.txt, letterSpacing: '-0.02em', marginBottom: 2 }}>
        {petName}
      </div>
      {/* Sub-meta */}
      <div style={{ fontSize: 12.5, color: T.muted, marginBottom: 10 }}>
        {petBreed} · {petAge} · Since {sinceLabel}
      </div>

      {/* Archetype pill + live line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <button
          onClick={onTapPersonality}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: T.tint, color: '#7A2F12',
            padding: '5px 12px', borderRadius: 9999,
            fontSize: 12, fontWeight: 600, cursor: 'pointer',
            border: 'none',
          }}
        >
          <Sparkles size={11} strokeWidth={2.2} color={T.coral} />
          {archetype}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: T.muted }}>
          <Footprints size={11} strokeWidth={2} color="#9B9B9F" />
          <span>Just back from a walk</span>
          <span style={{ color: '#D4CEC6' }}>·</span>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{lastWalkAgo}</span>
        </div>
      </div>

      {/* Trust chips */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <TrustChip Icon={ShieldCheck} iconColor={T.success} label="Vaccinated" />
        <TrustChip Icon={Footprints} iconColor={T.coral} label={`${walkCount} walks`} />
        <TrustChip Icon={Star} iconColor={T.warn} label={`4.9 · 12 ratings`} />
      </div>

      {shareToast && (
        <div style={{
          marginTop: 8,
          background: '#111', color: '#FFF',
          fontSize: 11, fontWeight: 600,
          padding: '5px 12px', borderRadius: 9999,
        }}>
          Link copied
        </div>
      )}
    </div>
  );
}

function TrustChip({ Icon, iconColor, label }) {
  return (
    <div style={{
      height: 26, padding: '0 10px', borderRadius: 9999,
      background: '#FFF', border: '1px solid rgba(0,0,0,0.07)',
      display: 'inline-flex', alignItems: 'center', gap: 5,
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}>
      <Icon size={11} color={iconColor} strokeWidth={2.5} />
      <span style={{ fontSize: 11, fontWeight: 600, color: T.txt }}>{label}</span>
    </div>
  );
}

/* ─────────── STATS STRIP ─────────── */
function StatsStrip({ walkCount, friendCount, photosCount, sinceLabel }) {
  const stats = [
    { val: walkCount,    label: 'walks' },
    { val: friendCount,  label: 'friends' },
    { val: '4.9',        label: 'rating' },
    { val: photosCount,  label: 'photos' },
  ];
  return (
    <div style={{ background: '#FFF', borderRadius: 16, border: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', paddingTop: 12, paddingBottom: 12 }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: i < 3 ? `1px solid ${T.divider}` : 'none' }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: T.txt, lineHeight: 1 }}>{s.val}</span>
          <span style={{ fontSize: 10.5, color: T.muted, marginTop: 4 }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────── TAB BAR ─────────── */
function TabBar({ activeTab, onTabChange }) {
  const tabs = [{ id: 'about', label: 'About' }, { id: 'mutual', label: 'Mutual' }];
  const activeIdx = tabs.findIndex((t) => t.id === activeTab);
  return (
    <div style={{ position: 'relative', display: 'flex', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', padding: 6, borderRadius: 9999, border: '1px solid rgba(0,0,0,0.05)' }}>
      {/* sliding pill */}
      <div style={{
        position: 'absolute', top: 6, bottom: 6,
        background: '#111',
        borderRadius: 9999,
        width: `calc(${100 / tabs.length}% - 12px)`,
        left: `calc(${(100 / tabs.length) * activeIdx}% + 6px)`,
        transition: 'left 260ms cubic-bezier(0.32,0.72,0,1)',
      }} />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            position: 'relative', zIndex: 1,
            flex: 1, padding: '6px 0',
            fontSize: 13, fontWeight: 600, textAlign: 'center',
            color: activeTab === tab.id ? '#FFF' : T.mutedDark,
            background: 'none', border: 'none', cursor: 'pointer',
            transition: 'color 200ms',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ─────────── ABOUT TAB ─────────── */
function AboutTab({ petName, petAvatar, petBreed, petAge, archetype, firsts, memoryItems, onOpenMemory, onAddMemory, setAddMemoryOpen, onTapPersonality }) {
  const vibeTags = ['Morning runner', 'Loves fetch', 'Social butterfly'];
  const prefActivities = ['walks', 'park', 'calm'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Personality card */}
      <div>
        <SectionLabel>Personality</SectionLabel>
        <LargeCard style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', flexShrink: 0, border: `1.5px solid rgba(0,0,0,0.05)` }}>
              {petAvatar
                ? <img src={petAvatar} alt={petName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: T.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: T.coral }}>{petName[0]}</div>
              }
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: T.txt }}>{petName}</div>
              <div style={{ fontSize: 12, color: T.muted }}>{petBreed} · Age {petAge}</div>
            </div>
          </div>
          {/* Vibe tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            {vibeTags.map((tag) => (
              <div key={tag} style={{ padding: '3px 10px', borderRadius: 9999, background: T.tint }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: T.coral }}>{tag}</span>
              </div>
            ))}
            <div style={{ padding: '3px 10px', borderRadius: 9999, background: '#F0F0F5' }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: T.mutedDark }}>High energy</span>
            </div>
          </div>
          {/* Preferred activities */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {prefActivities.map((act) => {
              const info = ACTIVITY_MAP[act];
              const Icon = info.Icon;
              return (
                <div key={act} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 9999, background: T.successBg, border: `1px solid ${T.successBorder}` }}>
                  <Icon size={10} color={T.successText} strokeWidth={2} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.successText }}>{info.label}</span>
                </div>
              );
            })}
          </div>
        </LargeCard>
      </div>

      {/* Health signal */}
      <div>
        <SectionLabel>Health & Trust</SectionLabel>
        <Card>
          {[
            { label: 'Vaccinations', value: 'All up to date', ok: true },
            { label: 'Last vet visit', value: 'Dr. Keller · Feb 2025', ok: true },
            { label: 'Response rate', value: '96% · < 1 hour', ok: true },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', position: 'relative' }}>
              <div style={{ width: 30, height: 30, borderRadius: 9999, background: T.successBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={13} color={T.successText} strokeWidth={3} />
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.txt }}>{row.label}</span>
              <span style={{ fontSize: 12.5, color: T.mutedDark, maxWidth: 140, textAlign: 'right' }}>{row.value}</span>
              {i < arr.length - 1 && <div style={{ position: 'absolute', bottom: 0, left: 58, right: 0, height: 1, background: T.divider }} />}
            </div>
          ))}
        </Card>
      </div>

      {/* Memories */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <SectionLabel>Memories</SectionLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {onAddMemory && (
              <button onClick={() => setAddMemoryOpen(true)} style={{ fontSize: 12, color: T.coral, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Plus size={11} strokeWidth={2.4} />Add
              </button>
            )}
            {memoryItems.length > 0 && <span style={{ fontSize: 12, color: T.muted }}>All →</span>}
          </div>
        </div>
        <MemoriesBlock memoryItems={memoryItems} petName={petName} onOpenMemory={onOpenMemory} onAddMemory={onAddMemory ? () => setAddMemoryOpen(true) : null} />
      </div>

      {/* Firsts */}
      <div>
        <SectionLabel>Milestones</SectionLabel>
        <FirstsBlock firsts={firsts} />
      </div>
    </div>
  );
}

/* ─────────── MUTUAL TAB ─────────── */
function MutualTab({ petName, petAvatar, totalFriends, activeCount, closestBond, otherFriends, onOpenNetwork, onTapBond, onSelectMember, memories }) {
  const bondMax = 6;
  const bondFilled = Math.max(1, Math.min(bondMax, closestBond?.walks || 0));

  // derive shared memories from the closestBond
  const sharedMemories = memories.filter((m) => m?.dogB?.name === closestBond?.name).slice(0, 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Best friend */}
      {closestBond && (
        <div>
          <SectionLabel>Best Friend</SectionLabel>
          <button
            onClick={onTapBond}
            style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              padding: '14px 16px',
              background: 'linear-gradient(135deg,#FFFFFF 0%,#FFF6F0 100%)',
              border: '1px solid #EDE8E2', borderRadius: 18,
              display: 'block',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* overlap photos */}
              <div style={{ position: 'relative', width: 76, height: 46, flexShrink: 0 }}>
                {petAvatar
                  ? <img src={petAvatar} alt={petName} className="rounded-full object-cover absolute" style={{ width: 46, height: 46, top: 0, left: 0, border: '2.5px solid #FFF', borderRadius: 9999, objectFit: 'cover' }} />
                  : <div style={{ width: 46, height: 46, borderRadius: 9999, background: T.tint, color: T.coral, fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 0, border: '2.5px solid #FFF' }}>{petName[0]}</div>
                }
                {closestBond.photo
                  ? <img src={closestBond.photo} alt={closestBond.name} className="rounded-full object-cover absolute" style={{ width: 46, height: 46, top: 0, left: 30, border: '2.5px solid #FFF', borderRadius: 9999, objectFit: 'cover' }} />
                  : <div style={{ width: 46, height: 46, borderRadius: 9999, background: T.tint, color: T.coral, fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, left: 30, border: '2.5px solid #FFF' }}>{closestBond.name[0]}</div>
                }
                <span style={{ position: 'absolute', top: -3, left: 30, width: 18, height: 18, borderRadius: 9999, background: '#FFF', border: '2px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(232,93,42,0.30)' }}>
                  <Heart size={9} style={{ color: T.coral, fill: T.coral }} strokeWidth={0} />
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, color: T.txt }}>{petName} & {closestBond.name}</div>
                <div style={{ fontSize: 11, color: '#7A2F12', opacity: 0.65, marginTop: 2, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Best friend</div>
              </div>
              <ChevronRight size={14} strokeWidth={2} color="#9B9B9F" />
            </div>
            {/* bond dots */}
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: bondMax }).map((_, i) => (
                  <span key={i} style={{ width: 6, height: 6, borderRadius: 9999, background: i < bondFilled ? T.coral : '#EDE8E2' }} />
                ))}
              </div>
              <span style={{ fontSize: 11, color: T.mutedDark, fontVariantNumeric: 'tabular-nums' }}>
                {closestBond.walks} {closestBond.walks === 1 ? 'walk' : 'walks'} together
              </span>
            </div>
            {(closestBond.lastDateStr || closestBond.lastLocation) && (
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: T.muted }}>
                <MapPin size={11} strokeWidth={2} color="#9B9B9F" />
                <span>Last met {closestBond.lastDateStr || 'recently'}{closestBond.lastLocation ? ` · ${closestBond.lastLocation}` : ''}</span>
              </div>
            )}
          </button>
        </div>
      )}

      {/* All friends */}
      {otherFriends.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <SectionLabel>Friends · {totalFriends}</SectionLabel>
            {activeCount > 0 && (
              <span style={{ fontSize: 11, color: T.coral, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: 9999, background: T.coral, display: 'inline-block', animation: 'pt-pulse-soft 1.6s ease-in-out infinite' }} />
                {activeCount} active
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
            {otherFriends.map((f, i) => {
              const isActive = i === 0;
              return (
                <button
                  key={f.id}
                  onClick={() => onSelectMember?.(f)}
                  style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  <div style={{ position: 'relative' }}>
                    {f.petPhoto
                      ? <img src={f.petPhoto} alt={f.petName} style={{ width: 42, height: 42, borderRadius: 9999, objectFit: 'cover', border: `2px solid ${T.bg}` }} />
                      : <div style={{ width: 42, height: 42, borderRadius: 9999, background: T.tint, color: T.coral, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${T.bg}` }}>{f.petName[0]}</div>
                    }
                    {isActive && <span style={{ position: 'absolute', right: -1, bottom: -1, width: 11, height: 11, borderRadius: 9999, background: T.success, border: `2px solid ${T.bg}` }} />}
                  </div>
                  <span style={{ fontSize: 10, color: T.muted, maxWidth: 44, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.petName}</span>
                </button>
              );
            })}
            {totalFriends > otherFriends.length + 1 && (
              <button onClick={onOpenNetwork} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer', background: 'none', border: 'none' }}>
                <div style={{ width: 42, height: 42, borderRadius: 9999, background: '#EDE8E2', color: T.muted, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px solid ${T.bg}` }}>
                  +{totalFriends - otherFriends.length - 1}
                </div>
                <span style={{ fontSize: 10, color: T.muted }}>more</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Shared memories with best friend */}
      {sharedMemories.length > 0 && (
        <div>
          <SectionLabel>Memories with {closestBond?.name}</SectionLabel>
          <Card>
            {sharedMemories.map((m, i) => (
              <div key={m.id || i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 16px', position: 'relative' }}>
                <div style={{ width: 30, height: 30, borderRadius: 9999, background: T.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={14} color={T.coral} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: T.txt, lineHeight: 1.2 }}>{m.title || 'Time together'}</div>
                  <div style={{ fontSize: 11.5, color: T.muted, marginTop: 2 }}>{m.location && `${m.location} · `}{m.dateStr}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 9999, background: T.warnBg, border: `1px solid ${T.warnBorder}` }}>
                  <Star size={10} color={T.warn} fill={T.warn} strokeWidth={0} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.warnText }}>5.0</span>
                </div>
                {i < sharedMemories.length - 1 && <div style={{ position: 'absolute', bottom: 0, left: 58, right: 0, height: 1, background: T.divider }} />}
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Discover */}
      <DiscoverRow petName={petName} twinCandidate={otherFriends[0] || null} onTap={() => {}} />
    </div>
  );
}

/* ─────────── MEMORIES ─────────── */
function MemoriesBlock({ memoryItems, petName, onOpenMemory, onAddMemory }) {
  const empty = memoryItems.length === 0;
  const featured = memoryItems[0];
  const others = memoryItems.slice(1, 4);

  if (empty) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Camera size={16} strokeWidth={1.8} color="#9B9B9F" />
        <span style={{ fontSize: 12, color: T.muted }}>{petName}'s first memory will appear after a playdate.</span>
      </div>
    );
  }

  return (
    <>
      <FeaturedMemory memory={featured} onOpen={() => onOpenMemory?.(featured)} />
      {others.length > 0 && (
        <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, others.length)}, 1fr)`, gap: 8 }}>
          {others.map((m) => <MemoryThumb key={m.id || m.title} memory={m} onOpen={() => onOpenMemory?.(m)} />)}
        </div>
      )}
    </>
  );
}

function FeaturedMemory({ memory, onOpen }) {
  const cover = memory?.dogB?.photo || memory?.dogA?.photo;
  return (
    <button onClick={onOpen} style={{ position: 'relative', width: '100%', aspectRatio: '16 / 10', borderRadius: 18, overflow: 'hidden', background: '#EDE8E2', textAlign: 'left', display: 'block', cursor: 'pointer', border: 'none' }}>
      {cover && <img src={cover} alt={memory.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(6px)', color: T.coral, fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', padding: '4px 8px', borderRadius: 9999 }}>Featured</span>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '36px 14px 14px', background: 'linear-gradient(to top,rgba(0,0,0,0.62),rgba(0,0,0,0))', color: '#FFF' }}>
        <div style={{ fontSize: 16, fontWeight: 700, lineHeight: 1.15, letterSpacing: '-0.012em' }}>{memory.title || 'Time together'}</div>
        <div style={{ fontSize: 11.5, opacity: 0.9, marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
          {memory.location && <><span>{memory.location}</span><span style={{ opacity: 0.6 }}>·</span></>}
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{memory.dateStr}</span>
        </div>
      </div>
    </button>
  );
}

function MemoryThumb({ memory, onOpen }) {
  const cover = memory?.dogB?.photo || memory?.dogA?.photo;
  return (
    <button onClick={onOpen} style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 14, overflow: 'hidden', background: '#EDE8E2', textAlign: 'left', display: 'block', cursor: 'pointer', border: 'none', width: '100%' }}>
      {cover && <img src={cover} alt={memory.title || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 8px 7px', background: 'linear-gradient(to top,rgba(0,0,0,0.55),rgba(0,0,0,0))', color: '#FFF' }}>
        <div style={{ fontSize: 10.5, fontWeight: 700, lineHeight: 1.15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{memory.title || 'Time together'}</div>
        <div style={{ fontSize: 9.5, opacity: 0.85, marginTop: 1, fontVariantNumeric: 'tabular-nums' }}>{memory.dateStr}</div>
      </div>
    </button>
  );
}

/* ─────────── FIRSTS ─────────── */
function FirstsBlock({ firsts }) {
  if (!firsts?.length) return null;
  return (
    <div style={{ position: 'relative', paddingLeft: 22 }}>
      <div style={{ position: 'absolute', top: 6, bottom: 6, left: 6, width: 1.5, background: T.tint }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {firsts.map((f) => {
          const Icon = f.Icon;
          return (
            <div key={f.id} style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: -22, top: 4, width: 13, height: 13, borderRadius: 9999, background: '#FFF', border: `2px solid ${T.coral}`, boxShadow: '0 1px 3px rgba(232,93,42,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 5, height: 5, borderRadius: 9999, background: T.coral }} />
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={13} strokeWidth={2} color="#7A2F12" style={{ flexShrink: 0, opacity: 0.85 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, color: T.txt, fontWeight: 500 }}>{f.label}</div>
                </div>
                <span style={{ fontSize: 10.5, color: T.muted, fontVariantNumeric: 'tabular-nums' }}>{f.dateStr}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────── DISCOVER ─────────── */
function DiscoverRow({ petName, twinCandidate, onTap }) {
  const candidateName = twinCandidate?.petName || 'someone';
  const candidatePhoto = twinCandidate?.petPhoto;
  return (
    <button onClick={onTap} style={{ width: '100%', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', background: '#FFF', border: '1px solid #EDE8E2', borderRadius: 16 }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <span style={{ position: 'absolute', inset: -2, borderRadius: 9999, border: '2px solid rgba(232,93,42,0.45)', animation: 'pt-pulse-soft 1.8s ease-in-out infinite' }} />
        {candidatePhoto
          ? <img src={candidatePhoto} alt={candidateName} style={{ width: 38, height: 38, borderRadius: 9999, objectFit: 'cover', border: '2px solid #FFF' }} />
          : <div style={{ width: 38, height: 38, borderRadius: 9999, background: T.tint, color: T.coral, fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFF' }}>{candidateName[0]}</div>
        }
        <span style={{ position: 'absolute', right: -3, bottom: -3, width: 16, height: 16, borderRadius: 9999, background: T.coral, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #FFF' }}>
          <Search size={8} strokeWidth={2.6} />
        </span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: T.txt, fontWeight: 600, lineHeight: 1.2 }}>{candidateName} could be {petName}'s twin</div>
        <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>Same quiet streak, same age — open Twin Finder</div>
      </div>
      <ChevronRight size={14} strokeWidth={2} color="#9B9B9F" />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT
   ═══════════════════════════════════════════════════════ */
export default function ProfileMode({
  isVisible,
  pet,
  memories = [],
  onAddMemory,
  onOpenMemory,
  friends = [],
  onOpenNetwork,
}) {
  const [twinFinderOpen, setTwinFinderOpen] = useState(false);
  const [personalityPet, setPersonalityPet] = useState(null);
  const [addMemoryOpen, setAddMemoryOpen] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [activeTab, setActiveTab] = useState('about');

  const petName    = pet?.name      || 'Leo';
  const petBreed   = pet?.breed     || 'Golden Retriever';
  const petAge     = pet?.age       || '2y';
  const petAvatar  = pet?.photo     || pet?.avatar;
  const archetype  = pet?.archetype || 'The Diplomat';
  const walkCount  = pet?.walkCount || 84;
  const sinceLabel = pet?.sinceLabel || 'June 2024';
  const photosCount = pet?.photosCount || 247;
  const lastWalkAgo = pet?.lastWalkAgo || '2h ago';

  const closestBond = useMemo(() => {
    if (!Array.isArray(memories) || memories.length === 0) return null;
    const counts = {};
    memories.forEach((m) => {
      const name = m?.dogB?.name;
      if (!name) return;
      if (!counts[name]) counts[name] = { name, photo: m.dogB.photo, walks: 0, lastDateStr: m.dateStr, lastLocation: m.location };
      else if (!counts[name].lastDateStr) { counts[name].lastDateStr = m.dateStr; counts[name].lastLocation = m.location; }
      counts[name].walks += 1;
    });
    return Object.values(counts).sort((a, b) => b.walks - a.walks)[0] || null;
  }, [memories]);

  const memoryItems = useMemo(() => Array.isArray(memories) ? memories.slice(0, 4) : [], [memories]);
  const firsts      = useMemo(() => SEED_MILESTONES.slice().sort((a, b) => b.dateMs - a.dateMs).slice(0, 3), []);
  const otherFriends = useMemo(() => (friends || []).filter((f) => f.petName !== closestBond?.name).slice(0, 5), [friends, closestBond]);
  const totalFriends = friends.length;
  const activeCount  = Math.min(3, friends.length || 0);

  const handleShareCard = () => {
    const url = `https://fylos.app/pet/${pet?.id || petName.toLowerCase()}`;
    try {
      if (navigator?.share) navigator.share({ title: `${petName} on Fylos`, text: `Meet ${petName}`, url }).catch(() => {});
      else if (navigator?.clipboard) { navigator.clipboard.writeText(url).catch(() => {}); setShareToast(true); setTimeout(() => setShareToast(false), 1600); }
    } catch (_) {}
  };

  const handleSaveMemory = (data) => {
    if (!data?.partnerName) { setAddMemoryOpen(false); return; }
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    onAddMemory?.({ id: `memory_${Date.now()}`, dateMs: Date.now(), dogA: { name: petName, photo: petAvatar }, dogB: { name: data.partnerName, photo: null }, title: (data.title || 'Time together').slice(0, 28), location: data.place || '', dateStr, duration: data.duration || '', tags: data.vibe === 'loved' ? ['🐾 Great vibes'] : ['🐾 Met up'] });
    setAddMemoryOpen(false);
  };

  return (
    <div className={`${isVisible ? 'block' : 'hidden'} bg-[#F7F5F2] pb-28`}>
      <style>{`
        @keyframes pt-pulse-soft { 0%,100% { opacity:.5; transform:scale(1); } 50% { opacity:.95; transform:scale(1.18); } }
        @keyframes pt-glow { 0%,100% { box-shadow: 0 0 0 0 rgba(232,93,42,.35); } 50% { box-shadow: 0 0 0 6px rgba(232,93,42,0); } }
      `}</style>

      <div style={{ padding: '12px 16px 0', display: 'flex', flexDirection: 'column', gap: 0 }}>

        {/* ── Identity hero ── */}
        <IdentityHero
          petName={petName} petBreed={petBreed} petAge={petAge} petAvatar={petAvatar}
          archetype={archetype} sinceLabel={sinceLabel} walkCount={walkCount}
          friendCount={totalFriends} photosCount={photosCount} lastWalkAgo={lastWalkAgo}
          onShare={handleShareCard}
          onTapPersonality={() => setPersonalityPet({ name: petName, petPhoto: petAvatar, breed: petBreed, archetype })}
          shareToast={shareToast}
        />

        {/* ── Stats strip ── */}
        <div style={{ marginBottom: 14 }}>
          <StatsStrip walkCount={walkCount} friendCount={totalFriends} photosCount={photosCount} sinceLabel={sinceLabel} />
        </div>

        {/* ── Tab bar ── */}
        <div style={{ marginBottom: 18 }}>
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* ── Tab content ── */}
        {activeTab === 'about' && (
          <AboutTab
            petName={petName} petAvatar={petAvatar} petBreed={petBreed} petAge={petAge}
            archetype={archetype} firsts={firsts}
            memoryItems={memoryItems} onOpenMemory={onOpenMemory}
            onAddMemory={onAddMemory} setAddMemoryOpen={setAddMemoryOpen}
            onTapPersonality={() => setPersonalityPet({ name: petName, petPhoto: petAvatar, breed: petBreed, archetype })}
          />
        )}
        {activeTab === 'mutual' && (
          <MutualTab
            petName={petName} petAvatar={petAvatar}
            totalFriends={totalFriends} activeCount={activeCount}
            closestBond={closestBond} otherFriends={otherFriends}
            memories={memoryItems}
            onOpenNetwork={onOpenNetwork}
            onTapBond={() => closestBond && setPersonalityPet({ name: closestBond.name, petPhoto: closestBond.photo, breed: '' })}
            onSelectMember={(f) => setPersonalityPet({ name: f.petName, petPhoto: f.petPhoto, breed: f.petBreed || '' })}
          />
        )}
      </div>

      <TwinFinderSheet open={twinFinderOpen} onClose={() => setTwinFinderOpen(false)} pet={{ name: petName, archetype, avatar: petAvatar }} />
      <PersonalityCardSheet open={!!personalityPet} onClose={() => setPersonalityPet(null)} pet={personalityPet} />
      <AddMemorySheet open={addMemoryOpen} onClose={() => setAddMemoryOpen(false)} onSave={handleSaveMemory} petName={petName} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ADD MEMORY SHEET
   ═══════════════════════════════════════════════════════ */
const VIBES = [
  { id: 'loved', label: 'Loved it' },
  { id: 'liked', label: 'Liked it' },
  { id: 'ok',    label: 'OK' },
  { id: 'off',   label: 'Off day' },
];

function AddMemorySheet({ open, onClose, onSave, petName }) {
  const [partnerName, setPartnerName] = useState('');
  const [place, setPlace]             = useState('');
  const [note, setNote]               = useState('');
  const [vibe, setVibe]               = useState('loved');

  useEffect(() => {
    if (open) {
      setPartnerName(''); setPlace(''); setNote(''); setVibe('loved');
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const mount = typeof document !== 'undefined' ? document.getElementById('fylos-phone-root') || document.body : null;
  if (!open || !mount) return null;

  const canSave = partnerName.trim().length > 0;

  const markup = (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(2px)', zIndex: 10001, display: 'flex', alignItems: 'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxHeight: '88%', background: '#FFFFFF', borderRadius: '24px 24px 0 0', boxShadow: '0 -10px 40px rgba(0,0,0,0.18)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0 6px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 9999, background: '#D1D1D6' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 14px' }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Add memory</div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 9999, background: '#F7F5F2', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}>
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>
        <div style={{ padding: '0 20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#76767D', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Who was {petName} with?</label>
            <input type="text" value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="e.g. Buddy" className="w-full h-11 rounded-[12px] px-3 mt-1.5 outline-none" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2', fontSize: 14, color: '#111' }} />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#76767D', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Where?</label>
            <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. Zürichhorn" className="w-full h-11 rounded-[12px] px-3 mt-1.5 outline-none" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2', fontSize: 14, color: '#111' }} />
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#76767D', letterSpacing: '0.18em', textTransform: 'uppercase' }}>How was it?</label>
            <div className="grid grid-cols-4 gap-1.5 mt-1.5">
              {VIBES.map((v) => (
                <button key={v.id} onClick={() => setVibe(v.id)} className="h-10 rounded-[10px] active:scale-[0.97] transition-transform" style={{ background: vibe === v.id ? '#FBE7DD' : '#F7F5F2', border: vibe === v.id ? '1px solid rgba(232,93,42,0.30)' : '1px solid #EDE8E2', color: vibe === v.id ? '#7A2F12' : '#76767D', fontSize: 11.5, fontWeight: 600 }}>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#76767D', letterSpacing: '0.18em', textTransform: 'uppercase' }}>One line about it (optional)</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Two relaxed players. Lots of polite resets." className="w-full rounded-[12px] px-3 py-2 mt-1.5 outline-none resize-none" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2', fontSize: 13, color: '#111', minHeight: 64 }} rows={2} />
          </div>
          <button onClick={() => canSave && onSave({ partnerName: partnerName.trim(), place: place.trim(), title: note.trim() || 'Time together', vibe })} disabled={!canSave} className="w-full h-12 rounded-[14px] flex items-center justify-center gap-1.5 active:scale-[0.99] transition-transform" style={{ background: canSave ? '#E85D2A' : '#EDE8E2', color: canSave ? '#FFF' : '#A09A94', fontSize: 14, fontWeight: 600, boxShadow: canSave ? '0 6px 18px rgba(232,93,42,0.28)' : 'none' }}>
            <Sparkles size={14} strokeWidth={2.2} />
            Save memory
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(markup, mount);
}
