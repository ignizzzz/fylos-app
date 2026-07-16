// Reference pools the generator draws from. Fylos is a Swiss pet-care product,
// so the flavour is Swiss / DACH / EU: cities, clinics, pro services. These
// are seed pools only; the actual dataset objects are built in generate.ts.

import type { Industry, CompanySize, TagColor, SourceCategory, FormName, EntityKind } from '../types';

export const FIRST_NAMES = [
  'Lena', 'Noah', 'Mia', 'Luca', 'Elin', 'Jonas', 'Sofia', 'Tim', 'Nora', 'Finn',
  'Alina', 'Ben', 'Clara', 'David', 'Emma', 'Felix', 'Greta', 'Hana', 'Ivan', 'Julia',
  'Kai', 'Lara', 'Marco', 'Nina', 'Oscar', 'Petra', 'Quentin', 'Rosa', 'Samuel', 'Tessa',
  'Ursula', 'Vincent', 'Wanda', 'Xenia', 'Yannick', 'Zoe', 'Andrea', 'Bruno', 'Chiara', 'Dario',
] as const;

export const LAST_NAMES = [
  'Meier', 'Keller', 'Weber', 'Huber', 'Schmid', 'Steiner', 'Brunner', 'Baumann', 'Frei', 'Graf',
  'Zbinden', 'Moser', 'Widmer', 'Fischer', 'Roth', 'Marti', 'Bianchi', 'Rossi', 'Favre', 'Girard',
  'Kunz', 'Lang', 'Bucher', 'Suter', 'Frick', 'Aebi', 'Hofer', 'Kaufmann', 'Vogel', 'Wenger',
] as const;

export const CITIES: ReadonlyArray<readonly [string, string]> = [
  ['Zürich', 'CH'], ['Genève', 'CH'], ['Basel', 'CH'], ['Bern', 'CH'], ['Lausanne', 'CH'],
  ['Winterthur', 'CH'], ['Luzern', 'CH'], ['St. Gallen', 'CH'], ['Lugano', 'CH'], ['Zug', 'CH'],
  ['München', 'DE'], ['Wien', 'AT'], ['Milano', 'IT'], ['Lyon', 'FR'], ['Stuttgart', 'DE'],
];

export const INDUSTRIES: readonly Industry[] = [
  'Veterinary', 'Pet retail', 'Grooming', 'Boarding', 'Insurance', 'SaaS', 'Nonprofit', 'Media', 'Other',
];

export const COMPANY_SIZES: readonly CompanySize[] = ['1-10', '11-50', '51-200', '201-500', '500+'];

export const COMPANY_NOUNS = [
  'Vet', 'Klinik', 'Pfoten', 'Tier', 'Care', 'Paws', 'Groom', 'Hund', 'Katz', 'Fell',
  'Pet', 'Fauna', 'Anima', 'Zoo', 'Nature', 'Companion', 'Loyal', 'Guard', 'Trail', 'Meadow',
] as const;

export const COMPANY_SUFFIXES = [
  'AG', 'GmbH', 'Group', 'Clinic', 'Collective', 'Labs', 'Studio', 'House', 'Partners', 'Co',
] as const;

export const CONTACT_TITLES = [
  'Founder', 'Practice manager', 'Head vet', 'Marketing lead', 'Operations', 'Owner',
  'Groomer', 'Reception lead', 'Partnerships', 'Regional manager', 'CEO', 'CTO',
] as const;

export const TAG_SEED: ReadonlyArray<{ label: string; color: TagColor; appliesTo: EntityKind[] }> = [
  { label: 'Hot', color: 'coral', appliesTo: ['lead', 'deal'] },
  { label: 'Warm', color: 'amber', appliesTo: ['lead', 'contact'] },
  { label: 'Cold', color: 'slate', appliesTo: ['lead', 'contact'] },
  { label: 'Enterprise', color: 'violet', appliesTo: ['company', 'deal'] },
  { label: 'Pilot', color: 'sage', appliesTo: ['company', 'deal', 'lead'] },
  { label: 'Vet clinic', color: 'blue', appliesTo: ['company', 'contact', 'lead'] },
  { label: 'Pro applicant', color: 'teal', appliesTo: ['contact', 'lead', 'submission'] },
  { label: 'Newsletter', color: 'slate', appliesTo: ['contact', 'submission'] },
  { label: 'Referral', color: 'rose', appliesTo: ['lead', 'contact'] },
  { label: 'Event', color: 'amber', appliesTo: ['lead', 'contact'] },
  { label: 'Champion', color: 'sage', appliesTo: ['contact'] },
  { label: 'At risk', color: 'coral', appliesTo: ['deal', 'company'] },
  { label: 'Renewal', color: 'blue', appliesTo: ['deal', 'company'] },
  { label: 'Do not contact', color: 'slate', appliesTo: ['contact', 'lead'] },
];

export const SOURCE_SEED: ReadonlyArray<{ name: string; category: SourceCategory }> = [
  { name: 'Google Organic', category: 'organic' },
  { name: 'Google Ads', category: 'paid' },
  { name: 'Instagram', category: 'social' },
  { name: 'Meta Ads', category: 'paid' },
  { name: 'Vet referral', category: 'referral' },
  { name: 'Direct', category: 'direct' },
  { name: 'Newsletter', category: 'email' },
  { name: 'Zürich pet expo', category: 'event' },
  { name: 'Partner clinic', category: 'referral' },
  { name: 'TikTok', category: 'social' },
];

export const UTM_SOURCES = ['google', 'instagram', 'facebook', 'newsletter', 'tiktok', 'partner', '(direct)'] as const;
export const UTM_MEDIUMS = ['cpc', 'organic', 'social', 'email', 'referral', 'none'] as const;
export const UTM_CAMPAIGNS = [
  'spring_launch', 'vet_pilot_ch', 'walker_recruiting', 'brand_always_on',
  'retargeting_q3', 'expo_zurich', 'newsletter_jul', 'lookalike_de',
] as const;
export const UTM_TERMS = ['dog walker zurich', 'vet app', 'pet health record', 'hundebetreuung', ''] as const;
export const UTM_CONTENT = ['hero_a', 'hero_b', 'carousel_1', 'story_ad', 'footer_cta', ''] as const;

export const LANDING_PAGES = [
  '/', '/join', '/apply', '/why', '/vet', '/groomer', '/park', '/layouts',
] as const;

export const REFERRERS = [
  'https://www.google.com/', 'https://l.instagram.com/', 'https://www.facebook.com/',
  'https://t.co/', 'https://news.fylos.me/', '', 'https://partner-clinic.ch/',
] as const;

export const FORM_NAMES: readonly FormName[] = [
  'Apply (Vet clinic)', 'Join (Pro)', 'Contact', 'Newsletter', 'Waitlist',
];

export const PRO_ROLES = ['Dog walker', 'Pet sitter', 'Groomer', 'Trainer', 'Vet tech', 'Other'] as const;

export const NOTE_SNIPPETS = [
  'Left a voicemail, will try again tomorrow morning.',
  'Interested in the vet pilot, wants pricing for a 3 clinic group.',
  'Uses easyVET, needs to confirm the record sync works both ways.',
  'Asked to be contacted after the summer, back end of August.',
  'Great call. Ready to start onboarding two walkers this week.',
  'Concerned about data privacy, sent the FADP one pager.',
  'Budget approved on their side, waiting on our proposal.',
  'Met at the Zürich expo, warm intro from a partner clinic.',
  'Wants a demo with the reception screen before deciding.',
  'Not a fit right now, single location, revisit next year.',
  'Champion internally, pushing this with their head vet.',
  'Reschedule requested, moved the follow up to next Tuesday.',
] as const;

export const TASK_TITLES = [
  'Call back about the pilot',
  'Send the proposal',
  'Share the FADP privacy one pager',
  'Book a demo of the reception screen',
  'Confirm practice-management software',
  'Follow up on the contract',
  'Introduce the onboarding lead',
  'Check in after first week',
  'Chase missing signature',
  'Qualify inbound from the expo',
  'Prepare pricing for a clinic group',
  'Review submission and route to owner',
] as const;

export const DEAL_NOUNS = [
  'Vet pilot', 'Clinic group rollout', 'Pro onboarding', 'Annual plan',
  'Multi-site expansion', 'Renewal', 'Partnership', 'Sponsored pilot',
] as const;
