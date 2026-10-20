import { useState } from 'react';
import Navbar from './components/Navbar';
import IssueForm from './components/IssueForm';
import IssueFeed from './components/IssueFeed';
import AdminDashboard from './components/AdminDashboard';
import IssueDetailModal from './components/IssueDetailModal';
import Toast from './components/Toast';
import {
  loadTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  upvoteTicket,
  resetTickets
} from './utils/storage';
import './App.css';

function App() {
  const [tickets, setTickets] = useState(() => loadTickets());
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'submit' | 'admin'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
  };

  // Create issue handler
  const handleCreateIssue = (formData) => {
    const { newTicket, updatedTickets } = createTicket(formData, tickets);
    setTickets(updatedTickets);
    showToast('success', 'Ticket Submitted!', `Ticket #${newTicket.id} has been logged.`);
    return newTicket;
  };

  // Quick Status change handler
  const handleStatusChange = (ticketId, newStatus) => {
    const updatedTickets = updateTicket(ticketId, { status: newStatus }, tickets);
    setTickets(updatedTickets);
    showToast('info', 'Status Updated', `Ticket ${ticketId} is now set to "${newStatus}".`);

    // If modal is open for this ticket, sync it with full updated ticket data
    if (selectedTicket && selectedTicket.id === ticketId) {
      const updated = updatedTickets.find((t) => t.id === ticketId);
      if (updated) setSelectedTicket(updated);
    }
  };

  // Full ticket update handler (from modal)
  const handleUpdateTicket = (ticketId, updates) => {
    const updatedTickets = updateTicket(ticketId, updates, tickets);
    setTickets(updatedTickets);
    showToast('success', 'Changes Saved', `Ticket ${ticketId} details and notes updated.`);

    // Keep modal in sync
    const updated = updatedTickets.find((t) => t.id === ticketId);
    if (updated) setSelectedTicket(updated);
  };

  // Delete ticket handler
  const handleDeleteTicket = (ticketId) => {
    const updatedTickets = deleteTicket(ticketId, tickets);
    setTickets(updatedTickets);
    showToast('error', 'Ticket Removed', `Ticket ${ticketId} has been deleted.`);
    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket(null);
    }
  };

  // Upvote ticket handler
  const handleUpvote = (ticketId) => {
    const updatedTickets = upvoteTicket(ticketId, tickets);
    setTickets(updatedTickets);
    showToast('info', 'Upvoted', 'Thank you! Your feedback helps campus staff prioritize this issue.');

    if (selectedTicket && selectedTicket.id === ticketId) {
      setSelectedTicket((prev) => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));
    }
  };

  // Reset to initial mock data
  const handleResetData = () => {
    const initial = resetTickets();
    setTickets(initial);
    showToast('info', 'Data Reset', 'Helpdesk tickets have been restored to initial sample data.');
  };

  return (
    <div className="app-layout">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tickets={tickets}
        onNewIssueClick={() => setActiveTab('submit')}
      />

      {/* Main View Area */}
      <main className="main-content">
        {activeTab === 'feed' && (
          <IssueFeed
            tickets={tickets}
            onViewDetails={(ticket) => setSelectedTicket(ticket)}
            onUpvote={handleUpvote}
            onOpenNewIssue={() => setActiveTab('submit')}
          />
        )}

        {activeTab === 'submit' && (
          <div className="submit-page-wrapper">
            <IssueForm
              onSubmitSuccess={handleCreateIssue}
              onCancel={() => setActiveTab('feed')}
            />
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            tickets={tickets}
            onViewDetails={(ticket) => setSelectedTicket(ticket)}
            onStatusChange={handleStatusChange}
            onDeleteTicket={handleDeleteTicket}
            onResetData={handleResetData}
            onOpenNewIssue={() => setActiveTab('submit')}
          />
        )}
      </main>

      {/* Detail / Edit Modal */}
      {selectedTicket && (
        <IssueDetailModal
          key={`${selectedTicket.id}-${selectedTicket.updatedAt || ''}`}
          ticket={selectedTicket}
          isAdmin={activeTab === 'admin'}
          onClose={() => setSelectedTicket(null)}
          onUpdateTicket={handleUpdateTicket}
          onDeleteTicket={handleDeleteTicket}
          onUpvote={handleUpvote}
        />
      )}

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Global Campus Footer */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-col">
            <div className="footer-brand">
              <strong>Campus Helpdesk</strong>
            </div>
            <p className="footer-desc">
              Centralized issue reporting and resolution system for campus facilities, Wi-Fi, classroom equipment, and student residences.
            </p>
          </div>
          <div className="footer-col">
            <div className="footer-title">Emergency Hotlines</div>
            <ul className="footer-links">
              <li>Campus Security: (555) 019-2834</li>
              <li>Facilities &amp; Power Emergency: (555) 019-4821</li>
              <li>IT Network Helpdesk: Ext. 4357 (HELP)</li>
            </ul>
          </div>
          <div className="footer-col">
            <div className="footer-title">Quick Actions</div>
            <ul className="footer-links">
              <li>
                <button className="footer-btn-link" onClick={() => setActiveTab('submit')}>
                  Report Broken Equipment
                </button>
              </li>
              <li>
                <button className="footer-btn-link" onClick={() => setActiveTab('feed')}>
                  Check Ticket Status
                </button>
              </li>
              <li>
                <button className="footer-btn-link" onClick={() => setActiveTab('admin')}>
                  Staff Admin Dashboard
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} Campus Facilities &amp; Operations. All rights reserved. Data saved in browser localStorage.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
