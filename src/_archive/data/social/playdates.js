// Playdate fixtures — used by SocialTab Playdates mode and PlaydateMatching screen.

export const ACTIVITY_PLAYDATE_DATA = {
  upcomingPlaydates: [
    {
      id: 'playdate_001',
      hostId: 'user_001',
      hostPetName: 'Leo',
      date: '2026-03-02',
      startTime: '10:00 AM',
      duration: 60,
      endTime: '11:00 AM',
      place: { id: 'place_001', name: 'Zurichhorn Park', address: 'Seestrasse, 8008 Zurich' },
      invitees: [
        { userId: 'user_002', petName: 'Tao', petBreed: 'French Bulldog', petPhoto: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150', status: 'accepted' },
        { userId: 'user_003', petName: 'Bella', petBreed: 'Labrador', petPhoto: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150', status: 'pending' }
      ],
      status: 'upcoming',
      notes: 'Meet by the lake entrance!',
      messages: [
        { userId: 'user_001', message: "Can't wait!" },
        { userId: 'user_002', message: 'See you there!' }
      ]
    },
    {
      id: 'playdate_live',
      hostId: 'user_002',
      hostPetName: 'Tao',
      date: '2026-03-02',
      startTime: '09:00 AM',
      duration: 60,
      endTime: '10:00 AM',
      place: { id: 'place_002', name: 'Lindenhof', address: 'Lindenhof, 8001 Zurich' },
      invitees: [
        { userId: 'user_001', petName: 'Leo', petBreed: 'Golden Retriever', petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150', status: 'accepted' }
      ],
      status: 'in-progress',
      notes: '',
      messages: []
    }
  ],
  pendingInvitations: [
    {
      id: 'playdate_002',
      hostId: 'user_004',
      hostPetName: 'Charlie',
      date: '2026-03-01',
      startTime: '4:00 PM',
      duration: 90,
      endTime: '5:30 PM',
      place: { name: 'Rieterpark', address: 'Seestrasse 59, 8002 Zurich' },
      invitees: [{ userId: 'user_001', petId: 'pet_001', status: 'pending' }],
      status: 'upcoming'
    }
  ],
  completedPlaydates: [
    { id: 'playdate_003', date: '2026-02-15', place: { name: 'Zurichhorn Park' }, participants: ['Tao', 'Bella'], status: 'completed' }
  ]
};
