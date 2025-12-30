---
id: 001
title: Establish Project Constitution
stage: constitution
date: 2025-12-30
surface: agent
model: gemini-pro
feature: none
branch: master
user: SHAYAN
command: /sp.constitution
labels: [constitution, setup]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
 - .specify/memory/constitution.md
tests:
 - none
---

## Prompt

/sp.constitution 
Project: Phase II – Full-Stack Todo App (Basic MVP)

Purpose:
Build a clean, minimal, and production-ready Todo application implementing only core task management features using a full-stack web architecture.

Core Principles:
- Strict spec-driven development (no manual coding)
- Simplicity over completeness
- Clear separation of frontend, backend, and database
- Deterministic and predictable behavior
- Clean, readable, and maintainable generated code

Feature Scope (LOCKED):
- Add Task
- Delete Task
- Update Task
- View Task List

Explicit Exclusions:
- No priorities
- No tags
- No recurring tasks
- No notifications
- No authentication
- No background jobs

UI Principles:
- Minimal but visually clean UI
- Consistent spacing, typography, and layout
- Clear call-to-action buttons
- Responsive layout
- No heavy UI frameworks (lightweight styling only)

Technical Standards:
- Frontend: Next.js with functional components
- Backend: FastAPI with RESTful endpoints
- Database: PostgreSQL (Neon)
- ORM: SQLModel
- Environment-based configuration

Constraints:
- All code must be generated from specs
- No speculative features
- No premature optimization

Success Criteria:
- Tasks can be added, viewed, updated, and deleted
- Data persists in Neon database
- Frontend and backend communicate correctly
- UI is clean, usable, and visually pleasant
- Application runs locally without errors

## Response snapshot

The project constitution has been created at `.specify/memory/constitution.md` with version v1.0.0. The constitution includes the project's purpose, core principles, UI principles, technical standards, feature scope, explicit exclusions, constraints, and success criteria.

## Outcome

- ✅ Impact: The project constitution was successfully created, establishing the guiding principles for the project.
- 🧪 Tests: No tests were run.
- 📁 Files: 1 file was created: `.specify/memory/constitution.md`.
- 🔁 Next prompts: The user can now proceed with other commands, such as `/sp.specify` to create a feature specification.
- 🧠 Reflection: The process of creating the constitution was straightforward. The user provided all the necessary information.

## Evaluation notes (flywheel)

- Failure modes observed: none
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): null
- Next experiment (smallest change to try): n/a
