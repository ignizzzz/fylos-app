import { type Category } from './types.ts'

/**
 * Content categories. Each maps to a real theme in the app so the resources
 * hub reinforces the product rather than inventing topics.
 */
export const categories: Category[] = [
  {
    slug: 'pet-health',
    name: 'Pet health',
    title: 'Pet health guides',
    description:
      'Vaccines, checkups, and keeping a health record you can actually find when you need it.',
    intro:
      'Health is the part of pet care that is easy to lose track of. These guides help you keep vaccines, checkups, weight, and allergies in one place, so the whole picture is there the moment a vet asks.',
  },
  {
    slug: 'everyday-care',
    name: 'Everyday care',
    title: 'Everyday pet care',
    description:
      'Feeding, walks, and the small daily routines that keep a pet steady and happy.',
    intro:
      'Most of pet care is not the big moments, it is the daily rhythm. Simple, practical notes on feeding, walking, and building a routine that works for your household.',
  },
  {
    slug: 'safety',
    name: 'Safety',
    title: 'Pet safety and lost pets',
    description:
      'Tags, IDs, and what to do in the moments you hope never happen.',
    intro:
      'A calm plan beats panic. Here is how to prepare for a lost pet, how a modern ID works, and how neighbors can help each other keep the streets safe.',
  },
  {
    slug: 'working-with-pros',
    name: 'Working with pros',
    title: 'Working with vets, groomers, and walkers',
    description:
      'Booking care, sharing the right history, and getting the most from local pros.',
    intro:
      'Vets, groomers, walkers, and sitters all do better work when they have the right context. These guides cover booking, what to share, and how to build trust with the people who care for your pet.',
  },
]
