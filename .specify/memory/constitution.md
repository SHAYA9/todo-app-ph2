# Phase II – Full-Stack Todo App (Basic MVP) Constitution

<!--
Sync Impact Report:
- Version change: none -> v1.0.0
- Modified principles: none
- Added sections: Purpose, Core Principles, Feature Scope (LOCKED), Explicit Exclusions, UI Principles, Technical Standards, Constraints, Success Criteria
- Removed sections: none
- Templates requiring updates: ✅ updated
- Follow-up TODOs: RATIFICATION_DATE
-->

## Purpose

Build a clean, minimal, and production-ready Todo application implementing only core task management features using a full-stack web architecture.

## Core Principles

### I. Strict Spec-Driven Development
No manual coding. All code must be generated from specs.

### II. Simplicity Over Completeness
Focus on the locked-in feature scope and avoid speculative features or premature optimization.

### III. Clear Separation of Concerns
Maintain a clear separation between the frontend, backend, and database.

### IV. Deterministic and Predictable Behavior
The application should behave as expected without any surprises.

### V. Clean and Maintainable Code
Generated code must be clean, readable, and maintainable.

## UI Principles

### VI. Minimal and Clean UI
The user interface should be minimal but visually clean.

### VII. Consistency
Ensure consistent spacing, typography, and layout.

### VIII. Clear Calls-to-Action
Buttons for actions should be clearly identifiable.

### IX. Responsive Layout
The application should be usable on different screen sizes.

### X. Lightweight Styling
No heavy UI frameworks should be used; only lightweight styling.

## Technical Standards

### XI. Frontend Technology
Use Next.js with functional components.

### XII. Backend Technology
Use FastAPI with RESTful endpoints.

### XIII. Database
Use PostgreSQL (Neon) as the database.

### XIV. ORM
Use SQLModel as the Object-Relational Mapper.

### XV. Environment-based Configuration
Configuration should be managed through environment variables.

## Feature Scope (LOCKED)

- Add Task
- Delete Task
- Update Task
- View Task List

## Explicit Exclusions

- No priorities
- No tags
- No recurring tasks
- No notifications
- No authentication
- No background jobs

## Constraints

- All code must be generated from specs.
- No speculative features.
- No premature optimization.

## Success Criteria

- Tasks can be added, viewed, updated, and deleted.
- Data persists in the Neon database.
- Frontend and backend communicate correctly.
- The UI is clean, usable, and visually pleasant.
- The application runs locally without errors.

## Governance

This Constitution supersedes all other practices. Amendments require documentation, approval, and a migration plan. All pull requests and reviews must verify compliance with this constitution.

**Version**: v1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Set initial ratification date. | **Last Amended**: 2025-12-30