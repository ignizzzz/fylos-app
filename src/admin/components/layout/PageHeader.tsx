import type { ReactNode } from 'react';
import { tokens, fonts } from '../../theme';

export function PageHeader({ title, subtitle, actions }: {
  title: ReactNode; subtitle?: ReactNode; actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
      <div className="min-w-0">
        <h1
          className="text-[30px] leading-[1.05] truncate"
          style={{ color: tokens.ink, fontFamily: fonts.display, letterSpacing: '-0.005em' }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-[13.5px] mt-1.5" style={{ color: tokens.ink2 }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0 pb-0.5">{actions}</div>}
    </div>
  );
}
