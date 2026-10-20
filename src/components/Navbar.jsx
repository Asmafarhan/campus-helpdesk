import { useState } from 'react';

export default function Navbar({ activeTab, setActiveTab, tickets, onNewIssueClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCount = tickets.filter((t) => t.status === 'Pending').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand */}
        <div
          className="brand"
          onClick={() => handleNavClick('feed')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleNavClick('feed');
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Campus Helpdesk Home"
        >
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">Campus Helpdesk</span>
            <span className="brand-tagline">Student & Facilities Portal</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <button
            className={`nav-link ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => handleNavClick('feed')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            Campus Feed
            <span className="badge-pill count-neutral">{tickets.length}</span>
          </button>

          <button
            className={`nav-link ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => handleNavClick('submit')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Report an Issue
          </button>

          <button
            className={`nav-link ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            Admin Dashboard
            {pendingCount > 0 && (
              <span className="badge-pill count-amber" title={`${pendingCount} pending issues`}>
                {pendingCount}
              </span>
            )}
          </button>
        </nav>

        {/* Quick action button */}
        <div className="header-actions">
          <button
            className="btn btn-primary btn-sm header-cta"
            onClick={onNewIssueClick || (() => handleNavClick('submit'))}
          >
            <span className="plus-icon">+</span> Report Issue
          </button>

          {/* Mobile hamburger */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="mobile-menu" role="region" aria-label="Mobile navigation">
          <button
            className={`mobile-link ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => handleNavClick('feed')}
          >
            Campus Feed ({tickets.length})
          </button>
          <button
            className={`mobile-link ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => handleNavClick('submit')}
          >
            + Report New Issue
          </button>
          <button
            className={`mobile-link ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => handleNavClick('admin')}
          >
            Admin Dashboard ({pendingCount} pending, {inProgressCount} active)
          </button>
        </div>
      )}
    </header>
  );
}
