import type { ComponentType, ReactNode } from 'react'
import type { LucideProps } from 'lucide-react'
import type { Tone } from '../core/catalog'
import { C, RADIUS, TONES } from './tokens'

/** Inline tone banner. Used for update success/failure and other notices. */
export function Notice({
  tone = 'green',
  title,
  icon: Icon,
  children,
}: {
  tone?: Tone
  title: ReactNode
  icon?: ComponentType<LucideProps>
  children?: ReactNode
}) {
  const t = TONES[tone]
  return (
    <div
      className="flex gap-3 p-4 border"
      style={{ background: t.bg, borderColor: t.bd, borderRadius: RADIUS.input }}
      role="status"
    >
      {Icon && (
        <span className="shrink-0 mt-0.5">
          <Icon size={18} strokeWidth={2.2} style={{ color: t.fg }} />
        </span>
      )}
      <div>
        <div className="text-[13.5px] font-semibold" style={{ color: t.fg }}>
          {title}
        </div>
        {children && (
          <div className="mt-1 text-[13px] leading-[1.5]" style={{ color: C.ink2 }}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
