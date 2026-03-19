import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  Shield,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// THEME
// ---------------------------------------------------------------------------
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
    divider: '#E5E5E5',
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
  },
};

// ---------------------------------------------------------------------------
// GLOBAL STYLES
// ---------------------------------------------------------------------------
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .help-screen {
      font-family: 'Inter', 'Nunito', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: ${THEME.colors.background};
      color: ${THEME.colors.primaryText};
      overflow: hidden;
    }

    .help-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .help-scroll::-webkit-scrollbar { display: none; }

    .help-tap {
      transition: opacity 120ms ease, transform 120ms cubic-bezier(0.34,1.56,0.64,1);
      cursor: pointer;
    }
    .help-tap:active { opacity: 0.7; transform: scale(0.97); }

    .help-fade {
      animation: helpFadeIn 200ms ease both;
    }
    @keyframes helpFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `}</style>
);

// StatusBar and HomeIndicator are now inline in the frame

// ---------------------------------------------------------------------------
// FAQ DATA
// ---------------------------------------------------------------------------
const FAQ_ITEMS = [
  {
    q: 'How do I book a walker?',
    a: 'Tap the "Book" tab, choose a service type, pick a date and time, then browse available providers in your area. Select a walker, review their profile, and confirm your booking.',
  },
  {
    q: 'How do I cancel a booking?',
    a: 'Go to your Bookings tab, select the booking you want to cancel, and tap "Cancel Booking." Cancellations made 24+ hours before the service receive a full refund.',
  },
  {
    q: 'How does payment work?',
    a: 'We accept Visa, Mastercard, Apple Pay, and Google Pay. Payment is processed after the service is completed. You can also use your Fylos Wallet balance.',
  },
  {
    q: 'Is my data safe?',
    a: 'Yes. We use end-to-end encryption for all personal data and comply with Swiss data protection regulations. You can manage your privacy settings at any time in Settings.',
  },
  {
    q: 'How do I report an issue?',
    a: 'Use the "Report an Issue" card below, or tap Chat / Call / Email in the quick actions above. Our support team typically responds within a few hours.',
  },
];

// ---------------------------------------------------------------------------
// FAQ ACCORDION ITEM
// ---------------------------------------------------------------------------
const FaqItem = ({ item, isOpen, onToggle, isLast }) => (
  <div>
    <div
      className="help-tap"
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '15px 0',
        borderBottom: isLast && !isOpen ? 'none' : `1px solid ${THEME.colors.divider}`,
      }}
    >
      <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText, lineHeight: 1.4 }}>
        {item.q}
      </span>
      {isOpen
        ? <ChevronUp size={18} color={THEME.colors.tertiaryText} strokeWidth={2} />
        : <ChevronDown size={18} color={THEME.colors.tertiaryText} strokeWidth={2} />
      }
    </div>
    {isOpen && (
      <div className="help-fade" style={{
        paddingBottom: 14,
        fontSize: 13.5,
        lineHeight: 1.6,
        color: THEME.colors.secondaryText,
        borderBottom: isLast ? 'none' : `1px solid ${THEME.colors.divider}`,
      }}>
        {item.a}
      </div>
    )}
  </div>
);

// ---------------------------------------------------------------------------
// QUICK ACTION CARD
// ---------------------------------------------------------------------------
const QuickAction = ({ icon: Icon, label, sub, bgColor }) => (
  <div
    className="help-tap"
    style={{
      flex: 1,
      background: THEME.colors.surface,
      borderRadius: 20,
      padding: '18px 10px 14px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      boxShadow: THEME.shadows.soft,
    }}
  >
    <div style={{
      width: 46,
      height: 46,
      borderRadius: 14,
      background: bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Icon size={22} color={THEME.colors.accent} />
    </div>
    <span style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.primaryText, textAlign: 'center' }}>{label}</span>
    <span style={{ fontSize: 11, color: THEME.colors.tertiaryText, textAlign: 'center' }}>{sub}</span>
  </div>
);

// ---------------------------------------------------------------------------
// MAIN SCREEN
// ---------------------------------------------------------------------------
const HelpCenterScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <GlobalStyles />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#E5E5E5',
        padding: '20px',
        fontFamily: 'Inter, sans-serif',
      }}>
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
              <h2 className="text-[17px] font-semibold text-[#111111]">Help</h2>
              {/* Right: Invisible spacer */}
              <div className="w-[44px]" />
            </div>
          </header>

          {/* Scrollable body */}
          <div className="absolute inset-0 overflow-y-auto help-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>

          {/* Search bar */}
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              height: 48,
              background: THEME.colors.surfaceAlt,
              borderRadius: THEME.radius.medium,
              padding: '0 16px',
            }}>
              <Search size={18} color={THEME.colors.tertiaryText} />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: 15,
                  fontFamily: 'Inter, sans-serif',
                  color: THEME.colors.primaryText,
                }}
              />
            </div>
          </div>

          <div style={{ padding: '0 20px 24px' }}>

            {/* Quick Actions */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: THEME.colors.tertiaryText,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                Quick Actions
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <QuickAction
                  icon={MessageCircle}
                  label="Chat"
                  sub="Usually instant"
                  bgColor="rgba(232,93,42,0.10)"
                />
                <QuickAction
                  icon={Phone}
                  label="Call"
                  sub="Mon-Fri 9-18"
                  bgColor="rgba(232,93,42,0.10)"
                />
                <QuickAction
                  icon={Mail}
                  label="Email"
                  sub="24h response"
                  bgColor="rgba(232,93,42,0.10)"
                />
              </div>
            </div>

            {/* FAQ Section */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: THEME.colors.tertiaryText,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                Frequently Asked Questions
              </div>
              <div style={{
                background: THEME.colors.surface,
                borderRadius: 20,
                padding: '2px 20px',
                boxShadow: THEME.shadows.soft,
              }}>
                {FAQ_ITEMS.map((item, idx) => (
                  <FaqItem
                    key={idx}
                    item={item}
                    isOpen={openFaq === idx}
                    onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
                    isLast={idx === FAQ_ITEMS.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Report an Issue Card */}
            <div style={{ marginBottom: 24 }}>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: THEME.colors.tertiaryText,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                marginBottom: 12,
              }}>
                Need more help?
              </div>
              <div
                className="help-tap"
                style={{
                  background: THEME.colors.surface,
                  borderRadius: 20,
                  padding: 20,
                  boxShadow: THEME.shadows.soft,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  background: 'rgba(232,93,42,0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <AlertTriangle size={20} color={THEME.colors.accent} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: THEME.colors.primaryText, marginBottom: 2 }}>
                    Report an Issue
                  </div>
                  <div style={{ fontSize: 13, color: THEME.colors.secondaryText }}>
                    Something not working? Let us know.
                  </div>
                </div>
                <ArrowRight size={18} color={THEME.colors.tertiaryText} />
              </div>
            </div>

            {/* Contact Us footer */}
            <div style={{
              textAlign: 'center',
              paddingTop: 8,
              paddingBottom: 12,
            }}>
              <span style={{ fontSize: 13, color: THEME.colors.secondaryText }}>
                Contact us at{' '}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: THEME.colors.accent }}>
                support@fylos.com
              </span>
            </div>

          </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpCenterScreen;
