import React, { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronRight,
  PawPrint,
  ChevronLeft,
  Plus,
  Minus,
} from 'lucide-react';
import SubScreenContainer from '../components/shared/SubScreenContainer';
import PrimaryCTA from '../components/shared/PrimaryCTA';

// FYLOS · BookingFlow — single slide-in screen.
//
// Multi-step but the user sees ONE form that progressively reveals sections
// as previous steps complete (Uber-DNA staging from FYLOS_PRODUCT_DIRECTION
// §5 Zone L). Sticky bottom Continue button with state-aware label.
//
// Steps the user moves through:
//   1. Service        — what type / duration of service
//   2. Date & time    — pick from availability
//   3. Pet            — which Fylos this booking is for
//   4. Add-ons        — optional extras
//   5. Notes          — free text for the provider
//
// On Continue → onComplete(draft) lifts the draft for Payment.

const STEPS = ['service', 'date', 'pet', 'addons', 'notes'];

export default function BookingFlow({
  provider,
  pets = [],
  preselectedServiceId,
  onClose,
  onContinue,
}) {
  const [serviceId, setServiceId] = useState(
    preselectedServiceId || provider.services.find((s) => s.popular)?.id || provider.services[0]?.id
  );
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [petId, setPetId] = useState(pets.length === 1 ? pets[0].id : null);
  const [addOns, setAddOns] = useState([]);
  const [notes, setNotes] = useState('');

  const service = provider.services.find((s) => s.id === serviceId);
  const total = useMemo(() => {
    const base = service?.price || 0;
    const extras = addOns.reduce((sum, id) => {
      const a = provider.addOns.find((x) => x.id === id);
      return sum + (a ? a.price : 0);
    }, 0);
    return base + extras;
  }, [service, addOns, provider.addOns]);

  const currentStep = useMemo(() => {
    if (!serviceId) return 0;
    if (!date || !time) return 1;
    if (pets.length > 1 && !petId) return 2;
    return 4;
  }, [serviceId, date, time, petId, pets.length]);

  const canContinue = !!serviceId && !!date && !!time && (pets.length <= 1 || !!petId);

  const handleContinue = () => {
    if (!canContinue) return;
    const pet = pets.find((p) => p.id === petId) || pets[0] || null;
    const draft = {
      provider: {
        id: provider.id,
        name: provider.displayName,
        photo: provider.photo,
        rating: provider.rating,
      },
      service: {
        id: service.id,
        label: service.label,
        duration: service.duration,
        type: service.type,
      },
      dateTime: {
        date,
        time,
        endTime: addMinutesToTime(time, service.duration),
        start: `${date}T${time}:00+01:00`,
        formatted: formatPretty(date, time, service.duration),
      },
      pet: pet ? { id: pet.id, name: pet.name } : null,
      addOns: addOns
        .map((id) => provider.addOns.find((x) => x.id === id))
        .filter(Boolean)
        .map((a) => ({ id: a.id, label: a.label, price: a.price })),
      notes: notes.trim(),
      total,
      currency: provider.currency || 'CHF',
    };
    onContinue && onContinue(draft);
  };

  const toggleAddOn = (id) =>
    setAddOns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const availableDates = Object.entries(provider.availability)
    .filter(([, v]) => v.available)
    .slice(0, 14);
  const slotsForDate = date ? provider.availability[date]?.slots || [] : [];

  return (
    <SubScreenContainer
      title="Book"
      onClose={onClose}
      bottomCTA={
        <PrimaryCTA onTap={handleContinue} disabled={!canContinue}>
          {canContinue
            ? `Continue · ${provider.currency} ${total.toFixed(2)}`
            : 'Continue'}
        </PrimaryCTA>
      }
    >
      <div className="px-5">
        {/* Provider summary */}
        <div className="flex items-center gap-3 pb-4 mb-1 border-b border-black/[0.04]">
          <img
            src={provider.photo}
            alt=""
            className="w-10 h-10 rounded-[12px] object-cover bg-[#F2F2F7]"
          />
          <div className="min-w-0">
            <span className="text-[13.5px] font-semibold text-[#111111] block truncate">{provider.displayName}</span>
            <span className="text-[11.5px] text-[#8E8E93]">{provider.location}</span>
          </div>
        </div>

        {/* ── Service ─────────────────────────────────────────── */}
        <Section number={1} title="Choose a service" complete={!!serviceId}>
          <div className="bg-white rounded-[16px] border border-black/[0.04] divide-y divide-black/[0.04]">
            {provider.services.map((svc) => {
              const selected = svc.id === serviceId;
              return (
                <button
                  key={svc.id}
                  onClick={() => { setServiceId(svc.id); setTime(null); }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:opacity-70 transition-opacity"
                >
                  <span
                    className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${
                      selected ? 'border-[#E85D2A]' : 'border-[#C4BBB3]'
                    }`}
                  >
                    {selected && <span className="w-2 h-2 bg-[#E85D2A] rounded-full" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[14px] truncate ${selected ? 'font-semibold text-[#111111]' : 'font-medium text-[#111111]'}`}>{svc.label}</span>
                      {svc.popular && (
                        <span className="text-[9px] font-bold uppercase text-[#E85D2A]">Popular</span>
                      )}
                    </div>
                    {svc.description && (
                      <span className="text-[11.5px] text-[#8E8E93] mt-0.5 block">{svc.description}</span>
                    )}
                  </div>
                  <span className="text-[14px] font-bold text-[#111111] shrink-0">{provider.currency} {svc.price}</span>
                </button>
              );
            })}
          </div>
        </Section>

        {/* ── Date & time ─────────────────────────────────────── */}
        {currentStep >= 1 && (
          <Section number={2} title="Pick date & time" complete={!!date && !!time}>
            <div
              className="flex gap-2 -mx-5 px-5 mb-3 overflow-x-auto"
              style={{ scrollbarWidth: 'none' }}
            >
              {availableDates.map(([d]) => {
                const dt = new Date(`${d}T00:00:00`);
                const selected = date === d;
                return (
                  <button
                    key={d}
                    onClick={() => { setDate(d); setTime(null); }}
                    className={`shrink-0 min-w-[64px] py-2.5 rounded-[14px] flex flex-col items-center transition-colors ${
                      selected
                        ? 'bg-[#111111] text-white'
                        : 'bg-white border border-black/[0.05] text-[#111111]'
                    }`}
                  >
                    <span className={`text-[10px] font-semibold uppercase ${selected ? 'text-white/60' : 'text-[#A09A94]'}`}>
                      {dt.toLocaleDateString('en', { weekday: 'short' })}
                    </span>
                    <span className="text-[16px] font-bold leading-tight mt-0.5">{dt.getDate()}</span>
                    <span className={`text-[10px] ${selected ? 'text-white/60' : 'text-[#A09A94]'}`}>
                      {dt.toLocaleDateString('en', { month: 'short' })}
                    </span>
                  </button>
                );
              })}
            </div>

            {date && (
              slotsForDate.length === 0 ? (
                <p className="text-[12.5px] text-[#A09A94] px-1">No slots for this day. Try another.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {slotsForDate.map((s) => {
                    const selected = time === s.time;
                    return (
                      <button
                        key={s.time}
                        disabled={!s.available}
                        onClick={() => setTime(s.time)}
                        className={`h-[36px] px-3.5 rounded-full text-[12.5px] font-semibold transition-all ${
                          !s.available
                            ? 'bg-[#F2F2F7] text-[#C4BBB3] cursor-not-allowed line-through'
                            : selected
                            ? 'bg-[#E85D2A] text-white'
                            : 'bg-white text-[#111111] border border-black/[0.05]'
                        }`}
                      >
                        {s.time}
                      </button>
                    );
                  })}
                </div>
              )
            )}
            {time && service && (
              <p className="text-[11.5px] text-[#8E8E93] mt-2">
                Ends at {addMinutesToTime(time, service.duration)} · {service.duration} min
              </p>
            )}
          </Section>
        )}

        {/* ── Pet ─────────────────────────────────────────────── */}
        {currentStep >= 2 && pets.length > 1 && (
          <Section number={3} title="Which Fylos?" complete={!!petId}>
            <div className="flex flex-wrap gap-2">
              {pets.map((p) => {
                const selected = petId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPetId(p.id)}
                    className={`flex items-center gap-2 pl-1.5 pr-3.5 py-1 rounded-full transition-all ${
                      selected
                        ? 'bg-[#111111] text-white'
                        : 'bg-white text-[#111111] border border-black/[0.05]'
                    }`}
                  >
                    {p.avatar ? (
                      <img src={p.avatar} alt="" className="w-7 h-7 rounded-full object-cover bg-[#F2F2F7]" />
                    ) : (
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${selected ? 'bg-white/15 text-white' : 'bg-[#F2F2F7] text-[#6E6E73]'}`}>
                        {p.name.charAt(0)}
                      </span>
                    )}
                    <span className="text-[13px] font-semibold">{p.name}</span>
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── Add-ons ─────────────────────────────────────────── */}
        {currentStep >= 2 && provider.addOns?.length > 0 && (
          <Section number={pets.length > 1 ? 4 : 3} title="Add-ons" optional complete>
            <div className="bg-white rounded-[16px] border border-black/[0.04] divide-y divide-black/[0.04]">
              {provider.addOns.map((a) => {
                const selected = addOns.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleAddOn(a.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left active:opacity-70"
                  >
                    <div className="flex-1 min-w-0">
                      <span className="text-[13.5px] font-semibold text-[#111111] block">{a.label}</span>
                      <span className="text-[11.5px] text-[#8E8E93]">{a.description}</span>
                    </div>
                    <span className="text-[13px] font-bold text-[#111111]">+{provider.currency} {a.price}</span>
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        selected ? 'bg-[#E85D2A] text-white' : 'bg-[#F2F2F7] text-[#6E6E73]'
                      }`}
                    >
                      {selected ? <Minus size={13} strokeWidth={2.6} /> : <Plus size={13} strokeWidth={2.6} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </Section>
        )}

        {/* ── Notes ───────────────────────────────────────────── */}
        {currentStep >= 2 && (
          <Section number={(pets.length > 1 ? 5 : 4)} title="Anything they should know?" optional complete>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Routes your Fylos likes, things to avoid, gate codes…"
              maxLength={300}
              rows={3}
              className="w-full bg-white border border-black/[0.05] rounded-[14px] px-4 py-3 text-[13.5px] text-[#111111] placeholder:text-[#A09A94] outline-none focus:border-[#E85D2A]/40 resize-none"
            />
            <p className="text-[10.5px] text-[#A09A94] text-right mt-1">{notes.length}/300</p>
          </Section>
        )}

        {/* ── Summary ─────────────────────────────────────────── */}
        {canContinue && (
          <div className="bg-[#FFEDE3] rounded-[16px] p-4 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-[#A65A2C] uppercase tracking-wider">Total</span>
              <span className="text-[18px] font-bold text-[#111111]">
                {provider.currency} {total.toFixed(2)}
              </span>
            </div>
            <p className="text-[11.5px] text-[#8B5634] mt-1.5">
              You'll be charged after {provider.displayName.split(' ')[0]} confirms.
            </p>
          </div>
        )}
      </div>
    </SubScreenContainer>
  );
}

function Section({ number, title, optional, complete, children }) {
  return (
    <section className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
            complete ? 'bg-[#E85D2A] text-white' : 'bg-[#F2F2F7] text-[#A09A94]'
          }`}
        >
          {number}
        </span>
        <h3 className="text-[15px] font-semibold text-[#111111]">{title}</h3>
        {optional && (
          <span className="text-[10.5px] font-medium text-[#A09A94] uppercase tracking-wider ml-1">Optional</span>
        )}
      </div>
      {children}
    </section>
  );
}

function pad(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function addMinutesToTime(time, minutes) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + minutes;
  const newH = Math.floor((total / 60) % 24);
  const newM = total % 60;
  return `${pad(newH)}:${pad(newM)}`;
}

function formatPretty(date, time, duration) {
  if (!date || !time) return '';
  const d = new Date(`${date}T${time}:00`);
  const end = addMinutesToTime(time, duration);
  return `${d.toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })} · ${time}–${end}`;
}
