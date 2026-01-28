# US0002: Create Task

> **Status:** Complete
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** Busy Parent Sam
**I want** to create a new task with a title and optional description
**So that** I can quickly capture something before I forget it

## Context

### Persona Reference

**Busy Parent Sam** - Needs instant task capture (under 5 seconds). Often one-handed on phone. Values speed over features.

[Full persona details](../personas.md#busy-parent-sam)

### Background

Task creation is the most frequent operation. Sam needs to capture tasks in under 5 seconds - think of jotting down "Call dentist" while watching children. The form must be minimal and fast. Title is required, description is optional for when more context is needed.

## Inherited Constraints

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Success Metric | Task creation < 5 seconds | Minimal UI, fast API response |
| Risk | Data loss on crash | Persist immediately on submit |

### From PRD (via Epic)

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Performance | API responds within 500ms | POST /tasks must be fast |
| Security | Input validation client and server | Validate on both sides |
| Data | Title max 200 chars, description max 2000 chars | Enforce limits |

## Acceptance Criteria

### AC1: Task creation form is accessible

- **Given** the user is on the task list page
- **When** they look at the UI
- **Then** they see a task creation form with:
  - Title input field (visible, focused by default)
  - Description textarea (collapsed or minimal initially)
  - Submit button

### AC2: Valid task is created successfully

- **Given** the user has entered "Call dentist" in the title field
- **When** they submit the form
- **Then** the API receives POST /api/v1/tasks with `{"title": "Call dentist"}`
- **And** the API returns 201 with the created task including:
  - `id`: valid UUID
  - `title`: "Call dentist"
  - `description`: null
  - `is_complete`: false
  - `position`: next available position
  - `created_at`: current UTC timestamp
  - `updated_at`: current UTC timestamp
- **And** the new task appears in the task list immediately
- **And** the form clears for the next entry

### AC3: Task with description is created

- **Given** the user has entered "Prepare presentation" in title
- **And** entered "Include Q4 sales figures and projections" in description
- **When** they submit the form
- **Then** the task is created with both title and description
- **And** description is stored as "Include Q4 sales figures and projections"

### AC4: Title validation is enforced

- **Given** the user has left the title field empty
- **When** they attempt to submit the form
- **Then** the form shows "Title is required" error
- **And** the form is not submitted
- **And** the title field is focused

### AC5: Character limits are enforced

- **Given** the user has entered 201 characters in the title field
- **When** they attempt to submit
- **Then** the form shows "Title must be 200 characters or less"
- **And** the form is not submitted

## Scope

### In Scope

- POST /api/v1/tasks endpoint
- Task creation form component
- Client-side validation
- Server-side validation
- Optimistic UI update
- Form reset after success

### Out of Scope

- Viewing task list (US0003)
- Editing tasks (US0004)
- Position selection (auto-assigned to end)
- Keyboard shortcuts

## UI/UX Requirements

- Title field should be immediately visible and focusable
- Description field can be collapsed/expandable or always visible (small)
- Submit button should be clearly labelled ("Add Task" or similar)
- Error messages appear inline near the relevant field
- Loading state shown during API call
- Success feedback: task appears in list, form clears

## Technical Notes

### API Contract

**POST /api/v1/tasks**

Request:
```json
{
  "title": "Call dentist",
  "description": "Book cleaning appointment"  // optional
}
```

Response 201:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Call dentist",
  "description": "Book cleaning appointment",
  "is_complete": false,
  "position": 1,
  "created_at": "2026-01-23T10:30:00Z",
  "updated_at": "2026-01-23T10:30:00Z"
}
```

Response 422 (validation error):
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Data Requirements

- Position is auto-calculated as MAX(position) + 1, or 1 if no tasks exist
- Timestamps are UTC, ISO 8601 format
- UUID is generated server-side

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Empty title submitted | 422 error, "field required" message |
| Whitespace-only title | 422 error, "title cannot be blank" |
| Title exactly 200 chars | Accepted, task created |
| Title 201 chars | 422 error, "title must be 200 characters or less" |
| Description exactly 2000 chars | Accepted, task created |
| Description 2001 chars | 422 error, "description must be 2000 characters or less" |
| Network failure during submit | Show retry option, preserve form data |
| Server returns 500 | Show generic error, preserve form data |
| Concurrent task creation | Both tasks created with unique positions |
| Title with special characters | Accepted, characters preserved |
| Title with HTML/script tags | Escaped on display, stored as-is |

## Test Scenarios

- [ ] Create task with title only
- [ ] Create task with title and description
- [ ] Attempt to create task with empty title
- [ ] Attempt to create task with whitespace-only title
- [ ] Create task with exactly 200 character title
- [ ] Attempt to create task with 201 character title
- [ ] Create task with exactly 2000 character description
- [ ] Attempt to create task with 2001 character description
- [ ] Form clears after successful creation
- [ ] New task appears in list after creation
- [ ] Position is correctly auto-assigned
- [ ] Timestamps are set correctly

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| [US0001](US0001-project-setup.md) | Schema | Task model, Pydantic schemas | Complete |

### External Dependencies

None.

## Estimation

**Story Points:** 3

**Complexity:** Low

## Open Questions

None.

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story generated from EP0001 |
