import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Send, Phone, Image } from 'lucide-react';

/**
 * 95_CHAT_v1.jsx — provider chat, built fresh in the fylos aesthetic.
 * Renders as a full overlay (absolute inset-0) above the Services tab.
 * Working composer: send appends, the provider auto-replies once.
 */

const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#9B9B9F';
const LINE = '#F1EDE8';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';

const STARTER = (name) => ([
  { me: false, text: `Hi! Looking forward to seeing Leo again 🐾`.replace(' 🐾', ''), time: '09:12' },
  { me: true, text: 'Great! Quick note, he’s a bit jumpy around scooters lately.', time: '09:14' },
  { me: false, text: 'Good to know, I’ll keep him on the short leash near the road.', time: '09:15' },
]);

const REPLIES = ['Got it, see you then!', 'Perfect, noted.', 'Sounds good. I’ll send a photo update as always.', 'No problem at all.'];

const ChatOverlay = ({ provider, onClose, embedded = false }) => {
  const [msgs, setMsgs] = useState(() => STARTER(provider.name));
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const replyIx = useRef(0);

  useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [msgs, typing]);

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    setMsgs((m) => [...m, { me: true, text: t, time: 'Now' }]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { me: false, text: REPLIES[replyIx.current++ % REPLIES.length], time: 'Now' }]);
      setTyping(false);
    }, 1100);
  };

  return (
    <div className="absolute inset-0 z-[180] flex flex-col" style={{ background: CREAM, animation: 'chIn 0.26s cubic-bezier(0.22,1,0.36,1) both', fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`@keyframes chIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes chMsg { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes chDot { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-3px); } }`}</style>

      {/* Header */}
      <div className="shrink-0 px-4 pb-3 flex items-center gap-3" style={{ paddingTop: 58, background: 'rgba(247,245,242,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid ' + LINE }}>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 shrink-0" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
        <img src={provider.photo} alt={provider.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-bold truncate" style={{ color: INK }}>{provider.name}</div>
          <div className="text-[11px] font-medium" style={{ color: TERT }}>Usually replies in ~1 h</div>
        </div>
        <button onClick={() => {}} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 shrink-0" style={{ background: '#EAF7EF' }}><Phone size={15} color="#3F8D63" strokeWidth={2.2} /></button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4" style={{ scrollbarWidth: 'none', paddingTop: 16, paddingBottom: 12 }}>
        <div className="flex justify-center mb-4"><span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full" style={{ background: PEACH, color: TERT }}>Today</span></div>
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.me ? 'justify-end' : 'justify-start'} mb-2`} style={{ animation: 'chMsg 0.22s ease both' }}>
            <div className="max-w-[76%]">
              <div className="px-3.5 py-2.5" style={{ background: m.me ? CORAL : '#FFFFFF', color: m.me ? '#fff' : INK, borderRadius: m.me ? '16px 16px 4px 16px' : '16px 16px 16px 4px', boxShadow: m.me ? '0 4px 12px rgba(232,93,42,0.22)' : SHADOW }}>
                <span className="text-[13.5px] leading-[1.45] font-medium">{m.text}</span>
              </div>
              <div className={`text-[10.5px] font-medium mt-1 ${m.me ? 'text-right mr-1' : 'ml-1'}`} style={{ color: '#C4BBB0' }}>{m.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start mb-2">
            <div className="px-3.5 py-3 bg-white flex gap-1" style={{ borderRadius: '16px 16px 16px 4px', boxShadow: SHADOW }}>
              {[0, 1, 2].map((d) => <span key={d} className="w-1.5 h-1.5 rounded-full" style={{ background: '#C9BBAE', animation: `chDot 1.1s ${d * 0.15}s infinite` }} />)}
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="shrink-0 px-4 pt-2" style={{ paddingBottom: embedded ? 96 : 24, background: `linear-gradient(to top, ${CREAM} 80%, rgba(247,245,242,0))` }}>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 active:scale-95" style={{ background: PEACH }}><Image size={17} color={MUTED} strokeWidth={2} /></button>
          <div className="flex-1 flex items-center bg-white rounded-full pl-4 pr-1.5 h-[44px]" style={{ boxShadow: SHADOW }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Message…"
              className="flex-1 bg-transparent outline-none text-[14px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" />
            <button onClick={send} className="w-[34px] h-[34px] rounded-full flex items-center justify-center active:scale-90 transition-all" style={{ background: draft.trim() ? CORAL : '#EAE3DB' }}>
              <Send size={15} color={draft.trim() ? '#fff' : TERT} strokeWidth={2.2} style={{ marginLeft: -1, marginTop: 1 }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlay;
