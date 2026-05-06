import React, { useState } from 'react'
import { MapPin, Star, Shield, Sparkles, Heart, Clock, ChevronRight, Users, Activity, Zap, Camera } from 'lucide-react'

const PET = {
  name: 'Leo',
  breed: 'Golden Retriever',
  age: 3,
  location: 'Zürich',
  photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600&h=600',
  photoBanner: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800&h=500',
  archetype: 'The Diplomat',
  archetypeDesc: 'Friendly with everyone, keeps the peace, loves big social situations.',
  liveLabel: 'Just back from a walk',
  liveLocation: 'Seestrasse',
  stats: { walks: 84, friends: 8, rating: 4.9, photos: 247 },
  vibeTags: ['Morning runner', 'Loves fetch', 'Big dog friendly'],
  owner: 'Talita K.',
}

const FRIENDS = [
  { name: 'Luna', color: '#E85D2A' },
  { name: 'Max', color: '#3F8D63' },
  { name: 'Bella', color: '#7C6AF7' },
  { name: '+5', color: '#9A9AA0' },
]

// ─── Shared sub-components ───────────────────────────────────────────────────

function ModeTabBar({ active, onSelect, variant = 'default' }) {
  const tabs = ['Profile', 'Network', 'Playdates']
  if (variant === 'pill') {
    return (
      <div style={{ display: 'flex', gap: 6, padding: '12px 16px 0', background: '#fff' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => onSelect(t)} style={{
            padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
            background: active === t ? '#111' : '#F2F2F7',
            color: active === t ? '#fff' : '#6B6B70',
            transition: 'all 0.15s',
          }}>{t}{t === 'Network' ? ' •' : ''}</button>
        ))}
      </div>
    )
  }
  return (
    <div style={{ display: 'flex', padding: '10px 16px 0', background: '#fff', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
      {tabs.map(t => (
        <button key={t} onClick={() => onSelect(t)} style={{
          flex: 1, padding: '8px 0 10px', background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: active === t ? 700 : 500,
          color: active === t ? '#111' : '#9A9AA0',
          borderBottom: active === t ? '2px solid #E85D2A' : '2px solid transparent',
          transition: 'all 0.15s',
        }}>{t}{t === 'Network' ? ' •' : ''}</button>
      ))}
    </div>
  )
}

function ContentTabBar({ active, onSelect }) {
  return (
    <div style={{ display: 'flex', margin: '0 16px', background: '#F2F2F7', borderRadius: 10, padding: 3 }}>
      {['About', 'Mutual'].map(t => (
        <button key={t} onClick={() => onSelect(t)} style={{
          flex: 1, padding: '7px 0', background: active === t ? '#fff' : 'transparent',
          border: 'none', borderRadius: 8, cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: active === t ? '#111' : '#9A9AA0',
          boxShadow: active === t ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
          transition: 'all 0.15s',
        }}>{t}</button>
      ))}
    </div>
  )
}

function StatsStrip({ bg = '#fff', border = true }) {
  const s = PET.stats
  return (
    <div style={{ display: 'flex', background: bg, ...(border ? { borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' } : {}) }}>
      {[
        { n: s.walks, l: 'walks' },
        { n: s.friends, l: 'friends' },
        { n: s.rating, l: 'rating' },
        { n: s.photos, l: 'photos' },
      ].map((item, i) => (
        <div key={i} style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRight: i < 3 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#111', lineHeight: 1 }}>{item.n}</div>
          <div style={{ fontSize: 10.5, color: '#9A9AA0', marginTop: 2 }}>{item.l}</div>
        </div>
      ))}
    </div>
  )
}

function TrustRow({ style = {} }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', ...style }}>
      <span style={{ fontSize: 11, color: '#6B6B70', display: 'flex', alignItems: 'center', gap: 3 }}>
        <Shield size={11} color="#34C759" /> Vaccinated
      </span>
      <span style={{ color: 'rgba(0,0,0,0.15)' }}>·</span>
      <span style={{ fontSize: 11, color: '#6B6B70', display: 'flex', alignItems: 'center', gap: 3 }}>
        <Star size={10} color="#F59E0B" style={{ fill: '#F59E0B' }} /> 4.9 · 12 ratings
      </span>
      <span style={{ color: 'rgba(0,0,0,0.15)' }}>·</span>
      <span style={{ fontSize: 11, color: '#6B6B70', display: 'flex', alignItems: 'center', gap: 3 }}>
        <Camera size={10} /> 84 walks
      </span>
    </div>
  )
}

function AboutContent() {
  return (
    <div style={{ padding: '16px 16px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Personality card */}
      <div style={{ background: '#FBE7DD', borderRadius: 16, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Sparkles size={13} color="#E85D2A" />
          <span style={{ fontSize: 12, fontWeight: 700, color: '#E85D2A' }}>{PET.archetype}</span>
        </div>
        <p style={{ fontSize: 12.5, color: '#8B3A1E', margin: 0, lineHeight: 1.5 }}>{PET.archetypeDesc}</p>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {PET.vibeTags.map(tag => (
            <span key={tag} style={{ fontSize: 11, fontWeight: 600, background: 'rgba(255,255,255,0.7)', color: '#E85D2A', padding: '3px 9px', borderRadius: 20 }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Health row */}
      <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
        {[
          { icon: '🩺', label: 'Last vet visit', value: 'Feb 2025 · Dr. Keller' },
          { icon: '💉', label: 'Vaccines', value: 'All up to date' },
          { icon: '⚡', label: 'Energy level', value: 'High' },
        ].map((row, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '11px 14px', borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
            <span style={{ fontSize: 14, marginRight: 10 }}>{row.icon}</span>
            <span style={{ fontSize: 12.5, color: '#6B6B70', flex: 1 }}>{row.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: '#111' }}>{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// VARIANT A — "Airbnb listing"
// Full-width photo banner, name overlaid. Clean + immersive.
// ════════════════════════════════════════════════════════════════════════════
function VariantA() {
  const [modeTab, setModeTab] = useState('Profile')
  const [contentTab, setContentTab] = useState('About')

  return (
    <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>
      {/* Mode tabs */}
      <ModeTabBar active={modeTab} onSelect={setModeTab} />

      {/* Banner photo */}
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <img src={PET.photoBanner} alt={PET.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)' }} />

        {/* Live badge top-right */}
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', borderRadius: 20, padding: '4px 10px' }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34C759' }} />
          <span style={{ color: '#fff', fontSize: 11, fontWeight: 600 }}>{PET.liveLabel}</span>
        </div>

        {/* Name + meta overlaid at bottom */}
        <div style={{ position: 'absolute', bottom: 14, left: 16, right: 16 }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: -0.7, lineHeight: 1 }}>{PET.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
            {PET.breed} · Age {PET.age}
            <span style={{ opacity: 0.5 }}>·</span>
            <MapPin size={11} />
            {PET.location}
          </div>
        </div>
      </div>

      {/* Archetype row + trust */}
      <div style={{ padding: '12px 16px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Sparkles size={12} color="#E85D2A" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#E85D2A' }}>{PET.archetype}</span>
        </div>
        <span style={{ fontSize: 11, color: '#9A9AA0' }}>{PET.liveLocation} · 2h ago</span>
      </div>

      {/* Stats */}
      <div style={{ marginTop: 12 }}>
        <StatsStrip />
      </div>

      {/* Trust */}
      <TrustRow style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }} />

      {/* Content tabs */}
      <div style={{ padding: '14px 0 12px' }}>
        <ContentTabBar active={contentTab} onSelect={setContentTab} />
      </div>

      {/* Content */}
      <AboutContent />
      <div style={{ height: 20 }} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// VARIANT B — "Dense identity card"
// Compact photo row + big stats grid + pill mode tabs. Zero wasted space.
// ════════════════════════════════════════════════════════════════════════════
function VariantB() {
  const [modeTab, setModeTab] = useState('Profile')
  const [contentTab, setContentTab] = useState('About')

  return (
    <div style={{ background: '#F7F4EF', borderRadius: 24, overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>
      {/* Mode tabs — pill style */}
      <div style={{ background: '#F7F4EF', padding: '14px 16px 12px' }}>
        <ModeTabBar active={modeTab} onSelect={setModeTab} variant="pill" />
      </div>

      {/* Identity row */}
      <div style={{ background: '#fff', margin: '0 12px', borderRadius: 18, padding: '14px 14px 14px', border: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Square photo */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={PET.photo} alt={PET.name} style={{ width: 68, height: 68, borderRadius: 16, objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 10, height: 10, borderRadius: '50%', background: '#34C759', border: '2px solid #fff' }} />
          </div>

          {/* Identity */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#111', letterSpacing: -0.5, lineHeight: 1.1 }}>{PET.name}</div>
            <div style={{ fontSize: 12, color: '#9A9AA0', marginTop: 2 }}>{PET.breed} · Age {PET.age}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
              <Sparkles size={11} color="#E85D2A" />
              <span style={{ fontSize: 12, fontWeight: 700, color: '#E85D2A' }}>{PET.archetype}</span>
            </div>
          </div>
        </div>

        {/* Location + live */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
          <MapPin size={11} color="#9A9AA0" />
          <span style={{ fontSize: 11.5, color: '#9A9AA0' }}>{PET.location}</span>
          <span style={{ color: 'rgba(0,0,0,0.15)' }}>·</span>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34C759' }} />
          <span style={{ fontSize: 11.5, color: '#34C759', fontWeight: 600 }}>{PET.liveLabel}</span>
          <span style={{ fontSize: 11.5, color: '#9A9AA0' }}>· {PET.liveLocation}</span>
        </div>
      </div>

      {/* Stats — 2×2 big grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '10px 12px 0' }}>
        {[
          { n: PET.stats.walks, l: 'walks', icon: '🦮', accent: '#E85D2A' },
          { n: PET.stats.friends, l: 'friends', icon: '🐾', accent: '#3F8D63' },
          { n: PET.stats.rating, l: 'rating', icon: '⭐', accent: '#F59E0B' },
          { n: PET.stats.photos, l: 'photos', icon: '📸', accent: '#7C6AF7' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '12px 14px', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 11, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111', lineHeight: 1 }}>{s.n}</div>
            <div style={{ fontSize: 11, color: '#9A9AA0', marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Trust row */}
      <TrustRow style={{ padding: '10px 12px' }} />

      {/* Content tabs */}
      <div style={{ padding: '4px 12px 12px' }}>
        <ContentTabBar active={contentTab} onSelect={setContentTab} />
      </div>

      {/* Content */}
      <div style={{ padding: '0 12px' }}>
        <div style={{ background: '#FBE7DD', borderRadius: 16, padding: 14, marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Sparkles size={13} color="#E85D2A" />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#E85D2A' }}>{PET.archetype}</span>
          </div>
          <p style={{ fontSize: 12.5, color: '#8B3A1E', margin: 0, lineHeight: 1.5 }}>{PET.archetypeDesc}</p>
        </div>
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
          {[
            { icon: '🩺', label: 'Last vet visit', value: 'Feb 2025 · Dr. Keller' },
            { icon: '💉', label: 'Vaccines', value: 'All up to date' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '11px 14px', borderBottom: i < 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
              <span style={{ fontSize: 14, marginRight: 10 }}>{row.icon}</span>
              <span style={{ fontSize: 12.5, color: '#6B6B70', flex: 1 }}>{row.label}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#111' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 20 }} />
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════
// VARIANT C — "Personality editorial"
// Archetype is the visual hero. Photo is a tall right-side accent.
// Warm parchment tone, editorial feel.
// ════════════════════════════════════════════════════════════════════════════
function VariantC() {
  const [modeTab, setModeTab] = useState('Profile')
  const [contentTab, setContentTab] = useState('About')

  return (
    <div style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 32px rgba(0,0,0,0.10)' }}>
      {/* Mode tabs */}
      <ModeTabBar active={modeTab} onSelect={setModeTab} />

      {/* Hero: archetype-first with tall photo accent */}
      <div style={{ background: '#FBF7F4', display: 'flex', alignItems: 'stretch', minHeight: 200 }}>
        {/* Left: text */}
        <div style={{ flex: 1, padding: '20px 0 20px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: 1.2, color: '#C4886A', textTransform: 'uppercase', marginBottom: 6 }}>Personality type</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: '#E85D2A', letterSpacing: -0.7, lineHeight: 1.1 }}>{PET.archetype}</div>
          </div>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#111', letterSpacing: -0.5 }}>{PET.name}</div>
            <div style={{ fontSize: 12.5, color: '#9A9AA0', marginTop: 3 }}>{PET.breed} · {PET.age}y · {PET.location}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#34C759' }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: '#34C759' }}>{PET.liveLabel}</span>
            </div>
            <div style={{ fontSize: 11, color: '#B07A4A', marginTop: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
              <MapPin size={10} /> {PET.liveLocation} · 2h ago
            </div>
          </div>
        </div>

        {/* Right: tall photo column with left fade */}
        <div style={{ width: 120, flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
          <img src={PET.photo} alt={PET.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 10%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, #FBF7F4 0%, transparent 45%)' }} />
        </div>
      </div>

      {/* Stats strip */}
      <StatsStrip bg="#fff" />

      {/* Trust row */}
      <TrustRow style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }} />

      {/* Content tabs */}
      <div style={{ padding: '14px 0 12px' }}>
        <ContentTabBar active={contentTab} onSelect={setContentTab} />
      </div>

      {/* Content */}
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Vibe tags strip */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {PET.vibeTags.map(tag => (
            <span key={tag} style={{ fontSize: 11.5, fontWeight: 600, background: '#FBE7DD', color: '#E85D2A', padding: '5px 12px', borderRadius: 20 }}>{tag}</span>
          ))}
        </div>

        {/* Personality description */}
        <div style={{ background: '#FBF7F4', borderRadius: 14, padding: '12px 14px' }}>
          <p style={{ fontSize: 13, color: '#5C3D2E', margin: 0, lineHeight: 1.55 }}>{PET.archetypeDesc}</p>
        </div>

        {/* Health rows */}
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
          {[
            { icon: '🩺', label: 'Last vet visit', value: 'Feb 2025 · Dr. Keller' },
            { icon: '💉', label: 'Vaccines', value: 'All up to date' },
            { icon: '⚡', label: 'Energy level', value: 'High' },
          ].map((row, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '11px 14px', borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
              <span style={{ fontSize: 14, marginRight: 10 }}>{row.icon}</span>
              <span style={{ fontSize: 12.5, color: '#6B6B70', flex: 1 }}>{row.label}</span>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: '#111' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 20 }} />
    </div>
  )
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function ProfileHeroVariants() {
  return (
    <div style={{ background: '#E8E4DF', minHeight: '100vh', padding: '24px 16px 60px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9AA0', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Profile Screen · Full layout</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: '#111', letterSpacing: -0.8 }}>3 directions</div>
        <div style={{ fontSize: 13, color: '#9A9AA0', marginTop: 4 }}>Tabs, hero, stats, trust, content — complete screen</div>
      </div>

      {[
        { label: 'A', title: 'Airbnb listing', desc: 'Full-bleed photo banner, name overlaid, clean white below', Component: VariantA },
        { label: 'B', title: 'Dense identity card', desc: 'Compact square photo row, 2×2 stats grid, pill tabs', Component: VariantB },
        { label: 'C', title: 'Personality editorial', desc: 'Archetype headline first, tall photo accent, warm parchment', Component: VariantC },
      ].map(({ label, title, desc, Component }) => (
        <div key={label} style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>{label}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#111' }}>{title}</div>
              <div style={{ fontSize: 11.5, color: '#9A9AA0', marginTop: 1 }}>{desc}</div>
            </div>
          </div>
          <Component />
        </div>
      ))}
    </div>
  )
}
