import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionTemplate, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import './film.css'
import { CHAPTERS, STRIP, FILM_TITLE_PREFIX, DEFAULT_STAR, CREDITS_PETS, RUNTIME_SECONDS, formatTimecode } from './data'
import { PhoneDemo, WalkDemo, CareDemo, EarningsSlider } from './demos'
import AfterFilm from './AfterFilm'

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
const SEGS = CHAPTERS.length + 1 // six chapters + the FIN tail
const seg = (i) => [i / SEGS, (i + 1) / SEGS]
const W = 1 / SEGS
const TW = 0.55 * W * 0.5 // half width of a handover: long overlaps, no hard cuts

function usePetName() {
  const [petName, setPetName] = useState(() => {
    try {
      const fromUrl = new URLSearchParams(window.location.search).get('pet')
      if (fromUrl) return fromUrl.slice(0, 24)
      return localStorage.getItem('fylos.film.pet') || ''
    } catch {
      return ''
    }
  })
  const update = useCallback((name) => {
    const clean = name.slice(0, 24)
    setPetName(clean)
    try {
      if (clean) {
        localStorage.setItem('fylos.film.pet', clean)
        const url = new URL(window.location.href)
        url.searchParams.set('pet', clean)
        window.history.replaceState({}, '', url)
      } else {
        localStorage.removeItem('fylos.film.pet')
        const url = new URL(window.location.href)
        url.searchParams.delete('pet')
        window.history.replaceState({}, '', url)
      }
    } catch { /* private mode etc, the name still lives in state */ }
  }, [])
  return [petName, update]
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const fn = (e) => setMobile(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return mobile
}

const FONTS_HREF = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Space+Mono:wght@400;700&display=swap'

function useFilmMeta(title) {
  useEffect(() => {
    // fonts as early <link>s (non blocking, display=swap) instead of a CSS @import
    if (!document.head.querySelector(`link[href="${FONTS_HREF}"]`)) {
      const pre1 = Object.assign(document.createElement('link'), { rel: 'preconnect', href: 'https://fonts.googleapis.com' })
      const pre2 = Object.assign(document.createElement('link'), { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' })
      const css = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: FONTS_HREF })
      document.head.append(pre1, pre2, css)
    }
    const prevTitle = document.title
    document.title = title
    const metas = [
      ['property', 'og:title', title],
      ['property', 'og:description', 'Health, walks, memories. A second brain for pet parents, told as a small stop motion film.'],
      ['property', 'og:image', `${window.location.origin}/film/og.jpg`],
      ['property', 'og:type', 'website'],
      ['name', 'description', 'Fylos is the second brain for pet parents: health records, reminders, documents, walks with vetted pros and memories, in one calm place.'],
      ['name', 'twitter:card', 'summary_large_image'],
    ]
    const created = metas.map(([attr, key, content]) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`)
      const mine = !el
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      const prev = el.getAttribute('content')
      el.setAttribute('content', content)
      return { el, mine, prev }
    })
    return () => {
      document.title = prevTitle
      created.forEach(({ el, mine, prev }) => {
        if (mine) el.remove()
        else if (prev != null) el.setAttribute('content', prev)
      })
    }
  }, [title])
}

/* ------------------------------------------------------------------ */
/* one scene layer with a continuous camera:                           */
/* settle in, drift, then push INTO the scene's focus point            */
/* ------------------------------------------------------------------ */
function SceneLayer({ chapter, index, filmProgress, active, isMobile, reduced, videosAllowed }) {
  const [start, end] = seg(index)
  const videoRef = useRef(null)
  const [videoReady, setVideoReady] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)

  const first = index === 0
  const last = index === CHAPTERS.length - 1

  const opacity = useTransform(
    filmProgress,
    first
      ? [0, end - TW, end + TW]
      : last
        ? [start - TW, start + TW, 1]
        : [start - TW, start + TW, end - TW, end + TW],
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0],
  )

  // the camera: incoming settles from close-up, drifts, then dives into the focus
  const zoomK = reduced ? 0 : isMobile ? 0.55 : 1
  const entryScale = useTransform(
    filmProgress,
    first ? [0, end - TW] : [start - TW, start + TW, Math.max(start + TW + 0.001, end - TW)],
    first ? [1 + 0.05 * zoomK, 1 + 0.015 * zoomK] : [1 + 0.34 * zoomK, 1 + 0.10 * zoomK, 1 + 0.03 * zoomK],
  )
  const driftY = useTransform(
    filmProgress,
    [first ? 0 : start + TW, last ? 1 : end - TW],
    reduced ? ['0%', '0%'] : ['1.4%', '-1.4%'],
  )
  const hasExit = !!chapter.focus && !reduced
  const exitScale = useTransform(
    filmProgress,
    [end - TW, end, end + TW],
    hasExit ? [1, 1 + 0.14 * zoomK, 1 + 0.62 * zoomK] : [1, 1, 1],
  )

  const wantVideo = !isMobile && !reduced && !videoFailed && videosAllowed
  const near = Math.abs(active - index) <= 1

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active === index && videosAllowed) {
      const p = v.play()
      // an interrupted play() (fast scroll-past) is benign; real failures come through onError
      if (p) p.catch((err) => { if (err?.name !== 'AbortError') setVideoFailed(true) })
    } else {
      v.pause()
    }
  }, [active, index, videoReady, videosAllowed])

  const still = isMobile && chapter.imageMobile ? chapter.imageMobile : chapter.image

  return (
    <motion.div className="absolute inset-0" style={{ opacity, zIndex: index }} aria-hidden="true">
      <div className="absolute inset-0" style={{ background: chapter.placeholder }} />
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{ scale: exitScale, transformOrigin: chapter.focus ? `${chapter.focus.x}% ${chapter.focus.y}%` : '50% 50%' }}
      >
        <motion.div className="absolute inset-0 will-change-transform" style={{ scale: entryScale, y: driftY }}>
          {!imgFailed && (near || first) && (
            <img
              src={still}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading={first ? 'eager' : 'lazy'}
              fetchpriority={first ? 'high' : 'auto'}
              decoding={first ? 'sync' : 'async'}
              onError={() => setImgFailed(true)}
              draggable={false}
            />
          )}
          {wantVideo && near && (
            <video
              ref={videoRef}
              src={chapter.video}
              muted
              loop
              playsInline
              preload={active === index ? 'auto' : 'metadata'}
              onLoadStart={() => setVideoReady(false)}
              onCanPlay={() => setVideoReady(true)}
              onError={() => setVideoFailed(true)}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
              style={{ opacity: videoReady ? 1 : 0 }}
              tabIndex={-1}
            />
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* the coral ball leads the eye between scenes                         */
/* ------------------------------------------------------------------ */
function TravellingBall({ filmProgress, isMobile }) {
  const flights = useMemo(() => {
    // one bouncing crossing per handover, alternating direction
    const list = []
    for (let i = 1; i <= CHAPTERS.length - 1; i++) {
      list.push({ b: i / SEGS, ltr: i % 2 === 1 })
    }
    return list
  }, [])

  const bw = TW * 1.15
  const keys = { x: [[0], ['-8vw']], y: [[0], ['80vh']], r: [[0], [0]], s: [[0], [1]], o: [[0], [0]] }
  // build combined keyframe tracks across every flight window
  const xs = [], xv = [], ys = [], yv = [], rs = [], rv = [], os = [], ov = [], ss = [], sv = []
  flights.forEach(({ b, ltr }) => {
    const t = [b - bw, b - bw * 0.55, b - bw * 0.15, b + bw * 0.25, b + bw * 0.65, b + bw]
    const xTrack = ltr
      ? ['-8vw', '16vw', '42vw', '64vw', '86vw', '108vw']
      : ['108vw', '84vw', '58vw', '36vw', '14vw', '-8vw']
    const yTrack = ['76vh', '42vh', '78vh', '44vh', '80vh', '66vh']
    const rTrack = ltr ? [0, 190, 380, 560, 740, 920] : [0, -190, -380, -560, -740, -920]
    const sTrack = [1, 1.02, 0.74, 1.02, 0.74, 1]
    const oTrack = [0, 1, 1, 1, 1, 0]
    xs.push(...t); xv.push(...xTrack)
    ys.push(...t); yv.push(...yTrack)
    rs.push(...t); rv.push(...rTrack)
    ss.push(...t); sv.push(...sTrack)
    os.push(...t); ov.push(...oTrack)
  })

  const x = useTransform(filmProgress, xs, xv)
  const y = useTransform(filmProgress, ys, yv)
  const rotate = useTransform(filmProgress, rs, rv)
  const scaleY = useTransform(filmProgress, ss, sv)
  const opacity = useTransform(filmProgress, os, ov)

  const size = isMobile ? 44 : 72

  return (
    <motion.div
      className="absolute z-[38] pointer-events-none will-change-transform"
      style={{ x, y, rotate, scaleY, opacity, width: size, height: size, top: 0, left: 0 }}
      aria-hidden="true"
    >
      <img
        src="/film/ball.png"
        alt=""
        width={size}
        height={size}
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 14px 18px rgba(60,30,10,0.35))' }}
        draggable={false}
        onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement.classList.add('film-ball-css') }}
      />
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* chapter marker gliding through the frame edge during a handover     */
/* ------------------------------------------------------------------ */
function ChapterMarker({ index, filmProgress }) {
  const b = index / SEGS
  const bw = TW * 1.4
  const chapter = CHAPTERS[index]
  const y = useTransform(filmProgress, [b - bw, b + bw], ['58vh', '-58vh'])
  const opacity = useTransform(filmProgress, [b - bw, b - bw * 0.4, b + bw * 0.4, b + bw], [0, 1, 1, 0])
  const dark = chapter.dark

  return (
    <motion.div
      className="absolute right-5 md:right-9 top-1/2 z-[36] pointer-events-none select-none"
      style={{ y, opacity, writingMode: 'vertical-rl' }}
      aria-hidden="true"
    >
      <span className={`film-mono text-[9px] md:text-[10px] ${dark ? 'text-[#FBF7F2]/80' : 'text-[#111]/60'}`}>
        {chapter.numeral} &nbsp;·&nbsp; {chapter.label}
      </span>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* light bloom breathing at every handover: film exposure, not a cut   */
/* ------------------------------------------------------------------ */
function BloomOverlay({ filmProgress }) {
  const { keys, vals } = useMemo(() => {
    const keys = [0], vals = [0]
    for (let i = 1; i <= CHAPTERS.length - 1; i++) {
      const b = i / SEGS
      keys.push(b - TW, b, b + TW)
      vals.push(0, 0.32, 0)
    }
    return { keys, vals }
  }, [])
  const opacity = useTransform(filmProgress, keys, vals)
  return (
    <motion.div
      className="absolute inset-0 z-[15] pointer-events-none"
      style={{
        opacity,
        background: 'radial-gradient(90% 70% at 50% 45%, rgba(255,244,230,0.95) 0%, rgba(255,238,220,0.5) 45%, rgba(255,233,214,0) 78%)',
      }}
      aria-hidden="true"
    />
  )
}

/* ------------------------------------------------------------------ */
/* a statement that assembles word by word as the film advances        */
/* ------------------------------------------------------------------ */
function Word({ token, local, t0 }) {
  const opacity = useTransform(local, [t0, t0 + 0.07], [0, 1])
  const y = useTransform(local, [t0, t0 + 0.09], ['0.8em', '0em'])
  const blur = useTransform(local, [t0, t0 + 0.09], [7, 0])
  const filter = useMotionTemplate`blur(${blur}px)`
  return (
    <motion.span style={{ opacity, y, filter }} className={`inline-block will-change-transform ${token.accent ? 'italic text-[#E85D2A] font-medium pr-[0.06em]' : ''}`}>
      {token.text}&nbsp;
    </motion.span>
  )
}

function WordStatement({ chapter, local, isMobile }) {
  const tokens = useMemo(() =>
    chapter.statement.split(' ').map((raw) => {
      const accent = raw.startsWith('*')
      return { text: raw.replace(/\*/g, ''), accent }
    }), [chapter.statement])

  const stagger = Math.min(0.035, 0.26 / tokens.length)
  const blockOpacity = useTransform(local, [0.06, 0.12, 0.86, 0.97], [0, 1, 1, 0])
  const blockY = useTransform(local, [0.08, 0.3, 0.92], [40, 0, -70])
  const kickerOpacity = useTransform(local, [0.08, 0.14, 0.86, 0.95], [0, 1, 1, 0])
  const ruleScale = useTransform(local, [0.09, 0.2], [0, 1])

  const align = isMobile ? 'center' : (chapter.align || 'center')
  const pos = align === 'center'
    ? 'inset-x-0 top-[13vh] mx-auto text-center items-center'
    : align === 'left'
      ? 'left-[6vw] top-[13vh] text-left items-start'
      : 'right-[6vw] top-[13vh] text-right items-end'
  const measure = align === 'center' ? 'max-w-[16ch] mx-auto' : 'max-w-[8ch]'

  return (
    <motion.div style={{ opacity: blockOpacity, y: blockY }} className={`absolute ${pos} flex flex-col px-6 md:px-0`}>
      <motion.div style={{ opacity: kickerOpacity }} className="flex items-center gap-2.5 mb-4 md:mb-5 whitespace-nowrap">
        <motion.span style={{ scaleX: ruleScale }} className={`inline-block h-[2px] w-7 origin-left shrink-0 ${chapter.dark ? 'bg-[#FBF7F2]/70' : 'bg-[#E85D2A]'}`} />
        <span className={`film-mono text-[8.5px] md:text-[9.5px] ${chapter.dark ? 'text-[#FBF7F2]/70' : 'text-[#C2451A]'}`}>
          Chapter {chapter.numeral} · {chapter.label}
        </span>
      </motion.div>
      <h2
        className={`film-serif font-semibold leading-[1.02] tracking-tight text-[clamp(31px,5.4vw,80px)] ${measure} ${chapter.dark ? 'text-[#FBF7F2]' : 'text-[#221C17]'}`}
        style={{ textShadow: chapter.dark ? '0 2px 30px rgba(0,0,0,0.5)' : '0 2px 30px rgba(251,247,242,0.9)' }}
      >
        {tokens.map((token, k) => (
          <Word key={`${token.text}-${k}`} token={token} local={local} t0={0.11 + k * stagger} />
        ))}
      </h2>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* floating chips that fly in from the wings                           */
/* ------------------------------------------------------------------ */
function PaperChip({ chip, i, local }) {
  const fromLeft = chip.side === 'left'
  const t0 = 0.18 + i * 0.09
  const x = useTransform(local, [t0, t0 + 0.22], [fromLeft ? -420 : 420, 0], { clamp: true })
  const opacity = useTransform(local, [t0, t0 + 0.16, 0.9, 1], [0, 1, 1, 0])
  const rotate = useTransform(local, [t0, t0 + 0.22], [fromLeft ? -9 : 9, fromLeft ? -2.5 : 2.5], { clamp: true })
  const y = useTransform(local, [0, 1], [16 * (i + 1), -22 * (i + 1)])

  return (
    <motion.div
      style={{ x, y, rotate, opacity }}
      className={`absolute ${fromLeft ? 'left-[4vw] md:left-[7vw]' : 'right-[4vw] md:right-[7vw]'}`}
      aria-hidden="true"
    >
      <div
        className="rounded-xl bg-[#FFFDF9] border border-[#EADFCE] px-4 py-3 shadow-[0_16px_40px_-14px_rgba(120,72,40,0.5)]"
        style={{ marginTop: `${18 + i * 64}px`, transform: `rotate(${fromLeft ? -1.2 : 1.4}deg)` }}
      >
        <div className="text-[13px] font-extrabold text-[#111] tracking-tight">{chip.title}</div>
        <div className="film-mono text-[8px] text-[#C2451A] mt-1">{chip.meta}</div>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/* per chapter overlay: statement + optional demo + chips              */
/* ------------------------------------------------------------------ */
function ChapterOverlay({ chapter, index, filmProgress, petName, isMobile }) {
  const [start, end] = seg(index)
  const local = useTransform(filmProgress, [start, end], [0, 1], { clamp: true })
  const demoY = useTransform(local, [0.12, 0.34], [120, 0], { clamp: true })
  const demoTilt = useTransform(local, [0.12, 0.34, 1], [10, 0, -4], { clamp: true })
  const demoOpacity = useTransform(local, [0.12, 0.3, 0.92, 1], [0, 1, 1, 0])
  const demoVisibility = useTransform(demoOpacity, (v) => (v < 0.03 ? 'hidden' : 'visible'))

  const demoSide = chapter.demo === 'phone' ? 'left' : chapter.demo === 'walk' ? 'right' : 'left'

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 + index }}>
      {chapter.statement && <WordStatement chapter={chapter} local={local} isMobile={isMobile} />}

      {chapter.chips && !isMobile && chapter.chips.map((chip, i) => (
        <PaperChip key={chip.title} chip={chip} i={i} local={local} />
      ))}

      {chapter.demo && (
        <motion.div
          style={{ opacity: demoOpacity, y: demoY, rotateY: demoTilt, perspective: 1200, visibility: demoVisibility }}
          className={`absolute pointer-events-auto ${
            isMobile
              ? 'inset-x-0 bottom-[16vh] flex justify-center'
              : demoSide === 'left'
                ? 'left-[7vw] top-1/2 -translate-y-1/2'
                : 'right-[7vw] top-1/2 -translate-y-1/2'
          }`}
        >
          {chapter.demo === 'phone' && <PhoneDemo progress={local} petName={petName || 'Leo'} />}
          {chapter.demo === 'walk' && <WalkDemo progress={local} />}
          {chapter.demo === 'care' && <CareDemo progress={local} petName={petName || 'Leo'} />}
        </motion.div>
      )}

      {chapter.demo === 'care' && !isMobile && (
        <motion.div
          style={{ opacity: demoOpacity, y: demoY, visibility: demoVisibility }}
          className="absolute pointer-events-auto right-[7vw] top-1/2 -translate-y-1/2"
        >
          <EarningsSlider />
        </motion.div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* FIN + scroll driven credits                                         */
/* ------------------------------------------------------------------ */
function FinAndCredits({ filmProgress, petName }) {
  const [start] = seg(CHAPTERS.length) // last segment
  const darken = useTransform(filmProgress, [start - 0.02, start + 0.035], [0, 1])
  const finOpacity = useTransform(filmProgress, [start + 0.01, start + 0.045, start + 0.085, start + 0.105], [0, 1, 1, 0])
  const finScale = useTransform(filmProgress, [start + 0.01, start + 0.05], [0.96, 1])
  const creditsProgress = useTransform(filmProgress, [start + 0.1, 0.995], [0, 1], { clamp: true })
  const star = petName || DEFAULT_STAR

  // the roll is measured in px so it always starts just below the frame and
  // fully clears the list, whatever the viewport or the cast length
  const creditsRef = useRef(null)
  const [creditsSpan, setCreditsSpan] = useState({ from: 560, to: -1500 })
  useEffect(() => {
    const measure = () => {
      const h = creditsRef.current?.offsetHeight || 1300
      setCreditsSpan({ from: window.innerHeight * 0.62, to: -(h + 60) })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const creditsY = useTransform(creditsProgress, [0, 1], [creditsSpan.from, creditsSpan.to])

  // restart the period pop when FIN actually appears, not on page mount
  const [finOn, setFinOn] = useState(false)
  useMotionValueEvent(finOpacity, 'change', (v) => setFinOn(v > 0.5))

  return (
    <>
      <motion.div className="absolute inset-0 z-30 bg-[#0E0B09] pointer-events-none" style={{ opacity: darken }} aria-hidden="true" />
      <motion.div className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none" style={{ opacity: finOpacity, scale: finScale }}>
        <p className="film-serif text-[#FBF7F2] font-semibold tracking-tight text-[clamp(34px,6vw,84px)] text-center px-6">
          Stress less. Fylos more<span key={finOn ? 'on' : 'off'} className="text-[#E85D2A]" style={{ display: 'inline-block', animation: finOn ? 'film-period 0.7s 0.15s cubic-bezier(0.22,1.6,0.36,1) both' : 'none' }}>.</span>
        </p>
      </motion.div>
      <motion.div className="absolute inset-x-0 top-0 bottom-0 z-40 overflow-hidden pointer-events-none" style={{ opacity: useTransform(creditsProgress, [0, 0.03], [0, 1]) }} aria-hidden="true">
        <motion.div ref={creditsRef} style={{ y: creditsY }} className="text-center space-y-7">
          <div className="film-mono text-[10px] text-[#E85D2A]">Fin</div>
          <div className="space-y-2">
            <div className="film-mono text-[9px] text-[#FBF7F2]/45">The star</div>
            <div className="film-serif text-[30px] md:text-[40px] text-[#FBF7F2] font-semibold">{star}</div>
          </div>
          <div className="space-y-2">
            <div className="film-mono text-[9px] text-[#FBF7F2]/45">Also starring</div>
            {CREDITS_PETS.filter((p) => p.toLowerCase() !== star.toLowerCase()).map((p) => (
              <div key={p} className="film-serif text-[19px] md:text-[23px] text-[#FBF7F2]/85">{p}</div>
            ))}
          </div>
          <div className="space-y-2">
            <div className="film-mono text-[9px] text-[#FBF7F2]/45">Directed by</div>
            <div className="film-serif text-[22px] text-[#FBF7F2]">Every pet parent</div>
          </div>
          <div className="film-mono text-[9px] text-[#FBF7F2]/40 pb-10">A Fylos production · Athens</div>
        </motion.div>
      </motion.div>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* the opening: the letterbox parts like a curtain                     */
/* ------------------------------------------------------------------ */
function CurtainIntro({ onDone }) {
  return (
    <div className="fixed inset-0 z-[75] pointer-events-none" aria-hidden="true">
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: '-50.5vh' }}
        transition={{ delay: 0.35, duration: 1.0, ease: [0.83, 0, 0.17, 1] }}
        className="absolute inset-x-0 top-0 h-[50.25vh] bg-[#FBF7F2]"
        onAnimationComplete={onDone}
      />
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: '50.5vh' }}
        transition={{ delay: 0.35, duration: 1.0, ease: [0.83, 0, 0.17, 1] }}
        className="absolute inset-x-0 bottom-0 h-[50.25vh] bg-[#FBF7F2]"
      />
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center"
      >
        <span className="film-mono text-[10px] text-[#111]/70">
          FYLOS <span className="lowercase italic film-serif tracking-normal text-[#111]/60">presents</span> —
        </span>
      </motion.div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* hero title that assembles letter by letter, once                    */
/* ------------------------------------------------------------------ */
function LetterTitle({ text, animate }) {
  if (!animate) return <>{text}</>
  let i = 0
  return (
    <>
      {text.split('').map((ch, k) => (
        <span key={k} className="film-letter" style={{ '--i': i++ }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------ */
/* a quiet companion cursor (fine pointers only)                       */
/* ------------------------------------------------------------------ */
function CursorDot() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return
    let mx = -100, my = -100, rx = -100, ry = -100, raf, hot = false, seen = false
    const move = (e) => {
      mx = e.clientX; my = e.clientY
      if (!seen) { seen = true; rx = mx; ry = my; dot.style.opacity = ring.style.opacity = '1' }
    }
    const over = (e) => {
      hot = !!e.target.closest?.('a, button, input, select, textarea, summary, [role="button"], [type="range"]')
      ring.style.width = ring.style.height = hot ? '46px' : '26px'
      ring.style.borderColor = hot ? 'rgba(232,93,42,0.9)' : 'rgba(232,93,42,0.45)'
    }
    const tick = () => {
      rx += (mx - rx) * 0.16
      ry += (my - ry) * 0.16
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', move, { passive: true })
    window.addEventListener('mouseover', over, { passive: true })
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="film-cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="film-cursor-ring" aria-hidden="true" />
    </>
  )
}

/* ------------------------------------------------------------------ */
/* the page                                                            */
/* ------------------------------------------------------------------ */
function Timecode({ progress }) {
  // per-frame state lives in this leaf so the rest of the tree never re-renders with it
  const [tc, setTc] = useState('00:00:00:00 · FR 000000')
  useMotionValueEvent(progress, 'change', (v) => {
    const fr = String(Math.floor(Math.max(0, Math.min(1, v)) * RUNTIME_SECONDS * 24)).padStart(6, '0')
    setTc(`${formatTimecode(v)} · FR ${fr}`)
  })
  return <>{tc}</>
}

export default function WebsiteFilm() {
  const reduced = useReducedMotion()
  const isMobile = useIsMobile()
  const [petName, setPetName] = usePetName()
  const filmRef = useRef(null)
  const [activeScene, setActiveScene] = useState(0) // 0..5 chapters, 6 = FIN (all videos rest)
  const [chapterLabel, setChapterLabel] = useState('')
  const [videosAllowed, setVideosAllowed] = useState(false)
  const [curtain, setCurtain] = useState(() => {
    try { return window.scrollY < 8 } catch { return true }
  })
  const [hasNamed, setHasNamed] = useState(false)

  const filmTitle = `${FILM_TITLE_PREFIX} ${petName || DEFAULT_STAR}`
  useFilmMeta(`Fylos · ${filmTitle}`)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = isMobile ? '/film/scene-01-m.jpg' : '/film/scene-01.jpg'
    link.fetchPriority = 'high'
    document.head.appendChild(link)
    return () => link.remove()
  }, [isMobile])

  // let the LCP hero image land before any video bytes start flowing
  useEffect(() => {
    let t
    const arm = () => { t = setTimeout(() => setVideosAllowed(true), 900) }
    if (document.readyState === 'complete') arm()
    else window.addEventListener('load', arm, { once: true })
    return () => { clearTimeout(t); window.removeEventListener('load', arm) }
  }, [])

  const { scrollYProgress } = useScroll({ target: filmRef, offset: ['start start', 'end end'] })
  const filmProgress = useSpring(scrollYProgress, reduced ? { stiffness: 1000, damping: 100 } : { stiffness: 120, damping: 28, mass: 0.4 })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(SEGS - 1, Math.floor(v * SEGS)) // 6 = FIN sentinel, pauses every scene
    setActiveScene(idx)
    const labelIdx = Math.min(CHAPTERS.length - 1, idx)
    setChapterLabel(v < 0.5 / SEGS || v > 0.985 ? '' : CHAPTERS[labelIdx].label)
  })

  // the top band breathes: tall on the title card, slim once the film runs
  const bandH = useTransform(filmProgress, [0, 0.6 / SEGS], isMobile ? [148, 64] : [172, 76])
  const titleSize = useTransform(filmProgress, [0, 0.6 / SEGS], isMobile ? [30, 16] : [60, 24])
  const titleFontSize = useTransform(titleSize, (v) => `${v}px`)
  const inputOpacity = useTransform(filmProgress, [0, 0.35 / SEGS], [1, 0])
  const inputHeight = useTransform(filmProgress, [0, 0.35 / SEGS], [36, 0])
  const inputVisibility = useTransform(inputOpacity, (v) => (v < 0.03 ? 'hidden' : 'visible'))
  const arrowOpacity = useTransform(filmProgress, [0, 0.3 / SEGS], [1, 0])
  const chapterOpacity = useTransform(filmProgress, [0.5 / SEGS, 0.8 / SEGS], [0, 1])
  const progressScaleX = filmProgress

  const filmHeightVh = SEGS * (isMobile ? 150 : 185)
  const letterAnimate = !reduced && !hasNamed

  return (
    <div className="film-root relative">
      <a
        href="#after-film"
        className="sr-only focus:not-sr-only focus:fixed focus:z-[90] focus:top-24 focus:left-6 focus:bg-[#111] focus:text-[#FBF7F2] focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-bold"
      >
        Skip the film
      </a>

      {!reduced && !isMobile && <CursorDot />}
      {curtain === true && !reduced && <CurtainIntro onDone={() => setCurtain(false)} />}

      {/* ---- top letterbox band ---- */}
      <motion.header
        style={{ height: bandH }}
        className="fixed top-0 inset-x-0 z-[60] bg-[#FBF7F2] border-b border-[#111]/5 flex flex-col items-center justify-center overflow-hidden"
      >
        <motion.div style={{ opacity: inputOpacity, height: inputHeight, visibility: inputVisibility }} className="absolute left-4 md:left-8 top-0 bottom-0 hidden md:flex items-center" aria-hidden="true">
          <span className="film-mono text-[8px] text-[#111]/40">A Fylos production</span>
        </motion.div>
        <motion.div style={{ opacity: inputOpacity, height: inputHeight, visibility: inputVisibility }} className="absolute right-4 md:right-8 top-0 bottom-0 hidden md:flex items-center" aria-hidden="true">
          <span className="film-mono text-[8px] text-[#111]/40">Athens · MMXXVI</span>
        </motion.div>
        <div className="film-mono text-[9px] md:text-[10px] text-[#111]/70">
          FYLOS <span className="lowercase italic film-serif tracking-normal text-[#111]/60">presents</span> —
        </div>
        <motion.h1
          style={{ fontSize: titleFontSize }}
          className="film-serif text-[#E85D2A] font-semibold tracking-tight leading-none text-center px-4 mt-1 whitespace-nowrap"
        >
          <LetterTitle text={filmTitle} animate={letterAnimate} />
        </motion.h1>
        <motion.div style={{ opacity: inputOpacity, height: inputHeight, visibility: inputVisibility }} className="mt-1 flex items-center gap-2 overflow-hidden">
          <label htmlFor="film-pet-input" className="film-mono text-[8px] text-[#111]/45">Name the star</label>
          <input
            id="film-pet-input"
            type="text"
            value={petName}
            onChange={(e) => { setHasNamed(true); setPetName(e.target.value) }}
            placeholder="Leo"
            maxLength={24}
            className="w-28 bg-transparent border-b-2 border-[#E85D2A]/40 focus:border-[#E85D2A] text-center text-[15px] font-bold text-[#111] placeholder:text-[#111]/25 pb-0.5 transition-colors"
          />
        </motion.div>
        <motion.div
          style={{ opacity: chapterOpacity }}
          className="absolute right-4 md:right-8 bottom-0 top-0 flex items-center"
          aria-hidden="true"
        >
          <span className="film-mono text-[8px] md:text-[9px] text-[#C2451A]">{chapterLabel}</span>
        </motion.div>
      </motion.header>

      {/* ---- bottom letterbox band ---- */}
      <footer className="fixed bottom-0 inset-x-0 z-[60] bg-[#FBF7F2] border-t border-[#111]/5" style={{ height: isMobile ? 52 : 64 }}>
        <div className="absolute top-0 inset-x-0 h-[3px] bg-[#111]/8">
          <motion.div className="h-full bg-[#E85D2A] origin-left" style={{ scaleX: progressScaleX }} />
          {CHAPTERS.map((c, i) => (
            <div key={c.id} className="absolute top-0 h-full w-[2px] bg-[#FBF7F2]" style={{ left: `${((i + 1) / SEGS) * 100}%` }} />
          ))}
        </div>
        <div className="h-full flex items-center justify-between px-4 md:px-8">
          <div className="film-mono text-[8px] md:text-[9.5px] text-[#C2451A] truncate pr-3">{isMobile ? 'HEALTH · WALKS · MEMORIES' : STRIP}</div>
          <motion.div style={{ opacity: arrowOpacity }} className="hidden md:flex items-center gap-3" aria-hidden="true">
            <span className="film-mono text-[8px] text-[#111]/45">Scroll to begin</span>
            <span className="flex items-center justify-center w-8 h-8 rounded-full border-[1.5px] border-[#E85D2A] text-[#E85D2A]">
              <ArrowDown size={14} strokeWidth={2.4} className="animate-bounce motion-reduce:animate-none" />
            </span>
          </motion.div>
          <div className="film-mono text-[8px] md:text-[9.5px] text-[#111]/60 tabular-nums" aria-hidden="true">TC <Timecode progress={scrollYProgress} /></div>
        </div>
      </footer>

      {/* ---- the film ---- */}
      <section ref={filmRef} style={{ height: `${filmHeightVh}vh` }} className="relative" aria-label={filmTitle}>
        <ol className="sr-only">
          {CHAPTERS.map((c) => (
            <li key={c.id}>Chapter {c.numeral}: {c.label}.{c.statement ? ` ${c.statement.replace(/\*/g, '')}` : ''}</li>
          ))}
          <li>Fin. Stress less. Fylos more.</li>
        </ol>
        <div className="sticky top-0 h-screen overflow-hidden film-grain">
          {CHAPTERS.map((c, i) => (
            <SceneLayer key={c.id} chapter={c} index={i} filmProgress={filmProgress} active={activeScene} isMobile={isMobile} reduced={reduced} videosAllowed={videosAllowed} />
          ))}
          <div className="absolute inset-0 z-[14] pointer-events-none film-vignette" aria-hidden="true" />
          <BloomOverlay filmProgress={filmProgress} />
          {CHAPTERS.map((c, i) => (
            <ChapterOverlay key={c.id} chapter={c} index={i} filmProgress={filmProgress} petName={petName} isMobile={isMobile} />
          ))}
          {!reduced && CHAPTERS.slice(1).map((c, i) => (
            <ChapterMarker key={c.id} index={i + 1} filmProgress={filmProgress} />
          ))}
          {!reduced && <TravellingBall filmProgress={filmProgress} isMobile={isMobile} />}
          <FinAndCredits filmProgress={filmProgress} petName={petName} />
        </div>
      </section>

      {/* ---- everything after the credits ---- */}
      <AfterFilm petName={petName} setPetName={setPetName} isMobile={isMobile} />
    </div>
  )
}
