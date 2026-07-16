import { useState } from 'react';
import { CheckCircle2, Ban, UserPlus } from 'lucide-react';
import { tokens } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useResourceQuery } from '../../hooks';
import { PageHeader } from '../../components/layout';
import { ResourceListView, FilterSelect } from '../../components/data';
import type { Column } from '../../components/data';
import { Button, Badge, Drawer } from '../../components/ui';
import { SubmissionStatusBadge } from '../../components/domain/display';
import { DrawerSection, DetailGrid, DetailRow } from '../shared/DetailKit';
import { FORM_NAME_OPTIONS, SUBMISSION_STATUS_OPTIONS } from '../shared/options';
import { formatDateTime, formatRelative } from '../../utils/format';
import type { FormSubmission, SubmissionStatus } from '../../types';

export function SubmissionsPage() {
  const svc = useServices();
  const q = useResourceQuery<FormSubmission>(svc.submissions, { pageSize: 20 });
  const [selected, setSelected] = useState<FormSubmission | null>(null);

  const columns: Array<Column<FormSubmission>> = [
    {
      key: 'name', header: 'From', sortable: true, render: (s) => (
        <div className="min-w-0">
          <div className="font-semibold truncate" style={{ color: tokens.ink }}>{s.fields.name ?? 'Unknown'}</div>
          <div className="text-[12px] truncate" style={{ color: tokens.ink3 }}>{s.fields.email ?? 'No email'}</div>
        </div>
      ),
    },
    { key: 'formName', header: 'Form', sortable: true, render: (s) => <Badge tone="neutral">{s.formName}</Badge> },
    { key: 'status', header: 'Status', sortable: true, render: (s) => <SubmissionStatusBadge status={s.status} /> },
    { key: 'source', header: 'Source', sortable: true, hideBelow: 'lg', render: (s) => <span style={{ color: tokens.ink2 }}>{s.utm.source ?? 'Direct'}</span> },
    { key: 'ipCountry', header: 'Country', sortable: true, hideBelow: 'lg', render: (s) => <span style={{ color: tokens.ink2 }}>{s.ipCountry}</span> },
    { key: 'submittedAt', header: 'Submitted', sortable: true, align: 'right', hideBelow: 'md', render: (s) => <span style={{ color: tokens.ink3 }}>{formatRelative(s.submittedAt)}</span> },
  ];

  return (
    <>
      <PageHeader title="Form submissions" subtitle={q.state.status === 'success' ? `${q.total.toLocaleString('de-CH')} submissions from the marketing site` : 'Inbound from apply, join and contact forms'} />
      <ResourceListView
        query={q}
        columns={columns}
        rowKey={(s) => s.id}
        resourceKey="submissions"
        searchPlaceholder="Search by name, email, message"
        onRowClick={setSelected}
        emptyTitle="No submissions yet"
        emptyMessage="Submissions from the marketing site forms will collect here."
        filters={
          <>
            <FilterSelect label="Form" value={strFilter(q.filters.formName)} onChange={(v) => q.setFilter('formName', v)} options={FORM_NAME_OPTIONS} width={180} />
            <FilterSelect label="Status" value={strFilter(q.filters.status)} onChange={(v) => q.setFilter('status', v)} options={SUBMISSION_STATUS_OPTIONS} width={150} />
          </>
        }
      />
      <SubmissionDrawer
        submission={selected}
        onClose={() => setSelected(null)}
        onChanged={(next) => { setSelected(next); q.refetch(); }}
      />
    </>
  );
}

function strFilter(v: unknown): string {
  return typeof v === 'string' ? v : '';
}

function SubmissionDrawer({ submission, onClose, onChanged }: { submission: FormSubmission | null; onClose: () => void; onChanged: (next: FormSubmission | null) => void }) {
  const svc = useServices();
  const [busy, setBusy] = useState(false);
  if (!submission) return null;

  const setStatus = async (status: SubmissionStatus) => {
    setBusy(true);
    try { onChanged(await svc.submissions.update(submission.id, { status })); } finally { setBusy(false); }
  };

  const convertToLead = async () => {
    setBusy(true);
    try {
      const lead = await svc.leads.create({
        name: submission.fields.name ?? 'Unknown',
        email: submission.fields.email ?? '',
        companyName: submission.fields.company,
        status: 'new',
        attribution: { utm: submission.utm, referrer: submission.referrer, capturedAt: submission.submittedAt },
      });
      onChanged(await svc.submissions.update(submission.id, { status: 'converted', linkedLeadId: lead.id }));
    } finally { setBusy(false); }
  };

  const f = submission.fields;
  const utm = submission.utm;

  return (
    <Drawer
      open={Boolean(submission)}
      onClose={onClose}
      title={f.name ?? 'Submission'}
      subtitle={submission.formName}
      footer={
        <>
          {submission.status !== 'converted' && (
            <Button variant="secondary" icon={<UserPlus size={15} />} disabled={busy} onClick={() => void convertToLead()}>Convert to lead</Button>
          )}
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </>
      }
    >
      <div className="flex items-center gap-2 mb-5">
        <SubmissionStatusBadge status={submission.status} />
        <span className="text-[12.5px]" style={{ color: tokens.ink3 }}>{formatDateTime(submission.submittedAt)}</span>
      </div>

      <DrawerSection title="Submitted fields">
        <DetailGrid>
          <DetailRow label="Name">{f.name ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
          <DetailRow label="Email">{f.email ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
          <DetailRow label="Phone">{f.phone ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
          <DetailRow label="Company">{f.company ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
          <DetailRow label="Role">{f.role ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
          <DetailRow label="City">{f.city ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
          {f.message && <DetailRow label="Message"><span className="leading-snug">{f.message}</span></DetailRow>}
        </DetailGrid>
      </DrawerSection>

      <DrawerSection title="Attribution">
        <DetailGrid>
          <DetailRow label="Source">{utm.source ?? <span style={{ color: tokens.ink3 }}>Direct</span>}</DetailRow>
          <DetailRow label="Medium">{utm.medium ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
          <DetailRow label="Campaign">{utm.campaign ?? <span style={{ color: tokens.ink3 }}>Not set</span>}</DetailRow>
          <DetailRow label="Page">{submission.pageUrl}</DetailRow>
          <DetailRow label="Referrer">{submission.referrer ?? <span style={{ color: tokens.ink3 }}>Direct</span>}</DetailRow>
          <DetailRow label="Country">{submission.ipCountry}</DetailRow>
        </DetailGrid>
      </DrawerSection>

      <DrawerSection title="Triage">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" icon={<CheckCircle2 size={15} />} disabled={busy || submission.status === 'reviewed'} onClick={() => void setStatus('reviewed')}>Mark reviewed</Button>
          <Button variant="danger" icon={<Ban size={15} />} disabled={busy || submission.status === 'spam'} onClick={() => void setStatus('spam')}>Mark spam</Button>
        </div>
      </DrawerSection>
    </Drawer>
  );
}
