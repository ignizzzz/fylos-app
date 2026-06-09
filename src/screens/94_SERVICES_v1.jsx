import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Bell, Search, Footprints, Home, Scissors, Stethoscope,
  Star, Heart, ChevronRight, ChevronLeft, ChevronDown, MapPin, MessageCircle,
  CalendarClock, X, Check, BadgeCheck, Repeat, Gift, Sparkles, GraduationCap,
  Sun, Car, DoorOpen, Camera, Apple,
} from 'lucide-react';

/**
 * 94_SERVICES_v1.jsx — Services tab v4.
 * Discover is the single, calm home (no top segment trio). Bookings and
 * Saved are full sub-screens reached from within the flow. Bookings shows
 * no money (calendar-tile rows). Saved is a photo grid. Category browse
 * uses marketplace-style cards (Airbnb/Uber), not contact rows.
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
    stats: [['530', 'walks'], ['92%', 'repeat'], ['~1 h', 'reply']], meta: '530 walks · replies in ~1 h', bio: 'Full-time walker in Seefeld. Calm energy, great with reactive dogs, photo updates on every walk.',
    services: [{ n: '30 min walk', p: 14 }, { n: '60 min walk', p: 22 }, { n: '90 min walk', p: 33 }],
    review: { who: 'Anna M.', txt: 'Leo comes back happy and tired every single time. Lukas sends the best photo updates.' } },
  { id: 'pr3', cat: 'sitting', name: 'Maria K.', rating: 4.8, reviews: 96, dist: 0.5, price: 38, photo: 'https://i.pravatar.cc/150?u=maria_sitter', verified: true, today: true, recommended: true,
    stats: [['210', 'stays'], ['88%', 'repeat'], ['~30 m', 'reply']], meta: '210 stays · replies in ~30 m', bio: 'Your pet stays at my quiet flat by the lake — daily walks, couch privileges included.',
    services: [{ n: 'Day sitting', p: 25 }, { n: 'Overnight', p: 38 }, { n: 'Week package', p: 240 }],
    review: { who: 'Julia S.', txt: 'Tao was so relaxed when we got back. Daily photos and a little diary — adorable.' } },
  { id: 'pr6', cat: 'walking', name: 'Jonas W.', rating: 4.8, reviews: 84, dist: 2.3, price: 24, photo: 'https://i.pravatar.cc/150?u=jonas_walker', verified: true, today: false, recommended: true,
    stats: [['310', 'walks'], ['90%', 'repeat'], ['~2 h', 'reply']], meta: '310 walks · replies in ~2 h', bio: 'Trail runner — perfect for high-energy dogs that need real exercise.',
    services: [{ n: '60 min run', p: 24 }, { n: '90 min trail', p: 36 }],
    review: { who: 'Felix H.', txt: 'Our husky finally gets the workout he needs.' } },
  { id: 'pr5', cat: 'walking', name: 'Nina T.', rating: 4.7, reviews: 58, dist: 1.6, price: 19, photo: 'https://i.pravatar.cc/150?u=nina_walker', verified: false, today: true, recommended: false,
    stats: [['160', 'walks'], ['81%', 'repeat'], ['~3 h', 'reply']], meta: '160 walks · replies in ~3 h', bio: 'Student & lifelong dog person. Energetic walks, parks and trails.',
    services: [{ n: '30 min walk', p: 12 }, { n: '60 min walk', p: 19 }],
    review: { who: 'Petra K.', txt: 'Great with our young lab — comes back perfectly tired.' } },
];
const NAMES = ['Elena B.', 'Marc S.', 'Tina R.', 'David K.', 'Laura M.', 'Pascal H.', 'Mia W.', 'Noah B.', 'Lea F.', 'Tim G.', 'Sara J.', 'Luca P.', 'Nora E.', 'Jan D.', 'Amélie C.', 'Ben T.', 'Chiara V.', 'Felix N.', 'Ida M.', 'Oskar L.', 'Zoe A.', 'Liam K.', 'Emma S.', 'Paul W.', 'Lina H.', 'Aaron Z.', 'Maja Q.', 'Leon X.'];
const GENERATED = NAMES.map((name, i) => {
  const rating = (4.2 + ((i * 7) % 8) / 10).toFixed(1);
  const price = 15 + ((i * 3) % 14);
  const walks = 40 + ((i * 11) % 400);
  const reply = ['~1 h', '~2 h', '~30 m', '~3 h'][i % 4];
  return {
    id: 'gw' + i, cat: i % 4 === 3 ? 'sitting' : 'walking', name, rating: parseFloat(rating), reviews: 12 + ((i * 13) % 90), dist: +(0.4 + ((i * 5) % 40) / 10).toFixed(1), price,
    photo: `https://i.pravatar.cc/150?u=fylos_walker_${i}`, verified: i % 3 !== 1, today: i % 2 === 0, recommended: false,
    stats: [[String(walks), 'walks'], [`${78 + ((i * 5) % 20)}%`, 'repeat'], [reply, 'reply']], meta: `${walks} walks · replies in ${reply}`,
    bio: 'Local, vetted and insured through fylos. Flexible with schedules and happy to meet beforehand.',
    services: [{ n: '30 min walk', p: Math.round(price * 0.65) }, { n: '60 min walk', p: price }, { n: '90 min walk', p: Math.round(price * 1.5) }],
    review: { who: 'fylos member', txt: 'Reliable and kind — booking again.' },
  };
});
const PROVIDERS = [...DETAILED, ...GENERATED];

const INITIAL_BOOKINGS = [
  { id: 'b1', when: 'upcoming', group: 'This week', status: 'Confirmed', service: 'Grooming', provider: 'Sofia Lambrou', photo: 'https://i.pravatar.cc/150?u=sofia_walker', dow: 'MON', dom: '16', time: '10:00', pet: 'Leo', location: 'Sofia’s studio · Niederdorf', notes: 'Full groom — wash, trim, nails.' },
  { id: 'b2', when: 'upcoming', group: 'This week', status: 'Confirmed', service: 'Grooming', provider: 'Bright Paws · Elena', photo: 'https://i.pravatar.cc/150?u=elena_groomer', dow: 'WED', dom: '18', time: '15:30', pet: 'Leo', location: 'Bright Paws · Seefeld', notes: 'Bath, blow-dry & style with Elena.' },
  { id: 'b3', when: 'upcoming', group: 'This week', status: 'Confirmed', service: 'Vet visit', provider: 'Lakeshore Vet · Dr. Reza', photo: 'https://i.pravatar.cc/150?u=dr_reza', dow: 'FRI', dom: '20', time: '09:00', pet: 'Leo', location: 'Lakeshore Vet · Bellevue', notes: 'Annual checkup & vaccinations.' },
  { id: 'b4', when: 'upcoming', group: 'Next week', status: 'Pending', service: '90 min walk', provider: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker', dow: 'TUE', dom: '24', time: '14:00', pet: 'Leo', location: 'Pickup at home', notes: 'Waiting for Lukas to confirm.' },
  { id: 'b5', when: 'past', group: 'February', status: 'Completed', service: '60 min walk', provider: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker', dow: 'FRI', dom: '6', time: '09:00', pet: 'Leo', location: 'Zürichhorn loop', notes: '', rated: 5,
    checkIns: [['09:02', 'Picked up Leo at home'], ['09:25', 'Halfway — photo update sent'], ['09:58', 'Walk done · 45 min · 3.2 km'], ['10:04', 'Dropped off, fresh water topped up']] },
  { id: 'b6', when: 'past', group: 'January', status: 'Cancelled', service: 'Overnight sitting', provider: 'Maria K.', photo: 'https://i.pravatar.cc/150?u=maria_sitter', dow: 'SAT', dom: '31', time: '', pet: 'Tao', location: '', notes: 'Cancelled by you.' },
];
const SORTS = ['Recommended', 'Top rated', 'Price: low to high', 'Nearest'];
const DAYS = ['Today', 'Tomorrow', 'Sat 14'];
const TIMES = ['09:00', '11:00', '14:00', '16:30'];
// Per-day open slots (indexes into TIMES) — makes availability feel real
const SLOTS = { 0: [1, 2, 3], 1: [0, 1, 3], 2: [0, 2] };
const FUTURE_SERVICES = [
  { label: 'Training', icon: GraduationCap },
  { label: 'Boarding', icon: Home },
  { label: 'Daycare', icon: Sun },
  { label: 'Pet taxi', icon: Car },
  { label: 'Drop-ins', icon: DoorOpen },
  { label: 'Photos', icon: Camera },
  { label: 'Nutrition', icon: Apple },
];
// Bookings mini-calendar: a fortnight the arrows can walk through
const CAL_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => ({ d, n: 16 + i }));

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

const SectionLabel = ({ children, action, onAction, mt = 'mt-6' }) => (
  <div className={`flex items-center justify-between mb-2 ml-1.5 mr-0.5 ${mt}`}>
    <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A8A29C' }}>{children}</span>
    {action && <button onClick={onAction} className="text-[12px] font-bold active:opacity-60" style={{ color: CORAL }}>{action}</button>}
  </div>
);

const Rating = ({ p, small }) => (
  <span className="inline-flex items-center gap-1"><Star size={small ? 10 : 11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} /><span className={small ? 'text-[11px] font-bold' : 'text-[11.5px] font-bold'} style={{ color: INK }}>{p.rating}</span><span className={small ? 'text-[10px]' : 'text-[11px]'} style={{ color: TERT }}>({p.reviews})</span></span>
);

const statusTone = (s) => s === 'Confirmed' ? { bg: '#EAF7EF', c: GREEN } : s === 'Pending' ? { bg: '#FBF1E2', c: AMBER } : s === 'Cancelled' ? { bg: '#FEE8E7', c: DANGER } : { bg: PEACH, c: MUTED };
const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || 'Providers';

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

const Toast = ({ embedded, msg }) => (
  <div className="absolute left-1/2 z-[200] px-4 py-2.5 rounded-full" style={{ bottom: embedded ? 108 : 38, transform: 'translateX(-50%)', background: INK, animation: 'svToast 0.2s ease both' }}><span className="text-[13px] font-semibold text-white whitespace-nowrap">{msg}</span></div>
);

const Wrap = ({ embedded, children }) => {
  const styleBlock = <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@800&display=swap');
    @keyframes svToast { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes svFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes svSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
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

const ServicesV2 = ({ embedded = false, initialSegment = 'discover', focusedBookingId = null, onClearFocus, onSubScreenChange }) => {
  const [view, setView] = useState(focusedBookingId || initialSegment === 'bookings' ? { kind: 'bookings' } : { kind: 'home' });
  const [sort, setSort] = useState('Recommended');
  const [sortOpen, setSortOpen] = useState(false);
  const [pet, setPet] = useState('leo');
  const [saved, setSaved] = useState(['pr1', 'pr3', 'pr6']);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [bkFilter, setBkFilter] = useState('upcoming');
  const [expanded, setExpanded] = useState(focusedBookingId);
  const [svc, setSvc] = useState(1);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(1);
  const [calStart, setCalStart] = useState(0);
  const [futureOpen, setFutureOpen] = useState(false);
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
  const suggestions = PROVIDERS.filter((p) => !saved.includes(p.id) && p.verified).slice(0, 2);

  const openProfile = (id, from) => { setSvc(1); setDay(0); setTime(1); setView({ kind: 'profile', id, from }); };
  const profileP = view.kind === 'profile' ? PROVIDERS.find((p) => p.id === view.id) : null;

  const browseAll = view.kind === 'browse' ? PROVIDERS.filter((p) => p.cat === view.cat) : [];
  const browseRec = browseAll.filter((p) => p.recommended);
  const browseRest = [...browseAll.filter((p) => !p.recommended)].sort((a, b) =>
    sort === 'Top rated' ? b.rating - a.rating : sort === 'Price: low to high' ? a.price - b.price : sort === 'Nearest' ? a.dist - b.dist : b.rating * b.reviews - a.rating * a.reviews);

  const requestBooking = (p, svcSel, daySel, timeSel) => {
    const id = 'b' + Math.floor(Math.random() * 100000);
    setBookings((prev) => [{ id, when: 'upcoming', group: 'This week', status: 'Pending', service: svcSel.n, provider: p.name, photo: p.photo, dow: daySel === 'Today' ? 'TODAY' : daySel === 'Tomorrow' ? 'TMRW' : 'SAT', dom: daySel === 'Sat 14' ? '14' : '', time: timeSel, pet: petName, location: 'Pickup at home', notes: `Waiting for ${p.name.split(' ')[0]} to confirm.` }, ...prev]);
    setView({ kind: 'bookings' }); setBkFilter('upcoming'); setExpanded(id);
    act('Request sent — waiting for confirmation');
  };

  /* ───────── PROVIDER PROFILE (full screen) ───────── */
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
            <div className="text-[12.5px] mt-0.5" style={{ color: MUTED }}>{p.cat === 'sitting' ? 'Pet sitter' : 'Dog walker'} · {p.dist} km away{p.today ? ' · Available today' : ''}</div>
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
          <div className="flex gap-2">{DAYS.map((d, i) => {
            const on = day === i;
            const free = (SLOTS[i] || []).length;
            return (
              <button key={d} onClick={() => { setDay(i); const s = SLOTS[i] || []; if (!s.includes(time)) setTime(s[0] ?? 0); }} className="flex-1 rounded-[12px] py-2 active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : '#fff', boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>
                <div className="text-[13px] font-bold leading-tight" style={{ color: on ? CORAL : MUTED }}>{d}</div>
                <div className="text-[9.5px] font-semibold mt-[2px]" style={{ color: on ? CORAL : '#C4BBB0' }}>{free} slot{free === 1 ? '' : 's'}</div>
              </button>
            );
          })}</div>
          <div className="flex gap-2 mt-2">{TIMES.map((t, i) => {
            const openSlot = (SLOTS[day] || []).includes(i);
            const on = time === i && openSlot;
            return (
              <button key={t} onClick={() => openSlot && setTime(i)} disabled={!openSlot} className="flex-1 h-[38px] rounded-[11px] text-[12.5px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : openSlot ? '#fff' : 'transparent', color: on ? CORAL : openSlot ? MUTED : '#D3CABF', boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : openSlot ? SHADOW : 'inset 0 0 0 1px #EAE2D8', textDecoration: openSlot ? 'none' : 'line-through' }}>{t}</button>
            );
          })}</div>

          <SectionLabel action={`See all (${p.reviews})`} onAction={() => act(`All ${p.reviews} reviews`)}>Latest review</SectionLabel>
          <div className="rounded-[16px] bg-white px-4 py-3.5" style={{ boxShadow: SHADOW }}>
            <div className="flex items-center gap-1.5 mb-1.5">{[...Array(5)].map((_, i) => <Star key={i} size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} />)}<span className="text-[11.5px] font-bold ml-1" style={{ color: INK }}>{p.review.who}</span></div>
            <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>“{p.review.txt}”</p>
          </div>
        </div>

        <SubHeader title={p.name} sub={`${catLabel(p.cat)} · ${p.dist} km`} onBack={() => setView(view.from === 'browse' ? { kind: 'browse', cat: p.cat } : view.from === 'saved' ? { kind: 'saved' } : view.from === 'bookings' ? { kind: 'bookings' } : { kind: 'home' })}
          right={<button onClick={() => toggleSave(p.id)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 shrink-0" style={{ background: isSaved ? TINT : '#fff', boxShadow: isSaved ? 'none' : '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><Heart size={16} color={isSaved ? CORAL : MUTED} fill={isSaved ? CORAL : 'none'} strokeWidth={2} /></button>} />

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

  /* ───────── CATEGORY BROWSE — marketplace cards ───────── */
  if (view.kind === 'browse') {
    return (
      <Wrap embedded={embedded}>
        <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 116, paddingBottom: embedded ? 104 : 36, scrollbarWidth: 'none', background: CREAM }} onClick={() => sortOpen && setSortOpen(false)}>
          {browseRec.length > 0 && (
            <>
              <SectionLabel mt="mt-0">Recommended for {petName}</SectionLabel>
              <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1" style={{ scrollbarWidth: 'none' }}>
                {browseRec.map((p) => (
                  <button key={p.id} onClick={() => openProfile(p.id, 'browse')} className="shrink-0 bg-white rounded-[18px] p-3 text-left active:scale-[0.98] transition-transform" style={{ width: 150, boxShadow: SHADOW }}>
                    <div className="relative">
                      <img src={p.photo} alt={p.name} className="w-full h-[92px] rounded-[13px] object-cover" />
                      {p.today && <span className="absolute top-2 left-2 inline-flex items-center gap-1 pl-1.5 pr-2 py-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.92)' }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /><span className="text-[9px] font-bold" style={{ color: GREEN }}>Today</span></span>}
                    </div>
                    <div className="flex items-center gap-1 mt-2"><span className="text-[13px] font-bold truncate" style={{ color: INK }}>{p.name}</span>{p.verified && <BadgeCheck size={12} color={CORAL} strokeWidth={2.2} className="shrink-0" />}</div>
                    <div className="flex items-center justify-between mt-1"><Rating p={p} small /><span className="text-[11px] font-bold" style={{ color: INK }}>CHF {p.price}</span></div>
                  </button>
                ))}
              </div>
            </>
          )}

          <div className="flex items-center justify-between mt-7 mb-2.5 ml-1.5 mr-0.5 relative">
            <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A8A29C' }}>All · {browseRest.length}</span>
            <button onClick={(e) => { e.stopPropagation(); setSortOpen(!sortOpen); }} className="inline-flex items-center gap-1 text-[12.5px] font-bold active:opacity-70" style={{ color: INK }}>
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

          {/* Marketplace cards — separate, photo-led, key facts */}
          <div className="flex flex-col gap-3">
            {browseRest.map((p) => (
              <button key={p.id} onClick={() => openProfile(p.id, 'browse')} className="bg-white rounded-[18px] p-3 flex gap-3.5 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
                <img src={p.photo} alt={p.name} className="w-[76px] h-[76px] rounded-[15px] object-cover shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-[14.5px] font-bold truncate" style={{ color: INK }}>{p.name}</span>
                    {p.verified && <BadgeCheck size={13} color={CORAL} strokeWidth={2.2} className="shrink-0" />}
                    <span className="flex-1" />
                    {p.rating >= 4.8 && <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase tracking-[0.03em] px-1.5 py-[2px] rounded-full shrink-0" style={{ background: '#FBF1E2', color: AMBER }}><Star size={8} color={AMBER} fill={AMBER} strokeWidth={0} /> Top rated</span>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-[3px]">
                    <Rating p={p} small />
                    <span className="text-[11px]" style={{ color: TERT }}>· {p.dist} km</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid ' + LINE }}>
                    {p.today ? <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: GREEN }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /> Available today</span> : <span className="text-[11px] font-medium" style={{ color: TERT }}>Next: tomorrow</span>}
                    <span className="text-[12.5px] font-extrabold" style={{ color: INK }}><span className="text-[10.5px] font-semibold" style={{ color: TERT }}>from </span>CHF {p.services[0].p}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <SubHeader title={catLabel(view.cat)} sub={`${browseAll.length} providers near you`} onBack={() => { setSortOpen(false); setView({ kind: 'home' }); }} />
        {toast && <Toast embedded={embedded} msg={toast} />}
      </Wrap>
    );
  }

  /* ───────── BOOKINGS (full screen, no money) ───────── */
  if (view.kind === 'bookings') {
    const list = bookings.filter((b) => b.when === bkFilter);
    const groups = [...new Set(list.map((b) => b.group))];
    return (
      <Wrap embedded={embedded}>
        <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 116, paddingBottom: embedded ? 104 : 36, scrollbarWidth: 'none', background: CREAM }}>
          {/* minimal toggle */}
          <div className="flex items-center gap-5 ml-1.5">
            {[{ id: 'upcoming', l: 'Upcoming' }, { id: 'past', l: 'Past' }].map((f) => {
              const on = bkFilter === f.id;
              return <button key={f.id} onClick={() => setBkFilter(f.id)} className="relative pb-1.5 text-[13.5px] font-bold transition-colors" style={{ color: on ? INK : TERT }}>{f.l}{on && <span className="absolute left-0 right-0 bottom-0 rounded-full" style={{ height: 2, background: CORAL }} />}</button>;
            })}
          </div>

          {/* Week at a glance — arrows walk the calendar day by day */}
          {bkFilter === 'upcoming' && (
            <div className="bg-white rounded-[16px] pl-1 pr-1 py-3 mt-4 flex items-center" style={{ boxShadow: SHADOW }}>
              <button onClick={() => setCalStart(Math.max(0, calStart - 1))} disabled={calStart === 0} className="w-7 h-9 flex items-center justify-center shrink-0 active:scale-90 transition-transform" style={{ opacity: calStart === 0 ? 0.3 : 1 }}><ChevronLeft size={15} color={MUTED} strokeWidth={2.4} /></button>
              <div className="flex-1 flex justify-between">
                {CAL_DAYS.slice(calStart, calStart + 7).map((day, i) => {
                  const has = bookings.some((b) => b.when === 'upcoming' && b.dom === String(day.n));
                  return (
                    <div key={i} className="flex flex-col items-center gap-1 rounded-[10px] px-1.5 py-1.5" style={{ background: has ? TINT : 'transparent', minWidth: 34 }}>
                      <span className="text-[9px] font-bold" style={{ color: has ? CORAL : '#C4BBB0' }}>{day.d}</span>
                      <span className="text-[13px] font-extrabold leading-none" style={{ color: has ? INK : TERT }}>{day.n <= 28 ? day.n : day.n - 28}</span>
                      <span className="w-1 h-1 rounded-full" style={{ background: has ? CORAL : 'transparent' }} />
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setCalStart(Math.min(CAL_DAYS.length - 7, calStart + 1))} disabled={calStart >= CAL_DAYS.length - 7} className="w-7 h-9 flex items-center justify-center shrink-0 active:scale-90 transition-transform" style={{ opacity: calStart >= CAL_DAYS.length - 7 ? 0.3 : 1 }}><ChevronRight size={15} color={MUTED} strokeWidth={2.4} /></button>
            </div>
          )}

          {groups.map((grp) => {
            const items = list.filter((b) => b.group === grp);
            return (
              <div key={grp}>
                <SectionLabel mt="mt-5">{grp}</SectionLabel>
                <div className="flex flex-col gap-2.5">
                  {items.map((b) => {
                    const tone = statusTone(b.status);
                    const open = expanded === b.id;
                    const isUp = b.when === 'upcoming';
                    return (
                      <div key={b.id} className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                        <button onClick={() => setExpanded(open ? null : b.id)} className="w-full flex items-center gap-3 px-3 py-3 text-left active:bg-black/[0.02] transition-colors">
                          {/* calendar tile */}
                          <span className="w-[46px] h-[50px] rounded-[12px] flex flex-col items-center justify-center shrink-0" style={{ background: isUp ? TINT : PEACH }}>
                            <span className="text-[8.5px] font-extrabold tracking-[0.08em]" style={{ color: isUp ? CORAL : TERT }}>{b.dow}</span>
                            <span className="text-[17px] font-extrabold leading-tight" style={{ color: isUp ? INK : MUTED }}>{b.dom || '–'}</span>
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-bold truncate" style={{ color: INK }}>{b.service}</div>
                            <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{b.provider}{b.time ? ` · ${b.time}` : ''}</div>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10.5px] font-bold" style={{ color: tone.c }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: tone.c }} />{b.status}</span>
                          </div>
                          <img src={b.photo} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                          <ChevronRight size={15} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.18s' }} />
                        </button>
                        {open && (
                          <div className="px-3.5 pb-3.5" style={{ borderTop: '1px solid ' + LINE }}>
                            <div className="flex flex-col gap-2 pt-3">
                              {b.location && (
                                <div className="flex items-center gap-2">
                                  <MapPin size={13} color={TERT} strokeWidth={2} className="shrink-0" />
                                  <span className="flex-1 text-[12.5px]" style={{ color: MUTED }}>{b.location}</span>
                                  {b.location !== 'Pickup at home' && <button onClick={(e) => { e.stopPropagation(); act('Opening in Maps…'); }} className="shrink-0 text-[11.5px] font-bold px-2.5 py-1 rounded-full active:scale-95" style={{ background: TINT, color: CORAL }}>Open</button>}
                                </div>
                              )}
                              <div className="flex items-center gap-2"><span className="w-[13px] text-center text-[11px]">🐾</span><span className="text-[12.5px]" style={{ color: MUTED }}>For {b.pet}</span></div>
                              {isUp && <div className="flex items-center gap-2"><Bell size={12} color={TERT} strokeWidth={2} className="shrink-0" /><span className="text-[12px]" style={{ color: TERT }}>Reminder · 1 h before</span></div>}
                              {b.notes && <div className="text-[12.5px] leading-[1.45] rounded-[10px] px-3 py-2" style={{ background: PEACH, color: MUTED }}>{b.notes}</div>}
                              {b.checkIns && (
                                <div className="rounded-[12px] px-3.5 py-3 mt-0.5" style={{ background: PEACH }}>
                                  <div className="text-[10px] font-bold uppercase tracking-[0.1em] mb-2.5" style={{ color: '#A8A29C' }}>How it went</div>
                                  {b.checkIns.map(([t, txt], ci) => (
                                    <div key={ci} className="flex gap-2.5 relative">
                                      <div className="flex flex-col items-center shrink-0" style={{ width: 10 }}>
                                        <span className="w-[7px] h-[7px] rounded-full mt-[5px]" style={{ background: CORAL }} />
                                        {ci < b.checkIns.length - 1 && <span className="flex-1 w-px my-0.5" style={{ background: '#E5D8CC' }} />}
                                      </div>
                                      <div className="pb-2.5">
                                        <span className="text-[10.5px] font-bold" style={{ color: TERT }}>{t}</span>
                                        <div className="text-[12px] font-medium leading-snug" style={{ color: MUTED }}>{txt}</div>
                                      </div>
                                    </div>
                                  ))}
                                  {b.rated && <div className="flex items-center gap-1.5 mt-1 pt-2" style={{ borderTop: '1px solid #EBDFD3' }}><span className="text-[11.5px] font-semibold" style={{ color: MUTED }}>You rated</span>{[...Array(b.rated)].map((_, si) => <Star key={si} size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} />)}</div>}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2 mt-3">
                              {isUp ? (
                                <>
                                  <button onClick={() => act(`Message ${b.provider.split(' ')[0]}`)} className="flex-1 h-10 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98] bg-white" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}><MessageCircle size={14} color={INK} strokeWidth={2} /><span className="text-[13px] font-bold" style={{ color: INK }}>Message</span></button>
                                  <button onClick={() => act('Reschedule')} className="flex-1 h-10 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ background: TINT }}><CalendarClock size={14} color={CORAL} strokeWidth={2} /><span className="text-[13px] font-bold" style={{ color: CORAL }}>Reschedule</span></button>
                                </>
                              ) : (
                                <button onClick={() => { const p = PROVIDERS.find((x) => x.name === b.provider); if (p) openProfile(p.id, 'bookings'); else act('Book again'); }} className="flex-1 h-10 rounded-[12px] flex items-center justify-center active:scale-[0.98]" style={{ background: TINT }}><span className="text-[13px] font-bold" style={{ color: CORAL }}>Book again</span></button>
                              )}
                            </div>
                            {isUp && <button onClick={() => act('Added to your calendar')} className="w-full mt-2 py-1.5 active:opacity-60"><span className="text-[12px] font-bold" style={{ color: TERT }}>＋ Add to calendar</span></button>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          {!list.length && (
            <div className="flex flex-col items-center text-center mt-16 px-8">
              <span className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: PEACH }}><CalendarClock size={22} color={TERT} strokeWidth={2} /></span>
              <div className="text-[15px] font-bold" style={{ color: INK }}>No {bkFilter} bookings</div>
              <p className="text-[13px] mt-1" style={{ color: TERT }}>Book a walk or sitting from Discover.</p>
            </div>
          )}
        </div>

        <SubHeader title="Bookings" sub={`${upcoming.length} upcoming`} onBack={() => setView({ kind: 'home' })} />
        {toast && <Toast embedded={embedded} msg={toast} />}
      </Wrap>
    );
  }

  /* ───────── SAVED (full screen, photo grid) ───────── */
  if (view.kind === 'saved') {
    return (
      <Wrap embedded={embedded}>
        <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 116, paddingBottom: embedded ? 104 : 36, scrollbarWidth: 'none', background: CREAM }}>
          {savedProviders.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {savedProviders.map((p) => (
                <button key={p.id} onClick={() => openProfile(p.id, 'saved')} className="relative bg-white rounded-[18px] p-3 text-left active:scale-[0.98] transition-transform" style={{ boxShadow: SHADOW }}>
                  <div className="relative">
                    <img src={p.photo} alt={p.name} className="w-full h-[110px] rounded-[13px] object-cover" />
                    <button onClick={(e) => { e.stopPropagation(); toggleSave(p.id); }} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center active:scale-90" style={{ background: 'rgba(255,255,255,0.94)' }}><Heart size={13} color={CORAL} fill={CORAL} strokeWidth={2} /></button>
                    {p.today && <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 pl-1.5 pr-2 py-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.92)' }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /><span className="text-[9px] font-bold" style={{ color: GREEN }}>Today</span></span>}
                  </div>
                  <div className="flex items-center gap-1 mt-2"><span className="text-[13.5px] font-bold truncate" style={{ color: INK }}>{p.name}</span>{p.verified && <BadgeCheck size={12} color={CORAL} strokeWidth={2.2} className="shrink-0" />}</div>
                  <div className="text-[10.5px] mt-0.5" style={{ color: TERT }}>{p.cat === 'sitting' ? 'Pet sitter' : 'Dog walker'} · {p.dist} km</div>
                  <div className="flex items-center justify-between mt-1.5"><Rating p={p} small /><span className="text-[11px] font-bold" style={{ color: INK }}>CHF {p.price}</span></div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center text-center mt-16 px-8">
              <span className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: PEACH }}><Heart size={22} color={TERT} strokeWidth={2} /></span>
              <div className="text-[15px] font-bold" style={{ color: INK }}>Nothing saved yet</div>
              <p className="text-[13px] mt-1" style={{ color: TERT }}>Tap the heart on a provider to keep them here.</p>
            </div>
          )}

          {suggestions.length > 0 && (
            <>
              <SectionLabel>You might also like</SectionLabel>
              <div className="flex flex-col gap-3">
                {suggestions.map((p) => (
                  <button key={p.id} onClick={() => openProfile(p.id, 'saved')} className="bg-white rounded-[18px] p-3 flex gap-3 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
                    <img src={p.photo} alt={p.name} className="w-[64px] h-[64px] rounded-[13px] object-cover shrink-0" />
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-center gap-1">
                        <span className="text-[13.5px] font-bold truncate" style={{ color: INK }}>{p.name}</span>
                        {p.verified && <BadgeCheck size={12} color={CORAL} strokeWidth={2.2} className="shrink-0" />}
                        <span className="flex-1" />
                        <button onClick={(e) => { e.stopPropagation(); toggleSave(p.id); }} className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90" style={{ background: PEACH }}><Heart size={13} color={MUTED} strokeWidth={2} /></button>
                      </div>
                      <div className="text-[11px] mt-[2px]" style={{ color: TERT }}>{p.cat === 'sitting' ? 'Pet sitter' : 'Dog walker'} · {p.dist} km</div>
                      <div className="mt-auto pt-1"><Rating p={p} small /></div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <SubHeader title="Saved" sub={`${savedProviders.length} providers`} onBack={() => setView({ kind: 'home' })} />
        {toast && <Toast embedded={embedded} msg={toast} />}
      </Wrap>
    );
  }

  /* ───────── DISCOVER (home) ───────── */
  return (
    <Wrap embedded={embedded}>
      <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 116, paddingBottom: embedded ? 104 : 36, scrollbarWidth: 'none', background: CREAM }}>
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-white rounded-[14px] px-3.5 h-[46px]" style={{ boxShadow: SHADOW }}>
          <Search size={16} color={TERT} strokeWidth={2} />
          <input placeholder={`Find care for ${petName}…`} className="flex-1 bg-transparent outline-none text-[14px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" />
          <div className="flex -space-x-1.5">
            {PETS.map((p) => { const on = pet === p.id; return <button key={p.id} onClick={() => setPet(p.id)} className="w-7 h-7 rounded-full p-[1.5px] active:scale-95 transition-all" style={{ background: on ? CORAL : '#E5DED5', zIndex: on ? 2 : 1, position: 'relative' }}><img src={p.photo} alt={p.name} className="w-full h-full rounded-full object-cover" /></button>; })}
          </div>
        </div>

        {/* Categories */}
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

        {/* My bookings + Saved — quiet entry points */}
        <div className="flex gap-3 mt-6">
          <button onClick={() => setView({ kind: 'bookings' })} className="flex-1 bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-2.5 text-left active:scale-[0.98] transition-transform" style={{ boxShadow: SHADOW }}>
            <span className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: TINT }}><CalendarClock size={16} color={CORAL} strokeWidth={2} /></span>
            <div className="flex-1 min-w-0"><div className="text-[13px] font-bold" style={{ color: INK }}>Bookings</div><div className="text-[10.5px] mt-[1px]" style={{ color: TERT }}>{upcoming.length} upcoming</div></div>
            <ChevronRight size={14} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />
          </button>
          <button onClick={() => setView({ kind: 'saved' })} className="flex-1 bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-2.5 text-left active:scale-[0.98] transition-transform" style={{ boxShadow: SHADOW }}>
            <span className="w-9 h-9 rounded-[11px] flex items-center justify-center shrink-0" style={{ background: TINT }}><Heart size={15} color={CORAL} strokeWidth={2} /></span>
            <div className="flex-1 min-w-0"><div className="text-[13px] font-bold" style={{ color: INK }}>Saved</div><div className="text-[10.5px] mt-[1px]" style={{ color: TERT }}>{saved.length} providers</div></div>
            <ChevronRight size={14} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />
          </button>
        </div>

        {/* Next up */}
        {nextUp && (
          <button onClick={() => { setBkFilter('upcoming'); setExpanded(nextUp.id); setView({ kind: 'bookings' }); }} className="w-full mt-3 bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
            <img src={nextUp.photo} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-bold truncate" style={{ color: INK }}>{nextUp.service} · {nextUp.provider}</div>
              <div className="text-[11.5px] mt-0.5 font-semibold" style={{ color: CORAL }}>{nextUp.dow === 'TODAY' ? 'Today' : `${nextUp.dow.charAt(0) + nextUp.dow.slice(1).toLowerCase()} ${nextUp.dom}`} · {nextUp.time}</div>
            </div>
            <span className="text-[10.5px] font-bold px-2 py-[3px] rounded-full shrink-0" style={{ background: statusTone(nextUp.status).bg, color: statusTone(nextUp.status).c }}>{nextUp.status}</span>
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
              <div className="flex items-center justify-between mt-1.5"><Rating p={p} small /><span className="text-[11px] font-bold" style={{ color: INK }}>CHF {p.price}</span></div>
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
                <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>Last time Fri, Feb {lastDone.dom}</div>
              </div>
              <button onClick={() => { const p = PROVIDERS.find((x) => x.name === lastDone.provider); if (p) openProfile(p.id, 'home'); }} className="shrink-0 inline-flex items-center gap-1.5 px-3 h-9 rounded-full active:scale-95 transition-transform" style={{ background: TINT }}><Repeat size={13} color={CORAL} strokeWidth={2.4} /><span className="text-[12.5px] font-bold" style={{ color: CORAL }}>Rebook</span></button>
            </div>
          </>
        )}

        {/* Future near you — quiet teaser, taps open the full list */}
        <SectionLabel>Future near you</SectionLabel>
        <button onClick={() => setFutureOpen(true)} className="w-full bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
          <span className="relative w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: TINT }}>
            <Sparkles size={16} color={CORAL} strokeWidth={2} />
            <span className="absolute -top-0.5 -right-0.5 w-[14px] h-[14px] rounded-full flex items-center justify-center text-[9px] font-extrabold text-white" style={{ background: CORAL, border: '1.5px solid #fff' }}>!</span>
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold" style={{ color: INK }}>More services on the way</div>
            <div className="text-[10.5px] mt-[1px]" style={{ color: TERT }}>Training, daycare & more — see what’s coming</div>
          </div>
          <ChevronRight size={14} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />
        </button>

        {/* Refer — slim */}
        <div className="rounded-[14px] mt-5 px-3.5 py-2.5 flex items-center gap-3" style={{ background: TINT }}>
          <Gift size={16} color={CORAL} strokeWidth={2} className="shrink-0" />
          <span className="flex-1 text-[12.5px] font-semibold truncate" style={{ color: INK }}>Give CHF 10, get CHF 10</span>
          <button onClick={() => act('Invite friends')} className="shrink-0 text-[12.5px] font-bold active:opacity-70" style={{ color: CORAL }}>Invite</button>
        </div>
      </div>

      {/* On the way — bottom sheet with circular service icons */}
      {futureOpen && (
        <>
          <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'svFade 0.2s ease both' }} onClick={() => setFutureOpen(false)} />
          <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px]" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'svSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
            <div className="px-5 pt-1 pb-2 flex items-center gap-3">
              <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>On the way</h2>
              <button onClick={() => setFutureOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
            </div>
            <p className="px-5 text-[12.5px] leading-[1.5]" style={{ color: TERT }}>We’re adding new services through the year — you’ll know the moment they launch near you.</p>
            <div className="grid grid-cols-4 gap-y-5 px-5 mt-5">
              {FUTURE_SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="flex flex-col items-center gap-2">
                    <span className="w-[52px] h-[52px] rounded-full flex items-center justify-center bg-white" style={{ boxShadow: SHADOW }}><Icon size={19} color="#C9BBAE" strokeWidth={2} /></span>
                    <span className="text-[10.5px] font-semibold" style={{ color: TERT }}>{s.label}</span>
                  </div>
                );
              })}
            </div>
            <div className="px-5 pt-6" style={{ paddingBottom: embedded ? 104 : 30 }}>
              <button onClick={() => { setFutureOpen(false); act('We’ll notify you as they launch'); }} className="w-full py-3.5 rounded-[16px] active:scale-[0.98]" style={{ background: CORAL, boxShadow: '0 6px 18px rgba(232,93,42,0.26)' }}><span className="text-[14.5px] font-bold text-white">Notify me</span></button>
            </div>
          </div>
        </>
      )}

      {toast && <Toast embedded={embedded} msg={toast} />}
      {!embedded && <PreviewHeader />}
    </Wrap>
  );
};

export default ServicesV2;
