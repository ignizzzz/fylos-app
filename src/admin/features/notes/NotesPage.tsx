import { useEffect, useState } from 'react';
import { Plus, Pin, PinOff } from 'lucide-react';
import { tokens } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useResourceQuery } from '../../hooks';
import { useRefOptions } from '../shared/useRefOptions';
import { PageHeader } from '../../components/layout';
import { ResourceListView, FilterSelect } from '../../components/data';
import type { Column } from '../../components/data';
import { Button, Field, Textarea, Select, Modal } from '../../components/ui';
import { OwnerCell, EntityRefChip } from '../../components/domain/display';
import { ENTITY_KIND_OPTIONS } from '../shared/options';
import { formatRelative } from '../../utils/format';
import type { Note, Lead } from '../../types';

const PINNED_OPTIONS = [{ value: 'true', label: 'Pinned' }, { value: 'false', label: 'Not pinned' }];

export function NotesPage() {
  const svc = useServices();
  const opts = useRefOptions();
  const q = useResourceQuery<Note>(svc.notes, { pageSize: 20, initialSort: { field: 'createdAt', dir: 'desc' } });
  const [editing, setEditing] = useState<Note | null>(null);
  const [creating, setCreating] = useState(false);

  const togglePin = async (n: Note) => {
    await svc.notes.update(n.id, { pinned: !n.pinned });
    q.refetch();
  };

  const columns: Array<Column<Note>> = [
    {
      key: 'body', header: 'Note', render: (n) => (
        <div className="min-w-0 max-w-[520px]">
          <p className="text-[13px] leading-snug line-clamp-2" style={{ color: tokens.ink }}>{n.body}</p>
          <div className="mt-1"><EntityRefChip entity={n.related} /></div>
        </div>
      ),
    },
    { key: 'author', header: 'Author', sortable: true, hideBelow: 'md', render: (n) => <OwnerCell id={n.authorId} /> },
    { key: 'createdAt', header: 'When', sortable: true, hideBelow: 'md', align: 'right', render: (n) => <span style={{ color: tokens.ink3 }}>{formatRelative(n.createdAt)}</span> },
    {
      key: 'pinned', header: '', width: 44, align: 'right', render: (n) => (
        <button
          onClick={(e) => { e.stopPropagation(); void togglePin(n); }}
          aria-label={n.pinned ? 'Unpin' : 'Pin'}
          className="inline-flex items-center justify-center w-7 h-7 rounded-[8px]"
          style={{ color: n.pinned ? tokens.coral : tokens.ink3, background: n.pinned ? tokens.coralSoft : 'transparent' }}
        >
          {n.pinned ? <Pin size={14} /> : <PinOff size={14} />}
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Notes"
        subtitle={q.state.status === 'success' ? `${q.total.toLocaleString('de-CH')} notes across records` : 'Context on leads, contacts, companies and deals'}
        actions={<Button variant="primary" icon={<Plus size={15} />} onClick={() => setCreating(true)}>New note</Button>}
      />

      <ResourceListView
        query={q}
        columns={columns}
        rowKey={(n) => n.id}
        resourceKey="notes"
        searchPlaceholder="Search notes"
        onRowClick={setEditing}
        emptyTitle="No notes"
        emptyMessage="Notes you add to records will collect here."
        filters={
          <>
            <FilterSelect label="Author" value={strFilter(q.filters.authorId)} onChange={(v) => q.setFilter('authorId', v)} options={opts.owners} width={160} />
            <FilterSelect label="On" value={strFilter(q.filters.kind)} onChange={(v) => q.setFilter('kind', v)} options={ENTITY_KIND_OPTIONS} width={150} />
            <FilterSelect label="Pinned" value={strFilter(q.filters.pinned)} onChange={(v) => q.setFilter('pinned', v)} options={PINNED_OPTIONS} width={150} allLabel="Any" />
          </>
        }
      />

      <NoteModal open={creating || Boolean(editing)} note={editing} onClose={() => { setCreating(false); setEditing(null); }} onSaved={() => q.refetch()} />
    </>
  );
}

function strFilter(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function NoteModal({ open, note, onClose, onSaved }: { open: boolean; note: Note | null; onClose: () => void; onSaved: () => void }) {
  const svc = useServices();
  const editing = Boolean(note);
  const [body, setBody] = useState(note?.body ?? '');
  const [leadId, setLeadId] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seededFor, setSeededFor] = useState<string | null>(note?.id ?? null);

  if (open && (note?.id ?? null) !== seededFor) {
    setSeededFor(note?.id ?? null);
    setBody(note?.body ?? '');
    setError(null);
  }

  useEffect(() => {
    if (!open || editing) return;
    let alive = true;
    svc.leads.list({ page: 1, pageSize: 100, sort: { field: 'createdAt', dir: 'desc' } })
      .then((r) => { if (alive) setLeads(r.items); })
      .catch(() => { /* ignore */ });
    return () => { alive = false; };
  }, [open, editing, svc]);

  const submit = async () => {
    if (!body.trim()) { setError('Write something first.'); return; }
    setBusy(true); setError(null);
    try {
      if (note) {
        await svc.notes.update(note.id, { body: body.trim() });
      } else {
        const lead = leads.find((l) => l.id === leadId);
        if (!lead) { setError('Choose a lead to attach this note to.'); setBusy(false); return; }
        await svc.notes.create({ body: body.trim(), related: { kind: 'lead', id: lead.id, label: lead.name } });
      }
      onSaved(); onClose();
      setBody(''); setLeadId('');
    } catch { setError('Could not save the note.'); } finally { setBusy(false); }
  };

  return (
    <Modal
      open={open} onClose={onClose} title={editing ? 'Edit note' : 'New note'} subtitle={note ? `On ${note.related.label}` : 'Attach a note to a lead'}
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy} onClick={() => void submit()}>{busy ? 'Saving' : editing ? 'Save' : 'Add note'}</Button></>}
    >
      {error && <p className="mb-3 text-[12.5px]" style={{ color: '#B23B30' }}>{error}</p>}
      {!editing && (
        <Field label="Lead" required className="mb-3">
          <Select value={leadId} onChange={(e) => setLeadId(e.target.value)}>
            <option value="">Choose a lead</option>
            {leads.map((l) => <option key={l.id} value={l.id}>{l.name}{l.companyName ? ` (${l.companyName})` : ''}</option>)}
          </Select>
        </Field>
      )}
      <Field label="Note"><Textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} placeholder="What happened, what is next..." /></Field>
    </Modal>
  );
}
