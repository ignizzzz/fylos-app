import React, { useState } from 'react';
import { ChevronLeft, Star, Heart, Clock, Check, Camera, ChevronDown } from 'lucide-react';

const RATING_BREAKDOWN = [
  { stars: 5, percent: 85, count: 108 },
  { stars: 4, percent: 10, count: 13 },
  { stars: 3, percent: 3, count: 4 },
  { stars: 2, percent: 1, count: 1 },
  { stars: 1, percent: 1, count: 1 },
];

const FILTER_PILLS = ['All', '5 Stars', '4 Stars', '3 Stars', 'Recent', 'With Photos'];

const REVIEWS = [
  { id: 1, name: 'Emma F.', initials: 'EF', color: '#E8D5F5', date: 'Mar 12, 2026', rating: 5, service: '60 min Walk', text: 'Sofia was amazing with Max! She sent regular updates and photos during the walk. Will definitely book again.', photos: [1, 2], helpful: 3 },
  { id: 2, name: 'Thomas M.', initials: 'TM', color: '#D5E8F5', date: 'Mar 10, 2026', rating: 5, service: '60 min Walk', text: 'Very professional and punctual. Luna loved her walk through Seefeld Park.', photos: [], helpful: 7 },
  { id: 3, name: 'Lena K.', initials: 'LK', color: '#F5E8D5', date: 'Mar 8, 2026', rating: 4, service: '30 min Walk', text: 'Great service, though arrival was 10 min late. Otherwise perfect.', photos: [], helpful: 1 },
  { id: 4, name: 'Maria S.', initials: 'MS', color: '#D5F5E8', date: 'Mar 5, 2026', rating: 5, service: '60 min Walk', text: "Sofia is Luna's favorite walker! Always goes the extra mile. We've been booking with her weekly for the past 3 months and the consistency is remarkable. She knows all of Luna's quirks and preferences.", photos: [1, 2, 3], helpful: 12 },
  { id: 5, name: 'Jan P.', initials: 'JP', color: '#F5D5E8', date: 'Mar 2, 2026', rating: 4, service: '30 min Walk', text: 'Good walk but would have liked more photo updates.', photos: [], helpful: 0 },
  { id: 6, name: 'Anna B.', initials: 'AB', color: '#E8F5D5', date: 'Feb 28, 2026', rating: 5, service: '60 min Walk', text: 'Absolutely wonderful! My anxious dog was so calm with Sofia. She has a real gift with nervous pups. Highly recommend for any pet parent with a sensitive dog.', photos: [1], helpful: 9 },
  { id: 7, name: 'Lukas W.', initials: 'LW', color: '#D5D5F5', date: 'Feb 25, 2026', rating: 5, service: 'Pet Sitting', text: 'Left Benny with Sofia for 3 days and he was perfectly happy. She followed all our instructions carefully.', photos: [1, 2], helpful: 5 },
];

export default function ProviderReviewsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .pr-scroll::-webkit-scrollbar { display: none; }
        .pr-scroll { scrollbar-width: none; }
      `}</style>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <div className="relative" style={{
          width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
          overflow: 'hidden', backgroundColor: '#F7F5F2',
        }}>
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Floating Header */}
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <button
                onClick={() => window.history.back()}
                className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
                style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
              >
                <ChevronLeft size={22} color="#111" />
              </button>
              <h2 className="text-[17px] font-semibold text-[#111]">Reviews</h2>
              <button
                className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
                style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
              >
                <ChevronDown size={22} color="#111" />
              </button>
            </div>
          </header>

          {/* Scroll Content */}
          <div className="absolute inset-0 overflow-y-auto pt-[110px] pb-[140px] px-5" style={{ scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Rating Summary Card */}
              <div className="rounded-[20px] p-5" style={{ backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2' }}>
                <div className="flex items-center gap-5">
                  {/* Big Rating */}
                  <div className="text-center" style={{ minWidth: 80 }}>
                    <div className="text-[40px] font-bold text-[#111]" style={{ lineHeight: 1, letterSpacing: '-0.02em' }}>4.9</div>
                    <div className="flex justify-center mt-1.5 gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={14} fill="#E85D2A" stroke="#E85D2A" strokeWidth={2} />
                      ))}
                    </div>
                    <div className="text-[13px] text-[#6E6058] mt-1">127 reviews</div>
                  </div>

                  {/* Breakdown Bars */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    {RATING_BREAKDOWN.map(row => (
                      <div key={row.stars} className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-[#6E6058] w-3.5 text-right">{row.stars}</span>
                        <Star size={10} fill="#E85D2A" stroke="#E85D2A" />
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EDE8E2' }}>
                          <div style={{
                            width: `${row.percent}%`, height: '100%', borderRadius: 3,
                            background: 'linear-gradient(90deg, #FF7240, #E85D2A)',
                            transition: 'width 0.6s ease',
                          }} />
                        </div>
                        <span className="text-[11px] text-[#A09A94] w-6 text-right">{row.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', margin: '0 -20px', padding: '0 20px' }}>
                {FILTER_PILLS.map(pill => {
                  const isActive = activeFilter === pill;
                  return (
                    <button
                      key={pill}
                      onClick={() => setActiveFilter(pill)}
                      className="active:scale-[0.96] transition-all duration-[120ms]"
                      style={{
                        padding: '8px 16px', borderRadius: 9999, whiteSpace: 'nowrap', flexShrink: 0,
                        background: isActive ? '#111' : '#F3EFEB',
                        color: isActive ? '#FFFFFF' : '#6E6058',
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        border: isActive ? 'none' : '1px solid #EDE8E2',
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      }}
                    >{pill}</button>
                  );
                })}
              </div>

              {/* Reviews List */}
              <div className="rounded-[20px] overflow-hidden" style={{ backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2' }}>
                {REVIEWS.map((review, idx) => (
                  <ReviewCard key={review.id} review={review} isLast={idx === REVIEWS.length - 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ReviewCard({ review, isLast }) {
  const [expanded, setExpanded] = useState(false);
  const [helpful, setHelpful] = useState(false);
  const isLong = review.text.length > 120;

  return (
    <div style={{
      padding: '16px 20px',
      borderBottom: isLast ? 'none' : '1px dashed #CFCFD4',
    }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div style={{
            width: 40, height: 40, borderRadius: '50%', background: review.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 600, color: '#111', flexShrink: 0,
          }}>{review.initials}</div>
          <div>
            <div className="text-[15px] font-semibold text-[#111]">{review.name}</div>
            <div className="text-[13px] text-[#A09A94]">{review.date}</div>
          </div>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map(i => (
            <Star key={i} size={12} fill={i <= review.rating ? '#E85D2A' : 'none'} stroke={i <= review.rating ? '#E85D2A' : '#D5CEC7'} strokeWidth={2} />
          ))}
        </div>
      </div>

      {/* Service Badge */}
      <div className="mt-2.5">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-medium text-[#6E6058]" style={{ backgroundColor: '#EDE8E2' }}>
          <Clock size={10} />{review.service}
        </span>
      </div>

      {/* Review Text */}
      <div className="mt-2.5">
        <div
          className="text-[15px] text-[#111]"
          style={{
            lineHeight: 1.5,
            display: !expanded && isLong ? '-webkit-box' : 'block',
            WebkitLineClamp: !expanded && isLong ? 3 : 'unset',
            WebkitBoxOrient: 'vertical',
            overflow: !expanded && isLong ? 'hidden' : 'visible',
          }}
        >{review.text}</div>
        {isLong && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="active:scale-[0.97] transition-all duration-[120ms]"
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 0,
              fontSize: 13, fontWeight: 500, color: '#E85D2A', marginTop: 4,
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >Read more</button>
        )}
      </div>

      {/* Photos */}
      {review.photos.length > 0 && (
        <div className="flex gap-2 mt-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {review.photos.map((_, idx) => (
            <div key={idx} className="flex items-center justify-center shrink-0" style={{
              width: 64, height: 64, borderRadius: 12,
              background: '#EDE8E2', border: '1px solid #D5CEC7',
            }}>
              <Camera size={18} className="text-[#A09A94]" />
            </div>
          ))}
        </div>
      )}

      {/* Helpful */}
      <div className="mt-3">
        <button
          onClick={() => setHelpful(!helpful)}
          className="active:scale-[0.97] transition-all duration-[120ms]"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            fontSize: 12, fontWeight: 500,
            color: helpful ? '#E85D2A' : '#A09A94',
            padding: '4px 10px', borderRadius: 9999,
            background: helpful ? 'rgba(232,93,42,0.08)' : 'transparent',
            border: 'none', cursor: 'pointer',
            transition: 'color 200ms, background 200ms',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          <Heart size={13} fill={helpful ? '#E85D2A' : 'none'} />
          Helpful{(review.helpful + (helpful ? 1 : 0)) > 0 ? ` (${review.helpful + (helpful ? 1 : 0)})` : ''}
        </button>
      </div>
    </div>
  );
}
