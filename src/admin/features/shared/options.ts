// Static <select> option lists derived from the model label maps, so filters
// and forms stay in sync with the domain. Reference-backed options (owner,
// source, tag, stage) come from useReference at render time instead.

import {
  LEAD_STATUS_LABEL, TASK_STATUS_LABEL, TASK_PRIORITY_LABEL, LIFECYCLE_LABEL,
  SOURCE_CATEGORY_LABEL,
} from '../../types';
import type {
  LeadStatus, TaskStatus, TaskPriority, TaskKind, LifecycleStage, SubmissionStatus,
  FormName, FollowUpChannel, FollowUpStatus, Industry, CompanySize, SourceCategory, TagColor,
} from '../../types';
import type { FilterOption } from '../../components/data';

function fromLabels<K extends string>(labels: Record<K, string>): FilterOption[] {
  return (Object.keys(labels) as K[]).map((value) => ({ value, label: labels[value] }));
}

export const LEAD_STATUS_OPTIONS = fromLabels<LeadStatus>(LEAD_STATUS_LABEL);
export const TASK_STATUS_OPTIONS = fromLabels<TaskStatus>(TASK_STATUS_LABEL);
export const TASK_PRIORITY_OPTIONS = fromLabels<TaskPriority>(TASK_PRIORITY_LABEL);
export const LIFECYCLE_OPTIONS = fromLabels<LifecycleStage>(LIFECYCLE_LABEL);
export const SOURCE_CATEGORY_OPTIONS = fromLabels<SourceCategory>(SOURCE_CATEGORY_LABEL);

export const TASK_KIND_OPTIONS: FilterOption[] = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'todo', label: 'To do' },
];

export const SUBMISSION_STATUS_OPTIONS: FilterOption[] = [
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'converted', label: 'Converted' },
  { value: 'spam', label: 'Spam' },
];

export const FORM_NAME_OPTIONS: FilterOption[] = [
  { value: 'Apply (Vet clinic)', label: 'Apply (Vet clinic)' },
  { value: 'Join (Pro)', label: 'Join (Pro)' },
  { value: 'Contact', label: 'Contact' },
  { value: 'Newsletter', label: 'Newsletter' },
  { value: 'Waitlist', label: 'Waitlist' },
];

export const FOLLOWUP_CHANNEL_OPTIONS: FilterOption[] = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'message', label: 'Message' },
];

export const FOLLOWUP_STATUS_OPTIONS: FilterOption[] = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'done', label: 'Done' },
  { value: 'missed', label: 'Missed' },
];

export const INDUSTRY_OPTIONS: FilterOption[] = [
  'Veterinary', 'Pet retail', 'Grooming', 'Boarding', 'Insurance', 'SaaS', 'Nonprofit', 'Media', 'Other',
].map((v) => ({ value: v, label: v }));

export const COMPANY_SIZE_OPTIONS: FilterOption[] = [
  '1-10', '11-50', '51-200', '201-500', '500+',
].map((v) => ({ value: v, label: `${v} people` }));

export const TAG_COLOR_OPTIONS: FilterOption[] = [
  'coral', 'sage', 'amber', 'blue', 'violet', 'slate', 'rose', 'teal',
].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) }));

export const ENTITY_KIND_OPTIONS: FilterOption[] = [
  { value: 'lead', label: 'Lead' },
  { value: 'contact', label: 'Contact' },
  { value: 'company', label: 'Company' },
  { value: 'deal', label: 'Deal' },
  { value: 'submission', label: 'Submission' },
];

// Re-export the union literal helpers for typed casts in forms.
export type { LeadStatus, TaskStatus, TaskPriority, TaskKind, LifecycleStage, SubmissionStatus, FormName, FollowUpChannel, FollowUpStatus, Industry, CompanySize, SourceCategory, TagColor };
