import type { ComponentType, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, Send, ShieldOff, Users } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { BASE, paths } from '../routes'
import { C, HAIRLINE } from '../ui/tokens'
import { ScenarioSwitcher } from '../ui'

interface NavItem {
  label: string
  to: string
  match: string
  icon: ComponentType<LucideProps>
}

const NAV: NavItem[] = [
  { label: 'Campaigns', to: paths.campaigns, match: `${BASE}/admin/campaigns`, icon: Send },
  { label: 'Subscribers', to: paths.subscribers, match: `${BASE}/admin/subscribers`, icon: Users },
  { label: 'Suppression', to: paths.suppression, match: `${BASE}/admin/suppression`, icon: ShieldOff },
]

function useActive() {
  const { pathname } = useLocation()
  return (match: string) => pathname.startsWith(match)
}

function Wordmark() {
  return (
    <span
      className="text-[20px] font-extrabold tracking-[-0.03em] lowercase"
      style={{ color: C.ink, fontFamily: 'Nunito, Inter, sans-serif' }}
    >
      fylos
    </span>
  )
}

function Sidebar() {
  const isActive = useActive()
  return (
    <aside
      className="hidden md:flex flex-col w-[236px] shrink-0 min-h-screen sticky top-0 px-5 py-7"
      style={{ background: C.cream, borderRight: `1px solid ${HAIRLINE}` }}
    >
      <Link to={paths.home} className="px-1 mb-1.5" aria-label="Fylos home">
        <Wordmark />
      </Link>
      <div className="px-1 mb-7 text-[10.5px] font-bold uppercase tracking-[0.16em]" style={{ color: C.sectionLabel }}>
        Email console
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = isActive(item.match)
          const Icon = item.icon
          return (
            <Link
              key={item.to}
              to={item.to}
              className="relative flex items-center gap-3 h-10 pl-4 pr-3 rounded-[10px] text-[14px] font-semibold transition-colors"
              style={{
                background: active ? 'rgba(232,93,42,0.06)' : 'transparent',
                color: active ? C.coral : C.ink2,
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-full"
                  style={{ background: C.coral }}
                />
              )}
              <Icon size={17} strokeWidth={2} />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto px-1 pt-6">
        <Link to={paths.home} className="text-[12px] font-medium" style={{ color: C.ink3 }}>
          Public pages
        </Link>
      </div>
    </aside>
  )
}

function MobileTabs() {
  const isActive = useActive()
  return (
    <nav
      className="md:hidden flex gap-1 px-4 py-2.5 overflow-x-auto"
      style={{ background: C.cream, borderBottom: `1px solid ${HAIRLINE}` }}
    >
      {NAV.map((item) => {
        const active = isActive(item.match)
        return (
          <Link
            key={item.to}
            to={item.to}
            className="h-8 px-3.5 rounded-full text-[13px] font-semibold whitespace-nowrap flex items-center transition-colors"
            style={{
              background: active ? 'rgba(232,93,42,0.08)' : C.chip,
              color: active ? C.coral : C.ink2,
            }}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

/** Console chrome around every admin page. */
export function AdminShell({
  title,
  subtitle,
  actions,
  back,
  children,
}: {
  title: ReactNode
  subtitle?: ReactNode
  actions?: ReactNode
  back?: { to: string; label: string }
  children: ReactNode
}) {
  return (
    <div className="min-h-screen w-full" style={{ background: C.cream }}>
      <div className="mx-auto max-w-[1160px] flex">
        <Sidebar />
        <div className="flex-1 min-w-0">
          <MobileTabs />
          <div className="px-5 md:px-10 pt-9 pb-5">
            {back && (
              <Link
                to={back.to}
                className="inline-flex items-center gap-1 mb-4 text-[12.5px] font-semibold tracking-[0.02em]"
                style={{ color: C.ink3 }}
              >
                <ChevronLeft size={15} strokeWidth={2.4} />
                {back.label}
              </Link>
            )}
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <h1 className="email-display text-[27px] sm:text-[30px] leading-[1.05] truncate" style={{ color: C.ink, fontWeight: 500 }}>
                  {title}
                </h1>
                {subtitle && (
                  <div className="mt-2 text-[13.5px]" style={{ color: C.ink2 }}>
                    {subtitle}
                  </div>
                )}
              </div>
              {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
            </div>
          </div>
          <main className="px-5 md:px-10 pb-28">{children}</main>
        </div>
      </div>
      <ScenarioSwitcher />
    </div>
  )
}
