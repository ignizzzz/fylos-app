import { useState } from 'react';
import { Plus, Trash2, Globe, Users2 } from 'lucide-react';
import { tokens, radii, fonts } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useResourceQuery } from '../../hooks';
import { useRefOptions } from '../shared/useRefOptions';
import { PageHeader } from '../../components/layout';
import { ResourceListView, FilterSelect } from '../../components/data';
import type { Column } from '../../components/data';
import { Button, Field, Input, Select, Drawer, Modal, ConfirmDialog, Badge } from '../../components/ui';
import { OwnerCell, TagChips } from '../../components/domain/display';
import { DrawerSection, DetailGrid, DetailRow, RelatedActivity } from '../shared/DetailKit';
import { INDUSTRY_OPTIONS, COMPANY_SIZE_OPTIONS } from '../shared/options';
import { formatCurrency, formatDate } from '../../utils/format';
import type { Company, Industry, CompanySize } from '../../types';

function CompanyMark({ name }: { name: string }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');
  return (
    <span className="inline-flex items-center justify-center shrink-0 font-bold text-[12px]" style={{ width: 30, height: 30, borderRadius: radii.sm, background: tokens.surfaceAlt, border: `1px solid ${tokens.border}`, color: tokens.ink2 }}>
      {initials}
    </span>
  );
}

export function CompaniesPage() {
  const svc = useServices();
  const opts = useRefOptions();
  const q = useResourceQuery<Company>(svc.companies, { pageSize: 20 });
  const [selected, setSelected] = useState<Company | null>(null);
  const [creating, setCreating] = useState(false);

  const columns: Array<Column<Company>> = [
    {
      key: 'name', header: 'Company', sortable: true, render: (c) => (
        <span className="inline-flex items-center gap-2.5 min-w-0">
          <CompanyMark name={c.name} />
          <span className="min-w-0">
            <span className="block font-semibold truncate" style={{ color: tokens.ink }}>{c.name}</span>
            <span className="block text-[12px] truncate" style={{ color: tokens.ink3 }}>{c.domain}</span>
          </span>
        </span>
      ),
    },
    { key: 'industry', header: 'Industry', sortable: true, hideBelow: 'md', render: (c) => <Badge tone="neutral">{c.industry}</Badge> },
    { key: 'size', header: 'Size', sortable: true, hideBelow: 'lg', render: (c) => <span style={{ color: tokens.ink2 }}>{c.size}</span> },
    { key: 'city', header: 'Location', sortable: true, hideBelow: 'lg', render: (c) => <span style={{ color: tokens.ink2 }}>{c.city}, {c.country}</span> },
    { key: 'contactCount', header: 'Contacts', sortable: true, align: 'right', render: (c) => <span className="tabular-nums">{c.contactCount}</span> },
    { key: 'openDealValue', header: 'Open value', sortable: true, align: 'right', render: (c) => <span className="tabular-nums">{formatCurrency(c.openDealValue)}</span> },
    { key: 'owner', header: 'Owner', sortable: true, hideBelow: 'lg', render: (c) => <OwnerCell id={c.ownerId} /> },
  ];

  return (
    <>
      <PageHeader title="Companies" subtitle={q.state.status === 'success' ? `${q.total.toLocaleString('de-CH')} organisations` : 'Accounts and organisations'} />
      <ResourceListView
        query={q}
        columns={columns}
        rowKey={(c) => c.id}
        resourceKey="companies"
        searchPlaceholder="Search by name, domain, city"
        onRowClick={setSelected}
        emptyTitle="No companies yet"
        emptyMessage="Organisations linked to your contacts and deals will appear here."
        filters={
          <>
            <FilterSelect label="Industry" value={strFilter(q.filters.industry)} onChange={(v) => q.setFilter('industry', v)} options={INDUSTRY_OPTIONS} width={160} />
            <FilterSelect label="Size" value={strFilter(q.filters.size)} onChange={(v) => q.setFilter('size', v)} options={COMPANY_SIZE_OPTIONS} width={150} />
            <FilterSelect label="Owner" value={strFilter(q.filters.ownerId)} onChange={(v) => q.setFilter('ownerId', v)} options={opts.owners} width={160} />
          </>
        }
        actions={<Button variant="primary" icon={<Plus size={15} />} onClick={() => setCreating(true)}>New company</Button>}
      />
      <CompanyDrawer company={selected} onClose={() => setSelected(null)} onChanged={(next) => { setSelected(next); q.refetch(); }} />
      <NewCompanyModal open={creating} onClose={() => setCreating(false)} onCreated={() => q.refetch()} />
    </>
  );
}

function strFilter(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function CompanyDrawer({ company, onClose, onChanged }: { company: Company | null; onClose: () => void; onChanged: (next: Company | null) => void }) {
  const svc = useServices();
  const opts = useRefOptions();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!company) return null;

  const patch = async (p: Partial<Company>) => { setBusy(true); try { onChanged(await svc.companies.update(company.id, p)); } finally { setBusy(false); } };
  const remove = async () => { await svc.companies.remove(company.id); onChanged(null); onClose(); };

  return (
    <>
      <Drawer
        open={Boolean(company)}
        onClose={onClose}
        title={company.name}
        subtitle={company.domain}
        footer={<><Button variant="danger" icon={<Trash2 size={15} />} onClick={() => setConfirmDelete(true)}>Delete</Button><Button variant="secondary" onClick={onClose}>Close</Button></>}
      >
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3.5 rounded-[12px]" style={{ background: tokens.surfaceAlt, border: `1px solid ${tokens.border}` }}>
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.06em]" style={{ color: tokens.ink3 }}><Users2 size={13} /> Contacts</div>
            <div className="text-[26px] leading-none mt-1.5" style={{ color: tokens.ink, fontFamily: fonts.display }}>{company.contactCount}</div>
          </div>
          <div className="p-3.5 rounded-[12px]" style={{ background: tokens.surfaceAlt, border: `1px solid ${tokens.border}` }}>
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.06em]" style={{ color: tokens.ink3 }}>Open value</div>
            <div className="text-[26px] leading-none mt-1.5" style={{ color: tokens.ink, fontFamily: fonts.display }}>{formatCurrency(company.openDealValue)}</div>
          </div>
        </div>

        <DrawerSection title="Details">
          <DetailGrid>
            <DetailRow label="Website"><a href={company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5" style={{ color: tokens.coral }}><Globe size={13} />{company.domain}</a></DetailRow>
            <DetailRow label="Industry">{company.industry}</DetailRow>
            <DetailRow label="Size">{company.size} people</DetailRow>
            <DetailRow label="Location">{company.city}, {company.country}</DetailRow>
            <DetailRow label="Revenue">{company.annualRevenue ? formatCurrency(company.annualRevenue) : <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
            <DetailRow label="Owner"><OwnerCell id={company.ownerId} /></DetailRow>
            <DetailRow label="Tags"><TagChips ids={company.tagIds} /></DetailRow>
            <DetailRow label="Created">{formatDate(company.createdAt)}</DetailRow>
          </DetailGrid>
        </DrawerSection>

        <DrawerSection title="Update">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Industry">
              <Select value={company.industry} disabled={busy} onChange={(e) => patch({ industry: e.target.value as Industry })}>
                {INDUSTRY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
            <Field label="Owner">
              <Select value={company.ownerId} disabled={busy} onChange={(e) => patch({ ownerId: e.target.value })}>
                {opts.owners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </Select>
            </Field>
          </div>
        </DrawerSection>

        <DrawerSection title="Linked activity">
          <RelatedActivity entityId={company.id} />
        </DrawerSection>
      </Drawer>

      <ConfirmDialog open={confirmDelete} onClose={() => setConfirmDelete(false)} onConfirm={() => void remove()} title="Delete company" message={<>Delete <b>{company.name}</b> from the mock store?</>} confirmLabel="Delete company" danger />
    </>
  );
}

function NewCompanyModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const svc = useServices();
  const opts = useRefOptions();
  const [form, setForm] = useState({ name: '', domain: '', industry: 'Veterinary' as Industry, size: '11-50' as CompanySize, city: '', country: 'CH', ownerId: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!form.name.trim()) { setError('A company name is required.'); return; }
    setBusy(true); setError(null);
    try {
      const domain = form.domain.trim() || `${form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '')}.ch`;
      await svc.companies.create({
        name: form.name.trim(), domain, website: `https://${domain}`,
        industry: form.industry, size: form.size, city: form.city.trim() || 'Zürich',
        country: form.country || 'CH', ownerId: form.ownerId || undefined,
      });
      onCreated(); onClose();
      setForm({ name: '', domain: '', industry: 'Veterinary', size: '11-50', city: '', country: 'CH', ownerId: '' });
    } catch { setError('Could not create the company.'); } finally { setBusy(false); }
  };

  return (
    <Modal
      open={open} onClose={onClose} title="New company" subtitle="Add an organisation"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant="primary" disabled={busy} onClick={() => void submit()}>{busy ? 'Creating' : 'Create company'}</Button></>}
    >
      {error && <p className="mb-3 text-[12.5px]" style={{ color: '#B23B30' }}>{error}</p>}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" required className="col-span-2"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Company name" /></Field>
        <Field label="Domain" className="col-span-2"><Input value={form.domain} onChange={(e) => setForm({ ...form, domain: e.target.value })} placeholder="example.ch" /></Field>
        <Field label="Industry">
          <Select value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value as Industry })}>
            {INDUSTRY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="Size">
          <Select value={form.size} onChange={(e) => setForm({ ...form, size: e.target.value as CompanySize })}>
            {COMPANY_SIZE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
        <Field label="City"><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Zürich" /></Field>
        <Field label="Country"><Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} placeholder="CH" /></Field>
        <Field label="Owner" className="col-span-2">
          <Select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })}>
            <option value="">Auto</option>
            {opts.owners.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        </Field>
      </div>
    </Modal>
  );
}
