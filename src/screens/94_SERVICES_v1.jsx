import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Bell, Search, Footprints, Home, Scissors, Stethoscope,
  Star, Heart, ChevronRight, ChevronLeft, ChevronDown, MapPin, MessageCircle,
  CalendarClock, X, Check, BadgeCheck, Repeat, Gift,
} from 'lucide-react';

/**
 * 94_SERVICES_v1.jsx — Services tab v3 (Revolut-grade).
 * - Segmented control for Discover / Bookings / Saved.
 * - Walking & Sitting live; Grooming & Vet carry "Soon" badges; further
 *   services teased subtly underneath.
 * - Category browse and provider profile are FULL SCREENS (the Services
 *   header goes away), with a minimal sort dropdown — no pill rows.
 * - 30+ listings rendered at scale: Recommended cards clearly separated
 *   from the full alphabet-agnostic list.
 * - Bookings: month summary + date-grouped transaction-style rows.
 * - Saved: rich rows with instant Book + suggestions.
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
const LEO = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200';
const TAO = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200&h=200';
const USER_AVATAR = 'https://i.pravatar.cc/150?u=alex_fylos';

const PETS = [{ id: 'leo', name: 'Leo', photo: LEO }, { id: 'tao', name: 'Tao', photo: TAO }];
const CATEGORIES = [
  { id: 'walking', label: 'Walking', icon: Footprints, live: true },
  { id: 'sitting', label: 'Sitting', icon: Home, live: true },
  { id: 'grooming', label: 'Grooming', icon: Scissors, live: false },
  { id: 'vet', label: 'Vet', icon: Stethoscope, live: false },
];

const DETAILED = [
  { id: 'pr1', cat: 'walking', name: 'Lukas F.', rating: 4.9, reviews: 132, dist: 0.8, price: 22, photo: 'https://i.pravatar.cc/150?u=lukas_walker', verified: true, today: true, recommended: true,
    stats: [['530', 'walks'], ['92%', 'repeat'], ['~1 h', 'reply']], bio: 'Full-time walker in Seefeld. Calm energy, great with reactive dogs, photo updates on every walk.',
    services: [{ n: '30 min walk', p: 14 }, { n: '60 min walk', p: 22 }, { n: '90 min walk', p: 33 }],
    review: { who: 'Anna M.', txt: 'Leo comes back happy and tired every single time. Lukas sends the best photo updates.' } },
  { id: 'pr3', cat: 'sitting', name: 'Maria K.', rating: 4.8, reviews: 96, dist: 0.5, price: 38, photo: 'https://i.pravatar.cc/150?u=maria_sitter', verified: true, today: true, recommended: true,
    stats: [['210', 'stays'], ['88%', 'repeat'], ['~30 m', 'reply']], bio: 'Your pet stays at my quiet flat by the lake — daily walks, couch privileges included.',
    services: [{ n: 'Day sitting', p: 25 }, { n: 'Overnight', p: 38 }, { n: 'Week package', p: 240 }],
    review: { who: 'Julia S.', txt: 'Tao was so relaxed when we got back. Daily photos and a little diary — adorable.' } },
  { id: 'pr6', cat: 'walking', name: 'Jonas W.', rating: 4.8, reviews: 84, dist: 2.3, price: 24, photo: 'https://i.pravatar.cc/150?u=jonas_walker', verified: true, today: false, recommended: true,
    stats: [['310', 'walks'], ['90%', 'repeat'], ['~2 h', 'reply']], bio: 'Trail runner — perfect for high-energy dogs that need real exercise.',
    services: [{ n: '60 min run', p: 24 }, { n: '90 min trail', p: 36 }],
    review: { who: 'Felix H.', txt: 'Our husky finally gets the workout he needs.' } },
  { id: 'pr5', cat: 'walking', name: 'Nina T.', rating: 4.7, reviews: 58, dist: 1.6, price: 19, photo: 'https://i.pravatar.cc/150?u=nina_walker', verified: false, today: true, recommended: false,
    stats: [['160', 'walks'], ['81%', 'repeat'], ['~3 h', 'reply']], bio: 'Student & lifelong dog person. Energetic walks, parks and trails.',
    services: [{ n: '30 min walk', p: 12 }, { n: '60 min walk', p: 19 }],
    review: { who: 'Petra K.', txt: 'Great with our young lab — comes back perfectly tired.' } },
];
// 30+ extra walkers, deterministic values so the list is stable
const NAMES = ['Elena B.', 'Marc S.', 'Tina R.', 'David K.', 'Laura M.', 'Pascal H.', 'Mia W.', 'Noah B.', 'Lea F.', 'Tim G.', 'Sara J.', 'Luca P.', 'Nora E.', 'Jan D.', 'Amélie C.', 'Ben T.', 'Chiara V.', 'Felix N.', 'Ida M.', 'Oskar L.', 'Zoe A.', 'Liam K.', 'Emma S.', 'Paul W.', 'Lina H.', 'Aaron Z.', 'Maja Q.', 'Leon X.'];
const GENERATED = NAMES.map((name, i) => {
  const rating = (4.2 + ((i * 7) % 8) / 10).toFixed(1);
  const price = 15 + ((i * 3) % 14);
  return {
    id: 'gw' + i, cat: i % 4 === 3 ? 'sitting' : 'walking', name, rating: parseFloat(rating), reviews: 12 + ((i * 13) % 90), dist: +(0.4 + ((i * 5) % 40) / 10).toFixed(1), price,
    photo: `https://i.pravatar.cc/150?u=fylos_walker_${i}`, verified: i % 3 !== 1, today: i % 2 === 0, recommended: false,
    stats: [[String(40 + ((i * 11) % 400)), 'walks'], [`${78 + ((i * 5) % 20)}%`, 'repeat'], ['~2 h', 'reply']],
    bio: 'Local, vetted and insured through fylos. Flexible with schedules and happy to meet beforehand.',
    services: [{ n: '30 min walk', p: Math.round(price * 0.65) }, { n: '60 min walk', p: price }, { n: '90 min walk', p: Math.round(price * 1.5) }],
    review: { who: 'fylos member', txt: 'Reliable and kind — booking again.' },
  };
});
const PROVIDERS = [...DETAILED, ...GENERATED];

const INITIAL_BOOKINGS = [
  { id: 'b1', when: 'upcoming', group: 'This week', status: 'Confirmed', service: 'Grooming', provider: 'Sofia Lambrou', photo: 'https://i.pravatar.cc/150?u=sofia_walker', date: 'Mon, Feb 16 · 10:00', total: 65, pet: 'Leo', location: 'Sofia’s studio · Niederdorf', notes: 'Full groom — wash, trim, nails.' },
  { id: 'b2', when: 'upcoming', group: 'This week', status: 'Confirmed', service: 'Grooming', provider: 'Bright Paws · Elena', photo: 'https://i.pravatar.cc/150?u=elena_groomer', date: 'Wed, Feb 18 · 15:30', total: 85, pet: 'Leo', location: 'Bright Paws · Seefeld', notes: 'Bath, blow-dry & style with Elena.' },
  { id: 'b3', when: 'upcoming', group: 'This week', status: 'Confirmed', service: 'Vet visit', provider: 'Lakeshore Vet · Dr. Reza', photo: 'https://i.pravatar.cc/150?u=dr_reza', date: 'Fri, Feb 20 · 09:00', total: 120, pet: 'Leo', location: 'Lakeshore Vet · Bellevue', notes: 'Annual checkup & vaccinations.' },
  { id: 'b4', when: 'upcoming', group: 'Next week', status: 'Pending', service: '90 min walk', provider: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker', date: 'Tue, Feb 24 · 14:00', total: 33, pet: 'Leo', location: 'Pickup at home', notes: 'Waiting for Lukas to confirm.' },
  { id: 'b5', when: 'past', group: 'February', status: 'Completed', service: '60 min walk', provider: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker', date: 'Fri, Feb 6 · 09:00', total: 22, pet: 'Leo', location: 'Zürichhorn loop', notes: '' },
  { id: 'b6', when: 'past', group: 'January', status: 'Cancelled', service: 'Overnight sitting', provider: 'Maria K.', photo: 'https://i.pravatar.cc/150?u=maria_sitter', date: 'Sat, Jan 31', total: 0, pet: 'Tao', location: '', notes: 'Cancelled by you.' },
];
const SEGMENTS = ['Discover', 'Bookings', 'Saved'];
const SORTS = ['Recommended', 'Top rated', 'Price: low to high', 'Nearest'];
const DAYS = ['Today', 'Tomorrow', 'Sat 14'];
const TIMES = ['09:00', '11:00', '14:00', '16:30'];

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

const PreviewHeader = () => (
  <div className="absolute top-0 left-0 right-0 z-40 pt-14 pb-6 px-5 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F5F2, rgba(247,245,242,0.95) 70%, rgba(247,245,242,0))' }}>
    <div className="flex justify-between items-center pointer-events-auto" style={{ fontFamily: '"Nunito", sans-serif' }}>
      <span className="flex items-center" style={{ gap: 4 }}><span style={{ fontSize: 22, fontWeight: 800, color: INK, letterSpacing: '-0.5px' }}>Services</span><span style={{ width: 6, height: 6, borderRadius: '50%', background: CORAL }} /></span>
      <div className="flex items-center gap-2">
        <span className="w-[38px] h-[38px] flex items-center justify-center rounded-full" style={{ background: '#FFEBEA' }}><AlertTriangle size={15} className="text-[#FF3B30]" strokeWidth={2} /></span>
        <span className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full" style={{ background: PEACH }}><Bell size={17} className="text-[#6E6058]" strokeWidth={1.8} /><span className="absolute top-[6px] right-[7px] w-[7px] h-[7px] rounded-full" style={{ background: CORAL, border: '1.5px solid #F7F5F2' }} /></span>
        <span className="w-[44px] h-[44px] rounded-full overflow-hidden border-2" style={{ borderColor: '#EDE8E2' }}><img src={USER_AVATAR} alt="" className="w-full h-full object-cover" /></span>
      </div>
    </div>
  </div>
);

const SectionLabel = ({ children, action, onAction }) => (
  <div className="flex items-center justify-between mb-2 ml-1.5 mr-0.5 mt-6">
    <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A8A29C' }}>{children}</span>
    {action && <button onClick={onAction} className="text-[12px] font-bold active:opacity-60" style={{ color: CORAL }}>{action}</button>}
  </div>
);

const Rating = ({ p }) => (
  <span className="inline-flex items-center gap-1"><Star size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} /><span className="text-[11.5px] font-bold" style={{ color: INK }}>{p.rating}</span><span className="text-[11px]" style={{ color: TERT }}>({p.reviews})</span></span>
);

const statusTone = (s) => s === 'Confirmed' ? { bg: '#EAF7EF', c: GREEN } : s === 'Pending' ? { bg: '#FBF1E2', c: AMBER } : s === 'Cancelled' ? { bg: '#FEE8E7', c: DANGER } : { bg: PEACH, c: MUTED };
const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || 'Providers';

/* Canonical full-screen sub-header (content scrolls behind) */
const SubHeader = ({ title, sub, onBack, right }) => (
  <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none" style={{ paddingTop: 54, background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 64%, rgba(247,245,242,0) 100%)', paddingBottom: 14 }}>
    <div className="flex items-center px-5 pointer-events-auto" style={{ height: 44 }}>
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 shrink-0" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
      <div className="flex-1 text-center">
        <div className="text-[16px] font-bold tracking-[-0.01em] leading-tight" style={{ color: INK }}>{title}</div>
        {sub && <div className="text-[10.5px] font-medium" style={{ color: TERT }}>{sub}</div>}
      </div>
      {right || <span className="w-9 shrink-0" />}
    </div>
  </div>
);

const ServicesV2 = ({ embedded = false, initialSegment = 'discover', focusedBookingId = null, onClearFocus, onSubScreenChange }) => {
  const [segment, setSegment] = useState(focusedBookingId ? 'Bookings' : (initialSegment === 'bookings' ? 'Bookings' : 'Discover'));
  const [view, setView] = useState({ kind: 'home' }); // {kind:'home'} | {kind:'browse', cat} | {kind:'profile', id, from}
  const [sort, setSort] = useState('Recommended');
  const [sortOpen, setSortOpen] = useState(false);
  const [pet, setPet] = useState('leo');
  const [saved, setSaved] = useState(['pr1', 'pr3']);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [bkFilter, setBkFilter] = useState('upcoming');
  const [expanded, setExpanded] = useState(focusedBookingId);
  const [svc, setSvc] = useState(1);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(1);
  const [toast, setToast] = useState('');
  const act = (m) => { setToast(m); setTimeout(() => setToast(''), 1700); };
  useEffect(() => { if (focusedBookingId && onClearFocus) onClearFocus(); // eslint-disable-next-line
  }, []);
  useEffect(() => { onSubScreenChange && onSubScreenChange(view.kind !== 'home'); }, [view, onSubScreenChange]);

  const toggleSave = (id) => setSaved((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const petName = PETS.find((p) => p.id === pet)?.name || 'Leo';
  const upcoming = bookings.filter((b) => b.when === 'upcoming');
  const nextUp = upcoming[0];
  const lastDone = bookings.find((b) => b.status === 'Completed');
  const savedProviders = PROVIDERS.filter((p) => saved.includes(p.id));
  const suggestions = PROVIDERS.filter((p) => p.recommended && !saved.includes(p.id)).slice(0, 2);
  const monthTotal = upcoming.reduce((s, b) => s + b.total, 0);

  const openProfile = (id, from) => { setSvc(1); setDay(0); setTime(1); setView({ kind: 'profile', id, from }); };
  const profileP = view.kind === 'profile' ? PROVIDERS.find((p) => p.id === view.id) : null;

  const browseAll = view.kind === 'browse' ? PROVIDERS.filter((p) => p.cat === view.cat) : [];
  const browseRec = browseAll.filter((p) => p.recommended);
  const browseRest = [...browseAll.filter((p) => !p.recommended)].sort((a, b) =>
    sort === 'Top rated' ? b.rating - a.rating : sort === 'Price: low to high' ? a.price - b.price : sort === 'Nearest' ? a.dist - b.dist : b.rating * b.reviews - a.rating * a.reviews);

  const requestBooking = (p, svcSel, daySel, timeSel) => {
    const id = 'b' + Math.floor(Math.random() * 100000);
    setBookings((prev) => [{ id, when: 'upcoming', group: daySel === 'Today' || daySel === 'Tomorrow' ? 'This week' : 'Next week', status: 'Pending', service: svcSel.n, provider: p.name, photo: p.photo, date: `${daySel} · ${timeSel}`, total: svcSel.p, pet: petName, location: 'Pickup at home', notes: `Waiting for ${p.name.split(' ')[0]} to confirm.` }, ...prev]);
    setView({ kind: 'home' }); setSegment('Bookings'); setBkFilter('upcoming'); setExpanded(id);
    act('Request sent — waiting for confirmation');
  };

  /* ───────── full-screen: PROVIDER PROFILE ───────── */
  if (profileP) {
    const p = profileP;
    const sel = p.services[Math.min(svc, p.services.length - 1)];
    const isSaved = saved.includes(p.id);
    return (
      <Wrap embedded={embedded}>
        <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 112, paddingBottom: embedded ? 196 : 120, scrollbarWidth: 'none', background: CREAM }}>
          <div className="flex flex-col items-center text-center">
            <span className="relative">
              <img src={p.photo} alt={p.name} className="w-[84px] h-[84px] rounded-full object-cover" style={{ boxShadow: '0 10px 26px rgba(60,30,15,0.14)' }} />
              {p.today && <span className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full" style={{ background: GREEN, border: '2.5px solid ' + CREAM }} />}
            </span>
            <div className="flex items-center gap-1.5 mt-3"><h1 className="text-[21px] font-extrabold tracking-[-0.02em]" style={{ color: INK }}>{p.name}</h1>{p.verified && <BadgeCheck size={17} color={CORAL} strokeWidth={2.2} />}</div>
            <div className="text-[12.5px] mt-0.5" style={{ color: MUTED }}>{catLabel(p.cat) === 'Sitting' ? 'Pet sitter' : 'Dog walker'} · {p.dist} km away{p.today ? ' · Available today' : ''}</div>
            <div className="mt-1.5"><Rating p={p} /></div>
          </div>

          <div className="rounded-[16px] bg-white flex items-center py-3 mt-5" style={{ boxShadow: SHADOW }}>
            {p.stats.map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid ' + LINE : 'none' }}>
                <span className="text-[16px] font-extrabold leading-none" style={{ color: CORAL }}>{s[0]}</span>
                <span className="text-[10px] font-medium mt-1.5" style={{ color: TERT }}>{s[1]}</span>
              </div>
            ))}
          </div>

          <p className="text-[13px] leading-[1.5] mt-4 px-0.5" style={{ color: MUTED }}>{p.bio}</p>

          <SectionLabel>Services & prices</SectionLabel>
          <div className="rounded-[16px] bg-white overflow-hidden" style={{ boxShadow: SHADOW }}>
            {p.services.map((s, i) => {
              const on = Math.min(svc, p.services.length - 1) === i;
              return (
                <button key={s.n} onClick={() => setSvc(i)} className="relative w-full flex items-center gap-3 px-4 py-3 text-left active:bg-black/[0.02]">
                  <span className="w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0" style={{ background: on ? CORAL : 'transparent', border: on ? 'none' : '1.6px solid #DDD4C9' }}>{on && <Check size={12} color="#fff" strokeWidth={3.2} />}</span>
                  <span className="flex-1 text-[14px] font-semibold" style={{ color: INK }}>{s.n}</span>
                  <span className="text-[13.5px] font-bold" style={{ color: on ? CORAL : MUTED }}>CHF {s.p}</span>
                  {i < p.services.length - 1 && <div className="absolute bottom-0 left-[46px] right-0 h-px" style={{ background: LINE }} />}
                </button>
              );
            })}
          </div>

          <SectionLabel>Availability</SectionLabel>
          <div className="flex gap-2">{DAYS.map((d, i) => { const on = day === i; return <button key={d} onClick={() => setDay(i)} className="flex-1 h-[42px] rounded-[12px] text-[13px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>{d}</button>; })}</div>
          <div className="flex gap-2 mt-2">{TIMES.map((t, i) => { const on = time === i; return <button key={t} onClick={() => setTime(i)} className="flex-1 h-[38px] rounded-[11px] text-[12.5px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>{t}</button>; })}</div>

          <SectionLabel>Latest review</SectionLabel>
          <div className="rounded-[16px] bg-white px-4 py-3.5" style={{ boxShadow: SHADOW }}>
            <div className="flex items-center gap-1.5 mb-1.5">{[...Array(5)].map((_, i) => <Star key={i} size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} />)}<span className="text-[11.5px] font-bold ml-1" style={{ color: INK }}>{p.review.who}</span></div>
            <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>“{p.review.txt}”</p>
          </div>
        </div>

        <SubHeader title={p.name} sub={`${catLabel(p.cat)} · ${p.dist} km`} onBack={() => setView(view.from === 'browse' ? { kind: 'browse', cat: p.cat } : { kind: 'home' })}
          right={<button onClick={() => toggleSave(p.id)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 shrink-0" style={{ background: isSaved ? TINT : '#fff', boxShadow: isSaved ? 'none' : '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><Heart size={16} color={isSaved ? CORAL : MUTED} fill={isSaved ? CORAL : 'none'} strokeWidth={2} /></button>} />

        {/* sticky CTA */}
        <div className="absolute left-0 right-0 z-40 px-5 pointer-events-none" style={{ bottom: 0, paddingBottom: embedded ? 100 : 28, paddingTop: 26, background: `linear-gradient(to top, ${CREAM} 62%, rgba(247,245,242,0))` }}>
          <button onClick={() => requestBooking(p, sel, DAYS[day], TIMES[time])} className="w-full py-4 rounded-[16px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 pointer-events-auto" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.3)' }}>
            <span className="text-[15px] font-bold text-white">Request booking</span>
            <span className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>· CHF {sel.p}</span>
          </button>
        </div>
        {toast && <Toast embedded={embedded} msg={toast} />}
      </Wrap>
    );
  }

  /* ───────── full-screen: CATEGORY BROWSE ───────── */
  if (view.kind === 'browse') {
    return (
      <Wrap embedded={embedded}>
        <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 116, paddingBottom: embedded ? 104 : 36, scrollbarWidth: 'none', background: CREAM }}>
          {/* Recommended — clearly separated */}
          {browseRec.length > 0 && (
            <>
              <SectionLabel>Recommended for {petName}</SectionLabel>
              <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1" style={{ scrollbarWidth: 'none' }}>
                {browseRec.map((p) => (
                  <button key={p.id} onClick={() => openProfile(p.id, 'browse')} className="shrink-0 bg-white rounded-[18px] p-3 text-left active:scale-[0.98] transition-transform" style={{ width: 150, boxShadow: SHADOW }}>
                    <div className="relative">
                      <img src={p.photo} alt={p.name} className="w-full h-[92px] rounded-[13px] object-cover" />
                      {p.today && <span className="absolute top-2 left-2 inline-flex items-center gap-1 pl-1.5 pr-2 py-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.92)' }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /><span className="text-[9px] font-bold" style={{ color: GREEN }}>Today</span></span>}
                    </div>
                    <div className="flex items-center gap-1 mt-2"><span className="text-[13px] font-bold truncate" style={{ color: INK }}>{p.name}</span>{p.verified && <BadgeCheck size={12} color={CORAL} strokeWidth={2.2} className="shrink-0" />}</div>
                    <div className="flex items-center justify-between mt-1"><Rating p={p} /><span className="text-[11px] font-bold" style={{ color: INK }}>CHF {p.price}</span></div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* All — count + minimal sort dropdown (no pills) */}
          <div className="flex items-center justify-between mt-7 mb-2 ml-1.5 mr-0.5 relative">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A8A29C' }}>All · {browseRest.length}</span>
            <button onClick={() => setSortOpen(!sortOpen)} className="inline-flex items-center gap-1 text-[12.5px] font-bold active:opacity-70" style={{ color: INK }}>
              {sort}<ChevronDown size={14} color={TERT} strokeWidth={2.4} style={{ transform: sortOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.18s' }} />
            </button>
            {sortOpen && (
              <div className="absolute right-0 z-50 rounded-[14px] bg-white overflow-hidden" style={{ top: 24, width: 196, boxShadow: '0 8px 30px rgba(60,30,15,0.16)' }}>
                {SORTS.map((s, i) => (
                  <button key={s} onClick={() => { setSort(s); setSortOpen(false); }} className="relative w-full flex items-center justify-between px-3.5 py-2.5 text-left active:bg-black/[0.03]">
                    <span className="text-[13px] font-semibold" style={{ color: sort === s ? CORAL : INK }}>{s}</span>
                    {sort === s && <Check size={14} color={CORAL} strokeWidth={2.6} />}
                    {i < SORTS.length - 1 && <div className="absolute bottom-0 left-3.5 right-0 h-px" style={{ background: LINE }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }} onClick={() => sortOpen && setSortOpen(false)}>
            {browseRest.map((p, i) => (
              <div key={p.id} className="relative">
                <button onClick={() => openProfile(p.id, 'browse')} className="w-full flex items-center gap-3 px-3.5 py-[10px] text-left active:bg-black/[0.02] transition-colors">
                  <span className="relative shrink-0">
                    <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                    {p.today && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: GREEN, border: '2px solid #fff' }} />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1"><span className="text-[13.5px] font-semibold truncate" style={{ color: INK }}>{p.name}</span>{p.verified && <BadgeCheck size={12} color={CORAL} strokeWidth={2.2} className="shrink-0" />}</div>
                    <div className="flex items-center gap-2 mt-[3px]"><Rating p={p} /><span className="text-[11px]" style={{ color: TERT }}>· {p.dist} km</span></div>
                  </div>
                  <span className="text-[12px] font-bold shrink-0" style={{ color: INK }}>CHF {p.price}<span className="font-medium" style={{ color: TERT }}>/h</span></span>
                </button>
                {i < browseRest.length - 1 && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: LINE }} />}
              </div>
            ))}
          </div>
        </div>

        <SubHeader title={catLabel(view.cat)} sub={`${browseAll.length} providers near you`} onBack={() => { setSortOpen(false); setView({ kind: 'home' }); }} />
        {toast && <Toast embedded={embedded} msg={toast} />}
      </Wrap>
    );
  }

  /* ───────── HOME (segments) ───────── */
  return (
    <Wrap embedded={embedded} preview={!embedded}>
      <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 96, paddingBottom: embedded ? 104 : 36, scrollbarWidth: 'none', background: CREAM }}>
        {/* Segmented control */}
        <div className="flex p-[3px] rounded-[13px]" style={{ background: '#EDE6DD' }}>
          {SEGMENTS.map((s) => {
            const on = segment === s;
            const count = s === 'Bookings' ? upcoming.length : s === 'Saved' ? saved.length : 0;
            return (
              <button key={s} onClick={() => setSegment(s)} className="flex-1 h-[38px] rounded-[10px] text-[13px] font-bold transition-all flex items-center justify-center gap-1" style={{ background: on ? '#fff' : 'transparent', color: on ? CORAL : MUTED, boxShadow: on ? '0 1px 3px rgba(60,30,15,0.12)' : 'none' }}>
                {s}{count > 0 && <span className="text-[10px] font-extrabold" style={{ color: on ? CORAL : TERT }}>{count}</span>}
              </button>
            );
          })}
        </div>

        {/* ── DISCOVER ── */}
        {segment === 'Discover' && (
          <>
            <div className="flex items-center gap-2.5 bg-white rounded-[14px] px-3.5 h-[46px] mt-4" style={{ boxShadow: SHADOW }}>
              <Search size={16} color={TERT} strokeWidth={2} />
              <input placeholder={`Find care for ${petName}…`} className="flex-1 bg-transparent outline-none text-[14px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" />
              <div className="flex -space-x-1.5">
                {PETS.map((p) => { const on = pet === p.id; return <button key={p.id} onClick={() => setPet(p.id)} className="w-7 h-7 rounded-full p-[1.5px] active:scale-95 transition-all" style={{ background: on ? CORAL : '#E5DED5', zIndex: on ? 2 : 1, position: 'relative' }}><img src={p.photo} alt={p.name} className="w-full h-full rounded-full object-cover" /></button>; })}
              </div>
            </div>

            {/* Categories — live + coming soon */}
            <div className="flex justify-between mt-6 px-2.5">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <button key={c.id} onClick={() => c.live ? (setSort('Recommended'), setView({ kind: 'browse', cat: c.id })) : act(`${c.label} is coming soon — we’ll let you know`)} className="relative flex flex-col items-center gap-2 active:scale-95 transition-transform">
                    <span className="relative w-[56px] h-[56px] rounded-full flex items-center justify-center bg-white" style={{ boxShadow: SHADOW, opacity: c.live ? 1 : 0.75 }}>
                      <Icon size={21} color={c.live ? CORAL : '#C9BBAE'} strokeWidth={2} />
                      {!c.live && <span className="absolute -top-1 -right-2 text-[8px] font-extrabold uppercase tracking-[0.04em] px-1.5 py-[2px] rounded-full" style={{ background: TINT, color: CORAL }}>Soon</span>}
                    </span>
                    <span className="text-[11.5px] font-semibold" style={{ color: c.live ? INK : TERT }}>{c.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-[11px] mt-3.5" style={{ color: '#B6AEA5' }}>Training, boarding & pet taxi — coming later this year</p>

            {/* Next up */}
            {nextUp && (
              <button onClick={() => { setSegment('Bookings'); setBkFilter('upcoming'); setExpanded(nextUp.id); }} className="w-full mt-5 bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
                <img src={nextUp.photo} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-bold truncate" style={{ color: INK }}>{nextUp.service} · {nextUp.provider}</div>
                  <div className="text-[11.5px] mt-0.5 font-semibold" style={{ color: CORAL }}>{nextUp.date}</div>
                </div>
                <span className="text-[10.5px] font-bold px-2 py-[3px] rounded-full shrink-0" style={{ background: statusTone(nextUp.status).bg, color: statusTone(nextUp.status).c }}>{nextUp.status}</span>
                <ChevronRight size={15} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />
              </button>
            )}

            {/* Featured */}
            <SectionLabel action="See all" onAction={() => { setSort('Recommended'); setView({ kind: 'browse', cat: 'walking' }); }}>Featured near you</SectionLabel>
            <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1" style={{ scrollbarWidth: 'none' }}>
              {DETAILED.filter((p) => p.recommended).map((p) => (
                <button key={p.id} onClick={() => openProfile(p.id, 'home')} className="shrink-0 bg-white rounded-[18px] p-3 text-left active:scale-[0.98] transition-transform" style={{ width: 150, boxShadow: SHADOW }}>
                  <div className="relative">
                    <img src={p.photo} alt={p.name} className="w-full h-[92px] rounded-[13px] object-cover" />
                    {p.today && <span className="absolute top-2 left-2 inline-flex items-center gap-1 pl-1.5 pr-2 py-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.92)' }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /><span className="text-[9px] font-bold" style={{ color: GREEN }}>Today</span></span>}
                  </div>
                  <div className="flex items-center gap-1 mt-2"><span className="text-[13px] font-bold truncate" style={{ color: INK }}>{p.name}</span>{p.verified && <BadgeCheck size={12} color={CORAL} strokeWidth={2.2} className="shrink-0" />}</div>
                  <div className="text-[10.5px] mt-0.5" style={{ color: TERT }}>{p.cat === 'sitting' ? 'Pet sitter' : 'Dog walker'}</div>
                  <div className="flex items-center justify-between mt-1.5"><Rating p={p} /><span className="text-[11px] font-bold" style={{ color: INK }}>CHF {p.price}</span></div>
                </button>
              ))}
            </div>

            {/* Book again */}
            {lastDone && (
              <>
                <SectionLabel>Book again</SectionLabel>
                <div className="bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-3" style={{ boxShadow: SHADOW }}>
                  <img src={lastDone.photo} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-bold truncate" style={{ color: INK }}>{lastDone.service} · {lastDone.provider}</div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>Last time {lastDone.date.split(' · ')[0]}</div>
                  </div>
                  <button onClick={() => { const p = PROVIDERS.find((x) => x.name === lastDone.provider); if (p) openProfile(p.id, 'home'); }} className="shrink-0 inline-flex items-center gap-1.5 px-3 h-9 rounded-full active:scale-95 transition-transform" style={{ background: TINT }}><Repeat size={13} color={CORAL} strokeWidth={2.4} /><span className="text-[12.5px] font-bold" style={{ color: CORAL }}>Rebook</span></button>
                </div>
              </>
            )}

            {/* Refer & earn — ties into Wallet credits */}
            <div className="rounded-[18px] mt-6 p-4 flex items-center gap-3.5" style={{ background: TINT }}>
              <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center shrink-0"><Gift size={19} color={CORAL} strokeWidth={2} /></span>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-bold" style={{ color: INK }}>Give CHF 10, get CHF 10</div>
                <div className="text-[11.5px] mt-0.5" style={{ color: MUTED }}>Invite a friend — credits land in your wallet.</div>
              </div>
              <button onClick={() => act('Invite friends')} className="shrink-0 px-3.5 h-9 rounded-full bg-white active:scale-95 transition-transform"><span className="text-[12.5px] font-bold" style={{ color: CORAL }}>Invite</span></button>
            </div>
          </>
        )}

        {/* ── BOOKINGS ── */}
        {segment === 'Bookings' && (
          <>
            {/* summary */}
            <div className="rounded-[16px] bg-white flex items-center py-3.5 mt-4" style={{ boxShadow: SHADOW }}>
              {[{ v: String(upcoming.length), l: 'Upcoming' }, { v: `CHF ${monthTotal}`, l: 'This month', accent: true }, { v: bookings.filter((b) => b.status === 'Pending').length + ' pending', l: 'Awaiting reply' }].map((s, i) => (
                <div key={s.l} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid ' + LINE : 'none' }}>
                  <span className="text-[15px] font-extrabold tabular-nums leading-none" style={{ color: s.accent ? CORAL : INK }}>{s.v}</span>
                  <span className="text-[10px] font-medium mt-1.5" style={{ color: TERT }}>{s.l}</span>
                </div>
              ))}
            </div>

            {/* minimal upcoming/past toggle */}
            <div className="flex items-center gap-5 mt-5 ml-1.5">
              {[{ id: 'upcoming', l: 'Upcoming' }, { id: 'past', l: 'Past' }].map((f) => {
                const on = bkFilter === f.id;
                return <button key={f.id} onClick={() => setBkFilter(f.id)} className="relative pb-1.5 text-[13.5px] font-bold transition-colors" style={{ color: on ? INK : TERT }}>{f.l}{on && <span className="absolute left-0 right-0 bottom-0 rounded-full" style={{ height: 2, background: CORAL }} />}</button>;
              })}
            </div>

            {/* grouped transaction-style rows */}
            {[...new Set(bookings.filter((b) => b.when === bkFilter).map((b) => b.group))].map((grp) => {
              const items = bookings.filter((b) => b.when === bkFilter && b.group === grp);
              return (
                <div key={grp}>
                  <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] mb-2 mt-5 ml-1.5" style={{ color: '#A8A29C' }}>{grp}</div>
                  <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                    {items.map((b, i) => {
                      const tone = statusTone(b.status);
                      const open = expanded === b.id;
                      const isUp = b.when === 'upcoming';
                      return (
                        <div key={b.id} className="relative">
                          <button onClick={() => setExpanded(open ? null : b.id)} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02] transition-colors">
                            <img src={b.photo} alt={b.provider} className="w-10 h-10 rounded-full object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="text-[13.5px] font-bold truncate" style={{ color: INK }}>{b.service}</div>
                              <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{b.provider} · {b.date.split(' · ')[0]}{b.date.includes('·') ? ` · ${b.date.split(' · ')[1]}` : ''}</div>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <span className="text-[13.5px] font-extrabold tabular-nums" style={{ color: INK }}>{b.total ? `CHF ${b.total}` : '—'}</span>
                              <span className="text-[9.5px] font-bold px-1.5 py-[2px] rounded-full" style={{ background: tone.bg, color: tone.c }}>{b.status}</span>
                            </div>
                          </button>
                          {open && (
                            <div className="px-3.5 pb-3.5" style={{ borderTop: '1px solid ' + LINE }}>
                              <div className="flex flex-col gap-2 pt-3">
                                {b.location && <div className="flex items-center gap-2"><MapPin size={13} color={TERT} strokeWidth={2} /><span className="text-[12.5px]" style={{ color: MUTED }}>{b.location}</span></div>}
                                <div className="flex items-center gap-2"><span className="w-[13px] text-center text-[11px]">🐾</span><span className="text-[12.5px]" style={{ color: MUTED }}>For {b.pet}</span></div>
                                {b.notes && <div className="text-[12.5px] leading-[1.45] rounded-[10px] px-3 py-2" style={{ background: PEACH, color: MUTED }}>{b.notes}</div>}
                              </div>
                              <div className="flex gap-2 mt-3">
                                {isUp ? (
                                  <>
                                    <button onClick={() => act(`Message ${b.provider.split(' ')[0]}`)} className="flex-1 h-10 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98] bg-white" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}><MessageCircle size={14} color={INK} strokeWidth={2} /><span className="text-[13px] font-bold" style={{ color: INK }}>Message</span></button>
                                    <button onClick={() => act('Reschedule')} className="flex-1 h-10 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ background: TINT }}><CalendarClock size={14} color={CORAL} strokeWidth={2} /><span className="text-[13px] font-bold" style={{ color: CORAL }}>Reschedule</span></button>
                                  </>
                                ) : (
                                  <button onClick={() => { const p = PROVIDERS.find((x) => x.name === b.provider); if (p) openProfile(p.id, 'home'); else act('Book again'); }} className="flex-1 h-10 rounded-[12px] flex items-center justify-center active:scale-[0.98]" style={{ background: TINT }}><span className="text-[13px] font-bold" style={{ color: CORAL }}>Book again</span></button>
                                )}
                              </div>
                            </div>
                          )}
                          {i < items.length - 1 && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: LINE }} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {!bookings.filter((b) => b.when === bkFilter).length && (
              <div className="flex flex-col items-center text-center mt-14 px-8">
                <span className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: PEACH }}><CalendarClock size={22} color={TERT} strokeWidth={2} /></span>
                <div className="text-[15px] font-bold" style={{ color: INK }}>No {bkFilter} bookings</div>
                <p className="text-[13px] mt-1" style={{ color: TERT }}>Book a walk or sitting from Discover.</p>
              </div>
            )}
          </>
        )}

        {/* ── SAVED ── */}
        {segment === 'Saved' && (
          <>
            {savedProviders.length > 0 ? (
              <div className="flex flex-col gap-2.5 mt-4">
                {savedProviders.map((p) => (
                  <div key={p.id} className="bg-white rounded-[18px] px-3.5 py-3 flex items-center gap-3" style={{ boxShadow: SHADOW }}>
                    <button onClick={() => openProfile(p.id, 'home')} className="flex items-center gap-3 flex-1 min-w-0 text-left active:opacity-80">
                      <span className="relative shrink-0">
                        <img src={p.photo} alt={p.name} className="w-11 h-11 rounded-full object-cover" />
                        {p.today && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: GREEN, border: '2px solid #fff' }} />}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1"><span className="text-[14px] font-semibold truncate" style={{ color: INK }}>{p.name}</span>{p.verified && <BadgeCheck size={13} color={CORAL} strokeWidth={2.2} className="shrink-0" />}</div>
                        <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{p.cat === 'sitting' ? 'Pet sitter' : 'Dog walker'} · {p.dist} km{p.today ? ' · today' : ''}</div>
                        <div className="mt-1"><Rating p={p} /></div>
                      </div>
                    </button>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <button onClick={() => toggleSave(p.id)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90" style={{ background: TINT }}><Heart size={14} color={CORAL} fill={CORAL} strokeWidth={2} /></button>
                      <button onClick={() => openProfile(p.id, 'home')} className="px-3 h-8 rounded-full active:scale-95 transition-transform" style={{ background: CORAL }}><span className="text-[12px] font-bold text-white">Book</span></button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center mt-14 px-8">
                <span className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: PEACH }}><Heart size={22} color={TERT} strokeWidth={2} /></span>
                <div className="text-[15px] font-bold" style={{ color: INK }}>Nothing saved yet</div>
                <p className="text-[13px] mt-1" style={{ color: TERT }}>Tap the heart on a provider to keep them here.</p>
              </div>
            )}
            {suggestions.length > 0 && (
              <>
                <SectionLabel>You might also like</SectionLabel>
                <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                  {suggestions.map((p, i) => (
                    <div key={p.id} className="relative">
                      <button onClick={() => openProfile(p.id, 'home')} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02]">
                        <img src={p.photo} alt={p.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1"><span className="text-[13.5px] font-semibold truncate" style={{ color: INK }}>{p.name}</span>{p.verified && <BadgeCheck size={12} color={CORAL} strokeWidth={2.2} className="shrink-0" />}</div>
                          <div className="mt-[3px]"><Rating p={p} /></div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); toggleSave(p.id); }} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 shrink-0" style={{ background: PEACH }}><Heart size={14} color={MUTED} strokeWidth={2} /></button>
                      </button>
                      {i < suggestions.length - 1 && <div className="absolute bottom-0 left-[58px] right-0 h-px" style={{ background: LINE }} />}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {toast && <Toast embedded={embedded} msg={toast} />}
      {!embedded && <PreviewHeader />}
    </Wrap>
  );
};

const Toast = ({ embedded, msg }) => (
  <div className="absolute left-1/2 z-[200] px-4 py-2.5 rounded-full" style={{ bottom: embedded ? 108 : 38, transform: 'translateX(-50%)', background: INK, animation: 'svToast 0.2s ease both' }}><span className="text-[13px] font-semibold text-white whitespace-nowrap">{msg}</span></div>
);

const Wrap = ({ embedded, children }) => {
  const styleBlock = <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@800&display=swap');
    @keyframes svToast { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
  `}</style>;
  if (embedded) return (<>{styleBlock}<div className="absolute inset-0" style={{ background: CREAM }}>{children}</div></>);
  return (
    <>{styleBlock}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          <StatusBar />
          {children}
        </div>
      </div>
    </>
  );
};

export default ServicesV2;
