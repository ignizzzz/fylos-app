import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Bell, Search, Footprints, Home, Scissors, Stethoscope,
  Star, Heart, ChevronRight, ChevronLeft, ChevronDown, MapPin, MessageCircle,
  CalendarClock, X, Check, BadgeCheck, Repeat, Gift, Sparkles, GraduationCap, Lock,
  Sun, Car, DoorOpen, Camera, Apple, CalendarDays, User, Share2, Clock,
} from 'lucide-react';
import ChatOverlay from './95_CHAT_v1';
import InviteFriends from './60_INVITE_FRIENDS_v1';

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
  { id: 'pr1', cat: 'walking', name: 'Lukas F.', rating: 4.9, reviews: 132, dist: 0.8, price: 22, photo: 'https://i.pravatar.cc/150?u=lukas_walker', verified: true, today: true, recommended: true, perks: ['GPS tracking', 'Photo updates'], cancelPolicy: '24 h',
    stats: [['530', 'walks'], ['92%', 'repeat'], ['~1 h', 'reply']], meta: '530 walks · replies in ~1 h', bio: 'Full-time walker in Seefeld. Calm energy, great with reactive dogs, photo updates on every walk.',
    services: [{ n: '30 min walk', p: 14, d: 'Quick loop · water break' }, { n: '60 min walk', p: 22, d: 'Park time · photo update' }, { n: '90 min walk', p: 33, d: 'Long adventure · forest trails' }],
    review: { who: 'Anna M.', txt: 'Leo comes back happy and tired every single time. Lukas sends the best photo updates.' } },
  { id: 'pr3', cat: 'sitting', name: 'Maria K.', rating: 4.8, reviews: 96, dist: 0.5, price: 38, photo: 'https://i.pravatar.cc/150?u=maria_sitter', verified: true, today: true, recommended: true, perks: ['Photo updates'], cancelPolicy: '12 h',
    stats: [['210', 'stays'], ['88%', 'repeat'], ['~30 m', 'reply']], meta: '210 stays · replies in ~30 m', bio: 'Your pet stays at my quiet flat by the lake. Daily walks, couch privileges included.',
    services: [{ n: 'Day sitting', p: 25, d: '8 am – 6 pm at my flat' }, { n: 'Overnight', p: 38, d: 'Evening walk · cozy night in' }, { n: 'Week package', p: 240, d: '7 nights · daily updates' }],
    review: { who: 'Julia S.', txt: 'Tao was so relaxed when we got back. Daily photos and a little diary. Adorable.' } },
  { id: 'pr6', cat: 'walking', name: 'Jonas W.', rating: 4.8, reviews: 84, dist: 2.3, price: 24, photo: 'https://i.pravatar.cc/150?u=jonas_walker', verified: true, today: false, recommended: true, perks: ['GPS tracking', 'Photo updates'], cancelPolicy: '24 h',
    stats: [['310', 'walks'], ['90%', 'repeat'], ['~2 h', 'reply']], meta: '310 walks · replies in ~2 h', bio: 'Trail runner. Perfect for high-energy dogs that need real exercise.',
    services: [{ n: '60 min run', p: 24, d: 'Lakeside jog · high energy' }, { n: '90 min trail', p: 36, d: 'Uetliberg trails · real workout' }],
    review: { who: 'Felix H.', txt: 'Our husky finally gets the workout he needs.' } },
  { id: 'pr5', cat: 'walking', name: 'Nina T.', rating: 4.7, reviews: 58, dist: 1.6, price: 19, photo: 'https://i.pravatar.cc/150?u=nina_walker', verified: false, today: true, recommended: false, perks: null, cancelPolicy: null,
    stats: [['160', 'walks'], ['81%', 'repeat'], ['~3 h', 'reply']], meta: '160 walks · replies in ~3 h', bio: 'Student & lifelong dog person. Energetic walks, parks and trails.',
    services: [{ n: '30 min walk', p: 12, d: 'Neighbourhood round' }, { n: '60 min walk', p: 19, d: 'Park visit · play time' }],
    review: { who: 'Petra K.', txt: 'Great with our young lab. He comes back perfectly tired.' } },
];
const NAMES = ['Elena B.', 'Marc S.', 'Tina R.', 'David K.', 'Laura M.', 'Pascal H.', 'Mia W.', 'Noah B.', 'Lea F.', 'Tim G.', 'Sara J.', 'Luca P.', 'Nora E.', 'Jan D.', 'Amélie C.', 'Ben T.', 'Chiara V.', 'Felix N.', 'Ida M.', 'Oskar L.', 'Zoe A.', 'Liam K.', 'Emma S.', 'Paul W.', 'Lina H.', 'Aaron Z.', 'Maja Q.', 'Leon X.'];
const GENERATED = NAMES.map((name, i) => {
  const rating = (4.2 + ((i * 7) % 8) / 10).toFixed(1);
  const price = 15 + ((i * 3) % 14);
  const walks = 40 + ((i * 11) % 400);
  const reply = ['~1 h', '~2 h', '~30 m', '~3 h'][i % 4];
  return {
    id: 'gw' + i, cat: i % 4 === 3 ? 'sitting' : 'walking', name, rating: parseFloat(rating), reviews: 12 + ((i * 13) % 90), dist: +(0.4 + ((i * 5) % 40) / 10).toFixed(1), price,
    photo: `https://i.pravatar.cc/150?u=fylos_walker_`, verified: i % 3 !== 1, today: i % 2 === 0, recommended: false, perks: i % 2 === 0 ? ['GPS tracking', 'Photo updates'] : null, cancelPolicy: i % 3 === 0 ? '24 h' : i % 3 === 1 ? '12 h' : null,
    stats: [[String(walks), 'walks'], [`${78 + ((i * 5) % 20)}%`, 'repeat'], [reply, 'reply']], meta: `${walks} walks · replies in ${reply}`,
    bio: 'Local, vetted and insured through fylos. Flexible with schedules and happy to meet beforehand.',
    services: [{ n: '30 min walk', p: Math.round(price * 0.65), d: 'Quick neighbourhood loop' }, { n: '60 min walk', p: price, d: 'Full hour · park time' }, { n: '90 min walk', p: Math.round(price * 1.5), d: 'Extended adventure' }],
    review: { who: 'fylos member', txt: 'Reliable and kind. Booking again.' },
  };
});
const PROVIDERS = [...DETAILED, ...GENERATED];

const INITIAL_BOOKINGS = [
  { id: 'b0', when: 'upcoming', group: 'Today', status: 'Live', service: '60 min walk', provider: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker', dow: 'THU', dom: '12', time: '09:00', pet: 'Leo', location: 'Zürichhorn loop',
    live: { total: 60, done: 24, km: '1.8', lastPhoto: '4 min ago' }, checkIns: [['09:02', 'Picked up Leo at home'], ['09:18', 'Photo update sent']] },
  { id: 'b1', when: 'upcoming', group: 'This week', status: 'Confirmed', service: 'Grooming', provider: 'Sofia Lambrou', photo: 'https://i.pravatar.cc/150?u=sofia_walker', dow: 'MON', dom: '16', time: '10:00', pet: 'Leo', location: 'Sofia’s studio · Niederdorf', notes: 'Full groom — wash, trim, nails.' },
  { id: 'b2', when: 'upcoming', group: 'This week', status: 'Confirmed', service: 'Grooming', provider: 'Bright Paws · Elena', photo: 'https://i.pravatar.cc/150?u=elena_groomer', dow: 'WED', dom: '18', time: '15:30', pet: 'Leo', location: 'Bright Paws · Seefeld', notes: 'Bath, blow-dry & style with Elena.' },
  { id: 'b3', when: 'upcoming', group: 'This week', status: 'Confirmed', service: 'Vet visit', provider: 'Lakeshore Vet · Dr. Reza', photo: 'https://i.pravatar.cc/150?u=dr_reza', dow: 'FRI', dom: '20', time: '09:00', pet: 'Leo', location: 'Lakeshore Vet · Bellevue', notes: 'Annual checkup & vaccinations.' },
  { id: 'b4', when: 'upcoming', group: 'Next week', status: 'Pending', service: '90 min walk', provider: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker', dow: 'TUE', dom: '24', time: '14:00', pet: 'Leo', location: 'Pickup at home', notes: 'Waiting for Lukas to confirm.' },
  { id: 'b5', when: 'past', group: 'February', status: 'Completed', service: '60 min walk', provider: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker', dow: 'FRI', dom: '6', time: '09:00', pet: 'Leo', location: 'Zürichhorn loop', notes: '', rated: 5,
    checkIns: [['09:02', 'Picked up Leo at home'], ['09:25', 'Halfway, photo update sent'], ['09:58', 'Walk done · 45 min · 3.2 km'], ['10:04', 'Dropped off, fresh water topped up']] },
  { id: 'b7', when: 'past', group: 'February', status: 'Completed', service: 'Full groom', provider: 'Sofia Lambrou', photo: 'https://i.pravatar.cc/150?u=sofia_walker', dow: 'SAT', dom: '7', time: '14:00', pet: 'Leo', location: 'Sofia’s studio · Niederdorf', notes: '',
    checkIns: [['14:05', 'Checked in at the studio'], ['15:20', 'All done, fresh and fluffy']] },
  { id: 'b6', when: 'past', group: 'January', status: 'Cancelled', service: 'Overnight sitting', provider: 'Maria K.', photo: 'https://i.pravatar.cc/150?u=maria_sitter', dow: 'SAT', dom: '31', time: '', pet: 'Tao', location: '', notes: 'Cancelled by you.' },
  { id: 'b8', when: 'past', group: 'January', status: 'Expired', service: '30 min walk', provider: 'Nina T.', photo: 'https://i.pravatar.cc/150?u=nina_walker', dow: 'TUE', dom: '27', time: '16:30', pet: 'Leo', location: '', notes: 'Request expired. Nina didn’t respond within 24 h and you weren’t charged.' },
];
const REMINDER_OPTS = ['1 h before', '3 h before', '1 day before', 'Off'];
const EXTRA_REVIEWS = [
  { who: 'Marco R.', when: '2 weeks ago', stars: 5, txt: 'Always on time, super communicative. Our dog adores him.' },
  { who: 'Petra K.', when: '1 month ago', stars: 4, txt: 'Photo updates every time and a tired, happy pup at the end.' },
  { who: 'Stefan B.', when: '2 months ago', stars: 5, txt: 'Flexible with last-minute changes, a lifesaver for our schedule.' },
  { who: 'Lena W.', when: '3 months ago', stars: 3, txt: 'Good walk, though pickup ran a little late that day.' },
];
// Synthetic star distribution for the reviews dashboard
const starDist = (p) => { const t = p.reviews; const five = Math.round(t * 0.78); const four = Math.round(t * 0.15); const three = Math.round(t * 0.05); const two = Math.max(0, Math.round(t * 0.01)); return [five, four, three, two, Math.max(0, t - five - four - three - two)]; };
const SORTS = ['Recommended', 'Top rated', 'Price: low to high', 'Nearest'];
const TIMES = ['09:00', '11:00', '14:00', '16:30'];
// Next 14 days (mock today = Thu Feb 12 2026) — shared by availability & reschedule
const DOWS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DATES14 = [...Array(14)].map((_, i) => { const n = 12 + i; return { n, dow: DOWS[(n) % 7], label: i === 0 ? 'Today' : i === 1 ? 'Tmrw' : DOWS[n % 7].charAt(0) + DOWS[n % 7].slice(1).toLowerCase() }; });
// Per-day open slots (indexes into TIMES) — varies day to day so it feels real
const slotsFor = (i) => [[1, 2, 3], [0, 1, 3], [0, 2], [0, 1, 2, 3]][i % 4];
// Bookable months (mock spring 2026). first = weekday index of the 1st (0=SUN)
const MONTHS_META = [
  { name: 'February 2026', short: 'Feb', days: 28, first: 0 },
  { name: 'March 2026', short: 'Mar', days: 31, first: 0 },
  { name: 'April 2026', short: 'Apr', days: 30, first: 3 },
];
const dowFor = (m, n) => DOWS[(MONTHS_META[m].first + n - 1) % 7];
const dateLabel = (m, n) => `${dowFor(m, n).charAt(0) + dowFor(m, n).slice(1).toLowerCase()} ${n} ${MONTHS_META[m].short}`;
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
        <span className="w-[38px] h-[38px] flex items-center justify-center rounded-full" style={{ background: '#FFEBEA' }}><AlertTriangle size={15} className="text-[#E5484D]" strokeWidth={2} /></span>
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

const statusTone = (s) => s === 'Confirmed' ? { bg: '#EAF7EF', c: GREEN } : s === 'Pending' ? { bg: '#FBF1E2', c: AMBER } : s === 'Cancelled' ? { bg: '#FEE8E7', c: DANGER } : s === 'Live' ? { bg: TINT, c: CORAL } : { bg: PEACH, c: MUTED };

// Shared 14-day date scroller (profile availability + reschedule)
const DateScroller = ({ selected, onSelect }) => (
  <div className="flex gap-2 overflow-x-auto -mx-5 px-5 pb-1" style={{ scrollbarWidth: 'none' }}>
    {DATES14.map((d, i) => {
      const on = selected === i;
      return (
        <button key={i} onClick={() => onSelect(i)} className="shrink-0 rounded-[12px] px-1 py-2 active:scale-[0.95] transition-all" style={{ width: 52, background: on ? CORAL : '#fff', boxShadow: on ? '0 4px 12px rgba(232,93,42,0.25)' : SHADOW }}>
          <div className="text-[10px] font-bold tracking-[0.04em]" style={{ color: on ? 'rgba(255,255,255,0.85)' : '#C4BBB0' }}>{d.label.toUpperCase()}</div>
          <div className="text-[15px] font-extrabold leading-tight mt-[1px]" style={{ color: on ? '#fff' : INK }}>{d.n}</div>
        </button>
      );
    })}
  </div>
);
const catLabel = (id) => CATEGORIES.find((c) => c.id === id)?.label || 'Providers';

const SubHeader = ({ title, sub, onBack, right, showTitle = true }) => (
  <div className="absolute top-0 left-0 right-0 z-40 pointer-events-none" style={{ paddingTop: 54, background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 64%, rgba(247,245,242,0) 100%)', paddingBottom: 14 }}>
    <div className="relative flex items-center justify-between px-5 pointer-events-auto" style={{ height: 44 }}>
      <button onClick={onBack} className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 shrink-0" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
      {/* dead-centre title, independent of side-button widths */}
      <div className="absolute left-1/2 -translate-x-1/2 text-center transition-opacity duration-200 pointer-events-none" style={{ opacity: showTitle ? 1 : 0, maxWidth: '52%' }}>
        <div className="text-[16px] font-bold tracking-[-0.01em] leading-tight truncate" style={{ color: INK }}>{title}</div>
        {sub && <div className="text-[10.5px] font-medium truncate" style={{ color: TERT }}>{sub}</div>}
      </div>
      {right || <span className="w-9 shrink-0" />}
    </div>
  </div>
);

/* Full-screen live walk tracking — the flagship "wow" view */
const LiveWalkView = ({ b, onClose, onMessage, embedded }) => {
  if (!b || !b.live) return null;
  const pct = Math.round((b.live.done / b.live.total) * 100);
  return (
    <div className="absolute inset-0 z-[170] flex flex-col" style={{ background: CREAM, animation: 'svFade 0.22s ease both' }}>
      {/* header */}
      <div className="shrink-0 px-5 pb-3 flex items-center" style={{ paddingTop: 58 }}>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 shrink-0" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <div className="inline-flex items-center gap-1.5 text-[15px] font-bold" style={{ color: INK }}><span className="w-2 h-2 rounded-full" style={{ background: CORAL, animation: 'svPulse 1.4s ease-in-out infinite' }} />Live walk</div>
          <div className="text-[10.5px] font-medium" style={{ color: TERT }}>{b.provider} · with {b.pet}</div>
        </div>
        <span className="w-9 shrink-0 ml-auto" />
      </div>

      <div className="flex-1 overflow-y-auto px-5" style={{ scrollbarWidth: 'none', paddingBottom: embedded ? 104 : 30 }}>
        {/* stylised live map */}
        <div className="rounded-[20px] overflow-hidden relative" style={{ boxShadow: SHADOW }}>
          <svg viewBox="0 0 350 290" className="w-full block" style={{ background: '#EFEAE2' }}>
            {/* park + pond */}
            <path d="M 200 30 C 290 20 340 70 338 140 C 336 210 300 240 250 250 C 200 260 170 230 168 180 C 166 120 130 40 200 30 Z" fill="#E5EEDF" />
            <ellipse cx="282" cy="180" rx="38" ry="24" fill="#DCE8F0" />
            {/* side streets */}
            <path d="M 0 110 C 70 100 120 130 180 110" stroke="#FFFFFF" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 60 290 C 80 220 60 170 110 140" stroke="#FFFFFF" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 240 290 C 250 250 280 240 320 244" stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round" />
            {/* route: remaining (dashed) then walked (solid coral) */}
            <path d="M 36 254 C 90 236 70 180 130 168 C 190 156 196 122 238 106 C 280 90 296 64 318 44" stroke="#D8CFC4" strokeWidth="4" strokeDasharray="1.5 7" fill="none" strokeLinecap="round" pathLength="100" />
            <path d="M 36 254 C 90 236 70 180 130 168 C 190 156 196 122 238 106 C 280 90 296 64 318 44" stroke={CORAL} strokeWidth="4.5" fill="none" strokeLinecap="round" pathLength="100" strokeDasharray="40 60" />
            {/* start + destination markers */}
            <circle cx="36" cy="254" r="6" fill="#FFFFFF" stroke={CORAL} strokeWidth="3" />
            <circle cx="318" cy="44" r="6" fill="#FFFFFF" stroke="#C9BBAE" strokeWidth="3" />
            {/* walker — travels the walked stretch */}
            <g>
              <circle r="11" fill={CORAL} opacity="0.25">
                <animateMotion dur="9s" repeatCount="indefinite" keyPoints="0;0.4;0.36;0.4" keyTimes="0;0.6;0.8;1" calcMode="linear" path="M 36 254 C 90 236 70 180 130 168 C 190 156 196 122 238 106 C 280 90 296 64 318 44" />
              </circle>
              <circle r="6.5" fill={CORAL} stroke="#FFFFFF" strokeWidth="2.5">
                <animateMotion dur="9s" repeatCount="indefinite" keyPoints="0;0.4;0.36;0.4" keyTimes="0;0.6;0.8;1" calcMode="linear" path="M 36 254 C 90 236 70 180 130 168 C 190 156 196 122 238 106 C 280 90 296 64 318 44" />
              </circle>
            </g>
          </svg>
          {/* floating provider chip */}
          <div className="absolute top-3 left-3 bg-white rounded-full pl-1.5 pr-3 py-1.5 flex items-center gap-2" style={{ boxShadow: '0 4px 14px rgba(60,30,15,0.12)' }}>
            <img src={b.photo} alt="" className="w-6 h-6 rounded-full object-cover" />
            <span className="text-[11.5px] font-bold" style={{ color: INK }}>{b.provider}</span>
          </div>
        </div>

        {/* stats */}
        <div className="rounded-[16px] bg-white flex items-center py-3.5 mt-3.5" style={{ boxShadow: SHADOW }}>
          {[[`${b.live.done} min`, `of ${b.live.total} min`], [`${b.live.km} km`, 'so far'], ['2', 'photos']].map(([v, l], i) => (
            <div key={i} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid ' + LINE : 'none' }}>
              <span className="text-[16px] font-extrabold leading-none" style={{ color: CORAL }}>{v}</span>
              <span className="text-[10px] font-medium mt-1.5" style={{ color: TERT }}>{l}</span>
            </div>
          ))}
        </div>
        <div className="h-[6px] rounded-full overflow-hidden mt-2.5" style={{ background: '#EAE3DB' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: CORAL, transition: 'width 0.4s' }} />
        </div>
        <div className="text-[10.5px] font-medium mt-1.5 text-right" style={{ color: TERT }}>Back home ~09:48</div>

        {/* latest photo */}
        <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] mb-2 ml-1.5 mt-4" style={{ color: '#A8A29C' }}>Latest update</div>
        <div className="bg-white rounded-[18px] p-3" style={{ boxShadow: SHADOW }}>
          <img src="https://images.unsplash.com/photo-1601758125946-6ec2ef64daf8?auto=format&fit=crop&q=80&w=700" alt="" className="w-full h-[150px] rounded-[12px] object-cover" />
          <div className="flex items-center justify-between mt-2.5 px-0.5">
            <span className="text-[12.5px] font-semibold" style={{ color: INK }}>{b.pet} made a friend at the park</span>
            <span className="text-[10.5px]" style={{ color: TERT }}>{b.live.lastPhoto}</span>
          </div>
        </div>

        <button onClick={() => onMessage({ name: b.provider, photo: b.photo })} className="w-full mt-4 py-3.5 rounded-[16px] bg-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}>
          <MessageCircle size={15} color={INK} strokeWidth={2} /><span className="text-[14px] font-bold" style={{ color: INK }}>Message {b.provider.split(' ')[0]}</span>
        </button>
        <p className="text-[11px] text-center mt-3" style={{ color: TERT }}>You’ll get a full summary when the walk ends.</p>
      </div>
    </div>
  );
};

/* Centred full-month picker with month switching */
const MonthPopup = ({ month, setMonth, selected, onPick, onClose, minDay = 12 }) => {
  const meta = MONTHS_META[month];
  return (
    <div className="absolute inset-0 z-[190] flex items-center justify-center px-7" style={{ background: 'rgba(20,12,8,0.45)', animation: 'svFade 0.2s ease both' }} onClick={onClose}>
      <div className="w-full rounded-[24px] bg-white p-5" style={{ animation: 'svPop 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setMonth(Math.max(0, month - 1))} disabled={month === 0} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90" style={{ background: PEACH, opacity: month === 0 ? 0.35 : 1 }}><ChevronLeft size={15} color={INK} strokeWidth={2.4} /></button>
          <h2 className="text-[16px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>{meta.name}</h2>
          <button onClick={() => setMonth(Math.min(MONTHS_META.length - 1, month + 1))} disabled={month === MONTHS_META.length - 1} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90" style={{ background: PEACH, opacity: month === MONTHS_META.length - 1 ? 0.35 : 1 }}><ChevronRight size={15} color={INK} strokeWidth={2.4} /></button>
        </div>
        <div className="grid grid-cols-7 gap-y-1 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="text-center text-[10px] font-bold" style={{ color: '#C4BBB0' }}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-y-1">
          {[...Array(meta.first)].map((_, i) => <span key={'x' + i} />)}
          {[...Array(meta.days)].map((_, i) => {
            const n = i + 1;
            const past = month === 0 && n < minDay;
            const on = selected && selected.m === month && selected.n === n;
            return (
              <button key={n} disabled={past} onClick={() => onPick({ m: month, n })} className="flex items-center justify-center rounded-[10px] mx-auto transition-all active:scale-90" style={{ width: 36, height: 36, background: on ? CORAL : 'transparent' }}>
                <span className="text-[13px] font-bold leading-none" style={{ color: on ? '#fff' : past ? '#DDD4C9' : MUTED }}>{n}</span>
              </button>
            );
          })}
        </div>
        <p className="text-[10.5px] text-center mt-3" style={{ color: TERT }}>Pick any date. Bookings open up to 3 months ahead</p>
      </div>
    </div>
  );
};

const Toast = ({ embedded, msg }) => (
  <div className="absolute left-1/2 z-[200] px-4 py-2.5 rounded-full" style={{ bottom: embedded ? 108 : 38, transform: 'translateX(-50%)', background: INK, animation: 'svToast 0.2s ease both' }}><span className="text-[13px] font-semibold text-white whitespace-nowrap">{msg}</span></div>
);

const Wrap = ({ embedded, children }) => {
  const styleBlock = <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@800&display=swap');
    @keyframes svToast { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes svFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes svShimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
    .svSkel { background: linear-gradient(90deg, #F1ECE6 25%, #FAF7F3 50%, #F1ECE6 75%); background-size: 200% 100%; animation: svShimmer 1.2s linear infinite; }
    @keyframes svSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes svSpin { to { transform: rotate(360deg); } }
    @keyframes svPop { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
    @keyframes svRing { 0% { transform: scale(0.7); opacity: 0.6; } 100% { transform: scale(1.7); opacity: 0; } }
    @keyframes svBadge { 0% { opacity: 0; transform: scale(0); } 70% { transform: scale(1.25); } 100% { opacity: 1; transform: scale(1); } }
    @keyframes svPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    @keyframes svBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
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
  const [petSel, setPetSel] = useState(['leo']);
  const togglePet = (id) => setPetSel((s) => s.includes(id) ? (s.length > 1 ? s.filter((x) => x !== id) : s) : [...s, id]);
  const [saved, setSaved] = useState(['pr1', 'pr3', 'pr6']);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [bkFilter, setBkFilter] = useState('upcoming');
  const [expanded, setExpanded] = useState(focusedBookingId);
  const [svc, setSvc] = useState(1);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(1);
  const [calStart, setCalStart] = useState(0);
  const [futureOpen, setFutureOpen] = useState(false);
  const [monthOpen, setMonthOpen] = useState(false);
  const [remIdx, setRemIdx] = useState({});
  const [rateFor, setRateFor] = useState(null);   // { booking, stars }
  const [chat, setChat] = useState(null);          // { name, photo }
  const [browseLoading, setBrowseLoading] = useState(false); // brief skeleton when a category opens
  useEffect(() => {
    if (view.kind !== 'browse') return;
    setBrowseLoading(true);
    const t = setTimeout(() => setBrowseLoading(false), 550);
    return () => clearTimeout(t);
  }, [view.kind, view.cat]);
  const [liveOpen, setLiveOpen] = useState(false); // full-screen live walk view
  const [payFor, setPayFor] = useState(null);      // { p, sel, date, time } → payment confirm sheet
  const [payStep, setPayStep] = useState('review'); // 'review' | 'processing'
  const [reschedFor, setReschedFor] = useState(null);
  const [reschedDay, setReschedDay] = useState(0);
  const [reschedTime, setReschedTime] = useState(1);
  const [cancelFor, setCancelFor] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [verifiedOpen, setVerifiedOpen] = useState(false);
  const [profScrolled, setProfScrolled] = useState(false);
  const [revFilter, setRevFilter] = useState('All');
  const [calMonth, setCalMonth] = useState(0);            // bookings inline month
  const [pickCtx, setPickCtx] = useState(null);            // 'avail' | 'resched' — month popup open for…
  const [pickMonth, setPickMonth] = useState(0);
  const [pickedAvail, setPickedAvail] = useState(null);    // {m,n} chosen via popup (profile)
  const [pickedResched, setPickedResched] = useState(null);
  const [confirmation, setConfirmation] = useState(null);  // request-sent overlay
  const [petHint, setPetHint] = useState(false);
  const [bookNote, setBookNote] = useState('');
  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [toast, setToast] = useState('');
  const act = (m) => { setToast(m); setTimeout(() => setToast(''), 1700); };
  const cycleReminder = (id) => setRemIdx((r) => ({ ...r, [id]: ((r[id] ?? 0) + 1) % REMINDER_OPTS.length }));
  const submitRating = (id, stars) => { setBookings((prev) => prev.map((b) => b.id === id ? { ...b, rated: stars } : b)); setRateFor(null); act('Thanks for your feedback'); };
  const confirmCancel = (id) => { const bk = bookings.find((b) => b.id === id); setBookings((prev) => prev.map((b) => b.id === id ? { ...b, when: 'past', group: 'February', status: 'Cancelled', notes: 'Cancelled by you.' } : b)); setCancelFor(null); setExpanded(null); act('Booking cancelled'); if (bk) notify('Booking cancelled', `${bk.service} with ${bk.provider} was cancelled. Any hold on your card is released.`); };
  const confirmResched = (b) => {
    const d = pickedResched || { m: 0, n: DATES14[reschedDay].n };
    const group = d.m === 0 ? (d.n <= 22 ? 'This week' : 'Next week') : MONTHS_META[d.m].name.split(' ')[0];
    setBookings((prev) => prev.map((x) => x.id === b.id ? { ...x, dow: dowFor(d.m, d.n), dom: String(d.n), bm: d.m, group, time: TIMES[reschedTime], status: 'Pending', notes: `Waiting for ${b.provider.split(' ')[0]} to confirm the new time.` } : x));
    setReschedFor(null); setPickedResched(null); act('Reschedule requested');
  };
  useEffect(() => { if (focusedBookingId && onClearFocus) onClearFocus(); // eslint-disable-next-line
  }, []);
  useEffect(() => { onSubScreenChange && onSubScreenChange(view.kind !== 'home' || inviteOpen); }, [view, inviteOpen, onSubScreenChange]);

  const toggleSave = (id) => setSaved((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const petName = petSel.length > 1 ? 'Leo & Tao' : (PETS.find((p) => p.id === petSel[0])?.name || 'Leo');
  const upcoming = bookings.filter((b) => b.when === 'upcoming');
  const nextUp = upcoming[0];
  const lastDone = bookings.find((b) => b.status === 'Completed');
  const savedProviders = PROVIDERS.filter((p) => saved.includes(p.id));
  const suggestions = PROVIDERS.filter((p) => !saved.includes(p.id) && p.verified).slice(0, 2);

  const openProfile = (id, from) => { setSvc(1); setDay(0); setTime(1); setProfScrolled(false); setVerifiedOpen(false); setBookNote(''); setRepeatWeekly(false); setView({ kind: 'profile', id, from }); };
  const profileP = view.kind === 'profile' ? PROVIDERS.find((p) => p.id === view.id) : null;

  const browseAll = view.kind === 'browse' ? PROVIDERS.filter((p) => p.cat === view.cat) : [];
  const browseRec = browseAll.filter((p) => p.recommended);
  const browseRest = [...browseAll.filter((p) => !p.recommended)].sort((a, b) =>
    sort === 'Top rated' ? b.rating - a.rating : sort === 'Price: low to high' ? a.price - b.price : sort === 'Nearest' ? a.dist - b.dist : b.rating * b.reviews - a.rating * a.reviews);

  // app-wide notification bus → lands in the dashboard inbox
  const notify = (title, body) => { try { window.dispatchEvent(new CustomEvent('fylos:notify', { detail: { title, body } })); } catch (e) {} };

  const requestBooking = (p, svcSel, dateObj, timeSel) => {
    const { m, n } = dateObj;
    const id = 'b' + Math.floor(Math.random() * 100000);
    const group = m === 0 ? (n <= 22 ? 'This week' : 'Next week') : MONTHS_META[m].name.split(' ')[0];
    setBookings((prev) => [{ id, when: 'upcoming', group, bm: m, status: 'Pending', service: svcSel.n, provider: p.name, photo: p.photo, dow: dowFor(m, n), dom: String(n), time: timeSel, pet: petName, location: 'Pickup at home', repeat: repeatWeekly, notes: bookNote.trim() || `Waiting for ${p.name.split(' ')[0]} to confirm.` }, ...prev]);
    setView({ kind: 'bookings' }); setBkFilter('upcoming'); setExpanded(id); setPickedAvail(null);
    setConfirmation({ photo: p.photo, provider: p.name, service: svcSel.n, when: `${dateLabel(m, n)} · ${timeSel}`, repeat: repeatWeekly });
    notify('Booking request sent', `${svcSel.n} with ${p.name} · ${dateLabel(m, n)} ${timeSel}. We'll notify you when they confirm.`);
  };

  /* ───────── PROVIDER PROFILE (full screen) ───────── */
  if (profileP) {
    const p = profileP;
    const sel = p.services[Math.min(svc, p.services.length - 1)];
    const isSaved = saved.includes(p.id);
    return (
      <Wrap embedded={embedded}>
        <div onScroll={(e) => setProfScrolled(e.currentTarget.scrollTop > 130)} className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 112, paddingBottom: embedded ? 196 : 120, scrollbarWidth: 'none', background: CREAM }}>
          <div className="flex flex-col items-center text-center">
            <img src={p.photo} alt={p.name} className="w-[84px] h-[84px] rounded-full object-cover" style={{ boxShadow: '0 10px 26px rgba(60,30,15,0.14)' }} />
            <div className="flex items-center gap-1.5 mt-3"><h1 className="text-[21px] font-extrabold tracking-[-0.02em]" style={{ color: INK }}>{p.name}</h1>{p.verified && <button onClick={() => setVerifiedOpen(true)} className="active:scale-90 transition-transform"><BadgeCheck size={17} color={CORAL} strokeWidth={2.2} /></button>}</div>
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
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-semibold" style={{ color: INK }}>{s.n}</span>
                    {s.d && <span className="block text-[11px] mt-[1px] truncate" style={{ color: TERT }}>{s.d}</span>}
                  </span>
                  <span className="text-[13.5px] font-bold shrink-0" style={{ color: on ? CORAL : MUTED }}>CHF {s.p}</span>
                  {i < p.services.length - 1 && <div className="absolute bottom-0 left-[46px] right-0 h-px" style={{ background: LINE }} />}
                </button>
              );
            })}
          </div>
          {p.perks && p.perks.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 ml-1.5">
              <Check size={11} color={GREEN} strokeWidth={3} />
              <span className="text-[11px] font-medium" style={{ color: TERT }}>{p.perks.join(' & ')} included</span>
            </div>
          )}

          <SectionLabel action={`${MONTHS_META[pickedAvail ? pickedAvail.m : 0].short} · Full calendar`} onAction={() => { setPickMonth(pickedAvail ? pickedAvail.m : 0); setPickCtx('avail'); }}>Availability</SectionLabel>
          <DateScroller selected={pickedAvail ? -1 : day} onSelect={(i) => { setPickedAvail(null); setDay(i); const s = slotsFor(DATES14[i].n); if (!s.includes(time)) setTime(s[0] ?? 0); }} />
          {pickedAvail && (
            <button onClick={() => { setPickMonth(pickedAvail.m); setPickCtx('avail'); }} className="mt-2 inline-flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full active:scale-95 transition-transform" style={{ background: CORAL }}>
              <CalendarDays size={12} color="#fff" strokeWidth={2.2} />
              <span className="text-[12px] font-bold text-white">{dateLabel(pickedAvail.m, pickedAvail.n)}</span>
              <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>· change</span>
            </button>
          )}
          {(() => { const selN = pickedAvail ? pickedAvail.n : DATES14[day].n; return (
          <div className="rounded-[16px] bg-white p-3 mt-2" style={{ boxShadow: SHADOW }}>
            <div className="grid grid-cols-4 gap-2">{TIMES.map((t, i) => {
              const openSlot = slotsFor(selN).includes(i);
              const on = time === i && openSlot;
              return (
                <button key={t} onClick={() => openSlot && setTime(i)} disabled={!openSlot} className="h-[36px] rounded-[10px] text-[12px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? CORAL : openSlot ? PEACH : 'transparent', color: on ? '#fff' : openSlot ? MUTED : '#D3CABF', boxShadow: openSlot ? 'none' : 'inset 0 0 0 1px #EFE9E0', textDecoration: openSlot ? 'none' : 'line-through' }}>{t}</button>
              );
            })}</div>
            <div className="text-[10px] font-medium mt-2.5 text-center" style={{ color: '#C4BBB0' }}>All times local{p.cancelPolicy ? ` · free cancellation up to ${p.cancelPolicy} before` : ''}</div>
          </div>
          ); })()}

          <SectionLabel>Repeat</SectionLabel>
          <div className="flex gap-2">
            {[{ v: false, l: 'One-time' }, { v: true, l: 'Weekly' }].map((o) => {
              const on = repeatWeekly === o.v;
              return (
                <button key={o.l} onClick={() => setRepeatWeekly(o.v)} className="flex-1 h-[42px] rounded-[12px] flex items-center justify-center gap-1.5 text-[13px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>
                  {o.v && <Repeat size={13} strokeWidth={2.4} />}{o.l}
                </button>
              );
            })}
          </div>
          {repeatWeekly && <p className="text-[11px] mt-2 ml-1.5" style={{ color: TERT }}>Same day & time every week. Skip or stop any week from Bookings.</p>}

          <SectionLabel>Note for {p.name.split(' ')[0]} <span className="lowercase tracking-normal" style={{ color: '#C4BBB0' }}>· optional</span></SectionLabel>
          <textarea value={bookNote} onChange={(e) => setBookNote(e.target.value)} placeholder="e.g. The leash hangs by the door, ring the bell twice." rows={2}
            className="w-full bg-white rounded-[16px] px-4 py-3 outline-none text-[13.5px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal resize-none" style={{ boxShadow: SHADOW }} />

          <SectionLabel action={`See all (${p.reviews})`} onAction={() => setView({ kind: 'reviews', id: p.id })}>Latest review</SectionLabel>
          <div className="rounded-[16px] bg-white px-4 py-3.5" style={{ boxShadow: SHADOW }}>
            <div className="flex items-center gap-1.5 mb-1.5">{[...Array(5)].map((_, i) => <Star key={i} size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} />)}<span className="text-[11.5px] font-bold ml-1" style={{ color: INK }}>{p.review.who}</span></div>
            <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>“{p.review.txt}”</p>
          </div>
        </div>

        <SubHeader title={p.name} sub={`${catLabel(p.cat)} · ${p.dist} km`} showTitle={profScrolled} onBack={() => setView(view.from === 'browse' ? { kind: 'browse', cat: p.cat } : view.from === 'saved' ? { kind: 'saved' } : view.from === 'bookings' ? { kind: 'bookings' } : { kind: 'home' })}
          right={<span className="flex items-center gap-2 shrink-0">
            <button onClick={async () => { const data = { title: `${p.name} on fylos`, text: `Check out ${p.name}, ${p.rating}★ ${p.cat === 'sitting' ? 'pet sitter' : 'dog walker'} near you`, url: `https://fylos.app/p/${p.id}` }; try { if (navigator.share) { await navigator.share(data); } else { await navigator.clipboard.writeText(data.url); act('Profile link copied'); } } catch (e) { try { await navigator.clipboard.writeText(data.url); act('Profile link copied'); } catch (e2) { act('Profile link copied'); } } }} className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-90" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><Share2 size={15} color={MUTED} strokeWidth={2} /></button>
            <button onClick={() => toggleSave(p.id)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90" style={{ background: isSaved ? TINT : '#fff', boxShadow: isSaved ? 'none' : '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><Heart size={16} color={isSaved ? CORAL : MUTED} fill={isSaved ? CORAL : 'none'} strokeWidth={2} /></button>
          </span>} />

        <div className="absolute left-0 right-0 z-40 px-5 pointer-events-none" style={{ bottom: 0, paddingBottom: embedded ? 100 : 28, paddingTop: 26, background: `linear-gradient(to top, ${CREAM} 62%, rgba(247,245,242,0))` }}>
          <button onClick={() => setPayFor({ p, sel, date: pickedAvail || { m: 0, n: DATES14[day].n }, time: TIMES[time] })} className="w-full py-4 rounded-[16px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 pointer-events-auto" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.3)' }}>
            <span className="text-[15px] font-bold text-white">Request booking</span>
            <span className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>· CHF {sel.p}{repeatWeekly ? '/wk' : ''}</span>
          </button>
          <div className="text-[10.5px] font-medium text-center mt-2" style={{ color: TERT }}>Pay after the service · Visa ··4242. Charged only once it’s done</div>
        </div>

        {/* Verified — what it means */}
        {verifiedOpen && (
          <>
            <div className="absolute inset-0 z-[170]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'svFade 0.2s ease both' }} onClick={() => setVerifiedOpen(false)} />
            <div className="absolute left-0 right-0 bottom-0 z-[172] rounded-t-[26px]" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'svSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
              <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
              <div className="px-5 pt-2 pb-1 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: TINT }}><BadgeCheck size={20} color={CORAL} strokeWidth={2} /></span>
                <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Verified by fylos</h2>
                <button onClick={() => setVerifiedOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
              </div>
              <div className="px-5 pt-3" style={{ paddingBottom: embedded ? 104 : 30 }}>
                {[['Identity checked', 'Government ID confirmed in person'], ['Insured', 'Covered while caring for your pet'], ['References reviewed', 'Past clients vouched before approval']].map(([t, s], i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5">
                    <Check size={15} color={GREEN} strokeWidth={3} className="mt-0.5 shrink-0" />
                    <div><div className="text-[14px] font-semibold" style={{ color: INK }}>{t}</div><div className="text-[12px] mt-0.5" style={{ color: TERT }}>{s}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {pickCtx === 'avail' && (
          <MonthPopup month={pickMonth} setMonth={setPickMonth} selected={pickedAvail} onClose={() => setPickCtx(null)}
            onPick={(d) => { setPickedAvail(d); const s = slotsFor(d.n); if (!s.includes(time)) setTime(s[0] ?? 0); setPickCtx(null); }} />
        )}

        {/* Payment confirm — hold now, charge after the service */}
        {payFor && (
          <>
            <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'svFade 0.2s ease both' }} onClick={() => payStep === 'review' && setPayFor(null)} />
            <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] px-5" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'svSheet 0.3s cubic-bezier(0.22,1,0.36,1) both', paddingBottom: embedded ? 100 : 30 }}>
              <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
              {payStep === 'review' ? (
                <>
                  <div className="flex items-center gap-3 pt-1 pb-3">
                    <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Confirm request</h2>
                    <button onClick={() => setPayFor(null)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
                  </div>
                  <div className="bg-white rounded-[16px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                    <div className="relative flex items-center gap-3 px-4 py-3">
                      <img src={payFor.p.photo} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div className="flex-1 min-w-0"><div className="text-[14px] font-bold truncate" style={{ color: INK }}>{payFor.sel.n} · {payFor.p.name}</div><div className="text-[11.5px] mt-0.5" style={{ color: CORAL }}>{dateLabel(payFor.date.m, payFor.date.n)} · {payFor.time}{repeatWeekly ? ' · repeats weekly' : ''}</div></div>
                      <span className="text-[15px] font-extrabold" style={{ color: INK }}>CHF {payFor.sel.p}</span>
                      <div className="absolute bottom-0 left-[62px] right-0 h-px" style={{ background: LINE }} />
                    </div>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <span className="w-10 h-7 rounded-[6px] flex items-center justify-center shrink-0" style={{ background: '#1A1F71' }}><span className="text-[8px] font-extrabold italic text-white">VISA</span></span>
                      <div className="flex-1"><div className="text-[13.5px] font-semibold" style={{ color: INK }}>Visa ··4242</div><div className="text-[11px] mt-[1px]" style={{ color: TERT }}>Hold now. Charged after the service</div></div>
                      <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} />
                    </div>
                  </div>
                  <button onClick={() => { setPayStep('processing'); setTimeout(() => { const f = payFor; setPayFor(null); setPayStep('review'); requestBooking(f.p, f.sel, f.date, f.time); }, 1000); }} className="w-full mt-4 py-4 rounded-[16px] active:scale-[0.98] transition-transform" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.3)' }}>
                    <span className="text-[15px] font-bold text-white">Place hold · CHF {payFor.sel.p}</span>
                  </button>
                  <div className="flex items-center justify-center gap-1.5 mt-3"><Lock size={11} color={TERT} strokeWidth={2} /><span className="text-[10.5px] font-medium" style={{ color: TERT }}>Secured by Stripe. Released if {payFor.p.name.split(' ')[0]} declines</span></div>
                </>
              ) : (
                <div className="flex flex-col items-center py-10">
                  <span className="w-12 h-12 rounded-full" style={{ border: '3.5px solid #F1E7DC', borderTopColor: CORAL, animation: 'svSpin 0.8s linear infinite' }} />
                  <span className="text-[14px] font-bold mt-4" style={{ color: INK }}>Confirming with your bank…</span>
                  <span className="text-[11.5px] mt-1" style={{ color: TERT }}>Visa ··4242 · CHF {payFor.sel.p}</span>
                </div>
              )}
            </div>
          </>
        )}
        {toast && <Toast embedded={embedded} msg={toast} />}
      </Wrap>
    );
  }

  /* ───────── REVIEWS (full screen with dashboard + filters) ───────── */
  if (view.kind === 'reviews') {
    const p = PROVIDERS.find((x) => x.id === view.id) || DETAILED[0];
    const dist = starDist(p);
    const allReviews = [{ who: p.review.who, when: '1 week ago', stars: 5, txt: p.review.txt }, ...EXTRA_REVIEWS];
    const filtered = revFilter === 'All' ? allReviews : allReviews.filter((r) => revFilter === '3★ & less' ? r.stars <= 3 : r.stars === parseInt(revFilter));
    return (
      <Wrap embedded={embedded}>
        <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 116, paddingBottom: embedded ? 104 : 36, scrollbarWidth: 'none', background: CREAM }}>
          {/* Dashboard */}
          <div className="rounded-[18px] bg-white p-4 flex items-center gap-5" style={{ boxShadow: SHADOW }}>
            <div className="flex flex-col items-center shrink-0">
              <span className="text-[34px] font-extrabold leading-none tracking-[-0.02em]" style={{ color: INK }}>{p.rating}</span>
              <span className="flex gap-0.5 mt-1.5">{[...Array(5)].map((_, i) => <Star key={i} size={11} color="#E8B04A" fill={i < Math.round(p.rating) ? '#E8B04A' : 'none'} strokeWidth={1.4} />)}</span>
              <span className="text-[10.5px] mt-1" style={{ color: TERT }}>{p.reviews} reviews</span>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              {dist.map((n, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold w-2 text-right" style={{ color: MUTED }}>{5 - i}</span>
                  <Star size={9} color="#E8B04A" fill="#E8B04A" strokeWidth={0} />
                  <div className="flex-1 h-[5px] rounded-full overflow-hidden" style={{ background: PEACH }}>
                    <div className="h-full rounded-full" style={{ width: `${p.reviews ? Math.round((n / p.reviews) * 100) : 0}%`, background: '#E8B04A' }} />
                  </div>
                  <span className="text-[10px] font-semibold w-7" style={{ color: TERT }}>{n}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Minimal filters */}
          <div className="flex items-center gap-5 mt-5 ml-1.5">
            {['All', '5', '4', '3★ & less'].map((f) => {
              const on = revFilter === f;
              const label = f === 'All' ? 'All' : f === '3★ & less' ? '3★ & less' : `${f}★`;
              return <button key={f} onClick={() => setRevFilter(f)} className="relative pb-1.5 text-[13px] font-bold transition-colors" style={{ color: on ? INK : TERT }}>{label}{on && <span className="absolute left-0 right-0 bottom-0 rounded-full" style={{ height: 2, background: CORAL }} />}</button>;
            })}
          </div>

          <div className="flex flex-col gap-2.5 mt-3">
            {filtered.map((r, i) => (
              <div key={i} className="rounded-[16px] bg-white px-4 py-3.5" style={{ boxShadow: SHADOW }}>
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, si) => <Star key={si} size={10} color="#E8B04A" fill={si < r.stars ? '#E8B04A' : 'none'} strokeWidth={1.4} />)}
                  <span className="text-[11.5px] font-bold ml-1" style={{ color: INK }}>{r.who}</span>
                  <span className="flex-1" />
                  <span className="text-[10.5px]" style={{ color: '#C4BBB0' }}>{r.when}</span>
                </div>
                <p className="text-[13px] leading-[1.5] mt-1.5" style={{ color: MUTED }}>“{r.txt}”</p>
              </div>
            ))}
            {!filtered.length && <div className="text-center text-[13px] mt-10" style={{ color: TERT }}>No reviews with this rating yet.</div>}
          </div>
        </div>

        <SubHeader title="Reviews" sub={`${p.name} · ★ ${p.rating}`} onBack={() => setView({ kind: 'profile', id: p.id, from: view.from || 'home' })} />
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
                      <img src={p.photo} alt={p.name} className="w-full h-[92px] rounded-[12px] object-cover" />
                      {p.today && <span className="absolute top-2 left-2 inline-flex items-center gap-1 pl-1.5 pr-2 py-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.92)' }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /><span className="text-[10px] font-bold" style={{ color: GREEN }}>Today</span></span>}
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
              <div className="absolute right-0 z-50 rounded-[16px] bg-white overflow-hidden" style={{ top: 24, width: 196, boxShadow: '0 8px 30px rgba(60,30,15,0.16)' }}>
                {SORTS.map((s, i) => (
                  <button key={s} onClick={() => { setSort(s); setSortOpen(false); }} className="relative w-full flex items-center justify-between px-3.5 py-2.5 text-left active:bg-black/[0.03]">
                    <span className="text-[13px] font-semibold" style={{ color: sort === s ? CORAL : INK }}>{s}</span>
                    {sort === s && <Check size={14} color={CORAL} strokeWidth={2.4} />}
                    {i < SORTS.length - 1 && <div className="absolute bottom-0 left-3.5 right-0 h-px" style={{ background: LINE }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Marketplace cards — separate, photo-led, key facts */}
          <div className="flex flex-col gap-3">
            {browseLoading && [0, 1, 2, 3].map((i) => (
              <div key={'sk' + i} className="bg-white rounded-[18px] p-3 flex gap-3.5" style={{ boxShadow: SHADOW }}>
                <div className="svSkel w-[76px] h-[76px] rounded-[15px] shrink-0" />
                <div className="flex-1 py-1">
                  <div className="svSkel h-[14px] rounded-full" style={{ width: '55%' }} />
                  <div className="svSkel h-[11px] rounded-full mt-2.5" style={{ width: '75%' }} />
                  <div className="svSkel h-[11px] rounded-full mt-2" style={{ width: '40%' }} />
                </div>
              </div>
            ))}
            {!browseLoading && browseRest.map((p) => (
              <button key={p.id} onClick={() => openProfile(p.id, 'browse')} className="bg-white rounded-[18px] p-3 flex gap-3.5 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
                <img src={p.photo} alt={p.name} className="w-[76px] h-[76px] rounded-[15px] object-cover shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-[14.5px] font-bold truncate" style={{ color: INK }}>{p.name}</span>
                    {p.verified && <BadgeCheck size={13} color={CORAL} strokeWidth={2.2} className="shrink-0" />}
                    <span className="flex-1" />
                    {p.rating >= 4.8 && <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold uppercase tracking-[0.03em] px-1.5 py-[2px] rounded-full shrink-0" style={{ background: '#FBF1E2', color: AMBER }}><Star size={8} color={AMBER} fill={AMBER} strokeWidth={0} /> Top rated</span>}
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

          {/* Calendar card — week strip that expands into the full month */}
          {bkFilter === 'upcoming' && (
            <div className="bg-white rounded-[16px] mt-4 overflow-hidden" style={{ boxShadow: SHADOW }}>
              <div className="pl-1 pr-1 py-3 flex items-center">
                {!monthOpen && <button onClick={() => setCalStart(Math.max(0, calStart - 1))} disabled={calStart === 0} className="w-7 h-9 flex items-center justify-center shrink-0 active:scale-90 transition-transform" style={{ opacity: calStart === 0 ? 0.3 : 1 }}><ChevronLeft size={15} color={MUTED} strokeWidth={2.4} /></button>}
                {monthOpen ? (
                  <span className="flex-1 flex items-center gap-2 pl-2">
                    <button onClick={() => setCalMonth(Math.max(0, calMonth - 1))} disabled={calMonth === 0} className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90" style={{ background: PEACH, opacity: calMonth === 0 ? 0.35 : 1 }}><ChevronLeft size={13} color={INK} strokeWidth={2.4} /></button>
                    <span className="text-[13px] font-extrabold flex-1 text-center" style={{ color: INK }}>{MONTHS_META[calMonth].name}</span>
                    <button onClick={() => setCalMonth(Math.min(MONTHS_META.length - 1, calMonth + 1))} disabled={calMonth === MONTHS_META.length - 1} className="w-7 h-7 rounded-full flex items-center justify-center active:scale-90" style={{ background: PEACH, opacity: calMonth === MONTHS_META.length - 1 ? 0.35 : 1 }}><ChevronRight size={13} color={INK} strokeWidth={2.4} /></button>
                  </span>
                ) : (
                  <div className="flex-1 flex justify-between">
                    {CAL_DAYS.slice(calStart, calStart + 7).map((day, i) => {
                      const has = bookings.some((b) => b.when === 'upcoming' && b.dom === String(day.n));
                      return (
                        <div key={i} className="flex flex-col items-center gap-1 rounded-[10px] px-1.5 py-1.5" style={{ background: has ? TINT : 'transparent', minWidth: 34 }}>
                          <span className="text-[10px] font-bold" style={{ color: has ? CORAL : '#C4BBB0' }}>{day.d}</span>
                          <span className="text-[13px] font-extrabold leading-none" style={{ color: has ? INK : TERT }}>{day.n <= 28 ? day.n : day.n - 28}</span>
                          <span className="w-1 h-1 rounded-full" style={{ background: has ? CORAL : 'transparent' }} />
                        </div>
                      );
                    })}
                  </div>
                )}
                {!monthOpen && <button onClick={() => setCalStart(Math.min(CAL_DAYS.length - 7, calStart + 1))} disabled={calStart >= CAL_DAYS.length - 7} className="w-7 h-9 flex items-center justify-center shrink-0 active:scale-90 transition-transform" style={{ opacity: calStart >= CAL_DAYS.length - 7 ? 0.3 : 1 }}><ChevronRight size={15} color={MUTED} strokeWidth={2.4} /></button>}
                <button onClick={() => setMonthOpen(!monthOpen)} className="w-8 h-9 flex items-center justify-center shrink-0 mr-1 active:scale-90 transition-transform"><ChevronDown size={16} color={MUTED} strokeWidth={2.4} style={{ transform: monthOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} /></button>
              </div>
              {monthOpen && (
                <div className="px-3 pb-3" style={{ borderTop: '1px solid ' + LINE }}>
                  <div className="grid grid-cols-7 gap-y-1 mt-3 mb-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i} className="text-center text-[10px] font-bold" style={{ color: '#C4BBB0' }}>{d}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-y-1">
                    {[...Array(MONTHS_META[calMonth].first)].map((_, i) => <span key={'x' + i} />)}
                    {[...Array(MONTHS_META[calMonth].days)].map((_, i) => {
                      const n = i + 1;
                      const bk = bookings.find((b) => b.when === 'upcoming' && b.dom === String(n) && (b.bm ?? 0) === calMonth);
                      return (
                        <button key={n} onClick={() => { if (bk) { setExpanded(bk.id); setMonthOpen(false); } }} className="flex flex-col items-center justify-center rounded-[10px] mx-auto transition-all active:scale-90" style={{ width: 34, height: 36, background: bk ? TINT : 'transparent' }}>
                          <span className="text-[12.5px] font-bold leading-none" style={{ color: bk ? CORAL : MUTED }}>{n}</span>
                          <span className="w-1 h-1 rounded-full mt-1" style={{ background: bk ? CORAL : 'transparent' }} />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-center mt-2" style={{ color: '#C4BBB0' }}>Tap a highlighted day to jump to its booking</p>
                </div>
              )}
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
                            <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{b.provider}{b.time ? ` · ${b.time}` : ''}{b.repeat ? ' · repeats weekly' : ''}</div>
                            <span className="inline-flex items-center gap-1 mt-1 text-[10.5px] font-bold" style={{ color: tone.c }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: tone.c, animation: b.status === 'Live' ? 'svPulse 1.4s ease-in-out infinite' : 'none' }} />{b.status === 'Live' ? 'Live now' : b.status}</span>
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
                              {isUp && b.status !== 'Live' && (
                                <button onClick={(e) => { e.stopPropagation(); cycleReminder(b.id); }} className="flex items-center gap-2 text-left active:opacity-70">
                                  <Bell size={12} color={CORAL} strokeWidth={2} className="shrink-0" />
                                  <span className="text-[12px] font-semibold" style={{ color: MUTED }}>Reminder · <span style={{ color: CORAL }}>{REMINDER_OPTS[remIdx[b.id] ?? 0]}</span></span>
                                  <span className="text-[10px] font-bold px-1.5 py-[1px] rounded-full" style={{ background: PEACH, color: TERT }}>Edit</span>
                                </button>
                              )}
                              {isUp && b.status === 'Pending' && <div className="flex items-center gap-2"><MessageCircle size={12} color={TERT} strokeWidth={2} className="shrink-0" /><span className="text-[12px]" style={{ color: TERT }}>{b.provider.split(' ')[0]} usually responds within ~1 h</span></div>}
                              {isUp && b.status === 'Pending' && <div className="flex items-center gap-2"><Clock size={12} color={AMBER} strokeWidth={2} className="shrink-0" /><span className="text-[12px] font-medium" style={{ color: AMBER }}>Auto-expires in 22 h if not confirmed. You won’t be charged</span></div>}
                              {b.repeat && <div className="flex items-center gap-2"><Repeat size={12} color={TERT} strokeWidth={2.2} className="shrink-0" /><span className="text-[12px]" style={{ color: TERT }}>Repeats weekly · manage anytime</span></div>}
                              {b.status === 'Live' && b.live && (
                                <div className="rounded-[12px] px-3.5 py-3" style={{ background: TINT }}>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold" style={{ color: CORAL }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: CORAL, animation: 'svPulse 1.4s ease-in-out infinite' }} />LIVE · {b.live.done} of {b.live.total} min</span>
                                    <span className="text-[11px] font-bold" style={{ color: MUTED }}>{b.live.km} km · photo {b.live.lastPhoto}</span>
                                  </div>
                                  <div className="h-[6px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.7)' }}>
                                    <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((b.live.done / b.live.total) * 100)}%`, background: CORAL }} />
                                  </div>
                                  {b.checkIns && b.checkIns.map(([tt, txt], ci) => (
                                    <div key={ci} className="flex items-center gap-2 mt-2"><span className="text-[10px] font-bold" style={{ color: TERT }}>{tt}</span><span className="text-[11.5px] font-medium" style={{ color: MUTED }}>{txt}</span></div>
                                  ))}
                                  <button onClick={() => setLiveOpen(true)} className="w-full mt-3 py-2.5 rounded-[12px] bg-white flex items-center justify-center gap-1.5 active:scale-[0.98] transition-transform" style={{ boxShadow: '0 2px 8px rgba(60,30,15,0.08)' }}>
                                    <MapPin size={13} color={CORAL} strokeWidth={2.2} /><span className="text-[12.5px] font-bold" style={{ color: CORAL }}>Watch live</span>
                                  </button>
                                </div>
                              )}
                              {b.notes && <div className="text-[12.5px] leading-[1.45] rounded-[10px] px-3 py-2" style={{ background: PEACH, color: MUTED }}>{b.notes}</div>}
                              {b.status === 'Completed' && !b.rated && (
                                <div className="rounded-[12px] px-3.5 py-3 flex items-center gap-3" style={{ background: TINT }}>
                                  <span className="flex-1 text-[12.5px] font-bold" style={{ color: INK }}>How was it? Rate {b.provider.split(' ')[0]}</span>
                                  <span className="flex gap-1">{[...Array(5)].map((_, si) => (
                                    <button key={si} onClick={(e) => { e.stopPropagation(); setRateFor({ booking: b, stars: si + 1 }); }} className="active:scale-90 transition-transform"><Star size={18} color={CORAL} strokeWidth={1.8} /></button>
                                  ))}</span>
                                </div>
                              )}
                              {b.checkIns && b.when === 'past' && b.status === 'Completed' && (
                                <div className="rounded-[16px] overflow-hidden" style={{ boxShadow: 'inset 0 0 0 1px ' + LINE }}>
                                  {/* walk summary mini-map */}
                                  <svg viewBox="0 0 350 120" className="w-full block" style={{ background: '#EFEAE2' }}>
                                    <path d="M 230 8 C 300 4 345 40 343 70 C 341 100 300 116 250 114 C 210 112 190 95 192 70 C 194 40 180 12 230 8 Z" fill="#E5EEDF" />
                                    <path d="M 0 64 C 60 56 110 76 170 62" stroke="#FFFFFF" strokeWidth="8" fill="none" strokeLinecap="round" />
                                    <path d="M 30 104 C 80 84 70 56 130 48 C 190 40 220 60 262 44 C 296 32 312 26 330 18" stroke={CORAL} strokeWidth="4" fill="none" strokeLinecap="round" />
                                    <circle cx="30" cy="104" r="5.5" fill="#FFFFFF" stroke={CORAL} strokeWidth="2.5" />
                                    <circle cx="330" cy="18" r="5.5" fill="#FFFFFF" stroke={GREEN} strokeWidth="2.5" />
                                  </svg>
                                  <div className="flex items-center py-2.5 bg-white">
                                    {[['45 min', 'duration'], ['3.2 km', 'distance'], ['4', 'photos']].map(([v, l], si) => (
                                      <div key={si} className="flex-1 flex flex-col items-center" style={{ borderLeft: si ? '1px solid ' + LINE : 'none' }}>
                                        <span className="text-[13.5px] font-extrabold leading-none" style={{ color: CORAL }}>{v}</span>
                                        <span className="text-[10px] font-medium mt-1" style={{ color: TERT }}>{l}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {b.checkIns && b.when === 'past' && (
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
                                  <button onClick={() => setChat({ name: b.provider, photo: b.photo })} className="flex-1 h-10 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98] bg-white" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}><MessageCircle size={14} color={INK} strokeWidth={2} /><span className="text-[13px] font-bold" style={{ color: INK }}>Message</span></button>
                                  {b.status !== 'Live' && <button onClick={() => { setReschedFor(b); setReschedDay(0); setReschedTime(1); }} className="flex-1 h-10 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ background: TINT }}><CalendarClock size={14} color={CORAL} strokeWidth={2} /><span className="text-[13px] font-bold" style={{ color: CORAL }}>Reschedule</span></button>}
                                </>
                              ) : (
                                <button onClick={() => { const p = PROVIDERS.find((x) => x.name === b.provider); if (p) openProfile(p.id, 'bookings'); else act('Book again'); }} className="flex-1 h-10 rounded-[12px] flex items-center justify-center active:scale-[0.98]" style={{ background: TINT }}><span className="text-[13px] font-bold" style={{ color: CORAL }}>Book again</span></button>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2.5 px-0.5">
                              <button onClick={() => { const p = PROVIDERS.find((x) => x.name === b.provider); if (p) openProfile(p.id, 'bookings'); else act('Profile unavailable'); }} className="flex items-center gap-1.5 py-1 active:opacity-60"><User size={12} color={TERT} strokeWidth={2.2} /><span className="text-[12px] font-bold" style={{ color: TERT }}>Go to profile</span></button>
                              {isUp && b.status !== 'Live' ? (
                                <button onClick={() => setCancelFor(b)} className="py-1 active:opacity-60"><span className="text-[12px] font-bold" style={{ color: DANGER }}>{b.status === 'Pending' ? 'Cancel request' : 'Cancel booking'}</span></button>
                              ) : (
                                <span className="py-1 text-[12px] font-medium" style={{ color: '#C4BBB0' }}>{b.status === 'Live' ? 'In progress' : b.status}</span>
                              )}
                            </div>
                            {isUp && b.status !== 'Live' && <button onClick={() => act('Added to your calendar')} className="w-full mt-1 py-1.5 active:opacity-60"><span className="text-[12px] font-bold" style={{ color: TERT }}>＋ Add to calendar</span></button>}
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

        {/* Rate dialog — stars + optional note */}
        {rateFor && (
          <div className="absolute inset-0 z-[175] flex items-center justify-center px-8" style={{ background: 'rgba(20,12,8,0.45)', animation: 'svFade 0.2s ease both' }} onClick={() => setRateFor(null)}>
            <div className="w-full rounded-[24px] bg-white p-6 text-center" style={{ animation: 'svPop 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }} onClick={(e) => e.stopPropagation()}>
              <img src={rateFor.booking.photo} alt="" className="w-14 h-14 rounded-full object-cover mx-auto mb-3" />
              <h2 className="text-[17px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Rate {rateFor.booking.provider.split(' ')[0]}</h2>
              <div className="flex justify-center gap-1.5 mt-3">
                {[...Array(5)].map((_, si) => (
                  <button key={si} onClick={() => setRateFor({ ...rateFor, stars: si + 1 })} className="active:scale-90 transition-transform">
                    <Star size={26} color="#E8B04A" fill={si < rateFor.stars ? '#E8B04A' : 'none'} strokeWidth={1.8} />
                  </button>
                ))}
              </div>
              <textarea placeholder="Add a note (optional)…" rows={2} className="w-full mt-4 rounded-[12px] px-3.5 py-2.5 outline-none text-[13.5px] font-medium text-[#111] placeholder:text-[#C4B8AC] resize-none" style={{ background: PEACH }} />
              <button onClick={() => submitRating(rateFor.booking.id, rateFor.stars)} className="w-full mt-4 py-3.5 rounded-[16px] active:scale-[0.98]" style={{ background: CORAL, boxShadow: '0 6px 18px rgba(232,93,42,0.26)' }}><span className="text-[14.5px] font-bold text-white">Submit</span></button>
            </div>
          </div>
        )}

        {/* Cancel confirm */}
        {cancelFor && (
          <div className="absolute inset-0 z-[175] flex items-center justify-center px-8" style={{ background: 'rgba(20,12,8,0.45)', animation: 'svFade 0.2s ease both' }} onClick={() => setCancelFor(null)}>
            <div className="w-full rounded-[24px] bg-white p-6 text-center" style={{ animation: 'svPop 0.22s cubic-bezier(0.34,1.56,0.64,1) both' }} onClick={(e) => e.stopPropagation()}>
              <h2 className="text-[17px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Cancel this booking?</h2>
              <p className="text-[13px] mt-2 leading-[1.5]" style={{ color: MUTED }}>{cancelFor.service} with {cancelFor.provider}. Free cancellation up to 24 h before.</p>
              <button onClick={() => confirmCancel(cancelFor.id)} className="w-full mt-5 py-3.5 rounded-[16px] active:scale-[0.98]" style={{ background: DANGER }}><span className="text-[14.5px] font-bold text-white">Cancel booking</span></button>
              <button onClick={() => setCancelFor(null)} className="w-full mt-2 py-2.5"><span className="text-[13.5px] font-bold" style={{ color: MUTED }}>Keep it</span></button>
            </div>
          </div>
        )}

        {/* Reschedule sheet */}
        {reschedFor && (
          <>
            <div className="absolute inset-0 z-[170]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'svFade 0.2s ease both' }} onClick={() => setReschedFor(null)} />
            <div className="absolute left-0 right-0 bottom-0 z-[172] rounded-t-[26px]" style={{ background: CREAM, boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'svSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
              <div className="flex justify-center pt-2.5 pb-1"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
              <div className="px-5 pt-1 pb-1 flex items-center gap-3">
                <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Reschedule</h2>
                <button onClick={() => setReschedFor(null)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
              </div>
              <div className="px-5 flex items-center justify-between">
                <p className="text-[12.5px]" style={{ color: TERT }}>{reschedFor.service} · {reschedFor.provider}</p>
                <button onClick={() => { setPickMonth(pickedResched ? pickedResched.m : 0); setPickCtx('resched'); }} className="inline-flex items-center gap-1 text-[12px] font-bold active:opacity-70" style={{ color: CORAL }}><CalendarDays size={12} strokeWidth={2.2} /> Full calendar</button>
              </div>
              <div className="px-5 mt-4">
                <DateScroller selected={pickedResched ? -1 : reschedDay} onSelect={(i) => { setPickedResched(null); setReschedDay(i); const s = slotsFor(DATES14[i].n); if (!s.includes(reschedTime)) setReschedTime(s[0] ?? 0); }} />
                {pickedResched && (
                  <button onClick={() => { setPickMonth(pickedResched.m); setPickCtx('resched'); }} className="mt-2 inline-flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full active:scale-95 transition-transform" style={{ background: CORAL }}>
                    <CalendarDays size={12} color="#fff" strokeWidth={2.2} />
                    <span className="text-[12px] font-bold text-white">{dateLabel(pickedResched.m, pickedResched.n)}</span>
                    <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>· change</span>
                  </button>
                )}
                {(() => { const selN = pickedResched ? pickedResched.n : DATES14[reschedDay].n; return (
                <div className="grid grid-cols-4 gap-2 mt-2">{TIMES.map((t, i) => {
                  const openSlot = slotsFor(selN).includes(i);
                  const on = reschedTime === i && openSlot;
                  return <button key={t} onClick={() => openSlot && setReschedTime(i)} disabled={!openSlot} className="h-[36px] rounded-[10px] text-[12px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? CORAL : openSlot ? '#fff' : 'transparent', color: on ? '#fff' : openSlot ? MUTED : '#D3CABF', boxShadow: on ? '0 4px 12px rgba(232,93,42,0.25)' : openSlot ? SHADOW : 'inset 0 0 0 1px #EAE2D8', textDecoration: openSlot ? 'none' : 'line-through' }}>{t}</button>;
                })}</div>
                ); })()}
                <p className="text-[11px] mt-3" style={{ color: TERT }}>{reschedFor.provider.split(' ')[0]} will need to confirm the new time.</p>
              </div>
              <div className="px-5 pt-4" style={{ paddingBottom: embedded ? 104 : 30 }}>
                <button onClick={() => confirmResched(reschedFor)} className="w-full py-3.5 rounded-[16px] active:scale-[0.98]" style={{ background: CORAL, boxShadow: '0 6px 18px rgba(232,93,42,0.26)' }}><span className="text-[14.5px] font-bold text-white">Request new time</span></button>
              </div>
            </div>
          </>
        )}

        {pickCtx === 'resched' && (
          <MonthPopup month={pickMonth} setMonth={setPickMonth} selected={pickedResched} onClose={() => setPickCtx(null)}
            onPick={(d) => { setPickedResched(d); const s = slotsFor(d.n); if (!s.includes(reschedTime)) setReschedTime(s[0] ?? 0); setPickCtx(null); }} />
        )}

        {/* Request sent — animated confirmation with live steps */}
        {confirmation && (
          <div className="absolute inset-0 z-[195] flex items-center justify-center px-7" style={{ background: 'rgba(20,12,8,0.5)', animation: 'svFade 0.2s ease both' }}>
            <div className="w-full rounded-[26px] bg-white px-6 pt-7 pb-5 text-center" style={{ animation: 'svPop 0.26s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <div className="relative mx-auto mb-4" style={{ width: 76, height: 76 }}>
                <span className="absolute inset-0 rounded-full" style={{ border: `2px solid ${CORAL}`, animation: 'svRing 1.4s 0.2s ease-out both' }} />
                <img src={confirmation.photo} alt="" className="absolute inset-0 w-full h-full rounded-full object-cover" />
                <span className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center border-[3px] border-white" style={{ background: GREEN, animation: 'svBadge 0.4s 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}><Check size={15} color="#fff" strokeWidth={3.2} /></span>
              </div>
              <h2 className="text-[19px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>Request sent</h2>
              <p className="text-[12.5px] mt-1" style={{ color: TERT }}>{confirmation.service} · {confirmation.when}{confirmation.repeat ? ' · repeats weekly' : ''}</p>

              {/* live steps */}
              <div className="flex items-start justify-between mt-6 px-1">
                {[{ l: 'Request sent', done: true }, { l: `${confirmation.provider.split(' ')[0]} confirms`, now: true }, { l: 'Day of the walk' }].map((s, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="flex-1 h-[2px] rounded-full mt-[11px] mx-1" style={{ background: s.now || s.done ? '#F6C9B4' : LINE }} />}
                    <span className="flex flex-col items-center" style={{ width: 76 }}>
                      <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: s.done ? GREEN : s.now ? TINT : PEACH, boxShadow: s.now ? `0 0 0 4px ${TINT}66` : 'none', animation: s.now ? 'svPulse 1.6s ease-in-out infinite' : 'none' }}>
                        {s.done ? <Check size={12} color="#fff" strokeWidth={3.2} /> : <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.now ? CORAL : '#C9BBAE' }} />}
                      </span>
                      <span className="text-[10px] font-semibold mt-1.5 leading-tight" style={{ color: s.done ? GREEN : s.now ? CORAL : TERT }}>{s.l}</span>
                    </span>
                  </React.Fragment>
                ))}
              </div>
              <p className="text-[11px] mt-4" style={{ color: TERT }}>{confirmation.provider.split(' ')[0]} usually replies within ~1 h. We’ll notify you.</p>
              <button onClick={() => setConfirmation(null)} className="w-full mt-4 py-3.5 rounded-[16px] active:scale-[0.98]" style={{ background: CORAL, boxShadow: '0 6px 18px rgba(232,93,42,0.26)' }}><span className="text-[14.5px] font-bold text-white">View booking</span></button>
            </div>
          </div>
        )}

        {liveOpen && <LiveWalkView b={bookings.find((x) => x.status === 'Live')} onClose={() => setLiveOpen(false)} onMessage={(p) => setChat(p)} embedded={embedded} />}
        {chat && <ChatOverlay provider={chat} onClose={() => setChat(null)} embedded={embedded} />}
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
                    <img src={p.photo} alt={p.name} className="w-full h-[110px] rounded-[12px] object-cover" />
                    <button onClick={(e) => { e.stopPropagation(); toggleSave(p.id); }} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center active:scale-90" style={{ background: 'rgba(255,255,255,0.94)' }}><Heart size={13} color={CORAL} fill={CORAL} strokeWidth={2} /></button>
                    {p.today && <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 pl-1.5 pr-2 py-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.92)' }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /><span className="text-[10px] font-bold" style={{ color: GREEN }}>Today</span></span>}
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
                    <img src={p.photo} alt={p.name} className="w-[64px] h-[64px] rounded-[12px] object-cover shrink-0" />
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
        <div className="relative">
          <div className="flex items-center gap-2.5 bg-white rounded-[16px] px-3.5 h-[46px]" style={{ boxShadow: SHADOW }}>
            <Search size={16} color={TERT} strokeWidth={2} />
            <input placeholder={`Find care for ${petName}…`} className="flex-1 bg-transparent outline-none text-[14px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" />
            <div className="flex items-center -space-x-1.5">
              {PETS.map((p) => { const on = petSel.includes(p.id); return <button key={p.id} onClick={() => togglePet(p.id)} className="rounded-full p-[1.5px] active:scale-95 transition-all duration-200" style={{ width: on ? 30 : 26, height: on ? 30 : 26, background: on ? CORAL : '#E5DED5', zIndex: on ? 2 : 1, position: 'relative', opacity: on ? 1 : 0.75 }}><img src={p.photo} alt={p.name} className="w-full h-full rounded-full object-cover" /></button>; })}
            </div>
          </div>
          {/* quiet, static hint marker on the bar's corner — doesn't cover the pets */}
          <button onClick={() => setPetHint(!petHint)} className="absolute w-[16px] h-[16px] rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ top: -5, right: -4, background: '#fff', boxShadow: '0 1px 4px rgba(60,30,15,0.16)', zIndex: 5 }}>
            <span className="text-[10px] font-extrabold leading-none" style={{ color: CORAL }}>!</span>
          </button>
          {petHint && (
            <div className="absolute right-0 z-50 rounded-[16px] bg-white p-3.5" style={{ top: 52, width: 230, boxShadow: '0 8px 30px rgba(60,30,15,0.16)', animation: 'svPop 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}>
              <div className="text-[12.5px] font-bold" style={{ color: INK }}>Booking for who?</div>
              <p className="text-[11.5px] leading-[1.45] mt-1" style={{ color: MUTED }}>Tap a pet to include or remove them. You can select <span style={{ color: CORAL, fontWeight: 700 }}>one or both</span> for the same booking.</p>
              <button onClick={() => setPetHint(false)} className="mt-2 text-[12px] font-bold active:opacity-70" style={{ color: CORAL }}>Got it</button>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="flex justify-between mt-6 px-2.5">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <button key={c.id} onClick={() => c.live ? (setSort('Recommended'), setView({ kind: 'browse', cat: c.id })) : act(`${c.label} is coming soon. We’ll let you know`)} className="relative flex flex-col items-center gap-2 active:scale-95 transition-transform">
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
            <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: TINT }}><CalendarClock size={16} color={CORAL} strokeWidth={2} /></span>
            <div className="flex-1 min-w-0"><div className="text-[13px] font-bold" style={{ color: INK }}>Bookings</div><div className="text-[10.5px] mt-[1px]" style={{ color: TERT }}>{upcoming.length} upcoming</div></div>
            <ChevronRight size={14} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />
          </button>
          <button onClick={() => setView({ kind: 'saved' })} className="flex-1 bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-2.5 text-left active:scale-[0.98] transition-transform" style={{ boxShadow: SHADOW }}>
            <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: TINT }}><Heart size={15} color={CORAL} strokeWidth={2} /></span>
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
        <SectionLabel action="See all" onAction={() => { setSort('Recommended'); setView({ kind: 'browse', cat: 'walking' }); }}>Picked for {petName}</SectionLabel>
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1" style={{ scrollbarWidth: 'none' }}>
          {DETAILED.filter((p) => p.recommended).map((p) => (
            <button key={p.id} onClick={() => openProfile(p.id, 'home')} className="shrink-0 bg-white rounded-[18px] p-3 text-left active:scale-[0.98] transition-transform" style={{ width: 150, boxShadow: SHADOW }}>
              <div className="relative">
                <img src={p.photo} alt={p.name} className="w-full h-[92px] rounded-[12px] object-cover" />
                {p.today && <span className="absolute top-2 left-2 inline-flex items-center gap-1 pl-1.5 pr-2 py-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.92)' }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /><span className="text-[10px] font-bold" style={{ color: GREEN }}>Today</span></span>}
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
            <span className="absolute -top-0.5 -right-0.5 w-[14px] h-[14px] rounded-full flex items-center justify-center text-[10px] font-extrabold text-white" style={{ background: CORAL, border: '1.5px solid #fff' }}>!</span>
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-bold" style={{ color: INK }}>More services on the way</div>
            <div className="text-[10.5px] mt-[1px]" style={{ color: TERT }}>Training, daycare and more on the way</div>
          </div>
          <ChevronRight size={14} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />
        </button>

        {/* Refer — slim */}
        <div className="rounded-[16px] mt-5 px-3.5 py-2.5 flex items-center gap-3" style={{ background: TINT }}>
          <Gift size={16} color={CORAL} strokeWidth={2} className="shrink-0" />
          <span className="flex-1 text-[12.5px] font-semibold truncate" style={{ color: INK }}>Give CHF 10, get CHF 10</span>
          <button onClick={() => setInviteOpen(true)} className="shrink-0 text-[12.5px] font-bold active:opacity-70" style={{ color: CORAL }}>Invite</button>
        </div>

        {/* Become a pro — quiet entry */}
        <button onClick={() => { window.location.href = '/pro-registration'; }} className="w-full rounded-[16px] mt-2.5 px-3.5 py-2.5 flex items-center gap-3 bg-white active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
          <Footprints size={16} color={CORAL} strokeWidth={2} className="shrink-0" />
          <span className="flex-1 text-[12.5px] font-semibold truncate text-left" style={{ color: INK }}>Become a walker or sitter and earn up to CHF 35/h</span>
          <ChevronRight size={14} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />
        </button>
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
            <p className="px-5 text-[12.5px] leading-[1.5]" style={{ color: TERT }}>We’re adding new services through the year. You’ll know the moment they launch near you.</p>
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

      {inviteOpen && <InviteFriends embedded onExit={() => setInviteOpen(false)} />}
      {toast && <Toast embedded={embedded} msg={toast} />}
      {!embedded && <PreviewHeader />}
    </Wrap>
  );
};

export default ServicesV2;
