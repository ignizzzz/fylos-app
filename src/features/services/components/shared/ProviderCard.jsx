import React from 'react';
import { Star, Bookmark, BookmarkCheck, ShieldCheck, Lock } from 'lucide-react';

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
}) {
  if (!provider) return null;
  const dot = availabilityDot(provider.availabilityState);
  const availLabel = availabilityText(provider.availabilityState, provider.availabilityLabel);
  const ratingNum = typeof provider.rating === 'number' ? provider.rating.toFixed(1) : provider.rating;

  if (layout === 'rail') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => onTap && onTap(provider)}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onTap && onTap(provider)}
        className={`shrink-0 w-[220px] bg-white rounded-[20px] border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] p-3 active:scale-[0.98] transition-all text-left cursor-pointer ${className}`}
      >
        <div className="relative mb-3">
          <img
            src={provider.photo}
            alt={provider.displayName}
            className="w-full aspect-square rounded-[14px] object-cover bg-[#F2F2F7]"
          />
          {provider.cornerBadge && (
            <span
              className={`absolute top-2 left-2 h-[20px] px-2 rounded-full text-[9.5px] font-semibold inline-flex items-center border ${cornerBadgeStyle(
                provider.cornerBadge
              )}`}
            >
              {provider.cornerBadge}
            </span>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave && onToggleSave(provider);
            }}
            className="absolute top-2 right-2 w-[30px] h-[30px] rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-[0_2px_6px_rgba(0,0,0,0.06)] active:scale-[0.92] transition-all"
            aria-label={saved ? 'Remove from saved' : 'Save'}
          >
            {saved ? (
              <BookmarkCheck size={14} className="text-[#E85D2A]" fill="#E85D2A" strokeWidth={2.2} />
            ) : (
              <Bookmark size={14} className="text-[#111111]" strokeWidth={2.2} />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="text-[14px] font-semibold text-[#111111] truncate">{provider.displayName}</span>
          <Star size={10} className="fill-[#E85D2A] text-[#E85D2A] shrink-0" />
          <span className="text-[12px] font-semibold text-[#111111]">{ratingNum}</span>
        </div>
        <p className="text-[11px] text-[#8E8E93] mb-2 truncate">{provider.type} · {provider.distanceKm} km</p>

        <div className="flex items-center justify-between">
          <span className="text-[12px] text-[#6E6E73]">
            <span className="text-[#111111] font-bold">
              {provider.currency} {provider.priceFrom}
            </span>
            {provider.priceUnit ? <span className="opacity-60"> /{provider.priceUnit}</span> : null}
          </span>
          {availLabel ? (
            <span className="flex items-center gap-1 text-[10.5px] text-[#6E6E73]">
              <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
              {availLabel}
            </span>
          ) : null}
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
      className={`w-full flex items-center gap-3 py-3.5 active:opacity-60 transition-opacity text-left cursor-pointer ${className}`}
    >
      <img
        src={provider.photo}
        alt={provider.displayName}
        className="w-[52px] h-[52px] rounded-[16px] object-cover shrink-0 bg-[#F2F2F7]"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[14.5px] font-semibold text-[#111111] truncate">{provider.displayName}</span>
          <Star size={10} className="fill-[#E85D2A] text-[#E85D2A] shrink-0" />
          <span className="text-[12px] font-semibold text-[#111111]">{ratingNum}</span>
          <span className="text-[11px] text-[#8E8E93] shrink-0">· {provider.reviewCount}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-[11.5px] text-[#8E8E93] truncate">{provider.type}</span>
          {availLabel ? (
            <>
              <span className="text-[#D1D1D6]">·</span>
              <span className="flex items-center gap-1 text-[11px] text-[#6E6E73] shrink-0">
                <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                {availLabel}
              </span>
            </>
          ) : null}
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
