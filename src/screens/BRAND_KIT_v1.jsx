import React, { useEffect, useState } from 'react'
import { Download, Check } from 'lucide-react'

// ─────────────────────────────────────────────────────────
//  FYLOS — Brand Kit
//  Real logo (FYLOS wordmark · Nunito Black + coral dot)
//  extracted from the existing app source.
//  All SVG files live in /public/brand/ and are downloadable.
// ─────────────────────────────────────────────────────────

const PEACH       = '#FFE9DC'
const PEACH_DEEP  = '#FFD4BD'
const CORAL       = '#E85D2A'
const CORAL_LIGHT = '#FF7240'
const CREAM       = '#FBF7F2'
const INK         = '#0E0E12'
const MUTED       = '#6E6E73'

const inter = "Inter, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif"

// ─────────────────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────────────────
async function downloadSvg(filename) {
  const a = document.createElement('a')
  a.href = `/brand/${filename}`
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

async function downloadPng(svgFilename, sizePx, outName) {
  // Make sure Nunito is loaded so SVG text renders correctly
  if (document.fonts && document.fonts.load) {
    try {
      await document.fonts.load(`800 200px Nunito`)
      await document.fonts.load(`800 700px Nunito`)
    } catch (e) { /* noop */ }
  }
  const res = await fetch(`/brand/${svgFilename}`)
  const svgText = await res.text()
  const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const blobUrl = URL.createObjectURL(blob)
  const img = new Image()
  img.crossOrigin = 'anonymous'
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = blobUrl
  })
  const vbMatch = svgText.match(/viewBox\s*=\s*"([^"]+)"/)
  const [, , w, h] = vbMatch ? vbMatch[1].split(/\s+/).map(Number) : [0, 0, 1, 1]
  const aspect = w / h
  const canvas = document.createElement('canvas')
  canvas.width = sizePx
  canvas.height = Math.round(sizePx / aspect)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  canvas.toBlob((pngBlob) => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(pngBlob)
    a.download = outName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(a.href)
    URL.revokeObjectURL(blobUrl)
  }, 'image/png')
}

// ─────────────────────────────────────────────────────────
//  Layout helpers
// ─────────────────────────────────────────────────────────
const sectionPad = 'px-6 md:px-12 lg:px-20 py-16 md:py-20'

function SectionLabel({ kicker, title, sub }) {
  return (
    <div className="mb-10">
      <div className="text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: CORAL }}>
        {kicker}
      </div>
      <h2 className="text-[28px] md:text-[36px] font-semibold tracking-tight mt-2">{title}</h2>
      {sub && <p className="text-[14px] mt-3 max-w-[640px]" style={{ color: MUTED }}>{sub}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  Asset card
// ─────────────────────────────────────────────────────────
function AssetCard({ name, file, sub, bg = 'cream', sizes = [400, 800, 1600], aspect = 'wide' }) {
  const bgMap = {
    cream: { background: CREAM, color: INK },
    peach: { background: PEACH, color: INK },
    white: { background: 'white', color: INK },
    dark:  { background: INK, color: 'white' },
    photo: {
      background: `linear-gradient(135deg, #5D2A0F, ${CORAL})`,
      color: 'white',
    },
  }
  const previewStyle = bgMap[bg] || bgMap.cream
  const aspectClass =
    aspect === 'wide'   ? 'aspect-[3/1]' :
    aspect === 'tall'   ? 'aspect-[3/4]' :
    aspect === 'square' ? 'aspect-square' : 'aspect-[3/1]'

  return (
    <div className="rounded-3xl overflow-hidden flex flex-col"
         style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
      <div className={`${aspectClass} flex items-center justify-center p-8 relative`}
           style={previewStyle}>
        <img src={`/brand/${file}`} alt={name}
             className="max-w-[80%] max-h-[80%] object-contain pointer-events-none" />
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(255,255,255,0.7)', color: INK, backdropFilter: 'blur(8px)' }}>
          on {bg}
        </span>
      </div>

      <div className="p-5">
        <div className="text-[14px] font-semibold">{name}</div>
        {sub && <div className="text-[12px] mt-0.5" style={{ color: MUTED }}>{sub}</div>}
        <div className="text-[10px] font-mono mt-2" style={{ color: MUTED }}>{file}</div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          <button
            onClick={() => downloadSvg(file)}
            className="px-3 h-8 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 active:scale-[0.97] transition-transform"
            style={{ background: INK, color: 'white' }}>
            <Download size={12} /> SVG
          </button>
          {sizes.map((s) => (
            <button key={s}
              onClick={() => downloadPng(file, s, file.replace('.svg', `-${s}.png`))}
              className="px-3 h-8 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 active:scale-[0.97] transition-transform"
              style={{ background: '#F2F2F4', color: INK }}>
              PNG {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  Color swatch
// ─────────────────────────────────────────────────────────
function ColorSwatch({ name, hex, role }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(hex)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  const lum = (0.299*r + 0.587*g + 0.114*b) / 255
  const textColor = lum > 0.6 ? INK : 'white'
  return (
    <button onClick={copy}
      className="rounded-2xl h-36 flex flex-col justify-between p-4 text-left active:scale-[0.99] transition-transform"
      style={{ background: hex, color: textColor, border: '1px solid rgba(0,0,0,0.04)' }}>
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest opacity-80">
        {role}
        {copied && <Check size={11} />}
      </div>
      <div>
        <div className="text-[18px] font-semibold">{name}</div>
        <div className="text-[12px] font-mono mt-0.5 opacity-90">{hex}</div>
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────
//  Top bar
// ─────────────────────────────────────────────────────────
function TopBar() {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl"
         style={{ backgroundColor: 'rgba(251, 247, 242, 0.85)', borderBottom: `1px solid rgba(0,0,0,0.04)` }}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-12 py-4">
        <div className="flex items-center gap-2">
          <img src="/brand/fylos-logo.svg" className="h-5" alt="Fylos" />
          <span className="text-[15px] font-semibold tracking-tight" style={{ color: MUTED }}>· Brand Kit</span>
        </div>
        <div className="hidden md:flex gap-6 text-[13px]" style={{ color: MUTED }}>
          <a href="#wordmark" className="hover:text-black">Logo</a>
          <a href="#mark" className="hover:text-black">Mark</a>
          <a href="#greek" className="hover:text-black">Greek</a>
          <a href="#icon" className="hover:text-black">App icon</a>
          <a href="#colors" className="hover:text-black">Colors</a>
          <a href="#usage" className="hover:text-black">Usage</a>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
//  Hero
// ─────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className={sectionPad}>
      <div className="max-w-[1200px] mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
             style={{ backgroundColor: PEACH, color: CORAL }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CORAL }} />
          <span className="text-[11px] font-semibold tracking-widest uppercase">Brand Kit · v2 · Real Logo</span>
        </div>
        <h1 className="text-[40px] md:text-[60px] leading-[1.04] font-semibold tracking-tight max-w-[920px]">
          Το επίσημο <span style={{ color: CORAL }}>FYLOS</span> logo,
          έτοιμο για χρήση.
        </h1>
        <p className="text-[16px] md:text-[18px] mt-5 max-w-[680px] leading-relaxed" style={{ color: MUTED }}>
          Πηγή αλήθειας: το ίδιο το app (Onboarding, Edit Pet, Map Providers, Design System).
          Wordmark: <strong style={{ color: INK }}>FYLOS</strong> σε <strong style={{ color: INK }}>Nunito Black (800)</strong>,
          συνοδευόμενο από <strong style={{ color: CORAL }}>κοραλί κουκίδα</strong> (#E85D2A) που λειτουργεί ως brand mark.
        </p>
        <div className="mt-8 flex flex-wrap gap-2">
          <a href="#wordmark" className="px-4 h-10 rounded-full text-[13px] font-semibold flex items-center"
             style={{ background: INK, color: 'white' }}>Wordmark</a>
          <a href="#colors" className="px-4 h-10 rounded-full text-[13px] font-semibold flex items-center"
             style={{ background: 'white', color: INK, border: '1px solid rgba(0,0,0,0.06)' }}>Colors</a>
          <a href="#usage" className="px-4 h-10 rounded-full text-[13px] font-semibold flex items-center"
             style={{ background: 'white', color: INK, border: '1px solid rgba(0,0,0,0.06)' }}>Usage do's & don'ts</a>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
//  Sections
// ─────────────────────────────────────────────────────────
function WordmarkSection() {
  return (
    <section id="wordmark" className={sectionPad} style={{ background: 'white' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="01 · Wordmark"
          title="FYLOS · με την κοραλί κουκίδα"
          sub="Το πρωτεύον logo. Πάντα uppercase. Πάντα Nunito Black (800). Η κουκίδα είναι σταθερά κοραλί στις χρωματιστές εκδοχές — γίνεται μονόχρωμη μόνο όταν το λογότυπο πρέπει να μείνει σε ένα χρώμα (π.χ. embossed, engraved, single-color print)." />
        <div className="grid sm:grid-cols-2 gap-5">
          <AssetCard name="Default · color"
            file="fylos-logo.svg"
            sub="Πρώτη επιλογή. Σκούρο κείμενο + κοραλί κουκίδα πάνω σε light backgrounds."
            bg="cream"
            aspect="wide"
            sizes={[400, 800, 1600]} />
          <AssetCard name="White · color"
            file="fylos-logo-white.svg"
            sub="Λευκό κείμενο + κοραλί κουκίδα. Για dark backgrounds και photos με dark overlay."
            bg="dark"
            aspect="wide"
            sizes={[400, 800, 1600]} />
          <AssetCard name="Mono · dark"
            file="fylos-logo-mono-dark.svg"
            sub="Single-color version. Για embossing, engraving, monochrome press materials."
            bg="cream"
            aspect="wide"
            sizes={[400, 800, 1600]} />
          <AssetCard name="Mono · white"
            file="fylos-logo-mono-white.svg"
            sub="Single-color λευκό. Για dark monochrome contexts ή απαλό overlay σε dark photo."
            bg="dark"
            aspect="wide"
            sizes={[400, 800, 1600]} />
        </div>

        {/* Spec card */}
        <div className="mt-8 rounded-3xl p-6 md:p-8 grid md:grid-cols-2 gap-6 items-center"
             style={{ background: CREAM, border: '1px solid rgba(0,0,0,0.04)' }}>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] mb-2" style={{ color: CORAL }}>
              Τυπογραφικές προδιαγραφές
            </div>
            <div className="text-[20px] font-semibold mb-3">Όπως ακριβώς γράφεται στο app</div>
            <ul className="space-y-2 text-[13px] leading-relaxed" style={{ color: INK }}>
              <li>· <strong>Font</strong>: Nunito (Google Fonts)</li>
              <li>· <strong>Weight</strong>: 800 (Black)</li>
              <li>· <strong>Letter-spacing</strong>: −0.5px (στο 32px), −3px (στο 200px)</li>
              <li>· <strong>Line-height</strong>: 1</li>
              <li>· <strong>Case</strong>: ALL UPPERCASE</li>
              <li>· <strong>Dot size</strong>: 25% του font-size</li>
              <li>· <strong>Gap dot ↔ wordmark</strong>: 15% του font-size</li>
              <li>· <strong>Dot color</strong>: <span style={{ color: CORAL, fontWeight: 600 }}>#E85D2A</span></li>
              <li>· <strong>Wordmark color</strong>: #111111 (light) ή #FFFFFF (dark)</li>
            </ul>
          </div>
          <div className="rounded-2xl p-8 flex items-center justify-center min-h-[200px]"
               style={{ background: 'white', border: '1px solid rgba(0,0,0,0.04)' }}>
            <img src="/brand/fylos-logo.svg" alt="Fylos at scale" className="w-full max-w-[420px]" />
          </div>
        </div>
      </div>
    </section>
  )
}

function MarkSection() {
  return (
    <section id="mark" className={sectionPad}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="02 · Standalone mark"
          title="Η κουκίδα ως brand symbol"
          sub="Όταν η κουκίδα στέκεται μόνη της — favicons, separators, loading indicators, product badges. Είναι το συντομότερο δυνατό 'Fylos'." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <AssetCard name="Coral dot"
            file="fylos-mark-dot.svg"
            sub="Ο πιο πυκνός εκπρόσωπος του brand. Favicon, status indicator, list bullet."
            bg="cream"
            aspect="square"
            sizes={[64, 128, 256, 512]} />

          {/* Use cases mini-grid */}
          <div className="rounded-3xl p-6 lg:col-span-2"
               style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)' }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.18em] mb-4" style={{ color: CORAL }}>
              Use cases
            </div>
            <div className="grid grid-cols-3 gap-4">
              <UseCaseTile label="Favicon" >
                <div className="w-12 h-12 rounded-md flex items-center justify-center"
                     style={{ background: '#F2F2F4' }}>
                  <img src="/brand/fylos-mark-dot.svg" className="w-3 h-3" alt="" />
                </div>
              </UseCaseTile>
              <UseCaseTile label="List bullet" >
                <div className="space-y-2">
                  {['Pet profile', 'Health log', 'Playdates'].map(t => (
                    <div key={t} className="flex items-center gap-2 text-[12px]">
                      <img src="/brand/fylos-mark-dot.svg" className="w-2 h-2" alt="" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </UseCaseTile>
              <UseCaseTile label="Status pill" >
                <div className="inline-flex items-center gap-1.5 px-2.5 h-6 rounded-full text-[11px] font-semibold"
                     style={{ background: PEACH, color: CORAL }}>
                  <img src="/brand/fylos-mark-dot.svg" className="w-1.5 h-1.5" alt="" />
                  Live
                </div>
              </UseCaseTile>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function UseCaseTile({ label, children }) {
  return (
    <div className="aspect-square rounded-2xl flex flex-col items-center justify-between p-4"
         style={{ background: CREAM, border: '1px solid rgba(0,0,0,0.04)' }}>
      <div className="flex-1 flex items-center justify-center w-full">{children}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: MUTED }}>{label}</div>
    </div>
  )
}

function GreekSection() {
  return (
    <section id="greek" className={sectionPad} style={{ background: PEACH }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="03 · Greek treatment"
          title="Φύλος. — η ελληνική ψυχή"
          sub="Italic Georgia serif — όχι το επίσημο logo, αλλά brand provenance treatment. Χρησιμοποίησέ το για founder content, για το Phase 3 homecoming launch, για συγκεκριμένα brand moments. ΜΗΝ το βάλεις σε καθημερινά screens ή ads — είναι σπάνιο και νοσταλγικό." />
        <div className="grid sm:grid-cols-2 gap-5">
          <AssetCard name="Greek · dark"
            file="fylos-greek-wordmark.svg"
            sub="Για light backgrounds."
            bg="cream"
            aspect="wide"
            sizes={[900, 1800]} />
          <AssetCard name="Greek · white"
            file="fylos-greek-wordmark-white.svg"
            sub="Για dark backgrounds — όπως στο founder poster."
            bg="dark"
            aspect="wide"
            sizes={[900, 1800]} />
        </div>
      </div>
    </section>
  )
}

function AppIconSection() {
  return (
    <section id="icon" className={sectionPad}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="04 · App icon"
          title="iPhone + Android home screen"
          sub="ΠΡΟΤΑΣΗ — δεν υπάρχει επίσημο app icon ακόμα. Coral background + λευκό 'F' + λευκή κουκίδα, διατηρώντας τη brand δομή του wordmark σε square format. Square 1024×1024 master· iOS προσθέτει αυτόματα τα rounded corners." />
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
          <AssetCard name="App icon · Coral"
            file="fylos-app-icon.svg"
            sub="Πρόταση v1 — χρειάζεται έγκριση. Αν θες παραλλαγές (π.χ. cream bg + dark F + coral dot), πες μου."
            bg="cream"
            aspect="square"
            sizes={[1024, 512, 256, 128, 64]} />

          <div className="rounded-3xl overflow-hidden p-8"
               style={{ background: `linear-gradient(160deg, #2A1F4A, #5C3B8C)`, minHeight: 400 }}>
            <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Preview · iPhone home screen
            </div>
            <div className="grid grid-cols-4 gap-4 max-w-[300px]">
              {['#1A86F0', '#34C759', '#FF9500', '#FF2D55'].map((c, i) => (
                <div key={i} className="aspect-square rounded-2xl" style={{ background: c }} />
              ))}
              <div className="aspect-square rounded-2xl overflow-hidden"
                   style={{ boxShadow: '0 6px 20px rgba(232, 93, 42, 0.5)' }}>
                <img src="/brand/fylos-app-icon.svg" alt="Fylos icon" className="w-full h-full" />
              </div>
              {['#5856D6', '#AF52DE', '#FF3B30'].map((c, i) => (
                <div key={i} className="aspect-square rounded-2xl" style={{ background: c }} />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-4 gap-4 max-w-[300px] text-center text-[9px]"
                 style={{ color: 'rgba(255,255,255,0.7)' }}>
              <div>Mail</div><div>Messages</div><div>Photos</div><div>Music</div>
              <div style={{ color: 'white', fontWeight: 600 }}>Fylos</div>
              <div>Maps</div><div>Notes</div><div>Files</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ColorSection() {
  return (
    <section id="colors" className={sectionPad} style={{ background: 'white' }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="05 · Color palette"
          title="Click στο swatch για copy hex"
          sub="Warm minimal. Coral για το brand mark + CTA. Peach για soft surfaces. Cream για backgrounds. Όλα ίδια με το app." />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <ColorSwatch role="Brand · primary"  name="Coral"          hex={CORAL} />
          <ColorSwatch role="Brand · accent"   name="Coral Light"    hex={CORAL_LIGHT} />
          <ColorSwatch role="Surface · soft"   name="Peach"          hex={PEACH} />
          <ColorSwatch role="Surface · deep"   name="Peach Deep"     hex={PEACH_DEEP} />
          <ColorSwatch role="Background"       name="Cream"          hex={CREAM} />
          <ColorSwatch role="Background · UI"  name="App Background" hex="#F9F9FB" />
          <ColorSwatch role="Text · primary"   name="Ink"            hex={INK} />
          <ColorSwatch role="Text · muted"     name="Muted"          hex={MUTED} />
        </div>

        <div className="text-[14px] leading-relaxed max-w-[700px]" style={{ color: MUTED }}>
          <strong style={{ color: INK }}>Coral</strong> (#E85D2A) είναι το χρώμα της κουκίδας στο logo + όλων των CTAs. Χρησιμοποίησέ το με μέτρο — 1-2 elements ανά screen, ποτέ σαν background ολόκληρου section.
        </div>
      </div>
    </section>
  )
}

function UsageSection() {
  const dos = [
    'Άσε αρκετό κενό γύρω από το logo (clear space ≥ ύψος του "F")',
    'Χρησιμοποίησε τη color version όπου γίνεται — η κουκίδα είναι το brand mark',
    'Πάντα uppercase: FYLOS, ποτέ Fylos ή fylos μέσα στο logo',
    'Σε σκούρα φωτογραφία: white wordmark + κοραλί dot (όχι mono)',
    'Πάντα Nunito Black 800 — ποτέ άλλο weight ή font',
  ]
  const donts = [
    'Μη το stretchάρεις, μη το γέρνεις, μη το παραμορφώνεις',
    'Μην αλλάζεις το χρώμα της κουκίδας (πάντα κοραλί #E85D2A εκτός mono)',
    'Μη βάζεις το coral logo σε coral background — χάνεται',
    'Μη βάζεις drop shadows ή glows γύρω του',
    'Μη μικραίνεις το wordmark κάτω από 80px — χάνεται η κουκίδα',
    'Μη βάζεις το ελληνικό Φύλος. δίπλα στο English FYLOS — διάλεξε ένα ανά asset',
  ]
  return (
    <section id="usage" className={sectionPad} style={{ background: CREAM }}>
      <div className="max-w-[1200px] mx-auto">
        <SectionLabel kicker="06 · Usage" title="Τι κάνεις · τι δεν κάνεις"
          sub="Σύντομος οδηγός για τις περιπτώσεις που θα συμβούν συχνά." />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="text-[12px] font-bold uppercase tracking-widest mb-4" style={{ color: '#3F8D63' }}>
              ✓ Do
            </div>
            <ul className="space-y-3">
              {dos.map((d, i) => (
                <li key={i} className="text-[14px] flex gap-3 leading-relaxed">
                  <span className="mt-0.5" style={{ color: '#3F8D63' }}>✓</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 rounded-3xl" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="text-[12px] font-bold uppercase tracking-widest mb-4" style={{ color: '#D96852' }}>
              ✕ Don't
            </div>
            <ul className="space-y-3">
              {donts.map((d, i) => (
                <li key={i} className="text-[14px] flex gap-3 leading-relaxed">
                  <span className="mt-0.5" style={{ color: '#D96852' }}>✕</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-3xl flex flex-col md:flex-row gap-6 items-center"
             style={{ background: INK, color: 'white' }}>
          <img src="/brand/fylos-logo-white.svg" className="h-10 flex-shrink-0" alt="" />
          <div>
            <div className="text-[12px] font-bold uppercase tracking-widest mb-2" style={{ color: PEACH }}>
              Minimum size
            </div>
            <div className="text-[15px] leading-relaxed">
              Ποτέ μικρότερο από <strong>80px</strong> πλάτος για το wordmark — κάτω από αυτό η κουκίδα γίνεται μη-διακριτή.
              Για favicon/avatar χρησιμοποίησε αντ' αυτού το <strong>standalone dot</strong> mark.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className={sectionPad} style={{ background: INK, color: 'white' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="text-[24px] md:text-[32px] font-semibold tracking-tight max-w-2xl">
          Άλλαξε κάτι; Πες μου να το προσθέσω.
        </div>
        <p className="mt-3 text-[14px] opacity-70 max-w-xl leading-relaxed">
          Όλα τα assets ζουν στο <code className="font-mono">/public/brand/</code>.
          Logo extracted από το αληθινό source: <code className="font-mono opacity-90">36_ONBOARDING_v1.jsx</code>,
          <code className="font-mono opacity-90"> 02_CORE_DesignSystem_v2.jsx</code>,
          <code className="font-mono opacity-90"> 38_EDIT_PET_v1.jsx</code>.
        </p>
        <div className="mt-10 text-[12px] opacity-50 font-mono">
          Fylos · Brand Kit v2 · Real Logo · {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  )
}

// ─────────────────────────────────────────────────────────
//  Root component
// ─────────────────────────────────────────────────────────
export default function BrandKit() {
  useEffect(() => {
    if (document.fonts && document.fonts.load) {
      document.fonts.load('800 200px Nunito').catch(() => {})
      document.fonts.load('800 700px Nunito').catch(() => {})
    }
  }, [])

  return (
    <div style={{ background: CREAM, fontFamily: inter, color: INK,
                  WebkitFontSmoothing: 'antialiased', minHeight: '100vh' }}>
      <TopBar />
      <Hero />
      <WordmarkSection />
      <MarkSection />
      <GreekSection />
      <AppIconSection />
      <ColorSection />
      <UsageSection />
      <Footer />
    </div>
  )
}
