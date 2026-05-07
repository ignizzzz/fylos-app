import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Heart, MessageCircle, MapPin, MoreHorizontal, Sparkles, Calendar, Plus,
  Camera, ChevronLeft, ChevronRight, Search, Bookmark, BookmarkCheck, Send, X, Check,
  Star, Clock, Compass, Coffee, Trees, Droplets, Globe, Users as UsersIcon,
  Lock, User, ShieldCheck, Syringe, PawPrint, Award, UserPlus, UserCheck,
  UserMinus, CalendarDays, Footprints, TreePine, GraduationCap, Flag, Minus,
} from 'lucide-react';
import {
  ACTIVITY_FRIEND_DATA,
  ACTIVITY_SOCIAL_FEED,
  MOCK_PLACES,
  PLACE_CATEGORIES,
} from '../../../data/social';
import { PlacesMapPreview, AmenityTag, CategoryBadge } from './PlacesPreview';

/* =========================================================================
   FYLOS · Social · Network mode (clean rebuild)
   Zone S (Airbnb-airy storytelling) — NOT Tinder.
   3 sub-tabs: Feed · Friends · Discover

   Drop-in replacement for the legacy FriendsActivityContainer. Same prop
   contract so the unified shell can swap the component without further
   plumbing changes.
   ========================================================================= */

const SUB_TABS = [
  { id: 'feed', label: 'Feed' },
  { id: 'friends', label: 'Friends' },
  { id: 'discover', label: 'Discover' },
];

export default function NetworkMode({
  isVisible,
  setGlobalBadge,
  selectedPetId,
  playdateEvents = [],
  onOpenPlaydates,
  pendingView,
}) {
  const [subTab, setSubTab] = useState('feed');
  const [feedFilter, setFeedFilter] = useState('all'); // 'all' | 'photos' | 'checkins'
  const [feedPosts, setFeedPosts] = useState(ACTIVITY_SOCIAL_FEED);
  const [friends, setFriends] = useState(ACTIVITY_FRIEND_DATA.friends);
  const [receivedReqs, setReceivedReqs] = useState(ACTIVITY_FRIEND_DATA.receivedRequests);
  const [suggestions, setSuggestions] = useState(ACTIVITY_FRIEND_DATA.suggestions);
  const [savedSuggestionIds, setSavedSuggestionIds] = useState(() => new Set());
  const [activePost, setActivePost] = useState(null);
  const [activeProfile, setActiveProfile] = useState(null);
  const [activePlace, setActivePlace] = useState(null);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [savedPlaceIds, setSavedPlaceIds] = useState(
    () => new Set(['place_zurichhorn', 'place_cafe_baer', 'place_trail_uetliberg'])
  );
  const [toast, setToast] = useState(null);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1600);
  };

  // Surface playdate events scheduled in-tab as system posts at the top of feed.
  const augmentedPosts = useMemo(() => {
    if (!playdateEvents.length) return feedPosts;
    return [...playdateEvents, ...feedPosts];
  }, [feedPosts, playdateEvents]);

  // Filter feed by selectedPetId (Pack-level pet selector) and post-type chips.
  const visiblePosts = useMemo(() => {
    let list = augmentedPosts;
    if (selectedPetId) {
      list = list.filter((p) => !p.contextPetIds || p.contextPetIds.includes(selectedPetId));
    }
    if (feedFilter !== 'all') {
      list = list.filter((p) => {
        if (feedFilter === 'photos') return p.type === 'photo';
        if (feedFilter === 'checkins') return p.type === 'check-in' || p.type === 'walk-together';
        return true;
      });
    }
    return list;
  }, [augmentedPosts, feedFilter, selectedPetId]);

  // Bubble up a "new requests / activity" indicator for the parent tab badge.
  useEffect(() => {
    setGlobalBadge && setGlobalBadge(receivedReqs.length > 0);
  }, [receivedReqs, setGlobalBadge]);

  // Allow parent to deep-link into a specific sub-view.
  useEffect(() => {
    if (!pendingView || !isVisible) return;
    if (pendingView === 'requests') setSubTab('friends');
    else if (pendingView === 'discover' || pendingView === 'fylos') setSubTab('discover');
  }, [pendingView, isVisible]);

  const toggleLike = (postId) => {
    setFeedPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, likedByMe: !p.likedByMe, likesCount: (p.likesCount || 0) + (p.likedByMe ? -1 : 1) }
          : p
      )
    );
  };

  const addComment = (postId, text) => {
    if (!text.trim()) return;
    const c = { id: `comment_${Date.now()}`, author: 'You', petName: 'Leo', avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150', text: text.trim(), timeAgo: 'Just now' };
    setFeedPosts((prev) =>
      prev.map((p) => p.id === postId ? { ...p, comments: [...(p.comments || []), c] } : p)
    );
    // Update activePost state too so the open sheet reflects immediately.
    setActivePost((curr) => curr && curr.id === postId ? { ...curr, comments: [...(curr.comments || []), c] } : curr);
  };

  const changeVisibility = (postId, visibility) => {
    setFeedPosts((prev) => prev.map((p) => p.id === postId ? { ...p, visibility } : p));
    setActivePost((curr) => curr && curr.id === postId ? { ...curr, visibility } : curr);
    showToast(`Visibility · ${visibility}`);
  };

  const acceptRequest = (req) => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(8);
    setReceivedReqs((prev) => prev.filter((r) => r.id !== req.id));
    setFriends((prev) => [
      {
        id: `friendship_new_${Date.now()}`,
        userId: req.fromUserId,
        petId: req.fromPetId,
        petName: req.fromPetName,
        petBreed: req.fromPetBreed,
        petPhoto: req.fromPetPhoto,
        ownerName: req.ownerName,
        distance: req.distance || 1.5,
        friendsSince: 'Just now',
        lastActive: 'Just now',
        age: 3,
        contextPetIds: req.contextPetIds || ['p1'],
      },
      ...prev,
    ]);
    showToast(`Connected with ${req.fromPetName}`);
  };

  const declineRequest = (id) => setReceivedReqs((prev) => prev.filter((r) => r.id !== id));

  const sendFriendRequest = (suggestion) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== suggestion.id));
    showToast(`Request sent to ${suggestion.petName}`);
  };

  const togglePlaceSave = (placeId) => {
    setSavedPlaceIds((prev) => {
      const next = new Set(prev);
      next.has(placeId) ? next.delete(placeId) : next.add(placeId);
      return next;
    });
  };

  const submitPost = ({ text, visibility }) => {
    const newPost = {
      id: `post_${Date.now()}`,
      ownerName: 'You',
      petName: 'Leo',
      avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150',
      timeAgo: 'Just now',
      location: null,
      type: 'check-in',
      summary: text,
      photoUrl: null,
      likesCount: 0,
      likedByMe: false,
      likersPreview: '',
      likers: [],
      comments: [],
      visibility: visibility || 'friends',
      contextPetIds: selectedPetId ? [selectedPetId] : ['p1'],
    };
    setFeedPosts((prev) => [newPost, ...prev]);
    setCreatePostOpen(false);
    showToast(`Posted · ${visibility || 'friends'}`);
  };

  const totalReceived = receivedReqs.length;

  return (
    <div className={`${isVisible ? 'block' : 'hidden'} bg-[#F9F9FB] min-h-screen pb-32`}>
      <div className="px-5 pt-2">
        <SubTabs
          tab={subTab}
          setTab={setSubTab}
          badges={{ friends: totalReceived }}
        />
      </div>

      {subTab === 'feed' && (
        <FeedView
          posts={visiblePosts}
          filter={feedFilter}
          setFilter={setFeedFilter}
          onTapPost={setActivePost}
          onToggleLike={toggleLike}
          onCreate={() => setCreatePostOpen(true)}
          places={MOCK_PLACES}
          savedPlaceIds={savedPlaceIds}
          onTapPlace={setActivePlace}
          onTogglePlaceSave={togglePlaceSave}
          onTapOwner={(post) => {
            const friend = friends.find((f) => f.petName === post.petName);
            setActiveProfile(friend || { petName: post.petName, petPhoto: post.avatar, ownerName: post.ownerName });
          }}
        />
      )}
      {subTab === 'friends' && (
        <FriendsView
          friends={friends}
          requests={receivedReqs}
          onTapFriend={setActiveProfile}
          onAcceptRequest={acceptRequest}
          onDeclineRequest={declineRequest}
          onPlanPlaydate={() => onOpenPlaydates && onOpenPlaydates('discover')}
        />
      )}
      {subTab === 'discover' && (
        <DiscoverView
          suggestions={suggestions}
          savedIds={savedSuggestionIds}
          onSave={(s) => {
            setSavedSuggestionIds((prev) => {
              const next = new Set(prev);
              next.has(s.id) ? next.delete(s.id) : next.add(s.id);
              return next;
            });
            showToast(savedSuggestionIds.has(s.id) ? `Removed ${s.petName}` : `Saved ${s.petName}`);
          }}
          onSend={sendFriendRequest}
          onTap={setActiveProfile}
        />
      )}

      {activePost && (
        <PostDetailSheet
          post={activePost}
          onClose={() => setActivePost(null)}
          onToggleLike={() => toggleLike(activePost.id)}
          onComment={(text) => addComment(activePost.id, text)}
          onChangeVisibility={(v) => changeVisibility(activePost.id, v)}
        />
      )}
      {activeProfile && (
        <PeerProfilePage
          profile={activeProfile}
          onClose={() => setActiveProfile(null)}
          onPlanPlaydate={() => {
            setActiveProfile(null);
            onOpenPlaydates && onOpenPlaydates('discover');
          }}
        />
      )}
      {activePlace && (
        <PlacePeekSheet
          place={activePlace}
          saved={savedPlaceIds.has(activePlace.id)}
          onClose={() => setActivePlace(null)}
          onToggleSave={() => togglePlaceSave(activePlace.id)}
        />
      )}
      {createPostOpen && (
        <CreatePostSheet
          onClose={() => setCreatePostOpen(false)}
          onSubmit={submitPost}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-tab pill switcher
// ---------------------------------------------------------------------------
function SubTabs({ tab, setTab, badges = {} }) {
  const idx = SUB_TABS.findIndex((t) => t.id === tab);
  return (
    <div className="relative bg-[#F2F2F7] rounded-full p-1 flex">
      <div
        aria-hidden
        className="absolute top-1 bottom-1 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-[260ms]"
        style={{
          width: `calc(${100 / SUB_TABS.length}% - 8px)`,
          left: `calc(${(100 / SUB_TABS.length) * idx}% + 4px)`,
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      />
      {SUB_TABS.map((t) => {
        const active = tab === t.id;
        const badge = badges[t.id];
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative z-10 flex-1 h-9 text-[13px] font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              active ? 'text-[#111111]' : 'text-[#8E8E93]'
            }`}
          >
            {t.label}
            {badge > 0 && (
              <span
                className="inline-flex items-center justify-center text-[9.5px] font-bold rounded-full px-1.5"
                style={{ background: '#E85D2A', color: '#FFF', minWidth: 16, height: 16 }}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feed view — Airbnb-airy posts + nearby places preview
// ---------------------------------------------------------------------------
function FeedView({ posts, filter, setFilter, onTapPost, onToggleLike, onCreate, places, savedPlaceIds, onTapPlace, onTogglePlaceSave, onTapOwner }) {
  const filterChips = [
    { id: 'all', label: 'All' },
    { id: 'photos', label: 'Photos' },
    { id: 'checkins', label: 'Check-ins' },
  ];
  return (
    <div className="px-5 pt-4 flex flex-col gap-4">
      <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar -mx-1 px-1 pb-1">
        {filterChips.map((c) => {
          const active = filter === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              className={`shrink-0 h-8 px-3 rounded-full text-[12px] font-semibold border transition-colors active:scale-[0.97] ${
                active
                  ? 'bg-[#111111] text-white border-transparent'
                  : 'bg-white text-[#6E6E73] border-black/[0.06]'
              }`}
            >
              {c.label}
            </button>
          );
        })}
        <button
          onClick={onCreate}
          className="ml-auto shrink-0 h-8 px-3 rounded-full text-[12px] font-semibold flex items-center gap-1.5 active:scale-[0.97]"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)', color: '#FFF' }}
        >
          <Plus size={13} strokeWidth={2.4} />
          Share
        </button>
      </div>

      <NearbyPlacesStrip places={places} savedIds={savedPlaceIds} onTap={onTapPlace} onToggleSave={onTogglePlaceSave} />

      {posts.length === 0 ? (
        <FeedEmpty onClear={() => setFilter('all')} />
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onTap={() => onTapPost(p)} onToggleLike={() => onToggleLike(p.id)} onTapOwner={() => onTapOwner && onTapOwner(p)} />
          ))}
        </div>
      )}
    </div>
  );
}

// Small helpers for PostCard
function WithPetsAvatars({ pets }) {
  return (
    <span className="inline-flex -space-x-1.5 shrink-0 align-middle ml-1">
      {pets.slice(0, 2).map((p) => (
        <img
          key={p.id}
          src={p.avatar}
          alt={p.name}
          className="w-[18px] h-[18px] rounded-full object-cover bg-[#F3F3F5] border border-white"
        />
      ))}
    </span>
  );
}

const POST_TYPE_CONFIG = {
  'photo':          { Icon: Camera,  label: null },
  'check-in':       { Icon: MapPin,  label: null },
  'walk-together':  { Icon: Trees,   label: null },
};

function PostCard({ post, onTap, onToggleLike, onTapOwner }) {
  const isSystem = post.type === 'friend-update' || post.type === 'playdate-event';
  const commentCount = (post.comments || []).length;
  const typeConf = POST_TYPE_CONFIG[post.type];

  // System / friend-update: slim timeline pill
  if (isSystem) {
    return (
      <button
        onClick={onTap}
        className="flex items-center gap-3 px-1 py-0.5 active:opacity-70 transition-opacity"
      >
        <div className="w-7 h-7 rounded-full bg-[#F3EFEB] border border-[#EDE8E2] flex items-center justify-center shrink-0">
          <Sparkles size={12} strokeWidth={2.2} className="text-[#C4916A]" />
        </div>
        <p className="text-[12.5px] text-[#6E6E73] leading-snug">
          {post.summary}
          <span className="text-[#B6B6BC]"> · {post.timeAgo}</span>
        </p>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-[20px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden">

      {/* Header row — tapping opens the owner's profile */}
      <button onClick={onTapOwner} className="w-full flex items-center gap-2.5 px-4 pt-3.5 pb-2 text-left active:opacity-75 transition-opacity">
        <img
          src={post.avatar}
          alt=""
          className="w-9 h-9 rounded-full object-cover bg-[#F3F3F5] shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold text-[#111111] leading-none">
            {post.ownerName}
            {post.withPets && post.withPets.length > 0 && (
              <WithPetsAvatars pets={post.withPets} />
            )}
          </p>
          <p className="text-[11.5px] text-[#A6A6AC] mt-[3px] flex items-center gap-1.5">
            {post.petName !== 'System' && (
              <><span className="font-medium text-[#8E8E93]">{post.petName}</span><span>·</span></>
            )}
            <span>{post.timeAgo}</span>
            <VisibilityChip visibility={post.visibility} />
          </p>
        </div>
      </button>

      {/* Content — tapping opens the post detail */}
      <button onClick={onTap} className="w-full text-left active:opacity-95">
        {/* Photo — full bleed */}
        {post.photoUrl && (
          <div className="relative overflow-hidden" style={{ height: 210 }}>
            <img
              src={post.photoUrl}
              alt=""
              className="w-full h-full object-cover bg-[#F3F3F5]"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0) 55%)' }}
            />
            {post.location && typeConf && (
              <div className="absolute bottom-3 left-3">
                <span
                  className="inline-flex items-center gap-1 h-[22px] px-2.5 rounded-full text-[11px] font-semibold"
                  style={{
                    background: 'rgba(17,17,17,0.68)',
                    color: '#FFF',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  <typeConf.Icon size={10} strokeWidth={2.2} />
                  {post.location}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Non-photo location strip */}
        {!post.photoUrl && post.location && (
          <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 rounded-[10px]" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
            {typeConf
              ? <typeConf.Icon size={13} className="text-[#C4916A] shrink-0" strokeWidth={2} />
              : <MapPin size={13} className="text-[#C4916A] shrink-0" strokeWidth={2} />}
            <p className="text-[12.5px] text-[#6E6058] font-medium truncate">{post.location}</p>
          </div>
        )}

        {/* Caption */}
        {post.summary && (
          <p className="px-4 pb-3.5 text-[13px] text-[#111111] leading-snug">{post.summary}</p>
        )}
        {!post.summary && !post.photoUrl && post.type === 'check-in' && (
          <p className="px-4 pb-3.5 text-[13px] text-[#6E6E73] leading-snug">
            {post.location ? `Checked in at ${post.location}` : 'Checked in'}
          </p>
        )}
        {post.photoUrl && !post.summary && (
          <div className="pb-1" />
        )}
      </button>

      {/* Action bar */}
      <div className="flex items-center justify-between px-4 pb-3.5 pt-2.5 border-t border-black/[0.04]">
        <div className="min-w-0 flex flex-col gap-0.5">
          {post.likesCount > 0 ? (
            <p className="text-[12px] font-semibold text-[#111111] truncate">
              {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
              {post.likersPreview && (
                <span className="font-normal text-[#A6A6AC]"> · {post.likersPreview}</span>
              )}
            </p>
          ) : (
            <p className="text-[12px] text-[#C4B8AF]">Be the first to like</p>
          )}
          {commentCount > 0 && (
            <button onClick={onTap} className="text-[11px] text-[#8E8E93] text-left active:opacity-70">
              {commentCount === 1 ? '1 comment' : `${commentCount} comments`}
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onTap}
            aria-label="Comment"
            className="h-8 px-2.5 rounded-[10px] flex items-center justify-center gap-1 text-[12px] font-semibold active:scale-[0.97] bg-[#F3F3F6] text-[#6E6E73]"
          >
            <MessageCircle size={13} strokeWidth={2.2} />
            {commentCount > 0 && <span className="text-[11px]">{commentCount}</span>}
          </button>
          <button
            onClick={onToggleLike}
            aria-label={post.likedByMe ? 'Unlike' : 'Like'}
            className={`h-8 px-3 rounded-[10px] flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition-colors active:scale-[0.97] ${
              post.likedByMe ? 'bg-[#FFE9DD] text-[#E85D2A]' : 'bg-[#F3F3F6] text-[#6E6E73]'
            }`}
          >
            <Heart size={13} strokeWidth={2.2} fill={post.likedByMe ? 'currentColor' : 'none'} />
            {post.likedByMe ? 'Liked' : 'Like'}
          </button>
        </div>
      </div>
    </div>
  );
}

function VisibilityChip({ visibility }) {
  const conf = {
    public: { Icon: Globe, label: 'Public' },
    friends: { Icon: UsersIcon, label: 'Friends' },
    private: { Icon: Lock, label: 'Private' },
  }[visibility || 'friends'] || null;
  if (!conf) return null;
  const { Icon, label } = conf;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Visibility: ${label}`}>
      <Icon size={10} strokeWidth={2.2} className="text-[#A6A6AC]" />
    </span>
  );
}

function FeedEmpty({ onClear }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 py-10 px-6">
      <div className="w-14 h-14 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
        <Sparkles size={20} strokeWidth={2.2} />
      </div>
      <p className="text-[15px] font-semibold text-[#111111]">Nothing here yet</p>
      <p className="text-[13px] text-[#6E6E73] max-w-[260px]">Switch the filter back to All to see all your network's moments.</p>
      <button
        onClick={onClear}
        className="mt-1 h-9 px-4 rounded-full bg-[#111111] text-white text-[12.5px] font-semibold active:scale-[0.97]"
      >
        Clear filter
      </button>
    </div>
  );
}

function NearbyPlacesStrip({ places, savedIds, onTap, onToggleSave }) {
  const top = places.slice(0, 6);
  return (
    <section className="flex flex-col gap-3 mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93]">Places nearby</p>
        <p className="text-[11.5px] text-[#8E8E93]">{savedIds.size} saved</p>
      </div>
      <div className="rounded-[20px] overflow-hidden border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] bg-white">
        <PlacesMapPreview places={top} height={150} />
        <div className="p-3 flex flex-col gap-2">
          {top.slice(0, 3).map((p) => {
            const saved = savedIds.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => onTap(p)}
                className="flex items-center gap-3 px-2 py-2 rounded-[12px] active:bg-[#F7F5F2] transition-colors text-left"
              >
                <CategoryBadge category={p.category} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12.5px] font-semibold text-[#111111] truncate">{p.name}</p>
                  <p className="text-[11.5px] text-[#8E8E93] truncate">{p.distance.toFixed(1)} km · {p.vibe}</p>
                </div>
                <span
                  onClick={(e) => { e.stopPropagation(); onToggleSave(p.id); }}
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                    saved ? 'text-[#E85D2A] bg-[#FFE9DD]' : 'text-[#8E8E93] bg-[#F7F7F8]'
                  }`}
                >
                  {saved ? <BookmarkCheck size={14} strokeWidth={2.2} /> : <Bookmark size={14} strokeWidth={2.2} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
function SectionHeader({ label }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#A6A6AC]">{label}</p>
  );
}

function EmptyCard({ icon, title, body }) {
  return (
    <div className="rounded-[16px] bg-white border border-black/[0.04] p-6 flex flex-col items-center text-center gap-2">
      <div className="w-12 h-12 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
        {icon}
      </div>
      <p className="text-[14px] font-semibold text-[#111111]">{title}</p>
      {body && <p className="text-[12px] text-[#6E6E73]">{body}</p>}
    </div>
  );
}

const RECENTLY_ACTIVE_LABELS = new Set(['Just now', '1h ago', '2h ago', '3h ago', '4h ago', '5h ago']);

// ---------------------------------------------------------------------------
// Friends view — search + recently active strip + connections + requests
// ---------------------------------------------------------------------------
function FriendsView({ friends, requests, onTapFriend, onAcceptRequest, onDeclineRequest, onPlanPlaydate }) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(false);
  const SHOW_LIMIT = 4;
  const recentlyActive = friends.filter((f) => RECENTLY_ACTIVE_LABELS.has(f.lastActive));
  const filtered = search
    ? friends.filter(
        (f) =>
          f.petName.toLowerCase().includes(search.toLowerCase()) ||
          f.petBreed.toLowerCase().includes(search.toLowerCase())
      )
    : friends;

  return (
    <div className="pt-4 flex flex-col gap-5">
      {/* Search */}
      <div className="px-5">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B6B6BC] pointer-events-none"
            strokeWidth={2}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search friends…"
            className="w-full h-10 pl-10 pr-4 rounded-full outline-none text-[13px] bg-white border border-black/[0.06] text-[#111111] placeholder-[#B6B6BC]"
          />
        </div>
      </div>

      {/* Incoming requests */}
      {requests.length > 0 && !search && (
        <section className="flex flex-col gap-2.5 px-5">
          <SectionHeader label={`${requests.length} connection request${requests.length > 1 ? 's' : ''}`} />
          <div className="flex flex-col gap-2">
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                onAccept={() => onAcceptRequest(req)}
                onDecline={() => onDeclineRequest(req.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Recently active horizontal scroll */}
      {recentlyActive.length > 0 && !search && (
        <section className="flex flex-col gap-2.5">
          <div className="px-5">
            <SectionHeader label="Active now" />
          </div>
          <div className="flex gap-4 overflow-x-auto px-5 pb-0.5 no-scrollbar">
            {recentlyActive.map((f) => (
              <button
                key={f.id}
                onClick={() => onTapFriend(f)}
                className="flex flex-col items-center gap-1.5 shrink-0 active:opacity-75 transition-opacity"
              >
                <div className="relative">
                  <img
                    src={f.petPhoto}
                    alt=""
                    className="w-[58px] h-[58px] rounded-full object-cover bg-[#F3F3F5] border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                  />
                  <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#34C759] border-2 border-white" />
                </div>
                <p className="text-[11px] font-medium text-[#3C3C43] max-w-[58px] truncate text-center">
                  {f.petName}
                </p>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Friends list */}
      <section className="flex flex-col gap-2.5 px-5 pb-2">
        <div className="flex items-center justify-between">
          <SectionHeader label={`${filtered.length} friend${filtered.length !== 1 ? 's' : ''}`} />
          {!search && (
            <button
              onClick={onPlanPlaydate}
              className="text-[11.5px] font-semibold text-[#E85D2A] flex items-center gap-0.5 active:opacity-70"
            >
              Plan a playdate <ChevronRight size={12} strokeWidth={2.4} />
            </button>
          )}
        </div>
        {filtered.length === 0 ? (
          <EmptyCard
            icon={<Sparkles size={18} strokeWidth={2.2} />}
            title={search ? 'No matches' : 'No friends yet'}
            body={search ? 'Try a different name or breed.' : 'Try the Discover tab to find pups nearby.'}
          />
        ) : (() => {
          const visible = search || expanded ? filtered : filtered.slice(0, SHOW_LIMIT);
          const hidden = !search && !expanded ? filtered.length - SHOW_LIMIT : 0;
          return (
            <>
              <div className="flex flex-col gap-2">
                {visible.map((f) => (
                  <FriendCard key={f.id} friend={f} onTap={() => onTapFriend(f)} />
                ))}
              </div>
              {hidden > 0 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="w-full h-9 rounded-[12px] text-[12.5px] font-semibold text-[#6E6E73] border border-black/[0.06] bg-white active:scale-[0.98] transition-transform"
                >
                  Show {hidden} more
                </button>
              )}
              {expanded && !search && filtered.length > SHOW_LIMIT && (
                <button
                  onClick={() => setExpanded(false)}
                  className="text-[12px] text-[#A6A6AC] active:opacity-70 transition-opacity text-center"
                >
                  Show less
                </button>
              )}
            </>
          );
        })()}
      </section>
    </div>
  );
}

function FriendCard({ friend, onTap }) {
  const isRecent = RECENTLY_ACTIVE_LABELS.has(friend.lastActive);
  return (
    <button
      onClick={onTap}
      className="bg-white rounded-[16px] border border-black/[0.04] shadow-[0_2px_6px_rgba(0,0,0,0.03)] p-3.5 flex items-center gap-3 text-left active:opacity-90 active:scale-[0.99] transition-transform"
    >
      <div className="relative shrink-0">
        <img
          src={friend.petPhoto}
          alt=""
          className="w-[54px] h-[54px] rounded-[14px] object-cover bg-[#F3F3F5]"
        />
        {isRecent && (
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#34C759] border-2 border-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold text-[#111111] truncate">{friend.petName}</p>
        <p className="text-[12px] text-[#6E6E73] truncate">
          {friend.petBreed} · {friend.distance.toFixed(1)} km
        </p>
        <p className="text-[11.5px] text-[#A6A6AC] mt-0.5 truncate">
          {isRecent ? `Active ${friend.lastActive}` : `Last seen ${friend.lastActive}`}
        </p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="text-[10.5px] text-[#C4B8AF]">Since {friend.friendsSince}</span>
        <ChevronRight size={14} color="#D1C9C3" />
      </div>
    </button>
  );
}

function RequestCard({ req, onAccept, onDecline }) {
  return (
    <div className="bg-white rounded-[16px] border border-black/[0.04] shadow-[0_2px_6px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="flex items-center gap-3 p-3.5">
        <img
          src={req.fromPetPhoto}
          alt=""
          className="w-[54px] h-[54px] rounded-[14px] object-cover bg-[#F3F3F5] shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold text-[#111111] truncate">{req.fromPetName}</p>
          <p className="text-[12px] text-[#6E6E73] truncate">
            {req.fromPetBreed} · {req.distance?.toFixed(1)} km
          </p>
          <p className="text-[11.5px] text-[#A6A6AC] mt-0.5">{req.timeAgo}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 px-3.5 pb-3.5">
        <button
          onClick={onDecline}
          className="h-9 rounded-[10px] bg-[#F7F7F8] text-[12.5px] font-semibold text-[#6E6E73] active:scale-[0.98] transition-transform"
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          className="h-9 rounded-[10px] text-white text-[12.5px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          <Check size={13} strokeWidth={2.5} />
          Accept
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Discover view — Fylos suggestions with hero-image cards
// ---------------------------------------------------------------------------
function DiscoverView({ suggestions, savedIds, onSave, onSend, onTap }) {
  if (suggestions.length === 0) {
    return (
      <div className="px-6 pt-12 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
          <Compass size={20} strokeWidth={2.2} />
        </div>
        <p className="text-[15px] font-semibold text-[#111111]">That's everyone for today</p>
        <p className="text-[13px] text-[#6E6E73] max-w-[260px]">New pups arrive each morning.</p>
      </div>
    );
  }
  return (
    <div className="px-5 pt-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <SectionHeader label={`${suggestions.length} pups near you`} />
        <span className="text-[11px] font-medium text-[#C4B8AF]">Updated daily</span>
      </div>
      <div className="flex flex-col gap-3">
        {suggestions.map((s) => (
          <SuggestionCard
            key={s.id}
            suggestion={s}
            saved={savedIds.has(s.id)}
            onTap={() => onTap(s)}
            onSave={() => onSave(s)}
            onSend={() => onSend(s)}
          />
        ))}
      </div>
    </div>
  );
}

function SuggestionCard({ suggestion: s, saved, onTap, onSave, onSend }) {
  return (
    <div
      className="bg-white rounded-[20px] border border-black/[0.04] shadow-[0_2px_10px_rgba(0,0,0,0.04)] overflow-hidden"
    >
      {/* Hero image with overlaid badges */}
      <div
        className="relative overflow-hidden cursor-pointer"
        style={{ height: 148 }}
        onClick={onTap}
      >
        <img
          src={s.petPhoto}
          alt=""
          className="w-full h-full object-cover bg-[#F3F3F5]"
        />
        {/* Dark gradient for legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 60%)' }}
        />
        {/* Match score — top right */}
        <div className="absolute top-3 right-3 pointer-events-none">
          <span
            className="inline-flex items-center gap-1 h-[24px] px-2.5 rounded-full text-[11px] font-bold"
            style={{
              background: 'rgba(255,255,255,0.93)',
              color: '#7A2F12',
              boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Sparkles size={10} strokeWidth={2.2} className="text-[#E85D2A]" />
            {s.matchScore}%
          </span>
        </div>
        {/* Save toggle — top left */}
        <button
          onClick={(e) => { e.stopPropagation(); onSave(); }}
          aria-label={saved ? 'Saved' : 'Save'}
          className="absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center active:scale-[0.92] transition-transform"
          style={{
            background: saved ? 'rgba(255,233,221,0.96)' : 'rgba(255,255,255,0.88)',
            boxShadow: '0 1px 6px rgba(0,0,0,0.12)',
            backdropFilter: 'blur(6px)',
          }}
        >
          {saved
            ? <BookmarkCheck size={14} strokeWidth={2.2} className="text-[#E85D2A]" />
            : <Bookmark size={14} strokeWidth={2.2} className="text-[#6E6E73]" />}
        </button>
      </div>

      {/* Info section */}
      <div className="px-4 pt-3 pb-1" onClick={onTap}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <p className="text-[13.5px] font-semibold text-[#111111] truncate">{s.petName}</p>
            <p className="text-[12.5px] text-[#6E6E73] truncate">
              {s.petBreed} · {s.distance.toFixed(1)} km
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(s.reasons || []).map((r, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 h-[22px] px-2 rounded-full text-[10.5px] font-medium text-[#6E6058]"
              style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
            >
              <Sparkles size={9} strokeWidth={2.2} className="text-[#C4916A]" />
              {r}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => { e.stopPropagation(); onSend(); }}
          className="w-full h-10 rounded-[12px] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
          style={{
            background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)',
            boxShadow: '0 4px 14px rgba(232,93,42,0.24)',
          }}
        >
          <Send size={13} strokeWidth={2.2} />
          Send request
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sheets
// ---------------------------------------------------------------------------
function SheetShell({ children, title, onClose }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[10000] flex items-end"
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

function PostDetailSheet({ post, onClose, onToggleLike, onComment, onChangeVisibility }) {
  const [draft, setDraft] = useState('');
  const comments = post.comments || [];
  const isOwnPost = post.ownerName === 'You';
  const submit = () => {
    if (!draft.trim()) return;
    onComment && onComment(draft);
    setDraft('');
  };
  return (
    <SheetShell onClose={onClose} title="Post">
      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img src={post.avatar} className="w-11 h-11 rounded-full object-cover bg-[#F3F3F5]" alt="" />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-[#111111] truncate">{post.ownerName}</p>
            <p className="text-[12px] text-[#8E8E93] truncate flex items-center gap-1.5">
              <span>{post.petName !== 'System' ? `with ${post.petName} · ` : ''}{post.timeAgo}</span>
              <VisibilityChip visibility={post.visibility} />
            </p>
          </div>
        </div>
        {post.photoUrl && (
          <img src={post.photoUrl} alt="" className="w-full rounded-[14px] object-cover bg-[#F3F3F5]" />
        )}
        {post.location && (
          <p className="text-[12.5px] text-[#6E6E73] flex items-center gap-1.5">
            <MapPin size={12} strokeWidth={2} className="text-[#A6A6AC]" />
            {post.location}
          </p>
        )}
        {post.summary && <p className="text-[14px] text-[#111111] leading-snug">{post.summary}</p>}
        <button
          onClick={onToggleLike}
          className={`h-11 rounded-[12px] flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-colors active:scale-[0.98] ${
            post.likedByMe ? 'bg-[#FFE9DD] text-[#E85D2A]' : 'bg-[#F3F3F6] text-[#6E6E73]'
          }`}
        >
          <Heart size={15} strokeWidth={2.2} fill={post.likedByMe ? 'currentColor' : 'none'} />
          {post.likedByMe ? 'Liked' : 'Like'}
        </button>
        {/* Visibility editor — own posts only */}
        {isOwnPost && onChangeVisibility && (
          <div className="flex flex-col gap-2 pt-2 border-t border-black/[0.04]">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">Who can see this</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'public',  label: 'Public',  Icon: Globe },
                { id: 'friends', label: 'Friends', Icon: UsersIcon },
                { id: 'private', label: 'Private', Icon: Lock },
              ].map(({ id, label, Icon }) => {
                const active = (post.visibility || 'friends') === id;
                return (
                  <button
                    key={id}
                    onClick={() => onChangeVisibility(id)}
                    className={`flex items-center justify-center gap-1.5 h-10 rounded-[10px] border text-[12px] font-semibold transition-colors active:scale-[0.97] ${
                      active ? 'bg-[#FFE9DD] border-[#FFD4CC] text-[#7A2F12]' : 'bg-white border-black/[0.06] text-[#6E6E73]'
                    }`}
                  >
                    <Icon size={12} strokeWidth={2.2} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {/* Comments thread */}
        <div className="flex flex-col gap-3 pt-2 border-t border-black/[0.04]">
          <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">
            {comments.length === 0 ? 'No comments yet' : `${comments.length} comment${comments.length === 1 ? '' : 's'}`}
          </p>
          <div className="flex flex-col gap-3">
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3">
                <img src={c.avatar} className="w-8 h-8 rounded-full object-cover bg-[#F3F3F5] shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[#111111] leading-snug">
                    <span className="font-semibold">{c.author}</span> <span className="text-[#8E8E93] text-[11.5px]">· {c.timeAgo}</span>
                  </p>
                  <p className="text-[13px] text-[#111111] leading-snug mt-0.5">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Composer */}
          <div className="flex items-center gap-2 pt-1">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              placeholder="Add a comment…"
              className="flex-1 h-10 rounded-full px-4 outline-none text-[13px]"
              style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}
            />
            <button
              onClick={submit}
              disabled={!draft.trim()}
              aria-label="Send"
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-[0.94]"
              style={{
                background: draft.trim() ? 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' : '#EDE8E2',
                color: draft.trim() ? '#FFF' : '#A09A94',
              }}
            >
              <Send size={14} strokeWidth={2.4} />
            </button>
          </div>
        </div>
        {/* Likers */}
        {post.likers && post.likers.length > 0 && (
          <div className="flex flex-col gap-2 pt-3 border-t border-black/[0.04]">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">Liked by</p>
            <div className="flex flex-col gap-2">
              {post.likers.slice(0, 6).map((l) => (
                <div key={l.id} className="flex items-center gap-3">
                  <img src={l.avatar} className="w-8 h-8 rounded-full object-cover bg-[#F3F3F5]" alt="" />
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#111111] truncate">{l.petName}</p>
                    <p className="text-[11.5px] text-[#8E8E93] truncate">{l.breed} · {l.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SheetShell>
  );
}

// ---------------------------------------------------------------------------
// Peer Profile — full-page sub-screen, portalled to fylos-phone-root
// Aligned with FYLOS_DESIGN_SYSTEM.md (canonical floating header, #F9F9FB bg,
// uppercase section headers, peach/coral list rows, level-1 card shadow)
// ---------------------------------------------------------------------------

const PP_MY_PREFS = { preferredActivities: ['walks', 'park', 'training'] };
const PP_ACT_MAP = {
  walks:    { label: 'Walks',         Icon: Footprints },
  park:     { label: 'Park play',     Icon: TreePine },
  training: { label: 'Training',      Icon: GraduationCap },
  calm:     { label: 'Calm hangouts', Icon: Coffee },
};

function ppInitials(ownerName) {
  if (!ownerName) return '??';
  const words = ownerName.replace(/'s owner/i, '').trim().split(/\s+/);
  return words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

function ppUsername(ownerName, petName) {
  const base = (ownerName || '').replace(/'s owner/i, '').trim().toLowerCase().replace(/\s+/g, '.');
  return base ? `${base}.${(petName || 'dog').toLowerCase()}` : (petName || 'user').toLowerCase();
}

const PP_CARD = 'bg-white rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)]';
const PP_SECTION_LABEL = 'text-[12px] font-bold uppercase tracking-widest text-[#8E8E93]';

function PeerProfilePage({ profile, onClose, onPlanPlaydate }) {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('about');
  const [connectionStatus, setConnectionStatus] = useState(
    profile.friendsSince ? 'connected' : 'none'
  );
  const [sheet, setSheet] = useState(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const petName  = profile.petName  || profile.fromPetName  || 'Pet';
  const petBreed = profile.petBreed || profile.fromPetBreed || '';
  const petPhoto = profile.petPhoto || profile.fromPetPhoto || null;
  const ownerName = profile.ownerName || 'Dog owner';
  const age = profile.age;
  const initials = ppInitials(ownerName);
  const username = ppUsername(ownerName, petName);
  const distance = profile.distance;

  const pets = [{
    id: 'p1', name: petName, breed: petBreed, age, photo: petPhoto,
    vibeTags: ['Loves park play', 'Morning runner'],
    energyLevel: 'High', vaccineStatus: 'Up to date', lastVet: 'Dr. Keller · Jan 2025',
  }];

  const stats = {
    playdatesCompleted: 8 + Math.round((distance || 1) * 3),
    friendsCount: 20 + Math.round((distance || 1) * 7),
    rating: parseFloat((4.7 + (petName.length % 3) * 0.1).toFixed(1)),
    memberMonths: 12,
  };

  const theirActivities = ['walks', 'park', 'calm'];
  const mutualFriends = [
    { id: 'f1', name: 'Sophie M.', initials: 'SM', via: 'Fylos' },
    { id: 'f2', name: 'David & Roxy', initials: 'DR', via: 'Playdate' },
  ];
  const mutualPlaydates = profile.friendsSince
    ? [{ id: 'pd1', date: 'Apr 3', location: 'Zurichhorn Park', pets: `${petName} + Leo`, rating: 5.0 }]
    : [];

  const bio = `${petName}'s human — always up for a morning walk or park hang in Zürich. Looking for friendly dogs for regular meetups.`;

  const cycleConnection = () =>
    setConnectionStatus((s) => s === 'none' ? 'pending' : s === 'pending' ? 'connected' : 'none');

  const prefRows = [
    { Icon: Footprints, label: 'Preferred activities', value: 'Walks, Park play' },
    { Icon: CalendarDays, label: 'Availability', value: 'Weekends · Mornings' },
    { Icon: MapPin, label: 'Play radius', value: 'Within 3 km' },
    { Icon: PawPrint, label: 'Dog size match', value: 'Medium · Large' },
  ];

  const connectionLabel = {
    none: 'Connect',
    pending: 'Pending',
    connected: 'Connected',
  }[connectionStatus];

  const content = (
    <>
    <div
      className={`absolute inset-0 z-[80] bg-[#F9F9FB] transition-transform duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }}
    >
      {/* ── Scrollable body — content scrolls behind the gradient header,
            paddingBottom clears the iPhone bottom dock (tab bar at z-[90]) ── */}
      <div className="absolute inset-0 overflow-y-auto custom-scrollbar" style={{ paddingTop: 100, paddingBottom: 110 }}>

        {/* Identity hero — airy, centered, no busy ring */}
        <section className="px-5 pt-2 pb-5 flex flex-col items-center text-center">
          <div className="relative">
            <div
              className="w-[96px] h-[96px] rounded-full overflow-hidden flex items-center justify-center"
              style={{
                background: petPhoto ? '#F2F2F7' : 'linear-gradient(145deg,#FF7240 0%,#E85D2A 100%)',
                boxShadow: '0 12px 32px rgba(0,0,0,0.08), inset 0 0 0 4px #FFFFFF',
              }}
            >
              {petPhoto
                ? <img src={petPhoto} alt={petName} className="w-full h-full object-cover" />
                : <span className="text-white font-semibold text-[34px] tracking-tight">{initials}</span>}
            </div>
            {/* Verified check — minimal, on white pill */}
            <div className="absolute -bottom-0.5 -right-0.5 w-[26px] h-[26px] rounded-full bg-white flex items-center justify-center"
                 style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
              <div className="w-[18px] h-[18px] rounded-full bg-[#34C759] flex items-center justify-center">
                <Check size={11} color="white" strokeWidth={3} />
              </div>
            </div>
          </div>

          <h2 className="mt-4 text-[22px] font-semibold tracking-tight text-[#111111]">{ownerName}</h2>
          <p className="mt-1 text-[13px] text-[#8E8E93]">
            @{username} · Zürich{distance != null ? ` · ${distance.toFixed(1)} km` : ''}
          </p>

          <p className="mt-3 max-w-[300px] text-[14px] leading-[1.5] text-[#6E6E73]">{bio}</p>

          {/* Trust line — three subtle stat-chips inline */}
          <div className="mt-4 flex items-center gap-2">
            <span className="h-[26px] px-2.5 rounded-full inline-flex items-center gap-1.5 text-[11px] font-semibold bg-[#EEF7F1] text-[#3F8D63] border border-[#D7EBDD]">
              <ShieldCheck size={11} strokeWidth={2.5} /> ID Verified
            </span>
            <span className="h-[26px] px-2.5 rounded-full inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white text-[#111111] border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <Syringe size={11} strokeWidth={2.5} className="text-[#E85D2A]" /> Vaccinated
            </span>
            <span className="h-[26px] px-2.5 rounded-full inline-flex items-center gap-1.5 text-[11px] font-semibold bg-white text-[#111111] border border-black/[0.05] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
              <Star size={11} strokeWidth={2.5} className="text-[#FF9500]" fill="#FF9500" /> {stats.rating}
            </span>
          </div>
        </section>

        {/* Action row — primary CTA + Message/Playdate split */}
        <section className="px-5 pb-5 flex flex-col gap-2.5">
          {connectionStatus === 'none' ? (
            <button
              onClick={cycleConnection}
              className="w-full h-[52px] rounded-[16px] font-semibold text-[15px] text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-gradient-to-b from-[#FF7240] to-[#E85D2A] shadow-[0_4px_14px_rgba(232,93,42,0.25)]"
            >
              <UserPlus size={17} strokeWidth={2.2} /> Connect
            </button>
          ) : connectionStatus === 'pending' ? (
            <button
              onClick={cycleConnection}
              className="w-full h-[52px] rounded-[16px] font-semibold text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-[#F7F4EF] text-[#B07A3A] border border-[#ECDDC8]"
            >
              <Clock size={16} strokeWidth={2.2} /> Pending
            </button>
          ) : (
            <button
              onClick={cycleConnection}
              className="w-full h-[52px] rounded-[16px] font-semibold text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-[#EEF7F1] text-[#3F8D63] border border-[#D7EBDD]"
            >
              <UserCheck size={16} strokeWidth={2.2} /> Connected
            </button>
          )}
          <div className="flex gap-2.5">
            <button className="flex-1 h-[46px] rounded-[14px] font-semibold text-[14px] active:scale-[0.97] transition-all flex items-center justify-center gap-2 bg-white text-[#111111] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)]">
              <MessageCircle size={16} strokeWidth={2} className="text-[#6E6E73]" /> Message
            </button>
            <button
              onClick={onPlanPlaydate}
              className="flex-1 h-[46px] rounded-[14px] font-semibold text-[14px] active:scale-[0.97] transition-all flex items-center justify-center gap-2 bg-white text-[#111111] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)]"
            >
              <Calendar size={16} strokeWidth={2} className="text-[#6E6E73]" /> Playdate
            </button>
          </div>
        </section>

        {/* Stats card — single white card, four columns */}
        <section className="px-5 pb-3.5">
          <div className={`${PP_CARD} flex items-center py-4`}>
            {[
              { val: stats.playdatesCompleted, label: 'playdates' },
              { val: stats.friendsCount,       label: 'friends' },
              { val: stats.rating.toFixed(1),  label: 'rating' },
              { val: `${stats.memberMonths}mo`, label: 'on Fylos' },
            ].map((s, i) => (
              <div key={s.label} className="flex-1 flex flex-col items-center"
                   style={{ borderRight: i < 3 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
                <span className="text-[18px] font-semibold leading-none text-[#111111]">{s.val}</span>
                <span className="text-[11px] mt-1.5 text-[#8E8E93]">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tab bar — Inbox-style sliding pill */}
        <section className="px-5 pb-3">
          <div className="relative flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-black/[0.04]">
            <div
              className="absolute top-1.5 bottom-1.5 bg-[#111111] rounded-full"
              style={{
                width: 'calc(50% - 12px)',
                left: activeTab === 'about' ? '6px' : 'calc(50% + 6px)',
                transition: 'left 300ms cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            />
            {['about', 'mutual'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative z-10 flex-1 py-1.5 text-[13px] font-semibold transition-colors duration-[200ms] text-center"
                style={{ color: activeTab === tab ? '#FFFFFF' : '#8E8E93' }}
              >
                {tab === 'about' ? 'About' : 'Mutual'}
              </button>
            ))}
          </div>
        </section>

        {/* About tab content */}
        {activeTab === 'about' && (
          <div className="px-5 flex flex-col gap-5 pb-8">
            {/* Pet card — featured pet, hero of the About panel */}
            <div>
              <p className={`${PP_SECTION_LABEL} mb-2 ml-1`}>Their Fylos</p>
              {pets.map((pet) => (
                <div key={pet.id} className={`${PP_CARD} p-4`}>
                  <div className="flex items-center gap-3.5">
                    <div className="w-[58px] h-[58px] rounded-[16px] overflow-hidden bg-[#F2F2F7] shrink-0">
                      {pet.photo
                        ? <img src={pet.photo} alt={pet.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#FFEDE3] to-[#FFD9C5]">
                            <PawPrint size={22} className="text-[#E85D2A]" strokeWidth={2} />
                          </div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] font-semibold leading-tight text-[#111111] truncate">{pet.name}</p>
                      <p className="text-[12.5px] text-[#6E6E73] mt-0.5 truncate">
                        {pet.breed}{pet.age ? ` · ${pet.age} yrs` : ''}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <span className="h-[18px] px-2 rounded-full inline-flex items-center text-[10px] font-semibold bg-[#EEF7F1] text-[#3F8D63] border border-[#D7EBDD]">
                          {pet.vaccineStatus}
                        </span>
                        <span className="text-[11px] text-[#8E8E93]">·</span>
                        <span className="text-[11px] text-[#8E8E93]">{pet.energyLevel} energy</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {pet.vibeTags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#FFEDE3] text-[#E85D2A]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bio card */}
            <div>
              <p className={`${PP_SECTION_LABEL} mb-2 ml-1`}>About {ownerName.replace(/'s owner/i,'')}</p>
              <div className={`${PP_CARD} p-4`}>
                <p className="text-[14px] leading-[1.55] text-[#3F3F44]">{bio}</p>
              </div>
            </div>

            {/* Match card — replaces compatibility strip, in app's card style */}
            <div>
              <p className={`${PP_SECTION_LABEL} mb-2 ml-1`}>Match with you</p>
              <div className={`${PP_CARD} p-4`}>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {theirActivities.map((act) => {
                    const matched = PP_MY_PREFS.preferredActivities.includes(act);
                    const info = PP_ACT_MAP[act];
                    if (!info) return null;
                    const { Icon, label } = info;
                    return (
                      <div
                        key={act}
                        className={`h-[28px] px-2.5 rounded-full inline-flex items-center gap-1.5 text-[12px] font-semibold border ${
                          matched
                            ? 'bg-[#EEF7F1] text-[#3F8D63] border-[#D7EBDD]'
                            : 'bg-[#F2F2F7] text-[#8E8E93] border-transparent'
                        }`}
                      >
                        <Icon size={12} strokeWidth={2} />
                        {label}
                        {matched
                          ? <Check size={11} strokeWidth={3} />
                          : <Minus size={11} strokeWidth={2.5} />}
                      </div>
                    );
                  })}
                </div>
                <div className="pt-3 border-t border-black/[0.04] flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#E85D2A]" strokeWidth={2} />
                  <span className="text-[12.5px] text-[#6E6E73]">
                    {theirActivities.filter(a => PP_MY_PREFS.preferredActivities.includes(a)).length} of {theirActivities.length} activities match
                  </span>
                </div>
              </div>
            </div>

            {/* Preferences list — peach circle + coral icon, settings-row style */}
            <div>
              <p className={`${PP_SECTION_LABEL} mb-2 ml-1`}>Playdate preferences</p>
              <div className={`${PP_CARD} overflow-hidden`}>
                {prefRows.map((row, i) => (
                  <div key={row.label} className="relative flex items-center gap-3 px-4 py-3.5">
                    <div className="w-[34px] h-[34px] rounded-full bg-[#FFEDE3] shrink-0 flex items-center justify-center">
                      <row.Icon size={16} className="text-[#E85D2A]" strokeWidth={2} />
                    </div>
                    <span className="flex-1 text-[14px] font-medium text-[#111111] truncate">{row.label}</span>
                    <span className="text-[12.5px] text-[#6E6E73] shrink-0 max-w-[150px] truncate text-right">{row.value}</span>
                    {i < prefRows.length - 1 && (
                      <div className="absolute bottom-0 left-[62px] right-4 h-px bg-black/[0.04]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quiet meta line */}
            <div className="flex items-center justify-center gap-1.5">
              <Clock size={12} className="text-[#A6A6AC]" strokeWidth={2} />
              <span className="text-[11.5px] text-[#A6A6AC]">Typically replies within an hour</span>
            </div>
          </div>
        )}

        {/* Mutual tab content */}
        {activeTab === 'mutual' && (
          <div className="px-5 flex flex-col gap-5 pb-8">
            {mutualFriends.length > 0 ? (
              <div>
                <p className={`${PP_SECTION_LABEL} mb-2 ml-1`}>{mutualFriends.length} mutual</p>
                <div className={`${PP_CARD} overflow-hidden`}>
                  {mutualFriends.map((friend, i) => (
                    <div key={friend.id} className="relative flex items-center gap-3 px-4 py-3.5">
                      <div
                        className="w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(145deg,#FF7240,#E85D2A)' }}
                      >
                        <span className="text-white text-[12px] font-semibold">{friend.initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold leading-tight text-[#111111] truncate">{friend.name}</p>
                        <p className="text-[12px] text-[#8E8E93] mt-0.5">via {friend.via}</p>
                      </div>
                      <ChevronRight size={14} className="text-[#C7C7CC]" strokeWidth={2.2} />
                      {i < mutualFriends.length - 1 && (
                        <div className="absolute bottom-0 left-[62px] right-4 h-px bg-black/[0.04]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {mutualPlaydates.length > 0 ? (
              <div>
                <p className={`${PP_SECTION_LABEL} mb-2 ml-1`}>Playdate history</p>
                <div className={`${PP_CARD} overflow-hidden`}>
                  {mutualPlaydates.map((pd, i) => (
                    <div key={pd.id} className="relative flex items-center gap-3 px-4 py-3.5">
                      <div className="w-[34px] h-[34px] rounded-full bg-[#FFEDE3] shrink-0 flex items-center justify-center">
                        <Calendar size={15} className="text-[#E85D2A]" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold leading-tight text-[#111111]">{pd.date} · {pd.location}</p>
                        <p className="text-[12px] text-[#8E8E93] mt-0.5 truncate">{pd.pets}</p>
                      </div>
                      <span className="h-[22px] px-2.5 rounded-full inline-flex items-center gap-1 text-[11px] font-semibold bg-[#FFF4E5] text-[#B07A3A] border border-[#ECDDC8]">
                        <Star size={10} fill="#FF9500" strokeWidth={0} />
                        {pd.rating.toFixed(1)}
                      </span>
                      {i < mutualPlaydates.length - 1 && (
                        <div className="absolute bottom-0 left-[62px] right-4 h-px bg-black/[0.04]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {mutualFriends.length === 0 && mutualPlaydates.length === 0 ? (
              <div className={`${PP_CARD} flex flex-col items-center text-center px-6 py-10`}>
                <div className="w-[52px] h-[52px] rounded-full bg-[#F2F2F7] flex items-center justify-center mb-3">
                  <UsersIcon size={22} className="text-[#8E8E93]" strokeWidth={1.5} />
                </div>
                <p className="text-[14px] font-semibold text-[#111111]">No mutual connections yet</p>
                <p className="text-[12.5px] text-[#8E8E93] mt-1">Plan a playdate together to start building common friends.</p>
              </div>
            ) : null}
          </div>
        )}

        <div className="h-2" />
      </div>

      {/* ── Bottom fade — content gracefully fades into the tab dock area ── */}
      <div
        className="absolute left-0 right-0 z-30 pointer-events-none"
        style={{
          bottom: 0,
          height: 130,
          background: 'linear-gradient(to top, #F9F9FB 0%, #F9F9FB 38%, rgba(249,249,251,0) 100%)',
        }}
      />

      {/* ── Floating header — canonical pattern with gradient fade ── */}
      <header
        className="absolute top-0 left-0 right-0 z-40 pointer-events-none bg-gradient-to-b from-[#F9F9FB] from-30% via-[#F9F9FB]/85 to-transparent"
        style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}
      >
        <div className="flex items-center justify-between pointer-events-auto">
          <button
            onClick={handleClose}
            className="w-[44px] h-[44px] flex items-center justify-center bg-white border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-full active:scale-[0.96] transition-all duration-[120ms]"
            aria-label="Back"
          >
            <ChevronLeft size={20} className="text-[#111111]" strokeWidth={2.2} />
          </button>
          <h1 className="text-[17px] font-semibold text-[#111111]">{connectionLabel === 'Connected' ? 'Friend' : 'Profile'}</h1>
          <button
            onClick={() => setSheet('more')}
            className="w-[44px] h-[44px] flex items-center justify-center bg-white border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-full active:scale-[0.96] transition-all duration-[120ms]"
            aria-label="More"
          >
            <MoreHorizontal size={18} className="text-[#111111]" strokeWidth={2} />
          </button>
        </div>
      </header>

    </div>

    {/* ── More sheet — outside the slide-in container, above tab dock ── */}
    {sheet === 'more' && (
      <div className="absolute inset-0 z-[110] flex items-end" onClick={() => setSheet(null)}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div
          className="relative w-full bg-white rounded-t-[22px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full flex flex-col items-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
          </div>
          <div className="px-5 pb-8 pt-2">
            <h3 className="text-[17px] font-semibold text-[#111111] mb-3">More options</h3>
            <div className="flex flex-col gap-2">
              {[
                { Icon: UserMinus, label: 'Disconnect', color: '#111111', bg: '#F2F2F7' },
                { Icon: Flag, label: 'Report profile', color: '#FF3B30', bg: '#FFF0F0' },
              ].map(({ Icon, label, color, bg }) => (
                <button
                  key={label}
                  onClick={() => setSheet(null)}
                  className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[14px] border border-black/[0.04] bg-white active:scale-[0.99] transition-all"
                >
                  <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: bg }}>
                    <Icon size={16} style={{ color }} strokeWidth={2} />
                  </div>
                  <span className="text-[14px] font-semibold" style={{ color }}>{label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setSheet(null)}
              className="w-full h-[46px] rounded-[14px] font-semibold text-[14px] text-[#111111] bg-[#F2F2F7] active:scale-[0.98] transition-all mt-3"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );

  const mount = typeof document !== 'undefined' ? document.getElementById('fylos-phone-root') : null;
  return mount ? createPortal(content, mount) : content;
}

function PlacePeekSheet({ place, saved, onClose, onToggleSave }) {
  return (
    <SheetShell onClose={onClose} title={place.name}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        {place.photo && (
          <img src={place.photo} alt="" className="w-full rounded-[14px] object-cover bg-[#F3F3F5]" style={{ height: 160 }} />
        )}
        <div className="flex items-center gap-2">
          <CategoryBadge category={place.category} />
          <span className="text-[11.5px] text-[#8E8E93]">{place.distance?.toFixed(1)} km · {place.vibe}</span>
        </div>
        {place.description && <p className="text-[13.5px] text-[#111111] leading-snug">{place.description}</p>}
        {place.amenities && place.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {place.amenities.map((a) => <AmenityTag key={a} amenityKey={a} />)}
          </div>
        )}
        {place.address && (
          <p className="text-[12px] text-[#6E6E73] flex items-center gap-1.5">
            <MapPin size={12} className="text-[#A6A6AC]" strokeWidth={2} />
            {place.address}
          </p>
        )}
        <button
          onClick={onToggleSave}
          className={`h-11 rounded-[12px] flex items-center justify-center gap-1.5 text-[13px] font-semibold transition-colors active:scale-[0.98] ${
            saved
              ? 'bg-[#F7F7F8] border border-black/[0.06] text-[#111111]'
              : 'text-white'
          }`}
          style={!saved ? { background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' } : undefined}
        >
          {saved ? <BookmarkCheck size={15} strokeWidth={2.2} /> : <Bookmark size={15} strokeWidth={2.2} />}
          {saved ? 'Saved' : 'Save'}
        </button>
      </div>
    </SheetShell>
  );
}

const VISIBILITY_OPTIONS = [
  { id: 'public',  label: 'Public',  Icon: Globe,     body: 'Anyone on Fylos.' },
  { id: 'friends', label: 'Friends', Icon: UsersIcon, body: 'Just your Fylos.' },
  { id: 'private', label: 'Private', Icon: Lock,      body: 'Only you.' },
];

function CreatePostSheet({ onClose, onSubmit }) {
  const [text, setText] = useState('');
  const [visibility, setVisibility] = useState('friends');
  return (
    <SheetShell onClose={onClose} title="Share a moment">
      <div className="px-6 pb-6 flex flex-col gap-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did your Fylos do today?"
          rows={4}
          className="w-full rounded-[12px] px-3 py-3 outline-none resize-none text-[13.5px]"
          style={{ border: '1px solid #EDE8E2', background: '#F7F5F2', color: '#111' }}
          autoFocus
        />
        <div className="flex flex-col gap-1.5">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B]">Visibility</span>
          <div className="grid grid-cols-3 gap-2">
            {VISIBILITY_OPTIONS.map((opt) => {
              const active = visibility === opt.id;
              const Icon = opt.Icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setVisibility(opt.id)}
                  className={`flex flex-col items-center gap-1 px-2 py-2.5 rounded-[12px] border transition-colors active:scale-[0.97] ${
                    active ? 'bg-[#FFE9DD] border-[#FFD4CC] text-[#7A2F12]' : 'bg-white border-black/[0.06] text-[#6E6E73]'
                  }`}
                >
                  <Icon size={14} strokeWidth={2.2} />
                  <span className="text-[12px] font-semibold">{opt.label}</span>
                  <span className="text-[10.5px] text-[#8E8E93] leading-tight text-center">{opt.body}</span>
                </button>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => text.trim() && onSubmit({ text: text.trim(), visibility })}
          disabled={!text.trim()}
          className="h-11 rounded-[12px] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98]"
          style={{
            background: text.trim() ? 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' : '#EDE8E2',
            color: text.trim() ? '#FFF' : '#A09A94',
            boxShadow: text.trim() ? '0 6px 18px rgba(232,93,42,0.28)' : 'none',
          }}
        >
          <Send size={14} strokeWidth={2.2} />
          Post
        </button>
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
