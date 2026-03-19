import React, { useState } from 'react';
import {
  ChevronLeft,
  Star,
  Filter,
  ChevronRight,
  Heart,
  Clock,
  Check,
  Camera,
  Circle,
  X,
  PawPrint,
  Info,
  ThumbsUp
} from 'lucide-react';

// ─── THEME ───────────────────────────────────────────────
const THEME = {
  colors: {
    accent: '#E85D2A', accentHover: '#D04A1C',
    primaryText: '#111111', secondaryText: '#6E6E73', tertiaryText: '#8E8E93',
    background: '#F9F9FB', surface: '#FFFFFF', surfaceAlt: '#F2F2F7',
    danger: '#FF3B30', success: '#00C060', warning: '#FF9500', info: '#007AFF', divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: { soft: '0 4px 20px rgba(0,0,0,0.03)', floating: '0 8px 24px rgba(0,0,0,0.08)' },
  motion: { tap: '120ms', fade: '200ms', tab: '240ms', spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
};

// ─── GLOBAL STYLES ───────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .provider-reviews-screen * {
      margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .provider-reviews-screen ::-webkit-scrollbar { display: none; }

    .provider-reviews-screen .scroll-h {
      overflow-x: auto; scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .provider-reviews-screen .scroll-h > * { scroll-snap-align: start; }

    .provider-reviews-screen .tap-btn {
      transition: transform ${THEME.motion.tap} ${THEME.motion.spring}, opacity ${THEME.motion.tap};
      cursor: pointer; user-select: none;
    }
    .provider-reviews-screen .tap-btn:active { transform: scale(0.97); opacity: 0.9; }

    .provider-reviews-screen .frosted {
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    }

    .provider-reviews-screen .line-clamp-3 {
      display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .provider-reviews-screen .fade-in {
      animation: fadeInUp 0.4s ease-out both;
    }
  `}</style>
);

// ─── HELPER: Use ThumbsUp if available, fallback to Heart ─
const HelpfulIcon = ThumbsUp || Heart;

// ─── DATA ────────────────────────────────────────────────
const RATING_BREAKDOWN = [
  { stars: 5, percent: 85, count: 108 },
  { stars: 4, percent: 10, count: 13 },
  { stars: 3, percent: 3, count: 4 },
  { stars: 2, percent: 1, count: 1 },
  { stars: 1, percent: 1, count: 1 },
];

const FILTER_PILLS = ['All', '5 Stars', '4 Stars', '3 Stars', 'Recent', 'With Photos'];

const REVIEWS = [
  {
    id: 1,
    name: 'Emma F.',
    initials: 'EF',
    color: '#E8D5F5',
    date: 'Mar 12, 2026',
    rating: 5,
    service: '60 min Walk',
    text: 'Sofia was amazing with Max! She sent regular updates and photos during the walk. Will definitely book again.',
    photos: [1, 2],
    helpful: 3,
  },
  {
    id: 2,
    name: 'Thomas M.',
    initials: 'TM',
    color: '#D5E8F5',
    date: 'Mar 10, 2026',
    rating: 5,
    service: '60 min Walk',
    text: 'Very professional and punctual. Luna loved her walk through Seefeld Park.',
    photos: [],
    helpful: 7,
  },
  {
    id: 3,
    name: 'Lena K.',
    initials: 'LK',
    color: '#F5E8D5',
    date: 'Mar 8, 2026',
    rating: 4,
    service: '30 min Walk',
    text: 'Great service, though arrival was 10 min late. Otherwise perfect.',
    photos: [],
    helpful: 1,
  },
  {
    id: 4,
    name: 'Maria S.',
    initials: 'MS',
    color: '#D5F5E8',
    date: 'Mar 5, 2026',
    rating: 5,
    service: '60 min Walk',
    text: 'Sofia is Luna\'s favorite walker! Always goes the extra mile. We\'ve been booking with her weekly for the past 3 months and the consistency is remarkable. She knows all of Luna\'s quirks and preferences.',
    photos: [1, 2, 3],
    helpful: 12,
  },
  {
    id: 5,
    name: 'Jan P.',
    initials: 'JP',
    color: '#F5D5E8',
    date: 'Mar 2, 2026',
    rating: 4,
    service: '30 min Walk',
    text: 'Good walk but would have liked more photo updates.',
    photos: [],
    helpful: 0,
  },
  {
    id: 6,
    name: 'Anna B.',
    initials: 'AB',
    color: '#E8F5D5',
    date: 'Feb 28, 2026',
    rating: 5,
    service: '60 min Walk',
    text: 'Absolutely wonderful! My anxious dog was so calm with Sofia. She has a real gift with nervous pups. Highly recommend for any pet parent with a sensitive dog.',
    photos: [1],
    helpful: 9,
  },
  {
    id: 7,
    name: 'Lukas W.',
    initials: 'LW',
    color: '#D5D5F5',
    date: 'Feb 25, 2026',
    rating: 5,
    service: 'Pet Sitting',
    text: 'Left Benny with Sofia for 3 days and he was perfectly happy. She followed all our instructions carefully.',
    photos: [1, 2],
    helpful: 5,
  },
];

// ─── STAR RATING COMPONENT ──────────────────────────────
const StarRating = ({ rating, size = 12 }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Star
        key={i}
        size={size}
        fill={i <= rating ? THEME.colors.accent : 'none'}
        stroke={i <= rating ? THEME.colors.accent : THEME.colors.divider}
        strokeWidth={2}
      />
    ))}
  </div>
);

// ─── RATING SUMMARY CARD ────────────────────────────────
const RatingSummaryCard = () => (
  <div style={{
    background: THEME.colors.surface,
    borderRadius: '20px',
    boxShadow: THEME.shadows.soft,
    padding: '20px',
    margin: '0 20px 16px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
      {/* Left: big rating */}
      <div style={{ textAlign: 'center', minWidth: 80 }}>
        <div style={{
          fontSize: 40,
          fontWeight: 700,
          color: THEME.colors.primaryText,
          lineHeight: 1,
        }}>4.9</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
          <StarRating rating={5} size={14} />
        </div>
        <div style={{
          fontSize: 13,
          color: THEME.colors.secondaryText,
          marginTop: 4,
        }}>127 reviews</div>
      </div>

      {/* Right: breakdown bars */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {RATING_BREAKDOWN.map(row => (
          <div key={row.stars} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 12,
              color: THEME.colors.secondaryText,
              width: 14,
              textAlign: 'right',
              fontWeight: 500,
            }}>{row.stars}</span>
            <Star size={10} fill={THEME.colors.accent} stroke={THEME.colors.accent} />
            <div style={{
              flex: 1,
              height: 6,
              background: THEME.colors.surfaceAlt,
              borderRadius: 3,
              overflow: 'hidden',
            }}>
              <div style={{
                width: `${row.percent}%`,
                height: '100%',
                background: THEME.colors.accent,
                borderRadius: 3,
                transition: 'width 0.6s ease',
              }} />
            </div>
            <span style={{
              fontSize: 11,
              color: THEME.colors.tertiaryText,
              width: 26,
              textAlign: 'right',
            }}>{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── FILTER PILLS ───────────────────────────────────────
const FilterPills = ({ active, onSelect }) => (
  <div className="scroll-h" style={{
    display: 'flex',
    gap: 8,
    padding: '0 20px 16px',
    overflowX: 'auto',
  }}>
    {FILTER_PILLS.map(pill => {
      const isActive = active === pill;
      return (
        <div
          key={pill}
          className="tap-btn"
          onClick={() => onSelect(pill)}
          style={{
            padding: '8px 16px',
            borderRadius: THEME.radius.full,
            background: isActive ? THEME.colors.primaryText : THEME.colors.surfaceAlt,
            color: isActive ? '#FFFFFF' : THEME.colors.secondaryText,
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: 'nowrap',
            flexShrink: 0,
            transition: `all ${THEME.motion.fade}`,
          }}
        >
          {pill}
        </div>
      );
    })}
  </div>
);

// ─── REVIEW CARD ────────────────────────────────────────
const ReviewCard = ({ review, isLast }) => {
  const [expanded, setExpanded] = useState(false);
  const [helpful, setHelpful] = useState(false);
  const isLong = review.text.length > 120;

  return (
    <div style={{
      padding: '16px 20px',
      borderBottom: isLast ? 'none' : `1px solid ${THEME.colors.divider}`,
    }}>
      {/* Reviewer header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Avatar */}
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: review.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 13,
            fontWeight: 600,
            color: THEME.colors.primaryText,
            flexShrink: 0,
          }}>
            {review.initials}
          </div>
          <div>
            <div style={{
              fontSize: 15,
              fontWeight: 500,
              color: THEME.colors.primaryText,
            }}>{review.name}</div>
            <div style={{
              fontSize: 12,
              color: THEME.colors.tertiaryText,
            }}>{review.date}</div>
          </div>
        </div>
        <StarRating rating={review.rating} size={12} />
      </div>

      {/* Service badge */}
      <div style={{ marginTop: 10 }}>
        <span style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: THEME.radius.full,
          background: THEME.colors.surfaceAlt,
          fontSize: 11,
          fontWeight: 500,
          color: THEME.colors.secondaryText,
        }}>
          <Clock size={10} style={{ verticalAlign: '-1px', marginRight: 3 }} />
          {review.service}
        </span>
      </div>

      {/* Review text */}
      <div style={{ marginTop: 10 }}>
        <div
          className={!expanded && isLong ? 'line-clamp-3' : undefined}
          style={{
            fontSize: 15,
            lineHeight: 1.5,
            color: THEME.colors.primaryText,
          }}
        >
          {review.text}
        </div>
        {isLong && !expanded && (
          <span
            className="tap-btn"
            onClick={() => setExpanded(true)}
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: THEME.colors.accent,
              marginTop: 4,
              display: 'inline-block',
            }}
          >
            Read more
          </span>
        )}
      </div>

      {/* Photos */}
      {review.photos.length > 0 && (
        <div className="scroll-h" style={{
          display: 'flex',
          gap: 8,
          marginTop: 12,
          overflowX: 'auto',
        }}>
          {review.photos.map((_, idx) => (
            <div key={idx} style={{
              width: 60,
              height: 60,
              borderRadius: THEME.radius.small,
              background: THEME.colors.surfaceAlt,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Camera size={18} stroke={THEME.colors.tertiaryText} />
            </div>
          ))}
        </div>
      )}

      {/* Helpful button */}
      <div style={{ marginTop: 12 }}>
        <span
          className="tap-btn"
          onClick={() => setHelpful(!helpful)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            fontSize: 12,
            fontWeight: 500,
            color: helpful ? THEME.colors.accent : THEME.colors.tertiaryText,
            transition: `color ${THEME.motion.fade}`,
          }}
        >
          <HelpfulIcon size={13} fill={helpful ? THEME.colors.accent : 'none'} />
          Helpful{review.helpful + (helpful ? 1 : 0) > 0
            ? ` (${review.helpful + (helpful ? 1 : 0)})`
            : ''}
        </span>
      </div>
    </div>
  );
};

// ─── MAIN SCREEN ────────────────────────────────────────
export default function ProviderReviewsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <div className="provider-reviews-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{
        width: 390,
        height: 844,
        borderRadius: 50,
        border: '8px solid #000',
        overflow: 'hidden',
        backgroundColor: '#F9F9FB',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Status bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
              <rect x="0" y="6" width="3" height="6" rx="1" fill="#111" />
              <rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111" />
              <rect x="9" y="2" width="3" height="10" rx="1" fill="#111" />
              <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111" />
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111" />
              <path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
              <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35" />
              <rect x="2" y="2" width="16" height="9" rx="2" fill="#111" />
              <path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            {/* Left: Back button */}
            <button
              onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <ChevronLeft size={22} color="#111111" />
            </button>
            {/* Center: Title */}
            <h2 className="text-[17px] font-semibold text-[#111111]">Reviews</h2>
            {/* Right: Filter button */}
            <button
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <Filter size={22} color="#111111" />
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="absolute inset-0 overflow-y-auto" style={{ paddingTop: 54, paddingBottom: 40 }}>
          {/* Rating summary */}
          <div style={{ paddingTop: 12 }}>
            <RatingSummaryCard />
          </div>

          {/* Filter pills */}
          <FilterPills active={activeFilter} onSelect={setActiveFilter} />

          {/* Reviews list */}
          <div className="fade-in" style={{
            background: THEME.colors.surface,
            borderRadius: '20px',
            boxShadow: THEME.shadows.soft,
            margin: '0 20px',
            overflow: 'hidden',
          }}>
            {REVIEWS.map((review, idx) => (
              <ReviewCard
                key={review.id}
                review={review}
                isLast={idx === REVIEWS.length - 1}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
