import { useState } from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';
import { tokens } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useReference } from '../../context/ReferenceContext';
import { useResourceQuery } from '../../hooks';
import { useRefOptions } from '../shared/useRefOptions';
import { PageHeader } from '../../components/layout';
import { ResourceListView, FilterSelect } from '../../components/data';
import type { Column } from '../../components/data';
import { Button, Field, Input, Select, Drawer, Modal, ConfirmDialog } from '../../components/ui';
import { LeadStatusBadge, ScoreBar, OwnerCell, TagChips } from '../../components/domain/display';
import { DrawerSection, DetailGrid, DetailRow, RelatedActivity } from '../shared/DetailKit';
import { LEAD_STATUS_OPTIONS } from '../shared/options';
import { formatCurrency, formatDate, formatRelative } from '../../utils/format';
import type { Lead, LeadStatus } from '../../types';

export function LeadsPage() {
  const svc = useServices();
  const { sourceName } = useReference();
  const opts = useRefOptions();
  const q = useResourceQuery<Lead>(svc.leads, { pageSize: 20 });

  const [selected, setSelected] = useState<Lead | null>(null);
  const [creating, setCreating] = useState(false);

  const columns: Array<Column<Lead>> = [
    {
      key: 'name', header: 'Lead', sortable: true, render: (l) => (
        <div className="min-w-0">
          <div className="font-semibold truncate" style={{ color: tokens.ink }}>{l.name}</div>
          <div className="text-[12px] truncate" style={{ color: tokens.ink3 }}>{l.email}</div>
        </div>
      ),
    },
    { key: 'company', header: 'Company', hideBelow: 'md', render: (l) => l.companyName ?? <span style={{ color: tokens.ink3 }}>Not set</span> },
    { key: 'status', header: 'Status', sortable: true, render: (l) => <LeadStatusBadge status={l.status} /> },
    { key: 'score', header: 'Score', sortable: true, render: (l) => <ScoreBar score={l.score} /> },
    { key: 'owner', header: 'Owner', sortable: true, hideBelow: 'lg', render: (l) => <OwnerCell id={l.ownerId} /> },
    { key: 'source', header: 'Source', sortable: true, hideBelow: 'lg', render: (l) => <span style={{ color: tokens.ink2 }}>{sourceName(l.sourceId)}</span> },
    { key: 'estimatedValue', header: 'Value', sortable: true, align: 'right', render: (l) => <span className="tabular-nums">{formatCurrency(l.estimatedValue)}</span> },
    { key: 'createdAt', header: 'Created', sortable: true, hideBelow: 'md', align: 'right', render: (l) => <span style={{ color: tokens.ink3 }}>{formatDate(l.createdAt)}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Leads"
        subtitle={q.state.status === 'success' ? `${q.total.toLocaleString('de-CH')} leads in the funnel` : 'Inbound interest across all sources'}
      />

      <ResourceListView
        query={q}
        columns={columns}
        rowKey={(l) => l.id}
        resourceKey="leads"
        searchPlaceholder="Search by name, email, company"
        onRowClick={setSelected}
        emptyTitle="No leads yet"
        emptyMessage="New leads captured from the site and campaigns will show up here."
        filters={
          <>
            <FilterSelect label="Status" value={strFilter(q.filters.status)} onChange={(v) => q.setFilter('status', v)} options={LEAD_STATUS_OPTIONS} />
            <FilterSelect label="Owner" value={strFilter(q.filters.ownerId)} onChange={(v) => q.setFilter('ownerId', v)} options={opts.owners} width={160} />
            <FilterSelect label="Source" value={strFilter(q.filters.sourceId)} onChange={(v) => q.setFilter('sourceId', v)} options={opts.sources} width={170} />
          </>
        }
        actions={<Button variant="primary" icon={<Plus size={15} />} onClick={() => setCreating(true)}>New lead</Button>}
      />

      <LeadDrawer
        lead={selected}
        onClose={() => setSelected(null)}
        onChanged={(next) => {
          setSelected(next);
          q.refetch();
        }}
      />
      <NewLeadModal open={creating} onClose={() => setCreating(false)} onCreated={() => q.refetch()} />
    </>
  );
}

function strFilter(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

// ── Detail drawer ────────────────────────────────────────────────────────────

function LeadDrawer({ lead, onClose, onChanged }: { lead: Lead | null; onClose: () => void; onChanged: (next: Lead | null) => void }) {
  const svc = useServices();
  const { sourceName } = useReference();
  const opts = useRefOptions();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!lead) return null;

  const patch = async (p: Partial<Lead>) => {
    setBusy(true);
    try {
      const next = await svc.leads.update(lead.id, p);
      onChanged(next);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    await svc.leads.remove(lead.id);
    onChanged(null);
    onClose();
  };

  const utm = lead.attribution.utm;

  return (
    <>
      <Drawer
        open={Boolean(lead)}
        onClose={onClose}
        title={lead.name}
        subtitle={lead.email}
        footer={
          <>
            <Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setConfirmDelete(true)}>Delete</Button>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </>
        }
      >
        <div className="flex items-center gap-2 mb-5">
          <LeadStatusBadge status={lead.status} />
          <ScoreBar score={lead.score} />
        </div>

        <DrawerSection title="Details">
          <DetailGrid>
            <DetailRow label="Company">{lead.companyName ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
            <DetailRow label="Phone">{lead.phone ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
            <DetailRow label="Value">{formatCurrency(lead.estimatedValue)}</DetailRow>
            <DetailRow label="Source">{sourceName(lead.sourceId)}</DetailRow>
            <DetailRow label="Owner"><OwnerCell id={lead.ownerId} /></DetailRow>
            <DetailRow label="Tags"><TagChips ids={lead.tagIds} /></DetailRow>
            <DetailRow label="Follow up">{lead.followUpAt ? formatDate(lead.followUpAt) : <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
            <DetailRow label="Created">{formatDate(lead.createdAt)} <span style={{ color: tokens.ink3 }}>({formatRelative(lead.createdAt)})</span></DetailRow>
            <DetailRow label="Last activity">{formatRelative(lead.lastActivityAt)}</DetailRow>
          </DetailGrid>
        </DrawerSection>

        <DrawerSection title="Update">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Status">
              <Select value={lead.status} disabled={busy} onChange={(e) => patch({ status: e.target.value as LeadStatus })}>
                {LEAD_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
            <Field label="Owner">
              <Select value={lead.ownerId} disabled={busy} onChange={(e) => patch({ ownerId: e.target.value })}>
                {opts.owners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
          </div>
        </DrawerSection>

        <DrawerSection title="UTM attribution">
          <DetailGrid>
            <DetailRow label="Source">{utm.source ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
            <DetailRow label="Medium">{utm.medium ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
            <DetailRow label="Campaign">{utm.campaign ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
            <DetailRow label="Landing">{lead.attribution.landingPage ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
            <DetailRow label="Referrer">
              {lead.attribution.referrer
                ? <span className="inline-flex items-center gap-1 truncate">{lead.attribution.referrer}<ExternalLink size={12} /></span>
                : <span style={{ color: tokens.ink3 }}>Direct</span>}
            </DetailRow>
          </DetailGrid>
        </DrawerSection>

        <DrawerSection title="Linked activity">
          <RelatedActivity entityId={lead.id} />
        </DrawerSection>
      </Drawer>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => void remove()}
        title="Delete lead"
        message={<>Delete <b>{lead.name}</b>? This removes the lead from the mock store for this session.</>}
        confirmLabel="Delete lead"
        danger
      />
    </>
  );
}

// ── Create modal ─────────────────────────────────────────────────────────────

function NewLeadModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const svc = useServices();
  const opts = useRefOptions();
  const [form, setForm] = useState({ name: '', email: '', companyName: '', status: 'new' as LeadStatus, ownerId: '', sourceId: '', estimatedValue: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.name.trim()) { setError('A name is required.'); return; }
    setBusy(true);
    setError(null);
    try {
      await svc.leads.create({
        name: form.name.trim(),
        email: form.email.trim(),
        companyName: form.companyName.trim() || undefined,
        status: form.status,
        ownerId: form.ownerId || undefined,
        sourceId: form.sourceId || undefined,
        estimatedValue: form.estimatedValue ? Number(form.estimatedValue) : 0,
      });
      onCreated();
      onClose();
      setForm({ name: '', email: '', companyName: '', status: 'new', ownerId: '', sourceId: '', estimatedValue: '' });
    } catch {
      setError('Could not create the lead. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New lead"
      subtitle="Add a lead to the funnel"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" disabled={busy} onClick={() => void submit()}>{busy ? 'Creating' : 'Create lead'}</Button>
        </>
      }
    >
      {error && <p className="mb-3 text-[12.5px]" style={{ color: '#B23B30' }}>{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" required className="col-span-2"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" /></Field>
        <Field label="Email" className="col-span-2"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.ch" /></Field>
        <Field label="Company"><Input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></Field>
        <Field label="Estimated value (CHF)"><Input type="number" value={form.estimatedValue} onChange={(e) => setForm({ ...form, estimatedValue: e.target.value })} /></Field>
        <Field label="Status">
          <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as LeadStatus })}>
            {LEAD_STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Owner">
          <Select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })}>
            <option value="">Auto</option>
            {opts.owners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Source" className="col-span-2">
          <Select value={form.sourceId} onChange={(e) => setForm({ ...form, sourceId: e.target.value })}>
            <option value="">Auto</option>
            {opts.sources.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
