import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Users } from 'lucide-react'
import type { Subscriber, SubscriberStatus } from '../core/types'
import { formatCount, formatDate } from '../core/format'
import { useSubscribers } from '../hooks/data'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { AdminShell } from '../layout/AdminShell'
import { SubscriberStatusBadge } from '../components/badges'
import { Async, Button, Card, Divider, EmptyState, TextInput, C } from '../ui'

type StatusFilter = SubscriberStatus | 'all'

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'subscribed', label: 'Subscribed' },
  { value: 'pending', label: 'Pending' },
  { value: 'unsubscribed', label: 'Unsubscribed' },
  { value: 'suppressed', label: 'Suppressed' },
]

function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 mb-0.5">
          <span className="text-[14.5px] font-semibold truncate" style={{ color: C.ink }}>
            {subscriber.name ?? 'No name'}
          </span>
          <SubscriberStatusBadge status={subscriber.status} />
        </div>
        <p className="text-[13px] truncate" style={{ color: C.ink2 }}>
          {subscriber.email}
        </p>
        <p className="text-[12px] mt-1" style={{ color: C.ink3 }}>
          {subscriber.source} · {formatCount(subscriber.engagement.opens)} opens · Joined{' '}
          {formatDate(subscriber.createdAt)}
        </p>
      </div>
    </div>
  )
}

export default function SubscriberList() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, 300)

  // Reset to the first page whenever the filter or the (debounced) search changes.
  useEffect(() => {
    setPage(1)
  }, [status, debouncedSearch])

  const state = useSubscribers({ page, pageSize: 10, status, search: debouncedSearch })

  return (
    <AdminShell title="Subscribers" subtitle="Everyone on the list, paged ten at a time.">
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1">
          {STATUS_FILTERS.map((f) => {
            const active = f.value === status
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatus(f.value)}
                className="h-8 px-3.5 rounded-full text-[13px] font-semibold whitespace-nowrap shrink-0 transition-colors"
                style={{
                  background: active ? C.peachSelected : C.chip,
                  color: active ? C.coral : C.ink2,
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>
        <div className="md:w-[260px] shrink-0">
          <TextInput
            value={search}
            onChange={setSearch}
            placeholder="Search name or email"
            aria-label="Search subscribers by name or email"
          />
        </div>
      </div>

      <Async
        state={state}
        isEmpty={(p) => p.items.length === 0}
        empty={
          <EmptyState
            icon={Users}
            title="No subscribers match"
            subtext="Try a different status or search."
          />
        }
      >
        {(data) => (
          <>
            <Card padded={false}>
              {data.items.map((sub, i) => (
                <div key={sub.id}>
                  {i > 0 && <Divider />}
                  <SubscriberRow subscriber={sub} />
                </div>
              ))}
            </Card>
            <div className="flex items-center justify-between gap-3 mt-4">
              <span className="text-[13px]" style={{ color: C.ink2 }}>
                Showing {data.items.length} of {formatCount(data.total)}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  leadIcon={<ChevronLeft size={15} strokeWidth={2.2} />}
                >
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!data.hasMore}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight size={15} strokeWidth={2.2} />
                </Button>
              </div>
            </div>
          </>
        )}
      </Async>
    </AdminShell>
  )
}
