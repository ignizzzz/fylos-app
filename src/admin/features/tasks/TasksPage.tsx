import { useState } from 'react';
import { Plus, Check, Phone, Mail, CalendarDays, ListTodo } from 'lucide-react';
import { tokens, toneStyles } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useResourceQuery } from '../../hooks';
import { useRefOptions } from '../shared/useRefOptions';
import { PageHeader } from '../../components/layout';
import { ResourceListView, FilterSelect } from '../../components/data';
import type { Column } from '../../components/data';
import { Button, Field, Input, Textarea, Select, Modal, Segmented } from '../../components/ui';
import { TaskStatusBadge, PriorityBadge, OwnerCell, EntityRefChip } from '../../components/domain/display';
import { TASK_STATUS_OPTIONS, TASK_PRIORITY_OPTIONS, TASK_KIND_OPTIONS } from '../shared/options';
import { formatDate, isOverdue } from '../../utils/format';
import type { Task, TaskKind, TaskPriority, TaskStatus } from '../../types';

const KIND_ICON: Record<TaskKind, typeof Phone> = { call: Phone, email: Mail, meeting: CalendarDays, todo: ListTodo };

export function TasksPage() {
  const svc = useServices();
  const opts = useRefOptions();
  const q = useResourceQuery<Task>(svc.tasks, { pageSize: 20, initialSort: { field: 'dueAt', dir: 'asc' } });
  const [editing, setEditing] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);

  const due = typeof q.filters.due === 'string' ? q.filters.due : 'all';

  const toggleDone = async (task: Task) => {
    await svc.tasks.update(task.id, task.status === 'done' ? { status: 'open', completedAt: null } : { status: 'done', completedAt: new Date().toISOString() });
    q.refetch();
  };

  const columns: Array<Column<Task>> = [
    {
      key: 'done', header: '', width: 40, render: (t) => (
        <button
          onClick={(e) => { e.stopPropagation(); void toggleDone(t); }}
          aria-label={t.status === 'done' ? 'Mark open' : 'Mark done'}
          className="inline-flex items-center justify-center w-5 h-5 rounded-[6px] transition-colors"
          style={{ border: `1.5px solid ${t.status === 'done' ? '#3F7A54' : tokens.borderStrong}`, background: t.status === 'done' ? '#EAF3EC' : 'transparent' }}
        >
          {t.status === 'done' && <Check size={13} style={{ color: '#3F7A54' }} />}
        </button>
      ),
    },
    {
      key: 'title', header: 'Task', sortable: true, render: (t) => {
        const Icon = KIND_ICON[t.kind];
        return (
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <Icon size={13} className="shrink-0" style={{ color: tokens.ink3 }} />
              <span className="font-semibold truncate" style={{ color: tokens.ink, textDecoration: t.status === 'done' ? 'line-through' : 'none', opacity: t.status === 'done' ? 0.6 : 1 }}>{t.title}</span>
            </div>
            {t.related && <div className="mt-0.5"><EntityRefChip entity={t.related} /></div>}
          </div>
        );
      },
    },
    { key: 'priority', header: 'Priority', sortable: true, hideBelow: 'md', render: (t) => <PriorityBadge priority={t.priority} /> },
    { key: 'status', header: 'Status', sortable: true, render: (t) => <TaskStatusBadge status={t.status} /> },
    { key: 'assignee', header: 'Assignee', sortable: true, hideBelow: 'lg', render: (t) => <OwnerCell id={t.assigneeId} /> },
    {
      key: 'dueAt', header: 'Due', sortable: true, align: 'right', render: (t) => {
        const overdue = t.status !== 'done' && isOverdue(t.dueAt);
        return <span className="tabular-nums font-medium" style={{ color: overdue ? toneStyles.red.fg : tokens.ink3 }}>{formatDate(t.dueAt)}</span>;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Tasks"
        subtitle={q.state.status === 'success' ? `${q.total.toLocaleString('de-CH')} tasks` : 'Work to be done'}
        actions={<Button variant="primary" icon={<Plus size={15} />} onClick={() => setCreating(true)}>New task</Button>}
      />

      <div className="mb-3">
        <Segmented
          value={due}
          onChange={(v) => q.setFilter('due', v === 'all' ? '' : v)}
          options={[{ value: 'all', label: 'All' }, { value: 'overdue', label: 'Overdue' }, { value: 'today', label: 'Today' }, { value: 'upcoming', label: 'Upcoming' }]}
        />
      </div>

      <ResourceListView
        query={q}
        columns={columns}
        rowKey={(t) => t.id}
        resourceKey="tasks"
        searchPlaceholder="Search tasks"
        onRowClick={setEditing}
        emptyTitle="No tasks"
        emptyMessage="Create tasks to track calls, emails and to-dos."
        filters={
          <>
            <FilterSelect label="Status" value={strFilter(q.filters.status)} onChange={(v) => q.setFilter('status', v)} options={TASK_STATUS_OPTIONS} width={150} />
            <FilterSelect label="Priority" value={strFilter(q.filters.priority)} onChange={(v) => q.setFilter('priority', v)} options={TASK_PRIORITY_OPTIONS} width={150} />
            <FilterSelect label="Assignee" value={strFilter(q.filters.assigneeId)} onChange={(v) => q.setFilter('assigneeId', v)} options={opts.owners} width={160} />
          </>
        }
      />

      <TaskModal open={creating || Boolean(editing)} task={editing} onClose={() => { setCreating(false); setEditing(null); }} onSaved={() => q.refetch()} />
    </>
  );
}

function strFilter(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function toDateInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function TaskModal({ open, task, onClose, onSaved }: { open: boolean; task: Task | null; onClose: () => void; onSaved: () => void }) {
  const svc = useServices();
  const opts = useRefOptions();
  const editing = Boolean(task);
  const [form, setForm] = useState(() => defaults(task));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Re-seed the form when the modal opens for a different task.
  const [seededFor, setSeededFor] = useState<string | null>(task?.id ?? null);
  if (open && (task?.id ?? null) !== seededFor) {
    setSeededFor(task?.id ?? null);
    setForm(defaults(task));
    setError(null);
  }

  const submit = async () => {
    if (!form.title.trim()) { setError('A title is required.'); return; }
    setBusy(true); setError(null);
    const dueAt = form.dueAt ? new Date(form.dueAt).toISOString() : new Date().toISOString();
    try {
      if (task) {
        await svc.tasks.update(task.id, { title: form.title.trim(), notes: form.notes.trim() || undefined, kind: form.kind, status: form.status, priority: form.priority, assigneeId: form.assigneeId, dueAt });
      } else {
        await svc.tasks.create({ title: form.title.trim(), notes: form.notes.trim() || undefined, kind: form.kind, status: form.status, priority: form.priority, assigneeId: form.assigneeId || undefined, dueAt });
      }
      onSaved(); onClose();
    } catch { setError('Could not save the task.'); } finally { setBusy(false); }
  };

  return (
    <Modal
      open={open} onClose={onClose} title={editing ? 'Edit task' : 'New task'} subtitle={task?.related ? `Linked to ${task.related.label}` : 'Track a call, email or to-do'}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy} onClick={() => void submit()}>{busy ? 'Saving' : editing ? 'Save' : 'Create task'}</Button></>}
    >
      {error && <p className="mb-3 text-[12.5px]" style={{ color: '#B23B30' }}>{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Title" required className="col-span-2"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Kind">
          <Select value={form.kind} onChange={(e) => setForm({ ...form, kind: e.target.value as TaskKind })}>
            {TASK_KIND_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Due date"><Input type="date" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} /></Field>
        <Field label="Priority">
          <Select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}>
            {TASK_PRIORITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}>
            {TASK_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Assignee" className="col-span-2">
          <Select value={form.assigneeId} onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}>
            <option value="">Auto</option>
            {opts.owners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Notes" className="col-span-2"><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}

function defaults(task: Task | null) {
  return {
    title: task?.title ?? '',
    notes: task?.notes ?? '',
    kind: (task?.kind ?? 'todo') as TaskKind,
    status: (task?.status ?? 'open') as TaskStatus,
    priority: (task?.priority ?? 'medium') as TaskPriority,
    assigneeId: task?.assigneeId ?? '',
    dueAt: task ? toDateInput(task.dueAt) : toDateInput(new Date().toISOString()),
  };
}
