// FYLOS · Services · Categories
//
// One canonical list. The `active` flag drives whether the chip is tappable.
// Coming-soon categories surface roadmap (40% opacity + lock icon) — we never
// hide them entirely so users see what is on the way.

export const SERVICE_CATEGORIES = [
  {
    id: 'walking',
    label: 'Walking',
    icon: 'PawPrint',
    blurb: 'Solo & group walks',
    unit: 'walkers',
    active: true,
    providersCount: 28,
  },
  {
    id: 'sitting',
    label: 'Sitting',
    icon: 'Home',
    blurb: 'In your home',
    unit: 'sitters',
    active: true,
    providersCount: 14,
  },
  {
    id: 'grooming',
    label: 'Grooming',
    icon: 'Scissors',
    blurb: 'Wash · trim · nails',
    unit: 'groomers',
    active: true,
    providersCount: 9,
  },
  {
    id: 'vet',
    label: 'Vet',
    icon: 'Stethoscope',
    blurb: 'Clinics & telehealth',
    unit: 'clinics',
    active: true,
    providersCount: 11,
  },
  {
    id: 'daycare',
    label: 'Daycare',
    icon: 'Sun',
    blurb: 'Day-time care',
    unit: 'spots',
    active: false,
    providersCount: 0,
  },
  {
    id: 'boarding',
    label: 'Boarding',
    icon: 'BedDouble',
    blurb: 'Overnight stays',
    unit: 'hosts',
    active: false,
    providersCount: 0,
  },
  {
    id: 'training',
    label: 'Training',
    icon: 'Target',
    blurb: 'Behaviour & skills',
    unit: 'trainers',
    active: false,
    providersCount: 0,
  },
  {
    id: 'taxi',
    label: 'Pet Taxi',
    icon: 'Navigation',
    blurb: 'Door-to-door rides',
    unit: 'drivers',
    active: false,
    providersCount: 0,
  },
];

export const SERVICE_CATEGORY_BY_ID = SERVICE_CATEGORIES.reduce(
  (map, c) => ({ ...map, [c.id]: c }),
  {}
);

export const ACTIVE_SERVICE_CATEGORIES = SERVICE_CATEGORIES.filter((c) => c.active);

export const SERVICE_SORTS = [
  { id: 'recommended', label: 'Recommended' },
  { id: 'price_asc', label: 'Price: low' },
  { id: 'price_desc', label: 'Price: high' },
  { id: 'rating', label: 'Top rated' },
  { id: 'available', label: 'Available now' },
  { id: 'distance', label: 'Closest' },
];
