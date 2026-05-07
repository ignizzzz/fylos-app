// Social feed posts — rendered in NetworkMode FeedTab.

export const ACTIVITY_SOCIAL_FEED = [
  {
    id: 'activity_001',
    ownerName: "Tao's owner",
    petName: 'Tao',
    avatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '2 hours ago',
    location: 'Zurichhorn Park',
    type: 'photo',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=600&h=600',
    likesCount: 3,
    likedByMe: false,
    likersPreview: 'Leo, Bella, +1',
    contextPetIds: ['p1'],
    withPets: [
      { id: 'w1', name: 'Bella', avatar: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150' }
    ],
    mapCoords: { lat: 47.355, lng: 8.552 },
    likers: [
      { id: 'l1', petName: 'Bella', breed: 'Labrador', timeAgo: '30m ago', avatar: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'l2', petName: 'Rocky', breed: 'Shiba Inu', timeAgo: '1h ago', avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'l3', petName: 'Daisy', breed: 'Golden Retriever', timeAgo: '1.5h ago', avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150' }
    ]
  },
  {
    id: 'activity_002',
    ownerName: "Bella's owner",
    petName: 'Bella',
    avatar: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '5 hours ago',
    location: 'Lindenhof',
    type: 'check-in',
    photoUrl: null,
    likesCount: 5,
    likedByMe: true,
    likersPreview: 'You, Tao, +3',
    contextPetIds: ['p1', 'p2'],
    withPets: [
      { id: 'w2', name: 'Tao', avatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150' }
    ],
    mapCoords: { lat: 47.373, lng: 8.541 },
    likers: [
      { id: 'l_me', petName: 'Leo (You)', breed: 'Golden Retriever', timeAgo: 'Just now', avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'l4', petName: 'Tao', breed: 'French Bulldog', timeAgo: '2h ago', avatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150' }
    ]
  },
  {
    id: 'activity_003',
    ownerName: "Rocky's owner",
    petName: 'Rocky',
    avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: 'Yesterday',
    location: 'Limmat Riverside',
    type: 'photo',
    photoUrl: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=600&h=600',
    likesCount: 4,
    likedByMe: false,
    likersPreview: 'Zyon, Bella +2',
    contextPetIds: ['p2'],
    likers: [
      { id: 'l5', petName: 'Zyon', breed: 'Belgian Malinois', timeAgo: '20m ago', avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'l6', petName: 'Bella', breed: 'Labrador', timeAgo: '45m ago', avatar: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150' }
    ]
  },
  {
    id: 'activity_004',
    ownerName: 'FYLOS',
    petName: 'System',
    avatar: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: 'Yesterday',
    location: null,
    type: 'friend-update',
    summary: 'Leo and Charlie became Fylos',
    photoUrl: null,
    likesCount: 0,
    likedByMe: false,
    likersPreview: '',
    contextPetIds: ['p1'],
    likers: []
  },
  {
    id: 'activity_005',
    ownerName: "Charlie's owner",
    petName: 'Charlie',
    avatar: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '2d ago',
    location: 'Rieterpark',
    type: 'walk-together',
    summary: 'Walk together with Charlie',
    photoUrl: null,
    likesCount: 2,
    likedByMe: false,
    likersPreview: 'Leo, Tao',
    contextPetIds: ['p1', 'p2'],
    withPets: [
      { id: 'w3', name: 'Leo', avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150' }
    ],
    mapCoords: { lat: 47.361, lng: 8.527 },
    likers: [
      { id: 'l7', petName: 'Leo', breed: 'Golden Retriever', timeAgo: '2d ago', avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150' }
    ]
  },
  {
    id: 'activity_006',
    ownerName: "Daisy's owner",
    petName: 'Daisy',
    avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '3d ago',
    location: 'Zurich West',
    type: 'photo',
    photoUrl: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&q=80&w=600&h=600',
    likesCount: 6,
    likedByMe: false,
    likersPreview: 'Leo, Zyon +4',
    contextPetIds: ['p1'],
    likers: [
      { id: 'l8', petName: 'Leo', breed: 'Golden Retriever', timeAgo: '3d ago', avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150' }
    ]
  },
  {
    id: 'activity_007',
    ownerName: 'FYLOS',
    petName: 'System',
    avatar: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '4d ago',
    location: null,
    type: 'friend-update',
    summary: 'Bella and Milo became Fylos',
    photoUrl: null,
    likesCount: 0,
    likedByMe: false,
    likersPreview: '',
    contextPetIds: ['p2'],
    likers: []
  },
  {
    id: 'activity_008',
    ownerName: "Milo's owner",
    petName: 'Milo',
    avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '5d ago',
    location: 'Seefeld',
    type: 'check-in',
    photoUrl: null,
    likesCount: 1,
    likedByMe: false,
    likersPreview: 'Zyon',
    contextPetIds: ['p2'],
    mapCoords: { lat: 47.365, lng: 8.552 },
    likers: [{ id: 'l9', petName: 'Zyon', breed: 'Belgian Malinois', timeAgo: '5d ago', avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150' }]
  },
  {
    id: 'activity_009',
    ownerName: "Nala's owner",
    petName: 'Nala',
    avatar: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '6d ago',
    location: 'Letten Park',
    type: 'photo',
    photoUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=600&h=600',
    likesCount: 2,
    likedByMe: false,
    likersPreview: 'Leo, Tao',
    contextPetIds: ['p1'],
    likers: [{ id: 'l10', petName: 'Tao', breed: 'French Bulldog', timeAgo: '6d ago', avatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150' }]
  },
  {
    id: 'activity_010',
    ownerName: "Luna's owner",
    petName: 'Luna',
    avatar: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '1w ago',
    location: 'Sihl City',
    type: 'walk-together',
    summary: 'Walk together with Zyon',
    photoUrl: null,
    likesCount: 1,
    likedByMe: false,
    likersPreview: 'Zyon',
    contextPetIds: ['p2'],
    withPets: [
      { id: 'w4', name: 'Zyon', avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150' }
    ],
    mapCoords: { lat: 47.370, lng: 8.517 },
    likers: [{ id: 'l11', petName: 'Zyon', breed: 'Belgian Malinois', timeAgo: '1w ago', avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150' }]
  }
];
