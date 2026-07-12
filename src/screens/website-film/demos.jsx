import React, { useEffect, useRef, useState } from 'react'
import { motion, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { PawPrint, Pill, Sparkles, Camera, Clock, Check, BadgeCheck, Syringe, UtensilsCrossed, MapPin } from 'lucide-react'
import { PHONE_EVENTS, WALK_STATS, EARNINGS } from './data'

const EVENT_ICONS = { bowl: UtensilsCrossed, pill: Pill, paw: PawPrint, sparkle: Sparkles }

/* ------------------------------------------------------------------ */
/* S3 · the phone whose day checks itself in                           */
/* ------------------------------------------------------------------ */
export function PhoneDemo({ progress, petName }) {
  const reduced = useReducedMotion()
  const [checked, setChecked] = useState(reduced ? PHONE_EVENTS.length : 0)

  useMotionValueEvent(progress, 'change', (v) => {
    if (reduced) return
    let n = 0
    PHONE_EVENTS.forEach((_, i) => {
      if (v > 0.3 + i * 0.13) n = i + 1
    })
    setChecked(n)
  })

  const allDone = checked >= PHONE_EVENTS.length

  return (
    <div className="w-[280px] sm:w-[310px] rounded-[26px] bg-[#FBF7F2] shadow-[0_24px_60px_-18px_rgba(120,72,40,0.45)] border border-[#F0E4D8] overflow-hidden" role="img" aria-label={`A day in Fylos for ${petName}: every task checks itself in`}>
      <div className="px-5 pt-5 pb-3 flex items-baseline justify-between">
        <div>
          <div className="film-mono text-[9px] text-[#C2451A]">Today</div>
          <div className="text-[17px] font-extrabold tracking-tight text-[#111]">{petName}&rsquo;s day</div>
        </div>
        <div className="w-9 h-9 rounded-full bg-[#FFE9DC] flex items-center justify-center">
          <PawPrint size={16} strokeWidth={2.4} className="text-[#E85D2A]" />
        </div>
      </div>
      <div className="px-4 pb-4 space-y-2">
        {PHONE_EVENTS.map((ev, i) => {
          const Icon = EVENT_ICONS[ev.icon] || PawPrint
          const done = i < checked
          return (
            <div key={ev.time} className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors duration-500 ${done ? 'bg-[#F2F6EE]' : 'bg-white'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${done ? 'bg-[#9DB18F]' : 'bg-[#FFE9DC]'}`}>
                {done
                  ? <Check size={15} strokeWidth={3} className="text-white" />
                  : <Icon size={14} strokeWidth={2.4} className="text-[#E85D2A]" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[13px] font-bold leading-tight transition-colors duration-500 ${done ? 'text-[#6F8465]' : 'text-[#111]'}`}>{ev.label}</div>
                <div className="text-[11px] text-[#111]/45 font-semibold">{ev.time}</div>
              </div>
            </div>
          )
        })}
      </div>
      <div className={`px-5 py-3 text-center film-mono text-[9px] transition-all duration-700 ${allDone ? 'bg-[#9DB18F] text-white' : 'bg-[#FFE9DC]/60 text-[#111]/40'}`}>
        {allDone ? 'All caught up' : `${checked} of ${PHONE_EVENTS.length} done`}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* S4 · the walk that draws itself                                     */
/* ------------------------------------------------------------------ */
const ROUTE_D = 'M 26 176 C 48 150, 42 118, 74 104 C 108 89, 128 122, 158 108 C 190 93, 182 60, 214 48 C 236 40, 252 46, 262 34'

export function WalkDemo({ progress }) {
  const reduced = useReducedMotion()
  const pathRef = useRef(null)
  const [km, setKm] = useState(reduced ? WALK_STATS.km : 0)
  const [dot, setDot] = useState(null)
  const draw = useTransform(progress, [0.22, 0.85], [0, 1], { clamp: true })

  useMotionValueEvent(draw, 'change', (v) => {
    if (reduced) return
    setKm(Math.round(v * WALK_STATS.km * 10) / 10)
    const path = pathRef.current
    if (path) {
      const len = path.getTotalLength()
      const p = path.getPointAtLength(len * v)
      setDot({ x: p.x, y: p.y })
    }
  })

  useEffect(() => {
    if (reduced && pathRef.current) {
      const path = pathRef.current
      const p = path.getPointAtLength(path.getTotalLength())
      setDot({ x: p.x, y: p.y })
    }
  }, [reduced])

  return (
    <div className="w-[290px] sm:w-[330px] rounded-[26px] bg-[#FBF7F2] shadow-[0_24px_60px_-18px_rgba(120,72,40,0.45)] border border-[#F0E4D8] overflow-hidden" role="img" aria-label={`A live walk in Fylos: the route draws itself up to ${WALK_STATS.km} kilometres`}>
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E85D2A] opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E85D2A]" />
          </span>
          <span className="film-mono text-[9px] text-[#C2451A]">Live walk</span>
        </div>
        <span className="text-[13px] font-extrabold text-[#111] tabular-nums">{km.toFixed(1)} km</span>
      </div>
      <div className="mx-4 rounded-2xl bg-[#EFF3EA] relative overflow-hidden" style={{ height: 190 }}>
        <svg viewBox="0 0 300 200" className="absolute inset-0 w-full h-full" aria-hidden="true">
          <circle cx="150" cy="120" r="26" fill="#DDE7D3" />
          <circle cx="150" cy="120" r="12" fill="#C9D8BA" />
          <circle cx="60" cy="52" r="16" fill="#DDE7D3" />
          <circle cx="244" cy="140" r="20" fill="#DDE7D3" />
          <path d={ROUTE_D} fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" opacity="0.85" />
          <motion.path
            ref={pathRef}
            d={ROUTE_D}
            fill="none"
            stroke="#E85D2A"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeDasharray="1 1"
            style={{ pathLength: reduced ? 1 : draw }}
          />
          <circle cx="26" cy="176" r="6" fill="#111" />
          <circle cx="26" cy="176" r="2.6" fill="#FBF7F2" />
          {dot && (
            <g transform={`translate(${dot.x} ${dot.y})`}>
              <circle r="9" fill="#E85D2A" opacity="0.25" />
              <circle r="5.5" fill="#E85D2A" stroke="#FBF7F2" strokeWidth="2" />
            </g>
          )}
        </svg>
      </div>
      <div className="px-4 py-3 flex gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE9DC] px-3 py-1.5 text-[11px] font-bold text-[#111]">
          <Clock size={12} strokeWidth={2.6} className="text-[#E85D2A]" /> {WALK_STATS.minutes} min
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFE9DC] px-3 py-1.5 text-[11px] font-bold text-[#111]">
          <Camera size={12} strokeWidth={2.6} className="text-[#E85D2A]" /> {WALK_STATS.photos} photos
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2F6EE] px-3 py-1.5 text-[11px] font-bold text-[#6F8465]">
          <BadgeCheck size={12} strokeWidth={2.6} /> Verified pro
        </span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* S5 · the record that stamps itself                                  */
/* ------------------------------------------------------------------ */
export function CareDemo({ progress, petName }) {
  const reduced = useReducedMotion()
  const [stamped, setStamped] = useState(!!reduced)

  useMotionValueEvent(progress, 'change', (v) => {
    if (reduced) return
    setStamped(v > 0.52)
  })

  return (
    <div className="w-[290px] sm:w-[330px] rounded-[26px] bg-[#FBF7F2] shadow-[0_24px_60px_-18px_rgba(120,72,40,0.45)] border border-[#F0E4D8] overflow-hidden relative" role="img" aria-label={`${petName}'s vaccination record in Fylos, stamped done three days early`}>
      <div className="px-5 pt-5 pb-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#FFE9DC] flex items-center justify-center">
          <Syringe size={15} strokeWidth={2.4} className="text-[#E85D2A]" />
        </div>
        <div>
          <div className="film-mono text-[9px] text-[#C2451A]">Health record</div>
          <div className="text-[16px] font-extrabold tracking-tight text-[#111]">Rabies booster</div>
        </div>
      </div>
      <div className="px-5 pb-5 space-y-3">
        <div className="rounded-2xl bg-white px-4 py-3">
          <div className="flex justify-between text-[12px] font-bold text-[#111]">
            <span>Due date</span><span>Oct 12</span>
          </div>
          <div className="flex justify-between text-[12px] font-semibold text-[#111]/45 mt-1">
            <span>Clinic</span><span>Dr. Ambrosi</span>
          </div>
          <div className="flex justify-between text-[12px] font-semibold text-[#111]/45 mt-1">
            <span>Patient</span><span>{petName}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {['2023', '2024', '2025'].map((y, i) => (
            <div key={y} className={`flex-1 rounded-xl px-2 py-2 text-center ${i < 2 || stamped ? 'bg-[#F2F6EE]' : 'bg-white'}`}>
              <div className={`text-[11px] font-extrabold ${i < 2 || stamped ? 'text-[#6F8465]' : 'text-[#111]/30'}`}>{y}</div>
              {(i < 2 || stamped) && <Check size={11} strokeWidth={3.4} className="mx-auto mt-0.5 text-[#9DB18F]" />}
            </div>
          ))}
        </div>
      </div>
      {stamped && (
        <div
          className="absolute right-4 top-16 px-3 py-2 border-[3px] border-[#E85D2A] rounded-lg text-[#C2451A] film-mono text-[10px] font-bold bg-[#FBF7F2]/70 backdrop-blur-[1px]"
          style={{ animation: reduced ? 'none' : 'film-stamp 0.5s cubic-bezier(0.22,1.4,0.36,1) both', transform: 'rotate(-9deg)' }}
        >
          Done · 3 days early
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* S5 · the honest earnings slider for pros                            */
/* ------------------------------------------------------------------ */
export function EarningsSlider() {
  const [walks, setWalks] = useState(12)
  const monthly = Math.round(walks * 4.33 * EARNINGS.netPerWalk)

  return (
    <div className="w-[290px] sm:w-[330px] rounded-[26px] bg-[#111] text-[#FBF7F2] shadow-[0_24px_60px_-18px_rgba(30,20,12,0.6)] overflow-hidden">
      <div className="px-5 pt-5 pb-1">
        <div className="film-mono text-[9px] text-[#C2451A]">For professionals</div>
        <div className="text-[16px] font-extrabold tracking-tight">Honest money, no riddles</div>
      </div>
      <div className="px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-[12px] font-semibold text-[#FBF7F2]/60">{walks} walks a week</span>
          <span className="text-[24px] font-extrabold tabular-nums">{EARNINGS.currency} {monthly}<span className="text-[12px] font-bold text-[#FBF7F2]/50"> /month</span></span>
        </div>
        <input
          type="range"
          min="2"
          max="15"
          value={walks}
          onChange={(e) => setWalks(Number(e.target.value))}
          aria-label="Walks per week"
          aria-valuetext={`${walks} walks a week, about ${EARNINGS.currency} ${monthly} per month net`}
          className="w-full mt-3 accent-[#E85D2A] cursor-pointer"
        />
        <p className="mt-3 text-[11px] leading-relaxed text-[#FBF7F2]/55 font-medium">
          {EARNINGS.currency} {EARNINGS.perWalk} per walk, about {EARNINGS.currency} {EARNINGS.netPerWalk} net after fees.
          Most Fylos pros keep {EARNINGS.currency} {EARNINGS.monthlyLow} to {EARNINGS.monthlyHigh} a month.
        </p>
      </div>
    </div>
  )
}
