# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

## Project Overview

A single-user task management web application with FastAPI backend (SQLite) and React SPA frontend. Tasks support CRUD operations and drag-and-drop reordering via @dnd-kit.

## Commands

### Docker (Recommended)

```bash
# Start entire application
docker compose up -d

# Rebuild after code changes
docker compose up -d --build

# View logs
docker compose logs -f

# Stop and remove containers
docker compose down -v
```

Application runs at http://localhost (frontend) with API at http://localhost:8000.

### Local Development

**Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Frontend: http://localhost:5173, Backend: http://localhost:8000

### Testing

**Backend tests (pytest):**
```bash
cd backend
source venv/bin/activate
pytest tests/ -v                          # All tests
pytest tests/test_api_tasks.py -v         # Single file
pytest tests/ -k "test_create_task" -v    # By name pattern
pytest tests/ --cov=app --cov-report=term # With coverage
```

**Frontend E2E tests (Playwright):**
```bash
cd frontend
npm test                    # Headless (auto-starts backend + frontend)
npm run test:headed         # With browser visible
npm run test:ui             # Playwright UI mode
npx playwright test e2e/task-form.spec.js  # Single file
```

**Docker Compose tests:**
```bash
source backend/venv/bin/activate
pytest tests/test_docker_compose.py -v
```

## Architecture

### Backend Structure

```
backend/app/
├── main.py          # FastAPI app, CORS config, lifespan
├── database.py      # SQLAlchemy engine, session, Base
├── models.py        # Task SQLAlchemy model
├── schemas.py       # Pydantic request/response schemas
└── routers/tasks.py # All /api/v1/tasks/* endpoints
```

- API prefix: `/api/v1`
- Database: SQLite file at `data/tasks.db` (Docker) or `tasks.db` (local)
- Tests use in-memory SQLite with fresh tables per test

### Frontend Structure

```
frontend/src/
├── App.jsx              # Main component, state management
├── services/api.js      # All fetch calls to backend
└── components/
    ├── TaskList.jsx         # Renders task items with drag-drop
    ├── TaskForm.jsx         # Create task form
    ├── TaskDetail.jsx       # View/edit modal
    ├── SortableTaskItem.jsx # Individual draggable task
    └── ConfirmDialog.jsx    # Delete confirmation
```

- State: React useState in App.jsx (no external state library)
- Drag-drop: @dnd-kit/core and @dnd-kit/sortable
- API calls proxy through Vite in dev, nginx in Docker

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/tasks | List all tasks (sorted by position) |
| GET | /api/v1/tasks/{id} | Get single task |
| POST | /api/v1/tasks | Create task |
| PATCH | /api/v1/tasks/{id} | Update task (partial) |
| DELETE | /api/v1/tasks/{id} | Delete task |
| PUT | /api/v1/tasks/reorder | Bulk update positions |
| GET | /health | Health check |

### Data Model

Task fields: `id` (UUID), `title` (max 200), `description` (max 2000), `is_complete`, `position`, `created_at`, `updated_at`

## Test Coverage

Target: 90% line coverage. Current: 97% backend.

Test locations:
- `backend/tests/` - pytest unit and API tests
- `frontend/e2e/` - Playwright E2E specs
- `tests/` - Docker Compose integration tests

## Documentation

Detailed specifications in `sdlc-studio/`:
- `prd.md` - Product requirements
- `trd.md` - Technical requirements
- `tsd.md` - Test strategy
- `test-specs/` - Individual test specifications
