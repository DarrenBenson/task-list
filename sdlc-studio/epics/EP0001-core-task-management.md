# EP0001: Core Task Management

> **Status:** Complete
> **Owner:** Unassigned
> **Created:** 2026-01-23
> **Target Release:** 1.0

## Summary

Enable users to create, view, edit, and delete tasks through an intuitive interface. This epic delivers the fundamental CRUD operations that form the foundation of the task management system, allowing users like Busy Parent Sam to quickly capture tasks and Organised Ollie to maintain their task lists.

## Inherited Constraints

Constraints that flow from PRD and TRD to this Epic.

### From PRD

| Type | Constraint | Impact on Epic |
|------|------------|----------------|
| Performance | API responds within 500ms | All CRUD operations must meet this threshold |
| Performance | Frontend renders within 1 second | Task list and forms must be responsive |
| Security | Input validation on client and server | All task fields require validation |
| Data | Title max 200 chars, description max 2000 chars | Enforced in schemas and UI |

### From TRD

| Type | Constraint | Impact on Epic |
|------|------------|----------------|
| Architecture | Monolith pattern | Single deployment unit for backend |
| Tech Stack | FastAPI/React | API in Python, UI in React |
| Data Model | Task entity with UUID, position, timestamps | Model must match specification |

> **Note:** Inherited constraints MUST propagate to child Stories. Check Story templates include these constraints.

## Business Context

### Problem Statement

Users need a simple way to capture and manage personal tasks without the overhead of complex enterprise tools. The core operations (create, read, update, delete) must be fast and intuitive.

**PRD Reference:** [Section 2 - Problem Statement](../prd.md#2-problem-statement)

### Value Proposition

Without this epic, users have no way to manage tasks. This is the minimum viable product functionality - everything else builds on top of these core operations.

### Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| Task creation time | N/A | < 5 seconds | Manual testing |
| CRUD operation success rate | N/A | 100% | Automated tests |

## Scope

### In Scope

- Create new task with title and optional description
- View list of all tasks
- View individual task details
- Edit task title and description
- Delete task with confirmation
- Automatic timestamp management (created_at, updated_at)
- Input validation (client and server)

### Out of Scope

- Task completion status (EP0002)
- Task reordering (EP0002)
- Bulk operations
- Task categories or tags
- Due dates

### Affected User Personas

- **Busy Parent Sam:** Needs quick task capture (under 5 seconds) to note things before forgetting
- **Organised Ollie:** Needs reliable persistence and ability to view/edit task details

## Acceptance Criteria (Epic Level)

- [x] User can create a task with title (required) and description (optional)
- [x] User can view all tasks in a list
- [x] User can view full details of any task
- [x] User can edit any task's title and description
- [x] User can delete any task after confirmation
- [x] Validation errors are displayed clearly
- [x] All data persists across browser refresh

## Dependencies

### Blocked By

| Dependency | Type | Status | Owner | Notes |
|------------|------|--------|-------|-------|
| None | - | - | - | Foundation epic with no dependencies |

### Blocking

| Item | Type | Impact | Status |
|------|------|--------|--------|
| EP0002: Task Organisation | Epic | Cannot organise tasks until they exist | ✅ Unblocked |

## Risks & Assumptions

### Assumptions

- Users have a modern web browser (Chrome, Firefox, Safari, Edge)
- Local deployment on user's machine
- SQLite provides sufficient performance for up to 1,000 tasks

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Data loss on crash | Low | High | SQLite provides atomic writes; add tests for persistence |
| Slow performance with many tasks | Low | Medium | Test with 1,000 tasks; implement pagination if needed |

## Technical Considerations

### Architecture Impact

Establishes the core patterns:
- FastAPI router structure
- Pydantic schema definitions
- SQLAlchemy model and session management
- React component architecture
- API service layer in frontend

### Integration Points

- Frontend ↔ Backend: REST API over HTTP
- Backend ↔ Database: SQLAlchemy ORM

### Data Considerations

Task entity requires:
- UUID primary key (auto-generated)
- Title (string, 1-200 chars)
- Description (string, 0-2000 chars, nullable)
- Position (integer, unique, for ordering)
- is_complete (boolean, default false)
- created_at (datetime, auto-set)
- updated_at (datetime, auto-update)

## Sizing & Effort

**Story Points:** 13

**Estimated Story Count:** 4-5 stories

**Complexity Factors:**

- Setting up project structure from scratch
- Establishing patterns for API and frontend
- Database migration setup with Alembic

## Stakeholders

| Role | Name | Interest |
|------|------|----------|
| End User | Busy Parent Sam | Quick task capture |
| End User | Organised Ollie | Reliable task storage |

## Story Breakdown

- [x] [US0001: Project Setup and Database Foundation](../stories/US0001-project-setup.md)
- [x] [US0002: Create Task](../stories/US0002-create-task.md)
- [x] [US0003: View Task List](../stories/US0003-view-task-list.md)
- [x] [US0004: View and Edit Task Details](../stories/US0004-view-edit-task.md)
- [x] [US0005: Delete Task](../stories/US0005-delete-task.md)

## Test Plan

**Test Plan:** Generated and validated

| Test Suite | Type | Cases | Status |
|------------|------|-------|--------|
| Backend unit tests | Unit | 79 | ✅ Passing |
| API tests | Integration | 12 | ✅ Passing |
| E2E task-detail tests | E2E | 9 | ✅ Passing |
| E2E task-delete tests | E2E | 9 | ✅ Passing |
| E2E task-list tests | E2E | 5 | ✅ Passing |

## Open Questions

None - requirements are clear from PRD.

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial epic created from PRD |
| 2026-01-23 | Claude | Validated complete - all AC verified, tests passing |
