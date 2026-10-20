import { CATEGORIES } from '../constants/initialData';

export default function CategoryBreakdown({ tickets, onCategorySelect, selectedCategory }) {
  const total = tickets.length;

  // Category counts
  const categoryCounts = CATEGORIES.map((cat) => {
    const count = tickets.filter((t) => t.category === cat).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return { name: cat, count, percentage };
  }).filter((c) => c.count > 0);

  // Priority counts
  const priorityCounts = [
    { label: 'Urgent', count: tickets.filter((t) => t.priority === 'Urgent').length, color: '#ef4444' },
    { label: 'High', count: tickets.filter((t) => t.priority === 'High').length, color: '#f59e0b' },
    { label: 'Medium', count: tickets.filter((t) => t.priority === 'Medium').length, color: '#3b82f6' },
    { label: 'Low', count: tickets.filter((t) => t.priority === 'Low').length, color: '#10b981' }
  ];

  return (
    <div className="analytics-container">
      {/* Category breakdown bar charts */}
      <div className="card analytics-card">
        <div className="analytics-card-header">
          <h3 className="analytics-title">Tickets by Campus Category</h3>
          <span className="analytics-subtitle">Active distribution</span>
        </div>

        <div className="category-bars-list">
          {categoryCounts.length === 0 ? (
            <p className="empty-text">No category records yet.</p>
          ) : (
            categoryCounts.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <div
                  key={cat.name}
                  className={`category-bar-row ${isSelected ? 'row-selected' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Filter by category ${cat.name}: ${cat.count} tickets (${cat.percentage}%)`}
                  onClick={() => onCategorySelect && onCategorySelect(isSelected ? 'All' : cat.name)}
                  onKeyDown={(e) => {
                    if (onCategorySelect && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onCategorySelect(isSelected ? 'All' : cat.name);
                    }
                  }}
                >
                  <div className="cat-bar-header">
                    <span className="cat-name">{cat.name}</span>
                    <span className="cat-stats">
                      <strong>{cat.count}</strong> ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="cat-progress-track">
                    <div
                      className="cat-progress-fill"
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Priority & Status Breakdown */}
      <div className="card analytics-card">
        <div className="analytics-card-header">
          <h3 className="analytics-title">Priority & Urgency Split</h3>
          <span className="analytics-subtitle">Operational workload</span>
        </div>

        <div className="priority-segmented-bar">
          {priorityCounts.map((p) => {
            const pct = total > 0 ? (p.count / total) * 100 : 0;
            if (pct === 0) return null;
            return (
              <div
                key={p.label}
                className="segment"
                style={{ width: `${pct}%`, backgroundColor: p.color }}
                title={`${p.label}: ${p.count} (${Math.round(pct)}%)`}
              ></div>
            );
          })}
        </div>

        <div className="priority-legend">
          {priorityCounts.map((p) => (
            <div key={p.label} className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: p.color }}></span>
              <span className="legend-label">{p.label}:</span>
              <span className="legend-count">{p.count}</span>
            </div>
          ))}
        </div>

        {/* Quick Helpdesk Service SLA / Efficiency Info */}
        <div className="sla-info-box">
          <div className="sla-title">⚡ Helpdesk Standard SLAs</div>
          <ul className="sla-list">
            <li>
              <span className="sla-tag tag-urgent">Urgent:</span> Within 2 hours dispatch
            </li>
            <li>
              <span className="sla-tag tag-high">High:</span> Same business day
            </li>
            <li>
              <span className="sla-tag tag-medium">Medium/Low:</span> 24–48 hours
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
