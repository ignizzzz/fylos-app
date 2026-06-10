import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, TrendingUp, Ticket, Gift, RefreshCw, Receipt, Users, Scissors, Syringe } from 'lucide-react';

/**
 * 57_PAYMENT_WALLET_v1.jsx — Wallet (single combined screen).
 * Cards + fylos credits + billing + activity, all in one settings screen.
 * Canonical Settings style (sticky gradient-fade header, white back button,
 * peach-chip/coral-icon SetRows, MiniToggle). NOT a finance entity.
 */

const CREAM = '#F7F5F2';
const ICON_TINT = '#FBE7DD';
const ICON_COLOR = '#E85D2A';
const DIVIDER = '#F1EDE8';
const PEACH = '#F3EFEB';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#9B9B9F';
const GREEN = '#3F8D63';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';
const CARD_GRADIENT = 'linear-gradient(145deg,#F0703F 0%,#E85D2A 50%,#CF4A1C 100%)';

const CARDS = [
  { id: 'c1', brand: 'Visa', last: '4242', exp: '08/27', color: '#1A1F71', label: 'VISA' },
  { id: 'c2', brand: 'Mastercard', last: '8810', exp: '02/26', color: '#EB6C2D', label: 'MC' },
];
const TX = [
  { id: 't1', icon: Users, title: 'Invite bonus', sub: 'Maria joined · Today', amount: '+10.00', credit: true },
  { id: 't2', icon: Scissors, title: 'Grooming', sub: 'Sofia Lambrou · 2 days ago', amount: '−25.00', credit: false },
  { id: 't3', icon: Gift, title: 'Welcome credit', sub: 'Jun 1', amount: '+10.00', credit: true },
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

const SectionHead = ({ children, action, onAction }) => (
  <div className="flex items-center justify-between mb-2 ml-1.5 mr-0.5 mt-6">
    <span className="text-[10.5px] font-bold uppercase tracking-[0.12em]" style={{ color: '#A8A29C' }}>{children}</span>
    {action && <button onClick={onAction} className="text-[12px] font-bold" style={{ color: ICON_COLOR }}>{action}</button>}
  </div>
);
const Card = ({ children }) => <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>{children}</div>;

const SetRow = ({ icon: Icon, iconBrand, title, subtitle, rightValue, rightTone, trailing, onClick, last }) => (
  <div className="relative">
    <button onClick={onClick} className="w-full flex items-center gap-3 px-3.5 py-[11px] active:bg-black/[0.02] transition-colors text-left">
      {iconBrand ? (
        <div className="w-11 h-8 rounded-[7px] shrink-0 flex items-center justify-center" style={{ background: iconBrand.color }}><span className="text-[10px] font-extrabold italic text-white tracking-tight">{iconBrand.label}</span></div>
      ) : (
        <div className="w-9 h-9 rounded-[12px] shrink-0 flex items-center justify-center" style={{ backgroundColor: ICON_TINT }}><Icon size={16} color={ICON_COLOR} strokeWidth={2} /></div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold truncate leading-tight" style={{ color: INK }}>{title}</div>
        {subtitle && <div className="text-[11.5px] truncate mt-[3px] leading-tight" style={{ color: TERT }}>{subtitle}</div>}
      </div>
      {rightValue && <span className="text-[11px] font-bold mr-1 shrink-0 px-2 py-[3px] rounded-full" style={{ background: rightTone === 'good' ? '#EAF7EF' : '#F4EFE9', color: rightTone === 'good' ? GREEN : '#9A8F84' }}>{rightValue}</span>}
      {trailing ? trailing : <ChevronRight size={14} className="shrink-0" color="#D4D4D8" strokeWidth={2.2} />}
    </button>
    {!last && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: DIVIDER }} />}
  </div>
);

const MiniToggle = ({ value, onChange }) => (
  <div onClick={(e) => { e.stopPropagation(); onChange(!value); }} className="shrink-0 cursor-pointer" style={{ width: 38, height: 22, borderRadius: 9999, backgroundColor: value ? ICON_COLOR : '#E5E1DC', transition: 'background-color 200ms ease', position: 'relative' }}>
    <div style={{ position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transform: value ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
  </div>
);

// Rolling odometer: each digit is a vertical 0-9 strip translated to the target digit.
const ODO_STRIP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const OdoDigit = ({ digit }) => {
  const [pos, setPos] = useState(0);
  useEffect(() => {
    let r2;
    const r1 = requestAnimationFrame(() => { r2 = requestAnimationFrame(() => setPos(digit)); });
    return () => { cancelAnimationFrame(r1); if (r2) cancelAnimationFrame(r2); };
  }, [digit]);
  return (
    <span className="tabular-nums" style={{ display: 'inline-flex', overflow: 'hidden', height: '1em' }}>
      <span style={{ display: 'block', transform: `translateY(-${pos}em)`, transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1)', willChange: 'transform' }}>
        {ODO_STRIP.map((d) => <span key={d} style={{ display: 'block', height: '1em', lineHeight: 1 }}>{d}</span>)}
      </span>
    </span>
  );
};

const Odometer = ({ value }) => (
  <span className="text-[38px] font-extrabold text-white leading-none tracking-[-0.02em] tabular-nums" style={{ display: 'inline-flex', overflow: 'hidden', height: '1em' }}>
    {String(value).split('').map((ch, i) => (
      /\d/.test(ch)
        ? <OdoDigit key={`d${i}`} digit={Number(ch)} />
        : <span key={`s${i}`} style={{ display: 'block', height: '1em', lineHeight: 1 }}>{ch}</span>
    ))}
  </span>
);

const PaymentWalletScreen = () => {
  const [defaultId, setDefaultId] = useState('c1');
  const [autopay, setAutopay] = useState(true);
  // signature moment: the wallet catches an incoming transaction.
  // 0ms balance shows 20.00, 900ms a reward chip drops into the card,
  // it lands at 1380ms (900 + 480) so the odometer rolls to 30.00 and the card pulses,
  // then the chip fades away.
  const [bal, setBal] = useState(20);
  const [chip, setChip] = useState('waiting'); // waiting | drop | gone
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const timers = [
      setTimeout(() => setChip('drop'), 900),
      setTimeout(() => { setBal(30); setPulse(true); }, 1380),
      setTimeout(() => setChip('gone'), 1560),
      setTimeout(() => setPulse(false), 1640),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Nunito:wght@700;800&display=swap');`}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          <StatusBar />

          <div className="absolute inset-0 overflow-y-auto" style={{ background: CREAM, scrollbarWidth: 'none' }}>
            <div className="pt-14 pb-5 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 56%, rgba(247,245,242,0) 100%)' }}>
              <button onClick={back} className="absolute left-5 top-[52px] w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-all pointer-events-auto" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}><ChevronLeft size={18} strokeWidth={2.2} color="#111" /></button>
              <h1 className="text-[17px] font-bold" style={{ color: INK }}>Wallet</h1>
            </div>

            <div className="px-4 pb-12">
              {/* Credits hero card */}
              <div className="relative" style={{ marginTop: 2, overflow: 'visible' }}>
                <div className="absolute left-4 right-4 rounded-[20px]" style={{ height: 30, bottom: -10, background: '#D9501F', opacity: 0.45 }} />
                <div className="absolute left-2 right-2 rounded-[20px]" style={{ height: 30, bottom: -5, background: '#E0571F', opacity: 0.7 }} />
                <div className="relative rounded-[20px] overflow-hidden p-5" style={{ background: CARD_GRADIENT, boxShadow: '0 14px 34px rgba(232,93,42,0.3)', height: 178, transform: pulse ? 'scale(1.015)' : 'scale(1)', transition: 'transform 260ms cubic-bezier(0.22,1,0.36,1)' }}>
                  <div className="absolute inset-0" style={{ background: 'radial-gradient(130% 90% at 88% -10%, rgba(255,255,255,0.28), transparent 55%)' }} />
                  <div className="relative h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <div style={{ fontFamily: '"Nunito", sans-serif', fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1 }}>fylos<span style={{ color: '#FFD9C8' }}>•</span></div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] mt-1.5" style={{ color: 'rgba(255,255,255,0.7)' }}>Credits</div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.16)' }}><TrendingUp size={12} color="#fff" strokeWidth={2.4} /><span className="text-[10.5px] font-bold text-white">+10 this month</span></span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1.5"><span className="text-[14px] font-bold" style={{ color: 'rgba(255,255,255,0.85)' }}>CHF</span><Odometer value={bal.toFixed(2)} /></div>
                      <div className="text-[11.5px] mt-1.5" style={{ color: 'rgba(255,255,255,0.78)' }}>Available toward any booking</div>
                    </div>
                  </div>
                </div>
                {/* Incoming transaction chip that drops into the card */}
                <div className="absolute z-10 pointer-events-none" style={{
                  top: -18,
                  left: '50%',
                  opacity: chip === 'drop' ? 1 : 0,
                  transform: chip === 'waiting' ? 'translate(-50%, 0) scale(1)' : chip === 'drop' ? 'translate(-50%, 58px) scale(1)' : 'translate(-50%, 58px) scale(0.6)',
                  transition: chip === 'gone' ? 'transform 220ms cubic-bezier(0.22,1,0.36,1), opacity 220ms cubic-bezier(0.22,1,0.36,1)' : 'transform 480ms cubic-bezier(0.34,1.56,0.64,1), opacity 200ms ease',
                }}>
                  <div className="bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5 whitespace-nowrap" style={{ boxShadow: SHADOW }}>
                    <span className="text-[12px] font-bold" style={{ color: INK }}>Referral reward</span>
                    <span className="text-[12px] font-bold" style={{ color: GREEN }}>+ CHF 10.00</span>
                  </div>
                </div>
              </div>

              {/* Your cards */}
              <SectionHead>Your cards</SectionHead>
              <Card>
                {CARDS.map((c, i) => (
                  <SetRow key={c.id} iconBrand={c} title={`${c.brand} •••• ${c.last}`} subtitle={`Expires ${c.exp}`}
                    rightValue={defaultId === c.id ? 'Default' : undefined} rightTone="good"
                    trailing={defaultId === c.id ? <span className="w-5 shrink-0" /> : <span className="text-[12px] font-semibold shrink-0" style={{ color: TERT }}>Set default</span>}
                    onClick={() => setDefaultId(c.id)} last={i === CARDS.length - 1} />
                ))}
              </Card>
              <button className="w-full mt-2.5 py-3 rounded-[16px] flex items-center justify-center gap-2 active:scale-[0.99] transition-transform" style={{ border: '1.5px dashed #D6CDC2' }}>
                <Plus size={15} color={ICON_COLOR} strokeWidth={2.4} /><span className="text-[13.5px] font-semibold" style={{ color: INK }}>Add card</span>
              </button>

              {/* Credits */}
              <SectionHead>Credits</SectionHead>
              <Card>
                <SetRow icon={Ticket} title="Redeem a code" subtitle="Add a promo or gift code" />
                <SetRow icon={Gift} title="Refer & earn" subtitle="You both get CHF 10" rightValue="+10" rightTone="good" last />
              </Card>

              {/* Activity */}
              <SectionHead action="See all">Activity</SectionHead>
              <Card>
                {TX.map((x, i) => {
                  const Icon = x.icon;
                  return (
                    <div key={x.id} className="relative flex items-center gap-3 px-3.5 py-3">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: x.credit ? '#EAF7EF' : PEACH }}><Icon size={15} color={x.credit ? GREEN : MUTED} strokeWidth={2} /></span>
                      <div className="flex-1 min-w-0"><div className="text-[13.5px] font-semibold truncate" style={{ color: INK }}>{x.title}</div><div className="text-[11.5px] mt-0.5 truncate" style={{ color: TERT }}>{x.sub}</div></div>
                      <span className="text-[14px] font-bold tabular-nums shrink-0" style={{ color: x.credit ? GREEN : INK }}>{x.amount}</span>
                      {i < TX.length - 1 && <div className="absolute bottom-0 left-[60px] right-0 h-px" style={{ background: DIVIDER }} />}
                    </div>
                  );
                })}
              </Card>

              {/* Billing */}
              <SectionHead>Billing</SectionHead>
              <Card>
                <SetRow icon={RefreshCw} title="Auto-pay" subtitle="Charge default card on booking" trailing={<MiniToggle value={autopay} onChange={setAutopay} />} />
                <SetRow icon={Receipt} title="Billing history" subtitle="Receipts & past charges" last />
              </Card>

              <p className="text-[11px] leading-[1.45] text-center mt-6 px-6" style={{ color: TERT }}>Cards are charged securely by our partners (Stripe & Link). fylos never holds your card details. Credits are a reward balance, not redeemable for cash.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentWalletScreen;
