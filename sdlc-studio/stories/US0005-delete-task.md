# US0005: Delete Task

> **Status:** Complete
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** Busy Parent Sam
**I want** to delete a task I no longer need
**So that** my list stays clean and relevant

## Context

### Persona Reference

**Busy Parent Sam** - Needs quick actions but also protection from accidents. Deleting should be easy but not too easy to trigger accidentally.

[Full persona details](../personas.md#busy-parent-sam)

### Background

Tasks become irrelevant - they get done externally, become obsolete, or were added in error. Sam needs to remove these without accidentally deleting the wrong task. A simple confirmation prevents accidental deletions while keeping the interaction quick.

## Inherited Constraints

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Scope | Deletion is permanent (no recycle bin) | Clear warning in confirmation |
| Success Metric | CRUD success rate 100% | Delete must be reliable |

### From PRD (via Epic)

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Performance | API responds within 500ms | DELETE must be fast |
| UX | Confirmation before deletion | Modal or confirm dialog required |

## Acceptance Criteria

### AC1: Delete option is accessible

- **Given** the user is viewing the task list
- **When** they look at a task item
- **Then** a delete option is available (button, icon, or menu item)

### AC2: Confirmation is required

- **Given** the user clicks delete on task "Call dentist"
- **When** the delete action is triggered
- **Then** a confirmation dialog appears with:
  - Task title visible: "Delete 'Call dentist'?"
  - Warning text: "This cannot be undone"
  - Confirm button (e.g., "Delete")
  - Cancel button

### AC3: Confirmed deletion removes task

- **Given** the user has clicked delete and sees the confirmation dialog
- **When** they click "Delete" to confirm
- **Then** the API receives DELETE /api/v1/tasks/{id}
- **And** the API returns 204 No Content
- **And** the task is removed from the database
- **And** the task disappears from the list immediately
- **And** remaining tasks maintain their relative order

### AC4: Cancelled deletion preserves task

- **Given** the user has clicked delete and sees the confirmation dialog
- **When** they click "Cancel"
- **Then** the dialog closes
- **And** the task remains in the list unchanged

### AC5: Delete from detail view

- **Given** the user is viewing task details
- **When** they click delete and confirm
- **Then** the task is deleted
- **And** the user is returned to the task list

## Scope

### In Scope

- DELETE /api/v1/tasks/{id} endpoint
- Delete button/action on task items
- Confirmation dialog component
- Delete option in task detail view
- List update after deletion

### Out of Scope

- Soft delete / recycle bin
- Undo delete
- Bulk delete
- Delete completed tasks action

## UI/UX Requirements

- Delete icon/button should be clearly identifiable but not dominant
- Confirmation dialog should be modal (blocks interaction)
- Confirm button should be styled as destructive (red)
- Cancel should be the default/primary focus to prevent accidental confirm
- Loading state during delete operation
- Smooth animation when task is removed from list

## Technical Notes

### API Contract

**DELETE /api/v1/tasks/{task_id}**

Response 204: No Content (success, empty body)

Response 404:
```json
{
  "detail": "Task not found"
}
```

### Data Requirements

- Delete removes row from database completely
- Other tasks' positions remain unchanged
- No cascading effects (single entity system)

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Task not found (already deleted) | 404 error, show "Task not found", remove from list |
| Network failure on delete | Show error, task remains, user can retry |
| Server returns 500 | Show error message, task remains |
| Click delete, then navigate away | Confirmation dismissed, no action |
| Double-click confirm quickly | Only one delete request sent |
| Delete last task in list | Empty state message appears |
| Delete from detail view | Return to list after deletion |
| Press Escape during confirmation | Dismiss confirmation, cancel delete |

## Test Scenarios

- [ ] Delete button visible on task item
- [ ] Clicking delete shows confirmation dialog
- [ ] Confirmation dialog shows task title
- [ ] Confirmation dialog shows warning text
- [ ] Clicking Cancel closes dialog, task remains
- [ ] Clicking Delete removes task from database
- [ ] Clicking Delete removes task from list immediately
- [ ] Remaining tasks maintain order after deletion
- [ ] Delete from detail view works
- [ ] User returns to list after detail view delete
- [ ] Deleting last task shows empty state
- [ ] 404 handling when task already deleted

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| [US0001](US0001-project-setup.md) | Schema | Task model | Draft |
| [US0003](US0003-view-task-list.md) | UI | Task list to delete from | Draft |
| [US0004](US0004-view-edit-task.md) | UI | Detail view for delete option | Draft |

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
