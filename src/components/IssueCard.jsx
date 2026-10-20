import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

export default function IssueCard({
  ticket,
  isAdmin = false,
  onViewDetails,
  onStatusChange,
  onDelete,
  onUpvote
}) {
  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <article className={`issue-card ${ticket.priority === 'Urgent' ? 'card-urgent' : ''}`}>
      {/* Top row: ID, Created Date, Status, Priority */}
      <div className="card-top-row">
        <div className="ticket-meta">
          <span className="card-ticket-id">{ticket.id}</span>
          <span className="meta-dot">&bull;</span>
          <span className="card-time">{formatTime(ticket.createdAt)}</span>
        </div>
        <div className="card-badges">
          <PriorityBadge priority={ticket.priority} size="small" />
          <StatusBadge status={ticket.status} size="small" />
        </div>
      </div>

      {/* Title & Category */}
      <h3
        className="card-title"
        onClick={() => onViewDetails(ticket)}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onViewDetails(ticket);
          }
        }}
        aria-label={`View details for ${ticket.title}`}
      >
        {ticket.title}
      </h3>
      <div className="card-category-tag">{ticket.category}</div>

      {/* Description */}
      <p className="card-description">
        {ticket.description.length > 140
          ? `${ticket.description.slice(0, 140)}...`
          : ticket.description}
      </p>

      {/* Location & Submitter info */}
      <div className="card-info-grid">
        <div className="info-item location-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="truncate">{ticket.location}</span>
        </div>

        <div className="info-item submitter-item">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span className="truncate">{ticket.submitterName}</span>
        </div>
      </div>

      {/* Admin Notes Preview if present */}
      {ticket.adminNotes && (
        <div className="card-admin-note">
          <span className="admin-note-label">Admin Update:</span> {ticket.adminNotes}
        </div>
      )}

      {/* Card Footer Actions */}
      <div className="card-footer">
        <div className="footer-left">
          {onUpvote && (
            <button
              type="button"
              className="btn-upvote"
              onClick={() => onUpvote(ticket.id)}
              title="I am also experiencing this issue"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span>{ticket.upvotes || 1} Me Too</span>
            </button>
          )}

          <button
            type="button"
            className="btn-text"
            onClick={() => onViewDetails(ticket)}
          >
            Details &rarr;
          </button>
        </div>

        {isAdmin && (
          <div className="footer-admin-actions">
            <select
              className="quick-status-select"
              value={ticket.status}
              onChange={(e) => onStatusChange(ticket.id, e.target.value)}
              title="Change status"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {onDelete && (
              <button
                type="button"
                className="btn-icon-danger"
                onClick={() => onDelete(ticket.id)}
                title="Delete ticket"
                aria-label="Delete ticket"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
