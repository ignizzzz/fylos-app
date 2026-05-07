import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronRight, ChevronLeft, Camera, Plus, Share2, Sparkles, Footprints,
  Trees, Waves, Heart, Clock, Search, X, MapPin, ShieldCheck, Syringe, Star,
  Check, Calendar, Zap, Users, TreePine, GraduationCap, Coffee, Edit3, Award,
  CalendarDays, Minus, Settings, Pencil, Pin, Bookmark, BookmarkCheck, Link2,
  Download, Lock, Eye, ImagePlus, Coffee as CoffeeIcon, Tag,
} from 'lucide-react';
import PersonalityCardSheet from '../../../components/PersonalityCardSheet';
import TwinFinderSheet from '../../../components/TwinFinderSheet';
import { ARCHETYPES, ARCHETYPE_BY_ID, ARCHETYPE_QUIZ, tallyArchetype } from '../../../data/social';

/* =========================================================================
   ProfileMode — Activity tab · Profile sub-mode (rebuild)
   Zone S+R hybrid: identity warmth (S) + trust density (R).

   Layout (top → bottom):
     1. Top bar (settings, share)
     2. Carousel hero (3-5 photos, swipeable, dot pagination)
     3. Identity block (name, breed, age, archetype tag, since, location)
     4. Stats strip (walks · friends · photos · rating)
     5. Bio + Looking-for chips
     6. Tabs: Photos · Check-ins · Memories · About
        - Photos: 3-col chronological grid → lightbox
        - Check-ins: timeline of place visits
        - Memories: existing memory cards + AddMemory CTA
        - About: archetype card, milestones (default + custom), traits, badges,
                 health snapshot
     7. Sheets: Edit / AddMilestone / AddPhoto / ArchetypePicker / Share /
                Settings / Lightbox
   ========================================================================= */

// ---------------------------------------------------------------------------
// Static defaults (overridable per pet via the edit sheet)
// ---------------------------------------------------------------------------
const DEFAULT_LOOKING_FOR = ['walks', 'park'];

const ACTIVITY_OPTIONS = [
  { id: 'walks', label: 'Walks', icon: Footprints },
  { id: 'park', label: 'Park play', icon: TreePine },
  { id: 'training', label: 'Training', icon: GraduationCap },
  { id: 'calm', label: 'Calm hangs', icon: CoffeeIcon },
  { id: 'water', label: 'Water', icon: Waves },
  { id: 'travel', label: 'Travel', icon: MapPin },
];
const ACTIVITY_BY_ID = ACTIVITY_OPTIONS.reduce((acc, a) => { acc[a.id] = a; return acc; }, {});

const DEFAULT_MILESTONES = [
  { id: 'first-walk',     label: 'First walk',         dateStr: 'Jun 12, 2024', dateMs: Date.parse('2024-06-12'), icon: 'walk' },
  { id: 'first-park',     label: 'First park visit',   dateStr: 'Jun 28, 2024', dateMs: Date.parse('2024-06-28'), icon: 'park' },
  { id: 'first-fylos',    label: 'First Fylos friend', dateStr: 'Jul 8, 2024',  dateMs: Date.parse('2024-07-08'), icon: 'heart' },
  { id: 'first-swim',     label: 'First swim',         dateStr: 'Sep 4, 2024',  dateMs: Date.parse('2024-09-04'), icon: 'water' },
  { id: 'birthday',       label: 'Birthday',           dateStr: 'Apr 12, 2025', dateMs: Date.parse('2025-04-12'), icon: 'cake' },
  { id: 'first-snow',     label: 'First snow',         dateStr: 'Dec 11, 2024', dateMs: Date.parse('2024-12-11'), icon: 'snow' },
  { id: 'first-overnight',label: 'First sleepover away', dateStr: 'Jan 4, 2025', dateMs: Date.parse('2025-01-04'), icon: 'moon' },
];
const MILESTONE_ICON_MAP = {
  walk: Footprints, park: TreePine, heart: Heart, water: Waves, cake: Sparkles,
  snow: Sparkles, moon: Clock, training: GraduationCap, default: Award,
};

const SAMPLE_PHOTOS = [
  { id: 'ph1', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=70', dateStr: 'Today', dateMs: Date.now(), location: 'Zürichhorn' },
  { id: 'ph2', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=900&q=70', dateStr: '2 days ago', dateMs: Date.now() - 2*86400000, location: 'Seefeld Park' },
  { id: 'ph3', url: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&w=900&q=70', dateStr: 'Last week', dateMs: Date.now() - 7*86400000, location: 'Limmat riverside' },
  { id: 'ph4', url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=900&q=70', dateStr: '2 weeks ago', dateMs: Date.now() - 14*86400000, location: 'Belvoirpark' },
  { id: 'ph5', url: 'https://images.unsplash.com/photo-1601758064955-2a3d3c10d5b4?auto=format&fit=crop&w=900&q=70', dateStr: '3 weeks ago', dateMs: Date.now() - 21*86400000, location: 'Frau Gerolds Garten' },
  { id: 'ph6', url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=900&q=70', dateStr: 'Last month', dateMs: Date.now() - 30*86400000, location: 'Rieterpark' },
  { id: 'ph7', url: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=900&q=70', dateStr: 'Last month', dateMs: Date.now() - 35*86400000, location: 'Bärenhof Café' },
  { id: 'ph8', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=70', dateStr: '2 months ago', dateMs: Date.now() - 60*86400000, location: 'Tiefenbrunnen beach' },
  { id: 'ph9', url: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=900&q=70', dateStr: '2 months ago', dateMs: Date.now() - 64*86400000, location: 'Uetliberg trails' },
];

const SAMPLE_CHECKINS = [
  { id: 'c1', placeName: 'Zürichhorn', dateStr: 'Today, 8:12 AM', activity: 'Morning walk · 47 min', companions: ['Buddy'], note: 'Big tail vibes.', photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=60' },
  { id: 'c2', placeName: 'Seefeld Park', dateStr: 'Yesterday, 5:30 PM', activity: 'Park play · 32 min', companions: ['Coco'], note: '' },
  { id: 'c3', placeName: 'Limmat riverside', dateStr: '2 days ago', activity: 'Walk · 1h 02 min', companions: [], note: 'New route, lots of sniffs.' },
  { id: 'c4', placeName: 'Bärenhof Café', dateStr: '4 days ago', activity: 'Calm hang · 1h', companions: ['Tom K.'], note: 'Best treats in town.' },
  { id: 'c5', placeName: 'Belvoirpark', dateStr: 'Last week', activity: 'Park play · 25 min', companions: [], note: '' },
];

const DEFAULT_BIO = "Big-feelings golden, loves morning runs and the people who run with him.";

// ---------------------------------------------------------------------------
// Small primitives
// ---------------------------------------------------------------------------
const T = {
  bg: '#F7F5F2',
  surface: '#FFFFFF',
  surfaceAlt: '#F2F2F7',
  border: 'rgba(0,0,0,0.05)',
  divider: '#F1EDE8',
  warmTint: '#FFE9DD',
  warmTintEdge: '#FFD4CC',
  warmText: '#7A2F12',
  coral: '#E85D2A',
  coralLight: '#FF7240',
  txt: '#111111',
  muted: '#9B9B9F',
  mutedDark: '#6E6E73',
  label: '#76767D',
};

const SectionLabel = ({ children }) => (
  <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">{children}</p>
);

const Card = ({ children, className = '', style = {} }) => (
  <div
    className={`bg-white border border-black/[0.04] rounded-[16px] ${className}`}
    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)', ...style }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
export default function ProfileMode({
  isVisible,
  pet,
  memories = [],
  onAddMemory,
  onOpenMemory,
  friends = [],
  onOpenNetwork,
}) {
  // Profile state — kept here so all sheets share the same source of truth.
  const [profile, setProfile] = useState(() => ({
    name: pet?.name || 'Leo',
    breed: pet?.breed || 'Golden Retriever',
    age: pet?.age || 3,
    photo: pet?.photo || pet?.avatar,
    location: pet?.location || 'Zürich',
    sinceLabel: pet?.sinceLabel || 'June 2024',
    bio: DEFAULT_BIO,
    archetypeId: 'diplomat',
    lookingFor: DEFAULT_LOOKING_FOR,
    badges: ['Vaccinated', 'Neutered', 'Friendly'],
    publicLink: `fylos.app/${(pet?.name || 'leo').toLowerCase()}`,
    discoverable: true,
    healthVisibility: 'private',
  }));
  const [photos, setPhotos] = useState(SAMPLE_PHOTOS);
  const [pinnedIds, setPinnedIds] = useState(() => new Set(['ph1', 'ph3', 'ph5']));
  const [checkins] = useState(SAMPLE_CHECKINS);
  const [milestones, setMilestones] = useState(() =>
    DEFAULT_MILESTONES.slice().sort((a, b) => b.dateMs - a.dateMs)
  );

  const [tab, setTab] = useState('photos');
  const [editOpen, setEditOpen] = useState(false);
  const [milestoneSheetOpen, setMilestoneSheetOpen] = useState(false);
  const [archetypeOpen, setArchetypeOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [addPhotoOpen, setAddPhotoOpen] = useState(false);
  const [addMemoryOpen, setAddMemoryOpen] = useState(false);
  const [personalityPet, setPersonalityPet] = useState(null);
  const [twinFinderOpen, setTwinFinderOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1600); };

  // Close all sheets when ProfileMode is hidden (navigating away)
  useEffect(() => {
    if (!isVisible) {
      setAddPhotoOpen(false);
      setEditOpen(false);
      setMilestoneSheetOpen(false);
      setArchetypeOpen(false);
      setQuizOpen(false);
      setShareOpen(false);
      setSettingsOpen(false);
      setLightbox(null);
      setAddMemoryOpen(false);
      setPersonalityPet(null);
      setTwinFinderOpen(false);
    }
  }, [isVisible]);

  // Derived
  const archetype = ARCHETYPE_BY_ID[profile.archetypeId] || ARCHETYPES[0];
  const heroPhotos = useMemo(() => {
    const pinned = photos.filter((p) => pinnedIds.has(p.id));
    return pinned.length >= 3 ? pinned.slice(0, 5) : photos.slice(0, 5);
  }, [photos, pinnedIds]);
  const stats = useMemo(() => ({
    walks: 84,
    friends: friends.length || 8,
    photos: photos.length,
    playdates: 17,
  }), [friends.length, photos.length]);

  const handleSaveProfile = (updates) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    setEditOpen(false);
    showToast('Profile updated');
  };
  const handleAddMilestone = (m) => {
    setMilestones((prev) => [m, ...prev].sort((a, b) => b.dateMs - a.dateMs));
    setMilestoneSheetOpen(false);
    showToast('Milestone added');
  };
  const handleAddPhoto = (url, location) => {
    if (!url) return;
    setPhotos((prev) => [{ id: `ph_${Date.now()}`, url, dateStr: 'Just now', dateMs: Date.now(), location: location || '' }, ...prev]);
    setAddPhotoOpen(false);
    showToast('Photo added');
  };
  const handleSaveMemory = (data) => {
    if (!data?.partnerName) { setAddMemoryOpen(false); return; }
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    onAddMemory?.({
      id: `memory_${Date.now()}`,
      dateMs: Date.now(),
      dogA: { name: profile.name, photo: profile.photo },
      dogB: { name: data.partnerName, photo: null },
      title: (data.title || 'Time together').slice(0, 28),
      location: data.place || '',
      dateStr,
      duration: data.duration || '',
      tags: data.vibe === 'loved' ? ['🐾 Great vibes'] : ['🐾 Met up'],
    });
    setAddMemoryOpen(false);
    showToast('Memory saved');
  };
  const togglePin = (id) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleShare = () => setShareOpen(true);

  return (
    <div className={`${isVisible ? 'block' : 'hidden'} bg-[${T.bg}] pb-32`} style={{ background: T.bg }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <CarouselHero
          photos={heroPhotos}
          onAddPhoto={() => setAddPhotoOpen(true)}
        />

        <div className="px-5 flex flex-col gap-4">
          <IdentityBlock
            profile={profile}
            archetype={archetype}
            onTapArchetype={() => setArchetypeOpen(true)}
            onTapEdit={() => setEditOpen(true)}
            onTapShare={handleShare}
            onTapSettings={() => setSettingsOpen(true)}
          />

          <StatsStrip stats={stats} onTapFriends={onOpenNetwork} />

          <BioBlock
            bio={profile.bio}
            lookingFor={profile.lookingFor}
            badges={profile.badges}
            onEdit={() => setEditOpen(true)}
          />

          <ProfileTabs tab={tab} onChange={setTab} counts={{ photos: photos.length, checkins: checkins.length, memories: memories.length }} />

          {tab === 'photos' && (
            <PhotosTab
              photos={photos}
              pinnedIds={pinnedIds}
              onTapPhoto={setLightbox}
              onAdd={() => setAddPhotoOpen(true)}
            />
          )}
          {tab === 'checkins' && (
            <CheckinsTab checkins={checkins} onAddCheckin={() => showToast('Check-in flow coming soon')} />
          )}
          {tab === 'memories' && (
            <MemoriesTab memories={memories} onOpen={onOpenMemory} onAdd={() => setAddMemoryOpen(true)} />
          )}
          {tab === 'about' && (
            <AboutTab
              archetype={archetype}
              traits={archetype.traits}
              onTapArchetype={() => setArchetypeOpen(true)}
              onTwinFinder={() => setTwinFinderOpen(true)}
            />
          )}
        </div>

        {/* Dedicated milestones section — sits at the bottom regardless of active tab */}
        <MilestonesJourney
          petName={profile.name}
          milestones={milestones}
          onAdd={() => setMilestoneSheetOpen(true)}
        />
      </div>

      {editOpen && <EditProfileSheet profile={profile} onClose={() => setEditOpen(false)} onSave={handleSaveProfile} />}
      {milestoneSheetOpen && <AddMilestoneSheet onClose={() => setMilestoneSheetOpen(false)} onSave={handleAddMilestone} />}
      {archetypeOpen && (
        <ArchetypePickerSheet
          currentId={profile.archetypeId}
          onClose={() => setArchetypeOpen(false)}
          onPick={(id) => { setProfile((p) => ({ ...p, archetypeId: id })); setArchetypeOpen(false); showToast('Archetype updated'); }}
          onTakeQuiz={() => { setArchetypeOpen(false); setTimeout(() => setQuizOpen(true), 160); }}
        />
      )}
      {quizOpen && (
        <ArchetypeQuizSheet
          petName={profile.name}
          onClose={() => setQuizOpen(false)}
          onApply={(id) => { setProfile((p) => ({ ...p, archetypeId: id })); setQuizOpen(false); showToast(`${profile.name} is ${ARCHETYPE_BY_ID[id]?.label || 'set'}`); }}
        />
      )}
      {shareOpen && <ShareSheet profile={profile} archetype={archetype} stats={stats} latestMilestone={milestones[0]} onClose={() => setShareOpen(false)} onCopy={() => showToast('Link copied')} />}
      {settingsOpen && <SettingsSheet profile={profile} onChange={(updates) => setProfile((p) => ({ ...p, ...updates }))} onClose={() => setSettingsOpen(false)} />}
      {addPhotoOpen && <AddPhotoSheet onClose={() => setAddPhotoOpen(false)} onAdd={handleAddPhoto} />}
      {addMemoryOpen && <AddMemorySheet petName={profile.name} onClose={() => setAddMemoryOpen(false)} onSave={handleSaveMemory} />}
      {lightbox && (
        <PhotoLightbox
          photo={lightbox}
          pinned={pinnedIds.has(lightbox.id)}
          onClose={() => setLightbox(null)}
          onTogglePin={() => togglePin(lightbox.id)}
        />
      )}
      <PersonalityCardSheet open={!!personalityPet} onClose={() => setPersonalityPet(null)} pet={personalityPet} />
      <TwinFinderSheet open={twinFinderOpen} onClose={() => setTwinFinderOpen(false)} pet={{ name: profile.name, archetype: archetype.label, avatar: profile.photo }} />
      {toast && <Toast message={toast} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Carousel hero — swipe + arrow buttons + pagination dots
// ---------------------------------------------------------------------------
function CarouselHero({ photos, onSettings, onShare, onAddPhoto }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  };
  const stepTo = (delta) => {
    const el = trackRef.current;
    if (!el) return;
    const next = Math.max(0, Math.min(photos.length - 1, active + delta));
    el.scrollTo({ left: next * el.clientWidth, behavior: 'smooth' });
  };
  return (
    <div className="relative" style={{ background: T.bg }}>
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex overflow-x-auto snap-x snap-mandatory custom-scrollbar"
        style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {photos.map((p, i) => (
          <div
            key={p.id || i}
            className="shrink-0 snap-center"
            style={{ width: '100%', aspectRatio: '4 / 3', position: 'relative' }}
          >
            <img src={p.url || p} alt="" className="w-full h-full object-cover" draggable={false} />
            <div
              className="absolute left-0 right-0 bottom-0 pointer-events-none"
              style={{ height: 96, background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%)' }}
            />
          </div>
        ))}
      </div>

      {/* Add photo — top-left corner, separate from nav arrows */}
      <button
        onClick={onAddPhoto}
        aria-label="Add photo"
        className="absolute left-3 top-3 w-9 h-9 rounded-full flex items-center justify-center active:scale-[0.94] transition-transform z-10"
        style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', backdropFilter: 'blur(8px)' }}
      >
        <ImagePlus size={15} strokeWidth={2.2} className="text-[#111111]" />
      </button>

      {/* Arrow buttons — only rendered when the step is available */}
      {photos.length > 1 && active > 0 && (
        <button
          onClick={() => stepTo(-1)}
          aria-label="Previous photo"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center active:scale-[0.94] transition-all z-10"
          style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', backdropFilter: 'blur(8px)' }}
        >
          <ChevronLeft size={16} strokeWidth={2.4} className="text-[#111111]" />
        </button>
      )}
      {photos.length > 1 && active < photos.length - 1 && (
        <button
          onClick={() => stepTo(1)}
          aria-label="Next photo"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center active:scale-[0.94] transition-all z-10"
          style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 4px 12px rgba(0,0,0,0.12)', backdropFilter: 'blur(8px)' }}
        >
          <ChevronRight size={16} strokeWidth={2.4} className="text-[#111111]" />
        </button>
      )}

      {/* Pagination dots */}
      {photos.length > 1 && (
        <div className="absolute left-1/2 bottom-3 -translate-x-1/2 flex items-center gap-1.5 z-10">
          {photos.map((_, i) => (
            <span
              key={i}
              className="rounded-full transition-all"
              style={{
                width: i === active ? 18 : 6,
                height: 6,
                background: i === active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.32)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Identity block — name, breed, age, archetype tag, since
// ---------------------------------------------------------------------------
function IdentityBlock({ profile, archetype, onTapArchetype, onTapEdit, onTapShare, onTapSettings }) {
  return (
    <section className="flex flex-col gap-3">
      {/* Top row — name + actions row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex items-baseline gap-2.5 flex-wrap">
          <h1 className="text-[28px] font-semibold text-[#111111] leading-none tracking-tight">{profile.name}</h1>
          <span className="text-[14px] text-[#8E8E93] leading-none">{profile.age} yrs</span>
        </div>
        <div className="shrink-0 flex items-center gap-1.5">
          <IdentityIconButton icon={Share2} onClick={onTapShare} label="Share" />
          <IdentityIconButton icon={Settings} onClick={onTapSettings} label="Settings" />
          <IdentityIconButton icon={Pencil} onClick={onTapEdit} label="Edit profile" primary />
        </div>
      </div>
      {/* Meta line — breed dominant, then small chips */}
      <p className="text-[14px] text-[#1F1F22] -mt-1">{profile.breed}</p>
      <div className="flex flex-wrap gap-1.5 -mt-1">
        <MetaChip icon={MapPin} label={profile.location} />
        <MetaChip icon={CalendarDays} label={`since ${profile.sinceLabel}`} />
        <button
          onClick={onTapArchetype}
          className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full active:scale-[0.97] transition-transform"
          style={{ background: archetype.color, border: '1px solid rgba(0,0,0,0.04)' }}
        >
          <span className="text-[12px]">{archetype.glyph}</span>
          <span className="text-[11.5px] font-semibold" style={{ color: T.warmText }}>{archetype.label}</span>
          <ChevronRight size={10} color={T.warmText} strokeWidth={2.4} />
        </button>
      </div>
    </section>
  );
}

function IdentityIconButton({ icon: Icon, onClick, label, primary = false }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-[0.94] ${
        primary ? 'bg-[#111111] text-white' : 'bg-white border border-black/[0.06] text-[#111111]'
      }`}
      style={{ boxShadow: primary ? '0 4px 12px rgba(0,0,0,0.16)' : '0 1px 4px rgba(0,0,0,0.04)' }}
    >
      <Icon size={14} strokeWidth={2.2} />
    </button>
  );
}

function MetaChip({ icon: Icon, label }) {
  return (
    <span
      className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11.5px] font-medium text-[#5D5D64]"
      style={{ background: '#F2F2F7' }}
    >
      <Icon size={11} strokeWidth={2.1} className="text-[#8E8E93]" />
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Stats strip
// ---------------------------------------------------------------------------
function StatsStrip({ stats, onTapFriends }) {
  const items = [
    { label: 'walks', value: stats.walks, onClick: null },
    { label: 'friends', value: stats.friends, onClick: onTapFriends },
    { label: 'playdates', value: stats.playdates, onClick: null },
    { label: 'photos', value: stats.photos, onClick: null },
  ];
  return (
    <section
      className="grid grid-cols-4 bg-white border border-black/[0.04] rounded-[16px]"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
    >
      {items.map((it, i) => (
        <button
          key={it.label}
          onClick={it.onClick || undefined}
          disabled={!it.onClick}
          className={`flex flex-col items-center justify-center py-3 gap-0.5 ${i < items.length - 1 ? 'border-r border-black/[0.04]' : ''} ${it.onClick ? 'active:bg-[#F7F5F2]' : ''}`}
        >
          <span className="text-[20px] font-semibold text-[#111111] tabular-nums">{it.value}</span>
          <span className="text-[11px] text-[#8E8E93] uppercase tracking-wide">{it.label}</span>
        </button>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Bio + looking-for + trust badges
// ---------------------------------------------------------------------------
function BioBlock({ bio, lookingFor, badges, onEdit }) {
  return (
    <section className="flex flex-col gap-3">
      {bio && (
        <Card className="px-4 py-3">
          <p className="text-[14px] text-[#111111] leading-snug">{bio}</p>
          <button
            onClick={onEdit}
            className="text-[11.5px] font-semibold text-[#E85D2A] mt-1.5 active:opacity-70"
          >
            Edit bio
          </button>
        </Card>
      )}
      {lookingFor && lookingFor.length > 0 && (
        <div className="flex flex-col gap-2">
          <SectionLabel>Looking for</SectionLabel>
          <div className="flex flex-wrap gap-1.5">
            {lookingFor.map((id) => {
              const meta = ACTIVITY_BY_ID[id];
              if (!meta) return null;
              const Icon = meta.icon;
              return (
                <span
                  key={id}
                  className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-semibold"
                  style={{ background: T.warmTint, border: `1px solid ${T.warmTintEdge}`, color: T.warmText }}
                >
                  <Icon size={12} strokeWidth={2.2} />
                  {meta.label}
                </span>
              );
            })}
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-[12px] font-semibold border border-dashed text-[#8E8E93] active:scale-[0.97]"
              style={{ borderColor: '#D1D1D6' }}
            >
              <Plus size={12} strokeWidth={2.2} />
              Add
            </button>
          </div>
        </div>
      )}
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11.5px] font-medium"
              style={{ background: '#EEF7F1', border: '1px solid #D7EBDD', color: '#3F8D63' }}
            >
              <ShieldCheck size={11} strokeWidth={2.2} />
              {b}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Tabs (Photos · Check-ins · Memories · About)
// ---------------------------------------------------------------------------
const TABS = [
  { id: 'photos', label: 'Photos' },
  { id: 'checkins', label: 'Check-ins' },
  { id: 'memories', label: 'Memories' },
  { id: 'about', label: 'About' },
];
function ProfileTabs({ tab, onChange, counts = {} }) {
  const idx = TABS.findIndex((t) => t.id === tab);
  return (
    <div className="relative bg-[#F2F2F7] rounded-full p-1 flex">
      <div
        aria-hidden
        className="absolute top-1 bottom-1 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-[260ms]"
        style={{
          width: `calc(${100 / TABS.length}% - 8px)`,
          left: `calc(${(100 / TABS.length) * idx}% + 4px)`,
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      />
      {TABS.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`relative z-10 flex-1 h-9 text-[12.5px] font-semibold transition-colors ${
            tab === t.id ? 'text-[#111111]' : 'text-[#8E8E93]'
          }`}
        >
          {t.label}
          {typeof counts[t.id] === 'number' && counts[t.id] > 0 && tab !== t.id && (
            <span className="ml-1 text-[10.5px] text-[#A6A6AC] tabular-nums">{counts[t.id]}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Photos tab — chronological 3-col grid
// ---------------------------------------------------------------------------
function PhotosTab({ photos, pinnedIds, onTapPhoto, onAdd }) {
  if (!photos.length) {
    return <EmptyState icon={Camera} title="No photos yet" body="Snap your first one." cta="Add photo" onCta={onAdd} />;
  }
  // Group by month for visual rhythm
  const groups = useMemo(() => {
    const map = new Map();
    photos.forEach((p) => {
      const key = new Date(p.dateMs).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(p);
    });
    return Array.from(map.entries());
  }, [photos]);
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SectionLabel>Highlights · {photos.length}</SectionLabel>
        <button
          onClick={onAdd}
          aria-label="Add photo"
          className="w-7 h-7 rounded-full flex items-center justify-center text-white active:scale-[0.94] transition-transform"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          <Plus size={13} strokeWidth={2.6} />
        </button>
      </div>
      {groups.map(([label, items]) => (
        <div key={label} className="flex flex-col gap-1.5">
          <p className="text-[10.5px] font-semibold text-[#8E8E93] uppercase tracking-wider">{label}</p>
          <div className="grid grid-cols-3 gap-1">
            {items.map((p) => (
              <button
                key={p.id}
                onClick={() => onTapPhoto(p)}
                className="relative aspect-square rounded-[8px] overflow-hidden bg-[#F3F3F5] active:opacity-90 active:scale-[0.99] transition-transform"
              >
                <img src={p.url} alt="" className="w-full h-full object-cover" />
                {pinnedIds.has(p.id) && (
                  <span
                    className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(232,93,42,0.92)', color: '#FFF' }}
                    aria-label="Pinned"
                  >
                    <Pin size={10} strokeWidth={2.4} fill="currentColor" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Check-ins tab — timeline
// ---------------------------------------------------------------------------
function CheckinsTab({ checkins, onAddCheckin }) {
  if (!checkins.length) {
    return <EmptyState icon={MapPin} title="No check-ins yet" body="Tag a place when you visit." cta="Check in" onCta={onAddCheckin} />;
  }
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SectionLabel>Recent visits</SectionLabel>
        <button
          onClick={onAddCheckin}
          className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-[12px] font-semibold text-white active:scale-[0.97]"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          <Plus size={12} strokeWidth={2.4} />
          Check in
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {checkins.map((c) => (
          <Card key={c.id} className="px-3.5 py-3">
            <div className="flex items-start gap-3">
              {c.photoUrl ? (
                <img src={c.photoUrl} alt="" className="w-12 h-12 rounded-[12px] object-cover bg-[#F3F3F5] shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-[12px] bg-[#FFE9DD] flex items-center justify-center shrink-0 text-[#E85D2A]">
                  <MapPin size={16} strokeWidth={2.2} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-[#111111] truncate">{c.placeName}</p>
                <p className="text-[12px] text-[#6E6E73] truncate">{c.dateStr} · {c.activity}</p>
                {c.companions.length > 0 && (
                  <p className="text-[11.5px] text-[#8E8E93] mt-0.5 truncate">with {c.companions.join(', ')}</p>
                )}
                {c.note && <p className="text-[12.5px] text-[#5D5D64] mt-1 leading-snug">{c.note}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Memories tab
// ---------------------------------------------------------------------------
function MemoriesTab({ memories, onOpen, onAdd }) {
  if (!memories.length) {
    return <EmptyState icon={Heart} title="No memories yet" body="Wrap up a playdate to start your story." cta="Add memory" onCta={onAdd} />;
  }
  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <SectionLabel>Memories</SectionLabel>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-[12px] font-semibold text-white active:scale-[0.97]"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          <Plus size={12} strokeWidth={2.4} />
          Add
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {memories.slice(0, 12).map((m) => (
          <button
            key={m.id}
            onClick={() => onOpen && onOpen(m)}
            className="bg-white border border-black/[0.04] rounded-[16px] p-3.5 text-left active:opacity-90 active:scale-[0.99]"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
          >
            <div className="flex items-center gap-3">
              {m.dogB?.photo ? (
                <img src={m.dogB.photo} alt="" className="w-11 h-11 rounded-full object-cover bg-[#F3F3F5] shrink-0" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#FFE9DD] flex items-center justify-center shrink-0 text-[#E85D2A]">
                  <Heart size={15} strokeWidth={2.2} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-[#111111] truncate">{m.title} · {m.dogB?.name || 'friend'}</p>
                <p className="text-[12px] text-[#6E6E73] truncate">{m.dateStr} · {m.location}</p>
                {m.tags && m.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {m.tags.slice(0, 3).map((t, i) => (
                      <span key={i} className="inline-flex items-center h-6 px-2 rounded-full text-[10.5px] font-medium" style={{ background: T.warmTint, color: T.warmText }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// About tab — archetype + traits + Find-a-twin (milestones moved to a
// dedicated journey section below the tabs)
// ---------------------------------------------------------------------------
function AboutTab({ archetype, traits, onTapArchetype, onTwinFinder }) {
  return (
    <section className="flex flex-col gap-3">
      <Card className="p-4">
        <button onClick={onTapArchetype} className="w-full text-left active:opacity-90">
          <div className="flex items-start gap-3">
            <div
              className="shrink-0 w-12 h-12 rounded-[12px] flex items-center justify-center text-[22px]"
              style={{ background: archetype.color, border: `1px solid ${T.border}` }}
            >
              {archetype.glyph}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[14.5px] font-semibold text-[#111111]">{archetype.label}</p>
                <ChevronRight size={14} color="#B6B6BC" />
              </div>
              <p className="text-[12.5px] text-[#6E6E73] leading-snug mt-0.5">{archetype.tagline}</p>
            </div>
          </div>
        </button>
        {traits && traits.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-black/[0.04]">
            {traits.map((t) => (
              <span key={t} className="inline-flex items-center h-7 px-2.5 rounded-full text-[11.5px] font-medium" style={{ background: T.warmTint, color: T.warmText }}>
                {t}
              </span>
            ))}
            <button
              onClick={onTwinFinder}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11.5px] font-semibold text-[#E85D2A] active:opacity-70 ml-auto"
            >
              <Sparkles size={11} strokeWidth={2.2} />
              Find a twin
            </button>
          </div>
        )}
      </Card>
    </section>
  );
}

// ---------------------------------------------------------------------------
// MilestonesJourney — playful timeline that lives at the bottom of the profile.
// Single-column vertical with a continuous spine running THROUGH the icon
// nodes (not behind them — fixes the visual cut-off). Each milestone is a
// row: [glyph node] [stamp card] with the spine drawn as two segments per
// row (above the node + below the node) so the line stays unbroken end to end.
// Most recent at top, oldest at bottom, "Day one" terminator.
// ---------------------------------------------------------------------------
function MilestonesJourney({ petName, milestones, onAdd }) {
  const sorted = useMemo(() => [...milestones].sort((a, b) => b.dateMs - a.dateMs), [milestones]);
  return (
    <section className="px-5 mt-4 flex flex-col gap-2.5">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-[#8E7A6B]">Journey</p>
          <h2 className="text-[15px] font-semibold text-[#111111] leading-tight mt-0.5 tracking-tight">
            {petName}'s story · <span className="text-[#E85D2A]">{sorted.length}</span> moments
          </h2>
        </div>
        <button
          onClick={onAdd}
          aria-label="Add milestone"
          className="h-8 px-3 rounded-full bg-[#111111] text-white text-[11px] font-semibold flex items-center gap-1 active:scale-[0.97]"
        >
          <Plus size={11} strokeWidth={2.6} />
          Add
        </button>
      </div>
      <div
        className="rounded-[20px]"
        style={{
          background: 'linear-gradient(180deg, #FFF7F1 0%, #F7F5F2 100%)',
          border: '1px solid #EDE8E2',
          padding: '14px 16px 18px',
        }}
      >
        <div className="flex flex-col">
          {sorted.map((m, i) => {
            const Icon = MILESTONE_ICON_MAP[m.icon] || MILESTONE_ICON_MAP.default;
            const isFirst = i === 0;
            const isLast = i === sorted.length - 1;
            return (
              <div key={m.id} className="relative flex items-stretch gap-3" style={{ minHeight: 52 }}>
                {/* Left rail: spine + node */}
                <div className="relative shrink-0 flex flex-col items-center" style={{ width: 36 }}>
                  {/* Top half spine */}
                  <span
                    aria-hidden
                    className="w-px"
                    style={{
                      flex: '0 0 18px',
                      background: isFirst
                        ? 'transparent'
                        : 'repeating-linear-gradient(180deg, rgba(232,93,42,0.45) 0 4px, transparent 4px 8px)',
                    }}
                  />
                  {/* Node */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center"
                    style={{
                      background: '#FFFFFF',
                      border: '2px solid #FFD4CC',
                      boxShadow: '0 3px 8px rgba(232,93,42,0.16)',
                      color: T.coral,
                    }}
                  >
                    <Icon size={13} strokeWidth={2.2} />
                  </div>
                  {/* Bottom half spine */}
                  <span
                    aria-hidden
                    className="w-px"
                    style={{
                      flex: '1 0 0',
                      background: isLast
                        ? 'transparent'
                        : 'repeating-linear-gradient(180deg, rgba(232,93,42,0.45) 0 4px, transparent 4px 8px)',
                    }}
                  />
                </div>
                {/* Right side: stamp + date — full width, no truncation */}
                <div className="flex-1 min-w-0 py-2.5 flex flex-col gap-0.5">
                  <p className="text-[12.5px] font-semibold text-[#111111] leading-snug tracking-tight">
                    {m.label}
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-[#A09A94] tabular-nums">
                    {m.dateStr}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        {/* Day one terminator */}
        <div className="flex items-center gap-2 mt-1 pl-[18px]">
          <span
            aria-hidden
            className="w-2 h-2 rounded-full"
            style={{ background: '#FFD4CC', border: '1px solid #E85D2A' }}
          />
          <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#8E7A6B]">
            Day one
          </span>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------
function EmptyState({ icon: Icon, title, body, cta, onCta }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-10 px-6">
      <div className="w-14 h-14 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <p className="text-[15px] font-semibold text-[#111111]">{title}</p>
      <p className="text-[13px] text-[#6E6E73] max-w-[260px]">{body}</p>
      {cta && (
        <button
          onClick={onCta}
          className="mt-1 h-9 px-4 rounded-full text-white text-[12.5px] font-semibold active:scale-[0.97]"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          {cta}
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sheet shell (shared)
// ---------------------------------------------------------------------------
function SheetShell({ children, title, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  const mount = typeof document !== 'undefined' ? (document.getElementById('fylos-phone-root') || document.body) : null;
  if (!mount) return null;
  const markup = (
    <div onClick={onClose} className="absolute inset-0 z-[10000] flex items-end" style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(2px)' }}>
      <div onClick={(e) => e.stopPropagation()} className="w-full bg-white rounded-t-[24px] flex flex-col overflow-hidden" style={{ maxHeight: '88%', boxShadow: '0 -8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex flex-col items-center pt-3 pb-1.5">
          <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
        </div>
        <div className="flex items-center justify-between px-6 py-2.5">
          <h3 className="text-[15px] font-semibold text-[#111111] truncate">{title || ''}</h3>
          <button onClick={onClose} aria-label="Close" className="w-8 h-8 rounded-full bg-[#F7F5F2] border border-[#EDE8E2] flex items-center justify-center text-[#111111] active:scale-[0.94]">
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>
        <div className="overflow-y-auto wallet-scroll">{children}</div>
      </div>
    </div>
  );
  return createPortal(markup, mount);
}

// ---------------------------------------------------------------------------
// Edit profile sheet
// ---------------------------------------------------------------------------
function EditProfileSheet({ profile, onClose, onSave }) {
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  const [lookingFor, setLookingFor] = useState(profile.lookingFor);
  const toggleActivity = (id) => setLookingFor((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  return (
    <SheetShell title="Edit profile" onClose={onClose}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        <Field label="Name">
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-11 rounded-[12px] px-3 outline-none text-[14px]" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2' }} />
        </Field>
        <Field label="Bio">
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="w-full rounded-[12px] px-3 py-2 outline-none resize-none text-[14px]" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2' }} />
        </Field>
        <Field label="Looking for">
          <div className="flex flex-wrap gap-1.5">
            {ACTIVITY_OPTIONS.map((a) => {
              const isOn = lookingFor.includes(a.id);
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => toggleActivity(a.id)}
                  className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12px] font-semibold border transition-colors active:scale-[0.97] ${
                    isOn ? 'bg-[#FFE9DD] border-[#FFD4CC] text-[#7A2F12]' : 'bg-white border-black/[0.06] text-[#6E6E73]'
                  }`}
                >
                  <Icon size={12} strokeWidth={2.2} />
                  {a.label}
                </button>
              );
            })}
          </div>
        </Field>
        <button
          onClick={() => onSave({ name, bio, lookingFor })}
          className="h-12 rounded-[14px] text-white text-[14px] font-semibold active:scale-[0.99]"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)', boxShadow: '0 6px 18px rgba(232,93,42,0.28)' }}
        >
          Save changes
        </button>
      </div>
    </SheetShell>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">{label}</span>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add milestone sheet
// ---------------------------------------------------------------------------
function AddMilestoneSheet({ onClose, onSave }) {
  const [label, setLabel] = useState('');
  const [date, setDate] = useState('');
  const [iconKey, setIconKey] = useState('walk');
  const canSubmit = label.trim() && date;
  const submit = () => {
    if (!canSubmit) return;
    const dt = new Date(`${date}T00:00:00`);
    const dateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    onSave({ id: `milestone_${Date.now()}`, label: label.trim(), dateStr, dateMs: dt.getTime(), icon: iconKey });
  };
  return (
    <SheetShell title="Add milestone" onClose={onClose}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        <Field label="What happened?">
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. First sleepover with Buddy" className="w-full h-11 rounded-[12px] px-3 outline-none text-[14px]" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2' }} />
        </Field>
        <Field label="When">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full h-11 rounded-[12px] px-3 outline-none text-[14px]" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2' }} />
        </Field>
        <Field label="Icon">
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(MILESTONE_ICON_MAP).filter(([k]) => k !== 'default').map(([k, Icon]) => {
              const isOn = iconKey === k;
              return (
                <button
                  key={k}
                  onClick={() => setIconKey(k)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors active:scale-[0.96] ${
                    isOn ? 'bg-[#FFE9DD] border-[#FFD4CC] text-[#E85D2A]' : 'bg-white border-black/[0.06] text-[#8E8E93]'
                  }`}
                >
                  <Icon size={14} strokeWidth={2.2} />
                </button>
              );
            })}
          </div>
        </Field>
        <button
          onClick={submit}
          disabled={!canSubmit}
          className="h-12 rounded-[14px] text-[14px] font-semibold active:scale-[0.99]"
          style={{
            background: canSubmit ? 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' : '#EDE8E2',
            color: canSubmit ? '#FFF' : '#A09A94',
            boxShadow: canSubmit ? '0 6px 18px rgba(232,93,42,0.28)' : 'none',
          }}
        >
          Save milestone
        </button>
      </div>
    </SheetShell>
  );
}

// ---------------------------------------------------------------------------
// Archetype picker sheet — browse 12 archetypes
// ---------------------------------------------------------------------------
function ArchetypePickerSheet({ currentId, onClose, onPick, onTakeQuiz }) {
  return (
    <SheetShell title="Choose an archetype" onClose={onClose}>
      <div className="px-6 pb-6 flex flex-col gap-3">
        <p className="text-[12.5px] text-[#6E6E73]">Pick the one that fits today. You can change anytime.</p>
        {onTakeQuiz && (
          <button
            onClick={onTakeQuiz}
            className="rounded-[14px] p-3 flex items-center gap-3 active:scale-[0.99] text-left"
            style={{ background: '#FFF1E5', border: '1px solid #FFD4CC' }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[#E85D2A]" style={{ background: '#FFE2D5' }}>
              <Sparkles size={16} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-semibold text-[#7A2F12]">Not sure? Take the quiz</p>
              <p className="text-[11.5px] text-[#7A2F12]/75">5 quick questions · we'll suggest a fit.</p>
            </div>
            <ChevronRight size={14} color="#E85D2A" strokeWidth={2.4} />
          </button>
        )}
        <div className="grid grid-cols-2 gap-2">
          {ARCHETYPES.map((a) => {
            const active = currentId === a.id;
            return (
              <button
                key={a.id}
                onClick={() => onPick(a.id)}
                className={`text-left p-3 rounded-[14px] border transition-colors active:scale-[0.98] ${
                  active ? 'border-[#FFD4CC] bg-[#FFF6F1]' : 'border-black/[0.05] bg-white'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className="w-9 h-9 rounded-full flex items-center justify-center text-[18px]"
                    style={{ background: a.color }}
                  >
                    {a.glyph}
                  </span>
                  {active && (
                    <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#E85D2A] text-white">
                      <Check size={12} strokeWidth={2.6} />
                    </span>
                  )}
                </div>
                <p className="text-[13px] font-semibold text-[#111111]">{a.label}</p>
                <p className="text-[11.5px] text-[#6E6E73] leading-snug mt-0.5">{a.tagline}</p>
              </button>
            );
          })}
        </div>
      </div>
    </SheetShell>
  );
}

// ---------------------------------------------------------------------------
// Share sheet — preview share-card
// ---------------------------------------------------------------------------
function ShareSheet({ profile, archetype, stats, latestMilestone, onClose, onCopy }) {
  const handleCopy = () => {
    try { if (navigator?.clipboard) navigator.clipboard.writeText(`https://${profile.publicLink}`).catch(() => {}); } catch (_) {}
    onCopy && onCopy();
  };
  const handleNativeShare = () => {
    try {
      if (navigator?.share) {
        navigator.share({ title: `${profile.name} on Fylos`, text: `Meet ${profile.name} — ${archetype.label} on Fylos`, url: `https://${profile.publicLink}` }).catch(() => {});
      } else {
        handleCopy();
      }
    } catch (_) { handleCopy(); }
  };
  return (
    <SheetShell title="Share" onClose={onClose}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        {/* Preview card */}
        <div
          className="rounded-[20px] overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #FFF1E5 0%, #F7F5F2 100%)', border: '1px solid #EDE8E2' }}
        >
          <div className="p-5 flex flex-col items-center text-center gap-3">
            {profile.photo && (
              <img src={profile.photo} className="w-20 h-20 rounded-[20px] object-cover bg-[#F3F3F5]" alt="" style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.08)' }} />
            )}
            <div className="flex flex-col items-center gap-1">
              <p className="text-[18px] font-semibold text-[#111111]">{profile.name}</p>
              <p className="text-[12.5px] text-[#6E6E73]">{profile.breed} · {profile.age} yrs · {profile.location}</p>
            </div>
            <span
              className="inline-flex items-center gap-1.5 h-7 px-3 rounded-full"
              style={{ background: archetype.color, color: T.warmText }}
            >
              <span className="text-[14px]">{archetype.glyph}</span>
              <span className="text-[12px] font-semibold">{archetype.label}</span>
            </span>
            <div className="grid grid-cols-3 gap-1 w-full mt-2 text-center">
              <Stat label="walks" value={stats.walks} />
              <Stat label="friends" value={stats.friends} />
              <Stat label="photos" value={stats.photos} />
            </div>
            {latestMilestone && (
              <p className="text-[11.5px] text-[#8E7A6B]">Latest: {latestMilestone.label} · {latestMilestone.dateStr}</p>
            )}
            <p className="text-[10.5px] font-semibold text-[#E85D2A] tracking-wider mt-1">FYLOS · {profile.publicLink}</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleNativeShare}
            className="h-11 rounded-[12px] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98]"
            style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
          >
            <Share2 size={14} strokeWidth={2.2} />
            Share card
          </button>
          <button
            onClick={handleCopy}
            className="h-11 rounded-[12px] bg-[#F7F7F8] border border-black/[0.06] text-[13px] font-semibold text-[#111111] flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <Link2 size={14} strokeWidth={2.2} />
            Copy public link
          </button>
          <button
            disabled
            className="h-11 rounded-[12px] bg-[#F7F7F8] border border-black/[0.06] text-[13px] font-semibold text-[#A09A94] flex items-center justify-center gap-1.5"
          >
            <Download size={14} strokeWidth={2.2} />
            Save as image · soon
          </button>
        </div>
      </div>
    </SheetShell>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[16px] font-semibold text-[#111111] tabular-nums">{value}</span>
      <span className="text-[10px] text-[#8E8E93] uppercase tracking-wide">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Settings sheet — quick toggles
// ---------------------------------------------------------------------------
function SettingsSheet({ profile, onChange, onClose }) {
  return (
    <SheetShell title="Profile settings" onClose={onClose}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        <ToggleRow
          icon={Eye}
          label="Discoverable in nearby search"
          body="Owners nearby can find your Fylos in Discovery."
          value={profile.discoverable}
          onChange={(v) => onChange({ discoverable: v })}
        />
        <ToggleRow
          icon={Lock}
          label="Health data"
          body="Vaccines, meds, vet history — always private. Hard-locked."
          value={false}
          locked
        />
        <Field label="Public link">
          <div className="flex items-center gap-2 h-11 rounded-[12px] px-3" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2' }}>
            <Link2 size={14} className="text-[#8E8E93]" />
            <span className="text-[13px] text-[#111111] truncate">{profile.publicLink}</span>
          </div>
        </Field>
        <p className="text-[11.5px] text-[#8E8E93] leading-snug">
          Per-post visibility (Public / Friends / Private) is set when you share a moment.
        </p>
      </div>
    </SheetShell>
  );
}
function ToggleRow({ icon: Icon, label, body, value, onChange, locked }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-[#F7F5F2] flex items-center justify-center text-[#6E6E73] shrink-0">
        <Icon size={14} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold text-[#111111]">{label}</p>
        <p className="text-[11.5px] text-[#8E8E93] leading-snug mt-0.5">{body}</p>
      </div>
      <button
        onClick={() => !locked && onChange && onChange(!value)}
        disabled={locked}
        className="shrink-0 w-11 h-7 rounded-full transition-colors relative"
        style={{ background: locked ? '#E5E5EA' : value ? T.coral : '#D1D1D6', opacity: locked ? 0.6 : 1 }}
        aria-pressed={value}
      >
        <span
          className="absolute top-0.5 bg-white rounded-full transition-all"
          style={{
            width: 24, height: 24,
            left: value ? 18 : 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.18)',
          }}
        />
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add photo sheet — URL placeholder (real upload would be native)
// ---------------------------------------------------------------------------
function AddPhotoSheet({ onClose, onAdd }) {
  const [url, setUrl] = useState('https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=70');
  const [location, setLocation] = useState('');
  return (
    <SheetShell title="Add photo" onClose={onClose}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        <p className="text-[12.5px] text-[#6E6E73]">Native photo picker comes with the mobile build. For now, paste a photo URL or use the suggested one.</p>
        <Field label="Photo URL">
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full h-11 rounded-[12px] px-3 outline-none text-[12.5px]" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2' }} />
        </Field>
        <Field label="Where (optional)">
          <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Zürichhorn" className="w-full h-11 rounded-[12px] px-3 outline-none text-[14px]" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2' }} />
        </Field>
        {url && (
          <img src={url} alt="" className="w-full rounded-[14px] object-cover" style={{ height: 200, background: '#F3F3F5' }} />
        )}
        <button
          onClick={() => onAdd(url, location)}
          className="h-12 rounded-[14px] text-white text-[14px] font-semibold active:scale-[0.99]"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)', boxShadow: '0 6px 18px rgba(232,93,42,0.28)' }}
        >
          Add photo
        </button>
      </div>
    </SheetShell>
  );
}

// ---------------------------------------------------------------------------
// Photo lightbox
// ---------------------------------------------------------------------------
function PhotoLightbox({ photo, pinned, onClose, onTogglePin }) {
  const mount = typeof document !== 'undefined' ? (document.getElementById('fylos-phone-root') || document.body) : null;
  if (!mount) return null;
  const markup = (
    <div onClick={onClose} className="absolute inset-0 z-[10001] flex flex-col" style={{ background: 'rgba(17,17,17,0.92)', backdropFilter: 'blur(4px)' }}>
      <div className="flex items-center justify-between px-5 pt-12 pb-3">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white active:scale-[0.94]"
        >
          <X size={16} strokeWidth={2.2} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePin(); }}
          className={`h-10 px-3 rounded-full backdrop-blur flex items-center gap-1.5 text-[12px] font-semibold active:scale-[0.96] ${
            pinned ? 'bg-[#E85D2A] text-white' : 'bg-white/20 text-white'
          }`}
        >
          <Pin size={13} strokeWidth={2.2} fill={pinned ? 'currentColor' : 'none'} />
          {pinned ? 'Pinned' : 'Pin'}
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <img src={photo.url} alt="" className="max-w-full max-h-full rounded-[12px] object-contain" />
      </div>
      <div className="text-center pb-10 pt-3">
        <p className="text-[12.5px] font-semibold text-white">{photo.location || 'Untagged'}</p>
        <p className="text-[11.5px] text-white/70 mt-0.5">{photo.dateStr}</p>
      </div>
    </div>
  );
  return createPortal(markup, mount);
}

// ---------------------------------------------------------------------------
// Add memory sheet (kept compatible with existing onAddMemory contract)
// ---------------------------------------------------------------------------
const VIBES = [
  { id: 'loved', label: 'Loved it' },
  { id: 'liked', label: 'Liked it' },
  { id: 'ok',    label: 'OK' },
  { id: 'off',   label: 'Off day' },
];
function AddMemorySheet({ petName, onClose, onSave }) {
  const [partnerName, setPartnerName] = useState('');
  const [place, setPlace] = useState('');
  const [note, setNote] = useState('');
  const [vibe, setVibe] = useState('loved');
  const canSave = partnerName.trim().length > 0;
  return (
    <SheetShell title="Add memory" onClose={onClose}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        <Field label={`Who was ${petName} with?`}>
          <input value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="e.g. Buddy" className="w-full h-11 rounded-[12px] px-3 outline-none text-[14px]" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2' }} />
        </Field>
        <Field label="Where?">
          <input value={place} onChange={(e) => setPlace(e.target.value)} placeholder="e.g. Zürichhorn" className="w-full h-11 rounded-[12px] px-3 outline-none text-[14px]" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2' }} />
        </Field>
        <Field label="How was it?">
          <div className="grid grid-cols-4 gap-1.5">
            {VIBES.map((v) => {
              const isOn = vibe === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setVibe(v.id)}
                  className={`h-10 rounded-[10px] transition-colors active:scale-[0.97] text-[11.5px] font-semibold border ${
                    isOn ? 'bg-[#FFE9DD] border-[#FFD4CC] text-[#7A2F12]' : 'bg-white border-black/[0.06] text-[#76767D]'
                  }`}
                >
                  {v.label}
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="One line about it (optional)">
          <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Two relaxed players. Lots of polite resets." className="w-full rounded-[12px] px-3 py-2 outline-none resize-none text-[13px]" style={{ border: '1px solid #EDE8E2', background: '#F7F5F2' }} />
        </Field>
        <button
          onClick={() => canSave && onSave({ partnerName: partnerName.trim(), place: place.trim(), title: note.trim() || 'Time together', vibe })}
          disabled={!canSave}
          className="h-12 rounded-[14px] text-[14px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.99]"
          style={{
            background: canSave ? 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' : '#EDE8E2',
            color: canSave ? '#FFF' : '#A09A94',
            boxShadow: canSave ? '0 6px 18px rgba(232,93,42,0.28)' : 'none',
          }}
        >
          <Sparkles size={14} strokeWidth={2.2} />
          Save memory
        </button>
      </div>
    </SheetShell>
  );
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Archetype quiz sheet — 5 questions → tally → suggested archetype card
// ---------------------------------------------------------------------------
function ArchetypeQuizSheet({ petName, onClose, onApply }) {
  const [step, setStep] = useState(0); // 0..ARCHETYPE_QUIZ.length-1, then 'result'
  const [answers, setAnswers] = useState({}); // { [questionId]: answerId }
  const isResult = step === 'result';
  const currentQ = !isResult ? ARCHETYPE_QUIZ[step] : null;
  const total = ARCHETYPE_QUIZ.length;
  const progress = isResult ? 1 : (step + 1) / total;

  const pickAnswer = (qId, aId) => {
    const next = { ...answers, [qId]: aId };
    setAnswers(next);
    if (step + 1 < total) setStep(step + 1);
    else setStep('result');
  };

  const goBack = () => {
    if (isResult) setStep(total - 1);
    else if (step > 0) setStep(step - 1);
  };

  const resultId = isResult ? tallyArchetype(answers) : null;
  const result = resultId ? ARCHETYPE_BY_ID[resultId] : null;

  return (
    <SheetShell title={isResult ? `${petName}'s archetype` : 'Quick quiz'} onClose={onClose}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        {/* Progress bar */}
        <div className="flex items-center gap-2">
          {!isResult && step > 0 && (
            <button onClick={goBack} aria-label="Back" className="w-8 h-8 rounded-full bg-[#F7F5F2] border border-[#EDE8E2] flex items-center justify-center text-[#111111] active:scale-[0.94]">
              <ChevronLeft size={15} strokeWidth={2.2} />
            </button>
          )}
          <div className="flex-1 h-1.5 rounded-full" style={{ background: '#EDE8E2' }}>
            <div
              className="h-full rounded-full transition-all duration-[300ms]"
              style={{ width: `${Math.round(progress * 100)}%`, background: 'linear-gradient(90deg, #FF7240 0%, #E85D2A 100%)' }}
            />
          </div>
          <span className="text-[11px] font-semibold text-[#8E8E93] tabular-nums">
            {isResult ? `${total}/${total}` : `${step + 1}/${total}`}
          </span>
        </div>

        {!isResult && currentQ && (
          <div className="flex flex-col gap-3">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">Question {step + 1}</p>
            <h3 className="text-[18px] font-semibold text-[#111111] leading-snug">
              {currentQ.prompt.replace('your Fylos', petName).replace('they', petName)}
            </h3>
            <div className="flex flex-col gap-2 mt-1">
              {currentQ.answers.map((a) => (
                <button
                  key={a.id}
                  onClick={() => pickAnswer(currentQ.id, a.id)}
                  className="w-full text-left rounded-[14px] p-3.5 transition-colors active:scale-[0.99]"
                  style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}
                >
                  <p className="text-[14px] text-[#111111]">{a.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {isResult && result && (
          <div className="flex flex-col gap-4">
            <div className="rounded-[20px] overflow-hidden" style={{ background: 'linear-gradient(180deg, #FFF1E5 0%, #FFFAF5 100%)', border: '1px solid #FFD4CC' }}>
              <div className="p-5 flex flex-col items-center text-center gap-3">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-[28px]"
                  style={{ background: result.color, border: `1px solid ${T.border}` }}
                >
                  {result.glyph}
                </div>
                <div>
                  <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">{petName} is</p>
                  <p className="text-[22px] font-semibold text-[#111111] leading-tight mt-0.5">{result.label}</p>
                  <p className="text-[13px] text-[#6E6058] leading-snug mt-1.5">{result.tagline}</p>
                </div>
                <p className="text-[12.5px] text-[#5D5D64] leading-relaxed max-w-[280px]">{result.longDescription}</p>
                {result.traits && result.traits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {result.traits.map((t) => (
                      <span key={t} className="inline-flex items-center h-7 px-2.5 rounded-full text-[11.5px] font-medium" style={{ background: '#FFFFFF', color: '#7A2F12', border: '1px solid #FFD4CC' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => onApply(resultId)}
                className="h-12 rounded-[14px] text-white text-[14px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.99]"
                style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)', boxShadow: '0 6px 18px rgba(232,93,42,0.28)' }}
              >
                <Check size={15} strokeWidth={2.4} />
                Apply to profile
              </button>
              <button
                onClick={() => { setAnswers({}); setStep(0); }}
                className="h-11 rounded-[12px] bg-[#F7F7F8] border border-black/[0.06] text-[13px] font-semibold text-[#111111] flex items-center justify-center gap-1.5 active:scale-[0.98]"
              >
                <Sparkles size={13} strokeWidth={2.2} />
                Retake quiz
              </button>
            </div>
          </div>
        )}
      </div>
    </SheetShell>
  );
}

function Toast({ message }) {
  return (
    <div
      className="absolute left-1/2 bottom-[120px] -translate-x-1/2 z-[10001] px-4 py-2.5 rounded-full text-[12.5px] font-semibold text-white pointer-events-none whitespace-nowrap"
      style={{ background: 'rgba(17,17,17,0.92)', backdropFilter: 'blur(10px)' }}
    >
      {message}
    </div>
  );
}
