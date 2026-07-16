import { useState } from 'react';
import { Plus, Trash2, Mail, Phone } from 'lucide-react';
import { tokens } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useReference } from '../../context/ReferenceContext';
import { useResourceQuery } from '../../hooks';
import { useRefOptions } from '../shared/useRefOptions';
import { useCompanyLookup } from '../shared/useCompanyLookup';
import { PageHeader } from '../../components/layout';
import { ResourceListView, FilterSelect } from '../../components/data';
import type { Column } from '../../components/data';
import { Button, Avatar, Field, Input, Select, Drawer, Modal, ConfirmDialog } from '../../components/ui';
import { LifecycleBadge, OwnerCell, TagChips } from '../../components/domain/display';
import { DrawerSection, DetailGrid, DetailRow, RelatedActivity } from '../shared/DetailKit';
import { LIFECYCLE_OPTIONS } from '../shared/options';
import { formatDate, formatRelative } from '../../utils/format';
import type { Contact, LifecycleStage } from '../../types';

export function ContactsPage() {
  const svc = useServices();
  const { sourceName } = useReference();
  const opts = useRefOptions();
  const companyLookup = useCompanyLookup();
  const q = useResourceQuery<Contact>(svc.contacts, { pageSize: 20 });

  const [selected, setSelected] = useState<Contact | null>(null);
  const [creating, setCreating] = useState(false);

  const columns: Array<Column<Contact>> = [
    {
      key: 'name', header: 'Contact', sortable: true, render: (c) => (
        <span className="inline-flex items-center gap-2.5 min-w-0">
          <Avatar name={`${c.firstName} ${c.lastName}`} color={c.avatarColor} size={30} />
          <span className="min-w-0">
            <span className="block font-semibold truncate" style={{ color: tokens.ink }}>{c.firstName} {c.lastName}</span>
            <span className="block text-[12px] truncate" style={{ color: tokens.ink3 }}>{c.title ?? c.email}</span>
          </span>
        </span>
      ),
    },
    { key: 'email', header: 'Email', sortable: true, hideBelow: 'lg', render: (c) => <span style={{ color: tokens.ink2 }}>{c.email}</span> },
    { key: 'company', header: 'Company', sortable: true, hideBelow: 'md', render: (c) => <span style={{ color: c.companyId ? tokens.ink : tokens.ink3 }}>{companyLookup.companyName(c.companyId)}</span> },
    { key: 'lifecycleStage', header: 'Stage', sortable: true, render: (c) => <LifecycleBadge stage={c.lifecycleStage} /> },
    { key: 'owner', header: 'Owner', sortable: true, hideBelow: 'lg', render: (c) => <OwnerCell id={c.ownerId} /> },
    { key: 'lastActivityAt', header: 'Last activity', sortable: true, align: 'right', hideBelow: 'md', render: (c) => <span style={{ color: tokens.ink3 }}>{formatRelative(c.lastActivityAt)}</span> },
  ];

  return (
    <>
      <PageHeader
        title="Contacts"
        subtitle={q.state.status === 'success' ? `${q.total.toLocaleString('de-CH')} people` : 'Everyone in the CRM'}
      />
      <ResourceListView
        query={q}
        columns={columns}
        rowKey={(c) => c.id}
        resourceKey="contacts"
        searchPlaceholder="Search by name, email, company"
        onRowClick={setSelected}
        emptyTitle="No contacts yet"
        emptyMessage="People you add or convert from leads will appear here."
        filters={
          <>
            <FilterSelect label="Stage" value={strFilter(q.filters.lifecycleStage)} onChange={(v) => q.setFilter('lifecycleStage', v)} options={LIFECYCLE_OPTIONS} width={150} />
            <FilterSelect label="Owner" value={strFilter(q.filters.ownerId)} onChange={(v) => q.setFilter('ownerId', v)} options={opts.owners} width={160} />
            <FilterSelect label="Source" value={strFilter(q.filters.sourceId)} onChange={(v) => q.setFilter('sourceId', v)} options={opts.sources} width={170} />
          </>
        }
        actions={<Button variant="primary" icon={<Plus size={15} />} onClick={() => setCreating(true)}>New contact</Button>}
      />

      <ContactDrawer
        contact={selected}
        companyName={companyLookup.companyName}
        sourceName={sourceName}
        onClose={() => setSelected(null)}
        onChanged={(next) => { setSelected(next); q.refetch(); }}
      />
      <NewContactModal open={creating} onClose={() => setCreating(false)} onCreated={() => q.refetch()} companyOptions={companyLookup.options} />
    </>
  );
}

function strFilter(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function ContactDrawer({ contact, companyName, sourceName, onClose, onChanged }: {
  contact: Contact | null;
  companyName: (id?: string | null) => string;
  sourceName: (id?: string | null) => string;
  onClose: () => void;
  onChanged: (next: Contact | null) => void;
}) {
  const svc = useServices();
  const opts = useRefOptions();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!contact) return null;

  const patch = async (p: Partial<Contact>) => {
    setBusy(true);
    try { onChanged(await svc.contacts.update(contact.id, p)); } finally { setBusy(false); }
  };
  const remove = async () => { await svc.contacts.remove(contact.id); onChanged(null); onClose(); };

  return (
    <>
      <Drawer
        open={Boolean(contact)}
        onClose={onClose}
        title={`${contact.firstName} ${contact.lastName}`}
        subtitle={contact.title ?? contact.email}
        footer={
          <>
            <Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setConfirmDelete(true)}>Delete</Button>
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </>
        }
      >
        <div className="flex items-center gap-3 mb-5">
          <Avatar name={`${contact.firstName} ${contact.lastName}`} color={contact.avatarColor} size={44} />
          <div className="flex items-center gap-2 flex-wrap">
            <LifecycleBadge stage={contact.lifecycleStage} />
          </div>
        </div>

        <DrawerSection title="Details">
          <DetailGrid>
            <DetailRow label="Email"><span className="inline-flex items-center gap-1.5"><Mail size={13} style={{ color: tokens.ink3 }} />{contact.email}</span></DetailRow>
            <DetailRow label="Phone">{contact.phone ? <span className="inline-flex items-center gap-1.5"><Phone size={13} style={{ color: tokens.ink3 }} />{contact.phone}</span> : <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
            <DetailRow label="Company">{companyName(contact.companyId)}</DetailRow>
            <DetailRow label="Location">{contact.city ? `${contact.city}, ${contact.country}` : <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
            <DetailRow label="Source">{sourceName(contact.sourceId)}</DetailRow>
            <DetailRow label="Owner"><OwnerCell id={contact.ownerId} /></DetailRow>
            <DetailRow label="Tags"><TagChips ids={contact.tagIds} /></DetailRow>
            <DetailRow label="Created">{formatDate(contact.createdAt)}</DetailRow>
          </DetailGrid>
        </DrawerSection>

        <DrawerSection title="Update">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stage">
              <Select value={contact.lifecycleStage} disabled={busy} onChange={(e) => patch({ lifecycleStage: e.target.value as LifecycleStage })}>
                {LIFECYCLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
            <Field label="Owner">
              <Select value={contact.ownerId} disabled={busy} onChange={(e) => patch({ ownerId: e.target.value })}>
                {opts.owners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
          </div>
        </DrawerSection>

        <DrawerSection title="Linked activity">
          <RelatedActivity entityId={contact.id} />
        </DrawerSection>
      </Drawer>

      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => void remove()}
        title="Delete contact"
        message={<>Delete <b>{contact.firstName} {contact.lastName}</b> from the mock store?</>}
        confirmLabel="Delete contact"
        danger
      />
    </>
  );
}

function NewContactModal({ open, onClose, onCreated, companyOptions }: {
  open: boolean; onClose: () => void; onCreated: () => void; companyOptions: Array<{ value: string; label: string }>;
}) {
  const svc = useServices();
  const opts = useRefOptions();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', title: '', companyId: '', lifecycleStage: 'lead' as LifecycleStage, ownerId: '', sourceId: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) { setError('First and last name are required.'); return; }
    setBusy(true); setError(null);
    try {
      await svc.contacts.create({
        firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(),
        title: form.title.trim() || undefined, companyId: form.companyId || undefined,
        lifecycleStage: form.lifecycleStage, ownerId: form.ownerId || undefined, sourceId: form.sourceId || undefined,
      });
      onCreated(); onClose();
      setForm({ firstName: '', lastName: '', email: '', title: '', companyId: '', lifecycleStage: 'lead', ownerId: '', sourceId: '' });
    } catch { setError('Could not create the contact.'); } finally { setBusy(false); }
  };

  return (
    <Modal
      open={open} onClose={onClose} title="New contact" subtitle="Add a person to the CRM"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy} onClick={() => void submit()}>{busy ? 'Creating' : 'Create contact'}</Button></>}
    >
      {error && <p className="mb-3 text-[12.5px]" style={{ color: '#B23B30' }}>{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" required><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
        <Field label="Last name" required><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
        <Field label="Email" className="col-span-2"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
        <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
        <Field label="Company">
          <Select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
            <option value="">None</option>
            {companyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Stage">
          <Select value={form.lifecycleStage} onChange={(e) => setForm({ ...form, lifecycleStage: e.target.value as LifecycleStage })}>
            {LIFECYCLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
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
