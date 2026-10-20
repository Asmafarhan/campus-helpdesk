---
name: campus-helpdesk
description: Operational guide and engineering standards for the Campus Helpdesk React application, including component design, accessibility, form validation, ticket lifecycle management, metrics calculation, and build verification.
---

# Campus Helpdesk Agent Skill

This skill defines development standards, architectural patterns, and validation workflows for maintaining and enhancing the **Campus Helpdesk** React project.

---

## 1. Writing Clean, Reusable React Components

- **Single Responsibility Principle**: Each component must have a focused responsibility (e.g., presentation badge, detail modal, filtered feed, or statistical card).
- **Component Decomposition**:
  - Keep atomic UI units modular and extracted into `src/components/` (e.g., `StatusBadge.jsx`, `PriorityBadge.jsx`, `Toast.jsx`).
  - Separate stateful container views (e.g., `AdminDashboard.jsx`, `IssueForm.jsx`) from pure presentational components.
- **Props Design & Immutability**:
  - Use explicit prop destructuring with sensible defaults.
  - Never mutate props or state objects directly; always return new references when updating lists or ticket objects (e.g., `tickets.map(t => t.id === id ? { ...t, ...updates } : t)`).
- **Avoid Duplication & Leverage Constants**:
  - Import canonical datasets and configuration options directly from `src/constants/initialData.js` (`CATEGORIES`, `PRIORITIES`, `STATUSES`).
  - Avoid hardcoding category names, priority levels, or status labels across disparate components.
- **Hooks & Side Effects**:
  - Adhere strictly to React hooks rules. Avoid unnecessary `useEffect` calls; compute derived values (such as filtered lists or summary metrics) synchronously during render.

---

## 2. Creating Responsive and Accessible UI

- **Semantic HTML**:
  - Structure layouts with semantic tags (`<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<aside>`).
  - Use `<button type="button">` for non-submitting clickable elements rather than non-semantic `<div>` or `<span>` click handlers.
- **Form Accessibility (a11y)**:
  - Every form input, select, and textarea must have an associated `<label>` linked via matching `htmlFor` and `id` attributes.
  - Connect error messages to inputs using `aria-invalid={Boolean(errors[field])}` and `aria-describedby={`${field}-error`}`.
  - Use `aria-required="true"` on mandatory form fields.
- **Keyboard Navigation & Focus Management**:
  - Ensure all interactive cards, filters, and buttons are keyboard accessible via `Tab` and activatable via `Enter` / `Space`.
  - For modals (such as `IssueDetailModal.jsx`), trap focus when open, support the `Escape` key to close, and restore focus to the triggering element upon dismissal.
- **Screen Reader & Live Regions**:
  - Announce transient status updates and toast alerts dynamically with `role="status"` or `aria-live="polite"`.
- **Responsive Design**:
  - Support viewports ranging from mobile phones (320px+) to wide desktop monitors using fluid CSS Grid (`stats-grid`) and Flexbox layouts.
  - Ensure tap targets on mobile measure at least 44x44px.
  - Verify that modal dialogs and data tables adapt gracefully with horizontal overflow scrolling or stacked views on small screens.

---

## 3. Validating Student Issue Forms

Forms submitted by students and campus members must pass strict validation before being committed to persistent storage or state:

- **Validation Rules**:
  - **Issue Title**: Mandatory, trimmed length must be at least 6 characters (e.g., `"High-speed Wi-Fi dropping intermittently"`).
  - **Category**: Mandatory, must match one of the predefined entries in `CATEGORIES`.
  - **Campus Location**: Mandatory, trimmed string specifying building, room number, or physical landmark.
  - **Submitter Name**: Mandatory, non-empty full name.
  - **Campus Email**: Mandatory, validated against standard email pattern (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`) to ensure follow-up notifications reach the student.
  - **Problem Description**: Mandatory, trimmed length must be at least 15 characters to provide sufficient detail for campus dispatch teams.
  - **Image Attachments**: Optional; if provided, validate that MIME type begins with `image/` and total file size does not exceed 3MB.
- **User Experience Standards**:
  - Display inline error messages directly underneath the offending input field.
  - Clear errors dynamically as the user types or corrects the corresponding field.
  - Disable submission buttons while processing to prevent duplicate tickets.

---

## 4. Managing Ticket Lifecycle: Pending, In Progress, and Resolved

Every campus helpdesk ticket transitions through a clearly defined lifecycle:

- **Allowed Statuses**:
  - `Pending`: Newly submitted ticket awaiting administrative triage or technician dispatch.
  - `In Progress`: Technician or campus department has been assigned and repairs/investigation are actively underway.
  - `Resolved`: Issue has been addressed and rectified.
- **State Transition Rules**:
  - Always validate status updates against `['Pending', 'In Progress', 'Resolved']`.
  - **Timestamps**:
    - Update `updatedAt` to `new Date().toISOString()` on any modification.
    - When moving status to `Resolved`, set `resolvedAt: new Date().toISOString()`.
    - If a ticket is reopened from `Resolved` back to `Pending` or `In Progress`, reset `resolvedAt: null`.
  - **Administrative Notes & Assignment**:
    - Allow administrators to append notes explaining status changes (e.g., parts ordered, technician dispatched).
    - Maintain the integrity of `assignedTo` when tickets are marked `In Progress`.
- **Persistence**:
  - Sync state transitions immediately to local storage via `src/utils/storage.js` so user session changes persist across reloads.

---

## 5. Keeping Dashboard Statistics Accurate

Dashboard metrics provide visibility into campus maintenance operations. All statistics must be computed accurately from the canonical ticket collection:

- **Calculations**:
  - **Total Tickets**: `tickets.length`
  - **Pending Count**: `tickets.filter(t => t.status === 'Pending').length`
  - **In Progress Count**: `tickets.filter(t => t.status === 'In Progress').length`
  - **Resolved Count**: `tickets.filter(t => t.status === 'Resolved').length`
  - **Resolution Rate**: If total > 0, `Math.round((resolved / total) * 100)`, otherwise `0`.
  - **Active High / Urgent Count**: `tickets.filter(t => t.status !== 'Resolved' && (t.priority === 'Urgent' || t.priority === 'High')).length`
  - **Category Breakdown**: Group count of tickets by `category` and accurately compute category-specific percentage of total.
- **Integrity Guidelines**:
  - Never compute dashboard summary stats against a filtered or searched subset of tickets. Summary cards must reflect the entire active dataset.
  - When filtering the issue feed by status (e.g., clicking on the "Pending" stat card), update the feed view without altering the underlying dashboard totals.

---

## 6. Testing Changes and Running Build Verification

Whenever making changes to components, styles, or utilities, complete the following verification steps:

- **Static Analysis & Linting**:
  ```bash
  npm run lint
  ```
  Ensure all ESLint warnings and errors are resolved.
- **Production Build**:
  ```bash
  npm run build
  ```
  Execute `vite build` to guarantee:
  - Valid JSX syntax and imports across all modules.
  - Zero bundling errors or missing dependencies.
  - Clean asset generation in `dist/`.
- **Manual Feature Verification**:
  - Test submitting a valid issue and an invalid issue (verify validation messages).
  - Test changing a ticket's status through `Pending` -> `In Progress` -> `Resolved`.
  - Confirm dashboard counter cards increment and decrement accurately in real time.
  - Test responsive layout switching between mobile and desktop screen sizes.

---

## 7. Reporting Errors Honestly

Transparency is essential when maintaining codebases and reporting issues:

- **Do Not Mask Failures**: If `npm run build` or `npm run lint` fails, do not conceal the failure or claim the build was successful.
- **Detailed Error Analysis**:
  - Provide the exact command executed, exit code, and relevant terminal/stack trace output.
  - Identify the specific file, component, or line of code responsible for the failure.
  - Explain the root cause clearly and detail the exact remediation steps taken to resolve it.
- **Data Integrity Issues**: If local storage corruption, invalid ticket schemas, or negative counter values are detected, report them explicitly rather than silently dropping data.

