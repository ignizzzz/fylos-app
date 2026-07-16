// Design tokens for the email surface, taken from FYLOS_DESIGN_TOKENS.md
// (code-verified). Colours/radii/shadows are applied inline (as the rest of the
// app does); Tailwind handles layout, spacing, and type.
import type { Tone } from '../core/catalog'

export const C = {
  coral: '#E85D2A',
  coralSoft: '#FF7240',
  coralHover: '#D04A1C',

  cream: '#F7F5F2',
  surface: '#FFFFFF',
  chip: '#F3EFEB',
  hair: '#EDE8E2',
  peach: '#FBE7DD',
  peachSelected: '#FFEDE3',
  sheet: '#FBF9F7',

  ink: '#111111',
  ink2: '#6E6058',
  ink3: '#9B9B9F',
  sectionLabel: '#A8A29C',
  placeholder: '#C4BBB3',
  chevron: '#CFCFD4',

  // Disabled control (from FYLOS_DESIGN_TOKENS.md: #A09A94 text on #EDE8E2).
  disabledInk: '#A09A94',
  disabledBg: '#EDE8E2',
} as const

export const RADIUS = {
  grouped: 22,
  standalone: 24,
  hero: 28,
  input: 12,
  chip: 11,
  button: 14,
} as const

// Warm, tinted shadows (brown, not neutral black) read more crafted than the
// generic floaty grey box shadow. Cards also carry a warm hairline for a crisper,
// more minimal, more editorial feel.
export const SHADOW = {
  card: '0 1px 2px rgba(60,42,30,0.04), 0 14px 30px -18px rgba(60,42,30,0.14)',
  soft: '0 1px 2px rgba(60,42,30,0.05)',
  coral: '0 8px 20px -8px rgba(232,93,42,0.42)',
} as const

/** Warm hairline used on cards, dividers, and inputs. */
export const HAIRLINE = '#ECE6DE'

export const FONT = {
  display: "'Fraunces', Georgia, 'Times New Roman', serif",
  sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
} as const

export interface ToneStyle {
  fg: string
  bg: string
  bd: string
}

export const TONES: Record<Tone, ToneStyle> = {
  coral: { fg: '#E85D2A', bg: '#FFF1EC', bd: '#FFD9CC' },
  green: { fg: '#3F8D63', bg: '#EEF7F1', bd: '#D7EBDD' },
  amber: { fg: '#B07A3A', bg: '#F7F4EF', bd: '#ECDDC8' },
  red: { fg: '#E5484D', bg: '#FFF0F0', bd: '#F4D5CE' },
  slate: { fg: '#5F7387', bg: '#EEF2F6', bd: '#D8E1EA' },
  blue: { fg: '#2F6DAE', bg: '#EAF2FA', bd: '#D3E4F2' },
}
