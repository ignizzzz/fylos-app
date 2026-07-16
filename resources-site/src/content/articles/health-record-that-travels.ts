import { type Article } from '../types.ts'

export const article: Article = {
  slug: 'health-record-that-travels',
  categorySlug: 'pet-health',
  title: 'A health record that travels with your pet',
  description:
    'Vaccines, checkups, weight, and allergies scattered across clinics are hard to find when it matters. Here is how to keep one record that follows your pet.',
  publishedAt: '2026-06-18',
  updatedAt: '2026-07-09',
  authorId: 'care-desk',
  tags: ['health records', 'vaccines', 'vet visits', 'privacy'],
  featured: true,
  hero: {
    src: '/resources/assets/hero-health-book.png',
    alt: 'An open health book with vaccine, checkup, and weight entries.',
    width: 1200,
    height: 630,
  },
  body: [
    {
      type: 'paragraph',
      text: 'Most owners do not have a pet health problem so much as a pet history problem. The vaccine card is in a drawer, the last blood test is in an email, and the name of that one medication is somewhere in a chat. It all exists, it is just never in one place at the moment a vet asks.',
    },
    {
      type: 'paragraph',
      text: 'A health record that travels fixes the moment, not just the filing. When the record follows your pet, the next person who cares for them starts with the full picture instead of a blank page.',
    },
    { type: 'heading', level: 2, text: 'What belongs in the record' },
    {
      type: 'paragraph',
      text: 'Keep it small enough that you actually maintain it. Four things carry most of the weight:',
    },
    {
      type: 'list',
      items: [
        '**Vaccines**, with the date given and the date due next.',
        '**Checkups**, so you can see the last visit and the next one at a glance.',
        '**Weight**, tracked over time, because a slow change is easy to miss.',
        '**Allergies and medications**, the details a stranger would need in a hurry.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'The quiet one is weight',
      text: 'A single weight is just a number. The same number month after month is a trend, and trends are where problems show up early. Log it at every visit and the record does the noticing for you.',
    },
    { type: 'heading', level: 2, text: 'You choose what travels, and to whom' },
    {
      type: 'paragraph',
      text: 'A record that follows your pet only works if you stay in control of it. The right model is not all or nothing. Your vet can see the full history, while a walker or sitter sees only what they need to do their job well: allergies, routine, and how to handle your pet on a hard day.',
    },
    {
      type: 'quote',
      text: 'The moment you book, the vet already has the history, with your consent, and their notes come back to the same record.',
    },
    {
      type: 'paragraph',
      text: 'That two way flow is the point. You are not re telling the story at every visit, and nothing is stranded inside a single clinic. Each pro sees only the slice you allow, and private stays private by default.',
    },
    { type: 'heading', level: 2, text: 'How to start today' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Gather the last vaccine card and the most recent vet visit.',
        'Add current weight and any allergies or medications.',
        'Set what each type of pro is allowed to see before you need it, not during an emergency.',
      ],
    },
    {
      type: 'paragraph',
      text: 'In Fylos this lives in your pet health book, and the sharing controls are built in. If you keep it anywhere else, the same principle holds: one record, kept current, that you decide who can read.',
    },
  ],
}
