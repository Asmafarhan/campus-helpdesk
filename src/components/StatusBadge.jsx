export default function StatusBadge({ status, size = 'normal' }) {
  let badgeClass = 'status-pending';
  let label = 'Pending';

  if (status === 'In Progress') {
    badgeClass = 'status-in-progress';
    label = 'In Progress';
  } else if (status === 'Resolved') {
    badgeClass = 'status-resolved';
    label = 'Resolved';
  }

  return (
    <span className={`status-badge ${badgeClass} ${size === 'small' ? 'badge-sm' : ''}`}>
      <span className="status-dot"></span>
      {label}
    </span>
  );
}
