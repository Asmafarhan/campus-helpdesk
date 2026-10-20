export default function PriorityBadge({ priority, size = 'normal' }) {
  const normalized = (priority || 'Medium').toLowerCase();
  let priorityClass = 'priority-medium';

  if (normalized === 'low') priorityClass = 'priority-low';
  else if (normalized === 'high') priorityClass = 'priority-high';
  else if (normalized === 'urgent') priorityClass = 'priority-urgent';

  return (
    <span className={`priority-badge ${priorityClass} ${size === 'small' ? 'badge-sm' : ''}`}>
      {priority === 'Urgent' && <span className="urgent-pulse">!</span>}
      {priority}
    </span>
  );
}
