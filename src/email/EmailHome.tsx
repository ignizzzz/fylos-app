import type { ComponentType } from 'react'
import { Link } from 'react-router-dom'
import {
  BadgeCheck,
  ChevronRight,
  Clock,
  LayoutList,
  Mail,
  ShieldOff,
  SlidersHorizontal,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { paths } from './routes'
import { C, HAIRLINE, RADIUS, SHADOW } from './ui/tokens'
import { ScenarioSwitcher, SectionLabel } from './ui'

interface Item {
  to: string
  title: string
  desc: string
  icon: ComponentType<LucideProps>
}

const PUBLIC_ITEMS: Item[] = [
  { to: paths.confirm(), title: 'Subscription confirmation', desc: 'Double opt-in confirm and the all-set state.', icon: BadgeCheck },
  { to: paths.preferences(), title: 'Email preferences', desc: 'Choose topics and frequency, save changes.', icon: SlidersHorizontal },
  { to: paths.unsubscribe(), title: 'Unsubscribe', desc: 'Opt out, with a lighter alternative offered.', icon: UserMinus },
  { to: paths.resubscribe(), title: 'Resubscribe', desc: 'Come back after opting out.', icon: UserPlus },
  { to: paths.expired(), title: 'Invalid or expired link', desc: 'What a stale or broken link shows.', icon: Clock },
]

const ADMIN_ITEMS: Item[] = [
  { to: paths.campaigns, title: 'Campaigns', desc: 'Draft, scheduled, sent, and failed sends.', icon: LayoutList },
  { to: paths.subscribers, title: 'Subscribers', desc: 'The paged list, searchable by status.', icon: Users },
  { to: paths.suppression, title: 'Suppression', desc: 'Bounces, complaints, and blocks.', icon: ShieldOff },
]

function ItemCard({ item }: { item: Item }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      className="flex items-center gap-4 p-4 active:scale-[0.99] transition-transform"
      style={{ background: C.surface, borderRadius: RADIUS.grouped, border: `1px solid ${HAIRLINE}`, boxShadow: SHADOW.card }}
    >
      <span
        className="w-[42px] h-[42px] rounded-full flex items-center justify-center shrink-0"
        style={{ background: C.peachSelected }}
      >
        <Icon size={19} strokeWidth={2.2} style={{ color: C.coral }} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[14.5px] font-semibold truncate" style={{ color: C.ink }}>
          {item.title}
        </div>
        <div className="text-[12.5px] truncate" style={{ color: C.ink2 }}>
          {item.desc}
        </div>
      </div>
      <ChevronRight size={18} strokeWidth={2} style={{ color: C.chevron }} className="shrink-0" />
    </Link>
  )
}

export default function EmailHome() {
  return (
    <div className="min-h-screen w-full" style={{ background: C.cream }}>
      <div className="mx-auto max-w-[760px] px-6 pt-12 pb-28">
        <div className="flex items-center gap-2.5 mb-1">
          <span
            className="w-[30px] h-[30px] rounded-[9px] flex items-center justify-center"
            style={{ background: C.coral }}
          >
            <Mail size={16} strokeWidth={2.4} style={{ color: '#FFFFFF' }} />
          </span>
          <span
            className="text-[20px] font-extrabold tracking-[-0.02em]"
            style={{ color: C.ink, fontFamily: 'Nunito, Inter, sans-serif' }}
          >
            fylos
          </span>
        </div>
        <h1 className="email-display text-[36px] sm:text-[42px] leading-[1.02] mt-5" style={{ color: C.ink, fontWeight: 500 }}>
          Email and newsletter
        </h1>
        <p className="text-[14px] leading-[1.65] mt-4 max-w-[500px]" style={{ color: C.ink2 }}>
          A front-end only surface. No provider is connected and no email is ever sent. Use the
          Preview state control at the bottom to see every screen in its loading, empty, error, and
          failed states.
        </p>

        <div className="mt-9 mb-3">
          <SectionLabel>Public pages</SectionLabel>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {PUBLIC_ITEMS.map((item) => (
            <ItemCard key={item.to} item={item} />
          ))}
        </div>

        <div className="mt-9 mb-3">
          <SectionLabel>Admin console</SectionLabel>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {ADMIN_ITEMS.map((item) => (
            <ItemCard key={item.to} item={item} />
          ))}
        </div>
      </div>
      <ScenarioSwitcher />
    </div>
  )
}
