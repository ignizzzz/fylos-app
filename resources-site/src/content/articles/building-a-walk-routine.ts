import { type Article } from '../types.ts'

export const article: Article = {
  slug: 'building-a-walk-routine',
  categorySlug: 'everyday-care',
  title: 'Building a walk routine that sticks',
  description:
    'A good walk routine is less about distance and more about rhythm. How to build one that fits your day and keeps your dog steady.',
  publishedAt: '2026-06-04',
  authorId: 'care-desk',
  tags: ['walks', 'routine', 'dogs'],
  body: [
    {
      type: 'paragraph',
      text: 'The best walk routine is the one you can keep on a busy week, not the ambitious one you keep for three days. Rhythm beats intensity, because a dog reads the pattern of the day more than the length of any single walk.',
    },
    { type: 'heading', level: 2, text: 'Anchor walks to things you already do' },
    {
      type: 'paragraph',
      text: 'Attach a walk to an event that already happens, like the morning coffee or the end of the workday. Anchored habits survive because they borrow the reliability of the thing next to them.',
    },
    {
      type: 'list',
      items: [
        'A short **morning** walk to start the day settled.',
        'A longer **midday or evening** walk for real exercise.',
        'A brief **last round** before bed, so the night is calm.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'When your day does not allow it',
      text: 'Some days simply do not have a midday gap. That is what a trusted walker is for. Booking one for the days you cannot cover is not a failure of routine, it is part of a routine that respects real life.',
    },
    { type: 'heading', level: 2, text: 'Watch the dog, not the clock' },
    {
      type: 'paragraph',
      text: 'A young dog and a senior dog need very different walks. Let energy, weather, and age set the pace. A sniff heavy wander can tire a dog as much as a brisk loop, and on a hot day the short shaded route is the kind one.',
    },
    {
      type: 'paragraph',
      text: 'Keep it simple, keep it regular, and let the routine flex when it needs to. Consistency is the goal, not perfection.',
    },
  ],
}
