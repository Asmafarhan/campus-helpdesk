export const CATEGORIES = [
  'Facilities & Maintenance',
  'IT & Campus Wi-Fi',
  'Hostel & Housing',
  'Academic & Classrooms',
  'Library & Study Spaces',
  'Cafeteria & Dining',
  'Security & Safety',
  'Sanitation & Hygiene',
  'Other'
];

export const PRIORITIES = [
  { value: 'Low', label: 'Low', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  { value: 'Medium', label: 'Medium', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  { value: 'High', label: 'High', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  { value: 'Urgent', label: 'Urgent', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' }
];

export const STATUSES = [
  { value: 'Pending', label: 'Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
  { value: 'In Progress', label: 'In Progress', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)' },
  { value: 'Resolved', label: 'Resolved', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' }
];

export const INITIAL_TICKETS = [
  {
    id: 'CHD-1001',
    title: 'High-speed Wi-Fi dropping intermittently on 3rd Floor',
    category: 'IT & Campus Wi-Fi',
    priority: 'High',
    status: 'In Progress',
    location: 'Central Library, 3rd Floor Quiet Zone',
    submitterName: 'Aarav Sharma',
    submitterEmail: 'aarav.sharma@campus.edu',
    submitterId: 'STU-2024-8841',
    description: 'The Wi-Fi access point near the north study desks constantly drops connections every 5-10 minutes, disrupting students preparing for midterms.',
    adminNotes: 'Network technician dispatched. Diagnosed faulty PoE switch port; replacement scheduled for 3:00 PM today.',
    assignedTo: 'Campus IT Network Operations',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(), // 36 hrs ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    resolvedAt: null,
    upvotes: 18
  },
  {
    id: 'CHD-1002',
    title: 'Air conditioning water leakage near projector in Lecture Hall B',
    category: 'Facilities & Maintenance',
    priority: 'Urgent',
    status: 'Pending',
    location: 'Science Complex, Lecture Hall B',
    submitterName: 'Prof. Elena Vance',
    submitterEmail: 'e.vance@campus.edu',
    submitterId: 'FAC-1042',
    description: 'Ceiling AC unit is actively dripping water onto the podium and near the power cables of the main ceiling projector. Needs immediate attention to prevent electrical damage.',
    adminNotes: 'Ticket received and queued for urgent facility dispatch.',
    assignedTo: 'HVAC Maintenance Team',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hrs ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    resolvedAt: null,
    upvotes: 9
  },
  {
    id: 'CHD-1003',
    title: 'Water filtration station displaying filter change alert',
    category: 'Sanitation & Hygiene',
    priority: 'Medium',
    status: 'Resolved',
    location: 'Hostel Block 4, Ground Floor Common Room',
    submitterName: 'Marcus Chen',
    submitterEmail: 'm.chen@campus.edu',
    submitterId: 'STU-2023-3912',
    description: 'The primary UV drinking water dispenser is flashing a red "Filter Exhausted" indicator and water flow has significantly slowed down.',
    adminNotes: 'Replaced multi-stage carbon and RO cartridge. Water quality tested and TDS levels verified normal at 42 ppm.',
    assignedTo: 'Campus Sanitation & Water Services',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    upvotes: 14
  },
  {
    id: 'CHD-1004',
    title: 'Broken desk armrests in Computer Lab 302',
    category: 'Academic & Classrooms',
    priority: 'Low',
    status: 'In Progress',
    location: 'Engineering Building, Computer Lab 302',
    submitterName: 'Priya Patel',
    submitterEmail: 'priya.p@campus.edu',
    submitterId: 'STU-2025-1109',
    description: 'Seats #14, #15, and #22 have broken or wobbling armrests with exposed sharp metal brackets.',
    adminNotes: 'Carpentry unit ordered replacement parts. Temporary warning tape applied on damaged chairs.',
    assignedTo: 'Campus Facilities Woodworking',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    resolvedAt: null,
    upvotes: 4
  },
  {
    id: 'CHD-1005',
    title: 'Cafeteria POS terminal offline causing massive queues',
    category: 'Cafeteria & Dining',
    priority: 'High',
    status: 'Resolved',
    location: 'Student Center Food Court, Counter 2',
    submitterName: 'David Kim',
    submitterEmail: 'd.kim@campus.edu',
    submitterId: 'STAFF-892',
    description: 'Student campus card swipe reader keeps timing out with error 404. Lunch rush lines extended to the building exit.',
    adminNotes: 'Network gateway was reconfigured and card reader firmware updated. All transactions processing normally.',
    assignedTo: 'Campus Dining Services & IT',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
    upvotes: 27
  },
  {
    id: 'CHD-1006',
    title: 'Pathway light flickering near West Gate parking lot',
    category: 'Security & Safety',
    priority: 'Medium',
    status: 'Pending',
    location: 'West Gate Walkway, Lamp post #18',
    submitterName: 'Sarah Jenkins',
    submitterEmail: 's.jenkins@campus.edu',
    submitterId: 'STU-2024-5501',
    description: 'The street lamp near the bicycle stands flickers constantly after 7 PM, leaving the walkway very dark and raising safety concerns for evening commuters.',
    adminNotes: 'Work order #8849 logged. Waiting for evening inspection round.',
    assignedTo: 'Electrical Maintenance',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 15).toISOString(),
    resolvedAt: null,
    upvotes: 8
  }
];
