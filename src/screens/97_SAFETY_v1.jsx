import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, ShieldCheck, ShieldAlert, AlertTriangle, MapPin,
  Navigation, ThumbsUp, X, Plus, Skull, Wine, Dog, Snowflake, Construction, HelpCircle, History, Phone,
} from 'lucide-react';

/**
 * 97_SAFETY_v1.jsx — Safety, redesigned as one calm scroll.
 * Status hero answers the only question that matters (is my area safe right
 * now), a compact map card expands on tap, nearby alerts list closest
 * first, one coral CTA to report. No tabs, no modes. Detail and report
 * live in bottom sheets.
 */

const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const TINT = '#FBE7DD';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#9B9B9F';
const GREEN = '#3F8D63';
const AMBER = '#B07A3A';
const DANGER = '#E5484D';
const LINE = '#F1EDE8';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';

const CATS = {
  poison: { label: 'Poison bait', icon: Skull },
  glass: { label: 'Broken glass', icon: Wine },
  aggressive: { label: 'Aggressive dog', icon: Dog },
  icy: { label: 'Icy path', icon: Snowflake },
  construction: { label: 'Construction', icon: Construction },
  other: { label: 'Something else', icon: HelpCircle },
};
const SEVS = ['Heads up', 'Caution', 'Critical'];
const sevTone = (s) => s === 'Critical' ? { bg: '#FEE8E7', c: DANGER } : s === 'Caution' ? { bg: '#FBF1E2', c: AMBER } : { bg: PEACH, c: MUTED };

const INIT_ALERTS = [
  { id: 'a1', cat: 'poison', sev: 'Critical', title: 'Poison bait sighting', where: 'Seefeld Park', dist: '320 m', when: '5 min ago', confirmed: 3, note: 'Found near the entrance, looks like rat poison in a small blue container. Stay alert with your dog.', x: 52, y: 38 },
  { id: 'a2', cat: 'aggressive', sev: 'Caution', title: 'Off-leash aggressive dog', where: 'Kreuzstrasse', dist: '540 m', when: '22 min ago', confirmed: 2, note: 'Large dog off leash, owner not in sight. Growled at my terrier.', x: 34, y: 58 },
  { id: 'a3', cat: 'glass', sev: 'Caution', title: 'Broken glass on path', where: 'Limmat riverside', dist: '1.1 km', when: '1 h ago', confirmed: 5, note: 'Shattered bottle across the gravel path. Paws beware.', x: 68, y: 64 },
  { id: 'a4', cat: 'icy', sev: 'Heads up', title: 'Icy stretch by the lake', where: 'Zürichhorn', dist: '1.4 km', when: '3 h ago', confirmed: 1, note: 'Shaded section still frozen in the mornings.', x: 76, y: 26 },
];

const StatusBar = () => (
  <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
    <span style={{ fontSize: 15, fontWeight: 600, color: INK }}>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={INK}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={INK}/><rect x="9" y="2" width="3" height="10" rx="1" fill={INK}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={INK}/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={INK}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={INK} strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="9" rx="2" fill={INK}/><path d="M23 4.5v4a2 2 0 000-4z" fill={INK} fillOpacity="0.5"/></svg>
    </div>
  </div>
);

const SectionLabel = ({ children, action, onAction, mt = 'mt-6' }) => (
  <div className={`flex items-center justify-between mb-2 ml-1.5 mr-0.5 ${mt}`}>
    <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A8A29C' }}>{children}</span>
    {action && <button onClick={onAction} className="text-[12px] font-bold active:opacity-60" style={{ color: CORAL }}>{action}</button>}
  </div>
);

/* Stylised neighbourhood map. compact=card crop, full=tappable pins */
const SafetyMap = ({ alerts, compact, onPin, selected }) => (
  <svg viewBox="0 0 350 240" className="w-full block" style={{ background: '#EFEAE2', height: compact ? 150 : '100%' }} preserveAspectRatio="xMidYMid slice">
    <path d="M 220 18 C 300 10 348 60 346 120 C 344 185 305 215 255 224 C 205 233 178 205 176 158 C 174 100 145 28 220 18 Z" fill="#E5EEDF" />
    <ellipse cx="290" cy="170" rx="42" ry="26" fill="#DCE8F0" />
    <path d="M 0 95 C 70 85 120 115 180 95" stroke="#FFFFFF" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M 55 240 C 75 175 55 130 105 100" stroke="#FFFFFF" strokeWidth="10" fill="none" strokeLinecap="round" />
    <path d="M 230 240 C 240 205 268 196 310 200" stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round" />
    {/* you */}
    <circle cx="160" cy="120" r="26" fill={CORAL} opacity="0.08" />
    <circle cx="160" cy="120" r="6" fill="#4A90D9" stroke="#fff" strokeWidth="2.5" />
    {/* pins */}
    {alerts.map((a) => {
      const Icon = CATS[a.cat].icon;
      const crit = a.sev === 'Critical';
      const on = selected === a.id;
      return (
        <g key={a.id} transform={`translate(${a.x * 3.5} ${a.y * 2.4})`} onClick={() => onPin && onPin(a)} style={{ cursor: onPin ? 'pointer' : 'default' }}>
          {crit && <circle r="16" fill={DANGER} opacity="0.18"><animate attributeName="r" values="12;20;12" dur="2.4s" repeatCount="indefinite" /><animate attributeName="opacity" values="0.22;0.05;0.22" dur="2.4s" repeatCount="indefinite" /></circle>}
          <circle r={on ? 13 : 11} fill={crit ? DANGER : CORAL} stroke="#fff" strokeWidth="3" />
        </g>
      );
    })}
  </svg>
);

const Sheet = ({ onClose, children }) => (
  <>
    <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'sfFade 0.2s ease both' }} onClick={onClose} />
    <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] flex flex-col" style={{ background: CREAM, maxHeight: '86%', boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'sfSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
      <div className="flex justify-center pt-2.5 pb-1 shrink-0"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
      {children}
    </div>
  </>
);

const SafetyScreen = () => {
  const [alerts, setAlerts] = useState(INIT_ALERTS);
  const [confirmedByMe, setConfirmedByMe] = useState([]);
  const [detail, setDetail] = useState(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [myReports, setMyReports] = useState([{ id: 'm1', title: 'Glass shards in sandbox', where: 'Hottingen playground', when: '3 h ago', confirmed: 2 }]);
  const [repCat, setRepCat] = useState(null);
  const [repSev, setRepSev] = useState('Caution');
  const [repNote, setRepNote] = useState('');
  const [toast, setToast] = useState('');
  const act = (m) => { setToast(m); setTimeout(() => setToast(''), 1700); };
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  const critical = alerts.filter((a) => a.sev === 'Critical').length;
  const clear = alerts.length === 0;
  const heroColor = clear ? GREEN : critical ? DANGER : CORAL;

  const confirm = (a) => {
    if (confirmedByMe.includes(a.id)) return;
    setConfirmedByMe((p) => [...p, a.id]);
    setAlerts((prev) => prev.map((x) => x.id === a.id ? { ...x, confirmed: x.confirmed + 1 } : x));
    act('Thanks. Your confirmation helps neighbours');
  };

  const submitReport = () => {
    if (!repCat) return;
    const c = CATS[repCat];
    setAlerts((prev) => [{ id: 'a' + Date.now(), cat: repCat, sev: repSev, title: c.label, where: 'Near you', dist: '0 m', when: 'Just now', confirmed: 0, note: repNote.trim() || 'Reported by you.', x: 46, y: 50, mine: true }, ...prev]);
    setMyReports((p) => [{ id: 'm' + Date.now(), title: c.label, where: 'Near you', when: 'Just now', confirmed: 0 }, ...p]);
    setReportOpen(false); setRepCat(null); setRepSev('Caution'); setRepNote('');
    act('Report shared. Neighbours nearby are notified');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes sfFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sfSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes sfRing { 0% { transform: scale(0.6); opacity: 0.5; } 100% { transform: scale(1.9); opacity: 0; } }
        @keyframes sfToast { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
      `}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          <StatusBar />

          {/* FULL MAP */}
          {mapOpen ? (
            <div className="absolute inset-0" style={{ background: '#EFEAE2' }}>
              <div className="absolute inset-0"><SafetyMap alerts={alerts} onPin={(a) => setDetail(a)} selected={detail?.id} /></div>
              <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none" style={{ paddingTop: 54, paddingBottom: 14, background: 'linear-gradient(to bottom, #F7F5F2 0%, rgba(247,245,242,0.7) 55%, rgba(247,245,242,0) 100%)' }}>
                <div className="relative flex items-center justify-between px-5 pointer-events-auto" style={{ height: 44 }}>
                  <button onClick={() => setMapOpen(false)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
                  <span className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold" style={{ color: INK }}>Around you</span>
                  <span className="w-9" />
                </div>
              </div>
              <div className="absolute left-5 right-5 z-30" style={{ bottom: 30 }}>
                <div className="bg-white rounded-[16px] px-4 py-3 flex items-center gap-2.5" style={{ boxShadow: '0 8px 24px rgba(60,30,15,0.14)' }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: heroColor }} />
                  <span className="flex-1 text-[13px] font-semibold" style={{ color: INK }}>{alerts.length} alerts within 1 km</span>
                  <span className="text-[11.5px]" style={{ color: TERT }}>Tap a pin</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 overflow-y-auto" style={{ background: CREAM, scrollbarWidth: 'none' }}>
              {/* header */}
              <div className="pt-14 pb-4 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 56%, rgba(247,245,242,0) 100%)' }}>
                <button onClick={back} className="absolute left-5 top-[52px] w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 pointer-events-auto" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
                <h1 className="text-[17px] font-bold" style={{ color: INK }}>Safety</h1>
                <button onClick={() => setActivityOpen(true)} className="absolute right-5 top-[52px] w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 pointer-events-auto" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><History size={16} color={INK} strokeWidth={2} /></button>
              </div>

              <div className="px-4 pb-12">
                {/* STATUS HERO */}
                <div className="flex flex-col items-center text-center pt-3 pb-1">
                  <div className="relative" style={{ width: 92, height: 92 }}>
                    <span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${heroColor}`, opacity: 0.4, animation: 'sfRing 2.6s ease-out infinite' }} />
                    <span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${heroColor}`, opacity: 0.4, animation: 'sfRing 2.6s 1.3s ease-out infinite' }} />
                    <span className="absolute inset-0 rounded-full flex items-center justify-center" style={{ background: clear ? '#EAF7EF' : TINT }}>
                      {clear ? <ShieldCheck size={38} color={GREEN} strokeWidth={1.8} /> : <ShieldAlert size={38} color={heroColor} strokeWidth={1.8} />}
                    </span>
                  </div>
                  <h2 className="text-[22px] font-extrabold tracking-[-0.02em] mt-4" style={{ color: INK }}>
                    {clear ? 'Seefeld looks calm' : `${alerts.length} alert${alerts.length > 1 ? 's' : ''} near you`}
                  </h2>
                  <p className="text-[12.5px] mt-1" style={{ color: TERT }}>
                    {clear ? 'No reports within 1 km right now.' : critical ? `${critical} critical · within 1 km of you` : 'Within 1 km of you · stay aware on walks'}
                  </p>
                </div>

                {/* MAP CARD */}
                <button onClick={() => setMapOpen(true)} className="w-full rounded-[20px] overflow-hidden mt-4 text-left active:scale-[0.99] transition-transform relative" style={{ boxShadow: SHADOW }}>
                  <SafetyMap alerts={alerts} compact />
                  <span className="absolute bottom-2.5 right-2.5 bg-white rounded-full px-3 py-1.5 text-[11.5px] font-bold inline-flex items-center gap-1" style={{ color: INK, boxShadow: '0 2px 8px rgba(60,30,15,0.12)' }}>Open map <ChevronRight size={12} strokeWidth={2.6} /></span>
                </button>

                {/* NEARBY */}
                <SectionLabel>Nearby · closest first</SectionLabel>
                <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                  {alerts.map((a, i) => {
                    const Icon = CATS[a.cat].icon;
                    const tone = sevTone(a.sev);
                    return (
                      <div key={a.id} className="relative">
                        <button onClick={() => setDetail(a)} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02] transition-colors">
                          <span className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: tone.bg }}><Icon size={16} color={tone.c} strokeWidth={2} /></span>
                          <span className="flex-1 min-w-0">
                            <span className="block text-[14px] font-semibold truncate" style={{ color: INK }}>{a.title}</span>
                            <span className="block text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{a.dist} · {a.where} · {a.when}</span>
                          </span>
                          <span className="text-[10.5px] font-bold px-2 py-[3px] rounded-full shrink-0" style={{ background: tone.bg, color: tone.c }}>{a.sev}</span>
                        </button>
                        {i < alerts.length - 1 && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: LINE }} />}
                      </div>
                    );
                  })}
                  {alerts.length === 0 && <div className="px-4 py-6 text-center text-[13px]" style={{ color: TERT }}>All quiet. New reports from neighbours show here.</div>}
                </div>

                {/* REPORT CTA */}
                <button onClick={() => setReportOpen(true)} className="w-full mt-5 py-4 rounded-[18px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.28)' }}>
                  <AlertTriangle size={16} color="#fff" strokeWidth={2.2} />
                  <span className="text-[15px] font-bold text-white">Report a danger</span>
                </button>
                <p className="text-[11px] text-center mt-2.5" style={{ color: TERT }}>Takes 10 seconds. Every dog owner within 1 km is notified.</p>

                {/* emergency cross-link */}
                <div className="bg-white rounded-[18px] overflow-hidden mt-5" style={{ boxShadow: SHADOW }}>
                  <button onClick={() => { window.location.href = '/emergency'; }} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02]">
                    <span className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: '#FEE8E7' }}><Phone size={15} color={DANGER} strokeWidth={2} /></span>
                    <span className="flex-1"><span className="block text-[14px] font-semibold" style={{ color: INK }}>Vet hotline & first aid</span><span className="block text-[11.5px] mt-0.5" style={{ color: TERT }}>If something already happened</span></span>
                    <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DETAIL SHEET */}
          {detail && (() => { const a = alerts.find((x) => x.id === detail.id) || detail; const Icon = CATS[a.cat].icon; const tone = sevTone(a.sev); const mine = confirmedByMe.includes(a.id); return (
            <Sheet onClose={() => setDetail(null)}>
              <div className="px-5 pt-1 pb-2 flex items-start gap-3 shrink-0">
                <span className="w-11 h-11 rounded-[13px] flex items-center justify-center shrink-0" style={{ background: tone.bg }}><Icon size={19} color={tone.c} strokeWidth={2} /></span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[17px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>{a.title}</span>
                  <span className="block text-[12px] mt-0.5" style={{ color: TERT }}>{a.where} · {a.dist} from you · {a.when}</span>
                </span>
                <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95 shrink-0" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
              </div>
              <div className="px-5 pb-8 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                <span className="inline-block text-[10.5px] font-bold px-2 py-[3px] rounded-full" style={{ background: tone.bg, color: tone.c }}>{a.sev}</span>
                <p className="text-[13.5px] leading-[1.55] mt-3" style={{ color: MUTED }}>{a.note}</p>
                <div className="flex items-center gap-1.5 mt-3"><ThumbsUp size={13} color={GREEN} strokeWidth={2.2} /><span className="text-[12px] font-semibold" style={{ color: GREEN }}>{a.confirmed} neighbour{a.confirmed === 1 ? '' : 's'} confirmed this</span></div>
                <div className="flex gap-2 mt-5">
                  <button onClick={() => confirm(a)} disabled={mine} className="flex-1 h-11 rounded-[13px] flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all" style={{ background: mine ? '#EAF7EF' : '#fff', boxShadow: mine ? 'none' : 'inset 0 0 0 1.4px #E5DED5' }}>
                    <ThumbsUp size={14} color={mine ? GREEN : INK} strokeWidth={2.2} /><span className="text-[13.5px] font-bold" style={{ color: mine ? GREEN : INK }}>{mine ? 'Confirmed' : 'Still there'}</span>
                  </button>
                  <button onClick={() => act('Opening directions')} className="flex-1 h-11 rounded-[13px] flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ background: CORAL, boxShadow: '0 4px 14px rgba(232,93,42,0.25)' }}>
                    <Navigation size={14} color="#fff" strokeWidth={2.2} /><span className="text-[13.5px] font-bold text-white">Avoid route</span>
                  </button>
                </div>
              </div>
            </Sheet>
          ); })()}

          {/* REPORT SHEET */}
          {reportOpen && (
            <Sheet onClose={() => setReportOpen(false)}>
              <div className="px-5 pt-1 pb-3 flex items-center gap-3 shrink-0">
                <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Report a danger</h2>
                <button onClick={() => setReportOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
              </div>
              <div className="px-5 pb-8 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(CATS).map(([id, c]) => {
                    const on = repCat === id;
                    return (
                      <button key={id} onClick={() => setRepCat(id)} className="flex flex-col items-center gap-1.5 py-3 rounded-[14px] transition-all active:scale-[0.96]" style={{ background: on ? '#FFF3EC' : '#fff', boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>
                        <c.icon size={19} color={on ? CORAL : MUTED} strokeWidth={1.9} />
                        <span className="text-[10.5px] font-bold leading-tight text-center px-1" style={{ color: on ? CORAL : INK }}>{c.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-[0.1em] mt-5 mb-2" style={{ color: TERT }}>How serious</div>
                <div className="flex gap-2">{SEVS.map((s) => { const on = repSev === s; return <button key={s} onClick={() => setRepSev(s)} className="flex-1 h-[40px] rounded-[12px] text-[12.5px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>{s}</button>; })}</div>
                <div className="flex items-center gap-2.5 bg-white rounded-[13px] px-4 h-[48px] mt-4" style={{ boxShadow: SHADOW }}>
                  <MapPin size={15} color={CORAL} strokeWidth={2} />
                  <span className="flex-1 text-[13.5px] font-semibold" style={{ color: INK }}>Your current location</span>
                  <span className="text-[11.5px]" style={{ color: TERT }}>Seefeld</span>
                </div>
                <textarea value={repNote} onChange={(e) => setRepNote(e.target.value)} rows={3} placeholder="What should neighbours watch out for?" className="w-full mt-3 bg-white rounded-[13px] px-4 py-3 outline-none text-[14px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal resize-none" style={{ boxShadow: SHADOW }} />
                <button onClick={submitReport} disabled={!repCat} className="w-full mt-5 py-4 rounded-[16px] transition-all active:scale-[0.98]" style={{ background: repCat ? CORAL : '#EAE3DB', boxShadow: repCat ? '0 8px 22px rgba(232,93,42,0.28)' : 'none' }}>
                  <span className="text-[15px] font-bold" style={{ color: repCat ? '#fff' : TERT }}>Share with neighbours</span>
                </button>
                <p className="text-[10.5px] text-center mt-2.5" style={{ color: TERT }}>Anonymous to neighbours. Visible to fylos for review.</p>
              </div>
            </Sheet>
          )}

          {/* MY ACTIVITY SHEET */}
          {activityOpen && (
            <Sheet onClose={() => setActivityOpen(false)}>
              <div className="px-5 pt-1 pb-3 flex items-center gap-3 shrink-0">
                <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>My reports</h2>
                <button onClick={() => setActivityOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
              </div>
              <div className="px-5 pb-8 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
                <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                  {myReports.map((r, i) => (
                    <div key={r.id} className="relative flex items-center gap-3 px-4 py-3">
                      <span className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: TINT }}><AlertTriangle size={15} color={CORAL} strokeWidth={2} /></span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13.5px] font-semibold truncate" style={{ color: INK }}>{r.title}</span>
                        <span className="block text-[11.5px] mt-0.5" style={{ color: TERT }}>{r.where} · {r.when}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold shrink-0" style={{ color: GREEN }}><ThumbsUp size={11} strokeWidth={2.4} /> {r.confirmed}</span>
                      {i < myReports.length - 1 && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: LINE }} />}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-center mt-4" style={{ color: TERT }}>Reports auto-resolve after 24 h unless neighbours confirm them.</p>
              </div>
            </Sheet>
          )}

          {toast && <div className="absolute left-1/2 z-[200] px-4 py-2.5 rounded-full" style={{ bottom: 38, transform: 'translateX(-50%)', background: INK, animation: 'sfToast 0.2s ease both' }}><span className="text-[13px] font-semibold text-white whitespace-nowrap">{toast}</span></div>}
        </div>
      </div>
    </>
  );
};

export default SafetyScreen;
