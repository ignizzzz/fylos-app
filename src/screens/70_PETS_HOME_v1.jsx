import React, { useState } from 'react';
import {
  AlertTriangle, Bell, Plus, ChevronRight, Scissors, Syringe, Stethoscope, CalendarCheck,
  Footprints, Bone, Scale,
} from 'lucide-react';

/**
 * 70_PETS_HOME_v1.jsx — the Pets tab content.
 * Renders inside the dashboard tab (header + bottom tab bar are the app's).
 * Fresh warm aesthetic: one editorial photo card per pet in a wallet-style
 * horizontal deck (next card peeks from the right, à la Apple Wallet), the
 * app-canonical page indicator floating between the deck and the "add
 * another pet" bar, and a "coming up" care list — each with its own empty
 * state. Standalone draws a matching header for preview (and accepts
 * ?n= pet count, ?cu=0 to preview empty states).
 */

const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#9B9B9F';
const GREEN = '#3F8D63';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';

const LEO = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=360&h=360';
const TAO = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=360&h=360';

const DEFAULT_PETS = [
  { id: 'leo', name: 'Leo', breed: 'Golden Retriever', age: '3 yrs', photo: LEO, status: { label: 'Healthy', tone: 'good' } },
  { id: 'tao', name: 'Tao', breed: 'Domestic Shorthair', age: '5 yrs', photo: TAO, status: { label: 'Vaccine · 5d', tone: 'due' } },
];

const DEFAULT_COMING_UP = [
  { id: 'c1', icon: Scissors, title: 'Grooming', when: 'In 2 weeks', pet: 'Leo', photo: LEO },
  { id: 'c2', icon: Syringe, title: 'Vaccination · FVRCP', when: 'In 5 days', pet: 'Tao', photo: TAO },
  { id: 'c3', icon: Stethoscope, title: 'Annual checkup', when: 'In 3 weeks', pet: 'Leo', photo: LEO },
];

const DEFAULT_ACTIVITY = [
  { id: 'a1', icon: Footprints, title: 'Morning walk · 45 min', when: '2h ago', pet: 'Leo', photo: LEO },
  { id: 'a2', icon: Bone, title: 'Dinner', when: 'Yesterday', pet: 'Tao', photo: TAO },
  { id: 'a3', icon: Scale, title: 'Weight logged · 28 kg', when: '2 days ago', pet: 'Leo', photo: LEO },
];

const USER_AVATAR = 'https://i.pravatar.cc/150?u=alex_fylos';

const StatusBar = () => (
  <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
    <span style={{ fontSize: 15, fontWeight: 600, color: INK }}>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={INK}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={INK}/><rect x="9" y="2" width="3" height="10" rx="1" fill={INK}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={INK}/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={INK}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={INK} strokeWidth="1.5" strokeLinecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={INK} strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill={INK}/><path d="M23 4.5v4a2 2 0 000-4z" fill={INK} fillOpacity="0.4"/></svg>
    </div>
  </div>
);

const PreviewHeader = () => (
  <div className="absolute top-0 left-0 right-0 z-40 pt-14 pb-6 px-5 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F5F2, rgba(247,245,242,0.95) 70%, rgba(247,245,242,0))' }}>
    <div className="flex justify-between items-center pointer-events-auto" style={{ fontFamily: '"Nunito", sans-serif' }}>
      <span className="flex items-center" style={{ gap: 4 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: INK, letterSpacing: '-0.5px' }}>Pets</span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: CORAL }} />
      </span>
      <div className="flex items-center gap-2">
        <span className="w-[38px] h-[38px] flex items-center justify-center rounded-full" style={{ background: '#FFEBEA' }}><AlertTriangle size={15} className="text-[#E5484D]" strokeWidth={2} /></span>
        <span className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full" style={{ background: PEACH }}><Bell size={17} className="text-[#6E6058]" strokeWidth={1.8} /><span className="absolute top-[6px] right-[7px] w-[7px] h-[7px] rounded-full" style={{ background: CORAL, border: '1.5px solid #F7F5F2' }} /></span>
        <span className="w-[44px] h-[44px] rounded-full overflow-hidden border-2" style={{ borderColor: '#EDE8E2' }}><img src={USER_AVATAR} alt="" className="w-full h-full object-cover" /></span>
      </div>
    </div>
  </div>
);

const SectionHeader = ({ children }) => (
  <div className="text-[10.5px] font-bold uppercase tracking-[0.14em] mb-2.5 mt-7 px-0.5" style={{ color: '#A8A29C' }}>{children}</div>
);

const PetCard = ({ p, i, onOpenPet, active, solo, depth }) => (
  <button
    onClick={() => onOpenPet && onOpenPet(p.id)}
    className="relative shrink-0 rounded-[20px] overflow-hidden text-left transition-all duration-300"
    style={{
      // 100% of the deck's content box (pl 20 / pr 32): full-width cards.
      // Each card after the first is pulled 44px UNDER its neighbour via
      // negative margin — a sideways Apple-Wallet stack where only a sliver
      // of the tucked card shows at the screen edge. The focused card rides
      // on top (zIndex by distance), tucked ones sit lower and dimmer.
      width: '100%',
      height: 200,
      marginLeft: i > 0 && !solo ? -44 : 0,
      zIndex: 10 - depth,
      scrollSnapAlign: 'start',
      boxShadow: SHADOW,
      transform: active ? 'scale(1)' : 'scale(0.96)',
      opacity: active ? 1 : 0.92,
      transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
    }}
  >
    <img src={p.photo} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(17,17,17,0.64) 0%, rgba(17,17,17,0.12) 44%, rgba(17,17,17,0) 70%)' }} />
    {p.status.tone === 'due' ? (
      <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 pl-1.5 pr-2 py-[3px] rounded-full" style={{ background: CORAL, boxShadow: '0 2px 6px rgba(232,93,42,0.4)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-white" />
        <span className="text-[10.5px] font-bold text-white">{p.status.label}</span>
      </span>
    ) : (
      <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 pl-1.5 pr-2 py-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.92)' }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
        <span className="text-[10.5px] font-bold" style={{ color: GREEN }}>{p.status.label}</span>
      </span>
    )}
    <div className="absolute left-4 right-3 bottom-3.5">
      <div className="text-[18px] font-extrabold text-white tracking-[-0.01em] leading-tight">{p.name}</div>
      <div className="text-[11.5px] mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>{p.breed} · {p.age}</div>
    </div>
  </button>
);

// Wallet-style deck: one full card per pet, horizontal scroll-snap with the
// next card peeking from the right. The page indicator lives OUTSIDE the
// card — floating below the deck (and above the "add another pet" bar).
const PetDeck = ({ list, onOpenPet }) => {
  const [idx, setIdx] = useState(0);
  const solo = list.length === 1;
  const onScroll = (e) => {
    const el = e.currentTarget;
    const card = el.firstElementChild;
    if (!card) return;
    const w = card.offsetWidth - 44; // stacked step: card minus the 44px tuck
    const i = Math.max(0, Math.min(list.length - 1, Math.round(el.scrollLeft / w)));
    if (i !== idx) setIdx(i);
  };
  return (
    <>
      <div
        onScroll={onScroll}
        className="fy-in fy-deck flex -mx-5 pl-5 overflow-x-auto"
        style={{ scrollSnapType: 'x mandatory', scrollPaddingLeft: 20, scrollbarWidth: 'none', paddingBottom: 6, paddingRight: solo ? 20 : 32 }}
      >
        {list.map((p, i) => (
          <PetCard key={p.id} p={p} i={i} onOpenPet={onOpenPet} active={i === idx} solo={solo} depth={Math.abs(i - idx)} />
        ))}
      </div>
      {list.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-2">
          {list.map((_, i) => (
            <span key={i} className="rounded-full transition-all duration-300" style={{ height: 5, width: idx === i ? 16 : 5, background: idx === i ? CORAL : '#E0D8CF' }} />
          ))}
        </div>
      )}
    </>
  );
};

const AddPetBar = ({ onAddPet }) => (
  <button onClick={() => onAddPet && onAddPet()} className="w-full mt-3 py-3.5 rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.99] transition-transform" style={{ border: '1.5px dashed #D6CDC2' }}>
    <Plus size={15} color={MUTED} strokeWidth={2.4} />
    <span className="text-[13.5px] font-semibold" style={{ color: MUTED }}>Add another pet</span>
  </button>
);

const EmptyPets = ({ onAddPet }) => (
  <div className="flex flex-col items-center justify-center text-center px-8" style={{ minHeight: 540 }}>
    <img src="/onboarding/pets.png" alt="" className="w-[150px] h-auto mb-5 select-none" style={{ opacity: 0.95 }} />
    <h2 className="text-[20px] font-extrabold tracking-[-0.02em]" style={{ color: INK }}>No pets yet</h2>
    <p className="text-[13.5px] mt-2 leading-[1.5] max-w-[260px]" style={{ color: MUTED }}>Add your first pet to track their health, care and everything in between.</p>
    <button onClick={() => onAddPet && onAddPet()} className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-[16px] active:scale-[0.98] transition-transform" style={{ background: CORAL, boxShadow: '0 8px 20px rgba(232,93,42,0.28)' }}>
      <Plus size={17} color="#fff" strokeWidth={2.4} />
      <span className="text-[15px] font-bold text-white">Add your first pet</span>
    </button>
  </div>
);

const ComingUpEmpty = () => (
  <div className="rounded-[18px] bg-white flex flex-col items-center text-center px-6 py-7" style={{ boxShadow: SHADOW }}>
    <span className="w-11 h-11 rounded-full flex items-center justify-center mb-3" style={{ background: PEACH }}><CalendarCheck size={19} color={MUTED} strokeWidth={2} /></span>
    <div className="text-[14px] font-bold" style={{ color: INK }}>Nothing coming up</div>
    <div className="text-[12px] mt-1" style={{ color: TERT }}>You're all caught up. New reminders show here.</div>
  </div>
);

const PetsHome = ({ embedded = false, onOpenPet, onAddPet, pets }) => {
  let list = pets || DEFAULT_PETS;
  let comingUp = DEFAULT_COMING_UP;
  if (!embedded) {
    try {
      const q = new URLSearchParams(window.location.search);
      const n = q.get('n');
      if (n !== null) list = DEFAULT_PETS.slice(0, Math.max(0, parseInt(n, 10) || 0));
      if (q.get('cu') === '0') comingUp = [];
    } catch (e) { /* ignore */ }
  }
  const inner = (
    <div className="absolute inset-0" style={{ background: CREAM }}>
      <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 114, paddingBottom: embedded ? 104 : 40, scrollbarWidth: 'none' }}>
        {list.length === 0 ? (
          <EmptyPets onAddPet={onAddPet} />
        ) : (
          <>
            {/* Pets — wallet deck: one card per profile, next card peeks.
                Page indicator floats free between deck and the add bar. */}
            <PetDeck list={list} onOpenPet={onOpenPet} />
            <AddPetBar onAddPet={onAddPet} />

            {/* Coming up */}
            <SectionHeader>Coming up</SectionHeader>
            {comingUp.length > 0 ? (
              <div className="rounded-[18px] bg-white overflow-hidden" style={{ boxShadow: SHADOW }}>
                {comingUp.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <button key={c.id} onClick={() => onOpenPet && onOpenPet(c.pet.toLowerCase())} className="relative w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.02] transition-colors">
                      <span className="relative shrink-0">
                        <img src={c.photo} alt={c.pet} className="w-9 h-9 rounded-full object-cover" />
                        <span className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: CREAM }}>
                          <span className="w-[15px] h-[15px] rounded-full flex items-center justify-center" style={{ background: '#FBE7DD' }}><Icon size={9} color={CORAL} strokeWidth={2.4} /></span>
                        </span>
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-semibold truncate" style={{ color: INK }}>{c.title}</div>
                        <div className="text-[11.5px] mt-0.5" style={{ color: CORAL }}>{c.when} · {c.pet}</div>
                      </div>
                      <ChevronRight size={15} className="shrink-0" color="#CFC7BD" strokeWidth={2.2} />
                      {i < comingUp.length - 1 && <div className="absolute bottom-0 left-[54px] right-0 h-px" style={{ background: '#F1EDE8' }} />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <ComingUpEmpty />
            )}

            {/* Recent activity — past care (calm/muted) */}
            <SectionHeader>Recent activity</SectionHeader>
            <div className="rounded-[18px] bg-white overflow-hidden" style={{ boxShadow: SHADOW }}>
              {DEFAULT_ACTIVITY.map((a, i) => {
                const Icon = a.icon;
                return (
                  <div key={a.id} className="relative flex items-center gap-3 px-3.5 py-3">
                    <span className="relative shrink-0">
                      <img src={a.photo} alt={a.pet} className="w-9 h-9 rounded-full object-cover" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center" style={{ background: CREAM }}>
                        <span className="w-[15px] h-[15px] rounded-full flex items-center justify-center" style={{ background: PEACH }}><Icon size={9} color={MUTED} strokeWidth={2.2} /></span>
                      </span>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold truncate" style={{ color: INK }}>{a.title}</div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{a.when} · {a.pet}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {!embedded && <PreviewHeader />}
    </div>
  );

  const styleBlock = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@800&display=swap');
      @keyframes fyIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .fy-in { animation: fyIn 0.42s cubic-bezier(0.22,1,0.36,1) both; }
      .fy-deck::-webkit-scrollbar { display: none; height: 0; }
    `}</style>
  );

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

export default PetsHome;
