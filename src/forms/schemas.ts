// The eight reusable form definitions. These are pure data: field specs,
// validation hints, consent gates, and the warm Fylos copy (no dashes, no
// emoji, FOMO for anything not yet live). Components render them; the service
// submits them. Adding a ninth form is a matter of adding a schema here.

import type { FormId, FormSchema, SelectOption } from './core/types'

function opts(...labels: string[]): SelectOption[] {
  return labels.map((label) => ({ value: label, label }))
}

const earlyAccess: FormSchema = {
  id: 'early-access',
  route: '/early-access',
  title: 'Be first on your street.',
  intro:
    'Fylos is opening neighborhood by neighborhood. Leave your details and we will bring it to yours.',
  fields: [
    { name: 'name', label: 'Your name', type: 'text', autoComplete: 'name' },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      autoComplete: 'email',
      placeholder: 'you@example.com',
      help: 'Where your invite will land. We reply personally.',
    },
    { name: 'city', label: 'City or area', type: 'text', placeholder: 'Zurich, Aargau, and nearby' },
    {
      name: 'pet_name',
      label: "Your pet's name",
      type: 'text',
      maxLength: 40,
      help: 'So we can say hello properly.',
    },
    {
      name: 'contact_consent',
      label: 'Fylos can email me about early access. My details are used only for that.',
      type: 'checkbox',
      required: true,
      consent: true,
    },
    {
      name: 'marketing_optin',
      label: 'Send me the occasional Fylos update too.',
      type: 'checkbox',
    },
  ],
  submitLabel: 'Join the list',
  submittingLabel: 'Adding you',
  success: {
    title: 'You are on the list.',
    body: 'We will reach out the moment Fylos reaches your area. First on your street, as promised.',
  },
}

const newsletter: FormSchema = {
  id: 'newsletter',
  route: '/newsletter',
  title: 'The Fylos letter.',
  intro: 'A short note when something worth knowing happens. No noise.',
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      autoComplete: 'email',
      placeholder: 'you@example.com',
    },
    {
      name: 'consent',
      label: 'Yes, send me the Fylos letter. I can unsubscribe anytime.',
      type: 'checkbox',
      required: true,
      consent: true,
    },
  ],
  submitLabel: 'Subscribe',
  submittingLabel: 'Subscribing',
  success: {
    title: 'You are subscribed.',
    body: 'Thank you. Look out for a note from us when there is something good to share.',
  },
}

const contact: FormSchema = {
  id: 'contact',
  route: '/contact',
  title: 'Say hello.',
  intro: 'Questions, ideas, or just want to talk. We read every message.',
  fields: [
    { name: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
    { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
    {
      name: 'topic',
      label: 'What is this about',
      type: 'select',
      required: true,
      options: opts('General question', 'My account', 'Feedback', 'Something else'),
    },
    {
      name: 'message',
      label: 'Your message',
      type: 'textarea',
      required: true,
      minLength: 10,
      maxLength: 2000,
      placeholder: 'How can we help?',
    },
    {
      name: 'consent',
      label: 'I am happy for Fylos to reply and to hold my details for that.',
      type: 'checkbox',
      required: true,
      consent: true,
      help: 'How we handle your data: privacy@fylos.me.',
    },
  ],
  submitLabel: 'Send message',
  submittingLabel: 'Sending',
  success: {
    title: 'Message received.',
    body: 'Thank you. We will get back to you within a day or two.',
  },
}

const partnership: FormSchema = {
  id: 'partnership',
  route: '/partners',
  title: 'Let us build something together.',
  intro:
    'Shops, brands, shelters, and teams that share the neighborhood. Tell us what you have in mind.',
  fields: [
    { name: 'org', label: 'Company or brand', type: 'text', required: true, autoComplete: 'organization' },
    { name: 'contact_name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
    { name: 'work_email', label: 'Work email', type: 'email', required: true, autoComplete: 'email' },
    {
      name: 'partnership_type',
      label: 'Type of partnership',
      type: 'select',
      required: true,
      options: opts(
        'Retail or product',
        'Shelter or rescue',
        'Media or content',
        'Technology',
        'Something else',
      ),
    },
    {
      name: 'website',
      label: 'Website or Instagram',
      type: 'url',
      placeholder: 'yourbrand.ch or @yourbrand',
    },
    {
      name: 'message',
      label: 'What you have in mind',
      type: 'textarea',
      maxLength: 2000,
      placeholder: 'One or two lines is plenty',
    },
    {
      name: 'consent',
      label: 'Fylos can contact me about this partnership. My details are used only to reply.',
      type: 'checkbox',
      required: true,
      consent: true,
    },
  ],
  submitLabel: 'Send inquiry',
  submittingLabel: 'Sending',
  success: {
    title: 'Thank you, we have it.',
    body: 'We will read this properly and come back to you.',
  },
}

const veterinary: FormSchema = {
  id: 'veterinary',
  route: '/apply',
  title: 'Be one of the first clinics on Fylos.',
  intro:
    'Tell us about your practice. We verify through the public registers, so there is nothing to upload now.',
  fields: [
    {
      name: 'clinic_name',
      label: 'Clinic name',
      type: 'text',
      required: true,
      placeholder: 'Your practice as people know it',
    },
    { name: 'city', label: 'City or town', type: 'text', required: true },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      options: opts('Switzerland', 'Germany', 'Austria', 'Other'),
      help: 'This simply tells us which register to look you up in.',
    },
    {
      name: 'responsible_vet_name',
      label: "Responsible vet's name",
      type: 'text',
      required: true,
      help: 'Their name is all we need to confirm their registration.',
    },
    {
      name: 'practice_software',
      label: 'Practice management software you use',
      type: 'select',
      options: opts(
        'Vetera',
        'easyVET',
        'Provet Cloud',
        'IDEXX Animana',
        'IDEXX Cornerstone or Neo',
        'ezyVet',
        'Digitail',
        'Covetrus',
        'Debevet',
        'Other',
        'Paper or none',
      ),
      help: 'This most shapes how the record sync will work, so it is worth a moment.',
    },
    {
      name: 'practice_software_other',
      label: 'Which system',
      type: 'text',
      placeholder: 'Only if it is not in the list above',
      revealWhen: { field: 'practice_software', equals: 'Other' },
    },
    { name: 'contact_name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
    {
      name: 'contact_role',
      label: 'Your role at the clinic',
      type: 'select',
      required: true,
      options: opts('Owner', 'Practice manager', 'Lead vet', 'Vet', 'Admin', 'Other'),
    },
    {
      name: 'contact_email',
      label: 'Work email',
      type: 'email',
      required: true,
      autoComplete: 'email',
      placeholder: 'you@yourclinic.ch',
      help: 'This is where your invitation will go.',
    },
    {
      name: 'attestation',
      label: 'I am authorised to apply for this clinic, and the details here are accurate.',
      type: 'checkbox',
      required: true,
      consent: true,
    },
    {
      name: 'application_consent',
      label:
        'I understand Fylos for vets is not live yet, this is an application for early access, and records will only ever sync with the owner and their consent.',
      type: 'checkbox',
      required: true,
      consent: true,
    },
    {
      name: 'marketing_optin',
      label: 'Send me Fylos launch news too, even if the timing is not right yet.',
      type: 'checkbox',
    },
  ],
  submitLabel: 'Apply for early access',
  submittingLabel: 'Sending',
  success: {
    title: 'Application received.',
    body: 'Thank you. We will look you up in the register and be in touch about the pilot.',
  },
}

const demo: FormSchema = {
  id: 'demo',
  route: '/demo',
  title: 'See Fylos in action.',
  intro: 'A short walkthrough for clinics and pros. Tell us who you are and we will set up a time.',
  fields: [
    { name: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
    { name: 'work_email', label: 'Work email', type: 'email', required: true, autoComplete: 'email' },
    { name: 'organization', label: 'Clinic, shop, or business', type: 'text', autoComplete: 'organization' },
    {
      name: 'role',
      label: 'What you do',
      type: 'select',
      required: true,
      options: opts('Vet clinic', 'Groomer', 'Walker or sitter', 'Trainer', 'Other pro'),
    },
    {
      name: 'team_size',
      label: 'How big is your team',
      type: 'select',
      options: opts('Just me', '2 to 4', '5 or more'),
    },
    {
      name: 'preferred_time',
      label: 'When suits you',
      type: 'text',
      placeholder: 'Weekday mornings, for example',
    },
    {
      name: 'message',
      label: 'Anything you want to see',
      type: 'textarea',
      maxLength: 1000,
    },
    {
      name: 'consent',
      label: 'Fylos can contact me to arrange a demo.',
      type: 'checkbox',
      required: true,
      consent: true,
    },
  ],
  submitLabel: 'Request a demo',
  submittingLabel: 'Sending',
  success: {
    title: 'Request received.',
    body: 'Thank you. We will reach out to find a time that works for you.',
  },
}

const support: FormSchema = {
  id: 'support',
  route: '/support',
  title: 'We are here to help.',
  intro: 'Tell us what is going on and we will sort it out.',
  fields: [
    { name: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      autoComplete: 'email',
      help: 'The address on your account, if you have one.',
    },
    {
      name: 'category',
      label: 'What do you need help with',
      type: 'select',
      required: true,
      options: opts('My account', 'A booking', 'Billing', 'A bug', 'Something else'),
    },
    {
      name: 'reference',
      label: 'Booking or appointment reference',
      type: 'text',
      placeholder: 'If you have one',
    },
    {
      name: 'message',
      label: 'What is happening',
      type: 'textarea',
      required: true,
      minLength: 10,
      maxLength: 2000,
    },
    {
      name: 'consent',
      label: 'Fylos can use these details to look into this and reply.',
      type: 'checkbox',
      required: true,
      consent: true,
    },
  ],
  submitLabel: 'Get help',
  submittingLabel: 'Sending',
  success: {
    title: 'We are on it.',
    body: 'Thank you. A real person will get back to you shortly.',
  },
}

const press: FormSchema = {
  id: 'press',
  route: '/press',
  title: 'Press and media.',
  intro: 'For journalists and creators. We are happy to talk about what we are building.',
  fields: [
    { name: 'name', label: 'Your name', type: 'text', required: true, autoComplete: 'name' },
    { name: 'outlet', label: 'Publication or outlet', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
    {
      name: 'deadline',
      label: 'Your deadline',
      type: 'text',
      placeholder: 'If you are on one',
    },
    {
      name: 'topic',
      label: 'What you are working on',
      type: 'textarea',
      required: true,
      minLength: 10,
      maxLength: 2000,
    },
    {
      name: 'consent',
      label: 'Fylos can contact me about this request.',
      type: 'checkbox',
      required: true,
      consent: true,
    },
  ],
  submitLabel: 'Send request',
  submittingLabel: 'Sending',
  success: {
    title: 'Thank you, we have it.',
    body: 'We will get back to you quickly, deadlines respected.',
  },
}

export const FORMS: Record<FormId, FormSchema> = {
  'early-access': earlyAccess,
  newsletter,
  contact,
  partnership,
  veterinary,
  demo,
  support,
  press,
}

export const ALL_FORMS: FormSchema[] = Object.values(FORMS)

export function getFormSchema(id: FormId): FormSchema {
  return FORMS[id]
}
