import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Bell, Search, Footprints, Home, Scissors, Stethoscope,
  Star, Heart, ChevronRight, ChevronLeft, MapPin, MessageCircle, CalendarClock, X, Check, BadgeCheck, Repeat,
} from 'lucide-react';

/**
 * 94_SERVICES_v1.jsx — the Services tab, Revolut-grade.
 * Discover: circular category actions, smart "next up" strip, book-again,
 * featured provider cards + compact list. Tapping a category opens an
 * in-tab browse (sorted, clean rows). Tapping a provider opens a rich
 * profile sheet (verified, stats, services & prices, reviews, availability)
 * with a real booking step that adds a Pending booking to Bookings.
 * `embedded` renders inside the dashboard under the global header.
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
  { id: 'walking', label: 'Walking', icon: Footprints },
  { id: 'sitting', label: 'Sitting', icon: Home },
  { id: 'grooming', label: 'Grooming', icon: Scissors },
  { id: 'vet', label: 'Vet', icon: Stethoscope },
];
const PROVIDERS = [
  { id: 'pr1', cat: 'walking', name: 'Lukas F.', role: 'Dog walker', rating: 4.9, reviews: 132, dist: '0.8 km', price: 22, priceLabel: 'CHF 22/h', photo: 'https://i.pravatar.cc/150?u=lukas_walker', verified: true, today: true, featured: true,
    stats: { a: ['530', 'walks'], b: ['92%', 'repeat'], c: ['~1 h', 'reply'] }, bio: 'Full-time walker in Seefeld. Calm energy, great with reactive dogs, photo updates on every walk.',
    services: [{ n: '30 min walk', p: 'CHF 14' }, { n: '60 min walk', p: 'CHF 22' }, { n: '90 min walk', p: 'CHF 33' }],
    review: { who: 'Anna M.', txt: 'Leo comes back happy and tired every single time. Lukas sends the best photo updates.' } },
  { id: 'pr2', cat: 'grooming', name: 'Sofia Lambrou', role: 'Groomer', rating: 4.9, reviews: 208, dist: '1.2 km', price: 65, priceLabel: 'from CHF 65', photo: 'https://i.pravatar.cc/150?u=sofia_walker', verified: true, today: false, featured: true,
    stats: { a: ['1.2k', 'grooms'], b: ['96%', 'repeat'], c: ['~2 h', 'reply'] }, bio: 'Boutique studio in Niederdorf. Gentle handling, breed-standard cuts, natural products only.',
    services: [{ n: 'Bath & brush', p: 'CHF 45' }, { n: 'Full groom', p: 'CHF 65' }, { n: 'Deshedding', p: 'CHF 80' }],
    review: { who: 'Marco R.', txt: 'The only groomer our anxious golden actually loves. Worth every franc.' } },
  { id: 'pr3', cat: 'sitting', name: 'Maria K.', role: 'Pet sitter', rating: 4.8, reviews: 96, dist: '0.5 km', price: 38, priceLabel: 'CHF 38/night', photo: 'https://i.pravatar.cc/150?u=maria_sitter', verified: true, today: true, featured: false,
    stats: { a: ['210', 'stays'], b: ['88%', 'repeat'], c: ['~30 m', 'reply'] }, bio: 'Your pet stays at my quiet flat by the lake — daily walks, couch privileges included.',
    services: [{ n: 'Day sitting', p: 'CHF 25' }, { n: 'Overnight', p: 'CHF 38' }, { n: 'Week package', p: 'CHF 240' }],
    review: { who: 'Julia S.', txt: 'Tao was so relaxed when we got back. Daily photos and a little diary — adorable.' } },
  { id: 'pr4', cat: 'vet', name: 'Dr. Reza Patel', role: 'Veterinarian', rating: 4.9, reviews: 311, dist: '2.1 km', price: 120, priceLabel: 'from CHF 120', photo: 'https://i.pravatar.cc/150?u=dr_reza', verified: true, today: true, featured: true,
    stats: { a: ['12 y', 'practice'], b: ['4.9', 'rating'], c: ['24/7', 'on call'] }, bio: 'Lakeshore Vet, Bellevue. Preventive care, surgery and a very generous treat jar.',
    services: [{ n: 'Consultation', p: 'CHF 120' }, { n: 'Vaccination', p: 'CHF 85' }, { n: 'Dental check', p: 'CHF 150' }],
    review: { who: 'Stefan B.', txt: 'Explains everything clearly, never upsells. Our dogs actually like going.' } },
  { id: 'pr5', cat: 'walking', name: 'Nina T.', role: 'Dog walker', rating: 4.7, reviews: 58, dist: '1.6 km', price: 19, priceLabel: 'CHF 19/h', photo: 'https://i.pravatar.cc/150?u=nina_walker', verified: false, today: true, featured: false,
    stats: { a: ['160', 'walks'], b: ['81%', 'repeat'], c: ['~3 h', 'reply'] }, bio: 'Student & lifelong dog person. Energetic walks, parks and trails.',
    services: [{ n: '30 min walk', p: 'CHF 12' }, { n: '60 min walk', p: 'CHF 19' }],
    review: { who: 'Petra K.', txt: 'Great with our young lab — comes back perfectly tired.' } },
  { id: 'pr6', cat: 'walking', name: 'Jonas W.', role: 'Dog walker', rating: 4.8, reviews: 84, dist: '2.3 km', price: 24, priceLabel: 'CHF 24/h', photo: 'https://i.pravatar.cc/150?u=jonas_walker', verified: true, today: false, featured: false,
    stats: { a: ['310', 'walks'], b: ['90%', 'repeat'], c: ['~2 h', 'reply'] }, bio: 'Trail runner — perfect for high-energy dogs that need real exercise.',
    services: [{ n: '60 min run', p: 'CHF 24' }, { n: '90 min trail', p: 'CHF 36' }],
    review: { who: 'Felix H.', txt: 'Our husky finally gets the workout he needs.' } },
];
const INITIAL_BOOKINGS = [
  { id: 'b1', when: 'upcoming', status: 'Confirmed', service: 'Grooming', provider: 'Sofia Lambrou', photo: 'https://i.pravatar.cc/150?u=sofia_walker', date: 'Mon, Feb 16 · 10:00–11:00', pet: 'Leo', total: 'CHF 65.00', location: 'Sofia’s studio · Niederdorf', notes: 'Full groom — wash, trim, nails.' },
  { id: 'b2', when: 'upcoming', status: 'Confirmed', service: 'Grooming', provider: 'Bright Paws · Elena', photo: 'https://i.pravatar.cc/150?u=elena_groomer', date: 'Wed, Feb 18 · 15:30–17:00', pet: 'Leo', total: 'CHF 85.00', location: 'Bright Paws · Seefeld', notes: 'Bath, blow-dry & style with Elena.' },
  { id: 'b3', when: 'upcoming', status: 'Confirmed', service: 'Vet visit', provider: 'Lakeshore Vet · Dr. Reza', photo: 'https://i.pravatar.cc/150?u=dr_reza', date: 'Fri, Feb 20 · 09:00–09:30', pet: 'Leo', total: 'CHF 120.00', location: 'Lakeshore Vet · Bellevue', notes: 'Annual checkup & vaccinations.' },
  { id: 'b5', when: 'past', status: 'Completed', service: '60 min walk', provider: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker', date: 'Fri, Feb 6 · 09:00–10:00', pet: 'Leo', total: 'CHF 22.00', location: 'Zürichhorn loop', notes: '' },
  { id: 'b6', when: 'past', status: 'Cancelled', service: 'Overnight sitting', provider: 'Maria K.', photo: 'https://i.pravatar.cc/150?u=maria_sitter', date: 'Sat, Jan 31', pet: 'Tao', total: '—', location: '', notes: 'Cancelled by you.' },
];
const SEGMENTS = ['Discover', 'Bookings', 'Saved'];
const SORTS = ['Recommended', 'Top rated', 'Price', 'Nearby'];
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

const Rating = ({ p, dark }) => (
  <span className="inline-flex items-center gap-1"><Star size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} /><span className="text-[11.5px] font-bold" style={{ color: dark ? '#fff' : INK }}>{p.rating}</span><span className="text-[11px]" style={{ color: dark ? 'rgba(255,255,255,0.75)' : TERT }}>({p.reviews})</span></span>
);

const statusTone = (s) => s === 'Confirmed' ? { bg: '#EAF7EF', c: GREEN } : s === 'Pending' ? { bg: '#FBF1E2', c: AMBER } : s === 'Cancelled' ? { bg: '#FEE8E7', c: DANGER } : { bg: PEACH, c: MUTED };

const ProviderRow = ({ p, saved, onSave, onTap, last }) => (
  <div className="relative">
    <button onClick={onTap} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02] transition-colors">
      <span className="relative shrink-0">
        <img src={p.photo} alt={p.name} className="w-11 h-11 rounded-full object-cover" />
        {p.today && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full" style={{ background: GREEN, border: '2px solid #fff' }} />}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1"><span className="text-[14px] font-semibold truncate" style={{ color: INK }}>{p.name}</span>{p.verified && <BadgeCheck size={13} color={CORAL} strokeWidth={2.2} className="shrink-0" />}</div>
        <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{p.role} · {p.dist}{p.today ? ' · Available today' : ''}</div>
        <div className="mt-1"><Rating p={p} /></div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <button onClick={(e) => { e.stopPropagation(); onSave(); }} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: saved ? TINT : PEACH }}>
          <Heart size={15} color={saved ? CORAL : MUTED} fill={saved ? CORAL : 'none'} strokeWidth={2} />
        </button>
        <span className="text-[12px] font-bold whitespace-nowrap" style={{ color: INK }}>{p.priceLabel}</span>
      </div>
    </button>
    {!last && <div className="absolute bottom-0 left-[62px] right-0 h-px" style={{ background: LINE }} />}
  </div>
);

/* ── Provider profile sheet (with booking step) ─────────────────────── */
const ProviderSheet = ({ p, saved, onSave, onClose, onBook, embedded }) => {
  const [svc, setSvc] = useState(1 < p.services.length ? 1 : 0);
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(1);
  const sel = p.services[svc] || p.services[0];
  return (
    <>
      <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'svFade 0.2s ease both' }} onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] flex flex-col" style={{ background: CREAM, maxHeight: '88%', boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'svSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
        <div className="flex justify-center pt-2.5 pb-1 shrink-0"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
        {/* header */}
        <div className="px-5 pt-1 pb-3 flex items-center gap-3.5 shrink-0">
          <span className="relative shrink-0">
            <img src={p.photo} alt={p.name} className="w-[60px] h-[60px] rounded-full object-cover" style={{ boxShadow: SHADOW }} />
            {p.today && <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full" style={{ background: GREEN, border: '2px solid ' + CREAM }} />}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5"><h2 className="text-[18px] font-extrabold tracking-[-0.01em] truncate" style={{ color: INK }}>{p.name}</h2>{p.verified && <BadgeCheck size={16} color={CORAL} strokeWidth={2.2} className="shrink-0" />}</div>
            <div className="text-[12px] mt-0.5" style={{ color: TERT }}>{p.role} · {p.dist}</div>
            <div className="mt-1"><Rating p={p} /></div>
          </div>
          <button onClick={onSave} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-90 shrink-0" style={{ background: saved ? TINT : PEACH }}><Heart size={16} color={saved ? CORAL : MUTED} fill={saved ? CORAL : 'none'} strokeWidth={2} /></button>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-95 shrink-0" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
        </div>

        <div className="overflow-y-auto px-5" style={{ scrollbarWidth: 'none', paddingBottom: embedded ? 190 : 110 }}>
          {/* stats */}
          <div className="rounded-[16px] bg-white flex items-center py-3" style={{ boxShadow: SHADOW }}>
            {[p.stats.a, p.stats.b, p.stats.c].map((s, i) => (
              <div key={i} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid ' + LINE : 'none' }}>
                <span className="text-[16px] font-extrabold leading-none" style={{ color: CORAL }}>{s[0]}</span>
                <span className="text-[10px] font-medium mt-1.5" style={{ color: TERT }}>{s[1]}</span>
              </div>
            ))}
          </div>

          <p className="text-[13px] leading-[1.5] mt-3.5 px-0.5" style={{ color: MUTED }}>{p.bio}</p>

          {/* services & prices */}
          <SectionLabel>Services & prices</SectionLabel>
          <div className="rounded-[16px] bg-white overflow-hidden" style={{ boxShadow: SHADOW }}>
            {p.services.map((s, i) => {
              const on = svc === i;
              return (
                <button key={s.n} onClick={() => setSvc(i)} className="relative w-full flex items-center gap-3 px-4 py-3 text-left active:bg-black/[0.02]">
                  <span className="w-[20px] h-[20px] rounded-full flex items-center justify-center shrink-0" style={{ background: on ? CORAL : 'transparent', border: on ? 'none' : '1.6px solid #DDD4C9' }}>{on && <Check size={12} color="#fff" strokeWidth={3.2} />}</span>
                  <span className="flex-1 text-[14px] font-semibold" style={{ color: INK }}>{s.n}</span>
                  <span className="text-[13.5px] font-bold" style={{ color: on ? CORAL : MUTED }}>{s.p}</span>
                  {i < p.services.length - 1 && <div className="absolute bottom-0 left-[46px] right-0 h-px" style={{ background: LINE }} />}
                </button>
              );
            })}
          </div>

          {/* availability */}
          <SectionLabel>Availability</SectionLabel>
          <div className="flex gap-2">{DAYS.map((d, i) => { const on = day === i; return <button key={d} onClick={() => setDay(i)} className="flex-1 h-[42px] rounded-[12px] text-[13px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>{d}</button>; })}</div>
          <div className="flex gap-2 mt-2">{TIMES.map((t, i) => { const on = time === i; return <button key={t} onClick={() => setTime(i)} className="flex-1 h-[38px] rounded-[11px] text-[12.5px] font-bold active:scale-[0.97] transition-all" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.6px ${CORAL}` : SHADOW }}>{t}</button>; })}</div>

          {/* review */}
          <SectionLabel>Latest review</SectionLabel>
          <div className="rounded-[16px] bg-white px-4 py-3.5" style={{ boxShadow: SHADOW }}>
            <div className="flex items-center gap-1.5 mb-1.5">{[...Array(5)].map((_, i) => <Star key={i} size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} />)}<span className="text-[11.5px] font-bold ml-1" style={{ color: INK }}>{p.review.who}</span></div>
            <p className="text-[13px] leading-[1.5]" style={{ color: MUTED }}>“{p.review.txt}”</p>
          </div>
        </div>

        {/* sticky CTA */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pt-3 rounded-b-[26px]" style={{ paddingBottom: embedded ? 102 : 28, background: `linear-gradient(to top, ${CREAM} 70%, rgba(247,245,242,0))` }}>
          <button onClick={() => onBook(p, sel, DAYS[day], TIMES[time])} className="w-full py-4 rounded-[16px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.3)' }}>
            <span className="text-[15px] font-bold text-white">Request booking</span>
            <span className="text-[13px] font-bold" style={{ color: 'rgba(255,255,255,0.8)' }}>· {sel.p}</span>
          </button>
        </div>
      </div>
    </>
  );
};

const ServicesV2 = ({ embedded = false, initialSegment = 'discover', focusedBookingId = null, onClearFocus }) => {
  const [segment, setSegment] = useState(focusedBookingId ? 'Bookings' : (initialSegment === 'bookings' ? 'Bookings' : 'Discover'));
  const [browse, setBrowse] = useState(null); // category id or null
  const [sort, setSort] = useState('Recommended');
  const [pet, setPet] = useState('leo');
  const [saved, setSaved] = useState(['pr2']);
  const [profile, setProfile] = useState(null); // provider obj
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [bkFilter, setBkFilter] = useState('upcoming');
  const [expanded, setExpanded] = useState(focusedBookingId);
  const [toast, setToast] = useState('');
  const act = (m) => { setToast(m); setTimeout(() => setToast(''), 1700); };
  useEffect(() => { if (focusedBookingId && onClearFocus) onClearFocus(); // eslint-disable-next-line
  }, []);
  const toggleSave = (id) => setSaved((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const petName = PETS.find((p) => p.id === pet)?.name || 'Leo';
  const list = bookings.filter((b) => b.when === bkFilter);
  const savedProviders = PROVIDERS.filter((p) => saved.includes(p.id));
  const nextUp = bookings.find((b) => b.when === 'upcoming');
  const lastDone = bookings.find((b) => b.status === 'Completed');
  const featured = PROVIDERS.filter((p) => p.featured);

  const browseList = browse ? [...PROVIDERS.filter((p) => p.cat === browse)].sort((a, b) =>
    sort === 'Top rated' ? b.rating - a.rating : sort === 'Price' ? a.price - b.price : sort === 'Nearby' ? parseFloat(a.dist) - parseFloat(b.dist) : (b.featured === a.featured ? b.rating - a.rating : b.featured ? 1 : -1)
  ) : [];

  const requestBooking = (p, svcSel, daySel, timeSel) => {
    const id = 'b' + Math.floor(Math.random() * 100000);
    setBookings((prev) => [{ id, when: 'upcoming', status: 'Pending', service: svcSel.n, provider: p.name, photo: p.photo, date: `${daySel} · ${timeSel}`, pet: petName, total: svcSel.p + '.00', location: p.role === 'Groomer' ? 'At the studio' : 'Pickup at home', notes: `Waiting for ${p.name.split(' ')[0]} to confirm.` }, ...prev]);
    setProfile(null); setBrowse(null); setSegment('Bookings'); setBkFilter('upcoming'); setExpanded(id);
    act('Request sent — waiting for confirmation');
  };

  const inner = (
    <div className="absolute inset-0" style={{ background: CREAM }}>
      <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 96, paddingBottom: embedded ? 104 : 36, scrollbarWidth: 'none' }}>

        {/* ── CATEGORY BROWSE (in-tab page) ── */}
        {browse ? (
          <>
            <div className="flex items-center gap-3 mt-1">
              <button onClick={() => setBrowse(null)} className="w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 shrink-0" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color={INK} strokeWidth={2.2} /></button>
              <div className="flex-1">
                <div className="text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>{CATEGORIES.find((c) => c.id === browse)?.label}</div>
                <div className="text-[11.5px]" style={{ color: TERT }}>{browseList.length} providers near you</div>
              </div>
            </div>
            <div className="flex gap-2 mt-4 overflow-x-auto -mx-5 px-5 pb-1" style={{ scrollbarWidth: 'none' }}>
              {SORTS.map((s) => { const on = sort === s; return <button key={s} onClick={() => setSort(s)} className="shrink-0 px-3.5 h-8 rounded-full text-[12.5px] font-bold transition-all active:scale-95" style={{ background: on ? '#FFF3EC' : '#fff', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.5px ${CORAL}` : SHADOW }}>{s}</button>; })}
            </div>
            <div className="bg-white rounded-[18px] overflow-hidden mt-3" style={{ boxShadow: SHADOW }}>
              {browseList.map((p, i) => <ProviderRow key={p.id} p={p} saved={saved.includes(p.id)} onSave={() => toggleSave(p.id)} onTap={() => setProfile(p)} last={i === browseList.length - 1} />)}
              {!browseList.length && <div className="px-4 py-6 text-center text-[13px]" style={{ color: TERT }}>No providers in this category yet.</div>}
            </div>
          </>
        ) : (
          <>
            {/* Segments */}
            <div className="flex gap-6" style={{ borderBottom: '1px solid ' + LINE }}>
              {SEGMENTS.map((s) => {
                const on = segment === s;
                const count = s === 'Bookings' ? bookings.filter((b) => b.when === 'upcoming').length : s === 'Saved' ? saved.length : 0;
                return (
                  <button key={s} onClick={() => setSegment(s)} className="relative shrink-0 pt-1.5 pb-2.5 text-[14px] font-bold transition-colors flex items-center gap-1.5" style={{ color: on ? CORAL : TERT }}>
                    {s}{count > 0 && <span className="text-[10px] font-extrabold px-1.5 py-[1px] rounded-full" style={{ background: on ? TINT : PEACH, color: on ? CORAL : TERT }}>{count}</span>}
                    {on && <span className="absolute left-0 right-0 rounded-full" style={{ bottom: -1, height: 2.5, background: CORAL }} />}
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
                    {PETS.map((p) => {
                      const on = pet === p.id;
                      return <button key={p.id} onClick={() => setPet(p.id)} className="w-7 h-7 rounded-full p-[1.5px] active:scale-95 transition-all" style={{ background: on ? CORAL : '#E5DED5', zIndex: on ? 2 : 1, position: 'relative' }}><img src={p.photo} alt={p.name} className="w-full h-full rounded-full object-cover" /></button>;
                    })}
                  </div>
                </div>

                {/* Circular category actions */}
                <div className="flex justify-between mt-6 px-2.5">
                  {CATEGORIES.map((c) => {
                    const Icon = c.icon;
                    return (
                      <button key={c.id} onClick={() => { setBrowse(c.id); setSort('Recommended'); }} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                        <span className="w-[56px] h-[56px] rounded-full flex items-center justify-center bg-white" style={{ boxShadow: SHADOW }}><Icon size={21} color={CORAL} strokeWidth={2} /></span>
                        <span className="text-[11.5px] font-semibold" style={{ color: INK }}>{c.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Next up — slim smart strip */}
                {nextUp && (
                  <button onClick={() => { setSegment('Bookings'); setBkFilter('upcoming'); setExpanded(nextUp.id); }} className="w-full mt-6 bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-3 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
                    <img src={nextUp.photo} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold truncate" style={{ color: INK }}>{nextUp.service} · {nextUp.provider}</div>
                      <div className="text-[11.5px] mt-0.5 font-semibold" style={{ color: CORAL }}>{nextUp.date}</div>
                    </div>
                    <span className="text-[10.5px] font-bold px-2 py-[3px] rounded-full shrink-0" style={{ background: statusTone(nextUp.status).bg, color: statusTone(nextUp.status).c }}>{nextUp.status}</span>
                    <ChevronRight size={15} color="#CFC7BD" strokeWidth={2.2} className="shrink-0" />
                  </button>
                )}

                {/* Featured providers — horizontal cards */}
                <SectionLabel>Featured near you</SectionLabel>
                <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1" style={{ scrollbarWidth: 'none' }}>
                  {featured.map((p) => (
                    <button key={p.id} onClick={() => setProfile(p)} className="shrink-0 bg-white rounded-[18px] p-3 text-left active:scale-[0.98] transition-transform" style={{ width: 150, boxShadow: SHADOW }}>
                      <div className="relative">
                        <img src={p.photo} alt={p.name} className="w-full h-[96px] rounded-[13px] object-cover" />
                        {p.today && <span className="absolute top-2 left-2 inline-flex items-center gap-1 pl-1.5 pr-2 py-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.92)' }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} /><span className="text-[9px] font-bold" style={{ color: GREEN }}>Today</span></span>}
                      </div>
                      <div className="flex items-center gap-1 mt-2"><span className="text-[13px] font-bold truncate" style={{ color: INK }}>{p.name}</span>{p.verified && <BadgeCheck size={12} color={CORAL} strokeWidth={2.2} className="shrink-0" />}</div>
                      <div className="text-[10.5px] mt-0.5" style={{ color: TERT }}>{p.role}</div>
                      <div className="flex items-center justify-between mt-1.5"><Rating p={p} /><span className="text-[11px] font-bold" style={{ color: INK }}>{p.priceLabel.replace('from ', '')}</span></div>
                    </button>
                  ))}
                </div>

                {/* Book again — smart reuse */}
                {lastDone && (
                  <>
                    <SectionLabel>Book again</SectionLabel>
                    <div className="bg-white rounded-[16px] px-3.5 py-3 flex items-center gap-3" style={{ boxShadow: SHADOW }}>
                      <img src={lastDone.photo} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold truncate" style={{ color: INK }}>{lastDone.service} · {lastDone.provider}</div>
                        <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>Last time {lastDone.date.split(' · ')[0]}</div>
                      </div>
                      <button onClick={() => { const p = PROVIDERS.find((x) => x.name === lastDone.provider); if (p) setProfile(p); }} className="shrink-0 inline-flex items-center gap-1.5 px-3 h-9 rounded-full active:scale-95 transition-transform" style={{ background: TINT }}><Repeat size={13} color={CORAL} strokeWidth={2.4} /><span className="text-[12.5px] font-bold" style={{ color: CORAL }}>Rebook</span></button>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ── BOOKINGS ── */}
            {segment === 'Bookings' && (
              <>
                <div className="flex gap-2 mt-4">
                  {[{ id: 'upcoming', l: 'Upcoming' }, { id: 'past', l: 'Past' }].map((f) => {
                    const on = bkFilter === f.id;
                    return <button key={f.id} onClick={() => setBkFilter(f.id)} className="px-4 h-9 rounded-full text-[13px] font-bold transition-all active:scale-95" style={{ background: on ? '#FFF3EC' : '#FFFFFF', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.5px ${CORAL}` : SHADOW }}>{f.l}</button>;
                  })}
                </div>
                <div className="flex flex-col gap-2.5 mt-4">
                  {list.map((b) => {
                    const tone = statusTone(b.status);
                    const open = expanded === b.id;
                    const upcoming = b.when === 'upcoming';
                    return (
                      <div key={b.id} className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                        <button onClick={() => setExpanded(open ? null : b.id)} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02] transition-colors">
                          <img src={b.photo} alt={b.provider} className="w-11 h-11 rounded-full object-cover shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-bold truncate" style={{ color: INK }}>{b.service}</div>
                            <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{b.provider}</div>
                            <div className="text-[11.5px] mt-1 font-semibold" style={{ color: upcoming ? CORAL : TERT }}>{b.date}</div>
                          </div>
                          <span className="text-[10.5px] font-bold px-2 py-[3px] rounded-full shrink-0" style={{ background: tone.bg, color: tone.c }}>{b.status}</span>
                        </button>
                        {open && (
                          <div className="px-3.5 pb-3.5" style={{ borderTop: '1px solid ' + LINE }}>
                            <div className="flex flex-col gap-2 pt-3">
                              {b.location && <div className="flex items-center gap-2"><MapPin size={13} color={TERT} strokeWidth={2} /><span className="text-[12.5px]" style={{ color: MUTED }}>{b.location}</span></div>}
                              <div className="flex items-center gap-2"><span className="w-[13px] text-center text-[11px]">🐾</span><span className="text-[12.5px]" style={{ color: MUTED }}>For {b.pet}</span></div>
                              {b.notes && <div className="text-[12.5px] leading-[1.45] rounded-[10px] px-3 py-2" style={{ background: PEACH, color: MUTED }}>{b.notes}</div>}
                              <div className="flex items-center justify-between pt-1"><span className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: TERT }}>Total</span><span className="text-[15px] font-extrabold" style={{ color: INK }}>{b.total}</span></div>
                            </div>
                            <div className="flex gap-2 mt-3">
                              {upcoming ? (
                                <>
                                  <button onClick={() => act(`Message ${b.provider.split(' ')[0]}`)} className="flex-1 h-10 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98] bg-white" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}><MessageCircle size={14} color={INK} strokeWidth={2} /><span className="text-[13px] font-bold" style={{ color: INK }}>Message</span></button>
                                  <button onClick={() => act('Reschedule')} className="flex-1 h-10 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ background: TINT }}><CalendarClock size={14} color={CORAL} strokeWidth={2} /><span className="text-[13px] font-bold" style={{ color: CORAL }}>Reschedule</span></button>
                                </>
                              ) : (
                                <button onClick={() => { const p = PROVIDERS.find((x) => x.name === b.provider); if (p) setProfile(p); else act('Book again'); }} className="flex-1 h-10 rounded-[12px] flex items-center justify-center active:scale-[0.98]" style={{ background: TINT }}><span className="text-[13px] font-bold" style={{ color: CORAL }}>Book again</span></button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {!list.length && (
                    <div className="flex flex-col items-center text-center mt-14 px-8">
                      <span className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: PEACH }}><CalendarClock size={22} color={TERT} strokeWidth={2} /></span>
                      <div className="text-[15px] font-bold" style={{ color: INK }}>No {bkFilter} bookings</div>
                      <p className="text-[13px] mt-1" style={{ color: TERT }}>Book a walk, groom or vet visit from Discover.</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ── SAVED ── */}
            {segment === 'Saved' && (
              <div className="mt-4">
                {savedProviders.length ? (
                  <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
                    {savedProviders.map((p, i) => <ProviderRow key={p.id} p={p} saved onSave={() => toggleSave(p.id)} onTap={() => setProfile(p)} last={i === savedProviders.length - 1} />)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center mt-14 px-8">
                    <span className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: PEACH }}><Heart size={22} color={TERT} strokeWidth={2} /></span>
                    <div className="text-[15px] font-bold" style={{ color: INK }}>Nothing saved yet</div>
                    <p className="text-[13px] mt-1" style={{ color: TERT }}>Tap the heart on a provider to keep them here.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {profile && <ProviderSheet p={profile} embedded={embedded} saved={saved.includes(profile.id)} onSave={() => toggleSave(profile.id)} onClose={() => setProfile(null)} onBook={requestBooking} />}

      {toast && <div className="absolute left-1/2 z-[200] px-4 py-2.5 rounded-full" style={{ bottom: embedded ? 108 : 38, transform: 'translateX(-50%)', background: INK, animation: 'svToast 0.2s ease both' }}><span className="text-[13px] font-semibold text-white whitespace-nowrap">{toast}</span></div>}

      {!embedded && <PreviewHeader />}
    </div>
  );

  const styleBlock = <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@800&display=swap');
    @keyframes svToast { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
    @keyframes svFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes svSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
  `}</style>;
  if (embedded) return (<>{styleBlock}{inner}</>);

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

export default ServicesV2;
