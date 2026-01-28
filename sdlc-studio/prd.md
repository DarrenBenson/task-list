# Product Requirements Document

**Project:** Task Management System
**Version:** 1.2
**Last Updated:** 2026-01-28
**Status:** Approved

---

## 1. Project Overview

### Product Name
Task Manager

### Purpose
A lightweight, web-based task management system designed for personal productivity. Enables users to create, organise, track, and complete tasks through an intuitive single-page application.

### Tech Stack
- **Backend:** Python 3.10+, FastAPI, SQLAlchemy 2.0+, SQLite, Uvicorn
- **Frontend:** React 18+, Vite, CSS Modules or Tailwind CSS
- **API Documentation:** OpenAPI 3.0, Swagger UI, ReDoc

### Architecture Pattern
Client-server SPA with RESTful API backend. Single-page React frontend communicating with FastAPI backend via JSON REST endpoints.

### Maturity Assessment
**[HIGH]** New project - greenfield implementation with clear requirements.

---

## 2. Problem Statement

### Problem Being Solved
Users need a simple, fast interface for managing personal tasks without the complexity of enterprise task management tools.

### Target Users
Individual users seeking personal productivity tools - no multi-user or collaboration requirements.

### Context
- Single-user deployment (local machine or single server)
- No authentication required
- English only (no i18n)
- Data volume under 1,000 tasks

---

## 3. Feature Inventory

| Feature | Description | Status | Priority | Location |
|---------|-------------|--------|----------|----------|
| FR-001: Create Task | Create new task with title and optional description | Complete | Must-have | Backend API + Frontend |
| FR-002: View All Tasks | Display tasks in ordered, scrollable list | Complete | Must-have | Frontend |
| FR-003: View Task Details | View full task details including description | Complete | Must-have | Frontend |
| FR-004: Edit Task | Modify task title and description | Complete | Must-have | Backend API + Frontend |
| FR-005: Toggle Completion | Mark tasks complete/incomplete | Complete | Must-have | Backend API + Frontend |
| FR-006: Reorder Tasks | Drag-and-drop task reordering | Complete | Must-have | Backend API + Frontend |
| FR-007: Delete Task | Remove tasks with confirmation | Complete | Must-have | Backend API + Frontend |
| FR-008: Set Deadline | Optional deadline datetime with overdue indicator | Complete | Should-have | Backend API + Frontend |

### Feature Details

#### FR-001: Create Task

**User Story:** As a user, I want to create a new task so that I can track work I need to complete.

**Acceptance Criteria:**
- [x] AC-001.1: User can enter a task title up to 200 characters
- [x] AC-001.2: User can optionally enter a description up to 2000 characters
- [x] AC-001.3: New tasks are created with status 'incomplete' by default
- [x] AC-001.4: New tasks are added to the end of the task list (highest position value)
- [x] AC-001.5: System displays the new task immediately upon successful creation
- [x] AC-001.6: System displays an error message if title is empty or exceeds 200 characters
- [x] AC-001.7: Created and updated timestamps are automatically set to current time

**Dependencies:** None

**Status:** Complete

**Confidence:** [HIGH]

---

#### FR-002: View All Tasks

**User Story:** As a user, I want to see all my tasks in an ordered list so that I can understand what needs to be done.

**Acceptance Criteria:**
- [x] AC-002.1: All tasks display in a single scrollable list
- [x] AC-002.2: Tasks are sorted by position value (ascending)
- [x] AC-002.3: Each task displays its title, completion status, and position indicator
- [x] AC-002.4: Completed tasks are visually distinguished (strikethrough, muted colour)
- [x] AC-002.5: Empty state displays a message when no tasks exist

**Dependencies:** FR-001 (needs tasks to display)

**Status:** Complete

**Confidence:** [HIGH]

---

#### FR-003: View Task Details

**User Story:** As a user, I want to view the full details of a task so that I can see its complete description.

**Acceptance Criteria:**
- [x] AC-003.1: User can click/tap a task to view its full details
- [x] AC-003.2: Detail view shows title, description, status, and timestamps
- [x] AC-003.3: User can return to the list view from the detail view

**Dependencies:** FR-001, FR-002

**Status:** Complete

**Confidence:** [HIGH]

---

#### FR-004: Edit Task

**User Story:** As a user, I want to edit a task's title and description so that I can correct or update information.

**Acceptance Criteria:**
- [x] AC-004.1: User can modify the task title
- [x] AC-004.2: User can modify the task description
- [x] AC-004.3: Validation rules match creation (title required, character limits)
- [x] AC-004.4: Updated timestamp is set to current time on save
- [x] AC-004.5: Changes are reflected immediately in the task list

**Dependencies:** FR-001, FR-002

**Status:** Complete

**Confidence:** [HIGH]

---

#### FR-005: Mark Task Complete/Incomplete

**User Story:** As a user, I want to mark a task as complete or incomplete so that I can track my progress.

**Acceptance Criteria:**
- [x] AC-005.1: User can toggle completion status with a single click/tap
- [x] AC-005.2: Visual indicator updates immediately upon status change
- [x] AC-005.3: Completed tasks remain in their current position (not moved or hidden)
- [x] AC-005.4: Updated timestamp is set to current time on status change

**Dependencies:** FR-001, FR-002

**Status:** Complete

**Confidence:** [HIGH]

---

#### FR-006: Reorder Tasks

**User Story:** As a user, I want to reorder my tasks so that I can prioritise what to work on next.

**Acceptance Criteria:**
- [x] AC-006.1: User can drag a task to a new position in the list
- [x] AC-006.2: Other tasks shift to accommodate the moved task
- [x] AC-006.3: New positions persist after page refresh
- [x] AC-006.4: Visual feedback indicates the drop target during drag operation
- [x] AC-006.5: Position values are recalculated to maintain sequential ordering

**Dependencies:** FR-001, FR-002

**Status:** Complete

**Confidence:** [HIGH]

---

#### FR-007: Delete Task

**User Story:** As a user, I want to delete a task so that I can remove items I no longer need.

**Acceptance Criteria:**
- [x] AC-007.1: User can delete a task via a delete button/action
- [x] AC-007.2: System requests confirmation before deletion
- [x] AC-007.3: Deleted task is removed from the list immediately
- [x] AC-007.4: Deletion is permanent (no recycle bin)
- [x] AC-007.5: Remaining tasks maintain their relative order

**Dependencies:** FR-001, FR-002

**Status:** Complete

**Confidence:** [HIGH]

---

#### FR-008: Set Task Deadline

**User Story:** As a user, I want to set an optional deadline on my tasks so that I can see which tasks are overdue.

**Acceptance Criteria:**
- [x] AC-008.1: User can optionally set a deadline datetime when creating a task
- [x] AC-008.2: User can add, modify, or remove a deadline when editing a task
- [x] AC-008.3: Deadline datetime is displayed in the task list (compact format)
- [x] AC-008.4: Deadline datetime is displayed in the task detail view (full format)
- [x] AC-008.5: Tasks past their deadline display a red "Overdue" badge
- [x] AC-008.6: Tasks before their deadline do not display an overdue indicator
- [x] AC-008.7: Deadline persists after page refresh
- [x] AC-008.8: API validates datetime format and returns 422 for invalid values

**Dependencies:** FR-001, FR-004

**Status:** Complete

**Confidence:** [HIGH]

---

## 4. Functional Requirements

### Core Behaviours

**Task Lifecycle:**
1. Tasks are created with title (required) and description (optional)
2. New tasks default to incomplete status
3. New tasks are positioned at the end of the list
4. Tasks can be edited, reordered, marked complete, or deleted
5. Deletion is permanent - no soft delete or recycle bin

**Position Management:**
- Position values are integers starting from 1
- Lower position = higher in list
- Positions must be unique across all tasks
- Reordering recalculates positions to maintain sequential order

### Input/Output Specifications

**Task Creation Input:**
- title: string, required, 1-200 characters
- description: string, optional, 0-2000 characters
- deadline: datetime, optional, ISO 8601 format

**Task Output:**
- id: UUID, auto-generated
- title: string
- description: string (may be null)
- is_complete: boolean
- position: integer
- deadline: datetime (may be null)
- created_at: ISO 8601 datetime (UTC)
- updated_at: ISO 8601 datetime (UTC)

### Business Logic Rules

- Title cannot be empty or whitespace-only
- Title cannot exceed 200 characters
- Description cannot exceed 2000 characters
- Position values must be unique
- Timestamps are always UTC
- is_complete defaults to false on creation
- Deadline is optional and defaults to null
- Overdue status is determined by comparing deadline to current browser time

---

## 5. Non-Functional Requirements

### Performance
- **NFR-001:** API endpoints respond within 500ms under normal load
- **NFR-002:** Frontend renders task list within 1 second of data receipt
- **NFR-003:** Drag-and-drop feels instantaneous (optimistic UI updates)
- **NFR-004:** System supports up to 1,000 tasks without degradation
- **NFR-005:** Database file size does not exceed 50MB for 1,000 tasks

### Security
- **NFR-007a:** All inputs validated on both client and server
- **NFR-007b:** API sanitises inputs to prevent SQL injection (SQLAlchemy ORM)
- **NFR-007c:** Frontend escapes outputs to prevent XSS (React default escaping)
- **NFR-008:** CORS configured for frontend origin only

### Scalability
Single-user system - no horizontal scaling requirements.

### Availability
Local deployment - availability depends on local machine uptime.

### Error Handling
- **NFR-006:** API returns appropriate HTTP status codes for all conditions
- **NFR-006:** Frontend displays user-friendly error messages
- **NFR-006:** Network failures do not corrupt local UI state

---

## 6. AI/ML Specifications

> Not applicable - no AI/ML components in this system.

---

## 7. Data Architecture

### Data Models

**Task Entity:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary key, auto-generated | Unique task identifier |
| title | String | Required, max 200 chars | Task title |
| description | String | Optional, max 2000 chars | Detailed task description |
| is_complete | Boolean | Default: false | Completion status |
| position | Integer | Required, unique | Sort order (lower = higher in list) |
| deadline | DateTime | Optional, nullable | Task due date and time |
| created_at | DateTime | Auto-set on create, UTC | Creation timestamp |
| updated_at | DateTime | Auto-set on create/update, UTC | Last modification timestamp |

### Relationships and Constraints
- No foreign key relationships (single entity system)
- Task ID must be globally unique
- Position values must be unique across all tasks

### Storage Mechanisms
- SQLite 3 database file
- SQLAlchemy 2.0+ ORM
- Alembic for database migrations

### Data Flow
```
Frontend (React) <--JSON/REST--> Backend (FastAPI) <--SQLAlchemy--> SQLite
```

---

## 8. Integration Map

### External Services
None - self-contained system.

### Authentication Methods
None - single-user system without authentication.

### Webhooks and Events
None.

### Third-Party Dependencies

**Backend:**
- fastapi
- uvicorn
- sqlalchemy
- pydantic
- python-dotenv (optional)

**Frontend:**
- react
- react-dom
- @dnd-kit/core
- @dnd-kit/sortable
- @dnd-kit/utilities

---

## 9. Configuration Reference

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| DATABASE_URL | SQLite database path | No | sqlite:///./tasks.db |
| CORS_ORIGINS | Allowed CORS origins | No | http://localhost:5173 |
| LOG_LEVEL | Logging verbosity | No | INFO |

### Feature Flags
None.

### Deployment Requirements
- Python 3.10+
- Node.js 18+
- Local machine or single server instance

---

## 10. Test Coverage Analysis

### Tested Functionality
- All CRUD operations (create, read, update, delete tasks)
- Task reordering via drag-and-drop
- Toggle completion status
- Deadline setting and overdue detection
- Input validation (client and server)
- Error handling and edge cases

### Test Coverage Metrics
- **Backend (pytest):** 97% line coverage, 96 tests passing
- **Frontend E2E (Playwright):** 85 tests passing, 100% feature coverage

### Test Patterns Used
- pytest with TestClient for API testing
- Playwright for end-to-end browser testing
- In-memory SQLite for test isolation
- Factory fixtures for test data generation

### Quality Assessment
All features fully tested. Coverage exceeds 90% target.

---

## 11. Technical Debt Register

### TODO/FIXME Items Found
None - greenfield project.

### Inconsistent Patterns
None.

### Deprecated Dependencies
None.

### Security Concerns
None identified in requirements.

---

## 12. Documentation Gaps

### Undocumented Features
None - all features documented in PRD and implemented.

### Missing Inline Comments
None identified - codebase has appropriate documentation.

### Unclear Code Sections
None identified.

---

## 13. Recommendations

### Critical Gaps
None - comprehensive requirements provided.

### Suggested Improvements
- Consider adding input debouncing for drag-and-drop to reduce API calls
- Consider localStorage backup for offline resilience
- Add keyboard shortcuts for power users

### Security Hardening
- Implement rate limiting on API endpoints
- Add input length validation in database constraints (not just application layer)

---

## 14. Open Questions

> All questions resolved through implementation.

- **Q:** Should task list display show truncated descriptions or title only?
  **Resolution:** Task list shows title and full description (scrollable list).

- **Q:** Should drag handle be visible always or on hover only?
  **Resolution:** Drag handle is always visible for accessibility and touch device support.

---

## Appendix

### Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-23 | 1.0 | Initial PRD created from spec.md |
| 2026-01-26 | 1.1 | Added FR-008 (Task Deadlines), updated test coverage, resolved open questions |
| 2026-01-27 | 1.1 | Upgraded to v2 schema |
| 2026-01-28 | 1.2 | Fixed duplicate NFR IDs, updated dependencies, corrected documentation gaps section |
