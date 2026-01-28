# US0001: Project Setup and Database Foundation

> **Status:** Complete
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** developer
**I want** a properly structured project with database and API foundation
**So that** I can build task management features on a solid foundation

## Context

### Persona Reference

**Developer** - Technical foundation story required before user-facing features can be built.

### Background

This is a technical foundation story. Before any user-facing features can be implemented, the project structure, database schema, and API framework must be established. This story sets up the patterns that all subsequent stories will follow.

## Inherited Constraints

Constraints inherited from parent Epic that apply to this Story.

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Risk | Data loss on crash | SQLite atomic writes; test persistence |
| Success Metric | CRUD success rate 100% | Foundation must be reliable |

### From PRD (via Epic)

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Performance | API responds within 500ms | Minimal overhead in DB layer |
| Tech Stack | FastAPI/SQLAlchemy/React | Use specified technologies |
| Data Model | Task with UUID, position, timestamps | Schema must match spec |

## Acceptance Criteria

### AC1: Backend project structure exists

- **Given** a new developer clones the repository
- **When** they navigate to the backend directory
- **Then** they find a FastAPI application with:
  - `app/main.py` with FastAPI app instance
  - `app/database.py` with SQLAlchemy session management
  - `app/models.py` with Task model
  - `app/schemas.py` with Pydantic schemas
  - `requirements.txt` with all dependencies

### AC2: Task database model is defined

- **Given** the database module is imported
- **When** the Task model is inspected
- **Then** it contains:
  - `id`: UUID, primary key, auto-generated
  - `title`: String, max 200 chars, not nullable
  - `description`: String, max 2000 chars, nullable
  - `is_complete`: Boolean, default False
  - `position`: Integer, not nullable, unique
  - `created_at`: DateTime, auto-set to UTC now
  - `updated_at`: DateTime, auto-updates on change

### AC3: Database can be initialised

- **Given** the backend application starts
- **When** SQLite database file does not exist
- **Then** database file is created with Task table schema

### AC4: Frontend project structure exists

- **Given** a new developer clones the repository
- **When** they navigate to the frontend directory
- **Then** they find a React application with:
  - `src/App.jsx` main component
  - `src/main.jsx` entry point
  - `src/services/api.js` API client stub
  - `package.json` with React 18 and Vite
  - `vite.config.js` configured for development

### AC5: Development servers can start

- **Given** dependencies are installed
- **When** developer runs backend start command
- **Then** FastAPI server starts on port 8000 with Swagger UI at /docs
- **And** when developer runs frontend start command
- **Then** Vite dev server starts on port 5173

## Scope

### In Scope

- Backend directory structure
- FastAPI application skeleton
- SQLAlchemy database setup with SQLite
- Task model definition
- Pydantic schema definitions
- Frontend directory structure
- React/Vite application skeleton
- API service stub
- Development configuration

### Out of Scope

- API endpoints (US0002-US0005)
- React components for UI
- Alembic migrations (manual table creation sufficient for MVP)
- Production configuration
- Docker setup

## UI/UX Requirements

Not applicable - this is a technical foundation story.

## Technical Notes

### Project Structure

```
task-manager/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI app
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── models.py        # Task model
│   │   ├── schemas.py       # Pydantic schemas
│   │   └── routers/
│   │       └── __init__.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── components/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

### API Contracts

Not applicable - no endpoints in this story.

### Data Requirements

**Task Model:**

| Field | Type | Constraints |
|-------|------|-------------|
| id | UUID | PK, default uuid4 |
| title | String(200) | NOT NULL |
| description | String(2000) | nullable |
| is_complete | Boolean | default False |
| position | Integer | NOT NULL, UNIQUE |
| created_at | DateTime | default utcnow |
| updated_at | DateTime | onupdate utcnow |

**Pydantic Schemas:**
- `TaskCreate`: title (str, 1-200), description (str, 0-2000, optional)
- `TaskUpdate`: title (str, optional), description (str, optional)
- `TaskResponse`: all fields from model

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Database file is read-only | Application fails to start with clear error message |
| Port 8000 already in use | FastAPI shows clear error about port conflict |
| Port 5173 already in use | Vite offers alternative port |
| Missing Python dependency | pip install fails with specific package name |
| Missing Node dependency | npm install fails with specific package name |
| Corrupted database file | SQLite raises IntegrityError; application logs error |

## Test Scenarios

- [x] Backend starts without errors
- [x] Frontend starts without errors
- [x] Task model can be instantiated
- [x] Database table is created on first run
- [x] Pydantic schemas validate correctly
- [x] FastAPI Swagger UI is accessible

## Dependencies

### Story Dependencies

None - this is the foundation story.

### External Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Python 3.10+ | Runtime | Required |
| Node.js 18+ | Runtime | Required |

## Estimation

**Story Points:** 3

**Complexity:** Low

## Open Questions

None.

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story generated from EP0001 |
