# US0003: View Task List

> **Status:** Complete
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** Organised Ollie
**I want** to see all my tasks in an ordered list
**So that** I can understand what needs to be done at a glance

## Context

### Persona Reference

**Organised Ollie** - Methodical, likes clear visual overview. Uses tablet/laptop. Needs persistent, ordered list that shows exactly what they arranged.

[Full persona details](../personas.md#organised-ollie)

### Background

The task list is the primary view. Ollie checks it multiple times daily to review what needs doing. Tasks must display in the order they were arranged (by position), not sorted by date or other criteria. Completed tasks should remain visible but visually distinct.

## Inherited Constraints

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Success Metric | Visual clarity at a glance | Clean, readable list UI |
| Risk | Data persistence | Data must load from database |

### From PRD (via Epic)

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Performance | Frontend renders within 1 second | Fast initial load |
| Performance | API responds within 500ms | GET /tasks must be fast |
| UX | Completed tasks visually distinguished | Strikethrough + muted colour |

## Acceptance Criteria

### AC1: Task list displays on page load

- **Given** the database contains tasks
- **When** the user opens the application
- **Then** all tasks are displayed in a scrollable list
- **And** tasks are ordered by position (ascending)
- **And** the list loads within 1 second

### AC2: Task list item shows key information

- **Given** a task exists with title "Call dentist" and is incomplete
- **When** the task list is displayed
- **Then** the task shows:
  - Title: "Call dentist"
  - Completion status indicator (unchecked checkbox or similar)
  - Position/order is implicit from list placement

### AC3: Completed tasks are visually distinct

- **Given** a task exists with is_complete = true
- **When** the task list is displayed
- **Then** the completed task shows:
  - Title with strikethrough styling
  - Muted/greyed colour
  - Checked completion indicator
- **And** the task remains in its original position

### AC4: Empty state is displayed

- **Given** no tasks exist in the database
- **When** the user opens the application
- **Then** a friendly empty state message is shown
- **And** the message encourages task creation (e.g., "No tasks yet. Add one above!")

### AC5: List updates after task creation

- **Given** the user is viewing the task list
- **When** they create a new task
- **Then** the new task appears at the end of the list immediately
- **And** no page refresh is required

## Scope

### In Scope

- GET /api/v1/tasks endpoint (list all)
- Task list React component
- Individual task list item component
- Empty state display
- Loading state during fetch
- Completed task styling

### Out of Scope

- Task detail view (US0004)
- Task editing (US0004)
- Task deletion (US0005)
- Drag-and-drop reordering (EP0002)
- Completion toggle interaction (EP0002)
- Pagination (not needed for < 1000 tasks)
- Search or filtering

## UI/UX Requirements

- List should be the primary focus of the page
- Each task item should have adequate spacing for readability
- Touch targets should be large enough for tablet use (44x44px minimum)
- Visual hierarchy: title is primary, status indicator secondary
- Completed tasks: strikethrough text + opacity reduction (60-70%)
- Loading state: skeleton loader or spinner

## Technical Notes

### API Contract

**GET /api/v1/tasks**

Response 200:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Call dentist",
    "description": "Book cleaning appointment",
    "is_complete": false,
    "position": 1,
    "created_at": "2026-01-23T10:30:00Z",
    "updated_at": "2026-01-23T10:30:00Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Buy groceries",
    "description": null,
    "is_complete": true,
    "position": 2,
    "created_at": "2026-01-23T09:00:00Z",
    "updated_at": "2026-01-23T11:00:00Z"
  }
]
```

Response is always an array, empty `[]` if no tasks.

### Data Requirements

- Tasks returned sorted by position ASC
- All task fields included in response
- Description may be null

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| No tasks exist | Show empty state message |
| One task exists | Show list with one item |
| 100 tasks exist | Show scrollable list, no pagination |
| 1000 tasks exist | Show scrollable list, verify performance |
| Network failure on load | Show error message with retry button |
| Server returns 500 | Show error message with retry button |
| Very long title (200 chars) | Truncate with ellipsis or wrap |
| Task created while viewing | List updates without refresh |
| Task deleted while viewing | List updates without refresh |

## Test Scenarios

- [ ] Empty list shows empty state message
- [ ] Single task displays correctly
- [ ] Multiple tasks display in position order
- [ ] Completed task shows strikethrough styling
- [ ] Incomplete task shows normal styling
- [ ] List loads within 1 second
- [ ] API returns tasks sorted by position
- [ ] Network error shows error message
- [ ] Retry button works after network error
- [ ] Long title is handled appropriately
- [ ] List updates when task is created

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| [US0001](US0001-project-setup.md) | Schema | Task model, database | Complete |
| [US0002](US0002-create-task.md) | API | Tasks to exist for display | In Progress |

### External Dependencies

None.

## Estimation

**Story Points:** 2

**Complexity:** Low

## Open Questions

None.

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story generated from EP0001 |
