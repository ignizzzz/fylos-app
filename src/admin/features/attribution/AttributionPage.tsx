import { useMemo, useState } from 'react';
import { tokens, radii, shadows, fonts, trackColor } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useAsync, useResourceQuery } from '../../hooks';
import { PageHeader } from '../../components/layout';
import { ResourceListView, FilterSelect, DateRangeFilter, DemoStateMenu } from '../../components/data';
import type { Column, FilterOption } from '../../components/data';
import { Card } from '../../components/ui';
import { Badge } from '../../components/ui';
import { StateBoundary, BlockSkeleton } from '../../components/states';
import { EntityRefChip } from '../../components/domain/display';
import { ENTITY_KIND_OPTIONS } from '../shared/options';
import { formatCurrency, formatDate, formatNumber } from '../../utils/format';
import type { AttributionGroupRow, AttributionReport } from '../../services/analytics-types';
import type { AttributionTouch } from '../../services/analytics-types';

export function AttributionPage() {
  const svc = useServices();
  const [range, setRange] = useState<{ from?: string | null; to?: string | null }>({});
  const report = useAsync<AttributionReport>(
    () => svc.analytics.attribution({ page: 1, pageSize: 0, filters: { range } }),
    [svc, range.from, range.to],
  );
  const touches = useResourceQuery<AttributionTouch>(svc.touches, { pageSize: 20 });

  const sourceOptions = useMemo<FilterOption[]>(
    () => (report.state.status === 'success' ? report.state.data.bySource.map((r) => ({ value: r.key, label: r.key })) : []),
    [report.state],
  );
  const campaignOptions = useMemo<FilterOption[]>(
    () => (report.state.status === 'success' ? report.state.data.byCampaign.map((r) => ({ value: r.key, label: r.key })) : []),
    [report.state],
  );

  const columns: Array<Column<AttributionTouch>> = [
    { key: 'entity', header: 'Touch', sortable: true, render: (t) => <EntityRefChip entity={t.entity} /> },
    { key: 'source', header: 'Source', sortable: true, render: (t) => <Badge tone="neutral">{t.source}</Badge> },
    { key: 'medium', header: 'Medium', sortable: true, hideBelow: 'md', render: (t) => <span style={{ color: tokens.ink2 }}>{t.medium}</span> },
    { key: 'campaign', header: 'Campaign', sortable: true, hideBelow: 'lg', render: (t) => <span style={{ color: tokens.ink2 }}>{t.campaign}</span> },
    { key: 'value', header: 'Value', sortable: true, align: 'right', render: (t) => <span className="tabular-nums">{t.value ? formatCurrency(t.value) : '-'}</span> },
    { key: 'occurredAt', header: 'When', sortable: true, align: 'right', hideBelow: 'md', render: (t) => <span style={{ color: tokens.ink3 }}>{formatDate(t.occurredAt)}</span> },
  ];

  return (
    <>
      <PageHeader
        title="UTM attribution"
        subtitle="First-touch source, medium and campaign across leads and submissions"
        actions={<><DateRangeFilter value={range} onChange={setRange} /><DemoStateMenu resourceKey="attribution" /></>}
      />

      <StateBoundary state={report.state} onRetry={report.refetch} loading={<div className="grid gap-4 lg:grid-cols-3 mb-6"><BlockSkeleton height={220} /><BlockSkeleton height={220} /><BlockSkeleton height={220} /></div>}>
        {(data) => (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-4">
              <SummaryCard label="Total touches" value={formatNumber(data.totalTouches)} />
              <SummaryCard label="Attributed value" value={formatCurrency(data.totalValue)} />
              <SummaryCard label="Channels" value={formatNumber(data.bySource.length)} />
            </div>
            <div className="grid gap-4 lg:grid-cols-3 mb-6">
              <GroupTable title="By source" rows={data.bySource} total={data.totalTouches} />
              <GroupTable title="By medium" rows={data.byMedium} total={data.totalTouches} />
              <GroupTable title="By campaign" rows={data.byCampaign} total={data.totalTouches} />
            </div>
          </>
        )}
      </StateBoundary>

      <h2 className="text-[15px] font-bold mb-2" style={{ color: tokens.ink }}>All touches</h2>
      <ResourceListView
        query={touches}
        columns={columns}
        rowKey={(t) => t.id}
        resourceKey="touches"
        searchPlaceholder="Search touches"
        emptyTitle="No touches"
        emptyMessage="Attribution touches from leads and submissions show here."
        filters={
          <>
            <FilterSelect label="Source" value={strFilter(touches.filters.source)} onChange={(v) => touches.setFilter('source', v)} options={sourceOptions} width={150} />
            <FilterSelect label="Campaign" value={strFilter(touches.filters.campaign)} onChange={(v) => touches.setFilter('campaign', v)} options={campaignOptions} width={170} />
            <FilterSelect label="Type" value={strFilter(touches.filters.kind)} onChange={(v) => touches.setFilter('kind', v)} options={ENTITY_KIND_OPTIONS.filter((o) => o.value === 'lead' || o.value === 'submission')} width={150} />
          </>
        }
      />
    </>
  );
}

function strFilter(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <div className="text-[10.5px] font-bold uppercase tracking-[0.07em]" style={{ color: tokens.ink3 }}>{label}</div>
      <div className="text-[30px] leading-[1.05] mt-1.5" style={{ color: tokens.ink, fontFamily: fonts.display }}>{value}</div>
    </Card>
  );
}

function GroupTable({ title, rows, total }: { title: string; rows: AttributionGroupRow[]; total: number }) {
  const top = rows.slice(0, 8);
  return (
    <div style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: radii.lg, boxShadow: shadows.card }}>
      <div className="px-4 py-2.5 border-b text-[13px] font-bold" style={{ borderColor: tokens.border, color: tokens.ink }}>{title}</div>
      <div className="p-2">
        {top.length === 0 && <div className="px-2 py-4 text-[12.5px]" style={{ color: tokens.ink3 }}>No data</div>}
        {top.map((r) => {
          const pct = total > 0 ? Math.round((r.touches / total) * 100) : 0;
          return (
            <div key={r.key} className="px-2 py-1.5">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[12.5px] font-medium truncate" style={{ color: tokens.ink }}>{r.key}</span>
                <span className="text-[12px] tabular-nums shrink-0" style={{ color: tokens.ink3 }}>{r.touches} · {pct}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: trackColor }}>
                <div className="h-full rounded-full" style={{ width: `${Math.max(3, pct)}%`, background: tokens.coral }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
