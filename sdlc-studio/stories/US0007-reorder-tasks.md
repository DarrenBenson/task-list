# US0007: Reorder Tasks

> **Status:** Complete
> **Epic:** [EP0002: Task Organisation](../epics/EP0002-task-organisation.md)
> **Owner:** Unassigned
> **Created:** 2026-01-23

## User Story

**As a** user
**I want** to drag and drop tasks to reorder them
**So that** I can prioritise what to work on next

## Context

### Background

Tasks are currently displayed in position order but users cannot change this order. Organised Ollie specifically wants manual control over task order to arrange tasks by personal priority, not algorithmic sorting. The existing `position` field on tasks supports this feature - we need frontend drag-and-drop and an API endpoint to persist new positions.

## Inherited Constraints

### From Epic

| Type | Constraint | Story Impact |
|------|------------|--------------|
| Performance | Drag-and-drop feels instantaneous | Optimistic UI updates required |
| Performance | API responds within 500ms | Bulk reorder endpoint must be fast |
| UX | Visual feedback during drag | Drop target indication needed |

### From PRD (via Epic)

| Type | Constraint | AC Implication |
|------|------------|----------------|
| Performance | NFR-003: Drag-and-drop instantaneous | AC1: Optimistic UI, not wait for API |
| Data | Positions must be unique integers | AC4: Position recalculation |
| Data | Lower position = higher in list | AC2: Maintain sort order |

## Acceptance Criteria

### AC1: User can drag a task to a new position

- **Given** a task list with multiple tasks
- **When** the user drags a task to a new position
- **Then** the task moves to the new position immediately (optimistic UI)
- **And** no page refresh is required

### AC2: Other tasks shift to accommodate the moved task

- **Given** tasks at positions [1, 2, 3, 4]
- **When** task at position 4 is dragged to position 2
- **Then** the task order becomes [1, 4, 2, 3] visually
- **And** positions are recalculated to [1, 2, 3, 4]

### AC3: Visual feedback indicates drop target during drag

- **Given** a task list
- **When** the user is dragging a task
- **Then** the drag source task shows a "dragging" visual state
- **And** the potential drop position shows a visual indicator (line, highlight, or gap)

### AC4: New positions persist after page refresh

- **Given** the user has reordered tasks
- **When** the user refreshes the page
- **Then** tasks display in the new order
- **And** position values are sequential integers (no gaps)

### AC5: API bulk reorder endpoint

- **Given** a valid array of task IDs in new order
- **When** PUT `/api/v1/tasks/reorder` is called with `{ "task_ids": ["id1", "id2", ...] }`
- **Then** all task positions are updated atomically
- **And** response is `200 OK` with updated tasks array

## Scope

### In Scope

- Drag-and-drop reordering via mouse
- Touch drag-and-drop on mobile devices
- Visual drag indicator and drop target
- Optimistic UI updates
- Bulk reorder API endpoint
- Position recalculation algorithm

### Out of Scope

- Keyboard-based reordering (accessibility follow-up)
- Undo/redo for reorder operations
- Drag between lists (only one list exists)
- Animation during position shift

## UI/UX Requirements

- Drag handle visible on each task item (left side)
- Dragged task shows elevated/lifted visual state
- Drop target shows insertion indicator (line or gap)
- Cursor changes to grab/grabbing during drag
- Mobile: Long-press to initiate drag

**Library:** Use `@dnd-kit/core` and `@dnd-kit/sortable` as specified in PRD.

## Technical Notes

### API Contracts

**PUT /api/v1/tasks/reorder**

Request:
```json
{
  "task_ids": ["uuid1", "uuid2", "uuid3", "uuid4"]
}
```

Response (200 OK):
```json
[
  { "id": "uuid1", "title": "...", "position": 1, ... },
  { "id": "uuid2", "title": "...", "position": 2, ... },
  { "id": "uuid3", "title": "...", "position": 3, ... },
  { "id": "uuid4", "title": "...", "position": 4, ... }
]
```

Errors:
- `400 Bad Request`: Invalid task IDs, missing tasks, or duplicate IDs
- `422 Unprocessable Entity`: task_ids array empty or invalid format

### Data Requirements

- Position field already exists on Task model
- Positions must be recalculated to be sequential (1, 2, 3, ...)
- All tasks must be included in reorder request (full list replacement)
- Transaction: All position updates succeed or all fail

### Implementation Approach

1. **Frontend:**
   - Install `@dnd-kit/core` and `@dnd-kit/sortable`
   - Wrap TaskList in `DndContext` and `SortableContext`
   - Make each task item a `useSortable` item
   - On drag end: optimistically update local state, call API
   - On API error: revert to previous order

2. **Backend:**
   - Add `PUT /api/v1/tasks/reorder` endpoint
   - Validate all IDs exist and no duplicates
   - Update positions in transaction
   - Return updated tasks array

## Edge Cases & Error Handling

| Scenario | Expected Behaviour |
|----------|-------------------|
| Drag task to same position | No API call, no state change |
| Network error during reorder | Revert to previous order, show error toast |
| Task deleted by another tab during drag | API returns 400, refresh task list |
| Empty task list | No drag handles shown, nothing to reorder |
| Single task in list | Drag handle shown but no reorder possible |
| Rapid consecutive reorders | Debounce API calls, latest order wins |
| Partial task_ids array | API rejects with 400 (all tasks required) |
| Invalid UUID in task_ids | API rejects with 400 |

## Test Scenarios

- [ ] User can drag a task from position 1 to position 3
- [ ] User can drag a task from position 3 to position 1
- [ ] Dragging to same position does nothing
- [ ] Drop indicator appears at valid drop locations
- [ ] Dragged task has visual "lifted" appearance
- [ ] Reorder persists after page refresh
- [ ] API returns 400 for invalid task_ids
- [ ] API returns 400 for partial task list
- [ ] Frontend reverts on network error
- [ ] Touch drag works on mobile devices
- [ ] Drag handle is clickable/tappable

## Dependencies

### Story Dependencies

| Story | Dependency Type | What's Needed | Status |
|-------|-----------------|---------------|--------|
| [US0003](US0003-view-task-list.md) | Requires | Task list component to add drag to | Complete |

### API Dependencies

| Endpoint | Source Story | How Used |
|----------|--------------|----------|
| GET /api/v1/tasks/ | US0003 | Load tasks for reorder |
| PATCH /api/v1/tasks/{id} | US0004 | Position already patchable (but not bulk) |

### External Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| @dnd-kit/core | npm package | To install |
| @dnd-kit/sortable | npm package | To install |

## Estimation

**Story Points:** 5

**Complexity:** Medium-High

- Drag-and-drop library integration
- Optimistic UI with error recovery
- Bulk position update atomicity

## Open Questions

- [x] Should drag handle be visible always or on hover only? - **Decision:** Always visible (better discoverability, mobile-friendly)

## Quality Checklist

### API Stories (minimum requirements)

- [x] Edge cases: 8/8 minimum documented
- [x] Test scenarios: 11/10 minimum listed
- [x] API contracts: Exact request/response JSON shapes documented
- [x] Error codes: All error codes with exact messages specified

### All Stories

- [x] No ambiguous language
- [x] Open Questions: 1/1 resolved
- [x] Given/When/Then uses concrete values
- [x] Persona referenced with specific context

### Ready Status Gate

This story can be marked **Ready** when:
- [x] All critical Open Questions resolved
- [x] Minimum edge case count met
- [x] No "TBD" placeholders in acceptance criteria
- [x] Error scenarios documented

## Revision History

| Date | Author | Change |
|------|--------|--------|
| 2026-01-23 | Claude | Initial story created for FR-006 |
