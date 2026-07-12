import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent } from 'framer-motion'
import { ArrowRight, ArrowDown, Check, Copy, Bell, FileText, Activity, MapPin, Shield, Heart } from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────
//  FYLOS — Website v2: «FYLOS presents» as ONE CONTINUOUS FILM
//  Founder direction 2026-07-12: no gaps between scenes. The whole page
//  is a single pinned cinema frame; the five scenes cross-dissolve into
//  each other, the coral ball travels through the entire journey, and
//  the startup content floats OVER the footage as parallax overlays.
//  Post-credits (waitlist, FAQ, footer) come only after FIN.
//  Scene media: /public/film/scene-0X.{jpg,mp4} — placeholders until then.
// ─────────────────────────────────────────────────────────────────────

const CREAM = '#FBF7F2'
const PEACH = '#FFE9DC'
const PEACH_DEEP = '#FFD4BD'
const CORAL = '#E85D2A'
const CORAL_LIGHT = '#FF7240'
const INK = '#131316'
const MUTED = '#6E6E73'

const SERIF = "'Instrument Serif', Georgia, serif"
const MONO = "'JetBrains Mono', ui-monospace, monospace"
const LOGO = "'Nunito', Inter, sans-serif"

const DEFAULT_STAR = 'a Very Good Friend'

// Film timeline: one global progress p ∈ [0,1] over a 1300vh journey.
const SEG = [
  { id: 'scene-01', chapter: 'A Fylos film', caption: null, start: 0.0, end: 0.2 },
  { id: 'scene-02', chapter: 'Chapter one', caption: 'Their life is scattered everywhere.', start: 0.2, end: 0.38 },
  { id: 'scene-03', chapter: 'Chapter two', caption: 'The walk is sacred. Protect it.', start: 0.38, end: 0.58 },
  { id: 'scene-04', chapter: 'Chapter three', caption: 'The check-up, without the paper chase.', start: 0.58, end: 0.76 },
  { id: 'scene-05', chapter: 'Chapter four', caption: 'The quiet hours are worth remembering.', start: 0.76, end: 1.0 },
]
const FADE = 0.025

export default function WebsiteFilmV2() {
  const [petName, setPetName] = useState('')

  useEffect(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('pet')
      const saved = window.localStorage.getItem('fylos.film.pet')
      if (fromUrl) setPetName(fromUrl.slice(0, 24))
      else if (saved) setPetName(saved)
    } catch (e) { /* private mode */ }
  }, [])

  useEffect(() => {
    try { window.localStorage.setItem('fylos.film.pet', petName) } catch (e) { /* ignore */ }
  }, [petName])

  const star = petName.trim() || DEFAULT_STAR
  const named = Boolean(petName.trim())

  return (
    <div className="fylos-film" style={{ backgroundColor: INK, color: INK, fontFamily: 'Inter, -apple-system, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <GlobalStyles />
      <Nav />
      <Film petName={petName} setPetName={setPetName} star={star} named={named} />
      <Waitlist star={star} named={named} />
      <Faq />
      <Footer />
    </div>
  )
}

function GlobalStyles() {
  return (
    <style>{`
      @keyframes fylosCredits { from { transform: translateY(0); } to { transform: translateY(-50%); } }
      @media (prefers-reduced-motion: reduce) {
        .fylos-credits-roll { animation: none !important; }
      }
      @supports (height: 100svh) { .fylos-scene-frame { height: 100svh !important; } }
      .fylos-film input::placeholder { color: #9B9B9F; }
      .fylos-film input:focus-visible, .fylos-film button:focus-visible, .fylos-film a:focus-visible {
        outline: 2px solid #E85D2A; outline-offset: 2px; border-radius: 6px;
      }
    `}</style>
  )
}

function Nav() {
  const links = [['The film', '#film'], ['Early access', '#waitlist'], ['FAQ', '#faq']]
  return (
    <div className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl" style={{ backgroundColor: 'rgba(251,247,242,0.9)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-5 md:px-10 py-3">
        <a href="#film" className="text-[18px] font-extrabold tracking-wide" style={{ fontFamily: LOGO, color: INK }}>
          FYLOS<span style={{ color: CORAL }}>.</span>
        </a>
        <div className="hidden md:flex items-center gap-7">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="text-[13.5px] font-medium hover:opacity-70 transition-opacity" style={{ color: MUTED }}>{label}</a>
          ))}
        </div>
        <a href="#waitlist" className="text-[13.5px] font-semibold text-white rounded-full px-4 py-2 hover:opacity-90 transition-opacity" style={{ backgroundColor: CORAL }}>
          Get early access
        </a>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
//  The film: one pinned frame, five cross-dissolving scenes,
//  parallax overlays, and the travelling coral ball.
// ────────────────────────────────────────────
function Film({ petName, setPetName, star, named }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  const [activeIdx, setActiveIdx] = useState(0)
  useMotionValueEvent(p, 'change', v => {
    let idx = SEG.findIndex(s => v >= s.start && v < s.end)
    if (idx === -1) idx = SEG.length - 1
    if (idx !== activeIdx) setActiveIdx(idx)
  })

  // Hero titles: visible at the very top, gone by the first transition.
  const titleOpacity = useSpring(useTransform(p, [0, 0.1, 0.16], [1, 1, 0]), { stiffness: 160, damping: 34 })
  const titleEvents = useTransform(titleOpacity, v => (v < 0.05 ? 'none' : 'auto'))

  // The travelling coral ball — the continuity thread of the whole film.
  const T = [0, 0.17, 0.21, 0.35, 0.39, 0.55, 0.59, 0.73, 0.77, 0.87, 0.92]
  const ballX = useTransform(p, T, ['62%', '62%', '46%', '46%', '52%', '52%', '72%', '72%', '42%', '42%', '50%'])
  const ballY = useTransform(p, T, ['76%', '76%', '84%', '84%', '64%', '64%', '78%', '78%', '80%', '80%', '46%'])
  const ballOpacity = useTransform(p, [0.88, 0.93], [1, 0])

  // FIN: darken the last scene and roll credits inside the film.
  const finOpacity = useSpring(useTransform(p, [0.86, 0.91, 1], [0, 1, 1]), { stiffness: 160, damping: 34 })
  const finEvents = useTransform(finOpacity, v => (v < 0.5 ? 'none' : 'auto'))
  const dimOpacity = useSpring(useTransform(p, [0.84, 0.93], [0, 0.62]), { stiffness: 160, damping: 34 })

  const seg = SEG[activeIdx]

  return (
    <section id="film" ref={ref} className="relative" style={{ height: '1300vh' }}>
      <div className="fylos-scene-frame sticky top-0 h-screen overflow-hidden" style={{ backgroundColor: INK }}>

        {/* scene stack — every layer cross-dissolves into the next, no cuts */}
        {SEG.map((s, i) => (
          <SceneLayer key={s.id} seg={s} index={i} p={p} active={i === activeIdx} reduce={reduce} />
        ))}

        {/* gentle scrim for overlay legibility */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15, background: 'radial-gradient(ellipse at center, transparent 52%, rgba(19,19,22,0.26) 100%)' }} />

        {/* the travelling ball */}
        {!reduce && (
          <motion.div className="absolute z-20 pointer-events-none" style={{ left: ballX, top: ballY, opacity: ballOpacity, x: '-50%', y: '-50%' }}>
            <div className="rounded-full" style={{ width: 22, height: 22, background: `radial-gradient(circle at 35% 30%, ${CORAL_LIGHT}, ${CORAL})`, boxShadow: '0 8px 20px -6px rgba(180,73,31,0.6)' }} />
          </motion.div>
        )}

        {/* letterbox — never breaks for the whole journey */}
        <div className="absolute top-0 inset-x-0 z-30 h-[72px] md:h-[84px] flex items-end justify-center pb-2.5 pointer-events-none" style={{ backgroundColor: INK }}>
          <motion.span key={`ch-${activeIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                       className="text-[10px] md:text-[11px] uppercase tracking-[0.28em]" style={{ fontFamily: MONO, color: 'rgba(251,247,242,0.65)' }}>
            {seg.chapter}
          </motion.span>
        </div>
        <div className="absolute bottom-0 inset-x-0 z-30 h-10 md:h-14 flex items-center justify-center pointer-events-none" style={{ backgroundColor: INK }}>
          <motion.span key={`cap-${activeIdx}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
                       className="italic text-[14px] md:text-[17px] px-6 text-center" style={{ fontFamily: SERIF, color: CREAM }}>
            {activeIdx === 0 ? (
              <span className="not-italic flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]" style={{ fontFamily: MONO, color: 'rgba(251,247,242,0.6)' }}>
                <ArrowDown size={11} /> Scroll to roll the film
              </span>
            ) : seg.caption}
          </motion.span>
        </div>

        {/* opening titles + pet name */}
        <motion.div style={{ opacity: titleOpacity, pointerEvents: titleEvents }} className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 58% 46% at 50% 44%, rgba(19,19,22,0.5), rgba(19,19,22,0.12) 62%, transparent 78%)' }} />
          <span className="relative text-[11px] md:text-[12px] uppercase tracking-[0.34em] mb-4" style={{ fontFamily: MONO, color: 'rgba(255,255,255,0.92)' }}>
            Fylos presents
          </span>
          <h1 className="relative italic leading-[1.08] mb-7" style={{ fontFamily: SERIF, fontSize: 'clamp(38px, 7vw, 84px)', color: '#FFFFFF', textShadow: '0 2px 24px rgba(19,19,22,0.5)', textWrap: 'balance' }}>
            The Story of<br />{star}
          </h1>
          <label className="relative flex items-center gap-2 rounded-full pl-4 pr-2 py-2" style={{ backgroundColor: 'rgba(251,247,242,0.94)', boxShadow: '0 10px 40px -12px rgba(19,19,22,0.4)' }}>
            <span className="text-[13px]" style={{ color: MUTED }}>Or better, the story of</span>
            <input
              value={petName}
              onChange={e => setPetName(e.target.value.slice(0, 24))}
              placeholder="your pet's name"
              aria-label="Your pet's name"
              className="bg-transparent outline-none text-[14px] font-semibold w-[130px]"
              style={{ color: INK }}
            />
          </label>
          <p className="relative mt-3 text-[11.5px]" style={{ color: 'rgba(255,255,255,0.88)' }}>
            The whole film rewrites itself for them.
          </p>
        </motion.div>

        {/* parallax story overlays — content lives INSIDE the film */}
        <Overlay p={p} range={[0.22, 0.36]} side="left">
          <OverlayCard kicker="The problem" title="Vaccines in a drawer. Photos in three apps. Advice in your head.">
            Everything you know about them lives in places that forget. Fylos is the second brain for pet parents: one calm home for their health, documents and days.
          </OverlayCard>
        </Overlay>
        <Overlay p={p} range={[0.27, 0.37]} side="right" speed={1.4}>
          <MiniList items={[[Bell, 'Health records & reminders'], [Activity, 'Weight & wellbeing'], [FileText, 'Document vault']]} />
        </Overlay>

        <Overlay p={p} range={[0.4, 0.5]} side="left">
          <OverlayCard kicker="The walk" title={`Trusted hands, on the days you can't be there.`}>
            Book vetted walkers and sitters nearby, with live GPS on every walk. Playdate matching. A community safety map that flags hazards before they find you.
          </OverlayCard>
        </Overlay>
        <Overlay p={p} range={[0.46, 0.56]} side="right" speed={1.3}>
          <ProCard />
        </Overlay>

        <Overlay p={p} range={[0.6, 0.7]} side="right">
          <OverlayCard kicker="The check-up" title="Never again “I’ll check and call you back.”">
            The vet asks, you answer. Vaccine schedules with gentle reminders, an emergency card that works offline, telehealth for the 2 a.m. worries.
          </OverlayCard>
        </Overlay>
        <Overlay p={p} range={[0.65, 0.75]} side="left" speed={1.4}>
          <MiniList items={[[Bell, 'Rabies booster · scheduled'], [Activity, '12.4 kg · steady'], [FileText, 'Lab results · shared with your vet']]} plain />
        </Overlay>

        <Overlay p={p} range={[0.78, 0.86]} side="left">
          <OverlayCard kicker="The quiet hours" title={`${named ? star : 'They'} won’t remember the reminders. Only the days.`}>
            The journal keeps the small notes and the good photos, so fifteen years from now, every one of them counted.
          </OverlayCard>
        </Overlay>

        {/* FIN — inside the film, over the darkening night scene */}
        <motion.div className="absolute inset-0 z-20 pointer-events-none" style={{ backgroundColor: INK, opacity: dimOpacity }} />
        <motion.div style={{ opacity: finOpacity, pointerEvents: finEvents }} className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center">
          <span className="text-[11px] uppercase tracking-[0.3em] mb-5" style={{ fontFamily: MONO, color: 'rgba(251,247,242,0.55)' }}>Fin</span>
          <h2 className="italic mb-10" style={{ fontFamily: SERIF, fontSize: 'clamp(34px, 5.5vw, 60px)', color: CREAM }}>
            Stress less. Fylos more<span style={{ color: CORAL_LIGHT }}>.</span>
          </h2>
          <Credits star={star} named={named} />
          <a href="#waitlist" className="mt-10 inline-flex items-center gap-2 text-[14.5px] font-semibold text-white rounded-full px-6 py-3" style={{ backgroundColor: CORAL }}>
            Get early access <ArrowDown size={15} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}

// One scene layer: cross-dissolves at its boundaries, dollies while active.
function SceneLayer({ seg, index, p, active, reduce }) {
  const first = index === 0
  const last = index === SEG.length - 1
  // WAAPI offsets must stay inside [0,1] and be strictly increasing.
  const inputs = first
    ? [0, seg.end - FADE, seg.end + FADE]
    : last
      ? [seg.start - FADE, seg.start + FADE, 1]
      : [seg.start - FADE, seg.start + FADE, seg.end - FADE, seg.end + FADE]
  const outputs = first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]
  const opacity = useSpring(useTransform(p, inputs, outputs), { stiffness: 170, damping: 34 })
  const scale = useSpring(useTransform(p, [seg.start, seg.end], reduce ? [1, 1] : [1.12, 1.0]), { stiffness: 120, damping: 30 })
  return (
    <motion.div className="absolute inset-0" style={{ opacity, scale, zIndex: 10 - index }}>
      <SceneMedia id={seg.id} active={active} reduce={reduce} placeholder={PLACEHOLDERS[seg.id]} />
    </motion.div>
  )
}

const PLACEHOLDERS = {
  'scene-01': <PlaceholderLivingRoom />,
  'scene-02': <PlaceholderHallway />,
  'scene-03': <PlaceholderPark />,
  'scene-04': <PlaceholderVet />,
  'scene-05': <PlaceholderNight />,
}

function SceneMedia({ id, placeholder, active, reduce }) {
  const [ok, setOk] = useState(true)
  const videoRef = useRef(null)

  // Only the active layer plays; others pause. preload=none keeps the
  // five loops from downloading together on first paint.
  useEffect(() => {
    const el = videoRef.current
    if (!el || reduce || !ok) return
    if (active) el.play().catch(() => {})
    else el.pause()
  }, [active, reduce, ok])

  if (!ok) {
    return (
      <div className="absolute inset-0">
        {placeholder}
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full"
             style={{ backgroundColor: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(4px)' }}>
          <span className="text-[10px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: '#7a6a5c' }}>
            {id} · final film frame drops in here
          </span>
        </div>
      </div>
    )
  }
  if (reduce) {
    return <img className="absolute inset-0 w-full h-full object-cover" src={`/film/${id}.jpg`} alt="" onError={() => setOk(false)} />
  }
  return (
    <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover"
           src={`/film/${id}.mp4`} poster={`/film/${id}.jpg`}
           muted loop playsInline preload="none" onError={() => setOk(false)} />
  )
}

// ────────────────────────────────────────────
//  Parallax overlays
// ────────────────────────────────────────────
function Overlay({ p, range: [a, b], side, speed = 1, children }) {
  const opacity = useSpring(useTransform(p, [a, a + 0.02, b - 0.02, b], [0, 1, 1, 0]), { stiffness: 170, damping: 34 })
  const y = useSpring(useTransform(p, [a, b], [60 * speed, -60 * speed]), { stiffness: 120, damping: 30 })
  const events = useTransform(opacity, v => (v < 0.2 ? 'none' : 'auto'))
  return (
    <motion.div
      className={`absolute z-20 w-[86%] sm:w-[420px] ${side === 'left' ? 'left-5 md:left-14' : 'right-5 md:right-14'}`}
      style={{ top: '24%', opacity, y, pointerEvents: events }}>
      {children}
    </motion.div>
  )
}

function OverlayCard({ kicker, title, children }) {
  return (
    <div className="rounded-[20px] p-6 md:p-7" style={{ backgroundColor: 'rgba(251,247,242,0.94)', backdropFilter: 'blur(8px)', boxShadow: '0 24px 60px -24px rgba(19,19,22,0.5)' }}>
      <span className="block text-[10.5px] uppercase tracking-[0.2em] mb-2.5" style={{ fontFamily: MONO, color: CORAL }}>{kicker}</span>
      <h3 className="italic mb-3 leading-snug" style={{ fontFamily: SERIF, fontSize: 'clamp(21px, 2.6vw, 27px)', color: INK, textWrap: 'balance' }}>{title}</h3>
      <p className="text-[13.5px] leading-relaxed" style={{ color: MUTED }}>{children}</p>
    </div>
  )
}

function MiniList({ items, plain }) {
  return (
    <div className="rounded-[18px] p-4 space-y-2.5" style={{ backgroundColor: 'rgba(251,247,242,0.94)', backdropFilter: 'blur(8px)', boxShadow: '0 24px 60px -24px rgba(19,19,22,0.5)' }}>
      {items.map(([Icon, text]) => (
        <div key={text} className="flex items-center gap-3 rounded-xl px-3.5 py-2.5" style={{ backgroundColor: '#FFFFFF' }}>
          <span className="w-8 h-8 rounded-full flex items-center justify-center flex-none" style={{ backgroundColor: PEACH }}>
            <Icon size={15} style={{ color: CORAL }} />
          </span>
          <span className="text-[13px] font-semibold" style={{ color: INK }}>{text}</span>
          {!plain && <Check size={14} className="ml-auto flex-none" style={{ color: CORAL }} />}
        </div>
      ))}
    </div>
  )
}

function ProCard() {
  const [walks, setWalks] = useState(8)
  const monthly = Math.round((walks * 4.3 * 15) / 5) * 5
  return (
    <div className="rounded-[20px] p-6" style={{ backgroundColor: 'rgba(251,247,242,0.96)', backdropFilter: 'blur(8px)', boxShadow: '0 24px 60px -24px rgba(19,19,22,0.5)' }}>
      <span className="block text-[10.5px] uppercase tracking-[0.2em] mb-2" style={{ fontFamily: MONO, color: CORAL }}>For pros · Are you someone's Fylos?</span>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[12.5px] font-medium" style={{ color: MUTED }}>{walks} walks a week</span>
        <span className="text-[22px] font-bold" style={{ color: INK, fontVariantNumeric: 'tabular-nums' }}>≈ CHF {monthly}<span className="text-[12px] font-medium" style={{ color: MUTED }}> / month</span></span>
      </div>
      <input type="range" min="3" max="20" value={walks} onChange={e => setWalks(Number(e.target.value))}
             aria-label="Walks per week" className="w-full" style={{ accentColor: CORAL }} />
      <p className="text-[11px] mt-2" style={{ color: MUTED }}>
        Based on a CHF 19 walk, about CHF 15 to you after the Fylos fee. Most pros earn CHF 400–900 a month.
      </p>
    </div>
  )
}

// ────────────────────────────────────────────
//  Credits (inside FIN)
// ────────────────────────────────────────────
const SAMPLE_CAST = ['Luna', 'Milo', 'Bella', 'Rocky', 'Daisy', 'Simba', 'Coco', 'Max', 'Nala', 'Charlie', 'Poppy', 'Bruno', 'Mochi', 'Zoe', 'Ares', 'Frida']

function Credits({ star, named }) {
  const cast = useMemo(() => {
    const base = named ? [star, ...SAMPLE_CAST] : SAMPLE_CAST
    return [...base, ...base]
  }, [star, named])
  return (
    <div className="relative h-[150px] w-full max-w-[420px] overflow-hidden" aria-hidden="true">
      <div className="fylos-credits-roll" style={{ animation: 'fylosCredits 26s linear infinite' }}>
        {cast.map((name, i) => {
          const isStar = named && i % (cast.length / 2) === 0
          return (
            <p key={`${name}-${i}`} className="text-center py-1 text-[14px]" style={{ color: isStar ? CORAL_LIGHT : 'rgba(251,247,242,0.72)' }}>
              <span className="font-semibold">{name}</span>
              <span style={{ color: 'rgba(251,247,242,0.4)' }}> · {isStar ? 'The Star' : 'A Very Good Friend'}</span>
            </p>
          )
        })}
      </div>
      <div className="absolute inset-x-0 top-0 h-8" style={{ background: `linear-gradient(${INK}, transparent)` }} />
      <div className="absolute inset-x-0 bottom-0 h-8" style={{ background: `linear-gradient(transparent, ${INK})` }} />
    </div>
  )
}

// ────────────────────────────────────────────
//  Post-credits: waitlist + poster (seamless from the dark FIN)
// ────────────────────────────────────────────
function Waitlist({ star, named }) {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try { if (window.localStorage.getItem('fylos.waitlist') === '1') setJoined(true) } catch (e) { /* ignore */ }
  }, [])

  function join(e) {
    e.preventDefault()
    if (!email.includes('@')) return
    // TODO: wire to the real waitlist endpoint (Resend / backend) before launch.
    setJoined(true)
    try { window.localStorage.setItem('fylos.waitlist', '1') } catch (err) { /* ignore */ }
  }

  function sharePoster() {
    const url = `${window.location.origin}${window.location.pathname}?pet=${encodeURIComponent(star)}`
    if (navigator.share) { navigator.share({ url }).catch(() => {}); return }
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <section id="waitlist" className="px-6 md:px-12 lg:px-20 py-24" style={{ backgroundColor: INK, color: CREAM }}>
      <div className="max-w-[900px] mx-auto grid lg:grid-cols-[1fr_300px] gap-12 items-start">
        <div>
          <span className="block text-[11px] uppercase tracking-[0.22em] mb-4" style={{ fontFamily: MONO, color: CORAL_LIGHT }}>After the credits</span>
          <h2 className="italic mb-4" style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 42px)', textWrap: 'balance' }}>
            Be in the sequel. It stars {named ? star : 'your pet'}.
          </h2>
          <p className="text-[14.5px] mb-8" style={{ color: 'rgba(251,247,242,0.7)' }}>
            Be among the first 1,000. Launching first in Zurich, then across Europe. One update per month, no spam.
          </p>
          {joined ? (
            <div className="flex items-center gap-3 rounded-2xl px-5 py-4" style={{ backgroundColor: 'rgba(251,247,242,0.08)' }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: CORAL }}>
                <Check size={16} color="#fff" />
              </span>
              <div>
                <p className="text-[15px] font-semibold">You’re on the list.</p>
                <p className="text-[13px]" style={{ color: 'rgba(251,247,242,0.6)' }}>One update per month. No spam, ever.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={join} className="flex flex-col sm:flex-row gap-3">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                     placeholder="you@example.com" aria-label="Email address"
                     className="flex-1 rounded-full px-5 py-3.5 text-[14.5px] outline-none"
                     style={{ backgroundColor: 'rgba(251,247,242,0.1)', color: CREAM, border: '1px solid rgba(251,247,242,0.18)' }} />
              <button type="submit" className="rounded-full px-6 py-3.5 text-[14.5px] font-semibold text-white" style={{ backgroundColor: CORAL }}>
                Get early access
              </button>
            </form>
          )}
        </div>

        <div>
          <div className="rounded-[18px] overflow-hidden relative" style={{ aspectRatio: '2 / 3', background: `linear-gradient(180deg, ${PEACH} 0%, ${PEACH_DEEP} 60%, ${CORAL_LIGHT} 130%)` }}>
            <div className="absolute inset-0 flex flex-col items-center justify-between py-6 px-5 text-center">
              <span className="text-[9px] uppercase tracking-[0.3em]" style={{ fontFamily: MONO, color: '#6B3F26' }}>Fylos presents</span>
              <div>
                <p className="italic leading-tight" style={{ fontFamily: SERIF, fontSize: 27, color: '#3A2417', textWrap: 'balance' }}>{star}</p>
                <p className="text-[9.5px] uppercase tracking-[0.2em] mt-2" style={{ fontFamily: MONO, color: '#6B3F26' }}>in “The Very Good Life”</p>
              </div>
              <div className="w-14 h-14 rounded-full" style={{ backgroundColor: CORAL, boxShadow: '0 10px 30px -8px rgba(180,73,31,0.6)' }} />
              <p className="text-[8px] leading-relaxed" style={{ fontFamily: MONO, color: '#6B3F26' }}>
                DIRECTED BY YOU · PRODUCED BY FYLOS<br />COMING SOON TO A POCKET NEAR YOU
              </p>
            </div>
          </div>
          <button onClick={sharePoster} className="mt-4 w-full flex items-center justify-center gap-2 rounded-full py-3 text-[13.5px] font-semibold"
                  style={{ backgroundColor: 'rgba(251,247,242,0.1)', color: CREAM, border: '1px solid rgba(251,247,242,0.18)' }}>
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Link copied' : 'Make your pet the star'}
          </button>
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────
//  FAQ + footer
// ────────────────────────────────────────────
const FAQS = [
  ['When does Fylos launch?', 'Early access opens in Zurich first, with Geneva and Basel next. Waitlist members get in city by city. First 1,000 in Switzerland.'],
  ['Which platforms?', 'iPhone and Android at launch. The app is built as one product for both.'],
  ['What does it cost?', 'The core companion is free: records, reminders and the vault. Services like walks and sitting are pay-per-booking with clear prices before you confirm.'],
  ['Where does my data live?', 'In the EU (Frankfurt), GDPR native. Your pet’s records belong to you and export with one tap.'],
  ['How do I join as a pro?', 'Apply from the app. Every pro passes ID verification and a review before their first booking. Most pros in Zurich earn CHF 400–900 a month.'],
  ['Why “Fylos”?', 'Fylos comes from the Greek φίλος, friend, with a nod to φύλακας, guardian. Designed in Athens, built for the world.'],
]

function Faq() {
  const [open, setOpen] = useState(0)
  return (
    <section id="faq" className="px-6 md:px-12 lg:px-20 py-20" style={{ backgroundColor: CREAM }}>
      <div className="max-w-[720px] mx-auto">
        <span className="block text-[11px] uppercase tracking-[0.22em] mb-4" style={{ fontFamily: MONO, color: CORAL }}>Questions</span>
        <h2 className="italic mb-8" style={{ fontFamily: SERIF, fontSize: 'clamp(28px, 4vw, 40px)', color: INK }}>Everything else, briefly.</h2>
        <div className="space-y-2.5">
          {FAQS.map(([q, a], i) => (
            <div key={q} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
                      className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="text-[15px] font-semibold" style={{ color: INK }}>{q}</span>
                <span className="text-[20px] leading-none flex-none ml-4" style={{ color: CORAL }}>{open === i ? '–' : '+'}</span>
              </button>
              {open === i && <p className="px-5 pb-5 text-[14px] leading-relaxed" style={{ color: MUTED }}>{a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="px-6 md:px-12 lg:px-20 py-14" style={{ backgroundColor: CREAM, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
      <div className="max-w-[1040px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="text-[17px] font-extrabold tracking-wide" style={{ fontFamily: LOGO, color: INK }}>FYLOS<span style={{ color: CORAL }}>.</span></p>
          <p className="text-[12.5px] mt-1.5" style={{ color: MUTED }}>Designed in Athens. Built for the world.</p>
        </div>
        <div className="flex flex-wrap gap-x-7 gap-y-2 text-[13px]" style={{ color: MUTED }}>
          <a href="#film" className="hover:opacity-70">The film</a>
          <a href="#waitlist" className="hover:opacity-70">Early access</a>
          <a href="#faq" className="hover:opacity-70">FAQ</a>
          <span>hello@fylos.app</span>
        </div>
        <p className="text-[11.5px]" style={{ fontFamily: MONO, color: '#9B9B9F' }}>© 2026 Fylos · Privacy · Terms</p>
      </div>
    </footer>
  )
}

// ────────────────────────────────────────────
//  CSS scene placeholders (identical spirit to v1)
// ────────────────────────────────────────────
function Stage({ sky, floor, children }) {
  return (
    <div className="absolute inset-0" style={{ background: sky }}>
      <div className="absolute bottom-0 inset-x-0" style={{ height: '26%', background: floor }} />
      {children}
    </div>
  )
}

function Ball({ style }) {
  return <div className="absolute rounded-full" style={{ width: 26, height: 26, background: `radial-gradient(circle at 35% 30%, ${CORAL_LIGHT}, ${CORAL})`, boxShadow: '0 8px 18px -6px rgba(180,73,31,0.55)', ...style }} />
}

function Dog({ style }) {
  return (
    <div className="absolute" style={{ width: 90, height: 110, ...style }}>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-[45%]" style={{ width: 64, height: 58, backgroundColor: '#EAD9C3' }} />
      <div className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 8, width: 46, height: 44, backgroundColor: '#F2E4D0' }} />
      <div className="absolute rounded-full" style={{ top: 6, left: 10, width: 14, height: 26, backgroundColor: '#D9C3A6', transform: 'rotate(-18deg)' }} />
      <div className="absolute rounded-full" style={{ top: 6, right: 10, width: 14, height: 26, backgroundColor: '#D9C3A6', transform: 'rotate(18deg)' }} />
      <div className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 48, width: 40, height: 8, backgroundColor: CORAL }} />
      <div className="absolute rounded-full" style={{ top: 22, left: 30, width: 5, height: 7, backgroundColor: '#3A2A1C' }} />
      <div className="absolute rounded-full" style={{ top: 22, right: 30, width: 5, height: 7, backgroundColor: '#3A2A1C' }} />
    </div>
  )
}

function Window({ style }) {
  return <div className="absolute rounded-t-full" style={{ width: 70, height: 130, background: 'linear-gradient(#FFF6E8, #FFE3C4)', border: '6px solid rgba(255,255,255,0.75)', ...style }} />
}

function PlaceholderLivingRoom() {
  return (
    <Stage sky="linear-gradient(180deg, #F6D9DD 0%, #FBEFE2 70%)" floor="linear-gradient(#EAD9CB, #E0C9B6)">
      <Window style={{ top: '18%', left: '18%' }} />
      <Window style={{ top: '18%', right: '18%' }} />
      <div className="absolute left-1/2 -translate-x-1/2 rounded-[50%]" style={{ bottom: '17%', width: 300, height: 60, backgroundColor: 'rgba(232,93,42,0.16)' }} />
      <Dog style={{ bottom: '22%', left: 'calc(50% - 45px)' }} />
    </Stage>
  )
}

function PlaceholderHallway() {
  const notes = Array.from({ length: 24 })
  return (
    <Stage sky="linear-gradient(180deg, #F3E7DA 0%, #EBD9C8 100%)" floor="linear-gradient(#DCC6B2, #D0B89F)">
      {notes.map((_, i) => (
        <div key={i} className="absolute rounded-[3px]" style={{
          top: `${10 + (i % 6) * 11}%`, left: `${6 + Math.floor(i / 6) * 7}%`,
          width: 34, height: 26, backgroundColor: i % 5 === 0 ? PEACH_DEEP : '#FFFDF7',
          transform: `rotate(${(i % 3) - 1}deg)`, boxShadow: '0 3px 8px -3px rgba(90,60,30,0.25)',
        }} />
      ))}
      {notes.map((_, i) => (
        <div key={`r-${i}`} className="absolute rounded-[3px]" style={{
          top: `${10 + (i % 6) * 11}%`, right: `${6 + Math.floor(i / 6) * 7}%`,
          width: 34, height: 26, backgroundColor: i % 4 === 0 ? '#FDEBD2' : '#FFFDF7',
          transform: `rotate(${1 - (i % 3)}deg)`, boxShadow: '0 3px 8px -3px rgba(90,60,30,0.25)',
        }} />
      ))}
      <div className="absolute left-1/2 -translate-x-1/2 rounded-t-full" style={{ bottom: '26%', width: 110, height: 190, background: 'linear-gradient(#FFF3E4, #FFD9BC)', border: `7px solid ${CORAL}` }} />
      <Dog style={{ bottom: '20%', left: 'calc(50% - 45px)' }} />
    </Stage>
  )
}

function PlaceholderPark() {
  return (
    <Stage sky="linear-gradient(180deg, #FFE9C9 0%, #FDF3E2 75%)" floor="linear-gradient(#CFE0C2, #B9D0A9)">
      {[12, 26, 74, 88].map(x => (
        <div key={x} className="absolute" style={{ left: `${x}%`, bottom: '24%' }}>
          <div className="rounded-full" style={{ width: 74, height: 74, backgroundColor: '#A9C79A' }} />
          <div className="mx-auto" style={{ width: 10, height: 34, backgroundColor: '#8A6B4F' }} />
        </div>
      ))}
      <div className="absolute left-1/2 -translate-x-1/2 rounded-[50%]" style={{ bottom: '20%', width: 210, height: 64, backgroundColor: '#BFD9EA', border: '10px solid #E9E0D2' }} />
      <Dog style={{ bottom: '22%', left: '30%' }} />
      <Dog style={{ bottom: '22%', right: '28%' }} />
    </Stage>
  )
}

function PlaceholderVet() {
  return (
    <Stage sky="linear-gradient(180deg, #DCEDE4 0%, #F4F7EF 80%)" floor="linear-gradient(#E7DED2, #DACDBB)">
      {[20, 38, 56, 74].map((x, i) => (
        <div key={x} className="absolute rounded-t-2xl" style={{ left: `${x}%`, bottom: '26%', width: 56, height: 46, backgroundColor: i === 1 ? PEACH : '#FFFFFF', boxShadow: '0 6px 14px -6px rgba(60,80,60,0.25)' }} />
      ))}
      <div className="absolute rounded-xl" style={{ top: '14%', left: '12%', width: 90, height: 120, backgroundColor: '#FFFFFF', boxShadow: '0 6px 16px -8px rgba(60,80,60,0.3)' }}>
        {[38, 30, 22, 15].map((w, i) => (
          <div key={w} className="mx-auto rounded-full" style={{ marginTop: i === 0 ? 16 : 10, width: w, height: 8, backgroundColor: '#D9C9B4' }} />
        ))}
      </div>
      <Dog style={{ bottom: '27.5%', left: 'calc(38% + 6px)', transform: 'scale(0.8)', transformOrigin: 'bottom center' }} />
    </Stage>
  )
}

function PlaceholderNight() {
  return (
    <Stage sky="linear-gradient(180deg, #3E3C55 0%, #6B5A6B 90%)" floor="linear-gradient(#4A4258, #3B3549)">
      <div className="absolute rounded-full" style={{ top: '14%', right: '20%', width: 64, height: 64, backgroundColor: '#FBEFD8', boxShadow: '0 0 50px 10px rgba(251,239,216,0.35)' }} />
      <div className="absolute rounded-full" style={{ top: '24%', left: '24%', width: 6, height: 6, backgroundColor: '#FBEFD8' }} />
      <div className="absolute rounded-full" style={{ top: '12%', left: '38%', width: 4, height: 4, backgroundColor: '#FBEFD8' }} />
      <div className="absolute rounded-2xl" style={{ bottom: '24%', left: '18%', width: 240, height: 80, backgroundColor: '#8D7B94' }} />
      <div className="absolute" style={{ bottom: '24%', right: '22%' }}>
        <div className="rounded-full" style={{ width: 46, height: 40, background: '#FFDFA8', boxShadow: '0 0 46px 14px rgba(255,223,168,0.4)' }} />
        <div className="mx-auto" style={{ width: 8, height: 26, backgroundColor: '#6B5A6B' }} />
      </div>
      <Dog style={{ bottom: '27%', left: '26%', transform: 'scale(0.75)', opacity: 0.92 }} />
    </Stage>
  )
}
