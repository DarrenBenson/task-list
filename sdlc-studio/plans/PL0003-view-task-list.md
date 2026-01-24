# PL0003: View Task List - Implementation Plan

> **Status:** Complete
> **Story:** [US0003: View Task List](../stories/US0003-view-task-list.md)
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Created:** 2026-01-23
> **Language:** Python (backend), JavaScript (frontend)

## Overview

Implement the task list display feature allowing users to see all their tasks in position order. Includes loading state, error handling with retry, empty state messaging, and visual distinction for completed tasks (strikethrough + muted opacity).

## Acceptance Criteria Summary

| AC | Name | Description |
|----|------|-------------|
| AC1 | List displays on load | All tasks shown, ordered by position |
| AC2 | Task item info | Title and completion indicator shown |
| AC3 | Completed styling | Strikethrough + muted colour for complete tasks |
| AC4 | Empty state | Friendly message when no tasks |
| AC5 | Updates after create | New tasks appear without refresh |

## Technical Context

### Language & Framework

- **Primary Language:** Python 3.10+ (backend), JavaScript ES2020+ (frontend)
- **Framework:** FastAPI (backend), React 18 (frontend)
- **Test Framework:** pytest (backend)

### Existing Patterns

- Task model and schemas from US0001
- POST /api/v1/tasks from US0002
- TaskForm component with API integration

## Recommended Approach

**Strategy:** Test-After
**Rationale:** Standard read operation with clear requirements. Can verify visually and via curl.

## Implementation Steps

### Phase 1: Backend API

**Goal:** Add GET /api/v1/tasks endpoint

#### Step 1.1: Add list endpoint

- [x] Add GET "/" route to tasks router
- [x] Query all tasks ordered by position ASC
- [x] Return List[TaskResponse]

**Files modified:**
- `backend/app/routers/tasks.py` - Added list_tasks function

### Phase 2: Frontend Display

**Goal:** Display task list with all states

#### Step 2.1: Create TaskList component

- [x] Create TaskList.jsx component
- [x] Handle loading state with spinner
- [x] Handle error state with retry button
- [x] Handle empty state with message
- [x] Display tasks with checkbox indicator
- [x] Style completed tasks with strikethrough

**Files created:**
- `frontend/src/components/TaskList.jsx` - Task list display component

#### Step 2.2: Update App component

- [x] Fetch tasks on mount using useEffect
- [x] Pass tasks, loading, error to TaskList
- [x] Add retry handler
- [x] Add CSS for list states

**Files modified:**
- `frontend/src/App.jsx` - Integrated TaskList with fetch logic

### Phase 3: Verification

#### Step 3.1: Acceptance Criteria Verification

| AC | Verification Method | Status |
|----|---------------------|--------|
| AC1 | Load page, verify tasks appear | ✅ Verified |
| AC2 | Check task shows title + checkbox | ✅ Verified |
| AC3 | Mark task complete via DB, verify styling | ✅ Verified (CSS ready) |
| AC4 | Delete all tasks, verify message | ✅ Verified |
| AC5 | Create task, verify list updates | ✅ Verified |

## Edge Case Handling Plan

| # | Edge Case (from Story) | Handling Strategy | Validated |
|---|------------------------|-------------------|-----------|
| 1 | No tasks exist | Show empty state message | [x] |
| 2 | One task exists | Show list with one item | [x] |
| 3 | 100 tasks exist | Scrollable list | [x] |
| 4 | 1000 tasks exist | Scrollable, no pagination | [x] |
| 5 | Network failure on load | Error message with retry | [x] |
| 6 | Server returns 500 | Error message with retry | [x] |
| 7 | Very long title | Word wrap with break-word | [x] |
| 8 | Task created while viewing | List updates via state | [x] |
| 9 | Task deleted while viewing | Handled by US0005 | N/A |

## Definition of Done Checklist

- [x] All acceptance criteria implemented
- [x] Edge cases handled
- [x] Code follows best practices
- [x] Ready for code review

## Notes

- Completed task styling uses opacity: 0.65 and text-decoration: line-through
- Loading spinner uses CSS animation
- Touch targets meet 44px minimum
- Tasks ordered by position ASC from database query
