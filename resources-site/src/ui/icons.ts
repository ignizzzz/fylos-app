/**
 * A small set of clean line icons (Lucide-style), rendered as coral strokes
 * inside a soft chip on each card. This is the app's canonical "peach chip +
 * coral icon" language, not flat multi-color tiles.
 */

const ICONS: Record<string, string> = {
  heart:
    '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  message: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  spark: '<path d="M12 3l1.8 5.6L20 10l-6.2 1.4L12 17l-1.8-5.6L4 10l6.2-1.4z"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><path d="M4 22V4"/>',
}

export type IconName = keyof typeof ICONS

export function icon(name: IconName): string {
  const body = ICONS[name] ?? ICONS['book']
  return `<span class="chip" aria-hidden="true"><svg viewBox="0 0 24 24">${body}</svg></span>`
}

const CATEGORY_ICON: Record<string, IconName> = {
  'pet-health': 'heart',
  'everyday-care': 'clock',
  'safety': 'shield',
  'working-with-pros': 'message',
}

export function categoryIcon(slug: string): string {
  return icon(CATEGORY_ICON[slug] ?? 'book')
}
