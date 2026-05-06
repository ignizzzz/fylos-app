import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  FileText,
  Shield,
} from 'lucide-react';

/**
 * 60_HELP_CENTER_v1.jsx
 * Help center screen for the Fylos pet care app.
 * Search, quick actions, FAQ accordion, report issue, contact info.
 */

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

const QUICK_ACTIONS = [
  { Icon: MessageCircle, label: 'Chat', sub: 'Usually instant', color: '#E85D2A', bg: 'rgba(232,93,42,0.08)' },
  { Icon: Phone, label: 'Call', sub: 'Mon-Fri 9-18', color: '#007AFF', bg: 'rgba(0,122,255,0.08)' },
  { Icon: Mail, label: 'Email', sub: '24h response', color: '#34C759', bg: 'rgba(52,199,89,0.08)' },
];

const HelpCenterScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filteredFaq = searchQuery.trim()
    ? FAQ_ITEMS.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : FAQ_ITEMS;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#EDE8E2',
        padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .help-scroll::-webkit-scrollbar { display: none; }
        .help-scroll { scrollbar-width: none; }
        @keyframes helpFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .help-fade { animation: helpFadeIn 200ms ease both; }
      `}</style>

      {/* iPhone Frame */}
      <div
        className="relative"
        style={{
          width: 390,
          height: 844,
          borderRadius: 50,
          border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F7F5F2',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          WebkitFontSmoothing: 'antialiased',
        }}
      >
        {/* Notch */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[100]"
          style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }}
        />

        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
          style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }}
        />

        {/* Status bar */}
        <div
          className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8"
          style={{ height: 54 }}
        >
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Scroll Content with canonical transparent header */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
          <div
            className="help-scroll absolute inset-0 overflow-y-auto pb-[140px]"
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none">
              <button
                onClick={() => window.history.back()}
                className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
              >
                <ChevronLeft size={18} strokeWidth={2.2} color="#111" />
              </button>
              <h1 className="text-[17px] font-semibold text-[#111]">Help</h1>
            </div>
            <div className="px-5" style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>

              {/* Search Bar */}
              <div
                className="rounded-[16px]"
                style={{
                  background: '#F3EFEB',
                  border: '1px solid #EDE8E2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  height: 52,
                  padding: '0 16px',
                }}
              >
                <Search size={18} color="#A09A94" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 16,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    color: '#111111',
                  }}
                />
              </div>

              {/* Quick Actions */}
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#A09A94',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 12,
                    paddingLeft: 4,
                  }}
                >
                  Quick Actions
                </span>
                <div style={{ display: 'flex', gap: 10 }}>
                  {QUICK_ACTIONS.map((action) => (
                    <div
                      key={action.label}
                      className="active:scale-[0.97] transition-all duration-[120ms]"
                      style={{
                        flex: 1,
                        background: '#F3EFEB',
                        border: '1px solid #EDE8E2',
                        borderRadius: 20,
                        padding: '18px 10px 14px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 8,
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        className="rounded-full flex items-center justify-center"
                        style={{
                          width: 44,
                          height: 44,
                          background: action.bg,
                        }}
                      >
                        <action.Icon size={20} color={action.color} />
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#111111',
                          textAlign: 'center',
                        }}
                      >
                        {action.label}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: '#A09A94',
                          textAlign: 'center',
                        }}
                      >
                        {action.sub}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#A09A94',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 12,
                    paddingLeft: 4,
                  }}
                >
                  Frequently Asked Questions
                </span>
                <div
                  className="rounded-[20px]"
                  style={{ padding: '2px 20px', background: '#F3EFEB', border: '1px solid #EDE8E2' }}
                >
                  {filteredFaq.length === 0 && (
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                      <span style={{ fontSize: 14, color: '#A09A94' }}>No results found</span>
                    </div>
                  )}
                  {filteredFaq.map((item, idx) => {
                    const isOpen = openFaq === idx;
                    const isLast = idx === filteredFaq.length - 1;

                    return (
                      <div key={idx}>
                        {/* Question row */}
                        <div
                          onClick={() => setOpenFaq(isOpen ? null : idx)}
                          className="active:scale-[0.97] transition-all duration-[120ms]"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '15px 0',
                            borderBottom: isLast && !isOpen ? 'none' : '1px dashed #CFCFD4',
                            cursor: 'pointer',
                          }}
                        >
                          <div
                            className="rounded-full flex items-center justify-center"
                            style={{
                              width: 32,
                              height: 32,
                              background: isOpen ? 'rgba(232,93,42,0.08)' : '#EDE8E2',
                              flexShrink: 0,
                              transition: 'background 200ms ease',
                            }}
                          >
                            <HelpCircle
                              size={15}
                              color={isOpen ? '#E85D2A' : '#A09A94'}
                            />
                          </div>
                          <span
                            style={{
                              flex: 1,
                              fontSize: 15,
                              fontWeight: 600,
                              color: '#111111',
                              lineHeight: 1.4,
                            }}
                          >
                            {item.q}
                          </span>
                          <ChevronDown
                            size={18}
                            color={isOpen ? '#E85D2A' : '#A09A94'}
                            strokeWidth={2}
                            style={{
                              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                              transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                              flexShrink: 0,
                            }}
                          />
                        </div>

                        {/* Answer */}
                        <div
                          style={{
                            overflow: 'hidden',
                            maxHeight: isOpen ? 200 : 0,
                            opacity: isOpen ? 1 : 0,
                            transition: 'max-height 250ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease',
                          }}
                        >
                          <div
                            style={{
                              paddingBottom: 14,
                              paddingLeft: 42,
                              fontSize: 13,
                              lineHeight: 1.6,
                              color: '#6E6058',
                              borderBottom: isLast ? 'none' : '1px dashed #CFCFD4',
                            }}
                          >
                            {item.a}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Report an Issue */}
              <div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#A09A94',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: 12,
                    paddingLeft: 4,
                  }}
                >
                  Need more help?
                </span>
                <div
                  className="rounded-[20px] p-5 active:scale-[0.97] transition-all duration-[120ms]"
                  style={{
                    background: '#F3EFEB',
                    border: '1px solid #EDE8E2',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      background: 'rgba(232,93,42,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <AlertTriangle size={20} color="#E85D2A" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#111111', marginBottom: 2 }}>
                      Report an Issue
                    </div>
                    <div style={{ fontSize: 13, color: '#6E6058' }}>
                      Something not working? Let us know.
                    </div>
                  </div>
                  <ArrowRight size={18} color="#A09A94" />
                </div>
              </div>

              {/* Contact footer */}
              <div style={{ textAlign: 'center', paddingTop: 4 }}>
                <span style={{ fontSize: 13, color: '#6E6058' }}>Contact us at </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#E85D2A' }}>
                  support@fylos.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterScreen;
