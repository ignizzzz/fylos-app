import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Signal, Wifi, Battery, Check, CheckCheck, 
  MoreHorizontal, Camera, ArrowUp, Lock, Info, Phone, FileText, AlertTriangle, MapPin, ArrowRight, Star 
} from 'lucide-react';

// ==========================================
// 1. GLOBAL STYLES
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    :root {
      --primary: #111111; 
      --secondary: #6E6E73;
      --tertiary: #8E8E93;
      --accent: #F0653A; 
      --bg-app: #FFFFFF;
      --bg-subtle: #F7F7F8;
      --divider: #F1F1F1;
      --border-light: #E5E5EA; 
      --ease-spring: cubic-bezier(0.19, 1, 0.22, 1);
    }

    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      background-color: #000; 
      color: var(--primary); 
      -webkit-font-smoothing: antialiased;
    } 
    
    .font-brand { font-family: 'Inter', sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Animations */
    @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(6px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-expand-content { animation: slideUpFade 0.3s ease-out forwards; }

    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.98); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }

    @keyframes star-pop {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    .animate-star-pop { animation: star-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }

    @keyframes pulse-dot {
        0% { transform: scale(0.85); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(0.85); opacity: 0.5; }
    }
    .animate-pulse-dot { animation: pulse-dot 2.5s infinite ease-in-out; }

    @keyframes burst {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(2.5); opacity: 0; }
    }
    .burst-particle { 
        position: absolute; 
        width: 4px; height: 4px; 
        background: #F0653A; 
        border-radius: 50%;
        pointer-events: none;
    }

    @keyframes scale-fade-in {
        from { opacity: 0; transform: scale(0.95) translateY(-10px); }
        to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .animate-scale-fade-in { animation: scale-fade-in 0.2s var(--ease-spring) forwards; }
  `}</style>
);

// ==========================================
// 2. MOCK DATA
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

const QUICK_REPLIES = ["Thanks!", "See you then!", "Can we reschedule?"];

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const StatusBar = ({ lightMode = false }) => (
  <div className={`absolute top-0 left-0 w-full h-[54px] flex justify-between items-end px-7 pb-3 z-[150] text-[13px] font-semibold tracking-wide pointer-events-none ${lightMode ? 'text-white' : 'text-black'}`}>
    <span>9:41</span>
    <div className="flex items-center gap-1.5">
      <Signal size={16} strokeWidth={2.5} />
      <Wifi size={16} strokeWidth={2.5} />
      <Battery size={18} strokeWidth={2.5} />
    </div>
  </div>
);

const TopFadeScrim = () => (
    <div 
        className="absolute top-0 left-0 w-full z-[40] pointer-events-none"
        style={{ 
            height: '240px', 
            background: 'linear-gradient(to bottom, #FFFFFF 190px, rgba(255,255,255,0) 100%)' 
        }}
    />
);

const BottomFadeScrim = () => (
    <div 
        className="absolute bottom-0 left-0 w-full z-[40] pointer-events-none"
        style={{ 
            height: '140px', 
            background: 'linear-gradient(to top, #FFFFFF 45%, rgba(255,255,255,0) 100%)' 
        }}
    />
);

const BookingContextPill = ({ bookingStatus, onViewBooking }) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    return (
        <div className="relative pointer-events-auto w-full px-4">
            <button 
                onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                className="w-full h-[36px] bg-white border border-[#E5E5EA] shadow-sm rounded-full px-4 flex items-center justify-between transition-all duration-200 active:scale-[0.98]"
            >
                <span className="text-[13px] font-medium text-[#111111] truncate flex-1 text-center">
                    90 min Walk · Luna · Mon, Feb 16 · 09:00
                </span>
                <Info size={16} strokeWidth={2.5} className="text-[#8E8E93] shrink-0 ml-2" />
            </button>

            {isPopoverOpen && (
                <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsPopoverOpen(false)} />
                    <div className="absolute top-[calc(100%+8px)] left-4 right-4 bg-white border border-[#E5E5EA] rounded-[16px] p-4 flex flex-col gap-3 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.1)] animate-scale-fade-in origin-top z-[100] box-border">
                        <div className="flex justify-between items-center text-[13px]">
                            <span className="text-[#8E8E93] font-medium">Status</span>
                            <span className={`font-semibold text-[#34C759]`}>Accepted</span>
                        </div>
                        <div className="flex justify-between items-center text-[13px]">
                            <span className="text-[#8E8E93] font-medium">Time</span>
                            <span className="font-semibold text-[#111111]">09:00–10:30</span>
                        </div>
                        <div className="h-px w-full bg-[#F1F1F1] my-0.5" />
                        <button onClick={() => { setIsPopoverOpen(false); onViewBooking && onViewBooking(); }} className="text-[13px] font-semibold text-[#F0653A] text-left flex justify-between items-center group active:opacity-70 transition-opacity">
                            View booking details
                            <ArrowRight size={14} strokeWidth={2.5} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

// ==========================================
// 4. CHAT SCREEN
// ==========================================

const ChatScreen = ({ onBack, onViewBooking }) => {
    const [bookingStatus, setBookingStatus] = useState('accepted');
    const [messages, setMessages] = useState(INITIAL_MESSAGES);
    const [messageInput, setMessageInput] = useState('');
    
    // Interactions State
    const [isMapExpanded, setIsMapExpanded] = useState(false);
    const [isRatingExpanded, setIsRatingExpanded] = useState(false);
    const [rating, setRating] = useState(0);
    const [isRated, setIsRated] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);
    const [burstKey, setBurstKey] = useState(0);

    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, bookingStatus, isMapExpanded, isRatingExpanded]);

    const handleInput = (e) => {
        setMessageInput(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleSendMessage = (text = messageInput) => {
        if (!text.trim()) return;
        const newMessage = { id: Date.now(), type: 'user', text: text, time: '14:40', status: 'sent' };
        setMessages(prev => [...prev, newMessage]);
        setMessageInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleSubmitRating = () => {
        setIsRatingExpanded(false);
        setTimeout(() => setIsRated(true), 300);
    };

    const handleStarClick = (i) => {
        setRating(i);
        if (i === 5) {
            setBurstKey(prev => prev + 1);
        }
    };

    const MessageStatus = ({ status }) => {
        let icon = null;
        let text = '';
        let colorClass = 'text-[#C7C7CC]'; 
        switch (status) {
            case 'sent': icon = <Check size={12} strokeWidth={2} />; text = 'Sent'; break;
            case 'delivered': icon = <CheckCheck size={12} strokeWidth={2} />; text = 'Delivered'; break;
            case 'read': icon = <CheckCheck size={12} strokeWidth={2} className="text-[#F0653A]" />; text = 'Read'; break;
            default: return null;
        }
        return (
            <div className={`flex items-center gap-1 ${colorClass}`}>
                <span>{text}</span>
                {icon}
            </div>
        );
    };

    return (
        <div className="w-full h-full bg-white relative animate-fade-in font-sans overflow-hidden">
            <TopFadeScrim />

            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-50 flex flex-col pointer-events-none">
                <div className="w-full pt-[64px] pb-1 px-4 flex items-start justify-between pointer-events-auto">
                    
                    {/* Left: Container with fixed width to balance the center */}
                    <div className="w-[90px] flex justify-start">
                        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center text-[#111111] bg-white border border-[#E5E5EA] rounded-full hover:bg-[#F7F7F8] transition-all shrink-0 shadow-sm">
                            <ChevronLeft size={26} strokeWidth={2} />
                        </button>
                    </div>

                    {/* Center: Info Stack - Mathematically Centered */}
                    <div className="flex flex-col items-center justify-center cursor-pointer active:opacity-70 mt-[-2px] flex-1">
                        <img src={WALKER_IMAGE} alt="Lukas" className="w-[36px] h-[36px] rounded-full object-cover mb-1.5 border border-white shadow-sm" />
                        <div className="flex flex-col items-center leading-none">
                             <span className="font-semibold text-[15px] text-[#111111] mb-1.5 tracking-tight">Lukas F.</span>
                             <span className="text-[12px] text-[#8E8E93] font-medium tracking-wide">Usually responds &lt;1h</span>
                        </div>
                    </div>

                    {/* Right: Actions Container with fixed width to balance the left */}
                    <div className="w-[90px] flex items-center justify-end gap-2 shrink-0">
                        <button className="w-10 h-10 flex items-center justify-center text-[#111111] bg-white border border-[#E5E5EA] rounded-full hover:bg-[#F7F7F8] transition-all shadow-sm">
                            <Phone size={20} strokeWidth={2} />
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center text-[#D93F3C] bg-white border border-[#E5E5EA] rounded-full hover:bg-[#F7F7F8] transition-all shadow-sm">
                            <AlertTriangle size={20} strokeWidth={2} />
                        </button>
                    </div>
                </div>
                
                {/* Booking Pill */}
                <div className="w-full px-0 mt-2 pointer-events-auto">
                    <BookingContextPill bookingStatus={bookingStatus} onViewBooking={onViewBooking} />
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
                                        <span className="text-[11px] font-medium text-[#8E8E93] tracking-wide uppercase">{msg.text} · {msg.time}</span>
                                    </div>
                                );
                            }

                            if (msg.type === 'system-location') {
                                const isCompleted = msg.status === 'completed';
                                return (
                                    <div key={msg.id} className="w-full flex flex-col items-center gap-0.5 my-5">
                                        <button 
                                            onClick={() => setIsMapExpanded(!isMapExpanded)}
                                            className="flex items-center gap-1.5 text-[13px] text-[#111111] active:opacity-60 transition-opacity"
                                        >
                                            {isCompleted ? (
                                                <div className="flex items-center justify-center w-3 h-3 text-[#F0653A] animate-fade-in">
                                                    <Check size={14} strokeWidth={4} />
                                                </div>
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-[#F0653A] animate-pulse-dot" />
                                            )}
                                            
                                            <div className="flex items-center transition-all duration-300">
                                                <span className="font-semibold">{isCompleted ? 'Completed' : 'Live'}</span>
                                                <span className="text-[#8E8E93] mx-1 opacity-40">•</span>
                                                <span className="font-medium">
                                                    {isCompleted ? msg.time : msg.text}
                                                </span>
                                            </div>

                                            <ChevronRight 
                                                size={14} 
                                                strokeWidth={3} 
                                                className={`text-[#F0653A] transition-transform duration-300 ${isMapExpanded ? 'rotate-90' : ''}`} 
                                            />
                                        </button>

                                        {isCompleted && (
                                            <span className="text-[11px] text-[#8E8E93] font-medium opacity-60 animate-fade-in">
                                                Last location: {msg.text}
                                            </span>
                                        )}
                                        
                                        <div className={`grid transition-all duration-300 ease-out overflow-hidden w-full ${isMapExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                            <div className="min-h-0">
                                                <div className="flex flex-col items-center gap-2 mt-3 animate-expand-content">
                                                    <div className="w-full aspect-[16/9] bg-[#F2F2F7] rounded-[16px] relative overflow-hidden shadow-sm border border-black/5">
                                                        <img 
                                                            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=40" 
                                                            className="w-full h-full object-cover desaturate-[0.6] opacity-60"
                                                            alt="Map placeholder"
                                                        />
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                                            <div className={`w-4 h-4 bg-[#F0653A] rounded-full border-2 border-white shadow-md ${!isCompleted ? 'animate-pulse-dot' : ''}`} />
                                                        </div>
                                                    </div>
                                                    {!isCompleted && (
                                                        <span className="text-[11px] font-medium text-[#8E8E93]/60 italic tracking-tight">Updated {msg.updated} ago</span>
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
                                        <div className="flex items-center gap-6 text-[#111111]">
                                            <span className="text-[26px] font-bold tracking-tight">{msg.duration}</span>
                                            <div className="w-px h-6 bg-black/10" />
                                            <span className="text-[26px] font-bold tracking-tight">{msg.distance}</span>
                                        </div>
                                        
                                        {!isRated ? (
                                            <button 
                                                onClick={() => setIsRatingExpanded(!isRatingExpanded)}
                                                className="text-[14px] font-semibold text-[#F0653A] flex items-center gap-0.5 active:opacity-60 transition-opacity"
                                            >
                                                Rate Lukas
                                                <ChevronRight 
                                                    size={14} 
                                                    strokeWidth={3} 
                                                    className={`transition-transform duration-300 ${isRatingExpanded ? 'rotate-90' : ''}`} 
                                                />
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#F0653A] animate-fade-in">
                                                <Check size={16} strokeWidth={3} />
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
                                                                    fill={(hoverRating || rating) >= i ? "#F0653A" : "none"} 
                                                                    className={`transition-all duration-200 ${((hoverRating || rating) >= i) ? 'text-[#F0653A] scale-110' : 'text-[#E5E5EA]'}`} 
                                                                    strokeWidth={2}
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
                                                                className="w-full max-w-[280px] bg-black/[0.03] border-none rounded-[14px] px-4 py-3 text-[14px] placeholder:text-[#8E8E93] resize-none outline-none focus:bg-black/[0.05] transition-colors"
                                                                rows={2}
                                                            />
                                                            <button 
                                                                onClick={handleSubmitRating}
                                                                className="px-6 h-[38px] bg-black text-white rounded-full text-[13px] font-bold active:scale-95 transition-transform shadow-md"
                                                            >
                                                                Submit rating
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div 
                                    key={msg.id} 
                                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-4 animate-fade-in`}
                                >
                                    <div className={`max-w-[75%] px-4 py-2.5 text-[15px] leading-relaxed shadow-sm transition-all ${isUser ? 'bg-[#F0653A] text-white rounded-[18px]' : 'bg-[#F4F4F5] text-[#111111] rounded-[18px]'}`}>
                                        {msg.text}
                                    </div>
                                    <div className={`flex items-center gap-1.5 text-[10px] text-[#8E8E93] mt-0.5 ${isUser ? 'mr-1 justify-end' : 'ml-1'}`}>
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
            <div className="absolute bottom-0 left-0 w-full z-[60] flex flex-col pointer-events-none bg-transparent px-4 pt-3 pb-[34px]">
                <div className="flex flex-col animate-fade-in w-full pointer-events-auto">
                    <div className="flex w-full overflow-x-auto no-scrollbar animate-slide-up mb-2 pb-2 px-1">
                        <div className="flex gap-2">
                            {QUICK_REPLIES.map((reply, i) => (
                                <button key={i} onClick={() => handleSendMessage(reply)} className="flex-shrink-0 whitespace-nowrap rounded-full bg-white border border-[#E5E5EA] px-4 py-2 text-[13px] font-[500] text-[#111111] tracking-[0.3px] active:scale-95 transition-all flex items-center hover:bg-[#F7F7F8] leading-normal shadow-sm">
                                    {reply}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="w-full flex items-end gap-2.5">
                        <button className="w-[44px] h-[44px] rounded-full bg-white border border-[#E5E5EA] flex items-center justify-center text-[#111111] active:scale-95 transition-all shrink-0 shadow-sm"><Camera size={22} strokeWidth={1.5} /></button>
                        <div className="flex-1 bg-white rounded-[22px] flex items-end p-1 border border-[#E5E5EA] transition-colors min-h-[44px] shadow-sm">
                            <textarea ref={textareaRef} rows={1} placeholder="Message..." className="w-full bg-transparent border-none outline-none text-[16px] text-[#111111] placeholder:text-[#9CA3AF] resize-none max-h-[120px] py-[8px] pl-4 pr-2 font-normal leading-normal" value={messageInput} onChange={handleInput} style={{ height: '36px', minHeight: '36px' }} />
                            <button onClick={() => handleSendMessage()} disabled={!messageInput.trim()} className={`w-[36px] h-[36px] flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-300 ease-out ${messageInput.trim() ? 'bg-[#F0653A] text-white shadow-md scale-100 active:scale-90' : 'bg-transparent text-[#C7C7CC] opacity-30 scale-95'}`}><ArrowUp size={20} strokeWidth={3} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { ChatScreen as WalkerChatView };

// ==========================================
// 5. APP ENTRY
// ==========================================
export default function App() {
  return (
    <>
      <GlobalStyles />
      <div className="flex items-center justify-center min-h-screen bg-[#111] py-10 font-sans">
        <div className="relative w-[390px] h-[844px] rounded-[55px] shadow-[0_0_0_12px_#000000,0_0_0_14px_#333333] overflow-hidden bg-white">
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] bg-black rounded-[20px] z-[200] pointer-events-none"></div>
            <StatusBar lightMode={false} /> 
            <div className="w-full h-full relative flex flex-col">
                <ChatScreen />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full z-[200] bg-black"></div>
        </div>
      </div>
    </>
  );
}