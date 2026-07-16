import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { tokens } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useReference } from '../../context/ReferenceContext';
import { useResourceQuery } from '../../hooks';
import { PageHeader } from '../../components/layout';
import { ResourceListView, FilterSelect } from '../../components/data';
import type { Column } from '../../components/data';
import { Button, Field, Input, Select, Modal, ConfirmDialog } from '../../components/ui';
import { TagChip } from '../../components/domain/display';
import { TAG_COLOR_OPTIONS, ENTITY_KIND_OPTIONS } from '../shared/options';
import { formatDate } from '../../utils/format';
import type { Tag, TagColor, EntityKind } from '../../types';

const KINDS: EntityKind[] = ['lead', 'contact', 'company', 'deal', 'submission'];

export function TagsPage() {
  const svc = useServices();
  const ref = useReference();
  const q = useResourceQuery<Tag>(svc.tags, { pageSize: 20, initialSort: { field: 'label', dir: 'asc' } });
  const [editing, setEditing] = useState<Tag | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Tag | null>(null);

  const afterChange = () => { q.refetch(); ref.refresh(); };

  const columns: Array<Column<Tag>> = [
    { key: 'label', header: 'Tag', sortable: true, render: (t) => <TagChip tag={t} /> },
    { key: 'color', header: 'Color', sortable: true, hideBelow: 'md', render: (t) => <span className="capitalize" style={{ color: tokens.ink2 }}>{t.color}</span> },
    { key: 'appliesTo', header: 'Applies to', hideBelow: 'md', render: (t) => <span className="text-[12.5px]" style={{ color: tokens.ink2 }}>{t.appliesTo.map((k) => k[0].toUpperCase() + k.slice(1)).join(', ')}</span> },
    { key: 'createdAt', header: 'Created', sortable: true, hideBelow: 'lg', align: 'right', render: (t) => <span style={{ color: tokens.ink3 }}>{formatDate(t.createdAt)}</span> },
    {
      key: 'actions', header: '', width: 48, align: 'right', render: (t) => (
        <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(t); }} aria-label="Delete tag" className="inline-flex items-center justify-center w-7 h-7 rounded-[8px]" style={{ color: tokens.ink3 }}>
          <Trash2 size={14} />
        </button>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Tags"
        subtitle={q.state.status === 'success' ? `${q.total} tags` : 'Labels applied across records'}
        actions={<Button variant="primary" icon={<Plus size={15} />} onClick={() => setCreating(true)}>New tag</Button>}
      />

      <ResourceListView
        query={q}
        columns={columns}
        rowKey={(t) => t.id}
        resourceKey="tags"
        searchPlaceholder="Search tags"
        onRowClick={setEditing}
        emptyTitle="No tags"
        emptyMessage="Create tags to segment leads, contacts and more."
        filters={<FilterSelect label="Color" value={strFilter(q.filters.color)} onChange={(v) => q.setFilter('color', v)} options={TAG_COLOR_OPTIONS} width={150} />}
      />

      <TagModal open={creating || Boolean(editing)} tag={editing} onClose={() => { setCreating(false); setEditing(null); }} onSaved={afterChange} />
      <ConfirmDialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => { if (confirmDelete) void svc.tags.remove(confirmDelete.id).then(afterChange); }}
        title="Delete tag"
        message={<>Delete the tag <b>{confirmDelete?.label}</b>?</>}
        confirmLabel="Delete tag"
        danger
      />
    </>
  );
}

function strFilter(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function TagModal({ open, tag, onClose, onSaved }: { open: boolean; tag: Tag | null; onClose: () => void; onSaved: () => void }) {
  const svc = useServices();
  const editing = Boolean(tag);
  const [label, setLabel] = useState(tag?.label ?? '');
  const [color, setColor] = useState<TagColor>(tag?.color ?? 'coral');
  const [appliesTo, setAppliesTo] = useState<EntityKind[]>(tag?.appliesTo ?? ['lead', 'contact']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seededFor, setSeededFor] = useState<string | null>(tag?.id ?? null);

  if (open && (tag?.id ?? null) !== seededFor) {
    setSeededFor(tag?.id ?? null);
    setLabel(tag?.label ?? '');
    setColor(tag?.color ?? 'coral');
    setAppliesTo(tag?.appliesTo ?? ['lead', 'contact']);
    setError(null);
  }

  const toggleKind = (k: EntityKind) => setAppliesTo((prev) => (prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]));

  const submit = async () => {
    if (!label.trim()) { setError('A label is required.'); return; }
    if (appliesTo.length === 0) { setError('Pick at least one record type.'); return; }
    setBusy(true); setError(null);
    try {
      if (tag) await svc.tags.update(tag.id, { label: label.trim(), color, appliesTo });
      else await svc.tags.create({ label: label.trim(), color, appliesTo });
      onSaved(); onClose();
    } catch { setError('Could not save the tag.'); } finally { setBusy(false); }
  };

  return (
    <Modal
      open={open} onClose={onClose} title={editing ? 'Edit tag' : 'New tag'} subtitle="Labels help segment records"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy} onClick={() => void submit()}>{busy ? 'Saving' : editing ? 'Save' : 'Create tag'}</Button></>}
    >
      {error && <p className="mb-3 text-[12.5px]" style={{ color: '#B23B30' }}>{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Label"><Input value={label} onChange={(e) => setLabel(e.target.value)} /></Field>
        <Field label="Color">
          <Select value={color} onChange={(e) => setColor(e.target.value as TagColor)}>
            {TAG_COLOR_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
      </div>
      <div className="mt-3">
        <div className="text-[12px] font-semibold mb-1.5" style={{ color: tokens.ink2 }}>Applies to</div>
        <div className="flex flex-wrap gap-1.5">
          {KINDS.map((k) => {
            const active = appliesTo.includes(k);
            const label2 = ENTITY_KIND_OPTIONS.find((o) => o.value === k)?.label ?? k;
            return (
              <button
                key={k}
                onClick={() => toggleKind(k)}
                className="h-8 px-3 rounded-[9px] text-[12.5px] font-semibold transition-colors"
                style={{ background: active ? tokens.coralSoft : tokens.surface, color: active ? tokens.coral : tokens.ink2, border: `1px solid ${active ? tokens.coralBorder : tokens.border}` }}
              >
                {label2}
              </button>
            );
          })}
        </div>
      </div>
      <div className="mt-4">
        <div className="text-[12px] font-semibold mb-1.5" style={{ color: tokens.ink2 }}>Preview</div>
        <TagChip tag={{ id: 'preview', label: label || 'Tag', color, appliesTo, createdAt: new Date().toISOString() }} />
      </div>
    </Modal>
  );
}
