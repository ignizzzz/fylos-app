import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Search,
  Phone,
  Info,
  Send,
  Plus,
  Check,
  Clock,
  Calendar,
  MapPin,
  Star,
  ArrowRight,
  Circle,
  X,
  Camera,
  Heart,
  MessageCircle,
  PawPrint,
  ChevronRight
} from 'lucide-react';

/* ─── THEME ─── */
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

/* ─── CONVERSATIONS DATA ─── */
const CONVERSATIONS = [
  {
    id: 1,
    name: 'Sofia L.',
    role: 'Dog Walker',
    initials: 'SL',
    color: '#E85D2A',
    lastMessage: 'Haha yes! She goes crazy for those',
    time: '2 min',
    unread: true,
    online: true,
    bookingContext: '60 min Walk · Tomorrow'
  },
  {
    id: 2,
    name: 'Marc B.',
    role: 'Groomer',
    initials: 'MB',
    color: '#007AFF',
    lastMessage: 'Luna\'s grooming session is all set for Friday',
    time: '1h',
    unread: true,
    online: false,
    bookingContext: 'Full Groom · Friday'
  },
  {
    id: 3,
    name: 'Vet Clinic Seefeld',
    role: 'Veterinary',
    initials: 'VS',
    color: '#00C060',
    lastMessage: 'Vaccination records have been updated',
    time: '3h',
    unread: false,
    online: true,
    bookingContext: 'Checkup · Next Monday'
  },
  {
    id: 4,
    name: 'Lena W.',
    role: 'Pet Sitter',
    initials: 'LW',
    color: '#FF9500',
    lastMessage: 'I\'d love to watch Luna next weekend!',
    time: 'Yesterday',
    unread: false,
    online: false,
    bookingContext: 'Overnight Stay · Mar 22-23'
  },
  {
    id: 5,
    name: 'Fylos',
    role: 'Notifications',
    initials: 'F',
    color: '#8E8E93',
    lastMessage: 'Your booking with Sofia L. has been confirmed',
    time: 'Yesterday',
    unread: false,
    online: false,
    bookingContext: null
  }
];

/* ─── CHAT MESSAGES ─── */
const CHAT_MESSAGES = [
  {
    id: 1,
    type: 'received',
    text: null,
    time: '9:41 AM',
    isDateSeparator: true,
    dateLabel: 'Today'
  },
  {
    id: 2,
    type: 'sent',
    text: 'Hi Sofia! Just confirming Luna\'s walk tomorrow at 10am \uD83D\uDC3E',
    time: '10:12 AM',
    read: true
  },
  {
    id: 3,
    type: 'received',
    text: 'Hi! Yes, confirmed! Should I pick her up from the usual spot?',
    time: '10:14 AM'
  },
  {
    id: 4,
    type: 'sent',
    text: 'Yes please, she\'ll be ready at the front door',
    time: '10:15 AM',
    read: true
  },
  {
    id: 5,
    type: 'booking',
    service: '60 min Walk',
    date: 'Tomorrow 10:00',
    status: 'Confirmed',
    time: '10:15 AM'
  },
  {
    id: 6,
    type: 'received',
    text: 'I\'ll bring some treats, Luna loves the duck ones right?',
    time: '10:22 AM'
  },
  {
    id: 7,
    type: 'sent',
    text: 'Haha yes! She goes crazy for those \uD83D\uDE04',
    time: '10:23 AM',
    read: true
  },
  {
    id: 8,
    type: 'typing'
  }
];

/* ─── TYPING INDICATOR ─── */
const TypingIndicator = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
      <div
        style={{
          background: THEME.colors.surfaceAlt,
          borderRadius: '18px',
          borderBottomLeftRadius: '4px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: THEME.colors.tertiaryText,
              animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite`
            }}
          />
        ))}
      </div>
    </div>
  );
};

/* ─── BOOKING CARD IN CHAT ─── */
const BookingCard = ({ service, date, status }) => {
  const statusColor = status === 'Confirmed' ? THEME.colors.success : THEME.colors.warning;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
      <div
        style={{
          background: THEME.colors.surface,
          borderRadius: THEME.radius.medium,
          padding: '14px 16px',
          width: '260px',
          boxShadow: THEME.shadows.soft,
          border: `1px solid ${THEME.colors.divider}`,
          cursor: 'pointer',
          transition: `transform ${THEME.motion.tap}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: THEME.radius.small,
              background: `${THEME.colors.accent}12`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <PawPrint size={16} color={THEME.colors.accent} strokeWidth={2} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: THEME.colors.primaryText }}>{service}</div>
          </div>
          <ChevronRight size={14} color={THEME.colors.tertiaryText} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar size={12} color={THEME.colors.secondaryText} />
            <span style={{ fontSize: '12px', color: THEME.colors.secondaryText }}>{date}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              background: `${statusColor}14`,
              padding: '2px 8px',
              borderRadius: THEME.radius.full
            }}
          >
            <Check size={10} color={statusColor} strokeWidth={2.5} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: statusColor }}>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── DATE SEPARATOR ─── */
const DateSeparator = ({ label }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      margin: '16px 0 12px',
      padding: '0 16px'
    }}
  >
    <div style={{ flex: 1, height: '0.5px', background: THEME.colors.divider }} />
    <span style={{ fontSize: '11px', color: THEME.colors.tertiaryText, fontWeight: 500 }}>{label}</span>
    <div style={{ flex: 1, height: '0.5px', background: THEME.colors.divider }} />
  </div>
);

/* ─── MESSAGE BUBBLE ─── */
const MessageBubble = ({ message }) => {
  const isSent = message.type === 'sent';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isSent ? 'flex-end' : 'flex-start',
        marginBottom: '4px',
        padding: '0 16px'
      }}
    >
      <div
        style={{
          maxWidth: '75%',
          background: isSent ? THEME.colors.accent : THEME.colors.surfaceAlt,
          color: isSent ? '#FFFFFF' : THEME.colors.primaryText,
          borderRadius: '18px',
          borderBottomRightRadius: isSent ? '4px' : '18px',
          borderBottomLeftRadius: isSent ? '18px' : '4px',
          padding: '10px 16px',
          fontSize: '15px',
          lineHeight: '1.4',
          wordBreak: 'break-word'
        }}
      >
        {message.text}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginTop: '3px',
          padding: '0 4px'
        }}
      >
        <span style={{ fontSize: '11px', color: THEME.colors.tertiaryText }}>{message.time}</span>
        {isSent && message.read && (
          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '1px' }}>
            <Check size={10} color={THEME.colors.info} strokeWidth={2.5} style={{ marginRight: '-4px' }} />
            <Check size={10} color={THEME.colors.info} strokeWidth={2.5} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── CONVERSATION ITEM ─── */
const ConversationItem = ({ conversation, onTap }) => (
  <div
    onClick={() => onTap(conversation)}
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      padding: '14px 20px',
      cursor: 'pointer',
      transition: `background ${THEME.motion.fade}`,
      position: 'relative'
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    {/* Avatar */}
    <div
      style={{
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: conversation.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative'
      }}
    >
      <span style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.2px' }}>
        {conversation.initials}
      </span>
      {conversation.online && (
        <div
          style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: THEME.colors.success,
            border: `2px solid ${THEME.colors.surface}`
          }}
        />
      )}
    </div>

    {/* Content */}
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
        <span
          style={{
            fontSize: '15px',
            fontWeight: conversation.unread ? 700 : 600,
            color: THEME.colors.primaryText
          }}
        >
          {conversation.name}
        </span>
        <span style={{ fontSize: '12px', color: THEME.colors.tertiaryText, flexShrink: 0 }}>
          {conversation.time}
        </span>
      </div>

      {conversation.bookingContext && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: THEME.colors.surfaceAlt,
            padding: '2px 8px',
            borderRadius: THEME.radius.full,
            marginBottom: '4px'
          }}
        >
          <Calendar size={10} color={THEME.colors.secondaryText} />
          <span style={{ fontSize: '11px', color: THEME.colors.secondaryText, fontWeight: 500 }}>
            {conversation.bookingContext}
          </span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <p
          style={{
            fontSize: '13px',
            color: conversation.unread ? THEME.colors.primaryText : THEME.colors.secondaryText,
            fontWeight: conversation.unread ? 500 : 400,
            margin: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1
          }}
        >
          {conversation.lastMessage}
        </p>
        {conversation.unread && (
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: THEME.colors.accent,
              flexShrink: 0
            }}
          />
        )}
      </div>
    </div>
  </div>
);

/* ─── CONVERSATIONS LIST VIEW ─── */
const ConversationsListView = ({ onSelectConversation }) => {
  const [searchValue, setSearchValue] = useState('');

  const filtered = CONVERSATIONS.filter(c =>
    c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', background: THEME.colors.background }}>
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
          <h2 className="text-[17px] font-semibold text-[#111111]">Messages</h2>
          {/* Right: Invisible spacer */}
          <div className="w-[44px]" />
        </div>
      </header>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '54px' }}>
        {/* Search bar */}
        <div style={{ padding: '4px 20px 8px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: THEME.colors.surfaceAlt,
              borderRadius: THEME.radius.medium,
              padding: '0 14px',
              height: '44px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)'
            }}
          >
            <Search size={16} color={THEME.colors.tertiaryText} />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '15px',
                color: THEME.colors.primaryText,
                width: '100%',
                fontFamily: 'inherit'
              }}
            />
            {searchValue && (
              <div
                onClick={() => setSearchValue('')}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: THEME.colors.tertiaryText,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                <X size={10} color="#FFFFFF" strokeWidth={3} />
              </div>
            )}
          </div>
        </div>

        {/* Conversations list */}
        <div style={{ paddingTop: '4px' }}>
          {filtered.map((conv, index) => (
            <React.Fragment key={conv.id}>
              <ConversationItem conversation={conv} onTap={onSelectConversation} />
              {index < filtered.length - 1 && (
                <div
                  style={{
                    height: '0.5px',
                    background: THEME.colors.divider,
                    marginLeft: '76px',
                    marginRight: '20px'
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── CHAT DETAIL VIEW ─── */
const ChatDetailView = ({ conversation, onBack }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', background: THEME.colors.background }}>
      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Left: Back button */}
          <button
            onClick={onBack}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          {/* Center: Name + status */}
          <div className="flex items-center gap-2">
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: conversation.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                position: 'relative'
              }}
            >
              <span style={{ color: '#FFFFFF', fontSize: '10px', fontWeight: 700 }}>{conversation.initials}</span>
              {conversation.online && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-1px',
                    right: '-1px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    background: THEME.colors.success,
                    border: '2px solid #FFFFFF'
                  }}
                />
              )}
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: THEME.colors.primaryText, lineHeight: '1.2' }}>
                {conversation.name}
              </div>
              <div style={{ fontSize: '11px', color: conversation.online ? THEME.colors.success : THEME.colors.tertiaryText }}>
                {conversation.online ? 'Online' : conversation.role}
              </div>
            </div>
          </div>
          {/* Right: Phone + Info grouped pill */}
          <div className="flex items-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] p-1">
            <button className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]">
              <Phone size={20} color="#111111" strokeWidth={2} />
            </button>
            <div className="w-[1px] h-[20px] bg-black/[0.06]" />
            <button className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]">
              <Info size={20} color="#111111" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', paddingTop: '54px', paddingBottom: '8px' }}>
        {CHAT_MESSAGES.map((msg) => {
          if (msg.isDateSeparator) {
            return <DateSeparator key={msg.id} label={msg.dateLabel} />;
          }
          if (msg.type === 'booking') {
            return (
              <BookingCard
                key={msg.id}
                service={msg.service}
                date={msg.date}
                status={msg.status}
              />
            );
          }
          if (msg.type === 'typing') {
            return (
              <div key="typing" style={{ padding: '0 16px', marginTop: '4px' }}>
                <TypingIndicator />
              </div>
            );
          }
          return <MessageBubble key={msg.id} message={msg} />;
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          paddingBottom: '12px',
          background: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: `0.5px solid ${THEME.colors.divider}`
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            borderRadius: '50%',
            flexShrink: 0
          }}
        >
          <Plus size={22} color={THEME.colors.accent} strokeWidth={2} />
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            background: THEME.colors.surfaceAlt,
            borderRadius: THEME.radius.full,
            padding: '0 16px',
            height: '44px'
          }}
        >
          <input
            type="text"
            placeholder="Message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '15px',
              color: THEME.colors.primaryText,
              width: '100%',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {inputText.trim() && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: THEME.colors.accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: `transform ${THEME.motion.tap}`
            }}
          >
            <Send size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: '-1px', marginTop: '-1px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── MAIN SCREEN ─── */
export default function ChatMessagingScreen() {
  const [activeView, setActiveView] = useState('list');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [slideDirection, setSlideDirection] = useState('');

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    setSlideDirection('slide-in');
    setActiveView('detail');
  };

  const handleBack = () => {
    setSlideDirection('slide-out');
    setTimeout(() => {
      setActiveView('list');
      setSelectedConversation(null);
      setSlideDirection('');
    }, 240);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E5E5',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        padding: '20px'
      }}
    >
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideOut {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        .slide-in { animation: slideIn 240ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .slide-out { animation: slideOut 200ms ease-in forwards; }
        input::placeholder { color: ${THEME.colors.tertiaryText}; }
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
          backgroundColor: '#F9F9FB',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
        }}
      >
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

        {/* Content Area */}
        <div style={{ position: 'absolute', top: 54, left: 0, right: 0, bottom: 40, overflow: 'hidden' }}>
          {/* List View */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: activeView === 'list' && !slideDirection ? 'flex' : activeView === 'list' ? 'flex' : 'none',
              flexDirection: 'column'
            }}
          >
            <ConversationsListView onSelectConversation={handleSelectConversation} />
          </div>

          {/* Detail View */}
          {selectedConversation && (
            <div
              className={slideDirection}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                background: THEME.colors.background,
                zIndex: 10
              }}
            >
              <ChatDetailView conversation={selectedConversation} onBack={handleBack} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
