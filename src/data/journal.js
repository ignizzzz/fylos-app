/* ───────────────────────────────────────────────────────────
   Journal · mock data
   ─────────────────────────────────────────────────────────── */

import {
  Footprints, UtensilsCrossed, Stethoscope, Award, MessageSquare, Camera,
  Smile, Coffee, Wind, Sparkles, Frown,
} from 'lucide-react';

/* Entry types — single source of truth για icon/color/label */
export const ENTRY_TYPES = {
  walk:      { id: 'walk',      label: 'Walk',      icon: Footprints,      color: '#E85D2A' },
  meal:      { id: 'meal',      label: 'Meal',      icon: UtensilsCrossed, color: '#F59E0B' },
  health:    { id: 'health',    label: 'Health',    icon: Stethoscope,     color: '#34C759' },
  milestone: { id: 'milestone', label: 'Milestone', icon: Award,           color: '#E85D2A' },
  note:      { id: 'note',      label: 'Note',      icon: MessageSquare,   color: '#6E6E73' },
  moment:    { id: 'moment',    label: 'Moment',    icon: Camera,          color: '#9B9B9F' },
};

export const ENTRY_TYPE_LIST = Object.values(ENTRY_TYPES);

/* Mood vocabulary — μικρό, focused */
export const MOODS = {
  happy:    { id: 'happy',    label: 'Happy',    icon: Smile,    color: '#34C759' },
  playful:  { id: 'playful',  label: 'Playful',  icon: Sparkles, color: '#E85D2A' },
  curious:  { id: 'curious',  label: 'Curious',  icon: Wind,     color: '#F59E0B' },
  tired:    { id: 'tired',    label: 'Tired',    icon: Coffee,   color: '#9B9B9F' },
  anxious:  { id: 'anxious',  label: 'Anxious',  icon: Frown,    color: '#FF3B30' },
};

export const MOOD_LIST = Object.values(MOODS);

/* Pets — δυο pets για να φανεί η pet-switcher λειτουργία */
export const JOURNAL_PETS = [
  {
    id: 'p1',
    name: 'Leo',
    breed: 'Golden Retriever',
    age: 3,
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=120&h=120',
  },
  {
    id: 'p2',
    name: 'Luna',
    breed: 'Mixed',
    age: 2,
    photo: 'https://images.unsplash.com/photo-1537151608804-ea2f1ea14a15?auto=format&fit=crop&q=80&w=120&h=120',
  },
];

/* Helper για date generation */
const daysAgo = (n, hour = 14, minute = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

/* Mock entries — 18 items spread over ~5 months */
export const JOURNAL_ENTRIES = [
  {
    id: 'j_001',
    petId: 'p1',
    date: daysAgo(0, 8, 30),
    type: 'walk',
    title: 'Morning lakefront walk',
    body: '45 min along Zurichhorn. Met a friendly Bernese mountain dog. Leo was thrilled.',
    photos: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=800'],
    location: 'Zurichhorn',
    tags: ['lake', 'social'],
    mood: 'playful',
    pinned: false,
  },
  {
    id: 'j_002',
    petId: 'p1',
    date: daysAgo(0, 12, 15),
    type: 'meal',
    title: 'New kibble — first bowl',
    body: 'Switched to the Acana brand. Ate everything, no hesitation.',
    photos: [],
    location: '',
    tags: ['food-switch'],
    mood: 'happy',
    pinned: false,
  },
  {
    id: 'j_003',
    petId: 'p2',
    date: daysAgo(1, 17, 45),
    type: 'note',
    title: 'Luna refusing dinner',
    body: 'Skipped dinner tonight. Will watch tomorrow morning. No other symptoms.',
    photos: [],
    location: '',
    tags: ['watch'],
    mood: 'tired',
    pinned: false,
  },
  {
    id: 'j_004',
    petId: 'p1',
    date: daysAgo(2, 16, 0),
    type: 'milestone',
    title: 'Learned "shake hands"',
    body: 'After three sessions of practice this week, Leo offered his paw without prompt today.',
    photos: ['https://images.unsplash.com/photo-1601758174039-7d76d4036fb1?auto=format&fit=crop&q=80&w=800'],
    location: 'Home',
    tags: ['training', 'first time'],
    mood: 'playful',
    pinned: true,
  },
  {
    id: 'j_005',
    petId: 'p1',
    date: daysAgo(3, 10, 0),
    type: 'health',
    title: 'Vet checkup — yearly',
    body: 'Dr. Keller. All vitals normal. Weight 28.4kg (up from 27.9). Booster vaccines done.',
    photos: [],
    location: 'Tierklinik Keller, Zürich',
    tags: ['vet', 'vaccine'],
    mood: 'curious',
    pinned: false,
  },
  {
    id: 'j_006',
    petId: 'p1',
    date: daysAgo(5, 9, 30),
    type: 'walk',
    title: 'Forest trail',
    body: 'Uetliberg loop. Two hours. Came home muddy and content.',
    photos: [
      'https://images.unsplash.com/photo-1587402092301-725e37c70fd8?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1568572933382-74d440642117?auto=format&fit=crop&q=80&w=800',
    ],
    location: 'Uetliberg',
    tags: ['hike', 'forest'],
    mood: 'happy',
    pinned: false,
  },
  {
    id: 'j_007',
    petId: 'p2',
    date: daysAgo(7, 18, 20),
    type: 'moment',
    title: 'Sunset at the park',
    body: 'Just sat together watching the geese.',
    photos: ['https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=800'],
    location: 'Rieterpark',
    tags: ['quiet'],
    mood: 'happy',
    pinned: true,
  },
  {
    id: 'j_008',
    petId: 'p1',
    date: daysAgo(10, 14, 0),
    type: 'health',
    title: 'Tick removed',
    body: 'Found one behind right ear. Clean removal, no inflammation.',
    photos: [],
    location: 'Home',
    tags: ['tick', 'spring'],
    mood: 'tired',
    pinned: false,
  },
  {
    id: 'j_009',
    petId: 'p1',
    date: daysAgo(14, 11, 0),
    type: 'walk',
    title: 'Beach trip',
    body: 'Drove to Bodensee. First time at the beach! Hesitant at first then loved it.',
    photos: [
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800',
    ],
    location: 'Bodensee',
    tags: ['first time', 'beach'],
    mood: 'playful',
    pinned: true,
  },
  {
    id: 'j_010',
    petId: 'p2',
    date: daysAgo(18, 16, 30),
    type: 'milestone',
    title: 'First clean recall at the park',
    body: 'Called her back from across the field — she came immediately. Months of training paying off.',
    photos: [],
    location: 'Irchelpark',
    tags: ['recall', 'training'],
    mood: 'happy',
    pinned: false,
  },
  {
    id: 'j_011',
    petId: 'p1',
    date: daysAgo(22, 8, 0),
    type: 'meal',
    title: 'Reduced portion',
    body: 'Dropped from 350g to 300g per meal — vet recommendation, slight weight up.',
    photos: [],
    location: '',
    tags: [],
    mood: 'curious',
    pinned: false,
  },
  {
    id: 'j_012',
    petId: 'p1',
    date: daysAgo(28, 15, 0),
    type: 'moment',
    title: 'Nap on the couch',
    body: 'Found him curled up like a cinnamon roll.',
    photos: ['https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=800'],
    location: 'Home',
    tags: [],
    mood: 'tired',
    pinned: false,
  },
  {
    id: 'j_013',
    petId: 'p1',
    date: daysAgo(40, 12, 0),
    type: 'walk',
    title: 'Snow walk',
    body: 'First snow of the season. He went absolutely wild.',
    photos: ['https://images.unsplash.com/photo-1612536057832-2ff7ead58194?auto=format&fit=crop&q=80&w=800'],
    location: 'Sihlwald',
    tags: ['snow', 'winter'],
    mood: 'playful',
    pinned: false,
  },
  {
    id: 'j_014',
    petId: 'p2',
    date: daysAgo(55, 17, 0),
    type: 'health',
    title: 'Started new joint supplement',
    body: 'Vet suggested glucosamine for preventive care. 1 tablet daily with dinner.',
    photos: [],
    location: '',
    tags: ['supplement'],
    mood: 'curious',
    pinned: false,
  },
  {
    id: 'j_015',
    petId: 'p1',
    date: daysAgo(75, 14, 0),
    type: 'milestone',
    title: 'Met Bruno (Bernese mix)',
    body: 'New friend at the park. Played for two hours. Already looking forward to next time.',
    photos: [],
    location: 'Zurichhorn',
    tags: ['friend', 'first meet'],
    mood: 'playful',
    pinned: false,
  },
  {
    id: 'j_016',
    petId: 'p1',
    date: daysAgo(90, 10, 0),
    type: 'note',
    title: 'Anxious during fireworks',
    body: 'Hid under the bed for 3 hours. Need to look into calming options for next year.',
    photos: [],
    location: 'Home',
    tags: ['anxiety', 'fireworks'],
    mood: 'anxious',
    pinned: false,
  },
  {
    id: 'j_017',
    petId: 'p1',
    date: daysAgo(120, 9, 0),
    type: 'milestone',
    title: 'Adoption day · 1 year',
    body: 'One full year since we brought him home. Hard to remember life before.',
    photos: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=800'],
    location: 'Home',
    tags: ['anniversary'],
    mood: 'happy',
    pinned: true,
  },
  {
    id: 'j_018',
    petId: 'p2',
    date: daysAgo(150, 11, 0),
    type: 'moment',
    title: 'Afternoon at the café',
    body: 'Brought her to the café in Niederdorf. Slept under the table the whole time.',
    photos: [],
    location: 'Niederdorf',
    tags: ['café', 'social'],
    mood: 'tired',
    pinned: false,
  },
];

/* Format helpers used by the screen */
export const formatEntryDate = (iso) => {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) === 1 ? '' : 's'} ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric' });
};

export const formatEntryTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

/* Group entries into time buckets for the timeline */
export const groupEntriesByPeriod = (entries) => {
  const now = new Date();
  const buckets = { today: [], yesterday: [], thisWeek: [], thisMonth: [], earlier: [] };
  entries.forEach((e) => {
    const d = new Date(e.date);
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) buckets.today.push(e);
    else if (diffDays === 1) buckets.yesterday.push(e);
    else if (diffDays < 7) buckets.thisWeek.push(e);
    else if (diffDays < 30) buckets.thisMonth.push(e);
    else buckets.earlier.push(e);
  });
  return buckets;
};
