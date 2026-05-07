import React, { useEffect, useState } from 'react';
import { Check, MessageCircle, Calendar as CalendarIcon, Compass } from 'lucide-react';
import SubScreenContainer from '../components/shared/SubScreenContainer';
import PrimaryCTA from '../components/shared/PrimaryCTA';

// Calm confirmation — no confetti, no streak/XP gamification.
// Soft tick + provider response timeline + 3 next-step actions.

export default function RequestSent({
  draft,
  bookingId,
  onClose,
  onViewBooking,
  onMessageProvider,
  onBrowseMore,
}) {
  const [showCheck, setShowCheck] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowCheck(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <SubScreenContainer title="Request sent" onClose={onClose}>
      <div className="px-5">
        {/* Soft tick (no confetti) */}
        <div className="flex flex-col items-center text-center pt-4 pb-6">
          <div
            className="w-[88px] h-[88px] rounded-full flex items-center justify-center mb-5 transition-all duration-[400ms]"
            style={{
              background: 'linear-gradient(145deg,#FFEDE3 0%,#FFD9C5 100%)',
              transform: showCheck ? 'scale(1)' : 'scale(0.85)',
              opacity: showCheck ? 1 : 0,
            }}
          >
            <span className="w-[58px] h-[58px] rounded-full bg-white flex items-center justify-center shadow-[0_4px_14px_rgba(232,93,42,0.15)]">
              <Check size={28} className="text-[#E85D2A]" strokeWidth={2.6} />
            </span>
          </div>
          <h2 className="text-[22px] font-semibold tracking-[-0.3px] text-[#111111] mb-2">
            Request sent
          </h2>
          <p className="text-[14px] text-[#6E6E73] leading-[1.55] max-w-[300px]">
            We let <span className="font-semibold text-[#111111]">{draft?.provider?.name}</span> know.
            They usually reply within an hour.
          </p>
        </div>

        {/* Booking glance card */}
        <section className="mb-5 bg-white rounded-[18px] border border-black/[0.04] p-4">
          <div className="flex items-center gap-3">
            <img
              src={draft?.provider?.photo}
              alt=""
              className="w-11 h-11 rounded-[14px] object-cover bg-[#F2F2F7]"
            />
            <div className="min-w-0 flex-1">
              <span className="text-[13.5px] font-semibold text-[#111111] block truncate">{draft?.service?.label}</span>
              <span className="text-[11.5px] text-[#8E8E93] block truncate">{draft?.dateTime?.formatted}</span>
            </div>
            <span className="h-[20px] px-2.5 rounded-full inline-flex items-center text-[10px] font-semibold bg-[#F7F4EF] text-[#B07A3A] border border-[#ECDDC8]">
              Pending
            </span>
          </div>
        </section>

        {/* Next steps */}
        <section className="mb-5">
          <div className="flex flex-col gap-2.5">
            <PrimaryCTA onTap={onViewBooking} leadIcon={CalendarIcon}>
              View booking
            </PrimaryCTA>
            <PrimaryCTA variant="secondary" onTap={onMessageProvider} leadIcon={MessageCircle}>
              Message {draft?.provider?.name?.split(' ')[0]}
            </PrimaryCTA>
            <PrimaryCTA variant="ghost" onTap={onBrowseMore} leadIcon={Compass}>
              Browse more providers
            </PrimaryCTA>
          </div>
        </section>

        {/* What happens next — calm timeline */}
        <section>
          <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">
            What happens next
          </h3>
          <div className="bg-white rounded-[18px] border border-black/[0.04] p-4">
            <Step
              tone="active"
              title="We're waiting"
              text={`${draft?.provider?.name?.split(' ')[0]} has 24 hours to confirm. We'll notify you the moment they do.`}
            />
            <Divider />
            <Step
              tone="upcoming"
              title="If they confirm"
              text="You'll be charged and we'll lock the slot in your bookings."
            />
            <Divider />
            <Step
              tone="upcoming"
              title="If they can't"
              text="Nothing is charged and we suggest similar providers nearby."
            />
          </div>
        </section>
      </div>
    </SubScreenContainer>
  );
}

function Divider() {
  return <div className="ml-3.5 my-1.5 w-[1px] h-3 bg-[#EDE8E2]" />;
}

function Step({ tone, title, text }) {
  return (
    <div className="flex items-start gap-3">
      <span
        className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
          tone === 'active' ? 'bg-[#E85D2A]' : 'bg-[#D1D1D6]'
        }`}
        style={tone === 'active' ? { animation: 'fylosPulse 1.6s ease-in-out infinite' } : undefined}
      />
      <div className="min-w-0">
        <span className="text-[13px] font-semibold text-[#111111] block">{title}</span>
        <p className="text-[12px] text-[#6E6E73] leading-[1.5] mt-0.5">{text}</p>
      </div>
    </div>
  );
}
