import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Heart, MessageCircle, MapPin, MoreHorizontal, Sparkles, Calendar, Plus,
  Camera, ChevronRight, Search, Bookmark, BookmarkCheck, Send, X, Check,
  Star, Clock, Compass, Coffee, Trees, Droplets, Globe, Users as UsersIcon,
  Lock,
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
        <ProfilePeekSheet
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
function FeedView({ posts, filter, setFilter, onTapPost, onToggleLike, onCreate, places, savedPlaceIds, onTapPlace, onTogglePlaceSave }) {
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

      {posts.length === 0 ? (
        <FeedEmpty onClear={() => setFilter('all')} />
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onTap={() => onTapPost(p)} onToggleLike={() => onToggleLike(p.id)} />
          ))}
        </div>
      )}

      <NearbyPlacesStrip places={places} savedIds={savedPlaceIds} onTap={onTapPlace} onToggleSave={onTogglePlaceSave} />
    </div>
  );
}

function PostCard({ post, onTap, onToggleLike }) {
  const isSystem = post.type === 'friend-update' || post.type === 'playdate-event';
  const commentCount = (post.comments || []).length;
  return (
    <div className="bg-white rounded-[20px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
      <button onClick={onTap} className="w-full text-left active:opacity-95">
        <div className="flex items-center gap-3 px-4 pt-4">
          <img src={post.avatar} alt="" className="w-10 h-10 rounded-full object-cover bg-[#F3F3F5] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-[#111111] truncate">{post.ownerName}</p>
            <p className="text-[11.5px] text-[#8E8E93] mt-0.5 leading-none flex items-center gap-1.5">
              <span>{post.petName !== 'System' ? `with ${post.petName} · ` : ''}{post.timeAgo}</span>
              <VisibilityChip visibility={post.visibility} />
            </p>
          </div>
        </div>
        {post.photoUrl && (
          <img
            src={post.photoUrl}
            alt=""
            className="w-full aspect-[4/3] object-cover bg-[#F3F3F5] mt-3"
          />
        )}
        <div className="px-4 pt-3">
          {post.location && (
            <p className="text-[11.5px] text-[#8E8E93] flex items-center gap-1.5">
              <MapPin size={11} strokeWidth={2} className="text-[#A6A6AC]" />
              {post.location}
            </p>
          )}
          {post.summary && (
            <p className="text-[14px] text-[#111111] mt-2 leading-snug">{post.summary}</p>
          )}
          {!post.summary && post.type === 'check-in' && (
            <p className="text-[14px] text-[#111111] mt-2 leading-snug">Checked in {post.location ? `at ${post.location}` : ''}</p>
          )}
          {!post.summary && post.type === 'photo' && (
            <p className="text-[14px] text-[#111111] mt-2 leading-snug">Shared a photo</p>
          )}
        </div>
      </button>
      {!isSystem && (
        <div className="flex items-center justify-between px-4 py-3 mt-3 border-t border-black/[0.04]">
          <div className="min-w-0 flex flex-col gap-0.5">
            {post.likesCount > 0 ? (
              <p className="text-[12.5px] font-semibold text-[#111111] truncate">
                {post.likesCount} {post.likesCount === 1 ? 'like' : 'likes'}
                {post.likersPreview ? <span className="font-normal text-[#8E8E93]"> · {post.likersPreview}</span> : null}
              </p>
            ) : (
              <p className="text-[12px] text-[#8E8E93]">Be the first to like</p>
            )}
            {commentCount > 0 && (
              <button onClick={onTap} className="text-[11.5px] text-[#6E6E73] text-left active:opacity-70">
                View {commentCount === 1 ? '1 comment' : `${commentCount} comments`}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onTap}
              aria-label="Comment"
              className="h-9 px-2.5 rounded-[12px] flex items-center justify-center gap-1 text-[12px] font-semibold transition-colors active:scale-[0.97] bg-[#F3F3F6] text-[#6E6E73]"
            >
              <MessageCircle size={14} strokeWidth={2.2} />
            </button>
            <button
              onClick={onToggleLike}
              aria-label={post.likedByMe ? 'Unlike' : 'Like'}
              className={`h-9 px-3 rounded-[12px] flex items-center justify-center gap-1.5 text-[12.5px] font-semibold transition-colors active:scale-[0.97] ${
                post.likedByMe ? 'bg-[#FFE9DD] text-[#E85D2A]' : 'bg-[#F3F3F6] text-[#6E6E73]'
              }`}
            >
              <Heart size={15} strokeWidth={2.2} fill={post.likedByMe ? 'currentColor' : 'none'} />
              {post.likedByMe ? 'Liked' : 'Like'}
            </button>
          </div>
        </div>
      )}
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
                  <p className="text-[13px] font-semibold text-[#111111] truncate">{p.name}</p>
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
// Friends view — your connections + incoming requests
// ---------------------------------------------------------------------------
function FriendsView({ friends, requests, onTapFriend, onAcceptRequest, onDeclineRequest, onPlanPlaydate }) {
  return (
    <div className="px-5 pt-4 flex flex-col gap-4">
      {requests.length > 0 && (
        <section className="flex flex-col gap-2">
          <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93]">
            {requests.length} {requests.length === 1 ? 'request' : 'requests'}
          </p>
          <div className="flex flex-col gap-2">
            {requests.map((req) => (
              <RequestCard key={req.id} req={req} onAccept={() => onAcceptRequest(req)} onDecline={() => onDeclineRequest(req.id)} />
            ))}
          </div>
        </section>
      )}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93]">{friends.length} friends</p>
          <button
            onClick={onPlanPlaydate}
            className="text-[11.5px] font-semibold text-[#E85D2A] flex items-center gap-1 active:opacity-70"
          >
            Plan a playdate <ChevronRight size={11} strokeWidth={2.4} />
          </button>
        </div>
        {friends.length === 0 ? (
          <div className="rounded-[16px] bg-white border border-black/[0.04] p-6 flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
              <Sparkles size={18} strokeWidth={2.2} />
            </div>
            <p className="text-[14px] font-semibold text-[#111111]">No friends yet</p>
            <p className="text-[12px] text-[#6E6E73]">Try the Discover tab to find pups nearby.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {friends.map((f) => (
              <FriendCard key={f.id} friend={f} onTap={() => onTapFriend(f)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function FriendCard({ friend, onTap }) {
  return (
    <button
      onClick={onTap}
      className="bg-white rounded-[16px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-3.5 flex items-center gap-3 text-left active:opacity-90 active:scale-[0.99] transition-transform"
    >
      <img src={friend.petPhoto} alt="" className="w-[52px] h-[52px] rounded-full object-cover bg-[#F3F3F5] shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[#111111] truncate">{friend.petName}</p>
        <p className="text-[12px] text-[#6E6E73] truncate">
          {friend.petBreed} · {friend.distance.toFixed(1)} km
        </p>
        <p className="text-[11.5px] text-[#8E8E93] mt-0.5 truncate">
          Friends since {friend.friendsSince} · {friend.lastActive}
        </p>
      </div>
      <ChevronRight size={16} color="#B6B6BC" className="shrink-0" />
    </button>
  );
}

function RequestCard({ req, onAccept, onDecline }) {
  return (
    <div className="bg-white rounded-[16px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-3.5">
      <div className="flex items-center gap-3">
        <img src={req.fromPetPhoto} alt="" className="w-10 h-10 rounded-full object-cover bg-[#F3F3F5] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[13.5px] font-semibold text-[#111111] truncate">
            {req.fromPetName} wants to connect
          </p>
          <p className="text-[11.5px] text-[#8E8E93] truncate">
            {req.fromPetBreed} · {req.distance?.toFixed(1)} km · {req.timeAgo}
          </p>
        </div>
      </div>
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
    </div>
  );
}

// ---------------------------------------------------------------------------
// Discover view — Fylos suggestions
// ---------------------------------------------------------------------------
function DiscoverView({ suggestions, savedIds, onSave, onSend, onTap }) {
  if (suggestions.length === 0) {
    return (
      <div className="px-6 pt-12 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-[#FFE9DD] flex items-center justify-center text-[#E85D2A]">
          <Compass size={20} strokeWidth={2.2} />
        </div>
        <p className="text-[15px] font-semibold text-[#111111]">All caught up</p>
        <p className="text-[13px] text-[#6E6E73] max-w-[260px]">We'll surface new pups as they show up nearby.</p>
      </div>
    );
  }
  return (
    <div className="px-5 pt-4 flex flex-col gap-3">
      <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93]">{suggestions.length} for you</p>
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
  );
}

function SuggestionCard({ suggestion: s, saved, onTap, onSave, onSend }) {
  return (
    <div className="bg-white rounded-[20px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
      <button onClick={onTap} className="w-full text-left active:opacity-90">
        <div className="flex items-start gap-3 p-4">
          <img src={s.petPhoto} alt="" className="w-[64px] h-[64px] rounded-[16px] object-cover bg-[#F3F3F5] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[15px] font-semibold text-[#111111] truncate">{s.petName}</p>
                <p className="text-[12px] text-[#6E6E73] truncate">{s.petBreed} · {s.distance.toFixed(1)} km</p>
              </div>
              <span
                className="shrink-0 inline-flex items-center h-[22px] px-2 rounded-full text-[10.5px] font-semibold"
                style={{ background: '#FFE9DD', color: '#7A2F12' }}
              >
                {s.matchScore}% fit
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(s.reasons || []).slice(0, 2).map((r, i) => (
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
          onClick={onSend}
          className="flex-1 h-10 rounded-[12px] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)', boxShadow: '0 4px 12px rgba(232,93,42,0.22)' }}
        >
          <Send size={14} strokeWidth={2.2} />
          Send request
        </button>
        <button
          onClick={onSave}
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

function ProfilePeekSheet({ profile, onClose, onPlanPlaydate }) {
  const photo = profile.petPhoto || profile.fromPetPhoto;
  const name = profile.petName || profile.fromPetName;
  const breed = profile.petBreed || profile.fromPetBreed;
  return (
    <SheetShell onClose={onClose} title={name}>
      <div className="px-6 pb-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <img src={photo} className="w-[68px] h-[68px] rounded-[16px] object-cover bg-[#F3F3F5]" alt="" />
          <div className="flex-1 min-w-0">
            <p className="text-[16px] font-semibold text-[#111111] truncate">{name}</p>
            <p className="text-[12.5px] text-[#6E6E73] truncate">
              {breed} · {profile.distance?.toFixed(1)} km · {profile.ownerName || ''}
            </p>
          </div>
        </div>
        {(profile.reasons && profile.reasons.length > 0) && (
          <div className="rounded-[14px] bg-[#F7F5F2] p-3.5 border border-[#EDE8E2]">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-[#8E7A6B] mb-1.5">Why a good fit</p>
            <ul className="flex flex-col gap-1">
              {profile.reasons.map((r, i) => (
                <li key={i} className="text-[13px] text-[#6E6058] flex items-start gap-2">
                  <Sparkles size={12} className="mt-[3px] text-[#E85D2A] shrink-0" strokeWidth={2.2} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {profile.friendsSince && (
          <div className="rounded-[14px] bg-[#F7F5F2] p-3.5 border border-[#EDE8E2] text-[12.5px] text-[#6E6058]">
            Friends since {profile.friendsSince} · last active {profile.lastActive}
          </div>
        )}
        <button
          onClick={onPlanPlaydate}
          className="h-11 rounded-[12px] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.98]"
          style={{ background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }}
        >
          <Calendar size={15} strokeWidth={2.2} />
          Plan a playdate
        </button>
      </div>
    </SheetShell>
  );
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
