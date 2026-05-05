import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, X, MapPin, MessageCircle, Calendar, Plus,
  Check, Star, Heart, Footprints, TreePine, GraduationCap, Coffee,
  Filter, Clock, Bookmark, BookmarkCheck, Sparkles, ArrowRight, Camera,
  Edit3, Send, Smile, RotateCcw, Image as ImageIcon,
} from 'lucide-react';
import {
  ACTIVITY_FRIEND_DATA,
  ACTIVITY_PLAYDATE_DATA,
  MOCK_PLACES,
  ARCHETYPES,
  ARCHETYPE_BY_ID,
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
//
// `interested` flag: deterministic-ish by petId so the same pet always either
// likes you back or doesn't (no flicker on re-render). ~40% match-back rate
// keeps the swipe loop rewarding without trivialising matches.
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
    age: c.age || 3,
    matchScore: c.matchScore || 75,
    reasons: c.reasons || ['Nearby in your routine'],
    activityTags: pickActivityTags(c.petId),
    archetypeId: pickArchetype(c.petId),
    isFriend: friendIds.has(c.petId),
    interested: pickInterested(c.petId),
  }));
}

// Lightweight derived activity tags so Discover filtering has data to work with
// without bloating fixtures with per-pet preferences.
function pickActivityTags(petId) {
  const slot = (petId || '').slice(-1).charCodeAt(0) % 4;
  return [['walks', 'park'], ['walks', 'training'], ['calm', 'park'], ['walks', 'calm']][slot] || ['walks'];
}

function pickArchetype(petId) {
  const slot = (petId || '').slice(-1).charCodeAt(0) % ARCHETYPES.length;
  return ARCHETYPES[slot]?.id || 'diplomat';
}

// Hash the last 2 chars of petId; ~40% of pets are pre-interested.
function pickInterested(petId) {
  const tail = (petId || '').slice(-2);
  let h = 0;
  for (let i = 0; i < tail.length; i++) h = (h * 31 + tail.charCodeAt(i)) | 0;
  return (((h % 10) + 10) % 10) < 4;
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
  const [passedIds, setPassedIds] = useState(() => new Set());

  const allCandidates = useMemo(() => buildCandidates(), []);
  const filteredCandidates = useMemo(() => {
    let pool = allCandidates;
    if (activeActivity !== 'all') pool = pool.filter((c) => c.activityTags.includes(activeActivity));
    return pool;
  }, [allCandidates, activeActivity]);
  const swipeDeck = useMemo(
    () => filteredCandidates.filter((c) => !passedIds.has(c.id) && !savedIds.has(c.id) && !c.isFriend),
    [filteredCandidates, passedIds, savedIds]
  );

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
  const [match, setMatch] = useState(null); // { candidate } when mutual like
  const [chatTarget, setChatTarget] = useState(null); // { candidate } when chat opens
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
    () => allCandidates.filter((c) => savedIds.has(c.id) || c.isFriend),
    [allCandidates, savedIds]
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

  // Swipe-deck handlers — `like` triggers MatchOverlay if the candidate is
  // pre-marked as interested; `pass` silently advances.
  const handlePass = (candidate) => {
    setPassedIds((prev) => new Set(prev).add(candidate.id));
  };
  const handleLike = (candidate) => {
    setSavedIds((prev) => new Set(prev).add(candidate.id));
    if (candidate.interested) {
      // Brief delay so the swipe-out animation finishes before the overlay.
      setTimeout(() => setMatch({ candidate }), 240);
    } else {
      showToast(`Saved ${candidate.petName}`);
    }
  };
  const handleResetDeck = () => setPassedIds(new Set());
  const handleSendIcebreaker = (candidate, text) => {
    showToast(`Said hi to ${candidate.petName}`);
    setChatTarget(null);
  };

  return (
    <div className="absolute inset-0 bg-[#F9F9FB] overflow-hidden flex flex-col">
      <Header tab={tab} onBack={goBack} onOpenFilters={() => showToast('Filters coming soon')} />
      <TabBar tab={tab} setTab={setTab} />

      <div className="flex-1 overflow-y-auto wallet-scroll" style={{ paddingBottom: 32 }}>
        {tab === 'discover' && (
          <SwipeDeckTab
            deck={swipeDeck}
            activeActivity={activeActivity}
            setActiveActivity={setActiveActivity}
            onPass={handlePass}
            onLike={handleLike}
            onTapDetail={setProfileSheet}
            onResetDeck={handleResetDeck}
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
      {match && (
        <MatchOverlay
          candidate={match.candidate}
          myName="Leo"
          myPhoto="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=300"
          onClose={() => setMatch(null)}
          onSayHi={() => { setChatTarget({ candidate: match.candidate }); setMatch(null); }}
          onPlanPlaydate={() => { setScheduleSheet({ target: match.candidate }); setMatch(null); }}
        />
      )}
      {chatTarget && (
        <ChatSheet
          candidate={chatTarget.candidate}
          onClose={() => setChatTarget(null)}
          onSend={(text) => handleSendIcebreaker(chatTarget.candidate, text)}
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
      className="relative z-30 bg-white/95 backdrop-blur-xl"
      style={{ paddingTop: 52, paddingBottom: 8, paddingLeft: 16, paddingRight: 16 }}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          aria-label="Back"
          className="w-9 h-9 flex items-center justify-center bg-white border border-black/[0.05] rounded-full active:scale-[0.96] transition-transform"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
        >
          <ChevronLeft size={16} color="#111111" strokeWidth={2.4} />
        </button>
        <h1 className="text-[14px] font-semibold text-[#111111] tracking-tight">Playdates</h1>
        <button
          onClick={onOpenFilters}
          aria-label="Filters"
          className="w-9 h-9 flex items-center justify-center bg-white border border-black/[0.05] rounded-full active:scale-[0.96] transition-transform"
          style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
        >
          <Filter size={14} color="#111111" strokeWidth={2.2} />
        </button>
      </div>
    </header>
  );
}

function TabBar({ tab, setTab }) {
  const idx = TABS.findIndex((t) => t.id === tab);
  return (
    <nav className="bg-white/95 backdrop-blur-xl px-4 pb-2.5">
      <div className="relative bg-[#F2F2F7] rounded-full p-0.5 flex">
        <div
          aria-hidden
          className="absolute top-0.5 bottom-0.5 bg-white rounded-full shadow-[0_1px_4px_rgba(0,0,0,0.06)] transition-all duration-[260ms]"
          style={{
            width: `calc(${100 / TABS.length}% - 4px)`,
            left: `calc(${(100 / TABS.length) * idx}% + 2px)`,
            transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
          }}
        />
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative z-10 flex-1 h-8 text-[11.5px] font-semibold transition-colors tracking-tight ${
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
// ---------------------------------------------------------------------------
// SwipeDeckTab — Tinder-style stack of curated candidates
// ---------------------------------------------------------------------------
function SwipeDeckTab({ deck, activeActivity, setActiveActivity, onPass, onLike, onTapDetail, onResetDeck }) {
  return (
    <div className="px-5 pt-4 flex flex-col gap-3 h-full">
      <ActivityChips active={activeActivity} onChange={setActiveActivity} />
      <div className="flex items-center justify-between -mt-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A09A94]">
          Curated for {' '}
          <span className="text-[#E85D2A]">Leo</span>
        </p>
        <p className="text-[10px] text-[#A09A94] tabular-nums uppercase tracking-wide">{deck.length} left</p>
      </div>
      {deck.length === 0 ? (
        <DeckEmpty onReset={onResetDeck} onClearFilter={() => setActiveActivity('all')} hasFilter={activeActivity !== 'all'} />
      ) : (
        <SwipeDeck deck={deck} onPass={onPass} onLike={onLike} onTapDetail={onTapDetail} />
      )}
    </div>
  );
}

function ActivityChips({ active, onChange }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto custom-scrollbar -mx-1 px-1 pb-1">
      {ACTIVITIES.map((a) => {
        const isActive = active === a.id;
        const Icon = a.icon;
        return (
          <button
            key={a.id}
            onClick={() => onChange(a.id)}
            className={`shrink-0 inline-flex items-center gap-1 h-7 px-2.5 rounded-full text-[11px] font-medium border transition-colors active:scale-[0.97] tracking-tight ${
              isActive
                ? 'bg-[#111111] text-white border-transparent'
                : 'bg-white text-[#6E6E73] border-black/[0.06] hover:text-[#111111]'
            }`}
          >
            <Icon size={11} strokeWidth={2} />
            {a.label}
          </button>
        );
      })}
    </div>
  );
}

// Stack of cards. Top card responds to drag (touch + mouse). Drag past the
// horizontal threshold = animate out + advance. Snap back otherwise.
function SwipeDeck({ deck, onPass, onLike, onTapDetail }) {
  const [drag, setDrag] = useState(0);
  const [exiting, setExiting] = useState(null); // 'left' | 'right' | null
  const startXRef = useRef(null);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);

  const top = deck[0];
  const peek = deck[1];
  const peek2 = deck[2];

  const threshold = 90;
  const likeOpacity = Math.max(0, Math.min(1, drag / threshold));
  const passOpacity = Math.max(0, Math.min(1, -drag / threshold));

  const reset = () => {
    setDrag(0);
    startXRef.current = null;
    draggingRef.current = false;
    movedRef.current = false;
  };

  const triggerExit = (dir) => {
    if (exiting) return;
    setExiting(dir);
    setDrag(dir === 'right' ? 600 : -600);
    setTimeout(() => {
      if (dir === 'right') onLike(top);
      else onPass(top);
      setExiting(null);
      reset();
    }, 240);
  };

  const onPointerDown = (e) => {
    if (exiting || !top) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    startXRef.current = x;
    draggingRef.current = true;
    movedRef.current = false;
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current || exiting) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const delta = x - (startXRef.current ?? x);
    if (Math.abs(delta) > 6) movedRef.current = true;
    setDrag(delta);
  };
  const onPointerUp = () => {
    if (!draggingRef.current || exiting) return;
    if (drag > threshold) triggerExit('right');
    else if (drag < -threshold) triggerExit('left');
    else { setDrag(0); reset(); }
  };

  if (!top) return null;

  return (
    <div className="relative flex-1 flex flex-col items-center" style={{ minHeight: 480 }}>
      {/* Stack */}
      <div className="relative w-full" style={{ height: 460 }}>
        {peek2 && (
          <SwipeCardShell key={peek2.id} candidate={peek2} depth={2} />
        )}
        {peek && (
          <SwipeCardShell key={peek.id} candidate={peek} depth={1} />
        )}
        <SwipeCardShell
          key={top.id}
          candidate={top}
          depth={0}
          drag={drag}
          exiting={exiting}
          likeOpacity={likeOpacity}
          passOpacity={passOpacity}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={() => { if (!movedRef.current) onTapDetail && onTapDetail(top); }}
        />
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={() => triggerExit('left')}
          aria-label="Pass"
          className="w-14 h-14 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#76767D] active:scale-[0.92] transition-transform"
          style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}
        >
          <X size={22} strokeWidth={2.4} />
        </button>
        <button
          onClick={() => onTapDetail && onTapDetail(top)}
          aria-label="View profile"
          className="w-12 h-12 rounded-full bg-white border border-black/[0.06] flex items-center justify-center text-[#6E6E73] active:scale-[0.94] transition-transform"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <Sparkles size={16} strokeWidth={2.2} />
        </button>
        <button
          onClick={() => triggerExit('right')}
          aria-label="Like"
          className="w-14 h-14 rounded-full text-white flex items-center justify-center active:scale-[0.92] transition-transform"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)', boxShadow: '0 8px 22px rgba(232,93,42,0.36)' }}
        >
          <Heart size={22} strokeWidth={2.4} fill="white" />
        </button>
      </div>
    </div>
  );
}

function SwipeCardShell({
  candidate,
  depth = 0,
  drag = 0,
  exiting = null,
  likeOpacity = 0,
  passOpacity = 0,
  onPointerDown, onPointerMove, onPointerUp, onPointerCancel, onClick,
}) {
  const archetype = ARCHETYPE_BY_ID[candidate.archetypeId] || ARCHETYPES[0];
  const isTop = depth === 0;
  const rotate = drag * 0.06;
  const shadowAlpha = isTop ? 0.12 : 0.06;
  const transform = isTop
    ? `translateX(${drag}px) rotate(${rotate}deg)`
    : `translateY(${depth * 8}px) scale(${1 - depth * 0.04})`;
  return (
    <div
      onPointerDown={isTop ? onPointerDown : undefined}
      onPointerMove={isTop ? onPointerMove : undefined}
      onPointerUp={isTop ? onPointerUp : undefined}
      onPointerCancel={isTop ? onPointerCancel : undefined}
      onClick={isTop && Math.abs(drag) < 4 ? onClick : undefined}
      className="absolute inset-0 rounded-[24px] overflow-hidden bg-white"
      style={{
        transform,
        transition: exiting ? 'transform 240ms cubic-bezier(0.32, 0.72, 0, 1)' : (isTop ? 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1)' : 'transform 220ms ease'),
        boxShadow: `0 ${10 + depth * 4}px ${30 + depth * 6}px rgba(0,0,0,${shadowAlpha})`,
        cursor: isTop ? 'grab' : 'default',
        touchAction: isTop ? 'pan-y' : 'auto',
        zIndex: 10 - depth,
      }}
    >
      <img
        src={candidate.petPhoto}
        alt={candidate.petName}
        className="w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      {/* Bottom gradient + content */}
      <div
        className="absolute left-0 right-0 bottom-0 p-5 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.78) 100%)' }}
      >
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[20px] font-semibold text-white leading-tight drop-shadow tracking-tight">
              {candidate.petName} <span className="font-normal text-white/85 text-[15px]">· {candidate.age || '?'}</span>
            </p>
            <p className="text-[13px] text-white/85 mt-1">
              {candidate.petBreed} · {candidate.distance.toFixed(1)} km
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full text-[11.5px] font-semibold"
                style={{ background: archetype.color, color: '#7A2F12' }}
              >
                <span>{archetype.glyph}</span>
                {archetype.label}
              </span>
              {candidate.reasons.slice(0, 1).map((r, i) => (
                <span
                  key={i}
                  className="inline-flex items-center h-7 px-2.5 rounded-full text-[11.5px] font-medium text-white"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)' }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
          <span
            className="shrink-0 inline-flex items-center h-7 px-2.5 rounded-full text-[11.5px] font-semibold"
            style={{ background: '#FFE9DD', color: '#7A2F12' }}
          >
            {candidate.matchScore}% fit
          </span>
        </div>
      </div>

      {/* Drag overlays — only on top card */}
      {isTop && (
        <>
          <div
            className="absolute top-6 left-6 px-3 py-1 rounded-[10px] border-2 pointer-events-none"
            style={{
              borderColor: '#34C759',
              color: '#34C759',
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.12em',
              transform: `rotate(-12deg)`,
              opacity: likeOpacity,
              transition: exiting ? 'none' : 'opacity 120ms',
            }}
          >
            LIKE
          </div>
          <div
            className="absolute top-6 right-6 px-3 py-1 rounded-[10px] border-2 pointer-events-none"
            style={{
              borderColor: '#FF3B30',
              color: '#FF3B30',
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: '0.12em',
              transform: `rotate(12deg)`,
              opacity: passOpacity,
              transition: exiting ? 'none' : 'opacity 120ms',
            }}
          >
            PASS
          </div>
        </>
      )}
    </div>
  );
}

function DeckEmpty({ onReset, onClearFilter, hasFilter }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-12 px-6">
      <div className="w-16 h-16 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
        <Sparkles size={22} strokeWidth={2.2} />
      </div>
      <p className="text-[16px] font-semibold text-[#111111]">That's everyone for today.</p>
      <p className="text-[13px] text-[#6E6E73] max-w-[280px]">New pups arrive each morning. Come back tomorrow for fresh matches.</p>
      <div className="flex flex-col gap-2 mt-2">
        {hasFilter && (
          <button
            onClick={onClearFilter}
            className="h-10 px-5 rounded-full bg-[#111111] text-white text-[12.5px] font-semibold active:scale-[0.97]"
          >
            Clear filter
          </button>
        )}
        <button
          onClick={onReset}
          className="h-10 px-5 rounded-full bg-white border border-black/[0.06] text-[#111111] text-[12.5px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.97]"
        >
          <RotateCcw size={13} strokeWidth={2.2} />
          Show passed pups again
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Playmates tab
// ---------------------------------------------------------------------------
function PlaymatesTab({ playmates, onTapPet, onMessage, onSchedule, onSwitchToDiscover }) {
  if (!playmates.length) {
    return (
      <div className="px-6 pt-10 flex flex-col items-center text-center gap-2.5">
        <div className="w-12 h-12 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
          <Heart size={16} strokeWidth={2.2} />
        </div>
        <p className="text-[13.5px] font-semibold text-[#111111]">No playmates yet</p>
        <p className="text-[11.5px] text-[#6E6E73] max-w-[260px]">Save pups from Discover to add them to your circle.</p>
        <button
          onClick={onSwitchToDiscover}
          className="mt-1.5 h-9 px-4 rounded-full text-white text-[12px] font-semibold active:scale-[0.97] transition-transform"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          Discover pups nearby
        </button>
      </div>
    );
  }
  const [closest, ...rest] = playmates;
  return (
    <div className="px-4 pt-3 flex flex-col gap-3 pb-6">
      {/* Hero — closest friend */}
      <ClosestFriendHero
        candidate={closest}
        onTap={() => onTapPet(closest)}
        onMessage={onMessage}
        onSchedule={() => onSchedule(closest)}
      />

      {rest.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between mt-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A09A94]">Your circle</p>
            <p className="text-[10px] text-[#A09A94] uppercase tracking-wide">{playmates.length} fylos</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {rest.map((c) => (
              <PlaymateMiniCard
                key={c.id}
                candidate={c}
                onTap={() => onTapPet(c)}
                onSchedule={() => onSchedule(c)}
              />
            ))}
          </div>
        </section>
      )}

      <button
        onClick={onSwitchToDiscover}
        className="self-stretch h-10 rounded-[12px] bg-white border border-black/[0.06] text-[12px] font-semibold text-[#111111] flex items-center justify-center gap-1.5 active:scale-[0.98] mt-1"
      >
        <Sparkles size={12} strokeWidth={2.2} className="text-[#E85D2A]" />
        Find new pups
      </button>
    </div>
  );
}

// Hero card highlighting the most-played-with friend.
function ClosestFriendHero({ candidate, onTap, onMessage, onSchedule }) {
  return (
    <div
      className="rounded-[18px] overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #FFE2D5 0%, #FFF4ED 60%, #FFFFFF 100%)',
        border: '1px solid #FFD4CC',
        boxShadow: '0 4px 14px rgba(232,93,42,0.08)',
      }}
    >
      <button onClick={onTap} className="w-full text-left p-3.5 flex items-center gap-3 active:opacity-95">
        {/* Avatars stacked — you + them */}
        <div className="relative shrink-0">
          <img
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200"
            alt="Leo"
            className="w-12 h-12 rounded-full object-cover"
            style={{ border: '3px solid #FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.10)' }}
          />
          <img
            src={candidate.petPhoto}
            alt={candidate.petName}
            className="absolute -right-3 -bottom-1 w-10 h-10 rounded-full object-cover"
            style={{ border: '3px solid #FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.10)' }}
          />
        </div>
        <div className="flex-1 min-w-0 ml-3">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#7A2F12]/80">Closest friend</p>
          <p className="text-[15px] font-semibold text-[#111111] truncate mt-0.5 tracking-tight">
            Leo & {candidate.petName}
          </p>
          <p className="text-[11px] text-[#6E6058] truncate mt-0.5">
            {candidate.petBreed} · 4 playdates · last met 3d ago
          </p>
        </div>
      </button>
      <div className="grid grid-cols-2 gap-1.5 px-3.5 pb-3.5">
        <button
          onClick={onMessage}
          className="h-9 rounded-[10px] bg-white border border-black/[0.05] text-[11.5px] font-semibold text-[#111111] flex items-center justify-center gap-1 active:scale-[0.97]"
        >
          <MessageCircle size={11} strokeWidth={2.2} />
          Message
        </button>
        <button
          onClick={onSchedule}
          className="h-9 rounded-[10px] text-white text-[11.5px] font-semibold flex items-center justify-center gap-1 active:scale-[0.97]"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          <Calendar size={11} strokeWidth={2.2} />
          Plan again
        </button>
      </div>
    </div>
  );
}

// Compact 2-column card for non-hero playmates.
function PlaymateMiniCard({ candidate, onTap, onSchedule }) {
  return (
    <div className="bg-white rounded-[14px] border border-black/[0.05] p-3 flex flex-col gap-2"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
    >
      <button onClick={onTap} className="w-full text-left flex flex-col gap-2 active:opacity-90">
        <img
          src={candidate.petPhoto}
          alt={candidate.petName}
          className="w-12 h-12 rounded-full object-cover bg-[#F3F3F5]"
        />
        <div className="min-w-0">
          <p className="text-[12.5px] font-semibold text-[#111111] truncate tracking-tight">{candidate.petName}</p>
          <p className="text-[10.5px] text-[#8E8E93] truncate">{candidate.petBreed}</p>
        </div>
      </button>
      <button
        onClick={onSchedule}
        className="h-7 rounded-full text-[10.5px] font-semibold flex items-center justify-center gap-1 active:scale-[0.97]"
        style={{ background: '#FFE9DD', color: '#7A2F12' }}
      >
        <Calendar size={10} strokeWidth={2.2} />
        Plan
      </button>
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
      <div className="px-6 pt-10 flex flex-col items-center text-center gap-2.5">
        <div className="w-12 h-12 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
          <Calendar size={16} strokeWidth={2.2} />
        </div>
        <p className="text-[13.5px] font-semibold text-[#111111]">No playdates scheduled</p>
        <p className="text-[11.5px] text-[#6E6E73] max-w-[260px]">Plan a meet-up from Discover or your Playmates.</p>
        <button
          onClick={onPlanFirst}
          className="mt-1.5 h-9 px-4 rounded-full text-white text-[12px] font-semibold active:scale-[0.97] transition-transform"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          Discover pups
        </button>
      </div>
    );
  }

  // Build a 7-day strip starting from today (mock days populated where we have items).
  const days = useMemo(() => buildWeekStrip(scheduled, pending), [scheduled, pending]);

  return (
    <div className="px-4 pt-3 flex flex-col gap-4 pb-6">
      {/* Week strip — visual rhythm */}
      <WeekStrip days={days} />

      {/* Today hero — only if there's an in-progress / today playdate */}
      {todayItems.length > 0 && (
        <TodayHero item={todayItems[0]} onTap={() => onTap(todayItems[0])} />
      )}

      {wrapUpQueue.length > 0 && (
        <ScheduledSection title="Wrap up · save the memory">
          {wrapUpQueue.map((p) => (
            <WrapUpRow key={p.id} item={p} onWrapUp={() => onWrapUp(p)} />
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

// Mini week ribbon — 7 day cells, today highlighted, dots if there's a playdate.
function buildWeekStrip(scheduled, pending) {
  const today = new Date();
  const todayDow = today.getDay();
  const labels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const events = new Set();
  scheduled.forEach((s) => events.add((s.date || '').toLowerCase()));
  pending.forEach((p) => events.add((p.date || '').toLowerCase()));
  // Build today + next 6 days
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    const dow = d.getDay();
    const num = d.getDate();
    const monthShort = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isToday = i === 0;
    const hasEvent =
      (isToday && events.has('today')) ||
      events.has(monthShort.toLowerCase());
    return { id: i, label: labels[dow], num, isToday, hasEvent };
  });
}

function WeekStrip({ days }) {
  return (
    <div className="flex items-center gap-1 px-1">
      {days.map((d) => (
        <div
          key={d.id}
          className="flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-[10px]"
          style={{
            background: d.isToday ? 'linear-gradient(180deg, #FFE2D5 0%, #FFF1E5 100%)' : 'transparent',
            border: d.isToday ? '1px solid #FFD4CC' : '1px solid transparent',
          }}
        >
          <span className={`text-[9px] font-semibold uppercase tracking-wide ${d.isToday ? 'text-[#7A2F12]' : 'text-[#A09A94]'}`}>
            {d.label}
          </span>
          <span className={`text-[13px] font-semibold tabular-nums ${d.isToday ? 'text-[#111111]' : 'text-[#6E6E73]'}`}>
            {d.num}
          </span>
          <span
            className="w-1 h-1 rounded-full mt-0.5"
            style={{
              background: d.hasEvent ? '#E85D2A' : 'transparent',
            }}
          />
        </div>
      ))}
    </div>
  );
}

// Hero card for today's confirmed playdate.
function TodayHero({ item, onTap }) {
  return (
    <button
      onClick={onTap}
      className="rounded-[18px] overflow-hidden text-left active:scale-[0.99] transition-transform"
      style={{
        background: 'linear-gradient(135deg, #FFE2D5 0%, #FFF4ED 60%, #FFFFFF 100%)',
        border: '1px solid #FFD4CC',
        boxShadow: '0 4px 14px rgba(232,93,42,0.10)',
      }}
    >
      <div className="p-3.5 flex items-start gap-3">
        <div className="shrink-0 flex flex-col items-start">
          <span className="inline-flex items-center gap-1 h-5 px-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.14em] text-white" style={{ background: '#E85D2A' }}>
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            {item.status === 'in-progress' ? 'Live' : 'Today'}
          </span>
          <span className="text-[24px] font-semibold leading-none text-[#1A1614] tabular-nums mt-1.5 tracking-tight">{item.time}</span>
        </div>
        <div className="flex-1 min-w-0 flex items-center gap-2 ml-2">
          <img
            src={item.petPhoto}
            alt={item.petName}
            className="w-11 h-11 rounded-full object-cover"
            style={{ border: '2px solid #FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.10)' }}
          />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#111111] truncate tracking-tight">
              {item.petName}{item.ownerName ? ` · ${item.ownerName}` : ''}
            </p>
            <p className="text-[10.5px] text-[#7A2F12]/85 truncate flex items-center gap-1 mt-0.5">
              <MapPin size={9} strokeWidth={2.1} />
              {item.placeName}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function ScheduledSection({ title, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A09A94]">{title}</p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function ScheduledCard({ item, onTap }) {
  return (
    <button
      onClick={onTap}
      className="bg-white rounded-[14px] border border-black/[0.05] p-3 flex items-center gap-3 text-left active:opacity-90 active:scale-[0.99] transition-transform"
    >
      <div className="shrink-0 w-[46px] flex flex-col items-center text-center">
        <span className="text-[9px] font-semibold uppercase tracking-wide text-[#A09A94]">{item.date}</span>
        <span className="text-[14px] font-semibold text-[#111111] tabular-nums tracking-tight">{item.time}</span>
      </div>
      <img src={item.petPhoto} alt="" className="w-8 h-8 rounded-full object-cover bg-[#F3F3F5] shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold text-[#111111] truncate tracking-tight">
          {item.petName}{item.ownerName ? ` · ${item.ownerName}` : ''}
        </p>
        <p className="text-[10.5px] text-[#8E8E93] truncate flex items-center gap-1">
          <MapPin size={9} strokeWidth={2} className="text-[#A6A6AC]" />
          {item.placeName}
        </p>
      </div>
      <ChevronRight size={14} color="#B6B6BC" className="shrink-0" />
    </button>
  );
}

function PendingCard({ item, onAccept, onDecline }) {
  const isReceived = item.direction === 'received' || !item.direction;
  return (
    <div className="bg-white rounded-[14px] border border-black/[0.05] p-3">
      <div className="flex items-center gap-3">
        <img src={item.petPhoto} alt="" className="w-8 h-8 rounded-full object-cover bg-[#F3F3F5]" />
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold text-[#111111] truncate tracking-tight">
            {isReceived ? `${item.petName} invited ${item.hostPetName ? '' : 'you'}` : `Sent to ${item.petName}`}
          </p>
          <p className="text-[10.5px] text-[#8E8E93] truncate">
            {item.date} · {item.time} · {item.placeName}
          </p>
        </div>
      </div>
      {isReceived && (
        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
          <button
            onClick={onDecline}
            className="h-8 rounded-[10px] bg-[#F7F7F8] border border-black/[0.05] text-[11px] font-semibold text-[#111111] active:scale-[0.98]"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="h-8 rounded-[10px] text-white text-[11px] font-semibold flex items-center justify-center gap-1 active:scale-[0.98]"
            style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
          >
            <Check size={11} strokeWidth={2.4} />
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
      className="bg-[#FFE9DD] rounded-[14px] border border-[#FFD4CC] p-3 flex items-center gap-2.5 text-left active:scale-[0.99] transition-transform"
    >
      <img src={item.petPhoto} alt="" className="w-8 h-8 rounded-full object-cover bg-[#F3F3F5]" />
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold text-[#7A2F12] tracking-tight">How was it with {item.petName}?</p>
        <p className="text-[10.5px] text-[#7A2F12]/75 truncate">
          {item.date} · {item.placeName}
        </p>
      </div>
      <span className="shrink-0 text-[10.5px] font-semibold text-[#E85D2A] flex items-center gap-0.5">
        Wrap up <ArrowRight size={11} strokeWidth={2.2} />
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
// ---------------------------------------------------------------------------
// MatchOverlay — celebrates a mutual like (Bobby & Luna · same wavelength)
// ---------------------------------------------------------------------------
function MatchOverlay({ candidate, myName, myPhoto, onClose, onSayHi, onPlanPlaydate }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  const archetype = ARCHETYPE_BY_ID[candidate.archetypeId] || ARCHETYPES[0];
  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-[10001] flex items-center justify-center px-6"
      style={{ background: 'linear-gradient(180deg, rgba(232,93,42,0.96) 0%, rgba(232,93,42,0.86) 100%)', backdropFilter: 'blur(8px)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] flex flex-col items-center text-center"
        style={{ animation: 'matchPop 360ms cubic-bezier(0.34, 1.56, 0.64, 1)' }}
      >
        <style>{`
          @keyframes matchPop {
            0% { transform: scale(0.85); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes matchAvatarLeft {
            0% { transform: translateX(20px) rotate(-6deg); opacity: 0; }
            100% { transform: translateX(0) rotate(-6deg); opacity: 1; }
          }
          @keyframes matchAvatarRight {
            0% { transform: translateX(-20px) rotate(6deg); opacity: 0; }
            100% { transform: translateX(0) rotate(6deg); opacity: 1; }
          }
        `}</style>

        {/* Avatars */}
        <div className="relative h-[140px] w-[200px] mb-4">
          <img
            src={myPhoto}
            alt={myName}
            className="absolute left-0 top-2 w-[120px] h-[120px] rounded-full object-cover bg-white"
            style={{ border: '4px solid #FFFFFF', animation: 'matchAvatarLeft 480ms cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
          />
          <img
            src={candidate.petPhoto}
            alt={candidate.petName}
            className="absolute right-0 top-2 w-[120px] h-[120px] rounded-full object-cover bg-white"
            style={{ border: '4px solid #FFFFFF', animation: 'matchAvatarRight 480ms cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
          />
          {/* Sparkle */}
          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white flex items-center justify-center" style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}>
            <Sparkles size={20} strokeWidth={2.2} className="text-[#E85D2A]" />
          </div>
        </div>

        {/* Headline */}
        <p className="text-[14px] uppercase tracking-[0.18em] font-semibold text-white/85">A new Fylos friend</p>
        <h2 className="text-[26px] font-semibold text-white mt-1.5 leading-tight">
          {myName} & {candidate.petName}
        </h2>
        <p className="text-[14px] text-white/90 mt-1">same wavelength</p>
        <p className="text-[12.5px] text-white/80 mt-2 max-w-[260px]">
          You both said yes. {candidate.reasons[0] || 'Looks like a real fit'}.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-2 w-full mt-6">
          <button
            onClick={onSayHi}
            className="h-12 rounded-[14px] bg-white text-[#E85D2A] font-semibold text-[14px] flex items-center justify-center gap-1.5 active:scale-[0.98]"
            style={{ boxShadow: '0 6px 18px rgba(0,0,0,0.18)' }}
          >
            <MessageCircle size={15} strokeWidth={2.4} />
            Say hi
          </button>
          <button
            onClick={onPlanPlaydate}
            className="h-12 rounded-[14px] bg-white/15 backdrop-blur text-white font-semibold text-[14px] flex items-center justify-center gap-1.5 active:scale-[0.98] border border-white/30"
          >
            <Calendar size={15} strokeWidth={2.4} />
            Plan a playdate
          </button>
          <button
            onClick={onClose}
            className="h-10 rounded-[12px] text-white/80 text-[12.5px] font-semibold active:opacity-70"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ChatSheet — say-hi flow with 4 icebreaker chips + free text + photo attach
// ---------------------------------------------------------------------------
const ICEBREAKERS = [
  "Hi! {name} would love to meet.",
  "Free this weekend?",
  "Where's your usual walk?",
  "What's their perfect day?",
];

function ChatSheet({ candidate, onClose, onSend }) {
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState([]);
  const [attaching, setAttaching] = useState(false);
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  const sendText = (text) => {
    if (!text.trim()) return;
    setThread((prev) => [...prev, { id: Date.now(), from: 'me', text: text.trim(), kind: 'text' }]);
    setDraft('');
    // Scripted reply for realism
    setTimeout(() => {
      setThread((prev) => [...prev, { id: Date.now() + 1, from: 'them', text: scriptedReply(candidate, text), kind: 'text' }]);
    }, 900);
  };
  const submitFinal = () => {
    onSend && onSend(draft || 'Said hi via icebreaker');
  };
  const sendPhotoStub = () => {
    setThread((prev) => [...prev, { id: Date.now(), from: 'me', kind: 'photo', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=70' }]);
    setAttaching(false);
  };
  return (
    <div
      onClick={onClose}
      className="absolute inset-0 z-[10000] flex items-end"
      style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(2px)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white rounded-t-[24px] shadow-[0_-8px_40px_rgba(0,0,0,0.18)] flex flex-col"
        style={{ height: '88%' }}
      >
        {/* Header */}
        <div className="flex flex-col items-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
        </div>
        <div className="flex items-center gap-3 px-5 py-3 border-b border-black/[0.04]">
          <img src={candidate.petPhoto} alt="" className="w-10 h-10 rounded-full object-cover bg-[#F3F3F5]" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#111111] truncate">{candidate.petName}</p>
            <p className="text-[11.5px] text-[#8E8E93] truncate">{candidate.ownerName} · matched just now</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#F7F5F2] border border-[#EDE8E2] flex items-center justify-center text-[#111111] active:scale-[0.94]"
          >
            <X size={15} strokeWidth={2.2} />
          </button>
        </div>

        {/* Thread */}
        <div className="flex-1 overflow-y-auto wallet-scroll px-5 py-4 flex flex-col gap-2">
          {thread.length === 0 ? (
            <div className="flex flex-col items-center text-center gap-2 mt-4">
              <div className="w-12 h-12 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
                <MessageCircle size={18} strokeWidth={2.2} />
              </div>
              <p className="text-[13.5px] font-semibold text-[#111111]">Break the ice</p>
              <p className="text-[12px] text-[#6E6E73] max-w-[260px]">Send a quick hello — pick an icebreaker below or write your own.</p>
            </div>
          ) : (
            thread.map((m) => (
              <ChatBubble key={m.id} message={m} candidatePhoto={candidate.petPhoto} />
            ))
          )}
        </div>

        {/* Icebreaker chips */}
        {thread.length === 0 && (
          <div className="px-5 pb-2 flex gap-2 overflow-x-auto custom-scrollbar">
            {ICEBREAKERS.map((tpl, i) => {
              const text = tpl.replace('{name}', candidate.petName);
              return (
                <button
                  key={i}
                  onClick={() => sendText(text)}
                  className="shrink-0 h-8 px-3 rounded-full text-[12px] font-semibold bg-[#FFE9DD] border border-[#FFD4CC] text-[#7A2F12] active:scale-[0.97]"
                >
                  {text}
                </button>
              );
            })}
          </div>
        )}

        {/* Composer */}
        <div className="px-5 pb-5 pt-2 border-t border-black/[0.04] flex items-center gap-2">
          <button
            onClick={() => setAttaching((a) => !a)}
            aria-label="Attach"
            className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors active:scale-[0.94] ${
              attaching ? 'bg-[#FFE9DD] border-[#FFD4CC] text-[#E85D2A]' : 'bg-white border-black/[0.06] text-[#6E6E73]'
            }`}
          >
            <ImageIcon size={15} strokeWidth={2.2} />
          </button>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { sendText(draft); } }}
            placeholder="Message…"
            className="flex-1 h-10 rounded-full px-4 outline-none text-[13.5px]"
            style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}
          />
          <button
            onClick={() => sendText(draft)}
            disabled={!draft.trim() && thread.length === 0}
            aria-label="Send"
            className="w-10 h-10 rounded-full text-white flex items-center justify-center active:scale-[0.94]"
            style={{
              background: draft.trim() || thread.length > 0 ? 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' : '#EDE8E2',
              color: draft.trim() || thread.length > 0 ? '#FFF' : '#A09A94',
            }}
          >
            <Send size={15} strokeWidth={2.4} />
          </button>
        </div>
        {attaching && (
          <div className="px-5 pb-4 -mt-1 flex gap-2">
            <button
              onClick={sendPhotoStub}
              className="h-9 px-3 rounded-full bg-[#F7F7F8] border border-black/[0.06] text-[12px] font-semibold text-[#111111] flex items-center gap-1.5 active:scale-[0.97]"
            >
              <Camera size={13} strokeWidth={2.2} />
              From gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatBubble({ message, candidatePhoto }) {
  const isMe = message.from === 'me';
  return (
    <div className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && <img src={candidatePhoto} alt="" className="w-7 h-7 rounded-full object-cover bg-[#F3F3F5]" />}
      <div
        className="max-w-[78%] rounded-[18px] px-3 py-2"
        style={{
          background: isMe ? '#E85D2A' : '#F2F2F7',
          color: isMe ? '#FFFFFF' : '#111111',
          borderBottomRightRadius: isMe ? 6 : 18,
          borderBottomLeftRadius: isMe ? 18 : 6,
        }}
      >
        {message.kind === 'photo' ? (
          <img src={message.url} alt="" className="rounded-[12px] max-w-[200px] max-h-[200px] object-cover" />
        ) : (
          <p className="text-[13.5px] leading-snug">{message.text}</p>
        )}
      </div>
    </div>
  );
}

function scriptedReply(candidate, userText) {
  const t = userText.toLowerCase();
  if (t.includes('weekend') || t.includes('free')) return `Saturday morning works for ${candidate.petName} — Zürichhorn?`;
  if (t.includes('walk')) return 'Usually Seefeld around 8am. Big fan of long sniffs.';
  if (t.includes('day')) return 'Morning run, nap on the couch, evening park sniff. The classic.';
  return `${candidate.petName} would love that.`;
}

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
