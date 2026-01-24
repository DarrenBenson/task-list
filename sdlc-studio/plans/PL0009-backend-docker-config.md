# PL0009: Backend Docker Configuration - Implementation Plan

> **Status:** Complete
> **Story:** [US0009: Create Docker Configuration for Backend](../stories/US0009-backend-docker-config.md)
> **Epic:** [EP0004: Docker Containerisation](../epics/EP0004-docker-containerisation.md)
> **Created:** 2026-01-23
> **Language:** Python / Docker

## Overview

Containerise the FastAPI backend with a production-ready multi-stage Docker build. This includes creating the Dockerfile, .dockerignore, separating dev/prod dependencies, and ensuring the container runs securely as a non-root user.

## Acceptance Criteria Summary

| AC | Name | Description |
|----|------|-------------|
| AC1 | Multi-stage Dockerfile | Uses builder and production stages |
| AC2 | Production deps only | No pytest or dev tools in final image |
| AC3 | Minimal file deployment | No tests, __pycache__, .git, .md files |
| AC4 | .dockerignore configured | Excludes dev files from build context |
| AC5 | Non-root user | Container runs as appuser (UID != 0) |
| AC6 | Health check endpoint | GET /health returns 200 with {"status": "healthy"} |
| AC7 | Docker HEALTHCHECK | Dockerfile includes health check instruction |
| AC8 | Image size under 200MB | Minimal image footprint |
| AC9 | Environment variable config | DATABASE_URL, HOST, PORT configurable |

## Technical Context

### Language & Framework

- **Primary Language:** Python 3.12, Dockerfile
- **Framework:** FastAPI, Docker
- **Test Framework:** pytest (for backend), shell scripts (for container tests)

### Relevant Best Practices

- Multi-stage Docker builds to minimise image size
- Non-root user in containers for security
- .dockerignore to reduce build context
- Separate dev/prod requirements files
- HEALTHCHECK instruction for container orchestration
- Use slim base images (python:3.12-slim)

### Library Documentation (Context7)

No library documentation needed - using Docker and shell commands for testing.

### Existing Patterns

- Health endpoint already exists in `backend/app/main.py` at `/health`
- Database URL configured via `DATABASE_URL` env var in `backend/app/database.py`
- Current requirements.txt mixes dev and prod dependencies

## Recommended Approach

**Strategy:** TDD
**Rationale:** Infrastructure changes have clear acceptance criteria that map directly to verifiable container properties. Tests can be written first as shell scripts that verify container behaviour.

### Test Priority

1. Dockerfile builds successfully
2. Container starts and health check responds
3. No dev dependencies in container (pytest not installed)
4. Container runs as non-root user
5. Image size under 200MB

### Documentation Updates Required

- [ ] None required (container configuration is self-documenting)

## Implementation Steps

### Phase 1: Dependency Separation

**Goal:** Split requirements into prod and dev files

#### Step 1.1: Create requirements-dev.txt

- [ ] Create `backend/requirements-dev.txt` with dev-only deps
- [ ] Remove dev deps from `backend/requirements.txt`

**Files to modify:**
- `backend/requirements.txt` - Remove pytest, httpx
- `backend/requirements-dev.txt` - New file with pytest, httpx, and inclusion of requirements.txt

**Considerations:**
requirements-dev.txt should include `-r requirements.txt` to inherit prod deps

### Phase 2: Docker Configuration

**Goal:** Create Dockerfile and .dockerignore

#### Step 2.1: Create .dockerignore

- [ ] Create `backend/.dockerignore` with exclusions
- [ ] Exclude tests/, __pycache__, .git, *.md, .env*, IDE configs

**Files to create:**
- `backend/.dockerignore` - Build context exclusions

#### Step 2.2: Create multi-stage Dockerfile

- [ ] Create builder stage with venv and prod deps
- [ ] Create production stage with non-root user
- [ ] Copy only venv and app source to production
- [ ] Add HEALTHCHECK instruction
- [ ] Configure CMD for uvicorn

**Files to create:**
- `backend/Dockerfile` - Multi-stage Docker build

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria are met

#### Step 3.1: Build Image

- [ ] Build Docker image
- [ ] Verify build succeeds

#### Step 3.2: Container Tests

- [ ] Test container starts without errors
- [ ] Test health endpoint returns 200
- [ ] Verify no pytest in container
- [ ] Verify no tests directory in container
- [ ] Verify non-root user
- [ ] Verify image size < 200MB

#### Step 3.3: Acceptance Criteria Verification

| AC | Verification Method | Status |
|----|---------------------|--------|
| AC1 | Inspect Dockerfile stages | Pending |
| AC2 | `docker exec ... pip list \| grep pytest` | Pending |
| AC3 | `docker exec ... ls /app/tests` (should fail) | Pending |
| AC4 | Inspect .dockerignore file | Pending |
| AC5 | `docker exec ... id` (UID != 0) | Pending |
| AC6 | `curl http://localhost:8000/health` | Pending |
| AC7 | Inspect Dockerfile HEALTHCHECK | Pending |
| AC8 | `docker images backend:latest --format "{{.Size}}"` | Pending |
| AC9 | Test with/without env vars | Pending |

## Edge Case Handling Plan

Every edge case from the Story MUST appear here with an explicit handling strategy.

### Edge Case Coverage

| # | Edge Case (from Story) | Handling Strategy | Implementation Phase | Validated |
|---|------------------------|-------------------|---------------------|-----------|
| 1 | Build without .dockerignore | Build still works but larger context - acceptable fallback | Phase 2 | [ ] |
| 2 | No DATABASE_URL set | Default to sqlite:///./data/tasks.db in database.py | Phase 2 | [ ] |
| 3 | Health check during startup | HEALTHCHECK has start-period=5s to allow init | Phase 2 | [ ] |
| 4 | Volume mount permissions | appuser owns /app, data dir writable | Phase 2 | [ ] |

### Coverage Summary

- Story edge cases: 4
- Handled in plan: 4
- Unhandled: 0

### Edge Case Implementation Notes

The database default path will use `/app/data/` for container deployments to work well with volume mounts.

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| python:3.12-slim missing curl | Low | Install curl in Dockerfile or use python health check |
| Permission issues with volume | Medium | Ensure data dir exists and is owned by appuser |

## Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| Docker | Runtime | Must be installed to build/test |
| python:3.12-slim | Base image | Docker Hub |

## Open Questions

None - all requirements clear.

## Definition of Done Checklist

- [ ] All acceptance criteria implemented
- [ ] Container builds successfully
- [ ] Container tests pass
- [ ] Image size under 200MB
- [ ] No linting errors in Dockerfile
- [ ] Ready for code review

## Notes

- Health endpoint already exists at `/health`
- Database URL env var already supported
- No alembic migrations to worry about (schema created on startup)
