# TS0002: Task Organisation

> **Status:** Complete
> **Epic:** [EP0002: Task Organisation](../../epics/EP0002-task-organisation.md)
> **Created:** 2026-01-23
> **Last Updated:** 2026-01-23

## Overview

Test specification for task organisation features, including completion tracking and drag-and-drop reordering. Ensures that users can manage their task priorities and progress effectively across both frontend and backend.

## Scope

### Stories Covered

| Story | Title | Priority |
|-------|-------|----------|
| [US0006](../../stories/US0006-toggle-completion.md) | Toggle Task Completion | High |
| [US0007](../../stories/US0007-reorder-tasks.md) | Reorder Tasks | High |

### AC Coverage Matrix

Maps each Story AC to test cases ensuring complete coverage.

| Story | AC | Description | Test Cases | Status |
|-------|-----|-------------|------------|--------|
| US0006 | AC1 | Checkbox is clickable | TC0002-1 | Covered |
| US0006 | AC2 | Completion updates immediately | TC0002-1 | Covered |
| US0006 | AC3 | Completed tasks visually distinct | TC0002-1 | Covered |
| US0006 | AC4 | Completion status persists | TC0002-2 | Covered |
| US0006 | AC5 | Toggle works both ways | TC0002-1 | Covered |
| US0007 | AC1 | Drag task to new position | TC0002-3 | Covered |
| US0007 | AC2 | Other tasks shift | TC0002-3 | Covered |
| US0007 | AC3 | Visual feedback during drag | TC0002-3 | Covered |
| US0007 | AC4 | New positions persist | TC0002-4 | Covered |
| US0007 | AC5 | API bulk reorder endpoint | TC0002-5 | Covered |

**Coverage Summary:**
- Total ACs: 10
- Covered: 10
- Uncovered: 0

### Test Types Required

| Type | Required | Rationale |
|------|----------|-----------|
| Unit | Yes | Logic for position recalculation in backend. |
| Integration | Yes | API endpoints for reorder and completion. |
| API | Yes | Contract verification for bulk update response. |
| E2E | Yes | Drag-and-drop interaction and visual feedback. |

## Environment

| Requirement | Details |
|-------------|---------|
| Prerequisites | Running backend and frontend services |
| External Services | None |
| Test Data | Existing tasks with sequential positions |

---

## Test Cases

### TC0002-1: Toggle Task Completion (E2E)

**Type:** E2E
**Priority:** High
**Story:** US0006
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a task list with an incomplete task | Task is visible with empty checkbox |
| 2 | When the user clicks the checkbox | Checkbox becomes checked immediately |
| 3 | Then the task text shows strikethrough | Visual distinction applied |
| 4 | And the click does not open the detail modal | Modal remains closed |
| 5 | When clicking the checkbox again | Task becomes incomplete again |

#### Test Data

```yaml
input:
  task_id: "uuid-1"
  initial_state: { is_complete: false }
expected:
  final_state: { is_complete: false }
```

#### Assertions

- [x] Checkbox toggles visually
- [x] Strikethrough style applied/removed
- [x] Task detail modal not triggered
- [x] Optimistic update reflected in UI

---

### TC0002-2: Persistent Completion Status (API)

**Type:** API
**Priority:** High
**Story:** US0006
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a task ID | Task exists in database |
| 2 | When PATCH /api/v1/tasks/{id} with `{"is_complete": true}` | API returns 200 OK |
| 3 | Then GET /api/v1/tasks/{id} | Returns `is_complete: true` |
| 4 | When the page is refreshed | Task displays as complete |

#### Assertions

- [x] API status code 200
- [x] Database reflects new status
- [x] Status survives session reload

---

### TC0002-3: Drag-and-Drop Reordering (E2E)

**Type:** E2E
**Priority:** Critical
**Story:** US0007
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given tasks A (pos 1) and B (pos 2) | List shows A then B |
| 2 | When user drags A below B | Visual indicator shows drop target |
| 3 | Then task A moves below B | Order becomes B then A |
| 4 | And task positions update visually | No page refresh occurred |

#### Test Data

```yaml
input:
  tasks: [{id: "A", pos: 1}, {id: "B", pos: 2}]
expected:
  order: ["B", "A"]
```

#### Assertions

- [x] Drag handle initiation works
- [x] Drop target indicator visible
- [x] Optimistic UI update successful
- [x] Sequential order maintained

---

### TC0002-4: Persistent Task Order (Integration)

**Type:** Integration
**Priority:** High
**Story:** US0007
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given multiple tasks with positions | - |
| 2 | When reordering via UI drag-and-drop | API PUT /reorder called |
| 3 | Then reload the page | Tasks remain in new order |
| 4 | And position values are sequential | 1, 2, 3... |

#### Assertions

- [x] Reorder persists across refresh
- [x] No gaps in position integers
- [x] All tasks included in DB update

---

### TC0002-5: Bulk Reorder API Contract (API)

**Type:** API
**Priority:** High
**Story:** US0007
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given task IDs [ID1, ID2, ID3] | Tasks exist in DB |
| 2 | When PUT /api/v1/tasks/reorder with `{ "task_ids": [ID2, ID3, ID1] }` | API returns 200 OK |
| 3 | Then response body contains all tasks | Array of 3 task objects |
| 4 | And tasks in response have positions [1, 2, 3] | Order matches request |

#### Test Data

```yaml
input:
  task_ids: ["uuid-2", "uuid-3", "uuid-1"]
expected:
  response_count: 3
  positions: [1, 2, 3]
```

#### Assertions

- [x] API status code 200
- [x] JSON response schema valid
- [x] Positions correctly reassigned in DB

---

## Fixtures

```yaml
# Shared test data for this spec
standard_tasks:
  - id: "uuid-1"
    title: "First Task"
    position: 1
    is_complete: false
  - id: "uuid-2"
    title: "Second Task"
    position: 2
    is_complete: false
```

## Automation Status

| TC | Title | Status | Implementation |
|----|-------|--------|----------------|
| TC0002-1 | Toggle Task Completion (E2E) | Complete | [ts0002-task-organisation.spec.js](../../frontend/e2e/ts0002-task-organisation.spec.js) |
| TC0002-2 | Persistent Completion Status (API) | Complete | [test_ts0002_task_organisation.py](../../backend/tests/test_ts0002_task_organisation.py) |
| TC0002-3 | Drag-and-drop Reordering (E2E) | Complete | [ts0002-task-organisation.spec.js](../../frontend/e2e/ts0002-task-organisation.spec.js) |
| TC0002-4 | Persistent Task Order (Integration) | Complete | [test_ts0002_task_organisation.py](../../backend/tests/test_ts0002_task_organisation.py) |
| TC0002-5 | Bulk Reorder API Contract (API) | Complete | [test_ts0002_task_organisation.py](../../backend/tests/test_ts0002_task_organisation.py) |

## Traceability

| Artefact | Reference |
|----------|-----------|
| PRD | [sdlc-studio/prd.md](../../prd.md) |
| Epic | [EP0002](../../epics/EP0002-task-organisation.md) |
| TSD | [sdlc-studio/tsd.md](../tsd.md) |

## Lessons Learned

<!-- Optional section. Document issues discovered during testing that should inform future test design. -->

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial spec generation |
| 2026-01-23 | Claude | Automated test generation and verification |

