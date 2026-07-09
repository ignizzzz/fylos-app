import React, { useState } from 'react';
import {
  PawPrint, ChevronRight, ChevronLeft, Clock, Sparkles, Lock, Gift,
  Calendar, TrendingUp, Users, Star, Crown, Zap, Share2, ShieldCheck,
  Scissors, Footprints, Home, Stethoscope, AlertTriangle, Check, Timer,
} from 'lucide-react';

/**
 * 98_PAW_CARD_v1.jsx — "The Paw Card" rewards system mockup (v3 spec).
 * Four views in one phone frame, switched by pills above the device:
 *   1. Home widget   — the single source-of-truth tile on the dashboard
 *   2. The Paw Card  — full card screen: seasonal art, stamps, ink fade,
 *                      Golden Paw slot, sealed prize, level chip
 *   3. The Shelf     — collection: sealed cards, foil, ghost + Paw Levels
 *   4. Pro Track     — pro dashboard: level, Evaluation Day countdown,
 *                      at-risk save target, rank vs peers, perks ladder
 * Spec source: ~/Project-Fylos/FYLOS_MEMBERSHIP_GROWTH_PLAN.md (v3).
 * Playful-premium per direction doc v1.1 (§12 de-quieting): countdowns,
 * scarcity, collections, levels — warmth and honesty unchanged. No emoji.
 */

const CORAL = '#E85D2A';
const CORAL_DARK = '#B85A26';
const CREAM = '#F7F5F2';
const PEACH = '#F3EFEB';
const TINT = '#FBE7DD';
const INK = '#111111';
const MUTED = '#6E6058';
const TERT = '#9B9B9F';
const GREEN = '#3F8D63';
const GREEN_SOFT = '#EEF6F0';
const AMBER = '#B07A3A';
const GOLD = '#C9962E';
const LINE = '#F1EDE8';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';
const FONT = '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';

/* ─────────────────────────── Small shared pieces ─────────────────────────── */

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

/** One paw slot: stamped (coral ink, jittered like a real stamp), golden ring, or empty. */
const PawSlot = ({ stamped, golden, size = 46, jitter = 0, faded = false }) => (
  <div
    className="flex items-center justify-center rounded-full"
    style={{
      width: size, height: size,
      background: stamped ? (golden ? 'linear-gradient(135deg,#F7E7C3,#EFD9A0)' : TINT) : '#FFFFFF',
      border: golden && !stamped ? `2px dashed ${GOLD}` : stamped ? 'none' : `2px dashed #DDD4C9`,
      boxShadow: stamped ? 'inset 0 1px 3px rgba(60,30,15,0.12)' : 'none',
    }}
  >
    {stamped ? (
      <PawPrint
        size={size * 0.52}
        strokeWidth={0}
        fill={golden ? GOLD : CORAL}
        style={{ transform: `rotate(${jitter}deg)`, opacity: faded ? 0.35 : 0.92, filter: faded ? 'grayscale(1)' : 'none' }}
      />
    ) : golden ? (
      <Sparkles size={size * 0.38} color={GOLD} strokeWidth={2} />
    ) : (
      <PawPrint size={size * 0.44} strokeWidth={1.6} color="#D6CDC2" />
    )}
  </div>
);

/** Level chip — "Lv 7 · True Friend". */
const LevelChip = ({ compact = false }) => (
  <span className="inline-flex items-center rounded-full" style={{ gap: 5, background: '#FFF', border: `1px solid ${LINE}`, boxShadow: SHADOW, padding: compact ? '4px 10px' : '6px 12px' }}>
    <span className="flex items-center justify-center rounded-full" style={{ width: 18, height: 18, background: CORAL }}>
      <PawPrint size={10} strokeWidth={0} fill="#FFF" />
    </span>
    <span style={{ fontSize: compact ? 12 : 13, fontWeight: 800, color: INK }}>Lv 7</span>
    {!compact && <span style={{ fontSize: 12, fontWeight: 600, color: MUTED }}>· True Friend</span>}
  </span>
);

/** Seasonal watercolor wash — pure CSS, High Summer palette on warm paper. */
const seasonWash = {
  background: [
    'radial-gradient(120% 90% at 85% -10%, rgba(255,190,140,0.55), rgba(255,190,140,0) 60%)',
    'radial-gradient(90% 70% at -10% 30%, rgba(232,93,42,0.16), rgba(232,93,42,0) 55%)',
    'radial-gradient(100% 80% at 60% 110%, rgba(255,214,170,0.5), rgba(255,214,170,0) 60%)',
    'linear-gradient(160deg, #FFF9F2 0%, #FDEFE2 55%, #FBE7DD 100%)',
  ].join(','),
};

/* ─────────────────────────── View 1 — Home widget ─────────────────────────── */

const HomeWidgetView = () => (
  <div className="h-full overflow-y-auto px-5" style={{ paddingTop: 64, paddingBottom: 32, background: CREAM }}>
    {/* Header row (dashboard context) */}
    <div className="flex justify-between items-center mb-1">
      <span className="flex items-center" style={{ gap: 4 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: INK, letterSpacing: '-0.5px' }}>FYLOS</span>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: CORAL }} />
      </span>
      <div className="flex items-center gap-2">
        <span className="w-[38px] h-[38px] flex items-center justify-center rounded-full" style={{ background: '#FFEBEA' }}><AlertTriangle size={15} color="#E5484D" strokeWidth={2} /></span>
        <span className="w-[38px] h-[38px] flex items-center justify-center rounded-full text-white" style={{ background: CORAL, fontSize: 14, fontWeight: 800 }}>A</span>
      </div>
    </div>
    <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.2, color: TERT, marginBottom: 18 }}>WED · 8 JUL</div>

    {/* ── THE widget ── */}
    <div className="relative rounded-[22px] overflow-hidden" style={{ ...seasonWash, boxShadow: SHADOW, border: '1px solid rgba(60,30,15,0.05)' }}>
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: CORAL_DARK }}>HIGH SUMMER CARD</span>
          <LevelChip compact />
        </div>
        {/* 5 slots */}
        <div className="flex items-center justify-between" style={{ maxWidth: 300 }}>
          <PawSlot stamped jitter={-8} />
          <PawSlot stamped jitter={5} />
          <PawSlot stamped jitter={-3} />
          <PawSlot golden />
          <PawSlot />
        </div>
        {/* one timer line */}
        <div className="flex items-center mt-4" style={{ gap: 6 }}>
          <Timer size={13} color={CORAL} strokeWidth={2.2} />
          <span style={{ fontSize: 13, fontWeight: 700, color: CORAL }}>Ink fades in 19 days</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span style={{ fontSize: 13.5, fontWeight: 600, color: MUTED }}>Two paws from a prize.</span>
          <span className="flex items-center rounded-full text-white" style={{ gap: 5, background: CORAL, padding: '8px 14px', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 14px rgba(232,93,42,0.25)' }}>
            Book anything <ChevronRight size={14} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>

    {/* Double Paw takeover state (shown as second example) */}
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: TERT, margin: '22px 0 8px' }}>SAME WIDGET · DOUBLE PAW WEEKEND LIVE</div>
    <div className="relative rounded-[22px] overflow-hidden" style={{ ...seasonWash, boxShadow: SHADOW, border: `1.5px solid ${CORAL}` }}>
      <div className="px-5 pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1.4, color: CORAL_DARK }}>HIGH SUMMER CARD</span>
          <LevelChip compact />
        </div>
        <div className="flex items-center justify-between" style={{ maxWidth: 300 }}>
          <PawSlot stamped jitter={-8} /><PawSlot stamped jitter={5} /><PawSlot stamped jitter={-3} /><PawSlot golden /><PawSlot />
        </div>
        <div className="flex items-center mt-4" style={{ gap: 6 }}>
          <Zap size={13} color="#FFF" strokeWidth={2.4} style={{ background: CORAL, borderRadius: 99, padding: 2, width: 17, height: 17 }} />
          <span style={{ fontSize: 13, fontWeight: 800, color: CORAL }}>Double Paws until Sunday night</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span style={{ fontSize: 13.5, fontWeight: 600, color: MUTED }}>Anything you book counts twice.</span>
          <span className="flex items-center rounded-full text-white" style={{ gap: 5, background: CORAL, padding: '8px 14px', fontSize: 13, fontWeight: 700, boxShadow: '0 4px 14px rgba(232,93,42,0.25)' }}>
            Book now <ChevronRight size={14} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </div>

    {/* Booking-confirm scarcity line (evergreen) */}
    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.2, color: TERT, margin: '22px 0 8px' }}>ON BOOKING CONFIRM</div>
    <div className="rounded-[18px] bg-white px-4 py-3.5" style={{ boxShadow: SHADOW }}>
      <div className="flex items-center" style={{ gap: 10 }}>
        <span className="w-[38px] h-[38px] flex items-center justify-center rounded-[12px]" style={{ background: TINT }}><PawPrint size={17} color={CORAL} strokeWidth={0} fill={CORAL} /></span>
        <div className="flex-1">
          <div style={{ fontSize: 14, fontWeight: 700, color: INK }}>This one stamps Milo's card — 2 to go.</div>
          <div style={{ fontSize: 12.5, color: TERT, marginTop: 1 }}>And Maria has 2 slots left this week.</div>
        </div>
      </div>
    </div>
  </div>
);

/* ─────────────────────────── View 2 — The Paw Card ─────────────────────────── */

const PawCardView = () => (
  <div className="h-full overflow-y-auto px-5" style={{ paddingTop: 64, paddingBottom: 32, background: CREAM }}>
    {/* header */}
    <div className="flex items-center justify-between mb-4">
      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white" style={{ boxShadow: SHADOW }}><ChevronLeft size={20} color={INK} /></span>
      <span style={{ fontSize: 17, fontWeight: 700, color: INK }}>Paw Card</span>
      <LevelChip compact />
    </div>

    {/* The card itself */}
    <div className="relative rounded-[26px] overflow-hidden" style={{ ...seasonWash, boxShadow: '0 8px 30px rgba(60,30,15,0.10)', border: '1px solid rgba(60,30,15,0.06)' }}>
      {/* season art strip */}
      <div className="relative px-6 pt-6 pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 2, color: CORAL_DARK }}>SEASON III · JUL – SEP</div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.8px', color: INK, marginTop: 2 }}>High Summer</div>
          </div>
          {/* sun mark — simple line illustration, no emoji */}
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <circle cx="22" cy="22" r="9" stroke={CORAL} strokeWidth="2" fill="rgba(232,93,42,0.12)" />
            {[...Array(8)].map((_, i) => {
              const a = (i * Math.PI) / 4;
              return <line key={i} x1={22 + Math.cos(a) * 13} y1={22 + Math.sin(a) * 13} x2={22 + Math.cos(a) * 17} y2={22 + Math.sin(a) * 17} stroke={CORAL} strokeWidth="2" strokeLinecap="round" />;
            })}
          </svg>
        </div>
        <div style={{ fontSize: 13, color: MUTED, marginTop: 6, maxWidth: 250 }}>Earnable only this season. After Sep 30 this art is gone for good.</div>
      </div>

      {/* slots row */}
      <div className="px-6 pt-4 pb-2 flex items-center justify-between">
        <PawSlot stamped size={52} jitter={-8} />
        <PawSlot stamped size={52} jitter={6} />
        <PawSlot stamped size={52} jitter={-2} />
        <PawSlot golden size={52} />
        <PawSlot size={52} />
      </div>
      <div className="px-6 flex justify-between" style={{ fontSize: 10.5, color: TERT, fontWeight: 600 }}>
        <span style={{ width: 52, textAlign: 'center' }}>Walk</span>
        <span style={{ width: 52, textAlign: 'center' }}>Walk</span>
        <span style={{ width: 52, textAlign: 'center' }}>Sitting</span>
        <span style={{ width: 52, textAlign: 'center', color: GOLD, fontWeight: 800 }}>Golden</span>
        <span style={{ width: 52, textAlign: 'center' }}>—</span>
      </div>

      {/* ink fade meter */}
      <div className="px-6 pt-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center" style={{ gap: 5 }}>
            <Timer size={13} color={CORAL} strokeWidth={2.2} />
            <span style={{ fontSize: 13, fontWeight: 800, color: CORAL }}>Ink fades in 19 days</span>
          </span>
          <span style={{ fontSize: 11.5, color: TERT, fontWeight: 600 }}>started Jun 28</span>
        </div>
        <div className="rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(60,30,15,0.07)' }}>
          <div className="h-full rounded-full" style={{ width: '68%', background: `linear-gradient(90deg, ${CORAL}, ${CORAL} 70%, rgba(232,93,42,0.35))` }} />
        </div>
      </div>

      {/* sealed prize — visible from paw #3 */}
      <div className="mx-5 mt-4 mb-5 rounded-[18px] bg-white/80 px-4 py-3.5 flex items-center" style={{ gap: 12, backdropFilter: 'blur(4px)', border: '1px solid rgba(60,30,15,0.06)' }}>
        <div className="relative flex items-center justify-center rounded-full" style={{ width: 44, height: 44, background: TINT }}>
          <Gift size={20} color={CORAL} strokeWidth={2} />
          {/* wax seal dot */}
          <span className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full" style={{ width: 18, height: 18, background: CORAL_DARK, boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }}>
            <Lock size={9} color="#FFF" strokeWidth={2.5} />
          </span>
        </div>
        <div className="flex-1">
          <div style={{ fontSize: 14, fontWeight: 800, color: INK }}>Your prize is sealed</div>
          <div style={{ fontSize: 12.5, color: MUTED, marginTop: 1 }}>Two more paws and you pick: the High Summer collectible, Skip the Line, or fee on us.</div>
        </div>
      </div>
    </div>

    {/* Golden paw explainer (appears only while live) */}
    <div className="mt-4 rounded-[18px] px-4 py-3.5 flex items-center" style={{ gap: 12, background: 'linear-gradient(135deg,#FBF3DF,#F7E7C3)', border: `1px solid ${GOLD}33`, boxShadow: SHADOW }}>
      <span className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, background: '#FFF' }}><Sparkles size={17} color={GOLD} strokeWidth={2} /></span>
      <div className="flex-1">
        <div style={{ fontSize: 13.5, fontWeight: 800, color: '#7A5A16' }}>A golden paw is waiting</div>
        <div style={{ fontSize: 12.5, color: '#8B6B24', marginTop: 1 }}>First grooming of the season turns this card rare — foil finish, for the Shelf.</div>
      </div>
      <span className="rounded-full" style={{ fontSize: 12, fontWeight: 800, color: '#7A5A16', background: '#FFF', padding: '7px 12px' }}>Book grooming</span>
    </div>

    {/* level line */}
    <div className="mt-4 rounded-[18px] bg-white px-4 py-3.5 flex items-center justify-between" style={{ boxShadow: SHADOW }}>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: MUTED }}>Seal this card and <span style={{ color: INK, fontWeight: 800 }}>Level 8</span> is yours for keeps.</span>
      <ChevronRight size={16} color={TERT} />
    </div>
  </div>
);

/* ─────────────────────────── View 3 — The Shelf ─────────────────────────── */

const MiniCard = ({ title, sub, kind }) => {
  const isGhost = kind === 'ghost';
  const isFoil = kind === 'foil';
  return (
    <div
      className="rounded-[16px] overflow-hidden relative"
      style={{
        height: 118,
        ...(!isGhost ? seasonWash : {}),
        background: isGhost ? '#ECE8E3' : undefined,
        border: isFoil ? `2px solid ${GOLD}` : '1px solid rgba(60,30,15,0.06)',
        boxShadow: isGhost ? 'none' : SHADOW,
        filter: isGhost ? 'grayscale(1)' : 'none',
        opacity: isGhost ? 0.75 : 1,
      }}
    >
      {isFoil && (
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,232,170,0.55) 45%, rgba(255,255,255,0) 60%)' }} />
      )}
      <div className="px-3 pt-3">
        <div style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 1.2, color: isGhost ? '#9B948C' : CORAL_DARK }}>{title.toUpperCase()}</div>
        <div style={{ fontSize: 10.5, color: isGhost ? '#9B948C' : MUTED, marginTop: 1 }}>{sub}</div>
      </div>
      <div className="absolute bottom-2.5 left-3 right-3 flex justify-between">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="flex items-center justify-center rounded-full" style={{ width: 17, height: 17, background: isGhost ? '#DDD8D1' : 'rgba(255,255,255,0.75)' }}>
            <PawPrint size={9} strokeWidth={0} fill={isGhost ? '#B4ADA3' : (i === 3 && isFoil ? GOLD : CORAL)} style={{ opacity: isGhost && i > 2 ? 0.25 : 0.9 }} />
          </span>
        ))}
      </div>
      {isFoil && <Crown size={13} color={GOLD} className="absolute top-2.5 right-2.5" strokeWidth={2.2} />}
      {isGhost && <div className="absolute top-2.5 right-2.5" style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.8, color: '#9B948C' }}>FADED</div>}
    </div>
  );
};

const ShelfView = () => (
  <div className="h-full overflow-y-auto px-5" style={{ paddingTop: 64, paddingBottom: 32, background: CREAM }}>
    <div className="flex items-center justify-between mb-2">
      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white" style={{ boxShadow: SHADOW }}><ChevronLeft size={20} color={INK} /></span>
      <span style={{ fontSize: 17, fontWeight: 700, color: INK }}>Milo's Shelf</span>
      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white" style={{ boxShadow: SHADOW }}><Share2 size={17} color={INK} strokeWidth={2} /></span>
    </div>

    {/* Level hero */}
    <div className="rounded-[22px] bg-white px-5 py-4 mb-4 flex items-center" style={{ gap: 14, boxShadow: SHADOW }}>
      <div className="relative flex items-center justify-center rounded-full" style={{ width: 58, height: 58, background: `conic-gradient(${CORAL} 0deg 252deg, ${LINE} 252deg 360deg)` }}>
        <div className="flex items-center justify-center rounded-full bg-white" style={{ width: 48, height: 48 }}>
          <span style={{ fontSize: 17, fontWeight: 800, color: INK }}>7</span>
        </div>
      </div>
      <div className="flex-1">
        <div style={{ fontSize: 16, fontWeight: 800, color: INK }}>Level 7 · True Friend</div>
        <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>7 sealed cards. Levels never drop — 3 more to <span style={{ fontWeight: 800, color: GOLD }}>Gold Paw</span>.</div>
      </div>
    </div>

    {/* Season progress note */}
    <div className="flex items-center justify-between mb-3">
      <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: TERT }}>THE COLLECTION</span>
      <span className="flex items-center" style={{ gap: 4, fontSize: 12, fontWeight: 700, color: CORAL }}>
        <Clock size={12} strokeWidth={2.4} /> High Summer ends Sep 30
      </span>
    </div>

    {/* Cards grid */}
    <div className="grid grid-cols-2 gap-3">
      <MiniCard title="High Summer" sub="In progress · 3 of 5" kind="live" />
      <MiniCard title="Lakeside Spring" sub="Sealed · foil" kind="foil" />
      <MiniCard title="Lakeside Spring" sub="Sealed · Apr 18" kind="plain" />
      <MiniCard title="First Snow" sub="Faded · Feb 12" kind="ghost" />
      <MiniCard title="First Snow" sub="Sealed · Jan 30" kind="plain" />
      <MiniCard title="Alpine Autumn" sub="Sealed · Nov 3" kind="plain" />
    </div>

    {/* milestone ladder strip */}
    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: TERT, margin: '18px 0 8px' }}>THE ROAD AHEAD</div>
    <div className="rounded-[18px] bg-white px-4 py-4" style={{ boxShadow: SHADOW }}>
      {[
        { lv: 'Lv 5', name: 'True Friend', done: true },
        { lv: 'Lv 10', name: 'Gold Paw — gold ink, for life', done: false, next: true },
        { lv: 'Lv 20', name: 'Fylos Legend', done: false },
      ].map((m, i) => (
        <div key={i} className="flex items-center" style={{ gap: 10, padding: '7px 0' }}>
          <span className="flex items-center justify-center rounded-full" style={{ width: 24, height: 24, background: m.done ? CORAL : m.next ? TINT : PEACH }}>
            {m.done ? <Check size={13} color="#FFF" strokeWidth={3} /> : <PawPrint size={12} strokeWidth={0} fill={m.next ? CORAL : '#C9C2B9'} />}
          </span>
          <span style={{ fontSize: 13.5, fontWeight: m.next ? 800 : 600, color: m.done ? TERT : INK, textDecoration: m.done ? 'line-through' : 'none' }}>{m.lv} · {m.name}</span>
        </div>
      ))}
    </div>
  </div>
);

/* ─────────────────────────── View 4 — Pro Track ─────────────────────────── */

const ProTrackView = () => (
  <div className="h-full overflow-y-auto px-5" style={{ paddingTop: 64, paddingBottom: 32, background: CREAM }}>
    <div className="flex items-center justify-between mb-4">
      <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white" style={{ boxShadow: SHADOW }}><ChevronLeft size={20} color={INK} /></span>
      <span style={{ fontSize: 17, fontWeight: 700, color: INK }}>Your Pro level</span>
      <span style={{ width: 40 }} />
    </div>

    {/* Level card */}
    <div className="rounded-[22px] px-5 py-5 mb-4" style={{ background: '#FFF', boxShadow: SHADOW, border: `1px solid ${LINE}` }}>
      <div className="flex items-center" style={{ gap: 14 }}>
        <span className="flex items-center justify-center rounded-[16px]" style={{ width: 54, height: 54, background: TINT }}>
          <ShieldCheck size={26} color={CORAL} strokeWidth={2} />
        </span>
        <div className="flex-1">
          <div className="flex items-center" style={{ gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: INK }}>Trusted Pro</span>
            <span className="rounded-full" style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, color: CORAL_DARK, background: TINT, padding: '3px 8px' }}>FOUNDING PRO</span>
          </div>
          <div style={{ fontSize: 12.5, color: MUTED, marginTop: 2 }}>Sitter · Zürich · since March</div>
        </div>
      </div>
      {/* rank vs peers */}
      <div className="mt-4 rounded-[14px] px-4 py-3 flex items-center justify-between" style={{ background: PEACH }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: INK }}>You are <span style={{ color: CORAL }}>#4 of 31</span> sitters in Zürich</span>
        <TrendingUp size={15} color={GREEN} strokeWidth={2.4} />
      </div>
    </div>

    {/* Evaluation day countdown + at-risk save target */}
    <div className="rounded-[18px] px-4 py-4 mb-4" style={{ background: '#FFF6EF', border: `1.5px solid ${CORAL}44`, boxShadow: SHADOW }}>
      <div className="flex items-center justify-between">
        <span className="flex items-center" style={{ gap: 7 }}>
          <Calendar size={15} color={CORAL} strokeWidth={2.2} />
          <span style={{ fontSize: 13.5, fontWeight: 800, color: CORAL_DARK }}>Evaluation Day · Aug 1</span>
        </span>
        <span className="rounded-full text-white" style={{ fontSize: 12, fontWeight: 800, background: CORAL, padding: '4px 10px' }}>9 days</span>
      </div>
      <div style={{ fontSize: 13.5, color: INK, fontWeight: 600, marginTop: 8, lineHeight: 1.45 }}>
        2 more completed bookings by Aug 1 keep your Trusted badge.
      </div>
      <div className="mt-2.5 rounded-full overflow-hidden" style={{ height: 6, background: 'rgba(60,30,15,0.08)' }}>
        <div className="h-full rounded-full" style={{ width: '75%', background: CORAL }} />
      </div>
      <div className="flex justify-between mt-1.5" style={{ fontSize: 11.5, color: MUTED, fontWeight: 600 }}>
        <span>6 of 8 this cycle</span>
        <span>Badge Hold available · 1 left this year</span>
      </div>
    </div>

    {/* Ladder */}
    <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1.4, color: TERT, margin: '0 0 8px' }}>THE TRACK</div>
    <div className="rounded-[18px] bg-white overflow-hidden mb-4" style={{ boxShadow: SHADOW }}>
      {[
        { name: 'Rising Pro', perk: 'Badge + your stats panel', icon: Star, state: 'done' },
        { name: 'Trusted Pro', perk: '30-min early access to new requests', icon: ShieldCheck, state: 'now' },
        { name: 'Top Pro', perk: '60-min early access · weekly Spotlight · Pro Council', icon: Crown, state: 'locked', lock: 'Top 10% per canton — 12 more bookings & 4.8 rating' },
      ].map((l, i) => (
        <div key={i} className="flex items-center px-4" style={{ gap: 12, padding: '13px 16px', borderBottom: i < 2 ? `1px solid ${LINE}` : 'none', background: l.state === 'now' ? '#FFFBF8' : '#FFF' }}>
          <span className="flex items-center justify-center rounded-[12px]" style={{ width: 40, height: 40, background: l.state === 'locked' ? PEACH : TINT }}>
            <l.icon size={18} color={l.state === 'locked' ? TERT : CORAL} strokeWidth={2} />
          </span>
          <div className="flex-1">
            <div className="flex items-center" style={{ gap: 7 }}>
              <span style={{ fontSize: 14.5, fontWeight: 800, color: l.state === 'locked' ? MUTED : INK }}>{l.name}</span>
              {l.state === 'now' && <span className="rounded-full text-white" style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: 0.5, background: CORAL, padding: '2px 7px' }}>YOU</span>}
            </div>
            <div style={{ fontSize: 12, color: l.state === 'locked' ? TERT : MUTED, marginTop: 1 }}>{l.perk}</div>
            {l.lock && <div className="flex items-center" style={{ gap: 4, fontSize: 11.5, color: CORAL_DARK, fontWeight: 700, marginTop: 3 }}><Lock size={10.5} strokeWidth={2.4} /> {l.lock}</div>}
          </div>
          {l.state === 'done' && <Check size={16} color={GREEN} strokeWidth={2.6} />}
        </div>
      ))}
    </div>

    {/* Early-access envy (what lower tiers see) + Pro report */}
    <div className="rounded-[18px] bg-white px-4 py-3.5 mb-3 flex items-center" style={{ gap: 12, boxShadow: SHADOW }}>
      <span className="flex items-center justify-center rounded-[12px]" style={{ width: 40, height: 40, background: GREEN_SOFT }}><Zap size={17} color={GREEN} strokeWidth={2.2} /></span>
      <div className="flex-1">
        <div style={{ fontSize: 13.5, fontWeight: 700, color: INK }}>New sitting request · Seefeld</div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>You saw this <span style={{ fontWeight: 800, color: GREEN }}>30 minutes early</span> — Trusted perk.</div>
      </div>
      <ChevronRight size={15} color={TERT} />
    </div>
    <div className="rounded-[18px] px-4 py-3.5 flex items-center" style={{ gap: 12, ...seasonWash, boxShadow: SHADOW }}>
      <span className="flex items-center justify-center rounded-[12px] bg-white" style={{ width: 40, height: 40 }}><Share2 size={16} color={CORAL} strokeWidth={2.2} /></span>
      <div className="flex-1">
        <div style={{ fontSize: 13.5, fontWeight: 800, color: INK }}>Your July Pro Report is ready</div>
        <div style={{ fontSize: 12, color: MUTED, marginTop: 1 }}>19 bookings · 4.9 rating · 38% book again. Share it.</div>
      </div>
      <span className="rounded-full text-white" style={{ fontSize: 12, fontWeight: 800, background: CORAL, padding: '7px 12px' }}>Share</span>
    </div>
  </div>
);

/* ─────────────────────────── Shell ─────────────────────────── */

const VIEWS = [
  { id: 'widget', label: 'Home widget', icon: Home, component: HomeWidgetView },
  { id: 'card', label: 'The Paw Card', icon: PawPrint, component: PawCardView },
  { id: 'shelf', label: 'Shelf & Levels', icon: Star, component: ShelfView },
  { id: 'pro', label: 'Pro Track', icon: ShieldCheck, component: ProTrackView },
];

export default function PawCardMockup() {
  const [view, setView] = useState('card');
  const Active = VIEWS.find((v) => v.id === view).component;
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-8" style={{ background: '#EDE9E3', fontFamily: FONT }}>
      {/* view switcher */}
      <div className="flex items-center mb-5 rounded-full bg-white p-1" style={{ gap: 2, boxShadow: SHADOW }}>
        {VIEWS.map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className="flex items-center rounded-full transition-all"
            style={{
              gap: 6, padding: '9px 16px', fontSize: 13, fontWeight: 700, fontFamily: FONT,
              background: view === v.id ? CORAL : 'transparent',
              color: view === v.id ? '#FFF' : MUTED,
              border: 'none', cursor: 'pointer',
            }}
          >
            <v.icon size={14} strokeWidth={2.2} />
            {v.label}
          </button>
        ))}
      </div>

      {/* phone frame */}
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        <StatusBar />
        <Active />
      </div>

      <div className="mt-4" style={{ fontSize: 12, color: '#8B8478', fontWeight: 600 }}>
        98_PAW_CARD_v1 · rewards v3 mockup · spec: FYLOS_MEMBERSHIP_GROWTH_PLAN.md
      </div>
    </div>
  );
}
