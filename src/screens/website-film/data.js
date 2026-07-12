// The Story of a Very Good Boy · film data
// All user-facing copy lives here. House rule: no em/en dashes in copy.
// The single "presents —" mark is the founder-locked title card from the reference frame.

export const BRAND = {
  cream: '#FBF7F2',
  coral: '#E85D2A',
  ink: '#111111',
  peach: '#FFE9DC',
  sage: '#9DB18F',
  sageDeep: '#7E9474',
  butter: '#F3E2B3',
  inkSoft: 'rgba(17,17,17,0.62)',
}

export const FILM_TITLE_PREFIX = 'The Story of'
export const DEFAULT_STAR = 'a Very Good Boy'

export const STRIP = 'HEALTH · WALKS · MEMORIES · IN THEIR BEST YEARS'

export const CHAPTERS = [
  {
    id: 'living-room',
    numeral: 'I',
    label: 'The living room',
    image: '/film/scene-01.jpg',
    imageMobile: '/film/scene-01-m.jpg',
    video: '/film/scene-01.mp4',
    statement: null, // hero carries the film title instead
    placeholder: 'linear-gradient(180deg, #F6E8DC 0%, #EAD9C4 60%, #D9C2A8 100%)',
  },
  {
    id: 'scattered-years',
    numeral: 'II',
    label: 'The scattered years',
    image: '/film/scene-02.jpg',
    imageMobile: null,
    video: '/film/scene-02.mp4',
    statement: 'His whole life, scattered across drawers, inboxes and fridge doors.',
    placeholder: 'linear-gradient(180deg, #F8F0E4 0%, #F0E2CE 60%, #E2CBAF 100%)',
    chips: [
      { side: 'left', title: 'Rabies certificate', meta: '2023 · somewhere' },
      { side: 'right', title: 'Vet letter', meta: 'kitchen drawer, probably' },
      { side: 'left', title: 'Deworming', meta: 'was it March?' },
      { side: 'right', title: 'Insurance policy', meta: 'email attachment, page 7' },
    ],
  },
  {
    id: 'the-turn',
    numeral: 'III',
    label: 'The turn',
    image: '/film/scene-03.jpg',
    imageMobile: null,
    video: '/film/scene-03.mp4',
    statement: 'One quiet place for all of it.',
    placeholder: 'linear-gradient(180deg, #FBF4E9 0%, #F4E8D6 60%, #E9D6BC 100%)',
    demo: 'phone',
  },
  {
    id: 'the-walk',
    numeral: 'IV',
    label: 'The walk',
    image: '/film/scene-04.jpg',
    imageMobile: '/film/scene-04-m.jpg',
    video: '/film/scene-04.mp4',
    statement: 'Walks with people who love dogs for a living.',
    placeholder: 'linear-gradient(180deg, #F7E9C9 0%, #EFDDB6 60%, #DDC69B 100%)',
    demo: 'walk',
  },
  {
    id: 'the-care',
    numeral: 'V',
    label: 'The care',
    image: '/film/scene-05.jpg',
    imageMobile: null,
    video: '/film/scene-05.mp4',
    statement: 'Never lose a vaccine date again.',
    placeholder: 'linear-gradient(180deg, #FBF3E4 0%, #F3E6CF 60%, #E5D2B4 100%)',
    demo: 'care',
  },
  {
    id: 'quiet-hours',
    numeral: 'VI',
    label: 'The quiet hours',
    image: '/film/scene-06.jpg',
    imageMobile: '/film/scene-06-m.jpg',
    video: '/film/scene-06.mp4',
    statement: 'The phone is face down. Everything is handled.',
    placeholder: 'linear-gradient(180deg, #3B2E26 0%, #57402F 55%, #6E4E36 100%)',
    dark: true,
  },
]

export const PHONE_EVENTS = [
  { time: '08:10', label: 'Breakfast · 1 cup', icon: 'bowl' },
  { time: '09:30', label: 'Heartworm pill', icon: 'pill' },
  { time: '13:00', label: 'Walk with Marta', icon: 'paw' },
  { time: '18:45', label: 'Brush teeth', icon: 'sparkle' },
]

export const WALK_STATS = { km: 2.4, minutes: 34, photos: 3 }

export const EARNINGS = {
  perWalk: 19,
  netPerWalk: 15,
  monthlyLow: 400,
  monthlyHigh: 900,
  currency: 'CHF',
}

export const CREDITS_PETS = [
  'Leo', 'Luna', 'Milo', 'Bella', 'Rocky', 'Daisy', 'Simba', 'Nala',
  'Max', 'Kira', 'Oscar', 'Ruby', 'Bruno', 'Mia', 'Zeus', 'Lola',
  'Charlie', 'Roxy', 'Aris', 'Melba',
]

export const COMMUNITY = [
  { id: 1, pet: 'Leo', city: 'Zürich', note: 'first snow, zero dignity', crop: '/film/scene-04.jpg', pos: '38% 62%' },
  { id: 2, pet: 'Luna', city: 'Athens', note: 'guarding the good couch', crop: '/film/scene-01.jpg', pos: '50% 55%' },
  { id: 3, pet: 'Milo', city: 'Geneva', note: 'ball is life', crop: '/film/scene-03.jpg', pos: '85% 70%' },
  { id: 4, pet: 'Bella', city: 'Basel', note: 'post walk nap champion', crop: '/film/scene-06.jpg', pos: '42% 78%' },
  { id: 5, pet: 'Rocky', city: 'Bern', note: 'the vet said brave boy', crop: '/film/scene-05.jpg', pos: '52% 45%' },
  { id: 6, pet: 'Daisy', city: 'Lausanne', note: 'fountain inspector on duty', crop: '/film/scene-04.jpg', pos: '50% 40%' },
  { id: 7, pet: 'Simba', city: 'Zug', note: 'paperwork supervisor', crop: '/film/scene-02.jpg', pos: '50% 60%' },
  { id: 8, pet: 'Nala', city: 'Lugano', note: 'morning light connoisseur', crop: '/film/scene-03.jpg', pos: '70% 55%' },
]

export const FAQ = [
  {
    q: 'What is Fylos?',
    a: 'Fylos is a second brain for pet parents. Health records, reminders, documents, walks with vetted pros and memories, all in one calm place.',
  },
  {
    q: 'How much does it cost?',
    a: 'The companion app is free. Fylos Plus, a paid tier with more room and more magic, arrives after launch.',
  },
  {
    q: 'Where does Fylos launch first?',
    a: 'Switzerland first, then the rest of the world. The waitlist tells us where to hurry.',
  },
  {
    q: 'Who are the professionals?',
    a: 'Walkers, groomers, trainers and vets, vetted by us before they ever meet your dog.',
  },
  {
    q: 'Is my data safe?',
    a: 'Your records belong to you. We never sell them, and you can take them with you or delete them whenever you want.',
  },
  {
    q: 'I run a pet business. Can I join?',
    a: 'Yes. Use the professionals form above and we will reach out before launch.',
  },
]

export const RUNTIME_SECONDS = 372 // fictional runtime for the timecode, 06:12

export function formatTimecode(fraction) {
  const t = Math.max(0, Math.min(1, fraction)) * RUNTIME_SECONDS
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60)
  const f = Math.floor((t % 1) * 24)
  const pad = (n) => String(n).padStart(2, '0')
  return `00:${pad(m)}:${pad(s)}:${pad(f)}`
}
