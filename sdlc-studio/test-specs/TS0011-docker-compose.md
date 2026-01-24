# TS0011: Docker Compose Orchestration

> **Status:** Complete
> **Epic:** [EP0004: Docker Containerisation](../../epics/EP0004-docker-containerisation.md)
> **Created:** 2026-01-23
> **Last Updated:** 2026-01-23

## Overview

Test specification for Docker Compose orchestration, ensuring backend and frontend services are correctly containerised, networked, and persist data.

## Scope

### Stories Covered

| Story | Title | Priority |
|-------|-------|----------|
| [US0011](../../stories/US0011-docker-compose.md) | Create Docker Compose Orchestration | High |

### AC Coverage Matrix

| Story | AC | Description | Test Cases | Status |
|-------|-----|-------------|------------|--------|
| US0011 | AC1 | Single command startup | TC0011-1 | Pending |
| US0011 | AC2 | Service dependencies | TC0011-2 | Pending |
| US0011 | AC3 | Internal networking | TC0011-3 | Pending |
| US0011 | AC4 | SQLite persistence | TC0011-4 | Pending |
| US0011 | AC5 | Env var configuration | TC0011-5 | Pending |
| US0011 | AC6 | Health checks | TC0011-2 | Pending |
| US0011 | AC7 | Startup time | TC0011-6 | Pending |
| US0011 | AC8 | Dev override | TC0011-7 | Pending |
| US0011 | AC9 | Clean shutdown | TC0011-8 | Pending |
| US0011 | AC10 | Documentation | TC0011-9 | Pending |

**Coverage Summary:**
- Total ACs: 10
- Covered: 10
- Uncovered: 0

### Test Types Required

| Type | Required | Rationale |
|------|----------|-----------|
| Unit | No | Infrastructure orchestration doesn't require unit tests. |
| Integration | Yes | Verifying service connectivity and persistence. |
| API | Yes | Verifying frontend can proxy to backend. |
| E2E | No | Core functionality verified via integration. |

## Environment

| Requirement | Details |
|-------------|---------|
| Prerequisites | Docker, Docker Compose v2+ |
| External Services | None |
| Test Data | SQLite database file |

---

## Test Cases

### TC0011-1: Successful Stack Startup

**Type:** Integration
**Priority:** Critical
**Story:** US0011
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a clean environment | No task-list containers running |
| 2 | When running `docker compose up -d` | All containers start |
| 3 | Then all services should reach healthy status | `docker compose ps` shows healthy |

#### Test Data

```yaml
input: {}
expected:
  status: healthy
```

#### Assertions

- [ ] All containers started
- [ ] All containers show "healthy"

---

### TC0011-2: Service Health and Dependencies

**Type:** Integration
**Priority:** High
**Story:** US0011
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given the stack is starting | Backend starts first |
| 2 | When backend is healthy | Frontend starts |
| 3 | Then frontend proxy should be functional | Frontend can reach backend |

#### Assertions

- [ ] Backend healthy status reported
- [ ] Frontend healthy status reported
- [ ] `depends_on` condition observed

---

### TC0011-3: Internal Networking and Proxy

**Type:** API
**Priority:** Critical
**Story:** US0011
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given the stack is running | - |
| 2 | When requesting `/api/v1/tasks` via frontend port 80 | Request proxied to backend |
| 3 | Then a valid JSON list of tasks is returned | 200 OK |

#### Assertions

- [ ] Port 80 is accessible
- [ ] Proxy to backend works
- [ ] Response headers indicate nginx

---

### TC0011-4: Data Persistence

**Type:** Integration
**Priority:** High
**Story:** US0011
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a task is created in the running stack | Task exists in DB |
| 2 | When running `docker compose down` then `docker compose up -d` | Containers restarted |
| 3 | Then the task should still exist | Task visible in list |

#### Assertions

- [ ] Task persists across restart
- [ ] Volume is not deleted by default `down`

---

### TC0011-5: Environment Configuration

**Type:** Integration
**Priority:** Medium
**Story:** US0011
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a custom DATABASE_URL in environment | - |
| 2 | When the stack starts | Backend uses custom URL |
| 3 | Then database is initialized at that path | File created/used at path |

#### Assertions

- [ ] Env var propagates to backend
- [ ] Backend respects config

---

### TC0011-6: Startup Performance

**Type:** Performance
**Priority:** Medium
**Story:** US0011
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given images are cached | - |
| 2 | When running `docker compose up -d` | Stack starts |
| 3 | Then all services reach healthy within 10 seconds | Time < 10s |

#### Assertions

- [ ] Total startup time < 10s

---

### TC0011-7: Development Override

**Type:** Integration
**Priority:** Medium
**Story:** US0011
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given `docker-compose.override.yml` exists | - |
| 2 | When running `docker compose up -d` | Override applied |
| 3 | Then backend port 8000 is exposed | Port 8000 accessible |

#### Assertions

- [ ] Override merges correctly
- [ ] Debug ports accessible

---

### TC0011-8: Clean Shutdown

**Type:** Integration
**Priority:** Medium
**Story:** US0011
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given the stack is running | - |
| 2 | When running `docker compose down` | Containers stopped and removed |
| 3 | Then no task-list containers should remain | `docker ps -a` empty for project |

#### Assertions

- [ ] Containers removed
- [ ] Networks removed

---

### TC0011-9: Documentation Verification

**Type:** Manual
**Priority:** Low
**Story:** US0011
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given `DOCKER.md` exists | - |
| 2 | When following instructions | Stack starts/stops as described |
| 3 | Then instructions are accurate | No errors following guide |

---

## Fixtures

```yaml
# Shared test data for this spec
initial_task:
  title: "Test Persistence"
  description: "Verify volume work"
```

## Automation Status

| TC | Title | Status | Implementation |
|----|-------|--------|----------------|
| TC0011-1 | Successful Stack Startup | Automated | `tests/test_docker_compose.py::TestStackStartup` |
| TC0011-2 | Service Health and Dependencies | Automated | `tests/test_docker_compose.py::TestServiceDependencies` |
| TC0011-3 | Internal Networking and Proxy | Automated | `tests/test_docker_compose.py::TestNetworkingAndProxy` |
| TC0011-4 | Data Persistence | Automated | `tests/test_docker_compose.py::TestDataPersistence` |
| TC0011-5 | Environment Configuration | Automated | `tests/test_docker_compose.py::TestEnvironmentConfiguration` |
| TC0011-6 | Startup Performance | Automated | `tests/test_docker_compose.py::TestStartupPerformance` |
| TC0011-7 | Development Override | Automated | `tests/test_docker_compose.py::TestDevelopmentOverride` |
| TC0011-8 | Clean Shutdown | Automated | `tests/test_docker_compose.py::TestCleanShutdown` |
| TC0011-9 | Documentation Verification | Manual | N/A (human verification required) |

## Traceability

| Artefact | Reference |
|----------|-----------|
| PRD | [sdlc-studio/prd.md](../../prd.md) |
| Epic | [EP0004](../../epics/EP0004-docker-containerisation.md) |
| TSD | [sdlc-studio/tsd.md](../tsd.md) |

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial spec generation |
