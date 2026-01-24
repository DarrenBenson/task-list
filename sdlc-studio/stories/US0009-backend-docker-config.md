# US0009: Create Docker Configuration for Backend

> **Status:** Done
> **Epic:** [EP0004: Docker Containerisation](../epics/EP0004-docker-containerisation.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** developer or operator
**I want** a production-ready Docker container for the FastAPI backend
**So that** the backend can be deployed consistently across any Docker-compatible environment

## Context

### Persona Reference

**Busy Parent Sam** - Benefits from simplified deployment - no need to manage Python dependencies manually.

**Organised Ollie** - Appreciates consistent, reproducible environment across machines.

[Full persona details](../personas.md)

### Background

The backend is a FastAPI application with SQLAlchemy ORM and SQLite database. The Docker container must:
- Use multi-stage build for minimal image size
- Include only production dependencies (no pytest, dev tools)
- Exclude test files, caches, and development artefacts
- Run as non-root user for security
- Provide health check endpoint
- Support environment variable configuration

## Inherited Constraints

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Performance | API responds within 500ms | Container must not add significant latency |
| Data | SQLite database file | Volume mount required for persistence |
| Configuration | Environment variables | Must support env var configuration |
| Security | Non-root user | Container runs as unprivileged user |

### From TRD

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Tech Stack | FastAPI/Python 3.12 | Use python:3.12-slim as base |
| Database | SQLite | Database path configurable via env var |
| Port | Backend :8000 | Expose port 8000 |

## Acceptance Criteria

### AC1: Multi-stage Dockerfile created

- **Given** the backend Dockerfile is built
- **When** examining the Dockerfile structure
- **Then** it uses at least 2 stages (builder and production)
- **And** build dependencies are not included in final image
- **And** only the virtual environment and app source are copied to production stage

### AC2: Production dependencies only

- **Given** the backend container is running
- **When** checking installed Python packages
- **Then** production dependencies (fastapi, uvicorn, sqlalchemy, etc.) are present
- **And** development dependencies (pytest, pytest-cov, httpx) are NOT present
- **And** `pip list | grep pytest` returns no results

### AC3: Minimal file deployment

- **Given** the backend container is running
- **When** examining the container filesystem
- **Then** `/app/tests/` directory does NOT exist
- **And** `__pycache__/` directories do NOT exist
- **And** `.git/` directory does NOT exist
- **And** `*.md` files do NOT exist in /app
- **And** `.env*` files do NOT exist
- **And** no IDE configuration (`.vscode/`, `.idea/`) exists

### AC4: .dockerignore configured

- **Given** the backend .dockerignore file
- **When** examining its contents
- **Then** it excludes `tests/`
- **And** it excludes `__pycache__/` and `*.pyc`
- **And** it excludes `.pytest_cache/`
- **And** it excludes `.git/`
- **And** it excludes `*.md`
- **And** it excludes `.env*`
- **And** it excludes `.venv/`
- **And** it excludes IDE directories

### AC5: Non-root user

- **Given** the backend container is running
- **When** checking the running user
- **Then** the process runs as a non-root user (UID != 0)
- **And** the user has read/write access to the app directory
- **And** the user can write to the data volume mount point

### AC6: Health check endpoint

- **Given** the backend is running
- **When** calling `GET /health`
- **Then** the response status is 200
- **And** the response body contains `{"status": "healthy"}`
- **And** the response time is < 100ms

### AC7: Docker HEALTHCHECK configured

- **Given** the backend Dockerfile
- **When** examining the HEALTHCHECK instruction
- **Then** it calls the `/health` endpoint
- **And** it has appropriate interval (30s) and timeout (10s)
- **And** Docker reports container as "healthy" when running

### AC8: Image size under 200MB

- **Given** the backend image is built
- **When** checking image size with `docker images`
- **Then** the image size is less than 200MB

### AC9: Environment variable configuration

- **Given** the backend container
- **When** configuring via environment variables
- **Then** `DATABASE_URL` can override the SQLite database path
- **And** `HOST` and `PORT` can configure the server binding
- **And** defaults work without any env vars set

## Scope

### In Scope

- Dockerfile with multi-stage build
- .dockerignore file
- Health check endpoint implementation
- Non-root user configuration
- Environment variable support
- Database path configuration

### Out of Scope

- Docker Compose configuration (US0011)
- Frontend container (US0010)
- CI/CD integration
- Container registry publishing

## Technical Notes

### Implementation Approach

1. **Create .dockerignore**
   - Add all exclusions before writing Dockerfile

2. **Create multi-stage Dockerfile**
   ```dockerfile
   # Stage 1: Builder
   FROM python:3.12-slim AS builder
   WORKDIR /build
   RUN python -m venv /opt/venv
   ENV PATH="/opt/venv/bin:$PATH"
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   # Stage 2: Production
   FROM python:3.12-slim AS production
   # Create non-root user
   RUN useradd --create-home --shell /bin/bash appuser
   WORKDIR /app
   # Copy venv from builder
   COPY --from=builder /opt/venv /opt/venv
   ENV PATH="/opt/venv/bin:$PATH"
   # Copy only app source (no tests)
   COPY app/ ./app/
   COPY alembic/ ./alembic/
   COPY alembic.ini .
   # Change ownership
   RUN chown -R appuser:appuser /app
   USER appuser
   EXPOSE 8000
   HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
     CMD curl -f http://localhost:8000/health || exit 1
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

3. **Add health endpoint**
   - Create `/health` route in FastAPI app

### Files to Create/Modify

- `backend/Dockerfile` - New file
- `backend/.dockerignore` - New file
- `backend/app/main.py` - Add health endpoint
- `backend/requirements.txt` - Ensure production deps only

### Requirements Split

Create separate requirements files:
- `requirements.txt` - Production only
- `requirements-dev.txt` - Development dependencies (pytest, etc.)

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Build without .dockerignore | Should still work but larger context |
| No DATABASE_URL set | Defaults to local SQLite path |
| Health check during startup | start-period gives time to initialise |
| Volume mount permissions | appuser must be able to write |

## Test Scenarios

- [ ] Docker build completes successfully
- [ ] Container starts without errors
- [ ] Health check returns 200 OK
- [ ] No test files in container (`ls /app/tests` fails)
- [ ] No pytest installed (`pip list | grep pytest` empty)
- [ ] Process runs as non-root (`id` shows non-zero UID)
- [ ] Image size under 200MB
- [ ] API endpoints respond correctly
- [ ] SQLite operations work with volume mount

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| US0001 | Code | Backend project exists | Complete |
| US0002-US0005 | Code | API endpoints exist | Complete |

### External Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Docker | Runtime | Required |
| python:3.12-slim | Base image | Available |

## Estimation

**Story Points:** 3

**Complexity:** Medium

- Multi-stage Docker build
- Health endpoint implementation
- Security configuration (non-root user)
- No frontend involvement

## Open Questions

None - requirements clear from epic.

## Quality Checklist

### All Stories

- [x] No ambiguous language
- [x] Open Questions: 0 unresolved
- [x] Given/When/Then uses concrete values
- [x] Persona referenced with specific context

### Infrastructure Stories

- [x] File paths specified
- [x] Commands provided
- [x] Security considerations addressed
- [x] Size/performance targets defined

### Ready Status Gate

This story can be marked **Ready** when:
- [x] All critical Open Questions resolved
- [x] Epic constraints incorporated
- [x] No "TBD" placeholders in acceptance criteria

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story created from EP0004 |
| 2026-01-23 | Claude | Implementation complete - all AC verified, TDD approach |
