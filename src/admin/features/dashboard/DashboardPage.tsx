import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { tokens, radii, shadows, toneStyles, fonts, trackColor } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useAuth } from '../../context/AuthContext';
import { useAsync } from '../../hooks';
import { PageHeader } from '../../components/layout';
import { DemoStateMenu } from '../../components/data';
import { Card } from '../../components/ui';
import { StateBoundary, BlockSkeleton } from '../../components/states';
import { LeadStatusBadge } from '../../components/domain/display';
import { formatCompactCurrency, formatNumber, formatPercent, formatDate, formatRelative } from '../../utils/format';
import { LEAD_STATUS_LABEL } from '../../types';
import type { DashboardSummary, MetricDelta } from '../../services/analytics-types';
import type { LeadStatus } from '../../types';

export function DashboardPage() {
  const svc = useServices();
  const { session } = useAuth();
  const { state, refetch } = useAsync<DashboardSummary>(() => svc.analytics.dashboard(), [svc]);
  const firstName = session?.user.name.split(' ')[0] ?? 'there';

  return (
    <>
      <PageHeader title={`Welcome back, ${firstName}`} subtitle="Your growth pipeline at a glance" actions={<DemoStateMenu resourceKey="dashboard" />} />

      <StateBoundary
        state={state}
        onRetry={refetch}
        loading={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
            {Array.from({ length: 6 }).map((_, i) => <BlockSkeleton key={i} height={92} />)}
          </div>
        }
      >
        {(data) => (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
              <Kpi i={0} label="New leads (30d)" delta={data.kpis.newLeads} format={formatNumber} />
              <Kpi i={1} label="Open deals" delta={data.kpis.openDeals} format={formatNumber} />
              <Kpi i={2} label="Pipeline value" delta={data.kpis.pipelineValue} format={(n) => formatCompactCurrency(n)} />
              <Kpi i={3} label="Won this month" delta={data.kpis.wonThisMonth} format={(n) => formatCompactCurrency(n)} />
              <Kpi i={4} label="Tasks due (7d)" delta={data.kpis.tasksDue} format={formatNumber} />
              <Kpi i={5} label="New submissions (30d)" delta={data.kpis.newSubmissions} format={formatNumber} />
            </div>

            <div className="grid gap-4 lg:grid-cols-3 mb-4">
              <Panel title="New leads, weekly" to="/admin/leads" className="lg:col-span-2">
                <TrendBars data={data.newLeadsTrend} />
              </Panel>
              <Panel title="Leads by status" to="/admin/leads">
                <div className="space-y-2.5">
                  {data.leadsByStatus.map((row) => (
                    <StatusRow key={row.status} status={row.status} count={row.count} max={Math.max(1, ...data.leadsByStatus.map((r) => r.count))} />
                  ))}
                </div>
              </Panel>
            </div>

            <div className="grid gap-4 lg:grid-cols-3 mb-4">
              <Panel title="Pipeline by stage" to="/admin/pipeline">
                <div className="space-y-2.5">
                  {data.pipelineByStage.map((row) => (
                    <BarRow key={row.stageId} label={row.label} value={row.value} count={row.count} max={Math.max(1, ...data.pipelineByStage.map((r) => r.value))} />
                  ))}
                </div>
              </Panel>
              <Panel title="Top sources" to="/admin/sources">
                <div className="space-y-2.5">
                  {data.topSources.map((s) => (
                    <BarRow key={s.sourceId} label={s.name} value={s.value} count={s.leads} max={Math.max(1, ...data.topSources.map((r) => r.value))} unit="leads" />
                  ))}
                </div>
              </Panel>
              <Panel title="Upcoming follow ups" to="/admin/follow-ups">
                <ul className="space-y-2">
                  {data.upcomingFollowUps.length === 0 && <li className="text-[12.5px]" style={{ color: tokens.ink3 }}>Nothing scheduled.</li>}
                  {data.upcomingFollowUps.map((f) => (
                    <li key={f.id} className="flex items-center justify-between gap-2">
                      <span className="text-[13px] truncate" style={{ color: tokens.ink }}>{f.label}</span>
                      <span className="text-[12px] shrink-0 capitalize" style={{ color: tokens.ink3 }}>{f.channel} · {formatDate(f.dueAt)}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            </div>

            <Panel title="Recent submissions" to="/admin/submissions">
              <ul className="divide-y" style={{ borderColor: tokens.divider }}>
                {data.recentSubmissions.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-2 py-2 first:pt-0 last:pb-0">
                    <span className="min-w-0">
                      <span className="text-[13px] font-medium truncate block" style={{ color: tokens.ink }}>{s.name}</span>
                      <span className="text-[12px]" style={{ color: tokens.ink3 }}>{s.formName}</span>
                    </span>
                    <span className="text-[12px] shrink-0" style={{ color: tokens.ink3 }}>{formatRelative(s.submittedAt)}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          </>
        )}
      </StateBoundary>
    </>
  );
}

function Kpi({ label, delta, format, i }: { label: string; delta: MetricDelta; format: (n: number) => string; i: number }) {
  const up = delta.changePct !== null && delta.changePct >= 0;
  return (
    <div style={{ animation: 'fylosFadeUp 0.5s ease both', animationDelay: `${i * 55}ms` }}>
      <Card>
        <div className="text-[10.5px] font-bold uppercase tracking-[0.07em]" style={{ color: tokens.ink3 }}>{label}</div>
        <div className="text-[32px] leading-[1.05] mt-1.5" style={{ color: tokens.ink, fontFamily: fonts.display }}>{format(delta.value)}</div>
        {delta.changePct !== null ? (
          <div className="flex items-center gap-1 mt-1.5 text-[12px] font-semibold" style={{ color: up ? toneStyles.green.fg : toneStyles.red.fg }}>
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {formatPercent(delta.changePct)} <span style={{ color: tokens.ink3 }} className="font-normal">vs prior</span>
          </div>
        ) : (
          <div className="mt-1.5 text-[12px]" style={{ color: tokens.ink3 }}>current</div>
        )}
      </Card>
    </div>
  );
}

function Panel({ title, to, children, className = '' }: { title: string; to?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className} style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: radii.lg, boxShadow: shadows.card }}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: tokens.border }}>
        <h3 className="text-[13px] font-bold" style={{ color: tokens.ink }}>{title}</h3>
        {to && <Link to={to} className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: tokens.coral }}>View<ArrowRight size={13} /></Link>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function TrendBars({ data }: { data: Array<{ label: string; count: number }> }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  return (
    <div className="flex items-end gap-2" style={{ height: 140 }}>
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="text-[11px] tabular-nums" style={{ color: tokens.ink3 }}>{d.count}</div>
          <div className="w-full rounded-t-[6px]" style={{ height: `${(d.count / max) * 100}%`, minHeight: 4, background: tokens.coral, opacity: 0.9 }} />
          <div className="text-[11px]" style={{ color: tokens.ink3 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function StatusRow({ status, count, max }: { status: LeadStatus; count: number; max: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[92px] shrink-0"><LeadStatusBadge status={status} /></div>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: trackColor }}>
        <div className="h-full rounded-full" style={{ width: `${(count / max) * 100}%`, background: tokens.coral }} />
      </div>
      <div className="w-8 text-right text-[12.5px] tabular-nums font-semibold" style={{ color: tokens.ink2 }}>{count}</div>
      <span className="sr-only">{LEAD_STATUS_LABEL[status]}</span>
    </div>
  );
}

function BarRow({ label, value, count, max, unit = 'CHF' }: { label: string; value: number; count: number; max: number; unit?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[12.5px] font-medium truncate" style={{ color: tokens.ink }}>{label}</span>
        <span className="text-[12px] tabular-nums shrink-0" style={{ color: tokens.ink3 }}>
          {unit === 'CHF' ? formatCompactCurrency(value) : `${count} ${unit}`}
        </span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: trackColor }}>
        <div className="h-full rounded-full" style={{ width: `${Math.max(3, (value / max) * 100)}%`, background: tokens.coral }} />
      </div>
    </div>
  );
}
