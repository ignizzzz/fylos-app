import { type Author } from './types.ts'

/**
 * Authors. These are the people credited on articles and announcements. Keep
 * them real and generic; no invented credentials or fake experts.
 */
export const authors: Author[] = [
  {
    id: 'fylos-team',
    name: 'The Fylos Team',
    role: 'Fylos',
    bio: 'Notes from the people building Fylos, the app that keeps your whole pet neighborhood in one place.',
  },
  {
    id: 'care-desk',
    name: 'Fylos Care Desk',
    role: 'Pet care guides',
    bio: 'Practical, everyday guidance for owners, written by the Fylos care team and reviewed for clarity.',
  },
]
