# Test Strategy Document

> **Project:** Task Management System
> **Version:** 1.0
> **Last Updated:** 2026-01-23
> **Owner:** Development Team

## Overview

This document defines the test strategy for a single-user task management web application. The system consists of a FastAPI backend with SQLite database and a React SPA frontend. Testing focuses on ensuring CRUD operations work correctly, drag-and-drop reordering persists accurately, and the UI provides appropriate feedback.

## Test Objectives

- Verify all CRUD operations work correctly via API
- Ensure task ordering persists across sessions
- Validate frontend displays correct task state
- Confirm error handling provides appropriate user feedback
- Verify performance meets NFR targets (500ms API, 1s render)

## Scope

### In Scope

- Backend API endpoint testing (unit, integration)
- Database operations and data integrity
- Frontend component testing
- Frontend-backend integration (E2E)
- Input validation (client and server)
- Error state handling

### Out of Scope

- Load testing (single-user system)
- Security penetration testing (no authentication)
- Accessibility testing (manual only)
- Cross-browser testing beyond stated browsers (Chrome, Firefox, Safari, Edge)

## Test Levels

### Coverage Targets

**Default: 90% line coverage**

| Level | Target | Rationale |
|-------|--------|-----------|
| Unit | 90% | Core business logic must be thoroughly tested |
| Integration | 85% | API and database interactions |
| E2E | 100% feature coverage | Every user-visible feature has at least one spec file |

**Why 90%?** AI-assisted development produces code faster than traditional development. Higher coverage gates ensure AI-generated code is correct and catches hallucinations early. This target has been proven achievable with AI assistance across multiple projects.

### Unit Testing

| Attribute | Value |
|-----------|-------|
| Coverage Target | 90% (see Coverage Targets above) |
| Framework | pytest (backend), Vitest (frontend) |
| Responsibility | Developers |
| Execution | Pre-commit, CI on every push |

**Backend Focus Areas:**
- Task model validation
- Position calculation logic
- Timestamp handling
- Schema validation (Pydantic)

**Frontend Focus Areas:**
- Component rendering
- State management hooks
- Form validation
- Utility functions

### Integration Testing

| Attribute | Value |
|-----------|-------|
| Scope | API endpoints with database |
| Framework | pytest with TestClient, httpx |
| Responsibility | Developers |
| Execution | CI on every push |

**Focus Areas:**
- Full request/response cycle per endpoint
- Database transaction integrity
- Position uniqueness constraints
- Error response format consistency

### End-to-End Testing

| Attribute | Value |
|-----------|-------|
| Scope | Complete user workflows through browser |
| Framework | Playwright |
| Responsibility | Developers |
| Execution | CI on PR merge, pre-release |

**Focus Areas:**
- Task creation flow
- Task editing flow
- Task completion toggle
- Drag-and-drop reordering
- Task deletion with confirmation
- Error state display

### E2E Feature Coverage Matrix

**Target:** One spec file per user-visible feature area.

| Feature Area | Spec File | Test Count | Status |
|--------------|-----------|------------|--------|
| Task Creation | `task-create.spec.ts` | 4+ | Planned |
| Task List View | `task-list.spec.ts` | 3+ | Planned |
| Task Details | `task-details.spec.ts` | 3+ | Planned |
| Task Editing | `task-edit.spec.ts` | 4+ | Planned |
| Task Completion | `task-complete.spec.ts` | 3+ | Planned |
| Task Reordering | `task-reorder.spec.ts` | 4+ | Planned |
| Task Deletion | `task-delete.spec.ts` | 3+ | Planned |

**Naming convention:** `[feature].spec.ts`

**Minimum per feature:**
- Happy path scenario
- Key error states
- Edge cases (empty list, character limits)

### API Contract Testing

**Purpose:** Bridge the gap between E2E tests (which mock APIs) and backend reality.

> **Critical insight:** E2E tests with mocked API data verify the frontend works correctly but do NOT catch backend bugs. If the backend omits a field from its response, E2E tests still pass because mocked data includes the field.

**Contract Test Pattern:**

For every field the frontend consumes:
1. Create real data via the API
2. Retrieve it via the endpoint being tested (no mocking)
3. Assert the expected field exists with correct type/value

**Example:**
```python
def test_task_response_includes_all_fields(client):
    """Contract: Frontend expects all Task fields."""
    # Create real data
    response = client.post("/api/v1/tasks", json={"title": "Test task"})
    task_id = response.json()["id"]

    # Retrieve via API (no mocking)
    response = client.get(f"/api/v1/tasks/{task_id}")
    task = response.json()

    # Assert contract
    assert "id" in task
    assert "title" in task
    assert "description" in task
    assert "is_complete" in task
    assert "position" in task
    assert "created_at" in task
    assert "updated_at" in task
```

### Performance Testing

| Attribute | Value |
|-----------|-------|
| Scope | API response times, frontend render times |
| Framework | pytest-benchmark (backend), Lighthouse (frontend) |
| Responsibility | Developers |
| Execution | Manual, pre-release |

**Targets (from NFR):**
- API endpoints: <500ms response
- Frontend render: <1000ms initial load
- Drag-and-drop: <16ms visual feedback (60fps)

### Security Testing

| Attribute | Value |
|-----------|-------|
| Scope | Input validation, SQL injection prevention |
| Tools | Manual review, pytest tests with malicious inputs |
| Responsibility | Developers |
| Execution | Code review, CI |

**Focus Areas:**
- SQL injection via task title/description
- XSS prevention in task display
- Input length validation enforcement

## Test Environments

| Environment | Purpose | URL | Data |
|-------------|---------|-----|------|
| Local | Development | localhost:5173 (frontend), localhost:8000 (backend) | SQLite test database |
| CI | Automated testing | N/A | In-memory SQLite |
| Docker | Container testing | Dynamic ports (see below) | SQLite in volume |

### Docker Test Environment

**Availability:** Docker and Docker Compose v2+ are available on localhost for integration testing.

**Port Allocation Strategy:**

Docker Compose tests should use dynamic or non-conflicting ports to avoid clashes with development servers:

| Service | Development Port | Docker Test Port | Notes |
|---------|------------------|------------------|-------|
| Frontend | 5173 (Vite) | 3000 (via override) | Nginx serves built assets |
| Backend | 8000 | 8000 (via override) | Direct access for debugging |
| Frontend (prod) | N/A | 80 | Production-like setup |

**Test Isolation:**

- Use unique project names: `docker compose -p task-list-test`
- Clean up before and after: `docker compose down -v --remove-orphans`
- Use `waitForResponse()` patterns in tests to avoid race conditions

**Docker Test Execution:**

Docker Compose tests are part of the standard test automation process:

```bash
# Run Docker tests after unit/integration tests pass
pytest tests/test_docker_compose.py -v
```

**Prerequisites:**
- Docker daemon running
- Docker Compose v2+ installed
- Ports 80, 3000, 8000 available (or use dynamic allocation)

**When to Run:**
- Pre-release validation
- After Dockerfile changes
- After docker-compose.yml changes
- CI pipeline (optional - requires Docker-in-Docker or similar)

## Test Data Strategy

### Approach

- **Fixtures:** Pytest fixtures for backend, Vitest beforeEach for frontend
- **Factory functions:** Create test tasks with sensible defaults
- **Isolation:** Each test starts with clean database state

### Sensitive Data

No sensitive data - single-user system without authentication or PII.

### Data Reset

- Backend: Use database transactions with rollback after each test
- Frontend: Mock API responses, no persistent state
- E2E: API calls to reset test database before each spec

## Automation Strategy

### Automation Candidates

- All regression tests for stable features
- Happy path scenarios for all user stories
- Critical business flows
- API contract validation
- All CRUD operations
- Position reordering logic

### Manual Testing

- Exploratory testing
- Usability assessment
- Drag-and-drop feel and responsiveness
- Visual appearance and layout
- Browser compatibility spot checks

### Automation Framework Stack

| Layer | Tool | Language |
|-------|------|----------|
| E2E/UI | Playwright | TypeScript |
| API | pytest + httpx | Python |
| Unit (Backend) | pytest | Python |
| Unit (Frontend) | Vitest | TypeScript |
| Coverage (Backend) | pytest-cov | Python |
| Coverage (Frontend) | V8 via Vitest | TypeScript |

## CI/CD Integration

### Pipeline Stages

1. **Pre-commit:** Linting (ruff, ESLint), formatting
2. **PR:** Unit tests + integration tests + coverage check
3. **Merge to main:** Full E2E suite
4. **Pre-release:** Full suite + manual smoke test

### Quality Gates

| Gate | Criteria | Blocking |
|------|----------|----------|
| Unit coverage | >= 90% | Yes |
| Integration tests | 100% pass | Yes |
| E2E critical path | 100% pass | Yes |
| E2E full suite | >= 95% pass | No (alerts) |
| Lint | Zero errors | Yes |

## Defect Management

### Severity Definitions

| Severity | Definition | SLA |
|----------|------------|-----|
| Critical | System unusable, data loss | Fix immediately |
| High | Major feature broken, no workaround | Fix before release |
| Medium | Feature impaired, workaround exists | Fix in next sprint |
| Low | Minor issue, cosmetic | Backlog |

### Defect Workflow

1. Discover defect (test failure or manual finding)
2. Create bug report with reproduction steps
3. Classify severity
4. Fix and add regression test
5. Verify fix
6. Close bug

## Reporting

### Metrics Tracked

- Test pass/fail rates by suite
- Code coverage trends
- Defect discovery rate
- Test execution time
- Flaky test percentage

### Reporting Cadence

- **Every push:** CI dashboard with pass/fail
- **Pre-release:** Full test report with coverage

## Roles & Responsibilities

| Role | Responsibilities |
|------|------------------|
| Developer | Unit tests, integration tests, E2E tests, fixing bugs |

(Single-developer project - all testing responsibilities combined)

## Tools & Infrastructure

| Purpose | Tool |
|---------|------|
| Test Management | Markdown test specs in sdlc-studio/ |
| CI/CD | GitHub Actions (recommended) |
| Browser Automation | Playwright |
| API Testing | pytest + httpx |
| Mocking | unittest.mock (Python), vi.mock (Vitest) |
| Coverage (Backend) | pytest-cov |
| Coverage (Frontend) | V8 via Vitest |
| Reporting | CI console output, coverage reports |

### Coverage Configuration

| Setting | Value | Notes |
|---------|-------|-------|
| Tool | pytest-cov (backend), V8 (frontend) | See language-specific below |
| Source | backend/app, frontend/src | Package directories |
| Branch | Yes | Branch coverage enabled |
| Threshold | 90% | Per Coverage Targets section |

**Python (Backend):**
```toml
# pyproject.toml
[tool.coverage.run]
source = ["app"]
branch = true

[tool.coverage.report]
fail_under = 90
```

**TypeScript (Frontend):**
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        lines: 90,
        branches: 85
      }
    }
  }
})
```

## Test Anti-Patterns

Document project-specific test pitfalls here as they are discovered.

### Conditional Assertion Anti-Pattern

**Problem:** Tests using `if result:` patterns silently pass when conditions aren't met.

```python
# BAD - silently passes if no tasks created
if tasks:
    assert tasks[0]["title"] == "Test"

# GOOD - fails explicitly if precondition not met
assert len(tasks) > 0, "Tasks should not be empty"
assert tasks[0]["title"] == "Test"
```

**Rule:** Never use `if` to guard test assertions. Use explicit assertions for preconditions.

### Position Calculation Tests

**Problem:** Testing reorder without verifying all tasks have correct positions.

```python
# BAD - only checks moved task
response = client.put("/api/v1/tasks/reorder", json={"task_positions": [...]})
assert response.json()["tasks"][0]["position"] == 1

# GOOD - verify all positions are sequential and unique
tasks = response.json()["tasks"]
positions = [t["position"] for t in tasks]
assert positions == list(range(1, len(tasks) + 1)), "Positions must be sequential"
```

### E2E Drag-and-Drop Tests

**Problem:** Drag-and-drop tests can be flaky due to timing.

**Rule:** Use explicit waits for position changes, not arbitrary delays:
```typescript
// BAD
await page.mouse.drop();
await page.waitForTimeout(500);

// GOOD
await page.mouse.drop();
await expect(page.locator('[data-position="1"]')).toHaveText('Moved Task');
```

### Project-Specific Pitfalls

*Document project-specific pitfalls as they are discovered during development.*

## Test Organisation

| Layer | Location | Pattern |
|-------|----------|---------|
| Backend Unit | `/backend/tests/` | `test_*.py` |
| Backend Integration | `/backend/tests/` | `test_api_*.py` |
| Frontend Unit | `/frontend/src/**/*.test.ts` | Co-located |
| E2E | `/frontend/e2e/` or `/e2e/` | `*.spec.ts` |

## Related Specifications

- [Product Requirements Document](prd.md)
- [Technical Requirements Document](trd.md)

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial TSD creation |
