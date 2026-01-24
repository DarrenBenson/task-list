# PL0011: Create Docker Compose Orchestration - Implementation Plan

> **Status:** Complete
> **Story:** [US0011: Create Docker Compose Orchestration](../stories/US0011-docker-compose.md)
> **Epic:** [EP0004: Docker Containerisation](../epics/EP0004-docker-containerisation.md)
> **Created:** 2026-01-23
> **Language:** YAML / Docker Compose

## Overview

Orchestrate the backend and frontend containers using Docker Compose. This includes defining service dependencies, networking, and volumes for SQLite persistence.

## Acceptance Criteria Summary

| AC | Name | Description |
|----|------|-------------|
| AC1 | Single command startup | `docker compose up` starts everything |
| AC2 | Service dependencies | Backend starts before frontend |
| AC3 | Internal networking | Frontend proxies to backend via Docker network |
| AC4 | SQLite persistence | Named volume `taskmanager-data` for database |
| AC5 | Env var configuration | Configurable database URL and proxy |
| AC6 | Health checks | Both containers show healthy status |
| AC7 | Startup time | Healthy within 10 seconds |
| AC8 | Dev override | Optional compose override for development |
| AC9 | Clean shutdown | `docker compose down` stops everything gracefully |
| AC10 | Documentation | Usage instructions in DOCKER.md |

## Technical Context

### Language & Framework

- **Primary Language:** YAML
- **Framework:** Docker Compose
- **Test Framework:** pytest (for integration tests)

### Relevant Best Practices

- Use `depends_on` with `condition: service_healthy`
- Use bridge network for container communication
- Use named volumes for persistence
- Omit obsolete `version` key
- Define healthchecks in Dockerfiles (already done in US0009/US0010)

### Library Documentation (Context7)

None required.

### Existing Patterns

- Backend Dockerfile exists (US0009)
- Frontend Dockerfile and nginx.conf exist (US0010)
- Backend expects database in `/app/data/` (container path)

## Recommended Approach

**Strategy:** Test-After
**Rationale:** Infrastructure orchestration is best verified by starting the services and checking connectivity and persistence.

### Test Priority

1. Services start and reach healthy status
2. Frontend can reach backend API via proxy
3. Data persists after restart
4. Backend is not exposed on host port (only frontend port 80)

### Documentation Updates Required

- [ ] Create `DOCKER.md` with usage instructions
- [ ] Update `README.md` to reference `DOCKER.md`

## Implementation Steps

### Phase 1: Core Orchestration

**Goal:** Create main docker-compose.yml

#### Step 1.1: Create docker-compose.yml

- [ ] Define backend service with volume and network
- [ ] Define frontend service with dependency on backend and port mapping
- [ ] Define named volume and network

**Files to modify:**
- `docker-compose.yml` - New file

### Phase 2: Development & Documentation

**Goal:** Create dev override and usage guides

#### Step 2.1: Create docker-compose.override.yml

- [ ] Expose backend port 8000 for debugging
- [ ] Add volume mount for backend source code

**Files to modify:**
- `docker-compose.override.yml` - New file

#### Step 2.2: Create DOCKER.md

- [ ] Add startup, shutdown, and volume management instructions

**Files to modify:**
- `DOCKER.md` - New file

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria are met

#### Step 3.1: Acceptance Criteria Verification

| AC1 | `docker compose up -d` | ✅ PASSED |
| AC2 | `docker compose ps` (check order/health) | ✅ PASSED |
| AC3 | `curl http://localhost/api/v1/tasks` | ✅ PASSED |
| AC4 | `docker volume inspect task-list_taskmanager-data` | ✅ PASSED |
| AC5 | Inspect compose environment vars | ✅ PASSED |
| AC6 | `docker compose ps` | ✅ PASSED |
| AC7 | Measure time to healthy | ✅ PASSED |
| AC8 | `docker compose config` | ✅ PASSED |
| AC9 | `docker compose down` | ✅ PASSED |
| AC10 | Read DOCKER.md | ✅ PASSED |

## Edge Case Handling Plan

### Edge Case Coverage

| # | Edge Case (from Story) | Handling Strategy | Implementation Phase | Validated |
|---|------------------------|-------------------|---------------------|-----------|
| 1 | Backend fails to start | Frontend will wait due to `depends_on` condition | Phase 1 | [ ] |
| 2 | Port 80 in use | Document error in DOCKER.md | Phase 2 | [ ] |
| 3 | Volume permissions | Use named volume (Docker managed) | Phase 1 | [ ] |
| 4 | Disk full | Reported in logs, graceful fail | Phase 1 | [ ] |
| 5 | Network conflict | Default bridge with unique project name | Phase 1 | [ ] |
| 6 | Health check fails | `docker compose ps` shows unhealthy | Phase 1 | [ ] |
| 7 | Ctrl+C during startup | Compose cleans up partial containers | Phase 1 | [ ] |
| 8 | compose down -v | Warning in DOCKER.md about data loss | Phase 2 | [ ] |

### Coverage Summary

- Story edge cases: 8
- Handled in plan: 8
- Unhandled: 0

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Port 80 conflict | Medium | Document how to change port in override |
| Connectivity issues | High | Use container names for hostnames in proxy |

## Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| US0009 | Story | Backend Dockerfile |
| US0010 | Story | Frontend Dockerfile |

## Open Questions

None.

## Definition of Done Checklist

- [ ] docker-compose.yml works as expected
- [ ] Persistence verified
- [ ] Documentation complete
- [ ] All AC met
