import { type Article } from '../types.ts'

export const article: Article = {
  slug: 'first-vet-visit',
  categorySlug: 'working-with-pros',
  title: 'Getting the most from a first vet visit',
  description:
    'What to bring, what to ask, and how sharing the right history turns a first vet visit into a real head start.',
  publishedAt: '2026-07-02',
  authorId: 'care-desk',
  tags: ['vet visits', 'booking', 'health records'],
  body: [
    {
      type: 'paragraph',
      text: 'A first visit with a new vet is mostly about context. The exam takes minutes, but the picture around it, the history, the habits, the small worries you have noticed, is what turns a checkup into good care.',
    },
    { type: 'heading', level: 2, text: 'Bring the history, not just the pet' },
    {
      type: 'paragraph',
      text: 'The single most useful thing you can bring is the record: vaccines, past visits, weight, allergies, and any medication. When the vet starts with that, the appointment is about your pet, not about reconstructing the past.',
    },
    {
      type: 'quote',
      text: 'When you book, the clinic can already have the history, with your consent, so the first visit starts where a fifth visit would.',
    },
    { type: 'heading', level: 2, text: 'A short list of questions' },
    {
      type: 'list',
      items: [
        'Is the **weight** where it should be, and if not, what is the plan?',
        'What is due next, and when should the next **checkup** be?',
        'Given our routine, is there anything you would watch for?',
      ],
    },
    {
      type: 'callout',
      tone: 'warm',
      title: 'Write the answers down in one place',
      text: 'Notes taken at the visit are only useful if you can find them at the next one. Keep them with the record so the story stays whole.',
    },
    { type: 'heading', level: 2, text: 'Booking without the back and forth' },
    {
      type: 'paragraph',
      text: 'Booking in a couple of taps, with the history already attached, removes the two friction points of a new clinic at once: getting the slot, and getting them up to speed. To see how sharing stays under your control, read [A health record that travels with your pet](/resources/pet-health/health-record-that-travels/).',
    },
  ],
}
