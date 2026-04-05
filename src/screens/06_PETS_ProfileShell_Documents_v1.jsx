import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AddPetMascot } from './37_ADD_PET_v1';
import { 
  Home, 
  PawPrint, 
  Calendar, 
  Activity, 
  Folder, 
  Search, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal, 
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  ChevronDown,
  Settings,
  Star,
  MapPin,
  Pencil,
  Copy,
  Trash2,
  Plus,
  Camera,
  HeartPulse,
  FileText,
  Share2,
  Scan,
  Upload,
  Image as ImageIcon,
  Download,
  Check,
  ChevronUp,
  Syringe,
  Stethoscope,
  Pill,
  Scale,
  Clock,
  CalendarDays,
  Wind,
  ArrowRight,
  Phone,
  ShieldAlert,
  QrCode,
  ExternalLink,
  Heart,
  AlertOctagon,
  Link,
  Link as LinkIcon,
  PhoneCall,
  Users,
  Shield,
  Mail,
  UserPlus,
  Scissors,
  Share,
  SlidersHorizontal,
  Zap,
  ShieldCheck,
  Award,
  CreditCard,
  Lock,
  XCircle,
  MoreVertical,
  MessageCircle,
  Navigation2,
  HelpCircle,
  User,
  Send,
  Mic,
  ArrowDown,
  CheckCheck,
  Navigation,
  RotateCcw,
  List,
  Clock3,
  Bone,
  PersonStanding,
  FileDown,
  Fingerprint,
  DownloadCloud,
  Cloud,
  ArrowLeft,
  Printer,
  History,
  LineChart,
  Edit3,
  Archive,
  File as FileIcon,
  Globe,
  Map as MapIcon,
  Compass,
  UserCheck,
  Settings2,
  TrendingUp,
  Target,
  Megaphone,
  BrainCircuit,
  Sparkles,
  Trees,
  Store,
  Coffee,
  Droplets,
  Flame,
  Rocket,
  PartyPopper
} from 'lucide-react';

/**
 * FYLOS Logo Component
 */
const FylosLogo = ({ 
  text = 'FYLOS',
  textColor = '#000000', 
  dotColor = '#FF6B35',  
  fontSize = '2rem',     
  className = ''         
}) => {
  return (
    <div 
      className={className}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: `calc(${fontSize} * 0.15)`,
        fontFamily: '"Nunito", sans-serif'
      }}
    >
      <span 
        style={{ 
          fontSize: fontSize, 
          fontWeight: 800, 
          color: textColor, 
          letterSpacing: '-0.5px',
          lineHeight: 1
        }}
      >
        {text}
      </span>
      <div 
        style={{ 
          width: `calc(${fontSize} * 0.25)`, 
          height: `calc(${fontSize} * 0.25)`, 
          borderRadius: '50%', 
          backgroundColor: dotColor 
        }}
      />
    </div>
  );
};

// --- MOCK DATA ---
const MOCK_USER = {
  name: 'Talita',
  avatar: 'https://i.pravatar.cc/150?u=alex_fylos',
  notifications: 1,
};

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'vault', label: 'Vault', icon: Folder },
];

const INITIAL_MOCK_PETS = [
  {
    id: 'p1',
    name: 'Leo',
    breed: 'Golden Retriever',
    age: 3,
    sex: 'Female',
    weight: '28',
    weightUnit: 'kg',
    location: 'Zurich, CH',
    photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
    dob: '2021-04-12',
    microchip: '981020000394857',
    color: 'Light Golden',
    energyLevel: 65,
    temperament: ['Friendly', 'Playful', 'Affectionate'],
    anxietyTriggers: ['Thunder', 'Fireworks'],
    preferences: {
      treats: 'Salmon bites, Peanut butter',
      toys: 'Tennis ball, Squeaky duck',
      foodBrand: 'Royal Canin Golden Retriever Adult',
      sleepingSpot: 'At the foot of the bed',
      walking: 'Loves the forest, hates rain'
    },
    documents: [
      // Medical Records
      { id: 'd1', title: 'Vaccination Certificate – Rabies', category: 'Medical Records', source: 'Vet Clinic Zurich', date: '2023-05-10', type: 'PDF', size: '1.2 MB' },
      { id: 'd2', title: 'Vaccination Certificate – DHPP', category: 'Medical Records', source: 'Vet Clinic Zurich', date: '2023-05-10', type: 'PDF', size: '1.1 MB' },
      { id: 'd3', title: 'Blood Test Results – CBC Panel', category: 'Medical Records', source: 'Laboklin', date: '2023-11-02', type: 'PDF', size: '245 KB' },
      { id: 'd4', title: 'X-Ray – Front Leg', category: 'Medical Records', source: 'Vet Clinic Zurich', date: '2022-08-15', type: 'JPG', size: '4.6 MB' },
      { id: 'd5', title: 'Vet Report – Annual Checkup', category: 'Medical Records', source: 'Dr. Sarah Keller', date: '2024-01-20', type: 'PDF', size: '95 KB' },
      { id: 'd6', title: 'Dental Cleaning Invoice', category: 'Medical Records', source: 'City Vet Care', date: '2024-02-10', type: 'PDF', size: '312 KB' },
      
      // Insurance
      { id: 'd7', title: 'Pet Insurance Policy – Helvetia', category: 'Insurance', source: 'Helvetia', date: '2021-07-01', type: 'PDF', size: '2.4 MB' },
      { id: 'd8', title: 'Claim Receipt – Vet Visit', category: 'Insurance', source: 'Helvetia', date: '2024-01-25', type: 'PDF', size: '850 KB' },
      { id: 'd9', title: 'Coverage Summary', category: 'Insurance', source: 'Helvetia', date: '2023-07-01', type: 'PDF', size: '145 KB' },
      
      // Adoption/Purchase
      { id: 'd10', title: 'Adoption Certificate', category: 'Adoption/Purchase', source: 'Zurich Animal Rescue', date: '2021-06-20', type: 'JPG', size: '2.4 MB' },
      { id: 'd11', title: 'Pedigree Certificate', category: 'Adoption/Purchase', source: 'Swiss Kennel Club', date: '2021-04-12', type: 'PDF', size: '1.8 MB' },
      { id: 'd12', title: 'Purchase Agreement', category: 'Adoption/Purchase', source: 'Breeder', date: '2021-06-15', type: 'PDF', size: '450 KB' },
      
      // Training Certificates
      { id: 'd13', title: 'Puppy School Certificate', category: 'Training Certificates', source: 'Happy Dogs Academy', date: '2021-09-30', type: 'PDF', size: '800 KB' },
      { id: 'd14', title: 'Behavior Training Completion', category: 'Training Certificates', source: 'K9 Training', date: '2022-05-15', type: 'PDF', size: '1.2 MB' },
      
      // Legal Documents
      { id: 'd15', title: 'Microchip Registration', category: 'Legal Documents', source: 'ANIS', date: '2021-06-25', type: 'PDF', size: '150 KB' },
      { id: 'd16', title: 'EU Pet Passport', category: 'Legal Documents', source: 'Vet Clinic Zurich', date: '2021-07-10', type: 'JPG', size: '3.2 MB' },
      
      // Other
      { id: 'd17', title: 'Grooming Receipt', category: 'Other', source: 'Fluffy Styles', date: '2024-03-01', type: 'JPG', size: '1.5 MB' },
      { id: 'd18', title: 'Boarding Contract', category: 'Other', source: 'Pet Resort CH', date: '2023-12-20', type: 'PDF', size: '600 KB' },
      { id: 'd19', title: 'Diet Plan – Vet', category: 'Other', source: 'Dr. Sarah Keller', date: '2023-11-05', type: 'PDF', size: '220 KB' },
      { id: 'd20', title: 'City Registration Confirmation', category: 'Other', source: 'Stadt Zürich', date: '2021-08-01', type: 'PDF', size: '340 KB' },
    ],
    milestones: [
      { id: 'm1', date: '2023-10-15', title: 'First Beach Trip', note: 'Loved the ocean!', icon: '🌊' },
      { id: 'm2', date: '2021-06-20', title: 'Adopted', note: 'Brought Luna home', icon: '🏡' }
    ],
    address: 'Bahnhofstrasse 1, 8001 Zurich',
    emergencyContacts: [
      { id: 'ec1', name: 'Alex (Owner)', relationship: 'Owner', phone: '+41 79 123 45 67', isPrimary: true },
      { id: 'ec2', name: 'Maria Schmidt', relationship: 'Partner', phone: '+41 79 987 65 43', isPrimary: false },
      { id: 'ec3', name: 'John Doe', relationship: 'Neighbor', phone: '+41 78 111 22 33', isPrimary: false },
      { id: 'ec4', name: 'Jane Smith', relationship: 'Friend', phone: '+41 76 555 44 33', isPrimary: false },
    ],
    vets: [
      { id: 'v1', clinic: 'Zurich Animal Hospital', name: 'Dr. Meier', type: 'Primary', phone: '+41 44 123 45 67', address: 'Dog Street 1, Zurich' },
      { id: 'v2', clinic: 'Tierspital Zurich (24/7)', name: '', type: 'Emergency', phone: '+41 44 999 99 99', address: 'Cat Avenue 99, Zurich' },
      { id: 'v3', clinic: 'OrthoPet Specialists', name: 'Dr. Weber', type: 'Specialist', phone: '+41 44 555 66 77', address: 'Bone Lane 5, Zurich' },
    ],
    medical: {
      allergies: [
        { id: 'a1', name: 'Bee Stings', severity: 'Severe' },
        { id: 'a2', name: 'Chicken', severity: 'Moderate' },
        { id: 'a3', name: 'Dust Mites', severity: 'Mild' },
      ],
      medications: [
        { id: 'med1', name: 'Apoquel', dosage: '16mg daily', status: 'Active' },
        { id: 'med2', name: 'NexGard', dosage: 'Monthly', status: 'Active' },
      ],
      conditions: [
        { id: 'c1', name: 'Mild Arthritis', status: 'Monitored' },
      ]
    }
  },
  {
    id: 'p2',
    name: 'Tao',
    breed: 'Domestic Shorthair',
    age: 5,
    sex: 'Male',
    weight: '5.2',
    weightUnit: 'kg',
    location: 'Zurich, CH',
    photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=300&fit=crop',
    dob: '2019-08-05',
    microchip: '981020000777123',
    color: 'Orange Tabby',
    energyLevel: 30,
    temperament: ['Independent', 'Curious', 'Calm'],
    anxietyTriggers: ['Vacuum cleaner', 'Car rides'],
    preferences: {
      treats: 'Tuna flakes',
      toys: 'Laser pointer, Cardboard boxes',
      foodBrand: 'Purina Pro Plan Indoor',
      sleepingSpot: 'On the highest shelf',
      walking: 'Indoor only'
    },
    documents: [],
    milestones: [
      { id: 'm3', date: '2020-01-10', title: 'Caught first mouse', note: 'A proud hunter', icon: '🐁' }
    ],
    address: 'Bahnhofstrasse 1, 8001 Zurich',
    emergencyContacts: [
      { id: 'ec1', name: 'Alex (Owner)', relationship: 'Owner', phone: '+41 79 123 45 67', isPrimary: true }
    ],
    vets: [
      { id: 'v1', clinic: 'City Cat Clinic', name: 'Dr. Rossi', type: 'Primary', phone: '+41 44 222 33 44', address: 'Meow Str 2, Zurich' }
    ],
    medical: { allergies: [], medications: [], conditions: [] }
  }
];

const TEMPERAMENT_OPTIONS = ['Friendly', 'Playful', 'Calm', 'Shy', 'Protective', 'Energetic', 'Independent', 'Affectionate', 'Curious', 'Stubborn'];
const COMMON_ANXIETY_TRIGGERS = ['Thunder', 'Fireworks', 'Vacuum cleaner', 'Car rides', 'Strangers', 'Other dogs', 'Loud noises', 'Vet visits'];
const RELATIONSHIP_OPTIONS = [{label: 'Owner', value: 'Owner'}, {label: 'Partner', value: 'Partner'}, {label: 'Family', value: 'Family'}, {label: 'Friend', value: 'Friend'}, {label: 'Neighbor', value: 'Neighbor'}, {label: 'Other', value: 'Other'}];
const VET_TYPE_OPTIONS = [{label: 'Primary Vet', value: 'Primary'}, {label: 'Emergency 24/7', value: 'Emergency'}, {label: 'Specialist', value: 'Specialist'}];

const INITIAL_SHARES = [
  { id: 's1', name: 'Marcus Müller', role: 'Co-owner', permission: 'Edit', added: 'Feb 1, 2026', avatar: 'https://i.pravatar.cc/150?u=marcus' },
  { id: 's2', name: 'Sarah Johnson', role: 'Dog Sitter', permission: 'View', added: 'Jan 15, 2026', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 's3', name: 'Dr. Sarah Schmidt', role: 'Vet', permission: 'View', added: 'Dec 10, 2025', avatar: 'https://i.pravatar.cc/150?u=dr_schmidt' }
];

const PERMISSION_LEVELS = [
  { id: 'view', label: 'View', description: 'Can see profile info' },
  { id: 'edit', label: 'Edit', description: 'Can view and make changes' },
];
const EXPIRY_OPTIONS = [
  { value: '1h', label: '1 hour' },
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: 'never', label: 'Never' }
];

// --- SERVICES MODULE DATA ---
const MOCK_UPCOMING_BOOKINGS = [
  {
    id: 1,
    type: 'walking',
    title: 'Dog Walking',
    provider: 'Sophie',
    providerLabel: 'Sofia L.',
    providerRating: '4.9',
    serviceSummary: '90 min Walk · Leo',
    scheduleLabel: 'Mon, Feb 16 · 10:00',
    date: 'Today, 14:00',
    location: 'Zurichhorn Park',
    status: 'confirmed'
  },
  {
    id: 2,
    type: 'sitting',
    title: 'Pet Sitting',
    provider: 'Mike T.',
    providerLabel: 'Mike T.',
    providerRating: '4.8',
    serviceSummary: 'Pet Sitting · Leo',
    scheduleLabel: 'Tomorrow · 09:00',
    date: 'Tomorrow, 09:00',
    location: 'At your home',
    status: 'pending'
  },
];

const MOCK_CATEGORIES = [
  { id: 'walking', label: 'Walking', icon: PawPrint, active: true },
  { id: 'sitting', label: 'Sitting', icon: User, active: true },
  { id: 'grooming', label: 'Grooming', icon: Scissors, active: false },
  { id: 'boarding', label: 'Boarding', icon: Home, active: false },
  { id: 'vet', label: 'Vet', icon: Stethoscope, active: false },
];
const MOCK_MORE_SERVICE_CATEGORIES = [
  { id: 'training', label: 'Training', icon: Target, active: false },
  { id: 'pet-taxi', label: 'Pet Taxi', icon: Navigation, active: false },
  { id: 'pet-hotel', label: 'Pet Hotel', icon: Home, active: false }
];

const MOCK_PROVIDERS = [
  {
    id: 'provider_001',
    name: 'Lukas F.',
    type: 'Dog Walker & Sitter',
    serviceTags: ['Dog Walking', 'Sitting'],
    rating: '4.9',
    reviews: 124,
    priceValue: 'CHF 45',
    priceUnit: '/hr',
    availability: { state: 'available', label: 'Available today' },
    cornerBadge: 'Trusted',
    trustTag: 'Verified',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 2,
    name: 'Michael Chen',
    type: 'Pet Sitter',
    serviceTags: ['Sitting', 'Grooming'],
    rating: '4.8',
    reviews: 89,
    priceValue: 'CHF 30',
    priceUnit: '/hr',
    availability: { state: 'soon', label: 'Next slot tomorrow' },
    cornerBadge: 'Top Provider',
    trustTag: '',
    avatar: 'https://i.pravatar.cc/150?u=mike'
  },
  {
    id: 3,
    name: 'Elena Rossi',
    type: 'Dog Walker',
    serviceTags: ['Dog Walking'],
    rating: '5.0',
    reviews: 42,
    priceValue: 'CHF 22',
    priceUnit: '/hr',
    availability: { state: 'booked', label: 'Fully booked' },
    cornerBadge: 'New',
    trustTag: '',
    avatar: 'https://i.pravatar.cc/150?u=elena'
  },
];

const mockProviderProfile = {
  id: 'provider_001',
  name: 'Lukas F.',
  photo: 'https://i.pravatar.cc/150?img=12',
  rating: 4.9,
  reviewCount: 124,
  totalWalks: 124,
  responseTime: '<1h',
  distance: 1.2,
  location: 'Zürich',
  bio: 'Experienced dog walker with 5 years caring for all breeds. I love energetic Golden Retrievers and enjoy long park walks. Certified in pet first aid and positive reinforcement training methods. I believe every dog deserves individual attention and plenty of exercise.',
  languages: ['English', 'German'],
  yearsExperience: 5,
  services: [
    { id: 'service_30min', type: 'walk', duration: 30, label: '30 min Walk', price: 45, currency: 'CHF', icon: '🐕', popular: false, description: 'Quick neighborhood walk' },
    { id: 'service_60min', type: 'walk', duration: 60, label: '60 min Walk', price: 60, currency: 'CHF', icon: '🐕', popular: false, description: 'Extended walk with park time' },
    { id: 'service_90min', type: 'walk', duration: 90, label: '90 min Walk', price: 75, currency: 'CHF', icon: '🐕', popular: true, description: 'Full adventure with off-leash time' }
  ],
  reviews: [
    { id: 'review_001', author: 'Sarah M.', authorPhoto: 'https://i.pravatar.cc/150?img=5', rating: 5, date: 'Feb 20, 2026', text: 'Lukas is amazing with Luna! Very punctual and sends great photos during walks. Luna is always so happy when she sees him. Highly recommend!' },
    { id: 'review_002', author: 'Tom K.', authorPhoto: 'https://i.pravatar.cc/150?img=14', rating: 5, date: 'Feb 15, 2026', text: 'Highly recommend! Great with energetic dogs. Our German Shepherd loves his walks with Lukas. Very professional and reliable.' }
  ],
  availability: {
    '2026-02-22': { available: true, slots: ['09:00', '14:00', '16:00'] },
    '2026-02-23': { available: true, slots: ['10:00', '15:00'] },
    '2026-02-24': { available: false, slots: [] },
    '2026-02-25': { available: true, slots: ['09:00', '11:00', '14:00'] },
    '2026-02-26': { available: true, slots: ['10:00', '16:00'] },
    '2026-02-27': { available: false, slots: [] },
    '2026-02-28': { available: false, slots: [] }
  },
  gallery: [
    'https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1507149833265-60c372daea22?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=300&h=300',
    'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=300&h=300'
  ],
  certifications: [
    { type: 'identity', label: 'Identity Verified', verified: true, verifiedDate: '2024-02-15', expiryDate: null },
    { type: 'insurance', label: 'Insurance', verified: true, verifiedDate: '2024-01-10', expiryDate: '2027-01-10', provider: 'Helvetia Pet Care Insurance' },
    { type: 'background-check', label: 'Background Check', verified: true, verifiedDate: '2025-01-20', expiryDate: null },
    { type: 'first-aid', label: 'Pet First Aid Certified', verified: true, verifiedDate: '2023-05-15', expiryDate: '2026-05-15', provider: 'Swiss Pet First Aid Association' }
  ],
  badges: ['Verified', 'Insured', 'BG Check', 'First Aid']
};

const mockBookingData = {
  provider: {
    id: 'provider_001',
    name: 'Lukas F.',
    services: [
      { id: 'service_30min', duration: 30, label: '30 min Walk', price: 45, popular: false },
      { id: 'service_60min', duration: 60, label: '60 min Walk', price: 60, popular: false },
      { id: 'service_90min', duration: 90, label: '90 min Walk', price: 75, popular: true }
    ],
    addOns: [
      { id: 'pickup-dropoff', label: 'Pick-up & Drop-off', description: "We'll collect your pet from your home", price: 15 },
      { id: 'photo-updates', label: 'Photo updates', description: 'Get 3-5 photos during the walk', price: 5 },
      { id: 'offleash', label: 'Off-leash park time', description: 'Extra playtime at the park', price: 10 }
    ]
  },
  availability: {
    '2026-02-24': { available: true, slots: [
      { time: '09:00', available: true },
      { time: '14:00', available: true },
      { time: '16:00', available: true }
    ]},
    '2026-02-25': { available: true, slots: [
      { time: '10:00', available: true },
      { time: '15:00', available: false }
    ]},
    '2026-02-26': { available: false, slots: [] }
  },
  userPets: [
    { id: 'pet_001', name: 'Leo', breed: 'Golden Retriever' },
    { id: 'pet_002', name: 'Tao', breed: 'French Bulldog' }
  ]
};

const addMinutesToTime = (timeStr, minutes) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + minutes, 0);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

const formatTimeRange = (startTime, duration) => {
  if (!startTime) return '';
  return `${startTime} - ${addMinutesToTime(startTime, duration)}`;
};

const calculateBookingTotal = (serviceId, addOnIds) => {
  const service = mockBookingData.provider.services.find(s => s.id === serviceId);
  const base = service ? service.price : 0;
  const addons = addOnIds.reduce((sum, id) => {
    const addon = mockBookingData.provider.addOns.find(a => a.id === id);
    return sum + (addon ? addon.price : 0);
  }, 0);
  return base + addons;
};

const MOCK_WALKERS = [
  { id: 101, name: 'Sarah Miller', avatar: 'https://i.pravatar.cc/150?u=sarah', rating: 4.9, reviews: 124, price: 45, walks: 312, availability: 'today', bio: 'Experienced walker in the heart of Zurich. I love all dog sizes and energy levels.', badges: ['Verified', 'Insured', 'First Aid'], location: 'Zürich', experience: 5, certs: ['Insurance Verified', 'First Aid Certified'] },
  { id: 102, name: 'Michael Chen', avatar: 'https://i.pravatar.cc/150?u=mike', rating: 4.8, reviews: 89, price: 55, walks: 240, availability: 'tomorrow', bio: 'Specialist in energetic breeds. Regular routes around the lake and forest trails.', badges: ['Verified', 'Training'], location: 'Zürich', experience: 3, certs: ['Background Check', 'Professional Training'] },
  { id: 103, name: 'Elena Rossi', avatar: 'https://i.pravatar.cc/150?u=elena', rating: 5.0, reviews: 42, price: 40, walks: 95, availability: 'today', bio: 'Calm and patient. Perfect for senior dogs or puppies needing gentle walks.', badges: ['Verified'], location: 'Basel', experience: 1, certs: ['Background Check'] },
  { id: 104, name: 'David Schmidt', avatar: 'https://i.pravatar.cc/150?u=david', rating: 4.6, reviews: 210, price: 35, walks: 540, availability: 'booked', bio: 'Full-time dog walker with a pack-walking approach for maximum socialization.', badges: ['Insured', 'First Aid'], location: 'Zürich', experience: 8, certs: ['Insurance Verified', 'First Aid Certified'] },
  { id: 105, name: 'Anna Weber', avatar: 'https://i.pravatar.cc/150?u=anna', rating: 4.9, reviews: 18, price: 60, walks: 45, availability: 'this-week', bio: 'Premium one-on-one attention. Photography included with every walk!', badges: ['Verified', 'Insured'], location: 'Geneva', experience: 2, certs: ['Insurance Verified'] },
  { id: 106, name: 'Lukas Meyer', avatar: 'https://i.pravatar.cc/150?u=lukas', rating: 4.7, reviews: 156, price: 50, walks: 420, availability: 'today', bio: 'Reliable and punctual. I treat your pets like my own family.', badges: ['Verified', 'Background Check'], location: 'Lausanne', experience: 4, certs: ['Background Check'] },
  { id: 107, name: 'Julia Keller', avatar: 'https://i.pravatar.cc/150?u=julia', rating: 4.5, reviews: 67, price: 30, walks: 150, availability: 'tomorrow', bio: 'Affordable and flexible walks focused on basic obedience.', badges: ['Training'], location: 'Zürich', experience: 1, certs: ['Professional Training'] },
  { id: 108, name: 'Tom Huber', avatar: 'https://i.pravatar.cc/150?u=tom', rating: 4.8, reviews: 310, price: 70, walks: 890, availability: 'booked', bio: 'Expert in large and reactive dogs. Safety is my number one priority.', badges: ['Verified', 'Insured', 'Training'], location: 'Basel', experience: 10, certs: ['Insurance Verified', 'Professional Training', 'Background Check'] },
  { id: 109, name: 'Sophie Martin', avatar: 'https://i.pravatar.cc/150?u=sophie', rating: 4.9, reviews: 92, price: 48, walks: 210, availability: 'today', bio: 'Veterinary assistant turned full-time walker. Your pet is in safe hands.', badges: ['First Aid', 'Verified'], location: 'Geneva', experience: 3, certs: ['First Aid Certified', 'Background Check'] },
  { id: 110, name: 'Marco Bianchi', avatar: 'https://i.pravatar.cc/150?u=marco', rating: 4.4, reviews: 25, price: 35, walks: 80, availability: 'this-week', bio: 'Active runner looking for energetic dogs to accompany me on trail runs.', badges: ['Insured'], location: 'Lausanne', experience: 1, certs: ['Insurance Verified'] },
  { id: 111, name: 'Nina Fischer', avatar: 'https://i.pravatar.cc/150?u=nina', rating: 5.0, reviews: 11, price: 42, walks: 30, availability: 'today', bio: 'New to FYLOS but grew up with dogs all my life. Eager to meet your furry friend!', badges: ['Verified'], location: 'Zürich', experience: 1, certs: ['Background Check'] },
  { id: 112, name: 'Stefan Wolf', avatar: 'https://i.pravatar.cc/150?u=stefan', rating: 4.7, reviews: 180, price: 65, walks: 500, availability: 'tomorrow', bio: 'Professional dog trainer offering structured walks to reinforce good behavior.', badges: ['Training', 'Verified', 'Insured'], location: 'Zürich', experience: 6, certs: ['Professional Training', 'Insurance Verified', 'Background Check'] },
];

const WALKING_SORTS = ['Recommended', 'Price: Low', 'Price: High', 'Top Rated', 'Available Now'];

const MOCK_HEALTH_DATA = {
  vaccinations: [
    { id: 'v1', name: 'Rabies', lastDate: '2023-05-10', nextDate: '2026-05-10' },
    { id: 'v2', name: 'DHPP', lastDate: '2025-03-01', nextDate: '2026-03-01' },
    { id: 'v3', name: 'Bordetella', lastDate: '2024-01-15', nextDate: '2025-01-15' },
    { id: 'v4', name: 'Leptospirosis', lastDate: '2025-05-20', nextDate: '2026-05-20' }
  ],
  vetVisits: [
    { id: 'vv1', date: '2026-01-10', reason: 'Annual Checkup', vet: 'Dr. Smith', clinic: 'Zurich Vet Center', notes: 'Everything looks great. Weight is stable.', prescriptions: 'None', followUp: 'Next year', cost: '$120' },
    { id: 'vv2', date: '2025-08-22', reason: 'Limping front right leg', vet: 'Dr. Meier', clinic: 'Zurich Vet Center', notes: 'Mild sprain. Prescribed rest and anti-inflammatories for 5 days.', prescriptions: 'Rimadyl', followUp: 'If not improved in a week', cost: '$85' }
  ],
  medications: [
    { id: 'med1', name: 'NexGard Spectra', purpose: 'Flea & Tick', dosage: '1 chewable', startDate: '2026-02-01', endDate: '2026-02-01', frequency: 'Monthly', nextDoseTime: 'Today', takenToday: false, isActive: true },
    { id: 'med2', name: 'Rimadyl', purpose: 'Pain relief', dosage: '25mg', startDate: '2025-08-22', endDate: '2025-08-27', frequency: 'Twice daily', nextDoseTime: null, takenToday: false, isActive: false }
  ],
  allergies: [
    { id: 'al1', allergen: 'Chicken', severity: 'moderate', reaction: 'Itchy skin, ear infections' },
    { id: 'al2', allergen: 'Dust Mites', severity: 'mild', reaction: 'Occasional sneezing' },
    { id: 'al3', allergen: 'Bee Sting', severity: 'severe', reaction: 'Facial swelling, requires vet immediately' }
  ],
  weightHistory: [
    { id: 'w1', date: '2025-01-10', weight: 26.5 }, { id: 'w2', date: '2025-05-15', weight: 27.2 },
    { id: 'w3', date: '2025-08-22', weight: 27.8 }, { id: 'w4', date: '2025-11-05', weight: 28.1 },
    { id: 'w5', date: '2026-01-10', weight: 28.0 }, { id: 'w6', date: '2026-02-20', weight: 28.0 }
  ],
  idealWeightRange: '26 - 29'
};

const MOCK_DASHBOARD_PETS = [
  { id: 'p1', name: 'Leo', type: 'Dog', avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop' },
  { id: 'p2', name: 'Zyon', type: 'Dog', avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=300&h=300&fit=crop' }
];
const MOCK_BOOKINGS = [
  { id: 'b1', petId: 'p1', walkerName: 'Sofia L.', walkerRating: '4.9', walkerAvatar: null, service: '90 min Walk', date: '2026-02-16T09:00:00Z', status: 'Confirmed' },
  { id: 'b2', petId: 'p2', walkerName: 'Sarah M.', walkerRating: '4.8', walkerAvatar: 'https://i.pravatar.cc/150?u=sarah', service: 'Cat Sitting', date: '2026-02-18T14:00:00Z', status: 'Pending' }
];
const MOCK_REMINDERS = [
  {
    id: 'r1',
    petId: 'p1',
    type: 'medication',
    title: 'Morning Medication',
    subtitle: 'Apoquel (16mg)',
    time: '08:00',
    action: 'complete'
  },
  {
    id: 'r2',
    petId: 'p1',
    type: 'walk',
    title: 'Afternoon Walk',
    subtitle: 'with Lukas F.',
    time: '14:00',
    action: 'complete'
  },
  {
    id: 'r3',
    petId: 'p1',
    type: 'photo',
    title: 'Photo Added',
    subtitle: 'Leo',
    time: '18:30',
    action: 'expand',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600&h=360',
    isNew: true
  },
  {
    id: 'r4',
    petId: 'p1',
    type: 'health',
    title: 'Vaccination Reminder',
    subtitle: 'Annual rabies vaccination due soon',
    time: '4d ago',
    action: 'expand',
    details: 'Annual rabies vaccination due soon',
    detailsMeta: ['Next due: Jun 14', 'Vet: Zurich Vet Clinic'],
    expandActionLabel: 'Open record'
  },
  {
    id: 'r5',
    petId: 'p2',
    type: 'medication',
    title: 'Evening Medication',
    subtitle: 'NexGard Spectra',
    time: '19:30',
    action: 'complete'
  },
  {
    id: 'r6',
    petId: 'p2',
    type: 'photo',
    title: 'Photo Added',
    subtitle: 'Zyon',
    time: 'Yesterday',
    action: 'expand',
    photoUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=600&h=360'
  },
  {
    id: 'r7',
    petId: 'p2',
    type: 'health',
    title: 'Health Reminder',
    subtitle: 'Annual blood panel check is due this month',
    time: '2d ago',
    action: 'expand',
    details: 'Annual blood panel check is due this month',
    detailsMeta: ['Next due: Mar 03', 'Clinic: Seefeld Pet Care'],
    expandActionLabel: 'Open reminder'
  }
];
const MOCK_SUGGESTIONS = [
  { id: 's1', petId: 'p1', title: 'Spring Grooming', context: 'Leo is due for a trim', icon: '✂️' },
  { id: 's2', petId: 'p2', title: 'Annual Checkup', context: 'Tao is due next month', icon: '🏥' }
];

const MOCK_BOOKINGS_LIST = [
  { id: 'booking_123', status: 'confirmed', provider: { id: 'provider_001', name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?img=12', rating: 4.9 }, service: { id: 'service_90min', label: '90 min Walk', duration: 90 }, dateTime: { date: '2026-02-24', time: '14:00', endTime: '15:30', start: '2026-02-24T14:00:00+01:00', formatted: 'Mon, Feb 24 · 14:00-15:30' }, pet: { id: 'pet_001', name: 'Leo' }, total: 95.00, helper: 'In 2 days', confirmedAt: '2026-02-22T14:35:00Z' },
  { id: 'booking_124', status: 'pending', provider: { id: 'provider_002', name: 'Maria S.', photo: 'https://i.pravatar.cc/150?u=maria', rating: 4.8 }, service: { id: 'service_60min_sitting', label: '60 min Sitting', duration: 60 }, dateTime: { date: '2026-02-26', time: '10:00', endTime: '11:00', start: '2026-02-26T10:00:00+01:00', formatted: 'Wed, Feb 26 · 10:00-11:00' }, pet: { id: 'pet_001', name: 'Leo' }, total: 65.00, helper: 'Waiting for response... Expires in 18h', requestedAt: '2026-02-22T16:00:00Z' },
  { id: 'booking_125', status: 'in-progress', provider: { id: 'provider_004', name: 'Elena R.', photo: 'https://i.pravatar.cc/150?u=elena', rating: 5.0 }, service: { id: 'service_60min_sitting', label: '60 min Sitting', duration: 60 }, dateTime: { date: '2026-02-23', time: '19:00', endTime: '20:00', start: '2026-02-23T19:00:00+01:00', formatted: 'Today · 19:00-20:00' }, pet: { id: 'pet_001', name: 'Leo' }, total: 60.00, helper: 'Started 15 minutes ago', requestedAt: '2026-02-21T16:00:00Z' },
  { id: 'booking_120', status: 'completed', provider: { id: 'provider_001', name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?img=12', rating: 4.9 }, service: { id: 'service_90min', label: '90 min Walk', duration: 90 }, dateTime: { date: '2026-02-17', time: '14:00', endTime: '15:30', start: '2026-02-17T14:00:00+01:00', formatted: 'Feb 17 · 14:00-15:30' }, pet: { id: 'pet_001', name: 'Leo' }, total: 75.00, helper: 'Reviewed', reviewed: true, completedAt: '2026-02-17T15:35:00Z' },
  { id: 'booking_119', status: 'completed', provider: { id: 'provider_003', name: 'Thomas K.', photo: 'https://i.pravatar.cc/150?u=thomas', rating: 4.9 }, service: { id: 'service_60min', label: '60 min Walk', duration: 60 }, dateTime: { date: '2026-02-10', time: '16:00', endTime: '17:00', start: '2026-02-10T16:00:00+01:00', formatted: 'Feb 10 · 16:00-17:00' }, pet: { id: 'pet_002', name: 'Tao' }, total: 60.00, helper: 'Review pending', reviewed: false, completedAt: '2026-02-10T17:05:00Z' },
  { id: 'booking_118', status: 'cancelled', provider: { id: 'provider_002', name: 'Maria S.', photo: 'https://i.pravatar.cc/150?u=maria', rating: 4.8 }, service: { id: 'service_90min_sitting', label: '90 min Sitting', duration: 90 }, dateTime: { date: '2026-02-15', start: '2026-02-15T10:00:00+01:00', formatted: 'Feb 15 · 10:00-11:30' }, pet: { id: 'pet_001', name: 'Leo' }, total: 75.00, helper: 'Cancelled by you', cancelledAt: '2026-02-14T18:00:00Z' },
  { id: 'booking_117', status: 'declined', provider: { id: 'provider_001', name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?img=12', rating: 4.9 }, service: { id: 'service_90min', label: '90 min Walk', duration: 90 }, dateTime: { date: '2026-02-12', start: '2026-02-12T14:00:00+01:00', formatted: 'Feb 12 · 14:00-15:30' }, pet: { id: 'pet_001', name: 'Leo' }, total: 75.00, helper: 'Declined: Fully booked', cancelledAt: '2026-02-10T10:00:00Z' }
];

const MOCK_VAULT_DATA = {
  pet: { id: 'pet_001', name: 'Leo', breed: 'Golden Retriever', age: 3, weight: 28, microchipId: '981020000394857' },
  emergencyBundle: { lastUpdated: 'Feb 22, 2026', shareLink: 'fylos.app/e/luna-abc123', expiresIn: '7 days' },
  criticalInfo: {
    medications: [
      { id: 'med_001', name: 'Apoquel', dosage: '16mg daily', active: true },
      { id: 'med_002', name: 'NexGard', dosage: 'Monthly', active: true }
    ],
    allergies: [
      { id: 'all_001', allergen: 'Bee Stings', severity: 'SEVERE' },
      { id: 'all_002', allergen: 'Chicken', severity: 'MODERATE' },
      { id: 'all_003', allergen: 'Dust Mites', severity: 'MILD' }
    ],
    vaccinations: [
      { id: 'vac_001', name: 'Rabies', statusText: 'Valid until Dec 2026', isWarning: false },
      { id: 'vac_002', name: 'DHPP', statusText: 'Expires in 8 days', isWarning: true }
    ]
  },
  emergencyContacts: [
    { id: 'c_001', name: 'Alex (Owner)', type: 'PRIMARY', phone: '+41 79 123 4567' },
    { id: 'c_002', name: 'Zurich Animal Hospital', type: 'PRIMARY VET', phone: '+41 44 123 4567' },
    { id: 'c_003', name: 'Tierspital Zurich (24/7)', type: 'EMERGENCY VET', phone: '+41 44 987 6543' }
  ],
  recentDocuments: [
    { id: 'd_001', title: 'Rabies Vaccination', type: 'PDF', size: 1258291, date: 'May 2023', icon: FileText },
    { id: 'd_002', title: 'Blood Test Results', type: 'PDF', size: 870400, date: 'Jan 2026', icon: FileText }
  ]
};

const deriveVaultPreviewData = (data) => ({
  ...data,
  criticalInfo: {
    medications: data.criticalInfo.medications.filter(m => m.active),
    allergies: data.criticalInfo.allergies.filter(a => ['SEVERE', 'MODERATE'].includes(a.severity)),
    vaccinations: data.criticalInfo.vaccinations.filter(v => v.isWarning).slice(0, 2)
  }
});

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const calculatePlaceDistance = (place, userLocation) => {
  const R = 6371;
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(place.location.lat - userLocation.lat);
  const dLon = toRad(place.location.lng - userLocation.lng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(userLocation.lat)) * Math.cos(toRad(place.location.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1) + ' km';
};

const renderLegacyIcon = (icon, size = 18, className = '') => {
  const map = {
    '🌊': Wind,
    '🏡': Home,
    '🐁': PawPrint,
    '🐕': PawPrint,
    '🦮': PawPrint,
    '💊': Pill,
    '💧': Droplets,
    '✂️': Scissors,
    '🏥': Stethoscope,
    '⚠️': AlertTriangle,
    '🚨': ShieldAlert,
    '👤': User,
    '📍': MapPin,
    '🌳': Trees,
    '🏪': Store,
    '☕': Coffee,
    '🌟': Sparkles
  };
  const Icon = map[icon] || CircleAlertFallback;
  return <Icon size={size} className={className} strokeWidth={1.8} />;
};

const CircleAlertFallback = ({ size = 18, className = '', strokeWidth = 1.8 }) => (
  <AlertCircle size={size} className={className} strokeWidth={strokeWidth} />
);

const renderPlaceStars = (rating) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center gap-[2px] text-[#FFB800]">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={10} className={i < Math.floor(rating) ? 'fill-[#FFB800] text-[#FFB800]' : 'text-[#D6D6DB]'} strokeWidth={1.8} />
      ))}
    </div>
    <span className="text-[12px] font-medium text-[#8A8A8A] ml-0.5">({rating.toFixed(1)})</span>
  </div>
);

const MOCK_VAULT_HEALTH_DATA = {
  pet: { id: 'pet_001', name: 'Leo', breed: 'Golden Retriever', age: 3 },
  summary: {
    lastVetVisit: { id: 'visit_001', date: '2026-01-10', reason: 'Annual Checkup', vet: 'Dr. Sarah Schmidt' },
    currentWeight: { value: 28, unit: 'kg', idealRange: { min: 26, max: 29 } },
    activeMedicationsCount: 2,
    allergiesCount: 3,
    severeAllergiesCount: 1
  },
  vaccinations: [
    { id: 'vac_001', name: 'Rabies', nextDue: '2026-12-15', status: 'valid', daysUntilExpiry: 297 },
    { id: 'vac_002', name: 'DHPP', nextDue: '2026-03-02', status: 'expiring', daysUntilExpiry: 8 },
    { id: 'vac_003', name: 'Bordetella', nextDue: '2026-08-15', status: 'valid', daysUntilExpiry: 175 }
  ],
  medications: {
    active: [
      { id: 'med_001', name: 'Apoquel', dosage: '16mg', frequency: 'Daily', startDate: '2025-01-15' },
      { id: 'med_002', name: 'NexGard Spectra', dosage: '1 chewable', frequency: 'Monthly', nextDose: '2026-03-01' }
    ]
  },
  allergies: [
    { id: 'allergy_001', allergen: 'Bee Stings', severity: 'severe', reaction: 'Anaphylaxis' },
    { id: 'allergy_002', allergen: 'Chicken', severity: 'moderate', reaction: 'Digestive issues' },
    { id: 'allergy_003', allergen: 'Dust Mites', severity: 'mild', reaction: 'Sneezing' }
  ],
  vetVisits: [
    { id: 'visit_001', date: '2026-01-10', reason: 'Annual Checkup', vet: 'Dr. Sarah Schmidt' },
    { id: 'visit_002', date: '2025-08-22', reason: 'Limping front right leg', vet: 'Dr. Sarah Schmidt' }
  ],
  weightHistory: [
    { date: '2026-02-15', weight: 28 },
    { date: '2026-01-15', weight: 28.5 },
    { date: '2025-12-15', weight: 27 },
    { date: '2025-11-15', weight: 27.5 },
    { date: '2025-10-15', weight: 28 },
    { date: '2025-09-15', weight: 27 }
  ]
};

const MOCK_VAULT_EMERGENCY_CONTACTS = {
  pet: { id: 'pet_001', name: 'Leo', breed: 'Golden Retriever' },
  emergencySigns: ['Difficulty breathing', 'Seizures', 'Severe bleeding', 'Bee sting (SEVERE allergy)', 'Unconsciousness', 'Choking'],
  emergencyContacts: [
    { id: 'contact_001', name: 'Alex', relationship: 'Owner', phone: '+41 79 123 4567', email: 'alex@example.com', priority: 'PRIMARY', notes: 'Always available, key holder' },
    { id: 'contact_002', name: 'Maria Schmidt', relationship: 'Partner', phone: '+41 79 987 6543', email: 'maria@example.com', priority: 'SECONDARY', notes: 'Works from home' }
  ],
  veterinaryContacts: [
    {
      id: 'vet_001', type: 'primary', name: 'Zurich Animal Hospital', vetName: 'Dr. Sarah Schmidt', phone: '+41 44 123 4567',
      email: 'info@zurichvet.ch', website: 'https://www.zurichvet.ch', address: { full: 'Bahnhofstrasse 10, 8001 Zurich, Switzerland' },
      hoursFormatted: 'Mon-Fri: 8:00-18:00\nSat: 9:00-14:00', available24_7: false
    },
    {
      id: 'vet_002', type: 'emergency', name: 'Tierspital Zurich', vetName: null, phone: '+41 44 987 6543',
      email: 'emergency@tierspital.ch', website: 'https://www.tierspital.ch', address: { full: 'Winterthurerstrasse 260, 8057 Zurich, Switzerland' },
      hoursFormatted: 'Open 24/7', available24_7: true
    }
  ],
  emergencyProtocols: [
    {
      id: 'protocol_001', icon: '⚠️', title: 'Bee Sting (SEVERE allergy)', severity: 'critical',
      summary: ['Call emergency vet', 'Administer EpiPen if trained', 'Monitor breathing'],
      fullSteps: [
        { step: 1, title: 'Call emergency vet', description: 'Contact emergency vet immediately', phone: '+41 44 987 6543' },
        { step: 2, title: 'Remove stinger', description: "Scrape stinger out, don't squeeze" },
        { step: 3, title: 'Monitor breathing', description: 'Watch for swelling, check gum color' }
      ]
    }
  ]
};

const DOC_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'medical', label: 'Medical' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'adoption', label: 'Adoption/Purchase' },
  { id: 'photos', label: 'Photos' },
  { id: 'other', label: 'Other' }
];

const MOCK_VAULT_DOCS = [
  { id: 'doc_001', title: 'Rabies Vaccination', category: 'medical', type: 'pdf', size: 1228800, date: 'May 10, 2023', source: 'Vet Clinic Zurich' },
  { id: 'doc_002', title: 'Blood Test Results', category: 'medical', type: 'pdf', size: 870400, date: 'Jan 15, 2026', source: 'Tierarzt Zurich', notes: 'Annual checkup' },
  { id: 'doc_003', title: 'X-Ray - Front Leg', category: 'medical', type: 'image', size: 2457600, date: 'Aug 22, 2025', source: 'Tierarzt Zurich' },
  { id: 'doc_004', title: 'DHPP Vaccination Record', category: 'medical', type: 'pdf', size: 654000, date: 'Mar 02, 2025', source: 'Vet Clinic Zurich' },
  { id: 'doc_005', title: 'Pet Insurance Policy', category: 'insurance', type: 'pdf', size: 552960, date: 'Jan 01, 2024', source: 'Helvetia Insurance' },
  { id: 'doc_006', title: 'Insurance Card', category: 'insurance', type: 'image', size: 1153433, date: 'Jan 01, 2024', source: 'Helvetia Insurance' },
  { id: 'doc_007', title: 'Adoption Certificate', category: 'adoption', type: 'image', size: 2516582, date: 'Jun 20, 2021', source: 'Zurich Animal Rescue' },
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `photo_${i}`, title: `Photo ${i + 1}`, category: 'photos', type: 'image', size: 3145728, date: 'Feb 15, 2026', source: null, url: `https://picsum.photos/seed/luna${i}/150/150`
  }))
];

const MOCK_VAULT_PLACES = {
  pet: { id: 'pet_001', name: 'Leo', breed: 'Golden Retriever' },
  userLocation: { lat: 47.3667, lng: 8.5500 },
  categories: [
    { id: 'all', label: 'All', count: 5, icon: '📍' },
    { id: 'parks', label: 'Parks', count: 2, icon: '🌳' },
    { id: 'groomers', label: 'Groomers', count: 1, icon: '✂️' },
    { id: 'pet-stores', label: 'Pet Stores', count: 1, icon: '🏪' },
    { id: 'restaurants', label: 'Cafes', count: 1, icon: '☕' }
  ],
  places: [
    { id: 'place_001', category: 'parks', name: 'Zurichhorn Park', icon: '🌳', rating: 5.0, address: { full: 'Seestrasse, 8008 Zurich, Switzerland' }, location: { lat: 47.3547, lng: 8.5496 }, phone: null, website: null, notes: "Luna's favorite park! Great off-leash area with lake access.", tags: ['Off-leash', 'Lake', 'Quiet'], visitCount: 12, lastVisit: '2026-02-20', photos: ['url1', 'url2', 'url3'] },
    { id: 'place_002', category: 'parks', name: 'Rieterpark', icon: '🌳', rating: 4.0, address: { full: 'Gablerstrasse, 8002 Zurich, Switzerland' }, location: { lat: 47.3589, lng: 8.5253 }, phone: null, website: null, notes: 'Good for training sessions. Quieter than Zurichhorn.', tags: ['Training', 'Quiet'], visitCount: 5, lastVisit: '2026-01-15', photos: [] },
    { id: 'place_003', category: 'groomers', name: 'Paws & Claws Grooming', icon: '✂️', rating: 5.0, address: { full: 'Bahnhofstrasse 25, 8001 Zurich, Switzerland' }, location: { lat: 47.3769, lng: 8.5417 }, phone: '+41 44 555 1234', website: 'https://www.pawsandclaws.ch', notes: 'Excellent with Golden Retrievers!', tags: ['Professional', 'Gentle'], visitCount: 8, lastVisit: '2025-12-10', nextAppointment: 'Mar 15, 2026', photos: [] },
    { id: 'place_004', category: 'pet-stores', name: 'Qualipet Zurich', icon: '🏪', rating: 4.0, address: { full: 'Europaallee 33, 8004 Zurich, Switzerland' }, location: { lat: 47.3782, lng: 8.5306 }, phone: '+41 44 555 2345', website: 'https://www.qualipet.ch', notes: 'Wide selection, good prices on food.', tags: ['Food', 'Toys'], visitCount: 15, lastVisit: '2026-02-18', photos: [] },
    { id: 'place_005', category: 'restaurants', name: 'Cafe Felix', icon: '☕', rating: 5.0, address: { full: 'Bellevue, 8001 Zurich, Switzerland' }, location: { lat: 47.3667, lng: 8.5458 }, phone: '+41 44 555 3456', website: 'https://www.cafefelix.ch', notes: 'Outdoor seating with water bowls provided.', tags: ['Dog-friendly', 'Outdoor'], visitCount: 6, lastVisit: '2026-02-15', photos: ['url1'] }
  ]
};

// --- THEME & TOKENS ---
const THEME = {
  colors: {
    accent: '#E85D2A',
    accentHover: '#D04A1C',
    primaryText: '#111111',
    secondaryText: '#6E6E73',
    tertiaryText: '#8E8E93',
    background: '#F9F9FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F2F7',
    danger: '#FF3B30',
    success: '#00C060',
    warning: '#FF9500',
    info: '#007AFF',
    divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)',
    active: '0 8px 30px rgba(0,0,0,0.06)'
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    :root {
      --color-accent: #E85D2A;
      --color-accent-hover: #D04A1C;
      --color-primary-text: #111111;
      --color-secondary-text: #6E6E73;
      --color-tertiary-text: #8E8E93;
      --color-background: #F9F9FB;
      --color-surface: #FFFFFF;
      --color-surface-hover: #F2F2F7;
      --color-border: rgba(0, 0, 0, 0.04);
      --color-danger: #FF3B30;
      --color-danger-bg: #FFF0F0;
      --color-success: #34C759;
      --color-success-bg: #E5F9ED;
      --color-warning: #FF9500;
      --color-warning-bg: #FFF4E5;
      --color-info: #007AFF;
      --color-info-bg: #E5F0FF;
      --radius-sm: 8px;
      --radius-md: 16px;
      --radius-lg: 20px;
      --radius-full: 9999px;
      --shadow-level-1: 0 2px 8px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(0,0,0,0.03);
      --shadow-level-2: 0 10px 40px rgba(0,0,0,0.06), inset 0 0 0 1px rgba(0,0,0,0.04);
      --shadow-active-glow: 0 0 0 1px rgba(232,93,42,0.15), 0 4px 12px rgba(232,93,42,0.1);
      --motion-fast: 120ms;
      --motion-normal: 200ms;
      --motion-slow: 300ms;
      --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  `}} />
);

// --- DESIGN SYSTEM COMPONENTS ---

const Text = ({ variant = 'body', className = '', children, ...props }) => {
  const variants = {
    title: "text-[22px] font-semibold text-[var(--color-primary-text)] tracking-tight",
    subtitle: "text-[16px] font-medium text-[var(--color-primary-text)] tracking-tight",
    body: "text-[15px] text-[var(--color-primary-text)] leading-relaxed opacity-90",
    caption: "text-[13px] text-[var(--color-secondary-text)] opacity-80",
    label: "text-[12px] font-medium text-[var(--color-secondary-text)] uppercase tracking-widest opacity-70"
  };
  return <div className={`${variants[variant]} ${className}`} {...props}>{children}</div>;
};

const Spinner = ({ size = 'medium', color = 'primary', className = '' }) => {
  const sizes = { small: 16, medium: 24, large: 32 };
  const colors = { primary: THEME.colors.accent, grey: THEME.colors.tertiaryText, white: '#FFFFFF' };
  return <Loader2 className={`animate-spin ${className}`} size={sizes[size] || sizes.medium} color={colors[color] || color} />;
};

const Divider = ({ spacing = 'medium', className = '' }) => {
  const spacings = { small: 'my-2', medium: 'my-4', large: 'my-8' };
  return <div className={`w-full h-[1px] bg-[var(--color-border)] ${spacings[spacing]} ${className}`} />;
};

const IconWrapper = ({ icon: Icon, color = THEME.colors.primaryText, size = 24, strokeWidth = 2, className = '' }) => (
  <div className={`flex items-center justify-center shrink-0 ${className}`}>
    <Icon color={color} size={size} strokeWidth={strokeWidth} />
  </div>
);

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-[var(--color-surface)] text-[var(--color-secondary-text)] border border-[var(--color-border)]",
    primary: "bg-[#111111] text-white border border-[#111111]",
    count: "bg-[#FF3B30] text-white px-1.5 py-0 min-w-[18px] justify-center text-[10px]",
    success: "bg-[var(--color-success-bg)] text-[var(--color-success)]",
    warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
    error: "bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
    info: "bg-[var(--color-info-bg)] text-[var(--color-info)]"
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-bold rounded-full px-2.5 py-1 uppercase tracking-wide leading-none ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Avatar = ({ src, initials, size = 48, badge, badgeColor = THEME.colors.danger, onClick, className = '' }) => {
  const fontSize = size * 0.4;
  return (
    <div 
      className={`relative inline-flex flex-shrink-0 ${onClick ? 'cursor-pointer active:opacity-80 transition-opacity' : ''} ${className}`} 
      style={{ width: size, height: size }}
      onClick={onClick}
    >
      {src ? (
        <img src={src} className="w-full h-full rounded-full object-cover border border-[var(--color-border)]" alt="Avatar" />
      ) : (
        <div className="w-full h-full rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary-text)] font-semibold" style={{ fontSize }}>
          {initials}
        </div>
      )}
      {badge && (
        <div 
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center px-1 text-[10px] font-bold text-white z-10"
          style={{ backgroundColor: badgeColor }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'medium', fullWidth = true, icon: Icon, isLoading, disabled, className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center font-medium transition-all duration-[var(--motion-fast)] ease-[var(--ease-default)] active:scale-[0.97] overflow-hidden gap-2 outline-none";
  const variants = {
    primary: "bg-[#E85D2A] text-white hover:opacity-95",
    secondary: "bg-[#F3EFEB] text-[#6E6058] border border-[#EDE8E2]",
    destructive: "bg-[#FFF5F0] text-[#E85D2A] border border-[#FFE0D0]",
    destructiveOutline: "bg-transparent text-[#E85D2A] border border-[#FFE0D0]",
    ghost: "bg-transparent text-[#A09A94]"
  };
  const sizes = {
    small: "px-3 py-2 text-[13px] rounded-[10px]",
    medium: "px-4 py-3 text-[14px] rounded-[12px]",
    large: "px-6 py-3.5 text-[15px] rounded-[14px]"
  };
  const isDisabled = disabled || isLoading;
  const disabledStyles = isDisabled ? "bg-[var(--color-surface-hover)] text-[var(--color-tertiary-text)] shadow-none cursor-not-allowed active:scale-100" : "";
  const widthClass = fullWidth ? "w-full" : "w-auto inline-flex";

  return (
    <button 
      disabled={isDisabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Spinner size="small" color={variant === 'primary' ? 'white' : 'primary'} />
      ) : (
        <>
          {Icon && <Icon size={size === 'small' ? 16 : 20} />}
          {children}
        </>
      )}
    </button>
  );
};

const Card = ({ variant = 'default', clickable, children, className = '', ...props }) => {
  const baseStyles = "transition-all duration-[150ms] ease-out";
  const variants = {
    default: "bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-level-1)]",
    compact: "bg-[var(--color-surface)] rounded-[var(--radius-md)] p-4 shadow-[var(--shadow-level-1)]",
    highlighted: "bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-5 shadow-[var(--shadow-active-glow)] border-l-[3px] border-l-[var(--color-accent)]",
    grey: "bg-[var(--color-surface-hover)] rounded-[var(--radius-lg)] p-5 shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]",
    list: "bg-[var(--color-surface)] rounded-[var(--radius-lg)] p-0 shadow-[var(--shadow-level-1)] overflow-hidden"
  };
  const interactive = clickable ? "cursor-pointer hover:shadow-[var(--shadow-level-2)] active:-translate-y-[1px] active:scale-[0.99]" : "";
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${interactive} ${className}`} {...props}>
      {children}
    </div>
  );
};

const TextInput = ({ label, error, helperText, disabled, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className} ${disabled ? 'opacity-50' : ''}`}>
    {label && <label className="text-[12px] font-semibold text-[#A09A94] ml-0.5">{label}</label>}
    <input
      disabled={disabled}
      className={`w-full h-[46px] px-4 text-[15px] font-medium text-[#111] rounded-[12px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E85D2A]/15 ${
        error ? 'border-[#E85D2A] focus:border-[#E85D2A]' : 'border-[#EDE8E2] focus:border-[#E85D2A]'
      } placeholder:text-[#C4BBB3]`}
      style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
      {...props}
    />
    {error ? (
      <span className="text-[12px] text-[#FF3B30] ml-1 flex items-center gap-1"><AlertCircle size={12}/>{error}</span>
    ) : helperText ? (
      <span className="text-[12px] text-[var(--color-tertiary-text)] ml-1">{helperText}</span>
    ) : null}
  </div>
);

const SearchInput = ({ value, onChange, onClear, placeholder = 'Search...', className = '' }) => (
   <div className={`relative flex items-center w-full ${className}`}>
     <div className="absolute left-4 text-[var(--color-tertiary-text)] pointer-events-none">
       <Search size={18} strokeWidth={2.5} />
     </div>
     <input 
       type="text"
       value={value}
       onChange={onChange}
       placeholder={placeholder}
       className="w-full h-[48px] pl-11 pr-11 bg-[var(--color-surface)] text-[var(--color-primary-text)] rounded-[var(--radius-md)] text-[16px] placeholder:text-[var(--color-tertiary-text)] focus:outline-none focus:bg-[var(--color-background)] focus:border focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent)]/10 transition-all duration-200 border border-transparent"
     />
     {value && (
       <button onClick={onClear} className="absolute right-4 text-[var(--color-tertiary-text)] hover:text-[var(--color-primary-text)] transition-colors p-1 rounded-full active:bg-black/5">
         <X size={16} strokeWidth={2.5} />
       </button>
     )}
   </div>
);

const Select = ({ label, options = [], value, onChange, disabled, className = '' }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className} ${disabled ? 'opacity-50' : ''}`}>
    {label && <label className="text-[13px] font-medium text-[var(--color-secondary-text)] ml-1">{label}</label>}
    <div className="relative">
      <select 
        disabled={disabled}
        value={value}
        onChange={onChange}
        className="w-full h-[52px] px-4 pr-10 bg-[var(--color-background)] border border-[var(--color-border)] text-[16px] text-[var(--color-primary-text)] rounded-[var(--radius-md)] appearance-none transition-all duration-200 focus:outline-none focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent)]/10"
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-tertiary-text)]">
        <ChevronDown size={18} />
      </div>
    </div>
  </div>
);

/* Card Modal — centered, for edit/save actions */
const CardModal = ({ isOpen, onClose, title, footer, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isOpen) { setRender(true); const t = setTimeout(() => setVisible(true), 30); return () => clearTimeout(t); }
    else { setVisible(false); const t = setTimeout(() => setRender(false), 300); return () => clearTimeout(t); }
  }, [isOpen]);
  if (!render) return null;
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center px-6 pointer-events-auto">
      <div className={`absolute inset-0 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }} onClick={onClose} />
      <div className={`relative w-full max-w-[320px] max-h-[80vh] rounded-[20px] flex flex-col transition-all duration-300 ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.95]'}`}
        style={{ background: '#FBF9F7', boxShadow: '0 16px 48px rgba(0,0,0,0.12)', transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>
        <div className="px-5 pt-5 pb-0 shrink-0">
          <div className="flex items-center justify-between">
            {title && <h3 className="text-[16px] font-bold text-[#111]">{title}</h3>}
            <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center active:scale-[0.9]" style={{ background: '#F3EFEB' }}><X size={14} className="text-[#A09A94]" /></button>
          </div>
        </div>
        <div className="px-5 py-4 overflow-y-auto min-h-0 flex-1" style={{ scrollbarWidth: 'none' }}>{children}</div>
        {footer && <div className="px-5 pb-5 pt-0 shrink-0">{footer}</div>}
      </div>
    </div>
  );
};

/* Bottom Sheet — slides up from bottom, for info/browse sections */
const BottomSheet = ({ isOpen, onClose, title, footer, snap, lockExpanded, fixedHeight, bodyScrollable = true, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (isOpen) { setRender(true); const t = setTimeout(() => setVisible(true), 30); return () => clearTimeout(t); }
    else { setVisible(false); const t = setTimeout(() => setRender(false), 300); return () => clearTimeout(t); }
  }, [isOpen]);
  if (!render) return null;
  return (
    <div className="absolute inset-0 z-[100] overflow-hidden pointer-events-auto flex flex-col justify-end">
      <div className={`absolute inset-0 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }} onClick={onClose} />
      <div className={`relative w-full rounded-t-[20px] flex flex-col transition-all duration-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        style={{ background: '#FBF9F7', boxShadow: '0 -8px 40px rgba(0,0,0,0.1)', maxHeight: fixedHeight || '85%', transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)', paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}>
        <div className="px-5 pt-4 pb-2 shrink-0 flex items-center justify-between">
          {title && <h3 className="text-[16px] font-bold text-[#111]">{title}</h3>}
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center active:scale-[0.9]" style={{ background: '#F3EFEB' }}><X size={14} className="text-[#A09A94]" /></button>
        </div>
        <div className={`px-5 pb-6 ${bodyScrollable ? 'overflow-y-auto' : 'overflow-hidden'} min-h-0 flex-1`} style={{ scrollbarWidth: 'none' }}>{children}</div>
        {footer && <div className="px-5 pb-6 pt-2 shrink-0 border-t border-[#EDE8E2]">{footer}</div>}
      </div>
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-[var(--motion-normal)] ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/20 ${checked ? 'bg-[var(--color-success)]' : 'bg-[var(--color-surface-hover)]'}`}
  >
    <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-[var(--shadow-level-1)] transition-transform duration-[220ms] ease-[var(--ease-spring)] ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
  </button>
);

const SegmentedControl = ({ segments, activeIndex, onChange, className = '' }) => {
  return (
    <div className={`flex bg-[var(--color-surface-hover)] p-1 rounded-[14px] relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] ${className}`}>
      <div 
        className="absolute top-1 bottom-1 bg-[var(--color-surface)] rounded-[10px] shadow-[var(--shadow-level-1)] transition-all duration-[220ms] ease-[var(--ease-spring)]"
        style={{ width: `calc(${100 / segments.length}% - 4px)`, left: `calc(${(100 / segments.length) * activeIndex}% + 2px)` }}
      />
      {segments.map((seg, i) => (
        <button
          key={seg}
          onClick={() => onChange(i)}
          className={`relative z-10 flex-1 py-1.5 text-[13px] transition-colors duration-[var(--motion-normal)] ${activeIndex === i ? 'font-semibold text-[var(--color-primary-text)]' : 'font-medium text-[var(--color-secondary-text)] opacity-70'}`}
        >
          {seg}
        </button>
      ))}
    </div>
  );
};

const ListRow = ({ icon: Icon, avatar, title, subtitle, rightAccessory, onClick, className = '' }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-4 py-3 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-all duration-[var(--motion-fast)] hover:bg-[var(--color-surface-hover)] px-2 -mx-2 rounded-[var(--radius-sm)]' : ''} ${className}`}
  >
    {avatar ? <Avatar {...avatar} size={avatar.size || 40} /> : Icon && (
      <div className="w-10 h-10 rounded-full bg-[var(--color-surface-hover)] flex items-center justify-center shrink-0">
        <Icon size={18} color={THEME.colors.accent} strokeWidth={1.5} />
      </div>
    )}
    <div className="flex-1 flex flex-col justify-center min-w-0">
      <span className="text-[16px] font-semibold text-[var(--color-primary-text)] truncate">{title}</span>
      {subtitle && <span className="text-[13px] text-[var(--color-secondary-text)] truncate">{subtitle}</span>}
    </div>
    {rightAccessory && <div className="shrink-0 ml-2 text-[var(--color-tertiary-text)] flex items-center">{rightAccessory}</div>}
  </div>
);

const EmptyState = ({ icon: Icon, illustration, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] px-6 text-center">
    {illustration ? (
      <div className="mb-6">{illustration}</div>
    ) : (
      <div className="w-20 h-20 rounded-full bg-[#F7F7F8] flex items-center justify-center mb-6">
        <Icon size={32} color="#CFCFD4" strokeWidth={1.5} />
      </div>
    )}
    <h2 className="text-[20px] font-semibold text-[#111111] mb-2">{title}</h2>
    <p className="text-[15px] text-[#6E6E73] max-w-[260px] leading-relaxed mb-8">
      {description}
    </p>
    {actionLabel && onAction && (
      <Button variant="primary" onClick={onAction} fullWidth={false} className="min-w-[160px]">
        {actionLabel}
      </Button>
    )}
  </div>
);

/**
 * Enhanced Header Component (Supports Actions & Dynamic Titles)
 */
const Header = ({ title, variant = 'default', user, onBack, onRightAction, rightIcon: RightIcon, rightActions, onSearch, onInbox, onProfile, unreadCount = 0, showActions = true }) => {
  const handleAction = (action) => alert(`${action} — Coming in future steps`);

  return (
    <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none bg-gradient-to-b from-[var(--color-background)] to-transparent">
      {variant === 'default' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <h1 className="font-bold tracking-tight text-[var(--color-primary-text)] ml-1 flex items-center">
            <FylosLogo text={title || 'FYLOS'} fontSize="22px" textColor="var(--color-primary-text)" />
          </h1>
          {showActions && (
            <div className="flex items-center gap-2">
              <button onClick={onInbox || (() => handleAction('Inbox'))} className="relative w-[38px] h-[38px] flex items-center justify-center rounded-full active:scale-[0.95] transition-all" style={{ background: '#F3EFEB' }}>
                <Bell size={17} className="text-[#6E6058]" strokeWidth={1.8} />
                {unreadCount > 0 && <span className="absolute top-[6px] right-[7px] w-[7px] h-[7px] bg-[#E85D2A] rounded-full border-[1.5px] border-[var(--color-background)]" />}
              </button>
              <button onClick={onProfile || (() => handleAction('Profile'))} className="w-[38px] h-[38px] rounded-full active:scale-[0.95] transition-all overflow-hidden border-2 border-[#EDE8E2]">
                <img src={user?.avatar || 'https://i.pravatar.cc/150?u=alex_fylos'} alt={user?.name || 'Profile'} className="w-full h-full object-cover" />
              </button>
            </div>
          )}
        </div>
      )}

      {variant === 'detail' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button onClick={onBack || (() => handleAction('Back'))} className="w-[44px] h-[44px] flex items-center justify-center bg-[var(--color-surface)] shadow-[var(--shadow-level-1)] rounded-[var(--radius-full)] active:scale-[0.97] transition-all duration-[var(--motion-fast)]">
            <ChevronLeft size={20} color="var(--color-primary-text)" strokeWidth={1.5} />
          </button>
          <h2 className="text-[17px] font-semibold text-[var(--color-primary-text)] tracking-tight">{title}</h2>
          {rightActions ? (
            <div className="flex items-center bg-[var(--color-surface)] rounded-full p-1 h-[36px] shadow-[var(--shadow-level-1)]">
              {rightActions}
            </div>
          ) : (
            <button onClick={onRightAction || (() => handleAction('Menu'))} className="w-[44px] h-[44px] flex items-center justify-center bg-[var(--color-surface)] shadow-[var(--shadow-level-1)] rounded-[var(--radius-full)] active:scale-[0.97] transition-all duration-[var(--motion-fast)]">
              {RightIcon ? <RightIcon size={20} color="var(--color-primary-text)" strokeWidth={1.5} /> : <MoreHorizontal size={20} color="var(--color-primary-text)" strokeWidth={1.5} />}
            </button>
          )}
        </div>
      )}
    </header>
  );
};

const TabBar = ({ activeTab, onTabChange, visible = true }) => (
  <nav className={`absolute bottom-[22px] left-0 w-full px-5 z-40 pointer-events-none transition-all duration-250 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} role="tablist">
    <div className="pointer-events-auto bg-white/70 backdrop-blur-xl shadow-[var(--shadow-level-2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] rounded-[var(--radius-full)] h-[55px] flex justify-between items-center px-0.5">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button key={tab.id} role="tab" aria-selected={isActive} onClick={() => onTabChange(tab.id)} className="relative flex-1 h-full flex flex-col items-center justify-center gap-[3px] group transition-all duration-[var(--motion-fast)] active:scale-[0.95]">
            <div className={`relative z-10 flex items-center justify-center transition-all duration-[var(--motion-normal)] ease-[var(--ease-default)] ${isActive ? 'text-[var(--color-accent)] scale-110' : 'text-[var(--color-tertiary-text)] opacity-60'}`}>
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
            </div>
            <span className={`text-[10px] font-medium leading-none transition-all duration-[var(--motion-normal)] ease-[var(--ease-default)] ${isActive ? 'text-[var(--color-accent)] opacity-100' : 'text-[var(--color-tertiary-text)] opacity-0'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

const ScreenContainer = ({ children, isLocked, hidePadding = false, onScroll }) => {
  const handleContainerScroll = (e) => {
    onScroll?.(e);
    window.dispatchEvent(new CustomEvent('fylos-main-scroll', { detail: { scrollTop: e.currentTarget.scrollTop } }));
  };
  return (
    <div onScroll={handleContainerScroll} className={`absolute inset-0 overflow-x-hidden bg-[var(--color-background)] bg-grain custom-scrollbar ${isLocked ? 'overflow-y-hidden' : 'overflow-y-auto'}`}>
      <div className={hidePadding ? 'min-h-full' : 'min-h-full pt-[110px] pb-[120px]'}>
        {children}
      </div>
    </div>
  );
};

const useDirectionalCollapseProgress = (maxProgress, options = {}) => {
  const { hideFactor = 1, showFactor = 2.2, topReset = 8, snapOpenDelta = null } = options;
  const [progress, setProgress] = useState(0);
  const lastScrollTopRef = useRef(0);

  const handleScroll = useCallback((eOrScrollTop) => {
    const currentY = typeof eOrScrollTop === 'number'
      ? eOrScrollTop
      : (eOrScrollTop?.currentTarget?.scrollTop ?? 0);

    const rawDelta = currentY - lastScrollTopRef.current;
    const delta = Math.max(-36, Math.min(36, rawDelta));
    lastScrollTopRef.current = currentY;

    if (currentY <= topReset) {
      setProgress(0);
      return;
    }
    if (snapOpenDelta !== null && delta <= -Math.abs(snapOpenDelta)) {
      setProgress(0);
      return;
    }

    setProgress((prev) => {
      if (delta > 0) return Math.min(maxProgress, prev + (delta * hideFactor));
      if (delta < 0) return Math.max(0, prev + (delta * showFactor));
      return prev;
    });
  }, [maxProgress, hideFactor, showFactor, topReset, snapOpenDelta]);

  const reset = useCallback(() => {
    lastScrollTopRef.current = 0;
    setProgress(0);
  }, []);

  return { progress, handleScroll, reset };
};

const Toast = ({ message }) => {
  if (!message) return null;
  return (
    <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[var(--color-surface)] text-[var(--color-primary-text)] px-5 py-3 rounded-full shadow-[var(--shadow-level-2)] text-[14px] font-medium flex items-center gap-2">
        <CheckCircle2 size={16} className="text-[var(--color-success)]" />
        {message}
      </div>
    </div>
  );
};

// --- PETS MODULE COMPONENTS (STEP 4) ---

const PetProfileHeader = ({ pet, showToast }) => (
  <div className="px-5 pt-2 pb-5" style={{ animation: 'homeReveal 0.4s 0.05s cubic-bezier(0.22,1,0.36,1) both' }}>
    {/* Hero row — photo + info + mascot */}
    <div className="flex gap-4 items-center mb-4">
      <div className="relative shrink-0" onClick={() => showToast('Change photo — coming soon')}>
        <img src={pet.photo} alt={pet.name} className="w-[80px] h-[80px] rounded-[20px] object-cover shadow-sm" />
        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white border border-[#EDE8E2] rounded-full flex items-center justify-center shadow-sm">
          <Camera size={13} className="text-[#A09A94]" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-[24px] font-bold text-[#111] tracking-[-0.3px]">{pet.name}</h2>
        <p className="text-[14px] text-[#A09A94] mt-0.5">{pet.breed} · {pet.age} yrs</p>
      </div>
    </div>

    {/* Stats pills */}
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[#6E6058]" style={{ background: '#F3EFEB' }}>
        <MapPin size={11} className="text-[#A09A94]" />
        {pet.location}
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[#6E6058]" style={{ background: '#F3EFEB' }}>
        <Scale size={11} className="text-[#A09A94]" />
        {pet.weight} {pet.weightUnit}
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium text-[#6E6058]" style={{ background: '#F3EFEB' }}>
        <Heart size={11} className="text-[#A09A94]" />
        {pet.sex}
      </div>
    </div>
  </div>
);

const PetProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = ['About', 'Health', 'Documents', 'Emergency', 'Share'];
  const [tabStyle, setTabStyle] = useState({ left: 0, width: 0 });
  const tabsRef = useRef([]);

  useEffect(() => {
    const activeEl = tabsRef.current[tabs.indexOf(activeTab)];
    if (activeEl) {
      setTabStyle({ left: activeEl.offsetLeft, width: activeEl.offsetWidth });
    }
  }, [activeTab]);

  return (
    <div className="overflow-x-auto px-5 py-2.5" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
      <div className="flex gap-1.5 min-w-max">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              ref={el => tabsRef.current[idx] = el}
              onClick={() => onTabChange(tab)}
              className={`py-2 px-4 rounded-full text-[13px] font-semibold transition-all duration-200 active:scale-[0.96] ${isActive ? 'bg-[#111] text-white shadow-sm' : 'text-[#A09A94]'}`}
            >
              {tab}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// Sub-components for About Tab
const InfoRow = ({ label, value, onEdit, isCopy }) => (
  <div className="flex items-center justify-between min-h-[48px] py-2">
    <span className="text-[13px] font-medium text-[#A09A94]">{label}</span>
    <div className="flex items-center gap-2">
      <span className="text-[14px] font-semibold text-[#111] text-right max-w-[180px] truncate">{value}</span>
      <button onClick={onEdit} className="p-1.5 rounded-full text-[#A09A94] active:scale-95 transition-all" style={{ background: '#F3EFEB' }}>
        {isCopy ? <Copy size={14} /> : <Pencil size={14} />}
      </button>
    </div>
  </div>
);

const EnergySlider = ({ value, onChange }) => {
  const getLabel = (v) => v <= 25 ? 'Low' : v <= 50 ? 'Medium' : v <= 75 ? 'High' : 'Very High';

  return (
    <div className="rounded-[16px] p-4" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[14px] font-semibold text-[#111]">Energy Level</h3>
        <span className="text-[12px] font-semibold text-[#E85D2A]">{getLabel(value)}</span>
      </div>
      {/* Segmented bar */}
      <div className="flex gap-1 h-[6px]">
        {[0, 1, 2, 3].map(i => {
          const filled = value > i * 25;
          return (
            <button
              key={i}
              onClick={() => onChange((i + 1) * 25 - 12)}
              className="flex-1 rounded-full transition-all active:scale-y-150"
              style={{ background: filled ? '#E85D2A' : '#EDE8E2', opacity: filled ? (0.4 + i * 0.2) : 1 }}
            />
          );
        })}
      </div>
    </div>
  );
};

const AboutTab = ({ 
  pet, onUpdate, showToast, 
  onOpenEdit, onOpenTrigger, onOpenMilestone, 
  onRemoveTrigger, onToggleChip, onDeleteMilestone 
}) => {
  const handleCopy = (text) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  return (
    <div className="px-5 py-5 space-y-6">

      {/* 1. Basic Info */}
      <section>
        <h3 className="text-[15px] font-semibold text-[#111] mb-3">Basic Info</h3>
        <div className="rounded-[16px] px-4" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}>
          <InfoRow label="Full Name" value={pet.name} onEdit={() => onOpenEdit('name', 'Name', pet.name)} />
          <div className="w-full h-[1px] bg-[#EDE8E2]" />
          <InfoRow label="Breed" value={pet.breed} onEdit={() => onOpenEdit('breed', 'Breed', pet.breed)} />
          <div className="w-full h-[1px] bg-[#EDE8E2]" />
          <InfoRow label="Date of Birth" value={pet.dob} onEdit={() => onOpenEdit('dob', 'Date of Birth', pet.dob, 'date')} />
          <div className="w-full h-[1px] bg-[#EDE8E2]" />
          <InfoRow label="Sex" value={pet.sex} onEdit={() => onOpenEdit('sex', 'Sex', pet.sex)} />
          <div className="w-full h-[1px] bg-[#EDE8E2]" />
          <InfoRow label="Weight" value={`${pet.weight} ${pet.weightUnit}`} onEdit={() => onOpenEdit('weight', 'Weight', pet.weight, 'number')} />
          <div className="w-full h-[1px] bg-[#EDE8E2]" />
          <InfoRow label="Color/Markings" value={pet.color} onEdit={() => onOpenEdit('color', 'Color', pet.color)} />
          <div className="w-full h-[1px] bg-[#EDE8E2]" />
          <InfoRow label="Microchip" value={pet.microchip} onEdit={() => handleCopy(pet.microchip)} isCopy />
        </div>
      </section>

      {/* 2. Personality & Traits */}
      <section className="space-y-6">
        <EnergySlider value={pet.energyLevel} onChange={(v) => onUpdate({ ...pet, energyLevel: v })} />
        
        <div>
          <h3 className="text-[15px] font-semibold text-[#111] mb-3">Temperament</h3>
          <div className="flex flex-wrap gap-2">
            {TEMPERAMENT_OPTIONS.map(chip => {
              const isActive = pet.temperament.includes(chip);
              return (
                <button
                  key={chip} onClick={() => onToggleChip(chip)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-semibold transition-all active:scale-[0.97] ${
                    isActive
                      ? 'bg-[#FFF5F0] border border-[#FFE0D0] text-[#E85D2A]'
                      : 'border border-[#EDE8E2] text-[#A09A94]'
                  }`} style={!isActive ? { background: '#F3EFEB' } : {}}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-[15px] font-semibold text-[#111] mb-3">Anxiety Triggers</h3>
          <div className="flex flex-wrap gap-2">
            {pet.anxietyTriggers.map(trigger => (
              <div key={trigger} className="flex items-center gap-1 pl-3 pr-2 py-1.5 bg-[#FFF5F0] border border-[#FFE0D0] text-[#E85D2A] rounded-full text-[13px] font-semibold">
                {trigger}
                <button onClick={() => onRemoveTrigger(trigger)} className="p-0.5 rounded-full opacity-70 active:opacity-100">
                  <X size={13} />
                </button>
              </div>
            ))}
            <button onClick={onOpenTrigger} className="flex items-center gap-1 px-3 py-1.5 border border-[#EDE8E2] text-[#A09A94] rounded-full text-[13px] font-semibold active:scale-[0.97]" style={{ background: '#F3EFEB' }}>
              <Plus size={14} /> Add trigger
            </button>
          </div>
        </div>
      </section>

      {/* 3. Preferences */}
      <section>
        <h3 className="text-[15px] font-semibold text-[#111] mb-3">Preferences</h3>
        <div className="rounded-[16px] px-4" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}>
          <InfoRow label="Favorite Treats" value={pet.preferences.treats} onEdit={() => onOpenEdit('treats', 'Treats', pet.preferences.treats, 'text', true)} />
          <div className="w-full h-[1px] bg-[#EDE8E2]" />
          <InfoRow label="Favorite Toys" value={pet.preferences.toys} onEdit={() => onOpenEdit('toys', 'Toys', pet.preferences.toys, 'text', true)} />
          <div className="w-full h-[1px] bg-[#EDE8E2]" />
          <InfoRow label="Food Brand" value={pet.preferences.foodBrand} onEdit={() => onOpenEdit('foodBrand', 'Food Brand', pet.preferences.foodBrand, 'text', true)} />
          <div className="w-full h-[1px] bg-[#EDE8E2]" />
          <InfoRow label="Sleeping Spot" value={pet.preferences.sleepingSpot} onEdit={() => onOpenEdit('sleepingSpot', 'Sleeping Spot', pet.preferences.sleepingSpot, 'text', true)} />
          <div className="w-full h-[1px] bg-[#EDE8E2]" />
          <InfoRow label="Walking" value={pet.preferences.walking} onEdit={() => onOpenEdit('walking', 'Walking Config', pet.preferences.walking, 'text', true)} />
        </div>
      </section>

      {/* 4. Milestones */}
      <section className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[15px] font-semibold text-[#111]">Milestones</h3>
          <button onClick={onOpenMilestone} className="text-[12px] font-semibold text-[#E85D2A] flex items-center gap-1 active:opacity-70">
            <Plus size={13} /> Add
          </button>
        </div>
        {/* Stacked memory cards with slight rotation */}
        <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-4 pt-2" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {pet.milestones.map((m, idx) => {
            const rotations = [-3, 2.5, -2, 3];
            const rot = rotations[idx % rotations.length];
            return (
              <div key={m.id} className="shrink-0 w-[150px]" style={{
                animation: `homeReveal 0.5s ${0.1 + idx * 0.1}s cubic-bezier(0.22,1,0.36,1) both`,
              }}>
                {/* Polaroid-style card with rotation */}
                <div className="rounded-[14px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] overflow-hidden active:scale-[0.96] transition-transform cursor-pointer group" style={{ border: '1px solid #EDE8E2', transform: `rotate(${rot}deg)` }}>
                  {/* Icon area — warm gradient */}
                  <div className="h-[80px] flex items-center justify-center relative" style={{ background: 'linear-gradient(135deg, #F7F5F2 0%, #F3EFEB 100%)' }}>
                    <span className="text-[32px]">{renderLegacyIcon(m.icon, 32, '')}</span>
                  </div>
                  {/* Info */}
                  <div className="px-3 py-2.5">
                    <h4 className="text-[13px] font-bold text-[#111] leading-tight truncate">{m.title}</h4>
                    {m.note && <p className="text-[11px] text-[#A09A94] mt-0.5 truncate">{m.note}</p>}
                    <div className="text-[9px] font-semibold text-[#C4BBB3] mt-2 uppercase tracking-wider">{m.date}</div>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Add card */}
          <div onClick={onOpenMilestone} className="shrink-0 w-[100px] flex flex-col items-center justify-center gap-2 cursor-pointer active:scale-[0.95] transition-transform rounded-[14px] py-6" style={{ border: '1.5px dashed #DDD8D2' }}>
            <Plus size={18} className="text-[#C4B5A6]" />
            <span className="text-[10px] font-semibold text-[#C4B5A6]">Add</span>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- STEP 6 COMPONENTS: DOCUMENTS TAB ---

const CATEGORY_OPTIONS = ['Medical Records', 'Insurance', 'Adoption/Purchase', 'Training Certificates', 'Legal Documents', 'Other'];

const DocumentCard = ({ doc, onClick }) => (
  <div onClick={onClick} className="flex items-center gap-3 py-2.5 cursor-pointer active:opacity-60 transition-opacity">
    <div className="flex-1 min-w-0">
      <h4 className="text-[13px] font-semibold text-[#111] truncate">{doc.title}</h4>
      <span className="text-[10px] text-[#A09A94]">{doc.date} · {doc.size}</span>
    </div>
    <ChevronRight size={13} className="text-[#D4CCC4] shrink-0" />
  </div>
);

const DocumentsTab = ({ documents = [], onAddDocument, onScanReceipt, onViewDocument }) => {
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleCategory = (cat) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const grouped = CATEGORY_OPTIONS.reduce((acc, cat) => {
    acc[cat] = documents.filter(d => d.category === cat);
    return acc;
  }, {});

  return (
    <div className="px-5 py-5">
      {/* Quick actions */}
      <div className="flex items-center gap-2 mb-5">
        <button onClick={onAddDocument} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] active:scale-[0.97] transition-transform" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
          <Plus size={14} className="text-[#E85D2A]" />
          <span className="text-[13px] font-semibold text-[#6E6058]">Add Document</span>
        </button>
        <button onClick={onScanReceipt} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] active:scale-[0.97] transition-transform" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
          <Scan size={14} className="text-[#A09A94]" />
          <span className="text-[13px] font-semibold text-[#6E6058]">Scan Receipt</span>
        </button>
      </div>

      {/* Total + Categories */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[15px] font-semibold text-[#111]">All Documents</h3>
        <span className="text-[11px] font-medium text-[#C4BBB3]">{documents.length} files</span>
      </div>
      <div className="space-y-1">
        {CATEGORY_OPTIONS.map(cat => {
          const docs = grouped[cat];
          if (!docs || docs.length === 0) return null;
          const isExpanded = expandedCategories[cat];
          return (
            <div key={cat}>
              <button onClick={() => toggleCategory(cat)} className="flex items-center gap-2 w-full py-3 active:opacity-70 transition-opacity">
                <ChevronRight size={14} className={`text-[#C4BBB3] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                <h3 className="text-[14px] font-semibold text-[#111] flex-1 text-left">{cat}</h3>
                <span className="text-[11px] font-medium text-[#C4BBB3]">{docs.length}</span>
              </button>
              {isExpanded && (
                <div className="pl-6 pb-2">
                  {docs.map(doc => <DocumentCard key={doc.id} doc={doc} onClick={() => onViewDocument(doc)} />)}
                </div>
              )}
            </div>
          );
        })}
        {documents.length === 0 && (
          <div className="text-center py-12">
            <Folder size={32} className="text-[#D4CCC4] mx-auto mb-3" />
            <p className="text-[14px] font-semibold text-[#111]">Vault is empty</p>
            <p className="text-[12px] text-[#A09A94] mt-1">Add your pet's documents</p>
          </div>
        )}
      </div>
    </div>
  )
};

const AddDocumentSheet = ({ isOpen, onClose, onSave, showToast }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Medical Records');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
       setTitle(''); setCategory('Medical Records'); setDate(new Date().toISOString().split('T')[0]);
       setNotes(''); setFile(null); setUploading(false); setProgress(0);
    }
  }, [isOpen]);

  const handleFileChange = (e) => {
     const selected = e.target.files?.[0];
     if (!selected) return;
     
     if (selected.size > 10 * 1024 * 1024) {
       showToast('File too large. Maximum size is 10MB.');
       return;
     }
     const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
     if (!validTypes.includes(selected.type)) {
       showToast('Invalid file type. Please use PDF, JPG, or PNG.');
       return;
     }
     setFile(selected);
  };

  const handleUpload = () => {
     if (!title || !file) return;
     setUploading(true);
     let p = 0;
     const interval = setInterval(() => {
        p += 15;
        if (p >= 100) {
           clearInterval(interval);
           setProgress(100);
           setTimeout(() => {
              const newDoc = {
                 id: Date.now().toString(),
                 title,
                 category,
                 date,
                 notes,
                 type: file.type === 'application/pdf' ? 'PDF' : 'JPG',
                 size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
                 source: 'Manual Upload'
              };
              onSave(newDoc);
              onClose();
           }, 300);
        } else {
           setProgress(p);
        }
     }, 150);
  };

  return (
    <CardModal isOpen={isOpen} onClose={onClose} title="Add Document">
      <div className="space-y-4 pt-1">
        <TextInput label="Name" placeholder="e.g., Blood Test Results" value={title} onChange={e=>setTitle(e.target.value)} disabled={uploading} />
        <Select label="Category" options={CATEGORY_OPTIONS.map(c => ({label: c, value: c}))} value={category} onChange={e=>setCategory(e.target.value)} disabled={uploading} />
        <TextInput label="Date" type="date" value={date} onChange={e=>setDate(e.target.value)} disabled={uploading} />

        <div>
           <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf,.png,.jpeg,.jpg" className="hidden" />
           {!file ? (
             <button onClick={() => fileInputRef.current?.click()} className="w-full py-3 rounded-[12px] flex items-center justify-center gap-2 active:scale-[0.97] transition-transform" style={{ background: '#F3EFEB', border: '1.5px dashed #DDD8D2' }} disabled={uploading}>
                <Upload size={14} className="text-[#A09A94]" />
                <span className="text-[12px] font-semibold text-[#6E6058]">Upload file or photo</span>
             </button>
           ) : (
             <div className="flex items-center gap-3 py-2">
                <span className="text-[13px] font-semibold text-[#111] flex-1 truncate">{file.name}</span>
                <span className="text-[10px] text-[#A09A94]">{(file.size / (1024*1024)).toFixed(1)} MB</span>
                {!uploading && <button onClick={() => setFile(null)} className="text-[#A09A94] active:text-[#E85D2A]"><X size={14} /></button>}
             </div>
           )}
        </div>

        {uploading && (
          <div>
            <div className="flex justify-between text-[11px] text-[#A09A94] mb-1"><span>Uploading...</span><span>{progress}%</span></div>
            <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ background: '#EDE8E2' }}>
              <div className="h-full rounded-full transition-all duration-150" style={{ width: `${progress}%`, background: '#E85D2A' }} />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" onClick={onClose} disabled={uploading}>Cancel</Button>
          <Button variant="primary" onClick={handleUpload} disabled={!title || !file || uploading}>
            {uploading ? 'Saving...' : 'Upload'}
          </Button>
        </div>
      </div>
    </CardModal>
  );
};

const ScanReceiptFlow = ({ flowState, setFlowState, onSave, showToast }) => {
   const [ocrData, setOcrData] = useState({ clinic: 'City Vet Care', date: new Date().toISOString().split('T')[0], amount: '125.50', currency: 'CHF', services: 'General Consultation\nVaccination', vet: 'Dr. Sarah Keller' });
   const [saveDest, setSaveDest] = useState('medical');
   const [isOcrSuccess, setIsOcrSuccess] = useState(true);

   useEffect(() => {
     if (flowState === 'idle') {
        // Reset state when closing
        setOcrData({ clinic: 'City Vet Care', date: new Date().toISOString().split('T')[0], amount: '125.50', currency: 'CHF', services: 'General Consultation\nVaccination', vet: 'Dr. Sarah Keller' });
        setIsOcrSuccess(true);
     }
   }, [flowState]);

   useEffect(() => {
     if (flowState === 'processing') {
        setTimeout(() => {
           if (!isOcrSuccess) {
              showToast('OCR failed, try again or enter manually.');
              setOcrData({ clinic: '', date: '', amount: '', currency: 'CHF', services: '', vet: '' });
           }
           setFlowState('results');
        }, 2000);
     }
   }, [flowState, isOcrSuccess, showToast, setFlowState]);

   if (flowState === 'idle') return null;

   if (flowState === 'camera' || flowState === 'processing') {
      return (
        <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-between pb-[120px] pt-14 animate-in fade-in duration-300">
          <div className="w-full px-5 flex justify-between items-center text-white z-10">
             <button onClick={() => setFlowState('idle')} className="p-2 rounded-full bg-white/10 active:bg-white/20"><X size={24} /></button>
             <span className="font-medium">Scan Receipt</span>
             <div className="w-10" />
          </div>

          <div className="relative w-[300px] h-[400px] border-2 border-white/30 rounded-2xl flex items-center justify-center">
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-xl" />
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-xl" />
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-xl" />
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-xl" />
             
             {flowState === 'processing' ? (
               <div className="flex flex-col items-center text-white gap-4">
                 <Spinner color="white" size="large" />
                 <span className="font-medium animate-pulse">Processing receipt...</span>
               </div>
             ) : (
               <span className="text-white/50 font-medium px-4 text-center">Position receipt inside the frame</span>
             )}
          </div>

          {flowState === 'camera' && (
            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={() => { setIsOcrSuccess(true); setFlowState('processing'); }}
                className="w-20 h-20 rounded-full border-[4px] border-white/50 p-1 active:scale-95 transition-transform"
              >
                 <div className="w-full h-full bg-white rounded-full" />
              </button>
              <button onClick={() => { setIsOcrSuccess(false); setFlowState('processing'); }} className="text-white/60 text-[14px] underline underline-offset-4">
                 Simulate OCR Fail
              </button>
            </div>
          )}
        </div>
      );
   }

   if (flowState === 'results') {
      return (
        <CardModal isOpen={true} onClose={() => setFlowState('idle')} title="Scanned Receipt">
          <div className="space-y-5 pt-2">
            {isOcrSuccess ? (
              <div className="flex justify-between items-center bg-[#E5F9ED] px-3 py-1.5 rounded-lg mb-2">
                <span className="text-[12px] font-bold text-[#00C060] flex items-center gap-1.5"><Check size={14}/> OCR extraction successful</span>
                <span className="text-[11px] font-semibold text-[#00C060]/70">92% CONFIDENCE</span>
              </div>
            ) : (
              <div className="flex justify-between items-center bg-[#FFE5E5] px-3 py-1.5 rounded-lg mb-2">
                <span className="text-[12px] font-bold text-[#FF3B30] flex items-center gap-1.5"><AlertCircle size={14}/> OCR failed, try again or enter manually</span>
              </div>
            )}

            <TextInput label="Clinic / Provider" value={ocrData.clinic} onChange={e=>setOcrData({...ocrData, clinic: e.target.value})} />
            <div className="flex gap-4">
              <TextInput label="Date" type="date" value={ocrData.date} onChange={e=>setOcrData({...ocrData, date: e.target.value})} className="flex-1" />
              <div className="w-[120px]">
                 <TextInput label="Amount" value={ocrData.amount} onChange={e=>setOcrData({...ocrData, amount: e.target.value})} />
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-[13px] font-medium text-[#6E6E73] ml-1">Services / Items</label>
              <textarea 
                value={ocrData.services} 
                onChange={e=>setOcrData({...ocrData, services: e.target.value})}
                className="w-full p-4 bg-[#FFFFFF] border border-black/[0.08] text-[15px] text-[#111111] rounded-xl focus:outline-none focus:border-[#FF6B35] min-h-[80px]"
              />
            </div>

            <div className="pt-4 border-t border-black/[0.06]">
               <h4 className="text-[14px] font-semibold text-[#111111] mb-3">Save Destination</h4>
               <div className="flex flex-col gap-2">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${saveDest === 'medical' ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-black/[0.08] bg-white'}`}>
                     <input type="radio" checked={saveDest === 'medical'} onChange={() => setSaveDest('medical')} className="accent-[#FF6B35] w-5 h-5" />
                     <div className="flex flex-col">
                       <span className="text-[15px] font-medium text-[#111111]">Medical Record</span>
                       <span className="text-[13px] text-[#6E6E73]">Add to documents vault</span>
                     </div>
                  </label>
                  <label className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${saveDest === 'visit' ? 'border-[#FF6B35] bg-[#FF6B35]/5' : 'border-black/[0.08] bg-white'}`}>
                     <input type="radio" checked={saveDest === 'visit'} onChange={() => setSaveDest('visit')} className="accent-[#FF6B35] w-5 h-5" />
                     <div className="flex flex-col">
                       <span className="text-[15px] font-medium text-[#111111]">New Vet Visit</span>
                       <span className="text-[13px] text-[#6E6E73]">Create health log entry</span>
                     </div>
                  </label>
               </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setFlowState('idle')}>Cancel</Button>
              <Button variant="primary" onClick={() => {
                 const doc = {
                    id: Date.now().toString(),
                    title: `Receipt - ${ocrData.clinic || 'Vet'}`,
                    category: 'Medical Records',
                    date: ocrData.date,
                    type: 'JPG',
                    size: '1.4 MB',
                    source: 'Receipt Scan'
                 };
                 onSave(doc, saveDest === 'medical');
                 setFlowState('idle');
              }}>Save Receipt</Button>
            </div>
          </div>
        </CardModal>
      );
   }

   return null;
};

const DocumentViewer = ({ doc, onClose, onDelete, showToast }) => {
  const isPdf = doc.type === 'PDF';
  const [menuOpen, setMenuOpen] = useState(false);
  
  return (
    <div className="absolute inset-0 z-[100] bg-[#111111] flex flex-col animate-in fade-in duration-200">
       <div className="flex justify-between items-center px-4 pt-14 pb-4 bg-gradient-to-b from-black/80 to-transparent z-10">
          <button onClick={onClose} className="p-2 bg-white/10 rounded-full text-white active:bg-white/20"><X size={22} /></button>
          <div className="flex flex-col items-center">
             <span className="text-[15px] font-semibold text-white truncate max-w-[200px]">{doc.title}</span>
             {isPdf && <span className="text-[12px] text-white/60">Page 1 of 3</span>}
          </div>
          <button onClick={() => setMenuOpen(true)} className="p-2 bg-white/10 rounded-full text-white active:bg-white/20"><MoreHorizontal size={22} /></button>
       </div>

       <div className="flex-1 relative flex items-center justify-center overflow-hidden p-4">
         {isPdf ? (
           <div className="w-full h-full max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col items-center justify-center gap-4 animate-in slide-in-from-bottom-8 duration-300">
              <FileText size={64} className="text-[#CFCFD4]" />
              <span className="text-[#8E8E93] font-medium">PDF Content Preview</span>
           </div>
         ) : (
           <div className="relative w-full h-full flex items-center justify-center">
              <div className="absolute inset-0 bg-[#222222] rounded-lg animate-in slide-in-from-bottom-8 duration-300 flex items-center justify-center overflow-hidden">
                 <ImageIcon size={64} className="text-white/20" />
                 <span className="absolute bottom-6 text-white/40 text-[14px]">Image Zoom Area</span>
              </div>
           </div>
         )}
       </div>

       <div className="pb-8 pt-4 px-6 flex justify-center gap-6 bg-gradient-to-t from-black/80 to-transparent">
          <button onClick={()=>showToast('Downloading...')} className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white active:scale-95 transition-all">
             <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Download size={20} /></div>
             <span className="text-[11px] font-medium">Download</span>
          </button>
          <button onClick={()=>showToast('Sharing...')} className="flex flex-col items-center gap-1.5 text-white/80 hover:text-white active:scale-95 transition-all">
             <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Share2 size={20} /></div>
             <span className="text-[11px] font-medium">Share</span>
          </button>
       </div>

       <CardModal isOpen={menuOpen} onClose={() => setMenuOpen(false)} title="Document Options">
          <div className="space-y-1 pb-4">
             <button onClick={() => { setMenuOpen(false); showToast('Edit flow coming soon'); }} className="w-full flex items-center gap-4 px-4 py-4 hover:bg-[#F7F7F8] active:bg-[#F0F0F2] rounded-xl transition-colors">
                <Pencil size={20} className="text-[#111111]" />
                <span className="text-[16px] font-semibold text-[#111111]">Edit Details</span>
             </button>
             <button onClick={() => { setMenuOpen(false); showToast('Move flow coming soon'); }} className="w-full flex items-center gap-4 px-4 py-4 hover:bg-[#F7F7F8] active:bg-[#F0F0F2] rounded-xl transition-colors">
                <Folder size={20} className="text-[#111111]" />
                <span className="text-[16px] font-semibold text-[#111111]">Change Category</span>
             </button>
             <div className="w-full h-[1px] bg-black/[0.04] my-2" />
             <button onClick={() => { 
                setMenuOpen(false); 
                if (confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
                   onDelete(doc.id);
                   onClose();
                }
             }} className="w-full flex items-center gap-4 px-4 py-4 hover:bg-[#FFF0F0] active:bg-[#FFE5E5] rounded-xl transition-colors">
                <Trash2 size={20} className="text-[#FF3B30]" />
                <span className="text-[16px] font-semibold text-[#FF3B30]">Delete Document</span>
             </button>
          </div>
       </CardModal>
    </div>
  )
};

// --- HEALTH TAB COMPONENTS ---

const calculateExpiryDays = (nextDateStr) => {
  const nextDate = new Date(nextDateStr);
  const today = new Date('2026-02-21');
  return Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
};

const VaccinationCard = ({ item, onOpenSheet }) => {
  const days = calculateExpiryDays(item.nextDate);
  let statusColor = '#00C060', badgeLabel = 'Valid', badgeType = 'success';
  if (days < 0) { statusColor = '#FF3B30'; badgeLabel = 'Overdue'; badgeType = 'error'; }
  else if (days <= 30) { statusColor = '#FF9500'; badgeLabel = 'Expiring'; badgeType = 'warning'; }
  return (
    <Card clickable onClick={() => onOpenSheet('VACCINE_DETAILS', item)} className="!p-4 bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F7F7F8] shrink-0"><Syringe size={20} color={statusColor} /></div>
        <div className="flex-1"><h4 className="text-[16px] font-bold text-[#111111]">{item.name}</h4><span className="text-[13px] text-[#6E6E73]">Given: {item.lastDate}</span></div>
        <Badge variant={badgeType}>{badgeLabel}</Badge>
      </div>
    </Card>
  );
};

const VaccinationsSection = ({ data, onOpenSheet }) => (
  <section className="pb-4">
    <div>
      {data.map((vac, i) => {
        const days = calculateExpiryDays(vac.nextDate);
        const status = days < 0 ? 'Overdue' : days <= 30 ? 'Expiring' : 'Valid';
        const statusColor = status === 'Overdue' ? '#E85D2A' : status === 'Expiring' ? '#B07A3A' : '#3F8D63';
        return (
          <div key={vac.id} className={`flex items-center justify-between py-3 cursor-pointer active:opacity-60 ${i < data.length - 1 ? 'border-b border-[#EDE8E2]' : ''}`} onClick={() => onOpenSheet('VACCINE_DETAILS', vac)}>
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-semibold text-[#111] block">{vac.name}</span>
              <span className="text-[11px] text-[#A09A94]">Due {vac.nextDate}</span>
            </div>
            <span className="text-[10px] font-bold uppercase" style={{ color: statusColor }}>{status}</span>
          </div>
        );
      })}
    </div>
    <button onClick={() => onOpenSheet('ADD_VACCINE')} className="w-full mt-3 py-2.5 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
      <Plus size={13} className="text-[#A09A94]" /><span className="text-[12px] font-semibold text-[#6E6058]">Add vaccine</span>
    </button>
  </section>
);

const VetVisitsSection = ({ data, onOpenSheet }) => (
  <section className="pb-4">
    <div>
      {data.map((visit, i) => (
        <div key={visit.id} className={`py-3 cursor-pointer active:opacity-60 ${i < data.length - 1 ? 'border-b border-[#EDE8E2]' : ''}`} onClick={() => onOpenSheet('VET_DETAILS', visit)}>
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-semibold text-[#111]">{visit.reason}</span>
            <span className="text-[11px] text-[#C4BBB3]">{visit.date}</span>
          </div>
          <span className="text-[11px] text-[#A09A94]">{visit.vet} · {visit.clinic}</span>
        </div>
      ))}
    </div>
    <button onClick={() => onOpenSheet('ADD_VET')} className="w-full mt-3 py-2.5 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
      <Plus size={13} className="text-[#A09A94]" /><span className="text-[12px] font-semibold text-[#6E6058]">Add visit</span>
    </button>
  </section>
);

const VetVisitsSummaryCard = ({ onOpenSheet }) => {
  const visits = [...MOCK_HEALTH_DATA.vetVisits].sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestVisit = visits[0];
  if (!latestVisit) return <Card className="!p-5 mb-8"><div className="flex flex-col items-center justify-center py-2"><p className="text-[14px] text-[#6E6E73] mb-3">No vet visits yet</p><Button variant="secondary" size="small" onClick={() => onOpenSheet('ADD_VET')}>Add first visit</Button></div></Card>;
  const needsFollowUp = latestVisit.followUp && latestVisit.followUp !== 'None' && latestVisit.followUp !== 'Next year';
  const fmtDate = (s) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return (
    <button onClick={() => onOpenSheet('VET_VISITS_SECTION')} className="w-full mb-6 p-4 rounded-[18px] flex flex-col text-left active:scale-[0.98] transition-transform" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}>
      <div className="flex justify-between items-center w-full mb-2"><span className="text-[10px] font-bold text-[#A09A94] uppercase tracking-[0.06em]">Vet Visits</span>{needsFollowUp ? <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#FFF8F0] text-[#B07A3A] border border-[#F0E4D0]">Follow-up</span> : <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#F0F7ED] text-[#3F8D63] border border-[#D7EBDD]">Recent</span>}</div>
      <div className="flex justify-between items-end w-full"><div className="flex-1 pr-3 min-w-0"><p className="text-[16px] font-bold text-[#111] leading-tight mb-0.5 truncate">{latestVisit.reason}</p><p className="text-[12px] text-[#A09A94] truncate">{latestVisit.vet} · {latestVisit.clinic}</p></div><div className="flex items-center gap-1 shrink-0"><span className="text-[12px] font-medium text-[#C4BBB3]">{fmtDate(latestVisit.date)}</span><ChevronRight size={14} className="text-[#D4CCC4]" /></div></div>
    </button>
  );
};

const MedicationCard = ({ item, onMarkTaken, onOpenSheet }) => {
  const [localTaken, setLocalTaken] = useState(item.takenToday);
  const handleTake = (e) => { e.stopPropagation(); setLocalTaken(true); setTimeout(() => onMarkTaken(item.id), 200); };
  return (
    <Card clickable onClick={() => onOpenSheet('MED_DETAILS', item)} className={`!p-4 bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] ${!item.isActive ? 'opacity-60 bg-[#F7F7F8]' : ''}`}>
      <div className="flex items-start justify-between mb-2"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#E5F0FF] flex items-center justify-center shrink-0"><Pill size={18} className="text-[#007AFF]" /></div><div><h4 className="text-[16px] font-bold text-[#111111]">{item.name}</h4><p className="text-[13px] text-[#6E6E73]">{item.purpose} • {item.dosage}</p></div></div></div>
      <div className="flex justify-between items-center mt-3"><div className="text-[13px] text-[#6E6E73]">{item.isActive ? <span className="flex items-center gap-1.5 font-medium"><Clock size={14} className="text-[#111111]" /> Next: {item.nextDoseTime}</span> : <span>{item.startDate} - {item.endDate}</span>}</div></div>
      {item.isActive && <div className="mt-4 pt-3 border-t border-black/[0.04]">{localTaken || item.takenToday ? <div className="flex items-center justify-center gap-2 text-[#00C060] text-[14px] font-semibold py-1"><CheckCircle2 size={16} /> Taken today</div> : <Button variant="secondary" size="small" fullWidth onClick={handleTake} className="!h-[36px]">Mark as taken</Button>}</div>}
    </Card>
  );
};

const MedicationsSection = ({ data, onMarkTaken, onOpenSheet }) => {
  const activeMeds = data.filter(m => m.isActive), pastMeds = data.filter(m => !m.isActive);
  return (
    <section className="pb-4">
      {activeMeds.length > 0 && <div className="mb-4">
        <div className="text-[10px] font-bold text-[#A09A94] uppercase tracking-[0.06em] mb-2">Active</div>
        {activeMeds.map((m, i) => (
          <div key={m.id} className={`flex items-center justify-between py-3 cursor-pointer active:opacity-60 ${i < activeMeds.length - 1 ? 'border-b border-[#EDE8E2]' : ''}`} onClick={() => onOpenSheet('MED_DETAILS', m)}>
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-semibold text-[#111] block">{m.name}</span>
              <span className="text-[11px] text-[#A09A94]">{m.purpose} · {m.dosage}</span>
            </div>
            {m.isActive && !m.takenToday && <button onClick={(e) => { e.stopPropagation(); onMarkTaken(m.id); }} className="text-[11px] font-semibold text-[#E85D2A] px-2.5 py-1 rounded-full active:scale-[0.95]" style={{ background: '#FFF5F0' }}>Take</button>}
            {m.takenToday && <Check size={14} className="text-[#3F8D63]" />}
          </div>
        ))}
      </div>}
      {pastMeds.length > 0 && <div>
        <div className="text-[10px] font-bold text-[#A09A94] uppercase tracking-[0.06em] mb-2">Past</div>
        {pastMeds.map((m, i) => (
          <div key={m.id} className={`flex items-center justify-between py-3 opacity-50 ${i < pastMeds.length - 1 ? 'border-b border-[#EDE8E2]' : ''}`}>
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold text-[#111] block">{m.name}</span>
              <span className="text-[11px] text-[#A09A94]">{m.startDate} – {m.endDate}</span>
            </div>
          </div>
        ))}
      </div>}
      <button onClick={() => onOpenSheet('ADD_MED')} className="w-full mt-3 py-2.5 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
        <Plus size={13} className="text-[#A09A94]" /><span className="text-[12px] font-semibold text-[#6E6058]">Add medication</span>
      </button>
    </section>
  );
};

const AllergiesSection = ({ data, onOpenSheet }) => (
  <section className="pb-4">
    <div>
      {data.map((a, i) => {
        const sevColor = a.severity === 'severe' ? '#E85D2A' : a.severity === 'moderate' ? '#B07A3A' : '#3F8D63';
        return (
          <div key={a.id} className={`flex items-center justify-between py-3 cursor-pointer active:opacity-60 ${i < data.length - 1 ? 'border-b border-[#EDE8E2]' : ''}`} onClick={() => onOpenSheet('ALLERGY_DETAILS', a)}>
            <div className="flex-1 min-w-0">
              <span className="text-[14px] font-semibold text-[#111] block">{a.allergen}</span>
              <span className="text-[11px] text-[#A09A94]">{a.reaction}</span>
            </div>
            <span className="text-[10px] font-bold uppercase" style={{ color: sevColor }}>{a.severity}</span>
          </div>
        );
      })}
    </div>
    <button onClick={() => onOpenSheet('ADD_ALLERGY')} className="w-full mt-3 py-2.5 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
      <Plus size={13} className="text-[#A09A94]" /><span className="text-[12px] font-semibold text-[#6E6058]">Add allergy</span>
    </button>
  </section>
);

const WeightTrackerSection = ({ data, idealRange, currentWeight, weightUnit, onOpenSheet }) => {
  const currentWNum = parseFloat(currentWeight), rangeParts = idealRange.split('-').map(p => parseFloat(p.trim()));
  const isHealthy = currentWNum >= rangeParts[0] && currentWNum <= rangeParts[1];
  return (
    <section className="pb-4">
      {/* Current */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-[24px] font-bold text-[#111]">{currentWeight}</span>
        <span className="text-[13px] text-[#A09A94]">{weightUnit}</span>
        <span className={`text-[10px] font-bold uppercase ml-1 ${isHealthy ? 'text-[#3F8D63]' : 'text-[#B07A3A]'}`}>{isHealthy ? 'Healthy' : 'Monitor'}</span>
      </div>
      <span className="text-[11px] text-[#C4BBB3] block mb-4">Ideal: {idealRange} {weightUnit}</span>

      {/* History */}
      <div>
        {data.slice().reverse().map((entry, i) => (
          <div key={entry.id} className={`flex items-center justify-between py-2.5 ${i < data.length - 1 ? 'border-b border-[#EDE8E2]' : ''}`}>
            <span className="text-[14px] font-semibold text-[#111]">{entry.weight} {weightUnit}</span>
            <span className="text-[11px] text-[#A09A94]">{entry.date}</span>
          </div>
        ))}
      </div>
      <button onClick={() => onOpenSheet('ADD_WEIGHT')} className="w-full mt-3 py-2.5 rounded-[12px] flex items-center justify-center gap-1.5 active:scale-[0.97] transition-transform" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
        <Plus size={13} className="text-[#A09A94]" /><span className="text-[12px] font-semibold text-[#6E6058]">Log weight</span>
      </button>
    </section>
  );
};

const HealthTile = ({ title, icon: Icon, iconColor, badge, primaryValue, secondaryValue, onClick, sparkline }) => (
  <button onClick={onClick} className="p-4 rounded-[18px] flex flex-col gap-3 text-left active:scale-[0.96] transition-transform duration-200 h-full w-full" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}>
    <div className="flex justify-between items-start w-full"><div className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0" style={{ background: '#F3EFEB' }}><Icon size={16} color={iconColor} strokeWidth={2} /></div>{badge && <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full leading-tight shrink-0 ${badge.type === 'error' ? 'bg-[#FFF5F0] text-[#E85D2A] border border-[#FFE0D0]' : badge.type === 'warning' ? 'bg-[#FFF8F0] text-[#B07A3A] border border-[#F0E4D0]' : 'bg-[#F0F7ED] text-[#3F8D63] border border-[#D7EBDD]'}`}>{badge.label}</span>}</div>
    <div className="mt-1 flex-1 flex flex-col justify-end w-full min-w-0"><h4 className="text-[10px] font-bold text-[#A09A94] uppercase tracking-[0.06em] mb-1 truncate">{title}</h4><p className="text-[17px] font-bold text-[#111] leading-tight mb-0.5 truncate">{primaryValue}</p>{sparkline ? <div className="w-full h-[20px] mt-1 relative"><svg viewBox="0 0 100 20" className="w-full h-full overflow-visible" preserveAspectRatio="none"><polyline points={sparkline} fill="none" stroke="#E85D2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></div> : <p className="text-[12px] text-[#A09A94] truncate">{secondaryValue}</p>}</div>
  </button>
);

const HealthSummaryTiles = ({ pet, meds, onOpenSheet }) => {
  const sortedVacs = [...MOCK_HEALTH_DATA.vaccinations].sort((a,b) => new Date(a.nextDate) - new Date(b.nextDate));
  const nextVac = sortedVacs[0]; const daysToVac = calculateExpiryDays(nextVac.nextDate);
  let vacBadge = { label: 'Valid', type: 'success' }; if (daysToVac < 0) vacBadge = { label: 'Overdue', type: 'error' }; else if (daysToVac <= 30) vacBadge = { label: 'Expiring', type: 'warning' };
  const activeMeds = meds.filter(m => m.isActive); const activeCount = activeMeds.length;
  let medsBadge = null; if (activeCount > 0) { medsBadge = activeMeds.some(m => !m.takenToday) ? { label: 'Due', type: 'warning' } : { label: 'Up to date', type: 'success' }; }
  const allergiesCount = MOCK_HEALTH_DATA.allergies.length; const severities = MOCK_HEALTH_DATA.allergies.map(a => a.severity);
  let algBadge = { label: 'Mild', type: 'success' }; if (severities.includes('severe')) algBadge = { label: 'Severe', type: 'error' }; else if (severities.includes('moderate')) algBadge = { label: 'Moderate', type: 'warning' };
  const history = MOCK_HEALTH_DATA.weightHistory; const cw = history[history.length - 1].weight; const pw = history.length > 1 ? history[history.length - 2].weight : cw;
  const wd = (cw - pw).toFixed(1); const trendLabel = wd > 0 ? `+${wd} ${pet.weightUnit}` : wd < 0 ? `${wd} ${pet.weightUnit}` : 'Maintained';
  const cwn = parseFloat(cw); const rp = MOCK_HEALTH_DATA.idealWeightRange.split('-').map(p => parseFloat(p.trim())); const ih = cwn >= rp[0] && cwn <= rp[1];
  const wBadge = { label: ih ? 'Healthy' : 'Monitor', type: ih ? 'success' : 'warning' };
  const maxW = Math.max(...history.map(d => d.weight)) + 1, minW = Math.min(...history.map(d => d.weight)) - 1, range = maxW - minW;
  const sp = history.map((d, i) => `${(i / (history.length - 1)) * 100},${20 - ((d.weight - minW) / range) * 20}`).join(' ');
  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      <HealthTile title="Vaccines" icon={Syringe} iconColor="#00C060" badge={vacBadge} primaryValue={nextVac.name} secondaryValue={`Due ${nextVac.nextDate}`} onClick={() => onOpenSheet('VACCINATIONS_SECTION')} />
      <HealthTile title="Medications" icon={Pill} iconColor="#007AFF" badge={medsBadge} primaryValue={activeCount > 0 ? "Today" : 'None Active'} secondaryValue={activeCount > 0 ? `${activeCount} active` : 'No upcoming doses'} onClick={() => onOpenSheet('MEDICATIONS_SECTION')} />
      <HealthTile title="Allergies" icon={AlertTriangle} iconColor="#FF9500" badge={allergiesCount > 0 ? algBadge : null} primaryValue={`${allergiesCount} logged`} secondaryValue="Tap to view" onClick={() => onOpenSheet('ALLERGIES_SECTION')} />
      <HealthTile title="Weight" icon={Scale} iconColor="#FF6B35" badge={wBadge} primaryValue={`${cw} ${pet.weightUnit}`} secondaryValue={`${trendLabel} since last`} sparkline={sp} onClick={() => onOpenSheet('WEIGHT_SECTION')} />
    </div>
  );
};

const FeedItem = ({ data, isLast, onOpenSheet }) => {
  const openDetails = () => { if (data.type === 'vaccine') onOpenSheet('VACCINE_DETAILS', data.item); if (data.type === 'vet') onOpenSheet('VET_DETAILS', data.item); if (data.type === 'med') onOpenSheet('MED_DETAILS', data.item); if (data.type === 'weight') onOpenSheet('WEIGHT_DETAILS', data.item); };
  return (
    <div onClick={openDetails} className="relative flex gap-3 cursor-pointer group px-1 py-1">
      {!isLast && <div className="absolute left-[21px] top-[36px] bottom-[-10px] w-[1px] bg-[#EDE8E2] z-0" />}
      <div className="relative z-10 w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 group-active:scale-95 transition-transform" style={{ background: '#F3EFEB' }}><data.Icon size={15} className="text-[#A09A94]" /></div>
      <div className="flex-1 flex justify-between items-start pb-5 group-active:opacity-70 transition-opacity"><div><h4 className="text-[14px] font-semibold text-[#111] leading-tight mb-0.5">{data.title}</h4><p className="text-[12px] text-[#A09A94]">{data.subtitle}</p></div><span className="text-[11px] font-medium text-[#C4BBB3] ml-2 shrink-0">{data.displayDate}</span></div>
    </div>
  );
};

const RecentMedicalFeed = ({ pet, meds, onOpenSheet }) => {
  const fd = (d) => new Date(d).toLocaleDateString('en-GB', {day:'numeric',month:'short'});
  const feed = [
    ...MOCK_HEALTH_DATA.vaccinations.map(v => ({ type:'vaccine', date:new Date(v.lastDate), displayDate:fd(v.lastDate), title:v.name, subtitle:'Vaccination', item:v, Icon:Syringe })),
    ...MOCK_HEALTH_DATA.vetVisits.map(v => ({ type:'vet', date:new Date(v.date), displayDate:fd(v.date), title:v.reason, subtitle:v.vet, item:v, Icon:Stethoscope })),
    ...meds.map(m => ({ type:'med', date:new Date(m.startDate), displayDate:fd(m.startDate), title:m.name, subtitle:m.isActive ? 'Active' : 'Ended', item:m, Icon:Pill })),
    ...MOCK_HEALTH_DATA.weightHistory.map(w => ({ type:'weight', date:new Date(w.date), displayDate:fd(w.date), title:`${w.weight} ${pet.weightUnit}`, subtitle:'Weight', item:w, Icon:Scale }))
  ].sort((a, b) => b.date - a.date).slice(0, 8);

  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-[15px] font-semibold text-[#111]">Recent</h3>
        <div className="flex items-center gap-3">
          <button onClick={() => onOpenSheet('ADD_RECORD')} className="w-6 h-6 rounded-full flex items-center justify-center active:scale-[0.9] transition-transform" style={{ background: '#F3EFEB' }}>
            <Plus size={13} className="text-[#A09A94]" />
          </button>
        </div>
      </div>
      {/* Clean list — no cards, just content */}
      <div>
        {feed.slice(0, 5).map((item, i) => {
          const dots = { vaccine: '#3F8D63', vet: '#5A6FA8', med: '#E85D2A', weight: '#B07A3A' };
          return (
            <div key={`${item.type}_${i}`}
              className="flex items-center gap-3 py-3 cursor-pointer active:opacity-60 transition-opacity"
              onClick={() => { if (item.type === 'vaccine') onOpenSheet('VACCINE_DETAILS', item.item); if (item.type === 'vet') onOpenSheet('VET_DETAILS', item.item); if (item.type === 'med') onOpenSheet('MED_DETAILS', item.item); if (item.type === 'weight') onOpenSheet('WEIGHT_DETAILS', item.item); }}>
              <div className="w-[3px] h-[28px] rounded-full shrink-0" style={{ background: dots[item.type] || '#C4BBB3' }} />
              <div className="flex-1 min-w-0">
                <span className="text-[14px] font-semibold text-[#111] block truncate">{item.title}</span>
                <span className="text-[11px] text-[#A09A94]">{item.subtitle}</span>
              </div>
              <span className="text-[11px] text-[#C4BBB3] shrink-0">{item.displayDate}</span>
            </div>
          );
        })}
      </div>
      {/* Color legend + See all */}
      <div className="flex items-center pt-3">
        <div className="flex items-center gap-3 flex-1">
          {[
            { color: '#B07A3A', label: 'Weight' },
            { color: '#E85D2A', label: 'Meds' },
            { color: '#5A6FA8', label: 'Vet' },
            { color: '#3F8D63', label: 'Vaccine' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <div className="w-[5px] h-[5px] rounded-full" style={{ background: l.color }} />
              <span className="text-[10px] text-[#A09A94]">{l.label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => onOpenSheet('RECENT_MEDICAL')} className="text-[11px] font-semibold text-[#E85D2A] active:opacity-70 shrink-0">See all</button>
      </div>
    </section>
  );
};

const HealthTab = ({ pet, meds, onMarkTaken, onOpenSheet }) => {
  // Weight data
  const history = MOCK_HEALTH_DATA.weightHistory;
  const cw = history[history.length - 1].weight;
  const maxW = Math.max(...history.map(d => d.weight)) + 1, minW = Math.min(...history.map(d => d.weight)) - 1, range = maxW - minW;
  const sp = history.map((d, i) => `${(i / (history.length - 1)) * 100},${24 - ((d.weight - minW) / range) * 24}`).join(' ');

  // Vaccine status
  const sortedVacs = [...MOCK_HEALTH_DATA.vaccinations].sort((a,b) => new Date(a.nextDate) - new Date(b.nextDate));
  const nextVac = sortedVacs[0];
  const daysToVac = Math.ceil((new Date(nextVac.nextDate) - new Date()) / 86400000);
  const vacStatus = daysToVac < 0 ? 'Overdue' : daysToVac <= 30 ? 'Soon' : 'OK';

  // Meds status
  const activeMeds = meds.filter(m => m.isActive);
  const medsDue = activeMeds.some(m => !m.takenToday);

  return (
    <div className="px-5 py-5 space-y-5">

      {/* Weight — Crypto-style chart */}
      <div className="rounded-[20px] p-5 active:scale-[0.98] transition-transform cursor-pointer relative" onClick={() => onOpenSheet('WEIGHT_SECTION')} style={{ background: '#F7F5F2', border: '1px solid #EDE8E2', animation: 'homeReveal 0.4s 0.05s cubic-bezier(0.22,1,0.36,1) both' }}>
        <button onClick={(e) => { e.stopPropagation(); onOpenSheet('ADD_WEIGHT'); }} className="absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center active:scale-[0.9] transition-transform" style={{ background: '#F3EFEB' }}>
          <Plus size={13} className="text-[#A09A94]" />
        </button>
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-[32px] font-bold text-[#111] tracking-[-1px] leading-none">{cw}</span>
          <span className="text-[14px] font-medium text-[#A09A94]">{pet.weightUnit}</span>
          {(() => {
            const prev = history.length > 1 ? history[history.length - 2].weight : cw;
            const diff = (cw - prev).toFixed(1);
            const isUp = parseFloat(diff) > 0;
            return diff !== '0.0' ? (
              <span className={`text-[12px] font-bold px-1.5 py-0.5 rounded-md ${isUp ? 'text-[#E85D2A] bg-[#FFF5F0]' : 'text-[#3F8D63] bg-[#F0F7ED]'}`}>
                {isUp ? '+' : ''}{diff}
              </span>
            ) : null;
          })()}
        </div>
        <div className="text-[11px] text-[#C4BBB3] mb-4">Last 6 months</div>

        {/* SVG chart — smooth bezier like crypto apps */}
        <div className="h-[80px] w-full relative">
          <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
            {/* Gradient fill under curve */}
            <defs>
              <linearGradient id="cryptoGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E85D2A" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#E85D2A" stopOpacity="0" />
              </linearGradient>
            </defs>
            {(() => {
              const pts = history.map((d, i) => ({
                x: (i / (history.length - 1)) * 200,
                y: 55 - ((d.weight - minW) / range) * 50,
              }));
              // Bezier smooth path
              let path = `M ${pts[0].x} ${pts[0].y}`;
              for (let i = 0; i < pts.length - 1; i++) {
                const cp1x = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.4;
                const cp2x = pts[i + 1].x - (pts[i + 1].x - pts[i].x) * 0.4;
                path += ` C ${cp1x} ${pts[i].y} ${cp2x} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`;
              }
              const areaPath = path + ` L 200 60 L 0 60 Z`;
              const lastPt = pts[pts.length - 1];
              return (
                <>
                  <path d={areaPath} fill="url(#cryptoGrad)" />
                  <path d={path} fill="none" stroke="#E85D2A" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Glow dot on latest */}
                  <circle cx={lastPt.x} cy={lastPt.y} r="6" fill="#E85D2A" opacity="0.15" />
                  <circle cx={lastPt.x} cy={lastPt.y} r="3.5" fill="#fff" stroke="#E85D2A" strokeWidth="2" />
                </>
              );
            })()}
          </svg>
        </div>

        {/* Date labels */}
        <div className="flex justify-between mt-1 px-1">
          {history.filter((_, i) => i === 0 || i === Math.floor(history.length / 2) || i === history.length - 1).map((d, i) => (
            <span key={i} className="text-[9px] text-[#C4BBB3]">
              {new Date(d.date).toLocaleDateString('en', { month: 'short', year: '2-digit' })}
            </span>
          ))}
        </div>
      </div>

      {/* Status pills row */}
      <div className="grid grid-cols-3 gap-2" style={{ animation: 'homeReveal 0.4s 0.1s cubic-bezier(0.22,1,0.36,1) both' }}>
        <button onClick={() => onOpenSheet('VACCINATIONS_SECTION')} className="rounded-[14px] p-3 text-left active:scale-[0.96] transition-transform relative" style={{ background: vacStatus === 'Overdue' ? '#FFF5F0' : '#F7F5F2', border: `1px solid ${vacStatus === 'Overdue' ? '#FFE0D0' : '#EDE8E2'}` }}>
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: vacStatus === 'Overdue' ? '#FFE0D0' : '#F3EFEB' }}><Plus size={10} className={vacStatus === 'Overdue' ? 'text-[#E85D2A]' : 'text-[#A09A94]'} /></div>
          <Syringe size={14} className={vacStatus === 'Overdue' ? 'text-[#E85D2A]' : 'text-[#A09A94]'} />
          <div className="text-[12px] font-bold text-[#111] mt-2">{vacStatus === 'Overdue' ? 'Overdue' : nextVac.name}</div>
          <div className="text-[10px] text-[#A09A94] mt-0.5">Vaccines</div>
        </button>
        <button onClick={() => onOpenSheet('MEDICATIONS_SECTION')} className="rounded-[14px] p-3 text-left active:scale-[0.96] transition-transform relative" style={{ background: medsDue ? '#FFF8F0' : '#F7F5F2', border: `1px solid ${medsDue ? '#F0E4D0' : '#EDE8E2'}` }}>
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: medsDue ? '#F0E4D0' : '#F3EFEB' }}><Plus size={10} className={medsDue ? 'text-[#B07A3A]' : 'text-[#A09A94]'} /></div>
          <Pill size={14} className={medsDue ? 'text-[#B07A3A]' : 'text-[#A09A94]'} />
          <div className="text-[12px] font-bold text-[#111] mt-2">{activeMeds.length} active</div>
          <div className="text-[10px] text-[#A09A94] mt-0.5">Meds</div>
        </button>
        <button onClick={() => onOpenSheet('ALLERGIES_SECTION')} className="rounded-[14px] p-3 text-left active:scale-[0.96] transition-transform relative" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}>
          <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#F3EFEB' }}><Plus size={10} className="text-[#A09A94]" /></div>
          <AlertTriangle size={14} className="text-[#A09A94]" />
          <div className="text-[12px] font-bold text-[#111] mt-2">{MOCK_HEALTH_DATA.allergies.length} logged</div>
          <div className="text-[10px] text-[#A09A94] mt-0.5">Allergies</div>
        </button>
      </div>

      {/* Vet visit — compact */}
      <VetVisitsSummaryCard onOpenSheet={onOpenSheet} />

      {/* Recent medical — keep vertical but styled */}
      <RecentMedicalFeed pet={pet} meds={meds} onOpenSheet={onOpenSheet} />
    </div>
  );
};

// --- EMERGENCY TAB COMPONENTS ---

const SectionHeader = ({ title, actionIcon: ActionIcon, onAction }) => (
  <div className="flex justify-between items-center mb-3">
    <h3 className="text-[16px] font-semibold text-[#111111]">{title}</h3>
    {ActionIcon && onAction && (
      <button onClick={onAction} className="p-1.5 text-[#FF6B35] hover:bg-[#FF6B35]/10 rounded-full transition-colors">
        <ActionIcon size={18} strokeWidth={2.5} />
      </button>
    )}
  </div>
);

const ExpandableList = ({ items, renderItem, limit = 2 }) => {
  const [expanded, setExpanded] = useState(false);
  const visibleItems = expanded ? items : items.slice(0, limit);
  const hasMore = items.length > limit;

  return (
    <div className="bg-[#FFFFFF] border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[16px] overflow-hidden flex flex-col">
      <div className={`flex flex-col ${expanded ? 'max-h-[430px] overflow-y-auto custom-scrollbar' : ''}`}>
        {visibleItems.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderItem(item)}
            {index < visibleItems.length - 1 && <div className="mx-4 h-[1px] bg-black/[0.06] shrink-0" />}
          </React.Fragment>
        ))}
      </div>
      {hasMore && (
        <>
          <div className="mx-4 h-[1px] bg-black/[0.06] shrink-0" />
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full h-[44px] flex items-center justify-center gap-1.5 text-[13px] font-semibold text-[#6E6E73] hover:text-[#111111] hover:bg-[#F7F7F8] transition-colors shrink-0"
          >
            {expanded ? 'Show less' : `View all (${items.length})`}
            <ChevronDown size={16} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </>
      )}
      {items.length === 0 && (
        <div className="p-4 text-center text-[14px] text-[#8E8E93]">No records found.</div>
      )}
    </div>
  );
};

const MedicalSubsection = ({ title, icon: Icon, items, type, showAll = false }) => {
  const [expanded, setExpanded] = useState(showAll);
  const visible = expanded ? items : items.slice(0, 2);
  const hasMore = !showAll && items.length > 2;

  return (
    <div>
      <div className="flex items-center gap-1.5 text-[#8E8E93] mb-2">
        <Icon size={14} /> <span className="text-[12px] font-semibold uppercase tracking-wider">{title}</span>
      </div>
      {items.length > 0 ? (
        <div className="space-y-1">
          {visible.map(item => {
            const isSev = item.severity === 'Severe';
            const isMod = item.severity === 'Moderate';
            const bgClass = isSev ? 'bg-[#FFF0F0]' : isMod ? 'bg-[#FFF4E5]' : 'bg-transparent';
            
            return (
              <div key={item.id} className={`flex justify-between items-center py-2 px-3 -mx-3 rounded-[10px] ${bgClass}`}>
                <span className="text-[15px] font-medium text-[#111111]">{item.name}</span>
                {type === 'allergies' ? (
                  <Badge variant={isSev ? 'error' : isMod ? 'warning' : 'default'}>{item.severity}</Badge>
                ) : (
                  <span className="text-[13px] text-[#6E6E73]">{item.dosage || item.status}</span>
                )}
              </div>
            );
          })}
          {hasMore && (
             <button onClick={() => setExpanded(!expanded)} className="text-[13px] font-semibold text-[#6E6E73] hover:text-[#111111] py-1.5 flex items-center gap-1 transition-colors mt-1">
               {expanded ? 'Show less' : `View all (${items.length})`}
               <ChevronDown size={14} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
             </button>
          )}
        </div>
      ) : <span className="text-[14px] text-[#6E6E73]">None recorded</span>}
    </div>
  );
};

const EmergencyTab = ({ pet, showToast, navigateToTab, onUpdate, onOpenPublicView }) => {
  const [contactSheet, setContactSheet] = useState(null); 
  const [vetSheet, setVetSheet] = useState(null); 
  const [shareSheet, setShareSheet] = useState(false);
  const [moreSheet, setMoreSheet] = useState(false);

  const hasOtherPrimary = pet.emergencyContacts.some(c => c.isPrimary && c.id !== contactSheet?.id);

  const handleCall = (e, phone, name) => {
    e.stopPropagation();
    showToast(`Calling ${name}...`);
    setTimeout(() => { window.location.href = `tel:${phone.replace(/\s/g, '')}`; }, 500);
  };

  const handleCopy = (text, label) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    showToast(`${label} copied`);
  };

  const saveContact = (contact) => {
    const isNew = !contact.id;
    let newContacts = [...pet.emergencyContacts];
    if (contact.isPrimary) {
      newContacts = newContacts.map(c => ({ ...c, isPrimary: false }));
    }
    if (isNew) {
      newContacts.push({ ...contact, id: `ec${Date.now()}` });
    } else {
      const idx = newContacts.findIndex(c => c.id === contact.id);
      if (idx >= 0) newContacts[idx] = contact;
    }
    newContacts.sort((a,b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
    onUpdate({ ...pet, emergencyContacts: newContacts });
    setContactSheet(null);
    showToast('Contact saved');
  };

  const saveVet = (vet) => {
    const isNew = !vet.id;
    let newVets = [...pet.vets];
    if (isNew) {
      newVets.push({ ...vet, id: `v${Date.now()}` });
    } else {
      newVets = newVets.map(v => v.id === vet.id ? vet : v);
    }
    onUpdate({ ...pet, vets: newVets });
    setVetSheet(null);
    showToast('Vet saved');
  };

  return (
    <div className="relative min-h-full flex flex-col">
      <div className="px-5 py-4 flex flex-col" style={{ minHeight: 'calc(100% - 80px)' }}>

        {/* ═══ TOP: One big call button — Emergency Vet ═══ */}
        {(() => { const eVet = pet.vets.find(v => v.type === 'Emergency') || pet.vets[0]; return eVet ? (
          <button onClick={(e) => handleCall(e, eVet.phone, eVet.clinic)}
            className="w-full rounded-[14px] px-4 py-3.5 text-left active:scale-[0.97] transition-transform mb-4" style={{ background: '#FFF5F0', border: '1px solid #FFE0D0', animation: 'homeReveal 0.4s 0.05s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#FFE0D0' }}>
                <Phone size={17} className="text-[#E85D2A]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-[#C4602A]">{eVet.clinic}</div>
                <div className="text-[11px] text-[#E85D2A]/50">{eVet.name ? `${eVet.name} · ` : ''}Emergency Vet</div>
              </div>
            </div>
          </button>
        ) : null; })()}

        {/* ═══ MIDDLE: Allergies + Meds compact ═══ */}
        <div className="flex-1 space-y-4" style={{ animation: 'homeReveal 0.4s 0.1s cubic-bezier(0.22,1,0.36,1) both' }}>

          {/* Allergies — compact rows */}
          <div>
            <h3 className="text-[13px] font-semibold text-[#111] mb-2">Allergies</h3>
            {pet.medical.allergies.length > 0 ? (
              <div className="space-y-1">
                {pet.medical.allergies.map(a => (
                  <div key={a.id} className="flex items-center justify-between py-1.5">
                    <span className="text-[13px] font-semibold text-[#111]">{a.name}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wide ${
                      a.severity === 'Severe' ? 'text-[#E85D2A]' :
                      a.severity === 'Moderate' ? 'text-[#B07A3A]' : 'text-[#A09A94]'
                    }`}>{a.severity}</span>
                  </div>
                ))}
              </div>
            ) : <span className="text-[12px] text-[#A09A94]">None recorded</span>}
          </div>

          {/* Active meds — grouped in one card */}
          <div className="rounded-[14px] p-3.5" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}>
            <div className="text-[10px] font-bold text-[#A09A94] uppercase tracking-[0.06em] mb-2">Active Medications</div>
            {pet.medical.medications.filter(m => m.status !== 'Inactive').length > 0 ? (
              pet.medical.medications.filter(m => m.status !== 'Inactive').map((m, i, arr) => (
                <div key={m.id} className={`flex items-center justify-between py-2 ${i < arr.length - 1 ? 'border-b border-[#EDE8E2]' : ''}`}>
                  <span className="text-[14px] font-semibold text-[#111]">{m.name}</span>
                  <span className="text-[11px] text-[#A09A94]">{m.dosage}</span>
                </div>
              ))
            ) : <span className="text-[12px] text-[#A09A94]">None active</span>}
          </div>

        </div>

        {/* ═══ BOTTOM: Microchip + Share ═══ */}
        <div className="pt-4 mt-auto space-y-3" style={{ animation: 'homeReveal 0.4s 0.15s cubic-bezier(0.22,1,0.36,1) both' }}>
          <div className="flex items-center gap-3 py-2.5 rounded-[14px] px-4" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-[#A09A94] block">Microchip</span>
              <span className="text-[13px] font-semibold text-[#111] font-mono tracking-wide">{pet.microchip}</span>
            </div>
            <button onClick={() => handleCopy(pet.microchip, 'Microchip')} className="p-1.5 rounded-full active:scale-[0.9]" style={{ background: '#F3EFEB' }}><Copy size={13} className="text-[#A09A94]" /></button>
          </div>
          <button onClick={() => setShareSheet(true)} className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-[12px] active:scale-[0.97] transition-transform" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
            <Share2 size={13} className="text-[#A09A94]" /> <span className="text-[12px] font-semibold text-[#6E6058]">Share emergency info</span>
          </button>
        </div>
      </div>

      {/* Edit/Add Contact */}
      <CardModal 
        isOpen={!!contactSheet} 
        onClose={() => setContactSheet(null)} 
        title={contactSheet?.id ? 'Edit Contact' : 'Add Contact'}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setContactSheet(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => saveContact(contactSheet)} disabled={!contactSheet?.name || !contactSheet?.phone}>Save</Button>
          </div>
        }
      >
        {contactSheet && (
          <div className="space-y-4 pt-2">
            <TextInput label="Name" value={contactSheet.name || ''} onChange={e => setContactSheet({...contactSheet, name: e.target.value})} />
            <Select label="Relationship" options={RELATIONSHIP_OPTIONS} value={contactSheet.relationship || 'Owner'} onChange={e => setContactSheet({...contactSheet, relationship: e.target.value})} />
            <TextInput label="Phone Number" type="tel" value={contactSheet.phone || ''} onChange={e => setContactSheet({...contactSheet, phone: e.target.value})} />
            
            <div className="flex items-center justify-between p-4 bg-[#F7F7F8] rounded-xl mt-2 cursor-pointer" onClick={() => setContactSheet({...contactSheet, isPrimary: !contactSheet.isPrimary})}>
              <div>
                <span className="text-[15px] font-medium text-[#111111] block">Primary Contact</span>
                {contactSheet.isPrimary && hasOtherPrimary && (
                  <span className="text-[12px] text-[#FF9500] block mt-0.5">This will replace the current primary contact.</span>
                )}
              </div>
              <div className={`w-[50px] h-[30px] rounded-full transition-colors relative shrink-0 ${contactSheet.isPrimary ? 'bg-[#00C060]' : 'bg-[#D1D1D6]'}`}>
                <div className={`absolute top-[2px] w-[26px] h-[26px] bg-white rounded-full shadow-sm transition-transform ${contactSheet.isPrimary ? 'left-[22px]' : 'left-[2px]'}`} />
              </div>
            </div>
          </div>
        )}
      </CardModal>

      {/* Edit/Add Vet */}
      <CardModal 
        isOpen={!!vetSheet} 
        onClose={() => setVetSheet(null)} 
        title={vetSheet?.id ? 'Edit Vet' : 'Add Vet'}
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setVetSheet(null)}>Cancel</Button>
            <Button variant="primary" onClick={() => saveVet(vetSheet)} disabled={!vetSheet?.clinic || !vetSheet?.phone}>Save</Button>
          </div>
        }
      >
        {vetSheet && (
          <div className="space-y-4 pt-2">
            <TextInput label="Clinic Name" value={vetSheet.clinic || ''} onChange={e => setVetSheet({...vetSheet, clinic: e.target.value})} />
            <TextInput label="Vet Name (Optional)" value={vetSheet.name || ''} onChange={e => setVetSheet({...vetSheet, name: e.target.value})} />
            <Select label="Type" options={VET_TYPE_OPTIONS} value={vetSheet.type || 'Primary'} onChange={e => setVetSheet({...vetSheet, type: e.target.value})} />
            <TextInput label="Phone Number" type="tel" value={vetSheet.phone || ''} onChange={e => setVetSheet({...vetSheet, phone: e.target.value})} />
          </div>
        )}
      </CardModal>

      {/* Share Sheet — minimal */}
      <CardModal isOpen={shareSheet} onClose={() => setShareSheet(false)} title="Share Emergency">
        <div className="pt-1">
          <div className="w-[120px] h-[120px] mx-auto rounded-[14px] flex items-center justify-center mb-3" style={{ background: '#F3EFEB' }}>
            <QrCode size={80} color="#111" strokeWidth={1.5} />
          </div>
          <p className="text-[11px] text-[#A09A94] text-center mb-4">Temporary read-only access to {pet.name}'s critical info.</p>
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-[12px] mb-3" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
            <span className="text-[12px] font-medium text-[#111] flex-1 truncate font-mono">fylos.com/e/luna-89x2</span>
            <button onClick={() => handleCopy('fylos.com/e/luna-89x2', 'Link')} className="p-1.5 rounded-full active:scale-[0.9]" style={{ background: '#EDE8E2' }}><Copy size={12} className="text-[#A09A94]" /></button>
          </div>
          <p className="text-[10px] text-[#C4BBB3] text-center mb-4">Expires in 24 hours</p>
          <div className="space-y-2">
            <Button variant="primary" onClick={() => { setShareSheet(false); showToast('Sharing...'); }}>Share Link</Button>
            <Button variant="ghost" onClick={() => onOpenPublicView()}>Preview public page</Button>
          </div>
        </div>
      </CardModal>

      {/* More Actions Sheet — minimal */}
      <CardModal isOpen={moreSheet} onClose={() => setMoreSheet(false)} title="Actions">
        <div className="pt-1 space-y-0">
          <button onClick={() => { setMoreSheet(false); handleCall({stopPropagation:()=>{}}, pet.vets.find(v=>v.type==='Primary')?.phone || '', 'Primary Vet'); }} className="w-full flex items-center gap-3 py-3 active:opacity-60 text-left border-b border-[#EDE8E2]">
            <Stethoscope size={15} className="text-[#A09A94]" />
            <span className="text-[14px] font-semibold text-[#111]">Call Primary Vet</span>
          </button>
          <button onClick={() => { setMoreSheet(false); handleCall({stopPropagation:()=>{}}, pet.emergencyContacts.find(c=>c.isPrimary)?.phone || '', 'Primary Contact'); }} className="w-full flex items-center gap-3 py-3 active:opacity-60 text-left border-b border-[#EDE8E2]">
            <Phone size={15} className="text-[#A09A94]" />
            <span className="text-[14px] font-semibold text-[#111]">Call Primary Contact</span>
          </button>
          <button onClick={() => { setMoreSheet(false); handleCopy(pet.microchip, 'Microchip'); }} className="w-full flex items-center gap-3 py-3 active:opacity-60 text-left">
            <Copy size={15} className="text-[#A09A94]" />
            <span className="text-[14px] font-semibold text-[#111]">Copy Microchip ID</span>
          </button>
          <button onClick={() => { setMoreSheet(false); handleCopy(pet.address, 'Address'); }} className="w-full flex items-center gap-3 py-3 active:opacity-60 text-left">
            <MapPin size={15} className="text-[#A09A94]" />
            <span className="text-[14px] font-semibold text-[#111]">Copy Home Address</span>
          </button>
        </div>
      </CardModal>
    </div>
  );
};

// --- PUBLIC EMERGENCY VIEWER ---
const PublicEmergencyViewer = ({ pet, onClose }) => {
  return (
    <div className="fixed inset-0 bg-[#F7F7F8] z-[100] flex flex-col animate-in fade-in zoom-in-95 duration-300">
      <header className="bg-white border-b border-black/[0.04] px-5 py-4 flex items-center justify-between sticky top-0 z-10">
        <FylosLogo fontSize="18px" textColor="#111111" />
        <button onClick={onClose} className="text-[15px] font-semibold text-[#FF6B35] active:opacity-70">Close</button>
      </header>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 pb-12">
        <div className="text-center">
          <Avatar src={pet.photo} size={100} className="mx-auto mb-4 border-4 border-white shadow-sm" />
          <h1 className="text-[28px] font-bold text-[#111111]">{pet.name}</h1>
          <p className="text-[15px] text-[#6E6E73] mt-1">{pet.breed} · {pet.sex}</p>
        </div>

        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/[0.04] space-y-4">
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Primary Contact</h2>
          {pet.emergencyContacts.filter(c=>c.isPrimary).map(contact => (
            <div key={contact.id} className="flex items-center justify-between">
              <div>
                <span className="text-[16px] font-bold text-[#111111] block">{contact.name}</span>
                <span className="text-[14px] text-[#6E6E73]">{contact.relationship}</span>
              </div>
              <a href={`tel:${contact.phone}`} className="w-12 h-12 bg-[#FF6B35] text-white rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform">
                <Phone fill="currentColor" size={20} />
              </a>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/[0.04] space-y-4">
          <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Veterinarian</h2>
          {pet.vets.slice(0,1).map(vet => (
            <div key={vet.id} className="flex items-center justify-between">
              <div>
                <span className="text-[16px] font-bold text-[#111111] block">{vet.clinic}</span>
                <span className="text-[14px] text-[#6E6E73]">{vet.phone}</span>
              </div>
              <a href={`tel:${vet.phone}`} className="w-12 h-12 bg-[#E5F9ED] text-[#00C060] rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform">
                <Phone fill="currentColor" size={20} />
              </a>
            </div>
          ))}
        </div>

        {pet.medical.allergies.length > 0 && (
          <div className="bg-[#FFF4E5] rounded-[20px] p-5 border border-[#FF9500]/20">
            <h2 className="flex items-center gap-2 text-[14px] font-bold text-[#FF9500] uppercase tracking-wider mb-3">
              <AlertTriangle size={18} /> Allergies
            </h2>
            <div className="space-y-2">
              {pet.medical.allergies.map(a => (
                <div key={a.id} className="flex justify-between text-[15px] font-medium text-[#111111]">
                  <span>{a.name}</span>
                  <span className={a.severity === 'Severe' ? 'text-[#FF3B30]' : 'text-[#FF9500]'}>{a.severity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-[20px] p-5 shadow-sm border border-black/[0.04]">
           <h2 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-3">Identification</h2>
           <div className="flex justify-between items-center py-2">
             <span className="text-[15px] text-[#6E6E73]">Microchip</span>
             <span className="text-[15px] font-mono font-semibold text-[#111111]">{pet.microchip}</span>
           </div>
        </div>
      </div>
      
      <div className="py-4 text-center text-[12px] font-semibold text-[#CFCFD4] tracking-wide uppercase bg-[#F7F7F8]">
        Powered by FYLOS
      </div>
    </div>
  );
};

// --- SHARE MODULE ---

const RadioList = ({ options, value, onChange }) => (
  <div className="space-y-2">
    {options.map(opt => (
      <button 
        key={opt.id} 
        onClick={() => onChange(opt.id)} 
        className={`flex items-center justify-between w-full p-4 rounded-[14px] transition-all duration-200 active:scale-[0.98] border ${
          value === opt.id ? 'bg-[#FF6B35]/5 border-[#FF6B35]/30' : 'bg-[#F7F7F8] border-transparent hover:bg-black/5'
        }`}
      >
        <div className="flex flex-col items-start text-left pr-4">
          <span className={`text-[15px] font-semibold ${value === opt.id ? 'text-[#FF6B35]' : 'text-[#111111]'}`}>{opt.label}</span>
          {opt.description && <span className="text-[13px] text-[#6E6E73] mt-0.5 leading-snug">{opt.description}</span>}
        </div>
        <div className={`shrink-0 w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center transition-colors ${value === opt.id ? 'border-[#FF6B35]' : 'border-black/20'}`}>
          {value === opt.id && <div className="w-2.5 h-2.5 bg-[#FF6B35] rounded-full" />}
        </div>
      </button>
    ))}
  </div>
);

const getPermissionBadgeVariant = (perm) => {
  if (!perm) return 'default';
  if (perm.includes('Full')) return 'info';
  if (perm.includes('Medical')) return 'warning';
  if (perm.includes('Edit')) return 'success';
  return 'default';
};

const ShareTab = ({ pet, shares, openSheet, onNavigateToFamily }) => {
  return (
    <div className="px-5 py-5 flex flex-col" style={{ minHeight: 'calc(100% - 80px)' }}>
      {/* Share button — prominent */}
      <button onClick={() => openSheet('link')}
        className="w-full rounded-[14px] px-4 py-4 flex items-center gap-3 active:scale-[0.97] transition-transform mb-2" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2' }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F3EFEB' }}>
          <Share2 size={17} className="text-[#E85D2A]" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-[14px] font-semibold text-[#111]">Share {pet.name}'s profile</div>
          <div className="text-[11px] text-[#A09A94] mt-0.5">Via link or QR code</div>
        </div>
        <ChevronRight size={15} className="text-[#D4CCC4]" />
      </button>

      {/* Who has access */}
      <div className="flex-1 mt-4">
        <h3 className="text-[13px] font-semibold text-[#111] mb-3">Shared with</h3>
        <div>
          {shares.map((share, i) => (
            <div key={share.id} className={`flex items-center gap-3 py-2.5 ${i < shares.length - 1 ? 'border-b border-[#EDE8E2]' : ''}`}>
              <Avatar src={share.avatar} initials={share.name.charAt(0)} size={32} />
              <div className="flex-1 min-w-0">
                <span className="text-[13px] font-semibold text-[#111] truncate block">{share.name}</span>
                <span className="text-[11px] text-[#A09A94]">{share.role}</span>
              </div>
              <button onClick={() => openSheet('details', share)} className="text-[11px] font-medium text-[#E85D2A] active:opacity-70 shrink-0">Edit</button>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-[#C4BBB3] text-center pt-4">You can revoke access anytime</p>
    </div>
  );
};

const FamilySharingScreen = ({ onBack, showToast }) => (
  <ScreenContainer>
    <div className="px-5 py-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <section>
        <h3 className="text-[16px] font-semibold text-[#111111] mb-3 uppercase tracking-wider text-[#8E8E93]">Co-owners (Full Access)</h3>
        <div className="bg-[#FFFFFF] rounded-[16px] border border-black/[0.04] shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
            <Avatar src={MOCK_USER.avatar} size={48} />
            <div className="flex-1">
              <div className="font-semibold text-[16px] text-[#111111]">Alex (You)</div>
              <div className="text-[13px] text-[#6E6E73]">Owner</div>
            </div>
            <Badge variant="default">Owner</Badge>
          </div>
          <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
            <Avatar src={INITIAL_SHARES[0].avatar} size={48} />
            <div className="flex-1">
              <div className="font-semibold text-[16px] text-[#111111]">{INITIAL_SHARES[0].name}</div>
              <div className="text-[13px] text-[#6E6E73]">{INITIAL_SHARES[0].role}</div>
            </div>
          </div>
          <button onClick={() => showToast('Add co-owner coming soon')} className="w-full p-4 flex items-center gap-3 text-[#FF6B35] font-semibold text-[15px] hover:bg-[#FF6B35]/5 transition-colors">
            <UserPlus size={18} /> Add co-owner
          </button>
        </div>
      </section>

      <section>
        <h3 className="text-[16px] font-semibold text-[#111111] mb-3 uppercase tracking-wider text-[#8E8E93]">Family Members (Limited)</h3>
        <div className="bg-[#FFFFFF] rounded-[16px] border border-black/[0.04] shadow-sm overflow-hidden">
          <div className="flex items-center gap-4 p-4 border-b border-black/[0.04]">
            <Avatar src={INITIAL_SHARES[1].avatar} size={48} />
            <div className="flex-1">
              <div className="font-semibold text-[16px] text-[#111111]">{INITIAL_SHARES[1].name}</div>
              <div className="text-[13px] text-[#6E6E73]">{INITIAL_SHARES[1].role}</div>
            </div>
          </div>
          <button onClick={() => showToast('Add family coming soon')} className="w-full p-4 flex items-center gap-3 text-[#FF6B35] font-semibold text-[15px] hover:bg-[#FF6B35]/5 transition-colors">
            <UserPlus size={18} /> Add family member
          </button>
        </div>
      </section>

      <Card variant="grey" className="!p-5">
        <h4 className="text-[15px] font-semibold text-[#111111] mb-2 flex items-center gap-2"><Info size={16} className="text-[#8E8E93]" /> About family sharing</h4>
        <p className="text-[13px] text-[#6E6E73] leading-relaxed">
          Co-owners have full administrative access. Family members can view the profile and add activity/health logs, but cannot change core settings or manage sharing.
        </p>
      </Card>
    </div>
  </ScreenContainer>
);

// --- SCREENS ---

const PetListScreen = ({ pets, onSelectPet }) => (
  <ScreenContainer>
    <div className="px-5 pt-2 pb-8">
      {pets.length === 0 ? (
        <EmptyState
          icon={PawPrint} title="No Pets Yet" description="Add your first pet to start tracking their health, milestones, and more."
          actionLabel="Add Pet" onAction={() => alert('Add Pet — coming in Step 10')}
        />
      ) : (
        <div className="space-y-3">
          {pets.map((pet, idx) => (
            <div key={pet.id} className="rounded-[20px] p-3.5 active:scale-[0.98] transition-transform cursor-pointer" onClick={() => onSelectPet(pet.id)}
              style={{ background: '#F7F5F2', border: '1px solid #EDE8E2', animation: `homeReveal 0.4s ${0.05 + idx * 0.1}s cubic-bezier(0.22,1,0.36,1) both` }}>
              <div className="flex gap-4">
                {/* Compact photo */}
                <img src={pet.photo} alt={pet.name} className="w-[90px] h-[90px] rounded-[16px] object-cover shrink-0" />
                {/* Info */}
                <div className="flex-1 min-w-0 py-0.5">
                  <h3 className="text-[18px] font-bold text-[#111] tracking-[-0.2px]">{pet.name}</h3>
                  <p className="text-[13px] text-[#A09A94] mt-0.5">{pet.breed} · {pet.age} yrs</p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <div className="flex items-center gap-1 text-[11px] text-[#6E6058] font-medium">
                      <Scale size={11} className="text-[#C4BBB3]" />
                      {pet.weight} {pet.weightUnit}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-[#6E6058] font-medium">
                      <MapPin size={11} className="text-[#C4BBB3]" />
                      {pet.location || 'Zurich'}
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#D4CCC4] shrink-0 self-center" />
              </div>
            </div>
          ))}

          {/* Add pet button */}
          <button
            onClick={() => { window.location.href = '/add-pet'; }}
            className="w-full rounded-[16px] py-3.5 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            style={{ background: '#F3EFEB', border: '1.5px dashed #DDD8D2', animation: `homeReveal 0.4s ${0.05 + pets.length * 0.1}s cubic-bezier(0.22,1,0.36,1) both` }}
          >
            <Plus size={15} className="text-[#A09A94]" />
            <span className="text-[13px] font-semibold text-[#A09A94]">Add another pet</span>
          </button>

          {/* ═══ FAMILY OVERVIEW ═══ */}
          <div className="pt-2" style={{ animation: `homeReveal 0.4s ${0.15 + pets.length * 0.1}s cubic-bezier(0.22,1,0.36,1) both` }}>
            {/* Stats row */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex-1 rounded-[14px] px-3 py-2.5 text-center" style={{ background: '#F3EFEB' }}>
                <div className="text-[16px] font-bold text-[#111]">{pets.length}</div>
                <div className="text-[10px] font-medium text-[#A09A94] mt-0.5">Pets</div>
              </div>
              <div className="flex-1 rounded-[14px] px-3 py-2.5 text-center" style={{ background: '#F3EFEB' }}>
                <div className="text-[16px] font-bold text-[#E85D2A]">45</div>
                <div className="text-[10px] font-medium text-[#A09A94] mt-0.5">Day streak</div>
              </div>
              <div className="flex-1 rounded-[14px] px-3 py-2.5 text-center" style={{ background: '#F3EFEB' }}>
                <div className="text-[16px] font-bold text-[#111]">12</div>
                <div className="text-[10px] font-medium text-[#A09A94] mt-0.5">Walks/mo</div>
              </div>
            </div>

            {/* Recent moments */}
            <div className="mb-5">
              <h4 className="text-[15px] font-semibold text-[#111] mb-3">Recent Moments</h4>
              <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {[
                  { img: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop', label: 'Park day' },
                  { img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop', label: 'Morning walk' },
                  { img: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop', label: 'Nap time' },
                ].map((m, i) => (
                  <div key={i} className="shrink-0">
                    <img src={m.img} alt={m.label} className="w-[100px] h-[100px] rounded-[14px] object-cover" />
                    <p className="text-[10px] text-[#A09A94] font-medium mt-1.5 text-center">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Care reminders */}
            <div>
              <h4 className="text-[15px] font-semibold text-[#111] mb-3">Coming Up</h4>
              <div className="space-y-2">
                {[
                  { pet: 'Leo', task: 'DHPP vaccine overdue', urgent: true, icon: AlertTriangle },
                  { pet: 'Leo', task: 'Grooming in 2 weeks', urgent: false, icon: Scissors },
                  { pet: 'Tao', task: 'Annual checkup next month', urgent: false, icon: Stethoscope },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-3.5 py-2.5 rounded-[14px]" style={{ background: item.urgent ? '#FFF5F0' : '#F3EFEB', border: item.urgent ? '1px solid #FFE0D0' : '1px solid #EDE8E2' }}>
                    <item.icon size={14} className={item.urgent ? 'text-[#E85D2A]' : 'text-[#A09A94]'} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[13px] font-semibold text-[#111]">{item.task}</span>
                    </div>
                    <span className="text-[11px] font-medium text-[#A09A94]">{item.pet}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </ScreenContainer>
);

const PetProfileScreen = ({ pet, onUpdate, showToast, onOpenPublicView, onNavigateToFamily }) => {
  const [activePetTab, setActivePetTab] = useState('About');
  const [displayPetTab, setDisplayPetTab] = useState('About');
  const [isFading, setIsFading] = useState(false);

  // LIFTED SHEET STATE
  const [editSheet, setEditSheet] = useState(null);
  const [triggerSheet, setTriggerSheet] = useState(false);
  const [milestoneSheet, setMilestoneSheet] = useState(false);
  const [newTrigger, setNewTrigger] = useState('');
  const [msTitle, setMsTitle] = useState('');
  const [msDate, setMsDate] = useState('');
  const [msNote, setMsNote] = useState('');

  // HEALTH LIFTED STATE
  const [healthSheet, setHealthSheet] = useState({ type: null, data: null });
  const [meds, setMeds] = useState(MOCK_HEALTH_DATA.medications);

  // LIFTED DOCUMENTS MODULE STATE
  const [addDocSheetOpen, setAddDocSheetOpen] = useState(false);
  const [scanFlowState, setScanFlowState] = useState('idle');
  const [viewingDoc, setViewingDoc] = useState(null);

  // SHARE TAB STATE
  const [shares, setShares] = useState(INITIAL_SHARES);
  const [shareActiveSheet, setShareActiveSheet] = useState(null);
  const [selectedShare, setSelectedShare] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const [shareConfig, setShareConfig] = useState({ permission: 'view', expiry: '24h' });

  // Local scroll lock: guarantees scrolling pauses in our simulated iPhone frame
  useEffect(() => {
    const isAnySheetOpen = !!editSheet || triggerSheet || milestoneSheet || addDocSheetOpen || scanFlowState !== 'idle' || !!viewingDoc;
    const containers = document.querySelectorAll('.custom-scrollbar');
    containers.forEach(container => {
      container.style.overflowY = isAnySheetOpen ? 'hidden' : 'auto';
    });
  }, [editSheet, triggerSheet, milestoneSheet]);

  const handleTabSwitch = (tab) => {
    if (tab === activePetTab) return;
    setActivePetTab(tab);
    setIsFading(true);
    setTimeout(() => {
      setDisplayPetTab(tab);
      setIsFading(false);
    }, 200);
  };

  const openEdit = (key, label, value, type = 'text', isPref = false) => {
    setEditSheet({ key, label, value: value || '', type, isPref });
  };

  const saveEdit = () => {
    const updatedPet = { ...pet };
    if (editSheet.isPref) {
      updatedPet.preferences = { ...updatedPet.preferences, [editSheet.key]: editSheet.value };
    } else {
      updatedPet[editSheet.key] = editSheet.value;
    }
    onUpdate(updatedPet);
    setEditSheet(null);
    showToast('Saved');
  };

  const toggleChip = (chip) => {
    let newTemps = [...pet.temperament];
    if (newTemps.includes(chip)) newTemps = newTemps.filter(c => c !== chip);
    else newTemps.push(chip);
    onUpdate({ ...pet, temperament: newTemps });
  };

  const removeTrigger = (trigger) => {
    onUpdate({ ...pet, anxietyTriggers: pet.anxietyTriggers.filter(t => t !== trigger) });
    showToast('Removed');
  };

  const addTrigger = (trigger) => {
    if (!trigger.trim() || pet.anxietyTriggers.includes(trigger)) return;
    onUpdate({ ...pet, anxietyTriggers: [...pet.anxietyTriggers, trigger.trim()] });
    setNewTrigger('');
    setTriggerSheet(false);
    showToast('Added');
  };

  const saveMilestone = () => {
    if (!msTitle || !msDate) return;
    const newMs = { id: Date.now().toString(), title: msTitle, date: msDate, note: msNote, icon: '🌟' };
    onUpdate({ ...pet, milestones: [newMs, ...pet.milestones] });
    setMsTitle(''); setMsDate(''); setMsNote('');
    setMilestoneSheet(false);
    showToast('Saved');
  };

  const deleteMilestone = (id) => {
    if (confirm('Delete this milestone?')) {
      onUpdate({ ...pet, milestones: pet.milestones.filter(m => m.id !== id) });
      showToast('Removed');
    }
  };

  const handleMarkTaken = (id) => { setMeds(meds.map(m => m.id === id ? { ...m, takenToday: true } : m)); };
  const openHealthSheet = (type, data = null) => setHealthSheet({ type, data });
  const closeHealthSheet = () => setHealthSheet({ type: null, data: null });

  // SHARE TAB ACTIONS
  const openShareSheet = (sheet, share = null) => {
    if (share) setSelectedShare(share);
    setShareActiveSheet(sheet);
  };
  const closeShareSheet = () => {
    setShareActiveSheet(null);
    setTimeout(() => {
      setQrGenerated(false);
      setShareConfig({ permission: 'view', expiry: '24h' });
    }, 300);
  };
  const handleCopyLink = (text) => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    showToast('Link copied to clipboard');
  };
  const handleRevokeShare = () => {
    setShares(shares.filter(s => s.id !== selectedShare.id));
    closeShareSheet();
    showToast('Access revoked');
  };
  const handleSavePermission = () => {
    const updated = shares.map(s => {
      if (s.id === selectedShare.id) {
        const permLabel = PERMISSION_LEVELS.find(p => p.id === shareConfig.permission)?.label || s.permission;
        return { ...s, permission: permLabel };
      }
      return s;
    });
    setShares(updated);
    closeShareSheet();
    showToast('Permissions updated');
  };

  if (!pet) return null;

  return (
    <div className="absolute inset-0 w-full h-full">
      {/* Scrollable Main Content */}
      <ScreenContainer>
        <PetProfileHeader pet={pet} showToast={showToast} />
        <PetProfileTabs activeTab={activePetTab} onTabChange={handleTabSwitch} />
        
        <div className={`transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
          {displayPetTab === 'About' ? (
            <AboutTab 
              pet={pet} onUpdate={onUpdate} showToast={showToast}
              onOpenEdit={openEdit} onOpenTrigger={() => setTriggerSheet(true)}
              onOpenMilestone={() => setMilestoneSheet(true)}
              onRemoveTrigger={removeTrigger} onToggleChip={toggleChip}
              onDeleteMilestone={deleteMilestone}
            />
          ) : displayPetTab === 'Health' ? (
            <HealthTab pet={pet} meds={meds} onMarkTaken={handleMarkTaken} onOpenSheet={openHealthSheet} />
          ) : displayPetTab === 'Documents' ? (
            <DocumentsTab 
              documents={pet.documents || []}
              onAddDocument={() => setAddDocSheetOpen(true)}
              onScanReceipt={() => setScanFlowState('camera')}
              onViewDocument={setViewingDoc}
            />
          ) : displayPetTab === 'Emergency' ? (
            <EmergencyTab 
              pet={pet} onUpdate={onUpdate} showToast={showToast} navigateToTab={handleTabSwitch} onOpenPublicView={() => onOpenPublicView(pet.id)}
            />
          ) : displayPetTab === 'Share' ? (
            <ShareTab 
              pet={pet} 
              shares={shares}
              openSheet={openShareSheet}
              onNavigateToFamily={onNavigateToFamily}
            />
          ) : (
            <div className="pt-10">
              <EmptyState icon={AlertCircle} title={displayPetTab} description={`${displayPetTab} features coming soon.`} />
            </div>
          )}
        </div>
      </ScreenContainer>

      {/* Sheets rendered OUTSIDE the scrollable container hierarchy */}
      <CardModal isOpen={!!editSheet} onClose={() => setEditSheet(null)} title={`Edit ${editSheet?.label}`}>
        <div className="space-y-6 pt-2">
          <TextInput 
            type={editSheet?.type || 'text'}
            value={editSheet?.value || ''} 
            onChange={e => setEditSheet({ ...editSheet, value: e.target.value })}
            placeholder={`Enter ${editSheet?.label?.toLowerCase()}`}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditSheet(null)}>Cancel</Button>
            <Button variant="primary" onClick={saveEdit}>Save</Button>
          </div>
        </div>
      </CardModal>

      <CardModal isOpen={triggerSheet} onClose={() => setTriggerSheet(false)} title="Add Anxiety Trigger">
        <div className="space-y-4 pt-1">
          <SearchInput value={newTrigger} onChange={e => setNewTrigger(e.target.value)} onClear={() => setNewTrigger('')} placeholder="Search or type custom..." />
          <div className="space-y-2 max-h-[180px] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {COMMON_ANXIETY_TRIGGERS.filter(t => t.toLowerCase().includes(newTrigger.toLowerCase()) && !pet.anxietyTriggers.includes(t)).map(t => (
              <button key={t} onClick={() => addTrigger(t)} className="w-full text-left px-3.5 py-2.5 rounded-[12px] text-[14px] font-medium text-[#111] active:scale-[0.98] transition-transform" style={{ background: '#F3EFEB' }}>
                {t}
              </button>
            ))}
          </div>
          {newTrigger && !COMMON_ANXIETY_TRIGGERS.includes(newTrigger) && (
            <Button variant="secondary" onClick={() => addTrigger(newTrigger)}>Add "{newTrigger}"</Button>
          )}
        </div>
      </CardModal>

      <CardModal isOpen={milestoneSheet} onClose={() => setMilestoneSheet(false)} title="Add Milestone">
        <div className="space-y-4 pt-1">
          <TextInput label="Title" placeholder="e.g., First trip to the vet" value={msTitle} onChange={e => setMsTitle(e.target.value)} />
          <TextInput label="Date" type="date" value={msDate} onChange={e => setMsDate(e.target.value)} />
          <TextInput label="Note (Optional)" placeholder="Add some details..." value={msNote} onChange={e => setMsNote(e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setMilestoneSheet(false)}>Cancel</Button>
            <Button variant="primary" onClick={saveMilestone} disabled={!msTitle || !msDate}>Save</Button>
          </div>
        </div>
      </CardModal>

      {/* HEALTH SHEETS */}
      <CardModal isOpen={healthSheet.type === 'VACCINATIONS_SECTION'} onClose={closeHealthSheet} title="Vaccinations"><div className="pt-2"><VaccinationsSection data={MOCK_HEALTH_DATA.vaccinations} onOpenSheet={openHealthSheet} /></div></CardModal>
      <CardModal isOpen={healthSheet.type === 'VET_VISITS_SECTION'} onClose={closeHealthSheet} title="Vet Visits"><div className="pt-2"><VetVisitsSection data={MOCK_HEALTH_DATA.vetVisits} onOpenSheet={openHealthSheet} /></div></CardModal>
      <CardModal isOpen={healthSheet.type === 'MEDICATIONS_SECTION'} onClose={closeHealthSheet} title="Medications"><div className="pt-2"><MedicationsSection data={meds} onMarkTaken={handleMarkTaken} onOpenSheet={openHealthSheet} /></div></CardModal>
      <CardModal isOpen={healthSheet.type === 'ALLERGIES_SECTION'} onClose={closeHealthSheet} title="Allergies"><div className="pt-2"><AllergiesSection data={MOCK_HEALTH_DATA.allergies} onOpenSheet={openHealthSheet} /></div></CardModal>
      <CardModal isOpen={healthSheet.type === 'WEIGHT_SECTION'} onClose={closeHealthSheet} title="Weight Tracker"><div className="pt-2"><WeightTrackerSection data={MOCK_HEALTH_DATA.weightHistory} idealRange={MOCK_HEALTH_DATA.idealWeightRange} currentWeight={pet.weight} weightUnit={pet.weightUnit} onOpenSheet={openHealthSheet} /></div></CardModal>
      <CardModal isOpen={healthSheet.type === 'VACCINE_DETAILS'} onClose={closeHealthSheet} title="Vaccination">
        {healthSheet.data && <div className="space-y-0 pt-1">
          <div className="flex justify-between py-2.5"><span className="text-[12px] text-[#A09A94]">Vaccine</span><span className="text-[13px] font-semibold text-[#111]">{healthSheet.data.name}</span></div>
          <div className="h-[1px] bg-[#EDE8E2]" />
          <div className="flex justify-between py-2.5"><span className="text-[12px] text-[#A09A94]">Given</span><span className="text-[13px] font-semibold text-[#111]">{healthSheet.data.lastDate}</span></div>
          <div className="h-[1px] bg-[#EDE8E2]" />
          <div className="flex justify-between py-2.5"><span className="text-[12px] text-[#A09A94]">Next Due</span><span className="text-[13px] font-semibold text-[#111]">{healthSheet.data.nextDate}</span></div>
          <div className="flex gap-2 pt-4"><Button variant="secondary" onClick={closeHealthSheet}>Close</Button><Button variant="primary" onClick={() => { showToast('Edit coming soon'); closeHealthSheet(); }}>Edit</Button></div>
        </div>}
      </CardModal>
      <CardModal isOpen={healthSheet.type === 'VET_DETAILS'} onClose={closeHealthSheet} title="Vet Visit">
        {healthSheet.data && <div className="pt-1">
          <h4 className="text-[15px] font-bold text-[#111]">{healthSheet.data.reason}</h4>
          <p className="text-[12px] text-[#A09A94] mt-1 mb-3">{healthSheet.data.date} · {healthSheet.data.vet}</p>
          <div className="rounded-[12px] p-3 space-y-2" style={{ background: '#F3EFEB' }}>
            <div><span className="text-[10px] font-bold text-[#A09A94] uppercase tracking-wide block mb-0.5">Notes</span><span className="text-[13px] text-[#111]">{healthSheet.data.notes}</span></div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div><span className="text-[10px] font-bold text-[#A09A94] uppercase tracking-wide block mb-0.5">Cost</span><span className="text-[13px] text-[#111]">{healthSheet.data.cost}</span></div>
          </div>
          <Button variant="secondary" onClick={closeHealthSheet} className="mt-4">Close</Button>
        </div>}
      </CardModal>
      <CardModal isOpen={healthSheet.type === 'MED_DETAILS'} onClose={closeHealthSheet} title="Medication">
        {healthSheet.data && <div className="space-y-0 pt-1">
          <div className="flex justify-between py-2.5"><span className="text-[12px] text-[#A09A94]">Name</span><span className="text-[13px] font-semibold text-[#111]">{healthSheet.data.name}</span></div>
          <div className="h-[1px] bg-[#EDE8E2]" />
          <div className="flex justify-between py-2.5"><span className="text-[12px] text-[#A09A94]">Purpose</span><span className="text-[13px] font-semibold text-[#111]">{healthSheet.data.purpose}</span></div>
          <div className="h-[1px] bg-[#EDE8E2]" />
          <div className="flex justify-between py-2.5"><span className="text-[12px] text-[#A09A94]">Dosage</span><span className="text-[13px] font-semibold text-[#111]">{healthSheet.data.dosage}</span></div>
          <div className="h-[1px] bg-[#EDE8E2]" />
          <div className="flex justify-between py-2.5"><span className="text-[12px] text-[#A09A94]">Frequency</span><span className="text-[13px] font-semibold text-[#111]">{healthSheet.data.frequency}</span></div>
          <Button variant="secondary" onClick={closeHealthSheet} className="mt-3">Close</Button>
        </div>}
      </CardModal>
      <CardModal isOpen={healthSheet.type === 'ALLERGY_DETAILS'} onClose={closeHealthSheet} title="Allergy">
        {healthSheet.data && <div className="space-y-4 pt-1">
          <TextInput label="Allergen" value={healthSheet.data.allergen} readOnly />
          <TextInput label="Reaction" value={healthSheet.data.reaction} readOnly />
          <Button variant="primary" onClick={() => { showToast('Saved'); closeHealthSheet(); }}>Done</Button>
        </div>}
      </CardModal>
      <CardModal isOpen={healthSheet.type === 'WEIGHT_DETAILS'} onClose={closeHealthSheet} title="Weight Entry">
        {healthSheet.data && <div className="space-y-4 pt-1">
          <TextInput label="Date" type="date" value={healthSheet.data.date} readOnly />
          <TextInput label={`Weight (${pet.weightUnit})`} type="number" value={healthSheet.data.weight} readOnly />
          <Button variant="primary" onClick={() => { showToast('Saved'); closeHealthSheet(); }}>Done</Button>
        </div>}
      </CardModal>
      <CardModal isOpen={['ADD_VACCINE','ADD_VET','ADD_MED','ADD_ALLERGY','ADD_WEIGHT'].includes(healthSheet.type)} onClose={closeHealthSheet} title="Add Entry">
        <div className="text-center py-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#F3EFEB' }}><AlertCircle size={22} className="text-[#A09A94]" /></div>
          <h3 className="text-[15px] font-semibold text-[#111]">Coming Soon</h3>
          <p className="text-[13px] text-[#A09A94] mt-1 px-2">This feature will be available in the next update.</p>
          <Button variant="primary" onClick={closeHealthSheet} className="mt-4">Got it</Button>
        </div>
      </CardModal>

      <AddDocumentSheet 
        isOpen={addDocSheetOpen} 
        onClose={() => setAddDocSheetOpen(false)} 
        onSave={(doc) => {
          onUpdate({ ...pet, documents: [doc, ...(pet.documents || [])] });
          showToast('Document uploaded successfully');
        }}
        showToast={showToast}
      />

      <ScanReceiptFlow 
        flowState={scanFlowState} 
        setFlowState={setScanFlowState}
        onSave={(record, isMedical) => {
          if (isMedical) {
             onUpdate({ ...pet, documents: [record, ...(pet.documents || [])] });
             showToast('Saved to Medical Records');
          } else {
             showToast('Saved. Vet Visit will appear when Health sync is enabled.');
          }
        }}
        showToast={showToast}
      />

      {viewingDoc && (
        <DocumentViewer 
          doc={viewingDoc} 
          onClose={() => setViewingDoc(null)} 
          showToast={showToast} 
          onDelete={(docId) => {
             onUpdate({ ...pet, documents: pet.documents.filter(d => d.id !== docId) });
             showToast('Document deleted successfully');
          }}
        />
      )}

      {/* SHARE TAB SHEETS — minimal warm */}
      <CardModal isOpen={shareActiveSheet === 'add'} onClose={closeShareSheet} title="Share">
        <div className="space-y-2 pt-1">
          <button onClick={() => openShareSheet('qr')} className="w-full flex items-center gap-3 py-3 active:opacity-60 transition-opacity text-left border-b border-[#EDE8E2]">
            <QrCode size={16} className="text-[#A09A94]" />
            <span className="text-[14px] font-semibold text-[#111]">QR Code</span>
          </button>
          <button onClick={() => openShareSheet('link')} className="w-full flex items-center gap-3 py-3 active:opacity-60 transition-opacity text-left border-b border-[#EDE8E2]">
            <LinkIcon size={16} className="text-[#A09A94]" />
            <span className="text-[14px] font-semibold text-[#111]">Share Link</span>
          </button>
          <button onClick={() => { showToast('Coming soon'); closeShareSheet(); }} className="w-full flex items-center gap-3 py-3 active:opacity-60 transition-opacity text-left">
            <Mail size={16} className="text-[#A09A94]" />
            <span className="text-[14px] font-semibold text-[#111]">Email Invite</span>
          </button>
        </div>
      </CardModal>

      <CardModal isOpen={shareActiveSheet === 'qr'} onClose={closeShareSheet} title="QR Code">
        <div className="pt-1">
          {!qrGenerated ? (
            <div className="space-y-4">
              <Select label="Expires in" options={EXPIRY_OPTIONS} value={shareConfig.expiry} onChange={e => setShareConfig({ ...shareConfig, expiry: e.target.value })} />
              <Button variant="primary" onClick={() => setQrGenerated(true)}>Generate</Button>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-[160px] h-[160px] mx-auto rounded-[16px] flex items-center justify-center mb-3" style={{ background: '#F3EFEB' }}>
                <QrCode size={120} color="#111" strokeWidth={1.5} />
              </div>
              <p className="text-[11px] text-[#A09A94] mb-4">Expires in {EXPIRY_OPTIONS.find(o => o.value === shareConfig.expiry)?.label}</p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => { showToast('Saved'); closeShareSheet(); }}>Save</Button>
                <Button variant="primary" onClick={() => { showToast('Sharing...'); closeShareSheet(); }}>Share</Button>
              </div>
            </div>
          )}
        </div>
      </CardModal>

      <CardModal isOpen={shareActiveSheet === 'link'} onClose={closeShareSheet} title="Share Link">
        <div className="space-y-4 pt-1">
          <Select label="Expires in" options={EXPIRY_OPTIONS} value={shareConfig.expiry} onChange={e => setShareConfig({ ...shareConfig, expiry: e.target.value })} />
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-[12px]" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}>
            <span className="text-[13px] font-medium text-[#111] flex-1 truncate font-mono">fylos.app/s/lx89q2m</span>
            <button onClick={() => handleCopyLink('fylos.app/s/lx89q2m')} className="p-1.5 rounded-full active:scale-[0.9]" style={{ background: '#EDE8E2' }}><Copy size={13} className="text-[#A09A94]" /></button>
          </div>
          <p className="text-[11px] text-[#A09A94]">Anyone with this link can view {pet.name}'s profile until it expires.</p>
          <Button variant="primary" onClick={() => { showToast('Sharing...'); closeShareSheet(); }}>Share Link</Button>
        </div>
      </CardModal>

      <CardModal isOpen={shareActiveSheet === 'details' && !!selectedShare} onClose={closeShareSheet} title="Access">
        {selectedShare && (
          <div className="pt-1">
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={selectedShare.avatar} initials={selectedShare.name.charAt(0)} size={40} />
              <div>
                <h3 className="text-[15px] font-bold text-[#111]">{selectedShare.name}</h3>
                <p className="text-[12px] text-[#A09A94]">{selectedShare.role} · Added {selectedShare.added}</p>
              </div>
            </div>
            <div className="space-y-0 mb-4">
              <div className="flex justify-between py-2.5 border-b border-[#EDE8E2]"><span className="text-[12px] text-[#A09A94]">Permission</span><span className="text-[13px] font-semibold text-[#111]">{selectedShare.permission}</span></div>
              <div className="flex justify-between py-2.5"><span className="text-[12px] text-[#A09A94]">Last accessed</span><span className="text-[13px] font-semibold text-[#111]">Today</span></div>
            </div>
            <div className="space-y-2">
              <Button variant="secondary" onClick={() => { openShareSheet('change', selectedShare); }}>Change permissions</Button>
              <Button variant="destructive" onClick={() => openShareSheet('revoke', selectedShare)}>Revoke access</Button>
            </div>
          </div>
        )}
      </CardModal>

      <CardModal isOpen={shareActiveSheet === 'miniMenu' && !!selectedShare} onClose={closeShareSheet}>
        <div className="space-y-1 pt-1">
          <button onClick={() => openShareSheet('details', selectedShare)} className="w-full py-3 text-[14px] font-semibold text-[#111] text-left active:opacity-60 border-b border-[#EDE8E2]">View details</button>
          <button onClick={() => { openShareSheet('change', selectedShare); }} className="w-full py-3 text-[14px] font-semibold text-[#111] text-left active:opacity-60 border-b border-[#EDE8E2]">Change permissions</button>
          <button onClick={() => openShareSheet('revoke', selectedShare)} className="w-full py-3 text-[14px] font-semibold text-[#E85D2A] text-left active:opacity-60">Revoke access</button>
        </div>
      </CardModal>

      <CardModal isOpen={shareActiveSheet === 'change' && !!selectedShare} onClose={closeShareSheet} title="Permissions">
        <div className="pt-1">
          <div className="flex items-center gap-3 mb-4">
            <Avatar src={selectedShare?.avatar} size={32} />
            <div>
              <span className="text-[14px] font-semibold text-[#111]">{selectedShare?.name}</span>
              <span className="text-[11px] text-[#A09A94] block">Current: {selectedShare?.permission}</span>
            </div>
          </div>
          <div className="mb-4">
            <RadioList options={PERMISSION_LEVELS} value={shareConfig.permission} onChange={(v) => setShareConfig({ ...shareConfig, permission: v })} />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => openShareSheet('details', selectedShare)}>Cancel</Button>
            <Button variant="primary" onClick={handleSavePermission}>Save</Button>
          </div>
        </div>
      </CardModal>

      <CardModal isOpen={shareActiveSheet === 'revoke' && !!selectedShare} onClose={closeShareSheet} title="Revoke access">
        <div className="text-center pt-2">
          <p className="text-[13px] text-[#A09A94] mb-4">{selectedShare?.name} will lose access to {pet.name}'s profile.</p>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => openShareSheet('details', selectedShare)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRevokeShare}>Revoke</Button>
          </div>
        </div>
      </CardModal>
    </div>
  );
};

// --- DASHBOARD HOME SCREEN ---
const useTimeBasedGreeting = () => { const h = new Date().getHours(); if (h < 12) return 'Good morning'; if (h < 18) return 'Good afternoon'; return 'Good evening'; };
const formatDateTime = (iso) => { const d = new Date(iso); return `${d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric' })} · ${d.toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:false })}`; };

const getDaysUntilDate = (dateValue) => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(dateValue);
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  return Math.ceil((target.getTime() - today.getTime()) / msPerDay);
};

const useHealthAlerts = (petId, enabled = true) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    if (!enabled) {
      setAlerts([]);
      return;
    }

    try {
      const nextAlerts = [];
      const now = Date.now();

      MOCK_HEALTH_DATA.vaccinations.forEach((vaccination) => {
        const daysUntilDue = getDaysUntilDate(vaccination.nextDate);
        if (daysUntilDue < 0) {
          nextAlerts.push({
            id: `health_vaccination_overdue_${vaccination.id}_${petId}`,
            priority: 'critical',
            type: 'vaccination',
            title: 'Vaccination Overdue',
            message: `${vaccination.name} expired ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) === 1 ? '' : 's'} ago`,
            actionLabel: 'Open Health Records',
            actionRoute: '/vault/health',
            petId
          });
        } else if (daysUntilDue <= 7) {
          nextAlerts.push({
            id: `health_vaccination_soon_${vaccination.id}_${petId}`,
            priority: 'high',
            type: 'vaccination',
            title: 'Vaccination Due Soon',
            message: `${vaccination.name} is due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`,
            actionLabel: 'Review Schedule',
            actionRoute: '/vault/health',
            petId
          });
        }
      });

      MOCK_HEALTH_DATA.medications
        .filter((medication) => medication.isActive)
        .forEach((medication) => {
          if (medication.nextDoseTime === 'Today') {
            nextAlerts.push({
              id: `health_medication_today_${medication.id}_${petId}`,
              priority: 'high',
              type: 'medication',
              title: 'Medication Due Today',
              message: `${medication.name} should be given today`,
              actionLabel: 'View Medication',
              actionRoute: '/vault/health',
              petId
            });
            return;
          }

          if (medication.nextDose) {
            const nextDoseDate = new Date(medication.nextDose).getTime();
            if (!Number.isNaN(nextDoseDate) && nextDoseDate < now) {
              nextAlerts.push({
                id: `health_medication_overdue_${medication.id}_${petId}`,
                priority: 'critical',
                type: 'medication',
                title: 'Medication Overdue',
                message: `${medication.name} dose is overdue`,
                actionLabel: 'Open Health Records',
                actionRoute: '/vault/health',
                petId
              });
            }
          }
        });

      const sortedAlerts = nextAlerts.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority === 'critical' ? -1 : 1;
        return a.title.localeCompare(b.title);
      });
      setAlerts(sortedAlerts);
    } catch (error) {
      console.error('Failed to fetch health alerts:', error);
      setAlerts([]);
    }
  }, [petId, enabled]);

  return alerts;
};

const useLaunchingFeature = () => {
  return UPCOMING_FEATURES
    .map((feature) => ({ ...feature, daysUntilLaunch: getDaysUntilDate(feature.launchDate) }))
    .filter((feature) => feature.daysUntilLaunch >= 0 && feature.daysUntilLaunch <= 14)
    .sort((a, b) => a.daysUntilLaunch - b.daysUntilLaunch)[0] || null;
};

const HealthAlertBanner = React.memo(({ alert, onDismiss, onAction }) => {
  if (!alert) return null;
  const isVaccinationAlert = alert.type === 'vaccination';
  const displayTitle = isVaccinationAlert ? 'Vaccine overdue' : alert.title;
  const displaySubtitle = isVaccinationAlert ? 'DHPP · 2 days late' : alert.message;
  const actionLabel = isVaccinationAlert ? 'Review' : alert.actionLabel;

  return (
    <Card
      variant="highlighted"
      className="!mb-4 !py-4 !pl-5 !pr-4"
      role="alert"
      aria-label={`${alert.priority} priority: ${displayTitle}`}
    >
      <div className="w-full flex flex-row items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <AlertTriangle size={18} className="shrink-0 text-[var(--color-accent)]" />
          <div className="flex flex-col min-w-0">
            <h3 className="text-[16px] font-semibold leading-tight text-[#111111]">{displayTitle}</h3>
            <p className="text-[14px] leading-snug mt-1 text-[#6E6E73]">{displaySubtitle}</p>
          </div>
        </div>
        <button
          onClick={onAction}
          className="inline-flex items-center ml-auto gap-1 shrink-0 text-[#E85D2A] text-[13px] font-semibold leading-none active:opacity-80 mr-[-6px]"
          aria-label={actionLabel}
          aria-description={`Opens ${alert.type} details`}
        >
          <span>{actionLabel}</span>
          {isVaccinationAlert && <ArrowRight size={13} />}
        </button>
      </div>
    </Card>
  );
});

const LaunchBanner = React.memo(({ feature, daysUntilLaunch, onDismiss, onJoinWaitlist }) => {
  if (!feature) return null;
  const FeatureIcon = feature.icon || Rocket;
  return (
    <div
      className="relative overflow-hidden rounded-[var(--radius-lg)] p-4 mb-4 text-white shadow-[var(--shadow-level-1)] bg-gradient-to-br from-[#111111] to-[#2A2A2A] flex flex-col justify-center"
      role="button"
      aria-label={`${feature.title} launching in ${daysUntilLaunch} days`}
    >
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at top right, var(--color-accent), transparent 50%)' }} />
      <span className="absolute left-4 top-4 bottom-4 w-[2px] rounded-full bg-[var(--color-accent)]/95" aria-hidden="true" />
      <div className="relative z-10 pl-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <FeatureIcon className="text-[var(--color-accent)] shrink-0" size={20} />
            <h3 className="text-[17px] font-bold tracking-tight leading-tight">Community Mode</h3>
          </div>
          <button
            onClick={onDismiss}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/35 active:opacity-70"
            aria-label="Dismiss launch banner"
          >
            <X size={15} />
          </button>
        </div>
        <div className="mt-1 ml-8 flex items-center justify-between gap-3">
          <p className="text-[13px] text-gray-300 leading-relaxed">Find your local pack.</p>
          <button
            onClick={onJoinWaitlist}
            className="inline-flex items-center gap-1 ml-auto text-[var(--color-accent)] text-[14px] font-medium leading-none active:opacity-80"
            aria-label="Join waitlist"
            aria-description="Opens waitlist signup form"
          >
            <span>Join waitlist</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});

const HomeScreen = ({ onNavigate, notifications = [], onOpenInbox, onOpenHealthRecords }) => {
  const [selectedPetId, setSelectedPetId] = useState(MOCK_DASHBOARD_PETS[0].id);
  const [medSheetOpen, setMedSheetOpen] = useState(false);
  const [quickLogModalOpen, setQuickLogModalOpen] = useState(false);
  const [quickLogStep, setQuickLogStep] = useState('picker');
  const [selectedQuickLogType, setSelectedQuickLogType] = useState(null);
  const [quickLogTime, setQuickLogTime] = useState('');
  const [quickLogCustomTitle, setQuickLogCustomTitle] = useState('');
  const [quickLogEntries, setQuickLogEntries] = useState([]);
  const [medName, setMedName] = useState('');
  const [completedReminders, setCompletedReminders] = useState(new Set());
  const [expandedHomeRows, setExpandedHomeRows] = useState(new Set());
  const [isFading, setIsFading] = useState(false);
  const [displayPetId, setDisplayPetId] = useState(MOCK_DASHBOARD_PETS[0].id);
  const [dismissedHealthAlerts, setDismissedHealthAlerts] = useState(new Set());
  const dismissTimeoutRef = useRef(null);
  const greeting = useTimeBasedGreeting();
  const calmGreeting = greeting.replace('Good morning', 'Morning').replace('Good afternoon', 'Afternoon').replace('Good evening', 'Evening');
  const selectedPet = MOCK_DASHBOARD_PETS.find(p => p.id === displayPetId) || MOCK_DASHBOARD_PETS[0];
  const healthAlerts = useHealthAlerts(displayPetId, true);
  const visibleHealthAlert = healthAlerts.find((alert) => !dismissedHealthAlerts.has(alert.id));
  const handlePetSelect = (id) => { if (id === selectedPetId) return; setSelectedPetId(id); setIsFading(true); setTimeout(() => { setDisplayPetId(id); requestAnimationFrame(() => requestAnimationFrame(() => setIsFading(false))); }, 300); };
  const handleCompleteReminder = (id) => {
    setCompletedReminders((prev) => {
      const next = new Set(prev);
      const wasCompleted = next.has(id);
      if (wasCompleted) next.delete(id);
      else {
        next.add(id);
        // Mascot reacts to task completion
        setMascotTapped(true);
        setMascotMessage('Nice one!');
        setTimeout(() => { setMascotTapped(false); setMascotMessage(null); }, 1500);
      }
      return next;
    });
  };
  const handleToggleHomeExpand = (id) => {
    setExpandedHomeRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const activityQuickOptions = [
    { id: 'walk', label: 'Walk', icon: PersonStanding },
    { id: 'medication', label: 'Medication', icon: Pill },
    { id: 'meal', label: 'Meal', icon: Coffee },
    { id: 'bathroom', label: 'Bathroom', icon: Droplets },
    { id: 'note', label: 'Note', icon: FileText },
    { id: 'manual', label: 'Manual', icon: Pencil }
  ];
  const quickLogMeta = {
    walk: { title: 'Walk', icon: '🦮' },
    medication: { title: 'Medication', icon: '💊' },
    meal: { title: 'Meal', icon: '☕' },
    bathroom: { title: 'Bathroom', icon: '💧' },
    note: { title: 'Note', icon: '🌟' },
    manual: { title: 'Manual', icon: '🌟' }
  };
  const openQuickLogModal = () => {
    setQuickLogStep('picker');
    setSelectedQuickLogType(null);
    setQuickLogTime('');
    setQuickLogCustomTitle('');
    setQuickLogModalOpen(true);
  };
  const handleQuickTypeSelect = (type) => {
    setSelectedQuickLogType(type);
    setQuickLogTime(new Date().toTimeString().slice(0, 5));
    setQuickLogCustomTitle('');
    setQuickLogStep('details');
  };
  const handleSaveQuickLog = () => {
    if (!selectedQuickLogType || !quickLogTime) return;
    const typeMeta = quickLogMeta[selectedQuickLogType] || { title: 'Activity', icon: '🌟' };
    const entryTitle = selectedQuickLogType === 'manual' ? quickLogCustomTitle.trim() : typeMeta.title;
    if (!entryTitle) return;
    const entryId = `quick_${selectedQuickLogType}_${Date.now()}`;
    const entryType = selectedQuickLogType === 'manual' ? 'custom' : selectedQuickLogType;
    const newEntry = {
      id: entryId,
      petId: displayPetId,
      title: entryTitle,
      subtitle: entryType === 'custom' ? 'Custom task' : '',
      time: quickLogTime,
      icon: typeMeta.icon,
      type: entryType,
      action: 'complete',
      isCustom: entryType === 'custom'
    };
    setQuickLogEntries((prev) => [newEntry, ...prev]);
    setQuickLogModalOpen(false);
    setQuickLogStep('picker');
    setSelectedQuickLogType(null);
    setQuickLogTime('');
    setQuickLogCustomTitle('');
  };
  const handleDismissHealthAlert = (alertId) => {
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
    dismissTimeoutRef.current = setTimeout(() => {
      setDismissedHealthAlerts((prev) => {
        const next = new Set(prev);
        next.add(alertId);
        return next;
      });
    }, 120);
  };
  const handleHealthAlertAction = () => {
    if (onOpenHealthRecords) {
      onOpenHealthRecords();
      return;
    }
    onNavigate('vault');
  };
  useEffect(() => () => {
    if (dismissTimeoutRef.current) clearTimeout(dismissTimeoutRef.current);
  }, []);
  useEffect(() => {
    if (!quickLogModalOpen) return;
    const bodyStyle = document.body.style;
    const htmlStyle = document.documentElement.style;
    const prevBodyOverflow = bodyStyle.overflow;
    const prevBodyPosition = bodyStyle.position;
    const prevBodyTop = bodyStyle.top;
    const prevBodyWidth = bodyStyle.width;
    const prevHtmlOverflow = htmlStyle.overflow;
    const scrollY = window.scrollY;

    bodyStyle.overflow = 'hidden';
    bodyStyle.position = 'fixed';
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = '100%';
    htmlStyle.overflow = 'hidden';

    return () => {
      bodyStyle.overflow = prevBodyOverflow;
      bodyStyle.position = prevBodyPosition;
      bodyStyle.top = prevBodyTop;
      bodyStyle.width = prevBodyWidth;
      htmlStyle.overflow = prevHtmlOverflow;
      window.scrollTo(0, scrollY);
    };
  }, [quickLogModalOpen]);

  const filteredBookings = MOCK_BOOKINGS.filter(b => b.petId === displayPetId);
  const normalizeTimelineTime = (label) => {
    if (!label) return label;
    return label
      .replace(/^Two days ago$/i, '2d ago')
      .replace(/^Three hours ago$/i, '3h ago')
      .replace(/^Four days ago$/i, '4d ago')
      .replace(/^(\d+)\s+days\s+ago$/i, '$1d ago')
      .replace(/^(\d+)\s+hours\s+ago$/i, '$1h ago');
  };
  const isTodayTimelineLabel = (label) => /^([01]\d|2[0-3]):([0-5]\d)$/.test((label || '').trim()) || /^Today$/i.test((label || '').trim());
  const getTimelineType = (row) => {
    if (row.type) return row.type;
    const lowerTitle = (row.title || '').toLowerCase();
    if (lowerTitle.includes('photo')) return 'photo';
    if (lowerTitle.includes('book')) return 'booking';
    if (lowerTitle.includes('med')) return 'medication';
    if (lowerTitle.includes('walk')) return 'walk';
    if (lowerTitle.includes('health') || lowerTitle.includes('vaccination') || lowerTitle.includes('reminder')) return 'health';
    return 'health';
  };
  const getTimelineIcon = (type) => {
    if (type === 'walk') return PawPrint;
    if (type === 'medication') return Pill;
    if (type === 'photo') return Camera;
    if (type === 'booking') return Calendar;
    if (type === 'hydration') return Droplets;
    if (type === 'custom') return List;
    return HeartPulse;
  };
  const filteredReminders = [...quickLogEntries, ...MOCK_REMINDERS]
    .filter((r) => r.petId === displayPetId)
    .map((r) => {
      const type = getTimelineType(r);
      const hasExpandableContent = Boolean(r.photoUrl || r.details || (r.subtitle && r.subtitle.length > 34));
      return {
        ...r,
        type,
        time: normalizeTimelineTime(r.time),
        subtitle: r.subtitle || '',
        action: r.action || (hasExpandableContent ? 'expand' : 'complete'),
        details: r.details || r.subtitle || '',
        isNew: Boolean(r.isNew)
      };
    })
    .filter((row) => isTodayTimelineLabel(row.time));
  const filteredSuggestions = MOCK_SUGGESTIONS.filter(s => s.petId === displayPetId);
  const getHomeBookingStatusMeta = (status) => {
    if (status === 'Confirmed') return { label: 'Confirmed', className: 'bg-[#EEF7F1] text-[#3F8D63] border-[#D7EBDD]' };
    return { label: 'Pending', className: 'bg-[#F7F4EF] text-[#B07A3A] border-[#ECDDC8]' };
  };
  const getHomeBookingIcon = (serviceLabel) => {
    const text = String(serviceLabel || '').toLowerCase();
    if (text.includes('walk')) return PawPrint;
    if (text.includes('sitt')) return Home;
    if (text.includes('groom')) return Scissors;
    return Calendar;
  };

  // Determine the "focus card" — the most important thing right now
  const nextReminder = filteredReminders.find(r => !completedReminders.has(r.id) && r.action === 'complete');
  const nextBooking = filteredBookings[0];
  const allTasksDone = filteredReminders.length > 0 && filteredReminders.every(r => completedReminders.has(r.id) || r.action !== 'complete');

  // Smart mascot — reactive to context
  const hour = new Date().getHours();
  const [mascotTapped, setMascotTapped] = useState(false);
  const [mascotMessage, setMascotMessage] = useState(null);

  const getMascotState = () => {
    if (mascotTapped) return { step: 3, msg: null }; // celebrating on tap
    if (allTasksDone) return { step: 3, msg: 'All done! Great job!' };
    if (visibleHealthAlert) return { step: 2, msg: 'Don\'t forget the vaccine!' }; // worried/thoughtful
    if (hour >= 22 || hour < 6) return { step: 2, msg: 'Time to rest...' };
    if (hour >= 18) return { step: 1, msg: 'How was your day?' };
    if (nextBooking) return { step: 1, msg: 'Walk coming up!' };
    return { step: 0, msg: null };
  };
  const mascotState = getMascotState();
  const mascotStep = mascotState.step;
  const timeLabel = hour >= 22 || hour < 6 ? 'Rest well' : hour >= 18 ? 'Wind down with' : hour >= 12 ? 'What\'s the plan for' : 'Good start with';

  const handleMascotTap = () => {
    setMascotTapped(true);
    setMascotMessage(mascotState.msg || 'Woof!');
    setTimeout(() => { setMascotTapped(false); setMascotMessage(null); }, 2000);
  };

  return (
    <ScreenContainer>
      <div className="px-5 flex flex-col" style={{ minHeight: 'calc(100% - 80px)' }}>

        {/* ═══ TOP: Greeting + Pet ═══ */}
        <div className="pt-2 pb-4" style={{ animation: 'homeReveal 0.4s 0.05s cubic-bezier(0.22,1,0.36,1) both' }}>
          <div className="flex items-center gap-3 mb-5">
            <img src={selectedPet.avatar} alt={selectedPet.name} className="w-[52px] h-[52px] rounded-[16px] object-cover shadow-sm" />
            <div className="flex-1 min-w-0">
              <h2 className="text-[22px] font-bold text-[#111] tracking-[-0.3px] leading-tight">{calmGreeting}, {MOCK_USER.name}.</h2>
              <p className="text-[13px] text-[#A09A94] mt-0.5">{selectedPet.name} · 18°C, great for walks</p>
            </div>
            <div className="shrink-0 relative" onClick={handleMascotTap} style={{ cursor: 'pointer' }}>
              {/* Speech bubble */}
              {mascotMessage && (
                <div className="absolute -bottom-7 right-0 z-10 whitespace-nowrap" style={{ animation: 'homeReveal 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
                  <div className="px-2.5 py-1 rounded-[10px] text-[10px] font-semibold text-[#6E6058]" style={{ background: '#F3EFEB', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    {mascotMessage}
                  </div>
                </div>
              )}
              <div style={{
                transform: `scale(0.5) ${mascotTapped ? 'translateY(-4px)' : ''}`,
                transformOrigin: 'center right',
                animation: 'homeMascotWave 3s ease-in-out infinite',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                <AddPetMascot step={mascotStep} petType={selectedPet.type?.toLowerCase() || 'dog'} petName={selectedPet.name} focusedField={null} scrollProgress={0} />
              </div>
            </div>
          </div>

          {/* Pet switcher — only if multiple pets */}
          {MOCK_DASHBOARD_PETS.length > 1 && (
            <div className="flex gap-2 mb-1">
              {MOCK_DASHBOARD_PETS.map((pet) => { const isSelected = selectedPetId === pet.id; return (
                <button
                  key={pet.id}
                  onClick={() => handlePetSelect(pet.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200 active:scale-[0.97] ${isSelected ? 'bg-[#111] text-white' : 'bg-[#F3EFEB] text-[#A09A94]'}`}
                >
                  <img src={pet.avatar} alt={pet.name} className="w-5 h-5 rounded-full object-cover" />
                  <span className="text-[12px] font-semibold">{pet.name}</span>
                </button>
              ); })}
            </div>
          )}
        </div>

        {/* ═══ THE FOCUS CARD ═══ */}
        <div className={`flex-1 flex flex-col gap-4 transition-all duration-[350ms] ${isFading ? 'opacity-0 scale-[0.98] translate-y-2' : 'opacity-100 scale-100 translate-y-0'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}>

          {/* Priority alert if exists */}
          {visibleHealthAlert && (
            <div className="rounded-[20px] p-5 active:scale-[0.98] transition-transform cursor-pointer" style={{ background: '#FFF5F0', border: '1px solid #FFE0D0', animation: 'homeReveal 0.4s 0.1s cubic-bezier(0.22,1,0.36,1) both' }} onClick={handleHealthAlertAction}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFE0D0] flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-[#E85D2A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-bold text-[#111]">Vaccine overdue</h3>
                  <p className="text-[13px] text-[#A09A94] mt-1">DHPP · 2 days late</p>
                </div>
                <span className="text-[13px] font-semibold text-[#E85D2A] flex items-center gap-1 shrink-0 mt-1">Review <ArrowRight size={13} /></span>
              </div>
            </div>
          )}

          {/* Next up card — the ONE thing to focus on */}
          {nextBooking && (
            <div className="rounded-[20px] p-5 active:scale-[0.98] transition-transform cursor-pointer" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2', animation: 'homeReveal 0.4s 0.15s cubic-bezier(0.22,1,0.36,1) both' }}>
              <div className="text-[10px] font-bold text-[#B5AFA8] uppercase tracking-[0.08em] mb-3">Next up</div>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[#EDE8E2] shrink-0">
                  <PawPrint size={18} className="text-[#8E8580]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-bold text-[#111] leading-tight">{nextBooking.service}</h3>
                  <p className="text-[13px] text-[#A09A94] mt-0.5">{nextBooking.walkerName} · {formatDateTime(nextBooking.date)}</p>
                </div>
                <div className={`h-[22px] px-2.5 rounded-full text-[10px] font-semibold border inline-flex items-center ${getHomeBookingStatusMeta(nextBooking.status).className}`}>
                  {nextBooking.status}
                </div>
              </div>
            </div>
          )}

          {/* Today's tasks — compact */}
          {nextReminder && (
            <div className="rounded-[20px] p-5" style={{ background: '#F7F5F2', border: '1px solid #EDE8E2', animation: 'homeReveal 0.4s 0.2s cubic-bezier(0.22,1,0.36,1) both' }}>
              <div className="text-[10px] font-bold text-[#B5AFA8] uppercase tracking-[0.08em] mb-3">Today · {filteredReminders.filter(r => !completedReminders.has(r.id)).length} remaining</div>
              <div className="space-y-2">
                {filteredReminders.slice(0, 3).map((r) => {
                  const Icon = getTimelineIcon(r.type);
                  const isDone = completedReminders.has(r.id);
                  const canSwipe = r.action === 'complete' && !isDone;
                  return (
                    <div key={r.id} className="relative overflow-hidden rounded-[12px]">
                      {/* Swipe reveal background */}
                      {canSwipe && (
                        <div className="absolute inset-0 bg-[#E85D2A] flex items-center pl-4 rounded-[12px]">
                          <Check size={16} className="text-white" strokeWidth={2.5} />
                          <span className="text-white text-[12px] font-semibold ml-1.5">Done</span>
                        </div>
                      )}
                      <div
                        className={`relative flex items-center gap-3 py-2.5 px-1 bg-[#F7F5F2] transition-all duration-200 ${isDone ? 'opacity-40' : ''}`}
                        style={{ touchAction: canSwipe ? 'pan-y' : 'auto' }}
                        onTouchStart={canSwipe ? (e) => {
                          const startX = e.touches[0].clientX;
                          const el = e.currentTarget;
                          el._startX = startX;
                          el._moved = false;
                        } : undefined}
                        onTouchMove={canSwipe ? (e) => {
                          const el = e.currentTarget;
                          const dx = e.touches[0].clientX - (el._startX || 0);
                          if (dx > 0 && dx < 120) {
                            el.style.transform = `translateX(${dx}px)`;
                            el.style.transition = 'none';
                            el._moved = true;
                          }
                        } : undefined}
                        onTouchEnd={canSwipe ? (e) => {
                          const el = e.currentTarget;
                          const dx = parseInt(el.style.transform?.replace(/[^0-9-]/g, '') || '0');
                          if (dx > 70) {
                            el.style.transition = 'transform 0.3s cubic-bezier(0.22,1,0.36,1)';
                            el.style.transform = 'translateX(100%)';
                            setTimeout(() => handleCompleteReminder(r.id), 250);
                          } else {
                            el.style.transition = 'transform 0.3s cubic-bezier(0.22,1,0.36,1)';
                            el.style.transform = 'translateX(0)';
                          }
                        } : undefined}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isDone ? 'bg-[#EDEAE6]' : 'bg-[#EDE8E2]'}`}>
                          <Icon size={14} className={isDone ? 'text-[#C4BBB3]' : 'text-[#8E8580]'} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[14px] font-semibold ${isDone ? 'text-[#A09A94] line-through' : 'text-[#111]'}`}>{r.title}</span>
                          <span className="text-[12px] text-[#A09A94] ml-2">{r.time}</span>
                        </div>
                        {r.action === 'complete' && (
                          <button
                            onClick={() => handleCompleteReminder(r.id)}
                            className={`w-[24px] h-[24px] rounded-full border-2 inline-flex items-center justify-center transition-all duration-200 ${isDone ? 'bg-[#E85D2A] border-[#E85D2A] scale-110' : 'border-[#D4CCC4] active:scale-90'}`}
                          >
                            {isDone && <Check size={13} className="text-white" strokeWidth={3} />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {filteredReminders.length > 3 && (
                <button onClick={openQuickLogModal} className="mt-3 text-[12px] font-semibold text-[#E85D2A] active:opacity-70">See all tasks <ArrowRight size={11} className="inline ml-0.5" /></button>
              )}
            </div>
          )}

          {/* Streak + Quick actions inline */}
          <div className="flex items-center gap-3 pt-1" style={{ animation: 'homeReveal 0.4s 0.25s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full" style={{ background: '#FFF5F0' }}>
              <Activity size={13} className="text-[#E85D2A]" />
              <span className="text-[11px] font-bold text-[#E85D2A]">45-day streak</span>
            </div>
            <div className="flex-1" />
            <button onClick={() => onNavigate('services')} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-[0.92] transition-transform" style={{ background: '#F3EFEB' }}>
              <PawPrint size={16} className="text-[#E85D2A]" />
            </button>
            <button onClick={() => { window.location.href = '/photo-gallery'; }} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-[0.92] transition-transform" style={{ background: '#F3EFEB' }}>
              <Camera size={16} className="text-[#A09A94]" />
            </button>
            <button onClick={() => setMedSheetOpen(true)} className="w-9 h-9 rounded-full flex items-center justify-center active:scale-[0.92] transition-transform" style={{ background: '#F3EFEB' }}>
              <Pill size={16} className="text-[#A09A94]" />
            </button>
          </div>

          {/* ═══ DISCOVERY: Scroll reveals more ═══ */}
          <div className="h-[1px] bg-[#EDE8E2] my-1" />

          {/* Services row */}
          <div style={{ animation: 'homeReveal 0.4s 0.3s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[15px] font-semibold text-[#111]">Services</h3>
              <button onClick={() => onNavigate('services')} className="text-[12px] font-medium text-[#E85D2A] active:opacity-70">Browse all</button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Walking', icon: PawPrint, color: '#E85D2A' },
                { label: 'Sitting', icon: Home, color: '#A09A94' },
                { label: 'Grooming', icon: Scissors, color: '#A09A94' },
                { label: 'Vet', icon: Stethoscope, color: '#A09A94' },
              ].map((svc, i) => (
                <button key={i} onClick={() => onNavigate('services')} className="flex flex-col items-center gap-1.5 py-2.5 rounded-[14px] active:scale-[0.96] transition-transform" style={{ background: '#F3EFEB' }}>
                  <svc.icon size={18} className={`text-[${svc.color}]`} style={{ color: svc.color }} />
                  <span className="text-[11px] font-semibold text-[#6E6058]">{svc.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Suggested */}
          {filteredSuggestions.length > 0 && (
            <div style={{ animation: 'homeReveal 0.4s 0.35s cubic-bezier(0.22,1,0.36,1) both' }}>
              {filteredSuggestions.slice(0, 1).map(s => (
                <div key={s.id} className="rounded-[16px] p-4 flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer" style={{ background: '#F3EFEB' }}>
                  <div className="w-10 h-10 rounded-[12px] bg-[#EDE8E2] flex items-center justify-center shrink-0">{renderLegacyIcon(s.icon, 18, 'text-[#8E8580]')}</div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[14px] font-semibold text-[#111] truncate block">{s.title}</span>
                    <span className="text-[12px] text-[#A09A94] truncate block">{s.context}</span>
                  </div>
                  <button onClick={() => onNavigate('services')} className="text-[12px] font-semibold text-[#E85D2A] flex items-center gap-1 shrink-0">Book <ArrowRight size={12} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Nearby Friends — compact */}
          <div style={{ animation: 'homeReveal 0.4s 0.4s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[15px] font-semibold text-[#111]">Nearby</h3>
              <button className="text-[12px] font-medium text-[#E85D2A] active:opacity-70">See all</button>
            </div>
            <div className="flex gap-3 overflow-x-auto -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
              {[
                { name: 'Milo', distance: '200m', avatar: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=100&h=100&fit=crop' },
                { name: 'Luna', distance: '350m', avatar: 'https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=100&h=100&fit=crop' },
                { name: 'Max', distance: '500m', avatar: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=100&h=100&fit=crop' },
              ].map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-1 min-w-[60px]">
                  <div className="relative">
                    <img src={f.avatar} alt={f.name} className="w-[44px] h-[44px] rounded-full object-cover border-2 border-white shadow-sm" />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-[#34C759] border-[1.5px] border-white" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#111]">{f.name}</span>
                  <span className="text-[10px] text-[#A09A94]">{f.distance}</span>
                </div>
              ))}
              <div className="flex flex-col items-center justify-center gap-1 min-w-[60px]">
                <div className="w-[44px] h-[44px] rounded-full border-[1.5px] border-dashed border-[#DDD8D2] flex items-center justify-center">
                  <Plus size={15} className="text-[#C4B5A6]" />
                </div>
                <span className="text-[10px] font-medium text-[#C4B5A6]">More</span>
              </div>
            </div>
          </div>

          <div className="h-6" />
        </div>
      </div>
      {quickLogModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6" role="dialog" aria-modal="true">
          <button className="absolute inset-0 bg-black/20" onClick={() => setQuickLogModalOpen(false)} aria-label="Close quick log modal" />
          <div className="relative z-10 w-full max-w-[320px] max-h-[80vh] overflow-y-auto rounded-[20px] bg-white border border-black/[0.04] shadow-[0_12px_40px_rgba(0,0,0,0.14)] p-4">
            {quickLogStep === 'picker' ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[17px] font-semibold text-[#111111]">Add activity</h3>
                  <button onClick={() => setQuickLogModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#A1A1A6] active:opacity-70" aria-label="Close"><X size={15} /></button>
                </div>
                <p className="text-[13px] text-[#8E8E93] mb-3">Quick log</p>
                <div className="grid grid-cols-3 gap-2">
                  {activityQuickOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleQuickTypeSelect(option.id)}
                        className="h-[62px] px-2 rounded-[12px] border border-black/[0.05] bg-white flex flex-col items-center justify-center gap-1 text-center active:opacity-70"
                      >
                        <Icon size={15} className="text-[#8E8E93] shrink-0" />
                        <span className="text-[12px] font-medium text-[#111111] leading-none">{option.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <button onClick={() => setQuickLogStep('picker')} className="w-8 h-8 rounded-full flex items-center justify-center text-[#8E8E93] active:opacity-70" aria-label="Back"><ArrowLeft size={15} /></button>
                  <h3 className="text-[17px] font-semibold text-[#111111]">Add activity</h3>
                  <button onClick={() => setQuickLogModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-[#A1A1A6] active:opacity-70" aria-label="Close"><X size={15} /></button>
                </div>
                <p className="text-[13px] text-[#8E8E93] mb-3">Quick log</p>
                <div className="space-y-3">
                  {selectedQuickLogType === 'manual' && (
                    <TextInput
                      label="Activity title"
                      placeholder="e.g. Training session"
                      value={quickLogCustomTitle}
                      onChange={(e) => setQuickLogCustomTitle(e.target.value)}
                    />
                  )}
                  <TextInput
                    label="Time"
                    type="time"
                    value={quickLogTime}
                    onChange={(e) => setQuickLogTime(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button variant="secondary" size="small" onClick={() => setQuickLogStep('picker')}>Cancel</Button>
                    <Button variant="primary" size="small" onClick={handleSaveQuickLog} disabled={!quickLogTime || (selectedQuickLogType === 'manual' && !quickLogCustomTitle.trim())}>Save</Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <CardModal isOpen={medSheetOpen} onClose={() => setMedSheetOpen(false)} title="Quick med log"><div className="space-y-6 pt-2"><TextInput label="Medication Name" placeholder="e.g. Heartworm chew" value={medName} onChange={(e) => setMedName(e.target.value)} /><div className="flex gap-3 pt-2"><Button variant="secondary" onClick={() => setMedSheetOpen(false)}>Cancel</Button><Button variant="primary" onClick={() => { alert("Saved (mock)"); setMedSheetOpen(false); setMedName(''); }} disabled={!medName.trim()}>Save</Button></div></div></CardModal>
      <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}} />
    </ScreenContainer>
  );
};
const ServicesSectionHeader = ({ title, actionLabel, onAction }) => (
  <div className="flex items-center justify-between">
    <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-[0.05em] ml-1">{title}</h3>
    {actionLabel ? (
      <button onClick={onAction} className="text-[13px] font-semibold text-[#8E8E93] flex items-center gap-1 active:opacity-70 transition-opacity">
        {actionLabel}
      </button>
    ) : null}
  </div>
);

const ServicesScreen = ({ onNavigate }) => {
  const [activeCategoryId, setActiveCategoryId] = useState('walking');
  const [moreCategoriesExpanded, setMoreCategoriesExpanded] = useState(false);
  const vetCategory = MOCK_CATEGORIES.find((cat) => cat.id === 'vet');
  const orderedCategoryTiles = [
    ...MOCK_CATEGORIES.filter((cat) => cat.id === 'walking' || cat.id === 'sitting'),
    ...(vetCategory ? [vetCategory] : []),
    ...MOCK_CATEGORIES.filter((cat) => cat.id === 'grooming' || cat.id === 'boarding')
  ];
  const getBookingStatusMeta = (status) => {
    if (status === 'confirmed') {
      return {
        label: 'Confirmed',
        className: 'bg-[#EEF7F1] text-[#3F8D63] border-[#D7EBDD]'
      };
    }
    return {
      label: 'Pending',
      className: 'bg-[#F7F4EF] text-[#B07A3A] border-[#ECDDC8]'
    };
  };
  const getAvailabilityMeta = (availability) => {
    if (availability?.state === 'available') return { dotClass: 'bg-[#00C060]', textClass: 'text-[#6E6E73]' };
    if (availability?.state === 'soon') return { dotClass: 'bg-[#FFB020]', textClass: 'text-[#6E6E73]' };
    return { dotClass: 'bg-[#FF5A5A]', textClass: 'text-[#8E8E93]' };
  };
  const getCornerBadgeMeta = (badge) => {
    if (badge === 'Top Provider') return { className: 'bg-[#FFF6E8] text-[#B0792E] border-[#F3D7A1]' };
    if (badge === 'Owner Favorite') return { className: 'bg-[#EDF9F1] text-[#4D8A62] border-[#CFEAD7]' };
    if (badge === 'Trusted') return { className: 'bg-[#EEF2F6] text-[#5F7387] border-[#D8E1EA]' };
    return { className: 'bg-[#F3F3F5] text-[#7A7A80] border-black/[0.06]' };
  };
  const formatProviderDisplayName = (fullName) => {
    const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
    if (parts.length < 2) return fullName;
    const firstName = parts[0];
    const lastInitial = parts[1].replace('.', '').charAt(0).toUpperCase();
    return `${firstName} ${lastInitial}.`;
  };
  const getServiceIcon = (type) => {
    if (type === 'walking') return PawPrint;
    if (type === 'sitting') return Home;
    if (type === 'grooming') return Scissors;
    return Calendar;
  };
  const formatBookingDayTime = (rawDate) => {
    const [day, time] = String(rawDate).split(',').map((part) => part.trim());
    return { day: day || '', time: time || '' };
  };

  return (
    <ScreenContainer>
      <div className="px-5 pb-8 pt-2">

        {/* Search bar */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[14px] mb-4 cursor-pointer active:scale-[0.99] transition-transform" style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }} onClick={() => onNavigate && onNavigate('services/walking')}>
          <Search size={15} className="text-[#A09A94]" />
          <span className="text-[13px] text-[#A09A94]">Find walkers, sitters, vets...</span>
        </div>

        {/* Categories — horizontal scroll with icons */}
        <div className="flex gap-2 overflow-x-auto mb-5 -mx-5 px-5" style={{ scrollbarWidth: 'none' }}>
          {[...orderedCategoryTiles, ...MOCK_MORE_SERVICE_CATEGORIES].map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategoryId === cat.id;
            const isComingSoon = !cat.active;
            return (
              <button
                key={cat.id}
                onClick={() => { if (!isComingSoon) setActiveCategoryId(cat.id); }}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-[12px] text-[12px] font-semibold transition-all active:scale-[0.96] ${
                  isActive ? 'bg-[#111] text-white' :
                  isComingSoon ? 'opacity-40' : ''
                }`}
                style={!isActive ? { background: '#F3EFEB', border: '1px solid #EDE8E2', color: '#6E6058' } : {}}
              >
                <Icon size={14} strokeWidth={1.8} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Upcoming — compact if exists */}
        {MOCK_UPCOMING_BOOKINGS.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[15px] font-semibold text-[#111]">Upcoming</h3>
              <button onClick={() => onNavigate('services/bookings')} className="text-[12px] font-medium text-[#E85D2A] active:opacity-70">All bookings</button>
            </div>
            <div className="space-y-2">
              {MOCK_UPCOMING_BOOKINGS.slice(0, 2).map((booking, i) => {
                const statusMeta = getBookingStatusMeta(booking.status);
                return (
                <div key={booking.id} className={`flex items-center gap-3 py-3 cursor-pointer active:opacity-60 ${i < 1 ? 'border-b border-[#EDE8E2]' : ''}`} onClick={() => onNavigate && onNavigate('booking_details')}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-semibold text-[#111] truncate">{booking.providerLabel || booking.provider}</span>
                      <Star size={9} className="fill-[#E85D2A] text-[#E85D2A] shrink-0" />
                      <span className="text-[11px] text-[#A09A94]">{booking.providerRating || '4.9'}</span>
                    </div>
                    <span className="text-[11px] text-[#A09A94]">{booking.serviceSummary || booking.title} · {booking.scheduleLabel || booking.date}</span>
                  </div>
                  <span className={`h-[17px] px-2 rounded-full text-[9px] font-semibold border inline-flex items-center shrink-0 ${statusMeta.className}`}>{statusMeta.label}</span>
                </div>
              )})}
            </div>
          </div>
        )}

        {/* Providers — list */}
        <div>
          <h3 className="text-[15px] font-semibold text-[#111] mb-3">Near you</h3>
          <div>
            {MOCK_PROVIDERS.map((provider, i) => (
              <div key={provider.id} className={`flex items-center gap-3 py-3 cursor-pointer active:opacity-60 ${i < MOCK_PROVIDERS.length - 1 ? 'border-b border-[#EDE8E2]' : ''}`} onClick={() => provider.id === 'provider_001' && onNavigate && onNavigate('provider_profile')}>
                <img src={provider.avatar} alt={provider.name} className="w-[48px] h-[48px] rounded-[14px] object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-semibold text-[#111]">{formatProviderDisplayName(provider.name)}</span>
                    <Star size={9} className="fill-[#E85D2A] text-[#E85D2A]" />
                    <span className="text-[11px] font-medium text-[#111]">{provider.rating}</span>
                  </div>
                  <span className="text-[11px] text-[#A09A94] block mt-0.5">{provider.type}</span>
                </div>
                <span className="text-[13px] font-bold text-[#111] shrink-0">{provider.priceValue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </ScreenContainer>
  );
};

const BookingScreen = ({ provider, preselectedServiceId, onBack, onClose, onContinue }) => {
  const [selectedServiceId, setSelectedServiceId] = useState(
    preselectedServiceId || mockBookingData.provider.services.find(s => s.popular)?.id
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const showPetSelection = mockBookingData.userPets.length > 1;
  const [selectedPetId, setSelectedPetId] = useState(
    mockBookingData.userPets.length === 1 ? mockBookingData.userPets[0].id : null
  );
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [instructions, setInstructions] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [errors, setErrors] = useState({ service: false, date: false, pet: false });
  const [showValidation, setShowValidation] = useState(false);
  const [tempDate, setTempDate] = useState(null);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const selectedService = mockBookingData.provider.services.find(s => s.id === selectedServiceId);
  const availableSlots = selectedDate ? (mockBookingData.availability[selectedDate]?.slots || []) : [];
  const isValid = selectedServiceId && selectedDate && selectedTime && (mockBookingData.userPets.length === 1 || selectedPetId);

  const handleContinue = () => {
    if (!isValid) {
      setShowValidation(true);
      setErrors({ service: !selectedServiceId, date: !selectedDate || !selectedTime, pet: showPetSelection && !selectedPetId });
      return;
    }
    setShowValidation(false);
    setErrors({ service: false, date: false, pet: false });
    onContinue();
  };

  const openCalendar = () => { setTempDate(selectedDate); setIsCalendarOpen(true); };

  const confirmDate = () => {
    if (tempDate !== selectedDate) setSelectedTime(null);
    setSelectedDate(tempDate);
    setIsCalendarOpen(false);
    if (errors.date) setErrors(prev => ({ ...prev, date: false }));
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return 'Select Date';
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="absolute inset-0 bg-[#F7F5F2] z-[70] overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-[#F7F5F2] pt-14 pb-3 px-5 z-40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#EDE8E2] bg-[#F3EFEB] active:scale-[0.96] transition-transform">
            <ChevronLeft size={20} color="#111" />
          </button>
          <span className="text-[17px] font-bold text-[#111] flex-1">Book</span>
          <button onClick={() => setShowCloseDialog(true)} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#EDE8E2] bg-[#F3EFEB] active:scale-[0.96] transition-transform">
            <X size={18} color="#111" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-[160px] bg-[#F7F5F2]">
        {showValidation && !isValid && (
          <div className="mb-4 text-center">
            <span className="text-[13px] font-medium text-[#FF3B30]">Please complete all required fields</span>
          </div>
        )}

        {/* Service Selection */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[15px] font-semibold text-[#111]">Service</h3>
            {errors.service && <span className="text-[12px] text-[#FF3B30] font-medium">Required</span>}
          </div>
          {mockBookingData.provider.services.map((svc, idx) => {
            const isSelected = selectedServiceId === svc.id;
            return (
              <div key={svc.id}>
                <div
                  onClick={() => { setSelectedServiceId(svc.id); setSelectedTime(null); if(errors.service) setErrors(prev => ({...prev, service: false})); }}
                  className="flex items-center justify-between py-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${isSelected ? 'border-[#E85D2A]' : 'border-[#CFCFD4]'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-[#E85D2A] rounded-full" />}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`text-[14px] ${isSelected ? 'font-semibold' : 'font-medium'} text-[#111]`}>{svc.label}</span>
                        {svc.popular && <span className="text-[9px] font-bold text-[#E85D2A] uppercase tracking-wider">Popular</span>}
                      </div>
                      <span className="text-[12px] text-[#A09A94]">{svc.duration} min</span>
                    </div>
                  </div>
                  <span className="text-[14px] font-semibold text-[#111]">CHF {svc.price}</span>
                </div>
                {idx < mockBookingData.provider.services.length - 1 && <div className="h-[1px] bg-[#EDE8E2]" />}
              </div>
            );
          })}
        </section>

        {/* Date */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[15px] font-semibold text-[#111]">Date</h3>
            {errors.date && <span className="text-[12px] text-[#FF3B30] font-medium">Required</span>}
          </div>
          <button onClick={openCalendar} className={`w-full flex justify-between items-center py-3 px-4 rounded-[12px] bg-[#F3EFEB] border transition-colors ${errors.date ? 'border-[#FF3B30]/30' : 'border-[#EDE8E2]'}`}>
            <div className="flex items-center gap-2.5">
              <CalendarDays size={16} color="#A09A94" />
              <span className={`text-[14px] font-medium ${selectedDate ? 'text-[#111]' : 'text-[#A09A94]'}`}>
                {formatDateLabel(selectedDate)}
              </span>
            </div>
            <ChevronRight size={16} className="text-[#A09A94]" />
          </button>
        </section>

        {/* Time Slots */}
        {selectedDate && (
          <section className="mb-6">
            <h3 className="text-[15px] font-semibold text-[#111] mb-3">Time</h3>
            {availableSlots.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {availableSlots.map((slot, idx) => {
                  const isSlotSelected = selectedTime === slot.time;
                  return (
                    <button
                      key={idx}
                      disabled={!slot.available}
                      onClick={() => { setSelectedTime(slot.time); if(errors.date) setErrors(prev => ({...prev, date: false})); }}
                      className={`px-4 py-2 rounded-full text-[13px] font-medium whitespace-nowrap transition-all ${!slot.available ? 'text-[#CFCFD4] cursor-not-allowed' : isSlotSelected ? 'bg-[#E85D2A] text-white' : 'bg-[#F3EFEB] border border-[#EDE8E2] text-[#111]'}`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-[13px] text-[#A09A94]">No slots available for this date.</p>
            )}
            {selectedTime && selectedService && (
              <p className="mt-2 text-[12px] text-[#A09A94]">
                <Clock size={12} className="inline mr-1 -mt-0.5" />
                {formatTimeRange(selectedTime, selectedService.duration)}
              </p>
            )}
          </section>
        )}

        {/* Pet Selection */}
        {showPetSelection && (
          <section className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[15px] font-semibold text-[#111]">Pet</h3>
              {errors.pet && <span className="text-[12px] text-[#FF3B30] font-medium">Required</span>}
            </div>
            <div className="flex gap-2">
              {mockBookingData.userPets.map((pet) => {
                const isPetSelected = selectedPetId === pet.id;
                return (
                  <button
                    key={pet.id}
                    onClick={() => { setSelectedPetId(pet.id); if(errors.pet) setErrors(prev => ({...prev, pet: false})); }}
                    className={`px-4 py-2 rounded-full text-[13px] font-medium transition-all ${isPetSelected ? 'bg-[#E85D2A] text-white' : 'bg-[#F3EFEB] border border-[#EDE8E2] text-[#111]'}`}
                  >
                    {pet.name}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Extras */}
        <section className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#111] mb-3">Extras</h3>
          {mockBookingData.provider.addOns.map((addon, idx) => {
            const isAddonSelected = selectedAddOns.includes(addon.id);
            return (
              <div key={addon.id}>
                <div
                  onClick={() => {
                    if (isAddonSelected) setSelectedAddOns(prev => prev.filter(id => id !== addon.id));
                    else setSelectedAddOns(prev => [...prev, addon.id]);
                  }}
                  className="flex items-center justify-between py-3 cursor-pointer"
                >
                  <div className="flex-1">
                    <span className="text-[14px] font-medium text-[#111]">{addon.label}</span>
                    <span className="text-[12px] text-[#A09A94] block mt-0.5">{addon.description}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] font-medium text-[#A09A94]">+CHF {addon.price}</span>
                    <div className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex shrink-0 items-center justify-center transition-colors ${isAddonSelected ? 'bg-[#E85D2A] border-[#E85D2A]' : 'border-[#CFCFD4]'}`}>
                      {isAddonSelected && <Check size={12} color="#FFF" strokeWidth={3} />}
                    </div>
                  </div>
                </div>
                {idx < mockBookingData.provider.addOns.length - 1 && <div className="h-[1px] bg-[#EDE8E2]" />}
              </div>
            );
          })}
        </section>

        {/* Instructions */}
        <section className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#111] mb-3">Instructions</h3>
          <div className="relative">
            <textarea
              className="w-full bg-[#F3EFEB] rounded-[12px] p-3.5 text-[14px] text-[#111] placeholder:text-[#A09A94] border border-[#EDE8E2] focus:border-[#E85D2A]/40 outline-none resize-none transition-colors pb-7"
              rows={3}
              maxLength={500}
              placeholder="e.g. Please lock the bottom gate..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
            <span className="absolute bottom-2.5 right-3.5 text-[10px] text-[#A09A94]">{instructions.length}/500</span>
          </div>
        </section>

        {/* Price Summary */}
        <section className="mb-4">
          <div className="h-[1px] bg-[#EDE8E2] mb-4" />
          <div className="flex justify-between text-[14px] mb-2">
            <span className="text-[#A09A94]">{selectedService?.label || 'Service'}</span>
            <span className="font-semibold text-[#111]">CHF {selectedService?.price || 0}</span>
          </div>
          {selectedAddOns.map(id => {
            const addon = mockBookingData.provider.addOns.find(a => a.id === id);
            return addon ? (
              <div key={id} className="flex justify-between text-[14px] mb-2">
                <span className="text-[#A09A94]">{addon.label}</span>
                <span className="font-semibold text-[#111]">+CHF {addon.price}</span>
              </div>
            ) : null;
          })}
          <div className="h-[1px] bg-[#EDE8E2] my-3" />
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-semibold text-[#111]">Total</span>
            <span className="text-[17px] font-bold text-[#111]">CHF {calculateBookingTotal(selectedServiceId, selectedAddOns)}</span>
          </div>
        </section>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-gradient-to-t from-[#F7F5F2] via-[#F7F5F2] to-transparent z-40">
        <button
          className={`w-full py-3.5 rounded-[12px] text-[15px] font-semibold transition-all ${!isValid ? 'bg-[#EDE8E2] text-[#A09A94]' : 'bg-[#E85D2A] text-white active:scale-[0.98]'}`}
          onClick={handleContinue}
        >
          Continue
        </button>
      </div>

      {/* Calendar Modal */}
      <CardModal isOpen={isCalendarOpen} onClose={() => setIsCalendarOpen(false)} title="">
        <div className="flex flex-col h-full relative">
          <div className="flex justify-between items-center text-center mb-6">
            <span className="text-[17px] font-bold text-[#111]">Select Date</span>
            <span className="text-[14px] font-medium text-[#A09A94]">February 2026</span>
          </div>
          <div className="grid grid-cols-7 gap-y-3 text-center mb-6">
            {['S','M','T','W','T','F','S'].map((d, i) => <span key={i} className="text-[12px] font-medium text-[#A09A94]">{d}</span>)}
            {[...Array(28)].map((_, i) => {
              const day = i + 1;
              const dateStr = `2026-02-${day.toString().padStart(2, '0')}`;
              const isPast = day < 22;
              const hasAvailability = mockBookingData.availability[dateStr] !== undefined;
              const isAvailable = mockBookingData.availability[dateStr]?.available;
              const isSelectable = !isPast && hasAvailability && isAvailable;
              const isDateSelected = tempDate === dateStr;
              return (
                <button key={day} disabled={!isSelectable} onClick={() => setTempDate(dateStr)} className="flex flex-col items-center justify-center gap-1">
                  <div className={`w-9 h-9 flex items-center justify-center rounded-full text-[14px] font-medium transition-all ${isDateSelected ? 'bg-[#E85D2A] text-white' : isSelectable ? 'text-[#111] hover:bg-[#F3EFEB]' : 'text-[#CFCFD4] cursor-not-allowed'}`}>
                    {day}
                  </div>
                  {isSelectable && isAvailable && <div className="w-1 h-1 rounded-full bg-[#E85D2A]" />}
                </button>
              );
            })}
          </div>
          <div className="pt-4 border-t border-[#EDE8E2] mt-auto">
            <button disabled={!tempDate} onClick={confirmDate} className={`w-full py-3.5 rounded-[12px] text-[15px] font-semibold transition-all ${!tempDate ? 'bg-[#EDE8E2] text-[#A09A94]' : 'bg-[#E85D2A] text-white active:scale-[0.98]'}`}>
              Confirm Date
            </button>
          </div>
        </div>
      </CardModal>

      {/* Close Dialog */}
      {showCloseDialog && (
        <div className="absolute inset-0 z-[120] bg-black/30 flex items-center justify-center p-5 animate-in fade-in duration-200">
          <div className="bg-[#FFFFFF] rounded-[16px] p-5 w-full max-w-[300px] border border-[#EDE8E2]">
            <h3 className="text-[17px] font-bold text-[#111] mb-1.5">Abandon Booking?</h3>
            <p className="text-[14px] text-[#A09A94] mb-5 leading-relaxed">Your progress will be lost.</p>
            <div className="flex flex-col gap-2.5">
              <button onClick={() => { setShowCloseDialog(false); onClose(); }} className="w-full py-3 rounded-[12px] font-semibold text-[14px] bg-[#FFF0F0] text-[#FF3B30] active:scale-[0.98] transition-transform">
                Discard
              </button>
              <button onClick={() => setShowCloseDialog(false)} className="w-full py-3 rounded-[12px] font-semibold text-[14px] bg-[#F3EFEB] text-[#6E6058] active:scale-[0.98] transition-transform">
                Keep editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentScreen = ({ onBack, onComplete }) => {
  const paymentData = {
    total: 99.50,
    platformFee: 4.50,
    providerName: 'Lukas F.',
    providerAvatar: 'https://i.pravatar.cc/150?img=12',
    service: '90 min Walk',
    servicePrice: 75.00,
    datetime: 'Mon, Feb 24, 2026 · 14:00–15:30',
    pet: 'Luna · Golden Retriever',
    addOns: [
      { label: 'Pick-up & Drop-off', price: 15.00 },
      { label: 'Photo updates', price: 5.00 }
    ],
    savedCards: [
      { id: 'card_1', brand: 'Visa', last4: '4242', exp: '12/27', isDefault: true },
      { id: 'card_2', brand: 'Mastercard', last4: '8888', exp: '03/26', isDefault: false }
    ]
  };

  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(paymentData.savedCards[0].id);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [activeSheet, setActiveSheet] = useState(null);
  const [menuCardId, setMenuCardId] = useState(null);
  const [sameAsHome, setSameAsHome] = useState(true);
  const [cardNumber, setCardNumber] = useState('');

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setTimeout(() => { setIsAuthorizing(false); onComplete(); }, 2000);
  };

  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted.substring(0, 19));
  };

  const canSubmit = selectedCardId && termsAccepted && !isAuthorizing;

  return (
    <div className="absolute inset-0 bg-[#F7F5F2] z-[80] overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="bg-[#F7F5F2] pt-14 pb-3 px-5 z-40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#EDE8E2] bg-[#F3EFEB] active:scale-[0.96] transition-transform">
            <ChevronLeft size={20} color="#111" />
          </button>
          <span className="text-[17px] font-bold text-[#111] flex-1">Payment</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-[160px] bg-[#F7F5F2]">
        {/* Booking Summary */}
        <section className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#111] mb-3">Booking summary</h3>

          <div className="flex items-center gap-3 mb-4">
            <Avatar src={paymentData.providerAvatar} size={32} />
            <span className="text-[14px] font-semibold text-[#111]">{paymentData.providerName}</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Service</span>
              <span className="text-[14px] font-semibold text-[#111]">{paymentData.service}</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Date & time</span>
              <span className="text-[14px] font-semibold text-[#111]">{paymentData.datetime}</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Pet</span>
              <span className="text-[14px] font-semibold text-[#111]">{paymentData.pet}</span>
            </div>
            {paymentData.addOns.length > 0 && (
              <>
                <div className="h-[1px] bg-[#EDE8E2]" />
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#A09A94]">Add-ons</span>
                  <span className="text-[14px] font-semibold text-[#111]">{paymentData.addOns.map(a => a.label).join(', ')}</span>
                </div>
              </>
            )}
          </div>

          {/* Price breakdown */}
          <div className="h-[1px] bg-[#EDE8E2] my-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#A09A94]">Service</span>
              <span className="font-medium text-[#111]">CHF {paymentData.servicePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#A09A94]">Add-ons</span>
              <span className="font-medium text-[#111]">CHF {paymentData.addOns.reduce((sum, a) => sum + a.price, 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <button className="text-[#A09A94] flex items-center gap-1 active:opacity-70" onClick={() => setActiveSheet('service_fee')}>
                Service fee <Info size={12} className="text-[#A09A94]" />
              </button>
              <span className="font-medium text-[#111]">CHF {paymentData.platformFee.toFixed(2)}</span>
            </div>
          </div>
          <div className="h-[1px] bg-[#EDE8E2] my-3" />
          <div className="flex justify-between items-center">
            <span className="text-[15px] font-semibold text-[#111]">Total</span>
            <span className="text-[20px] font-bold text-[#111]">CHF {paymentData.total.toFixed(2)}</span>
          </div>
        </section>

        {/* Payment Method */}
        <section className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#111] mb-3">Payment method</h3>
          {paymentData.savedCards.map((card, idx) => {
            const isSelected = selectedCardId === card.id;
            return (
              <div key={card.id}>
                <div onClick={() => setSelectedCardId(card.id)} className="flex items-center justify-between py-3 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 ${isSelected ? 'border-[#E85D2A]' : 'border-[#CFCFD4]'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-[#E85D2A] rounded-full" />}
                    </div>
                    <div>
                      <span className="text-[14px] font-semibold text-[#111]">{card.brand} ending {card.last4}</span>
                      <span className="text-[12px] text-[#A09A94] block mt-0.5">Exp {card.exp}</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setMenuCardId(card.id); setActiveSheet('card_menu'); }} className="p-1 text-[#A09A94]">
                    <MoreHorizontal size={16} />
                  </button>
                </div>
                {idx < paymentData.savedCards.length - 1 && <div className="h-[1px] bg-[#EDE8E2]" />}
              </div>
            );
          })}
          <div className="h-[1px] bg-[#EDE8E2]" />
          <button onClick={() => setActiveSheet('add_card')} className="flex items-center gap-2 py-3 text-[#E85D2A] active:opacity-70">
            <Plus size={16} />
            <span className="text-[14px] font-medium">Add new card</span>
          </button>
        </section>
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-gradient-to-t from-[#F7F5F2] via-[#F7F5F2] to-transparent z-40">
        <button
          disabled={!canSubmit}
          onClick={handleAuthorize}
          className={`w-full py-3.5 rounded-[12px] text-[15px] font-semibold transition-all flex items-center justify-center ${!canSubmit ? 'bg-[#EDE8E2] text-[#A09A94]' : 'bg-[#E85D2A] text-white active:scale-[0.98]'}`}
        >
          {isAuthorizing ? <Loader2 size={18} className="animate-spin text-white" /> : <span>Authorize CHF {paymentData.total.toFixed(2)}</span>}
        </button>
      </div>

      {/* Add Card Modal */}
      <CardModal isOpen={activeSheet === 'add_card'} onClose={() => setActiveSheet(null)} title="Add card">
        <div className="flex flex-col gap-4 pb-6">
          <div>
            <label className="text-[12px] text-[#A09A94] mb-2 block">Card number</label>
            <div className="bg-[#F3EFEB] rounded-[12px] border border-[#EDE8E2] focus-within:border-[#E85D2A]/40 transition-all flex items-center px-3.5">
              <CreditCard size={16} className="text-[#A09A94] mr-2.5" />
              <input type="text" placeholder="0000 0000 0000 0000" value={cardNumber} onChange={handleCardNumberChange} maxLength="19" className="w-full bg-transparent py-3 text-[14px] text-[#111] placeholder:text-[#A09A94] outline-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-[12px] text-[#A09A94] mb-2 block">Expiry</label>
              <div className="bg-[#F3EFEB] rounded-[12px] border border-[#EDE8E2] focus-within:border-[#E85D2A]/40 transition-all px-3.5">
                <input type="text" placeholder="MM / YY" maxLength="5" className="w-full bg-transparent py-3 text-[14px] text-[#111] placeholder:text-[#A09A94] outline-none" />
              </div>
            </div>
            <div className="flex-1">
              <label className="text-[12px] text-[#A09A94] mb-2 block">CVV</label>
              <div className="bg-[#F3EFEB] rounded-[12px] border border-[#EDE8E2] focus-within:border-[#E85D2A]/40 transition-all px-3.5">
                <input type="text" placeholder="123" maxLength="4" className="w-full bg-transparent py-3 text-[14px] text-[#111] placeholder:text-[#A09A94] outline-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-[12px] text-[#A09A94] mb-2 block">Cardholder name</label>
            <div className="bg-[#F3EFEB] rounded-[12px] border border-[#EDE8E2] focus-within:border-[#E85D2A]/40 transition-all px-3.5">
              <input type="text" placeholder="Full name" className="w-full bg-transparent py-3 text-[14px] text-[#111] placeholder:text-[#A09A94] outline-none" />
            </div>
          </div>
          <div onClick={() => setSameAsHome(!sameAsHome)} className="flex items-center gap-2.5 cursor-pointer mt-1">
            <div className={`w-[18px] h-[18px] rounded-[5px] border-[1.5px] flex items-center justify-center transition-colors ${sameAsHome ? 'bg-[#E85D2A] border-[#E85D2A]' : 'border-[#CFCFD4]'}`}>
              {sameAsHome && <Check size={12} color="#FFF" strokeWidth={3} />}
            </div>
            <span className="text-[13px] text-[#111]">Same as home address</span>
          </div>
          <button onClick={() => setActiveSheet(null)} className="w-full mt-2 py-3.5 rounded-[12px] text-[15px] font-semibold bg-[#E85D2A] text-white active:scale-[0.98] transition-transform">
            Save card
          </button>
          <div className="flex justify-center items-center gap-1.5">
            <Lock size={11} className="text-[#A09A94]" />
            <span className="text-[11px] text-[#A09A94]">Secured by Stripe</span>
          </div>
        </div>
      </CardModal>

      {/* Terms Modal */}
      <CardModal isOpen={activeSheet === 'terms'} onClose={() => setActiveSheet(null)} title="Legal">
        <div className="flex flex-col gap-4 pb-20">
          <h4 className="font-bold text-[15px] text-[#111]">Terms of Service</h4>
          <p className="text-[13px] text-[#A09A94] leading-relaxed">
            By accepting these terms, you agree to FYLOS's core platform policies. We facilitate connections between pet owners and care providers. Payment authorization holds are placed 24 hours prior to booking confirmation and are automatically released if the provider declines or fails to respond.
          </p>
          <h4 className="font-bold text-[15px] text-[#111] mt-2">Cancellation Policy</h4>
          <p className="text-[13px] text-[#A09A94] leading-relaxed">
            Bookings can be cancelled free of charge up to 24 hours before the scheduled start time. Cancellations within 24 hours may be subject to a 50% fee. If the provider cancels, a full refund (and release of any holds) will be processed immediately.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent">
          <button onClick={() => { setTermsAccepted(true); setActiveSheet(null); }} className="w-full py-3.5 rounded-[12px] text-[15px] font-semibold bg-[#E85D2A] text-white active:scale-[0.98] transition-transform">
            I Agree
          </button>
        </div>
      </CardModal>

      {/* Card Menu Modal */}
      <CardModal isOpen={activeSheet === 'card_menu'} onClose={() => setActiveSheet(null)} title="Card Options" snap="compact">
        <div className="flex flex-col gap-2 pb-6">
          <button onClick={() => { setActiveSheet(null); setSelectedCardId(menuCardId); }} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[12px] hover:bg-[#F3EFEB] active:scale-[0.98] transition-all">
            <CheckCircle2 size={18} className="text-[#111]" /><span className="text-[15px] font-semibold text-[#111]">Set as default</span>
          </button>
          <button onClick={() => setActiveSheet(null)} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-[12px] hover:bg-[#FFF0F0] active:scale-[0.98] transition-all">
            <AlertTriangle size={18} className="text-[#FF3B30]" /><span className="text-[15px] font-semibold text-[#FF3B30]">Remove card</span>
          </button>
        </div>
      </CardModal>

      {/* Service Fee Modal */}
      <CardModal isOpen={activeSheet === 'service_fee'} onClose={() => setActiveSheet(null)} title="Service fee" snap="compact">
        <div className="flex flex-col gap-5 pb-6">
          <p className="text-[14px] text-[#A09A94] leading-relaxed">This fee covers secure payments, customer support, and platform protection.</p>
          <button onClick={() => setActiveSheet(null)} className="w-full py-3.5 rounded-[12px] text-[15px] font-semibold bg-[#F3EFEB] border border-[#EDE8E2] text-[#6E6058] active:scale-[0.98] transition-all">
            Got it
          </button>
        </div>
      </CardModal>
    </div>
  );
};

const RequestSentScreen = ({ onClose, onViewBooking }) => {
  const mockRequestSentData = {
    providerName: 'Lukas F.',
    providerAvatar: 'https://i.pravatar.cc/150?img=12',
    providerRating: '4.9',
    total: 95.00,
    service: '90 min Walk',
    datetime: 'Mon, Feb 24 · 14:00–15:30',
    pet: 'Luna · Golden Retriever',
    addOns: ['Pick-up & Drop-off', 'Photo updates']
  };

  return (
    <div className="absolute inset-0 bg-[#F7F5F2] z-[90] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-400">
      <div className="flex-1 overflow-y-auto px-5 pb-[160px] flex flex-col items-center justify-center">
        {/* Success Icon + Title */}
        <div className="flex flex-col items-center text-center w-full max-w-[280px] mb-8">
          <div className="w-[72px] h-[72px] bg-[#E85D2A]/10 rounded-full flex items-center justify-center mb-5 pop-animation">
            <Check size={36} color="#E85D2A" strokeWidth={3} className="check-animation" />
          </div>
          <h2 className="text-[22px] font-bold text-[#111] tracking-tight mb-2">Request sent</h2>
          <p className="text-[14px] text-[#A09A94] leading-relaxed">
            We notified {mockRequestSentData.providerName}. You'll hear back usually within 1h.
          </p>
        </div>

        {/* Flat Info Rows */}
        <div className="w-full max-w-[340px]">
          <div className="flex items-center gap-3 mb-5">
            <Avatar src={mockRequestSentData.providerAvatar} size={36} />
            <div>
              <span className="text-[14px] font-semibold text-[#111] block leading-tight">{mockRequestSentData.providerName}</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="text-[#111] fill-[#111]" />
                <span className="text-[12px] text-[#A09A94]">{mockRequestSentData.providerRating}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Service</span>
              <span className="text-[14px] font-semibold text-[#111]">{mockRequestSentData.service}</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Date</span>
              <span className="text-[14px] font-semibold text-[#111]">{mockRequestSentData.datetime}</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Pet</span>
              <span className="text-[14px] font-semibold text-[#111]">{mockRequestSentData.pet}</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Total</span>
              <span className="text-[15px] font-bold text-[#111]">CHF {mockRequestSentData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-gradient-to-t from-[#F7F5F2] via-[#F7F5F2] to-transparent z-40 flex flex-col items-center gap-3">
        <button onClick={onViewBooking} className="w-full py-3.5 rounded-[12px] text-[15px] font-semibold bg-[#E85D2A] text-white active:scale-[0.98] transition-transform">
          View booking
        </button>
        <button onClick={onClose} className="text-[14px] font-medium text-[#A09A94] active:opacity-70 transition-opacity py-1">
          Back to home
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 60% { transform: scale(1.05); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes drawCheck { 0% { stroke-dasharray: 100; stroke-dashoffset: 100; } 100% { stroke-dasharray: 100; stroke-dashoffset: 0; } }
        .pop-animation { animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .check-animation { stroke-dasharray: 100; stroke-dashoffset: 100; animation: drawCheck 0.4s ease-out 0.2s forwards; }
      `}} />
    </div>
  );
};

const ChatScreen = ({ onBack, status }) => {
  const [inputText, setInputText] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 'd1', type: 'date', text: 'Today' },
    { id: 's1', type: 'system', text: 'Booking confirmed' },
    { id: 'm1', sender: 'walker', text: 'Hi there! Looking forward to walking Luna today.', time: '10:00 AM' },
    { id: 'm2', sender: 'user', text: 'Great, thanks!', time: '10:04 AM', readStatus: 'read' },
    { id: 'm3', sender: 'user', text: 'The keys are under the mat.', time: '10:05 AM', readStatus: 'read' },
    { id: 'd2', type: 'date', text: '14:00' },
    { id: 'm4', sender: 'walker', text: 'We are at the park now!', time: '14:10 PM' },
    { id: 'm5', sender: 'walker', text: "She's having a blast with the other dogs here.", time: '14:10 PM' },
    { id: 'm6', sender: 'walker', photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=280&h=280', time: '14:11 PM' }
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = {
    'pending': [],
    'confirmed': ['Sounds good', 'What time?', 'My location', 'Confirmed'],
    'in-progress': ['Send a photo', 'Running late', 'All good'],
    'completed': ['Thank you', 'Leave review', 'Book again'],
    'cancelled': [],
    'declined': []
  };
  const currentReplies = quickReplies[status] || [];

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setShowScroll(scrollHeight - scrollTop - clientHeight > 80);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight - scrollTop - clientHeight < 150) scrollToBottom();
    }
  }, [messages, isTyping]);

  const handleSend = (text) => {
    if (!text.trim()) return;
    const newMsg = { id: Date.now().toString(), sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), readStatus: 'sent' };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsFocused(false);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { id: Date.now().toString() + '1', sender: 'walker', text: 'Got it! Thanks for letting me know.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 2000);
  };

  return (
    <div className="absolute inset-0 bg-[#F7F7F8] z-[95] flex flex-col animate-in slide-in-from-right duration-300">
      <div className="absolute top-[48px] left-[16px] right-[16px] z-50 flex items-center justify-between bg-white/80 backdrop-blur-md rounded-full px-2 py-2 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-white">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"><ChevronLeft size={24} color="#111111" /></button>
        <div className="flex items-center justify-center gap-2.5 flex-1">
          <Avatar src="https://i.pravatar.cc/150?img=12" size={32} />
          <div className="flex flex-col items-start justify-center">
            <span className="text-[15px] font-bold text-[#111111] leading-tight">Lukas F.</span>
            <span className="text-[12px] font-medium text-[#8E8E93] leading-tight mt-[1px]">Online now</span>
          </div>
        </div>
        <button onClick={() => setIsMenuOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"><MoreVertical size={20} color="#111111" /></button>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto custom-scrollbar pt-[116px] pb-[150px] px-4 flex flex-col">
        {messages.map((msg, idx) => {
          if (msg.type === 'date') return <div key={msg.id} className="text-center text-[12px] font-bold text-[#8E8E93] uppercase tracking-wider my-4">{msg.text}</div>;
          if (msg.type === 'system') return <div key={msg.id} className="text-center text-[13px] font-medium text-[#8E8E93] my-2">{msg.text}</div>;
          const isUser = msg.sender === 'user';
          const prevMsg = messages[idx - 1];
          const nextMsg = messages[idx + 1];
          const isSamePrev = prevMsg && prevMsg.sender === msg.sender && !prevMsg.type;
          const isSameNext = nextMsg && nextMsg.sender === msg.sender && !nextMsg.type;
          let brClass = '';
          if (isUser) {
            if (!isSamePrev && !isSameNext) brClass = 'rounded-[20px] rounded-br-[4px]';
            else if (!isSamePrev && isSameNext) brClass = 'rounded-[20px] rounded-br-[8px]';
            else if (isSamePrev && isSameNext) brClass = 'rounded-[20px] rounded-tr-[8px] rounded-br-[8px]';
            else if (isSamePrev && !isSameNext) brClass = 'rounded-[20px] rounded-tr-[8px] rounded-br-[4px]';
          } else {
            if (!isSamePrev && !isSameNext) brClass = 'rounded-[20px] rounded-bl-[4px]';
            else if (!isSamePrev && isSameNext) brClass = 'rounded-[20px] rounded-bl-[8px]';
            else if (isSamePrev && isSameNext) brClass = 'rounded-[20px] rounded-tl-[8px] rounded-bl-[8px]';
            else if (isSamePrev && !isSameNext) brClass = 'rounded-[20px] rounded-tl-[8px] rounded-bl-[4px]';
          }
          const mbClass = isSameNext ? 'mb-[2px]' : 'mb-5';
          const showTime = !isSameNext;
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} ${mbClass} w-full msg-animate`}>
              <div className={`max-w-[75%] px-4 py-2.5 text-[15px] leading-[1.4] shadow-[0_1px_4px_rgba(0,0,0,0.02)] ${isUser ? 'bg-[#FF6B35] text-white' : 'bg-[#EAEAEA] text-[#111111]'} ${brClass}`}>
                {msg.photo && <img src={msg.photo} alt="Attachment" className={`w-full max-w-[240px] rounded-[12px] object-cover ${msg.text ? 'mb-1.5' : ''}`} />}
                {msg.text && <span>{msg.text}</span>}
              </div>
              {showTime && (
                <div className={`flex items-center gap-1 mt-1 px-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <span className="text-[11px] text-[#8E8E93] font-medium">{msg.time}</span>
                  {isUser && <CheckCheck size={14} className={msg.readStatus === 'read' ? 'text-[#007AFF]' : 'text-[#8E8E93]'} strokeWidth={2.5} />}
                </div>
              )}
            </div>
          );
        })}
        {isTyping && (
          <div className="flex flex-col items-start mb-4 w-full animate-in fade-in duration-300">
            <div className="bg-[#EAEAEA] px-4 py-3.5 rounded-[20px] rounded-tl-[4px] flex items-center gap-1 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
              <span className="typing-dot"></span><span className="typing-dot"></span><span className="typing-dot"></span>
            </div>
          </div>
        )}
      </div>

      {showScroll && (
        <div className="absolute bottom-[150px] right-[16px] z-40 animate-in zoom-in fade-in duration-200">
          <button onClick={scrollToBottom} className="h-9 px-3 bg-white/80 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.12)] border border-white/50 rounded-full flex items-center justify-center gap-1.5 text-[#111111] transition-transform active:scale-95">
            <ArrowDown size={16} />
            <div className="w-5 h-5 bg-[#FF6B35] rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm">1</div>
          </button>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 pt-[80px] pb-[32px] bg-gradient-to-t from-[#F7F7F8] via-[#F7F7F8]/95 to-transparent z-50 pointer-events-none flex flex-col justify-end">
        {status === 'pending' ? (
          <div className="px-4 py-2 pointer-events-auto">
            <div className="w-full bg-[#EAEAEA]/80 backdrop-blur-md rounded-[20px] py-3.5 px-4 flex items-center justify-center text-[14px] text-[#6E6E73] font-medium gap-2 border border-white/40 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
              <Lock size={16} /> Messaging opens after acceptance
            </div>
          </div>
        ) : (
          <>
            {currentReplies.length > 0 && (
              <div className={`flex overflow-x-auto gap-2 px-4 custom-scrollbar pointer-events-auto transition-all duration-300 origin-bottom ${isFocused ? 'max-h-0 opacity-0 mb-0 scale-y-90' : 'max-h-[50px] opacity-100 mb-3 scale-y-100'}`}>
                {currentReplies.map((chip, idx) => (
                  <button key={idx} onClick={() => handleSend(chip)} className="whitespace-nowrap px-4 py-1.5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[20px] text-[14px] text-[#111111] font-medium active:bg-[#F0F0F2] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)]">{chip}</button>
                ))}
              </div>
            )}
            <div className="pointer-events-auto flex items-end gap-2 px-4">
              <button onClick={() => setIsAttachMenuOpen(true)} className="w-10 h-10 mb-[2px] flex-shrink-0 bg-[#EAEAEA]/90 backdrop-blur-sm border border-white/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-full flex items-center justify-center text-[#111111] active:bg-[#D4D4D4] transition-colors"><Plus size={22} /></button>
              <div className="flex-1 bg-white/95 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-white/80 rounded-[24px] min-h-[44px] max-h-[120px] flex items-center px-4 py-2 mb-[2px] overflow-hidden transition-all duration-300">
                <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(inputText); } }} placeholder="Message..." className="w-full bg-transparent outline-none text-[15px] text-[#111111] placeholder-[#8E8E93] resize-none overflow-y-auto custom-scrollbar" rows={1} style={{ minHeight: '24px' }} />
              </div>
              {inputText.trim() ? (
                <button onClick={() => handleSend(inputText)} className="w-10 h-10 mb-[2px] flex-shrink-0 bg-[#FF6B35] text-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(255,107,53,0.25)] active:scale-95 transition-all animate-in zoom-in duration-200"><Send size={18} className="ml-0.5" /></button>
              ) : (
                <button className="w-10 h-10 mb-[2px] flex-shrink-0 bg-white/95 backdrop-blur-sm shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-white/80 text-[#8E8E93] rounded-full flex items-center justify-center transition-colors active:bg-[#F0F0F2]"><Mic size={22} /></button>
              )}
            </div>
          </>
        )}
      </div>

      <CardModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
        <div className="flex flex-col gap-1 mt-2">
          <button className="w-full text-left px-4 py-3.5 text-[16px] font-medium text-[#111111] active:bg-[#F7F7F8] rounded-[12px] flex items-center gap-3"><User size={20} className="text-[#8E8E93]" /> View profile</button>
          <button onClick={() => { setIsMenuOpen(false); onBack(); }} className="w-full text-left px-4 py-3.5 text-[16px] font-medium text-[#111111] active:bg-[#F7F7F8] rounded-[12px] flex items-center gap-3"><Info size={20} className="text-[#8E8E93]" /> View booking</button>
          <button className="w-full text-left px-4 py-3.5 text-[16px] font-medium text-[#111111] active:bg-[#F7F7F8] rounded-[12px] flex items-center gap-3"><MapPin size={20} className="text-[#8E8E93]" /> Share location</button>
          <div className="w-full h-[1px] bg-[#EAEAEA] my-2" />
          <button className="w-full text-left px-4 py-3.5 text-[16px] font-medium text-[#111111] active:bg-[#F7F7F8] rounded-[12px] flex items-center gap-3"><Bell size={20} className="text-[#8E8E93]" /> Mute notifications</button>
          <button className="w-full text-left px-4 py-3.5 text-[16px] font-bold text-[#FF3B30] active:bg-[#FFF5F5] rounded-[12px] flex items-center gap-3"><AlertTriangle size={20} className="text-[#FF3B30]" /> Report user</button>
        </div>
      </CardModal>

      <CardModal isOpen={isAttachMenuOpen} onClose={() => setIsAttachMenuOpen(false)}>
        <div className="flex flex-col gap-1 mt-2">
          <button className="w-full text-left px-4 py-3.5 text-[16px] font-medium text-[#111111] active:bg-[#F7F7F8] rounded-[12px] flex items-center gap-3"><Camera size={20} className="text-[#8E8E93]" /> Take photo</button>
          <button className="w-full text-left px-4 py-3.5 text-[16px] font-medium text-[#111111] active:bg-[#F7F7F8] rounded-[12px] flex items-center gap-3"><ImageIcon size={20} className="text-[#8E8E93]" /> Choose from library</button>
          <button className="w-full text-left px-4 py-3.5 text-[16px] font-medium text-[#111111] active:bg-[#F7F7F8] rounded-[12px] flex items-center gap-3"><MapPin size={20} className="text-[#8E8E93]" /> Share location</button>
        </div>
      </CardModal>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes typing { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-3px); opacity: 1; } }
        .typing-dot { animation: typing 1s infinite; width: 5px; height: 5px; background-color: #8E8E93; border-radius: 50%; display: inline-block; margin: 0 2px; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes messageEnter { 0% { opacity: 0; transform: translateY(4px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        .msg-animate { animation: messageEnter 0.12s ease-out forwards; }
      `}} />
    </div>
  );
};

const BookingConfirmedScreen = ({ onClose, onMessage }) => {
  return (
    <div className="absolute inset-0 bg-[#FFFFFF] z-[95] overflow-y-auto overflow-x-hidden custom-scrollbar">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes floatDown { 0% { transform: translateY(-20px) rotate(0deg) scale(0.8); opacity: 0; } 15% { opacity: 1; transform: translateY(10px) rotate(45deg) scale(1); } 80% { opacity: 1; } 100% { transform: translateY(120px) rotate(180deg) scale(0.5); opacity: 0; } }
        .confetti-piece { animation: floatDown 3s ease-out forwards; }
        @keyframes subtleScaleIn { 0% { transform: scale(0.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        .animate-subtle-scale { animation: subtleScaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center z-0">
        {[...Array(8)].map((_, i) => (
          <div key={`confetti-${i}`} className="confetti-piece absolute w-2 h-2 rounded-[2px]"
            style={{ backgroundColor: ['#FF6B35', '#00C060', '#007AFF', '#FF9500'][i % 4], left: `${20 + (i * 8)}%`, animationDelay: `${i * 0.1}s`, top: `${5 + (i % 3) * 2}%` }}
          />
        ))}
      </div>

      <div className="sticky top-0 right-0 w-full flex justify-end px-5 pt-14 pb-4 z-50 bg-gradient-to-b from-white via-white/90 to-transparent">
        <button onClick={onClose} className="w-[40px] h-[40px] flex items-center justify-center bg-[#F7F7F8] hover:bg-[#F0F0F2] rounded-full transition-colors active:scale-95" aria-label="Close">
          <X size={20} color="#111111" strokeWidth={2.5} />
        </button>
      </div>

      <div className="px-5 pt-4 flex flex-col items-center relative z-10 min-h-full pb-4">
        <div className="relative w-[80px] h-[80px] mb-6 animate-subtle-scale">
          <div className="absolute inset-0 bg-[#FF6B35] opacity-10 blur-xl rounded-full" />
          <div className="relative w-full h-full bg-[#FFF4EF] rounded-full flex items-center justify-center text-[#FF6B35] shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] border border-white">
            <CheckCircle2 size={36} strokeWidth={3} />
          </div>
        </div>

        <Text variant="title" className="mb-2 text-center tracking-tight">Booking Confirmed!</Text>
        <p className="text-[16px] text-[#777777] text-center max-w-[280px] mb-8 leading-relaxed">Lukas accepted your booking for Monday, Feb 24.</p>

        <Card variant="grey" className="w-full mb-10 !p-4 !rounded-[16px]">
          <div className="flex items-center gap-3 mb-4">
            <Avatar src="https://i.pravatar.cc/150?img=12" size={48} />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#111111] text-[16px] truncate">Lukas F.</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} className="fill-[#111111] text-[#111111]" />
                <span className="text-[13px] font-bold text-[#111111]">4.9</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[15px] font-semibold text-[#111111]">CHF 95.00</span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#EEEEEE] my-4" />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center shrink-0 border border-black/[0.04]"><Activity size={16} color="#FF6B35" /></div>
              <span className="text-[14px] font-medium text-[#111111]">Dog Walking</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">90 min</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center shrink-0 border border-black/[0.04]"><Calendar size={16} className="text-[#111111]" /></div>
              <span className="text-[14px] font-medium text-[#111111]">Mon, Feb 24</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">14:00 – 15:30</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FFFFFF] flex items-center justify-center shrink-0 border border-black/[0.04]"><PawPrint size={16} className="text-[#111111]" /></div>
              <span className="text-[14px] font-medium text-[#111111]">Luna</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">Golden Retriever</span>
            </div>
          </div>
        </Card>

        <div className="w-full mb-0">
          <Text variant="label" className="mb-3 ml-1 text-[#8E8E93]">What's Next</Text>
          <div className="space-y-2">
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[12px] p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0"><CreditCard size={16} className="text-[#111111]" /></div>
              <span className="text-[14px] font-medium text-[#111111]">Payment processing</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">CHF 95.00</span>
            </div>
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[12px] p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0"><Calendar size={16} className="text-[#111111]" /></div>
              <span className="text-[14px] font-medium text-[#111111]">Walk confirmed</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">Mon, 14:00</span>
            </div>
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[12px] p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0"><MessageCircle size={16} className="text-[#111111]" /></div>
              <span className="text-[14px] font-medium text-[#111111]">You can now message Lukas</span>
            </div>
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[12px] p-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0"><Bell size={16} className="text-[#111111]" /></div>
              <span className="text-[14px] font-medium text-[#111111]">Reminders enabled</span>
              <span className="ml-auto text-[14px] text-[#6E6E73]">1 day before</span>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 w-[calc(100%+40px)] -mx-5 mt-auto pt-12 pb-8 px-5 bg-gradient-to-t from-white via-white/95 to-transparent z-20">
          <div className="flex flex-col gap-3">
            <Button variant="primary" onClick={onMessage}>Message Lukas</Button>
            <Button variant="secondary" onClick={onClose}>Done</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingDeclinedScreen = ({ onClose, onBrowse, onMessage }) => {
  const declineReason = "So sorry, I just got booked for another dog across town at that exact time. I'd love to walk Luna another day!";

  return (
    <div className="absolute inset-0 z-[95] overflow-y-auto overflow-x-hidden custom-scrollbar bg-gradient-to-b from-[#F9F9FA] to-[#F4F4F5]">
      <div className="sticky top-0 right-0 w-full flex justify-end px-5 pt-14 pb-4 z-50 bg-gradient-to-b from-[#F9F9FA] via-[#F9F9FA]/90 to-transparent">
        <button onClick={onClose} className="w-[40px] h-[40px] flex items-center justify-center bg-[#FFFFFF] border border-[#EAEAEA] shadow-sm hover:bg-[#F0F0F2] rounded-full transition-colors active:scale-95" aria-label="Close">
          <X size={20} color="#111111" strokeWidth={2.5} />
        </button>
      </div>

      <div className="px-5 pt-2 flex flex-col items-center relative z-10 min-h-full pb-4">
        <div className="w-[72px] h-[72px] mb-6 bg-[#FFF6E8] rounded-full flex items-center justify-center text-[#F5A524] shadow-[inset_0_2px_4px_rgba(0,0,0,0.04)]">
          <AlertCircle size={36} strokeWidth={2} />
        </div>

        <Text variant="title" className="mb-3 text-center tracking-tight">Booking Declined</Text>
        <p className="text-[16px] text-[#6B6B6B] text-center max-w-[300px] mb-8 leading-relaxed">Unfortunately, Lukas isn't available at that time. Your payment hold has been released.</p>

        <Card variant="default" className="w-full mb-5 !p-4 !rounded-[16px]">
          <div className="flex items-center gap-3">
            <Avatar src="https://i.pravatar.cc/150?img=12" size={44} />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-[#111111] text-[16px] truncate">Lukas F.</h4>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={12} className="fill-[#111111] text-[#111111]" />
                <span className="text-[13px] font-bold text-[#111111]">4.9</span>
              </div>
            </div>
            <div className="text-right shrink-0 flex flex-col items-end">
              <span className="text-[15px] font-semibold text-[#111111]">90 min Walk</span>
              <span className="text-[13px] text-[#6E6E73] mt-0.5">CHF 95.00</span>
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#EEEEEE] my-4" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#8E8E93]" />
              <span className="text-[14px] font-medium text-[#111111]">Mon, Feb 24, 14:00</span>
            </div>
            <span className="text-[12px] font-medium text-[#C27A00] bg-[#FFF8F0] px-2.5 py-0.5 rounded-full">Declined</span>
          </div>
        </Card>

        <div className="w-full mb-6 bg-[#FFFFFF] border border-[#F0F0F0] rounded-[16px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <Text variant="label" className="mb-2 text-[#8E8E93]">Reason</Text>
          <p className="text-[15px] text-[#444444] leading-relaxed opacity-90">"{declineReason}"</p>
        </div>

        <div className="w-full mb-8 bg-[#FFFFFF] relative overflow-hidden rounded-[16px] shadow-[0_2px_12px_rgba(0,0,0,0.02)] border border-[#EAEAEA]">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#FF6B35]/20" />
          <div className="p-4 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-[#FF6B35] shrink-0 mt-0.5" strokeWidth={2.5} />
            <div>
              <h4 className="text-[15px] font-semibold text-[#111111] mb-0.5">Hold Released</h4>
              <p className="text-[13px] text-[#6E6E73] leading-relaxed">CHF 95.00 released back to Visa •••• 4242. No charge was made.</p>
            </div>
          </div>
        </div>

        <div className="w-full">
          <div className="mb-4 pl-1">
            <Text variant="subtitle" className="mb-0.5">Find another walker</Text>
            <Text variant="caption">Available at the same time</Text>
          </div>
          <div className="space-y-3">
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[16px] p-3 flex items-center gap-3">
              <Avatar src="https://i.pravatar.cc/150?u=sarah" size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[15px] font-semibold text-[#111111] truncate">Sarah K.</span>
                  <div className="flex items-center gap-0.5 bg-[#F7F7F8] px-1.5 py-0.5 rounded-[6px]">
                    <Star size={10} className="fill-[#111111] text-[#111111]" />
                    <span className="text-[11px] font-bold text-[#111111]">5.0</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#FF6B35] bg-[#FFF4EF] px-2 py-0.5 rounded-md tracking-wide">Available</span>
                  <span className="text-[13px] text-[#6E6E73]">CHF 85.00</span>
                </div>
              </div>
              <button className="px-4 py-1.5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl text-[13px] font-medium text-[#111111] hover:bg-[#F7F7F8] transition-colors" onClick={onBrowse}>Book</button>
            </div>

            <div className="bg-[#FFFFFF] border border-[#EAEAEA] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-[16px] p-3 flex items-center gap-3">
              <Avatar src="https://i.pravatar.cc/150?u=marc" size={44} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[15px] font-semibold text-[#111111] truncate">Marc T.</span>
                  <div className="flex items-center gap-0.5 bg-[#F7F7F8] px-1.5 py-0.5 rounded-[6px]">
                    <Star size={10} className="fill-[#111111] text-[#111111]" />
                    <span className="text-[11px] font-bold text-[#111111]">4.8</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-[#FF6B35] bg-[#FFF4EF] px-2 py-0.5 rounded-md tracking-wide">Available</span>
                  <span className="text-[13px] text-[#6E6E73]">CHF 90.00</span>
                </div>
              </div>
              <button className="px-4 py-1.5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-xl text-[13px] font-medium text-[#111111] hover:bg-[#F7F7F8] transition-colors" onClick={onBrowse}>Book</button>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 w-[calc(100%+40px)] -mx-5 mt-auto pt-20 pb-8 px-5 bg-gradient-to-t from-[#F4F4F5] via-[#F4F4F5]/90 to-transparent z-20 pointer-events-none">
          <div className="pointer-events-auto flex flex-col gap-3">
            <Button variant="primary" onClick={onBrowse}>Browse alternatives</Button>
            <Button variant="secondary" onClick={onClose}>Try another date with Lukas</Button>
          </div>
          <div className="pointer-events-auto mt-6 flex justify-center gap-8 w-full opacity-60">
            <button onClick={onMessage} className="text-[14px] font-medium text-[#111111] hover:text-[#000000] transition-colors">Message Lukas</button>
            <button onClick={onClose} className="text-[14px] font-medium text-[#111111] hover:text-[#000000] transition-colors">Done</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingDetailsScreen = ({ status, setStatus, onBack, onNavigateToProvider, onOpenChat, onShowAccepted, onShowDeclined }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [notifications, setNotifications] = useState({ sms: true, push: true });
  const [bdToast, setBdToast] = useState('');

  const STATUS_CONFIG = {
    'pending': { color: '#FF6B35', bg: '#FFF4EF', icon: Clock, label: 'Pending Acceptance', subtext: 'Lukas has until 10:00 AM to respond' },
    'confirmed': { color: '#FF6B35', bg: '#FFF4EF', icon: CheckCircle2, label: 'Confirmed', subtext: 'Upcoming on Mon, Feb 24 at 14:00' },
    'in-progress': { color: '#FF6B35', bg: '#FFF4EF', icon: Navigation2, label: 'In Progress', subtext: 'Lukas is currently walking Luna' },
    'completed': { color: THEME.colors.secondaryText, bg: '#F2F2F7', icon: Check, label: 'Completed', subtext: 'Walk finished on Mon, Feb 24 at 15:30' },
    'cancelled': { color: THEME.colors.danger, bg: '#FFEBEA', icon: XCircle, label: 'Cancelled', subtext: 'Request was cancelled by you' },
    'declined': { color: THEME.colors.danger, bg: '#FFEBEA', icon: AlertTriangle, label: 'Declined', subtext: 'Lukas was unavailable for this time' }
  };

  const currentConfig = STATUS_CONFIG[status];

  const getTimelineSteps = () => {
    const baseSteps = [{ id: 'requested', label: 'Request sent', time: '09:15 AM' }];
    if (status === 'pending') {
      return [{ ...baseSteps[0], state: 'done' }, { id: 'accept', label: 'Lukas confirms', time: 'Waiting', state: 'current' }, { id: 'service', label: 'Service starts', time: '14:00', state: 'upcoming' }];
    }
    if (status === 'confirmed') {
      return [{ ...baseSteps[0], state: 'done' }, { id: 'accept', label: 'Booking confirmed', time: '09:45 AM', state: 'done' }, { id: 'service', label: 'Service starts', time: '14:00', state: 'upcoming' }];
    }
    if (status === 'in-progress') {
      return [{ ...baseSteps[0], state: 'done' }, { id: 'accept', label: 'Booking confirmed', time: '09:45 AM', state: 'done' }, { id: 'service', label: 'Service in progress', time: 'Started 14:05', state: 'current' }, { id: 'finish', label: 'Service completes', time: '~15:30', state: 'upcoming' }];
    }
    if (status === 'completed') {
      return [{ ...baseSteps[0], state: 'done' }, { id: 'accept', label: 'Booking confirmed', time: '09:45 AM', state: 'done' }, { id: 'service', label: 'Service completed', time: '15:35', state: 'done' }];
    }
    if (status === 'cancelled' || status === 'declined') {
      return [{ ...baseSteps[0], state: 'done' }, { id: 'fail', label: status === 'cancelled' ? 'Request cancelled' : 'Request declined', time: '10:05 AM', state: 'failed' }];
    }
    return baseSteps;
  };

  const handleTogglePref = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    setBdToast('Preferences updated');
    setTimeout(() => setBdToast(''), 2000);
  };

  return (
    <div className="absolute inset-0 bg-[#F7F5F2] z-[90] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="bg-[#F7F5F2] pt-14 pb-3 px-5 z-40">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#EDE8E2] bg-[#F3EFEB] active:scale-[0.96] transition-transform">
            <ChevronLeft size={20} color="#111" />
          </button>
          <span className="text-[17px] font-bold text-[#111] flex-1">Booking</span>
          <button onClick={() => setIsMenuOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-full border border-[#EDE8E2] bg-[#F3EFEB] active:scale-[0.96] transition-transform">
            <MoreVertical size={16} color="#111" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-[140px] bg-[#F7F5F2]">
        {/* Status Pill */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ backgroundColor: currentConfig.bg }}>
            <currentConfig.icon size={14} color={currentConfig.color} strokeWidth={2.5} />
            <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: currentConfig.color }}>{currentConfig.label}</span>
          </div>
          <p className="text-[13px] text-[#A09A94] mt-1.5">{currentConfig.subtext}</p>
        </div>

        {/* Provider Row */}
        <section className="mb-6">
          <div className="flex items-center gap-3">
            <Avatar src="https://i.pravatar.cc/150?img=12" size={44} />
            <div className="flex-1">
              <span className="text-[15px] font-semibold text-[#111] block leading-tight">Lukas F.</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star size={12} className="text-[#111] fill-[#111]" />
                <span className="text-[13px] font-medium text-[#111]">4.9</span>
                <span className="text-[12px] text-[#A09A94]">(128)</span>
              </div>
            </div>
            <button onClick={() => onNavigateToProvider && onNavigateToProvider()} className="text-[13px] font-medium text-[#E85D2A] active:opacity-70">Profile</button>
          </div>
        </section>

        {/* Service Details - Flat Rows */}
        <section className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#111] mb-3">Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Service</span>
              <span className="text-[14px] font-semibold text-[#111]">90 min Dog Walk</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Date & time</span>
              <span className="text-[14px] font-semibold text-[#111]">Mon, Feb 24 · 14:00–15:30</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Location</span>
              <span className="text-[14px] font-semibold text-[#111]">Bahnhofstrasse 12, Zurich</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Pet</span>
              <span className="text-[14px] font-semibold text-[#111]">Luna (Golden Retriever)</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between">
              <span className="text-[12px] text-[#A09A94]">Add-ons</span>
              <span className="text-[14px] font-semibold text-[#111]">Photo updates, Feed</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between items-start">
              <span className="text-[12px] text-[#A09A94] pt-0.5">Instructions</span>
              <div className="flex flex-col items-end">
                <span className="text-[14px] text-[#111] text-right line-clamp-1 max-w-[200px]">Keys under the doormat...</span>
                <button onClick={() => setIsInstructionsOpen(true)} className="text-[12px] font-medium text-[#E85D2A] mt-0.5">Read more</button>
              </div>
            </div>
          </div>
        </section>

        {/* Payment */}
        <section className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#111] mb-3">Payment</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#A09A94]">Subtotal</span>
              <span className="font-medium text-[#111]">CHF 85.00</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#A09A94]">Add-ons</span>
              <span className="font-medium text-[#111]">CHF 10.00</span>
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between">
              <span className="text-[15px] font-semibold text-[#111]">Total</span>
              <span className="text-[15px] font-bold text-[#111]">CHF 95.00</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <CreditCard size={14} className="text-[#A09A94]" />
                <span className="text-[13px] text-[#A09A94]">Visa •••• 4242</span>
              </div>
              {(status === 'pending' || status === 'confirmed' || status === 'in-progress') ? (
                <span className="text-[11px] font-bold text-[#E85D2A]">Hold active</span>
              ) : status === 'completed' ? (
                <span className="text-[11px] font-bold text-[#E85D2A]">Charged</span>
              ) : (
                <span className="text-[11px] font-bold text-[#A09A94]">Released</span>
              )}
            </div>
          </div>
        </section>

        {/* Updates */}
        <section className="mb-6">
          <h3 className="text-[15px] font-semibold text-[#111] mb-3">Notifications</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#111]">Push notifications</span>
              <Toggle checked={notifications.push} onChange={() => handleTogglePref('push')} />
            </div>
            <div className="h-[1px] bg-[#EDE8E2]" />
            <div className="flex justify-between items-center">
              <span className="text-[14px] text-[#111]">SMS updates</span>
              <Toggle checked={notifications.sms} onChange={() => handleTogglePref('sms')} />
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="mb-8">
          <div className="flex gap-4 justify-center">
            <button
              disabled={status === 'cancelled' || status === 'declined'}
              onClick={onOpenChat}
              className={`text-[14px] font-medium transition-opacity ${status === 'cancelled' || status === 'declined' ? 'text-[#CFCFD4] cursor-not-allowed' : 'text-[#E85D2A] active:opacity-70'}`}
            >
              Message
            </button>
            {(status === 'pending' || status === 'confirmed') && (
              <button
                onClick={() => setStatus('cancelled')}
                className="text-[14px] font-medium text-[#FF3B30] active:opacity-70 transition-opacity"
              >
                Cancel booking
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Bottom status-specific actions */}
      {status === 'in-progress' && (
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-gradient-to-t from-[#F7F5F2] via-[#F7F5F2] to-transparent z-40 flex gap-3">
          <button className="flex-1 py-3 rounded-[12px] text-[14px] font-semibold bg-[#F3EFEB] border border-[#EDE8E2] text-[#6E6058] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <Navigation2 size={16} /> Track
          </button>
          <button className="flex-1 py-3 rounded-[12px] text-[14px] font-semibold bg-[#E85D2A] text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <Camera size={16} /> Photos
          </button>
        </div>
      )}
      {status === 'completed' && (
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-gradient-to-t from-[#F7F5F2] via-[#F7F5F2] to-transparent z-40 flex gap-3">
          <button className="flex-1 py-3 rounded-[12px] text-[14px] font-semibold bg-[#F3EFEB] border border-[#EDE8E2] text-[#6E6058] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <Star size={16} /> Review
          </button>
          <button className="flex-1 py-3 rounded-[12px] text-[14px] font-semibold bg-[#E85D2A] text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            Book again
          </button>
        </div>
      )}

      {/* Menu Modal */}
      <CardModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} title="Options">
        <div className="flex flex-col gap-1">
          <div className="bg-[#F3EFEB] p-3 rounded-[12px] mb-3">
            <span className="text-[11px] font-bold text-[#A09A94] uppercase tracking-wider mb-2 block">Debug Status</span>
            <div className="flex flex-wrap gap-2">
              {Object.keys(STATUS_CONFIG).map(s => (
                <button key={s} onClick={() => { const prev = status; setStatus(s); setIsMenuOpen(false); if (s === 'confirmed' && prev !== 'confirmed' && onShowAccepted) onShowAccepted(); if (s === 'declined' && prev !== 'declined' && onShowDeclined) onShowDeclined(); }} className={`text-[12px] px-3 py-1.5 rounded-full font-bold ${status === s ? 'bg-[#E85D2A] text-white' : 'bg-[#EDE8E2] text-[#111]'}`}>{s}</button>
              ))}
            </div>
          </div>
          <button className="w-full text-left px-4 py-3 text-[15px] font-medium text-[#111] active:bg-[#F3EFEB] rounded-[12px] flex items-center gap-3"><FileText size={18} className="text-[#A09A94]" /> Download receipt</button>
          <button className="w-full text-left px-4 py-3 text-[15px] font-medium text-[#111] active:bg-[#F3EFEB] rounded-[12px] flex items-center gap-3"><HelpCircle size={18} className="text-[#A09A94]" /> Contact support</button>
          <div className="h-[1px] bg-[#EDE8E2] my-1" />
          <button className="w-full text-left px-4 py-3 text-[15px] font-bold text-[#FF3B30] active:bg-[#FFF0F0] rounded-[12px] flex items-center gap-3"><AlertTriangle size={18} className="text-[#FF3B30]" /> Report issue</button>
        </div>
      </CardModal>

      {/* Instructions Modal */}
      <CardModal isOpen={isInstructionsOpen} onClose={() => setIsInstructionsOpen(false)} title="Special Instructions">
        <p className="text-[14px] text-[#111] leading-relaxed pb-6">
          Please make sure she doesn't eat anything from the ground. Keys are under the doormat. She can be a bit shy with big dogs, so please keep her on a short leash when passing by them. Give her a treat after the walk (they are on the kitchen counter).
        </p>
        <button onClick={() => setIsInstructionsOpen(false)} className="w-full py-3.5 rounded-[12px] text-[15px] font-semibold bg-[#F3EFEB] border border-[#EDE8E2] text-[#6E6058] active:scale-[0.98] transition-transform">
          Done
        </button>
      </CardModal>

      {/* Toast */}
      {bdToast && (
        <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 bg-[#111] text-white px-4 py-2 rounded-full text-[13px] font-medium z-[150] animate-in slide-in-from-top fade-in">
          {bdToast}
        </div>
      )}
    </div>
  );
};

const ProviderProfileScreen = ({ provider, onBack, onNavigate }) => {
  const [menuSheet, setMenuSheet] = useState(false);
  const [calendarSheet, setCalendarSheet] = useState(false);
  const [certSheet, setCertSheet] = useState(null);
  const [galleryViewer, setGalleryViewer] = useState(null);

  const OptionRow = ({ icon: Icon, label, danger, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-[16px] active:scale-[0.98] transition-all ${danger ? 'text-[#FF3B30] hover:bg-[#FFE5E5]' : 'text-[#111111] hover:bg-[#F3EFEB]'}`}>
       <Icon size={20} className={danger ? "text-[#FF3B30]" : "text-[#111111]"} />
       <span className="text-[16px] font-semibold">{label}</span>
    </button>
  );

  return (
    <div className="absolute inset-0 bg-[var(--color-background)] z-50 overflow-hidden">
       <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-10 px-5 pointer-events-none bg-gradient-to-b from-[#FBF9F7]/95 via-[#FBF9F7]/80 to-transparent flex justify-between items-start">
          <button onClick={onBack} className="pointer-events-auto w-[44px] h-[44px] flex items-center justify-center bg-[#F3EFEB] border border-[#EDE8E2] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]">
             <ChevronLeft size={22} color="#111111" />
          </button>
          <div className="pointer-events-auto flex items-center bg-[#F3EFEB] border border-[#EDE8E2] rounded-[9999px] p-1 h-[44px]">
             <button className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[#F3EFEB] active:scale-[0.98] transition-all">
                <Share size={18} color="#111111"/>
             </button>
             <div className="w-[1px] h-[16px] bg-[#EDE8E2] mx-1" />
             <button onClick={() => setMenuSheet(true)} className="w-[36px] h-[36px] flex items-center justify-center rounded-full hover:bg-[#F3EFEB] active:scale-[0.98] transition-all">
                <MoreHorizontal size={18} color="#111111"/>
             </button>
          </div>
       </header>

       <div className="absolute inset-0 overflow-y-auto custom-scrollbar pt-[110px] pb-[140px]">
            <div className="flex flex-col items-center px-5 pt-2 text-center">
               <div className="mb-4">
                 <Avatar src={provider.photo} size={104} />
               </div>
               <h1 className="text-[24px] font-bold text-[#111111] mb-1.5">{provider.name}</h1>
               <div className="flex items-center gap-1.5 mb-5">
                  <Star size={16} fill={'#E85D2A'} color={'#E85D2A'} />
                  <span className="text-[16px] font-bold text-[#111111]">{provider.rating}</span>
                  <span className="text-[13px] text-[#A09A94]">({provider.reviewCount} reviews)</span>
               </div>
               <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {provider.badges.slice(0, 3).map(b => (
                     <Badge key={b} variant="default" className="!px-3 !py-1 font-semibold text-[10px] uppercase tracking-wider bg-[#F3EFEB] text-[#A09A94] border-none shadow-none">
                        {b}
                     </Badge>
                  ))}
               </div>
            </div>

            <div className="px-5 mb-10">
               <div className="bg-[#F3EFEB] border border-[#EDE8E2] rounded-[20px] p-4 flex justify-between items-center divide-x divide-[#EDE8E2]">
                  <div className="flex-1 flex flex-col items-center gap-1">
                     <span className="text-[16px] font-bold text-[#111111]">CHF 75</span>
                     <span className="text-[12px] text-[#A09A94]">per 90min</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                     <span className="text-[16px] font-bold text-[#111111]">{provider.responseTime}</span>
                     <span className="text-[12px] text-[#A09A94]">response</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                     <span className="text-[16px] font-bold text-[#111111]">{provider.distance}km</span>
                     <span className="text-[12px] text-[#A09A94]">distance</span>
                  </div>
               </div>
            </div>

            <section className="px-5 mb-10 space-y-4">
               <h3 className="text-[15px] font-semibold text-[#111] ml-1">About</h3>
               <p className="text-[16px] text-[#111111] leading-relaxed opacity-95">{provider.bio}</p>
               <div className="bg-[#F3EFEB] border border-[#EDE8E2] rounded-[20px] p-5 space-y-3 mt-4">
                  <div className="flex items-center gap-3">
                     <IconWrapper icon={Info} size={18} color="#A09A94" />
                     <span className="text-[14px] text-[#A09A94] w-[80px]">Languages</span>
                     <span className="text-[14px] text-[#111111] font-semibold">{provider.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <IconWrapper icon={Clock} size={18} color="#A09A94" />
                     <span className="text-[14px] text-[#A09A94] w-[80px]">Experience</span>
                     <span className="text-[14px] text-[#111111] font-semibold">{provider.yearsExperience} years</span>
                  </div>
                  <div className="flex items-center gap-3">
                     <IconWrapper icon={Activity} size={18} color="#A09A94" />
                     <span className="text-[14px] text-[#A09A94] w-[80px]">Total Walks</span>
                     <span className="text-[14px] text-[#111111] font-semibold">{provider.totalWalks}</span>
                  </div>
               </div>
            </section>

            <section className="px-5 mb-10 space-y-4">
               <h3 className="text-[15px] font-semibold text-[#111] ml-1">Services & Pricing</h3>
               <div className="space-y-3">
                  {provider.services.map(svc => (
                     <div key={svc.id} onClick={() => onNavigate('booking', { preselectedServiceId: svc.id })} className="relative overflow-hidden p-4 bg-[#F3EFEB] border border-[#EDE8E2] rounded-[16px] cursor-pointer active:scale-[0.98] transition-all">
                        {svc.popular && (
                           <div className="absolute top-0 right-0 bg-[#E85D2A] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-[12px]">
                              Most Popular
                           </div>
                        )}
                        <div className="flex justify-between items-center gap-4">
                           <div className="flex-1 min-w-0 flex items-start gap-3">
                              <div className="pt-0.5">{renderLegacyIcon(svc.icon, 22, 'text-[#A09A94]')}</div>
                              <div className="flex flex-col gap-0.5 pt-0.5">
                                 <span className="text-[15px] font-semibold text-[#111111]">{svc.label}</span>
                                 <span className="text-[13px] text-[#A09A94] leading-snug pr-4">{svc.description}</span>
                              </div>
                           </div>
                           <div className="flex items-center gap-2 shrink-0 pt-1">
                              <span className="text-[15px] font-bold text-[#111111]">{svc.currency} {svc.price}</span>
                              <ChevronRight size={18} color="#CFCFD4" />
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </section>

            <section className="px-5 mb-10 space-y-4">
               <div className="flex justify-between items-center">
                  <h3 className="text-[15px] font-semibold text-[#111] ml-1">Reviews ({provider.reviewCount})</h3>
                  <button onClick={() => onNavigate('reviews')} className="text-[#E85D2A] text-[14px] font-semibold flex items-center gap-1 active:opacity-70">
                    View all <ChevronRight size={16}/>
                  </button>
               </div>
               <div className="space-y-3">
                  {provider.reviews.map(r => (
                     <div key={r.id} className="p-4 bg-[#F3EFEB] border border-[#EDE8E2] rounded-[16px]">
                        <div className="flex justify-between items-start mb-2">
                           <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < Math.floor(r.rating) ? "#E85D2A" : "transparent"} color={i < Math.floor(r.rating) ? "#E85D2A" : "#E5E5E5"} />)}
                           </div>
                           <span className="text-[13px] font-semibold text-[#A09A94]">{r.rating.toFixed(1)}</span>
                        </div>
                        <div className="text-[14px] text-[#111111] font-semibold mb-1">{r.author} <span className="text-[13px] text-[#A09A94] font-normal mx-1">·</span> <span className="text-[13px] text-[#A09A94] font-normal">{r.date}</span></div>
                        <p className="text-[14px] text-[#A09A94] line-clamp-2 leading-relaxed">{r.text}</p>
                     </div>
                  ))}
               </div>
            </section>

            <section className="px-5 mb-10 space-y-4">
               <h3 className="text-[15px] font-semibold text-[#111] ml-1">Availability</h3>
               <div className="p-5 bg-[#F3EFEB] border border-[#EDE8E2] rounded-[20px]">
                  <div className="flex justify-between items-center mb-5">
                     <span className="text-[14px] font-bold text-[#111111]">February 2026</span>
                     <div className="flex gap-3">
                        <ChevronLeft size={16} color="#CFCFD4" className="cursor-not-allowed"/>
                        <ChevronRight size={16} color="#111111" />
                     </div>
                  </div>
                  <div className="flex justify-between text-center mb-3">
                     {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="text-[11px] font-semibold text-[#A09A94] w-8">{d}</span>)}
                  </div>
                  <div className="flex justify-between text-center">
                     {[22, 23, 24, 25, 26, 27, 28].map(day => {
                        const dateStr = `2026-02-${day}`;
                        const isAvailable = provider.availability[dateStr]?.available;
                        return (
                           <div key={day} className="flex flex-col items-center gap-1.5 w-8">
                              <span className="text-[15px] font-medium text-[#111111]">{day}</span>
                              <div className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-[#E85D2A]' : 'bg-[#E5E5E5]'}`} />
                           </div>
                        );
                     })}
                  </div>
                  <Divider spacing="medium" className="my-5" />
                  <div className="flex justify-between items-center">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#E85D2A]"/><span className="text-[12px] font-semibold text-[#A09A94]">Available</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#E5E5E5]"/><span className="text-[12px] font-semibold text-[#A09A94]">Booked</span></div>
                     </div>
                     <button onClick={() => setCalendarSheet(true)} className="text-[#E85D2A] text-[13px] font-semibold active:opacity-70">Check full schedule →</button>
                  </div>
               </div>
            </section>

            <section className="space-y-4 mb-10">
               <h3 className="text-[15px] font-semibold text-[#111] ml-6">Photos</h3>
               <div className="flex gap-3 overflow-x-auto custom-scrollbar px-5 pb-2">
                  {provider.gallery.map((img, i) => (
                     <button key={i} onClick={() => setGalleryViewer(i)} className="shrink-0 active:scale-[0.98] transition-transform">
                        <img src={img} className="w-[140px] h-[140px] rounded-[16px] object-cover border border-[#EDE8E2]" alt={`Gallery ${i+1}`}/>
                     </button>
                  ))}
               </div>
            </section>

            <section className="px-5 space-y-4">
               <h3 className="text-[15px] font-semibold text-[#111] ml-1">Verified Information</h3>
               <div className="bg-[#F3EFEB] border border-[#EDE8E2] rounded-[20px] p-2">
                  {provider.certifications.map((cert, i) => (
                     <div key={i} onClick={() => setCertSheet(cert)} className="flex items-center gap-3 px-3 py-3 active:bg-[#EDE8E2] cursor-pointer rounded-[14px] transition-colors">
                        <CheckCircle2 size={20} className="text-[#A09A94] shrink-0" />
                        <span className="text-[15px] font-medium text-[#111111] flex-1">{cert.label}</span>
                        <span className="text-[12px] text-[#A09A94] shrink-0 font-medium">{cert.verifiedDate ? new Date(cert.verifiedDate).toLocaleDateString('en-US', {month:'short', year:'numeric'}) : ''}</span>
                     </div>
                  ))}
               </div>
            </section>
       </div>

       <div className="absolute bottom-8 left-5 right-5 z-40 pointer-events-none">
           <div className="pointer-events-auto bg-[#FBF9F7]/95 backdrop-blur-xl border border-[#EDE8E2] rounded-[24px] p-2 pl-6 flex justify-between items-center">
               <div className="flex flex-col justify-center">
                  <span className="text-[12px] text-[#A09A94] font-medium leading-tight mb-0.5">Book from</span>
                  <span className="text-[16px] font-bold text-[#111111] leading-tight">CHF 45</span>
               </div>
               <button 
                 className="!w-auto !py-3.5 !px-6 !rounded-[18px] bg-[#E85D2A] text-white font-semibold active:scale-95 transition-all"
                 onClick={() => onNavigate('booking', { providerId: provider.id, source: 'provider_profile' })}
               >
                 Book {provider.name}
               </button>
           </div>
       </div>

       <CardModal isOpen={menuSheet} onClose={() => setMenuSheet(false)} title="Options">
          <div className="space-y-1 pb-4 pt-2">
             <OptionRow icon={Share} label="Share Profile" onClick={() => setMenuSheet(false)} />
             <OptionRow icon={Star} label="Save for later" onClick={() => setMenuSheet(false)} />
             <OptionRow icon={AlertTriangle} label="Report Issue" danger onClick={() => setMenuSheet(false)} />
          </div>
       </CardModal>

       <CardModal isOpen={calendarSheet} onClose={() => setCalendarSheet(false)} title="Full Availability">
          <div className="py-4 space-y-6">
             <div className="bg-[#F3EFEB] w-full rounded-[20px] h-[300px] flex items-center justify-center border border-[#EDE8E2]">
                <span className="text-[#A09A94] text-[14px] font-medium">Full month calendar grid</span>
             </div>
             <Button variant="primary" onClick={() => setCalendarSheet(false)}>Close</Button>
          </div>
       </CardModal>

       <CardModal isOpen={!!certSheet} onClose={() => setCertSheet(null)} title="Certification">
          {certSheet && (
             <div className="py-4 space-y-6">
                <div className="flex items-center gap-4">
                   <div className="w-14 h-14 bg-[#F3EFEB] rounded-[16px] flex items-center justify-center shrink-0">
                      <CheckCircle2 size={26} className="text-[#A09A94]" />
                   </div>
                   <div>
                      <h3 className="text-[18px] font-bold text-[#111111]">{certSheet.label}</h3>
                      <p className="text-[14px] text-[#A09A94] font-semibold flex items-center gap-1 mt-0.5"><CheckCircle2 size={14}/> Verified via FYLOS</p>
                   </div>
                </div>
                <div className="space-y-4 bg-[#F3EFEB] p-5 rounded-[20px] border border-[#EDE8E2]">
                   <div className="flex justify-between items-center">
                      <span className="text-[14px] text-[#A09A94]">Date Verified</span>
                      <span className="text-[14px] font-semibold text-[#111111]">{new Date(certSheet.verifiedDate).toLocaleDateString('en-US', {month:'long', year:'numeric'})}</span>
                   </div>
                   {certSheet.expiryDate && (
                      <div className="flex justify-between items-center">
                         <span className="text-[14px] text-[#A09A94]">Valid Until</span>
                         <span className="text-[14px] font-semibold text-[#111111]">{new Date(certSheet.expiryDate).toLocaleDateString('en-US', {month:'long', year:'numeric'})}</span>
                      </div>
                   )}
                   {certSheet.provider && (
                      <div className="flex justify-between items-center">
                         <span className="text-[14px] text-[#A09A94]">Issuer</span>
                         <span className="text-[14px] font-semibold text-[#111111] truncate max-w-[180px] text-right">{certSheet.provider}</span>
                      </div>
                   )}
                </div>
                <Button variant="primary" onClick={() => setCertSheet(null)}>Done</Button>
             </div>
          )}
       </CardModal>

       {galleryViewer !== null && (
         <div className="absolute inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-5 pt-14 text-white">
               <button onClick={() => setGalleryViewer(null)} className="p-2 -ml-2 active:opacity-70"><X size={24} color="white"/></button>
               <span className="text-[15px] font-semibold">{galleryViewer + 1} / {provider.gallery.length}</span>
               <div className="w-10"></div>
            </div>
            <div className="flex-1 flex items-center justify-center overflow-hidden pb-10">
               <img src={provider.gallery[galleryViewer]} className="w-full h-auto max-h-full object-contain" alt="Fullscreen View" />
            </div>
         </div>
       )}
    </div>
  );
};

const ReviewsScreen = ({ provider, onBack }) => {
  return (
    <div className="absolute inset-0 bg-[#F7F7F8] z-50 overflow-hidden flex flex-col">
       <header className="flex-none pt-14 pb-4 px-5 flex items-center bg-[#FFFFFF]/95 backdrop-blur-md z-10 sticky top-0 border-b border-black/[0.04]">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-[#F7F7F8] border border-black/[0.04] rounded-full active:scale-95 transition-all mr-4"><ChevronLeft size={20}/></button>
          <h2 className="text-[17px] font-semibold text-[#111111]">All Reviews</h2>
       </header>
       <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
          <Card className="!p-6">
             <div className="flex items-center gap-5">
                <div className="text-[48px] font-bold text-[#111111] leading-none">{provider.rating}</div>
                <div className="flex flex-col gap-1.5">
                   <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FF6B35" color="#FF6B35" />)}
                   </div>
                   <span className="text-[14px] font-medium text-[#6E6E73]">Based on {provider.reviewCount} reviews</span>
                </div>
             </div>
          </Card>
          <div className="space-y-3">
             {provider.reviews.map((r, i) => (
                <Card key={i} className="!p-5">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <Avatar src={r.authorPhoto} size={40} />
                         <div className="flex flex-col">
                            <span className="text-[15px] font-bold text-[#111111]">{r.author}</span>
                            <span className="text-[12px] font-medium text-[#8E8E93]">{r.date}</span>
                         </div>
                      </div>
                      <div className="flex gap-0.5">
                         {[...Array(5)].map((_, idx) => <Star key={idx} size={12} fill={idx < Math.floor(r.rating) ? "#FF6B35" : "transparent"} color={idx < Math.floor(r.rating) ? "#FF6B35" : "#E5E5E5"} />)}
                      </div>
                   </div>
                   <p className="text-[15px] text-[#111111] leading-relaxed opacity-95">{r.text}</p>
                </Card>
             ))}
          </div>
       </div>
    </div>
  );
};

const WalkingScreen = ({ onBack, petsData }) => {
  const [activeSort, setActiveSort] = useState('Recommended');
  const [activePetId, setActivePetId] = useState(petsData[0]?.id || 'p1');
  const [isPetSheetOpen, setIsPetSheetOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    location: '', minPrice: '', maxPrice: '', availability: 'Anytime', minRating: 0, certs: [], experience: 'Any'
  });
  const [appliedFilters, setAppliedFilters] = useState({
    location: '', minPrice: '', maxPrice: '', availability: 'Anytime', minRating: 0, certs: [], experience: 'Any'
  });
  
  const [visibleCount, setVisibleCount] = useState(10);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisibleCount(prev => prev + 5);
    }, { threshold: 0.1 });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setIsFilterSheetOpen(false);
    setVisibleCount(10);
  };

  const handleClearFilters = () => {
    const cleared = { location: '', minPrice: '', maxPrice: '', availability: 'Anytime', minRating: 0, certs: [], experience: 'Any' };
    setFilters(cleared);
    setAppliedFilters(cleared);
    setIsFilterSheetOpen(false);
    setVisibleCount(10);
  };

  const removeFilter = (key) => {
    const newFilters = { ...appliedFilters };
    if (key === 'certs') newFilters.certs = [];
    else if (key === 'availability') newFilters.availability = 'Anytime';
    else if (key === 'experience') newFilters.experience = 'Any';
    else if (key === 'minRating') newFilters.minRating = 0;
    else newFilters[key] = '';
    if (!newFilters.certs) newFilters.certs = [];
    setFilters(newFilters);
    setAppliedFilters(newFilters);
  };

  const activePet = petsData.find(p => p.id === activePetId) || petsData[0];

  const filterChips = [];
  if (appliedFilters.location) filterChips.push({ key: 'location', label: `Location: ${appliedFilters.location}` });
  if (appliedFilters.availability && appliedFilters.availability !== 'Anytime') filterChips.push({ key: 'availability', label: appliedFilters.availability });
  if (appliedFilters.minRating > 0) filterChips.push({ key: 'minRating', label: `Rating: ${appliedFilters.minRating}+` });
  if (appliedFilters.minPrice || appliedFilters.maxPrice) {
    filterChips.push({ key: 'price', label: `CHF ${appliedFilters.minPrice || '0'}-${appliedFilters.maxPrice || '∞'}` });
  }
  if (appliedFilters.experience && appliedFilters.experience !== 'Any') filterChips.push({ key: 'experience', label: `Exp: ${appliedFilters.experience}` });
  if (appliedFilters.certs) {
    appliedFilters.certs.forEach(cert => filterChips.push({ key: 'certs', label: cert }));
  }

  let processedWalkers = MOCK_WALKERS.filter(w => {
    if (appliedFilters.location && !w.location.toLowerCase().includes(appliedFilters.location.toLowerCase())) return false;
    if (appliedFilters.minPrice && w.price < parseInt(appliedFilters.minPrice)) return false;
    if (appliedFilters.maxPrice && w.price > parseInt(appliedFilters.maxPrice)) return false;
    if (appliedFilters.minRating && w.rating < appliedFilters.minRating) return false;
    if (appliedFilters.availability && appliedFilters.availability !== 'Anytime' && appliedFilters.availability !== 'This Week') {
      if (appliedFilters.availability === 'Today' && w.availability !== 'today') return false;
    }
    if (appliedFilters.experience === '1+ years' && w.experience < 1) return false;
    if (appliedFilters.experience === '3+ years' && w.experience < 3) return false;
    if (appliedFilters.experience === '5+ years' && w.experience < 5) return false;
    if (appliedFilters.certs && appliedFilters.certs.length > 0) {
      if (!appliedFilters.certs.every(c => w.certs.includes(c))) return false;
    }
    return true;
  });

  processedWalkers.sort((a, b) => {
    if (activeSort === 'Price: Low') return a.price - b.price;
    if (activeSort === 'Price: High') return b.price - a.price;
    if (activeSort === 'Top Rated') return b.rating - a.rating;
    if (activeSort === 'Available Now') {
      const getVal = avail => avail === 'today' ? 1 : avail === 'tomorrow' ? 2 : 3;
      return getVal(a.availability) - getVal(b.availability);
    }
    return (b.rating * 0.5 + b.walks * 0.01) - (a.rating * 0.5 + a.walks * 0.01);
  });

  const activeFilterCount = filterChips.length;

  return (
    <>
      <Header 
        title="Walking" 
        variant="detail" 
        onBack={onBack}
        rightActions={
          <>
            <button className="w-7 h-7 flex items-center justify-center rounded-full active:bg-black/[0.04] transition-colors">
              <Search size={15} color="#111111" strokeWidth={1.5} />
            </button>
            <div className="w-[1px] h-3 bg-black/[0.08] mx-1.5" />
            <button 
              onClick={() => setIsFilterSheetOpen(true)}
              className="relative w-7 h-7 flex items-center justify-center rounded-full active:bg-black/[0.04] transition-colors"
            >
              <SlidersHorizontal size={15} color="#111111" strokeWidth={1.5} />
              {activeFilterCount > 0 && (
                <span className="absolute top-[0px] right-[0px] min-w-[12px] h-[12px] flex items-center justify-center bg-[#FF6B35] text-white text-[8px] font-bold rounded-full border border-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </>
        }
      />

      <ScreenContainer>
        {petsData.length > 1 && (
          <div className="px-5 mb-4">
            <button 
              onClick={() => setIsPetSheetOpen(true)}
              className="flex items-center gap-2 bg-[#F7F7F8] hover:bg-black/[0.04] active:bg-black/[0.08] transition-colors rounded-full px-3 py-1.5 border border-black/[0.04] w-fit"
            >
              <img src={activePet?.photo} alt={activePet?.name} className="w-5 h-5 rounded-full object-cover" />
              <span className="text-[13px] font-semibold text-[#111111]">{activePet?.name}</span>
              <span className="text-[13px] text-[#8E8E93]">· {activePet?.breed}</span>
              <ChevronDown size={14} className="text-[#8E8E93] ml-1" />
            </button>
          </div>
        )}

        <div className="flex gap-2.5 overflow-x-auto custom-scrollbar px-5 pb-4">
          {WALKING_SORTS.map(s => (
            <button 
              key={s}
              onClick={() => setActiveSort(s)}
              className={`px-4 py-2 rounded-full text-[14px] font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${activeSort === s ? 'bg-[#FFF4EF] text-[#FF6B35] border border-[#FF6B35]/20' : 'bg-[#FFFFFF] text-[#6E6E73] border border-black/[0.06] hover:bg-[#F7F7F8]'}`}
            >
              {s}
            </button>
          ))}
        </div>

        {filterChips.length > 0 && (
          <div className="flex flex-wrap gap-2 px-5 pb-4">
            {filterChips.map((chip, idx) => (
              <div key={idx} className="flex items-center gap-1.5 bg-[#F7F7F8] border border-black/[0.06] text-[#111111] px-3 py-1.5 rounded-full text-[13px] font-medium">
                {chip.label}
                <button onClick={() => removeFilter(chip.key)} className="p-0.5 rounded-full hover:bg-black/5 active:bg-black/10 text-[#FF6B35]">
                  <X size={12} strokeWidth={3} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="px-5 space-y-5 pb-24">
          {processedWalkers.length === 0 ? (
            <EmptyState 
              icon={Search} 
              title="No walkers found" 
              description="Try adjusting your filters or search in a different area."
              actionLabel="Clear Filters"
              onAction={handleClearFilters}
            />
          ) : (
            processedWalkers.slice(0, visibleCount).map((provider) => {
              const availabilityStyles = {
                'today': { bg: 'bg-[#F7F7F8] border border-black/[0.05]', text: 'text-[#6E6E73]', icon: CheckCircle2, label: 'Available today' },
                'tomorrow': { bg: 'bg-[#F7F7F8] border border-black/[0.05]', text: 'text-[#6E6E73]', icon: Clock, label: 'Next: Tomorrow' },
                'this-week': { bg: 'bg-[#F7F7F8] border border-black/[0.05]', text: 'text-[#6E6E73]', icon: Calendar, label: 'Available this week' },
                'booked': { bg: 'bg-[#F7F7F8] border border-black/[0.05]', text: 'text-[#8E8E93]', icon: AlertCircle, label: 'Fully booked' }
              };
              const avail = availabilityStyles[provider.availability];
              const AvailIcon = avail.icon;

              return (
                <Card key={provider.id} clickable className="!p-4 border border-black/[0.04] shadow-none hover:border-black/[0.08] rounded-[20px]">
                  <div className="flex items-start gap-4 mb-3">
                    <Avatar src={provider.avatar} size={56} />
                    <div className="flex-1 min-w-0 pt-0.5">
                      <h4 className="font-semibold text-[#111111] text-[17px] truncate leading-tight">{provider.name}</h4>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Star size={12} className="fill-[#FF6B35] text-[#FF6B35]" />
                        <span className="text-[13px] font-bold text-[#111111]">{provider.rating}</span>
                        <span className="text-[13px] text-[#8E8E93]">({provider.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[14px] font-medium text-[#111111]">{provider.walks} walks</span>
                    <span className="text-[#E5E5E5]">•</span>
                    <span className="text-[14px] font-medium text-[#111111]">CHF {provider.price} · 90 min</span>
                  </div>

                  <div className={`flex items-center gap-1 mb-3 w-fit h-[22px] px-2 rounded-md ${avail.bg}`}>
                    <AvailIcon size={10} className={avail.text} strokeWidth={2.5} />
                    <span className={`text-[11px] font-medium leading-none ${avail.text}`}>{avail.label}</span>
                  </div>

                  <p className="text-[14px] text-[#6E6E73] leading-relaxed line-clamp-2 mb-4">
                    {provider.bio}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {provider.badges.slice(0, 3).map((badge, idx) => (
                      <span key={idx} className="flex items-center gap-1 h-[20px] px-1.5 bg-black/[0.03] text-[#6E6E73] text-[11px] font-medium rounded tracking-normal">
                        {badge === 'Verified' && <ShieldCheck size={10} />}
                        {badge === 'Training' && <Award size={10} />}
                        {badge}
                      </span>
                    ))}
                  </div>

                  <Button variant="secondary" fullWidth className="!py-3 border-black/[0.08]">
                    Book Now
                  </Button>
                </Card>
              );
            })
          )}
          
          {visibleCount < processedWalkers.length && (
            <div ref={loaderRef} className="py-6 flex justify-center">
              <Spinner size="small" color="grey" />
            </div>
          )}
        </div>
      </ScreenContainer>

      <div className="absolute bottom-[116px] left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <button className="bg-[#1C1C1E]/95 backdrop-blur-md border border-white/10 text-white h-[44px] px-6 min-w-[140px] rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.12)] font-medium flex items-center justify-center gap-2 active:scale-95 transition-all duration-200">
          <Zap size={15} className="fill-white" />
          <span className="text-[14px] whitespace-nowrap">Quick Book</span>
        </button>
      </div>

      <CardModal isOpen={isPetSheetOpen} onClose={() => setIsPetSheetOpen(false)} title="Select Pet">
        <div className="space-y-3 pt-2">
          {petsData.map(pet => (
            <div 
              key={pet.id} 
              onClick={() => { setActivePetId(pet.id); setIsPetSheetOpen(false); }}
              className={`flex items-center gap-4 p-4 rounded-[20px] cursor-pointer transition-all duration-200 active:scale-95 border-[1.5px] ${activePetId === pet.id ? 'border-[#FF6B35] bg-[#FFF4F0]' : 'border-transparent bg-[#F7F7F8]'}`}
            >
              <Avatar src={pet.photo} size={48} />
              <div className="flex-1">
                <h4 className="text-[16px] font-semibold text-[#111111]">{pet.name}</h4>
                <p className="text-[13px] text-[#6E6E73]">{pet.breed}</p>
              </div>
              {activePetId === pet.id && <CheckCircle2 className="text-[#FF6B35]" size={24} />}
            </div>
          ))}
        </div>
      </CardModal>

      <CardModal 
        isOpen={isFilterSheetOpen} 
        onClose={() => setIsFilterSheetOpen(false)} 
        title="Filters"
        footer={
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleClearFilters} className="flex-none w-[100px] !py-[12px] bg-[#F7F7F8] border-none text-[15px]">Clear</Button>
            <Button variant="primary" onClick={handleApplyFilters} className="flex-1 !py-[12px] shadow-none bg-[#FF6B35] hover:bg-[#E85D2A] text-[15px]">Show Results</Button>
          </div>
        }
      >
        <div className="space-y-10 pt-2">
          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Location</h4>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" size={18} />
              <input 
                type="text" 
                placeholder="City or zip code" 
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="w-full h-[52px] pl-11 pr-4 bg-[#F7F7F8] border border-transparent focus:bg-[#FFFFFF] focus:border-[#FF6B35] rounded-2xl text-[16px] outline-none transition-all"
              />
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Price Range (CHF)</h4>
            <div className="flex gap-4 items-center">
              <TextInput placeholder="Min" type="number" value={filters.minPrice} onChange={e => setFilters({...filters, minPrice: e.target.value})} />
              <div className="w-4 h-[1px] bg-[#CFCFD4] shrink-0" />
              <TextInput placeholder="Max" type="number" value={filters.maxPrice} onChange={e => setFilters({...filters, maxPrice: e.target.value})} />
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Availability</h4>
            <div className="flex flex-col gap-2">
              {['Anytime', 'Today', 'This Week'].map(opt => (
                <label key={opt} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F7F8] active:bg-[#F0F0F2] cursor-pointer transition-colors" onClick={() => setFilters({...filters, availability: opt})}>
                  <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center ${filters.availability === opt ? 'border-[#FF6B35]' : 'border-[#CFCFD4]'}`}>
                    {filters.availability === opt && <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B35]" />}
                  </div>
                  <span className="text-[15px] text-[#111111]">{opt}</span>
                </label>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Minimum Rating</h4>
            <div className="flex gap-2">
              {[3.0, 3.5, 4.0, 4.5, 5.0].map(rating => (
                <button 
                  key={rating}
                  onClick={() => setFilters({...filters, minRating: filters.minRating === rating ? 0 : rating})}
                  className={`flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl border-[1.5px] transition-all font-semibold text-[14px] ${filters.minRating === rating ? 'border-[#FF6B35] bg-[#FFF4F0] text-[#FF6B35]' : 'border-black/[0.08] bg-[#FFFFFF] text-[#111111]'}`}
                >
                  <Star size={14} className={filters.minRating === rating ? "fill-[#FF6B35]" : "fill-transparent"} />
                  {rating === 5.0 ? '5.0' : `${rating}+`}
                </button>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Experience</h4>
            <SegmentedControl 
              segments={['Any', '1+ years', '3+ years', '5+ years']} 
              activeIndex={['Any', '1+ years', '3+ years', '5+ years'].indexOf(filters.experience)}
              onChange={(idx) => setFilters({...filters, experience: ['Any', '1+ years', '3+ years', '5+ years'][idx]})}
            />
          </section>

          <section className="space-y-3">
            <h4 className="text-[14px] font-bold text-[#111111]">Certifications</h4>
            <div className="flex flex-col gap-2">
              {['Insurance Verified', 'Background Check', 'First Aid Certified', 'Professional Training'].map(cert => {
                const isChecked = filters.certs?.includes(cert) || false;
                return (
                  <label 
                    key={cert} 
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F7F7F8] active:bg-[#F0F0F2] cursor-pointer transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      const currentCerts = filters.certs || [];
                      const newCerts = isChecked ? currentCerts.filter(c => c !== cert) : [...currentCerts, cert];
                      setFilters({...filters, certs: newCerts});
                    }}
                  >
                    <div className={`w-5 h-5 rounded-[6px] border-[1.5px] flex items-center justify-center transition-colors ${isChecked ? 'bg-[#FF6B35] border-[#FF6B35]' : 'border-[#CFCFD4] bg-white'}`}>
                      {isChecked && <Check size={14} color="white" strokeWidth={3} />}
                    </div>
                    <span className="text-[15px] text-[#111111]">{cert}</span>
                  </label>
                );
              })}
            </div>
          </section>
        </div>
      </CardModal>
    </>
  );
};

const BookingFilterTabs = ({ filters, activeFilter, onChange }) => (
    <div className="relative overflow-x-auto custom-scrollbar friends-suggestions-scroll -mx-5 px-5 pb-2 pt-2">
      <div className="inline-flex items-center gap-2 min-w-max">
      {filters.map(f => {
        const isActive = activeFilter === f.id;
        const iconMap = {
          upcoming: CalendarDays,
          pending: Clock3,
          'in-progress': PersonStanding,
          completed: Check,
          cancelled: XCircle
        };
        const Icon = iconMap[f.id];
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`h-[34px] px-3.5 rounded-full inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-[12px] font-semibold active:scale-[0.96] transition-all duration-[180ms] border ${isActive ? 'bg-[#111111] text-white border-transparent' : 'bg-white/90 backdrop-blur-md text-[#6E6E73] border-black/[0.05] hover:bg-white hover:text-[#111111]'}`}
          >
            {Icon ? <Icon size={13} className={isActive ? 'text-white' : 'text-[#8E8E93]'} /> : null}
            <span>{f.label}</span>
          </button>
        );
      })}
      </div>
    </div>
);

const BookingStatusBadge = ({ status }) => {
  const configs = {
    'pending': { className: 'bg-[#F7F4EF] text-[#B07A3A] border-[#ECDDC8]', label: 'Pending' },
    'confirmed': { className: 'bg-[#EEF7F1] text-[#3F8D63] border-[#D7EBDD]', label: 'Confirmed' },
    'in-progress': { className: 'bg-[#FFF4EF] text-[#C26436] border-[#F3D8C9]', label: 'In Progress' },
    'completed': { className: 'bg-[#F3F3F5] text-[#6E6E73] border-black/[0.06]', label: 'Completed' },
    'cancelled': { className: 'bg-[#F3F3F5] text-[#8E8E93] border-black/[0.06]', label: 'Cancelled' },
    'declined': { className: 'bg-[#F3F3F5] text-[#8E8E93] border-black/[0.06]', label: 'Declined' }
  };
  const config = configs[status] || configs['completed'];
  return (
    <span className={`h-[20px] px-2.5 rounded-full text-[10px] font-semibold tracking-[0.02em] border inline-flex items-center leading-none ${config.className}`}>{config.label}</span>
  );
};

const BookingCard = ({ booking, onCancel, onOpenDetails }) => {
  const getProviderFirstName = (fullName = '') => String(fullName).trim().split(/\s+/)[0] || 'Provider';
  const getBaseServiceLabel = (serviceLabel = '') => String(serviceLabel).replace(/^\d+\s*min\s+/i, '').trim() || 'Service';
  const formatShortDate = (dateInput) => {
    const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short' }).replace(',', '');
  };
  const formatStartTime = (dateTime) => {
    if (dateTime?.time) return dateTime.time;
    if (dateTime?.start) {
      const d = new Date(dateTime.start);
      if (!Number.isNaN(d.getTime())) return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return '';
  };
  const formatBookingDateLine = (dateTime = {}) => {
    const startDate = dateTime.start ? new Date(dateTime.start) : new Date(`${dateTime.date || ''}T${dateTime.time || '00:00'}:00`);
    const dateLabel = formatShortDate(startDate);
    const startTime = formatStartTime(dateTime);
    const timeLabel = dateTime?.endTime ? `${startTime}-${dateTime.endTime}` : startTime;
    return [dateLabel, timeLabel].filter(Boolean).join(' · ');
  };
  const getRelativeDayLabel = (dateTime = {}) => {
    const startDate = dateTime.start ? new Date(dateTime.start) : new Date(`${dateTime.date || ''}T${dateTime.time || '00:00'}:00`);
    if (Number.isNaN(startDate.getTime())) return 'Upcoming';
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const target = new Date(startDate);
    target.setHours(0, 0, 0, 0);
    const diffDays = Math.round((target.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      const diffMs = startDate.getTime() - now.getTime();
      if (diffMs <= 0) return 'Today · Starts in <1h';
      const hoursLeft = diffMs / (1000 * 60 * 60);
      if (hoursLeft < 1) return 'Today · Starts in <1h';
      return `Today · Starts in ~${Math.ceil(hoursLeft)}h`;
    }
    if (diffDays === 1) return 'Tomorrow';
    return `In ${diffDays} days`;
  };
  const getHelperText = () => {
    if (booking.status === 'pending') return 'Awaiting confirmation · Expires in 18h';
    if (booking.status === 'in-progress') return `${getBaseServiceLabel(booking.service?.label)} in progress · Started ${formatStartTime(booking.dateTime) || '14:00'}`;
    if (booking.status === 'completed') return `Completed · ${formatShortDate(booking.dateTime?.start || booking.dateTime?.date)}`;
    if (booking.status === 'cancelled' || booking.status === 'declined') return `Cancelled · ${formatShortDate(booking.dateTime?.start || booking.dateTime?.date)}`;
    if (booking.status === 'confirmed') return getRelativeDayLabel(booking.dateTime);
    return booking.helper || '';
  };
  const getBookingServiceIcon = (serviceLabel = '') => {
    const label = String(serviceLabel).toLowerCase();
    if (label.includes('walk')) return PawPrint;
    if (label.includes('sitt')) return Home;
    if (label.includes('groom')) return Scissors;
    if (label.includes('train')) return Target;
    if (label.includes('vet')) return Stethoscope;
    if (label.includes('board')) return ShieldCheck;
    return Calendar;
  };
  const ServiceIcon = getBookingServiceIcon(booking.service?.label);

  const renderActions = () => {
    switch (booking.status) {
      case 'confirmed':
        return (<>
          <Button variant="secondary" size="small" fullWidth icon={MessageCircle} className="!h-[36px] !rounded-[10px]">Message</Button>
          <button onClick={() => onOpenDetails && onOpenDetails(booking)} className="w-full h-[36px] rounded-[10px] bg-[#F7F7F8] text-[14px] font-semibold text-[#111111] active:opacity-70">Details</button>
        </>);
      case 'pending':
        return (<>
          <Button variant="destructive" size="small" fullWidth className="!h-[36px] !rounded-[10px]" onClick={() => onCancel(booking.id)}>Cancel</Button>
          <button onClick={() => onOpenDetails && onOpenDetails(booking)} className="w-full h-[36px] rounded-[10px] bg-[#F7F7F8] text-[14px] font-semibold text-[#111111] active:opacity-70">Details</button>
        </>);
      case 'in-progress':
        return (<>
          <Button variant="primary" size="small" fullWidth icon={Navigation} className="!h-[36px] !rounded-[10px]">Track</Button>
          <Button variant="secondary" size="small" fullWidth icon={MessageCircle} className="!h-[36px] !rounded-[10px]">Message</Button>
        </>);
      case 'completed':
        return (<>
          <Button variant="primary" size="small" fullWidth className="!h-[36px] !rounded-[10px]">Review</Button>
          <button onClick={() => onOpenDetails && onOpenDetails(booking)} className="w-full h-[36px] rounded-[10px] bg-[#F7F7F8] text-[14px] font-semibold text-[#111111] active:opacity-70">Details</button>
        </>);
      case 'cancelled':
      case 'declined':
        return (
          <>
            <Button variant="secondary" size="small" fullWidth className="!h-[36px] !rounded-[10px]" icon={RotateCcw}>Rebook</Button>
            <button onClick={() => onOpenDetails && onOpenDetails(booking)} className="w-full h-[36px] rounded-[10px] bg-[#F7F7F8] text-[14px] font-semibold text-[#111111] active:opacity-70">Details</button>
          </>
        );
      default: return null;
    }
  };

  return (
    <Card clickable className="!px-4 !py-3.5 border border-black/[0.03] shadow-[0_6px_20px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-transform duration-200">
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F3F3F5] border border-black/[0.05] flex items-center justify-center shrink-0 self-center">
            <ServiceIcon size={14} className="text-[#6E6E73]" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h4 className="font-semibold text-[14px] text-[#111111] truncate">{booking.provider.name}</h4>
              <span className="text-[#CFCFD4]">·</span>
              <span className="flex items-center gap-0.5 shrink-0">
                <span className="text-[13px] font-semibold text-[#111111]">{booking.provider.rating}</span>
                <Star size={11} className="fill-[#FF6B35] text-[#FF6B35]" />
              </span>
            </div>
            <p className="text-[14px] font-medium text-[#111111] mt-0.5 leading-tight truncate">{getBaseServiceLabel(booking.service.label)} with {getProviderFirstName(booking.provider.name)}</p>
            <p className="text-[11px] text-[#8E8E93] mt-1 flex items-center gap-1.5 leading-none whitespace-nowrap">
              <Calendar size={12} className="text-[#A1A1A6]" />
              <span className="whitespace-nowrap">{formatBookingDateLine(booking.dateTime)}</span>
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <BookingStatusBadge status={booking.status} />
          </div>
        </div>
        {getHelperText() && (
          <p className="text-[12px] text-[#6E6E73] flex items-center gap-1.5 pl-[44px] -mt-1">
            {booking.status === 'in-progress' && <span className="w-2 h-2 rounded-full bg-[#007AFF] animate-pulse" />}
            {getHelperText()}
          </p>
        )}
        <div className="mt-0 pt-1.5 border-t border-black/[0.04]">
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2 pl-0 pr-[12px]">
            {renderActions()}
            <span className="text-[14px] font-semibold text-[#111111] whitespace-nowrap">CHF {Math.round(booking.total)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

const BookingSectionHeader = ({ title, count }) => (
  <div className="mt-4 mb-2 px-1 flex items-center justify-between">
    <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-[0.05em]">{title}</h3>
    <span className="text-[12px] font-semibold text-[#A1A1A6]">{count}</span>
  </div>
);

const BookingsScreen = ({ onOpenDetails, onBack }) => {
  const [activeFilter, setActiveFilter] = useState('upcoming');
  const [cancelSheetOpen, setCancelSheetOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const { progress: bookingsScrollY, handleScroll: handleBookingsScroll, reset: resetBookingsCollapse } = useDirectionalCollapseProgress(40, { hideFactor: 1, showFactor: 4.2, topReset: 10, snapOpenDelta: 1 });
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const chipsProgress = clamp01(bookingsScrollY / 40);
  const bookingsTopPadding = onBack ? (54 - (36 * chipsProgress)) : 110;
  const getBookingDateKey = (booking) => {
    if (booking?.dateTime?.date) return booking.dateTime.date;
    if (booking?.dateTime?.start) return booking.dateTime.start.slice(0, 10);
    return '';
  };
  const getBookingStartDate = (booking) => {
    if (booking?.dateTime?.start) return new Date(booking.dateTime.start);
    if (booking?.dateTime?.date && booking?.dateTime?.time) return new Date(`${booking.dateTime.date}T${booking.dateTime.time}:00`);
    if (booking?.dateTime?.date) return new Date(`${booking.dateTime.date}T00:00:00`);
    return new Date();
  };
  const allBookingsSorted = [...MOCK_BOOKINGS_LIST].sort((a, b) => getBookingStartDate(a) - getBookingStartDate(b));
  const bookingDateSet = new Set(allBookingsSorted.map(getBookingDateKey).filter(Boolean));
  const selectedDayBookings = allBookingsSorted.filter((b) => getBookingDateKey(b) === selectedCalendarDate);
  const monthYearLabel = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const startOfMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const firstWeekday = (startOfMonth.getDay() + 6) % 7;
  const calendarCells = Array.from({ length: firstWeekday + daysInMonth }, (_, idx) => {
    if (idx < firstWeekday) return null;
    const day = idx - firstWeekday + 1;
    const y = calendarMonth.getFullYear();
    const m = String(calendarMonth.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    const key = `${y}-${m}-${d}`;
    return { day, key };
  });
  const todayKey = (() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  })();
  const formatCalendarListTime = (booking) => {
    const start = booking?.dateTime?.time || '';
    const end = booking?.dateTime?.endTime;
    if (!start) return '';
    return end ? `${start}-${end}` : start;
  };
  const getCompactBookingTitle = (booking) => {
    const service = String(booking?.service?.label || 'Service').replace(/^\d+\s*min\s+/i, '').trim();
    const provider = String(booking?.provider?.name || '').split(/\s+/)[0] || 'Provider';
    return `${service} with ${provider}`;
  };

  useEffect(() => {
    resetBookingsCollapse();
  }, [activeFilter, resetBookingsCollapse]);

  const sortBookings = (bookings, section) => [...bookings].sort((a, b) => {
    switch(section) {
      case 'upcoming': return new Date(a.dateTime.start) - new Date(b.dateTime.start);
      case 'pending': return new Date(b.requestedAt) - new Date(a.requestedAt);
      case 'completed': return new Date(b.completedAt) - new Date(a.completedAt);
      case 'cancelled': return new Date(b.cancelledAt || b.declinedAt) - new Date(a.cancelledAt || a.declinedAt);
      default: return 0;
    }
  });

  const upcomingBookings = MOCK_BOOKINGS_LIST.filter(b => ['confirmed', 'pending'].includes(b.status));
  const pendingBookings = MOCK_BOOKINGS_LIST.filter(b => b.status === 'pending');
  const inProgressBookings = MOCK_BOOKINGS_LIST.filter(b => b.status === 'in-progress');
  const completedBookings = MOCK_BOOKINGS_LIST.filter(b => b.status === 'completed');
  const cancelledBookings = MOCK_BOOKINGS_LIST.filter(b => ['cancelled', 'declined'].includes(b.status));

  const filters = [
    { id: 'all', label: 'All', count: MOCK_BOOKINGS_LIST.length },
    { id: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
    { id: 'pending', label: 'Pending', count: pendingBookings.length },
    { id: 'in-progress', label: 'In Progress', count: inProgressBookings.length },
    { id: 'completed', label: 'Past', count: completedBookings.length },
    { id: 'cancelled', label: 'Cancelled', count: cancelledBookings.length }
  ];

  const handleCancelRequest = (id) => { setSelectedBookingId(id); setCancelSheetOpen(true); };
  const executeCancel = () => { setCancelSheetOpen(false); setTimeout(() => setSelectedBookingId(null), 300); };

  const renderBookings = () => {
    let bookingsToRender = [];
    if (activeFilter === 'upcoming') bookingsToRender = sortBookings(upcomingBookings, 'upcoming');
    else if (activeFilter === 'pending') bookingsToRender = sortBookings(pendingBookings, 'pending');
    else if (activeFilter === 'in-progress') bookingsToRender = inProgressBookings;
    else if (activeFilter === 'completed') bookingsToRender = sortBookings(completedBookings, 'completed');
    else if (activeFilter === 'cancelled') bookingsToRender = sortBookings(cancelledBookings, 'cancelled');

    if (activeFilter !== 'all' && bookingsToRender.length === 0) {
      const messages = {
        'upcoming': { title: "No upcoming bookings", desc: "You have no scheduled services.", action: "Book a Walk" },
        'pending': { title: "No pending requests", desc: "Your requests have been answered." },
        'in-progress': { title: "No walks in progress", desc: "" },
        'completed': { title: "No completed bookings yet", desc: "Your history will appear here." },
        'cancelled': { title: "No cancelled bookings", desc: "" }
      };
      const e = messages[activeFilter] || {};
      return <EmptyState icon={Calendar} title={e.title} description={e.desc} actionLabel={e.action} />;
    }

    if (activeFilter === 'all') {
      const u = sortBookings([...upcomingBookings, ...inProgressBookings], 'upcoming');
      const c = sortBookings(completedBookings, 'completed');
      const x = sortBookings(cancelledBookings, 'cancelled');
      return (
        <div className="space-y-2">
          {u.length > 0 && (<section><BookingSectionHeader title="UPCOMING" count={u.length} /><div className="space-y-4">{u.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancelRequest} onOpenDetails={onOpenDetails} />)}</div></section>)}
          {c.length > 0 && (<section><BookingSectionHeader title="COMPLETED" count={c.length} /><div className="space-y-4">{c.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancelRequest} onOpenDetails={onOpenDetails} />)}</div>{c.length > 2 && <div className="pt-6 flex justify-center pb-2"><button onClick={() => setActiveFilter('completed')} className="flex items-center gap-1.5 text-[14px] font-semibold text-[#111111] active:opacity-70 transition-opacity">View All Completed →</button></div>}</section>)}
          {x.length > 0 && (<section><BookingSectionHeader title="CANCELLED" count={x.length} /><div className="space-y-4">{x.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancelRequest} onOpenDetails={onOpenDetails} />)}</div></section>)}
        </div>
      );
    }

    return (
      <div className="space-y-4 pt-0.5">
        {bookingsToRender.map(b => <BookingCard key={b.id} booking={b} onCancel={handleCancelRequest} onOpenDetails={onOpenDetails} />)}
      </div>
    );
  };

  return (
    <>
      <ScreenContainer hidePadding onScroll={handleBookingsScroll}>
        {onBack && (
          <header className="sticky top-0 z-40 pt-14 pb-4 px-5 bg-gradient-to-b from-white/95 via-white/70 to-transparent pointer-events-none">
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <button onClick={onBack} className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-full active:scale-[0.98] transition-all">
                <ChevronLeft size={22} color="#111111" />
              </button>
              <h2 className="text-[17px] font-semibold text-[#111111]">My Bookings</h2>
              <button
                type="button"
                aria-label="Calendar"
                onClick={() => setCalendarOpen(true)}
                className="w-[44px] h-[44px] rounded-full border border-black/[0.04] bg-white/85 backdrop-blur-md text-[#6E6E73] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.035)] active:scale-[0.97] transition-all duration-200"
              >
                <CalendarDays size={17} strokeWidth={2.1} />
              </button>
            </div>
          </header>
        )}
        <div className="px-5 pb-8 flex flex-col h-full" style={{ paddingTop: `${bookingsTopPadding}px` }}>
          {renderBookings()}
        </div>
        <CardModal isOpen={cancelSheetOpen} onClose={() => setCancelSheetOpen(false)} title="Cancel request?">
          <div className="space-y-6 pt-2">
            <Text variant="body" className="text-[#6E6E73]">The walker will be notified. No charge will be made. Your hold will be released.</Text>
            <div className="flex flex-col gap-3 pt-2">
              <Button variant="destructive" size="large" onClick={executeCancel}>Cancel Request</Button>
              <Button variant="secondary" size="large" onClick={() => setCancelSheetOpen(false)}>Keep Request</Button>
            </div>
          </div>
        </CardModal>
        <CardModal isOpen={calendarOpen} onClose={() => setCalendarOpen(false)} title="Booking Calendar" lockExpanded fixedHeight="66%" bodyScrollable={false}>
          <div className="h-full flex flex-col pt-1">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="w-9 h-9 rounded-full bg-[#F7F7F8] border border-black/[0.04] text-[#6E6E73] flex items-center justify-center active:scale-[0.97] transition-all"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <h4 className="text-[15px] font-semibold text-[#111111]">{monthYearLabel}</h4>
              <button
                onClick={() => setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="w-9 h-9 rounded-full bg-[#F7F7F8] border border-black/[0.04] text-[#6E6E73] flex items-center justify-center active:scale-[0.97] transition-all"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-y-2 text-center">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                <div key={`${d}-${idx}`} className="text-[11px] font-semibold text-[#A1A1A6]">{d}</div>
              ))}
              {calendarCells.map((cell, idx) => {
                if (!cell) return <div key={`empty-${idx}`} />;
                const isSelected = cell.key === selectedCalendarDate;
                const hasBooking = bookingDateSet.has(cell.key);
                const isToday = cell.key === todayKey;
                return (
                  <button
                    key={cell.key}
                    onClick={() => setSelectedCalendarDate(cell.key)}
                    className={`relative w-9 h-9 mx-auto rounded-full text-[13px] font-semibold transition-all active:scale-[0.97] ${isSelected ? 'bg-[#111111] text-white' : isToday ? 'bg-[#F3F3F5] text-[#111111]' : 'text-[#6E6E73] hover:bg-[#F7F7F8]'}`}
                  >
                    {cell.day}
                    {hasBooking && (
                      <span className={`absolute left-1/2 -translate-x-1/2 bottom-1 w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#FF6A3D]'}`} />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="pt-2 mt-2 border-t border-black/[0.05] flex-1 min-h-0 flex flex-col">
              <div className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-[0.05em] mb-2">Bookings</div>
              {selectedDayBookings.length > 0 ? (
                <div className="space-y-1.5 overflow-y-auto custom-scrollbar pr-1 flex-1 min-h-0">
                  {selectedDayBookings.map((booking) => (
                    <button
                      key={booking.id}
                      onClick={() => {
                        setCalendarOpen(false);
                        onOpenDetails?.(booking);
                      }}
                      className="w-full rounded-[12px] bg-[#F7F7F8] border border-black/[0.04] px-3.5 py-2.5 text-left active:scale-[0.99] transition-all"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[#111111] truncate">{getCompactBookingTitle(booking)}</span>
                        <span className="text-[12px] font-medium text-[#8E8E93] shrink-0">{formatCalendarListTime(booking)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#8E8E93] text-center py-3 flex-1 flex items-center justify-center">No bookings for this day.</p>
              )}
            </div>
          </div>
        </CardModal>
      </ScreenContainer>
      {onBack && (
        <div
          className="absolute top-[108px] left-0 w-full z-30 px-5 transition-[opacity,transform] duration-200"
          style={{
            opacity: 1 - chipsProgress,
            transform: `translateY(${-10 * chipsProgress}px)`,
            pointerEvents: chipsProgress > 0.96 ? 'none' : 'auto'
          }}
        >
          <BookingFilterTabs filters={filters} activeFilter={activeFilter} onChange={setActiveFilter} />
        </div>
      )}
    </>
  );
};
const ACTIVITY_NOW = new Date();
const activityDaysAgo = (days) => new Date(ACTIVITY_NOW.getTime() - days * 24 * 60 * 60 * 1000);
const formatActivityRelativeTime = (date) => {
  const diffInMinutes = Math.floor((ACTIVITY_NOW - date) / (1000 * 60));
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const getActivityTypeIcon = (type) => {
  if (type === 'walk') return PawPrint;
  if (type === 'medication') return Pill;
  if (type === 'photo') return Camera;
  if (type === 'weight') return Scale;
  return Stethoscope;
};

const MY_ACTIVITIES = [
  { id: '1', type: 'walk', timestamp: activityDaysAgo(0).setHours(14, 30), duration: '90 min', provider: 'Lukas F.', location: 'Zurichhorn Park' },
  { id: '2', type: 'medication', timestamp: activityDaysAgo(0).setHours(9, 0), medName: 'Apoquel (16mg)', notes: 'Daily medication' },
  { id: '3', type: 'photo', timestamp: activityDaysAgo(1).setHours(16, 20), photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400&h=400', caption: 'Playing in the snow!' },
  { id: '4', type: 'weight', timestamp: activityDaysAgo(2).setHours(10, 0), weight: 28, status: 'healthy', range: '26-29 kg' },
  { id: '5', type: 'vet-visit', timestamp: activityDaysAgo(8).setHours(10, 0), reason: 'Annual Checkup', vetName: 'Dr. Sarah Keller' }
];
const FRIENDS_ACTIVITIES = [
  { id: 'f1', type: 'photo', friendName: 'Max', breed: 'French Bulldog', ownerAvatar: 'https://i.pravatar.cc/120?u=fylos-friend-1', timestamp: activityDaysAgo(0).setHours(11, 20), photoUrl: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=400&h=400', caption: 'Morning zoomies!' },
  { id: 'f2', type: 'check-in', friendName: 'Bella', breed: 'Labrador', ownerAvatar: 'https://i.pravatar.cc/120?u=fylos-friend-2', timestamp: activityDaysAgo(0).setHours(9, 15), placeName: 'Rieterpark', placeType: 'Dog Park' },
  { id: 'f3', type: 'playdate', friendName: 'Charlie', breed: 'Beagle', ownerAvatar: 'https://i.pravatar.cc/120?u=fylos-friend-3', timestamp: activityDaysAgo(1).setHours(14, 0), dateStr: 'Saturday, 10:00 AM', placeName: 'Zurichhorn Park', attendees: 3 },
  { id: 'f4', type: 'milestone', friendName: 'Rocky', breed: 'Shiba Inu', ownerAvatar: 'https://i.pravatar.cc/120?u=fylos-friend-4', timestamp: activityDaysAgo(2).setHours(16, 30), title: 'Graduated Puppy School' }
];
const ACTIVITY_FRIEND_DATA = {
  friends: [
    { id: 'friendship_001', userId: 'user_002', petId: 'pet_002', petName: 'Tao', petBreed: 'French Bulldog', petPhoto: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=150&h=150', ownerName: "Tao's owner", distance: 1.2, friendsSince: 'Feb 2026', lastActive: '2h ago', age: 2, contextPetIds: ['p1', 'p2'] },
    { id: 'friendship_002', userId: 'user_003', petId: 'pet_003', petName: 'Bella', petBreed: 'Labrador', petPhoto: 'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?auto=format&fit=crop&q=80&w=150&h=150', ownerName: "Bella's owner", distance: 2.3, friendsSince: 'Jan 2026', lastActive: '1d ago', age: 4, contextPetIds: ['p1'] },
    { id: 'friendship_003', userId: 'user_004', petId: 'pet_004', petName: 'Charlie', petBreed: 'Beagle', petPhoto: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=150&h=150', ownerName: "Charlie's owner", distance: 2.0, friendsSince: 'Jan 2026', lastActive: '5h ago', age: 3, contextPetIds: ['p2'] },
    { id: 'friendship_004', userId: 'user_005', petId: 'pet_005', petName: 'Rocky', petBreed: 'Shiba Inu', petPhoto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150&h=150', ownerName: "Rocky's owner", distance: 3.1, friendsSince: 'Dec 2025', lastActive: '2d ago', age: 4, contextPetIds: ['p1', 'p2'] },
    { id: 'friendship_005', userId: 'user_006', petId: 'pet_006', petName: 'Daisy', petBreed: 'Golden Retriever', petPhoto: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150', ownerName: "Daisy's owner", distance: 1.8, friendsSince: 'Dec 2025', lastActive: '3h ago', age: 3, contextPetIds: ['p1'] },
    { id: 'friendship_006', userId: 'user_007', petId: 'pet_007', petName: 'Milo', petBreed: 'Labrador', petPhoto: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=150&h=150', ownerName: "Milo's owner", distance: 2.5, friendsSince: 'Nov 2025', lastActive: '1h ago', age: 5, contextPetIds: ['p2'] },
    { id: 'friendship_008', userId: 'user_008', petId: 'pet_008', petName: 'Luna', petBreed: 'Cocker Spaniel', petPhoto: 'https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&q=80&w=150&h=150', ownerName: "Luna's owner", distance: 1.6, friendsSince: 'Nov 2025', lastActive: '4h ago', age: 2, contextPetIds: ['p1'] },
    { id: 'friendship_009', userId: 'user_009', petId: 'pet_009', petName: 'Nori', petBreed: 'Pomeranian', petPhoto: 'https://images.unsplash.com/photo-1581888227599-779811939961?auto=format&fit=crop&q=80&w=150&h=150', ownerName: "Nori's owner", distance: 0.9, friendsSince: 'Oct 2025', lastActive: 'Just now', age: 2, contextPetIds: ['p2'] }
  ],
  receivedRequests: [
    { id: 'request_001', fromUserId: 'user_010', fromPetId: 'pet_010', fromPetName: 'Charlie', fromPetBreed: 'Beagle', ownerName: "Charlie's owner", fromPetPhoto: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=150&h=150', timeAgo: '2h ago', distance: 2.0, contextPetIds: ['p1'] },
    { id: 'request_002', fromUserId: 'user_011', fromPetId: 'pet_011', fromPetName: 'Kobe', fromPetBreed: 'Border Collie', ownerName: "Kobe's owner", fromPetPhoto: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=150&h=150', timeAgo: '5h ago', distance: 1.4, contextPetIds: ['p2'] },
    { id: 'request_003', fromUserId: 'user_018', fromPetId: 'pet_018', fromPetName: 'Bruno', fromPetBreed: 'German Shepherd', ownerName: "Bruno's owner", fromPetPhoto: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=150&h=150', timeAgo: '1d ago', distance: 3.2, contextPetIds: ['p1'] }
  ],
  sentRequests: [
    { id: 'request_002', toUserId: 'user_005', toPetId: 'pet_005', toPetName: 'Rocky', toPetBreed: 'Shiba Inu', ownerName: "Rocky's owner", toPetPhoto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=150&h=150', timeAgo: '3 days ago' }
  ],
  suggestions: [
    { id: 'suggestion_001', userId: 'user_012', petId: 'pet_012', petName: 'Daisy', petBreed: 'Golden Retriever', ownerName: "Daisy's owner", petPhoto: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150', distance: 1.8, matchScore: 92, reasons: ['Similar routine nearby'], contextPetIds: ['p1'] },
    { id: 'suggestion_002', userId: 'user_013', petId: 'pet_013', petName: 'Milo', petBreed: 'Labrador', ownerName: "Milo's owner", petPhoto: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=150&h=150', distance: 2.5, matchScore: 78, reasons: ['Shared walking route'], contextPetIds: ['p2'] },
    { id: 'suggestion_003', userId: 'user_014', petId: 'pet_014', petName: 'Bruno', petBreed: 'German Shepherd', ownerName: "Bruno's owner", petPhoto: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=150&h=150', distance: 3.2, matchScore: 74, reasons: ['Evening activity match'], contextPetIds: ['p1', 'p2'] },
    { id: 'suggestion_004', userId: 'user_015', petId: 'pet_015', petName: 'Loki', petBreed: 'Whippet', ownerName: "Loki's owner", petPhoto: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80&w=150&h=150', distance: 1.1, matchScore: 88, reasons: ['Near your usual park'], contextPetIds: ['p2'] },
    { id: 'suggestion_005', userId: 'user_016', petId: 'pet_016', petName: 'Nala', petBreed: 'Labradoodle', ownerName: "Nala's owner", petPhoto: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?auto=format&fit=crop&q=80&w=150&h=150', distance: 2.0, matchScore: 83, reasons: ['Friendly social profile'], contextPetIds: ['p1'] },
    { id: 'suggestion_006', userId: 'user_017', petId: 'pet_017', petName: 'Coco', petBreed: 'Corgi', ownerName: "Coco's owner", petPhoto: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=150&h=150', distance: 2.9, matchScore: 76, reasons: ['Weekend playgroup overlap'], contextPetIds: ['p1', 'p2'] }
  ]
};
const ACTIVITY_PLAYDATE_DATA = {
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
const formatActivityDateStr = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
const ACTIVITY_SOCIAL_FEED = [
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
    summary: 'Walk together completed with Charlie',
    photoUrl: null,
    likesCount: 2,
    likedByMe: false,
    likersPreview: 'Leo, Tao',
    contextPetIds: ['p1', 'p2'],
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
    summary: 'Walk together with Zyon completed',
    photoUrl: null,
    likesCount: 1,
    likedByMe: false,
    likersPreview: 'Zyon',
    contextPetIds: ['p2'],
    likers: [{ id: 'l11', petName: 'Zyon', breed: 'Belgian Malinois', timeAgo: '1w ago', avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?auto=format&fit=crop&q=80&w=150&h=150' }]
  }
];
const ACTIVITY_NOTIFICATIONS = [
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

const ActivityBottomSheet = ({ isOpen, onClose, title, children }) => (
  <CardModal isOpen={isOpen} onClose={onClose} title={title}>{children}</CardModal>
);

const ActivityModeControl = ({ modes, activeMode, onChange }) => {
  const activeIndex = modes.findIndex(m => m.id === activeMode);
  return (
    <div className="px-5 pt-0 pb-2 bg-transparent">
      <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-black/[0.04] relative">
        <div className="absolute top-1.5 bottom-1.5 bg-[#111111] rounded-full transition-all duration-[300ms]" style={{ width: `calc(${100 / modes.length}% - 12px)`, left: `calc(${(100 / modes.length) * activeIndex}% + 6px)`, transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }} />
        {modes.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button key={mode.id} onClick={() => onChange(mode.id)} className={`relative z-10 flex-1 py-1.5 text-[13px] font-semibold transition-colors duration-[200ms] flex items-center justify-center gap-1.5 ${isActive ? 'text-white' : 'text-[#8E8E93] hover:text-[#111111]'}`}>
              {mode.label}
              {mode.badge && <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/80' : 'bg-[#FF6A3D]'}`} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const ActivitySubScreenPortal = ({ isOpen, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timer = setTimeout(() => setRender(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!render) return null;

  return (
    <div className={`absolute inset-0 bg-[#F7F7F8] z-[60] flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.1)] transition-transform duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'}`} style={{ transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)' }}>
      {children}
    </div>
  );
};

const ActivityFeedPostCard = ({ post, onLike, onViewLikes }) => {
  const [heartAnimating, setHeartAnimating] = useState(false);
  const imageSrc = Array.isArray(post.photoUrls) && post.photoUrls.length > 0 ? post.photoUrls[0] : post.photoUrl;
  const getActivityLabel = () => {
    if (post.summary) return post.summary;
    if (post.type === 'photo') return 'Photo added';
    if (post.type === 'check-in') return 'Check-in completed';
    if (post.type === 'walk' || post.type === 'walk-together') return 'Walk completed';
    if (post.type === 'playdate-event') return 'Playdate scheduled';
    return 'Activity update';
  };
  const handleLikeTap = () => {
    setHeartAnimating(true);
    onLike(post.id);
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(8);
    setTimeout(() => setHeartAnimating(false), 220);
  };
  return (
    <div className="bg-[#FFFFFF] rounded-[20px] p-4 border border-black/[0.04] shadow-sm mb-3.5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img src={post.avatar} alt={post.petName} className="w-10 h-10 rounded-full object-cover bg-[#F7F7F8]" loading="lazy" decoding="async" />
          <div>
            <h4 className="text-[15px] font-semibold text-[#111111] leading-tight">{post.ownerName}</h4>
            <p className="text-[12px] text-[#8E8E93] mt-0.5 leading-none">{post.petName && post.petName !== 'System' ? `with ${post.petName} • ${post.timeAgo}` : post.timeAgo}</p>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#8E8E93] active:opacity-70"><MoreVertical size={15} /></button>
      </div>

      {imageSrc && (
        <div className="mb-3">
          <img src={imageSrc} alt="activity" className="w-full aspect-square object-cover rounded-[16px] shadow-[0_2px_10px_rgba(0,0,0,0.03)] bg-[#F3F3F5]" loading="lazy" decoding="async" />
        </div>
      )}

      {post.location && (
        <p className="text-[12px] text-[#8E8E93] flex items-center gap-1.5 mb-2">
          <MapPin size={12} className="text-[#A6A6AC]" />
          {post.location}
        </p>
      )}

      <div className="mb-3">
        <p className="text-[14px] font-medium text-[#111111] leading-snug">{getActivityLabel()}</p>
        {post.details && <p className="text-[12px] text-[#6E6E73] mt-1">{post.details}</p>}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-black/[0.04]">
        <div onClick={() => post.likesCount > 0 && onViewLikes(post)} className={`${post.likesCount > 0 ? 'cursor-pointer active:opacity-70' : ''}`}>
          <p className="text-[13px] font-semibold text-[#111111]">❤️ {post.likesCount}</p>
          <p className="text-[12px] text-[#8E8E93] mt-0.5">{post.likesCount > 0 ? `Liked by ${post.likersPreview}` : 'No likes yet'}</p>
        </div>
        <button onClick={handleLikeTap} className={`h-9 min-w-[42px] px-3 rounded-[12px] flex items-center justify-center transition-all duration-200 ${post.likedByMe ? 'bg-[#FF6A3D]/14 text-[#FF6A3D]' : 'bg-[#F3F3F6] text-[#8E8E93]'}`}>
          <Heart size={18} fill={post.likedByMe ? 'currentColor' : 'none'} className={`${heartAnimating ? 'scale-[1.18]' : 'scale-100'} transition-transform duration-[180ms]`} />
        </button>
      </div>
    </div>
  );
};

const ActivityLikesBottomSheet = ({ isOpen, onClose, post }) => {
  if (!post) return null;
  return (
    <ActivityBottomSheet isOpen={isOpen} onClose={onClose} title="Likes">
      {post.likers.length === 0 ? (
        <div className="text-center py-10">
          <Heart size={32} className="text-[#CFCFD4] mx-auto mb-3" />
          <p className="text-[15px] font-medium text-[#111111]">No likes yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {post.likers.map((liker) => (
            <div key={liker.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={liker.avatar} alt={liker.petName} className="w-[44px] h-[44px] rounded-full object-cover bg-[#F7F7F8]" />
                <div>
                  <h4 className="text-[15px] font-semibold text-[#111111]">{liker.petName}</h4>
                  <p className="text-[13px] text-[#6E6E73]">{liker.breed} · {liker.timeAgo}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-[#CFCFD4]" />
            </div>
          ))}
        </div>
      )}
    </ActivityBottomSheet>
  );
};

const ActivityNotificationsScreen = ({ isOpen, onClose, notifications, markAsRead }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <ActivitySubScreenPortal isOpen={isOpen}>
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
        <div className="px-4 pt-14 pb-3 flex items-center justify-between bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="p-2 -ml-2 text-[#111111]"><ArrowLeft size={24} /></button>
            <h2 className="text-[18px] font-bold text-[#111111]">Notifications</h2>
          </div>
          <button onClick={() => setSettingsOpen(true)} className="p-2 -mr-2 text-[#111111]"><Settings2 size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
          {notifications.map((group) => (
            <div key={group.group} className="mb-2">
              <div className="px-5 py-3 sticky top-0 bg-[#F7F7F8]/95 backdrop-blur-sm z-10 border-b border-black/[0.02]">
                <span className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest">{group.group}</span>
              </div>
              <div className="bg-[#FFFFFF] border-y border-black/[0.04]">
                {group.items.map((item) => (
                  <div key={item.id} onClick={() => markAsRead(item.id)} className={`flex items-start gap-4 p-4 ${!item.read ? 'bg-[#FF6A3D]/5' : ''}`}>
                    <div className="relative pl-1">
                      <img src={item.petAvatar} className="w-12 h-12 rounded-full object-cover bg-[#F7F7F8]" alt="avatar" />
                      {item.type === 'like' && <div className="absolute -bottom-1 -right-1 bg-[#FF3B4A] w-5 h-5 rounded-full flex items-center justify-center border-[2px] border-white"><Heart size={10} fill="white" color="white" /></div>}
                      {item.type === 'friend-accepted' && <div className="absolute -bottom-1 -right-1 bg-[#34C759] w-5 h-5 rounded-full flex items-center justify-center border-[2px] border-white"><UserCheck size={10} color="white" /></div>}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-[15px] text-[#111111]"><span className="font-bold">{item.petName}</span> {item.text}</p>
                      <p className="text-[13px] text-[#8E8E93] mt-1">{item.time}</p>
                    </div>
                    {item.preview && <img src={item.preview} className="w-12 h-12 rounded-[8px] object-cover bg-[#F7F7F8]" alt="preview" />}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ActivitySubScreenPortal isOpen={settingsOpen}>
        <div className="flex-1 flex flex-col bg-[#F7F7F8]">
          <div className="px-4 pt-14 pb-3 flex items-center gap-3 bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
            <button onClick={() => setSettingsOpen(false)} className="p-2 -ml-2 text-[#111111]"><ArrowLeft size={24} /></button>
            <h2 className="text-[18px] font-bold text-[#111111]">Notification Settings</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
            <div className="bg-[#FFFFFF] rounded-[20px] overflow-hidden shadow-sm border border-black/[0.04]">
              {['Likes', 'Friend Requests', 'Playdate Invitations', 'Friend Activity'].map((label, i) => (
                <div key={label} className={`flex items-center justify-between p-4 ${i !== 3 ? 'border-b border-black/[0.04]' : ''}`}>
                  <span className="text-[16px] font-medium text-[#111111]">{label}</span>
                  <Toggle checked onChange={() => {}} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </ActivitySubScreenPortal>
    </ActivitySubScreenPortal>
  );
};

const ACTIVITY_INSIGHTS_DATA = {
  weeklySummary: {
    period: 'Feb 16 - Feb 22',
    walks: 5,
    totalMinutes: 450,
    trendPercent: 20,
    dailyWalks: [1, 0, 1, 2, 0, 1, 0],
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  },
  weightTrend: { current: 28, idealMin: 26, idealMax: 29 },
  medication: { thisWeekTaken: 7, streak: 45 },
  favoritePlaces: [
    { name: 'Zurichhorn Park', visits: 12 },
    { name: 'Rieterpark', visits: 5 },
    { name: 'Lindenhof', visits: 2 }
  ],
  activeTimes: { eveningShare: 35 }
};

const ActivityInsightsBarChart = ({ data, labels }) => {
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end justify-between w-full mt-4 h-24">
      {data.map((value, index) => (
        <div key={`${labels[index]}-${index}`} className="flex flex-col items-center justify-end h-full gap-2 flex-1">
          <div className="w-full px-1 max-w-[28px] h-full flex items-end justify-center">
            <div className="w-full rounded-[4px] bg-[#111111]" style={{ height: `${Math.max((value / max) * 100, 6)}%`, opacity: value === 0 ? 0.2 : 1 }} />
          </div>
          <span className="text-[11px] font-medium text-[#8E8E93]">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
};

const ActivityInsightsScreen = ({ isOpen, onClose }) => {
  const [detailOpen, setDetailOpen] = useState(false);
  return (
    <>
      <ActivitySubScreenPortal isOpen={isOpen}>
        <div className="flex-1 flex flex-col bg-[#F0F0F2]">
          <header className="px-4 pt-14 pb-3 bg-[#F7F7F8] border-b border-black/[0.04] flex items-center justify-between shrink-0">
            <button onClick={onClose} className="p-2 -ml-2 rounded-full"><ChevronLeft size={24} color="#111111" /></button>
            <h2 className="text-[17px] font-semibold text-[#111111]">Activity Insights</h2>
            <button className="p-2 -mr-2 rounded-full"><Settings size={20} color="#111111" /></button>
          </header>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-24">
            <div onClick={() => setDetailOpen(true)} className="bg-[#FFFFFF] rounded-[24px] p-5 shadow-sm border border-black/[0.04] cursor-pointer active:scale-[0.98] transition-transform">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-[20px] font-bold text-[#111111] flex items-center gap-2"><PawPrint size={18} /> {ACTIVITY_INSIGHTS_DATA.weeklySummary.walks} walks</h4>
                  <p className="text-[14px] text-[#6E6E73] mt-1">{Math.floor(ACTIVITY_INSIGHTS_DATA.weeklySummary.totalMinutes / 60)}h {ACTIVITY_INSIGHTS_DATA.weeklySummary.totalMinutes % 60}m total</p>
                </div>
                <div className="bg-[#34C759]/10 px-2.5 py-1 rounded-[10px] flex items-center gap-1">
                  <TrendingUp size={14} className="text-[#34C759]" />
                  <span className="text-[13px] font-bold text-[#34C759]">+{ACTIVITY_INSIGHTS_DATA.weeklySummary.trendPercent}%</span>
                </div>
              </div>
              <ActivityInsightsBarChart data={ACTIVITY_INSIGHTS_DATA.weeklySummary.dailyWalks} labels={ACTIVITY_INSIGHTS_DATA.weeklySummary.labels} />
              <div className="mt-4 flex items-center justify-center gap-1 text-[14px] font-semibold text-[#FF6A3D]">View Full Report <ArrowRight size={16} /></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-black/[0.04]">
                <div className="flex items-center gap-1.5 text-[#6E6E73] mb-2"><Target size={16} /> <span className="text-[13px] font-medium">Weight</span></div>
                <div className="flex items-baseline gap-1"><span className="text-[24px] font-bold text-[#111111]">{ACTIVITY_INSIGHTS_DATA.weightTrend.current}</span><span className="text-[14px] text-[#8E8E93]">kg</span></div>
                <p className="text-[12px] text-[#34C759] font-medium mt-1">Within ideal range</p>
              </div>
              <div className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-black/[0.04]">
                <div className="flex items-center gap-1.5 text-[#6E6E73] mb-2"><Activity size={16} /> <span className="text-[13px] font-medium">Medication</span></div>
                <div className="text-[24px] font-bold text-[#111111]">{ACTIVITY_INSIGHTS_DATA.medication.thisWeekTaken}/7</div>
                <p className="text-[12px] text-[#FF6A3D] font-medium mt-1 flex items-center gap-1"><Flame size={13} /> {ACTIVITY_INSIGHTS_DATA.medication.streak} day streak</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#111111] to-[#2C2C2E] rounded-[20px] p-5 text-white">
              <h4 className="text-[16px] font-bold mb-2 flex items-center gap-2"><AlertCircle size={18} className="text-[#FFCC00]" /> Actionable Insight</h4>
              <p className="text-[14px] text-white/80">Luna is most active in the evening ({ACTIVITY_INSIGHTS_DATA.activeTimes.eveningShare}% of walks). Keep a consistent weekend walk to maintain rhythm.</p>
            </div>
          </div>
        </div>
      </ActivitySubScreenPortal>

      <ActivitySubScreenPortal isOpen={detailOpen}>
        <div className="flex-1 flex flex-col bg-[#F0F0F2]">
          <header className="px-4 pt-14 pb-3 bg-[#F7F7F8] border-b border-black/[0.04] flex items-center justify-between shrink-0">
            <button onClick={() => setDetailOpen(false)} className="p-2 -ml-2 rounded-full"><ChevronLeft size={24} color="#111111" /></button>
            <h2 className="text-[17px] font-semibold text-[#111111]">Weekly Summary</h2>
            <button className="p-2 -mr-2 rounded-full"><Share size={20} color="#111111" /></button>
          </header>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4 pb-24">
            <div className="bg-[#FFFFFF] rounded-[20px] p-5 shadow-sm border border-black/[0.04]">
              <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3">{ACTIVITY_INSIGHTS_DATA.weeklySummary.period}</h4>
              <ActivityInsightsBarChart data={ACTIVITY_INSIGHTS_DATA.weeklySummary.dailyWalks} labels={ACTIVITY_INSIGHTS_DATA.weeklySummary.labels} />
            </div>
            <div className="bg-[#FFFFFF] rounded-[20px] p-5 shadow-sm border border-black/[0.04]">
              <h4 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider mb-3">Favorite Places</h4>
              <div className="space-y-2">
                {ACTIVITY_INSIGHTS_DATA.favoritePlaces.map((place) => (
                  <div key={place.name} className="flex items-center justify-between">
                    <span className="text-[15px] text-[#111111]">{place.name}</span>
                    <span className="text-[13px] text-[#6E6E73]">{place.visits} visits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ActivitySubScreenPortal>
    </>
  );
};

const MyActivityContainer = ({ isVisible, onOpenInsights }) => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [completedRows, setCompletedRows] = useState(new Set());

  const timelineSections = [
    {
      id: 'today',
      label: 'TODAY',
      prominent: true,
      rows: [
        { id: 't1', time: '08:00', type: 'medication', title: 'Morning Medication', subtitle: 'Apoquel (16mg)', action: 'complete' },
        { id: 't2', time: '14:00', type: 'walk', title: 'Afternoon Walk', subtitle: 'with Lukas F.', action: 'complete' },
        { id: 't3', time: '18:30', type: 'photo', title: 'Photo Added', subtitle: 'Leo', action: 'expand', photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=600&h=360', isNew: true }
      ]
    },
    {
      id: 'week',
      label: 'THIS WEEK',
      rows: [
        { id: 'w1', time: '3h ago', type: 'walk', title: 'Walk', subtitle: '90 min with Lukas F.', action: 'none' },
        { id: 'w2', time: '8h ago', type: 'medication', title: 'Medication', subtitle: 'Apoquel (16mg)', action: 'none' },
        { id: 'w3', time: 'Yesterday', type: 'photo', title: 'Photo', subtitle: 'Leo added a new photo', action: 'expand', photoUrl: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&q=80&w=600&h=360' },
        { id: 'w5', time: 'Yesterday', type: 'medication', title: 'Morning Medication', subtitle: 'Status: Missed', action: 'missed', isMissed: true },
        { id: 'w4', time: '2d ago', type: 'booking', title: 'Booking', subtitle: 'Walk with Lukas', action: 'expand', bookingDateTime: '2026-02-24T14:00:00+01:00', details: 'Walk with Lukas', expandActionLabel: 'View booking' }
      ]
    },
    {
      id: 'earlier',
      label: 'EARLIER',
      rows: [
        { id: 'e1', time: '4d ago', type: 'health', title: 'Vaccination Reminder', subtitle: 'Annual rabies vaccination due soon', action: 'expand', details: 'Annual rabies vaccination due soon', detailsMeta: ['Next due: Jun 14', 'Vet: Zurich Vet Clinic'], expandActionLabel: 'Open health record' },
        { id: 'e2', time: 'Last week', type: 'photo', title: 'Photo', subtitle: 'Leo added a park photo', action: 'expand', photoUrl: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&q=80&w=600&h=360' }
      ]
    }
  ];

  const getTimelineIcon = (type) => {
    if (type === 'walk') return PawPrint;
    if (type === 'medication') return Pill;
    if (type === 'photo') return Camera;
    if (type === 'booking') return Calendar;
    return HeartPulse;
  };
  const toggleExpand = (rowId) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };
  const toggleComplete = (rowId) => {
    setCompletedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  const resolveBookingDetails = (row) => {
    if (!row.bookingDateTime) return null;
    const bookingDate = new Date(row.bookingDateTime);
    const isPastBooking = Number.isFinite(bookingDate.getTime()) ? bookingDate.getTime() < Date.now() : false;
    const statusText = isPastBooking ? 'Completed' : 'Confirmed';
    const weekday = bookingDate.toLocaleDateString('en-US', { weekday: 'short' });
    const hh = String(bookingDate.getHours()).padStart(2, '0');
    const mm = String(bookingDate.getMinutes()).padStart(2, '0');
    return {
      summary: row.details || row.subtitle || 'Booking',
      metaLines: [`${weekday}, ${hh}:${mm}`, `Status: ${statusText}`],
      actionLabel: row.expandActionLabel || 'View booking'
    };
  };

  return (
    <div className={`${isVisible ? 'block' : 'hidden'}`}>
      <div className="px-5 pb-24 space-y-6">
        {timelineSections.map((section) => (
          <section key={section.id}>
            <div className="mb-3">
              {section.prominent ? (
                <h3 className="text-[17px] font-semibold text-[#111111]">Today</h3>
              ) : (
                <span className="text-[12px] font-bold text-[#8E8E93] tracking-widest uppercase">{section.label}</span>
              )}
            </div>
            <div className="space-y-0">
              {section.rows.map((row, index) => {
                const Icon = getTimelineIcon(row.type);
                const isToday = section.prominent;
                const isEarlier = section.id === 'earlier';
                const isExpandable = row.action === 'expand';
                const isExpanded = expandedRows.has(row.id);
                const isCompleted = completedRows.has(row.id);
                const showIncompleteDot = row.action === 'complete' && !isCompleted;
                const isMissed = Boolean(row.isMissed || row.action === 'missed');
                const bookingDetails = resolveBookingDetails(row);
                return (
                  <div
                    key={row.id}
                    onClick={() => isExpandable && toggleExpand(row.id)}
                    className={`py-2.5 ${index < section.rows.length - 1 ? `border-b ${isToday ? 'border-black/[0.08]' : isEarlier ? 'border-black/[0.03]' : 'border-black/[0.05]'}` : ''} ${isExpandable ? 'cursor-pointer' : ''} ${isEarlier ? 'opacity-[0.85]' : ''}`}
                  >
                    <div className={`flex items-center gap-3 ${isCompleted || isMissed ? 'opacity-70' : ''}`}>
                      <div className={`w-[64px] shrink-0 text-[12px] font-semibold tracking-[0.2px] leading-none whitespace-nowrap ${isToday ? 'text-[#76767D]' : isEarlier ? 'text-[#9A9AA0]' : 'text-[#8E8E93]/85'}`}>{row.time}</div>
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div className={`w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 ${isToday ? 'bg-[#F5F5F7]' : 'bg-[#F7F7F8]'}`}>
                          {isMissed ? <AlertTriangle size={14} className="text-[#D96852]" /> : <Icon size={15} className="text-[#6E6E73]" />}
                        </div>
                        <div className="min-w-0">
                          <div className={`text-[14px] truncate leading-none flex items-center gap-1.5 ${isToday ? 'font-semibold text-[#111111]' : 'font-medium text-[#111111]'}`}>
                            {row.title}
                            {(row.isNew || showIncompleteDot) && <span className="w-[5px] h-[5px] rounded-full bg-[#FF6A3D] shrink-0" />}
                          </div>
                          <div className={`text-[13px] truncate mt-1 ${isMissed ? 'text-[#A06A62]' : 'text-[#6E6E73]'}`}>{row.subtitle}</div>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center justify-center min-w-[40px]">
                        {row.action === 'complete' ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleComplete(row.id); }}
                            className={`w-[22px] h-[22px] rounded-full border inline-flex items-center justify-center transition-all duration-[200ms] ${isCompleted ? 'bg-[#FF6A3D] border-[#FF6A3D] scale-105' : 'bg-transparent border-black/[0.16] hover:border-[#FF6A3D]/40'}`}
                            aria-label={`Mark ${row.title} as done`}
                          >
                            {isCompleted && <Check size={13} className="text-white" strokeWidth={2.8} />}
                          </button>
                        ) : row.action === 'expand' ? (
                          <ChevronRight size={14} className={`text-[#B6B6BC] transition-transform duration-[250ms] ${isExpanded ? 'rotate-90 text-[#FF6A3D]' : ''}`} />
                        ) : isMissed ? (
                          <span className="text-[11px] font-semibold text-[#D96852]">Missed</span>
                        ) : (
                          <span className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    {isExpandable && (
                      <div
                        className="overflow-hidden transition-all duration-[250ms]"
                        style={{
                          maxHeight: isExpanded ? (row.photoUrl ? '220px' : '160px') : '0px',
                          opacity: isExpanded ? 1 : 0,
                          transform: `translateY(${isExpanded ? '0px' : '-4px'})`,
                          transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
                        }}
                      >
                        <div className="pl-[99px] pr-2 pt-2.5">
                          {row.photoUrl ? (
                            <div className="rounded-[12px] overflow-hidden bg-[#F7F7F8] border border-black/[0.04]">
                              <img src={row.photoUrl} alt={row.title} className="w-full h-[140px] object-cover" />
                            </div>
                          ) : (
                            <div className="rounded-[10px] bg-[#F7F7F8] border border-black/[0.04] px-3 py-2.5">
                              <p className="text-[12px] text-[#5D5D64] leading-[1.4]">{bookingDetails ? bookingDetails.summary : row.details}</p>
                              {(bookingDetails?.metaLines || row.detailsMeta) && (
                                <div className="mt-2 space-y-0.5">
                                  {(bookingDetails?.metaLines || row.detailsMeta).map((metaLine) => (
                                    <p key={metaLine} className="text-[11px] text-[#8E8E93] leading-[1.35]">{metaLine}</p>
                                  ))}
                                </div>
                              )}
                              {(bookingDetails?.actionLabel || row.expandActionLabel) && (
                                <button className="mt-2 text-[11px] font-semibold text-[#FF6A3D] active:opacity-70">{bookingDetails?.actionLabel || row.expandActionLabel}</button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

const FriendsActivityContainer = ({ isVisible, setGlobalBadge, selectedPetId, playdateEvents = [] }) => {
  const [currentView, setCurrentView] = useState('list');
  const [activeProfile, setActiveProfile] = useState(null);
  const [activePlaydate, setActivePlaydate] = useState(null);
  const [createPlaydateOpen, setCreatePlaydateOpen] = useState(false);
  const [likesSheetOpen, setLikesSheetOpen] = useState(false);
  const [activePostLikes, setActivePostLikes] = useState(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [friends, setFriends] = useState(ACTIVITY_FRIEND_DATA.friends);
  const [receivedReqs, setReceivedReqs] = useState(ACTIVITY_FRIEND_DATA.receivedRequests);
  const [sentReqs, setSentReqs] = useState(ACTIVITY_FRIEND_DATA.sentRequests);
  const [suggestions, setSuggestions] = useState(ACTIVITY_FRIEND_DATA.suggestions);
  const [feedPosts, setFeedPosts] = useState(ACTIVITY_SOCIAL_FEED);
  const [visiblePostsCount, setVisiblePostsCount] = useState(4);
  const [requestExits, setRequestExits] = useState({});
  const [suggestionExits, setSuggestionExits] = useState({});
  const [addedSuggestionIds, setAddedSuggestionIds] = useState({});
  const [currentRequestCardIndex, setCurrentRequestCardIndex] = useState(0);
  const [upcomingPlaydates, setUpcomingPlaydates] = useState(ACTIVITY_PLAYDATE_DATA.upcomingPlaydates);
  const [pendingPlaydates, setPendingPlaydates] = useState(ACTIVITY_PLAYDATE_DATA.pendingInvitations);
  const [completedPlaydates] = useState(ACTIVITY_PLAYDATE_DATA.completedPlaydates);
  const feedSentinelRef = useRef(null);
  const requestTouchStartXRef = useRef(null);

  useEffect(() => {
    setGlobalBadge(receivedReqs.length > 0 || pendingPlaydates.length > 0);
  }, [receivedReqs, pendingPlaydates, setGlobalBadge]);

  const handleAcceptRequest = (req) => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(8);
    setRequestExits((prev) => ({ ...prev, [req.id]: 'accept' }));
    setTimeout(() => {
      setReceivedReqs((prev) => prev.filter((r) => r.id !== req.id));
      setFriends((prev) => [{ id: `friendship_new_${Date.now()}`, userId: req.fromUserId, petId: req.fromPetId, petName: req.fromPetName, petBreed: req.fromPetBreed, petPhoto: req.fromPetPhoto, ownerName: req.ownerName, distance: req.distance || 1.5, friendsSince: 'Just now', lastActive: 'Just now', age: 3, contextPetIds: req.contextPetIds || ['p1'] }, ...prev]);
      setRequestExits((prev) => {
        const next = { ...prev };
        delete next[req.id];
        return next;
      });
    }, 240);
  };
  const handleDeclineRequest = (id) => {
    setRequestExits((prev) => ({ ...prev, [id]: 'decline' }));
    setTimeout(() => {
      setReceivedReqs((prev) => prev.filter((r) => r.id !== id));
      setRequestExits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 220);
  };
  const handleDismissSuggestion = (id) => {
    setSuggestionExits((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setSuggestions((prev) => prev.filter((s) => s.id !== id));
      setSuggestionExits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 220);
  };
  const handleSendRequest = (sugg) => {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') navigator.vibrate(8);
    setAddedSuggestionIds((prev) => ({ ...prev, [sugg.id]: true }));
    setTimeout(() => {
      setSuggestionExits((prev) => ({ ...prev, [sugg.id]: true }));
      setTimeout(() => {
        setSuggestions((prev) => prev.filter((s) => s.id !== sugg.id));
        setFriends((prev) => [{
          id: `follow_${Date.now()}`,
          userId: sugg.userId,
          petId: sugg.petId,
          petName: sugg.petName,
          petBreed: sugg.petBreed,
          petPhoto: sugg.petPhoto,
          ownerName: sugg.ownerName,
          distance: sugg.distance,
          friendsSince: 'Just now',
          lastActive: 'Just now',
          age: 2,
          contextPetIds: [selectedPetId],
          connectedViaPetId: selectedPetId
        }, ...prev]);
        setSentReqs((prev) => [{ id: `req_new_${Date.now()}`, toUserId: sugg.userId, toPetId: sugg.petId, toPetName: sugg.petName, toPetBreed: sugg.petBreed, ownerName: sugg.ownerName, toPetPhoto: sugg.petPhoto, timeAgo: 'Just now' }, ...prev]);
        setSuggestionExits((prev) => {
          const next = { ...prev };
          delete next[sugg.id];
          return next;
        });
        setAddedSuggestionIds((prev) => {
          const next = { ...prev };
          delete next[sugg.id];
          return next;
        });
      }, 220);
    }, 1000);
  };
  const handleRemoveFriend = (id) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
    setProfileMenuOpen(false);
    setCurrentView('list');
  };
  const handleAcceptPlaydate = (id) => {
    const pd = pendingPlaydates.find((p) => p.id === id);
    if (!pd) return;
    setPendingPlaydates((prev) => prev.filter((p) => p.id !== id));
    setUpcomingPlaydates((prev) => [...prev, { ...pd, invitees: pd.invitees.map((i) => (i.userId === 'user_001' ? { ...i, status: 'accepted' } : i)) }]);
  };
  const handleDeclinePlaydate = (id) => setPendingPlaydates((prev) => prev.filter((p) => p.id !== id));
  const handleToggleLike = (postId) => {
    setFeedPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const isCurrentlyLiked = post.likedByMe;
        return {
          ...post,
          likedByMe: !isCurrentlyLiked,
          likesCount: isCurrentlyLiked ? Math.max(0, post.likesCount - 1) : post.likesCount + 1,
          likersPreview: isCurrentlyLiked ? 'Bella, Charlie' : 'You, Bella, Charlie'
        };
      })
    );
  };
  const handleViewLikes = (post) => {
    setActivePostLikes(post);
    setLikesSheetOpen(true);
  };

  const activePetName = MOCK_DASHBOARD_PETS.find((pet) => pet.id === selectedPetId)?.name || MOCK_DASHBOARD_PETS[0]?.name || 'Leo';
  const byPetPerspective = (item) => !item.contextPetIds || item.contextPetIds.includes(selectedPetId);
  const filteredReceivedReqs = receivedReqs.filter(byPetPerspective);
  const filteredSuggestions = suggestions.filter(byPetPerspective);
  const filteredFriends = friends.filter(byPetPerspective);
  const filteredFeedPosts = [...playdateEvents, ...feedPosts].filter(byPetPerspective);
  const searchResults = query.length > 1 ? filteredSuggestions : [];
  const visibleFilteredFeedPosts = filteredFeedPosts.slice(0, visiblePostsCount);
  const hasMoreFeedPosts = visiblePostsCount < filteredFeedPosts.length;
  useEffect(() => {
    setVisiblePostsCount(4);
  }, [selectedPetId]);
  useEffect(() => {
    if (currentRequestCardIndex > Math.max(0, filteredReceivedReqs.length - 1)) {
      setCurrentRequestCardIndex(Math.max(0, filteredReceivedReqs.length - 1));
    }
  }, [filteredReceivedReqs.length, currentRequestCardIndex]);
  const handleRequestTouchStart = (e) => {
    requestTouchStartXRef.current = e.touches?.[0]?.clientX ?? null;
  };
  const handleRequestTouchEnd = (e) => {
    if (requestTouchStartXRef.current == null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? requestTouchStartXRef.current;
    const deltaX = endX - requestTouchStartXRef.current;
    if (Math.abs(deltaX) < 28) return;
    if (deltaX < 0 && currentRequestCardIndex < filteredReceivedReqs.length - 1) setCurrentRequestCardIndex((prev) => prev + 1);
    if (deltaX > 0 && currentRequestCardIndex > 0) setCurrentRequestCardIndex((prev) => prev - 1);
  };
  useEffect(() => {
    const sentinel = feedSentinelRef.current;
    if (!sentinel || !hasMoreFeedPosts) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setVisiblePostsCount((prev) => Math.min(prev + 3, filteredFeedPosts.length));
    }, { rootMargin: '280px 0px' });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredFeedPosts.length, hasMoreFeedPosts]);
  const renderDiscoverInline = (keySuffix) => (
    <div key={`discover-inline-${keySuffix}`} className="bg-[#FFFFFF] rounded-[16px] border border-black/[0.035] p-3.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93]">Discover</h4>
        <button onClick={() => setCurrentView('suggestions')} className="text-[12px] font-semibold text-[#FF6A3D]">See all</button>
      </div>
      <div className="flex gap-2.5 overflow-x-auto custom-scrollbar friends-suggestions-scroll snap-x snap-mandatory pb-1">
        {filteredSuggestions.slice(0, 6).map((sugg) => (
          <div key={`${keySuffix}-${sugg.id}`} className={`snap-start min-w-[132px] w-[132px] bg-[#F8F8FA] rounded-[12px] p-2.5 border border-black/[0.03] transition-all duration-200 ${suggestionExits[sugg.id] ? 'opacity-0 translate-y-1' : 'opacity-100'}`}>
            <img src={sugg.petPhoto} alt={sugg.petName} className="w-9 h-9 rounded-full object-cover bg-white mb-1.5" loading="lazy" decoding="async" />
            <p className="text-[12px] font-semibold text-[#111111] truncate">{sugg.petName}</p>
            <p className="text-[11px] text-[#8E8E93] truncate">{sugg.petBreed}</p>
            <button disabled={Boolean(addedSuggestionIds[sugg.id])} onClick={() => handleSendRequest(sugg)} className={`mt-1.5 w-full h-6 rounded-[8px] text-[10px] font-semibold active:scale-[0.98] active:opacity-90 transition-all ${addedSuggestionIds[sugg.id] ? 'bg-[#E8F8EE] text-[#2FA95F]' : 'bg-white text-[#111111] border border-black/[0.05]'}`}>{addedSuggestionIds[sugg.id] ? 'Be Fylos ✓' : 'Be Fylos'}</button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`${isVisible ? 'block' : 'hidden'}`}>
      <div className="flex flex-col pt-2 pb-24 space-y-4">
        <div className="px-5">
          <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest">My Fylos ({filteredFriends.length})</h3>
            <button onClick={() => setCurrentView('my-fylos')} className="text-[13px] font-semibold text-[#FF6A3D]">→</button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar friends-suggestions-scroll">
            {filteredFriends.map((friend) => (
              <button key={friend.id} onClick={() => { setActiveProfile(friend); setCurrentView('profile'); }} className="shrink-0 flex flex-col items-center gap-1.5 px-1">
                <img src={friend.petPhoto} alt={friend.petName} className="w-11 h-11 rounded-full object-cover bg-[#F7F7F8]" loading="lazy" decoding="async" />
                <span className="text-[11px] text-[#6E6E73]">{friend.petName}</span>
              </button>
            ))}
          </div>
        </div>

        {filteredReceivedReqs.length > 0 && (
          <div className="px-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest flex items-center gap-1.5">Requests <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D]" /></h3>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-[#9A9AA0]">{currentRequestCardIndex + 1}/{filteredReceivedReqs.length}</span>
                <button onClick={() => setCurrentView('requests')} className="text-[13px] font-semibold text-[#FF6A3D]">View all</button>
              </div>
            </div>
            <div onTouchStart={handleRequestTouchStart} onTouchEnd={handleRequestTouchEnd} className="overflow-hidden rounded-[14px]">
              <div
                className="flex transition-transform duration-[280ms]"
                style={{
                  transform: `translateX(-${currentRequestCardIndex * 100}%)`,
                  transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)'
                }}
              >
                {filteredReceivedReqs.map((req) => (
                  <div key={req.id} className="w-full shrink-0">
                    <div className={`bg-[#FFFFFF] rounded-[14px] p-2.5 border border-black/[0.04] transition-all duration-200 ${requestExits[req.id] === 'accept' ? 'opacity-0 translate-x-1' : requestExits[req.id] === 'decline' ? 'opacity-0 -translate-x-2' : 'opacity-100'}`}>
                      <div className="flex items-center gap-2.5">
                        <img src={req.fromPetPhoto} alt={req.fromPetName} className="w-9 h-9 rounded-full object-cover bg-[#F7F7F8]" loading="lazy" decoding="async" />
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-[#8E8E93] truncate">
                            <span className="font-semibold text-[#111111]">{req.fromPetName}</span>
                            <span className="text-[#8E8E93]"> • {req.fromPetBreed}</span>
                            <span className="text-[#8E8E93] whitespace-nowrap"> • {req.distance || 2} km</span>
                          </p>
                          <p className="text-[11px] text-[#7F7F86] mt-0.5">Wants to be {activePetName}&apos;s Fylos.</p>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button onClick={() => handleDeclineRequest(req.id)} className="h-7 px-2.5 rounded-[8px] border border-black/[0.08] text-[11px] font-semibold text-[#6E6E73] active:scale-[0.98]">Ignore</button>
                          <button onClick={() => handleAcceptRequest(req)} className="h-7 px-2.5 rounded-[8px] bg-[#FF6A3D] text-[11px] font-semibold text-white active:scale-[0.98] active:opacity-90">Be Fylos</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {filteredReceivedReqs.length > 2 && (
              <div className="mt-2 text-[12px] text-[#8E8E93]">
                +{filteredReceivedReqs.length - 2} more · <button onClick={() => setCurrentView('requests')} className="text-[#FF6A3D] font-medium">View all</button>
              </div>
            )}
          </div>
        )}

        <div className="px-4">
          <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2 px-1">Updates</h3>
          <div className="space-y-3.5">
            {visibleFilteredFeedPosts.map((post, index) => (
              <React.Fragment key={post.id}>
                <ActivityFeedPostCard post={post} onLike={handleToggleLike} onViewLikes={handleViewLikes} />
                {(index + 1) % 3 === 0 && filteredSuggestions.length > 0 ? renderDiscoverInline(`${post.id}-${index}`) : null}
              </React.Fragment>
            ))}
            {hasMoreFeedPosts && <div ref={feedSentinelRef} className="h-8" />}
          </div>
        </div>
      </div>

      <ActivitySubScreenPortal isOpen={currentView === 'search'}>
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
          <div className="px-4 pt-14 pb-3 flex items-center gap-3 bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
            <button onClick={() => setCurrentView('list')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
              <input autoFocus value={query} onChange={(e) => { setQuery(e.target.value); setSearching(true); setTimeout(() => setSearching(false), 250); }} placeholder="Search by pet name, breed..." className="w-full h-10 pl-10 pr-4 bg-[#F0F0F2] rounded-[12px] text-[15px] focus:outline-none placeholder:text-[#8E8E93]" />
              {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93]"><X size={16} /></button>}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {searching ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#8E8E93]" size={24} /></div>
            ) : query.length > 1 && searchResults.length === 0 ? (
              <div className="text-center py-10 px-6"><Search size={32} className="text-[#CFCFD4] mx-auto mb-3" /><p className="text-[15px] font-medium text-[#111111]">No pets found for "{query}"</p></div>
            ) : query.length > 1 ? (
              <div className="space-y-3">
                {searchResults.map((res) => (
                  <div key={res.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04] flex items-center gap-4">
                    <img src={res.petPhoto} alt={res.petName} className="w-12 h-12 rounded-full object-cover bg-[#F7F7F8]" />
                    <div className="flex-1">
                      <h5 className="text-[15px] font-semibold text-[#111111]">{res.petName}</h5>
                      <p className="text-[13px] text-[#6E6E73]">{res.petBreed} · {res.ownerName}</p>
                    </div>
                    <button onClick={() => { handleSendRequest(res); setQuery(''); }} className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center text-[#111111]"><UserPlus size={18} /></button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-6"><p className="text-[14px] text-[#8E8E93]">Type to discover nearby pets</p></div>
            )}
          </div>
        </div>
      </ActivitySubScreenPortal>

      <ActivitySubScreenPortal isOpen={currentView === 'requests'}>
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
          <div className="px-4 pt-14 pb-3 flex items-center gap-3 bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
            <button onClick={() => setCurrentView('list')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
            <h2 className="text-[18px] font-bold text-[#111111]">Requests</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-10">
            <div>
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Received ({filteredReceivedReqs.length})</h3>
              {filteredReceivedReqs.length === 0 ? (
                <div className="bg-transparent border border-dashed border-[#CFCFD4] rounded-[16px] p-6 text-center"><Bell size={24} className="text-[#8E8E93] mx-auto mb-2" /><p className="text-[14px] text-[#6E6E73]">No pending requests</p></div>
              ) : (
                <div className="space-y-3">
                  {filteredReceivedReqs.map((req) => (
                    <div key={req.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04]">
                      <div className="flex gap-4">
                        <img src={req.fromPetPhoto} alt={req.fromPetName} className="w-14 h-14 rounded-full object-cover bg-[#F7F7F8]" />
                        <div className="flex-1">
                          <h5 className="text-[15px] font-semibold text-[#111111] leading-tight mb-1">{req.fromPetName}</h5>
                          <p className="text-[13px] text-[#6E6E73] mb-1">{req.fromPetBreed}</p>
                          <p className="text-[12px] text-[#8E8E93] mb-3 flex items-center gap-1"><Clock size={12} /> {req.timeAgo}</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleDeclineRequest(req.id)} className="flex-1 py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px]">Ignore</button>
                            <button onClick={() => handleAcceptRequest(req)} className="flex-1 py-2 bg-[#FF6A3D] text-[#FFFFFF] text-[13px] font-semibold rounded-[12px]">Be Fylos</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Sent ({sentReqs.length})</h3>
              <div className="space-y-3">
                {sentReqs.map((req) => (
                  <div key={req.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04] flex items-center gap-4">
                    <img src={req.toPetPhoto} alt={req.toPetName} className="w-12 h-12 rounded-full object-cover bg-[#F7F7F8] opacity-70" />
                    <div className="flex-1">
                      <h5 className="text-[15px] font-semibold text-[#111111]">{req.toPetName}</h5>
                      <p className="text-[13px] text-[#6E6E73]">Sent {req.timeAgo}</p>
                    </div>
                    <button onClick={() => setSentReqs((prev) => prev.filter((r) => r.id !== req.id))} className="px-3 py-1.5 bg-[#F7F7F8] text-[#FF3B30] text-[12px] font-semibold rounded-[8px]">Cancel</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ActivitySubScreenPortal>

      <ActivitySubScreenPortal isOpen={currentView === 'suggestions'}>
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
          <div className="px-4 pt-14 pb-3 flex items-center gap-3 bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
            <button onClick={() => setCurrentView('list')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
            <h2 className="text-[18px] font-bold text-[#111111]">Discover</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {filteredSuggestions.length === 0 ? (
              <div className="text-center py-10"><p className="text-[15px] text-[#6E6E73]">No more suggestions right now.</p></div>
            ) : (
              filteredSuggestions.map((sugg) => (
                <div key={sugg.id} className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm border border-black/[0.04]">
                  <div className="flex gap-4 mb-3">
                    <img src={sugg.petPhoto} alt={sugg.petName} className="w-16 h-16 rounded-full object-cover bg-[#F7F7F8]" />
                    <div className="flex-1">
                      <h5 className="text-[16px] font-bold text-[#111111] leading-tight flex items-center gap-2">{sugg.petName}<span className="text-[12px] font-semibold text-[#34C759] bg-[#E8F8EE] px-2 py-0.5 rounded-full">{sugg.matchScore}% match</span></h5>
                      <p className="text-[14px] text-[#6E6E73]">{sugg.petBreed} · {sugg.distance} km</p>
                    </div>
                  </div>
                  <div className="bg-[#F7F7F8] rounded-[12px] p-3 mb-4 space-y-1.5">
                    {sugg.reasons.map((reason, index) => (
                      <p key={`${sugg.id}-${index}`} className="text-[13px] text-[#111111] flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#FF6A3D]" /> {reason}</p>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleDismissSuggestion(sugg.id)} className="w-12 h-10 bg-[#F7F7F8] text-[#111111] rounded-[12px] flex items-center justify-center"><X size={20} /></button>
                    <button onClick={() => handleSendRequest(sugg)} className="flex-1 h-10 bg-[#111111] text-[#FFFFFF] text-[14px] font-semibold rounded-[12px] flex items-center justify-center gap-2 active:scale-[0.98] active:opacity-90"><UserPlus size={18} /> Be Fylos</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </ActivitySubScreenPortal>

      <ActivitySubScreenPortal isOpen={currentView === 'my-fylos'}>
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
          <div className="px-4 pt-14 pb-3 flex items-center gap-3 bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
            <button onClick={() => setCurrentView('list')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
            <h2 className="text-[18px] font-bold text-[#111111]">My Fylos</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {filteredFriends.map((fylos) => (
              <div key={fylos.id} onClick={() => { setActiveProfile(fylos); setCurrentView('profile'); }} className="bg-[#FFFFFF] p-3.5 rounded-[14px] border border-black/[0.04] flex items-center gap-3 active:bg-black/[0.02] transition-colors">
                <img src={fylos.petPhoto} alt={fylos.petName} className="w-12 h-12 rounded-full object-cover bg-[#F7F7F8]" loading="lazy" decoding="async" />
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-medium text-[#111111] truncate">{fylos.petName}</p>
                  <p className="text-[12px] text-[#8E8E93] truncate">{fylos.petBreed} • {fylos.distance} km</p>
                  <p className="text-[11px] text-[#9A9AA0] mt-0.5">Connected via {MOCK_DASHBOARD_PETS.find((pet) => pet.id === (fylos.connectedViaPetId || fylos.contextPetIds?.[0]))?.name || activePetName}</p>
                </div>
                <ChevronRight size={16} className="text-[#CFCFD4]" />
              </div>
            ))}
          </div>
        </div>
      </ActivitySubScreenPortal>

      <ActivitySubScreenPortal isOpen={currentView === 'profile'}>
        <div className="flex-1 flex flex-col relative overflow-hidden bg-[#F0F0F2]">
          {activeProfile && (
            <>
              <div className="absolute top-14 left-4 right-4 flex justify-between z-10">
                <button onClick={() => setCurrentView('list')} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white"><ArrowLeft size={20} /></button>
                <button onClick={() => setProfileMenuOpen((v) => !v)} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white relative">
                  <MoreVertical size={20} />
                  {profileMenuOpen && (
                    <div className="absolute top-12 right-0 w-48 bg-[#FFFFFF] rounded-[16px] shadow-xl border border-black/[0.04] overflow-hidden py-1">
                      <button className="w-full px-4 py-3 text-left text-[15px] font-medium text-[#111111] hover:bg-[#F7F7F8]">Mute notifications</button>
                      <div className="h-[1px] bg-black/[0.04]" />
                      <button onClick={() => handleRemoveFriend(activeProfile.id)} className="w-full px-4 py-3 text-left text-[15px] font-medium text-[#FF3B30] hover:bg-[#FFF0F0]">Remove connection</button>
                    </div>
                  )}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar pb-24 relative">
                <div className="h-[280px] w-full bg-[#E5E5EA] relative shrink-0">
                  <img src={activeProfile.petPhoto} alt="profile" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <h1 className="text-[32px] font-bold leading-tight drop-shadow-md">{activeProfile.petName}</h1>
                    <p className="text-[15px] font-medium opacity-90">{activeProfile.petBreed} · {activeProfile.age} years</p>
                  </div>
                </div>
                <div className="px-5 py-5 space-y-6">
                  <div className="bg-[#FFFFFF] rounded-[20px] p-4 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#E8F2FF] flex items-center justify-center text-[#007AFF]"><MapPin size={24} /></div>
                    <div>
                      <p className="text-[15px] font-semibold text-[#111111]">{activeProfile.distance} km away</p>
                      <p className="text-[13px] text-[#6E6E73]">Connected since {activeProfile.friendsSince}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-[#F0F0F2]/90 backdrop-blur-md border-t border-black/[0.04] z-20">
                <div className="flex gap-3">
                  <button className="flex-1 py-3.5 bg-[#FFFFFF] text-[#111111] text-[15px] font-semibold rounded-[16px] shadow-sm flex items-center justify-center gap-2 border border-black/[0.04]"><MessageCircle size={18} /> Message</button>
                  <button onClick={() => setCurrentView('playdatesList')} className="flex-1 py-3.5 bg-[#FF6A3D] text-[#FFFFFF] text-[15px] font-semibold rounded-[16px] shadow-sm flex items-center justify-center gap-2"><Calendar size={18} /> Playdate</button>
                </div>
              </div>
            </>
          )}
        </div>
      </ActivitySubScreenPortal>

      <ActivitySubScreenPortal isOpen={currentView === 'playdatesList'}>
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F7F7F8]">
          <div className="px-4 pt-14 pb-3 flex items-center justify-between bg-[#FFFFFF] border-b border-black/[0.04] shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => setCurrentView('list')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
              <h2 className="text-[18px] font-bold text-[#111111]">Playdates</h2>
            </div>
            <button onClick={() => setCreatePlaydateOpen(true)} className="p-2 -mr-2 text-[#FF6A3D] active:opacity-50"><Plus size={24} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-10">
            {pendingPlaydates.length > 0 && (
              <div>
                <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3 flex items-center gap-2">Invitations <span className="bg-[#FF3B30] text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingPlaydates.length}</span></h3>
                <div className="space-y-3">
                  {pendingPlaydates.map((pd) => (
                    <div key={pd.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04]">
                      <p className="text-[14px] font-semibold text-[#111111]">{formatActivityDateStr(pd.date)} · {pd.startTime}</p>
                      <p className="text-[13px] text-[#6E6E73] flex items-center gap-1 mt-0.5"><MapPin size={12} /> {pd.place.name}</p>
                      <p className="text-[14px] text-[#111111] my-4">Hosted by <strong>{pd.hostPetName}&apos;s owner</strong></p>
                      <div className="flex gap-2">
                        <button onClick={() => handleDeclinePlaydate(pd.id)} className="flex-1 py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px]">Decline</button>
                        <button onClick={() => handleAcceptPlaydate(pd.id)} className="flex-1 py-2 bg-[#FF6A3D] text-[#FFFFFF] text-[13px] font-semibold rounded-[12px]">Accept</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Upcoming ({upcomingPlaydates.length})</h3>
              <div className="space-y-3">
                {upcomingPlaydates.map((pd) => (
                  <div key={pd.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04]">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[15px] font-bold text-[#111111]">{formatActivityDateStr(pd.date)} · {pd.startTime}</p>
                        <p className="text-[13px] text-[#6E6E73] flex items-center gap-1 mt-0.5"><MapPin size={12} /> {pd.place.name}</p>
                      </div>
                      <div className={`text-[11px] font-bold px-2 py-1 rounded-[6px] uppercase tracking-wide ${pd.status === 'in-progress' ? 'bg-[#E8F8EE] text-[#34C759]' : 'bg-[#FFF0ED] text-[#FF6A3D]'}`}>{pd.status === 'in-progress' ? 'Live Now' : 'Upcoming'}</div>
                    </div>
                    <button onClick={() => { setActivePlaydate(pd); setCurrentView('playdateDetails'); }} className="w-full py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px]">View Details</button>
                  </div>
                ))}
              </div>
            </div>

            {completedPlaydates.length > 0 && (
              <div>
                <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Completed ({completedPlaydates.length})</h3>
                <div className="space-y-3">
                  {completedPlaydates.map((pd) => (
                    <div key={pd.id} className="bg-[#FFFFFF] p-4 rounded-[16px] shadow-sm border border-black/[0.04] flex items-center justify-between">
                      <div>
                        <p className="text-[14px] font-semibold text-[#111111]">{formatActivityDateStr(pd.date)}</p>
                        <p className="text-[13px] text-[#6E6E73] mt-0.5">{pd.place.name}</p>
                      </div>
                      <button className="text-[13px] font-semibold text-[#FF6A3D]">Photos</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </ActivitySubScreenPortal>

      <ActivitySubScreenPortal isOpen={currentView === 'playdateDetails'}>
        <div className="flex-1 flex flex-col overflow-hidden bg-[#F0F0F2] relative">
          {activePlaydate && (
            <>
              <div className="px-4 pt-14 pb-3 flex items-center justify-between bg-[#FFFFFF] border-b border-black/[0.04] shrink-0 z-10">
                <button onClick={() => setCurrentView('playdatesList')} className="p-2 -ml-2 text-[#111111] active:opacity-50"><ArrowLeft size={24} /></button>
                <h2 className="text-[16px] font-bold text-[#111111]">Playdate Details</h2>
                <button className="p-2 -mr-2 text-[#111111]"><MoreVertical size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0 pb-24">
                <div className="bg-[#FFFFFF] p-5 pb-6 shadow-sm mb-2">
                  <h1 className="text-[24px] font-bold text-[#111111] leading-tight mb-1">{formatActivityDateStr(activePlaydate.date)}</h1>
                  <p className="text-[15px] font-medium text-[#6E6E73]">{activePlaydate.startTime} - {activePlaydate.endTime}</p>
                </div>
                <div className="bg-[#FFFFFF] p-5 shadow-sm mb-2">
                  <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-4">Location</h3>
                  <p className="text-[16px] font-bold text-[#111111] mb-0.5">{activePlaydate.place.name}</p>
                  <p className="text-[14px] text-[#6E6E73] mb-4">{activePlaydate.place.address}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px] flex items-center justify-center gap-1.5"><Navigation size={16} /> Directions</button>
                    <button className="flex-1 py-2 bg-[#F7F7F8] text-[#111111] text-[13px] font-semibold rounded-[12px] flex items-center justify-center gap-1.5"><MapIcon size={16} /> Map</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </ActivitySubScreenPortal>

      <ActivityBottomSheet isOpen={createPlaydateOpen} onClose={() => setCreatePlaydateOpen(false)} title="Create Playdate">
        <div className="space-y-8">
          <div>
            <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-3">Invite Connections</h3>
            <div className="space-y-2">
              {friends.map((friend) => (
                <label key={friend.id} className="flex items-center justify-between p-3 bg-[#F7F7F8] rounded-[16px] border border-transparent cursor-pointer hover:border-black/[0.04]">
                  <div className="flex items-center gap-3">
                    <img src={friend.petPhoto} className="w-12 h-12 rounded-full object-cover bg-[#FFFFFF]" alt={friend.petName} />
                    <div>
                      <p className="text-[15px] font-bold text-[#111111]">{friend.petName}</p>
                      <p className="text-[13px] text-[#6E6E73]">{friend.distance} km away</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-6 h-6 accent-[#FF6A3D] rounded-full border-gray-300" defaultChecked={friend.petName === 'Max' || friend.petName === 'Bella'} />
                </label>
              ))}
            </div>
          </div>
          <button onClick={() => { setCreatePlaydateOpen(false); setCurrentView('playdatesList'); }} className="w-full h-[56px] bg-[#FF6A3D] text-white font-bold text-[16px] rounded-[16px] shadow-[0_4px_14px_rgba(255,106,61,0.3)]">Create Playdate</button>
        </div>
      </ActivityBottomSheet>
      <ActivityLikesBottomSheet isOpen={likesSheetOpen} onClose={() => setLikesSheetOpen(false)} post={activePostLikes} />
    </div>
  );
};

const ActivityCommunityPlaceholder = ({ isVisible }) => {
  const nav = (path) => { window.location.href = path; };
  return (
    <div className={`${isVisible ? 'block' : 'hidden'} bg-[#F7F7F8] pb-24`}>
      <div className="px-5 pt-4 space-y-3">
        {/* Safety Alerts */}
        <button onClick={() => nav('/danger-reports')} className="w-full bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.03] text-left active:scale-[0.98] transition-transform">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#FF3B30]/10 flex items-center justify-center"><AlertTriangle size={20} className="text-[#FF3B30]" /></div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111]">Safety Reports</div>
                <div className="text-[12px] text-[#6E6E73]">3 alerts near you</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#C7C7CC]" />
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 bg-[#FF3B30]/8 text-[#FF3B30] rounded-full text-[11px] font-semibold">Poison bait · Seefeld</span>
            <span className="px-2.5 py-1 bg-[#FF9500]/10 text-[#FF9500] rounded-full text-[11px] font-semibold">Glass · Bellevue</span>
          </div>
        </button>

        {/* Playdate Matching */}
        <button onClick={() => nav('/playdate-matching')} className="w-full bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.03] text-left active:scale-[0.98] transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#FF6B35]/10 flex items-center justify-center"><Heart size={20} className="text-[#FF6B35]" /></div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111]">Playdate Matching</div>
                <div className="text-[12px] text-[#6E6E73]">Find playmates nearby</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#FF6B35] text-white rounded-full text-[11px] font-bold">4 matches</span>
              <ChevronRight size={18} className="text-[#C7C7CC]" />
            </div>
          </div>
        </button>

        {/* Lost Pet Alert */}
        <button onClick={() => nav('/lost-pet')} className="w-full bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.03] text-left active:scale-[0.98] transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#FF9500]/10 flex items-center justify-center"><MapPin size={20} className="text-[#FF9500]" /></div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111]">Lost Pet Alert</div>
                <div className="text-[12px] text-[#6E6E73]">Report or help find</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#C7C7CC]" />
          </div>
        </button>

        {/* Training Tips */}
        <button onClick={() => nav('/training-tips')} className="w-full bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.03] text-left active:scale-[0.98] transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#007AFF]/10 flex items-center justify-center"><Star size={20} className="text-[#007AFF]" /></div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111]">Training Guides</div>
                <div className="text-[12px] text-[#6E6E73]">3 of 12 completed</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#C7C7CC]" />
          </div>
        </button>

        {/* Find Providers */}
        <button onClick={() => nav('/map-providers')} className="w-full bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.03] text-left active:scale-[0.98] transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#00C060]/10 flex items-center justify-center"><Navigation size={20} className="text-[#00C060]" /></div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111]">Explore Providers</div>
                <div className="text-[12px] text-[#6E6E73]">Walkers, groomers near you</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#C7C7CC]" />
          </div>
        </button>

        {/* Vet Telehealth */}
        <button onClick={() => nav('/vet-telehealth')} className="w-full bg-white rounded-[20px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-black/[0.03] text-left active:scale-[0.98] transition-transform">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#5856D6]/10 flex items-center justify-center"><Stethoscope size={20} className="text-[#5856D6]" /></div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111]">Vet Telehealth</div>
                <div className="text-[12px] text-[#6E6E73]">Video call a vet</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#C7C7CC]" />
          </div>
        </button>
      </div>
    </div>
  );
};

const ActivityScreen = ({ isTabBarVisible = true }) => {
  const [activeMode, setActiveMode] = useState('my');
  const [menuOpen, setMenuOpen] = useState(false);
  const [privacySheetOpen, setPrivacySheetOpen] = useState(false);
  const [insightsOpen, setInsightsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState(ACTIVITY_NOTIFICATIONS);
  const [hasNewFriendRequests, setHasNewFriendRequests] = useState(true);
  const [activeTypes, setActiveTypes] = useState(['all']);
  const [selectedActivityPetId, setSelectedActivityPetId] = useState(MOCK_DASHBOARD_PETS[0]?.id || null);
  const [fylosActionSheetOpen, setFylosActionSheetOpen] = useState(false);
  const [fylosFabOpen, setFylosFabOpen] = useState(false);
  const [fylosPlaydateSheetOpen, setFylosPlaydateSheetOpen] = useState(false);
  const [fylosPlaydatePetId, setFylosPlaydatePetId] = useState(MOCK_DASHBOARD_PETS[0]?.id || null);
  const [fylosPlaydateDate, setFylosPlaydateDate] = useState('');
  const [fylosPlaydateTime, setFylosPlaydateTime] = useState('');
  const [fylosPlaydateLocation, setFylosPlaydateLocation] = useState('');
  const [fylosPlaydateInviteeIds, setFylosPlaydateInviteeIds] = useState([]);
  const [fylosPlaydateEvents, setFylosPlaydateEvents] = useState([]);
  const { progress: activityScrollY, handleScroll: handleActivityScroll, reset: resetActivityCollapse } = useDirectionalCollapseProgress(168, { showFactor: 2.25 });
  const totalUnreadNotifications = notifications.reduce((acc, group) => acc + group.items.filter((item) => !item.read).length, 0);
  const modes = [{ id: 'my', label: 'My' }, { id: 'friends', label: 'Network', badge: hasNewFriendRequests || totalUnreadNotifications > 0 }, { id: 'community', label: 'Community' }];
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const p1 = clamp01(activityScrollY / 56); // pets
  const p2 = clamp01((activityScrollY - 56) / 56); // pills
  const p3 = clamp01((activityScrollY - 112) / 56); // tabs
  const activityTopPadding = activeMode === 'my'
    ? 172 - (44 * p1) - (44 * p2) - (40 * p3)
    : activeMode === 'friends'
      ? 108 - (44 * p1) - (40 * p3)
    : 52;
  useEffect(() => {
    resetActivityCollapse();
  }, [activeMode, resetActivityCollapse]);
  useEffect(() => {
    if (activeMode !== 'friends') setFylosFabOpen(false);
  }, [activeMode]);
  useEffect(() => {
    if (notificationsOpen || insightsOpen || menuOpen || privacySheetOpen || fylosPlaydateSheetOpen) setFylosFabOpen(false);
  }, [notificationsOpen, insightsOpen, menuOpen, privacySheetOpen, fylosPlaydateSheetOpen]);
  const toggleInvitee = (friendId) => {
    setFylosPlaydateInviteeIds((prev) => (prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId]));
  };
  const formatPlaydateWhen = (dateStr, timeStr) => {
    if (!dateStr) return timeStr || '';
    const selected = new Date(`${dateStr}T00:00:00`);
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.round((selected - startOfToday) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return `Today ${timeStr}`.trim();
    if (diffDays === 1) return `Tomorrow ${timeStr}`.trim();
    const weekday = selected.toLocaleDateString('en-US', { weekday: 'short' });
    return `${weekday} ${timeStr}`.trim();
  };
  const openFylosPlaydateSheet = () => {
    setFylosFabOpen(false);
    setFylosPlaydatePetId(selectedActivityPetId || MOCK_DASHBOARD_PETS[0]?.id || null);
    setFylosPlaydateDate('');
    setFylosPlaydateTime('');
    setFylosPlaydateLocation('');
    setFylosPlaydateInviteeIds([]);
    setFylosPlaydateSheetOpen(true);
  };
  const scheduleFylosPlaydate = () => {
    if (!fylosPlaydatePetId || !fylosPlaydateDate || !fylosPlaydateTime) return;
    const pet = MOCK_DASHBOARD_PETS.find((p) => p.id === fylosPlaydatePetId) || MOCK_DASHBOARD_PETS[0];
    const invitees = ACTIVITY_FRIEND_DATA.friends.filter((f) => fylosPlaydateInviteeIds.includes(f.id));
    const firstInvitee = invitees[0]?.petName || 'your Fylos';
    const whenText = formatPlaydateWhen(fylosPlaydateDate, fylosPlaydateTime);
    const locationText = (fylosPlaydateLocation || '').trim();
    const event = {
      id: `playdate_event_${Date.now()}`,
      ownerName: 'Playdate scheduled',
      petName: pet?.name || 'Pet',
      avatar: pet?.avatar || MOCK_DASHBOARD_PETS[0]?.avatar,
      timeAgo: 'Just now',
      location: locationText || null,
      type: 'playdate-event',
      summary: `${pet?.name || 'Pet'} • ${whenText}`,
      details: `with ${firstInvitee}${locationText ? ` at ${locationText}` : ''}`,
      photoUrl: null,
      likesCount: 0,
      likedByMe: false,
      likersPreview: '',
      likers: [],
      contextPetIds: [fylosPlaydatePetId]
    };
    setFylosPlaydateEvents((prev) => [event, ...prev]);
    setFylosPlaydateSheetOpen(false);
  };
  const handleMarkNotificationRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) => (item.id === notificationId ? { ...item, read: true } : item))
      }))
    );
  };
  return (
    <>
      <ScreenContainer onScroll={handleActivityScroll}>
        <div style={{ paddingTop: `${activityTopPadding}px` }}>
          <div className="relative">
            <MyActivityContainer isVisible={activeMode === 'my'} onOpenInsights={() => setInsightsOpen(true)} />
            <FriendsActivityContainer isVisible={activeMode === 'friends'} setGlobalBadge={setHasNewFriendRequests} selectedPetId={selectedActivityPetId} playdateEvents={fylosPlaydateEvents} />
            <ActivityCommunityPlaceholder isVisible={activeMode === 'community'} />
          </div>
        </div>
        <ActivityNotificationsScreen isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} notifications={notifications} markAsRead={handleMarkNotificationRead} />
        <ActivityInsightsScreen isOpen={insightsOpen} onClose={() => setInsightsOpen(false)} />

        <ActivityBottomSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
          <div className="flex flex-col gap-1">
            <button onClick={() => { setMenuOpen(false); setTimeout(() => setPrivacySheetOpen(true), 200); }} className="flex items-center gap-3 w-full p-4 hover:bg-[#F7F7F8] rounded-[16px] text-left">
              <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0"><Lock size={18} color="#111111" /></div>
              <span className="text-[16px] font-medium text-[#111111]">Privacy settings</span>
            </button>
            <div className="h-[1px] bg-black/[0.04] mx-4 my-1" />
            <button onClick={() => setMenuOpen(false)} className="flex items-center gap-3 w-full p-4 hover:bg-[#F7F7F8] rounded-[16px] text-left">
              <div className="w-8 h-8 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0"><Download size={18} color="#111111" /></div>
              <span className="text-[16px] font-medium text-[#111111]">Export activity log</span>
            </button>
          </div>
        </ActivityBottomSheet>

        <ActivityBottomSheet isOpen={privacySheetOpen} onClose={() => setPrivacySheetOpen(false)} title="Activity Privacy">
          <div className="flex flex-col gap-6">
            <p className="text-[14px] text-[#6E6E73] leading-relaxed">Control who can see your pet's timeline. Health data is strictly private by design.</p>
            <div className="space-y-5">
              {[{ label: 'Photos', default: 'Friends only' }, { label: 'Check-ins', default: 'Friends only' }, { label: 'Milestones', default: 'Friends only' }, { label: 'Service Reviews', default: 'Public' }].map(item => (
                <div key={item.label} className="flex flex-col gap-2">
                  <label className="text-[15px] font-semibold text-[#111111]">{item.label}</label>
                  <div className="relative">
                    <select className="w-full h-[52px] px-4 bg-[#F7F7F8] border border-transparent text-[16px] text-[#111111] rounded-[16px] appearance-none focus:outline-none focus:border-[#FF6A3D] focus:bg-[#FFFFFF] transition-colors">
                      <option>{item.default}</option><option>Private</option><option>Public</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#8E8E93]" size={18} />
                  </div>
                </div>
              ))}
              <div className="flex flex-col gap-2 opacity-60 pointer-events-none mt-2">
                <label className="text-[15px] font-semibold text-[#111111] flex items-center gap-1.5">Health Data <Lock size={14} /></label>
                <div className="w-full h-[52px] px-4 bg-[#F7F7F8] text-[16px] text-[#8E8E93] rounded-[16px] flex items-center">Always Private</div>
              </div>
            </div>
            <button onClick={() => setPrivacySheetOpen(false)} className="w-full h-[56px] bg-[#111111] text-white font-semibold text-[16px] rounded-[16px]">Save Changes</button>
          </div>
        </ActivityBottomSheet>
        <ActivityBottomSheet isOpen={fylosActionSheetOpen} onClose={() => setFylosActionSheetOpen(false)} title="Network actions">
          <div className="space-y-2">
            <button onClick={() => { setFylosActionSheetOpen(false); setTimeout(() => setActiveMode('friends'), 120); }} className="w-full h-11 rounded-[12px] bg-[#F7F7F8] text-[#111111] text-[14px] font-semibold text-left px-4">Add connection</button>
            <button onClick={() => { setFylosActionSheetOpen(false); setTimeout(() => setActiveMode('friends'), 120); }} className="w-full h-11 rounded-[12px] bg-[#F7F7F8] text-[#111111] text-[14px] font-semibold text-left px-4">Search pets</button>
            <button onClick={() => { setFylosActionSheetOpen(false); }} className="w-full h-11 rounded-[12px] bg-[#F7F7F8] text-[#111111] text-[14px] font-semibold text-left px-4">Invite nearby pets</button>
          </div>
        </ActivityBottomSheet>
        <ActivityBottomSheet isOpen={fylosPlaydateSheetOpen} onClose={() => setFylosPlaydateSheetOpen(false)} title="Schedule Playdate">
          <div className="space-y-4">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">Pet</p>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_DASHBOARD_PETS.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => setFylosPlaydatePetId(pet.id)}
                    className={`h-10 rounded-[10px] text-[13px] font-semibold border transition-colors ${fylosPlaydatePetId === pet.id ? 'bg-[#111111] text-white border-transparent' : 'bg-[#F7F7F8] text-[#111111] border-black/[0.06]'}`}
                  >
                    {pet.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">Date</p>
                <input type="date" value={fylosPlaydateDate} onChange={(e) => setFylosPlaydateDate(e.target.value)} className="w-full h-10 rounded-[10px] border border-black/[0.06] bg-[#F7F7F8] px-3 text-[13px] text-[#111111] focus:outline-none focus:border-[#FF6A3D]" />
              </div>
              <div>
                <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">Time</p>
                <input type="time" value={fylosPlaydateTime} onChange={(e) => setFylosPlaydateTime(e.target.value)} className="w-full h-10 rounded-[10px] border border-black/[0.06] bg-[#F7F7F8] px-3 text-[13px] text-[#111111] focus:outline-none focus:border-[#FF6A3D]" />
              </div>
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">Location (optional)</p>
              <input value={fylosPlaydateLocation} onChange={(e) => setFylosPlaydateLocation(e.target.value)} placeholder="e.g. Zurichhorn Park" className="w-full h-10 rounded-[10px] border border-black/[0.06] bg-[#F7F7F8] px-3 text-[13px] text-[#111111] placeholder:text-[#9A9AA0] focus:outline-none focus:border-[#FF6A3D]" />
            </div>
            <div>
              <p className="text-[12px] font-bold uppercase tracking-widest text-[#8E8E93] mb-2">Invite Fylos</p>
              <div className="max-h-[148px] overflow-y-auto custom-scrollbar space-y-2 pr-1">
                {ACTIVITY_FRIEND_DATA.friends.slice(0, 8).map((friend) => (
                  <button key={friend.id} onClick={() => toggleInvitee(friend.id)} className={`w-full h-9 rounded-[10px] border px-3 text-left text-[12px] font-medium transition-colors ${fylosPlaydateInviteeIds.includes(friend.id) ? 'bg-[#FFF1EC] border-[#FFD9CC] text-[#111111]' : 'bg-[#F7F7F8] border-black/[0.05] text-[#6E6E73]'}`}>
                    {friend.petName} · {friend.petBreed}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={scheduleFylosPlaydate} disabled={!fylosPlaydatePetId || !fylosPlaydateDate || !fylosPlaydateTime} className="w-full h-11 rounded-[12px] bg-[#FF6A3D] text-white text-[14px] font-semibold disabled:opacity-50">
              Schedule Playdate
            </button>
          </div>
        </ActivityBottomSheet>
      </ScreenContainer>
      <div
        className="absolute top-[112px] left-0 w-full z-30"
        style={{
          opacity: 1 - p3,
          transform: `translateY(${-14 * p3}px)`,
          pointerEvents: p3 > 0.96 ? 'none' : 'auto'
        }}
      >
        <ActivityModeControl modes={modes} activeMode={activeMode} onChange={setActiveMode} />
      </div>
      {activeMode === 'my' && (
        <>
          <div
            className="absolute top-[164px] left-0 w-full z-30 px-5"
            style={{
              opacity: 1 - p2,
              transform: `translateY(${-12 * p2}px)`,
              pointerEvents: p2 > 0.96 ? 'none' : 'auto'
            }}
          >
            <div className="px-0 -mr-[3px]">
              <div className="grid grid-cols-4 gap-2 w-full pt-0.5">
                {[{ id: 'all', label: 'All' }, { id: 'health', label: 'Health' }, { id: 'bookings', label: 'Bookings' }, { id: 'photos', label: 'Photos' }].map(type => (
                  <button key={type.id} onClick={() => setActiveTypes([type.id])} className={`w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-[12px] font-semibold active:scale-[0.96] transition-all duration-[180ms] border ${activeTypes.includes(type.id) ? 'bg-[#111111] text-white border-transparent' : 'bg-white/90 backdrop-blur-md text-[#6E6E73] border-black/[0.05] hover:bg-white hover:text-[#111111]'}`}>{type.label}</button>
                ))}
              </div>
            </div>
          </div>
          {MOCK_DASHBOARD_PETS.length > 1 && (
            <div
              className="absolute top-[208px] left-0 w-full z-30 px-5"
              style={{
                opacity: 1 - p1,
                transform: `translateY(${-10 * p1}px)`,
                pointerEvents: p1 > 0.96 ? 'none' : 'auto'
              }}
            >
              <div className="px-0 -mr-[3px]">
                <div className="w-full bg-[#F5F5F5] rounded-[16px] h-[44px] p-1 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                  {MOCK_DASHBOARD_PETS.map((pet) => {
                    const isSelected = selectedActivityPetId === pet.id;
                    return (
                      <button
                        key={pet.id}
                        onClick={() => setSelectedActivityPetId(pet.id)}
                        className={`h-full flex-1 flex items-center justify-center gap-1.5 rounded-[12px] transition-all duration-200 active:scale-[0.98] ${isSelected ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-2.5' : 'bg-transparent px-2'}`}
                      >
                        <img src={pet.avatar} alt={pet.name} className={`${isSelected ? 'w-6 h-6 opacity-100' : 'w-[22px] h-[22px] opacity-90'} rounded-full object-cover transition-all duration-200`} />
                        <span className={`text-[13px] font-semibold ${isSelected ? 'text-[#111111]' : 'text-[#888888]'}`}>{pet.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {activeMode === 'friends' && MOCK_DASHBOARD_PETS.length > 1 && (
        <div
          className="absolute top-[164px] left-0 w-full z-30 px-5"
          style={{
            opacity: 1 - p1,
            transform: `translateY(${-10 * p1}px)`,
            pointerEvents: p1 > 0.96 ? 'none' : 'auto'
          }}
        >
          <div className="px-0 -mr-[3px]">
            <div className="w-full bg-[#F5F5F5] rounded-[16px] h-[44px] p-1 flex items-center justify-between shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
              {MOCK_DASHBOARD_PETS.map((pet) => {
                const isSelected = selectedActivityPetId === pet.id;
                return (
                  <button
                    key={pet.id}
                    onClick={() => setSelectedActivityPetId(pet.id)}
                    className={`h-full flex-1 flex items-center justify-center gap-1.5 rounded-[12px] transition-all duration-200 active:scale-[0.98] ${isSelected ? 'bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-2.5' : 'bg-transparent px-2'}`}
                  >
                    <img src={pet.avatar} alt={pet.name} className={`${isSelected ? 'w-6 h-6 opacity-100' : 'w-[22px] h-[22px] opacity-90'} rounded-full object-cover transition-all duration-200`} />
                    <span className={`text-[13px] font-semibold ${isSelected ? 'text-[#111111]' : 'text-[#888888]'}`}>{pet.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
      {activeMode === 'friends' && fylosFabOpen && (
        <button
          aria-label="Close add menu"
          onClick={() => setFylosFabOpen(false)}
          className="absolute inset-0 z-20 bg-black/[0.08]"
        />
      )}
      {activeMode === 'friends' && !fylosFabOpen && !notificationsOpen && !insightsOpen && (
        <button
          onClick={openFylosPlaydateSheet}
          aria-label="Schedule Playdate"
          className="absolute right-5 z-30 w-11 h-11 rounded-full bg-white border border-black/[0.05] shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-[#111111] flex items-center justify-center active:scale-[0.98] transition-all"
          style={{ bottom: isTabBarVisible ? '146px' : '84px' }}
        >
          <div className="relative">
            <CalendarDays size={17} />
            <PawPrint size={10} className="absolute -bottom-1 -right-1 text-[#FF6A3D]" />
          </div>
        </button>
      )}
      {activeMode === 'friends' && (
        <div
          className={`absolute right-5 z-30 flex flex-col items-end gap-2 transition-all duration-300 ${fylosFabOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          style={{ bottom: isTabBarVisible ? '150px' : '88px' }}
        >
          <button onClick={() => { setFylosFabOpen(false); alert('New Post composer coming soon'); }} className={`h-9 pl-3 pr-3.5 rounded-full bg-white border border-black/[0.05] shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-[12px] font-semibold text-[#111111] flex items-center gap-2 transition-all duration-300 ${fylosFabOpen ? 'translate-y-0' : 'translate-y-2'}`}><Camera size={14} /> New Post</button>
          <button onClick={openFylosPlaydateSheet} className={`h-9 pl-3 pr-3.5 rounded-full bg-white border border-black/[0.05] shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-[12px] font-semibold text-[#111111] flex items-center gap-2 transition-all duration-300 delay-75 ${fylosFabOpen ? 'translate-y-0' : 'translate-y-2'}`}><CalendarDays size={14} /><PawPrint size={13} /> Schedule Playdate</button>
          <button onClick={() => { setFylosFabOpen(false); alert('Add Photo coming soon'); }} className={`h-9 pl-3 pr-3.5 rounded-full bg-white border border-black/[0.05] shadow-[0_4px_12px_rgba(0,0,0,0.04)] text-[12px] font-semibold text-[#111111] flex items-center gap-2 transition-all duration-300 delay-100 ${fylosFabOpen ? 'translate-y-0' : 'translate-y-2'}`}><ImageIcon size={14} /> Add Photo</button>
        </div>
      )}
      {(activeMode === 'my' || activeMode === 'friends') && !notificationsOpen && !insightsOpen && (
        <button
          aria-label={activeMode === 'my' ? 'Add activity' : 'Add fylos'}
          onClick={() => {
            if (activeMode === 'my') return;
            setFylosFabOpen((prev) => !prev);
          }}
          className={`absolute right-5 z-30 w-12 h-12 flex items-center justify-center rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.04)] active:scale-95 transition-all duration-300 ease-out ${activeMode === 'friends' ? 'bg-[#0A0A0B] text-white border border-black/80 active:brightness-95' : 'text-[#FF6A3D] bg-[#FFF1EC] border border-[#FFD9CC]'}`}
          style={{ bottom: isTabBarVisible ? '92px' : '30px' }}
        >
          <Plus size={18} />
        </button>
      )}
      <div className="absolute top-[62px] right-4 flex items-center gap-1 z-30">
        <button onClick={() => setNotificationsOpen(true)} className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
          <Bell size={22} color="#111111" />
          {totalUnreadNotifications > 0 && <span className="absolute top-[8px] right-[8px] w-[10px] h-[10px] bg-[#FF3B4A] rounded-full border-[2px] border-[#F7F7F8]" />}
        </button>
        <button onClick={() => setMenuOpen(true)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors">
          <MoreVertical size={24} color="#111111" />
        </button>
      </div>
    </>
  );
};
const VaultSectionHeader = ({ title }) => (
  <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-[0.05em] mb-2.5 ml-1">{title}</h3>
);

const PetSelectorPill = ({ pet }) => (
  <button className="flex items-center gap-2.5 bg-white/85 backdrop-blur-md border border-black/[0.05] pl-1.5 pr-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.03)] active:scale-[0.98] transition-all mb-5">
    <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center"><PawPrint size={14} className="text-[#6E6E73]" /></div>
    <span className="text-[15px] font-semibold text-[#111111]">{pet.name} <span className="text-[#8E8E93] font-normal">· {pet.breed}</span></span>
    <ChevronDown size={14} className="text-[#8E8E93] ml-1" />
  </button>
);

const EmergencyBundleCard = ({ petName, onShare, onDownload, isDownloading }) => (
  <div className="bg-[#FFF8F5] border border-[#FFE5DA] rounded-[22px] p-5 relative overflow-hidden mb-6 shadow-[0_3px_14px_rgba(0,0,0,0.03)]">
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <ShieldAlert size={17} className="text-[#D92D20]" />
          <h2 className="text-[13px] font-bold text-[#111111] tracking-[0.05em] uppercase">Emergency Bundle</h2>
        </div>
        <p className="text-[13px] text-[#C35D37] font-medium opacity-90 leading-relaxed max-w-[250px]">Quick access to all critical information for {petName}.</p>
      </div>
    </div>
    <div className="flex flex-col gap-3">
      <Button variant="primary" icon={Share2} onClick={onShare}>Share Emergency Info</Button>
      <Button variant="secondary" icon={FileDown} className="!border-[#FFDCCD] !text-[#C35D37] hover:!bg-white/60 !bg-white" isLoading={isDownloading} onClick={onDownload}>Download PDF</Button>
    </div>
  </div>
);

const QuickAccessGrid = ({ onOpenHealthRecords, onOpenDocuments, onOpenContacts, onOpenPlaces }) => (
  <div className="mb-6">
    <VaultSectionHeader title="Quick Access" />
    <div className="grid grid-cols-2 gap-3">
      {[
        { icon: Stethoscope, label: 'Health Records', onClick: onOpenHealthRecords },
        { icon: FileText, label: 'Documents', onClick: onOpenDocuments },
        { icon: Phone, label: 'Emergency Contacts', onClick: onOpenContacts },
        { icon: MapPin, label: 'Places', onClick: onOpenPlaces }
      ].map((item, i) => (
        <Card key={i} clickable onClick={() => item.onClick && item.onClick()} className="p-4 flex flex-col items-center justify-center gap-2.5 !rounded-[18px] !shadow-[0_2px_8px_rgba(0,0,0,0.02)] border-black/[0.04]">
          <div className="w-[40px] h-[40px] rounded-full bg-[#F6F6F6] text-[#111111] flex items-center justify-center"><item.icon size={18} strokeWidth={1.9} /></div>
          <span className="text-[13px] font-semibold text-[#111111] text-center leading-tight">{item.label}</span>
        </Card>
      ))}
    </div>
  </div>
);

const CriticalInfoCard = ({ data, onCopyMicrochip }) => (
  <div className="mb-6">
    <VaultSectionHeader title="Critical Information" />
    <Card className="!p-0 overflow-hidden">
      <div className="p-4 active:bg-black/[0.02] cursor-pointer transition-colors">
        <div className="flex items-center gap-2 mb-3"><Pill size={18} className="text-[#111111]" /><span className="font-semibold text-[15px] text-[#111111]">Medications ({data.medications.length})</span></div>
        <ul className="pl-7 space-y-1.5">
          {data.medications.map(med => (
            <li key={med.id} className="text-[14px] text-[#6E6E73] flex items-start gap-2"><span className="text-black/20 mt-0.5">•</span><span><strong className="text-[#111111] font-medium">{med.name}</strong> ({med.dosage})</span></li>
          ))}
        </ul>
      </div>
      <Divider spacing="small" className="ml-11" />
      <div className="p-4 active:bg-black/[0.02] cursor-pointer transition-colors">
        <div className="flex items-center gap-2 mb-3"><ShieldAlert size={18} className="text-[#111111]" /><span className="font-semibold text-[15px] text-[#111111]">Allergies ({data.allergies.length})</span></div>
        <ul className="pl-7 space-y-2.5">
          {data.allergies.map(alg => (
            <li key={alg.id} className="flex items-center justify-between">
              <span className="text-[14px] text-[#111111] font-medium flex items-center gap-2"><span className="text-black/20">•</span>{alg.allergen}</span>
              <Badge variant={alg.severity === 'SEVERE' ? 'error' : 'warning'}>{alg.severity}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <Divider spacing="small" className="ml-11" />
      <div className="p-4 active:bg-black/[0.02] cursor-pointer transition-colors">
        <div className="flex items-center gap-2 mb-3"><Syringe size={18} className="text-[#111111]" /><span className="font-semibold text-[15px] text-[#111111]">Vaccinations</span></div>
        <ul className="pl-7 space-y-2">
          {data.vaccinations.length > 0 ? data.vaccinations.map(vac => (
            <li key={vac.id} className="text-[14px] text-[#6E6E73] flex items-start gap-2">
              <span className="text-black/20 mt-0.5">•</span>
              <span><strong className="text-[#111111] font-medium">{vac.name}:</strong> <span className={vac.isWarning ? 'text-[#FF3B30] font-medium' : ''}>{vac.statusText}</span>{vac.isWarning && <AlertTriangle size={14} className="inline ml-1 text-[#FF3B30] -mt-0.5" />}</span>
            </li>
          )) : <li className="text-[14px] text-[#6E6E73] italic">All up to date.</li>}
        </ul>
      </div>
      <Divider spacing="small" className="ml-11" />
      <div className="p-4 flex items-center justify-between bg-black/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-black/[0.04] flex items-center justify-center"><Fingerprint size={18} className="text-[#111111]" /></div>
          <div>
            <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.05em]">Microchip ID</div>
            <div className="text-[14px] font-mono font-medium text-[#111111] mt-0.5">{data.microchipId}</div>
          </div>
        </div>
      <button onClick={onCopyMicrochip} className="w-10 h-10 flex items-center justify-center bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-full active:scale-95 transition-transform text-[#6E6E73]"><Copy size={16} /></button>
      </div>
    </Card>
  </div>
);

const VaultContactsPreview = ({ contacts, onCall, onOpenContacts }) => (
  <div className="mb-6">
    <VaultSectionHeader title="Emergency Contacts" />
    <Card className="!p-0 overflow-hidden">
      {contacts.map((contact, index) => (
        <React.Fragment key={contact.id}>
          <div className="p-4 flex items-center justify-between active:bg-black/[0.02] transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center shrink-0">
                {contact.type === 'PRIMARY' ? <User size={16} className="text-[#6E6E73]" /> : contact.type.includes('EMERGENCY') ? <ShieldAlert size={16} className="text-[#6E6E73]" /> : <Stethoscope size={16} className="text-[#6E6E73]" />}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111] mb-0.5">{contact.name}</div>
                <Badge variant="default">{contact.type}</Badge>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onCall(contact.phone); }} className="w-10 h-10 rounded-full bg-[#F6F6F6] text-[#111111] border border-black/[0.04] flex items-center justify-center shrink-0 active:scale-90 transition-transform"><Phone size={16} /></button>
          </div>
          {index < contacts.length - 1 && <Divider spacing="small" className="ml-[68px]" />}
        </React.Fragment>
      ))}
      <button onClick={() => onOpenContacts && onOpenContacts()} className="w-full py-4 text-[14px] font-medium text-[#FF6B35] bg-black/[0.01] hover:bg-black/[0.03] transition-colors border-t border-black/[0.04]">View all contacts →</button>
    </Card>
  </div>
);

const RecentDocumentsCard = ({ documents }) => (
  <div className="mb-6">
    <VaultSectionHeader title="Recent Documents" />
    <Card className="!p-0 overflow-hidden">
      {documents.map((doc, index) => (
        <React.Fragment key={doc.id}>
          <div className="p-4 flex items-center gap-4 active:bg-black/[0.02] cursor-pointer transition-colors">
            <div className="w-10 h-10 rounded-[12px] bg-[#F6F6F6] text-[#111111] flex items-center justify-center shrink-0"><doc.icon size={20} strokeWidth={2} /></div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-[#111111] truncate mb-0.5">{doc.title}</div>
              <div className="text-[13px] text-[#8E8E93]">{doc.type} · {formatBytes(doc.size)} · {doc.date}</div>
            </div>
            <ChevronRight size={18} className="text-black/20" />
          </div>
          {index < documents.length - 1 && <Divider spacing="small" className="ml-[72px]" />}
        </React.Fragment>
      ))}
      <button className="w-full py-4 text-[14px] font-medium text-[#FF6B35] bg-black/[0.01] hover:bg-black/[0.03] transition-colors border-t border-black/[0.04]">View all documents →</button>
    </Card>
  </div>
);

const DataManagementCard = () => (
  <div className="mb-6">
    <VaultSectionHeader title="Data Management" />
    <Card className="!p-0 overflow-hidden">
      {[
        { icon: DownloadCloud, label: 'Export all data' },
        { icon: Cloud, label: 'Backup to cloud' },
        { icon: Lock, label: 'Privacy settings' }
      ].map((item, index) => (
        <React.Fragment key={index}>
          <button className="w-full flex items-center gap-3 p-4 hover:bg-black/[0.02] transition-colors text-left active:scale-[0.99]">
            <item.icon size={20} className="text-[#111111]" strokeWidth={1.5} />
            <span className="text-[15px] font-medium text-[#111111] flex-1">{item.label}</span>
            <ChevronRight size={18} className="text-black/20" />
          </button>
          {index < 2 && <Divider spacing="small" className="ml-12" />}
        </React.Fragment>
      ))}
    </Card>
  </div>
);

const EmergencyShareSheet = ({ isOpen, onClose, data, onCopy }) => (
  <CardModal isOpen={isOpen} onClose={onClose} title="Share Emergency Info">
    <div className="space-y-6 pt-2">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-[24px] border border-black/[0.04] shadow-sm">
        <div className="w-[160px] h-[160px] bg-white rounded-2xl border border-black/[0.04] p-2 mb-5 flex items-center justify-center relative">
          <QrCode size={130} strokeWidth={1} className="text-[#111111]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md border border-black/5"><PawPrint size={18} className="text-[#6E6E73]" /></div>
        </div>
        <p className="text-[15px] font-medium text-[#111111] text-center max-w-[220px]">Scan to access {data.pet.name}'s emergency information</p>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/[0.08]" /></div>
        <div className="relative flex justify-center"><span className="bg-[#FFFFFF] px-4 text-[12px] text-[#8E8E93] uppercase tracking-wider font-semibold">Or share link</span></div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Share Link</label>
          <div className="flex items-center gap-1 text-[13px] font-medium text-[#111111] bg-white px-2.5 py-1 rounded-full border border-black/[0.04] shadow-sm">Expires: <span className="text-[#FF6B35]">7 days</span> <ChevronDown size={14} className="text-[#8E8E93]" /></div>
        </div>
        <div className="flex items-center justify-between bg-white border border-black/[0.04] p-4 rounded-[16px] shadow-sm">
          <span className="text-[15px] font-mono text-[#111111] truncate mr-4 select-all">{data.emergencyBundle.shareLink}</span>
          <button onClick={onCopy} className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center shrink-0 active:scale-95 text-[#111111]"><Copy size={16} /></button>
        </div>
      </div>
      <Button variant="primary" icon={Share2}>Share Link...</Button>
    </div>
  </CardModal>
);

const VaultOptionsSheet = ({ isOpen, onClose }) => (
  <CardModal isOpen={isOpen} onClose={onClose} title="Vault Options">
    <div className="space-y-2 pt-2 pb-4">
      {[{ label: 'Export all data', icon: DownloadCloud }, { label: 'Print emergency bundle', icon: FileText }, { label: 'Share vault access', icon: Share2 }].map((item, i) => (
        <button key={i} className="w-full flex items-center gap-4 p-4 bg-white border border-black/[0.03] hover:bg-black/[0.02] rounded-[16px] transition-colors active:scale-[0.98] shadow-sm">
          <item.icon size={20} className="text-[#111111]" strokeWidth={1.5} />
          <span className="text-[15px] font-medium text-[#111111]">{item.label}</span>
        </button>
      ))}
      <Divider spacing="medium" />
      {[{ label: 'Privacy settings', icon: Lock }, { label: 'Backup settings', icon: Cloud }].map((item, i) => (
        <button key={i} className="w-full flex items-center gap-4 p-4 bg-white border border-black/[0.03] hover:bg-black/[0.02] rounded-[16px] transition-colors active:scale-[0.98] shadow-sm">
          <item.icon size={20} className="text-[#6E6E73]" strokeWidth={1.5} />
          <span className="text-[15px] font-medium text-[#111111]">{item.label}</span>
        </button>
      ))}
    </div>
  </CardModal>
);

const ContactDetailsSheet = ({ isOpen, onClose, contact, onCall, onEmail }) => {
  if (!contact) return null;
  return (
    <CardModal isOpen={isOpen} onClose={onClose} title="Contact Details">
      <div className="pt-2 pb-6">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#F6F6F6] flex items-center justify-center shrink-0"><User size={20} className="text-[#6E6E73]" /></div>
          <div>
            <div className="text-[20px] font-semibold text-[#111111] leading-tight mb-1">{contact.name}</div>
            <div className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide uppercase mb-1 ${contact.priority === 'PRIMARY' ? 'bg-[#111111] text-white' : 'bg-black/5 text-[#111111]'}`}>{contact.priority}</div>
            <div className="text-[13px] text-[#7A7A7A]">{contact.relationship}</div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-1">Phone</div>
              <div className="text-[16px] text-[#111111]">{contact.phone}</div>
            </div>
            <button onClick={() => onCall(contact.phone)} className="w-10 h-10 rounded-full bg-[#ECFDF3] text-[#027A48] flex items-center justify-center shrink-0 active:scale-95"><Phone size={18} fill="currentColor" /></button>
          </div>
          {contact.email && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-1">Email</div>
                <div className="text-[16px] text-[#111111]">{contact.email}</div>
              </div>
              <button onClick={() => onEmail(contact.email)} className="w-10 h-10 rounded-full bg-[#FFFAEB] text-[#B54708] flex items-center justify-center shrink-0 active:scale-95"><Mail size={18} fill="currentColor" /></button>
            </div>
          )}
        </div>
      </div>
    </CardModal>
  );
};

const VetDetailsSheet = ({ isOpen, onClose, vet, onCall, onDirections, onWebsite }) => {
  if (!vet) return null;
  return (
    <CardModal isOpen={isOpen} onClose={onClose} title="Veterinary Details">
      <div className="pt-2 pb-6 space-y-6">
        <div>
          <div className="text-[20px] font-semibold text-[#111111] mb-1">{vet.name}</div>
          {vet.vetName && <div className="text-[13px] text-[#7A7A7A]">{vet.vetName}</div>}
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth={false} icon={Phone} onClick={() => onCall(vet.phone)}>Call</Button>
          <Button variant="secondary" fullWidth={false} icon={MapIcon} onClick={() => onDirections(vet.address)}>Directions</Button>
          {vet.website && <Button variant="secondary" fullWidth={false} icon={Globe} onClick={() => onWebsite(vet.website)}>Website</Button>}
        </div>
        <p className="text-[14px] text-[#111111]">{vet.address.full}</p>
        <p className="text-[13px] text-[#7A7A7A] whitespace-pre-line">{vet.hoursFormatted}</p>
      </div>
    </CardModal>
  );
};

const ProtocolDetailsSheet = ({ isOpen, onClose, protocol, onCallEmergencyVet }) => {
  if (!protocol) return null;
  return (
    <CardModal isOpen={isOpen} onClose={onClose} title={protocol.title}>
      <div className="pt-2 pb-6">
        <div className="space-y-4 mb-6">
          {protocol.fullSteps.map((step) => (
            <div key={step.step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#F6F6F6] text-[#111111] font-semibold text-[13px] flex items-center justify-center shrink-0">{step.step}</div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111] mb-1">{step.title}</div>
                <div className="text-[14px] text-[#7A7A7A]">{step.description}</div>
                {step.phone && <button onClick={onCallEmergencyVet} className="mt-2 h-[40px] px-4 bg-[#E6352B] text-white rounded-[10px] text-[14px] font-semibold">Call Now</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </CardModal>
  );
};

const EmergencyContactsScreen = ({ onBack }) => {
  const data = MOCK_VAULT_EMERGENCY_CONTACTS;
  const [toastMsg, setToastMsg] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };
  const handleCall = (phone) => window.location.href = `tel:${phone}`;
  const handleEmail = (email) => window.location.href = `mailto:${email}`;
  const handleDirections = (address) => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.full)}`);
  const handleWebsite = (url) => window.open(url, '_blank');
  const handleCallEmergencyVet = () => {
    const emergencyVet = data.veterinaryContacts.find(v => v.type === 'emergency');
    if (window.confirm(`Call Emergency Vet?\n${emergencyVet.name}\n${emergencyVet.phone}`)) window.location.href = `tel:${emergencyVet.phone}`;
  };

  return (
    <div className="absolute inset-0 bg-[#F6F6F6] z-[95] flex flex-col">
      <div className="pt-14 pb-2 px-5 bg-[#F6F6F6] flex items-center justify-between shrink-0 z-10">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-start active:opacity-70 transition-opacity -ml-2"><ArrowLeft size={24} className="text-[#111111]" /></button>
        <h1 className="text-[20px] font-semibold text-[#111111]">Emergency Contacts</h1>
        <div className="w-10" />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-6">
        <div className="bg-[#FFF4F4] border border-[#FF3B30]/40 rounded-[12px] p-5 mb-8 shadow-[0_2px_8px_rgba(255,59,48,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert size={24} className="text-[#D92D20]" />
            <h3 className="text-[14px] font-semibold text-[#D92D20] tracking-[0.05em] uppercase">In Case of Emergency</h3>
          </div>
          <p className="text-[14px] font-medium text-[#111111] mb-3 leading-[1.5]">Call emergency vet immediately if Luna shows signs of:</p>
          <ul className="mb-5 pl-1 space-y-1.5">
            {data.emergencySigns.map((sign, idx) => (
              <li key={idx} className="text-[14px] text-[#111111] flex items-start gap-2 leading-[1.4]"><span className="text-[#D92D20] mt-0.5">•</span><span>{sign}</span></li>
            ))}
          </ul>
          <button onClick={handleCallEmergencyVet} className="w-full h-[48px] bg-[#E6352B] text-white rounded-[12px] text-[15px] font-semibold shadow-sm active:scale-[0.98] transition-transform">Call Emergency Vet</button>
        </div>

        <div className="mb-8">
          <SectionHeader title="Emergency Contacts" actionIcon={Plus} onAction={() => showToast('Add Contact')} />
          <div className="space-y-4">
            {data.emergencyContacts.map((contact) => (
              <Card key={contact.id} clickable className="p-4" onClick={() => setSelectedContact(contact)}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F6F6F6] flex items-center justify-center shrink-0"><User size={16} className="text-[#6E6E73]" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-[16px] font-semibold text-[#111111] leading-tight">{contact.name}</div>
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide uppercase ${contact.priority === 'PRIMARY' ? 'bg-[#111111] text-white' : 'bg-black/5 text-[#111111]'}`}>{contact.priority}</div>
                    </div>
                    <div className="text-[13px] text-[#7A7A7A] mb-2">{contact.relationship}</div>
                    <div className="text-[14px] text-[#111111]">{contact.phone}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <SectionHeader title="Veterinary Contacts" actionIcon={Plus} onAction={() => showToast('Add Vet')} />
          <div className="space-y-4">
            {data.veterinaryContacts.map((vet) => (
              <Card key={vet.id} clickable className={`p-4 ${vet.type === 'emergency' ? 'border-l-[3px] border-l-[#D92D20]' : ''}`} onClick={() => setSelectedVet(vet)}>
                <div className="text-[16px] font-semibold text-[#111111]">{vet.name}</div>
                {vet.vetName && <div className="text-[13px] text-[#7A7A7A]">{vet.vetName}</div>}
                <div className="text-[14px] text-[#111111] mt-1">{vet.phone}</div>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <SectionHeader title="Emergency Protocols" />
          <div className="space-y-4">
            {data.emergencyProtocols.map(protocol => (
              <Card key={protocol.id} clickable className="p-4 bg-[#FFFBF2] border-[#ECECEC]" onClick={() => setSelectedProtocol(protocol)}>
                <div className="flex items-center gap-2 mb-3">
                  {renderLegacyIcon(protocol.icon, 18, 'text-[#6E6E73]')}
                  <div className="text-[16px] font-semibold text-[#111111]">{protocol.title}</div>
                </div>
                <ol className="pl-6 space-y-1 mb-3 list-decimal text-[14px] text-[#111111] leading-[1.5]">
                  {protocol.summary.map((step, idx) => <li key={idx}>{step}</li>)}
                </ol>
                <div className="text-[13px] font-medium text-[#FF6B35]/85">View Full Protocol →</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <ContactDetailsSheet isOpen={!!selectedContact} onClose={() => setSelectedContact(null)} contact={selectedContact} onCall={handleCall} onEmail={handleEmail} />
      <VetDetailsSheet isOpen={!!selectedVet} onClose={() => setSelectedVet(null)} vet={selectedVet} onCall={handleCall} onDirections={handleDirections} onWebsite={handleWebsite} />
      <ProtocolDetailsSheet isOpen={!!selectedProtocol} onClose={() => setSelectedProtocol(null)} protocol={selectedProtocol} onCallEmergencyVet={handleCallEmergencyVet} />
      {toastMsg && (
        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md text-white px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[120] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={18} className="text-[#00C060]" />
          <span className="text-[14px] font-medium whitespace-nowrap">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

const PlaceDetailsSheet = ({ isOpen, onClose, place, onDirections, onLogVisit }) => {
  if (!place) return null;
  return (
    <CardModal isOpen={isOpen} onClose={onClose} title="">
      <div className="-mt-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#F7F7F5] flex items-center justify-center shrink-0 border border-[#EAEAEA]/60">{renderLegacyIcon(place.icon, 20, 'text-[#6E6E73]')}</div>
          <div>
            <h2 className="text-[20px] font-bold text-[#111111] leading-tight mb-1">{place.name}</h2>
            {renderPlaceStars(place.rating)}
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          <button onClick={onDirections} className="flex-1 bg-[#F7F7F5] border border-[#EAEAEA] py-2.5 rounded-[12px] flex flex-col items-center gap-1.5 transition-colors">
            <Navigation size={18} className="text-[#111111]" />
            <span className="text-[11px] font-medium text-[#111111]">Directions</span>
          </button>
          {place.phone && (
            <button onClick={() => window.location.href = `tel:${place.phone}`} className="flex-1 bg-[#F7F7F5] border border-[#EAEAEA] py-2.5 rounded-[12px] flex flex-col items-center gap-1.5 transition-colors">
              <Phone size={18} className="text-[#111111]" />
              <span className="text-[11px] font-medium text-[#111111]">Call</span>
            </button>
          )}
          <button className="flex-1 bg-[#F7F7F5] border border-[#EAEAEA] py-2.5 rounded-[12px] flex flex-col items-center gap-1.5 transition-colors">
            <Share2 size={18} className="text-[#111111]" />
            <span className="text-[11px] font-medium text-[#111111]">Share</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex gap-3 items-start">
            <MapPin size={18} className="text-[#8A8A8A] shrink-0 mt-0.5" />
            <div>
              <div className="text-[14px] text-[#111111] font-medium leading-snug">{place.address?.full || 'Location saved'}</div>
              <div className="text-[12px] text-[#8A8A8A] mt-0.5">{calculatePlaceDistance(place, MOCK_VAULT_PLACES.userLocation)} away</div>
            </div>
          </div>
          {place.notes && (
            <div className="bg-[#F7F7F5] border border-[#EAEAEA] rounded-[16px] p-4">
              <h4 className="text-[11px] font-medium text-[#8A8A8A] uppercase tracking-[1.2px] mb-2">Your Notes</h4>
              <p className="text-[14px] text-[#111111] leading-relaxed">{place.notes}</p>
            </div>
          )}
          <div className="border border-[#EAEAEA] rounded-[16px] p-4">
            <div className="text-[13px] text-[#8A8A8A] mb-3">Total visits: {place.visitCount} · Last: {place.lastVisit}</div>
            <button onClick={onLogVisit} className="w-full bg-[#FF6B35] text-white font-medium py-3 rounded-[12px] shadow-sm">Log New Visit</button>
          </div>
        </div>
      </div>
    </CardModal>
  );
};

const VaultPlacesScreen = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  const filteredPlaces = MOCK_VAULT_PLACES.places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || place.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || place.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const categoriesToShow = activeCategory === 'all'
    ? MOCK_VAULT_PLACES.categories.filter(c => c.id !== 'all' && c.count > 0)
    : MOCK_VAULT_PLACES.categories.filter(c => c.id === activeCategory);

  const handleDirections = (place) => {
    const address = encodeURIComponent(place.address?.full || place.name);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`);
  };

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#F7F7F5] custom-scrollbar z-[95]">
      <div className="sticky top-0 z-40 bg-[#F7F7F5]/80 backdrop-blur-xl border-b border-[#EAEAEA] px-4 pt-12 pb-3 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center -ml-2 active:scale-95 z-10">
          <ChevronLeft size={24} className="text-[#111111]" />
        </button>
        <h1 className="absolute left-0 right-0 text-center text-[17px] font-semibold text-[#111111] pointer-events-none">Places & Favorites</h1>
        <button className="w-10 h-10 flex items-center justify-center -mr-2 active:scale-95 z-10 text-[#111111]">
          <MoreHorizontal size={22} />
        </button>
      </div>

      <div className="px-4 pt-5 pb-[100px]">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none"><Search size={18} className="text-[#8A8A8A]" /></div>
          <input type="text" placeholder="Search places..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-[44px] bg-black/[0.03] rounded-[12px] pl-10 pr-10 text-[15px] text-[#111111] placeholder-[#8A8A8A] outline-none focus:bg-white focus:ring-1 focus:ring-[#FF6B35]/30 border border-transparent focus:border-[#FF6B35]/30 transition-all" />
          {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-3 flex items-center"><XCircle size={16} className="text-[#8A8A8A]" /></button>}
        </div>

        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-6 -mx-4 px-4">
          {MOCK_VAULT_PLACES.categories.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-medium border transition-all ${activeCategory === cat.id ? 'bg-[#FFF6F2] border-[#FF6B35]/20 text-[#FF6B35]' : 'bg-white border-[#EAEAEA] text-[#6E6E73]'}`}>
              {renderLegacyIcon(cat.icon, 14)}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {categoriesToShow.map(cat => {
          const categoryPlaces = filteredPlaces.filter(p => p.category === cat.id);
          if (categoryPlaces.length === 0) return null;
          return (
            <div key={cat.id} className="mb-8">
              <div className="flex items-center justify-between mt-8 mb-4 px-1">
                <h3 className="text-[12px] font-medium text-[#8A8A8A] uppercase tracking-[1.2px]">{cat.label} ({categoryPlaces.length})</h3>
                <button className="w-6 h-6 flex items-center justify-center text-[#8A8A8A]"><Plus size={16} /></button>
              </div>
              <div className="space-y-4">
                {categoryPlaces.map(place => (
                  <div key={place.id} className="bg-white border border-[#EAEAEA] rounded-[16px] p-[18px] shadow-[0_2px_6px_rgba(0,0,0,0.02)] cursor-pointer" onClick={() => setSelectedPlace(place)}>
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#F7F7F5] flex items-center justify-center shrink-0 border border-[#EAEAEA]/60">{renderLegacyIcon(place.icon, 18, 'text-[#6E6E73]')}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="text-[16px] font-semibold text-[#111111] truncate pr-2">{place.name}</h4>
                          <span className="text-[13px] font-normal text-[#8A8A8A] shrink-0 mt-0.5">{calculatePlaceDistance(place, MOCK_VAULT_PLACES.userLocation)}</span>
                        </div>
                        <div className="mb-1.5">{renderPlaceStars(place.rating)}</div>
                        <p className="text-[13px] text-[#8A8A8A] truncate mb-2">{place.address?.full?.split(',')[0] || 'Location saved'}</p>
                        <div className="text-[12px] font-normal text-[#8A8A8A]">{place.visitCount} visits · Last: {place.lastVisit}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="mt-10 mb-6">
          <h3 className="text-[12px] font-medium text-[#8A8A8A] uppercase tracking-[1.2px] mb-4 pl-1">Quick Actions</h3>
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            {[{ icon: Plus, label: 'Add new place' }, { icon: MapIcon, label: 'View all on map' }, { icon: Compass, label: 'Discover nearby' }, { icon: Share2, label: 'Share favorites' }].map((item, index) => (
              <React.Fragment key={index}>
                <button className="w-full h-[52px] flex items-center gap-3.5 px-4 text-left" onClick={() => showToast(item.label)}>
                  <div className="text-[#6E6E73]"><item.icon size={20} strokeWidth={1.5} /></div>
                  <span className="text-[15px] font-medium text-[#111111] flex-1">{item.label}</span>
                  <ChevronRight size={18} className="text-[#EAEAEA]" />
                </button>
                {index < 3 && <div className="w-full h-[1px] bg-[#EAEAEA] ml-12" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <PlaceDetailsSheet
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        place={selectedPlace}
        onDirections={() => selectedPlace && handleDirections(selectedPlace)}
        onLogVisit={() => showToast('Visit logged')}
      />

      {toastMsg && (
        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md text-white px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[200] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={18} className="text-[#00C060]" />
          <span className="text-[14px] font-medium whitespace-nowrap">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

const VaultDocumentsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sheetConfig, setSheetConfig] = useState({ isOpen: false, title: '', options: [] });
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };
  const closeSheet = () => setSheetConfig(prev => ({ ...prev, isOpen: false }));
  const openSheet = (config) => setSheetConfig({ ...config, isOpen: true });

  const filteredDocs = MOCK_VAULT_DOCS.filter(doc => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = doc.title.toLowerCase().includes(q) || doc.source?.toLowerCase().includes(q);
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const counts = DOC_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = cat.id === 'all' ? MOCK_VAULT_DOCS.length : MOCK_VAULT_DOCS.filter(d => d.category === cat.id).length;
    return acc;
  }, {});

  const groupedDocs = DOC_CATEGORIES.filter(c => c.id !== 'all').map(cat => ({
    ...cat,
    items: filteredDocs.filter(d => d.category === cat.id)
  })).filter(cat => cat.items.length > 0 || (activeCategory === cat.id && !searchQuery));

  return (
    <div className="absolute inset-0 bg-[#FAFAFA] overflow-y-auto custom-scrollbar z-[20]">
      <div className="px-5 pt-[110px] pb-[140px]">
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-[#A1A1A6]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setActiveCategory('all'); }}
            placeholder="Search documents..."
            className="w-full h-[44px] bg-[#FFFFFF] border border-[#ECECEC] rounded-[12px] pl-11 pr-10 text-[15px] text-[#111111] placeholder:text-[#A1A1A6] focus:outline-none focus:border-[#E56D48] focus:ring-1 focus:ring-[#E56D48] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-3.5 flex items-center text-[#A1A1A6] hover:text-[#111111] transition-colors">
              <XCircle size={16} />
            </button>
          )}
        </div>

        {!searchQuery && (
          <div className="flex overflow-x-auto gap-3 no-scrollbar mb-8 -mx-5 px-5 custom-scrollbar">
            {DOC_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              const count = counts[cat.id] || 0;
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-1.5 rounded-[12px] text-[14px] font-medium transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] border ${isActive ? 'bg-[#E56D48] text-white border-[#E56D48]' : 'bg-white text-[#6E6E73] border-[#ECECEC] hover:bg-[#F9F9F9]'}`}>
                  {cat.label} <span className={`text-[12px] ${isActive ? 'text-white/80' : 'text-[#A1A1A6]'}`}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {searchQuery && filteredDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-6">
            <div className="w-16 h-16 bg-[#F9F9F9] border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[12px] flex items-center justify-center mb-4">
              <Search size={24} className="text-[#A1A1A6]" />
            </div>
            <h3 className="text-[16px] font-semibold text-[#111111] mb-2">No documents found</h3>
            <p className="text-[14px] text-[#8E8E93] mb-6">No match for "{searchQuery}". Try different keywords.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedDocs.map(group => (
              <div key={group.id}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-[1px]">{`${group.label} (${group.items.length})`}</h3>
                  {group.items.length > 0 && (
                    <button
                      onClick={() => openSheet({
                        title: `Export ${group.label}`,
                        options: [
                          { label: 'Download as ZIP', LucideIcon: Archive, onClick: () => showToast(`${group.label} ZIP downloaded`) },
                          { label: 'Generate PDF', LucideIcon: FileIcon, onClick: () => showToast(`${group.label} PDF generated`) },
                          { label: 'Cancel', style: 'cancel' }
                        ]
                      })}
                      className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#8E8E93] hover:text-[#111111] transition-colors"
                    >
                      <DownloadCloud size={14} strokeWidth={2} />
                    </button>
                  )}
                </div>

                {group.id === 'photos' ? (
                  <div className="grid grid-cols-4 gap-3">
                    {group.items.slice(0, 8).map(p => (
                      <div key={p.id} className="aspect-square bg-[#F9F9F9] rounded-[12px] overflow-hidden relative border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                        <img src={p.url} className="w-full h-full object-cover" alt={p.title} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {group.items.map(doc => (
                      <div key={doc.id} className="p-4 flex items-start gap-4 bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[12px]">
                        <div className="w-[36px] h-[36px] rounded-[10px] bg-[#F9F9F9] flex items-center justify-center shrink-0 border border-[#ECECEC]">
                          {doc.type === 'pdf' ? <FileIcon size={18} className="text-[#E56D48]/80" /> : <ImageIcon size={18} className="text-[#4B93E6]/80" />}
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="text-[16px] font-semibold text-[#111111] truncate mb-1 leading-tight">{doc.title}</div>
                          <div className="text-[13px] text-[#8E8E93]">{doc.type.toUpperCase()} · {formatBytes(doc.size)} · {doc.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <CardModal isOpen={sheetConfig.isOpen} onClose={closeSheet} title={sheetConfig.title}>
        <div className="space-y-2 pt-2 pb-4">
          {(sheetConfig.options || []).map((opt, i) => (
            <button key={i} onClick={() => { opt.onClick?.(); closeSheet(); }} className={`w-full flex items-center gap-4 p-4 bg-white border border-black/[0.03] hover:bg-black/[0.02] rounded-[16px] transition-colors active:scale-[0.98] shadow-sm ${opt.style === 'cancel' ? 'justify-center' : ''}`}>
              {opt.LucideIcon && <opt.LucideIcon size={20} className={opt.style === 'cancel' ? 'text-red-500' : 'text-[#111111]'} strokeWidth={1.5} />}
              <span className={`text-[15px] font-medium ${opt.style === 'cancel' ? 'text-red-500' : 'text-[#111111]'}`}>{opt.label}</span>
            </button>
          ))}
        </div>
      </CardModal>

      {toastMsg && (
        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md text-white px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[120] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={18} className="text-[#00C060]" />
          <span className="text-[14px] font-medium whitespace-nowrap">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

const VaultHealthWeightChart = ({ history }) => {
  const data = [...history].reverse();
  const minW = 25;
  const maxW = 30;
  const getY = (w) => 100 - ((w - minW) / (maxW - minW)) * 100;
  const getX = (i) => (i / (data.length - 1)) * 100;
  const points = data.map((d, i) => `${getX(i)},${getY(d.weight)}`).join(' ');

  return (
    <div className="w-full h-[100px] relative mt-6 mb-4">
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <rect x="0" y={`${getY(29)}%`} width="100%" height={`${getY(26) - getY(29)}%`} fill="#E8F6ED" opacity="0.6" />
        <line x1="0" y1={`${getY(29)}%`} x2="100%" y2={`${getY(29)}%`} stroke="#A1C9A8" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.8" />
        <line x1="0" y1={`${getY(26)}%`} x2="100%" y2={`${getY(26)}%`} stroke="#A1C9A8" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.8" />
        <polyline points={points} fill="none" stroke="#FF6B35" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        {data.map((d, i) => (
          <circle key={i} cx={`${getX(i)}%`} cy={`${getY(d.weight)}%`} r="3" fill="#FFFFFF" stroke="#FF6B35" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
};

const VaultHealthRecordsScreen = ({ onBack }) => {
  const data = MOCK_VAULT_HEALTH_DATA;
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleExport = async (label) => {
    setIsExporting(true);
    showToast(`Generating ${label}...`);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setIsExporting(false);
    showToast(`Health ${label} downloaded`);
  };

  return (
    <div className="absolute inset-0 z-[95] bg-[#F7F7F8] overflow-y-auto custom-scrollbar pt-14 pb-[140px] px-5">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center bg-white border border-[#ECECEC] shadow-sm rounded-full active:scale-[0.96] transition-all">
          <ArrowLeft size={18} color="#111111" />
        </button>
        <h1 className="text-[17px] font-semibold text-[#111111] tracking-tight">Health Records</h1>
        <button onClick={() => setMenuOpen(true)} className="w-9 h-9 flex items-center justify-center bg-white border border-[#ECECEC] shadow-sm rounded-full active:scale-[0.96] transition-all">
          <MoreHorizontal size={18} color="#111111" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6 px-1">
        <PawPrint size={18} className="text-[#6E6E73]" />
        <span className="text-[15px] font-medium text-[#111111]">{data.pet.name} <span className="text-[#7A7A7A] font-normal">· {data.pet.breed}</span></span>
      </div>

      <div className="mb-6">
        <VaultSectionHeader title="Health Summary" />
        <Card className="p-5 mb-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <div className="text-[13px] text-[#7A7A7A] mb-1">Last Vet Visit</div>
              <div className="text-[15px] font-semibold text-[#111111]">{new Date(data.summary.lastVetVisit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <div className="text-[13px] text-[#7A7A7A] mt-0.5">{data.summary.lastVetVisit.reason}</div>
            </div>
            <div>
              <div className="text-[13px] text-[#7A7A7A] mb-1">Current Weight</div>
              <div className="text-[15px] font-semibold text-[#111111]">{data.summary.currentWeight.value} {data.summary.currentWeight.unit}</div>
              <div className="text-[13px] font-medium text-[#2E8B57] mt-0.5">Healthy ({data.summary.currentWeight.idealRange.min}-{data.summary.currentWeight.idealRange.max})</div>
            </div>
            <div>
              <div className="text-[13px] text-[#7A7A7A] mb-1">Active Medications</div>
              <div className="text-[15px] font-semibold text-[#111111]">{data.summary.activeMedicationsCount}</div>
            </div>
            <div>
              <div className="text-[13px] text-[#7A7A7A] mb-1">Allergies</div>
              <div className="text-[15px] font-semibold text-[#111111]">{data.summary.allergiesCount} <span className="text-[#D9534F] font-medium text-[13px]">({data.summary.severeAllergiesCount} Severe)</span></div>
            </div>
          </div>
        </Card>
        <div className="flex flex-col gap-2.5">
          <Button variant="primary" isLoading={isExporting} onClick={() => handleExport('summary')}>Export Health Summary</Button>
          <Button variant="secondary" onClick={() => showToast('Shared with vet')}>Share with Vet</Button>
        </div>
      </div>

      <div className="mb-6">
        <VaultSectionHeader title="Vaccinations Status" />
        <Card className="!p-0 overflow-hidden">
          {data.vaccinations.map((vac) => {
            const isExpiring = vac.status === 'expiring';
            const Icon = isExpiring ? AlertTriangle : CheckCircle2;
            return (
              <div key={vac.id} className="relative p-4 flex items-start gap-3 border-b-[0.5px] border-[#ECECEC] last:border-0 bg-white">
                {isExpiring && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#D9822B]" />}
                <Icon size={18} className={`mt-[2px] ${isExpiring ? 'text-[#D9822B]' : 'text-black/20'} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-[#111111] mb-0.5">{vac.name}</div>
                  <div className={`text-[13px] ${isExpiring ? 'text-[#111111] font-medium' : 'text-[#7A7A7A]'}`}>{isExpiring ? `Expires in ${vac.daysUntilExpiry} days` : `Valid until ${new Date(vac.nextDue).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}`}</div>
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      <div className="mb-6">
        <VaultSectionHeader title="Weight Tracker" />
        <Card className="p-5">
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-[13px] text-[#7A7A7A] mb-0.5">Current Weight</div>
              <div className="text-[20px] font-semibold text-[#111111] leading-none">{data.summary.currentWeight.value} <span className="text-[14px] text-[#7A7A7A] font-medium">{data.summary.currentWeight.unit}</span></div>
            </div>
            <div className="text-right">
              <div className="text-[13px] text-[#7A7A7A] mb-0.5">Target</div>
              <div className="text-[14px] font-medium text-[#111111]">{data.summary.currentWeight.idealRange.min}-{data.summary.currentWeight.idealRange.max} kg</div>
            </div>
          </div>
          <VaultHealthWeightChart history={data.weightHistory} />
          <button className="text-[13px] font-medium text-[#7A7A7A] hover:text-[#111111] transition-colors" onClick={() => showToast('Full history opened')}>
            View Full History →
          </button>
        </Card>
      </div>

      <CardModal isOpen={menuOpen} onClose={() => setMenuOpen(false)} title="Health Options">
        <div className="space-y-2 pt-2 pb-4">
          {[{ label: 'Export health records', icon: DownloadCloud }, { label: 'Print summary', icon: Printer }, { label: 'Email to vet', icon: Mail }, { label: 'View history', icon: History }, { label: 'Weight analytics', icon: LineChart }, { label: 'Edit health data', icon: Edit3 }, { label: 'Add new record', icon: Plus }].map((item, i) => (
            <button key={i} onClick={() => { setMenuOpen(false); showToast(item.label); }} className="w-full flex items-center gap-3 p-4 bg-white border border-[#ECECEC] hover:bg-black/[0.02] rounded-[12px] transition-colors active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <item.icon size={18} className="text-[#111111]" strokeWidth={1.5} />
              <span className="text-[15px] font-medium text-[#111111]">{item.label}</span>
            </button>
          ))}
        </div>
      </CardModal>

      {toastMsg && (
        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md text-white px-5 py-3 rounded-full flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] z-[120] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={16} className="text-[#34C759]" />
          <span className="text-[14px] font-medium whitespace-nowrap">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};

const VaultScreen = ({ onOpenHealthRecords, onOpenDocuments, onOpenContacts, onOpenPlaces }) => {
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [vaultToast, setVaultToast] = useState('');

  const previewData = deriveVaultPreviewData(MOCK_VAULT_DATA);

  const showVaultToast = (msg) => { setVaultToast(msg); setTimeout(() => setVaultToast(''), 3000); };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsDownloading(false);
    showVaultToast('Emergency PDF downloaded');
  };

  const handleCopyMicrochip = () => {
    navigator.clipboard?.writeText(previewData.pet.microchipId);
    showVaultToast('Microchip ID copied');
  };

  const handleCall = (phone) => {
    if (window.confirm(`Call ${phone}?`)) window.location.href = `tel:${phone}`;
  };

  return (
    <ScreenContainer>
      <div className="px-5 pb-[20px] relative z-0">
        <PetSelectorPill pet={previewData.pet} />
        <EmergencyBundleCard petName={previewData.pet.name} onShare={() => setShareSheetOpen(true)} onDownload={handleDownloadPDF} isDownloading={isDownloading} />
        <QuickAccessGrid onOpenHealthRecords={onOpenHealthRecords} onOpenDocuments={onOpenDocuments} onOpenContacts={onOpenContacts} onOpenPlaces={onOpenPlaces} />
        <CriticalInfoCard data={{ ...previewData.criticalInfo, microchipId: previewData.pet.microchipId }} onCopyMicrochip={handleCopyMicrochip} />
        <VaultContactsPreview contacts={previewData.emergencyContacts} onCall={handleCall} onOpenContacts={onOpenContacts} />
        <RecentDocumentsCard documents={previewData.recentDocuments} />
        <DataManagementCard />
      </div>

      <EmergencyShareSheet isOpen={shareSheetOpen} onClose={() => setShareSheetOpen(false)} data={previewData} onCopy={() => { showVaultToast('Link copied'); setShareSheetOpen(false); }} />
      <VaultOptionsSheet isOpen={menuSheetOpen} onClose={() => setMenuSheetOpen(false)} />
      {vaultToast && (
        <div className="absolute bottom-[110px] left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md text-white px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-[120] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 size={18} className="text-[#00C060]" />
          <span className="text-[14px] font-medium whitespace-nowrap">{vaultToast}</span>
        </div>
      )}
    </ScreenContainer>
  );
};

// --- STEPS 30-35 (SETTINGS, NOTIFICATIONS, SEARCH, COMING SOON, ANIMATIONS) ---
const APP_NOTIFICATIONS = [
  {
    id: 'inbox_001', category: 'social', type: 'friend-request', priority: 'normal',
    sender: { name: "Tao's owner", petName: 'Tao', photo: 'https://i.pravatar.cc/150?u=max_dog' },
    title: 'Friend request', body: 'Tao wants to connect with Leo.',
    actions: [{ id: 'accept', label: 'Accept', type: 'primary' }, { id: 'decline', label: 'Ignore', type: 'secondary' }],
    read: false, archived: false, timeGroup: 'Today', timeAgo: 'Just now'
  },
  {
    id: 'inbox_002', category: 'health', type: 'medication-reminder', priority: 'critical',
    sender: { name: 'FYLOS Health', icon: HeartPulse },
    title: 'Medication reminder', body: 'Apoquel 16mg · Due now',
    actions: [{ id: 'given', label: 'Mark as given', type: 'primary' }, { id: 'snooze', label: 'Snooze 30m', type: 'secondary' }],
    read: false, archived: false, timeGroup: 'Today', timeAgo: '5m'
  },
  {
    id: 'inbox_003', category: 'bookings', type: 'booking-reminder', priority: 'high',
    sender: { name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker' },
    title: 'Walk starting soon', body: 'Your scheduled walk with Lukas begins in exactly 1 hour.',
    actions: [{ id: 'contact', label: 'Message walker', type: 'secondary' }],
    read: false, archived: false, timeGroup: 'Today', timeAgo: '45m'
  },
  {
    id: 'inbox_004', category: 'health', type: 'health-alert', priority: 'high',
    sender: { name: 'FYLOS Health', icon: Syringe },
    title: 'Vaccination due soon', body: "Luna's annual Rabies booster is due in 3 days. Ensure she stays protected.",
    actions: [{ id: 'book_vet', label: 'Book vet', type: 'primary' }],
    read: false, archived: false, timeGroup: 'Today', timeAgo: '1h'
  },
  {
    id: 'inbox_005', category: 'system', type: 'activity-logged', priority: 'low',
    sender: { name: 'FYLOS Tracker', icon: Bone },
    title: 'Meal logged successfully', body: 'You logged 150g of Royal Canin for Luna.',
    actions: [], read: true, archived: false, timeGroup: 'Today', timeAgo: '2h'
  },
  {
    id: 'inbox_006', category: 'bookings', type: 'booking-confirmed', priority: 'high',
    sender: { name: 'Sarah T.', photo: 'https://i.pravatar.cc/150?u=sarah_walker' },
    title: 'Drop-in confirmed', body: 'Drop-in visit with Sarah T. · Tomorrow at 10:00 AM',
    actions: [{ id: 'view', label: 'View booking', type: 'secondary' }],
    read: false, archived: false, timeGroup: 'Today', timeAgo: '3h'
  },
  {
    id: 'inbox_007', category: 'social', type: 'playdate-invite', priority: 'normal',
    sender: { name: "Charlie's owner", photo: 'https://i.pravatar.cc/150?u=charlie_dog' },
    title: 'Playdate invitation', body: 'Charlie wants to play at Dog Park Enge this weekend. Are you free?',
    actions: [{ id: 'accept', label: 'Accept', type: 'primary' }, { id: 'decline', label: 'Decline', type: 'secondary' }],
    read: false, archived: false, timeGroup: 'Yesterday', timeAgo: '14:30'
  },
  {
    id: 'inbox_008', category: 'bookings', type: 'booking-cancelled', priority: 'critical',
    sender: { name: 'FYLOS Bookings', icon: XCircle },
    title: 'Booking cancelled', body: 'Unfortunately Emma W. had to cancel your scheduled walk for Friday.',
    actions: [{ id: 'find_new', label: 'Find new walker', type: 'primary' }],
    read: true, archived: false, timeGroup: 'Yesterday', timeAgo: '11:15'
  },
  {
    id: 'inbox_009', category: 'bookings', type: 'booking-completed', priority: 'normal',
    sender: { name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker' },
    title: 'Walk completed', body: '90 min with Lukas F. · Zürichhorn Park',
    actions: [], read: true, archived: false, timeGroup: 'Yesterday', timeAgo: '09:00'
  },
  {
    id: 'inbox_010', category: 'system', type: 'new-feature', priority: 'low',
    sender: { name: 'FYLOS Team', icon: Megaphone },
    title: 'Activity insights', body: 'Your new dashboard is live.',
    actions: [{ id: 'check', label: 'Explore', type: 'secondary' }],
    read: true, archived: false, timeGroup: 'Yesterday', timeAgo: 'Yesterday'
  },
  {
    id: 'inbox_011', category: 'health', type: 'weight-logged', priority: 'normal',
    sender: { name: 'FYLOS Health', icon: Activity },
    title: 'Weight milestone', body: 'Luna weighed in at 12.5kg. She is maintaining a perfect, healthy trend!',
    actions: [{ id: 'view_chart', label: 'View chart', type: 'secondary' }],
    read: true, archived: false, timeGroup: 'Earlier this week', timeAgo: 'Mon'
  },
  {
    id: 'inbox_012', category: 'social', type: 'milestone', priority: 'normal',
    sender: { name: 'FYLOS Community', icon: PartyPopper },
    title: "Luna's birthday!", body: 'Luna turned 3 years old! Share the celebration with your friends.',
    actions: [{ id: 'share', label: 'Share profile', type: 'secondary' }],
    read: true, archived: false, timeGroup: 'Earlier this week', timeAgo: 'Sun'
  },
  {
    id: 'inbox_013', category: 'bookings', type: 'review-left', priority: 'low',
    sender: { name: 'FYLOS Bookings', icon: Star },
    title: 'Review published', body: 'You left a 5-star review for Sarah T. Thanks for supporting the community.',
    actions: [], read: true, archived: false, timeGroup: 'Earlier this week', timeAgo: 'Sat'
  },
  {
    id: 'inbox_014', category: 'system', type: 'welcome', priority: 'normal',
    sender: { name: 'FYLOS Team', icon: Megaphone },
    title: 'Welcome to FYLOS', body: 'Your profile is all set up. Explore the features and find your first walker.',
    actions: [{ id: 'tour', label: 'Take tour', type: 'primary' }],
    read: true, archived: true, timeGroup: 'Older', timeAgo: 'Feb 24'
  },
  {
    id: 'inbox_015', category: 'health', type: 'vet-visit', priority: 'normal',
    sender: { name: 'Dr. Smith', icon: Stethoscope },
    title: 'Checkup completed', body: 'General checkup notes have been uploaded to your vault.',
    actions: [{ id: 'view_notes', label: 'View notes', type: 'secondary' }],
    read: true, archived: true, timeGroup: 'Older', timeAgo: 'Feb 22'
  },
  {
    id: 'inbox_016', category: 'social', type: 'friend-accepted', priority: 'low',
    sender: { name: "Rocky's owner", photo: 'https://i.pravatar.cc/150?u=rocky_dog' },
    title: 'Friend request accepted', body: 'Rocky is now friends with Luna.',
    actions: [{ id: 'say_hi', label: 'Say hi', type: 'secondary' }],
    read: true, archived: true, timeGroup: 'Older', timeAgo: 'Feb 20'
  }
];

const INBOX_CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'health', label: 'Health', icon: HeartPulse },
  { id: 'system', label: 'Updates', icon: Megaphone }
];

const SEARCH_QUICK_ACTIONS = [
  { id: 'book-walk', label: 'Book a walk', icon: Calendar },
  { id: 'add-photo', label: 'Add photo', icon: Camera },
  { id: 'log-med', label: 'Log medication', icon: Pill },
  { id: 'open-vault', label: 'Open documents', icon: FileText }
];

const SEARCH_INDEX_DATA = [
  { id: 's1', category: 'providers', title: 'Lukas F.', subtitle: 'Dog Walker · 4.9', keywords: ['walker', 'lukas', 'walk'] },
  { id: 's2', category: 'providers', title: 'Sarah K.', subtitle: 'Dog Walker · 4.8', keywords: ['walker', 'sarah'] },
  { id: 's3', category: 'places', title: 'Zurichhorn Park', subtitle: 'Park · 1.2 km', keywords: ['park', 'zurichhorn'] },
  { id: 's4', category: 'pets', title: 'Luna', subtitle: 'Golden Retriever', keywords: ['luna', 'dog'] },
  { id: 's5', category: 'documents', title: 'Rabies Vaccination', subtitle: 'Medical Records', keywords: ['rabies', 'vaccine', 'document'] }
];

const UPCOMING_FEATURES = [
  { id: 'f1', title: 'Community Mode', icon: Globe, launchDate: '2026-03-15', waitlistCount: 1247, color: '#00C060', description: 'Connect with pet owners nearby.' },
  { id: 'f2', title: 'Smart Playdate Matching', icon: Sparkles, launchDate: '2026-04-10', waitlistCount: 523, color: '#007AFF', description: 'AI matching for compatible playdates.' },
  { id: 'f3', title: 'Expert Health Content', icon: Stethoscope, launchDate: '2026-05-05', waitlistCount: 892, color: '#FF9500', description: 'Vet-reviewed content and guides.' },
  { id: 'f4', title: 'Behavior Insights', icon: BrainCircuit, launchDate: '2026-09-01', waitlistCount: 412, color: '#AF52DE', description: 'AI-powered behavior pattern tracking.' }
];

const SettingsOverlay = ({ isOpen, onClose, onOpenComingSoon, onOpenAnimations }) => {
  if (!isOpen) return null;
  const nav = (path) => { window.location.href = path; };
  return (
    <div className="absolute inset-0 z-[70] bg-[#F0F0F2] animate-in slide-in-from-right-full duration-300">
      <div className="pt-14 pb-4 px-5 bg-[#F0F0F2] flex items-center justify-between">
        <h2 className="text-[24px] font-bold text-[#111111]">Settings</h2>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white border border-black/[0.06] flex items-center justify-center">
          <X size={20} />
        </button>
      </div>
      <div className="px-5 pb-28 overflow-y-auto custom-scrollbar h-full">
        <Card className="!p-4 mb-4 cursor-pointer active:scale-[0.98] transition-transform" onClick={() => nav('/user-profile')}>
          <div className="flex items-center gap-3">
            <Avatar src={MOCK_USER.avatar} size={52} />
            <div className="flex-1">
              <div className="text-[16px] font-bold text-[#111111]">Alex Mueller</div>
              <div className="text-[13px] text-[#6E6E73]">alex@example.com</div>
            </div>
            <ChevronRight size={18} className="text-[#C7C7CC]" />
          </div>
        </Card>
        <Card className="!p-0 overflow-hidden mb-4">
          <ListRow icon={Bell} title="Notifications" subtitle="Push, email, in-app" rightAccessory={<ChevronRight size={18} />} className="px-4" onClick={() => nav('/notification-prefs')} />
          <div className="h-[1px] bg-black/[0.04] ml-[56px]" />
          <ListRow icon={CreditCard} title="Payment & Wallet" subtitle="Cards, balance, transactions" rightAccessory={<ChevronRight size={18} />} className="px-4" onClick={() => nav('/wallet')} />
          <div className="h-[1px] bg-black/[0.04] ml-[56px]" />
          <ListRow icon={Shield} title="Subscription" subtitle="Fylos Free" rightAccessory={<ChevronRight size={18} />} className="px-4" onClick={() => nav('/subscription')} />
        </Card>
        <Card className="!p-0 overflow-hidden mb-4">
          <ListRow icon={Globe} title="Language" subtitle="English" rightAccessory={<ChevronRight size={18} />} className="px-4" onClick={() => nav('/language')} />
          <div className="h-[1px] bg-black/[0.04] ml-[56px]" />
          <ListRow icon={HeartPulse} title="Health Reminders" subtitle="Vaccinations, medications" rightAccessory={<ChevronRight size={18} />} className="px-4" onClick={() => nav('/health-reminders')} />
          <div className="h-[1px] bg-black/[0.04] ml-[56px]" />
          <ListRow icon={AlertTriangle} title="Emergency SOS" subtitle="Vet hotline, first aid" rightAccessory={<ChevronRight size={18} />} className="px-4" onClick={() => nav('/emergency')} />
        </Card>
        <Card className="!p-0 overflow-hidden mb-4">
          <ListRow icon={HelpCircle} title="Help Center" subtitle="FAQ, support, report" rightAccessory={<ChevronRight size={18} />} className="px-4" onClick={() => nav('/help')} />
          <div className="h-[1px] bg-black/[0.04] ml-[56px]" />
          <ListRow icon={Rocket} title="What's Coming" subtitle="Preview upcoming features" rightAccessory={<ChevronRight size={18} />} className="px-4" onClick={onOpenComingSoon} />
          <div className="h-[1px] bg-black/[0.04] ml-[56px]" />
          <ListRow icon={Sparkles} title="Animations Lab" subtitle="Micro-interactions showcase" rightAccessory={<ChevronRight size={18} />} className="px-4" onClick={onOpenAnimations} />
        </Card>
        <Card className="!p-0 overflow-hidden mb-4">
          <ListRow icon={Star} title="Become a Pro" subtitle="Register as walker or sitter" rightAccessory={<ChevronRight size={18} />} className="px-4" onClick={() => nav('/pro-registration')} />
        </Card>
        <Button variant="destructive" onClick={onClose}>Log Out</Button>
      </div>
    </div>
  );
};

const InboxAvatar = ({ src, initials, icon: Icon, size = 36 }) => {
  const fontSize = size * 0.4;
  return (
    <div className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} className="w-full h-full rounded-full object-cover border border-black/[0.04]" alt="Avatar" />
      ) : Icon ? (
        <div className="w-full h-full rounded-full bg-[#F7F7F8] border border-black/[0.04] flex items-center justify-center text-[#FF6B35]">
          <Icon size={size * 0.5} strokeWidth={2.5} />
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-[#F7F7F8] border border-black/[0.04] flex items-center justify-center text-[#111111] font-medium" style={{ fontSize }}>
          {initials}
        </div>
      )}
    </div>
  );
};

const InboxSegmentedControl = ({ segments, activeIndex, onChange }) => (
  <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-black/[0.04] relative">
    <div className="absolute top-1.5 bottom-1.5 bg-[#111111] rounded-full transition-all duration-[300ms] cubic-bezier(0.32, 0.72, 0, 1)" style={{ width: `calc(${100 / segments.length}% - 12px)`, left: `calc(${(100 / segments.length) * activeIndex}% + 6px)` }} />
    {segments.map((seg, i) => (
      <button key={seg} onClick={() => onChange(i)} className={`relative z-10 flex-1 py-1.5 text-[13px] font-semibold transition-colors duration-[200ms] ${activeIndex === i ? 'text-white' : 'text-[#8E8E93] hover:text-[#111111]'}`}>{seg}</button>
    ))}
  </div>
);

const InboxNotificationCard = ({ notification, onAction, onMarkRead, onArchive, onDelete, isLast, index, isSelectionMode, isSelected, onToggleSelect }) => {
  const { id, read, sender, title, body, timeAgo, actions } = notification;
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const initialOffset = useRef(0);
  const isHorizontalSwipe = useRef(null);
  const bgClass = read ? (index % 2 !== 0 ? 'bg-[#F4F4F6]' : 'bg-[#F9F9FB]') : 'bg-[#FFFFFF]';

  const handleStart = (clientX, clientY) => {
    if (isSelectionMode) return;
    touchStartX.current = clientX;
    touchStartY.current = clientY;
    initialOffset.current = swipeOffset;
    setIsSwiping(true);
    isHorizontalSwipe.current = null;
  };
  const handleMove = (clientX, clientY) => {
    if (!isSwiping || isSelectionMode) return;
    const diffX = clientX - touchStartX.current;
    const diffY = clientY - touchStartY.current;
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 5) isHorizontalSwipe.current = true;
      else if (Math.abs(diffY) > 5) isHorizontalSwipe.current = false;
    }
    if (isHorizontalSwipe.current) {
      const newOffset = initialOffset.current + diffX;
      setSwipeOffset(Math.max(-140, Math.min(0, newOffset)));
    }
  };
  const handleEnd = () => {
    if (isSelectionMode) return;
    setIsSwiping(false);
    setSwipeOffset(swipeOffset < -70 ? -140 : 0);
  };

  return (
    <div className="relative overflow-hidden mb-[1px]">
      {!isSelectionMode && (
        <div className="absolute inset-y-0 right-0 flex w-[140px] bg-[#F9F9FB]">
          <button onClick={() => { setSwipeOffset(0); onArchive(id); }} className="flex-1 flex flex-col items-center justify-center bg-[#FF9500] text-white active:brightness-95 transition-all"><Archive size={20} className="mb-1" /><span className="text-[10px] font-semibold">Archive</span></button>
          <button onClick={() => { setSwipeOffset(0); onDelete(id); }} className="flex-1 flex flex-col items-center justify-center bg-[#FF3B30] text-white active:brightness-95 transition-all"><Trash2 size={20} className="mb-1" /><span className="text-[10px] font-semibold">Delete</span></button>
        </div>
      )}
      <div
        className={`relative px-4 py-3.5 cursor-pointer ${bgClass}`}
        style={{ transform: `translateX(${swipeOffset}px)`, transition: isSwiping ? 'none' : 'transform 0.25s cubic-bezier(0.32, 0.72, 0, 1)' }}
        onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
        onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
        onMouseUp={handleEnd}
        onMouseLeave={() => isSwiping && handleEnd()}
        onClick={(e) => {
          if (isSelectionMode) onToggleSelect(id);
          else if (swipeOffset !== 0) { e.preventDefault(); setSwipeOffset(0); }
          else if (!read) onMarkRead(id);
        }}
      >
        <div className={`absolute ${isSelectionMode ? 'left-[42px]' : 'left-[10px]'} top-[25px] -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-[#FF7A4D] transition-all duration-[200ms] ${read ? 'opacity-0 scale-75' : 'opacity-100 scale-100'}`} />
        <div className="flex items-start">
          <div className={`flex items-center justify-center pt-2 transition-all duration-[250ms] overflow-hidden ${isSelectionMode ? 'w-8 opacity-100 mr-2' : 'w-0 opacity-0 mr-0'}`}>
            <div className={`shrink-0 w-[20px] h-[20px] rounded-full border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#FF3B30] border-[#FF3B30]' : 'border-[#CFCFD4] bg-transparent'}`}>
              {isSelected && <Check size={12} color="white" strokeWidth={3} />}
            </div>
          </div>
          <div className="flex gap-3 items-start flex-1 min-w-0 pl-2">
            <InboxAvatar src={sender.photo} icon={sender.icon} initials={sender.name.charAt(0)} size={36} />
            <div className="flex-1 min-w-0 flex flex-col gap-[2px] pointer-events-none">
              <div className="flex justify-between items-baseline gap-2">
                <span className={`text-[14px] truncate leading-tight ${read ? 'font-medium text-[#111111]' : 'font-semibold text-[#111111]'}`}>{title}</span>
                <span className={`text-[11px] shrink-0 font-medium ${read ? 'text-[#A1A1A6]' : 'text-[#8E8E93]'}`}>{timeAgo}</span>
              </div>
              <p className={`text-[13px] leading-[1.35] line-clamp-2 mt-0.5 ${read ? 'text-[#8E8E93]' : 'text-[#6E6E73]'}`}>{body}</p>
              {!isSelectionMode && actions && actions.length > 0 && (
                <div className="flex gap-1.5 mt-2.5 pointer-events-auto">
                  {actions.map((act) => (
                    <Button key={act.id} variant={act.type} size="small" fullWidth={false} onClick={(e) => { e.stopPropagation(); onAction(id, act.id); }}>
                      {act.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        {!isLast && <div className={`absolute bottom-0 right-0 h-[1px] bg-black/[0.03] transition-all duration-[250ms] ${isSelectionMode ? 'left-[94px]' : 'left-[62px]'}`} />}
      </div>
    </div>
  );
};

const NotificationsOverlay = ({ isOpen, onClose, notifications, onMarkAllRead, onToggleRead, onArchiveNotification, onDeleteNotification }) => {
  const [activeView, setActiveView] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const { progress: inboxScrollY, handleScroll: handleInboxScroll, reset: resetInboxCollapse } = useDirectionalCollapseProgress(104, { showFactor: 2.35 });

  useEffect(() => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  }, [isArchiveView, activeCategory]);
  useEffect(() => {
    resetInboxCollapse();
  }, [isArchiveView, activeView, activeCategory, isOpen, resetInboxCollapse]);

  if (!isOpen) return null;

  let filtered = notifications;
  if (isArchiveView) {
    filtered = filtered.filter((n) => n.archived);
    if (activeCategory !== 'all') filtered = filtered.filter((n) => n.category === activeCategory);
  } else {
    filtered = filtered.filter((n) => !n.archived);
    if (activeView === 1) filtered = filtered.filter((n) => !n.read);
    if (activeView === 2) filtered = filtered.filter((n) => n.actions && n.actions.length > 0 && !n.read);
    if (activeCategory !== 'all') filtered = filtered.filter((n) => n.category === activeCategory);
  }
  const grouped = filtered.reduce((acc, notif) => {
    const group = notif.timeGroup || 'Today';
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});

  const handleAction = (id) => onToggleRead(id);
  const handleMarkRead = (id) => onToggleRead(id);
  const handleArchive = (id) => onArchiveNotification?.(id);
  const handleDelete = (id) => onDeleteNotification?.(id);
  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };
  const handleDeleteSelected = () => {
    selectedIds.forEach((id) => onDeleteNotification?.(id));
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const chipsProgress = clamp01(inboxScrollY / 52);
  const segmentedProgress = clamp01((inboxScrollY - 52) / 52);
  const inboxTopPadding = 220 - (44 * chipsProgress) - (40 * segmentedProgress);
  const archiveTopPadding = 170 - (40 * chipsProgress);

  return (
    <div className="absolute inset-0 z-[70] bg-[var(--color-background)] animate-in slide-in-from-right-full duration-300">
      <div className="absolute top-0 left-0 w-full h-[160px] pointer-events-none z-10 bg-gradient-to-b from-[var(--color-background)] to-transparent" />
      <div className="absolute top-0 left-0 w-full z-20 pt-14 px-5 flex flex-col pointer-events-none">
        <div className="relative flex justify-between items-center w-full mb-4 pointer-events-auto">
          {isArchiveView && isSelectionMode ? (
            <>
              <button onClick={() => setIsSelectionMode(false)} className="px-2 h-9 flex items-center justify-center text-[#111111] active:opacity-70"><span className="text-[15px] font-medium">Cancel</span></button>
              <h2 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold text-[#111111]">{selectedIds.size > 0 ? `${selectedIds.size} Selected` : 'Select items'}</h2>
              <button onClick={handleDeleteSelected} disabled={selectedIds.size === 0} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${selectedIds.size > 0 ? 'bg-[#FFF0F0] text-[#FF3B30] active:scale-[0.96]' : 'bg-transparent text-[#CFCFD4]'}`}><Trash2 size={18} strokeWidth={2.5} /></button>
            </>
          ) : (
            <>
              <button onClick={isArchiveView ? () => setIsArchiveView(false) : onClose} className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-md border border-black/[0.04] text-[#111111] rounded-full active:scale-[0.96] transition-all"><ChevronLeft size={18} strokeWidth={2.5} /></button>
              <h2 className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold text-[#111111]">{isArchiveView ? 'Archive' : 'Inbox'}</h2>
              {!isArchiveView ? (
                <button onClick={() => setIsArchiveView(true)} className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-md border border-black/[0.04] text-[#111111] rounded-full active:scale-[0.96] transition-all"><Archive size={16} strokeWidth={2.5} /></button>
              ) : (
                <button onClick={() => setIsSelectionMode(true)} className="w-9 h-9 flex items-center justify-center bg-white/80 backdrop-blur-md border border-black/[0.04] text-[#FF3B30] rounded-full active:scale-[0.96] transition-all"><Trash2 size={16} strokeWidth={2.5} /></button>
              )}
            </>
          )}
        </div>
        {!isArchiveView && (
          <div
            style={{
              opacity: 1 - segmentedProgress,
              transform: `translateY(${-10 * segmentedProgress}px)`,
              pointerEvents: segmentedProgress > 0.96 ? 'none' : 'auto'
            }}
            className="transition-[opacity,transform] duration-200"
          >
            <InboxSegmentedControl segments={['All', 'Unread', 'Actionable']} activeIndex={activeView} onChange={setActiveView} />
          </div>
        )}
        <div
          style={{
            opacity: isSelectionMode ? 0.5 : (1 - chipsProgress),
            transform: `translateY(${-10 * chipsProgress}px)`,
            pointerEvents: isSelectionMode || chipsProgress > 0.96 ? 'none' : 'auto'
          }}
          className={`relative ${isArchiveView ? 'mt-0' : 'mt-3'} -mx-5 transition-[opacity,transform] duration-200`}
        >
          <div className="flex gap-2 overflow-x-auto hide-scrollbar px-5 pb-2 pt-1">
            {INBOX_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full whitespace-nowrap text-[12px] font-semibold active:scale-[0.96] transition-all duration-[180ms] shrink-0 border ${isActive ? 'bg-[#111111] text-white border-transparent' : 'bg-white/90 backdrop-blur-md text-[#6E6E73] border-black/[0.05] hover:bg-white hover:text-[#111111]'}`}>
                  {Icon && <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />}
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--color-background)] to-transparent pointer-events-none" />
        </div>
      </div>
      <div
        onScroll={handleInboxScroll}
        className="absolute inset-0 overflow-y-auto hide-scrollbar pb-12 px-5 bg-transparent scroll-smooth z-0 transition-all duration-300"
        style={{ paddingTop: `${isArchiveView ? archiveTopPadding : inboxTopPadding}px` }}
      >
        {filtered.length === 0 ? (
          <EmptyState icon={isArchiveView ? Archive : Check} title={isArchiveView ? 'Archive is empty' : (activeView === 2 ? 'Nothing to do!' : 'All caught up!')} description={isArchiveView ? 'Archived items will appear here.' : (activeView === 2 ? 'You have no pending action items.' : 'You have no new notifications right now.')} />
        ) : (
          <div className="pb-6">
            {Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-7">
                <div className={`text-[12px] font-medium text-[#8E8E93] mb-2 ml-1 transition-opacity ${isSelectionMode ? 'opacity-40' : 'opacity-100'}`}>{group}</div>
                <div className="bg-[#F9F9FB] rounded-[22px] overflow-hidden border border-black/[0.03]">
                  {items.map((notif, index) => (
                    <InboxNotificationCard
                      key={notif.id}
                      notification={notif}
                      onAction={handleAction}
                      onMarkRead={handleMarkRead}
                      onArchive={handleArchive}
                      onDelete={handleDelete}
                      index={index}
                      isLast={index === items.length - 1}
                      isSelectionMode={isSelectionMode}
                      isSelected={selectedIds.has(notif.id)}
                      onToggleSelect={handleToggleSelect}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {!isArchiveView && (
        <button onClick={onMarkAllRead} className="absolute top-[66px] right-[74px] z-30 text-[12px] font-semibold text-[#FF6A3D] active:opacity-70">
          Mark all
        </button>
      )}
    </div>
  );
};

const SearchOverlay = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'providers', 'places', 'pets', 'documents'];
  if (!isOpen) return null;
  const results = SEARCH_INDEX_DATA.filter((item) => {
    const q = query.trim().toLowerCase();
    if (!q) return false;
    const inFilter = filter === 'all' || item.category === filter;
    const match = item.title.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.keywords.some((k) => k.includes(q));
    return inFilter && match;
  });
  return (
    <div className="absolute inset-0 z-[80] bg-white/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="pt-14 px-5 pb-4 border-b border-black/[0.04] bg-white/70">
        <div className="flex items-center gap-3">
          <SearchInput value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} placeholder="Search FYLOS..." className="flex-1" />
          <button onClick={onClose} className="text-[15px] font-medium">Cancel</button>
        </div>
      </div>
      <div className="px-5 pt-4 pb-28 overflow-y-auto custom-scrollbar h-full">
        {query.trim().length < 2 ? (
          <>
            <Text variant="label" className="mb-3">Quick Actions</Text>
            <div className="grid grid-cols-2 gap-3">
              {SEARCH_QUICK_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <Card key={action.id} clickable className="!p-4 text-left">
                    <div className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center mb-2"><Icon size={18} /></div>
                    <div className="text-[14px] font-semibold text-[#111111]">{action.label}</div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-4">
              {filters.map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap ${filter === f ? 'bg-[#111111] text-white' : 'bg-[#F7F7F8] text-[#6E6E73]'}`}>
                  {f}
                </button>
              ))}
            </div>
            {results.length === 0 ? (
              <EmptyState icon={Search} title={`No results for "${query}"`} description="Try searching providers, places or documents." />
            ) : (
              <div className="space-y-2">
                {results.map((item) => (
                  <Card key={item.id} clickable className="!p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F7F7F8] flex items-center justify-center"><Search size={16} /></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[15px] font-semibold text-[#111111] truncate">{item.title}</div>
                        <div className="text-[13px] text-[#6E6E73] truncate">{item.subtitle}</div>
                      </div>
                      <ChevronRight size={16} className="text-[#CFCFD4]" />
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ComingSoonOverlay = ({ isOpen, onClose, joinedWaitlists, onToggleWaitlist }) => {
  if (!isOpen) return null;
  const getDaysLeft = (date) => Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  return (
    <div className="absolute inset-0 z-[75] bg-[#F0F0F2] animate-in slide-in-from-right-full duration-300">
      <div className="pt-14 pb-4 px-5 border-b border-black/[0.04] bg-[#F0F0F2] flex items-center gap-3">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-black/[0.06]"><ChevronLeft size={20} /></button>
        <h2 className="text-[17px] font-semibold text-[#111111]">What's Coming</h2>
      </div>
      <div className="px-5 pt-4 pb-28 overflow-y-auto custom-scrollbar h-full space-y-4">
        {UPCOMING_FEATURES.map((feature) => {
          const Icon = feature.icon;
          const joined = joinedWaitlists.has(feature.id);
          return (
            <Card key={feature.id} className="!p-5">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center" style={{ backgroundColor: `${feature.color}1A` }}>
                  <Icon size={22} color={feature.color} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[17px] font-bold text-[#111111]">{feature.title}</h4>
                  <p className="text-[13px] text-[#6E6E73] mt-1">{feature.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="warning" className="!normal-case !tracking-normal">in {getDaysLeft(feature.launchDate)} days</Badge>
                    <span className="text-[12px] text-[#8E8E93]">{feature.waitlistCount.toLocaleString()} interested</span>
                  </div>
                </div>
              </div>
              <Button className="mt-4" variant={joined ? 'secondary' : 'primary'} onClick={() => onToggleWaitlist(feature.id)}>
                {joined ? 'Joined waitlist' : 'Join waitlist'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

const AnimationsOverlay = ({ isOpen, onClose }) => {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[75] bg-white animate-in slide-in-from-right-full duration-300">
      <div className="pt-14 pb-4 px-5 border-b border-black/[0.04] bg-white flex items-center gap-3">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center"><ChevronLeft size={20} /></button>
        <h2 className="text-[17px] font-semibold text-[#111111]">Animations Lab</h2>
      </div>
      <div className="px-5 pt-6 pb-28 space-y-5 overflow-y-auto custom-scrollbar h-full">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-[#111111]">Like interaction</span>
            <button onClick={() => setLiked((v) => !v)} className={`w-11 h-11 rounded-full border flex items-center justify-center transition-all ${liked ? 'bg-[#FFE5E5] border-[#FF3B30]/30 scale-110' : 'bg-white border-black/[0.08]'}`}>
              <Heart size={20} className={liked ? 'text-[#FF3B30] fill-[#FF3B30]' : 'text-[#111111]'} />
            </button>
          </div>
        </Card>
        <Card>
          <div className="space-y-3">
            <span className="text-[15px] font-semibold text-[#111111]">Loading state</span>
            <Button isLoading={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }}>
              Run animation
            </Button>
          </div>
        </Card>
        <Card>
          <div className="space-y-3">
            <span className="text-[15px] font-semibold text-[#111111]">Status feedback</span>
            <div className="flex items-center gap-2 text-[14px] text-[#00C060] font-semibold"><CheckCircle2 size={16} /> Success spring animation ready</div>
            <div className="flex items-center gap-2 text-[14px] text-[#FF9500] font-semibold"><Megaphone size={16} /> Haptic + motion hooks prepared</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- APP SHELL (MAIN ENTRY POINT) ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [displayTab, setDisplayTab] = useState('home');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(() => !window.__fylosPetPending);
  
  // App-level state for Pets Module
  const [petsData, setPetsData] = useState(INITIAL_MOCK_PETS);
  const [petsRoute, setPetsRoute] = useState('list'); // 'list' | 'profile' | 'family'
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [publicViewPetId, setPublicViewPetId] = useState(null);
  const [servicesRoute, setServicesRoute] = useState('home'); // 'home' | 'walking' | 'bookings'
  const [pushedScreen, setPushedScreen] = useState(null);
  const [screenParams, setScreenParams] = useState({});
  const [bookingStatus, setBookingStatus] = useState('confirmed');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [petMenuOpen, setPetMenuOpen] = useState(false);
  const [inboxOpen, setInboxOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [animationsOpen, setAnimationsOpen] = useState(false);
  const [appNotifications, setAppNotifications] = useState(APP_NOTIFICATIONS);
  const [joinedWaitlists, setJoinedWaitlists] = useState(new Set());
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const [celebration, setCelebration] = useState(null);
  const lastMainScrollYRef = useRef(0);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 800);
  }, []);
  // Detect new pet from Add Pet flow — branded loading → celebration overlay
  const startCelebration = useCallback((petData) => {
    const { name, petType, photo } = petData;
    setCelebration({ name, petType, photo, phase: 'loading' });
    setTimeout(() => setCelebration(prev => prev ? { ...prev, phase: 'celebrate' } : null), 1600);
    setTimeout(() => setCelebration(prev => prev ? { ...prev, phase: 'fadeout' } : null), 5200);
    setTimeout(() => {
      setCelebration(null);
      setToastMessage(`${name} added! Tap to complete their profile`);
      setTimeout(() => setToastMessage(null), 5000);
    }, 5800);
  }, []);

  // On mount: check if we came from add-pet
  useEffect(() => {
    if (window.__fylosPetPending) {
      const data = window.__fylosPetPending;
      delete window.__fylosPetPending;
      startCelebration(data);
    }
  }, [startCelebration]);

  // Also listen for event (fallback)
  useEffect(() => {
    const handleNewPet = (e) => {
      const name = e.detail?.name || 'Pet';
      const petType = e.detail?.petType || 'dog';
      const photo = e.detail?.photo || null;
      setIsLoading(false);
      startCelebration({ name, petType, photo });
    };
    window.addEventListener('fylos-pet-added', handleNewPet);
    return () => window.removeEventListener('fylos-pet-added', handleNewPet);
  }, [startCelebration]);
  useEffect(() => {
    const handleMainScroll = (event) => {
      const currentY = event?.detail?.scrollTop ?? 0;
      const delta = currentY - lastMainScrollYRef.current;
      if (currentY <= 12) {
        setIsTabBarVisible(true);
      } else if (delta > 6) {
        setIsTabBarVisible(false);
      } else if (delta < -3) {
        setIsTabBarVisible(true);
      }
      lastMainScrollYRef.current = currentY;
    };
    window.addEventListener('fylos-main-scroll', handleMainScroll);
    return () => window.removeEventListener('fylos-main-scroll', handleMainScroll);
  }, []);

  useEffect(() => {
    const handleGlobalSearchShortcut = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalSearchShortcut);
    return () => window.removeEventListener('keydown', handleGlobalSearchShortcut);
  }, []);

  // Pets Routing Logic
  useEffect(() => {
    if (displayTab === 'pets') {
      if (petsData.length === 1 && petsRoute !== 'profile' && petsRoute !== 'family') {
        setPetsRoute('profile');
        setSelectedPetId(petsData[0].id);
      } else if (petsData.length > 1 && !selectedPetId && petsRoute !== 'list') {
        setPetsRoute('list');
      }
    }
  }, [displayTab, petsData.length, selectedPetId, petsRoute]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const navigateTo = (routeId, params = {}) => {
    if (routeId === 'provider_profile' || routeId === 'reviews' || routeId === 'booking' || routeId === 'payment' || routeId === 'request_sent' || routeId === 'booking_details' || routeId === 'chat' || routeId === 'booking_accepted' || routeId === 'booking_declined' || routeId === 'vault_documents' || routeId === 'vault_contacts' || routeId === 'vault_places') {
      setPushedScreen(routeId);
      setScreenParams(params);
      return;
    }
    setIsFading(true);
    setTimeout(() => {
      if (routeId === 'services/walking') {
        setServicesRoute('walking');
      } else if (routeId === 'services/bookings') {
        setServicesRoute('bookings');
      } else {
        setServicesRoute('home');
        setDisplayTab(routeId);
      }
      setIsFading(false);
    }, 150);
  };

  const handleTabChange = (tabId) => {
    if (tabId === activeTab && servicesRoute === 'home' && !pushedScreen) return; 
    setActiveTab(tabId);
    setServicesRoute('home');
    setPushedScreen(null);
    setScreenParams({});
    setSettingsOpen(false);
    setInboxOpen(false);
    setSearchOpen(false);
    setComingSoonOpen(false);
    setAnimationsOpen(false);
    setIsFading(true);
    setTimeout(() => {
      setDisplayTab(tabId);
      setIsFading(false);
    }, 150);
  };

  const handlePetSelect = (id) => {
    setSelectedPetId(id);
    setPetsRoute('profile');
  };

  const handlePetBack = () => {
    if (petsRoute === 'family') {
      setPetsRoute('profile');
    } else if (petsData.length > 1) {
      setPetsRoute('list');
      setSelectedPetId(null);
    } else {
      handleTabChange('home');
    }
  };

  const handleUpdatePet = (updatedPet) => {
    setPetsData(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
  };

  const hideGlobalHeader = displayTab === 'services' && (servicesRoute === 'walking' || servicesRoute === 'bookings');

  const renderScreen = () => {
    if (displayTab === 'pets') {
      if (petsRoute === 'family') {
        return <FamilySharingScreen onBack={handlePetBack} showToast={showToast} />;
      }
      if (petsRoute === 'profile') {
        const pet = petsData.find(p => p.id === selectedPetId) || petsData[0];
        return <PetProfileScreen pet={pet} onUpdate={handleUpdatePet} showToast={showToast} onOpenPublicView={setPublicViewPetId} onNavigateToFamily={() => setPetsRoute('family')} />;
      }
      return <PetListScreen pets={petsData} onSelectPet={handlePetSelect} />;
    }

    if (displayTab === 'services' && servicesRoute === 'walking') {
      return <WalkingScreen onBack={() => navigateTo('services')} petsData={petsData} />;
    }
    if (displayTab === 'services' && servicesRoute === 'bookings') {
      return <BookingsScreen onBack={() => navigateTo('services')} onOpenDetails={(booking) => { setBookingStatus(booking.status); navigateTo('booking_details'); }} />;
    }
    
    switch (displayTab) {
      case 'home': return (
        <HomeScreen
          onNavigate={handleTabChange}
          notifications={appNotifications}
          onOpenInbox={() => setInboxOpen(true)}
          onOpenHealthRecords={() => {
            setActiveTab('vault');
            setDisplayTab('vault');
            setServicesRoute('home');
            setPushedScreen('vault_health_records');
          }}
        />
      );
      case 'services': return <ServicesScreen onNavigate={navigateTo} />;
      case 'activity': return <ActivityScreen isTabBarVisible={isTabBarVisible} />;
      case 'vault': return <VaultScreen onOpenHealthRecords={() => setPushedScreen('vault_health_records')} onOpenDocuments={() => setPushedScreen('vault_documents')} onOpenContacts={() => setPushedScreen('vault_contacts')} onOpenPlaces={() => setPushedScreen('vault_places')} />;
      default: return (
        <HomeScreen
          onNavigate={handleTabChange}
          notifications={appNotifications}
          onOpenInbox={() => setInboxOpen(true)}
          onOpenHealthRecords={() => {
            setActiveTab('vault');
            setDisplayTab('vault');
            setServicesRoute('home');
            setPushedScreen('vault_health_records');
          }}
        />
      );
    }
  };

  const getHeaderConfig = () => {
    if (hideGlobalHeader) return null;
    if (activeTab === 'pets') {
      if (petsRoute === 'family') {
        return { title: 'Family sharing', variant: 'detail', onBack: handlePetBack };
      }
      if (petsRoute === 'profile') {
        const pet = petsData.find(p => p.id === selectedPetId) || petsData[0];
        return { title: pet ? pet.name : 'Profile', variant: 'detail', onBack: handlePetBack, rightIcon: MoreHorizontal, onRightAction: () => setPetMenuOpen(true) };
      }
      return { title: 'Pets', variant: 'default', showActions: true };
    }
    if (activeTab === 'vault' && pushedScreen === 'vault_documents') {
      return { title: 'Documents', variant: 'detail', onBack: () => setPushedScreen(null), rightIcon: MoreVertical };
    }
    if (activeTab === 'home') return { title: 'FYLOS', variant: 'default', showActions: true };
    const tab = TABS.find(t => t.id === activeTab);
    return { title: tab ? tab.label : 'FYLOS', variant: 'default', showActions: true };
  };

  const headerConfig = getHeaderConfig();
  const unreadAppNotifications = appNotifications.filter((n) => !n.read).length;
  const overlayOpen = settingsOpen || inboxOpen || searchOpen || comingSoonOpen || animationsOpen;

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center sm:p-8 font-sans antialiased selection:bg-[#E85D2A]/20 selection:text-[#E85D2A]">
      <GlobalStyles />
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.25); }
        .friends-suggestions-scroll::-webkit-scrollbar { display: none; height: 0; }
        .friends-suggestions-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .bg-grain::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.02;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
        @keyframes springBump {
          0% { transform: scale(1); }
          40% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-spring-bump { animation: springBump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        /* Milestone float animations */
        @keyframes milestoneFloatA {
          0%, 100% { transform: translateY(0) rotate(-1.5deg); }
          50% { transform: translateY(-3px) rotate(-0.5deg); }
        }
        @keyframes milestoneFloatB {
          0%, 100% { transform: translateY(0) rotate(1deg); }
          50% { transform: translateY(-4px) rotate(1.5deg); }
        }

        /* Home staggered entrance */
        @keyframes homeReveal {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Home mascot gentle wave */
        @keyframes homeMascotWave {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-2px) rotate(2deg); }
          75% { transform: translateY(1px) rotate(-1deg); }
        }

        /* Pet Added Celebration — Mascot keyframes */
        @keyframes ap-mascotEntry {
          0% { opacity: 0; transform: scale(0.6) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes ap-glowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 1; }
        }
        @keyframes ap-sparkle {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes ap-confetti {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-5px) rotate(180deg); opacity: 0.8; }
        }
        /* Pet Added Celebration Overlay Animations */
        @keyframes celebOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes celebOverlayOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes celebLetterReveal {
          from { opacity: 0; transform: translateY(12px) scale(0.7); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes celebDotPop {
          from { opacity: 0; transform: scale(0); }
          60% { opacity: 1; transform: scale(1.6); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes celebPawStep {
          from { opacity: 0; transform: translateY(20px) scale(0.6) rotate(-15deg); }
          60% { opacity: 0.08; }
          to { opacity: 0.06; transform: translateY(0) scale(1) rotate(0deg); }
        }
        @keyframes celebSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes celebArcGrow {
          from { stroke-dasharray: 0 100; }
          to { stroke-dasharray: 75 25; }
        }
        @keyframes celebBounceIn {
          from { opacity: 0; transform: scale(0.3) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes celebFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes celebConfettiFall {
          0% { opacity: 0; transform: translateY(-20px) rotate(0deg); }
          15% { opacity: 1; }
          100% { opacity: 0; transform: translateY(700px) rotate(720deg); }
        }
        @keyframes celebDotPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes celebRingBurst {
          from { transform: scale(0); opacity: 0.4; }
          to { transform: scale(2.5); opacity: 0; }
        }

        /* Step 4 Energy Slider Custom CSS */
        .energy-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          outline: none;
        }
        .energy-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #FFFFFF;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          cursor: pointer;
        }
        .energy-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #FFFFFF;
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 50%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.12);
          cursor: pointer;
        }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[var(--color-background)] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-[120] pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {isLoading ? (
          <div className="absolute inset-0 bg-[var(--color-background)] z-50 flex flex-col items-center justify-center animate-out fade-out duration-500 fill-mode-forwards delay-700">
            <FylosLogo fontSize="32px" textColor="var(--color-primary-text)" className="mb-3" />
            <p className="text-[14px] text-[var(--color-tertiary-text)] animate-pulse">Loading...</p>
          </div>
        ) : (
          <>
            <main className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              {renderScreen()}
            </main>
            
            <div className={`transition-opacity duration-300 ${(pushedScreen && pushedScreen !== 'vault_documents') || overlayOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
              {!hideGlobalHeader && headerConfig && (
                <Header
                  {...headerConfig}
                  user={MOCK_USER}
                  unreadCount={unreadAppNotifications}
                  onSearch={() => setSearchOpen(true)}
                  onInbox={() => setInboxOpen(true)}
                  onProfile={() => setSettingsOpen(true)}
                />
              )}
              {petsRoute !== 'family' && <TabBar activeTab={activeTab} onTabChange={handleTabChange} visible={isTabBarVisible} />}
            </div>
            <Toast message={toastMessage} />

            {pushedScreen === 'provider_profile' && (
              <ProviderProfileScreen 
                provider={mockProviderProfile} 
                onBack={() => { setPushedScreen(null); setScreenParams({}); }} 
                onNavigate={(screen, params) => navigateTo(screen, params)}
              />
            )}

            {pushedScreen === 'reviews' && (
              <ReviewsScreen 
                provider={mockProviderProfile} 
                onBack={() => setPushedScreen('provider_profile')} 
              />
            )}

            {pushedScreen === 'booking' && (
              <BookingScreen 
                provider={mockBookingData.provider}
                preselectedServiceId={screenParams.preselectedServiceId}
                onBack={() => setPushedScreen('provider_profile')}
                onClose={() => { setPushedScreen(null); setScreenParams({}); }}
                onContinue={() => setPushedScreen('payment')}
              />
            )}

            {pushedScreen === 'payment' && (
              <PaymentScreen
                onBack={() => setPushedScreen('booking')}
                onComplete={() => setPushedScreen('request_sent')}
              />
            )}

            {pushedScreen === 'request_sent' && (
              <RequestSentScreen
                onClose={() => { setPushedScreen(null); setScreenParams({}); }}
                onViewBooking={() => setPushedScreen('booking_details')}
              />
            )}

            {pushedScreen === 'booking_details' && (
              <BookingDetailsScreen
                status={bookingStatus}
                setStatus={setBookingStatus}
                onBack={() => { setPushedScreen(null); setScreenParams({}); }}
                onNavigateToProvider={() => setPushedScreen('provider_profile')}
                onOpenChat={() => setPushedScreen('chat')}
                onShowAccepted={() => setPushedScreen('booking_accepted')}
                onShowDeclined={() => setPushedScreen('booking_declined')}
              />
            )}

            {pushedScreen === 'booking_accepted' && (
              <BookingConfirmedScreen
                onClose={() => { setPushedScreen('booking_details'); }}
                onMessage={() => { setPushedScreen('chat'); }}
              />
            )}

            {pushedScreen === 'booking_declined' && (
              <BookingDeclinedScreen
                onClose={() => { setPushedScreen('booking_details'); }}
                onBrowse={() => { setPushedScreen(null); setScreenParams({}); navigateTo('services/walking'); }}
                onMessage={() => { setPushedScreen('chat'); }}
              />
            )}

            {pushedScreen === 'chat' && (
              <ChatScreen
                status={bookingStatus}
                onBack={() => setPushedScreen('booking_details')}
              />
            )}

            {pushedScreen === 'vault_health_records' && (
              <VaultHealthRecordsScreen onBack={() => setPushedScreen(null)} />
            )}

            {pushedScreen === 'vault_documents' && (
              <VaultDocumentsScreen />
            )}

            {pushedScreen === 'vault_contacts' && (
              <EmergencyContactsScreen onBack={() => setPushedScreen(null)} />
            )}

            {pushedScreen === 'vault_places' && (
              <VaultPlacesScreen onBack={() => setPushedScreen(null)} />
            )}

            {publicViewPetId && (
              <PublicEmergencyViewer 
                pet={petsData.find(p => p.id === publicViewPetId)} 
                onClose={() => setPublicViewPetId(null)} 
              />
            )}

            <SettingsOverlay
              isOpen={settingsOpen}
              onClose={() => setSettingsOpen(false)}
              onOpenComingSoon={() => { setSettingsOpen(false); setComingSoonOpen(true); }}
              onOpenAnimations={() => { setSettingsOpen(false); setAnimationsOpen(true); }}
            />

            <NotificationsOverlay
              isOpen={inboxOpen}
              onClose={() => setInboxOpen(false)}
              notifications={appNotifications}
              onMarkAllRead={() => setAppNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
              onToggleRead={(id) => setAppNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true, actions: [] } : n)))}
              onArchiveNotification={(id) => setAppNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, archived: true } : n)))}
              onDeleteNotification={(id) => setAppNotifications((prev) => prev.filter((n) => n.id !== id))}
            />

            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            <ComingSoonOverlay
              isOpen={comingSoonOpen}
              onClose={() => setComingSoonOpen(false)}
              joinedWaitlists={joinedWaitlists}
              onToggleWaitlist={(featureId) =>
                setJoinedWaitlists((prev) => {
                  const next = new Set(prev);
                  if (next.has(featureId)) next.delete(featureId);
                  else next.add(featureId);
                  return next;
                })
              }
            />

            {/* Pet Added — Branded Loading → Celebration Overlay */}
            {celebration && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 400,
                background: celebration.phase === 'loading'
                  ? 'var(--color-background, #FBF9F7)'
                  : 'rgba(251,249,247,0.45)',
                backdropFilter: celebration.phase === 'loading' ? 'none' : 'blur(10px)',
                WebkitBackdropFilter: celebration.phase === 'loading' ? 'none' : 'blur(10px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.6s ease, backdrop-filter 0.6s ease',
                animation: celebration.phase === 'fadeout'
                  ? 'celebOverlayOut 0.6s ease-in both'
                  : 'celebOverlayIn 0.3s ease-out both',
              }}>

                {/* ═══ PHASE 1: Branded Loading ═══ */}
                {celebration.phase === 'loading' && (
                  <div style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    animation: 'celebOverlayIn 0.2s ease-out both',
                  }}>
                    {/* Animated paw prints walking up */}
                    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                      {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                          position: 'absolute',
                          left: `${30 + (i % 2 === 0 ? -8 : 8)}%`,
                          bottom: `${-10 + i * 18}%`,
                          opacity: 0,
                          animation: `celebPawStep 0.4s ${i * 0.2}s ease-out both`,
                        }}>
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" opacity="0.08">
                            <ellipse cx="12" cy="16" rx="5" ry="4.5" fill="#E85D2A" />
                            <circle cx="7" cy="10" r="2.2" fill="#E85D2A" />
                            <circle cx="17" cy="10" r="2.2" fill="#E85D2A" />
                            <circle cx="10" cy="7" r="2" fill="#E85D2A" />
                            <circle cx="14" cy="7" r="2" fill="#E85D2A" />
                          </svg>
                        </div>
                      ))}
                    </div>

                    {/* FYLOS logo — letter-by-letter reveal */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      gap: 2,
                      fontFamily: '"Nunito", sans-serif',
                    }}>
                      {'FYLOS'.split('').map((letter, i) => (
                        <span key={i} style={{
                          fontSize: 38, fontWeight: 800,
                          color: 'var(--color-primary-text, #111)',
                          display: 'inline-block',
                          opacity: 0,
                          animation: `celebLetterReveal 0.35s ${i * 0.08}s cubic-bezier(0.34, 1.56, 0.64, 1) both`,
                        }}>{letter}</span>
                      ))}
                      <div style={{
                        width: 9, height: 9,
                        borderRadius: 9999,
                        backgroundColor: '#FF6B35',
                        marginLeft: 3,
                        opacity: 0,
                        animation: 'celebDotPop 0.5s 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                      }} />
                    </div>

                    {/* Warm tagline */}
                    <p style={{
                      fontSize: 14,
                      color: 'var(--color-tertiary-text, #8E8E93)',
                      fontFamily: '"Nunito", sans-serif',
                      fontWeight: 600,
                      marginTop: 10,
                      opacity: 0,
                      animation: 'celebFadeUp 0.4s 0.6s ease-out both',
                    }}>Saving {celebration.name}'s profile...</p>

                    {/* Animated progress arc */}
                    <div style={{ marginTop: 28, opacity: 0, animation: 'celebFadeUp 0.3s 0.7s ease-out both' }}>
                      <svg width="40" height="40" viewBox="0 0 40 40" style={{ animation: 'celebSpin 1.2s linear infinite' }}>
                        <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(232,93,42,0.12)" strokeWidth="3" />
                        <circle cx="20" cy="20" r="16" fill="none" stroke="#E85D2A" strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray="75 25"
                          style={{ animation: 'celebArcGrow 1s 0.8s ease-out both' }}
                        />
                      </svg>
                    </div>
                  </div>
                )}

                {/* ═══ PHASE 2: Celebration ═══ */}
                {(celebration.phase === 'celebrate' || celebration.phase === 'fadeout') && (
                  <>
                    {/* Confetti burst */}
                    {Array.from({ length: 32 }).map((_, i) => {
                      const colors = ['#E85D2A', '#FF7240', '#FFD700', '#34C759', '#FF6B8A', '#7C5CFC', '#5AC8FA'];
                      const color = colors[i % colors.length];
                      const left = 5 + Math.random() * 90;
                      const delay = Math.random() * 0.6;
                      const duration = 2.2 + Math.random() * 1.5;
                      const size = 4 + Math.random() * 7;
                      const rotation = Math.random() * 360;
                      return (
                        <div key={i} style={{
                          position: 'absolute',
                          left: `${left}%`,
                          top: '-5%',
                          width: size,
                          height: size * (Math.random() > 0.5 ? 1 : 2.8),
                          background: color,
                          borderRadius: Math.random() > 0.5 ? 9999 : 2,
                          transform: `rotate(${rotation}deg)`,
                          animation: `celebConfettiFall ${duration}s ${delay}s cubic-bezier(0.25, 0.46, 0.45, 0.94) both`,
                          opacity: 0,
                        }} />
                      );
                    })}

                    {/* Radial burst ring */}
                    <div style={{
                      position: 'absolute',
                      width: 200, height: 200,
                      borderRadius: 9999,
                      border: '2px solid rgba(232,93,42,0.15)',
                      animation: 'celebRingBurst 0.8s ease-out both',
                    }} />

                    {/* Mascot */}
                    <div style={{
                      animation: 'celebBounceIn 0.6s 0.1s cubic-bezier(0.22,1,0.36,1) both',
                      transform: 'scale(1.3)',
                    }}>
                      <AddPetMascot step={3} petType={celebration.petType} petName={celebration.name} focusedField={null} scrollProgress={0} />
                    </div>

                    {/* Avatar */}
                    <div style={{
                      width: 76, height: 76, borderRadius: 9999, overflow: 'hidden',
                      border: '3px solid #E85D2A',
                      boxShadow: '0 8px 32px rgba(232,93,42,0.25), 0 0 0 6px rgba(232,93,42,0.08)',
                      marginTop: 16,
                      animation: 'celebBounceIn 0.5s 0.25s cubic-bezier(0.22,1,0.36,1) both',
                    }}>
                      {celebration.photo ? (
                        <img src={celebration.photo} alt={celebration.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: 'linear-gradient(135deg, #FF7240, #E85D2A)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{ fontSize: 30, fontWeight: 800, color: '#FFF', fontFamily: '"Nunito", sans-serif' }}>
                            {(celebration.name || '?').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Text */}
                    <h2 style={{
                      fontSize: 28, fontWeight: 900, color: '#111',
                      fontFamily: '"Nunito", sans-serif',
                      marginTop: 20, textAlign: 'center',
                      animation: 'celebFadeUp 0.5s 0.4s cubic-bezier(0.22,1,0.36,1) both',
                    }}>{celebration.name} is in!</h2>
                    <p style={{
                      fontSize: 15, color: '#8E8E93',
                      fontFamily: '"Nunito", sans-serif',
                      fontWeight: 500,
                      marginTop: 6, textAlign: 'center',
                      animation: 'celebFadeUp 0.5s 0.5s cubic-bezier(0.22,1,0.36,1) both',
                    }}>Welcome to the family</p>

                    {/* Paw trail dots */}
                    <div style={{
                      display: 'flex', gap: 8, marginTop: 32,
                      animation: 'celebFadeUp 0.5s 0.65s cubic-bezier(0.22,1,0.36,1) both',
                    }}>
                      {[0, 1, 2].map(i => (
                        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill="none"
                          style={{ animation: `celebDotPulse 1.2s ${i * 0.2}s ease-in-out infinite` }}>
                          <ellipse cx="12" cy="16" rx="4.5" ry="4" fill="#E85D2A" />
                          <circle cx="7.5" cy="10.5" r="2" fill="#E85D2A" />
                          <circle cx="16.5" cy="10.5" r="2" fill="#E85D2A" />
                          <circle cx="10" cy="7.5" r="1.8" fill="#E85D2A" />
                          <circle cx="14" cy="7.5" r="1.8" fill="#E85D2A" />
                        </svg>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            <AnimationsOverlay isOpen={animationsOpen} onClose={() => setAnimationsOpen(false)} />

            {/* Pet Profile Dropdown Menu */}
            {petMenuOpen && (
              <>
                <div className="absolute inset-0 z-[90]" onClick={() => setPetMenuOpen(false)} />
                <div className="absolute top-[105px] right-6 z-[95] w-[180px] rounded-[14px] py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)]" style={{ background: '#FBF9F7', border: '1px solid #EDE8E2', animation: 'homeReveal 0.2s cubic-bezier(0.22,1,0.36,1) both' }}>
                  <button onClick={() => { setPetMenuOpen(false); window.location.href = '/edit-pet'; }} className="w-full flex items-center gap-2.5 px-4 py-2.5 active:opacity-60 text-left">
                    <Pencil size={14} className="text-[#A09A94]" />
                    <span className="text-[13px] font-semibold text-[#111]">Edit Profile</span>
                  </button>
                  <button onClick={() => { setPetMenuOpen(false); setToastMessage('Coming soon'); setTimeout(() => setToastMessage(null), 2000); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 active:opacity-60 text-left">
                    <Camera size={14} className="text-[#A09A94]" />
                    <span className="text-[13px] font-semibold text-[#111]">Change Photo</span>
                  </button>
                  <button onClick={() => { setPetMenuOpen(false); setToastMessage('Coming soon'); setTimeout(() => setToastMessage(null), 2000); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 active:opacity-60 text-left">
                    <Share2 size={14} className="text-[#A09A94]" />
                    <span className="text-[13px] font-semibold text-[#111]">Share</span>
                  </button>
                  <div className="mx-3 h-[1px] bg-[#EDE8E2] my-1" />
                  <button onClick={() => { setPetMenuOpen(false); setToastMessage('Coming soon'); setTimeout(() => setToastMessage(null), 2000); }} className="w-full flex items-center gap-2.5 px-4 py-2.5 active:opacity-60 text-left">
                    <Trash2 size={14} className="text-[#E85D2A]" />
                    <span className="text-[13px] font-semibold text-[#E85D2A]">Delete Pet</span>
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}