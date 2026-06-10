import React, { useState } from 'react';
import { ChevronLeft, Check, Sparkles, Zap, Percent, Stethoscope, Users, Crown } from 'lucide-react';

/**
 * 49_SUBSCRIPTION_v1.jsx — Subscription (Free vs fylos Plus).
 * Premium coral member-card for Plus, clean feature list, monthly/yearly
 * toggle. Warm aesthetic.
 */

const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const TINT = '#FBE7DD';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#9B9B9F';
const GREEN = '#3F8D63';
const LINE = '#F1EDE8';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';
const CARD_GRADIENT = 'linear-gradient(150deg,#EF6A3C,#E85D2A 52%,#D44D1B)';

const PERKS = [
  { icon: Percent, title: '10% off every booking', sub: 'Walks, sitting, grooming & more' },
  { icon: Zap, title: 'Priority booking', sub: 'Get matched with top sitters first' },
  { icon: Stethoscope, title: 'Free vet telehealth', sub: 'Unlimited 24/7 chat with a vet' },
  { icon: Users, title: 'Unlimited pet profiles', sub: 'Add your whole family' },
  { icon: Sparkles, title: 'Health reminders & insights', sub: 'Smart care for every pet' },
];

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

const SubscriptionScreen = () => {
  const [cycle, setCycle] = useState('yearly');
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };
  const price = cycle === 'yearly' ? '6.50' : '7.99';

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@800&display=swap');`}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          <StatusBar />

          <div className="absolute inset-0" style={{ background: CREAM }}>
            <div className="absolute inset-0 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <div className="pt-14 pb-5 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 56%, rgba(247,245,242,0) 100%)' }}>
              <button onClick={back} className="absolute left-5 top-[52px] w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-all pointer-events-auto" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} color="#111" strokeWidth={2.2} /></button>
              <h1 className="text-[17px] font-bold tracking-[-0.01em]" style={{ color: INK }}>Subscription</h1>
            </div>

            <div className="px-5 pb-32">
              {/* Current plan */}
              <div className="flex items-center gap-3 rounded-[16px] bg-white px-4 py-3.5 mt-4" style={{ boxShadow: SHADOW }}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: PEACH }}><Check size={16} color={MUTED} strokeWidth={2.4} /></span>
                <div className="flex-1"><div className="text-[14.5px] font-semibold" style={{ color: INK }}>Free plan</div><div className="text-[12px] mt-0.5" style={{ color: TERT }}>Your current plan</div></div>
              </div>

              {/* Plus hero */}
              <div className="relative rounded-[24px] overflow-hidden mt-5 p-5" style={{ background: CARD_GRADIENT, boxShadow: '0 12px 30px rgba(232,93,42,0.24)' }}>
                <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 85% 0%, rgba(255,255,255,0.22), transparent 60%)' }} />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.92)' }}>
                    <Crown size={12} color={CORAL} strokeWidth={2.4} /><span className="text-[10.5px] font-extrabold" style={{ color: CORAL }}>RECOMMENDED</span>
                  </div>
                  <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 26, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>fylos Plus</div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-[34px] font-extrabold text-white leading-none tracking-[-0.02em]">CHF {price}</span>
                    <span className="text-[13px]" style={{ color: 'rgba(255,255,255,0.85)' }}>/ month</span>
                  </div>
                  {cycle === 'yearly' && <div className="text-[12px] mt-1.5" style={{ color: 'rgba(255,255,255,0.9)' }}>Billed yearly · save 19%</div>}
                </div>
              </div>

              {/* cycle toggle */}
              <div className="flex p-[3px] rounded-[12px] mt-4" style={{ background: '#EDE6DD' }}>
                {[{ id: 'monthly', label: 'Monthly' }, { id: 'yearly', label: 'Yearly · −19%' }].map((o) => {
                  const on = cycle === o.id;
                  return <button key={o.id} onClick={() => setCycle(o.id)} className="flex-1 h-[40px] rounded-[10px] text-[13.5px] font-bold transition-all" style={{ background: on ? '#fff' : 'transparent', color: on ? CORAL : MUTED, boxShadow: on ? '0 1px 3px rgba(60,30,15,0.12)' : 'none' }}>{o.label}</button>;
                })}
              </div>

              {/* perks */}
              <div className="rounded-[18px] bg-white overflow-hidden mt-5" style={{ boxShadow: SHADOW }}>
                {PERKS.map((p, i) => {
                  const Icon = p.icon;
                  return (
                    <div key={p.title} className="relative flex items-center gap-3 px-4 py-3.5">
                      <span className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: TINT }}><Icon size={16} color={CORAL} strokeWidth={2} /></span>
                      <div className="flex-1 min-w-0"><div className="text-[14px] font-semibold" style={{ color: INK }}>{p.title}</div><div className="text-[12px] mt-0.5" style={{ color: TERT }}>{p.sub}</div></div>
                      <Check size={17} color={GREEN} strokeWidth={2.4} className="shrink-0" />
                      {i < PERKS.length - 1 && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: LINE }} />}
                    </div>
                  );
                })}
              </div>

              <p className="text-[11.5px] text-center mt-4 leading-[1.45]" style={{ color: TERT }}>Cancel anytime. Renews automatically until cancelled.</p>
            </div>
            </div>

            {/* Sticky CTA */}
            <div className="absolute bottom-0 left-0 right-0 px-5 pt-3 pb-8" style={{ background: `linear-gradient(to top, ${CREAM} 72%, rgba(247,245,242,0))` }}>
              <button className="w-full py-4 rounded-[18px] active:scale-[0.98] transition-transform" style={{ background: CORAL, boxShadow: '0 8px 22px rgba(232,93,42,0.3)' }}>
                <span className="text-[15.5px] font-bold text-white">Start 7-day free trial</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubscriptionScreen;
