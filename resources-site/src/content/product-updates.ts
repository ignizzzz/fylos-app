import { type ProductUpdate } from './types.ts'

/**
 * Product updates (release notes). Reverse chronological. Keep these honest:
 * describe what actually shipped, and mark anything not yet live as coming soon
 * rather than announcing it as done.
 */
export const productUpdates: ProductUpdate[] = [
  {
    slug: 'health-book-sharing-controls',
    version: '1.4',
    title: 'Health book sharing controls',
    description:
      'You now decide exactly what each type of pro can see in your pet health book, before you ever need to.',
    publishedAt: '2026-07-09',
    kinds: ['feature', 'improvement'],
    body: [
      {
        type: 'paragraph',
        text: 'The health book now has sharing built in. You choose what travels and to whom: your vet can see the full history, while a walker or sitter sees only allergies, routine, and how to handle your pet.',
      },
      { type: 'heading', level: 2, text: 'What is new' },
      {
        type: 'list',
        items: [
          'Per role sharing, so each pro sees only the slice you allow.',
          'Private by default, with a clear view of what is currently shared.',
          'Notes and prescriptions from a visit come back to the same record.',
        ],
      },
      {
        type: 'callout',
        tone: 'note',
        text: 'Nothing is shared until you say so. You can change what a pro sees at any time.',
      },
    ],
  },
  {
    slug: 'digital-id-download',
    version: '1.3',
    title: 'Download and print a digital ID',
    description:
      'Create a digital ID for your pet, print it, and put it on the collar. One scan, and your pet has a way home.',
    publishedAt: '2026-06-15',
    kinds: ['feature'],
    body: [
      {
        type: 'paragraph',
        text: 'You can now create a digital ID in the app, download it, and print it for the collar. A finder scans it and can reach you, while you stay in control of what is shown.',
      },
      {
        type: 'callout',
        tone: 'coming-soon',
        title: 'Engraved metal tag, coming soon',
        text: 'A durable engraved tag is on the way. The printable digital ID is available today.',
      },
    ],
  },
  {
    slug: 'faster-booking',
    version: '1.2',
    title: 'Booking in two taps',
    description:
      'Booking a groomer or a vet is faster, with fewer steps between choosing a time and being done.',
    publishedAt: '2026-05-20',
    kinds: ['improvement', 'fix'],
    body: [
      {
        type: 'paragraph',
        text: 'We trimmed the booking flow so getting a slot takes fewer taps, and fixed a handful of issues around time zones and slot display along the way.',
      },
      {
        type: 'list',
        items: [
          'Fewer steps from choosing a time to confirmation.',
          'Clearer slot times, shown in your own time zone.',
          'Assorted fixes to reduce errors during checkout.',
        ],
      },
    ],
  },
]
