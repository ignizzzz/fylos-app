import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { tokens } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useReference } from '../../context/ReferenceContext';
import { useResourceQuery } from '../../hooks';
import { PageHeader } from '../../components/layout';
import { ResourceListView, FilterSelect } from '../../components/data';
import type { Column } from '../../components/data';
import { Button, Field, Input, Select, Modal, ConfirmDialog, Badge } from '../../components/ui';
import { SourceCategoryBadge } from '../../components/domain/display';
import { SOURCE_CATEGORY_OPTIONS } from '../shared/options';
import { formatDate } from '../../utils/format';
import type { LeadSource, SourceCategory } from '../../types';

const ACTIVE_OPTIONS = [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }];

export function SourcesPage() {
  const svc = useServices();
  const ref = useReference();
  const q = useResourceQuery<LeadSource>(svc.sources, { pageSize: 20, initialSort: { field: 'name', dir: 'asc' } });
  const [editing, setEditing] = useState<LeadSource | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<LeadSource | null>(null);

  const afterChange = () => { q.refetch(); ref.refresh(); };
  const toggleActive = async (s: LeadSource) => { await svc.sources.update(s.id, { isActive: !s.isActive }); afterChange(); };

  const columns: Array<Column<LeadSource>> = [
    { key: 'name', header: 'Source', sortable: true, render: (s) => <span className="font-semibold" style={{ color: tokens.ink }}>{s.name}</span> },
    { key: 'category', header: 'Category', sortable: true, render: (s) => <SourceCategoryBadge category={s.category} /> },
    {
      key: 'isActive', header: 'Status', sortable: true, render: (s) => (
        <button onClick={(e) => { e.stopPropagation(); void toggleActive(s); }} aria-label="Toggle active">
          <Badge tone={s.isActive ? 'green' : 'slate'} dot>{s.isActive ? 'Active' : 'Inactive'}</Badge>
        </button>
      ),
    },
    { key: 'createdAt', header: 'Created', sortable: true, hideBelow: 'md', align: 'right', render: (s) => <span style={{ color: tokens.ink3 }}>{formatDate(s.createdAt)}</span> },
    {
      key: 'actions', header: '', width: 48, align: 'right', render: (s) => (
        <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(s); }} aria-label="Delete source" className="inline-flex items-center justify-center w-7 h-7 rounded-[8px]" style={{ color: tokens.ink3 }}>
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Lead sources"
        subtitle={q.state.status === 'success' ? `${q.total} sources` : 'Where leads and contacts come from'}
        actions={<Button variant="primary" icon={<Plus size={15} />} onClick={() => setCreating(true)}>New source</Button>}
      />

      <ResourceListView
        query={q}
        columns={columns}
        rowKey={(s) => s.id}
        resourceKey="sources"
        searchPlaceholder="Search sources"
        onRowClick={setEditing}
        emptyTitle="No sources"
        emptyMessage="Add the channels your leads come from."
        filters={
          <>
            <FilterSelect label="Category" value={strFilter(q.filters.category)} onChange={(v) => q.setFilter('category', v)} options={SOURCE_CATEGORY_OPTIONS} width={160} />
            <FilterSelect label="Status" value={strFilter(q.filters.isActive)} onChange={(v) => q.setFilter('isActive', v)} options={ACTIVE_OPTIONS} width={140} allLabel="Any" />
          </>
        }
      />

      <SourceModal open={creating || Boolean(editing)} source={editing} onClose={() => { setCreating(false); setEditing(null); }} onSaved={afterChange} />
      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) void svc.sources.remove(confirmDelete.id).then(afterChange); }}
        title="Delete source"
        message={<>Delete the source <b>{confirmDelete?.name}</b>?</>}
        confirmLabel="Delete source"
        danger
      />
    </>
  );
}

function strFilter(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function SourceModal({ open, source, onClose, onSaved }: { open: boolean; source: LeadSource | null; onClose: () => void; onSaved: () => void }) {
  const svc = useServices();
  const editing = Boolean(source);
  const [name, setName] = useState(source?.name ?? '');
  const [category, setCategory] = useState<SourceCategory>(source?.category ?? 'organic');
  const [description, setDescription] = useState(source?.description ?? '');
  const [isActive, setIsActive] = useState(source?.isActive ?? true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seededFor, setSeededFor] = useState<string | null>(source?.id ?? null);

  if (open && (source?.id ?? null) !== seededFor) {
    setSeededFor(source?.id ?? null);
    setName(source?.name ?? '');
    setCategory(source?.category ?? 'organic');
    setDescription(source?.description ?? '');
    setIsActive(source?.isActive ?? true);
    setError(null);
  }

  const submit = async () => {
    if (!name.trim()) { setError('A name is required.'); return; }
    setBusy(true); setError(null);
    try {
      if (source) await svc.sources.update(source.id, { name: name.trim(), category, description: description.trim() || undefined, isActive });
      else await svc.sources.create({ name: name.trim(), category, description: description.trim() || undefined, isActive });
      onSaved(); onClose();
    } catch { setError('Could not save the source.'); } finally { setBusy(false); }
  };

  return (
    <Modal
      open={open} onClose={onClose} title={editing ? 'Edit source' : 'New source'} subtitle="A channel leads arrive through"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy} onClick={() => void submit()}>{busy ? 'Saving' : editing ? 'Save' : 'Create source'}</Button></>}
    >
      {error && <p className="mb-3 text-[12.5px]" style={{ color: '#B23B30' }}>{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" className="col-span-2"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Category">
          <Select value={category} onChange={(e) => setCategory(e.target.value as SourceCategory)}>
            {SOURCE_CATEGORY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Status">
          <Select value={isActive ? 'true' : 'false'} onChange={(e) => setIsActive(e.target.value === 'true')}>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
        </Field>
        <Field label="Description" className="col-span-2"><Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional" /></Field>
      </div>
    </Modal>
  );
}
