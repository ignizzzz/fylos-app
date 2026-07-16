import { type Article } from '../types.ts'

export const article: Article = {
  slug: 'if-your-pet-goes-missing',
  categorySlug: 'safety',
  title: 'A calm plan for if your pet goes missing',
  description:
    'The first hour matters most. A simple, prepared plan for a lost pet, so you act instead of freeze.',
  publishedAt: '2026-06-22',
  authorId: 'care-desk',
  tags: ['lost pets', 'safety', 'ID tags', 'neighbors'],
  hero: {
    src: '/resources/assets/hero-safety.png',
    alt: 'A collar tag being scanned by a neighbor.',
    width: 1200,
    height: 630,
  },
  body: [
    {
      type: 'paragraph',
      text: 'A lost pet is one of the few pet care moments where preparation truly changes the outcome. The plan below takes ten minutes to set up now and gives you something to follow later, when it is hard to think clearly.',
    },
    { type: 'heading', level: 2, text: 'Before anything happens' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Make sure your pet carries an **ID a stranger can actually use** without an app or a login.',
        'Keep one clear, recent **photo** that shows your pet from the side and the front.',
        'Decide in advance **what a finder should see**: enough to reach you, nothing more.',
      ],
    },
    {
      type: 'callout',
      tone: 'note',
      title: 'You always choose what a finder sees',
      text: 'A good ID is private by default. A finder should be able to reach you or leave a message, without your home address being on a tag for anyone to read.',
    },
    { type: 'heading', level: 2, text: 'In the first hour' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Search the immediate area on foot first. Most pets are found close to home.',
        'Tell the neighbors. A missing pet is a neighborhood event, and more eyes cover more ground fast.',
        'Call the places a found pet gets taken: nearby vets and shelters.',
        'Post the photo and your contact where local people will see it.',
      ],
    },
    {
      type: 'paragraph',
      text: 'This is where a connected neighborhood helps most. When neighbors can be warned at once, and a finder can reach you from the tag itself, the search stops depending on luck.',
    },
    { type: 'heading', level: 2, text: 'How the Fylos ID works' },
    {
      type: 'paragraph',
      text: 'A digital ID you can download in the app, print, and put on the collar is available now. A finder scans it and can reach you, while you stay in control of what is shown.',
    },
    {
      type: 'callout',
      tone: 'coming-soon',
      title: 'Engraved metal tag, coming soon',
      text: 'A durable engraved tag is on the way. Until it ships, the printable digital ID does the same job: one scan, and your pet has a way home.',
    },
  ],
}
