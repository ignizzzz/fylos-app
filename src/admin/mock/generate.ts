// Builds the entire Growth Admin dataset deterministically from a seed.
// Referential integrity is maintained: contacts point at real companies,
// deals at real contacts/companies, notes/tasks/follow-ups at real entities.

import { makeRng } from './rng';
import type { Rng } from './rng';
import {
  FIRST_NAMES, LAST_NAMES, CITIES, COMPANY_SIZES, COMPANY_NOUNS,
  COMPANY_SUFFIXES, CONTACT_TITLES, TAG_SEED, SOURCE_SEED, UTM_SOURCES, UTM_MEDIUMS,
  UTM_CAMPAIGNS, UTM_TERMS, UTM_CONTENT, LANDING_PAGES, REFERRERS, FORM_NAMES,
  PRO_ROLES, NOTE_SNIPPETS, TASK_TITLES, DEAL_NOUNS,
} from './catalog';
import type {
  ID, ISODateString, TeamMember, Tag, LeadSource, Company, Contact, Lead, Deal,
  FormSubmission, Note, Task, FollowUp, PipelineStage, EntityRef, EntityKind,
  Attribution, UtmParams, LifecycleStage, LeadStatus, SubmissionStatus, TaskStatus,
  TaskPriority, TaskKind, FollowUpChannel, FollowUpStatus, SubmissionFields, Industry,
} from '../types';

export interface AdminDataset {
  team: TeamMember[];
  tags: Tag[];
  sources: LeadSource[];
  companies: Company[];
  contacts: Contact[];
  leads: Lead[];
  deals: Deal[];
  submissions: FormSubmission[];
  notes: Note[];
  tasks: Task[];
  followUps: FollowUp[];
  pipeline: PipelineStage[];
  generatedAt: ISODateString;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'new', label: 'New', order: 0, probability: 0.1, isClosed: false, isWon: false },
  { id: 'qualifying', label: 'Qualifying', order: 1, probability: 0.25, isClosed: false, isWon: false },
  { id: 'demo', label: 'Demo', order: 2, probability: 0.4, isClosed: false, isWon: false },
  { id: 'proposal', label: 'Proposal', order: 3, probability: 0.6, isClosed: false, isWon: false },
  { id: 'negotiation', label: 'Negotiation', order: 4, probability: 0.8, isClosed: false, isWon: false },
  { id: 'won', label: 'Won', order: 5, probability: 1, isClosed: true, isWon: true },
  { id: 'lost', label: 'Lost', order: 6, probability: 0, isClosed: true, isWon: false },
];

const OPEN_STAGES = PIPELINE_STAGES.filter((s) => !s.isClosed).map((s) => s.id);

const AVATAR_COLORS = [
  '#E85D2A', '#7C9271', '#D9902B', '#3E6DBF', '#7A5AD9', '#2FA39B', '#C2557E', '#5B7085',
];

const DAY = 86_400_000;

function pad(n: number, width: number): string {
  return String(n).padStart(width, '0');
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 18);
}

// The founding team. The first member is the demo sign-in identity.
function buildTeam(): TeamMember[] {
  const raw: Array<[string, string, TeamMember['role'], string]> = [
    ['Iakovos Ignatiadis', 'iakovos@fylos.me', 'owner', 'Founder'],
    ['Panagiotis Rekas', 'panagiotis@fylos.me', 'admin', 'Engineering'],
    ['Mara Steiner', 'mara@fylos.me', 'manager', 'Growth lead'],
    ['Timo Brunner', 'timo@fylos.me', 'manager', 'Partnerships'],
    ['Sofia Rossi', 'sofia@fylos.me', 'viewer', 'Marketing'],
    ['Nora Frei', 'nora@fylos.me', 'viewer', 'Support'],
  ];
  return raw.map(([name, email, role, title], i) => ({
    id: `user_${pad(i + 1, 3)}`,
    name,
    email,
    role,
    title,
    initials: initialsOf(name),
    avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
    active: true,
  }));
}

function buildTags(now: number): Tag[] {
  return TAG_SEED.map((t, i) => ({
    id: `tag_${pad(i + 1, 3)}`,
    label: t.label,
    color: t.color,
    appliesTo: [...t.appliesTo],
    description: undefined,
    createdAt: new Date(now - (200 - i) * DAY).toISOString(),
  }));
}

function buildSources(now: number): LeadSource[] {
  return SOURCE_SEED.map((s, i) => ({
    id: `src_${pad(i + 1, 3)}`,
    name: s.name,
    category: s.category,
    isActive: !(i === SOURCE_SEED.length - 1),
    createdAt: new Date(now - (220 - i) * DAY).toISOString(),
  }));
}

function buildUtm(rng: Rng): UtmParams {
  const source = rng.pick(UTM_SOURCES);
  const medium =
    source === '(direct)' ? 'none' : rng.pick(UTM_MEDIUMS.filter((m) => m !== 'none'));
  return {
    source,
    medium,
    campaign: source === '(direct)' ? undefined : rng.pick(UTM_CAMPAIGNS),
    term: medium === 'cpc' ? rng.pick(UTM_TERMS) || undefined : undefined,
    content: rng.pick(UTM_CONTENT) || undefined,
  };
}

function buildAttribution(rng: Rng, capturedAt: ISODateString): Attribution {
  const utm = buildUtm(rng);
  return {
    utm,
    landingPage: rng.pick(LANDING_PAGES),
    referrer: rng.pick(REFERRERS) || undefined,
    gclid: utm.medium === 'cpc' && rng.chance(0.6) ? `Cj0KCQ${pad(rng.int(1000, 9999), 4)}${pad(rng.int(1000, 9999), 4)}` : undefined,
    capturedAt,
  };
}

function buildCompanies(rng: Rng, now: number, team: TeamMember[], tags: Tag[], count: number): Company[] {
  const companyTags = tags.filter((t) => t.appliesTo.includes('company'));
  const out: Company[] = [];
  for (let i = 0; i < count; i++) {
    const name = `${rng.pick(COMPANY_NOUNS)}${rng.pick(COMPANY_NOUNS)} ${rng.pick(COMPANY_SUFFIXES)}`;
    const [city, country] = rng.pick(CITIES);
    const domain = `${slug(name)}.${country === 'CH' ? 'ch' : country === 'DE' ? 'de' : 'com'}`;
    const created = now - rng.int(20, 400) * DAY;
    out.push({
      id: `co_${pad(i + 1, 4)}`,
      name,
      domain,
      website: `https://${domain}`,
      industry: rng.weighted([
        ['Veterinary', 5], ['Grooming', 3], ['Pet retail', 3], ['Boarding', 2],
        ['Insurance', 1], ['SaaS', 1], ['Nonprofit', 1], ['Media', 1], ['Other', 1],
      ] as ReadonlyArray<readonly [Industry, number]>),
      size: rng.pick(COMPANY_SIZES),
      city,
      country,
      ownerId: rng.pick(team).id,
      tagIds: rng.sample(companyTags, rng.int(0, 2)).map((t) => t.id),
      annualRevenue: rng.chance(0.6) ? rng.int(1, 60) * 100_000 : undefined,
      contactCount: 0,
      openDealValue: 0,
      createdAt: new Date(created).toISOString(),
      updatedAt: new Date(created + rng.int(0, 18) * DAY).toISOString(),
    });
  }
  return out;
}

function buildContacts(
  rng: Rng, now: number, team: TeamMember[], sources: LeadSource[], tags: Tag[],
  companies: Company[], count: number,
): Contact[] {
  const contactTags = tags.filter((t) => t.appliesTo.includes('contact'));
  const out: Contact[] = [];
  for (let i = 0; i < count; i++) {
    const first = rng.pick(FIRST_NAMES);
    const last = rng.pick(LAST_NAMES);
    const company = rng.chance(0.82) ? rng.pick(companies) : undefined;
    const emailDomain = company ? company.domain : rng.pick(['gmail.com', 'bluewin.ch', 'gmx.ch', 'icloud.com']);
    const created = now - rng.int(1, 380) * DAY;
    out.push({
      id: `ct_${pad(i + 1, 4)}`,
      firstName: first,
      lastName: last,
      email: `${slug(first)}.${slug(last)}@${emailDomain}`,
      phone: rng.chance(0.7) ? `+41 ${rng.int(21, 79)} ${pad(rng.int(100, 999), 3)} ${pad(rng.int(10, 99), 2)} ${pad(rng.int(10, 99), 2)}` : undefined,
      title: rng.chance(0.75) ? rng.pick(CONTACT_TITLES) : undefined,
      companyId: company?.id,
      lifecycleStage: rng.weighted([
        ['subscriber', 3], ['lead', 4], ['marketing_qualified', 3], ['sales_qualified', 2],
        ['opportunity', 2], ['customer', 2], ['evangelist', 1],
      ] as ReadonlyArray<readonly [LifecycleStage, number]>),
      ownerId: rng.pick(team).id,
      sourceId: rng.pick(sources).id,
      tagIds: rng.sample(contactTags, rng.int(0, 3)).map((t) => t.id),
      city: company ? company.city : rng.pick(CITIES)[0],
      country: company ? company.country : rng.pick(CITIES)[1],
      avatarColor: AVATAR_COLORS[(i + 2) % AVATAR_COLORS.length],
      createdAt: new Date(created).toISOString(),
      lastActivityAt: new Date(created + rng.int(0, 60) * DAY).toISOString(),
    });
  }
  return out;
}

function buildLeads(
  rng: Rng, now: number, team: TeamMember[], sources: LeadSource[], tags: Tag[],
  companies: Company[], contacts: Contact[], count: number,
): Lead[] {
  const leadTags = tags.filter((t) => t.appliesTo.includes('lead'));
  const out: Lead[] = [];
  for (let i = 0; i < count; i++) {
    const first = rng.pick(FIRST_NAMES);
    const last = rng.pick(LAST_NAMES);
    const created = now - rng.int(0, 120) * DAY;
    const status = rng.weighted([
      ['new', 5], ['working', 4], ['qualified', 3], ['unqualified', 2], ['converted', 2],
    ] as ReadonlyArray<readonly [LeadStatus, number]>);
    const converted = status === 'converted';
    const companyName = rng.chance(0.7) ? rng.pick(companies).name : undefined;
    // A future follow-up for open leads; some overdue on purpose.
    const followUpAt =
      status === 'new' || status === 'working'
        ? new Date(now + rng.int(-6, 21) * DAY).toISOString()
        : null;
    out.push({
      id: `ld_${pad(i + 1, 4)}`,
      name: `${first} ${last}`,
      email: `${slug(first)}.${slug(last)}@${rng.pick(['gmail.com', 'bluewin.ch', 'gmx.ch', 'proton.me'])}`,
      phone: rng.chance(0.55) ? `+41 ${rng.int(21, 79)} ${pad(rng.int(100, 999), 3)} ${pad(rng.int(10, 99), 2)} ${pad(rng.int(10, 99), 2)}` : undefined,
      companyName,
      status,
      score: status === 'unqualified' ? rng.int(0, 35) : rng.int(20, 100),
      ownerId: rng.pick(team).id,
      sourceId: rng.pick(sources).id,
      tagIds: rng.sample(leadTags, rng.int(0, 2)).map((t) => t.id),
      estimatedValue: rng.int(2, 40) * 500,
      attribution: buildAttribution(rng, new Date(created).toISOString()),
      followUpAt,
      convertedContactId: converted ? rng.pick(contacts).id : null,
      convertedDealId: null,
      createdAt: new Date(created).toISOString(),
      lastActivityAt: new Date(created + rng.int(0, 30) * DAY).toISOString(),
    });
  }
  return out;
}

function buildDeals(
  rng: Rng, now: number, team: TeamMember[], sources: LeadSource[], tags: Tag[],
  companies: Company[], contacts: Contact[], leads: Lead[], count: number,
): Deal[] {
  const dealTags = tags.filter((t) => t.appliesTo.includes('deal'));
  const out: Deal[] = [];
  for (let i = 0; i < count; i++) {
    const company = rng.pick(companies);
    const created = now - rng.int(3, 160) * DAY;
    const stageId = rng.weighted([
      ['new', 4], ['qualifying', 4], ['demo', 3], ['proposal', 3],
      ['negotiation', 2], ['won', 3], ['lost', 2],
    ] as ReadonlyArray<readonly [Deal['stageId'], number]>);
    const stage = PIPELINE_STAGES.find((s) => s.id === stageId)!;
    const contact = rng.chance(0.8) ? rng.pick(contacts) : undefined;
    out.push({
      id: `dl_${pad(i + 1, 4)}`,
      title: `${company.name} - ${rng.pick(DEAL_NOUNS)}`,
      value: rng.int(3, 80) * 500,
      currency: 'CHF',
      stageId,
      ownerId: rng.pick(team).id,
      companyId: company.id,
      contactId: contact?.id,
      leadId: rng.chance(0.4) ? rng.pick(leads).id : undefined,
      sourceId: rng.pick(sources).id,
      tagIds: rng.sample(dealTags, rng.int(0, 2)).map((t) => t.id),
      expectedCloseAt: new Date(now + rng.int(-20, 75) * DAY).toISOString(),
      createdAt: new Date(created).toISOString(),
      updatedAt: new Date(created + rng.int(0, 30) * DAY).toISOString(),
      closedAt: stage.isClosed ? new Date(created + rng.int(10, 40) * DAY).toISOString() : null,
    });
  }
  return out;
}

function buildSubmissions(rng: Rng, now: number, count: number): FormSubmission[] {
  const out: FormSubmission[] = [];
  for (let i = 0; i < count; i++) {
    const formName = rng.pick(FORM_NAMES);
    const first = rng.pick(FIRST_NAMES);
    const last = rng.pick(LAST_NAMES);
    const [city, country] = rng.pick(CITIES);
    const submitted = now - rng.int(0, 90) * DAY;
    const isPro = formName === 'Join (Pro)';
    const isClinic = formName === 'Apply (Vet clinic)';
    const fields: SubmissionFields = {
      name: `${first} ${last}`,
      email: `${slug(first)}.${slug(last)}@${rng.pick(['gmail.com', 'bluewin.ch', 'gmx.ch'])}`,
      phone: rng.chance(0.5) ? `+41 ${rng.int(21, 79)} ${pad(rng.int(100, 999), 3)} ${pad(rng.int(10, 99), 2)} ${pad(rng.int(10, 99), 2)}` : undefined,
      company: isClinic ? `${rng.pick(COMPANY_NOUNS)}klinik ${city}` : undefined,
      role: isPro ? rng.pick(PRO_ROLES) : undefined,
      city,
      message:
        formName === 'Contact' || isClinic
          ? rng.pick([
              'We run two clinics in the canton and would like early access.',
              'How does the record sync work with our software?',
              'Keen to join the pilot, when do you onboard clinics?',
              'Can we see the reception screen before we commit?',
            ])
          : undefined,
    };
    out.push({
      id: `fs_${pad(i + 1, 4)}`,
      formName,
      submittedAt: new Date(submitted).toISOString(),
      fields,
      pageUrl: `https://fylos-neighborhood.vercel.app${isClinic ? '/apply' : isPro ? '/join' : rng.pick(LANDING_PAGES)}`,
      utm: buildUtm(rng),
      referrer: rng.pick(REFERRERS) || undefined,
      ipCountry: country,
      status: rng.weighted([
        ['new', 5], ['reviewed', 3], ['converted', 2], ['spam', 1],
      ] as ReadonlyArray<readonly [SubmissionStatus, number]>),
      linkedLeadId: null,
    });
  }
  return out;
}

function refFor(kind: EntityKind, dataset: Pick<AdminDataset, 'leads' | 'contacts' | 'companies' | 'deals' | 'submissions'>, rng: Rng): EntityRef {
  switch (kind) {
    case 'lead': {
      const e = rng.pick(dataset.leads);
      return { kind, id: e.id, label: e.name };
    }
    case 'contact': {
      const e = rng.pick(dataset.contacts);
      return { kind, id: e.id, label: `${e.firstName} ${e.lastName}` };
    }
    case 'company': {
      const e = rng.pick(dataset.companies);
      return { kind, id: e.id, label: e.name };
    }
    case 'deal': {
      const e = rng.pick(dataset.deals);
      return { kind, id: e.id, label: e.title };
    }
    case 'submission': {
      const e = rng.pick(dataset.submissions);
      return { kind, id: e.id, label: e.fields.name ?? e.formName };
    }
  }
}

function buildNotes(
  rng: Rng, now: number, team: TeamMember[],
  refs: { leads: Lead[]; contacts: Contact[]; companies: Company[]; deals: Deal[]; submissions: FormSubmission[] },
  count: number,
): Note[] {
  const kinds: EntityKind[] = ['lead', 'contact', 'company', 'deal'];
  const out: Note[] = [];
  for (let i = 0; i < count; i++) {
    const created = now - rng.int(0, 90) * DAY;
    out.push({
      id: `nt_${pad(i + 1, 4)}`,
      body: rng.pick(NOTE_SNIPPETS),
      authorId: rng.pick(team).id,
      pinned: rng.chance(0.15),
      related: refFor(rng.pick(kinds), refs, rng),
      createdAt: new Date(created).toISOString(),
      updatedAt: new Date(created + rng.int(0, 5) * DAY).toISOString(),
    });
  }
  return out;
}

function buildTasks(
  rng: Rng, now: number, team: TeamMember[],
  refs: { leads: Lead[]; contacts: Contact[]; companies: Company[]; deals: Deal[]; submissions: FormSubmission[] },
  count: number,
): Task[] {
  const kinds: EntityKind[] = ['lead', 'contact', 'company', 'deal'];
  const taskKinds: TaskKind[] = ['call', 'email', 'meeting', 'todo'];
  const out: Task[] = [];
  for (let i = 0; i < count; i++) {
    const created = now - rng.int(0, 40) * DAY;
    const status = rng.weighted([
      ['open', 5], ['in_progress', 2], ['done', 3],
    ] as ReadonlyArray<readonly [TaskStatus, number]>);
    // Open/in-progress tasks are dated around now (some overdue); done in the past.
    const dueOffset = status === 'done' ? -rng.int(1, 30) : rng.int(-7, 21);
    out.push({
      id: `tk_${pad(i + 1, 4)}`,
      title: rng.pick(TASK_TITLES),
      kind: rng.pick(taskKinds),
      status,
      priority: rng.weighted([
        ['low', 3], ['medium', 4], ['high', 2],
      ] as ReadonlyArray<readonly [TaskPriority, number]>),
      assigneeId: rng.pick(team).id,
      related: rng.chance(0.85) ? refFor(rng.pick(kinds), refs, rng) : null,
      dueAt: new Date(now + dueOffset * DAY).toISOString(),
      createdAt: new Date(created).toISOString(),
      completedAt: status === 'done' ? new Date(now + (dueOffset - rng.int(0, 3)) * DAY).toISOString() : null,
    });
  }
  return out;
}

function buildFollowUps(
  rng: Rng, now: number, team: TeamMember[],
  refs: { leads: Lead[]; contacts: Contact[]; companies: Company[]; deals: Deal[]; submissions: FormSubmission[] },
  count: number,
): FollowUp[] {
  const kinds: EntityKind[] = ['lead', 'contact', 'deal'];
  const channels: FollowUpChannel[] = ['call', 'email', 'meeting', 'message'];
  const out: FollowUp[] = [];
  for (let i = 0; i < count; i++) {
    const created = now - rng.int(1, 40) * DAY;
    const dueOffset = rng.int(-10, 30);
    // Past-due that is not done becomes "missed"; future is "scheduled".
    let status: FollowUpStatus = dueOffset < 0 ? (rng.chance(0.5) ? 'done' : 'missed') : 'scheduled';
    if (dueOffset >= 0 && rng.chance(0.1)) status = 'done';
    out.push({
      id: `fu_${pad(i + 1, 4)}`,
      related: refFor(rng.pick(kinds), refs, rng),
      channel: rng.pick(channels),
      dueAt: new Date(now + dueOffset * DAY).toISOString(),
      note: rng.chance(0.6) ? rng.pick(NOTE_SNIPPETS) : undefined,
      ownerId: rng.pick(team).id,
      status,
      createdAt: new Date(created).toISOString(),
      completedAt: status === 'done' ? new Date(now + Math.min(dueOffset, 0) * DAY).toISOString() : null,
    });
  }
  return out;
}

export interface GenerateOptions {
  seed?: number;
  now?: number;
  counts?: Partial<Record<'companies' | 'contacts' | 'leads' | 'deals' | 'submissions' | 'notes' | 'tasks' | 'followUps', number>>;
}

const DEFAULT_COUNTS = {
  companies: 60,
  contacts: 180,
  leads: 140,
  deals: 90,
  submissions: 120,
  notes: 200,
  tasks: 110,
  followUps: 80,
};

export function generateDataset(opts: GenerateOptions = {}): AdminDataset {
  const rng = makeRng(opts.seed ?? 0x5f17c0de);
  const now = opts.now ?? Date.now();
  const counts = { ...DEFAULT_COUNTS, ...opts.counts };

  const team = buildTeam();
  const tags = buildTags(now);
  const sources = buildSources(now);
  const companies = buildCompanies(rng, now, team, tags, counts.companies);
  const contacts = buildContacts(rng, now, team, sources, tags, companies, counts.contacts);
  const leads = buildLeads(rng, now, team, sources, tags, companies, contacts, counts.leads);
  const deals = buildDeals(rng, now, team, sources, tags, companies, contacts, leads, counts.deals);
  const submissions = buildSubmissions(rng, now, counts.submissions);
  const refs = { leads, contacts, companies, deals, submissions };
  const notes = buildNotes(rng, now, team, refs, counts.notes);
  const tasks = buildTasks(rng, now, team, refs, counts.tasks);
  const followUps = buildFollowUps(rng, now, team, refs, counts.followUps);

  // Derive company rollups from the real contacts/deals for consistency.
  const contactCountByCompany = new Map<ID, number>();
  for (const c of contacts) if (c.companyId) contactCountByCompany.set(c.companyId, (contactCountByCompany.get(c.companyId) ?? 0) + 1);
  const openValueByCompany = new Map<ID, number>();
  for (const d of deals) {
    if (d.companyId && OPEN_STAGES.includes(d.stageId)) {
      openValueByCompany.set(d.companyId, (openValueByCompany.get(d.companyId) ?? 0) + d.value);
    }
  }
  for (const co of companies) {
    co.contactCount = contactCountByCompany.get(co.id) ?? 0;
    co.openDealValue = openValueByCompany.get(co.id) ?? 0;
  }

  // Link converted leads to a real open/won deal for that trail.
  for (const ld of leads) {
    if (ld.status === 'converted') {
      const match = deals.find((d) => d.leadId === ld.id);
      ld.convertedDealId = match ? match.id : rng.pick(deals).id;
    }
  }

  return {
    team, tags, sources, companies, contacts, leads, deals, submissions,
    notes, tasks, followUps, pipeline: PIPELINE_STAGES,
    generatedAt: new Date(now).toISOString(),
  };
}
