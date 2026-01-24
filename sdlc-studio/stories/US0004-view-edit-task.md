# US0004: View and Edit Task Details

> **Status:** Complete
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** Organised Ollie
**I want** to view and edit a task's full details
**So that** I can see complete information and correct mistakes

## Context

### Persona Reference

**Organised Ollie** - Methodical, appreciates detail. Wants to see full task information and ability to correct or update tasks as plans change.

[Full persona details](../personas.md#organised-ollie)

### Background

While the list view shows titles, users need to access full task details including descriptions. Ollie might realise they made a typo, or need to add more context to a task. This story combines viewing details and editing to create a cohesive task detail experience.

## Inherited Constraints

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Success Metric | Reliable persistence | Edits must save correctly |
| Risk | Data loss on crash | Save immediately on submit |

### From PRD (via Epic)

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Performance | API responds within 500ms | GET and PATCH must be fast |
| Security | Input validation client and server | Same validation as create |
| Data | Title max 200 chars, description max 2000 chars | Enforce on edit |

## Acceptance Criteria

### AC1: Task detail view is accessible

- **Given** a task exists with title "Call dentist" and description "Book cleaning appointment"
- **When** the user clicks on the task in the list
- **Then** a detail view opens showing:
  - Title: "Call dentist"
  - Description: "Book cleaning appointment"
  - Created timestamp (formatted for readability)
  - Updated timestamp (formatted for readability)
- **And** an edit button/option is visible

### AC2: User can edit task title

- **Given** the user is viewing task details for "Call dentist"
- **When** they enter edit mode and change title to "Call dentist - Dr Smith"
- **And** they save the changes
- **Then** the API receives PATCH /api/v1/tasks/{id} with `{"title": "Call dentist - Dr Smith"}`
- **And** the API returns 200 with updated task
- **And** the task list updates to show new title
- **And** updated_at timestamp is refreshed

### AC3: User can edit task description

- **Given** the user is viewing a task with no description
- **When** they enter edit mode and add description "Book for next Tuesday"
- **And** they save the changes
- **Then** the task is updated with the new description
- **And** updated_at timestamp is refreshed

### AC4: Edit validation is enforced

- **Given** the user is editing a task
- **When** they clear the title field completely
- **And** they attempt to save
- **Then** the form shows "Title is required" error
- **And** the changes are not saved

### AC5: User can cancel edit

- **Given** the user is editing a task and has made changes
- **When** they click cancel/close without saving
- **Then** the changes are discarded
- **And** the task retains its original values

### AC6: User can return to list

- **Given** the user is viewing task details
- **When** they click back/close button
- **Then** they return to the task list view

## Scope

### In Scope

- GET /api/v1/tasks/{id} endpoint
- PATCH /api/v1/tasks/{id} endpoint
- Task detail view/modal component
- Inline editing or edit mode
- Cancel functionality
- Navigation back to list

### Out of Scope

- Completion status toggle (EP0002)
- Task deletion (US0005)
- Viewing/editing position

## UI/UX Requirements

- Detail view can be modal, side panel, or separate view
- Edit mode should be clearly indicated
- Save and Cancel buttons clearly labelled
- Unsaved changes warning if navigating away
- Timestamps formatted as "Created: 23 Jan 2026, 10:30 AM"
- Loading state during API calls

## Technical Notes

### API Contracts

**GET /api/v1/tasks/{task_id}**

Response 200:
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

Response 404:
```json
{
  "detail": "Task not found"
}
```

**PATCH /api/v1/tasks/{task_id}**

Request (partial update):
```json
{
  "title": "Call dentist - Dr Smith"
}
```

or:
```json
{
  "description": "Book for next Tuesday"
}
```

or:
```json
{
  "title": "Call dentist - Dr Smith",
  "description": "Book for next Tuesday"
}
```

Response 200:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Call dentist - Dr Smith",
  "description": "Book for next Tuesday",
  "is_complete": false,
  "position": 1,
  "created_at": "2026-01-23T10:30:00Z",
  "updated_at": "2026-01-23T14:45:00Z"
}
```

Response 422 (validation error):
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "ensure this value has at least 1 character",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

### Data Requirements

- PATCH updates only provided fields
- updated_at auto-updates on any change
- Position and is_complete not editable via this endpoint

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Task not found (deleted by another) | 404 error, show "Task not found", return to list |
| Empty title on save | 422 error, "Title is required" |
| Whitespace-only title | 422 error, "Title cannot be blank" |
| Title exactly 200 chars | Accepted, saved |
| Title 201 chars | 422 error, "Title must be 200 characters or less" |
| Description 2001 chars | 422 error, "Description must be 2000 characters or less" |
| Network failure on save | Show error, preserve unsaved changes |
| Network failure on load | Show error with retry option |
| Concurrent edit by same user in another tab | Last save wins |
| No changes made, save clicked | No API call, just close edit mode |

## Test Scenarios

- [ ] Click task opens detail view
- [ ] Detail view shows title, description, timestamps
- [ ] Task with null description shows appropriately
- [ ] Edit mode can be entered
- [ ] Title can be edited and saved
- [ ] Description can be edited and saved
- [ ] Both title and description can be edited together
- [ ] Empty title is rejected
- [ ] Cancel discards changes
- [ ] Navigation back to list works
- [ ] Task list updates after edit
- [ ] updated_at changes after save
- [ ] 404 handling when task deleted

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| [US0001](US0001-project-setup.md) | Schema | Task model | Complete |
| [US0003](US0003-view-task-list.md) | API | Task list to click from | In Progress |

### External Dependencies

None.

## Estimation

**Story Points:** 3

**Complexity:** Medium

## Open Questions

From PRD (inherited):
- [ ] Should task list display show truncated descriptions or title only? - Owner: Product

## Quality Checklist

### API Stories (minimum requirements)

- [x] Edge cases: 10/8 minimum documented
- [x] Test scenarios: 13/10 minimum listed
- [x] API contracts: Exact request/response JSON shapes documented
- [x] Error codes: All error codes with exact messages specified

### All Stories

- [x] No ambiguous language
- [ ] Open Questions: 0/1 resolved (non-critical)
- [x] Given/When/Then uses concrete values
- [x] Persona referenced with specific context

### Ready Status Gate

- [x] All critical Open Questions resolved
- [x] Minimum edge case count met
- [x] No "TBD" placeholders in acceptance criteria
- [x] Error scenarios documented

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story generated from EP0001 |
