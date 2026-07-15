import React, { useState, useEffect, useRef, useMemo } from 'react';
import { area as d3area, line as d3line, curveCatmullRom } from 'd3-shape';
import {
  ChevronRight, ChevronDown, ChevronLeft, Check, X, Star, BadgeCheck, Banknote, Inbox,
  CalendarDays, User, Footprints, MapPin, MessageCircle, Lock, Repeat, Eye, LifeBuoy, Camera, ShieldCheck,
  Pause, Play, Navigation2, PawPrint, Send,
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
  { id: 'r1', svc: '90 min walk', when: 'Tue 24 · 14:00', who: 'Buddy', meta: 'German Shepherd · 4 yrs · 1.2 km away', owner: 'Marco R.', photo: BUDDY, price: 33, isNew: true, expires: '6 h' },
  { id: 'r2', svc: '60 min walk', when: 'Wed 25 · 09:00', who: 'Tao', meta: 'Domestic Shorthair · 5 yrs · 0.5 km away', owner: 'Julia S.', photo: TAO, price: 22, isNew: true, expires: '12 h' },
  { id: 'r3', svc: '30 min walk · weekly', when: 'Every Fri · 16:00', who: 'Leo', meta: 'Golden Retriever · 3 yrs · 0.8 km away', owner: 'Anna M.', photo: LEO, price: 14, expires: '2 d' },
];
// The request that arrives moments after the pro goes live — the first-request moment.
const INCOMING_REQUEST = { id: 'r4', svc: '30 min walk', when: 'Thu 26 · 10:00', who: 'Milo', meta: 'Beagle · 2 yrs · 0.9 km away', owner: 'Nora K.', photo: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=200&h=200', price: 14, isNew: true, expires: '12 h' };
const DECLINE_REASONS = ['Too busy that day', 'Too far away', 'Not a good fit', 'Other'];
// Mirrored in the personal app: badge on the "Switch to Pro account" row.
export const PRO_NEW_REQUESTS = INIT_REQUESTS.filter((r) => r.isNew).length;
// Week sums to 310 (the pending Monday payout of CHF 310.20); the month
// sums to 1240 (the CHF 1,240.55 February balance) so the three money
// surfaces tell one consistent story.
const WEEK_BARS = [{ d: 'M', v: 48 }, { d: 'T', v: 59 }, { d: 'W', v: 26 }, { d: 'T', v: 71 }, { d: 'F', v: 12 }, { d: 'S', v: 55 }, { d: 'S', v: 39 }];
const MONTH_BARS = [{ d: 'W1', v: 313 }, { d: 'W2', v: 287 }, { d: 'W3', v: 330 }, { d: 'W4', v: 310 }];
// gross × 0.85 = net exactly, so the payout sheet's math always adds up.
const PAYOUTS = [
  { id: 'p1', label: 'Weekly payout', sub: 'Mon, Feb 9 · Stripe', amount: '+ CHF 287.30', ok: true, jobs: 14, gross: 338.0, net: 287.3 },
  { id: 'p2', label: 'Weekly payout', sub: 'Mon, Feb 2 · Stripe', amount: '+ CHF 312.80', ok: true, jobs: 16, gross: 368.0, net: 312.8 },
  { id: 'p3', label: 'Weekly payout', sub: 'Mon, Jan 26 · Stripe', amount: '+ CHF 198.05', ok: true, jobs: 9, gross: 233.0, net: 198.05 },
];
const INIT_REVIEWS = [
  { id: 'v1', owner: 'Anna M.', pet: 'Leo', date: '2 days ago', stars: 5, text: 'Leo pulls on the leash with everyone except Alex. Photos every single walk, on time, every time.', photo: LEO },
  { id: 'v2', owner: 'Julia S.', pet: 'Tao', date: '1 week ago', stars: 5, text: 'Tao is a cat who thinks he is a dog. Alex gets it. The photo updates are the best part of my workday.', photo: TAO, reply: 'Thank you Julia! Tao leads the way, I just hold the leash.' },
  { id: 'v3', owner: 'Marco R.', pet: 'Buddy', date: '2 weeks ago', stars: 4, text: 'Reliable and kind. Buddy comes home tired and happy. Would love slightly earlier slots.', photo: BUDDY },
  { id: 'v4', owner: 'Sophie K.', pet: 'Nala', date: '3 weeks ago', stars: 5, text: 'Nala waits by the door at 9 sharp. She knows. Best walker in Seefeld.' },
  { id: 'v5', owner: 'David H.', pet: 'Rex', date: 'Jan 28', stars: 5, text: 'Sent a photo from the lake with a very muddy, very happy dog. Then cleaned his paws before dropping him off.' },
  { id: 'v6', owner: 'Elena P.', pet: 'Mia', date: 'Jan 19', stars: 3, text: 'Good walk but arrived 10 minutes late without a heads up.', reply: 'You’re right Elena, that was on me. It won’t happen again.' },
];
const REVIEW_DIST = [[5, 104], [4, 21], [3, 5], [2, 1], [1, 1]];
const STATEMENTS = [
  { id: 'st1', label: 'January 2026', sub: 'PDF · 12 KB', ready: true },
  { id: 'st2', label: 'February 2026', sub: 'Ready Mar 1', ready: false },
  { id: 'st3', label: '2026 yearly statement', sub: 'Ready in January 2027, in time for taxes', ready: false },
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

// End-of-walk report: summary, the pet's mood, a note, then the summary
// goes to the owner. This is the closing moment of every job.
const WalkReport = ({ job, petName, owner, minutes, km, photos, onSend }) => {
  const [mood, setMood] = useState('Happy');
  const [notes, setNotes] = useState('');
  return (
    <>
      <SectionLabel>Walk summary</SectionLabel>
      <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
        <div className="flex items-center px-4 py-3.5">
          {[[`${minutes} min`, 'duration'], [`${km} km`, 'distance'], [`${photos}`, photos === 1 ? 'photo' : 'photos']].map(([v, l], i) => (
            <div key={l} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid ' + LINE : 'none' }}>
              <span className="text-[16px] font-extrabold leading-none tabular-nums" style={{ color: INK }}>{v}</span>
              <span className="text-[10px] font-medium mt-1.5" style={{ color: TERT }}>{l}</span>
            </div>
          ))}
        </div>
        {photos > 0 && (
          <div className="flex gap-2 px-4 pb-4">
            {Array.from({ length: Math.min(photos, 4) }, (_, i) => (
              <img key={i} src={job.photo} alt="" className="w-[62px] h-[62px] rounded-[12px] object-cover" style={{ filter: `saturate(${1 - i * 0.12}) brightness(${1 + i * 0.04})` }} />
            ))}
          </div>
        )}
      </div>

      <SectionLabel>{`How was ${petName} today?`}</SectionLabel>
      <div className="flex gap-2">
        {['Happy', 'Calm', 'Full of energy'].map((m) => {
          const on = mood === m;
          return <button key={m} onClick={() => setMood(m)} className="flex-1 h-[42px] rounded-[12px] text-[12.5px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>{m}</button>;
        })}
      </div>

      <SectionLabel>Note for {owner}</SectionLabel>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder={`How did it go? ${owner} reads this right away.`}
        className="w-full bg-white rounded-[16px] px-4 py-3 outline-none text-[13.5px] font-medium resize-none" style={{ boxShadow: SHADOW, color: INK }} />

      <button onClick={onSend} className="w-full mt-4 py-4 rounded-[18px] flex items-center justify-center gap-2 active:scale-[0.98]" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.28)' }}>
        <Send size={15} color="#fff" strokeWidth={2.2} /><span className="text-[15px] font-bold text-white">Send summary to {owner}</span>
      </button>
      <p className="text-center text-[10.5px] mt-2.5" style={{ color: TERT }}>{petName} was {mood.toLowerCase()} today. The mood goes into the summary.</p>
    </>
  );
};

const ProDashboard = ({ onExitPro, standalone = false }) => {
  const [tab, setTab] = useState('today');
  const [online, setOnline] = useState(true);
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [schedule, setSchedule] = useState(INIT_SCHEDULE);
  const [acctOpen, setAcctOpen] = useState(false);
  // Toast carries an optional Undo action (used by decline).
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const act = (m, undo, ms) => {
    setToast({ msg: m, undo });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), ms || (undo ? 4000 : 1700));
  };

  // Hydrated from the submitted walker/sitter application when there is one;
  // falls back to the demo persona otherwise.
  const [profile, setProfile] = useState(() => { try { return JSON.parse(window.localStorage.getItem('fylos.pro.profile')) || null; } catch (e) { return null; } });
  const persistProfile = (p) => { setProfile(p); try { window.localStorage.setItem('fylos.pro.profile', JSON.stringify(p)); } catch (e) {} };
  const proName = (profile?.name || '').trim() || 'Alex Mueller';
  const proFirst = proName.split(' ')[0];
  const proArea = (profile?.area || '').trim() || 'Zürich · Seefeld';
  const proRoles = profile?.roles?.length ? profile.roles : ['walking'];
  const roleLabel = proRoles.length === 2 ? 'Dog walker & sitter' : proRoles[0] === 'sitting' ? 'Pet sitter' : 'Dog walker';
  // Flat services list for display/editing; kept in sync with the profile.
  const [fallbackSvc, setFallbackSvc] = useState(MY_SERVICES);
  const services = profile
    ? proRoles.flatMap((r) => (profile.services?.[r] || []).map((s) => ({ n: s.n, p: parseFloat(s.p) || 0 })))
    : fallbackSvc;
  // Application review state — 'Go live' is the demo approval moment.
  const [live, setLive] = useState(() => { try { return window.localStorage.getItem('fylos.pro.live') === '1'; } catch (e) { return false; } });
  const goLive = () => {
    try { window.localStorage.setItem('fylos.pro.live', '1'); } catch (e) {}
    setLive(true);
    act('You’re live. Owners near you can now find you');
    // The first-request moment: a few seconds after going live, a real
    // request lands in the inbox. Nothing sells the pro side like this.
    setTimeout(() => {
      setRequests((prev) => (prev.some((r) => r.id === INCOMING_REQUEST.id) ? prev : [INCOMING_REQUEST, ...prev]));
      act('First request just came in. Milo, 30 min walk', null, 4000);
    }, 4000);
  };
  // Weekly availability chips, editable in place. Toggling a day writes the
  // whole day on/off back to the saved schedule (daypart detail is kept in
  // the application flow; the dashboard edits at day level).
  const [days, setDays] = useState(() => (profile?.sched ? profile.sched.map((row) => row.some(Boolean)) : [true, true, true, true, true, false, false]));
  const toggleDay = (i) => {
    const nx = days.map((v, j) => (j === i ? !v : v));
    setDays(nx);
    if (profile) persistProfile({ ...profile, sched: nx.map((on) => [on, on, on]) });
  };
  // Money sheets: tap a payout row for the gross/fee/net breakdown; the
  // Statements action lists monthly and yearly PDFs honestly.
  const [payoutFor, setPayoutFor] = useState(null);
  const [statementsOpen, setStatementsOpen] = useState(false);
  // "How owners see you" — the public search card, hydrated from the profile.
  const [previewOpen, setPreviewOpen] = useState(false);
  // Reviews: full-screen list with reply-to-review (replies persist in state).
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [reviews, setReviews] = useState(INIT_REVIEWS);
  const [replyingId, setReplyingId] = useState(null);
  const [replyDraft, setReplyDraft] = useState('');
  const sendReply = (rv) => {
    if (!replyDraft.trim()) return;
    setReviews((prev) => prev.map((x) => (x.id === rv.id ? { ...x, reply: replyDraft.trim() } : x)));
    setReplyingId(null);
    setReplyDraft('');
    act(`Reply sent. ${rv.owner.split(' ')[0]} will see it on your profile`);
  };
  // Pause hides the profile from search while away (vacation mode).
  const [paused, setPaused] = useState(() => { try { return window.localStorage.getItem('fylos.pro.paused') || ''; } catch (e) { return ''; } });
  const pauseProfile = (label) => { try { window.localStorage.setItem('fylos.pro.paused', label); } catch (e) {} setPaused(label); setPauseSheetOpen(false); act('Profile paused. Owners can’t find you'); };
  const resumeProfile = () => { try { window.localStorage.removeItem('fylos.pro.paused'); } catch (e) {} setPaused(''); act('Welcome back. You’re visible again'); };
  const [pauseSheetOpen, setPauseSheetOpen] = useState(false);
  // Services & prices edit sheet
  const [svcSheetOpen, setSvcSheetOpen] = useState(false);
  const [svcDraft, setSvcDraft] = useState([]);
  const openSvcSheet = () => { setSvcDraft(services.map((s) => ({ n: s.n, p: String(s.p) }))); setSvcSheetOpen(true); };
  const svcDraftValid = svcDraft.every((s) => parseFloat(s.p) > 0);
  const saveSvcSheet = () => {
    if (!svcDraftValid) return;
    if (profile) {
      let k = 0;
      const nextServices = { ...profile.services };
      proRoles.forEach((r) => { nextServices[r] = (profile.services?.[r] || []).map((s) => ({ ...s, p: svcDraft[k++].p })); });
      persistProfile({ ...profile, services: nextServices });
    } else {
      setFallbackSvc(svcDraft.map((s) => ({ n: s.n, p: parseFloat(s.p) })));
    }
    setSvcSheetOpen(false);
    act('Prices updated');
  };
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
    const tick = (t) => { if (!start) start = t; const p = Math.min(1, (t - start) / 350); setTodayChf(58 * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(tick); };
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

  // Accepting never mutates today's schedule — the mock requests are all for
  // future or recurring dates; the toast names the booked day instead.
  const accept = (r) => {
    setRequests((prev) => prev.filter((x) => x.id !== r.id));
    act(`Accepted. ${r.who} is booked for ${r.when.split(' · ')[0]}`);
  };
  // Decline asks for a reason first (owners see it, and it keeps the
  // marketplace honest); the toast still offers Undo.
  const [declineFor, setDeclineFor] = useState(null);
  const performDecline = (r, reason) => {
    const idx = requests.findIndex((x) => x.id === r.id);
    setRequests((prev) => prev.filter((x) => x.id !== r.id));
    setDeclineFor(null);
    act(`Declined · ${reason}`, () => {
      setRequests((prev) => { const nx = [...prev]; nx.splice(Math.min(idx < 0 ? 0 : idx, nx.length), 0, r); return nx; });
      setToast(null);
    });
  };

  // ── Walk check-in flow ──
  // The live walk runs on a real seconds clock. Tapping the live card opens
  // the full walk view (map, timeline, photo moments); End walk goes through
  // the report so the owner always gets a summary. When nothing is live, an
  // upcoming job can be started through the pre-walk checklist.
  const hasLive = schedule.some((s) => s.live);
  const liveJob = schedule.find((s) => s.live);
  const [walkSecs, setWalkSecs] = useState(24 * 60);
  const [walkView, setWalkView] = useState(null); // { jobId, stage: 'pre' | 'active' | 'report' }
  const [walkPhotos, setWalkPhotos] = useState(1);
  const [walkEvents, setWalkEvents] = useState([
    { at: 0, label: 'Checked in at pickup' },
    { at: 9 * 60, label: 'Photo sent to Anna' },
  ]);
  const [checklist, setChecklist] = useState([]);
  const CHECKLIST_ITEMS = ['Leash attached', 'Water for both of you', 'Waste bags', 'Treats'];
  useEffect(() => {
    if (!hasLive) return;
    const t = setInterval(() => setWalkSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [hasLive]);
  const liveMin = liveJob ? Math.min(liveJob.total, Math.floor(walkSecs / 60)) : 0;
  const walkKm = (walkSecs * 0.0014).toFixed(2);
  const fmtClock = (secs) => `${Math.floor(secs / 60).toString().padStart(2, '0')}:${(secs % 60).toString().padStart(2, '0')}`;
  const ownerFirst = (job) => (job?.who.split(' · ')[1] || 'the owner').split(' ')[0];
  const sendWalkPhoto = () => {
    if (!liveJob) return;
    setWalkPhotos((n) => n + 1);
    setWalkEvents((prev) => [...prev, { at: walkSecs, label: `Photo sent to ${ownerFirst(liveJob)}` }]);
    act(`Photo update sent to ${ownerFirst(liveJob)}`);
  };
  const logBreak = () => {
    if (!liveJob) return;
    setWalkEvents((prev) => [...prev, { at: walkSecs, label: 'Water break' }]);
    act('Break logged');
  };
  const openChecklist = (job) => {
    setChecklist(CHECKLIST_ITEMS.map((label) => ({ label, done: false })));
    setWalkView({ jobId: job.id, stage: 'pre' });
  };
  const startWalk = (jobId) => {
    setSchedule((prev) => prev.map((j) => (j.id === jobId ? { ...j, live: true, done: 0, total: parseInt(j.svc) || 30 } : j)));
    setWalkSecs(0);
    setWalkPhotos(0);
    setWalkEvents([{ at: 0, label: 'Checked in at pickup' }]);
    setWalkView({ jobId, stage: 'active' });
    act('Walk started. Owner can follow along');
  };
  const endWalk = () => {
    if (!liveJob) return;
    setWalkView({ jobId: liveJob.id, stage: 'report' });
  };
  const completeWalk = (job) => {
    setSchedule((prev) => prev.map((s) => (s.id === job.id ? { ...s, live: false, ended: true, done: Math.max(1, liveMin) } : s)));
    setWalkView(null);
    act(`Summary sent to ${ownerFirst(job)}`);
  };

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
        <span className="text-[13px] font-bold" style={{ color: INK }}>{proFirst}</span>
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
            {/* paused strip — profile hidden from search */}
            {paused && (
              <div className="w-full rounded-[16px] mb-3 px-3.5 py-2.5 flex items-center gap-2.5" style={{ background: PEACH }}>
                <Pause size={14} color={MUTED} strokeWidth={2.2} className="shrink-0" />
                <span className="flex-1 text-[12px] font-semibold leading-[1.35]" style={{ color: MUTED }}>Profile paused. Owners can’t find you.</span>
                <button onClick={resumeProfile} className="text-[11.5px] font-bold shrink-0 active:opacity-60" style={{ color: CORAL }}>Resume</button>
              </div>
            )}
            {/* application review strip — until the demo approval moment */}
            {!live && (
              <button onClick={goLive} className="w-full rounded-[16px] mb-3 px-3.5 py-2.5 flex items-center gap-2.5 text-left active:scale-[0.99] transition-transform" style={{ background: TINT }}>
                <ShieldCheck size={15} color={CORAL} strokeWidth={2.2} className="shrink-0" />
                <span className="flex-1 text-[12px] font-semibold leading-[1.35]" style={{ color: INK }}>Application in review, usually within 48 hours.</span>
                <span className="text-[11.5px] font-bold shrink-0" style={{ color: CORAL }}>Go live</span>
              </button>
            )}
            {/* day stats */}
            <div className="rounded-[18px] bg-white flex items-center py-3.5" style={{ boxShadow: SHADOW }}>
              {[[`CHF ${Math.round(todayChf)}`, 'today', true], [`${schedule.length}`, 'jobs'], ['4.9', 'rating']].map(([v, l, accent], i) => (
                <button key={i} disabled={l !== 'rating'} onClick={() => l === 'rating' && setReviewsOpen(true)} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid ' + LINE : 'none' }}>
                  <span className="text-[17px] font-extrabold leading-none" style={{ color: accent ? CORAL : INK }}>{v}</span>
                  <span className="text-[10px] font-medium mt-1.5" style={{ color: TERT }}>{l}</span>
                </button>
              ))}
            </div>

            {/* live job — tap through to the full walk view */}
            {liveJob && (() => { const s = liveJob; return (
              <div className="rounded-[18px] mt-4 p-4" style={{ background: TINT }}>
                <button onClick={() => setWalkView({ jobId: s.id, stage: 'active' })} className="w-full flex items-center gap-3 text-left active:opacity-80">
                  <img src={s.photo} alt="" className="w-11 h-11 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold" style={{ color: CORAL }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: CORAL, animation: 'pdPulse 1.4s ease-in-out infinite' }} />LIVE NOW</div>
                    <div className="text-[14.5px] font-bold mt-0.5" style={{ color: INK }}>{s.svc} · {s.who.split(' · ')[0]}</div>
                  </div>
                  <span className="text-[12px] font-bold" style={{ color: MUTED }}>{liveMin}/{s.total} min</span>
                  <ChevronRight size={14} color={MUTED} strokeWidth={2.4} className="shrink-0" />
                </button>
                <div className="h-[6px] rounded-full overflow-hidden mt-3" style={{ background: 'rgba(255,255,255,0.7)' }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (liveMin / s.total) * 100)}%`, background: CORAL, transition: 'width 1s linear' }} />
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={sendWalkPhoto} className="flex-1 h-10 rounded-[12px] bg-white flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ boxShadow: '0 2px 8px rgba(60,30,15,0.08)' }}><Camera size={14} color={CORAL} strokeWidth={2.2} /><span className="text-[12.5px] font-bold" style={{ color: CORAL }}>Send photo</span></button>
                  <button onClick={endWalk} className="flex-1 h-10 rounded-[12px] flex items-center justify-center active:scale-[0.98]" style={{ background: CORAL }}><span className="text-[12.5px] font-bold text-white">End walk</span></button>
                </div>
              </div>
            ); })()}

            {/* requests teaser — 'new' counts only the actually-new ones */}
            {requests.length > 0 && (() => { const newCount = requests.filter((x) => x.isNew).length; return (
              <button onClick={() => setTab('requests')} className="w-full mt-4 bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
                <span className="relative w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: TINT }}>
                  <Inbox size={16} color={CORAL} strokeWidth={2} />
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center text-[10.5px] font-extrabold text-white" style={{ background: CORAL }}>{requests.length}</span>
                </span>
                <div className="flex-1"><div className="text-[13.5px] font-bold" style={{ color: INK }}>{newCount > 0 ? `${newCount} new request${newCount > 1 ? 's' : ''}` : `${requests.length} open request${requests.length > 1 ? 's' : ''}`}</div><div className="text-[11px] mt-[1px]" style={{ color: TERT }}>Reply fast. Owners usually book whoever answers first</div></div>
                <ChevronRight size={15} color="#CFC7BD" strokeWidth={2.2} />
              </button>
            ); })()}

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
                  {s.live ? <span className="text-[10.5px] font-extrabold px-1.5 py-[2px] rounded-full" style={{ background: TINT, color: CORAL }}>LIVE</span> : s.ended ? <span className="text-[10.5px] font-extrabold px-1.5 py-[2px] rounded-full" style={{ background: '#EAF7EF', color: GREEN }}>DONE</span> : !hasLive ? <button onClick={() => openChecklist(s)} className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95" style={{ background: TINT }}><Play size={13} color={CORAL} strokeWidth={2.4} fill={CORAL} /></button> : <button onClick={() => act('Directions to pickup')} className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><MapPin size={14} color={MUTED} strokeWidth={2.2} /></button>}
                  {i < schedule.length - 1 && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: LINE }} />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── REQUESTS ── */}
        {tab === 'requests' && (
          <>
            {/* offline notice — new requests are paused while offline */}
            {!online && (
              <div className="w-full rounded-[16px] mb-3 px-3.5 py-2.5 flex items-center gap-2.5" style={{ background: PEACH }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#C9BBAE' }} />
                <span className="flex-1 text-[12px] font-semibold leading-[1.35]" style={{ color: MUTED }}>You’re offline. Owners can’t send new requests.</span>
                <button onClick={() => { setOnline(true); act('You’re online'); }} className="text-[11.5px] font-bold shrink-0 active:opacity-60" style={{ color: CORAL }}>Go online</button>
              </div>
            )}
            {requests.length ? requests.map((r) => (
              <div key={r.id} className="bg-white rounded-[18px] p-3.5 mb-3" style={{ boxShadow: SHADOW }}>
                <div className="flex items-center gap-3">
                  <img src={r.photo} alt="" className="w-12 h-12 rounded-[12px] object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14.5px] font-bold truncate" style={{ color: INK }}>{r.svc}</span>
                      {r.isNew && <span className="text-[8.5px] font-extrabold px-1.5 py-[2px] rounded-full shrink-0" style={{ background: TINT, color: CORAL }}>NEW</span>}
                    </div>
                    <div className="text-[12px] mt-0.5 font-semibold" style={{ color: CORAL }}>{r.when}{r.expires && <span className="font-medium" style={{ color: TERT }}> · replies close in {r.expires}</span>}</div>
                    <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{r.who} · {r.meta}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[15px] font-extrabold" style={{ color: INK }}>CHF {r.price}</div>
                    <div className="text-[10.5px] font-semibold" style={{ color: GREEN }}>You get CHF {(r.price * 0.85).toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setDeclineFor(r)} className="flex-1 h-10 rounded-[12px] bg-white flex items-center justify-center active:scale-[0.98]" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}><span className="text-[13px] font-bold" style={{ color: MUTED }}>Decline</span></button>
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
            {/* balance hero */}
            <div className="relative rounded-[20px] overflow-hidden p-5" style={{ background: CARD_GRADIENT, boxShadow: '0 14px 34px rgba(232,93,42,0.3)' }}>
              <div className="absolute inset-0" style={{ background: 'radial-gradient(130% 90% at 88% -10%, rgba(255,255,255,0.28), transparent 55%)' }} />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: 'rgba(255,255,255,0.75)' }}>February earnings</span>
                  <span className="text-[10.5px] font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.16)', color: '#fff' }}>38 jobs</span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-3"><span className="text-[14px] font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>CHF</span><span className="text-[38px] font-extrabold text-white leading-none tracking-[-0.02em] tabular-nums">{bal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
                <div className="text-[11.5px] mt-2.5" style={{ color: 'rgba(255,255,255,0.8)' }}>Next payout Mon · CHF 310.20 via Stripe</div>
              </div>
            </div>
            <p className="text-[10.5px] mt-2 ml-1.5" style={{ color: TERT }}>fylos keeps 15% per booking. Everything else is yours.</p>

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
                    <button key={id} onClick={() => setRange(id)} className="h-[30px] px-3 text-[11px] font-bold rounded-full active:scale-95 transition-transform" style={range === id ? { background: '#FFF3EC', color: CORAL, boxShadow: 'inset 0 0 0 1.5px ' + CORAL } : { background: 'transparent', color: TERT }}>{label}</button>
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

            {/* payouts — each row opens the gross/fee/net breakdown */}
            <SectionLabel action="Statements" onAction={() => setStatementsOpen(true)}>Payouts</SectionLabel>
            <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              {PAYOUTS.map((p, i) => (
                <button key={p.id} onClick={() => setPayoutFor(p)} className="relative w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02]">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: '#EAF7EF' }}><Banknote size={15} color={GREEN} strokeWidth={2} /></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13.5px] font-semibold" style={{ color: INK }}>{p.label}</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{p.sub}</div>
                  </div>
                  <span className="text-[13.5px] font-extrabold tabular-nums" style={{ color: GREEN }}>{p.amount}</span>
                  <ChevronRight size={13} color="#D4D4D8" strokeWidth={2.2} className="shrink-0" />
                  {i < PAYOUTS.length - 1 && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: LINE }} />}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── PROFILE ── */}
        {tab === 'profile' && (
          <>
            <div className="bg-white rounded-[18px] p-4" style={{ boxShadow: SHADOW }}>
              <div className="flex items-center gap-3">
                <img src={ME} alt="" className="w-14 h-14 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1"><span className="text-[16px] font-extrabold truncate" style={{ color: INK }}>{proName}</span><BadgeCheck size={15} color={CORAL} strokeWidth={2.2} /></div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{roleLabel} · {proArea}</div>
                  <button onClick={() => setReviewsOpen(true)} className="inline-flex items-center gap-1 mt-1 active:opacity-60"><Star size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} /><span className="text-[11.5px] font-bold" style={{ color: INK }}>4.9</span><span className="text-[11px]" style={{ color: TERT }}>(132)</span><ChevronRight size={11} color="#CFC7BD" strokeWidth={2.4} /></button>
                </div>
                <button onClick={() => setPreviewOpen(true)} className="w-10 h-10 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><Eye size={15} color={MUTED} strokeWidth={2} /></button>
              </div>
            </div>

            <SectionLabel>Availability</SectionLabel>
            <div className="bg-white rounded-[18px] px-4 py-3.5 flex items-center justify-between" style={{ boxShadow: SHADOW }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, i) => {
                const on = days[i];
                return <button key={i} onClick={() => toggleDay(i)} className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-bold active:scale-90 transition-transform" style={{ background: on ? TINT : PEACH, color: on ? CORAL : '#C4BBB0' }}>{w}</button>;
              })}
            </div>
            <p className="text-[10.5px] mt-1.5 ml-1.5" style={{ color: TERT }}>Tap a day to switch it on or off.</p>

            <SectionLabel action="Edit" onAction={openSvcSheet}>Services & prices</SectionLabel>
            <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              {services.map((s, i) => (
                <div key={i} className="relative flex items-center px-4 py-3">
                  <span className="flex-1 text-[13.5px] font-semibold" style={{ color: INK }}>{s.n}</span>
                  <span className="text-[13.5px] font-extrabold tabular-nums" style={{ color: INK }}>CHF {s.p}</span>
                  {i < services.length - 1 && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: LINE }} />}
                </div>
              ))}
            </div>

            <SectionLabel>Account</SectionLabel>
            <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              <button onClick={() => act('Payout details')} className="relative w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02]">
                <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: TINT }}><Lock size={15} color={CORAL} strokeWidth={2} /></span>
                <div className="flex-1"><div className="text-[14px] font-semibold" style={{ color: INK }}>Payout details</div><div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>CH93 ···· 5295 7 · Stripe</div></div>
                <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: LINE }} />
              </button>
              <button onClick={() => act('Pro support')} className="relative w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02]">
                <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: PEACH }}><LifeBuoy size={15} color={MUTED} strokeWidth={2} /></span>
                <div className="flex-1"><div className="text-[14px] font-semibold" style={{ color: INK }}>Pro support</div><div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>Pros get answered first</div></div>
                <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: LINE }} />
              </button>
              <button onClick={() => (paused ? resumeProfile() : setPauseSheetOpen(true))} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02]">
                <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: paused ? TINT : PEACH }}>{paused ? <Play size={15} color={CORAL} strokeWidth={2} /> : <Pause size={15} color={MUTED} strokeWidth={2} />}</span>
                <div className="flex-1"><div className="text-[14px] font-semibold" style={{ color: INK }}>{paused ? 'Resume my profile' : 'Pause my profile'}</div><div className="text-[11.5px] mt-0.5" style={{ color: paused ? CORAL : TERT }}>{paused ? `Paused · ${paused.toLowerCase()}` : 'Hide from search while away'}</div></div>
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

      {/* pro tab bar — same glass dock recipe as the personal app */}
      <div className="absolute left-4 right-4 z-50 bg-white/80 backdrop-blur-2xl rounded-[26px] flex items-center justify-around py-2.5" style={{ bottom: 22, boxShadow: '0 2px 20px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)' }}>
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

      {/* walk check-in flow — pre-walk checklist / live walk / report */}
      {walkView && (() => {
        const job = schedule.find((s) => s.id === walkView.jobId);
        if (!job) return null;
        const petName = job.who.split(' · ')[0];
        const owner = ownerFirst(job);
        const stage = walkView.stage;
        const allChecked = checklist.every((c) => c.done);
        const routeD = 'M 30 150 C 60 100, 90 130, 120 92 S 190 60, 214 88 S 268 130, 292 96';
        const routeLen = 340;
        const routeProgress = job.live ? Math.min(1, walkSecs / (job.total * 60)) : 1;
        return (
          <div className="absolute inset-0 z-[135] overflow-y-auto" style={{ background: CREAM, scrollbarWidth: 'none' }}>
            {/* canonical gradient-fade header */}
            <div className="sticky top-0 z-30 flex items-center justify-center pointer-events-none" style={{ paddingTop: 56, paddingBottom: 14, background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 62%, rgba(247,245,242,0) 100%)' }}>
              <button onClick={() => setWalkView(null)} className="absolute left-5 w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 pointer-events-auto" style={{ top: 52, boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}>
                <ChevronLeft size={18} color={INK} strokeWidth={2.2} />
              </button>
              {stage === 'active' ? (
                <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: CORAL, animation: 'pdPulse 1.4s ease-in-out infinite' }} /><span className="text-[15px] font-extrabold tabular-nums" style={{ color: INK }}>{fmtClock(walkSecs)}</span></span>
              ) : (
                <h1 className="text-[17px] font-bold" style={{ color: INK }}>{stage === 'pre' ? 'Before you go' : 'Walk report'}</h1>
              )}
            </div>

            <div className="px-5 pb-16">
              {/* job card — shared by all stages */}
              <div className="bg-white rounded-[18px] p-4 flex items-center gap-3" style={{ boxShadow: SHADOW }}>
                <img src={job.photo} alt="" className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-extrabold truncate" style={{ color: INK }}>{petName}</div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{job.svc} · with {owner} · pickup {job.time}</div>
                </div>
                {stage === 'active' && <span className="text-[11px] font-bold px-2 py-1 rounded-full shrink-0" style={{ background: TINT, color: CORAL }}>{liveMin}/{job.total} min</span>}
              </div>

              {/* ── PRE: checklist ── */}
              {stage === 'pre' && (
                <>
                  <SectionLabel>Before the walk</SectionLabel>
                  <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                    {checklist.map((c, i) => (
                      <button key={c.label} onClick={() => setChecklist((prev) => prev.map((x, j) => (j === i ? { ...x, done: !x.done } : x)))} className="relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.02]">
                        <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0" style={{ background: c.done ? GREEN : 'transparent', border: c.done ? 'none' : '1.6px solid #DDD4C9', transition: 'all 0.2s' }}>{c.done && <Check size={13} color="#fff" strokeWidth={3} />}</span>
                        <span className="flex-1 text-[14px]" style={{ color: c.done ? INK : MUTED, fontWeight: c.done ? 700 : 500 }}>{c.label}</span>
                        {i < checklist.length - 1 && <div className="absolute bottom-0 left-[52px] right-0 h-px" style={{ background: LINE }} />}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => allChecked && startWalk(job.id)} disabled={!allChecked} className="w-full mt-5 py-4 rounded-[18px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all" style={{ background: allChecked ? CORAL : '#EAE3DB', boxShadow: allChecked ? '0 8px 22px rgba(232,93,42,0.28)' : 'none' }}>
                    <Footprints size={16} color={allChecked ? '#fff' : TERT} strokeWidth={2.2} /><span className="text-[15px] font-bold" style={{ color: allChecked ? '#fff' : TERT }}>Start walk</span>
                  </button>
                  {!allChecked && <p className="text-center text-[11px] mt-2.5" style={{ color: TERT }}>Tick everything off to check in.</p>}
                </>
              )}

              {/* ── ACTIVE: map, stats, actions, timeline ── */}
              {stage === 'active' && (
                <>
                  {/* route map — warm grid, coral trail draws with progress */}
                  <div className="bg-white rounded-[18px] mt-3 overflow-hidden" style={{ boxShadow: SHADOW }}>
                    <div className="relative" style={{ height: 176, background: '#F6F2ED' }}>
                      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#E3DBD1 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
                      <div className="absolute rounded-[14px]" style={{ left: 18, top: 20, width: 84, height: 58, background: '#EAF2E7' }} />
                      <span className="absolute text-[9px] font-bold uppercase tracking-[0.08em]" style={{ left: 30, top: 44, color: '#9DB292' }}>Park</span>
                      <div className="absolute rounded-[10px]" style={{ right: 24, bottom: 22, width: 64, height: 34, background: '#E8EDF2' }} />
                      <span className="absolute text-[9px] font-bold uppercase tracking-[0.08em]" style={{ right: 34, bottom: 34, color: '#93A3B5' }}>Lake</span>
                      <svg viewBox="0 0 320 176" className="absolute inset-0 w-full h-full">
                        <path d={routeD} fill="none" stroke="#E9E1D8" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 9" />
                        <path d={routeD} fill="none" stroke={CORAL} strokeWidth="3.5" strokeLinecap="round" strokeDasharray={routeLen} strokeDashoffset={routeLen * (1 - routeProgress)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                        <circle cx="30" cy="150" r="5" fill="#fff" stroke={CORAL} strokeWidth="2.5" />
                      </svg>
                      <span className="absolute w-3.5 h-3.5 rounded-full" style={{ left: `${(30 + 262 * routeProgress) / 3.2}%`, top: 88 - 30 * Math.sin(routeProgress * 3), background: CORAL, border: '2.5px solid #fff', boxShadow: '0 0 0 5px rgba(232,93,42,0.18)', animation: 'pdPulse 1.6s ease-in-out infinite', transition: 'left 1s linear' }} />
                    </div>
                    <div className="flex items-center px-4 py-3">
                      {[[`${walkKm} km`, 'distance'], [`${walkPhotos}`, walkPhotos === 1 ? 'photo sent' : 'photos sent'], [`${Math.max(0, job.total - liveMin)} min`, 'to go']].map(([v, l], i) => (
                        <div key={l} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid ' + LINE : 'none' }}>
                          <span className="text-[15px] font-extrabold leading-none tabular-nums" style={{ color: INK }}>{v}</span>
                          <span className="text-[10px] font-medium mt-1" style={{ color: TERT }}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* quick actions */}
                  <div className="flex gap-2 mt-3">
                    <button onClick={sendWalkPhoto} className="flex-1 h-11 rounded-[14px] bg-white flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ boxShadow: SHADOW }}><Camera size={15} color={CORAL} strokeWidth={2.2} /><span className="text-[12.5px] font-bold" style={{ color: CORAL }}>Send photo</span></button>
                    <button onClick={logBreak} className="flex-1 h-11 rounded-[14px] bg-white flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ boxShadow: SHADOW }}><PawPrint size={15} color={MUTED} strokeWidth={2.2} /><span className="text-[12.5px] font-bold" style={{ color: MUTED }}>Break</span></button>
                  </div>
                  <button onClick={endWalk} className="w-full h-12 mt-2 rounded-[16px] flex items-center justify-center active:scale-[0.98]" style={{ background: CORAL, boxShadow: '0 6px 18px rgba(232,93,42,0.26)' }}><span className="text-[14px] font-bold text-white">End walk</span></button>

                  {/* timeline */}
                  <SectionLabel>Walk timeline</SectionLabel>
                  <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                    {[...walkEvents].reverse().map((ev, i, arr) => (
                      <div key={i} className="relative flex items-center gap-3 px-4 py-3">
                        <span className="text-[11.5px] font-extrabold tabular-nums w-[42px] shrink-0" style={{ color: CORAL }}>{fmtClock(ev.at)}</span>
                        <span className="flex-1 text-[13px] font-semibold" style={{ color: INK }}>{ev.label}</span>
                        {i < arr.length - 1 && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: LINE }} />}
                      </div>
                    ))}
                  </div>
                  <p className="text-[10.5px] mt-2 ml-1.5" style={{ color: TERT }}>{owner} sees the trail and every photo, live.</p>
                </>
              )}

              {/* ── REPORT ── */}
              {stage === 'report' && (
                <WalkReport job={job} petName={petName} owner={owner} minutes={Math.max(1, liveMin)} km={walkKm} photos={walkPhotos} onSend={() => completeWalk(job)} />
              )}
            </div>
          </div>
        );
      })()}

      {/* reviews — full-screen list with reply-to-review */}
      {reviewsOpen && (
        <div className="absolute inset-0 z-[130] overflow-y-auto" style={{ background: CREAM, scrollbarWidth: 'none' }}>
          {/* canonical gradient-fade header */}
          <div className="sticky top-0 z-30 flex items-center justify-center pointer-events-none" style={{ paddingTop: 56, paddingBottom: 14, background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 62%, rgba(247,245,242,0) 100%)' }}>
            <button onClick={() => { setReviewsOpen(false); setReplyingId(null); }} className="absolute left-5 w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 pointer-events-auto" style={{ top: 52, boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}>
              <ChevronLeft size={18} color={INK} strokeWidth={2.2} />
            </button>
            <h1 className="text-[17px] font-bold" style={{ color: INK }}>Reviews</h1>
          </div>
          <div className="px-5 pb-16">
            {/* summary */}
            <div className="bg-white rounded-[18px] p-4 flex items-center gap-5" style={{ boxShadow: SHADOW }}>
              <div className="flex flex-col items-center shrink-0">
                <span className="text-[34px] font-extrabold leading-none tracking-[-0.02em]" style={{ color: INK }}>4.9</span>
                <div className="flex gap-[2px] mt-1.5">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} />)}</div>
                <span className="text-[11px] mt-1" style={{ color: TERT }}>132 reviews</span>
              </div>
              <div className="flex-1 flex flex-col gap-[5px]">
                {REVIEW_DIST.map(([stars, n]) => (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="text-[10.5px] font-bold w-2 text-right" style={{ color: TERT }}>{stars}</span>
                    <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: PEACH }}>
                      <div className="h-full rounded-full" style={{ width: `${(n / 132) * 100}%`, background: '#E8B04A' }} />
                    </div>
                    <span className="text-[10px] w-7 tabular-nums" style={{ color: '#C4BBB0' }}>{n}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10.5px] mt-2 ml-1.5" style={{ color: TERT }}>Replies show on your public profile. Owners read them.</p>

            {/* review cards */}
            <div className="flex flex-col gap-3 mt-4">
              {reviews.map((rv) => (
                <div key={rv.id} className="bg-white rounded-[18px] p-4" style={{ boxShadow: SHADOW }}>
                  <div className="flex items-center gap-2.5">
                    {rv.photo
                      ? <img src={rv.photo} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                      : <span className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0" style={{ background: TINT, color: CORAL }}>{rv.owner[0]}</span>}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-bold truncate" style={{ color: INK }}>{rv.owner} <span className="font-medium" style={{ color: TERT }}>· {rv.pet}</span></div>
                      <div className="flex items-center gap-1.5 mt-[2px]">
                        <div className="flex gap-[1.5px]">{[1, 2, 3, 4, 5].map((i) => <Star key={i} size={9.5} color={i <= rv.stars ? '#E8B04A' : '#E8E2DA'} fill={i <= rv.stars ? '#E8B04A' : '#E8E2DA'} strokeWidth={0} />)}</div>
                        <span className="text-[10.5px]" style={{ color: '#C4BBB0' }}>{rv.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[12.5px] leading-[1.5] mt-2.5" style={{ color: MUTED }}>{rv.text}</p>
                  {rv.reply ? (
                    <div className="rounded-[12px] mt-2.5 px-3 py-2.5" style={{ background: TINT }}>
                      <div className="text-[10px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: CORAL }}>You replied</div>
                      <p className="text-[12px] leading-[1.45]" style={{ color: INK }}>{rv.reply}</p>
                    </div>
                  ) : replyingId === rv.id ? (
                    <div className="mt-2.5">
                      <textarea autoFocus value={replyDraft} onChange={(e) => setReplyDraft(e.target.value)} rows={2} placeholder={`Reply to ${rv.owner.split(' ')[0]}. Warm and short works best.`}
                        className="w-full rounded-[12px] px-3 py-2.5 outline-none text-[12.5px] font-medium resize-none" style={{ background: '#F7F4F0', color: INK }} />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => { setReplyingId(null); setReplyDraft(''); }} className="flex-1 h-9 rounded-[12px] bg-white flex items-center justify-center active:scale-[0.98]" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}><span className="text-[12.5px] font-bold" style={{ color: MUTED }}>Cancel</span></button>
                        <button onClick={() => sendReply(rv)} disabled={!replyDraft.trim()} className="flex-1 h-9 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ background: replyDraft.trim() ? CORAL : '#EAE3DB' }}><Send size={12} color={replyDraft.trim() ? '#fff' : TERT} strokeWidth={2.2} /><span className="text-[12.5px] font-bold" style={{ color: replyDraft.trim() ? '#fff' : TERT }}>Send</span></button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => { setReplyingId(rv.id); setReplyDraft(''); }} className="mt-2 text-[12px] font-bold active:opacity-60" style={{ color: CORAL }}>Reply</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* "How owners see you" — public search card preview */}
      {previewOpen && (
        <>
          <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'pdFade 0.2s ease both' }} onClick={() => setPreviewOpen(false)} />
          <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] px-5 pb-9" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'pdSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
            <div className="flex items-center gap-3 pt-1 pb-1">
              <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>How owners see you</h2>
              <button onClick={() => setPreviewOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
            </div>
            <p className="text-[12.5px] pb-3" style={{ color: TERT }}>Your card in the Services search, exactly as it renders.</p>
            <div className="bg-white rounded-[18px] p-3 flex gap-3.5" style={{ boxShadow: SHADOW }}>
              <img src={ME} alt="" className="w-[76px] h-[76px] rounded-[15px] object-cover shrink-0" />
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="text-[14.5px] font-bold truncate" style={{ color: INK }}>{proName}</span>
                  <BadgeCheck size={13} color={CORAL} strokeWidth={2.2} className="shrink-0" />
                  <span className="flex-1" />
                  {paused && <span className="text-[10px] font-extrabold uppercase px-1.5 py-[2px] rounded-full shrink-0" style={{ background: PEACH, color: TERT }}>Paused</span>}
                </div>
                <div className="flex items-center gap-1.5 mt-[3px]">
                  <Star size={10} color="#E8B04A" fill="#E8B04A" strokeWidth={0} />
                  <span className="text-[11px]" style={{ color: TERT }}>4.9 (132) · {proArea.split('·')[1]?.trim() || proArea}</span>
                </div>
                <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid ' + LINE }}>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: paused ? TERT : GREEN }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: paused ? '#C9BBAE' : GREEN }} /> {paused ? 'Hidden from search' : 'Available'}</span>
                  <span className="text-[12.5px] font-extrabold" style={{ color: INK }}><span className="text-[10.5px] font-semibold" style={{ color: TERT }}>from </span>CHF {Math.min(...services.map((s) => s.p))}</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-[18px] p-4 mt-3" style={{ boxShadow: SHADOW }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2" style={{ color: '#A8A29C' }}>{roleLabel}</div>
              {services.map((s, i) => (
                <div key={i} className="flex items-center justify-between py-1.5">
                  <span className="text-[13px] font-semibold" style={{ color: INK }}>{s.n}</span>
                  <span className="text-[13px] font-bold" style={{ color: MUTED }}>CHF {s.p}</span>
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 pt-2.5" style={{ borderTop: '1px solid ' + LINE }}>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: TERT }}><Check size={11} color={GREEN} strokeWidth={3} /> GPS tracking & photo updates included</span>
                <span className="text-[11px] font-medium" style={{ color: TERT }}>· available {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].filter((_, i) => days[i]).join(', ')}</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* pause profile sheet */}
      {pauseSheetOpen && (
        <>
          <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'pdFade 0.2s ease both' }} onClick={() => setPauseSheetOpen(false)} />
          <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] px-5 pb-9" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'pdSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
            <div className="flex items-center gap-3 pt-1 pb-1">
              <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Pause my profile</h2>
              <button onClick={() => setPauseSheetOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
            </div>
            <p className="text-[12.5px] pb-3" style={{ color: TERT }}>You disappear from search and get no new requests. Booked jobs stay booked.</p>
            <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              {['For 1 week', 'For 2 weeks', 'Until I resume'].map((label, i, arr) => (
                <button key={label} onClick={() => pauseProfile(label)} className="relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.02]">
                  <span className="flex-1 text-[14.5px] font-semibold" style={{ color: INK }}>{label}</span>
                  <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                  {i < arr.length - 1 && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: LINE }} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* payout breakdown sheet */}
      {payoutFor && (
        <>
          <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'pdFade 0.2s ease both' }} onClick={() => setPayoutFor(null)} />
          <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] px-5 pb-9" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'pdSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
            <div className="flex items-center gap-3 pt-1 pb-1">
              <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Weekly payout</h2>
              <button onClick={() => setPayoutFor(null)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
            </div>
            <p className="text-[12.5px] pb-3" style={{ color: TERT }}>{payoutFor.sub}</p>
            <div className="bg-white rounded-[16px] px-4 py-1 overflow-hidden" style={{ boxShadow: SHADOW }}>
              {[
                ['Jobs completed', `${payoutFor.jobs}`],
                ['Gross earnings', `CHF ${payoutFor.gross.toFixed(2)}`],
                ['fylos fee (15%)', `CHF ${(payoutFor.gross - payoutFor.net).toFixed(2)}`],
              ].map(([l, v], i) => (
                <div key={l} className="relative flex items-center justify-between py-3">
                  <span className="text-[13.5px] font-semibold" style={{ color: MUTED }}>{l}</span>
                  <span className="text-[13.5px] font-bold tabular-nums" style={{ color: INK }}>{v}</span>
                  <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: LINE }} />
                </div>
              ))}
              <div className="flex items-center justify-between py-3.5">
                <span className="text-[14px] font-bold" style={{ color: INK }}>Paid to you</span>
                <span className="text-[16px] font-extrabold tabular-nums" style={{ color: GREEN }}>CHF {payoutFor.net.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-[11px] mt-2.5 ml-1" style={{ color: TERT }}>Sent via Stripe to CH93 ···· 5295 7.</p>
          </div>
        </>
      )}

      {/* statements sheet */}
      {statementsOpen && (
        <>
          <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'pdFade 0.2s ease both' }} onClick={() => setStatementsOpen(false)} />
          <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] px-5 pb-9" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'pdSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
            <div className="flex items-center gap-3 pt-1 pb-3">
              <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Statements</h2>
              <button onClick={() => setStatementsOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
            </div>
            <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              {STATEMENTS.map((st, i) => (
                <button key={st.id} disabled={!st.ready} onClick={() => act('Statement downloaded')} className="relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.02]" style={{ opacity: st.ready ? 1 : 0.55 }}>
                  <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: st.ready ? TINT : PEACH }}><Banknote size={15} color={st.ready ? CORAL : TERT} strokeWidth={2} /></span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold" style={{ color: INK }}>{st.label}</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{st.sub}</div>
                  </div>
                  {st.ready && <span className="text-[12px] font-bold shrink-0" style={{ color: CORAL }}>Download</span>}
                  {i < STATEMENTS.length - 1 && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: LINE }} />}
                </button>
              ))}
            </div>
            <p className="text-[11px] mt-2.5 ml-1" style={{ color: TERT }}>Each statement lists every job, the fylos fee and your net income.</p>
          </div>
        </>
      )}

      {/* decline reason sheet */}
      {declineFor && (
        <>
          <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'pdFade 0.2s ease both' }} onClick={() => setDeclineFor(null)} />
          <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] px-5 pb-9" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'pdSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
            <div className="flex items-center gap-3 pt-1 pb-1">
              <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Decline this request?</h2>
              <button onClick={() => setDeclineFor(null)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
            </div>
            <p className="text-[12.5px] pb-3" style={{ color: TERT }}>{declineFor.owner.split(' ')[0]} will see the reason. Short and honest works best.</p>
            <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              {DECLINE_REASONS.map((reason, i) => (
                <button key={reason} onClick={() => performDecline(declineFor, reason)} className="relative w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-black/[0.02]">
                  <span className="flex-1 text-[14.5px] font-semibold" style={{ color: INK }}>{reason}</span>
                  <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                  {i < DECLINE_REASONS.length - 1 && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: LINE }} />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* services & prices edit sheet */}
      {svcSheetOpen && (
        <>
          <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'pdFade 0.2s ease both' }} onClick={() => setSvcSheetOpen(false)} />
          <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] px-5 pb-9" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'pdSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
            <div className="flex items-center gap-3 pt-1 pb-3">
              <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Services & prices</h2>
              <button onClick={() => setSvcSheetOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
            </div>
            <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              {svcDraft.map((s, i) => (
                <div key={i} className="relative flex items-center gap-3 px-4 py-3.5">
                  <span className="flex-1 text-[14px] font-semibold" style={{ color: INK }}>{s.n}</span>
                  <span className="text-[12.5px] font-bold" style={{ color: TERT }}>CHF</span>
                  <input value={s.p} onChange={(e) => setSvcDraft((prev) => prev.map((x, j) => (j === i ? { ...x, p: e.target.value.replace(/[^\d.]/g, '') } : x)))} inputMode="decimal" className="w-16 bg-transparent outline-none text-right text-[16px] font-extrabold tabular-nums" style={{ color: CORAL }} />
                  {i < svcDraft.length - 1 && <div className="absolute bottom-0 left-4 right-0 h-px" style={{ background: LINE }} />}
                </div>
              ))}
            </div>
            <p className="text-[11px] mt-2.5 ml-1" style={{ color: TERT }}>You keep 85% of every booking. Owners see these prices.</p>
            <button onClick={saveSvcSheet} disabled={!svcDraftValid} className="w-full mt-4 py-3.5 rounded-[16px] active:scale-[0.98] transition-transform" style={{ background: svcDraftValid ? CORAL : '#EAE3DB', boxShadow: svcDraftValid ? '0 6px 18px rgba(232,93,42,0.26)' : 'none' }}>
              <span className="text-[15px] font-bold" style={{ color: svcDraftValid ? '#fff' : TERT }}>Save prices</span>
            </button>
          </div>
        </>
      )}

      {/* account switcher sheet */}
      {acctOpen && (
        <>
          <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'pdFade 0.2s ease both' }} onClick={() => setAcctOpen(false)} />
          <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] px-5 pb-9" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'pdSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
            <div className="flex items-center gap-3 pt-1 pb-3">
              <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Accounts</h2>
              <button onClick={() => setAcctOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
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

      {toast && (
        <div className="absolute left-1/2 z-[200] px-4 py-2.5 rounded-full flex items-center gap-3" style={{ bottom: 96, transform: 'translateX(-50%)', background: INK, animation: 'pdToast 0.2s ease both' }}>
          <span className="text-[13px] font-semibold text-white whitespace-nowrap">{toast.msg}</span>
          {toast.undo && <button onClick={toast.undo} className="text-[13px] font-bold active:opacity-60" style={{ color: '#F8A87E' }}>Undo</button>}
        </div>
      )}
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
  // Phone-sized viewports get the full-bleed variant on the standalone
  // route too — no drawn mockup chrome.
  if (typeof window !== 'undefined' && window.matchMedia('(max-width: 520px)').matches) {
    return (<>{styleBlock}<div className="fixed inset-0" style={{ background: CREAM }}>{inner}</div></>);
  }
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
