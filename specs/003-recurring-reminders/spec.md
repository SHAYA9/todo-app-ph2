# Feature Specification: Advanced Features (Recurring Tasks & Notifications)

**Feature Branch**: `003-recurring-reminders`
**Created**: 2025-12-30
**Status**: Draft
**Input**: User description: "Phase: 2.3 – Advanced Features (Extension Only) Context: This specification EXTENDS Phase 2 without modifying or deleting existing functionality from Phase 2.1 (Basic) and Phase 2.2 (Intermediate). New Features: 1. Recurring Tasks: - Tasks can be marked as recurring - Supported types: - daily - weekly - monthly - When a recurring task is completed: - system automatically creates the next instance - previous task is archived, not overwritten - Recurrence can be stopped anytime 2. Due Date & Time: - Tasks may have: - due_date - due_time - Date & time picker in UI - Tasks without due date remain valid 3. Reminders & Browser Notifications: - Browser notifications using Web Notifications API - Trigger: - at due time - optional reminder offset - Notifications work only when browser is open - Graceful fallback if permission denied 4. Agentic Dev Stack Usage: - Spec-Kit Plus used for planning, task generation, and implementation - Logical separation between: - Scheduling logic - Notification logic - UI logic - No background jobs or cron services Constraints: - No auth - No emails or push services - Backward compatibility must be preserved Goal: Add intelligent automation while keeping the app simple and stable."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Define Recurring Task (Priority: P1)
As a user, I want to mark a task as recurring (daily, weekly, monthly) so it automatically generates future instances.

**Why this priority**: Essential for setting up automated task management.

**Independent Test**: A user can create a task, set its recurrence type, and upon completion, observe a new instance being created.

**Acceptance Scenarios**:
1. **Given** the task creation/update form is open, **When** the user selects a recurrence type (Daily, Weekly, or Monthly) for a task, **Then** the task is saved with the specified recurrence.
2. **Given** a task is marked as recurring, **When** the user views the task, **Then** the recurrence type is displayed.

---

### User Story 2 - Complete Recurring Task (Priority: P1)
As a user, when I complete a recurring task, I want a new instance to be automatically created for the next period, and the completed one to be archived.

**Why this priority**: Automates task management and prevents data loss.

**Independent Test**: Completing a recurring task in the UI results in a new instance and the original being archived.

**Acceptance Scenarios**:
1. **Given** an active recurring task, **When** the user marks it as completed, **Then** a new task instance is created with the next due date/time, and the original task is marked as archived.
2. **Given** a recurring task, **When** the user marks it as completed, **Then** the archived task is no longer considered "active" for notifications or general viewing unless specifically filtered for.

---

### User Story 3 - Set Due Date & Time (Priority: P1)
As a user, I want to set both a specific date and time for a task's due date to be more precise.

**Why this priority**: Enhances task precision and scheduling capabilities.

**Independent Test**: The user can set a specific date and time for a task and see it saved and displayed correctly.

**Acceptance Scenarios**:
1. **Given** the task creation/update form, **When** the user selects a date and time using the UI picker, **Then** the task's `due_datetime` is saved with both date and time components.
2. **Given** a task with a `due_datetime`, **When** the user views the task, **Then** both the date and time are displayed.
3. **Given** a task without a `due_datetime`, **When** the user views the task, **Then** it remains valid and displays no due date/time.

---

### User Story 4 - Receive Browser Notification (Priority: P2)
As a user, I want to receive a browser notification when a task's due time arrives (with optional offset) so I don't miss deadlines.

**Why this priority**: Provides proactive reminders for deadlines.

**Independent Test**: A browser notification appears for a task at its due time when the browser is open.

**Acceptance Scenarios**:
1. **Given** a task with a `due_datetime` set and notification permission granted, **When** the current time reaches the `due_datetime` (or optional offset), **Then** a browser notification is displayed.
2. **Given** notification permission is denied, **When** a task's `due_datetime` arrives, **Then** no browser notification is displayed, but the application continues to function.

---

### User Story 5 - Stop Recurrence (Priority: P2)
As a user, I want to stop the recurrence of a task so no new instances are created.

**Why this priority**: Allows control over automated task generation.

**Independent Test**: Disabling recurrence for a task prevents new instances from being generated upon its completion.

**Acceptance Scenarios**:
1. **Given** an active recurring task, **When** the user disables its recurrence in the update form, **Then** no new task instance is created when the task is completed.
2. **Given** a task's recurrence is stopped, **When** the user views the task, **Then** it is no longer indicated as recurring.

### Edge Cases

- What happens if the `due_datetime` is in the past when a notification is attempted? (Notification should not trigger or trigger immediately if still relevant).
- How is time zone handled for `due_datetime` and notifications? (Assume UTC for backend, convert to local for UI).
- What if a recurring task is completed but the browser is closed? (No notification, new instance still created on backend).
- What if recurrence is stopped mid-cycle (e.g., weekly task completed on Tuesday, stopped, but new instance due next Tuesday)? (Ensure no new instance is created).

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The system MUST allow tasks to be marked with a `recurrence_type`: "daily", "weekly", or "monthly".
- **FR-002**: Upon completion of a task with a `recurrence_type`, the system MUST automatically create a new task instance for the next recurrence period.
- **FR-003**: The original completed recurring task instance MUST be archived (e.g., via an `is_archived` flag) instead of being deleted or modified.
- **FR-004**: The system MUST provide a mechanism for users to stop the recurrence of a task.
- **FR-005**: Tasks MUST support a single `due_datetime` field (combining date and time).
- **FR-006**: The frontend UI MUST provide an integrated date and time picker for setting the `due_datetime`.
- **FR-007**: The system MUST support browser notifications using the Web Notifications API.
- **FR-008**: Notifications MUST be triggered when the `due_datetime` (minus an optional reminder offset) is reached, and the browser is open.
- **FR-009**: The frontend MUST request and manage browser notification permissions, providing a graceful fallback if denied.
- **FR-010**: The backend `Task` model MUST be extended to include `recurrence_type`, `recurrence_id` (to group instances), `is_archived` (boolean), and `due_datetime`.
- **FR-011**: Backend CRUD endpoints MUST be updated to support the new `recurrence_type`, `due_datetime`, and `is_archived` fields.
- **FR-012**: The backend MUST expose an API endpoint (e.g., `/tasks/upcoming`) to retrieve tasks due soon, for frontend notification logic.
- **FR-013**: The database schema for the `tasks` table MUST be updated to accommodate `recurrence_type`, `recurrence_id`, `is_archived`, and `due_datetime` without data loss for existing fields.
- **FR-014**: SQLModel-compatible database migrations MUST be used to apply schema changes.
- **FR-015**: Logical separation MUST be maintained between scheduling logic (backend), notification logic (frontend), and UI logic (frontend).
- **FR-016**: All existing functionality from Phase 2.1 (Basic) and 2.2 (Intermediate) MUST remain operational and backward compatible.

### Key Entities *(include if feature involves data)*
- **Task**: Represents a single to-do item.
    - **Attributes (existing)**:
        - `id`: Unique identifier (integer).
        - `title`: Description of the task (string, required).
        - `completed`: Status of task (boolean, default false).
        - `priority`: Task importance (enum: "high", "medium", "low", default "medium").
        - `tags`: Categorization labels (list of strings, default empty).
        - `due_date`: Optional completion deadline (date/datetime, now `due_datetime`).
        - `created_at`: Timestamp of creation.
        - `updated_at`: Timestamp of last update.
    - **Attributes (new)**:
        - `recurrence_type`: Type of recurrence (enum: "daily", "weekly", "monthly", default `None`).
        - `recurrence_id`: Optional string/UUID to group instances of a recurring task.
        - `is_archived`: Boolean flag indicating if a task is an archived instance of a recurring task (default `false`).
        - `due_datetime`: Combined date and time for task due (optional datetime). Replaces `due_date`.

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: Users can successfully create, complete, and stop tasks with daily, weekly, or monthly recurrence patterns.
- **SC-002**: Completing a recurring task automatically archives the original and creates a new instance for the next cycle within 1 second.
- **SC-003**: Users can set and view precise due dates and times for tasks using an integrated UI picker.
- **SC-004**: Users receive browser notifications for 95% of tasks at their due time (or offset) when the browser is open and permissions are granted.
- **SC-005**: All existing functionality (basic CRUD, enhanced details, search, filter, sort) from previous phases remains fully operational, including with tasks that have new recurring/due_datetime properties.
- **SC-006**: The application codebase maintains clear logical separation between scheduling, notification, and UI components, as verified by code review.