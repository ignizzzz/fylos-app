import React, { useState } from 'react';
import {
  ChevronLeft,
  Gift,
  Copy,
  Check,
  Share2,
  QrCode,
  PawPrint,
  Trophy,
  Wallet,
} from 'lucide-react';

/**
 * 60_INVITE_FRIENDS_v1.jsx
 * Referral screen for the owner — the "Invite a friend, get 10 CHF" row
 * on the dashboard opens this.
 *
 * Contains: value prop, the owner's personal code + share link (copyable),
 * a share button + quick channels, a QR code for in-person sharing,
 * a "how it works" explainer, and a tracker of invited / joined / earned.
 *
 * `embedded` renders it as an overlay filling the dashboard frame (no
 * route change); `onExit` closes it.
 */

const CORAL = '#E85D2A';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const INK = '#111111';
const MUTED = '#6E6058';
const GREEN = '#3F8D63';

// Mock referral data — wired to the backend in production.
const REFERRAL = {
  code: 'ALEX-10',
  link: 'fylos.me/j/alex10',
  rewardEach: 10,
  currency: 'CHF',
  stats: { invited: 7, joined: 3, earned: 30 },
  invites: [
    { name: 'Maria K.', initial: 'M', status: 'earned', when: '2 weeks ago' },
    { name: 'Tom B.', initial: 'T', status: 'joined', when: '5 days ago' },
    { name: 'Sara L.', initial: 'S', status: 'pending', when: '3 days ago' },
  ],
};

const STATUS_META = {
  earned: { label: 'Earned 10 CHF', bg: '#EEF7F1', fg: GREEN, ring: GREEN },
  joined: { label: 'Booking pending', bg: '#FFEDE3', fg: CORAL, ring: CORAL },
  pending: { label: 'Invite sent', bg: PEACH, fg: '#A09A94', ring: '#D8D0C6' },
};

// Tiered bonus — a goal to keep the user inviting. When `current`
// friends have joined, the next bonus unlocks at `target`.
const MILESTONE = { current: 3, target: 5, bonus: 25 };

// ─── Status bar ─────────────────────────────────────────────────────
const StatusBar = ({ light }) => {
  const c = light ? '#FFFFFF' : INK;
  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: c }}>9:41</span>
      <div className="flex items-center gap-1">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={c}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={c}/><rect x="9" y="2" width="3" height="10" rx="1" fill={c}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={c}/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={c}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={c} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={c} strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="9" rx="2" fill={c}/><path d="M23 4.5v4a2 2 0 000-4z" fill={c} fillOpacity="0.5"/></svg>
      </div>
    </div>
  );
};

// ─── QR mock — finder patterns + deterministic module field, with a
//     small coral paw badge in the centre. Not a real scannable code. ──
const QrMock = ({ size = 168 }) => {
  const N = 21;
  const inFinder = (x, y) => (x < 7 && y < 7) || (x >= N - 7 && y < 7) || (x < 7 && y >= N - 7);
  const finderOn = (x, y) => {
    const ring = (fx, fy) => {
      const lx = x - fx, ly = y - fy;
      const border = lx === 0 || lx === 6 || ly === 0 || ly === 6;
      const center = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
      return border || center;
    };
    if (x < 7 && y < 7) return ring(0, 0);
    if (x >= N - 7 && y < 7) return ring(N - 7, 0);
    if (x < 7 && y >= N - 7) return ring(0, N - 7);
    return false;
  };
  const rects = [];
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      // Carve out the centre for the paw badge
      if (x >= 8 && x <= 12 && y >= 8 && y <= 12) continue;
      const on = inFinder(x, y) ? finderOn(x, y) : ((x * 7 + y * 13 + x * y) % 3 === 0);
      if (on) rects.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" rx="0.28" fill="#111" />);
    }
  }
  return (
    <div className="rounded-[18px] p-3.5 inline-block" style={{ background: '#FFFFFF', boxShadow: '0 4px 16px rgba(60,30,15,0.08), inset 0 0 0 1px #EDE8E2' }}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 21 21" width={size} height={size} shapeRendering="crispEdges">{rects}</svg>
        {/* Centre paw badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[10px] flex items-center justify-center" style={{ width: size * 0.26, height: size * 0.26, background: CORAL, boxShadow: '0 2px 8px rgba(232,93,42,0.3)' }}>
          <PawPrint size={size * 0.14} color="#FFFFFF" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════
const InviteFriends = ({ embedded = false, onExit }) => {
  const [copied, setCopied] = useState(null); // 'code' | 'link' | null
  const [qrOpen, setQrOpen] = useState(false);

  const exit = () => { if (onExit) { onExit(); return; } window.history.back(); };

  const copy = (text, which) => {
    try { navigator.clipboard?.writeText(text); } catch { /* noop */ }
    setCopied(which);
    setTimeout(() => setCopied((c) => (c === which ? null : c)), 1600);
  };

  const share = () => {
    const payload = {
      title: 'Join me on fylos',
      text: `Join me on fylos and we both get ${REFERRAL.rewardEach} ${REFERRAL.currency}. Use my code ${REFERRAL.code}.`,
      url: `https://${REFERRAL.link}`,
    };
    try { if (navigator.share) { navigator.share(payload); return; } } catch { /* noop */ }
    copy(payload.url, 'link');
  };


  const content = (
    <>
      {!embedded && <StatusBar />}

      {/* Canonical app header — gradient fade, no solid fill. Content
          scrolls behind and softly dissolves into the cream gradient.
          pointer-events-none on the wrapper so scrolling passes through;
          only the back button is interactive. */}
      <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-4 px-5 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/95 to-transparent">
        <div className="relative flex items-center justify-center pointer-events-auto">
          <button onClick={exit} className="absolute left-0 w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-transform" style={{ background: PEACH }} aria-label="Back">
            <ChevronLeft size={18} color={INK} strokeWidth={2.2} />
          </button>
          <h1 className="text-[17px] font-bold text-[#111]">Invite friends</h1>
        </div>
      </header>

      {/* Scroll body — starts at the very top and pads down past the
          header so its content can scroll up and fade into the gradient. */}
      <div className="absolute left-0 right-0 overflow-y-auto" style={{ top: 0, bottom: 0, paddingTop: 96, scrollbarWidth: 'none' }}>
        {/* Hero — compact, clean, on cream */}
        <div className="px-6 pt-2 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3.5" style={{ background: '#FFEDE3' }}>
            <Gift size={25} color={CORAL} strokeWidth={1.9} />
          </div>
          <h2 className="text-[25px] font-extrabold text-[#111] tracking-[-0.02em] leading-[1.1]">
            You both get <span className="text-[#E85D2A]">10 CHF</span>
          </h2>
          <p className="text-[13px] text-[#6E6058] mt-2 leading-[1.5] max-w-[260px] mx-auto">
            Friends join, book their first service, and you each earn credit.
          </p>
        </div>

        <div className="px-5 pb-10 flex flex-col gap-3.5">
          {/* Voucher code — premium ticket. Coral-tinted top half carries
              the code; perforation; white bottom half carries the link. */}
          <div className="relative rounded-[18px] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}>
            {/* Top — coral-tinted, the code */}
            <div className="px-5 pt-4 pb-4 text-center" style={{ background: '#FFF4ED' }}>
              <div className="inline-flex items-center gap-1.5 mb-2">
                <Gift size={11} color={CORAL} strokeWidth={2.4} />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B85A26]">Your invite code</span>
              </div>
              <div className="text-[31px] font-extrabold text-[#111] tracking-[0.12em] leading-none" style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>{REFERRAL.code}</div>
              <button onClick={() => copy(REFERRAL.code, 'code')} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full mt-3.5 active:scale-[0.96] transition-transform" style={{ background: copied === 'code' ? '#EEF7F1' : '#FFFFFF', boxShadow: copied === 'code' ? 'none' : 'inset 0 0 0 1px #F0DDD0' }}>
                {copied === 'code' ? <Check size={14} className="text-[#3F8D63]" strokeWidth={2.6} /> : <Copy size={14} className="text-[#E85D2A]" strokeWidth={2} />}
                <span className="text-[12.5px] font-bold" style={{ color: copied === 'code' ? GREEN : CORAL }}>{copied === 'code' ? 'Copied' : 'Copy code'}</span>
              </button>
            </div>
            {/* Perforation line with side notches */}
            <div className="relative h-0 z-10">
              <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 border-t border-dashed" style={{ borderColor: '#E8D7CB' }} />
              <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: CREAM, boxShadow: 'inset -1px 0 0 #EDE8E2' }} />
              <span className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ background: CREAM, boxShadow: 'inset 1px 0 0 #EDE8E2' }} />
            </div>
            {/* Bottom — the link */}
            <button onClick={() => copy(`https://${REFERRAL.link}`, 'link')} className="w-full flex items-center justify-between gap-3 px-5 py-3 active:bg-[#FAF6F0] transition-colors">
              <span className="text-[13px] text-[#6E6058] truncate">{REFERRAL.link}</span>
              <span className="flex items-center gap-1.5 shrink-0">
                {copied === 'link' ? <Check size={13} className="text-[#3F8D63]" strokeWidth={2.6} /> : <Copy size={13} className="text-[#A09A94]" strokeWidth={2} />}
                <span className="text-[12px] font-semibold" style={{ color: copied === 'link' ? GREEN : MUTED }}>{copied === 'link' ? 'Copied' : 'Copy link'}</span>
              </span>
            </button>
          </div>

          {/* Share button */}
          <button onClick={share} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[16px] active:scale-[0.98] transition-transform" style={{ background: CORAL, boxShadow: '0 4px 16px rgba(232,93,42,0.26)' }}>
            <Share2 size={17} color="#FFFFFF" strokeWidth={2.2} />
            <span className="text-[15px] font-bold text-white">Share invite</span>
          </button>

          {/* Secondary actions — the two things the native share sheet
              doesn't do well: copy link, and a QR for in-person. */}
          <div className="grid grid-cols-2 gap-2.5 -mt-1">
            <button onClick={() => copy(`https://${REFERRAL.link}`, 'link')} className="flex items-center justify-center gap-2 py-2.5 rounded-[14px] active:scale-[0.97] transition-transform" style={{ background: PEACH }}>
              {copied === 'link' ? <Check size={15} className="text-[#3F8D63]" strokeWidth={2.4} /> : <Copy size={15} className="text-[#111]" strokeWidth={1.9} />}
              <span className="text-[12.5px] font-semibold" style={{ color: copied === 'link' ? GREEN : INK }}>{copied === 'link' ? 'Copied' : 'Copy link'}</span>
            </button>
            <button onClick={() => setQrOpen((v) => !v)} className="flex items-center justify-center gap-2 py-2.5 rounded-[14px] active:scale-[0.97] transition-transform" style={{ background: qrOpen ? '#FFEDE3' : PEACH, boxShadow: qrOpen ? `inset 0 0 0 1.5px ${CORAL}` : 'none' }}>
              <QrCode size={15} color={qrOpen ? CORAL : '#111'} strokeWidth={1.9} />
              <span className="text-[12.5px] font-semibold" style={{ color: qrOpen ? CORAL : INK }}>QR code</span>
            </button>
          </div>

          {/* QR (collapsible) */}
          {qrOpen && (
            <div className="flex flex-col items-center py-3" style={{ animation: 'invFade 0.28s cubic-bezier(0.22,1,0.36,1) both' }}>
              <QrMock />
              <p className="text-[12px] text-[#A09A94] mt-3 text-center max-w-[240px] leading-[1.45]">Let a friend scan this in person. It opens fylos with your code applied.</p>
            </div>
          )}

          {/* How it works — minimal 3-step strip with a connecting line */}
          <div className="relative flex items-start justify-between pt-1">
            {/* connector behind the numbered circles */}
            <div className="absolute top-5 left-[17%] right-[17%] border-t border-dashed" style={{ borderColor: '#E0D8CF' }} />
            {[
              { n: 1, label: 'Share' },
              { n: 2, label: 'They book' },
              { n: 3, label: 'You earn' },
            ].map((s) => (
              <div key={s.n} className="relative flex flex-col items-center gap-1.5 flex-1">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold" style={{ background: '#FFEDE3', color: CORAL, boxShadow: `0 0 0 4px ${CREAM}` }}>{s.n}</span>
                <span className="text-[11.5px] font-semibold text-[#3A3530]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Progress — milestone + stats in one clean card */}
          <div className="rounded-[18px] p-4 mt-1" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}>
            {(() => {
              const pct = Math.min(1, MILESTONE.current / MILESTONE.target);
              const left = Math.max(0, MILESTONE.target - MILESTONE.current);
              return (
                <>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#FFEDE3' }}>
                      <Trophy size={15} color={CORAL} strokeWidth={2} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold text-[#111] leading-tight">
                        {left > 0 ? `${left} more to unlock +${MILESTONE.bonus} CHF` : `Bonus unlocked! +${MILESTONE.bonus} CHF`}
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#A09A94] tabular-nums shrink-0">{MILESTONE.current}/{MILESTONE.target}</span>
                  </div>
                  <div className="relative h-[6px] rounded-full overflow-hidden" style={{ background: '#EDE8E2' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct * 100}%`, background: CORAL }} />
                  </div>
                </>
              );
            })()}

            <div className="h-px my-3.5" style={{ background: '#F0EAE2' }} />

            <div className="flex items-center">
              {[
                { k: 'Invited', v: `${REFERRAL.stats.invited}` },
                { k: 'Joined', v: `${REFERRAL.stats.joined}` },
                { k: 'Earned', v: `${REFERRAL.stats.earned} CHF`, accent: true },
              ].map((s, i) => (
                <div key={s.k} className="flex-1 text-center" style={{ borderLeft: i ? '1px solid #F0EAE2' : 'none' }}>
                  <div className="text-[17px] font-extrabold tabular-nums leading-none" style={{ color: s.accent ? CORAL : INK }}>{s.v}</div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#A09A94] mt-1">{s.k}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent invites — clean list */}
          <div className="mt-1">
            <div className="flex items-center justify-between mb-2.5 px-0.5">
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A09A94]">Recent invites</h3>
              <button className="flex items-center gap-1 active:opacity-70 transition-opacity">
                <Wallet size={12} className="text-[#E85D2A]" strokeWidth={2.2} />
                <span className="text-[11.5px] font-semibold text-[#E85D2A]">Wallet</span>
              </button>
            </div>
            <div className="rounded-[16px] divide-y divide-[#F0EAE2] overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #EDE8E2' }}>
              {REFERRAL.invites.map((inv) => {
                const meta = STATUS_META[inv.status];
                return (
                  <div key={inv.name} className="flex items-center gap-3 px-4 py-3">
                    <span className="relative w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold text-[#6E6058] shrink-0" style={{ background: PEACH }}>
                      {inv.initial}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full" style={{ background: meta.ring, border: '2px solid #FFFFFF' }} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-[#111]">{inv.name}</div>
                      <div className="text-[11px] text-[#A09A94]">{inv.when}</div>
                    </div>
                    <span className="text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0" style={{ background: meta.bg, color: meta.fg }}>{meta.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Terms — one quiet line */}
          <p className="text-[11px] leading-[1.5] text-[#A09A94] text-center px-4 mt-1">
            Credit applies after your friend's first booking. <span className="font-semibold text-[#E85D2A]">Terms apply.</span>
          </p>
        </div>
      </div>
    </>
  );

  const styleBlock = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
      @keyframes invFade { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  );

  if (embedded) {
    return (
      <>
        {styleBlock}
        <div className="absolute inset-0 z-[150] overflow-hidden" style={{ background: CREAM, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>{content}</div>
      </>
    );
  }

  return (
    <>
      {styleBlock}
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          {content}
        </div>
      </div>
    </>
  );
};

export default InviteFriends;
