// Notifications surfaced inside the Social tab.

export const ACTIVITY_NOTIFICATIONS = [
  {
    group: 'TODAY',
    items: [
      { id: 'n1', type: 'like', petName: 'Tao', petAvatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150', text: 'liked your photo', time: '2 hours ago', read: false, preview: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150' },
      { id: 'n2', type: 'friend-accepted', petName: 'Bella', petAvatar: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150', text: 'accepted your friend request', time: '5 hours ago', read: true }
    ]
  },
  {
    group: 'YESTERDAY',
    items: [
      { id: 'n3', type: 'check-in', petName: 'Tao', petAvatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150', text: 'checked in at Zurichhorn Park', time: 'Yesterday', read: true },
      { id: 'n4', type: 'playdate', petName: 'Charlie', petAvatar: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=150&h=150', text: 'invited you to a playdate', time: 'Yesterday', read: true }
    ]
  }
];
