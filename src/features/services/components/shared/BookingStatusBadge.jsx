import React from 'react';

// Status badge — uses FYLOS_DESIGN_SYSTEM tokens.
// Variants:
//   confirmed   → green
//   pending     → amber
//   in-progress → orange peach
//   completed   → grey-blue (calm, no celebratory tone)
//   cancelled   → soft grey
//   declined    → soft red

const STYLES = {
  confirmed:   { bg: '#EEF7F1', fg: '#3F8D63', bd: '#D7EBDD', label: 'Confirmed' },
  pending:     { bg: '#F7F4EF', fg: '#B07A3A', bd: '#ECDDC8', label: 'Pending' },
  'in-progress': { bg: '#FFF1EC', fg: '#E85D2A', bd: '#FFD9CC', label: 'In progress', live: true },
  completed:   { bg: '#EEF2F6', fg: '#5F7387', bd: '#D8E1EA', label: 'Completed' },
  cancelled:   { bg: '#F3F3F5', fg: '#7A7A80', bd: 'rgba(0,0,0,0.06)', label: 'Cancelled' },
  declined:    { bg: '#FFF0F0', fg: '#D96852', bd: '#F4D5CE', label: 'Declined' },
};

export default function BookingStatusBadge({ status, size = 'md' }) {
  const meta = STYLES[status] || STYLES.completed;
  const cls = size === 'sm'
    ? 'h-[18px] px-2 text-[9px]'
    : 'h-[20px] px-2.5 text-[10px]';
  return (
    <span
      className={`${cls} rounded-full font-semibold inline-flex items-center gap-1 border whitespace-nowrap`}
      style={{ backgroundColor: meta.bg, color: meta.fg, borderColor: meta.bd }}
    >
      {meta.live && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: meta.fg, animation: 'fylosPulse 1.4s ease-in-out infinite' }}
        />
      )}
      {meta.label}
    </span>
  );
}
