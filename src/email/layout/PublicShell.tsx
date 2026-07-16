import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { paths } from '../routes'
import { C, HAIRLINE, SHADOW } from '../ui/tokens'
import { ScenarioSwitcher } from '../ui'

/** Brand wordmark (Nunito, per the app's identity). */
function Wordmark() {
  return (
    <div
      className="text-[20px] font-extrabold tracking-[-0.03em] lowercase"
      style={{ color: C.ink, fontFamily: 'Nunito, Inter, sans-serif' }}
    >
      fylos
    </div>
  )
}

/**
 * Editorial single column for the recipient-facing states (reached from a link
 * in an email). Warm cream canvas with a soft top glow, one paper card, and a
 * quiet hairline footer. Left aligned, like a short letter from the neighborhood.
 */
export function PublicShell({
  children,
  footerNote,
}: {
  children: ReactNode
  footerNote?: ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center" style={{ background: C.cream }}>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: 360,
          background:
            'radial-gradient(120% 100% at 50% -12%, rgba(255,223,201,0.55), rgba(247,245,242,0) 68%)',
        }}
      />

      <header className="relative w-full max-w-[540px] px-7 pt-12 pb-6 flex items-center justify-between">
        <Link to={paths.home} aria-label="Fylos home">
          <Wordmark />
        </Link>
        <span
          className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]"
          style={{ color: C.sectionLabel }}
        >
          <span className="w-1 h-1 rounded-full" style={{ background: C.coral }} />
          Newsletter
        </span>
      </header>

      <main className="relative w-full max-w-[540px] px-7 pb-16 flex-1">{children}</main>

      <footer className="relative w-full max-w-[540px] px-7 pb-24 text-center">
        <div className="mx-auto mb-5 h-px w-9" style={{ background: HAIRLINE }} />
        <p className="text-[12px] leading-[1.7]" style={{ color: C.ink3 }}>
          {footerNote ?? (
            <>
              You are receiving Fylos emails because you signed up. You can update your preferences
              or unsubscribe at any time.
            </>
          )}
        </p>
      </footer>

      <ScenarioSwitcher />
    </div>
  )
}

/** The paper content card for public pages (warm off white, hairline, soft lift). */
export function PublicCard({ children }: { children: ReactNode }) {
  return (
    <div
      className="p-8 sm:p-9"
      style={{
        background: '#FFFEFC',
        borderRadius: 28,
        border: `1px solid ${HAIRLINE}`,
        boxShadow: SHADOW.card,
      }}
    >
      {children}
    </div>
  )
}

/** Shared centered spinner for the public pages while a link resolves. */
export function PublicLoading({ message = 'One moment' }: { message?: string }) {
  return (
    <div className="py-14 flex flex-col items-center gap-3" aria-busy="true">
      <Loader2 size={20} className="animate-spin" style={{ color: C.coral }} />
      <span className="text-[12.5px] tracking-[0.02em]" style={{ color: C.ink3 }}>
        {message}
      </span>
    </div>
  )
}
