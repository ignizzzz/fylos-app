import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, CheckCheck,
  Camera, ArrowUp, Info, Phone, AlertTriangle, ArrowRight, Star,
} from 'lucide-react';
import { T, SHADOWS, RADIUS } from '../styles/theme';
import { IconBtn, Pill, PrimaryBtn } from '../components/ui';

// ==========================================
// MOCK DATA
// ==========================================
const WALKER_IMAGE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80';

const INITIAL_MESSAGES = [
    { id: 1, type: 'system', text: 'Booking requested', time: 'Mon, 14:23' },
    { id: 2, type: 'user', text: 'Hi Lukas! Just sent a request.', time: '14:24', status: 'read' },
    { id: 3, type: 'user', text: 'Luna is a bit shy at first but loves treats', time: '14:24', status: 'read' },
    { id: 4, type: 'walker', text: 'Hi there! Thanks for the request.', time: '14:35' },
    { id: 5, type: 'walker', text: 'I love Golden Retrievers. I always carry premium treats with me, so we should be best friends in no time!', time: '14:35' },
    { id: 6, type: 'user', text: 'That sounds perfect! See you then.', time: '14:38', status: 'delivered' },
    { id: 7, type: 'user', text: 'I will leave the leash by the door.', time: '14:39', status: 'sent' },
    { id: 8, type: 'user', text: 'Thanks again!', time: '14:39', status: 'read' },
    { id: 8.5, type: 'system', text: '• Walk started', time: '09:03' },
    { id: 9, type: 'system-location', text: 'Bellevueplatz', status: 'completed', updated: '2m', time: '16:00' },
    { id: 10, type: 'system-summary', duration: '91 min', distance: '3.2 km', time: '16:00' },
];

const QUICK_REPLIES = ['Thanks!', 'See you then!', 'Can we reschedule?'];

// ==========================================
// LOCAL STYLES (only for chat-specific animations)
// ==========================================
const ChatStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes slideUpFade { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    .animate-expand-content { animation: slideUpFade 0.3s ease-out forwards; }
    @keyframes scaleFadeIn { from { opacity: 0; transform: scale(0.95) translateY(-10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .animate-scale-fade-in { animation: scaleFadeIn 0.2s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes pulseDot { 0% { transform: scale(0.85); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.85); opacity: 0.5; } }
    .animate-pulse-dot { animation: pulseDot 2.5s infinite ease-in-out; }
    @keyframes burst { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
    .burst-particle { position: absolute; width: 4px; height: 4px; background: ${T.coral}; border-radius: 50%; pointer-events: none; }
  `}</style>
);

// ==========================================
// CHROME (iPhone frame + status bar)
// ==========================================
const StatusBar = () => (
  <div className="absolute top-0 left-0 w-full h-[54px] flex justify-between items-end px-7 pb-3 z-[150] text-[13px] font-semibold pointer-events-none" style={{ color: T.txt }}>
    <span>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={T.txt}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={T.txt}/><rect x="9" y="2" width="3" height="10" rx="1" fill={T.txt}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={T.txt}/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={T.txt}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={T.txt} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={T.txt} strokeWidth="1.5" strokeLinecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={T.txt} strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill={T.txt}/></svg>
    </div>
  </div>
);

const TopFadeScrim = () => (
  <div
    className="absolute top-0 left-0 w-full z-[40] pointer-events-none"
    style={{ height: 240, background: `linear-gradient(to bottom, ${T.bg} 190px, transparent 100%)` }}
  />
);

const BottomFadeScrim = () => (
  <div
    className="absolute bottom-0 left-0 w-full z-[40] pointer-events-none"
    style={{ height: 140, background: `linear-gradient(to top, ${T.bg} 45%, transparent 100%)` }}
  />
);

const BookingContextPill = ({ onViewBooking }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative pointer-events-auto w-full px-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full h-9 rounded-full px-4 flex items-center justify-between active:scale-[0.98] transition-transform"
        style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, boxShadow: SHADOWS.card }}
      >
        <span className="text-[12.5px] font-medium truncate flex-1 text-center" style={{ color: T.txt }}>
          90 min Walk · Luna · Mon, Feb 16 · 09:00
        </span>
        <Info size={15} strokeWidth={2.4} color={T.muted} className="shrink-0 ml-2" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
          <div
            className="absolute top-[calc(100%+8px)] left-4 right-4 p-4 flex flex-col gap-3 z-[100] animate-scale-fade-in box-border"
            style={{
              backgroundColor: T.card,
              border: `1px solid ${T.border}`,
              borderRadius: RADIUS.lg,
              boxShadow: '0 8px 24px -4px rgba(0,0,0,0.1)',
            }}
          >
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-medium" style={{ color: T.muted }}>Status</span>
              <span className="font-semibold" style={{ color: T.success }}>Accepted</span>
            </div>
            <div className="flex justify-between items-center text-[13px]">
              <span className="font-medium" style={{ color: T.muted }}>Time</span>
              <span className="font-semibold" style={{ color: T.txt }}>09:00–10:30</span>
            </div>
            <div className="h-px w-full" style={{ backgroundColor: T.divider }} />
            <button
              onClick={() => { setOpen(false); onViewBooking?.(); }}
              className="text-[13px] font-semibold text-left flex justify-between items-center active:opacity-70"
              style={{ color: T.coral }}
            >
              View booking details
              <ArrowRight size={13} strokeWidth={2.4} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ==========================================
// CHAT SCREEN
// ==========================================
const ChatScreen = ({ onBack, onViewBooking }) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [messageInput, setMessageInput] = useState('');
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isRatingExpanded, setIsRatingExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [burstKey, setBurstKey] = useState(0);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isMapExpanded, isRatingExpanded]);

  const handleInput = (e) => {
    setMessageInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSendMessage = (text = messageInput) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), type: 'user', text, time: '14:40', status: 'sent' }]);
    setMessageInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleSubmitRating = () => {
    setIsRatingExpanded(false);
    setTimeout(() => setIsRated(true), 300);
  };

  const handleStarClick = (i) => {
    setRating(i);
    if (i === 5) setBurstKey((k) => k + 1);
  };

  const MessageStatus = ({ status }) => {
    if (status === 'sent') return <span className="flex items-center gap-1"><span>Sent</span><Check size={11} strokeWidth={2} /></span>;
    if (status === 'delivered') return <span className="flex items-center gap-1"><span>Delivered</span><CheckCheck size={11} strokeWidth={2} /></span>;
    if (status === 'read') return <span className="flex items-center gap-1" style={{ color: T.coral }}><span>Read</span><CheckCheck size={11} strokeWidth={2} /></span>;
    return null;
  };

  return (
    <div className="w-full h-full relative animate-fade-in font-sans overflow-hidden" style={{ backgroundColor: T.bg }}>
      <TopFadeScrim />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-50 flex flex-col pointer-events-none">
        <div className="w-full pt-[64px] pb-1 px-4 flex items-start justify-between pointer-events-auto">
          <div className="w-[90px] flex justify-start">
            <IconBtn icon={ChevronLeft} ariaLabel="Back" onClick={onBack} size={40} />
          </div>

          <div className="flex flex-col items-center justify-center cursor-pointer active:opacity-70 mt-[-2px] flex-1">
            <img src={WALKER_IMAGE} alt="Lukas" className="w-9 h-9 rounded-full object-cover mb-1.5 border" style={{ borderColor: T.card, boxShadow: SHADOWS.card }} />
            <span className="font-semibold text-[14.5px] mb-1" style={{ color: T.txt, letterSpacing: '-0.2px' }}>Lukas F.</span>
            <span className="text-[11.5px] font-medium" style={{ color: T.muted }}>Usually responds &lt;1h</span>
          </div>

          <div className="w-[90px] flex items-center justify-end gap-2 shrink-0">
            <IconBtn icon={Phone} ariaLabel="Call" onClick={() => {}} size={40} />
            <button
              className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95 transition-transform"
              style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, boxShadow: SHADOWS.card }}
            >
              <AlertTriangle size={18} color={T.danger} strokeWidth={2.1} />
            </button>
          </div>
        </div>

        {/* Booking Pill */}
        <div className="w-full px-0 mt-2 pointer-events-auto">
          <BookingContextPill onViewBooking={onViewBooking} />
        </div>
      </div>

      {/* Scroll Area */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <div className="w-full h-full overflow-y-auto no-scrollbar pt-[210px] pb-[160px]">
          <div className="px-5 flex flex-col">
            {messages.map((msg) => {
              const isUser = msg.type === 'user';

              if (msg.type === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-3 animate-fade-in">
                    <span className="text-[10.5px] font-medium tracking-wide uppercase" style={{ color: T.muted }}>
                      {msg.text} · {msg.time}
                    </span>
                  </div>
                );
              }

              if (msg.type === 'system-location') {
                const isCompleted = msg.status === 'completed';
                return (
                  <div key={msg.id} className="w-full flex flex-col items-center gap-0.5 my-5">
                    <button
                      onClick={() => setIsMapExpanded(!isMapExpanded)}
                      className="flex items-center gap-1.5 text-[13px] active:opacity-60 transition-opacity"
                      style={{ color: T.txt }}
                    >
                      {isCompleted ? (
                        <Check size={14} strokeWidth={4} color={T.coral} />
                      ) : (
                        <div className="w-2 h-2 rounded-full animate-pulse-dot" style={{ backgroundColor: T.coral }} />
                      )}

                      <div className="flex items-center">
                        <span className="font-semibold">{isCompleted ? 'Completed' : 'Live'}</span>
                        <span className="mx-1 opacity-40" style={{ color: T.muted }}>•</span>
                        <span className="font-medium">{isCompleted ? msg.time : msg.text}</span>
                      </div>

                      <ChevronRight
                        size={14}
                        strokeWidth={3}
                        color={T.coral}
                        className={`transition-transform duration-300 ${isMapExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>

                    {isCompleted && (
                      <span className="text-[11px] font-medium opacity-60 animate-fade-in" style={{ color: T.muted }}>
                        Last location: {msg.text}
                      </span>
                    )}

                    <div className={`grid transition-all duration-300 ease-out overflow-hidden w-full ${isMapExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="min-h-0">
                        <div className="flex flex-col items-center gap-2 mt-3 animate-expand-content">
                          <div
                            className="w-full aspect-[16/9] relative overflow-hidden"
                            style={{ backgroundColor: T.tint, borderRadius: RADIUS.lg, border: `1px solid ${T.border}`, boxShadow: SHADOWS.card }}
                          >
                            <img
                              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=40"
                              className="w-full h-full object-cover opacity-60"
                              alt="Map"
                            />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                              <div
                                className={`w-4 h-4 rounded-full border-2 ${!isCompleted ? 'animate-pulse-dot' : ''}`}
                                style={{ backgroundColor: T.coral, borderColor: T.card, boxShadow: SHADOWS.card }}
                              />
                            </div>
                          </div>
                          {!isCompleted && (
                            <span className="text-[11px] font-medium italic" style={{ color: T.muted, opacity: 0.6 }}>
                              Updated {msg.updated} ago
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              if (msg.type === 'system-summary') {
                return (
                  <div key={msg.id} className="w-full flex flex-col items-center gap-3 my-6">
                    <div className="flex items-center gap-6" style={{ color: T.txt }}>
                      <span className="text-[26px] font-bold tracking-tight">{msg.duration}</span>
                      <div className="w-px h-6" style={{ backgroundColor: T.divider }} />
                      <span className="text-[26px] font-bold tracking-tight">{msg.distance}</span>
                    </div>

                    {!isRated ? (
                      <button
                        onClick={() => setIsRatingExpanded(!isRatingExpanded)}
                        className="text-[13.5px] font-semibold flex items-center gap-0.5 active:opacity-60"
                        style={{ color: T.coral }}
                      >
                        Rate Lukas
                        <ChevronRight
                          size={14}
                          strokeWidth={3}
                          className={`transition-transform duration-300 ${isRatingExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[13.5px] font-semibold animate-fade-in" style={{ color: T.coral }}>
                        <Check size={15} strokeWidth={3} />
                        <span>Rated {rating} stars</span>
                      </div>
                    )}

                    <div className={`grid transition-all duration-300 ease-out overflow-hidden w-full ${isRatingExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="min-h-0">
                        <div className="flex flex-col items-center gap-5 mt-4 py-2 animate-expand-content">
                          <div className="flex items-center gap-3 relative">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <button
                                key={i}
                                className="relative outline-none"
                                onMouseEnter={() => setHoverRating(i)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => handleStarClick(i)}
                              >
                                <Star
                                  size={32}
                                  fill={(hoverRating || rating) >= i ? T.coral : 'none'}
                                  strokeWidth={2}
                                  color={(hoverRating || rating) >= i ? T.coral : '#E5E5EA'}
                                  className={`transition-all duration-200 ${(hoverRating || rating) >= i ? 'scale-110' : ''}`}
                                />
                                {i === 5 && burstKey > 0 && rating === 5 && (
                                  <div key={burstKey} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    {[...Array(8)].map((_, idx) => (
                                      <div key={idx} className="burst-particle" style={{ transform: `rotate(${idx * 45}deg) translateY(-20px)`, animation: 'burst 0.6s ease-out forwards' }} />
                                    ))}
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>

                          {rating > 0 && (
                            <div className="w-full flex flex-col items-center gap-3 animate-fade-in">
                              <textarea
                                placeholder="Add a comment (optional)"
                                rows={2}
                                className="w-full max-w-[280px] rounded-[14px] px-4 py-3 text-[14px] resize-none outline-none transition-colors"
                                style={{
                                  backgroundColor: T.card,
                                  border: `1px solid ${T.border}`,
                                  color: T.txt,
                                }}
                              />
                              <div className="w-[180px]">
                                <PrimaryBtn onClick={handleSubmitRating}>Submit rating</PrimaryBtn>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4 animate-fade-in`}>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 text-[14.5px] leading-relaxed`}
                    style={{
                      backgroundColor: isUser ? T.coral : T.card,
                      color: isUser ? '#FFFFFF' : T.txt,
                      borderRadius: 18,
                      border: isUser ? 'none' : `1px solid ${T.border}`,
                      boxShadow: SHADOWS.card,
                    }}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1.5 text-[10px] mt-0.5 ${isUser ? 'mr-1 justify-end' : 'ml-1'}`} style={{ color: T.muted }}>
                    <span className="opacity-60">{msg.time}</span>
                    {isUser && msg.status && <><span className="opacity-40 mx-0.5">·</span><MessageStatus status={msg.status} /></>}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <BottomFadeScrim />

      {/* Bottom input bar */}
      <div className="absolute bottom-0 left-0 w-full z-[60] flex flex-col pointer-events-none px-4 pt-3 pb-[34px]">
        <div className="flex flex-col animate-fade-in w-full pointer-events-auto">
          <div className="flex w-full overflow-x-auto no-scrollbar mb-2 pb-2 px-1">
            <div className="flex gap-2">
              {QUICK_REPLIES.map((reply) => (
                <Pill key={reply} onClick={() => handleSendMessage(reply)}>
                  {reply}
                </Pill>
              ))}
            </div>
          </div>
          <div className="w-full flex items-end gap-2.5">
            <button
              className="w-11 h-11 rounded-full flex items-center justify-center active:scale-95 transition-transform shrink-0"
              style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, boxShadow: SHADOWS.card, color: T.txt }}
            >
              <Camera size={20} strokeWidth={1.6} />
            </button>
            <div
              className="flex-1 rounded-[22px] flex items-end p-1 min-h-[44px]"
              style={{ backgroundColor: T.card, border: `1px solid ${T.border}`, boxShadow: SHADOWS.card }}
            >
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder="Message..."
                className="w-full bg-transparent border-none outline-none text-[15px] resize-none max-h-[120px] py-2 pl-4 pr-2 font-normal leading-normal"
                style={{ color: T.txt, height: 36, minHeight: 36 }}
                value={messageInput}
                onChange={handleInput}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!messageInput.trim()}
                className="w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300"
                style={{
                  backgroundColor: messageInput.trim() ? T.coral : 'transparent',
                  color: messageInput.trim() ? '#FFFFFF' : '#C7C7CC',
                  opacity: messageInput.trim() ? 1 : 0.3,
                  boxShadow: messageInput.trim() ? '0 2px 6px rgba(232,93,42,0.24)' : 'none',
                }}
              >
                <ArrowUp size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ChatScreen as WalkerChatView };

// ==========================================
// APP ENTRY (standalone preview wrapper)
// ==========================================
export default function App() {
  return (
    <>
      <ChatStyles />
      <div className="flex items-center justify-center min-h-screen py-10 font-sans" style={{ backgroundColor: '#111' }}>
        <div className="relative w-[390px] h-[844px] overflow-hidden" style={{ borderRadius: 55, boxShadow: '0 0 0 12px #000, 0 0 0 14px #333', backgroundColor: T.bg }}>
          <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] rounded-[20px] z-[200] pointer-events-none" style={{ backgroundColor: '#000' }} />
          <StatusBar />
          <div className="w-full h-full relative flex flex-col">
            <ChatScreen />
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full z-[200]" style={{ backgroundColor: '#000' }} />
        </div>
      </div>
    </>
  );
}
