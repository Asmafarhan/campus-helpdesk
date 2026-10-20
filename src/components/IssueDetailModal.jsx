import { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { STATUSES } from '../constants/initialData';

export default function IssueDetailModal({
  ticket,
  isAdmin = false,
  onClose,
  onUpdateTicket,
  onDeleteTicket,
  onUpvote
}) {
  const [currentStatus, setCurrentStatus] = useState(ticket?.status || 'Pending');
  const [adminNotes, setAdminNotes] = useState(ticket?.adminNotes || '');
  const [assignedTo, setAssignedTo] = useState(ticket?.assignedTo || '');
  const [isSaving, setIsSaving] = useState(false);

  // Support closing modal via Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!ticket) return null;

  const formatDate = (isoString) => {
    if (!isoString) return 'Not yet';
    try {
      return new Date(isoString).toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return isoString;
    }
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      onUpdateTicket(ticket.id, {
        status: currentStatus,
        adminNotes: adminNotes.trim(),
        assignedTo: assignedTo.trim()
      });
      setIsSaving(false);
    }, 200);
  };

  const steps = [
    { key: 'Pending', label: '1. Ticket Logged', desc: 'Awaiting triage & assignment' },
    { key: 'In Progress', label: '2. In Progress', desc: 'Technician dispatched on site' },
    { key: 'Resolved', label: '3. Resolved', desc: 'Repairs completed & verified' }
  ];

  const getStepIndex = (status) => {
    if (status === 'Resolved') return 2;
    if (status === 'In Progress') return 1;
    return 0;
  };

  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-header-top">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="modal-ticket-id">{ticket.id}</span>
              {isAdmin && <span className="badge-pill count-amber">Staff Admin</span>}
            </div>
            <div className="modal-badges">
              <PriorityBadge priority={ticket.priority} />
              <StatusBadge status={ticket.status} />
            </div>
          </div>
          <h2 id="modal-title" className="modal-title">
            {ticket.title}
          </h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="modal-body">
          {/* Status Timeline Workflow */}
          <div className="timeline-container">
            <div className="timeline-title">Resolution Workflow</div>
            <div className="timeline-steps">
              {steps.map((step, idx) => {
                const isPassed = idx < activeIndex;
                const isCurrent = idx === activeIndex;
                return (
                  <div
                    key={step.key}
                    className={`timeline-step ${isPassed ? 'step-completed' : ''} ${
                      isCurrent ? 'step-current' : ''
                    }`}
                  >
                    <div className="step-marker">
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <div className="step-content">
                      <div className="step-label">{step.label}</div>
                      <div className="step-desc">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details Grid */}
          <div className="details-grid">
            <div className="detail-field">
              <span className="detail-label">Category</span>
              <span className="detail-value highlight-value">{ticket.category}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Location / Room</span>
              <span className="detail-value">{ticket.location}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Submitter</span>
              <span className="detail-value">
                {ticket.submitterName} ({ticket.submitterEmail})
              </span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Student / Staff ID</span>
              <span className="detail-value">{ticket.submitterId || 'N/A'}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Submitted On</span>
              <span className="detail-value">{formatDate(ticket.createdAt)}</span>
            </div>
            <div className="detail-field">
              <span className="detail-label">Resolved On</span>
              <span className="detail-value">{formatDate(ticket.resolvedAt)}</span>
            </div>
          </div>

          {/* Full Description */}
          <div className="detail-section">
            <h4 className="detail-section-title">Issue Description</h4>
            <div className="detail-description-text">{ticket.description}</div>
          </div>

          {/* Attachment if present */}
          {ticket.attachmentUrl && (
            <div className="detail-section">
              <h4 className="detail-section-title">Attached Photo</h4>
              <div className="attachment-preview-box">
                <img
                  src={ticket.attachmentUrl}
                  alt="Issue attachment"
                  className="attachment-full-img"
                />
              </div>
            </div>
          )}

          {/* Admin Management Section */}
          {isAdmin ? (
            <div className="admin-editor-section">
              <div className="admin-editor-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
                <span>Helpdesk Administration &amp; Status Control</span>
              </div>

              <form onSubmit={handleSaveChanges} className="admin-editor-form">
                <div className="admin-form-row">
                  <div className="form-group flex-1">
                    <label htmlFor="modal-status-select" className="form-label">
                      Update Ticket Status
                    </label>
                    <select
                      id="modal-status-select"
                      className="form-select status-select-highlight"
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                    >
                      {STATUSES.map((st) => (
                        <option key={st.value} value={st.value}>
                          {st.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label htmlFor="modal-assigned-to" className="form-label">
                      Assigned Department / Technician
                    </label>
                    <input
                      id="modal-assigned-to"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Facilities HVAC Team"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="modal-admin-notes" className="form-label">
                    Admin Resolution Notes &amp; Status Updates
                  </label>
                  <textarea
                    id="modal-admin-notes"
                    rows="3"
                    className="form-textarea"
                    placeholder="Record diagnostic findings, dispatch status, parts ordered, or resolution confirmation..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  ></textarea>
                </div>

                <div className="admin-form-actions">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving Updates...' : 'Save Status & Notes'}
                  </button>

                  {onDeleteTicket && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ticket ${ticket.id}?`)) {
                          onDeleteTicket(ticket.id);
                          onClose();
                        }
                      }}
                    >
                      Delete Ticket
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="admin-editor-section">
              <div className="admin-editor-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Facilities Dispatch &amp; Resolution Updates</span>
              </div>
              <div className="sla-info-box">
                <p><strong>Assigned Unit:</strong> {ticket.assignedTo || 'Campus Helpdesk Dispatch'}</p>
                {ticket.adminNotes ? (
                  <p style={{ marginTop: '8px' }}>
                    <strong>Latest Operational Note:</strong> {ticket.adminNotes}
                  </p>
                ) : (
                  <p style={{ marginTop: '8px', color: 'var(--text-muted)' }}>
                    No updates logged yet. Staff will review this ticket shortly.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          {onUpvote && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onUpvote(ticket.id)}
            >
              ▲ Upvote / &quot;Affects Me&quot; ({ticket.upvotes || 1})
            </button>
          )}
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
