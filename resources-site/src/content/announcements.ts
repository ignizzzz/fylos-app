import { type Announcement } from './types.ts'

/**
 * Company announcements. Reverse chronological. Company news and milestones,
 * kept factual. No invented funding, headcount, or user numbers.
 */
export const announcements: Announcement[] = [
  {
    slug: 'why-we-are-building-a-neighborhood',
    title: 'Why we are building a neighborhood, not an app',
    description:
      'Pet care is local, daily, and built on trust. Here is the idea behind Fylos and where we are headed.',
    publishedAt: '2026-07-01',
    authorId: 'fylos-team',
    location: 'Zurich',
    hero: {
      src: '/resources/assets/hero-neighborhood.png',
      alt: 'A small clay diorama of a pet friendly neighborhood.',
      width: 1200,
      height: 630,
    },
    body: [
      {
        type: 'paragraph',
        text: 'Pet care does not happen in one place. It happens across a vet, a groomer, a walker, a park, and the neighbors who keep an eye out. Fylos is our attempt to hold all of that in one place, the way a good neighborhood already does.',
      },
      { type: 'heading', level: 2, text: 'The idea' },
      {
        type: 'paragraph',
        text: 'Every feature is a place in the town. The health book is the record that travels with your pet. The tag is the way home. The park is where neighbors warn each other about a hazard. Put together, they are less a set of tools and more a place your pet belongs.',
      },
      {
        type: 'quote',
        text: 'Pet care is local, daily, and trust based. We are building for exactly that.',
      },
      { type: 'heading', level: 2, text: 'Where we are' },
      {
        type: 'paragraph',
        text: 'The app is live and growing. Some pieces, like the engraved tag, are still coming. We would rather say coming soon than pretend something is finished. As new parts land, you will find them in our product updates.',
      },
      {
        type: 'callout',
        tone: 'warm',
        title: 'Be part of it early',
        text: 'If you care for pets or run a clinic, there is a place for you in the neighborhood. Get the app and come in.',
      },
    ],
  },
  {
    slug: 'clinics-early-access',
    title: 'Opening early access for vet clinics',
    description:
      'We are inviting a first group of vet clinics to help shape how records sync between the clinic and the owner.',
    publishedAt: '2026-06-10',
    authorId: 'fylos-team',
    location: 'Zurich',
    body: [
      {
        type: 'paragraph',
        text: 'We are opening early access for a small number of vet clinics. The goal is simple: when an owner books, the clinic already has the history, with consent, and the clinic notes come back to the same record.',
      },
      {
        type: 'paragraph',
        text: 'Different clinics run on different practice software, and some still run on paper. Early access is where we learn how to fit all of them, so the sync works in the real world and not just on a slide.',
      },
      {
        type: 'callout',
        tone: 'note',
        title: 'Interested clinics',
        text: 'If you run a clinic and want to be part of the first group, the early access application asks only a few questions to start. Licences are checked later, only if you join the pilot.',
      },
    ],
  },
]
