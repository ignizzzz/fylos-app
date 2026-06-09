import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Bell, Search, Footprints, Home, Scissors, Stethoscope,
  Star, Heart, ChevronRight, MapPin, MessageCircle, CalendarClock, X, Check,
} from 'lucide-react';

/**
 * 94_SERVICES_v1.jsx — the Services tab, rebuilt in the fylos aesthetic.
 * Three segments: Discover (search, per-pet needs, categories, next up,
 * top-rated providers with save), Bookings (upcoming/past accordion cards,
 * deep-linkable via focusedBookingId b1/b2/b3), Saved (hearted providers).
 * `embedded` renders inside the dashboard under the global "Services •"
 * header; standalone draws a matching preview header.
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
  { id: 'walking', label: 'Walking', sub: 'from CHF 18', icon: Footprints },
  { id: 'sitting', label: 'Sitting', sub: 'from CHF 35', icon: Home },
  { id: 'grooming', label: 'Grooming', sub: 'from CHF 45', icon: Scissors },
  { id: 'vet', label: 'Vet', sub: 'from CHF 80', icon: Stethoscope },
];
const PROVIDERS = [
  { id: 'pr1', name: 'Lukas F.', role: 'Dog walker', rating: 4.9, reviews: 132, dist: '0.8 km', price: 'CHF 22/h', photo: 'https://i.pravatar.cc/150?u=lukas_walker' },
  { id: 'pr2', name: 'Sofia Lambrou', role: 'Groomer', rating: 4.9, reviews: 208, dist: '1.2 km', price: 'CHF 65', photo: 'https://i.pravatar.cc/150?u=sofia_walker' },
  { id: 'pr3', name: 'Maria K.', role: 'Pet sitter', rating: 4.8, reviews: 96, dist: '0.5 km', price: 'CHF 38/n', photo: 'https://i.pravatar.cc/150?u=maria_sitter' },
  { id: 'pr4', name: 'Dr. Reza Patel', role: 'Veterinarian', rating: 4.9, reviews: 311, dist: '2.1 km', price: 'CHF 120', photo: 'https://i.pravatar.cc/150?u=dr_reza' },
];
const BOOKINGS = [
  { id: 'b1', when: 'upcoming', status: 'Confirmed', service: 'Grooming', provider: 'Sofia Lambrou', photo: 'https://i.pravatar.cc/150?u=sofia_walker', date: 'Mon, Feb 16 · 10:00–11:00', pet: 'Leo', total: 'CHF 65.00', location: 'Sofia’s studio · Niederdorf', notes: 'Full groom — wash, trim, nails.' },
  { id: 'b2', when: 'upcoming', status: 'Confirmed', service: 'Grooming', provider: 'Bright Paws · Elena', photo: 'https://i.pravatar.cc/150?u=elena_groomer', date: 'Wed, Feb 18 · 15:30–17:00', pet: 'Leo', total: 'CHF 85.00', location: 'Bright Paws · Seefeld', notes: 'Bath, blow-dry & style with Elena.' },
  { id: 'b3', when: 'upcoming', status: 'Confirmed', service: 'Vet visit', provider: 'Lakeshore Vet · Dr. Reza', photo: 'https://i.pravatar.cc/150?u=dr_reza', date: 'Fri, Feb 20 · 09:00–09:30', pet: 'Leo', total: 'CHF 120.00', location: 'Lakeshore Vet · Bellevue', notes: 'Annual checkup & vaccinations.' },
  { id: 'b4', when: 'upcoming', status: 'Pending', service: '90 min walk', provider: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker', date: 'Tue, Feb 24 · 14:00–15:30', pet: 'Leo', total: 'CHF 33.00', location: 'Pickup at home', notes: 'Waiting for Lukas to confirm.' },
  { id: 'b5', when: 'past', status: 'Completed', service: '60 min walk', provider: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker', date: 'Fri, Feb 6 · 09:00–10:00', pet: 'Leo', total: 'CHF 22.00', location: 'Zürichhorn loop', notes: '' },
  { id: 'b6', when: 'past', status: 'Cancelled', service: 'Overnight sitting', provider: 'Maria K.', photo: 'https://i.pravatar.cc/150?u=maria_sitter', date: 'Sat, Jan 31', pet: 'Tao', total: '—', location: '', notes: 'Cancelled by you.' },
];
const SEGMENTS = ['Discover', 'Bookings', 'Saved'];

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

const statusTone = (s) => s === 'Confirmed' ? { bg: '#EAF7EF', c: GREEN } : s === 'Pending' ? { bg: '#FBF1E2', c: AMBER } : s === 'Cancelled' ? { bg: '#FEE8E7', c: DANGER } : { bg: PEACH, c: MUTED };

const ProviderRow = ({ p, saved, onSave, onTap, last }) => (
  <div className="relative">
    <button onClick={onTap} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02] transition-colors">
      <img src={p.photo} alt={p.name} className="w-11 h-11 rounded-full object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold truncate" style={{ color: INK }}>{p.name}</div>
        <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{p.role} · {p.dist}</div>
        <div className="flex items-center gap-1 mt-1"><Star size={11} color="#E8B04A" fill="#E8B04A" strokeWidth={0} /><span className="text-[11.5px] font-bold" style={{ color: INK }}>{p.rating}</span><span className="text-[11px]" style={{ color: TERT }}>({p.reviews})</span></div>
      </div>
      <div className="flex flex-col items-end gap-1.5 shrink-0">
        <button onClick={(e) => { e.stopPropagation(); onSave(); }} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform" style={{ background: saved ? TINT : PEACH }}>
          <Heart size={15} color={saved ? CORAL : MUTED} fill={saved ? CORAL : 'none'} strokeWidth={2} />
        </button>
        <span className="text-[12px] font-bold" style={{ color: INK }}>{p.price}</span>
      </div>
    </button>
    {!last && <div className="absolute bottom-0 left-[62px] right-0 h-px" style={{ background: LINE }} />}
  </div>
);

const BookingCard = ({ b, expanded, onToggle, act }) => {
  const tone = statusTone(b.status);
  const upcoming = b.when === 'upcoming';
  return (
    <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
      <button onClick={onToggle} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02] transition-colors">
        <img src={b.photo} alt={b.provider} className="w-11 h-11 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-bold truncate" style={{ color: INK }}>{b.service}</div>
          <div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{b.provider}</div>
          <div className="text-[11.5px] mt-1 font-semibold" style={{ color: upcoming ? CORAL : TERT }}>{b.date}</div>
        </div>
        <span className="text-[10.5px] font-bold px-2 py-[3px] rounded-full shrink-0" style={{ background: tone.bg, color: tone.c }}>{b.status}</span>
      </button>
      {expanded && (
        <div className="px-3.5 pb-3.5" style={{ borderTop: '1px solid ' + LINE }}>
          <div className="flex flex-col gap-2 pt-3">
            {b.location && <div className="flex items-center gap-2"><MapPin size={13} color={TERT} strokeWidth={2} /><span className="text-[12.5px]" style={{ color: MUTED }}>{b.location}</span></div>}
            <div className="flex items-center gap-2"><span className="w-[13px] text-center text-[11px]">🐾</span><span className="text-[12.5px]" style={{ color: MUTED }}>For {b.pet}</span></div>
            {b.notes && <div className="text-[12.5px] leading-[1.45] rounded-[10px] px-3 py-2" style={{ background: PEACH, color: MUTED }}>{b.notes}</div>}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: TERT }}>Total</span>
              <span className="text-[15px] font-extrabold" style={{ color: INK }}>{b.total}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {upcoming ? (
              <>
                <button onClick={() => act(`Message ${b.provider.split(' ')[0]}`)} className="flex-1 h-10 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98] bg-white" style={{ boxShadow: 'inset 0 0 0 1.4px #E5DED5' }}><MessageCircle size={14} color={INK} strokeWidth={2} /><span className="text-[13px] font-bold" style={{ color: INK }}>Message</span></button>
                <button onClick={() => act('Reschedule')} className="flex-1 h-10 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ background: TINT }}><CalendarClock size={14} color={CORAL} strokeWidth={2} /><span className="text-[13px] font-bold" style={{ color: CORAL }}>Reschedule</span></button>
              </>
            ) : (
              <button onClick={() => act('Book again')} className="flex-1 h-10 rounded-[12px] flex items-center justify-center active:scale-[0.98]" style={{ background: TINT }}><span className="text-[13px] font-bold" style={{ color: CORAL }}>Book again</span></button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ServicesV2 = ({ embedded = false, initialSegment = 'discover', focusedBookingId = null, onClearFocus, onOpenWalking }) => {
  const [segment, setSegment] = useState(focusedBookingId ? 'Bookings' : (initialSegment === 'bookings' ? 'Bookings' : 'Discover'));
  const [pet, setPet] = useState('leo');
  const [saved, setSaved] = useState(['pr2']);
  const [bkFilter, setBkFilter] = useState('upcoming');
  const [expanded, setExpanded] = useState(focusedBookingId);
  const [toast, setToast] = useState('');
  const act = (m) => { setToast(m); setTimeout(() => setToast(''), 1600); };
  useEffect(() => { if (focusedBookingId && onClearFocus) onClearFocus(); /* keep local expand */ // eslint-disable-next-line
  }, []);
  const toggleSave = (id) => setSaved((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id]);
  const petName = PETS.find((p) => p.id === pet)?.name || 'Leo';
  const bookings = BOOKINGS.filter((b) => b.when === bkFilter);
  const savedProviders = PROVIDERS.filter((p) => saved.includes(p.id));
  const nextUp = BOOKINGS.find((b) => b.id === 'b1');

  const inner = (
    <div className="absolute inset-0" style={{ background: CREAM }}>
      <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 96, paddingBottom: embedded ? 104 : 36, scrollbarWidth: 'none' }}>
        {/* Segments — canonical underline tabs */}
        <div className="flex gap-6" style={{ borderBottom: '1px solid ' + LINE }}>
          {SEGMENTS.map((s) => {
            const on = segment === s;
            const count = s === 'Bookings' ? BOOKINGS.filter((b) => b.when === 'upcoming').length : s === 'Saved' ? saved.length : 0;
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
              <input placeholder="Find walkers, sitters, vets…" className="flex-1 bg-transparent outline-none text-[14px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" />
            </div>

            <div className="flex items-center justify-between mt-5">
              <span className="text-[15px] font-bold" style={{ color: INK }}>What does {petName} need?</span>
              <div className="flex gap-1.5">
                {PETS.map((p) => {
                  const on = pet === p.id;
                  return (
                    <button key={p.id} onClick={() => setPet(p.id)} className="w-9 h-9 rounded-full p-[2px] active:scale-95 transition-all" style={{ background: on ? CORAL : 'transparent' }}>
                      <img src={p.photo} alt={p.name} className="w-full h-full rounded-full object-cover" style={{ border: '2px solid ' + CREAM }} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <button key={c.id} onClick={() => c.id === 'walking' && onOpenWalking ? onOpenWalking() : act(`${c.label} — browse providers`)} className="flex items-center gap-3 bg-white rounded-[16px] px-3.5 py-3.5 text-left active:scale-[0.98] transition-transform" style={{ boxShadow: SHADOW }}>
                    <span className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: TINT }}><Icon size={17} color={CORAL} strokeWidth={2} /></span>
                    <div className="min-w-0"><div className="text-[13.5px] font-bold" style={{ color: INK }}>{c.label}</div><div className="text-[11px] mt-0.5" style={{ color: TERT }}>{c.sub}</div></div>
                  </button>
                );
              })}
            </div>

            {nextUp && (
              <>
                <SectionLabel action="See all" onAction={() => setSegment('Bookings')}>Next up</SectionLabel>
                <button onClick={() => { setSegment('Bookings'); setExpanded('b1'); }} className="w-full bg-white rounded-[18px] p-3.5 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
                  <div className="flex items-center gap-3">
                    <img src={nextUp.photo} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-bold truncate" style={{ color: INK }}>{nextUp.service} · {nextUp.provider}</div>
                      <div className="text-[11.5px] mt-0.5 font-semibold" style={{ color: CORAL }}>{nextUp.date}</div>
                    </div>
                    <span className="text-[10.5px] font-bold px-2 py-[3px] rounded-full shrink-0" style={{ background: '#EAF7EF', color: GREEN }}>Confirmed</span>
                  </div>
                </button>
              </>
            )}

            <SectionLabel>Top rated near you</SectionLabel>
            <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>
              {PROVIDERS.map((p, i) => (
                <ProviderRow key={p.id} p={p} saved={saved.includes(p.id)} onSave={() => toggleSave(p.id)} onTap={() => act(`${p.name} — profile`)} last={i === PROVIDERS.length - 1} />
              ))}
            </div>
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
              {bookings.map((b) => (
                <BookingCard key={b.id} b={b} expanded={expanded === b.id} onToggle={() => setExpanded(expanded === b.id ? null : b.id)} act={act} />
              ))}
              {!bookings.length && (
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
                {savedProviders.map((p, i) => (
                  <ProviderRow key={p.id} p={p} saved onSave={() => toggleSave(p.id)} onTap={() => act(`${p.name} — profile`)} last={i === savedProviders.length - 1} />
                ))}
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
      </div>

      {toast && <div className="absolute left-1/2 z-[200] px-4 py-2.5 rounded-full" style={{ bottom: embedded ? 108 : 38, transform: 'translateX(-50%)', background: INK, animation: 'svToast 0.2s ease both' }}><span className="text-[13px] font-semibold text-white whitespace-nowrap">{toast}</span></div>}

      {!embedded && <PreviewHeader />}
    </div>
  );

  const styleBlock = <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@800&display=swap');
    @keyframes svToast { from { opacity: 0; transform: translate(-50%, 8px); } to { opacity: 1; transform: translate(-50%, 0); } }
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
