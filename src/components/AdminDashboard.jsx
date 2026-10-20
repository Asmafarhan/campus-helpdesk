import { useState, useMemo } from 'react';
import StatsOverview from './StatsOverview';
import CategoryBreakdown from './CategoryBreakdown';
import PriorityBadge from './PriorityBadge';
import IssueCard from './IssueCard';
import { CATEGORIES, PRIORITIES } from '../constants/initialData';
import { exportToCSV } from '../utils/storage';

export default function AdminDashboard({
  tickets,
  onViewDetails,
  onStatusChange,
  onDeleteTicket,
  onResetData,
  onOpenNewIssue
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    return tickets
      .filter((t) => {
        // Search term
        const q = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !q ||
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.location.toLowerCase().includes(q) ||
          t.submitterName.toLowerCase().includes(q) ||
          t.submitterEmail.toLowerCase().includes(q) ||
          (t.adminNotes && t.adminNotes.toLowerCase().includes(q));

        // Status
        const matchesStatus =
          statusFilter === 'all' || t.status === statusFilter;

        // Category
        const matchesCategory =
          categoryFilter === 'All' || t.category === categoryFilter;

        // Priority
        const matchesPriority =
          priorityFilter === 'All' || t.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === 'priority') {
          const priorityWeights = { Urgent: 4, High: 3, Medium: 2, Low: 1 };
          return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
        }
        if (sortBy === 'upvotes') {
          return (b.upvotes || 0) - (a.upvotes || 0);
        }
        return 0;
      });
  }, [tickets, searchTerm, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const handleExportCSV = () => {
    exportToCSV(filteredTickets);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('All');
    setPriorityFilter('All');
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchTerm || statusFilter !== 'all' || categoryFilter !== 'All' || priorityFilter !== 'All';

  const formatShortDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return iso;
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Top Banner */}
      <div className="admin-header-row">
        <div>
          <div className="admin-badge-pill">Helpdesk Control Center</div>
          <h1 className="admin-title">Campus Operations &amp; Admin Dashboard</h1>
          <p className="admin-subtext">
            Monitor real-time facilities, Wi-Fi, and academic service requests across campus.
          </p>
        </div>

        <div className="admin-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV} title="Export filtered tickets to CSV">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export CSV
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              if (window.confirm('Reset all ticket records to sample campus helpdesk data?')) {
                onResetData();
              }
            }}
            title="Reset tickets to initial sample data"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
            Reset Data
          </button>

          <button className="btn btn-primary btn-sm" onClick={onOpenNewIssue}>
            + Log New Issue
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatsOverview
        tickets={tickets}
        activeStatusFilter={statusFilter}
        onStatusFilterChange={(st) => setStatusFilter(st)}
      />

      {/* Visual Analytics Charts */}
      <CategoryBreakdown
        tickets={tickets}
        selectedCategory={categoryFilter}
        onCategorySelect={(cat) => setCategoryFilter(cat)}
      />

      {/* Ticket Management Center */}
      <div className="card ticket-management-card">
        <div className="management-header">
          <div>
            <h2 className="management-title">Campus Issue Directory &amp; Triage</h2>
            <span className="management-count">
              Showing <strong>{filteredTickets.length}</strong> of {tickets.length} total tickets
            </span>
          </div>

          <div className="view-mode-toggles">
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              Table
            </button>
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid Cards View"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              Grid
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="controls-bar">
          <div className="search-box">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search by ID, keyword, building, submitter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              aria-label="Search by ID, keyword, building, or submitter"
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

          <div className="filters-row">
            {/* Status pills */}
            <div className="status-filter-pills" role="toolbar" aria-label="Filter tickets by status">
              {['all', 'Pending', 'In Progress', 'Resolved'].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`pill-btn ${statusFilter === st ? 'active' : ''}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st === 'all' ? 'All Statuses' : st}
                </button>
              ))}
            </div>

            {/* Category dropdown */}
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

            {/* Priority dropdown */}
            <select
              className="filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter tickets by priority"
            >
              <option value="All">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label} Priority
                </option>
              ))}
            </select>

            {/* Sort dropdown */}
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort tickets by"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Priority</option>
              <option value="upvotes">Most Upvoted</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-secondary btn-sm clear-filters-btn"
                onClick={handleClearFilters}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Content: Table or Grid */}
        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No matching campus tickets</h3>
            <p>Try refining your search keyword or clearing active status/category filters.</p>
            {hasActiveFilters && (
              <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>
                Reset Search Filters
              </button>
            )}
          </div>
        ) : viewMode === 'table' ? (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Issue &amp; Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status &amp; Action</th>
                  <th>Submitter</th>
                  <th>Created</th>
                  <th>Manage</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id} className={t.priority === 'Urgent' ? 'row-urgent' : ''}>
                    <td className="col-id">
                      <span
                        className="table-id"
                        onClick={() => onViewDetails(t)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onViewDetails(t);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`View details for ticket ${t.id}`}
                      >
                        {t.id}
                      </span>
                    </td>
                    <td className="col-title">
                      <div
                        className="table-title-link"
                        onClick={() => onViewDetails(t)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onViewDetails(t);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        aria-label={`View details for ${t.title}`}
                      >
                        {t.title}
                      </div>
                      <div className="table-sub-loc">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        {t.location}
                      </div>
                    </td>
                    <td>
                      <span className="table-cat-badge">{t.category}</span>
                    </td>
                    <td>
                      <PriorityBadge priority={t.priority} size="small" />
                    </td>
                    <td>
                      <div className="status-cell">
                        <select
                          className={`table-status-select select-status-${t.status.toLowerCase().replace(' ', '-')}`}
                          value={t.status}
                          onChange={(e) => onStatusChange(t.id, e.target.value)}
                          aria-label={`Update status for ticket ${t.id}`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </td>
                    <td className="col-submitter">
                      <div className="table-submitter-name">{t.submitterName}</div>
                      <div className="table-submitter-email">{t.submitterEmail}</div>
                    </td>
                    <td className="col-date">{formatShortDate(t.createdAt)}</td>
                    <td className="col-actions">
                      <button
                        type="button"
                        className="btn-action-view"
                        onClick={() => onViewDetails(t)}
                        title="View Full Details"
                        aria-label={`Inspect ticket ${t.id}`}
                      >
                        Inspect
                      </button>
                      <button
                        type="button"
                        className="btn-action-delete"
                        onClick={() => {
                          if (window.confirm(`Delete ticket ${t.id}?`)) {
                            onDeleteTicket(t.id);
                          }
                        }}
                        title="Delete Ticket"
                        aria-label={`Delete ticket ${t.id}`}
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="cards-grid">
            {filteredTickets.map((ticket) => (
              <IssueCard
                key={ticket.id}
                ticket={ticket}
                isAdmin={true}
                onViewDetails={onViewDetails}
                onStatusChange={onStatusChange}
                onDelete={onDeleteTicket}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
