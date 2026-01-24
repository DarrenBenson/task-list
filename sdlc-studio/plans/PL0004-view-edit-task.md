# PL0004: View and Edit Task Details - Implementation Plan

> **Status:** Complete
> **Story:** [US0004: View and Edit Task Details](../stories/US0004-view-edit-task.md)
> **Epic:** [EP0001: Core Task Management](../epics/EP0001-core-task-management.md)
> **Created:** 2026-01-23
> **Language:** Python (backend), JavaScript (frontend)

## Overview

Implement task detail view and editing capability. Users can click a task to view full details (title, description, timestamps) and edit title/description with validation.

## Acceptance Criteria Summary

| AC | Name | Description |
|----|------|-------------|
| AC1 | Detail view accessible | Click task shows title, description, timestamps |
| AC2 | Edit title | Title can be changed and saved via PATCH |
| AC3 | Edit description | Description can be added/changed |
| AC4 | Edit validation | Empty title rejected with error |
| AC5 | Cancel edit | Changes discarded on cancel |
| AC6 | Return to list | Close button returns to list |

## Implementation Steps

### Phase 1: Backend API

**Goal:** Add GET and PATCH endpoints for single task

#### Step 1.1: Add GET /{task_id} endpoint

- [x] Return single task by ID
- [x] Return 404 if not found

#### Step 1.2: Add PATCH /{task_id} endpoint

- [x] Accept partial updates (title and/or description)
- [x] Add whitespace validation to TaskUpdate schema
- [x] Return updated task
- [x] Return 404 if not found

**Files modified:**
- `backend/app/routers/tasks.py` - Added get_task and update_task functions
- `backend/app/schemas.py` - Added whitespace validator to TaskUpdate

### Phase 2: Frontend Modal

**Goal:** Create task detail modal with edit capability

#### Step 2.1: Create TaskDetail component

- [x] Modal with backdrop
- [x] View mode: title, description, status, timestamps
- [x] Edit mode: editable title and description inputs
- [x] Loading state during fetch
- [x] Error handling with 404 detection
- [x] Save and Cancel buttons
- [x] Close button to return to list
- [x] Client-side validation

**Files created:**
- `frontend/src/components/TaskDetail.jsx` - Modal component with view/edit modes

#### Step 2.2: Update TaskList for clickable items

- [x] Add onClick handler to task items
- [x] Add keyboard accessibility (Enter/Space)
- [x] Cursor pointer styling

**Files modified:**
- `frontend/src/components/TaskList.jsx` - Added onTaskClick prop and handlers

#### Step 2.3: Update App to manage modal

- [x] Track selectedTaskId state
- [x] Render TaskDetail when task selected
- [x] Handle task updates in list
- [x] Add modal CSS styles

**Files modified:**
- `frontend/src/App.jsx` - Integrated TaskDetail modal

### Phase 3: Verification

| AC | Verification Method | Status |
|----|---------------------|--------|
| AC1 | Click task, verify modal shows details | ✅ Verified |
| AC2 | Edit title, save, verify list updates | ✅ Verified |
| AC3 | Add description, save, verify stored | ✅ Verified |
| AC4 | Clear title, try save, verify error | ✅ Verified |
| AC5 | Edit, cancel, verify original values | ✅ Verified |
| AC6 | Click close, verify return to list | ✅ Verified |

## Edge Case Handling

| # | Edge Case | Handling | Validated |
|---|-----------|----------|-----------|
| 1 | Task not found (deleted) | 404 shown, close returns to list | [x] |
| 2 | Empty title on save | Client-side error message | [x] |
| 3 | Whitespace-only title | Server-side 422, shown to user | [x] |
| 4 | Title 200 chars | Accepted | [x] |
| 5 | Title 201 chars | Rejected with error | [x] |
| 6 | Description 2001 chars | Rejected with error | [x] |
| 7 | Network failure on save | Error shown, form preserved | [x] |
| 8 | Network failure on load | Error with retry option | [x] |
| 9 | No changes, save clicked | No API call, close edit mode | [x] |

## Definition of Done Checklist

- [x] All acceptance criteria implemented
- [x] Edge cases handled
- [x] Code follows best practices
- [x] Ready for code review

## Notes

- Modal closes when clicking backdrop (only if not editing)
- Timestamps formatted as "23 Jan 2026, 10:30"
- Edit mode preserves description if empty string → null for API
