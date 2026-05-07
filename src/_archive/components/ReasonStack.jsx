import React from 'react';

/**
 * ReasonStack — native sans, no paper. Replaces bare % with a short
 * list of one-line "why this match" reasons. Optional compact caps footer.
 *
 * Title small caps · coral dot bullets · ink sans body · thin hair divider above footer.
 */
export default function ReasonStack({
  title = 'Why this match',
  reasons = [],
  footer,               // e.g. 'CONFIRMED · 3 PLAYDATES'
  className = '',
}) {
  return (
    <div className={className}>
      <div
        className="text-[#8E7A6B] uppercase"
        style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.16em',
        }}
      >
        {title}
      </div>
      <ul className="mt-2 space-y-1">
        {reasons.map((r, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-[#1A1614]"
            style={{ fontSize: 13.5, fontWeight: 500, lineHeight: 1.35 }}
          >
            <span
              className="mt-[7px] h-[4px] w-[4px] rounded-full shrink-0"
              style={{ backgroundColor: '#E85D2A' }}
            />
            <span>{typeof r === 'string' ? r : r.value}</span>
          </li>
        ))}
      </ul>
      {footer && (
        <>
          <div className="h-px bg-[#EDE8E2] mt-3" />
          <div
            className="mt-2 text-[#8E7A6B] uppercase"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.16em',
            }}
          >
            {footer}
          </div>
        </>
      )}
    </div>
  );
}
