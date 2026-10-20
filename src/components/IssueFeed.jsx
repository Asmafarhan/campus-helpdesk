import { useState, useMemo } from 'react';
import IssueCard from './IssueCard';
import { CATEGORIES } from '../constants/initialData';

export default function IssueFeed({
  tickets,
  onViewDetails,
  onUpvote,
  onOpenNewIssue
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const pendingCount = tickets.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.id.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' || t.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'All' || t.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tickets, searchTerm, statusFilter, categoryFilter]);

  return (
    <div className="feed-container">
      {/* Hero Welcome Banner */}
      <section className="feed-hero">
        <div className="hero-content">
          <div className="hero-badge">Welcome to Campus Helpdesk</div>
          <h1 className="hero-heading">Report and Track Campus Issues</h1>
          <p className="hero-subtext">
            Notice a broken light, slow Wi-Fi, classroom projector error, or facility issue? Report it below, track live progress, and upvote existing tickets.
          </p>
          <div className="hero-button-group">
            <button className="btn btn-primary" onClick={onOpenNewIssue}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Submit an Issue
            </button>
          </div>
        </div>

        {/* Quick status summary pills */}
        <div className="hero-status-pills">
          <button
            type="button"
            className="status-pill-badge pill-pending"
            onClick={() => setStatusFilter('Pending')}
            aria-label={`Filter by ${pendingCount} pending review tickets`}
          >
            <span className="dot dot-pending"></span>
            <strong>{pendingCount}</strong> Pending Review
          </button>
          <button
            type="button"
            className="status-pill-badge pill-progress"
            onClick={() => setStatusFilter('In Progress')}
            aria-label={`Filter by ${inProgressCount} in progress tickets`}
          >
            <span className="dot dot-progress"></span>
            <strong>{inProgressCount}</strong> In Progress
          </button>
          <button
            type="button"
            className="status-pill-badge pill-resolved"
            onClick={() => setStatusFilter('Resolved')}
            aria-label={`Filter by ${resolvedCount} resolved tickets`}
          >
            <span className="dot dot-resolved"></span>
            <strong>{resolvedCount}</strong> Resolved
          </button>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="card feed-filter-card">
        <div className="search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Search tickets by ID (e.g. CHD-1001), keywords, or campus buildings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            aria-label="Search tickets by ID, keywords, or campus buildings"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search input"
            >
              &times;
            </button>
          )}
        </div>

        <div className="feed-filters-bar">
          <div className="status-filter-pills" role="toolbar" aria-label="Filter tickets by status">
            <button
              type="button"
              className={`pill-btn ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All ({tickets.length})
            </button>
            <button
              type="button"
              className={`pill-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Pending')}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              className={`pill-btn ${statusFilter === 'In Progress' ? 'active' : ''}`}
              onClick={() => setStatusFilter('In Progress')}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              type="button"
              className={`pill-btn ${statusFilter === 'Resolved' ? 'active' : ''}`}
              onClick={() => setStatusFilter('Resolved')}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter tickets by category"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues List Grid */}
      <div className="feed-results-header">
        <h2>Campus Community Reports</h2>
        <span className="results-count">
          Showing {filteredTickets.length} of {tickets.length} tickets
        </span>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-icon">📂</div>
          <h3>No matching issues found</h3>
          <p>
            {searchTerm || statusFilter !== 'all' || categoryFilter !== 'All'
              ? 'Try adjusting your search terms or filter selections.'
              : 'No issues currently reported.'}
          </p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCategoryFilter('All');
            }}
          >
            Clear Search &amp; Filters
          </button>
        </div>
      ) : (
        <div className="cards-grid">
          {filteredTickets.map((ticket) => (
            <IssueCard
              key={ticket.id}
              ticket={ticket}
              isAdmin={false}
              onViewDetails={onViewDetails}
              onUpvote={onUpvote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
