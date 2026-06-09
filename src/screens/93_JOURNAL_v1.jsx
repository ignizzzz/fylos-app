import React, { useState } from 'react';
import {
  AlertTriangle, Bell, Plus, Footprints, UtensilsCrossed, Stethoscope, Award,
  MessageSquare, Camera, MapPin, Pin, Search, X, Check,
} from 'lucide-react';

/**
 * 93_JOURNAL_v1.jsx — the Journal tab (pet diary / timeline).
 * fylos warm aesthetic + Revolut feel: a clean "this week" summary, type
 * filters, and a date-grouped timeline of entries (walks, meals, health,
 * moments, milestones, notes) with photos, mood, location & tags. A coral
 * FAB logs a new entry. `embedded` renders inside the dashboard tab.
 */

const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const TINT = '#FBE7DD';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#9B9B9F';
const GREEN = '#3F8D63';
const AMBER = '#C68A3A';
const LINE = '#F1EDE8';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';
const LEO = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200&h=200';
const TAO = 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=200&h=200';

const TYPE = {
  walk: { icon: Footprints, color: CORAL, label: 'Walk' },
  meal: { icon: UtensilsCrossed, color: AMBER, label: 'Meal' },
  health: { icon: Stethoscope, color: GREEN, label: 'Health' },
  moment: { icon: Camera, color: CORAL, label: 'Moment' },
  milestone: { icon: Award, color: CORAL, label: 'Milestone' },
  note: { icon: MessageSquare, color: MUTED, label: 'Note' },
};
const FILTERS = [{ id: 'all', label: 'All' }, { id: 'walk', label: 'Walks' }, { id: 'meal', label: 'Meals' }, { id: 'health', label: 'Health' }, { id: 'moment', label: 'Moments' }, { id: 'milestone', label: 'Milestones' }, { id: 'note', label: 'Notes' }];
const MOOD = { Playful: CORAL, Happy: GREEN, Tired: TERT, Anxious: '#E5484D', Curious: AMBER };
const PETS = [{ id: 'all', name: 'All' }, { id: 'leo', name: 'Leo', photo: LEO }, { id: 'tao', name: 'Tao', photo: TAO }];

const ENTRIES = [
  { id: 1, pet: 'leo', period: 'Today', type: 'walk', title: 'Morning lakefront walk', time: '8:30', body: '45 min along Zürichhorn. Met a friendly Bernese — Leo was thrilled.', photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=700', location: 'Zürichhorn', mood: 'Playful', tags: ['lake', 'social'], pinned: false },
  { id: 2, pet: 'leo', period: 'Today', type: 'health', title: 'Apoquel given', time: '8:00', body: '16 mg with breakfast.', mood: null },
  { id: 3, pet: 'tao', period: 'Today', type: 'meal', title: 'New kibble — first bowl', time: '12:15', body: 'Switched to Acana. Ate everything, no hesitation.', mood: 'Happy' },
  { id: 4, pet: 'leo', period: 'Yesterday', type: 'moment', title: 'Beach day', time: '16:40', body: 'First time at the sea — loved every second of it.', photo: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=700', location: 'Rapperswil', mood: 'Playful', tags: ['beach'], pinned: true },
  { id: 5, pet: 'leo', period: 'Yesterday', type: 'health', title: 'Annual checkup', time: '10:00', body: 'All clear. Weight 28 kg. Next visit in 6 months.', location: 'Dr. Meier', mood: null },
  { id: 6, pet: 'leo', period: 'This week', type: 'note', title: 'Scared of the vacuum', time: 'Mon', body: 'Hides under the bed when it’s on — worth noting for sitters.', mood: 'Anxious' },
  { id: 7, pet: 'tao', period: 'This week', type: 'walk', title: 'Evening garden time', time: 'Sun', body: 'Quiet evening outside, a bit tired after.', mood: 'Tired' },
  { id: 8, pet: 'leo', period: 'Earlier', type: 'milestone', title: 'Came home', time: 'Jun 2021', body: 'Adoption day — the best day. Settled in within an hour.', photo: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=700', mood: null },
];
const PERIODS = ['Today', 'Yesterday', 'This week', 'Earlier'];
const USER_AVATAR = 'https://i.pravatar.cc/150?u=alex_fylos';

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
      <span className="flex items-center" style={{ gap: 4 }}><span style={{ fontSize: 22, fontWeight: 800, color: INK, letterSpacing: '-0.5px' }}>Journal</span><span style={{ width: 6, height: 6, borderRadius: '50%', background: CORAL }} /></span>
      <div className="flex items-center gap-2">
        <span className="w-[38px] h-[38px] flex items-center justify-center rounded-full" style={{ background: '#FFEBEA' }}><AlertTriangle size={15} className="text-[#FF3B30]" strokeWidth={2} /></span>
        <span className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full" style={{ background: PEACH }}><Bell size={17} className="text-[#6E6058]" strokeWidth={1.8} /><span className="absolute top-[6px] right-[7px] w-[7px] h-[7px] rounded-full" style={{ background: CORAL, border: '1.5px solid #F7F5F2' }} /></span>
        <span className="w-[44px] h-[44px] rounded-full overflow-hidden border-2" style={{ borderColor: '#EDE8E2' }}><img src={USER_AVATAR} alt="" className="w-full h-full object-cover" /></span>
      </div>
    </div>
  </div>
);

const AddEntrySheet = ({ defaultPet, defaultType = 'walk', onSave, onClose }) => {
  const [type, setType] = useState(defaultType);
  const [petId, setPetId] = useState(defaultPet);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState(null);
  const valid = title.trim().length > 0;
  return (
    <>
      <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'jFade 0.2s ease both' }} onClick={onClose} />
      <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] flex flex-col" style={{ background: CREAM, maxHeight: '84%', boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'jSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
        <div className="flex justify-center pt-2.5 pb-1 shrink-0"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
        <div className="px-5 pt-1 pb-3 flex items-center gap-3 shrink-0">
          <h2 className="flex-1 text-[18px] font-extrabold tracking-[-0.01em]" style={{ color: INK }}>New entry</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
        </div>
        <div className="overflow-y-auto px-5 pb-8" style={{ scrollbarWidth: 'none' }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2 ml-0.5" style={{ color: TERT }}>Type</div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(TYPE).map(([id, t]) => {
              const Icon = t.icon; const on = type === id;
              return (
                <button key={id} onClick={() => setType(id)} className="flex flex-col items-center gap-1.5 py-3 rounded-[14px] transition-all active:scale-[0.97]" style={{ background: on ? '#FFF3EC' : '#FFFFFF', boxShadow: on ? `inset 0 0 0 1.5px ${CORAL}` : SHADOW }}>
                  <Icon size={18} color={on ? CORAL : MUTED} strokeWidth={2} />
                  <span className="text-[11.5px] font-bold" style={{ color: on ? CORAL : INK }}>{t.label}</span>
                </button>
              );
            })}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2 mt-5 ml-0.5" style={{ color: TERT }}>Pet</div>
          <div className="flex gap-2">
            {PETS.filter((p) => p.id !== 'all').map((p) => {
              const on = petId === p.id;
              return (
                <button key={p.id} onClick={() => setPetId(p.id)} className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full active:scale-95 transition-all" style={{ background: on ? CORAL : '#FFFFFF', boxShadow: on ? '0 4px 12px rgba(232,93,42,0.22)' : SHADOW }}>
                  <span className="w-6 h-6 rounded-full overflow-hidden"><img src={p.photo} alt="" className="w-full h-full object-cover" /></span>
                  <span className="text-[13px] font-bold" style={{ color: on ? '#fff' : INK }}>{p.name}</span>
                </button>
              );
            })}
          </div>
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2 mt-5 ml-0.5" style={{ color: TERT }}>Title</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={type === 'walk' ? 'e.g. Morning lakefront walk' : type === 'meal' ? 'e.g. Dinner — new kibble' : 'Give it a title'} autoFocus
            className="w-full bg-white rounded-[13px] px-4 h-[50px] outline-none text-[15px] font-semibold text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal" style={{ boxShadow: SHADOW }} />
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2 mt-4 ml-0.5" style={{ color: TERT }}>Notes <span className="lowercase tracking-normal font-semibold" style={{ color: '#C4B8AC' }}>· optional</span></div>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="What happened? Anything worth remembering…" rows={3}
            className="w-full bg-white rounded-[13px] px-4 py-3 outline-none text-[14.5px] font-medium text-[#111] placeholder:text-[#C4B8AC] placeholder:font-normal resize-none" style={{ boxShadow: SHADOW }} />
          <div className="text-[11px] font-bold uppercase tracking-[0.1em] mb-2 mt-4 ml-0.5" style={{ color: TERT }}>Mood <span className="lowercase tracking-normal font-semibold" style={{ color: '#C4B8AC' }}>· optional</span></div>
          <div className="flex flex-wrap gap-2">
            {Object.keys(MOOD).map((m) => {
              const on = mood === m;
              return <button key={m} onClick={() => setMood(on ? null : m)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-bold active:scale-95 transition-all" style={{ background: on ? '#FFF3EC' : '#FFFFFF', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.5px ${CORAL}` : SHADOW }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: MOOD[m] }} /> {m}</button>;
            })}
          </div>
          <button onClick={() => valid && onSave({ pet: petId, type, title: title.trim(), body: body.trim(), mood })} disabled={!valid} className="w-full mt-6 py-3.5 rounded-[16px] transition-all active:scale-[0.98]" style={{ background: valid ? CORAL : '#EAE3DB', boxShadow: valid ? '0 6px 18px rgba(232,93,42,0.26)' : 'none' }}>
            <span className="text-[15px] font-bold" style={{ color: valid ? '#fff' : TERT }}>Add to journal</span>
          </button>
        </div>
      </div>
    </>
  );
};

const Journal = ({ embedded = false }) => {
  const [pet, setPet] = useState('all');
  const [filter, setFilter] = useState('all');
  const [entries, setEntries] = useState(ENTRIES);
  const [addOpen, setAddOpen] = useState(false);
  const [addType, setAddType] = useState('walk');
  const [detail, setDetail] = useState(null);
  const list = entries.filter((e) => (pet === 'all' || e.pet === pet) && (filter === 'all' || e.type === filter));
  const addEntry = (entry) => { setEntries((prev) => [{ ...entry, id: Date.now(), period: 'Today', time: 'Now' }, ...prev]); setAddOpen(false); };
  const deleteEntry = (id) => { setEntries((prev) => prev.filter((e) => e.id !== id)); setDetail(null); };
  const togglePin = (id) => { setEntries((prev) => prev.map((e) => e.id === id ? { ...e, pinned: !e.pinned } : e)); setDetail(null); };

  // FAB deep-link: "Log entry" / "Moment" from the tab-bar plus menu
  React.useEffect(() => {
    try {
      const t = sessionStorage.getItem('fylos.journalAdd');
      if (t) { sessionStorage.removeItem('fylos.journalAdd'); setAddType(t); setAddOpen(true); }
    } catch (e) { /* ignore */ }
  }, []);

  const Entry = ({ e }) => {
    const t = TYPE[e.type];
    const Icon = t.icon;
    return (
      <button onClick={() => setDetail(e)} className="w-full bg-white rounded-[18px] p-3.5 text-left active:scale-[0.99] transition-transform" style={{ boxShadow: SHADOW }}>
        <div className="flex items-start gap-3">
          <span className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: t.color === GREEN ? '#EAF7EF' : t.color === MUTED ? PEACH : TINT }}><Icon size={18} color={t.color} strokeWidth={2} /></span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="flex-1 text-[14.5px] font-bold truncate" style={{ color: INK }}>{e.title}</h3>
              {e.pinned && <Pin size={13} color={CORAL} strokeWidth={2.2} className="shrink-0" style={{ transform: 'rotate(45deg)' }} />}
              <span className="text-[12px] font-medium shrink-0" style={{ color: TERT }}>{e.time}</span>
            </div>
            {(e.location || e.mood) && (
              <div className="flex items-center gap-2.5 mt-1">
                {e.location && <span className="inline-flex items-center gap-1 text-[11.5px]" style={{ color: TERT }}><MapPin size={11} strokeWidth={2} /> {e.location}</span>}
                {e.mood && <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold" style={{ color: MOOD[e.mood] }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: MOOD[e.mood] }} /> {e.mood}</span>}
              </div>
            )}
            {e.body && <p className="text-[13px] mt-1.5 leading-[1.45]" style={{ color: MUTED }}>{e.body}</p>}
          </div>
        </div>
        {e.photo && <img src={e.photo} alt="" className="w-full h-[156px] rounded-[14px] object-cover mt-3" />}
        {e.tags && <div className="flex gap-1.5 mt-2.5 ml-[52px]">{e.tags.map((tg) => <span key={tg} className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: PEACH, color: TERT }}>#{tg}</span>)}</div>}
      </button>
    );
  };

  const inner = (
    <div className="absolute inset-0" style={{ background: CREAM }}>
      <div className="absolute inset-0 overflow-y-auto px-5" style={{ paddingTop: 104, paddingBottom: embedded ? 100 : 36, scrollbarWidth: 'none' }}>
        {/* This week summary */}
        <div className="rounded-[18px] bg-white flex items-center py-3.5" style={{ boxShadow: SHADOW }}>
          {[{ v: '12', l: 'Entries' }, { v: '5', l: 'Walks' }, { v: '3', l: 'Moments' }].map((s, i) => (
            <div key={s.l} className="flex-1 flex flex-col items-center" style={{ borderLeft: i ? '1px solid ' + LINE : 'none' }}>
              <span className="text-[19px] font-extrabold leading-none" style={{ color: CORAL }}>{s.v}</span>
              <span className="text-[10.5px] font-medium mt-1.5" style={{ color: TERT }}>{s.l}</span>
            </div>
          ))}
        </div>

        {/* Pet switcher */}
        <div className="flex gap-2.5 mt-4 overflow-x-auto -mx-5 px-5 pb-1" style={{ scrollbarWidth: 'none' }}>
          {PETS.map((p) => {
            const on = pet === p.id;
            return (
              <button key={p.id} onClick={() => setPet(p.id)} className="inline-flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full shrink-0 active:scale-95 transition-all" style={{ background: on ? CORAL : '#FFFFFF', boxShadow: on ? '0 4px 12px rgba(232,93,42,0.22)' : SHADOW }}>
                <span className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center" style={{ background: p.photo ? 'transparent' : (on ? 'rgba(255,255,255,0.25)' : PEACH) }}>{p.photo ? <img src={p.photo} alt="" className="w-full h-full object-cover" /> : <span className="text-[11px] font-extrabold" style={{ color: on ? '#fff' : CORAL }}>{p.name[0]}</span>}</span>
                <span className="text-[13px] font-bold" style={{ color: on ? '#fff' : INK }}>{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Type filters */}
        <div className="flex gap-2 mt-3 overflow-x-auto -mx-5 px-5 pb-1" style={{ scrollbarWidth: 'none' }}>
          {FILTERS.map((f) => {
            const on = filter === f.id;
            return <button key={f.id} onClick={() => setFilter(f.id)} className="shrink-0 px-3.5 h-8 rounded-full text-[12.5px] font-bold transition-all active:scale-95" style={{ background: on ? '#FFF3EC' : '#FFFFFF', color: on ? CORAL : MUTED, boxShadow: on ? `inset 0 0 0 1.5px ${CORAL}` : SHADOW }}>{f.label}</button>;
          })}
        </div>

        {/* Timeline grouped by period */}
        {PERIODS.map((period) => {
          const items = list.filter((e) => e.period === period);
          if (!items.length) return null;
          return (
            <div key={period}>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] mb-2.5 mt-6 ml-1.5" style={{ color: '#A8A29C' }}>{period}</div>
              <div className="flex flex-col gap-2.5">{items.map((e) => <Entry key={e.id} e={e} />)}</div>
            </div>
          );
        })}
        {!list.length && (
          <div className="flex flex-col items-center text-center mt-16 px-8">
            <span className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: PEACH }}><Camera size={22} color={TERT} strokeWidth={2} /></span>
            <div className="text-[15px] font-bold" style={{ color: INK }}>Nothing here yet</div>
            <p className="text-[13px] mt-1" style={{ color: TERT }}>Log a walk, meal or moment to start the journal.</p>
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => setAddOpen(true)} className="absolute right-5 z-30 w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform" style={{ bottom: embedded ? 96 : 30, background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.36)' }}>
        <Plus size={26} color="#fff" strokeWidth={2.6} />
      </button>

      {addOpen && <AddEntrySheet defaultPet={pet === 'all' ? 'leo' : pet} defaultType={addType} onSave={addEntry} onClose={() => setAddOpen(false)} />}

      {detail && (() => {
        const t = TYPE[detail.type]; const Icon = t.icon; const petObj = PETS.find((p) => p.id === detail.pet);
        return (
          <>
            <div className="absolute inset-0 z-[150]" style={{ background: 'rgba(20,12,8,0.4)', animation: 'jFade 0.2s ease both' }} onClick={() => setDetail(null)} />
            <div className="absolute left-0 right-0 bottom-0 z-[160] rounded-t-[26px] flex flex-col" style={{ background: CREAM, maxHeight: '84%', boxShadow: '0 -12px 40px rgba(0,0,0,0.2)', animation: 'jSheet 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
              <div className="flex justify-center pt-2.5 pb-1 shrink-0"><div style={{ width: 38, height: 5, borderRadius: 9999, background: '#DDD4C9' }} /></div>
              <div className="px-5 pt-1 pb-3 flex items-center gap-3 shrink-0">
                <span className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: t.color === GREEN ? '#EAF7EF' : t.color === MUTED ? PEACH : TINT }}><Icon size={18} color={t.color} strokeWidth={2} /></span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-[17px] font-extrabold tracking-[-0.01em] truncate" style={{ color: INK }}>{detail.title}</h2>
                  <div className="text-[11.5px] mt-0.5" style={{ color: TERT }}>{t.label} · {detail.period} {detail.time} {petObj ? `· ${petObj.name}` : ''}</div>
                </div>
                <button onClick={() => setDetail(null)} className="w-8 h-8 rounded-full flex items-center justify-center active:scale-95" style={{ background: PEACH }}><X size={16} color={INK} strokeWidth={2.2} /></button>
              </div>
              <div className="overflow-y-auto px-5 pb-8" style={{ scrollbarWidth: 'none' }}>
                {detail.photo && <img src={detail.photo} alt="" className="w-full h-[180px] rounded-[16px] object-cover mb-3" />}
                {(detail.location || detail.mood) && (
                  <div className="flex items-center gap-3 mb-3">
                    {detail.location && <span className="inline-flex items-center gap-1 text-[12.5px]" style={{ color: TERT }}><MapPin size={12} strokeWidth={2} /> {detail.location}</span>}
                    {detail.mood && <span className="inline-flex items-center gap-1 text-[12.5px] font-semibold" style={{ color: MOOD[detail.mood] }}><span className="w-1.5 h-1.5 rounded-full" style={{ background: MOOD[detail.mood] }} /> {detail.mood}</span>}
                  </div>
                )}
                {detail.body && <p className="text-[14px] leading-[1.55] bg-white rounded-[14px] px-4 py-3.5" style={{ color: MUTED, boxShadow: SHADOW }}>{detail.body}</p>}
                {detail.tags && <div className="flex gap-1.5 mt-3">{detail.tags.map((tg) => <span key={tg} className="text-[11.5px] font-semibold px-2.5 py-1 rounded-full" style={{ background: PEACH, color: TERT }}>#{tg}</span>)}</div>}
                <div className="flex gap-2 mt-5">
                  <button onClick={() => togglePin(detail.id)} className="flex-1 h-11 rounded-[13px] flex items-center justify-center gap-1.5 active:scale-[0.98]" style={{ background: TINT }}><Pin size={14} color={CORAL} strokeWidth={2.2} /><span className="text-[13.5px] font-bold" style={{ color: CORAL }}>{detail.pinned ? 'Unpin' : 'Pin'}</span></button>
                  <button onClick={() => deleteEntry(detail.id)} className="flex-1 h-11 rounded-[13px] flex items-center justify-center active:scale-[0.98]" style={{ background: '#FEE8E7' }}><span className="text-[13.5px] font-bold" style={{ color: '#E5484D' }}>Delete</span></button>
                </div>
              </div>
            </div>
          </>
        );
      })()}

      {!embedded && <PreviewHeader />}
    </div>
  );

  const styleBlock = <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@800&display=swap');
    @keyframes jFade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes jSheet { from { transform: translateY(100%); } to { transform: translateY(0); } }
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

export default Journal;
