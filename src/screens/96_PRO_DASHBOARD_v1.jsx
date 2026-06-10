import React, { useState, useEffect, useRef, useMemo } from 'react';
import { area as d3area, line as d3line, curveCatmullRom } from 'd3-shape';
import {
  ChevronRight, ChevronDown, Check, X, Star, BadgeCheck, Banknote, Inbox,
  CalendarDays, User, Footprints, MapPin, MessageCircle, Lock, Repeat, Eye, LifeBuoy, Camera, PawPrint,
} from 'lucide-react';

/**
 * 96_PRO_DASHBOARD_v1.jsx — fylos PRO (the provider's business mode).
 * A separate "account" the user switches into — own tab bar (Today,
 * Requests, Earnings, Profile), online toggle, request inbox with
 * accept/decline, finance dashboard with weekly chart & payouts, and a
 * profile mirror of the onboarding data. Same warm tokens, pro accents.
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
const LINE = '#F1EDE8';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';
const CARD_GRADIENT = 'linear-gradient(145deg,#F0703F 0%,#E85D2A 50%,#CF4A1C 100%)';
const ME = 'https://i.pravatar.cc/150?u=alex_fylos';
const LEO = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200';
const TAO = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200&h=200';
const BUDDY = 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&q=80&w=200&h=200';

const INIT_SCHEDULE = [
  { id: 's1', time: '09:00', svc: '60 min walk', who: 'Leo · Anna M.', photo: LEO, live: true, done: 24, total: 60 },
  { id: 's2', time: '14:00', svc: '30 min walk', who: 'Tao · Julia S.', photo: TAO },
  { id: 's3', time: '17:30', svc: '60 min walk', who: 'Leo · Anna M.', photo: LEO },
];
const INIT_REQUESTS = [
  { id: 'r1', svc: '90 min walk', when: 'Tue 24 · 14:00', who: 'Buddy', meta: 'German Shepherd · 4 yrs · 1.2 km away', owner: 'Marco R.', photo: BUDDY, price: 33, isNew: true },
  { id: 'r2', svc: '60 min walk', when: 'Wed 25 · 09:00', who: 'Tao', meta: 'Domestic Shorthair · 5 yrs · 0.5 km away', owner: 'Julia S.', photo: TAO, price: 22, isNew: true },
  { id: 'r3', svc: '30 min walk · weekly', when: 'Every Fri · 16:00', who: 'Leo', meta: 'Golden Retriever · 3 yrs · 0.8 km away', owner: 'Anna M.', photo: LEO, price: 14 },
];
const WEEK_BARS = [{ d: 'M', v: 180 }, { d: 'T', v: 220 }, { d: 'W', v: 140 }, { d: 'T', v: 260 }, { d: 'F', v: 95 }, { d: 'S', v: 200 }, { d: 'S', v: 145 }];
const MONTH_BARS = [{ d: 'W1', v: 310 }, { d: 'W2', v: 287 }, { d: 'W3', v: 342 }, { d: 'W4', v: 301 }];
const PAYOUTS = [
  { id: 'p1', label: 'Weekly payout', sub: 'Mon, Feb 9 · Stripe', amount: '+ CHF 287.30', ok: true },
  { id: 'p2', label: 'Weekly payout', sub: 'Mon, Feb 2 · Stripe', amount: '+ CHF 312.80', ok: true },
  { id: 'p3', label: 'Weekly payout', sub: 'Mon, Jan 26 · Stripe', amount: '+ CHF 198.05', ok: true },
];
const MY_SERVICES = [{ n: '30 min walk', p: 14 }, { n: '60 min walk', p: 22 }, { n: '90 min walk', p: 33 }];
const TABS = [
  { id: 'today', label: 'Today', icon: CalendarDays },
  { id: 'requests', label: 'Requests', icon: Inbox },
  { id: 'earnings', label: 'Earnings', icon: Banknote },
  { id: 'profile', label: 'Profile', icon: User },
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
    {action && <button onClick={onAction} className="text-[12px] font-bold active:opacity-60" style={{ color: INK }}>{action}</button>}
  </div>
);

const ProDashboard = ({ onExitPro, standalone = false }) => {
  const [tab, setTab] = useState('today');
  const [online, setOnline] = useState(true);
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [schedule, setSchedule] = useState(INIT_SCHEDULE);
  const [acctOpen, setAcctOpen] = useState(false);
  const [toast, setToast] = useState('');
  const act = (m) => { setToast(m); setTimeout(() => setToast(''), 1700); };
  // balance counts up when Earnings opens, settles at the real figure
  const [bal, setBal] = useState(0);
  useEffect(() => {
    if (tab !== 'earnings') return;
    let start = null, raf;
    const tick = (t) => { if (!start) start = t; const p = Math.min(1, (t - start) / 900); setBal(1240.55 * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tab]);
  // today stat counts up when the Today tab opens
  const [todayChf, setTodayChf] = useState(0);
  useEffect(() => {
    if (tab !== 'today') return;
    let start = null, raf;
    const tick = (t) => { if (!start) start = t; const p = Math.min(1, (t - start) / 350); setTodayChf(57 * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [tab]);
  // earnings chart: range toggle, draw-on reveal, scrub-to-inspect
  const [range, setRange] = useState('week');
  const [chartIn, setChartIn] = useState(false);
  const [scrub, setScrub] = useState(null);
  const chartRef = useRef(null);
  useEffect(() => {
    setChartIn(false);
    setScrub(null);
    if (tab !== 'earnings') return;
    let raf1, raf2;
    raf1 = requestAnimationFrame(() => { raf2 = requestAnimationFrame(() => setChartIn(true)); });
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2); };
  }, [tab, range]);

  const accept = (r) => {
    setRequests((prev) => prev.filter((x) => x.id !== r.id));
    setSchedule((prev) => [...prev, { id: r.id, time: r.when.split('· ')[1] || r.when, svc: r.svc, who: `${r.who} · ${r.owner}`, photo: r.photo, accepted: true }]);
    act(`Accepted. ${r.who} is booked in`);
  };
  const decline = (r) => { setRequests((prev) => prev.filter((x) => x.id !== r.id)); act('Request declined'); };

  const bars = range === 'week' ? WEEK_BARS : MONTH_BARS;
  const CW = 294, CH = 108, CPX = 7, CPT = 14, CPB = 8;
  const chart = useMemo(() => {
    const vals = bars.map((b) => b.v);
    const lo = Math.min(...vals) * 0.8, hi = Math.max(...vals) * 1.06;
    const xs = (i) => CPX + (i * (CW - 2 * CPX)) / (vals.length - 1);
    const ys = (v) => CPT + (1 - (v - lo) / (hi - lo)) * (CH - CPT - CPB);
    const data = vals.map((v, i) => [xs(i), ys(v)]);
    return {
      areaD: d3area().x((d) => d[0]).y0(CH).y1((d) => d[1]).curve(curveCatmullRom.alpha(0.6))(data),
      lineD: d3line().x((d) => d[0]).y((d) => d[1]).curve(curveCatmullRom.alpha(0.6))(data),
      pts: data,
    };
  }, [range]);
  const onChartScrub = (e) => {
    const r = chartRef.current?.getBoundingClientRect(); if (!r) return;
    const i = Math.max(0, Math.min(bars.length - 1, Math.round(((e.clientX - r.left) / r.width) * (bars.length - 1))));
    setScrub(i);
  };

  const Header = (
    <div className="flex items-center px-5 pointer-events-auto" style={{ height: 46 }}>
      {/* account switcher chip */}
      <button onClick={() => setAcctOpen(true)} className="flex items-center gap-2 bg-white rounded-full pl-1.5 pr-2.5 py-1.5 active:scale-[0.98] transition-transform" style={{ boxShadow: SHADOW }}>
        <img src={ME} alt="" className="w-7 h-7 rounded-full object-cover" />
        <span className="text-[13px] font-bold" style={{ color: INK }}>Alex</span>
        <span className="text-[8.5px] font-extrabold tracking-[0.08em] px-1.5 py-[2px] rounded-[6px]" style={{ background: INK, color: '#fff' }}>PRO</span>
        <ChevronDown size={13} color={TERT} strokeWidth={2.4} />
      </button>
      <span className="flex-1" />
      {/* online toggle */}
      <button onClick={() => { setOnline(!online); act(online ? 'You’re offline. No new requests' : 'You’re online'); }} className="flex items-center gap-1.5 rounded-full px-3 py-2 active:scale-95 transition-all" style={{ background: online ? '#EAF7EF' : PEACH }}>
        <span className="w-2 h-2 rounded-full" style={{ background: online ? GREEN : '#C9BBAE', animation: online ? 'pdPulse 1.6s ease-in-out infinite' : 'none' }} />
        <span className="text-[12px] font-bold" style={{ color: online ? GREEN : TERT }}>{online ? 'Online' : 'Offline'}</span>
      </button>
    </div>
  );

  const inner = (
    <div className="absolute inset-0" style={{ background: CREAM, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 112, paddingBottom: 110, scrollbarWidth: 'none' }}>

        {/* ── TODAY ── */}
        {tab === 'today' && (
          <>
            {/* day stats */}
            <div className="rounded-[18px] bg-white flex items-center py-3.5" style={{ boxShadow: SHADOW }}>
              {[[`CHF ${Math.round(todayChf)}`, 'today', true], [`${schedule.length}`, 'jobs'], ['4.9', 'rating']].map(([v, l, accent], i) => (
                <div key={i} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid ' + LINE : 'none' }}>
                  <span className="text-[17px] font-extrabold leading-none" style={{ color: accent ? CORAL : INK }}>{v}</span>
                  <span className="text-[10px] font-medium mt-1.5" style={{ color: TERT }}>{l}</span>
                </div>
              ))}
            </div>

            {/* live job */}
            {schedule.find((s) => s.live) && (() => { const s = schedule.find((x) => x.live); return (
              <div className="rounded-[18px] mt-4 p-4" style={{ background: TINT }}>
                <div className="flex items-center gap-3">
                  <img src={s.photo} alt="" className="w-11 h-11 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold" style={{ color: CORAL }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: CORAL, animation: 'pdPulse 1.4s ease-in-out infinite' }} />LIVE NOW</div>
                    <div className="text-[14.5px] font-bold mt-0.5" style={{ color: INK }}>{s.svc} · {s.who.split(' · ')[0]}</div>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color: MUTED }}>{s.done}/{s.total} min</span>
                </div>
                <div className="h-[6px] rounded-full overflow-hidden mt-3" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <div className="h-full rounded-full" style={{ width: `${(s.done / s.total) * 100}%`, background: CORAL }} />
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => act('Photo update sent to Anna')} className="flex-1 h-10 rounded-[12px] bg-white flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ boxShadow: '0 2px 8px rgba(60,30,15,0.08)' }}><Camera size={14} color={CORAL} strokeWidth={2.2} /><span className="text-[12.5px] font-bold" style={{ color: CORAL }}>Send photo</span></button>
                  <button onClick={() => act('Walk ended. Summary sent to Anna')} className="flex-1 h-10 rounded-[12px] flex items-center justify-center active:scale-[0.98]" style={{ background: CORAL }}><span className="text-[12.5px] font-bold text-white">End walk</span></button>
                </div>
              </div>
            ); })()}

            {/* requests teaser */}
            {requests.length > 0 && (
              <button onClick={() => setTab('requests')} className="w-full mt-4 bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
                <span className="relative w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: TINT }}>
                  <Inbox size={16} color={CORAL} strokeWidth={2} />
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center text-[10.5px] font-extrabold text-white" style={{ background: CORAL }}>{requests.length}</span>
                </span>
                <div className="flex-1"><div className="text-[13.5px] font-bold" style={{ color: INK }}>{requests.length} new requests</div><div className="text-[11px] mt-[1px]" style={{ color: TERT }}>Reply fast, it boosts your ranking</div></div>
                <ChevronRight size={15} color="#CFC7BD" strokeWidth={2.2} />
              </button>
            )}

            {/* schedule */}
            <SectionLabel>Today’s schedule</SectionLabel>
            <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              {schedule.map((s, i) => (
                <div key={s.id} className="relative flex items-center gap-3 px-3.5 py-3">
                  <span className="w-[46px] text-center shrink-0"><span className="text-[12.5px] font-extrabold tabular-nums" style={{ color: s.live ? CORAL : INK }}>{s.time}</span></span>
                  <img src={s.photo} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-bold truncate" style={{ color: INK }}>{s.svc}</div>
                    <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{s.who}</div>
                  </div>
                  {s.live ? <span className="text-[10.5px] font-extrabold px-1.5 py-[2px] rounded-full" style={{ background: TINT, color: CORAL }}>LIVE</span> : s.accepted ? <span className="text-[10.5px] font-extrabold px-1.5 py-[2px] rounded-full" style={{ background: '#EAF7EF', color: GREEN }}>NEW</span> : <button onClick={() => act('Directions to pickup')} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: PEACH }}><MapPin size={13} color={MUTED} strokeWidth={2.2} /></button>}
                  {i < schedule.length - 1 && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: LINE }} />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── REQUESTS ── */}
        {tab === 'requests' && (
          <>
            {requests.length ? requests.map((r) => (
              <div key={r.id} className="bg-white rounded-[18px] p-3.5 mb-3" style={{ boxShadow: SHADOW }}>
                <div className="flex items-center gap-3">
                  <img src={r.photo} alt="" className="w-12 h-12 rounded-[12px] object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14.5px] font-bold truncate" style={{ color: INK }}>{r.svc}</span>
                      {r.isNew && <span className="text-[8.5px] font-extrabold px-1.5 py-[2px] rounded-full shrink-0" style={{ background: TINT, color: CORAL }}>NEW</span>}
                    </div>
                    <div className="text-[12px] mt-0.5 font-semibold" style={{ color: CORAL }}>{r.when}</div>
                    <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{r.who} · {r.meta}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[15px] font-extrabold" style={{ color: INK }}>CHF {r.price}</div>
                    <div className="text-[10.5px] font-semibold" style={{ color: GREEN }}>you get {(r.price * 0.85).toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => decline(r)} className="flex-1 h-10 rounded-[12px] bg-white flex items-center justify-center active:scale-[0.98]" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}><span className="text-[13px] font-bold" style={{ color: MUTED }}>Decline</span></button>
                  <button onClick={() => act(`Message ${r.owner.split(' ')[0]}`)} className="w-10 h-10 rounded-[12px] bg-white flex items-center justify-center active:scale-[0.95]" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}><MessageCircle size={15} color={INK} strokeWidth={2} /></button>
                  <button onClick={() => accept(r)} className="flex-1 h-10 rounded-[12px] flex items-center justify-center active:scale-[0.98]" style={{ background: CORAL, boxShadow: '0 4px 12px rgba(232,93,42,0.25)' }}><span className="text-[13px] font-bold text-white">Accept</span></button>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center text-center mt-20 px-8">
                <span className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: PEACH }}><Inbox size={22} color={TERT} strokeWidth={2} /></span>
                <div className="text-[15px] font-bold" style={{ color: INK }}>Inbox zero</div>
                <p className="text-[13px] mt-1" style={{ color: TERT }}>New requests appear here. Stay online to receive more.</p>
              </div>
            )}
          </>
        )}

        {/* ── EARNINGS ── */}
        {tab === 'earnings' && (
          <>
            {/* balance hero — premium card: layered gradient, inner hairline, paw watermark */}
            <div className="relative rounded-[24px] overflow-hidden p-5" style={{ background: CARD_GRADIENT, boxShadow: '0 2px 6px rgba(207,74,28,0.18), 0 18px 40px rgba(232,93,42,0.32)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(130% 90% at 88% -10%, rgba(255,255,255,0.30), transparent 55%)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(200deg, transparent 60%, rgba(120,28,0,0.14) 100%)' }} />
              <PawPrint size={128} color="#fff" strokeWidth={1.2} className="absolute pointer-events-none" style={{ right: -22, bottom: -26, opacity: 0.09, transform: 'rotate(-14deg)' }} />
              <div className="absolute inset-0 rounded-[24px] pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22), inset 0 1px 0 rgba(255,255,255,0.25)' }} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-extrabold uppercase" style={{ color: 'rgba(255,255,255,0.78)', letterSpacing: '0.26em' }}>February earnings</span>
                  <span className="text-[10.5px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', backdropFilter: 'blur(4px)' }}>38 jobs</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-4"><span className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.75)' }}>CHF</span><span className="text-[40px] font-extrabold text-white leading-none tracking-[-0.03em] tabular-nums">{bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="h-px mt-4 mb-2.5" style={{ background: 'rgba(255,255,255,0.18)' }} />
                <div className="flex items-center justify-between">
                  <span className="text-[11.5px] font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Next payout Mon · CHF 310.20</span>
                  <span className="text-[9.5px] font-extrabold uppercase tracking-[0.08em] px-1.5 py-[3px] rounded-[6px]" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff' }}>Stripe</span>
                </div>
              </div>
            </div>

            {/* earnings curve — same chart language as the Wallet, pro grade */}
            <SectionLabel>{range === 'week' ? 'This week' : 'This month'}</SectionLabel>
            <div className="bg-white rounded-[20px] px-4 pt-3 pb-3" style={{ boxShadow: SHADOW }}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: '#A8A29C' }}>{scrub != null ? bars[scrub].d : 'Total'}</span>
                  <div className="text-[18px] font-extrabold leading-tight tabular-nums" style={{ color: INK }}>CHF {scrub != null ? bars[scrub].v : bars.reduce((a, b) => a + b.v, 0).toLocaleString('en-US')}</div>
                </div>
                <div className="flex items-center gap-1">
                  {[['week', 'Week'], ['month', 'Month']].map(([id, label]) => (
                    <button key={id} onClick={() => setRange(id)} className="h-[26px] px-2.5 text-[11px] font-bold rounded-full active:scale-95 transition-transform" style={range === id ? { background: '#FFF3EC', color: CORAL, boxShadow: 'inset 0 0 0 1.5px ' + CORAL } : { background: 'transparent', color: TERT }}>{label}</button>
                  ))}
                </div>
              </div>
              <div ref={chartRef} className="relative select-none" style={{ touchAction: 'none' }}
                onPointerDown={(e) => { e.currentTarget.setPointerCapture?.(e.pointerId); onChartScrub(e); }}
                onPointerMove={(e) => { if (e.buttons || e.pointerType === 'touch') onChartScrub(e); }}
                onPointerUp={() => setScrub(null)} onPointerCancel={() => setScrub(null)}>
                <svg viewBox={'0 0 ' + CW + ' ' + CH} className="w-full block" style={{ height: 108 }}>
                  <defs>
                    <linearGradient id="proFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={CORAL} stopOpacity="0.26" />
                      <stop offset="100%" stopColor={CORAL} stopOpacity="0" />
                    </linearGradient>
                    <clipPath id="proReveal"><rect x="0" y="0" height={CH} width={chartIn ? CW : 0} style={{ transition: 'width 0.7s cubic-bezier(0.22,1,0.36,1)' }} /></clipPath>
                  </defs>
                  {[0.3, 0.55, 0.8].map((p) => (
                    <line key={p} x1={CPX} x2={CW - CPX} y1={CH * p} y2={CH * p} stroke="#F4EFE9" strokeWidth="1" />
                  ))}
                  <g clipPath="url(#proReveal)">
                    <path d={chart.areaD} fill="url(#proFill)" />
                    <path d={chart.lineD} fill="none" stroke={CORAL} strokeWidth="2.5" strokeLinecap="round" />
                  </g>
                  {scrub != null && (
                    <g>
                      <line x1={chart.pts[scrub][0]} x2={chart.pts[scrub][0]} y1={6} y2={CH - 2} stroke="#E0D7CC" strokeWidth="1" />
                      <circle cx={chart.pts[scrub][0]} cy={chart.pts[scrub][1]} r="5" fill={CORAL} stroke="#fff" strokeWidth="2" />
                    </g>
                  )}
                  {scrub == null && chartIn && (
                    <circle cx={chart.pts[chart.pts.length - 1][0]} cy={chart.pts[chart.pts.length - 1][1]} r="4" fill="#fff" stroke={CORAL} strokeWidth="2.5" />
                  )}
                </svg>
                <div className="flex justify-between mt-1 px-0.5">
                  {bars.map((b, i) => (
                    <span key={i} className="text-[10px]" style={{ color: (scrub ?? -1) === i ? INK : '#C4BBB0', fontWeight: (scrub ?? -1) === i ? 800 : 600, transition: 'color 0.2s' }}>{b.d}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* perf stats */}
            <div className="rounded-[18px] bg-white flex items-center py-3.5 mt-3" style={{ boxShadow: SHADOW }}>
              {[['92%', 'repeat clients'], ['~1 h', 'reply time'], ['4.9★', 'rating']].map(([v, l], i) => (
                <div key={i} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid ' + LINE : 'none' }}>
                  <span className="text-[15px] font-extrabold leading-none" style={{ color: INK }}>{v}</span>
                  <span className="text-[10px] font-medium mt-1.5" style={{ color: TERT }}>{l}</span>
                </div>
              ))}
            </div>

            {/* payouts */}
            <SectionLabel action="Statements" onAction={() => act('Statements export')}>Payouts</SectionLabel>
            <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              {PAYOUTS.map((p, i) => (
                <div key={p.id} className="relative flex items-center gap-3 px-3.5 py-3">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#EAF7EF' }}><Banknote size={15} color={GREEN} strokeWidth={2} /></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold" style={{ color: INK }}>{p.label}</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{p.sub}</div>
                  </div>
                  <span className="text-[13.5px] font-extrabold tabular-nums" style={{ color: GREEN }}>{p.amount}</span>
                  {i < PAYOUTS.length - 1 && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: LINE }} />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <>
            <div className="relative bg-white rounded-[24px] overflow-hidden" style={{ boxShadow: '0 2px 4px rgba(60,30,15,0.04), 0 12px 30px rgba(60,30,15,0.09), inset 0 0 0 1px #F3EEE7' }}>
              {/* tint cover band */}
              <div className="relative h-[62px]" style={{ background: 'linear-gradient(120deg, #FBE7DD 0%, #F8DCC9 100%)' }}>
                <PawPrint size={84} color={CORAL} strokeWidth={1.3} className="absolute pointer-events-none" style={{ right: -8, top: -16, opacity: 0.12, transform: 'rotate(16deg)' }} />
                <button onClick={() => act('Opening public profile')} className="absolute top-3 right-3 h-[30px] px-3 rounded-full bg-white/90 flex items-center gap-1.5 active:scale-95 transition-transform" style={{ backdropFilter: 'blur(4px)', boxShadow: '0 2px 8px rgba(60,30,15,0.10)' }}>
                  <Eye size={13} color={INK} strokeWidth={2.2} /><span className="text-[11px] font-bold" style={{ color: INK }}>Preview</span>
                </button>
              </div>
              <div className="px-4 pb-4">
                <div className="flex items-end gap-3" style={{ marginTop: -30 }}>
                  <img src={ME} alt="" className="w-[72px] h-[72px] rounded-full object-cover shrink-0" style={{ border: '3px solid #fff', boxShadow: '0 6px 16px rgba(60,30,15,0.16)' }} />
                  <div className="min-w-0 pb-1">
                    <div className="flex items-center gap-1"><span className="text-[17px] font-extrabold truncate" style={{ color: INK }}>Alex Mueller</span><BadgeCheck size={16} color={CORAL} strokeWidth={2.2} className="shrink-0" /></div>
                    <div className="text-[11.5px]" style={{ color: TERT }}>Dog walker · Zürich · Seefeld</div>
                  </div>
                </div>
                <div className="flex items-center mt-3.5 rounded-[16px] py-2.5" style={{ background: '#FAF7F3' }}>
                  {[
                    [<span key="r" className="inline-flex items-center gap-1"><Star size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} />4.9</span>, '132 reviews'],
                    ['530', 'walks'],
                    ['2023', 'pro since'],
                  ].map(([v, l], i) => (
                    <div key={i} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid #EFE9E1' : 'none' }}>
                      <span className="text-[14px] font-extrabold leading-none" style={{ color: INK }}>{v}</span>
                      <span className="text-[10px] font-medium mt-1" style={{ color: TERT }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <SectionLabel action="Edit" onAction={() => act('Edit availability')}>Availability</SectionLabel>
            <div className="bg-white rounded-[18px] px-4 py-3.5 flex items-center justify-between" style={{ boxShadow: SHADOW }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, i) => {
                const on = i < 5;
                return <span key={i} className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold" style={{ background: on ? TINT : PEACH, color: on ? CORAL : '#C4BBB0' }}>{w}</span>;
              })}
            </div>

            <SectionLabel>Account</SectionLabel>
            <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              <button onClick={() => act('Payout details')} className="relative w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02]">
                <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: TINT }}><Lock size={15} color={CORAL} strokeWidth={2} /></span>
                <div className="flex-1"><div className="text-[14px] font-semibold" style={{ color: INK }}>Payout details</div><div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>CH93 ···· 5295 7 · Stripe</div></div>
                <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: LINE }} />
              </button>
              <button onClick={() => act('Pro support')} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02]">
                <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: PEACH }}><LifeBuoy size={15} color={MUTED} strokeWidth={2} /></span>
                <div className="flex-1"><div className="text-[14px] font-semibold" style={{ color: INK }}>Pro support</div><div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>Priority help, 24/7</div></div>
                <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
              </button>
            </div>

            <button onClick={onExitPro} className="w-full mt-5 py-3.5 rounded-[16px] bg-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}>
              <Repeat size={15} color={INK} strokeWidth={2.2} /><span className="text-[14px] font-bold" style={{ color: INK }}>Switch to personal account</span>
            </button>
          </>
        )}
      </div>

      {/* gradient-fade header (canonical) */}
      <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none" style={{ paddingTop: 56, paddingBottom: 14, background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 64%, rgba(247,245,242,0) 100%)' }}>
        {Header}
      </div>

      {/* pro tab bar */}
      <div className="absolute left-4 right-4 z-50 bg-white rounded-[26px] flex items-center justify-around py-2.5" style={{ bottom: 14, boxShadow: '0 6px 24px rgba(60,30,15,0.12)' }}>
        {TABS.map((t) => {
          const on = tab === t.id;
          const Icon = t.icon;
          const badge = t.id === 'requests' && requests.length > 0;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} className="relative flex flex-col items-center gap-1 px-3 py-1 active:scale-95 transition-transform" style={{ background: on ? PEACH : 'transparent', borderRadius: 16 }}>
              <span className="relative">
                <Icon size={19} color={on ? INK : '#A8A29C'} strokeWidth={2} />
                {badge && <span className="absolute -top-1.5 -right-2 min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center text-[8.5px] font-extrabold text-white" style={{ background: CORAL }}>{requests.length}</span>}
              </span>
              <span className="text-[10.5px] font-bold" style={{ color: on ? INK : '#A8A29C' }}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* account switcher sheet */}
      {acctOpen && (
        <>
          <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'pdFade 0.2s ease both' }} onClick={() => setAcctOpen(false)} />
          <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] px-5 pb-9" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'pdSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
            <div className="flex items-center gap-3 pt-1 pb-3">
              <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Accounts</h2>
              <button onClick={() => setAcctOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
            </div>
            <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              <button onClick={() => { setAcctOpen(false); onExitPro && onExitPro(); }} className="relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.02]">
                <img src={ME} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1"><div className="text-[14.5px] font-bold" style={{ color: INK }}>Personal</div><div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>Pets, bookings & care</div></div>
                <span className="w-[20px] h-[20px] rounded-full" style={{ border: '1.6px solid #DDD4C9' }} />
                <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: LINE }} />
              </button>
              <button onClick={() => setAcctOpen(false)} className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.02]">
                <span className="relative"><img src={ME} alt="" className="w-10 h-10 rounded-full object-cover" /><span className="absolute -bottom-0.5 -right-0.5 text-[6.5px] font-extrabold tracking-[0.04em] px-1 py-[1.5px] rounded-[4px]" style={{ background: INK, color: '#fff' }}>PRO</span></span>
                <div className="flex-1"><div className="text-[14.5px] font-bold" style={{ color: INK }}>Pro</div><div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>Walking business</div></div>
                <span className="w-[20px] h-[20px] rounded-full flex items-center justify-center" style={{ background: CORAL }}><Check size={12} color="#fff" strokeWidth={3.2} /></span>
              </button>
            </div>
          </div>
        </>
      )}

      {toast && <div className="absolute left-1/2 z-[200] px-4 py-2.5 rounded-full" style={{ bottom: 96, transform: 'translateX(-50%)', background: INK, animation: 'pdToast 0.2s ease both' }}><span className="text-[13px] font-semibold text-white whitespace-nowrap">{toast}</span></div>}
    </div>
  );

  const styleBlock = <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    @keyframes pdPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.25); opacity: 0.7; } }
    @keyframes pdToast { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes pdFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pdSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes pdChipPop { from { opacity: 0; transform: translate(-50%, 4px) scale(0.8); } to { opacity: 1; transform: translate(-50%, 0) scale(1); } }
  `}</style>;

  if (!standalone) return (<>{styleBlock}{inner}</>);
  return (
    <>{styleBlock}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          <StatusBar />
          {inner}
        </div>
      </div>
    </>
  );
};

export default ProDashboard;
