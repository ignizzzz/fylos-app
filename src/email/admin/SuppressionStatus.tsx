import { useState } from 'react'
import { ShieldOff } from 'lucide-react'
import type { SuppressionEntry } from '../core/types'
import { formatCount, formatDate } from '../core/format'
import { removeSuppression } from '../core/service'
import { useSuppression } from '../hooks/data'
import { useAction } from '../hooks/useAction'
import { AdminShell } from '../layout/AdminShell'
import { SuppressionReasonBadge } from '../components/badges'
import { Async, Button, Card, Divider, EmptyState, Notice, StatCell, C } from '../ui'

function SuppressionRow({
  entry,
  busy,
  disabled,
  onRemove,
}: {
  entry: SuppressionEntry
  busy: boolean
  disabled: boolean
  onRemove: () => void
}) {
  return (
    <div className="p-5 flex items-start gap-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2.5 mb-1 flex-wrap">
          <span className="text-[14.5px] font-semibold break-all" style={{ color: C.ink }}>
            {entry.email}
          </span>
          <SuppressionReasonBadge reason={entry.reason} />
        </div>
        <p className="text-[13px] leading-[1.5]" style={{ color: C.ink2 }}>
          {entry.detail}
        </p>
        <p className="text-[12px] mt-1" style={{ color: C.ink3 }}>
          Added {formatDate(entry.addedAt)} · {entry.source}
        </p>
      </div>
      <Button variant="ghost" size="sm" disabled={disabled} onClick={onRemove} className="shrink-0">
        {busy ? 'Removing' : 'Remove'}
      </Button>
    </div>
  )
}

export default function SuppressionStatus() {
  const state = useSuppression()
  const remove = useAction(removeSuppression)
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function handleRemove(id: string) {
    setRemovingId(id)
    const removed = await remove.run(id)
    setRemovingId(null)
    if (removed) state.reload()
  }

  return (
    <AdminShell title="Suppression" subtitle="Addresses we will not email, and why.">
      <p className="mb-4 text-[13.5px] leading-[1.55] max-w-[560px]" style={{ color: C.ink2 }}>
        Bounces and complaints are added here automatically. An address on this list cannot be
        emailed until it is removed, which keeps our sending reputation healthy.
      </p>

      <Async
        state={state}
        isEmpty={(list) => list.length === 0}
        empty={
          <EmptyState
            icon={ShieldOff}
            title="Suppression list is clear"
            subtext="No bounces or complaints right now."
          />
        }
      >
        {(list) => {
          const bounced = list.filter((e) => e.reason === 'bounced').length
          const complaints = list.filter((e) => e.reason === 'complained').length
          const cells = [
            { value: formatCount(list.length), label: 'Suppressed' },
            { value: formatCount(bounced), label: 'Bounced' },
            { value: formatCount(complaints), label: 'Complaints' },
          ]
          return (
            <div className="flex flex-col gap-4">
              <Card radius="standalone">
                <div className="grid grid-cols-3 gap-x-4">
                  {cells.map((cell) => (
                    <StatCell key={cell.label} value={cell.value} label={cell.label} />
                  ))}
                </div>
              </Card>

              {remove.error && (
                <Notice tone="red" title="Could not remove that address">
                  {remove.error.message}
                </Notice>
              )}

              <Card padded={false}>
                {list.map((entry, i) => (
                  <div key={entry.id}>
                    {i > 0 && <Divider />}
                    <SuppressionRow
                      entry={entry}
                      busy={removingId === entry.id}
                      disabled={remove.pending}
                      onRemove={() => handleRemove(entry.id)}
                    />
                  </div>
                ))}
              </Card>
            </div>
          )
        }}
      </Async>
    </AdminShell>
  )
}
