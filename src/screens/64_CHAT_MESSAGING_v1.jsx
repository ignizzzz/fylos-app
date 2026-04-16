import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Search,
  Phone,
  Info,
  Send,
  Plus,
  Check,
  CheckCheck,
  Clock,
  Calendar,
  MapPin,
  Star,
  X,
  Camera,
  Heart,
  MessageCircle,
  PawPrint,
  ChevronRight,
  Smile,
  Image,
  Mic,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// CONVERSATIONS DATA
// ---------------------------------------------------------------------------
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
    bookingContext: '60 min Walk · Tomorrow',
  },
  {
    id: 2,
    name: 'Marc B.',
    role: 'Groomer',
    initials: 'MB',
    color: '#E85D2A',
    lastMessage: "Luna's grooming session is all set for Friday",
    time: '1h',
    unread: true,
    online: false,
    bookingContext: 'Full Groom · Friday',
  },
  {
    id: 3,
    name: 'Vet Clinic Seefeld',
    role: 'Veterinary',
    initials: 'VS',
    color: '#34C759',
    lastMessage: 'Vaccination records have been updated',
    time: '3h',
    unread: false,
    online: true,
    bookingContext: 'Checkup · Next Monday',
  },
  {
    id: 4,
    name: 'Lena W.',
    role: 'Pet Sitter',
    initials: 'LW',
    color: '#FF9500',
    lastMessage: "I'd love to watch Luna next weekend!",
    time: 'Yesterday',
    unread: false,
    online: false,
    bookingContext: 'Overnight Stay · Mar 22-23',
  },
  {
    id: 5,
    name: 'Fylos',
    role: 'Notifications',
    initials: 'F',
    color: '#6E6058',
    lastMessage: 'Your booking with Sofia L. has been confirmed',
    time: 'Yesterday',
    unread: false,
    online: false,
    bookingContext: null,
  },
];

// ---------------------------------------------------------------------------
// CHAT MESSAGES
// ---------------------------------------------------------------------------
const CHAT_MESSAGES = [
  {
    id: 1,
    type: 'received',
    text: null,
    time: '9:41 AM',
    isDateSeparator: true,
    dateLabel: 'Today',
  },
  {
    id: 2,
    type: 'sent',
    text: "Hi Sofia! Just confirming Luna's walk tomorrow at 10am \uD83D\uDC3E",
    time: '10:12 AM',
    read: true,
  },
  {
    id: 3,
    type: 'received',
    text: 'Hi! Yes, confirmed! Should I pick her up from the usual spot?',
    time: '10:14 AM',
  },
  {
    id: 4,
    type: 'sent',
    text: "Yes please, she'll be ready at the front door",
    time: '10:15 AM',
    read: true,
  },
  {
    id: 5,
    type: 'booking',
    service: '60 min Walk',
    date: 'Tomorrow 10:00',
    status: 'Confirmed',
    time: '10:15 AM',
  },
  {
    id: 6,
    type: 'received',
    text: "I'll bring some treats, Luna loves the duck ones right?",
    time: '10:22 AM',
  },
  {
    id: 7,
    type: 'sent',
    text: 'Haha yes! She goes crazy for those \uD83D\uDE04',
    time: '10:23 AM',
    read: true,
  },
  {
    id: 8,
    type: 'typing',
  },
];

// ---------------------------------------------------------------------------
// TYPING INDICATOR (3 bouncing dots)
// ---------------------------------------------------------------------------
const TypingIndicator = () => (
  <div className="flex items-start gap-2 mb-1">
    <div
      className="bg-[#F3EFEB] rounded-[20px] rounded-bl-[6px] px-4 py-3 flex items-center gap-[5px]"
      style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(0,0,0,0.03)' }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-[7px] h-[7px] rounded-full bg-[#A09A94]"
          style={{ animation: `typingBounce 1.4s ease-in-out ${i * 0.2}s infinite` }}
        />
      ))}
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// BOOKING CARD (in chat)
// ---------------------------------------------------------------------------
const BookingCard = ({ service, date, status }) => {
  const isConfirmed = status === 'Confirmed';
  return (
    <div className="flex justify-center my-2">
      <div
        className="bg-[#F3EFEB] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)] active:scale-[0.97] transition-all duration-[120ms] cursor-pointer"
        style={{ width: 270 }}
      >
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className="w-9 h-9 rounded-[10px] bg-[#E85D2A]/[0.08] flex items-center justify-center">
            <PawPrint size={18} color="#E85D2A" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-semibold text-[#111111]">{service}</div>
          </div>
          <ChevronRight size={14} color="#A09A94" />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Calendar size={12} color="#6E6058" />
            <span className="text-[13px] text-[#6E6058]">{date}</span>
          </div>
          <span
            className={`h-[18px] px-2.5 rounded-full text-[9px] font-semibold inline-flex items-center ${
              isConfirmed
                ? 'bg-[#EEF7F1] text-[#3F8D63] border border-[#D7EBDD]'
                : 'bg-[#F7F4EF] text-[#B07A3A] border border-[#ECDDC8]'
            }`}
          >
            {status}
          </span>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// DATE SEPARATOR
// ---------------------------------------------------------------------------
const DateSeparator = ({ label }) => (
  <div className="flex items-center gap-3 my-4 px-5">
    <div className="flex-1 h-[0.5px] bg-black/[0.06]" />
    <span className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest">{label}</span>
    <div className="flex-1 h-[0.5px] bg-black/[0.06]" />
  </div>
);

// ---------------------------------------------------------------------------
// MESSAGE BUBBLE (iMessage-style)
// ---------------------------------------------------------------------------
const MessageBubble = ({ message }) => {
  const isSent = message.type === 'sent';

  return (
    <div
      className={`flex flex-col mb-1 px-5 ${isSent ? 'items-end' : 'items-start'}`}
    >
      <div
        className="max-w-[75%] px-4 py-[11px] text-[15px] leading-[1.45] break-words"
        style={{
          background: isSent
            ? '#E85D2A'
            : '#F3EFEB',
          color: isSent ? '#FFFFFF' : '#111111',
          borderRadius: 20,
          borderBottomRightRadius: isSent ? 6 : 20,
          borderBottomLeftRadius: isSent ? 20 : 6,
          boxShadow: isSent
            ? '0 2px 12px rgba(232,93,42,0.2)'
            : '0 2px 8px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(0,0,0,0.03)',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {message.text}
      </div>
      <div className="flex items-center gap-1 mt-[3px] px-1">
        <span className="text-[11px] text-[#A09A94]">{message.time}</span>
        {isSent && message.read && (
          <CheckCheck size={13} color="#E85D2A" strokeWidth={2.5} />
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CONVERSATION ITEM
// ---------------------------------------------------------------------------
const ConversationItem = ({ conversation, onTap }) => (
  <div
    onClick={() => onTap(conversation)}
    className="flex items-start gap-3 px-5 py-3.5 cursor-pointer active:bg-black/[0.02] transition-all duration-[120ms]"
  >
    {/* Avatar */}
    <div className="relative shrink-0">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${conversation.color}dd, ${conversation.color})`,
          boxShadow: `0 2px 8px ${conversation.color}30`,
        }}
      >
        <span className="text-white text-[15px] font-bold tracking-[-0.2px]">
          {conversation.initials}
        </span>
      </div>
      {conversation.online && (
        <div className="absolute bottom-0 right-0 w-[13px] h-[13px] rounded-full bg-[#34C759] border-[2.5px] border-white" />
      )}
    </div>

    {/* Content */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <span
          className={`text-[15px] text-[#111111] ${
            conversation.unread ? 'font-bold' : 'font-semibold'
          }`}
        >
          {conversation.name}
        </span>
        <span className="text-[12px] text-[#A09A94] shrink-0">{conversation.time}</span>
      </div>

      {conversation.bookingContext && (
        <div className="inline-flex items-center gap-1 bg-[#F3EFEB] px-2 py-0.5 rounded-full mb-1">
          <Calendar size={10} color="#6E6058" />
          <span className="text-[11px] text-[#6E6058] font-medium">{conversation.bookingContext}</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <p
          className={`text-[13px] m-0 overflow-hidden text-ellipsis whitespace-nowrap flex-1 ${
            conversation.unread ? 'text-[#111111] font-medium' : 'text-[#6E6058]'
          }`}
        >
          {conversation.lastMessage}
        </p>
        {conversation.unread && (
          <div
            className="w-[9px] h-[9px] rounded-full shrink-0"
            style={{ background: '#E85D2A' }}
          />
        )}
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// CONVERSATIONS LIST VIEW
// ---------------------------------------------------------------------------
const ConversationsListView = ({ onSelectConversation }) => {
  const [searchValue, setSearchValue] = useState('');

  const filtered = CONVERSATIONS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="relative flex flex-col h-full bg-[#F7F5F2]">
      {/* Floating Header */}
      <header
        className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent"
        style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}
      >
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button
            onClick={() => window.history.back()}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#F3EFEB] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          <h2 className="text-[17px] font-semibold text-[#111111]">Messages</h2>
          <div className="w-[44px]" />
        </div>
      </header>

      {/* Scrollable content */}
      <div className="wallet-scroll" style={{ flex: 1, overflowY: 'auto', paddingTop: 100, paddingBottom: 40 }}>
        {/* Search bar */}
        <div className="px-5 pb-2">
          <div className="flex items-center gap-2 bg-[#F3EFEB] rounded-full px-3.5 h-[44px] border border-black/[0.03] shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)]">
            <Search size={16} color="#A09A94" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="border-none bg-transparent outline-none text-[15px] text-[#111111] w-full placeholder:text-[#A09A94]"
              style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
            />
            {searchValue && (
              <div
                onClick={() => setSearchValue('')}
                className="w-[18px] h-[18px] rounded-full bg-[#A09A94] flex items-center justify-center cursor-pointer shrink-0"
              >
                <X size={10} color="#FFFFFF" strokeWidth={3} />
              </div>
            )}
          </div>
        </div>

        {/* Conversations list card */}
        <div className="px-5 pt-1">
          <div className="bg-[#F3EFEB] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)] overflow-hidden">
            {filtered.map((conv, index) => (
              <React.Fragment key={conv.id}>
                <ConversationItem conversation={conv} onTap={onSelectConversation} />
                {index < filtered.length - 1 && (
                  <div className="h-[0.5px] bg-black/[0.04] ml-[76px] mr-5" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// CHAT DETAIL VIEW
// ---------------------------------------------------------------------------
const ChatDetailView = ({ conversation, onBack }) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="relative flex flex-col h-full bg-[#F7F5F2]">
      {/* Floating Header */}
      <header
        className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent"
        style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}
      >
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button
            onClick={onBack}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#F3EFEB] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>

          {/* Center: Name + status */}
          <div className="flex items-center gap-2">
            <div
              className="relative w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0"
              style={{
                background: `linear-gradient(135deg, ${conversation.color}dd, ${conversation.color})`,
                boxShadow: `0 2px 6px ${conversation.color}25`,
              }}
            >
              <span className="text-white text-[10px] font-bold">{conversation.initials}</span>
              {conversation.online && (
                <div className="absolute -bottom-[1px] -right-[1px] w-[9px] h-[9px] rounded-full bg-[#34C759] border-2 border-white" />
              )}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-[#111111] leading-[1.2]">{conversation.name}</div>
              <div
                className="text-[11px]"
                style={{ color: conversation.online ? '#34C759' : '#A09A94' }}
              >
                {conversation.online ? 'Online' : conversation.role}
              </div>
            </div>
          </div>

          {/* Right: Phone + Info grouped pill */}
          <div className="flex items-center bg-[#F3EFEB] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] p-1">
            <button className="w-[36px] h-[36px] flex items-center justify-center rounded-full active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]">
              <Phone size={18} color="#111111" strokeWidth={2} />
            </button>
            <div className="w-[1px] h-[18px] bg-black/[0.06]" />
            <button className="w-[36px] h-[36px] flex items-center justify-center rounded-full active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]">
              <Info size={18} color="#111111" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="wallet-scroll" style={{ flex: 1, overflowY: 'auto', paddingTop: 100, paddingBottom: 8 }}>
        {CHAT_MESSAGES.map((msg) => {
          if (msg.isDateSeparator) {
            return <DateSeparator key={msg.id} label={msg.dateLabel} />;
          }
          if (msg.type === 'booking') {
            return <BookingCard key={msg.id} service={msg.service} date={msg.date} status={msg.status} />;
          }
          if (msg.type === 'typing') {
            return (
              <div key="typing" className="px-5 mt-1">
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
        className="flex items-center gap-2 px-4 pt-2 pb-3 border-t border-black/[0.04]"
        style={{
          background: 'rgba(247,245,242,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <button className="w-9 h-9 rounded-full bg-[#E85D2A]/[0.08] flex items-center justify-center shrink-0 active:scale-[0.97] transition-all duration-[120ms]">
          <Plus size={22} color="#E85D2A" strokeWidth={2} />
        </button>

        <div className="flex-1 flex items-center bg-[#F3EFEB] border border-[#EDE8E2] rounded-full px-4 h-[44px] shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)]">
          <input
            type="text"
            placeholder="Message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="border-none bg-transparent outline-none text-[15px] text-[#111111] w-full placeholder:text-[#A09A94]"
            style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
          />
          {!inputText.trim() && (
            <Smile size={20} color="#A09A94" className="shrink-0 ml-1" />
          )}
        </div>

        {inputText.trim() ? (
          <button
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center shrink-0 active:scale-[0.97] transition-all duration-[120ms]"
            style={{
              background: '#E85D2A',
              boxShadow: '0 4px 12px rgba(232,93,42,0.3)',
            }}
          >
            <Send size={16} color="#FFFFFF" strokeWidth={2.5} style={{ marginLeft: -1, marginTop: -1 }} />
          </button>
        ) : (
          <button className="w-[38px] h-[38px] rounded-full bg-[#F3EFEB] flex items-center justify-center shrink-0 active:scale-[0.97] transition-all duration-[120ms]">
            <Mic size={18} color="#A09A94" strokeWidth={2} />
          </button>
        )}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// MAIN SCREEN
// ---------------------------------------------------------------------------
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
        backgroundColor: '#F7F5F2',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        padding: 20,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
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
        .wallet-scroll::-webkit-scrollbar { display: none; }
        .wallet-scroll { scrollbar-width: none; }
        input::placeholder { color: #A09A94; }
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
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {/* List View */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: activeView === 'list' ? 'flex' : 'none',
              flexDirection: 'column',
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
                background: '#F7F5F2',
                zIndex: 10,
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
