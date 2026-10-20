import { INITIAL_TICKETS } from '../constants/initialData';

const STORAGE_KEY = 'campus_helpdesk_tickets_v1';

/**
 * Load all tickets from localStorage. Pre-populates with initial tickets if empty.
 */
export function loadTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_TICKETS));
      return INITIAL_TICKETS;
    }
    return parsed;
  } catch (error) {
    console.error('Failed to load tickets from localStorage:', error);
    return INITIAL_TICKETS;
  }
}

/**
 * Save tickets array to localStorage.
 */
export function saveTickets(tickets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (error) {
    console.error('Failed to save tickets to localStorage:', error);
  }
}

/**
 * Generate next unique Ticket ID
 */
export function generateTicketId(existingTickets) {
  const prefix = 'CHD-';
  const numericIds = existingTickets
    .map((t) => {
      const match = t.id && t.id.match(/^CHD-(\d+)$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !isNaN(n));

  const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 1000;
  return `${prefix}${maxId + 1}`;
}

/**
 * Add a new ticket
 */
export function createTicket(ticketData, existingTickets) {
  const newTicket = {
    id: generateTicketId(existingTickets),
    title: ticketData.title.trim(),
    category: ticketData.category || 'Other',
    priority: ticketData.priority || 'Medium',
    status: 'Pending',
    location: ticketData.location.trim(),
    submitterName: ticketData.submitterName.trim(),
    submitterEmail: ticketData.submitterEmail.trim(),
    submitterId: (ticketData.submitterId || '').trim() || 'N/A',
    description: ticketData.description.trim(),
    adminNotes: 'Ticket received. Awaiting assignment.',
    assignedTo: 'Campus Dispatch Desk',
    attachmentUrl: ticketData.attachmentUrl || null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resolvedAt: null,
    upvotes: 1
  };

  const updatedTickets = [newTicket, ...existingTickets];
  saveTickets(updatedTickets);
  return { newTicket, updatedTickets };
}

/**
 * Update an existing ticket
 */
export function updateTicket(ticketId, updates, existingTickets) {
  const updatedTickets = existingTickets.map((ticket) => {
    if (ticket.id !== ticketId) return ticket;

    const ALLOWED_STATUSES = ['Pending', 'In Progress', 'Resolved'];
    const validStatus =
      updates.status && ALLOWED_STATUSES.includes(updates.status)
        ? updates.status
        : ticket.status;

    const isResolving = validStatus === 'Resolved' && ticket.status !== 'Resolved';
    const isUnresolving = validStatus !== 'Resolved' && ticket.status === 'Resolved';

    return {
      ...ticket,
      ...updates,
      status: validStatus,
      updatedAt: new Date().toISOString(),
      resolvedAt: isResolving
        ? new Date().toISOString()
        : isUnresolving
        ? null
        : ticket.resolvedAt
    };
  });

  saveTickets(updatedTickets);
  return updatedTickets;
}

/**
 * Delete a ticket
 */
export function deleteTicket(ticketId, existingTickets) {
  const updatedTickets = existingTickets.filter((t) => t.id !== ticketId);
  saveTickets(updatedTickets);
  return updatedTickets;
}

/**
 * Upvote a ticket
 */
export function upvoteTicket(ticketId, existingTickets) {
  const updatedTickets = existingTickets.map((ticket) => {
    if (ticket.id === ticketId) {
      return {
        ...ticket,
        upvotes: (ticket.upvotes || 0) + 1
      };
    }
    return ticket;
  });
  saveTickets(updatedTickets);
  return updatedTickets;
}

/**
 * Reset localStorage to initial mock data
 */
export function resetTickets() {
  saveTickets(INITIAL_TICKETS);
  return INITIAL_TICKETS;
}

/**
 * Export tickets as CSV
 */
export function exportToCSV(tickets) {
  if (!tickets || tickets.length === 0) return;

  const headers = [
    'Ticket ID',
    'Title',
    'Category',
    'Priority',
    'Status',
    'Location',
    'Submitter Name',
    'Submitter Email',
    'Student/Staff ID',
    'Assigned To',
    'Upvotes',
    'Created At',
    'Updated At',
    'Resolved At',
    'Description',
    'Admin Notes'
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = tickets.map((t) => [
    escapeCSV(t.id),
    escapeCSV(t.title),
    escapeCSV(t.category),
    escapeCSV(t.priority),
    escapeCSV(t.status),
    escapeCSV(t.location),
    escapeCSV(t.submitterName),
    escapeCSV(t.submitterEmail),
    escapeCSV(t.submitterId),
    escapeCSV(t.assignedTo),
    escapeCSV(t.upvotes),
    escapeCSV(t.createdAt),
    escapeCSV(t.updatedAt),
    escapeCSV(t.resolvedAt || 'N/A'),
    escapeCSV(t.description),
    escapeCSV(t.adminNotes)
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `campus_helpdesk_tickets_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
