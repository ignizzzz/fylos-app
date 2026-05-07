// FYLOS · Services · Messages
//
// One thread per (provider, optional booking). Messages are chronological.
// `senderId` = 'me' for the user, otherwise the provider id.

export const SERVICES_MESSAGE_THREADS = [
  {
    id: 'thread_001',
    providerId: 'provider_001',
    bookingId: 'booking_123',
    unread: 2,
    lastMessageAt: '2026-02-22T18:42:00Z',
    pinnedContext: {
      kind: 'booking',
      bookingId: 'booking_123',
      label: '90 min walk · Mon Feb 24 · 14:00',
      petName: 'Leo',
    },
    messages: [
      { id: 'm1', senderId: 'me', text: 'Hi Lukas! Looking forward to Monday. Leo gets a bit anxious near the off-leash zone — could we stick to the riverside trail?', at: '2026-02-22T17:50:00Z', status: 'read' },
      { id: 'm2', senderId: 'provider_001', text: "Of course. We'll skip the off-leash area. I usually go down to the lakefront — is that OK?", at: '2026-02-22T18:10:00Z', status: 'read' },
      { id: 'm3', senderId: 'me', text: "Yes, perfect. He'll love that.", at: '2026-02-22T18:14:00Z', status: 'read' },
      { id: 'm4', senderId: 'provider_001', text: "I'll bring my treat pouch and send a couple of photos halfway through. See you Monday at 14:00 sharp.", at: '2026-02-22T18:42:00Z', status: 'delivered' },
    ],
  },
  {
    id: 'thread_002',
    providerId: 'provider_004',
    bookingId: 'booking_125',
    unread: 1,
    lastMessageAt: '2026-02-23T19:08:00Z',
    pinnedContext: {
      kind: 'booking',
      bookingId: 'booking_125',
      label: '60 min sitting · in progress',
      petName: 'Leo',
    },
    messages: [
      { id: 'm1', senderId: 'provider_004', text: "I'm at the door — Leo greeted me immediately, all good ☺", at: '2026-02-23T19:01:00Z', status: 'read', attachments: [] },
      { id: 'm2', senderId: 'provider_004', text: "He's settled. Will share a couple of photos in 20 min.", at: '2026-02-23T19:08:00Z', status: 'delivered' },
    ],
  },
  {
    id: 'thread_003',
    providerId: 'provider_007',
    bookingId: null,
    unread: 0,
    lastMessageAt: '2026-02-21T11:25:00Z',
    pinnedContext: {
      kind: 'pre-booking',
      label: 'No active booking',
    },
    messages: [
      { id: 'm1', senderId: 'me', text: "Hi Pia, do you have a slot for a full groom for a French bulldog this Saturday?", at: '2026-02-21T11:00:00Z', status: 'read' },
      { id: 'm2', senderId: 'provider_007', text: "Saturday is fully booked but I have a 14:00 slot on Sunday. Frenchies are a quick groom — I can do basic + nails for CHF 75.", at: '2026-02-21T11:25:00Z', status: 'read' },
    ],
  },
];
