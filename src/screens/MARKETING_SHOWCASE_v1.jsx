import React, { useState } from 'react'
import {
  ChevronRight, Heart, MapPin, Plus, Bell, Search, Settings,
  Home, Activity, Shield, MessageCircle, Camera, Bookmark,
  Globe, Apple, Calendar, ArrowUpRight, Star, Check,
  Instagram, Music2, Linkedin, Twitter, ChevronLeft, Play,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────────────────
//  FYLOS — Marketing Showcase
//  Single-page preview of the marketing assets defined in the plan.
//  Sections: Provenance · Waitlist · IG Profile · Friday Frame ·
//            Reel · Founder · Captions · Cultural Cheatsheet
// ─────────────────────────────────────────────────────────────────────

const PEACH = '#FFE9DC'
const PEACH_DEEP = '#FFD4BD'
const CORAL = '#E85D2A'
const CORAL_LIGHT = '#FF7240'
const CREAM = '#FBF7F2'
const INK = '#1A1A1F'
const MUTED = '#6E6E73'

const sectionPad = 'px-6 md:px-12 lg:px-20 py-16 md:py-24'

export default function MarketingShowcase() {
  return (
    <div
      style={{
        backgroundColor: CREAM,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        color: INK,
        WebkitFontSmoothing: 'antialiased',
        minHeight: '100vh',
      }}
    >
      <TopBar />
      <Hero />
      <Provenance />
      <WaitlistMockup />
      <InstagramProfile />
      <FridayFrameCarousel />
      <ReelFrame />
      <TikTokProfile />
      <FounderPoster />
      <CaptionLibrary />
      <CulturalCheatsheet />
      <Footer />
    </div>
  )
}

// ────────────────────────────────────────────
//  Top bar (preview only)
// ────────────────────────────────────────────
function TopBar() {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl"
         style={{ backgroundColor: 'rgba(251, 247, 242, 0.7)', borderBottom: `1px solid rgba(0,0,0,0.04)` }}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
               style={{ background: `linear-gradient(135deg, ${CORAL_LIGHT}, ${CORAL})` }}>
            <span style={{ color: 'white', fontSize: 13, fontWeight: 800 }}>f</span>
          </div>
          <span className="text-[15px] font-semibold tracking-tight">Fylos · Marketing Preview</span>
        </div>
        <div className="hidden md:flex gap-6 text-[13px]" style={{ color: MUTED }}>
          <a href="#waitlist" className="hover:text-black">Waitlist</a>
          <a href="#instagram" className="hover:text-black">Instagram</a>
          <a href="#friday-frame" className="hover:text-black">Friday Frame</a>
          <a href="#reel" className="hover:text-black">Reel</a>
          <a href="#tiktok" className="hover:text-black">TikTok</a>
          <a href="#captions" className="hover:text-black">Captions</a>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
//  Hero
// ────────────────────────────────────────────
function Hero() {
  return (
    <section className={sectionPad}>
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
             style={{ backgroundColor: PEACH, color: CORAL }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CORAL }} />
          <span className="text-[11px] font-semibold tracking-widest uppercase">Marketing Preview · v1</span>
        </div>
        <h1 className="text-[44px] md:text-[68px] leading-[1.02] font-semibold tracking-tight max-w-[920px]">
          A look at how <span style={{ color: CORAL }}>Fylos</span> introduces itself to the world.
        </h1>
        <p className="text-[17px] md:text-[19px] mt-6 max-w-[680px] leading-relaxed" style={{ color: MUTED }}>
          Switzerland first. Then Northern Europe. Then home to Greece.
          Each section below is a real marketing artifact — landing page, Instagram grid,
          carousels, Reels, founder posters, captions in EN / DE / FR / GR.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Pill label="🇨🇭 Phase 1 · Switzerland" active />
          <Pill label="🇩🇪 🇳🇱 🇸🇪 Phase 2 · Northern Europe" />
          <Pill label="🇬🇷 Phase 3 · Greece (homecoming)" />
        </div>
      </div>
    </section>
  )
}

function Pill({ label, active }) {
  return (
    <span
      className="px-3.5 py-2 rounded-full text-[12px] font-semibold border"
      style={{
        backgroundColor: active ? INK : 'white',
        color: active ? 'white' : INK,
        borderColor: active ? 'transparent' : 'rgba(0,0,0,0.06)',
      }}
    >
      {label}
    </span>
  )
}

// ────────────────────────────────────────────
//  Provenance — the brand statement
// ────────────────────────────────────────────
function Provenance() {
  return (
    <section className={sectionPad} style={{ backgroundColor: PEACH }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-[11px] font-bold uppercase tracking-[0.18em] mb-6" style={{ color: CORAL }}>
          Brand provenance
        </div>
        <h2 className="text-[40px] md:text-[64px] font-semibold leading-[1.05] tracking-tight max-w-[900px]">
          Designed in <span className="italic">Athens.</span><br />
          Built for <span style={{ color: CORAL }}>Zurich, Berlin, Amsterdam, Stockholm.</span>
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-[900px]">
          <ProvenanceCard
            title="Greek soul"
            body="Fylos = friend / guardian. Heritage as design DNA — not as target market."
          />
          <ProvenanceCard
            title="European premium"
            body="Apple Health vibe for the household that already owns an Apple Watch and an Aesop bottle."
          />
          <ProvenanceCard
            title="The product is the pitch"
            body="No hard sell. Every screen is a piece of marketing on its own."
          />
        </div>
      </div>
    </section>
  )
}

function ProvenanceCard({ title, body }) {
  return (
    <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-md"
         style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
      <div className="text-[14px] font-semibold mb-2">{title}</div>
      <p className="text-[14px] leading-relaxed" style={{ color: MUTED }}>{body}</p>
    </div>
  )
}

// ────────────────────────────────────────────
//  Waitlist landing page mockup
// ────────────────────────────────────────────
function WaitlistMockup() {
  return (
    <section id="waitlist" className={sectionPad}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="Asset · 01" title="Waitlist landing page" url="fylos.app" />

        {/* Browser frame */}
        <div className="mt-10 rounded-[24px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.08)]"
             style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          {/* Browser chrome */}
          <div className="flex items-center gap-2 px-4 py-3"
               style={{ backgroundColor: '#F2EFEA', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5F57' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FEBC2E' }} />
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28C840' }} />
            </div>
            <div className="ml-4 flex-1 max-w-md mx-auto px-3 py-1 rounded-md text-[12px] text-center"
                 style={{ backgroundColor: 'white', color: MUTED }}>
              🔒 fylos.app
            </div>
          </div>

          {/* Page content */}
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-0">
            {/* Left side */}
            <div className="p-12 lg:p-16" style={{ backgroundColor: CREAM }}>
              <div className="flex items-center gap-2 mb-10">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                     style={{ background: `linear-gradient(135deg, ${CORAL_LIGHT}, ${CORAL})` }}>
                  <span style={{ color: 'white', fontSize: 14, fontWeight: 800 }}>f</span>
                </div>
                <span className="text-[15px] font-semibold tracking-tight">Fylos</span>
              </div>

              <h3 className="text-[40px] lg:text-[52px] leading-[1.04] font-semibold tracking-tight">
                The pet app that<br />respects your <span style={{ fontStyle: 'italic', color: CORAL }}>taste.</span>
              </h3>
              <p className="text-[16px] mt-5 max-w-md leading-relaxed" style={{ color: MUTED }}>
                Health records. Playdate matching. Community safety.
                Crafted with the care of an Apple app and the soul of an Athens design studio.
              </p>

              {/* Email capture */}
              <div className="mt-10 flex gap-2 max-w-md">
                <input
                  placeholder="your.email@swiss.ch"
                  className="flex-1 h-12 px-4 rounded-xl text-[14px]"
                  style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.08)' }}
                />
                <select
                  className="h-12 px-3 rounded-xl text-[14px] appearance-none pr-8"
                  style={{ backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <option>Zurich</option>
                  <option>Geneva</option>
                  <option>Basel</option>
                  <option>Lausanne</option>
                  <option>Other</option>
                </select>
              </div>
              <button
                className="mt-3 h-12 px-6 rounded-xl text-[14px] font-semibold text-white max-w-md w-full"
                style={{ background: `linear-gradient(180deg, ${CORAL_LIGHT}, ${CORAL})` }}
              >
                Get early access →
              </button>
              <p className="text-[12px] mt-4" style={{ color: MUTED }}>
                Be among the first 1,000 in Switzerland. No spam — one update per month.
              </p>

              {/* Press strip */}
              <div className="mt-12 flex items-center gap-6 text-[11px] uppercase tracking-widest"
                   style={{ color: MUTED }}>
                <span className="font-semibold">As featured in</span>
                <span>NZZ</span><span>·</span><span>Bilanz</span><span>·</span><span>Watson</span>
              </div>
            </div>

            {/* Right side — phone mockup */}
            <div className="relative flex items-center justify-center p-8 lg:p-12 overflow-hidden"
                 style={{ background: `linear-gradient(135deg, ${PEACH}, ${PEACH_DEEP})` }}>
              <PhoneMockHealth />
              {/* Floating screens behind */}
              <div className="absolute top-12 right-8 hidden lg:block">
                <PhoneMockMini variant="playdate" />
              </div>
              <div className="absolute bottom-12 left-4 hidden lg:block">
                <PhoneMockMini variant="safety" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────
//  Phone mockups (stylized for marketing)
// ────────────────────────────────────────────
function PhoneShell({ children, scale = 1, tilt = 0 }) {
  return (
    <div
      className="relative shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
      style={{
        width: 240 * scale,
        height: 500 * scale,
        borderRadius: 36 * scale,
        border: `${6 * scale}px solid #0B0B0F`,
        background: '#FBF7F2',
        overflow: 'hidden',
        transform: `rotate(${tilt}deg)`,
      }}
    >
      {/* notch */}
      <div className="absolute left-1/2 -translate-x-1/2"
           style={{ top: 8 * scale, width: 70 * scale, height: 18 * scale, borderRadius: 999, background: '#0B0B0F' }} />
      {children}
    </div>
  )
}

function PhoneMockHealth() {
  return (
    <PhoneShell scale={1}>
      <div className="absolute inset-0 flex flex-col" style={{ paddingTop: 38, padding: 14 }}>
        <div className="flex items-center justify-between mt-6 mb-3 px-1">
          <ChevronLeft size={18} />
          <span className="text-[13px] font-semibold">Health</span>
          <Plus size={18} />
        </div>

        {/* Pet header */}
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="w-10 h-10 rounded-full" style={{ background: `linear-gradient(135deg, #FFD8B5, #FFA678)` }} />
          <div>
            <div className="text-[14px] font-semibold leading-none">Rex</div>
            <div className="text-[10px] mt-1" style={{ color: MUTED }}>Golden Retriever · 4y</div>
          </div>
        </div>

        {/* Weight chart */}
        <div className="rounded-2xl p-3 mb-3"
             style={{ background: 'white', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Weight</div>
              <div className="text-[20px] font-semibold mt-0.5">28.4 <span className="text-[10px]" style={{ color: MUTED }}>kg</span></div>
            </div>
            <div className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                 style={{ background: '#E5F9ED', color: '#3F8D63' }}>↑ 0.3</div>
          </div>
          <svg viewBox="0 0 200 60" className="w-full mt-2" preserveAspectRatio="none" style={{ height: 56 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CORAL_LIGHT} stopOpacity="0.35" />
                <stop offset="100%" stopColor={CORAL_LIGHT} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 40 L25 38 L50 32 L75 35 L100 28 L125 22 L150 25 L175 18 L200 14 L200 60 L0 60 Z"
                  fill="url(#g1)" />
            <path d="M0 40 L25 38 L50 32 L75 35 L100 28 L125 22 L150 25 L175 18 L200 14"
                  stroke={CORAL} strokeWidth="2" fill="none" strokeLinejoin="round" />
            <circle cx="200" cy="14" r="3" fill={CORAL} />
          </svg>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-2 gap-2">
          <StatusMini label="Vaccines" value="Up to date" color="#3F8D63" bg="#E5F9ED" />
          <StatusMini label="Meds" value="2 active" color="#B07A3A" bg="#FFF4E5" />
          <StatusMini label="Allergies" value="None" color={MUTED} bg="#F2F2F4" />
          <StatusMini label="Vet visit" value="In 12 days" color="#007AFF" bg="#E5F0FF" />
        </div>
      </div>
    </PhoneShell>
  )
}

function StatusMini({ label, value, color, bg }) {
  return (
    <div className="rounded-xl p-2"
         style={{ background: 'white', border: '1px solid rgba(0,0,0,0.04)' }}>
      <div className="text-[8px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{label}</div>
      <div className="text-[11px] font-semibold mt-1" style={{ color }}>{value}</div>
    </div>
  )
}

function PhoneMockMini({ variant }) {
  if (variant === 'playdate') {
    return (
      <PhoneShell scale={0.55} tilt={6}>
        <div className="absolute inset-0 flex flex-col" style={{ paddingTop: 30, padding: 8 }}>
          <div className="text-center text-[10px] font-semibold mt-3 mb-2">Playdates</div>
          <div className="flex-1 mx-1 rounded-2xl"
               style={{ background: `linear-gradient(160deg, #FFD8B5, ${CORAL})` }}>
            <div className="h-full flex flex-col items-center justify-end p-2">
              <div className="w-full bg-white/90 rounded-xl p-2 mb-1 backdrop-blur">
                <div className="text-[10px] font-semibold">Bella · 3y</div>
                <div className="text-[8px]" style={{ color: MUTED }}>0.4 km · also loves morning runs</div>
              </div>
              <div className="flex gap-2 my-1">
                <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow">✕</div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shadow"
                     style={{ background: CORAL, color: 'white' }}>♥</div>
              </div>
            </div>
          </div>
        </div>
      </PhoneShell>
    )
  }
  // safety
  return (
    <PhoneShell scale={0.55} tilt={-7}>
      <div className="absolute inset-0 flex flex-col" style={{ paddingTop: 30, padding: 8 }}>
        <div className="text-center text-[10px] font-semibold mt-3 mb-2">Safety</div>
        <div className="flex-1 mx-1 rounded-2xl relative overflow-hidden"
             style={{ background: '#E8E5DD' }}>
          {/* fake map */}
          <svg viewBox="0 0 100 140" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M0 20 Q30 30 60 25 T100 30 L100 0 L0 0 Z" fill="#D4CFBF" />
            <path d="M0 90 Q40 100 80 95 T100 100 L100 140 L0 140 Z" fill="#C8C2AE" />
            <path d="M20 0 L25 140" stroke="white" strokeWidth="0.5" />
            <path d="M50 0 L48 140" stroke="white" strokeWidth="0.5" />
            <path d="M75 0 L78 140" stroke="white" strokeWidth="0.5" />
          </svg>
          {/* pins */}
          <div className="absolute top-[30%] left-[20%] w-3 h-3 rounded-full"
               style={{ background: '#FF3B30', boxShadow: `0 0 0 4px rgba(255,59,48,0.2)` }} />
          <div className="absolute top-[55%] left-[60%] w-3 h-3 rounded-full"
               style={{ background: '#FF9500', boxShadow: `0 0 0 4px rgba(255,149,0,0.2)` }} />
          <div className="absolute top-[75%] left-[35%] w-3 h-3 rounded-full"
               style={{ background: CORAL, boxShadow: `0 0 0 4px rgba(232,93,42,0.2)` }} />
        </div>
      </div>
    </PhoneShell>
  )
}

// ────────────────────────────────────────────
//  Instagram profile preview
// ────────────────────────────────────────────
function InstagramProfile() {
  const posts = [
    { type: 'hero', title: 'Meet Fylos.', tag: 'Hero intro' },
    { type: 'frame', title: 'Pet Health', tag: 'Friday Frame #1' },
    { type: 'reel', title: 'Pet selector', tag: 'Behind the build' },
    { type: 'pulse', title: '5 winter\npaw-care tips', tag: 'Pet Pulse' },
    { type: 'frame', title: 'Playdate\nMatching', tag: 'Friday Frame #2' },
    { type: 'reel', title: 'Add Pet\nconfetti', tag: 'Behind the build' },
    { type: 'safety', title: 'Safety map', tag: 'Friday Frame #3' },
    { type: 'founder', title: '"I had a dog."', tag: 'Founder story' },
    { type: 'quote', title: 'Stress less.\nFylos more.', tag: 'Tagline' },
  ]

  return (
    <section id="instagram" className={sectionPad} style={{ backgroundColor: 'white' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="Asset · 02" title="Instagram profile" url="@fylos.app" />

        <div className="mt-10 rounded-[24px] overflow-hidden"
             style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          {/* IG header */}
          <div className="px-6 md:px-10 py-8" style={{ backgroundColor: CREAM }}>
            <div className="flex items-start gap-6 md:gap-10">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center shrink-0"
                   style={{ background: `linear-gradient(135deg, ${CORAL_LIGHT}, ${CORAL})` }}>
                <span style={{ color: 'white', fontSize: 44, fontWeight: 800 }}>f</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className="text-[20px]">fylos.app</span>
                  <button className="px-4 py-1.5 rounded-lg text-[13px] font-semibold text-white"
                          style={{ background: CORAL }}>Follow</button>
                  <button className="px-4 py-1.5 rounded-lg text-[13px] font-semibold"
                          style={{ background: '#F2F2F4' }}>Message</button>
                </div>
                <div className="flex gap-6 text-[14px] mb-3">
                  <span><b>24</b> posts</span>
                  <span><b>2,418</b> followers</span>
                  <span><b>312</b> following</span>
                </div>
                <div className="text-[14px] font-semibold">Fylos · The pet app for the pets you love</div>
                <div className="text-[14px] leading-relaxed" style={{ color: MUTED }}>
                  Designed in Athens 🇬🇷 → Built for Zurich 🇨🇭<br />
                  Health · Playdates · Safety. Coming soon.
                </div>
                <a className="text-[14px] font-semibold mt-1 block" style={{ color: CORAL }}>fylos.app →</a>
              </div>
            </div>
          </div>

          {/* Story highlights */}
          <div className="flex gap-4 px-6 md:px-10 pb-6" style={{ backgroundColor: CREAM }}>
            {['Behind', 'Friday Frame', 'Pet Pulse', 'Press', 'Beta'].map((label) => (
              <div key={label} className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center"
                     style={{ border: '1px solid rgba(0,0,0,0.08)', background: 'white' }}>
                  <div className="w-12 h-12 rounded-full"
                       style={{ background: `linear-gradient(135deg, ${PEACH}, ${PEACH_DEEP})` }} />
                </div>
                <span className="text-[10px] font-medium">{label}</span>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex justify-around border-t border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            {['Posts', 'Reels', 'Tagged'].map((t, i) => (
              <button key={t} className={`py-3 text-[12px] font-semibold tracking-widest uppercase ${i===0 ? '' : 'opacity-40'}`}>
                {t}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-1 p-1">
            {posts.map((p, i) => <GridTile key={i} {...p} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

function GridTile({ type, title, tag }) {
  const tileStyle = {
    backgroundColor: PEACH,
  }
  const isReel = type === 'reel'

  let bg = PEACH
  let titleColor = INK
  if (type === 'hero') { bg = CORAL; titleColor = 'white' }
  if (type === 'frame') bg = CREAM
  if (type === 'reel') bg = INK
  if (type === 'pulse') bg = '#F1EAE0'
  if (type === 'safety') bg = '#E8E5DD'
  if (type === 'founder') bg = '#1D1D22'
  if (type === 'quote') bg = PEACH_DEEP

  if (type === 'reel' || type === 'founder') titleColor = 'white'

  return (
    <div className="aspect-square relative overflow-hidden"
         style={{ background: bg, padding: 14 }}>
      <div className="absolute top-2 right-2 text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
           style={{ background: 'rgba(255,255,255,0.85)', color: INK }}>
        {tag}
      </div>
      {isReel && (
        <div className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center"
             style={{ background: 'rgba(255,255,255,0.2)' }}>
          <Play size={10} color="white" fill="white" />
        </div>
      )}
      <div className="absolute inset-0 flex items-end p-3">
        <div className="text-[16px] md:text-[20px] font-semibold leading-tight whitespace-pre-line"
             style={{ color: titleColor, fontStyle: type === 'quote' ? 'italic' : 'normal' }}>
          {title}
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
//  Friday Frame Carousel
// ────────────────────────────────────────────
function FridayFrameCarousel() {
  const slides = [
    { type: 'hero', label: 'SLIDE 1 · COVER' },
    { type: 'detail-chart', label: 'SLIDE 2 · CHART' },
    { type: 'detail-status', label: 'SLIDE 3 · STATUS CARDS' },
    { type: 'detail-log', label: 'SLIDE 4 · ACTIVITY LOG' },
    { type: 'rationale', label: 'SLIDE 5 · WHY' },
  ]

  return (
    <section id="friday-frame" className={sectionPad}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="Asset · 03" title="Friday Frame · weekly carousel"
                      url="Pet Profile · Health" />
        <p className="text-[14px] mt-3 max-w-[600px]" style={{ color: MUTED }}>
          Every Friday, one screen. Five-slide editorial carousel: hero → details → rationale.
          The recurring weekly format that builds the brand.
        </p>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-4">
          {slides.map((s, i) => <CarouselSlide key={i} {...s} />)}
        </div>

        {/* Caption preview */}
        <div className="mt-8 max-w-[680px] p-6 rounded-2xl"
             style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full flex items-center justify-center"
                 style={{ background: `linear-gradient(135deg, ${CORAL_LIGHT}, ${CORAL})` }}>
              <span style={{ color: 'white', fontSize: 12, fontWeight: 800 }}>f</span>
            </div>
            <div>
              <div className="text-[13px] font-semibold">fylos.app</div>
            </div>
          </div>
          <p className="text-[14px] leading-relaxed">
            Your dog's health, in a chart as clean as your Apple Watch. ✨<br /><br />
            We built the weight tracker the way Apple builds its own — soft gradient, one number, instant clarity.
            No more flipping through three apps to remember your pup's vaccination date.<br /><br />
            <span style={{ color: MUTED }}>
              #fylosapp #petapp #productdesign #buildinpublic #zueriHund #hundeleben
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

function CarouselSlide({ type, label }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: MUTED }}>
        {label}
      </div>
      <div className="aspect-square rounded-2xl overflow-hidden relative"
           style={{ background: type === 'hero' ? PEACH : 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
        {type === 'hero' && <SlideHero />}
        {type === 'detail-chart' && <SlideChart />}
        {type === 'detail-status' && <SlideStatus />}
        {type === 'detail-log' && <SlideLog />}
        {type === 'rationale' && <SlideRationale />}
      </div>
    </div>
  )
}

function SlideHero() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ background: PEACH }}>
      <div className="text-center px-4">
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: CORAL }}>
          Friday Frame · 01
        </div>
        <div className="text-[20px] font-semibold leading-tight">
          Pet Health.<br />Apple-clean.
        </div>
        <div className="mt-3 inline-block">
          <div className="w-16 h-32 rounded-xl mx-auto"
               style={{ background: 'white', border: '2px solid #0B0B0F' }} />
        </div>
      </div>
    </div>
  )
}

function SlideChart() {
  return (
    <div className="absolute inset-0 p-4 flex flex-col justify-end" style={{ background: 'white' }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: MUTED }}>
        Weight · 30 days
      </div>
      <div className="text-[26px] font-semibold leading-none">28.4 <span className="text-[12px]" style={{ color: MUTED }}>kg</span></div>
      <svg viewBox="0 0 100 30" className="w-full mt-3" preserveAspectRatio="none" style={{ height: 50 }}>
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CORAL_LIGHT} stopOpacity="0.35" />
            <stop offset="100%" stopColor={CORAL_LIGHT} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 20 L20 18 L40 14 L60 10 L80 8 L100 5 L100 30 L0 30 Z" fill="url(#g2)" />
        <path d="M0 20 L20 18 L40 14 L60 10 L80 8 L100 5"
              stroke={CORAL} strokeWidth="1.2" fill="none" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function SlideStatus() {
  return (
    <div className="absolute inset-0 p-4 flex flex-col justify-end gap-2" style={{ background: CREAM }}>
      {[
        { l: 'Vaccines', v: 'Up to date', c: '#3F8D63', bg: '#E5F9ED' },
        { l: 'Meds', v: '2 active · daily', c: '#B07A3A', bg: '#FFF4E5' },
        { l: 'Vet visit', v: 'in 12 days', c: '#007AFF', bg: '#E5F0FF' },
      ].map((s, i) => (
        <div key={i} className="rounded-xl p-2.5 flex items-center justify-between"
             style={{ background: 'white', border: '1px solid rgba(0,0,0,0.04)' }}>
          <div>
            <div className="text-[8px] font-bold uppercase tracking-wider" style={{ color: MUTED }}>{s.l}</div>
            <div className="text-[11px] font-semibold mt-0.5">{s.v}</div>
          </div>
          <div className="w-2 h-2 rounded-full" style={{ background: s.c }} />
        </div>
      ))}
    </div>
  )
}

function SlideLog() {
  return (
    <div className="absolute inset-0 p-4" style={{ background: 'white' }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: MUTED }}>
        Recent log
      </div>
      {[
        { t: '08:00', l: 'Morning meds', d: 'Carprofen · 25mg' },
        { t: '13:30', l: 'Walk · 32min', d: 'Park am See' },
        { t: '18:00', l: 'Evening meal', d: '230g · turkey' },
      ].map((l, i) => (
        <div key={i} className="flex items-center gap-2 py-1.5"
             style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
          <div className="text-[8px] font-semibold w-9" style={{ color: MUTED }}>{l.t}</div>
          <div className="w-5 h-5 rounded-full" style={{ background: PEACH }} />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold leading-tight truncate">{l.l}</div>
            <div className="text-[8px] truncate" style={{ color: MUTED }}>{l.d}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function SlideRationale() {
  return (
    <div className="absolute inset-0 p-5 flex flex-col justify-center"
         style={{ background: INK, color: 'white' }}>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: PEACH }}>
        Why we built it this way
      </div>
      <p className="text-[12px] leading-relaxed">
        Pet care apps look like spreadsheets.
        Your dog's life isn't a spreadsheet.<br /><br />
        We borrowed the visual logic of Apple Health —
        one number, one chart, one decision.
      </p>
    </div>
  )
}

// ────────────────────────────────────────────
//  Reel / TikTok frame
// ────────────────────────────────────────────
function ReelFrame() {
  return (
    <section id="reel" className={sectionPad} style={{ background: PEACH }}>
      <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
        <div>
          <SectionLabel kicker="Asset · 04" title="Reel / TikTok" url="Behind the build · 18s" inverted />
          <p className="text-[15px] mt-4 leading-relaxed max-w-md" style={{ color: '#3D3D44' }}>
            Vertical 9:16 screen recording. Greek-accented English voiceover.
            Cross-posted to Instagram Reels, TikTok, and YouTube Shorts with zero rework.
          </p>
          <div className="mt-6 space-y-3">
            <ScriptLine ts="0:00" line="Hi. I'm building a pet app." />
            <ScriptLine ts="0:03" line="This is the pet selector." />
            <ScriptLine ts="0:06" line="Three avatars. Tap. Smooth scale." />
            <ScriptLine ts="0:11" line="Built it because I have three dogs and zero patience." />
            <ScriptLine ts="0:15" line="Designed in Athens. Built for Zurich. fylos.app." />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative" style={{ width: 280, height: 580 }}>
            <PhoneShell scale={1.2}>
              <div className="absolute inset-0 flex flex-col" style={{ background: '#000', color: 'white', paddingTop: 60 }}>
                <div className="flex-1 relative flex items-center justify-center">
                  {/* central "video" area */}
                  <div className="text-center px-4">
                    <div className="text-[11px] font-bold tracking-widest uppercase" style={{ color: PEACH }}>
                      Behind the build
                    </div>
                    <div className="text-[24px] font-semibold mt-2 leading-tight">
                      Pet selector,<br /><span style={{ fontStyle: 'italic' }}>making of.</span>
                    </div>
                    <div className="mt-6 inline-flex gap-2">
                      <div className="w-12 h-12 rounded-full" style={{ background: `linear-gradient(135deg, #FFD8B5, #FFA678)` }} />
                      <div className="w-14 h-14 rounded-full" style={{ background: `linear-gradient(135deg, #C9B498, #6B5942)` }} />
                      <div className="w-12 h-12 rounded-full" style={{ background: `linear-gradient(135deg, #E5C5A1, #B5895C)` }} />
                    </div>
                  </div>
                </div>
                {/* TikTok-style overlay UI */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
                  <Heart size={22} fill="white" />
                  <MessageCircle size={22} />
                  <Bookmark size={22} />
                </div>
                <div className="px-4 pb-16">
                  <div className="text-[12px] font-semibold">@fylos.app</div>
                  <div className="text-[10px] opacity-80">Designed in Athens. Built for Zurich. 🇨🇭</div>
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] opacity-60">
                  ◁ ⏵ ⏵⏵
                </div>
              </div>
            </PhoneShell>
          </div>
        </div>
      </div>
    </section>
  )
}

function ScriptLine({ ts, line }) {
  return (
    <div className="flex gap-3">
      <span className="text-[11px] font-semibold w-10 shrink-0 mt-0.5" style={{ color: CORAL }}>{ts}</span>
      <span className="text-[14px]">{line}</span>
    </div>
  )
}

// ────────────────────────────────────────────
//  TikTok profile + content variants
// ────────────────────────────────────────────
function TikTokProfile() {
  const tiles = [
    { variant: 'pinned-pov',  views: '1.2M', dur: '0:18' },
    { variant: 'tinder-hook', views: '847K', dur: '0:14', pinned: true },
    { variant: 'day-build',   views: '312K', dur: '0:22' },
    { variant: 'why-suck',    views: '496K', dur: '0:26' },
    { variant: 'craft',       views: '208K', dur: '0:16' },
    { variant: 'athens',      views: '88K',  dur: '0:30' },
    { variant: 'pet-pulse',   views: '54K',  dur: '0:21' },
    { variant: 'safety',      views: '142K', dur: '0:19' },
    { variant: 'founder',     views: '76K',  dur: '0:42' },
  ]

  const variants = [
    {
      id: 'pinned-pov',
      tag: 'POV · Indie builder',
      hook: 'POV: you\'re building the pet app you wish existed.',
      mood: 'Relatable indie dev mood. Late-night Figma + warm desk lamp.',
      script: [
        ['0:00', 'Zoom into laptop screen — Figma open on Pet Health.'],
        ['0:03', 'Voiceover: "What if pet care looked like Apple Health?"'],
        ['0:06', 'Quick cuts: components flying into place.'],
        ['0:14', 'Pull back: founder smiles, taps phone.'],
        ['0:17', 'CTA: "Building Fylos in public. fylos.app."'],
      ],
      duration: '18s',
      audio: 'Lo-fi · trending DACH soundtrack',
      bgFrom: '#1A1A1F', bgTo: '#3A2418', textColor: 'white',
    },
    {
      id: 'tinder-hook',
      tag: 'Hook · Punchy meme',
      hook: 'Tinder. But for dogs.',
      mood: 'Single-joke video. Visual punchline in the first 1.5 seconds.',
      script: [
        ['0:00', 'Text overlay: "POV: your dog is single."'],
        ['0:02', 'Swipe demo on Playdate Matching — three rapid swipes.'],
        ['0:08', 'Cut to creator face: "no swiping for you."'],
        ['0:11', 'Match animation pops up.'],
        ['0:13', 'CTA: "@fylos.app · early access in bio."'],
      ],
      duration: '14s',
      audio: 'Trending CapCut SFX (oontz drop)',
      bgFrom: CORAL, bgTo: '#5D2A0F', textColor: 'white',
    },
    {
      id: 'day-build',
      tag: 'Series · Build in public',
      hook: 'Day 47 building Fylos.',
      mood: 'Repeatable serial format. Hooks the algorithm with consistency.',
      script: [
        ['0:00', 'Day counter overlay: "Day 47" with progress bar.'],
        ['0:02', 'Today\'s feature: pet selector animation. 3 drafts shown.'],
        ['0:14', 'Time-lapse: Cursor + Vite preview side-by-side.'],
        ['0:18', 'Final cut: smooth carousel rotation in app.'],
        ['0:21', 'CTA: "Day 48 tomorrow. Follow @fylos."'],
      ],
      duration: '22s',
      audio: 'Cinematic build music (low → swell → drop)',
      bgFrom: '#0E1A2A', bgTo: CORAL, textColor: 'white',
    },
    {
      id: 'why-suck',
      tag: 'Opinion · Hot take',
      hook: 'Why every pet app on the App Store sucks.',
      mood: 'Confrontational hook. Comparison-style. High share rate.',
      script: [
        ['0:00', 'Text: "Why every pet app sucks."'],
        ['0:02', 'Cuts: 3 ugly competitor screenshots, comic-sans crime scene labels.'],
        ['0:09', 'Pivot: "We tried something different."'],
        ['0:12', 'Show: Fylos Pet Health. Smooth weight chart drawing.'],
        ['0:21', 'CTA: "Designed in Athens. fylos.app."'],
      ],
      duration: '26s',
      audio: 'Sigma / hustle audio (ironic use)',
      bgFrom: '#FFFFFF', bgTo: PEACH, textColor: INK,
    },
    {
      id: 'craft',
      tag: 'Craft · Micro-interaction',
      hook: 'This took 3 hours. Worth it.',
      mood: 'Designer audience love. High save rate. Viral on design TikTok.',
      script: [
        ['0:00', 'Close-up: pet selector carousel rotating in slow-mo.'],
        ['0:04', 'Text: "Look at the easing curve."'],
        ['0:08', 'Side-by-side: bad easing vs Fylos easing.'],
        ['0:13', 'Voiceover: "3 hours. Worth every minute."'],
        ['0:15', 'CTA: subtle "@fylos.app" corner sticker.'],
      ],
      duration: '16s',
      audio: 'Soft jazz · ASMR-style',
      bgFrom: PEACH, bgTo: PEACH_DEEP, textColor: INK,
    },
    {
      id: 'athens',
      tag: 'Brand · Atmospheric',
      hook: 'Designed in Athens. Built for Zurich.',
      mood: 'Slow, cinematic, emotional. Brand glue between hooks and craft.',
      script: [
        ['0:00', 'Athens b-roll: Lycabettus at dusk, dog walking past kafenio.'],
        ['0:06', 'Hand opens iPhone, taps Fylos.'],
        ['0:12', 'Quick cuts of UI in warm light.'],
        ['0:22', 'Cut to Zurich tram station, dog on lead.'],
        ['0:27', 'Text fade-in: "From here. To here. fylos.app."'],
      ],
      duration: '30s',
      audio: 'Cinematic strings · low BPM',
      bgFrom: '#2C1810', bgTo: '#5D2A0F', textColor: 'white',
    },
  ]

  return (
    <section id="tiktok" className={sectionPad} style={{ background: 'white' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="Asset · 04b" title="TikTok · profile + 6 content variants" url="@fylos" />
        <p className="text-[14px] mt-3 max-w-[640px]" style={{ color: MUTED }}>
          TikTok rewards format variety. Six distinct video archetypes that all push to the same waitlist —
          the algorithm sees diversity, the audience sees one consistent brand.
        </p>

        {/* Profile mockup */}
        <div className="mt-12 grid lg:grid-cols-[360px_1fr] gap-8 items-start">
          <TikTokProfileCard />
          <TikTokGrid tiles={tiles} variants={variants} />
        </div>

        {/* Variant detail cards */}
        <div className="mt-20">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: CORAL }}>
            Six content variants
          </div>
          <h3 className="text-[24px] md:text-[32px] font-semibold tracking-tight max-w-2xl">
            Each tile above is one of these. Pick the format, repeat the engine.
          </h3>
          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {variants.map((v) => <TikTokVariantCard key={v.id} {...v} />)}
          </div>
        </div>

        {/* Posting cadence note */}
        <div className="mt-16 p-8 rounded-3xl"
             style={{ background: INK, color: 'white' }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] mb-3" style={{ color: PEACH }}>
            Posting cadence
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <CadenceCol week="Mon · Wed · Fri" type="Day-build series" body="Daily-ish numbered posts. Algorithm loves consistency. Series builds returning viewers." />
            <CadenceCol week="Tue · Sat" type="Punchy hook" body="Tinder/POV style. Goes for the 3M view spike. Pinned if it lands." />
            <CadenceCol week="Sun" type="Atmospheric brand" body="The slow one. Anchors the brand. Gets reposted to IG Reels + YouTube Shorts." />
          </div>
        </div>
      </div>
    </section>
  )
}

function TikTokProfileCard() {
  return (
    <div className="rounded-3xl overflow-hidden"
         style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 24px 60px rgba(0,0,0,0.06)' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3"
           style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <ChevronLeft size={18} />
        <span className="text-[14px] font-semibold">@fylos</span>
        <div className="flex gap-3 text-[14px] opacity-60">
          <Search size={16} />
          <span>···</span>
        </div>
      </div>

      {/* Profile */}
      <div className="p-6 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-3"
             style={{ background: `linear-gradient(135deg, ${CORAL_LIGHT}, ${CORAL})` }}>
          <span style={{ color: 'white', fontSize: 36, fontWeight: 800 }}>f</span>
        </div>
        <div className="text-[18px] font-semibold">@fylos</div>
        <div className="text-[12px] mt-1" style={{ color: MUTED }}>Fylos · The pet app</div>

        {/* Stats */}
        <div className="flex gap-6 mt-4 text-center">
          <Stat n="28" label="Following" />
          <Stat n="12.4K" label="Followers" />
          <Stat n="184.2K" label="Likes" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-5 w-full">
          <button className="flex-1 h-10 rounded-md text-[14px] font-semibold text-white"
                  style={{ background: CORAL }}>Follow</button>
          <button className="h-10 px-4 rounded-md text-[14px] font-semibold"
                  style={{ background: '#F2F2F4' }}>Message</button>
          <button className="h-10 w-10 rounded-md flex items-center justify-center"
                  style={{ background: '#F2F2F4' }}>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* Bio */}
        <div className="mt-5 text-[13px] leading-relaxed text-center max-w-[260px]">
          🐾 Building the pet app you'll actually want.<br />
          Athens 🇬🇷 → Zurich 🇨🇭<br />
          <span style={{ color: CORAL, fontWeight: 600 }}>fylos.app</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-3 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        {[
          { i: <Home size={16} />, label: 'Posts', active: true },
          { i: <Heart size={16} />, label: 'Liked' },
          { i: <Bookmark size={16} />, label: 'Saved' },
        ].map((t, i) => (
          <button key={i} className={`py-3 flex items-center justify-center gap-2 text-[12px] font-semibold ${t.active ? '' : 'opacity-40'}`}
                  style={{ borderBottom: t.active ? `2px solid ${INK}` : 'none' }}>
            {t.i}
          </button>
        ))}
      </div>
    </div>
  )
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="text-[16px] font-semibold leading-none">{n}</div>
      <div className="text-[11px] mt-1" style={{ color: MUTED }}>{label}</div>
    </div>
  )
}

function TikTokGrid({ tiles, variants }) {
  const variantById = Object.fromEntries(variants.map(v => [v.id, v]))
  const extraById = {
    'pet-pulse': { tag: 'Pet Pulse', hook: '5 winter paw-care tips.', bgFrom: '#F1EAE0', bgTo: '#E5DCCD', textColor: INK },
    'safety':    { tag: 'Safety',    hook: 'Spotted glass at Sechseläutenplatz.', bgFrom: '#E8E5DD', bgTo: '#D4CFBF', textColor: INK },
    'founder':   { tag: 'Founder',   hook: '"I had a dog."', bgFrom: '#1A1A1F', bgTo: '#3A2418', textColor: 'white' },
  }
  return (
    <div className="grid grid-cols-3 gap-2">
      {tiles.map((t, i) => {
        const v = variantById[t.variant] || extraById[t.variant]
        return <TikTokTile key={i} {...t} {...v} />
      })}
    </div>
  )
}

function TikTokTile({ hook, tag, views, dur, pinned, bgFrom, bgTo, textColor }) {
  return (
    <div className="relative aspect-[9/16] rounded-md overflow-hidden"
         style={{ background: `linear-gradient(160deg, ${bgFrom}, ${bgTo})` }}>
      {/* Pinned */}
      {pinned && (
        <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
             style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>
          📌 Pinned
        </div>
      )}
      {/* Tag */}
      <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
           style={{ background: 'rgba(255,255,255,0.85)', color: INK }}>
        {tag}
      </div>
      {/* Hook text */}
      <div className="absolute inset-x-0 top-1/3 px-3">
        <div className="text-[13px] leading-tight font-semibold" style={{ color: textColor }}>
          {hook}
        </div>
      </div>
      {/* Bottom row: play count + duration */}
      <div className="absolute bottom-1.5 inset-x-1.5 flex items-center justify-between text-[10px] font-semibold"
           style={{ color: textColor === 'white' ? 'white' : INK }}>
        <span className="flex items-center gap-1">
          <Play size={9} fill="currentColor" /> {views}
        </span>
        <span style={{ background: 'rgba(0,0,0,0.4)', color: 'white', padding: '1px 5px', borderRadius: 3 }}>
          {dur}
        </span>
      </div>
    </div>
  )
}

function TikTokVariantCard({ tag, hook, mood, script, duration, audio, bgFrom, bgTo, textColor }) {
  return (
    <div className="rounded-3xl overflow-hidden"
         style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
      {/* Top — visual mockup */}
      <div className="relative h-56 flex items-center justify-center px-6"
           style={{ background: `linear-gradient(160deg, ${bgFrom}, ${bgTo})` }}>
        <div className="text-center">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
               style={{ color: textColor === 'white' ? 'rgba(255,255,255,0.6)' : MUTED }}>
            {tag}
          </div>
          <div className="text-[24px] font-semibold leading-tight"
               style={{ color: textColor }}>
            {hook}
          </div>
        </div>
        {/* Phone-corner UI (TikTok style) */}
        <div className="absolute right-3 bottom-3 flex flex-col items-center gap-2 opacity-90"
             style={{ color: textColor }}>
          <Heart size={14} fill="currentColor" />
          <MessageCircle size={14} />
          <Bookmark size={14} />
        </div>
        {/* Duration */}
        <div className="absolute left-3 top-3 px-2 py-0.5 rounded text-[10px] font-semibold"
             style={{ background: 'rgba(0,0,0,0.4)', color: 'white' }}>
          {duration}
        </div>
      </div>

      {/* Bottom — script + meta */}
      <div className="p-5">
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: MUTED }}>
          <span className="font-semibold" style={{ color: INK }}>Vibe:</span> {mood}
        </p>

        <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: MUTED }}>
          Script
        </div>
        <div className="space-y-1.5 mb-4">
          {script.map(([ts, line], i) => (
            <div key={i} className="flex gap-3 text-[12px]">
              <span className="font-semibold w-9 shrink-0" style={{ color: CORAL }}>{ts}</span>
              <span style={{ color: INK }}>{line}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-3 text-[11px]"
             style={{ borderTop: '1px solid rgba(0,0,0,0.04)', color: MUTED }}>
          <Music2 size={11} />
          <span className="truncate">{audio}</span>
        </div>
      </div>
    </div>
  )
}

function CadenceCol({ week, type, body }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: PEACH }}>
        {week}
      </div>
      <div className="text-[16px] font-semibold mb-2">{type}</div>
      <p className="text-[13px] leading-relaxed opacity-70">{body}</p>
    </div>
  )
}

// ────────────────────────────────────────────
//  Founder poster
// ────────────────────────────────────────────
function FounderPoster() {
  return (
    <section className={sectionPad}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="Asset · 05" title="Founder story poster" url="LinkedIn + Reel · 60s" />
        <div className="mt-10 rounded-3xl overflow-hidden grid md:grid-cols-2"
             style={{ background: INK }}>
          <div className="p-10 md:p-16 flex flex-col justify-center" style={{ color: 'white' }}>
            <div className="text-[11px] font-bold uppercase tracking-widest mb-6" style={{ color: PEACH }}>
              Founder story · 60s
            </div>
            <div className="text-[28px] md:text-[40px] font-semibold leading-[1.15] tracking-tight">
              "I had a dog.<br />
              I was tracking his vaccines<br />
              across <span style={{ color: CORAL_LIGHT, fontStyle: 'italic' }}>three different apps.</span><br /><br />
              The design was the problem —<br />
              not me.<br /><br />
              So I started building <span style={{ color: PEACH }}>Fylos.</span>"
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full"
                   style={{ background: `linear-gradient(135deg, #FFD8B5, ${CORAL})` }} />
              <div>
                <div className="text-[14px] font-semibold">Founder · Athens</div>
                <div className="text-[12px] opacity-60">Building Fylos in public</div>
              </div>
            </div>
          </div>
          <div className="relative min-h-[300px] md:min-h-0"
               style={{ background: `linear-gradient(135deg, ${CORAL}, #5D2A0F)` }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-6" style={{ color: 'white' }}>
                <div className="text-[80px] md:text-[120px] leading-none" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                  Φύλος.
                </div>
                <div className="text-[14px] mt-4 opacity-80 max-w-xs mx-auto leading-relaxed">
                  Greek for <i>friend</i>. Or <i>guardian</i>. Both work.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────
//  Caption library
// ────────────────────────────────────────────
function CaptionLibrary() {
  const captions = [
    { lang: 'EN', tag: 'Tagline', body: 'Stress less. Fylos more.', target: 'Universal' },
    { lang: 'EN', tag: 'Friday Frame', body: 'Your dog\'s health, in a chart as clean as your Apple Watch.', target: 'Phase A' },
    { lang: 'EN', tag: 'Playdate hook', body: 'Tinder? No. Playdate matching for dogs. 🐶 Swipe right so Rex can meet his new best friend.', target: 'Phase A' },
    { lang: 'DE', tag: 'Playdate · CH', body: 'Tinder? Nein. Spieltermine für Hunde. 🐶 Swipe nach rechts, und Rex hat einen neuen besten Freund.', target: 'Phase A · CH' },
    { lang: 'FR', tag: 'Playdate · CH', body: 'Tinder ? Non. Rendez-vous pour chiens. 🐶 Glisse à droite et Rex a un nouvel ami.', target: 'Phase A · CH' },
    { lang: 'EN', tag: 'Provenance', body: 'Designed in Athens. Built for the dogs of Zurich, Berlin, and Amsterdam.', target: 'Universal' },
    { lang: 'EN', tag: 'Safety', body: 'Spotted something off in the park? One tap. Your whole neighbourhood knows. (Anonymous, if you want.)', target: 'Phase A' },
    { lang: 'GR', tag: 'Homecoming · Phase 3', body: 'Φτιάξαμε ένα app για τα κατοικίδιά σου στην Αθήνα. Πήγαμε πρώτα στη Ζυρίχη γιατί έπρεπε. Επιστρέψαμε σπίτι, γιατί θέλαμε.', target: 'Phase C · GR', held: true },
  ]

  return (
    <section id="captions" className={sectionPad} style={{ background: 'white' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="Asset · 06" title="Caption library" url="Tone of voice samples" />
        <p className="text-[14px] mt-3 max-w-[600px]" style={{ color: MUTED }}>
          English-first across Phases A & B. Greek captions kept in a draft folder
          until the Phase 3 homecoming launch.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-4">
          {captions.map((c, i) => <CaptionCard key={i} {...c} />)}
        </div>
      </div>
    </section>
  )
}

function CaptionCard({ lang, tag, body, target, held }) {
  return (
    <div className="p-6 rounded-2xl relative"
         style={{
           background: held ? '#F4EFE8' : CREAM,
           border: '1px solid rgba(0,0,0,0.04)',
         }}>
      {held && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider"
             style={{ background: INK, color: 'white' }}>
          Hold for Phase 3
        </div>
      )}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
              style={{ background: CORAL, color: 'white' }}>
          {lang}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>
          {tag}
        </span>
      </div>
      <p className="text-[15px] leading-relaxed">{body}</p>
      <div className="text-[11px] mt-3 font-semibold uppercase tracking-wider" style={{ color: MUTED }}>
        → {target}
      </div>
    </div>
  )
}

// ────────────────────────────────────────────
//  Cultural cheat sheet
// ────────────────────────────────────────────
function CulturalCheatsheet() {
  const rows = [
    { flag: '🇨🇭', market: 'Switzerland · Phase 1', wins: 'Premium design · Apple ecosystem · Multilingual · Vet partnerships', press: 'NZZ · Bilanz · Watson' },
    { flag: '🇩🇪', market: 'Germany · Phase 2', wins: 'Design Twitter · t3n · Build-in-public · Dog-as-family', press: 't3n · OMR · Berlin Valley' },
    { flag: '🇳🇱', market: 'Netherlands · Phase 2', wins: 'Practical features · Dutch directness · Sustainability', press: 'Bright.nl · NRC tech' },
    { flag: '🇸🇪', market: 'Nordics · Phase 2', wins: 'Outdoor dog culture · Hygge · Minimal aesthetic', press: 'Gigantes · MyNewsDesk' },
    { flag: '🇬🇷', market: 'Greece · Phase 3', wins: 'Greek wit · Founder homecoming · Athens design scene', press: 'LIFO · Vice GR · Marketing Greece' },
  ]

  return (
    <section className={sectionPad} style={{ background: PEACH }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="Asset · 07" title="Cultural moves per market" url="Cheat sheet" inverted />
        <div className="mt-10 rounded-3xl overflow-hidden bg-white"
             style={{ border: '1px solid rgba(0,0,0,0.04)' }}>
          {rows.map((r, i) => (
            <div key={i} className="grid md:grid-cols-[100px_1fr_2fr_1.2fr] gap-4 px-6 md:px-8 py-5 items-start"
                 style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(0,0,0,0.04)' }}>
              <div className="text-[28px]">{r.flag}</div>
              <div className="text-[13px] font-semibold">{r.market}</div>
              <div className="text-[13px]" style={{ color: MUTED }}>{r.wins}</div>
              <div className="text-[12px] font-semibold" style={{ color: CORAL }}>{r.press}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ────────────────────────────────────────────
//  Footer
// ────────────────────────────────────────────
function Footer() {
  return (
    <footer className={sectionPad} style={{ background: INK, color: 'white' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-[28px] md:text-[40px] font-semibold tracking-tight max-w-2xl">
          Ready to build the social channels?
        </div>
        <p className="mt-4 text-[15px] opacity-70 max-w-xl">
          Next steps are scoped in the marketing plan file. Pick one to spin up:
          waitlist landing, Friday Frame templates, founder story script,
          or Swiss vet partnership shortlist.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {['Waitlist', 'Friday Frame templates', 'Founder script', 'Vet shortlist', 'TikTok plan'].map((label) => (
            <span key={label} className="px-4 py-2.5 rounded-full text-[13px] font-semibold"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
              {label}
            </span>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 text-[12px] opacity-50">
          <div>Fylos · Marketing Preview · v1</div>
          <div className="flex items-center gap-4">
            <Instagram size={14} />
            <Music2 size={14} />
            <Linkedin size={14} />
            <Twitter size={14} />
          </div>
        </div>
      </div>
    </footer>
  )
}

// ────────────────────────────────────────────
//  Section label helper
// ────────────────────────────────────────────
function SectionLabel({ kicker, title, url, inverted }) {
  return (
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.18em]"
           style={{ color: inverted ? CORAL : CORAL }}>
        {kicker}
      </div>
      <div className="flex items-baseline gap-3 mt-2 flex-wrap">
        <h2 className="text-[28px] md:text-[36px] font-semibold tracking-tight">{title}</h2>
        {url && (
          <span className="text-[13px] font-mono" style={{ color: MUTED }}>{url}</span>
        )}
      </div>
    </div>
  )
}
