// Building blocks for record detail drawers: a label/value grid, section
// headings, and a "related activity" panel that pulls notes, tasks and
// follow-ups linked to a record through the services.

import type { ReactNode } from 'react';
import { StickyNote, CheckSquare, CalendarClock } from 'lucide-react';
import { tokens } from '../../theme';
import { useServices } from '../../context/ServicesContext';
import { useAsync } from '../../hooks';
import { formatRelative, formatDate } from '../../utils/format';
import { OwnerCell, TaskStatusBadge, FollowUpStatusBadge } from '../../components/domain/display';
import { Spinner } from '../../components/ui';
import type { ID } from '../../types';

export function DrawerSection({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-[11.5px] font-bold uppercase tracking-[0.05em]" style={{ color: tokens.ink3 }}>{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

export function DetailGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-[130px_1fr] gap-y-2.5 gap-x-3 items-start">{children}</div>;
}

export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <>
      <div className="text-[12.5px] pt-0.5" style={{ color: tokens.ink3 }}>{label}</div>
      <div className="text-[13px] min-w-0" style={{ color: tokens.ink }}>{children}</div>
    </>
  );
}

export function RelatedActivity({ entityId }: { entityId: ID }) {
  const svc = useServices();
  const notes = useAsync(() => svc.notes.list({ filters: { relatedId: entityId }, page: 1, pageSize: 4, sort: { field: 'createdAt', dir: 'desc' } }), [svc, entityId]);
  const tasks = useAsync(() => svc.tasks.list({ filters: { relatedId: entityId }, page: 1, pageSize: 4, sort: { field: 'dueAt', dir: 'asc' } }), [svc, entityId]);
  const followUps = useAsync(() => svc.followUps.list({ filters: { relatedId: entityId }, page: 1, pageSize: 4, sort: { field: 'dueAt', dir: 'asc' } }), [svc, entityId]);

  const loading = notes.state.status === 'loading' || tasks.state.status === 'loading' || followUps.state.status === 'loading';
  if (loading) return <div className="py-3"><Spinner /></div>;

  const noteItems = notes.state.status === 'success' ? notes.state.data.items : [];
  const taskItems = tasks.state.status === 'success' ? tasks.state.data.items : [];
  const followItems = followUps.state.status === 'success' ? followUps.state.data.items : [];

  if (noteItems.length + taskItems.length + followItems.length === 0) {
    return <p className="text-[12.5px]" style={{ color: tokens.ink3 }}>No linked notes, tasks or follow ups yet.</p>;
  }

  return (
    <div className="space-y-3">
      {taskItems.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-[11.5px] font-semibold mb-1.5" style={{ color: tokens.ink3 }}>
            <CheckSquare size={13} /> Tasks
          </div>
          {taskItems.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-2 py-1.5 border-b last:border-0" style={{ borderColor: tokens.divider }}>
              <span className="text-[13px] truncate" style={{ color: tokens.ink }}>{t.title}</span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="text-[12px]" style={{ color: tokens.ink3 }}>{formatDate(t.dueAt)}</span>
                <TaskStatusBadge status={t.status} />
              </span>
            </div>
          ))}
        </div>
      )}
      {followItems.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-[11.5px] font-semibold mb-1.5" style={{ color: tokens.ink3 }}>
            <CalendarClock size={13} /> Follow ups
          </div>
          {followItems.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-2 py-1.5 border-b last:border-0" style={{ borderColor: tokens.divider }}>
              <span className="text-[13px] capitalize" style={{ color: tokens.ink }}>{f.channel}</span>
              <span className="flex items-center gap-2 shrink-0">
                <span className="text-[12px]" style={{ color: tokens.ink3 }}>{formatDate(f.dueAt)}</span>
                <FollowUpStatusBadge status={f.status} />
              </span>
            </div>
          ))}
        </div>
      )}
      {noteItems.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 text-[11.5px] font-semibold mb-1.5" style={{ color: tokens.ink3 }}>
            <StickyNote size={13} /> Notes
          </div>
          {noteItems.map((n) => (
            <div key={n.id} className="py-1.5 border-b last:border-0" style={{ borderColor: tokens.divider }}>
              <p className="text-[13px] leading-snug" style={{ color: tokens.ink }}>{n.body}</p>
              <div className="flex items-center gap-2 mt-1">
                <OwnerCell id={n.authorId} muted />
                <span className="text-[11.5px]" style={{ color: tokens.ink3 }}>{formatRelative(n.createdAt)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
