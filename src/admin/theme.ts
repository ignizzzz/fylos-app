// Growth Admin design tokens.
// Aesthetic: "warm editorial minimal" — a single family of warm, light planes
// (parchment rail < cream canvas < white cards), coral as the only saturated
// accent, hairline warm borders, soft warm shadows, and Instrument Serif for
// display type. No dark planes; brand-consistent with the Fylos warmth.

export const tokens = {
  // Surfaces / chrome
  appBg: '#FAF6F0', // warm cream canvas
  surface: '#FFFFFF', // cards
  surfaceAlt: '#F7F1E8', // subtle warm band (table head, chips, insets)
  sidebarBg: '#F1EADF', // parchment rail (the darkest warm plane)
  sidebarText: '#2B2320',
  sidebarMuted: '#9C8E7C',
  sidebarActive: '#E85D2A',

  // Hairlines (warm, quiet)
  border: '#ECE4D6',
  borderStrong: '#E1D7C6',
  divider: '#F1EADF',

  // Ink
  ink: '#2B2320',
  ink2: '#6E625B',
  ink3: '#9C8E7C',

  // Brand
  coral: '#E85D2A',
  coralSoft: '#FBEEE7',
  coralBorder: '#F3CDB9',

  // Focus ring
  ring: 'rgba(232,93,42,0.30)',
} as const;

export const fonts = {
  // Editorial serif for display (titles, hero numbers) — already loaded by the
  // app shell; Fraunces/Georgia as graceful fallbacks.
  display: '"Instrument Serif", "Fraunces", Georgia, "Times New Roman", serif',
  body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
} as const;

// Warm, low, soft shadows (brown-tinted rather than neutral black).
export const shadows = {
  sm: '0 1px 2px rgba(74,55,40,0.05)',
  card: '0 1px 2px rgba(74,55,40,0.04), 0 6px 16px rgba(74,55,40,0.05)',
  pop: '0 18px 44px rgba(74,55,40,0.16)',
  focus: `0 0 0 3px ${tokens.ring}`,
} as const;

export const radii = {
  sm: 8,
  md: 10,
  lg: 16,
  xl: 20,
} as const;

// Semantic tone -> chip colours (bg / text / border).
export type Tone = 'neutral' | 'coral' | 'green' | 'amber' | 'blue' | 'violet' | 'rose' | 'teal' | 'slate' | 'red';

export const toneStyles: Record<Tone, { bg: string; fg: string; border: string }> = {
  neutral: { bg: '#F3EDE3', fg: '#6E625B', border: '#E7DFD1' },
  coral: { bg: '#FBEDE5', fg: '#B54A22', border: '#F3C9B6' },
  green: { bg: '#EAF2E9', fg: '#3F7A54', border: '#CFE4D2' },
  amber: { bg: '#FAF0DC', fg: '#9A6B1E', border: '#EEDab0' },
  blue: { bg: '#E9EFF7', fg: '#3A5F97', border: '#CFDCEE' },
  violet: { bg: '#F0EBF7', fg: '#5B44A0', border: '#DCD1EE' },
  rose: { bg: '#FAEAEF', fg: '#A63C68', border: '#F1CEDA' },
  teal: { bg: '#E4F1EF', fg: '#2E7C74', border: '#C6E4DF' },
  slate: { bg: '#EDEEF0', fg: '#556072', border: '#DCDFE4' },
  red: { bg: '#FBEAE7', fg: '#B23B30', border: '#F3CFC9' },
};

// Tag palette (from the Tag model) -> tone.
export const tagColorToTone: Record<string, Tone> = {
  coral: 'coral',
  sage: 'green',
  amber: 'amber',
  blue: 'blue',
  violet: 'violet',
  slate: 'slate',
  rose: 'rose',
  teal: 'teal',
};

// Track colour for meters / progress bars (single source of truth).
export const trackColor = '#EBE3D5';
