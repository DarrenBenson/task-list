# US0012: Set Task Deadline

> **Status:** Complete
> **Epic:** [EP0005: Task Deadlines](../epics/EP0005-task-deadlines.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** Busy Parent Sam
**I want** to set a deadline date and time on my tasks
**So that** I can see which tasks are overdue and need urgent attention

## Context

### Persona Reference

**Busy Parent Sam** - Stay-at-home parent who needs to capture and track tasks quickly. Has time-sensitive tasks like bill payments and appointments.

[Full persona details](../personas.md#busy-parent-sam)

### Background

Currently all tasks appear the same regardless of urgency. Users with time-sensitive tasks (e.g., "Pay electricity bill by Friday 5pm") have no way to track deadlines or see which tasks are overdue. This feature adds an optional deadline datetime field and visual highlighting for overdue tasks.

## Inherited Constraints

Constraints inherited from parent Epic that apply to this Story.

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Scope | Date and time | Use HTML datetime-local input |
| Scope | Timezone uses browser local | Compare datetimes in frontend |
| Scope | Deadline is optional | Field nullable, UI shows "No deadline" |

### From PRD (via Epic)

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Performance | API <500ms | Deadline field adds minimal overhead |
| Security | Input validation | Validate date format on server |
| Constraint | Single-user | No per-user timezone settings |

> **Validation:** Each inherited constraint MUST be addressed in either AC, Edge Cases, or Technical Notes.

## Acceptance Criteria

### AC1: Set deadline when creating task

- **Given** I am on the task creation form
- **When** I enter a title "Pay electricity bill" and select deadline "2026-01-25 17:00"
- **Then** the task is created with deadline "2026-01-25T17:00:00"
- **And** the task list shows the deadline date and time next to the task

### AC2: Set deadline when editing task

- **Given** I have an existing task "Call dentist" with no deadline
- **When** I open the task detail, click edit, and set deadline to "2026-01-30 09:00"
- **Then** the task is saved with deadline "2026-01-30T09:00:00"
- **And** the updated deadline appears in the task list and detail view

### AC3: Remove deadline from task

- **Given** I have a task "Submit report" with deadline "2026-01-28T14:00:00"
- **When** I edit the task and clear the deadline field
- **Then** the task is saved with no deadline (null)
- **And** no deadline or overdue indicator appears for this task

### AC4: Overdue task displays red badge

- **Given** I have a task "Return package" with deadline "2026-01-20T12:00:00"
- **And** the current datetime is "2026-01-23T10:00:00"
- **When** I view the task list
- **Then** the task displays a red overdue badge/icon
- **And** the badge clearly indicates the task is overdue

### AC5: Task before deadline time is not overdue

- **Given** I have a task "Meeting prep" with deadline "2026-01-23T17:00:00"
- **And** the current datetime is "2026-01-23T14:00:00"
- **When** I view the task list
- **Then** the task does NOT display an overdue badge
- **And** the deadline is shown normally (due later today, not overdue)

### AC6: Task becomes overdue after deadline time passes

- **Given** I have a task "Submit form" with deadline "2026-01-23T15:00:00"
- **And** the current datetime is "2026-01-23T15:01:00"
- **When** I view the task list
- **Then** the task displays a red overdue badge/icon
- **And** the deadline time has passed

### AC7: Future deadline shows datetime without overdue indicator

- **Given** I have a task "Book holiday" with deadline "2026-02-15T10:00:00"
- **And** the current datetime is "2026-01-23T10:00:00"
- **When** I view the task list
- **Then** the deadline "15 Feb 10:00" is displayed
- **And** no overdue indicator appears

### AC8: Deadline persists after page refresh

- **Given** I have a task with deadline "2026-01-25T17:00:00"
- **When** I refresh the page
- **Then** the task still shows deadline "25 Jan 17:00"
- **And** the overdue status (if applicable) is correctly displayed

## Scope

### In Scope

- Add `deadline` nullable datetime field to Task model
- Datetime picker in task creation form
- Datetime picker in task edit form
- Deadline display (date and time) in task list items
- Deadline display in task detail view
- Overdue badge/icon for past deadlines (based on datetime comparison)
- API endpoints support deadline field
- Database migration for deadline column

### Out of Scope

- Deadline reminders/notifications
- Sorting by deadline
- Filtering by deadline/overdue status
- Recurring deadlines
- Timezone selection (uses browser local time)

## UI/UX Requirements

### Task Creation Form
- Add datetime picker field labelled "Deadline (optional)"
- Position below description field
- Use native HTML5 `datetime-local` input for accessibility
- Empty by default (no deadline)

### Task List Item
- Display deadline datetime if set (e.g., "Due: 25 Jan 17:00")
- If overdue: show red badge/icon before or after deadline text
- Overdue badge should be clearly visible (red colour, icon like warning/clock)
- Tasks without deadline show no deadline indicator

### Task Detail View
- Display deadline (date and time) in task details section
- Show "No deadline" if not set
- Edit mode: datetime picker pre-populated with current value
- Clear button to remove deadline

### Overdue Badge
- Red colour (#dc2626 or similar)
- Icon suggestion: exclamation mark, clock, or warning triangle
- Tooltip or aria-label: "Overdue"

### Datetime Display Format
- List view: "25 Jan 17:00" (compact)
- Detail view: "25 January 2026 at 17:00" (full)
- Use browser locale for formatting where possible

## Technical Notes

### Backend Changes

1. **Model** (`app/models.py`):
   ```python
   deadline = Column(DateTime, nullable=True)
   ```

2. **Schemas** (`app/schemas.py`):
   ```python
   deadline: Optional[datetime] = None
   ```

3. **API**: All task endpoints already support partial updates via PATCH. Deadline field will be included in create/update/get responses.

### Frontend Changes

1. **API Service**: Include `deadline` in task create/update payloads
2. **TaskForm**: Add `datetime-local` input field
3. **TaskDetail**: Display deadline datetime, allow edit
4. **TaskList/SortableTaskItem**: Display deadline and overdue badge
5. **Overdue Logic**: Compare deadline datetime to `new Date()` (browser local time)

### Database Migration

```sql
ALTER TABLE tasks ADD COLUMN deadline DATETIME;
```

### API Contracts

**Create Task (POST /api/v1/tasks)**

Request:
```json
{
  "title": "Pay electricity bill",
  "description": "Due by end of month",
  "deadline": "2026-01-25T17:00:00"
}
```

Response (201):
```json
{
  "id": "uuid",
  "title": "Pay electricity bill",
  "description": "Due by end of month",
  "is_complete": false,
  "position": 5,
  "deadline": "2026-01-25T17:00:00",
  "created_at": "2026-01-23T10:30:00Z",
  "updated_at": "2026-01-23T10:30:00Z"
}
```

**Task without deadline:**
```json
{
  "id": "uuid",
  "title": "General task",
  "deadline": null,
  ...
}
```

### Data Requirements

- Field: `deadline`
- Type: DATETIME (SQLite), datetime (Python), ISO 8601 string (JSON)
- Nullable: Yes
- Default: null
- Validation: Valid ISO 8601 datetime format, no past datetime validation (users can set past deadlines)

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Create task with no deadline | Task created with `deadline: null`, no deadline shown in UI |
| Create task with past deadline | Task created successfully, immediately shows as overdue |
| Edit task to remove deadline | `deadline` set to null, overdue indicator removed |
| Invalid datetime format in API | 422 Unprocessable Entity with validation error |
| Deadline 1 minute in future | Not overdue |
| Deadline 1 minute in past | Shows as overdue |
| Task completed but overdue | Still shows overdue badge (completion doesn't clear overdue) |
| Deadline with invalid datetime (e.g., 2026-02-30T25:00:00) | 422 validation error |
| Empty string for deadline | Treated as null (no deadline) |
| Deadline at exact current time | Shows as overdue (deadline has passed) |

## Test Scenarios

- [ ] Create task with deadline (date and time) via form
- [ ] Create task without deadline via form
- [ ] Edit task to add deadline
- [ ] Edit task to change deadline
- [ ] Edit task to remove deadline
- [ ] View overdue task (deadline datetime in past)
- [ ] View task due later today (not overdue)
- [ ] View task due in 1 minute (not overdue)
- [ ] View task that became overdue 1 minute ago (overdue)
- [ ] View task without deadline (no indicator)
- [ ] Overdue badge appears correctly
- [ ] Deadline persists after page refresh
- [ ] API rejects invalid datetime format
- [ ] Completed overdue task still shows overdue badge
- [ ] Datetime picker shows correct format

## Test Cases

| TC ID | Test Case | AC | Type | Status |
|-------|-----------|-----|------|--------|
| TC-D01 | Create task with deadline datetime | AC1 | E2E | Pending |
| TC-D02 | Create task without deadline | AC1 | E2E | Pending |
| TC-D03 | Edit task to add deadline | AC2 | E2E | Pending |
| TC-D04 | Remove deadline from task | AC3 | E2E | Pending |
| TC-D05 | Overdue badge displays for past deadline | AC4 | E2E | Pending |
| TC-D06 | Task before deadline time is not overdue | AC5 | E2E | Pending |
| TC-D07 | Task becomes overdue after deadline passes | AC6 | E2E | Pending |
| TC-D08 | Future deadline shows without overdue | AC7 | E2E | Pending |
| TC-D09 | Deadline persists after refresh | AC8 | E2E | Pending |
| TC-D10 | API deadline field validation | AC1-AC8 | API | Pending |
| TC-D11 | Database stores deadline correctly | AC8 | Integration | Pending |

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| [US0002](US0002-create-task.md) | Builds on | Task creation form | Done |
| [US0004](US0004-view-edit-task.md) | Builds on | Task detail/edit UI | Done |

### Schema Dependencies

| Schema | Source Story | Fields Needed |
|--------|--------------|---------------|
| Task | US0001 | id, title, description, is_complete, position |

### API Dependencies

| Endpoint | Source Story | How Used |
|----------|--------------|----------|
| POST /api/v1/tasks | US0002 | Add deadline field |
| PATCH /api/v1/tasks/{id} | US0004 | Update deadline field |
| GET /api/v1/tasks | US0003 | Return deadline field |

### External Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| None | - | - |

## Estimation

**Story Points:** 5

**Complexity:** Medium

- Backend: Datetime field addition (Low)
- Frontend: Datetime picker + overdue logic + formatting (Medium)
- Testing: Multiple datetime scenarios (Medium)

## Open Questions

None - all questions resolved during story creation.

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story created from user request |
| 2026-01-23 | Claude | Updated to datetime support (date + time) per epic change |
