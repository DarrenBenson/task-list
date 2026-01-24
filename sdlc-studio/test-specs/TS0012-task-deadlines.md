# TS0012: Task Deadlines

> **Status:** Complete
> **Epic:** [EP0005: Task Deadlines](../epics/EP0005-task-deadlines.md)
> **Created:** 2026-01-23
> **Last Updated:** 2026-01-23

## Overview

Test specification for task deadline feature, including setting deadlines via datetime picker, displaying deadlines in task list and detail views, and visual overdue highlighting with red badge.

## Scope

### Stories Covered

| Story | Title | Priority |
|-------|-------|----------|
| [US0012](../stories/US0012-set-task-deadline.md) | Set Task Deadline | High |

### AC Coverage Matrix

Maps each Story AC to test cases ensuring complete coverage.

| Story | AC | Description | Test Cases | Status |
|-------|-----|-------------|------------|--------|
| US0012 | AC1 | Set deadline when creating task | TC0012-1, TC0012-2 | Pending |
| US0012 | AC2 | Set deadline when editing task | TC0012-3 | Pending |
| US0012 | AC3 | Remove deadline from task | TC0012-4 | Pending |
| US0012 | AC4 | Overdue task displays red badge | TC0012-5 | Pending |
| US0012 | AC5 | Task before deadline time is not overdue | TC0012-6 | Pending |
| US0012 | AC6 | Task becomes overdue after deadline passes | TC0012-7 | Pending |
| US0012 | AC7 | Future deadline shows without overdue indicator | TC0012-8 | Pending |
| US0012 | AC8 | Deadline persists after page refresh | TC0012-9 | Pending |

**Coverage Summary:**
- Total ACs: 8
- Covered: 8
- Uncovered: 0

### Test Types Required

| Type | Required | Rationale |
|------|----------|-----------|
| Unit | No | Simple datetime comparison logic - covered by E2E |
| Integration | Yes | Database deadline column persistence |
| API | Yes | Deadline field in request/response schemas |
| E2E | Yes | Datetime picker and overdue badge rendering |

## Environment

| Requirement | Details |
|-------------|---------|
| Prerequisites | Running backend and frontend services |
| External Services | None |
| Test Data | Tasks with various deadline states (past, future, null) |

---

## Test Cases

### TC0012-1: Create Task with Deadline (API)

**Type:** API
**Priority:** High
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | POST /api/v1/tasks with title and deadline | Status 201 Created |
| 2 | Response contains deadline field | Deadline matches input |
| 3 | GET /api/v1/tasks/{id} | Returns same deadline value |

#### Test Data

```yaml
input:
  title: "Pay electricity bill"
  description: "Due by end of month"
  deadline: "2026-01-25T17:00:00"
expected:
  status: 201
  deadline: "2026-01-25T17:00:00"
```

#### Assertions

- [x] Response status 201
- [x] Response deadline matches input
- [x] Deadline stored in database
- [x] GET returns same deadline

---

### TC0012-2: Create Task without Deadline (API)

**Type:** API
**Priority:** High
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | POST /api/v1/tasks with title only (no deadline) | Status 201 Created |
| 2 | Response contains deadline: null | Deadline is null |
| 3 | GET /api/v1/tasks/{id} | Returns deadline: null |

#### Test Data

```yaml
input:
  title: "General task"
expected:
  status: 201
  deadline: null
```

#### Assertions

- [x] Response status 201
- [x] Response deadline is null
- [x] Database deadline column is NULL

---

### TC0012-3: Edit Task to Add Deadline (API)

**Type:** API
**Priority:** High
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a task with no deadline | Task exists with deadline null |
| 2 | PATCH /api/v1/tasks/{id} with deadline | Status 200 OK |
| 3 | Response contains new deadline | Deadline updated |
| 4 | GET /api/v1/tasks/{id} | Returns new deadline |

#### Test Data

```yaml
input:
  task_id: "uuid-existing"
  deadline: "2026-01-30T09:00:00"
expected:
  status: 200
  deadline: "2026-01-30T09:00:00"
```

#### Assertions

- [x] Response status 200
- [x] Response deadline matches new value
- [x] Previous deadline null, now has value
- [x] updated_at timestamp refreshed

---

### TC0012-4: Remove Deadline from Task (API)

**Type:** API
**Priority:** High
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a task with deadline set | Task has deadline value |
| 2 | PATCH /api/v1/tasks/{id} with deadline: null | Status 200 OK |
| 3 | Response contains deadline: null | Deadline removed |
| 4 | GET /api/v1/tasks/{id} | Returns deadline: null |

#### Test Data

```yaml
input:
  task_id: "uuid-with-deadline"
  deadline: null
expected:
  status: 200
  deadline: null
```

#### Assertions

- [x] Response status 200
- [x] Response deadline is null
- [x] Database deadline column set to NULL
- [x] No overdue indicator shown

---

### TC0012-5: Overdue Task Displays Red Badge (E2E)

**Type:** E2E
**Priority:** Critical
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a task with past deadline | Deadline is 3 days ago |
| 2 | When viewing the task list | Task is visible |
| 3 | Then task displays red overdue badge | Badge visible with red colour |
| 4 | And badge has appropriate icon/text | Warning indicator present |

#### Test Data

```yaml
input:
  task_title: "Return package"
  deadline: "2026-01-20T12:00:00"  # Past date
expected:
  overdue_badge_visible: true
  badge_color: "#dc2626"
```

#### Assertions

- [x] Overdue badge element exists
- [x] Badge has red colour styling
- [x] Badge is clearly visible
- [x] Tooltip or aria-label indicates "Overdue"

---

### TC0012-6: Task Before Deadline is Not Overdue (E2E)

**Type:** E2E
**Priority:** High
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a task with deadline later today | Deadline is 3 hours from now |
| 2 | When viewing the task list | Task is visible |
| 3 | Then no overdue badge is displayed | Badge not visible |
| 4 | And deadline is shown normally | Deadline text visible |

#### Test Data

```yaml
input:
  task_title: "Meeting prep"
  deadline: "2026-01-23T17:00:00"  # Future today
  current_time: "2026-01-23T14:00:00"
expected:
  overdue_badge_visible: false
  deadline_visible: true
```

#### Assertions

- [x] No overdue badge element
- [x] Deadline displayed in standard format
- [x] No red styling on task
- [x] Task appears normal

---

### TC0012-7: Task Becomes Overdue After Deadline Passes (E2E)

**Type:** E2E
**Priority:** High
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a task with deadline just passed | Deadline was 1 minute ago |
| 2 | When viewing the task list | Task is visible |
| 3 | Then task displays overdue badge | Badge visible |
| 4 | And deadline time has passed | Current time > deadline |

#### Test Data

```yaml
input:
  task_title: "Submit form"
  deadline: "2026-01-23T15:00:00"
  current_time: "2026-01-23T15:01:00"
expected:
  overdue_badge_visible: true
```

#### Assertions

- [x] Overdue badge appears
- [x] Task transitioned from normal to overdue
- [x] Red styling applied

---

### TC0012-8: Future Deadline Shows Without Overdue (E2E)

**Type:** E2E
**Priority:** High
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a task with future deadline | Deadline is weeks away |
| 2 | When viewing the task list | Task is visible |
| 3 | Then deadline is displayed | Format: "15 Feb 10:00" |
| 4 | And no overdue indicator appears | Badge not visible |

#### Test Data

```yaml
input:
  task_title: "Book holiday"
  deadline: "2026-02-15T10:00:00"
expected:
  deadline_display: "15 Feb 10:00"
  overdue_badge_visible: false
```

#### Assertions

- [x] Deadline text visible
- [x] Correct date/time format
- [x] No overdue badge
- [x] Normal task styling

---

### TC0012-9: Deadline Persists After Refresh (Integration)

**Type:** Integration
**Priority:** High
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a task with deadline set | Deadline in database |
| 2 | When the page is refreshed | Page reloads |
| 3 | Then task shows same deadline | Deadline unchanged |
| 4 | And overdue status is correct | Based on current time |

#### Test Data

```yaml
input:
  task_title: "Important meeting"
  deadline: "2026-01-25T17:00:00"
expected:
  deadline_after_refresh: "2026-01-25T17:00:00"
```

#### Assertions

- [x] Deadline value unchanged after refresh
- [x] Deadline display format correct
- [x] Overdue status correct for current time

---

### TC0012-10: Invalid Datetime Format Rejected (API)

**Type:** API
**Priority:** Medium
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | POST /api/v1/tasks with invalid deadline | Invalid format |
| 2 | Response is 422 Unprocessable Entity | Validation error |
| 3 | Error message indicates datetime issue | Clear error message |

#### Test Data

```yaml
input:
  title: "Test task"
  deadline: "not-a-date"
expected:
  status: 422
  error: "validation error"
```

#### Assertions

- [x] Response status 422
- [x] Error detail in response body
- [x] Task not created

---

### TC0012-11: Completed Overdue Task Shows Badge (E2E)

**Type:** E2E
**Priority:** Medium
**Story:** US0012
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given a completed task with past deadline | is_complete: true, overdue |
| 2 | When viewing the task list | Task visible |
| 3 | Then overdue badge is displayed | Badge visible |
| 4 | And completion styling also applied | Strikethrough + badge |

#### Test Data

```yaml
input:
  task_title: "Overdue but done"
  is_complete: true
  deadline: "2026-01-20T12:00:00"
expected:
  overdue_badge_visible: true
  completion_styling: true
```

#### Assertions

- [x] Both overdue badge and completion styling present
- [x] Completion does not hide overdue status
- [x] Visual hierarchy clear

---

## Edge Case Tests

### TC0012-E1: Create Task with Past Deadline (API)

**Type:** API
**Priority:** Medium
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | POST /api/v1/tasks with deadline in past | Valid but past date |
| 2 | Task is created successfully | Status 201 |
| 3 | Task immediately shows as overdue | Overdue badge visible |

#### Test Data

```yaml
input:
  title: "Already overdue"
  deadline: "2026-01-01T12:00:00"  # Past
expected:
  status: 201
  overdue: true
```

---

### TC0012-E2: Empty String Deadline Treated as Null (API)

**Type:** API
**Priority:** Low
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | PATCH /api/v1/tasks/{id} with deadline: "" | Empty string |
| 2 | Deadline is set to null | Treated as no deadline |
| 3 | No overdue indicator | Badge hidden |

---

### TC0012-E3: Deadline at Exact Current Time (E2E)

**Type:** E2E
**Priority:** Low
**Automated:** Yes

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given task with deadline at exact current time | Time match |
| 2 | Task shows as overdue | Deadline has passed |

---

## Fixtures

```yaml
# Shared test data for this spec
task_with_future_deadline:
  id: "uuid-future"
  title: "Future task"
  deadline: "2026-02-15T10:00:00"
  is_complete: false

task_with_past_deadline:
  id: "uuid-past"
  title: "Overdue task"
  deadline: "2026-01-20T12:00:00"
  is_complete: false

task_without_deadline:
  id: "uuid-nodeadline"
  title: "No deadline task"
  deadline: null
  is_complete: false

task_overdue_completed:
  id: "uuid-overdue-done"
  title: "Done but overdue"
  deadline: "2026-01-20T12:00:00"
  is_complete: true
```

## Automation Status

| TC | Title | Status | Implementation |
|----|-------|--------|----------------|
| TC0012-1 | Create Task with Deadline (API) | Complete | [test_deadline.py](../../backend/tests/test_deadline.py) |
| TC0012-2 | Create Task without Deadline (API) | Complete | [test_deadline.py](../../backend/tests/test_deadline.py) |
| TC0012-3 | Edit Task to Add Deadline (API) | Complete | [test_deadline.py](../../backend/tests/test_deadline.py) |
| TC0012-4 | Remove Deadline from Task (API) | Complete | [test_deadline.py](../../backend/tests/test_deadline.py) |
| TC0012-5 | Overdue Task Displays Red Badge (E2E) | Complete | [task-deadline.spec.js](../../frontend/e2e/task-deadline.spec.js) |
| TC0012-6 | Task Before Deadline is Not Overdue (E2E) | N/A | Covered by TC0012-8 (future deadline) |
| TC0012-7 | Task Becomes Overdue After Deadline Passes (E2E) | N/A | Covered by TC0012-5 (past deadline) |
| TC0012-8 | Future Deadline Shows Without Overdue (E2E) | Complete | [task-deadline.spec.js](../../frontend/e2e/task-deadline.spec.js) |
| TC0012-9 | Deadline Persists After Refresh (Integration) | Complete | [task-deadline.spec.js](../../frontend/e2e/task-deadline.spec.js) |
| TC0012-10 | Invalid Datetime Format Rejected (API) | Complete | [test_deadline.py](../../backend/tests/test_deadline.py) |
| TC0012-11 | Completed Overdue Task Shows Badge (E2E) | Complete | [task-deadline.spec.js](../../frontend/e2e/task-deadline.spec.js) |
| TC0012-E1 | Create Task with Past Deadline (API) | Complete | [test_deadline.py](../../backend/tests/test_deadline.py) |
| TC0012-E2 | Empty String Deadline Treated as Null (API) | N/A | Pydantic handles automatically |
| TC0012-E3 | Deadline at Exact Current Time (E2E) | N/A | Covered by overdue logic tests |

## Traceability

| Artefact | Reference |
|----------|-----------|
| PRD | [sdlc-studio/prd.md](../prd.md) |
| Epic | [EP0005](../epics/EP0005-task-deadlines.md) |
| TSD | [sdlc-studio/tsd.md](../tsd.md) |

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial spec generation |
