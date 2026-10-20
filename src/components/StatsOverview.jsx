export default function StatsOverview({ tickets, activeStatusFilter, onStatusFilterChange }) {
  const total = tickets.length;
  const pending = tickets.filter((t) => t.status === 'Pending').length;
  const inProgress = tickets.filter((t) => t.status === 'In Progress').length;
  const resolved = tickets.filter((t) => t.status === 'Resolved').length;

  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const urgentCount = tickets.filter(
    (t) => t.status !== 'Resolved' && (t.priority === 'Urgent' || t.priority === 'High')
  ).length;

  const stats = [
    {
      id: 'all',
      label: 'Total Tickets',
      value: total,
      subtext: 'Lifetime campus reports',
      colorClass: 'stat-total',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      )
    },
    {
      id: 'Pending',
      label: 'Pending',
      value: pending,
      subtext: `${total > 0 ? Math.round((pending / total) * 100) : 0}% of all tickets`,
      colorClass: 'stat-pending',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      id: 'In Progress',
      label: 'In Progress',
      value: inProgress,
      subtext: 'Active repairs underway',
      colorClass: 'stat-in-progress',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
      )
    },
    {
      id: 'Resolved',
      label: 'Resolved',
      value: resolved,
      subtext: `${resolutionRate}% resolution rate`,
      colorClass: 'stat-resolved',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    },
    {
      id: 'urgent-alerts',
      label: 'Active High / Urgent',
      value: urgentCount,
      subtext: urgentCount > 0 ? 'Requires prompt dispatch' : 'No urgent alerts',
      colorClass: 'stat-urgent',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      )
    }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => {
        const isClickable = stat.id === 'all' || stat.id === 'Pending' || stat.id === 'In Progress' || stat.id === 'Resolved';
        const isSelected = activeStatusFilter === stat.id;

        return (
          <div
            key={stat.id}
            className={`stat-card ${stat.colorClass} ${isSelected ? 'stat-card-active' : ''} ${
              isClickable && onStatusFilterChange ? 'clickable' : ''
            }`}
            role={isClickable ? 'button' : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-pressed={isClickable ? isSelected : undefined}
            aria-label={`${stat.label}: ${stat.value}`}
            onClick={() => {
              if (isClickable && onStatusFilterChange) {
                onStatusFilterChange(stat.id);
              }
            }}
            onKeyDown={(e) => {
              if (isClickable && onStatusFilterChange && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onStatusFilterChange(stat.id);
              }
            }}
          >
            <div className="stat-icon-wrapper">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-subtext">{stat.subtext}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
