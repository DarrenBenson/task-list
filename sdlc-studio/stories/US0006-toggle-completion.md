# US0006: Toggle Task Completion

> **Status:** Complete
> **Epic:** [EP0002: Task Organisation](../epics/EP0002-task-organisation.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** Busy Parent Sam
**I want** to mark a task as complete with a single click
**So that** I can track my progress and feel satisfaction from completing tasks

## Context

### Persona Reference

**Busy Parent Sam** - Needs quick actions. Completing a task should be instant and satisfying.

[Full persona details](../personas.md#busy-parent-sam)

### Background

Users need to track which tasks are done. A simple click on the checkbox toggles the completion status. Completed tasks remain visible but are visually distinguished.

## Inherited Constraints

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Performance | Completion toggle < 100ms perceived | Optimistic UI update |
| UX | Single click/tap to toggle | Checkbox must be clickable |

### From PRD (via Epic)

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Performance | API responds within 500ms | PATCH must be fast |
| Data | is_complete boolean field | Toggle true/false |

## Acceptance Criteria

### AC1: Checkbox is clickable

- **Given** a task is displayed in the list
- **When** the user clicks the checkbox area
- **Then** the checkbox toggles state (checked/unchecked)
- **And** the click does not open the task detail modal

### AC2: Completion status updates immediately

- **Given** the user clicks an incomplete task's checkbox
- **When** the click is registered
- **Then** the checkbox shows as checked immediately (optimistic UI)
- **And** the API receives PATCH /api/v1/tasks/{id} with `{"is_complete": true}`

### AC3: Completed tasks are visually distinct

- **Given** a task is marked complete
- **When** viewing the task list
- **Then** the task shows with strikethrough text and muted colour

### AC4: Completion status persists

- **Given** a task has been marked complete
- **When** the page is refreshed
- **Then** the task still shows as complete

### AC5: Toggle works both ways

- **Given** a completed task
- **When** the user clicks the checkbox
- **Then** the task becomes incomplete
- **And** the visual distinction is removed

## Scope

### In Scope

- Clickable checkbox on task list items
- PATCH API call to toggle is_complete
- Optimistic UI update
- Visual styling for completed tasks (already exists)

### Out of Scope

- Toggle from detail view (edit mode already handles this)
- Bulk completion
- Undo completion
- Completion statistics

## Technical Notes

### API Contract

Uses existing PATCH endpoint:

**PATCH /api/v1/tasks/{task_id}**

Request:
```json
{
  "is_complete": true
}
```

Response 200: Updated task object

### Implementation Notes

- Checkbox click must stop event propagation to prevent opening detail modal
- Use optimistic UI: update state immediately, revert on error
- Existing completed task styling already in CSS

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Network failure on toggle | Revert checkbox state, show error |
| Task not found (deleted) | Remove from list, show brief notification |
| Rapid clicking | Debounce or disable during API call |

## Test Scenarios

- [ ] Clicking checkbox toggles completion
- [ ] Clicking checkbox does not open modal
- [ ] Completed task shows strikethrough
- [ ] Uncompleting task removes strikethrough
- [ ] Completion persists after refresh
- [ ] Network error reverts toggle

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| [US0003](US0003-view-task-list.md) | UI | Task list component | Complete |
| [US0004](US0004-view-edit-task.md) | API | PATCH endpoint | Complete |

## Estimation

**Story Points:** 2

**Complexity:** Low

## Open Questions

None.

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story created |
