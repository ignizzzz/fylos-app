/* ───────────────────────────────────────────────────────────
   Fylos · Theme tokens
   Source of truth για χρώματα/typography/spacing που
   χρησιμοποιεί το νέο pattern library (src/components/ui/).
   Εξήχθη από το αρχειοθετημένο 91_NETWORK_PROFILE rebuild.
   ─────────────────────────────────────────────────────────── */

export const T = {
  // Surfaces
  bg: '#F7F5F2',          // cream — main app background (NOT pure white)
  card: '#FFFFFF',        // card surface
  border: 'rgba(0,0,0,0.04)',
  divider: '#F1EDE8',
  tint: '#FBE7DD',        // soft peach (used as accent fill)

  // Brand
  coral: '#E85D2A',       // primary CTA + brand accent
  coralSoft: '#FDF1EB',   // hover/pressed state

  // Text
  txt: '#111111',         // primary text
  mutedDark: '#6E6E73',   // secondary text
  muted: '#9B9B9F',       // tertiary text / metadata

  // States
  success: '#34C759',
  successBg: '#EEF7F1',
  successBorder: '#D7EBDD',
  successText: '#3F8D63',

  warn: '#F59E0B',
  warnBg: '#F7F4EF',
  warnBorder: '#ECDDC8',
  warnText: '#B07A3A',

  danger: '#FF3B30',
  dangerBg: '#FEE8E7',
};

/* Common shadows — δίνουν depth χωρίς να γίνεται heavy */
export const SHADOWS = {
  card: '0 1px 3px rgba(0,0,0,0.04)',
  floating: '0 2px 8px rgba(0,0,0,0.06)',
  fab: '0 8px 24px rgba(232,93,42,0.32)',
  sheet: '0 -8px 40px rgba(0,0,0,0.12)',
};

/* Radius scale */
export const RADIUS = {
  sm: 10,    // chips/pills
  md: 14,    // buttons
  lg: 16,    // standard cards
  xl: 20,    // hero cards
  sheet: 22, // bottom sheet top corners
};
