import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, X, MapPin, MessageCircle, Calendar, Plus,
  Check, Star, Heart, Footprints, TreePine, GraduationCap, Coffee,
  Filter, Clock, Bookmark, BookmarkCheck, Sparkles, ArrowRight, Camera,
  Edit3, Send, Smile,
} from 'lucide-react';
import {
  ACTIVITY_FRIEND_DATA,
  ACTIVITY_PLAYDATE_DATA,
  MOCK_PLACES,
} from '../data/social';

/* =========================================================================
   FYLOS · Playdates — clean rebuild
   3 tabs: Discover · Playmates · Scheduled
   Zone S+L hybrid (per FYLOS_PRODUCT_DIRECTION §5):
     · Discover/Playmates browse like Airbnb (Zone S)
     · Scheduled is a Zone-L surface (countdown, live state)
   ========================================================================= */

// ---------------------------------------------------------------------------
// Activity vocabulary (used in Discover filter chips)
// ---------------------------------------------------------------------------
const ACTIVITIES = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'walks', label: 'Walks', icon: Footprints },
  { id: 'park', label: 'Park play', icon: TreePine },
  { id: 'training', label: 'Training', icon: GraduationCap },
  { id: 'calm', label: 'Calm hangouts', icon: Coffee },
];

const TABS = [
  { id: 'discover', label: 'Discover' },
  { id: 'playmates', label: 'Playmates' },
  { id: 'scheduled', label: 'Scheduled' },
];

// Map Network suggestions/friends into a richer "candidate" shape used by Discover.
// Reasons + matchScore come from ACTIVITY_FRIEND_DATA.suggestions; everything else
// is derived from the shared friends fixtures so a single edit ripples app-wide.
function buildCandidates() {
  const friendIds = new Set(ACTIVITY_FRIEND_DATA.friends.map((f) => f.petId));
  const all = [
    ...ACTIVITY_FRIEND_DATA.suggestions.map((s) => ({ ...s, source: 'suggestion' })),
    ...ACTIVITY_FRIEND_DATA.friends
      .filter((f) => !ACTIVITY_FRIEND_DATA.suggestions.some((s) => s.petId === f.petId))
      .map((f) => ({ ...f, source: 'friend' })),
  ];
  return all.map((c) => ({
    id: c.petId,
    petName: c.petName,
    petBreed: c.petBreed,
    petPhoto: c.petPhoto,
    ownerName: c.ownerName,
    distance: c.distance,
    matchScore: c.matchScore || 75,
    reasons: c.reasons || ['Nearby in your routine'],
    activityTags: pickActivityTags(c.petId),
    isFriend: friendIds.has(c.petId),
  }));
}

// Lightweight derived activity tags so Discover filtering has data to work with
// without bloating fixtures with per-pet preferences.
function pickActivityTags(petId) {
  const slot = (petId || '').slice(-1).charCodeAt(0) % 4;
  return [['walks', 'park'], ['walks', 'training'], ['calm', 'park'], ['walks', 'calm']][slot] || ['walks'];
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------
export default function PlaydateMatchingScreen({
  onClose,
  initialTab = 'discover',
  initialWrapUpId = null,
  onOpenProfile,
  onOpenMessages,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [tab, setTab] = useState(initialTab);
  const [activeActivity, setActiveActivity] = useState('all');
  const [savedIds, setSavedIds] = useState(() => new Set(['pet_012', 'pet_014']));

  const candidates = useMemo(() => buildCandidates(), []);
  const filteredCandidates = useMemo(() => {
    if (activeActivity === 'all') return candidates;
    return candidates.filter((c) => c.activityTags.includes(activeActivity));
  }, [candidates, activeActivity]);

  // Playdate state — seeded from shared fixtures so this screen and the in-tab
  // Playdates summary stay in sync.
  const [scheduled, setScheduled] = useState(() =>
    ACTIVITY_PLAYDATE_DATA.upcomingPlaydates.map(toScheduledRow)
  );
  const [pending, setPending] = useState(() =>
    ACTIVITY_PLAYDATE_DATA.pendingInvitations.map(toPendingRow)
  );
  const [past, setPast] = useState(() =>
    ACTIVITY_PLAYDATE_DATA.completedPlaydates.map(toPastRow)
  );

  // Sheets
  const [profileSheet, setProfileSheet] = useState(null);
  const [scheduleSheet, setScheduleSheet] = useState(null);
  const [detailSheet, setDetailSheet] = useState(null);
  const [wrapUpSheet, setWrapUpSheet] = useState(() => past.find((p) => p.id === initialWrapUpId) || null);
  useEffect(() => {
    if (!initialWrapUpId) return;
    const match = past.find((p) => p.id === initialWrapUpId);
    if (match) setWrapUpSheet(match);
  }, [initialWrapUpId, past]);

  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const goBack = () => {
    if (onClose) return onClose();
    const back = location.state?.returnTo;
    if (back) return navigate(back.path || '/', { state: back.state || {} });
    navigate('/', { state: { tab: 'activity', activitySubMode: 'community' } });
  };

  const toggleSaved = (id) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const playmates = useMemo(
    () => candidates.filter((c) => savedIds.has(c.id) || c.isFriend),
    [candidates, savedIds]
  );

  const handleSchedulePlaydate = (formData) => {
    const newRow = {
      id: `playdate_${Date.now()}`,
      petName: formData.target?.petName || 'Friend',
      petPhoto: formData.target?.petPhoto,
      ownerName: formData.target?.ownerName || '',
      date: formData.date,
      time: formData.time,
      placeName: formData.place,
      notes: formData.note,
      status: 'pending',
    };
    setScheduled((prev) => [newRow, ...prev]);
    setScheduleSheet(null);
    showToast(`Invite sent to ${newRow.petName}`);
  };

  const handleAcceptInvite = (id) => {
    const inv = pending.find((p) => p.id === id);
    if (!inv) return;
    setPending((prev) => prev.filter((p) => p.id !== id));
    setScheduled((prev) => [{ ...inv, status: 'confirmed' }, ...prev]);
    showToast(`Confirmed playdate with ${inv.petName}`);
  };
  const handleDeclineInvite = (id) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
  };

  const handleWrapUpSave = (item, data) => {
    setPast((prev) => prev.map((p) => (p.id === item.id ? { ...p, ...data, wrappedUp: true } : p)));
    setWrapUpSheet(null);
    showToast('Memory saved');
  };

  return (
    <div className="absolute inset-0 bg-[#F9F9FB] overflow-hidden flex flex-col">
      <Header tab={tab} onBack={goBack} onOpenFilters={() => showToast('Filters coming soon')} />
      <TabBar tab={tab} setTab={setTab} />

      <div className="flex-1 overflow-y-auto wallet-scroll" style={{ paddingBottom: 32 }}>
        {tab === 'discover' && (
          <DiscoverTab
            candidates={filteredCandidates}
            savedIds={savedIds}
            activeActivity={activeActivity}
            setActiveActivity={setActiveActivity}
            onTapPet={setProfileSheet}
            onSchedule={(c) => setScheduleSheet({ target: c })}
            onToggleSave={(c) => { toggleSaved(c.id); showToast(savedIds.has(c.id) ? `Removed ${c.petName}` : `Saved ${c.petName}`); }}
          />
        )}
        {tab === 'playmates' && (
          <PlaymatesTab
            playmates={playmates}
            onTapPet={setProfileSheet}
            onMessage={() => onOpenMessages && onOpenMessages()}
            onSchedule={(c) => setScheduleSheet({ target: c })}
            onSwitchToDiscover={() => setTab('discover')}
          />
        )}
        {tab === 'scheduled' && (
          <ScheduledTab
            scheduled={scheduled}
            pending={pending}
            past={past}
            onTap={setDetailSheet}
            onAccept={handleAcceptInvite}
            onDecline={handleDeclineInvite}
            onWrapUp={setWrapUpSheet}
            onPlanFirst={() => setTab('discover')}
          />
        )}
      </div>

      {profileSheet && (
        <MiniProfileSheet
          pet={profileSheet}
          saved={savedIds.has(profileSheet.id)}
          onClose={() => setProfileSheet(null)}
          onToggleSave={() => toggleSaved(profileSheet.id)}
          onSchedule={() => { setScheduleSheet({ target: profileSheet }); setProfileSheet(null); }}
          onMessage={() => { onOpenMessages && onOpenMessages(); setProfileSheet(null); }}
        />
      )}
      {scheduleSheet && (
        <ScheduleSheet
          target={scheduleSheet.target}
          onClose={() => setScheduleSheet(null)}
          onSubmit={handleSchedulePlaydate}
        />
      )}
      {detailSheet && (
        <PlaydateDetailSheet
          item={detailSheet}
          onClose={() => setDetailSheet(null)}
          onMessage={() => { onOpenMessages && onOpenMessages(); setDetailSheet(null); }}
          onCancel={() => {
            setScheduled((prev) => prev.filter((p) => p.id !== detailSheet.id));
            setDetailSheet(null);
            showToast('Playdate cancelled');
          }}
        />
      )}
      {wrapUpSheet && (
        <WrapUpSheet
          item={wrapUpSheet}
          onClose={() => setWrapUpSheet(null)}
          onSave={(data) => handleWrapUpSave(wrapUpSheet, data)}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Header + tab bar
// ---------------------------------------------------------------------------
function Header({ tab, onBack, onOpenFilters }) {
  return (
    <header
      className="relative z-30 bg-white/95 backdrop-blur-xl border-b border-black/[0.04]"
      style={{ paddingTop: 56, paddingBottom: 12, paddingLeft: 20, paddingRight: 20 }}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-black/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-full active:scale-[0.96] transition-transform"
        >
          <ChevronLeft size={20} color="#111111" />
        </button>
        <h1 className="text-[17px] font-semibold text-[#111111]">Playdates</h1>
        <button
          onClick={onOpenFilters}
          className="w-[40px] h-[40px] flex items-center justify-center bg-white border border-black/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-full active:scale-[0.96] transition-transform"
        >
          <Filter size={17} color="#111111" />
        </button>
      </div>
    </header>
  );
}

function TabBar({ tab, setTab }) {
  const idx = TABS.findIndex((t) => t.id === tab);
  return (
    <nav className="bg-white/95 backdrop-blur-xl border-b border-black/[0.04] px-5 pb-3">
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
            onClick={() => setTab(t.id)}
            className={`relative z-10 flex-1 h-9 text-[13px] font-semibold transition-colors ${
              tab === t.id ? 'text-[#111111]' : 'text-[#8E8E93]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Discover tab
// ---------------------------------------------------------------------------
function DiscoverTab({ candidates, savedIds, activeActivity, setActiveActivity, onTapPet, onSchedule, onToggleSave }) {
  return (
    <div className="px-5 pt-4 flex flex-col gap-4">
      <ActivityChips active={activeActivity} onChange={setActiveActivity} />
      <div className="flex items-center justify-between mt-1">
        <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93]">{candidates.length} nearby</p>
        <p className="text-[12px] text-[#8E8E93]">Sorted by match</p>
      </div>
      {candidates.length === 0 ? (
        <DiscoverEmpty onClear={() => setActiveActivity('all')} />
      ) : (
        <div className="flex flex-col gap-3">
          {candidates.map((c) => (
            <CandidateCard
              key={c.id}
              candidate={c}
              saved={savedIds.has(c.id)}
              onTap={() => onTapPet(c)}
              onSchedule={() => onSchedule(c)}
              onToggleSave={() => onToggleSave(c)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityChips({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto custom-scrollbar -mx-1 px-1 pb-1">
      {ACTIVITIES.map((a) => {
        const isActive = active === a.id;
        const Icon = a.icon;
        return (
          <button
            key={a.id}
            onClick={() => onChange(a.id)}
            className={`shrink-0 inline-flex items-center gap-1.5 h-9 px-3.5 rounded-full text-[12.5px] font-semibold border transition-colors active:scale-[0.97] ${
              isActive
                ? 'bg-[#111111] text-white border-transparent'
                : 'bg-white text-[#6E6E73] border-black/[0.06] hover:text-[#111111]'
            }`}
          >
            <Icon size={13} strokeWidth={2.2} />
            {a.label}
          </button>
        );
      })}
    </div>
  );
}

function CandidateCard({ candidate, saved, onTap, onSchedule, onToggleSave }) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <button onClick={onTap} className="block w-full text-left active:opacity-90 transition-opacity">
        <div className="flex items-start gap-3 p-4">
          <img
            src={candidate.petPhoto}
            alt={candidate.petName}
            className="w-[64px] h-[64px] rounded-[16px] object-cover bg-[#F3F3F5] shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold text-[#111111] truncate">{candidate.petName}</h3>
                <p className="text-[12px] text-[#6E6E73] truncate">{candidate.petBreed} · {candidate.distance.toFixed(1)} km</p>
              </div>
              <span
                className="shrink-0 inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[10.5px] font-semibold"
                style={{ background: '#FFE9DD', color: '#7A2F12' }}
              >
                {candidate.matchScore}% fit
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {candidate.reasons.slice(0, 2).map((r, i) => (
                <span
                  key={i}
                  className="inline-flex items-center h-[22px] px-2 rounded-full text-[10.5px] font-medium text-[#6E6058]"
                  style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>
      </button>
      <div className="flex items-center gap-2 px-4 pb-4">
        <button
          onClick={onSchedule}
          className="flex-1 h-10 rounded-[12px] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)', boxShadow: '0 4px 12px rgba(232,93,42,0.22)' }}
        >
          <Calendar size={14} strokeWidth={2.2} />
          Plan playdate
        </button>
        <button
          onClick={onToggleSave}
          aria-label={saved ? 'Saved' : 'Save'}
          className={`w-10 h-10 rounded-[12px] flex items-center justify-center border transition-colors ${
            saved ? 'bg-[#FFE9DD] border-[#FFD4CC] text-[#E85D2A]' : 'bg-[#F7F7F8] border-black/[0.06] text-[#6E6E73]'
          }`}
        >
          {saved ? <BookmarkCheck size={16} strokeWidth={2.2} /> : <Bookmark size={16} strokeWidth={2.2} />}
        </button>
      </div>
    </div>
  );
}

function DiscoverEmpty({ onClear }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-10 px-6">
      <div className="w-14 h-14 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
        <Sparkles size={20} strokeWidth={2.2} />
      </div>
      <p className="text-[15px] font-semibold text-[#111111]">No matches with this filter</p>
      <p className="text-[13px] text-[#6E6E73] max-w-[260px]">Try widening the activity to see more pups nearby.</p>
      <button
        onClick={onClear}
        className="mt-1 h-9 px-4 rounded-full bg-[#111111] text-white text-[12.5px] font-semibold active:scale-[0.97] transition-transform"
      >
        Clear filter
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Playmates tab
// ---------------------------------------------------------------------------
function PlaymatesTab({ playmates, onTapPet, onMessage, onSchedule, onSwitchToDiscover }) {
  if (!playmates.length) {
    return (
      <div className="px-6 pt-12 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
          <Heart size={20} strokeWidth={2.2} />
        </div>
        <p className="text-[15px] font-semibold text-[#111111]">No playmates yet</p>
        <p className="text-[13px] text-[#6E6E73] max-w-[280px]">Save pups from Discover to add them to your playmates.</p>
        <button
          onClick={onSwitchToDiscover}
          className="mt-2 h-10 px-5 rounded-full text-white text-[13px] font-semibold active:scale-[0.97] transition-transform"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          Discover pups nearby
        </button>
      </div>
    );
  }
  return (
    <div className="px-5 pt-4 flex flex-col gap-3">
      <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93]">{playmates.length} playmates</p>
      {playmates.map((c) => (
        <PlaymateCard
          key={c.id}
          candidate={c}
          onTap={() => onTapPet(c)}
          onMessage={onMessage}
          onSchedule={() => onSchedule(c)}
        />
      ))}
    </div>
  );
}

function PlaymateCard({ candidate, onTap, onMessage, onSchedule }) {
  return (
    <div className="bg-white rounded-[16px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
      <button onClick={onTap} className="flex items-center gap-3 p-3.5 w-full text-left active:opacity-90">
        <img
          src={candidate.petPhoto}
          alt={candidate.petName}
          className="w-[52px] h-[52px] rounded-full object-cover bg-[#F3F3F5] shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-[14px] font-semibold text-[#111111] truncate">{candidate.petName}</h4>
          <p className="text-[12px] text-[#6E6E73] truncate">
            {candidate.petBreed} · {candidate.ownerName}
          </p>
        </div>
        <ChevronRight size={16} color="#B6B6BC" />
      </button>
      <div className="grid grid-cols-2 gap-2 px-3.5 pb-3.5">
        <button
          onClick={onMessage}
          className="h-9 rounded-[10px] bg-[#F7F7F8] border border-black/[0.06] text-[12px] font-semibold text-[#111111] flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <MessageCircle size={13} strokeWidth={2.2} />
          Message
        </button>
        <button
          onClick={onSchedule}
          className="h-9 rounded-[10px] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98]"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          <Calendar size={13} strokeWidth={2.2} />
          Plan
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Scheduled tab — Zone L (live state, time-sensitive)
// ---------------------------------------------------------------------------
function ScheduledTab({ scheduled, pending, past, onTap, onAccept, onDecline, onWrapUp, onPlanFirst }) {
  const todayItems = scheduled.filter((s) => /today/i.test(s.date));
  const restItems = scheduled.filter((s) => !/today/i.test(s.date));
  const wrapUpQueue = past.filter((p) => !p.wrappedUp);

  if (!scheduled.length && !pending.length && !wrapUpQueue.length) {
    return (
      <div className="px-6 pt-12 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
          <Calendar size={20} strokeWidth={2.2} />
        </div>
        <p className="text-[15px] font-semibold text-[#111111]">No playdates scheduled</p>
        <p className="text-[13px] text-[#6E6E73] max-w-[280px]">Plan a meet-up from Discover or your Playmates.</p>
        <button
          onClick={onPlanFirst}
          className="mt-2 h-10 px-5 rounded-full text-white text-[13px] font-semibold active:scale-[0.97] transition-transform"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          Discover pups
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-4 flex flex-col gap-5 pb-6">
      {wrapUpQueue.length > 0 && (
        <ScheduledSection title="Wrap up">
          {wrapUpQueue.map((p) => (
            <WrapUpRow key={p.id} item={p} onWrapUp={() => onWrapUp(p)} />
          ))}
        </ScheduledSection>
      )}
      {todayItems.length > 0 && (
        <ScheduledSection title="Today">
          {todayItems.map((s) => (
            <ScheduledCard key={s.id} item={s} onTap={() => onTap(s)} live />
          ))}
        </ScheduledSection>
      )}
      {restItems.length > 0 && (
        <ScheduledSection title="Upcoming">
          {restItems.map((s) => (
            <ScheduledCard key={s.id} item={s} onTap={() => onTap(s)} />
          ))}
        </ScheduledSection>
      )}
      {pending.length > 0 && (
        <ScheduledSection title="Awaiting reply">
          {pending.map((p) => (
            <PendingCard key={p.id} item={p} onAccept={() => onAccept(p.id)} onDecline={() => onDecline(p.id)} />
          ))}
        </ScheduledSection>
      )}
    </div>
  );
}

function ScheduledSection({ title, children }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93]">{title}</p>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function ScheduledCard({ item, onTap, live = false }) {
  return (
    <button
      onClick={onTap}
      className="bg-white rounded-[16px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-3.5 flex items-center gap-3 text-left active:opacity-90 active:scale-[0.99] transition-transform"
    >
      <div className="shrink-0 w-[58px] flex flex-col items-center text-center">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#8E8E93]">{item.date}</span>
        <span className="text-[18px] font-semibold text-[#111111] tabular-nums">{item.time}</span>
      </div>
      <div className="flex-1 min-w-0 flex items-center gap-2.5">
        <img src={item.petPhoto} alt="" className="w-9 h-9 rounded-full object-cover bg-[#F3F3F5]" />
        <div className="min-w-0">
          <p className="text-[14px] font-semibold text-[#111111] truncate">
            {item.petName}{item.ownerName ? ` · ${item.ownerName}` : ''}
          </p>
          <p className="text-[12px] text-[#6E6E73] truncate flex items-center gap-1">
            <MapPin size={11} strokeWidth={2} className="text-[#A6A6AC]" />
            {item.placeName}
          </p>
        </div>
      </div>
      {live ? (
        <span className="shrink-0 inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[10.5px] font-semibold bg-[#E5F9ED] text-[#34693E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] animate-pulse" />
          {item.status === 'in-progress' ? 'In progress' : 'Today'}
        </span>
      ) : (
        <ChevronRight size={16} color="#B6B6BC" className="shrink-0" />
      )}
    </button>
  );
}

function PendingCard({ item, onAccept, onDecline }) {
  const isReceived = item.direction === 'received' || !item.direction;
  return (
    <div className="bg-white rounded-[16px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-3.5">
      <div className="flex items-center gap-3">
        <img src={item.petPhoto} alt="" className="w-9 h-9 rounded-full object-cover bg-[#F3F3F5]" />
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#111111] truncate">
            {isReceived ? `${item.petName} invited ${item.hostPetName ? '' : 'you'}` : `Sent to ${item.petName}`}
          </p>
          <p className="text-[12px] text-[#6E6E73] truncate">
            {item.date} · {item.time} · {item.placeName}
          </p>
        </div>
      </div>
      {isReceived && (
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={onDecline}
            className="h-9 rounded-[10px] bg-[#F7F7F8] border border-black/[0.06] text-[12px] font-semibold text-[#111111] active:scale-[0.98]"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="h-9 rounded-[10px] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98]"
            style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
          >
            <Check size={13} strokeWidth={2.4} />
            Accept
          </button>
        </div>
      )}
    </div>
  );
}

function WrapUpRow({ item, onWrapUp }) {
  return (
    <button
      onClick={onWrapUp}
      className="bg-[#FFE9DD] rounded-[16px] border border-[#FFD4CC] p-3.5 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
    >
      <img src={item.petPhoto} alt="" className="w-9 h-9 rounded-full object-cover bg-[#F3F3F5]" />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#7A2F12]">How was it with {item.petName}?</p>
        <p className="text-[12px] text-[#7A2F12]/75 truncate">
          {item.date} · {item.placeName}
        </p>
      </div>
      <span className="shrink-0 text-[12px] font-semibold text-[#E85D2A] flex items-center gap-1">
        Wrap up <ArrowRight size={13} strokeWidth={2.2} />
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Mini profile sheet — peek
// ---------------------------------------------------------------------------
function MiniProfileSheet({ pet, saved, onClose, onToggleSave, onSchedule, onMessage }) {
  return (
    <SheetShell onClose={onClose}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img
            src={pet.petPhoto}
            alt={pet.petName}
            className="w-[68px] h-[68px] rounded-[16px] object-cover bg-[#F3F3F5]"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-[18px] font-semibold text-[#111111] truncate">{pet.petName}</h2>
            <p className="text-[13px] text-[#6E6E73] truncate">
              {pet.petBreed} · {pet.distance.toFixed(1)} km · {pet.ownerName}
            </p>
          </div>
          <button
            onClick={onToggleSave}
            aria-label={saved ? 'Saved' : 'Save'}
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${
              saved ? 'bg-[#FFE9DD] border-[#FFD4CC] text-[#E85D2A]' : 'bg-[#F7F7F8] border-black/[0.06] text-[#6E6E73]'
            }`}
          >
            {saved ? <BookmarkCheck size={16} strokeWidth={2.2} /> : <Bookmark size={16} strokeWidth={2.2} />}
          </button>
        </div>
        <div className="rounded-[14px] bg-[#F7F5F2] p-3.5 border border-[#EDE8E2]">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B] mb-1.5">Why a good fit</p>
          <ul className="flex flex-col gap-1">
            {pet.reasons.map((r, i) => (
              <li key={i} className="text-[13px] text-[#6E6058] flex items-start gap-2">
                <Sparkles size={12} className="mt-[3px] text-[#E85D2A] shrink-0" strokeWidth={2.2} />
                {r}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onMessage}
            className="h-11 rounded-[12px] bg-[#F7F7F8] border border-black/[0.06] text-[13px] font-semibold text-[#111111] flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <MessageCircle size={15} strokeWidth={2.2} />
            Message
          </button>
          <button
            onClick={onSchedule}
            className="h-11 rounded-[12px] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98]"
            style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
          >
            <Calendar size={15} strokeWidth={2.2} />
            Plan playdate
          </button>
        </div>
      </div>
    </SheetShell>
  );
}

// ---------------------------------------------------------------------------
// Schedule sheet — pick date/time/place + note
// ---------------------------------------------------------------------------
const DATE_OPTIONS = ['Today', 'Tomorrow', 'Sat', 'Sun', 'Next week'];
const TIME_OPTIONS = ['09:00', '11:00', '14:00', '16:00', '18:00'];

function ScheduleSheet({ target, onClose, onSubmit }) {
  const [date, setDate] = useState('Tomorrow');
  const [time, setTime] = useState('11:00');
  const [place, setPlace] = useState(MOCK_PLACES[0]?.name || '');
  const [note, setNote] = useState('');
  const canSubmit = !!(date && time && place);
  return (
    <SheetShell onClose={onClose} title="Plan a playdate">
      <div className="px-6 pb-6 flex flex-col gap-4">
        {target && (
          <div className="flex items-center gap-3 p-3 rounded-[14px] bg-[#F7F5F2] border border-[#EDE8E2]">
            <img src={target.petPhoto} className="w-10 h-10 rounded-full object-cover" alt="" />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#111111]">{target.petName}</p>
              <p className="text-[11.5px] text-[#6E6E73]">{target.ownerName}</p>
            </div>
          </div>
        )}
        <PickerRow label="Date">
          <ChipScroll options={DATE_OPTIONS} value={date} onChange={setDate} />
        </PickerRow>
        <PickerRow label="Time">
          <ChipScroll options={TIME_OPTIONS} value={time} onChange={setTime} />
        </PickerRow>
        <PickerRow label="Place">
          <ChipScroll options={MOCK_PLACES.map((p) => p.name)} value={place} onChange={setPlace} />
        </PickerRow>
        <PickerRow label="Note (optional)">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={`Anything ${target?.petName || 'they'} should know?`}
            rows={2}
            className="w-full rounded-[12px] px-3 py-2 outline-none resize-none text-[13px]"
            style={{ border: '1px solid #EDE8E2', background: '#F7F5F2', color: '#111' }}
          />
        </PickerRow>
        <button
          onClick={() => canSubmit && onSubmit({ target, date, time, place, note })}
          disabled={!canSubmit}
          className="h-12 rounded-[14px] text-white text-[14px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.99] transition-transform"
          style={{
            background: canSubmit ? 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' : '#EDE8E2',
            color: canSubmit ? '#FFF' : '#A09A94',
            boxShadow: canSubmit ? '0 6px 18px rgba(232,93,42,0.28)' : 'none',
          }}
        >
          <Send size={14} strokeWidth={2.2} />
          Send invite
        </button>
      </div>
    </SheetShell>
  );
}

function PickerRow({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">{label}</span>
      {children}
    </div>
  );
}

function ChipScroll({ options, value, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto custom-scrollbar -mx-1 px-1 pb-1">
      {options.map((opt) => {
        const isActive = value === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`shrink-0 h-9 px-3.5 rounded-full text-[12.5px] font-semibold border transition-colors active:scale-[0.97] ${
              isActive
                ? 'bg-[#111111] text-white border-transparent'
                : 'bg-white text-[#6E6E73] border-black/[0.06]'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Detail sheet — read view of a scheduled playdate
// ---------------------------------------------------------------------------
function PlaydateDetailSheet({ item, onClose, onMessage, onCancel }) {
  return (
    <SheetShell onClose={onClose} title="Playdate">
      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 rounded-[14px] bg-[#F7F5F2] border border-[#EDE8E2]">
          <img src={item.petPhoto} className="w-12 h-12 rounded-full object-cover" alt="" />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#111111]">{item.petName}</p>
            {item.ownerName && <p className="text-[12px] text-[#6E6E73]">{item.ownerName}</p>}
          </div>
        </div>
        <DetailRow icon={Calendar} label="When" value={`${item.date} · ${item.time}`} />
        <DetailRow icon={MapPin} label="Where" value={item.placeName} />
        {item.notes && <DetailRow icon={Edit3} label="Notes" value={item.notes} />}
        <div className="grid grid-cols-2 gap-2 mt-1">
          <button
            onClick={onCancel}
            className="h-11 rounded-[12px] bg-[#F7F7F8] border border-black/[0.06] text-[13px] font-semibold text-[#D96852] active:scale-[0.98]"
          >
            Cancel
          </button>
          <button
            onClick={onMessage}
            className="h-11 rounded-[12px] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98]"
            style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
          >
            <MessageCircle size={15} strokeWidth={2.2} />
            Message
          </button>
        </div>
      </div>
    </SheetShell>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-1">
      <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0 text-[#6E6E73]">
        <Icon size={14} strokeWidth={2.1} />
      </div>
      <div className="min-w-0">
        <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E8E93]">{label}</p>
        <p className="text-[13.5px] text-[#111111] mt-0.5 break-words">{value}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Wrap-up sheet — rating + tags + note + photo placeholder
// ---------------------------------------------------------------------------
const WRAP_UP_TAGS = [
  '🎾 Loved fetch', '🐾 Great vibes', '😌 Calm buddy', '💧 Splashed around',
  '🌳 Long ramble', '🤝 Polite play', '🍪 Treats helped', '⚡ High energy',
];

function WrapUpSheet({ item, onClose, onSave }) {
  const [rating, setRating] = useState(item.rating || 0);
  const [tags, setTags] = useState(item.tags || []);
  const [note, setNote] = useState(item.note || '');
  const toggleTag = (t) => setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  return (
    <SheetShell onClose={onClose} title={`How was it with ${item.petName}?`}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3 p-3 rounded-[14px] bg-[#F7F5F2] border border-[#EDE8E2]">
          <img src={item.petPhoto} className="w-10 h-10 rounded-full object-cover" alt="" />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#111111]">{item.petName} · {item.placeName}</p>
            <p className="text-[12px] text-[#6E6E73]">{item.date}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">Rate the vibe</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setRating(n)}
                aria-label={`${n} stars`}
                className="active:scale-[0.92] transition-transform"
              >
                <Star
                  size={28}
                  strokeWidth={2.2}
                  color={n <= rating ? '#E85D2A' : '#D8D2CB'}
                  fill={n <= rating ? '#E85D2A' : 'transparent'}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">Highlights</span>
          <div className="flex flex-wrap gap-1.5">
            {WRAP_UP_TAGS.map((t) => {
              const isOn = tags.includes(t);
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`h-8 px-3 rounded-full text-[12px] font-semibold border transition-colors active:scale-[0.97] ${
                    isOn
                      ? 'bg-[#FFE9DD] border-[#FFD4CC] text-[#7A2F12]'
                      : 'bg-white border-black/[0.06] text-[#6E6E73]'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">A line about it</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Quick note for the memory…"
            rows={2}
            className="w-full rounded-[12px] px-3 py-2 outline-none resize-none text-[13px]"
            style={{ border: '1px solid #EDE8E2', background: '#F7F5F2', color: '#111' }}
          />
        </div>
        <button
          onClick={() => onSave({ rating, tags, note })}
          disabled={!rating}
          className="h-12 rounded-[14px] text-white text-[14px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.99]"
          style={{
            background: rating ? 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' : '#EDE8E2',
            color: rating ? '#FFF' : '#A09A94',
            boxShadow: rating ? '0 6px 18px rgba(232,93,42,0.28)' : 'none',
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
// Sheet shell
// ---------------------------------------------------------------------------
function SheetShell({ children, title, onClose }) {
  // Block body scroll while the sheet is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-[10000] flex items-end"
      style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(2px)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-t-[24px] shadow-[0_-8px_40px_rgba(0,0,0,0.18)] flex flex-col overflow-hidden"
        style={{ maxHeight: '88%' }}
      >
        <div className="flex flex-col items-center pt-3 pb-1.5">
          <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
        </div>
        <div className="flex items-center justify-between px-6 py-2.5">
          <h3 className="text-[15px] font-semibold text-[#111111] truncate">{title || ''}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#F7F5F2] border border-[#EDE8E2] flex items-center justify-center text-[#111111] active:scale-[0.94]"
          >
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>
        <div className="overflow-y-auto wallet-scroll">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
function Toast({ message }) {
  return (
    <div className="absolute left-1/2 bottom-[40px] -translate-x-1/2 z-[10001] px-4 py-2.5 rounded-full text-[12.5px] font-semibold text-white pointer-events-none whitespace-nowrap"
      style={{ background: 'rgba(17,17,17,0.92)', backdropFilter: 'blur(10px)' }}>
      {message}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mappers — fixtures → row shape used by ScheduledTab
// ---------------------------------------------------------------------------
function toScheduledRow(p) {
  const invitee = p.invitees?.[0] || {};
  return {
    id: p.id,
    petName: invitee.petName || p.hostPetName || 'Friend',
    petPhoto: invitee.petPhoto,
    ownerName: invitee.ownerName || '',
    date: p.date === '2026-03-02' ? 'Today' : new Date(p.date).toLocaleDateString('en-US', { weekday: 'short' }),
    time: p.startTime,
    placeName: p.place?.name || 'TBD',
    notes: p.notes || '',
    status: p.status === 'in-progress' ? 'in-progress' : 'confirmed',
  };
}

function toPendingRow(p) {
  return {
    id: p.id,
    petName: p.hostPetName || 'Friend',
    petPhoto: p.invitees?.[0]?.petPhoto,
    date: new Date(p.date).toLocaleDateString('en-US', { weekday: 'short' }),
    time: p.startTime,
    placeName: p.place?.name || 'TBD',
    direction: 'received',
    hostPetName: p.hostPetName,
  };
}

function toPastRow(p) {
  const partnerName = p.participants?.[0] || 'Friend';
  return {
    id: p.id,
    petName: partnerName,
    petPhoto: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150',
    date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    placeName: p.place?.name || 'TBD',
    wrappedUp: false,
  };
}
