import React from 'react';

/**
 * MemoryCard — native photo-card (Airbnb × Revolut × Uber feel).
 * One big photo (or two side-by-side), bold sans title with tabular meta,
 * peach vibe chips, flat coral share. No paper texture, no mono postmark.
 *
 * The in-app surface. The IG-Story export version lives in `MemoryShareCard`
 * (separate, can carry slightly more editorial polish).
 */
export default function MemoryCard({
  dogA,               // { name, photo }
  dogB,               // { name, photo }
  title,              // e.g. "Morning Walk"
  location = '',
  dateStr = '',
  duration = '',
  tags = [],
  onShare,
  onOpen,
  compact = false,
  className = '',
}) {
  return (
    <div
      className={`relative w-full rounded-[20px] bg-white overflow-hidden active:scale-[0.995] transition-transform ${className}`}
      style={{
        border: '1px solid #EDE8E2',
        boxShadow: '0 2px 10px rgba(30, 20, 10, 0.04)',
      }}
      onClick={onOpen}
    >
      {/* Photo row — two square photos side by side, fills top */}
      <div className="relative grid grid-cols-2 gap-[2px] bg-[#EDE8E2]">
        {[dogA, dogB].map((d, i) => (
          <div key={i} className="aspect-square bg-[#F3EFEB] overflow-hidden">
            {d?.photo ? (
              <img
                src={d.photo}
                alt={d?.name || ''}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-[#8E7A6B]"
                style={{ fontFamily: 'Inter Tight, Inter, sans-serif', fontSize: 40, fontWeight: 700 }}
              >
                {d?.name?.[0] || '·'}
              </div>
            )}
          </div>
        ))}
        {onShare && (
          <button
            onClick={(e) => { e.stopPropagation(); onShare(); }}
            className="absolute top-3 right-3 h-9 px-3 rounded-full bg-black/75 text-white text-[12px] font-semibold flex items-center gap-1.5 active:scale-[0.97]"
            aria-label="Share memory"
          >
            Share
          </button>
        )}
      </div>

      {/* Body */}
      <div className={compact ? 'px-4 pt-3 pb-4' : 'px-5 pt-4 pb-5'}>
        <div className="flex items-baseline justify-between gap-3">
          <h3
            className="text-[#1A1614] leading-[1.15]"
            style={{
              fontFamily: '"Inter Tight", Inter, sans-serif',
              fontSize: compact ? 18 : 22,
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            {dogA?.name} & {dogB?.name}
            {title && <span className="text-[#A09A94] font-medium"> · {title}</span>}
          </h3>
          {duration && (
            <span
              className="shrink-0 text-[#6E6058]"
              style={{
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.04em',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {duration}
            </span>
          )}
        </div>
        <div
          className="mt-1 text-[#6E6058]"
          style={{ fontSize: 13, fontWeight: 500 }}
        >
          {[location, dateStr].filter(Boolean).join(' · ')}
        </div>

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {tags.map((t, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: '#F3EFEB',
                  color: '#9A5A3E',
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
