import type { DeliverySummary } from '../core/types'
import { formatCount, rate } from '../core/format'
import { Card, SectionLabel, StatCell } from '../ui'

/** Delivery figures for a sent or failed campaign. Demo data, not a real claim. */
export function DeliverySummaryPanel({
  delivery,
  title = 'Delivery summary',
}: {
  delivery: DeliverySummary
  title?: string
}) {
  const cells: { value: string; label: string; sub?: string }[] = [
    { value: formatCount(delivery.recipients), label: 'Recipients' },
    { value: formatCount(delivery.delivered), label: 'Delivered', sub: rate(delivery.delivered, delivery.recipients) },
    { value: formatCount(delivery.opened), label: 'Opened', sub: rate(delivery.opened, delivery.delivered) },
    { value: formatCount(delivery.clicked), label: 'Clicked', sub: rate(delivery.clicked, delivery.delivered) },
    { value: formatCount(delivery.bounced), label: 'Bounced' },
    { value: formatCount(delivery.unsubscribed), label: 'Unsubscribed' },
    { value: formatCount(delivery.complained), label: 'Complaints' },
    { value: formatCount(delivery.failed), label: 'Failed' },
  ]
  return (
    <Card radius="standalone">
      <div className="mb-4">
        <SectionLabel>{title}</SectionLabel>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-5 gap-x-4">
        {cells.map((cell) => (
          <StatCell key={cell.label} value={cell.value} label={cell.label} sub={cell.sub} />
        ))}
      </div>
    </Card>
  )
}
