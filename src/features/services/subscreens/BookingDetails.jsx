import React, { useState } from 'react';
import {
  MapPin,
  Calendar as CalendarIcon,
  Clock,
  PawPrint,
  Receipt,
  MessageCircle,
  Repeat,
  X as XIcon,
  Star,
  Map as MapIcon,
  FileText,
  Check,
} from 'lucide-react';
import SubScreenContainer from '../components/shared/SubScreenContainer';
import PrimaryCTA from '../components/shared/PrimaryCTA';
import SectionHeader from '../components/shared/SectionHeader';
import BookingStatusBadge from '../components/shared/BookingStatusBadge';

// BookingDetails — slide-in. Status-aware actions + timeline + optional
// live-tracking peek for in-progress bookings.

const STATUS_COPY = {
  pending:    { title: 'Waiting for confirmation', sub: 'Usually under an hour.' },
  confirmed:  { title: 'You\'re booked', sub: 'We\'ll send a reminder before it starts.' },
  'in-progress': { title: 'Happening now', sub: 'Live updates appear below.' },
  completed:  { title: 'All done', sub: 'How was it? Your review helps the next pet parent.' },
  cancelled:  { title: 'Cancelled', sub: 'Nothing was charged.' },
  declined:   { title: 'Couldn\'t take it', sub: 'No charge — try another provider.' },
};

const TIMELINE_LABELS = {
  requested:  'Request sent',
  confirmed:  'Confirmed',
  started:    'Started',
  completed:  'Completed',
  cancelled:  'Cancelled',
  declined:   'Declined',
  reviewed:   'Reviewed',
  rescheduled: 'Rescheduled',
};

export default function BookingDetails({
  booking,
  onClose,
  onMessageProvider,
  onOpenProvider,
  onCancel,
  onReschedule,
  onTrackLive,
  onLeaveReview,
  onRebook,
}) {
  if (!booking) return null;
  const meta = STATUS_COPY[booking.status] || STATUS_COPY.completed;
  const isLive = booking.status === 'in-progress';

  return (
    <SubScreenContainer
      title="Booking"
      onClose={onClose}
      bottomCTA={renderCTA({ booking, onCancel, onReschedule, onTrackLive, onLeaveReview, onRebook })}
    >
      <div className="px-5">
        {/* Status banner */}
        <section className="mb-5 bg-white rounded-[18px] border border-black/[0.04] p-4">
          <div className="flex items-start justify-between gap-3 mb-1">
            <h2 className="text-[18px] font-semibold tracking-[-0.2px] text-[#111111]">{meta.title}</h2>
            <BookingStatusBadge status={booking.status} />
          </div>
          <p className="text-[12.5px] text-[#6E6E73] leading-[1.5]">{meta.sub}</p>
          {booking.helper && (
            <p className="text-[11.5px] text-[#A09A94] mt-2">{booking.helper}</p>
          )}
          {isLive && booking.liveProgress && (
            <div className="mt-3 pt-3 border-t border-black/[0.04] flex items-center gap-3">
              <span
                className="w-2 h-2 rounded-full bg-[#E85D2A]"
                style={{ animation: 'fylosPulse 1.4s ease-in-out infinite' }}
              />
              <div className="flex-1 min-w-0">
                <span className="text-[12px] font-semibold text-[#111111] block">
                  {booking.liveProgress.currentLocation || 'Active now'}
                </span>
                <span className="text-[11px] text-[#8E8E93]">
                  Last update {booking.liveProgress.lastUpdate} · {booking.liveProgress.photosShared || 0} photos shared
                </span>
              </div>
              {onTrackLive && (
                <button
                  onClick={() => onTrackLive(booking)}
                  className="h-[32px] px-3 rounded-full bg-[#FFEDE3] text-[#E85D2A] text-[11.5px] font-semibold flex items-center gap-1 active:scale-[0.97]"
                >
                  <MapIcon size={11} strokeWidth={2.4} />
                  Track
                </button>
              )}
            </div>
          )}
        </section>

        {/* Provider card */}
        <section className="mb-5 bg-white rounded-[18px] border border-black/[0.04] p-4">
          <div className="flex items-center gap-3">
            <img
              src={booking.provider?.photo}
              alt=""
              className="w-12 h-12 rounded-[14px] object-cover bg-[#F2F2F7]"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-semibold text-[#111111] block truncate">
                {booking.provider?.name}
              </span>
              <span className="text-[11.5px] text-[#8E8E93] flex items-center gap-1">
                <Star size={10} className="fill-[#E85D2A] text-[#E85D2A]" />
                {booking.provider?.rating}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={() => onMessageProvider && onMessageProvider(booking)}
              className="h-[40px] rounded-[12px] bg-[#FFEDE3] text-[#E85D2A] text-[12.5px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.97]"
            >
              <MessageCircle size={13} strokeWidth={2.4} />
              Message
            </button>
            <button
              onClick={() => onOpenProvider && onOpenProvider(booking)}
              className="h-[40px] rounded-[12px] bg-[#F2F2F7] text-[#111111] text-[12.5px] font-semibold flex items-center justify-center gap-1.5 active:scale-[0.97]"
            >
              View profile
            </button>
          </div>
        </section>

        {/* Booking facts */}
        <section className="mb-5 bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
          <FactRow icon={CalendarIcon} label="When" value={booking.dateTime?.formatted} />
          <FactRow icon={Clock} label="Service" value={`${booking.service?.label}${booking.service?.duration ? ` · ${booking.service.duration} min` : ''}`} />
          {booking.pet?.name && <FactRow icon={PawPrint} label="For" value={booking.pet.name} />}
          {booking.location && <FactRow icon={MapPin} label="Where" value={booking.location} />}
          <FactRow
            icon={Receipt}
            label="Total"
            value={`${booking.currency || 'CHF'} ${(booking.total || 0).toFixed(2)}`}
            valueBold
          />
        </section>

        {/* Add-ons (if any) */}
        {booking.addOns?.length > 0 && (
          <section className="mb-5">
            <SectionHeader title="Add-ons" />
            <div className="bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
              {booking.addOns.map((a) => (
                <div key={a.id} className="flex items-center justify-between px-4 py-3">
                  <span className="text-[13px] text-[#3D3D44]">{a.label}</span>
                  <span className="text-[13px] font-semibold text-[#111111]">
                    +{booking.currency || 'CHF'} {a.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Notes */}
        {booking.notes && (
          <section className="mb-5">
            <SectionHeader title="Your notes" />
            <div className="bg-white rounded-[18px] border border-black/[0.04] p-4 flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-[#FFEDE3] flex items-center justify-center shrink-0">
                <FileText size={13} className="text-[#E85D2A]" strokeWidth={2.2} />
              </span>
              <p className="text-[13px] text-[#3D3D44] leading-[1.55]">{booking.notes}</p>
            </div>
          </section>
        )}

        {/* Timeline */}
        <section className="mb-5">
          <SectionHeader title="Timeline" />
          <div className="bg-white rounded-[18px] border border-black/[0.04] p-4">
            {(booking.timeline || []).map((t, idx, arr) => (
              <React.Fragment key={`${t.event}_${idx}`}>
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                      idx === arr.length - 1 && booking.status !== 'completed' && booking.status !== 'cancelled'
                        ? 'bg-[#E85D2A]'
                        : 'bg-[#C4BBB3]'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[12.5px] font-semibold text-[#111111]">
                      {TIMELINE_LABELS[t.event] || t.event}
                      {t.by ? <span className="text-[#A09A94] font-medium"> · {t.by}</span> : null}
                    </span>
                    <span className="text-[11px] text-[#8E8E93] block">{formatTimestamp(t.at)}</span>
                    {t.reason && <span className="text-[11.5px] text-[#6E6E73] block mt-0.5">"{t.reason}"</span>}
                  </div>
                </div>
                {idx < arr.length - 1 && <div className="ml-1 my-1.5 w-[1px] h-3 bg-[#EDE8E2]" />}
              </React.Fragment>
            ))}
          </div>
        </section>
      </div>
    </SubScreenContainer>
  );
}

function FactRow({ icon: Icon, label, value, valueBold }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="w-9 h-9 rounded-full bg-[#FFEDE3] flex items-center justify-center shrink-0">
        <Icon size={15} className="text-[#E85D2A]" strokeWidth={2.2} />
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-[10.5px] font-semibold text-[#A09A94] uppercase tracking-wider block">{label}</span>
        <span className={`text-[13.5px] ${valueBold ? 'font-bold' : 'font-medium'} text-[#111111] block truncate`}>{value}</span>
      </div>
    </div>
  );
}

function renderCTA({ booking, onCancel, onReschedule, onTrackLive, onLeaveReview, onRebook }) {
  const status = booking.status;

  if (status === 'pending' || status === 'confirmed') {
    return (
      <div className="grid grid-cols-2 gap-2">
        <PrimaryCTA variant="secondary" onTap={() => onReschedule && onReschedule(booking)} leadIcon={Repeat}>
          Reschedule
        </PrimaryCTA>
        <PrimaryCTA variant="ghost" onTap={() => onCancel && onCancel(booking)} leadIcon={XIcon}>
          Cancel
        </PrimaryCTA>
      </div>
    );
  }

  if (status === 'in-progress') {
    return (
      <PrimaryCTA onTap={() => onTrackLive && onTrackLive(booking)} leadIcon={MapIcon}>
        Track live
      </PrimaryCTA>
    );
  }

  if (status === 'completed') {
    if (booking.reviewed) {
      return (
        <PrimaryCTA onTap={() => onRebook && onRebook(booking)} leadIcon={Repeat}>
          Book again
        </PrimaryCTA>
      );
    }
    return (
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <PrimaryCTA onTap={() => onLeaveReview && onLeaveReview(booking)} leadIcon={Star}>
          Leave a review
        </PrimaryCTA>
        <PrimaryCTA variant="secondary" onTap={() => onRebook && onRebook(booking)} className="!w-[120px] !flex-none">
          Rebook
        </PrimaryCTA>
      </div>
    );
  }

  // cancelled / declined
  return (
    <PrimaryCTA onTap={() => onRebook && onRebook(booking)} leadIcon={Repeat}>
      Find another provider
    </PrimaryCTA>
  );
}

function formatTimestamp(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return d.toLocaleString('en', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return iso;
  }
}
