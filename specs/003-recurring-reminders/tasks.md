# Tasks: Advanced Features (Recurring Tasks & Notifications)

**Input**: Design documents from `/specs/003-recurring-reminders/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested, so I will not generate test tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/`, `frontend/src/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare frontend for new types and utilities.

- [x] T001 Define `RecurrenceTypeEnum` in `frontend/src/types/Task.ts`
- [x] T002 Update `Task` interface in `frontend/src/types/Task.ts` with `recurrence_type`, `recurrence_id`, `is_archived`, `due_datetime`
- [x] T003 [P] Create `frontend/src/utils` directory
- [x] T004 Install `uuid` library in frontend for `recurrence_id` generation (if client-side generation is needed)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure updates for advanced features.

- [x] T005 Define `RecurrenceTypeEnum` in `backend/app/models.py`
- [x] T006 Update `Task` model in `backend/app/models.py` to include `recurrence_type`, `recurrence_id`, `is_archived`, `due_datetime`
- [x] T007 Update `Task` schemas (`TaskBase`, `TaskCreate`, `TaskUpdate`, `TaskInDB`) in `backend/app/schemas.py` to reflect new fields and `RecurrenceTypeEnum`
- [x] T008 Update `get_tasks`, `create_task`, `update_task` in `backend/app/crud.py` to handle `is_archived` status in queries (default to not showing archived)
- [x] T009 Implement SQLModel-compatible database migration for new fields (manual schema update or use `alembic`)

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Define Recurring Task (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to mark a task as recurring (daily, weekly, monthly).

**Independent Test**: User can create/update a task with a recurrence type, and it's displayed correctly.

### Implementation for User Story 1

- [x] T010 [US1] Update `AddTask.tsx` (`frontend/src/components/AddTask.tsx`) to include a dropdown for `recurrence_type`
- [x] T011 [US1] Update `createTask` in `frontend/src/services/api.ts` to send `recurrence_type` to API
- [x] T012 [US1] Update `TaskList.tsx` (`frontend/src/components/TaskList.tsx`) to display `recurrence_type`
- [x] T013 [US1] Update `updateTask` in `frontend/src/services/api.ts` to send `recurrence_type` to API (for inline editing)
- [x] T014 [US1] Update `TaskList.tsx` (`frontend/src/components/TaskList.tsx`) to include UI controls for editing `recurrence_type`

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Complete Recurring Task (Priority: P1)

**Goal**: When completing a recurring task, a new instance is created, and the original is archived.

**Independent Test**: Completing a recurring task in the UI creates a new instance and archives the original.

### Implementation for User Story 2

- [x] T015 [US2] Modify `update_task` logic in `backend/app/crud.py` to:
    - If `completed` is set to `True` for a recurring task:
        - Generate a new `recurrence_id` (if not already present).
        - Create a new task instance with calculated next `due_datetime` and same details.
        - Mark original task `is_archived=True`.
- [x] T016 [US2] Update `TaskList.tsx` (`frontend/src/components/TaskList.tsx`) to handle completing recurring tasks.

**Checkpoint**: User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Set Due Date & Time (Priority: P1)

**Goal**: As a user, I want to set both a specific date and time for a task's due date.

**Independent Test**: User sets date and time for a task, and it's saved and displayed correctly.

### Implementation for User Story 3

- [x] T017 [US3] Update `AddTask.tsx` (`frontend/src/components/AddTask.tsx`) to replace date input with `datetime-local` picker for `due_datetime`
- [x] T018 [US3] Update `TaskList.tsx` (`frontend/src/components/TaskList.tsx`) to display `due_datetime` with both date and time
- [x] T019 [US3] Update `createTask` and `updateTask` in `frontend/src/services/api.ts` to send/receive `due_datetime` correctly
- [x] T020 [US3] Update `TaskList.tsx` (`frontend/src/components/TaskList.tsx`) to include UI controls for editing `due_datetime`

**Checkpoint**: User Stories 1, 2, AND 3 should all work independently.

---

## Phase 6: User Story 4 - Receive Browser Notification (Priority: P2)

**Goal**: As a user, I want to receive browser notifications for due tasks.

**Independent Test**: Browser notification appears for a task at due time.

### Implementation for User Story 4

- [x] T021 [US4] Implement `GET /tasks/upcoming` endpoint in `backend/app/main.py` and `backend/app/crud.py` to fetch non-archived, non-completed tasks due within a given `minutes_offset`.
- [x] T022 [US4] Create `frontend/src/utils/notifications.ts` for notification permission handling and scheduling logic.
- [x] T023 [US4] Integrate notification logic into `TasksPage.tsx` (`frontend/src/components/TasksPage.tsx`) to request permission and periodically check `/tasks/upcoming`.

**Checkpoint**: User Story 4 should be fully functional and testable independently.

---

## Phase 7: User Story 5 - Stop Recurrence (Priority: P2)

**Goal**: As a user, I want to stop the recurrence of a task.

**Independent Test**: Disabling recurrence prevents new instances.

### Implementation for User Story 5

- [x] T024 [US5] Update `AddTask.tsx`/`TaskList.tsx` (`frontend/src/components/AddTask.tsx`, `frontend/src/components/TaskList.tsx`) with a UI control (e.g., checkbox, toggle) to disable recurrence.
- [x] T025 [US5] Update `updateTask` in `frontend/src/services/api.ts` to send `recurrence_type=None` (or empty) to API.
- [x] T026 [US5] Modify `update_task` in `backend/app/crud.py` to handle `recurrence_type=None` to stop recurrence.

**Checkpoint**: User Story 5 should be fully functional and testable independently.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation.

- [x] T027 [P] Review and refine UI/UX for all new controls in `frontend/src/components/` (especially date/time picker, recurrence options).
- [x] T028 [P] Add more robust error handling and user feedback for new features on both frontend and backend.
- [x] T029 Update `quickstart.md` with any new setup/run instructions and specific migration notes.
- [x] T030 Run `quickstart.md` validation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Stories (Phases 3-7)**: Depend on Foundational.
    - User Stories P1 (Phases 3-5) can start immediately after Foundational.
    - User Stories P2 (Phases 6-7) can start after P1s or in parallel.
- **Polish (Phase 8)**: Depends on all User Stories.

### User Story Dependencies

- All user stories (Phases 3-7) are designed to be largely independent once the Foundational Phase (Phase 2) is complete. They can be implemented in parallel or in priority order.

### Within Each User Story

- Backend tasks typically precede frontend tasks.
- Data model/schema updates (Foundational) precede CRUD modifications.
- API endpoint modifications precede API client updates.
- API client updates precede UI component updates.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel.
- Frontend UI components and their corresponding API client updates for different user stories can be worked on in parallel after the backend endpoints are stable.

---

## Implementation Strategy

### Incremental Delivery (P1 MVP First)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Define Recurring Task)
4. Complete Phase 4: User Story 2 (Complete Recurring Task)
5. Complete Phase 5: User Story 3 (Set Due Date & Time)
6. **STOP and VALIDATE**: Verify enhanced CRUD and viewing of recurring/time tasks.
7. Proceed with P2 user stories (Phases 6-7), then Polish (Phase 8).

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done, developers can work on different user stories (Phases 3-7) in parallel.
3. Polish phase can be done collaboratively at the end.
