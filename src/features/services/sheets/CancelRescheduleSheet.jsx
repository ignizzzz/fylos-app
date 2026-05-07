import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Repeat, X as XIcon } from 'lucide-react';
import { CANCELLATION_REASONS } from '../../../data/services';
import PrimaryCTA from '../components/shared/PrimaryCTA';

// Cancel / Reschedule — bottom sheet (per FYLOS_SURFACE_PLAN: chat-style or
// short reason+confirm flow). z-[110] above tab dock.

export default function CancelRescheduleSheet({ booking, mode = 'cancel', onClose, onConfirm }) {
  const [reasonId, setReasonId] = useState(null);
  const [note, setNote] = useState('');

  const isCancel = mode === 'cancel';
  const title = isCancel ? 'Cancel booking' : 'Reschedule';
  const cta = isCancel ? 'Cancel booking' : 'Send reschedule request';

  const content = (
    <div className="absolute inset-0 z-[110] flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative w-full bg-white rounded-t-[22px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[78%] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col items-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
        </div>
        <div className="px-5 pt-2 pb-3 flex items-center justify-between">
          <h3 className="text-[17px] font-semibold text-[#111111]">{title}</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center"
            aria-label="Close"
          >
            <XIcon size={14} className="text-[#6E6E73]" strokeWidth={2.4} />
          </button>
        </div>

        <div className="px-5 pb-3 overflow-y-auto custom-scrollbar">
          {/* Booking summary */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-black/[0.04]">
            <img
              src={booking?.provider?.photo}
              alt=""
              className="w-10 h-10 rounded-[12px] object-cover bg-[#F2F2F7]"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[13.5px] font-semibold text-[#111111] block truncate">{booking?.service?.label}</span>
              <span className="text-[11.5px] text-[#8E8E93] block truncate">{booking?.dateTime?.formatted}</span>
            </div>
          </div>

          {isCancel ? (
            <>
              <h4 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2">Why?</h4>
              <div className="flex flex-col gap-1.5 mb-4">
                {CANCELLATION_REASONS.map((r) => {
                  const selected = r.id === reasonId;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setReasonId(r.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-[14px] text-left transition-colors ${
                        selected
                          ? 'bg-[#FFEDE3] border border-[#FFD9CC]'
                          : 'bg-white border border-black/[0.05]'
                      }`}
                    >
                      <span className={`text-[13.5px] ${selected ? 'font-semibold text-[#E85D2A]' : 'font-medium text-[#111111]'}`}>
                        {r.label}
                      </span>
                      <span
                        className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center ${
                          selected ? 'border-[#E85D2A]' : 'border-[#C4BBB3]'
                        }`}
                      >
                        {selected && <span className="w-2 h-2 bg-[#E85D2A] rounded-full" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`Anything you want to share with ${booking?.provider?.name?.split(' ')[0] || 'them'}? (optional)`}
                rows={2}
                className="w-full bg-white border border-black/[0.05] rounded-[14px] px-3.5 py-2.5 text-[13px] text-[#111111] placeholder:text-[#A09A94] outline-none focus:border-[#E85D2A]/40 resize-none"
              />

              <p className="text-[11.5px] text-[#8E8E93] leading-[1.5] mt-3">
                Free cancellation up to 24h before. After that, a 25% fee may apply.
              </p>
            </>
          ) : (
            <p className="text-[13px] text-[#3D3D44] leading-[1.55] mb-3">
              We'll send {booking?.provider?.name?.split(' ')[0] || 'them'} a reschedule request.
              They'll suggest new times that work — pick one and you're set. Your existing slot is held until then.
            </p>
          )}
        </div>

        <div className="px-5 py-4 border-t border-black/[0.04]">
          <PrimaryCTA
            onTap={() => onConfirm && onConfirm({ reasonId, note })}
            disabled={isCancel && !reasonId}
            leadIcon={isCancel ? XIcon : Repeat}
          >
            {cta}
          </PrimaryCTA>
        </div>
      </div>
    </div>
  );

  const mount =
    typeof document !== 'undefined' ? document.getElementById('fylos-phone-root') : null;
  return mount ? createPortal(content, mount) : content;
}
