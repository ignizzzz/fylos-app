// Seed memories surfaced on the Profile tab and as "Latest memory" on Playdates.
// New memories get prepended whenever a playdate wrap-up is saved.

export const INITIAL_MEMORIES = [
  {
    id: 'memory_seed_001',
    dogA: { name: 'Leo', photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=70' },
    dogB: { name: 'Buddy', photo: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=400&q=70' },
    title: 'Morning Walk',
    location: 'Zürichhorn',
    dateStr: 'Sat · Apr 26',
    duration: '47 MIN',
    tags: ['🎾 Loved fetch', '😌 Calm buddy', '🐾 Great vibes'],
  },
  {
    id: 'memory_seed_002',
    dogA: { name: 'Leo', photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=70' },
    dogB: { name: 'Coco', photo: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&w=400&q=70' },
    title: 'First swim',
    location: 'Limmat riverside',
    dateStr: 'Sun · Apr 20',
    duration: '32 MIN',
    tags: ['💧 First splash', '🐾 New friend'],
  },
  {
    id: 'memory_seed_003',
    dogA: { name: 'Leo', photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=70' },
    dogB: { name: 'Luna', photo: 'https://images.unsplash.com/photo-1582456891925-ed427bf17ef0?auto=format&fit=crop&w=400&q=70' },
    title: 'Park session',
    location: 'Seefeld Park',
    dateStr: 'Mon · Apr 14',
    duration: '54 MIN',
    tags: ['🌳 Long ramble'],
  },
];
