import { type Article } from '../types.ts'

export const article: Article = {
  slug: 'vaccine-schedule-basics',
  categorySlug: 'pet-health',
  title: 'Vaccine schedules, explained without the jargon',
  description:
    'Core versus non core, puppy versus adult, and why the due date matters more than the name. A plain guide to reading a vaccine schedule.',
  publishedAt: '2026-05-30',
  authorId: 'care-desk',
  tags: ['vaccines', 'puppies', 'health records'],
  body: [
    {
      type: 'paragraph',
      text: 'Vaccine schedules look more complicated than they are. Almost all of the confusion comes from two simple splits, and once you see them, the rest of the card reads itself.',
    },
    { type: 'heading', level: 2, text: 'Core versus non core' },
    {
      type: 'paragraph',
      text: 'Core vaccines protect against diseases that are serious, common, or both. Your vet will recommend them for nearly every pet. Non core vaccines depend on where you live and how your pet spends its days, so a dog at the park every morning may need something a mostly indoor cat does not.',
    },
    {
      type: 'callout',
      tone: 'warm',
      title: 'The one rule that always holds',
      text: 'Your vet knows your region and your pet. Use any schedule you read online as a way to ask better questions, not as a replacement for their advice.',
    },
    { type: 'heading', level: 2, text: 'Puppy and kitten versus adult' },
    {
      type: 'paragraph',
      text: 'Young animals get a series of doses a few weeks apart, because early protection fades and needs to be built up in steps. Adults move to boosters on a longer cycle. If you adopted an adult with an unknown history, your vet may restart parts of the series to be safe.',
    },
    { type: 'heading', level: 2, text: 'Read the due date, not just the name' },
    {
      type: 'paragraph',
      text: 'The most useful column on any vaccine record is not what was given, it is when the next one is due. That single date is what keeps protection from lapsing.',
    },
    {
      type: 'list',
      items: [
        'Note the **due date** the moment a vaccine is given.',
        'Set a reminder a week early, so booking is never a scramble.',
        'Keep the record where the next pro can see it, with your consent.',
      ],
    },
    {
      type: 'paragraph',
      text: 'If you track vaccines in your pet health book, the due date travels with the record, so the next vet does not have to guess. See [A health record that travels with your pet](/resources/pet-health/health-record-that-travels/) for how that fits together.',
    },
  ],
}
