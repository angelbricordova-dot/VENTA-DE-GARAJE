import { STATUS_LABELS } from '../config'

export default function StatusBadge({ status, size = 'sm' }) {
  const cfg = STATUS_LABELS[status] || STATUS_LABELS.available
  const cls = {
    available: 'badge-available',
    pending: 'badge-pending',
    sold: 'badge-sold',
  }[cfg.color] || 'badge-available'

  const dot = {
    available: 'bg-emerald-500',
    pending: 'bg-amber-500',
    sold: 'bg-red-500',
  }[cfg.color]

  return (
    <span className={cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${status === 'available' ? 'pulse-dot' : ''}`} />
      {cfg.label}
    </span>
  )
}
