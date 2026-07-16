// Domain-aware display cells: status badges (model value -> tone + label),
// tag chips, owner cells, score bars, entity links. Reference labels
// (owner/tag names) are resolved through ReferenceContext, never MOCK_DB.

import { Avatar, Badge } from '../ui/primitives';
import { tokens, tagColorToTone, trackColor } from '../../theme';
import type { Tone } from '../../theme';
import { useReference } from '../../context/ReferenceContext';
import {
  LEAD_STATUS_LABEL, TASK_STATUS_LABEL, TASK_PRIORITY_LABEL, LIFECYCLE_LABEL,
  SOURCE_CATEGORY_LABEL, ENTITY_KIND_LABEL,
} from '../../types';
import type {
  LeadStatus, TaskStatus, TaskPriority, LifecycleStage, SubmissionStatus,
  FollowUpStatus, PipelineStageId, SourceCategory, Tag, ID, EntityRef,
} from '../../types';

const LEAD_TONE: Record<LeadStatus, Tone> = {
  new: 'blue', working: 'amber', qualified: 'green', unqualified: 'slate', converted: 'coral',
};
const TASK_TONE: Record<TaskStatus, Tone> = { open: 'blue', in_progress: 'amber', done: 'green' };
const PRIORITY_TONE: Record<TaskPriority, Tone> = { low: 'slate', medium: 'amber', high: 'red' };
const SUBMISSION_TONE: Record<SubmissionStatus, Tone> = {
  new: 'blue', reviewed: 'slate', spam: 'red', converted: 'green',
};
const FOLLOWUP_TONE: Record<FollowUpStatus, Tone> = { scheduled: 'blue', done: 'green', missed: 'red' };
const LIFECYCLE_TONE: Record<LifecycleStage, Tone> = {
  subscriber: 'slate', lead: 'blue', marketing_qualified: 'teal', sales_qualified: 'violet',
  opportunity: 'amber', customer: 'green', evangelist: 'coral',
};
const STAGE_TONE: Record<PipelineStageId, Tone> = {
  new: 'slate', qualifying: 'blue', demo: 'teal', proposal: 'violet', negotiation: 'amber', won: 'green', lost: 'red',
};
const SOURCE_TONE: Record<SourceCategory, Tone> = {
  organic: 'green', paid: 'coral', social: 'violet', referral: 'teal', direct: 'slate', email: 'blue', event: 'amber', other: 'slate',
};

export const LeadStatusBadge = ({ status }: { status: LeadStatus }) => (
  <Badge tone={LEAD_TONE[status]} dot>{LEAD_STATUS_LABEL[status]}</Badge>
);
export const TaskStatusBadge = ({ status }: { status: TaskStatus }) => (
  <Badge tone={TASK_TONE[status]} dot>{TASK_STATUS_LABEL[status]}</Badge>
);
export const PriorityBadge = ({ priority }: { priority: TaskPriority }) => (
  <Badge tone={PRIORITY_TONE[priority]}>{TASK_PRIORITY_LABEL[priority]}</Badge>
);
export const SubmissionStatusBadge = ({ status }: { status: SubmissionStatus }) => (
  <Badge tone={SUBMISSION_TONE[status]} dot>{status[0].toUpperCase() + status.slice(1)}</Badge>
);
export const FollowUpStatusBadge = ({ status }: { status: FollowUpStatus }) => (
  <Badge tone={FOLLOWUP_TONE[status]} dot>{status[0].toUpperCase() + status.slice(1)}</Badge>
);
export const LifecycleBadge = ({ stage }: { stage: LifecycleStage }) => (
  <Badge tone={LIFECYCLE_TONE[stage]}>{LIFECYCLE_LABEL[stage]}</Badge>
);
export const SourceCategoryBadge = ({ category }: { category: SourceCategory }) => (
  <Badge tone={SOURCE_TONE[category]}>{SOURCE_CATEGORY_LABEL[category]}</Badge>
);

export function StageBadge({ stageId }: { stageId: PipelineStageId }) {
  const { stageById } = useReference();
  const label = stageById(stageId)?.label ?? stageId;
  return <Badge tone={STAGE_TONE[stageId]} dot>{label}</Badge>;
}

// ── Tags ────────────────────────────────────────────────────────────────────

export function TagChip({ tag }: { tag: Tag }) {
  return <Badge tone={tagColorToTone[tag.color] ?? 'neutral'}>{tag.label}</Badge>;
}

export function TagChips({ ids, max = 3 }: { ids: ID[]; max?: number }) {
  const { tagsByIds } = useReference();
  const tags = tagsByIds(ids);
  if (tags.length === 0) return <span className="text-[12.5px]" style={{ color: tokens.ink3 }}>None</span>;
  const shown = tags.slice(0, max);
  const extra = tags.length - shown.length;
  return (
    <span className="inline-flex items-center gap-1 flex-wrap">
      {shown.map((t) => <TagChip key={t.id} tag={t} />)}
      {extra > 0 && <Badge tone="neutral">+{extra}</Badge>}
    </span>
  );
}

// ── Owner / assignee ────────────────────────────────────────────────────────

export function OwnerCell({ id, muted }: { id: ID | null | undefined; muted?: boolean }) {
  const { memberById } = useReference();
  const m = memberById(id);
  if (!m) return <span className="text-[12.5px]" style={{ color: tokens.ink3 }}>Unassigned</span>;
  return (
    <span className="inline-flex items-center gap-2 min-w-0">
      <Avatar name={m.name} color={m.avatarColor} size={24} />
      <span className="text-[13px] truncate" style={{ color: muted ? tokens.ink2 : tokens.ink }}>{m.name}</span>
    </span>
  );
}

// ── Score bar ───────────────────────────────────────────────────────────────

export function ScoreBar({ score }: { score: number }) {
  const tone: Tone = score >= 70 ? 'green' : score >= 40 ? 'amber' : 'slate';
  const color = tone === 'green' ? '#3F7A54' : tone === 'amber' ? '#9A6B1E' : '#8E7F70';
  return (
    <span className="inline-flex items-center gap-2">
      <span className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: trackColor }}>
        <span className="block h-full rounded-full" style={{ width: `${Math.max(4, Math.min(100, score))}%`, background: color }} />
      </span>
      <span className="text-[12.5px] tabular-nums font-semibold" style={{ color: tokens.ink2 }}>{score}</span>
    </span>
  );
}

// ── Entity reference chip ───────────────────────────────────────────────────

export function EntityRefChip({ entity }: { entity: EntityRef }) {
  return (
    <span className="inline-flex items-center gap-1.5 min-w-0">
      <span className="text-[11px] px-1.5 py-0.5 rounded font-semibold shrink-0" style={{ background: tokens.surfaceAlt, color: tokens.ink3, border: `1px solid ${tokens.border}` }}>
        {ENTITY_KIND_LABEL[entity.kind]}
      </span>
      <span className="text-[13px] truncate" style={{ color: tokens.ink }}>{entity.label}</span>
    </span>
  );
}
