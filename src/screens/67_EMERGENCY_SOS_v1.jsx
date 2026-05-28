import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  Phone,
  X,
  Info,
  Wind,
  Droplet,
  FlaskConical,
  Thermometer,
  Activity,
  Bug,
  Flame,
  HeartPulse,
  AlertTriangle,
} from 'lucide-react';

/**
 * 67_EMERGENCY_SOS_v1.jsx
 * First aid screen for pet owners.
 *
 * Design principles:
 *   1. Calling the vet is the primary action everywhere. The grid of
 *      "situations" is secondary; tapping any card opens a sheet that
 *      starts with "Call your vet now".
 *   2. We are NOT a veterinary service. The copy describes observations
 *      and conservative things-you-can-do-while-you-wait, never diagnoses,
 *      drug names, dosages, or specific treatments.
 *   3. Disclaimers sit both at the top (visible at-a-glance) and the
 *      bottom (full legal text). The detail sheet repeats the disclaimer
 *      at its top so it is visible even after navigating in.
 */

const PRIMARY_VET = {
  name: 'Tierklinik Zürich',
  phone: '+41 44 635 81 11',
  hours: '24/7 emergency line',
};

// Eight common situations. Language is deliberately conservative:
// · "What you might see" instead of diagnostic terms
// · "While you call" instead of "treatment" or "what to do"
// · "Avoid" instead of "don't ever" — and the items are about
//   *preventing additional harm*, not stand-ins for treatment.
const SITUATIONS = [
  {
    id: 'choking',
    title: 'Choking',
    icon: Wind,
    signs: [
      'Sudden gagging or pawing at the mouth',
      'Loud, panicked breathing, or no sound of airflow',
      'Blue or pale gums',
    ],
    whileYouCall: [
      'Stay calm — a panicked pet may bite reflexively',
      'Look in the mouth gently. Only remove an object if you can clearly see it and reach it easily',
      'Keep your pet as still as possible',
    ],
    avoid: [
      'Blind finger sweeps — they can push the object deeper',
      'Giving water or food',
      'Techniques you have seen online but were never shown by a professional',
    ],
  },
  {
    id: 'bleeding',
    title: 'Heavy bleeding',
    icon: Droplet,
    signs: [
      'Blood that does not slow after a minute of steady pressure',
      'Blood soaking through cloth',
      'Pale gums or weakness',
    ],
    whileYouCall: [
      'Press firmly on the wound with a clean cloth',
      'Leave the cloth in place even if it soaks through — add layers if needed',
      'Keep your pet warm and as still as possible',
    ],
    avoid: [
      'Removing the cloth to peek at the wound',
      'Applying ointments or human medications',
      'Removing anything embedded in the wound',
    ],
  },
  {
    id: 'poisoning',
    title: 'Suspected poisoning',
    icon: FlaskConical,
    signs: [
      'You saw your pet eat something potentially dangerous',
      'Sudden drooling, vomiting, tremors, or unsteady walking',
    ],
    whileYouCall: [
      'Note what was eaten and roughly how much',
      'Save the packaging or a small sample of the substance',
      'Note the time it happened',
    ],
    avoid: [
      'Trying to make your pet vomit without your vet’s instruction — some substances cause more damage coming back up',
      'Home remedies you read about',
    ],
  },
  {
    id: 'heat',
    title: 'Heat distress',
    icon: Thermometer,
    signs: [
      'Heavy panting, drooling',
      'Very red or very pale gums',
      'Wobbly walking or collapse',
    ],
    whileYouCall: [
      'Move to a cool, shaded place',
      'Offer small sips of cool water — only if your pet is fully alert',
      'Wet the ears, paws, and belly with cool (not ice-cold) water',
    ],
    avoid: [
      'Ice or ice-cold water — it can cause shock',
      'Forcing water if your pet is not fully alert',
    ],
  },
  {
    id: 'seizure',
    title: 'Seizure',
    icon: Activity,
    signs: [
      'Sudden stiffness, loss of awareness',
      'Paddling movements, drooling',
      'Loss of bladder or bowel control',
    ],
    whileYouCall: [
      'Stay calm and move furniture or objects out of the way',
      'Time how long the seizure lasts',
      'Speak softly — do not touch the head or mouth',
    ],
    avoid: [
      'Restraining your pet',
      'Putting hands near the mouth',
      'Giving food, water, or any medication',
    ],
    afterNote: 'Call your vet even if the seizure stops on its own.',
  },
  {
    id: 'allergic',
    title: 'Sudden allergic reaction',
    icon: Bug,
    signs: [
      'Swelling of face, eyes, or lips',
      'Hives or raised bumps on the skin',
      'Vomiting, weakness, difficulty breathing',
    ],
    whileYouCall: [
      'Note what your pet ate or what stung them, if you saw',
      'Keep them calm and still',
    ],
    avoid: [
      'Giving human allergy medication without your vet confirming the right type and dose for your specific pet',
    ],
  },
  {
    id: 'burn',
    title: 'Burns or scalds',
    icon: Flame,
    signs: [
      'Red, blistered, or peeling skin',
      'Singed fur',
      'Painful reactions when touched',
    ],
    whileYouCall: [
      'Gently run cool — not ice-cold — water over the area for several minutes',
      'Cover loosely with a clean, damp cloth',
    ],
    avoid: [
      'Butter, oils, or ointments',
      'Ice or popping blisters',
      'Removing anything stuck to the skin',
    ],
  },
  {
    id: 'breathing',
    title: 'Not breathing',
    icon: HeartPulse,
    signs: [
      'No visible chest movement',
      'Limp, unresponsive',
      'Blue or pale gums',
    ],
    whileYouCall: [
      'Place your pet on their right side on a firm surface',
      'Check if the airway looks clear of obvious objects',
      'Watch closely for any chest movement',
    ],
    avoid: [
      'Untrained CPR techniques — they can cause harm if done incorrectly',
    ],
    afterNote: 'CPR varies by pet size and species. Ask your vet on the phone to guide you — many practices have a hotline that talks you through it.',
  },
];

// ───────────────────────────────────────────────────────────────────
// Reusable bits
// ───────────────────────────────────────────────────────────────────

const Disclaimer = ({ inline = false }) => (
  <div
    className={`flex items-start gap-2 rounded-[12px] ${inline ? 'px-3 py-2' : 'px-3.5 py-2.5'}`}
    style={{ background: '#FFF8EE', border: '1px solid #F0E4CC' }}
  >
    <Info size={14} className="text-[#B07A3A] shrink-0 mt-[1px]" strokeWidth={2} />
    <p className={`${inline ? 'text-[11px]' : 'text-[11.5px]'} leading-[1.45] text-[#6E5A3A]`}>
      General guidance only — not medical advice. Always contact a licensed
      veterinarian as your first step.
    </p>
  </div>
);

const CallVetCard = ({ onCall }) => (
  <div className="rounded-[16px] p-4" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}>
    <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A09A94] mb-1.5">Your vet</div>
    <div className="text-[15px] font-bold text-[#111]">{PRIMARY_VET.name}</div>
    <div className="text-[12px] text-[#6E6058] mt-0.5">{PRIMARY_VET.hours}</div>
    <button
      onClick={onCall}
      className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-[12px] active:scale-[0.98] transition-transform"
      style={{
        background: '#FF3B30',
        boxShadow: '0 2px 10px rgba(255,59,48,0.18)',
      }}
    >
      <Phone size={16} className="text-white" strokeWidth={2.2} />
      <span className="text-[14px] font-bold text-white">Call now</span>
    </button>
    <div className="text-[10.5px] text-[#A09A94] text-center mt-2 leading-[1.4]">
      Outside Switzerland or have a different vet? Update in Settings → Connected services.
    </div>
  </div>
);

const SituationCard = ({ situation, onTap }) => (
  <button
    onClick={() => onTap(situation.id)}
    className="flex flex-col items-start gap-2 px-3 py-3 rounded-[14px] active:scale-[0.97] transition-transform text-left"
    style={{ background: '#F3EFEB' }}
  >
    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
      <situation.icon size={15} className="text-[#111]" strokeWidth={1.9} />
    </span>
    <span className="text-[12.5px] font-semibold text-[#111] leading-[1.3]">{situation.title}</span>
  </button>
);

// ───────────────────────────────────────────────────────────────────
// Detail sheet — opens when a situation card is tapped
// ───────────────────────────────────────────────────────────────────

const DetailSheet = ({ situation, onClose, onCall }) => {
  // Lock body scroll while open
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!situation) return null;
  const Icon = situation.icon;

  return (
    <div className="absolute inset-0 z-[200]" style={{ animation: 'fa-fade 0.2s ease both' }}>
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0" style={{ background: 'rgba(20,15,10,0.32)' }} />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#F7F5F2] rounded-t-[28px] flex flex-col overflow-hidden"
        style={{
          maxHeight: '88%',
          animation: 'fa-slide 0.3s cubic-bezier(0.22, 1, 0.36, 1) both',
          boxShadow: '0 -8px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* Drag handle + header */}
        <div className="pt-2.5 pb-2 flex flex-col items-center shrink-0">
          <div className="w-9 h-1 rounded-full bg-[#D4CCC4]" />
        </div>
        <div className="px-5 pb-3 flex items-center gap-3 shrink-0">
          <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
            <Icon size={18} className="text-[#111]" strokeWidth={1.9} />
          </span>
          <h2 className="flex-1 text-[18px] font-bold text-[#111]">{situation.title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/0 hover:bg-black/[0.04] flex items-center justify-center active:scale-95 transition-all"
            aria-label="Close"
          >
            <X size={18} className="text-[#6E6058]" strokeWidth={2} />
          </button>
        </div>

        {/* Top alert: always "call vet now" */}
        <div className="px-5 shrink-0">
          <div
            className="flex items-start gap-2 rounded-[12px] px-3.5 py-3"
            style={{ background: '#FFF0F0', border: '1px solid #FFD6D2' }}
          >
            <AlertTriangle size={15} className="text-[#FF3B30] shrink-0 mt-[1px]" strokeWidth={2.2} />
            <div className="flex-1">
              <p className="text-[12.5px] font-bold text-[#111] leading-[1.4]">Call your vet now.</p>
              <p className="text-[11.5px] text-[#6E6058] leading-[1.45] mt-0.5">
                The notes below are general support while you wait. They are not a substitute
                for veterinary care.
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 pt-4 pb-32" style={{ scrollbarWidth: 'none' }}>
          {situation.signs && (
            <section className="mb-5">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A09A94] mb-2">
                What you might see
              </h3>
              <ul className="space-y-1.5">
                {situation.signs.map((s, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="w-1 h-1 rounded-full bg-[#6E6058] mt-2 shrink-0" />
                    <span className="text-[13px] leading-[1.5] text-[#3A3530]">{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {situation.whileYouCall && (
            <section className="mb-5">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A09A94] mb-2">
                While you call
              </h3>
              <ul className="space-y-1.5">
                {situation.whileYouCall.map((s, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="w-1 h-1 rounded-full bg-[#6E6058] mt-2 shrink-0" />
                    <span className="text-[13px] leading-[1.5] text-[#3A3530]">{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {situation.avoid && (
            <section className="mb-5">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A09A94] mb-2">
                Avoid
              </h3>
              <ul className="space-y-1.5">
                {situation.avoid.map((s, i) => (
                  <li key={i} className="flex gap-2.5 items-start">
                    <span className="w-1 h-1 rounded-full bg-[#FF3B30] mt-2 shrink-0" />
                    <span className="text-[13px] leading-[1.5] text-[#3A3530]">{s}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {situation.afterNote && (
            <div
              className="rounded-[12px] px-3.5 py-3 mb-5"
              style={{ background: '#FFF8EE', border: '1px solid #F0E4CC' }}
            >
              <p className="text-[12.5px] leading-[1.5] text-[#6E5A3A]">{situation.afterNote}</p>
            </div>
          )}

          <Disclaimer inline />
        </div>

        {/* Sticky call CTA */}
        <div
          className="px-5 pt-3 pb-5 shrink-0"
          style={{
            background: 'linear-gradient(to top, #F7F5F2 70%, rgba(247,245,242,0))',
          }}
        >
          <button
            onClick={onCall}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[14px] active:scale-[0.98] transition-transform"
            style={{
              background: '#FF3B30',
              boxShadow: '0 4px 14px rgba(255,59,48,0.22)',
            }}
          >
            <Phone size={16} className="text-white" strokeWidth={2.2} />
            <span className="text-[14.5px] font-bold text-white">Call vet now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────────────────────────
// Main screen
// ───────────────────────────────────────────────────────────────────

const FirstAidScreen = () => {
  const [selectedId, setSelectedId] = useState(null);
  const selected = SITUATIONS.find((s) => s.id === selectedId);

  const callVet = () => {
    const tel = PRIMARY_VET.phone.replace(/\s/g, '');
    window.location.href = `tel:${tel}`;
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes fa-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fa-slide {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#EDE8E2', padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <div
          className="relative"
          style={{
            width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
            overflow: 'hidden', backgroundColor: '#F7F5F2',
          }}
        >
          {/* Notch */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-[100]"
            style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }}
          />
          {/* Home indicator */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
            style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }}
          />

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="absolute inset-0 overflow-y-auto pb-10" style={{ scrollbarWidth: 'none' }}>
            {/* Sticky header */}
            <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30 bg-[#F7F5F2]">
              <button
                onClick={() => window.history.back()}
                className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all"
              >
                <ChevronLeft size={18} strokeWidth={2.2} color="#111" />
              </button>
              <h1 className="text-[17px] font-semibold text-[#111]">First aid</h1>
            </div>

            <div className="px-5 pt-1 pb-6 flex flex-col gap-3">
              {/* Top disclaimer */}
              <Disclaimer />

              {/* Primary action — call vet */}
              <CallVetCard onCall={callVet} />

              {/* Section: common situations */}
              <div className="mt-2">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A09A94] mb-2.5 px-0.5">
                  Common situations
                </h2>
                <div className="grid grid-cols-2 gap-2.5">
                  {SITUATIONS.map((s) => (
                    <SituationCard key={s.id} situation={s} onTap={setSelectedId} />
                  ))}
                </div>
              </div>

              {/* Footer legal disclaimer (long form) */}
              <div className="mt-3 px-1">
                <p className="text-[11px] leading-[1.55] text-[#A09A94]">
                  FYLOS is not a veterinary service and does not provide medical advice,
                  diagnosis, or treatment. The information shown on this screen is general
                  guidance to help you act safely while you contact a licensed veterinarian.
                  If your pet shows signs of distress, contact your veterinarian or an
                  emergency animal hospital immediately. By using this guidance, you
                  acknowledge that you are responsible for decisions regarding your pet’s
                  care.
                </p>
              </div>
            </div>
          </div>

          {/* Detail sheet (overlay) */}
          {selected && (
            <DetailSheet
              situation={selected}
              onClose={() => setSelectedId(null)}
              onCall={callVet}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default FirstAidScreen;
