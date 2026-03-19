import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  Calendar,
  Check,
  ChevronRight,
  ArrowRight,
  Send,
  Shield,
  X,
  Phone,
  PawPrint
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

    .provider-detail-screen * {
      margin: 0; padding: 0; box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    .provider-detail-screen ::-webkit-scrollbar { display: none; }

    .provider-detail-screen .scroll-h {
      overflow-x: auto; scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    .provider-detail-screen .scroll-h > * { scroll-snap-align: start; }

    .provider-detail-screen .tap-btn {
      transition: transform ${THEME.motion.tap} ${THEME.motion.spring}, opacity ${THEME.motion.tap};
      cursor: pointer; user-select: none;
    }
    .provider-detail-screen .tap-btn:active { transform: scale(0.97); opacity: 0.9; }

    .provider-detail-screen .frosted {
      background: rgba(255,255,255,0.8);
      backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    }

    .provider-detail-screen .line-clamp-2 {
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }
    .provider-detail-screen .line-clamp-4 {
      display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
    }

    .provider-detail-screen .gradient-btn {
      background: linear-gradient(135deg, #FF7240 0%, #E85D2A 100%);
      color: white; border: none; cursor: pointer;
      transition: transform ${THEME.motion.tap} ${THEME.motion.spring};
    }
    .provider-detail-screen .gradient-btn:active { transform: scale(0.97); }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .provider-detail-screen .fade-in-up {
      animation: fadeInUp 0.4s ease-out both;
    }
  `}</style>
);

// ─── MOCK DATA ───────────────────────────────────────────
const PROVIDER = {
  name: 'Sofia Lehmann',
  initials: 'SL',
  role: 'Dog Walker',
  rating: 4.9,
  reviewCount: 127,
  location: 'Zürich, Seefeld',
  responseTime: 'Usually responds within 15 min',
  bio: 'Passionate animal lover with 5+ years of professional pet care experience. I treat every dog like my own — with patience, love, and lots of outdoor adventures. Certified in pet first aid and experienced with all breeds from tiny Chihuahuas to giant Great Danes. I believe every walk should be an enriching experience.',
  services: [
    { name: '30 min Walk', price: 'CHF 25' },
    { name: '60 min Walk', price: 'CHF 40' },
    { name: 'Day Care', price: 'CHF 65' },
    { name: 'Overnight Stay', price: 'CHF 85' },
  ],
  availability: [
    { day: 'Mon', available: true },
    { day: 'Tue', available: true },
    { day: 'Wed', available: false },
    { day: 'Thu', available: true },
    { day: 'Fri', available: true },
    { day: 'Sat', available: true },
    { day: 'Sun', available: false },
  ],
  nextAvailable: 'Tomorrow, 9:00 AM',
  badges: ['Verified ✓', 'First Aid', 'Insured', '50+ Walks'],
  reviews: [
    {
      id: 1, name: 'Lena M.', date: '2 weeks ago', rating: 5, initials: 'LM', color: '#E8D5F5',
      text: 'Sofia is absolutely wonderful with our Golden Retriever. She sends photos during every walk and Max always comes home happy and tired!'
    },
    {
      id: 2, name: 'Thomas B.', date: '1 month ago', rating: 5, initials: 'TB', color: '#D5EDE8',
      text: 'Very reliable and professional. Our anxious rescue dog took to her immediately which says a lot. Highly recommended.'
    },
    {
      id: 3, name: 'Mira K.', date: '1 month ago', rating: 4, initials: 'MK', color: '#F5E6D5',
      text: 'Great communication and really cares about the dogs. Would book again without hesitation.'
    },
  ],
  galleryColors: ['#FFE5D9', '#D5E8F0', '#E8F0D5', '#F0D5E8'],
};

// ─── STATUS BAR (reference) ──────────────────────────────
// Status bar is now rendered inline in the main component

// ─── NOTCH (reference) ───────────────────────────────────
// Notch is now rendered inline in the main component

// ─── HOME INDICATOR (reference) ──────────────────────────
// Home indicator is now rendered inline in the main component

// ─── SECTION LABEL ───────────────────────────────────────
const SectionLabel = ({ children, right }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
    <span style={{
      fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: THEME.colors.tertiaryText,
    }}>{children}</span>
    {right}
  </div>
);

// ─── AVATAR ──────────────────────────────────────────────
const Avatar = ({ initials, size = 96, color = '#FFE5D9', fontSize = '32px' }) => (
  <div style={{
    width: `${size}px`, height: `${size}px`, borderRadius: '50%',
    background: `linear-gradient(135deg, ${color}, #F0D5C8)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize, fontWeight: 600, color: THEME.colors.accent,
    flexShrink: 0,
  }}>
    {initials}
  </div>
);

// ─── STAR ROW ────────────────────────────────────────────
const StarRow = ({ rating, size = 12 }) => (
  <div style={{ display: 'flex', gap: '2px' }}>
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} size={size} fill={i <= rating ? THEME.colors.accent : 'none'}
        stroke={i <= rating ? THEME.colors.accent : THEME.colors.divider} strokeWidth={2} />
    ))}
  </div>
);

// ─── MAIN COMPONENT ──────────────────────────────────────
const ProviderDetailScreen = () => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const scrollRef = useRef(null);

  const p = PROVIDER;

  return (
    <div className="provider-detail-screen" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#F9F9FB', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="7" width="3" height="5" rx="1" fill="#111"/><rect x="4.5" y="5" width="3" height="7" rx="1" fill="#111"/><rect x="9" y="2.5" width="3" height="9.5" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#111"/><path d="M4.75 7.75a4.75 4.75 0 016.5 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2 5a8 8 0 0112 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="12" viewBox="0 0 27 12" fill="none"><rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="19" height="8" rx="1.5" fill="#111"/><path d="M24 4v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
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
            <h2 className="text-[17px] font-semibold text-[#111111]">{p.name}</h2>
            {/* Right: Heart + Share grouped pill */}
            <div className="flex items-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] p-1">
              <button onClick={() => setLiked(!liked)} className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]">
                <Heart size={20} color={liked ? THEME.colors.danger : "#111111"} fill={liked ? THEME.colors.danger : "none"} strokeWidth={2} />
              </button>
              <div className="w-[1px] h-[20px] bg-black/[0.06]" />
              <button className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]">
                <Send size={20} color="#111111" strokeWidth={2} />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div ref={scrollRef} className="absolute inset-0 overflow-y-auto" style={{ paddingTop: 54, paddingBottom: 40 }}>

          {/* ─── PROFILE HEADER ─── */}
          <div className="fade-in-up" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '20px 20px 0', gap: '10px',
          }}>
            <Avatar initials={p.initials} size={96} />

            <div style={{ textAlign: 'center' }}>
              <h1 style={{
                fontSize: '22px', fontWeight: 600, color: THEME.colors.primaryText,
                letterSpacing: '-0.4px', marginBottom: '6px',
              }}>{p.name}</h1>

              {/* Role badge */}
              <div style={{
                display: 'inline-block',
                background: `${THEME.colors.accent}1A`, color: THEME.colors.accent,
                fontSize: '12px', fontWeight: 500, padding: '4px 12px',
                borderRadius: THEME.radius.full,
              }}>{p.role}</div>
            </div>

            {/* Rating */}
            <div className="tap-btn" onClick={() => window.location.href = '/provider-reviews'} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Star size={14} fill={THEME.colors.accent} stroke={THEME.colors.accent} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: THEME.colors.primaryText }}>{p.rating}</span>
              <span style={{ fontSize: '13px', color: THEME.colors.info }}>({p.reviewCount} reviews)</span>
            </div>

            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={13} color={THEME.colors.secondaryText} />
              <span style={{ fontSize: '13px', color: THEME.colors.secondaryText }}>{p.location}</span>
            </div>

            {/* Response time */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} color={THEME.colors.secondaryText} />
              <span style={{ fontSize: '13px', color: THEME.colors.secondaryText }}>{p.responseTime}</span>
            </div>
          </div>

          {/* ─── ABOUT ─── */}
          <div style={{ padding: '24px 20px 0' }}>
            <SectionLabel>About</SectionLabel>
            <p className={bioExpanded ? '' : 'line-clamp-4'} style={{
              fontSize: '15px', lineHeight: '22px', color: THEME.colors.primaryText,
            }}>{p.bio}</p>
            <button className="tap-btn" onClick={() => setBioExpanded(!bioExpanded)} style={{
              background: 'none', border: 'none', color: THEME.colors.accent,
              fontSize: '14px', fontWeight: 500, marginTop: '6px', padding: 0, cursor: 'pointer',
            }}>{bioExpanded ? 'Show less' : 'Read more'}</button>
          </div>

          {/* ─── SERVICES & PRICING ─── */}
          <div style={{ padding: '24px 20px 0' }}>
            <SectionLabel>Services</SectionLabel>
            <div style={{
              background: THEME.colors.surface, borderRadius: '20px', padding: '4px 20px',
              boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)',
            }}>
              {p.services.map((s, i) => (
                <div key={s.name} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 0',
                  borderBottom: i < p.services.length - 1 ? `1px solid ${THEME.colors.divider}` : 'none',
                }}>
                  <span style={{ fontSize: '15px', color: THEME.colors.primaryText }}>{s.name}</span>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: THEME.colors.primaryText }}>{s.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ─── AVAILABILITY ─── */}
          <div style={{ padding: '24px 20px 0' }}>
            <SectionLabel>Availability</SectionLabel>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
              {p.availability.map(d => (
                <div key={d.day} style={{
                  flex: 1, height: '44px', borderRadius: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 500, letterSpacing: '-0.2px',
                  background: d.available ? THEME.colors.accent : THEME.colors.surfaceAlt,
                  color: d.available ? '#FFFFFF' : THEME.colors.tertiaryText,
                  transition: `background ${THEME.motion.fade}`,
                }}>
                  {d.day}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} color={THEME.colors.tertiaryText} />
              <span style={{ fontSize: '13px', color: THEME.colors.tertiaryText }}>
                Next available: {p.nextAvailable}
              </span>
            </div>
          </div>

          {/* ─── BADGES ─── */}
          <div style={{ padding: '24px 20px 0' }}>
            <SectionLabel>Certifications</SectionLabel>
            <div className="scroll-h" style={{ display: 'flex', gap: '8px', paddingBottom: '4px' }}>
              {p.badges.map(b => (
                <div key={b} style={{
                  flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px',
                  background: THEME.colors.surfaceAlt, borderRadius: THEME.radius.full,
                  padding: '6px 12px', fontSize: '12px', fontWeight: 500,
                  color: THEME.colors.primaryText, whiteSpace: 'nowrap',
                }}>
                  {b === 'Verified ✓' && <Shield size={12} color={THEME.colors.success} />}
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* ─── REVIEWS ─── */}
          <div style={{ padding: '24px 20px 0' }}>
            <SectionLabel right={
              <button className="tap-btn" onClick={() => window.location.href = '/provider-reviews'} style={{
                background: 'none', border: 'none', color: THEME.colors.accent,
                fontSize: '13px', fontWeight: 500, cursor: 'pointer', display: 'flex',
                alignItems: 'center', gap: '2px', padding: 0,
              }}>See all <ArrowRight size={13} /></button>
            }>Reviews</SectionLabel>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {p.reviews.map(r => (
                <div key={r.id} style={{
                  background: THEME.colors.surface, borderRadius: '20px', padding: '16px',
                  boxShadow: THEME.shadows.soft, border: '1px solid rgba(0,0,0,0.03)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Avatar initials={r.initials} size={32} color={r.color} fontSize="12px" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 500, color: THEME.colors.primaryText }}>{r.name}</div>
                      <div style={{ fontSize: '12px', color: THEME.colors.tertiaryText }}>{r.date}</div>
                    </div>
                    <StarRow rating={r.rating} size={11} />
                  </div>
                  <p className="line-clamp-2" style={{
                    fontSize: '13px', lineHeight: '19px', color: THEME.colors.secondaryText,
                  }}>{r.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── GALLERY ─── */}
          <div style={{ padding: '24px 20px 24px' }}>
            <SectionLabel>Gallery</SectionLabel>
            <div className="scroll-h" style={{ display: 'flex', gap: '10px', paddingBottom: '4px' }}>
              {p.galleryColors.map((c, i) => (
                <div key={i} style={{
                  width: '100px', height: '100px', borderRadius: '16px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${c}, ${c}CC)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <PawPrint size={24} color="rgba(0,0,0,0.1)" />
                </div>
              ))}
            </div>
          </div>

          {/* bottom spacer for sticky bar */}
          <div style={{ height: '20px' }} />
        </div>

        {/* ─── STICKY BOTTOM BAR ─── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '12px 20px 34px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(0,0,0,0.04)',
          display: 'flex', gap: '10px', zIndex: 40,
        }}>
          <button className="tap-btn" onClick={() => window.location.href = '/chat'} style={{
            flex: 1, height: '52px', borderRadius: '16px',
            background: THEME.colors.surfaceAlt, border: '1px solid rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontSize: '15px', fontWeight: 600, color: THEME.colors.primaryText, cursor: 'pointer',
          }}>
            <MessageCircle size={18} />
            Message
          </button>
          <button className="gradient-btn tap-btn" onClick={() => window.location.href = '/booking-flow'} style={{
            flex: 1.4, height: '52px', borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
            fontSize: '15px', fontWeight: 600,
          }}>
            <Calendar size={18} color="white" />
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailScreen;
