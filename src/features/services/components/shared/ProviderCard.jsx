import React from 'react';
import { Star, Bookmark, BookmarkCheck, ShieldCheck, Lock, Heart, Crown, Sparkles, MapPin, ChevronRight } from 'lucide-react';

const LANG_SHORT = { English: 'EN', German: 'DE', French: 'FR', Italian: 'IT' };

const ROLE_BY_CATEGORY = {
  walking: 'Walker',
  sitting: 'Sitter',
  grooming: 'Groomer',
  vet: 'Vet',
};

/* Map cornerBadge text → icon + meaning. Hover/tap on the icon could later
 * surface the label as a tooltip; for now the icon alone is the signal. */
const BADGE_ICON = {
  'Trusted':        { Icon: ShieldCheck, color: '#5F7387', title: 'Trusted · identity & insurance verified' },
  'Owner Favorite': { Icon: Heart,       color: '#E85D2A', fill: '#E85D2A', title: 'Owner favorite · loved by Fylos parents' },
  'Top Provider':   { Icon: Crown,       color: '#B0792E', title: 'Top provider · consistently high ratings' },
  'New':            { Icon: Sparkles,    color: '#E85D2A', title: 'New on Fylos' },
};

// Provider card — three layouts:
//   list  → vertical list row (Discover · Saved · search results)
//   rail  → horizontal carousel card (Recommended rail)
//   compact → tight one-liner (recently viewed)

const availabilityDot = (state) => {
  if (state === 'available') return 'bg-[#34C759]';
  if (state === 'soon') return 'bg-[#FF9500]';
  if (state === 'this-week') return 'bg-[#FFB020]';
  return 'bg-[#E5E5E5]';
};

const availabilityText = (state, fallback) => {
  if (state === 'booked') return 'Fully booked';
  return fallback || '';
};

const cornerBadgeStyle = (badge) => {
  if (badge === 'Top Provider') return 'bg-[#FFF6E8] text-[#B0792E] border-[#F3D7A1]';
  if (badge === 'Owner Favorite') return 'bg-[#EDF9F1] text-[#4D8A62] border-[#CFEAD7]';
  if (badge === 'Trusted') return 'bg-[#EEF2F6] text-[#5F7387] border-[#D8E1EA]';
  if (badge === 'New') return 'bg-[#FFF1EC] text-[#E85D2A] border-[#FFD9CC]';
  return 'bg-[#F3F3F5] text-[#7A7A80] border-black/[0.06]';
};

export default function ProviderCard({
  provider,
  layout = 'list',
  saved = false,
  onTap,
  onToggleSave,
  className = '',
  tag = null,
}) {
  // Tag styling helper — visible labeled pill (Top Rated, New, etc.)
  const renderTag = (size = 'sm') => {
    if (!tag) return null;
    const isTopRated = /top.?rated/i.test(tag);
    const isNew = /^new/i.test(tag);
    const styles = isTopRated
      ? { bg: '#FFF6E8', color: '#B0792E', border: 'rgba(176,121,46,0.18)' }
      : isNew
      ? { bg: '#FFF1EC', color: '#E85D2A', border: 'rgba(232,93,42,0.20)' }
      : { bg: '#F1EDE8', color: '#6E6E73', border: 'rgba(0,0,0,0.04)' };
    return (
      <span
        className={`inline-flex items-center gap-1 ${size === 'sm' ? 'h-[16px] px-1.5 text-[9px]' : 'h-[18px] px-2 text-[10px]'} rounded-full font-bold uppercase tracking-[0.06em] shrink-0`}
        style={{
          backgroundColor: styles.bg,
          color: styles.color,
          border: `1px solid ${styles.border}`,
        }}
      >
        {isTopRated && <Star size={size === 'sm' ? 8 : 9} fill={styles.color} color={styles.color} />}
        {isNew && <Sparkles size={size === 'sm' ? 8 : 9} color={styles.color} strokeWidth={2.4} />}
        {tag}
      </span>
    );
  };
  if (!provider) return null;
  const dot = availabilityDot(provider.availabilityState);
  const availLabel = availabilityText(provider.availabilityState, provider.availabilityLabel);
  const ratingNum = typeof provider.rating === 'number' ? provider.rating.toFixed(1) : provider.rating;

  if (layout === 'rail') {
    const badge = BADGE_ICON[provider.cornerBadge];
    const comesToYou =
      (provider.categoryIds || []).includes('walking') ||
      (provider.categoryIds || []).includes('sitting') ||
      /mobile|house.?call/i.test(provider.type || '');
    const role =
      ROLE_BY_CATEGORY[(provider.categoryIds || [])[0]] ||
      provider.type ||
      'Provider';

    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onTap && onTap(provider)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTap && onTap(provider)}
        className={`shrink-0 w-[200px] bg-white rounded-[16px] border border-black/[0.04] shadow-[0_1px_2px_rgba(0,0,0,0.025)] p-2.5 active:scale-[0.98] transition-all text-left cursor-pointer ${className}`}
      >
        {/* Photo with overlays */}
        <div className="relative mb-2.5">
          <img
            src={provider.photo}
            alt={provider.displayName}
            className="w-full aspect-[4/3] rounded-[12px] object-cover bg-[#F2F2F7]"
          />
          {/* Tag overlay top-left (e.g. "NEW") */}
          {tag && (
            <div className="absolute top-1.5 left-1.5">{renderTag('md')}</div>
          )}
          {/* Save overlay top-right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave && onToggleSave(provider);
            }}
            className="absolute top-1.5 right-1.5 w-[28px] h-[28px] rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)] active:scale-[0.92] transition-all"
            aria-label={saved ? 'Remove from saved' : 'Save'}
          >
            {saved ? (
              <BookmarkCheck size={13} className="text-[#E85D2A]" fill="#E85D2A" strokeWidth={2.2} />
            ) : (
              <Bookmark size={13} className="text-[#111111]" strokeWidth={2.2} />
            )}
          </button>
          {/* Rating pill bottom-left */}
          <span
            className="absolute bottom-1.5 left-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Star size={9} className="fill-[#E85D2A] text-[#E85D2A]" />
            <span className="text-[10.5px] font-bold text-[#1A1715] tabular-nums">
              {ratingNum}
            </span>
          </span>
        </div>

        {/* Line 1: Name + trust-icon */}
        <div className="flex items-center gap-1 mb-1 min-w-0">
          <span className="text-[13.5px] font-bold text-[#111111] tracking-[-0.01em] truncate min-w-0">
            {provider.displayName}
          </span>
          {badge ? (
            <span
              className="shrink-0 inline-flex items-center justify-center"
              aria-label={badge.title}
              title={badge.title}
            >
              <badge.Icon
                size={12}
                color={badge.color}
                fill={badge.fill || 'none'}
                strokeWidth={2.2}
              />
            </span>
          ) : null}
        </div>

        {/* Line 2: role chip (left) | price (right) */}
        <div className="flex items-center justify-between gap-2">
          {comesToYou ? (
            <span
              className="inline-flex items-center h-[18px] px-2 rounded-full text-[10.5px] font-semibold tracking-[-0.005em] shrink-0"
              style={{ backgroundColor: '#FFEDE3', color: '#B25030' }}
            >
              {role}
            </span>
          ) : (
            <span className="text-[11px] text-[#8E8E93] inline-flex items-center gap-1 shrink-0">
              <MapPin size={10} className="text-[#A09A94] shrink-0" strokeWidth={2.2} />
              {provider.distanceKm} km
            </span>
          )}
          <span className="text-[12px] truncate">
            <span className="text-[#111111] font-bold">
              {provider.currency} {provider.priceFrom}
            </span>
            {provider.priceUnit ? (
              <span className="opacity-60">/{provider.priceUnit}</span>
            ) : null}
          </span>
        </div>
      </div>
    );
  }

  if (layout === 'compact') {
    return (
      <button
        onClick={() => onTap && onTap(provider)}
        className={`shrink-0 flex items-center gap-2.5 bg-white border border-black/[0.04] rounded-full pl-1.5 pr-3 py-1 active:scale-[0.97] transition-all ${className}`}
      >
        <img
          src={provider.photo}
          alt=""
          className="w-7 h-7 rounded-full object-cover bg-[#F2F2F7]"
        />
        <span className="text-[12.5px] font-semibold text-[#111111]">{provider.displayName}</span>
      </button>
    );
  }

  // layout = 'list'
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onTap && onTap(provider)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTap && onTap(provider)}
      className={`w-full flex items-start gap-3 py-3.5 active:opacity-60 transition-opacity text-left cursor-pointer ${className}`}
    >
      <img
        src={provider.photo}
        alt={provider.displayName}
        className="w-[56px] h-[56px] rounded-[16px] object-cover shrink-0 bg-[#F2F2F7] mt-0.5"
      />
      <div className="flex-1 min-w-0">
        {tag ? <div className="mb-1.5">{renderTag('sm')}</div> : null}
        <div className="flex items-center gap-1.5 min-w-0 mb-1">
          <span className="text-[14.5px] font-semibold text-[#111111] truncate min-w-0 flex-1">
            {provider.displayName}
          </span>
        </div>
        <div className="flex items-center gap-1 text-[11.5px]">
          <Star size={10} className="fill-[#E85D2A] text-[#E85D2A] shrink-0" />
          <span className="font-semibold text-[#111111] tabular-nums">{ratingNum}</span>
          <span className="text-[#A09A94]">· {provider.reviewCount} reviews</span>
        </div>
      </div>
      <div className="flex flex-col items-end shrink-0 ml-1">
        <span className="text-[14px] font-bold text-[#111111] leading-none">
          {provider.currency} {provider.priceFrom}
        </span>
        {provider.priceUnit ? (
          <span className="text-[10px] text-[#8E8E93] mt-1">/{provider.priceUnit}</span>
        ) : null}
      </div>
      {onToggleSave ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(provider);
          }}
          className="ml-1 w-9 h-9 rounded-full flex items-center justify-center active:scale-[0.92] transition-all"
          aria-label={saved ? 'Remove from saved' : 'Save'}
        >
          {saved ? (
            <BookmarkCheck size={16} className="text-[#E85D2A]" fill="#E85D2A" strokeWidth={2.2} />
          ) : (
            <Bookmark size={16} className="text-[#A09A94]" strokeWidth={2.2} />
          )}
        </button>
      ) : null}
    </div>
  );
}
