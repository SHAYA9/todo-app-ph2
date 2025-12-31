# Implementation Plan: Advanced Features (Recurring Tasks & Notifications)

**Branch**: `003-recurring-reminders` | **Date**: 2025-12-30 | **Spec**: [specs/003-recurring-reminders/spec.md]
**Input**: Feature specification from `/specs/003-recurring-reminders/spec.md`

## Summary

This plan outlines the implementation of advanced features for the Todo application, including recurring tasks, precise due date and time management, and browser notifications. It extends existing functionality from previous phases (Basic and Intermediate) without introducing breaking changes, focusing on client-side notification logic and backend support for recurrence.

## Technical Context

**Language/Version**: Python 3.11, TypeScript
**Primary Dependencies**: FastAPI, SQLModel, Next.js, Neon PostgreSQL
**Storage**: PostgreSQL
**Testing**: Manual UI testing for recurring tasks flow, due date/time setting, and browser notifications. API validation via Swagger. Verification of database migration correctness and backward compatibility.
**Target Platform**: Web
**Project Type**: Web application
**Performance Goals**: Recurring task creation/archival within 1 second. Notifications delivered within seconds of due time. Existing functionality performance maintained.
**Constraints**: No authentication, no email or push services, strict backward compatibility with Phase 2.1 and 2.2 functionality. No backend background jobs or cron services for notifications.
**Scale/Scope**: Advanced feature extension for a single-user application.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] I. Strict Spec-Driven Development (All changes driven by this spec)
- [x] II. Simplicity Over Completeness (Focus on requested features, avoid unnecessary complexity)
- [x] III. Clear Separation of Concerns (Scheduling/Notification/UI logic clearly separated)
- [x] IV. Deterministic and Predictable Behavior (Recurrence and notifications should behave predictably)
- [x] V. Clean and Maintainable Code (Ensured by structured development and logical separation)
- [x] VI. Minimal and Clean UI (New UI controls integrated cleanly)
- [x] VII. Consistency (UI elements for new features will be consistent)
- [x] VIII. Clear Calls-to-Action (New UI controls will have clear CTAs)
- [x] IX. Responsive Layout (New UI components will be responsive)
- [x] X. Lightweight Styling (No heavy UI frameworks for new components)
- [x] XI. Frontend Technology: Next.js (Used for frontend enhancements)
- [x] XII. Backend Technology: FastAPI (Used for backend enhancements)
- [x] XIII. Database: PostgreSQL (Neon) (Used for schema updates)
- [x] XIV. ORM: SQLModel (Used for model extensions and migrations)
- [x] XV. Environment-based Configuration (Continued for new environment variables if any)

## Project Structure

### Documentation (this feature)

```text
specs/003-recurring-reminders/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── openapi.json
└── tasks.md             # Phase 2 output (to be generated)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── main.py
│   ├── crud.py          # Updated for recurrence logic, upcoming tasks
│   ├── models.py        # Task model extended (recurrence_type, recurrence_id, is_archived, due_datetime)
│   ├── schemas.py       # Pydantic schemas updated
│   └── database.py
└── tests/

frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── components/      # New/updated components for recurrence, date/time picker
│   │   ├── TaskList.tsx
│   │   ├── AddTask.tsx
│   │   └── TasksPage.tsx
│   ├── services/
│   │   └── api.ts       # API client updated for new endpoints/params
│   ├── utils/           # New utility for client-side notification scheduling
│   │   └── notifications.ts
│   └── types/
│       └── Task.ts      # Task type updated
└── tests/
```

**Structure Decision**: The existing web application structure will be maintained. A new `frontend/src/utils` directory will be added for notification-related logic.

## Complexity Tracking

No violations to the constitution have been identified.

## Decisions Needing Documentation

-   **Recurrence Logic**: The backend will handle the generation of the next recurring task instance upon completion of the current one. This ensures data integrity and consistency regardless of frontend state.
-   **Notification Scheduling**: All reminder and browser notification scheduling will be handled entirely on the client-side (frontend). This aligns with the constraint of "No background jobs or cron services" and "Notifications work only when browser is open".
-   **Due Date & Time Storage**: `due_date` and `due_time` will be combined and stored as a single `datetime` object (`due_datetime`) in the database. This simplifies backend handling and API contracts.
-   **Archiving Recurring Tasks**: Completed recurring tasks will be marked with an `is_archived` boolean flag rather than being deleted. A `recurrence_id` (UUID) will link instances of the same recurring task.
-   **Frontend Date/Time Picker**: Utilize a single, integrated UI component for selecting both date and time to improve user experience.
-   **Backward Compatibility**: All new fields (`recurrence_type`, `recurrence_id`, `is_archived`, `due_datetime`) will be optional during creation/update for existing CRUD endpoints to ensure backward compatibility. Existing tasks will default to non-recurring and not archived.