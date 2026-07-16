// The required async/permission states, as reusable views:
// loading, empty, filtered-empty, error, access-denied, session-expired.

import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, Lock, Clock, SearchX, RefreshCw } from 'lucide-react';
import { tokens, radii, toneStyles } from '../../theme';
import { ROLE_LABEL } from '../../types';
import type { AdminError, AdminRole, AsyncState } from '../../types';
import { Button } from '../ui/primitives';

// ── Skeleton (loading) ──────────────────────────────────────────────────────

export function TableSkeleton({ rows = 8, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div aria-busy="true" aria-label="Loading">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-4 border-b" style={{ borderColor: tokens.divider, height: 52 }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className="h-3 rounded animate-pulse"
              style={{
                background: '#ECE6DE',
                flex: c === 0 ? '2' : '1',
                animationDelay: `${(r * cols + c) * 40}ms`,
                maxWidth: c === 0 ? 220 : 120,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function BlockSkeleton({ height = 120 }: { height?: number }) {
  return <div className="rounded-[14px] animate-pulse" style={{ height, background: '#ECE6DE' }} />;
}

// ── Centered message frame ──────────────────────────────────────────────────

function CenterFrame({ icon, iconTone = 'neutral', title, message, action }: {
  icon: ReactNode; iconTone?: keyof typeof toneStyles; title: string; message: ReactNode; action?: ReactNode;
}) {
  const t = toneStyles[iconTone];
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-16">
      <div className="flex items-center justify-center rounded-full mb-4" style={{ width: 56, height: 56, background: t.bg, color: t.fg }}>
        {icon}
      </div>
      <h3 className="text-[16px] font-bold mb-1.5" style={{ color: tokens.ink }}>{title}</h3>
      <p className="text-[13.5px] leading-relaxed max-w-[380px]" style={{ color: tokens.ink2 }}>{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function EmptyState({ title, message, action, icon }: {
  title: string; message: ReactNode; action?: ReactNode; icon?: ReactNode;
}) {
  return <CenterFrame icon={icon ?? <Inbox size={26} strokeWidth={1.8} />} title={title} message={message} action={action} />;
}

export function FilteredEmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <CenterFrame
      icon={<SearchX size={26} strokeWidth={1.8} />}
      title="Nothing matches"
      message="No records match your search and filters. Try loosening them."
      action={onClear && <Button variant="secondary" onClick={onClear}>Clear filters</Button>}
    />
  );
}

export function ErrorState({ error, onRetry }: { error?: AdminError | null; onRetry?: () => void }) {
  return (
    <CenterFrame
      icon={<AlertTriangle size={26} strokeWidth={1.8} />}
      iconTone="red"
      title="Something went wrong"
      message={error?.message ?? 'The request failed. Please try again.'}
      action={onRetry && <Button variant="primary" icon={<RefreshCw size={15} />} onClick={onRetry}>Try again</Button>}
    />
  );
}

export function AccessDenied({ required, current, note }: {
  required?: AdminRole; current?: AdminRole | null; note?: ReactNode;
}) {
  return (
    <CenterFrame
      icon={<Lock size={24} strokeWidth={1.8} />}
      iconTone="amber"
      title="Access denied"
      message={
        note ?? (
          <>
            This area needs the {required ? ROLE_LABEL[required] : 'a higher'} role.
            {current && <> You are signed in as {ROLE_LABEL[current]}.</>}
          </>
        )
      }
    />
  );
}

export function SessionExpired({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-6" style={{ background: tokens.appBg }}>
      <div
        className="w-full max-w-[420px] text-center px-8 py-10"
        style={{ background: tokens.surface, border: `1px solid ${tokens.border}`, borderRadius: radii.xl }}
      >
        <div className="flex items-center justify-center rounded-full mx-auto mb-4" style={{ width: 56, height: 56, background: toneStyles.amber.bg, color: toneStyles.amber.fg }}>
          <Clock size={26} strokeWidth={1.8} />
        </div>
        <h2 className="text-[18px] font-bold mb-2" style={{ color: tokens.ink }}>Your session expired</h2>
        <p className="text-[13.5px] leading-relaxed mb-6" style={{ color: tokens.ink2 }}>
          For your security you have been signed out after a period of inactivity. Sign in again to continue.
        </p>
        <Button variant="primary" block onClick={onSignIn}>Sign in again</Button>
      </div>
    </div>
  );
}

// ── State boundary (for non-table content: detail, dashboard) ───────────────

export function StateBoundary<T>({ state, onRetry, loading, children }: {
  state: AsyncState<T>;
  onRetry?: () => void;
  loading?: ReactNode;
  children: (data: T) => ReactNode;
}) {
  if (state.status === 'loading' || state.status === 'idle') {
    return <>{loading ?? <BlockSkeleton height={160} />}</>;
  }
  if (state.status === 'error') return <ErrorState error={state.error} onRetry={onRetry} />;
  return <>{children(state.data)}</>;
}
