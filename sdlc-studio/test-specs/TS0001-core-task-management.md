# TS0001: Core Task Management

> **Status:** Complete
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Created:** 2026-01-23
> **Last Updated:** 2026-01-23

## Overview

Test specification for core task management functionality including project setup validation, task CRUD operations (create, read, update, delete), and frontend UI components.

## Scope

### Stories Covered

| Story | Title | Priority |
|-------|-------|----------|
| [US0001](../stories/US0001-project-setup.md) | Project Setup and Database Foundation | High |
| [US0002](../stories/US0002-create-task.md) | Create Task | High |
| [US0003](../stories/US0003-view-task-list.md) | View Task List | High |
| [US0004](../stories/US0004-view-edit-task.md) | View and Edit Task Details | High |
| [US0005](../stories/US0005-delete-task.md) | Delete Task | High |

### AC Coverage Matrix

Maps each Story AC to test cases ensuring complete coverage.

| Story | AC | Description | Test Cases | Status |
|-------|-----|-------------|------------|--------|
| US0001 | AC1 | Backend project structure exists | TC001 | Covered |
| US0001 | AC2 | Task database model is defined | TC002 | Covered |
| US0001 | AC3 | Database can be initialised | TC003 | Covered |
| US0001 | AC4 | Frontend project structure exists | TC004 | Covered |
| US0001 | AC5 | Development servers can start | TC005 | Covered |
| US0002 | AC1 | Task creation form is accessible | TC006 | Covered |
| US0002 | AC2 | Valid task is created successfully | TC007, TC008 | Covered |
| US0002 | AC3 | Task with description is created | TC009 | Covered |
| US0002 | AC4 | Title validation is enforced | TC010, TC011 | Covered |
| US0002 | AC5 | Character limits are enforced | TC012, TC013 | Covered |
| US0003 | AC1 | Task list displays on page load | TC014 | Covered |
| US0003 | AC2 | Task list item shows key information | TC015 | Covered |
| US0003 | AC3 | Completed tasks are visually distinct | TC016 | Covered |
| US0003 | AC4 | Empty state is displayed | TC017 | Covered |
| US0003 | AC5 | List updates after task creation | TC018 | Covered |
| US0004 | AC1 | Task detail view is accessible | TC019 | Covered |
| US0004 | AC2 | User can edit task title | TC020 | Covered |
| US0004 | AC3 | User can edit task description | TC021 | Covered |
| US0004 | AC4 | Edit validation is enforced | TC022 | Covered |
| US0004 | AC5 | User can cancel edit | TC023 | Covered |
| US0004 | AC6 | User can return to list | TC024 | Covered |
| US0005 | AC1 | Delete option is accessible | TC025 | Covered |
| US0005 | AC2 | Confirmation is required | TC026 | Covered |
| US0005 | AC3 | Confirmed deletion removes task | TC027 | Covered |
| US0005 | AC4 | Cancelled deletion preserves task | TC028 | Covered |
| US0005 | AC5 | Delete from detail view | TC029 | Covered |

**Coverage Summary:**
- Total ACs: 22
- Covered: 22
- Uncovered: 0

### Test Types Required

| Type | Required | Rationale |
|------|----------|-----------|
| Unit | Yes | Backend models, schemas, validation logic |
| Integration | Yes | API endpoints with database |
| API | Yes | REST endpoint contracts |
| E2E | Yes | User flows through UI |

## Environment

| Requirement | Details |
|-------------|---------|
| Prerequisites | Python 3.10+, Node.js 18+, SQLite |
| External Services | None |
| Test Data | In-memory SQLite, fixture data |

---

## Test Cases

### TC001: Backend project structure exists

**Type:** unit
**Priority:** High
**Story:** US0001/AC1
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given backend directory exists | Directory present |
| 2 | When checking for required files | Files found |
| 3 | Then main.py, database.py, models.py, schemas.py exist | All files present |

#### Assertions

- [ ] app/main.py exists and contains FastAPI instance
- [ ] app/database.py exists with session management
- [ ] app/models.py exists with Task model
- [ ] app/schemas.py exists with Pydantic schemas

---

### TC002: Task database model is defined correctly

**Type:** unit
**Priority:** High
**Story:** US0001/AC2
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given Task model is imported | Model available |
| 2 | When inspecting model fields | Fields match spec |
| 3 | Then all required fields exist with correct types | Schema valid |

#### Test Data

```yaml
input:
  model: Task
expected:
  fields:
    id: UUID, primary_key
    title: String(200), not nullable
    description: String(2000), nullable
    is_complete: Boolean, default False
    position: Integer, not nullable
    created_at: DateTime
    updated_at: DateTime
```

#### Assertions

- [ ] Task has id field as UUID primary key
- [ ] Task has title field max 200 chars, not nullable
- [ ] Task has description field max 2000 chars, nullable
- [ ] Task has is_complete boolean defaulting to False
- [ ] Task has position integer not nullable
- [ ] Task has created_at and updated_at timestamps

---

### TC003: Database initialises on startup

**Type:** integration
**Priority:** High
**Story:** US0001/AC3
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given no database file exists | Clean state |
| 2 | When application starts | Database created |
| 3 | Then tasks table exists with correct schema | Table ready |

#### Assertions

- [ ] Database file is created
- [ ] Tasks table exists
- [ ] Table has all required columns

---

### TC004: Frontend project structure exists

**Type:** unit
**Priority:** High
**Story:** US0001/AC4
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given frontend directory exists | Directory present |
| 2 | When checking for required files | Files found |
| 3 | Then App.jsx, main.jsx, package.json exist | All files present |

#### Assertions

- [ ] src/App.jsx exists
- [ ] src/main.jsx exists
- [ ] package.json contains React 18 and Vite

---

### TC005: Development servers start correctly

**Type:** integration
**Priority:** High
**Story:** US0001/AC5
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given dependencies are installed | Ready to start |
| 2 | When starting backend server | Server runs |
| 3 | Then FastAPI serves on port 8000 with /docs | API accessible |

#### Assertions

- [ ] Backend starts on port 8000
- [ ] Swagger UI accessible at /docs
- [ ] Frontend starts on port 5173

---

### TC006: Task creation form is accessible

**Type:** e2e
**Priority:** High
**Story:** US0002/AC1
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given user opens the application | Page loads |
| 2 | When page renders | Form visible |
| 3 | Then title input, description textarea, submit button visible | Form ready |

#### Assertions

- [ ] Title input field is visible
- [ ] Description textarea is visible
- [ ] Submit button is visible

---

### TC007: Valid task is created via API

**Type:** api
**Priority:** Critical
**Story:** US0002/AC2
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given valid task data | Data ready |
| 2 | When POST /api/v1/tasks/ | Request sent |
| 3 | Then 201 returned with task object | Task created |

#### Test Data

```yaml
input:
  title: "Call dentist"
  description: null
expected:
  status_code: 201
  body:
    id: UUID
    title: "Call dentist"
    description: null
    is_complete: false
    position: 1
```

#### Assertions

- [ ] Response status is 201
- [ ] Response contains valid UUID id
- [ ] Title matches input
- [ ] is_complete is false
- [ ] position is assigned
- [ ] timestamps are set

---

### TC008: Task appears in list after creation

**Type:** e2e
**Priority:** High
**Story:** US0002/AC2
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given user is on task list | Page ready |
| 2 | When user creates task "Call dentist" | Form submitted |
| 3 | Then task appears in list, form clears | List updated |

#### Assertions

- [ ] Task "Call dentist" appears in list
- [ ] Form fields are cleared
- [ ] No page refresh required

---

### TC009: Task with description is created

**Type:** api
**Priority:** High
**Story:** US0002/AC3
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given task data with description | Data ready |
| 2 | When POST /api/v1/tasks/ | Request sent |
| 3 | Then task created with description | Description stored |

#### Test Data

```yaml
input:
  title: "Prepare presentation"
  description: "Include Q4 sales figures and projections"
expected:
  status_code: 201
  body:
    title: "Prepare presentation"
    description: "Include Q4 sales figures and projections"
```

#### Assertions

- [ ] Response status is 201
- [ ] Description is stored correctly

---

### TC010: Empty title is rejected

**Type:** api
**Priority:** High
**Story:** US0002/AC4
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given empty title | Invalid data |
| 2 | When POST /api/v1/tasks/ | Request sent |
| 3 | Then 422 returned with validation error | Rejected |

#### Test Data

```yaml
input:
  title: ""
expected:
  status_code: 422
  body:
    detail: contains "field required" or "min_length"
```

#### Assertions

- [ ] Response status is 422
- [ ] Error message indicates title required

---

### TC011: Whitespace-only title is rejected

**Type:** api
**Priority:** High
**Story:** US0002/AC4
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given whitespace-only title | Invalid data |
| 2 | When POST /api/v1/tasks/ | Request sent |
| 3 | Then 422 returned | Rejected |

#### Test Data

```yaml
input:
  title: "   "
expected:
  status_code: 422
```

#### Assertions

- [ ] Response status is 422
- [ ] Error indicates title cannot be blank

---

### TC012: Title at max length (200 chars) is accepted

**Type:** api
**Priority:** Medium
**Story:** US0002/AC5
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given title with 200 characters | Max length |
| 2 | When POST /api/v1/tasks/ | Request sent |
| 3 | Then 201 returned | Accepted |

#### Assertions

- [ ] Response status is 201
- [ ] Title stored with all 200 characters

---

### TC013: Title exceeding max length (201 chars) is rejected

**Type:** api
**Priority:** Medium
**Story:** US0002/AC5
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given title with 201 characters | Over limit |
| 2 | When POST /api/v1/tasks/ | Request sent |
| 3 | Then 422 returned | Rejected |

#### Assertions

- [ ] Response status is 422
- [ ] Error indicates max length exceeded

---

### TC014: Task list displays on page load

**Type:** api
**Priority:** High
**Story:** US0003/AC1
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given tasks exist in database | Data present |
| 2 | When GET /api/v1/tasks/ | Request sent |
| 3 | Then all tasks returned sorted by position | List retrieved |

#### Assertions

- [ ] Response status is 200
- [ ] Response is array of tasks
- [ ] Tasks sorted by position ascending

---

### TC015: Task list item shows key information

**Type:** e2e
**Priority:** High
**Story:** US0003/AC2
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given task "Call dentist" exists | Data present |
| 2 | When viewing task list | List displayed |
| 3 | Then task shows title and checkbox | Info visible |

#### Assertions

- [ ] Task title is displayed
- [ ] Completion checkbox is visible
- [ ] Tasks maintain position order

---

### TC016: Completed tasks are visually distinct

**Type:** e2e
**Priority:** Medium
**Story:** US0003/AC3
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given completed task exists | Task complete |
| 2 | When viewing task list | List displayed |
| 3 | Then completed task has strikethrough and muted style | Visually distinct |

#### Assertions

- [ ] Completed task has strikethrough text
- [ ] Completed task has muted/greyed colour
- [ ] Completed task remains in position

---

### TC017: Empty state is displayed

**Type:** e2e
**Priority:** Medium
**Story:** US0003/AC4
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given no tasks exist | Empty database |
| 2 | When viewing task list | Page loads |
| 3 | Then friendly empty message shown | Empty state visible |

#### Assertions

- [ ] Empty state message is displayed
- [ ] Message encourages task creation

---

### TC018: List updates after task creation

**Type:** e2e
**Priority:** High
**Story:** US0003/AC5
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given user is viewing task list | List visible |
| 2 | When user creates new task | Task created |
| 3 | Then new task appears without refresh | List updated |

#### Assertions

- [ ] New task appears in list immediately
- [ ] No page refresh required

---

### TC019: Task detail view is accessible

**Type:** e2e
**Priority:** High
**Story:** US0004/AC1
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given task exists | Task in database |
| 2 | When user clicks on task | Click action |
| 3 | Then detail modal opens with title, description, timestamps | Detail visible |

#### Assertions

- [ ] Modal opens on click
- [ ] Title is displayed
- [ ] Description is displayed
- [ ] Timestamps are formatted and displayed
- [ ] Edit button is visible

---

### TC020: User can edit task title via API

**Type:** api
**Priority:** High
**Story:** US0004/AC2
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given task exists | Task in database |
| 2 | When PATCH /api/v1/tasks/{id} with new title | Request sent |
| 3 | Then 200 returned with updated task | Title updated |

#### Test Data

```yaml
input:
  title: "Call dentist - Dr Smith"
expected:
  status_code: 200
  body:
    title: "Call dentist - Dr Smith"
```

#### Assertions

- [ ] Response status is 200
- [ ] Title is updated
- [ ] updated_at timestamp is refreshed

---

### TC021: User can edit task description via API

**Type:** api
**Priority:** High
**Story:** US0004/AC3
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given task with no description | Task in database |
| 2 | When PATCH with description | Request sent |
| 3 | Then description is updated | Change saved |

#### Test Data

```yaml
input:
  description: "Book for next Tuesday"
expected:
  status_code: 200
  body:
    description: "Book for next Tuesday"
```

#### Assertions

- [ ] Response status is 200
- [ ] Description is updated
- [ ] updated_at timestamp is refreshed

---

### TC022: Edit validation rejects empty title

**Type:** api
**Priority:** High
**Story:** US0004/AC4
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given task exists | Task in database |
| 2 | When PATCH with empty title | Request sent |
| 3 | Then 422 returned | Rejected |

#### Test Data

```yaml
input:
  title: ""
expected:
  status_code: 422
```

#### Assertions

- [ ] Response status is 422
- [ ] Task is not modified

---

### TC023: User can cancel edit

**Type:** e2e
**Priority:** Medium
**Story:** US0004/AC5
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given user is editing task | Edit mode active |
| 2 | When user clicks cancel | Cancel clicked |
| 3 | Then changes are discarded, original values shown | Edit cancelled |

#### Assertions

- [ ] Changes are not saved
- [ ] Original title displayed
- [ ] Original description displayed

---

### TC024: User can return to list from detail view

**Type:** e2e
**Priority:** Medium
**Story:** US0004/AC6
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given user is viewing task detail | Detail visible |
| 2 | When user clicks close | Close clicked |
| 3 | Then modal closes, list visible | Returned to list |

#### Assertions

- [ ] Modal closes
- [ ] Task list is visible

---

### TC025: Delete option is accessible

**Type:** e2e
**Priority:** High
**Story:** US0005/AC1
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given task exists | Task in database |
| 2 | When user views task detail | Detail visible |
| 3 | Then delete button is visible | Delete accessible |

#### Assertions

- [ ] Delete button is visible in detail view

---

### TC026: Confirmation dialog appears on delete

**Type:** e2e
**Priority:** High
**Story:** US0005/AC2
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given user is viewing task "Call dentist" | Detail visible |
| 2 | When user clicks delete | Delete clicked |
| 3 | Then confirmation dialog appears with title and warning | Confirmation shown |

#### Assertions

- [ ] Dialog shows task title
- [ ] Dialog shows "This cannot be undone" warning
- [ ] Confirm and Cancel buttons visible

---

### TC027: Confirmed deletion removes task via API

**Type:** api
**Priority:** Critical
**Story:** US0005/AC3
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given task exists | Task in database |
| 2 | When DELETE /api/v1/tasks/{id} | Request sent |
| 3 | Then 204 returned, task removed | Task deleted |

#### Test Data

```yaml
input:
  task_id: existing_task_uuid
expected:
  status_code: 204
  body: empty
```

#### Assertions

- [ ] Response status is 204
- [ ] Task no longer exists in database
- [ ] GET for same task returns 404

---

### TC028: Cancelled deletion preserves task

**Type:** e2e
**Priority:** Medium
**Story:** US0005/AC4
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given confirmation dialog is showing | Dialog visible |
| 2 | When user clicks cancel | Cancel clicked |
| 3 | Then dialog closes, task remains | Task preserved |

#### Assertions

- [ ] Dialog closes
- [ ] Task still in list
- [ ] No API call made

---

### TC029: Delete from detail view returns to list

**Type:** e2e
**Priority:** Medium
**Story:** US0005/AC5
**Automated:** No

#### Scenario

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Given user is in task detail view | Detail visible |
| 2 | When user deletes and confirms | Delete confirmed |
| 3 | Then task deleted, user returns to list | Back to list |

#### Assertions

- [ ] Task is deleted
- [ ] Detail modal closes
- [ ] Task removed from list

---

## Fixtures

```yaml
# Shared test data for this spec

valid_task:
  title: "Call dentist"
  description: "Book cleaning appointment"

task_with_long_title:
  title: "A" * 200  # Max length title

task_title_only:
  title: "Buy groceries"
  description: null

completed_task:
  title: "Finished task"
  is_complete: true
  position: 1

incomplete_task:
  title: "Todo task"
  is_complete: false
  position: 2
```

## Automation Status

| TC | Title | Status | Implementation |
|----|-------|--------|----------------|
| TC001 | Backend project structure exists | ✅ Done | `test_integration.py::TestProjectStructure` |
| TC002 | Task database model is defined correctly | ✅ Done | `test_models.py::TestTaskModel` |
| TC003 | Database initialises on startup | ✅ Done | `test_integration.py::TestDatabaseInitialisation` |
| TC004 | Frontend project structure exists | ✅ Done | `e2e/project-structure.spec.js` |
| TC005 | Development servers start correctly | ✅ Done | `e2e/project-structure.spec.js` |
| TC006 | Task creation form is accessible | ✅ Done | `e2e/task-form.spec.js` |
| TC007 | Valid task is created via API | ✅ Done | `test_api_tasks.py::TestCreateTask` |
| TC008 | Task appears in list after creation | ✅ Done | `e2e/task-form.spec.js` |
| TC009 | Task with description is created | ✅ Done | `test_api_tasks.py::TestCreateTask` |
| TC010 | Empty title is rejected | ✅ Done | `test_api_tasks.py`, `test_schemas.py` |
| TC011 | Whitespace-only title is rejected | ✅ Done | `test_api_tasks.py`, `test_schemas.py` |
| TC012 | Title at max length is accepted | ✅ Done | `test_api_tasks.py`, `test_schemas.py` |
| TC013 | Title exceeding max length is rejected | ✅ Done | `test_api_tasks.py`, `test_schemas.py` |
| TC014 | Task list displays on page load | ✅ Done | `test_api_tasks.py::TestListTasks` |
| TC015 | Task list item shows key information | ✅ Done | `e2e/task-list.spec.js` |
| TC016 | Completed tasks are visually distinct | ✅ Done | `e2e/task-list.spec.js` |
| TC017 | Empty state is displayed | ✅ Done | `e2e/task-list.spec.js` |
| TC018 | List updates after task creation | ✅ Done | `e2e/task-form.spec.js` |
| TC019 | Task detail view is accessible | ✅ Done | `e2e/task-detail.spec.js` |
| TC020 | User can edit task title via API | ✅ Done | `test_api_tasks.py::TestUpdateTask` |
| TC021 | User can edit task description via API | ✅ Done | `test_api_tasks.py::TestUpdateTask` |
| TC022 | Edit validation rejects empty title | ✅ Done | `test_api_tasks.py::TestUpdateTask` |
| TC023 | User can cancel edit | ✅ Done | `e2e/task-detail.spec.js` |
| TC024 | User can return to list from detail view | ✅ Done | `e2e/task-detail.spec.js` |
| TC025 | Delete option is accessible | ✅ Done | `e2e/task-delete.spec.js` |
| TC026 | Confirmation dialog appears on delete | ✅ Done | `e2e/task-delete.spec.js` |
| TC027 | Confirmed deletion removes task via API | ✅ Done | `test_api_tasks.py::TestDeleteTask` |
| TC028 | Cancelled deletion preserves task | ✅ Done | `e2e/task-delete.spec.js` |
| TC029 | Delete from detail view returns to list | ✅ Done | `e2e/task-delete.spec.js` |

**Backend Test Coverage:** 97% (68 pytest tests)
**Frontend E2E Coverage:** 100% (33 Playwright tests)

## Traceability

| Artefact | Reference |
|----------|-----------|
| PRD | [sdlc-studio/prd.md](../prd.md) |
| Epic | [EP0001](../epics/EP0001-core-task-management.md) |
| TSD | [sdlc-studio/tsd.md](../tsd.md) |

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial spec generation |
| 2026-01-23 | Claude | Backend test automation (16/29 tests) |
| 2026-01-23 | Claude | E2E test automation with Playwright (29/29 tests) |
