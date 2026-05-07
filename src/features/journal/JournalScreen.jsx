import React, { useState, useMemo } from 'react';
import {
  Search, SlidersHorizontal, ChevronDown, MapPin, Pin, MoreHorizontal,
  Clock, Trash2, Edit3, BookOpen, ChevronLeft, ImageIcon, X,
} from 'lucide-react';
import {
  Screen, ScreenHeader, IconBtn, Section, SectionLabel, Card, LargeCard,
  Pill, PrimaryBtn, GhostBtn, FAB, EmptyState, Avatar,
  BottomSheet, SheetHeader, FullScreenOverlay,
  T, SHADOWS, RADIUS,
} from '../../components/ui';
import {
  ENTRY_TYPES, ENTRY_TYPE_LIST, MOODS, MOOD_LIST,
  JOURNAL_PETS, JOURNAL_ENTRIES,
  formatEntryDate, formatEntryTime, groupEntriesByPeriod,
} from '../../data/journal';

/* ───────────────────────────────────────────────────────────
   Journal Screen — main entry point for the 4th tab.
   Owns local state for: pet filter, type filter, search,
   sheets (add, detail, filter, pet-switch), entries.
   ─────────────────────────────────────────────────────────── */

export default function JournalScreen({ onTabBarChange }) {
  const [entries, setEntries] = useState(JOURNAL_ENTRIES);
  const [activePetId, setActivePetId] = useState(JOURNAL_PETS[0].id);
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [petSheetOpen, setPetSheetOpen] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const [detailEntryId, setDetailEntryId] = useState(null);

  const activePet = JOURNAL_PETS.find((p) => p.id === activePetId);

  /* ─── Derived: filtered + grouped entries ─── */
  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => e.petId === activePetId)
      .filter((e) => activeType === 'all' || e.type === activeType)
      .filter((e) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.body.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          (e.location || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [entries, activePetId, activeType, searchQuery]);

  const pinnedEntries = filteredEntries.filter((e) => e.pinned);
  const groupedEntries = groupEntriesByPeriod(filteredEntries);
  const detailEntry = entries.find((e) => e.id === detailEntryId);

  /* ─── Mutations ─── */
  const handleAddEntry = (entry) => {
    setEntries([{ ...entry, id: `j_${Date.now()}`, petId: activePetId }, ...entries]);
    setAddSheetOpen(false);
  };
  const handleDeleteEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
    setDetailEntryId(null);
  };
  const handleTogglePin = (id) => {
    setEntries(entries.map((e) => e.id === id ? { ...e, pinned: !e.pinned } : e));
  };

  /* ─── Render ─── */
  return (
    <Screen>
      <ScreenHeader
        title="Journal"
        subtitle={`${filteredEntries.length} ${filteredEntries.length === 1 ? 'entry' : 'entries'} for ${activePet.name}`}
        trailing={
          <>
            <IconBtn icon={Search} ariaLabel="Search" onClick={() => setSearchOpen(true)} />
            <IconBtn icon={SlidersHorizontal} ariaLabel="Filter" onClick={() => setFilterSheetOpen(true)} />
          </>
        }
      />

      <div className="flex-1 overflow-y-auto pb-32">
        {/* Pet selector — compact pill below header */}
        <div className="px-5 pt-3 pb-2">
          <button
            onClick={() => setPetSheetOpen(true)}
            className="inline-flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full bg-white active:scale-[0.98] transition-transform"
            style={{ border: `1px solid ${T.border}`, boxShadow: SHADOWS.card }}
          >
            <Avatar src={activePet.photo} name={activePet.name} size={28} />
            <span className="text-[13.5px] font-semibold" style={{ color: T.txt }}>{activePet.name}</span>
            <ChevronDown size={14} color={T.muted} strokeWidth={2.2} />
          </button>
        </div>

        {/* Type filter chips */}
        <div className="px-5 mb-4 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <Pill active={activeType === 'all'} onClick={() => setActiveType('all')}>
            All · {entries.filter((e) => e.petId === activePetId).length}
          </Pill>
          {ENTRY_TYPE_LIST.map((t) => {
            const count = entries.filter((e) => e.petId === activePetId && e.type === t.id).length;
            if (count === 0) return null;
            return (
              <Pill
                key={t.id}
                active={activeType === t.id}
                onClick={() => setActiveType(t.id)}
                icon={t.icon}
                color={t.color}
              >
                {t.label} · {count}
              </Pill>
            );
          })}
        </div>

        {/* Pinned strip */}
        {pinnedEntries.length > 0 && activeType === 'all' && (
          <Section label="Pinned">
            <div className="flex gap-3 overflow-x-auto -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
              {pinnedEntries.map((e) => (
                <PinnedCard key={e.id} entry={e} onClick={() => setDetailEntryId(e.id)} />
              ))}
            </div>
          </Section>
        )}

        {/* Empty state */}
        {filteredEntries.length === 0 && (
          <EmptyState
            icon={BookOpen}
            title={searchQuery ? 'No matches' : `No entries yet for ${activePet.name}`}
            body={searchQuery
              ? 'Try a different keyword or clear the search.'
              : 'Capture moments, walks, milestones — anything you want to remember.'}
            action={!searchQuery && (
              <PrimaryBtn icon={Edit3} onClick={() => setAddSheetOpen(true)}>
                Add first entry
              </PrimaryBtn>
            )}
          />
        )}

        {/* Timeline feed */}
        {filteredEntries.length > 0 && (
          <>
            <TimelineGroup label="Today" entries={groupedEntries.today} onOpen={setDetailEntryId} />
            <TimelineGroup label="Yesterday" entries={groupedEntries.yesterday} onOpen={setDetailEntryId} />
            <TimelineGroup label="This week" entries={groupedEntries.thisWeek} onOpen={setDetailEntryId} />
            <TimelineGroup label="This month" entries={groupedEntries.thisMonth} onOpen={setDetailEntryId} />
            <TimelineGroup label="Earlier" entries={groupedEntries.earlier} onOpen={setDetailEntryId} />
          </>
        )}
      </div>

      {/* FAB — quick add */}
      <FAB onClick={() => setAddSheetOpen(true)} ariaLabel="Add entry" />

      {/* Pet selector sheet */}
      <BottomSheet open={petSheetOpen} onClose={() => setPetSheetOpen(false)} height="50%">
        <SheetHeader title="Switch Fylos" subtitle="Whose journal are you reading?" onClose={() => setPetSheetOpen(false)} />
        <div className="px-5 pb-5 space-y-2">
          {JOURNAL_PETS.map((p) => (
            <Card
              key={p.id}
              onClick={() => { setActivePetId(p.id); setPetSheetOpen(false); }}
              className={p.id === activePetId ? 'ring-2 ring-[#E85D2A]/30' : ''}
            >
              <div className="flex items-center gap-3">
                <Avatar src={p.photo} name={p.name} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold leading-tight" style={{ color: T.txt }}>{p.name}</p>
                  <p className="text-[12.5px] mt-0.5" style={{ color: T.mutedDark }}>{p.breed} · {p.age}y</p>
                </div>
                <span className="text-[12px] font-semibold" style={{ color: T.muted }}>
                  {entries.filter((e) => e.petId === p.id).length} entries
                </span>
              </div>
            </Card>
          ))}
        </div>
      </BottomSheet>

      {/* Filter sheet */}
      <BottomSheet open={filterSheetOpen} onClose={() => setFilterSheetOpen(false)} height="60%">
        <SheetHeader title="Filter entries" subtitle="Show only certain types" onClose={() => setFilterSheetOpen(false)} />
        <div className="px-5 pb-5">
          <div className="space-y-2">
            <FilterRow
              icon={BookOpen}
              label="All entries"
              count={entries.filter((e) => e.petId === activePetId).length}
              active={activeType === 'all'}
              onClick={() => { setActiveType('all'); setFilterSheetOpen(false); }}
            />
            {ENTRY_TYPE_LIST.map((t) => {
              const count = entries.filter((e) => e.petId === activePetId && e.type === t.id).length;
              return (
                <FilterRow
                  key={t.id}
                  icon={t.icon}
                  iconColor={t.color}
                  label={t.label}
                  count={count}
                  active={activeType === t.id}
                  onClick={() => { setActiveType(t.id); setFilterSheetOpen(false); }}
                />
              );
            })}
          </div>
        </div>
      </BottomSheet>

      {/* Search overlay */}
      <BottomSheet open={searchOpen} onClose={() => { setSearchOpen(false); setSearchQuery(''); }} height="80%">
        <SheetHeader title="Search journal" subtitle="Title, body, tags, location" onClose={() => { setSearchOpen(false); setSearchQuery(''); }} />
        <div className="px-5 pb-3">
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search…"
            className="w-full h-11 px-4 rounded-[14px] text-[14.5px] outline-none"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.txt }}
          />
        </div>
        <div className="px-5 pb-5 space-y-2">
          {searchQuery.trim() && filteredEntries.length === 0 && (
            <p className="text-[13.5px] text-center py-8" style={{ color: T.mutedDark }}>
              No entries match "{searchQuery}"
            </p>
          )}
          {searchQuery.trim() && filteredEntries.slice(0, 10).map((e) => (
            <EntryCardCompact key={e.id} entry={e} onClick={() => { setSearchOpen(false); setDetailEntryId(e.id); }} />
          ))}
          {!searchQuery.trim() && (
            <p className="text-[13.5px] text-center py-4" style={{ color: T.muted }}>
              Type to search…
            </p>
          )}
        </div>
      </BottomSheet>

      {/* Add entry sheet */}
      <AddEntrySheet
        open={addSheetOpen}
        onClose={() => setAddSheetOpen(false)}
        onSave={handleAddEntry}
        petName={activePet.name}
      />

      {/* Detail overlay */}
      <FullScreenOverlay open={!!detailEntry} onClose={() => setDetailEntryId(null)}>
        {detailEntry && (
          <EntryDetail
            entry={detailEntry}
            onClose={() => setDetailEntryId(null)}
            onDelete={() => handleDeleteEntry(detailEntry.id)}
            onTogglePin={() => handleTogglePin(detailEntry.id)}
          />
        )}
      </FullScreenOverlay>
    </Screen>
  );
}

/* ───────────────────────────────────────────────────────────
   TimelineGroup — date divider + list of entries
   ─────────────────────────────────────────────────────────── */
const TimelineGroup = ({ label, entries, onOpen }) => {
  if (entries.length === 0) return null;
  return (
    <Section label={label}>
      <div className="space-y-3">
        {entries.map((e) => (
          <EntryCard key={e.id} entry={e} onClick={() => onOpen(e.id)} />
        ))}
      </div>
    </Section>
  );
};

/* ───────────────────────────────────────────────────────────
   EntryCard — one timeline item (full width)
   Layout: type badge + title + body + meta row + photo strip
   ─────────────────────────────────────────────────────────── */
const EntryCard = ({ entry, onClick }) => {
  const type = ENTRY_TYPES[entry.type];
  const mood = entry.mood ? MOODS[entry.mood] : null;
  const TypeIcon = type.icon;

  return (
    <Card onClick={onClick} padding="p-0" className="overflow-hidden">
      {/* Photo strip if photos exist */}
      {entry.photos && entry.photos.length > 0 && (
        <div
          className="w-full"
          style={{
            height: 160,
            backgroundImage: `url(${entry.photos[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {entry.photos.length > 1 && (
            <div
              className="absolute m-3 px-2 py-1 rounded-full flex items-center gap-1"
              style={{ backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff' }}
            >
              <ImageIcon size={11} strokeWidth={2.4} />
              <span className="text-[11px] font-semibold">+{entry.photos.length - 1}</span>
            </div>
          )}
        </div>
      )}

      <div className="p-4">
        {/* Header row: type badge + pinned + time */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${type.color}1A` }}
            >
              <TypeIcon size={11} color={type.color} strokeWidth={2.4} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.05em]" style={{ color: type.color }}>
              {type.label}
            </span>
            {entry.pinned && <Pin size={11} color={T.coral} strokeWidth={2.4} className="ml-1" />}
          </div>
          <span className="text-[11.5px] font-medium" style={{ color: T.muted }}>
            {formatEntryTime(entry.date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-semibold leading-snug mb-1" style={{ color: T.txt }}>
          {entry.title}
        </h3>

        {/* Body */}
        {entry.body && (
          <p className="text-[13.5px] leading-snug line-clamp-2" style={{ color: T.mutedDark }}>
            {entry.body}
          </p>
        )}

        {/* Meta row: location + mood + tags */}
        {(entry.location || mood || entry.tags.length > 0) && (
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {entry.location && (
              <span className="inline-flex items-center gap-1 text-[11.5px]" style={{ color: T.muted }}>
                <MapPin size={11} strokeWidth={2.2} />
                {entry.location}
              </span>
            )}
            {mood && (
              <span className="inline-flex items-center gap-1 text-[11.5px]" style={{ color: mood.color }}>
                <mood.icon size={11} strokeWidth={2.4} />
                {mood.label}
              </span>
            )}
            {entry.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10.5px] font-semibold px-1.5 py-[1px] rounded"
                style={{ backgroundColor: T.tint, color: T.coral }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

/* ───────────────────────────────────────────────────────────
   PinnedCard — compact horizontal-scroll card
   ─────────────────────────────────────────────────────────── */
const PinnedCard = ({ entry, onClick }) => {
  const type = ENTRY_TYPES[entry.type];
  const TypeIcon = type.icon;
  return (
    <button
      onClick={onClick}
      className="shrink-0 w-[180px] rounded-[16px] overflow-hidden bg-white border text-left active:scale-[0.98] transition-transform"
      style={{ borderColor: T.border, boxShadow: SHADOWS.card }}
    >
      {entry.photos && entry.photos.length > 0 ? (
        <div
          style={{
            height: 100,
            backgroundImage: `url(${entry.photos[0]})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ) : (
        <div
          className="flex items-center justify-center"
          style={{ height: 100, backgroundColor: T.tint }}
        >
          <TypeIcon size={28} color={T.coral} strokeWidth={1.8} />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center gap-1 mb-1">
          <Pin size={10} color={T.coral} strokeWidth={2.4} />
          <span className="text-[10px] font-bold uppercase tracking-[0.05em]" style={{ color: type.color }}>
            {type.label}
          </span>
        </div>
        <p className="text-[12.5px] font-semibold leading-tight line-clamp-2" style={{ color: T.txt }}>
          {entry.title}
        </p>
        <p className="text-[10.5px] mt-1" style={{ color: T.muted }}>
          {formatEntryDate(entry.date)}
        </p>
      </div>
    </button>
  );
};

/* ───────────────────────────────────────────────────────────
   EntryCardCompact — used in search results
   ─────────────────────────────────────────────────────────── */
const EntryCardCompact = ({ entry, onClick }) => {
  const type = ENTRY_TYPES[entry.type];
  const TypeIcon = type.icon;
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-[14px] bg-white text-left active:scale-[0.99] transition-transform"
      style={{ border: `1px solid ${T.border}` }}
    >
      <div
        className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center"
        style={{ backgroundColor: `${type.color}1A` }}
      >
        <TypeIcon size={16} color={type.color} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13.5px] font-semibold leading-tight truncate" style={{ color: T.txt }}>
          {entry.title}
        </p>
        <p className="text-[11.5px] mt-0.5 truncate" style={{ color: T.mutedDark }}>
          {formatEntryDate(entry.date)}{entry.location ? ` · ${entry.location}` : ''}
        </p>
      </div>
    </button>
  );
};

/* ───────────────────────────────────────────────────────────
   FilterRow — used in filter sheet
   ─────────────────────────────────────────────────────────── */
const FilterRow = ({ icon: Icon, iconColor, label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-left active:scale-[0.99] transition-transform"
    style={{
      backgroundColor: active ? T.coralSoft : T.card,
      border: `1px solid ${active ? T.coral : T.border}`,
    }}
  >
    <div
      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
      style={{ backgroundColor: `${iconColor || T.coral}1A` }}
    >
      <Icon size={14} color={iconColor || T.coral} strokeWidth={2.2} />
    </div>
    <span className="text-[14px] font-semibold flex-1" style={{ color: T.txt }}>{label}</span>
    <span className="text-[12px] font-medium" style={{ color: T.mutedDark }}>{count}</span>
  </button>
);

/* ───────────────────────────────────────────────────────────
   AddEntrySheet — type chip + title + body + date + location + mood
   ─────────────────────────────────────────────────────────── */
const AddEntrySheet = ({ open, onClose, onSave, petName }) => {
  const [type, setType] = useState('moment');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [location, setLocation] = useState('');
  const [mood, setMood] = useState(null);

  const reset = () => {
    setType('moment'); setTitle(''); setBody(''); setLocation(''); setMood(null);
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      type,
      title: title.trim(),
      body: body.trim(),
      location: location.trim(),
      mood,
      tags: [],
      photos: [],
      pinned: false,
      date: new Date().toISOString(),
    });
    reset();
  };

  const handleClose = () => { reset(); onClose(); };

  return (
    <BottomSheet open={open} onClose={handleClose} height="92%">
      <SheetHeader title={`New entry`} subtitle={`Recording for ${petName}`} onClose={handleClose} />
      <div className="px-5 pb-5 space-y-4">
        {/* Type selector */}
        <div>
          <SectionLabel className="px-0">Type</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {ENTRY_TYPE_LIST.map((t) => (
              <Pill key={t.id} active={type === t.id} onClick={() => setType(t.id)} icon={t.icon} color={t.color}>
                {t.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <SectionLabel className="px-0">Title</SectionLabel>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Morning beach walk…"
            className="w-full h-11 px-4 rounded-[14px] text-[14.5px] outline-none"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.txt }}
          />
        </div>

        {/* Body */}
        <div>
          <SectionLabel className="px-0">What happened?</SectionLabel>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Optional — a short note about the moment."
            rows={4}
            className="w-full px-4 py-3 rounded-[14px] text-[14px] outline-none resize-none"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.txt }}
          />
        </div>

        {/* Location */}
        <div>
          <SectionLabel className="px-0">Location (optional)</SectionLabel>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Zurichhorn"
            className="w-full h-11 px-4 rounded-[14px] text-[14.5px] outline-none"
            style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, color: T.txt }}
          />
        </div>

        {/* Mood */}
        <div>
          <SectionLabel className="px-0">Mood (optional)</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {MOOD_LIST.map((m) => (
              <Pill key={m.id} active={mood === m.id} onClick={() => setMood(mood === m.id ? null : m.id)} icon={m.icon} color={m.color}>
                {m.label}
              </Pill>
            ))}
          </div>
        </div>

        {/* Photo placeholder */}
        <div>
          <SectionLabel className="px-0">Photos</SectionLabel>
          <button
            disabled
            className="w-full h-20 rounded-[14px] flex flex-col items-center justify-center gap-1"
            style={{
              backgroundColor: T.card,
              border: `1.5px dashed ${T.border}`,
              color: T.muted,
            }}
          >
            <ImageIcon size={20} strokeWidth={1.8} />
            <span className="text-[12px]">Photo upload — coming with backend</span>
          </button>
        </div>

        {/* Save */}
        <div className="pt-2">
          <PrimaryBtn onClick={handleSave} disabled={!title.trim()}>
            Save entry
          </PrimaryBtn>
          <div className="h-2" />
          <GhostBtn onClick={handleClose}>Cancel</GhostBtn>
        </div>
      </div>
    </BottomSheet>
  );
};

/* ───────────────────────────────────────────────────────────
   EntryDetail — full-screen view of one entry
   ─────────────────────────────────────────────────────────── */
const EntryDetail = ({ entry, onClose, onDelete, onTogglePin }) => {
  const type = ENTRY_TYPES[entry.type];
  const mood = entry.mood ? MOODS[entry.mood] : null;
  const TypeIcon = type.icon;
  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <Screen>
      <ScreenHeader
        title={type.label}
        subtitle={formatEntryDate(entry.date)}
        leading={<IconBtn icon={ChevronLeft} ariaLabel="Back" onClick={onClose} />}
        trailing={<IconBtn icon={MoreHorizontal} ariaLabel="Actions" onClick={() => setActionsOpen(true)} />}
      />

      <div className="flex-1 overflow-y-auto pb-10">
        {/* Photo carousel */}
        {entry.photos && entry.photos.length > 0 && (
          <div className="flex gap-2 overflow-x-auto px-5 mb-5" style={{ scrollbarWidth: 'none' }}>
            {entry.photos.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Photo ${i + 1}`}
                className="shrink-0 rounded-[16px] object-cover"
                style={{ width: 280, height: 200 }}
              />
            ))}
          </div>
        )}

        {/* Title + type badge */}
        <Section>
          <div className="flex items-center gap-1.5 mb-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${type.color}1A` }}
            >
              <TypeIcon size={13} color={type.color} strokeWidth={2.4} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.05em]" style={{ color: type.color }}>
              {type.label}
            </span>
            {entry.pinned && (
              <span className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: T.coral }}>
                <Pin size={11} strokeWidth={2.4} /> Pinned
              </span>
            )}
          </div>
          <h2 className="text-[22px] font-semibold leading-tight mb-3" style={{ color: T.txt }}>
            {entry.title}
          </h2>
          {entry.body && (
            <p className="text-[14.5px] leading-relaxed" style={{ color: T.mutedDark }}>
              {entry.body}
            </p>
          )}
        </Section>

        {/* Meta cards */}
        <Section label="Details">
          <Card padding="p-0">
            <div className="px-4 py-3 flex items-center gap-3">
              <Clock size={16} color={T.muted} strokeWidth={2.2} />
              <span className="text-[13.5px] flex-1" style={{ color: T.txt }}>
                {new Date(entry.date).toLocaleString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            {entry.location && (
              <>
                <div className="h-px" style={{ background: T.divider, marginLeft: 16 }} />
                <div className="px-4 py-3 flex items-center gap-3">
                  <MapPin size={16} color={T.muted} strokeWidth={2.2} />
                  <span className="text-[13.5px] flex-1" style={{ color: T.txt }}>{entry.location}</span>
                </div>
              </>
            )}
            {mood && (
              <>
                <div className="h-px" style={{ background: T.divider, marginLeft: 16 }} />
                <div className="px-4 py-3 flex items-center gap-3">
                  <mood.icon size={16} color={mood.color} strokeWidth={2.4} />
                  <span className="text-[13.5px] flex-1" style={{ color: T.txt }}>{mood.label}</span>
                </div>
              </>
            )}
          </Card>
        </Section>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <Section label="Tags">
            <div className="flex gap-2 flex-wrap">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: T.tint, color: T.coral }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Actions sheet */}
      <BottomSheet open={actionsOpen} onClose={() => setActionsOpen(false)} height="40%">
        <SheetHeader title="Entry actions" onClose={() => setActionsOpen(false)} />
        <div className="px-5 pb-5 space-y-2">
          <ActionRow icon={Pin} label={entry.pinned ? 'Unpin from top' : 'Pin to top'} onClick={() => { onTogglePin(); setActionsOpen(false); }} />
          <ActionRow icon={Edit3} label="Edit entry" onClick={() => { setActionsOpen(false); /* TODO: edit flow */ }} disabled />
          <ActionRow icon={Trash2} label="Delete entry" destructive onClick={() => { onDelete(); }} />
        </div>
      </BottomSheet>
    </Screen>
  );
};

/* ───────────────────────────────────────────────────────────
   ActionRow — used in detail actions sheet
   ─────────────────────────────────────────────────────────── */
const ActionRow = ({ icon: Icon, label, onClick, destructive, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-left active:scale-[0.99] transition-transform"
    style={{
      backgroundColor: T.card,
      border: `1px solid ${T.border}`,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    <Icon size={16} color={destructive ? T.danger : T.txt} strokeWidth={2.2} />
    <span className="text-[14px] font-semibold" style={{ color: destructive ? T.danger : T.txt }}>
      {label}
    </span>
  </button>
);
