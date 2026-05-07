import React from 'react';
import { ChevronRight } from 'lucide-react';
import BookingStatusBadge from './BookingStatusBadge';

// Compact booking row — used in Bookings list, Discover "upcoming" preview,
// and Home dashboard "next booking" card.

export default function BookingRow({ booking, onTap, showDivider = true }) {
  if (!booking) return null;
  return (
    <button
      onClick={() => onTap && onTap(booking)}
      className={`w-full flex items-center gap-3 py-3 text-left active:opacity-60 transition-opacity ${
        showDivider ? 'border-b border-black/[0.04]' : ''
      }`}
    >
      <img
        src={booking.provider?.photo}
        alt=""
        className="w-[44px] h-[44px] rounded-[14px] object-cover shrink-0 bg-[#F2F2F7]"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-semibold text-[#111111] truncate">
            {booking.service?.label || 'Service'}
          </span>
          <span className="text-[11px] text-[#8E8E93] shrink-0">·</span>
          <span className="text-[12px] text-[#6E6E73] truncate">{booking.provider?.name}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11.5px] text-[#8E8E93] truncate">
            {booking.dateTime?.formatted}
          </span>
          {booking.pet?.name ? (
            <>
              <span className="text-[#D1D1D6] text-[11px]">·</span>
              <span className="text-[11.5px] text-[#8E8E93] truncate">{booking.pet.name}</span>
            </>
          ) : null}
        </div>
        {booking.helper ? (
          <span className="text-[11px] text-[#A09A94] mt-1 truncate block">{booking.helper}</span>
        ) : null}
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <BookingStatusBadge status={booking.status} />
        <ChevronRight size={14} className="text-[#C4BBB3]" />
      </div>
    </button>
  );
}
