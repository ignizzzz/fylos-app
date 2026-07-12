import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, ArrowDown, Check, Copy, Bell, FileText, Activity,
  MapPin, Shield, Heart, Stethoscope, Moon, Play,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────
//  FYLOS — Website v1: «FYLOS presents» (the site is a film)
//  Aesthetic E: modern soft-3D animated film. Scenes are sticky cinema
//  blocks with letterbox bars; acts between them are startup content.
//  Scene media lives in /public/film/ (see FYLOS_WEBSITE_ASSET_PROMPTS.md).
//  Missing assets render styled placeholders, so the page works today
//  and upgrades itself the moment renders are dropped into public/film/.
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

export default function WebsiteFilm() {
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
    <div className="fylos-film" style={{ backgroundColor: CREAM, color: INK, fontFamily: 'Inter, -apple-system, sans-serif', WebkitFontSmoothing: 'antialiased' }}>
      <GlobalStyles />
      <Nav />
      <SceneHero petName={petName} setPetName={setPetName} star={star} />
      <ActProblem />
      <SceneBlock id="scene-02" chapter="Chapter one" caption="Their life is scattered everywhere." placeholder={<PlaceholderHallway />} />
      <ActApp star={star} named={named} />
      <SceneBlock id="scene-03" chapter="Chapter two" caption="The walk is sacred. Protect it." placeholder={<PlaceholderPark />} />
      <ActServices star={star} />
      <SceneBlock id="scene-04" chapter="Chapter three" caption="The check-up, without the paper chase." placeholder={<PlaceholderVet />} />
      <ActHealth star={star} named={named} />
      <SceneBlock id="scene-05" chapter="Chapter four" caption="The quiet hours are worth remembering." placeholder={<PlaceholderNight />} />
      <Finale star={star} named={named} />
      <Faq />
      <Footer />
    </div>
  )
}

// ────────────────────────────────────────────
//  Global keyframes
// ────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      @keyframes fylosCredits { from { transform: translateY(0); } to { transform: translateY(-50%); } }
      @keyframes fylosFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
      @media (prefers-reduced-motion: reduce) {
        .fylos-credits-roll, .fylos-float { animation: none !important; }
      }
      @supports (height: 100svh) { .fylos-scene-frame { height: 100svh !important; } }
      .fylos-film input::placeholder { color: #9B9B9F; }
      .fylos-film input:focus-visible, .fylos-film button:focus-visible, .fylos-film a:focus-visible {
        outline: 2px solid #E85D2A; outline-offset: 2px; border-radius: 6px;
      }
    `}</style>
  )
}

// ────────────────────────────────────────────
//  Nav
// ────────────────────────────────────────────
function Nav() {
  const links = [
    ['The film', '#film'], ['Features', '#features'], ['For pros', '#pros'], ['FAQ', '#faq'],
  ]
  return (
    <div className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl" style={{ backgroundColor: 'rgba(251,247,242,0.9)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-5 md:px-10 py-3.5">
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
//  Scene media: /film/{id}.mp4 with /film/{id}.jpg poster.
//  Falls back to a styled placeholder until renders exist.
// ────────────────────────────────────────────
function SceneMedia({ id, placeholder, eager }) {
  const [ok, setOk] = useState(true)
  const reduce = useReducedMotion()
  const videoRef = useRef(null)

  // Play only while the scene is near the viewport, so five loops never
  // download or decode together on first paint.
  useEffect(() => {
    const el = videoRef.current
    if (!el || reduce || !ok) return undefined
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {})
      else el.pause()
    }, { rootMargin: '20%' })
    io.observe(el)
    return () => io.disconnect()
  }, [reduce, ok])

  if (!ok) {
    return (
      <div className="absolute inset-0">
        {placeholder}
        <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full"
             style={{ backgroundColor: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(4px)' }}>
          <span className="text-[10px] uppercase tracking-[0.16em]" style={{ fontFamily: MONO, color: '#7a6a5c' }}>
            {id} · final 3D render drops in here
          </span>
        </div>
      </div>
    )
  }
  if (reduce) {
    return <img className="absolute inset-0 w-full h-full object-cover" src={`/film/${id}.jpg`} alt="" onError={() => setOk(false)} />
  }
  return (
    <video
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover"
      src={`/film/${id}.mp4`}
      poster={`/film/${id}.jpg`}
      muted loop playsInline
      preload={eager ? 'metadata' : 'none'}
      onError={() => setOk(false)}
    />
  )
}

// ────────────────────────────────────────────
//  Cinema block: sticky viewport + letterbox + scroll dolly
// ────────────────────────────────────────────
function SceneBlock({ id, chapter, caption, placeholder, children, tall }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [1.08, 1, 1.08])
  const captionOpacity = useTransform(scrollYProgress, [0.3, 0.45, 0.55, 0.7], [0, 1, 1, 0])

  return (
    <section ref={ref} className="relative" style={{ height: tall ? '220vh' : '170vh' }}>
      <div className="fylos-scene-frame sticky top-0 h-screen overflow-hidden" style={{ backgroundColor: INK }}>
        <motion.div style={{ scale }} className="absolute inset-0">
          <SceneMedia id={id} placeholder={placeholder} />
        </motion.div>

        {/* letterbox — top bar is taller than the fixed nav so the chapter label stays visible below it */}
        <div className="absolute top-0 inset-x-0 h-[76px] md:h-[88px] flex items-end justify-center pb-2.5" style={{ backgroundColor: INK }}>
          {chapter && (
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.28em]" style={{ fontFamily: MONO, color: 'rgba(251,247,242,0.65)' }}>
              {chapter}
            </span>
          )}
        </div>
        <div className="absolute bottom-0 inset-x-0 h-10 md:h-14 flex items-center justify-center" style={{ backgroundColor: INK }}>
          {caption && (
            <motion.span style={{ opacity: captionOpacity, fontFamily: SERIF, color: CREAM }} className="italic text-[15px] md:text-[19px] px-6 text-center">
              {caption}
            </motion.span>
          )}
        </div>

        {children}
      </div>
    </section>
  )
}

// ────────────────────────────────────────────
//  Scene 1 — hero with opening titles + pet name
// ────────────────────────────────────────────
function SceneHero({ petName, setPetName, star }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [1, 1.12])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0])
  const titleEvents = useTransform(titleOpacity, v => (v < 0.05 ? 'none' : 'auto'))

  return (
    <section id="film" ref={ref} className="relative" style={{ height: '190vh' }}>
      <div className="fylos-scene-frame sticky top-0 h-screen overflow-hidden" style={{ backgroundColor: INK }}>
        <motion.div style={{ scale }} className="absolute inset-0">
          <SceneMedia id="scene-01" placeholder={<PlaceholderLivingRoom />} eager />
        </motion.div>

        {/* scrim behind the titles + soft edge vignette, for real contrast over pale scenes */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 58% 46% at 50% 42%, rgba(19,19,22,0.52), rgba(19,19,22,0.14) 62%, transparent 78%), radial-gradient(ellipse at center, transparent 45%, rgba(19,19,22,0.3) 100%)' }} />

        {/* letterbox */}
        <div className="absolute top-0 inset-x-0 h-[76px] md:h-[88px]" style={{ backgroundColor: INK }} />
        <div className="absolute bottom-0 inset-x-0 h-10 md:h-14 flex items-center justify-center" style={{ backgroundColor: INK }}>
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]" style={{ fontFamily: MONO, color: 'rgba(251,247,242,0.6)' }}>
            <ArrowDown size={11} /> Scroll to roll the film
          </span>
        </div>

        {/* opening titles */}
        <motion.div style={{ opacity: titleOpacity, pointerEvents: titleEvents }} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <span className="text-[11px] md:text-[12px] uppercase tracking-[0.34em] mb-4" style={{ fontFamily: MONO, color: 'rgba(255,255,255,0.9)', textShadow: '0 1px 12px rgba(19,19,22,0.45)' }}>
            Fylos presents
          </span>
          <h1 className="italic leading-[1.08] mb-7" style={{ fontFamily: SERIF, fontSize: 'clamp(38px, 7vw, 84px)', color: '#FFFFFF', textShadow: '0 2px 24px rgba(19,19,22,0.5)', textWrap: 'balance' }}>
            The Story of<br />{star}
          </h1>
          <label className="flex items-center gap-2 rounded-full pl-4 pr-2 py-2" style={{ backgroundColor: 'rgba(251,247,242,0.92)', boxShadow: '0 10px 40px -12px rgba(19,19,22,0.4)' }}>
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
          <p className="mt-3 text-[11.5px]" style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 8px rgba(19,19,22,0.4)' }}>
            The whole film rewrites itself for them.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────
//  Acts (content sections between scenes)
// ────────────────────────────────────────────
function Kicker({ children }) {
  return (
    <span className="block text-[11px] uppercase tracking-[0.22em] mb-4" style={{ fontFamily: MONO, color: CORAL }}>
      {children}
    </span>
  )
}

function ActTitle({ children }) {
  return (
    <h2 className="italic mb-5" style={{ fontFamily: SERIF, fontSize: 'clamp(30px, 4.2vw, 46px)', lineHeight: 1.15, textWrap: 'balance' }}>
      {children}
    </h2>
  )
}

function ActProblem() {
  const cards = [
    { rot: '-4deg', label: 'Vaccine card', sub: 'kitchen drawer' },
    { rot: '2.5deg', label: '"Rabies due when?"', sub: 'chat with mom' },
    { rot: '-1.5deg', label: 'IMG_4102.jpg', sub: 'camera roll' },
    { rot: '3.5deg', label: 'Vet: call back re. tick meds', sub: 'your memory' },
  ]
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28" style={{ backgroundColor: CREAM }}>
      <div className="max-w-[1040px] mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <Kicker>Chapter one · The scattered years</Kicker>
          <ActTitle>Vaccines in a drawer. Photos in three apps. Advice in your head.</ActTitle>
          <p className="text-[16px] leading-relaxed max-w-[52ch]" style={{ color: MUTED }}>
            Everything you know about your pet lives in places that forget. Fylos is the second brain
            for pet parents: one calm home for their health, their documents and their days.
          </p>
        </div>
        <div className="relative h-[300px]">
          {cards.map((c, i) => (
            <div key={c.label} className="absolute left-1/2"
                 style={{ top: `${8 + i * 22}%`, transform: `translateX(-50%) rotate(${c.rot})`, width: 250 }}>
              <div className="fylos-float rounded-2xl px-5 py-4 shadow-lg"
                   style={{
                     backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)',
                     animation: `fylosFloat 5s ease-in-out ${i * 0.6}s infinite`,
                   }}>
                <p className="text-[13.5px] font-semibold" style={{ color: INK }}>{c.label}</p>
                <p className="text-[11px] uppercase tracking-[0.12em] mt-1" style={{ fontFamily: MONO, color: '#9B9B9F' }}>{c.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon: Icon, title, body }) {
  return (
    <div className="rounded-[20px] p-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: PEACH }}>
        <Icon size={18} style={{ color: CORAL }} />
      </div>
      <h3 className="text-[16px] font-semibold mb-1.5">{title}</h3>
      <p className="text-[14px] leading-relaxed" style={{ color: MUTED }}>{body}</p>
    </div>
  )
}

function ActApp({ star, named }) {
  const who = named ? star : 'your pet'
  return (
    <section id="features" className="px-6 md:px-12 lg:px-20 py-20 md:py-28" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-[1040px] mx-auto">
        <div className="max-w-[620px]">
          <Kicker>The app</Kicker>
          <ActTitle>One place for everything that matters about {who}.</ActTitle>
          <p className="text-[16px] leading-relaxed mb-12" style={{ color: MUTED }}>
            Built in the EU, GDPR native, and designed like the best thing on your home screen.
            Your data stays yours, and it finally travels with you.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <FeatureCard icon={Bell} title="Health records & reminders" body={`Vaccines, meds and check-ups on a calm timeline. Fylos remembers, so you can just be with ${who}.`} />
          <FeatureCard icon={Activity} title="Weight & wellbeing" body="A gentle chart that tells you when something drifts, long before it becomes a vet visit." />
          <FeatureCard icon={FileText} title="Document vault" body={'Passports, lab results, insurance. The end of "I\'ll find it and send it over".'} />
        </div>
      </div>
    </section>
  )
}

function ActServices({ star }) {
  const [walks, setWalks] = useState(8)
  const monthly = Math.round((walks * 4.3 * 15) / 5) * 5
  return (
    <section id="pros" className="px-6 md:px-12 lg:px-20 py-20 md:py-28" style={{ backgroundColor: PEACH }}>
      <div className="max-w-[1040px] mx-auto grid lg:grid-cols-2 gap-14">
        <div>
          <Kicker>Chapter two · The walk</Kicker>
          <ActTitle>Trusted hands, on the days you can't be there.</ActTitle>
          <ul className="space-y-4 mt-8">
            {[
              [MapPin, 'Book vetted walkers and sitters nearby, with live GPS on every walk.'],
              [Heart, `Playdate matching. ${star === DEFAULT_STAR ? 'Your pet' : star} makes friends, you make coffee plans.`],
              [Shield, 'Community safety map: neighbours flag hazards before they find you.'],
            ].map(([Icon, text]) => (
              <li key={text} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center flex-none mt-0.5" style={{ backgroundColor: '#FFFFFF' }}>
                  <Icon size={15} style={{ color: CORAL }} />
                </span>
                <span className="text-[15px] leading-relaxed" style={{ color: '#4A3527' }}>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[22px] p-7 md:p-9" style={{ backgroundColor: '#FFFFFF', boxShadow: '0 24px 60px -30px rgba(60,34,16,0.35)' }}>
          <Kicker>For pros · Are you someone's Fylos?</Kicker>
          <h3 className="text-[22px] font-semibold mb-2">The work you love, with serious tools.</h3>
          <p className="text-[14px] leading-relaxed mb-7" style={{ color: MUTED }}>
            Requests, walk check-ins with GPS, and payouts that arrive on time. Calm facts, no promises:
          </p>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[13px] font-medium" style={{ color: MUTED }}>{walks} walks a week</span>
            <span className="text-[26px] font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>≈ CHF {monthly}<span className="text-[14px] font-medium" style={{ color: MUTED }}> / month</span></span>
          </div>
          <input
            type="range" min="3" max="20" value={walks}
            onChange={e => setWalks(Number(e.target.value))}
            aria-label="Walks per week"
            className="w-full" style={{ accentColor: CORAL }}
          />
          <p className="text-[11.5px] mt-3" style={{ color: MUTED }}>
            Based on a CHF 19 walk, about CHF 15 to you after the Fylos fee. Most pros earn CHF 400–900 a month.
          </p>
          <a href="#waitlist" className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-white rounded-full px-5 py-2.5" style={{ backgroundColor: CORAL }}>
            Join the first 100 pros <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}

function ActHealth({ star, named }) {
  const who = named ? star : 'Milo'
  const rows = [
    { icon: Stethoscope, title: 'Rabies booster', meta: 'Due in 3 weeks · Dr. Keller', state: 'Scheduled' },
    { icon: Activity, title: 'Weight check', meta: `12.4 kg · steady`, state: 'All good' },
    { icon: FileText, title: 'Lab results — March', meta: 'PDF · shared with your vet', state: 'Stored' },
  ]
  return (
    <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="max-w-[1040px] mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <Kicker>Chapter three · The check-up</Kicker>
          <ActTitle>Never again “I’ll check and call you back.”</ActTitle>
          <p className="text-[16px] leading-relaxed max-w-[52ch]" style={{ color: MUTED }}>
            The vet asks, you answer. Everything is one tap away: vaccine schedules with gentle reminders,
            an emergency card that works offline, and telehealth for the 2 a.m. worries.
          </p>
        </div>
        <div className="rounded-[22px] p-5" style={{ backgroundColor: CREAM, border: '1px solid rgba(0,0,0,0.05)' }}>
          <p className="text-[12px] uppercase tracking-[0.16em] px-2 pt-1 pb-3" style={{ fontFamily: MONO, color: MUTED }}>{who} · today</p>
          <div className="space-y-2.5">
            {rows.map(r => (
              <div key={r.title} className="flex items-center gap-3.5 rounded-2xl px-4 py-3.5" style={{ backgroundColor: '#FFFFFF' }}>
                <span className="w-9 h-9 rounded-full flex items-center justify-center flex-none" style={{ backgroundColor: PEACH }}>
                  <r.icon size={16} style={{ color: CORAL }} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold truncate">{r.title}</p>
                  <p className="text-[12px] truncate" style={{ color: MUTED }}>{r.meta}</p>
                </div>
                <span className="text-[11px] font-semibold rounded-full px-2.5 py-1" style={{ backgroundColor: PEACH, color: '#B4491F' }}>{r.state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────
//  Finale: FIN + rolling credits + waitlist + poster
// ────────────────────────────────────────────
const SAMPLE_CAST = [
  'Luna', 'Milo', 'Bella', 'Rocky', 'Daisy', 'Simba', 'Coco', 'Max',
  'Nala', 'Charlie', 'Poppy', 'Bruno', 'Mochi', 'Zoe', 'Ares', 'Frida',
]

function Finale({ star, named }) {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try { if (window.localStorage.getItem('fylos.waitlist') === '1') setJoined(true) } catch (e) { /* ignore */ }
  }, [])

  const cast = useMemo(() => {
    const base = named ? [star, ...SAMPLE_CAST] : SAMPLE_CAST
    return [...base, ...base] // duplicated for a seamless roll
  }, [star, named])

  function join(e) {
    e.preventDefault()
    if (!email.includes('@')) return
    // TODO: wire to the real waitlist endpoint (Resend / backend) before launch.
    setJoined(true)
    try { window.localStorage.setItem('fylos.waitlist', '1') } catch (err) { /* ignore */ }
  }

  function sharePoster() {
    const url = `${window.location.origin}${window.location.pathname}?pet=${encodeURIComponent(star)}`
    if (navigator.share) {
      navigator.share({ url }).catch(() => {})
      return
    }
    if (!navigator.clipboard) return
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <section id="waitlist" className="px-6 md:px-12 lg:px-20 py-24 md:py-32" style={{ backgroundColor: INK, color: CREAM }}>
      <div className="max-w-[1040px] mx-auto">
        <p className="text-center text-[11px] uppercase tracking-[0.3em] mb-6" style={{ fontFamily: MONO, color: 'rgba(251,247,242,0.55)' }}>Fin</p>
        <h2 className="text-center italic mb-16" style={{ fontFamily: SERIF, fontSize: 'clamp(36px, 6vw, 64px)' }}>
          Stress less. Fylos more<span style={{ color: CORAL_LIGHT }}>.</span>
        </h2>

        <div className="grid lg:grid-cols-[1fr_340px] gap-14 items-start">
          <div>
            {/* rolling credits */}
            <div className="relative h-[220px] overflow-hidden mb-10" aria-hidden="true">
              <div className="fylos-credits-roll" style={{ animation: 'fylosCredits 26s linear infinite' }}>
                {cast.map((name, i) => {
                  const isStar = named && i % (cast.length / 2) === 0
                  return (
                    <p key={`${name}-${i}`} className="text-center py-1.5 text-[15px]" style={{ color: isStar ? CORAL_LIGHT : 'rgba(251,247,242,0.72)' }}>
                      <span className="font-semibold">{name}</span>
                      <span style={{ color: 'rgba(251,247,242,0.4)' }}> · {isStar ? 'The Star' : 'A Very Good Friend'}</span>
                    </p>
                  )
                })}
              </div>
              <div className="absolute inset-x-0 top-0 h-12" style={{ background: `linear-gradient(${INK}, transparent)` }} />
              <div className="absolute inset-x-0 bottom-0 h-12" style={{ background: `linear-gradient(transparent, ${INK})` }} />
            </div>

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
                <input
                  type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" aria-label="Email address"
                  className="flex-1 rounded-full px-5 py-3.5 text-[14.5px] outline-none"
                  style={{ backgroundColor: 'rgba(251,247,242,0.1)', color: CREAM, border: '1px solid rgba(251,247,242,0.18)' }}
                />
                <button type="submit" className="rounded-full px-6 py-3.5 text-[14.5px] font-semibold text-white" style={{ backgroundColor: CORAL }}>
                  Get early access
                </button>
              </form>
            )}
            <p className="mt-4 text-[12px]" style={{ color: 'rgba(251,247,242,0.7)' }}>
              Be among the first 1,000. Launching first in Zurich, then across Europe.
            </p>
          </div>

          {/* poster generator preview */}
          <div>
            <div className="rounded-[18px] overflow-hidden relative" style={{ aspectRatio: '2 / 3', background: `linear-gradient(180deg, ${PEACH} 0%, ${PEACH_DEEP} 60%, ${CORAL_LIGHT} 130%)` }}>
              <div className="absolute inset-0 flex flex-col items-center justify-between py-7 px-5 text-center">
                <span className="text-[9px] uppercase tracking-[0.3em]" style={{ fontFamily: MONO, color: '#6B3F26' }}>Fylos presents</span>
                <div>
                  <p className="italic leading-tight" style={{ fontFamily: SERIF, fontSize: 30, color: '#3A2417', textWrap: 'balance' }}>{star}</p>
                  <p className="text-[10px] uppercase tracking-[0.2em] mt-2" style={{ fontFamily: MONO, color: '#6B3F26' }}>in “The Very Good Life”</p>
                </div>
                <div className="w-16 h-16 rounded-full" style={{ backgroundColor: CORAL, boxShadow: '0 10px 30px -8px rgba(180,73,31,0.6)' }} />
                <p className="text-[8.5px] leading-relaxed" style={{ fontFamily: MONO, color: '#6B3F26' }}>
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
    <section id="faq" className="px-6 md:px-12 lg:px-20 py-20 md:py-28" style={{ backgroundColor: CREAM }}>
      <div className="max-w-[720px] mx-auto">
        <Kicker>Questions</Kicker>
        <ActTitle>Everything else, briefly.</ActTitle>
        <div className="mt-8 space-y-2.5">
          {FAQS.map(([q, a], i) => (
            <div key={q} className="rounded-2xl overflow-hidden" style={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.05)' }}>
              <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}
                      className="w-full flex items-center justify-between px-5 py-4 text-left">
                <span className="text-[15px] font-semibold">{q}</span>
                <span className="text-[20px] leading-none flex-none ml-4" style={{ color: CORAL }}>{open === i ? '–' : '+'}</span>
              </button>
              {open === i && (
                <p className="px-5 pb-5 text-[14px] leading-relaxed" style={{ color: MUTED }}>{a}</p>
              )}
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
          <p className="text-[17px] font-extrabold tracking-wide" style={{ fontFamily: LOGO }}>FYLOS<span style={{ color: CORAL }}>.</span></p>
          <p className="text-[12.5px] mt-1.5" style={{ color: MUTED }}>Designed in Athens. Built for the world.</p>
        </div>
        <div className="flex flex-wrap gap-x-7 gap-y-2 text-[13px]" style={{ color: MUTED }}>
          <a href="#film" className="hover:opacity-70">The film</a>
          <a href="#features" className="hover:opacity-70">Features</a>
          <a href="#pros" className="hover:opacity-70">For pros</a>
          <a href="#waitlist" className="hover:opacity-70">Early access</a>
          <span>hello@fylos.app</span>
        </div>
        <p className="text-[11.5px]" style={{ fontFamily: MONO, color: '#9B9B9F' }}>© 2026 Fylos · Privacy · Terms</p>
      </div>
    </footer>
  )
}

// ────────────────────────────────────────────
//  CSS scene placeholders (until 3D renders land in /public/film)
//  Deliberately abstract: pastel sets, soft shapes, the coral ball.
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
  // simple stylised sitting dog silhouette
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
      <Ball style={{ bottom: '23%', left: 'calc(50% + 60px)' }} />
    </Stage>
  )
}

function PlaceholderHallway() {
  const notes = Array.from({ length: 24 })
  return (
    <Stage sky="linear-gradient(180deg, #F3E7DA 0%, #EBD9C8 100%)" floor="linear-gradient(#DcC6B2, #D0B89F)">
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
      <Ball style={{ bottom: '24%', left: 'calc(50% - 13px)' }} />
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
      <Ball style={{ bottom: '27%', right: '14%' }} />
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
      <Ball style={{ bottom: '25%', left: '40%' }} />
    </Stage>
  )
}
