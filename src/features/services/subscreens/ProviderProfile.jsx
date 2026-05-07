import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Star,
  ShieldCheck,
  Check,
  Clock,
  MapPin,
  Award,
  Bookmark,
  BookmarkCheck,
  MessageCircle,
  MoreHorizontal,
  Share2,
  Flag,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import SubScreenContainer from '../components/shared/SubScreenContainer';
import PrimaryCTA from '../components/shared/PrimaryCTA';
import SectionHeader from '../components/shared/SectionHeader';
import { findReviewsForProvider } from '../../../data/services';

// FYLOS · Services · Provider Profile (slide-in sub-screen)
// Canonical pattern: portal to #fylos-phone-root, z-[80] behind notch+dock,
// gradient sticky header, bottom-fade, peach-gradient sticky CTA + Message
// secondary, More sheet at z-[110].

export default function ProviderProfile({
  provider,
  data,
  onClose,
  onBook,
  onMessage,
  onOpenReviews,
}) {
  const [moreSheet, setMoreSheet] = useState(false);
  const saved = data?.isSaved ? data.isSaved(provider.id) : false;
  const reviews = findReviewsForProvider(provider.id).slice(0, 3);

  return (
    <>
      <SubScreenContainer
        title={provider.displayName}
        onClose={onClose}
        rightAction={{ icon: MoreHorizontal, onTap: () => setMoreSheet(true), ariaLabel: 'More' }}
        bottomCTA={
          <div className="flex gap-2">
            <PrimaryCTA
              variant="secondary"
              onTap={() => onMessage && onMessage(provider)}
              leadIcon={MessageCircle}
              className="!w-[120px] !flex-none"
            >
              Message
            </PrimaryCTA>
            <PrimaryCTA
              onTap={() => onBook && onBook(provider)}
              disabled={provider.availabilityState === 'booked'}
            >
              Book {provider.displayName.split(' ')[0]} ·
              <span className="opacity-80 font-normal">
                {' '}from {provider.currency} {provider.priceFrom}
              </span>
            </PrimaryCTA>
          </div>
        }
      >
        <div className="px-5">
          {/* ── Identity row ─────────────────────────────────────── */}
          <section className="flex items-start gap-4 pb-1">
            <img
              src={provider.photo}
              alt={provider.displayName}
              className="w-[88px] h-[88px] rounded-[22px] object-cover bg-[#F2F2F7]"
              style={{ boxShadow: '0 8px 22px rgba(0,0,0,0.06), inset 0 0 0 4px #FFFFFF' }}
            />
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-[22px] font-semibold tracking-[-0.3px] text-[#111111] leading-tight">
                {provider.name}
              </h1>
              <p className="text-[12.5px] text-[#8E8E93] mt-1">{provider.type}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <Star size={11} className="fill-[#E85D2A] text-[#E85D2A]" />
                <span className="text-[13px] font-bold text-[#111111]">
                  {(typeof provider.rating === 'number' ? provider.rating : Number(provider.rating || 0)).toFixed(1)}
                </span>
                <span className="text-[11px] text-[#8E8E93]">· {provider.reviewCount} reviews</span>
              </div>
            </div>
            <button
              onClick={() => data && data.toggleSaveProvider(provider.id)}
              className="w-[40px] h-[40px] rounded-full bg-white border border-black/[0.05] shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center justify-center active:scale-[0.94] transition-all"
              aria-label={saved ? 'Remove from saved' : 'Save'}
            >
              {saved ? (
                <BookmarkCheck size={16} className="text-[#E85D2A]" fill="#E85D2A" strokeWidth={2.2} />
              ) : (
                <Bookmark size={16} className="text-[#111111]" strokeWidth={2.2} />
              )}
            </button>
          </section>

          {/* ── Location & languages ─────────────────────────────── */}
          <section className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-4 mb-5 text-[12px] text-[#6E6E73]">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={11.5} className="text-[#A09A94]" strokeWidth={2.2} />
              {provider.location} · {provider.distanceKm} km
            </span>
            <span className="text-[#D1D1D6]">·</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={11.5} className="text-[#A09A94]" strokeWidth={2.2} />
              Replies {provider.responseTime}
            </span>
            {provider.languages?.length ? (
              <>
                <span className="text-[#D1D1D6]">·</span>
                <span>{provider.languages.join(' · ')}</span>
              </>
            ) : null}
          </section>

          {/* ── Stats strip ─────────────────────────────────────── */}
          <section className="grid grid-cols-3 gap-2 mb-5">
            <Stat label="Experience" value={`${provider.yearsExperience}y`} />
            <Stat label="Jobs" value={provider.jobsCompleted} />
            <Stat label="Repeat" value={`${Math.round(provider.jobsCompleted * 0.34)}x`} />
          </section>

          {/* ── Trust chips ─────────────────────────────────────── */}
          {provider.trustBadges?.length ? (
            <section className="flex flex-wrap gap-1.5 mb-6">
              {provider.trustBadges.map((b) => (
                <span
                  key={b}
                  className="h-[24px] px-2.5 rounded-full inline-flex items-center gap-1 text-[10.5px] font-semibold bg-[#EEF7F1] text-[#3F8D63] border border-[#D7EBDD]"
                >
                  <ShieldCheck size={10} strokeWidth={2.5} />
                  {b}
                </span>
              ))}
            </section>
          ) : null}

          {/* ── About ───────────────────────────────────────────── */}
          {provider.bio && (
            <section className="mb-6">
              <SectionHeader title="About" />
              <p className="text-[13.5px] text-[#3D3D44] leading-[1.6]">{provider.bio}</p>
            </section>
          )}

          {/* ── Services ────────────────────────────────────────── */}
          <section className="mb-6">
            <SectionHeader title="What they offer" />
            <div className="bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
              {provider.services.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => onBook && onBook(provider, { preselectedServiceId: svc.id })}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left active:opacity-70 transition-opacity"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-semibold text-[#111111] truncate">{svc.label}</span>
                      {svc.popular && (
                        <span className="text-[9px] font-bold uppercase tracking-[0.06em] text-[#E85D2A]">
                          Popular
                        </span>
                      )}
                    </div>
                    {svc.description && (
                      <span className="text-[12px] text-[#6E6E73] mt-0.5 block">{svc.description}</span>
                    )}
                  </div>
                  <span className="text-[14px] font-bold text-[#111111] shrink-0">
                    {provider.currency} {svc.price}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ── Availability strip ──────────────────────────────── */}
          <section className="mb-6">
            <SectionHeader title="This week" action="Full schedule" onAction={() => onBook && onBook(provider)} />
            <div className="bg-white rounded-[18px] border border-black/[0.04] p-3 grid grid-cols-7 gap-1">
              {Object.entries(provider.availability).slice(0, 7).map(([date, info]) => {
                const d = new Date(`${date}T00:00:00`);
                return (
                  <div key={date} className="flex flex-col items-center py-1.5">
                    <span className="text-[10px] font-semibold text-[#A09A94] mb-1">
                      {d.toLocaleDateString('en', { weekday: 'narrow' })}
                    </span>
                    <span
                      className={`w-7 h-7 flex items-center justify-center rounded-full text-[12.5px] font-bold ${
                        info.available ? 'bg-[#FFEDE3] text-[#E85D2A]' : 'text-[#D1D1D6]'
                      }`}
                    >
                      {d.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── Reviews ─────────────────────────────────────────── */}
          {reviews.length > 0 && (
            <section className="mb-6">
              <SectionHeader
                title="Reviews"
                action={`See all ${provider.reviewCount}`}
                onAction={() => onOpenReviews && onOpenReviews(provider)}
              />
              <div className="bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
                {reviews.map((rev) => (
                  <div key={rev.id} className="px-4 py-3.5">
                    <div className="flex items-center gap-2 mb-1.5">
                      {rev.author.photo ? (
                        <img src={rev.author.photo} alt="" className="w-7 h-7 rounded-full object-cover" />
                      ) : (
                        <span className="w-7 h-7 rounded-full bg-[#FFEDE3] text-[#E85D2A] text-[11px] font-bold flex items-center justify-center">
                          {rev.author.name?.charAt(0) || 'U'}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-[12.5px] font-semibold text-[#111111]">{rev.author.name}</span>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={8} className="fill-[#E85D2A] text-[#E85D2A]" />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-[#A09A94]">{rev.date}</span>
                    </div>
                    <p className="text-[12.5px] text-[#3D3D44] leading-[1.55] line-clamp-3">{rev.text}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Photos ──────────────────────────────────────────── */}
          {provider.gallery?.length > 0 && (
            <section className="mb-6">
              <SectionHeader title="Photos" />
              <div
                className="flex gap-2 overflow-x-auto -mx-5 px-5"
                style={{ scrollbarWidth: 'none' }}
              >
                {provider.gallery.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-[120px] h-[120px] rounded-[14px] object-cover shrink-0 bg-[#F2F2F7]"
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── Certifications ──────────────────────────────────── */}
          {provider.certifications?.length > 0 && (
            <section className="mb-2">
              <SectionHeader title="Certifications" />
              <div className="bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
                {provider.certifications.map((c) => (
                  <div key={c.type} className="flex items-center gap-3 px-4 py-3">
                    <span className="w-9 h-9 rounded-full bg-[#EEF7F1] flex items-center justify-center shrink-0">
                      <Check size={15} className="text-[#3F8D63]" strokeWidth={2.5} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[13.5px] font-semibold text-[#111111] block truncate">{c.label}</span>
                      <span className="text-[11.5px] text-[#8E8E93]">
                        {c.issuer || 'Fylos'}
                        {c.expiryDate ? ` · valid till ${c.expiryDate.slice(0, 7)}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </SubScreenContainer>

      {/* ── More sheet (z-[110]) ─────────────────────────────────── */}
      {moreSheet && <MoreSheet onClose={() => setMoreSheet(false)} />}
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="text-center py-3 rounded-[14px] bg-white border border-black/[0.04]">
      <span className="text-[16px] font-bold text-[#111111] block leading-none">{value}</span>
      <span className="text-[10px] text-[#8E8E93] mt-1.5 block uppercase tracking-wider">{label}</span>
    </div>
  );
}

function MoreSheet({ onClose }) {
  const items = [
    { Icon: Share2, label: 'Share profile', color: '#111111', bg: '#F2F2F7' },
    { Icon: Flag, label: 'Report', color: '#FF3B30', bg: '#FFF0F0' },
  ];
  const content = (
    <div className="absolute inset-0 z-[110] flex items-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div
        className="relative w-full bg-white rounded-t-[22px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col items-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
        </div>
        <div className="px-5 pb-8 pt-2">
          <h3 className="text-[17px] font-semibold text-[#111111] mb-3">Options</h3>
          <div className="flex flex-col gap-2">
            {items.map(({ Icon, label, color, bg }) => (
              <button
                key={label}
                onClick={onClose}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[14px] border border-black/[0.04] bg-white active:scale-[0.99] transition-all"
              >
                <span
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: bg }}
                >
                  <Icon size={16} style={{ color }} strokeWidth={2} />
                </span>
                <span className="text-[14px] font-semibold" style={{ color }}>
                  {label}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-full h-[46px] rounded-[14px] font-semibold text-[14px] text-[#111111] bg-[#F2F2F7] active:scale-[0.98] transition-all mt-3"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
  const mount =
    typeof document !== 'undefined' ? document.getElementById('fylos-phone-root') : null;
  return mount ? createPortal(content, mount) : content;
}
