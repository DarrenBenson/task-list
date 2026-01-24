# EP0004: Docker Containerisation

> **Status:** Done
> **Owner:** Unassigned
> **Created:** 2026-01-23
> **Target Release:** 1.2

## Summary

Containerise the Task Manager application for consistent, portable deployment using Docker best practices. This epic enables the application to be delivered as production-ready Docker containers with multi-stage builds, security hardening, and health checks, making deployment simple and reproducible across any Docker-compatible environment.

## Inherited Constraints

Constraints that flow from PRD and TRD to this Epic.

### From PRD

| Type | Constraint | Impact on Epic |
|------|------------|----------------|
| Performance | API responds within 500ms | Container must not add significant latency |
| Performance | Frontend renders within 1 second | Static assets must be efficiently served |
| Data | SQLite database file | Volume mount required for persistence |
| Configuration | Environment variables | Must support env var configuration |

### From TRD

| Type | Constraint | Impact on Epic |
|------|------------|----------------|
| Architecture | Monolith pattern | Can package backend + frontend in single or separate containers |
| Tech Stack | FastAPI/React | Official Python and Node images as base |
| Database | SQLite | Volume mount for data persistence |
| Ports | Backend :8000, Frontend :5173 | Expose appropriate ports |

> **Note:** Inherited constraints MUST propagate to child Stories. Check Story templates include these constraints.

## Business Context

### Problem Statement

The current application requires manual setup: installing Python dependencies, Node.js, running multiple development servers. This makes deployment inconsistent and error-prone. Docker containerisation provides a standardised, reproducible deployment method.

**PRD Reference:** [Section 9 - Configuration Reference](../prd.md#9-configuration-reference)

### Value Proposition

Docker containers provide:
- **Reproducibility:** Same container runs identically everywhere
- **Simplicity:** Single `docker compose up` to start the entire application
- **Isolation:** No dependency conflicts with host system
- **Portability:** Deploy to any Docker-compatible environment
- **Best practices:** Security hardening, health checks, minimal images

### Success Metrics

| Metric | Current State | Target | Measurement Method |
|--------|---------------|--------|-------------------|
| Deployment complexity | Manual multi-step | Single command | Manual verification |
| Container startup time | N/A | < 10 seconds | Docker timing |
| Image size (backend) | N/A | < 200MB | docker images |
| Image size (frontend) | N/A | < 50MB | docker images |
| Security vulnerabilities | Unknown | 0 critical/high | docker scout / trivy |

## Scope

### In Scope

- Multi-stage Dockerfile for backend (FastAPI)
- Multi-stage Dockerfile for frontend (React/Vite production build)
- Docker Compose configuration for local development
- Docker Compose configuration for production deployment
- Volume configuration for SQLite persistence
- Health check endpoints and Docker HEALTHCHECK
- Environment variable configuration
- Non-root user in containers
- Comprehensive .dockerignore files to exclude unnecessary files
- Documentation for Docker usage

### Minimal Deployment Principle

**Only production-essential files deployed to containers:**

**Backend container INCLUDES:**
- Python runtime and production dependencies only
- Application source code (app/ directory)
- Database migrations (alembic/)

**Backend container EXCLUDES:**
- Test files and fixtures
- Development dependencies (pytest, etc.)
- __pycache__ and .pyc files
- .git directory
- IDE configuration (.vscode, .idea)
- Local environment files (.env.local)
- Documentation and markdown files
- Node.js/frontend files

**Frontend container INCLUDES:**
- nginx server
- Production build output (dist/ only)
- nginx configuration

**Frontend container EXCLUDES:**
- Node.js runtime (not needed after build)
- node_modules/
- Source files (src/)
- Test files (e2e/, *.spec.js)
- Development configuration
- .git directory
- IDE configuration

### Out of Scope

- Kubernetes manifests (future epic)
- CI/CD pipeline integration (future epic)
- Container registry setup
- Docker Swarm configuration
- Cloud-specific deployment (AWS ECS, Azure Container Apps, etc.)
- Automated image building in CI

### Affected User Personas

- **Busy Parent Sam:** Benefits from simplified deployment - no need to manage dependencies
- **Organised Ollie:** Appreciates consistent, reproducible environment across machines

## Acceptance Criteria (Epic Level)

### Deployment

- [x] Application runs via `docker compose up` with no additional setup
- [x] SQLite database persists across container restarts (volume mount)
- [x] Environment variables are configurable via docker-compose.yml
- [x] Container startup completes within 10 seconds
- [x] Documentation explains Docker usage and configuration

### Minimal Image Builds

- [x] Backend container uses multi-stage build with production dependencies only
- [x] Backend image contains NO test files, node_modules, or development dependencies
- [x] Frontend container serves static build via nginx (no Node.js runtime)
- [x] Frontend image contains ONLY dist/ build output and nginx config
- [x] .dockerignore files exclude all non-essential files from build context
- [x] Backend image size < 200MB
- [x] Frontend image size < 50MB

### Security

- [x] Containers run as non-root user
- [x] Health checks are configured and functional
- [x] Images have no critical or high security vulnerabilities
- [x] No secrets or .env files baked into images

## Dependencies

### Blocked By

| Dependency | Type | Status | Owner | Notes |
|------------|------|--------|-------|-------|
| EP0001: Core Task Management | Epic | Complete | - | Application must exist to containerise |
| EP0002: Task Organisation | Epic | Complete | - | Full functionality required |
| EP0003: UX Improvements | Epic | Complete | - | Design system must be in place |

### Blocking

| Item | Type | Impact |
|------|------|--------|
| Kubernetes deployment | Future Epic | Requires container images |
| CI/CD pipeline | Future Epic | Requires Dockerfiles |

## Risks & Assumptions

### Assumptions

- Docker and Docker Compose are available on target deployment machines
- Users have basic Docker familiarity
- SQLite file-based database is suitable for containerised deployment
- No need for container orchestration (single-node deployment)

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| SQLite file locking in container | Low | High | Test concurrent access, document limitations |
| Large image sizes | Medium | Low | Multi-stage builds, .dockerignore, alpine bases |
| Port conflicts | Low | Low | Document and make ports configurable |
| Volume permission issues | Medium | Medium | Document, use named volumes, test on Linux/Mac/Windows |

## Technical Considerations

### Architecture Impact

Adds Docker layer to existing architecture:
```
┌─────────────────────────────────────────────────────────┐
│                    Docker Host                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │              Docker Network                      │    │
│  │                                                  │    │
│  │  ┌──────────────┐      ┌──────────────────┐    │    │
│  │  │   Frontend   │      │     Backend      │    │    │
│  │  │   (nginx)    │─────▶│   (uvicorn)      │    │    │
│  │  │   :80        │      │   :8000          │    │    │
│  │  └──────────────┘      └────────┬─────────┘    │    │
│  │                                  │              │    │
│  │  └──────────────────────────────────┼──────────────┘    │
│  │                                     │                    │
│  │                              ┌──────▼───────┐           │
│  │                              │ Named Volume │           │
│  │                              │  (data)      │           │
│  │                              └──────────────┘           │
│  └─────────────────────────────────────────────────────────┘
```

### Integration Points

- Frontend container → Backend container (internal Docker network)
- Backend container → Volume (SQLite database)
- Host → Frontend container (exposed port)
- Host → Backend container (optional exposed port)

### Data Considerations

- SQLite database stored in named Docker volume
- Volume persists across container lifecycle
- Backup strategy: copy from named volume

### Multi-Stage Build Strategy

**Backend Dockerfile (3 stages):**
```dockerfile
# Stage 1: Build dependencies
FROM python:3.12-slim AS builder
# Install build tools, create venv, install deps

# Stage 2: Production
FROM python:3.12-slim AS production
# Copy only venv and app source - NO tests, NO dev deps
```

**Frontend Dockerfile (2 stages):**
```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
# npm ci, npm run build

# Stage 2: Production
FROM nginx:alpine AS production
# Copy ONLY dist/ folder - NO node_modules, NO source
```

### Required .dockerignore Files

**backend/.dockerignore:**
```
tests/
__pycache__/
*.pyc
.pytest_cache/
.coverage
htmlcov/
.git/
.venv/
*.md
.env*
.vscode/
.idea/
```

**frontend/.dockerignore:**
```
node_modules/
e2e/
*.spec.js
test-results/
playwright-report/
.git/
*.md
.env*
.vscode/
.idea/
dist/  # Rebuild fresh in container
```

## Sizing & Effort

**Story Points:** 8

**Estimated Story Count:** 2-3 stories

**Complexity Factors:**

- Multi-stage Docker builds
- nginx configuration for SPA routing
- Volume permission handling
- Cross-platform testing (Linux, Mac, Windows)

## Stakeholders

| Role | Name | Interest |
|------|------|----------|
| End User | Busy Parent Sam | Simple deployment |
| End User | Organised Ollie | Reliable, reproducible setup |
| Developer | - | Consistent development environment |

## Story Breakdown

- [x] [US0009](../stories/US0009-backend-docker-config.md): Create Docker Configuration for Backend
- [x] [US0010](../stories/US0010-frontend-docker-config.md): Create Docker Configuration for Frontend
- [x] [US0011](../stories/US0011-docker-compose.md): Create Docker Compose Orchestration

## Test Plan

**Test Plan:** To be generated with `/sdlc-studio test-spec --epic EP0004`

| Test Suite | Type | Cases | Status |
|------------|------|-------|--------|
| Container build tests | Integration | TBD | Complete |
| Container health tests | Integration | TBD | Complete |
| Volume persistence tests | Integration | TBD | Complete |
| Minimal image tests | Integration | TBD | Complete |

### Minimal Image Verification Tests

Tests to verify only necessary files are deployed:

```bash
# Backend container should NOT contain:
docker run --rm backend:latest ls /app/tests          # Should fail (no tests dir)
docker run --rm backend:latest pip list | grep pytest # Should fail (no pytest)
docker run --rm backend:latest find /app -name "*.md" # Should return nothing

# Frontend container should NOT contain:
docker run --rm frontend:latest ls /node_modules      # Should fail (no node_modules)
docker run --rm frontend:latest ls /app/src           # Should fail (no source)
docker run --rm frontend:latest ls /app/e2e           # Should fail (no tests)

# Image size verification:
docker images backend:latest --format "{{.Size}}"     # Should be < 200MB
docker images frontend:latest --format "{{.Size}}"    # Should be < 50MB
```

## Open Questions

- [x] Should we use single container (backend serves frontend) or separate containers? - Owner: Architecture
  **Decision:** Separate containers for flexibility and best practice separation of concerns

- [x] Which nginx image base: alpine or debian-slim? - Owner: Technical
  **Decision:** nginx:alpine for smallest image size

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial epic created for Docker containerisation |
| 2026-01-23 | Claude | Added minimal deployment requirements, .dockerignore specs, multi-stage build strategy |
| 2026-01-23 | Claude | Generated stories US0009, US0010, US0011 |
| 2026-01-23 | Claude | Epic completed |

