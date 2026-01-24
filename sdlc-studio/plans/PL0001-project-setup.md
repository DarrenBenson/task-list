# PL0001: Project Setup and Database Foundation - Implementation Plan

> **Status:** Complete
> **Story:** [US0001: Project Setup and Database Foundation](../stories/US0001-project-setup.md)
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Created:** 2026-01-23
> **Language:** Python (backend), JavaScript (frontend)

## Overview

Establish the foundational project structure for both backend (FastAPI/SQLAlchemy) and frontend (React/Vite). This creates the scaffolding upon which all subsequent features will be built. No business logic is implemented - only structure, configuration, and basic application skeletons.

## Acceptance Criteria Summary

| AC | Name | Description |
|----|------|-------------|
| AC1 | Backend structure | FastAPI app with main.py, database.py, models.py, schemas.py |
| AC2 | Task model | SQLAlchemy model with UUID, title, description, is_complete, position, timestamps |
| AC3 | Database init | SQLite database created on first run with Task table |
| AC4 | Frontend structure | React app with App.jsx, main.jsx, api.js service stub |
| AC5 | Servers start | Backend on :8000 with Swagger UI, frontend on :5173 |

## Technical Context

### Language & Framework

- **Primary Language:** Python 3.10+ (backend), JavaScript ES2020+ (frontend)
- **Framework:** FastAPI (backend), React 18 (frontend)
- **Test Framework:** pytest (backend), Vitest (frontend - future)

### Relevant Best Practices

From `~/.claude/best-practices/python.md`:
- Use type hints throughout
- Handle specific exceptions
- Use context managers for resources

### Library Documentation (Context7)

Query Context7 for each library before implementation:

| Library | Context7 ID | Query | Key Patterns |
|---------|-------------|-------|--------------|
| FastAPI | /tiangolo/fastapi | CORS setup, lifespan | `@asynccontextmanager` lifespan, CORS middleware |
| SQLAlchemy | /sqlalchemy/sqlalchemy | 2.0 engine, model definition | `mapped_column()`, `DeclarativeBase` |
| Pydantic | /pydantic/pydantic | v2 BaseModel, Field | `ConfigDict`, `model_validator` |

### Existing Patterns

Greenfield project - establishing new patterns:
- SQLAlchemy 2.0 style with type annotations
- Pydantic v2 with ConfigDict
- FastAPI lifespan context manager for startup/shutdown

## Recommended Approach

**Strategy:** Test-After
**Rationale:** This story creates project scaffolding with no business logic. Tests verify that structure exists and servers start correctly. TDD doesn't provide value for file/directory creation tasks.

### Test Priority

1. Backend server starts and responds on /docs
2. Database file is created on startup
3. Frontend dev server starts and serves HTML

### Documentation Updates Required

- [ ] None (README out of scope per story definition)

## Implementation Steps

### Phase 1: Backend Foundation

**Goal:** Create FastAPI backend with SQLAlchemy database setup

#### Step 1.1: Create directory structure and dependencies

- [x] Create `backend/` directory
- [x] Create `backend/app/` directory
- [x] Create `backend/app/__init__.py`
- [x] Create `backend/app/routers/__init__.py`
- [x] Create `backend/requirements.txt`

**Files to create:**
- `backend/requirements.txt` - Python dependencies

**requirements.txt content:**
```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlalchemy>=2.0.0
pydantic>=2.0.0
python-dotenv>=1.0.0
```

#### Step 1.2: Create database configuration

- [x] Create `backend/app/database.py`
- [x] Configure SQLAlchemy engine for SQLite
- [x] Create session factory
- [x] Create database dependency for FastAPI

**Files to create:**
- `backend/app/database.py` - SQLAlchemy engine, session, Base class

**Considerations:**
- Use SQLAlchemy 2.0 style with `create_engine()` and `sessionmaker()`
- Database URL from environment or default to `sqlite:///./tasks.db`
- `connect_args={"check_same_thread": False}` for SQLite

#### Step 1.3: Create Task model

- [x] Create `backend/app/models.py`
- [x] Define Task model with all fields from AC2
- [x] Ensure UUID auto-generation
- [x] Ensure timestamp auto-set and auto-update

**Files to create:**
- `backend/app/models.py` - Task SQLAlchemy model

**Model fields:**
| Field | Type | Implementation |
|-------|------|----------------|
| id | UUID | `Mapped[uuid.UUID]`, `default_factory=uuid.uuid4`, primary_key |
| title | String(200) | `Mapped[str]`, nullable=False |
| description | String(2000) | `Mapped[Optional[str]]` |
| is_complete | Boolean | `Mapped[bool]`, default=False |
| position | Integer | `Mapped[int]`, unique=True |
| created_at | DateTime | `Mapped[datetime]`, default=utcnow |
| updated_at | DateTime | `Mapped[datetime]`, onupdate=utcnow |

#### Step 1.4: Create Pydantic schemas

- [x] Create `backend/app/schemas.py`
- [x] Define TaskCreate schema (title required, description optional)
- [x] Define TaskUpdate schema (all fields optional)
- [x] Define TaskResponse schema (all fields)

**Files to create:**
- `backend/app/schemas.py` - Pydantic schemas for validation

#### Step 1.5: Create FastAPI application

- [x] Create `backend/app/main.py`
- [x] Configure CORS for frontend origin
- [x] Add lifespan handler to create database tables
- [x] Add health check endpoint at `/health`

**Files to create:**
- `backend/app/main.py` - FastAPI app instance

**Considerations:**
- CORS origins: `["http://localhost:5173"]`
- Use `@asynccontextmanager` for lifespan
- Create tables with `Base.metadata.create_all(engine)` on startup

### Phase 2: Frontend Foundation

**Goal:** Create React/Vite frontend with API service stub

#### Step 2.1: Create directory structure and dependencies

- [x] Create `frontend/` directory
- [x] Create `frontend/src/` directory
- [x] Create `frontend/src/components/` directory
- [x] Create `frontend/src/services/` directory
- [x] Create `frontend/package.json`

**Files to create:**
- `frontend/package.json` - Node dependencies

**package.json dependencies:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

#### Step 2.2: Create Vite configuration

- [x] Create `frontend/vite.config.js`
- [x] Configure API proxy to backend
- [x] Configure React plugin

**Files to create:**
- `frontend/vite.config.js` - Vite build configuration

**Considerations:**
- Proxy `/api` to `http://localhost:8000`
- Enable React Fast Refresh

#### Step 2.3: Create React application skeleton

- [x] Create `frontend/index.html`
- [x] Create `frontend/src/main.jsx`
- [x] Create `frontend/src/App.jsx`

**Files to create:**
- `frontend/index.html` - HTML entry point
- `frontend/src/main.jsx` - React mount point
- `frontend/src/App.jsx` - Main component

#### Step 2.4: Create API service stub

- [x] Create `frontend/src/services/api.js`
- [x] Define API base URL
- [x] Add CRUD fetch functions

**Files to create:**
- `frontend/src/services/api.js` - API client stub

**Stub functions:**
```javascript
export const getTasks = async () => { /* TODO */ };
export const createTask = async (task) => { /* TODO */ };
export const updateTask = async (id, task) => { /* TODO */ };
export const deleteTask = async (id) => { /* TODO */ };
```

### Phase 3: Verification

**Goal:** Verify both servers start correctly

#### Step 3.1: Verify backend

- [x] Install Python dependencies: `pip install -r requirements.txt`
- [x] Start backend: `uvicorn app.main:app --reload`
- [x] Verify Swagger UI at http://localhost:8000/docs
- [x] Verify database file `tasks.db` is created

#### Step 3.2: Verify frontend

- [x] Install Node dependencies: `npm install`
- [x] Start frontend: `npm run dev`
- [x] Verify app loads at http://localhost:5173

#### Step 3.3: Acceptance Criteria Verification

| AC | Verification Method | Status |
|----|---------------------|--------|
| AC1 | Check files exist in backend/app/ | ✅ Verified |
| AC2 | Inspect Task model in models.py | ✅ Verified |
| AC3 | Check tasks.db created after backend start | ✅ Verified |
| AC4 | Check files exist in frontend/src/ | ✅ Verified |
| AC5 | Both servers start without errors | ✅ Verified |

## Edge Case Handling Plan

Every edge case from the Story MUST appear here with an explicit handling strategy.

### Edge Case Coverage

| # | Edge Case (from Story) | Handling Strategy | Implementation Phase | Validated |
|---|------------------------|-------------------|---------------------|-----------|
| 1 | Database file is read-only | SQLAlchemy OperationalError on engine.connect(); app logs error and exits | Phase 1, Step 1.2 | [ ] |
| 2 | Port 8000 already in use | Uvicorn shows "Address already in use" error automatically | Phase 3, Step 3.1 | [ ] |
| 3 | Port 5173 already in use | Vite auto-detects and offers alternative port | Phase 3, Step 3.2 | [ ] |
| 4 | Missing Python dependency | pip install fails with specific package name in error | Phase 3, Step 3.1 | [ ] |
| 5 | Missing Node dependency | npm install fails with specific package name in error | Phase 3, Step 3.2 | [ ] |
| 6 | Corrupted database file | SQLite DatabaseError on connect; app logs error | Phase 1, Step 1.2 | [ ] |

### Coverage Summary

- Story edge cases: 6
- Handled in plan: 6
- Unhandled: 0

### Edge Case Implementation Notes

Edge cases 1, 2, 3, 4, 5 are handled by the frameworks themselves (SQLAlchemy, Uvicorn, Vite, pip, npm). No custom code needed.

Edge case 6 (corrupted database) - SQLAlchemy will raise `sqlalchemy.exc.DatabaseError` when connecting. The lifespan handler should catch this and log clearly.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| SQLAlchemy 2.0 syntax differs from 1.x | Medium | Query Context7 for current patterns |
| Pydantic v2 differs from v1 | Medium | Use ConfigDict, not class Config |
| Vite proxy config issues | Low | Test API calls from frontend early |

## Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| Python 3.10+ | Runtime | Required for type hints |
| Node.js 18+ | Runtime | Required for Vite |
| pip | Tool | Install Python packages |
| npm | Tool | Install Node packages |

## Open Questions

None - all requirements are clear from story and TRD.

## Definition of Done Checklist

- [x] All acceptance criteria implemented
- [x] Backend directory structure created
- [x] Frontend directory structure created
- [x] Task model matches specification
- [x] Pydantic schemas defined
- [x] Both servers start without errors
- [x] Swagger UI accessible at /docs
- [x] No linting errors
- [x] Ready for code review

## Notes

This is a foundation story with no user-facing features. Success is measured by:
1. A developer can clone, install, and run both servers
2. The database is created automatically
3. Swagger documentation is available for API exploration
