import { useMemo, useState } from 'react';
import type { DragEvent } from 'react';
import { Plus, GripVertical, MoveRight } from 'lucide-react';
import { tokens, shadows } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useReference } from '../../context/ReferenceContext';
import { useResourceQuery } from '../../hooks';
import { useRefOptions } from '../shared/useRefOptions';
import { useCompanyLookup } from '../shared/useCompanyLookup';
import { PageHeader } from '../../components/layout';
import { Toolbar, SearchInput, FilterSelect, DemoStateMenu } from '../../components/data';
import { Button, Avatar, Field, Input, Select, Modal, Card } from '../../components/ui';
import { TagChips, StageBadge, OwnerCell } from '../../components/domain/display';
import { ErrorState, TableSkeleton, EmptyState } from '../../components/states';
import { DrawerSection, DetailGrid, DetailRow } from '../shared/DetailKit';
import { Drawer } from '../../components/ui';
import { Menu } from '../../components/ui/overlays';
import { formatCompactCurrency, formatCurrency, formatDate } from '../../utils/format';
import type { Deal, PipelineStageId } from '../../types';

export function PipelinePage() {
  const svc = useServices();
  const { pipeline } = useReference();
  const opts = useRefOptions();
  const companyLookup = useCompanyLookup();
  const q = useResourceQuery<Deal>(svc.deals, { pageSize: 500, initialSort: { field: 'value', dir: 'desc' } });
  const [selected, setSelected] = useState<Deal | null>(null);
  const [creating, setCreating] = useState(false);
  const [dragOver, setDragOver] = useState<PipelineStageId | null>(null);

  const byStage = useMemo(() => {
    const map = new Map<PipelineStageId, Deal[]>();
    for (const stage of pipeline) map.set(stage.id, []);
    for (const deal of q.items) map.get(deal.stageId)?.push(deal);
    return map;
  }, [q.items, pipeline]);

  const openValue = useMemo(
    () => q.items.filter((d) => { const s = pipeline.find((p) => p.id === d.stageId); return s && !s.isClosed; }).reduce((s, d) => s + d.value, 0),
    [q.items, pipeline],
  );

  const move = async (dealId: string, stageId: PipelineStageId) => {
    const deal = q.items.find((d) => d.id === dealId);
    if (!deal || deal.stageId === stageId) return;
    const stage = pipeline.find((s) => s.id === stageId);
    await svc.deals.update(dealId, { stageId, closedAt: stage?.isClosed ? new Date().toISOString() : null });
    q.refetch();
  };

  const onDrop = (e: DragEvent, stageId: PipelineStageId) => {
    e.preventDefault();
    setDragOver(null);
    const id = e.dataTransfer.getData('text/plain');
    if (id) void move(id, stageId);
  };

  return (
    <>
      <PageHeader
        title="Sales pipeline"
        subtitle={`${q.items.length} deals, ${formatCompactCurrency(openValue)} open`}
        actions={<Button variant="primary" icon={<Plus size={15} />} onClick={() => setCreating(true)}>New deal</Button>}
      />

      <Toolbar
        left={
          <>
            <SearchInput value={q.search} onChange={q.setSearch} placeholder="Search deals" />
            <FilterSelect label="Owner" value={typeof q.filters.ownerId === 'string' ? q.filters.ownerId : ''} onChange={(v) => q.setFilter('ownerId', v)} options={opts.owners} width={160} />
          </>
        }
        right={<DemoStateMenu resourceKey="deals" />}
      />

      {q.state.status === 'error' ? (
        <Card><ErrorState error={q.state.error} onRetry={q.refetch} /></Card>
      ) : q.state.status === 'loading' ? (
        <Card padded={false}><TableSkeleton rows={6} cols={5} /></Card>
      ) : q.items.length === 0 ? (
        <Card><EmptyState title="No deals" message="Deals you create will show up on the board." /></Card>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2" style={{ minHeight: 400 }}>
          {pipeline.map((stage) => {
            const deals = byStage.get(stage.id) ?? [];
            const total = deals.reduce((s, d) => s + d.value, 0);
            const isTarget = dragOver === stage.id;
            return (
              <div
                key={stage.id}
                onDragOver={(e) => { e.preventDefault(); setDragOver(stage.id); }}
                onDragLeave={() => setDragOver((cur) => (cur === stage.id ? null : cur))}
                onDrop={(e) => onDrop(e, stage.id)}
                className="shrink-0 w-[264px] rounded-[14px] flex flex-col"
                style={{ background: isTarget ? tokens.coralSoft : tokens.surfaceAlt, border: `1px solid ${isTarget ? tokens.coralBorder : tokens.border}`, transition: 'background .12s' }}
              >
                <div className="px-3 py-2.5 flex items-center justify-between border-b" style={{ borderColor: tokens.border }}>
                  <div className="flex items-center gap-2">
                    <StageBadge stageId={stage.id} />
                    <span className="text-[12px] tabular-nums" style={{ color: tokens.ink3 }}>{deals.length}</span>
                  </div>
                  <span className="text-[12px] font-semibold tabular-nums" style={{ color: tokens.ink2 }}>{formatCompactCurrency(total)}</span>
                </div>
                <div className="p-2 space-y-2 overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(100dvh - 320px)' }}>
                  {deals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      companyName={companyLookup.companyName(deal.companyId)}
                      stages={pipeline}
                      onOpen={() => setSelected(deal)}
                      onMove={(sid) => void move(deal.id, sid)}
                    />
                  ))}
                  {deals.length === 0 && (
                    <div className="text-center text-[12px] py-6" style={{ color: tokens.ink3 }}>Drop deals here</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <DealDrawer deal={selected} companyName={companyLookup.companyName} onClose={() => setSelected(null)} onChanged={(next) => { setSelected(next); q.refetch(); }} />
      <NewDealModal open={creating} onClose={() => setCreating(false)} onCreated={() => q.refetch()} companyOptions={companyLookup.options} />
    </>
  );
}

function DealCard({ deal, companyName, stages, onOpen, onMove }: {
  deal: Deal; companyName: string;
  stages: Array<{ id: PipelineStageId; label: string }>;
  onOpen: () => void; onMove: (stageId: PipelineStageId) => void;
}) {
  const { memberById } = useReference();
  const owner = memberById(deal.ownerId);
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/plain', deal.id)}
      className="group rounded-[11px] p-2.5 cursor-grab active:cursor-grabbing"
      style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, boxShadow: shadows.sm }}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical size={14} className="mt-0.5 shrink-0 opacity-40" style={{ color: tokens.ink3 }} />
        <button onClick={onOpen} className="flex-1 min-w-0 text-left">
          <div className="text-[13px] font-semibold leading-snug line-clamp-2" style={{ color: tokens.ink }}>{deal.title}</div>
          <div className="text-[12px] truncate mt-0.5" style={{ color: tokens.ink3 }}>{companyName}</div>
        </button>
        <Menu
          width={170}
          items={stages.map((s) => ({ label: `Move to ${s.label}`, checked: s.id === deal.stageId, onClick: () => onMove(s.id) }))}
          trigger={({ toggle }) => (
            <button onClick={toggle} aria-label="Move deal" className="shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 transition-opacity" style={{ color: tokens.ink3 }}>
              <MoveRight size={15} />
            </button>
          )}
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[13px] font-bold tabular-nums" style={{ color: tokens.ink }}>{formatCurrency(deal.value)}</span>
        {owner && <Avatar name={owner.name} color={owner.avatarColor} size={22} />}
      </div>
    </div>
  );
}

function DealDrawer({ deal, companyName, onClose, onChanged }: { deal: Deal | null; companyName: (id?: string | null) => string; onClose: () => void; onChanged: (next: Deal | null) => void }) {
  const svc = useServices();
  const { pipeline } = useReference();
  const opts = useRefOptions();
  const [busy, setBusy] = useState(false);
  if (!deal) return null;
  const patch = async (p: Partial<Deal>) => { setBusy(true); try { onChanged(await svc.deals.update(deal.id, p)); } finally { setBusy(false); } };
  const remove = async () => { await svc.deals.remove(deal.id); onChanged(null); onClose(); };

  return (
    <Drawer
      open={Boolean(deal)}
      onClose={onClose}
      title={deal.title}
      subtitle={companyName(deal.companyId)}
      footer={<><Button variant="danger" onClick={() => void remove()}>Delete</Button><Button variant="secondary" onClick={onClose}>Close</Button></>}
    >
      <div className="flex items-center gap-2 mb-5">
        <StageBadge stageId={deal.stageId} />
        <span className="text-[18px] font-bold tabular-nums" style={{ color: tokens.ink }}>{formatCurrency(deal.value)}</span>
      </div>
      <DrawerSection title="Details">
        <DetailGrid>
          <DetailRow label="Company">{companyName(deal.companyId)}</DetailRow>
          <DetailRow label="Owner"><OwnerCell id={deal.ownerId} /></DetailRow>
          <DetailRow label="Expected close">{formatDate(deal.expectedCloseAt)}</DetailRow>
          <DetailRow label="Created">{formatDate(deal.createdAt)}</DetailRow>
          <DetailRow label="Tags"><TagChips ids={deal.tagIds} /></DetailRow>
        </DetailGrid>
      </DrawerSection>
      <DrawerSection title="Update">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Stage">
            <Select value={deal.stageId} disabled={busy} onChange={(e) => patch({ stageId: e.target.value as PipelineStageId })}>
              {pipeline.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </Select>
          </Field>
          <Field label="Owner">
            <Select value={deal.ownerId} disabled={busy} onChange={(e) => patch({ ownerId: e.target.value })}>
              {opts.owners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </Select>
          </Field>
        </div>
      </DrawerSection>
    </Drawer>
  );
}

function NewDealModal({ open, onClose, onCreated, companyOptions }: { open: boolean; onClose: () => void; onCreated: () => void; companyOptions: Array<{ value: string; label: string }> }) {
  const svc = useServices();
  const { pipeline } = useReference();
  const opts = useRefOptions();
  const [form, setForm] = useState({ title: '', value: '', stageId: 'new' as PipelineStageId, companyId: '', ownerId: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.title.trim()) { setError('A title is required.'); return; }
    setBusy(true); setError(null);
    try {
      await svc.deals.create({
        title: form.title.trim(), value: form.value ? Number(form.value) : 0, stageId: form.stageId,
        companyId: form.companyId || undefined, ownerId: form.ownerId || undefined,
        expectedCloseAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      });
      onCreated(); onClose();
      setForm({ title: '', value: '', stageId: 'new', companyId: '', ownerId: '' });
    } catch { setError('Could not create the deal.'); } finally { setBusy(false); }
  };

  return (
    <Modal
      open={open} onClose={onClose} title="New deal" subtitle="Add a deal to the pipeline"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy} onClick={() => void submit()}>{busy ? 'Creating' : 'Create deal'}</Button></>}
    >
      {error && <p className="mb-3 text-[12.5px]" style={{ color: '#B23B30' }}>{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Title" required className="col-span-2"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Deal title" /></Field>
        <Field label="Value (CHF)"><Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></Field>
        <Field label="Stage">
          <Select value={form.stageId} onChange={(e) => setForm({ ...form, stageId: e.target.value as PipelineStageId })}>
            {pipeline.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </Select>
        </Field>
        <Field label="Company">
          <Select value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })}>
            <option value="">None</option>
            {companyOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Owner">
          <Select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })}>
            <option value="">Auto</option>
            {opts.owners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
