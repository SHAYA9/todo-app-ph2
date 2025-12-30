# Tasks: Task Enhancements (Intermediate Level)

**Input**: Design documents from `/specs/002-task-enhancements/`
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

**Purpose**: Update existing project configuration for new features.

- [x] T001 [P] Add `str` for priority to `backend/app/schemas.py`
- [x] T002 [P] Update `frontend/types/Task.ts` with `priority`, `tags`, `due_date`
- [x] T003 [P] Update `frontend/services/api.ts` base API URL if necessary (not directly related to new feature but a common setup step if moving to dynamic URLs or env vars)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure updates to support task enhancements.

- [x] T004 Define `PriorityEnum` in `backend/app/models.py`
- [x] T005 Update `Task` model in `backend/app/models.py` to include `priority`, `tags`, `due_date`
- [x] T006 Update `Task` schema in `backend/app/schemas.py` to reflect new fields and `PriorityEnum`
- [x] T007 Update `TaskCreate` schema in `backend/app/schemas.py` for `priority`, `tags`, `due_date`
- [x] T008 Update `TaskUpdate` schema in `backend/app/schemas.py` for `priority`, `tags`, `due_date`
- [x] T009 Update `get_tasks`, `create_task`, `update_task` functions in `backend/app/crud.py` to handle new fields and their defaults
- [x] T010 Implement SQLModel-compatible database migration for new fields (manual schema update or use `alembic`)

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - View Tasks with Enhanced Details (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to see tasks with their priority, tags, and an optional due date.

**Independent Test**: User views the task list and sees all enhanced task details.

### Implementation for User Story 1

- [x] T011 [US1] Update `TaskList.tsx` (`frontend/src/components/TaskList.tsx`) to display `priority`, `tags`, `due_date`
- [x] T012 [US1] Update `getTasks` in `frontend/src/services/api.ts` to expect `priority`, `tags`, `due_date` from API response

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Add a Task with Enhanced Details (Priority: P1)

**Goal**: As a user, I want to be able to add new tasks specifying their priority, tags, and an optional due date.

**Independent Test**: User adds a new task with enhanced details, and it appears correctly in the list.

### Implementation for User Story 2

- [x] T013 [US2] Update `AddTask.tsx` (`frontend/src/components/AddTask.tsx`) to include UI controls for `priority`, `tags`, `due_date`
- [x] T014 [US2] Update `createTask` in `frontend/src/services/api.ts` to send `priority`, `tags`, `due_date` to API

**Checkpoint**: User Stories 1 AND 2 should both work independently.

---

## Phase 5: User Story 3 - Update a Task with Enhanced Details (Priority: P1)

**Goal**: As a user, I want to be able to modify the priority, tags, and due date of existing tasks.

**Independent Test**: User edits an existing task's priority, tags, and due date, and changes are reflected.

### Implementation for User Story 3

- [x] T015 [US3] Update `TaskList.tsx` (`frontend/src/components/TaskList.tsx`) to include UI controls for editing `priority`, `tags`, `due_date` (potentially inline editing or a modal)
- [x] T016 [US3] Update `updateTask` in `frontend/src/services/api.ts` to send `priority`, `tags`, `due_date` to API

**Checkpoint**: User Stories 1, 2, AND 3 should all work independently.

---

## Phase 6: User Story 4 - Search Tasks (Priority: P2)

**Goal**: As a user, I want to search for tasks by keywords in their title.

**Independent Test**: User enters a keyword and sees the task list dynamically update.

### Implementation for User Story 4

- [x] T017 [US4] Modify `GET /tasks` endpoint in `backend/app/main.py` to accept `search` query parameter
- [x] T018 [US4] Implement `search` logic in `get_tasks` within `backend/app/crud.py`
- [x] T019 [US4] Add a search input component to `frontend/src/components/TasksPage.tsx`
- [x] T020 [US4] Update `getTasks` in `frontend/src/services/api.ts` to pass the `search` query parameter

**Checkpoint**: User Story 4 should be fully functional and testable independently.

---

## Phase 7: User Story 5 - Filter Tasks (Priority: P2)

**Goal**: As a user, I want to filter tasks by completion status, priority, or due date presence.

**Independent Test**: User applies filters and sees only tasks matching criteria.

### Implementation for User Story 5

- [x] T021 [US5] Modify `GET /tasks` endpoint in `backend/app/main.py` to accept `completed`, `priority`, `has_due_date` query parameters
- [x] T022 [US5] Implement `filter` logic in `get_tasks` within `backend/app/crud.py`
- [x] T023 [US5] Add filter controls to `frontend/src/components/TasksPage.tsx`
- [x] T024 [US5] Update `getTasks` in `frontend/src/services/api.ts` to pass filter parameters

**Checkpoint**: User Story 5 should be fully functional and testable independently.

---

## Phase 8: User Story 6 - Sort Tasks (Priority: P2)

**Goal**: As a user, I want to sort tasks by title, priority, or due date.

**Independent Test**: User applies a sort order and sees the task list reordered correctly.

### Implementation for User Story 6

- [x] T025 [US6] Modify `GET /tasks` endpoint in `backend/app/main.py` to accept `sort_by`, `sort_order` query parameters
- [x] T026 [US6] Implement `sort` logic in `get_tasks` within `backend/app/crud.py`
- [x] T027 [US6] Add sort controls to `frontend/src/components/TasksPage.tsx`
- [x] T028 [US6] Update `getTasks` in `frontend/src/services/api.ts` to pass sort parameters

**Checkpoint**: User Story 6 should be fully functional and testable independently.

---

## Phase 9: User Story 7 - Combine Filters and Sorting (Priority: P3)

**Goal**: As a user, I want to combine multiple filters and sorting options.

**Independent Test**: User applies combined filters and sorting, and results are accurate.

### Implementation for User Story 7

- [x] T029 [US7] Verify combined search, filter, and sort logic in `backend/app/crud.py` and `backend/app/main.py`
- [x] T030 [US7] Ensure `frontend/src/components/TasksPage.tsx` effectively integrates all search, filter, and sort controls
- [x] T031 [US7] Validate performance with combined parameters in `frontend/src/services/api.ts`

**Checkpoint**: User Story 7 should be fully functional and testable independently.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements and validation.

- [x] T032 [P] Review and refine UI/UX for all new controls in `frontend/src/components/`
- [x] T033 [P] Add more robust error handling and user feedback for new features on both frontend and backend
- [x] T034 Update `quickstart.md` with any new setup/run instructions
- [x] T035 Run `quickstart.md` validation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Stories (Phases 3-9)**: Depend on Foundational.
    - User Stories P1 (Phases 3-5) can start immediately after Foundational.
    - User Stories P2 (Phases 6-8) can start after P1s or in parallel.
    - User Story P3 (Phase 9) depends on P1 and P2 implementations.
- **Polish (Phase 10)**: Depends on all User Stories.

### User Story Dependencies

- All user stories (Phases 3-9) are designed to be largely independent once the Foundational Phase (Phase 2) is complete. They can be implemented in parallel or in priority order.

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
3. Complete Phase 3: User Story 1 (View Enhanced)
4. Complete Phase 4: User Story 2 (Add Enhanced)
5. Complete Phase 5: User Story 3 (Update Enhanced)
6. **STOP and VALIDATE**: Verify enhanced CRUD and viewing.
7. Proceed with P2 user stories (Phases 6-8), then P3 (Phase 9), then Polish (Phase 10).

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together.
2. Once Foundational is done, developers can work on different user stories (Phases 3-9) in parallel.
3. Polish phase can be done collaboratively at the end.
