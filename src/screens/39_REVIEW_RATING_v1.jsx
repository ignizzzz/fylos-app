import React, { useState, useRef } from 'react';
import { ChevronLeft, Star, Check, Clock, Shield, Camera, X, Heart, MessageCircle, ThumbsUp } from 'lucide-react';

/**
 * 39_REVIEW_RATING_v1.jsx
 * Review & Rating screen for a completed service.
 * Fylos Design System — ultra-minimal, calm premium.
 */

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

const QUICK_TAGS = ['Punctual', 'Friendly', 'Great with pets', 'Professional', 'Clean'];
const RATING_LABELS = ['Tap to rate', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    .rv-body { font-family: 'Inter', -apple-system, sans-serif; }
    .rv-scroll::-webkit-scrollbar { display: none; }
    .rv-scroll { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes rv-fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes rv-slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes rv-starPop { 0% { transform: scale(1); } 40% { transform: scale(1.4); } 100% { transform: scale(1); } }
    @keyframes rv-successScale { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }

    .rv-tap { transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease; cursor: pointer; }
    .rv-tap:active { transform: scale(0.96); }

    .rv-textarea {
      width: 100%; resize: none; box-sizing: border-box;
      border: 1.5px solid ${THEME.colors.divider};
      border-radius: 16px; padding: 14px 16px;
      font-family: 'Inter', sans-serif; font-size: 15px; color: ${THEME.colors.primaryText};
      background: ${THEME.colors.surface}; outline: none;
      min-height: 120px; line-height: 1.5;
      transition: border-color ${THEME.motion.fade} ease, box-shadow ${THEME.motion.fade} ease;
    }
    .rv-textarea:focus {
      border-color: ${THEME.colors.accent};
      box-shadow: 0 0 0 3px rgba(232,93,42,0.08);
    }
    .rv-textarea::placeholder { color: ${THEME.colors.tertiaryText}; }
  `}</style>
);

// --- Star Rating ---
const StarRating = ({ value, onChange }) => {
  const [animIdx, setAnimIdx] = useState(null);
  const tap = (i) => { setAnimIdx(i); setTimeout(() => setAnimIdx(null), 300); onChange(i + 1); };
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      {[0, 1, 2, 3, 4].map(i => {
        const filled = i < value;
        return (
          <button key={i} onClick={() => tap(i)} style={{
            background: 'none', border: 'none', padding: '4px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: animIdx === i ? `rv-starPop 0.3s ${THEME.motion.spring}` : 'none',
            transition: `transform ${THEME.motion.tap} ease`
          }}>
            <Star size={32} style={{ fill: filled ? THEME.colors.accent : 'none', stroke: filled ? THEME.colors.accent : '#D1D1D6', transition: `fill 150ms ease, stroke 150ms ease` }} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
};

// --- Success Overlay ---
const SuccessOverlay = () => (
  <div style={{
    position: 'absolute', inset: 0, zIndex: 200, background: 'rgba(255,255,255,0.97)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    animation: 'rv-fadeIn 0.3s ease-out'
  }}>
    <div style={{
      width: 80, height: 80, borderRadius: '50%', background: `${THEME.colors.success}14`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      animation: `rv-successScale 0.5s ${THEME.motion.spring} 0.1s both`
    }}>
      <Check size={40} color={THEME.colors.success} strokeWidth={2.5} />
    </div>
    <div style={{ fontSize: 22, fontWeight: 600, color: THEME.colors.primaryText, marginBottom: 8 }}>Thank you!</div>
    <div style={{ fontSize: 15, color: THEME.colors.secondaryText, textAlign: 'center', maxWidth: 240, lineHeight: 1.5 }}>
      Your review helps others find great service providers.
    </div>
  </div>
);

// --- MAIN COMPONENT ---
const ReviewRatingScreen = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = rating > 0 && !isSubmitting;

  const toggleTag = (tag) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setTimeout(() => { setSubmitted(true); setTimeout(() => { window.location.href = '/'; }, 1500); }, 400);
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
        <div className="relative rv-body" style={{
          width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
          overflow: 'hidden', backgroundColor: '#F9F9FB',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}>
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="0.5" fill="#111"/><rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="0.5" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#111"/><path d="M4.93 7.83a4.38 4.38 0 016.14 0" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/><path d="M2.4 5.3a7.88 7.88 0 0111.2 0" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="2.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="19" height="9" rx="1.5" fill="#111"/><path d="M24 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="absolute inset-0 overflow-y-auto rv-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>
            {/* Spacer for floating header */}
            <div style={{ height: 44 }} />

            {/* Content */}
            <div style={{ padding: '16px 16px 24px' }}>
              {/* Provider Card */}
              <div style={{
                background: THEME.colors.surface, borderRadius: 20, padding: 20,
                boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)', marginBottom: 16,
                animation: 'rv-slideUp 0.35s ease-out both'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FF7240, #E85D2A)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: 18, fontWeight: 700, color: '#FFFFFF'
                  }}>SM</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText, marginBottom: 2 }}>Sarah Mitchell</div>
                    <div style={{ fontSize: 13, color: THEME.colors.secondaryText }}>Dog Walking</div>
                  </div>
                  <div style={{ fontSize: 13, color: THEME.colors.tertiaryText, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} strokeWidth={2} />Mar 15
                  </div>
                </div>
              </div>

              {/* Star Rating Card */}
              <div style={{
                background: THEME.colors.surface, borderRadius: 20, padding: 20,
                boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)', marginBottom: 16,
                animation: 'rv-slideUp 0.35s ease-out 0.05s both'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <StarRating value={rating} onChange={setRating} />
                  <span key={rating} style={{
                    fontSize: 15, fontWeight: 600,
                    color: rating === 0 ? THEME.colors.tertiaryText : THEME.colors.accent,
                    transition: `color ${THEME.motion.fade} ease`
                  }}>{RATING_LABELS[rating]}</span>
                </div>
              </div>

              {/* Quick Tags */}
              <div style={{
                background: THEME.colors.surface, borderRadius: 20, padding: 20,
                boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)', marginBottom: 16,
                animation: 'rv-slideUp 0.35s ease-out 0.1s both'
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.secondaryText, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Highlights
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {QUICK_TAGS.map(tag => {
                    const selected = selectedTags.includes(tag);
                    return (
                      <button key={tag} className="rv-tap" onClick={() => toggleTag(tag)} style={{
                        padding: '8px 16px', borderRadius: THEME.radius.full,
                        border: `1.5px solid ${selected ? THEME.colors.accent : THEME.colors.divider}`,
                        background: selected ? `${THEME.colors.accent}0F` : THEME.colors.surface,
                        color: selected ? THEME.colors.accent : THEME.colors.secondaryText,
                        fontSize: 13, fontWeight: 600, fontFamily: 'Inter, sans-serif',
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        transition: `all ${THEME.motion.tap} ease`,
                        display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        {selected && <Check size={14} strokeWidth={2.5} />}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Review Text Area */}
              <div style={{
                background: THEME.colors.surface, borderRadius: 20, padding: 20,
                boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)', marginBottom: 16,
                animation: 'rv-slideUp 0.35s ease-out 0.15s both'
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.secondaryText, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Your Review
                </div>
                <textarea className="rv-textarea" placeholder="Share your experience..." value={reviewText} onChange={e => setReviewText(e.target.value)} maxLength={500} />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                  <span style={{ fontSize: 13, color: THEME.colors.tertiaryText }}>{reviewText.length}/500</span>
                </div>
              </div>

              {/* Submit button */}
              <div style={{ padding: '0 4px' }}>
                <button className="rv-tap" onClick={handleSubmit} disabled={!canSubmit} style={{
                  width: '100%', height: 52, borderRadius: THEME.radius.medium, border: 'none',
                  background: canSubmit ? 'linear-gradient(135deg, #FF7240, #E85D2A)' : THEME.colors.surfaceAlt,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  cursor: canSubmit ? 'pointer' : 'not-allowed',
                  boxShadow: canSubmit ? '0 8px 24px rgba(232,93,42,0.3)' : 'none',
                  transition: `all ${THEME.motion.fade} ease`
                }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: canSubmit ? '#FFFFFF' : THEME.colors.tertiaryText, letterSpacing: '-0.2px' }}>
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </span>
                </button>
              </div>
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
              <h2 className="text-[17px] font-semibold text-[#111111]">Rate Service</h2>
              {/* Right: Invisible spacer */}
              <div className="w-[44px]" />
            </div>
          </header>

          {/* Success Overlay */}
          {submitted && <SuccessOverlay />}
        </div>
      </div>
    </>
  );
};

export default ReviewRatingScreen;
