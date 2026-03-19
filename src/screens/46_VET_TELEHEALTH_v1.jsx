import React, { useState } from 'react';
import {
  ChevronLeft,
  Camera,
  MessageCircle,
  Star,
  Clock,
  Check,
  Phone,
  Shield,
  Heart,
  User,
  ChevronRight,
  Circle,
  Calendar,
  ArrowRight,
  X
} from 'lucide-react';

/**
 * 46_VET_TELEHEALTH_v1.jsx
 * Vet Telehealth / Online Consult screen for the Fylos pet care app.
 *
 * Two views:
 *  1 – Browse: available vets, consult options, recent consultations
 *  2 – Vet Detail: vet bio, languages, start consult CTA
 */

// ─── FYLOS LOGO ───────────────────────────────────────────────────────────────
const FylosLogo = ({
  textColor = '#000000',
  dotColor = '#E85D2A',
  fontSize = '2rem',
  className = ''
}) => (
  <div
    className={className}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: `calc(${fontSize} * 0.15)`,
      fontFamily: '"Nunito", sans-serif'
    }}
  >
    <span style={{ fontSize, fontWeight: 800, color: textColor, letterSpacing: '-0.5px', lineHeight: 1 }}>
      FYLOS
    </span>
    <div style={{
      width: `calc(${fontSize} * 0.25)`,
      height: `calc(${fontSize} * 0.25)`,
      borderRadius: '50%',
      backgroundColor: dotColor
    }} />
  </div>
);

// ─── THEME ────────────────────────────────────────────────────────────────────
const THEME = {
  colors: {
    accent: '#E85D2A',
    accentHover: '#D04A1C',
    primaryText: '#111111',
    secondaryText: '#6E6E73',
    tertiaryText: '#8E8E93',
    background: '#F9F9FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F2F7',
    danger: '#FF3B30',
    success: '#00C060',
    warning: '#FF9500',
    info: '#007AFF',
    divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)'
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .vt-screen {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: ${THEME.colors.background};
      color: ${THEME.colors.primaryText};
      overflow: hidden;
    }

    .vt-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .vt-scroll::-webkit-scrollbar { display: none; }

    .vt-tap {
      transition: opacity ${THEME.motion.tap} ease, transform ${THEME.motion.tap} ease;
      cursor: pointer;
    }
    .vt-tap:active { opacity: 0.7; transform: scale(0.97); }

    .vt-card {
      background: ${THEME.colors.surface};
      border-radius: 20px;
      padding: 20px;
      box-shadow: ${THEME.shadows.soft};
    }

    .vt-fade-in {
      animation: vtFadeIn ${THEME.motion.fade} ease both;
    }
    @keyframes vtFadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .vt-slide-up {
      animation: vtSlideUp 300ms ${THEME.motion.spring} both;
    }
    @keyframes vtSlideUp {
      from { opacity: 0; transform: translateY(40px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const VETS = [
  {
    id: 1,
    name: 'Dr. Sarah Meier',
    specialty: 'General Veterinarian',
    rating: 4.9,
    reviews: 234,
    years: 12,
    available: true,
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=96&h=96&fit=crop&crop=face',
    bio: 'Specialized in companion animal medicine with extensive experience in preventive care, nutrition counseling, and behavioral consultations.',
    languages: ['English', 'German', 'French']
  },
  {
    id: 2,
    name: 'Dr. Marco Rossi',
    specialty: 'Dermatology & Allergies',
    rating: 4.8,
    reviews: 189,
    years: 8,
    available: true,
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=96&h=96&fit=crop&crop=face',
    bio: 'Expert in pet dermatology, treating skin conditions, allergies, and chronic skin disorders. Passionate about finding long-term solutions for your pets.',
    languages: ['English', 'Italian']
  },
  {
    id: 3,
    name: 'Dr. Lena Fischer',
    specialty: 'Behavioral Medicine',
    rating: 4.7,
    reviews: 156,
    years: 6,
    available: false,
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=96&h=96&fit=crop&crop=face',
    bio: 'Certified veterinary behaviorist helping pet owners understand and address behavioral challenges through positive, science-based approaches.',
    languages: ['English', 'German']
  }
];

const RECENT_CONSULTS = [
  {
    id: 1,
    vetName: 'Dr. Sarah Meier',
    date: 'Mar 2, 2026',
    summary: 'Annual wellness check for Luna. All vitals normal.',
    type: 'Video Call'
  },
  {
    id: 2,
    vetName: 'Dr. Marco Rossi',
    date: 'Feb 14, 2026',
    summary: 'Skin irritation follow-up. New treatment plan discussed.',
    type: 'Chat'
  }
];

// ─── BROWSE VIEW ──────────────────────────────────────────────────────────────
const BrowseView = ({ onSelectVet }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    {/* Available Now Banner */}
    <div className="vt-card vt-fade-in" style={{ animationDelay: '50ms' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: THEME.colors.success,
          boxShadow: `0 0 8px ${THEME.colors.success}60`
        }} />
        <span style={{ fontSize: 15, fontWeight: 700, color: THEME.colors.primaryText }}>
          Vets available
        </span>
      </div>
      <p style={{ fontSize: 13, color: THEME.colors.secondaryText, lineHeight: 1.5, margin: 0 }}>
        Get instant advice from certified veterinarians
      </p>
    </div>

    {/* Quick Consult Options */}
    <div className="vt-fade-in" style={{ display: 'flex', gap: 12, animationDelay: '100ms' }}>
      {/* Video Call Card */}
      <div className="vt-card vt-tap" style={{ flex: 1, textAlign: 'center', padding: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: THEME.radius.medium,
          background: `${THEME.colors.accent}10`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px'
        }}>
          <Camera size={22} color={THEME.colors.accent} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: THEME.colors.primaryText, marginBottom: 4 }}>
          Video Call
        </div>
        <div style={{ fontSize: 12, color: THEME.colors.secondaryText, fontWeight: 500 }}>
          CHF 45 / 20min
        </div>
      </div>

      {/* Chat Card */}
      <div className="vt-card vt-tap" style={{ flex: 1, textAlign: 'center', padding: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: THEME.radius.medium,
          background: `${THEME.colors.info}10`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px'
        }}>
          <MessageCircle size={22} color={THEME.colors.info} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: THEME.colors.primaryText, marginBottom: 4 }}>
          Chat
        </div>
        <div style={{ fontSize: 12, color: THEME.colors.secondaryText, fontWeight: 500 }}>
          CHF 25 / session
        </div>
      </div>
    </div>

    {/* Available Vets */}
    <div className="vt-fade-in" style={{ animationDelay: '150ms' }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: THEME.colors.tertiaryText,
        letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12
      }}>
        Available Vets
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {VETS.map(vet => (
          <div
            key={vet.id}
            className="vt-card vt-tap"
            onClick={() => onSelectVet(vet)}
            style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <img
              src={vet.photo}
              alt={vet.name}
              style={{
                width: 48, height: 48, borderRadius: THEME.radius.medium,
                objectFit: 'cover', flexShrink: 0
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: THEME.colors.primaryText, marginBottom: 2 }}>
                {vet.name}
              </div>
              <div style={{ fontSize: 12, color: THEME.colors.secondaryText, marginBottom: 6 }}>
                {vet.specialty}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Star size={12} color="#FFB800" fill="#FFB800" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: THEME.colors.primaryText }}>
                    {vet.rating}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Clock size={11} color={THEME.colors.tertiaryText} />
                  <span style={{ fontSize: 11, color: THEME.colors.tertiaryText }}>
                    {vet.years} yrs
                  </span>
                </div>
              </div>
            </div>
            <div style={{
              padding: '4px 10px',
              borderRadius: THEME.radius.full,
              background: vet.available ? `${THEME.colors.success}12` : `${THEME.colors.tertiaryText}12`,
              fontSize: 11,
              fontWeight: 600,
              color: vet.available ? THEME.colors.success : THEME.colors.tertiaryText
            }}>
              {vet.available ? 'Available' : 'Offline'}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Consultations */}
    <div className="vt-fade-in" style={{ animationDelay: '200ms' }}>
      <div style={{
        fontSize: 13, fontWeight: 600, color: THEME.colors.tertiaryText,
        letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 12
      }}>
        Recent Consultations
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {RECENT_CONSULTS.map(c => (
          <div key={c.id} className="vt-card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: THEME.colors.primaryText }}>
                {c.vetName}
              </span>
              <span style={{ fontSize: 11, color: THEME.colors.tertiaryText }}>
                {c.date}
              </span>
            </div>
            <p style={{ fontSize: 13, color: THEME.colors.secondaryText, lineHeight: 1.5, margin: 0, marginBottom: 8 }}>
              {c.summary}
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '3px 8px', borderRadius: THEME.radius.full,
              background: THEME.colors.surfaceAlt, fontSize: 11, color: THEME.colors.tertiaryText, fontWeight: 500
            }}>
              {c.type === 'Video Call' ? <Camera size={10} /> : <MessageCircle size={10} />}
              {c.type}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Bottom spacer */}
    <div style={{ height: 20 }} />
  </div>
);

// ─── VET DETAIL VIEW ──────────────────────────────────────────────────────────
const VetDetailView = ({ vet, onBack }) => (
  <div className="vt-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    {/* Back Button */}
    <button
      className="vt-tap"
      onClick={onBack}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        background: 'none', border: 'none', padding: 0,
        fontSize: 14, fontWeight: 600, color: THEME.colors.accent,
        fontFamily: 'Inter, sans-serif', cursor: 'pointer'
      }}
    >
      <ChevronLeft size={18} />
      Back to list
    </button>

    {/* Photo & Info */}
    <div className="vt-card" style={{ textAlign: 'center', padding: 24 }}>
      <img
        src={vet.photo}
        alt={vet.name}
        style={{
          width: 88, height: 88, borderRadius: THEME.radius.large,
          objectFit: 'cover', margin: '0 auto 16px',
          display: 'block'
        }}
      />
      <div style={{ fontSize: 20, fontWeight: 800, color: THEME.colors.primaryText, marginBottom: 4 }}>
        {vet.name}
      </div>
      <div style={{ fontSize: 13, color: THEME.colors.secondaryText, marginBottom: 12 }}>
        {vet.specialty}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Star size={14} color="#FFB800" fill="#FFB800" />
          <span style={{ fontSize: 14, fontWeight: 700 }}>{vet.rating}</span>
          <span style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>({vet.reviews})</span>
        </div>
        <div style={{ width: 1, height: 16, background: THEME.colors.divider }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={14} color={THEME.colors.tertiaryText} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{vet.years}</span>
          <span style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>years</span>
        </div>
      </div>
      {vet.available && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 14px', borderRadius: THEME.radius.full,
          background: `${THEME.colors.success}12`,
          fontSize: 12, fontWeight: 600, color: THEME.colors.success
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: THEME.colors.success,
            boxShadow: `0 0 6px ${THEME.colors.success}60`
          }} />
          Available now
        </div>
      )}
    </div>

    {/* Bio */}
    <div className="vt-card">
      <div style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.tertiaryText, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
        About
      </div>
      <p style={{ fontSize: 14, color: THEME.colors.secondaryText, lineHeight: 1.6, margin: 0 }}>
        {vet.bio}
      </p>
    </div>

    {/* Languages */}
    <div className="vt-card">
      <div style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.tertiaryText, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
        Languages
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {vet.languages.map(lang => (
          <span key={lang} style={{
            padding: '5px 14px',
            borderRadius: THEME.radius.full,
            background: THEME.colors.surfaceAlt,
            fontSize: 13, fontWeight: 500, color: THEME.colors.primaryText
          }}>
            {lang}
          </span>
        ))}
      </div>
    </div>

    {/* Credentials */}
    <div className="vt-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 40, height: 40, borderRadius: THEME.radius.small,
        background: `${THEME.colors.success}10`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        <Shield size={18} color={THEME.colors.success} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: THEME.colors.primaryText }}>Verified & Licensed</div>
        <div style={{ fontSize: 12, color: THEME.colors.tertiaryText }}>All credentials verified by Fylos</div>
      </div>
    </div>

    {/* Start Consult Button */}
    <button
      className="vt-tap"
      style={{
        width: '100%', padding: '16px 0',
        borderRadius: THEME.radius.medium,
        background: 'linear-gradient(135deg, #FF7240, #E85D2A)',
        border: 'none', cursor: 'pointer',
        fontSize: 16, fontWeight: 700, color: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
        boxShadow: '0 4px 16px rgba(232, 93, 42, 0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
      }}
    >
      <Phone size={18} />
      Start Consult
    </button>

    {/* Bottom spacer */}
    <div style={{ height: 20 }} />
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function VetTelehealthScreen() {
  const [selectedVet, setSelectedVet] = useState(null);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#E5E5E5',
      padding: '20px',
      fontFamily: 'Inter, sans-serif'
    }}>
      <GlobalStyles />

      {/* ── iPhone Frame ── */}
      <div className="relative" style={{
        width: 390, height: 844,
        borderRadius: 50,
        border: '8px solid #000',
        overflow: 'hidden',
        backgroundColor: '#F9F9FB',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
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

        {/* Scrollable Content */}
        <div className="absolute inset-0 overflow-y-auto vt-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>
          {/* Spacer for floating header */}
          <div style={{ height: 52, flexShrink: 0 }} />

          {/* ── Content ── */}
          <div style={{ padding: 20 }}>
            {selectedVet ? (
              <VetDetailView vet={selectedVet} onBack={() => setSelectedVet(null)} />
            ) : (
              <BrowseView onSelectVet={setSelectedVet} />
            )}
          </div>
        </div>

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            {/* Left: Back button */}
            <button
              onClick={() => { if (selectedVet) { setSelectedVet(null); } else { window.history.back(); } }}
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <ChevronLeft size={22} color="#111111" />
            </button>
            {/* Center: Title */}
            <h2 className="text-[17px] font-semibold text-[#111111]">Vet Consult</h2>
            {/* Right: invisible spacer */}
            <div className="w-[44px]" />
          </div>
        </header>
      </div>
    </div>
  );
}
