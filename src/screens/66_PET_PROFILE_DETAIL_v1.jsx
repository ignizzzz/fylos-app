import React, { useState } from 'react';
import {
  ChevronLeft,
  Settings,
  PawPrint,
  Calendar,
  Check,
  ArrowRight,
  Clock,
  Star,
  Plus,
  Camera,
  AlertCircle,
  Shield,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   66 — PET PROFILE DETAIL v1
   Detailed pet profile with health, meds, activity, photos
   ═══════════════════════════════════════════════════════ */

const PET = {
  name: 'Luna',
  breed: 'Golden Retriever',
  age: '3 years',
  gender: 'Female',
  weight: '28.5 kg',
  birthday: 'March 15, 2023',
  microchip: '756 0934 2817 4',
  neutered: true,
};

const MEDICATIONS = [
  { name: 'Apoquel 16mg', schedule: 'Daily' },
  { name: 'Joint Supplement', schedule: 'Twice daily' },
];

const ACTIVITIES = [
  { title: 'Walk with Sofia L.', date: 'Today, 10:00', detail: '60 min - 3.2 km' },
  { title: 'Grooming at PetStyle', date: 'March 14', detail: 'Bath & trim' },
  { title: 'Vet Visit', date: 'March 10', detail: 'Vaccination booster' },
];

const PHOTO_COLORS = ['#FDEBD0', '#FCE4EC', '#E8F5E9', '#E3F2FD', '#FFF3E0'];

const BOOKINGS = [
  { provider: 'Sofia L.', service: 'Dog Walking', date: 'March 20, 10:00', status: 'Confirmed', avatar: '#FDEBD0' },
  { provider: 'PetStyle Salon', service: 'Full Grooming', date: 'March 25, 14:00', status: 'Confirmed', avatar: '#E3F2FD' },
];

/* ── Sub-components ── */

const SectionLabel = ({ children, action, onAction }) => (
  <div className="flex justify-between items-center mb-3">
    <span className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest">{children}</span>
    {action && (
      <button
        onClick={onAction}
        className="flex items-center gap-1 text-[13px] font-medium text-[#E85D2A] bg-transparent active:opacity-60 transition-opacity cursor-pointer"
        style={{ border: 'none', padding: 0 }}
      >
        {action} <ArrowRight size={14} />
      </button>
    )}
  </div>
);

const Pill = ({ children }) => (
  <span
    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-[12px] font-medium text-[#6E6058]"
    style={{
      backgroundColor: '#F3EFEB',
      border: '1px solid #EDE8E2',
    }}
  >
    {children}
  </span>
);

const Card = ({ children, className = '', style = {} }) => (
  <div
    className={`rounded-[20px] p-5 mb-3.5 ${className}`}
    style={{ backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2', ...style }}
  >
    {children}
  </div>
);

const InfoRow = ({ icon: Icon, iconBg, children, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div
      className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: iconBg }}
    >
      <Icon size={18} />
    </div>
    <div className="flex-1 min-w-0">{children}</div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
const PetProfileDetailScreen = () => {
  const [liked, setLiked] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .pp-scroll::-webkit-scrollbar { display: none; }
        .pp-scroll { scrollbar-width: none; }
      `}</style>

      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          className="relative"
          style={{
            width: 390, height: 844, borderRadius: 50,
            border: '8px solid #000', overflow: 'hidden',
            backgroundColor: '#F7F5F2',
          }}
        >
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]"
               style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
               style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Floating Header */}
          <header
            className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent"
            style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}
          >
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <button
                onClick={() => { window.history.back(); }}
                className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
                style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
              >
                <ChevronLeft size={22} color="#111" />
              </button>
              <h2 className="text-[17px] font-semibold text-[#111]">Pet Profile</h2>
              <button
                className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
                style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
              >
                <Settings size={22} color="#111" />
              </button>
            </div>
          </header>

          {/* Scroll content */}
          <div className="absolute inset-0 overflow-y-auto pt-[110px] pb-[140px] px-5" style={{ scrollbarWidth: 'none' }}>

            {/* Hero photo area */}
            <div
              className="w-full rounded-[20px] flex items-center justify-center overflow-hidden mb-3.5"
              style={{
                height: 220,
                background: 'linear-gradient(135deg, #FDEBD0, #FCE4EC)',
                border: '1px solid #EDE8E2',
              }}
            >
              <PawPrint size={64} color="rgba(232,93,42,0.2)" strokeWidth={1.5} />
            </div>

            {/* Name + breed + badges */}
            <div className="text-center mb-5">
              <h1 className="text-[22px] font-semibold text-[#111] tracking-tight m-0 mb-0.5">
                {PET.name}
              </h1>
              <p className="text-[15px] text-[#6E6058] m-0 mb-2.5">{PET.breed}</p>
              <div className="flex gap-2 justify-center">
                <Pill>{PET.age}</Pill>
                <Pill>{'\u2640'} {PET.gender}</Pill>
              </div>
            </div>

            {/* Quick info grid */}
            <Card className="!p-0 overflow-hidden">
              <div className="grid grid-cols-2">
                {[
                  { label: 'Weight', value: PET.weight, sub: 'trending up' },
                  { label: 'Birthday', value: PET.birthday },
                  { label: 'Microchip', value: '756 0934 ...' },
                  { label: 'Neutered', value: 'Yes' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-4"
                    style={{
                      borderRight: i % 2 === 0 ? '1px dashed #CFCFD4' : 'none',
                      borderBottom: i < 2 ? '1px dashed #CFCFD4' : 'none',
                    }}
                  >
                    <span className="block text-[12px] font-bold text-[#A09A94] uppercase tracking-widest mb-1">
                      {item.label}
                    </span>
                    <span className="block text-[15px] font-semibold text-[#111]">{item.value}</span>
                    {item.sub && (
                      <span className="block text-[12px] text-[#34C759] mt-0.5">{item.sub}</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Health */}
            <SectionLabel>Health</SectionLabel>
            <Card>
              <InfoRow icon={Calendar} iconBg="rgba(232,93,42,0.08)" className="mb-3.5">
                <span className="block text-[15px] font-medium text-[#111]">Annual Checkup</span>
                <span className="text-[13px] text-[#6E6058]">April 12</span>
              </InfoRow>

              <InfoRow icon={Shield} iconBg="rgba(232,93,42,0.08)" className="mb-3.5">
                <span className="block text-[15px] font-medium text-[#111] mb-1">Vaccinations - 5/6 up to date</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <div
                      key={n}
                      className="w-2 h-2 rounded-full"
                      style={{ background: n <= 5 ? '#E85D2A' : '#D5CEC7' }}
                    />
                  ))}
                </div>
              </InfoRow>

              <InfoRow icon={AlertCircle} iconBg="rgba(255,149,0,0.08)" className="mb-3.5">
                <span className="block text-[15px] font-medium text-[#111]">Allergies</span>
                <span className="text-[13px] text-[#6E6058]">Chicken, Pollen</span>
              </InfoRow>

              <InfoRow icon={Check} iconBg="rgba(52,199,89,0.08)">
                <span className="text-[15px] font-medium text-[#111]">28.5 kg - stable</span>
              </InfoRow>
            </Card>

            {/* Medications */}
            <SectionLabel>Medications</SectionLabel>
            <Card>
              {MEDICATIONS.map((med, i) => (
                <InfoRow key={i} icon={Clock} iconBg="rgba(232,93,42,0.08)" className={i < MEDICATIONS.length - 1 ? 'mb-3' : 'mb-3.5'}>
                  <span className="block text-[15px] font-medium text-[#111]">{med.name}</span>
                  <span className="text-[13px] text-[#6E6058]">{med.schedule}</span>
                </InfoRow>
              ))}
              <button
                className="flex items-center gap-1.5 text-[15px] font-medium text-[#E85D2A] bg-transparent cursor-pointer active:opacity-60 transition-opacity"
                style={{ border: 'none', padding: 0 }}
              >
                <Plus size={16} /> Add Medication
              </button>
            </Card>

            {/* Recent Activity */}
            <SectionLabel action="See all" onAction={() => window.location.href = '/'}>Activity</SectionLabel>
            <Card>
              {ACTIVITIES.map((act, i) => (
                <div
                  key={i}
                  className="relative pl-5"
                  style={{ marginBottom: i < ACTIVITIES.length - 1 ? 14 : 0 }}
                >
                  <div
                    className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #FF7240, #E85D2A)' }}
                  />
                  {i < ACTIVITIES.length - 1 && (
                    <div
                      className="absolute left-1 top-4"
                      style={{ width: 2, height: 'calc(100% - 4px)', background: '#D5CEC7' }}
                    />
                  )}
                  <span className="block text-[15px] font-medium text-[#111]">{act.title}</span>
                  <span className="block text-[13px] text-[#A09A94] mt-0.5">{act.date}</span>
                  <span className="block text-[13px] text-[#6E6058] mt-0.5">{act.detail}</span>
                </div>
              ))}
            </Card>

            {/* Photos */}
            <SectionLabel action="See all" onAction={() => window.location.href = '/photo-gallery'}>Photos</SectionLabel>
            <div className="flex gap-2.5 overflow-x-auto pb-3.5" style={{ scrollbarWidth: 'none' }}>
              {PHOTO_COLORS.map((color, i) => (
                <div
                  key={i}
                  className="w-20 h-20 rounded-[16px] flex-shrink-0 flex items-center justify-center active:scale-[0.97] transition-all duration-[120ms] cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${color}, ${color}dd)`,
                    border: '1px solid #EDE8E2',
                  }}
                >
                  <Camera size={20} color="rgba(0,0,0,0.1)" />
                </div>
              ))}
            </div>

            {/* Upcoming Bookings */}
            <SectionLabel>Upcoming</SectionLabel>
            {BOOKINGS.map((b, i) => (
              <Card key={i} className="!p-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${b.avatar}, ${b.avatar}dd)` }}
                  >
                    <Star size={18} color="rgba(0,0,0,0.1)" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-[15px] font-semibold text-[#111]">{b.provider}</span>
                    <span className="block text-[13px] text-[#6E6058] mt-0.5">{b.service} - {b.date}</span>
                  </div>
                  <span
                    className="h-[18px] px-2.5 rounded-full text-[9px] font-semibold inline-flex items-center bg-[#EEF7F1] text-[#3F8D63] border border-[#D7EBDD]"
                  >
                    {b.status}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Sticky bottom CTA */}
          <div
            className="absolute bottom-0 left-0 right-0 z-10"
            style={{
              padding: '12px 20px 34px',
              background: 'linear-gradient(transparent, rgba(247,245,242,0.95) 20%)',
            }}
          >
            <button
              onClick={() => window.location.href = '/booking-flow'}
              className="w-full bg-[#111] text-white rounded-[14px] py-3.5 font-semibold text-[16px] active:scale-[0.97] transition-all duration-[120ms] cursor-pointer"
              style={{
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
              }}
            >
              Book Service
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetProfileDetailScreen;
