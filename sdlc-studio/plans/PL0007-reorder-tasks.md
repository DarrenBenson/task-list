# PL0007: Reorder Tasks - Implementation Plan

> **Status:** Complete
> **Story:** [US0007: Reorder Tasks](../stories/US0007-reorder-tasks.md)
> **Epic:** [EP0002: Task Organisation](../epics/EP0002-task-organisation.md)
> **Created:** 2026-01-23
> **Language:** Python (Backend), JavaScript/React (Frontend)

## Overview

Implement drag-and-drop task reordering using @dnd-kit library on frontend and a bulk reorder API endpoint on backend. The feature requires optimistic UI updates for instant feedback and error recovery if the API call fails.

## Acceptance Criteria Summary

| AC | Name | Description |
|----|------|-------------|
| AC1 | Drag to new position | User drags task, it moves immediately (optimistic UI) |
| AC2 | Other tasks shift | Remaining tasks reorder to accommodate moved task |
| AC3 | Visual feedback | Drag source and drop target show visual indicators |
| AC4 | Persistence | Reordered positions persist after page refresh |
| AC5 | API endpoint | PUT /api/v1/tasks/reorder accepts task_ids array |

## Technical Context

### Language & Framework

- **Primary Language:** Python 3.10+ (Backend), JavaScript/JSX (Frontend)
- **Framework:** FastAPI, React 18
- **Test Framework:** pytest (Backend), Playwright (E2E)

### Relevant Best Practices

- Use optimistic UI updates for drag-and-drop (instant feedback)
- Wrap position updates in database transaction
- Validate all task IDs exist before updating
- Use @dnd-kit sensors for mouse and touch support

### Library Documentation (Context7)

Query Context7 for each library before implementation:

| Library | Context7 ID | Query | Key Patterns |
|---------|-------------|-------|--------------|
| @dnd-kit/core | /clauderic/dnd-kit | sortable list reorder | DndContext, useSortable, arrayMove |
| @dnd-kit/sortable | /clauderic/dnd-kit | vertical sortable list | SortableContext, useSortable hook |
| FastAPI | /tiangolo/fastapi | PUT endpoint list validation | Request body with List type |

### Existing Patterns

**Backend patterns (from tasks.py):**
- Router prefix: `/api/v1/tasks`
- Dependency injection: `db: Session = Depends(get_db)`
- HTTP exceptions for errors
- Pydantic schemas for validation
- Return `List[TaskResponse]` for list endpoints

**Frontend patterns (from TaskList.jsx, App.jsx):**
- Tasks stored in App state
- Props drilling for callbacks (onTaskClick, onToggleComplete)
- Optimistic updates with revert on error
- CSS-in-JS via style tag in App.jsx

## Recommended Approach

**Strategy:** Test-After
**Rationale:** Drag-and-drop requires visual/interactive testing. Write backend API tests first, then implement, then E2E tests for frontend integration.

### Test Priority

1. Backend API tests for reorder endpoint (validation, success, errors)
2. E2E tests for drag-and-drop interaction
3. Unit tests for position recalculation logic

### Documentation Updates Required

- [ ] Update API catalogue in PRD appendix
- [ ] Update test-specs registry after tests added

## Implementation Steps

### Phase 1: Backend API

**Goal:** Create PUT /api/v1/tasks/reorder endpoint

#### Step 1.1: Add ReorderRequest schema

- [ ] Create `ReorderRequest` schema with `task_ids: List[str]` field
- [ ] Add validation for non-empty list

**Files to modify:**
- `backend/app/schemas.py` - Add ReorderRequest schema

**Code:**
```python
class ReorderRequest(BaseModel):
    """Schema for reordering tasks."""
    task_ids: List[str] = Field(..., min_length=1)
```

#### Step 1.2: Implement reorder endpoint

- [ ] Add PUT `/reorder` endpoint to tasks router
- [ ] Validate all IDs exist in database
- [ ] Validate no duplicate IDs
- [ ] Validate all tasks included (count matches)
- [ ] Update positions in transaction (1, 2, 3, ...)
- [ ] Return updated tasks array sorted by position

**Files to modify:**
- `backend/app/routers/tasks.py` - Add reorder endpoint

**Considerations:**
- Use single transaction for atomicity
- Return 400 for validation errors (missing IDs, duplicates)
- Return 422 for malformed request body

#### Step 1.3: Write backend tests

- [ ] Test valid reorder returns 200 with updated tasks
- [ ] Test missing task ID returns 400
- [ ] Test duplicate IDs return 400
- [ ] Test partial list returns 400
- [ ] Test empty list returns 422
- [ ] Test positions are sequential after reorder

**Files to modify:**
- `backend/tests/test_api_tasks.py` - Add TestReorderTasks class

### Phase 2: Frontend Implementation

**Goal:** Add drag-and-drop to TaskList using @dnd-kit

#### Step 2.1: Install @dnd-kit packages

- [ ] Run `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

**Files to modify:**
- `frontend/package.json` - Dependencies added automatically

#### Step 2.2: Create SortableTaskItem component

- [ ] Create new component wrapping task item with useSortable
- [ ] Add drag handle element
- [ ] Apply transform and transition styles from useSortable

**Files to create:**
- `frontend/src/components/SortableTaskItem.jsx`

#### Step 2.3: Update TaskList with DnD context

- [ ] Import DndContext and SortableContext from @dnd-kit
- [ ] Wrap task list in contexts
- [ ] Handle onDragEnd event
- [ ] Call onReorder prop with new order

**Files to modify:**
- `frontend/src/components/TaskList.jsx` - Add DnD wrapper

#### Step 2.4: Add reorder handler to App

- [ ] Add `handleReorder` function with optimistic update
- [ ] Call API with new task_ids order
- [ ] Revert on error
- [ ] Pass handler to TaskList

**Files to modify:**
- `frontend/src/App.jsx` - Add handleReorder, pass to TaskList

#### Step 2.5: Add drag-and-drop CSS

- [ ] Style drag handle (always visible)
- [ ] Style dragging state (elevated, semi-transparent)
- [ ] Style drop indicator

**Files to modify:**
- `frontend/src/App.jsx` - Add CSS in style tag

### Phase 3: Testing & Validation

**Goal:** Verify all acceptance criteria are met

#### Step 3.1: Backend Unit Tests

- [ ] Write tests for reorder endpoint in test_api_tasks.py
- [ ] Ensure edge cases covered (empty, duplicates, missing)

#### Step 3.2: E2E Tests

- [ ] Test drag task from position 1 to 3
- [ ] Test drag task from position 3 to 1
- [ ] Test reorder persists after refresh
- [ ] Test visual feedback during drag

**Files to create:**
- `frontend/e2e/task-reorder.spec.js`

#### Step 3.3: Acceptance Criteria Verification

| AC | Verification Method | Status |
|----|---------------------|--------|
| AC1 | E2E test: drag moves task immediately | Pending |
| AC2 | E2E test: other tasks shift | Pending |
| AC3 | E2E test: visual indicators present | Pending |
| AC4 | E2E test: refresh preserves order | Pending |
| AC5 | API test: PUT /reorder works | Pending |

## Edge Case Handling Plan

Every edge case from the Story MUST appear here with an explicit handling strategy.

### Edge Case Coverage

| # | Edge Case (from Story) | Handling Strategy | Implementation Phase | Validated |
|---|------------------------|-------------------|---------------------|-----------|
| 1 | Drag task to same position | Check if order changed before API call; skip if same | Phase 2.4 | [ ] |
| 2 | Network error during reorder | Catch error, revert to previous order, show error | Phase 2.4 | [ ] |
| 3 | Task deleted by another tab | API returns 400, catch and refresh task list | Phase 2.4 | [ ] |
| 4 | Empty task list | TaskList already handles empty state; no drag context needed | Phase 2.3 | [ ] |
| 5 | Single task in list | Drag handle shown but onDragEnd won't change order | Phase 2.3 | [ ] |
| 6 | Rapid consecutive reorders | Debounce not needed - each drag completes before next | Phase 2.4 | [ ] |
| 7 | Partial task_ids array | API validates count matches DB; returns 400 | Phase 1.2 | [ ] |
| 8 | Invalid UUID in task_ids | API validates all IDs exist; returns 400 | Phase 1.2 | [ ] |

### Coverage Summary

- Story edge cases: 8
- Handled in plan: 8
- Unhandled: 0

### Edge Case Implementation Notes

- Network error recovery uses same pattern as handleToggleComplete
- API validation happens before any database changes
- Frontend validates order changed before calling API (optimisation)

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| @dnd-kit API changes | Medium | Pin version in package.json |
| Touch events not working | Medium | Use @dnd-kit sensors (handles touch automatically) |
| Position collision race condition | Low | Single user system, last write wins |

## Dependencies

| Dependency | Type | Notes |
|------------|------|-------|
| @dnd-kit/core | npm | Install in Phase 2.1 |
| @dnd-kit/sortable | npm | Install in Phase 2.1 |
| @dnd-kit/utilities | npm | For arrayMove helper |
| US0003 (Task List) | Story | Complete - TaskList component exists |

## Open Questions

None - all questions resolved in story.

## Definition of Done Checklist

- [ ] All acceptance criteria implemented
- [ ] Backend API tests written and passing
- [ ] E2E tests written and passing
- [ ] Edge cases handled
- [ ] Code follows existing patterns
- [ ] No linting errors
- [ ] Story status updated to Complete
- [ ] Test spec updated with new test cases

## Notes

- Use `arrayMove` from @dnd-kit/utilities for reordering array
- DndContext sensors default to mouse and touch - no extra config needed
- Position values in DB will always be sequential (1, 2, 3...) after reorder
