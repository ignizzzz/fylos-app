import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Instagram, Mail, ArrowRight, X, Download, Check } from 'lucide-react'
import { COMMUNITY, FAQ, FILM_TITLE_PREFIX, DEFAULT_STAR } from './data'
import { EarningsSlider } from './demos'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function SectionKicker({ children }) {
  return <div className="film-mono text-[9px] md:text-[10px] text-[#C2451A] mb-4">{children}</div>
}

function SectionTitle({ children }) {
  return (
    <h2 className="film-serif text-[#111] font-semibold tracking-tight leading-[1.02] text-[clamp(30px,4.6vw,58px)]">
      {children}
    </h2>
  )
}

const fadeUp = {
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
}

/* ------------------------------------------------------------------ */
/* poster generator: your pet becomes the star                         */
/* ------------------------------------------------------------------ */
function PosterModal({ petName, onClose }) {
  const canvasRef = useRef(null)
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const [ready, setReady] = useState(false)
  const star = petName || DEFAULT_STAR

  // focus lands on the dialog, Escape closes, Tab cycles inside, focus returns on unmount
  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Tab') {
        const focusables = dialogRef.current?.querySelectorAll('button, canvas[tabindex]')
        if (!focusables?.length) return
        const list = Array.from(focusables)
        const first = list[0]
        const last = list[list.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [onClose])

  const draw = useCallback(async (canvas) => {
    if (!canvas) return
    canvasRef.current = canvas
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = '/film/poster-blank.jpg'
    let hasArt = true
    try {
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej })
    } catch { hasArt = false }
    try {
      await document.fonts.load('600 74px Fraunces')
      await document.fonts.load('400 26px "Space Mono"')
    } catch { /* system fallbacks still look fine */ }
    canvas.width = 1600
    canvas.height = 2400
    if (hasArt) {
      ctx.drawImage(img, 0, 0, 1600, 2400)
    } else {
      ctx.fillStyle = '#FBF7F2'
      ctx.fillRect(0, 0, 1600, 2400)
    }
    ctx.textAlign = 'center'
    ctx.fillStyle = 'rgba(17,17,17,0.62)'
    ctx.font = '400 30px "Space Mono", monospace'
    ctx.fillText('F Y L O S   p r e s e n t s', 800, 165)
    ctx.fillStyle = '#E85D2A'
    ctx.font = '600 118px Fraunces, Georgia, serif'
    const title = `${FILM_TITLE_PREFIX} ${star}`
    if (ctx.measureText(title).width > 1380) ctx.font = '600 92px Fraunces, Georgia, serif'
    ctx.fillText(title, 800, 300)
    ctx.fillStyle = hasArt ? 'rgba(251,247,242,0.85)' : 'rgba(17,17,17,0.55)'
    ctx.font = '400 26px "Space Mono", monospace'
    ctx.fillText('A  F Y L O S  P R O D U C T I O N   ·   # F Y L O S F R I E N D S', 800, 2312)
    setReady(true)
  }, [star])

  const download = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const a = document.createElement('a')
    a.download = `the-story-of-${(petName || 'a-very-good-boy').toLowerCase().replace(/[^a-z0-9]+/gi, '-')}.jpg`
    a.href = canvas.toDataURL('image/jpeg', 0.92)
    a.click()
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 md:p-10" role="dialog" aria-modal="true" aria-label="Your pet poster">
      <button className="absolute inset-0 bg-[#111]/70 backdrop-blur-sm" onClick={onClose} aria-label="Close poster" />
      <motion.div ref={dialogRef} initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="relative bg-[#FBF7F2] rounded-[28px] p-4 md:p-6 shadow-2xl max-h-full overflow-auto film-hide-scrollbar">
        <div className="flex items-center justify-between mb-4 gap-6">
          <div className="film-mono text-[9px] text-[#C2451A]">Your poster</div>
          <button ref={closeRef} onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full bg-white shadow flex items-center justify-center text-[#111]">
            <X size={16} />
          </button>
        </div>
        <canvas ref={draw} className="w-[min(74vw,340px)] rounded-2xl shadow-lg" aria-label={`Movie poster: ${FILM_TITLE_PREFIX} ${star}`} />
        <button
          onClick={download}
          disabled={!ready}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E85D2A] text-white font-extrabold text-[15px] py-3.5 shadow-[0_14px_34px_-10px_rgba(232,93,42,0.55)] hover:bg-[#C94A1D] transition-colors disabled:opacity-50"
        >
          <Download size={16} strokeWidth={2.6} /> Save the poster
        </button>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* waitlist                                                            */
/* ------------------------------------------------------------------ */
function Waitlist({ petName, setPetName }) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [joined, setJoined] = useState(false)
  const [posterOpen, setPosterOpen] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setError('That email looks off. One more try?')
      return
    }
    setError('')
    // TODO: POST to the real waitlist endpoint when it exists.
    try {
      const list = JSON.parse(localStorage.getItem('fylos.waitlist') || '[]')
      if (!list.includes(email)) list.push(email)
      localStorage.setItem('fylos.waitlist', JSON.stringify(list))
    } catch { /* storage may be unavailable, the success state still shows */ }
    setJoined(true)
  }

  return (
    <motion.section {...fadeUp} className="max-w-3xl mx-auto px-6 py-24 md:py-32 text-center" aria-label="Join the waitlist">
      <SectionKicker>Now boarding</SectionKicker>
      <SectionTitle>Be one of the first 1,000</SectionTitle>
      <p className="mt-4 text-[15px] md:text-[16px] text-[#111]/60 font-medium max-w-md mx-auto leading-relaxed">
        No spam. One email when the doors open, from a human in Athens.
      </p>

      {joined ? (
        <div role="status" className="mt-8 inline-flex items-center gap-3 rounded-2xl bg-[#F2F6EE] px-6 py-4">
          <span className="w-8 h-8 rounded-full bg-[#9DB18F] flex items-center justify-center"><Check size={15} strokeWidth={3} className="text-white" /></span>
          <span className="text-[15px] font-bold text-[#111]">You are on the list. See you at the premiere.</span>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto" noValidate>
          <label htmlFor="waitlist-email" className="sr-only">Email</label>
          <input
            id="waitlist-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-2xl bg-white border border-[#EADFCE] px-5 py-3.5 text-[15px] font-semibold text-[#111] placeholder:text-[#111]/30 shadow-[0_10px_30px_-12px_rgba(120,72,40,0.25)]"
            aria-invalid={!!error}
            aria-describedby={error ? 'waitlist-error' : undefined}
          />
          <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E85D2A] text-white font-extrabold text-[15px] px-7 py-3.5 shadow-[0_14px_34px_-10px_rgba(232,93,42,0.55)] hover:bg-[#C94A1D] transition-colors">
            Join <ArrowRight size={15} strokeWidth={2.8} />
          </button>
        </form>
      )}
      {error && <p id="waitlist-error" className="mt-3 text-[13px] font-bold text-[#C94A1D]" role="alert">{error}</p>}

      <div className="mt-14 rounded-[26px] bg-[#FFE9DC]/60 border border-[#F3DECA] px-6 py-8 md:px-10">
        <div className="film-mono text-[9px] text-[#C2451A] mb-2">Make your pet the star</div>
        <p className="text-[15px] font-semibold text-[#111]/75 max-w-sm mx-auto leading-relaxed">
          Every good boy deserves a poster. Name the star, save it, hang it above the good couch.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
          <label htmlFor="poster-pet" className="sr-only">Pet name</label>
          <input
            id="poster-pet"
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            placeholder="Your pet's name"
            maxLength={24}
            className="rounded-2xl bg-white border border-[#EADFCE] px-5 py-3 text-[15px] font-semibold text-[#111] placeholder:text-[#111]/30 text-center"
          />
          <button onClick={() => setPosterOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-[#111] text-[#FBF7F2] font-extrabold text-[14px] px-6 py-3 hover:bg-black transition-colors">
            Make the poster
          </button>
        </div>
      </div>
      {posterOpen && <PosterModal petName={petName} onClose={() => setPosterOpen(false)} />}
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/* community wall                                                      */
/* ------------------------------------------------------------------ */
function Community() {
  return (
    <motion.section {...fadeUp} className="max-w-6xl mx-auto px-6 py-20 md:py-28" aria-label="Community wall">
      <div className="text-center">
        <SectionKicker>#fylosfriends</SectionKicker>
        <SectionTitle>The wall of very good dogs</SectionTitle>
        <p className="mt-4 text-[15px] text-[#111]/60 font-medium max-w-md mx-auto leading-relaxed">
          Set photography for now, honestly. Tag <span className="font-extrabold text-[#111]">@fylos.app</span> with your dog and the real wall begins.
        </p>
      </div>
      <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {COMMUNITY.map((c, i) => (
          <motion.figure
            key={c.id}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={`rounded-[24px] overflow-hidden bg-white shadow-[0_18px_44px_-16px_rgba(120,72,40,0.35)] border border-[#F0E4D8] ${i % 3 === 1 ? 'md:translate-y-6' : ''}`}
          >
            <div className="aspect-square overflow-hidden">
              <img src={c.crop} alt={`${c.pet} from ${c.city}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" style={{ objectPosition: c.pos }} />
            </div>
            <figcaption className="px-4 py-3">
              <div className="text-[14px] font-extrabold text-[#111] tracking-tight">{c.pet} <span className="text-[#111]/35 font-bold">· {c.city}</span></div>
              <div className="text-[12px] text-[#111]/50 font-semibold">{c.note}</div>
            </figcaption>
          </motion.figure>
        ))}
      </div>
      <div className="mt-10 text-center">
        <a
          href="https://instagram.com/fylos.app"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#111] text-[#FBF7F2] font-extrabold text-[14px] px-6 py-3.5 hover:bg-black transition-colors"
        >
          <Instagram size={16} /> Tag @fylos.app with your dog
        </a>
      </div>
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/* professionals                                                       */
/* ------------------------------------------------------------------ */
function Professionals() {
  const [form, setForm] = useState({ role: '', business: '', city: '', email: '', message: '' })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!form.role) errs.role = 'Pick your craft'
    if (!form.business.trim()) errs.business = 'Tell us the name'
    if (!form.city.trim()) errs.city = 'Which city?'
    if (!EMAIL_RE.test(form.email)) errs.email = 'That email looks off'
    setErrors(errs)
    if (Object.keys(errs).length) return
    // TODO: POST to the real professionals endpoint when it exists.
    setSent(true)
  }

  const field = 'w-full rounded-2xl bg-white border px-5 py-3.5 text-[15px] font-semibold text-[#111] placeholder:text-[#111]/30'

  return (
    <motion.section {...fadeUp} className="bg-[#111] text-[#FBF7F2] py-24 md:py-32" aria-label="For professionals">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-start">
        <div>
          <SectionKicker>For professionals</SectionKicker>
          <h2 className="film-serif font-semibold tracking-tight leading-[1.02] text-[clamp(30px,4.6vw,58px)] text-[#FBF7F2]">
            The walker in the mustard coat could be you
          </h2>
          <p className="mt-5 text-[15px] text-[#FBF7F2]/60 font-medium leading-relaxed max-w-md">
            Vets, groomers, trainers and walkers. Fair pay, kind clients, zero chasing invoices. Tell us who you are and we will reach out before launch.
          </p>
          <div className="mt-8 rounded-[26px] overflow-hidden border border-white/10 max-w-md">
            <img src="/film/pro.jpg" alt="The walker in the mustard coat with three dogs in the park" loading="lazy" className="w-full aspect-[16/10] object-cover" style={{ objectPosition: '50% 42%' }} />
          </div>
          <div className="mt-6"><EarningsSlider /></div>
        </div>

        {sent ? (
          <div role="status" className="rounded-[26px] bg-[#FBF7F2] text-[#111] p-8 text-center self-center">
            <span className="mx-auto w-12 h-12 rounded-full bg-[#9DB18F] flex items-center justify-center"><Check size={22} strokeWidth={3} className="text-white" /></span>
            <div className="film-serif text-[26px] font-semibold mt-4">Lovely. You are in the loop.</div>
            <p className="text-[14px] text-[#111]/55 font-semibold mt-2">We read every single one.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="pro-role" className="sr-only">Your craft</label>
              <select id="pro-role" value={form.role} onChange={set('role')} className={`${field} ${errors.role ? 'border-[#E85D2A]' : 'border-transparent'}`} aria-invalid={!!errors.role}>
                <option value="">What do you do?</option>
                <option value="vet">Veterinarian</option>
                <option value="groomer">Groomer</option>
                <option value="trainer">Trainer</option>
                <option value="walker">Walker</option>
              </select>
              {errors.role && <p className="text-[12px] font-bold text-[#E85D2A] mt-1.5 ml-2" role="alert">{errors.role}</p>}
            </div>
            <div>
              <label htmlFor="pro-business" className="sr-only">Business name</label>
              <input id="pro-business" type="text" value={form.business} onChange={set('business')} placeholder="Business name" className={`${field} ${errors.business ? 'border-[#E85D2A]' : 'border-transparent'}`} aria-invalid={!!errors.business} />
              {errors.business && <p className="text-[12px] font-bold text-[#E85D2A] mt-1.5 ml-2" role="alert">{errors.business}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="pro-city" className="sr-only">City</label>
                <input id="pro-city" type="text" value={form.city} onChange={set('city')} placeholder="City" className={`${field} ${errors.city ? 'border-[#E85D2A]' : 'border-transparent'}`} aria-invalid={!!errors.city} />
                {errors.city && <p className="text-[12px] font-bold text-[#E85D2A] mt-1.5 ml-2" role="alert">{errors.city}</p>}
              </div>
              <div>
                <label htmlFor="pro-email" className="sr-only">Email</label>
                <input id="pro-email" type="email" value={form.email} onChange={set('email')} placeholder="Email" className={`${field} ${errors.email ? 'border-[#E85D2A]' : 'border-transparent'}`} aria-invalid={!!errors.email} />
                {errors.email && <p className="text-[12px] font-bold text-[#E85D2A] mt-1.5 ml-2" role="alert">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="pro-message" className="sr-only">Message</label>
              <textarea id="pro-message" value={form.message} onChange={set('message')} placeholder="Anything we should know? (optional)" rows={4} className={`${field} border-transparent resize-none`} />
            </div>
            <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E85D2A] text-white font-extrabold text-[15px] py-4 shadow-[0_14px_34px_-10px_rgba(232,93,42,0.45)] hover:bg-[#C94A1D] transition-colors">
              Say hello <ArrowRight size={15} strokeWidth={2.8} />
            </button>
          </form>
        )}
      </div>
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/* subscriptions: free now, Plus later, Stripe ready                   */
/* ------------------------------------------------------------------ */
const PLANS = [
  {
    id: 'companion',
    stripePriceId: null, // free forever, no Stripe object needed
    name: 'The Companion',
    price: 'Free',
    note: 'for every pet parent',
    features: ['Health records and documents', 'Reminders that actually remind', 'Walks with vetted pros', 'Memories, safely kept'],
    cta: 'Join the waitlist',
    highlight: true,
  },
  {
    id: 'plus',
    stripePriceId: 'price_TODO_fylos_plus', // TODO: real Stripe price id at launch
    name: 'Fylos Plus',
    price: 'Coming after launch',
    note: 'more room, more magic',
    features: ['Everything in The Companion', 'More of everything that matters', 'Details when it is real, not before'],
    cta: 'Waiting patiently',
    highlight: false,
  },
]

function Subscriptions() {
  return (
    <motion.section {...fadeUp} className="max-w-5xl mx-auto px-6 py-24 md:py-32" aria-label="Pricing">
      <div className="text-center">
        <SectionKicker>The price of peace</SectionKicker>
        <SectionTitle>The companion is free</SectionTitle>
      </div>
      <div className="mt-12 grid md:grid-cols-2 gap-5 md:gap-6 max-w-3xl mx-auto">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-[26px] p-7 md:p-8 border ${plan.highlight
              ? 'bg-white border-[#F0E4D8] shadow-[0_24px_60px_-20px_rgba(120,72,40,0.4)]'
              : 'bg-[#FFE9DC]/45 border-[#F3DECA]'}`}
          >
            <div className="flex items-baseline justify-between">
              <div className="text-[18px] font-extrabold tracking-tight text-[#111]">{plan.name}</div>
              {plan.highlight && <span className="film-mono text-[8px] text-[#C2451A]">Launch plan</span>}
            </div>
            <div className={`film-serif font-semibold tracking-tight mt-3 ${plan.highlight ? 'text-[34px] text-[#E85D2A]' : 'text-[22px] text-[#111]/70'}`}>{plan.price}</div>
            <div className="text-[13px] text-[#111]/45 font-semibold">{plan.note}</div>
            <ul className="mt-5 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-[14px] font-semibold text-[#111]/75">
                  <Check size={15} strokeWidth={3} className={`mt-0.5 shrink-0 ${plan.highlight ? 'text-[#E85D2A]' : 'text-[#111]/30'}`} /> {f}
                </li>
              ))}
            </ul>
            {plan.highlight ? (
              <a
                href="#after-film"
                className="mt-7 w-full inline-flex items-center justify-center rounded-2xl font-extrabold text-[14px] py-3.5 transition-colors bg-[#E85D2A] text-white hover:bg-[#C94A1D] shadow-[0_14px_34px_-10px_rgba(232,93,42,0.55)]"
              >
                {plan.cta}
              </a>
            ) : (
              <span className="mt-7 w-full inline-flex items-center justify-center rounded-2xl font-extrabold text-[14px] py-3.5 bg-white/60 text-[#111]/45">
                {plan.cta}
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.section>
  )
}

/* ------------------------------------------------------------------ */
/* faq + footer                                                        */
/* ------------------------------------------------------------------ */
function Faq() {
  return (
    <motion.section {...fadeUp} className="max-w-2xl mx-auto px-6 pb-24 md:pb-32" aria-label="Frequently asked questions">
      <div className="text-center mb-10">
        <SectionKicker>Small print, big heart</SectionKicker>
        <SectionTitle>Questions, answered</SectionTitle>
      </div>
      <div className="space-y-3">
        {FAQ.map((item) => (
          <details key={item.q} className="group rounded-[22px] bg-white border border-[#F0E4D8] px-6 py-1 open:pb-5 transition-all">
            <summary className="cursor-pointer list-none py-4 flex items-center justify-between gap-4 text-[15px] font-extrabold text-[#111] tracking-tight">
              {item.q}
              <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE9DC] text-[#E85D2A] flex items-center justify-center text-[16px] font-bold group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-[14px] leading-relaxed text-[#111]/60 font-medium pr-8">{item.a}</p>
          </details>
        ))}
      </div>
    </motion.section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[#111]/8 bg-[#FBF7F2]" aria-label="Footer">
      <div className="max-w-6xl mx-auto px-6 py-14 pb-28 md:pb-32 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <div className="film-serif text-[24px] font-semibold text-[#111] tracking-tight">Fylos<span className="text-[#E85D2A]">.</span></div>
          <div className="text-[13px] text-[#111]/45 font-semibold mt-1">Designed in Athens. Built for the world.</div>
        </div>
        <div className="flex items-center gap-3">
          <a href="https://instagram.com/fylos.app" target="_blank" rel="noreferrer" aria-label="Fylos on Instagram" className="w-10 h-10 rounded-full bg-white border border-[#F0E4D8] flex items-center justify-center text-[#111] hover:text-[#E85D2A] transition-colors">
            <Instagram size={16} />
          </a>
          <a href="mailto:hello@fylos.app" aria-label="Email Fylos" className="w-10 h-10 rounded-full bg-white border border-[#F0E4D8] flex items-center justify-center text-[#111] hover:text-[#E85D2A] transition-colors">
            <Mail size={16} />
          </a>
          <a href="mailto:hello@fylos.app" className="text-[13px] font-extrabold text-[#111]/60 hover:text-[#E85D2A] transition-colors">hello@fylos.app</a>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
export default function AfterFilm({ petName, setPetName }) {
  return (
    <div id="after-film" className="relative z-[55] bg-[#FBF7F2] pt-10">
      <Waitlist petName={petName} setPetName={setPetName} />
      <Community />
      <Professionals />
      <Subscriptions />
      <Faq />
      <Footer />
    </div>
  )
}
