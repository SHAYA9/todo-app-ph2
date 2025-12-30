# Tasks: Full-Stack Todo App MVP

**Input**: Design documents from `/specs/001-todo-app-mvp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Not explicitly requested, so I will not generate test tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/app/`, `frontend/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 [P] Initialize Next.js project in `frontend/`
- [x] T002 [P] Initialize FastAPI project in `backend/`
- [x] T003 [P] Configure basic styling in `frontend/app/globals.css`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T004 Setup database connection in `backend/app/database.py`
- [x] T005 Create base SQLModel Task model in `backend/app/models.py`
- [x] T006 Create Pydantic schemas for Task in `backend/app/schemas.py`
- [x] T007 Create CRUD functions for Tasks in `backend/app/crud.py`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Tasks (Priority: P1) 🎯 MVP

**Goal**: As a user, I want to see a list of all my tasks.

**Independent Test**: Open the application and see a list of tasks.

### Implementation for User Story 1

- [x] T008 [US1] Implement `GET /tasks` endpoint in `backend/app/main.py`
- [x] T009 [US1] Create an API client service to fetch tasks in `frontend/services/api.ts`
- [x] T010 [US1] Create a `TaskList` component to display tasks in `frontend/components/TaskList.tsx`
- [x] T011 [US1] Display the `TaskList` component in `frontend/app/page.tsx`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Add a Task (Priority: P1)

**Goal**: As a user, I want to be able to add a new task.

**Independent Test**: Add a new task and see it appear in the list.

### Implementation for User Story 2

- [x] T012 [US2] Implement `POST /tasks` endpoint in `backend/app/main.py`
- [x] T013 [US2] Create an `AddTask` component with a form in `frontend/components/AddTask.tsx`
- [x] T014 [US2] Add the `AddTask` component to `frontend/app/page.tsx`
- [x] T015 [US2] Implement the logic to add a task in `frontend/services/api.ts` and update the UI.

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Update a Task (Priority: P2)

**Goal**: As a user, I want to be able to edit the title of a task and mark it as complete.

**Independent Test**: Edit a task's title and see it update. Mark a task as complete and see its status change.

### Implementation for User Story 3

- [x] T016 [US3] Implement `PUT /tasks/{id}` endpoint in `backend/app/main.py`
- [x] T017 [US3] Add functionality to `TaskList.tsx` to allow editing a task title.
- [x] T018 [US3] Add a checkbox to each task in `TaskList.tsx` to mark it as complete.
- [x] T019 [US3] Implement the logic to update a task in `frontend/services/api.ts` and update the UI.

**Checkpoint**: User Stories 1, 2, AND 3 should all work independently.

---

## Phase 6: User Story 4 - Delete a Task (Priority: P2)

**Goal**: As a user, I want to be able to delete a task.

**Independent Test**: Delete a task and see it removed from the list.

### Implementation for User Story 4

- [x] T020 [US4] Implement `DELETE /tasks/{id}` endpoint in `backend/app/main.py`
- [x] T021 [US4] Add a delete button to each task in `TaskList.tsx`.
- [x] T022 [US4] Implement the logic to delete a task in `frontend/services/api.ts` and update the UI.

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T023 [P] Add error handling to the frontend.
- [x] T024 [P] Add basic styling to make the UI clean and readable.
- [x] T025 Run `quickstart.md` validation.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup.
- **User Stories (Phases 3-6)**: Depend on Foundational.
- **Polish (Phase 7)**: Depends on all User Stories.

### User Story Dependencies

- All user stories are independent and can be implemented in parallel after the Foundational phase is complete.

---

## Implementation Strategy

### MVP First (User Stories 1 & 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Complete Phase 4: User Story 2
5. **STOP and VALIDATE**: Test viewing and adding tasks.

### Incremental Delivery

1. Deliver MVP.
2. Add User Story 3 (Update Task).
3. Add User Story 4 (Delete Task).
4. Complete Polish phase.
