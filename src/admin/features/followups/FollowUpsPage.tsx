import { useEffect, useState } from 'react';
import { Plus, Check, Phone, Mail, CalendarDays, MessageSquare } from 'lucide-react';
import { tokens, toneStyles } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useResourceQuery } from '../../hooks';
import { useRefOptions } from '../shared/useRefOptions';
import { PageHeader } from '../../components/layout';
import { ResourceListView, FilterSelect } from '../../components/data';
import type { Column } from '../../components/data';
import { Button, Field, Input, Textarea, Select, Modal, Segmented } from '../../components/ui';
import { FollowUpStatusBadge, OwnerCell, EntityRefChip } from '../../components/domain/display';
import { FOLLOWUP_CHANNEL_OPTIONS, FOLLOWUP_STATUS_OPTIONS } from '../shared/options';
import { formatDate, isOverdue } from '../../utils/format';
import type { FollowUp, FollowUpChannel, Lead } from '../../types';

const CHANNEL_ICON: Record<FollowUpChannel, typeof Phone> = { call: Phone, email: Mail, meeting: CalendarDays, message: MessageSquare };

export function FollowUpsPage() {
  const svc = useServices();
  const opts = useRefOptions();
  const q = useResourceQuery<FollowUp>(svc.followUps, { pageSize: 20, initialSort: { field: 'dueAt', dir: 'asc' } });
  const [creating, setCreating] = useState(false);

  const due = typeof q.filters.due === 'string' ? q.filters.due : 'all';

  const markDone = async (f: FollowUp) => {
    await svc.followUps.update(f.id, { status: 'done', completedAt: new Date().toISOString() });
    q.refetch();
  };

  const columns: Array<Column<FollowUp>> = [
    {
      key: 'done', header: '', width: 40, render: (f) => (
        <button
          onClick={(e) => { e.stopPropagation(); if (f.status !== 'done') void markDone(f); }}
          aria-label="Mark done"
          disabled={f.status === 'done'}
          className="inline-flex items-center justify-center w-5 h-5 rounded-[6px] transition-colors disabled:cursor-default"
          style={{ border: `1.5px solid ${f.status === 'done' ? '#3F7A54' : tokens.borderStrong}`, background: f.status === 'done' ? '#EAF3EC' : 'transparent' }}
        >
          {f.status === 'done' && <Check size={13} style={{ color: '#3F7A54' }} />}
        </button>
      ),
    },
    { key: 'related', header: 'About', sortable: true, render: (f) => <EntityRefChip entity={f.related} /> },
    {
      key: 'channel', header: 'Channel', sortable: true, render: (f) => {
        const Icon = CHANNEL_ICON[f.channel];
        return <span className="inline-flex items-center gap-1.5 capitalize" style={{ color: tokens.ink2 }}><Icon size={13} style={{ color: tokens.ink3 }} />{f.channel}</span>;
      },
    },
    { key: 'owner', header: 'Owner', sortable: true, hideBelow: 'lg', render: (f) => <OwnerCell id={f.ownerId} /> },
    { key: 'status', header: 'Status', sortable: true, render: (f) => <FollowUpStatusBadge status={f.status} /> },
    {
      key: 'dueAt', header: 'Due', sortable: true, align: 'right', render: (f) => {
        const overdue = f.status === 'scheduled' && isOverdue(f.dueAt);
        return <span className="tabular-nums font-medium" style={{ color: overdue ? toneStyles.red.fg : tokens.ink3 }}>{formatDate(f.dueAt)}</span>;
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Follow ups"
        subtitle={q.state.status === 'success' ? `${q.total.toLocaleString('de-CH')} scheduled touches` : 'Scheduled follow-up dates'}
        actions={<Button variant="primary" icon={<Plus size={15} />} onClick={() => setCreating(true)}>Schedule follow up</Button>}
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
        rowKey={(f) => f.id}
        resourceKey="followUps"
        searchPlaceholder="Search follow ups"
        emptyTitle="No follow ups"
        emptyMessage="Schedule follow-up dates against leads, contacts and deals."
        filters={
          <>
            <FilterSelect label="Status" value={strFilter(q.filters.status)} onChange={(v) => q.setFilter('status', v)} options={FOLLOWUP_STATUS_OPTIONS} width={150} />
            <FilterSelect label="Channel" value={strFilter(q.filters.channel)} onChange={(v) => q.setFilter('channel', v)} options={FOLLOWUP_CHANNEL_OPTIONS} width={150} />
            <FilterSelect label="Owner" value={strFilter(q.filters.ownerId)} onChange={(v) => q.setFilter('ownerId', v)} options={opts.owners} width={160} />
          </>
        }
      />

      <NewFollowUpModal open={creating} onClose={() => setCreating(false)} onCreated={() => q.refetch()} />
    </>
  );
}

function strFilter(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function toDateInput(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function NewFollowUpModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const svc = useServices();
  const opts = useRefOptions();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [form, setForm] = useState({ leadId: '', channel: 'call' as FollowUpChannel, dueAt: toDateInput(new Date(Date.now() + 3 * 86400000).toISOString()), ownerId: '', note: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let alive = true;
    svc.leads.list({ page: 1, pageSize: 100, sort: { field: 'createdAt', dir: 'desc' } })
      .then((r) => { if (alive) setLeads(r.items); })
      .catch(() => { /* ignore */ });
    return () => { alive = false; };
  }, [open, svc]);

  const submit = async () => {
    const lead = leads.find((l) => l.id === form.leadId);
    if (!lead) { setError('Choose a lead to follow up on.'); return; }
    setBusy(true); setError(null);
    try {
      await svc.followUps.create({
        related: { kind: 'lead', id: lead.id, label: lead.name },
        channel: form.channel,
        dueAt: new Date(form.dueAt).toISOString(),
        ownerId: form.ownerId || undefined,
        note: form.note.trim() || undefined,
        status: 'scheduled',
      });
      onCreated(); onClose();
      setForm({ leadId: '', channel: 'call', dueAt: toDateInput(new Date(Date.now() + 3 * 86400000).toISOString()), ownerId: '', note: '' });
    } catch { setError('Could not schedule the follow up.'); } finally { setBusy(false); }
  };

  return (
    <Modal
      open={open} onClose={onClose} title="Schedule follow up" subtitle="Set a follow-up date against a lead"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy} onClick={() => void submit()}>{busy ? 'Scheduling' : 'Schedule'}</Button></>}
    >
      {error && <p className="mb-3 text-[12.5px]" style={{ color: '#B23B30' }}>{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Lead" required className="col-span-2">
          <Select value={form.leadId} onChange={(e) => setForm({ ...form, leadId: e.target.value })}>
            <option value="">Choose a lead</option>
            {leads.map((l) => <option key={l.id} value={l.id}>{l.name}{l.companyName ? ` (${l.companyName})` : ''}</option>)}
          </Select>
        </Field>
        <Field label="Channel">
          <Select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as FollowUpChannel })}>
            {FOLLOWUP_CHANNEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Due date"><Input type="date" value={form.dueAt} onChange={(e) => setForm({ ...form, dueAt: e.target.value })} /></Field>
        <Field label="Owner" className="col-span-2">
          <Select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })}>
            <option value="">Auto</option>
            {opts.owners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Note" className="col-span-2"><Textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} /></Field>
      </div>
    </Modal>
  );
}
