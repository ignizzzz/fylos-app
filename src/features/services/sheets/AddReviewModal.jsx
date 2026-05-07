import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, X as XIcon } from 'lucide-react';
import { REVIEW_TAGS } from '../../../data/services';
import PrimaryCTA from '../components/shared/PrimaryCTA';

// AddReview — center modal (per FYLOS_SURFACE_PLAN single-decision/visual moment).
// Star tap, tag chips, optional note. z-[110].

export default function AddReviewModal({ booking, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [tagIds, setTagIds] = useState([]);
  const [note, setNote] = useState('');

  const toggleTag = (id) =>
    setTagIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const content = (
    <div className="absolute inset-0 z-[110] flex items-center justify-center px-5" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative w-full max-w-[340px] bg-white rounded-[22px] shadow-[0_24px_60px_rgba(0,0,0,0.18)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 pt-4 pb-3 flex items-center justify-between">
          <h3 className="text-[16px] font-semibold text-[#111111]">How was it?</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F2F2F7] flex items-center justify-center"
            aria-label="Close"
          >
            <XIcon size={13} className="text-[#6E6E73]" strokeWidth={2.4} />
          </button>
        </div>

        <div className="px-5 pb-5">
          {/* Provider summary */}
          <div className="flex items-center gap-3 mb-4 pb-3 border-b border-black/[0.04]">
            <img
              src={booking?.provider?.photo}
              alt=""
              className="w-10 h-10 rounded-[12px] object-cover bg-[#F2F2F7]"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[13px] font-semibold text-[#111111] block truncate">{booking?.provider?.name}</span>
              <span className="text-[11px] text-[#8E8E93] block truncate">{booking?.service?.label}</span>
            </div>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((n) => {
              const filled = n <= rating;
              return (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className="active:scale-[0.92] transition-transform"
                >
                  <Star
                    size={28}
                    className={filled ? 'text-[#E85D2A]' : 'text-[#E5E5E5]'}
                    fill={filled ? '#E85D2A' : 'none'}
                    strokeWidth={2}
                  />
                </button>
              );
            })}
          </div>

          {rating > 0 && (
            <>
              <h4 className="text-[11.5px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2">
                What stood out?
              </h4>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {REVIEW_TAGS.map((t) => {
                  const selected = tagIds.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => toggleTag(t.id)}
                      className={`h-[28px] px-3 rounded-full text-[11.5px] font-semibold transition-colors ${
                        selected
                          ? 'bg-[#E85D2A] text-white'
                          : 'bg-white text-[#111111] border border-black/[0.05]'
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything more to share? (optional)"
                rows={2}
                className="w-full bg-[#F9F9FB] border border-black/[0.05] rounded-[12px] px-3 py-2.5 text-[13px] text-[#111111] placeholder:text-[#A09A94] outline-none focus:border-[#E85D2A]/40 resize-none mb-4"
              />
            </>
          )}

          <PrimaryCTA
            disabled={rating === 0}
            onTap={() =>
              onSubmit && onSubmit({ rating, tagIds, note: note.trim(), bookingId: booking?.id })
            }
          >
            Send review
          </PrimaryCTA>
        </div>
      </div>
    </div>
  );

  const mount =
    typeof document !== 'undefined' ? document.getElementById('fylos-phone-root') : null;
  return mount ? createPortal(content, mount) : content;
}
