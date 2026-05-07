import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronRight } from 'lucide-react';
import SubScreenContainer from '../components/shared/SubScreenContainer';
import { findProvider } from '../../../data/services';

// MessageThread — chat conversation. Pinned booking-context card at top,
// composer pinned via the SubScreenContainer's bottomCTA slot.

export default function MessageThread({ thread, data, onClose, onOpenBooking, onOpenProvider }) {
  const provider = thread?.providerId ? findProvider(thread.providerId) : null;
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (thread?.id && data?.markThreadRead) data.markThreadRead(thread.id);
  }, [thread?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = () => {
    if (!draft.trim()) return;
    data.sendMessage(thread.id, draft);
    setDraft('');
  };

  if (!thread || !provider) {
    return (
      <SubScreenContainer title="Message" onClose={onClose}>
        <div className="px-5 py-10 text-center text-[#8E8E93] text-[13px]">Conversation not found.</div>
      </SubScreenContainer>
    );
  }

  return (
    <SubScreenContainer
      title={provider.displayName}
      onClose={onClose}
      bottomCTA={
        <div className="flex items-center gap-2 bg-white border border-black/[0.06] rounded-[18px] px-3 py-2 shadow-[0_4px_14px_rgba(0,0,0,0.04)]">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${provider.displayName.split(' ')[0]}…`}
            className="flex-1 bg-transparent text-[13.5px] text-[#111111] placeholder:text-[#A09A94] outline-none px-1"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className={`w-[36px] h-[36px] rounded-full flex items-center justify-center transition-all ${
              draft.trim()
                ? 'bg-gradient-to-b from-[#FF7240] to-[#E85D2A] text-white active:scale-[0.95]'
                : 'bg-[#F2F2F7] text-[#C4BBB3] cursor-not-allowed'
            }`}
          >
            <Send size={14} strokeWidth={2.4} />
          </button>
        </div>
      }
    >
      <div className="px-5">
        {/* Pinned booking context */}
        {thread.pinnedContext?.kind === 'booking' && thread.pinnedContext.bookingId && (
          <button
            onClick={() => onOpenBooking && onOpenBooking(thread.pinnedContext.bookingId)}
            className="w-full bg-white border border-black/[0.04] rounded-[16px] p-3 flex items-center gap-3 mb-4 active:opacity-70 transition-opacity"
          >
            <span className="w-8 h-8 rounded-full bg-[#FFEDE3] flex items-center justify-center shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#E85D2A]" />
            </span>
            <div className="flex-1 min-w-0 text-left">
              <span className="text-[10.5px] font-semibold text-[#A09A94] uppercase tracking-wider block">Booking</span>
              <span className="text-[12.5px] font-semibold text-[#111111] block truncate">
                {thread.pinnedContext.label}
              </span>
            </div>
            <ChevronRight size={14} className="text-[#C4BBB3]" />
          </button>
        )}

        {/* Messages */}
        <div className="flex flex-col gap-2.5" ref={scrollRef}>
          {thread.messages.map((m) => {
            const mine = m.senderId === 'me';
            return (
              <div key={m.id} className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
                {!mine && (
                  <img
                    src={provider.photo}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover bg-[#F2F2F7] shrink-0"
                  />
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-[18px] text-[13.5px] leading-[1.45] ${
                    mine
                      ? 'bg-gradient-to-b from-[#FF7240] to-[#E85D2A] text-white'
                      : 'bg-white text-[#111111] border border-black/[0.04]'
                  }`}
                  style={
                    mine
                      ? { borderBottomRightRadius: 6 }
                      : { borderBottomLeftRadius: 6 }
                  }
                >
                  {m.text}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] text-[#A09A94] text-center mt-4">
          Messages stay between you and {provider.displayName.split(' ')[0]}. Don't share payment details.
        </p>
      </div>
    </SubScreenContainer>
  );
}
